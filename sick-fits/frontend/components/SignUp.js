import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router'
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

export const SIGNUP_MUTATION = gql`
    mutation SIGNUP_MUTATION($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
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

    render = () => <Mutation mutation={SIGNUP_MUTATION} variables={this.state} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signup, { error, loading }) => <Form method='POST' onSubmit={async e => {
            e.preventDefault();
            // TODO - add catch block to show meaningful error message
            await signup();
            this.setState({ name: '', email: '', password: '' }, () => Router.push({
                pathname: '/'
            }));
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