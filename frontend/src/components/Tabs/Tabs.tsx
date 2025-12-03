import { useNavigate } from "@tanstack/react-router";
import type { Tab, TabsProps } from "./types";

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Tabs(props: TabsProps) {
  const navigate = useNavigate();

  const handleTabClick = (selectedTab: Tab) => {
    props.onTabClick(selectedTab);
    navigate({
      search: (old) => ({
        ...old,
        tab: selectedTab.value.toLowerCase(),
      }),
    });
  };

  return (
    <div className="overflow-x-auto flex px-2 pt-2 space-x-8 rounded">
      {props.tabs.map((tab) => (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <p
          key={tab.name}
          onClick={() => handleTabClick(tab)}
          className={classNames(
            tab.current
              ? "border-green-500 text-green-600 active whitespace-nowrap border-b-2 px-1 pb-1 text-sm font-medium "
              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 whitespace-nowrap cursor-pointer",
            "whitespace-nowrap border-b-2 px-1 pb-1 text-sm font-medium"
          )}
          aria-current={tab.current ? "page" : undefined}
        >
          {tab.name}
        </p>
      ))}
    </div>
  );
}
