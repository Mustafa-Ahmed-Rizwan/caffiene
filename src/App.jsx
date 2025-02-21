import CoffeeForm from "./components/CoffeeForm"
import Hero from "./components/Hero"
import History from "./components/History"
import Layout from "./components/Layout"
import Stats from "./components/Stats"
import { useAuth } from "./context/AuthContext"
import { coffeeConsumptionHistory } from "./utils"
function App() {
  //17:
  const {globalUser,isLoading,globalData}=useAuth()

  //1
  //authentication state:
  //fake state
  // if there is global user then we are authenticated
  const isAuthenticated=globalUser
  
  // for records of data entry:
  // global data needs to exist
  // theres actually some entries=object.keys
  //backup empty object
  // if length is zero then false value
  // force it to be boolean value
  const isData = globalData && !!Object.keys(globalData || {}).length


  const authenticatedContent = (
    <>
      <Stats />
      <History />
    </>
  )

  return (
    
    <Layout>
      {/* //1 why they should become user: hero section */}
      <Hero />
      {/* //7 */}
      <CoffeeForm isAuthenticated={isAuthenticated}/>
      {/* //1 if authentication is true then you get authenticated content*/}
      {/* also they nned to have data */}
      {isAuthenticated && isLoading && (
        <p>Loading data...</p>
      )}
      {(isAuthenticated && isData) && (authenticatedContent)}
      </Layout>
    
    
    
  )
}

export default App;