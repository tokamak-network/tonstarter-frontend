import {useWeb3React} from '@web3-react/core';
import {useAppSelector} from 'hooks/useRedux';
import {selectUser} from 'store/app/user.reducer';

export const useUser = () => {
  const {account, library} = useWeb3React();
  const {data} = useAppSelector(selectUser);
  const {address} = data;
  if (account !== undefined && address !== undefined && account === address) {
    return {
      signIn: true,
      account,
      library,
      userData: data,
    };
  }
  return {
    signIn: false,
    account: undefined,
    library: undefined,
    userData: data,
  };
};
