import { RadioOption } from "./types"

export const dynamicOptions: RadioOption[] =   [
    {
      value: "option1",
      label: "Male",
      disabled: false,
      description: "Save my login details for next time",
    },
    {
      value: "option2",
      label: "Female",
      disabled: false,
      description: "Save my login details for next time",
    },
    {
      value: "option3",
      label: "Others",
      disabled: false,
      description: "Save my login details for next time",
    },
  ]

  export const dynamicOptionsDisabled : RadioOption[] = [
    {
      value: "option1",
      label: "Male",
      disabled: true,
      description: "Save my login details for next time",
    },
    {
      value: "option2",
      label: "Female",
      disabled: true,
      description: "Save my login details for next time",
    },
    {
      value: "option3",
      label: "Others",
      disabled: false,
      description: "Save my login details for next time",
    },
  ]