import Link from 'next/link';
import Router from 'next/router';
import styled from 'styled-components';
import NProgress from 'nprogress';
import Nav from './Nav';
import Cart from './Cart';
import AutoComplete from './Search';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Logo = styled.h1`
    margin: 0;
    z-index: 10;
    font-size: 3rem;
    text-align: center;
    position: relative;
    transform: skew(-7deg);
    a {
        padding: 0.5rem 1rem;
        text-decoration: none;
        text-transform: uppercase;
        color: ${props => props.theme.white};
        background-color: ${props => props.theme.primary};
    }
    @media (min-width: ${props => props.theme.large}) {
        margin-left: 2rem;
        font-size: 4rem;
        text-align: initial;
    }
`;

const StyledHeader = styled.header`
    .bar {
        display: grid;
        align-items: stretch;
        justify-content: center;
        grid-template-columns: 1fr;
        border-bottom: 10px solid ${props => props.theme.dark};
        @media (min-width: ${props => props.theme.large}) {
            justify-content: space-between;
            grid-template-columns: auto 1fr;
        }
    }
    .sub-bar {
        display: grid;
        grid-template-columns: 1fr auto;
        border-bottom: 1px solid ${props => props.theme.lightgrey};
    }
`;

const Header = () => <StyledHeader>
    <div className='bar'>
        <Logo>
            <Link href='/'><a>Sick Fits</a></Link>
        </Logo>
        <Nav></Nav>
    </div>
    <div className='sub-bar'>
        <AutoComplete></AutoComplete>
    </div>
    <Cart />
</StyledHeader>;

export default Header;