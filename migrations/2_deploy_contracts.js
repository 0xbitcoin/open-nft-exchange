var NametagToken = artifacts.require("./NametagToken.sol");
var OpenNFTExchange = artifacts.require("./OpenNFTExchange.sol");
var FixedSupplyToken = artifacts.require("./FixedSupplyToken.sol");

module.exports = function(deployer) {
  deployer.deploy(FixedSupplyToken).then(function(){

    return deployer.deploy(NametagToken).then(function(){

            // NametagToken.address
            return deployer.deploy(OpenNFTExchange)
       });
  });
};
