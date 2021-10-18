import {useToast} from 'hooks/useToast';

export const useCheckBalance = () => {
  const {toastMsg} = useToast();
  const checkBalance = (inputValue: number, balance: number) => {
    console.log(inputValue, balance);
    if (inputValue > balance || inputValue <= 0) {
      toastMsg({
        status: 'error',
        title: 'Error',
        description: 'Balance is not enough',
        duration: 5000,
        isClosable: true,
      });
      return false;
    } else if (inputValue === balance) {
      return 'balanceAll';
    } else {
      return true;
    }
  };
  return {checkBalance};
};
