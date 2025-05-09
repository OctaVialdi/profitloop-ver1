
import { Route, Navigate } from "react-router-dom";
import HRLayout from "@/components/layout/HRLayout";
import Dashboard from "@/pages/hr/Dashboard";
import DataKaryawan from "@/pages/hr/DataKaryawan";
import EmployeeDetail from "@/pages/hr/EmployeeDetail";
import Absensi from "@/pages/hr/Absensi";
import CutiIzin from "@/pages/hr/CutiIzin";
import Kinerja from "@/pages/hr/Kinerja";
import Payroll from "@/pages/hr/Payroll";
import OKR from "@/pages/hr/OKR";
import Training from "@/pages/hr/Training";
import Kontrak from "@/pages/hr/Kontrak";
import Company from "@/pages/hr/Company";
import AddEmployee from "@/pages/hr/AddEmployee";
import Recruitment from "@/pages/hr/Recruitment";
import { Routes as RecruitmentRoutes } from "@/pages/hr/recruitment";
import CandidateDetail from "@/pages/hr/recruitment/CandidateDetail";

export const hrRoutes = [
  <Route
    key="hr"
    path="/hr"
    element={<HRLayout />}
  >
    <Route index element={<Navigate to="/hr/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="karyawan" element={<DataKaryawan />} />
    <Route path="karyawan/:employeeId" element={<EmployeeDetail />} />
    <Route path="absensi" element={<Absensi />} />
    <Route path="cuti-izin" element={<CutiIzin />} />
    <Route path="kinerja" element={<Kinerja />} />
    <Route path="payroll" element={<Payroll />} />
    <Route path="okr" element={<OKR />} />
    <Route path="training" element={<Training />} />
    <Route path="kontrak" element={<Kontrak />} />
    <Route path="company" element={<Company />} />
    <Route path="add-employee/*" element={<AddEmployee />} />

    {/* Recruitment Routes */}
    <Route path="recruitment" element={<Recruitment />}>
      <Route index element={<RecruitmentRoutes.Dashboard />} />
      <Route path="candidates" element={<RecruitmentRoutes.Candidates />} />
      <Route path="job-positions" element={<RecruitmentRoutes.JobPositions />} />
      <Route path="evaluation-settings" element={<RecruitmentRoutes.EvaluationSettings />} />
      <Route path="invitation-links" element={<RecruitmentRoutes.InvitationLinks />} />
    </Route>
    <Route path="recruitment/candidates/:candidateId" element={<CandidateDetail />} />
  </Route>
];
