import axios from 'axios';
import {API_SERVER, DEFAULT_NETWORK} from 'constants/index';
import {AdminObject} from '@Admin/types';

function createInstance() {
  return axios.create({
    baseURL: API_SERVER,
  });
}

const instance = createInstance();

export async function createStarter(args: AdminObject) {
  try {
    const res = await instance.post(`/starter?chainId=${DEFAULT_NETWORK}`, {
      ...args,
    });
    if (res.status === 200) {
      alert('success');
    } else {
      alert('failed');
    }
    return res.data;
  } catch (e) {
    console.log(e);
  }
}
