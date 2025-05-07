
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { getInitials } from "@/lib/utils";
import { CalendarDays, FileText, Home, Mail, Phone, User, Star, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface CandidateDetailSidebarProps {
  candidate: CandidateWithDetails;
}

export const CandidateDetailSidebar: React.FC<CandidateDetailSidebarProps> = ({
  candidate
}) => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  const isActiveTab = (tab: string) => {
    return currentPath.endsWith(`/${tab}`);
  };
  
  return (
    <div className="w-full md:w-72 space-y-4">
      {/* Profile Card */}
      <Card>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src="" alt={candidate.full_name} />
            <AvatarFallback className="text-lg font-medium">
              {getInitials(candidate.full_name)}
            </AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold mb-1">{candidate.full_name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {candidate.job_title || "Candidate"}
          </p>
          
          {candidate.score !== undefined && candidate.score !== null && (
            <div className="flex items-center gap-1 mb-4 p-2 bg-yellow-50 rounded-full px-3">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{candidate.score.toFixed(1)}</span>
            </div>
          )}
          
          <div className="w-full space-y-3 text-sm">
            {candidate.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-left">{candidate.email}</span>
              </div>
            )}
            
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-left">{candidate.phone}</span>
              </div>
            )}
            
            {candidate.address && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-left">{candidate.address}</span>
              </div>
            )}
            
            {candidate.created_at && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate text-left">
                  Applied on {new Date(candidate.created_at).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation Card */}
      <Card>
        <CardContent className="p-4">
          <nav className="flex flex-col space-y-1">
            <Link
              to={`/hr/recruitment/candidate/${candidate.id}/personal`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActiveTab("personal") 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <User className="h-4 w-4 flex-shrink-0" />
              <span>Personal Info</span>
            </Link>
            
            <Link
              to={`/hr/recruitment/candidate/${candidate.id}/education`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActiveTab("education") 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>Education</span>
            </Link>
            
            <Link
              to={`/hr/recruitment/candidate/${candidate.id}/work`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActiveTab("work") 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>Work Experience</span>
            </Link>
            
            <Link
              to={`/hr/recruitment/candidate/${candidate.id}/family`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActiveTab("family") 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              <span>Family</span>
            </Link>
            
            <Link
              to={`/hr/recruitment/candidate/${candidate.id}/evaluation`}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                isActiveTab("evaluation") 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-muted"
              )}
            >
              <ClipboardCheck className="h-4 w-4 flex-shrink-0" />
              <span>Evaluation</span>
            </Link>
          </nav>
        </CardContent>
      </Card>
    </div>
  );
};
