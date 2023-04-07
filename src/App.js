import { useEffect, useState } from 'react';
import './App.css';
import { Auth, Problems, Scoreboard } from './components/components'
import { Display } from './components/componentPicker';

function Nav(props) {
  return (
    <div className="nav">
      <ul>
        {
          props.nav.map(x=>{
            return (<li key={x.page}>
              <button className={"nava"} onClick={() => props.setPage(x.page)}>{x.title}</button>
            </li>)
          })
        }
      </ul>
      <Display component={props.page} info={props.nav}/>
    </div>
  );
}

function WebPage(props) {
  const [page, setPage] = useState(-1);
  const [team, setTeam] = useState("");
  const nav = [
    { page: 0, title: "Scoreboard", component: <Scoreboard page={page}/> },
    { page: 1, title: "Problems", component: <Problems team={team}/> }
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
