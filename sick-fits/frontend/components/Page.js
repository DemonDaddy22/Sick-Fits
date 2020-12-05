import React from 'react';
import Header from './Header';
import Meta from './Meta';
import styled, { ThemeProvider, injectGlobal } from 'styled-components';

const theme = {
    primary: '#ff0000',
    black: '#000',
    dark: '#272727',
    grey: '#3f3f3f',
    lightgrey: '#e0e0e0',
    offwhite: '#ececec',
    white: '#fff',
    maxWidth: '1000px',
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