
// Column configuration for ContentTabsTable

// Column sets for each tab
export const primaryColumns = [
  "selectColumn", 
  "postDate", 
  "contentType", 
  "pic", 
  "service", 
  "subService", 
  "title"
];

export const detailsColumns = [
  "selectColumn", 
  "contentPillar", 
  "brief", 
  "status", 
  "revision", 
  "approved"
];

export const publishingColumns = [
  "selectColumn", 
  "completionDate", 
  "mirrorPostDate", 
  "mirrorContentType", 
  "mirrorTitle"
];

// Column visibility configuration
export interface ColumnVisibilityConfig {
  [key: string]: boolean;
}

export const defaultColumnVisibility: ColumnVisibilityConfig = {
  selectColumn: true,
  postDate: true,
  contentType: true,
  pic: true,
  service: true,
  subService: true,
  title: true,
  contentPillar: true,
  brief: true,
  status: true,
  revision: true,
  approved: true,
  completionDate: true,
  mirrorPostDate: true,
  mirrorContentType: true,
  mirrorTitle: true
};
