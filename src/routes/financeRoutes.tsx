
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FinanceLayout from "@/components/layout/FinanceLayout";
import FinanceDashboard from "@/pages/finance/Dashboard";
import Expenses from "@/pages/finance/Expenses";
import ExpenseBudgetForecast from "@/pages/finance/ExpenseBudgetForecast";
import IncomeTarget from "@/pages/finance/IncomeTarget";
import ReminderBills from "@/pages/finance/ReminderBills";
import BillApprovals from "@/pages/finance/BillApprovals";
import PayrollSummary from "@/pages/finance/PayrollSummary";
import CashManagement from "@/pages/finance/CashManagement";
import DaftarTransaksi from "@/pages/finance/DaftarTransaksi";
import { Outlet } from "react-router-dom";
import { ExpensesProvider } from "@/contexts/expenses";

export const financeRoutes = (
  <Route
    key="finance"
    path="/finance"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <FinanceLayout>
            <Outlet />
          </FinanceLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<FinanceDashboard />} />
    <Route path="expenses" element={
      <ExpensesProvider>
        <Expenses />
      </ExpensesProvider>
    } />
    <Route path="expenses/budget/forecast" element={
      <ExpensesProvider>
        <ExpenseBudgetForecast />
      </ExpensesProvider>
    } />
    <Route path="income-target" element={<IncomeTarget />} />
    <Route path="reminder-bills" element={<ReminderBills />} />
    <Route path="reminder-bills/approvals" element={<BillApprovals />} />
    <Route path="payroll-summary" element={<PayrollSummary />} />
    <Route path="cash-management" element={<CashManagement />} />
    <Route path="cash-management/daftar-transaksi" element={<DaftarTransaksi />} />
    {/* Redirect to dashboard if no path matches */}
    <Route path="" element={<Navigate to="/finance/dashboard" replace />} />
  </Route>
);
