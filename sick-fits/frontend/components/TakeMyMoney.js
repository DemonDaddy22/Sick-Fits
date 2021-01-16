import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'react-router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NProgress from 'nprogress';
import User, { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';
import calcTotalPrice from '../lib/calcTotalPrice';
import getTotalQuantity from '../lib/getTotalQuantity';

const CREATE_ORDER_MUTATION = gql`
    mutation createOrder($token: String!) {
        createOrder(token: $token) {
            id
            charge
            total
            items {
                id
                title
            }
        }
    }
`;

export default class TakeMyMoney extends React.Component {

    handleToken = (res, createOrder) => createOrder({
        variables: { token: res.id }
    }).catch(err => alert(err.message));

    render = () => <User>
        {({ data: { currentUser } }) => <Mutation mutation={CREATE_ORDER_MUTATION} refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
            {createOrder => <StripeCheckout
                name='Sick Fits'
                description={`Order amount for ${getTotalQuantity(currentUser.cart)} items`}
                amount={calcTotalPrice(currentUser.cart)}
                image={currentUser.cart[0].item && currentUser.cart[0].item.image}
                stripeKey='pk_test_51IAIipHVnSSMv3AouTTyN90NDLoe81HlkSvCafuYjLSbXoHSdAcoFviAnJXhQBntygxHdq4VQ2w7roVgX2pHxbIT002mpNfOhn'
                currency='USD'
                email={currentUser.email}
                token={res => this.handleToken(res, createOrder)}
            >
                {this.props.children}
            </StripeCheckout>}
        </Mutation>}
    </User>
}