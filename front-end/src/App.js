import React, { useState, useEffect, Fragment } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation,
} from "react-router-dom";
import { Web3ReactProvider } from "@web3-react/core";
import Web3 from "web3";

import CssBaseline from "@mui/material/CssBaseline";
import { Button, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Box from "@mui/material/Box";
import { Grid, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import LinearProgress from '@mui/material/LinearProgress';

import Footer from "./appNav/Footer";

import "./app.css";
import theme from "./res/theme";
import Home from "./pages/Home";
import PrivateRoute from "./pages/PrivateRoute";
import wip from "./res/img/wip.png";
import AppMenu from "./appNav/AppMenu";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert  elevation={6} ref={ref} variant="outlined" {...props} sx={{maxWidth: '100%', backgroundColor: "white", borderRadius: 0}} />;
});

function getLibrary(provider) {
	return new Web3(provider);
}


function NoMatch() {
	let location = useLocation();
	console.log("no match");
	return (
		<Typography
			component="p"
			variant="h3"
			align="center"
			sx={{
				padding: "3em",
				fontSize: "2rem",
				lineHeight: "1.5",
				letterSpacing: ".125rem",
				whiteSpace: "pre-line",
				color: "red",
				//background: 'white',
				textAlign: "center",
			}}
		>
			{`ERROR 404\nNOT FOUND\n
			No match for ${location.pathname}`}
		</Typography>
	);
}

function MaisonError(props) {
	console.log("no match");
	document.title = "MAISON NOT FOUND";
	return (
		<Box
			component="div"
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				marginTop: "20vh",
			}}
		>
			<img src={wip} style={{ width: "20vh", height: "20vh" }} />

			<Typography
				component="h1"
				variant="h1"
				align="center"
				sx={{
					padding: "2em",
					fontSize: "2rem",
					lineHeight: "1.5",
					letterSpacing: ".125rem",
					whiteSpace: "pre-line",
					color: "red",
					//background: 'white',
					textAlign: "center",
				}}
			>
				{`ERROR\n\nMAISON\nNOT FOUND\n\nWORK IN PROGRESS`}
			</Typography>
		</Box>
	);
}

const drawerWidth = 180;

export default function App() {
	let maison = window.location.pathname.split("/")[1];
	localStorage.setItem("Maison", maison);
	const [mojixVerify, setMojixVerify] = useState(false)
	const [loading, setLoading] = useState(false)
	const [cryptoWallet, setCryptoWallet] = useState(localStorage.getItem("cryptoWallet"));

	const [alertOptions, setAlertOptions] = useState({
		severity: "info",
		message: "",
		open: false,
	});

	const [isAuthenticated, setIsAuthenticated] = useState(true)

	useEffect(() => {

	}, []);

	function handleCloseSnack(event, reason) {
		if (reason === "clickaway") {
			return;
		}

		setAlertOptions({
			...alertOptions,
			open: false,
		});
	}

	return (
		<ThemeProvider theme={theme}>
			<Router>
				<CssBaseline />
				{isAuthenticated && (
					<AppMenu
						setAlertOptions={setAlertOptions}
						maison={maison}
						cryptoWallet={cryptoWallet}
						setCryptoWallet={setCryptoWallet}
					/>
				)}
				<Snackbar
					open={alertOptions.open}
					onClose={handleCloseSnack}
					sx={{top: '6em !important'}}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
						zIndex: 99
					}}
				>
					<Alert
						onClose={handleCloseSnack}
						severity={alertOptions.severity}
						sx={{ width: "fit-content", top: '6em', backgroundColor: 'white' }}
					>
						<Typography
							variant="h7"
							align="center"
							sx={{
								fontSize: ".825rem",
								lineHeight: "1.5",
								letterSpacing: ".125rem",
								whiteSpace: "pre-line",
								fontWeight: "bold",
							}}
						>
							{alertOptions.message}
						</Typography>
					</Alert>
				</Snackbar>
				<Box
					component="main"
					sx={{
						// bgcolor: "#DADED4",
						// background: "linear-gradient(to left, red 50%, green 50%);",
						textAlign: "center",
						minHeight: "86vh",
					}}
				>
					{loading && <Box sx={{ width: '100%', zIndex: 999999999, position: "sticky", top: 0 }}>
						<LinearProgress color="inherit" sx={{
							height: '2px',
							backgroundColor: maison == 'Rimowa' ? '#0c67e7' : 'black',
							color: 'white'}}/>
					</Box>}
					<Switch>
						<Box
							sx={{
								backgroundColor: 'white',
								minHeight: '100vh',
								marginRight: { md: `${drawerWidth}px` },
								marginLeft: { md: `${drawerWidth}px` },
								borderLeft: '1px solid black',
								borderRight: '1px solid black',
							}}
						>
							{/* <Web3ReactProvider getLibrary={getLibrary}> */}
							<PrivateRoute
								exact
								path={`/`}
							>
								<Home
									setAlertOptions={setAlertOptions}
									setLoading={setLoading}
								/>
							</PrivateRoute>
							<PrivateRoute
								exact
								path={`/profile`}
							>
								
							</PrivateRoute>
							{/* </Web3ReactProvider> */}
						</Box>
						<Route path="*">
							<NoMatch />
						</Route>
					</Switch>
				</Box>
			</Router>
			{isAuthenticated && <Footer />}
		</ThemeProvider>
	);
}
