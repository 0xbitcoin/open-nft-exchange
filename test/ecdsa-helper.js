
var web3utils = require('web3-utils')
const ethUtil = require('ethereumjs-util')
var ethSigUtil = require('eth-sig-util')
var EIP712Helper = require("./eip712-helper");


/*

  1) signTypedData - accepts data and signs it with the private key just like Metamask

  2)TODO recoverSignerAddress



*/



module.exports = class ECDSAHelper{




  static signTypedData(msgParams,privateKey)
  {

    const msgHash = ethSigUtil.typedSignatureHash(msgParams.data)
    console.log('msghash1',msgHash)

    var msgBuffer= ethUtil.toBuffer(msgHash)

    const sig = ethUtil.ecsign(msgBuffer, privateKey)
    return ethUtil.bufferToHex(ethSigUtil.concatSig(sig.v, sig.r, sig.s))

  }



 static  recoverTypedSignature(params)
 {

    return ethSigUtil.recoverTypedSignature(params)

 }


 /**
 * @param typedData - Array of data along with types, as per EIP712.
 * @returns Buffer

function typedSignatureHash(typedData) {
  const error = new Error('Expect argument to be non-empty array')
  if (typeof typedData !== 'object' || !typedData.length) throw error

  const data = typedData.map(function (e) {
    return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
  })
  const types = typedData.map(function (e) { return e.type })
  const schema = typedData.map(function (e) {
    if (!e.name) throw error
    return e.type + ' ' + e.name
  })

  return ethAbi.soliditySHA3(
    ['bytes32', 'bytes32'],
    [
      ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
      ethAbi.soliditySHA3(types, data)
    ]
  )
}
 */




 static getBidPacketSchemaHash()
 {
  //  var hardcodedSchemaHash = '0x8fd4f9177556bbc74d0710c8bdda543afd18cc84d92d64b5620d5f1881dceb37' ;
    return hardcodedSchemaHash;
 }

 static getBidTypedDataHash(bid, contractAddress)
 {
   var typedData = ECDSAHelper.getTypedDataFromBid(bid, contractAddress);


   var typedDataHash = ethUtil.keccak256 (
       Buffer.concat([
           Buffer.from('1901', 'hex'),
           EIP712Helper.structHash('EIP712Domain', typedData.domain, typedData.types),
           EIP712Helper.structHash(typedData.primaryType, typedData.bid, typedData.types),
       ]),
   );

   return typedDataHash;
 }


//methodName,relayAuthority,from,to,walletAddress,tokenAddress,tokenAmount,relayerRewardToken,relayerRewardTokens,expires,nonce
 static getTypedDataFromBid( bid, contractAddress )
 {

   const domaintypes = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" },
      { name: "salt", type: "bytes32" }
  ];


  //change me !
  const currentDomainData = {
    name: "Only721",
    version: "1",
    chainId: 1,
    verifyingContract: contractAddress,
    salt: "0xb493912f33b564e014c6a3db21cef37bf544e13a7fcebd19e348216d05a0d0bc"
  }

   const typedData = {
           types: {
               EIP712Domain: domaintypes,

               OffchainBid: [
                   { name: 'bidderAddress', type: 'address' },
                   { name: 'nfTokenContract', type: 'address' },
                   { name: 'nfTokenId', type: 'uint256' },
                   { name: 'currencyTokenContract', type: 'address' },
                   { name: 'currencyTokenAmount', type: 'uint256' },
                   { name: 'expires', type: 'uint256' }
               ],
           },
           primaryType: 'OffchainBid',
           domainTypes:  {},
           domain: currentDomainData,
           bid: {
               bidderAddress: bid.bidderAddress,
               nfTokenContract: bid.nfTokenContract,
               nfTokenId: bid.nfTokenId,
               currencyTokenContract: bid.currencyTokenContract,
               currencyTokenAmount: bid.currencyTokenAmount,
               expires: bid.expires
           },
       };



     return typedData;
 }


 static bufferToHex(buffer)
 {
    return '0x' + buffer.toString('hex')
 }




     static getOffchainBid(
       bidderAddress,nfTokenContract,nfTokenId,
       currencyTokenContract,currencyTokenAmount,expires)
     {

       return {
         bidderAddress: bidderAddress,
         nfTokenContract: nfTokenContract,
         nfTokenId: nfTokenId,
         currencyTokenContract: currencyTokenContract,
         currencyTokenAmount: currencyTokenAmount,
         expires: expires
       }


     }

     static bidToTuple(bid)
     {
       return [bid.bidderAddress,bid.nfTokenContract,bid.nfTokenId,bid.currencyTokenContract,bid.currencyTokenAmount,bid.expires]
     }

     //???
     static bidHasValidSignature(bid){

       var sigHash = ECDSAHelper.getBidTypedDataHash(bid);


       var msgBuf = ethjsutil.toBuffer(packetData.signature)
       const res = ethjsutil.fromRpcSig(msgBuf);


       var hashBuf = ethjsutil.toBuffer(sigHash)

       const pubKey  = ethjsutil.ecrecover(hashBuf, res.v, res.r, res.s);
       const addrBuf = ethjsutil.pubToAddress(pubKey);
       const recoveredSignatureSigner    = ethjsutil.bufferToHex(addrBuf);


       //make sure the signer is the depositor of the tokens
       return packetData.from.toLowerCase() == recoveredSignatureSigner.toLowerCase();

     }




  /*

  ethSigUtil.recoverTypedSignature: function (msgParams) {
   const msgHash = typedSignatureHash(msgParams.data)
   const publicKey = recoverPublicKey(msgHash, msgParams.sig)
   const sender = ethUtil.publicToAddress(publicKey)
   return ethUtil.bufferToHex(sender)
 }




 function typedSignatureHash(typedData) {
   const error = new Error('Expect argument to be non-empty array')
   if (typeof typedData !== 'object' || !typedData.length) throw error

   const data = typedData.map(function (e) {
     return e.type === 'bytes' ? ethUtil.toBuffer(e.value) : e.value
   })
   const types = typedData.map(function (e) { return e.type })
   const schema = typedData.map(function (e) {
     if (!e.name) throw error
     return e.type + ' ' + e.name
   })



 console.log('schema',new Array(typedData.length).fill('string'),schema)
   console.log('schema subhash',ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema).toString('hex'))

   console.log('types',types, data)
   console.log('types subhash',ethAbi.soliditySHA3(types, data).toString('hex'))


   console.log("hash1", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   ))

   //need to hardcode the 0x64fcd ... into solidity !!
   console.log("hash2", ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       '0x313236b6cd8d12125421e44528d8f5ba070a781aeac3e5ae45e314b818734ec3',
       ethAbi.soliditySHA3(types, data)
     ]
   ))


   return ethAbi.soliditySHA3(
     ['bytes32', 'bytes32'],
     [
       ethAbi.soliditySHA3(new Array(typedData.length).fill('string'), schema),
       ethAbi.soliditySHA3(types, data)
     ]
   )
 }




  */



}
