import type { WorkFlowStagesProps } from "./types";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from "@heroicons/react/24/solid";

const formatName = (name?: string): string => {
  if (!name) return "";

  const replacements: { regex: RegExp; replacement: string }[] = [
    { regex: /Executive General Manager$/, replacement: "EGM" },
    { regex: /General Manager$/, replacement: "GM" },
    { regex: /Technology Admin$/, replacement: "Technology" },
    { regex: /Legal Admin$/, replacement: "Legal" },
    { regex: /Insurance Admin$/, replacement: "Insurance" },
    { regex: /Finance Admin$/, replacement: "Finance" }
  ];

  for (const { regex, replacement } of replacements) {
    if (regex.test(name)) {
      return name.replace(regex, replacement);
    }
  }

  return name;
};

export function WorkFlowStages(props: WorkFlowStagesProps) {
  const steps = props.steps || [];
  const status = props.status;

  return (
    <div className="w-full overflow-x-auto p-4">
      <div
        className={`flex items-center ${
          steps.length !== 1 && "lg:ml-14"
        } lg:justify-center md:justify-center space-x-4 whitespace-nowrap`}
      >
        {steps?.map((step, index) => {
          const stepClasses = `
            flex items-center space-x-2 rounded-full px-4 py-2  text-sm font-medium border
            ${
              step?.status === "completed"
                ? "bg-green-100 border-green-500 text-green-700"
                : ""
            }
            ${
              step?.status === "rejected"
                ? "bg-red-100 border-red-500 text-red-700 shadow-md"
                : ""
            }
            ${
              step?.status === "pending"
                ? "bg-yellow-100 border-yellow-500 text-yellow-700 shadow-md"
                : ""
            }
            ${
              step?.status === "current"
                ? "bg-blue-100 border-blue-500 text-blue-700 shadow-md"
                : ""
            }
            ${
              !step?.status || step?.status === "default"
                ? "bg-gray-100 border-gray-400 text-gray-700"
                : ""
            }
          `;

          let lineColor = "bg-gray-300";
          if (step?.status === "completed") lineColor = "bg-green-500";
          else if (step?.status === "rejected") lineColor = "bg-red-500";
          else if (step?.status === "pending") lineColor = "bg-yellow-500";
          else if (step?.status === "current") lineColor = "bg-blue-500";

          const initatedStatus = () => {
            switch (status) {
              case "rejected":
                return "bg-yellow-500";
              default:
                return "bg-green-500 text-white";
            }
          };

          const endStatus = () => {
            switch (status) {
              case "fulfilled":
              case "completed":
                return "bg-green-500 text-white";
              default:
                return "bg-gray-300";
            }
          };

          return (
            <div key={step?.name} className="flex items-center space-x-2">
              {index === 0 && (
                <>
                  <div>
                    <div className="flex justify-center items-center mt-1">
                      <label className={`flex items-center space-x-2 rounded-full px-4 py-2 ${initatedStatus()} text-sm font-medium border`}>Initiated</label>
                    </div>
                  </div>
                  <div
                    className={`${
                      steps.length === 1 ? "sm:w-10 lg:w-96 md:w-16" : "w-10"
                    } h-[1px] ${lineColor} rounded-full`}
                  />
                </>
              )}
              <div className={stepClasses}>
                {step?.status === "completed" && (
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                )}
                {step?.status === "rejected" && (
                  <XCircleIcon className="h-5 w-5 text-red-600" />
                )}
                {step?.status === "pending" && (
                  <ExclamationCircleIcon className="h-5 w-5 text-yellow-600" />
                )}

                <span>{steps.length > 1 ? formatName(step?.name) : step?.name}</span>
              </div>
              {index === steps.length - 1 && (
                <>
                  <div
                    className={`${
                      steps.length === 1 ? "sm:w-10 lg:w-96 md:w-16 h-[1px]" : "w-10"
                    } h-[1px] ${endStatus()} rounded-full`}
                  />
                  <div className=" mb-6 flex flex-col items-center">
                    

                    {/* <div className={`h-5 w-5 mt-1 rounded-full ${endStatus()}`} /> */}
                  </div>
                  <div className="flex justify-center items-center mt-1">
                      <label className={`flex items-center space-x-2 rounded-full px-4 py-2 ${endStatus()} text-sm font-medium border`}>End</label>
                    </div>
                  
                </>
              )}

              {index !== steps.length - 1 && (
                <div className={`w-10 h-[1px] ${lineColor} rounded-full`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
