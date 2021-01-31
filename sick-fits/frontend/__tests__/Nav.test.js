import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Nav from '../components/Nav';
import { CURRENT_USER_QUERY } from '../components/User';
import { MockedProvider } from 'react-apollo/test-utils';
import { fakeUser } from '../lib/testUtils';

const notSignedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { currentUser: null } }
    }
];

const signedInMocks = [
    {
        request: { query: CURRENT_USER_QUERY },
        result: { data: { currentUser: fakeUser() } }
    }
];

describe('<Nav />', () => {

    it('renders a minimal nav when the user is signed out', async () => {
        const wrapper = mount(<MockedProvider mocks={notSignedInMocks}>
            <Nav />
        </MockedProvider>);

        await wait();
        wrapper.update();
        // console.log(wrapper.debug());
        const nav = wrapper.find('[data-test="nav"]');
        expect(toJSON(nav)).toMatchSnapshot();
    });

    it('renders full nav when the user is signed in', async () => {
        const wrapper = mount(<MockedProvider mocks={signedInMocks}>
            <Nav />
        </MockedProvider>);

        await wait();
        wrapper.update();
        // console.log(wrapper.debug());
        const nav = wrapper.find('[data-test="nav"]');
        expect(toJSON(nav)).toMatchSnapshot();
    })
});