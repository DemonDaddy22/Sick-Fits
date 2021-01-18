import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { format } from 'date-fns';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

export default class Order extends React.Component {

    render = () => {

        return <div>
            Order ID {this.props.id}
        </div>;
    }
}

Order.propTypes = {
    id: PropTypes.string.isRequired
}