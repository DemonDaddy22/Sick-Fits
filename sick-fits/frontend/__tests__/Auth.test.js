import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import wait from 'waait';
import Auth from '../components/Auth';
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

describe('<Auth />', () => {
    it('renders the sign in page to logged out users', async () => {
        const wrapper = mount(<MockedProvider mocks={notSignedInMocks}>
            <Auth />
        </MockedProvider>);
        await wait();
        wrapper.update();
        // console.log(wrapper.debug());
        expect(wrapper.text()).toContain('Please sign in to continue');
        const Signin = wrapper.find('SignIn');
        expect(Signin.exists()).toBe(true);
    });

    it('renders the child components when the user is signed in', async () => {
        const Child = () => <p>Child Component</p>;
        const wrapper = mount(<MockedProvider mocks={signedInMocks}>
            <Auth><Child /></Auth>
        </MockedProvider>);
        await wait();
        wrapper.update();
        // console.log(wrapper.debug());
        expect(wrapper.contains(<Child />)).toBe(true);
    });
});