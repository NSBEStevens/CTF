import React, { useState } from 'react';



function Scoreboard(props) {
  return (

    <table>
      <tr>
        <th>Company</th>
        <th>Contact</th> 
      </tr>
      <tr>
        <td>Alfreds Futterkiste</td>
        <td>Maria Anders</td> 
      </tr>
      <tr>
        <td>Centro comercial Moctezuma</td>
        <td>Francisco Chang</td> 
      </tr>
    </table>
  );
}

export { Scoreboard }