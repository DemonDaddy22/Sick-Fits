import SignUp from "../components/SignUp";
import styled from 'styled-components';

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
`;

const Signup = props => <Columns>
    <SignUp />
    <SignUp />
    <SignUp />
</Columns>

export default Signup;