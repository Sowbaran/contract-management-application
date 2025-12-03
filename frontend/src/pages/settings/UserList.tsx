import { Button, Input, Table } from "@ui-components";
import { MagnifyingGlassIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { useState, useEffect } from "react";
import { AnyProp } from "../../common/types";
import { rowPerPageOptions } from "../../constants/formConstants";
import { FieldProps } from "@ui-components/Table/types";
import { useAuthStore, useSelectedModuleStore } from "../../store";
import { useGetUserList } from "../../api/backend/backendComponents";
import { UserForm } from "./UserForm";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

type SortKeys = "name" | "email";
type SortValues = "asc" | "des";

export const UserList = () => {
  const allowPageApi = false;
  const { emailId, accessToken } = useAuthStore();
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const [searchInput, setSearchInput] = useState("");
  const [tableRes, setTableRes] = useState<AnyProp>([]);
  const [paginationMeta, setPaginationMeta] = useState<AnyProp>([]);
  const [tablePage, setTablePage] = useState({
    currentPage: 1,
    startRow: 0,
    rowPerPage: 10
  });
  const [formatedTableData, setFormatedTableData] = useState<AnyProp>([]);
  const [alteredTableRes, setAlteredTableRes] = useState<AnyProp>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isCreating, setIsCreating] = useState<string>("add");
  const [selectedRowId, setSelectedRowId] = useState<string>("");
  const queryClient = useQueryClient();

  const [sortData, setSortData] = useState<Record<SortKeys, SortValues>>({
    name: "asc",
    email: "asc"
  });

  const onClickSort = (sortKey: SortKeys) => {
    const sortValue = sortData[sortKey] === "asc" ? "desc" : "asc";
    setSortData(prev => ({ ...prev, [sortKey]: sortValue }));

    let sortedList = [...tableRes];
    switch (sortKey) {
      case "name":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.name.localeCompare(it2.name)
            : it2.name.localeCompare(it1.name)
        );
        break;
      case "email":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.email.localeCompare(it2.email)
            : it2.email.localeCompare(it1.email)
        );
        break;
    }
    setAlteredTableRes(sortedList);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
  };

  const fields: FieldProps[] = [
    {
      name: "name",
      label: "Name",
      cellStyle: "text-sm",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("name")}>
          {sortData.name === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      )
    },
    {
      name: "email",
      label: "Email",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("email")}>
          {sortData.name === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      )
    },
    {
      name: "departments",
      label: "Departments & Roles",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: { name: string; roles: string[] }[]) => {
        if (!value || value.length === 0) return "-";

        return value.map(department => (
          <div key={department.name} className="mb-2">
            <div className="font-semibold">{department.name}</div>
            <ul className="list-disc pl-5">
              {department.roles.map(role => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        ));
      }
    },
    {
      name: "modules",
      label: "Modules",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: string[]) => {
        return value.join(", ");
      }
    },
    {
      name: "permissions",
      label: "Permissions",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: string[]) => {
        if (!value || value.length === 0) return "-";
        const maxDisplayCount = 2;
        const [expanded, setExpanded] = React.useState(false);
        const visiblePermissions = expanded ? value : value.slice(0, maxDisplayCount); // Show only 5 initially

        return (
          <div>
            <ul className="list-disc pl-5">
              {visiblePermissions.map((perm, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <li key={index}>{perm}</li>
              ))}
            </ul>
            {value.length > maxDisplayCount && (
              // biome-ignore lint/a11y/useButtonType: <explanation>
              <button
                className="text-blue-500 underline mt-2 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show Less" : `+${value.length - maxDisplayCount} More`}
              </button>
            )}
          </div>
        );
      }
    },
    {
      name: "status",
      label: "Status",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: boolean) => {
        return value ? (
          <span className="text-green-500 font-semibold">Active</span>
        ) : (
          <span className="text-red-500 font-semibold">Inactive</span>
        );
      }
    },
    {
      name: "editUser",
      cellStyle: "pr-2",
      type: "object",
      formatter: (value: AnyProp) => {
        return (
          <div className="flex items-center space-x-2">
            <Button
              className="w-full sm:w-auto px-4 py-1 cursor-pointer text-sm font-semibold text-green-600 border-2 border-green-600 hover:bg-green-600 hover:text-white"
              variant="outline"
              size="sm"
              label="Edit"
              onClick={() => handleEditButton(value._id)}
            />
          </div>
        );
      }
    }
  ];

  const { data } = useGetUserList(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      queryParams: {
        menuModuleId: selectedModule?._id,
        email: emailId ? emailId : ""
      }
    },
    {
      enabled: !!emailId && !!selectedModule?._id,
      retry: false
    }
  );

  useEffect(() => {
    if (data) {
      setTableRes(data?.data);
      setAlteredTableRes(data?.data);
      setPaginationMeta(data?.meta);
    }
  }, [data]);

  useEffect(() => {
    if (!drawerOpen) {
      console.log(`userList drawerOpen:${drawerOpen}`);
      queryClient.invalidateQueries();
    }
  }, [drawerOpen, queryClient]);

  useEffect(() => {
    const filteredData = alteredTableRes.filter((user: AnyProp) => {
      return (
        user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        user.email.toLowerCase().includes(searchInput.toLowerCase())
      );
    });

    // Reset to the first page on search change
    if (searchInput && tablePage.currentPage !== 1) {
      setTablePage(prev => ({
        ...prev,
        currentPage: 1,
        startRow: 0
      }));
    }

    if (!allowPageApi) {
      const startIndex = tablePage.rowPerPage * (tablePage.currentPage - 1);
      const endIndex = tablePage.rowPerPage * tablePage.currentPage;
      const sliced = filteredData.slice(startIndex, endIndex);
      setFormatedTableData(sliced);

      if (startIndex >= filteredData.length) {
        setTablePage(prev => ({
          ...prev,
          currentPage: Math.max(1, Math.ceil(filteredData.length / tablePage.rowPerPage))
        }));
      }
    } else {
      setFormatedTableData(filteredData);
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setPaginationMeta((prev: any) => ({
      ...prev,
      totalRowCount: filteredData.length
    }));
  }, [tablePage, alteredTableRes, searchInput]);

  const handleAddButton = () => {
    setIsCreating("add");
    setDrawerOpen(true);
  };

  const handleEditButton = (id: string) => {
    setIsCreating("edit");
    setDrawerOpen(true);
    setSelectedRowId(id);
  };

  return (
    <div className="w-full">
      <div className="mt-4 mb-4 px-4 sm:px-8 flex flex-col sm:flex-row items-center sm:justify-between gap-2 sm:gap-4">
        {/* Search Input - Full width on small screens */}
        <div className="w-full sm:w-[330px]">
          <Input
            className="text-sm pl-2 focus:border-slate-300 focus:ring-0"
            variant={"default"}
            placeholder="Search by Name or Email"
            iconRight={
              <button
                type="button"
                className="border-b-3 px-2 rounded-r-md h-9 w-9 bg-green-600 -mr-4 cursor-default"
              >
                <MagnifyingGlassIcon className="text-white w-5 h-5" />
              </button>
            }
            inputPad="left"
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Button - Full width on small screens, normal size on larger screens */}
        <div className="w-full sm:w-auto flex justify-end">
          <Button
            className="w-full sm:w-auto px-4 text-sm font-medium text-white bg-green-600 hover:bg-gray-500 border border-green-600 hover:border-gray-500"
            leftIcon={<PlusCircleIcon className="text-white w-5 h-5" />}
            variant="primary"
            size="sm"
            label="Add User"
            onClick={handleAddButton}
          />
        </div>
      </div>
      <div className="mt-0 mb-4" />
      <div className="px-8">
        <Table
          custNoRecordStyle={{ label: !data ? "Loading..." : "No Records Found" }}
          startPage={tablePage.startRow}
          rowPerPage={tablePage.rowPerPage}
          totalRowCount={paginationMeta?.totalRowCount}
          fields={fields}
          data={formatedTableData}
          rowOptions={rowPerPageOptions}
          showPageInfo={true}
          rowButtonStyle="w-20"
          onPageChange={(startRow: number, currentPage: number) =>
            setTablePage(prev => ({
              ...prev,
              startRow: startRow,
              currentPage: currentPage
            }))
          }
          onRowPerPageChange={val => {
            setTablePage(prev => ({ ...prev, rowPerPage: val }));
          }}
          header={undefined}
        />
      </div>
      {
        <UserForm
          setOpen={val => setDrawerOpen(val)}
          isCreating={isCreating}
          open={drawerOpen}
          selectedRowId={selectedRowId}
        />
      }
    </div>
  );
};
