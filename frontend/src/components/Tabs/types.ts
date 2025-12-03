export interface Tab {
  name: string;
  current: boolean;
  value: string; // Add a value field to represent the actual tab value
}

export interface TabsProps {
  tabs: Tab[];
  onTabClick: (selectedTab: Tab) => void;
}
