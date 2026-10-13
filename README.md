# ZCAM QA Assignment

QA Assigment for testing web UI and API calls.

## About tests

Configuration for all tests are specified in **[.env](.env)**

### API tests

API tests are using APIO calls from https://petstore.swagger.io/v2/ page.
Files related to web page are located in **[api](api)** subdirectory.
Tests are located inside **[api](tests/api)** directory.

### UI tests

UI tests are created using https://opensource-demo.orangehrmlive.com web page.
Files related to web page are located in **[ui](ui)** subdirectory.
Tests are located inside **[ui](tests/ui)** directory.

## Basic commands

```bash
# Prepare environment
npm i
npx playwright install --with-deps

# Execute all tests test suite
npm run test

# Execute just UI tests test suite
npm run test:ui

# Execute just APIO tests test suite
npm run test:api

# View HTML Execution Report (display HTML report for last executed tests)
npm run report
```

## CI/CD

Example of **[Github action](.github/workflows/playwright.yml)**
## Problems and notes

- Because we are testing public web sites, it is possible that data from other users are returned. All main data should be as unique as possible.
- Obviously, web page used to executed UI tests is running on a low resources and sometimes timeout occurs.
  Maybe, web site even slow down too much traffic from the same IP address.
- To change UI tests environments used, update '**projects**' section in '**[playwright.config.ts](playwright.config.ts)**'
- I prefer writing test case which prepare and clean the environment and are not dependent on other test cases.  
  For instance, to test create, update, get and delete pet I would rather create single more complex test case that 4 of them which must be executed
  in specific order.
- Tests are at the end probably part of web application code repository and are executed on test deployment
- Probably some load tests should be executed too but I don't want to test that on this public servers.
  Example for API tests is **API-PET-11** in **[pet.spec.ts](tests/api/pet.spec.ts)**
  We could use **[Artillery](https://www.artillery.io/)** for that.
  

