
import { Route, Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import FinanceLayout from "@/components/layout/FinanceLayout";
import Dashboard from "@/pages/finance/Dashboard";
import BillApprovals from "@/pages/finance/BillApprovals";
import ReminderBills from "@/pages/finance/ReminderBills";
import ExpenseBudget from "@/pages/finance/ExpenseBudget";
import Expenses from "@/pages/finance/Expenses";
import ExpenseBudgetForecast from "@/pages/finance/ExpenseBudgetForecast";
import PayrollSummary from "@/pages/finance/PayrollSummary";
import IncomeTarget from "@/pages/finance/IncomeTarget";
import CashManagement from "@/pages/finance/CashManagement";
import DaftarTransaksi from "@/pages/finance/DaftarTransaksi";

export const financeRoutes = [
  <Route
    key="finance"
    path="/finance"
    element={<FinanceLayout><Outlet /></FinanceLayout>}
  >
    <Route index element={<Navigate to="/finance/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="bill-approvals" element={<BillApprovals />} />
    <Route path="reminder-bills" element={<ReminderBills />} />
    <Route path="expense-budget" element={<ExpenseBudget />} />
    <Route path="expenses" element={<Expenses />} />
    <Route path="expense-budget-forecast" element={<ExpenseBudgetForecast />} />
    <Route path="payroll-summary" element={<PayrollSummary />} />
    <Route path="income-target" element={<IncomeTarget />} />
    <Route path="cash-management" element={<CashManagement />} />
    <Route path="transaksi" element={<DaftarTransaksi />} />
  </Route>
];
