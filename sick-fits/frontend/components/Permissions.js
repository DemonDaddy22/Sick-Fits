import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
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

export const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation UPDATE_PERMISSIONS_MUTATION($id: ID!, $permissions: [Permission]) {
        updatePermissions(id: $id, permissions: $permissions) {
            id
            name
            email
            permissions
        }
    }
`;

const Permissions = props => <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => <>
        {loading ? <p>Loading...</p> :
            error ? <Error error={error} /> :
                <>
                    <h2>Manage Permissions</h2>
                    <Table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                {Object.keys(PERMISSIONS).map(permission => <th key={`header-${permission}`}>{PERMISSIONS[permission]}</th>)}
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => <UserPermissionsRow key={user.id} user={user} />)}
                        </tbody>
                    </Table>
                </>}
    </>}
</Query>;

export class UserPermissionsRow extends React.Component {

    state = {
        permissions: this.props.user.permissions
    }

    handlePermissionChange = (e, updatePermissions) => {
        const { checked, value } = e.target;
        let permissions = [...this.state.permissions];

        if (checked) permissions.push(value);
        else permissions = permissions.filter(permission => permission !== value);

        this.setState({ permissions }, updatePermissions);
    }

    render = () => {
        const { user } = this.props;

        return <Mutation mutation={UPDATE_PERMISSIONS_MUTATION} variables={{ id: user.id, permissions: this.state.permissions }}>
            {(updatePermissions, { loading, error }) => <>
                {error && <tr><td colspan={`${3 + Object.keys(PERMISSIONS).length}`}><Error error={error} /></td></tr>}
                <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    {Object.keys(PERMISSIONS).map(permission => <td key={`user-${permission}`}>
                        <label htmlFor={`${user.id}-permission-${PERMISSIONS[permission]}`}>
                            <input type='checkbox' id={`${user.id}-permission-${PERMISSIONS[permission]}`}
                                checked={this.state.permissions.includes(PERMISSIONS[permission])} value={PERMISSIONS[permission]}
                                onChange={this.handlePermissionChange}></input>
                        </label>
                    </td>)}
                    <td>
                        <SickButton type='button' disabled={loading} onClick={e => updatePermissions(e, updatePermissions)}>Updat{loading ? 'ing' : 'e'}</SickButton>
                    </td>
                </tr>
            </>}
        </Mutation>;
    }
}

UserPermissionsRow.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        permissions: PropTypes.array
    }).isRequired
}

export default Permissions;