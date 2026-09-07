import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Profile
      </h2>
      <ProfileForm
        initialName={(user?.user_metadata?.full_name as string) ?? ""}
        email={user?.email ?? ""}
      />
    </div>
  );
}
