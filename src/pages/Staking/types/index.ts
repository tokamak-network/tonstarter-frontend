import {TokenType} from 'types/index';

export type L2Status = {
  canUnstake: boolean;
  canWithdraw: boolean;
  canSwap: boolean;
};

export type Vault = {
  res: [];
  saleClosed: boolean;
  period: Object;
};

export type Stake = {
  name?: string;
  symbol?: string;
  paytoken: string;
  contractAddress: string;
  blockTotalReward: string;
  saleClosed: boolean;
  stakeType: number | string;
  stakeContract: string[];
  balance: Number | string;
  totalRewardAmount: Number | string;
  claimRewardAmount: Number | string;
  totalStakers: number | string;
  token: TokenType;
  withdrawalDelay: string;
  mystaked: Number | string;
  claimableAmount: Number | string;
  myearned: Number | string;
  stakeBalanceTON: string;
  staketype: string;
  period: string;
  status: string;
  library: any;
  fetchBlock: number | undefined;
  saleStartTime: string | undefined;
  saleEndTime: string | undefined;
  miningStartTime: string | undefined;
  miningEndTime: string | undefined;
  vault: string;
  ept: any;
  L2status: L2Status;
};
