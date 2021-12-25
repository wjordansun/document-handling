const DocumentHandling = artifacts.require("DocumentHandling");

module.exports = async function(deployer) {
	//deploy contract
  await deployer.deploy(DocumentHandling)
	//assign contract into variable if needed
  //const contractName = await contractName.deployed()

	//call functions needed to set up dapp using the variable created above
  //make sure to use the await keyword
};