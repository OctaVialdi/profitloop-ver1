
import React from "react";
import { TableRow } from "@/components/ui/table";
import { ContentPlanItem, ContentType, Service, SubService, ContentPillar } from "@/hooks/content-plan";
import { LegacyEmployee } from "@/hooks/useEmployees";
import {
  BasicInfoSection,
  ServiceSection,
  ContentSection,
  StatusSection,
  MirrorSection,
  ProductionSection,
  DeliverySection
} from "./sections";

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

  // Check if status is "Butuh Di Review" for conditional rendering
  const statusIsReview = item.status === "Butuh Di Review";
  const productionStatusIsReview = item.production_status === "Butuh Di Review";

  return (
    <TableRow key={item.id}>
      {/* Basic Info Section */}
      <BasicInfoSection
        id={item.id}
        postDate={item.post_date}
        contentTypeId={item.content_type_id}
        picId={item.pic_id}
        contentTypes={contentTypes}
        contentPlanners={contentPlanners}
        selected={selectedItems.includes(item.id)}
        handleSelectItem={handleSelectItem}
        handleDateChange={handleDateChange}
        handleFieldChange={handleFieldChange}
        formatDisplayDate={formatDisplayDate}
      />

      {/* Service Section */}
      <ServiceSection
        id={item.id}
        serviceId={item.service_id}
        subServiceId={item.sub_service_id}
        services={services}
        getFilteredSubServices={getFilteredSubServices}
        handleFieldChange={handleFieldChange}
      />

      {/* Content Section */}
      <ContentSection
        id={item.id}
        title={item.title}
        contentPillarId={item.content_pillar_id}
        brief={item.brief}
        contentPillars={contentPillars}
        handleFieldChange={handleFieldChange}
        extractLink={extractLink}
        openBriefDialog={openBriefDialog}
        openTitleDialog={openTitleDialog}
      />

      {/* Status Section */}
      <StatusSection
        id={item.id}
        status={item.status}
        revisionCount={item.revision_count}
        approved={item.approved}
        completionDate={item.completion_date}
        statusIsReview={statusIsReview}
        handleFieldChange={handleFieldChange}
        resetRevisionCounter={resetRevisionCounter}
        formatDisplayDate={formatDisplayDate}
      />

      {/* Mirror Section */}
      <MirrorSection
        postDate={item.post_date}
        contentTypeName={getContentTypeName()}
        title={item.title}
        formatDisplayDate={formatDisplayDate}
      />

      {/* Production Section */}
      <ProductionSection
        id={item.id}
        picProductionId={item.pic_production_id}
        googleDriveLink={item.google_drive_link}
        productionStatus={item.production_status}
        productionRevisionCount={item.production_revision_count}
        productionCompletionDate={item.production_completion_date}
        productionApproved={item.production_approved}
        productionApprovedDate={item.production_approved_date}
        statusIsReview={productionStatusIsReview}
        creativeTeamMembers={creativeTeamMembers}
        handleFieldChange={handleFieldChange}
        resetRevisionCounter={resetRevisionCounter}
        formatDisplayDate={formatDisplayDate}
      />

      {/* Delivery Section */}
      <DeliverySection
        id={item.id}
        googleDriveLink={item.google_drive_link}
        postLink={item.post_link}
        done={item.done}
        actualPostDate={item.actual_post_date}
        onTimeStatus={item.on_time_status || ""}
        statusContent={item.status_content || ""}
        handleFieldChange={handleFieldChange}
        formatDisplayDate={formatDisplayDate}
      />
    </TableRow>
  );
}
