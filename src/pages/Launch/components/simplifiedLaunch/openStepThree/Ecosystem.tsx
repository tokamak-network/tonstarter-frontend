import {Flex, useColorMode, useTheme, Text,  Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {Projects,VaultEco} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import {useFormikContext} from 'formik';


const Ecosystem = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();
    
    const ecoVault = values.vaults[3] as VaultEco

    const detailsVault = [
      {name: 'Vault Name', value:  `${ecoVault.vaultName}`},
      {name: 'Admin', value: `${values.ownerAddress?shortenAddress(values.ownerAddress) :''}`},
      {name: 'Contract', value: `${ecoVault.vaultAddress? shortenAddress(ecoVault.vaultAddress) : 'NA'}`},
    {name: 'Token Allocation', value: `${ecoVault.vaultTokenAllocation.toLocaleString()} ${values.tokenSymbol}`},
    ];
    const detailsClaim = [
        { name: '22.01.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
        {name: '22.02.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
        {name: '22.03.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
        {name: '22.04.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
        {name: '22.04.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
     
      ];

    return (
        <Flex
      mt="30px"
      h="100%"
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
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          mt='19px'
          mb='21px'
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
         Ecosystem
        </Text>
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text h='18px' mb="10px" fontSize={'13px'}>
          Vault
        </Text>
        {detailsVault.map((detail: any) => {
          return (
            <Flex w="100%" justifyContent={'space-between'} h="45px" alignItems={'center'} >
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
      
      </Flex>
      <Flex
        mt="30px"
        flexDir={'column'}
        px="20px"
        w="100%"
        alignItems={'center'}>
        <Text mb="10px" fontSize={'13px'} h='18px' >
          Claim
        </Text>
        <Flex w='100%' h='45px' alignItems={'center'}>
        <Text  fontSize={'13px'}  textAlign={'left'}>Claim Rounds ({detailsClaim.length})</Text>
        </Flex>
       
        {detailsClaim.map((detail: any, index: Number) => {
          return (
            <Flex  w="100%" justifyContent={'space-between'} h="30px" alignItems={'center'}>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                     <span style={{color:'#3d495d', marginRight:'3px'}}>0{index}</span>
                {detail.name}
               
              </Text>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={detail.name === 'Admin' || detail.name === 'Contract'? 'blue.300': colorMode === 'dark' ? 'white.100' : 'gray.250'}>
                {detail.value}
              </Text>
            </Flex>
          );
        })}
      
      </Flex>
      <Flex
        mt="24px"
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
    )
}

export default Ecosystem;