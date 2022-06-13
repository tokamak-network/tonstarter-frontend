import {setHashKey} from '@Launch/launch.reducer';
import axios from 'axios';
import {API_SERVER_LAUNCH, DEFAULT_NETWORK} from 'constants/index';
import store from 'store';
import getWeb3Token from 'utils/web3Token';

// axios.defaults.withCredentials = true;
// axios.defaults.headers.common['Authorization'] = `Web3Token ${accessToken}`;

async function saveProject(data: any, account: string, modal?: boolean) {
  // const localStorage = window.localStorage;
  // const hasToken = localStorage.getItem('web3Token')

  // const token = await getWeb3Token();

  const result = await axios
    .post(
      `${API_SERVER_LAUNCH}/projects?chainId=${DEFAULT_NETWORK}`,
      {...data},
      {
        headers: {
          account,
        },
      },
    )
    .then((res) => {
      store.dispatch(
        //@ts-ignore
        setHashKey({data: res.data.hashKey}),
      );
      if (res.status === 200) {
        if (modal === true) {
          return alert('success');
        }
      } else {
        return alert('failed');
      }
    });
  return result;
}

async function editProject(
  data: any,
  account: string,
  uid: string,
  web3Token: string,
  modal?: boolean,
) {
  try {
    const result = await axios
      .put(
        `${API_SERVER_LAUNCH}/projects?chainId=${DEFAULT_NETWORK}`,
        {...data},
        {
          headers: {
            account,
            uid,
            authorization: web3Token,
          },
        },
      )
      .then((res) => {
        if (res.status === 200) {
          if (modal === true) {
            return alert('success');
          }
        } else {
          return alert('failed');
        }
      });
    return result;
  } catch (e) {
    return alert('failed');
  }
}

export {saveProject, editProject};
