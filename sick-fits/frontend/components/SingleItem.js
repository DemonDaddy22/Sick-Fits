import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Head from 'next/head';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

const SingleItemStyles = styled.div`
    min-height: 800px;
    max-width: 1200px;
    margin: 2rem auto;
    box-shadow: ${props => props.theme.bs};
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
    .details {
        margin: 3rem;
        font-size: 2rem;
    }
`;

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
            largeImage
        }
    }
`;

export default class SingleItem extends React.Component {

    render = () => {

        return <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
            {({ error, loading, data }) => error ? <Error error={error} /> :
                loading ? <Error>Loading...</Error> :
                    !data.item ? <p>No item found for id {this.props.id}</p> :
                        <SingleItemStyles>
                            <Head>
                                <title>Sick Fits | {data.item.title}</title>
                            </Head>
                            <img src={data.item.largeImage} alt={data.item.title} />
                            <div className="details">
                                <h2>{data.item.title}</h2>
                                <h3>{formatMoney(data.item.price)}</h3>
                                <p>{data.item.description}</p>
                            </div>
                        </SingleItemStyles>}
        </Query>;
    }
}