import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {useFormikContext} from 'formik';
import {useContract} from 'hooks/useContract';
import * as ERC20 from 'services/abis/erc20ABI(SYMBOL).json';
import {useBlockNumber} from 'hooks/useBlock';

import {Projects, VaultCommon, VaultLiquidityIncentive} from '@Launch/types';
import {convertNumber} from 'utils/number';

const Distribute = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {blockNumber} = useBlockNumber();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
  const vaults = values.vaults;
  const [disabled, setDisabled] = useState(true);
  const [notDeployedAll, setNotDeployedAll] = useState(false);

  const ERC20_CONTRACT = useContract(values?.tokenAddress, ERC20.abi);

  useEffect(() => {
    const isDeployed = vaults.map((vault: VaultCommon) => {
      return vault.isDeployed;
    });

    const nonDeployedExcists = isDeployed.indexOf(false) !== -1
   setNotDeployedAll(nonDeployedExcists)

   
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
                return hasToken
            }
          }

          else {
            return false
          }
        }),
      );

    }

     fetchContractBalance();
   
    
    console.log('isDeployed', isDeployed);
  }, [values, vaults]);

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
          _hover={{}}
          borderRadius={4}>
          Distribute
        </Button>
      </Flex>
    </Flex>
  );
};

export default Distribute;
