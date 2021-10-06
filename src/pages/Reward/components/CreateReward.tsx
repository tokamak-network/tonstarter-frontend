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
import { getRandomKey } from './api';

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

export const CreateReward: FC<CreateRewardProps> = ({pools}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<Number>(100000.0);
  const [amount, setAmount] = useState<Number>(0);
  const [reward, setReward] = useState<Number>(0);
  const generateSig = async (account: string) => {
    const randomvalue = await getRandomKey(account);
    //@ts-ignore
    // const web3 = new Web3(window.ethereum);
    console.log(randomvalue)
    // if (randomvalue != null) {
    //   const randomBn = new BigNumber(randomvalue).toFixed(0);
    //   const soliditySha3 = await web3.utils.soliditySha3(
    //     { type: 'string', value: account },
    //     { type: 'uint256', value: randomBn },
    //     {type: 'string', value: rewardToken},
    //     {type: 'string', value: pool},
    //     {type: 'uint256', value: startTime},
    //     {type: 'uint256', value: endTime},
    //     {type: 'string', value: refundee}
    //   );
  
    //   //@ts-ignore
    //   const sig = await web3.eth.personal.sign(soliditySha3, account, '');
  
    //   return sig;
    // } else {
    //   return null;
    // }
  }
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
            onClick={() =>generateSig(account?account.toString(): '')}>
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
