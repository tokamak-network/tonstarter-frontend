import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {VaultName, VaultSchedule, VaultType} from '@Launch/types';
import { StepNumber } from '@Launch/types';
interface LaunchState {
  data: {
    selectedVault: VaultName;
    selectedVaultType: VaultType;
    selectedVaultIndex: number | undefined;
    projects: any;
    tempVaultData: any;
    hashKey: string | undefined;
    alreadySelected: number[] | undefined;
    currentDeployStep:number;
    mode: string;
    projectStep: StepNumber;
    tempProjectData: any;
    err: {
      tokenDetail: {
        name: boolean;
      };
    };
    onBlur: {
      tokenDetail: boolean;
      claimRound: boolean;
    };
    claimRoundTable: VaultSchedule[] | undefined;
    uncompletedVaultIndex:
      | {
          step2FilledOut: boolean[];
          result: boolean;
          fileds: any[];
        }
      | undefined;
    tempHash: string | undefined;
    
  };
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    selectedVault: 'Public',
    selectedVaultType: 'Public',
    selectedVaultIndex: 0,
    alreadySelected: undefined,
    projects: [],
    tempVaultData: {},
    hashKey: undefined,
    currentDeployStep:0,
    mode: 'simplified',
    projectStep: 1,
    tempProjectData: {},
    err: {
      tokenDetail: {},
    },
    onBlur: {
      tokenDetail: false,
      claimRound: false,
    },
    claimRoundTable: undefined,
    uncompletedVaultIndex: undefined,
    tempHash: undefined,
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as LaunchState;

type VaultPayload = {
  data: VaultName;
  vaultType: VaultType;
  vaultIndex?: number | undefined;
};

type ProjectPayload = {
  data: any;
};

export const selectVault = createAsyncThunk(
  'launch/selectVault',
  ({vaultName}: {vaultName: VaultName}, {requestId, getState}) => {
    const {currentRequestId, loading} = (getState as any)().dao;

    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    return {selectedVault: vaultName};
  },
);

export const launchReducer = createSlice({
  name: 'launch',
  initialState,
  reducers: {
    changeVault: (state, {payload}: PayloadAction<VaultPayload>) => {
      state.data.selectedVault = payload.data;
      state.data.selectedVaultType = payload.vaultType;
      state.data.selectedVaultIndex = payload.vaultIndex;
      state.data.alreadySelected = state.data.alreadySelected
        ? ([...state.data.alreadySelected, payload.vaultIndex] as number[])
        : ([0, payload.vaultIndex] as number[]);
    },
    fetchProjects: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.projects = payload.data;
    },
    saveTempVaultData: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.tempVaultData = payload.data;
    },
    setErr: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.err = payload.data;
    },
    setHashKey: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.hashKey = payload.data;
    },
    setBlur: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.onBlur = payload.data;
    },
    setClaimRoundTable: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.claimRoundTable = payload.data;
    },
    setUncompletedVaultIndex: (
      state,
      {payload}: PayloadAction<ProjectPayload>,
    ) => {
      state.data.uncompletedVaultIndex = payload.data;
    },
    setTempHash: (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.tempHash = payload.data;
    },
    setCurrentDeployStep: (state, {payload}:PayloadAction<ProjectPayload>) => {
      state.data.currentDeployStep = payload.data
    },
    setMode: (state, {payload}:PayloadAction<ProjectPayload>) => {
      state.data.mode = payload.data
    },
    setProjectStep: (state, {payload}:PayloadAction<ProjectPayload>) => {
      state.data.projectStep = payload.data
    },
      saveTempProjectData:  (state, {payload}: PayloadAction<ProjectPayload>) => {
      state.data.tempProjectData = payload.data;
    },
  },
  extraReducers: {
    [selectVault.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [selectVault.fulfilled.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [selectVault.rejected.type]: (state, action) => {
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});
// @ts-ignore
export const selectLaunch = (state: RootState) => state.launch;
export const {
  changeVault,
  fetchProjects,
  saveTempVaultData,
  setErr,
  setHashKey,
  setBlur,
  setClaimRoundTable,
  setUncompletedVaultIndex,
  setTempHash,
  setCurrentDeployStep,
  setMode,
  setProjectStep,
  saveTempProjectData
} = launchReducer.actions;
