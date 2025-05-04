
import React from "react";
import { Navigate } from "react-router-dom";

export default function TicketSystem() {
  // Redirect to the main support page which now includes the ticket system
  return <Navigate to="/it/support" replace />;
}
