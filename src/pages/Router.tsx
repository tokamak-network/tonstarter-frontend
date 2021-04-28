import React, {FC, HTMLAttributes, useState} from 'react';
import {WalletModal} from 'components/Wallet';
import {useDisclosure} from '@chakra-ui/react';
import {useWeb3React} from '@web3-react/core';
import {Header} from 'components/Header';
import {Home} from './Home';
import {Staking} from './Staking';
import {Support} from './Support';
import {Wallet} from './Wallet';
import {PowerTON} from './PowerTON';
import {Switch, Route} from 'react-router-dom';
export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  const [walletState, setWalletState] = useState<string>('');
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();
  const {account} = useWeb3React();

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };

  return (
    <>
      <Header
        account={account}
        onWalletOpen={() => handleWalletModalOpen('wallet')}
      />
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/staking" component={Staking} />
        <Route exact path="/support" component={Support} />
        <Route exact path="/wallet" component={Wallet} />
        <Route exact path="/powerton" component={PowerTON} />
      </Switch>
    </>
  );
};
