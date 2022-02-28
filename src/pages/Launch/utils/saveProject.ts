import axios from 'axios';
import {API_SERVER_LAUNCH, DEFAULT_NETWORK} from 'constants/index';

async function saveProject(data: any, account: string) {
  const instance = axios.create({
    baseURL: API_SERVER_LAUNCH,
    headers: {
      account,
    },
  });
  console.log(data, account);
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
      console.log(res);
      if (res.status === 200) {
        return alert('success');
      } else {
        return alert('failed');
      }
    });
  return result;
}

export default saveProject;
