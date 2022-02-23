import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {useEffect, useRef, useState} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';

type MarkdownEditorProp = {};

const InputComponentStyle = {
  light: {},
};

const MarkdownEditor: React.FC<MarkdownEditorProp> = () => {
  const {colorMode} = useColorMode();
  const mdParser = new MarkdownIt(/* Markdown-it options */);

  //@ts-ignore
  const handleEditorChange = ({html, text}) => {
    console.log('handleEditorChange', html, text);
  };

  return (
    <Flex flexDir={'column'} fontSize={13}>
      <Text h={18} mb={2.5}>
        Description
      </Text>
      <MdEditor
        style={{height: '180px'}}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
      />
    </Flex>
  );
};

export default MarkdownEditor;
