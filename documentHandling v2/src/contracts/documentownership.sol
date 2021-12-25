// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "./documentmodify.sol";
import "./erc721.sol";

contract DocumentOwnership is DocumentModify, ERC721 {

  mapping (uint => address) documentApprovals;

  function balanceOf(address _owner) external view override returns (uint256) {
    return ownerDocumentCount[_owner];
  }

  function ownerOf(uint256 _tokenId) external view override returns (address) {
    return documentToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerDocumentCount[_to]++;
    ownerDocumentCount[_from]--;
    documentToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transferFrom(address _from, address _to, uint256 _tokenId) external override {
    require (documentToOwner[_tokenId] == msg.sender || documentApprovals[_tokenId] == msg.sender);
    _transfer(_from, _to, _tokenId);
  }

  function approve(address _approved, uint256 _tokenId) external payable override onlyOwnerOf(_tokenId) {
    documentApprovals[_tokenId] = _approved;
    emit Approval(msg.sender, _approved, _tokenId);
  }

}
