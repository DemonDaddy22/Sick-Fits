import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import { ApolloConsumer } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import SignUp, { SIGNUP_MUTATION } from '../components/SignUp';
import { CURRENT_USER_QUERY } from '../components/User';
import { fakeUser } from '../lib/testUtils';

const currentUser = fakeUser();
const mocks = [{
    request: {
        query: SIGNUP_MUTATION,
        variables: {
            name: currentUser.name,
            email: currentUser.email,
            password: 'foobar'
        }
    },
    result: {
        data: {
            signup: {
                id: 'foo123',
                email: currentUser.email,
                name: currentUser.name,
                __typename: 'User',
            }
        }
    }
},
{
    request: { query: CURRENT_USER_QUERY },
    result: { data: { currentUser } }
}];

const type = (wrapper, name, value) => wrapper.find(`input[name="${name}"]`).simulate('change', { target: { name, value } });

describe('<SignUp />', () => {
    it('renders and matches snapshot', async () => {
        const wrapper = mount(<MockedProvider>
            <SignUp />
        </MockedProvider>);

        expect(toJSON(wrapper.find('form'))).toMatchSnapshot();
    });

    it('calls the mutation', async () => {
        let apolloClient;
        const wrapper = mount(<MockedProvider mocks={mocks}>
            <ApolloConsumer>
                {client => {
                    apolloClient = client;
                    return <SignUp />;
                }}
            </ApolloConsumer>
        </MockedProvider>);

        await wait();
        wrapper.update();

        type(wrapper, 'name', currentUser.name);
        type(wrapper, 'email', currentUser.email);
        type(wrapper, 'password', 'foo123');

        wrapper.update();
        wrapper.find('form').simulate('submit');
        await wait();

        const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
        expect(user.data.currentUser).toMatchObject(currentUser);
    });
});