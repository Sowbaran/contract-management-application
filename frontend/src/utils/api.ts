import axios, { AxiosError } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import {
  PermissionApiResponse,
  ListApiResponse,
  MenuAccessResponse,
  FormDetails,
  FormResponse,
  DropDownApiResponse,
  DetailApiResponse,
  EditFormDetails,
  ListConfigApiResponse,
  SettingApiResponse,
} from "./types";
import { useAuthStore } from "../store";

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const apiUri = import.meta.env["VITE_API_URL"];

// Auth0 token management - we'll need to handle this differently
// since useAuth0 hook can't be used outside React components
let auth0Instance: any = null;

export const setAuth0Instance = (instance: any) => {
  auth0Instance = instance;
};

const getToken = async (): Promise<string> => {
  if (!auth0Instance) {
    throw new Error("Auth0 instance not initialized");
  }

  const { getAccessTokenSilently, user } = auth0Instance;

  const accessToken = await getAccessTokenSilently({
    authorizationParams: {
      scope: "read:current_user",
    },
  });

  useAuthStore.setState((state) => ({
    ...state,
    emailId: user?.email,
    name: user?.name,
    accessToken: accessToken,
  }));

  let params = `users/permission/user-meta?emailId=${user?.email}`;
  // biome-ignore lint/complexity/useLiteralKeys: <explanation>
  const environment = import.meta.env["VITE_APP_ENVIRONMENT"];
  if (environment === "dev" || environment === "development") {
    const selectedUser = localStorage.getItem("selectedUser");
    if (selectedUser) {
      const parts = selectedUser.split("-");
      params = `users/permission/user-meta?emailId=${parts[0]}`;
    }
  }

  const fetchApiResponse = await getApiDetails(params);
  useAuthStore.setState((state) => ({
    ...state,
    permissions: fetchApiResponse?.data.permissions,
    departments: fetchApiResponse?.data.department,
    roles: fetchApiResponse?.data.roles
  }));

  return accessToken;
};

const axiosApi = axios.create({
  baseURL: apiUri,
});

//intersector to include access token.
axiosApi.interceptors.request.use(
  async (config) => {
    let accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      accessToken = await getToken();
    }
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// global error response for axios call
axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      console.log("global error response for axios call");
      window.location.href = "/logout";
    }
    return Promise.reject(error);
  }
);

export const fetchSideBarMenuDetails = async (
  emailId: string
): Promise<MenuAccessResponse> => {
  const response = await axiosApi.get<MenuAccessResponse>(
    `${apiUri}/screen-access/${emailId}`
  );
  return response.data;
};

export const checkScreenPermission = async (
  emailId: string,
  screenType: string
) => {
  const response = await axiosApi.get<{ data: PermissionApiResponse[] }>(
    `${apiUri}/screen-access/screen-details/permission/${emailId}/${screenType}`
  );
  return response.data;
};

export  const fetchList = async (apiPath: string ) => {
  const response = await axiosApi.get<ListApiResponse>(`${apiUri}/${apiPath}`);
  return response.data;
};

export  const submitFilter = async (apiPath: string , payload?: {department:string[] , status:string[] ,workflow:string[],start:string, end:string} ) => {
  const response = await axiosApi.post<ListApiResponse>(`${apiUri}/${apiPath}` , {...payload});
  return response.data;
};

export const dropDownList = async (apiPath: string) => {
  const response = await axiosApi.get<DropDownApiResponse>(`${apiUri}/${apiPath}`);
  return response.data;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fetchFilter = async (apiPath: string) : Promise<any> => {
  const response = await axiosApi.get(`${apiUri}/${apiPath}`);
  return response.data;
};

export const detailList = async (apiPath: string) => {
  const response = await axiosApi.get<DetailApiResponse>(`${apiUri}/${apiPath}`);
  return response.data;
};

export const fetchConfigList = async (apiPath: string) => {
  const response = await axiosApi.get<ListConfigApiResponse>(`${apiUri}/${apiPath}`);
  return response.data;
};

export const fetchOneForm = async (formId: string): Promise<FormDetails> => {
  const endpoint = `${apiUri}/${formId}`;
  try {
    // Make the API request using axiosGet
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const response = await axiosApi.get<any>(endpoint);

    // Return the relevant data from the response
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching Event Details data ${error}`);
  }
};

export const submitForm = async (
  formDetails: FormDetails
): Promise<FormResponse> => {
  const payload = {
    ...formDetails,
  };
  const response = await axiosApi.post(`${apiUri}/form-details`, payload, {});
  const data: FormResponse = response.data;
  return data;
};

export const reSubmitForm = async (formDetails: EditFormDetails): Promise<FormResponse> => {
  const payload = {
    ...formDetails,
  };
  const response = await axiosApi.post(`${apiUri}/form-approval/form-resubmit`, payload, {});
  const data: FormResponse = response.data;
  return data;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const formStatusApproval = async (formDetails: any, baseUrl: string): Promise<any> => {
  const payload = {
    ...formDetails,
  };
  const response = await axiosApi.post(`${apiUri}/${baseUrl}`, payload, {});
  const data = response.data;
  return data;
};

export const handleErrorResponse = (error: AxiosError) => {
  if (error.response && error.response.status === 401) {
    console.log("handleErrorResponse");
    // Logout logic: Navigate user to the /logout route
    window.location.href = "/logout";
  } else {
    // For other errors, throw the error to be handled by the caller
    throw error.response ? error.response : error.message;
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const uploadFile = async (baseUrl: string, file: File): Promise<any> => {
  let accessToken = useAuthStore.getState().accessToken;
  if (!accessToken) {
    accessToken = await getToken();
  }
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await axios.post(`${apiUri}/${baseUrl}`, formData,  {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const getApiDetails = async (apiPath: string) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const response = await axiosApi.get<any>(`${apiUri}/${apiPath}`);
  return response.data;
};

export const settingsGetList = async (apiPath: string) => {
  const response = await axiosApi.get<SettingApiResponse>(`${apiUri}/${apiPath}`);
  return response.data;
};


// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const updatePutAPI = async (formDetails: any, baseUrl: string): Promise<any> => {
  const payload = {
    ...formDetails,
  };
  const response = await axiosApi.put(`${apiUri}/${baseUrl}`, payload, {});
  const data = response.data;
  return data;
};


export const permissionGetList = async (apiPath: string) => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const response = await axiosApi.get<any>(`${apiUri}/${apiPath}`);
  return response.data;
};

export const getSignedUrl = async (apiPath: string) => {
  try {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const response = await axiosApi.get<any>(`${apiUri}/${apiPath}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching signed URL:", error);
    throw error;
  }
};

export const uploadFileToS3 = async (signedUrl: string, file: File) => {
  try {
    await axios.put(signedUrl, file, {
      headers: {
        "Content-Type": file.type
      }
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};