
import React from "react";
import { Outlet } from "react-router-dom";
import TrialBanner from "@/components/TrialBanner";

const AppLayout: React.FC = () => {
  return (
    <>
      <TrialBanner />
      <Outlet />
    </>
  );
};

export default AppLayout;
