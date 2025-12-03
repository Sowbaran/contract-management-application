import { Button, Table, Badge } from "@ui-components";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { AnyProp } from "../../../common/types";
import { rowPerPageOptions } from "../../../constants/formConstants";
import { FieldProps } from "@ui-components/Table/types";
import {
  useAuthStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../../store";
import { useGetWorkflowByModuleId } from "../../../api/backend/backendComponents";
import { useNavigate } from "@tanstack/react-router";

export const HeadCountConfigurationListPage = () => {
  const allowPageApi = false;
  const { emailId, accessToken } = useAuthStore();
  const [tableRes, setTableRes] = useState<AnyProp>([]);
  const [paginationMeta, setPaginationMeta] = useState<AnyProp>([]);
  const [tablePage, setTablePage] = useState({
    currentPage: 1,
    startRow: 0,
    rowPerPage: 10
  });
  const [formatedTableData, setFormatedTableData] = useState<AnyProp>([]);
  const [alteredTableRes, setAlteredTableRes] = useState<AnyProp>([]);

  const navigate = useNavigate({
    from: "contract/configuration"
  });

  const pathParts = window.location.pathname.split("/");
  const redirectBaseUrl = `/${pathParts[1]}/${pathParts[2]}`;

  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const { moduleTabStore: selectedModuleView } = useSelectedModuleTabStore();
  const [configurationId, setConfigurationId] = useState<string>();

  const fields: FieldProps[] = [
    {
      name: "name",
      label: "WORKFLOW",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: string) => {
        return (
          <div className="inline-flex">
            <p className="text-sm font-normal text-gray-900 whitespace-nowrap">{value}</p>
          </div>
        );
      }
    },
    {
      name: "level",
      label: "LEVEL",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: AnyProp) => {
        return (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {value}
          </span>
        );
      }
    },
    {
      name: "isSpecificDeptApprover",
      label: "IS SPECIFIC DEPT APPROVER",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: boolean) => {
        return value ? (
          <Badge label="Yes" variant="green2" />
        ) : (
          <Badge label="No" variant="red2" />
        );
      }
    },
    {
      name: "includeOnRequesterCheck",
      label: "INCLUDE ON REQUESTER CHECK",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      formatter: (value: boolean) => {
        return value ? (
          <Badge label="Yes" variant="green2" />
        ) : (
          <Badge label="No" variant="red2" />
        );
      }
    }
  ];

  const { data: configDetail } = useGetWorkflowByModuleId(
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      pathParams: {
        moduleId: selectedModule?._id
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (configDetail) {
      //console.log(configDetail.data[0]?.workflowOrder);
      setConfigurationId(configDetail.data[0]?._id.toString());
      setTableRes(configDetail.data[0]?.workflowOrder);
      setAlteredTableRes(configDetail.data[0]?.workflowOrder);
      const metadata = { totalRowCount: configDetail.data[0]?.workflowOrder?.length };
      setPaginationMeta(metadata);
    }
  }, [configDetail]);

  useEffect(() => {
    if (!allowPageApi) {
      const sliced = alteredTableRes.slice(
        tablePage.rowPerPage * (tablePage.currentPage - 1),
        tablePage.rowPerPage * tablePage.currentPage
      );
      setFormatedTableData(sliced);
    } else {
      setFormatedTableData(tableRes);
    }
  }, [tablePage, alteredTableRes, tableRes]);

  const updateConfiguration = () => {
    navigate({
      to: `${redirectBaseUrl}/update/${configurationId}`,
      search: { moduleId: selectedModule?._id }
    });
  };

  return (
    <div className="w-full">
      <div className=" w-full">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="text-sm sm:text-base">
            <span className="text-gray-500 font-semibold">{`${selectedModule?.name} / `}</span>
            <span className="text-gray-900 font-semibold">{` ${selectedModuleView?.name}`}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 border-b border-gray-200" />
      <div className="mt-4 mb-4 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xl sm:text-2xl font-medium leading-tight">
          Configuration
        </span>
        <Button
          leftIcon={<PlusCircleIcon className="text-white w-5 h-5" />}
          variant="green"
          size="sm"
          label="Update Configuration"
          onClick={() => updateConfiguration()}
        />
      </div>
      <div className="border-b border-gray-200" />
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <Table
            custNoRecordStyle={{
              label: !configDetail ? "Loading..." : "No Records Found"
            }}
            disablePagination={true}
            startPage={tablePage.startRow}
            rowPerPage={tablePage.rowPerPage}
            totalRowCount={paginationMeta?.totalRowCount}
            fields={fields}
            data={formatedTableData}
            header=""
            rowOptions={rowPerPageOptions}
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
          />
        </div>
      </div>
    </div>
  );
};
