import { Controller } from "react-hook-form";
import type { MultiSelectProps } from "./types";
// import { useSelectStore } from "../../store";
import Select from 'react-select';
import { useEffect, useState } from "react";

export function MultiSelect(props: MultiSelectProps) {
  const { control, formState } = props.formConfig || {};
  const { errors } = formState || {};
  const errorMessage = errors ? errors[props.id || ""]?.message : "";

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [selectedOptions, setSelectedOptions] = useState<any>([]);

  useEffect(() => {
    if (props.defaultValues && props.options) {
      const selected = props.options.filter(option =>
        props.defaultValues?.some(item => item.value === option.value)
      );
      setSelectedOptions(selected);
    }
  }, [props.defaultValues, props.options]);

  return (
    <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4 sm:text-sm pb-4">
 <label className="text-gray-900 block text-sm font-medium leading-6 sm:pt-1.5">
       {props.name}
       {props.required && <span style={{ color: 'red' }}>*</span>}
     </label>
      <div className="max-w-[450px] mt-2 sm:col-span-2 sm:mt-0">
        <Controller
          name={props.id}
          control={control}
          rules={{ required: props.required ? "Select a valid option" : false }}
          render={({ field }) => {
            return(<Select
              isMulti
              options={props.options}
              placeholder={props.placeholder}
              isDisabled={false}
              value={selectedOptions}
              onChange={(selectedOptions) => {
                setSelectedOptions(selectedOptions);
                field.onChange(selectedOptions.filter(option => option?.value));
              }}
            />)
          }}
        />
        {typeof errorMessage === 'string' && (
          <p className="block text-red-400 m-1 text-sm">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}


// return (
//   <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-4 sm:text-sm pb-4">
//     <label className="text-gray-900 block text-sm font-medium leading-6 sm:pt-1.5">
//       {props.name}
//       {props.required && <span style={{ color: 'red' }}>*</span>}
//     </label>
//     <div className="max-w-[450px] mt-2 sm:col-span-2 sm:mt-0">
//       <Select
//       options={props.options}
//       isMulti
//       >
//       </Select>
    
//       {typeof errorMessage === 'string' && (
//         <p className="block text-red-400 m-1 text-sm">{errorMessage}</p>
//       )}
//     </div>
//   </div>
// );

