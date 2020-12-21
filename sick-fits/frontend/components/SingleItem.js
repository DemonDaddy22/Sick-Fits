import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
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
                        <p>Single Item {this.props.id}</p>}
        </Query>;
    }
}