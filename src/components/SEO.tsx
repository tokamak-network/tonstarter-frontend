import {FC} from 'react';
import {Helmet} from 'react-helmet-async';

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
        {/* <meta name="theme-color" content="#000000" />
        <meta name="description" content={description} /> */}
        <title>{TITLE}</title>
      </Helmet>
    </>
  );
};
