import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import {WalletModal} from 'components/Wallet';
import {useDisclosure} from '@chakra-ui/react';
import {Header} from 'components/Header';
import {FLDstarter} from './FLDstarter';
import {Staking} from './Staking';
import {Pools} from './Pools';
import {DAO} from './Dao/index';
import {Reward} from './Reward';
import {Starter} from './Starter/index';
import {Switch, Route} from 'react-router-dom';
import {useAppDispatch} from 'hooks/useRedux';
import {fetchAppConfig} from 'store/app/app.reducer';
import {fetchUserInfo} from 'store/app/user.reducer';
import {fetchStakes} from './Staking/staking.reducer';
import {fetchRewards} from './Reward/reward.reducer';
import {AirdropModal} from 'components/Airdrop/Index';
import {fetchVaults} from './Staking/vault.reducer';
import {fetchStarters} from './Starter/starter.reducer';
import {DEFAULT_NETWORK} from 'constants/index';
import {Footer} from 'components/Footer';
import {ConfirmModal} from 'components/Modal';
import {MobilePreOpen} from './PreOpen/Index';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {StarterDetail} from './Starter/StarterDetail';
import {
  CreateProject,
  ListingProjects,
  ListingPools,
  ListingRewards,
} from './Admin';
import {MyAirdrop} from './Admin/MyAirdrop';
import {fetchTosStakes} from '@Dao/dao.reducer';
import OpenCampagin from '@Launch/index';
import MainScreen from '@Launch/MainScreen';
import ProjectScreen from '@Launch/ProjectScreen';
export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

/*
###################
#####PHASE 4#######
######api##########
###################
################### 
*/

export const Router: FC<RouterProps> = () => {
  const dispatch = useAppDispatch();
  const [walletState, setWalletState] = useState<string>('');
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();
  const {account, chainId, library, deactivate} = useActiveWeb3React();

  //@ts-ignore
  // const accountStorage = JSON.parse(window.localStorage.getItem('account'));

  const fetchToInitialize = async () => {
    await dispatch(
      fetchVaults({
        chainId,
      }) as any,
    );
    await dispatch(
      fetchStarters({
        chainId,
        library,
      }) as any,
    );
    await dispatch(
      fetchStakes({
        library,
      }) as any,
    );
    await dispatch(
      fetchRewards({
        library,
      }) as any,
    );
    if (account && chainId) {
      await dispatch(
        fetchTosStakes({
          account,
          library,
          chainId,
        }) as any,
      );
    }
  };

  useEffect(() => {
    if (chainId !== Number(DEFAULT_NETWORK) && chainId !== undefined) {
      const netType =
        DEFAULT_NETWORK === 1 ? 'mainnet' : 'Rinkeby Test Network';
      //@ts-ignore
      // dispatch(fetchUserInfo({reset: true}));
      return alert(`Please use ${netType}`);
    }
    /*eslint-disable*/
  }, [chainId]);

  useEffect(() => {
    if (account && chainId) {
      //@ts-ignore
      // const accountStorage = JSON.parse(window.localStorage.getItem('account'));

      // //@ts-ignore
      // if (accountStorage === null) {
      //   console.log('catch2');

      //   // window.localStorage.setItem('account', JSON.stringify({signIn: false}));
      //   return deactivate();
      // }

      // const {signIn} = accountStorage;

      // // @ts-ignore
      dispatch(fetchAppConfig({chainId}));

      // if (signIn === false) {
      //   deactivate();
      // } else if (signIn === true) {
      //   if (chainId !== Number(DEFAULT_NETWORK)) {
      //     deactivate();
      //     return window.localStorage.setItem(
      //       'account',
      //       JSON.stringify({signIn: false}),
      //     );
      //   }

      fetchToInitialize();

      // @ts-ignore
      // dispatch(fetchUserInfo({account, library})).then(() => {
      //   fetchToInitialize();
      // });
      // }
    }
    /*eslint-disable*/
  }, [chainId, account, library, dispatch, deactivate]);

  useEffect(() => {
    if (account && library) {
      // @ts-ignore
      dispatch(fetchUserInfo({account, library}));
      // @ts-ignore
      // dispatch(fetchAppConfig({chainId}));
    }
  }, [account, library]);

  useEffect(() => {
    //@ts-ignore
    // const accountStorage = JSON.parse(window.localStorage.getItem('account'));
    // const {signIn} = accountStorage;
    // if (account === undefined && signIn === true) {
    //   fetchToInitialize();
    // }
    // if (signIn === false) {
    //   deactivate();
    // }
    fetchToInitialize();
    /*eslint-disable*/
  }, [account, dispatch, library, chainId, deactivate]);

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };

  const {width} = useWindowDimensions();

  if (width < 1100) {
    return <MobilePreOpen />;
  }

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
      <ConfirmModal></ConfirmModal>
      <Header
        account={account}
        walletopen={() => handleWalletModalOpen('wallet')}
      />
      <div style={{flex: 1}}>
        <Switch>
          <Route exact path="/" component={FLDstarter} />
          <Route exact path="/staking" component={Staking} />
          <Route exact path="/rewards/pools" component={Pools} />
          <Route exact path="/rewards/rewardProgram" component={Reward} />
          {/* <Route exact path="/starter" component={Starter} /> */}
          <Route exact path="/starter" component={Starter} />
          <Route exact path="/dao" component={DAO} />
          <Route exact path="/admin/createproject" component={CreateProject} />
          <Route exact path="/admin/listproject" component={ListingProjects} />
          <Route exact path="/admin/listpools" component={ListingPools} />
          <Route exact path="/admin/listrewards" component={ListingRewards} />
          <Route exact path="/myairdrop" component={MyAirdrop} />

          <Route exact path={`/starter/:id`} component={StarterDetail} />
          <Route exact path={`/launch`} component={OpenCampagin} />
          <Route exact path={`/launch/createproject`} component={MainScreen} />
          <Route
            exact
            path={`/launch/project/:name`}
            component={ProjectScreen}
          />
          <Route exact path={`/launch/:id`} component={MainScreen} />
          {/* <Route
            exact
            path={`/starter/upcoming/:id`}
            component={StarterDetail}
          /> */}
        </Switch>
      </div>
      <Footer />
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
      <AirdropModal />
    </div>
  );
};
