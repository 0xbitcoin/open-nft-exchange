var NametagToken = artifacts.require("./NametagToken.sol");
var OpenNFTExchange = artifacts.require("./OpenNFTExchange.sol");

module.exports = function(deployer) {
  deployer.deploy(NametagToken).then(function(){

      // NametagToken.address
     return deployer.deploy(OpenNFTExchange)

  });
};
