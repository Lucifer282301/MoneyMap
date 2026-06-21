import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, CreditCard, Loader, CheckCircle2 } from "lucide-react";
import { useConfirmUpgradeMutation } from "@/features/billing/billingAPI";
import { toast } from "sonner";
import { PLAN_CONFIG, MONTHLY_PRICE } from "@/constants";

interface FakeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  interval: "monthly" | "yearly";
  yearlyPrice?: string;
}


const FakeCheckoutModal = ({
  open,
  onOpenChange,
  onSuccess,
  interval,
  yearlyPrice,
}: FakeCheckoutModalProps) => {
  const [step, setStep] = useState<"form" | "processing" | "success">("form");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12 / 28");
  const [cvc, setCvc] = useState("123");
  const [name, setName] = useState("");

  const [confirmUpgrade] = useConfirmUpgradeMutation();
  const planBase = PLAN_CONFIG[interval];
  const price =
    interval === "yearly"
      ? (yearlyPrice ?? `$${MONTHLY_PRICE.toFixed(2)}`)
      : `$${MONTHLY_PRICE.toFixed(2)}`;
  const plan = { ...planBase, price };

  const resetForm = useCallback(() => {
    setStep("form");
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12 / 28");
    setCvc("123");
    setName("");
  }, []);

  const formatCardNumber = (value: string): string =>
    value
      .replace(/\D/g, "")
      .slice(0, 16)
      .replace(/(.{4})/g, "$1 ")
      .trim();

  const formatExpiry = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    return digits.length >= 3
      ? `${digits.slice(0, 2)} / ${digits.slice(2)}`
      : digits;
  };

  const handlePay = useCallback(async () => {
    setStep("processing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      await confirmUpgrade({ interval }).unwrap();
      setStep("success");
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        resetForm();
      }, 1500);
    } catch {
      toast.error("Payment failed. Please try again.");
      setStep("form");
    }
  }, [confirmUpgrade, interval, onSuccess, onOpenChange, resetForm]);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (step === "processing") return;
      if (!isOpen) resetForm();
      onOpenChange(isOpen);
    },
    [step, onOpenChange, resetForm],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md"
        aria-describedby={undefined}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {step === "success" ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <CheckCircle2 className="h-14 w-14 text-green-500" />
            <p className="text-lg font-semibold">Payment successful!</p>
            <p className="text-sm text-muted-foreground">Welcome to MoneyMap Pro</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded bg-[#635bff] flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <DialogTitle className="text-base">MoneyMap &mdash; Pro Plan</DialogTitle>
              </div>
              <DialogDescription className="sr-only">
                Fake checkout form for Pro plan
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
              <div className="flex justify-between font-medium">
                <span>MoneyMap Pro</span>
                <span>{plan.price}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>{plan.label}</span>
                <span>{plan.period}</span>
              </div>
              <Separator className="my-1" />
              <div className="flex justify-between font-semibold">
                <span>Total due today</span>
                <span>{plan.price}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Card number</Label>
                <div className="relative">
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 1234 1234 1234"
                    className="pr-10 font-mono tracking-wider"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Expiry date</Label>
                  <Input
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM / YY"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">CVC</Label>
                  <Input
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Name on card</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Smith"
                />
              </div>
            </div>

            <Button
              className="w-full !cursor-pointer !text-white gap-2"
              onClick={handlePay}
              disabled={step === "processing"}
            >
              {step === "processing" ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Pay {plan.price}
                </>
              )}
            </Button>

            <p className="text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              Secured by Stripe &middot; Cancel anytime
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FakeCheckoutModal;
