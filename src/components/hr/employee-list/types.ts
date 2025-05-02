
export interface Employee {
  id: string;
  name: string;
  email: string;
  branch?: string;
  organization?: string;
  jobPosition?: string;
  jobLevel?: string;
  employmentStatus?: string;
  joinDate?: string;
  endDate?: string;
  signDate?: string;
  resignDate?: string;
  barcode?: string;
  birthDate?: string;
  birthPlace?: string;
  address?: string;
  mobilePhone?: string;
  religion?: string;
  gender?: string;
  maritalStatus?: string;
  parentBranch?: string;
  sbu?: string;
}

export type ColumnKey = keyof Omit<Employee, 'id'>;

export interface ColumnDisplayInfo {
  key: ColumnKey;
  label: string;
  group: string;
}
