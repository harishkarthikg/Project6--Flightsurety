
var Test = require('../config/testConfig.js');
// var BigNumber = require('bignumber.js');
var Web3 = require('web3');
// const web3 = new Web3(ganache.provider());

const faker = require('faker');



contract('Flight Surety Tests', async (accounts) => {

  const oracles_test_no = 20;
  var config;
  var flightTimestamp;  
  const airline5 = accounts[0];
  

  before('setup contract', async () => {
    config = await Test.Config(accounts);
    await config.flightSuretyData.authorizeCaller(config.flightSuretyApp.address, { from: accounts[0] });
  });

  /****************************************************************************************/
  /* Operations and Settings                                                              */
  /****************************************************************************************/

  it(`App contract is authorized by Data contract`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isAuthorized.call(config.flightSuretyApp.address);
    assert.equal(status, true, "App contract should be authorized");

  });

  it(`(multiparty) has correct initial isOperational() value`, async function () {

    // Get operating status
    let status = await config.flightSuretyData.isOperational.call();
    assert.equal(status, true, "Incorrect initial operating status value");

  });

  it(`(multiparty) can block access to setOperatingStatus() for non-Contract Owner account`, async function () {

      // Ensure that access is denied for non-Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false, { from: config.testAddresses[2] });
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, true, "Access not restricted to Contract Owner");
            
  });

  it(`(multiparty) can allow access to setOperatingStatus() for Contract Owner account`, async function () {

      // Ensure that access is allowed for Contract Owner account
      let accessDenied = false;
      try 
      {
          await config.flightSuretyData.setOperatingStatus(false);
      }
      catch(e) {
          accessDenied = true;
      }
      assert.equal(accessDenied, false, "Access not restricted to Contract Owner");
      
  });

  it(`(multiparty) can block access to functions using requireIsOperational when operating status is false`, async function () {

      await config.flightSuretyData.setOperatingStatus(false);

      let reverted = false;
      try 
      {
          await config.flightSurety.setTestingMode(true);
      }
      catch(e) {
          reverted = true;
      }
      assert.equal(reverted, true, "Access not blocked for requireIsOperational");      

      // Set it back for other tests to work
      await config.flightSuretyData.setOperatingStatus(true);

  });

  it('Contract owner registered when deployed', async () => {
    let airlinesCount = await config.flightSuretyData.airlinesCount.call(); 
    let isAirline = await config.flightSuretyData.isAirline.call(accounts[0]); 
    assert.equal(isAirline, true, "First airline registered at contract deploy.");
    assert.equal(airlinesCount, 1, "Airlines count to be after deploy.");
  });

  it('airline can register a flight using registerFlight()', async () => {
    // ARRANGE
    flightTimestamp = Math.floor(Date.now() / 1000); 

    // ACT
    try {
        await config.flightSuretyApp.registerFlight("CODE123", "Airindia", flightTimestamp, {from: config.firstAirline});
    }
    catch(e) {
      console.log(e);
    }
  });

  it("(passenger) may pay up to 1 ether for purchasing flight insurance.", async () => {
    // ARRANGE
    let price = await config.flightSuretyData.insurance_limit.call();

    // ACT
    try {
        await config.flightSuretyData.buy("CODE123", {from: config.firstPassenger, value: price});
    }
    catch(e) {
      console.log(e);
    }

    let registeredPassenger = await config.flightSuretyData.passengerAddresses.call(0); 
    assert.equal(registeredPassenger, config.firstPassenger, "Passenger should be added to list of people who bought a ticket.");
  });

  it("Upon startup, 20+ oracles are registered and their assigned indexes are persisted in memory", async () => {
    // ARRANGE
    let fee = await config.flightSuretyApp.REGISTRATION_FEE.call();

    // ACT
    for(let a=20; a < (oracles_test_no+20); a++) {      
      await config.flightSuretyApp.registerOracle({ from: accounts[a], value: fee});
      let result = await config.flightSuretyApp.getMyIndexes.call({ from: accounts[a]});
      assert.equal(result.length, 3, 'Oracle should be registered with three indexes');
    }
  });


  it('(airline) fifth airline (registered) cannot participate when unfunded ', async () => {
    // ARRANGE

    const airline7 = accounts[7];
    let reverted = false;

    // ACT
    try {
        await config.flightSuretyApp.registerAirline(airline7, faker.company.name(), {from: airline5, gas: 200000});
    } catch (e) {
        reverted = true;
    }

    // ASSERT
    assert.equal(reverted, true, "A registered airplane cannot participate when unfunded");
});

  it('(airline) cannot register an Airline using registerAirline() if it is not funded', async () => {
    // ARRANGE
    let newAirline = accounts[1];
    let reverted = false;
    // ACT
    try {
        await config.flightSuretyApp.registerAirline(newAirline, faker.company.name(), {from: config.firstAirline});
    } catch (e) {
        reverted = true;
    }
    let result = await config.flightSuretyData.isAirline.call(newAirline);

    // ASSERT
    assert.equal(reverted, true, "Transaction should revert if unfunded airline attempts a registration");
    assert.equal(result, false, "Airline should not be registered by another airline that is unfunded");
  });

});
