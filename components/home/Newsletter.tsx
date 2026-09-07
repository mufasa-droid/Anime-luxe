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
    <section className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
          Never Miss a Drop
        </h2>
        <p className="mt-3 text-white/50">
          Join the list for early access to limited editions and restocks.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <input
            {...register("email")}
            type="email"
            placeholder="you@email.com"
            className="glass w-full rounded-full px-6 py-3 text-white placeholder:text-white/40 focus:outline-none sm:w-80"
          />
          <MagneticButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Joining..." : isSubmitSuccessful ? "Joined!" : "Join"}
          </MagneticButton>
        </form>
        {errors.email && (
          <p className="mt-2 text-sm text-accent-red">{errors.email.message}</p>
        )}
      </div>
    </section>
  );
}
