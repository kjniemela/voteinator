import React from "react";

const Item = ({ item, voteFn }) => (
  <div className="item" onClick={voteFn}>
    <figure>
      <img src={item.img} alt={item.caption}></img>
      <figcaption>{item.desc}</figcaption>
    </figure>
  </div>
);

export default Item;