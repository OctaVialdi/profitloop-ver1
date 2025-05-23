
import { useState, useCallback, useMemo } from "react";
import { ContentManager } from "../types/socialMedia";
import { addMonths, subMonths } from "date-fns";

export const useSocialMediaManagement = () => {
  const [activeTab, setActiveTab] = useState<string>("content-planner");
  const [activeSubTab, setActiveSubTab] = useState<string>("dashboard");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isMonthSelectorOpen, setIsMonthSelectorOpen] = useState(false);
  const [isEditTargetOpen, setIsEditTargetOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<ContentManager | null>(null);
  const [targetValue, setTargetValue] = useState<string>("20");
  
  // Memoize static data
  const primaryTabs = useMemo(() => [
    { id: "content-planner", label: "Content Planner" },
    { id: "production", label: "Production" },
    { id: "content-post", label: "Content Post" }
  ], []);

  const secondaryTabs = useMemo(() => [
    { id: "dashboard", label: "Dashboard" },
    { id: "create-content", label: "Create Content" },
    { id: "content-bank", label: "Content Bank" },
    { id: "content-qc", label: "Content QC" }
  ], []);

  const contentManagers = useMemo(() => [
    {
      name: "John Doe",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 20,
      progress: 75,
      onTimeRate: 80,
      effectiveRate: 90,
      score: 82
    },
    {
      name: "Jane Smith",
      dailyTarget: 20,
      monthlyTarget: 20,
      monthlyTargetAdjusted: 15,
      progress: 80,
      onTimeRate: 70,
      effectiveRate: 85,
      score: 78
    },
    {
      name: "Mike Johnson",
      dailyTarget: 15,
      monthlyTarget: 15,
      monthlyTargetAdjusted: 18,
      progress: 65,
      onTimeRate: 75,
      effectiveRate: 80,
      score: 76
    },
    {
      name: "Sara Williams",
      dailyTarget: 18,
      monthlyTarget: 18,
      monthlyTargetAdjusted: 20,
      progress: 85,
      onTimeRate: 85,
      effectiveRate: 88,
      score: 86
    }
  ], []);

  // Memoize computed values
  const getTabTitle = useCallback(() => {
    switch (activeTab) {
      case "content-planner":
        return "Target Quantity Content Planner";
      case "production":
        return "Target Quantity Production Team";
      case "content-post":
        return "Target Quantity Post Content";
      default:
        return "Social Media Management";
    }
  }, [activeTab]);

  // Memoize handler functions
  const handlePreviousMonth = useCallback(() => {
    setSelectedMonth(prevMonth => subMonths(prevMonth, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setSelectedMonth(prevMonth => addMonths(prevMonth, 1));
  }, []);

  const handleEditTarget = useCallback((manager: ContentManager) => {
    setEditingManager(manager);
    setTargetValue(manager.monthlyTargetAdjusted.toString());
    setIsEditTargetOpen(true);
  }, []);

  const handleSaveTarget = useCallback(() => {
    setIsEditTargetOpen(false);
    setEditingManager(null);
  }, []);

  return {
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
  };
};
