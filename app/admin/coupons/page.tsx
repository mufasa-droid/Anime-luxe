"use client";

import { useState } from "react";
import {
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Percent,
  DollarSign,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatCurrency, cn } from "@/lib/utils";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrder: number;
  usageCount: number;
  usageLimit: number;
  expiresAt: string;
  isActive: boolean;
}

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "c1",
    code: "LUXE15",
    discountType: "percentage",
    discountValue: 15,
    minOrder: 50,
    usageCount: 84,
    usageLimit: 200,
    expiresAt: "2026-12-31",
    isActive: true,
  },
  {
    id: "c2",
    code: "BANKAI20",
    discountType: "percentage",
    discountValue: 20,
    minOrder: 100,
    usageCount: 142,
    usageLimit: 500,
    expiresAt: "2026-10-15",
    isActive: true,
  },
  {
    id: "c3",
    code: "SHINOBI10",
    discountType: "fixed",
    discountValue: 10,
    minOrder: 40,
    usageCount: 29,
    usageLimit: 100,
    expiresAt: "2026-09-30",
    isActive: true,
  },
  {
    id: "c4",
    code: "FIRSTDROP",
    discountType: "percentage",
    discountValue: 10,
    minOrder: 0,
    usageCount: 310,
    usageLimit: 1000,
    expiresAt: "2027-01-01",
    isActive: false,
  },
];

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");
  const [discountValue, setDiscountValue] = useState(15);
  const [minOrder, setMinOrder] = useState(50);
  const [usageLimit, setUsageLimit] = useState(100);
  const [expiresAt, setExpiresAt] = useState("2026-12-31");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  }

  function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    const newCoupon: Coupon = {
      id: `c-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrder: Number(minOrder),
      usageCount: 0,
      usageLimit: Number(usageLimit),
      expiresAt,
      isActive: true,
    };

    setCoupons((prev) => [newCoupon, ...prev]);
    showToast(`Created coupon code "${newCoupon.code}"`);
    setIsAdding(false);
    setCode("");
  }

  function toggleStatus(id: string) {
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isActive: !c.isActive } : c
      )
    );
    showToast("Coupon status updated");
  }

  function deleteCoupon(id: string, codeName: string) {
    if (confirm(`Are you sure you want to delete coupon "${codeName}"?`)) {
      setCoupons((prev) => prev.filter((c) => c.id !== id));
      showToast(`Deleted coupon "${codeName}"`);
    }
  }

  return (
    <div className="space-y-6">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-2xl bg-emerald-500/90 px-4 py-2.5 text-sm font-medium text-white shadow-xl backdrop-blur-md">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Coupons & Discounts" }]}
        backHref="/admin"
        backLabel="Admin Dashboard"
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">
            Coupons & Promotional Codes
          </h2>
          <p className="mt-1 text-xs text-neutral-500 dark:text-white/50">
            Create discount codes, set campaign rules, usage limits, and expiration windows.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 px-4 py-2 text-xs font-bold !text-white shadow-md shadow-purple-500/25 hover:opacity-95 transition-opacity"
        >
          <Plus size={14} className="!text-white" />
          <span className="!text-white font-bold">Create Coupon</span>
        </button>
      </div>

      {/* Add Coupon Modal */}
      {isAdding && (
        <div className="glass-strong rounded-3xl p-6 border border-accent-purple/30 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-neutral-900 dark:text-white">
              Create New Promotional Discount Code
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="rounded-full p-1.5 text-neutral-400 hover:text-neutral-700 dark:text-white/40 dark:hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleCreateCoupon} className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Coupon Code</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMERDROP25"
                className="glass w-full rounded-xl px-3.5 py-2 text-xs font-mono font-bold uppercase text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              >
                <option value="percentage">Percentage (%) Off</option>
                <option value="fixed">Fixed Amount ($) Off</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">
                Discount Value ({discountType === "percentage" ? "%" : "$"})
              </label>
              <input
                type="number"
                required
                min="1"
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Minimum Spend ($)</label>
              <input
                type="number"
                min="0"
                value={minOrder}
                onChange={(e) => setMinOrder(Number(e.target.value))}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Max Redemption Limit</label>
              <input
                type="number"
                min="1"
                value={usageLimit}
                onChange={(e) => setUsageLimit(Number(e.target.value))}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-600 dark:text-white/60">Expiration Date</label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="glass w-full rounded-xl px-3.5 py-2 text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-full px-4 py-1.5 text-xs text-neutral-600 dark:text-white/60 hover:text-neutral-900 dark:hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-accent-purple px-5 py-1.5 text-xs font-semibold text-white hover:bg-accent-purple/90"
              >
                Create Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="glass rounded-3xl overflow-hidden border border-neutral-200 dark:border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-neutral-200 dark:border-white/10 bg-neutral-100/50 dark:bg-white/[0.02] text-neutral-500 dark:text-white/50 uppercase font-semibold">
              <tr>
                <th className="p-4">Coupon Code</th>
                <th className="p-4">Discount</th>
                <th className="p-4">Min. Spend</th>
                <th className="p-4">Usage</th>
                <th className="p-4">Expires</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-white/10">
              {coupons.map((coupon) => (
                <tr
                  key={coupon.id}
                  className="hover:bg-neutral-100/40 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4 font-mono font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-2">
                    <Ticket size={16} className="text-accent-purple" />
                    <span>{coupon.code}</span>
                  </td>

                  <td className="p-4 font-semibold text-neutral-800 dark:text-white/90">
                    {coupon.discountType === "percentage"
                      ? `${coupon.discountValue}% OFF`
                      : `$${coupon.discountValue} OFF`}
                  </td>

                  <td className="p-4 text-neutral-600 dark:text-white/60 font-medium">
                    {coupon.minOrder > 0 ? `$${coupon.minOrder}` : "No minimum"}
                  </td>

                  <td className="p-4 text-neutral-600 dark:text-white/60">
                    <span className="font-semibold text-neutral-900 dark:text-white">{coupon.usageCount}</span> / {coupon.usageLimit}
                  </td>

                  <td className="p-4 font-mono text-neutral-500 dark:text-white/50 text-[11px]">
                    {coupon.expiresAt}
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => toggleStatus(coupon.id)}
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase transition-all",
                        coupon.isActive
                          ? "bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/25"
                          : "bg-neutral-200 dark:bg-white/10 text-neutral-500 dark:text-white/40 hover:bg-neutral-300"
                      )}
                    >
                      {coupon.isActive ? "Active" : "Paused"}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => deleteCoupon(coupon.id, coupon.code)}
                      aria-label={`Delete ${coupon.code}`}
                      className="rounded-full p-2 text-accent-red/70 hover:text-accent-red hover:bg-accent-red/10 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
