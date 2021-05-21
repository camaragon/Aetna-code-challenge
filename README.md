# QA API Code Test

## About The Code

This is a code challenge from Aetna/CVS Health to test the OMDb API. This was an opportunity for me to display my skills in testing API endpoints and corresponding data. I really enjoyed building and executing these tests, as it was a bit of a refresher for me, yet I still learned a lot. Prior to building each test I pseudocoded out exactly what it is I wanted to assert within the data. I struggled a bit on the test to verify the year matches the correct format. I tried using Moment.js, but quickly realized it was deprecated. I instead decided to compare the strings length to verify format. I was also stumped on how to verify the poster image links were not broken. I learned about the `chai-http` Chai library plug-in which allowed me to follow the link and receive a resulting status code. One final error I was running into was `Uncaught SyntaxError: Unexpected token u in JSON at position 0` and/or `Uncaught SyntaxError: Unexpected token o in JSON at position 1` would display from time to time. After some research and moving some of the `JSON.parse()` around I was able to solve them.

All in all, this was a very insightful code challenge and I'm definitely proud of the work I accomplished.

![Tests Screenshot](https://user-images.githubusercontent.com/69489633/119179357-0c24d580-ba2c-11eb-817f-d71c70cac64e.png)

### Technologies Used

* Javascript
* Node.js
* Chai (Expect/Should)
* Mocha

## Getting Started

To get a local copy and execute the tests follow the steps below.

1. Clone the repo down to your local machine
```sh
git clone https://github.com/camaragon/Aetna-code-challenge.git
```

2. Install NPM packages in the repo's directory
```sh
npm install
```
3. Start the tests

Aetna-code-challenge
```sh
npm run test
```
---

# Original Task Assignment

It is time to run some tests against OMDb API - The Open Movie Database!

## Tips:

- You can find the main api page at http://www.omdbapi.com
- You must use minitest and faraday as supplied, and follow the existing pattern of api requests in test_no_api_key.
- You may add or change other gems as you see the need. (For example, 'pry' is supplied debugging but you may use another debugger.)
- Completed repo should allow for easy setup/running of your test file.
- Unique or helpful information should be documented in the readme.

## Tasks:

1. Successfully make api requests to omdbapi from within tests in api_test.rb

2. Add an assertion to test_no_api_key to ensure the response at runtime matches what is currently displayed with the api key missing

3. Extend api_test.rb by creating a test that performs a search on 'thomas'.

  - Verify all titles are a relevant match
  - Verify keys include Title, Year, imdbID, Type, and Poster for all records in the response
  - Verify values are all of the correct object class
  - Verify year matches correct format

4. Add a test that uses the i parameter to verify each title on page 1 is accessible via imdbID

5. Add a test that verifies none of the poster links on page 1 are broken

6. Add a test that verifies there are no duplicate records across the first 5 pages

7. Add a test that verifies something you are curious about with regard to movies or data in the database.
