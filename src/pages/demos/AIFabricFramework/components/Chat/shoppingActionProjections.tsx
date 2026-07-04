import { CheckCircle2, Headphones, ReceiptText, ShoppingCart, Tag } from "lucide-react";

import type { ActionProjectionInput, DemoActionProjection } from "../../types";

const isRecord = (value: unknown): value is Record<string, any> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const hasAny = (data: Record<string, any>, keys: string[]) =>
  keys.some((key) => data[key] !== undefined && data[key] !== null && data[key] !== "");

const formatMoney = (value: unknown, currency?: string) => {
  if (value === undefined || value === null || value === "") return undefined;
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

const renderRow = (label: string, value: unknown) => {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</span>
      <span className="max-w-[70%] text-right text-sm font-semibold text-slate-950 dark:text-slate-100">{String(value)}</span>
    </div>
  );
};

const extractData = ({ data }: ActionProjectionInput) => (isRecord(data) ? data : {});

const canRenderCart = (input: ActionProjectionInput) => {
  const data = extractData(input);
  return hasAny(data, ["cartId", "itemsCount", "items", "subtotal", "discount", "total", "couponCode"]);
};

const canRenderOrder = (input: ActionProjectionInput) => {
  const data = extractData(input);
  return hasAny(data, ["orderNumber", "orderId", "totalPrice"]) && !canRenderCart(input);
};

const canRenderTicket = (input: ActionProjectionInput) => {
  const data = extractData(input);
  return hasAny(data, ["ticketId", "issueType"]) && !canRenderCart(input) && !canRenderOrder(input);
};

const renderCart = (input: ActionProjectionInput) => {
  const data = extractData(input);
  const items = Array.isArray(data.items) ? data.items : [];
  const itemCount = data.itemsCount ?? items.length;
  const currency = String(data.currency || "USD");
  const total = formatMoney(data.total, currency);
  const subtotal = formatMoney(data.subtotal, currency);
  const discount = formatMoney(data.discount, currency);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border-2 border-emerald-200 bg-white shadow-sm dark:border-emerald-800 dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-emerald-100 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <ShoppingCart className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-emerald-950 dark:text-emerald-100">Active Cart</div>
          <div className="text-xs text-emerald-800 dark:text-emerald-300">
            {itemCount ? `${itemCount} item${Number(itemCount) === 1 ? "" : "s"}` : "No items"}{total ? `, ${total}` : ""}
          </div>
        </div>
        {data.couponCode && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-white px-2.5 py-1 text-xs font-bold text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
            <Tag className="h-3 w-3" />
            {data.couponCode}
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="grid gap-2 sm:grid-cols-2">
          {renderRow("Cart", data.cartId)}
          {renderRow("Status", data.status)}
          {renderRow("Subtotal", subtotal)}
          {renderRow("Discount", discount)}
          {renderRow("Total", total)}
        </div>
        {items.length > 0 && (
          <div className="space-y-2 pt-2">
            {items.slice(0, 4).map((item: any, index: number) => (
              <div key={item.id || item.sku || index} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-900">
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-950 dark:text-slate-100">{item.productName || item.sku || "Cart item"}</div>
                  {item.sku && <div className="text-xs text-slate-500 dark:text-slate-400">{item.sku}</div>}
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-semibold text-slate-950 dark:text-slate-100">x{item.quantity || 1}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{formatMoney(item.totalPrice, currency)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const renderOrder = (input: ActionProjectionInput) => {
  const data = extractData(input);
  const currency = String(data.currency || "USD");

  return (
    <div className="mt-3 overflow-hidden rounded-xl border-2 border-blue-200 bg-white shadow-sm dark:border-blue-800 dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <ReceiptText className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-blue-950 dark:text-blue-100">Order Created</div>
          <div className="text-xs text-blue-800 dark:text-blue-300">{data.orderNumber || data.orderId || "Purchase order"}</div>
        </div>
        <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-300" />
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {renderRow("Order", data.orderNumber || data.orderId)}
        {renderRow("Status", data.status)}
        {renderRow("Total", formatMoney(data.totalPrice, currency))}
      </div>
    </div>
  );
};

const renderTicket = (input: ActionProjectionInput) => {
  const data = extractData(input);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border-2 border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-700 text-white">
          <Headphones className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-bold text-slate-950 dark:text-slate-100">Support Ticket Created</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">{data.issueType || "Support issue"}</div>
        </div>
        <CheckCircle2 className="h-5 w-5 text-slate-600 dark:text-slate-300" />
      </div>
      <div className="grid gap-2 p-4 sm:grid-cols-2">
        {renderRow("Ticket", data.ticketId)}
        {renderRow("Status", data.status)}
        {renderRow("Issue", data.issueType)}
      </div>
    </div>
  );
};

export const shoppingActionProjections: DemoActionProjection[] = [
  {
    id: "shopping-cart",
    canRender: canRenderCart,
    render: renderCart,
  },
  {
    id: "shopping-order",
    canRender: canRenderOrder,
    render: renderOrder,
  },
  {
    id: "shopping-support-ticket",
    canRender: canRenderTicket,
    render: renderTicket,
  },
];
