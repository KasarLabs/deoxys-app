import { styled } from 'styled-components';

const ButtonContainer = styled.button`
  background-color: #338cf5;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  border: none;

  &:focus {
    outline: none;
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
