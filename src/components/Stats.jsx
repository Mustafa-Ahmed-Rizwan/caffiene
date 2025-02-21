//scoped functional component:
//secondary functional component

import { useAuth } from "../context/AuthContext";
import {
  calculateCoffeeStats,
  calculateCurrentCaffeineLevel,
  coffeeConsumptionHistory,
  getTopThreeCoffees,
  statusLevels,
} from "../utils";

//used only within stats component
function StatCard(props) {
  // lg=large
  const { lg, title, children } = props;
  //4
  //col-span-2 span across 2 coloumns only
  return (
    <div className={"card stat-card " + (lg ? "col-span-2" : " ")}>
      <h4>{title}</h4>
      {children}
    </div>
  );
}

export default function Stats() {
  //4.1 working on fake data
  //   const stats = {
  //     daily_caffeine: 240,
  //     daily_cost: 6.8,
  //     average_coffees: 2.3,
  //     total_cost: 220,
  //   };
  // 19 work on global data:
  const {globalData}=useAuth()
  const stats = calculateCoffeeStats(globalData);
  //calculating active caffiene level:
  const caffiene_Level = calculateCurrentCaffeineLevel(
   globalData
  );

  //4.2
  //figure out what warning we are at:
  const warning_Level =
    caffiene_Level < statusLevels["low"].maxLevel
      ? "low"
      : caffiene_Level < statusLevels["moderate"].maxLevel
      ? "moderate"
      : "high";

  //4 working on stats
  return (
    <>
      <div className="section-header">
        <i className="fa-solid fa-chart-simple"></i>
        <h2>Stats</h2>
      </div>
      <div className="stats-grid">
        {/* lg=lg={true}*/}
        {/* adding children contents */}
        <StatCard lg title="Active Caffeine Level">
          <div className="status">
            <p>
              <span className="stat-text">{caffiene_Level}</span>mg
            </p>
            <h5
              style={{
                color: statusLevels[warning_Level].color,
                background: statusLevels[warning_Level].background,
              }}
            >
              {warning_Level}
            </h5>
          </div>
          {/* sescription of that status */}
          <p>{statusLevels[warning_Level].description}</p>
        </StatCard>
        <StatCard title="Daily Caffeine">
          <p>
            <span className="stat-text">{stats.daily_caffeine}</span>mg
          </p>
        </StatCard>
        <StatCard title="Average # of Coffees">
          <p>
            <span className="stat-text">{stats.average_coffees}</span>
          </p>
        </StatCard>
        <StatCard title="Daily Cost ($)">
          <p>
            $ <span className="stat-text">{stats.daily_cost}</span>
          </p>
        </StatCard>
        <StatCard title="Total Cost ($)">
          <p>
            $ <span className="stat-text">{stats.total_cost}</span>
          </p>
        </StatCard>
      </div>
      {/* //4.3 */}
      <table className="stat-table">
        {/* thead is labels of coloumns */}
        <thead>
          {/* tr=table row */}
          <tr>
            <th>Coffee Name</th>
            <th>Number of purchases</th>
            <th>Percentage of Total</th>
          </tr>
        </thead>
        {/* tbody is actual data */}
        <tbody>
          {/* fetch an array of top 3 coffees */}
          {getTopThreeCoffees(globalData).map(
            (coffee, coffeeIndex) => {
              return (
                <tr key={coffeeIndex}>
                  <td>{coffee.coffeeName}</td>
                  <td>{coffee.count}</td>
                  <td>{coffee.percentage}</td>
                </tr>
              );
            }
          )}
        </tbody>
      </table>
    </>
  );
}
