import { useEffect, useRef, useState } from 'react';
import './App.css';
import { Problems } from './components/components'
import { Display } from './components/componentPicker';
import { Scoreboard } from './Scoreboard/scoreboard'
import { Auth } from './components/components'

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
    </div>
  );
}

function WebPage(props) {
  const [page, setPage] = useState(-1);
  const nav = [
    { page: 0, title: "Scoreboard", component: <Scoreboard/> },
    { page: 1, title: "Problems", component: <Problems/> }
  ];
  useEffect(() => {

  },[page]);

  return (
  return (page === -1?
    <Auth/>:
    <div>
      <Nav setPage={setPage} nav={nav}/>
      <Display component={page} info={nav}/>
    </div>
  );
}

export default WebPage;
