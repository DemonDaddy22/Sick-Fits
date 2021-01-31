import { mount } from 'enzyme';
import Router from 'next/router';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Pagination, { PAGINATION_QUERY } from '../components/Pagination';
import { MockedProvider } from 'react-apollo/test-utils';

Router.router = {
    push: () => { },
    prefetch: () => { },
};

const makeMocksFor = length => [
    {
        request: { query: PAGINATION_QUERY },
        result: {
            data: {
                itemsConnection: {
                    __typename: 'aggregate',
                    aggregate: {
                        __typename: 'count',
                        count: length
                    }
                }
            }
        }
    }
];

describe('<Pagination />', () => {

    it('renders loading', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(1)}>
            <Pagination page={1} />
        </MockedProvider>);
        // console.log(wrapper.debug());
        expect(wrapper.text()).toContain('Loading');
    });

    it('renders pagination for 18 items', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <Pagination page={1} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        const pagination = wrapper.find('[data-test="pagination"]');
        expect(toJSON(pagination)).toMatchSnapshot();
        expect(wrapper.find('.totalPages').text()).toEqual('5');
    });

    it('disables prev button on first page', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <Pagination page={1} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(true);
    });

    it('disables next button on last page', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <Pagination page={5} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(wrapper.find('a.next').prop('aria-disabled')).toEqual(true);
    });

    it('enables all buttons on middle page', async () => {
        const wrapper = mount(<MockedProvider mocks={makeMocksFor(18)}>
            <Pagination page={3} />
        </MockedProvider>);

        await wait();
        wrapper.update();
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
        expect(wrapper.find('a.prev').prop('aria-disabled')).toEqual(false);
    });
});