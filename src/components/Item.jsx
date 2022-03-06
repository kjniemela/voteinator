import React from "react";

const Item = ({ item, voteFn }) => (
  <div className="item" onClick={voteFn}>
    {/* <h3>Rating: {item.score}</h3> */}
    <br></br>
    <figure>
      <img src={item.img} alt={item.caption}></img>
      <figcaption>{item.desc}</figcaption>
    </figure>
  </div>
);

export default Item;