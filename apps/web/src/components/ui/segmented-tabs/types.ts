export interface SegmentedTab<T extends string = string> {
  id: T;
  label: string;
}

export interface SegmentedTabsProps<T extends string = string> {
  tabs: SegmentedTab<T>[];
  activeTab: T;
  onChange: (tab: T) => void;
  className?: string;
}
