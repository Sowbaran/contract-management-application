import { Types } from "mongoose";

export const MailRedirectFrontEndPathMyRequest =
  "/finance/vendor-contract/requests/detail/formDetailId?page=myRequest&moduleId=ModuleCodeId";
export const MailRedirectFrontEndPathApproveRequest =
  "/finance/vendor-contract/requests/detail/formDetailId?page=approveRequest&moduleId=ModuleCodeId";

export const ModuleCode = {
  // HEADCOUNTREQUEST: "headcount",
  VENDORCONTRACT: "contract",
  SETTINGS: "settings",
};

export const TabRequest = {
  MYREQUEST: "myRequest",
  TEAMREQUEST: "teamRequest",
  APPROVEREQUEST: "approveRequest",
  VIEWCONFIGURATION: "viewConfiguration",
  ESIGNREQUEST:"esignRequest",
  MYAPPROVEDLIST:"myApprovedList"
};

export const FormStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  REJECTED: "rejected",
  FULFILLED: "fulfilled",
  DRAFT: "draft",
  DELETED: "deleted"
};

export const FormHistoryStatus = {
  PENDING: "pending",
  //APPROVED: 'approved',
  //RESUBMIT: 'resubmit',
  UPCOMING: "upcoming",
  INITIATED: "initiated",
  COMPLETED: "completed",
  REJECTED: "rejected",
  DRAFT: "draft",
  Retriggered: "retriggered",
  RESET: "reset"
};

export const DocusignStatus = {
  ESIGNINITIATED: "esign-initiated",
  ESIGNINFAILED: "esign-failed",
  SENTSUCCESS: "sent_success",
  SENTFAILURE: "sent_failure",
  ESIGNDECLINED: "esign-declined",
  ESIGNCOMPLETE: "esign-completed",
  ENVELOPCOMPLETE: "completed",
  ENVELOPDECLINED: "declined",
  ENVELOPRESENDSUCCESS: "Envelope resent successfully"
};

export const EmailStatus = {
  NEWROLE_OR_BUDGET_PENDINGAPPROVAL: "new_role_or_budget",
  PENDINGAPPROVAL: "Pending Approval",
  COMPLETED: "completed",
  REJECTED: "rejected",
  FULFILLED: "fulfilled",
  APPROVED: "approved",
  RESUBMIT: "resubmit",
  WITNESS: "witness",
  RECALL: "recall"
};

export const FormApprovlValidation = {
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const BucketFolerNames = {
  MSADOCUMENT: "msadocuments",
  ADDITIONALDOCUMENT: "formdocuments",
  APPROVERSIGNEDMSADOCUMENT: "approverSignedMSADocument",
  PARTYSIGNEDMSADOCUMENT: "partySignedMSADocument",
};

export const ROLECODES = {
  GUESTUSER: "guest-user",
  SUPERADMIN: "super-admin",
  VENDORMODULEADMIN: "vendor-module-admin",
  FINANCEADMIN: "finance-admin",
  LEGALADMIN: "legal-admin",
  // HEADCOUNTMODULEADMIN: "headcount-module-admin",
  CEO: "ceo",
  CFO: "cfo",
  DeedOfNovation: "Deed of Novation",
  NoSigning: "Expenditure no contract for signing",
  GENERALMANAGER: "first-reviewer"

};

export const DEPARTMENTCODES = {
  CHIEF: "chief-department",
};

export const ApiCode = {
  RESET: "RESET",
}
export const commonDomainEndPaths = {
  SIGNATURECALLBACK: "form-approval/callback",
  SIGNATURESENDENVELOPE: "create-envelope",
  EMAILWITHHTML: "email/send-html",
  GENERATESIGNINGURL: "generate-signingUrl",
  RESENDENVELOPE: "resend-envelope",
};

export const financeFilterStatus = {
  PENDING: "pending",
  COMPLETED: "completed",
  REJECTED: "rejected",
  FULFILLED: "fulfilled",
  ESIGNINITIATED: "esign-initiated",
  //ESIGNDECLINED: "esign-declined",
};

// export const headcountFilterStatus = {
//   PENDING: "pending",
//   COMPLETED: "completed",
//   REJECTED: "rejected",
// };

export const PermissionCodes = {
  CONTRACT: {
    VIEWREQUEST: "view-contract-request",
    VIEWDASHBOARD: "view-dashboard-menu",
    VIEWFORMMENU: "view-forms-menu",
    MYREQUEST: "view-my-requests-tab",
    TEAMREQUEST: "view-team-requests-tab",
    APPROVEREQUEST: "view-approve-request-tab",
    VIEWCONFIGURATION: "view-configuration",
    MYAPPROVEDREQUEST: "view-my-approved-requests-tab",
    VIEWMYESIGNREQUEST: "view-e-sign-requests-tab",
  },
  // HEADCOUNT: {
  //   VIEWREQUEST: "view-headcount-request",
  //   VIEWDASHBOARD: "view-dashboard-menu",
  //   VIEWFORMMENU: "view-headcount-forms-menu",
  //   MYREQUEST: "view-headcount-my-requests-tab",
  //   TEAMREQUEST: "view-headcount-team-requests-tab",
  //   APPROVEREQUEST: "view-headcount-approve-request-tab",
  //   VIEWCONFIGURATION: "view-headcount-configuration",
  // },
  SETTINGS: {
    VIEWSETTINGS: "view-settings",
    VIEWUSERSETTINGS: "view-user-settings",
    VIEWDEPARTMENTSETTINGS: "view-department-settings",
    VIEWROLESETTINGS: "view-role-settings",
    VIEWPERMISSIONSETTINGS: "view-permission-settings",
    VIEWMODULESETTINGS: "view-module-settings",
  },
};

export const SettingsRequest = {
  VIEWUSERSETTINGS: "view-user-settings",
  VIEWDEPARTMENTSETTINGS: "view-department-settings",
  VIEWROLESETTINGS: "view-role-settings",
  VIEWPERMISSIONSETTINGS: "view-permission-settings",
  VIEWMODULESETTINGS: "view-module-settings",
}; 

export const NotRequiredGM = {
  id: "firstreviewernotrequired",
  name: "Not Required"
};
