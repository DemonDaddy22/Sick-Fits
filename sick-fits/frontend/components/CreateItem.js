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

    handleFileUpload = async e => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');
        const res = await fetch('https://api.cloudinary.com/v1_1/yelp-camp/image/upload', {
            method: 'POST',
            body: data
        });
        const file = await res.json();
        this.setState({ image: file.secure_url, largeImage: file.eager[0].secure_url });
    }

    handleSubmit = async (e, createItem) => {
        e.preventDefault();
        const res = await createItem();
        Router.push({
            pathname: '/item',
            query: { id: res.data.createItem.id }
        })
    }

    render = () => {
        const { title, description, price, image } = this.state;

        return <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
            {(createItem, { loading, error }) => <Form onSubmit={e => this.handleSubmit(e, createItem)}>
                <Error error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
                    {/* TODO - make input fields bigger and adjust margins */}
                    <label htmlFor='image'>Image</label>
                    <input accept='image/*' type='file' id='image' name='image' placeholder='Upload an Image'
                        onChange={this.handleFileUpload} required />
                    {image && <img width={200} src={image} alt='Upload Preview' />}
                    <label htmlFor='title'>Title</label>
                    <input type='text' id='title' name='title' placeholder='Enter a Title'
                        value={title} onChange={this.handleChange} required />
                    <label htmlFor='price'>Price</label>
                    <input type='number' id='price' name='price' placeholder='Enter a Price'
                        value={price} onChange={this.handleChange} required />
                    <label htmlFor='description'>Description</label>
                    <textarea id='description' name='description' placeholder='Enter a Description'
                        value={description} onChange={this.handleChange} required />
                    <button type='submit'>Submit</button>
                </fieldset>
            </Form>}
        </Mutation>;
    }
}