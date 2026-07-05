"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  RotateCcw,
  Trash2,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import {
  MessageRecord,
  MessageStatus,
  loadMessages,
  saveMessages,
} from "@/lib/storage";

const tabs: { key: "all" | MessageStatus; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "sent", label: "Sent" },
  { key: "failed", label: "Failed" },
];

export default function MessagesPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | MessageStatus>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setMessages(loadMessages());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveMessages(messages);
  }, [messages, loaded]);

  const counts = useMemo(() => {
    return {
      all: messages.length,
      pending: messages.filter((m) => m.status === "pending").length,
      sent: messages.filter((m) => m.status === "sent").length,
      failed: messages.filter((m) => m.status === "failed").length,
    };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    const q = search.trim().toLowerCase();
    const sorted = [...messages].sort(
      (a, b) => new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime()
    );
    return sorted.filter((m) => {
      const matchesTab = activeTab === "all" || m.status === activeTab;
      const matchesSearch =
        !q ||
        m.guestName.toLowerCase().includes(q) ||
        m.room.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q);
      return matchesTab && matchesSearch;
    });
  }, [messages, activeTab, search]);

  function retryMessage(id: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: "pending" as MessageStatus, failReason: null } : m
      )
    );
  }

  function cancelMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function statusBadge(status: MessageStatus) {
    const config: Record<MessageStatus, { label: string; className: string; icon: React.ReactNode }> = {
      pending: {
        label: "Pending",
        className: "bg-blue-500/10 text-blue-600",
        icon: <Clock size={12} />,
      },
      sent: {
        label: "Sent",
        className: "bg-green-500/10 text-green-600",
        icon: <CheckCircle2 size={12} />,
      },
      failed: {
        label: "Failed",
        className: "bg-red-500/10 text-red-600",
        icon: <XCircle size={12} />,
      },
    };
    const c = config[status];
    return (
      <span
        className={
          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium " +
          c.className
        }
      >
        {c.icon}
        {c.label}
      </span>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Track follow-up messages sent to guests
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors " +
              (activeTab === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground")
            }
          >
            {tab.label}
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs">
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative w-full sm:w-80">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by guest, room, or message..."
          className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="space-y-3">
        {filteredMessages.map((message) => (
          <div
            key={message.id}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="mt-0.5 rounded-lg bg-primary/10 p-2 text-primary shrink-0">
                  <MessageSquare size={16} />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium">{message.guestName}</p>
                    <span className="text-xs text-muted-foreground">
                      Room {message.room}
                    </span>
                    {statusBadge(message.status)}
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    {message.content}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                    <span>Scheduled: {message.scheduledFor}</span>
                    {message.sentAt && <span>Sent: {message.sentAt}</span>}
                    {message.failReason && (
                      <span className="text-red-500">
                        Reason: {message.failReason}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-start">
                {message.status === "failed" && (
                  <button
                    onClick={() => retryMessage(message.id)}
                    title="Retry sending"
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                  >
                    <RotateCcw size={14} />
                    Retry
                  </button>
                )}

                {message.status === "pending" && (
                  <button
                    title="Send now"
                    className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                  >
                    <Send size={14} />
                    Send now
                  </button>
                )}

                <button
                  onClick={() => cancelMessage(message.id)}
                  title="Remove message"
                  className="rounded-md p-1.5 text-red-500 hover:bg-accent transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No messages yet. Messages you send from the Guests page will appear here.
          </div>
        )}
      </div>
    </main>
  );
}