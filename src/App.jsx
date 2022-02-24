import axios from "axios";
import React from "react";
import Item from "./components/Item.jsx";

const API_ADDR = 'https://2a6sqsw1lf.execute-api.us-east-1.amazonaws.com';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: location.hash.substr(1),
      itemA: null,
      itemB: null,
    };
  }

  componentDidMount() {
    const { group } = this.state;
    if (group) {
      this.fetchRandomPair();
    }
  }

  fetchRandomPair() {
    const { group } = this.state;
    if (group) {
      axios.get(`${API_ADDR}/${group}/items/randomPair`)
        .then(({ data }) => {
          const itemA = data.Items[0];
          const itemB = data.Items[1];
          this.setState({ itemA, itemB });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    const { itemA, itemB } = this.state;
    return (
      <>
        <h1 className="unselectable">Who would win?</h1>
        <div className="itemContainer unselectable">
          {itemA ? <Item item={itemA} /> : null}
          {itemB ? <Item item={itemB} /> : null}
        </div>
      </>
    );
  }
}

export default App;
