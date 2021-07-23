import {Wrap} from '@chakra-ui/react';
import {Scrollbars} from 'react-custom-scrollbars-2';

export const ScrollArea = (props?: any) => {
  const {height, colorMode, data} = props;
  return (
    <Scrollbars
      style={{
        width: '100%',
        height,
        display: 'flex',
        position: 'relative',
      }}
      thumbSize={70}
      renderThumbVertical={() => (
        <div
          style={{
            background: colorMode === 'light' ? '#007aff' : '#ffffff',
            position: 'relative',
            right: '-2px',
            borderRadius: '3px',
          }}></div>
      )}
      renderThumbHorizontal={() => <div style={{background: 'black'}}></div>}>
      <Wrap display="flex" style={{marginTop: '0', marginBottom: '20px'}}>
        {data.map((e: any) => e)}
      </Wrap>
    </Scrollbars>
  );
};
