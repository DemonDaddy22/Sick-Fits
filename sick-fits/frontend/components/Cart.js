import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem';
import getTotalQuantity from '../lib/getTotalQuantity';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';

export const LOCAL_STATE_QUERY = gql`
    query {
        cartOpen @client
    }
`;

export const TOGGLE_CART_MUTATION = gql`
    mutation {
        toggleCart @client
    }
`;

const Cart = () => <User>
    {({ data: { currentUser } }) => !currentUser ? null : <Mutation mutation={TOGGLE_CART_MUTATION}>
        {toggleCart => <Query query={LOCAL_STATE_QUERY}>
            {({ data }) => {
                const totalQuantity = getTotalQuantity(currentUser.cart);

                return <CartStyles open={data.cartOpen}>
                    <header>
                        <CloseButton onClick={toggleCart} title='Close'>&times;</CloseButton>
                        <Supreme>Your Cart</Supreme>
                        <p>You have {totalQuantity} item{totalQuantity === 1 ? '' : 's'} in your cart</p>
                    </header>
                    <ul>
                        {currentUser.cart.map(item => <CartItem key={item.id} item={item}></CartItem>)}
                    </ul>
                    <footer>
                        <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
                        <SickButton>Checkout</SickButton>
                    </footer>
                </CartStyles>
            }}
        </Query>
        }
    </Mutation>
    }
</User>;

export default Cart;