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
import { useAppSelector } from '../../hooks/useRedux';
import { createStarter } from './components/api';
import { useWeb3React } from '@web3-react/core';

type Create = {
  name: string,
  logo: string,
  symbol: string,
  tokenAddress: string,
  saleAddress: string,
  priority: string, //temp
  fundingToken: string,
  description: string,
  tier: string,
  ratio: string,
  minAllocation: string,
  maxAllocation: string,
  // stakedToken: string,
  // stakedPeriod: string,
  website: string,
  telegram: string,
  medium: string,
  twitter: string,
  discord: string,
}

export const CreateStarter = ({match}: any) => {
  const {data} = useAppSelector(selectStarters);
  const contractAddress = match.params.address
  const {account} = useWeb3React();

  const inputStyle = {
    input: () => ({
      variant: 'outline',
      borderWidth: '1',
      // textAlign: 'left',
      fontWeight: 'bold',
      fontSize: '4l',
      width: 'full'
    })
  }
  const stackStyle = {
    stack: () => ({
      pt: "17px",
      as: Flex,
      // flexDir: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      w: 'full',
    })
  }

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [logo, setLogo] = useState<string>('');
  const [symbol, setSymbol] = useState<string>('');
  const [tokenAddress, setTokenAddress] = useState<string>('');
  const [saleAddress, setSaleAddress] = useState<string>('');
  const [fundingToken, setFundingToken] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [tier, setTier] = useState<string>('');
  const [minAllocation, setMinAllocation] = useState<string>('0');
  const [maxAllocation, setMaxAllocation] = useState<string>('0');
  const [ratio, setRatio] = useState<string>('');
  const [website, setWebsite] = useState<string>('');
  const [medium, setMedium] = useState<string>('');
  const [discord, setDiscord] = useState<string>('');
  const [twitter, setTwitter] = useState<string>('');
  const [telegram, setTelegram] = useState<string>('');


  const handleChangeDescription = useCallback((e) => {
    setDescription(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeName = useCallback((e) => {
    setName(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeLogo = useCallback((e) => {
    setLogo(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeSymbol = useCallback((e) => {
    setSymbol(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeTokenAddress = useCallback((e) => {
    setTokenAddress(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeSaleAddress = useCallback((e) => {
    setSaleAddress(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeFundingToken = useCallback((e) => {
    setFundingToken(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangePriority = useCallback((e) => {
    setPriority(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeTierAllocation = useCallback((e) => {
    setTier(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeRatio = useCallback((e) => {
    setRatio(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeMinAllocation = useCallback((e) => {
    setMinAllocation(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeMaxAllocation = useCallback((e) => {
    setMaxAllocation (e.target.value);
    /*eslint-disable*/
  }, []);
  // const handleChangeStakedPeriod = useCallback((e) => {
  //   setStakedPeriod(e.target.value);
  //   /*eslint-disable*/
  // }, []);
  const handleChangeWebsite = useCallback((e) => {
    setWebsite(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeMedium = useCallback((e) => {
    setMedium(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeTwitter = useCallback((e) => {
    setTwitter(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeDiscord = useCallback((e) => {
    setDiscord(e.target.value);
    /*eslint-disable*/
  }, []);
  const handleChangeTelegram = useCallback((e) => {
    setTelegram(e.target.value);
    /*eslint-disable*/
  }, []);

  const create = async (args: Create) => {
    if (account) {
      const param = {
        ...args,
        account: account.toLowerCase(),
      }
      //@ts-ignore
      const a = await createStarter(param)
      console.log(a)
    }
  }

  return (
    <Flex px={353} flexDir="column" mt={'172px'} alignContent="center">
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Project Name
        </Text>
        <Input 
          {...inputStyle.input()}
          value={name}
          onChange={handleChangeName}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Symbol
        </Text>
        <Input 
          {...inputStyle.input()}
          value={symbol}
          onChange={handleChangeSymbol}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Logo
        </Text>
        <Input 
          {...inputStyle.input()}
          value={logo}
          onChange={handleChangeLogo}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          tokenAddress
        </Text>
        <Input 
          {...inputStyle.input()}
          value={tokenAddress}
          onChange={handleChangeTokenAddress}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          saleAddress
        </Text>
        <Input 
          {...inputStyle.input()}
          value={saleAddress}
          onChange={handleChangeSaleAddress}
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
          h='100px'
          onChange={handleChangeDescription}
          
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Funding Token
        </Text>
        <Input 
          {...inputStyle.input()}
          value={fundingToken}
          onChange={handleChangeFundingToken}
          
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          priority
        </Text>
        <Input 
          {...inputStyle.input()}
          value={priority}
          onChange={handleChangePriority}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Tier
        </Text>
        <Input 
          {...inputStyle.input()}
          value={tier}
          onChange={handleChangeTierAllocation}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Min Allocation
        </Text>
        <Input 
          {...inputStyle.input()}
          value={minAllocation}
          onChange={handleChangeMinAllocation}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Max Allocation
        </Text>
        <Input 
          {...inputStyle.input()}
          value={maxAllocation}
          onChange={handleChangeMaxAllocation}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Ratio
        </Text>
        <Input 
          {...inputStyle.input()}
          value={ratio}
          onChange={handleChangeRatio}
          
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Website
        </Text>
        <Input 
          {...inputStyle.input()}
          value={website}
          onChange={handleChangeWebsite}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Telegram
        </Text>
        <Input 
          {...inputStyle.input()}
          value={telegram}
          onChange={handleChangeTelegram}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Medium
        </Text>
        <Input 
          {...inputStyle.input()}
          value={medium}
          onChange={handleChangeMedium}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Discord
        </Text>
        <Input 
          {...inputStyle.input()}
          value={discord}
          onChange={handleChangeDiscord}
        />
      </Stack>
      <Stack {...stackStyle.stack()}>
        <Text w={'full'} textAlign="left">
          Twitter
        </Text>
        <Input 
          {...inputStyle.input()}
          value={twitter}
          onChange={handleChangeTwitter}
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
            create({
              name: name,
              description: description,
              logo: logo,
              symbol: symbol,
              tokenAddress: tokenAddress,
              saleAddress: saleAddress,
              fundingToken: fundingToken,
              priority: priority,
              tier: tier,
              minAllocation: minAllocation,
              maxAllocation: maxAllocation,
              ratio: ratio,
              website: website,
              medium: medium,
              discord: discord,
              twitter: twitter,
              telegram: telegram,
            })
          }
        >
          Create
        </Button>
      </Box>
    </Flex>
  );
}