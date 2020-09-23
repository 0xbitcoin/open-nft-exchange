const NametagToken = artifacts.require("NametagToken");
const OpenNFTExchange = artifacts.require("OpenNFTExchange");




const Web3 = require('web3')
// Instantiate new web3 object pointing toward an Ethereum node.
let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var web3utils = web3.utils;

var nametagContract;
var assetId;

contract('NametagToken', function(accounts) {


    it("can deploy ", async function () {


      nametagContract = await NametagToken.deployed();


  }),




  it("can be minted", async function () {

    //var contract = await NametagToken.deployed();

    var phrase = 'toast';

  //  var digest =  phraseToTokenIdHex(phrase)


    var digest = '0x1c92591eed689492cee3417e45c874412ff7ae6243b8be23afccad4f23c1b7f2'

    console.log('token id is ',digest)

    var contractFoundId = await nametagContract.nameToTokenId(phrase);
    var contractFoundHex = web3utils.numberToHex(contractFoundId);

    assetId = contractFoundHex;

    assert.equal(digest,contractFoundHex)


  });


});


contract('OpenNFTExchange', function(accounts) {

  it("can deploy ", async function () {

    console.log( 'deploying exchange' )
    openNFTExchange = await OpenNFTExchange.deployed();

    console.log('nametagcontract is ',nametagContract.address)
    assert.isNotNull(nametagContract.address)

    var nftContractAddress = nametagContract.address;

    try {
      await openNFTExchange.depositNFT(nftContractAddress, assetId) ;
    } catch (error) {
      assert.fail("Method Reverted", "depositNFT",  error.reason);
    }

    try {
      await openNFTExchange.withdrawNFT(nftContractAddress, assetId) ;
    } catch (error) {
      assert.fail("Method Reverted", "withdrawNFT",  error.reason);
    }






    })


});



/*
This method is crucial for all apps and dapps that will implement NametagToken (NTT)

This method allows the dapp to take a 'nametag' phrase (@bob) and get the hex token id for that phrase
Then, the dapp can ask the contract for the owner of the token with that id!   This is the account holding the nametag
*/

function phraseToTokenIdHex(phrase)
{
  var phraseBytes32 = web3utils.asciiToHex(phrase)

  var paddedPhraseBytes32 = web3utils.rightPad(phraseBytes32,64)

  var digest =  web3utils.soliditySha3(paddedPhraseBytes32 )

  return digest;
}



function leftPad(value, length) {
    return (value.toString().length < length) ? leftPad("0"+value, length):value;
}




async function printBalances(accounts) {
  // accounts.forEach(function(ac, i) {
     var balance_val = await (web3.eth.getBalance(accounts[0]));
     console.log('acct 0 balance', web3utils.fromWei(balance_val.toString() , 'ether') )
  // })
 }
