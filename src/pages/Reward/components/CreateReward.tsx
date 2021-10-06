import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CustomInput} from 'components/Basic';
import {createReward, getRandomKey} from './api';
import Web3 from 'web3';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import {DEPLOYED} from 'constants/index';
import { getSigner } from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import * as TOSABI from 'services/abis/TOS.json';

import { sign } from 'crypto';
const {TOS_ADDRESS, UniswapStaker_Address} = DEPLOYED;

const themeDesign = {
  border: {
    light: 'solid 1px #d7d9df',
    dark: 'solid 1px #535353',
  },
  font: {
    light: 'black.300',
    dark: 'gray.475',
  },
  tosFont: {
    light: 'gray.250',
    dark: 'black.100',
  },
};
type CreateRewardProps = {
  pools: any[];
};
type CreateReward = {
  poolName: string;
  poolAddress: string;
  rewardToken: string;
  incentiveKey: object;
  startTime: number;
  endTime: number;
  allocatedReward: string;
  numStakers: number;
  status: string;
  verified: boolean;
  tx: string;
  sig: string;
};
export const CreateReward: FC<CreateRewardProps> = ({pools}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [amount, setAmount] = useState<Number>(0);
  const [reward, setReward] = useState<Number>(0);
  const startTime = 1633588921;
  const endTime = 1633675321;

  const generateSig = async (account: string) => {
    const randomvalue = await getRandomKey(account);
    const pool = '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf';
    //@ts-ignore
    const web3 = new Web3(window.ethereum);
    if (randomvalue != null) {
      const randomBn = new BigNumber(randomvalue).toFixed(0);
      const soliditySha3 = await web3.utils.soliditySha3(
        {type: 'string', value: account},
        {type: 'uint256', value: randomBn},
        {type: 'string', value: TOS_ADDRESS},
        {type: 'string', value: pool},
        {type: 'uint256', value: startTime.toString()},
        {type: 'uint256', value: endTime.toString()},
      );

      //@ts-ignore
      const sig = await web3.eth.personal.sign(soliditySha3, account, '');
      console.log(sig);

      return sig.toString();
    } else {
      return '';
    }
  };

  const createRewardFunc = async (account: string) => {
    if (account === null || account === undefined && library === undefined) {
      return;
    }
  const uniswapStakerContract= new Contract(UniswapStaker_Address, STAKERABI.abi, library);
  const tosContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
  const totalReward = new BigNumber('100000000000000000000').toString();
  if (library !== undefined){
    // const uniswapV3Staker = getSigner(library,UniswapStaker_Address);
    const signer = getSigner(library, account);
    await tosContract.connect(signer).approve(UniswapStaker_Address,totalReward);
    const allowAmount = await tosContract.connect(signer).allowance(account, UniswapStaker_Address);
  console.log('startTime', startTime);
  console.log('endTime', endTime);
  
  
    const sig = await generateSig(account);
    const key = {
      rewardToken: TOS_ADDRESS,
      pool: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
      startTime: startTime,
      endTime: endTime,
      refundee: account,
    };
    const tx = await uniswapStakerContract.connect(signer).createIncentive(key, totalReward)
    await tx.wait();
    const args: CreateReward = {
      poolName: 'test2 rewards',
      poolAddress: '0x516e1af7303a94f81e91e4ac29e20f4319d4ecaf',
      rewardToken: TOS_ADDRESS,
      incentiveKey: key,
      startTime: startTime,
      endTime: endTime,
      allocatedReward: totalReward,
      numStakers: 2,
      status: 'open',
      verified: true,
      tx: tx,
      sig: sig,
    };
    const create = await createReward(args);
    console.log('create', create);
    
  }
  
 
  
  };
  return (
    <Container>
      <Box
        border={themeDesign.border[colorMode]}
        h={'300px'}
        w={'400px'}
        p={'10px'}>
        <Text fontWeight={'600'}>Create my own reward program</Text>
        <Flex justifyContent={'space-between'}>
          <Text>pool</Text>
          <Select h={'32px'} color={'#86929d'} fontSize={'13px'} w={'140px'}>
            {pools.map((item, index) => (
              <option value={item} key={index}>
                {item.name}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Text>Start</Text>
          <Text> 2021/10/20</Text>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Text>End</Text>
          <Box>
            <Text>2021/10/30</Text>
          </Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Text>Reward</Text>
          <Box>
            <CustomInput value={reward} setValue={setReward} w={'140px'} />
          </Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Text>Amount</Text>
          <Box>
            <CustomInput value={amount} setValue={setAmount} w={'140px'} />
          </Box>
        </Flex>
        <Flex justifyContent={'space-between'}>
          <Button
            w={'150px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            _hover={{backgroundColor: 'blue.100'}}
            onClick={() => createRewardFunc(account ? account.toString() : '')}>
            Approve
          </Button>
          <Button
            w={'150px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            _hover={{backgroundColor: 'blue.100'}}>
            Create
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};
