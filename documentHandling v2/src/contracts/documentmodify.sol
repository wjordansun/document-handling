// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./documenthelper.sol";

contract DocumentModify is DocumentHelper {
  
  modifier onlyOwnerOf(uint _documentId) {
    require(msg.sender == documentToOwner[_documentId]);
    _;
  }

  function changeName(uint _documentId, string calldata _newName) external onlyOwnerOf(_documentId) {
    documents[_documentId].name = _newName;
  }

  function changeAge(uint _documentId, uint _newAge) external onlyOwnerOf(_documentId) {
    documents[_documentId].age = _newAge;
  }
  

}
