import {Flex, useColorMode, useTheme, Text, Button} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';

const Public = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [type, setType] = useState<'Vault' | 'Sale'>('Vault');

  const detailsVault = [
    {name: 'Vault Name', value: 'Vesting'},
    {name: 'Admin', value: 'TON'},
    {name: 'Contract', value: '50,000 TON'},
    {name: 'Token Allocation', value: '50,000 TON'},
    //   {name: 'Token Price', value: '50,000 TON'},
    //   {name: 'Start Time', value: '50,000 TON'},
  ];
  const detailsClaim = [
    {name: '22.01.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
    {name: '22.02.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
    {name: '22.03.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
    {name: '22.04.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
    {name: '22.04.2022 17:00:00', value: '6,000,000 TON (6.00%)'},
  ];

  const VaultClaim = (props: {}) => {
    return (
      <Flex flexDir={'column'}>
        <Flex
        
          flexDir={'column'}
          px="20px"
          w="100%"
          alignItems={'center'}>
         
          <Text h="18px" mb="10px" fontSize={'13px'}>
            Vault
          </Text>
          {detailsVault.map((detail: any) => {
            return (
              <Flex
                w="100%"
                justifyContent={'space-between'}
                h="45px"
                alignItems={'center'}>
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
                  color={
                    detail.name === 'Admin' || detail.name === 'Contract'
                      ? 'blue.300'
                      : colorMode === 'dark'
                      ? 'white.100'
                      : 'gray.250'
                  }>
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
          <Text mb="10px" fontSize={'13px'} h="18px">
            Claim
          </Text>
          <Flex w="100%" h="45px" alignItems={'center'}>
            <Text fontSize={'13px'} textAlign={'left'}>
              Claim Rounds ({detailsClaim.length})
            </Text>
          </Flex>

          {detailsClaim.map((detail: any, index: Number) => {
            return (
              <Flex
                w="100%"
                justifyContent={'space-between'}
                h="30px"
                alignItems={'center'}>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={colorMode === 'dark' ? 'gray.425' : 'gray.400'}>
                  <span style={{color: '#3d495d', marginRight: '3px'}}>
                    0{index}
                  </span>
                  {detail.name}
                </Text>
                <Text
                  fontSize={'12px'}
                  fontFamily={theme.fonts.roboto}
                  fontWeight={500}
                  color={
                    detail.name === 'Admin' || detail.name === 'Contract'
                      ? 'blue.300'
                      : colorMode === 'dark'
                      ? 'white.100'
                      : 'gray.250'
                  }>
                  {detail.value}
                </Text>
              </Flex>
            );
          })}
        </Flex>
      </Flex>
    );
  };

  const Sale = (props: {}) => {
    return (
      <Flex>
        <Text>Sale</Text>
      </Flex>
    );
  };
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
          mt="19px"
          mb="21px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Public
        </Text>
      </Flex>
      <Flex w="272px" h="26px" fontSize={'12px'} mb="30px"   mt="30px">
            <Flex
              w="50%"
              border={
                type === 'Vault'
                  ? '1px solid #2a72e5'
                  : colorMode === 'dark'
                  ? '1px solid #535353'
                  : '1px solid #d7d9df'
              }
              cursor="pointer"
              borderLeftRadius="5px"
              borderRight={type !== 'Vault' ? 'none' : ''}
              alignItems={'center'}
              onClick={() => setType('Vault')}
              justifyContent={'center'}>
              <Text
                color={
                  type === 'Vault'
                    ? 'blue.300'
                    : colorMode === 'dark'
                    ? 'white.100'
                    : 'gray.250'
                }>
                Vault & Claim
              </Text>
            </Flex>
            <Flex
              w="50%"
              border={
                type === 'Sale'
                  ? '1px solid #2a72e5'
                  : colorMode === 'dark'
                  ? '1px solid #535353'
                  : '1px solid #d7d9df'
              }
              cursor="pointer"
              onClick={() => setType('Sale')}
              borderLeft={type !== 'Sale' ? 'none' : ''}
              borderRightRadius="5px"
              alignItems={'center'}
              justifyContent={'center'}>
              <Text
                color={
                  type === 'Sale'
                    ? 'blue.300'
                    : colorMode === 'dark'
                    ? 'white.100'
                    : 'gray.250'
                }>
                Sale
              </Text>
            </Flex>
          </Flex>
      {type === 'Sale'?<Sale/>:<VaultClaim/>}

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
  );
};

export default Public;
