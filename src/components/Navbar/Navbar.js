import './Navbar.css';

//React Router imports
import {Link} from 'react-router-dom';

//useLogout Hook
import {useLogOut} from '../../hooks/useLogOut';

//AuthContext hook
import { useAuthContext } from '../../hooks/useAuthContext';
import { useThemeContext } from '../../hooks/useThemeContext';

//Toggle Buttons
import toggleOn from '../../assets/toggle_on.svg';
import toggleOff from '../../assets/toggle_off.svg';


export const Navbar = () => {

    const {user} = useAuthContext();
    const {mode, changeMode} = useThemeContext();
    let modeClassString = mode === 'dark' ? 'dark' : '';
    const {logout, error, isPending} = useLogOut();
    return (
        <nav className={`navbar ${modeClassString}`}>
            <ul>
                <li className='title'>
                    Finance Tracker
                </li>

            {!user && 
            <>
                <li>
                    <Link to="/login">Login</Link>
                </li>

                <li>
                    <Link to="/signup">Signup</Link>
                </li>
            </>}
            
            {user &&
            <>
                <li style={{marginRight: '2em'}}>
                    Hello, {user.displayName}!
                </li>
                <li>
                    <button className={`btn ${modeClassString}`}onClick={() => logout()}>Logout</button>
                </li>
               
            </>
             }

            <img 
                src={mode === 'dark' ? toggleOn : toggleOff}
                alt='Dark Mode Toggle'
                onClick={() => changeMode()}
                style={{filter: mode === 'dark' ? 'invert(100%)': 'invert(20%)'}}
            />

            </ul>
        </nav>
    )
}
