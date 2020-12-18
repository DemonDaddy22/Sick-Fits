import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';

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
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({ [name]: val });
    }

    render = () => {
        const { title, description, image, largeImage, price } = this.state;

        return <Form>
            <fieldset>
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
        </Form>;
    }
}