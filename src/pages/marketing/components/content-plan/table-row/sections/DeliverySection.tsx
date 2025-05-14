
import React from "react";
import LinkCell from "../cells/LinkCell";
import DoneCell from "../cells/DoneCell";
import ReadonlyCell from "../cells/ReadonlyCell";
import StatusCell from "../cells/StatusCell";

interface DeliverySectionProps {
  id: string;
  googleDriveLink: string | null;
  postLink: string | null;
  done: boolean;
  actualPostDate: string | null;
  onTimeStatus: string;
  statusContent: string;
  handleFieldChange: (id: string, field: string, value: any) => void;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function DeliverySection({
  id,
  googleDriveLink,
  postLink,
  done,
  actualPostDate,
  onTimeStatus,
  statusContent,
  handleFieldChange,
  formatDisplayDate
}: DeliverySectionProps) {
  return (
    <>
      {/* 24. Download Link File */}
      <LinkCell 
        asButton
        id={id}
        link={googleDriveLink}
        linkText="Download"
      />

      {/* 25. Link Post */}
      <LinkCell 
        id={id}
        link={postLink}
        onChange={(value) => handleFieldChange(id, 'post_link', value)}
        placeholder="Enter post link"
      />

      {/* 26. Done */}
      <DoneCell 
        id={id} 
        done={done} 
        onChange={handleFieldChange} 
      />

      {/* 27. Actual Post */}
      <ReadonlyCell 
        value={actualPostDate ? formatDisplayDate(actualPostDate) : ""}
        className="text-center"
      />

      {/* 28. On Time Status */}
      <ReadonlyCell 
        value={onTimeStatus || ""}
        className="text-center"
      />

      {/* 29. Status Content */}
      <StatusCell 
        id={id} 
        status={statusContent} 
        onChange={handleFieldChange} 
        fieldName="status_content"
        options={[
          { value: "none", label: "-" },
          { value: "Recomended For Ads", label: "Recomended For Ads" },
          { value: "Cancel", label: "Cancel" }
        ]}
      />
    </>
  );
}
