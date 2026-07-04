"use client";

import {
  MessageSquare,
  Star,
  FileCheck2,
  ThumbsUp,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const summaryCards = [
  {
    label: "Messages Sent",
    value: "342",
    change: "+8% vs last month",
    icon: MessageSquare,
  },
  {
    label: "Feedback Received",
    value: "97",
    change: "+5 this month",
    icon: Star,
  },
  {
    label: "Reviews Generated",
    value: "68",
    change: "+12% vs last month",
    icon: FileCheck2,
  },
  {
    label: "Positive Rate",
    value: "82%",
    change: "+3% vs last month",
    icon: ThumbsUp,
  },
];

const messagesSentData = [
  { date: "Jun 4", sent: 8 },
  { date: "Jun 8", sent: 12 },
  { date: "Jun 12", sent: 9 },
  { date: "Jun 16", sent: 15 },
  { date: "Jun 20", sent: 11 },
  { date: "Jun 24", sent: 18 },
  { date: "Jun 28", sent: 14 },
  { date: "Jul 2", sent: 20 },
];

const feedbackReceivedData = [
  { date: "Jun 4", feedback: 3 },
  { date: "Jun 8", feedback: 5 },
  { date: "Jun 12", feedback: 4 },
  { date: "Jun 16", feedback: 6 },
  { date: "Jun 20", feedback: 5 },
  { date: "Jun 24", feedback: 8 },
  { date: "Jun 28", feedback: 6 },
  { date: "Jul 2", feedback: 9 },
];

const reviewsGeneratedData = [
  { date: "Jun 4", reviews: 2 },
  { date: "Jun 8", reviews: 4 },
  { date: "Jun 12", reviews: 3 },
  { date: "Jun 16", reviews: 5 },
  { date: "Jun 20", reviews: 4 },
  { date: "Jun 24", reviews: 7 },
  { date: "Jun 28", reviews: 5 },
  { date: "Jul 2", reviews: 8 },
];

const ratingSplitData = [
  { name: "Positive (4-5★)", value: 79, color: "#22c55e" },
  { name: "Neutral (3★)", value: 12, color: "#eab308" },
  { name: "Negative (1-2★)", value: 9, color: "#ef4444" },
];

export default function ReportsPage() {
  return (
    <main className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Performance overview for the last 30 days
        </p>
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
            <p className="mt-1 text-xs text-muted-foreground">{card.change}</p>
          </div>
        ))}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Messages sent */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold mb-1">Messages Sent</h2>
          <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={messagesSentData}>
                <defs>
                  <linearGradient id="sentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
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
                  dataKey="sent"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fill="url(#sentFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Feedback received */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold mb-1">Feedback Received</h2>
          <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={feedbackReceivedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
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
                <Bar dataKey="feedback" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Positive vs negative ratings */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold mb-1">Positive vs Negative Ratings</h2>
          <p className="text-xs text-muted-foreground mb-4">All-time split</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingSplitData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {ratingSplitData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Reviews generated */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="text-base font-semibold mb-1">Reviews Generated</h2>
          <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reviewsGeneratedData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
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
                <Line
                  type="monotone"
                  dataKey="reviews"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  );
}