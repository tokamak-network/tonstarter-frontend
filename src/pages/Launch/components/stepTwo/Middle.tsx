import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import useVaultSelector from '@Launch/hooks/useVaultSelector';
import {selectLaunch} from '@Launch/launch.reducer';
import {Vault} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useAppSelector} from 'hooks/useRedux';
import moment from 'moment';
import {useEffect, useState} from 'react';
import store from 'store';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const Middle = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {data} = useAppSelector(selectLaunch);
  const {values, setFieldValue} = useFormikContext();
  //@ts-ignore
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<[]>();

  const {selectedVaultDetail} = useVaultSelector();

  console.log(vaultsList)

  return (
    <Flex flexDir={'column'}>
      <Box mb={'15px'}>
        <StepTitle title={'Small Title'} fontSize={16}></StepTitle>
      </Box>
      <Box mb={'25px'}>Input Area</Box>
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
            <Text w={'197px'}>Claim</Text>
            <Text w={'197px'} borderX={middleStyle.border}>
              Token Allocation
            </Text>
            <Text w={'144px'}>Accumulated</Text>
          </Flex>
          {/* {selectedVaultDetail &&
            selectedVaultDetail.params.map((data: any, index: number) => {
              const {claimTime, claimTokenAllocation} = data;
              return (
                <Flex
                  h={'42px'}
                  fontSize={13}
                  color={'#3d495d'}
                  bg={index % 2 === 0 ? '#fafbfc' : 'none'}>
                  <Box d="flex" w={'197px'} justifyContent="center">
                    <Text mr={'2px'}>{`0${index + 1}`}</Text>
                    <Text fontSize={12} color={'#808992'}>
                      {moment.unix(claimTime).format('MM.DD.YYYY hh:mm:ss')}
                    </Text>
                  </Box>
                  <Text w={'197px'} borderX={middleStyle.border}>
                    {claimTokenAllocation}
                  </Text>
                  <Text w={'144px'}>{'1%'}</Text>
                </Flex>
              );
            })} */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Middle;
