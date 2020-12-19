import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Item from '../components/Item';

export const ALL_ITEMS_QUERY = gql`
    query ALL_ITEMS_QUERY {
        items {
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

    render = () => <TextCenter>
        <p>Items</p>
        <Query query={ALL_ITEMS_QUERY}>
            {({ data, error, loading }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error: {error.message}</p>;
                return <ItemsList>
                    {data.items.map(item => <Item key={item.id} item={item}></Item>)}
                </ItemsList>;
            }}
        </Query>
    </TextCenter>
}