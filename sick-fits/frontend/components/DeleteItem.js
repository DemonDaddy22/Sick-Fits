import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { ALL_ITEMS_QUERY } from '../pages/shop';
export const DELETE_ITEM_MUTATION = gql`
    mutation DELETE_ITEM_MUTATION($id: ID!) {
        deleteItem(where: { id: $id }) {
            id
        }
    }
`;

export default class DeleteItem extends React.Component {

    handleClick = (e, deleteItem) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteItem().catch(err => alert(err.message));
        }
    }

    handleUpdate = (cache, payload) => {
        // manually update the cache so that it matches the server
        // read the cache for the items we want
        const data = cache.readQuery({ query: ALL_ITEMS_QUERY });

        // filter the deleted item out of the page
        data.items = data.items.filter(item => item.id !== payload.data.deleteItem.id);

        // put the remaining items back in cache
        cache.writeQuery({ query: ALL_ITEMS_QUERY, data });

    }

    render = () => {

        return <Mutation mutation={DELETE_ITEM_MUTATION} variables={{ id: this.props.id }}
            update={this.handleUpdate}>
            {(deleteItem, { error }) => <button onClick={e => this.handleClick(e, deleteItem)}>
                {this.props.children}
            </button>}
        </Mutation>;
    }
}