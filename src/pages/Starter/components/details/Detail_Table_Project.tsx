import {AdminObject} from '@Admin/types';
import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailTableContainer} from './Detail_Table_Container';
import {useWeb3React} from '@web3-react/core';
import {useEffect, useState} from 'react';
import starterActions from '../../actions';

type DetailTableProjectProps = {
  saleInfo: AdminObject;
  activeProjectInfo: any;
};

export const DetailTableProject: React.FC<DetailTableProjectProps> = (prop) => {
  const {saleInfo, activeProjectInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {library} = useWeb3React();

  const {STATER_STYLE} = theme;

  const [totalSupply, setTotalSupply] = useState<string>('XXX,XXX');

  useEffect(() => {
    async function getTotalSupply() {
      const res = await starterActions.getTokenInfo({
        library,
        address: saleInfo.tokenAddress,
      });
      const {totalSupply} = res;
      if (totalSupply) {
        setTotalSupply(totalSupply.split('.')[0]);
      }
    }
    if (library && saleInfo) {
      getTotalSupply();
    }
  }, [library, saleInfo]);

  const projectDetailTitle = 'Token Details';
  const projectDetailData = [
    {key: 'Name', value: `${saleInfo?.name}`},
    {key: 'Symbol', value: `${saleInfo?.tokenSymbol}`},
    {key: 'Contract', value: `${saleInfo?.tokenAddress}`},
    {
      key: 'Total Supply',
      value: `${totalSupply}`,
    },
  ];

  const projectDetailTitle2 = 'IDO Details';
  const projectDetailData2 = [
    {
      key: 'Public Round 1 Period',
      value: `${convertTimeStamp(
        activeProjectInfo?.timeStamps.startAddWhiteTime,
        'YYYY.MM.DD HH:mm',
      )} ~ ${convertTimeStamp(
        activeProjectInfo?.timeStamps.endExclusiveTime,
        'MM.DD HH:mm',
      )}`,
    },
    {
      key: 'Public Round 2 Period',
      value: `${convertTimeStamp(
        activeProjectInfo?.timeStamps.startDepositTime,
        'YYYY.MM.DD HH:mm',
      )} ~ ${convertTimeStamp(
        activeProjectInfo?.timeStamps.endDepositTime,
        'MM.DD HH:mm',
      )}`,
    },
    {
      key: 'Token Allocation',
      value: `${activeProjectInfo?.tokenAllocation} ${activeProjectInfo.tokenName}`,
    },
    {
      key: 'Funding Crypto',
      value: 'TON',
    },
  ];

  return (
    <Flex flexDir="column">
      <Text {...STATER_STYLE.mainText({colorMode, fontSize: 24})} mb={'30px'}>
        Project Details
      </Text>
      <Box d="flex" justifyContent="space-between">
        <DetailTableContainer
          title={projectDetailTitle}
          data={projectDetailData}
          breakPoint={projectDetailData.length}></DetailTableContainer>
        <DetailTableContainer
          title={projectDetailTitle2}
          data={projectDetailData2}
          breakPoint={projectDetailData2.length + 1}></DetailTableContainer>
      </Box>
    </Flex>
  );
};
