import Auth from '../components/Auth';
import Permissions from '../components/Permissions';

const PermissionsPage = props => <div>
    <Auth>
        <Permissions />
    </Auth>
</div>

export default PermissionsPage;