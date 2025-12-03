import type { ButtonProps } from "./types";

export function Button(props: ButtonProps) {
  return (
    <div>
      <button
        type={props.type}
        className={`rounded-md bg-${props.colour}-600 px-2.5 py-1.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-${props.colour}-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-${props.colour}-600`}
      >
        {props.add && <span> + </span>}
        {props.label}
      </button>
    </div>
  );
}
