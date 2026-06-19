import { DataTable } from "@/components/data-table";
import { TRANSACTION_DATA } from "./data";
import { transactionColumns } from "./column";
import { TRANSACTION_OPTIONS } from "@/constants";

const TransactionTable = () => {
  const handleSearch = (value: string) => {
    console.log(value);
  };
  const handleFilterChange = () => {};
  const handleBulkDelete = (ids: string[]) => {
    console.log(ids);
  };

  return (
    <DataTable
      data={TRANSACTION_DATA}
      columns={transactionColumns}
      searchPlaceholder="Search transactions..."
      filters={[
        {
          key: "type",
          label: "All Types",
          options: [
            { value: TRANSACTION_OPTIONS.INCOME, label: "Income" },
            { value: TRANSACTION_OPTIONS.EXPENSE, label: "Expense" },
          ],
        },
        {
          key: "frequently",
          label: "Frequently",
          options: [
            { value: "RECURRING", label: "Recurring" },
            { value: "NON_RECURRING", label: "Non-Recurring" },
          ],
        },
      ]}
      onSearch={handleSearch}
      onFilterChange={handleFilterChange}
      onBulkDelete={handleBulkDelete}
    />
  );
};
export default TransactionTable;
