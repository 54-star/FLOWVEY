"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  RotateCcw,
  MessageCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
} from "lucide-react";
import {
  MessageRecord,
  loadMessages,
  saveMessages,
  whatsappLink,
  nowStamp,
} from "@/lib/storage";

type HistoryStatus = "sent" | "failed";

function formatDateGroup(dateStr: string) {
  const date = new Date(dateStr.replace(" ", "T"));
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function MessageHistoryPage() {
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | HistoryStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMessages(loadMessages());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveMessages(messages);
  }, [messages, loaded]);

  // History only shows messages that were actually attempted, not still-pending ones
  const history = useMemo(
    () => messages.filter((m) => m.status === "sent" || m.status === "failed"),
    [messages]
  );

  const stats = useMemo(() => {
    const total = history.length;
    const sent = history.filter((h) => h.status === "sent").length;
    const failed = history.filter((h) => h.status === "failed").length;
    const rate = total === 0 ? 0 : Math.round((sent / total) * 100);
    return { total, sent, failed, rate };
  }, [history]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((h) => {
      const matchesSearch =
        !q ||
        h.guestName.toLowerCase().includes(q) ||
        h.room.toLowerCase().includes(q) ||
        h.content.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || h.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [history, search, statusFilter]);

  const grouped = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) =>
        new Date(b.sentAt || b.scheduledFor).getTime() -
        new Date(a.sentAt || a.scheduledFor).getTime()
    );
    const groups: Record<string, MessageRecord[]> = {};
    sorted.forEach((entry) => {
      const label = formatDateGroup(entry.sentAt || entry.scheduledFor);
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return groups;
  }, [filtered]);

  function resendMessage(id: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "sent", sentAt: nowStamp(), failReason: null }
          : m
      )
    );
  }

  function statusBadge(status: MessageRecord["status"]) {
  const config: Record<"sent" | "failed", 
  { label: string; className: string; icon:
     React.ReactNode }> = {
   
      sent: {
        label: "Delivered",
        className: "bg-green-500/10 text-green-600",
        icon: <CheckCircle2 size={12} />,
      },
      failed: {
        label: "Failed",
        className: "bg-red-500/10 text-red-600",
        icon: <XCircle size={12} />,
      },
    };
    const c = config[status as "sent" | "failed"];
    if (!c) return null;
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Message History</h1>
        <p className="text-sm text-muted-foreground">
          A complete log of every message sent to guests
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Total Sent</p>
          <p className="mt-1 text-xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Delivered</p>
          <p className="mt-1 text-xl font-bold text-green-600">{stats.sent}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Failed</p>
          <p className="mt-1 text-xl font-bold text-red-500">{stats.failed}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingUp size={12} />
            Delivery Rate
          </p>
          <p className="mt-1 text-xl font-bold">{stats.rate}%</p>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
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

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | HistoryStatus)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All statuses</option>
          <option value="sent">Delivered</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Grouped list */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([dateLabel, entries]) => (
          <div key={dateLabel}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2">
              {dateLabel}
            </h2>

            <div className="space-y-2">
              {entries.map((entry) => {
                const isExpanded = expandedId === entry.id;
                return (
                  <div
                    key={entry.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{entry.guestName}</p>
                          <span className="text-xs text-muted-foreground">
                            Room {entry.room}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            <MessageCircle size={14} />
                            WhatsApp
                          </span>
                          {statusBadge(entry.status)}
                        </div>

                        <p
                          className={
                            "text-sm text-muted-foreground mt-1 " +
                            (isExpanded ? "" : "truncate")
                          }
                        >
                          {entry.content}
                        </p>

                        {entry.content.length > 60 && (
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : entry.id)
                            }
                            className="text-xs text-primary mt-1 hover:underline"
                          >
                            {isExpanded ? "Show less" : "View full message"}
                          </button>
                        )}

                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {entry.sentAt || entry.scheduledFor}
                        </p>

                        {entry.failReason && (
                          <p className="text-xs text-red-500 mt-1">
                            Reason: {entry.failReason}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start">
                        <button
                          onClick={() => resendMessage(entry.id)}
                          title="Resend message"
                          className="flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                        >
                          <RotateCcw size={14} />
                          Resend
                        </button>
<a
                        
                          href={whatsappLink(entry.phone, entry.content)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send on WhatsApp"
                          className="rounded-md p-1.5 text-green-600 hover:bg-accent transition-colors"
                        >
                          <MessageCircle size={16} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No message history yet. Messages you send from the Guests page will appear here.
          </div>
        )}
      </div>
    </main>
  );
}