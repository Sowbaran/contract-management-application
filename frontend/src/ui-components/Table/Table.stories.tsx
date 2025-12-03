import type { Meta, StoryObj } from "@storybook/react";

import { ArrowDownIcon, FlagIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { Table } from ".";
import { AnyProps } from "../utils/types";
import { Avatar } from "../Avatar/Avatar";
import { Badge } from "../Badge/Badge";
import { Menu } from "../Menu/Menu";
import { menuOptions } from "../Menu/data";
import { rowOptions } from "../Pagination/data";
import { TableHeader } from "./Table";
import { data } from "./data";
import { FieldProps } from "./types";

const meta = {
  title: "Design System/Components/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    design: {
      type: "figma",
      url: ``,
    },
    docs: {
      description: {
        component: `This is a Table component`,
      },
    },
  },
} satisfies Meta<typeof Table>;

export default meta;

type Story = StoryObj<typeof meta>;

const Template = ({ ...props }) => {
  const fields: FieldProps[] = [
    {
      name: "statusType",
      label: "",
      cellStyle: "p-0 py-1",
      formatter: () => {
        return <div className="min-h-[72px] w-1 bg-primary-600" />;
      },
    },
    {
      name: "name",
      headerFormatter: (
        <div
          className={`pl-6 font-medium  py-3 text-left text-sm text-slate-400`}
        >
          <p>Name</p>
        </div>
      ),
      type: "object",
      formatter: (value: { name: string; status: string }) => {
        const typedValue = value;

        const RenderBadge = (item: string) => {
          switch (item) {
            case "Approved":
              return <Badge variant="success" label={item} />;
            case "On Hold":
              return <Badge variant="orange" label={item} />;
            case "Submitted":
              return <Badge variant="blue" label={item} />;
            case "Rejected":
              return <Badge variant="error" label={item} />;
            case "Archieved":
              return <Badge variant="gray" label={item} />;
            case "Awaiting":
              return <Badge variant="purple" label={item} />;
          }
        };
        return (
          <div className="flex gap-3">
            <Avatar
              className="w-10 h-10"
              src="https://picsum.photos/id/237/200/200"
            />
            <div className="flex flex-col gap-1 items-start justify-center min-h-10">
              <p>{typedValue.name}</p>
              {RenderBadge(typedValue.status)}
            </div>
          </div>
        );
      },
    },
    {
      name: "organisation",
      label: "ORGANISATION",
      headerLabelIcon:(
        <button type="button">
          <ArrowDownIcon className="w-4 h-4"/>
        </button>
      ),
      formatter: (value) => {
        return (
          <div className="w-10 h-10">
            <img src={value} alt="Img" />
          </div>
        );
      },
    },
    {
      name: "type",
      label: "TYPE",
      cellStyle: "min-w-[150px] bg-green-200",
    },
    {
      name: "position",
      label: "POSITION",
    },
    {
      name: "regDate",
      label: "REGISTRATION DATE",
      formatter: (value) => {
        return <p className="text-gray-900">{value}</p>;
      },
    },
    {
      name: "type",
      label: "EMPLOYMENT TYPE",
      formatter: (value) => {
        return <p className="text-gray-900">{value}</p>;
      },
    },
    {
      name: "menu",
      label: "",
      formatter: () => {
        const [value, setValue] = useState("");
        console.log("value --- ", value);
        const onChange = (item: string) => {
          setValue(item);
        };
        return (
          <div className="flex">
            <FlagIcon className="w-6 h-6" />
            <Menu
              buttonType="custom"
              options={menuOptions}
              onMenuChange={onChange}
            />
          </div>
        );
      },
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [rowPerPage, setRowPerPage] = useState(10);
  const [spliced, setSpliced] = useState<AnyProps>([]);

  useEffect(() => {
    const range = data.slice(
      rowPerPage * Math.max(0, currentPage - 1),
      rowPerPage * currentPage
    );
    setSpliced(range);
  }, [currentPage, rowPerPage]);

  const onPageChange = (start: number, current: number) => {
    setStartPage(start);
    setCurrentPage(current);
  };

  const onRowPerPageChange = (perPage: number) => {
    setStartPage(0);
    setCurrentPage(1);
    setRowPerPage(perPage);
  };

  return (
    <Table
      totalRowCount={data.length}
      startPage={startPage}
      rowPerPage={rowPerPage}
      header={props.header}
      data={spliced}
      fields={fields}
      onPageChange={onPageChange}
      onRowPerPageChange={onRowPerPageChange}
      rowOptions={rowOptions}
    />
  );
};
export const Default: Story = {
  args: {
    header: (
      <TableHeader className="">
        <p className="text-slate-900 text-sm font-medium">
          Filter by Organization
        </p>
        <div className="flex">
          <Menu
            labelStyle="text-slate-500 text-sm"
            buttonClassName="rounded-r-none border-r-0"
            label="Name"
            containerVariants={{ align: "right" }}
            options={menuOptions}
            onMenuChange={() => {}}
            enableSearch={true}
          />
          <Menu
            labelStyle="text-slate-500 text-sm"
            disabled={true}
            buttonClassName="rounded-l-none"
            containerVariants={{ align: "right" }}
            label="Organization"
            options={menuOptions}
            onMenuChange={() => {}}
            enableSearch={true}
          />
        </div>
      </TableHeader>
    ),
  },
  render: (args) => <Template {...args} />,
};
