
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CandidateWithDetails } from "@/services/candidateService";
import { getInitials } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, FileText, Home, Mail, Phone, User, Star, ClipboardCheck } from "lucide-react";

interface CandidateDetailSidebarProps {
  candidate: CandidateWithDetails;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const CandidateDetailSidebar: React.FC<CandidateDetailSidebarProps> = ({
  candidate,
  activeTab,
  onTabChange
}) => {
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
          <Tabs
            orientation="vertical"
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full"
          >
            <TabsList className="flex flex-col items-stretch h-auto gap-1">
              <TabsTrigger value="personal" className="justify-start">
                <User className="h-4 w-4 mr-2" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="education" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                <span>Education</span>
              </TabsTrigger>
              <TabsTrigger value="work" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                <span>Work Experience</span>
              </TabsTrigger>
              <TabsTrigger value="family" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                <span>Family</span>
              </TabsTrigger>
              <TabsTrigger value="evaluation" className="justify-start">
                <ClipboardCheck className="h-4 w-4 mr-2" />
                <span>Evaluation</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
