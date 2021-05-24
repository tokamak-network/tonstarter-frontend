import {FC, HTMLAttributes, useEffect} from 'react';
import {WalletModal} from 'components/Wallet';
import {useDisclosure} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import {Header} from 'components/Header';
import {FLDstarter} from './FLDstarter';
import {Pools} from './Pools';
import {Staking} from './Staking';
import {Switch, Route} from 'react-router-dom';
import {useAppDispatch} from 'store';
import {fetchAppConfig} from 'store/app/app.reducer';

export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  const dispatch = useAppDispatch();
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();
  const {account, chainId} = useWeb3React();

  useEffect(() => {
    dispatch(fetchAppConfig({chainId}) as any);
  }, [chainId, dispatch]);

  return (
    <>
      <Header account={account} onOpen={onOpen} />
      <WalletModal state={'wallet'} isOpen={isModalOpen} onClose={onClose} />

      <Switch>
        <Route exact path="/" component={FLDstarter} />
        <Route exact path="/pools" component={Pools} />
        <Route exact path="/staking" component={Staking} />
        {/* <Route exact path="/starter" component={Starter} /> */}
        {/* <Route exact path="/dao" component={DAO} /> */}
      </Switch>
    </>
  );
};
