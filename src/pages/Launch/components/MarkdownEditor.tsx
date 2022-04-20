import {Flex, Text, useColorMode} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
type MarkdownEditorProp = {};

const MarkdownEditor: React.FC<MarkdownEditorProp> = () => {
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext<Projects['CreateProject']>();
  const mkData = values.description;
  const [test, setTest] = useState<string>(mkData || '');

  const modules = {
    toolbar: [
      [{header: [1, 2, 3, 4, 5, 6, false]}],
      ['bold', 'italic', 'underline', 'strike'],

      ['blockquote', 'code-block'],
      [{list: 'ordered'}, {list: 'bullet'}],
      [{indent: '-1'}, {indent: '+1'}, {align: []}],
      ['link', 'image', 'video'],
      ['clean'],
    ], // options here
  };

  useEffect(() => {
    setFieldValue('description', test);
  }, [test]);

  return (
    <Flex flexDir={'column'} fontSize={13}>
      <Text h={18} mb={2.5}>
        Description
      </Text>

      <ReactQuill
        modules={modules}
        placeholder="Input the project description"
        onChange={setTest}
        value={test}></ReactQuill>
    </Flex>
  );
};

export default MarkdownEditor;
