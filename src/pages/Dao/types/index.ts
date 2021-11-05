import {AdminObject} from '@Admin/types';

export interface TosStakeList {
  lockId: string;
  periodWeeks: number;
  periodDays: number;
  end: boolean;
  lockedBalance: string;
  startTime: number;
  endTime: number;
  endDate: string;
  withdrawn: boolean;
  reward: string;
}

// export interface ClaimList {
//   projectName: string;
//   contractAddress: string;
//   tokenName: string;
//   tokenAddress: string;
//   amount: string;
//   price: number;
// }

export type ClaimList = AdminObject & {
  amount: string;
  price: number;
};
