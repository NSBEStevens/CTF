import { useEffect, useState } from 'react';
import './App.css';
import { Auth, Problems, Scoreboard, ChallengeForm } from './components/components'
import { Display } from './components/componentPicker';

function Nav(props) {
  return (
    <div>
      <div className="nav">
        <img src={"nsbebanner.jpg"} alt="NSBE Banner"/>
        <ul>
          {
            props.nav.map(x=>{
              return (<li key={x.page}>
                <button className={"nava"} onClick={() => props.setPage(x.page)}>{x.title}</button>
              </li>)
            })
          }
        </ul>
      </div>
      <Display component={props.page} info={props.nav}/>
    </div>
  );
}

function WebPage(props) {
  const [rerender, setRerender] = useState(false);
  const [page, setPage] = useState(-1);
  const [team, setTeam] = useState("");
  const nav = [
    { page: 0, title: "Scoreboard", component: <Scoreboard page={page} rerender={rerender} setRerender={setRerender}/> },
    { page: 1, title: "Problems", component: <Problems setPage={setPage} team={team} rerender={rerender} setRerender={setRerender}/> },
    { page: 2, title: "", component: <ChallengeForm team={team} rerender={rerender} setRerender={setRerender}/> }
  ];
  useEffect(() => {

  },[page]);

  return (
    <div>
      {page === -1? <Auth setPage={setPage} team={team} setTeam={setTeam}/>:<div/>}
      <Nav setPage={setPage} nav={nav} page={page}/>
    </div>
  );
}

export default WebPage;
