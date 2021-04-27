import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const PowerTON: React.FC<HomeProps> = props => {
    return (
        <div>
            PowerTON
        </div>
    );

}