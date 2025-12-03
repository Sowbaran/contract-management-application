import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from "@heroicons/react/20/solid";
import type React from "react";
import { useEffect } from "react";
import type { AlertProps } from "./types";

type AlertType = "info" | "success" | "warning" | "error";

export function Alert({
  type,
  message,
  linkText,
  linkUrl,
  showDismiss,
  description,
  onDismiss,
  autoHideDuration
}: AlertProps) {
  const iconClasses = "h-5 w-5";
  const baseClasses = "rounded-md p-4 flex";
  const typeClasses: Record<
    AlertType,
    { container: string; icon: string; text: string; link: string }
  > = {
    info: {
      container: "bg-blue-50",
      icon: "text-blue-400",
      text: "text-blue-700",
      link: "text-blue-700 hover:text-blue-600"
    },
    success: {
      container: "bg-green-50",
      icon: "text-green-400",
      text: "text-green-800",
      link: "text-green-700 hover:text-green-600"
    },
    warning: {
      container: "bg-yellow-50",
      icon: "text-yellow-400",
      text: "text-yellow-800",
      link: "text-yellow-700 hover:text-yellow-600"
    },
    error: {
      container: "bg-red-50",
      icon: "text-red-400",
      text: "text-red-800",
      link: "text-red-700 hover:text-red-600"
    }
  };

  const icons: Record<AlertType, React.ReactNode> = {
    info: (
      <InformationCircleIcon
        className={`${iconClasses} ${typeClasses[type].icon}`}
        aria-hidden="true"
      />
    ),
    success: (
      <CheckCircleIcon
        className={`${iconClasses} ${typeClasses[type].icon}`}
        aria-hidden="true"
      />
    ),
    warning: (
      <ExclamationTriangleIcon
        className={`${iconClasses} ${typeClasses[type].icon}`}
        aria-hidden="true"
      />
    ),
    error: (
      <XCircleIcon
        className={`${iconClasses} ${typeClasses[type].icon}`}
        aria-hidden="true"
      />
    )
  };

  useEffect(() => {
    if (autoHideDuration) {
      const timer = setTimeout(() => {
        if (onDismiss) {
          onDismiss();
        }
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }

    // Default return value if autoHideDuration is falsy
    return undefined;
  }, [autoHideDuration, onDismiss]);

  return (
    <div className={`${baseClasses} ${typeClasses[type].container}`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="ml-3 flex-1 md:flex md:justify-between">
        <div>
          <p className={`text-sm ${typeClasses[type].text}`}>{message}</p>
          {description && (
            <div className="mt-2 text-sm">
              <p className={typeClasses[type].text}>{description}</p>
            </div>
          )}
        </div>
        {linkText && linkUrl && (
          <p className="mt-3 text-sm md:ml-6 md:mt-0">
            <a
              href={linkUrl}
              className={`whitespace-nowrap font-medium ${typeClasses[type].link}`}
            >
              {linkText}
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        )}
      </div>
      {showDismiss && (
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${typeClasses[type].container} focus:ring-offset-${type}-50`}
              onClick={onDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon
                className={`h-5 w-5 ${typeClasses[type].text}`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
