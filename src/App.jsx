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
      pairId: null,
      itemA: null,
      itemB: null,
      rankList: [],
      view: 'vote',
    };
    this.fetchRandomPair = this.fetchRandomPair.bind(this);
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this);
  }

  componentDidMount() {
    const { group } = this.state;
    if (group) {
      this.fetchRandomPair();
      this.fetchLeaderboard();
    }
  }

  fetchRandomPair() {
    const { group } = this.state;
    if (group) {
      axios.get(`${API_ADDR}/${group}/items/randomPair`)
        .then(({ data }) => {
          const itemA = data.Items[0];
          const itemB = data.Items[1];
          const pairId = data.pairId;
          this.setState({ itemA, itemB, pairId });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  voteFor(winner) {
    const { group, itemA, itemB, pairId } = this.state;
    axios.post(`${API_ADDR}/${group}/compare`, {
      pairId,
      winner,
    })
      .then((result) => {
        this.fetchRandomPair();
        this.fetchLeaderboard();
      })
      .catch((err) => {
        console.error(err);
      })
  }

  fetchLeaderboard() {
    const { group } = this.state;
    if (group) {
      axios.get(`${API_ADDR}/${group}/items`)
        .then(({ data }) => {
          const rankList = data.Items;
          rankList.sort((a, b) => {
            if (a.score > b.score) {
              return -1;
            } else if (a.score < b.score) {
              return 1;
            } else {
              return 0;
            }
          });
          this.setState({ rankList });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }

  render() {
    const { itemA, itemB, view, rankList } = this.state;
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
          {/* <div className="itemContainer unselectable">
            <button onClick={this.fetchRandomPair}>New Pair</button>
          </div> */}
        </>
      );
    } else if (view === 'leaderboard') {
      return (
        <>
          <h1 className="unselectable">Leaderboard</h1>
          <div className="itemContainer unselectable">
            <button onClick={() => this.setState({ view: 'vote' })}>Back</button>
            <button onClick={this.fetchLeaderboard}>Refresh</button>
          </div>
          <div className="itemContainer unselectable">
            <Leaderboard rankList={rankList}/>
          </div>
        </>
      );
    }
  }
}

export default App;
