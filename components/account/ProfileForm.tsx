"use client";

import { useActionState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { updateProfileAction, type ProfileActionState } from "@/lib/actions/profile";
import { MagneticButton } from "@/components/ui/MagneticButton";

const initialState: ProfileActionState = {};

export function ProfileForm({
  initialName,
  email,
}: {
  initialName: string;
  email: string;
}) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState
  );

  const inputClass =
    "glass w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none";
  const labelClass = "mb-1.5 block text-xs font-medium text-white/60";

  return (
    <form action={formAction} className="glass max-w-md space-y-4 rounded-2xl p-6">
      <div>
        <label className={labelClass}>Full Name</label>
        <input
          name="name"
          defaultValue={initialName}
          placeholder="Jane Doe"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          value={email}
          disabled
          className={`${inputClass} cursor-not-allowed opacity-60`}
        />
        <p className="mt-1 text-xs text-white/30">
          Email changes aren&apos;t supported yet.
        </p>
      </div>

      <MagneticButton type="submit" disabled={isPending} className="!px-6 !py-2.5 text-sm">
        {isPending ? "Saving..." : "Save Changes"}
      </MagneticButton>

      {state?.error && (
        <div className="flex items-start gap-2 rounded-xl bg-accent-red/10 px-3 py-2.5 text-xs text-accent-red">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}
      {state?.success && (
        <div className="flex items-center gap-2 text-xs text-accent-blue">
          <Check size={14} />
          <span>{state.success}</span>
        </div>
      )}
    </form>
  );
}
