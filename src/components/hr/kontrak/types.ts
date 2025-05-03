
export enum ContractType {
  CONTRACT = "Contract",
  PROBATION = "Probation",
  PERMANENT = "Permanent",
  TEMPORARY = "Temporary",
  INTERNSHIP = "Internship"
}

export interface KontrakData {
  id: string;
  name: string;
  department: string;
  contractType: ContractType;
  startDate: string;
  endDate: string;
  status: string;
  statusClass: string;
  duration?: string;
  notes?: string;
}

export interface RevisionHistory {
  action: string;
  by: string;
  date: string;
  version: string;
}

export interface ContractDocument {
  version: string;
  signedDate: string;
  signedBy: string;
}
