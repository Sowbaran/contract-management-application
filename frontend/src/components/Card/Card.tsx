import type { CardProps } from "./types";

export function Card(props: CardProps) {
  return (
    <div
      className="px-0 ps-0 shadow-sm border rounded-lg bg-white border-white-200"
      key={`${Date.now()}`}
    >
      <div className="container px-0 py-2">
        <div className="py-1 flex items-center justify-between">
          <h3 className="ps-6 text-lg font-medium leading-4 text-gray-900">
            {props.title}
          </h3>
          {props.headerButton && (
            <button
              type="button"
              className="flex justify-center download-btn rounded-md bg-gray-600 px-4 py-1 text-md font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
              onClick={props.onClick}
            >
              History
            </button>
          )}
        </div>
        <div className="w-full border-t border-gray-300 my-2" />
        <div className="mt-2 ps-3">{props.children}</div>
      </div>
    </div>
  );
}
