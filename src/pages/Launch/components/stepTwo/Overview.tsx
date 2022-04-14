import {Box, Flex, useColorMode, useTheme, Button} from '@chakra-ui/react';
import StepTitle from '@Launch/components/common/StepTitle';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useState} from 'react';
import OverviewTable from './OverviewTable';
import OverviewChart from './OverviewChart';

const Overview = () => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState<boolean>(true);
  return (
    <Flex flexDir={'column'} width={'1040px'}>
      <Flex mb={'15px'} justifyContent={'space-between'}>
        <StepTitle title={'Overview'} fontSize={16}></StepTitle>
        <Box>
          <Button
            w={'70px'}
            h={'26px'}
            bg={'transparent'}
            border={'solid 1px #d7d9df'}
            borderRadius={'3px 0px 0px 3px'}
            fontSize={'12px'}
            fontFamily={theme.fonts.roboto}
            _hover={{background: 'transparent'}}
            _active={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
            }}
            onClick={() => {
              setShowTable(true);
            }}
            isActive={showTable}>
            Table
          </Button>
          <Button
            w={'70px'}
            h={'26px'}
            bg={'transparent'}
            border={'solid 1px #d7d9df'}
            borderRadius={'0px 3px 3px 0px'}
            fontSize={'12px'}
            _hover={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
            }}
            _active={{
              background: 'transparent',
              border: 'solid 1px #2a72e5',
              color: '#2a72e5',
            }}
            onClick={() => {
              setShowTable(false);
            }}
            isActive={!showTable}>
            Chart
          </Button>
        </Box>
      </Flex>
      {showTable ? <OverviewTable /> : <OverviewChart />}
    </Flex>
  );
};

export default Overview;
