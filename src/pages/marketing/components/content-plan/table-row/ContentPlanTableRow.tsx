
import React from "react";
import { TableRow } from "@/components/ui/table";
import { ContentPlanItem, ContentType, Service, SubService, ContentPillar } from "@/hooks/content-plan";
import { LegacyEmployee } from "@/hooks/useEmployees";
import ActionCell from "./cells/ActionCell";
import DatePostingCell from "./cells/DatePostingCell";
import ContentTypeCell from "./cells/ContentTypeCell";
import PICCell from "./cells/PICCell";
import ServiceCell from "./cells/ServiceCell";
import SubServiceCell from "./cells/SubServiceCell";
import TitleCell from "./cells/TitleCell";
import ContentPillarCell from "./cells/ContentPillarCell";
import BriefCell from "./cells/BriefCell";
import StatusCell from "./cells/StatusCell";
import RevisionCell from "./cells/RevisionCell";
import ApprovedCell from "./cells/ApprovedCell";
import DoneCell from "./cells/DoneCell";
import LinkCell from "./cells/LinkCell";
import ReadonlyCell from "./cells/ReadonlyCell";

interface ContentPlanTableRowProps {
  item: ContentPlanItem;
  contentTypes: ContentType[];
  services: Service[];
  contentPillars: ContentPillar[];
  contentPlanners: LegacyEmployee[];
  creativeTeamMembers: LegacyEmployee[];
  selectedItems: string[];
  getFilteredSubServices: (serviceId: string) => SubService[];
  handleSelectItem: (id: string, checked: boolean) => void;
  handleDateChange: (id: string, date: Date | undefined) => void;
  handleFieldChange: (id: string, field: string, value: any) => void;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function ContentPlanTableRow({
  item,
  contentTypes,
  services,
  contentPillars,
  contentPlanners,
  creativeTeamMembers,
  selectedItems,
  getFilteredSubServices,
  handleSelectItem,
  handleDateChange,
  handleFieldChange,
  resetRevisionCounter,
  formatDisplayDate,
  extractLink,
  openBriefDialog,
  openTitleDialog
}: ContentPlanTableRowProps) {
  // Helper function to safely get the name of a content type
  const getContentTypeName = () => {
    if (!item.content_type) return "-";
    if (typeof item.content_type === "string") return item.content_type;
    return item.content_type.name || "-";
  };

  return (
    <TableRow key={item.id}>
      {/* 1. Action (Checkbox) */}
      <ActionCell 
        id={item.id} 
        selected={selectedItems.includes(item.id)} 
        onSelectChange={handleSelectItem} 
      />

      {/* 2. Tanggal Posting */}
      <DatePostingCell 
        id={item.id} 
        date={item.post_date} 
        onDateChange={handleDateChange} 
        formatDisplayDate={formatDisplayDate}
      />

      {/* 3. Tipe Content */}
      <ContentTypeCell 
        id={item.id} 
        contentTypeId={item.content_type_id} 
        contentTypes={contentTypes} 
        onChange={handleFieldChange} 
      />

      {/* 4. PIC - Content Planners */}
      <PICCell 
        id={item.id} 
        picId={item.pic_id} 
        teamMembers={contentPlanners} 
        onChange={handleFieldChange} 
        fieldName="pic_id"
      />

      {/* 5. Layanan */}
      <ServiceCell 
        id={item.id} 
        serviceId={item.service_id} 
        services={services} 
        onChange={handleFieldChange} 
      />

      {/* 6. Sub Layanan */}
      <SubServiceCell 
        id={item.id} 
        serviceId={item.service_id} 
        subServiceId={item.sub_service_id} 
        getFilteredSubServices={getFilteredSubServices} 
        onChange={handleFieldChange} 
      />

      {/* 7. Judul Content */}
      <TitleCell 
        id={item.id} 
        title={item.title} 
        openTitleDialog={openTitleDialog} 
      />

      {/* 8. Content Pillar */}
      <ContentPillarCell 
        id={item.id} 
        contentPillarId={item.content_pillar_id} 
        contentPillars={contentPillars} 
        onChange={handleFieldChange} 
      />

      {/* 9. Brief */}
      <BriefCell 
        id={item.id} 
        brief={item.brief} 
        extractLink={extractLink} 
        openBriefDialog={openBriefDialog} 
      />

      {/* 10. Status */}
      <StatusCell 
        id={item.id} 
        status={item.status} 
        onChange={handleFieldChange} 
        fieldName="status"
      />

      {/* 11. Revision */}
      <RevisionCell 
        id={item.id} 
        count={item.revision_count} 
        resetCounter={() => resetRevisionCounter(item.id, 'revision_count')} 
      />

      {/* 12. Approved */}
      <ApprovedCell 
        id={item.id} 
        approved={item.approved} 
        onChange={handleFieldChange} 
        fieldName="approved"
      />

      {/* 13. Tanggal Selesai */}
      <ReadonlyCell 
        value={item.status === "Butuh Di Review" && item.completion_date ? formatDisplayDate(item.completion_date, true) : ""}
        className="text-center"
      />

      {/* 14. Tanggal Upload */}
      <ReadonlyCell 
        value={formatDisplayDate(item.post_date)}
        className="text-center"
      />

      {/* 15. Tipe Content (Mirror) */}
      <ReadonlyCell 
        value={getContentTypeName()}
        className="text-center"
      />

      {/* 16. Judul Content (Mirror) */}
      <ReadonlyCell 
        value={item.title || ""}
      />

      {/* 17. PIC Produksi */}
      <PICCell 
        id={item.id} 
        picId={item.pic_production_id} 
        teamMembers={creativeTeamMembers} 
        onChange={handleFieldChange} 
        fieldName="pic_production_id"
      />

      {/* 18. Link Google Drive */}
      <LinkCell 
        id={item.id}
        link={item.google_drive_link}
        onChange={(value) => handleFieldChange(item.id, 'google_drive_link', value)}
        placeholder="Enter link"
      />

      {/* 19. Status Produksi */}
      <StatusCell 
        id={item.id} 
        status={item.production_status} 
        onChange={handleFieldChange} 
        fieldName="production_status"
      />

      {/* 20. Revisi Counter (Production) */}
      <RevisionCell 
        id={item.id} 
        count={item.production_revision_count} 
        resetCounter={() => resetRevisionCounter(item.id, 'production_revision_count')} 
      />

      {/* 21. Tanggal Selesai Produksi */}
      <ReadonlyCell 
        value={item.production_status === "Butuh Di Review" && item.production_completion_date ? formatDisplayDate(item.production_completion_date, true) : ""}
        className="text-center"
      />

      {/* 22. Approved (Production) */}
      <ApprovedCell 
        id={item.id} 
        approved={item.production_approved} 
        onChange={handleFieldChange} 
        fieldName="production_approved"
      />

      {/* 23. Tanggal Approved */}
      <ReadonlyCell 
        value={item.production_approved && item.production_approved_date ? formatDisplayDate(item.production_approved_date, true) : ""}
        className="text-center"
      />

      {/* 24. Download Link File */}
      <LinkCell 
        asButton
        id={item.id}
        link={item.google_drive_link}
        linkText="Download"
      />

      {/* 25. Link Post */}
      <LinkCell 
        id={item.id}
        link={item.post_link}
        onChange={(value) => handleFieldChange(item.id, 'post_link', value)}
        placeholder="Enter post link"
      />

      {/* 26. Done */}
      <DoneCell 
        id={item.id} 
        done={item.done} 
        onChange={handleFieldChange} 
      />

      {/* 27. Actual Post */}
      <ReadonlyCell 
        value={item.actual_post_date ? formatDisplayDate(item.actual_post_date) : ""}
        className="text-center"
      />

      {/* 28. On Time Status */}
      <ReadonlyCell 
        value={item.on_time_status || ""}
        className="text-center"
      />

      {/* 29. Status Content */}
      <StatusCell 
        id={item.id} 
        status={item.status_content} 
        onChange={handleFieldChange} 
        fieldName="status_content"
        options={[
          { value: "none", label: "-" },
          { value: "Recomended For Ads", label: "Recomended For Ads" },
          { value: "Cancel", label: "Cancel" }
        ]}
      />
    </TableRow>
  );
}
