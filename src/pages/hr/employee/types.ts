
export interface FormValues {
  // Personal information
  firstName?: string;
  lastName?: string;
  email?: string;
  mobilePhone?: string;
  phone?: string;
  birthPlace?: string;
  birthdate?: Date;
  gender?: string;
  maritalStatus?: string;
  bloodType?: string;
  religion?: string;
  
  // Identity information
  nik?: string;
  passportNumber?: string;
  passportExpiry?: Date;
  postalCode?: string;
  citizenAddress?: string;
  residentialAddress?: string;
  useResidentialAddress?: boolean;
  
  // Employment information
  employeeId: string;
  barcode: string;
  groupStructure: string;
  employmentStatus: string;
  branch: string;
  organization: string;
  jobPosition: string;
  jobLevel: string;
  grade: string;
  class: string;
  schedule: string;
  approvalLine: string;
  manager: string;
  
  // Dialog form fields
  statusName: string;
  statusHasEndDate: boolean;
  orgCode: string;
  orgName: string;
  parentOrg: string;
  positionCode: string;
  positionName: string;
  parentPosition: string;
  levelCode: string;
  levelName: string;
}

export interface SBUItem {
  group: string;
  name: string;
}
