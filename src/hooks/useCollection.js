//React Imports
import {useEffect, useState, useRef} from 'react';

//Firestore db object
import { db } from "../firebase/config"

export const useCollection = (collectionName, _query, _orderBy) => {

    const [transactions, setTransactions] = useState(null);
    const [error, setError] = useState(null);

    //To avoid an infinite loop of useEffect because _query is passed as an array which is a reference type. 
    const query = useRef(_query).current;  
    const orderBy = useRef(_orderBy).current;    
    useEffect(() => {
        let collectionReference = db.collection(collectionName);
        if(query){
            collectionReference = collectionReference.where(...query);
        }

        if(orderBy){
            collectionReference = collectionReference.orderBy(...orderBy);
        }
        const unsub = collectionReference.onSnapshot(snapshot => {
            let docArray = [];
            snapshot.docs.forEach(doc => {
                docArray.push({...doc.data(), id: doc.id});
            })
            setTransactions(docArray);
            setError(null);
        }, error => {
            console.log(error);
            setError("Could not fetch the data!");
        })


        //Cleanup
        return () => {
            unsub();
        }
    }, [collectionName, query, orderBy])

    return {transactions, error}
}
