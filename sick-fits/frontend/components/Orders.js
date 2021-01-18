import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import { formatDistance } from 'date-fns';
import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import Error from './ErrorMessage';
import getTotalQuantity from '../lib/getTotalQuantity';

export const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
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

const OrderGrid = styled.div`
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

export default class Order extends React.Component {

    render = () => <Query query={USER_ORDERS_QUERY}>
        {({ data: { orders }, loading, error }) => error ?
            <Error error={error} /> :
            loading ?
                <p>Loading...</p> :
                <>
                    <h2>You have {orders.length} order{orders.length === 1 ? '' : 's'}</h2>
                    <OrderGrid>
                        {orders.map(order => <OrderItemStyles key={order.id}>
                            <Link href={{ pathname: '/order', query: { id: order.id } }}>
                                <a>
                                    <div className="order-meta">
                                        <p>{getTotalQuantity(order.items)} item{getTotalQuantity(order.items) === 1 ? '' : 's'}</p>
                                        <p>{formatMoney(order.total)}</p>
                                        <p>{formatDistance(order.createdAt, new Date())}</p>
                                    </div>
                                    <div className="images">
                                        {order.items.map(orderItem => <img key={orderItem.id} src={orderItem.image} alt={orderItem.title} />)}
                                    </div>
                                </a>
                            </Link>
                        </OrderItemStyles>)}
                    </OrderGrid>
                </>
        }
    </Query>;
}