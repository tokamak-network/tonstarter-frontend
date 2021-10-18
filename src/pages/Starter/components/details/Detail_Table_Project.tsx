import {AdminObject} from '@Admin/types';
import {Box, useColorMode, useTheme, Flex, Text} from '@chakra-ui/react';
import {convertTimeStamp} from 'utils/convertTIme';
import {DetailTableContainer} from './Detail_Table_Container';

type DetailTableProjectProps = {
  saleInfo: AdminObject;
  activeProjectInfo: any;
};

export const DetailTableProject: React.FC<DetailTableProjectProps> = (prop) => {
  const {saleInfo, activeProjectInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();

  const {STATER_STYLE} = theme;

  const projectDetailTitle = 'Token Details';
  const projectDetailData = [
    {key: 'Name', value: `${saleInfo?.name}`},
    {key: 'Symbol', value: `${saleInfo?.tokenSymbol}`},
    {key: 'Contract', value: `${saleInfo?.saleContractAddress}`},
    {key: 'Total Supply', value: '10,000,000'},
  ];

  const projectDetailTitle2 = 'Sale Details';
  const projectDetailData2 = [
    {
      key: 'Sale Period',
      value: `${convertTimeStamp(
        activeProjectInfo?.timeStamps.startOpenSaleTime,
      )} ~ ${convertTimeStamp(
        activeProjectInfo?.timeStamps.endOpenSaleTime,
        'MM-DD',
      )}`,
    },
    {key: 'Token Allocation', value: '10,000,000'},
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
