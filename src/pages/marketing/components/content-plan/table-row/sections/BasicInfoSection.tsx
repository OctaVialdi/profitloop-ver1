
import React from "react";
import ActionCell from "../cells/ActionCell";
import DatePostingCell from "../cells/DatePostingCell";
import ContentTypeCell from "../cells/ContentTypeCell";
import PICCell from "../cells/PICCell";
import { ContentType } from "@/hooks/content-plan";
import { LegacyEmployee } from "@/hooks/useEmployees";

interface BasicInfoSectionProps {
  id: string;
  postDate: string | null;
  contentTypeId: string | null;
  picId: string | null;
  contentTypes: ContentType[];
  contentPlanners: LegacyEmployee[];
  selected: boolean;
  handleSelectItem: (id: string, checked: boolean) => void;
  handleDateChange: (id: string, date: Date | undefined) => void;
  handleFieldChange: (id: string, field: string, value: any) => void;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function BasicInfoSection({
  id,
  postDate,
  contentTypeId,
  picId,
  contentTypes,
  contentPlanners,
  selected,
  handleSelectItem,
  handleDateChange,
  handleFieldChange,
  formatDisplayDate
}: BasicInfoSectionProps) {
  return (
    <>
      {/* 1. Action (Checkbox) */}
      <ActionCell 
        id={id} 
        selected={selected} 
        onSelectChange={handleSelectItem} 
      />

      {/* 2. Tanggal Posting */}
      <DatePostingCell 
        id={id} 
        date={postDate} 
        onDateChange={handleDateChange} 
        formatDisplayDate={formatDisplayDate}
      />

      {/* 3. Tipe Content */}
      <ContentTypeCell 
        id={id} 
        contentTypeId={contentTypeId} 
        contentTypes={contentTypes} 
        onChange={handleFieldChange} 
      />

      {/* 4. PIC - Content Planners */}
      <PICCell 
        id={id} 
        picId={picId} 
        teamMembers={contentPlanners} 
        onChange={handleFieldChange} 
        fieldName="pic_id"
      />
    </>
  );
}
