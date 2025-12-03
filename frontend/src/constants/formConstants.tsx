export const NewFormConstants = {
  REQUESTER_NAME: "requester_name",
  REQUESTER_EMAIL: "requester_email",
  IS_BEHALF_HIRING_MANAGER: "is_behalf_hiring_manager",
  ROLE_REPORTING_EMAIL: "role_reporting_email",
  ROLE_REPORTING: "role_reporting",
  ROLE_NAME: "role_name",
  DEPARTMENT: "department",
  DEPARTMENT_NAME: "departmentName",
  CREATED_DATE: "created_date",
  HEADCOUNT: "headcount",
  IS_ROLE_IN_BUDGET: "is_role_in_budget",
  IS_NEW_ROLE_OR_REPLACEMENT: "is_new_role_or_replacement",
  IS_MAXTERM_OR_PERMANENT: "is_maxterm_or_permanent",
  MAX_TERM_LENGTH: "max_term_length",
  IS_FULLTIME_OR_PARTITME: "is_fulltime_or_parttime",
  HRS_PER_WEEK: "hrs_per_week",
  PURPOSE: "purpose",
  ANALYSIS: "analysis",
  IMG_POSITION_DESC: "img_position_desc",
  REVIEW_CURRENT_TEAM: "review_current_team",
  HAS_POSITION_BENCHMARKED: "has_position_benchmarked",
  AON_ROLE_CODE: "aon_role_code",
  EXPLANATION_DETAILS: "explanation_details",
  BASE_SALARY: "base_salary",
  ADDTIONAL_BENEFITS: "additional_benefits",
  BUS_DRIVER: "bus_driver",
  IMPACT_DONT_HIRE: "impact_dont_hire",
  TOP_FIVE_KPI: "top_five_kpi"
};

type NewFormValues = (typeof NewFormConstants)[keyof typeof NewFormConstants];
export type NewFormProps = {
  [key in NewFormValues]: string;
};

export const VendorFormConstants = {
  requesterName: "requester_name",
  requesterEmail: "requester_email",
  department: "department",
  departmentName: "departmentName",
  generalManager: "generalManager",
  generalManagerName: "generalManagerName",
  approvalBeingSought: "approval_being_sought",
  expenditure_approval: "expenditure_approval",
  expenditure_approval_explain: "expenditure_approval_explain",
  expenditure_contract: "expenditure_contract",
  deliver_contract: "deliver_contract",
  type_of_engagement: "type_of_engagement",
  internal_resources: "internal_resources",
  if_no_justify_exp_contract: "if_no_justify_exp_contract",
  businessCase: "business_case",
  relevantFinancialBudget: "relevant_financial_budget",
  isSSTApproval: "is_SST_approval",
  if_no_justify_SST: "if_no_justify_SST",
  if_no_justify_modern_slavery: "if_no_justify_modern_slavery",
  if_no_justify_supplier_code_conduct: "if_no_justify_supplier_code_conduct",
  nrlEntity: "nrl_entity",
  currency: "currency",
  other_currency: "other_currency",
  counterParty: "counter_party",
  desc_agreement: "desc_agreement",
  term: "term",
  startDate: "start_date",
  endDate: "end_date",
  monetaryValue: "monetary_value",
  monetaryValueCurrency: "monetary_value_currency",
  termination: "termination",
  reputationalRisk: "reputational_risk",
  specialOrUnusual: "special_or_unusual",
  armsLengthTransact: "arms_length_transact",
  contractCounterparty: "contract_counterparty",
  includeContractForm: "include_contract_form",
  provideSupplierCode: "provide_supplier_code",
  contractTechReview: "contract_tech_review",
  isCapitalExpenditure: "is_capital_expenditure",
  if_yes_arms_length_transact: "if_yes_arms_length_transact",
  if_no_contract_counterparty: "if_no_contract_counterparty",
  if_yes_is_capital_expenditure: "if_yes_is_capital_expenditure",
  other_comments: "other_comments"
};

export interface VendorFormNewProps {
  requester_name: string;
  requester_email: string;
  department: string;
  departmentName: string;
  generalManager: string;
  generalManagerName: string;
  approval_being_sought: string;
  expenditure_approval: string;
  expenditure_approval_explain: string;
  expenditure_contract: string;
  deliver_contract: string;
  type_of_engagement: string;
  internal_resources: string;
  if_no_justify_exp_contract: string;
  if_no_justify_SST: string;
  if_no_justify_modern_slavery: string;
  if_no_justify_supplier_code_conduct: string;
  termination: string;
  monetary_value: string;
  monetary_value_currency: string;
  business_case: string;
  relevant_financial_budget: string;
  is_SST_approval: string;
  nrlEntity: string;
  currency: string;
  other_currency: string;
  term: string;
  reputational_risk: string;
  desc_agreement: string;
  start_date: string;
  end_date: string;
  special_or_unusual: string;
  arms_length_transact: string;
  contract_counterparty: string;
  include_contract_form: string;
  provide_supplier_code: string;
  contract_tech_review: string;
  is_capital_expenditure: string;
  if_yes_arms_length_transact: string;
  if_no_contract_counterparty: string;
  if_yes_is_capital_expenditure: string;
  other_comments: string;
}

type VendorFormKeys = (typeof VendorFormConstants)[keyof typeof VendorFormConstants];

export type VendorFormProps = {
  [key in VendorFormKeys]: string;
};

export const RadioOptionsDefaults = [
  { id: "yes", text: "Yes" },
  { id: "no", text: "No" }
];

export type AlertInfoProps = {
  title?: string;
  message?: string;
  redirectUrl?: string;
  type?: string;
};

export type AlertMainProps = {
  alertInfo?: AlertInfoProps;
  open: boolean;
};

export const AddEditUserFromConstants = {
  name: "name",
  email: "email",
  department: "department",
  roles: "roles",
  status: "status"
};

export const AddEditDepartmentFormConstants = {
  name: "name",
  description: "description",
  modules: "moduleId",
  roles: "roles",
  vendor_entity_flag: "vendorEntityFlag",
  status: "status"
};

export const AddOrEditRoles = {
  name: "name",
  description: "description",
  moduleId: "moduleId",
  roles: "roles",
  isAdditionalAccess: "isAdditionalAccess",
  superAdmin: "superAdmin",
  moduleAdmin: "moduleAdmin",
  permissions: "permissions"
};

export const AddOrEditPermission = {
  navigation: "navigation",
  module: "module",
  page: "page",
  component: "component",
  action: "action"
};

export const AddOrEditModules = {
  name: "name",
  description: "description",
  status: "status",
  _id: "_id",
  code: "code",
  created_at: "created_at",
  updated_at: "updated_at",
  __v: "__v"
};

export type ModuleInfoProp = {
  name: string;
  description: string;
  status: boolean;
  _id: string;
  code: string;
  created_at: string;
  updated_at: string;
  __v: number;
};

export type ModuleResProp = {
  message: string;
  Data: ModuleInfoProp;
};

export const HeaderTabConst = [
  {
    id: "view-dashboard-menu",
    name: "Dashboard",
    href: "/contract/dashboard"
  },
  {
    id: "view-forms-menu",
    name: "Forms",
    href: "/contract/forms"
  },
  {
    id: "view-configuration",
    name: "Configuration",
    href: "/contract/configuration/list"
  }
];

export const SubHeaderTabConst = [
  {
    id: "view-configuration",
    name: "Configuration",
    href: "/contract/configuration/update"
  }
];

export const HeadCountHeaderTabConst = [
  {
    id: "view-headcount-dashboard-menu",
    name: "Dashboard",
    href: "/headcount/dashboard"
  },
  {
    id: "view-headcount-forms-menu",
    name: "Forms",
    href: "/headcount/forms"
  },
  {
    id: "view-headcount-configuration",
    name: "Configuration",
    href: "/headcount/configuration/list"
  }
];

export const SubHeadCountHeaderTabConst = [
  {
    id: "view-headcount-configuration",
    name: "Configuration",
    href: "/headcount/configuration/update"
  }
];

export const FormsTabConst = [
  {
    id: "view-my-requests-tab",
    name: "My Requests",
    type: "myRequest"
  },
  {
    id: "view-team-requests-tab",
    name: "Team Requests",
    type: "teamRequest"
  },
  {
    id: "view-approve-request-tab",
    name: "Approve Requests",
    type: "approveRequest"
  },
  {
    id: "view-e-sign-requests-tab",
    name: "E-sign Requests",
    type: "esignRequest"
  },
  {
    id: "view-my-approved-requests-tab",
    name: "My Approved List",
    type: "myApprovedList"
  }
];

export const FormsHeadCountTabConst = [
  {
    id: "view-headcount-my-requests-tab",
    name: "My Request",
    type: "myRequest"
  },
  {
    id: "view-headcount-team-requests-tab",
    name: "Team Request",
    type: "teamRequest"
  },
  {
    id: "view-headcount-approve-request-tab",
    name: "Approve Request",
    type: "approveRequest"
  }
];

export const SettingsTabConst = [
  {
    id: "view-user-settings",
    name: "Users"
  },
  {
    id: "view-department-settings",
    name: "Departments"
  },
  {
    id: "view-role-settings",
    name: "Roles"
  },
  {
    id: "view-permission-settings",
    name: "Permissions"
  },
  {
    id: "view-module-settings",
    name: "Modules"
  }
];

export interface HeadCountFormProps {
  requester_name: string;
  requester_email: string;
  is_behalf_hiring_manager: string;
  role_reporting_email: string;
  role_reporting: string;
  role_name: string;
  department: string;
  departmentName: string;
  created_date: string;
  headcount: string;
  is_role_in_budget: string;
  is_new_role_or_replacement: string;
  is_maxterm_or_permanent: string;
  max_term_length: string;
  is_fulltime_or_parttime: string;
  hrs_per_week: string;
  purpose: string;
  analysis: string;
  img_position_desc: string;
  review_current_team: string;
  has_position_benchmarked: string;
  aon_role_code: string;
  explanation_details: string;
  base_salary: string;
  additional_benefits: string;
  bus_driver: string;
  impact_dont_hire: string;
  top_five_kpi: string;
}

export const HeaderModuleConst = [
  {
    id: "1",
    label: "Contract"
  },
  {
    id: "2",
    label: "P&C"
  }
];

export const HeaderAvatarMenu = [
  {
    id: "my-profile",
    label: "My Profile"
  },
  {
    id: "log-out",
    label: "Log Out"
  }
];

export const rowPerPageOptions = [
  {
    value: "10",
    label: "10"
  },
  {
    value: "20",
    label: "20"
  },
  {
    value: "50",
    label: "50"
  }
];

export const entityOptions = [
  {
    label: "Australian Rugby League Commission Limited ACN 003 107 293",
    value: "Australian Rugby League Commission Limited ACN 003 107 293"
  },
  {
    label: "SST NT Limited ACN 602 142 718",
    value: "SST NT Limited ACN 602 142 718"
  },
  {
    label: "SST SA Limited ACN 602 142 914",
    value: "SST SA Limited ACN 602 142 914"
  },
  {
    label: "SST Vic Limited ACN 602 143 126",
    value: "SST Vic Limited ACN 602 143 126"
  },
  {
    label: "SST WA Limited ACN 602 143 199",
    value: "SST WA Limited ACN 602 143 199"
  },
  {
    label: "Las Vegas – SSTL Entity",
    value: "Las Vegas – SSTL Entity"
  }
];

export const currencyOptions = [
  {
    label: "AUD",
    value: "AUD"
  },
  {
    label: "USD",
    value: "USD"
  },
  {
    label: "NZD",
    value: "NZD"
  },
  {
    label: "CAD",
    value: "CAD"
  },
  {
    label: "EUR",
    value: "EUR"
  },
  {
    label: "FJD",
    value: "FJD"
  },
  {
    label: "GBP",
    value: "GBP"
  },
  {
    label: "PGK",
    value: "PGK"
  },
  {
    label: "TOP",
    value: "TOP"
  },
  {
    label: "WST",
    value: "WST"
  },
  {
    label: "Other",
    value: "Other"
  }
];

export const approvalOptions = [
  {
    label: "Revenue Contract",
    value: "Revenue Contract"
  },
  {
    label: "Expenditure Contract",
    value: "Expenditure Contract"
  },
  {
    label: "Expenditure no contract for signing",
    value: "Expenditure no contract for signing"
  },
  {
    label: "Deed of Novation",
    value: "Deed of Novation"
  },
  {
    label: "Master Services Agreement",
    value: "Master Services Agreement"
  }
];
