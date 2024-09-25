import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState("");

  useEffect(() => {
    // Fetch data from the server every 2 seconds
    const interval = setInterval(() => {
      axios
        .get("http://localhost:5000/api/data")
        .then((response) => {
          setData(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, 2000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ color: "orange" }}>ODC IOT App</h1>
        <h2>Here is the data received:</h2>
        <p className="data-box">{data ? data : "Waiting for data..."}</p>
      </header>
    </div>
  );
}

export default App;
