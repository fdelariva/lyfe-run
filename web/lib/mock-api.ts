import { CoachSignupData } from "./types";

// Simulates API delay
function delay(ms: number = 1500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function createCoachAccount(
  data: CoachSignupData
): Promise<{ success: boolean; coachId: string }> {
  await delay();
  console.log("[MOCK API] Creating coach account:", {
    name: `${data.firstName} ${data.lastName}`,
    email: data.email,
    plan: data.plan,
    practice: data.practiceName,
    subdomain: data.subdomain,
    paymentMethod: data.paymentMethod,
  });
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

export async function processPayment(
  method: string,
  details: Record<string, string>
): Promise<{ success: boolean; transactionId: string; pixCode?: string }> {
  await delay(2000);
  console.log("[MOCK API] Processing payment:", method, Object.keys(details));
  return {
    success: true,
    transactionId: `txn_${Math.random().toString(36).substring(2, 12)}`,
    ...(method === "pix" && {
      pixCode:
        "00020126580014br.gov.bcb.pix0136mock-pix-key-lyfe-run-00000000005204000053039865802BR5913LYFE RUN LTDA6008CURITIBA62070503***6304ABCD",
    }),
  };
}
