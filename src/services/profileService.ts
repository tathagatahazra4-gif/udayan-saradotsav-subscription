import { getLoggedInUser } from "@/services/authService";

export async function getCurrentProfile() {
  return getLoggedInUser();
}

export async function getCurrentUserName() {
  const user = getLoggedInUser();

  return user?.username ?? "Unknown User";
}