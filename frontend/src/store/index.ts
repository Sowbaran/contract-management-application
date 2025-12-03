import { create } from "zustand";
import { TabPropExtended, UserData, UserModule } from "../common/types";
import { TabProp } from "@ui-components/Tabs/types";
import { FormsTabConst } from "../constants/formConstants";

interface AuthStore {
  emailId: string | null;
  name: string | null;
  accessToken: string | null;
  idToken: string | null;
  permissions: string[] | null;
  departments: string[] | null;
  roles: string[] | null;
  modules: string[] | null;
  setEmailId: (emailId: string | null) => void;
  setName: (name: string | null) => void;
  setAccessToken: (accessToken: string | null) => void;
  setIdToken: (idToken: string | null) => void;
  setPermissions: (permissions: string[] | null) => void;
  setDepartments: (departments: string[] | null) => void;
  setRoles: (roles: string[] | null) => void;
  setModules: (modules: string[] | null) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  emailId: null,
  setEmailId: (emailId: string | null) => set({ emailId }),
  name: null,
  setName: (name: string | null) => set({ name }),
  accessToken: null,
  setAccessToken: (accessToken: string | null) => set({ accessToken }),
  idToken: null,
  setIdToken: (idToken: string | null) => set({ idToken }),
  permissions: [],
  setPermissions: (permissions: string[] | null) => set({ permissions }),
  departments: null,
  setDepartments: (departments: string[] | null) => set({ departments }),
  roles: null,
  setRoles: (roles: string[] | null) => set({ roles }),
  modules: null,
  setModules: (modules: string[] | null) => set({ modules })
}));

interface SelectState {
  selections: { [key: string]: string };
  setSelection: (name: string, value: string) => void;
}

export const useSelectStore = create<SelectState>(set => ({
  selections: {},
  setSelection: (name, value) =>
    set(state => ({
      selections: { ...state.selections, [name]: value }
    }))
}));

interface UserDetailStore {
  data: UserData;
  setUserData: (data: UserData) => void;
}

export const useUserDetailsStore = create<UserDetailStore>(set => ({
  data: {} as UserData,
  setUserData: (data: UserData) => {
    set({ data });
  }
}));

interface SelectedModuleStore {
  moduleStore: UserModule;
  setModuleStore: (module: UserModule) => void;
}

export const useSelectedModuleStore = create<SelectedModuleStore>(set => ({
  moduleStore: {} as UserModule,
  setModuleStore: (moduleStore: UserModule) => set({ moduleStore })
}));

interface SelectedModuleTabStore {
  moduleTabStore: TabProp;
  setModuleTabStore: (moduleTabStore: TabProp) => void;
}

export const useSelectedModuleTabStore = create<SelectedModuleTabStore>(set => ({
  moduleTabStore: { id: "", name: "" } as TabProp,
  setModuleTabStore: (moduleTabStore: TabProp) => set({ moduleTabStore })
}));

interface FormTabStore {
  formTabStore : TabPropExtended,
  setFormTab : (requestId:TabPropExtended) => void
}

export const useFormTabStore = create<FormTabStore>(set => ({
  formTabStore : FormsTabConst[0] || {id:"" , name:""},
  setFormTab: (formTabStore : TabPropExtended) => set({formTabStore})
}))
