
import React from "react";
import { TabData } from "../../types/socialMedia";

interface TabNavigationProps {
  tabs: TabData[];
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  className?: string;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  setActiveTab,
  className = "grid grid-cols-3 w-full"
}) => {
  return (
    <div className={className}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-2 px-3 text-center text-sm transition-all duration-200 flex items-center justify-center gap-1 ${
            activeTab === tab.id 
              ? "bg-white text-gray-800 font-medium" 
              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
