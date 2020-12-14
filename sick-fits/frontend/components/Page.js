import React from 'react';
import Header from './Header';
import Meta from './Meta';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
    primary: '#ff0000',
    black: '#000',
    dark: '#171717',
    grey: '#3f3f3f',
    lightgrey: '#e0e0e0',
    offwhite: '#ececec',
    white: '#fff',
    maxWidth: '1000px',
    small: '768px',
    medium: '900px',
    large: '1200px',
    extraLarge: '1500px',
    bs: '0 12px 24px 0 rgba(0, 0, 0, 0.1)'
}

const StyledPage = styled.div`
    color: ${props => props.theme.dark};
    background-color: ${props => props.theme.white};
`;

const Inner = styled.div`
    max-width: ${props => props.theme.maxWidth};
    margin: 0 auto;
    padding: 2rem;
`;

injectGlobal`
    @font-face {
        font-family: 'radnika_next';
        src: url('/static/radnikanext-medium-webfont.woff2') format('woff2');
        font-weight: normal;
        font-style: normal;
    }
    html {
        box-sizing: border-box;
        font-size: 10px;
    }
    *, *::before, *::after {
        box-sizing: inherit;
    }
    body {
        margin: 0;
        padding: 0;
        font-size: 1.5rem;
        line-height: 2;
        font-family: 'radnika_next';
    }
    a {
        text-decoration: none;
    }
`;

export default class Page extends React.Component {

    render = () => {

        return <ThemeProvider theme={theme}>
            <StyledPage>
                <Meta></Meta>
                <Header></Header>
                <Inner>{this.props.children}</Inner>
            </StyledPage>
        </ThemeProvider>;
    }
}