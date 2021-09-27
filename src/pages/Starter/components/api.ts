import axios from 'axios';
import { API_SERVER, DEFAULT_NETWORK } from '../../../constants/index';

type CreateStarter = {
  name: string,
  logo: string,
  account: string,
  symbol: string,
  tokenAddress: string,
  saleAddress: string,
  priority: string, //temp
  fundingToken: string,
  description: string,
  tier: string,
  ratio: string,
  minAllocation: string,
  maxAllocation: string,
  // stakedToken: string,
  // stakedPeriod: string,
  website: string,
  telegram: string,
  medium: string,
  twitter: string,
  discord: string,
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
    name,
    logo,
    account,
    symbol,
    tokenAddress,
    saleAddress,
    priority,
    fundingToken,
    description,
    tier,
    ratio,
    minAllocation,
    maxAllocation,
    website,
    telegram,
    medium,
    twitter,
    discord,
  } = args
  if (!description) {
    description = '-';
  }
  const res = await instance.post(`/starter?chainId=${DEFAULT_NETWORK}`, {
    name: name,
    description: description,
    logo: logo,
    symbol: symbol,
    tokenAddress: tokenAddress,
    saleAddress: saleAddress,
    fundingToken: fundingToken,
    priority: priority,
    tier: tier,
    minAllocation: minAllocation,
    maxAllocation: maxAllocation,
    ratio: ratio,
    website: website,
    medium: medium,
    discord: discord,
    twitter: twitter,
    telegram: telegram,
    account: account,
    chainId: DEFAULT_NETWORK,
  });
  return res.data;
}

export async function getRandomKey (from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}