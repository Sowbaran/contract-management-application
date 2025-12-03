import { Card } from "../../components/Card";
import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { DialogBoxWithComments } from "../../components/DialogBoxWithComments";
import { DialogBox } from "../../components/DialogBox";
import { WorkFlowStages } from "../../components/WorkFlowStages";
import { WorkFlowHistory } from "../../components/WorkFlowHistory";
import { SlidOvers } from "../../components/SlidOvers";
import { BadgeComponent } from "../../components/Badge";
import { dateFormatter } from "../../utils/formatHelper";
import Lottie from "lottie-react";
import PermissionDenied from "../../assets/animations/permission-denied.json";
import { dateTimeFormatter } from "../../utils/formatHelper";
import { AlertMainProps } from "../../constants/formConstants";
import { AlertInfoProps } from "../../constants/formConstants";
import { Loader } from "../../components/Loader";
import {
  useGeneratePreSignedUrl,
  useGetHeadcountFormDetail
} from "../../api/backend/backendComponents";
import { HeadCountAddEditForm } from "./Form";
import { AnyProp } from "../../common/types";
import { Badge, Button } from "@ui-components";
import { XMarkIcon } from "@heroicons/react/24/solid";
import icons from "../../assets/icons/index";
import {
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  PencilIcon
} from "@heroicons/react/24/outline";

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

const HeadcountFormInfoLabels: FormInfoProps = {
  is_behalf_hiring_manager: "Are you requesting on behalf of a Hiring Manager?",
  role_reporting: "Reporting to Name",
  role_reporting_email: "Reporting to Email",
  role_name: "Role Name",
  departmentName: "Department",
  created_date: "Date Created",
  headcount: "How many headcount are you requesting for this role?",
  is_role_in_budget: "Is the role in budget?",
  is_new_role_or_replacement:
    "Is it a newly designed role or a direct (like for like) replacement?",
  is_maxterm_or_permanent: "Is the role max term or permanent?",
  max_term_length: "Max term length",
  is_fulltime_or_parttime: "Is the role Fulltime or Part time?",
  hrs_per_week: "Hours per week",
  purpose: "Purpose",
  analysis: "Analysis",
  base_salary: "Recommended Base Salary",
  review_current_team:
    "Has a review of the current team structure and responsibilities been completed to understand if any other changes are required of if this role can be absorbed by the team?",
  additional_benefits: "Any additional benefit and/or expenses associated with hiring?",
  has_position_benchmarked: "Has the position been benchmarked by P&C?",
  explanation_details: "Explanation Details",
  aon_role_code: "AON Role Code",
  bus_driver: "Business Driver",
  impact_dont_hire: "Impact if we don’t hire",
  top_five_kpi: "Top 5 KPI’s this role will deliver:"
};

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

const WorkflowLabels: FormInfoProps = {
  requester_name: "Requestor Name",
  requester_email: "Requestor Email",
  code: "Form Id",
  createdAt: "Created At",
  workflow: "Workflow",
  status: "Status"
};

export function HeadCountDetailPage() {
  const navigate = useNavigate({ from: "/headcount/forms" });
  const { moduleStore } = useSelectedModuleStore();

  const { formId }: { formId: string } = useParams({ strict: false });
  const { moduleId }: { moduleId: string } = useSearch({ strict: false });
  const { page }: { page: string } = useSearch({ strict: false });

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
  const redirectBaseUrl = `${moduleStore?.code}/forms`;
  const [showAlert, setShowAlert] = useState<AlertMainProps>();
  const [formStatus, setformStatus] = useState<AnyProp>("");
  const [isHeadOfPnCFinalApprover, setIsHeadOfPnCFinalApprover] =
    useState<boolean>(false);
  const [values, setValues] = useState<AnyProp>({});
  const [mappedWorkflow, setMappedWorkflow] = useState<CardItemProp[]>([]);
  const [mappedFormInfo, setMappedFormInfo] = useState<CardItemProp[]>([]);
  const [historyData, setHistoryData] = useState<AnyProp[]>([]);
  const [isFormDetailLoading, setIsFormDetailLoading] = useState(true);
  const [viewFileUrl, setViewFileUrl] = useState<string>("");
  const [workflowStatus, setWorkflowStatus] = useState<string>("");

  console.log(
    `formId: ${formId}, emailId: ${emailId}, type: ${page}, moduleId: ${moduleId}`
  );
  const { data: formDetailsData } = useGetHeadcountFormDetail(
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
    if (formDetailsData) {
      console.log(formDetailsData);
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
      setformStatus(formDetailsData?.data.status);
      setIsHeadOfPnCFinalApprover(false);
      setHistoryData(formDetailsData?.data.formHistory);
      setIsFormDetailLoading(false);
    }
  }, [formDetailsData]);

  const selectFormInfoLabel = (financePnc: string): FormInfoProps => {
    switch (financePnc) {
      case "headcount":
        return HeadcountFormInfoLabels;
      default:
        return {} as FormInfoProps;
    }
  };

  const renderLabel = (label?: string) => {
    return <label className="text-gray-900 text-md font-semibold">{label}</label>;
  };
  const renderValue = (value?: string) => {
    return <label className="ms-0 text-md font-normal text-gray-800">{value}</label>;
  };

  const isParagraph = (fieldKey?: string) => {
    const isParagraph = [
      "aon_role_code",
      "explanation_details",
      "purpose",
      "analysis",
      "review_current_team",
      "additional_benefits",
      "bus_driver",
      "impact_dont_hire",
      "top_five_kpi"
    ].includes(fieldKey ?? "");
    return isParagraph ? "grid-cols-1" : "grid-cols-2";
  };

  const FormInfoCardItem = ({ fieldKey, label, value }: CardItemProp) => {
    switch (fieldKey) {
      case "created_date":
        return (
          <div className="p-0 flex">
            <div className="col-span-1">{renderLabel(label)}:</div>
            <div className="col-span-1 ml-5">
              <label className="ms-0 text-md font-normal text-gray-800">
                {value && dateFormatter(value)}
              </label>
            </div>
          </div>
        );

      case "headcount":
      case "max_term_length":
      case "hrs_per_week":
      case "is_role_in_budget":
      case "is_behalf_hiring_manager":
      case "is_new_role_or_replacement":
      case "is_maxterm_or_permanent":
      case "is_fulltime_or_parttime":
      case "has_position_benchmarked":
      case "role_reporting":
      case "role_reporting_email":
      case "role_name":
      case "departmentName":
      case "base_salary":
        return (
          <div className="p-0 flex">
            <div className="col-span-1">
              {renderLabel(label)}:{" "}
              {value ? (
                <span className="ml-4">{renderValue(value)}</span>
              ) : (
                <span className="ml-5">-</span>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`p-0 text-justify grid grid-cols-1 md:${isParagraph(fieldKey)}`}
          >
            {/* ✅ Mobile = 1 Column, Large Screens = Dynamic */}
            <div className="col-span-1">{renderLabel(label)}:</div>
            <div className="col-span-1 break-all md:break-words text-ellipsis overflow-hidden">
              {value ? <span>{renderValue(value)}</span> : <span>-</span>}
            </div>
          </div>
        );
    }
  };

  const BadgeRender = (val: string) => {
    return <BadgeComponent value={val} />;
  };

  const WorkflowCardItem = ({ fieldKey, label, value }: CardItemProp) => {
    const commonContainerStyle = "ps-3 flex flex-col p-1";
    const commonLabelStyle = "text-slate-500 text-xs font-semibold";

    switch (fieldKey) {
      case "code":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div>{value && <Badge variant={"blue"} label={value} />}</div>
          </div>
        );

      case "createdAt":
        return (
          <div className={commonContainerStyle}>
            <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
            <div className="">
              <span className="text-sm font-regular text-gray-800">
                {value && dateTimeFormatter(value)}
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
                    "inline-flex items-center rounded-md bg-purple-100 text-purple-700 ring-purple-700/10 px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize"
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
            <div>{value && BadgeRender(value)}</div>
          </div>
        );
    }

    return (
      <div className={commonContainerStyle}>
        <label className={commonLabelStyle}>{label?.toUpperCase()}:</label>
        <div className="text-gray-800 font-normal text-sm break-words">{value}</div>
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
    console.log(formInfo);
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

  function getAttachmentFileName(url: string): string {
    const fileName = url.split("/").pop();
    if (!fileName) return "No File Name";
    //return fileName.length > 35 ? `${fileName.substring(0, 32)}... ` : fileName;
    return fileName;
  }

  const [isModalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleOpenDialogAlert = (data: any, status: string) => {
    console.log(`data --- : ${data}`);
    if (status === "success") {
      const alertInfo: AlertInfoProps = {
        message: data.message,
        redirectUrl: `${redirectBaseUrl}`
      };
      setShowAlert({ alertInfo, open: true });
    } else if (status === "error") {
      const alertInfo: AlertInfoProps = {
        title: "Error",
        message: data.response.data?.message,
        type: "error",
        redirectUrl: `${redirectBaseUrl}`
      };
      setShowAlert({ alertInfo, open: true });
    }
  };

  const [isModalOpenApprovedPnC, setModalOpenApprovedPnC] = useState(false);
  const handleOpenModalApprovedPnC = () => {
    setModalOpenApprovedPnC(true);
  };

  const handleCloseModalApprovedPnC = () => {
    setModalOpenApprovedPnC(false);
  };

  const resubmit = () => {
    setEditUserOpen(true);
  };

  const handleBack = () => {
    navigate({
      to: `/${moduleStore?.code}/forms`
    });
  };

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
        console.log(viewDocuDetails);
        setViewFileUrl("");
        window.open(viewDocuDetails?.getUrl, "_blank");
      } catch (error) {
        console.log("Error");
      }
    }
  }, [viewDocuDetails]);

  const handleFileView = async (attachmentUrl: string) => {
    setViewFileUrl(attachmentUrl);
  };

  const [isOpen, setIsOpen] = useState(false);
  const closePanel = () => setIsOpen(false);

  return (
    <>
      <main className="py-1">
        {isFormDetailLoading && <Loader />}
        {!isFormDetailLoading ? (
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

              <Button
                leftIcon={<ArrowLeftIcon className="w-3 h-3" />}
                className="justify-center ml-auto w-16 h-7 mr-1 bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
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
              <div className=" -mx-4 mb-3 bg-white border border-slate-200">
                <div className="py-5 pe-3">
                  <div className="sm:flex items-center justify-between">
                    <div className="px-3 pe-5 py-2 h-full ml-2 flex flex-row">
                      <div>
                        {/* biome-ignore lint/a11y/useAltText: <explanation> */}
                        <img className=" w-10 h-10" src={icons.contractIcon} />
                      </div>
                      <div className="flex flex-col ml-5">
                        <text className="text-lg font-semibold text-gray-900">
                          Contract Information
                        </text>
                        <text className=" text-md font-normal text-gray-800">
                          Contract details and application
                        </text>
                      </div>
                    </div>

                    <div className="flex-grow flex justify-end items-center">
                      {page === "approveRequest" && formStatus === "pending" && (
                        <div className="flex items-center space-x-2 pr-3">
                          <Button
                            leftIcon={<CheckIcon className="w-4 h-4" />}
                            className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                            //variant="primary"
                            size="md"
                            title="Approve"
                            label="Approve"
                            onClick={() => handleOpenModalApprovedPnC()}
                          />

                          <DialogBoxWithComments
                            isOpen={isModalOpenApprovedPnC}
                            title="Approval Details"
                            btnText="approvePnc"
                            moduleId={moduleId}
                            emailId={emailId}
                            formId={formId}
                            status="approved"
                            redirectUrl={`${redirectBaseUrl}`}
                            onClose={handleCloseModalApprovedPnC}
                            pncHeadFlag={isHeadOfPnCFinalApprover}
                          />

                          <Button
                            leftIcon={<XMarkIcon className="w-4 h-4" />}
                            className=" bg-red-500 text-white font-medium hover:bg-gray-500 hover:border-gray-500 me-3"
                            //variant="outline"
                            size="md"
                            title="Reject"
                            label="Reject"
                            onClick={() => handleOpenModal()}
                          />

                          <DialogBoxWithComments
                            isOpen={isModalOpen}
                            title="Reject Reason"
                            btnText="reject"
                            moduleId={moduleId}
                            emailId={emailId}
                            formId={formId}
                            status="rejected"
                            redirectUrl={`${redirectBaseUrl}`}
                            onClose={handleCloseModal}
                            onOpenDialog={handleOpenDialogAlert}
                          />
                        </div>
                      )}
                      {page === "myRequest" && formStatus === "rejected" && (
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-1 py-1 xl:w-full">
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
                          console.log("mapped----", mappedFormInfo);
                          return (
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
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                </div>
                <div className="xl:w-[35%]">
                  {values?.attachments && values?.attachments.length > 0 && (
                    <div className="mt-3">
                      <Card title="Additional Attachments">
                        {values.attachments.map((url: string, index: number) => {
                          const fileName = getAttachmentFileName(url);
                          const { name, extension } = cropFileName(fileName, 150);
                          const getFileIcon = (ext: string) => {
                            const iconsMap: { [key: string]: string } = {
                              doc: icons.doc,
                              pdf: icons.pdf,
                              xls: icons.xls
                            };
                            return iconsMap[ext] || icons.doc;
                          };

                          return (
                            <div
                              key={`${index}_${url}`}
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
            {showAlert?.open && (
              <DialogBox
                title={showAlert.alertInfo?.title || ""}
                btnText="Ok"
                redirectUrl={showAlert.alertInfo?.redirectUrl || ""}
                message={showAlert.alertInfo?.message || ""}
                onClose={() => setShowAlert({ open: false })}
                type={showAlert.alertInfo?.type || ""}
              />
            )}
            {isOpen && (
              <SlidOvers heading="History" isOpen={isOpen} onClose={closePanel}>
                <WorkFlowHistory workflowHistory={historyData} />
              </SlidOvers>
            )}
          </>
        ) : (
          !isFormDetailLoading && (
            <div className="flex flex-col justify-center items-center h-screen">
              <Lottie animationData={PermissionDenied} style={{ height: 250 }} />
              <p className="text-8xl font-bold text-gray-400 align-middle">403</p>
              <p className="text-5xl font-semibold text-gray-400 align-middle">
                Forbidden Access
              </p>
            </div>
          )
        )}
      </main>
      {
        <HeadCountAddEditForm
          formId={formId}
          type={editUserOpen ? "edit" : "none"}
          formData={formDetailsData}
          setOpenDraw={val => setEditUserOpen(val)}
          openDraw={editUserOpen}
        />
      }
    </>
  );
}
