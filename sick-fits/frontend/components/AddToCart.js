import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

export const ADD_TO_CART_MUTATION = gql`
    mutation addToCart($id: ID!) {
        addToCart(id: $id) {
            id
            quantity
        }
    }
`;

export default class AddToCart extends React.Component {

    render = () => {
        const { id } = this.props;

        return <Mutation mutation={ADD_TO_CART_MUTATION} variables={{ id }}>
            {(addToCart) => <button onClick={addToCart}>Add to Cart 🛒</button>}
        </Mutation>;
    }
}