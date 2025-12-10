import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import {
  useCreateWorkFlow,
  useGetAllRoles,
  useGetWorkflowById
} from "../../../api/backend/backendComponents";
import {
  useAuthStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../../store";
import { useEffect, useState } from "react";
import { ObjectId } from "../../../api/backend/backendSchemas";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button, Checkbox, Input } from "@ui-components";
import { SelectLabel } from "../../../layouts/SelectLabel/SelectLabel";
import { v4 as uuidv4 } from "uuid";
import { AnyProp } from "../../../common/types";
import { AlertLayout } from "../../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../../utils/CommonIcons";
import { AlertProps } from "@ui-components/Alert/types";
import { ButtonProps } from "@ui-components/Button/types";
import { Bars3Icon } from "@heroicons/react/24/solid";

type CofigWorkflowOrdertDTO = {
  id?: string;
  level: number;
  role?: string; // Change this to string
  limitFlag?: boolean;
  min?: number;
  max?: number;
  isSpecificDeptApprover?: boolean;
  includeOnRequesterCheck?: boolean;
  deedOfNovation?: boolean;
  byPassWorkflow?: boolean;
  code?: string;
  name?: string;
};

export function ContractConfigurationUpdateFormNew() {
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const { moduleTabStore: selectedModuleView } = useSelectedModuleTabStore();
  const { configurationId }: { configurationId: string } = useParams({
    strict: false
  });
  const { moduleId }: { moduleId: string } = useSearch({ strict: false });
  const { emailId, accessToken } = useAuthStore();
  const [roleOptions, setRoleOptions] = useState<{ value: string; label: string }[]>([]);
  const [configurationData, setConfigurationData] = useState<CofigWorkflowOrdertDTO[]>(
    []
  );
  const [version, setVersion] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();

  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const onDragEnd = () => {
    if (
      draggingIndex === null ||
      dragOverIndex === null ||
      draggingIndex === dragOverIndex
    ) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...configurationData];
    const [draggedItem] = updated.splice(draggingIndex, 1);
    if (!draggedItem) {
      setDraggingIndex(null);
      setDragOverIndex(null);
      return;
    }
    updated.splice(dragOverIndex, 0, draggedItem);
    // Update level based on new index
    const updatedWithLevels = updated.map((item, idx) => ({
      ...item,
      level: idx + 1
    }));
    setConfigurationData(updatedWithLevels);
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  let alertClose: (() => void) | null = null;
  const navigate = useNavigate();

  const alertBtnActions: ButtonProps[] = [
    {
      id: "ok",
      variant: "green",
      size: "sm",
      label: "Okay",
      buttonStyle: "w-full"
    }
  ];

  const { data: configurationDetails } = useGetWorkflowById(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      pathParams: {
        id: configurationId
      },
      queryParams: {
        menuModuleId: selectedModule?._id,
        email: emailId ? emailId : ""
      }
    },
    {
      enabled: !!configurationId && !!accessToken
      // retry: false
    }
  );

  useEffect(() => {
    if (configurationDetails) {
      //console.log(configurationDetails);
      if (configurationDetails.data?.version) {
        setVersion(configurationDetails.data?.version);
      }
      if (configurationDetails.data?.workflowOrder) {
        // Assign a unique ID to each item in the workflowOrder
        const updatedData = configurationDetails.data.workflowOrder.map(item => ({
          ...item,
          role: item.role ? item.role.toString() : "",
          id: uuidv4() // Assign unique ID using uuidv4
        }));
        setConfigurationData(updatedData); // Set the updated data with unique IDs
      }
    }
  }, [configurationDetails]);

  const { data: roleList } = useGetAllRoles(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled: !!accessToken
    }
  );

  useEffect(() => {
    if (roleList) {
      const options = roleList.data.map(
        ({ _id, name }: { _id: ObjectId; name: string }) => ({
          value: _id.toString(),
          label: name
        })
      );
      setRoleOptions(options);
    }
  }, [roleList]);

  const handleAddRow = () => {
    if (configurationData.length < roleOptions.length) {
      // Only allow adding rows if limit is not reached
      const newRow = {
        id: uuidv4(), // Assign a unique ID
        level: configurationData.length + 1,
        role: "",
        limitFlag: false,
        min: undefined,
        max: undefined,
        isSpecificDeptApprover: false,
        includeOnRequesterCheck: false,
        deedOfNovation: false,
        byPassWorkflow: false
      };

      setConfigurationData(prev => [...prev, newRow]);
    }
  };

  const handleRemoveRow = (id: string) => {
    setConfigurationData(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
    const configurationDetails = {
      _id: configurationId,
      moduleId: moduleId,
      version: version,
      status: true,
      workflowOrder: configurationData.map(data => ({
        level: data.level,
        role: data.role,
        limitFlag: data.limitFlag,
        min: data.min,
        max: data.max,
        isSpecificDeptApprover: data.isSpecificDeptApprover,
        includeOnRequesterCheck: data.includeOnRequesterCheck,
        deedOfNovation: data.deedOfNovation,
        byPassWorkflow: data.byPassWorkflow
      })),
      createdBy: emailId ? emailId : "",
      updatedBy: emailId ? emailId : ""
    };
    console.log("Configuration Form Data:", JSON.stringify(configurationDetails));
    createWorkflow({
      body: { ...configurationDetails } as AnyProp,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  };

  const { mutate: createWorkflow } = useCreateWorkFlow({
    onSuccess: response => {
      console.log("success", response);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      setAlertInfo({ ...alertInfo, type: "success" });
      setShowAlert(true);
    },
    onError: (error: AnyProp) => {
      console.log("error --- ", error);
      const alertInfo: AlertProps = {
        title: "Error",
        message:
          error?.stack?.message ||
          error?.message ||
          "An error occurred while updating the configuration.",
        type: "error"
      };
      setAlertInfo({ ...alertInfo, type: "error" });
      setShowAlert(true);
    }
  });

  const handleCancel = () => {
    navigate({
      to: "/contract/configuration/list",
      replace: true
    });
  };

  const alertCallback = async (actId: string, closeAlert?: () => void) => {
    console.log(actId);
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "ok":
        alertClose?.();
        navigate({
          to: "/contract/configuration/list"
        });
        break;

      case "cancel":
        alertClose?.();
        break;
    }
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between ">
        {/* Header - Fixed */}
        <div className="w-full bg-white shadow-md">
          <div className="w-full px-4 sm:px-6 md:px-8">
            <div className="text-sm sm:text-base">
              <div>
                {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
                <span
                  className="text-gray-500 font-semibold cursor-pointer"
                  title="Back"
                  onClick={() => handleCancel()}
                >{`${selectedModule?.name} / ${selectedModuleView?.name} / `}</span>
                <span className="text-gray-900 font-semibold">Form</span>
              </div>
            </div>
          </div>
          <div className="mt-3 border-b border-gray-200" />
          <div className="mt-4 mb-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="text-xl sm:text-2xl font-medium leading-tight">
              Configuration Update Form
            </span>
            <Button
              leftIcon={<PlusCircleIcon className="text-white w-5 h-5" />}
              className="w-full sm:w-auto bg-[#632b50] text-white font-medium hover:bg-green-600 hover:border-green-600 cursor-pointer"
              size="sm"
              label="Add Level"
              onClick={handleAddRow}
              disabled={configurationData.length >= roleOptions.length}
            />
          </div>
          <div className="border-b border-gray-200" />
        </div>

        <div className="flex-1 overflow-x-auto">
          {/* Main Content - Scrollable */}
          <div className=" bg-neutral-50 px-4 sm:px-6 md:px-8 min-h-0">
            {/* <div className="overflow-x-auto"> */}
            <div className="border border-gray-300 rounded-md shadow-md my-4">
              {/* <div className="w-full overflow-x-auto"> */}
              <table className="min-w-full bg-white rounded-md shadow-sm">
                {/* Table Header */}
                <thead className="bg-gray-100 text-gray-400 text-xs">
                  <tr>
                    <th className="w-[5%] min-w-[50px] p-2 text-center text-sm text-gray-900 font-semibold">
                      No
                    </th>
                    <th className="w-[20%] min-w-[150px] p-2 text-sm text-gray-900 font-semibold">
                      Role
                    </th>
                    <th className="w-[12%] min-w-[100px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Limit Enabled
                    </th>
                    <th className="w-[15%] min-w-[90px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Minimum
                    </th>
                    <th className="w-[15%] min-w-[90px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Maximum
                    </th>
                    <th className="w-[15%] min-w-[130px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Is Specific Dept Approver
                    </th>
                    <th className="w-[15%] min-w-[130px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Include On Requester Check
                    </th>
                    <th className="w-[15%] min-w-[130px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Deed Of Novation
                    </th>
                    <th className="w-[15%] min-w-[130px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Bypass Workflow
                    </th>
                    <th className="w-[10%] min-w-[90px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Action
                    </th>
                    <th className="w-[5%] min-w-[50px] p-2 text-center text-sm text-gray-900 font-semibold">
                      Reorder
                    </th>
                  </tr>
                </thead>

                <tbody className="text-gray-400 text-xs sm:text-sm">
                  {configurationData.map((item, index) => (
                    <tr
                      key={item.id || index}
                      onDragOver={e => {
                        e.preventDefault();
                        setDragOverIndex(index);
                      }}
                      onDrop={onDragEnd}
                      className={`border-b border-gray-200 hover:bg-gray-50 ${
                        index === dragOverIndex ? "bg-gray-100" : ""
                      }`}
                    >
                      <td className="p-2 text-center text-sm font-normal text-gray-900 whitespace-nowrap">
                        {index + 1}
                      </td>

                      <td className="p-2">
                        <SelectLabel
                          optionTextStyle="text-sm"
                          buttonTextStyle="text-sm"
                          containerStyle="h-9"
                          htmlFor=""
                          lblText=""
                          placeholder="Select Role"
                          placeholderStyle="text-sm"
                          size="md"
                          options={roleOptions
                            .filter(
                              option =>
                                !configurationData.some(
                                  row => row.role === option.value
                                ) || item.role === option.value
                            )
                            .sort((a, b) => a.label.localeCompare(b.label))}
                          value={roleOptions.find(option => option.value === item.role)}
                          onChange={selected => {
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, role: selected?.value }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Checkbox
                          defaultChecked={item.limitFlag ?? false}
                          onChange={e => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, limitFlag: isChecked }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Input
                          className="border-none text-center text-sm font-normal text-gray-900 whitespace-nowrap"
                          variant="default"
                          value={item.min ?? "0"}
                          onChange={e => {
                            const value = e.target.value;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, min: value ? Number(value) : undefined }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Input
                          className="border-none text-center text-sm font-normal text-gray-900 whitespace-nowrap"
                          variant="default"
                          value={item.max ?? "0"}
                          onChange={e => {
                            const value = e.target.value;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, max: value ? Number(value) : undefined }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Checkbox
                          defaultChecked={item.isSpecificDeptApprover ?? false}
                          onChange={e => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, isSpecificDeptApprover: isChecked }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Checkbox
                          defaultChecked={item.includeOnRequesterCheck ?? false}
                          onChange={e => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, includeOnRequesterCheck: isChecked }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Checkbox
                          defaultChecked={item.deedOfNovation ?? false}
                          onChange={e => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, deedOfNovation: isChecked }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2 text-center">
                        <Checkbox
                          defaultChecked={item.byPassWorkflow ?? false}
                          onChange={e => {
                            const isChecked = (e.target as HTMLInputElement).checked;
                            setConfigurationData(prev =>
                              prev.map(row =>
                                row.id === item.id
                                  ? { ...row, byPassWorkflow: isChecked }
                                  : row
                              )
                            );
                          }}
                        />
                      </td>

                      <td className="p-2">
                        <div className="flex justify-center items-center gap-2">
                          <TrashIcon
                            className="w-4 h-4 text-gray-900 cursor-pointer hover:text-red-500"
                            onClick={() =>
                              handleRemoveRow(item.id ? item.id.toString() : "")
                            }
                          />
                        </div>
                      </td>

                      <td className="p-2">
                        <div
                          draggable
                          onDragStart={() => setDraggingIndex(index)}
                          className="flex justify-center items-center cursor-move"
                        >
                          <Bars3Icon className="w-4 h-4 text-gray-900" title="Shuffle" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="bg-white border-t border-gray-200 px-8 py-3 flex justify-between shadow-lg">
          <Button
            variant="greenOutline"
            size="sm"
            label="Cancel"
            onClick={handleCancel}
          />
          <Button className="bg-[#632b50] text-white font-medium hover:bg-green-600 hover:border-green-600" size="sm" label="Save" onClick={handleSave} />
        </div>
      </div>

      {
        <AlertLayout
          enableParentClose={true}
          icon={alertInfo?.type === "success" ? <SuccessIcon /> : <ErrorIcon />}
          open={showAlert}
          setOpen={setShowAlert}
          {...alertInfo}
          btnActionCallBack={alertCallback}
          buttonContents={alertBtnActions}
        />
      }
    </>
  );
}
