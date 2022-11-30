import * as React from 'react';
import * as ReactDOM from "react-dom";
import _ from 'lodash';

import "./styles.css";
import { Player, PlayerRow } from './player_row';
import { get_data } from './get_data';

interface State {
  year: number;
  board_id: string;
  players?: Player[];
  special_title?: string;
}

class App extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      year: 2022,
      board_id: '759284'
    };
  }

  async componentDidMount() {
    let params = new URLSearchParams(document.location.search);
    const yearParam = parseInt(params.get("year") || "2022", 10);
    this.setState({ year: yearParam });

    if (!this.isValidYear(yearParam)) { return; }

    const players = await get_data(yearParam);
    const name = params.get("name")?.toLowerCase();

    let cheerleading = [
      "You are the best!",
      "The only competition is yourself!",
      "Ego booster time!!",
      "Screenshot and share this!",
      "You're doing a really good job!",
      "Dance like there's nobody watching",
      "Be yourself—everyone else is already taken",
      "Be the change you wish to see in the world",
      "Live, laugh, love",
      "It's not the number of breaths we take, but the number of moments that take our breath away",
      "Shoot for the moon. Even if you miss, you'll land among the stars",
      "If life gives you lemons, make lemonade",
      "It takes more muscles to frown than it does to smile",
      "You miss 100% of the shots you don't take",
      "Let's get that money!",
    ];
    let chosen = cheerleading[Math.floor(Math.random() * cheerleading.length)]
    this.setState({ special_title: chosen });
    if (name && name != "") {
      let filteredPlayers = players.filter(player => player.name?.localeCompare(name, undefined, { sensitivity: 'base' }) === 0);
      for (const [key, value] of Object.entries(filteredPlayers[0].stars_ts)) {
        filteredPlayers[0].gold_medals[key] = value;
      }
      this.setState({players: filteredPlayers});
    } else {
      this.setState({players: players});
    }
  }

  isValidYear(year: number) {
    const currYear = new Date().getFullYear();
    return year >= 2015 && year <= currYear;
  }

  render() {
    const currYear = new Date().getFullYear();

    if (!this.isValidYear(this.state.year)) {
      return <div>Invalid year</div>;
    }

    const days = [];
    for (let day = 1; day <= 25; day++) {
      days.push(<th key={day} colSpan={3}>{day.toString()}</th>);
    }
    return (
      <div id="content">
        <h4>Advent of Code {this.state.year}: {this.state.special_title}</h4>
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
              <th>🍌</th>
              {days}
            </tr>
            {
              _.orderBy(this.state.players, "local_score", "desc").map((player, i) =>
                (<PlayerRow player={player} index={i} key={player.id} />)
              )
            }
          </tbody>
        </table>
        <br />
        <div>
          Other years:
          <div>
            {_.range(2015, currYear + 1).reverse().map((year) =>
              (<div key={year}><a href={`?year=${year}`}>{year}</a></div>)
            )}
          </div>
        </div>
        <p>
          Credit: <a href={'https://github.com/meithan/AoCBoard'}>https://github.com/meithan/AoCBoard</a>
        </p>
      </div>
    );
  }
}

const mountNode = document.querySelector("#main");
ReactDOM.render(<App />, mountNode);
