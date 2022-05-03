import {Button, Flex, useTheme} from '@chakra-ui/react';
import {useCallback, useEffect, useState} from 'react';
import OpenStepOne from '@Launch/components/OpenStepOne';
import {Formik, Form} from 'formik';
import useValues from '@Launch/hooks/useValues';
import type {StepNumber, VaultCommon} from '@Launch/types';
import ProjectSchema from '@Launch/utils/projectSchema';
import {PageHeader} from 'components/PageHeader';
import Steps from '@Launch/components/Steps';
import OpenStepTwo from '@Launch/components/OpenStepTwo';
import {useRouteMatch} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from 'hooks/useRedux';
import {selectLaunch, setHashKey} from '@Launch/launch.reducer';
import OpenStepThree from '@Launch/components/OpenStepThree';
import validateFormikValues from '@Launch/utils/validate';
import {useHistory} from 'react-router-dom';
import {useActiveWeb3React} from 'hooks/useWeb3';
import {saveProject, editProject} from '@Launch/utils/saveProject';

const StepComponent = (props: {step: StepNumber}) => {
  const {step} = props;
  switch (step) {
    case 1:
      return <OpenStepOne></OpenStepOne>;
    case 2:
      return <OpenStepTwo></OpenStepTwo>;
    case 3:
      return <OpenStepThree></OpenStepThree>;
    default:
      return <div>no component for this step</div>;
  }
};

const MainScreen = () => {
  const [step, setStep] = useState<StepNumber>(1);
  const [isDisable, setDisable] = useState<boolean>(true);
  const [isDisableForStep2, setDisableForStep2] = useState<boolean>(false);
  const [isDisableForStep3, setDisableForStep3] = useState<boolean>(true);
  const {initialValues} = useValues();
  const theme = useTheme();
  const {account} = useActiveWeb3React();

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

  let historyObj = useHistory();

  useEffect(() => {
    //@ts-ignore
    const unBlock = historyObj.block((loc, action) => {
      if (action === 'POP') {
        return window.confirm('Are you sure you want to go back?');
      }
    });
    return () => unBlock();
  }, [historyObj]);

  useEffect(() => {
    dispatch(
      setHashKey({data: isExist === 'createproject' ? undefined : isExist}),
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

  // const {web3Token} = useWeb3Token();

  const [oldData, setOldData] = useState();

  if (!account) {
    return <div>You need to connect to the wallet</div>;
  }

  return (
    <Flex
      flexDir={'column'}
      justifyContent={'center'}
      w={'100%'}
      mt={100}
      mb={'100px'}>
      <Flex alignItems={'center'} flexDir="column" mb={'20px'}>
        <PageHeader
          title={'Create Project'}
          subtitle={'You can create and manage projects.'}
        />
        <Flex mt={'50px'} mb={'20px'}>
          <Steps
            stepName={['Project&Token', 'Token Economy', 'Deploy']}
            currentStep={step}></Steps>
        </Flex>
      </Flex>
      <Formik
        initialValues={
          id && projects
            ? {...initialValues, ...projects[id]}
            : {...initialValues, ownerAddress: account}
        }
        validationSchema={ProjectSchema}
        validate={(values) => {
          console.log(values);
          validateFormikValues(values, setDisable, setDisableForStep2);
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
          return (
            <Form onSubmit={handleSubmit}>
              <Flex
                flexDir={'column'}
                alignItems="center"
                fontFamily={theme.fonts.roboto}>
                <StepComponent step={step} />
                <Flex mt={'50px'} fontSize={14} justifyContent="center">
                  <Button
                    w={'160px'}
                    h={'45px'}
                    bg={'#00c3c4'}
                    color={'white.100'}
                    _hover={{}}
                    disabled={step === 3}
                    mr={step === 1 ? '390px' : '558px'}
                    onClick={() =>
                      account &&
                      isExist === 'createproject' &&
                      hashKey === undefined
                        ? saveProject(values, account, true)
                        : editProject(
                            values,
                            account as string,
                            hashKey || isExist,
                            true,
                          )
                    }>
                    Save
                  </Button>
                  <Flex>
                    {step !== 1 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        bg={'blue.500'}
                        fontSize={14}
                        color={'white.100'}
                        mr={'12px'}
                        disabled={isSubmitting}
                        _hover={{}}
                        onClick={() => handleStep(false)}>
                        Prev
                      </Button>
                    )}
                    {step === 1 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        fontSize={14}
                        color={isDisable ? '#86929d' : 'white.100'}
                        bg={isDisable ? '#gray.25' : 'blue.500'}
                        disabled={isDisable}
                        _hover={{}}
                        onClick={() => handleStep(true)}>
                        Next
                      </Button>
                    )}
                    {step === 2 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        fontSize={14}
                        color={isDisableForStep2 ? '#86929d' : 'white.100'}
                        bg={isDisableForStep2 ? '#gray.25' : 'blue.500'}
                        disabled={isDisableForStep2}
                        _hover={{}}
                        onClick={() => handleStep(true)}>
                        Next
                      </Button>
                    )}
                    {step === 3 && (
                      <Button
                        type="submit"
                        w={'160px'}
                        h={'45px'}
                        fontSize={14}
                        color={isDisableForStep3 ? '#86929d' : 'white.100'}
                        bg={isDisableForStep3 ? '#gray.25' : 'blue.500'}
                        disabled={isDisableForStep3}
                        _hover={{}}
                        onClick={() => handleStep(true)}>
                        Confirm
                      </Button>
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

export default MainScreen;
