import { Button, Drawer, Input, MultiSelect } from "@ui-components";
import { useEffect, useState } from "react";
import {
  useCreateDepartment,
  useGetDepartmentById,
  useGetFormModules,
  useUpdateDepartment
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { DeptModuleResponse, ObjectId } from "../../api/backend/backendSchemas";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import { AlertProps } from "@ui-components/Alert/types";
import { AnyProp } from "../../common/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { MultiSelectOption } from "@ui-components/MultiSelect/types";

export type DepartmentFormProps = {
  open: boolean;
  isCreating: string;
  setOpen: (val: boolean) => void;
  selectedRowId: string;
};

export const DepartmentForm = ({
  open,
  isCreating,
  setOpen,
  selectedRowId
}: DepartmentFormProps) => {
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [moduleOptions, setModuleOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState<MultiSelectOption[]>([]);
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [errors, setErrors] = useState<any>({});
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const newErrors: any = {};

  const { data: departmentDetails } = useGetDepartmentById(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      pathParams: {
        id: selectedRowId
      },
      queryParams: {
        menuModuleId: selectedModule?._id,
        email: emailId ? emailId : ""
      }
    },
    {
      enabled: !!selectedRowId && isCreating === "edit"
      // retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setDepartmentName("");
    setDescription("");
    setModule([]);
    setActiveStatus(false);
    setErrors({});
    if (isCreating === "edit" && departmentDetails) {
      setDepartmentName(departmentDetails.data.name);
      setDescription(departmentDetails.data.description);

      const transformModuleList = (list: DeptModuleResponse[]): MultiSelectOption[] => {
        return list?.map(item => {
          return { label: item.name, value: item._id.toString() };
        });
      };

      setModule(transformModuleList(departmentDetails.data.module));
      setActiveStatus(departmentDetails.data.status);
    }
  }, [isCreating, departmentDetails, open]);

  const { data: moduleList } = useGetFormModules(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      retry: false
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (moduleList) {
      const options = moduleList.data.map(
        ({ _id, name }: { _id: ObjectId; name: string }) => ({
          value: _id.toString(),
          label: name
        })
      );
      setModuleOptions(options);
    }
  }, [moduleList, open]);

  const handleDepartmentName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepartmentName(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        departmentName: "Department Name field is required"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        departmentName:
          value.trim() === "" ? "Department Name field is required" : undefined
      }));
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        description: "Description field is required"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        description: value.trim() === "" ? "Description field is required" : undefined
      }));
    }
  };

  const handleSubmit = () => {
    if (departmentName.trim() === "") {
      newErrors.departmentName = "Department Name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (module.length === 0) {
      newErrors.module = "Module is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      const formatCode = departmentName.toLowerCase().replace(/\s+/g, "-");
      const formData = {
        menuModuleId: selectedModule?._id,
        name: departmentName,
        code: formatCode,
        description: description,
        moduleId: module.map(item => item.value),
        status: isCreating === "add" ? true : activeStatus,
        createdBy: emailId ? emailId : "",
        updatedBy: emailId ? emailId : ""
      };

      setIsLoading(true);

      if (isCreating === "add") {
        createDepartmentFormData({
          body: { ...formData } as AnyProp,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        updateDepartmentFormData({
          body: { ...formData } as AnyProp,
          pathParams: {
            id: selectedRowId
          },
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      }
    }
  };

  const { mutate: createDepartmentFormData } = useCreateDepartment({
    onSuccess: response => {
      setOpen(false);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      setAlertInfo({ ...alertInfo, type: "success" });
      setShowAlert(true);
      setIsLoading(false);
    },
    onError: (error: AnyProp) => {
      console.error("createDepartmentFormData error: ", error);
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

  const { mutate: updateDepartmentFormData } = useUpdateDepartment({
    onSuccess: response => {
      setOpen(false);
      const alertInfo: AlertProps = {
        title: "Success",
        message: response.message
      };
      setAlertInfo({ ...alertInfo, type: "success" });
      setShowAlert(true);
      setIsLoading(false);
    },
    onError: (error: AnyProp) => {
      console.error("updateDepartmentFormData update error: ", error);
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

  const handleCancel = () => {
    if (isCreating === "add") {
      setDepartmentName("");
      setDescription("");
      setModule([]);
      setActiveStatus(false);
      setErrors({});
    }
    setOpen(false);
  };

  const handleModuleChange = (selectedOptions: MultiSelectOption[]) => {
    setModule(selectedOptions);
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => ({
      ...prevErrors,
      module: selectedOptions.length > 0 ? undefined : "Module field is required"
    }));
  };

  return (
    <>
      <Drawer
        open={open}
        handleOpen={val => {
          setOpen(val);
        }}
        backgroudPanelStyle="w-[500px] sm:w-[500px] pl-3 sm:pl-0 mt-14"
        headerContentStyle="border-b border-gray-200 flex justify-between items-center py-6"
        enableZindex={true}
        headerContent={
          <>
            <label className="text-lg  font-bold text-gray-900">
              {isCreating ? "Create Department" : "Edit Department"}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <div className="relative h-full w-full px-6 flex flex-col gap-4 py-3">
            <div>
              <div className="mb-1">
                <label
                  htmlFor="departmentName"
                  className="text-gray-900 text-md font-normal"
                >
                  Department Name
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <Input
                className="text-sm"
                variant={"default"}
                placeholder="Department Name"
                value={departmentName}
                onChange={handleDepartmentName}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.departmentName}</p>}
            </div>

            <div>
              <div className="mb-1">
                <label
                  htmlFor="description"
                  className="text-gray-900 text-md font-normal"
                >
                  Description
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <Input
                className="text-sm"
                variant={"default"}
                placeholder="Description"
                value={description}
                onChange={handleDescription}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <div className="mb-1">
                <label htmlFor="module" className="text-gray-900 text-md font-normal">
                  Module
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <MultiSelect
                className="w-full text-sm"
                placeholder="Select Module"
                values={module}
                options={moduleOptions.sort((a, b) => a.label.localeCompare(b.label))}
                onChangeCb={handleModuleChange}
              />
              {/* <MultiSelect
                placeholder="Select Module"
                selectedOptions={module}
                setSelectedOptions={setModule}
              /> */}
              {<p className="text-red-500 text-xs mt-1">{errors.module}</p>}
            </div>

            <div>
              {isCreating === "add" ? undefined : (
                <SwitchLabel
                  labelProps={{
                    lblColor: "slate",
                    lblSize: "md",
                    //fontWeight: "light",
                    className: "w-[600px]"
                  }}
                  lblText="Status"
                  switchLabel={activeStatus ? "Active" : "In-Active"}
                  active={activeStatus}
                  switchContainerStyle="w-40"
                  switchLabelStyle="text-md"
                  onChange={(id, active) => {
                    console.log("Role From Id: ", id, active);
                    setActiveStatus(active);
                  }}
                />
              )}
            </div>
          </div>
        }
        footerContent={
          <div className="flex justify-between mt-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto px-4 py-1 cursor-pointer text-sm font-semibold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white me-3"
              size="sm"
              label="Cancel"
              onClick={handleCancel}
            />
            <Button
              variant="primary"
              className="w-full sm:w-auto px-4 text-sm font-medium text-white bg-green-600 hover:bg-gray-500 border border-green-600 hover:border-gray-500"
              size="sm"
              label="Submit"
              onClick={handleSubmit}
              disabled={isLoading}
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
        />
      }
    </>
  );
};
