import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';
import Pagination from '../components/Pagination';
import { perPage } from '../config';

export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${perPage}) {
        items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
            id
            title
            price
            description
            image
            largeImage
        }
    }
`;

const TextCenter = styled.div`
    text-align: center;
`;

const ItemsList = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin: 0 auto;
    max-width: ${props => props.theme.maxWidth};
`;

export default class Shop extends React.Component {

    render = () => {
        const page = 'query' in this.props ? parseFloat(this.props.query.page || 1) : 1;
        return <TextCenter>
            <Pagination page={page} />
            <Query query={ALL_ITEMS_QUERY} variables={{ skip: page * perPage - perPage }} /*fetchPolicy='network-only' */ >
                {({ data, error, loading }) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    return <ItemsList>
                        {data.items.map(item => <Item key={item.id} item={item}></Item>)}
                    </ItemsList>;
                }}
            </Query>
            <Pagination page={page} />
        </TextCenter>;
    }
}