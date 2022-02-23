import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import {useFormikContext} from 'formik';
import {useState} from 'react';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const Bottom = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {values, setFieldValue} = useFormikContext();
  //@ts-ignore
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<[]>([]);

  return (
    <Flex flexDir={'column'}>
      <Box mb={'15px'}>
        <StepTitle title={'Small Title'} fontSize={16}></StepTitle>
      </Box>
      <Flex>
        <Box
          d="flex"
          flexDir={'column'}
          textAlign="center"
          border={middleStyle.border}
          lineHeight={'42px'}>
          <Flex
            h={'42px'}
            fontSize={12}
            color={'#3d495d'}
            fontWeight={600}
            borderBottom={middleStyle.border}>
            <Text w={'90px'}>Claim</Text>
            <Text w={'140px'} borderX={middleStyle.border}>
              Date time
            </Text>
            {tableData.map((data: any) => (
              <Text w={'120px'}>{data.valutName}</Text>
            ))}
          </Flex>
          {/* {tableData.map((data: BottomTable, index: number) => {
            const {claimTime, tokenAllocation, accumulated} = data;
            return (
              <Flex
                h={'42px'}
                fontSize={13}
                color={'#3d495d'}
                bg={index % 2 === 0 ? '#fafbfc' : 'none'}>
                <Box d="flex" w={'90px'} justifyContent="center" fontSize={13}>
                  <Text mr={'2px'}>{`0${index + 1}`}</Text>
                </Box>
                <Text w={'140px'} borderX={middleStyle.border} fontSize={11}>
                  {claimTime}
                </Text>
                <Text w={'120px'} fontSize={13}>
                  {accumulated}
                </Text>
              </Flex>
            );
          })} */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Bottom;
