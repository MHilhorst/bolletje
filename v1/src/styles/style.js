import Styled from 'styled-components';

export const HeaderLogo = Styled.div`
    height:64px;
    display:flex;
    align-items:center;
    justify-content:center;
    margin-left:16px;
    margin-right:16px;
    `;

export const LoginContainerBox = Styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    height:100vh;
    background-color:#0069ff;
    width:100%
`;
export const Box = Styled.div`
    background-color:#fff;
    padding:24px;
    border-radius:5px;
    margin-top:24px;
`;

export const LoginBox = Styled(Box)`
    width:450px;
@media (max-width: 768px) {
    width: 100%;
  } 
`;
export const LoginInput = Styled.div`
  margin-top:20px;
`;
export const LoginHeader = Styled.div` 
    display:flex;
    justify-content:center;
    margin-top:40px;
    margin-bottom:20px
`;

export const subText = Styled.text`
    color:#f2f4f5;
    font-size:1rem;
    text-align: ${props => (props.center ? 'center' : 'none')}
`;

export const ModalSwitchItem = Styled.div`
display: flex;
justify-content: space-between;
align-items:center
`;
