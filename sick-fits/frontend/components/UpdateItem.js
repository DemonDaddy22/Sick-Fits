import React from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const SINGLE_ITEM_QUERY = gql`
    query SINGLE_ITEM_QUERY($id: ID!) {
        item(where: { id: $id }) {
            id
            title
            description
            price
        }
    }
`;

export const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
        $id: ID!
        $title: String
        $description: String
        $price: Int
    ) {
        updateItem(
            id: $id,
            title: $title
            description: $description
            price: $price
        ) {
            id
            title
            description
            price
        }
    }
`;

export default class UpdateItem extends React.Component {

    state = {}

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' && val ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    handleSubmit = async (e, updateItem) => {
        e.preventDefault();
        const res = await updateItem({
            variables: {
                id: this.props.id,
                ...this.state
            }
        });
    }

    render = () => <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading }) => loading ? <p>Loading...</p> :
            !data.item ? <p>No Item Found for ID {this.props.id}</p> :
                <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
                    {(updateItem, { loading, error }) => <Form onSubmit={e => this.handleSubmit(e, updateItem)}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor='title'>Title</label>
                            <input type='text' id='title' name='title' placeholder='Enter a Title'
                                defaultValue={data.item.title} onChange={this.handleChange} required />
                            <label htmlFor='price'>Price</label>
                            <input type='number' id='price' name='price' placeholder='Enter a Price'
                                defaultValue={data.item.price} onChange={this.handleChange} required />
                            <label htmlFor='description'>Description</label>
                            <textarea id='description' name='description' placeholder='Enter a Description'
                                defaultValue={data.item.description} onChange={this.handleChange} required />
                            <button type='submit'>Sav{loading ? 'ing' : 'e'} Changes</button>
                        </fieldset>
                    </Form>}
                </Mutation>}
    </Query>;
}