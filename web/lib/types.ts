export type PlanType = "basic" | "gold";

export interface CoachSignupData {
  // Step 1: Account
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  // Step 2: Practice
  practiceName: string;
  subdomain: string;
  bio: string;
  // Step 3: Plan
  plan: PlanType;
  // Step 4: Payment
  paymentMethod: "credit_card" | "pix" | "bank_transfer";
  cardNumber?: string;
  cardName?: string;
  cardExpiry?: string;
  cardCvv?: string;
}

export const PLAN_DETAILS = {
  basic: {
    name: "Basic Plan",
    price: "R$ 200",
    period: "/ month",
    features: [
      "Up to 20 athletes",
      "Weekly plan builder",
      "Strava + GPS recording",
      "Custom landing page",
      "PIX, credit card, bank transfer",
      "Basic analytics",
    ],
  },
  gold: {
    name: "Gold Plan",
    price: "3%",
    period: "of monthly revenue",
    features: [
      "Unlimited athletes",
      "AI training plan generation",
      "AI session feedback drafting",
      "Garmin + Apple Watch + Whoop integration",
      "Advanced analytics + cohort views",
      "VO2 Max + race time predictions",
      "Priority support",
    ],
  },
} as const;
