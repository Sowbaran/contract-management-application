import type { Meta, StoryObj } from "@storybook/react";

import { Alert } from ".";
import React, { useState } from "react";
import { AlertProps } from "./types";
import { Button } from "../Button";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { errorBtnActions } from "./data";
import { Input } from "../Input";
import { TextArea } from "../TextArea";
import { Label } from "../Label";

const meta = {
  title: "Design System/Components/Alert",
  component: Alert,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a Alert component`,
      },
    },
  },
} satisfies Meta<AlertProps>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template: React.FC<AlertProps> = ({ ...args }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const recieveBtnActions = (btnId:string) => {
    console.log("btn id ---- ", btnId)
  }
  return (
    <>
      <div className="w-full m-4">
        <Button
          variant="primary"
          size="sm"
          label="Open Dialog"
          onClick={() => setOpenDialog(true)}
        />
      </div>
      {<Alert {...args} open={openDialog} setOpen={setOpenDialog} btnActionCallBack={recieveBtnActions} />}
      
    </>
  );
};

const Template1: React.FC<AlertProps> = ({ ...args }) => {
  const [openDialog, setOpenDialog] = useState(false);

  const recieveBtnActions = (btnId:string , closeAlert? : () => void) => {
    console.log("btn id ---- ", btnId)
    closeAlert?.()
  }


  return (
    <>
      <div className="w-full m-4">
        <Button
          variant="primary"
          size="sm"
          label="Open Dialog"
          onClick={() => setOpenDialog(true)}
        />
      </div>
      {<Alert {...args} open={openDialog} setOpen={setOpenDialog} btnActionCallBack={recieveBtnActions} />}
    </>
  );
};

const successIconRender = () => {
  return (
    <div m-3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <title id="svgTitle">Icon</title>

        <path
          d="M22 11.0799V11.9999C21.9988 14.1563 21.3005 16.2545 20.0093 17.9817C18.7182 19.7088 16.9033 20.9723 14.8354 21.5838C12.7674 22.1952 10.5573 22.1218 8.53447 21.3744C6.51168 20.6271 4.78465 19.246 3.61096 17.4369C2.43727 15.6279 1.87979 13.4879 2.02168 11.3362C2.16356 9.18443 2.99721 7.13619 4.39828 5.49694C5.79935 3.85768 7.69279 2.71525 9.79619 2.24001C11.8996 1.76477 14.1003 1.9822 16.07 2.85986M22 3.99986L12 14.0099L9.00001 11.0099"
          stroke="#039855"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
};

const errorIconRender = () => {
  return (
    <div m-3>
      <ExclamationCircleIcon className="w-7 h-7 text-red-400"/>
    </div>
  );
};

export const Default: Story = {
  render: args => <Template {...args} />,
  args: {
    open: false,
    title: "Success",
    message: "Form added successfully",
    icon : successIconRender(),
  },
};

export const ErrorAlert : Story = {
  render: args => <Template {...args} />,
  args: {
    open: false,
    title: "Error",
    message: "Error adding form",
    titleTheme:"error",
    buttonContents:errorBtnActions,
    icon:errorIconRender(),
    
  },
}

export const AdditionalUiContents : Story = {
  render: args => <Template {...args} />,
  args: {
    title: "Inputs",
    additionalUiContents : <Input variant={"default"}/>,
  },
}

export const CustomNode : Story = {
  render: args => <Template {...args} />,
  args:{
    open:false,
    customPopupNode : (
    <div className=" p-4 rounded-md flex justify-center items-center h-40 w-full bg-white border-2 border-green-500">
      <Label lblColor="slate" text="Write some comments" />
      <TextArea placeholder="comments"/>
    </div>
  ),
    customStyles:{alertBoxContainerStyle:"max-w-[800px]"},
  
  }
}

export const ParentAlertClose : Story = {
  render: args => <Template1 {...args} />,
  args: {
    title: "Inputs",
    additionalUiContents : <Input variant={"default"}/>,
    enableParentClose : true
  },
}


