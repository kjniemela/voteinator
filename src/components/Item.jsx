import React from "react";

const Item = ({ item }) => (
  <div className="item" onClick={() => console.log(item.caption)}>
    <figure>
      <img src={item.img} alt={item.caption}></img>
      <figcaption>{item.desc}</figcaption>
    </figure>
  </div>
);

export default Item;