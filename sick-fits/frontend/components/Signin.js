import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const SIGNIN_MUTATION = gql`
    mutation SIGNIN_MUTATION($email: String!, $password: String!) {
        signin(email: $email, password: $password) {
            id
            email
            name
        }
    } 
`;

export default class SignIn extends React.Component {

    state = {
        name: '',
        email: '',
        password: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    render = () => <Mutation mutation={SIGNIN_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => <Form method='POST' onSubmit={async e => {
            e.preventDefault();
            // TODO - add catch block to show meaningful error message
            await signup();
            this.setState({ name: '', email: '', password: '' });
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign into your account</h2>
                <Error error={error} />
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' name='email' placeholder='Your email' value={this.state.email} onChange={this.handleChange} />
                <label htmlFor='password'>Password</label>
                <input id='password' type='password' name='password' placeholder='Your password' value={this.state.password} onChange={this.handleChange} />
                <button type='submit'>Sign In</button>
            </fieldset>
        </Form>}
    </Mutation>;
}