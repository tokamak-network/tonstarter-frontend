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
import {useAppDispatch} from 'hooks/useRedux';
import {fetchAppConfig} from 'store/app/app.reducer';
import {fetchUserInfo} from 'store/app/user.reducer';
import {fetchStakes} from './Staking/staking.reducer';
import {useWindowDimensions} from 'hooks/useWindowDimentions';
import {AirdropModal} from 'components/Airdrop/Index';
import {fetchVaults} from './Staking/vault.reducer';

export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  const dispatch = useAppDispatch();
  const [walletState, setWalletState] = useState<string>('');
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();
  const {account, chainId, library, deactivate} = useWeb3React();

  //@ts-ignore
  const accountStorage = JSON.parse(window.localStorage.getItem('account'));
  if (accountStorage === null) {
    window.localStorage.setItem('account', JSON.stringify({signIn: false}));
  }

  useEffect(() => {
    if (account && chainId) {
      //@ts-ignore
      const accountStorage = JSON.parse(window.localStorage.getItem('account'));
      //@ts-ignore
      if (accountStorage === null) {
        window.localStorage.setItem('account', JSON.stringify({signIn: false}));
        return deactivate();
      }

      const {signIn} = accountStorage;

      // @ts-ignore
      dispatch(fetchAppConfig({chainId}));

      if (signIn === false) {
        deactivate();
      } else if (signIn === true) {
        if (chainId !== 4) {
          deactivate();
          window.localStorage.setItem(
            'account',
            JSON.stringify({signIn: false}),
          );
          return alert('please use Rinkeby test network');
        }
        // @ts-ignore
        dispatch(fetchUserInfo({address: account, library})).then(() => {
          dispatch(
            fetchVaults({
              chainId,
            }) as any,
          ).then(() => {
            dispatch(
              fetchStakes({
                library,
                account,
                chainId,
              }) as any,
            );
          });
        });
      }
    }
  }, [chainId, account, library, dispatch, deactivate]);

  useEffect(() => {
    //@ts-ignore
    const accountStorage = JSON.parse(window.localStorage.getItem('account'));
    const {signIn} = accountStorage;
    if (account === undefined && signIn === false) {
      dispatch(
        fetchVaults({
          chainId,
        }) as any,
      ).then(() => {
        dispatch(
          fetchStakes({
            library,
            account,
            chainId,
          }) as any,
        );
      });
      // @ts-ignore
      // dispatch(fetchUserInfo());
    }
  }, [account, dispatch, library, chainId]);

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
        <Route exact path="/pools" component={Staking} />
        {/* <Route exact path="/starter" component={Starter} /> */}
        {/* <Route exact path="/dao" component={DAO} /> */}
      </Switch>
      <Footer />
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
      <AirdropModal />
    </>
  );
};
