
import React from "react";
import TitleCell from "../cells/TitleCell";
import ContentPillarCell from "../cells/ContentPillarCell";
import BriefCell from "../cells/BriefCell";
import { ContentPillar } from "@/hooks/content-plan";

interface ContentSectionProps {
  id: string;
  title: string | null;
  contentPillarId: string | null;
  brief: string | null;
  contentPillars: ContentPillar[];
  handleFieldChange: (id: string, field: string, value: any) => void;
  extractLink: (text: string | null) => string | null;
  openBriefDialog: (id: string, brief: string | null) => void;
  openTitleDialog: (id: string, title: string | null) => void;
}

export default function ContentSection({
  id,
  title,
  contentPillarId,
  brief,
  contentPillars,
  handleFieldChange,
  extractLink,
  openBriefDialog,
  openTitleDialog
}: ContentSectionProps) {
  return (
    <>
      {/* 7. Judul Content */}
      <TitleCell 
        id={id} 
        title={title} 
        openTitleDialog={openTitleDialog} 
      />

      {/* 8. Content Pillar */}
      <ContentPillarCell 
        id={id} 
        contentPillarId={contentPillarId} 
        contentPillars={contentPillars} 
        onChange={handleFieldChange} 
      />

      {/* 9. Brief */}
      <BriefCell 
        id={id} 
        brief={brief} 
        extractLink={extractLink} 
        openBriefDialog={openBriefDialog} 
      />
    </>
  );
}
