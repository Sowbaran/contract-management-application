export interface UserPermissions {
  permissions: string[];
}

export interface SidebarChildItem {
  name: string;
  href?: string;
  icon: React.ReactNode;
  permissions?: string[];
  children?: SidebarChildItem[];
}

export interface SidebarItem {
  name: string;
  href?: string;
  icon: JSX.Element;
  permissions?: string[];
  type: string;
  subMenuList?: SidebarItem[];
  children?: SidebarItem[];
  code?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  userPermissions: string[];
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userName?: string | null | undefined;
  handleShow: () => void;
  handleLogoutPopup: () => void;
  handleKeyPress: (
    event:
      | React.KeyboardEvent<HTMLDivElement>
      | React.KeyboardEvent<HTMLButtonElement>
  ) => void;
}
