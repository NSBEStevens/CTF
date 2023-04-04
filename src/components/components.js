/**
 * @return {JSON Object Array}
 * {_key, players, points, solved}
 * _key: string
 * players: string[]
 * points: int
 * solved: string[]
 */
function pullTeams() {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/teams`, {'Access-Control-Allow-Origin':'*'});
                setResults(data);
        } catch (e) {
                console.log(e);
        }
        return data;
}


/**
 * @param {string} teamName 
 * @param {string[]} players
 * @return {boolean}
 */
function makeTeam(teamName,players) {
        try {
                const { data } = await axios.post(`http://localhost:5000/data/teams`, {
                        teamName: teamName,
                        players:players
                }, {'Access-Control-Allow-Origin':'*'});
                setResults(data);
        } catch (e) {
                console.log(e);
        }
        return data.teamFound;
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
function pullProblems() {
        try {
                const { data } = await axios.get(`http://localhost:5000/data/problems`, {'Access-Control-Allow-Origin':'*'});
                setResults(data);
        } catch (e) {
                console.log(e);
        }
        return data;
}

function Home(props) {
        return (
                <>

                </>
        );
}

export { Home }