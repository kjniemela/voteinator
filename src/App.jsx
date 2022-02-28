import axios from "axios";
import React from "react";

import Item from "./components/Item.jsx";
import Leaderboard from "./components/Leaderboard.jsx";

const API_ADDR = 'https://2a6sqsw1lf.execute-api.us-east-1.amazonaws.com';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      group: location.hash.substr(1),
      itemA: null,
      itemB: null,
      view: 'vote',
    };
    this.fetchRandomPair = this.fetchRandomPair.bind(this);
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

  voteFor(winner) {
    const { group, itemA, itemB } = this.state;
    axios.post(`${API_ADDR}/${group}/compare`, {
      idA: itemA.id,
      idB: itemB.id,
      winner,
    })
      .then((result) => {
        this.fetchRandomPair();
      })
      .catch((err) => {
        console.error(err);
      })
  }

  render() {
    const { itemA, itemB, view } = this.state;
    if (view === 'vote') {
      return (
        <>
          <h1 className="unselectable">Who would win?</h1>
          <div className="itemContainer unselectable">
            <button onClick={() => this.setState({ view: 'leaderboard' })}>Leaderboard</button>
          </div>
          <div className="itemContainer unselectable">
            {itemA ? <Item item={itemA} voteFn={() => this.voteFor('A')} /> : null}
            {itemB ? <Item item={itemB} voteFn={() => this.voteFor('B')} /> : null}
          </div>
          <div className="itemContainer unselectable">
            <button onClick={this.fetchRandomPair}>New Pair</button>
          </div>
        </>
      );
    } else if (view === 'leaderboard') {
      return (
        <>
          <h1 className="unselectable">Leaderboard</h1>
          <div className="itemContainer unselectable">
            <button onClick={() => this.setState({ view: 'vote' })}>Back</button>
          </div>
          <div className="itemContainer unselectable">
            <Leaderboard />
          </div>
        </>
      );
    }
  }
}

export default App;
