export interface DemoWalkthroughVideo {
  language: string;
  languageLabel: string;
  videoId: string;
  title: string;
  durationLabel: string;
}

export interface DemoVideoIntroConfig {
  id: string;
  demoName: string;
  description: string;
  videos: DemoWalkthroughVideo[];
}

export const DEMO_VIDEO_PLAYLIST_URL = "https://www.youtube.com/playlist?list=PLTs8YvUItS5E";

export const demoVideoDismissalKey = (demoId: string) => `ai-fabric-demo-video-dismissed:${demoId}`;

export const demoVideoCatalog = {
  accountResolver: {
    id: "account-resolver",
    demoName: "AI Fabric Account Resolver",
    description:
      "See AI Fabric inspect account context, retrieve policies, propose a governed resolution, and wait for confirmation before the application executes it.",
    videos: [
      {
        language: "en",
        languageLabel: "English",
        videoId: "GJ9H16eMdO0",
        title: "AI Fabric Account Resolver walkthrough",
        durationLabel: "39 seconds",
      },
    ],
  },
  shopping: {
    id: "shopping-experience",
    demoName: "AI Shopping Experience",
    description:
      "See product evidence, natural-language comparison, chat context, and confirmation-gated cart actions working through a real AI Fabric application.",
    videos: [
      {
        language: "en",
        languageLabel: "English",
        videoId: "xnLuz-mlKMY",
        title: "AI Shopping Experience walkthrough in English",
        durationLabel: "1 minute 22 seconds",
      },
      {
        language: "ar",
        languageLabel: "العربية",
        videoId: "PMRN4xA874Y",
        title: "AI Shopping Experience walkthrough in Arabic",
        durationLabel: "2 minutes 9 seconds",
      },
    ],
  },
  privacyShield: {
    id: "privacy-shield",
    demoName: "AI Fabric Privacy Shield",
    description:
      "See sensitive information detected and redacted before approved content is persisted, indexed, or returned through a support workflow.",
    videos: [
      {
        language: "en",
        languageLabel: "English",
        videoId: "YfphOu_vmqw",
        title: "AI Fabric Privacy Shield walkthrough",
        durationLabel: "38 seconds",
      },
    ],
  },
  tenantGuard: {
    id: "tenant-guard",
    demoName: "AI Fabric Tenant Guard",
    description:
      "See tenant identity, metadata filters, role visibility, governed writes, and isolation evidence applied to a multi-tenant AI workflow.",
    videos: [
      {
        language: "en",
        languageLabel: "English",
        videoId: "NUkfSdQeVnc",
        title: "AI Fabric Tenant Guard walkthrough",
        durationLabel: "1 minute 21 seconds",
      },
    ],
  },
  behaviorSignals: {
    id: "behavior-signals",
    demoName: "AI Fabric Behavior Signals",
    description:
      "See raw application events become persisted behavior insight and drive a user-specific, backend-validated interface composition.",
    videos: [
      {
        language: "en",
        languageLabel: "English",
        videoId: "yvvi4YEWSq4",
        title: "AI Fabric Behavior Signals walkthrough",
        durationLabel: "1 minute 9 seconds",
      },
    ],
  },
} satisfies Record<string, DemoVideoIntroConfig>;
