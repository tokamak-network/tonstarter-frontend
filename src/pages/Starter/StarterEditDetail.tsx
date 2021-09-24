import {
  Box,
  useColorMode,
  useTheme,
  Flex,
  Avatar,
  Text,
  Stack,
  Input,
  Button
} from '@chakra-ui/react';
import React, {useCallback, useState, useEffect} from 'react';
import { selectStarters } from './starter.reducer';
import { selectApp } from '../../store/app/app.reducer';
import { useAppSelector } from '../../hooks/useRedux';
import { getRandomKey, updateStarter } from './components/api';
import BigNumber from 'bignumber.js';
import { useWeb3React } from '@web3-react/core';
import Web3 from 'web3';


export const StarterEditDetail = ({match}: any) => {
  const {data} = useAppSelector(selectStarters);
  const contractAddress = match.params.address
  const {account} = useWeb3React();

  const selectedData = data.filter(data => data.tokenAddress.toLowerCase() == contractAddress.toLowerCase())
  const originalDescription = selectedData[0].description.toString()
  const originalName = selectedData[0].name.toString()

  const [description, setDescription] = useState<string>(originalDescription);
  const [name, setName] = useState<string>(originalName);

  const handleChangeDescription = useCallback((e) => {
    setDescription(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeName = useCallback((e) => {
    setName(e.target.value);
    /*eslint-disable*/
  }, []);

  const generateSig = async (account: string) => {
    const randomvalue = await getRandomKey(account);
    //@ts-ignore
    const web3 = new Web3(window.ethereum);
    console.log(randomvalue)
    if (randomvalue != null) {
      const randomBn = new BigNumber(randomvalue).toFixed(0);
      const soliditySha3 = await web3.utils.soliditySha3(
        { type: 'string', value: account },
        { type: 'uint256', value: randomBn },
      );

      //@ts-ignore
      const sig = await web3.eth.personal.sign(soliditySha3, account, '');

      return sig;
    } else {
      return null;
    }
  }

  const edit = async (name: any, description: any, account: any) => {
    if (account) {
      const sig = await generateSig(account.toLowerCase());
      //@ts-ignore
      const a = await updateStarter(account.toLowerCase(), description, sig, contractAddress)
      console.log(a)
    }
  }

  return (
    <Flex px={353} flexDir="column" mt={'172px'} alignContent="center">
      <Stack
        pt="27px"
        as={Flex}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'full'}
      >
        <Text
          w={'full'}
          textAlign="left"
        >
          Project Name
        </Text>
        <Input 
          variant={'outline'}
          borderWidth={1}
          textAlign={'left'}
          fontWeight={'bold'}
          fontSize={'4l'}
          value={name}
          width={'full'}
          onChange={handleChangeName}
          _focus={{
            borderWidth: 0,
          }}
        />
      </Stack>
      <Stack
        pt="27px"
        as={Flex}
        flexDir={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        w={'full'}
      >
        <Text
          w={'full'}
          textAlign="left"
        >
          Description
        </Text>
        <Input 
          variant={'outline'}
          borderWidth={1}
          textAlign={'left'}
          fontWeight={'bold'}
          fontSize={'4l'}
          value={description}
          width={'full'}
          h='200px'
          onChange={handleChangeDescription}
          _focus={{
            borderWidth: 0,
          }}
        />
      </Stack>
      <Box as={Flex} justifyContent={'flex-start'} pt={`30px`}>
        <Button
          w={'150px'}
          bg={'blue.500'}
          color="white.100"
          fontSize="14px"
          _hover={{backgroundColor: 'blue.100'}}
          onClick={() =>
            edit(name, description, account)
          }
        >
          Edit
        </Button>
      </Box>
    </Flex>
  );
}