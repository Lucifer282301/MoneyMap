import { SubscriptionStatus } from "@/features/billing/billingType";

export const isProUser = (
  subscription: SubscriptionStatus | undefined,
): boolean => {
  return (
    subscription?.plan === "pro" &&
    subscription?.subscriptionStatus === "active"
  );
};

export const getDaysRemaining = (
  currentPeriodEnd: string | null | undefined,
): number | null => {
  if (!currentPeriodEnd) return null;
  return Math.ceil(
    (new Date(currentPeriodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
};
