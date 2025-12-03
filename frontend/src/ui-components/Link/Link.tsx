import * as Headless from "@headlessui/react";
import { forwardRef } from "react";
import type { LinkProps } from "./types";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(props, ref) {
  return (
    <Headless.DataInteractive>
      <a {...props} ref={ref} />
    </Headless.DataInteractive>
  );
});
