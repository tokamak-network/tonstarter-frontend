import {
  Flex,
  useColorMode,
  useTheme,
  Text,
  Image,
  Button,
} from '@chakra-ui/react';
import {useEffect, useState, Dispatch, SetStateAction} from 'react';

const ProjectToken = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const details = [
    {
      name: 'Token Name',
      value: 'TON',
    },
    {
      name: 'Token Symbol',
      value: 'TON',
    },
    {name: 'Total Supply', value: '50,000 TON'},
  ];
  return (
    <Flex
      mt="30px"
      h="489px"
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
         mt='19px'
         mb='21px'
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize="20px"
          color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
          Project Token
        </Text>
      </Flex>
      <Flex mt="30px" flexDir={'column'} px="20px" w="100%">
        {details.map((detail: any) => {
          return (
            <Flex w="100%" justifyContent={'space-between'} h="45px">
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
                color={colorMode === 'dark' ? 'white.100' : 'gray.250'}>
                {detail.value}
              </Text>
            </Flex>
          );
        })}
        <Text
          mt="35px"
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
          color={colorMode === 'dark' ? 'white.200' : 'gray.225'}>
          The team will create a TOS Reward Program (TOS) fund by buying $100
          worth of TOS tokens on a daily basis. The fund will be used to reward
          to the contributors who have worked on the following categories:
        </Text>
      </Flex>
      <Flex
        mt="26px"
        w="100%"
        h='88px'
        justifyContent={'center'}
        alignItems='center'
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

export default ProjectToken;
