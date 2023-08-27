import "./Home.css";
import { useState } from "react";
import CurrentPlan from "../../components/CurrentPlan/CurrentPlan";
import Plans from "../../components/Plans/Plans";

const Home = () => {
  const [hasActivePlan, setHasActivePlan] = useState(false);
  return (
    <div className="home">{hasActivePlan ? <CurrentPlan /> : <Plans />}</div>
  );
};

export default Home;
