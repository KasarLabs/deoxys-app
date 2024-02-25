import React, { CSSProperties } from 'react';
import { styled } from 'styled-components';

const InputContainer = styled.input`
  background: linear-gradient(0deg, #ffffff, #ffffff);
  border: 1px solid #eaeaea;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  height: 40px;
  font-weight: 400;
  font-size: 16px;
  color: black;
  &:focus {
    outline: none;
  }
`;

export default function Input({
  placeholder = '',
  style = {},
  onChange,
  value,
  type = 'text',
}: {
  placeholder?: string;
  style?: CSSProperties;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string | undefined;
  type?: string;
}) {
  return (
    <InputContainer
      value={value}
      style={{
        ...style,
      }}
      placeholder={placeholder}
      onChange={onChange}
      type={type}
    />
  );
}
