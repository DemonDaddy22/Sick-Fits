import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import RequestReset, { REQUEST_RESET_MUTATION } from '../components/RequestReset';
import { MockedProvider } from 'react-apollo/test-utils';

const mocks = [
    {
        request: { query: REQUEST_RESET_MUTATION, variables: { email: 'foo@bar.com' } },
        result: { data: { requestReset: { message: 'success', __typename: 'Message' } } }
    }
];

describe('<RequestReset />', () => {
    it('renders and matches snapshot', () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <RequestReset />
        </MockedProvider>);

        const form = wrapper.find('[data-test="form"]');
        // console.log(form.debug());
        expect(toJSON(form)).toMatchSnapshot();
    });

    it('calls the mutation', async () => {
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <RequestReset />
        </MockedProvider>);

        wrapper.find('input').simulate('change', { target: { name: 'email', value: 'foo@bar.com' } });
        wrapper.find('form').simulate('submit');
        await wait();
        wrapper.update();
        expect(wrapper.find('p').text()).toContain('Success!');
    });
});