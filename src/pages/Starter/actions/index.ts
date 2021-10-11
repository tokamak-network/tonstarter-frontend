import {
  addWhiteList,
  calculTier,
  isWhiteList,
  participate,
  openSale,
  deposit,
  claim,
} from './actions';
import {checkApprove, getAllowance} from './approve';
import {
  getTotalExpectSaleAmount,
  getTimeStamps,
  getTotalExPurchasedAmount,
  getTotalOpenPurchasedAmount,
  getTotalRaise,
  getTotalExpectOpenSaleAmount,
  getTotalDepositAmount,
  getUserDeposit,
  getCalculClaimAmount,
  getStartClaimTime,
} from './views';

const actions = {
  addWhiteList,
  checkApprove,
  calculTier,
  isWhiteList,
  participate,
  getTotalExpectSaleAmount,
  getTimeStamps,
  getTotalExPurchasedAmount,
  getTotalOpenPurchasedAmount,
  getTotalRaise,
  getAllowance,
  openSale,
  getTotalExpectOpenSaleAmount,
  getTotalDepositAmount,
  getUserDeposit,
  deposit,
  claim,
  getCalculClaimAmount,
  getStartClaimTime,
};

export default actions;
