import { TabProp } from "@ui-components/Tabs/types";

export type FunctionComponent = React.ReactElement | null;

type HeroIconSVGProps = React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> &
  React.RefAttributes<SVGSVGElement>;
type IconProps = HeroIconSVGProps & {
  title?: string;
  titleId?: string;
};
export type Heroicon = React.FC<IconProps>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export  type AnyProp = any


export interface UserRole {
  _id: string;
  name: string;
  code: string;
  status: boolean;
}

export interface UserModule {
  _id: string;
  name: string;
  code: string;
  status: boolean;
  permissions: string[];
}

export interface UserData {
  username: string;
  email: string;
  roles: UserRole[];
  modules: UserModule[];
}

export interface ModuleApiResponse {
  message?: string;
  data: UserData;
}

export type MenuOption = {
 id : string | number,
 label : string,
 data?:AnyProp
}

export type TabPropExtended = TabProp & {
  type? : string,
  href?:string,
}

// export interface HeaderProps extends React.BaseHTMLAttributes<HTMLDivElement> {
//   modules?: { id: string; label: string }[];
// }
