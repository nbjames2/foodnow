FoodNow!
This is an application that will allow you and your spouse, flatmate, partner, significant other or a complete stranger share shopping lists on the go. 

Getting Started
- Download project into its own folder.
- Open terminal window in said folder or navigate to it in the terminal.
- In terminal run "npm install"

Prerequisites
- Node.js
- Postgresql

Give examples
Installing
- Create Databases by running "createdb -U postgres -w food-dev" and "createdb -U postgres -w food-test" for the test environment
- create a .env file in the root directory and add "megasecret=..." and "cookieSecret=..." putting in your own words for the elipses

Running the tests
- simply type "npm test" or "npm test <dir><filename>"

tests in the 'spec/unit' folder test core database functions for different models, while tests in the 'spec/integrations' folder test that each route is working or not working if that's the way it should be.

example:
```javascript
describe("GET <route>", () => {
    it("should ...", (done) => {
        something = something...;
        expect(something).toBe(something);
        done();
    });
});

Deployment
- Depends largely on where you are deploying it, but in any case here are the things to remember:
  - create the deployment database (how depends on the service that you use)
  - run 'sequelize db:migrate' to build the database structure
  - add the 'megasecret' and 'cookieSecret' config variables

Contributing
Not accepting contributors at this time.

Authors
Nicholas James

License
This project is licensed under the MIT License

Acknowledgments
Thanks to Bloc.io for teaching me to build