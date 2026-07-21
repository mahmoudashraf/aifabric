create extension if not exists pgcrypto with schema extensions;

create table public.bootcamps (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 3 and 180),
  description text not null check (char_length(description) between 20 and 2000),
  cohort_label text not null check (char_length(cohort_label) between 3 and 80),
  teaching_language text not null check (teaching_language in ('ar', 'en')),
  status text not null check (status in ('active', 'coming_soon', 'closed')),
  registration_mode text not null check (registration_mode in ('invitation', 'interest')),
  benefits jsonb not null default '[]'::jsonb check (jsonb_typeof(benefits) = 'array'),
  invitation_code_hash text check (
    invitation_code_hash is null or invitation_code_hash ~ '^[a-f0-9]{64}$'
  ),
  starts_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (registration_mode = 'invitation' and invitation_code_hash is not null)
    or (registration_mode = 'interest' and invitation_code_hash is null)
  )
);

create table public.bootcamp_enrollments (
  id uuid primary key default gen_random_uuid(),
  bootcamp_id uuid not null references public.bootcamps(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  contact_email text not null check (char_length(contact_email) between 3 and 255),
  phone_e164 text not null check (phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  whatsapp_consent boolean not null check (whatsapp_consent),
  consented_at timestamptz not null default now(),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bootcamp_id, user_id)
);

create index bootcamp_enrollments_user_idx
  on public.bootcamp_enrollments (user_id, joined_at desc);

create table public.bootcamp_interest (
  id uuid primary key default gen_random_uuid(),
  bootcamp_id uuid not null references public.bootcamps(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  contact_email text not null check (char_length(contact_email) between 3 and 255),
  phone_e164 text check (phone_e164 is null or phone_e164 ~ '^\+[1-9][0-9]{7,14}$'),
  email_consent boolean not null check (email_consent),
  whatsapp_consent boolean not null default false,
  consented_at timestamptz not null default now(),
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bootcamp_id, contact_email),
  check (phone_e164 is not null or not whatsapp_consent),
  check (phone_e164 is null or whatsapp_consent)
);

create index bootcamp_interest_bootcamp_idx
  on public.bootcamp_interest (bootcamp_id, registered_at desc);

create or replace function public.set_bootcamp_updated_at()
returns trigger
language plpgsql
set search_path = pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_bootcamps_updated_at
  before update on public.bootcamps
  for each row execute function public.set_bootcamp_updated_at();

create trigger set_bootcamp_enrollments_updated_at
  before update on public.bootcamp_enrollments
  for each row execute function public.set_bootcamp_updated_at();

create trigger set_bootcamp_interest_updated_at
  before update on public.bootcamp_interest
  for each row execute function public.set_bootcamp_updated_at();

alter table public.bootcamps enable row level security;
alter table public.bootcamp_enrollments enable row level security;
alter table public.bootcamp_interest enable row level security;

revoke all on public.bootcamps from anon, authenticated;
revoke all on public.bootcamp_enrollments from anon, authenticated;
revoke all on public.bootcamp_interest from anon, authenticated;

create or replace function public.list_bootcamps()
returns table (
  id uuid,
  slug text,
  title text,
  description text,
  cohort_label text,
  teaching_language text,
  status text,
  registration_mode text,
  benefits jsonb,
  starts_at timestamptz,
  enrolled boolean
)
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    b.id,
    b.slug,
    b.title,
    b.description,
    b.cohort_label,
    b.teaching_language,
    b.status,
    b.registration_mode,
    b.benefits,
    b.starts_at,
    exists (
      select 1
      from public.bootcamp_enrollments e
      where e.bootcamp_id = b.id
        and e.user_id = auth.uid()
    ) as enrolled
  from public.bootcamps b
  where b.status in ('active', 'coming_soon')
  order by case b.status when 'active' then 0 else 1 end, b.created_at;
$$;

create or replace function public.get_my_bootcamp_enrollment(p_bootcamp_slug text)
returns table (
  enrollment_id uuid,
  bootcamp_id uuid,
  bootcamp_slug text,
  contact_email text,
  phone_e164 text,
  whatsapp_consent boolean,
  joined_at timestamptz
)
language sql
stable
security definer
set search_path = pg_catalog
as $$
  select
    e.id,
    e.bootcamp_id,
    b.slug,
    e.contact_email,
    e.phone_e164,
    e.whatsapp_consent,
    e.joined_at
  from public.bootcamp_enrollments e
  join public.bootcamps b on b.id = e.bootcamp_id
  where auth.uid() is not null
    and e.user_id = auth.uid()
    and b.slug = lower(trim(p_bootcamp_slug));
$$;

create or replace function public.redeem_bootcamp_invitation(
  p_bootcamp_slug text,
  p_invitation_code text,
  p_phone text,
  p_whatsapp_consent boolean
)
returns table (
  enrollment_id uuid,
  bootcamp_id uuid,
  bootcamp_slug text,
  contact_email text,
  phone_e164 text,
  whatsapp_consent boolean,
  joined_at timestamptz
)
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_user_id uuid := auth.uid();
  v_bootcamp public.bootcamps%rowtype;
  v_enrollment public.bootcamp_enrollments%rowtype;
  v_email text;
  v_phone text;
  v_code_hash text;
begin
  if v_user_id is null then
    raise exception using errcode = 'P0001', message = 'Authentication is required to join this bootcamp.';
  end if;

  select b.*
  into v_bootcamp
  from public.bootcamps b
  where b.slug = lower(trim(p_bootcamp_slug))
  for update;

  if not found then
    raise exception using errcode = 'P0001', message = 'Bootcamp not found.';
  end if;

  if v_bootcamp.status <> 'active' or v_bootcamp.registration_mode <> 'invitation' then
    raise exception using errcode = 'P0001', message = 'This bootcamp is not accepting invitation registrations.';
  end if;

  if p_invitation_code is null or char_length(trim(p_invitation_code)) not between 4 and 128 then
    raise exception using errcode = 'P0001', message = 'Enter a valid invitation code.';
  end if;

  v_code_hash := encode(extensions.digest(upper(trim(p_invitation_code)), 'sha256'), 'hex');
  if v_code_hash <> v_bootcamp.invitation_code_hash then
    raise exception using errcode = 'P0001', message = 'The invitation code is not valid for this bootcamp.';
  end if;

  select lower(u.email)
  into v_email
  from auth.users u
  where u.id = v_user_id;

  if v_email is null or char_length(v_email) not between 3 and 255 then
    raise exception using errcode = 'P0001', message = 'Your signed-in account must provide a contact email.';
  end if;

  v_phone := regexp_replace(trim(coalesce(p_phone, '')), '[\s().-]', '', 'g');
  if v_phone !~ '^\+[1-9][0-9]{7,14}$' then
    raise exception using errcode = 'P0001', message = 'Enter the phone number in international format, for example +447700900123.';
  end if;

  if coalesce(p_whatsapp_consent, false) is not true then
    raise exception using errcode = 'P0001', message = 'WhatsApp communication consent is required for this cohort.';
  end if;

  insert into public.bootcamp_enrollments (
    bootcamp_id,
    user_id,
    contact_email,
    phone_e164,
    whatsapp_consent
  ) values (
    v_bootcamp.id,
    v_user_id,
    v_email,
    v_phone,
    true
  )
  on conflict on constraint bootcamp_enrollments_bootcamp_id_user_id_key do update
  set contact_email = excluded.contact_email,
      phone_e164 = excluded.phone_e164,
      whatsapp_consent = excluded.whatsapp_consent,
      consented_at = now(),
      updated_at = now()
  returning * into v_enrollment;

  return query
  select
    v_enrollment.id,
    v_enrollment.bootcamp_id,
    v_bootcamp.slug,
    v_enrollment.contact_email,
    v_enrollment.phone_e164,
    v_enrollment.whatsapp_consent,
    v_enrollment.joined_at;
end;
$$;

create or replace function public.register_bootcamp_interest(
  p_bootcamp_slug text,
  p_contact_email text,
  p_phone text default null,
  p_email_consent boolean default false,
  p_whatsapp_consent boolean default false,
  p_website text default null
)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog
as $$
declare
  v_bootcamp public.bootcamps%rowtype;
  v_email text := lower(trim(coalesce(p_contact_email, '')));
  v_phone text;
begin
  if nullif(trim(coalesce(p_website, '')), '') is not null then
    return true;
  end if;

  select b.*
  into v_bootcamp
  from public.bootcamps b
  where b.slug = lower(trim(p_bootcamp_slug));

  if not found then
    raise exception using errcode = 'P0001', message = 'Bootcamp not found.';
  end if;

  if v_bootcamp.status <> 'coming_soon' or v_bootcamp.registration_mode <> 'interest' then
    raise exception using errcode = 'P0001', message = 'This bootcamp is not accepting interest registrations.';
  end if;

  if char_length(v_email) not between 5 and 255
      or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception using errcode = 'P0001', message = 'Enter a valid email address.';
  end if;

  if coalesce(p_email_consent, false) is not true then
    raise exception using errcode = 'P0001', message = 'Email communication consent is required.';
  end if;

  v_phone := nullif(regexp_replace(trim(coalesce(p_phone, '')), '[\s().-]', '', 'g'), '');
  if v_phone is not null and v_phone !~ '^\+[1-9][0-9]{7,14}$' then
    raise exception using errcode = 'P0001', message = 'Enter the phone number in international format, for example +447700900123.';
  end if;

  if v_phone is not null and coalesce(p_whatsapp_consent, false) is not true then
    raise exception using errcode = 'P0001', message = 'Enable WhatsApp consent or remove the phone number.';
  end if;

  insert into public.bootcamp_interest (
    bootcamp_id,
    user_id,
    contact_email,
    phone_e164,
    email_consent,
    whatsapp_consent
  ) values (
    v_bootcamp.id,
    auth.uid(),
    v_email,
    v_phone,
    true,
    v_phone is not null
  )
  on conflict (bootcamp_id, contact_email) do update
  set user_id = coalesce(excluded.user_id, public.bootcamp_interest.user_id),
      phone_e164 = coalesce(excluded.phone_e164, public.bootcamp_interest.phone_e164),
      email_consent = true,
      whatsapp_consent = public.bootcamp_interest.whatsapp_consent or excluded.whatsapp_consent,
      consented_at = now(),
      updated_at = now();

  return true;
end;
$$;

revoke all on function public.list_bootcamps() from public;
revoke all on function public.get_my_bootcamp_enrollment(text) from public;
revoke all on function public.redeem_bootcamp_invitation(text, text, text, boolean) from public;
revoke all on function public.register_bootcamp_interest(text, text, text, boolean, boolean, text) from public;

grant execute on function public.list_bootcamps() to anon, authenticated;
grant execute on function public.get_my_bootcamp_enrollment(text) to authenticated;
grant execute on function public.redeem_bootcamp_invitation(text, text, text, boolean) to authenticated;
grant execute on function public.register_bootcamp_interest(text, text, text, boolean, boolean, text) to anon, authenticated;

insert into public.bootcamps (
  id,
  slug,
  title,
  description,
  cohort_label,
  teaching_language,
  status,
  registration_mode,
  benefits,
  invitation_code_hash
) values
  (
    '530b2819-3139-418d-ba77-64768c52f7e6',
    'ai-enabled-java-arabic',
    'Build AI-Enabled Applications with Java and Spring Boot',
    'An instructor-led AI Fabric bootcamp for Java and Spring Boot developers. Build practical AI capabilities through live lectures, guided labs, and a supported capstone project.',
    'Arabic cohort',
    'ar',
    'active',
    'invitation',
    '["Live instructor-led lectures", "Guided hands-on labs", "Capstone project guidance", "Practical AI Fabric adoption for Java developers"]'::jsonb,
    '794a459879e49a81d05eae19b7d5e4b394775c25211c32901344bc6ed738f600'
  ),
  (
    '7db6031d-9d2d-41ad-b819-d9dca3b5901f',
    'ai-enabled-java-english',
    'Build AI-Enabled Applications with Java and Spring Boot',
    'A guided English-language AI Fabric bootcamp for Java and Spring Boot developers who want a practical path from application data to retrieval, governed actions, memory, privacy, and production testing.',
    'English cohort',
    'en',
    'coming_soon',
    'interest',
    '["Live instructor-led lectures", "Guided hands-on labs", "Capstone project guidance", "Practical AI Fabric adoption for Java developers"]'::jsonb,
    null
  )
on conflict (slug) do update
set title = excluded.title,
    description = excluded.description,
    cohort_label = excluded.cohort_label,
    teaching_language = excluded.teaching_language,
    status = excluded.status,
    registration_mode = excluded.registration_mode,
    benefits = excluded.benefits,
    invitation_code_hash = excluded.invitation_code_hash,
    updated_at = now();
