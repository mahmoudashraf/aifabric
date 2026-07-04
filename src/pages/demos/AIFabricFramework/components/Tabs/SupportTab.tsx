import { Headphones, Loader2, RefreshCw, Send } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { SupportTicket } from "../../types";

interface SupportTabProps {
  tickets: SupportTicket[];
  isLoading: boolean;
  onRefresh: () => void;
  onAskAI: (query: string) => void;
}

export function SupportTab({ tickets, isLoading, onRefresh, onAskAI }: SupportTabProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2">
              <Headphones className="h-5 w-5 text-slate-600" />
              Support Tickets
            </CardTitle>
            <Button size="sm" variant="outline" onClick={onRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin sm:mr-2" /> : <RefreshCw className="h-4 w-4 sm:mr-2" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-lg border border-dashed px-4 py-12 text-center text-muted-foreground">
              No support tickets for this demo user yet.
            </div>
          ) : (
            <div className="space-y-3">
              {tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-lg border px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="font-semibold">{ticket.issueType}</div>
                    <Badge variant={ticket.status === "CLOSED" ? "secondary" : "default"}>{ticket.status || "OPEN"}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{ticket.description}</p>
                  {ticket.orderNumber && (
                    <div className="mt-2 text-xs font-semibold text-muted-foreground">Order {ticket.orderNumber}</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Support Scenarios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAskAI("I need help with a delayed order. Review my orders and create a support ticket if needed.")}
          >
            <Send className="mr-2 h-4 w-4" />
            Delayed order
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAskAI("I received the wrong item. Help me open a support ticket with the right issue type.")}
          >
            <Send className="mr-2 h-4 w-4" />
            Wrong item
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => onAskAI("Explain what support ticket information you need before creating a ticket.")}
          >
            <Send className="mr-2 h-4 w-4" />
            Ask first
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
