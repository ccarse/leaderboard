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
    this.setState({players: players});
    console.log(JSON.stringify(players, null, 2));
  }

  render() {
    const days = [];
    for (let day = 1; day <= 25; day++) {
      days.push(<th key={day} colSpan={2}>{day.toString()}</th>);
    }
    return (
      <div id="content">
        <h4>Advent of Code {this.state.year}</h4>
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