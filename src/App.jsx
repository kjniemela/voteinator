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
      nextPairId: null,
      nextItemA: null,
      nextItemB: null,
      lastPairId: null,
      lastCallTime: new Date(),
      canVote: true,
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
      setTimeout(this.fetchRandomPair, 2000);
      this.fetchLeaderboard();
    }
  }

  fetchRandomPair() {
    const { group } = this.state;
    let { nextItemA, nextItemB, nextPairId, pairId } = this.state;
    const itemA = nextItemA;
    const itemB = nextItemB;
    const lastPairId = pairId;
    pairId = nextPairId;
    this.setState({ itemA, itemB, pairId, lastPairId }, () => {
      if (group) {
        axios.get(`${API_ADDR}/${group}/items/randomPair`)
          .then(({ data }) => {
            nextItemA = data.Items[0];
            nextItemB = data.Items[1];
            nextPairId = data.pairId;
            console.log(lastPairId, pairId, nextPairId);
            this.setState({ nextItemA, nextItemB, nextPairId, lastCallTime: new Date(), canVote: true });
          })
          .catch((err) => {
            console.error(err);
          });
      }
    });
  }

  voteFor(winner) {
    const { group, itemA, itemB, pairId, lastCallTime } = this.state;
    this.setState({ canVote: false }, () => {
      console.log('vote');
      if (new Date() - lastCallTime > 1000) {
        this.fetchRandomPair();
      } else {
        setTimeout(this.fetchRandomPair, 1000 - (new Date() - lastCallTime));
      }
      axios.post(`${API_ADDR}/${group}/compare`, {
        pairId,
        winner,
      })
        .then((result) => {
          this.fetchLeaderboard();
        })
        .catch((err) => {
          console.error(err);
        })
    });
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
    const { itemA, itemB, view, rankList, canVote } = this.state;
    if (view === 'vote') {
      return (
        <>
          <h1 className="unselectable">Who would win?</h1>
          <div className="itemContainer unselectable">
            <button onClick={() => this.setState({ view: 'leaderboard' })}>Leaderboard</button>
          </div>
          <div className="itemContainer unselectable">
            {itemA ? <Item item={itemA} voteFn={canVote ? () => this.voteFor('A') : () => {}} /> : null}
            {itemB ? <Item item={itemB} voteFn={canVote ? () => this.voteFor('B') : () => {}} /> : null}
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
