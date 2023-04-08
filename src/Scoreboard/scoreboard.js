import React from 'react';

function Scoreboard(props) {
  return (
    <table>
      <tr>
        <th>Team Name</th>
        <th>Points</th> 
      </tr>
      {props.teams.map(x =>{<tr>
        <td>{x._key}</td>
        <td>{x.points}</td> 
      </tr>})}
    </table>
  );
}

export { Scoreboard }