import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";

const AppLayout = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col w-full">
          <Outlet />
        </main>
      </div>
      <EditTransactionDrawer />
    </>
  );
};

export default AppLayout;
