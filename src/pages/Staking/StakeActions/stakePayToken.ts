import {DEPLOYED} from 'constants/index';
import {getTokamakContract, getSigner, getRPC} from 'utils/contract';
import {convertToWei} from 'utils/number';
import {utils, ethers} from 'ethers';
import {setTxPending} from 'store/tx.reducer';
import store from 'store';
import {toastWithReceipt} from 'utils';
import {openToast} from 'store/app/toast.reducer';

type StakeProps = {
  userAddress: string | null | undefined;
  amount: string;
  payToken: string;
  saleStartTime: string | Number;
  library: any;
  stakeContractAddress: string;
  miningStartTime: string | Number;
  handleCloseModal: any;
};

type StakeTon = {
  userAddress: string | null | undefined;
  amount: string;
  saleStartTime: string | Number;
  library: any;
  stakeContractAddress: string;
  miningStartTime: string | Number;
  handleCloseModal: any;
};

export const stakePaytoken = async (args: StakeProps) => {
  const {
    userAddress,
    amount,
    payToken,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
    handleCloseModal,
  } = args;

  if (payToken === DEPLOYED.TON) {
    await stakeTon({
      userAddress: userAddress,
      amount: amount,
      saleStartTime: saleStartTime,
      library: library,
      stakeContractAddress: stakeContractAddress,
      miningStartTime: miningStartTime,
      handleCloseModal: handleCloseModal,
    });
  } else {
    await stakeEth({
      userAddress: userAddress,
      amount: amount,
      saleStartTime: saleStartTime,
      library: library,
      stakeContractAddress: stakeContractAddress,
      miningStartTime: miningStartTime,
      handleCloseModal: handleCloseModal,
    });
  }
};

const stakeTon = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
  } = args;
  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartTime && currentBlock < miningStartTime) {
    const tonContract = getTokamakContract('TON');
    if (!tonContract) {
      throw new Error(`Can't find the contract for staking actions`);
    }
    const tonAmount = convertToWei(amount);
    const abicoder = ethers.utils.defaultAbiCoder;
    const data = abicoder.encode(
      ['address', 'uint256'],
      [stakeContractAddress, tonAmount],
    );
    const signer = getSigner(library, userAddress);

    try {
      const receipt = await tonContract
        .connect(signer)
        ?.approveAndCall(stakeContractAddress, tonAmount, data);
      store.dispatch(setTxPending({tx: true}));
      if (receipt) {
        toastWithReceipt(receipt, setTxPending, stakeContractAddress);
      }
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  } else {
    return store.dispatch(
      //@ts-ignore
      openToast({
        payload: {
          status: 'error',
          title: 'Tx fail to send',
          description: `staking period has ended`,
          duration: 5000,
          isClosable: true,
        },
      }),
    );
  }
};

const stakeEth = async (args: StakeTon) => {
  const {
    userAddress,
    amount,
    saleStartTime,
    library,
    stakeContractAddress,
    miningStartTime,
  } = args;

  if (userAddress === null || userAddress === undefined) {
    return;
  }
  const currentBlock = await getRPC().getBlockNumber();

  if (currentBlock > saleStartTime && currentBlock < miningStartTime) {
    const transactionRequest: any = {
      to: stakeContractAddress,
      value: utils.parseEther(amount),
    };

    const signer = getSigner(library, userAddress);
    try {
      const receipt = await signer.sendTransaction(transactionRequest);
      store.dispatch(setTxPending({tx: true}));
      alert(`Tx sent successfully! Tx hash is ${receipt.hash}`);
      if (receipt) {
        store.dispatch(setTxPending({tx: false}));
      }
    } catch (err) {
      store.dispatch(setTxPending({tx: false}));
      console.log(err);
    }
  } else {
    return alert('staking period has ended');
  }
};
