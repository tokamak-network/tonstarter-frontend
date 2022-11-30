import {FC, HTMLAttributes} from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
  classes?: string;
}
export const DAO: React.FC<HomeProps> = (props) => {
  //TEST
  return <div>DAO</div>;
};
