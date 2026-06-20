import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import TransactionForm from "./transaction-form";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

const blurAndClose = (closeFn: () => void) => () => {
  (document.activeElement as HTMLElement)?.blur();
  closeFn();
};

const EditTransactionDrawer = () => {
  const { open, transactionId, onCloseDrawer } = useEditTransactionDrawer();
  const handleClose = blurAndClose(onCloseDrawer);
  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right">
      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">
            Edit Transaction
          </DrawerTitle>
          <DrawerDescription>
            Edit a transaction to track your finances
          </DrawerDescription>
        </DrawerHeader>
        <TransactionForm
          isEdit
          transactionId={transactionId}
          onCloseDrawer={handleClose}
        />
      </DrawerContent>
    </Drawer>
  );
};

export default EditTransactionDrawer;
