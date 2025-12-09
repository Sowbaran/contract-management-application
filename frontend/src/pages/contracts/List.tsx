import {
  Button,
  Drawer,
  Input,
  MultiSelect,
  Table,
  Tabs
} from "@ui-components";

import {
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { useEffect, useReducer, useState } from "react";
import { TabProp } from "@ui-components/Tabs/types";
import { FormsTabConst, rowPerPageOptions } from "../../constants/formConstants";
import { FieldProps } from "@ui-components/Table/types";
import { AnyProp, TabPropExtended } from "../../common/types";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker from "react-datepicker";
import {
  useAuthStore,
  useFormTabStore,
  useSelectedModuleStore,
  useSelectedModuleTabStore
} from "../../store";
import { useRouter } from "@tanstack/react-router";
import {
  useDeleteFormById,
  useGetFilterMeta,
  useGetFormHistory,
  useGetFormList
} from "../../api/backend/backendComponents";
import { WorkFlowHistory } from "../../components/WorkFlowHistory";
import { ContractAddEditForm } from "./Form";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { MultiSelectOption } from "@ui-components/MultiSelect/types";
import { BadgeComponent } from "../../components/Badge";
import { AlertLayout } from "../../layouts/AlertLayout/AlertLayout";
import { ButtonProps } from "@ui-components/Button/types";
import { TextAreaLabel } from "../../layouts/TextAreaLabel/TextAreaLabel";
import { ErrorIcon } from "../../utils/CommonIcons";
import { useQueryClient } from "@tanstack/react-query";
import { dateTimeFormatter_2 } from "../../utils/formatHelper";
import toast from "react-hot-toast";

type Filter = {
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
  | "counter_party"
  | "monetary_value"
  | "start_date"
  | "end_date"
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

const deleteBtnActions: ButtonProps[] = [
  {
    id: "delete",
    variant: "error",
    size: "sm",
    label: "Yes",
    buttonStyle: "w-full"
  },
  {
    id: "cancel",
    variant: "primary",
    className: "bg-slate-400 border border-slate-300 hover:bg-slate-300",
    size: "sm",
    label: "No",
    buttonStyle: "w-full"
  }
];

export const ContractFormListPage = () => {
  const allowPageApi = false;
  const router = useRouter();
  const { emailId, accessToken } = useAuthStore();

  const [selectedRequestTabs, setSelectedRequestTabs] = useState<TabProp[]>([]);
  const [selectedRequestTab, setSelectedRequestTab] = useState<TabPropExtended>();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [tableRes, setTableRes] = useState<AnyProp>([]);
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
  const { setFormTab, formTabStore } = useFormTabStore();

  const [formAdvanceFilterFlag, setFormAdvanceFilterFlag] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const [formHistoryId, setFormHistoryId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<AnyProp[]>([]);
  const [financeDrawerOpen, setFinanceDrawerOpen] = useState(false);
  const [searchFocus, setSearchFocus] = useState(false);
  const [, setSelectedDepartment] = useState<MultiSelectOption[]>([]);
  const [, setSelectedStatus] = useState<MultiSelectOption[]>([]);
  const [, setSelectedWorkflow] = useState<MultiSelectOption[]>([]);
  const [formDeleteId, setFormDeleteId] = useState<string | null>(null);
  const [formDeleteStatus, setFormDeleteStatus] = useState<string>("");
  const [formDeleteReason, setFormDeleteReason] = useState<string>("");
  const [errors, setErrors] = useState<AnyProp>({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  let alertClose: (() => void) | null = null;
  const [refreshPage, setRefreshPage] = useState(true);
  const queryClient = useQueryClient();

  const [sortData, setSortData] = useState<Record<SortKeys, SortValues>>({
    code: "asc",
    departmentName: "asc",
    counter_party: "asc",
    monetary_value: "asc",
    start_date: "asc",
    end_date: "asc",
    workflowName: "asc",
    status: "asc",
    createdAt: "asc",
    createdBy: "asc"
  });

  const {
    data,
    error,
    refetch: refetchGetFormList
  } = useGetFormList(
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

  useEffect(() => {
    if (formTabStore) {
      setSelectedRequestTab(formTabStore);
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
  };

  const onClickSort = (sortKey: SortKeys) => {
    const sortValue = sortData[sortKey] === "asc" ? "desc" : "asc";
    setSortData(prev => ({ ...prev, [sortKey]: sortValue }));

    // Sort the already filtered list, not the original full list
    const sortedList = [...alteredTableRes];
    switch (sortKey) {
      case "code":
        sortedList.sort((a, b) =>
          sortValue === "asc"
            ? a.code.localeCompare(b.code)
            : b.code.localeCompare(a.code)
        );
        break;
      case "departmentName":
        sortedList.sort((a, b) =>
          sortValue === "asc"
            ? a.departmentName.localeCompare(b.departmentName)
            : b.departmentName.localeCompare(a.departmentName)
        );
        break;
      case "counter_party":
        sortedList.sort((a, b) =>
          sortValue === "asc"
            ? (a?.formInfo?.counter_party ?? "").localeCompare(
                b?.formInfo?.counter_party ?? ""
              )
            : (b?.formInfo?.counter_party ?? "").localeCompare(
                a?.formInfo?.counter_party ?? ""
              )
        );
        break;
      case "workflowName":
        sortedList.sort(
          (a, b) =>
            (a.workflowName ?? "")
              .toLowerCase()
              .localeCompare((b.workflowName ?? "").toLowerCase()) *
            (sortValue === "asc" ? 1 : -1)
        );
        break;
      case "monetary_value":
        sortedList.sort((a, b) => {
          const valA = Number(a?.formInfo?.monetary_value ?? 0);
          const valB = Number(b?.formInfo?.monetary_value ?? 0);
          return (valA - valB) * (sortValue === "asc" ? 1 : -1);
        });
        break;
      case "start_date":
        sortedList.sort((a, b) => {
          const d1 = new Date(a?.formInfo?.start_date || "");
          const d2 = new Date(b?.formInfo?.start_date || "");

          return sortValue === "asc"
            ? d1.getTime() - d2.getTime()
            : d2.getTime() - d1.getTime();
        });
        break;
      case "end_date":
        sortedList.sort((a, b) => {
          const d1 = new Date(a?.formInfo?.end_date || "");
          const d2 = new Date(b?.formInfo?.end_date || "");

          return sortValue === "asc"
            ? d1.getTime() - d2.getTime()
            : d2.getTime() - d1.getTime();
        });
        break;
      case "status":
        sortedList.sort((a, b) =>
          sortValue === "asc"
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status)
        );
        break;
      case "createdAt":
        sortedList.sort((a, b) =>
          sortValue === "asc"
            ? a.createdAt.localeCompare(b.createdAt)
            : b.createdAt.localeCompare(a.createdAt)
        );
        break;
    }

    setAlteredTableRes(sortedList);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
  };

  const fields: FieldProps[] = [
    {
      name: "code",
      label: "Form Id",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      type: "object",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("code")}>
          {sortData.code === "asc" ? (
            <ArrowDownIcon className="w-4 h-4 text-gray-700" />
          ) : (
            <ArrowUpIcon className="w-4 h-4 text-gray-700" />
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
      label: "Department",
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
            {value || "-"}
          </span>
        );
      }
    },
    {
      name: "formInfo.counter_party",
      label: "Counter Party",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("counter_party")}>
          {sortData.counter_party === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: AnyProp) => {
        return (
          <span
            title={value || "-"}
            className="max-w-[35ch] truncate text-sm font-normal text-gray-900 whitespace-nowrap inline-block"
          >
            {value || "-"}
          </span>
        );
      }
    },
    {
      name: "formInfo.monetary_value",
      label: "Monetary Value (AUD)",
      cellStyle: "text-[13px] text-right pr-2",
      headerStyle: "text-gray-900 font-semibold whitespace-nowrap w-10",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("monetary_value")}>
          {sortData.monetary_value === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: string) => {
        return value ? (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {Number(value).toLocaleString("en-AU")}
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-900">0</span>
        );
      }
    },
    {
      name: "formInfo.start_date",
      label: "Start Date",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold whitespace-nowrap",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("start_date")}>
          {sortData.start_date === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: string) => {
        return value ? (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {dayjs(value).format("DD/MM/YYYY")}
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-900">-</span>
        );
      }
    },
    {
      name: "formInfo.end_date",
      label: "End Date",
      cellStyle: "text-[13px]",
      headerStyle: "text-gray-900 font-semibold whitespace-nowrap",
      headerLabelIcon: (
        <button type="button" onClick={() => onClickSort("end_date")}>
          {sortData.end_date === "asc" ? (
            <ArrowDownIcon className="w-4 h-4" />
          ) : (
            <ArrowUpIcon className="w-4 h-5" />
          )}
        </button>
      ),
      formatter: (value: string) => {
        return value ? (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {dayjs(value).format("DD/MM/YYYY")}
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-900">-</span>
        );
      }
    },
    {
      name: "workflowName",
      label: "Workflow",
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
        return value ? (
          // <Badge label={formattedValue(value)} variant="purple" />
          <span
            className={
              "inline-flex items-center rounded-md bg-purple-100 text-purple-700 ring-purple-700/10 px-2 py-1 text-xs font-medium ring-1 ring-inset capitalize whitespace-nowrap"
            }
          >
            {value === "Cfo" || value === "CFO"
              ? "Chief Financial Officer"
              : value === "Ceo" || value === "CEO"
                ? "Chief Executive Officer"
                : value}
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-900">-</span>
        );
      }
    },
    {
      name: "status",
      label: "Status",
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
        return value ? (
          <BadgeComponent value={value} />
        ) : (
          <span className="text-sm font-normal text-gray-900">-</span>
        );
      }
    },
    {
      name: "createdAt",
      label: "Created At",
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
        return value ? (
          <span className="text-sm font-normal text-gray-900 whitespace-nowrap">
            {dateTimeFormatter_2(value)}
          </span>
        ) : (
          <span className="text-sm font-normal text-gray-900">-</span>
        );
      }
    },
    {
      name: "createdBy",
      label: "Created By",
      cellStyle: "text-sm font-normal text-gray-900 whitespace-nowrap",
      headerStyle: "text-gray-900 font-semibold"
    },
    {
      name: "Actions",
      label: "Actions        ",
      cellStyle: "pr-2",
      headerStyle: "text-gray-900 font-semibold",
      type: "object",
      formatter: (value: AnyProp) => {
        return (
          <div className="flex items-center gap-2 mt-1">
            {/* Delete Button */}
            <div
              className={
                selectedRequestTab?.type === "myRequest" &&
                (value.status === "draft" || value.status === "rejected")
                  ? "block"
                  : "invisible"
              }
            >
              <button
                className="w-4 h-4 text-gray-900 hover:text-red-500"
                type="button"
                title="Delete your form request"
                onClick={() => handleDeleteButtonClick(value._id, value.status)}
              >
                <TrashIcon />
              </button>
            </div>

            {/* History Button */}
            <div>
              <button
                className="w-4 h-4"
                type="button"
                title="History"
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
                  <title>You can view your form request history here</title>
                  <path
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
            </div>
          </div>
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
      const codePassed = item?.code?.toLowerCase()?.includes(debounceLoweCase);
      const couterPassed = item?.formInfo?.counter_party
        ?.toLowerCase()
        .includes(debounceLoweCase);
      return codePassed || couterPassed;
    });
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
      const filtered = FormsTabConst.filter(item =>
        selectedModule.permissions?.some((it: string) => it === item.id)
      );
      setSelectedRequestTabs(filtered);
      
      // Set default tab if no tab is selected
      if (!selectedRequestTab && filtered.length > 0) {
        const defaultTab = formTabStore || filtered[0];
        setSelectedRequestTab(defaultTab);
        setFormTab(defaultTab);
      }
    }
  }, [selectedModule]);

  const onTabChange = (item: TabProp) => {
    setSearchInput("");
    setSelectedRequestTab(item);
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
    setFormTab(item || FormsTabConst[0]);
    handleClearFilter();
  };

  const handleClearFilter = () => {
    dispatch({ type: "clear" });
    setSelectedDepartment(filterState?.departmentOptions);
    setSelectedWorkflow(filterState?.workflowOptions);
    setSelectedStatus(filterState?.statusOptions);
    setAlteredTableRes(tableRes);
  };

  const { data: formFilterData } = useGetFilterMeta(
    {
      queryParams: {
        emailId: emailId ? emailId : "",
        type: selectedRequestTab?.type ? selectedRequestTab?.type : "",
        moduleId: selectedModule?._id
      },
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    {
      enabled:
        !!formAdvanceFilterFlag && !!selectedModule?._id && !!selectedRequestTab?.type
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
    setTablePage({ currentPage: 1, startRow: 0, rowPerPage: 10 });
  };

  const onClickForm = (formId: string) => {
    const navBase = "finance/vendor-contract";
    const pageType = 
      (selectedRequestTab?.id === "view-my-requests-tab" && "myRequest") ||
      (selectedRequestTab?.id === "view-team-requests-tab" && "teamRequest") ||
      (selectedRequestTab?.id === "view-approve-request-tab" && "approveRequest") ||
      (selectedRequestTab?.id === "view-e-sign-requests-tab" && "esignRequest") ||
      (selectedRequestTab?.id === "view-my-approved-requests-tab" && "myApprovedList");
    
    router.navigate({
      to: `/${navBase}/requests/detail/${formId}`,
      search: {
        page: pageType,
        moduleId: selectedModule?._id
      }
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

  const childActionCb = (_: string) => {
    refetchGetFormList();
  };

  const handleDeleteButtonClick = (clickedFormId: string, clickedFormStatus: string) => {
    setFormDeleteId(clickedFormId);
    setShowDeleteAlert(true);
    setFormDeleteStatus(clickedFormStatus);
  };

  const handleDeleteValidation = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormDeleteReason(value);

    setErrors((prevErrors: AnyProp) => ({
      ...prevErrors,
      formDeleteReason: value.trim() === "" ? "Reason field is required!" : undefined
    }));
  };

  const deleteListForm = () => {
    return (
      <div className="flex flex-col py-5 gap-4">
        <div>
          {formDeleteStatus === "rejected" ? (
            <>
              <TextAreaLabel
                htmlFor={""}
                lblText=""
                placeholder="Kindly provide a reason for delete *"
                value={formDeleteReason}
                onChange={handleDeleteValidation}
                required={false}
                mainContainerStyle="col-span-2"
                style={{ minHeight: "40px" }}
              />
              {errors.formDeleteReason && (
                <p className="text-red-500 text-xs mt-1">{errors.formDeleteReason}</p>
              )}
            </>
          ) : undefined}
        </div>
      </div>
    );
  };

  const deleteCallback = async (actId: string, closeAlert?: () => void) => {
    alertClose = closeAlert ?? null;
    switch (actId) {
      case "cancel":
        alertClose?.();
        setFormDeleteReason("");
        setErrors({});
        break;
      case "delete":
        handleDelete();
        break;
    }
  };

  const handleDelete = () => {
    const newErrors: { formDeleteReason?: string } = {};
    if (formDeleteStatus === "rejected") {
      if (formDeleteReason.trim() === "") {
        newErrors.formDeleteReason = "Reason field is required!";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
    }

    if (
      formDeleteStatus === "rejected" ||
      (formDeleteStatus === "draft" && formDeleteId)
    ) {
      rejectOrDraftDeleteApiCall({
        pathParams: {
          id: formDeleteId ? formDeleteId : ""
        },
        queryParams: { moduleId: selectedModule?._id, comments: formDeleteReason },
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  };

  const { mutate: rejectOrDraftDeleteApiCall } = useDeleteFormById({
    onSuccess: response => {
      const successMsg = response.message;
      console.info(`${successMsg} - Success - rejectOrDraftDeleteApiCall: ${response}`);
      setFormDeleteReason("");
      setShowDeleteAlert(false);
      setRefreshPage(false);
      toast.success(response.message);
      // Invalidate the query for useGetFormList
      queryClient.invalidateQueries({
        queryKey: ["getFormList", emailId, selectedModule?._id, selectedRequestTab?.type]
      });

      // Update tableRes to remove the deleted record
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setTableRes((prev: any[]) =>
        prev.filter((item: AnyProp) => item._id !== formDeleteId)
      );
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      setAlteredTableRes((prev: any[]) =>
        prev.filter((item: AnyProp) => item._id !== formDeleteId)
      );
    },
    onError: (error: AnyProp) => {
      console.error(error, "Error rejectOrDraftDeleteApiCall");
      toast.error("We're having trouble with this request. Please try again later.");
    }
  });

  useEffect(() => {
    if (!financeDrawerOpen || !refreshPage) {
      console.log(`Form financeDrawerOpen:${financeDrawerOpen}`);
      queryClient.invalidateQueries();
    }
  }, [refreshPage, financeDrawerOpen, queryClient]);

  return (
    <>
      <div className="w-full">
        <div className=" w-full">
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

        <div className="mt-4 mb-4 px-8 md:px-8 flex flex-wrap md:flex-nowrap justify-between gap-4">
          <div className="w-full md:w-[400px]">
            <Input
              value={searchInput}
              className="text-sm pl-2 focus:border-slate-300 focus:ring-0"
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              variant={"default"}
              placeholder="Search by Form Id or Counter Party"
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
              <Button
                className="btn-new-form"
                leftIcon={<PlusCircleIcon className="text-white w-5 h-5" />}
                variant="green"
                size="sm"
                label="New Request"
                onClick={() => setFinanceDrawerOpen(true)}
              />
            )}
            <Button
              leftIcon={<AdjustmentsHorizontalIcon className="text-primary w-5 h-5" />}
              variant="green"
              //className="bg-green-600 text-white font-medium hover:bg-gray-500 hover:border-gray-500"
              size="sm"
              label="Advance Filter"
              onClick={() => handleClickAdvanceFilter()}
            />
          </div>
        </div>
        {
          <div className="mx-8">
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
              currentPageStyle="bg-green-600 text-white"
              rowButtonStyle="w-20"
              showPageInfo={true}
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
                  <MultiSelect
                    maxTextCount={8}
                    placeholder="Select Department"
                    values={filterState.department}
                    options={filterState.departmentOptions.sort((a, b) =>
                      a.label.localeCompare(b.label)
                    )}
                    onChangeCb={selectedOptions => {
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
                  <MultiSelect
                    maxTextCount={6}
                    placeholder="Select Workflow"
                    options={filterState.workflowOptions.sort((a, b) =>
                      a.label.localeCompare(b.label)
                    )}
                    values={filterState.workflow}
                    onChangeCb={selectedOptions => {
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
                  <MultiSelect
                    maxTextCount={8}
                    placeholder="Select Status"
                    options={filterState.statusOptions
                      .map(option => ({
                        ...option,
                        label:
                          option.label.charAt(0).toUpperCase() + option.label.slice(1)
                      }))
                      .sort((a, b) => a.label.localeCompare(b.label))}
                    values={filterState.status}
                    onChangeCb={selectedOptions => {
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
                    id="startDate"
                    autoComplete="off"
                    showIcon
                    calendarIconClassName="fill-primary-600 mr-2 mt-[2px]"
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
                    calendarIconClassName="fill-primary-600 mr-2 mt-[2px]"
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
        <ContractAddEditForm
          parentCB={childActionCb}
          type="add"
          setOpenDraw={val => setFinanceDrawerOpen(val)}
          openDraw={financeDrawerOpen}
        />
      }

      {
        <AlertLayout
          title="Warning: This will permanently delete the request. Are you sure?"
          icon={<ErrorIcon />}
          enableParentClose={true}
          additionalUiContents={deleteListForm()}
          buttonContents={deleteBtnActions}
          open={showDeleteAlert}
          setOpen={setShowDeleteAlert}
          btnActionCallBack={deleteCallback}
        />
      }
    </>
  );
};
