import React from "react";
import LeaderboardItem from "./LeaderboardItem.jsx";

const Leaderboard = ({ rankList }) => (
  <ol className="leaderboard">
    {rankList.map((item, i) => (
      <li><div className="leaderboardItemContainer"><LeaderboardItem item={item} key={i} /></div></li>
    ))}
  </ol>
);

export default Leaderboard;