import Link from 'next/link';
import { Mutation } from 'react-apollo';
import getTotalQuantity from '../lib/getTotalQuantity';
import { TOGGLE_CART_MUTATION } from './Cart';
import CartCount from './CartCount';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () =>
    <User>
        {({ data: { currentUser } }) => <NavStyles data-test='nav'>
            <Link href='/shop'>
                <a>Shop</a>
            </Link>
            {currentUser && <>
                <Link href='/sell'>
                    <a>Sell</a>
                </Link>
                <Link href='/orders'>
                    <a>Orders</a>
                </Link>
                <Link href='/account'>
                    <a>Account</a>
                </Link>
                <Signout></Signout>
                <Mutation mutation={TOGGLE_CART_MUTATION}>
                    {toggleCart => <button onClick={toggleCart}>
                        My Cart
                        <CartCount count={getTotalQuantity(currentUser.cart)} />
                    </button>}
                </Mutation>
            </>}
            {!currentUser && <Link href='/signup'>
                <a>Sign In</a>
            </Link>}
        </NavStyles>}
    </User>;

export default Nav;