import {Contract} from '@ethersproject/contracts';
import {DEPLOYED} from 'constants/index';
import * as TOSABI from 'services/abis/TOS.json';
import * as NPMABI from 'services/abis/NonfungiblePositionManager.json';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import Web3 from 'web3';
import {ethers} from 'ethers';

// user, amount, unlockTime;
export const permitForCreateLock = async (
  account: string,
  library: any,
  amount: string,
  unlockTime: number,
) => {
  //@ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const userSigner = provider.getSigner();
  const {TOS_ADDRESS, LockTOS_ADDRESS} = DEPLOYED;
  const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );
  console.log(userSigner);
  // const signer = getSigner(library, account);
  console.log(TOSContract);
  const nonce = parseInt(await TOSContract.nonces(account));
  let deadline = Date.now() / 1000;
  //@ts-ignore
  deadline = parseInt(deadline) + 100;
  console.log({
    owner: account,
    spender: LockTOS_ADDRESS,
    value: amount,
    nonce,
    deadline,
  });
  const rawSignature = await userSigner._signTypedData(
    {
      chainId: 4,
      name: 'TONStarter',
      version: '1',
      verifyingContract: TOS_ADDRESS,
    },
    {
      Permit: [
        {name: 'owner', type: 'address'},
        {name: 'spender', type: 'address'},
        {name: 'value', type: 'uint256'},
        {name: 'nonce', type: 'uint256'},
        {name: 'deadline', type: 'uint256'},
      ],
    },
    {
      owner: account,
      spender: LockTOS_ADDRESS,
      value: amount,
      nonce,
      deadline,
    },
  );

  const signature = ethers.utils.splitSignature(rawSignature);

  return await LockTOSContract.connect(account).createLockWithPermit(
    amount,
    unlockTime,
    deadline,
    signature.v,
    signature.r,
    signature.s,
  )
}

export async function stakingPermit(account: string, library: any, tokenId: string, deadline: number) {
  if (!account || !library) {
    return;
  }
  //@ts-ignore
  const web3 = new Web3(window.ethereum);
  const {UniswapStaking_Address, NPM_Address} = DEPLOYED;

  const NPMContract = new Contract(NPM_Address, NPMABI.abi,  library)
  let position = await NPMContract.positions(tokenId);
  
  //@ts-ignore
  let nonce = position.nonce.toString();
  nonce = parseInt(nonce);
  const to = UniswapStaking_Address
  //@ts-ignore
  const res = await web3.givenProvider.send(
    {
      method: 'net_version',
      params: [],
      jsonrpc: '2.0',
    },
    async function (err: any, result: any) {
      const netId = result.result;

      const Permit = [
        {name: "spender", type: "address"},
        {name: "tokenId", type: "uint256"},
        {name: "nonce", type: "uint256"},
        {name: "deadline", type: "uint256"}
      ];
      const message = {
        spender: to,
        tokenId: Number(tokenId),
        nonce: nonce,
        deadline: deadline
      };

      let msgParams = {
        types: {
          EIP712Domain: [
            {name: 'name', type: 'string'},
            {name: 'version', type: 'string'},
            {name: 'chainId', type: 'uint256'},
            {name: 'verifyingContract', type: 'address'},
          ],
          Permit: Permit,
        },
        primaryType: 'Permit',
        domain: {
          name : 'Uniswap V3 Positions NFT-V1',
          version: '1',
          chainId: netId,
          verifyingContract: NPM_Address,
        },
        message: message,
      };
      //@ts-ignore
      msgParams = JSON.stringify(msgParams);
      var params = [account, msgParams];
      var method = 'eth_signTypedData_v4';
      //@ts-ignore
      return {method, params};
    },
  );
  return res;
}

export async function finalPermit(method: any, params: any, account: string) {
  //@ts-ignore
  const web3 = new Web3(window.ethereum);

  return await web3.givenProvider.send(
    {
      method,
      params,
      account,
    },
    async function (err: any, result: any) {
      if (err) return console.dir(err);
      if (result.error) {
        alert(result.error.message);
      }
      if (result.error) return console.error('ERROR', result);
        // console.log('TYPED SIGNED:' + JSON.stringify(result.result));

      const signature = result.result.substring(2);
      const r = '0x' + signature.substring(0, 64);
      const s = '0x' + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);

      // console.log('TYPED r:', r);
      // console.log('TYPED s:', s);
      // console.log('TYPED v:', v);

      return {_v: v, _r: r, _s: s};
    },
  );
};

// export async function tosPermit(account: string, library: any, amount: number) {
//   console.log(account, library, amount);
//   if (!account || !library) {
//     return;
//   }

//   //@ts-ignore
//   const web3 = new Web3(window.ethereum);
//   const signer = getSigner(library, account);
//   const {TOS_ADDRESS, LockTOS_ADDRESS} = DEPLOYED;
//   const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
//   const to = LockTOS_ADDRESS;

//   let nonce = await TOSContract.connect(signer).nonces(account);
//   nonce = parseInt(nonce);

//   let deadline = Date.now() / 1000;
//   //@ts-ignore
//   deadline = parseInt(deadline) + 100;

//   console.log(nonce);

//   //@ts-ignore
//   const res = await web3.givenProvider.send(
//     {
//       method: 'net_version',
//       params: [],
//       jsonrpc: '2.0',
//     },
//     async function (err: any, result: any) {
//       const netId = result.result;

//       //   console.log('netId', netId);

//       const Permit = [
//         {name: 'owner', type: 'address'},
//         {name: 'spender', type: 'address'},
//         {name: 'value', type: 'uint256'},
//         {name: 'nonce', type: 'uint256'},
//         {name: 'deadline', type: 'uint256'},
//       ];
//       const message = {
//         owner: account,
//         spender: to,
//         value: amount,
//         nonce: nonce,
//         deadline: deadline,
//       };

//       //   console.log('message:', message);

//       let msgParams = {
//         types: {
//           EIP712Domain: [
//             {name: 'name', type: 'string'},
//             {name: 'version', type: 'string'},
//             {name: 'chainId', type: 'uint256'},
//             {name: 'verifyingContract', type: 'address'},
//           ],
//           Permit: Permit,
//         },
//         primaryType: 'Permit',
//         domain: {
//           name: 'TONStarter',
//           version: '1.0',
//           chainId: netId,
//           verifyingContract: TOS_ADDRESS,
//         },
//         message: message,
//       };
//       //   console.log('msgParams1:', msgParams);
//       //@ts-ignore
//       msgParams = JSON.stringify(msgParams);

//       //   console.log('msgParams2:', msgParams);

//       //   console.log('nonce pre :', nonce);

//       //   let hashPermit = await TOSContract.connect(signer).hashPermit(
//       //     account,
//       //     to,
//       //     amount,
//       //     deadline,
//       //     nonce,
//       //   );
//       //   console.log('hashPermit:', hashPermit);

//       //   console.log(
//       //     'CLICKED, SENDING PERSONAL SIGN REQ',
//       //     'from',
//       //     account,
//       //     msgParams,
//       //   );
//       var params = [account, msgParams];
//       //   console.dir(params);
//       //var method = 'eth_signTypedData_v3'
//       var method = 'eth_signTypedData_v4';
//       //@ts-ignore
//       return {method, params};
//     },
//   );
//   return res;
// }

// export async function finalPermit(method: any, params: any, account: string) {
//   //@ts-ignore
//   const web3 = new Web3(window.ethereum);

//   return await web3.givenProvider.send(
//     {
//       method,
//       params,
//       account,
//     },
//     async function (err: any, result: any) {
//       if (err) return console.dir(err);
//       if (result.error) {
//         alert(result.error.message);
//       }
//       if (result.error) return console.error('ERROR', result);
//       //   console.log('TYPED SIGNED:' + JSON.stringify(result.result));

//       const signature = result.result.substring(2);
//       const r = '0x' + signature.substring(0, 64);
//       const s = '0x' + signature.substring(64, 128);
//       const v = parseInt(signature.substring(128, 130), 16);

//       //   console.log('TYPED r:', r);
//       //   console.log('TYPED s:', s);
//       //   console.log('TYPED v:', v);

//       return {_v: v, _r: r, _s: s};
//     },
//   );
// }
