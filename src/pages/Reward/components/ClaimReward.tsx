import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Select,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';

import {FC, useState, useEffect} from 'react';
import {useAppSelector} from 'hooks/useRedux';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {CustomInput} from 'components/Basic';
import {checkTokenType} from 'utils/token';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {utils, ethers} from 'ethers';
import { values } from 'lodash';
import { claim } from '../actions';
import {selectTransactionType} from 'store/refetch.reducer';

const {UniswapStaking_Address, UniswapStaker_Address, TOS_ADDRESS} = DEPLOYED;

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
  borderDashed: {
    light: 'dashed 1px #dfe4ee',
    dark: 'dashed 1px #535353',
  },
};
type ClaimRewardProps = {
  rewards: any[];
};
export const ClaimReward: FC<ClaimRewardProps> = ({rewards}) => {
  // const {data} = useAppSelector(selectModalType);
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [claimableAmount, setClaimableAmount] = useState<number>(0);
  const [requestAmount, setRequestAmout] = useState<string>('0');
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>(TOS_ADDRESS);
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);

  useEffect(() => {
    const rewardTokens = [
      ...Array.from(new Set(rewards.map((reward) => reward.rewardToken))),
    ];
    setTokenList(rewardTokens);
    setSelectedToken(rewardTokens[0]);
    getClaimable();
  }, [rewards, account, library, selectedToken, transactionType, blockNumber, ]);

  const getClaimable = async () => {
    if (
      account === null ||
      account === undefined ||
      library === undefined ||
      selectedToken === undefined
    ) {
      return;
    }

    const uniswapStakerContract = new Contract(
      UniswapStaker_Address,
      STAKERABI.abi,
      library,
    );

    const signer = getSigner(library, account);
    const claimable = await uniswapStakerContract
      .connect(signer)
      .rewards(selectedToken, account);
    setClaimableAmount(Number(ethers.utils.formatEther(claimable.toString())));
  };

  return (
    <Flex justifyContent={'center'}>
      <Box w={'100%'} px={'15px'}>
        <Text
          fontWeight={'bold'}
          fontFamily={theme.fonts.titil}
          fontSize={'20px'}
          mb={'18px'}>
          Claim
        </Text>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Reward Token
          </Text>
          <Select
            h={'30px'}
            color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
            fontSize={'12px'}
            onChange={(e) => {
              setSelectedToken(e.target.value);
            }}
            w={'120px'}>
            {tokenList.map((token: string, index: number) => {
              const tokenType = checkTokenType(token);
              return (
                <option value={token} key={index}>
                  {tokenType.name}
                </option>
              );
            })}
          </Select>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Claimable Amount
          </Text>
          <Flex
            w={'121px'}
            justifyContent="end"
            display={'flex'}
            alignItems={'baseline'}>
            <Text
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              textAlign="right"
              fontSize={'15px'}
              mr={'2px'}>
              {Number(claimableAmount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </Text>
            <Text
              textAlign="right"
              color={colorMode === 'light' ? '#3d495d' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}>
              {checkTokenType(selectedToken).name}
            </Text>
          </Flex>
        </Flex>
        <Flex alignItems={'center'} h={'45px'}>
          <Text
            color={colorMode === 'light' ? '#808992' : '#949494'}
            fontWeight={'bold'}
            fontSize={'13px'}
            w={'134px'}>
            Request Amount
          </Text>
          <Flex
          justifyContent={'center'}
            w={'120px'}
            alignItems={'center'}
            h={'30px'}
            border={themeDesign.border[colorMode]}
            borderRadius={'4px'}
            px={'10px'}>
            <NumberInput
            value={requestAmount}
            max={claimableAmount}
            onChange={(value)=>{
              setRequestAmout(value)
            }}
              borderColor={'transparent'}
              _focus={{
                borderColor: 'transparent',
              }}
              _active={{
                borderColor: 'transparent',
              }}
              _hover={{
                borderColor: 'transparent',
              }}
              focusBorderColor="transparent">
              <NumberInputField
                focusBorderColor="transparent"
                pl={'0px'}
                pr={'5px'}
                fontSize={'13px'}
                fontFamily={theme.fonts.roboto}
               
                textAlign={'right'}
                color={colorMode === 'light' ? '#86929d' : '#818181'}
                _hover={{
                  borderColor: 'transparent',
                }}
              />
            </NumberInput>
            {/* <CustomInput
              value={requestAmount}
              setValue={setRequestAmout}
              w={'100px'}
              fontSize={'13px'}
              h={'30px'}
              border={'none'}
              numberOnly={true}
            /> */}
            <Text
              color={colorMode === 'light' ? '#3e495c' : '#f3f4f1'}
              fontWeight={'bold'}
              fontSize={'10px'}
              ml={'2px'}>
              TOS
            </Text>
          </Flex>
        </Flex>
        <Flex
          width={'100%'}
          justifyContent={'center'}
          borderBottom={themeDesign.borderDashed[colorMode]}>
          <Button
            w={'150px'}
            bg={'blue.500'}
            color="white.100"
            fontSize="14px"
            _hover={{backgroundColor: 'blue.100'}}
            mb={'40px'}
            mt={'20px'}
            onClick={() => {
             if (Number(requestAmount) ===0) {
              return alert(`Request amount cannot be 0`);
             }
              
              claim({
                library: library,
                userAddress: account,
                amount: requestAmount, 
                rewardToken: selectedToken
              })
              
            }}>
            Claim
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};
