import {FC} from 'react';
import {Helmet} from 'react-helmet-async';
import Favicon from './Icons/tos_symbol.svg';

type HeadProps = {
  title?: string;
  description?: string;
};

export const Head: FC<HeadProps> = ({title, description}) => {
  // const TITLE = `${title ? `${title} - ` : ''} Tokamak`;
  const TITLE = `TONStarter - Tokamak`;
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg" href={Favicon} sizes="16x16" />
        {/* <meta name="theme-color" content="#000000" />
        <meta name="description" content={description} /> */}
        <title>{TITLE}</title>
      </Helmet>
    </>
  );
};
