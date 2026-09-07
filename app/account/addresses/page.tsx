"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";
import { useAddressStore, type Address } from "@/store/addressStore";
import { AddressForm, type AddressFormValues } from "@/components/account/AddressForm";
import { NoAuthNotice } from "@/components/account/NoAuthNotice";
import { cn } from "@/lib/utils";

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, removeAddress, setDefault } =
    useAddressStore();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingAddress = addresses.find((a) => a.id === editingId);

  function handleSubmit(values: AddressFormValues) {
    if (mode === "edit" && editingId) {
      updateAddress(editingId, values);
    } else {
      addAddress(values);
    }
    setMode("list");
    setEditingId(null);
  }

  return (
    <div>
      <NoAuthNotice>
        Addresses are saved on this browser rather than synced to your
        account. Migrating these to your account is on the roadmap — see
        the README.
      </NoAuthNotice>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-heading text-xl font-bold text-white">
          Saved Addresses
        </h2>
        {mode === "list" && (
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20"
          >
            <Plus size={14} /> Add Address
          </button>
        )}
      </div>

      {mode !== "list" ? (
        <AddressForm
          initialValues={mode === "edit" ? editingAddress : undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setMode("list");
            setEditingId(null);
          }}
        />
      ) : addresses.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <MapPin size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">No saved addresses yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((address: Address) => (
            <div key={address.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <p className="font-heading font-semibold text-white">
                    {address.label}
                  </p>
                  {address.isDefault && (
                    <span className="flex items-center gap-1 rounded-full bg-accent-gold/20 px-2 py-0.5 text-[10px] font-medium text-accent-gold">
                      <Star size={9} className="fill-accent-gold" /> Default
                    </span>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => {
                      setEditingId(address.id);
                      setMode("edit");
                    }}
                    className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                    aria-label="Edit address"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => removeAddress(address.id)}
                    className="rounded-full p-1.5 text-white/40 hover:bg-white/10 hover:text-accent-red"
                    aria-label="Delete address"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <p className="mt-3 text-sm text-white/60">
                {address.fullName}
                <br />
                {address.line1}
                {address.line2 && <>, {address.line2}</>}
                <br />
                {address.city}, {address.state} {address.zip}
                <br />
                {address.country}
              </p>

              {!address.isDefault && (
                <button
                  onClick={() => setDefault(address.id)}
                  className={cn(
                    "mt-3 text-xs text-accent-purple hover:underline"
                  )}
                >
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
