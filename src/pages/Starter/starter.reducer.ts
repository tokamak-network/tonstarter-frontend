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
import starterActions from './actions';
interface StarterState {
  data: {
    activeProjects: ActiveProjectType[];
    upcomingProjects: UpcomingProjectType[];
    pastProjects: PastProjectType[];
    activeData: AdminObject[];
    upcomingData: AdminObject[];
    pastData: AdminObject[];
    myProjects: any[];
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
    let starterData = starterReq.datas;

    starterData = [
      {
        adminAddress: '0x8c595DA827F4182bC0E3917BccA8e654DF8223E1',
        chainId: 4,
        claimInterval: 0,
        claimPeriod: 0,
        del: false,
        description:
          'Co-ordinate campaigns and product launches, with improved overall communication and collaboration for your whole team. Hardware, tech, make announcements and build awareness among some of the hardest consumers in the world to reach.',
        discord: '',
        endAddWhiteTime: 0,
        endDepositTime: 0,
        endExclusiveTime: 0,
        endOpenSaleTime: 0,
        image: '',
        medium: 'https://dooropen.space/',
        name: 'DOOR OPEN',
        position: 'active',
        production: 'dev',
        projectFundingTokenRatio: 600,
        projectTokenRatio: 1,
        saleContractAddress: '0x865200f8172bf55f99b53A8fa0E26988b94dfBbE',
        snapshot: 0,
        startAddWhiteTime: 0,
        startClaimTime: 0,
        startDepositTime: 0,
        startExclusiveTime: 0,
        startOpenSaleTime: 0,
        telegram: 'https://dooropen.space/',
        tokenAddress: '0xb109f4c20BDb494A63E32aA035257fBA0a4610A4',
        tokenFundRaisingTargetAmount: '10000000',
        tokenFundingRecipient: '0x8c595DA827F4182bC0E3917BccA8e654DF8223E1',
        tokenName: 'DOC',
        tokenSymbol: 'DOC',
        tokenSymbolImage:
          'https://tonstarter-symbols.s3.ap-northeast-2.amazonaws.com/DOC.png',
        twitter: 'https://dooropen.space/',
        vestingContractAddress: '0x865200f8172bf55f99b53A8fa0E26988b94dfBbE',
        website: 'https://dooropen.space/',
      },
    ];

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
      (data: AdminObject) => data.endOpenSaleTime < nowTimeStamp,
    );

    const myProjects = matchData.filter(
      (data: AdminObject) => data.position === 'active',
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

        const {
          startAddWhiteTime,
          endWhiteListTime,
          startExclusiveTime,
          endExclusiveTime,
          startDepositTime,
          endDepositTime,
          // startOpenSaleTime,
          // endOpenSaleTime,
          checkStep,
        } = timeStamps;

        return {
          name: data.name,
          tokenName: data.tokenName,
          saleStart:
            checkStep === 'whitelist' || checkStep === 'exclusive'
              ? moment.unix(startExclusiveTime).format('YYYY.MM.DD')
              : moment.unix(startDepositTime).format('YYYY.MM.DD'),
          saleEnd:
            checkStep === 'whitelist' || checkStep === 'exclusive'
              ? moment.unix(endExclusiveTime).format('YYYY.MM.DD')
              : moment.unix(endDepositTime).format('YYYY.MM.DD'),
          isExclusive:
            checkStep === 'whitelist' || checkStep === 'exclusive'
              ? true
              : false,
          tokenFundRaisingTargetAmount: data.tokenFundRaisingTargetAmount,
          projectTokenRatio: data.projectTokenRatio,
          projectFundingTokenRatio: data.projectFundingTokenRatio,
          saleContractAddress: address,
          startTime: timeStamps.startExclusiveTime,
          totalRaise,
          timeStamps,
          step: checkStep,
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

    return {
      activeProjects,
      upcomingProjects,
      pastProjects,
      activeData,
      upcomingData,
      pastData,
      myProjects,
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
