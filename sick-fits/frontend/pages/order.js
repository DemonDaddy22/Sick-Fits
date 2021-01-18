import Auth from '../components/Auth';
import Order from '../components/Order';

const OrderPage = props => <Auth>
    <Order id={props.query.id} />
</Auth>;

export default OrderPage;