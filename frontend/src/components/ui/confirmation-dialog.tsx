import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { useTransition } from "react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationDialog = ({
  isOpen,
  setIsOpen,
  onConfirm,
  title,
  description,
  confirmText = "Yes",
  cancelText = "Cancel",
}: ConfirmationDialogProps) => {
  const [isPending, startTransition] = useTransition();

  const handleConfirm = () => {
    startTransition(async () => {
      try {
        await onConfirm();
      } catch {
        // errors handled by onConfirm callers
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            type="button"
            disabled={isPending}
            onClick={() => setIsOpen(false)}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleConfirm}
            className="text-white bg-red-500!"
          >
            {isPending && <Loader className="animate-spin" />}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
