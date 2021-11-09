import {
  Flex,
  Text,
  Button,
  Box,
  useColorMode,
  useTheme,
  Container,
  Select,
  Image,
  Input,
} from '@chakra-ui/react';

import {FC, useRef, useState, useEffect} from 'react';
import {PoolComponent} from './components/PoolComponent';
import {ClaimReward} from './components/ClaimReward';
import {CreateReward} from './components/CreateReward';
import {LPTokenComponent} from './components/LPTokenComponent';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {DEPLOYED} from 'constants/index';
import {getSigner} from 'utils/contract';
import {Contract} from '@ethersproject/contracts';
import * as STAKERABI from 'services/abis/UniswapV3Staker.json';
import {selectTransactionType} from 'store/refetch.reducer';
import {useAppSelector} from 'hooks/useRedux';

type SideContainerProps = {
  selected: string;
  pools: any[];
  rewards: any[];
  LPTokens: any[];
};
const {UniswapStaking_Address, UniswapStaker_Address} = DEPLOYED;

export const SideContainer: FC<SideContainerProps> = ({
  selected,
  pools,
  rewards,
  LPTokens,
}) => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {account, library} = useActiveWeb3React();
  const [withdrawableTokens, setWithdrawableTokens] = useState<any[]>([]);
  const stakedTokens = [8176, 7774, 7775, 5923, 6173];
  const {transactionType, blockNumber} = useAppSelector(selectTransactionType);
  const uniswapStakerContract = new Contract(
    UniswapStaker_Address,
    STAKERABI.abi,
    library,
  );

  useEffect(() => {
    const getWithdrawable = async () => {
      if (account === null || account === undefined || library === undefined) {
        return;
      }
      const signer = getSigner(library, account);
  
      let stringResult: any = [];
    await Promise.all(stakedTokens.map(async (token) => {
        const depositInfo = await uniswapStakerContract
            .connect(signer)
            .deposits(token);
          
          if (depositInfo.owner === account && depositInfo.numberOfStakes===0) {
            stringResult.push(token)
          }
      }),
      );
     
      setWithdrawableTokens(stringResult)
    };
    getWithdrawable();
  },[stakedTokens, account, library, transactionType, blockNumber])
  return (
    <Box
      display={'flex'}
      flexDir={'column'}
      boxShadow={'0 2px 5px 0 rgba(61, 73, 93, 0.1)'}
      border={colorMode === 'light' ? '' : '1px solid #535353'}
      w={'284px'}
      pt={'20px'}
      pb={'30px'}
      borderRadius={'15px'}
      bg={colorMode === 'light' ? '#FFFFFF' : ''}
      mb={'20px'}>
      <Box>
        {selected === 'reward' ? (
          <ClaimReward rewards={rewards} tokens={withdrawableTokens} />
        ) : (
          <CreateReward pools={pools} />
        )}
      </Box>

      <PoolComponent pools={pools} rewards={rewards} />
      <LPTokenComponent tokens={LPTokens} />
    </Box>
  );
};
