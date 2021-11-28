import {Box, useColorMode, useTheme, Flex, Button} from '@chakra-ui/react';
import {useState} from 'react';
import {DetailTableProject} from './Detail_Table_Project';
import {DetailTableTier} from './Detail_Table_Tier';
import {DetailInfo, SaleStatus} from '@Starter/types';
import {AdminObject} from '@Admin/types';

type DetailTableProp = {
  status: SaleStatus;
  saleInfo: AdminObject;
  detailInfo: DetailInfo | undefined;
};

export const DetailTable = (prop: DetailTableProp) => {
  const {status, saleInfo, detailInfo} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [selectDetail, setSelectDetail] = useState<boolean>(true);

  const {STATER_STYLE} = theme;

  if (detailInfo === undefined) {
    return (
      <Flex fontFamily={theme.fonts.fld} flexDir="column" w={'100%'}>
        <Box>
          <Button
            {...STATER_STYLE.btn({colorMode, isActive: selectDetail})}
            w={160}
            h={'70px'}
            onClick={() => setSelectDetail(true)}>
            Project Details
          </Button>
          <Button
            {...STATER_STYLE.btn({colorMode, isActive: !selectDetail})}
            w={160}
            h={'70px'}
            onClick={() => setSelectDetail(false)}>
            Tier Details
          </Button>
        </Box>
        <Box d="flex" flexDir="column" pt={'35px'}>
          {selectDetail === true ? (
            <DetailTableProject saleInfo={saleInfo}></DetailTableProject>
          ) : (
            <DetailTableTier
              status={status}
              detailInfo={detailInfo}></DetailTableTier>
          )}
        </Box>
      </Flex>
    );
  }

  return (
    <Flex fontFamily={theme.fonts.fld} flexDir="column" w={'100%'}>
      <Box>
        <Button
          {...STATER_STYLE.btn({colorMode, isActive: selectDetail})}
          w={160}
          h={'70px'}
          onClick={() => setSelectDetail(true)}>
          Project Details
        </Button>
        <Button
          {...STATER_STYLE.btn({colorMode, isActive: !selectDetail})}
          w={160}
          h={'70px'}
          onClick={() => setSelectDetail(false)}>
          Tier Details
        </Button>
      </Box>
      <Box d="flex" flexDir="column" pt={'35px'}>
        {selectDetail === true ? (
          <DetailTableProject saleInfo={saleInfo}></DetailTableProject>
        ) : (
          <DetailTableTier
            status={status}
            detailInfo={detailInfo}></DetailTableTier>
        )}
      </Box>
    </Flex>
  );
};
