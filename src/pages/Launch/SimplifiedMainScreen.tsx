import {Button, ButtonGroup, Flex, useTheme} from '@chakra-ui/react';
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
import type {LaunchMode, StepNumber, VaultCommon} from '@Launch/types';
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
import {CustomButton} from 'components/Basic/CustomButton';
import {isProduction} from './utils/checkConstants';
import {useLocation} from 'react-router-dom';
// Fetch deployed projects from api
import {Project} from './components/Projects/Project';
import {useQuery} from 'react-query';
import axios from 'axios';
import {fetchCampaginURL} from 'constants/index';
import {ActionButton} from './components/common/simplifiedUI/ActionButton';

const StepComponent = (props: {
  step: StepNumber;
  setDisableForStep2: Dispatch<SetStateAction<boolean>>;
}) => {
  const {step, setDisableForStep2} = props;
  switch (step) {
    case 1:
      return <OpenStepOneSimplified></OpenStepOneSimplified>;
    case 2:
      return <OpenStepTwoSimplified setDisableForStep2={setDisableForStep2}></OpenStepTwoSimplified>;
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
  const [isDisableForStep3, setDisableForStep3] = useState<boolean>(true);
  const theme = useTheme();
  const {account} = useActiveWeb3React();
  const {initialValues} = useValues(account || '');
  const [project, setProject] = useState<any>();
  const history = useHistory();
  const [oldData, setOldData] = useState();
  const [saveBtnDisable, setSaveBtnDisable] = useState(false);
  const formikRef = useRef(null);
  const match = useRouteMatch();
  const {url} = match;
  const isExist = url.split('/')[2];
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

  /**
   * Fetch projects data from api
   */
  const {data} = useQuery(
    ['test'],
    () =>
      axios.get(fetchCampaginURL, {
        headers: {
          account,
        },
      }),
    {
      refetchInterval: 600000,
    },
  );

  useEffect(() => {
    if (data) {
      const {data: ProjectDetail} = data;
      dispatch(fetchProjects({data: ProjectDetail}));
      setProject(ProjectDetail.name);
    }
  }, [data, dispatch]);

  /** Check if this project is deployed */
  useEffect(() => {
    dispatch(setHashKey({data: isExist === 'project' ? undefined : isExist}));
  }, []);

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
      return 'gray.25';
    }
    return step === 1 && isExist === 'project' ? 'yellow.200' : '#00c3c4';
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

  if (!account) {
    return <Redirect to={{pathname: '/launch'}}></Redirect>;
  }

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
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
            ? {...initialValues, ...projects[id]}
            : {...initialValues, ownerAddress: account}
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
          return (
            <Form onSubmit={handleSubmit}>
              <Flex
                flexDir={'column'}
                alignItems="center"
                fontFamily={theme.fonts.roboto}>
                <StepComponent
                  step={step}
                  setDisableForStep2={setDisableForStep2}
                />
                <Flex mt={'50px'} fontSize={14} justifyContent="center">
                  {/* Step 1 && Project is Deployed */}
                  {step === 1 && isExist === 'project' ? (
                    <ButtonGroup>
                      <ActionButton
                        bgColor="#00c3c4"
                        btnText="List"
                        isDisabled={isSubmitting}
                        color="white"
                        onClick={() => navigateToLaunchPage()}
                      />
                      <ActionButton
                        bgColor="yellow.200"
                        btnText="Save"
                        isDisabled={isSubmitting}
                        marginRight={step === 1 ? '190px' : '558px'}
                        color={isDisable ? '#86929d' : 'white.100'}
                        onClick={() => handleSaveProject(values, account, true)}
                      />
                    </ButtonGroup>
                  ) : (
                    /** Step 1 && Project is not yet deployed */ 
                    <ActionButton
                      bgColor={getSaveButtonColor()}
                      btnText="Save"
                      isDisabled={isSubmitting}
                      disabled={
                        step === 3 ||
                        (step === 1 && isDisable) ||
                        saveBtnDisable
                      }
                      marginRight={step === 1 ? '390px' : '558px'}
                      color={isDisable ? '#86929d' : 'white.100'}
                      onClick={() => handleSaveProject(values, account, true)}
                    />
                  )}
                  <Flex>
                    {step !== 1 && (
                      <ActionButton
                        bgColor={'blue.500'}
                        btnText="Prev"
                        marginRight="12px"
                        disabled={isSubmitting}
                        color={'white.100'}
                        onClick={() => handleStep(false)}
                      />
                    )}
                    {step === 1 && (
                      <ActionButton
                        bgColor={isDisable ? 'gray.25' : 'blue.500'}
                        btnText="Save & Continue"
                        disabled={isDisable}
                        color={isDisable ? '#86929d' : 'white.100'}
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    )}
                    {step === 2 && (
                      <ActionButton
                        bgColor={isDisableForStep2 ? 'gray.25' : 'blue.500'}
                        btnText="Save & Continue"
                        disabled={isDisable}
                        color={isDisableForStep2 ? '#86929d' : 'white.100'}
                        onClick={() => handleSaveAndContinue(values, account)}
                      />
                    )}
                    {step === 3 && (
                       <ActionButton
                       bgColor={isDisableForStep3 ? '#gray.25' : 'blue.500'}
                       btnText="Complete & Go"
                       disabled={isDisableForStep3}
                       color={isDisableForStep3 ? '#86929d' : 'white.100'}
                       onClick={() =>  navigateToLaunchPage()}
                     />
                    )}
                  </Flex>
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
