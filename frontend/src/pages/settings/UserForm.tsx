import { Button, Drawer, Input, MultiSelect } from "@ui-components";
import { useEffect, useState } from "react";
import {
  useCreateUser,
  useGetAllUserDepartments,
  useGetUserById,
  useUpdateUser
} from "../../api/backend/backendComponents";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { v4 as uuidv4 } from "uuid";
import { UserResponseDto } from "../../api/backend/backendSchemas";
import { SwitchLabel } from "../../layouts/SwitchLabel/SwitchLabel";
import { AnyProp } from "../../common/types";
import { AlertProps } from "@ui-components/Alert/types";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ErrorIcon, SuccessIcon } from "../../utils/CommonIcons";
import { SelectLabel } from "../../layouts/SelectLabel/SelectLabel";

export type UserFormProps = {
  open: boolean;
  isCreating: string;
  setOpen: (val: boolean) => void;
  selectedRowId: string;
};

interface DepartmentRole {
  id: string; // Unique identifier
  department: { value: string; label: string } | null; // Department details
  roles: { value: string; label: string }[]; // Roles details
}

export const UserForm = ({ open, isCreating, setOpen, selectedRowId }: UserFormProps) => {
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [departmentOptions, setDepartmentOptions] = useState<
    { value: string; label: string; roles: AnyProp[] }[]
  >([]);
  const [userName, setUserName] = useState("");
  const [inputEmailId, setInputEmailId] = useState("");
  const [departmentRoles, setDepartmentRoles] = useState<DepartmentRole[]>([
    {
      department: null,
      roles: [],
      id: uuidv4()
    }
  ]);
  const [activeStatus, setActiveStatus] = useState<boolean>(false);
  const [alertInfo, setAlertInfo] = useState<AlertProps>();
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AnyProp>({});
  const newErrors: AnyProp = {};

  const { data: userDetails } = useGetUserById(
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
    setUserName("");
    setInputEmailId("");
    setDepartmentRoles([
      {
        department: null,
        roles: [],
        id: ""
      }
    ]);
    setActiveStatus(false);
    setErrors({});
    if (isCreating === "edit" && userDetails) {
      setUserName(userDetails?.data.name ? userDetails?.data.name : "");
      setInputEmailId(userDetails?.data.email ? userDetails?.data.email : "");
      const transformResponse = (response: UserResponseDto): DepartmentRole[] => {
        return response.departments.map(department => ({
          id: uuidv4(),
          department: { value: department._id.toString(), label: department.name },
          roles: department.roles.map(role => ({
            value: role._id.toString(),
            label: role.name
          }))
        }));
      };
      const transformedResponse = transformResponse(userDetails?.data);
      setDepartmentRoles(transformedResponse);
      console.log(`transformedResponse.length: ${transformedResponse.length}`);
      if (transformedResponse.length === 0) {
        setDepartmentRoles([
          {
            department: null,
            roles: [],
            id: uuidv4()
          }
        ]);
      }
      setActiveStatus(userDetails.data.status ? true : false);
    }
  }, [isCreating, userDetails, open]);

  const { data: departmentList } = useGetAllUserDepartments(
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
    if (departmentList?.data) {
      const options = departmentList.data.map((department: AnyProp) => ({
        value: department._id,
        label: department.name,
        roles: department.roles.map((role: { _id: AnyProp; name: AnyProp }) => ({
          value: role._id,
          label: role.name
        }))
      }));
      setDepartmentOptions(options);
    }
  }, [departmentList]);

  const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);

    // Dynamically validate and update errors
    if (value.trim() === "") {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        userName: "User Name field is required"
      }));
    } else {
      setErrors((prevErrors: AnyProp) => ({
        ...prevErrors,
        userName: value.trim() === "" ? "User Name field is required" : undefined
      }));
    }
  };

  const handleEmailId = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputEmailId(value);

    // Regular expression for validating email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setErrors((prevErrors: any) => {
      if (value.trim() === "") {
        return {
          ...prevErrors,
          inputEmailId: "Email Id field is required"
        };
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else if (!emailRegex.test(value.trim())) {
        return {
          ...prevErrors,
          inputEmailId: "Please enter a valid email id"
        };
        // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        return {
          ...prevErrors,
          inputEmailId: undefined // No error if valid
        };
      }
    });
  };

  const handleDepartmentChange = (selectedOption: AnyProp, id: string) => {
    setDepartmentRoles(prev =>
      prev.map(item =>
        item.id === id ? { ...item, department: selectedOption, roles: [] } : item
      )
    );

    // Dynamically validate and update errors
    setErrors((prevErrors: { [x: string]: AnyProp }) => ({
      ...prevErrors,
      [id]: {
        ...prevErrors[id],
        department: selectedOption ? undefined : "Department field is required"
      }
    }));
  };

  const getAvailableDepartments = (
    allOptions: { value: string; label: string }[],
    departmentRoles: {
      id: string;
      department: { value: string; label: string } | null;
    }[],
    currentId: string
  ) => {
    const selectedValues = departmentRoles
      .filter(item => item.id !== currentId)
      .map(item => item.department?.value);

    // Filter out options that are already selected
    return allOptions.filter(option => !selectedValues.includes(option.value));
  };

  const handleRoleChange = (selectedOptions: AnyProp, id: string) => {
    setDepartmentRoles(prev =>
      prev.map(item => (item.id === id ? { ...item, roles: selectedOptions } : item))
    );

    // Dynamically validate and update errors
    setErrors((prevErrors: { [x: string]: AnyProp }) => ({
      ...prevErrors,
      [id]: {
        ...prevErrors[id],
        roles: selectedOptions.length > 0 ? undefined : "Role field is required"
      }
    }));
  };

  const handleAddSection = () => {
    setDepartmentRoles([
      ...departmentRoles,
      {
        department: null,
        roles: [],
        id: uuidv4()
      }
    ]);
  };

  const handleRemoveSection = (id: string) => {
    setDepartmentRoles(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = () => {
    if (userName.trim() === "") {
      newErrors.userName = "User Name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!inputEmailId.trim()) {
      newErrors.inputEmailId = "Email ID is required";
    } else if (!emailRegex.test(inputEmailId.trim())) {
      newErrors.inputEmailId = "Please enter a valid email id";
    }

    // biome-ignore lint/complexity/noForEach: <explanation>
    departmentRoles.forEach(selected => {
      const roleErrors: { department?: string; roles?: string } = {};

      if (!selected.department) {
        roleErrors.department = "Department field is required";
      }

      if (selected.roles.length === 0) {
        roleErrors.roles = "Role field is required";
      }

      if (Object.keys(roleErrors).length > 0) {
        newErrors[selected.id] = roleErrors; // Add errors for this id
      }
    });
    setErrors(newErrors);

    // Check if there are any errors before logging
    if (Object.keys(newErrors).length === 0) {
      const formData = {
        menuModuleId: selectedModule?._id,
        name: userName,
        email: inputEmailId,
        departments: departmentRoles.map(role => ({
          _id: role.department?.value,
          roles: role.roles.map(r => r.value)
        })),
        status: isCreating === "add" ? true : activeStatus,
        createdBy: emailId ? emailId : "",
        updatedBy: emailId ? emailId : ""
      };

      setIsLoading(true);

      if (isCreating === "add") {
        createUserFormData({
          body: { ...formData } as AnyProp,
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
      } else {
        updateUserFormData({
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

  const { mutate: createUserFormData } = useCreateUser({
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
      console.error("createUserFormData error: ", error);
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

  const { mutate: updateUserFormData } = useUpdateUser({
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
      console.error("updateUserFormData update error: ", error);
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
      setUserName("");
      setInputEmailId("");
      setDepartmentRoles([
        {
          department: null,
          roles: [],
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
              {isCreating === "add" ? "Create User" : "Edit User"}
            </label>
          </>
        }
        mainContentStyle="overflow-y-auto"
        mainContent={
          <div className="relative h-full w-full px-6 flex flex-col gap-4 py-3">
            <div className="w-full">
              <div className="mb-1">
                <label htmlFor="userName" className="text-gray-900 text-md font-normal">
                  User Name
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <Input
                className="text-sm w-full"
                variant={"default"}
                placeholder="Name"
                value={userName}
                onChange={handleUserName}
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
              )}
            </div>

            <div className="w-full">
              <div className="mb-1">
                <label htmlFor="emailId" className="text-gray-900 text-md font-normal">
                  Email Id
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>
              <Input
                className="text-sm w-full"
                variant={"default"}
                placeholder="Email ID"
                value={inputEmailId}
                onChange={handleEmailId}
              />
              {errors.inputEmailId && (
                <p className="text-red-500 text-xs mt-1">{errors.inputEmailId}</p>
              )}
            </div>

            <div>
              <div className="mb-1">
                <label className="text-gray-900 text-md font-normal">
                  Department & Role
                </label>
                <label className="text-red-500 ml-1">*</label>
              </div>

              {departmentRoles.map(item => (
                <div key={item.id} className="flex flex-col mb-4">
                  <div className="flex flex-wrap items-start gap-4">
                    <div className="w-full sm:full md:w-60 lg:w-60 flex flex-col">
                      <SelectLabel
                        optionTextStyle="text-sm"
                        buttonTextStyle="text-sm"
                        containerStyle="h-10"
                        placeholder="Select Department"
                        placeholderStyle="text-sm"
                        lblText=""
                        htmlFor=""
                        size="md"
                        options={getAvailableDepartments(
                          departmentOptions,
                          departmentRoles,
                          item.id
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                        value={
                          departmentRoles.find(role => role.id === item.id)?.department ||
                          undefined
                        }
                        onChange={selectedOption =>
                          handleDepartmentChange(selectedOption, item.id)
                        }
                      />
                      {errors[item.id]?.department && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[item.id]?.department}
                        </p>
                      )}
                    </div>

                    <div className="w-full sm:full md:w-96 lg:w-[440px] flex flex-col mt-1">
                      <MultiSelect
                        className="text-sm"
                        placeholder="Select Role"
                        values={item.roles}
                        options={(
                          departmentOptions.find(
                            department => department.value === item.department?.value
                          )?.roles || []
                        ).sort((a, b) => a.label.localeCompare(b.label))}
                        onChangeCb={selectedOptions =>
                          handleRoleChange(selectedOptions, item.id)
                        }
                      />
                      {errors[item.id]?.roles && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors[item.id]?.roles}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-center flex-wrap sm:flex sm:justify-center md:w-auto lg:w-auto items-center gap-3 w-full mt-1">
                      {item.id === departmentRoles[departmentRoles.length - 1]?.id && (
                        <button
                          type="button"
                          className="border border-green-500 w-28 h-9 rounded text-green-500 sm:border sm:border-green-500 sm:rounded sm:w-28 sm:h-9 md:w-auto md:border-none lg:w-6 lg:border-none text-sm font-medium flex justify-center items-center"
                          onClick={handleAddSection}
                        >
                          <span className="sm:inline md:hidden lg:hidden">Add</span>
                          <PlusCircleIcon className="hidden sm:hidden md:inline lg:inline w-6 h-6" />
                        </button>
                      )}

                      {departmentRoles.length > 1 && (
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
              {isCreating !== "add" && (
                <SwitchLabel
                  labelProps={{
                    lblColor: "slate",
                    lblSize: "md",
                    className: "w-auto"
                  }}
                  lblText="Status"
                  switchLabel={activeStatus ? "Active" : "In-Active"}
                  active={activeStatus}
                  switchContainerStyle=""
                  switchLabelStyle="text-md"
                  onChange={(id, active) => {
                    console.log("User Form Id: ", id, active);
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
              //variant="outline"
              className="w-full sm:w-auto px-4 py-1 cursor-pointer text-sm font-semibold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white me-3"
              size="sm"
              label="Cancel"
              onClick={handleCancel}
            />
            <Button
              //variant="primary"
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
