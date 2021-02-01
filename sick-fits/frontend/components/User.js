import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

export const CURRENT_USER_QUERY = gql`
    query CURRENT_USER_QUERY {
        currentUser {
            id
            email
            name
            permissions
            orders {
                id
            }
            cart {
                id
                quantity
                item {
                    id
                    title
                    description
                    price
                    image
                }
            }
        }
    }
`;

const User = props => <Query query={CURRENT_USER_QUERY} {...props}>
    {payload => props.children(payload)}
</Query>

User.propTypes = {
    children: PropTypes.func.isRequired
}

export default User;