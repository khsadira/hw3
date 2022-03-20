import * as React from 'react';
import Button from '@mui/material/Button';


export default function BetList(props) {
	const {betList} = {...props}

	async function acceptBet() {
		console.log("acceptBet")
	}

	function betItem(bet) { 
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
				{/* <p>BET AMOUNT: {bet[2]._hex}</p> */}
				<p>BET CRYPTO: {bet[6]}</p>
				{/* <p>PRICE PREDICTION: {bet[7]._hex}</p> */}
				{/* <p>PRICE PREDICTION: {bet[8]._hex}</p> */}
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