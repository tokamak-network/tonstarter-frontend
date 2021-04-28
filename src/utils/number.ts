import { ethers } from 'ethers';
import Decimal from 'decimal.js';

type PositiveNumber = number & { positive: true } 

type RoundFunc = {
    r_amount: string,
    r_maxDecimalDigits: PositiveNumber,
    r_opt?: 'up' | 'ceil'
}

type ConverNumberFunc = {
  type: 'ray' | 'WTON' | 'wei' | 'TON',
  amount: number,
  optRound?: 'roundup' | 'roundDown',
  optDecimalPoint?: PositiveNumber
}

function round(args: RoundFunc): string {
    const {r_amount, r_maxDecimalDigits, r_opt} = args
    const number = new Decimal(r_amount)
    const result = number.toFixed(r_maxDecimalDigits, Decimal.ROUND_UP);
    if (r_opt === 'up') {
        return result.
    } else if (r_opt === 'ceil') {

    }
    return result;
}

export default function convertNumber(
 args : ConverNumberFunc
): string | void {
    const {type, amount, optRound, optDecimalPoint} = args
    const utils = ethers.utils;
    const decimalPoint:PositiveNumber = optDecimalPoint ? optDecimalPoint : 2;
    switch (type) {
        case 'ray' || 'WTON':
            const rayAmount = utils.formatUnits(amount, 27)
            const rayAmountStr:string = rayAmount.toString();
            if (optRound === 'roundup') {
                return round({r_amount: rayAmountStr, r_maxDecimalDigits: decimalPoint, r_opt: 'up'})
            } else if (optRound === 'roundDown') {
            }
            return round({ r_amount: rayAmountStr, r_maxDecimalDigits: decimalPoint});
        case 'wei' || 'TON':
            const weiAmount = utils.formatUnits(amount, 18);
            const weiAmountStr: string = weiAmount.toString();
            if (optRound === 'roundup') {
                return;
            } else if (optRound === 'roundDown') {
            }
            return round(weiAmountStr, 2);
        return;
        default:
        new Error(
            `this type is not valid. It must be "ray" , "WTON", "wei', "TON"`,
        );
  }
}
