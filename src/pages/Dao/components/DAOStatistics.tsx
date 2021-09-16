import {Flex, Text, useColorMode, useTheme, Box} from '@chakra-ui/react';
import {DEPLOYED} from 'constants/index';
import * as LockTOSABI from 'services/abis/LockTOS.json';
import {Contract} from '@ethersproject/contracts';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {useEffect, useState} from 'react';
import {convertNumber} from 'utils/number';
import {useBlockNumber} from 'hooks/useBlock';
import * as TOSABI from 'services/abis/TOS.json';

export const DAOStatistics = () => {
  const {library} = useActiveWeb3React();
  const {blockNumber} = useBlockNumber();
  const [totalTOS, setTotalTOS] = useState('');
  const [totalSTOS, setTotalSTOS] = useState('');
  const [averageWeek, setAverageWeek] = useState('');

  const theme = useTheme();
  const {colorMode} = useColorMode();

  const themeDesign = {
    fontColor: {
      light: 'gray.250',
      dark: 'white.100',
    },
    bg: {
      light: 'white.100',
      dark: 'black.200',
    },
    border: {
      light: 'solid 1px #d7d9df',
      dark: 'solid 1px #535353',
    },
  };

  const {LockTOS_ADDRESS, TOS_ADDRESS} = DEPLOYED;

  const LockTOSContract = new Contract(
    LockTOS_ADDRESS,
    LockTOSABI.abi,
    library,
  );

  const getTotalTOS = async () => {
    //toscontract.balanceOf(lockTos)
    const TOSContract = new Contract(TOS_ADDRESS, TOSABI.abi, library);
    const _totalTOS = await TOSContract.balanceOf(LockTOS_ADDRESS);
    if (_totalTOS) {
      const res = convertNumber({
        amount: _totalTOS.toString(),
        localeString: true,
      });
      setTotalTOS(res !== undefined ? res : '');
    }
  };
  const getTotalSTOS = async () => {
    const totalSTOS = await LockTOSContract.totalSupply();
    if (totalSTOS) {
      const res = convertNumber({
        amount: totalSTOS.toString(),
        localeString: true,
      });
      setTotalSTOS(res !== undefined ? res : '');
    }
  };
  const getAverageLockTime = async () => {
    const totalEpoch = await LockTOSContract.cumulativeTOSAmount();
    const totalUser = await LockTOSContract.allHolders();
    const avgWeek = totalEpoch.div(totalUser.length);
    const convertedNum = convertNumber({
      amount: avgWeek.toString(),
      localeString: true,
    });

    // const avgWeek = Number(totalEpoch.toString()) / Number(totalUser.length);
    setAverageWeek(convertedNum || '0');
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
    <Flex justifyContent="space-around" w="100%" flexDir="column">
      <Text
        color={themeDesign.fontColor[colorMode]}
        fontSize={'1.250em'}
        fontWeight={'bold'}
        mb="15px">
        DAO Statistics
      </Text>
      <Flex justifyContent="space-between">
        <Box>
          <Text color={'gray.400'} fontSize={'1.000em'}>
            Total TOS locked
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'1.125em'}>
            {totalTOS} <span style={{fontSize: '0.813em'}}>TOS</span>
          </Text>
        </Box>
        <Box>
          <Text color={'gray.400'} fontSize={'1.000em'}>
            Total sTOS
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'1.125em'}>
            {totalSTOS} <span style={{fontSize: '0.813em'}}>sTOS</span>
          </Text>
        </Box>
        <Box>
          <Text color={'gray.400'} fontSize={'1.000em'}>
            Average lock TOS amount
          </Text>
          <Text
            fontFamily={theme.fonts.roboto}
            color={themeDesign.fontColor[colorMode]}
            fontWeight={'bold'}
            fontSize={'1.125em'}>
            {averageWeek} <span style={{fontSize: '0.813em'}}> TOS</span>
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};
