// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./ownable.sol";

contract DocumentCreation is Ownable {

  event NewDocument(uint documentId, string name, uint age);

  struct Document {
    string name;
    uint age;
  }

  Document[] public documents;

  mapping (uint => address) public documentToOwner;
  mapping (address => uint) public ownerDocumentCount;

  function createDocument(string memory _name, uint _age) external {
    documents.push(Document(_name, _age));
    uint id = documents.length - 1;
    documentToOwner[id] = msg.sender;
    ownerDocumentCount[msg.sender]++;
    emit NewDocument(id, _name, _age);
  }
}
