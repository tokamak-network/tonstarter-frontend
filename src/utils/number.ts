import {ethers} from 'ethers';
import Decimal from 'decimal.js';

type PositiveNumber = number & {positive: true};

type RoundFunc = {
  r_amount: string;
  r_maxDecimalDigits: number;
  r_opt?: 'up' | 'down';
};

type ConverNumberFunc = {
  type: 'WTON' | 'TON';
  amount: string;
  optRound?: 'roundup' | 'roundDown';
  optDecimalPlaces?: number;
};

function round(args: RoundFunc): string {
  const {r_amount, r_maxDecimalDigits, r_opt} = args;
  const number = new Decimal(r_amount);
  if (r_opt === 'up') {
    return number.toFixed(r_maxDecimalDigits, Decimal.ROUND_UP);
  } else if (r_opt === 'down') {
    return number.toFixed(r_maxDecimalDigits, Decimal.ROUND_DOWN);
  }
  console.log(number);
  return number.toFixed(r_maxDecimalDigits);
}

export default function convertNumber(args: ConverNumberFunc): string | void {
  const {type, amount, optRound, optDecimalPlaces} = args;
  const utils = ethers.utils;
  const decimalPoint: number = optDecimalPlaces ? optDecimalPlaces : 2;
  if (decimalPoint <= 0) {
    throw new Error(`decimalPoint must be positive number`);
  }
  switch (type) {
    case 'WTON':
      const rayAmount = utils.formatUnits(amount, 27);
      const rayAmountStr: string = rayAmount.toString();
      if (optRound === 'roundup') {
        return round({
          r_amount: rayAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'up',
        });
      } else if (optRound === 'roundDown') {
        return round({
          r_amount: rayAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'down',
        });
      }
      return round({r_amount: rayAmountStr, r_maxDecimalDigits: decimalPoint});
    case 'TON':
      const weiAmount = utils.formatUnits(amount, 18);
      const weiAmountStr: string = weiAmount.toString();
      if (optRound === 'roundup') {
        return round({
          r_amount: weiAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'up',
        });
      } else if (optRound === 'roundDown') {
        return round({
          r_amount: weiAmountStr,
          r_maxDecimalDigits: decimalPoint,
          r_opt: 'down',
        });
      }
      return round({
        r_amount: weiAmountStr,
        r_maxDecimalDigits: decimalPoint,
      });

    default:
      throw new Error(
        `this type is not valid. It must be "ray" , "WTON", "wei', "TON"`,
      );
  }
}
