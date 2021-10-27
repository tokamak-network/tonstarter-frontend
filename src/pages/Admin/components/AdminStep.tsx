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
