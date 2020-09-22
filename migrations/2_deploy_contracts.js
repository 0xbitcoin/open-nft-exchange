var NametagToken = artifacts.require("./NametagToken.sol");
var nftExchange = artifacts.require("./openNFTExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(NametagToken,'Nametag Token','NTT').then(function(){

      // NametagToken.address
    deployer.deploy(nftExchange)

  });
};
