//10
import { createContext } from "react";
import { useState, useEffect, useContext } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

//secondary component:
const AuthContext = createContext()

//custom react hook
//for making context easy
export function useAuth() {
    return useContext(AuthContext)
}
export function AuthProvider(props) {
    const {children } = props
    // state:
    const [globalUser, setGlobalUser] = useState(null)
    //secondary state:
    const [globalData, setGlobalData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    //handlers:
    function signup(email, password) {
        // to get firebse to authenticate the user
        return createUserWithEmailAndPassword(auth, email, password)

    }
    // 13
    function login(email, password) {
        // to get firebse to authenticate the user
        return signInWithEmailAndPassword(auth, email, password)
    }
    function logout() {
        //when signing out so set it to null:
        setGlobalUser(null)
        // we shouldnt keep persons data so clear out all states
        setGlobalData(null)

        return signOut(auth)

    }

    function resetPassword(email) {
        //to send password reset email to user
        return sendPasswordResetEmail(auth, email)

    }
    //throw these handlers as well in global
    //global state:
    // that we can access from anywhere
    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout }

    //working on useEffect:
    // when the page loads for first time
    useEffect(() => {
        //event listner:
        //when user signin,signout
        //user logs in for first time:
        //it will give all users information
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Current User:',user)
            setGlobalUser(user)
            //if there is no user empty the user state and return from listner
            if (!user) {
                console.log('No active user')
                 return }


            //if there  is a user, then check if the user has data in the database, and if they do,
            // then fetch said data and update the globalState:
            try {
                setIsLoading(true)
                //fetch data:
                //let firebase know which data we are trying to fetch:
                //users collection
                //reference for document(labelled json)
                const docRef = doc(db, 'users', user.uid)
                //take snapshot of current document:
                // to see if anything is in it or not
                const docSnap = await getDoc(docRef)

                let firebaseData = {}
                if (docSnap.exists()) {
                    
                    // overwrite it from empty state
                    firebaseData = docSnap.data()
                    console.log('Found User data',firebaseData)
                }
                setGlobalData(firebaseData)
            }
            catch (e) {
                console.log(e.message);
            }
            finally {
                setIsLoading(false)

            }

        })
        //for cleanup for preventing data leakages
        return unsubscribe

    }, [])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>

    )
}