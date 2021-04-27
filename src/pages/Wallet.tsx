import { FC, HTMLAttributes } from 'react';
export interface HomeProps extends HTMLAttributes<HTMLDivElement> {
    classes?: string;
}
export const Wallet: React.FC<HomeProps> = props => {
    return (
        <div>
            Wallet
        </div>
    );

}