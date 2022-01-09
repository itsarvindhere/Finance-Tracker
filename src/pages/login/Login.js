import './Login.css';

//React Imports
import {useState} from 'react';

//useLogin hook
import {useLogin} from '../../hooks/useLogin';

//Loader
import loader from '../../assets/svg-loaders/three-dots.svg';

//useThemeContext Hook
import { useThemeContext } from "../../hooks/useThemeContext";

export const Login = () => {

    const {login, error, isPending} = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    
    //Mode
    const {mode} = useThemeContext();
    let modeClassString = mode === 'dark' ? 'dark' : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password);
    }

    return (
        <form className={`login-form ${modeClassString}`} onSubmit={handleSubmit}>
            <h2>Login</h2>
            <label>
                <span>Email:</span>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                />
            </label>

            <label>
                <span>Password:</span>
                <input 
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                />
            </label>

            { !isPending && <button className={`btn ${modeClassString}`}>
                Log In
            </button>
            }
            {isPending && <img
            src={loader} 
            alt='loader' 
            style={{ height: '20px', filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
            >
            </img>}
            {error && <p className='error'>{error}</p>}
        </form>
    )
}
