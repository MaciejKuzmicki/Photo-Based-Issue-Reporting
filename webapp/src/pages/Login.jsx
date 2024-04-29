import {useState} from "react";
import {AuthService} from "../services/Auth";
import {useNavigate} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const response = await AuthService.login({ email, password });
        if (response) {
            localStorage.setItem('jwtToken', response.token);
            localStorage.setItem('id', response.id);
            navigate('/mainpage');
        } else {
            console.log('Login Failed');
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <form onSubmit={handleLogin} className="card" style={{ width: 'auto', maxWidth: '500px' }}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <img src="https://res.cloudinary.com/dxmsosoui/image/upload/v1711144136/lxyglrxfoubhx5v9jfiv.webp" alt="Custom" style={{width: '200px'}} className="mb-3" />
                    <h1 className="card-title mb-3">Enter your data</h1>
                    <input
                        className="form-control mb-2"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        className="form-control mb-3"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary">Login</button>
                </div>
            </form>
        </div>
    );
}

export default Login;
