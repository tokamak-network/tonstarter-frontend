// export const fetchTosStakes = () => {
//   return null;
// };

import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {RootState} from 'store/reducers';
import {fetchStarterURL} from 'constants/index';
import {AdminObject} from '@Admin/types';
import moment from 'moment';
import {ActiveProjectType, UpcomingProjectType, PastProjectType} from './types';

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
  async ({chainId}: any, {requestId, getState}) => {
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

    const matchData = starterData.filter((data: AdminObject) =>
      chainId === 1
        ? data.production === 'production'
        : data.production === 'dev',
    );
    const activeData = matchData.filter(
      (data: AdminObject) => data.position === 'active',
    );
    const upcomingData = matchData.filter(
      (data: AdminObject) => data.position === 'upcoming',
    );
    const pastData = matchData.filter(
      (data: AdminObject) => data.saleEndTime < nowTimeStamp,
    );

    const activeProjects: ActiveProjectType = activeData.map(
      (data: AdminObject) => {
        return {
          name: data.name,
          saleStart: moment.unix(data.saleStartTime).format('YYYY.MM.DD'),
          saleEnd: moment.unix(data.saleEndTime).format('YYYY.MM.DD'),
          isExclusive:
            data.exclusiveStartTime <= nowTimeStamp &&
            nowTimeStamp < data.saleStartTime,
          tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
          projectTokenRatio: data.projectTokenRatio,
          projectFundingTokenRatio: data.projectFundingTokenRatio,
        };
      },
    );

    const upcomingProjects: UpcomingProjectType = upcomingData.map(
      (data: AdminObject) => {
        return {
          name: data.name,
          saleStart: moment.unix(data.saleStartTime).format('YYYY.MM.DD'),
          saleEnd: moment.unix(data.saleEndTime).format('YYYY.MM.DD'),
          tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
          sector: 'defi',
        };
      },
    );

    const pastProjects: PastProjectType = pastData.map((data: AdminObject) => {
      return {
        name: data.name,
        saleStart: moment.unix(data.saleStartTime).format('YYYY.MM.DD'),
        saleEnd: moment.unix(data.saleEndTime).format('YYYY.MM.DD'),
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
