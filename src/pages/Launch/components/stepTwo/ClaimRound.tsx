import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import {VaultAny} from '@Launch/types';
import HoverImage from 'components/HoverImage';
import {useFormikContext} from 'formik';
import {useCallback, useState} from 'react';
import CalendarActiveImg from 'assets/launch/calendar-active-icon.svg';
import CalendarInactiveImg from 'assets/launch/calendar-inactive-icon.svg';
import PlusIconNormal from 'assets/launch/plus-icon-normal.svg';
import PlusIconHover from 'assets/launch/plus-icon-hover.svg';

type ClaimRoundTable = {
  dateTime: number;
  tokenAllocation: string;
  accumulated: string;
};

const defaultTableData = {
  dateTime: 0,
  tokenAllocation: '0',
  accumulated: '0',
};

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const ClaimRound = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {values, setFieldValue} = useFormikContext();
  //@ts-ignore
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<ClaimRoundTable[]>([
    defaultTableData,
  ]);

  const addRow = useCallback(() => {
    setTableData([...tableData, defaultTableData]);
  }, [tableData]);

  return (
    <Flex flexDir={'column'}>
      <Box mb={'15px'}>
        <StepTitle title={'Claim Round'} fontSize={16}></StepTitle>
      </Box>
      <Flex>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          lineHeight={'42px'}>
          <Flex h={'42px'} fontSize={12} color={'#3d495d'} fontWeight={600}>
            <Text w={'90px'}>Claim</Text>
            <Text w={'292px'} borderX={middleStyle.border}>
              Date time
            </Text>
            <Text w={'281px'} borderRight={middleStyle.border}>
              Token Allocation
            </Text>
            <Text w={'281px'} borderRight={middleStyle.border}>
              Accumulated
            </Text>
            <Text w={'90px'}>Function</Text>
          </Flex>
          {tableData.map((data: ClaimRoundTable, index: number) => {
            return (
              <Flex h={'42px'} fontSize={12} color={'#3d495d'} fontWeight={600}>
                <Text w={'90px'}>{`0${index + 1}`}</Text>
                <Flex
                  w={'292px'}
                  borderX={middleStyle.border}
                  alignItems="center"
                  justifyContent={'center'}>
                  <Text mr={'5px'} color={'#3d495d'}>
                    -
                  </Text>
                  <HoverImage
                    action={() => console.log('go')}
                    img={CalendarInactiveImg}
                    hoverImg={CalendarActiveImg}></HoverImage>
                </Flex>
                <Text w={'281px'} borderRight={middleStyle.border}>
                  -
                </Text>
                <Text w={'281px'} borderRight={middleStyle.border}>
                  -
                </Text>
                <Flex w={'90px'} alignItems="center" justifyContent="center">
                  <Flex
                    w={'24px'}
                    h={'24px'}
                    alignItems="center"
                    justifyContent="center"
                    border={'1px solid #e6eaee'}
                    bg={'white.100'}>
                    <HoverImage
                      action={() => addRow()}
                      img={PlusIconNormal}
                      hoverImg={PlusIconHover}></HoverImage>
                  </Flex>
                </Flex>
              </Flex>
            );
          })}
        </Box>
      </Flex>
    </Flex>
  );
};

export default ClaimRound;
