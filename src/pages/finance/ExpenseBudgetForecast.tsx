
import { useNavigate } from "react-router-dom";
import { ExpensesProvider } from "@/contexts/ExpensesContext";

export default function ExpenseBudgetForecast() {
  const navigate = useNavigate();

  return (
    <ExpensesProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Expense Budget Forecast</h1>
          <button 
            onClick={() => navigate("/finance/expenses")} 
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            <span>Back to Expenses</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="p-6 bg-white border rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Budget Forecast</h2>
            <p className="text-gray-600">
              This is a placeholder for the Budget Forecast page. In a real application, 
              this would display forecasting charts, trend analysis, and projections for future expenses.
            </p>
          </div>
        </div>
      </div>
    </ExpensesProvider>
  );
}
