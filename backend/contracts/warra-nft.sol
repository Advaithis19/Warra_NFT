// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Warra_NFT is ERC721URIStorage, Ownable {
    uint256 private tokenCounter;
    mapping(address => bool) private isNominated;
    mapping(uint256 => uint256) private expiryTime;
    mapping(uint256 => address) private provider;

    event activityOnTokenCalled(
        uint256 tokenId,
        string activity,
        address caller
    );

    constructor() ERC721("e-Warranty", "e-WNFT") {
        tokenCounter = 0;
        Ownable(msg.sender);
    }

    modifier onlyOwnerOrNominated() {
        require(
            msg.sender == owner() || isNominated[msg.sender],
            "Caller is neither owner nor nominated"
        );
        _;
    }

    modifier onlyOwnerOfToken(uint256 tokenId) {
        require(
            msg.sender == getOwner(tokenId),
            "Caller is not owner of e-WNFT"
        );
        _;
    }

    modifier onlyManufacturer(uint256 tokenId) {
        require(
            msg.sender == provider[tokenId],
            "Caller is not provider of e-WNFT"
        );
        _;
    }

    // function to mint warranty NFT
    function createWarranty(string memory tokenURI, uint256 numberOfDays)
        public
        onlyOwnerOrNominated
        returns (uint256)
    {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        tokenCounter = tokenCounter + 1;

        //set manufacturer/retailer
        provider[newItemId] = msg.sender;

        // emit event
        emit activityOnTokenCalled(newItemId, "CREATE", msg.sender);

        // expiry time associated, doesn't take into account leap years
        expiryTime[newItemId] = block.timestamp + numberOfDays * 1 days;

        return newItemId;
    }

    function getOwner(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function proveOwnership(uint256 tokenId) public view returns (bool) {
        return msg.sender == getOwner(tokenId);
    }

    function transfer(address to, uint256 tokenId) public {
        // check to see validity
        require(block.timestamp <= expiryTime[tokenId], "e-WNFT has expired!");

        safeTransferFrom(msg.sender, to, tokenId);

        // emit event
        emit activityOnTokenCalled(tokenId, "TRANSFER", msg.sender);
    }

    function getURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function checkIfExists(uint256 tokenId) internal view returns (bool) {
        return _exists(tokenId);
    }

    function deleteWarranty(uint256 tokenId)
        internal
        onlyOwnerOfToken(tokenId)
    {
        _burn(tokenId);

        // emit event
        emit activityOnTokenCalled(tokenId, "DELETE", msg.sender);

        // delete the mapping for this token
        delete expiryTime[tokenId];
    }

    // function to nominate trusted parties
    function nominate(address nominateAddress) public onlyOwnerOrNominated {
        isNominated[nominateAddress] = true;
    }

    // function to avail service of warranty
    function availService(uint256 tokenId, string memory activity)
        public
        onlyManufacturer(tokenId)
    {
        // emit event
        emit activityOnTokenCalled(tokenId, activity, msg.sender);
    }

    // getter functions
    function getTokenCounter() public view returns (uint256) {
        return tokenCounter;
    }

    function getIsNominated(address caller) public view returns (bool) {
        return isNominated[caller];
    }

    function getExpiryTime(uint256 tokenId) public view returns (uint256) {
        return expiryTime[tokenId];
    }

    function getProvider(uint256 tokenId) public view returns (address) {
        return provider[tokenId];
    }
}
