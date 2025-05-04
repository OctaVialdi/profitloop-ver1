
import { Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/layout/DashboardLayout";
import HRLayout from "@/components/layout/HRLayout";
import HRDashboard from "@/pages/hr/Dashboard";
import HROKR from "@/pages/hr/OKR";
import HRDataKaryawan from "@/pages/hr/DataKaryawan";
import HRAbsensi from "@/pages/hr/Absensi";
import HRCutiIzin from "@/pages/hr/CutiIzin";
import HRPayroll from "@/pages/hr/Payroll";
import HRKontrak from "@/pages/hr/Kontrak";
import HRTraining from "@/pages/hr/Training";
import HRKinerja from "@/pages/hr/Kinerja";
import HRCompany from "@/pages/hr/Company";
import EmployeeDetail from "@/pages/hr/EmployeeDetail";
import EmployeePersonal from "@/pages/hr/employee/EmployeePersonal";
import EmployeeEmployment from "@/pages/hr/employee/EmployeeEmployment";
import { Outlet } from "react-router-dom";

export const hrRoutes = (
  <Route
    key="hr"
    path="/hr"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <HRLayout>
            <Outlet />
          </HRLayout>
        </DashboardLayout>
      </ProtectedRoute>
    }
  >
    <Route path="dashboard" element={<HRDashboard />} />
    <Route path="okr" element={<HROKR />} />
    <Route path="data" element={<HRDataKaryawan />} />
    <Route path="data/employee/:id" element={<EmployeeDetail />} />
    <Route path="my-info/personal/:id" element={<EmployeePersonal />} />
    <Route path="my-info/employment/:id" element={<EmployeeEmployment />} />
    <Route path="absensi" element={<HRAbsensi />} />
    <Route path="cuti" element={<HRCutiIzin />} />
    <Route path="payroll" element={<HRPayroll />} />
    <Route path="kontrak" element={<HRKontrak />} />
    <Route path="training" element={<HRTraining />} />
    <Route path="kinerja" element={<HRKinerja />} />
    <Route path="company" element={<HRCompany />} />
    {/* Redirect to dashboard if no path matches */}
    <Route path="" element={<Navigate to="/hr/dashboard" replace />} />
  </Route>
);
