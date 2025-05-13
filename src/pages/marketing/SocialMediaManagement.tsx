
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import TabNavigation from "./components/social-media/TabNavigation";
import ContentPlannerTab from "./components/social-media/ContentPlannerTab";
import GenericTabContent from "./components/social-media/GenericTabContent";
import SubTabContent from "./components/social-media/SubTabContent";
import EditTargetDialog from "./components/social-media/EditTargetDialog";
import { useSocialMediaManagement } from "./hooks/useSocialMediaManagement";

const SocialMediaManagement = () => {
  const {
    activeTab,
    setActiveTab,
    activeSubTab,
    setActiveSubTab,
    selectedDate,
    setSelectedDate,
    selectedMonth,
    setSelectedMonth,
    isCalendarOpen,
    setIsCalendarOpen,
    isMonthSelectorOpen,
    setIsMonthSelectorOpen,
    isEditTargetOpen,
    setIsEditTargetOpen,
    editingManager,
    targetValue,
    setTargetValue,
    primaryTabs,
    secondaryTabs,
    contentManagers,
    getTabTitle,
    handlePreviousMonth,
    handleNextMonth,
    handleEditTarget,
    handleSaveTarget
  } = useSocialMediaManagement();

  // Render content based on active tab
  const renderTabContent = () => {
    if (activeTab === "content-planner") {
      return (
        <ContentPlannerTab
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          isCalendarOpen={isCalendarOpen}
          setIsCalendarOpen={setIsCalendarOpen}
          isMonthSelectorOpen={isMonthSelectorOpen}
          setIsMonthSelectorOpen={setIsMonthSelectorOpen}
          contentManagers={contentManagers}
          handleEditTarget={handleEditTarget}
          handlePreviousMonth={handlePreviousMonth}
          handleNextMonth={handleNextMonth}
        />
      );
    } else {
      return <GenericTabContent title={getTabTitle()} />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 max-w-7xl">
      {/* Primary Tab Navigation - Updated to be more compact */}
      <div className="bg-gray-50 rounded-md overflow-hidden border">
        <TabNavigation
          tabs={primaryTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Content Section */}
      {renderTabContent()}

      {/* Pagination */}
      <div className="flex justify-end">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" className="h-7 w-7 text-xs">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Secondary Tab Navigation */}
      <div className="bg-gray-50 rounded-md overflow-hidden border">
        <TabNavigation
          tabs={secondaryTabs}
          activeTab={activeSubTab}
          setActiveTab={setActiveSubTab}
          className="grid grid-cols-4 w-full"
        />
      </div>

      {/* Dashboard Content */}
      <SubTabContent activeSubTab={activeSubTab} />

      {/* Edit Target Dialog */}
      <EditTargetDialog
        isEditTargetOpen={isEditTargetOpen}
        setIsEditTargetOpen={setIsEditTargetOpen}
        selectedMonth={selectedMonth}
        targetValue={targetValue}
        setTargetValue={setTargetValue}
        handleSaveTarget={handleSaveTarget}
        editingManager={editingManager}
      />
    </div>
  );
};

export default SocialMediaManagement;
