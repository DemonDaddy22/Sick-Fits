import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import Router from 'next/router';
import Downshift, { resetIdCounter } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

export const SEARCH_ITEMS_QUERY = gql`
    query SEARCH_ITEMS_QUERY($searchTerm: String!) {
        items(where: {
            OR: [
                { title_contains: $searchTerm },
                { description_contains: $searchTerm }
            ]
        }) {
            id
            title
            image
        }
    }
`;

export default class AutoComplete extends React.Component {

    state = {
        items: [],
        loading: false
    }

    handleChange = debounce(async (e, client) => {
        this.setState({ loading: true });
        const res = await client.query({
            query: SEARCH_ITEMS_QUERY,
            variables: { searchTerm: e.target.value }
        });
        this.setState({ loading: false, items: res.data.items });
    }, 350);

    routeToItem = item => Router.push({
        pathname: '/item',
        query: { id: item.id }
    });

    render = () => {
        resetIdCounter();
        
        return <SearchStyles>
            <Downshift onChange={this.routeToItem} itemToString={item => !item ? '' : item.title}>
                {({ getInputProps, getItemProps, isOpen, inputValue, highlightedIndex }) => <div>
                    <ApolloConsumer>
                        {client => <input {...getInputProps({
                            type: 'search',
                            placeholder: 'Search for an item',
                            id: 'search',
                            className: this.state.loading ? 'loading' : '',
                            onChange: e => {
                                e.persist();
                                this.handleChange(e, client);
                            }
                        })} />}
                    </ApolloConsumer>
                    {isOpen && <DropDown>
                        {this.state.items.map((item, index) => <DropDownItem key={item.id} {...getItemProps({ item })} highlighted={index === highlightedIndex}>
                            <img width='50' src={item.image} alt={item.title} />
                            {item.title}
                        </DropDownItem>)}
                        {!this.state.loading && !this.state.items.length && <DropDownItem>No results found for {inputValue}</DropDownItem>}
                    </DropDown>}
                </div>}
            </Downshift>
        </SearchStyles>;
    }
}