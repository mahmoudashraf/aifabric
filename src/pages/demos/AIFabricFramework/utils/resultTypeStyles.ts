import {
  CheckCircle2,
  Ban,
  Info,
  HelpCircle,
  AlertCircle,
  AlertTriangle,
  Zap,
  XCircle,
  LucideIcon,
} from "lucide-react";
import type { ResultType } from "../types";

export interface ResultTypeStyle {
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
  label: string;
  hideBadge: boolean;
}

export const getResultTypeStyles = (resultType?: ResultType): ResultTypeStyle => {
  switch (resultType) {
    case "ACTION_EXECUTED":
      return {
        icon: CheckCircle2,
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/30",
        textColor: "text-green-700",
        iconColor: "text-green-600",
        badgeBg: "bg-green-500/20",
        badgeText: "text-green-700",
        label: "Action Executed",
        hideBadge: false,
      };
    case "ACTION_DENIED":
      return {
        icon: Ban,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700",
        iconColor: "text-red-600",
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-700",
        label: "Action Denied",
        hideBadge: false,
      };
    case "INFORMATION_PROVIDED":
      return {
        icon: Info,
        bgColor: "bg-muted",
        borderColor: "border-transparent",
        textColor: "text-foreground",
        iconColor: "text-muted-foreground",
        badgeBg: "bg-transparent",
        badgeText: "text-muted-foreground",
        label: "Information",
        hideBadge: true,
      };
    case "CONFIRMATION_REQUIRED":
      return {
        icon: HelpCircle,
        bgColor: "bg-yellow-500/10",
        borderColor: "border-yellow-500/30",
        textColor: "text-yellow-700",
        iconColor: "text-yellow-600",
        badgeBg: "bg-yellow-500/20",
        badgeText: "text-yellow-700",
        label: "Confirmation Required",
        hideBadge: false,
      };
    case "CLARIFICATION_REQUIRED":
      return {
        icon: AlertCircle,
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/30",
        textColor: "text-orange-700",
        iconColor: "text-orange-600",
        badgeBg: "bg-orange-500/20",
        badgeText: "text-orange-700",
        label: "Clarification Needed",
        hideBadge: false,
      };
    case "OUT_OF_SCOPE":
      return {
        icon: AlertTriangle,
        bgColor: "bg-gray-500/10",
        borderColor: "border-gray-500/30",
        textColor: "text-gray-700",
        iconColor: "text-gray-600",
        badgeBg: "bg-gray-500/20",
        badgeText: "text-gray-700",
        label: "Out of Scope",
        hideBadge: false,
      };
    case "COMPOUND_HANDLED":
      return {
        icon: Zap,
        bgColor: "bg-purple-500/10",
        borderColor: "border-purple-500/30",
        textColor: "text-purple-700",
        iconColor: "text-purple-600",
        badgeBg: "bg-purple-500/20",
        badgeText: "text-purple-700",
        label: "Compound Action",
        hideBadge: false,
      };
    case "ERROR":
      return {
        icon: XCircle,
        bgColor: "bg-red-500/10",
        borderColor: "border-red-500/30",
        textColor: "text-red-700",
        iconColor: "text-red-600",
        badgeBg: "bg-red-500/20",
        badgeText: "text-red-700",
        label: "Error",
        hideBadge: false,
      };
    default:
      return {
        icon: Info,
        bgColor: "bg-muted",
        borderColor: "border-transparent",
        textColor: "text-foreground",
        iconColor: "text-muted-foreground",
        badgeBg: "bg-transparent",
        badgeText: "text-muted-foreground",
        label: "Response",
        hideBadge: true,
      };
  }
};
