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
    <Flex flexDir={'column'} fontSize={13} mb={'20px'}>
      <Text h={18} mb={2.5}>
        {name}
      </Text>
      <Field name={name}>
        {(
          //@ts-ignore
          {field, meta: {touched, error}},
        ) => (
          <input
            // //@ts-ignore
            // border={errors[name] !== undefined && '1px solid red'}
            className="test"
            {...field}></input>
        )}
      </Field>
      <ErrorMessage
        name={name}
        render={(msg) => <Text color={'red.100'}>{msg}</Text>}></ErrorMessage>
      {/* </Box> */}
    </Flex>
  );
};

export default InputComponent;
