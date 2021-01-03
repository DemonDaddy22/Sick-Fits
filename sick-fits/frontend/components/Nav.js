import Link from 'next/link';
import Signout from './Signout';
import NavStyles from './styles/NavStyles';
import User from './User';

const Nav = () =>
    <User>
        {({ data: { currentUser } }) => <NavStyles>
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
            </>}
            {!currentUser && <Link href='/signup'>
                <a>Sign In</a>
            </Link>}
        </NavStyles>}
    </User>;

export default Nav;