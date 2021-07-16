import { getTokamakContract } from '../../../utils/contract';
import { convertNumber } from '../../../utils/number';

export const fetchAirdropPayload = async (account: any) => {
  
  const AirdropVault = getTokamakContract('Airdrop');
  
  const currentRound = await AirdropVault.currentRound();
  const totalTgeCount = await AirdropVault.totalTgeCount();
  const tgeCount = currentRound >= totalTgeCount ? totalTgeCount : currentRound;
  let roundInfo: any = [];
  let claimedAmount;

  if (account) {
    try {
      for (let i=1; i < tgeCount; i++) {
        const result = await AirdropVault.getTgeInfos(i)
        let whitelist
        let airdropInfo
        
          whitelist = await AirdropVault.getWhitelistInfo(i, account);
          if (whitelist[0]) {
            airdropInfo = {
              roundNumber: i,
              allocatedAmount: convertNumber({amount: result.allocatedAmount}),
              amount: convertNumber({amount: result.amount}),
              myAmount: convertNumber({amount: result.amount})
            }
          } else {
            airdropInfo = {
              roundNumber: i,
              allocatedAmount: convertNumber({amount: result.allocatedAmount}),
              amount: convertNumber({amount: result.amount}),
              myAmount: convertNumber({amount: '0'}),
            }
          }
        roundInfo.push(airdropInfo);
      }
    } catch (e) {
      console.log(e);
    }
    claimedAmount = await AirdropVault.userClaimedAmount(account);
  }
  return {
    roundInfo: roundInfo,
    claimedAmount: convertNumber({ amount: claimedAmount })
  }
}
