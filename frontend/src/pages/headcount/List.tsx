import {
  Badge,
  Button,
  Drawer,
  Input,
  Table,
  Tabs
} from "@ui-components";

import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon
} from "@heroicons/react/24/outline";
import { useEffect, useReducer, useState } from "react";
import { TabProp } from "@ui-components/Tabs/types";
import { FormsHeadCountTabConst, rowPerPageOptions } from "../../constants/formConstants";
import { FieldProps } from "@ui-components/Table/types";
import { AnyProp, TabPropExtended } from "../../common/types";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import {
  useAuthStore,
  useFormTabStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../store";
import { useRouter } from "@tanstack/react-router";
import {
  useGetFilterMeta,
  useGetFormHistory,
  useGetHeadcountFormList
} from "../../api/backend/backendComponents";
import { WorkFlowHistory } from "../../components/WorkFlowHistory";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import { HeadCountAddEditForm } from "./Form";
import dayjs from "dayjs";
import { BadgeComponent } from "../../components/Badge";

type Filter = {
  // searchText: string;
  department: { label: string; value: string }[];
  status: { label: string; value: string }[];
  workflow: { label: string; value: string }[];
  startDate: Date | null;
  endDate: Date | null;
  departmentOptions: { label: string; value: string }[];
  statusOptions: { label: string; value: string }[];
  workflowOptions: { label: string; value: string }[];
};

type FilterAction =
  | { type: "setDepartment"; payload: { label: string; value: string }[] }
  | { type: "setStatus"; payload: { label: string; value: string }[] }
  | { type: "setWorkflow"; payload: { label: string; value: string }[] }
  | { type: "setStartDate"; payload: Date | null }
  | { type: "setEndDate"; payload: Date | null }
  | {
      type: "setDepartmentOptions";
      payload: { label: string; value: string }[];
    }
  | { type: "setWorkflowOptions"; payload: { label: string; value: string }[] }
  | { type: "setStatusOptions"; payload: { label: string; value: string }[] }
  | { type: "clear" };

const initialFilterState: Filter = {
  department: [],
  status: [],
  workflow: [],
  startDate: null,
  endDate: null,
  departmentOptions: [],
  statusOptions: [],
  workflowOptions: []
};

type SortKeys =
  | "code"
  | "departmentName"
  | "workflowName"
  | "status"
  | "createdAt"
  | "createdBy";

type SortValues = "asc" | "des";

const dispatchFilterReducer = (state: Filter, action: FilterAction) => {
  switch (action.type) {
    case "setDepartment":
      return { ...state, department: action.payload };
    case "setStatus":
      return { ...state, status: action.payload };
    case "setWorkflow":
      return { ...state, workflow: action.payload };
    case "setWorkflowOptions":
      return { ...state, workflowOptions: action.payload };
    case "setDepartmentOptions":
      return { ...state, departmentOptions: action.payload };
    case "setStatusOptions":
      return { ...state, statusOptions: action.payload };
    case "setStartDate":
      return { ...state, startDate: action.payload };
    case "setEndDate":
      return { ...state, endDate: action.payload };
    case "clear":
      return {
        ...state,
        department: initialFilterState.department,
        workflow: initialFilterState.workflow,
        status: initialFilterState.status,
        startDate: null,
        endDate: null
      };
    default:
      return state;
  }
};

export const HeadCountListPage = () => {
  const allowPageApi = false;
  const router = useRouter();
  const { emailId, accessToken } = useAuthStore();

  const [selectedRequestTabs, setSelectedRequestTabs] = useState<TabProp[]>([]);
  const [selectedRequestTab, setSelectedRequestTab] = useState<TabPropExtended>();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableRes, setTableRes] = useState<AnyProp>([]);
  // const [paginationMeta, setPaginationMeta] = useState<AnyProp>([]);
  const [tablePage, setTablePage] = useState({
    currentPage: 1,
    startRow: 0,
    rowPerPage: 10
  });
  const [formatedTableData, setFormatedTableData] = useState<AnyProp>([]);
  const [alteredTableRes, setAlteredTableRes] = useState<AnyProp>([]);
  const [searchInput, setSearchInput] = useState("");
  const [debounceSearchInput, setDebounceSearchInput] = useState(searchInput);
  const [filterState, dispatch] = useReducer(dispatchFilterReducer, initialFilterState);
  const { moduleStore: selectedModule } = useSelectedModuleStore();
  const { moduleTabStore: selectedModuleView } = useSelectedModuleTabStore();

  const [formAdvanceFilterFlag, setFormAdvanceFilterFlag] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [formHistoryId, setFormHistoryId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<AnyProp[]>([]);
  const [financeDrawerOpen, setFinanceDrawerOpen] = useState(false);

  const { setFormTab, formTabStore } = useFormTabStore();

  const [searchFocus, setSearchFocus] = useState(false);

  const [sortData, setSortData] = useState<Record<SortKeys, SortValues>>({
    code: "asc",
    departmentName: "asc",
    workflowName: "asc",
    status: "asc",
    createdAt: "asc",
    createdBy: "asc"
  });

  const {
    data,
    error,
    refetch: refetchGetFormList
  } = useGetHeadcountFormList(
    {
      pathParams: { email: emailId ? emailId : "" },
      queryParams: {
        moduleId: selectedModule?._id,
        type: selectedRequestTab?.type ? selectedRequestTab?.type : ""
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled: !!emailId && !!selectedModule?._id && !!selectedRequestTab?.type
    }
  );

  // useEffect(() => {
  //   if (selectedRequestTab) {
  //     setFormTab({ ...selectedRequestTab });
  //     handleClearFilter();
  //   }
  // }, [selectedRequestTab, setFormTab]);

  useEffect(() => {
    if (formTabStore) {
      setSelectedRequestTab({ ...formTabStore });
    }
  }, [formTabStore]);

  useEffect(() => {
    if (data) {
      setResContent(data);
    }
  }, [data]);

  if (error) {
    console.error("Error fetching data:", error);
  }

  const setResContent = (resData: AnyProp) => {
    setTableRes(resData?.data || []);
    setAlteredTableRes(resData?.data || []);
    // setPaginationMeta(resData?.meta);
  };

  const onClickSort = (sortKey: SortKeys) => {
    const sortValue = sortData[sortKey] === "asc" ? "desc" : "asc";
    setSortData(prev => ({ ...prev, [sortKey]: sortValue }));

    let sortedList = [...tableRes];
    switch (sortKey) {
      case "code":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.code.localeCompare(it2.code)
            : it2.code.localeCompare(it1.code)
        );
        break;

      case "departmentName":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.departmentName.localeCompare(it2.departmentName)
            : it2.departmentName.localeCompare(it1.departmentName)
        );
        break;

      case "workflowName":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.workflowName.localeCompare(it2.workflowName)
            : it2.workflowName.localeCompare(it1.workflowName)
        );
        break;

      case "status":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.status.localeCompare(it2.status)
            : it2.status.localeCompare(it1.status)
        );
        break;

      case "createdAt":
        sortedList = [...tableRes].sort((it1, it2) =>
          sortValue === "asc"
            ? it1.createdAt.localeCompare(it2.createdAt)
            : it2.createdAt.localeCompare(it1.createdAt)
        );
        break;
    }
    setAlteredTableRes(sortedList);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
  };

  const fields: FieldProps[] = [
    {
      name: "code",
      label: "FORM ID",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      type: "object",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("code")}>
          {sortData.code === "asc" ? (
            <ArrowDownIcon className="w-4 h-4 text-gray-700" />
          ) : (
            <ArrowUpIcon className="w-4 h-5 text-gray-700" />
          )}
        </button>
      ),
      formatter: (value: AnyProp) => {
        return (
          <button type="submit" onClick={() => onClickForm(value._id)}>
            <p className="text-sm text-blue-500 whitespace-nowrap">{value.code}</p>
          </button>
        );
      }
    },
    {
      name: "departmentName",
      label: "DEPARTMENT",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("departmentName")}>
          {sortData.departmentName === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: AnyProp) => {
        return (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {value}
          </span>
        );
      }
    },
    {
      name: "workflowName",
      label: "WORKFLOW",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("workflowName")}>
          {sortData.workflowName === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: value => {
        return <Badge label={value} variant="blue" />;
      }
    },
    {
      name: "status",
      label: "STATUS",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("status")}>
          {sortData.status === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      cellStyle: "text-[13px] whitespace-nowrap",
      formatter: value => {
        return <BadgeComponent value={value} />;
      }
    },
    {
      name: "createdAt",
      label: "CREATED AT",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("createdAt")}>
          {sortData.createdAt === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: string) => {
        return (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {dayjs(value).format("DD-MM-YYYY")}
          </span>
        );
      }
    },
    {
      name: "createdBy",
      label: "CREATED BY",
      cellStyle: "text-sm font-normal text-gray-900 whitespace-nowrap",
      headerStyle: "text-gray-900 font-semibold"
    },
    {
      name: "history",
      cellStyle: "pr-2",
      type: "object",
      formatter: (value: AnyProp) => {
        return (
          <button
            className="w-4 h-4"
            type="button"
            onClick={() => handleHistoryButtonClick(value._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 512 513.11"
            >
              <title>History</title>
              <path
                // fill="#3C71E1"
                d="M210.48 160.8c0-14.61 11.84-26.46 26.45-26.46s26.45 11.85 26.45 26.46v110.88l73.34 32.24c13.36 
              5.88 19.42 21.47 13.54 34.82-5.88 13.35-21.47 19.41-34.82 13.54l-87.8-38.6c-10.03-3.76-17.16-13.43-17.16-24.77V160.8zM5.4 
              168.54c-.76-2.25-1.23-4.64-1.36-7.13l-4-73.49c-.75-14.55 10.45-26.95 25-27.69 14.55-.75 26.95 10.45 27.69 25l.74 13.6a254.258 
              254.258 0 0136.81-38.32c17.97-15.16 38.38-28.09 61.01-38.18 64.67-28.85 134.85-28.78 196.02-5.35 60.55 23.2 112.36 69.27 141.4 
              132.83.77 1.38 1.42 2.84 1.94 4.36 27.86 64.06 27.53 133.33 4.37 193.81-23.2 60.55-69.27 112.36-132.83 141.39a26.24 26.24 0 01-12.89
               3.35c-14.61 0-26.45-11.84-26.45-26.45 0-11.5 7.34-21.28 17.59-24.92 7.69-3.53 15.06-7.47 22.09-11.8.8-.66 1.65-1.28 2.55-1.86 
               11.33-7.32 22.1-15.7 31.84-25.04.64-.61 1.31-1.19 2-1.72 20.66-20.5 36.48-45.06 46.71-71.76 18.66-48.7 18.77-104.46-4.1-155.72l-.01-.03C418.65 
               122.16 377.13 85 328.5 66.37c-48.7-18.65-104.46-18.76-155.72 4.1a203.616 203.616 0 00-48.4 30.33c-9.86 8.32-18.8 17.46-26.75 27.29l3.45-.43c14.49-1.77 
               27.68 8.55 29.45 23.04 1.77 14.49-8.55 27.68-23.04 29.45l-73.06 9c-13.66 1.66-26.16-7.41-29.03-20.61zM283.49 511.5c20.88-2.34 30.84-26.93 17.46-43.16-5.71-6.93-14.39-10.34-23.29-9.42-15.56 
               1.75-31.13 1.72-46.68-.13-9.34-1.11-18.45 2.72-24.19 10.17-12.36 16.43-2.55 39.77 17.82 42.35 19.58 2.34 39.28 2.39 58.88.19zm-168.74-40.67c7.92 5.26 17.77 
               5.86 26.32 1.74 18.29-9.06 19.97-34.41 3.01-45.76-12.81-8.45-25.14-18.96-35.61-30.16-9.58-10.2-25.28-11.25-36.11-2.39a26.436 26.436 0 00-2.55 38.5c13.34 
               14.2 28.66 27.34 44.94 38.07zM10.93 331.97c2.92 9.44 10.72 16.32 20.41 18.18 19.54 3.63 36.01-14.84 30.13-33.82-4.66-15-7.49-30.26-8.64-45.93-1.36-18.33-20.21-29.62-37.06-22.33C5.5
                252.72-.69 262.86.06 274.14c1.42 19.66 5.02 39 10.87 57.83z"
              />
            </svg>
          </button>
        );
      }
    }
  ];

  const debounce = <T extends (...args: AnyProp[]) => void>(func: T, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Parameters<T>): void => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const filterData = () => {
    const debounceLoweCase = debounceSearchInput.toLowerCase();
    const filtered = (tableRes || [])?.filter((item: AnyProp) => {
      const codePassed = item.code.toLowerCase().includes(debounceLoweCase);
      return codePassed;
    });
    // console.log("filtered --- ",filtered);
    setAlteredTableRes(filtered);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
  };

  const debounceFilteredData = debounce(filterData, 400);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (
      filterState.department.length > 0 ||
      filterState.workflow.length > 0 ||
      filterState.status.length > 0
    )
      dispatch({ type: "clear" });
    setDebounceSearchInput(searchInput);
  }, [searchInput]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    searchFocus && debounceFilteredData();
  }, [debounceSearchInput]);

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

  useEffect(() => {
    if (selectedModule) {
      const filtered = FormsHeadCountTabConst.filter(item =>
        selectedModule.permissions?.some((it: string) => it === item.id)
      );
      setSelectedRequestTabs(filtered);
    }
  }, [selectedModule]);

  const onTabChange = (item: TabProp) => {
    setSelectedRequestTab(item);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
    setFormTab(item || FormsHeadCountTabConst[0]);
    handleClearFilter();
  };

  const handleClearFilter = () => {
    dispatch({ type: "clear" });
    setAlteredTableRes(tableRes);
  };

  const { data: formFilterData } = useGetFilterMeta(
    {
      queryParams: {
        emailId: emailId ? emailId : "",
        type: selectedRequestTab?.type ? selectedRequestTab.type : "",
        moduleId: selectedModule._id
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled: !!formAdvanceFilterFlag
    }
  );

  const handleClickAdvanceFilter = () => {
    setFormAdvanceFilterFlag(true);
    setDrawerOpen(true);
  };

  useEffect(() => {
    if (!formFilterData) return;

    const sOptions =
      formFilterData.status?.map((item: string) => ({
        label: item,
        value: item
      })) || [];

    const wfOptions =
      formFilterData.workflow?.map((item: AnyProp) => ({
        label: item.name,
        value: item._id
      })) || [];

    const ddOptions =
      formFilterData.department?.map((item: AnyProp) => ({
        label: item.name,
        value: item._id
      })) || [];

    dispatch({ type: "setStatusOptions", payload: sOptions });
    dispatch({ type: "setWorkflowOptions", payload: wfOptions });
    dispatch({ type: "setDepartmentOptions", payload: ddOptions });
  }, [formFilterData]);

  const onClickApplyFilter = () => {
    // If there are no filters set, we don't need to filter the data
    if (
      !filterState?.department?.length &&
      !filterState?.workflow?.length &&
      !filterState?.status?.length &&
      !filterState?.startDate &&
      !filterState?.endDate
    ) {
      setAlteredTableRes(tableRes);
      setDrawerOpen(false);
      return;
    }

    if (!tableRes || tableRes.length === 0) {
      setDrawerOpen(false);
      return;
    }

    const filtered = (tableRes || [])?.filter((item: AnyProp) => {
      const matchesDepartment = filterState?.department?.length
        ? filterState.department.some(it => it.value === item.department)
        : true;

      const matchesWorkflow = filterState?.workflow?.length
        ? filterState.workflow.some(it => it.value === item.workflow)
        : true;

      const matchesStatus = filterState?.status?.length
        ? filterState.status.some(it => it.value === item.status)
        : true;

      const filteredDate =
        filterState?.startDate && filterState?.endDate
          ? dayjs(item.createdAt).isAfter(dayjs(filterState?.startDate).startOf("day")) &&
            dayjs(item.createdAt).isBefore(dayjs(filterState?.endDate).endOf("day"))
          : true;

      return matchesDepartment && matchesWorkflow && matchesStatus && filteredDate;
    });

    setAlteredTableRes(filtered);
    setDrawerOpen(false);
  };

  const onClickForm = (formId: string) => {
    const navBase = selectedModule.code;
    console.log(`navBase: ${navBase}`);
    router.navigate({
      to: `/${navBase}/requests/detail/${formId}?page=${
        (selectedRequestTab?.id === "view-headcount-my-requests-tab" && "myRequest") ||
        (selectedRequestTab?.id === "view-headcount-team-requests-tab" &&
          "teamRequest") ||
        (selectedRequestTab?.id === "view-headcount-approve-request-tab" &&
          "approveRequest")
      }&moduleId=${selectedModule._id}`
    });
  };

  const { data: formHistoryData } = useGetFormHistory(
    {
      pathParams: { id: formHistoryId || "" },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled: !!formHistoryId
    }
  );

  useEffect(() => {
    if (formHistoryData) {
      setHistoryData(formHistoryData.data);
    }
  }, [formHistoryData]);

  // Handle button click to fetch form history
  const handleHistoryButtonClick = (clickedFormId: string) => {
    setFormHistoryId(clickedFormId);
    setIsOpen(true);
  };

  const childActionCb = (actionId: string) => {
    console.log("action cb ---- ", actionId);
    refetchGetFormList();
  };

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="px-8 ">
            <div className="">
              <span className="text-gray-500 font-semibold">{`${selectedModule?.name} / `}</span>
              <span className="text-gray-900 font-semibold">{` ${selectedModuleView?.name}`}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 border-b border-b-gray-200" />
        <div className="w-full mt-3 px-4 overflow-x-auto scrollbar-hide"> 
          <div className="flex flex-row gap-2 sm:gap-4 px-2 sm:px-4 min-w-max">
            <Tabs
              selectedTab={selectedRequestTab?.id}
              tabList={selectedRequestTabs}
              onTabChange={onTabChange}
              tabStyle="data-[selected]:border-b-2 data-[selected]:border-b-green-500 data-[selected]:text-green-600 hover:border-b-2 hover:border-b-gray-300 hover:text-gray-700 text-md font-medium"
            />
          </div>
        </div>
        <div className=" border-b border-b-gray-200" />

        <div className="mt-4 mb-4 px-4 md:px-8 flex flex-wrap md:flex-nowrap justify-between gap-4">
          <div className="w-full md:w-[400px]">
            <Input
              className="text-sm pl-2 focus:border-slate-300 focus:ring-0"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              variant={"default"}
              placeholder="Search by Form Id"
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
          <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto justify-end">
            {selectedRequestTab?.type === "myRequest" && (
              <>
                <Button
                  className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
                  leftIcon={<PlusCircleIcon className="text-white w-5 h-5" />}
                  //variant="primary"
                  size="sm"
                  label="Add New Form"
                  onClick={() => setFinanceDrawerOpen(true)}
                />
              </>
            )}

            <Button
              leftIcon={<AdjustmentsHorizontalIcon className="text-primary w-5 h-5" />}
              //variant="outline"
              className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
              size="sm"
              label="Advance Filter"
              onClick={() => handleClickAdvanceFilter()}
            />
          </div>
        </div>
        {
          <div className="mx-6">
            <Table
              custNoRecordStyle={{ label: !data ? "Loading..." : "No Records Found" }}
              tableStyle="md:min-w-[1350px]"
              startPage={tablePage.startRow}
              rowPerPage={tablePage.rowPerPage}
              totalRowCount={alteredTableRes?.length}
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
                setTablePage(prev => ({
                  ...prev,
                  rowPerPage: val,
                  currentPage: 1,
                  startRow: 0
                }));
              }}
            />
          </div>
        }
      </div>
      {
        <Drawer
          open={isOpen}
          handleOpen={open => setIsOpen(open)}
          backgroudPanelStyle="w-[500px] mt-14"
          headerContentStyle="flex justify-between items-center py-6"
          headerContent={
            <>
              <label className="text-md  font-semibold text-black">History</label>
            </>
          }
          enableZindex={true}
          mainContent={
            <div className="w-full p-4">
              <WorkFlowHistory workflowHistory={historyData} />
            </div>
          }
        />
      }
      {
        <Drawer
          open={drawerOpen}
          handleOpen={drawerOpen => setDrawerOpen(drawerOpen)}
          backgroudPanelStyle="w-[400px] mt-14"
          headerContentStyle="flex justify-between items-center py-6"
          headerContent={
            <>
              <label className="text-md  font-semibold text-black">FILTERS</label>
              <button
                type="button"
                className="text-[10px] text-gray-400 rounded-md p-1"
                onClick={handleClearFilter}
              >
                Clear All
              </button>
            </>
          }
          enableZindex={true}
          mainContent={
            <div className="relative h-full w-full px-6 flex flex-col py-3 gap-4">
              {filterState.departmentOptions?.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="department"
                    className="text-sm font-semibold text-gray-900 "
                  >
                    Department
                  </label>
                  <Select
                    className="text-sm"
                    placeholder="Select Department"
                    isMulti
                    value={filterState.department}
                    options={filterState.departmentOptions.sort((a, b) =>
                      a.label.localeCompare(b.label)
                    )}
                    onChange={selectedOptions => {
                      dispatch({
                        type: "setDepartment",
                        payload: [...selectedOptions]
                      });
                    }}
                  />
                </div>
              )}

              {filterState.workflowOptions?.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="Workflow"
                    className="text-sm font-semibold text-gray-900 "
                  >
                    Workflow
                  </label>
                  <Select
                    className="text-sm"
                    placeholder="Select Workflow"
                    isMulti
                    options={filterState.workflowOptions.sort((a, b) =>
                      a.label.localeCompare(b.label)
                    )} // Sort options alphabetically
                    value={filterState.workflow}
                    onChange={selectedOptions => {
                      dispatch({
                        type: "setWorkflow",
                        payload: [...selectedOptions]
                      });
                    }}
                  />
                </div>
              )}

              {filterState.statusOptions?.length > 0 && (
                <div className="flex flex-col gap-1">
                  <label
                    htmlFor="status"
                    className="text-sm font-semibold text-gray-900 "
                  >
                    Status
                  </label>
                  <Select
                    className="text-sm"
                    placeholder="Select Status"
                    isMulti
                    options={filterState.statusOptions
                      .map(option => ({
                        ...option,
                        label:
                          option.label.charAt(0).toUpperCase() + option.label.slice(1) // Capitalize the first letter
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label))} // Sort options alphabetically}
                    value={filterState.status}
                    onChange={selectedOptions => {
                      dispatch({
                        type: "setStatus",
                        payload: [...selectedOptions]
                      });
                    }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-3">
                <label className="text-sm font-semibold text-gray-900">Created At</label>

                <div className="flex flex-row gap-1 items-center">
                  <label
                    htmlFor="startDate"
                    className=" w-[40px] text-sm text-[#344054] "
                  >
                    From
                  </label>
                  <ReactDatePicker
                    autoComplete="off"
                    id="startDate"
                    showIcon
                    calendarIconClassname="fill-primary-600 mr-2 mt-[2px]"
                    wrapperClassName="w-full"
                    className="w-full p-1 border rounded-md border-gray-400/60"
                    dateFormat={"dd/MM/yyyy"}
                    selected={filterState?.startDate}
                    onChange={(date: Date) => {
                      dispatch({ type: "setStartDate", payload: date });
                    }}
                    maxDate={new Date()}
                  />
                </div>

                <div className="flex flex-row gap-1 items-center">
                  <label htmlFor="endDate" className=" w-[40px] text-sm text-[#344054] ">
                    To
                  </label>
                  <ReactDatePicker
                    dayClassName={() => "no-tooltip"}
                    id="endDate"
                    autoComplete="off"
                    showIcon
                    calendarIconClassname="fill-primary-600 mr-2 mt-[2px]"
                    wrapperClassName="w-full"
                    className="w-full p-1 border rounded-md border-gray-400/60 disabled:bg-gray-200"
                    dateFormat={"dd/MM/yyyy"}
                    selected={filterState.endDate}
                    onChange={(date: Date) =>
                      dispatch({ type: "setEndDate", payload: date })
                    }
                    minDate={filterState.startDate}
                    maxDate={new Date()}
                    disabled={filterState.startDate ? false : true}
                  />
                </div>
              </div>
              <button
                className="p-1 m-3 mx-5 rounded-md absolute left-0 right-0 bottom-0 text-white bg-green-600 hover:bg-gray-500 border border-green-600 hover:border-gray-500"
                type="button"
                disabled={
                  filterState.department.length <= 0 &&
                  filterState.workflow.length <= 0 &&
                  filterState.status.length <= 0 &&
                  ((!filterState?.startDate && true) || (!filterState?.endDate && true))
                }
                onClick={onClickApplyFilter}
              >
                Apply
              </button>
            </div>
          }
        />
      }

      {
        <HeadCountAddEditForm
          parentCB={childActionCb}
          type="add"
          setOpenDraw={val => setFinanceDrawerOpen(val)}
          openDraw={financeDrawerOpen}
        />
      }
    </>
  );
};
