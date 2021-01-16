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

export default class TakeMyMoney extends React.Component {

    handleToken = res => {
        console.log(res);
    }

    render = () => <User>
        {({ data: { currentUser } }) => <StripeCheckout
            name='Sick Fits'
            description={`Order amount for ${getTotalQuantity(currentUser.cart)} items`}
            amount={calcTotalPrice(currentUser.cart)}
            image={currentUser.cart[0].item && currentUser.cart[0].item.image}
            stripeKey='pk_test_51IAIipHVnSSMv3AouTTyN90NDLoe81HlkSvCafuYjLSbXoHSdAcoFviAnJXhQBntygxHdq4VQ2w7roVgX2pHxbIT002mpNfOhn'
            currency='USD'
            email={currentUser.email}
            token={res => this.handleToken(res)}
        >
            {this.props.children}
        </StripeCheckout>}
    </User>
}