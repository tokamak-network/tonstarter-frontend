import {Flex, Text, useColorMode, useTheme} from '@chakra-ui/react';
import {Projects} from '@Launch/types';
import {useFormikContext} from 'formik';
import {useEffect, useState} from 'react';
import ReactQuill from 'react-quill';
import Resizer from '../../../../../assets/svgs/◢ Resizer.svg';
import 'react-quill/dist/quill.snow.css';

const CustomMarkdownEditor = () => {
  const {colorMode} = useColorMode();
  const {values, setFieldValue} = useFormikContext<Projects['CreateSimplifiedProject']>();
  const mkData = values.description;
  const [test, setTest] = useState<string>(mkData || '');
  const theme = useTheme();
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
  .quill > .ql-container > .ql-editor.ql-blank::before {
    color: #9d9da3;
    font-family: ${theme.fonts.roboto}
  }
  .ql-editor {
    font-family: ${theme.fonts.roboto}
  }
  .ql-container {
    resize: vertical;
    overflow-y: hidden;
    min-height: 148px;
    max-height: 100%;
}
  .ql-editor {
    min-height: 148px;
    max-height: 100%;  
    overflow-y: scroll;
}
.ql-editor-resize-handle {
  background-image: url(${Resizer})
  background-size: cover;
  background-position: center;
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
      .ql-picker-label {
        color: white
      }
      .ql-editor ql-blank{
        color: #f3f4f1
      }
      .quill > .ql-container > .ql-editor.ql-blank::before {
        color: #9d9da3;
        font-family: ${theme.fonts.roboto}
      }
      .ql-editor {
        font-family: ${theme.fonts.roboto}
      }
      .ql-snow.ql-toolbar button:hover .ql-stroke, .ql-snow .ql-toolbar button:hover .ql-stroke, .ql-snow.ql-toolbar button:focus .ql-stroke, .ql-snow .ql-toolbar button:focus .ql-stroke, .ql-snow.ql-toolbar button.ql-active .ql-stroke, .ql-snow .ql-toolbar button.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke, .ql-snow.ql-toolbar button:hover .ql-stroke-miter, .ql-snow .ql-toolbar button:hover .ql-stroke-miter, .ql-snow.ql-toolbar button:focus .ql-stroke-miter, .ql-snow .ql-toolbar button:focus .ql-stroke-miter, .ql-snow.ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar button.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-label.ql-active .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item:hover .ql-stroke-miter, .ql-snow.ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter, .ql-snow .ql-toolbar .ql-picker-item.ql-selected .ql-stroke-miter { 
       stroke: #06c;
      }
      .ql-snow.ql-toolbar button .ql-stroke, 
      .ql-snow .ql-toolbar button .ql-stroke, 
      .ql-snow.ql-toolbar button .ql-stroke, 
      .ql-snow .ql-toolbar button .ql-stroke, 
      .ql-snow.ql-toolbar .ql-stroke, 
      .ql-snow .ql-toolbar .ql-stroke, 
      .ql-snow.ql-toolbar .ql-picker-label .ql-stroke, 
      .ql-snow .ql-toolbar .ql-picker-label .ql-stroke, 
      .ql-snow.ql-toolbar .ql-stroke, .ql-snow .ql-toolbar .ql-stroke, 
      .ql-snow.ql-toolbar .ql-picker-item .ql-stroke, 
      .ql-snow .ql-toolbar .ql-picker-item .ql-stroke, 
      .ql-snow .ql-toolbar .ql-stroke, 
      .ql-snow.ql-toolbar button .ql-stroke-miter, 
      .ql-snow .ql-toolbar button .ql-stroke-miter, 
      .ql-snow.ql-toolbar button .ql-stroke-miter, 
      .ql-snow .ql-toolbar button .ql-stroke-miter, 
      .ql-snow.ql-toolbar .ql-stroke-miter, 
      .ql-snow.ql-toolbar .ql-picker-label .ql-stroke-miter, 
      .ql-snow .ql-toolbar .ql-picker-label .ql-stroke-miter, 
      .ql-snow.ql-toolbar .ql-picker-item .ql-stroke-miter, 
      .ql-snow .ql-toolbar .ql-picker-item .ql-stroke-miter,.ql-snow.ql-toolbar .ql-fill{
        stroke: #f3f4f1;
        stroke-width:1;
      }
      .ql-snow.ql-toolbar button.ql-active .ql-fill, .ql-snow.ql-toolbar button:hover .ql-fill ,.ql-snow.ql-toolbar button.ql-active .ql-stroke{

      stroke: #06c;
      stroke-width: 1;
      }
      .ql-container {
        resize: vertical;
        overflow-y: hidden;
        min-height: 148px;
        max-height: 100%;
    }
      .ql-editor {
        min-height: 148px;
        max-height: 100%;  
        overflow-y: scroll;
    }
    .ql-editor-resize-handle {
      background-image: url(${Resizer})
      background-size: cover;
      background-position: center;
    }
  `;
  useEffect(() => {
    setFieldValue('description', test);
  }, [test]);

  return (
    <Flex flexDir={'column'} fontSize={13}>
    <Text h={18} mb={2.5}>
      <Flex fontSize={'13px'}><Text mr={'5px'} color={'#FF3B3B'}>*</Text>
      <Text fontSize={'14px'} fontFamily={theme.fonts.roboto}>Description</Text></Flex>
      </Text>
      <style>{markdownStyles}</style>
      <ReactQuill
        modules={modules}
        placeholder="Input the project description"
        onChange={setTest}
        style={{borderColor: '#dfe4ee'}}
        value={test}></ReactQuill>
    </Flex>
  );
};

export default CustomMarkdownEditor;
