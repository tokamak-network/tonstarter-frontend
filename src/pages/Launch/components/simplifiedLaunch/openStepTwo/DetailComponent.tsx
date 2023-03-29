import {Flex,Text, useColorMode, Button, useTheme} from '@chakra-ui/react';
import {useEffect, useState, useCallback} from 'react';
import {useFormikContext} from 'formik';
import {Projects,VaultPublic} from '@Launch/types';

const DetailComponent = () => {
    const {colorMode} = useColorMode();
    const theme = useTheme();
    const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
    
    const {vaults} = values;
    const publicVault = vaults[0] as VaultPublic;
  const details = [
    {name: 'Funding Target', detail: `$ ${values.fundingTarget? (values.fundingTarget).toLocaleString():'0'}` },
    {name: 'Current Market Cap', detail: `$ ${values.marketCap? (values.marketCap).toLocaleString():'0'}`},
    {name: 'Total Supply', detail: `${values.totalSupply? (values.totalSupply).toLocaleString():'0'} ${values.tokenSymbol}`},
    {name: 'Token Funding Price', detail: `${values.projectTokenPrice? (1/values.projectTokenPrice).toLocaleString():'0'} TON`},
    {name: 'Token Listing Price (DEX)', detail: `${values.tosPrice !== 0? ( 1/values.tosPrice).toLocaleString():0} TOS`},
  ];
  return (
  <Flex mt="30px" flexDir={'column'}>
{details.map((detail:any, index:number) => {
    return (
        <Flex key={index} w='100%' justifyContent={'space-between'} fontSize='12px' mb='9px'>
            <Text lineHeight={'16px'} fontWeight={500} color={colorMode==='dark'?'#9d9ea5':'#7e7e8f'}>{detail.name}</Text>
            <Text lineHeight={'16px'} fontWeight={500} color={colorMode==='dark'?'white.200':'gray.375'}>{detail.detail}</Text>
        </Flex>
    )
})}
  </Flex>);
};

export default DetailComponent;
