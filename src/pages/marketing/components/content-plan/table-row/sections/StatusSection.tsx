
import React from "react";
import StatusCell from "../cells/StatusCell";
import RevisionCell from "../cells/RevisionCell";
import ApprovedCell from "../cells/ApprovedCell";
import ReadonlyCell from "../cells/ReadonlyCell";

interface StatusSectionProps {
  id: string;
  status: string;
  revisionCount: number;
  approved: boolean;
  completionDate: string | null;
  statusIsReview: boolean;
  handleFieldChange: (id: string, field: string, value: any) => void;
  resetRevisionCounter: (id: string, field: 'revision_count' | 'production_revision_count') => Promise<boolean>;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function StatusSection({
  id,
  status,
  revisionCount,
  approved,
  completionDate,
  statusIsReview,
  handleFieldChange,
  resetRevisionCounter,
  formatDisplayDate
}: StatusSectionProps) {
  return (
    <>
      {/* 10. Status */}
      <StatusCell 
        id={id} 
        status={status} 
        onChange={handleFieldChange} 
        fieldName="status"
      />

      {/* 11. Revision */}
      <RevisionCell 
        id={id} 
        count={revisionCount} 
        resetCounter={() => resetRevisionCounter(id, 'revision_count')} 
      />

      {/* 12. Approved */}
      <ApprovedCell 
        id={id} 
        approved={approved} 
        onChange={handleFieldChange} 
        fieldName="approved"
      />

      {/* 13. Tanggal Selesai */}
      <ReadonlyCell 
        value={statusIsReview && completionDate ? formatDisplayDate(completionDate, true) : ""}
        className="text-center"
      />
    </>
  );
}
