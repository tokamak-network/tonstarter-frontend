import {getTokamakContract, getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import store from 'store';
import {setTxPending} from 'store/tx.reducer';
import {convertToWei} from 'utils/number';
import {DEPLOYED} from 'constants/index';
import * as StakeTON from 'services/abis/StakeTON.json';
import {BASE_PROVIDER} from 'constants/index';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

type StakeToLayer2 = {
  userAddress: string | null | undefined;
  amount: string;
  contractAddress: string;
  miningEndTime: string | Number;
  status: string;
  globalWithdrawalDelay: string;
  library: any;
  handleCloseModal: any;
};

const {TokamakLayer2_ADDRESS} = DEPLOYED;

export const stakeL2 = async (args: StakeToLayer2) => {
  const {
    userAddress,
    amount,
    miningEndTime,
    contractAddress,
    status,
    globalWithdrawalDelay,
    library,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }

  const currentBlock = await BASE_PROVIDER.getBlockNumber();
  const endBlock = Number(miningEndTime);
  const TON = getTokamakContract('TON', library);
  const tonBalance = await TON.balanceOf(contractAddress);
  const tonAmount = convertToWei(amount);

  if (currentBlock > endBlock - Number(globalWithdrawalDelay)) {
    return alert('staking period has ended'); // ToDo: comment check
  } else if (status === 'end') {
    return alert('sale is not closed!');
  } else if (tonBalance < tonAmount) {
    return alert('unsufficient balance!');
  } else {
    const StakeTONContract = new Contract(
      contractAddress,
      StakeTON.abi,
      library,
    );
    if (!StakeTONContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const signer = getSigner(library, userAddress);
    try {
      const receipt = await StakeTONContract.connect(signer).tokamakStaking(
        TokamakLayer2_ADDRESS,
        tonAmount,
      );
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending);
      }
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      store.dispatch(
        //@ts-ignore
        openToast({
          payload: {
            status: 'error',
            title: 'Tx fail to send',
            description: `something went wrong`,
            duration: 5000,
            isClosable: true,
          },
        }),
      );
    }
  }
};
