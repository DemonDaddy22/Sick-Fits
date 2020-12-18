import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import formatMoney from '../lib/formatMoney';

export const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            data: {
                title: $title
                description: $description
                price: $price
                image: $image
                largeImage: $largeImage
            }
        ) {
            id
        }
    }
`;

export default class CreateItem extends React.Component {

    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: 0
    }

    handleChange = e => {
        const { name, type, value } = e.target;
        const val = type === 'number' && val ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    handleSubmit = async (e, createItem) => {
        e.preventDefault();
        const res = await createItem();
        console.log(res);
        Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
        })
    }

    render = () => {
        const { title, description, image, largeImage, price } = this.state;

        return <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
            {(createItem, { loading, error }) => <Form onSubmit={e => this.handleSubmit(e, createItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor='title'>Title</label>
                    <input type='text' id='title' name='title' placeholder='Enter Title'
                        value={title} onChange={this.handleChange} required />
                    <label htmlFor='price'>Price</label>
                    <input type='number' id='price' name='price' placeholder='Enter Price'
                        value={price} onChange={this.handleChange} required />
                    <label htmlFor='description'>Description</label>
                    <textarea id='description' name='description' placeholder='Enter Description'
                        value={description} onChange={this.handleChange} required />
                    <button type='submit'>Submit</button>
                </fieldset>
            </Form>}
        </Mutation>;
    }
}