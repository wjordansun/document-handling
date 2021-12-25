// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./documentcreation.sol";

contract DocumentHelper is DocumentCreation {

  function getDocumentsByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerDocumentCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < documents.length; i++) {
      if (documentToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

}
