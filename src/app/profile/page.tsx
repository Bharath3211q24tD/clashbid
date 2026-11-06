import type { Metadata } from "next";
import { ProfileScreen } from "@/features/profile/profile-screen";

export const metadata: Metadata = {
  title: "Profile",
  description: "Local demo career, match history, and achievements for CLASHBID.",
};

export default function ProfilePage() {
  return <ProfileScreen />;
}
