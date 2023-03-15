import { useState } from 'react';
import './App.css';

const nav = [
  {
    page:0,
    title:"Home"
  }
];

function Nav(props) {
  const [drawer, toggle] = useState(false);

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
      {/*eslint-disable-next-line*/}
      <button className="nava" onClick={() => {
                toggle(!drawer)
            }}>
      <img src={!drawer? "forward-arrow.svg" : "backward-arrow.svg"} className={drawer? "arrow1" : "arrow2"}></img>
      </button>
    </div>
  );
}

function WebPage(props) {
  const [page, setPage] = useState(0);
  return (
    <div>
      <Nav setPage={setPage}/>
    </div>
  );
}

export default WebPage;
