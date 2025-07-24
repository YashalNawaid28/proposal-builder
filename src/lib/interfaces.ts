export interface ICallDetail {
  callId: string;
  direction: 'Inbound' | 'Outbound';
  duration: number; // in minutes
  subject: string;
  date: string; // ISO string
  status: 'Completed' | 'Missed' | 'In Progress';
}

export interface ISignOption {
  label: string;
  type: 'Dropdown' | 'User Input';
  checked: boolean;
  icon?: string; // Optional: for UI icon reference
}

export interface IAccount {
  signImage: string;
  signName: string;
  signDescription: string;
  status: 'Active' | 'Inactive';
  dateAdded: string; // e.g. 'Aug 1st, 2025'
  signOptions: ISignOption[];
  details: ISignDetail[];
}

export interface ISignDetail {
  size: string;
  signPrice: string;
  installPrice: string;
  signBudget: string;
  installBudget: string;
  raceway: string;
} 