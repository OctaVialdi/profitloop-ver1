
import { Route } from "react-router-dom";
import JobApplicationForm from "@/pages/public/JobApplicationForm";
import ApplicationSuccess from "@/pages/public/ApplicationSuccess";

export const publicRoutes = (
  <>
    <Route path="/apply/:token" element={<JobApplicationForm />} />
    <Route path="/apply/success" element={<ApplicationSuccess />} />
  </>
);
