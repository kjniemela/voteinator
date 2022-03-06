import React from "react";
import LeaderboardItem from "./LeaderboardItem.jsx";

const Leaderboard = ({ rankList }) => (
  <ol className="leaderboard">
    {rankList.map((item, i) => (
      <li key={i}><div className="leaderboardItemContainer"><LeaderboardItem item={item} /></div></li>
    ))}
  </ol>
);

export default Leaderboard;