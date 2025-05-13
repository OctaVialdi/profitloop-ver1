
import React from "react";
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from "@/hooks/content-plan";
import { Table } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContentPlanTableHeader, ContentPlanTableBody } from "./table";

interface ContentPlanTableProps {
  contentPlans: ContentPlanItem[];
  contentTypes: ContentType[];
  services: Service[];
  subServices: SubService[];
  contentPillars: ContentPillar[];
  contentPlanners: TeamMember[];
  creativeTeamMembers: TeamMember[];
  loading: boolean;
  selectedItems: string[];
  handleSelectItem: (id: string, checked: boolean) => void;
  handleDateChange: (id: string, date: Date | undefined) => void;
  handleFieldChange: (id: string, field: string, value: any) => void;
  getFilteredSubServices: (serviceId: string) => SubService[];
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function ContentPlanTable({
  contentPlans,
  contentTypes,
  services,
  subServices,
  contentPillars,
  contentPlanners,
  creativeTeamMembers,
  loading,
  selectedItems,
  handleSelectItem,
  handleDateChange,
  handleFieldChange,
  getFilteredSubServices,
  resetRevisionCounter,
  formatDisplayDate,
  extractLink,
  openBriefDialog,
  openTitleDialog
}: ContentPlanTableProps) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="h-[600px] overflow-hidden">
        <ScrollArea className="h-full">
          <div className="min-width-3200 table-auto">
            <Table className="w-full">
              <ContentPlanTableHeader />
              <ContentPlanTableBody
                contentPlans={contentPlans}
                contentTypes={contentTypes}
                services={services}
                subServices={subServices}
                contentPillars={contentPillars}
                contentPlanners={contentPlanners}
                creativeTeamMembers={creativeTeamMembers}
                loading={loading}
                selectedItems={selectedItems}
                handleSelectItem={handleSelectItem}
                handleDateChange={handleDateChange}
                handleFieldChange={handleFieldChange}
                getFilteredSubServices={getFilteredSubServices}
                resetRevisionCounter={resetRevisionCounter}
                formatDisplayDate={formatDisplayDate}
                extractLink={extractLink}
                openBriefDialog={openBriefDialog}
                openTitleDialog={openTitleDialog}
              />
            </Table>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
