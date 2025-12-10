import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  ArrowLeftStartOnRectangleIcon,
  ArrowPathIcon,
  ArrowPathRoundedSquareIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  PencilIcon
} from "@heroicons/react/24/outline";
import { Card } from "../../components/Card";
import { useEffect, useRef, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { uploadFileToS3 } from "../../utils/api";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  useAuthStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../store";
import { WorkFlowStages } from "../../components/WorkFlowStages";
import { WorkFlowHistory } from "../../components/WorkFlowHistory";
import { SlidOvers } from "../../components/SlidOvers";
import Lottie from "lottie-react";
import PermissionDenied from "../../assets/animations/permission-denied.json";
import { dateFormatter_2, dateTimeFormatter_2 } from "../../utils/formatHelper";
import { Loader } from "../../components/Loader";
import {
  useCreateAprrovalForm,
  useDocusignRetrigger,
  useGenerateDownload,
  useGeneratePreSignedUrl,
  useGenerateSignedUrl,
  useGetFormDetail,
  useRecallFormById,
  useResetFormStatus,
  useUpdateFormStaus
} from "../../api/backend/backendComponents";
import { ContractAddEditForm } from "./Form";
import { UpdateFormApprovalDto } from "../../api/backend/backendSchemas";
import { AnyProp } from "../../common/types";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { AlertProps } from "@ui-components/Alert/types";
import { ButtonProps } from "@ui-components/Button/types";
import {
  Badge,
  Button,
  Input,
  RadioGroupItem,
  TextArea
} from "@ui-components";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { BadgeComponent } from "../../components/Badge";
import "./ContractStyle.css";
import icons from "../../assets/icons/index";
import { RadioGroupLabel } from "../../layouts/RadioGroupLabel/RadioGroupLabel";
import { TextAreaLabel } from "../../layouts/TextAreaLabel/TextAreaLabel";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type CardItemProp = {
  fieldKey: string | undefined;
  label: string | undefined;
  value: string | undefined;
};

type MainResponseProps = {
  [key: string]:
    | boolean
    | number
    | string
    | []
    | { [key: string]: string }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    | { [key: string]: any };
};

type FormInfoProps = {
  [key: string]: string;
};

type MapperProps = {
  labels: FormInfoProps;
  lvalues: MainResponseProps;
  optionalSearchObj?: MainResponseProps;
};

const FormItemLabels: FormInfoProps = {
  departmentName: "Department Name",
  generalManagerName: "First Reviewer",
  approval_being_sought: "Type of Approval being sought",
  business_case: "Business Case",
  nrl_entity: "Our Contracting Entity",
  counter_party: "Counter Party",
  desc_agreement: "Description of agreement",
  term: "Term",
  start_date: "Start Date",
  end_date: "End Date",
  monetary_value: "Monetary Value (in AUD, excluding Australian GST)",
  currency: "Currency",
  other_currency: "Other Currency",
  monetary_value_currency: "Monetary Value in the contracted currency (if not AUD)",
  relevant_financial_budget:
    "Has this been included in the relevant financial year’s budget? If not, why? If yes, which area (PC) ?",
  is_SST_approval:
    "If the value is A$1million have you attached a board minute showing SST approval ?",
  if_no_justify_SST: "If no, why ?",
  termination: "Termination",
  reputational_risk: "Reputational risk",
  special_or_unusual: "Special or unusual terms",
  expenditure_approval:
    "For expenditure approval provide a brief summary of the result of the procurement process",
  expenditure_approval_explain:
    "For expenditure approval explain how SST's Indigenous supplier framework was managed",
  expenditure_contract:
    "If this expenditure contract is between $20-50k are at least 2 quotes attached, or 3 quotes for >$50k in the Additional Attachments section below ?",
  if_no_justify_exp_contract: "If no, why ?",
  arms_length_transact:
    "Arm's Length Transactions: Are you aware of any conflict with a related party (including with a SST/SST affiliate or subsidiary, or with a known associate of a SST/SST employee or contractor) / is there a conflict or potential conflict of interest?",
  if_yes_arms_length_transact: "If yes, then please provide details?",
  contract_counterparty:
    "Has a credit check been undertaken on the contract counterparty (new counterparties only)",
  if_no_contract_counterparty: "If no, why?",
  include_contract_form:
    "Have you uploaded in the Additional Attachments section below the Modern Slavery Questionnaire as completed by the external parties to this agreement? A copy of the questionnaire is available here",
  if_no_justify_modern_slavery: "If no, why ?",
  provide_supplier_code:
    "Have you provided to the Counter Party / Parties listed above the Supplier Code of Conduct Policy? Available here",
  if_no_justify_supplier_code_conduct: "If no, why ?",
  is_capital_expenditure:
    "Is the contract a CapEx item (Capital Expenditure is proposed spend that is placed on the SST’s balance sheet and the cost is amortised (allocated) over 2 or more years)? If yes, a financial analysis is required to support the asset value",
  if_yes_is_capital_expenditure: "If yes, then please summarise the details?",
  contract_tech_review:
    "Is this contract related to a technology or software vendor (This includes infrastructure, platform or software)?",
  deliver_contract:
    "What resources are being used to deliver the contract? (Internal or external)",
  type_of_engagement:
    "If external, what type of engagement? (Third Party contractor, Subcontractor)",
  internal_resources:
    "What internal resources are required to support the contract or are saved as a result of engaging the supplier?",
  other_comments: "Other Comments"
};

const rejectBtnActions: ButtonProps[] = [
  {
    id: "reject",
    //variant: "error",
    className:
      "bg-red-500 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Reject",
    buttonStyle: "w-full"
  },
  {
    id: "cancel",
    //variant: "primary",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "Cancel",
    buttonStyle: "w-full"
  }
];

const recallBtnActions: ButtonProps[] = [
  {
    id: "recall",
    //variant: "primary",
    className:
      "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Recall",
    buttonStyle: "w-full"
  },
  {
    id: "cancel",
    //variant: "outline",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "Cancel",
    buttonStyle: "w-full"
  }
];

const retriggerBtnActions: ButtonProps[] = [
  {
    id: "retrigger_yes",
    //variant: "primary",
    className:
      "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Yes",
    buttonStyle: "w-full"
  },
  {
    id: "retrigger_no",
    //variant: "outline",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "No",
    buttonStyle: "w-full"
  }
];

const resetBtnActions: ButtonProps[] = [
  {
    id: "reset_yes",
    //variant: "primary",
    className:
      "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Yes",
    buttonStyle: "w-full"
  },
  {
    id: "reset_no",
    //variant: "outline",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "No",
    buttonStyle: "w-full"
  }
];

const financeApproveBtnActions: ButtonProps[] = [
  {
    id: "approve",
    //variant: "primary",
    className:
      "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Approve",
    buttonStyle: "w-full"
  },
  {
    id: "cancel",
    //variant: "outline",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "Cancel",
    buttonStyle: "w-full"
  }
];

const finalApproveBtnActions: ButtonProps[] = [
  {
    id: "approve",
    //variant: "primary",
    className:
      "bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500",
    size: "sm",
    label: "Approve",
    buttonStyle: "w-full"
  },
  {
    id: "cancel",
    //variant: "outline",
    className:
      "border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white",
    size: "sm",
    label: "Cancel",
    buttonStyle: "w-full"
  }
];

const esignRadioBtnDynamicOptions = [
  {
    value: "Yes",
    label: "Yes",
    disabled: false,
    description: ""
  },
  {
    value: "No",
    label: "No",
    disabled: false,
    description: ""
  }
];

const witnessRadioBtnDynamicOptions = [
  {
    value: "Yes",
    label: "Yes",
    disabled: false,
    description: ""
  },
  {
    value: "No",
    label: "No",
    disabled: false,
    description: ""
  }
];

const cropFileName = (fileName: string, maxLength: number) => {
  const parts = fileName.split(".");
  if (parts.length < 2) {
    // No extension found, return the name as it is or cropped if too long
    return {
      name: fileName.length > maxLength ? `${fileName.slice(0, maxLength)}...` : fileName,
      extension: ""
    };
  }

  const extension = parts.pop() || ""; // Get the file extension
  const nameWithoutExtension = parts.join("."); // Join remaining parts for the name

  return {
    name:
      nameWithoutExtension.length > maxLength
        ? `${nameWithoutExtension.slice(0, maxLength)}....`
        : nameWithoutExtension,
    extension
  };
};

export function ContractDetailPage() {
  const navigate = useNavigate({ from: "/contract/forms" });
  const { moduleStore } = useSelectedModuleStore();
  const { moduleTabStore } = useSelectedModuleTabStore();

  const { formId }: { formId: string } = useParams({ strict: false });
  const { moduleId }: { moduleId: string } = useSearch({ strict: false });
  const { page }: { page: string } = useSearch({ strict: false });

  const [fileSelected, setFileSelected] = useState(false);
  const [, setMsaFlag] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  let emailId = useAuthStore((state: { emailId: AnyProp }) => state.emailId);
  const { accessToken } = useAuthStore();
  const [editUserOpen, setEditUserOpen] = useState(false);

  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const environment = import.meta.env["VITE_APP_ENVIRONMENT"];
  if (environment === "dev" || environment === "development") {
    const selectedUser = localStorage.getItem("selectedUser");
    if (selectedUser) {
      const parts = selectedUser.split("-");
      emailId = parts[0] ? parts[0] : "";
    }
  }

  const pathParts = window.location.pathname.split("/");

  // const [showAlert, setShowAlert] = useState<AlertMainProps>();
  // const [showErrorAlert, setShowErrorAlert] = useState<AlertMain>();
  const [isFinance, setIsFinance] = useState<boolean>(false);
  const [isApproveBtnLoading, setIsApproveBtnLoading] = useState<boolean>(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [formStatus, setformStatus] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);

  const [values, setValues] = useState<AnyProp>({});

  const [mappedWorkflow, setMappedWorkflow] = useState<CardItemProp[]>([]);
  const [mappedFormInfo, setMappedFormInfo] = useState<CardItemProp[]>([]);
  const [mappedFinanceInfo, setFinanaceInfo] = useState<CardItemProp[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [, setIsFormDetailLoading] = useState(true);
  const [downloadMsaFileUrl, setDownloadMsaFileUrl] = useState<string>("");
  const [viewFileUrl, setViewFileUrl] = useState<string>("");
  const [uploadMsaFileUrl, setUploadMsaFileUrl] = useState<string>("");
  const [uploadMsaContentType, setUploadMsaContentType] = useState<string>("");
  const [uploadMsaFile, setUploadMsaFile] = useState<File>();
  const [shouldRefetchFormDetails, setShouldRefetchFormDetails] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlertReject, setShowAlertReject] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showFinaceApproveAlert, setShowFinaceApproveAlert] = useState(false);
  const [financePartnerName, setFinancePartnerName] = useState("");
  const [clearAcceptable, setClearAcceptable] = useState("");
  const [specialTax, setSpecialTax] = useState("");
  const [specialInsurance, setSpecialInsurance] = useState("");
  const [expenditureBudget, setExpenditureBudget] = useState("");
  const [businessCase, setBusinessCase] = useState("");
  const [commissionApproval, setCommissionApproval] = useState("");
  const [isAccessDenied, setIsAccessDenied] = useState<boolean>(false);
  const [errors, setErrors] = useState<AnyProp>({});
  const newErrors: AnyProp = {};
  const [workflowStatus, setWorkflowStatus] = useState<string>("");
  const [isFirstReviewerEditFlag, setIsFirstReviewerEditFlag] = useState<boolean>(false);
  const [isRecallFlag, setIsRecallFlag] = useState(false);
  const [showRecallAlert, setShowRecallAlert] = useState(false);
  const [formRecallReason, setFormRecallReason] = useState<string>("");
  const [isDocuSignRetrigger, setIsDocuSignRetrigger] = useState(false);
  const [showRetriggerAlert, setShowRetriggerAlert] = useState(false);
  const [isWorkflowReset, setIsWorkflowReset] = useState(false);
  const [showResetAlert, setShowResetAlert] = useState(false);
  const [isFinalApprover, setIsFinalApprover] = useState(false);
  const [showFinalApproverAlert, setShowFinalApproverAlert] = useState(false);
  const [esignRequired, setEsignRequired] = useState(false);
  const [esignRadioBtn, setEsignRadioBtn] = useState("No"); // DOCUSIGN DISABLED: Always set to "No"
  const [witnessRadioBtn, setWitnessRadioBtn] = useState("");
  const [witnessName, setWitnessName] = useState("");
  const [witnessEmail, setWitnessEmail] = useState("");
  const [refreshPage, setRefreshPage] = useState(true);
  const queryClient = useQueryClient();

  const [financeApproveIsLoading, setFinanceApproveIsLoading] = useState(false);
  const [finalApproveIsLoading, setFinalApproveIsLoading] = useState(false);
  const [rejectIsLoading, setRejectIsLoading] = useState(false);
  const [recallIsLoading, setRecallIsLoading] = useState(false);
  const [retriggerIsLoading, setRetriggerIsLoading] = useState(false);
  const [resetIsLoading, setResetIsLoading] = useState(false);

  const [approvalBeingSought, setApprovalBeingSought] = useState("");

  const updatedApproveButtons = finalApproveBtnActions.map(btn =>
    btn.id === "approve"
      ? {
          ...btn,
          label: finalApproveIsLoading ? "Processing..." : "Approve",
          disabled: finalApproveIsLoading
        }
      : btn
  );

  const updatedRejectButtons = rejectBtnActions.map(btn =>
    btn.id === "reject"
      ? {
          ...btn,
          label: rejectIsLoading ? "Processing..." : "Reject",
          disabled: rejectIsLoading
        }
      : btn
  );

  const updatedRecallButtons = recallBtnActions.map(btn =>
    btn.id === "recall"
      ? {
          ...btn,
          label: recallIsLoading ? "Processing..." : "Recall",
          disabled: recallIsLoading
        }
      : btn
  );

  const updatedRetriggerButtons = retriggerBtnActions.map(btn =>
    btn.id === "retrigger_yes"
      ? {
          ...btn,
          label: retriggerIsLoading ? "Processing..." : "Yes",
          disabled: retriggerIsLoading
        }
      : btn
  );

  const updatedResetButtons = resetBtnActions.map(btn =>
    btn.id === "reset_yes"
      ? {
          ...btn,
          label: resetIsLoading ? "Processing..." : "Yes",
          disabled: resetIsLoading
        }
      : btn
  );

  const updatedFinanceApproveButtons = financeApproveBtnActions.map(btn =>
    btn.id === "approve"
      ? {
          ...btn,
          label: financeApproveIsLoading ? "Processing..." : "Approve",
          disabled: financeApproveIsLoading
        }
      : btn
  );

  // let alertClose = null;
  let alertClose: (() => void) | null = null;
  
  const {
    data: formDetailsData,
    error,
    isError,
    isLoading: detailPageLoading
  } = useGetFormDetail(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      pathParams: {
        id: formId
      },
      queryParams: {
        email: emailId,
        type: page,
        moduleId: moduleId
      }
    },
    {
      enabled: !!emailId && !!formId && !!moduleId && !!page && !!accessToken,
      retry: false
    }
  );

  // Ensure departmentQuery.data exists and then access its data property
  useEffect(() => {
    if (isError) {
      console.error("Error fetching form details:", error);
      setIsAccessDenied(true);
    } else if (formDetailsData) {
      // console.log(`Form Details: ${JSON.stringify(formDetailsData.data)}`);
      setValues(formDetailsData.data);
      mapFormInfo(formDetailsData.data.formInfo, formDetailsData?.data);

      const workflowSummary = {
        code: formDetailsData?.data.code,
        createdAt: formDetailsData?.data.createdAt,
        workflow: formDetailsData?.data.workflowName,
        status: formDetailsData?.data.status,
        requester_name: formDetailsData?.data.requesterName,
        requester_email: formDetailsData?.data.requesterEmail
      };
      setWorkflowStatus(formDetailsData?.data.status);
      mapWorkflowInfo(workflowSummary);
      mapFinanceInfo(formDetailsData?.data.formAdditionalInfo);
      setformStatus(formDetailsData?.data.status);
      setIsFinance(formDetailsData?.data.isAdditionalAccess);
      setHistoryData(formDetailsData?.data.formHistory);
      setIsFormDetailLoading(false);

      setIsRecallFlag(formDetailsData?.data.isRecallFlag);
      setIsFinalApprover(formDetailsData?.data.isFinalApprover);
      setEsignRequired(formDetailsData?.data.eSignRequired);
      setIsWorkflowReset(formDetailsData?.data.isWorkflowReset);
      setIsDocuSignRetrigger(formDetailsData?.data.isDocuSignRetrigger);
      setApprovalBeingSought(formDetailsData?.data.approvalBeingSought);
      setIsFirstReviewerEditFlag(formDetailsData?.data.isFirstReviewerEditFlag);
    }
  }, [isError, error, formDetailsData]);

  const selectFormInfoLabel = (financePnc: string): FormInfoProps => {
    switch (financePnc) {
      case "finance":
        return FormItemLabels;
      default:
        return {} as FormInfoProps;
    }
  };

  const WorkflowLabels: FormInfoProps = {
    requester_name: "Requestor Name",
    requester_email: "Requestor Email",
    code: "Form Id",
    createdAt: "Created At",
    workflow: "Workflow",
    status: "Status"
  };

  const FinanceReviewLabels: FormInfoProps = {
    finance_partner_name: "Finance Partner Name",
    clear_acceptable: "Clear and acceptable?",
    tax_required: "Is specialist tax advice required?",
    insurance_required: "Special insurance requirements?",
    expenditure: "If not BAU, does the expenditure need a business case?",
    commission: "Is Commission approval required to enter contract?",
    within_budget: "Is the expenditure within budget (BAU)?",
  };

  const renderLabel = (label?: string) => {
    return <label className="text-gray-900 text-md font-semibold">{label}</label>;
  };
  const renderValue = (value?: string) => {
    return <label className="ms-0 text-md font-normal text-gray-800">{value}</label>;
  };

  const isParagraph = (fieldKey?: string) => {
    const isParagraph = [
      "expenditure_approval",
      "expenditure_approval_explain",
      "relevant_financial_budget",
      "counter_party",
      "business_case",
      "desc_agreement",
      "special_or_unusual",
      "reputational_risk",
      "termination",
      "if_no_justify_SST",
      "if_no_justify_exp_contract",
      "if_no_justify_modern_slavery",
      "if_no_justify_supplier_code_conduct",
      "deliver_contract",
      "type_of_engagement",
      "internal_resources",
      "if_yes_arms_length_transact",
      "if_no_contract_counterparty",
      "if_yes_is_capital_expenditure",
      "other_comments"
    ].includes(fieldKey ?? "");
    return isParagraph ? "grid-cols-1" : "grid-cols-2";
  };

  const FormInfoCardItem = ({ fieldKey, label, value }: CardItemProp) => {
    switch (fieldKey) {
      case "start_date":
      case "end_date":
        return value ? (
          <div className="p-0 flex">
            <div className="col-span-1">{renderLabel(label)}:</div>
            <div className="col-span-1 ml-5">
              <label className="ms-0 text-md font-normal text-gray-800">
                {dateFormatter_2(value)}
              </label>
            </div>
          </div>
        ) : null;

      case "monetary_value":
      case "monetary_value_currency":
        // biome-ignore lint/suspicious/noGlobalIsNan: <explanation>
        return value && !isNaN(Number(value)) ? (
          <div className="p-0 flex">
            <div className="col-span-1">{renderLabel(label)}:</div>
            <div className="col-span-1 ml-5">
              <span className="text-md font-normal text-gray-800">
                {new Intl.NumberFormat("en-AU").format(Number(value))}
              </span>
            </div>
          </div>
        ) : null;

      case "include_contract_form":
      case "provide_supplier_code":
      case "contract_tech_review":
      case "is_SST_approval":
      case "arms_length_transact":
      case "contract_counterparty":
      case "is_capital_expenditure":
      case "expenditure_contract":
        return value ? (
          <div className="p-0 flex">
            <div className=" col-span-1">
              {renderLabel(label)}: <span className="ml-5">{renderValue(value)}</span>
            </div>
          </div>
        ) : null;
      case "finance_partner_name":
      case "clear_acceptable":
      case "tax_required":
      case "insurance_required":
      case "commission":
      case "within_budget":
        return value ? (
          <div className="p-0 flex">
            <div className="col-span-1">
              {renderLabel(label)}: <span className="ml-4">{renderValue(value)}</span>
            </div>
          </div>
        ) : null;

      case "expenditure_approval":
      case "expenditure_approval_explain":
      case "relevant_financial_budget":
      case "counter_party":
      case "business_case":
      case "desc_agreement":
      case "special_or_unusual":
      case "reputational_risk":
      case "termination":
      case "if_no_justify_SST":
      case "if_no_justify_exp_contract":
      case "if_no_justify_modern_slavery":
      case "if_yes_arms_length_transact":
      case "if_no_justify_supplier_code_conduct":
      case "if_no_contract_counterparty":
      case "if_yes_is_capital_expenditure":
      case "deliver_contract":
      case "type_of_engagement":
      case "internal_resources":
      case "other_comments":
        return value ? (
          <div
            className={`p-0 text-justify grid grid-cols-1 md:${isParagraph(fieldKey)}`}
          >
            <div className="md:col-span-1">{renderLabel(label)}:</div>
            <div className="md:col-span-1 quill-content">
              <div
                className="ql-editor text-md font-normal text-gray-800"
                // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                dangerouslySetInnerHTML={{ __html: value }}
              />
            </div>
          </div>
        ) : null;

      default:
        return value ? (
          <div className={`p-0 flex md:${isParagraph(fieldKey)}`}>
            <div className="col-span-1">{renderLabel(label)}:</div>
            <div className="col-span-1 ml-5">{renderValue(value)}</div>
          </div>
        ) : null;
    }
  };

  const BadgeRender = (val: string) => {
    return <BadgeComponent value={val} />;
  };

  const WorkflowCardItem = ({ fieldKey, label, value }: CardItemProp) => {
    const commonContainerStyle = "ps-3 flex flex-col p-1";
    const commonLabelStyle = "text-gray-900 text-sm font-semibold";

    switch (fieldKey) {
      case "code":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div>
              {value ? (
                <Badge variant={"blue"} label={value} />
              ) : (
                <span className="flex">-</span>
              )}
            </div>
          </div>
        );

      case "createdAt":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div className="">
              <span className="text-sm font-regular text-gray-800 whitespace-nowrap">
                {value ? dateTimeFormatter_2(value) : <span className="flex">-</span>}
              </span>
            </div>
          </div>
        );

      case "workflow":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div>
              {value ? (
                <span
                  className={
                    "inline-flex items-center rounded-md bg-purple-100 text-purple-700 ring-purple-700/10 px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize whitespace-nowrap"
                  }
                >
                  {value === "Cfo" || value === "CFO"
                    ? "Chief Financial Officer"
                    : value === "Ceo" || value === "CEO"
                      ? "Chief Executive Officer"
                      : value}
                </span>
              ) : (
                <span className="flex">-</span>
              )}
            </div>
          </div>
        );

      case "status":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div>{value ? BadgeRender(value) : <span className="flex">-</span>}</div>
          </div>
        );
    }

    return (
      <div className={commonContainerStyle}>
        <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
        <div className="text-gray-800 font-normal text-sm break-words whitespace-nowrap">
          {value}
        </div>
      </div>
    );
  };

  function RecursiveSearch(
    objData: MainResponseProps,
    searchKey: string
  ): string | undefined {
    const stack: MainResponseProps[] = [objData];
    while (stack.length > 0) {
      const currentObj = stack.pop();
      if (currentObj) {
        for (const key in currentObj) {
          if (Object.prototype.hasOwnProperty.call(currentObj, key)) {
            const value = currentObj[key];
            if (key === searchKey) {
              return value as string;
            }
            if (typeof value === "object" && value !== null && !Array.isArray(value)) {
              stack.push(value);
            }
          }
        }
      }
    }
    return undefined;
  }

  function MapperLabelValue({
    labels,
    lvalues,
    optionalSearchObj
  }: MapperProps): CardItemProp[] {
    const mappedObject = [];
    if (lvalues) {
      for (const key in labels) {
        const label = labels[key];
        let value = lvalues[key] as string;
        if (!value && optionalSearchObj) {
          value = RecursiveSearch(optionalSearchObj, key) as string;
        }
        if (value === "yes") value = "Yes";
        else if (value === "no") value = "No";
        mappedObject.push({ fieldKey: key, label, value });
      }
    }
    return mappedObject;
  }

  function mapFormInfo(formInfo: FormInfoProps, mainData: MainResponseProps) {
    const financePnc = pathParts[1] ? pathParts[1] : "";
    const mappedList = MapperLabelValue({
      labels: selectFormInfoLabel(financePnc),
      lvalues: formInfo,
      optionalSearchObj: mainData
    });
    if (mappedList) setMappedFormInfo(mappedList);
  }

  function mapWorkflowInfo(mainData: MainResponseProps) {
    const mappedList = MapperLabelValue({
      labels: WorkflowLabels,
      lvalues: mainData
    });
    setMappedWorkflow(mappedList);
  }

  function mapFinanceInfo(financeInfo: FormInfoProps) {
    const mappedList = MapperLabelValue({
      labels: FinanceReviewLabels,
      lvalues: financeInfo
    });
    setFinanaceInfo(mappedList);
  }

  function getAttachmentFileName(url: string): string {
    const fileName = url.split("/").pop();
    if (!fileName) return "No File Name";
    //return fileName.length > 35 ? `${fileName.substring(0, 32)}... ` : fileName;
    return fileName;
  }

  const Approve = async (value: string) => {
    setIsApproveBtnLoading(true);

    // Prepare the body for the approval request
    const body: UpdateFormApprovalDto = {
      eSignRequired: false, // DOCUSIGN DISABLED: Always false
      witnessFlag: false, // DOCUSIGN DISABLED: Always false
      moduleId: moduleId,
      emailId: emailId,
      formId: formId,
      comments: "",
      status: value,
      formAdditionalInfo: {},
      mailRedirectPath: `finance/vendor-contract/requests/detail/${formId}?page=approveRequest&moduleId=${moduleId}`
    };

    formStatusMutateUpdate({
      body: { ...body } as AnyProp,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const { mutate: formStatusMutateUpdate } = useCreateAprrovalForm({
    onSuccess: response => {
      setIsApproveBtnLoading(false);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      setAlertInfo({ ...alertInfo, type: "success" });
      setShowAlert(true);
      // navigate({
      //   to: "/contract/forms"
      // });
    },
    onError: (error: AnyProp) => {
      console.error("error --- ", error);
      setIsApproveBtnLoading(false);
      const alertInfo: AlertProps = {
        title: "Error",
        message:
          error?.stack?.message ||
          error?.message ||
          "An error occurred while updating the status.",
        type: "error"
      };
      setAlertInfo({ ...alertInfo, type: "error" });
      setShowAlert(true);
    }
  });

  const handleRecallButtonClick = () => {
    setShowRecallAlert(true);
  };

  const handleRecallValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormRecallReason(value);

    setErrors((prevErrors: AnyProp) => ({
      ...prevErrors,
      formRecallReason: value.trim() === "" ? "Reason field is required!" : undefined
    }));
  };

  const recallListForm = () => {
    return (
      <div className="flex flex-col py-5 gap-4">
        <div>
          <TextAreaLabel
            htmlFor={""}
            lblText=""
            placeholder="Kindly provide a reason for recall *"
            value={formRecallReason}
            onChange={handleRecallValidation}
            required={false}
            mainContainerStyle="col-span-2"
            style={{ minHeight: "40px" }}
          />
          {errors.formRecallReason && (
            <p className="text-red-500 text-xs mt-1">{errors.formRecallReason}</p>
          )}
        </div>
      </div>
    );
  };

  const recallCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "cancel":
        alertClose?.();
        setFormRecallReason("");
        setRecallIsLoading(false);
        setErrors({});
        break;
      case "recall":
        handleRecall();
        break;
    }
  };

  const handleRecall = () => {
    if (formRecallReason.trim() === "") {
      newErrors.formRecallReason = "Reason field is required!";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setRecallIsLoading(true);
      setErrors(newErrors);
      reCallApiCall({
        pathParams: {
          id: formId
        },
        queryParams: { moduleId: moduleId, comments: formRecallReason, emailId: emailId },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: reCallApiCall } = useRecallFormById({
    onSuccess: response => {
      const successMsg = response.message;
      console.info(`${successMsg} - Success - reCallApiCall: ${response}`);
      setRecallIsLoading(false);
      setShowRecallAlert(false);
      setFormRecallReason("");
      setRefreshPage(false);
      toast.success(successMsg);
    },
    onError: (error: AnyProp) => {
      console.error(error, "Error reCallApiCall");
      setRecallIsLoading(false);
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  const handleRetriggerButtonClick = () => {
    setShowRetriggerAlert(true);
  };

  const retriggerForm = () => {
    return (
      <div className="py-5 text-slate-500 text-md">
        <div>Would you like to re-send the DocuSign signature request?</div>
      </div>
    );
  };

  const retriggerCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "retrigger_no":
        alertClose?.();
        setRetriggerIsLoading(false);
        break;
      case "retrigger_yes":
        handleRetrigger();
        break;
    }
  };

  const handleRetrigger = () => {
    setRetriggerIsLoading(true);
    reTriggerApiCall({
      pathParams: {
        id: formId
      },
      queryParams: { moduleId: moduleId, emailId: emailId, type: page },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const { mutate: reTriggerApiCall } = useDocusignRetrigger({
    onSuccess: response => {
      setRetriggerIsLoading(false);
      const successMsg = response.message;
      console.info(`${successMsg} - Success - reTriggerApiCall: ${response}`);
      alertClose?.();
      setShowRetriggerAlert(false);
      setRefreshPage(false);
      toast.success(successMsg);
    },
    onError: (error: AnyProp) => {
      setRetriggerIsLoading(false);
      console.error(error, "Error reTriggerApiCall");
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  const handleResetButtonClick = () => {
    setShowResetAlert(true);
  };

  const resetForm = () => {
    return (
      <div className="py-5 text-slate-500 text-md">
        <div>
          Confirm reset: This request will return to 'Pending' status in the existing
          workflow.
        </div>
      </div>
    );
  };

  const resetCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "reset_no":
        alertClose?.();
        setResetIsLoading(false);
        break;
      case "reset_yes":
        handleReset();
        break;
    }
  };

  const handleReset = () => {
    setResetIsLoading(true);
    reSetApiCall({
      pathParams: {
        id: formId
      },
      queryParams: { moduleId: moduleId, emailId: emailId, type: page },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const { mutate: reSetApiCall } = useResetFormStatus({
    onSuccess: response => {
      setResetIsLoading(false);
      const successMsg = response.message;
      console.info(`${successMsg} - Success - reSetApiCall: ${response}`);
      setShowResetAlert(false);
      navigate({
        to: "/contract/forms"
      });
      toast.success(successMsg);
    },
    onError: (error: AnyProp) => {
      setResetIsLoading(false);
      console.error(error, "Error reSetApiCall");
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  const handleOpenRejectAlert = () => {
    setAlertInfo({ title: "Reject" });
    setShowAlertReject(true);
  };

  const rejectReasonForm = () => {
    return (
      <div className="py-5">
        <TextArea
          placeholder="Kindly provide a reason *"
          value={rejectReason}
          onChange={handleReasonValidation}
        />
        {errors.rejectReason && (
          <p className="text-red-500 text-xs mt-1">{errors.rejectReason}</p>
        )}
      </div>
    );
  };

  const handleReasonValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRejectReason(value);

    setErrors((prevErrors: AnyProp) => ({
      ...prevErrors,
      rejectReason: value.trim() === "" ? "Reason field is required!" : undefined
    }));
  };

  const handleReject = async () => {
    if (rejectReason.trim() === "") {
      newErrors.rejectReason = "Reason field is required!";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setRejectIsLoading(true);

      const body = {
        eSignRequired: false, // DOCUSIGN DISABLED: Always false
        witnessFlag: false, // DOCUSIGN DISABLED: Always false
        moduleId: moduleId,
        emailId: emailId,
        formId: formId,
        status: "rejected",
        comments: rejectReason,
        formAdditionalInfo: {},
        isAdditionalAccess: false,
        mailRedirectPath: `finance/vendor-contract/requests/detail/${formId}?page=myRequest&moduleId=${moduleId}`,
        isHeadOfPnCFinalApprover: false
      };

      console.info("Form ~ Reject:", body);
      rejectFormSubmit({
        body: { ...body } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: rejectFormSubmit } = useCreateAprrovalForm({
    onSuccess: response => {
      setRejectIsLoading(false);
      const successMsg = response.message;
      console.info(`${successMsg} - Success - rejectFormSubmit: ${response}`);
      alertClose?.();
      navigate({
        to: "/contract/forms"
      });
      toast.success(successMsg);
    },
    onError: (error: AnyProp) => {
      console.error(error, "Error rejectFormSubmit");
      setRejectIsLoading(false);
      alertClose?.();
      navigate({
        to: "/contract/forms"
      });
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  const approveRejectCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "cancel":
        setErrors({});
        alertClose?.();
        break;
      case "reject":
        await handleReject();
        break;
      case "default":
        setErrors({});
        alertClose?.();
        navigate({
          to: "/contract/forms"
        });
        break;
    }
  };

  // DOCUSIGN DISABLED: Skip popup and directly approve without DocuSign
  const handleOpenFinalApproverAlert = () => {
    // Skip the DocuSign popup and directly approve with eSignRequired = false
    setFinalApproveIsLoading(true);
    const body = {
      moduleId: moduleId,
      emailId: emailId,
      formId: formId,
      status: "approved",
      formAdditionalInfo: {},
      isAdditionalAccess: false,
      mailRedirectPath: `finance/vendor-contract/requests/detail/${formId}?page=approveRequest&moduleId=${moduleId}`,
      isHeadOfPnCFinalApprover: false,
      eSignRequired: false, // DOCUSIGN DISABLED: Always false
      witnessFlag: false, // DOCUSIGN DISABLED: Always false
      witnessName: "",
      witnessEmail: ""
    };
    console.info("Form ~ Final Approver (DocuSign Disabled):", body);
    financeApproveFormSubmit({
      body: { ...body } as AnyProp,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    // setAlertInfo({ title: "Final Review Submission" });
    // setShowFinalApproverAlert(true);
  };

  const finalApproverForm = () => {
    return (
      <div className="relative h-full w-full py-3 flex flex-col gap-4">
        <>
          <div className="mb-5">
            <RadioGroupLabel
              orientation="horizontal"
              htmlFor={""}
              required={true}
              errorMessage={esignRadioBtn ? "" : "Field required"}
              lblText="Do you want to sign the contract using our DocuSign facility?"
            >
              {esignRadioBtnDynamicOptions.map(option => (
                <RadioGroupItem
                  name="radio-group"
                  size="sm"
                  key={option.value}
                  radioContainerStyle="mt-3 w-28"
                  checked={option.value === esignRadioBtn}
                  value={option.value}
                  disabled={option.disabled}
                  description={option.description}
                  onChange={handleEsignRadioBtn}
                  innerCheckedStyle="bg-green-600"
                  outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                  outerRingStyle="hover:border-green-600"
                  className=""
                >
                  {option.label}
                  <br />
                  {option.description}
                </RadioGroupItem>
              ))}
            </RadioGroupLabel>
            {errors.esignRadioBtn && (
              <p className="text-red-500 text-xs mt-1">{errors.esignRadioBtn}</p>
            )}
          </div>
          {esignRadioBtn === "Yes" && (
            <>
              <div className="mb-5">
                <RadioGroupLabel
                  orientation="horizontal"
                  htmlFor={""}
                  required={true}
                  errorMessage={witnessRadioBtn ? "" : "Field required"}
                  lblText="Would you like to add witness details to this document?"
                >
                  {witnessRadioBtnDynamicOptions.map(option => (
                    <RadioGroupItem
                      name="radio-group"
                      size="sm"
                      key={option.value}
                      radioContainerStyle="mt-3 w-28"
                      checked={option.value === witnessRadioBtn}
                      value={option.value}
                      disabled={option.disabled}
                      description={option.description}
                      innerCheckedStyle="bg-green-600"
                      outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                      outerRingStyle="hover:border-green-600"
                      onChange={handleWitnessRadioBtn}
                    >
                      {option.label}
                      <br />
                      {option.description}
                    </RadioGroupItem>
                  ))}
                </RadioGroupLabel>
                {errors.witnessRadioBtn && (
                  <p className="text-red-500 text-xs mt-1">{errors.witnessRadioBtn}</p>
                )}
              </div>
              {witnessRadioBtn === "Yes" && (
                <div>
                  <div className="w-full">
                    <div className="mb-2">
                      <label
                        htmlFor="witnessName"
                        className="text-gray-900 text-md font-normal"
                      >
                        Witness Name <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Input
                      variant="default"
                      placeholder="Witness Name"
                      value={witnessName}
                      onChange={handleWitnessName}
                      className="w-full text-sm"
                    />
                    {errors.witnessName && (
                      <p className="text-red-500 text-xs mt-1">{errors.witnessName}</p>
                    )}
                  </div>
                  <div className="w-full mt-5">
                    <div className="mb-2">
                      <label
                        htmlFor="witnessEmailID"
                        className="text-gray-900 text-md font-normal"
                      >
                        Witness Email ID <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <Input
                      variant="default"
                      placeholder="Witness Email ID"
                      value={witnessEmail}
                      onChange={handleWitnessEmail}
                      className="w-full text-sm"
                    />
                    {errors.witnessEmail && (
                      <p className="text-red-500 text-xs mt-1">{errors.witnessEmail}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </>
        <hr className="mt-2 text-gray-200 w-[100%]" />
      </div>
    );
  };

  const handleWitnessName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWitnessName(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessName: "Witness Name field is required !"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessName: value.trim() === "" ? "Witness Name field is required !" : undefined
      }));
    }
  };

  const handleWitnessEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWitnessEmail(value);

    const emailPattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessEmail: "Witness Email ID field is required !"
      }));
    } else if (!emailPattern.test(value)) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessEmail: "Please provide a valid Email ID !"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessEmail:
          value.trim() === "" ? "Witness Email ID field is required !" : undefined
      }));
    }
  };

  const handleEsignRadioBtn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEsignRadioBtn(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        esignRadioBtn: "E-sign field is required !"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        esignRadioBtn: value.trim() === "" ? "E-sign field is required !" : undefined
      }));
    }
  };

  const handleWitnessRadioBtn = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setWitnessRadioBtn(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessRadioBtn: "Witness Detail field is required !"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        witnessRadioBtn:
          value.trim() === "" ? "Witness Detail field is required !" : undefined
      }));
    }
  };

  const finalApproverCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "cancel":
        alertClose?.();
        setFinanceApproveIsLoading(false);
        setFinalApproveIsLoading(false);
        setWitnessName("");
        setWitnessEmail("");
        setWitnessRadioBtn("");
        setEsignRadioBtn("");
        setErrors({});
        break;
      case "approve":
        handleFinalApprover();
        break;
      case "default":
        alertClose?.();
        navigate({
          to: "/contract/forms"
        });
        break;
    }
  };

  const handleFinalApprover = () => {
    const fields = {
      esignRadioBtn,
      witnessRadioBtn,
      witnessName,
      witnessEmail
    };

    console.log("handleFinalApprover -", fields);

    const newErrors = Object.entries(fields).reduce(
      (acc, [key, value]) => {
        if (!value.trim()) {
          if (key === "esignRadioBtn" && esignRadioBtn === "") {
            acc[key] = "E-sign field is required !";
          } else if (
            key === "witnessRadioBtn" &&
            esignRadioBtn === "Yes" &&
            witnessRadioBtn === ""
          ) {
            acc[key] = "Witness Detail field is required !";
          } else if (
            key === "witnessName" &&
            esignRadioBtn === "Yes" &&
            witnessRadioBtn === "Yes" &&
            witnessName === ""
          ) {
            acc[key] = "Witness Name field is required !";
          } else if (
            key === "witnessEmail" &&
            esignRadioBtn === "Yes" &&
            witnessRadioBtn === "Yes" &&
            witnessEmail === ""
          ) {
            acc[key] = "Witness Email ID field is required !";
          }
        }
        return acc;
      },
      {} as Record<string, string>
    );
    console.log(`newErrors: ${JSON.stringify(newErrors)}`);
    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      setFinalApproveIsLoading(true);

      const body = {
        moduleId: moduleId,
        emailId: emailId,
        formId: formId,
        status: "approved",
        formAdditionalInfo: {},
        isAdditionalAccess: false,
        mailRedirectPath: `finance/vendor-contract/requests/detail/${formId}?page=approveRequest&moduleId=${moduleId}`,
        isHeadOfPnCFinalApprover: false,
        eSignRequired: false, // DOCUSIGN DISABLED: Always false
        witnessFlag: false, // DOCUSIGN DISABLED: Always false
        witnessName: witnessName,
        witnessEmail: witnessEmail
      };

      console.info("Form ~ Final Approver:", body);
      financeApproveFormSubmit({
        body: { ...body } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const handleOpenFinanceApproveAlert = () => {
    setAlertInfo({ title: "Finance Approval Form" });
    setShowFinaceApproveAlert(true);
  };

  const financeApproveForm = () => {
    return (
      <div className="relative h-full w-full py-3 flex flex-col gap-4">
        {/* Finance Partner Name */}
        <div className="w-full">
          <div className="mb-2">
            <label
              htmlFor="financePartnerName"
              className="text-gray-900 text-sm font-normal"
            >
              Finance Partner Name <span className="text-red-500">*</span>
            </label>
          </div>
          <Input
            variant="default"
            placeholder="Finance Partner Name"
            value={financePartnerName}
            onChange={handleFinancePartnerName}
            className="w-full"
          />
          {errors.financePartnerName && (
            <p className="text-red-500 text-xs mt-1">{errors.financePartnerName}</p>
          )}
        </div>

        {/* Yes/No Questions (Grid for responsiveness) */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          {[
            {
              label: "Clear and Acceptable?",
              name: "clear_acceptable",
              value: clearAcceptable,
              handler: handleClearAcceptable,
              error: errors.clearAcceptable
            },
            {
              label: "Is Specialist Tax Advice Required?",
              name: "special_tax",
              value: specialTax,
              handler: handleSpecialTax,
              error: errors.specialTax
            },
            {
              label: "Special Insurance Requirements?",
              name: "special_insurance",
              value: specialInsurance,
              handler: handleSpecialInsurance,
              error: errors.specialInsurance
            },
            {
              label: "If not BAU, does the expenditure need a business case?",
              name: "business_case",
              value: businessCase,
              handler: handleBuisnessCase,
              error: errors.businessCase
            },
            {
              label: "Is Commission approval required to enter contract?",
              name: "commission_approval",
              value: commissionApproval,
              handler: handleCommissionApproval,
              error: errors.commissionApproval
            },
            {
              label: "Is the expenditure within budget (BAU)?",
              name: "expenditure_budget",
              value: expenditureBudget,
              handler: handleExpenditureBudget,
              error: errors.expenditureBudget,
              extraOptions: [
                { value: "No costs incurred SST", label: "No costs incurred SST" }
              ]
            }
          ].map(({ label, name, value, handler, error, extraOptions }) => (
            <div key={name} className="w-full">
              <label className="text-gray-900 text-sm font-normal">
                {label} <span className="text-red-500">*</span>
              </label>
              <div
                className={`mt-2 mb-4 flex ${
                  extraOptions ? "flex-col" : "flex-row"
                } items-start gap-5`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-green-600 focus:ring-green-500 h-4 w-4 border-gray-300"
                    name={name}
                    value="yes"
                    checked={value === "yes"}
                    onChange={handler}
                  />
                  <label className="text-sm font-normal text-gray-900">Yes</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    className="accent-green-600 focus:ring-green-500 h-4 w-4 border-gray-300"
                    name={name}
                    value="no"
                    checked={value === "no"}
                    onChange={handler}
                  />
                  <label className="text-sm font-normal text-gray-900">No</label>
                </div>
                {extraOptions?.map(opt => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <input
                      type="radio"
                      className="accent-green-600 focus:ring-green-500 h-4 w-4 border-gray-300"
                      name={name}
                      value={opt.value}
                      checked={value === opt.value}
                      onChange={handler}
                    />
                    <label className="text-sm font-normal text-gray-900">
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleFinancePartnerName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFinancePartnerName(value);
    setErrors((prevErrors: AnyProp) => ({
      ...prevErrors,
      financePartnerName:
        value.trim() === "" ? "Finance Partner Name field is required" : undefined
    }));
  };

  const handleClearAcceptable = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setClearAcceptable(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      clearAcceptable: value ? undefined : "Clear acceptable field is required"
    }));
  };

  const handleSpecialTax = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpecialTax(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      specialTax: value ? undefined : "Special Tax field is required"
    }));
  };

  const handleSpecialInsurance = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpecialInsurance(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      specialInsurance: value ? undefined : "Special Insurance field is required"
    }));
  };

  const handleExpenditureBudget = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpenditureBudget(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      expenditureBudget: value ? undefined : "Within Budget field is required"
    }));
  };

  const handleBuisnessCase = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBusinessCase(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      businessCase: value ? undefined : "Business Case field is required"
    }));
  };

  const handleCommissionApproval = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCommissionApproval(value);

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      commissionApproval: value ? undefined : "Commission Approval field is required"
    }));
  };

  const financeApproveCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "cancel":
        alertClose?.();
        // Reset all state values
        setFinancePartnerName("");
        setClearAcceptable("");
        setSpecialTax("");
        setSpecialInsurance("");
        setExpenditureBudget("");
        setBusinessCase("");
        setCommissionApproval("");
        setErrors({});
        break;
      case "approve":
        handleFinaceApprove();
        break;
      case "default":
        alertClose?.();
        navigate({
          to: "/contract/forms"
        });
        break;
    }
  };

  const handleFinaceApprove = () => {
    const fields = {
      financePartnerName,
      clearAcceptable,
      specialTax,
      specialInsurance,
      expenditureBudget,
      businessCase,
      commissionApproval
    };

    const newErrors = Object.entries(fields).reduce(
      (acc, [key, value]) => {
        if (!value.trim()) {
          acc[key] = `${key.replace(/([A-Z])/g, " $1")} field is required!`;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      setFinanceApproveIsLoading(true);
      const formAdditionalInfo = {
        finance_partner_name: financePartnerName,
        clear_acceptable: clearAcceptable,
        tax_required: specialTax,
        insurance_required: specialInsurance,
        within_budget: expenditureBudget,
        expenditure: businessCase,
        commission: commissionApproval
      };

      const body = {
        eSignRequired: false, // DOCUSIGN DISABLED: Always false
        witnessFlag: false, // DOCUSIGN DISABLED: Always false
        moduleId: moduleId,
        emailId: emailId,
        formId: formId,
        status: "approved",
        comments: "",
        formAdditionalInfo: formAdditionalInfo,
        isAdditionalAccess: true,
        mailRedirectPath: `finance/vendor-contract/requests/detail/${formId}?page=approveRequest&moduleId=${moduleId}`,
        isHeadOfPnCFinalApprover: false
      };

      console.info("Form ~ Finance Approve:", body);
      financeApproveFormSubmit({
        body: { ...body } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: financeApproveFormSubmit } = useCreateAprrovalForm({
    onSuccess: response => {
      setFinanceApproveIsLoading(false);
      setFinalApproveIsLoading(false);
      const successMsg = response.message;
      console.info(`${successMsg} - Success - finance Approve: ${response}`);
      alertClose?.();
      navigate({
        to: "/contract/forms"
      });
      toast.success(successMsg);
    },
    onError: (error: AnyProp) => {
      console.error(error, "Error finance approve ");
      setFinanceApproveIsLoading(false);
      setFinalApproveIsLoading(false);
      alertClose?.();
      navigate({
        to: "/contract/forms"
      });
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  const resubmit = () => {
    setEditUserOpen(true);
  };

  const handleBack = () => {
    navigate({
      to: `/${moduleStore?.code}/forms`
      // search: { tab: "myRequest" },
    });
  };

  const { data: downloadMsaDocuDetails } = useGenerateDownload(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      queryParams: {
        url: downloadMsaFileUrl
      }
    },
    {
      enabled: !!downloadMsaFileUrl,
      retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (downloadMsaDocuDetails) {
      try {
        const binaryString = window.atob(downloadMsaDocuDetails?.data);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }

        const blob = new Blob([bytes], {
          type: downloadMsaDocuDetails.headers.contentType
        });
        const fileName = downloadMsaFileUrl.split("/").pop() || "download.pdf";

        // Create a temporary link element for downloading the file
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Error downloading PDF:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [downloadMsaDocuDetails]);

  const handleDownloadPDF = async () => {
    setIsLoading(true);
    if (values.msaAttachments.length > 0) {
      const msaAttachmentsCount = values.msaAttachments.length - 1;
      const fileUrl = values.msaAttachments[msaAttachmentsCount];
      setDownloadMsaFileUrl(fileUrl);
    }
  };

  // Function to simulate click on file input
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const generateRandomId = async () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const processFileName = async (fileName: string): Promise<string> => {
    // Remove file extension
    const fileNameWithoutExtension = fileName.substring(0, fileName.lastIndexOf("."));

    // Limit file name to 20 characters
    const trimmedFileName =
      fileNameWithoutExtension.length > 20
        ? fileNameWithoutExtension.substring(0, 20)
        : fileNameWithoutExtension;

    // Remove the first special character and replace subsequent special characters with an underscore
    const updatedFileName = trimmedFileName
      .replace(/[^a-zA-Z0-9]/, "") // Remove the first special character
      .replace(/[^a-zA-Z0-9]/g, "_"); // Replace subsequent special characters with an underscore

    return updatedFileName;
  };

  // Map MIME types to file extensions
  const getFileExtension = async (mimeType: string): Promise<string> => {
    const mimeTypes: { [key: string]: string } = {
      "application/msword": "doc",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
      "application/pdf": "pdf"
    };

    return mimeTypes[mimeType] || "unknown"; // Fallback if the MIME type is not recognized
  };

  const { data: uploadMsaDocuDetails } = useGenerateSignedUrl(
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      queryParams: { key: uploadMsaFileUrl, contentType: uploadMsaContentType }
    },
    { enabled: !!uploadMsaFileUrl && !!uploadMsaContentType, retry: false }
  );

  const { mutate: updateFormStatusToFulfilled } = useUpdateFormStaus({
    onSuccess: response => {
      console.info("Form updated successfully:", response);
      setShouldRefetchFormDetails(true);
      setFileSelected(true);
      setMsaFlag(true);
      setLoading(false);
      return false;
    },
    onError: error => {
      console.error("Error updating form status:", error);
      setLoading(false);
    }
  });

  // Function to handle file upload and status update
  const uploadFileAndUpdateStatus = async () => {
    if (!uploadMsaDocuDetails || !uploadMsaFile) return;
    try {
      // Upload file to S3
      await uploadFileToS3(uploadMsaDocuDetails.url, uploadMsaFile);

      // Update form status
      updateFormStatusToFulfilled({
        body: { formId, s3Location: uploadMsaFileUrl },
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      console.info("Form status updated successfully!");
    } catch (error) {
      console.error("Error uploading file or updating form status:", error);
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (uploadMsaDocuDetails) {
      setUploadMsaFileUrl("");
      setUploadMsaContentType("");
      uploadFileAndUpdateStatus();
    }
  }, [uploadMsaDocuDetails]);

  // Function to handle file selection and processing
  const uploadMsaFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      console.error("Please select a valid PDF or Word file.");
      return;
    }
    try {
      setFileSelected(true);
      setMsaFlag(true);
      setLoading(true);

      // Generate unique file name
      const updatedFileName = await processFileName(file.name);
      const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
      const randomId = await generateRandomId();
      const fileExtension = await getFileExtension(file.type);
      const uniqueFileName = `${updatedFileName}_${timestamp}_${randomId}.${fileExtension}`;
      const key = `partySignedMSADocument/${uniqueFileName}`;

      console.info(`Generated Key: ${key}, Content Type: ${file.type}`);

      setUploadMsaFileUrl(key);
      setUploadMsaContentType(file.type);
      setUploadMsaFile(file);
    } catch (error) {
      console.error("Error processing file:", error);
      setLoading(false);
    }
  };

  const {
    data: refreshFormDetailsData,
    isError: refreshError,
    isLoading: refreshPageLoading
  } = useGetFormDetail(
    {
      headers: { Authorization: `Bearer ${accessToken}` },
      pathParams: { id: formId },
      queryParams: { email: emailId, type: page, moduleId: moduleId }
    },
    { enabled: shouldRefetchFormDetails, retry: false }
  );

  // Ensure departmentQuery.data exists and then access its data property
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (refreshError) {
      console.error("Error fetching form details:", error);
      setIsAccessDenied(true);
    } else if (refreshFormDetailsData) {
      setValues(refreshFormDetailsData.data);
      mapFormInfo(refreshFormDetailsData.data.formInfo, refreshFormDetailsData?.data);
      const workflowSummary = {
        code: refreshFormDetailsData?.data?.code ?? "",
        createdAt: refreshFormDetailsData?.data?.createdAt ?? "",
        workflow: refreshFormDetailsData?.data?.workflowName ?? "",
        status: refreshFormDetailsData?.data?.status ?? "",
        requester_name: refreshFormDetailsData?.data?.requesterName ?? "",
        requester_email: refreshFormDetailsData?.data?.requesterEmail ?? ""
      };
      setWorkflowStatus(refreshFormDetailsData?.data.status);
      mapWorkflowInfo(workflowSummary);
      mapFinanceInfo(refreshFormDetailsData?.data.formAdditionalInfo);
      setformStatus(refreshFormDetailsData?.data.status);
      setIsFinance(refreshFormDetailsData?.data.isAdditionalAccess);
      setHistoryData(refreshFormDetailsData?.data.formHistory);
      setIsFormDetailLoading(false);

      setIsRecallFlag(refreshFormDetailsData?.data.isRecallFlag);
      setIsFinalApprover(refreshFormDetailsData?.data.isFinalApprover);
      setEsignRequired(refreshFormDetailsData?.data.eSignRequired);
      setIsWorkflowReset(refreshFormDetailsData?.data.isWorkflowReset);
      setIsDocuSignRetrigger(refreshFormDetailsData?.data.isDocuSignRetrigger);
      setApprovalBeingSought(refreshFormDetailsData?.data.approvalBeingSought);
      setIsFirstReviewerEditFlag(refreshFormDetailsData?.data.isFirstReviewerEditFlag);
    }
  }, [refreshError, refreshPageLoading, refreshFormDetailsData]);

  const { data: viewDocuDetails } = useGeneratePreSignedUrl(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      queryParams: {
        url: viewFileUrl
      }
    },
    {
      enabled: !!viewFileUrl,
      retry: false
    }
  );

  useEffect(() => {
    if (viewDocuDetails) {
      try {
        setViewFileUrl("");
        window.open(viewDocuDetails?.getUrl, "_blank");
      } catch (error) {
        console.error("Error");
      }
    }
  }, [viewDocuDetails]);

  const handleFileView = async (attachmentUrl: string) => {
    setViewFileUrl(attachmentUrl);
  };

  useEffect(() => {
    if (!refreshPage) {
      console.log(`Form refreshPage:${refreshPage}`);
      queryClient.invalidateQueries();
    }
  }, [refreshPage, queryClient]);

  const [isOpen, setIsOpen] = useState(false);
  const closePanel = () => setIsOpen(false);
  if (isAccessDenied) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Lottie animationData={PermissionDenied} style={{ height: 130 }} />

        <p className="w-full text-lg font-semibold text-gray-400 text-center">
          You are not authorized to access this page.
        </p>

        <a href="/contract/forms" className="text-blue-600 underline text-sm">
          Back to Forms
        </a>
      </div>
    );
  }

  return (
    <>
      <main className="py-1 bg-slate-50">
        {(detailPageLoading || refreshPageLoading) && <Loader />}
        {(formDetailsData || refreshFormDetailsData) && !isAccessDenied && (
          <>
            <div className=" pe-5 px-7 mb-2 flex flex-row w-full gap-2 items-center">
              {/* Left-aligned text */}
              <div className="flex-1">
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <span
                  className="text-gray-500 font-semibold cursor-pointer"
                  title="Back"
                  onClick={() => handleBack()}
                >{`${moduleStore?.name} / Forms`}</span>
                <span className="text-gray-900 font-semibold">{" / Details"}</span>
              </div>

              {/* Right-aligned button */}
              <Button
                leftIcon={<ArrowLeftIcon className="w-3 h-3" />}
                className="justify-center ml-auto w-16 h-7 mr-1 bg-[#632b50] text-white font-medium hover:bg-[#632b50] hover:border-[#632b50]" // Pushes button to the right
                //variant="primary"
                size="md"
                title="Back"
                label="Back"
                onClick={() => handleBack()}
              />
            </div>
            {/* Border under the whole section */}
            <div className="border-b-2 border-b-gray-200" />

            <div className="mx-4">
              <div className="-mx-4 mb-3 bg-white border border-slate-200">
                <div className="py-5 pe-3">
                  <div className="sm:flex items-center justify-between">
                    <div className="px-3 pe-5 py-2 h-full ml-2 flex flex-row">
                      <div>
                        {/* <DocumentIcon className=" w-10 h-10" /> */}
                        {/* biome-ignore lint/a11y/useAltText: <explanation> */}
                        <img className=" w-10 h-10" src={icons.contractIcon} />
                      </div>
                      <div className="flex flex-col ml-5">
                        <span className="text-lg font-semibold text-gray-900">
                          Contract Information
                        </span>
                        <span className=" text-md font-normal text-gray-800">
                          Contract details and application
                        </span>
                      </div>
                    </div>

                    <div className="flex-grow flex justify-end items-center">
                      {page === "approveRequest" && formStatus === "pending" && (
                        <div className="flex items-center space-x-2 pr-3">
                          {isFirstReviewerEditFlag && (
                            <Button
                              leftIcon={<PencilIcon className="w-3 h-3" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
                              //variant="primary"
                              size="md"
                              title="Edit First Reviewer"
                              label="Edit"
                              onClick={() => resubmit()}
                            />
                          )}

                          {isFinance ? (
                            <Button
                              leftIcon={<CheckIcon className="w-3 h-3" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="primary"
                              size="md"
                              title="Approve"
                              label="Approve"
                              onClick={() => handleOpenFinanceApproveAlert()}
                            />
                          ) : !isFinance &&
                            pathParts[1] === "finance" &&
                            !isFinalApprover ? (
                            <Button
                              disabled={isApproveBtnLoading}
                              leftIcon={<CheckIcon className="w-4 h-4" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="primary"
                              size="md"
                              title="Approve"
                              label={isApproveBtnLoading ? "Processing..." : "Approve"}
                              onClick={() => Approve("approved")}
                            />
                          ) : !isFinance &&
                            pathParts[1] === "finance" &&
                            isFinalApprover &&
                            esignRequired ? (
                            <Button
                              leftIcon={<CheckCircleIcon className="w-5 h-5" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="primary"
                              size="md"
                              title="Approve"
                              label="Approve"
                              onClick={() => handleOpenFinalApproverAlert()}
                            />
                          ) : !isFinance &&
                            pathParts[1] === "finance" &&
                            isFinalApprover &&
                            !esignRequired ? (
                            <Button
                              disabled={isApproveBtnLoading}
                              leftIcon={<CheckIcon className="w-3 h-3" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="primary"
                              size="md"
                              title="Approve"
                              label={isApproveBtnLoading ? "Processing..." : "Approve"}
                              onClick={() => Approve("approved")}
                            />
                          ) : null}

                          <Button
                            leftIcon={<XMarkIcon className="w-4 h-4" />}
                            className="bg-red-500 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                            //variant="outline"
                            size="md"
                            title="Reject"
                            label="Reject"
                            onClick={() => handleOpenRejectAlert()}
                          />
                        </div>
                      )}
                      {page === "myRequest" &&
                        formStatus === "pending" &&
                        isRecallFlag && (
                          <div className="">
                            <Button
                              leftIcon={<ArrowPathIcon className="w-3 h-3" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="outline"
                              size="md"
                              title="The requester withdrew this request to correct accidental errors."
                              label="Recall Request"
                              onClick={() => handleRecallButtonClick()}
                            />
                          </div>
                        )}
                      {page === "esignRequest" &&
                        formStatus === "esign-initiated" &&
                        isDocuSignRetrigger && (
                          <div className="">
                            <Button
                              leftIcon={
                                <ArrowPathRoundedSquareIcon className="w-3 h-3" />
                              }
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="outline"
                              size="md"
                              title="Resend this DocuSign signature request? The recipient will receive a new email notification."
                              label="Resend Docusign"
                              onClick={() => handleRetriggerButtonClick()}
                            />
                          </div>
                        )}

                      {page === "esignRequest" &&
                        formStatus === "esign-initiated" &&
                        isWorkflowReset && (
                          <div className="">
                            <Button
                              leftIcon={
                                <ArrowLeftStartOnRectangleIcon className="w-3 h-3" />
                              }
                              className="border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white me-3"
                              //variant="outline"
                              size="md"
                              title="The last approver is no longer available. Reset to 'Pending' to reassign."
                              label="Restart Workflow"
                              onClick={() => handleResetButtonClick()}
                            />
                          </div>
                        )}
                      {page === "myRequest" &&
                        (formStatus === "rejected" || formStatus === "draft") && (
                          <Button
                            leftIcon={<PencilIcon className="w-3 h-3" />}
                            className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                            //variant="primary"
                            size="md"
                            title="Edit"
                            label="Edit"
                            onClick={() => resubmit()}
                          />
                        )}
                      {page === "myRequest" &&
                        approvalBeingSought !== "Expenditure no contract for signing" &&
                        values?.status &&
                        (values.status === "completed" ||
                          values.status === "fulfilled") && (
                          <div className="flex items-center space-x-2 pr-3">
                            <Button
                              disabled={isLoading}
                              leftIcon={<ArrowDownTrayIcon className="w-3 h-3" />}
                              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                              //variant="primary"
                              size="md"
                              title={
                                values.status === "completed"
                                  ? "Click here to download your digitally signed document."
                                  : "You may download your dual-signed document here."
                              }
                              label={isLoading ? "Downloading..." : "Contract Download"}
                              onClick={() => handleDownloadPDF()}
                            />
                            {page === "myRequest" &&
                              values &&
                              values.status === "completed" && (
                                <>
                                  <input
                                    type="file"
                                    accept={allowedMimeTypes.join(",")}
                                    onChange={uploadMsaFileChange}
                                    style={{ display: "none" }}
                                    ref={fileInputRef}
                                  />
                                  {!fileSelected && (
                                    <Button
                                      disabled={loading}
                                      leftIcon={<ArrowUpTrayIcon className="w-3 h-3" />}
                                      className="border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white me-3"
                                      //variant="primary"
                                      size="md"
                                      title="Please use this button to upload a dual-signed document."
                                      label={loading ? "Uploading..." : "Contract Upload"}
                                      onClick={() => handleUploadClick()}
                                    />
                                  )}
                                </>
                              )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-1 py-1 xl:w-ful">
                <WorkFlowStages steps={values?.workflowDetails} status={workflowStatus} />
              </div>

              <div className="p-0">
                <div className="max-w-full mx-auto">
                  <div className="bg-pattern rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-medium leading-4 text-gray-900 mb-4">
                      Contract Summary
                    </h2>

                    <div className="info-box">
                      {/* Responsive Grid Layout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                        {mappedWorkflow?.map((item: CardItemProp, index: number) => (
                          <div className="w-full" key={`${index}_${Date.now()}`}>
                            <WorkflowCardItem
                              fieldKey={item.fieldKey}
                              label={item.label}
                              value={item.value}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="xl:flex xl:flex-row my-2 gap-3">
                <div className="xl:w-[65%] mb-2 mt-3 xl:mt-0 ">
                  <div className="mt-3">
                    <Card title="Contract Details" headerButton={false}>
                      <div
                        className="px-5 pt-1 grid grid-cols-1 gap-y-4 gap-x-6 pb-4"
                        key={`${Date.now()}`}
                      >
                        {mappedFormInfo?.map((item: CardItemProp, index: number) => {
                          return item.value ? (
                            <div
                              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                              key={index}
                            >
                              <FormInfoCardItem
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                fieldKey={item.fieldKey}
                                label={item.label}
                                value={item.value}
                              />
                              <hr className="border-b border-gray-200 mt-3" />
                            </div>
                          ) : null;
                        })}
                      </div>
                    </Card>
                  </div>
                </div>
                <div className="xl:w-[35%] ">
                  {values?.attachments && values?.attachments?.length > 0 && (
                    <div className="mt-3">
                      <Card title="Additional Attachments">
                        {values.attachments.map((url: string, index: number) => {
                          const fileName = getAttachmentFileName(url);
                          const { name, extension } = cropFileName(fileName, 150);

                          // Function to get the correct icon based on file type
                          const getFileIcon = (ext: string) => {
                            const iconsMap: { [key: string]: string } = {
                              doc: icons.doc,
                              pdf: icons.pdf,
                              xls: icons.xls
                            };
                            return iconsMap[ext] || icons.doc; // Default to doc icon
                          };

                          return (
                            <div
                              key={`${index}_${url}`} // Removed Date.now() to prevent unnecessary re-renders
                              className="flex items-center justify-between p-3 bg-white rounded-lg border-gray-200"
                            >
                              <img
                                src={getFileIcon(extension)}
                                className="w-6 h-6"
                                alt={`${extension} file`}
                              />
                              <div className="ml-3 flex-1 min-w-0">
                                <p className="text-md font-semibold text-gray-800 truncate w-48">
                                  Attachments
                                </p>
                                <p className="text-sm font-normal text-gray-800 truncate max-w-sm">
                                  {name}
                                </p>
                              </div>

                              {/* Download Icon */}
                              <ArrowDownTrayIcon
                                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={() => handleFileView(url)}
                              />
                            </div>
                          );
                        })}
                      </Card>
                    </div>
                  )}
                  {values?.msaAttachments && values.msaAttachments?.length > 0 && (
                    <div className="mt-3">
                      <Card title="Contract Attachments">
                        {values.msaAttachments.map((url: string, index: number) => {
                          const fileName = getAttachmentFileName(url);
                          const { name, extension } = cropFileName(fileName, 150);

                          // Determine title based on file path prefix
                          const getTitle = (fileUrl: string) => {
                            if (fileUrl.startsWith("msadocuments"))
                              return "Actual Contract";
                            if (fileUrl.startsWith("approverSignedMSADocument"))
                              return "Signed Contract";
                            if (fileUrl.startsWith("partySignedMSADocument"))
                              return "Dually Signed Contract";
                            return "Document"; // Default title
                          };
                          const getFileIcon = (ext: string) => {
                            const iconsMap: { [key: string]: string } = {
                              doc: icons.doc,
                              pdf: icons.pdf,
                              xls: icons.xls
                            };
                            return iconsMap[ext] || icons.doc; // Default to doc icon
                          };

                          return (
                            <div
                              key={`${index}_${url}`} // Removed Date.now() for performance optimization
                              className="flex items-center justify-between p-3 py-3 w-full gap-2 border-gray-200"
                            >
                              <img
                                src={getFileIcon(extension)}
                                className="w-6 h-6"
                                alt={`${extension} file`}
                              />

                              {/* File Info */}
                              <div className="flex-1 min-w-0">
                                <p className="text-md font-semibold text-gray-800">
                                  {getTitle(url)}
                                </p>
                                <p className="text-sm font-normal text-gray-800 truncate max-w-sm">
                                  {name}
                                </p>
                              </div>

                              {/* Download Icon */}
                              <ArrowDownTrayIcon
                                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
                                onClick={() => handleFileView(url)}
                              />
                            </div>
                          );
                        })}
                      </Card>
                    </div>
                  )}
                  {Object.keys(formDetailsData?.data?.formAdditionalInfo || {}).length >
                    0 && (
                    <div className="mt-5">
                      <Card title="Finance Review Details" headerButton={false}>
                        {/* <div className="px-3 pt-4"> */}
                        <div className="pb-3">
                          {mappedFinanceInfo?.map((item: CardItemProp, index: number) => (
                            <div className="pt-4 px-3">
                              <FormInfoCardItem
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                fieldKey={item.fieldKey}
                                label={item.label}
                                value={item.value}
                              />
                            </div>
                          ))}
                        </div>
                        {/* </div> */}
                      </Card>
                    </div>
                  )}
                  {
                    <div className="mt-3">
                      <Card title="Activity">
                        <WorkFlowHistory workflowHistory={historyData} />
                      </Card>
                    </div>
                  }
                </div>
              </div>
            </div>
            {isOpen && (
              <SlidOvers heading="History" isOpen={isOpen} onClose={closePanel}>
                <WorkFlowHistory workflowHistory={historyData} />
              </SlidOvers>
            )}
          </>
        )}
      </main>
      {
        <ContractAddEditForm
          formId={formId}
          type={editUserOpen ? "edit" : "none"}
          formData={formDetailsData}
          setOpenDraw={val => setEditUserOpen(val)}
          openDraw={editUserOpen}
        />
      }
      {
        <AlertLayout
          enableParentClose={true}
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showAlert}
          setOpen={setShowAlert}
          {...alertInfo}
          btnActionCallBack={approveRejectCallback}
        />
      }
      {
        <AlertLayout
          enableParentClose={true}
          additionalUiContents={rejectReasonForm()}
          buttonContents={updatedRejectButtons}
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showAlertReject}
          setOpen={setShowAlertReject}
          {...alertInfo}
          btnActionCallBack={approveRejectCallback}
        />
      }
      {
        <AlertLayout
          enableParentClose={true}
          additionalUiContents={financeApproveForm()}
          buttonContents={updatedFinanceApproveButtons}
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showFinaceApproveAlert}
          setOpen={setShowFinaceApproveAlert}
          {...alertInfo}
          btnActionCallBack={financeApproveCallback}
        />
      }
      {
        <AlertLayout
          title="Recall Request"
          icon={<ErrorIcon />}
          enableParentClose={true}
          additionalUiContents={recallListForm()}
          buttonContents={updatedRecallButtons}
          open={showRecallAlert}
          setOpen={setShowRecallAlert}
          btnActionCallBack={recallCallback}
        />
      }
      {
        <AlertLayout
          title="Resend Docusign"
          icon={<ErrorIcon />}
          customStyles={{ titleContainerStyle: "h-10", titleStyle: "" }}
          enableParentClose={true}
          additionalUiContents={retriggerForm()}
          buttonContents={updatedRetriggerButtons}
          open={showRetriggerAlert}
          setOpen={setShowRetriggerAlert}
          // {...alertInfo}
          btnActionCallBack={retriggerCallback}
        />
      }
      {
        <AlertLayout
          title="Restart Workflow"
          icon={<ErrorIcon />}
          enableParentClose={true}
          additionalUiContents={resetForm()}
          buttonContents={updatedResetButtons}
          open={showResetAlert}
          setOpen={setShowResetAlert}
          btnActionCallBack={resetCallback}
        />
      }
      {
        <AlertLayout
          enableParentClose={true}
          additionalUiContents={finalApproverForm()}
          buttonContents={updatedApproveButtons}
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={false}
          setOpen={setShowFinalApproverAlert}
          {...alertInfo}
          customStyles={{ alertBoxContainerStyle: "w-1/3" }}
          btnActionCallBack={finalApproverCallback}
        />
      }
    </>
  );
}
