import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from "../utils";

export default function History() {
const {globalData}=useAuth()

  return (
    //5 working on history
    <>
      <div className="section-header">
        <i className="fa-solid fa-timeline"></i>
        <h2>History</h2>
      </div>
      <p>Hover for more information!</p>
      <div className="coffee-history">
        {/*since coffee history is an object*/}
        {/* sort it for chronological order */}
        {/* if b-a sort it that way then else other way if negative */}
        {/* since key is utc time */}
        {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, coffeeIndex) => {
          //access coffee values:
          const coffee = globalData[utcTime]
          // it will return formatted string like 2 days 2 hours 6 minutes 4 seconds
          const timeSinceConsume = timeSinceConsumption(utcTime)
          //calculate origional caffiene amount of the coffee
          const origional_Amount = getCaffeineAmount(coffee.name)
          //calculate caffiene amount left
          //how much left
          
          const remaining_amount = calculateCurrentCaffeineLevel({
            [utcTime]: coffee
          })

          const summary = `${coffee.name} | ${timeSinceConsume} | $${coffee.cost} |
          ${remaining_amount}mg / ${origional_Amount}mg`




          return (
            // now we have summary  in title when we hover over it it will show
            <div title={summary} key={coffeeIndex}>
              <i className="fa-solid fa-mug-hot" />
            </div>
          )
        })}
      </div>
    </>
  );
}
