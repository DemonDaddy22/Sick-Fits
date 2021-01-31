import { mount } from 'enzyme';
import Router from 'next/router';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import CreateItem, { CREATE_ITEM_MUTATION } from '../components/CreateItem';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeItem } from '../lib/testUtils';

const fooImage = 'https://foo.com/bar.jpg';

global.fetch = jest.fn().mockResolvedValue({
    json: () => ({
        secure_url: fooImage,
        eager: [{ secure_url: fooImage }]
    })
});

describe('<CreateItem />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);

        const form = wrapper.find('[data-test="createItem"]');
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('uploads a file when changed', async () => {
        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);

        const input = wrapper.find('input[type="file"]');
        input.simulate('change', { target: { files: ['foobar.jpg'] } });
        await wait();
        const component = wrapper.find('CreateItem').instance();
        // console.log(component);
        expect(component.state.image).toEqual(fooImage);
        expect(component.state.largeImage).toEqual(fooImage);
        expect(global.fetch).toHaveBeenCalled();
        global.fetch.mockReset();
    });

    it('handles state updating', async () => {
        const wrapper = mount(<MockedProvider>
            <CreateItem />
        </MockedProvider>);

        wrapper.find('#title').simulate('change', { target: { value: 'Testing', name: 'title' } });
        wrapper.find('#price').simulate('change', { target: { value: 50000, name: 'price', type: 'number' } });
        wrapper.find('#description').simulate('change', { target: { value: 'Testing item creation', name: 'description' } });

        expect(wrapper.find('CreateItem').instance().state).toMatchObject({
            title: 'Testing',
            price: 50000,
            description: 'Testing item creation'
        });
    });

    it('creates an item when the form is submitted', async () => {
        const item = fakeItem();
        const mocks = [{
            request: {
                query: CREATE_ITEM_MUTATION,
                variables: {
                    title: item.title,
                    description: item.description,
                    image: '',
                    largeImage: '',
                    price: item.price
                }
            },
            result: {
                data: {
                    createItem: { ...item, id: 'foobar123', __typename: 'Item' }
                }
            }
        }];

        const wrapper = mount(<MockedProvider mocks={mocks}>
            <CreateItem />
        </MockedProvider>);

        wrapper.find('#title').simulate('change', { target: { value: item.title, name: 'title' } });
        wrapper.find('#price').simulate('change', { target: { value: item.price, name: 'price', type: 'number' } });
        wrapper.find('#description').simulate('change', { target: { value: item.description, name: 'description' } });

        Router.router = { push: jest.fn() };
        wrapper.find('form').simulate('submit');

        await wait(50);
        wrapper.update();

        expect(Router.router.push).toHaveBeenCalled();
        expect(Router.router.push).toHaveBeenCalledWith({
            pathname: '/item',
            query: { id: 'foobar123' }
        });
    });
});