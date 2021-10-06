import {addWhiteList, calculTier, isWhiteList, participate} from './actions';
import {checkApprove} from './approve';
import {getTotalExpectSaleAmount, getTimeStamps} from './views';

const actions = {
  addWhiteList,
  checkApprove,
  calculTier,
  isWhiteList,
  participate,
  getTotalExpectSaleAmount,
  getTimeStamps,
};

export default actions;
