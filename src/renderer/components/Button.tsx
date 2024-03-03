import { styled } from 'styled-components';

const ButtonContainer = styled.button`
  background-color: #fff;
  border: 1px solid #000;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  color: #000;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    ${({ disabled }) =>
      !disabled &&
      `
      color: #F5F5F5;
      background: black;
    `}
  }
`;

export default function Button({
  verticalPadding = '0px',
  horizontalPadding = '0px',
  placeholder = '',
  text = '',
  style = {},
  onClick,
}: {
  verticalPadding?: string;
  horizontalPadding?: string;
  placeholder?: string;
  text?: string;
  style?: object;
  onClick: any;
}) {
  return (
    <ButtonContainer
      style={{
        paddingLeft: horizontalPadding,
        paddingRight: horizontalPadding,
        paddingTop: verticalPadding,
        paddingBottom: verticalPadding,
        ...style,
      }}
      placeholder={placeholder}
      onClick={onClick}
    >
      {text}
    </ButtonContainer>
  );
}
