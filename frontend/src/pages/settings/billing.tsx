import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Loader,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  XCircle,
} from "lucide-react";
import ConfirmationDialog from "@/components/ui/confirmation-dialog";
import {
  useGetSubscriptionStatusQuery,
  useCancelSubscriptionMutation,
  useSwitchIntervalMutation,
} from "@/features/billing/billingAPI";
import FakeCheckoutModal from "@/components/billing/fake-checkout-modal";
import { toast } from "sonner";
import { format } from "date-fns";
import { MONTHLY_FEATURES, MONTHLY_PRICE, YEARLY_FEATURES } from "@/constants";
import { useTypedSelector } from "@/app/hook";

const FeatureRow = ({ label }: { label: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
    <span>{label}</span>
  </div>
);

const Billing = () => {
  const { data: subscription, isLoading } = useGetSubscriptionStatusQuery();
  const [cancelSubscription] = useCancelSubscriptionMutation();
  const [switchInterval, { isLoading: isSwitching }] =
    useSwitchIntervalMutation();

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [localYearly, setLocalYearly] = useState(false);
  const [pendingYearly, setPendingYearly] = useState<boolean | null>(null);

  const isPro =
    subscription?.plan === "pro" &&
    subscription?.subscriptionStatus === "active";

  const subscriptionYearly = subscription?.interval === "yearly";
  const isYearly = isPro
    ? pendingYearly !== null
      ? pendingYearly
      : subscriptionYearly
    : localYearly;

  const hasPendingSwitch =
    isPro && pendingYearly !== null && pendingYearly !== subscriptionYearly;

  const currentInterval = subscription?.interval ?? "monthly";
  const daysLeft = subscription?.currentPeriodEnd
    ? Math.ceil(
        (new Date(subscription.currentPeriodEnd).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const isExpiringSoon = isPro && daysLeft !== null && daysLeft <= 5;

  const savingsPercentage = useTypedSelector(
    (state) => state.auth.savingsPercentage,
  );

  const handleToggle = (yearly: boolean) => {
    if (!isPro) {
      setLocalYearly(yearly);
      return;
    }
    setPendingYearly(yearly === subscriptionYearly ? null : yearly);
  };

  const handleSwitch = async () => {
    if (!hasPendingSwitch || pendingYearly === null) return;
    const newInterval = pendingYearly ? "yearly" : "monthly";
    try {
      await switchInterval({ interval: newInterval }).unwrap();
      toast.success(
        `Switched to ${newInterval.toUpperCase()} plan successfully.`,
      );
      setPendingYearly(null);
    } catch {
      toast.error("Failed to switch plan. Please try again.");
    }
  };

  const handleUpgradeSuccess = () => {
    toast.success("Successfully upgraded to Pro plan.");
  };

  const handleCancel = async () => {
    try {
      await cancelSubscription().unwrap();
      toast.success("Subscription canceled successfully.");
      setCancelOpen(false);
    } catch {
      toast.error("Failed to cancel subscription. Please try again.");
    }
  };

  const features = isYearly ? YEARLY_FEATURES : MONTHLY_FEATURES;
  const savingsPct = savingsPercentage ?? 17;
  const yearlyPrice = (MONTHLY_PRICE * 12 * (1 - savingsPct / 100)).toFixed(2);
  const price = isYearly ? `$${yearlyPrice}` : `$${MONTHLY_PRICE.toFixed(2)}`;
  const period = isYearly ? "year" : "month";

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing &amp; Subscriptions</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Separator />

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground py-8 justify-center">
          <Loader className="h-4 w-4 animate-spin" />
          Loading subscription…
        </div>
      ) : (
        <div className="space-y-4">
          {/* Yellow banner: active Pro but renewal is within 5 days (isExpiringSoon = isPro && daysLeft ≤ 5) */}
          {isExpiringSoon && (
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">
                  Trial Expiring
                </p>
                <p className="text-sm text-yellow-700">
                  Trial expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}.
                  Please upgrade.
                </p>
              </div>
            </div>
          )}

          {/* Blue banner: new user who has never subscribed — subscriptionStatus is null, interval is null */}
          {!isPro && subscription?.subscriptionStatus === null && (
            <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <Sparkles className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-800">
                  Get Started with Pro
                </p>
                <p className="text-sm text-blue-700">
                  Buy a plan to unlock all Pro features and take control of your
                  finances.
                </p>
              </div>
            </div>
          )}

          {/* Orange banner: user manually cancelled — subscriptionStatus is "canceled", plan downgraded to free */}
          {!isPro && subscription?.subscriptionStatus === "cancelled" && (
            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3">
              <XCircle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-orange-800">
                  Subscription Cancelled
                </p>
                <p className="text-sm text-orange-700">
                  Your subscription has been cancelled.
                  {subscription.currentPeriodEnd && (
                    <>
                      {" "}
                      Access ended on{" "}
                      {format(
                        new Date(subscription.currentPeriodEnd),
                        "MMMM d, yyyy",
                      )}
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Red banner: trial ended naturally — had an active period but it expired without cancellation */}
          {!isPro &&
            subscription?.subscriptionStatus !== null &&
            subscription?.subscriptionStatus !== "cancelled" &&
            subscription?.currentPeriodEnd &&
            new Date(subscription.currentPeriodEnd) < new Date() && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Trial Expired
                  </p>
                  <p className="text-sm text-red-700">
                    Your trial has expired, please upgrade to continue.
                  </p>
                </div>
              </div>
            )}

          {/* Green banner: active Pro with more than 5 days left — shows current interval and renewal date */}
          {isPro && !isExpiringSoon && (
            <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-green-800">Pro Plan</p>
                <p className="text-sm text-green-700">
                  You are currently on a {currentInterval.toUpperCase()} plan.
                  {subscription?.currentPeriodEnd && (
                    <>
                      {" "}
                      Renews on{" "}
                      {format(
                        new Date(subscription.currentPeriodEnd),
                        "MMMM d, yyyy",
                      )}
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Plan card */}
          <div className="rounded-xl border bg-card p-6 space-y-6">
            {/* Header: title + price on left, toggle on right */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-semibold text-base">Pro Plan</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold">
                    {price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{period}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:mt-1">
                <span className="text-sm text-muted-foreground">Monthly</span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={handleToggle}
                  disabled={isSwitching}
                  className="!cursor-pointer"
                />
                <span className="text-sm text-muted-foreground">Yearly</span>
                {isYearly && (
                  <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                    Save {savingsPct}%
                  </span>
                )}
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-3">
              {features.map((f) => (
                <FeatureRow key={f} label={f} />
              ))}
            </div>

            {/* Action button */}
            {isPro ? (
              hasPendingSwitch ? (
                <Button
                  className="w-full !cursor-pointer !text-white"
                  disabled={isSwitching}
                  onClick={handleSwitch}
                >
                  {isSwitching ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : null}
                  Switch to {pendingYearly ? "YEARLY" : "MONTHLY"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full !cursor-pointer"
                  onClick={() => setCancelOpen(true)}
                >
                  Manage Subscription
                </Button>
              )
            ) : (
              <Button
                className="w-full !cursor-pointer !text-white"
                onClick={() => setCheckoutOpen(true)}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      )}

      <FakeCheckoutModal
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        onSuccess={handleUpgradeSuccess}
        interval={isYearly ? "yearly" : "monthly"}
        yearlyPrice={`$${yearlyPrice}`}
      />

      <ConfirmationDialog
        isOpen={cancelOpen}
        setIsOpen={setCancelOpen}
        onConfirm={handleCancel}
        title="Cancel your subscription?"
        description="You will lose access to Pro features at the end of your current billing period. This action cannot be undone."
        confirmText="Yes, cancel"
        cancelText="Keep Pro"
      />
    </div>
  );
};

export default Billing;
