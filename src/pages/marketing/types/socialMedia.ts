
export interface ContentManager {
  name: string;
  dailyTarget: number;
  monthlyTarget: number;
  monthlyTargetAdjusted: number;
  progress: number;
  onTimeRate: number;
  effectiveRate: number;
  score: number;
}

export interface TabData {
  id: string;
  label: string;
}
