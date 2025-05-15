
import { useNavigate } from "react-router-dom";
import { useExpensesData } from "./components/hooks/useExpensesData";
import { ExpenseHeader } from "./components/expense-header/ExpenseHeader";
import { TabsSection } from "./components/expense-tabs/TabsSection";
import { ExpenseStatsCards } from "./components/expense-stats/ExpenseStatsCards";
import { ExpenseBudgetSection } from "./components/budget/ExpenseBudgetSection";
import { TotalExpenseSummary } from "./components/expense-summary/TotalExpenseSummary";
import { RecurringExpensesSection } from "./components/recurring-expenses/RecurringExpensesSection";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExpenseFilters } from "./components/expense-table/ExpenseFilters";
import { ExpenseTable } from "./components/expense-table/ExpenseTable";
import { ExpenseBreakdownChart } from "./components/expense-charts/ExpenseBreakdownChart";
import { MonthlyComparisonChart } from "./components/expense-charts/MonthlyComparisonChart";

// Define the ExpenseBreakdownItem type to match what's expected in the component
interface ExpenseBreakdownItem {
  name: string;
  value: number;
  color: string;
}

export default function Expenses() {
  // Navigation hooks
  const navigate = useNavigate();
  
  // Get expense data and utilities from our custom hook
  const {
    loading,
    error,
    refreshData,
    expenses,
    filteredExpenses,
    categories,
    searchTerm,
    setSearchTerm,
    dateFilter,
    setDateFilter,
    departmentFilter,
    setDepartmentFilter,
    typeFilter,
    setTypeFilter,
    activeTab,
    handleTabChange,
    budgetView,
    handleBudgetViewChange,
    budgetCategories,
    totalExpense,
    currentMonthTotal,
    previousMonthTotal,
    percentageChange,
    highestExpense,
    latestExpense,
    expenseBreakdownData,
    monthlyComparisonData,
    formattedRecurringExpenses,
    uniqueDepartments,
    uniqueExpenseTypes
  } = useExpensesData();

  // Create the overview content
  const overviewContent = (
    <>
      {/* Stats Cards */}
      <ExpenseStatsCards
        loading={loading}
        totalExpense={totalExpense}
        currentMonthTotal={currentMonthTotal}
        previousMonthTotal={previousMonthTotal}
        percentageChange={percentageChange}
        highestExpense={highestExpense}
        latestExpense={latestExpense}
        expenses={expenses}
      />

      {/* Budget Section */}
      <ExpenseBudgetSection
        budgetCategories={budgetCategories}
        budgetView={budgetView}
        onBudgetViewChange={handleBudgetViewChange}
      />

      {/* Total Expenses Summary */}
      <TotalExpenseSummary
        loading={loading}
        totalExpense={totalExpense}
        expensesCount={expenses.length}
      />

      {/* Recurring Expenses */}
      <RecurringExpensesSection
        loading={loading}
        recurringExpenses={formattedRecurringExpenses}
      />

      {/* Expenses Table */}
      <Card className="overflow-hidden shadow-md border">
        {/* Search and filter section */}
        <CardHeader className="bg-gray-50 border-b p-4">
          <ExpenseFilters
            searchTerm={searchTerm}
            dateFilter={dateFilter}
            departmentFilter={departmentFilter}
            typeFilter={typeFilter}
            uniqueDepartments={uniqueDepartments}
            uniqueExpenseTypes={uniqueExpenseTypes}
            onSearchChange={setSearchTerm}
            onDateFilterChange={(date) => setDateFilter(date.toISOString())}
            onDepartmentFilterChange={setDepartmentFilter}
            onTypeFilterChange={setTypeFilter}
          />
        </CardHeader>

        {/* Table */}
        <CardContent className="p-0">
          <ExpenseTable
            loading={loading}
            filteredExpenses={filteredExpenses}
            categories={categories}
            expenses={expenses}
          />
        </CardContent>
      </Card>

      {/* Bottom Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Breakdown */}
        <ExpenseBreakdownChart
          loading={loading}
          expenseBreakdownData={expenseBreakdownData as ExpenseBreakdownItem[]}
          categories={categories}
        />

        {/* Month-over-Month Comparison */}
        <MonthlyComparisonChart
          monthlyComparisonData={monthlyComparisonData}
        />
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      {/* Header and Error section */}
      <ExpenseHeader error={error} onRetry={refreshData} />

      {/* Tabs */}
      <TabsSection
        activeTab={activeTab}
        onTabChange={handleTabChange}
        overviewContent={overviewContent}
      />
    </div>
  );
}
