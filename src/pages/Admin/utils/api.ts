import axios from 'axios';
import {API_SERVER} from 'constants/index';

function createInstance() {
  return axios.create({
    baseURL: API_SERVER,
  });
}

export const instance = createInstance();

export async function getRandomKey(from: string) {
  const res = await instance.post('/randomkey', {
    account: from,
  });
  return res.data.data.randomvalue;
}
