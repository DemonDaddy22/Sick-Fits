import React from 'react';
import Downshift from 'downshift';
import { ApolloConsumer } from 'react-apollo';
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

    render = () => <SearchStyles>
        <div>
            <ApolloConsumer>
                {client => <input type='search' onChange={e => {
                    e.persist();
                    this.handleChange(e, client);
                }} />}
            </ApolloConsumer>
            <DropDown>
                {this.state.items.map(item => <DropDownItem key={item.id}>
                    <img width='50' src={item.image} alt={item.title} />
                    {item.title}
                </DropDownItem>)}
            </DropDown>
        </div>
    </SearchStyles>;
}