import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

export const REQUEST_RESET_MUTATION = gql`
    mutation REQUEST_RESET_MUTATION($email: String!) {
        requestReset(email: $email) {
            message
        }
    } 
`;

export default class RequestReset extends React.Component {

    state = {
        email: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    render = () => <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { error, loading, called }) => <Form data-test='form' method='POST' onSubmit={async e => {
            e.preventDefault();
            await reset();
            this.setState({ email: '' });
        }}>
            <fieldset disabled={loading} aria-busy={loading}>
                <h2>Request to reset your password</h2>
                <Error error={error} />
                {!error && !loading && called && <p>Success! Check your email for a reset link!</p>}
                <label htmlFor='email'>Email</label>
                <input id='email' type='email' name='email' placeholder='Your email' value={this.state.email} onChange={this.handleChange} />
                <button type='submit'>Request Reset</button>
            </fieldset>
        </Form>}
    </Mutation>;
}