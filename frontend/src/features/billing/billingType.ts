export type SubscriptionStatusValue =
  | "active"
  | "cancelled"
  | "trialing"
  | "past_due"
  | null;

export interface SubscriptionStatus {
  plan: "free" | "pro";
  subscriptionStatus: SubscriptionStatusValue;
  interval: "monthly" | "yearly" | null;
  currentPeriodEnd: string | null;
}

export interface MessageResponse {
  message: string;
}
