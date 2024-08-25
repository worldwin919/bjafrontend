import React, { useState , useEffect  } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const rollNumber = "21BCE3732"; // Replace with your actual roll number


  useEffect(() => {
    document.title = `: ${rollNumber}`;
  }, [rollNumber]);


  const handleSubmit = async () => {
    try {
      // Validate JSON input
      const parsedData = JSON.parse(jsonInput);

      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        throw new Error('Invalid JSON: Missing "data" field.');
      }

      // Call the backend API
      const response = await axios.post(
        "https://bjabackend.onrender.com",
        parsedData
      );
      setResponseData(response.data);
      setError('');
    } catch (e) {
      setError(e.message);
      setResponseData(null);
    }
  };

  const handleSelectChange = (event) => {
    const { options } = event.target;
    const selected = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { numbers, alphabets, highest_lowercase_alphabet } = responseData;
    let displayData = [];

    if (selectedOptions.includes('Numbers')) {
      displayData.push(...numbers);
    }
    if (selectedOptions.includes('Alphabets')) {
      displayData.push(...alphabets);
    }
    if (selectedOptions.includes('Highest lowercase alphabet')) {
      displayData.push(...highest_lowercase_alphabet);
    }

    return (
      <div>
        <h3>Response:</h3>
        <pre>{JSON.stringify(displayData, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <h1>Vishu's JSON Data Processor</h1>
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON here, e.g., {"data": ["A", "B", "1", "z"]}'
        rows="6"
        cols="50"
      />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      <br />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseData && (
        <div>
          <label>Select Options:</label>
          <select multiple={true} onChange={handleSelectChange}>
            <option value="Alphabets">Alphabets</option>
            <option value="Numbers">Numbers</option>
            <option value="Highest lowercase alphabet">Highest lowercase alphabet</option>
          </select>
          {renderResponse()}
        </div>
      )}
    </div>
  );
}

export default App;
