
import React from "react";
import PICCell from "../cells/PICCell";
import LinkCell from "../cells/LinkCell";
import StatusCell from "../cells/StatusCell";
import RevisionCell from "../cells/RevisionCell";
import ReadonlyCell from "../cells/ReadonlyCell";
import ApprovedCell from "../cells/ApprovedCell";
import { LegacyEmployee } from "@/hooks/useEmployees";

interface ProductionSectionProps {
  id: string;
  picProductionId: string | null;
  googleDriveLink: string | null;
  productionStatus: string;
  productionRevisionCount: number;
  productionCompletionDate: string | null;
  productionApproved: boolean;
  productionApprovedDate: string | null;
  statusIsReview: boolean;
  creativeTeamMembers: LegacyEmployee[];
  handleFieldChange: (id: string, field: string, value: any) => void;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function ProductionSection({
  id,
  picProductionId,
  googleDriveLink,
  productionStatus,
  productionRevisionCount,
  productionCompletionDate,
  productionApproved,
  productionApprovedDate,
  statusIsReview,
  creativeTeamMembers,
  handleFieldChange,
  resetRevisionCounter,
  formatDisplayDate
}: ProductionSectionProps) {
  return (
    <>
      {/* 17. PIC Produksi */}
      <PICCell 
        id={id} 
        picId={picProductionId} 
        teamMembers={creativeTeamMembers} 
        onChange={handleFieldChange} 
        fieldName="pic_production_id"
      />

      {/* 18. Link Google Drive */}
      <LinkCell 
        id={id}
        link={googleDriveLink}
        onChange={(value) => handleFieldChange(id, 'google_drive_link', value)}
        placeholder="Enter link"
      />

      {/* 19. Status Produksi */}
      <StatusCell 
        id={id} 
        status={productionStatus} 
        onChange={handleFieldChange} 
        fieldName="production_status"
      />

      {/* 20. Revisi Counter (Production) */}
      <RevisionCell 
        id={id} 
        count={productionRevisionCount} 
        resetCounter={() => resetRevisionCounter(id, 'production_revision_count')} 
      />

      {/* 21. Tanggal Selesai Produksi */}
      <ReadonlyCell 
        value={statusIsReview && productionCompletionDate ? formatDisplayDate(productionCompletionDate, true) : ""}
        className="text-center"
      />

      {/* 22. Approved (Production) */}
      <ApprovedCell 
        id={id} 
        approved={productionApproved} 
        onChange={handleFieldChange} 
        fieldName="production_approved"
      />

      {/* 23. Tanggal Approved */}
      <ReadonlyCell 
        value={productionApproved && productionApprovedDate ? formatDisplayDate(productionApprovedDate, true) : ""}
        className="text-center"
      />
    </>
  );
}
