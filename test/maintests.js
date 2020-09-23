
// old
//const NametagToken = artifacts.require("NametagToken");
//const OpenNFTExchange = artifacts.require("OpenNFTExchange");

//https://medium.com/@adrianmcli/migrating-your-truffle-project-to-web3-v1-0-ed3a56f11a4

// v1.0
const { getWeb3, getContractInstance } = require("./web3helpers")
const web3 = getWeb3()
const getInstance = getContractInstance(web3)



//const Web3 = require('web3')
// Instantiate new web3 object pointing toward an Ethereum node.
//let web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

var web3utils = web3.utils;

var nametagContract;
var assetId;
var myAccount;



//contract('NametagToken', function(accounts) {

//const nametagTests = require('./nametag.js');

contract('OpenNFTExchange',(accounts) => {

  var nametagContract;
  var openNFTExchange;


  it(" can deploy ", async () => {
    nametagContract = getInstance("NametagToken");
    openNFTExchange = getInstance("OpenNFTExchange");

    console.log('nametagcontract is ',nametagContract.options.address)


    myAccount = accounts[0];
      console.log('my acct ', myAccount )




    assert.ok(nametagContract);
    assert.ok(openNFTExchange);
  }),




  it("nametag can be minted", async function () {

    //var contract = await NametagToken.deployed();

    var phrase = 'toastyas';

  //  var digest =  phraseToTokenIdHex(phrase)


    //var digest = '0x1c92591eed689492cee3417e45c874412ff7ae6243b8be23afccad4f23c1b7f2'


  //  myContract.methods.myMethodName().call()


  balance = await web3.eth.getBalance(myAccount);
  console.log('balance is ', balance)



    var nfTokenId = await nametagContract.methods.nameToTokenId(phrase).call();
    var nfTokenHex = web3utils.numberToHex(nfTokenId);


    try {
      await nametagContract.methods.claimToken( myAccount, phrase ).send({from: myAccount,gas:3000000});
    } catch (error) {
      console.log(error)
      assert.fail("Method Reverted", "claimtoken",  error.reason);
    }

    console.log('my nft balance ', await nametagContract.methods.balanceOf(myAccount).call())
    assert.equal( await nametagContract.methods.balanceOf(myAccount).call(), 1)
    assert.equal( await nametagContract.methods.ownerOf(nfTokenId).call(), myAccount)

    assetId = nfTokenId;

  //  assert.equal(digest,nfTokenHex)


  });




  it("can approve  ", async function () {

    assert.isNotNull(nametagContract.options.address)

    var nftContractAddress = nametagContract.options.address;


    assert.equal( await nametagContract.methods.ownerOf(assetId), myAccount),call()


    try {

      await nametagContract.methods.approve(OpenNFTExchange.address, assetId).send({ from: myAccount })
    } catch (error) {
      assert.fail("Method Reverted", "approve",  error.reason);
    }

/*
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

*/




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
