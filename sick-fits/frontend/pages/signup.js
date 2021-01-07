import styled from 'styled-components';
import SignUp from "../components/SignUp";
import SignIn from "../components/Signin";
import RequestReset from '../components/RequestReset';

const Columns = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.25rem;
`;

const Signup = props => <Columns>
    <SignUp />
    <SignIn />
    <RequestReset />
</Columns>

export default Signup;