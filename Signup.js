import './Signup.css';

//React Imports
import {useEffect, useState, useRef} from 'react';

//Custom Signup Hook
import { useSignUp } from '../../hooks/useSignUp';

//Loader
import loader from '../../assets/svg-loaders/three-dots.svg';

//useThemeContext Hook
import { useThemeContext } from "../../hooks/useThemeContext";

export const Signup = () => {    
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMismatch, setPasswordMismatch]= useState(false);
    //Custom Sign Up Hook
    const {signUp, error, isPending} = useSignUp();
    
    //Mode
    const {mode} = useThemeContext();
    let modeClassString = mode === 'dark' ? 'dark' : '';

    const handleSubmit = (e) => {
        e.preventDefault();
        signUp(email, password, displayName);
    }


    const confirmRef = useRef();

    useEffect(() => {
        if(password && confirmRef.current.value.length > 0) {
            if(password !== confirmPassword){
                setPasswordMismatch(true)
            } else{
                setPasswordMismatch(false);
            }
        } else {
            setPasswordMismatch(false)
        }
         
    },[password, confirmPassword])

    return (
        <form className={`signup-form ${modeClassString}`} onSubmit={handleSubmit}>
            <h2>Signup</h2>
            <label>
                <span>Display Name:</span>
                <input 
                    type="text"
                    onChange={(e) => setDisplayName(e.target.value.trim())}
                    value={displayName}
                    required
                />
            </label>
            <label>
                <span>Email:</span>
                <input 
                    type="email"
                    onChange={(e) => setEmail(e.target.value.trim())}
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

            <label>
                <span>Confirm Password:</span>
                <input 
                    type="password"
                    ref={confirmRef}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    value={confirmPassword}
                    required
                    disabled={password===''}
                />
              {passwordMismatch &&  <p className='error'>Passwords did not match. Please check again!</p>
               }
            </label>

            { !isPending && <button className={`btn ${modeClassString}`}>
                Sign Up
            </button>
            }
            {isPending && <img
            src={loader} alt='loader' style={{ height: '20px', filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}>
            </img>}
            {error && <p className='error'>{error}</p>}
        </form>
    )
}
