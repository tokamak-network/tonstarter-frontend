import {Price, Currency} from '@uniswap/sdk-core';

export function formatPrice(
  price: Price<Currency, Currency> | undefined,
  sigFigs: number,
) {
  if (!price) {
    return '-';
  }

  if (parseFloat(price.toFixed(sigFigs)) < 0.0001) {
    return '<0.0001';
  }

  return price.toSignificant(sigFigs);
}
