 // TODO: Write a an automation script to auto deploy + send tokens + init vaults after deploying the token
// 1. IsTokenDeployed? -> yes -> Start deploying vaults
//    IsTokenDeployed? -> no -> wait till token is deployed?
// 2. Start Deploying vaults
// 3. Finish deploying all vaults
// 3. Send tokens to all vaults
// 4. Initialize all vaults

import DeployVault, { getContract, encodePriceSqrt, DeployVaultProp} from "../components/stepThree/DeployVault"

export const deployVaults = async () => {
    // Init Initialize Liquidity Vault
    const vaultState = DeployVault.arguments.vaultState;
    console.info("*****VAULT STATE*****", vaultState);
    // if (vaultState !== 'readyForToken') {
    //     if (vaultState === 'ready' || vaultState === 'notReady') {
    //       console.log('Deploy');
    //     //   DeployVault.prototype.vaultDeploy();
    //     } else {
    //       console.log('Initialize');
    //     }
    //   } else {
    //     console.log('Send Token');
    //   }
}