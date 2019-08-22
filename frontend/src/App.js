import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
      <form action="http://localhost:3333/" method="post" enctype="multipart/form-data">
        <input type="file" name="contracts" />
        <input type="file" name="delayed_installments" />
        <input type="submit" value="Import"></input>
      </form>
      </header>
    </div>
  );
}

export default App;
