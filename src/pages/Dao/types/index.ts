export interface TosStakeList {
  lockId: string;
  periodWeeks: number;
  periodDays: number;
  end: boolean;
  lockedBalance: string;
  startTime: number;
  endTime: number;
  endDate: string;
  isBoosted: boolean;
}
