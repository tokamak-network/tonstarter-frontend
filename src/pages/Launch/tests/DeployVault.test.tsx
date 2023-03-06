// Unit Test code for Deploy vaults

// imports
import DeployVault, {DeployVaultProp, getContract} from "../../Launch/components/stepThree/DeployVault";
import {Contract} from '@ethersproject/contracts';
import {DEPLOYED} from 'constants/index';


// Define vault props
const deployVault = (props: DeployVaultProp) => {
  const { vault } = props;

  if (!vault) {
    throw new Error('No vault provided');
  }

  // Deploy the vault here
};

// describe('deployVault', () => {
//   it('should throw an error if no vault is provided', () => {
//     expect(() => deployVault({})).toThrowError('No vault provided');
//   });

//   it('should deploy the vault when a valid vault is provided', () => {
//     const mockVault = jest.fn();

//     deployVault({ vault: mockVault });

//     expect(mockVault).toHaveBeenCalled();
//   });
// });

// Get encoded Square root of the price.
// describe('encodePriceSqrt', () => {
//   it('should return the encoded price sqrt', () => {
//     const reserve1 = new bn(100);
//     const reserve0 = new bn(50);

//     const expectedResult = new bn(2).pow(96).multipliedBy(reserve1.div(reserve0).sqrt()).integerValue(3).toFixed();

//     expect(encodePriceSqrt(reserve1, reserve0)).toEqual(expectedResult);
//   });
// });


//Get Contract for each vault
describe('getContract', () => {
  it('should return the correct contract for Public', () => {
    const library = 'LibraryType';
    const vaultType = 'Public';

    const expectedContract = new Contract(DEPLOYED.PublicSaleVault, PublicSaleVaultCreateAbi.abi, library);

    expect(getContract(vaultType, library)).toEqual(expectedContract);
  });

  it('should return the correct contract for Initial Liquidity', () => {
    const library = 'LibraryType';
    const vaultType = 'Initial Liquidity';

    const expectedContract = new Contract(DEPLOYED.InitialLiquidityVault, InitialLiquidityAbi.abi, library);

    expect(getContract(vaultType, library)).toEqual(expectedContract);
  });

  it('should return the correct contract for Vesting', () => {
    const library = 'LibraryType';
    const vaultType = 'Vesting';

    const expectedContract = new Contract(DEPLOYED.VestingVault, VestingPublicFundFactoryAbi.abi, library);

    expect(getContract(vaultType, library)).toEqual(expectedContract);
  });

  it('should return the correct contract for Liquidity Incentive', () => {
    const library = 'LibraryType';
    const vaultType = 'Liquidity Incentive';

    const expectedContract = new Contract(DEPLOYED.LiquidityIncentiveVault, LiquidityIncentiveAbi.abi, library);

    expect(getContract(vaultType, library)).toEqual(expectedContract);
  });

  it('should return the correct contract for TON Staker', () => {
    const library = 'LibraryType';
    const vaultType = 'TON Staker';

    const expectedContract = new Contract(DEPLOYED.TonStakerVault, TONStakerAbi.abi, library);

    expect(getContract(vaultType, library)).toEqual(expectedContract);
  });
});					  	  	  	  	  	  	  	  	  	  	

// 
describe('DeployVault', () => {
  it('should return the correct vault state', () => {
    const vaultType = 'Public';
    const library = {};

    const contract = getContract(vaultType, library);

    expect(contract).toBeInstanceOf(Contract);
  });

  it('should encode the correct price sqrt', () => {
    const reserve1 = 10;
    const reserve0 = 5;

    const encodedPriceSqrt = encodePriceSqrt(reserve1, reserve0);

    expect(encodedPriceSqrt).toEqual('786432');
  });

  it('should set the correct vault state', async () => {
    const PublicVaultData = {vaultAddress: '0x123'};

    jest.spyOn(Contract.prototype, 'snapshot').mockImplementationOnce(() => 0);

    await DeployVault({vault: PublicVaultData});

    expect(setFieldValue).toHaveBeenCalledWith('vaults[].isSet', false);
  });
});
