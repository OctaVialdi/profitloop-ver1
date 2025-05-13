
// Common types for content management hooks

// Type definitions from original useContentManagement
export interface ContentType {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
}

export interface SubService {
  id: string;
  serviceId: string;
  name: string;
}

export interface ContentPillar {
  id: string;
  name: string;
}

export interface ContentItem {
  id: string;
  postDate: string | undefined;
  contentType: string;
  isSelected: boolean;
  pic: string;
  service: string;
  subService: string;
  title: string;
  contentPillar: string;
  brief: string;
  status: string;
  revisionCount: number;
  isApproved: boolean;
  completionDate: string | undefined;
  // Production fields
  picProduction: string;
  googleDriveLink: string;
  productionStatus: string;
  productionRevisionCount: number;
  productionCompletionDate: string | undefined;
  productionApproved: boolean;
  productionApprovedDate: string | undefined;
  // Publishing fields
  downloadLinkFile: string;
  postLink: string;
  isDone: boolean;
  actualPostDate: string | undefined;
  onTimeStatus: string;
  contentStatus: string;
}
