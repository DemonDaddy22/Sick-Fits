import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import formatMoney from '../lib/formatMoney';
import RemoveCartItem from './RemoveCartItem';

const CartItemStyles = styled.li`
    padding: 1rem 0;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
    display: grid;
    align-items: center;
    grid-template-columns: auto 1fr auto;

    img {
        margin-right: 1rem;
    }

    h3, p {
        margin: 0;
    }
`;

const CartItem = ({ item }) => <CartItemStyles>
    <img src={item.item.image} alt={item.item.title} width='100' />
    <div className='cart-item-details'>
        <h3>{item.item.title}</h3>
        <p>
            {formatMoney(item.item.price * item.quantity)}
            {' - '}
            <em>
                {item.quantity} &times; {formatMoney(item.item.price)} each
            </em>
        </p>
    </div>
    <RemoveCartItem id={item.id} />
</CartItemStyles>;

CartItem.propTypes = {
    item: PropTypes.object.isRequired
}

export default CartItem;