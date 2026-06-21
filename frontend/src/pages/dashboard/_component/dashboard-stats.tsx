import { useSummaryAnalyticsQuery } from "@/features/analytics/analyticsAPI";
import SummaryCard from "./summary-card";
import { DateRangeType } from "@/components/date-range-select";

const DashboardStats = ({ dateRange }: { dateRange?: DateRangeType }) => {
  const { data, isFetching } = useSummaryAnalyticsQuery(
    { preset: dateRange?.value },
    { skip: !dateRange },
  );
  const summaryData = data?.data;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 scrollbar-hide">
      <SummaryCard
        title="Available Balance"
        value={summaryData?.availableBalance}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.balance}
        isLoading={isFetching}
        cardType="balance"
      />
      <SummaryCard
        title="Total Income"
        value={summaryData?.totalIncome}
        percentageChange={summaryData?.percentageChange?.income}
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="income"
      />
      <SummaryCard
        title="Total Expenses"
        value={summaryData?.totalExpenses}
        dateRange={dateRange}
        percentageChange={summaryData?.percentageChange?.expenses}
        isLoading={isFetching}
        cardType="expenses"
      />
      <SummaryCard
        title="Savings Rate"
        value={summaryData?.savingsRate?.percentage}
        expenseRatio={summaryData?.savingsRate?.expenseRatio}
        isPercentageValue
        dateRange={dateRange}
        isLoading={isFetching}
        cardType="savings"
      />
    </div>
  );
};

export default DashboardStats;
