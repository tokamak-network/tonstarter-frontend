import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchStarterURL} from 'constants/index';
import {AdminObject} from '@Admin/types';
import moment from 'moment';
import {ActiveProjectType, UpcomingProjectType, PastProjectType} from './types';
import starterActions from './actions';
interface StarterState {
  data: {
    activeProjects: ActiveProjectType[];
    upcomingProjects: UpcomingProjectType[];
    pastProjects: PastProjectType[];
    activeData: AdminObject[];
    upcomingData: AdminObject[];
    pastData: AdminObject[];
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
    if (
      loading !== 'pending' ||
      requestId !== currentRequestId ||
      library === undefined
    ) {
      return;
    }

    const starterReq = await fetch(fetchStarterURL)
      .then((res) => res.json())
      .then((result) => result);
    const starterData = starterReq.datas;

    const nowTimeStamp = moment().unix();

    const matchData = starterData.filter((data: AdminObject) =>
      chainId === 1
        ? data.production === 'production'
        : data.production === 'dev',
    );
    const activeData = matchData.filter(
      (data: AdminObject) =>
        data.position === 'active' &&
        data.saleContractAddress ===
          '0xEba7Ab0eAeB4656EbE4D045c68005e892699EC75',
      // data.position === 'active' && data.endOpenSaleTime > nowTimeStamp,
    );
    const upcomingData = matchData.filter(
      (data: AdminObject) => data.position === 'upcoming',
    );
    const pastData = matchData.filter(
      (data: AdminObject) => data.endOpenSaleTime < nowTimeStamp,
    );

    const activeProjects = await Promise.all(
      activeData.map(async (data: AdminObject) => {
        const address = data.saleContractAddress;
        const timeStamps = await starterActions.getTimeStamps({
          library,
          address,
        });
        const totalRaise = await starterActions.getTotalRaise({
          library,
          address,
        });
        const participant = await starterActions.getTimeStamps({
          library,
          address,
        });

        return {
          name: data.name,
          tokenName: data.tokenName,
          saleStart: moment
            .unix(timeStamps.startOpenSaleTime)
            .format('YYYY.MM.DD'),
          saleEnd: moment.unix(data.endOpenSaleTime).format('YYYY.MM.DD'),
          isExclusive:
            data.startExclusiveTime <= nowTimeStamp &&
            nowTimeStamp < data.startOpenSaleTime,
          tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
          projectTokenRatio: data.projectTokenRatio,
          projectFundingTokenRatio: data.projectFundingTokenRatio,
          saleContractAddress: address,
          startTime: timeStamps.startExclusiveTime,
          totalRaise,
          participant,
          step: timeStamps.checkStep,
        };
      }),
    );

    const upcomingProjects: UpcomingProjectType = upcomingData.map(
      (data: AdminObject) => {
        return {
          name: data.name,
          saleStart: moment.unix(data.startOpenSaleTime).format('YYYY.MM.DD'),
          saleEnd: moment.unix(data.endOpenSaleTime).format('YYYY.MM.DD'),
          tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
          saleContractAddress: data.saleContractAddress,
        };
      },
    );

    const pastProjects: PastProjectType = pastData.map((data: AdminObject) => {
      return {
        name: data.name,
        saleStart: moment.unix(data.startOpenSaleTime).format('YYYY.MM.DD'),
        saleEnd: moment.unix(data.endOpenSaleTime).format('YYYY.MM.DD'),
        saleContractAddress: data.saleContractAddress,
      };
    });

    console.log('*matchData*');
    console.log(matchData);

    return {
      activeProjects,
      upcomingProjects,
      pastProjects,
      activeData,
      upcomingData,
      pastData,
    };
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
