import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import Link from 'next/link';
import PaginationStyles from './styles/PaginationStyles';
import { perPage } from '../config';

export const PAGINATION_QUERY = gql`
    query PAGINATION_QUERY {
        itemsConnection {
            aggregate {
                count
            }
        }
    }
`;

const Pagination = props => <Query query={PAGINATION_QUERY}>
    {({ data, loading, error }) => {
        if (loading) return <p>Loading...</p>;
        const count = data.itemsConnection.aggregate.count;
        const pages = Math.ceil(count / perPage);
        const page = props.page < 1 ? 1 : props.page > pages ? pages : props.page;
        return <PaginationStyles>
            <Head>
                <title>Sick Fits | {page} of {pages}</title>
            </Head>
            <Link href={{
                pathname: 'shop',
                query: { page: page - 1 }
            }} prefetch>
                <a className='prev' aria-disabled={page <= 1}>{'<'} Prev</a>
            </Link>
            <p>Page {page} of {pages}</p>
            <Link href={{
                pathname: 'shop',
                query: { page: page + 1 }
            }} prefetch>
                <a className='next' aria-disabled={page >= pages}>Next {'>'}</a>
            </Link>
        </PaginationStyles>
    }}
</Query >;

export default Pagination;