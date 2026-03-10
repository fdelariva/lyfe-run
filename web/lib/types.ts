export type PlanType = "basic" | "gold";

export interface CoachSignupData {
  // Passo 1: Conta
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  // Passo 2: Assessoria
  practiceName: string;
  subdomain: string;
  bio: string;
  // Passo 3: Plano
  plan: PlanType;
}

export const PLAN_DETAILS = {
  basic: {
    name: "Plano Basic",
    price: "R$ 200",
    period: "/ mês",
    features: [
      "Até 20 atletas",
      "Montador de planilha semanal",
      "Strava + gravação GPS",
      "Landing page personalizada",
      "PIX, cartão de crédito, transferência",
      "Analytics básico",
    ],
  },
  gold: {
    name: "Plano Gold",
    price: "3%",
    period: "da receita mensal",
    features: [
      "Atletas ilimitados",
      "Geração de planilha por IA",
      "Feedback pós-treino por IA",
      "Integração Garmin + Apple Watch + Whoop",
      "Analytics avançado + visão por grupo",
      "VO2 Max + previsão de tempos de prova",
      "Suporte prioritário",
    ],
  },
} as const;
