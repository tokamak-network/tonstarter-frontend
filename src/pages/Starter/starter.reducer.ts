import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'store/reducers';
import { fetchStarterURL } from 'constants/index';
import { AdminObject } from '@Admin/types';
import moment from 'moment';
import {
  ActiveProjectType,
  UpcomingProjectType,
  PastProjectType,
  // MyProject,
} from './types';
import { convertLocaleString } from 'utils';
// import starterActions from './actions';
import { REACT_APP_MODE } from 'constants/index';

interface StarterState {
  data: {
    activeProjects: ActiveProjectType[];
    upcomingProjects: UpcomingProjectType[];
    pastProjects: PastProjectType[];
    activeData: AdminObject[];
    upcomingData: AdminObject[];
    pastData: AdminObject[];
    myProjects: any[];
    rawData: any[];
    // myProject: MyProject[];
  };
  loading: 'idle' | 'pending';
  error: any;
  currentRequestId?: string;
}

const initialState = {
  data: {
    activeProjects: [],
    upcomingProjects: [],
    pastProjects: [],
    activeData: [],
    upcomingData: [],
    pastData: [],
    myProjects: [],
    rawData: [],
  },
  loading: 'idle',
  error: null,
  currentRequestId: undefined,
} as StarterState;

export const fetchStarters = createAsyncThunk(
  'app/starters',
  // @ts-ignore
  async ({ chainId, library }: any, { requestId, getState }) => {
    //@ts-ignore
    const { currentRequestId, loading } = getState().starters;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const starterReq = await fetch(fetchStarterURL)
      .then((res) => res.json())
      .then((result) => result);

    const starterData = starterReq.datas.filter((data: AdminObject) =>
      REACT_APP_MODE === 'PRODUCTION' ? data.production === 'production' : data,
    );

    const nowTimeStamp = moment().unix();

    // const matchData = starterData.filter((data: AdminObject) =>
    //  data.production === 'production'
    // );

    try {
      const matchData = starterData;

      const activeData = matchData.filter(
        (data: AdminObject) => data.endDepositTime > nowTimeStamp,
      );

      //remove upcomingData
      // const upcomingData = matchData.filter(
      //   (data: AdminObject) => data.snapshot > nowTimeStamp,
      // );

      const upcomingData: any = [];
      const pastData = matchData.filter(
        (data: AdminObject) => data.endDepositTime < nowTimeStamp,
      );

      const myProjects = matchData.filter(
        (data: AdminObject) => data.position === 'active',
      );

      const activeProjects = await Promise.all(
        activeData.map(async (data: AdminObject) => {
          const address = data.saleContractAddress;
          const nowTimeStamp = moment().unix();

          // const dummy = 1634804360;

          // const {
          //   startAddWhiteTime,
          //   endAddWhiteTime,
          //   startExclusiveTime,
          //   endExclusiveTime,
          //   startDepositTime,
          //   endDepositTime,
          // } = {
          //   startAddWhiteTime: dummy,
          //   endAddWhiteTime: dummy + 60,
          //   startExclusiveTime: dummy + 61,
          //   endExclusiveTime: dummy + 120,
          //   startDepositTime: dummy + 121,
          //   endDepositTime: dummy + 180,
          // };

          const {
            startAddWhiteTime,
            endAddWhiteTime,
            startExclusiveTime,
            endExclusiveTime,
            startDepositTime,
            endDepositTime,
            snapshot,
          } = data;

          const checkStep =
            endAddWhiteTime > nowTimeStamp
              ? 'whitelist'
              : endExclusiveTime > nowTimeStamp
                ? 'exclusive'
                : endDepositTime > nowTimeStamp
                  ? 'deposit'
                  : 'past';

          const timeStamps = {
            startAddWhiteTime,
            endAddWhiteTime,
            startExclusiveTime,
            endExclusiveTime,
            startDepositTime,
            endDepositTime,
            snapshot,
            checkStep,
          };

          // const {
          //   startExclusiveTime,
          //   endExclusiveTime,
          //   startDepositTime,
          //   endDepositTime,
          //   // startOpenSaleTime,
          //   // endOpenSaleTime,
          //   checkStep,
          // } = timeStamps;

          return {
            name: data.name,
            tokenName: data.tokenName,
            tokenSymbolImage: data.tokenSymbolImage,
            saleStart:
              checkStep === 'whitelist'
                ? moment.unix(data.startAddWhiteTime).format('YYYY.MM.DD')
                : checkStep === 'exclusive'
                  ? moment.unix(data.startExclusiveTime).format('YYYY.MM.DD')
                  : moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd:
              checkStep === 'whitelist'
                ? moment.unix(data.endAddWhiteTime).format('MM.DD')
                : checkStep === 'exclusive'
                  ? moment.unix(data.endExclusiveTime).format('MM.DD')
                  : moment.unix(data.endDepositTime).format('MM.DD'),
            isExclusive:
              checkStep === 'whitelist' || checkStep === 'exclusive'
                ? true
                : false,
            tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
            projectTokenRatio: data.projectTokenRatio,
            projectFundingTokenRatio: data.projectFundingTokenRatio,
            tokenCalRatio:
              data.projectFundingTokenRatio / data.projectTokenRatio,
            saleContractAddress: address,
            startTime: data.startExclusiveTime,
            // totalRaise,
            timeStamps,
            step: checkStep,
            // tokenInfo,
            tokenAllocation: Number(data.tokenAllocationAmount).toLocaleString(
              undefined,
              {
                minimumFractionDigits: 0,
              },
            ),
          };
        }),
      );

      const upcomingProjects: UpcomingProjectType[] = upcomingData.map(
        (data: AdminObject) => {
          return {
            name: data.name,
            saleStart: moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd: moment.unix(data.endDepositTime).format('MM.DD'),
            tokenAllocationAmount: isNaN(parseFloat(data.tokenAllocationAmount))
              ? data.tokenAllocationAmount
              : convertLocaleString(data.tokenAllocationAmount, 0),
            saleContractAddress: data.saleContractAddress,
            tokenImage: data.tokenSymbolImage,
            tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,

          };
        },
      );

      const pastProjects: PastProjectType = pastData.map(
        (data: AdminObject) => {
          return {
            name: data.name,
            saleStart: moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd: moment.unix(data.endDepositTime).format('MM.DD'),
            saleContractAddress: data.saleContractAddress,
            tokenSymbolImage: data.tokenSymbolImage,
            fundingTokenType: data.fundingTokenType,
            tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
            tokenCalRatio:data.projectFundingTokenRatio / data.projectTokenRatio,
          };
        },
      );

      return {
        activeProjects,
        upcomingProjects,
        pastProjects,
        activeData,
        upcomingData,
        pastData,
        myProjects,
        rawData: starterData.map((projectData: AdminObject) => {
          return {
            ...projectData,
            tokenExRatio:
              projectData.projectTokenRatio /
              projectData.projectFundingTokenRatio,
          };
        }),
      };
    } catch (e) {
      console.log(e);
    }
  },
);

export const starterReducer = createSlice({
  name: 'starter',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchStarters.pending.type]: (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending';
        state.currentRequestId = action.meta.requestId;
      }
    },
    [fetchStarters.fulfilled.type]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStarters.rejected.type]: (state, action) => {
      const { requestId } = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.error = action.error;
        state.currentRequestId = undefined;
      }
    },
  },
});

// @ts-ignore
export const selectStarters = (state: RootState) => state.starters;
