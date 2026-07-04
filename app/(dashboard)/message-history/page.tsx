"use client";

import { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  MessageCircle,
  X,
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

type Channel = "whatsapp" | "sms" | "email";
type HistoryStatus = "delivered" | "sent" | "failed";

type HistoryEntry = {
  id: string;
  guestName: string;
  phone: string;
  room: string;
  content: string;
  channel: Channel;
  status: HistoryStatus;
  sentAt: string; // ISO-ish "YYYY-MM-DD HH:mm"
};

const initialHistory: HistoryEntry[] = [
  {
    id: "1",
    guestName: "Sarah Johnson",
    phone: "+2348012345678",
    room: "204",
    content: "Hi Sarah, thanks for staying with us! We'd love your feedback.",
    channel: "whatsapp",
    status: "delivered",
    sentAt: "2026-07-03 10:00",
  },
  {
    id: "2",
    guestName: "Michael Chen",
    phone: "+14155552671",
    room: "310",
    content: "Hi Michael, just checking in — how's your stay going so far?",
    channel: "whatsapp",
    status: "sent",
    sentAt: "2026-07-03 09:15",
  },
  {
    id: "3",
    guestName: "Amara Obi",
    phone: "+2347098765432",
    room: "112",
    content: "Hi Amara, thanks for staying with us! We'd love your feedback.",
    channel: "sms",
    status: "failed",
    sentAt: "2026-07-02 11:00",
  },
  {
    id: "4",
    guestName: "Daniel Kim",
    phone: "+15551234567",
    room: "118",
    content: "Hi Daniel, welcome! Let us know if you need anything during your stay.",
    channel: "email",
    status: "delivered",
    sentAt: "2026-07-02 08:30",
  },
  {
    id: "5",
    guestName: "Priya Patel",
    phone: "+919812345678",
    room: "220",
    content: "Hi Priya, thanks for staying with us! We'd love your feedback.",
    channel: "whatsapp",
    status: "failed",
    sentAt: "2026-06-27 08:00",
  },
  {
    id: "6",
    guestName: "Sarah Johnson",
    phone: "+2348012345678",
    room: "204",
    content: "Reminder: check-out is at 12pm tomorrow. Let us know if you need a late check-out.",
    channel: "whatsapp",
    status: "delivered",
    sentAt: "2026-06-27 18:20",
  },
];

const channelIcons: Record<Channel, React.ReactNode> = {
  whatsapp: <MessageCircle size={14} />,
  sms: <MessageSquare size={14} />,
  email: <Mail size={14} />,
};

const channelLabels: Record<Channel, string> = {
  whatsapp: "WhatsApp",
  sms: "SMS",
  email: "Email",
};

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
  const [history, setHistory] = useState<HistoryEntry[]>(initialHistory);
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<"all" | Channel>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | HistoryStatus>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const total = history.length;
    const delivered = history.filter((h) => h.status === "delivered").length;
    const failed = history.filter((h) => h.status === "failed").length;
    const rate = total === 0 ? 0 : Math.round((delivered / total) * 100);
    return { total, delivered, failed, rate };
  }, [history]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return history.filter((h) => {
      const matchesSearch =
        !q ||
        h.guestName.toLowerCase().includes(q) ||
        h.room.toLowerCase().includes(q) ||
        h.content.toLowerCase().includes(q);
      const matchesChannel = channelFilter === "all" || h.channel === channelFilter;
      const matchesStatus = statusFilter === "all" || h.status === statusFilter;
      return matchesSearch && matchesChannel && matchesStatus;
    });
  }, [history, search, channelFilter, statusFilter]);

  const grouped = useMemo(() => {
    const sorted = [...filtered].sort(
      (a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime()
    );
    const groups: Record<string, HistoryEntry[]> = {};
    sorted.forEach((entry) => {
      const label = formatDateGroup(entry.sentAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(entry);
    });
    return groups;
  }, [filtered]);

  function whatsappLink(phone: string, guestName: string, content: string) {
    const digitsOnly = phone.replace(/[^\d]/g, "");
    return "https://wa.me/" + digitsOnly + "?text=" + encodeURIComponent(content);
  }

  function resendMessage(id: string) {
    setHistory((prev) =>
      prev.map((h) =>
        h.id === id
          ? { ...h, status: "sent" as HistoryStatus, sentAt: new Date().toISOString().slice(0, 16).replace("T", " ") }
          : h
      )
    );
  }

  function statusBadge(status: HistoryStatus) {
    const config: Record<HistoryStatus, { label: string; className: string; icon: React.ReactNode }> = {
      delivered: {
        label: "Delivered",
        className: "bg-green-500/10 text-green-600",
        icon: <CheckCircle2 size={12} />,
      },
      sent: {
        label: "Sent",
        className: "bg-blue-500/10 text-blue-600",
        icon: <Clock size={12} />,
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
          <p className="mt-1 text-xl font-bold text-green-600">{stats.delivered}</p>
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
          value={channelFilter}
          onChange={(e) => setChannelFilter(e.target.value as "all" | Channel)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All channels</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | HistoryStatus)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All statuses</option>
          <option value="delivered">Delivered</option>
          <option value="sent">Sent</option>
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
                            {channelIcons[entry.channel]}
                            {channelLabels[entry.channel]}
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
                          {entry.sentAt}
                        </p>
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
                        
                          href={whatsappLink(entry.phone, entry.guestName, entry.content)}
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
            No messages match your filters.
          </div>
        )}
      </div>
    </main>
  );
}