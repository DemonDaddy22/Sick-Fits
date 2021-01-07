import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import Router from 'next/router'
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

export const RESET_MUTATION = gql`
    mutation RESET_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
        resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
            id
            name
            email
        }
    } 
`;

export default class Reset extends React.Component {

    state = {
        password: '',
        confirmPassword: ''
    }

    handleChange = e => this.setState({ [e.target.name]: e.target.value });

    render = () => {
        const { history } = this.props;

        return <Mutation mutation={RESET_MUTATION} variables={{
            resetToken: this.props.resetToken,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
            {(reset, { error, loading }) => <Form method='POST' onSubmit={async e => {
                e.preventDefault();
                await reset();
                this.setState({ password: '', confirmPassword: '' }, () => !error && Router.push('/'));
            }}>
                <fieldset disabled={loading} aria-busy={loading}>
                    <h2>Reset Your Password</h2>
                    <Error error={error} />
                    <label htmlFor='password'>Password</label>
                    <input id='password' type='password' name='password' placeholder='Enter password' value={this.state.password} onChange={this.handleChange} />
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input id='confirmPassword' type='password' name='confirmPassword' placeholder='Confirm password' value={this.state.confirmPassword} onChange={this.handleChange} />
                    <button type='submit'>Reset Password</button>
                </fieldset>
            </Form>}
        </Mutation>;
    }
}

Reset.propTypes = {
    resetToken: PropTypes.string.isRequired,
}