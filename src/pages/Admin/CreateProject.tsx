import {Flex, Box, useColorMode, useTheme} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {AdminObject, StepComponent} from '@Admin/types';
import {PageHeader} from 'components/PageHeader';
import {AdminDetail} from './components/AdminDetail';
import {CustomButton} from 'components/Basic/CustomButton';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {LoadingComponent} from 'components/Loading';
import {useLocation} from 'react-router-dom';
import queryString from 'query-string';
import {selectStarters} from '../Starter/starter.reducer';
import {useAppSelector} from 'hooks/useRedux';
import tickIcon from 'assets/svgs/tick-icon.svg';

const Steps: React.FC<StepComponent> = (props) => {
  const {stepName, currentStep} = props;
  const {colorMode} = useColorMode();

  return (
    <Flex>
      {stepName.map((step: string, index: number) => {
        const isStep = currentStep === index;
        const pastStep = currentStep > index;
        return (
          <Box d="flex" mr={'20px'} alignItems="center" fontSize={14}>
            <Flex
              borderRadius={18}
              bg={isStep ? '#2ea1f8' : 'transparent'}
              w={'28px'}
              h={'28px'}
              alignItems="center"
              justifyContent="center"
              color={isStep ? 'white.100' : 'gray.575'}
              mr={'12px'}
              border={isStep ? '' : 'solid 1px #e6eaee'}>
              {/* {pastStep ? (<img src={tickIcon} alt={'tick_icon'}>)  :( <Box>{index + 1}</Box>)} */}
              {pastStep ? (
                <img src={tickIcon} alt={'tick_icon'} />
              ) : (
                <Box>{index + 1}</Box>
              )}
            </Flex>
            <Box>{step}</Box>
          </Box>
        );
      })}
    </Flex>
  );
};

export const CreateProject = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [existingData, setExistingData] = useState<AdminObject[] | []>([]);
  const [final, setFinal] = useState<boolean>(false);

  const theme = useTheme();
  const {library} = useActiveWeb3React();
  const {search} = useLocation();
  const {data: starterData} = useAppSelector(selectStarters);

  useEffect(() => {
    if (search && starterData.rawData) {
      const {rawData} = starterData;
      const parsed = queryString.parse(search);
      const projectName = Object.keys(parsed)[0];
      const projectData = rawData.filter((data: AdminObject) => {
        return data.name === projectName;
      });
      console.log('projectData');
      console.log(projectData);
      setExistingData(projectData || []);
    }
  }, [search, starterData]);

  if (!library) {
    return (
      <Flex w={'100%'} h={'100vh'} alignItems="center" justifyContent="center">
        <LoadingComponent></LoadingComponent>
      </Flex>
    );
  }

  return (
    <Flex mt={'72px'} flexDir="column" alignItems="center">
      <PageHeader
        title={'Create Project'}
        subtitle={'You can create  and manage projects.'}
      />
      <Flex mt={'50px'} mb={'20px'}>
        <Steps
          stepName={['Project', 'Token', 'Sale', 'Layout']}
          currentStep={currentStep}></Steps>
      </Flex>
      <Flex mb={'50px'}>
        <AdminDetail
          stepName={['Project', 'Token', 'Sale', 'Layout']}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          library={library}
          existingData={existingData}
          setFinal={setFinal}></AdminDetail>
      </Flex>
      <CustomButton
        w={'180px'}
        h={'45px'}
        text={'Project Save'}
        isDisabled={!final}
        style={{
          fontFamily: theme.fonts.roboto,
          fontWeight: 600,
        }}
        func={() => console.log('test')}></CustomButton>
    </Flex>
  );
};
