import type { DialogBoxWithCommentsProps } from "./types";
import { Fragment, useState } from "react";
import { Dialog, DialogPanel, Transition } from "@headlessui/react";
import { useNavigate } from "@tanstack/react-router";
import { useHeadcountFormApproval } from "../../api/backend/backendComponents";
import { AnyProp } from "../../common/types";
import { useAuthStore } from "../../store";

interface FormInfo {
  [key: string]: AnyProp;
}

export function DialogBoxWithComments({
  isOpen,
  title,
  btnText,
  moduleId,
  emailId,
  formId,
  status,
  redirectUrl,
  onClose,
  onOpenDialog,
  pncHeadFlag
}: DialogBoxWithCommentsProps) {
  const [formInfo, setFormInfo] = useState<FormInfo>({
    finance_partner_name: "",
    clear_acceptable: "",
    tax_required: "",
    insurance_required: "",
    within_budget: "",
    expenditure: "",
    commission: "",
    comments: "",
    isHeadOfPnCFinalApprover: false
  });

  const [errors, setErrors] = useState({
    finance_partner_name: "",
    clear_acceptable: "",
    tax_required: "",
    insurance_required: "",
    within_budget: "",
    expenditure: "",
    commission: "",
    comments: "",
    isHeadOfPnCFinalApprover: ""
  });
  const [isSaveBtnLoading, setIsSaveBtnLoading] = useState<boolean>(false);
  const { accessToken } = useAuthStore();

  const pathParts = window.location.pathname.split("/");
  console.log(pathParts);
  let mailRedirectPath = `/headcount/requests/detail/${formId}?page=approveRequest&moduleId=${moduleId}`;
  if (btnText === "reject") {
    mailRedirectPath = `/headcount/requests/detail/${formId}?page=myRequest&moduleId=${moduleId}`;
  }

  const navigate = useNavigate({ from: "/contract/forms" });
  const handleOnCancel = () => {
    onClose();
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormInfo(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleCheckBoxChange = (event: {
    target: { name: AnyProp; type: AnyProp; checked: AnyProp; value: AnyProp };
  }) => {
    const { name, type, checked, value } = event.target;
    setFormInfo(prevFormInfo => ({
      ...prevFormInfo,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e: AnyProp) => {
    e.preventDefault();
    console.log(formInfo);
    const errorsCopy = { ...errors };
    if (btnText === "reject" || btnText === "approvePnc") {
      // biome-ignore lint/complexity/useLiteralKeys: <explanation>
      if (formInfo["comments"] === "" || formInfo["comments"] === undefined) {
        errorsCopy.comments = "Comments field is required";
      } else {
        errorsCopy.comments = "";
      }
    }
    setErrors(errorsCopy);
    // Check if there are any errors
    if (Object.values(errorsCopy).every(error => error === "")) {
      const body = {
        moduleId: moduleId,
        emailId: emailId,
        formId: formId,
        status: status,
        comments: "",
        formAdditionalInfo: {},
        isAdditionalAccess: false,
        mailRedirectPath: mailRedirectPath,
        isHeadOfPnCFinalApprover: false
      };
      if (btnText === "reject" || btnText === "approvePnc") {
        // biome-ignore lint/complexity/useLiteralKeys: <explanation>
        body.comments = formInfo["comments"];
        if (pncHeadFlag) {
          // biome-ignore lint/complexity/useLiteralKeys: <explanation>
          body.isHeadOfPnCFinalApprover = formInfo["isHeadOfPnCFinalApprover"];
        }
        body.formAdditionalInfo = {};
      } else {
        body.formAdditionalInfo = formInfo;
        body.isAdditionalAccess = true;
      }
      setIsSaveBtnLoading(true);
      console.log("🚀 ~ Form ~ Approve:", body);
      approveFormSubmit({
        body: { ...body } as AnyProp,
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: approveFormSubmit } = useHeadcountFormApproval({
    onSuccess: response => {
      const successMsg = response.message;
      console.log(`${successMsg} - Success - formStatusApproval: ${response}`);
      setIsSaveBtnLoading(false);
      onClose();
      const status = "success";
      if (onOpenDialog) {
        onOpenDialog(response, status);
      } else {
        navigate({ to: `${redirectUrl}` });
      }
      navigate({
        to: "/headcount/forms"
      });
    },
    onError: (error: AnyProp) => {
      console.log(error, "Error formStatusApproval");
      setIsSaveBtnLoading(false);
      onClose();
      const status = "error";
      if (onOpenDialog) {
        onOpenDialog(error, status);
      } else {
        navigate({ to: `${redirectUrl}` });
      }
    }
  });

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <DialogPanel className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="fixed inset-0 flex items-center justify-center">
            <Dialog.Panel className="px-4 pb-4 overflow-y-auto transition-all transform bg-white rounded-lg shadow-xl sm:max-w-2xl sm:w-full">
              <div>
                <div className="mt-3 sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-center text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500" />
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 p-4  rounded-md">
                    {btnText === "reject" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                        <label className="block text-sm font-medium text-gray-700">
                          Comments <span className="text-red-600">*</span>
                        </label>
                        <div className="mt-1 sm:col-span-2">
                          <textarea
                            rows={4}
                            placeholder="Reject reason"
                            name="comments"
                            // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                            value={formInfo["comments"]}
                            onChange={handleChange}
                            className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                              errors.comments ? "border-red-500" : ""
                            }`}
                          />
                          {errors.comments && (
                            <p className="mt-2 text-sm text-red-600">{errors.comments}</p>
                          )}
                        </div>
                      </div>
                    )}

                    {btnText === "approvePnc" && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                          <label className="block text-sm font-medium text-gray-700">
                            Comments <span className="text-red-600">*</span>
                          </label>
                          <div className="mt-1 sm:col-span-2">
                            <textarea
                              rows={4}
                              placeholder="Approval reason"
                              name="comments"
                              // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                              value={formInfo["comments"]}
                              onChange={handleChange}
                              className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                                errors.comments ? "border-red-500" : ""
                              }`}
                            />
                            {errors.comments && (
                              <p className="mt-2 text-sm text-red-600">
                                {errors.comments}
                              </p>
                            )}
                          </div>
                        </div>
                        {pncHeadFlag && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                            <div className="mt-1 sm:col-span-2 flex items-center space-x-2 justify-center">
                              <input
                                type="checkbox"
                                name="isHeadOfPnCFinalApprover"
                                id="isHeadOfPnCFinalApprover"
                                onChange={handleCheckBoxChange}
                                // biome-ignore lint/complexity/useLiteralKeys: <explanation>
                                checked={formInfo["isHeadOfPnCFinalApprover"]}
                                className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
                              />
                              <label
                                htmlFor="isHeadOfPnCFinalApprover"
                                className="block text-sm font-medium text-gray-700 flex-1"
                              >
                                The request is either for a new role or not within the
                                budget. Please tick the box if it has been consulted with
                                the CEO
                              </label>
                            </div>
                            {errors.isHeadOfPnCFinalApprover && (
                              <p className="mt-2 text-sm text-red-600 sm:col-span-3">
                                {errors.isHeadOfPnCFinalApprover}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3">
                      <button
                        type="button"
                        className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 bg-gray-200 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                        onClick={handleOnCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`inline-flex justify-center rounded-md ${
                          btnText === "reject" ? "bg-red-600" : "bg-green-600"
                        } px-4 py-2 text-sm font-semibold text-white shadow-sm ${
                          btnText === "reject" ? "hover:bg-red-500" : "hover:bg-green-500"
                        } focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                          btnText === "reject"
                            ? "focus-visible:outline-red-600"
                            : "focus-visible:outline-green-600"
                        }  ${isSaveBtnLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isSaveBtnLoading}
                      >
                        {isSaveBtnLoading
                          ? "Saving..."
                          : btnText === "approve" || btnText === "approvePnc"
                            ? "Approve"
                            : "Reject"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  );
}
