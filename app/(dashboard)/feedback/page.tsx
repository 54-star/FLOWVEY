"use client";

import { useState, useMemo } from "react";
import { Search, Star, User, TrendingUp, MessageSquareQuote } from "lucide-react";

type Feedback = {
  id: string;
  guestName: string;
  room: string;
  rating: number; // 1-5
  comment: string;
  category: string;
  date: string;
};

const initialFeedback: Feedback[] = [
  {
    id: "1",
    guestName: "Sarah Johnson",
    room: "204",
    rating: 5,
    comment: "Absolutely loved my stay! The staff were incredibly attentive and the room was spotless.",
    category: "Service",
    date: "2026-07-02",
  },
  {
    id: "2",
    guestName: "Michael Chen",
    room: "310",
    rating: 4,
    comment: "Great location and comfortable bed. Breakfast options could use more variety.",
    category: "Food & Beverage",
    date: "2026-07-01",
  },
  {
    id: "3",
    guestName: "Amara Obi",
    room: "112",
    rating: 3,
    comment: "Rated stay 4/5 — noted slow Wi-Fi in the room, otherwise a pleasant stay.",
    category: "Facilities",
    date: "2026-06-27",
  },
  {
    id: "4",
    guestName: "Daniel Kim",
    room: "118",
    rating: 2,
    comment: "Check-in took over 30 minutes and the room wasn't ready on arrival.",
    category: "Service",
    date: "2026-06-25",
  },
  {
    id: "5",
    guestName: "Priya Patel",
    room: "220",
    rating: 5,
    comment: "The spa was a highlight of our trip. Would definitely come back!",
    category: "Facilities",
    date: "2026-06-20",
  },
];

export default function FeedbackPage() {
  const [feedback] = useState<Feedback[]>(initialFeedback);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<"all" | number>("all");

  const stats = useMemo(() => {
    const total = feedback.length;
    const avg =
      total === 0
        ? 0
        : feedback.reduce((sum, f) => sum + f.rating, 0) / total;
    const distribution = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: feedback.filter((f) => f.rating === star).length,
    }));
    return { total, avg, distribution };
  }, [feedback]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return feedback.filter((f) => {
      const matchesSearch =
        !q ||
        f.guestName.toLowerCase().includes(q) ||
        f.room.toLowerCase().includes(q) ||
        f.comment.toLowerCase().includes(q);
      const matchesRating = ratingFilter === "all" || f.rating === ratingFilter;
      return matchesSearch && matchesRating;
    });
  }, [feedback, search, ratingFilter]);

  function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            className={
              i <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-transparent text-muted-foreground/40"
            }
          />
        ))}
      </div>
    );
  }

  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Feedback</h1>
        <p className="text-sm text-muted-foreground">
          What guests are saying about their stay
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex flex-col items-center justify-center text-center">
          <p className="text-4xl font-bold">{stats.avg.toFixed(1)}</p>
          <StarRow rating={Math.round(stats.avg)} size={18} />
          <p className="text-xs text-muted-foreground mt-2">
            Based on {stats.total} reviews
          </p>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <p className="text-sm font-semibold mb-3 flex items-center gap-1.5">
            <TrendingUp size={14} />
            Rating Distribution
          </p>
          <div className="space-y-2">
            {stats.distribution.map(({ star, count }) => {
              const pct = stats.total === 0 ? 0 : (count / stats.total) * 100;
              return (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 shrink-0">
                    {star} star
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-yellow-400"
                      style={{ width: pct + "%" }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6 text-right shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Search + Filter */}
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
            placeholder="Search by guest, room, or comment..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <select
          value={ratingFilter}
          onChange={(e) =>
            setRatingFilter(e.target.value === "all" ? "all" : Number(e.target.value))
          }
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="all">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </div>

      {/* Feedback cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((f) => (
          <div
            key={f.id}
            className="rounded-xl border border-border bg-card p-5 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User size={16} />
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{f.guestName}</p>
                  <p className="text-xs text-muted-foreground">Room {f.room}</p>
                </div>
              </div>
              <StarRow rating={f.rating} />
            </div>

            <div className="relative">
              <MessageSquareQuote
                size={16}
                className="text-muted-foreground/30 absolute -left-0.5 -top-0.5"
              />
              <p className="text-sm text-muted-foreground pl-5">{f.comment}</p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
              <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                {f.category}
              </span>
              <span className="text-xs text-muted-foreground/70">{f.date}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-xl border border-border bg-card p-10 text-center text-muted-foreground">
            No feedback matches your filters.
          </div>
        )}
      </div>
    </main>
  );
}