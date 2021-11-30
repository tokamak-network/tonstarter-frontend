import axios from 'axios';
import {API_SERVER, DEFAULT_NETWORK} from 'constants/index';
import {AdminObject, PoolData} from '@Admin/types';
import {setTransaction} from 'store/refetch.reducer';
import store from 'store';
import moment from 'moment';

function createInstance() {
  return axios.create({
    baseURL: API_SERVER,
  });
}

const instance = createInstance();

export async function createStarter(args: AdminObject) {
  try {
    // /starter?chainId=${DEFAULT_NETWORK}
    // 0xbef737d725993847c345647eba096500fdae71c6;
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

export async function putEditStarter(args: AdminObject) {
  try {
    const res = await instance.put(`/starter?chainId=${DEFAULT_NETWORK}`, {
      ...args,
    });
    if (res.status === 200) {
      alert('success');
      dispatchToRefetch();
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
    const res = await instance.post(`/pool?chainId=${DEFAULT_NETWORK}`, {
      ...args,
    });
    if (res.status === 200) {
      alert('success');
      dispatchToRefetch({func: 'addPool'});
    } else {
      alert('failed');
    }
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

export async function putEditPool(args: PoolData) {
  try {
    const res = await instance.put(`/pool?chainId=${DEFAULT_NETWORK}`, {
      ...args,
    });
    if (res.status === 200) {
      alert('success');
      dispatchToRefetch();
    } else {
      alert('failed');
    }
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

export async function delPool(args: {poolAddress: string}) {
  console.log('--args--');
  console.log(args);
  try {
    const res = await instance.delete(`/pool?chainId=${DEFAULT_NETWORK}`, {
      data: {...args},
    });
    if (res.status === 200) {
      alert('success');
      dispatchToRefetch();
    } else {
      alert('failed');
    }
    return res.data;
  } catch (e) {
    console.log(e);
  }
}

const dispatchToRefetch = async (arg?: any) => {
  const nowTimeStamp = moment().unix();
  return store.dispatch(
    setTransaction({
      transactionType: 'Admin',
      blockNumber: undefined,
      data: {
        timeStamp: nowTimeStamp,
        ...arg,
      },
    }),
  );
};
