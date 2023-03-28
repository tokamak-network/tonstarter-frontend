import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Button,
} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {useFormikContext} from 'formik';
import {Projects,VaultLiquidityIncentive} from '@Launch/types';
import {shortenAddress} from 'utils/address';

const InitialLiquidity = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
  useFormikContext<Projects['CreateSimplifiedProject']>();

  const initialVault = values.vaults[1] as VaultLiquidityIncentive
  
  
  const details = [
    {name: 'Vault Name', value: `${initialVault.vaultName}`},
    {name: 'Admin', value: `${values.ownerAddress?shortenAddress(values.ownerAddress) :''}`},
    {name: 'Contract', value: `${initialVault.vaultAddress? shortenAddress(initialVault.vaultAddress) : 'NA'}`},
    {name: 'Token Allocation', value: `${initialVault.vaultTokenAllocation.toLocaleString()} ${values.tokenSymbol}`},
    {name: 'Token Price', value: `${values.tokenPrice? (values.tokenPrice).toLocaleString():'0'} TON`},
    {name: 'Start Time', value: '50,000 TON'},
  ];

  return (
    <Flex
      mt="30px"
      h="600px"
      w="350px"
      flexDir={'column'}
      borderRadius={'15px'}
      alignItems="center"
      border={colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'}>
      <Flex
        h="71px"
        w="100%"
        alignItems={'center'}
        justifyContent="center"
        borderBottom={
          colorMode === 'dark' ? '1px solid #363636' : '1px solid #e6eaee'
        }>
        <Text
        lineHeight={1.5}
        mt='19px'
        mb='21px'
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Initial Liquidity
        </Text>
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text mb="11px" fontSize={'13px'}>
          Vault
        </Text>
        {details.map((detail: any) => {
          return (
            <Flex w="100%" justifyContent={'space-between'} h="45px" alignItems={'center'}>
              <Text
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                {detail.name}
              </Text>
              <Text
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={detail.name === 'Admin' || detail.name === 'Contract'? 'blue.300': colorMode === 'dark' ? 'white.100' : 'gray.250'}>
                {detail.value}
              </Text>
            </Flex>
          );
        })}
        <Text
          mt="37px"
          textAlign={'center'}
          fontWeight={500}
          fontSize="13px"
         
          color={'#ff3b3b'}>
          Warning
        </Text>
        <Text
          textAlign={'center'}
          mt="10px"
          fontWeight={500}
          fontSize="12px"
          lineHeight={1.5}
          color={colorMode === 'dark' ? 'white.200' : 'gray.225'}>
          If the deployment is not completed within the deadline, the entire
          funding process will be canceled.
        </Text>
      </Flex>
      <Flex
        mt="13px"
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
          Deploy
        </Button>
      </Flex>
    </Flex>
  );
};

export default InitialLiquidity;
