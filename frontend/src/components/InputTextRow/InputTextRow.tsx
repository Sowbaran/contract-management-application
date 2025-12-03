import type { InputTextRowProps } from "./types";

export const InputTextRow: React.FC<InputTextRowProps> = (props) => {
  const { register, formState } = props.formConfig || {};

  const { errors } = formState || {};

  const errorMessage = errors ? errors[props.id || ""]?.message : "";

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4 pb-4">
      <label
        htmlFor={props.name}
        className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
      >
        {props.name}
        {props.required && <span style={{ color: "red" }}>*</span>}
        <br />
        {props.labelList?.map((str, index) => 
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <p key={index}>{str}</p>
        )}
      </label>
      <div className="mt-2 sm:col-span-2 sm:mt-0">
        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-green-600 sm:max-w-md">
          <input
            {...register?.(props.id || "comp_id", {
              ...validationPatterns(props.id || "comp_id", ""),
            })}
            // {...validationPatterns(props.type, "Invalid format")}
            type={props.type ? props.type : "text"}
            id={props.id}
            autoComplete={props.name}
            className="block flex-1 border-0 ring-1 ring-inset ring-gray-300 rounded-md bg-white py-1.5 px-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 disabled:ring-gray-500  disabled:bg-gray-200 disabled:text-gray-500"
            placeholder={props.placeHolder}
            value={props.value}
            disabled={props.disable}
            min={props.type === "number" ? props.min : undefined }
            max={props.type === "number" ? props.max : undefined}
            onWheel={(e) => e.currentTarget.blur()} 
          />
        </div>
        {typeof errorMessage === "string" && (
          <p className="block text-red-400 m-1 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
};

const validationPatterns = (ipType: string, errorMsg: string) => {
  switch (ipType) {
    case "roleEmail":
      return {
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: errorMsg || "please enter a valid email",
        },
      };
    default:
      return {
        required: "field required",
      };
  }
};
