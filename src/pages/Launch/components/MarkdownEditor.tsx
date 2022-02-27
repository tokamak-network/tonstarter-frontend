import {Box, Flex, Input, Text, useColorMode} from '@chakra-ui/react';
import {ErrorMessage, Field, useFormikContext} from 'formik';
import {useEffect, useRef, useState} from 'react';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
//@ts-ignore
import { CKEditor, CKEditorContext } from '@ckeditor/ckeditor5-react';
//@ts-ignore
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
//@ts-ignore
import Markdown from '@ckeditor/ckeditor5-markdown-gfm/src/markdown';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
//@ts-ignore
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
//@ts-ignore
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
//@ts-ignore
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';

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

  const [test, setTest] = useState<string>('')

  return (
    <Flex flexDir={'column'} fontSize={13}>
      <Text h={18} mb={2.5}>
        Description
      </Text> 
      <CKEditor 
      editor={ ClassicEditor }  
      // config={{
      //   plugins: [  Paragraph, Bold, Italic, Essentials ],
      //   toolbar: [ 'bold', 'italic' ]
      // }}  
      onChange={ ( event:any, editor:any ) => {
                        const data = editor.getData();
                        console.log( data );
                        // setTest(data.replaceAll("</p>", "</p><br/><br/>"))
                    } } data={'<p>Hello, csharp corner!</p><br/> <h1>This is demo for ckeditor 5 with React</br>'}
                    ></CKEditor>
      {/* <MdEditor
        style={{height: '180px'}}
        renderHTML={(text) => mdParser.render(text)}
        onChange={handleEditorChange}
        canView={{ menu: true, md: false, html: true, fullScreen: false, hideMenu: false, both: false }}
        view={{ menu: true, md: false, html: true }}
      /> */}
    </Flex>
  );
};

export default MarkdownEditor;
