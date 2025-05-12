
import React from "react";
import { useNavigate } from "react-router-dom";

interface SecondaryTabProps {
  tabs: Array<{
    id: string;
    label: string;
    path: string;
  }>;
  activeTab: string;
}

export const SecondaryTabNavigation: React.FC<SecondaryTabProps> = ({
  tabs,
  activeTab
}) => {
  const navigate = useNavigate();

  const handleTabClick = (tabId: string, path: string) => {
    navigate(path);
  };

  return (
    <div className="bg-gray-50 rounded-md overflow-hidden border">
      <div className="grid grid-cols-4 w-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id, tab.path)}
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
              {tab.id === "dashboard" ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" 
                />
              ) : tab.id === "create-content" ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M12 4v16m8-8H4" 
                />
              ) : tab.id === "content-bank" ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" 
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              )}
            </svg>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
