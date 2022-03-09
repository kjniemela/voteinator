import React from "react";

const LeaderboardItem = ({ item }) => (
  <div className="leaderboardItem">
    <img className="unselectable" src={item.img} alt={item.caption}></img>
    <p>{item.desc}</p>
    <p>Rating: {item.score}</p>
  </div>
);

export default LeaderboardItem;