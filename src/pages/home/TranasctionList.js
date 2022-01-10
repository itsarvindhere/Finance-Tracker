//React Imports
import { useState, useRef, useEffect } from 'react';

//Styles
import './Home.css';

//useFirestore Hook to use delete document method
import {useFirestore} from '../../hooks/useFirestore';

//Edit icon
import editIcon from '../../assets/edit.svg';
//loader
import loader from '../../assets/svg-loaders/three-dots.svg'


export const TranasctionList = ({transactions, modeClassString}) => {



    const [showNameInput, setShowNameInput] = useState(false);
    const [showAmountInput, setShowAmountInput] = useState(false);
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [editAmountValue, setEditAmountValue] = useState('');
    const [editNameValue, setEditNameValue] = useState('');

    const {deleteTransaction, updateTransaction, response} = useFirestore('transactions');

    var options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const nameInputRef = useRef();
    const amountInputRef = useRef();

    let date;

    transactions.forEach(transaction => {
        date = transaction.createdAt.toDate().toLocaleDateString("en-US", options);
    })

    const handleUpdate = (name, amount) => {
        updateTransaction(editTransactionId, {
            transactionName: editNameValue ? editNameValue : name,
            transactionAmount:editAmountValue ? editAmountValue : amount
        })
        handleNameCancel();
        handleAmountCancel();
    } 

    const handleShowNameInput = (id,name) => {
        setEditNameValue(name);
        setEditTransactionId(id);
        setShowAmountInput(false);
        setShowNameInput(true);
    }

    const handleShowAmountInput = (id, amount) => {
        setEditAmountValue(amount);
        setEditTransactionId(id);
        setShowAmountInput(true);
        setShowNameInput(false);
    }

    const handleNameCancel = () => {
      setShowNameInput(false);
      setEditTransactionId(null);
    }

    const handleAmountCancel = () => {
        setShowAmountInput(false);
        setEditTransactionId(null);
      }


    useEffect(() => {
        if(response.isSuccess){
            handleNameCancel();
        }
    }, [response])

    return (
        <ul className={`transactions ${modeClassString}`}>
            {transactions.map(transaction => (
                <li key={transaction.id}>
                    <div>
                    <p className='date'>{date}</p>
                    {showNameInput && (editTransactionId === transaction.id) && <div className='edit-container'>
                    <input 
                        className='edit-input'
                        value={editNameValue}onChange={(e) => setEditNameValue(e.target.value)}
                    />
                    {!response.isPending && <div className='buttons-container'>
                    <button className='btn edit-button' onClick={() => handleUpdate(transaction.transactionName,transaction.transactionAmount)}>Update</button>
                    <button className='btn edit-button' onClick={handleNameCancel}>Cancel</button>
                    </div>
                    }
                    {response.isPending && <img 
                        src={loader}
                        style={{
                            width: '20%',
                            margin: '0 auto',
                            filter: modeClassString === 'dark' ? 'invert(100%)' : 'invert(20%)'
                        }}
                    />}
                    </div>
                    }
                    { (!showNameInput || !(transaction.id === editTransactionId)) && <p className='name'>{transaction.transactionName}
                    <img className='edit-icon' src={editIcon} alt='Edit Transaction' 
                    style={{filter: modeClassString === 'dark' ? 'invert(100%)' : 'invert(20%)'}}
                    onClick={() => handleShowNameInput(transaction.id, transaction.transactionName)}
                    />
                    </p>
                    }
                    </div>
                    {showAmountInput && (editTransactionId === transaction.id) && <div className='edit-amount-container'>
                    <input 
                        className='edit-input'
                        value={editAmountValue}
                        onChange={(e) => setEditAmountValue(e.target.value)}
                        type="number"
                    />
                    {!response.isPending && <div className='buttons-container'>
                    <button className='btn edit-button' onClick={() => handleUpdate(transaction.transactionName,transaction.transactionAmount)}>Update</button>
                    <button className='btn edit-button' onClick={handleAmountCancel}>Cancel</button>
                    </div>
                    }
                    {response.isPending && <img 
                        src={loader}
                        style={{
                            width: '20%',
                            margin: '0 auto',
                            filter: modeClassString === 'dark' ? 'invert(100%)' : 'invert(20%)'
                        }}
                    />}
                    </div>
                    }
                    {(!showAmountInput || !(transaction.id === editTransactionId)) && <p className='amount'>${transaction.transactionAmount}
                    <img className='edit-icon' src={editIcon} alt='Edit Transaction' 
                    style={{filter: modeClassString === 'dark' ? 'invert(100%)' : 'invert(20%)'}}
                    onClick={() => handleShowAmountInput(transaction.id, transaction.transactionAmount)}
                    />
                    </p>
                    }
                    <button onClick={() => deleteTransaction(transaction.id)}>x</button>
                </li>
            )
            )}
        </ul>
    )
}
