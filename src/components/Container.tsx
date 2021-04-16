import {FC, HTMLAttributes} from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}

export const Container: FC<ContainerProps> = ({classes, children, ...rest}) => {
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
};
