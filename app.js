const axios = require("axios");
const json2csv = require("json2csv");
const fs = require("fs");

let city = "Nabeul";
const apiKey = "f10084720069001239174ff043889392";
const apiUrl =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  city +
  "&appid=" +
  apiKey +
  "&units=metric";

function fetchDataAndAppendToCSV() {
  axios
    .get(apiUrl)
    .then((response) => {
      const data = {
        temp: response.data.main.temp,
        humidity: response.data.main.humidity,
        visibility: response.data.visibility,
        wind: response.data.wind.speed,
      };

      // Convert the new data to CSV format
      const csvData = json2csv.parse(data);

      // Read the existing data from the "data.csv" file (if it exists)
      fs.readFile("data.csv", (err, existingData) => {
        if (err) {
          console.error("Error reading data.csv: " + err);
          existingData = ""; // Initialize as an empty string
        }

        // Append the new data to the existing data (with a newline if necessary)
        const newData = existingData + (existingData ? "\n" : "") + csvData;

        // Write the combined data back to the "data.csv" file
        fs.writeFile("data.csv", newData, (writeErr) => {
          if (writeErr) {
            console.error("Error writing data to data.csv: " + writeErr);
          } else {
            console.log("Data appended to data.csv");
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data: " + error);
    });
}

// Initial data fetch and append
fetchDataAndAppendToCSV();

// Schedule the function to run every second (1000 milliseconds)
setInterval(fetchDataAndAppendToCSV, 100);
