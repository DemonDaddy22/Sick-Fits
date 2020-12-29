import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($email: String!, $name: String!, $password: String!) {
        signup(email: $email, name: $name, password: $password) {
            id
            email
            name
        }
    } 
`;

export default class SignUp extends React.Component {

    state = {
        name: '',
        email: '',
        password: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    render = () => <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => <Form method='POST' onSubmit={async e => {
            e.preventDefault();
            // TODO - add catch block to show meaningful error message
            await signup();
            this.setState({ name: '', email: '', password: '' });
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign up for an account</h2>
                <Error error={error} />
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' name='email' placeholder='Your email' value={this.state.email} onChange={this.handleChange} />
                <label htmlFor='name'>Name</label>
                <input id='name' type='text' name='name' placeholder='Your name' value={this.state.name} onChange={this.handleChange} />
                <label htmlFor='password'>Password</label>
                <input id='password' type='password' name='password' placeholder='Your password' value={this.state.password} onChange={this.handleChange} />
                <button type='submit'>Sign Up</button>
            </fieldset>
        </Form>}
    </Mutation>;
}