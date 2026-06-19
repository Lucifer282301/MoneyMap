import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ImportIcon } from "lucide-react";

const ImportTransactionModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="!shadow-none !cursor-pointer !border-gray-500 !text-white !bg-transparent"
        >
          <ImportIcon className="!w-5 !h-5" />
          Bulk Import
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl min-h-[25vh]">
        <DialogHeader>
          <DialogTitle>Bulk Import Transactions</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import transactions.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ImportTransactionModal;
