import {FC, HTMLAttributes, useState} from 'react';
import {ThemeSwitcher} from 'components/ThemeSwitcher';
import {WalletModal} from 'components/Wallet';
import {useDisclosure, Button} from '@chakra-ui/react';

export interface RouterProps extends HTMLAttributes<HTMLDivElement> {}

export const Router: FC<RouterProps> = () => {
  const [walletState, setWalletState] = useState<string>('');
  const {onOpen, isOpen: isModalOpen, onClose} = useDisclosure();

  const handleWalletModalOpen = (state: string) => {
    setWalletState(state);
    onOpen();
  };

  return (
    <>
      <ThemeSwitcher />
      <Button onClick={() => handleWalletModalOpen('wallet')}>
        Connect Wallet
      </Button>
      <WalletModal state={walletState} isOpen={isModalOpen} onClose={onClose} />
    </>
  );
};
