import axios from 'axios';
import {useEffect, useState, useLayoutEffect} from 'react';
/**
 * @return {JSON[]}
 * {_key, players, points, solved}
 * _key: string
 * players: string[]
 * points: int
 * solved: string[]
 */

async function pullTeams(results, setResults) {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/teams`, {'Access-Control-Allow-Origin':'*'});
                if(data !== results)
                        setResults(data);
        } catch (e) {
                return console.error(e);
        }
}


/**
 * @param {string} teamName 
 * @param {string[]} players
 * @return {boolean}
 */
async function makeTeam(t,p1,p2,p3) {
        try {
                const { data } = await axios.post(`http://localhost:5000/data/addTeam`, {
                        teamName: t,
                        player1:p1,
                        player2:p2,
                        player3:p3
                }, {'Access-Control-Allow-Origin':'*'});
                return true;
        } catch (e) {
                console.error(e);
                return false;
        }
}

async function loginReq(team, player) {
        try {
                const { data } = await axios.post(`http://localhost:5000/data/login`, {
                        teamName: team,
                        player:player
                }, {'Access-Control-Allow-Origin':'*'});
                return true;
        } catch (e) {
                console.error(e);
                return false;
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
        
        const [results, setResults] = useState([{_key:"test",points:0}]);

        useEffect(() => {
                pullTeams(results,setResults);
        }, [results])

        return (
                <table>
                        <thead>
                                <tr>
                                        <th>Team Name</th>
                                        <th>Points</th>
                                </tr> 
                        </thead>
                        <tbody>
                        {results.map(x =>{
                                return (
                                        <tr key={x._key}>
                                                <td>{x._key}</td>
                                                <td>{x.points}</td> 
                                        </tr>
                                );
                        })}
                        </tbody>
                </table>
        );
}

function Auth(props) {
        const [numPlayers, increment] = useState(1);
        const [login, setLogin] = useState(false);
        const [p1,sp1] = useState("");
        const [p2,sp2] = useState("");
        const [p3,sp3] = useState("");
        const setArr = [sp1,sp2,sp3];

        const signup = (
                <div className="authform">
                        <form onSubmit={e=>{
                                e.preventDefault();
                                if(makeTeam(props.team,p1,p2,p3))
                                        props.setPage(0);
                        }}>
                                <input name="search" placeholder="Team Name" type="text" onChange={e=>{
                                        props.setTeam(e.target.value);
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
                        <button onClick={()=>{setLogin(true)}}>Already a player? Log in here</button>
                </div>
        );

        const log = (
                <div className="authform">
                        <form onSubmit={e=>{
                                e.preventDefault();
                                if(loginReq(props.team,p1))
                                        props.setPage(0);
                        }}>
                                <input name="search" placeholder="Team Name" type="text" onChange={e=>{
                                        props.setTeam(e.target.value);
                                }}/>
                                <input  name={`Player`} placeholder={`Email`} onChange={e=>{
                                        sp1(e.target.value);
                                }}/>
                                <input type="submit"/>
                        </form>
                        <button onClick={()=>{setLogin(false)}}>Not a player? Sign up here!</button>
                </div>
        );

        useLayoutEffect(()=>{

        },[login]);

        return (
                <div className="auth">
                        {login?log:signup}
                </div>
        );
}

export { Auth, Problems, Scoreboard, pullTeams }
