import {
  ButtonGroup,
  Text,
  Image,
  Flex,
  Link,
  useTheme,
  useColorMode,
  Tooltip,
  Switch,
  Box
} from '@chakra-ui/react';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import OpenStepOneSimplified from '@Launch/components/simplifiedLaunch/OpenStepOneSimplified';
import {Formik, Form} from 'formik';
import useValues from '@Launch/hooks/useValues';
import type {StepNumber, VaultCommon} from '@Launch/types';
import ProjectSchema from '@Launch/utils/projectSchema';
import {PageHeader} from 'components/PageHeader';
import Steps from '@Launch/components/Steps';
import OpenStepTwoSimplified from '@Launch/components/simplifiedLaunch/OpenStepTwoSimplified';
import {useRouteMatch, useHistory, Redirect} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {
  selectLaunch,
  setHashKey,
  fetchProjects,
  setCurrentDeployStep,
  saveTempProjectData,
} from '@Launch/launch.reducer';
import OpenStepThreeSimplified from '@Launch/components/simplifiedLaunch/OpenStepThreeSimplified';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {saveProject, editProject} from '@Launch/utils/saveProject';
import {ActionButton} from './components/simplifiedLaunch/openStepOne/ActionButton';
import {useFormikContext} from 'formik';
import {useModal} from 'hooks/useModal';
import RescheduleModal from './components/simplifiedLaunch/openStepOne/Reschedule';
import AdvanceConfirmModal from '@Launch/components/modals/AdvanceConfirmModal'
import tooltipIcon from 'assets/svgs/input_question_icon.svg';


const StepComponent = (props: {
  step: StepNumber;
  setDisableForStep1: Dispatch<SetStateAction<boolean>>;
  setDisableForStep2: Dispatch<SetStateAction<boolean>>;
}) => {
  const {step, setDisableForStep2, setDisableForStep1} = props;
  switch (step) {
    case 1:
      return (
        <OpenStepOneSimplified
          step={step}
          setDisableForStep1={setDisableForStep1}></OpenStepOneSimplified>
      );
    case 2:
      return (
        <OpenStepTwoSimplified
          setDisableForStep2={setDisableForStep2}></OpenStepTwoSimplified>
      );
    case 3:
      return <OpenStepThreeSimplified></OpenStepThreeSimplified>;
    default:
      return <div>no component for this step</div>;
  }
};

const SimplifiedMainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);
  const [isDisable, setDisable] = useState<boolean>(true);
  const [isDisableForStep2, setDisableForStep2] = useState<boolean>(true);
  const [isDisableForStep1, setDisableForStep1] = useState<boolean>(true);
  const [isDisableForStep3, setDisableForStep3] = useState<boolean>(true);
  const theme = useTheme();
  const {colorMode} = useColorMode();
  const {account} = useActiveWeb3React();
  const {initialSimplifiedValues} = useValues(account || '');
  const history = useHistory();
  const [oldData, setOldData] = useState();
  const [saveBtnDisable, setSaveBtnDisable] = useState(false);
  const formikRef = useRef(null);
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[2];
  const {openAnyModal} = useModal();
  const [switchState, setSwitchState] = useState(false);

  const handleSwitchChange = () => {
    setSwitchState(!switchState);
  };


  const handleChange = () => {
    handleSwitchChange();
    if(switchState === false) {
      openAnyModal('Launch_AdvanceSwitch', {
        from: '/launch/createproject',
      });
    }
  }

  const dispatch = useAppDispatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {
    data: {projects, hashKey, projectStep},
  } = useAppSelector(selectLaunch);

  const navigateToLaunchPage = useCallback(() => {
    history.push('/launch');
  }, [history]);

  useEffect(() => {
    //@ts-ignore
    const unBlock = history.block((loc, action) => {
      if (action === 'POP' || action === 'PUSH' || action === 'REPLACE') {
        return window.confirm(
          'Are you sure you want to go back?\nClick the Save button to save your progress before you leave.',
        );
      }
    });
    return () => unBlock();
  }, [history]);

  useEffect(() => {
    window.addEventListener('beforeunload', function (event) {
      // Cancel the event
      event.preventDefault();
      // Prompt the user with a confirmation dialog
      event.returnValue = '';
      return '';
    });
  }, []);

  useEffect(() => {
    dispatch(
      setHashKey({
        data: isExist === 'createproject' ? undefined : isExist,
      }),
    );
    dispatch(
      setCurrentDeployStep({
        data: 0,
      }),
    );
  }, [dispatch, isExist]);

  useEffect(() => {
    setStep(projectStep);
  }, []);

  const handleStep = useCallback(
    (isNext: boolean) => {
      const prevStepNum =
        step - 1 > 0 ? ((step - 1) as StepNumber) : (step as StepNumber);
      const nextStepNum =
        step + 1 < 4 ? ((step + 1) as StepNumber) : (step as StepNumber);
      setStep(isNext ? nextStepNum : prevStepNum);
    },
    [step],
  );

  const getSaveButtonColor = () => {
    if (isDisable) {
      return '#e9edf1';
    }
    return step === 1 && isExist !== 'createproject' && hashKey
      ? 'yellow.200'
      : '#00c3c4';
  };

  // Navigate to Step1 from Reschedule modal once the user hit 'Go'
  const navigateToStep1 = () => {
    setStep(1);
    return step;
  };

  const handleSaveProject = (values: any, account: string, mode: boolean) => {
    account && isExist === 'createproject' && hashKey === undefined
      ? saveProject(values, account, mode)
      : editProject(values, account as string, hashKey || isExist, mode);
  };

  const handleSaveAndContinue = (values: any, account: string) => {
    account && isExist === 'createproject' && hashKey === undefined
      ? saveProject(values, account)
      : editProject(values, account as string, hashKey || isExist);
    handleStep(true);
  };

  const handleComplete = (values: any, account: string, mode: boolean) => {
    editProject(values, account as string, hashKey || isExist);
    history.push('/launch');
    // Remove reschedule modal close state from local storage
    localStorage.removeItem('modalClosed');
  };

  if (!account) {
    return <Redirect to={{pathname: '/launch'}}></Redirect>;
  }
  if (
    id !== undefined &&
    projects[id] &&
    projects[id]?.ownerAddress !== account
  ) {
    return <Redirect to={{pathname: '/launch'}}></Redirect>;
  }

  const switchStyle =
    colorMode === 'light'
      ? `
.chakra-switch__track{
  background: #e9edf1;
  padding: 1px;
  height: 15px;
  width: 36px;
  margin-right: 6px;
  padding-bottom: 2px;
  padding-right: 2px
}

`
      : `
.chakra-switch__track{
  background: transparent;
  border: 1px solid #535353;
  padding: 1px;
  height: 15px;
  width: 36px;
  margin-right: 6px;
  padding-bottom: 2px;
  padding-right: 2px
}

`;

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mb={'100px'}
      pos="relative">
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Create Project'}
          subtitle={'You can create and manage projects.'}
        />
        <Flex mt={'50px'} mb={'20px'}>
          <Steps
            stepName={['Project & Token', 'Token Economy', 'Deploy']}
            currentStep={step}></Steps>
            <Flex></Flex>
            </Flex>
        <Flex pos="absolute" mt={'247px'} ml={'620px'}>
        <Tooltip
          color={theme.colors.white[100]}
          bg={'#353c48'}
          p={2}
          w="254px"
          textAlign="center"
          hasArrow
          borderRadius={3}
          placement="top"
          fontSize={'12px'}
          ml='8px'
          label="You can fine-tune your project settings in Advance Mode. But if you leave this default mode, you cannot come back here again.">
          <Flex>
            <style>{switchStyle}</style>
            <Switch
              style={{height: '16px'}}
              onChange={handleChange}
              isChecked={switchState}></Switch>
            <Text
              fontSize={'13px'}
              color={colorMode === 'dark' ? '#949494' : '#848c98'}>
              Advance mode
            </Text>

            <Image src={tooltipIcon} ml="6px" />
          </Flex>
        </Tooltip>
        </Flex>
      </Flex>
      <Formik
        innerRef={formikRef}
        initialValues={
          id && projects
            ? {...initialSimplifiedValues, ...projects[id]}
            : {
                ...initialSimplifiedValues,
                ownerAddress: account,
                owner: account,
                tokenOwnerAccount: account,
              }
        }
        validationSchema={ProjectSchema}
        validate={(values) => {
          // console.log('--formikvalues--');
          // console.log(values);
          if (step === 3 && oldData !== values) {
            setOldData(values);
            hashKey === undefined
              ? saveProject(values, account as string)
              : editProject(values, account as string, hashKey);
          }
          if (step === 3) {
            const vaults = values.vaults;
            const result = vaults.map((vault: VaultCommon) => {
              return vault.isSet;
            });
            if (!result.includes(false)) {
              setDisableForStep3(false);
            }
          }
        }}
        onSubmit={async (data, {setSubmitting}) => {
          setSubmitting(true);
          setSubmitting(false);
        }}>
        {({values, handleBlur, handleSubmit, isSubmitting, errors}) => {
          if (Object.keys(errors).length !== 0) {
            setDisable(true);
          } else {
            setDisable(false);
          }

          const isSaved = hashKey !== undefined && isExist !== 'createproject';

          const isSet = values.vaults.map((vault: VaultCommon) => {
            return vault.isSet;
          });
          const nonSetExists = isSet.indexOf(false) !== -1;

          const isDeployed = !nonSetExists;

          // Calculate time left until snapshot time and show reschedule modal.
          const snapshotTime =
            projects[id]?.vaults[0]?.snapshot || values.vaults[0].snapshot;
          const currentTime = Math.floor(Date.now() / 1000);
          const timeUntilSnapshot = Math.floor(
            (snapshotTime - currentTime) / 60,
          );

          if (timeUntilSnapshot < 60 && (step === 2 || step === 3)) {
            openAnyModal('Reschedule', {
              from: '/launch/createproject',
            });
          }

          return (
            <Form onSubmit={handleSubmit}>
              <Flex
                flexDir={'column'}
                alignItems="center"
                fontFamily={theme.fonts.roboto}>
                <StepComponent
                  step={step}
                  setDisableForStep1={setDisableForStep1}
                  setDisableForStep2={setDisableForStep2}
                />
                <Flex
                  mt={'50px'}
                  fontSize={14}
                  justifyContent="center"
                  mx={'25px'}>
                  {!isSaved && step === 1 && (
                    <>
                      <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="Save"
                        disabled={isSubmitting}
                        marginRight={'404px'}
                        color={'white.100'}
                        hoverColor={'#00b3b4'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />

                      <ActionButton
                        bgColor={isDisable ? '#e9edf1' : 'blue.500'}
                        btnText="Save & Continue"
                        disabled={isDisable || isDisableForStep1}
                        color={isDisable ? '#86929d' : 'white.100'}
                        hoverColor={isDisable ? '#e9edf1' : '#2a72e5'}
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    </>
                  )}
                  {!isDeployed && isSaved && step === 1 && (
                    <>
                      <ButtonGroup>
                        <ActionButton
                          bgColor="#00c3c4"
                          btnText="List"
                          disabled={isSubmitting}
                          color="white.100"
                          hoverColor={'#00b3b4'}
                          onClick={() => navigateToLaunchPage()}
                        />

                        <ActionButton
                          bgColor={
                            isDisable
                              ? colorMode === 'light'
                                ? '#e9edf1'
                                : '#353535'
                              : '#fecf05'
                          }
                          btnText="Save"
                          disabled={isSubmitting}
                          marginRight={'232px'}
                          color={isDisable ? '#86929d' : '#000'}
                          onClick={() =>
                            handleSaveProject(values, account, true)
                          }
                        />
                      </ButtonGroup>
                      <ActionButton
                        bgColor={'blue.500'}
                        btnText="Next"
                        disabled={isDisable || isDisableForStep1}
                        color={'white.100'}
                        hoverColor={
                          isDisable || isDisableForStep1 ? '#e9edf1' : '#2a72e5'
                        }
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    </>
                  )}
                  {isDeployed && isSaved && step === 1 && (
                    <>
                      <ButtonGroup>
                        <ActionButton
                          bgColor="#00c3c4"
                          btnText="List"
                          disabled={isSubmitting}
                          color="white.100"
                          hoverColor={'#00b3b4'}
                          onClick={() => navigateToLaunchPage()}
                        />

                        <ActionButton
                          bgColor={
                            isDisable
                              ? colorMode === 'light'
                                ? '#e9edf1'
                                : '#353535'
                              : '#fecf05'
                          }
                          btnText="Save"
                          disabled={isSubmitting}
                          marginRight={'224px'}
                          color={isDisable ? '#86929d' : '#000'}
                          onClick={() =>
                            handleSaveProject(values, account, true)
                          }
                        />
                      </ButtonGroup>
                      <ActionButton
                        bgColor={'blue.500'}
                        btnText="Next"
                        disabled={isDisable || isDisableForStep1}
                        color={'white.100'}
                        hoverColor={
                          isDisable || isDisableForStep1 ? '#e9edf1' : '#2a72e5'
                        }
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    </>
                  )}

                  {/* //////////////////////////////////////////////////////// */}
                  {!isSaved && step === 2 && (
                    <>
                      <ActionButton
                        bgColor={isDisable ? '#e9edf1' : '#00c3c4'}
                        btnText="Save"
                        disabled={isDisable}
                        marginRight={'232px'}
                        color={isDisable ? '#86929d' : '#fff'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          marginRight="4px"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        <ActionButton
                          bgColor={isDisableForStep2 ? '#e9edf1' : 'blue.500'}
                          btnText="Save & Continue"
                          disabled={isDisableForStep2}
                          hoverColor={isDisableForStep2 ? '#e9edf1' : '#2a72e5'}
                          color={isDisableForStep2 ? '#86929d' : 'white.100'}
                          onClick={() => handleSaveAndContinue(values, account)}
                        />
                      </ButtonGroup>
                    </>
                  )}
                  {!isDeployed && isSaved && step === 2 && (
                    <>
                      {/* onClick to go to list */}
                      <ActionButton
                        bgColor="#00c3c4"
                        btnText="Save"
                        disabled={isSubmitting}
                        marginRight={'232px'}
                        color="white.100"
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          marginRight="4px"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Next"
                          color={'white.100'}
                          disabled={isDisableForStep2}
                          hoverColor={
                            isDisable || isDisableForStep2
                              ? '#e9edf1'
                              : '#2a72e5'
                          }
                          onClick={() => handleSaveAndContinue(values, account)}
                        />
                      </ButtonGroup>
                    </>
                  )}
                  {isDeployed && isSaved && step === 2 && (
                    <>
                      {/* onClick to go to list */}
                      {/* <ActionButton
                          bgColor="#00c3c4"
                          btnText="List"
                          marginRight={'224px'}
                          disabled={isSubmitting}
                          color="white.100"
                          hoverColor={'#00b3b4'}
                          onClick={() => navigateToLaunchPage()}
                        /> */}
                      <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="Save"
                        marginRight={'232px'}
                        color={'#fff'}
                        hoverColor={'#00b3b4'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Next"
                          color={'white.100'}
                          disabled={isDisableForStep2}
                          hoverColor={
                            isDisable || isDisableForStep2
                              ? '#e9edf1'
                              : '#2a72e5'
                          }
                          onClick={() => handleSaveAndContinue(values, account)}
                        />
                      </ButtonGroup>
                    </>
                  )}

                  {/* ///////////////////////////////////////////////////// */}
                  {!isSaved && step === 3 && (
                    <>
                      <ActionButton
                        bgColor={isDisable ? '#e9edf1' : '#00c3c4'}
                        btnText="Save"
                        disabled={isDisable}
                        isDisabled={isSubmitting}
                        marginRight={'232px'}
                        color={isDisable ? '#86929d' : '#fff'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          marginRight="4px"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        {/* <Tooltip label='Go to ‘my project’ and click  ‘Listing on TONStarter’'> */}
                        <ActionButton
                          bgColor={isDisableForStep3 ? '#e9edf1' : 'blue.500'}
                          btnText="Complete & Go"
                          disabled={isDisableForStep3}
                          color={isDisableForStep3 ? '#86929d' : 'white.100'}
                          onClick={() => handleComplete(values, account, true)}
                          hoverColor={isDisableForStep3 ? '#e9edf1' : '#2a72e5'}
                        />
                        {/* </Tooltip> */}
                      </ButtonGroup>
                    </>
                  )}
                  {!isDeployed && isSaved && step === 3 && (
                    <>
                      <ActionButton
                        bgColor={isDisable ? '#e9edf1' : '#00c3c4'}
                        btnText="Save"
                        disabled={isDisable}
                        marginRight={'232px'}
                        color={isDisable ? '#86929d' : '#fff'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          marginRight="4px"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        <ActionButton
                          bgColor={isDisableForStep3 ? '#e9edf1' : 'blue.500'}
                          btnText="Complete & Go"
                          disabled={isDisableForStep3}
                          hoverColor={isDisableForStep3 ? '#e9edf1' : '#2a72e5'}
                          color={isDisableForStep3 ? '#86929d' : 'white.100'}
                          onClick={() => handleComplete(values, account, true)}
                        />
                      </ButtonGroup>
                    </>
                  )}
                  {isSaved && isDeployed && step === 3 && (
                    <>
                      {/* <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="List"
                        marginRight={'404px'}
                        color={'#fff'}
                        hoverColor={'#00b3b4'}
                        onClick={() => navigateToLaunchPage()}
                      /> */}
                      <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="Save"
                        marginRight={'404px'}
                        color={'#fff'}
                        hoverColor={'#00b3b4'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                      <ActionButton
                        bgColor={'blue.500'}
                        btnText="Prev"
                        disabled={isSubmitting}
                        color={'white.100'}
                        hoverColor={'#2a72e5'}
                        onClick={() => handleStep(false)}
                      />
                    </>
                  )}
                </Flex>
              </Flex>
            </Form>
          );
        }}
      </Formik>
      <AdvanceConfirmModal handleSwitchChange={handleSwitchChange} />
      <RescheduleModal onClick={navigateToStep1} />
    </Flex>
  );
};

export default SimplifiedMainScreen;
