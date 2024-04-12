import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  // State to store the count of port calls
  const [portCallCount, setPortCallCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch('sampleData.json');
      const data = await response.json();
      // Set the count of port calls in the state
      setPortCallCount(data.portCalls.length);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        There are {portCallCount} port calls
      </header>
    </div>
  );
}

export default App;
