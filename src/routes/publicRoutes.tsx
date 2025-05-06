
import { Route } from "react-router-dom";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";

export const publicRoutes = [
  <Route key="apply" path="/apply/:token" element={<JobApplicationForm />} />,
  <Route key="apply-success" path="/apply/success" element={<ApplicationSuccess />} />
];
