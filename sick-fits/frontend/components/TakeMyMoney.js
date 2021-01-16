import React from 'react';
import PropTypes from 'prop-types';
import StripeCheckout from 'react-stripe-checkout';
import Router from 'react-router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import NProgress from 'nprogress';
import calcTotalPrice from '../lib/calcTotalPrice';
import User, { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

export default class TakeMyMoney extends React.Component {

    render = () => <User>
        {({ data: { currentUser } }) => <p>Checkout</p>}
    </User>
}