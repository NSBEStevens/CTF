import axios from 'axios';
import {useState, useLayoutEffect} from 'react';
/**
 * @return {JSON[]}
 * {_key, players, points, solved}
 * _key: string
 * players: string[]
 * points: int
 * solved: string[]
 */
const url = "https://www.discardsoftware.com";

async function deleteTeams() {
        try {
                await axios.post(`${url}/data/clearTeams`, {'Access-Control-Allow-Origin':'*'});
        } catch (e) {
                return console.error(e);
        }
}

async function deleteProblems() {
        try {
                await axios.post(`${url}/data/clearProblems`, {'Access-Control-Allow-Origin':'*'});
        } catch (e) {
                return console.error(e);
        }
}

async function pullAllTeams(results, setResults) {
        try {
                const { data } = await axios.get(`${url}/data/teams`, {'Access-Control-Allow-Origin':'*'});
                if(data !== results)
                        setResults(data);
        } catch (e) {
                return console.error(e);
        }
}

async function pullTeam(team, results, setResults) {
        try {
                const { data } = await axios.get(`${url}/data/teams/${team}`, {'Access-Control-Allow-Origin':'*'});
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
                await axios.post(`${url}/data/addTeam`, {
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
                const { data } = await axios.post(`${url}/data/login`, {
                        teamName: team,
                        player:player
                }, {'Access-Control-Allow-Origin':'*'});
                return data.teamFound;
        } catch (e) {
                console.error(e);
                return false;
        }
}

/**
 * @return {JSON[]}
 * {_key, desc, points, path}
 * _key: string
 * desc: string
 * points: int
 * path: string
 */
async function pullProblems(results,setResults) {
        try {
                const { data } = await axios.get(`${url}/data/problems`, {'Access-Control-Allow-Origin':'*'});
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
                const { data } = await axios.put(`${url}/data/solve`,{
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
        const topics = ["Logic", "General Knowledge"];
        const [results,setResults] = useState([]);
        const [team, setTeam] = useState({_key:"", players:[], points:"", solved:[]});
        const [flag, setFlag] = useState("");
        useLayoutEffect(()=>{
                if(props.rerender)
                        props.setRerender(false);
                pullProblems(results,setResults);
                pullTeam(props.team,team,setTeam);
        },[results,team,props.team,props.rerender, props]);

        return (
                <>
                        {topics.map(topic =>
                        <>
                                <h1>{topic}</h1>
                                        {results.map(x=>{ return (x.cg === topic?
                                        <div className={team.solved.filter(y=>y===x._key).length > 0? "solved":"problem"}>
                                                <h2>{x.points}</h2>
                                                <div className="problemcontent">
                                                        <h1>{x._key}</h1>
                                                        <p>{x.description}</p>
                                                        {x.path !== "none"?<a href={x.path} download className="btn" target='_blank' rel="noreferrer" >Problem Files</a>:<div/>}
                                                        <form onSubmit={e=>{
                                                                e.preventDefault();
                                                                solveProblem(x._key,flag,team._key);
                                                                props.setRerender(true);
                                                        }}>
                                                                <input name="search" placeholder="nsbe_ctf{flag}" type="text" onChange={e=>{
                                                                        setFlag(e.target.value);
                                                                }}/>
                                                                <input type="submit"/>
                                                        </form>
                                                </div>
                                        </div>:<div/>
                        );})}
                        </>
                        )}
                </>
        );
}

function Scoreboard(props) {
        
        const [results, setResults] = useState([]);

        useLayoutEffect(() => {
                pullAllTeams(results,setResults);
        }, [results, props.rerender])

        return (
                <>
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
                <div className={"problem"}>
                                <h2>Delete</h2>
                                <div className="problemcontent">
                                        <h1>Delete From Database</h1>
                                        <label>Clear Teams</label>
                                        <form onSubmit={e=>{
                                                e.preventDefault();
                                                deleteTeams();
                                        }}>
                                        <input type="submit"/>
                                        </form>
                                        <label>Clear Problems</label>
                                        <form onSubmit={e=>{
                                                e.preventDefault();
                                                deleteProblems();
                                        }}>
                                        <input type="submit"/>
                                        </form>
                                </div>
                        </div>
                </>
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

export { Auth, Problems, Scoreboard }
