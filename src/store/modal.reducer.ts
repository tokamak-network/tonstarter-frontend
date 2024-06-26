import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './reducers';

type DaoModal = 'dao_stake' | 'dao_unstake' | 'dao_manage' | 'dao_claim';
type StakingModal =
  | 'stake'
  | 'unstake'
  | 'claim'
  | 'manage'
  | 'stakeL2'
  | 'unstakeL2'
  | 'withdraw'
  | 'swap'
  | 'airdrop'
  | 'stakePool'
  | 'unstakePool'
  | 'claimPool'
  | 'powerTonSwap'
  | 'pool_simulator';
type StarterModal = 'Starter_Approve';
type AdminModal = 'Admin_Distribute' | 'Admin_EditPool';
type AirdropModal = 'Airdrop_Claim' | 'Airdrop_Distribute';
type LaunchModal =
  | 'Launch_VaultBasicSetting'
  | 'Launch_VaultProps'
  | 'Launch_CreateVault'
  | 'Launch_ConfirmToken'
  | 'Launch_ConfirmVault'
  | 'Launch_PieChartModal'
  | 'Launch_CreateRewardProgram'
  | 'Launch_Download'
  | 'Launch_ConfirmTerms'
  | 'Launch_Swap'
  | 'Launch_Vesting'
  | 'Launch_ConfirmTokenSimplified'
  | 'Launch_EstimateGas'
  | 'Reschedule'
  | 'Launch_Warning'
  | 'Launch_AdvanceSwitch'
  | 'Launch_ListConfirm';

type GeneralModal = 'calendar';
type RewardModal = 'search' | 'information' | 'confirmMulticall';
export type ModalType =
  | StakingModal
  | DaoModal
  | GeneralModal
  | RewardModal
  | StarterModal
  | AdminModal
  | AirdropModal
  | LaunchModal;

export type Modal = {
  modal?: ModalType;
  data?: any;
};

type SubModalTypes =
  | 'confirm'
  | 'manage_stakeL2'
  | 'manage_unstakeL2'
  | 'manage_withdraw'
  | 'manage_swap'
  | undefined;

type SubModal = {
  type: SubModalTypes;
  data: any;
  isChecked: boolean;
};

interface IModal {
  data: Modal;
  sub: SubModal;
}

type ModalPayload = {
  type: ModalType;
  data?: any;
};

export type SubModalPayload = {
  type: SubModalTypes;
  isChecked?: boolean;
  data?: any;
};

const initialState = {
  data: {
    modal: undefined,
    data: {},
  },
  sub: {
    type: undefined,
    isChecked: false,
    data: {},
  },
} as IModal;

export const modalReducer = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state, {payload}: PayloadAction<ModalPayload>) => {
      state.data.modal = payload.type;
      state.data.data = payload.data;
    },
    closeModal: (state) => {
      state.data.modal = undefined;
      state.data.data = {};
    },
    openConfirm: (state, {payload}: PayloadAction<SubModalPayload>) => {
      state.sub.type = payload.type;
      state.sub.data = payload.data;
    },
    closeConfirmModal: (state) => {
      state.sub.type = undefined;
      state.sub.data = {};
    },
    checkedConfirm: (state) => {
      state.sub.isChecked = true;
    },
    resetConfirm: (state) => {
      state.sub.isChecked = false;
    },
  },
});

export const selectModalType = (state: RootState) => state.modal;
export const {
  openModal,
  closeModal,
  openConfirm,
  closeConfirmModal,
  checkedConfirm,
  resetConfirm,
} = modalReducer.actions;
