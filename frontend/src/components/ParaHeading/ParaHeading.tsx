import type { ParaHeadingProps } from "./types";

export function ParaHeading(props: ParaHeadingProps) {
  return (
    <div className="mt-10 space-y-12 border-gray-900/10 pb-8 sm:space-y-0  sm:divide-gray-900/10 sm:border-t sm:pb-4 sm:pt-4">
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        {props.name}
      </h2>
    </div>
  );
}
