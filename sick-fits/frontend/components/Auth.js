import { Query } from 'react-apollo';
import styled from 'styled-components';
import SignIn from './Signin';
import { CURRENT_USER_QUERY } from './User';

const TextCenter = styled.p`
    text-align: center;
`;

const Auth = props => <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => loading ? <TextCenter>Loading...</TextCenter> :
        !data.currentUser ? <>
            <TextCenter>Please sign in to continue</TextCenter>
            <SignIn />
        </> :
            props.children
    }
</Query>;

export default Auth;