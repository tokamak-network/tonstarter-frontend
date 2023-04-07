import {Flex, Text, useColorMode, Button, useTheme} from '@chakra-ui/react';
import {useEffect, useState, useCallback} from 'react';
import {useFormikContext} from 'formik';
import {Projects, VaultPublic} from '@Launch/types';

const DetailComponent = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} =
    useFormikContext<Projects['CreateSimplifiedProject']>();

  const {vaults} = values;
  const publicVault = vaults[0] as VaultPublic;

  const getZeros = (num: number) => {
    const match = num.toString().match(/\.0*(.*)/);
    if (match && match[1] && num > 0) {
      const numZeros = num.toString().length - 1 - match[1].length;
      return numZeros;
      // return zeros; // Output:
    } else {
      return 0;
    }
  }

  const details = [
    {
      name: 'Funding Target',
      detail: `$ ${
        values.fundingTarget ? values.fundingTarget.toLocaleString() : '-'
      }`,
    },
    {
      name: 'Current Market Cap',
      detail: `$ ${
        values.marketCap
          ? values.marketCap.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })
          : '-'
      }`,
    },
    {
      name: 'Total Supply',
      detail: `${
        values.totalSupply ? values.totalSupply.toLocaleString() : '-'
      } ${values.tokenSymbol}`,
    },
    {
      name: 'Token Funding Price',
      detail: `${
        values.projectTokenPrice
          ? (1 / values.projectTokenPrice).toLocaleString(undefined, {
              minimumFractionDigits: getZeros(1 / values.projectTokenPrice),
            })
          : '-'
      } TON`,
    },
    {
      name: 'Token Listing Price (DEX)',
      detail: `${
        values.tosPrice !== 0
          ? (1 / values.tosPrice).toLocaleString(undefined, {
              minimumFractionDigits: getZeros(1 / values.tosPrice),
            })
          : '-'
      } TOS`,
    },
  ];
  return (
    <Flex mt="30px" flexDir={'column'}>
      {details.map((detail: any, index: number) => {
        return (
          <Flex
            key={index}
            w="100%"
            justifyContent={'space-between'}
            fontSize="12px"
            mb="9px">
            <Text
              lineHeight={'16px'}
              fontWeight={500}
              color={colorMode === 'dark' ? '#9d9ea5' : '#7e7e8f'}>
              {detail.name}
            </Text>
            <Text
              lineHeight={'16px'}
              fontWeight={'bold'}
              color={colorMode === 'dark' ? 'white.200' : 'gray.375'}>
              {detail.detail}
            </Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default DetailComponent;
