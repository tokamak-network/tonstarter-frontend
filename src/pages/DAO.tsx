import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const DAO: React.FC<HomeProps> = props => {
    return (
        <div>
            DAO
        </div>
    );

}