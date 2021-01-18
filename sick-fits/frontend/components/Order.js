import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { format } from 'date-fns';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import getTotalQuantity from '../lib/getTotalQuantity';

export const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id
            total
            charge
            createdAt
            user { id }
            items {
                id
                title
                image
                price
                quantity
            }
        }
    }
`;

export default class Order extends React.Component {

    render = () => {

        return <Query query={SINGLE_ORDER_QUERY} variables={{ id: this.props.id }}>
            {({ error, loading, data: { order } }) => error ?
                <Error error={error} /> :
                loading ? <p>Loading...</p> :
                    <OrderStyles>
                        <Head>
                            <title>Sick Fits - Order {order.id}</title>
                        </Head>
                        <p>
                            <span>Order ID:</span>
                            <span>{order.id}</span>
                        </p>
                        <p>
                            <span>Charge:</span>
                            <span>{order.charge}</span>
                        </p>
                        <p>
                            <span>Date:</span>
                            <span>{format(order.createdAt, 'dd MMMM, YYYY')}</span>
                        </p>
                        <p>
                            <span>Total:</span>
                            <span>{formatMoney(order.total)}</span>
                        </p>
                        <p>
                            <span>Quantity:</span>
                            <span>{getTotalQuantity(order.items)}</span>
                        </p>
                        <div className="item">
                            {order.items.map(item => <div className="order-item" key={item.id}>
                                <img src={item.image} alt={item.title} />
                                <div className="item-details">
                                    <h3>{item.title}</h3>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price (per unit): {formatMoney(item.price)}</p>
                                    <p>SubTotal: {formatMoney(item.price * item.quantity)}</p>
                                </div>
                            </div>)}
                        </div>
                    </OrderStyles>
            }
        </Query>;
    }
}

Order.propTypes = {
    id: PropTypes.string.isRequired
}