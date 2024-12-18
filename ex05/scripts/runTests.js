import axios from "axios";
import { readFileSync } from "fs";

// Load the JSON test definitions
const tests = JSON.parse(readFileSync("./automated_tests.json", "utf8"));

// Function to execute each test
async function runTest(test) {
  try {
    const { method, url, headers, body } = test.request;

    // Log the test being run
    console.log(`Running test: ${test.name} - URL: ${url}`);

    const options = {
      method: method,
      url: url,
      headers: headers || {},
      data: body || {},
    };

    // Do the request
    const response = await axios(options);
    console.log(` ${test.name} - Status: ${response.status}`);
    console.log(response.data);
  } catch (error) {
    // Check
    if (error.response) {
      console.log(` ${test.name} - Status: ${error.response.status}`);
      console.log(error.response.data);
    } else {
      console.log(` ${test.name} - Error: ${error.message}`);
    }
  }
}

async function runTests() {
  for (const test of tests) {
    await runTest(test);
  }
}

runTests();
