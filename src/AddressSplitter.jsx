import React, { useState } from 'react';
import Papa from 'papaparse'; // CSV parsing library

const AddressSplitter = () => {
  const [file, setFile] = useState(null);
  const [outputData, setOutputData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    Papa.parse(selectedFile, {
      complete: (result) => {
        console.log(result)
        // Process CSV data and split addresses
        const newData = result.data.map((row) => {
            const addressParts = row[0].split(', ');  
            // Extract postcode from the last 6 digits of the last element
            const lastPart = addressParts[addressParts.length - 1];
            const postcode = lastPart.slice(-6);
            addressParts[addressParts.length - 1] = lastPart.slice(0, -6);
  
            // Extract state from the last element
            const state = addressParts.pop();
  
            // Extract city from the second-to-last element
            const city = addressParts.pop();
            const address2 = addressParts.length > 2 ? addressParts.pop() : '';
            // Concatenate remaining parts for address1
            const address1 = addressParts.slice(1).join(', ');

          return {
            address1,
            address2,
            city,
            state,
            postcode,
          };
        });

        setOutputData(newData);
      },
      header: false,
    });
  };

  const handleDownload = () => {
    const csvData = Papa.unparse(outputData);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'output_addresses.csv';
    a.click();
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      {outputData.length > 0 && (
        <div>
          <button onClick={handleDownload}>Download CSV</button>
          <table>
            <thead>
              <tr>
                <th>Address1</th>
                <th>Address2</th>
                <th>City</th>
                <th>State</th>
                <th>Postcode</th>
              </tr>
            </thead>
            <tbody>
              {outputData.map((row, index) => (
                <tr key={index}>
                  <td>{row.address1}</td>
                  <td>{row.address2}</td>
                  <td>{row.city}</td>
                  <td>{row.state}</td>
                  <td>{row.postcode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AddressSplitter;
