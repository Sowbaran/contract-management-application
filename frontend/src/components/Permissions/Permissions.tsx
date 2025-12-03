import type { PermissionsProps } from "./types";
import Lottie from "lottie-react";
import PermissionDenied from "../../assets/animations/permission-denied.json";
import { useAuthStore } from "../../store";

export function Permissions(props: PermissionsProps) {
  const { permission, children, type } = props;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const permissions = useAuthStore((state: { permissions: any }) => state.permissions);
  // console.log(permissions);
  // console.log(permission);
  if(type && type === "button"){
    if (!permissions || !permissions.includes(permission)) {
      return ("");
    }
  } else{
    if (!permissions || !permissions.includes(permission)) {
      return (
        <div className="flex flex-col justify-center items-center h-screen">
          <Lottie animationData={PermissionDenied} style={{ height: 250 }} />
          <p className="text-8xl font-bold text-gray-400 align-middle">403</p>
          <p className="text-5xl font-semibold text-gray-400 align-middle">
            Forbidden Access
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
}
