import * as React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";

import Box from "@mui/material/Box";


export default function Home(props) {
	const { maison, setAlertOptions, setLoading, loading } = { ...props }
	const [error, setError] = useState(null)
	
	// const [loading, setLoading] = useState(false);
	const [challengeList, setChallengeList] = useState(null)

	useEffect(() => {
		scrollTo(0, 0);
		getOnGoingChallengeList()
	}, []);

	async function getOnGoingChallengeList() {
		try {
			setLoading(true);
			
			setLoading(false);
		} catch (error) {
			console.log("error getOnGoingChallengeList", error);
			setLoading(false);
		}
	}

	return (
		<React.Fragment>
			<Box
				id="home"
				sx={{
					margin: 'auto',
					bggetAssetData: "background.paper",
					pb: 2,
					paddingTop: '7em',
					justifyContent: 'center',
					alignItems: 'center',
					textAlign: 'center',
					width: '100%',
					background: 'white'
				}}
			>
				{!error && <p> getOnGoingChallengeList </p>}
				{error && !loading && (
						<Box
							justifyContent="center"
							alignItems="center"
							wrap="wrap"
							// m={2}
							mb={4}
							mt={6}
						>
							<Typography
								component="span"
								variant="error"
								align="center"
								sx={{
									fontSize: "1rem",
									lineHeight: "1.5",
									letterSpacing: ".125rem",
									whiteSpace: "pre-line",
									color: "red",
									//background: 'white',
									textAlign: "center",
								}}
							>
								{error}
							</Typography>
						</Box>
					)}
			</Box>
		</React.Fragment>
	);
}
