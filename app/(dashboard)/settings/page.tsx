"use client";

import { useState, useRef } from "react";
import { Upload, Save, Info, ImageIcon, X } from "lucide-react";

export default function SettingsPage() {
  const [hotelName, setHotelName] = useState("Flowvey Hotel");
  const [reviewLink, setReviewLink] = useState("https://g.page/r/your-hotel/review");
  const [template, setTemplate] = useState(
    "Hi {guest_name}, thanks for staying with us at {hotel_name}! We'd love your feedback: {review_link}"
  );
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setLogoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function removeLogo() {
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const placeholders = ["{guest_name}", "{hotel_name}", "{room}", "{review_link}"];

  return (
    <main className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your hotel profile and guest messaging preferences
        </p>
      </div>

      {/* Hotel Profile */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <h2 className="text-base font-semibold">Hotel Profile</h2>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Hotel Name
          </label>
          <input
            type="text"
            value={hotelName}
            onChange={(e) => setHotelName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Logo upload */}
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Company Logo
          </label>
          <div className="mt-2 flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-background overflow-hidden">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon size={22} className="text-muted-foreground" />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium hover:bg-accent transition-colors"
                >
                  <Upload size={14} />
                  Upload logo
                </button>
                {logoPreview && (
                  <button
                    onClick={removeLogo}
                    className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-accent transition-colors"
                  >
                    <X size={14} />
                    Remove
                  </button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                PNG or JPG, square image recommended
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              onChange={handleLogoChange}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-5">
        <h2 className="text-base font-semibold">Reviews</h2>

        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Google Review Link
          </label>
          <input
            type="url"
            value={reviewLink}
            onChange={(e) => setReviewLink(e.target.value)}
            placeholder="https://g.page/r/..."
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            This link is inserted into guest messages when you use the{" "}
            <code className="rounded bg-muted px-1 py-0.5">{"{review_link}"}</code>{" "}
            placeholder below.
          </p>
        </div>
      </div>

      {/* WhatsApp Template */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h2 className="text-base font-semibold">WhatsApp Message Template</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Used when sending follow-up and review-request messages to guests
          </p>
        </div>

        <div>
          <textarea
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Info size={12} />
            Available placeholders:
          </span>
          {placeholders.map((p) => (
            <button
              key={p}
              onClick={() => setTemplate((prev) => prev + " " + p)}
              className="rounded-md bg-muted px-2 py-1 text-xs font-mono hover:bg-accent transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        <div className="rounded-lg bg-muted/50 border border-border p-3">
          <p className="text-xs text-muted-foreground mb-1">Preview</p>
          <p className="text-sm">
            {template
              .replace(/{guest_name}/g, "Sarah Johnson")
              .replace(/{hotel_name}/g, hotelName || "Your Hotel")
              .replace(/{room}/g, "204")
              .replace(/{review_link}/g, reviewLink || "your-review-link")}
          </p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          <Save size={16} />
          Save Changes
        </button>
        {saved && (
          <span className="text-sm text-green-600">Settings saved</span>
        )}
      </div>
    </main>
  );
}