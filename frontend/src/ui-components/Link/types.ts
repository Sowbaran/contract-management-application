import type React from "react";

export type LinkProps = {
  href: string;
} & React.ComponentPropsWithoutRef<"a">;
