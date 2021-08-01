import { getAddress } from '@ethersproject/address'

export const shortenAddress = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(
    address.length - 4,
  )}`;
};

export function isAddress(value: any): string | false {
  try {
    return getAddress(value)
  } catch {
    return false
  }
}