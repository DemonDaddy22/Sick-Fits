import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

export const REMOVE_FROM_CART_MUTATION = gql`
    mutation removeFromCart($id: ID!) {
        removeFromCart(id: $id) {
            id
        }
    }
`;

const DeleteButton = styled.button`
    font-size: 3rem;
    background: none;
    border: none;
    outline: none;
    transition: color 0.15s ease;
    &:hover {
        color: ${props => props.theme.primary};
        cursor: pointer;
        outline: none;
    }
`;

const RemoveCartItem = props => <Mutation mutation={REMOVE_FROM_CART_MUTATION} variables={{ id: props.id }}>
    {(removeFromCart, { loading, error }) => <DeleteButton onClick={() => removeFromCart().catch(err => alert(err.message))}
        title='Delete Button' disabled={loading}>&times;</DeleteButton>}
</Mutation>;

RemoveCartItem.propTypes = {
    id: PropTypes.string.isRequired
}

export default RemoveCartItem;