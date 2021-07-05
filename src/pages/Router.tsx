import React, {FC, HTMLAttributes, useEffect, useState} from 'react';
import {WalletModal} from 'components/Wallet';
import {useDisclosure} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import {Header} from 'components/Header';
import {Footer} from 'components/Footer';
import {FLDstarter} from './FLDstarter';
import {Pools} from './Pools';
import {Staking} from './Staking';
import {Switch, Route} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {fetchAppConfig, selectApp} from 'store/app/app.reducer';
import {fetchUserInfo} from 'store/app/user.reducer';
import {fetchStakes} from './Staking/staking.reducer';
import {useContract} from 'hooks/useContract';
import {REACT_APP_STAKE1_PROXY} from 'constants/index';
import * as StakeLogic from 'services/abis/Stake1Logic.json';
import store from 'store';
import {useWindowDimensions} from 'hooks/useWindowDimentions';

export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  const dispatch = useAppDispatch();
  // const toast = useToast();
  const {data} = useAppSelector(selectApp);
  const [walletState, setWalletState] = useState<string>('');
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();
  const {account, chainId, library, deactivate} = useWeb3React();
  const stakeRegistryContract = useContract(
    REACT_APP_STAKE1_PROXY,
    StakeLogic.abi,
  );

  // useEffect(() => {
  //   setAccountValue({signIn: false});
  //   if (accountValue.signIn === false) {
  //     deactivate();
  //     console.log(account);
  //   }
  // }, [chainId, account, library, dispatch]);

  useEffect(() => {
    if (account && chainId) {
      //@ts-ignore
      const accountStorage = JSON.parse(window.localStorage.getItem('account'));
      const {signIn} = accountStorage;
      // @ts-ignore
      dispatch(fetchAppConfig({chainId}));

      if (signIn === false) {
        return deactivate();
      } else if (signIn === true) {
        // @ts-ignore
        dispatch(fetchUserInfo({address: account, library}));
      }
    }
  }, [chainId, account, library, dispatch, deactivate]);

  // useEffect(() => {
  //   dispatch(
  //     fetchStakes({
  //       contract: stakeRegistryContract,
  //       library,
  //       account,
  //       chainId,
  //     }) as any,
  //   );
  // }, []);

  useEffect(() => {
    //delay if Stake is in pending
    while (store.getState().stakes.loading === 'pending') {
      break;
    }
    dispatch(
      fetchStakes({
        contract: stakeRegistryContract,
        library,
        account,
        chainId,
      }) as any,
    );
  }, [
    data.blockNumber,
    stakeRegistryContract,
    dispatch,
    library,
    account,
    chainId,
  ]);

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };

  // if (error) {
  //   toast({
  //     description: data.
  //   })
  // }

  const {width} = useWindowDimensions();
  console.log(width);

  if (width < 1100) {
    // return <MobilePreOpen />;
  }

  return (
    <>
      <Header
        account={account}
        walletopen={() => handleWalletModalOpen('wallet')}
      />
      <Switch>
        <Route exact path="/" component={FLDstarter} />
        <Route exact path="/pools" component={Pools} />
        <Route exact path="/staking" component={Staking} />
        {/* <Route exact path="/starter" component={Starter} /> */}
        {/* <Route exact path="/dao" component={DAO} /> */}
      </Switch>
      <Footer />
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
    </>
  );
};
