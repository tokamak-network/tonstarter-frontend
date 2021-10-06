import {addWhiteList, calculTier, isWhiteList, participate} from './actions';
import {checkApprove} from './approve';
import {getTotalExpectSaleAmount} from './views';

const actions = {
  addWhiteList,
  checkApprove,
  calculTier,
  isWhiteList,
  participate,
  getTotalExpectSaleAmount,
};

export default actions;
