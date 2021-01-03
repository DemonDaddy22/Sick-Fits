import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
    mutation SIGN_OUT_MUTATION {
        signout {
            message
        }
    }
`;

const Signout = props => <Mutation mutation={SIGN_OUT_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
    {signout => <button onClick={async () => {
        const { data } = await signout();
        { 'signout' in data && 'message' in data.signout && alert(data.signout.message); }
    }}>Sign Out</button>}
</Mutation>;

export default Signout;