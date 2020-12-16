# FlightSurety

FlightSurety is a sample application project for Udacity's Blockchain course.

#### Program version numbers

* Node.js v12.13.0
* Solidity v0.4.25
* Truffle v5.1.56
* Ganache v2.4.0
* truffle-hdwallet-provider v1.0.2
* Web3 v1.2.6


## Install
This repository contains 
- Smart Contract code in Solidity (using Truffle)
- Tests (also using Truffle)
- dApp scaffolding (using HTML, CSS and JS)
- Server app scaffolding.

## Installation

`npm install`

`truffle compile`


## Steps to be followed: 

Should launch Ganache with the following mnemonic:

Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
Port: 8545


## Develop Client

### To run tests:
- Edit truffle-config.js and save the file: 
  - Comment line: 7-9
  - Uncomment line: 10-11

Use the following command: 

`truffle compile`

`truffle migrate --reset`

`truffle test ./test/flightSurety.js`

`truffle test ./test/oracles.js`

### To launch dapp:
- Edit truffle-config.js and save the file: 
  - Uncomment line: 7-9
  - Comment line: 10-11

Use the following command: 

`truffle migrate --reset`

`npm run server`

`npm run dapp`


View dapp in the following address:

`http://localhost:8000`

Deploy the contents of the ./dapp folder


## Steps for Testing the Dapp
- Once the app is launched the app, make sure the Operational Status is true
- Fund the Airlines with 10 Ether in order to be opertional 
- Register the Airlines under the Airline registration 
- Registration of Fifth airline requires atleast 5 votes
- Select a new account and fund 10 ETH in order to add funds to the airline
- Change the metamask account to passenger account(no:10 as mentioned in testconfig and add minimum of 1 Ether to buy insurance 
- Change the status of airline to delayed (by default it is on time)
- Enter/Select the Airline, Address and Flight Number to submit to oracles
 -With the passenger account in metamask check and claim credit
 

## Resources

* [Ethereum documentation](https://ethereum.org/en/developers/docs/)
* [Github Udacity community](https://github.com/)
* [Webpack Issue](https://github.com/webpack/webpack-dev-server/issues/1404)
* [Stack overflow- Node issue support](https://stackoverflow.com/questions/52714984/why-to-use-webpack-node-externals-in-node)
* [Udacity knowledge board](https://knowledge.udacity.com/?nanodegree=nd1309&page=1&project=564&rubric=1711) 

### Program version numbers

* Node.js v12.13.0
* Solidity v0.4.25
* Truffle v5.1.56
* Ganache v2.4.0
* truffle-hdwallet-provider v1.0.2
* Web3 v1.2.6
