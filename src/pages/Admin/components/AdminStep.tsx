import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import {
  Flex,
  Box,
  Text,
  useColorMode,
  useTheme,
  Button,
} from '@chakra-ui/react';
import {AdminObject} from '@Admin/types';
import {Dispatch, SetStateAction, useState} from 'react';
import {CustomButton} from 'components/Basic/CustomButton';

type StepProp = {
  data: AdminObject;
  lastStep: boolean;
  handleNextStep: Dispatch<SetStateAction<any>> | any;
  handlePrevStep?: Dispatch<SetStateAction<any>> | any;
};

const fieldWrap = {
  fontSize: 13,
};

const fieldStyle = {
  width: '327px',
  border: '1px solid #dfe4ee',
  height: '32px',
  borderRadius: 4,
  paddingLeft: '15px',
  verticalTextAlign: 'center',
};

const CustomTextAreaField = (props: {name: string; title?: string}) => {
  const {name, title} = props;
  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Flex mb={'10px'}>
        <Text>{title || name}</Text>
        <ErrorMessage
          name={name}
          render={() => (
            <div
              style={{
                marginLeft: '3px',
                color: 'red',
                fontSize: '15px',
                verticalAlign: 'center',
                textAlign: 'center',
              }}>
              *
            </div>
          )}
        />
      </Flex>
      <Field
        name={name}
        as="textarea"
        style={{
          width: '327px',
          height: '112px',
          border: '1px solid #dfe4ee',
          borderRadius: 4,
          paddingLeft: '15px',
          paddingTop: '5px',
        }}
        placeHolder={`input description`}
      />
    </Flex>
  );
};

const CustomField = (props: {
  name: string;
  title?: string;
  w?: string;
  placeHolder?: string;
}) => {
  const {name, title, w, placeHolder} = props;
  return (
    <Flex style={fieldWrap} flexDir="column" mb={'20px'} pos="relative">
      <Flex mb={'10px'}>
        <Text>{title || name}</Text>
        <ErrorMessage
          name={name}
          render={() => (
            <div
              style={{
                marginLeft: '3px',
                color: 'red',
                fontSize: '15px',
                verticalAlign: 'center',
                textAlign: 'center',
              }}>
              *
            </div>
          )}
        />
      </Flex>
      <Field
        style={{...fieldStyle, width: w || '327px'}}
        name={name}
        placeHolder={placeHolder || `input ${name}`}
      />
    </Flex>
  );
};

export const StepOne: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep} = props;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const names = [
    'name',
    'description',
    'image',
    'adminAddress',
    'website',
    'telegram',
    'medium',
    'twitter',
    'discord',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    const isRequired =
      name === 'name' || name === 'description' || name === 'adminAddress';
    if (!isRequired) {
      return null;
    }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '520px',
            position: 'relative',
            justifyContent: 'space-between',
          }}>
          <Flex flexDir="column">
            <CustomField name={'name'} title={'Name'}></CustomField>
            <CustomTextAreaField
              name={'description'}
              title={'Description'}></CustomTextAreaField>
            <CustomField
              name={'image'}
              title={'Upload Project Main Image'}></CustomField>
            <CustomField
              name={'adminAddress'}
              title={'Admin address'}></CustomField>
          </Flex>
          <Flex flexDir="column">
            <CustomField name={'website'}></CustomField>
            <CustomField name={'telegram'}></CustomField>
            <CustomField name={'medium'}></CustomField>
            <CustomField name={'twitter'}></CustomField>
            <CustomField name={'discord'}></CustomField>
          </Flex>
          <Button
            pos="absolute"
            bottom={'40px'}
            type="submit"
            alignSelf="center"
            w={'150px'}
            h={'38px'}
            br={4}
            bg={'blue.500'}
            color={'white.100'}
            disabled={!isValid}
            _hover={{}}>
            Next
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export const StepTwo: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep} = props;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const names = [
    'tokenName',
    'tokenAddress',
    'tokenSymbol',
    'tokenSymbolImage',
    'tokenAllocationAmount',
    'tokenFundRaisingTargetAmount',
    'fundingTokenType',
    'tokenFundingRecipient',
    'projectTokenRatio',
    'projectFundingTokenRatio',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    // const isRequired =
    //   name === 'name' || name === 'description' || name === 'adminAddress';
    // if (!isRequired) {
    //   return null;
    // }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  console.log(stepOneValidationSchema);

  const titleStyle = {
    color: 'black.300',
    fontSize: 15,
  };

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '850px',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Flex flexDir="column">
            <Flex
              style={titleStyle}
              alignItems="center"
              mt={'40px'}
              mb={'25px'}>
              <span style={{fontSize: '4px'}}>○ </span>
              <Text ml={'3px'}>Project Token</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Flex flexDir="column">
                <CustomField
                  name={'tokenName'}
                  title={'Token Name'}></CustomField>
                <CustomField
                  name={'tokenSymbol'}
                  title={'Token Symbol'}></CustomField>
                <CustomField
                  name={'tokenAllocationAmount'}
                  title={'Token Allocation Amount'}></CustomField>
              </Flex>
              <Flex flexDir="column">
                <CustomField
                  name={'tokenAddress'}
                  title={'Token Address'}></CustomField>
                <CustomField
                  name={'tokenSymbolImage'}
                  title={'Token Symbol Image'}></CustomField>
              </Flex>
            </Flex>
            <Flex
              style={titleStyle}
              alignItems="center"
              mt={'40px'}
              mb={'25px'}>
              <span style={{fontSize: '4px'}}>○ </span>
              <Text ml={'3px'}>Funding Token</Text>
            </Flex>
            <Flex justifyContent="space-between">
              <Flex flexDir="column">
                <CustomField
                  name={'fundingTokenType'}
                  title={'Token Name'}></CustomField>
                <CustomField
                  name={'tokenFundRaisingTargetAmount'}
                  title={'tokenFundRaisingTargetAmount'}></CustomField>
              </Flex>
              <Flex>
                <CustomField
                  name={'tokenFundingRecipient'}
                  title={'Funding Token Recipient'}></CustomField>
              </Flex>
            </Flex>
            <Flex
              style={titleStyle}
              alignItems="center"
              mt={'40px'}
              mb={'25px'}>
              <span style={{fontSize: '4px'}}>○ </span>
              <Text ml={'3px'}>Token Price Ratio</Text>
            </Flex>
            <Flex>
              <CustomField
                name={'projectTokenRatio'}
                title={'Project Token'}
                w={'150px'}
                placeHolder={'0.00'}></CustomField>
              <Text alignSelf="center" pt={'10px'} px={'11px'}>
                :
              </Text>
              <CustomField
                name={'projectFundingTokenRatio'}
                title={'Funding Token'}
                w={'150px'}
                placeHolder={'0.00'}></CustomField>
            </Flex>
          </Flex>

          <Flex
            pos="absolute"
            bottom={'40px'}
            alignItems="center"
            justifyContent="center">
            <Button
              w={'150px'}
              h={'38px'}
              br={4}
              bg={'blue.500'}
              color={'white.100'}
              mr={'12px'}
              onClick={() => handlePrevStep()}
              _hover={{}}>
              Prev
            </Button>
            <Button
              type="submit"
              alignSelf="center"
              w={'150px'}
              h={'38px'}
              br={4}
              bg={'blue.500'}
              color={'white.100'}
              disabled={!isValid}
              _hover={{}}>
              Next
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export const StepThree: React.FC<StepProp> = (props) => {
  const {data, lastStep, handleNextStep, handlePrevStep} = props;

  const handleSubmit = (values: any) => {
    handleNextStep(values, lastStep);
  };

  const names = [
    'saleContractAddress',
    'snapshot',
    'startAddWhiteTime',
    'endAddWhiteTime',
    'startExclusiveTime',
    'endExclusiveTime',
    'startDepositTime',
    'endDepositTime',
    'startClaimTime',
    'claimInterval',
    'claimPeriod',
  ];

  const obj = {};

  names.map((name: string) => {
    //@ts-ignore
    const nameType = typeof data[name];
    // const isRequired =
    //   name === 'name' || name === 'description' || name === 'adminAddress';
    // if (!isRequired) {
    //   return null;
    // }
    if (nameType === 'string') {
      //@ts-ignore
      return (obj[name] = Yup.string().required().label(name));
    }
    if (nameType === 'number') {
      //@ts-ignore
      return (obj[name] = Yup.number().required().label(name));
    }
    //@ts-ignore
    return (obj[name] = Yup.boolean().required().label(name));
  });

  const stepOneValidationSchema = Yup.object({
    ...obj,
  });

  const titleStyle = {
    color: 'black.300',
    fontSize: 15,
  };

  const circleStyle = {
    display: 'flex',
    width: '24px',
    height: '24px',
    borderRadius: '18px',
    border: '1px solid #e6eaee',
    color: '#848c98',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#ffffff',
    fontSize: '14px',
    fontWeight: 600,
  };

  return (
    <Formik
      validationSchema={stepOneValidationSchema}
      initialValues={data}
      onSubmit={handleSubmit}>
      {({isValid}) => (
        <Form
          style={{
            display: 'flex',
            width: '100%',
            height: '850px',
            position: 'relative',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
          <Flex flexDir="column">
            <Flex>
              <CustomField
                name={'saleContractAddress'}
                title={'Sale Contract Address'}
                w={'300px'}></CustomField>
              <Box d="flex" alignItems="center" ml={'10px'}>
                <CustomButton
                  w={'64px'}
                  h={'32px'}
                  style={{mt: '8px'}}
                  text={'Query'}></CustomButton>
              </Box>
            </Flex>
            <Flex mt={'15px'}>
              <Flex flexDir="column" w={'380px'}>
                <Flex style={titleStyle} alignItems="center" mb={'30px'}>
                  <span style={{fontSize: '4px'}}>○ </span>
                  <Text ml={'3px'}>Sale Timeline</Text>
                </Flex>
                <Flex pos="relative" w={'310px'}>
                  <Flex flexDir="column" pos="absolute" left={'60px'}>
                    <Box fontSize={'13px'} pt={'3px'}>
                      <Text>Round 1</Text>
                    </Box>
                  </Flex>
                  <Flex flexDir="column" pos="absolute" left={'190px'}>
                    <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'104px'}>
                      <Text>Snpashot</Text>
                    </Box>
                    <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'64px'}>
                      <Text>Add Whitelist</Text>
                    </Box>
                    <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'200px'}>
                      <Text>Sale</Text>
                    </Box>
                    <Box fontSize={'13px'} pt={'3px'} h={'16px'} mb={'154px'}>
                      <Text>Deposit</Text>
                    </Box>
                    <Box fontSize={'13px'} pt={'3px'}>
                      <Text>Claim</Text>
                    </Box>
                  </Flex>
                  <Flex justifyContent="center" w={'100%'}>
                    <Flex zIndex={100} pl={0.5} flexDir="column">
                      <Box style={circleStyle} mb={'51px'}>
                        <Text>1</Text>
                      </Box>
                      <Box style={circleStyle} mb={'53px'}>
                        <Text>2</Text>
                      </Box>
                      <Box style={circleStyle} mb={'52px'}>
                        <Text>3</Text>
                      </Box>
                      <Box style={circleStyle} mb={'112px'}>
                        <Text>4</Text>
                      </Box>
                      <Box style={circleStyle} mb={'52px'}>
                        <Text>5</Text>
                      </Box>
                      <Box style={circleStyle} mb={'112px'}>
                        <Text>6</Text>
                      </Box>
                      <Box style={circleStyle}>
                        <Text>7</Text>
                      </Box>
                    </Flex>
                    <Flex></Flex>
                  </Flex>
                  <Box
                    w={'4px'}
                    h={'600px'}
                    left={'50%'}
                    bg={'#e7edf3'}
                    borderRadius={100}
                    pos={'absolute'}></Box>
                </Flex>
              </Flex>
              <Flex flexDir="column">
                <Flex style={titleStyle} alignItems="center" mb={'20px'}>
                  <Text ml={'3px'}>Round 1</Text>
                </Flex>
                <Box>
                  <CustomField
                    name={'snapshot'}
                    title={'1. Snapshot Timestamp'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'startAddWhiteTime'}
                    title={'2. AddWhiltelist Start Time'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'endAddWhiteTime'}
                    title={'3. EndWhitelist End Time'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'startExclusiveTime'}
                    title={'4. Exclusive Start Time'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomField>
                </Box>
                <Box>
                  <CustomField
                    name={'endExclusiveTime'}
                    title={'5. Exclusive End Time'}
                    w={'200px'}
                    placeHolder={'MM/DD/YYYY'}></CustomField>
                </Box>
                <Flex
                  style={titleStyle}
                  alignItems="center"
                  mt={'20px'}
                  mb={'20px'}>
                  <Text ml={'3px'}>Round 2</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Flex
            pos="absolute"
            bottom={'40px'}
            alignItems="center"
            justifyContent="center">
            <Button
              w={'150px'}
              h={'38px'}
              br={4}
              bg={'blue.500'}
              color={'white.100'}
              mr={'12px'}
              onClick={() => handlePrevStep()}
              _hover={{}}>
              Prev
            </Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
