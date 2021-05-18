import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Staking: React.FC<HomeProps> = props => {
    return (
        <div>
            Staking
        </div>
    );
}