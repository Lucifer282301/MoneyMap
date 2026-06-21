export interface SubscriptionStatus {
  plan: "free" | "pro";
  subscriptionStatus: string | null;
  interval: "monthly" | "yearly" | null;
  trialDaysRemaining: number | null;
  currentPeriodEnd: string | null;
}

export interface MessageResponse {
  message: string;
}
