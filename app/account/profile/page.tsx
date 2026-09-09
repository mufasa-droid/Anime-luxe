import { currentUser } from "@clerk/nextjs/server";
import { ProfileForm } from "@/components/account/ProfileForm";

export default async function ProfilePage() {
  const user = await currentUser();

  const email =
    user?.primaryEmailAddress?.emailAddress ??
    user?.emailAddresses?.[0]?.emailAddress ??
    "";
  const name =
    user?.fullName ??
    user?.firstName ??
    "";

  return (
    <div>
      <h2 className="mb-6 font-heading text-xl font-bold text-white">
        Profile
      </h2>
      <ProfileForm initialName={name} email={email} />
    </div>
  );
}

