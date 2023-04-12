import axios from 'axios';
import {useState, useLayoutEffect, useEffect} from 'react';
/**
 * @return {JSON[]}
 * {_key, players, points, solved}
 * _key: string
 * players: string[]
 * points: int
 * solved: string[]
 */
const url = "https://www.discardsoftware.com";

// const url = "http://localhost:5000";

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
async function makeTeam(t,p1,p2,p3,setPage) {
        try {
                if(p1 === "") throw "Invalid player 1"
                await axios.post(`${url}/data/addTeam`, {
                        teamName: t.trim(),
                        player1:p1.trim(),
                        player2:p2.trim(),
                        player3:p3.trim()
                }, {'Access-Control-Allow-Origin':'*'});
                setPage(0);
                return true;
        } catch (e) {
                console.error(e);
                return false;
        }
}

async function loginReq(team, player, setPage) {
        try {
                await axios.post(`${url}/data/login`, {
                        teamName: team.trim(),
                        player:player.trim()
                }, {'Access-Control-Allow-Origin':'*'}).then(({data}) => {
                        console.log(data);
                        if(data.teamFound) {
                                if(player !== "" && (data.rows[0].player1 === player || data.rows[0].player2 === player || data.rows[0].player3 === player)){
                                        setPage(0);
                                }
                        }
                });
                
                return true;
        } catch (e) {
                console.error(e);
                return false;
        }
}

async function clearTeams() {
        try {
                await axios.post(`${url}/data/clearTeams`, {
                }, {'Access-Control-Allow-Origin':'*'});
        } catch(e) {
                console.error(e);
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
                if(results !== data){
                        setResults(data);
                }
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

function ChallengeForm(props) {
        const [page, setPage] = useState(0);
        const [flag, setFlag] = useState("");

        useEffect(()=>{
                if(page === 0) {
                        setTimeout(()=>{
                                setFlag("nsbe_ctf{patienceisavirtue}");
                        },30000);
                }
        },[page]);

        return (page === 0?
                <div>
                        <button className="problemBtn" onClick={()=>{setPage(1)}}>Click Here!!</button>
                        <p>{flag}</p>
                </div>:
                page === 1?
                <div>
                        <p>CONGRATULATIONS! You have just won an Apple iPad!</p>
                        <p>Fill out the form below to get your iPad delivered today!</p>
                        <form onSubmit={e=>{
                                e.preventDefault();
                                setPage(2);
                        }}>
                                <label for="firstName">First Name:</label>
                                <input type="text" id="firstName" name="firstName"/><br/>

                                <label for="lastName">Last Name:</label>
                                <input type="text" id="lastName" name="lastName"/><br/>
                                
                                <label for="address">Address:</label>
                                <input type="text" id="address" name="address"/><br/>

                                <label for="creditcard">Credit Card Number:</label>
                                <input type="text" id="creditCard" name="creditCard"/><br/>

                                <label for="socialSecurityNumber">Social Security Number:</label>
                                <input type="text" id="socialSecurityNumber" name="socialSecurityNumber"/><br/>

                                <label for="driverLicenseNumber">Driver License's Number:</label>
                                <input type="text" id="driverLicenseNumber" name="driverLicenseNumber"/><br/>
                                
                                <input type="submit"/>
                        </form>
                </div>:
                <div>
                        <p>Error: There was a server side error in processing the form</p>
                        <p>Please try again</p>      
                        <button className="nava" onClick={()=>{setPage(1)}}>Go Back</button>
                </div>
        );
}

function Problems(props) {
        const topics = ["Logic", "General Knowledge", "Forensics", "Cryptography"];
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
                <div className={"scroll"}>
                        {topics.map(topic =>
                        <>
                                <h1>{topic}</h1>
                                {results.map(x => { 
                                        return (x.cg === topic?
                                        <div className={team.solved.filter(y=>y===x._key).length > 0? "solved":"problem"}>
                                                <h2>{x.points}</h2>
                                                <div className="problemcontent">
                                                        <h1>{x._key}</h1>
                                                        {x._key !== "Snoop Dogg" ? <p>{x.description}</p>:<a href={"https://www.discardsoftware.com/challenge/challenge4"} className="btn" target='_blank' rel="noreferrer">{x.description}</a>}
                                                        {x.path !== "none"?<a href={x.path} download className="btn" target='_blank' rel="noreferrer">Problem Files</a>:<div/>}
                                                        {x._key === "Winner Winner"?<button onClick={()=>{props.setPage(2)}}>Problem</button>:<></>}
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
                </div>
        );
}

function Scoreboard(props) {
        
        const [results, setResults] = useState([]);

        useLayoutEffect(() => {
                pullAllTeams(results,setResults);
        }, [results, props.rerender])

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
                                makeTeam(props.team,p1,p2,p3,props.setPage)
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
                        <ul>
                                <li><button className="auth" onClick={()=>{
                                        increment(numPlayers > 2? 3: numPlayers + 1);
                                }}>Add Player</button></li>
                                <li><button className="auth" onClick={()=>{
                                        increment(numPlayers < 2? 1: numPlayers - 1);
                                }}>Remove Player</button></li>
                                <li><button className="auth" onClick={()=>{setLogin(true)}}>Already a player? Log in here</button></li>
                        </ul>
                </div>
        );

        const log = (
                <div className="authform">
                        <form onSubmit={e=>{
                                e.preventDefault();
                                loginReq(props.team,p1, props.setPage);
                        }}>
                                <input name="search" placeholder="Team Name" type="text" onChange={e=>{
                                        props.setTeam(e.target.value);
                                }}/>
                                <input  name={`Player`} placeholder={`Email`} onChange={e=>{
                                        sp1(e.target.value);
                                }}/>
                                <input type="submit"/>
                        </form>
                        <ul>
                                <li><button className="auth" onClick={()=>{setLogin(false)}}>Not a player? Sign up here!</button></li>
                        </ul>
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

export { Auth, Problems, Scoreboard, ChallengeForm }
