import { useState } from 'react';
import './App.css';
import { Display } from './components/componentPicker'
import { Home } from './components/components'

const nav = [
  {
    page:0,
    title:"Home",
    component: Home
  }
];

function Nav(props) {

  return (
    <div className="nav">
      <ul>
        {
          nav.map(x=>{
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
  const [page, setPage] = useState(0);
  return (
    <div>
      <Nav setPage={setPage}/>
      <Display component={page} info={nav}/>
    </div>
  );
}

export default WebPage;
