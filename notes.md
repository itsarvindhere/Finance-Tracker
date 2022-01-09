---------------SETTING UP FIREBASE AUTHENTICATION------------

Just like firestore, we first need to set it up on the Firebase console so we have to select what type of authentication we need like email/passowrd, phone, social login etc. 

In our case, we just need email/password so we select that and enable it on the console. And now, in our code, we need to initialize that service jsut like we did with firestore service.

So, in our config file - 


import firebase from 'firebase/app';
import 'firebase/auth';
const auth = firebase.auth();
export {auth};


And now, we can use this 'auth' object to interact with the Authentication service to do things like Log users in, signup, log out etc.


When a sign in or sign up request is made to firesbase auth, then it looks at the credentials of the user. If they match with what are stored, then it will sign in the user andcreate a unique JSON Web Token or JWT for that user. That token is then sent back to the browser along with the user details and we can use that data in our code.

From then on, every request made has that JSON Web Token in it so that firebase can see if user is still authenticated. So we can protect the data in database. Only logged in user will be able to see their data, no one else.

-------HOW TO SIGN UP A USER ---------------

To sign up a user, we can use a method named 'createUserWithEmailAndPassword' that the 'auth' object has. 

So, for example, we can create a separate hook that handles sign up. In that, we can have a method as - 


const signUp = async (email, password, displayName) => {
        setError(null);
        setIsPending(true);
        try {
            const response = await auth.createUserWithEmailAndPassword(email, password);
            
            if(!response){
                throw new Error('We Could not complete your Sign Up. Please Try Again after some time!');
            }

            //Add user's displayname
            await response.user.updateProfile({displayName});
            setIsPending(false);
            setError(null);

        } catch(error) {
            console.log(error.message);
            setError(error.message);
            setIsPending(false);
        }
    }


So, to add a displayName to the user, we have to use the updateProfile method after the user has been signed up. 

To login, we have the signInWithEmailAndPassword method. 

----------------HOW TO LOG OUT A USER---------------

To log out a user, all we need to do is call a method on the 'auth' objec called 'signOut'. ANd that is all that we need to do!

When a user gets logged out, we also need to make the global user context value as null so that throughout the app, we know that a user is now logged out and its value is null in the context file so user now cannot access anything that would need authentication unless he logs in again.  


To set it null after logout, we use the dispatch method that is provide with the AuthContext Provider.

try {
            await auth.signOut();
            dispatch({type: 'LOGOUT'});
            setIsPending(false);
            setError(null);
        } catch(error){
            console.log(error.message);
            setError(error.message);
            setIsPending(false);
    }

---------------------CLEANUP FUNCTIONS--------------------

We know that signup and logout are async tasks and since we are updating some states while signing up or logging out the user, we also need to make sure that when the component gets unmounted while the request is going on, we do not update any state otherwise we will get the error in console about memory leak. 

This means, we only need to update the state in the signup and logout hooks if the component is not yet unmounted in which we have those buttons or options to do signup or logout. 

But! the auth object does not provide us any way to stop the current request. So, we cannot just say something like auth.stop() etc. So, how can we ensure that the state gets updated only when the component is mounted??

Well, we can use useEffect here. And we use useEffect only for one purpose. It can return a function called a cleanup function that runs only when the component is umounted.

So, when the component umounted and that cleanup function runs, we can do something that will not set the state if the request is currently happening. 


For example, inside useLogout hook - 

const [isUnmounted, setIsMounted] = useState(false);
useEffect(() => {
        return () => {
            setIsMounted(true);
        }
    }, [])


So, we will not make sure that only if the isUnmounted is false, then we update the state. 

try {
            await auth.signOut();

            dispatch({type: 'LOGOUT'});

            //Update states
            if(!isUnmounted){
                setIsPending(false);
                setError(null);
            }
}


And now, this will cover any issues with component umounting and state update. 

----------------------ISSUE WITH REFRESHING---------------

Let's suppose we just logged in with a user and it is a valid user so login is successful. Now, if we refresh the browser, then we will see that the authContext state for the user is null again, even though we are logged in. So, how can we avoid this issue so that when we refresh or reload the page, we first check if there is a logged in user already, in case of that we do not set user as null on reload. 


------------- onAuthStateChanged-------------------

Firebase authentication service provides us a method called 'onAuthStateChanged'. This is like a listener that keeps listening
and return whether there is currently a user logged in or not. So, we can use it to determine if a user is there that has logged in or not. If there is a user, we set the authContext user state as that user otherwise it stays null. 

WE need to do this when we reload the app or when we render it for the first time. Hence, we use useEffect for this. 

useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            dispatch({type: 'AUTH_IS_READY', payload: user})
            unsub();
        })
    }, [])


So, when we refresh the page then this code fires once and inside this, we call the onAuthStateChanged method. Now, this method will take a function as an argument and this function has a user argument. If a user is logged in then this user argument value contains data of that user. Otherwise, it is null.

So, we simply dispatch a new action where we set the payload to be that logged in user. So, if the user is there, then the dispatch sends that user data otherwise it just sends user as null to begin with. 

We unsubscribe from the listerner because we do not want it to be called again and again when we sign in or sign out users in our app without refreshing or reloading. WE only need to run it once when the app renders. 

----------------------------ROUTE GUARDS---------------------
If a user is alrady logged in, we want to restrict the user from opening the login or sign up page by going to the url. Similarly, if a user is not logged in, wwant to show the login page when the user goes to the home url. 

So again, we can make use of the user state that we have in the global AuthContext. So, we can then check if there is a user then we do not allow user to go to the login page unless that user logs out. And similarly, if user is null, we won't allow the user to go to homepage. He will be redirected to login instead. 

        
<Route exact path='/'>
          {user && user.displayName ? <Home /> : <Redirect to="/login"></Redirect>}
</Route>

 <Route path='/login'>
          {user && user.displayName ? <Redirect to="/"></Redirect> : <Login />}
</Route>


--------TIMESTAMP IN FIRESTORE---------------

To add a field where we specify when this document was created, we have to use the Timestamp object that Firebase provides us. We cannot directly pass just a date because firestore will then won't be able to sort the documents as per that date. We need to convert that date into a Timestamp that firestore accepts.


So, we can use the Timestamp  as - 

const timestamp = firebase.firestore.Timestamp;
const createdAt = timestamp.fromDate(new Date());



-------------------SHOW TRANSACTIONS ONLY FROM LOGGED IN USERS----

We want to ensure that if a user sees the tranasactions in the transaction list, then those are only from that user only. He should not see those from other users. 

So for this, before we get the list of transactions, we can add a query to only get those that have the userId same as the current logged in user's user id. 

const query = collectionReference.where("userId", "==", user.uid);


This where method is used on the collectionReference.

And now, we can use onSnapshot method on this query object and rest remains teh same. 

    onst unsub = query.onSnapshot(snapshot => {
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

----------------------SHOW TRANSACTIONS ORDERED BY THEIR CREATION TIME----------

We want to make sure the new transactions that are added are always shown on top. So, to create this order, we can use the 'orderBy' method on the collection reference. 

In this method, we pass which field we need to order the data by. For example, createdAt field which has the timestamp in firestore.

Once we do that, we wil lsee that when our app loads, console has an  error where it says we need to create an index or something like that. Just click on the link provided and it will take you to firestore page and there, just create the index. 