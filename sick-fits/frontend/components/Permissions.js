import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import SickButton from './styles/SickButton';

const PERMISSIONS = Object.freeze({
    ADMIN: 'ADMIN',
    USER: 'USER',
    ITEMCREATE: 'ITEMCREATE',
    ITEMDELETE: 'ITEMDELETE',
    ITEMUPDATE: 'ITEMUPDATE',
    PERMISSIONUPDATE: 'PERMISSIONUPDATE'
});

export const ALL_USERS_QUERY = gql`
    query ALL_USERS_QUERY {
        users {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => <>
        <Error error={error} />
        <h2>Manage Permissions</h2>
        <Table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {Object.keys(PERMISSIONS).map(permission => <th>{PERMISSIONS[permission]}</th>)}
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {data.users.map(user => <User user={user} />)}
            </tbody>
        </Table>
    </>}
</Query>;

class User extends React.Component {

    render = () => {
        const { user } = this.props;

        return <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            {Object.keys(PERMISSIONS).map(permission => <td>
                <label htmlFor={`${user.id}-permission-${PERMISSIONS[permission]}`}></label>
                <input type='checkbox' id={`${user.id}-permission-${PERMISSIONS[permission]}`}></input>
            </td>)}
            <td><SickButton>Update</SickButton></td>
        </tr>;
    }
}

export default Permissions;