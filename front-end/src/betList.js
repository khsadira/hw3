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
				'0xc30E53CC485bF1D306040316Ccb687505554F74D', abi, nonceManager)
				const now = parseInt(Date.now()/1000)
				contract.accept(bet.id, {
					value: ethers.utils.parseEther("0.0001").toString()
				})
			})
		}

		return (
			<div style={{
					display: 'flex',
					flexDirection: 'center',
					alignItems: 'center',
					justifyContent: 'center',
					width: '100%',
					flexDirection: 'column',
					margin: '1em'
			}}>
				<p>CREATOR: {bet[0]}</p>
				<p>CHALLENGER: {bet[1]}</p>
				<p>BET AMOUNT: {bet[2]?._hex}</p>
				<p>BET CRYPTO: {bet[6]}</p>
				<p>PRICE PREDICTION: {bet[7]?._hex}</p>
				<p>PRICE PREDICTION: {bet[8]?._hex}</p>
				<p>END DATE: {bet[4]}</p>
				<Button variant="contained" onClick={acceptBet}>
					ACCEPT THE BET
				</Button>
			</div>
		)
	}
	
	if (!betList || betList.length == 0) return null
	console.log("BETLIST", betList)
	return (
		<div style={{width: '100%', display: 'flex', justifyContent: 'center', wrap: "wrap", flexDirection: 'column'}}>
		{betList.map((bet) => {
			return betItem(bet)
		})}
		</div>
	)

}
