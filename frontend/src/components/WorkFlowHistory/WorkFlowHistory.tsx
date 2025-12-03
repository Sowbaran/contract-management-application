import type { WorkFlowHistoryProps } from "./types";
import {
  PencilSquareIcon,
  BoltSlashIcon,
  BoltIcon,
  DocumentCheckIcon,
  HandRaisedIcon,
  StarIcon,
  CheckIcon,
  XMarkIcon
} from "@heroicons/react/20/solid";
import dayjs from "dayjs";
import { useState } from "react";
import { BadgeComponent } from "../Badge";
import {
  ArrowPathIcon,
  ClockIcon,
  EnvelopeIcon,
  MinusIcon,
  PlusIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import {
  ArrowLeftStartOnRectangleIcon,
  ArrowPathRoundedSquareIcon
} from "@heroicons/react/24/solid";

export function WorkFlowHistory(props: WorkFlowHistoryProps) {
  const data = props?.workflowHistory;
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>(
    {}
  );

  const formatTimestamp = (timestamp: number) => {
    return dayjs(timestamp).format("DD/MM/YYYY hh:mm A");
  };

  const toggleComments = (eventKey: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [eventKey]: !prev[eventKey]
    }));
  };

  const renderWorkFlow = (workflow: string, style: string, department: string) => {
    return (
      <p className={`${style}`}>
        {workflow} <b>{department !== "" ? `- ${department}` : department}</b>{" "}
      </p>
    );
  };

  return (
    <div className="flow-root p-1">
      <div className="overflow-y-auto max-h-[90vh] no-scrollbar">
        <ul className="mb-10">
          {data.map(event => {
            const eventKey = `${event.workflowName}-${event.createdAt}`;
            return (
              <li key={eventKey}>
                <div className="relative pb-2">
                  {data.indexOf(event) !== data.length - 1 ? (
                    <span
                      className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      {event.status === "draft" && (
                        <span className="bg-gray-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <PencilSquareIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "initiated" && (
                        <span className="bg-yellow-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <HandRaisedIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "recall" && (
                        <span className="bg-yellow-300 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <ArrowPathIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "approved" && (
                        <span className="bg-blue-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <CheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      )}
                      {event.status === "rejected" && (
                        <span className="bg-red-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <XMarkIcon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      )}
                      {event.status === "completed" && (
                        <span className="bg-green-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <DocumentCheckIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "fulfilled" && (
                        <span className="bg-pink-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <StarIcon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      )}
                      {(event.status === "esign-initiated" || event.status === "witness")  && (
                        <span className="bg-purple-500 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <PencilSquareIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "reset" && (
                        <span className="bg-purple-300 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <ArrowLeftStartOnRectangleIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "retriggered" && (
                        <span className="bg-purple-200 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <ArrowPathRoundedSquareIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "esign-declined" && (
                        <span className="bg-red-400 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <BoltSlashIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "esign-failed" && (
                        <span className="bg-red-400 h-6 w-6 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <BoltSlashIcon
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                          />
                        </span>
                      )}
                      {event.status === "esign-completed" && (
                        <span className="bg-green-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ml-1">
                          <BoltIcon className="h-4 w-4 text-white" aria-hidden="true" />
                        </span>
                      )}
                    </div>
                    <div className="p-4 bg-white shadow-sm rounded-lg border border-gray-200 justify-between space-x-4 flex-1">
                      {/* Top Section: Status Badge & Timestamp */}
                      <div className="flex justify-between items-center">
                        <BadgeComponent value={event.status} />
                        <div className="flex items-center text-gray-900 text-sm">
                          <ClockIcon className="w-4 h-4 mr-1" />
                          <time>
                            {event.createdAt && formatTimestamp(event.createdAt)}
                          </time>
                        </div>
                      </div>

                      {/* User Information */}
                      <div className="mt-2">
                        {event.approvedBy && (
                          <div className="flex items-center space-x-2">
                            <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                            <a
                              href={`mailto:${event.approvedBy}`}
                              className="text-blue-500 text-sm font-semibold"
                            >
                              {event.approvedBy}
                            </a>
                          </div>
                        )}
                        {event.workflowName && (
                          <div className="flex items-center space-x-2 mt-1">
                            <UserIcon className="w-4 h-4 text-gray-500" />
                            <p className="text-md text-gray-900 font-medium">
                              {renderWorkFlow(
                                event.workflowName,
                                "text-sm text-gray-600 font-medium",
                                event.status === "initiated" ? event.departmentName : ""
                              )}
                            </p>
                          </div>
                        )}
                        {event.behalfApprover && (
                          <p className="text-sm text-gray-900">{event.behalfApprover}</p>
                        )}
                      </div>

                      {/* Comment Box with Conditions */}
                      {event.comments && (
                        <div className="mt-4">
                          <textarea
                            disabled
                            className="w-full p-3 text-sm text-gray-500 bg-gray-100 border border-gray-300 rounded-md"
                            title={event.comments}
                            value={
                              expandedComments[eventKey]
                                ? event.comments
                                : event.comments.length > 80
                                  ? `${event.comments.substring(0, 80)}...`
                                  : event.comments
                            }
                          />
                          {event.comments.length > 80 && (
                            <button
                              type="button"
                              onClick={() => toggleComments(eventKey)}
                              className=" float-right ml-2 text-xs text-blue-500 hover:underline focus:outline-none"
                            >
                              {expandedComments[eventKey] ? (
                                <div className="flex flex-row items-center gap-1">
                                  <MinusIcon className="w-3 h-3" />
                                  <span>Show less</span>
                                </div>
                              ) : (
                                <div className="flex flex-row items-center gap-1">
                                  <PlusIcon className="w-3 h-3" />
                                  <span>Show more</span>
                                </div>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
