import axios from 'axios';
import { API_SERVER, DEFAULT_NETWORK } from '../../../constants/index';

type CreateStarter = {
  name: string,
  description: string,
  image: string,
  logo: string,
  account: string,
  website: string,
  telegram: string,
  medium: string,
  twitter: string,
  discord: string,
  // token tab project token
  tokenName: string,
  tokenSymbol: string,
  tokenAllocation: string,
  tokenAddress: string,
  symbol: string,
  // token tab funding token
  fundingTokenName: string,
  fundingTokenAddress: string,
  fundingTokenSymbol: string,
  fundingTokenLogo: string,
  fundingTokenTargetAmount: string,
  fundingTokenRececipient: string,
  ratio: string,
  // sale tab
  saleAddress: string,
  vestingAddress: string,
  snapshotTimeStamp: number,
  exclusiveStartTime: number,
  addWhitelistEndTime: number,
  participationEndTime: number,
  subscriptionStartTime: number,
  claimStartTime: number,
  saleStartTime: number,
  saleEndTime: number,
  // layout
  position: string,
  production: boolean,
  exposure: boolean,
}

function createInstance () {
  return axios.create({
    baseURL: API_SERVER,
  });
}

const instance = createInstance();


export async function updateStarter (from: string, description: string, sig: string, tokenAddress: string) {
  if (!description) {
    description = '-';
  }
  const res = await instance.put(`/starter?chainId=${DEFAULT_NETWORK}`, {
    description: description,
    account: from,
    sig: sig,
    tokenAddress: tokenAddress,
  });
  return res.data;
}

export async function createStarter (args: CreateStarter) {
  let {
    // project tab
    name,
    description,
    image,
    logo,
    account,
    website,
    telegram,
    medium,
    twitter,
    discord,
    // token tab project token
    tokenName,
    tokenSymbol,
    tokenAllocation,
    tokenAddress,
    symbol,
    // token tab funding token
    fundingTokenName,
    fundingTokenAddress,
    fundingTokenSymbol,
    fundingTokenLogo,
    fundingTokenTargetAmount,
    fundingTokenRececipient,
    ratio,
    // sale tab
    saleAddress,
    vestingAddress,
    snapshotTimeStamp,
    exclusiveStartTime,
    addWhitelistEndTime,
    participationEndTime,
    subscriptionStartTime,
    claimStartTime,
    saleStartTime,
    saleEndTime,
    // layout
    position,
    production,
    exposure,
  } = args
  if (!description) {
    description = '-';
  }
  const res = await instance.post(`/starter?chainId=${DEFAULT_NETWORK}`, {
    chainId: DEFAULT_NETWORK,
    // project tab
    name: name,
    description: description,
    image: image,
    logo: logo,
    account: account,
    website: website,
    telegram: telegram,
    medium: medium,
    twitter: twitter,
    discord: discord,
    // token tab project token
    tokenName: tokenName,
    tokenSymbol: tokenSymbol,
    tokenAllocation: tokenAllocation,
    tokenAddress: tokenAddress,
    symbol: symbol,
    // token tab funding token
    fundingTokenName: fundingTokenName,
    fundingTokenAddress: fundingTokenAddress,
    fundingTokenSymbol: fundingTokenSymbol,
    fundingTokenLogo: fundingTokenLogo,
    fundingTokenTargetAmount: fundingTokenTargetAmount,
    fundingTokenRececipient: fundingTokenRececipient,
    ratio: ratio,
    // sale tab
    saleAddress: saleAddress,
    vestingAddress: vestingAddress,
    snapshotTimeStamp: snapshotTimeStamp,
    exclusiveStartTime: exclusiveStartTime,
    addWhitelistEndTime: addWhitelistEndTime,
    participationEndTime: participationEndTime,
    subscriptionStartTime: subscriptionStartTime,
    claimStartTime: claimStartTime,
    saleStartTime: saleStartTime,
    saleEndTime: saleEndTime,
    // layout
    position: position,
    production: production,
    exposure: exposure,
  });
  return res.data;
}

export async function getRandomKey (from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}