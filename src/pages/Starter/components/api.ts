import axios from 'axios';
import { API_SERVER, DEFAULT_NETWORK } from '../../../constants/index';

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

export async function getRandomKey (from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}