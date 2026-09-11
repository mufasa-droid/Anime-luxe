"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MagneticButton } from "@/components/ui/MagneticButton";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type FormValues = z.infer<typeof schema>;

export function Newsletter() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    // Wire this up to a Server Action / API route that calls your
    // email provider (Resend, SendGrid, Supabase function, etc.)
    await new Promise((r) => setTimeout(r, 600));
    reset();
  }

  return (
    <section className="px-4 sm:px-6 py-14 sm:py-24">
      <div className="glass-strong mx-auto max-w-2xl rounded-3xl p-6 sm:p-10 text-center border border-white/10 shadow-xl">
        <h2 className="font-heading text-2xl font-bold text-white sm:text-4xl">
          Never Miss a Drop
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-white/50 max-w-md mx-auto">
          Join the elite collector circle for early access to limited streetwear editions and restocks.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email address..."
            className="glass w-full rounded-2xl sm:rounded-full px-5 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none sm:w-80 border border-white/15"
          />
          <MagneticButton type="submit" disabled={isSubmitting} className="w-full sm:w-auto !py-3 !px-8">
            {isSubmitting ? "Joining..." : isSubmitSuccessful ? "Joined!" : "Join Drop List"}
          </MagneticButton>
        </form>
        {errors.email && (
          <p className="mt-2 text-xs text-accent-red">{errors.email.message}</p>
        )}
      </div>
    </section>
  );
}
