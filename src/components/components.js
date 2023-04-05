import axios from 'axios';
import {useEffect, useState} from 'react';
/**
 * @return {JSON[]}
 * {_key, players, points, solved}
 * _key: string
 * players: string[]
 * points: int
 * solved: string[]
 */

async function pullTeams() {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/teams`, {'Access-Control-Allow-Origin':'*'});
                return data;
        } catch (e) {
                return console.error(e);
        }
}


/**
 * @param {string} teamName 
 * @param {string[]} players
 * @return {boolean}
 */
async function makeTeam(teamName,players) {
        try {
                const { data } = await axios.post(`http://localhost:5000/data/addTeam`, {
                        teamName: teamName,
                        players:players
                }, {'Access-Control-Allow-Origin':'*'});
                return !data.teamFound;
        } catch (e) {
                return console.error(e);
        }
}


/**
 * @return {JSON[]}
 * {_key, flag, desc, points, path}
 * _key: string
 * flag: string
 * desc: string
 * points: int
 * path: string
 */
async function pullProblems(results,setResults) {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/problems`, {'Access-Control-Allow-Origin':'*'});
                if(results !== data)
                        setResults(data);
        } catch (e) {
                return console.error(e);
        }
}

/**
 * @param {string} problem
 * @param {string} flag
 * @param {string} teamName
 * @return {boolean}
 */
async function solveProblem(problem,flag,teamName) {
        try {
                const { data } = await axios.put(`http://localhost:5000/data/solve`,{
                        problem: problem,
                        flag: flag,
                        teamName: teamName
                }, {'Access-Control-Allow-Origin':'*'});
                return data.solved;
        } catch (e) {
                return console.error(e);
        }
}

function Problems(props) {
        return (
                <>

                </>
        );
}

function Scoreboard(props) {
        
        const [results, setResults] = useState([]);

        useEffect(() => {
                pullTeams(results,setResults);
        }, [results])

        return (
                <table>
                        <tr>
                <th>Team Name</th>
                <th>Points</th> 
                </tr>
                {results.map(x =>{
                        <tr>
                                <td>{x._key}</td>
                                <td>{x.points}</td> 
                        </tr>
                })}
                </table>
        );
}

function Auth(props) {
        const [team, setTeam] = useState("");
        const [numPlayers, increment] = useState(1);
        const [login, setLogin] = useState(false);
        const [p1,sp1] = useState("");
        const [p2,sp2] = useState("");
        const [p3,sp3] = useState("");
        const setArr = [sp1,sp2,sp3];
        const [arr,setPlayers] = useState([]);
        useEffect(()=>{

        },[login]);

        return (
                <div className="auth">
                        <div className="authform">
                                <form onSubmit={e=>{
                                        e.preventDefault();
                                        setPlayers([p1,p2,p3]);
                                        if(makeTeam(team,arr))
                                                props.setPage(0);
                                }}>
                                        <input name="search" placeholder="Team Name" type="text" onChange={e=>{
                                                setTeam(e.target.value);
                                        }}/>
                                        {[...Array(numPlayers).keys()].map(x => {
                                                return <input key={x} name={`Player ${x+1}`} placeholder={`Email ${x+1}`} onChange={e=>{
                                                        setArr[x](e.target.value);
                                                }}/>
                                        })}
                                        <input type="submit"/>
                                </form>
                                <button onClick={()=>{
                                        increment(numPlayers > 2? 3: numPlayers + 1);
                                }}>Add Player</button>
                                <button onClick={()=>{
                                        increment(numPlayers < 2? 1: numPlayers - 1);
                                }}>Remove Player</button>
                        </div>
                </div>
        );
}

export { Auth, Problems, Scoreboard, pullTeams }
