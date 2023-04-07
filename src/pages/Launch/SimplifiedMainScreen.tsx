import {
  ButtonGroup,
  Text,
  Image,
  Flex,
  Link,
  useTheme,
  useColorMode,
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
import {selectLaunch, setHashKey, fetchProjects} from '@Launch/launch.reducer';
import OpenStepThreeSimplified from '@Launch/components/simplifiedLaunch/OpenStepThreeSimplified';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {saveProject, editProject} from '@Launch/utils/saveProject';
import {ActionButton} from './components/common/simplifiedUI/ActionButton';
import {useFormikContext} from 'formik';

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
  const isExist = url.split('/')[3];

  const dispatch = useAppDispatch();
  const {
    //@ts-ignore
    params: {id},
  } = match;
  const {
    data: {projects, hashKey},
  } = useAppSelector(selectLaunch);

  const navigateToLaunchPage = useCallback(() => {
    history.push('/launch');
  }, [history]);

  useEffect(() => {
    //@ts-ignore
    const unBlock = history.block((loc, action) => {
      if (action === 'POP') {
        return window.confirm('Are you sure you want to go back?');
      }
    });
    return () => unBlock();
  }, [history]);

  useEffect(() => {
    dispatch(
      setHashKey({
        data: isExist === 'createprojectsimple' ? undefined : isExist,
      }),
    );
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
    return step === 1 && isExist !== 'createprojectsimple' && hashKey
      ? 'yellow.200'
      : '#00c3c4';
  };

  const handleSaveProject = (values: any, account: string, mode: boolean) => {
    account && isExist === 'createprojectsimple' && hashKey === undefined
      ? saveProject(values, account, mode)
      : editProject(values, account as string, hashKey || isExist, mode);
  };

  const handleSaveAndContinue = (values: any, account: string) => {
    account && isExist === 'createprojectsimple' && hashKey === undefined
      ? saveProject(values, account)
      : editProject(values, account as string, hashKey || isExist);
    handleStep(true);
  };

  const handleComplete = (values: any, account: string, mode: boolean) => {
    editProject(values, account as string, hashKey || isExist);
    history.push('/launch');
  };

  if (!account) {
    return <Redirect to={{pathname: '/launch'}}></Redirect>;
  }  

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

          const isSaved =
            hashKey !== undefined && isExist !== 'createprojectsimple';

          const isSet = values.vaults.map((vault: VaultCommon) => {
            return vault.isSet;
          });
          const nonSetExists = isSet.indexOf(false) !== -1;

          const isDeployed = !nonSetExists;

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
                        hoverColor={isDisable? '#e9edf1' : '#2a72e5'}
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    </>
                  )}
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
                          marginRight="12px"
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
                          marginRight="12px"
                          disabled={isSubmitting}
                          color={'white.100'}
                          hoverColor={'#2a72e5'}
                          onClick={() => handleStep(false)}
                        />
                        <ActionButton
                          bgColor={isDisableForStep3 ? '#e9edf1' : 'blue.500'}
                          btnText="Complete & Go"
                          disabled={isDisableForStep3}
                          color={isDisableForStep3 ? '#86929d' : 'white.100'}
                          onClick={() => handleComplete(values, account, true)}
                          hoverColor={isDisableForStep3 ? '#e9edf1' : '#2a72e5'}
                        />
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
                          marginRight="12px"
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
                  {isSaved && step === 1 && (
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
                          bgColor={isDisable ? colorMode === 'light' ? '#e9edf1' : '#353535' : '#fecf05'}
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
                        hoverColor={isDisable || isDisableForStep1 ? '#e9edf1' : '#2a72e5'}
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    </>
                  )}
                  {isSaved && step === 2 && (
                    <>
                      {/* onClick to go to list */}
                      <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="List"
                        marginRight={'232px'}
                        color={'#fff'}
                        hoverColor={'#00b3b4'}
                        onClick={() => navigateToLaunchPage()}
                      />
                      <ButtonGroup>
                        <ActionButton
                          bgColor={'blue.500'}
                          btnText="Prev"
                          marginRight="12px"
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
                          hoverColor={isDisable || isDisableForStep2 ? '#e9edf1' : '#2a72e5'}
                          onClick={() => handleSaveAndContinue(values, account)}
                        />
                      </ButtonGroup>
                    </>
                  )}
                  {isSaved && isDeployed && step === 3 && (
                    <>
                      <ActionButton
                        bgColor={'#00c3c4'}
                        btnText="List"
                        marginRight={'404px'}
                        color={'#fff'}
                        hoverColor={'#00b3b4'}
                        onClick={() => navigateToLaunchPage()}
                      />
                      <ActionButton
                        bgColor={'blue.500'}
                        btnText="Prev"
                        marginRight="12px"
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
    </Flex>
  );
};

export default SimplifiedMainScreen;
