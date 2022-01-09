import './Home.css';


//useContext Hook
import { useAuthContext } from "../../hooks/useAuthContext";

//useCollection Hook
import { useCollection } from '../../hooks/useCollection';

//Transaction Form Component
import { TransactionForm } from './TransactionForm';
import { TranasctionList } from './TranasctionList';

//Loader
import loader from '../../assets/svg-loaders/grid.svg';


//useThemeContext Hook
import { useThemeContext } from "../../hooks/useThemeContext";

export const Home = () => {
    const {user} = useAuthContext();
    const {transactions, error} = useCollection(
        'transactions',
        ["userId", "==", user.uid],
        ["createdAt", "desc"]
        );

    //Mode
    const {mode} = useThemeContext();
    let modeClassString = mode === 'dark' ? 'dark' : '';

    return (
        <div className='container'>
            <div className='content'>
                {error && <p>{error}</p>}
                {!error && !transactions && 
                <div className='image-container'>
                <img
                    src={loader}
                    style={{marginTop: '5em'}}
                    alt='loader'
                />
                </div>}
                {transactions && <TranasctionList modeClassString={modeClassString} transactions={transactions}/>}
            </div>
            <div className={`sidebar ${modeClassString}`}>
                <TransactionForm user={user}/>
            </div>
        </div>
    )
}
