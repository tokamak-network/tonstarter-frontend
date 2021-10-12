import * as publicSale from 'services/abis/PublicSale.json';
import {Contract} from '@ethersproject/contracts';
import {LibraryType} from 'types';
import {convertNumber} from 'utils/number';
import moment from 'moment';
import {convertTimeStamp} from 'utils/convertTIme';

interface I_CallContract {
  library: LibraryType;
  address: string;
}

const nowTimeStamp = moment().unix();

export async function getTotalExpectSaleAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalExpectSaleAmount();
  const convertedNum = convertNumber({amount: res.toString()});
  return convertedNum;
}

export async function getTimeStamps(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await Promise.all([
    PUBLICSALE_CONTRACT.startAddWhiteTime(),
    PUBLICSALE_CONTRACT.endAddWhiteTime(),
    PUBLICSALE_CONTRACT.startExclusiveTime(),
    PUBLICSALE_CONTRACT.endExclusiveTime(),
    PUBLICSALE_CONTRACT.startDepositTime(),
    PUBLICSALE_CONTRACT.endDepositTime(),
    PUBLICSALE_CONTRACT.startOpenSaleTime(),
    PUBLICSALE_CONTRACT.endOpenSaleTime(),
  ]);
  const closeTimeStamp = res.filter((timeStamp: any) => {
    return Number(timeStamp.toString()) > nowTimeStamp;
  })[0];
  const checkStep =
    closeTimeStamp === undefined
      ? 'past'
      : res
          .map((timeStamp: any, index: number) => {
            if (timeStamp.toString() === closeTimeStamp.toString()) {
              return index < 2
                ? 'whitelist'
                : index < 4
                ? 'exclusive'
                : index < 6
                ? 'deposit'
                : 'openSale';
            }
          })
          .filter((status: any) => status !== undefined)[0];

  return {
    startAddWhiteTime: Number(res[0].toString()),
    endWhiteListTime: Number(res[1].toString()),
    startExclusiveTime: Number(res[2].toString()),
    endExclusiveTime: Number(res[3].toString()),
    startDepositTime: Number(res[4].toString()),
    endDepositTIme: Number(res[5].toString()),
    startOpenSaleTime: Number(res[6].toString()),
    endOpenSaleTime: Number(res[7].toString()),
    checkStep,
  };
}

export async function getTotalExPurchasedAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalExPurchasedAmount();
  const convertedNum = convertNumber({amount: res.toString()});
  return convertedNum;
}

export async function getTotalOpenPurchasedAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalOpenPurchasedAmount();
  const convertedNum = convertNumber({amount: res.toString()});
  return convertedNum;
}

export async function getTotalRaise(args: I_CallContract) {
  const res = await Promise.all([
    getTotalExPurchasedAmount(args),
    getTotalOpenPurchasedAmount(args),
  ]);
  return String(Number(res[0]) + Number(res[1]));
}

export async function getTotalExpectOpenSaleAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalExpectOpenSaleAmount();
  const convertedNum = convertNumber({
    amount: res.toString(),
    localeString: true,
  });
  return convertedNum;
}

export async function getTotalDepositAmount(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.totalDepositAmount();
  const convertedNum = convertNumber({
    amount: res.toString(),
    localeString: true,
  });
  return convertedNum;
}

export async function getUserDeposit(args: I_CallContract & {account: string}) {
  const {library, address, account} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.usersOpen(account);
  const convertedNum = convertNumber({
    amount: res.depositAmount.toString(),
    localeString: true,
  });
  return convertedNum;
}

export async function getCalculClaimAmount(
  args: I_CallContract & {account: string},
) {
  const {library, address, account} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.calculClaimAmount(account);
  const convertedNum = convertNumber({
    amount: res.toString() || '0',
  });
  return convertedNum;
}

export async function getStartClaimTime(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);
  const res = await PUBLICSALE_CONTRACT.startClaimTime();
  return res;
}

export async function getNextVestingDay(args: I_CallContract) {
  const {library, address} = args;
  const PUBLICSALE_CONTRACT = new Contract(address, publicSale.abi, library);

  const startClaimTime = await PUBLICSALE_CONTRACT.startClaimTime();
  const startClaimTimeNum = Number(startClaimTime.toString());
  const nowTime = moment().unix();
  const diffTime = nowTime - startClaimTimeNum;
  const interval = await PUBLICSALE_CONTRACT.claimInterval();
  const intervalNum = Number(interval.toString());
  const endPeriod = await PUBLICSALE_CONTRACT.claimPeriod();
  const endPeriodNum = Number(endPeriod.toString());
  const period = diffTime / intervalNum + 1;

  if (period > endPeriodNum) {
    const nextVestingDate = startClaimTimeNum + intervalNum * period;
    return convertTimeStamp(nextVestingDate);
  } else {
    const nextVestingDate = startClaimTimeNum + intervalNum * endPeriodNum;
    return convertTimeStamp(nextVestingDate);
  }
}
