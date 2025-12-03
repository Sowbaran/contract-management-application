import { Button, Drawer, Input, MultiSelect } from "@ui-components";
import { useEffect, useState } from "react";
import {
  useCreateRole,
  useGetFormModules,
  useGetRoleDetailById,
  useUpdateRole
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { ModuleResponseDto } from "../../api/backend/backendSchemas";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import { AlertProps } from "@ui-components/Alert/types";
import { AnyProp } from "../../common/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { SelectLabel } from "../../layouts/SelectLabel/SelectLabel";

export type RoleFormProps = {
  open: boolean;
  isCreating: string;
  setOpen: (val: boolean) => void;
  selectedRowId: string;
};

interface ModulePermissions {
  id: string; // Unique identifier
  module: { value: string; label: string } | null; // Module details
  permission: { value: string; label: string }[]; // Permission details
}

export const RoleForm = ({ open, isCreating, setOpen, selectedRowId }: RoleFormProps) => {
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [moduleOptions, setModuleOptions] = useState<
    { value: string; label: string; permissions: AnyProp[] }[]
  >([]);

  const [roleName, setRoleName] = useState("");
  const [description, setDescription] = useState("");
  const [modulePermissions, setModulePermissions] = useState<ModulePermissions[]>([
    {
      module: null,
      permission: [],
      id: uuidv4()
    }
  ]);
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<AnyProp>({});
  const [, setSelectedModuleId] = useState<string>("");
  const newErrors: AnyProp = {};

  const { data: roleDetails } = useGetRoleDetailById(
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
    setRoleName("");
    setDescription("");
    setModulePermissions([
      {
        module: null,
        permission: [],
        id: ""
      }
    ]);
    setActiveStatus(false);
    setErrors({});
    if (isCreating === "edit" && roleDetails) {
      setRoleName(roleDetails?.data.name ? roleDetails?.data.name : "");
      setDescription(roleDetails?.data.description ? roleDetails?.data.description : "");
      const transformResponse = (response: ModuleResponseDto[]): ModulePermissions[] => {
        return response.map(module => ({
          id: uuidv4(),
          module: { value: module._id.toString(), label: module.name },
          permission: module.permissions.map(permission => ({
            value: permission._id.toString(),
            label: permission.name
          }))
        }));
      };
      const transformedResponse = transformResponse(roleDetails?.data.module);
      setModulePermissions(transformedResponse);

      setActiveStatus(roleDetails.data.status ? true : false);
    }
  }, [isCreating, roleDetails, open]);

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
    if (moduleList?.data) {
      const options = moduleList.data.map((module: AnyProp) => ({
        value: module._id,
        label: module.name,
        permissions: module.permissions.map(
          (permission: { _id: AnyProp; permissionName: AnyProp }) => ({
            value: permission._id,
            label: permission.permissionName
          })
        )
      }));

      setModuleOptions(options);
    }
  }, [moduleList]);

  const handleRoleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRoleName(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        roleName: "Role Name field is required"
      }));
    } else {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        roleName: value.trim() === "" ? "Role Name field is required" : undefined
      }));
    }
  };

  const handleDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDescription(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        description: "Description field is required"
      }));
    } else {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        description: value.trim() === "" ? "Description field is required" : undefined
      }));
    }
  };

  const handleModuleChange = (selectedOption: AnyProp, id: string) => {
    setSelectedModuleId(selectedOption?.value);
    setModulePermissions(prev =>
      prev.map(item =>
        item.id === id ? { ...item, module: selectedOption, permission: [] } : item
      )
    );

    // Dynamically validate and update errors
    setErrors((prevErrors: { [x: string]: AnyProp }) => ({
      ...prevErrors,
      [id]: {
        ...prevErrors[id],
        module: selectedOption ? undefined : "Module field is required"
      }
    }));
  };

  const getAvailableModule = (
    allOptions: { value: string; label: string }[],
    modulePermissions: {
      id: string;
      module: { value: string; label: string } | null;
    }[],
    currentId: string
  ) => {
    const selectedValues = modulePermissions
      .filter(item => item.id !== currentId)
      .map(item => item.module?.value);

    // Filter out options that are already selected
    return allOptions.filter(option => !selectedValues.includes(option.value));
  };

  const handlePermissionChange = (selectedOptions: AnyProp, id: string) => {
    setModulePermissions(prev =>
      prev.map(item => (item.id === id ? { ...item, permission: selectedOptions } : item))
    );

    // Dynamically validate and update errors
    setErrors((prevErrors: { [x: string]: AnyProp }) => ({
      ...prevErrors,
      [id]: {
        ...prevErrors[id],
        permission:
          selectedOptions.length > 0 ? undefined : "Permission field is required"
      }
    }));
  };

  const handleAddSection = () => {
    setModulePermissions([
      ...modulePermissions,
      {
        module: null,
        permission: [],
        id: uuidv4()
      }
    ]);
  };

  const handleRemoveSection = (id: string) => {
    setModulePermissions(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    if (roleName.trim() === "") {
      newErrors.roleName = "Role Name is required";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    modulePermissions.forEach(selected => {
      const roleErrors: { module?: string; permission?: string } = {};

      if (!selected.module) {
        roleErrors.module = "Module field is required";
      }

      if (selected.permission.length === 0) {
        roleErrors.permission = "Permission field is required";
      }

      if (Object.keys(roleErrors).length > 0) {
        newErrors[selected.id] = roleErrors; // Add errors for this id
      }
    });

    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      const formatCode = roleName.toLowerCase().replace(/\s+/g, "-");
      const formData = {
        menuModuleId: selectedModule?._id,
        name: roleName,
        code: formatCode,
        description: description,
        moduleId: modulePermissions.map(item => item.module?.value),
        permissions: modulePermissions.flatMap(item => item.permission.map(r => r.value)),
        status: isCreating === "add" ? true : activeStatus,
        createdBy: emailId ? emailId : "",
        updatedBy: emailId ? emailId : ""
      };

      setIsLoading(true);

      if (isCreating === "add") {
        createRoleFormData({
          body: { ...formData } as AnyProp,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        updateRoleFormData({
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

  const { mutate: createRoleFormData } = useCreateRole({
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
      console.error("createRoleFormData error: ", error);
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

  const { mutate: updateRoleFormData } = useUpdateRole({
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
      console.error("updateRoleFormData update error: ", error);
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
      setRoleName("");
      setDescription("");
      setModulePermissions([
        {
          module: null,
          permission: [],
          id: ""
        }
      ]);
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
        backgroudPanelStyle="pl-3 sm:pl-0 mt-14"
        headerContentStyle="border-b border-gray-200 flex justify-between items-center py-6"
        enableZindex={true}
        headerContent={
          <>
            <label className="text-lg  font-bold text-gray-900">
              {isCreating === "add" ? "Create Role" : "Edit Role"}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <div className="relative h-full w-full px-6 flex flex-col gap-4 py-3">
            <div className="w-full">
              <div className="mb-1">
                <label htmlFor="roleName" className="text-gray-900 text-md font-normal">
                  Role Name
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <Input
                className="text-sm"
                variant={"default"}
                placeholder="Role Name"
                value={roleName}
                onChange={handleRoleName}
              />
              {<p className="text-red-500 text-xs mt-1">{errors.roleName}</p>}
            </div>

            <div className="w-full">
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
                <label className="text-gray-900 text-md font-normal">
                  Module & permission
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              {modulePermissions.map(item => (
                <div key={item.id} className="flex flex-col mb-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="w-full sm:full md:w-60 lg:w-60 flex flex-col">
                      <SelectLabel
                        optionTextStyle="text-sm"
                        buttonTextStyle="text-sm"
                        containerStyle="h-10"
                        placeholder="Select Module"
                        placeholderStyle="text-sm"
                        lblText=""
                        htmlFor=""
                        size="md"
                        options={getAvailableModule(
                          moduleOptions,
                          modulePermissions,
                          item.id
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                        value={
                          modulePermissions.find(role => role.id === item.id)?.module ||
                          undefined
                        }
                        onChange={selectedOption =>
                          handleModuleChange(selectedOption, item.id)
                        }
                      />
                      {
                        <p className="text-red-500 text-xs mt-1">
                          {errors[item.id]?.module}
                        </p>
                      }
                    </div>
                    <div className="w-full sm:full md:w-96 lg:w-[440px] flex flex-col mt-1">
                      <MultiSelect
                        className="text-sm"
                        placeholder="Select Permission"
                        values={item.permission}
                        options={(
                          moduleOptions.find(
                            module => module.value === item.module?.value
                          )?.permissions || []
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                        onChangeCb={selectedOptions =>
                          handlePermissionChange(selectedOptions, item.id)
                        }
                      />
                      {
                        <p className="text-red-500 text-xs mt-1">
                          {errors[item.id]?.permission}
                        </p>
                      }
                    </div>
                    <div className="flex justify-center mt-1 flex-wrap sm:flex sm:justify-center md:w-auto lg:w-auto items-center gap-3 w-full">
                      {item.id ===
                        modulePermissions[modulePermissions.length - 1]?.id && (
                        <button
                          type="button"
                          className="border border-green-500 w-28 h-9 rounded text-green-500 sm:border sm:border-green-500 sm:rounded sm:w-28 sm:h-9 md:w-auto md:border-none lg:w-6 lg:border-none text-sm font-medium flex justify-center items-center"
                          onClick={handleAddSection}
                        >
                          <span className="sm:inline md:hidden lg:hidden">Add</span>
                          <PlusCircleIcon className="hidden sm:hidden md:inline lg:inline w-6 h-6" />
                        </button>
                      )}
                      {modulePermissions.length > 1 && (
                        <button
                          type="button"
                          className="border border-red-500 w-28 h-9 rounded text-red-500 sm:border sm:border-red-500 sm:rounded sm:w-28 sm:h-9 md:w-auto md:border-none lg:w-6 lg:border-none text-sm font-medium flex justify-center items-center"
                          onClick={() => handleRemoveSection(item.id)}
                        >
                          <span className="sm:inline md:hidden lg:hidden">Remove</span>
                          <MinusCircleIcon className="hidden sm:hidden md:inline lg:inline w-6 h-6" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                    console.log("Role Form Id: ", id, active);
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
