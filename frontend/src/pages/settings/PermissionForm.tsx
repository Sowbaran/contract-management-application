import { Button, Drawer, Input } from "@ui-components";
import { useEffect, useState } from "react";
import {
  useCreatePermission,
  useGetFormModules,
  useGetPermissionById,
  useUpdatePermission
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { ObjectId } from "../../api/backend/backendSchemas";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import { AlertProps } from "@ui-components/Alert/types";
import { AnyProp } from "../../common/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { SelectLabel } from "../../layouts/SelectLabel/SelectLabel";

export type PermissionFormProps = {
  open: boolean;
  isCreating: string;
  setOpen: (val: boolean) => void;
  selectedRowId: string;
};

export const PermissionForm = ({
  open,
  isCreating,
  setOpen,
  selectedRowId
}: PermissionFormProps) => {
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [moduleOptions, setModuleOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [permissionName, setPermissionName] = useState("");
  const [description, setDescription] = useState("");
  const [module, setModule] = useState<{ value: string; label: string } | null>(null);
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [errors, setErrors] = useState<any>({});
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const newErrors: any = {};

  const { data: permissionDetails } = useGetPermissionById(
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
    setPermissionName("");
    setDescription("");
    setModule(null);
    setActiveStatus(false);
    setErrors({});
    if (isCreating === "edit" && permissionDetails) {
      setPermissionName(
        permissionDetails?.data.permissionName
          ? permissionDetails?.data.permissionName
          : ""
      );
      setDescription(
        permissionDetails.data.description ? permissionDetails.data.description : ""
      );
      setModule({
        value: permissionDetails.data.moduleId.toString(),
        label: permissionDetails.data.moduleName
      });
      setActiveStatus(permissionDetails.data.status);
    }
  }, [isCreating, permissionDetails, open]);

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
  }, [moduleList]);

  const handlePermissionName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPermissionName(value);

    if (value.trim() === "") {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        permissionName: "Permission Name field is required"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        permissionName:
          value.trim() === "" ? "Permission Name field is required" : undefined
      }));
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);

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

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleModuleChange = (selectedOption: any) => {
    setModule(selectedOption); // Update the state with the selected option

    if (!selectedOption) {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        module: "Module field is required"
      }));
    } else {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setErrors((prevErrors: any) => ({
        ...prevErrors,
        module: selectedOption ? undefined : "Module field is required"
      }));
    }
  };

  const handleSubmit = () => {
    if (permissionName.trim() === "") {
      newErrors.permissionName = "Permission Name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!module) {
      newErrors.module = "Module is required";
    }

    setErrors(newErrors);
    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      const formatCode = permissionName.toLowerCase().replace(/\s+/g, "-");
      const formData = {
        menuModuleId: selectedModule?._id,
        permissionName: permissionName,
        permissionCode: formatCode,
        description: description,
        moduleId: module?.value,
        status: isCreating === "add" ? true : activeStatus,
        createdBy: emailId ? emailId : "",
        updatedBy: emailId ? emailId : ""
      };
      console.log("Permission Form Data:", JSON.stringify(formData));

      setIsLoading(true);

      if (isCreating === "add") {
        createPermissionFormData({
          body: { ...formData } as AnyProp,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        updatePermissionFormData({
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

  const { mutate: createPermissionFormData } = useCreatePermission({
    onSuccess: response => {
      console.log("success", response);
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

  const { mutate: updatePermissionFormData } = useUpdatePermission({
    onSuccess: response => {
      console.log("update success", response);
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
      console.log("update error --- ", error);
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
      setPermissionName("");
      setDescription("");
      setModule(null);
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
              {isCreating === "add" ? "Create Permisssion" : "Edit Permisssion"}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <div className="relative h-full w-full px-6 flex flex-col gap-4 py-3">
            <div>
              <label
                htmlFor="permissionName"
                className="text-slate-500 text-sm font-normal"
              >
                Permission Name
              </label>
              <label className="text-red-500 ml-1">*</label>
              <Input
                className="text-sm"
                variant={"default"}
                placeholder="Permission Name"
                value={permissionName}
                onChange={handlePermissionName}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.permissionName}</p>}
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
              <label htmlFor="module" className="text-slate-500 text-sm font-normal">
                Module
              </label>
              <label className="text-red-500 ml-1">*</label>
              <SelectLabel
                optionTextStyle="text-sm"
                buttonTextStyle="text-sm"
                containerStyle="h-10"
                placeholder="Select Module"
                placeholderStyle="text-sm"
                lblText=""
                htmlFor=""
                size="sm"
                options={moduleOptions.sort((a, b) => a.label.localeCompare(b.label))}
                value={module || undefined}
                onChange={handleModuleChange}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.module}</p>}
            </div>

            <div>
              {isCreating === "add" ? undefined : (
                <SwitchLabel
                  labelProps={{
                    lblColor: "slate",
                    lblSize: "md",
                    //fontWeight: "light",
                    className: "w-auto"
                  }}
                  lblText="Status"
                  switchLabel={activeStatus ? "Active" : "In-Active"}
                  active={activeStatus}
                  switchContainerStyle=""
                  switchLabelStyle="text-md"
                  onChange={(id, active) => {
                    console.log("Permission From Id: ", id, active);
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
