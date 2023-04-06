import {Box, useColorMode, useTheme, Flex, Button} from '@chakra-ui/react';
import {useState} from 'react';
import {DetailTableProject} from './Detail_Table_Project';
import {Detail_Table_Description} from './Detail_Table_Description';
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
  const [selectDetail, setSelectDetail] = useState<string>('Project Details');
  const {STATER_STYLE} = theme;

  if (detailInfo === undefined) {
    return (
      <Flex fontFamily={theme.fonts.fld} flexDir="column" w={'100%'}>
        <Box>
          <Button
            {...STATER_STYLE.btn({
              colorMode,
              isActive: selectDetail === 'Project Details',
            })}
            w={160}
            h={'70px'}
            onClick={() => setSelectDetail('Project Details')}>
            Project Details
          </Button>
          <Button
            {...STATER_STYLE.btn({
              colorMode,
              isActive: selectDetail === 'Tier Details',
            })}
            w={160}
            h={'70px'}
            onClick={() => setSelectDetail('Tier Details')}>
            Tier Details
          </Button>
          <Button
            {...STATER_STYLE.btn({
              colorMode,
              isActive: selectDetail === 'Description',
            })}
            w={160}
            h={'70px'}
            onClick={() => setSelectDetail('Description')}>
            Description
          </Button>
        </Box>
        <Box d="flex" flexDir="column" pt={'35px'}>
          {selectDetail === 'Project Details' ? (
            <DetailTableProject saleInfo={saleInfo}></DetailTableProject>
          ) : selectDetail === 'Description' ? (
            <Detail_Table_Description
              saleInfo={saleInfo}></Detail_Table_Description>
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
          {...STATER_STYLE.btn({
            colorMode,
            isActive: selectDetail === 'Project Details',
          })}
          w={160}
          h={'70px'}
          onClick={() => setSelectDetail('Project Details')}>
          Project Details
        </Button>
        <Button
          {...STATER_STYLE.btn({
            colorMode,
            isActive: selectDetail === 'Tier Details',
          })}
          w={160}
          h={'70px'}
          onClick={() => setSelectDetail('Tier Details')}>
          Tier Details
        </Button>
        <Button
          {...STATER_STYLE.btn({
            colorMode,
            isActive: selectDetail === 'Description',
          })}
          w={160}
          h={'70px'}
          onClick={() => setSelectDetail('Description')}>
          Description
        </Button>
      </Box>
      <Box d="flex" flexDir="column" pt={'35px'}>
        {selectDetail === 'Project Details' ? (
          <DetailTableProject saleInfo={saleInfo}></DetailTableProject>
        ) : selectDetail === 'Description' ? (
          <Detail_Table_Description
            saleInfo={saleInfo}></Detail_Table_Description>
        ) : (
          <DetailTableTier
            status={status}
            detailInfo={detailInfo}></DetailTableTier>
        )}
      </Box>
    </Flex>
  );
};

//Detail_Table_Description
