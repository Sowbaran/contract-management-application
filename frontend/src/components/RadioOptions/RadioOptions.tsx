import type { RadioOptionsProps } from "./types";

export function RadioOptions(props: RadioOptionsProps) {

  const { register, formState } = props.formConfig || {};

  const { errors } = formState || {}

  const errorMessage = errors ? errors[props.id || ""]?.message : "";

  return (
    <div>
      <fieldset>
        <div className="sm:grid sm:grid-cols-3 sm:items-baseline sm:gap-4 sm:py-4 pb-4">
          <div
            className="text-sm font-medium leading-6 text-gray-900"
            aria-hidden="true"
          >
            {props.name}
            {props.required && <span style={{ color: "red" }}>*</span>}
          </div>
          <div className="mt-1 sm:col-span-2 sm:mt-0">
            <div className="max-w-lg">
              <div className="mt-6 space-y-2">
                {props.options.map((option) => (
                  <div className="flex items-center gap-x-3" key={option.id}>
                    <input
                      id={option.id}
                      value={option.text}
                      {...register?.(props.id || "unknown",  { required: props.required ? "Please select an option" : false })}
                      type="radio"
                      className="h-3 w-3 border-gray-300 text-gray-900 focus:ring-green-600"
                      // disabled = {props.disable se}
                    />
                    <label
                      htmlFor="push-everything"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      {option.text}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            {
              typeof errorMessage === 'string' && <p className='block text-red-400 m-1 text-sm'>{errorMessage}</p>
            }
          </div>
        </div>
      </fieldset>

    </div>
  );
}
