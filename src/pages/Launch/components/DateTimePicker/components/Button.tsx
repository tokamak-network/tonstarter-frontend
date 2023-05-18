import React from 'react';

type ButtonProps = {
  onClick?: () => void;
  className: string;
  text: string;
};

export const Button: React.FC<ButtonProps> = ({ className, text, onClick }) => {
  return (
    <div className={className} onClick={onClick}>
      {text}
    </div>
  );
};
