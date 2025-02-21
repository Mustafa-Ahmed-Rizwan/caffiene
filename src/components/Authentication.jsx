import { useState } from "react"
import { useAuth } from "../context/AuthContext"
export default function Authentication(props) {
    const {handleCloseModal}=props
    //6 working on authentication

    //8 defining states for authentication:
    // whether user is signing in or signing out
    const [isRegistration, setIsRegistration] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //when they click on submit, manage a loading state
    const [isAuthenticating, setIsAuthenticating] = useState(false)
    //16
    const [error, setError]=useState(null)

    //12.1:
    // destructure out from global state
    const { signup, login } = useAuth()

    //12
    async function handleAuthenticate() {
        // 14 for closing modal logic:
        
        // if we are doing authentication ction then no second time
        if (!email || !email.includes('@') || !password || password.length < 6 || isAuthenticating) {
            // then error because of incorrect way:
            //block that authentication
            return
        }
        try {
            // because current user is already so no 
            setIsAuthenticating(true)
            setError(null)
            if (isRegistration) {
                //register a user:
                await signup(email, password)
            }
            else {
                //login a user:
                await login(email, password)
            }
            //closing of modal window:
            // 14
            handleCloseModal()
        }
        catch (error) {
            console.error(error.message)
            setError(error.message)

        }
        finally {
            setIsAuthenticating(false)

        }
    }

    return (
        <>
            {/* since depending on state content needs to change */}
            {/* so make it dynamic */}
            <h2 className="sign-up-text">{isRegistration ? 'Sign up' : 'Login'}</h2>
            <p>{isRegistration ? 'Create an account' : "Sign in to your account"}</p>
            {/* //16 */}
            {error && (
              <p>❌ {error}</p>
            ) }

            <input value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" />
            <input value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="*******" type="password" />
            <button onClick={handleAuthenticate}><p>{isAuthenticating ? "Authenticating..." : "Submit!"}</p></button>
            <hr />
            <div className="register-content">
                <p>{isRegistration ? 'Already have an account?' : "Don\'t have an account?"}</p>
                {/* registering for account */}
                <button onClick={() => { setIsRegistration(!isRegistration) }}>
                    <p>{isRegistration ? 'Sign in' : 'Sign up'}</p>
                </button>
            </div>
        </>

    )
}