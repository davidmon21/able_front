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

function fetchReducer(state,action){
  switch(action.type){
    case 'STRUCTURE_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STRUCTURE_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STRUCTURE_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }

}

function BookMenu({setBook,setChapter,book,structure}) {  
  return (
    <div>
    <select onChange={(e) => {
      setBook(e.target.value)
      setChapter(1)
    }
    }
    >
      {(Object.keys(structure.data)).map( (item) => (
        <option value={item}>{structure.data[item]['name']} </option> 
      ))}
    </select>
    { structure.data[book] ? 
    (<select onChange={(e) => setChapter(e.target.value)} >
      {(Object.keys(structure.data[book]["chapters"])).map( (item) => (
        <option value={item}>{item} </option> 
      ))}
    
    </select>) : (<p>Loading</p>)
    }
    </div>
  )
}



function App() {
  const [book, setBook] = React.useState('Gen')
  const [chapter, setChapter] = React.useState('1')
  const [version, setVersion] = useSemiPersistentState('version', 'DRC');

  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}`);
  
  const [structure, dispatchStructure] = React.useReducer(fetchReducer, { data: [], isLoading: false, isError: false })
  
  
  const handleFetchStructure = React.useCallback( async () => {
    dispatchStructure({type: "STRUCTURE_FETCH_INIT"})
    try {
      const result = await axios.get(`${url}book_list?version=${version}`)
      dispatchStructure({type: "STRUCTURE_FETCH_SUCCESS", payload: result.data})
    } catch {
      dispatchStructure({type: "STRUCTURE_FETCH_FAILURE"})
    }
  },[url])

  React.useEffect(() => {
    handleFetchStructure();
  }, [handleFetchStructure]);

  return (
    <div className="App">
      <header className="App-header">
        <div>
              { structure.isError && <p>Something went wrong..</p>}
              { structure.isLoading ? (<p>Loading ...</p>) : (
                <div>
                <BookMenu setBook={setBook} setChapter={setChapter} book={book} structure={structure}  />
                </div>
              )}
        </div>
      </header>
    </div>
  );
}

export default App;
