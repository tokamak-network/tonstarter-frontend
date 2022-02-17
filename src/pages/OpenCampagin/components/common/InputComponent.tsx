import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {useEffect, useRef, useState} from 'react';
import './input.css';
type InputComponentProps = {
  name: string;
  placeHolder: string;
};

const InputComponentStyle = {
  light: {},
};

const InputComponent: React.FC<InputComponentProps> = (props) => {
  const {name, placeHolder} = props;
  const {errors} = useFormikContext();
  const {colorMode} = useColorMode();

  return (
    <Flex flexDir={'column'} fontSize={13} pos={'relative'}>
      <Text h={18} mb={2.5}>
        {name}
      </Text>
      <Field name={name}>
        {(
          //@ts-ignore
          {field, meta: {touched, error}},
        ) => {
          //@ts-ignore
          const isError = errors[name] === undefined ? false : true;
          return (
            <Input
              className={
                isError
                  ? 'input-err'
                  : colorMode === 'light'
                  ? 'input-light'
                  : 'input-dark'
              }
              {...field}
              id={name}
              h={'32px'}
              _focus={{}}
              placeholder={`input ${name}`}></Input>
          );
        }}
      </Field>
      <Box pos={'absolute'} right={0}>
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text color={'red.100'}>{`Invalid ${name}`}</Text>
          )}></ErrorMessage>
      </Box>
    </Flex>
  );
};

export default InputComponent;
