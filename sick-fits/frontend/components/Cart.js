import React from 'react';
import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { adopt } from 'react-adopt';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';
import User from './User';
import CartItem from './CartItem';
import getTotalQuantity from '../lib/getTotalQuantity';
import calcTotalPrice from '../lib/calcTotalPrice';
import formatMoney from '../lib/formatMoney';
import TakeMyMoney from './TakeMyMoney';

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

const Composed = adopt({
    user: ({ render }) => <User>{render}</User>,
    toggleCart: ({ render }) => <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>,
    localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = () => <Composed>
    {({ user, toggleCart, localState }) => {
        if (!user.data.currentUser) return null;

        const totalQuantity = getTotalQuantity(user.data.currentUser.cart);

        return <CartStyles open={localState.data.cartOpen}>
            <header>
                <CloseButton onClick={toggleCart} title='Close'>&times;</CloseButton>
                <Supreme>Your Cart</Supreme>
                <p>You have {totalQuantity} item{totalQuantity === 1 ? '' : 's'} in your cart</p>
            </header>
            <ul>
                {user.data.currentUser.cart.map(item => <CartItem key={item.id} item={item}></CartItem>)}
            </ul>
            <footer>
                <p>{formatMoney(calcTotalPrice(user.data.currentUser.cart))}</p>
                <TakeMyMoney>
                    <SickButton>Checkout</SickButton>
                </TakeMyMoney>
            </footer>
        </CartStyles>
    }}
</Composed>;

export default Cart;