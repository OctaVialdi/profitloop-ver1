
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
import HRRecruitment from "@/pages/hr/Recruitment";
import AddEmployee from "@/pages/hr/AddEmployee";
import EmployeeDetail from "@/pages/hr/EmployeeDetail";
import EmployeePersonal from "@/pages/hr/employee/EmployeePersonal";
import EmployeeEmployment from "@/pages/hr/employee/EmployeeEmployment";
import CandidateDetail from "@/pages/hr/recruitment/CandidateDetail";
import RecruitmentDashboard from "@/pages/hr/recruitment/Dashboard";
import CandidatesPage from "@/pages/hr/recruitment/Candidates";
import JobPositionsPage from "@/pages/hr/recruitment/JobPositions";
import InvitationLinksPage from "@/pages/hr/recruitment/InvitationLinks";
import EvaluationSettingsPage from "@/pages/hr/recruitment/EvaluationSettings";
import { Outlet } from "react-router-dom";
import CandidateDetailSection from "@/pages/hr/recruitment/candidate-detail/CandidateDetailSection";

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
    {/* Main HR routes */}
    <Route path="dashboard" element={<HRDashboard />} />
    <Route path="okr" element={<HROKR />} />
    <Route path="data" element={<HRDataKaryawan />} />
    <Route path="absensi" element={<HRAbsensi />} />
    <Route path="cuti" element={<HRCutiIzin />} />
    <Route path="payroll" element={<HRPayroll />} />
    <Route path="kontrak" element={<HRKontrak />} />
    <Route path="training" element={<HRTraining />} />
    <Route path="kinerja" element={<HRKinerja />} />
    <Route path="company" element={<HRCompany />} />
    
    {/* Recruitment section - nested under HR */}
    <Route path="recruitment" element={<HRRecruitment />}>
      <Route path="dashboard" element={<RecruitmentDashboard />} />
      <Route path="candidates" element={<CandidatesPage />} />
      <Route path="positions" element={<JobPositionsPage />} />
      <Route path="invitations" element={<InvitationLinksPage />} />
      <Route path="evaluation" element={<EvaluationSettingsPage />} />
      <Route path="" element={<Navigate to="/hr/recruitment/dashboard" replace />} />
    </Route>
    
    {/* Candidate and employee detail routes */}
    <Route path="recruitment/candidate/:id" element={<CandidateDetail />}>
      <Route path="personal" element={<CandidateDetailSection section="personal" />} />
      <Route path="education" element={<CandidateDetailSection section="education" />} />
      <Route path="work" element={<CandidateDetailSection section="work" />} />
      <Route path="family" element={<CandidateDetailSection section="family" />} />
      <Route path="evaluation" element={<CandidateDetailSection section="evaluation" />} />
      <Route path="" element={<Navigate to="personal" replace />} />
    </Route>
    
    {/* Employee detail routes */}
    <Route path="data/employee/:id" element={<EmployeeDetail />} />
    <Route path="data/add-employee" element={<AddEmployee />} />
    <Route path="my-info/personal/:id" element={<EmployeePersonal />} />
    <Route path="my-info/employment/:id" element={<EmployeeEmployment />} />
    
    {/* Redirect to dashboard if no path matches */}
    <Route path="" element={<Navigate to="/hr/dashboard" replace />} />
  </Route>
);
