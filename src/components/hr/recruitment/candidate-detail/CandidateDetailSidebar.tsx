
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import {
  User,
  GraduationCap,
  Briefcase,
  Users,
  Star
} from "lucide-react";

interface CandidateDetailSidebarProps {
  candidate: CandidateWithDetails;
}

export const CandidateDetailSidebar: React.FC<CandidateDetailSidebarProps> = ({
  candidate
}) => {
  const location = useLocation();
  const basePath = `/hr/recruitment/candidate/${candidate.id}`;
  const currentPath = location.pathname;
  
  const menuItems = [
    {
      name: "Personal Info",
      path: `${basePath}/personal`,
      icon: User
    },
    {
      name: "Education",
      path: `${basePath}/education`,
      icon: GraduationCap
    },
    {
      name: "Work Experience",
      path: `${basePath}/work`,
      icon: Briefcase
    },
    {
      name: "Family",
      path: `${basePath}/family`,
      icon: Users
    },
    {
      name: "Evaluation",
      path: `${basePath}/evaluation`,
      icon: Star
    }
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0">
      <Card className="p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <User className="h-12 w-12 text-primary/60" />
          </div>
          <h2 className="font-bold text-xl">{candidate.full_name}</h2>
          <p className="text-gray-500 text-sm">{candidate.email}</p>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-md text-sm
                ${currentPath === item.path 
                  ? "bg-primary text-white font-medium" 
                  : "hover:bg-gray-100 text-gray-700"}
              `}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </Card>
    </div>
  );
};
