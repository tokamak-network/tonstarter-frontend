import {Box, Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import {Projects, VaultAny} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';

const middleStyle = {
  border: 'solid 1px #eff1f6',
};

const Overview = () => {
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {OpenCampaginDesign} = theme;
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const vaultsList = values.vaults;
  const [tableData, setTableData] = useState<any>([]);
  const [totalColData, setTotalColData] = useState<any>([]);

  console.log('--vaultsList--');
  console.log(vaultsList);
  useEffect(() => {
    const claimData = vaultsList.map((vault: any) => {
      if (vault.claim) {
        return {name: vault.vaultName, claim: vault.claim};
      }
    });
    setTableData(claimData);
  }, [vaultsList]);

  useEffect(() => {
    const totals = tableData.map((data: any) => {
      const {claim} = data;
      const result = claim.map((claimData: any) => {
        return claimData.claimTokenAllocation;
      });
      return result;
    });
    console.log('--totals--');
    console.log(totals);
    // setTotalColData(totals)
  }, [tableData]);

  return (
    <Flex flexDir={'column'}>
      <Box mb={'15px'}>
        <StepTitle title={'Overview'} fontSize={16}></StepTitle>
      </Box>
      <Box
        d="flex"
        textAlign="center"
        border={middleStyle.border}
        lineHeight={'42px'}>
        <Flex
          fontSize={12}
          color={'#3d495d'}
          flexDir={'column'}
          fontWeight={600}
          borderBottom={middleStyle.border}
          w={'90px'}>
          <Text fontSize={12}>Round</Text>
          <Text
            fontSize={13}
            marginTop={'auto'}
            color={'#353c48'}
            fontWeight={600}>
            Sum
          </Text>
        </Flex>
        {tableData.map((data: any, index: number) => {
          const {name, claim} = data;
          return (
            <Flex
              fontSize={12}
              color={'#3d495d'}
              flexDir={'column'}
              fontWeight={600}
              w={name.length > 10 ? '140px' : '120px'}
              borderBottom={middleStyle.border}>
              <Text fontSize={12}>{name}</Text>
              {claim.map((claimData: any, index: number) => {
                return (
                  <Text
                    borderX={middleStyle.border}
                    fontSize={13}
                    bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                    {claimData.claimTokenAllocation}
                  </Text>
                );
              })}
              <Text fontSize={13} marginTop={'auto'}>
                {name}
              </Text>
            </Flex>
          );
        })}
        {tableData.map((data: any, index: number) => {
          const {name, claim} = data;
          return (
            <Flex
              fontSize={12}
              color={'#3d495d'}
              flexDir={'column'}
              fontWeight={600}
              w={name.length > 10 ? '140px' : '120px'}
              borderBottom={middleStyle.border}>
              <Text fontSize={12}>{name}</Text>
              {claim.map((claimData: any, index: number) => {
                return (
                  <Text
                    borderX={middleStyle.border}
                    fontSize={13}
                    bg={index === 0 || index % 2 === 0 ? '#fafbfc' : '#ffffff'}>
                    {claimData.claimTokenAllocation}
                  </Text>
                );
              })}
              <Text fontSize={13} marginTop={'auto'}>
                {name}
              </Text>
            </Flex>
          );
        })}
      </Box>
    </Flex>
  );
};

export default Overview;
