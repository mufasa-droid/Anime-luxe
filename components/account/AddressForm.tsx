"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import type { Address } from "@/store/addressStore";

const schema = z.object({
  label: z.string().min(1, "Give this address a label (e.g. Home, Work)"),
  fullName: z.string().min(1, "Full name is required"),
  line1: z.string().min(1, "Street address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State/Province is required"),
  zip: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean(),
});

export type AddressFormValues = z.infer<typeof schema>;

interface AddressFormProps {
  initialValues?: Address;
  onSubmit: (values: AddressFormValues) => void;
  onCancel: () => void;
}

export function AddressForm({
  initialValues,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(schema),
    defaultValues: initialValues ?? {
      label: "",
      fullName: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      isDefault: false,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none";
  const errorClass = "mt-1 text-xs text-accent-red";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="glass space-y-4 rounded-2xl p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Label</label>
          <input {...register("label")} placeholder="Home" className={inputClass} />
          {errors.label && <p className={errorClass}>{errors.label.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Full Name</label>
          <input {...register("fullName")} placeholder="Jane Doe" className={inputClass} />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Street Address</label>
        <input {...register("line1")} placeholder="123 Main St" className={inputClass} />
        {errors.line1 && <p className={errorClass}>{errors.line1.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Apartment, Suite, etc. (optional)</label>
        <input {...register("line2")} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className={labelClass}>City</label>
          <input {...register("city")} className={inputClass} />
          {errors.city && <p className={errorClass}>{errors.city.message}</p>}
        </div>
        <div>
          <label className={labelClass}>State / Province</label>
          <input {...register("state")} className={inputClass} />
          {errors.state && <p className={errorClass}>{errors.state.message}</p>}
        </div>
        <div>
          <label className={labelClass}>ZIP / Postal Code</label>
          <input {...register("zip")} className={inputClass} />
          {errors.zip && <p className={errorClass}>{errors.zip.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <input {...register("country")} className={inputClass} />
        {errors.country && <p className={errorClass}>{errors.country.message}</p>}
      </div>

      <label className="flex items-center gap-2 text-sm text-white/70">
        <input
          type="checkbox"
          {...register("isDefault")}
          className="accent-accent-purple"
        />
        Set as default address
      </label>

      <div className="flex gap-3 pt-2">
        <MagneticButton type="submit" disabled={isSubmitting} className="!px-6 !py-2.5 text-sm">
          {isSubmitting ? "Saving..." : "Save Address"}
        </MagneticButton>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-6 py-2.5 text-sm text-white/60 hover:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
