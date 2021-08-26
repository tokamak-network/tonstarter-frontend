import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {Contract} from '@ethersproject/contracts';
import {useUser} from 'hooks/useUser';
import {useEffect, useState} from 'react';
import {convertNumber} from 'utils/number';
import {useBlockNumber} from 'hooks/useBlock';
import {useWeb3React} from '@web3-react/core';

export const DAOStatistics = () => {
  const {library} = useUser();
  const {blockNumber} = useBlockNumber();
  const [totalTOS, setTotalTOS] = useState('');
  const [totalSTOS, setTotalSTOS] = useState('');
  const [averageWeek, setAverageWeek] = useState('');

  const {LockTOS_ADDRESS} = DEPLOYED;

  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const getTotalTOS = async () => {
    const _totalTOS = await LockTOSContract.cumulativeTOSAmount();
    if (_totalTOS) {
      const res = convertNumber({amount: _totalTOS.toString()});
      setTotalTOS(res !== undefined ? res : '');
    }
  };
  const getTotalSTOS = async () => {
    const totalSTOS = await LockTOSContract.totalSupply();
    if (totalSTOS) {
      const res = convertNumber({amount: totalSTOS.toString()});
      setTotalSTOS(res !== undefined ? res : '');
    }
  };
  const getAverageLockTime = async () => {
    const totalEpoch = await LockTOSContract.cumulativeEpochUnit();
    const totalIdCount = await LockTOSContract.lockIdCounter();
    const avgWeek =
      Number(totalEpoch.toString()) / Number(totalIdCount.toString());
    setAverageWeek(isNaN(avgWeek) === true ? '0' : String(avgWeek));
  };

  useEffect(() => {
    if (library) {
      getTotalTOS();
      getTotalSTOS();
      getAverageLockTime();
    }
    return () => {};
    /*eslint-disable*/
  }, [library, blockNumber]);

  return (
    <Flex justifyContent="space-around" w="100%">
      <Box>
        <Text>Total TOS locked</Text>
        <Text>{totalTOS}</Text>
      </Box>
      <Box>
        <Text>Total sTOS</Text>
        <Text>{totalSTOS}</Text>
      </Box>
      <Box>
        <Text>Average lock time</Text>
        <Text>{averageWeek}</Text>
      </Box>
    </Flex>
  );
};
