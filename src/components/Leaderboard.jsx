import React from "react";
import LeaderboardItem from "./LeaderboardItem.jsx";

const Leaderboard = ({ rankList }) => (
  <div className="leaderboard">
    {rankList.map((item, i) => (
      <LeaderboardItem item={item} key={i} />
    ))}
  </div>
);

export default Leaderboard;