import { shallow } from 'enzyme';
import ItemComponent from '../components/Item';
import toJSON from 'enzyme-to-json';

const fakeItem = {
    id: 'foo123',
    title: 'Foobar',
    description: 'This is foobar',
    price: 2000,
    image: 'foo.jpg',
    largeImage: 'bar.jpg'
};

describe('<Item />', () => {
    it('should render item and take snapshot', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        expect(toJSON(wrapper)).toMatchSnapshot();
    });
});

/*
describe('<Item />', () => {
    it('should render title and price tag correctly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        // console.log(wrapper.debug());
        const PriceTag = wrapper.find('PriceTag');
        expect(PriceTag.dive().text()).toBe('$20');
        expect(wrapper.find('Title a').text()).toBe(fakeItem.title);
    });

    it('should render image correctly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        const img = wrapper.find('img');
        expect(img.props().src).toBe(fakeItem.image);
        expect(img.props().alt).toBe(fakeItem.title);
    });

    it('should render buttons correctly', () => {
        const wrapper = shallow(<ItemComponent item={fakeItem} />);
        const buttonList = wrapper.find('.buttonList');
        expect(buttonList.children()).toHaveLength(3);
        // console.log(buttonList.debug());
        expect(buttonList.find('Link')).toBeTruthy();
        expect(buttonList.find('AddToCart')).toBeTruthy();
        expect(buttonList.find('DeleteItem').exists()).toBe(true);
    })
});
*/