import { Button, Drawer, Alert, RadioGroupItem } from "@ui-components";
import { InputLabel } from "../../layouts/InputLabel/InputLabel";
import { useForm } from "react-hook-form";
import { HeadCountFormProps, NewFormProps } from "../../constants/formConstants";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import {
  useCreateHeadcount,
  useGetAllDepartmentsByModuleId,
  useUpdateHeadCount
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { useEffect, useRef, useState } from "react";
import { SelectLabel } from "../../layouts/SelectLabel/SelectLabel";
import { AnyProp } from "../../common/types";
import { SelectValueProps } from "@ui-components/Select/types";
import { TextAreaLabel } from "../../layouts/TextAreaLabel/TextAreaLabel";
import { FileUpload } from "../../components/FileUpload";
import dayjs from "dayjs";
import { DateLabel } from "../../layouts/DateLabel/DateLabel";

import { GetHeadcountFormDetailResponseDto } from "../../api/backend/backendSchemas";
import { AlertProps } from "@ui-components/Alert/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { useNavigate } from "@tanstack/react-router";
import { RadioGroupLabel } from "../../layouts/RadioGroupLabel/RadioGroupLabel";

export type HeadCountNewFormProps = {
  formId?: string;
  type: "add" | "edit" | "none";
  openDraw: boolean;
  setOpenDraw: (val: boolean) => void;
  formData?: GetHeadcountFormDetailResponseDto;
  parentCB?: (actionId: string) => void;
};

const initSwitchOptions = {
  is_behalf_hiring_manager: false,
  is_role_in_budget: false,
  has_position_benchmarked: false
};

export const HeadCountAddEditForm = ({
  formId = "",
  type,
  formData,
  openDraw,
  setOpenDraw,
  parentCB
}: HeadCountNewFormProps) => {
  const formOptions = useForm<NewFormProps>();
  const { accessToken, emailId, name } = useAuthStore();
  const { moduleStore } = useSelectedModuleStore();
  const [departmentDD, setDepartmentDD] = useState<SelectValueProps[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<SelectValueProps>();
  const [, setSelectedEntity] = useState<SelectValueProps>();
  const [switchOptions, setSwitchOptions] = useState(initSwitchOptions);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();

  const [selectFormCode, setSelectFormCode] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);
  const { handleSubmit, reset, setValue } = formOptions;
  const [isLoading, setIsLoading] = useState(false);

  const s3UrlRef = useRef<string[]>([]);
  const navigate = useNavigate({
    from: "/headcount/forms"
  });

  const [roleType, setRoleType] = useState<string>("");
  const [roleTime, setRoleTime] = useState("");
  const [newRole, setNewRole] = useState("");

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
      const { department = "", departmentName = "" } = formData?.data ?? {};
      const formInfo = formData?.data?.formInfo as HeadCountFormProps;

      setSelectedDepartment({ label: departmentName, value: department });
      if (formInfo) {
        const keyValuePair = Object.entries(formInfo);

        for (const formKeyValue of keyValuePair) {
          if (typeof formKeyValue[1] === "string") {
            if (formKeyValue[0] === "nrl_entity") {
              setSelectedEntity({ label: formKeyValue[1], value: formKeyValue[1] });
            }
            setValue(formKeyValue[0], formKeyValue[1]);
          } else if (typeof formKeyValue[1] === "number") {
            setValue(formKeyValue[0], formKeyValue[1].toString());
          }
        }

        setSwitchOptions({
          is_behalf_hiring_manager:
            formInfo.is_behalf_hiring_manager === "Yes" ? true : false,
          is_role_in_budget: formInfo.is_role_in_budget === "Yes" ? true : false,
          has_position_benchmarked:
            formInfo.has_position_benchmarked === "Yes" ? true : false
        });

        if (formInfo) {
          setRoleType(formInfo.is_maxterm_or_permanent || ""); // Store API value
          setRoleTime(formInfo.is_fulltime_or_parttime || "");
          setNewRole(formInfo.is_new_role_or_replacement || "");
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
  }, [departmentFullList]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (openDraw) {
      const formCodeReference =
        dayjs().format("YYYYMMDDhhmmss") + Math.round(Math.random() * 100000).toString();
      const formCode = `SST-${formCodeReference}`;
      setSelectFormCode(formCode);

      setValue("requester_name", name || "");
      setValue("requester_email", emailId || "");
    }
  }, [openDraw]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const formInfo = formData?.data?.formInfo as HeadCountFormProps;
    setValue(
      "role_reporting",
      (switchOptions.is_behalf_hiring_manager === false
        ? name
        : type === "add"
          ? ""
          : formInfo.role_reporting) || ""
    );
    setValue(
      "role_reporting_email",
      (switchOptions.is_behalf_hiring_manager === false
        ? emailId
        : type === "add"
          ? ""
          : formInfo.role_reporting_email) || ""
    );
  }, [openDraw, switchOptions]);

  const handleAdditionalAttachments = (response: AnyProp) => {
    s3UrlRef.current = response;
  };

  const onFormSubmit = (formState: NewFormProps) => {
    setIsLoading(true);
    const navBase = moduleStore.code;
    const formPostData = {
      formId,
      moduleId: moduleStore._id,
      code: selectFormCode,
      department: selectedDepartment?.value || "",
      departmentName: selectedDepartment?.label || "",
      formInfo: {
        requester_name: name,
        requester_email: emailId,
        ...formState,
        is_behalf_hiring_manager: switchValidate(switchOptions.is_behalf_hiring_manager),
        is_role_in_budget: switchValidate(switchOptions.is_role_in_budget),
        has_position_benchmarked: switchValidate(switchOptions.has_position_benchmarked),
        is_new_role_or_replacement: newRole,
        is_maxterm_or_permanent: roleType,
        is_fulltime_or_parttime: roleTime
      },
      attachments: s3UrlRef.current,
      executiveApprove: false,
      status: "pending",
      active: true,
      createdBy: emailId,
      formHistory: [],
      mailRedirectPath: `/${navBase}/requests/detail/formDetailId?page=approveRequest&moduleId=${moduleStore?._id}`
    };

    console.log("post data ---- ", JSON.stringify(formPostData));

    if (type === "add") {
      formMutate({
        body: { ...formPostData } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    } else if (type === "edit") {
      formMutateUpdate({
        body: { ...formPostData } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: formMutate } = useCreateHeadcount({
    onSuccess: response => {
      Alert;
      console.log("success", response.message);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      resetAll();
      setAlertInfo({ ...alertInfo, type: "success" });
      setShowAlert(true);
      setIsLoading(false);
      setOpenDraw(false);
      navigate({
        to: "/headcount/forms"
      });
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

  const { mutate: formMutateUpdate } = useUpdateHeadCount({
    onSuccess: response => {
      Alert;
      console.log("success", response);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      resetAll();
      setAlertInfo({ ...alertInfo, type: "success" });
      setIsLoading(false);
      setOpenDraw(false);
      setShowAlert(true);
      window.location.reload();
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

  const switchValidate = (val: boolean) => {
    return val ? "Yes" : "No";
  };

  const resetAll = () => {
    console.log("Inside Reset all");
    setSelectedDepartment(undefined);
    setSelectedEntity(undefined);
    s3UrlRef.current = [];
    setSwitchOptions({ ...initSwitchOptions });
    setRoleType("");
    setRoleTime("");
    setNewRole("");
    reset();
  };

  const handleRoleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleType(value);
  };

  const handleRoleTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleTime(value);
  };

  const handleNewRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewRole(value);
  };

  const newRoleDynamicOptions = [
    {
      value: "New Role",
      label: "New Role",
      disabled: false,
      description: ""
    },
    {
      value: "Replacement",
      label: "Replacement",
      disabled: false,
      description: ""
    },
    {
      value: "Repurpose",
      label: "Repurpose",
      disabled: false,
      description: ""
    }
  ];

  const roleTypeDynamicOptions = [
    {
      value: "Permanent",
      label: "Permanent",
      disabled: false,
      description: ""
    },
    {
      value: "Max Term",
      label: "Max Term",
      disabled: false,
      description: ""
    }
  ];

  const roleTimeDynamicOptions = [
    {
      value: "Full Time",
      label: "Full Time",
      disabled: false,
      description: ""
    },
    {
      value: "Part Time",
      label: "Part Time",
      disabled: false,
      description: ""
    }
  ];

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
        backgroudPanelStyle="pl-3 sm:pl-0 mt-14"
        headerContentStyle="border-b border-gray-200 flex justify-between items-center py-6"
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
            id="headcountContractForm"
            autoComplete="off"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <div className="">
              <div className="p-4 sm:p-6">
                <p className="text-green-600 text-lg font-semibold col-span-2 mb-2 sm:mb-4">
                  Role Details
                  {/* Requestor and Organizational Information */}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
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
                <div className="grid gap-y-4 gap-x-6 mt-4">
                  <SwitchLabel
                    formName="is_behalf_hiring_manager"
                    labelProps={{
                      lblColor: "slate",
                      lblSize: "sm",
                      //fontWeight: "light",
                      className: "w-full sm:w-[550px]"
                    }}
                    required={true}
                    lblText="Are you requesting on behalf of a Hiring Manager?"
                    active={switchOptions.is_behalf_hiring_manager}
                    switchLabel={switchOptions.is_behalf_hiring_manager ? "Yes" : "No"}
                    onChange={(_, active) => {
                      setSwitchOptions(prev => ({
                        ...prev,
                        is_behalf_hiring_manager: active
                      }));
                    }}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-3">
                  <InputLabel
                    className="text-sm"
                    htmlFor={""}
                    formName="role_reporting"
                    errorMessage="please enter a valid email"
                    lblText="Reporting to Name"
                    placeholder="Who is this role reporting to?"
                    formConfig={formOptions}
                    required={true}
                    disabled={
                      switchOptions.is_behalf_hiring_manager === false ? true : false
                    }
                  />
                  <InputLabel
                    className="text-sm"
                    htmlFor=""
                    formName="role_reporting_email"
                    lblText="Reporting to Email"
                    placeholder="Reporting to Email"
                    required={true}
                    formConfig={formOptions}
                    disabled={
                      switchOptions.is_behalf_hiring_manager === false ? true : false
                    }
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-5">
                  <InputLabel
                    className="text-sm"
                    htmlFor=""
                    formName="role_name"
                    lblText="Role Name"
                    placeholder="Role Name"
                    required={true}
                    formConfig={formOptions}
                    disabled={type === "edit"}
                  />
                  <SelectLabel
                    optionTextStyle="text-sm"
                    buttonTextStyle="text-sm"
                    disabled={type === "edit"}
                    containerStyle="h-9"
                    htmlFor=""
                    formName="department"
                    lblText="Department"
                    placeholder="Department"
                    placeholderStyle="text-sm"
                    formConfig={formOptions}
                    required={true}
                    size="md"
                    options={departmentDD.sort((a, b) => a.label.localeCompare(b.label))}
                    value={selectedDepartment}
                    errorMessage={selectedDepartment ? "" : "field required"}
                    onChange={val => setSelectedDepartment(val)}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-5">
                  <DateLabel
                    htmlFor=""
                    formName="created_date"
                    lblText="Date Created"
                    formConfig={formOptions}
                    required={true}
                    labelList={["where possible, 1 November"]}
                  />
                  <InputLabel
                    className="text-sm"
                    htmlFor=""
                    formName="headcount"
                    lblText="How many headcount are you requesting for this role"
                    placeholder="How many headcount are you requesting for this role"
                    type={"number"}
                    required={true}
                    formConfig={formOptions}
                    disabled={false}
                  />
                </div>
              </div>

              <div className="px-6">
                <div className="grid gap-y-4 gap-x-6 mt-4">
                  <SwitchLabel
                    formName="is_role_in_budget"
                    labelProps={{
                      lblColor: "slate",
                      lblSize: "sm",
                      //fontWeight: "light",
                      className: "w-full sm:w-[550px]"
                    }}
                    required={true}
                    lblText="Is the role in budget?"
                    active={switchOptions.is_role_in_budget}
                    switchLabel={switchOptions.is_role_in_budget ? "Yes" : "No"}
                    onChange={(_, active) => {
                      setSwitchOptions(prev => ({
                        ...prev,
                        is_role_in_budget: active
                      }));
                    }}
                  />
                </div>

                <div className="grid gap-y-4 gap-x-6 mt-4">
                  <div className="flex flex-col gap-3">
                    <RadioGroupLabel
                      orientation={window.innerWidth < 540 ? "vertical" : "horizontal"}
                      htmlFor={"newRole"}
                      required={true}
                      formConfig={formOptions}
                      errorMessage={newRole ? "" : "field required"}
                      lblText="Is it a newly designed role or a direct (like for like) replacement?"
                    >
                      {newRoleDynamicOptions.map(option => (
                        <RadioGroupItem
                          name="radio-group"
                          size="sm"
                          radioContainerStyle="mt-2 w-40"
                          key={option.value}
                          checked={option.value === newRole}
                          value={option.value}
                          disabled={option.disabled}
                          description={option.description}
                          innerCheckedStyle="bg-green-600"
                          outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                          outerRingStyle="hover:border-green-600"
                          onChange={handleNewRole}
                        >
                          {option.label}
                          <br />
                          {option.description}
                        </RadioGroupItem>
                      ))}
                    </RadioGroupLabel>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 mt-5">
                  <div className="flex flex-col gap-3">
                    <RadioGroupLabel
                      orientation="horizontal"
                      htmlFor={"roleType"}
                      lblText="Is the role max term or permanent?"
                      required={true}
                      formConfig={formOptions}
                      errorMessage={roleType ? "" : "field required"}
                    >
                      {roleTypeDynamicOptions.map(option => (
                        <RadioGroupItem
                          name="radio-group"
                          size="sm"
                          radioContainerStyle="mt-3 w-40"
                          key={option.value}
                          checked={option.value === roleType}
                          value={option.value}
                          disabled={option.disabled}
                          description={option.description}
                          innerCheckedStyle="bg-green-600"
                          outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                          outerRingStyle="hover:border-green-600"
                          onChange={handleRoleType}
                        >
                          {option.label}
                          <br />
                          {option.description}
                        </RadioGroupItem>
                      ))}
                    </RadioGroupLabel>
                  </div>
                  {roleType === "Max Term" && (
                    <InputLabel
                      htmlFor="term"
                      formName="max_term_length"
                      lblText="Max term length"
                      placeholder="Term"
                      formConfig={formOptions}
                      required={true}
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 mt-5">
                  <div className="flex flex-col gap-3">
                    <RadioGroupLabel
                      orientation="horizontal"
                      htmlFor={"roleTime"}
                      required={true}
                      formConfig={formOptions}
                      errorMessage={roleTime ? "" : "field required"}
                      lblText="Is the role Fulltime or Part time?"
                    >
                      {roleTimeDynamicOptions.map(option => (
                        <RadioGroupItem
                          name="radio-group"
                          size="sm"
                          radioContainerStyle="mt-3 w-40"
                          key={option.value}
                          checked={option.value === roleTime}
                          value={option.value}
                          disabled={option.disabled}
                          description={option.description}
                          innerCheckedStyle="bg-green-600"
                          outerCheckedStyle="border-green-600 peer-focus:ring-4 peer-focus:ring-green-100"
                          outerRingStyle="hover:border-green-600"
                          onChange={handleRoleTime}
                        >
                          {option.label}
                          <br />
                          {option.description}
                        </RadioGroupItem>
                      ))}
                    </RadioGroupLabel>
                  </div>
                  {roleTime === "Part Time" && (
                    <InputLabel
                      //disabled={type === "edit"}
                      htmlFor=""
                      formName="hrs_per_week"
                      lblText="Hours per week"
                      placeholder=""
                      formConfig={formOptions}
                      required={true}
                    />
                  )}
                </div>
              </div>

              <div className="p-4 px-6">
                <p className="text-green-600 text-lg font-semibold col-span-2 mb-2">
                  Purpose and Analysis
                </p>
                <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                  <TextAreaLabel
                    htmlFor=""
                    formName="purpose"
                    lblText="Purpose"
                    placeholder="Insert the problem or opportunity that requires new headcount. This could be a gap in skills, capacity, or quality that affects business performance or outcomes of a project and/or department."
                    required={true}
                    formConfig={formOptions}
                    style={{ minHeight: "80px" }}
                  />
                  <TextAreaLabel
                    htmlFor=""
                    formName="analysis"
                    lblText="Analysis"
                    placeholder="Analysis of the alternatives and benefits of adding new headcount – it may include comparing the costs, risks, and benefits of hiring internally, externally, or outsourcing the work. It could also involve assessing the potential return on investment, productivity gains, or customer satisfaction improvements that new headcount could bring; Why a new headcount is required and why it cannot be absorbed through current resourcing; and Any impact on existing headcount and/or team structures"
                    required={true}
                    formConfig={formOptions}
                    style={{ minHeight: "130px" }}
                  />
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
                  />
                </div>
              </div>

              <div className="p-4 px-6">
                <p className="text-green-600 text-lg font-semibold col-span-2 mb-2">
                  Budget
                </p>
                <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                  <InputLabel
                    className="text-sm"
                    htmlFor=""
                    formName="base_salary"
                    lblText="Recommended Base Salary"
                    placeholder="Insert base salary"
                    formConfig={formOptions}
                    required={true}
                  />
                  <TextAreaLabel
                    htmlFor=""
                    formName="review_current_team"
                    lblText="Has a review of the current team structure and responsibilities been completed to understand if any other changes are required of if this role can be absorbed by the team?"
                    placeholder="Please include details"
                    required={true}
                    formConfig={formOptions}
                    style={{ minHeight: "80px" }}
                  />
                  <TextAreaLabel
                    htmlFor=""
                    formName="additional_benefits"
                    lblText="Any additional benefit and/or expenses associated with hiring?"
                    placeholder="Include details"
                    required={true}
                    formConfig={formOptions}
                    style={{ minHeight: "80px" }}
                  />
                  <SwitchLabel
                    formName="has_position_benchmarked"
                    labelProps={{
                      lblColor: "slate",
                      lblSize: "sm",
                      //fontWeight: "light",
                      className: "w-[550px]"
                    }}
                    required={true}
                    lblText="Has the position been benchmarked by P&C?"
                    active={switchOptions.has_position_benchmarked}
                    switchLabel={switchOptions.has_position_benchmarked ? "Yes" : "No"}
                    onChange={(_, active) => {
                      setSwitchOptions(prev => ({
                        ...prev,
                        has_position_benchmarked: active
                      }));
                    }}
                  />
                  {switchOptions.has_position_benchmarked ? (
                    <InputLabel
                      className="text-sm"
                      htmlFor=""
                      formName="aon_role_code"
                      lblText="AON Role Code"
                      placeholder="Role Code"
                      required={true}
                      formConfig={formOptions}
                    />
                  ) : (
                    <TextAreaLabel
                      htmlFor=""
                      formName="explanation_details"
                      lblText="Explanation Details"
                      placeholder="If position has not been benchmarked by P&C"
                      required={true}
                      formConfig={formOptions}
                      style={{ minHeight: "80px" }}
                    />
                  )}
                </div>
              </div>

              <div className="p-4 px-6">
                <p className="text-green-600 text-lg font-semibold col-span-2 mb-2">
                  Drivers
                </p>
                <div className="grid grid-cols-1 gap-y-4 gap-x-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <InputLabel
                      className="text-sm"
                      htmlFor=""
                      formName="bus_driver"
                      lblText="Buisness Driver"
                      placeholder="Outline how this role is linked to the SST's strategy."
                      formConfig={formOptions}
                      required={true}
                    />
                    <InputLabel
                      className="text-sm"
                      htmlFor=""
                      formName="impact_dont_hire"
                      lblText="Impact if we don’t hire"
                      placeholder="Insert details on the impact of not hiring the position"
                      formConfig={formOptions}
                      required={true}
                    />
                  </div>
                  <TextAreaLabel
                    htmlFor=""
                    formName="top_five_kpi"
                    lblText="Top 5 KPI's this role will deliver:"
                    placeholder="Insert top 5 KPIs this role will be responsible for. They must be clear, specific and linked to an relevant business outcome and time-bound.[Insert KPI 1] [Insert KPI 2] [insert KPI 3] [insert KPI 4] [insert KPI 5]"
                    required={true}
                    formConfig={formOptions}
                    style={{ minHeight: "80px" }}
                  />
                </div>
              </div>
            </div>
          </form>
        }
        footerContentStyle="flex justify-between items-center"
        footerContent={
          <div className=" py-2 w-full flex flex-row justify-between">
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
            <Button
              disabled={isLoading}
              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
              //variant="primary"
              label="Submit"
              type="submit"
              size="sm"
              form="headcountContractForm"
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
          btnActionCallBack={parentCB}
        />
      }
    </>
  );
};
