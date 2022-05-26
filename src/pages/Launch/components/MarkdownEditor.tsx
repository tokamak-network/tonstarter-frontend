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

  const markdownStyles =
    colorMode === 'light'
      ? `.ql-toolbar.ql-snow {
    border: 1px solid #dfe4ee;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom: none
  }
  .ql-toolbar.ql-snow + .ql-container.ql-snow {
    border: 1px solid #dfe4ee;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
 
  `
      : `
      .ql-toolbar.ql-snow {
        border: 1px solid #424242;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        border-bottom: none
      }
      .ql-toolbar.ql-snow + .ql-container.ql-snow {
        border: 1px solid #424242;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .ql-snow .ql-fill, .ql-snow .ql-stroke.ql-fill {
        stroke: #f3f4f1;
        stroke-width:1;
      }
      .ql-snow .ql-even{
        stroke: #f3f4f1;
        stroke-width:1;
      }
      .ql-snow .ql-stroke {
        stroke: #f3f4f1;
        stroke-width:1;
      }
      .ql-picker-label {
        color: white
      }
      .ql-editor ql-blank{
        color: #f3f4f1
      }
      `;
  useEffect(() => {
    setFieldValue('description', test);
  }, [test]);

  return (
    <Flex flexDir={'column'} fontSize={13}>
      <Text h={18} mb={2.5}>
        Description *
      </Text>
      <style>{markdownStyles}</style>
      <ReactQuill
        modules={modules}
        placeholder="Input the project description"
        onChange={setTest}
        style={{borderColor: '#dfe4ee'}}
        theme="snow"
        value={test}></ReactQuill>
    </Flex>
  );
};

export default MarkdownEditor;
