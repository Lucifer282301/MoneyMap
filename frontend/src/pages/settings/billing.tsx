import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing</h3>
        <p className="text-sm text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Separator />

      {/* Current Plan */}
      <div className="rounded-lg border p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-lg">Current Plan</h4>
            <p className="text-sm text-muted-foreground">
              You are currently using the Free plan
            </p>
          </div>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            Active
          </span>
        </div>

        <div className="grid gap-2 text-sm">
          <p>✔️ Track unlimited transactions</p>
          <p>✔️ Create and manage budgets</p>
          <p>✔️ View spending analytics</p>
          <p>❌ CSV import and export</p>
          <p>❌ AI-powered financial insights</p>
        </div>
      </div>

      {/* Billing Information */}
      <div className="rounded-lg border p-6 space-y-3">
        <h4 className="font-medium text-lg">Billing Details</h4>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Current Cost</span>
          <span>$0 / month</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Next Billing Date</span>
          <span>No upcoming charges</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment Method</span>
          <span>Not added</span>
        </div>
      </div>

      {/* Upgrade Options */}
      <div className="rounded-lg border p-6 space-y-4">
        <h4 className="font-medium text-lg">Upgrade to Pro</h4>

        <p className="text-sm text-muted-foreground">
          Unlock premium tools to get more control over your finances.
        </p>

        <div className="grid gap-2 text-sm">
          <p>✔️ CSV import and export</p>
          <p>✔️ Advanced reports and analytics</p>
          <p>✔️ AI-powered spending insights</p>
          <p>✔️ Priority support</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-2xl font-bold">$9.99</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>

          <Button>Upgrade to Pro</Button>
        </div>
      </div>
    </div>
  );
};

export default Billing;
