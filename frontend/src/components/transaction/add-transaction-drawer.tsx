import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    (document.activeElement as HTMLElement)?.blur();
    setOpen(false);
  };

  const handleOpen = () => {
    (document.activeElement as HTMLElement)?.blur();
    setOpen(true);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) (document.activeElement as HTMLElement)?.blur();
    setOpen(next);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={handleOpenChange}>
      <Button className="!cursor-pointer !text-white" onClick={handleOpen}>
        <PlusIcon className="h-4 w-4" />
        Add Transaction
      </Button>
      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto">
        <DrawerHeader className="relative">
          <div>
            <DrawerTitle className="text-xl font-semibold">
              Add Transaction
            </DrawerTitle>
            <DrawerDescription>
              Add a new transaction to track your finances
            </DrawerDescription>
          </div>
          <DrawerClose className="absolute top-4 right-4">
            <XIcon className="h-5 w-5 !cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>
        <TransactionForm onCloseDrawer={onCloseDrawer} />
      </DrawerContent>
    </Drawer>
  );
};

export default AddTransactionDrawer;
