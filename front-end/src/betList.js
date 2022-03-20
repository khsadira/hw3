import * as React from 'react';
import Button from '@mui/material/Button';
import { ethers } from 'ethers'
import { useWallet, UseWalletProvider } from 'use-wallet'
import { NonceManager } from "@ethersproject/experimental";


export default function BetList(props) {
	const {betList} = props
	const wallet = useWallet()
	const [error, setError] = React.useState({id: null, message: null})

	function betItem(bet) {
			async function acceptBet() {
			console.log({id: bet.id})
			fetch('/Dyor_bet.json')
			.then(resp => resp.json())
			.then(data => {
				// console.log({x: data})
				const abi = data.abi
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				const signer = provider.getSigner()
				const nonceManager = new NonceManager(signer)
				const contract = new ethers.Contract(
				'0x50f65EadaAB6936A86787A8c1f0Bfb4a1cA164E5', abi, nonceManager)
				const now = parseInt(Date.now()/1000)
				let betAmount = parseInt(bet[2]?._hex, 16)
				betAmount = betAmount.toString()
				contract.accept(bet.id, {
					value: ethers.utils.parseEther(ethers.utils.formatUnits(betAmount, "ether").toString()).toString()
				})
			})
		}

		async function claimBet() {
			console.log({id: bet.id})
			fetch('/Dyor_bet.json')
			.then(resp => resp.json())
			.then(data => {
				// console.log({x: data})
				const abi = data.abi
				const provider = new ethers.providers.Web3Provider(wallet.ethereum)
				const signer = provider.getSigner()
				const nonceManager = new NonceManager(signer)
				const contract = new ethers.Contract(
				'0x50f65EadaAB6936A86787A8c1f0Bfb4a1cA164E5', abi, nonceManager)
				const now = parseInt(Date.now()/1000)
				contract.claim(bet.id).catch((e) => {
					console.log("ERROR", e)
					setError({id: bet.id, message: "CLAIM UNAUTHORIZED! SORRY YOU LOST!"})
				})
			})
			
		}

		let betAmount = parseInt(bet[2]?._hex, 16)
		betAmount = betAmount.toString()
		console.log("betAmoutn", betAmount)
		return (
			<div style={{
					display: 'flex',
					flexDirection: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					// width: '90%',
					margin: 'auto 20px',
					flexDirection: 'column',
					margin: '1em',
					border: '1px solid black',
					padding: '2em',
					width: '60%',
					textAlign: 'center'
			}}>
				<h2>BET #{bet.id}</h2>
				<p>CREATOR: {bet[0]}</p>
				<p>CHALLENGER: {bet[1]}</p>
				<p>BET AMOUNT: { ethers.utils.formatUnits(betAmount, "ether").toString()} ETH</p>
				{/* <p>BET CRYPTO: {bet[6]}</p> */}
				<p>ETHEREUM START PRICE: 2500$</p>
				<p>PRICE PREDICTION: {bet[7].toUpperCase()}</p>
				<p>END DATE: {new Date(parseInt(bet[4]?._hex, 16) * 1000).toISOString().slice(0, 19).replace('T', ' ')}</p>
				{bet[8]?._hex != '0x00' && <p>END PRICE:  {parseInt(bet[8]?._hex, 16)}$</p>}
				{(bet[8]?._hex == '0x00' && !bet[5]) && <p style={{color: 'green'}}>AT THE END OF THIS BET THE PRICE OF ETHEREUM WILL BE CHECKED BY OUR ORACLE NETWORK TO GARANTY ITS INTEGRITY</p>}
				{bet[1] == "0x0000000000000000000000000000000000000000" && <Button variant="contained" onClick={acceptBet}>
					ACCEPT THE BET
				</Button>}
				{(!bet[5] && bet[1] != "0x0000000000000000000000000000000000000000") && <Button variant="contained" onClick={claimBet}>
					CHECK RESULT AND CLAIM GAINS
				</Button>}
				{bet[5] && <p style={{color: 'green'}}>OVER</p>}
				{bet[5] && <p style={{color: 'green'}}>GAINS CLAIMED BY WINNER</p>}
				{error.id == bet.id && <p style={{color: 'red'}}>{error.message}</p> }
			</div>
		)
	}
	
	if (!betList || betList.length == 0) return null
	console.log("BETLIST", betList)
	return (
		<div style={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
		{betList.map((bet) => {
			return betItem(bet)
		})}
		</div>
	)

}
