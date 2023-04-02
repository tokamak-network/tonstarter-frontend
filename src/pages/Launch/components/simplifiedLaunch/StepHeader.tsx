import {
  Flex,
  useColorMode,
  Text,
  useTheme,
  Image,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import iconUserGuide from 'assets/images/iconUserGuide.png';
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
      borderColor={colorMode === 'dark' ? '#373737' : '#f4f6f8'}>
      <GridItem justifyContent={'center'}>
        <Flex alignItems={'center'}>
          <Text
            lineHeight={'20px'}
            fontSize={'20px'}
            color={colorMode === 'dark' ? 'white.100' : 'black.300'}>
            {title}
          </Text>
          <Image ml="21px" src={iconUserGuide} w="18px" h="18px"></Image>
          <Link
            isExternal
            ml="6px"
            fontSize={'13px'}
            fontFamily={'Titillium Web, sans-serif'}
            color={colorMode === 'dark' ? 'gray.475' : 'gray.400'}
            href={
              'https://tokamaknetwork.gitbook.io/home/02-service-guide/tosv2'
            }
            cursor="pointer">
            {' '}
            User Guide
          </Link>
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
