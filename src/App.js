import * as React from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';
//soon
let book = 'Gen'
const API_ENDPOINT = 'http://localhost:5000/';

function useSemiPersistentState(key,initialState){
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState);
  
  React.useEffect(() => {
    localStorage.setItem(key, value)
  }, [value,key]);

  return [value, setValue]

}

function structureSetter(state,action){
  switch(action.type){
    case 'init':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'success':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }

}


function ChapterMenu(props){
  return (
      
      <p>{props.book}</p>
    
  )
}

function BookMenu() {
  const [version, setVersion] = useSemiPersistentState('version', 'DRC');
  const [book, setBook] = React.useState('Gen')
  
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}book_list?version=${version}`);
  
  const [structure, dispatchStructure] = React.useReducer(structureSetter, { data: [], isLoading: false, isError: false })
  
  
  const handleFetchStructure = React.useCallback( async () => {
    dispatchStructure({type: "init"})
    try {
      const result = await axios.get(url)
      dispatchStructure({type: "success", payload: result.data})
    } catch {
      dispatchStructure({type: "failure"})
    }
  },[url])

  React.useEffect(() => {
    handleFetchStructure();
  }, [handleFetchStructure]);

  



  return (
    <div>
      
    <select onChange={(e) => setBook(structure.data[e.target.value]['name'])}>
      {(Object.keys(structure.data)).map( (item) => (
        <option value={item}> {structure.data[item]['name']} </option> 
                    
      ))}
      
    </select>
        <p>{book}</p>
    <ChapterMenu book={book} bookStructure={structure.data} />
    
    </div>
  )
}

function App() {
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          
        <div>
              <div>
                <BookMenu/>
                <p></p>
              </div>
              

        </div>
      
        </a>
      </header>
    </div>
  );
}

export default App;
