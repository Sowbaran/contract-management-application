import type { MultiTextRowProps } from "./types";

export function MultiTextRow(props: MultiTextRowProps) {

  
  const { register, formState } = props.formConfig || {}

  const { errors } = formState || {};

  const errorMessage = errors ? errors[props.id || ""]?.message : "";
  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-2 pb-4">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {props.name}
        {props.required && <span style={{ color: "red" }}>*</span>}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0 sm:max-w-2xl">
        <textarea
          {...register?.(props.id || "unknown", {required:  props.required ? "field required" : false} )}
          id={props.name}
          rows={props.rows ? props.rows : 3}
          className="block flex-1 w-full rounded-md border-0 py-1.5 text-gray-900 pr-1 pl-2 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder={props.placeHolder}
          defaultValue={""}
        />
        {
          typeof errorMessage === 'string' && <p className='block text-red-400 m-1 text-sm'>{errorMessage}</p>
        }
      </div>
    </div>
  );
}
