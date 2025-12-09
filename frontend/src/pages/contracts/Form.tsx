import { Alert, Button, Drawer, RadioGroupItem } from "@ui-components";
import { InputLabel } from "../../layouts/InputLabel/InputLabel";
import { useForm } from "react-hook-form";
import {
  approvalOptions,
  currencyOptions,
  entityOptions,
  VendorFormNewProps,
  VendorFormProps
} from "../../constants/formConstants";
import {
  useCreateContractForm,
  useCreateDraftContractForm,
  useGetAllDepartmentsByModuleId,
  useGetGMUser,
  useUpdateContractForm
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { useEffect, useRef, useState } from "react";
import { SelectLabel } from "../../layouts/SelectLabel/SelectLabel";
import { AnyProp } from "../../common/types";
import { SelectValueProps } from "@ui-components/Select/types";
import { FileUpload } from "../../components/FileUpload";
import dayjs from "dayjs";
import { DateLabel } from "../../layouts/DateLabel/DateLabel";

import { GetFormDetailResponseDto, ObjectId } from "../../api/backend/backendSchemas";
import { useNavigate } from "@tanstack/react-router";
import { AlertProps } from "@ui-components/Alert/types";
import { ButtonProps } from "@ui-components/Button/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { RadioGroupLabel } from "../../layouts/RadioGroupLabel/RadioGroupLabel";
import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { RichTextBoxLabel } from "../../layouts/RichTextBoxLabel/RichTextBoxLabel";
import toast from "react-hot-toast";

const SSTApprovalDynamicOptions = [
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
  },
  {
    value: "N/A",
    label: "N/A",
    disabled: false,
    description: ""
  }
];

const expenditureContractDynamicOptions = [
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

const contractTechReviewDynamicOptions = [
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

const modernSlaveryDynamicOptions = [
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

const supplierCodeConductDynamicOptions = [
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

const armsLengthDynamicOptions = [
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

const contractCountertDynamicOptions = [
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
  },
  {
    value: "N/A",
    label: "N/A",
    disabled: false,
    description: ""
  }
];

const isCapitalExpDynamicOptions = [
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

export type VendorContractNewFormProps = {
  formId?: string;
  type: "add" | "edit" | "none";
  openDraw: boolean;
  setOpenDraw: (val: boolean) => void;
  formData?: GetFormDetailResponseDto;
  parentCB?: (actionId: string) => void;
};

export const ContractAddEditForm = ({
  formId = "",
  type,
  formData,
  openDraw,
  setOpenDraw
}: VendorContractNewFormProps) => {
  const formOptions = useForm<VendorFormProps>();
  const { accessToken, emailId, name } = useAuthStore();

  const { moduleStore } = useSelectedModuleStore();

  const [departmentDD, setDepartmentDD] = useState<SelectValueProps[]>([]);

  const [selectedDepartment, setSelectedDepartment] = useState<AnyProp>(undefined);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedGeneralManager, setSelectedGeneralManager] = useState<AnyProp>(undefined);
  const [generalManagerOptions, setGeneralManagerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [selectedEntity, setSelectedEntity] = useState<SelectValueProps | undefined>(undefined);
  const [selectedCurrency, setSelectedCurrency] = useState<SelectValueProps | undefined>(
    currencyOptions[0]
  );
  const [selectedApproval, setSelectedApproval] = useState<SelectValueProps | undefined>(undefined);
  const [SSTApproval, setSSTApproval] = useState<string>("");
  const [modernSlavery, setModernSlavery] = useState<string>("");
  const [contractTechReview, setContractTechReview] = useState<string>("");
  const [contractTechReviewRadioBtn, setContractTechReviewRadioBtn] = useState<string>("");
  const [supplierCodeConduct, setSupplierCodeConduct] = useState<string>("");
  const [armsLengthTransact, setArmsLengthTransact] = useState("");
  const [contractCounterParty, setContractCounterParty] = useState("");
  const [isCapitalExpenditure, setIsCapitalExpenditure] = useState("");
  const [expenditureContract, setExpenditureContract] = useState<string>("");
  const [alertInfo, setAlertInfo] = useState<AlertProps>();

  const [selectFormCode, setSelectFormCode] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [showDraftAlert, setShowDraftAlert] = useState(false);
  const { getValues, handleSubmit, reset, setValue } = formOptions;
  const { watch } = formOptions;
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<string>("");
  const [isLoadingDraft, setIsLoadingDraft] = useState(false);
  const s3UrlRef = useRef<string[]>([]);
  const msaS3UrlRef = useRef<string[]>([]);

  const [expenditureApproval, setExpenditureApproval] = useState("");
  const [expenditureApprovalExplain, setExpenditureApprovalExplain] = useState("");
  const [ifNoExpContract, setIfNoExpContract] = useState("");
  const [relevantFinancialBudget, setRelevantFinancialBudget] = useState("");
  const [ifNoSST, setIfNoSST] = useState("");
  const [businessCase, setBusinessCase] = useState("");
  const [descAgreement, setDescAgreement] = useState("");
  const [specialOrUnusual, setSpecialOrUnusual] = useState("");
  const [termination, setTermination] = useState("");
  const [reputationalRisk, setReputationalRisk] = useState("");

  const [deliverContract, setDeliverContract] = useState("");
  const [typeOfEngagement, setTypeOfEngagement] = useState("");
  const [ifNoModernSlavery, setIfNoModernSlavery] = useState("");
  const [ifNoSupplierCodeConduct, setIfNoSupplierCodeConduct] = useState("");
  const [ifYesArmsLengthTransact, setIfYesArmsLengthTransact] = useState("");
  const [ifNoContractCounterParty, setIfNoContractCounterParty] = useState("");
  const [ifYesCapitalExpenditure, setIfYesCapitalExpenditure] = useState("");
  const [internalResources, setInternalResources] = useState("");
  const [otherComments, setOtherComments] = useState("");
  const [version, setVersion] = useState("V2");
  const [isDraftSubmitted, setIsDraftSubmitted] = useState<boolean>(false);

  const [startDate, endDate] = watch(["start_date", "end_date"]);
  const navigate = useNavigate({
    from: "/contract/forms"
  });

  const { data: departmentFullList } = useGetAllDepartmentsByModuleId(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      pathParams: {
        moduleId: moduleStore?._id
      }
    },
    {
      enabled: !!accessToken && !!moduleStore?._id,
      retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (type === "edit") {
      console.log("form data -- ", formData?.data);
      const { department = "", departmentName = "" } = formData?.data ?? {};
      const { name = "", userId = "" } = formData?.data?.specificApproverDetails ?? {};
      setValue("requester_name", formData?.data?.requesterName || "");
      setValue("requester_email", formData?.data?.requesterEmail || "");
      setFormStatus(formData?.data?.status ? formData?.data?.status : "");
      const formInfo = formData?.data?.formInfo as VendorFormNewProps;

      setSelectedDepartmentId(department);
      setSelectedDepartment({ label: departmentName, value: department });
      setSelectedGeneralManager({ label: name, value: userId });
      setSelectFormCode(formData?.data?.code ? formData?.data?.code : "");
      setVersion(formData?.data?.version ? formData?.data?.version : "");
      if (formInfo) {
        const keyValuePair = Object.entries(formInfo);
        console.log("keyvalue pair --- ", keyValuePair);

        for (const formKeyValue of keyValuePair) {
          if (typeof formKeyValue[1] === "string") {
            // Format monetary values with comma for UI display
            if (
              formKeyValue[0] === "monetary_value" ||
              formKeyValue[0] === "monetary_value_currency"
            ) {
              const cleaned = formKeyValue[1].replace(/,/g, "");
              const [intPart, decimalPart] = cleaned.split(".");
              const formattedInt = intPart
                ? parseInt(intPart, 10).toLocaleString("en-AU")
                : "";
              formKeyValue[1] =
                decimalPart !== undefined
                  ? `${formattedInt}.${decimalPart}`
                  : formattedInt;
            }
            if (formKeyValue[0] === "nrl_entity") {
              setSelectedEntity({ label: formKeyValue[1], value: formKeyValue[1] });
            }
            if (formKeyValue[0] === "approval_being_sought") {
              setSelectedApproval({ label: formKeyValue[1], value: formKeyValue[1] });
            }
            if (formKeyValue[0] === "currency") {
              setSelectedCurrency({ label: formKeyValue[1], value: formKeyValue[1] });
            }
            setValue(formKeyValue[0], formKeyValue[1]);
          } else if (typeof formKeyValue[1] === "number") {
            setValue(formKeyValue[0], formKeyValue[1].toString());
          }
        }
        if (formInfo) {
          setSSTApproval(formInfo.is_SST_approval || ""); // Store API value
          setExpenditureContract(formInfo.expenditure_contract || "");
          setContractTechReview(formInfo.contract_tech_review || "");
          setContractTechReviewRadioBtn(formInfo.contract_tech_review || "");
          setModernSlavery(formInfo.include_contract_form || "");
          setSupplierCodeConduct(formInfo.provide_supplier_code || "");
          setExpenditureApproval(formInfo.expenditure_approval || "");
          setExpenditureApprovalExplain(formInfo.expenditure_approval_explain || "");
          setIfNoExpContract(formInfo.if_no_justify_exp_contract || "");
          setRelevantFinancialBudget(formInfo.relevant_financial_budget || "");
          setIfNoSST(formInfo.if_no_justify_SST || "");
          setBusinessCase(formInfo.business_case || "");
          setDescAgreement(formInfo.desc_agreement || "");
          setSpecialOrUnusual(formInfo.special_or_unusual || "");
          setTermination(formInfo.termination || "");
          setReputationalRisk(formInfo.reputational_risk || "");
          setArmsLengthTransact(formInfo.arms_length_transact || "");
          setContractCounterParty(formInfo.contract_counterparty || "");
          setIsCapitalExpenditure(formInfo.is_capital_expenditure || "");
          setDeliverContract(formInfo.deliver_contract || "");
          setTypeOfEngagement(formInfo.type_of_engagement || "");
          setIfNoModernSlavery(formInfo.if_no_justify_modern_slavery || "");
          setIfNoSupplierCodeConduct(formInfo.if_no_justify_supplier_code_conduct || "");
          setIfYesArmsLengthTransact(formInfo.if_yes_arms_length_transact || "");
          setIfNoContractCounterParty(formInfo.if_no_contract_counterparty || "");
          setIfYesCapitalExpenditure(formInfo.if_yes_is_capital_expenditure || "");
          setInternalResources(formInfo.internal_resources || "");
          setOtherComments(formInfo.other_comments || "");
        }
      }
    }
  }, [type, formData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (alertInfo?.type === "success") {
      setOpenDraw(false);
    }
  }, [alertInfo]);

  useEffect(() => {
    const optionList = departmentFullList?.data.map((item: AnyProp) => ({
      label: item.name,
      value: item._id,
      data: item
    }));
    setDepartmentDD(optionList || []);

    // if (type === "add" && optionList && optionList?.length > 0) {
    //   setSelectedDepartmentId(optionList[0]?.value);
    //   setSelectedDepartment({ label: optionList[0]?.label, value: optionList[0]?.value });
    // }
  }, [departmentFullList]);

  const handleDraftClick = (formState: VendorFormProps) => {
    setIsDraftSubmitted(true);

     // Check department validity
    if (!selectedDepartment || !selectedDepartment.value) {
      setIsLoadingDraft(false);
      // biome-ignore lint/style/useConst: <explanation>
      let firstInvalidField: string | undefined = "department";
      if (firstInvalidField) {
        switch (firstInvalidField) {
          case "department":
            departmentRef.current?.focus();
            break;
        }
      }
      return; // Stop further execution if invalid
    }

    setIsLoadingDraft(true);
    const navBase =
      moduleStore?.code === "contract" ? "finance/vendor-contract" : moduleStore.code;

    const getCleanMonetaryValue = (value: string | number | undefined) => {
      if (!value) return value;
      return typeof value === "string" ? value.replace(/,/g, "") : value;
    };

    const formPostData = {
      formId,
      moduleId: moduleStore._id,
      code:
        type === "edit" && formStatus === "draft" && formData?.data?.code
          ? formData?.data?.code
          : selectFormCode,
      department: selectedDepartment?.value || "",
      departmentName: selectedDepartment?.label || "",
      formInfo: {
        requester_name: name,
        requester_email: emailId,
        ...formState,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        monetary_value: getCleanMonetaryValue((formState as any)?.monetary_value),
        monetary_value_currency: getCleanMonetaryValue(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (formState as any)?.monetary_value_currency
        ),
        department: selectedDepartment?.value || "",
        generalManager: selectedGeneralManager?.value || "",
        generalManagerName: selectedGeneralManager?.label || "",
        nrl_entity: selectedEntity?.value || "",
        currency: selectedCurrency?.value || "",
        approval_being_sought: selectedApproval?.value || "",
        expenditure_approval: expenditureApproval,
        expenditure_approval_explain: expenditureApprovalExplain,
        if_no_justify_exp_contract: ifNoExpContract,
        relevant_financial_budget: relevantFinancialBudget,
        business_case: businessCase,
        desc_agreement: descAgreement,
        special_or_unusual: specialOrUnusual,
        termination: termination,
        reputational_risk: reputationalRisk,
        arms_length_transact: armsLengthTransact,
        if_yes_arms_length_transact: ifYesArmsLengthTransact,
        contract_counterparty: contractCounterParty,
        if_no_contract_counterparty: ifNoContractCounterParty,
        is_capital_expenditure: isCapitalExpenditure,
        if_yes_is_capital_expenditure: ifYesCapitalExpenditure,
        deliver_contract: deliverContract,
        type_of_engagement: typeOfEngagement,
        internal_resources: internalResources,
        is_SST_approval: SSTApproval,
        if_no_justify_SST: ifNoSST,
        include_contract_form: modernSlavery,
        if_no_justify_modern_slavery: ifNoModernSlavery,
        provide_supplier_code: supplierCodeConduct,
        if_no_justify_supplier_code_conduct: ifNoSupplierCodeConduct,
        expenditure_contract: expenditureContract,
        contract_tech_review: contractTechReview,
        other_comments: otherComments
      },
      specificApproverUserId: selectedGeneralManager?.value || "",
      attachments: s3UrlRef.current,
      msaAttachments: msaS3UrlRef.current,
      executiveApprove: false,
      createdBy: emailId,
      formHistory: [],
      mailRedirectPath: `/${navBase}/requests/detail/formDetailId?page=approveRequest&moduleId=${moduleStore?._id}`
    };
    console.log("Draft data ---- ", formPostData);
    formMutateDraft({
      body: { ...formPostData } as AnyProp,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const { mutate: formMutateDraft } = useCreateDraftContractForm({
    onSuccess: response => {
      Alert;
      setIsLoadingDraft(false);
      console.log("success", response.message);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      resetAll();
      setAlertInfo({ ...alertInfo, type: "success" });
      // setShowDraftAlert(true);
      setIsLoading(false);
      setOpenDraw(false);
      navigate({
        to: "/contract/forms"
      });
      toast.success(response.message);
    },
    onError: (error: AnyProp) => {
      console.log("error --- ", error);
      setIsLoadingDraft(false);
      const alertInfo: AlertProps = {
        title: "Error",
        message:
          error?.stack?.message ||
          error?.message ||
          "An error occurred while creating the form."
      };
      setAlertInfo({ ...alertInfo, type: "error" });
      setShowDraftAlert(true);
      setIsLoading(false);
    }
  });

  const alertDCb = (id: string) => {
    switch (id) {
      case "success_okay":
        window.location.reload();
        break;
    }
  };

  const validateForm = (): {
    isValid: boolean;
    errors: string[];
    firstInvalidField?: string;
  } => {
    const errors: string[] = [];
    let firstInvalidField: string | undefined;

    // Basic field validations
    if (!selectedDepartment) {
      errors.push("Department is required");
      firstInvalidField = firstInvalidField || "department";
    }

    if (version === "V2") {
      if (selectedApproval?.value !== "Deed of Novation") {
        if (
          (selectedDepartment?.value && gmUserList?.message === "No GM users found") ||
          (selectedDepartment?.value &&
            gmUserList?.message === "GM users are been retrived")
        ) {
          if (gmUserList?.message === "No GM users found")
            errors.push("No GM users found");
          if (
            !selectedGeneralManager &&
            gmUserList?.message === "GM users are been retrived"
          ) {
            errors.push("General Manager field is required");
            firstInvalidField = firstInvalidField || "generalManager";
          }
        }
      }
      if (!selectedApproval) {
        errors.push("Type of Approval is required");
        firstInvalidField = firstInvalidField || "approval_being_sought";
      }
    }

    if (!selectedEntity) {
      errors.push("Contracting Entity is required");
      firstInvalidField = firstInvalidField || "nrl_entity";
    }

    // Rich text field validations
    if (isEmptyRichText(businessCase)) {
      errors.push("Business case is required");
      firstInvalidField = firstInvalidField || "business_case";
    }
    if (isEmptyRichText(descAgreement)) {
      errors.push("Description of agreement is required");
      firstInvalidField = firstInvalidField || "descAgreement";
    }

    // if (!getValues("term")) {
    //   errors.push("Term is required");
    //   firstInvalidField = firstInvalidField || "term";
    // }

    // if (!getValues("counter_party")) {
    //   errors.push("Counter Party is required");
    //   firstInvalidField = firstInvalidField || "counter_party";
    // }

    // if (!getValues("monetary_value")) {
    //   errors.push("Monetary Value (in AUD, excluding Australian GST) is required");
    //   firstInvalidField = firstInvalidField || "monetary_value";
    // }

    // if (selectedCurrency?.value !== "AUD" && !getValues("monetary_value_currency")) {
    //   errors.push("Monetary Value in the contracted currency is required");
    //   firstInvalidField = firstInvalidField || "monetary_value_currency";
    // }

    if (isEmptyRichText(relevantFinancialBudget)) {
      errors.push("Relevant financial budget is required");
      firstInvalidField = firstInvalidField || "relevant_financial_budget";
    }

    // Radio button validations
    if (!SSTApproval) {
      errors.push("SST approval confirmation is required");
      firstInvalidField = firstInvalidField || "is_SST_approval";
    }
    if (SSTApproval === "No" && isEmptyRichText(ifNoSST)) {
      errors.push("Justification for no SST approval is required");
      firstInvalidField = firstInvalidField || "if_no_justify_SST";
    }

    if (isEmptyRichText(termination)) {
      errors.push("Termination details are required");
      firstInvalidField = firstInvalidField || "termination";
    }
    if (isEmptyRichText(reputationalRisk)) {
      errors.push("Reputational risk assessment is required");
      firstInvalidField = firstInvalidField || "reputational_risk";
    }

    if (isEmptyRichText(specialOrUnusual)) {
      errors.push("Special or unusual terms are required");
      firstInvalidField = firstInvalidField || "special_or_unusual";
    }

    if (version === "V2") {
      if (
        selectedApproval?.value === "Expenditure Contract" ||
        selectedApproval?.value === "Expenditure no contract for signing"
      ) {
        if (isEmptyRichText(expenditureApproval)) {
          errors.push("Expenditure approval summary is required");
          firstInvalidField = firstInvalidField || "expenditure_approval";
        }
        if (isEmptyRichText(expenditureApprovalExplain)) {
          errors.push("Expenditure approval explanation is required");
          firstInvalidField = firstInvalidField || "expenditure_approval_explain";
        }
        if (!expenditureContract) {
          errors.push("Expenditure contract confirmation is required");
          firstInvalidField = firstInvalidField || "expenditure_contract";
        }
      }
    }

    // Conditional validations
    if (expenditureContract === "No" && isEmptyRichText(ifNoExpContract)) {
      errors.push("Justification for no expenditure contract is required");
      firstInvalidField = firstInvalidField || "if_no_justify_exp_contract";
    }

    // Radio button validations
    if (!armsLengthTransact) {
      errors.push("Arm's length transaction details are required");
      firstInvalidField = firstInvalidField || "arms_length_transact";
    }
    if (armsLengthTransact === "Yes" && isEmptyRichText(ifYesArmsLengthTransact)) {
      errors.push("Justification for yes arms length transact is required");
      firstInvalidField = firstInvalidField || "if_yes_arms_length_transact";
    }

    if (!contractCounterParty) {
      errors.push("Contract counterparty details are required");
      firstInvalidField = firstInvalidField || "contract_counterparty";
    }
    if (contractCounterParty === "No" && isEmptyRichText(ifNoContractCounterParty)) {
      errors.push("Justification for no contract counterparty is required");
      firstInvalidField = firstInvalidField || "if_no_contract_counterparty";
    }

    if (!modernSlavery) {
      errors.push("Modern slavery confirmation is required");
      firstInvalidField = firstInvalidField || "include_contract_form";
    }
    if (modernSlavery === "No" && isEmptyRichText(ifNoModernSlavery)) {
      errors.push("Justification for no modern slavery questionnaire is required");
      firstInvalidField = firstInvalidField || "if_no_justify_modern_slavery";
    }

    if (!supplierCodeConduct) {
      errors.push("Supplier code of conduct confirmation is required");
      firstInvalidField = firstInvalidField || "provide_supplier_code";
    }
    if (supplierCodeConduct === "No" && isEmptyRichText(ifNoSupplierCodeConduct)) {
      errors.push("Justification for no supplier code of conduct is required");
      firstInvalidField = firstInvalidField || "if_no_justify_supplier_code_conduct";
    }

    if (!isCapitalExpenditure) {
      errors.push("Capital expenditure details are required");
      firstInvalidField = firstInvalidField || "is_capital_expenditure";
    }
    if (isCapitalExpenditure === "Yes" && isEmptyRichText(ifYesCapitalExpenditure)) {
      errors.push("Justification for yes capital expenditure is required");
      firstInvalidField = firstInvalidField || "if_yes_is_capital_expenditure";
    }

    if (version === "V2") {
      if (!contractTechReview && selectedApproval?.value !== "Deed of Novation") {
        errors.push("Tech review confirmation is required");
        firstInvalidField = firstInvalidField || "contract_tech_review";
      }
    }

    if (isEmptyRichText(deliverContract)) {
      errors.push("Contract delivery details are required");
      firstInvalidField = firstInvalidField || "deliver_contract";
    }
    if (isEmptyRichText(typeOfEngagement)) {
      errors.push("Type of engagement is required");
      firstInvalidField = firstInvalidField || "type_of_engagement";
    }
    if (isEmptyRichText(internalResources)) {
      errors.push("Internal resources details are required");
      firstInvalidField = firstInvalidField || "internal_resources";
    }

    // Document upload validations
    // MSA attachments are optional during initial submission
    // They are only required when uploading signed contracts after form completion
    // No validation needed here for new forms or draft submissions

    return {
      isValid: errors.length === 0,
      errors,
      firstInvalidField
    };
  };

  // Add refs for all required fields, including conditional rich text fields
  const approvalRef = useRef<{ focus: () => void } | null>(null);
  const entityRef = useRef<{ focus: () => void } | null>(null);
  const departmentRef = useRef<{ focus: () => void } | null>(null);
  const generalManagerRef = useRef<{ focus: () => void } | null>(null);
  const businessCaseRef = useRef<{ focus: () => void } | null>(null);
  const descAgreementRef = useRef<{ focus: () => void } | null>(null);
  const relevantFinancialBudgetRef = useRef<{ focus: () => void } | null>(null);
  const terminationRef = useRef<{ focus: () => void } | null>(null);
  const reputationalRiskRef = useRef<{ focus: () => void } | null>(null);
  const specialOrUnusualRef = useRef<{ focus: () => void } | null>(null);
  const deliverContractRef = useRef<{ focus: () => void } | null>(null);
  const typeOfEngagementRef = useRef<{ focus: () => void } | null>(null);
  const internalResourcesRef = useRef<{ focus: () => void } | null>(null);
  const expenditureApprovalRef = useRef<{ focus: () => void } | null>(null);
  const expenditureApprovalExplainRef = useRef<{ focus: () => void } | null>(null);
  const ifNoExpContractRef = useRef<{ focus: () => void } | null>(null);
  const ifNoSSTRef = useRef<{ focus: () => void } | null>(null);
  const ifNoModernSlaveryRef = useRef<{ focus: () => void } | null>(null);
  const ifNoSupplierCodeConductRef = useRef<{ focus: () => void } | null>(null);
  const ifYesArmsLengthTransactRef = useRef<{ focus: () => void } | null>(null);
  const ifNoContractCounterPartyRef = useRef<{ focus: () => void } | null>(null);
  const ifYesCapitalExpenditureRef = useRef<{ focus: () => void } | null>(null);
  const SSTApprovalRef = useRef<{ focus: () => void } | null>(null);
  const expenditureContractRef = useRef<{ focus: () => void } | null>(null);
  const contractTechReviewRef = useRef<{ focus: () => void } | null>(null);
  const modernSlaveryRef = useRef<{ focus: () => void } | null>(null);
  const supplierCodeConductRef = useRef<{ focus: () => void } | null>(null);
  const armsLengthTransactRef = useRef<{ focus: () => void } | null>(null);
  const contractCounterPartyRef = useRef<{ focus: () => void } | null>(null);
  const isCapitalExpenditureRef = useRef<{ focus: () => void } | null>(null);
  const termRef = useRef<{ focus: () => void } | null>(null);
  const counterPartyRef = useRef<{ focus: () => void } | null>(null);
  const monetaryValueRef = useRef<{ focus: () => void } | null>(null);
  const monetaryValueCurrencyRef = useRef<{ focus: () => void } | null>(null);

  const onFormSubmit = (formState: VendorFormProps) => {
    setIsLoading(true);
    console.log(
      `msaS3UrlRef: ${msaS3UrlRef.current.length} type: ${type} formStatus: ${formStatus}`
    );

    const { isValid, errors, firstInvalidField } = validateForm();
    if (!isValid) {
      console.log(errors.join("\n• "));
      console.log(firstInvalidField);
      setAlertInfo({
        title: "Error",
        message: "Please complete all required fields."
      });
      // setShowErrorAlert(true);
      setIsLoading(false);

      // Focus on the first invalid field
      if (firstInvalidField) {
        switch (firstInvalidField) {
          case "department":
            departmentRef.current?.focus();
            break;
          case "generalManager":
            generalManagerRef.current?.focus();
            break;
          case "nrl_entity":
            entityRef.current?.focus();
            break;
          case "approval_being_sought":
            approvalRef.current?.focus();
            break;
          case "business_case":
            businessCaseRef.current?.focus();
            break;
          case "descAgreement":
            descAgreementRef.current?.focus();
            break;
          case "relevant_financial_budget":
            relevantFinancialBudgetRef.current?.focus();
            break;
          case "termination":
            terminationRef.current?.focus();
            break;
          case "reputational_risk":
            reputationalRiskRef.current?.focus();
            break;
          case "special_or_unusual":
            specialOrUnusualRef.current?.focus();
            break;
          case "deliver_contract":
            deliverContractRef.current?.focus();
            break;
          case "type_of_engagement":
            typeOfEngagementRef.current?.focus();
            break;
          case "internal_resources":
            internalResourcesRef.current?.focus();
            break;
          case "expenditure_approval":
            expenditureApprovalRef.current?.focus();
            break;
          case "expenditure_approval_explain":
            expenditureApprovalExplainRef.current?.focus();
            break;
          case "if_no_justify_exp_contract":
            ifNoExpContractRef.current?.focus();
            break;
          case "if_no_justify_SST":
            ifNoSSTRef.current?.focus();
            break;
          case "if_no_justify_modern_slavery":
            ifNoModernSlaveryRef.current?.focus();
            break;
          case "if_no_justify_supplier_code_conduct":
            ifNoSupplierCodeConductRef.current?.focus();
            break;
          case "if_yes_arms_length_transact":
            ifYesArmsLengthTransactRef.current?.focus();
            break;
          case "if_no_contract_counterparty":
            ifNoContractCounterPartyRef.current?.focus();
            break;
          case "if_yes_is_capital_expenditure":
            ifYesCapitalExpenditureRef.current?.focus();
            break;
          case "is_SST_approval":
            SSTApprovalRef.current?.focus();
            break;
          case "expenditure_contract":
            expenditureContractRef.current?.focus();
            break;
          case "contract_tech_review":
            contractTechReviewRef.current?.focus();
            break;
          case "include_contract_form":
            modernSlaveryRef.current?.focus();
            break;
          case "provide_supplier_code":
            supplierCodeConductRef.current?.focus();
            break;
          case "arms_length_transact":
            armsLengthTransactRef.current?.focus();
            break;
          case "contract_counterparty":
            contractCounterPartyRef.current?.focus();
            break;
          case "is_capital_expenditure":
            isCapitalExpenditureRef.current?.focus();
            break;
          case "term":
            termRef.current?.focus();
            break;
          case "counter_party":
            counterPartyRef.current?.focus();
            break;
          case "monetary_value":
            monetaryValueRef.current?.focus();
            break;
          case "monetary_value_currency":
            monetaryValueCurrencyRef.current?.focus();
            break;
          case "msa_attachments":
            // Handle file upload focus if applicable
            break;
          // Add cases for other fields if needed (e.g., input fields, radio groups)
        }
      }
      return;
    }
    const navBase =
      moduleStore?.code === "contract" ? "finance/vendor-contract" : moduleStore.code;

    const getCleanMonetaryValue = (value: string | number | undefined) => {
      if (!value) return value;
      return typeof value === "string" ? value.replace(/,/g, "") : value;
    };

    const formPostData = {
      formId,
      moduleId: moduleStore._id,
      code:
        type === "edit" && formStatus === "draft" && formData?.data?.code
          ? formData?.data?.code
          : selectFormCode,
      department: selectedDepartment?.value || "",
      departmentName: selectedDepartment?.label || "",
      formInfo: {
        requester_name: name,
        requester_email: emailId,
        ...formState,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        monetary_value: getCleanMonetaryValue((formState as any)?.monetary_value),
        monetary_value_currency: getCleanMonetaryValue(
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (formState as any)?.monetary_value_currency
        ),
        department: selectedDepartment?.value || "",
        generalManager: selectedGeneralManager?.value || "",
        generalManagerName: selectedGeneralManager?.label || "",
        nrl_entity: selectedEntity?.value || "",
        currency: selectedCurrency?.value || "",
        approval_being_sought: selectedApproval?.value || "",
        expenditure_approval: expenditureApproval,
        expenditure_approval_explain: expenditureApprovalExplain,
        if_no_justify_exp_contract: ifNoExpContract,
        relevant_financial_budget: relevantFinancialBudget,
        business_case: businessCase,
        desc_agreement: descAgreement,
        special_or_unusual: specialOrUnusual,
        termination: termination,
        reputational_risk: reputationalRisk,
        arms_length_transact: armsLengthTransact,
        if_yes_arms_length_transact: ifYesArmsLengthTransact,
        contract_counterparty: contractCounterParty,
        if_no_contract_counterparty: ifNoContractCounterParty,
        is_capital_expenditure: isCapitalExpenditure,
        if_yes_is_capital_expenditure: ifYesCapitalExpenditure,
        deliver_contract: deliverContract,
        type_of_engagement: typeOfEngagement,
        internal_resources: internalResources,
        is_SST_approval: SSTApproval,
        if_no_justify_SST: ifNoSST,
        include_contract_form: modernSlavery,
        if_no_justify_modern_slavery: ifNoModernSlavery,
        provide_supplier_code: supplierCodeConduct,
        if_no_justify_supplier_code_conduct: ifNoSupplierCodeConduct,
        expenditure_contract: expenditureContract,
        contract_tech_review: contractTechReview,
        other_comments: otherComments
      },
      specificApproverUserId: selectedGeneralManager?.value || "",
      attachments: s3UrlRef.current,
      msaAttachments: msaS3UrlRef.current,
      executiveApprove: false,
      createdBy: emailId,
      formHistory: [],
      mailRedirectPath: `/${navBase}/requests/detail/formDetailId?page=approveRequest&moduleId=${moduleStore?._id}`
    };

    console.log("Form Request Data", formPostData);
    console.log(`📤 Submitting form - Type: ${type}, Status: ${formStatus}, Endpoint: ${type === "add" || (type === "edit" && formStatus === "draft") ? "CREATE (POST)" : "UPDATE (PUT)"}`);
    setIsLoading(true);
    if (type === "add" || (type === "edit" && formStatus === "draft")) {
      // Use CREATE endpoint for new forms and draft submissions
      // This ensures workflow is properly initialized and emails are sent
      formMutate({
        body: { ...formPostData } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } else if (type === "edit") {
      // Use UPDATE endpoint only for resubmitting rejected forms
      formMutateUpdate({
        body: { ...formPostData } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: formMutate } = useCreateContractForm({
    onSuccess: response => {
      console.log("success", response.message);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      resetAll();
      setAlertInfo({ ...alertInfo, type: "success" });
      setIsLoading(false);
      setOpenDraw(false);
      navigate({
        to: "/contract/forms"
      });
      toast.success(response.message);
    },
    onError: (error: AnyProp) => {
      console.log("error --- ", error);
      const alertInfo: AlertProps = {
        title: "Error",
        message:
          error?.stack?.message ||
          error?.message ||
          "An error occurred while creating the form."
      };
      setAlertInfo({ ...alertInfo, type: "error" });
      setShowAlert(true);
      setIsLoading(false);
    }
  });

  const alertCb = (id: string) => {
    switch (id) {
      case "success_okay":
        window.location.reload();
        break;
    }
  };

  const { mutate: formMutateUpdate } = useUpdateContractForm({
    onSuccess: response => {
      console.log("success", response.message);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      resetAll();
      setAlertInfo({
        ...alertInfo,
        type: "success",
        buttonContents: [
          {
            variant: "primary",
            size: "sm",
            buttonStyle: "w-full",
            id: "success_okay",
            label: "Okay"
          }
        ]
      });
      setIsLoading(false);
      setOpenDraw(false);
      window.location.reload();
      toast.success(response.message);
    },
    onError: (error: AnyProp) => {
      console.log("error --- ", error);
      const alertInfo: AlertProps = {
        title: "Error",
        message:
          error?.stack?.message ||
          error?.message ||
          "An error occurred while updating the form."
      };
      setAlertInfo({ ...alertInfo, type: "error" });
      setShowAlert(true);
      setIsLoading(false);
    }
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (openDraw) {
      const formCodeReference = dayjs().unix().toString();
      const formCode = `SST-${formCodeReference}`;
      setSelectFormCode(formCode);
      if (type !== "edit") {
        setValue("requester_name", name || "");
        setValue("requester_email", emailId || "");
      }
    }
  }, [openDraw]);

  const handleMsaContractAttachment = (response: AnyProp) => {
    msaS3UrlRef.current = response;
  };

  const handleAdditionalAttachments = (response: AnyProp) => {
    s3UrlRef.current = response;
  };

  const resetAll = () => {
    console.log("Inside Reset all");
    setSelectedDepartment(undefined);
    // setSelectedGeneralManager(undefined);
    setSelectedEntity(undefined);
    // setSelectedDepartmentId("");
    setSelectedCurrency(currencyOptions[0]);
    setSelectedApproval(undefined);
    setSSTApproval("");
    setContractTechReview("");
    setModernSlavery("");
    setSupplierCodeConduct("");
    setExpenditureContract("");
    setExpenditureApproval("");
    setExpenditureApprovalExplain("");
    setIfNoExpContract("");
    setRelevantFinancialBudget("");
    setIfNoSST("");
    setBusinessCase("");
    setDescAgreement("");
    setSpecialOrUnusual("");
    setTermination("");
    setReputationalRisk("");
    setArmsLengthTransact("");
    setContractCounterParty("");
    setIsCapitalExpenditure("");
    setDeliverContract("");
    setTypeOfEngagement("");
    setIfNoModernSlavery("");
    setIfNoSupplierCodeConduct("");
    setIfYesArmsLengthTransact("");
    setIfNoContractCounterParty("");
    setIfYesCapitalExpenditure("");
    setInternalResources("");
    setOtherComments("");
    msaS3UrlRef.current = [];
    s3UrlRef.current = [];
    setIsLoadingDraft(false);
    setIsLoading(false);
    setIsDraftSubmitted(false);
    reset();
  };

  const handleSSTApproval = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSSTApproval(value);
  };

  const handleExpenditureContract = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpenditureContract(value);
  };

  const handleContractTechReview = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContractTechReview(value);
  };

  const handleModernSlavery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModernSlavery(value);
  };

  const handleSupplierCodeConduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSupplierCodeConduct(value);
  };

  const handleArmsLengthTransact = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setArmsLengthTransact(value);
  };

  const handleContractCounterParty = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setContractCounterParty(value);
  };

  const handleIsCapitalExpenditure = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIsCapitalExpenditure(value);
  };

  const handleDepartmentChange = (selectedOption: { value: string; label: string }) => {
    setSelectedDepartment(selectedOption);
    setSelectedDepartmentId(selectedOption.value);
    setSelectedGeneralManager("");
  };

  const { data: gmUserList } = useGetGMUser(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      queryParams: {
        moduleId: moduleStore?._id,
        email: emailId ? emailId : "",
        deptId: selectedDepartmentId
      }
    },
    {
      enabled: !!selectedDepartmentId,
      retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (gmUserList) {
      //The user itself is GM - No GM users found - GM users are been retrived
      const options = gmUserList.data.map(
        ({ userId, userName }: { userId: ObjectId; userName: string }) => ({
          value: userId.toString(),
          label: userName
        })
      );
      setGeneralManagerOptions(options);
      const firstOption = options[0];
      if (type === "add" && firstOption && firstOption.value === "Not Required") {
        setSelectedGeneralManager(firstOption); // Set to "Not Required"
      } else if (
        type === "edit" &&
        formStatus === "draft" &&
        firstOption &&
        firstOption.value === "Not Required"
      ) {
        setSelectedGeneralManager(firstOption); // Set to "Not Required"
      }
    }
  }, [gmUserList]);

  const handleGeneralManagerChange = (selectedOption: {
    value: string;
    label: string;
  }) => {
    setSelectedGeneralManager(selectedOption);
  };

  const handleExpenditureApproval = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setExpenditureApproval(cleanedText.toString());
  };

  const handleExpenditureApprovalExplain = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setExpenditureApprovalExplain(cleanedText.toString());
  };

  const handleIfNoExpContract = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfNoExpContract(cleanedText.toString());
  };

  const handleRelevantFinancialBudget = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setRelevantFinancialBudget(cleanedText.toString());
  };

  const handleIfNoSST = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfNoSST(cleanedText.toString());
  };

  const handlebusinessCase = (text: string) => {
    // Remove any inline color styles and set text to black
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setBusinessCase(cleanedText.toString());
  };

  const handleDescAgreement = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setDescAgreement(cleanedText.toString());
  };

  const handleSpecialOrUnusual = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setSpecialOrUnusual(cleanedText.toString());
  };

  const handleTermination = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setTermination(cleanedText.toString());
  };

  const handleReputationalRisk = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setReputationalRisk(cleanedText.toString());
  };

  const handleDeliverContract = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setDeliverContract(cleanedText.toString());
  };

  const handleTypeOfEngagement = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setTypeOfEngagement(cleanedText.toString());
  };

  const handleInternalResources = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setInternalResources(cleanedText.toString());
  };

  const handleIfNoModernSlavery = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfNoModernSlavery(cleanedText.toString());
  };

  const handleIfNoSupplierCodeConduct = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfNoSupplierCodeConduct(cleanedText.toString());
  };

  const handleIfYesArmsLengthTransact = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfYesArmsLengthTransact(cleanedText.toString());
  };

  const handleIfNoContractCounterParty = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfNoContractCounterParty(cleanedText.toString());
  };

  const handleIfYesCapitalExpenditure = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setIfYesCapitalExpenditure(cleanedText.toString());
  };

  const handleOtherComments = (text: string) => {
    const cleanedText = text.replace(/style="[^"]*color:[^;"]*;?[^"]*"/g, ""); // Remove color styles
    setOtherComments(cleanedText.toString());
  };

  const isEmptyRichText = (text: string) => {
    const emptyHtmlPatterns = [
      "<p><br></p>",
      "<h1><br></h1>",
      "<h2><br></h2>",
      "<h3><br></h3>",
      ""
    ];
    // Trim and check if the text is exactly one of the empty patterns
    return emptyHtmlPatterns.includes(text.trim());
  };

  return (
    <>
      <Drawer
        open={openDraw}
        handleOpen={val => {
          if (!showAlert) {
            !val && resetAll();
            setOpenDraw(val);
          }
        }}
        backgroudPanelStyle="pl-3 sm:pl-0 mt-14 h-auto md:max-w-[900px] xl:max-w-[1100px]"
        headerContentStyle="border-b border-gray-200 flex justify-between items-center py-6 mt-10 sm:mt-0"
        enableZindex={true}
        headerContent={
          <>
            <label className="text-lg  font-bold text-gray-900">
              {type === "add" ? "Create Form" : type === "edit" ? "Edit Form" : ""}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <form
            id="vendorContractForm"
            autoComplete="off"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="">
              <div className="p-4 px-7">
                <div className="my-2">
                  <div className="bg-green-100 border-l-4 border-green-600 rounded-lg shadow-sm p-4">
                    <h2 className="text-lg font-medium leading-4 text-gray-900 mb-4">
                      Approval Requirements
                    </h2>
                    <div className="px-4 text-gray-500/80 font-normal text-sm">
                      <ul style={{ listStyleType: "disc" }}>
                        <li>
                          This form must be completed for all Revenue and Expense
                          contracts and binding agreements.
                        </li>
                        <li>
                          Please complete this form and attach a copy of the contract that
                          is to be approved.
                        </li>
                        <li>
                          The{" "}
                          <a
                            href="https://nrlau.sharepoint.com/:b:/r/sites/hr/Policies/Financial%20Limitation%20of%20Authority%20Policy_FEB%202022.pdf?csf=1&web=1&e=j7Jsvd"
                            className="text-blue-600 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            SST Financial Limits of Authority Policy
                          </a>{" "}
                          can be found on the SST's intranet. The contract signatory must
                          be within approved authority limits.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-green-600 text-lg mt-5 font-semibold col-span-2 mb-2">
                  Requestor Information
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <InputLabel
                    className="text-sm"
                    htmlFor=""
                    formName="requester_name"
                    lblText="Requestor Name"
                    placeholder="Requestor Name"
                    required={true}
                    formConfig={formOptions}
                    disabled={true}
                  />
                  <InputLabel
                    className="text-sm"
                    htmlFor={""}
                    formName="requester_email"
                    errorMessage="please enter a valid email"
                    lblText="Requestor Email"
                    placeholder="Requestor Email"
                    formConfig={formOptions}
                    required={true}
                    disabled={true}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-5">
                  <SelectLabel
                    optionTextStyle="text-sm"
                    buttonTextStyle="text-sm"
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                    containerStyle="h-9"
                    htmlFor=""
                    formName="department"
                    lblText="Department"
                    placeholder="Select Department"
                    placeholderStyle="text-sm text-gray-300"
                    formConfig={formOptions}
                    required={true}
                    size="md"
                    options={departmentDD.sort((a, b) => a.label.localeCompare(b.label))}
                    value={selectedDepartment}
                    isDraftSubmitted={isDraftSubmitted}
                    errorMessage={selectedDepartment ? "" : "Field is required"}
                    onChange={handleDepartmentChange}
                    ref={departmentRef}
                  />
                  {version === "V2" && (
                    <SelectLabel
                      optionTextStyle="text-sm"
                      buttonTextStyle="text-sm"
                      disabled={
                        formData?.data?.status === "draft"
                          ? undefined
                          : formData?.data?.status === "rejected" && !selectedApproval
                            ? undefined
                            : type === "edit"
                      }
                      containerStyle="h-9"
                      htmlFor=""
                      placeholder="Select from list"
                      placeholderStyle="text-sm text-gray-300"
                      formName="approval_being_sought"
                      lblText="Type of Approval being sought"
                      formConfig={formOptions}
                      required={true}
                      size="md"
                      options={approvalOptions.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )} // Sort options alphabetically
                      value={selectedApproval}
                      errorMessage={selectedApproval ? "" : "Field is required"}
                      onChange={val => setSelectedApproval(val)}
                      ref={approvalRef}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-5">
                  {version === "V2" &&
                  selectedDepartment &&
                  selectedApproval?.value !== "Deed of Novation" &&
                  (gmUserList?.message === "GM users are been retrived" ||
                    gmUserList?.message === "No GM users found") ? (
                    <SelectLabel
                      optionTextStyle="text-sm"
                      buttonTextStyle="text-sm"
                      disabled={
                        formData?.data?.status === "draft" ? undefined : type === "edit"
                      }
                      containerStyle="h-9"
                      htmlFor=""
                      formName="generalManager"
                      lblText="First Reviewer:"
                      placeholder="Select First Reviewer"
                      placeholderStyle="text-sm text-gray-300"
                      formConfig={formOptions}
                      required={true}
                      size="md"
                      options={generalManagerOptions.sort((a, b) =>
                        a.label.localeCompare(b.label)
                      )}
                      value={selectedGeneralManager}
                      errorMessage={
                        gmUserList?.message === "No GM users found"
                          ? "No GM users found"
                          : !selectedGeneralManager
                            ? "Field is required"
                            : ""
                      }
                      onChange={handleGeneralManagerChange}
                      ref={generalManagerRef}
                    />
                  ) : (
                    (gmUserList?.message === "The user itself is GM") === undefined
                  )}

                  <SelectLabel
                    optionTextStyle="text-sm"
                    buttonTextStyle="text-sm"
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                    containerStyle="h-9"
                    htmlFor=""
                    formName="nrl_entity"
                    lblText="Our Contracting Entity"
                    placeholder="Select Our Entity"
                    placeholderStyle="text-sm text-gray-300"
                    formConfig={formOptions}
                    required={true}
                    size="md"
                    options={entityOptions.sort((a, b) => a.label.localeCompare(b.label))} // Sort options alphabetically
                    value={selectedEntity}
                    errorMessage={selectedEntity ? "" : "Field is required"}
                    onChange={val => setSelectedEntity(val)}
                    ref={entityRef}
                  />
                </div>

                <hr className="mt-5 text-gray-200 w-[100%]" />
              </div>

              <div className="pb-2 px-7">
                <p className="text-green-600 text-lg font-semibold mb-2 col-span-2 ">
                  Contract Details
                </p>

                <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                  <RichTextBoxLabel
                    htmlFor={"business_case"}
                    formName="business_case"
                    // placeholder="Business Case"
                    formConfig={formOptions}
                    value={businessCase}
                    onChange={handlebusinessCase}
                    lblText={"Business Case"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(businessCase) ? "Field is required" : undefined
                    }
                    ref={businessCaseRef}
                  />

                  <RichTextBoxLabel
                    htmlFor={"descAgreement"}
                    formName="descAgreement"
                    placeholder="What is the agreement for – describe nature of services/products/funding etc in brief, including context & other important details"
                    formConfig={formOptions}
                    value={descAgreement}
                    onChange={handleDescAgreement}
                    lblText={"Description of Agreement"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(descAgreement) ? "Field is required" : undefined
                    }
                    ref={descAgreementRef}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mt-5">
                  <InputLabel
                    className="text-sm"
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                    htmlFor=""
                    formName="term"
                    lblText="Term (Please specify the months / years of the contract, and any renewal term)"
                    placeholder="How long is the contract? Does it have an expiry date?"
                    formConfig={formOptions}
                    required={true}
                  />

                  <InputLabel
                    className="text-sm"
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                    htmlFor=""
                    mainContainerStyle="sm:pt-[22px]"
                    formName="counter_party"
                    lblText="Counter Party"
                    placeholder="Full entity name of the counter party to the agreement"
                    required={true}
                    formConfig={formOptions}
                  />

                  <DateLabel
                    htmlFor=""
                    formName="start_date"
                    lblText="Start Date"
                    formConfig={formOptions}
                    required={true}
                    labelList={["where possible, 1 November"]}
                  />

                  <DateLabel
                    selectedDate={
                      dayjs(startDate).isAfter(dayjs(endDate))
                        ? new Date(startDate)
                        : undefined
                    }
                    htmlFor=""
                    formName="end_date"
                    lblText="End Date"
                    formConfig={formOptions}
                    labelList={["where possible, 31 October"]}
                    required={true}
                    minDate={startDate}
                  />

                  <InputLabel
                    className="border-gray-300 text-sm"
                    htmlFor={""}
                    formName="monetary_value"
                    lblText="Monetary Value (in AUD, excluding Australian GST)"
                    min={0}
                    formConfig={formOptions}
                    required={true}
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                  />

                  <SelectLabel
                    optionTextStyle="text-sm"
                    buttonTextStyle="text-sm"
                    disabled={
                      formData?.data?.status === "draft" ? undefined : type === "edit"
                    }
                    containerStyle="h-9"
                    htmlFor=""
                    formName="currency"
                    lblText="Currency"
                    formConfig={formOptions}
                    required={true}
                    size="md"
                    options={currencyOptions.sort((a, b) => {
                      if (a.label === "Other") return 1;
                      if (b.label === "Other") return -1;
                      return a.label.localeCompare(b.label);
                    })}
                    value={selectedCurrency}
                    errorMessage={selectedCurrency ? "" : "Field is required"}
                    onChange={val => setSelectedCurrency(val)}
                  />

                  {selectedCurrency?.value === "Other" ? (
                    <InputLabel
                      className="text-sm"
                      htmlFor={""}
                      formName="other_currency"
                      lblText="Other Currency"
                      required={true}
                      min={0}
                      formConfig={formOptions}
                    />
                  ) : undefined}

                  {selectedCurrency?.value === "AUD" ? undefined : (
                    <InputLabel
                      className="text-sm"
                      htmlFor={""}
                      formName="monetary_value_currency"
                      lblText="Monetary Value in the contracted currency (if not AUD)"
                      required={true}
                      min={0}
                      formConfig={formOptions}
                    />
                  )}
                </div>
                <div className="mt-5 grid grid-cols-1 gap-y-4 gap-x-6">
                  <RichTextBoxLabel
                    htmlFor={"relevant_financial_budget"}
                    formName="relevant_financial_budget"
                    placeholder=""
                    formConfig={formOptions}
                    value={relevantFinancialBudget}
                    onChange={handleRelevantFinancialBudget}
                    lblText={
                      "Has this been included in the relevant financial year’s budget? If not, why? If yes, which area (PC)?"
                    }
                    required={true}
                    errorMessage={
                      isEmptyRichText(relevantFinancialBudget)
                        ? "Field is required"
                        : undefined
                    }
                    ref={relevantFinancialBudgetRef}
                  />

                  <div className="flex flex-col gap-3">
                    <RadioGroupLabel
                      orientation={window.innerWidth < 540 ? "vertical" : "horizontal"}
                      htmlFor={"SSTApproval"}
                      required={true}
                      formConfig={formOptions}
                      errorMessage={SSTApproval ? "" : "Field is required"}
                      lblText="If the value is A$1million have you attached a board minute showing SST approval?"
                      ref={SSTApprovalRef}
                    >
                      {SSTApprovalDynamicOptions.map(option => (
                        <RadioGroupItem
                          name="radio-group"
                          size="sm"
                          radioContainerStyle="mt-3 w-20"
                          key={option.value}
                          checked={option.value === SSTApproval}
                          value={option.value}
                          disabled={option.disabled}
                          description={option.description}
                          innerCheckedStyle="bg-green-600"
                          outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                          outerRingStyle="hover:border-green-600"
                          onChange={handleSSTApproval}
                        >
                          {option.label}
                          <br />
                          {option.description}
                        </RadioGroupItem>
                      ))}
                    </RadioGroupLabel>
                  </div>
                  {SSTApproval === "No" && (
                    <RichTextBoxLabel
                      htmlFor={"if_no_justify_SST"}
                      formName="if_no_justify_SST"
                      placeholder=""
                      formConfig={formOptions}
                      value={ifNoSST}
                      onChange={handleIfNoSST}
                      lblText={"If no, why?"}
                      required={true}
                      errorMessage={
                        isEmptyRichText(ifNoSST) ? "Field is required" : undefined
                      }
                      ref={ifNoSSTRef}
                    />
                  )}
                </div>
                <hr className="mt-5 text-gray-200 w-[100%]" />

                <div className="mt-5 grid grid-cols-1 gap-y-4 gap-x-6">
                  <RichTextBoxLabel
                    htmlFor={"termination"}
                    formName="termination"
                    placeholder="How can the agreement be ended"
                    formConfig={formOptions}
                    value={termination}
                    onChange={handleTermination}
                    lblText={"Termination"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(termination) ? "Field is required" : undefined
                    }
                    ref={terminationRef}
                  />
                  <RichTextBoxLabel
                    htmlFor={"reputational_risk"}
                    formName="reputational_risk"
                    placeholder="Are there special reputational risks which need to be considered – e.g. Nature of the parties or subject matter?"
                    formConfig={formOptions}
                    value={reputationalRisk}
                    onChange={handleReputationalRisk}
                    lblText={"Reputational Risk"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(reputationalRisk) ? "Field is required" : undefined
                    }
                    ref={reputationalRiskRef}
                  />
                  <RichTextBoxLabel
                    htmlFor={"special_or_unusual"}
                    formName="special_or_unusual"
                    placeholder="e.g. exclusive agreement?"
                    formConfig={formOptions}
                    value={specialOrUnusual}
                    onChange={handleSpecialOrUnusual}
                    lblText={"Special or Unusual Terms"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(specialOrUnusual) ? "Field is required" : undefined
                    }
                    ref={specialOrUnusualRef}
                  />

                  {[
                    "Expenditure Contract",
                    "Expenditure no contract for signing"
                  ].includes(selectedApproval?.value ?? "") && (
                    <div className="mt-5 grid grid-cols-1 gap-y-4">
                      <RichTextBoxLabel
                        htmlFor={"expenditure_approval"}
                        formName="expenditure_approval"
                        placeholder=""
                        formConfig={formOptions}
                        value={expenditureApproval}
                        onChange={handleExpenditureApproval}
                        lblText={
                          "For expenditure approval provide a brief summary of the result of the procurement process"
                        }
                        required={true}
                        errorMessage={
                          isEmptyRichText(expenditureApproval)
                            ? "Field is required"
                            : undefined
                        }
                        ref={expenditureApprovalRef}
                      />
                      <RichTextBoxLabel
                        htmlFor={"expenditure_approval_explain"}
                        formName="expenditure_approval_explain"
                        placeholder=""
                        formConfig={formOptions}
                        value={expenditureApprovalExplain}
                        onChange={handleExpenditureApprovalExplain}
                        lblText={
                          "For expenditure approval explain how SST's Indigenous supplier framework was managed"
                        }
                        required={true}
                        errorMessage={
                          isEmptyRichText(expenditureApprovalExplain)
                            ? "Field is required"
                            : undefined
                        }
                        ref={expenditureApprovalExplainRef}
                      />
                      <div className="flex flex-col gap-3">
                        <RadioGroupLabel
                          orientation="horizontal"
                          htmlFor="expenditure_contract"
                          formName="expenditure_contract"
                          required={true}
                          formConfig={formOptions}
                          errorMessage={expenditureContract ? "" : "Field is required"}
                          lblText="If this expenditure contract is between $20-50k are at least 2 quotes attached, or 3 quotes for >$50k in the Additional Attachments section below?"
                          ref={expenditureContractRef}
                        >
                          {expenditureContractDynamicOptions.map(option => (
                            <RadioGroupItem
                              name="radio-group"
                              size="sm"
                              radioContainerStyle="mt-3 w-20"
                              key={option.value}
                              checked={option.value === expenditureContract}
                              value={option.value}
                              disabled={option.disabled}
                              description={option.description}
                              innerCheckedStyle="bg-green-600"
                              outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                              outerRingStyle="hover:border-green-600"
                              onChange={handleExpenditureContract}
                              className=""
                            >
                              {option.label}
                              <br />
                              {option.description}
                            </RadioGroupItem>
                          ))}
                        </RadioGroupLabel>
                      </div>
                      {expenditureContract === "No" && (
                        <RichTextBoxLabel
                          htmlFor={"if_no_justify_exp_contract"}
                          formName="if_no_justify_exp_contract"
                          placeholder=""
                          formConfig={formOptions}
                          value={ifNoExpContract}
                          onChange={handleIfNoExpContract}
                          lblText={"If no, why?"}
                          required={true}
                          errorMessage={
                            isEmptyRichText(ifNoExpContract)
                              ? "Field is required"
                              : undefined
                          }
                          ref={ifNoExpContractRef}
                        />
                      )}
                    </div>
                  )}
                </div>
                <hr className="mt-5 text-gray-200 w-[100%]" />
              </div>

              <div className="p-4 px-7 flex flex-col gap-4">
                <p className="text-green-600 text-lg font-semibold col-span-2">
                  Check List
                </p>
                <div className="flex flex-col gap-3">
                  <RadioGroupLabel
                    orientation="horizontal"
                    htmlFor="arms_length_transact"
                    formName="arms_length_transact"
                    required={true}
                    formConfig={formOptions}
                    errorMessage={armsLengthTransact ? "" : "Field is required"}
                    lblText={
                      "Arm's Length Transactions: Are you aware of any conflict with a related party (including with a SST/SST affiliate or subsidiary, or with a known associate of a SST/SST employee or contractor) / is there a conflict or potential conflict of interest?"
                    }
                    ref={armsLengthTransactRef}
                  >
                    {armsLengthDynamicOptions.map(option => (
                      <RadioGroupItem
                        name="radio-group"
                        size="sm"
                        radioContainerStyle="mt-3 w-20"
                        key={option.value}
                        checked={option.value === armsLengthTransact}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                        onChange={handleArmsLengthTransact}
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
                </div>
                {armsLengthTransact === "Yes" && (
                  <RichTextBoxLabel
                    htmlFor={"if_yes_arms_length_transact"}
                    formName="if_yes_arms_length_transact"
                    placeholder=""
                    formConfig={formOptions}
                    value={ifYesArmsLengthTransact}
                    onChange={handleIfYesArmsLengthTransact}
                    lblText={"If yes, then please provide details?"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(ifYesArmsLengthTransact)
                        ? "Field is required"
                        : undefined
                    }
                    ref={ifYesArmsLengthTransactRef}
                  />
                )}
                <div className="flex flex-col gap-3">
                  <RadioGroupLabel
                    orientation="horizontal"
                    htmlFor="contract_counterparty"
                    formName="contract_counterparty"
                    required={true}
                    formConfig={formOptions}
                    errorMessage={contractCounterParty ? "" : "Field is required"}
                    lblText={
                      "Has a credit check been undertaken on the contract counterparty (new counterparties only)"
                    }
                    ref={contractCounterPartyRef}
                  >
                    {contractCountertDynamicOptions.map(option => (
                      <RadioGroupItem
                        name="radio-group"
                        size="sm"
                        radioContainerStyle="mt-3 w-20"
                        key={option.value}
                        checked={option.value === contractCounterParty}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                        onChange={handleContractCounterParty}
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
                </div>
                {contractCounterParty === "No" && (
                  <RichTextBoxLabel
                    htmlFor={"if_no_contract_counterparty"}
                    formName="if_no_contract_counterparty"
                    placeholder=""
                    formConfig={formOptions}
                    value={ifNoContractCounterParty}
                    onChange={handleIfNoContractCounterParty}
                    lblText={"If no, why?"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(ifNoContractCounterParty)
                        ? "Field is required"
                        : undefined
                    }
                    ref={ifNoContractCounterPartyRef}
                  />
                )}
                <div className="flex flex-col gap-3">
                  <RadioGroupLabel
                    orientation="horizontal"
                    htmlFor="include_contract_form"
                    formName="include_contract_form"
                    required={true}
                    formConfig={formOptions}
                    errorMessage={modernSlavery ? "" : "Field is required"}
                    lblText={
                      "Have you uploaded in the Additional Attachments section below the Modern Slavery Questionnaire as completed by the external parties to this agreement? A copy of the questionnaire is available"
                    }
                    lblLink={
                      <a
                        href="https://nrlau.sharepoint.com/:b:/t/finance/EQPeFPLCJqZMngfIsTgosmYBaIXhiINQzlUg5PWETbfuTg?e=9V3GbE"
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                    }
                    ref={modernSlaveryRef}
                  >
                    {modernSlaveryDynamicOptions.map(option => (
                      <RadioGroupItem
                        name="radio-group"
                        size="sm"
                        radioContainerStyle="mt-3 w-20"
                        key={option.value}
                        checked={option.value === modernSlavery}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                        onChange={handleModernSlavery}
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
                </div>
                {modernSlavery === "No" && (
                  <RichTextBoxLabel
                    htmlFor={"if_no_justify_modern_slavery"}
                    formName="if_no_justify_modern_slavery"
                    placeholder=""
                    formConfig={formOptions}
                    value={ifNoModernSlavery}
                    onChange={handleIfNoModernSlavery}
                    lblText={"If no, why?"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(ifNoModernSlavery) ? "Field is required" : undefined
                    }
                    ref={ifNoModernSlaveryRef}
                  />
                )}

                <div className="flex flex-col gap-3">
                  <RadioGroupLabel
                    orientation="horizontal"
                    htmlFor="provide_supplier_code"
                    formName="provide_supplier_code"
                    required={true}
                    formConfig={formOptions}
                    errorMessage={supplierCodeConduct ? "" : "Field is required"}
                    lblText={
                      "Have you provided to the Counter Party / Parties listed above the Supplier Code of Conduct Policy? Available"
                    }
                    lblLink={
                      <a
                        href="https://nrlau.sharepoint.com/:b:/t/finance/EcNVIETithNKjn4tb9oz94YBR_rl3IUCKZNVb8xHOS6QGg?e=9Fn1I9"
                        className="text-blue-500 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        here
                      </a>
                    }
                    ref={supplierCodeConductRef}
                  >
                    {supplierCodeConductDynamicOptions.map(option => (
                      <RadioGroupItem
                        name="radio-group"
                        size="sm"
                        radioContainerStyle="mt-3 w-20"
                        key={option.value}
                        checked={option.value === supplierCodeConduct}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                        onChange={handleSupplierCodeConduct}
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
                </div>
                {supplierCodeConduct === "No" && (
                  <RichTextBoxLabel
                    htmlFor={"if_no_justify_supplier_code_conduct"}
                    formName="if_no_justify_supplier_code_conduct"
                    placeholder=""
                    formConfig={formOptions}
                    value={ifNoSupplierCodeConduct}
                    onChange={handleIfNoSupplierCodeConduct}
                    lblText={"If no, why?"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(ifNoSupplierCodeConduct)
                        ? "Field is required"
                        : undefined
                    }
                    ref={ifNoSupplierCodeConductRef}
                  />
                )}
                <div className="flex flex-col gap-3">
                  <RadioGroupLabel
                    orientation="horizontal"
                    htmlFor="is_capital_expenditure"
                    formName="is_capital_expenditure"
                    required={true}
                    formConfig={formOptions}
                    errorMessage={isCapitalExpenditure ? "" : "Field is required"}
                    lblText={
                      "Is the contract a CapEx item (Capital Expenditure is proposed spend that is placed on the SST’s balance sheet and the cost is amortised (allocated) over 2 or more years)? If yes a financial analysis is required to support the asset value – attach separately (contact Finance for template proposal document)"
                    }
                    ref={isCapitalExpenditureRef}
                  >
                    {isCapitalExpDynamicOptions.map(option => (
                      <RadioGroupItem
                        name="radio-group"
                        size="sm"
                        radioContainerStyle="mt-3 w-20"
                        key={option.value}
                        checked={option.value === isCapitalExpenditure}
                        value={option.value}
                        disabled={option.disabled}
                        description={option.description}
                        onChange={handleIsCapitalExpenditure}
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
                </div>
                {isCapitalExpenditure === "Yes" && (
                  <RichTextBoxLabel
                    htmlFor={"if_yes_is_capital_expenditure"}
                    formName="if_yes_is_capital_expenditure"
                    placeholder=""
                    formConfig={formOptions}
                    value={ifYesCapitalExpenditure}
                    onChange={handleIfYesCapitalExpenditure}
                    lblText={"If yes, then please summarise the details?"}
                    required={true}
                    errorMessage={
                      isEmptyRichText(ifYesCapitalExpenditure)
                        ? "Field is required"
                        : undefined
                    }
                    ref={ifYesCapitalExpenditureRef}
                  />
                )}
                {version === "V2" && (
                  <div className="flex flex-col gap-3">
                    <RadioGroupLabel
                      orientation="horizontal"
                      htmlFor="contract_tech_review"
                      formName="contract_tech_review"
                      required={true}
                      formConfig={formOptions}
                      errorMessage={
                        contractTechReview ||
                        selectedApproval?.value === "Deed of Novation"
                          ? ""
                          : "Field is required"
                      }
                      lblText={
                        "Is this contract related to a technology or software vendor (This includes infrastructure, platform or software)?"
                      }
                      ref={contractTechReviewRef}
                    >
                      {contractTechReviewDynamicOptions.map(option => (
                        <RadioGroupItem
                          name="radio-group"
                          size="sm"
                          radioContainerStyle="mt-3 w-20"
                          key={option.value}
                          checked={
                            selectedApproval?.value === "Deed of Novation"
                              ? option.value === "No"
                              : option.value === contractTechReview
                          }
                          value={option.value}
                          disabled={
                            formData?.data?.status === "rejected" ||
                            (formData?.data?.status === "pending" &&
                              contractTechReviewRadioBtn !== "") ||
                            selectedApproval?.value === "Deed of Novation"
                              ? true
                              : option.disabled
                          }
                          description={option.description}
                          onChange={handleContractTechReview}
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
                  </div>
                )}

                <RichTextBoxLabel
                  htmlFor={"deliver_contract"}
                  formName="deliver_contract"
                  placeholder=""
                  formConfig={formOptions}
                  value={deliverContract}
                  onChange={handleDeliverContract}
                  lblText={
                    "What resources are being used to deliver the contract? (Internal or external)"
                  }
                  required={true}
                  errorMessage={
                    isEmptyRichText(deliverContract) ? "Field is required" : undefined
                  }
                  ref={deliverContractRef}
                />
                <RichTextBoxLabel
                  htmlFor={"type_of_engagement"}
                  formName="type_of_engagement"
                  placeholder=""
                  formConfig={formOptions}
                  value={typeOfEngagement}
                  onChange={handleTypeOfEngagement}
                  lblText={
                    "If external, what type of engagement? (Third Party contractor, Subcontractor)"
                  }
                  required={true}
                  errorMessage={
                    isEmptyRichText(typeOfEngagement) ? "Field is required" : undefined
                  }
                  ref={typeOfEngagementRef}
                />

                <RichTextBoxLabel
                  htmlFor={"internal_resources"}
                  formName="internal_resources"
                  placeholder=""
                  formConfig={formOptions}
                  value={internalResources}
                  onChange={handleInternalResources}
                  lblText={
                    "What internal resources are required to support the contract or are saved as a result of engaging the supplier?"
                  }
                  required={true}
                  errorMessage={
                    isEmptyRichText(internalResources) ? "Field is required" : undefined
                  }
                  ref={internalResourcesRef}
                />
                <div className="grid grid-cols-1 gap-y-4">
                  <RichTextBoxLabel
                    htmlFor={"other_comments"}
                    formName="other_comments"
                    placeholder=""
                    formConfig={formOptions}
                    value={otherComments}
                    onChange={handleOtherComments}
                    lblText={"Other Comments"}
                  />
                </div>
                <hr className="mt-2 text-gray-200 w-[100%]" />
                <div className="flex flex-col gap-2">
                  <p className="text-green-600 text-lg font-semibold col-span-2">
                    Documents
                  </p>
                  {type === "add" ||
                  (type === "edit") === (formData?.data?.status === "draft") ? (
                    <FileUpload
                      title="Upload Actual Contract"
                      name="Upload Actual Contract"
                      type="file"
                      allowMultiple={false}
                      acceptedFileTypes={[
                        "application/pdf",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      ]}
                      apiDetails="document-handler/generate-signedurl"
                      onUploadSuccess={handleMsaContractAttachment}
                      onError={() => {}}
                      mandatory={
                        selectedApproval?.value === "Expenditure no contract for signing"
                          ? false
                          : true
                      }
                      s3Urls={(formData?.data?.msaAttachments as string[]) || []}
                    />
                  ) : undefined}

                  <FileUpload
                    title="Additional Attachments"
                    name="Additional Attachments"
                    type="arrayFile"
                    allowMultiple={true}
                    acceptedFileTypes={[
                      "application/pdf",
                      "application/msword",
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    ]}
                    apiDetails="document-handler/generate-signedurl"
                    onUploadSuccess={handleAdditionalAttachments}
                    onError={() => {}}
                    mandatory={false}
                    s3Urls={(formData?.data?.attachments as string[]) || []}
                    formDataStatus={formData?.data?.status}
                  />
                </div>
                <hr className="mt-2 text-gray-200 w-[100%]" />
              </div>
            </div>
          </form>
        }
        footerContentStyle="flex justify-between items-center"
        footerContent={
          <div className=" py-2 w-full flex flex-row justify-between">
            <div>
              <Button
                //variant="outline"
                className="border-2 border-green-600 text-green-600 font-medium hover:bg-green-600 hover:text-white"
                label="Cancel"
                type="button"
                size="sm"
                onClick={() => {
                  setOpenDraw(false);
                  resetAll();
                }}
              />
              {(type === "edit") === (formData?.data?.status === "draft") ? (
                <Button
                  className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 ml-5"
                  //variant="primary"
                  label={isLoadingDraft ? "Processing..." : "Save as Draft"}
                  type="button"
                  size="sm"
                  onClick={() => handleDraftClick(getValues())}
                  disabled={isLoadingDraft} // Disable button while loading
                >
                  {isLoadingDraft && <ArrowPathIcon className="w-4 h-4 animate-spin" />}
                </Button>
              ) : undefined}
            </div>
            <Button
              disabled={isLoading}
              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
              //variant="primary"
              label={isLoading ? "Processing..." : "Submit"}
              type="submit"
              size="sm"
              form="vendorContractForm"
            />
          </div>
        }
      />
      {
        <AlertLayout
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showAlert}
          setOpen={setShowAlert}
          {...alertInfo}
          btnActionCallBack={alertCb}
        />
      }

      {
        <AlertLayout
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showErrorAlert}
          setOpen={setShowErrorAlert}
          {...alertInfo}
          btnActionCallBack={alertCb}
          additionalUiContents={
            <div className="py-5 text-slate-500 text-md">
              Required fields are missing - please complete them.
            </div>
          }
        />
      }

      {
        <AlertLayout
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showDraftAlert}
          setOpen={setShowDraftAlert}
          {...alertInfo}
          btnActionCallBack={alertDCb}
        />
      }
    </>
  );
};

export const btnActions: ButtonProps[] = [
  {
    id: "okay",
    variant: "primary",
    size: "sm",
    label: "Okay",
    buttonStyle: "w-full"
  }
];
