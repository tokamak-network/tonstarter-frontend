import { ethers } from "ethers";
import Web3Token from 'web3-token';

async function getWeb3Token () {
if(!window.ethereum) {
    alert("Please intall metamask and signin")
}

try {
// Connection to MetaMask wallet
//@ts-ignore
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

// generating a token with 1 day of expiration time
//@ts-ignore
const token = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d');

// Signer Opts here
// domain: 'worldofdefish.com',
//   statement: 'I accept the WoD Terms of Service: https://service.org/tos',
//   expire_in: '3 days',
//   // won't be able to use this token for one hour
//   not_before: new Date(Date.now() + (3600 * 1000)),
//   nonce: 11111111,

// attaching token to authorization header ... for example
return token
} catch(e) {
    console.log('**web3-token**')
    console.log(e)
}
}

export default getWeb3Token