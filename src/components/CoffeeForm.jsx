import { useState } from "react";
import { coffeeOptions } from "../utils";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";


export default function CoffeeForm(props) {
  //7 
  //this one is for form entry 
  const [showModal, setShowModal] = useState(false);

  const { isAuthenticated } = props
  //2.2 building components
  //3 making functional using state
  const [showCoffeeTypes, setShoWCoffeeTypes] = useState(false);
  //state for which is selected
  //no selection by default
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  //cost state:
  const [coffeecost, setCoffeeCost] = useState(0);
  //for hours
  const [hours, setHours] = useState(0);
  //for minutes
  const [mins, setMins] = useState(0);

  //destructure out global data:
  const { globalData, setGlobalData,globalUser} = useAuth()

  //handler
  //form submission
  //7.1
  async function handleSubmitForm() {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }

    //define a guard clause that only submits if it is completed:
    // everything is 0 by default except you have to choose coffee
    if(!selectedCoffee){
      return
    }

    try{
      const newGlobalData={
        // if global data is happened to  be null for extra security
        ...(globalData || {}),
      }
  
      //define key:
      const nowTime=Date.now()
  
      const timeToSubract=(hours*60*60*1000) + (mins*60*100)
      
      // of person consume the coffee
      const timestamp=nowTime-timeToSubract
  
      const newData={
        name:selectedCoffee,
        cost:coffeecost
  
      }
  
      newGlobalData[timestamp]=newData
      //update the global state:
      setGlobalData(newGlobalData)
  
      //persisit the data in firebase firestor
      // reference for where we are going to write
      // 
      const userRef=doc(db,'users',globalUser.uid)
      // userref=reference to where we are writing
      const res=await setDoc(userRef,{
        [timestamp]:newData
      },
      // instead of overwrite in current entry,merge our existing database
      {merge:true})

      //reset the form upon completion:
      setSelectedCoffee(null)
      setCoffeeCost(0)
      setHours(0)
      setMins(0)

    }
    catch(e){
      console.log(e.message)

    }
    finally{

    }

    //if true then  new data object:
    // since state is immutable
    // so overwrite it
    // spread out existing global data in this object
   

    
    
  }
  function handleCloseModal(){
    setShowModal(false)
  }

  return (
    <>
      {/* //7.2 for form entry modal logic: */}
      {showModal && (<Modal handleCloseModal={handleCloseModal}>
        <Authentication  handleCloseModal={handleCloseModal}/>
      </Modal>)}

      <div className="section-header">
        <i className="fa-solid fa-pencil" />
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className="coffee-grid">
        {
          // only first five entries
          //primary options
          coffeeOptions.slice(0, 5).map((option, optionIndex) => {
            return (
              <button
                onClick={() => {
                  setSelectedCoffee(option.name);
                  // becuase when suppose we are on other options then back to primary options so do this
                  setShoWCoffeeTypes(false);
                }}
                className={
                  "button-card " +
                  (option.name === selectedCoffee
                    ? "coffee-button-selected"
                    : " ")
                }
                key={optionIndex}
              >
                <h4>{option.name}</h4>
                <p>{option.caffeine}mg</p>
              </button>
            );
          })
        }
        {/* // 3.1  Other options*/}
        <button
          onClick={() => {
            setShoWCoffeeTypes(true);
            // reset selected coffee
            setSelectedCoffee(null);
          }}
          className={
            "button-card" + (showCoffeeTypes ? "coffee-button-selected" : " ")
          }
        >
          {/* if they click on it then show other options */}
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {/* conditional rendering if other  */}
      {showCoffeeTypes && (
        // 3 select to set a state
        <select
          onChange={(e) => {
            setSelectedCoffee(e.target.value);
          }}
          id="coffee-list"
          name="coffee-list"
        >
          <option value={null}>Select type</option>
          {
            //map out all other options:
            coffeeOptions.map((option, optionIndex) => {
              return (
                <option value={option.name} key={optionIndex}>
                  {option.name} {option.caffeine}mg
                </option>
              );
            })
          }
        </select>
      )}
      {/* for adding the cost */}
      <h4>Add the cost ($)</h4>
      <input
        className="w-full"
        type="number"
        value={coffeecost}
        onChange={(e) => {
          setCoffeeCost(e.target.value);
        }}
        placeholder="4.50"
      />
      {/* time of consumption */}
      <h4>Time since consumption</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            onChange={(e) => {
              setHours(e.target.value);
            }}
            id="hours-select"
          >
            {/* map all options */}
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hoursIndex) => {
              return (
                <option key={hoursIndex} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <h6>Mins</h6>
          <select
            onChange={(e) => {
              setMins(e.target.value);
            }}
            id="mins-select"
          >
            {/* map all options */}
            {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
              return (
                <option key={minIndex} value={min}>
                  {min}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      {/* //3.4 submitting form */}
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  );
}
