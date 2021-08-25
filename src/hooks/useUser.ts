import {useWeb3React} from '@web3-react/core';

export const useUser = () => {
  const {account, library} = useWeb3React();
  if (account !== undefined && account !== null) {
    return {
      signIn: true,
      account,
      library,
    };
  }
  return {
    signIn: false,
    account: undefined,
    library,
  };
};
