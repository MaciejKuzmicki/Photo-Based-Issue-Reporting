import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {useNavigate} from "react-router-dom";

function CustomNavbar() {
    const navigate = useNavigate();
    const handleLogout = () =>  {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('id');
        navigate('/');
    }

    return (
        <Navbar className="bg-body-tertiary justify-content-between">
            <Form inline>
            </Form>
            <Form onSubmit={handleLogout} style={{ paddingRight: '10px'}} inline>
                <Button type="submit">Logout</Button>
            </Form>
        </Navbar>
    );
}

export default CustomNavbar;