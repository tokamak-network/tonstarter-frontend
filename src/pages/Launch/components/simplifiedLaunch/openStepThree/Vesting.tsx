import {Flex, useColorMode, useTheme, Text,  Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';
import {useFormikContext} from 'formik';
import {Projects,VaultCommon,VaultPublic} from '@Launch/types';
import {shortenAddress} from 'utils/address';
import moment from 'moment';


const Vesting = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const vestingVault = values.vaults[2] as VaultCommon;
  const publicVault = values.vaults[0] as VaultPublic;

    const detailsVault = [
      {name: 'Vault Name', value: 'Vesting'},
      {name: 'Admin', value: `${shortenAddress(vestingVault.adminAddress)}`},
      {name: 'Contract', value: vestingVault.vaultAddress? shortenAddress(vestingVault.vaultAddress) : 'NA'},

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
         Vesting
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
        <Text  fontSize={'13px'}  textAlign={'left'}>Claim Rounds ({vestingVault.claim.length})</Text>
        </Flex>
       
        {vestingVault.claim.map((claim: any, index: Number) => {
          return (
            <Flex  w="100%" justifyContent={'space-between'} h="30px" alignItems={'center'}>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                     <span style={{color:'#3d495d', marginRight:'3px'}}>0{index}</span>
                {/* {claim.claimTime} */}
               {moment.unix(Number(claim.claimTime)).format('YYYY.MM.DD HH:mm:ss')}
              </Text>
              <Text
                fontSize={'12px'}
                fontFamily={theme.fonts.roboto}
                fontWeight={500}
                >
                {publicVault.hardCap?(publicVault.hardCap*claim.claimTokenAllocation/100).toLocaleString():0} TON ({claim.claimTokenAllocation}%)
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

export default Vesting;