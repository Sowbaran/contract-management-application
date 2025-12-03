import { Button, Table, Badge, Accordion } from "@ui-components";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { AnyProp } from "../../../common/types";
import { FieldProps } from "@ui-components/Table/types";
import {
  useAuthStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../../store";
import { useGetWorkflowByModuleId } from "../../../api/backend/backendComponents";
import { useNavigate } from "@tanstack/react-router";
import { rowPerPageOptions } from "../../../constants/formConstants";

export const ContractConfigurationListPage = () => {
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
      label: "Workflow",
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
      label: "Level",
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
      name: "limitFlag",
      label: "Limit",
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
      name: "min",
      label: "Minimum",
      type: "string",
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
      label: "Is Specific Dept Approver",
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
      label: "Include On Requester Check",
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
      name: "deedOfNovation",
      label: "Deed Of Novation",
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
      name: "byPassWorkflow",
      label: "Bypass Workflow",
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

  const [accordionId, setAccordionId] = useState("-1");
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

      {/* Responsive Table Wrapper */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <div className="my-2">
          <Accordion
            selectedId={accordionId}
            onToggle={value => setAccordionId(value)}
            openId="1"
            headerLabel="Notes: Approver inclusion logic"
            mainContainer="bg-green-100 border-l-4 border-l-[#16A34A]"
            variant={"integrity"}
          >
            <div className="px-4 text-gray-500/80 font-normal text-sm">
              <ul style={{ listStyleType: "disc" }}>
                <li>
                  <b>Monetary Value greater than or equal to the Minimum Value </b>→ Include Role in the Approver Workflow.
                </li>
                <li>
                  <b>Monetary Value less than the Minimum Value </b>→ Exclude Role from the Approver Workflow.
                </li>
                <li>
                  <b>Limit Flag </b>→ When this flag is set to "No", the request is reviewed by the department regardless of the monetary value..
                </li>
                <li>
                  <b>Minimum </b>→ The workflow is determined based on whether the monetary value meets or exceeds the minimum threshold.
                </li>
                <li>
                  <b>Is Specific Department Approver </b>→ Some roles are static while others depend on the department; this flag determines whether the role matches the selected department and includes it accordingly
                </li>
                <li>
                  <b>Include on Requester Check </b>→ During form creation, if the requester has a specific role that should not be included in the workflow, this flag ensures the role is excluded; otherwise, it will be included.
                </li>
                <li>
                  <b>Deed of novation </b>→ When submitting the form, if the “Type of Approval being sought” is set to Deed of Novation, the workflow goes only through specific roles regardless of the monetary value.
                </li>
                <li>
                  <b>Bypass Workflow </b>→ Used when the form creator or requester wants to skip specific steps in the workflow based on a flag.
                </li>
              </ul>
            </div>
          </Accordion>
        </div>
        <div className="overflow-x-auto bg-white shadow-sm rounded-lg">
          <Table
            custNoRecordStyle={{
              label: !configDetail ? "Loading..." : "No Records Found"
            }}
            disablePagination
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
