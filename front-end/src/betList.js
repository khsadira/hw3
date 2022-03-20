import * as React from 'react';
import Button from '@mui/material/Button';
import { ethers } from 'ethers'
import { useWallet, UseWalletProvider } from 'use-wallet'
import { NonceManager } from "@ethersproject/experimental";


export default function BetList(props) {
	const {betList} = props
	const wallet = useWallet()

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
				contract.accept(bet.id, {
					value: ethers.utils.parseEther("0.0001").toString()
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
				contract.claim(bet.id)
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
					width: '90%',
					margin: 'auto 20px',
					flexDirection: 'column',
					margin: '1em',
					border: '1px solid black',
					padding: '1em'
			}}>
				<p>CREATOR: {bet[0]}</p>
				<p>CHALLENGER: {bet[1]}</p>
				<p>BET AMOUNT: { ethers.utils.formatUnits(betAmount, "ether").toString()} ETH</p>
				{/* <p>BET CRYPTO: {bet[6]}</p> */}
				<p>ETHEREUM START PRICE: 2500$</p>
				<p>PRICE PREDICTION: {bet[7].toUpperCase()}</p>
				<p>END DATE: {new Date(parseInt(bet[4]?._hex, 16) * 1000).toISOString().slice(0, 19).replace('T', ' ')}</p>
				<p>END PRICE:  {parseInt(bet[8]?._hex, 16)} ETH</p>
				{bet[1] == "0x0000000000000000000000000000000000000000" && <Button variant="contained" onClick={acceptBet}>
					ACCEPT THE BET
				</Button>}
				{!bet[5] && <Button variant="contained" onClick={claimBet}>
					CHECK RESULT AND CLAIM GAINS
				</Button>}
				{bet[5] && <p style={{color: 'green'}}>OVER | GAINS CLAIMED</p>}
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
