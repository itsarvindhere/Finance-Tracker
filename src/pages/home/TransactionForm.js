//React Imports
import { useState, useEffect} from "react"

//useFirestore Hook
import { useFirestore } from "../../hooks/useFirestore";


export const TransactionForm = ({user}) => {

    const [transactionName, setTransactionName] = useState('');
    const [transactionAmount, setTransactionAmount] = useState('');
    const {addTransaction, response} = useFirestore('transactions');
    const handleSubmit = (e) => {
        e.preventDefault();
        addTransaction({transactionName, transactionAmount, userId: user.uid});
    }


    //Reset the form if transaction is added
    useEffect(() => {
        if(response.isSuccess){
            setTransactionName('');
            setTransactionAmount('');
        }
    }, [response.isSuccess])
    
    return (
        <>
            <h3>Add a Transaction</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <span>Transaction Name :</span>
                    <input 
                        type="text"
                        value={transactionName}
                        onChange={(e) => setTransactionName(e.target.value)}
                        required
                    />
                </label>

                <label>
                    <span>Transaction Amount ($) :</span>
                    <input 
                        type="number"
                        value={transactionAmount}
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        required
                    />
                </label>
                <button>Add Transaction</button>
            </form>
        </>
    )
}
