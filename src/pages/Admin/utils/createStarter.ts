import axios from 'axios';
import {API_SERVER, DEFAULT_NETWORK} from 'constants/index';
import {AdminObject, PoolData} from '@Admin/types';

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

export async function createPool(args: PoolData) {
  try {
    console.log('--args--');
    console.log(args);
    const res = await instance.post(`/pool?chainId=${DEFAULT_NETWORK}`, {
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

export async function putEditPool(args: PoolData) {
  console.log('--args--');
  console.log(args);
  try {
    const res = await instance.put(`/pool?chainId=${DEFAULT_NETWORK}`, {
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

export async function delPool(args: {chainId: number; poolAddress: string}) {
  console.log('--args--');
  console.log(args);
  try {
    const res = await instance.delete(`/pool?chainId=${DEFAULT_NETWORK}`, {
      data: {args},
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
