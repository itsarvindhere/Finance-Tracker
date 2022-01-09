//Firestore DB Object
import { useReducer, useEffect, useState } from "react";
import { db , timestamp} from "../firebase/config";


//When firestore sends back a response after we make a add document request, then that response also contains the added document

//We keep all this state in one object because all of this state is related to each other. So that is why we use useReducer to manage this complex related state. 
let initialState = {
    document: null,
    isPending: false,
    error: null,
    isSuccess: false
}


//Reducer function
const fireStoreReducer = (state, action) => {
    switch(action.type){
        case 'IS_PENDING':
            return {
                isPending: true, 
                document: null, 
                error: null,
                isSuccess: false
            }
        case 'DOCUMENT_ADDED':
            return {
                isPending: false, 
                document: action.payload, 
                isSuccess: true, 
                error: null
            }
        case 'DOCUMENT_DELETED':
                return {
                    isPending: false, 
                    document: null, 
                    isSuccess: true, 
                    error: null
            }
        case 'DOCUMENT_UPDATED':
            return {
                isPending: false, 
                document: action.payload, 
                isSuccess: true, 
                error: null
        }
        case 'ERROR':
            return {
                error: action.payload, 
                isPending: false, 
                document: null, 
                isSuccess: 
                false 
            }
        default:
            return state
    }
}


//We accept a collection here so that we can use this hook in other projects too. That's why collection is not hardcoded here

export const useFirestore = (collectionName) => {
     
    const [response, dispatch] = useReducer(fireStoreReducer, initialState);

    //To handle cleanup
    const [isUnmounted, setIsUnmounted] = useState(false);

    //Reference to the collection via the collectionName passed to this hook
    const collectionReference = db.collection(collectionName);

    //Only dispatch if not Unmounted
    const dispatchIfNotUnmounted = (action) => {
        if(!isUnmounted){
            dispatch(action);
        }
    }

    //Add new Transaction
     const addTransaction = async (transaction) => {
        dispatch({type: 'IS_PENDING'});
        try {

            const createdAt = timestamp.fromDate(new Date());
            transaction = {...transaction, createdAt}
            const response = await collectionReference.add(transaction);

            dispatchIfNotUnmounted({type: 'DOCUMENT_ADDED', payload: response})
            
        } catch(error){
            dispatchIfNotUnmounted({type: 'ERROR', payload: error.message})
        }
     }

     //Delete a Transaction
     const deleteTransaction = async (transactionId) => {
        dispatch({type: 'IS_PENDING'});

        try {
            await collectionReference.doc(transactionId).delete();
            dispatchIfNotUnmounted({type: 'DOCUMENT_DELETED'})
        } catch(error){
            dispatchIfNotUnmounted({type: 'ERROR', payload: "Could not Delete!"})
        }
    }

    //Update a Transaction
     const updateTransaction = async (transactionId, data) => {
        dispatch({type: 'IS_PENDING'});
        try {
            const response = await collectionReference.doc(transactionId).update(data);
            dispatchIfNotUnmounted({type: 'DOCUMENT_UPDATED', payload: response})
        } catch(error){
            dispatchIfNotUnmounted({type: 'ERROR', payload: "Could not Update!"})
        }
    }

     useEffect(() => {
         return () => {
             setIsUnmounted(true);
         }
     },[])

     return {response, addTransaction, deleteTransaction, updateTransaction}
}
