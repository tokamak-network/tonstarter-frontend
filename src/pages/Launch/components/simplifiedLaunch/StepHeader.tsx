import {
  Flex,
  useColorMode,
  Text,
  useTheme,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import CountDown from './openStepThree/CountDown';
import {useFormikContext} from 'formik';
import {Projects, VaultAny} from '@Launch/types';
import {useState} from 'react';

const StepHeader = (props: {
  deploySteps: boolean;
  deployStep?: number;
  title: string;
}) => {
  const {deploySteps, deployStep, title} = props;
  const {colorMode} = useColorMode();
  const theme = useTheme();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();

  const [steps, setSteps] = useState(0);

  return (
    <Grid
      templateColumns={deploySteps ? 'repeat(3, 1fr)' : 'repeat(1, 1fr)'}
      gap={0}
      h="73px"
      w="100%"
      alignItems={'center'}
      borderBottom={'1px'}
      px="35px"
      fontWeight={600}
      borderColor={colorMode === 'dark' ? '#373737' : '#f4f6f8'}>
      <GridItem justifyContent={'center'}>
        <Flex alignItems={'center'}>
          <Text
            lineHeight={'20px'}
            fontSize={'20px'}
            color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
            {title}
          </Text>
        </Flex>
      </GridItem>
      {deploySteps && (
        <GridItem>
          <CountDown />
        </GridItem>
      )}
      {deploySteps && (
        <GridItem>
          <Flex color="blue.200" fontSize={'13px'} justifyContent="flex-end">
            <Text color={'white.100'} mr="2px">
              Progress
            </Text>
            <Text>{deployStep}/11</Text>
          </Flex>
        </GridItem>
      )}
    </Grid>
  );
};

export default StepHeader;
