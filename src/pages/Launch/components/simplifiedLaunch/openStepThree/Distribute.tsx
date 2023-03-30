import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
} from 'react';
import {useFormikContext} from 'formik';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useBlockNumber} from 'hooks/useBlock';
import * as TokenDistributeABI from 'services/abis/TokenDistribute.json';
import {Projects, VaultCommon, VaultLiquidityIncentive} from '@Launch/types';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {DEPLOYED} from 'constants/index';
import {Contract} from '@ethersproject/contracts';
import {getSigner} from 'utils/contract';
import {saveProject, editProject} from '@Launch/utils/saveProject';
import {convertNumber, convertToWei} from 'utils/number';
import {ethers} from 'ethers';
import * as TON from 'services/abis/TON.json';

const Distribute = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {blockNumber} = useBlockNumber();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const vaults = values.vaults;
  const [notDeployedAll, setNotDeployedAll] = useState(false);
  // const []
  const ERC20_CONTRACT = useContract(values?.tokenAddress, TON.abi);
  const {account, library} = useActiveWeb3React();

  const {TokenDistribute} = DEPLOYED;

  useEffect(() => {
    const isDeployed = vaults.map((vault: VaultCommon) => {
      return vault.isDeployed;
    });

    const nonDeployedExists = isDeployed.indexOf(false) !== -1;
    setNotDeployedAll(nonDeployedExists);

    async function fetchContractBalance() {
      const res = await Promise.all(
        vaults.map(async (vault: VaultCommon) => {
          if (
            ERC20_CONTRACT &&
            vault?.vaultAddress &&
            vault?.isDeployed === true
          ) {
            const tokenBalance = await ERC20_CONTRACT.balanceOf(
              vault.vaultAddress,
            );            

            if (tokenBalance && vault.vaultTokenAllocation) {
              const hasToken =
                vault.vaultTokenAllocation <=
                Number(convertNumber({amount: tokenBalance.toString()}));
              return hasToken;
            }
          } else {
            return false;
          }
        }),
      );
    }
    fetchContractBalance();
  }, [ERC20_CONTRACT, values, vaults]);

  const sendTokens = useCallback(async () => {
    if (account && library) {
      const signer = getSigner(library, account);
      const tokenDistributeContract = new Contract(
        TokenDistribute as string,
        TokenDistributeABI.abi,
        library,
      );

      let params: any[] = [];
      const deployedVaults = vaults.filter(
        (vault: VaultCommon) =>
          vault.vaultType !== 'Vesting' &&
          vault.vaultAddress !== '' &&
          vault.vaultAddress !== undefined,
      );

      const getParams = deployedVaults.map((vault: VaultCommon) => {
        params.push(
          vault.vaultAddress?.toLowerCase(),
          convertToWei(vault.vaultTokenAllocation.toString()),
        );
      });

      const totalAmount = deployedVaults.reduce(
        (accumulator, vault) => accumulator + vault.vaultTokenAllocation,
        0,
      );

      const amountInTON = convertToWei(totalAmount.toString());

      const stringArray = Array(deployedVaults.length)
        .fill(['address', 'uint256'])
        .flat();

      const paramsData = ethers.utils.solidityPack(stringArray, params);      

      const data = ethers.utils.solidityPack(['bytes'], [paramsData]);

      const tx = await ERC20_CONTRACT?.connect(signer).approveAndCall(
        TokenDistribute.toLowerCase(),
        amountInTON,
        data,
      );


    }
  }, [TokenDistribute, account, library, vaults, blockNumber]);

  return (
    <Flex
      mt="30px"
      h="600px"
      w="350px"
      flexDir={'column'}
      borderRadius={'15px'}
      alignItems="center"
      border={colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'}>
      <Flex h="511px" flexDir={'column'} justifyContent="center">
        <Text
          fontSize={'30px'}
          fontWeight="bold"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}
          textAlign={'center'}>
          Distribute tokens to all vaults
        </Text>
        <Text
          mt="3px"
          color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}
          fontSize={'16px'}
          textAlign={'center'}>
          (beside Vesting Vaullt)
        </Text>
      </Flex>
      <Flex
        w="100%"
        h="88px"
        justifyContent={'center'}
        alignItems="center"
        borderTop={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Button
          type="submit"
          w={'150px'}
          h={'38px'}
          bg={'blue.500'}
          fontSize={14}
          color={'white.100'}
          mr={'12px'}
          _disabled={{background: colorMode === 'dark'?'#353535':'#e9edf1',color: colorMode === 'dark'?'#838383':'#86929d', cursor:'not-allowed'}}

          _hover={{}}
          isDisabled={notDeployedAll}
          borderRadius={4}
          onClick={() => sendTokens()}>
          Distribute
        </Button>
      </Flex>
    </Flex>
  );
};

export default Distribute;
