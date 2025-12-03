import { DataArray } from "../components/Table/types";

export type FormDetails = {
  _id?: string;
  moduleId: string;
  code: string;
  formInfo: { [key: string]: string | undefined };
  attachments: string[];
  msaAttachments?: string[];
  department: string | undefined;
  departmentName: string | undefined;
  workflow?: string;
  workflowName?: string;
  workflowVersion?: string;
  executiveApprove?: boolean;
  status?: string;
  active?: boolean;
  created_by: string;
  created_at?: string;
  updated_at?: Date;
  formHistory: FormHistory[];
  mailRedirectPath?: string;
};

export type EditFormDetails = {
  _id?: string;
  moduleId: string;
  formInfo: { [key: string]: string };
  attachments: string[];
  created_by: string;
};

export interface FormHistory {
  approvedBy: string;
  status: string;
  workflow: string;
  workflowName: string;
  department: string;
  departmentName: string;
  created_at: number;
}

export type VendorFormInfo = {
  requested_name: string;
  requested_email: string;
  business_case: string;
  nom_auth_limit: string;
  contract_party: string;
  parties: string;
  desc_agreement: string;
  term: string;
  start_date: string;
  end_date: string;
  monetary_value: string;
  termination: string;
  key_risk: string;
  special_terms: string;
  arms_length_transaction: string;
  credit_check_status: string;
  modern_slavery_questionnaire: string;
  code_of_conduct: string;
  is_capex_item: string;
  moduleId: string;
};

export interface PermissionApiResponse {
  data: { data: boolean };
}

export interface PaginationMeta {
  totalRowCount: number;
  start: number;
  size: number;
  sorting: { id: string; desc: boolean }[];
}

export interface ListApiResponse {
  message: string;
  data: DataArray[];
  meta: {
    pagination: {
      totalRowCount: number;
      start: number;
      size: number;
      sorting: {
        id: string;
        desc: boolean;
      }[];
    };
  };
}

export interface ListConfigApiResponse {
  message: string;
  data: {
    _id: string;
    active : boolean,
    workflowOrder: DataArray[];
    meta: {
      pagination: {
        totalRowCount: number;
        start: number;
        size: number;
        sorting: {
          id: string;
          desc: boolean;
        }[];
      };
    };
  }[];
}

export interface DropDownItem {
  _id: string;
  name: string;
}

export interface DropDownApiResponse {
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;
}

export interface SettingApiResponse {
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  Data: any;
}

export interface SubMenu {
  id: string;
  name: string;
  icon: string;
  href: string;
  current: boolean;
  open: boolean;
  subMenu: boolean;
  subMenuList: SubMenu[];
  module_index: number;
  code: string;
}

export interface NavigationItem {
  id: string;
  name: string;
  href: string;
  icon: string;
  current: boolean;
  open: boolean;
  subMenu: boolean;
  subMenuList: SubMenu[];
  module_index: number;
  code: string;
}

export interface SideBarApiResponse {
  message?: string;
  data: NavigationItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  href?: string;
  icon: string;
  current: boolean;
  open: boolean;
  subMenu: boolean;
  subMenuList: MenuItem[];
}

export interface DetailApiResponse {
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  data: any;
}

export interface MenuAccessResponse {
  data: MenuItem[];
}

export interface SuccessResponse<T> {
  data: T[];
  message: string;
}

export interface FormResponse {
  message: string;
  newFormModule: FormDetails;
}

export type UserFormDetails = {
  name: string;
  email: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  department: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  roles: any;
  status: boolean;
};

export interface SwitchUserOptions {
  name: string;
  email: string;
  department: string[];
  roles: string[];
}

export interface SwitchUserApiResponse {
  message: string;
  data: SwitchUserOptions[];
}