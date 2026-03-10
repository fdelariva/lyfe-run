import { CoachSignupData } from "./types";

// Simulates API delay
function delay(ms: number = 1500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createCoachAccount(
  data: CoachSignupData
): Promise<{ success: boolean; coachId: string }> {
  // Save to waitlist file via API route
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      practiceName: data.practiceName,
      subdomain: data.subdomain,
      bio: data.bio,
      plan: data.plan,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to save waitlist record");
  }

  return {
    success: true,
    coachId: `coach_${Math.random().toString(36).substring(2, 10)}`,
  };
}

export async function checkSubdomainAvailability(
  subdomain: string
): Promise<boolean> {
  await delay(800);
  const taken = ["lyferun", "admin", "app", "api", "coach", "www"];
  return !taken.includes(subdomain.toLowerCase());
}
