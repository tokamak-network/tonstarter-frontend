import {Box, useColorMode, useTheme, Flex, Button} from '@chakra-ui/react';
import {useState} from 'react';
import {DetailTableProject} from './Detail_Table_Project';
import {DetailTableTier} from './Detail_Table_Tier';
import {SaleStatus} from '@Starter/types';

type DetailTableProp = {
  status: SaleStatus;
};

export const DetailTable = (prop: DetailTableProp) => {
  const {status} = prop;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const [selectDetail, setSelectDetail] = useState<boolean>(true);

  const {STATER_STYLE} = theme;

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
          <DetailTableProject></DetailTableProject>
        ) : (
          <DetailTableTier status={status}></DetailTableTier>
        )}
      </Box>
    </Flex>
  );
};
