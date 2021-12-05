import * as React from 'react';
import * as ReactDOM from "react-dom";
import _ from 'lodash';

import "./styles.css";
import { Player, PlayerRow } from './player_row';
import { get_data } from './get_data';

interface State {
  year: string;
  board_id: string;
  players?: Player[];
  special_title: string;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      year: '2021',
      board_id: '759284'
    };
  }

  async componentDidMount() {
    const players = await get_data();
    const name = window.location.search.replace(/^\?I_am=/g, "").replace(/\s/, "").toLowerCase();
    if(name != '') {
      var cheerleading = [
        ": You are the best!",
        ": The only competition is yourself!",
        ": Ego booster time!!",
        ": Screenshot and share this!",
        ": You're doing a really good job!",
        ": Dance like there's nobody watching",
        ": Be yourself—everyone else is already taken",
        ": Be the change you wish to see in the world",
        ": Live, laugh, love",
        ": It's not the number of breaths we take, but the number of moments that take our breath away",
        ": Shoot for the moon. Even if you miss, you'll land among the stars",
        ": If life gives you lemons, make lemonade",
        ": It takes more muscles to frown than it does to smile",
        ": You miss 100% of the shots you don't take"
      ];
      var chosen = cheerleading[Math.floor(Math.random() * cheerleading.length)]
      this.setState({special_title:chosen});
      var filteredPlayers = players.filter(player => player.name == name);
      for (const [key, value] of Object.entries(filteredPlayers[0].stars_ts)) {
        filteredPlayers[0].gold_medals[key] = value;
      }
      this.setState({players: filteredPlayers});
    } else {
      this.setState({players: players});
    }
  }

  render() {
    const days = [];
    for (let day = 1; day <= 25; day++) {
      days.push(<th key={day} colSpan={2}>{day.toString()}</th>);
    }
    return (
      <div id="content">
        <h4>Advent of Code {this.state.year}{this.state.special_title}</h4>
        <table id="main-table">
          <tbody>
            <tr>
              <th><strong>#</strong></th>
              <th className="left-align"><strong>Name</strong></th>
              <th><strong>Score</strong></th>
              <th><span className="star-big star-gold">⭐️</span></th>
              <th>🥇</th>
              <th>🥈</th>
              <th>🥉</th>
              <th><span className='medalOffset'>🥇🥈🥉</span></th>
              {days}
            </tr>
            {
              _.orderBy(this.state.players, "local_score", "desc").map((player, i) =>
                (<PlayerRow player={player} index={i} key={player.id} />)
              )
            }
          </tbody>
        </table>
        <p>
          <a href={`https://adventofcode.com/${this.state.year}`} target="_blank">
            Advent of Code
          </a> is a programming challenge created by <a href="http://was.tl/" target="_blank">
            Eric Wastl
          </a>.
        </p>
        <p>
          Credit: <a href={'https://github.com/meithan/AoCBoard'}>https://github.com/meithan/AoCBoard</a>
        </p>
      </div>
    );
  }
}

const mountNode = document.querySelector("#main");
ReactDOM.render(<App />, mountNode);
