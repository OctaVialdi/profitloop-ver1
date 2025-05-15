
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
import { ExpenseBreakdownItem, MonthlyComparisonItem, RecurringExpense, ExpenseTabType } from "./components/types/expense";
import { format } from "date-fns";

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

  // Ensure highestExpense and latestExpense are properly formatted
  const formattedHighestExpense = highestExpense ? {
    amount: highestExpense.amount,
    description: highestExpense.description || '',
    date: highestExpense.date instanceof Date ? format(highestExpense.date, 'yyyy-MM-dd') : String(highestExpense.date)
  } : null;
  
  const formattedLatestExpense = latestExpense ? {
    amount: latestExpense.amount,
    description: latestExpense.description || '',
    date: latestExpense.date instanceof Date ? format(latestExpense.date, 'yyyy-MM-dd') : String(latestExpense.date)
  } : null;

  // Convert recurring expenses to the correct type
  const typedRecurringExpenses: RecurringExpense[] = formattedRecurringExpenses.map(expense => ({
    id: expense.id,
    title: expense.name,
    amount: expense.amount,
    category: expense.category,
    frequency: expense.frequency,
    department: expense.department,
    date: '',  // Add default empty string for date
    isPaid: true  // Assuming all expenses are paid by default
  }));

  // Convert monthly comparison data to the correct type
  const typedMonthlyComparisonData: MonthlyComparisonItem[] = monthlyComparisonData.map(item => ({
    name: item.name,
    amount: item.amount,
    expense: item.amount,  // Using amount for both for compatibility
    income: 0  // Default to 0 for income
  }));

  // Ensure activeTab is of the correct type
  const typedActiveTab: ExpenseTabType = activeTab === "overview" || activeTab === "compliance" || activeTab === "approvals" 
    ? activeTab as ExpenseTabType 
    : "overview";

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
        highestExpense={formattedHighestExpense}
        latestExpense={formattedLatestExpense}
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
        recurringExpenses={typedRecurringExpenses}
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
            onDateFilterChange={setDateFilter}
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
          monthlyComparisonData={typedMonthlyComparisonData}
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
        activeTab={typedActiveTab}
        onTabChange={handleTabChange}
        overviewContent={overviewContent}
      />
    </div>
  );
}
