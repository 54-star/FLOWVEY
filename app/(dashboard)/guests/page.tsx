"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Eye,
  MessageCircle,
  X,
  BedDouble,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Guest,
  loadGuests,
  saveGuests,
  addMessageRecord,
  whatsappLink,
  nowStamp,
} from "@/lib/storage";

const emptyForm: Omit<Guest, "id"> = {
  name: "",
  email: "",
  phone: "",
  room: "",
  checkIn: "",
  checkOut: "",
  status: "upcoming",
};

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Guest, "id">>(emptyForm);

  const [detailsGuest, setDetailsGuest] = useState<Guest | null>(null);
  const [deleteGuest, setDeleteGuest] = useState<Guest | null>(null);
  const [confirmGuest, setConfirmGuest] = useState<Guest | null>(null);

  useEffect(() => {
    setGuests(loadGuests());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveGuests(guests);
  }, [guests, loaded]);

  const filteredGuests = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.room.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q)
    );
  }, [guests, search]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function openEditForm(guest: Guest) {
    setEditingId(guest.id);
    setForm({
      name: guest.name,
      email: guest.email,
      phone: guest.phone,
      room: guest.room,
      checkIn: guest.checkIn,
      checkOut: guest.checkOut,
      status: guest.status,
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.room) return;

    if (editingId) {
      setGuests((prev) =>
        prev.map((g) => (g.id === editingId ? { ...g, ...form } : g))
      );
    } else {
      setGuests((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }

    setFormOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  }

  function confirmDelete() {
    if (!deleteGuest) return;
    setGuests((prev) => prev.filter((g) => g.id !== deleteGuest.id));
    setDeleteGuest(null);
  }

  function messageContentFor(guest: Guest) {
    return (
      "Hi " +
      guest.name +
      ", thanks for staying with us! We'd love your feedback: https://flowvey.app/review"
    );
  }

  // Step 1: open WhatsApp, then ask for confirmation instead of assuming success
  function startWhatsappSend(guest: Guest) {
    const url = whatsappLink(guest.phone, messageContentFor(guest));
    window.open(url, "_blank", "noopener,noreferrer");
    setConfirmGuest(guest);
  }

  // Step 2: log the outcome based on what the user tells us actually happened
  function resolveConfirmation(status: "sent" | "failed", failReason: string | null) {
    if (!confirmGuest) return;
    addMessageRecord({
      id: Date.now().toString(),
      guestName: confirmGuest.name,
      phone: confirmGuest.phone,
      room: confirmGuest.room,
      content: messageContentFor(confirmGuest),
      channel: "whatsapp",
      status,
      scheduledFor: nowStamp(),
      sentAt: status === "sent" ? nowStamp() : null,
      failReason,
    });
    setConfirmGuest(null);
  }

  function statusBadge(status: Guest["status"]) {
    const styles: Record<Guest["status"], string> = {
      "checked-in": "bg-green-500/10 text-green-600",
      "checked-out": "bg-muted text-muted-foreground",
      upcoming: "bg-blue-500/10 text-blue-600",
    };
    const labels: Record<Guest["status"], string> = {
      "checked-in": "Checked in",
      "checked-out": "Checked out",
      upcoming: "Upcoming",
    };
    return (
      <span className={"inline-block rounded-full px-2.5 py-0.5 text-xs font-medium " + styles[status]}>
        {labels[status]}
      </span>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Guests</h1>
          <p className="text-sm text-muted-foreground">
            Manage guest records and room assignments
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity w-fit"
        >
          <Plus size={18} />
          Add Guest
        </button>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, room, or email..."
          className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Room</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Check-in</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Check-out</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest.id} className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{guest.name}</p>
                    <p className="text-xs text-muted-foreground">{guest.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm">
                      <BedDouble size={14} className="text-muted-foreground" />
                      {guest.room}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{guest.checkIn}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{guest.checkOut}</td>
                  <td className="px-4 py-3">{statusBadge(guest.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => startWhatsappSend(guest)}
                        title="Message on WhatsApp"
                        className="rounded-md p-1.5 text-green-600 hover:bg-accent transition-colors"
                      >
                        <MessageCircle size={16} />
                      </button>
                      <button onClick={() => setDetailsGuest(guest)} title="View details" className="rounded-md p-1.5 hover:bg-accent transition-colors">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditForm(guest)} title="Edit guest" className="rounded-md p-1.5 hover:bg-accent transition-colors">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteGuest(guest)} title="Delete guest" className="rounded-md p-1.5 text-red-500 hover:bg-accent transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    No guests yet. Click "Add Guest" to create your first one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{editingId ? "Edit Guest" : "Add Guest"}</h2>
              <button onClick={() => setFormOpen(false)} className="rounded-md p-1 hover:bg-accent">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Phone (with country code)</label>
                <input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+2348012345678"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Room</label>
                  <input
                    required
                    value={form.room}
                    onChange={(e) => setForm({ ...form, room: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Guest["status"] })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="checked-in">Checked in</option>
                    <option value="checked-out">Checked out</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Check-in</label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-muted-foreground">Check-out</label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                  Cancel
                </button>
                <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
                  {editingId ? "Save changes" : "Add guest"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailsGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Guest Details</h2>
              <button onClick={() => setDetailsGuest(null)} className="rounded-md p-1 hover:bg-accent">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{detailsGuest.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{detailsGuest.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{detailsGuest.phone || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">{detailsGuest.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-in</span>
                <span className="font-medium">{detailsGuest.checkIn || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Check-out</span>
                <span className="font-medium">{detailsGuest.checkOut || "—"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status</span>
                {statusBadge(detailsGuest.status)}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-5">
              <button
                onClick={() => startWhatsappSend(detailsGuest)}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
              >
                <MessageCircle size={16} />
                Message
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-2">Delete guest?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              This will permanently remove{" "}
              <span className="font-medium text-foreground">{deleteGuest.name}</span>{" "}
              from your guest list. This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteGuest(null)} className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
                Cancel
              </button>
              <button onClick={confirmDelete} className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delivery confirmation prompt */}
      {confirmGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-5">
            <h2 className="text-lg font-semibold mb-2">Did the message send?</h2>
            <p className="text-sm text-muted-foreground mb-5">
              We opened WhatsApp for{" "}
              <span className="font-medium text-foreground">{confirmGuest.name}</span>.
              Let us know what happened so we can keep your records accurate.
            </p>

            <div className="space-y-2">
              <button
                onClick={() => resolveConfirmation("sent", null)}
                className="flex w-full items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <CheckCircle2 size={16} className="text-green-600" />
                Yes, it sent successfully
              </button>

              <button
                onClick={() => resolveConfirmation("failed", "Number not on WhatsApp")}
                className="flex w-full items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <XCircle size={16} className="text-red-500" />
                No, number isn't on WhatsApp
              </button>

              <button
                onClick={() => resolveConfirmation("failed", "Message did not send")}
                className="flex w-full items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
              >
                <XCircle size={16} className="text-red-500" />
                No, something else went wrong
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}