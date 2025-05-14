
import React from "react";
import ReadonlyCell from "../cells/ReadonlyCell";

interface MirrorSectionProps {
  postDate: string | null;
  contentTypeName: string;
  title: string | null;
  formatDisplayDate: (dateString: string | null, includeTime?: boolean) => string;
}

export default function MirrorSection({
  postDate,
  contentTypeName,
  title,
  formatDisplayDate
}: MirrorSectionProps) {
  return (
    <>
      {/* 14. Tanggal Upload */}
      <ReadonlyCell 
        value={formatDisplayDate(postDate)}
        className="text-center"
      />

      {/* 15. Tipe Content (Mirror) */}
      <ReadonlyCell 
        value={contentTypeName}
        className="text-center"
      />

      {/* 16. Judul Content (Mirror) */}
      <ReadonlyCell 
        value={title || ""}
      />
    </>
  );
}
