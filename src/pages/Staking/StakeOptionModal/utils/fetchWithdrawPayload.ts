import {getTokamakContract, getRPC} from 'utils/contract';
import {BigNumber} from 'ethers';
import {DEPLOYED} from 'constants/index';
import {convertNumber} from 'utils/number';
import {range} from 'lodash';

export const fetchWithdrawPayload = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  try {
    const {requestNum, requestIndex} = await getWithdrawableInfo(
      library,
      account,
      contractAddress,
    );
    const depositManager = getTokamakContract('DepositManager');
    const blockNumber = await getRPC().getBlockNumber();
    const pendingRequests = [];
    let index = requestIndex;

    /* eslint-disable */
    for (const _ of range(requestNum)) {
      pendingRequests.push(
        await depositManager.withdrawalRequest(
          DEPLOYED.TokamakLayer2,
          contractAddress,
          index,
        ),
      );
      index++;
    }
    const withdrawableRequests = pendingRequests.filter(
      (request) => parseInt(request.withdrawableBlockNumber) <= blockNumber,
    );

    const initialAmount = BigNumber.from('0');
    const reducer = (amount: any, request: any) =>
      amount.add(BigNumber.from(request.amount));

    const withdrawableAmount = withdrawableRequests.reduce(
      reducer,
      initialAmount,
    );
    return convertNumber({
      amount: withdrawableAmount,
      type: 'ray',
    });
  } catch (err) {
    console.log(err);
  }
};

const getWithdrawableInfo = async (
  library: any,
  account: string,
  contractAddress: string,
) => {
  const depositManager = getTokamakContract('DepositManager');
  return Promise.all([
    depositManager.numPendingRequests(
      DEPLOYED.TokamakLayer2,
      contractAddress,
    ),
    depositManager.withdrawalRequestIndex(
      DEPLOYED.TokamakLayer2,
      contractAddress,
    ),
  ]).then((result) => {
    return {
      requestNum: result[0],
      requestIndex: result[1],
    };
  });
};
