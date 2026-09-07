import { createClient } from "@/lib/supabase/server";
import { getAllUsers } from "@/lib/actions/admin/users";
import { ToggleAdminButton } from "@/components/admin/ToggleAdminButton";
import { Users as UsersIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const users = await getAllUsers();
  const configured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Users ({users.length})
      </h2>

      {!configured && (
        <div className="mb-6 rounded-2xl bg-accent-blue/10 px-4 py-3 text-sm text-white/60">
          Supabase isn&apos;t configured — see the README for setup.
        </div>
      )}

      {users.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <UsersIcon size={28} className="mx-auto mb-3 text-white/30" />
          <p className="text-white/60">
            {configured ? "No users yet." : "Connect Supabase to view users."}
          </p>
        </div>
      ) : (
        <div className="glass divide-y divide-white/10 rounded-2xl">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-4 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-pink font-heading text-sm font-bold text-white">
                {(u.name || u.email || "?").charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {u.name || u.email}
                  {u.id === currentUser?.id && (
                    <span className="ml-2 text-xs text-white/40">(you)</span>
                  )}
                </p>
                <p className="truncate text-xs text-white/40">{u.email}</p>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize",
                  u.role === "admin"
                    ? "bg-accent-purple/20 text-accent-purple"
                    : "bg-white/10 text-white/50"
                )}
              >
                {u.role}
              </span>
              <div className="shrink-0">
                {u.id === currentUser?.id ? (
                  <span className="text-xs text-white/30">Can&apos;t modify yourself</span>
                ) : (
                  <ToggleAdminButton userId={u.id} isAdmin={u.role === "admin"} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
