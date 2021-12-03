import * as React from 'react';
import _ from 'lodash';

export type PartString = '1' | '2';

export interface Player {
  global_score: number;
  name: string | null;
  local_score: number;
  id: string;
  last_star_ts: string | number;
  completion_day_level: { (day: string): {(part: PartString): {get_star_ts: number}}};
  stars: number;
  gold_medals: { [day: string]: { [part: string]: number } };
  silver_medals: { [day: string]: { [part: string]: number } };
  bronze_medals: { [day: string]: { [part: string]: number} };
  stars_ts: { [day: string]: { [part: string]: number } };
}

interface Props {
  player: Player;
  index: number;
}

export class PlayerRow extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const player = this.props.player;
    const dayInts: Array<number> = [];
    for (let day = 1; day <= 25; day++) {
      dayInts.push(day);
    }
    const goldMedalCount = Object.values(player.gold_medals).map(x => Object.values(x).length).reduce((a, b) => a + b, 0);
    const silverMedalCount = Object.values(player.silver_medals).map(x => Object.values(x).length).reduce((a, b) => a + b, 0);
    const bronzeMedalCount = Object.values(player.bronze_medals).map(x => Object.values(x).length).reduce((a, b) => a + b, 0);
    const allMedalCount = goldMedalCount + silverMedalCount + bronzeMedalCount;
    return (
      <tr key={player.id}>
        <td>{this.props.index + 1}</td>
        <td className="left-align">{player.name || `Anon #${player.id}`}</td>
        <td>{player.local_score}</td>
        <td>{player.stars}</td>
        <td>{goldMedalCount}</td>
        <td>{silverMedalCount}</td>
        <td>{bronzeMedalCount}</td>
        <td>{allMedalCount}</td>
        {
          dayInts.map(d => {
            const partOneTime = player.stars_ts[d] && player.stars_ts[d]["1"] ? (new Date(player.stars_ts[d]["1"] * 1000)) : null;
            const partTwoTime = player.stars_ts[d] && player.stars_ts[d]["2"] ? (new Date(player.stars_ts[d]["2"] * 1000)) : null;

            let partOneGoldMedal;
            let gotPartOneGoldMedal = player.gold_medals[`${d}`]["1"];
            let partTwoGoldMedal;
            let gotPartTwoGoldMedal = player.gold_medals[`${d}`]["2"];
            let partOneSilverMedal;
            let gotPartOneSilverMedal = player.silver_medals[`${d}`]["1"];
            let partTwoSilverMedal;
            let gotPartTwoSilverMedal = player.silver_medals[`${d}`]["2"];
            let partOneBronzeMedal;
            let gotPartOneBronzeMedal = player.bronze_medals[`${d}`]["1"];
            let partTwoBronzeMedal;
            let gotPartTwoBronzeMedal = player.bronze_medals[`${d}`]["2"];

            const partOneTooltip = partOneTime ? (
              <span>
                Day {d} Star 1<br />
                Obtained {partOneTime.toLocaleString()}<br />
                {(gotPartOneGoldMedal && 'Gold Medal') || (gotPartOneSilverMedal && 'Silver Medal') || (gotPartOneBronzeMedal && 'Bronze Medal')}
              </span>
            ) : null;
            const partTwoTooltip = partTwoTime ? (
              <span>
                Day {d} Star 2<br />
                Obtained {partTwoTime.toLocaleString()}<br />
                {(gotPartTwoGoldMedal && 'Gold Medal') || (gotPartTwoSilverMedal && 'Silver Medal') || (gotPartTwoBronzeMedal && 'Bronze Medal')}
              </span>
            ) : null;

            if (gotPartOneGoldMedal) {
              partOneGoldMedal = (
                <a href="#" className="tooltip">
                  🥇
                  {partOneTooltip}
                </a>
              );
            }
            
            // console.log(player.gold_medals[`${d}`][2]);
            if (gotPartTwoGoldMedal) {
              partTwoGoldMedal = (
                <a href="#" className="tooltip">
                  🥇
                  {partTwoTooltip}
                </a>
              );
            }
            
            if (gotPartOneSilverMedal) {
              partOneSilverMedal = (
                <a href="#" className="tooltip">
                  🥈
                  {partOneTooltip}
                </a>
              );
            }
            
            if (gotPartTwoSilverMedal) {
              partTwoSilverMedal = (
                <a href="#" className="tooltip">
                  🥈
                  {partTwoTooltip}
                </a>
              );
            }
            
            if (gotPartOneBronzeMedal) {
              partOneBronzeMedal = (
                <a href="#" className="tooltip">
                  🥉
                  {partOneTooltip}
                </a>
              );
            }

            if (gotPartTwoBronzeMedal) {
              partTwoBronzeMedal = (
                <a href="#" className="tooltip">
                  🥉
                  {partTwoTooltip}
                </a>
              );
            }
            
            return (
              <React.Fragment key={player.id + d}>
                <td className='star-table-1' key={player.id + d + '1'}>
                  <span className="star star-gold">
                    <a href="#" className="tooltip">
                      {partOneTooltip ? '⭐️' : null}
                      {partOneTooltip}
                    </a>
                  </span><br />
                  <span className='medal'>
                    {partOneGoldMedal}
                    {partOneSilverMedal}
                    {partOneBronzeMedal}
                  </span>
                </td>
                <td className='star-table-2' key={player.id + d + '2'}>
                  <span className="star star-gold">
                    <a href="#" className="tooltip">
                      {partTwoTooltip ? '⭐️' : null}
                      {partTwoTooltip}
                    </a>
                  </span><br />
                  <span className='medal'>
                    {partTwoGoldMedal}
                    {partTwoSilverMedal}
                    {partTwoBronzeMedal}
                  </span>
                </td>
              </React.Fragment>
            );
          })
        }
      </tr>
    );
  }
}