// import { pinJSONToIPFS } from './pinata'

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);


const contractABI = require('./MyNFT.json')
const contractAddress = "0x848f7bf130684f9d3aBc6f9819Bac18c15cfDC2D"

// https://ropsten.etherscan.io/address/0x5a44b04c147a25e795558b34ab236ae608660825

// npm install dotenv --save
// npm install @alch/alchemy-web3

// export const connectWallet = async () => {
// 	if (window.ethereum) {
// 		try {
// 			const addressArray = await window.ethereum.request({
// 				method: "eth_requestAccounts"
// 			})
// 			const obj = {
// 				status: "👆🏽 Write a message in the text-field above.",
// 				address: addressArray[0]
// 			}
// 			return obj
// 		} catch (err) {
// 			return {
// 				address: "",
// 				status: "😥 " + err.message
// 			}
// 		}
// 	} else {
// 		return {
// 			address: "",
// 			status: (
// 				<span>
// 					<p>
// 						{" "}
// 						🦊{" "}
// 						<a target="_blank" href={`https://metamask.io/download.html`}>
// 						You must install Metamask, a virtual Ethereum wallet, in your
// 						browser.
// 						</a>
// 					</p>
// 				</span>
// 			)
// 		}
// 	}
// }

// export const getCurrentWalletConnected = async () => {
// 	if (window.ethereum) {
// 		try {
// 			const addressArray = await window.ethereum.request({
// 				method: "eth_accounts",
// 			})
// 			if (addressArray.length > 0) {
// 				return {
// 					address: addressArray[0],
// 					status: "👆🏽 Write a message in the text-field above.",
// 				}
// 			} else {
// 				return {
// 					address: "",
// 					status: "🦊 Connect to Metamask using the top right button."
// 				}
// 			}
// 		} catch (err) {
// 			return {
// 				address: "",
// 				status: "😥 " + err.message,
// 			};
// 		}
// 	} else {
// 		return {
// 			address: "",
// 			status: (
// 			  <span>
// 				<p>
// 				  {" "}
// 				  🦊{" "}
// 				  <a target="_blank" href={`https://metamask.io/download.html`}>
// 					You must install Metamask, a virtual Ethereum wallet, in your
// 					browser.
// 				  </a>
// 				</p>
// 			  </span>
// 			),
// 		};
// 	}
// }

export const mintNFT = async(cryptoWallet, provider) => {
	// //error handling
	// if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
	// 	return {
	// 	 success: false,
	// 	 status: "❗Please make sure all fields are completed before minting.",
	// 	}
	// }

	// //make metadata
	// const metadata = new Object()
	// metadata.name = name
	// metadata.image = url
	// metadata.description = description

	// //make pinata call
	// const pinataResponse = await pinJSONToIPFS(metadata)
	// if (!pinataResponse.success) {
	// 	return {
	// 		success: false,
	// 		status: "😢 Something went wrong while uploading your tokenURI."
	// 	}
	// }
	// const tokenURI = pinataResponse.pinataUrl
	try {

		const tokenURI = "https://gateway.pinata.cloud/ipfs/QmQ1zA84jeZjHVz8EaTRBuxtSsyQQC22uL4jre9xvg1kXG"
		
		window.contract = await new web3.eth.Contract(contractABI, contractAddress)

		//set up your Ethereum transaction
		const transactionParameters = {
			to: contractAddress, // Required expect during contract publication
			from: cryptoWallet, // must match user's active address
			'data': window.contract.methods.mintNFT(cryptoWallet, tokenURI).encodeABI() // make call to NFT smart contract
		}

		// sign the transaction via metamask
		// const txHash = await window.ethereum
		// 	.request({
		// 		method: 'eth_sendTransaction',
		// 		params: [transactionParameters]
		// 	})

		// const txHash = await web3.eth.sendTransaction(transactionParameters)
		web3.eth.sendTransaction(transactionParameters)
			.once('sending', (payload) => console.log("sending", payload))
			.once('sent', (payload) => console.log("sent", payload))
			.once('transactionHash', (hash) => console.log("transactionHash", hash))
			.once('receipt', (receipt) => console.log("receipt", receipt))
			.on('confirmation', (confNumber, receipt, latestBlockHash) => console.log("confirmation", confNumber, receipt, latestBlockHash))
			.on('error', (error) => console.log("error", error))
			.then(function(receipt){
				console.log("END", receipt)
			});
		
		// alert("✅ Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" + txHash.transactionHash)
		// console.log("✅ Check out your transaction on Etherscan:", txHash)
		return 
	} catch (error) {
		alert("ERROR:" + error)
		console.log("✅ Check out your transaction on Etherscan:", txHash)
		return 
	}
}