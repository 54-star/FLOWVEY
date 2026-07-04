"use client";

import {
  Users,
  MessageSquare,
  Star,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const summaryCards = [
  {
    label: "Total Guests",
    value: "1,284",
    change: "+12% this month",
    icon: Users,
  },
  {
    label: "Messages Sent",
    value: "342",
    change: "+8% this week",
    icon: MessageSquare,
  },
  {
    label: "Feedback Received",
    value: "97",
    change: "+5 new today",
    icon: Star,
  },
  {
    label: "New Reviews",
    value: "26",
    change: "+3 this week",
    icon: TrendingUp,
  },
];

const reviewsLast7Days = [
  { day: "Mon", reviews: 3 },
  { day: "Tue", reviews: 5 },
  { day: "Wed", reviews: 2 },
  { day: "Thu", reviews: 6 },
  { day: "Fri", reviews: 4 },
  { day: "Sat", reviews: 7 },
  { day: "Sun", reviews: 5 },
];

const recentActivity = [
  {
    title: "New review from Sarah Johnson",
    detail: "Left a 5-star review for Room 204",
    time: "10 min ago",
  },
  {
    title: "Message sent to Michael Chen",
    detail: "Check-in reminder for tomorrow",
    time: "42 min ago",
  },
  {
    title: "Feedback received from Amara Obi",
    detail: "Rated stay 4/5 — noted slow Wi-Fi",
    time: "1 hr ago",
  },
  {
    title: "New guest added",
    detail: "Daniel Kim checked in for 3 nights",
    time: "3 hrs ago",
  },
  {
    title: "New review from Priya Patel",
    detail: "Left a 5-star review for the spa",
    time: "5 hrs ago",
  },
];

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of guest activity and engagement
          </p>
        </div>

        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
          <Plus size={18} />
          Add Guest
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <card.icon size={18} />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold">{card.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {card.change}
            </p>
          </div>
        ))}
      </div>

      {/* Chart + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Reviews chart */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold">Reviews, Last 7 Days</h2>
              <p className="text-xs text-muted-foreground">
                Daily review volume
              </p>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewsLast7Days}>
                <defs>
                  <linearGradient id="reviewsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--primary)"
                      stopOpacity={0.35}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border)"
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="reviews"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#reviewsFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold mb-4">Recent Activity</h2>

          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.detail}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}