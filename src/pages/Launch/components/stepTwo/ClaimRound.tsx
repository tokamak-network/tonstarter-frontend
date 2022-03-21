import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import {VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useState} from 'react';

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
  const [tableData, setTableData] = useState<[]>([]);

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
        </Box>
      </Flex>
    </Flex>
  );
};

export default ClaimRound;
