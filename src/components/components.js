import axios from 'axios';
/**
 * @return {JSON Object Array}
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
                const { data } = await axios.post(`http://localhost:5000/data/teams`, {
                        teamName: teamName,
                        players:players
                }, {'Access-Control-Allow-Origin':'*'});
                return data.teamFound;
        } catch (e) {
                return console.error(e);
        }
}


/**
 * @return {JSON Object Array}
 * {_key, flag, desc, points, path}
 * _key: string
 * flag: string
 * desc: string
 * points: int
 * path: string
 */
async function pullProblems() {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/problems`, {'Access-Control-Allow-Origin':'*'});
                return data;
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

function Home(props) {
        return (
                <>

                </>
        );
}

function Auth(props) {
        const [team, setTeam] = useState("");
        const [numPlayers, increment] = useState(1);
        const [login, setLogin] = (false);

        useEffect(()=>{

        },[login]);

        return (
                <div className="auth">
                        <div className="authform">
                                {
                                        login?
                                        <form onSubmit={e=>{
                                                e.preventDefault();
                                        }}>

                                        </form>:
                                        <form>

                                        </form>
                                }
                        </div>
                </div>
        );
}

export { Home, Auth }