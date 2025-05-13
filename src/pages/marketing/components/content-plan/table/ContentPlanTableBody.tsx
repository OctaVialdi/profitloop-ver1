
import React from "react";
import { TableBody } from "@/components/ui/table";
import ContentPlanTableRow from "../table-row";
import { ContentPlanItem, ContentType, TeamMember, Service, SubService, ContentPillar } from "@/hooks/content-plan";

interface ContentPlanTableBodyProps {
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

export default function ContentPlanTableBody({
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
}: ContentPlanTableBodyProps) {
  if (loading) {
    return (
      <TableBody>
        <tr>
          <td colSpan={29} className="h-24 text-center">
            Loading content plan data...
          </td>
        </tr>
      </TableBody>
    );
  }

  if (contentPlans.length === 0) {
    return (
      <TableBody>
        <tr>
          <td colSpan={29} className="h-24 text-center">
            No content plans found. Click "Add Row" to create one.
          </td>
        </tr>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {contentPlans.map(item => (
        <ContentPlanTableRow
          key={item.id}
          item={item}
          contentTypes={contentTypes}
          services={services}
          contentPillars={contentPillars}
          contentPlanners={contentPlanners}
          creativeTeamMembers={creativeTeamMembers}
          selectedItems={selectedItems}
          getFilteredSubServices={getFilteredSubServices}
          handleSelectItem={handleSelectItem}
          handleDateChange={handleDateChange}
          handleFieldChange={handleFieldChange}
          resetRevisionCounter={resetRevisionCounter}
          formatDisplayDate={formatDisplayDate}
          extractLink={extractLink}
          openBriefDialog={openBriefDialog}
          openTitleDialog={openTitleDialog}
        />
      ))}
    </TableBody>
  );
}
