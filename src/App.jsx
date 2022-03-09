import axios from "axios";
import React from "react";

import Item from "./components/Item.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import About from "./components/About.jsx";

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
    this.setGroup = this.setGroup.bind(this);
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
    const { group, lastCallTime } = this.state;
    if (group) {
      let { nextItemA, nextItemB, nextPairId, pairId } = this.state;
      const itemA = nextItemA;
      const itemB = nextItemB;
      const lastPairId = pairId;
      pairId = nextPairId;
      this.setState({ itemA, itemB, pairId, lastPairId }, () => {
        const fetchFn = () => {
          axios.get(`${API_ADDR}/${group}/items/randomPair`)
            .then(({ data }) => {
              nextItemA = data.Items[0];
              nextItemB = data.Items[1];
              nextPairId = data.pairId;
              this.setState({ nextItemA, nextItemB, nextPairId, lastCallTime: new Date(), canVote: true });
            })
            .catch((err) => {
              console.error(err);
            });
        };
        if (new Date() - lastCallTime > 1000) {
          fetchFn();
        } else {
          setTimeout(fetchFn, 1000 - (new Date() - lastCallTime));
        }
      });
    } else {
      this.setState({
        itemA: null,
        itemB: null,
        pairId: null,
        nextItemA: null,
        nextItemB: null,
        nextPairId: null,
      });
    }
  }

  voteFor(winner) {
    const { group, itemA, itemB, pairId } = this.state;
    this.setState({ canVote: false }, () => {
      this.fetchRandomPair();
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

  setGroup(group) {
    location.hash = group ? `#${group}` : '';
    this.setState({ group, view: 'vote' }, () => {
      this.fetchRandomPair();
      setTimeout(this.fetchRandomPair, 2000);
      this.fetchLeaderboard();
    });
  }

  render() {
    const { group, itemA, itemB, view, rankList, canVote } = this.state;
    const header = (
      <div className="header">
        <div className="logoContainer unselectable" onClick={() => this.setGroup('')}>
          <img className="headerLogo" src="assets/voteinator.svg"></img>
          <h1 className="headerTitle">Voteinator</h1>
        </div>
      </div>
    );
    if (view === 'about') {
      return (
        <>
          {header}
          <About />
        </>
      );
    }
    else if (!group) {
      return (
        <>
          {header}
          <h1 className="unselectable">Behold, the Voteinator!</h1>
          <div className="about">
            <p>Voteinator allows you to vote for your favorite item in a given category. It's very simple: you are presented with two items, and you click on the one you like better. Your choice is then recorded to the leaderboard - the item you chose will gain points, and the other item will loose points. You can view the score of any item by checking out the leaderboard. May the best item win!</p>
            <p>For more information about this project, visit the <a onClick={() => this.setState({ view: 'about' })}>about</a> page.</p>
          </div>
          <h1 className="unselectable">Categories</h1>
          <div className="categories">
            <h3 className="categoryBtn unselectable" onClick={() => this.setGroup('flags')}>Flags</h3>
            <h3 className="categoryBtn unselectable" onClick={() => this.setGroup('letters')}>Letters</h3>
            <h3 className="categoryBtn unselectable" onClick={() => this.setGroup('colors')}>Colors</h3>
          </div>
        </>
      );
    }
    else if (view === 'vote') {
      return (
        <>
          {header}
          <h1 className="unselectable">Which {location.hash.substr(1, location.hash.length-2)} would you prefer?</h1>
          <div className="itemContainer">
            <button onClick={() => this.setState({ view: 'leaderboard' })}>Leaderboard</button>
          </div>
          <div className="itemContainer">
            {itemA ? (
              <Item item={itemA} voteFn={canVote ? () => this.voteFor('A') : () => {}} />
             ) : <button onClick={this.fetchRandomPair}>Load Items</button>}
            {itemB ? <Item item={itemB} voteFn={canVote ? () => this.voteFor('B') : () => {}} /> : null}
          </div>
          {/* <div className="itemContainer unselectable">
            <button onClick={this.fetchRandomPair}>New Pair</button>
          </div> */}
        </>
      );
    } else if (view === 'leaderboard') {
      return (
        <>
          {header}
          <h1 className="unselectable">Leaderboard</h1>
          <div className="itemContainer">
            <button onClick={() => this.setState({ view: 'vote' })}>Back</button>
            <button onClick={this.fetchLeaderboard}>Refresh</button>
          </div>
          <div className="itemContainer">
            <Leaderboard rankList={rankList}/>
          </div>
        </>
      );
    }
  }
}

export default App;
