import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchStarterURL} from 'constants/index';
import {AdminObject} from '@Admin/types';
import moment from 'moment';
import {
  ActiveProjectType,
  UpcomingProjectType,
  PastProjectType,
  // MyProject,
} from './types';
// import starterActions from './actions';
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
  async ({chainId, library}: any, {requestId, getState}) => {
    //@ts-ignore
    const {currentRequestId, loading} = getState().starters;
    if (loading !== 'pending' || requestId !== currentRequestId) {
      return;
    }

    const starterReq = await fetch(fetchStarterURL)
      .then((res) => res.json())
      .then((result) => result);

    const starterData = starterReq.datas;

    const nowTimeStamp = moment().unix();

    // const matchData = starterData.filter((data: AdminObject) =>
    //   chainId === 1
    //     ? data.production === 'production'
    //     : data.production === 'dev',
    // );

    try {
      const matchData = starterData;

      const activeData = matchData.filter(
        (data: AdminObject) => data.position === 'active',
      );
      const upcomingData = matchData.filter(
        (data: AdminObject) => data.position === 'upcoming',
      );
      const pastData = matchData.filter(
        (data: AdminObject) => data.endDepositTime < nowTimeStamp,
      );

      const myProjects = matchData.filter(
        (data: AdminObject) => data.position === 'active',
      );

      const activeProjects = await Promise.all(
        activeData.map(async (data: AdminObject) => {
          const address = data.saleContractAddress;

          // const totalRaise = library
          //   ? await starterActions.getTotalRaise({
          //       library,
          //       address,
          //     })
          //   : 'XXX,XXX';
          // const tokenInfo = library
          //   ? await starterActions.getTokenInfo({
          //       library,
          //       address: data.tokenAddress,
          //     })
          //   : {totalSupply: 'XXX,XXX'};

          // const tokenAllocation = library
          //   ? await starterActions.getTokenAllocation({
          //       library,
          //       address,
          //     })
          //   : 'XXX,XXX';

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
            saleStart:
              checkStep === 'whitelist' || checkStep === 'exclusive'
                ? moment.unix(data.startExclusiveTime).format('YYYY.MM.DD')
                : moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd:
              checkStep === 'whitelist' || checkStep === 'exclusive'
                ? moment.unix(data.endExclusiveTime).format('YYYY.MM.DD')
                : moment.unix(data.endDepositTime).format('YYYY.MM.DD'),
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

      const upcomingProjects: UpcomingProjectType = upcomingData.map(
        (data: AdminObject) => {
          return {
            name: data.name,
            saleStart: moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd: moment.unix(data.endDepositTime).format('YYYY.MM.DD'),
            tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
            saleContractAddress: data.saleContractAddress,
          };
        },
      );

      const pastProjects: PastProjectType = pastData.map(
        (data: AdminObject) => {
          return {
            name: data.name,
            saleStart: moment.unix(data.startDepositTime).format('YYYY.MM.DD'),
            saleEnd: moment.unix(data.endDepositTime).format('YYYY.MM.DD'),
            saleContractAddress: data.saleContractAddress,
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
        rawData: starterData,
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
      const {requestId} = action.meta;
      if (state.loading === 'pending' && state.currentRequestId === requestId) {
        state.loading = 'idle';
        state.data = action.payload;
        state.currentRequestId = undefined;
      }
    },
    [fetchStarters.rejected.type]: (state, action) => {
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
export const selectStarters = (state: RootState) => state.starters;
