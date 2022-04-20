import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
// import {ErrorMessage, Field, useFormikContext} from 'formik';
import {useEffect, useRef, useState} from 'react';
// import MarkdownIt from 'markdown-it';
// import MdEditor from 'react-markdown-editor-lite';
// import 'react-markdown-editor-lite/lib/index.css';
// //@ts-ignore
// import {CKEditor, CKEditorContext} from '@ckeditor/ckeditor5-react';
// //@ts-ignore
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// // import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
// //@ts-ignore
// import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
// import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
// //@ts-ignore
// import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
// //@ts-ignore
// import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
// //@ts-ignore
// import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
type MarkdownEditorProp = {};

const InputComponentStyle = {
  light: {},
};

const MarkdownEditor: React.FC<MarkdownEditorProp> = () => {
  const {colorMode} = useColorMode();
  // const mdParser = new MarkdownIt(/* Markdown-it options */);

  //@ts-ignore
  const handleEditorChange = ({html, text}) => {
    console.log('handleEditorChange', html, text);
  };

  const [test, setTest] = useState<string>('');
  console.log(test);
  
  const modules = {
    toolbar: [
  
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
     
      ["blockquote", "code-block"],
      [{ list:  "ordered" }, { list:  "bullet" }],
      [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
  ],        // options here
  
}
  // const editorConfiguration = {
  //   plugins: [Essentials, Bold, Italic, Paragraph],
  //   toolbar: ['bold', 'italic'],
  // };

  return (
    <Flex flexDir={'column'} fontSize={13}>
      <Text h={18} mb={2.5}>
        Description
      </Text>
     
<ReactQuill modules={modules} placeholder="Content goes here..." onChange={setTest}></ReactQuill>
    </Flex>
  );
};

export default MarkdownEditor;
