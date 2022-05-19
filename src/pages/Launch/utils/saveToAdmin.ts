import {Projects, VaultPublic} from '@Launch/types';
import {AdminObject} from '@Admin/types';
import {createStarter} from '@Admin/utils/createStarter';

async function saveToAdmin(
  projectData: Projects['CreateProject'],
  projectKey: string,
) {
  if (projectKey === undefined || projectKey === null) {
    return alert(
      'This project has no project hashkey. Please ask to Admin about this problem.',
    );
  }

  const {
    projectName,
    description,
    ownerAddress,
    website,
    telegram,
    medium,
    twitter,
    discord,
    sector,
    tokenName,
    tokenAddress,
    tokenSymbol,
    tokenSymbolImage,
    vaults,
    projectTokenPrice,
  } = projectData;
  const publicVault = vaults[0] as VaultPublic;

  const adminData: AdminObject & {projectKey: string} = {
    name: projectName!,
    description: description!,
    adminAddress: ownerAddress,
    website: website,
    telegram: telegram,
    medium: medium,
    twitter: twitter,
    discord: discord,
    sector,
    tokenName: tokenName!,
    tokenAddress: tokenAddress!,
    tokenSymbol: tokenSymbol!,
    tokenSymbolImage: tokenSymbolImage!,
    tokenAllocationAmount: String(publicVault.vaultTokenAllocation)!,
    tokenFundRaisingTargetAmount: String(publicVault.hardCap)!,
    fundingTokenType: 'TON',
    tokenFundingRecipient: publicVault.addressForReceiving!,
    projectTokenRatio: projectTokenPrice,
    projectFundingTokenRatio: 1,
    saleContractAddress: publicVault.vaultAddress!,
    snapshot: publicVault.snapshot!,
    startAddWhiteTime: publicVault.whitelist!,
    endAddWhiteTime: publicVault.whitelistEnd!,
    startExclusiveTime: publicVault.publicRound1!,
    endExclusiveTime: publicVault.publicRound1End!,
    startDepositTime: publicVault.publicRound2!,
    endDepositTime: publicVault.publicRound2End!,
    startClaimTime: publicVault.claim[0].claimTime!,
    claimInterval: publicVault.claim[1]
      ? publicVault.claim[1].claimTime! - publicVault.claim[0].claimTime!
      : 0,
    claimPeriod: publicVault.claim.length,
    claimFirst: publicVault.claim[0].claimTokenAllocation!,
    position: 'upcoming',
    production: 'production',
    //    position: 'active' | 'upcoming' | '',
    //    production: 'dev' | 'production' | '',
    topSlideExposure: false,
    projectKey,
  };
  return createStarter(adminData);
}

export default saveToAdmin;
