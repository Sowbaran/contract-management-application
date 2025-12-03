import { Button, Drawer, Input } from "@ui-components";
import { useEffect, useState } from "react";
import {
  useCreateFormModule,
  useGetFormModuleById,
  useUpdateFormModule
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import { AnyProp } from "../../common/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { AlertProps } from "@ui-components/Alert/types";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";

export type ModuleFormProps = {
  open: boolean;
  isCreating: string;
  setOpen: (val: boolean) => void;
  selectedRowId: string;
};

export const ModuleForm = ({
  open,
  isCreating,
  setOpen,
  selectedRowId
}: ModuleFormProps) => {
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [moduleName, setModuleName] = useState("");
  const [description, setDescription] = useState("");
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [errors, setErrors] = useState<any>({});
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const newErrors: any = {};

  const { data: moduleDetails } = useGetFormModuleById(
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
    }
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setModuleName("");
    setDescription("");
    setActiveStatus(false);
    setErrors({});
    if (isCreating === "edit" && moduleDetails) {
      setModuleName(moduleDetails?.data.name ? moduleDetails?.data.name : "");
      setDescription(
        moduleDetails?.data.description ? moduleDetails?.data.description : ""
      );
      setActiveStatus(moduleDetails?.data.status ? true : false);
    }
  }, [isCreating, moduleDetails, open]);

  const handleModuleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setModuleName(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        moduleName: "Module Name field is required"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        moduleName: value.trim() === "" ? "Module Name field is required" : undefined
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
    if (moduleName.trim() === "") {
      newErrors.moduleName = "Module Name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      const formatCode = moduleName.toLowerCase().replace(/\s+/g, "-");
      const formData = {
        menuModuleId: selectedModule?._id,
        name: moduleName,
        code: formatCode,
        description: description,
        status: isCreating === "add" ? true : activeStatus,
        createdBy: emailId ? emailId : "",
        updatedBy: emailId ? emailId : ""
      };

      setIsLoading(true);

      if (isCreating === "add") {
        createFormModules({
          body: { ...formData } as AnyProp,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        updateFormModules({
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

  const { mutate: createFormModules } = useCreateFormModule({
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
      console.error("createFormModules error: ", error);
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

  const { mutate: updateFormModules } = useUpdateFormModule({
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
      console.error("updateFormModules update error: ", error);
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
      setModuleName("");
      setDescription("");
      setActiveStatus(false);
      setErrors({});
    }
    setOpen(false);
  };

  return (
    <>
      <Drawer
        open={open}
        handleOpen={val => {
          setOpen(val);
        }}
        backgroudPanelStyle="w-[300px] sm:w-[400px] pl-3 sm:pl-0 mt-14"
        headerContentStyle="border-b border-gray-200 flex justify-between items-center py-6"
        enableZindex={true}
        headerContent={
          <>
            <label className="text-base text-black font-medium">
              {isCreating === "add" ? "Create Module" : "Edit Module"}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <div className="relative h-full w-full px-6 flex flex-col gap-4 py-3">
            <div>
              <label htmlFor="moduleName" className="text-slate-500 text-sm font-normal">
                Module Name
              </label>
              <label className="text-red-500 ml-1">*</label>
              <Input
                className="text-sm"
                variant={"default"}
                placeholder="Module Name"
                value={moduleName}
                onChange={handleModuleName}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.moduleName}</p>}
            </div>

            <div>
              <label htmlFor="description" className="text-slate-500 text-sm font-normal">
                Description
              </label>
              <label className="text-red-500 ml-1">*</label>
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
                    console.log("Module From Id: ", id, active);
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
