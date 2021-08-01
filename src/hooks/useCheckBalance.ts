import {useToast} from 'hooks/useToast';

export const useCheckBalance = () => {
  const {toastMsg} = useToast();
  const checkBalance = (inputValue: number, balance: number) => {
    if (inputValue > balance || inputValue <= 0) {
      toastMsg({
        status: 'error',
        title: 'Error',
        description: 'Balance is not enough',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } else {
      return true;
    }
  };
  return {checkBalance};
};
