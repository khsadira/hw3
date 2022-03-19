import * as React from "react";

import Drawer from '@mui/material/Drawer';
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Fade, IconButton, MenuItem, Popover, Popper } from "@mui/material";
import {Typography} from "@mui/material";
import { useEffect, useState, Fragment } from "react";
import { useHistory, useLocation } from "react-router-dom";

import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
import Web3 from "web3";

import Logout from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import logoHublot from "../res/img/logo_huglot_hs.png";
import logoRimowa from "../res/img/RIMOWA_Logo.png";
import logoTag from "../res/img/logo_tag_hb.png"
import CustomAppBar from "./CustomAppBar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';
import TokenIcon from '@mui/icons-material/Token';



export default function ResponsiveDrawer(props) {
	const { setAlertOptions, maison, cryptoWallet, setCryptoWallet } = { ...props };
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [web3Modal, setWeb3Modal] = useState(null);
	const [web3, setWeb3] = useState(null);
	const [provider, setProvider] = useState(null);
	const open = Boolean(anchorEl);
	const history = useHistory();
	const location = useLocation();
	const [openProfileMenu, setOpenProfileMenu] = React.useState(false);
	const [anchorElProfileMenu, setAnchorElProfileMenu] = React.useState(null);
	const userData = JSON.parse(localStorage.getItem("userData"))

	useEffect(async () => {

	},[])
	
	function handleDrawerToggle(){
		setMobileOpen(!mobileOpen);
	};

	function logOut() {
		window.history.replaceState(null, null, window.location.pathname);
		localStorage.clear();
		window.location.reload();
	}

	function goToMyProfile(event) {
		if (mobileOpen) handleDrawerToggle()
		setAnchorEl(null);
		history.push(`/profile`);
	}

	async function fetchAccountData(web3) {
		const accounts = await web3.eth.getAccounts();
		setCryptoWallet(accounts[0]);
		localStorage.setItem("cryptoWallet", accounts[0])
		setAlertOptions({
			severity: "success",
			message: "Wallet connected",
			open: true,
		});
	}

	async function connectWallet() {
		// if (mobileOpen) handleDrawerToggle()
		console.log("Initializing example");

		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider,
				options: {
					infuraId: "27e484dcd9e3efcfd25a83a78777cdf1",
				},
			},
		};

		const web3Modal = new Web3Modal({
			// network: "mainnet",
			// cacheProvider: false,
			providerOptions, // required
		});

		setWeb3Modal(web3Modal);

		const provider = await web3Modal.connect();

		// Subscribe to accounts change
		provider.on("accountsChanged", (accounts) => {
			console.log(accounts);
			setCryptoWallet(accounts[0] ? accounts[0] : null);
			setAlertOptions({
				severity: "success",
				message: "Wallet connected",
				open: true,
			});
		});

		// Subscribe to chainId change
		provider.on("chainChanged", (chainId) => {
			setAlertOptions({
				severity: "success",
				message: "Chain Changed",
				open: true,
			});
			console.log(chainId);
		});

		// Subscribe to provider connection
		provider.on("connect", (info) => {
			setAlertOptions({
				severity: "success",
				message: "Wallet connected",
				open: true,
			});
			console.log(info);
		});

		// Subscribe to provider disconnection
		provider.on("disconnect", (error) => {
			setAlertOptions({
				severity: "warning",
				message: "Wallet disconnected",
				open: true,
			});
			setCryptoWallet(null);
			localStorage.removeItem("cryptoWallet")
			console.log(error);
		});
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', async () => {
				setAlertOptions({
					severity: "warning",
					message: "Wallet disconnected",
					open: true,
				});
				localStorage.removeItem("cryptoWallet")
				console.log(error);
				setCryptoWallet(null);
			});
		}
		const web3 = new Web3(provider);
		console.log("web3 =>", web3);
		setWeb3(web3);
		setProvider(provider);
		fetchAccountData(web3);
	}

	async function disconnectWallet() {
		// if (mobileOpen) handleDrawerToggle()
		console.log("PROVIDER =>", provider);
		if (provider.disconnect) {
			await provider.disconnect();
			// await web3Modal.clearCachedProvider();
		}
		setCryptoWallet(null);
		setWeb3(null);
		setAlertOptions({
			severity: "warning",
			message: "Wallet disconnected",
			open: true,
		});
	}

	const menuItemsStyle = {
		flexDirection: {
			xs: "unset",
			sm: "unset",
			md: "row",
			lg: "row"
		},
		width: '100%'
	}

	const drawer = (
			<Box
				component="div"
				style={{
					display: "flex",
					flexDirection: "column",
					paddingTop: "7em",
					alignItems: "start",
					width: '100%'
				}}
			>
				{userData && <MenuItem sx={menuItemsStyle}>
					<ListItemIcon>
						<PersonOutlineIcon
							fontSize="medium"
							sx={{ color: "black" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}}
						/>
					</ListItemIcon>
					<Typography
						component="span"
						variant="button"
						sx={{
							fontSize: ".98571rem",
							letterSpacing: ".1em",
							padding: "1.16em 1.5em 1.05em 1.05em",
							fontWeight: "bold",
							color: "black",
						}}
					>
						{userData.firstName[0].toUpperCase()}. {userData.lastName[0].toUpperCase()}.
					</Typography>
				</MenuItem>}
				<Divider sx={{width: '100%'}}/>
				<MenuItem sx={menuItemsStyle}
					onClick={!cryptoWallet ? connectWallet : null}
				>
					<ListItemIcon>
						<AccountBalanceWalletIcon
							fontSize="medium"
							sx={{ color: "black" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}}
						/>
					</ListItemIcon>
					<Typography
						component="span"
						variant="button"
						sx={{
							fontSize: ".98571rem",
							letterSpacing: ".1em",
							// border: "2px solid black",
							// width: '10em',
							padding: "1.16em 1.5em 1.05em 1.05em",
							fontWeight: "bold",
							// color: 'white'
						}}
					>
						{cryptoWallet
							? `${cryptoWallet.slice(0, 6)}...${cryptoWallet.slice(
									cryptoWallet.length - 4,
									cryptoWallet.length
							)}`
							: "Connect wallet"}
					</Typography>
					
				</MenuItem>
				<Divider sx={{width: '100%'}}/>
				<Divider sx={{width: '100%'}}/>
				<MenuItem sx={menuItemsStyle} onClick={logOut}>
					<ListItemIcon>
						<Logout fontSize="medium" sx={{ color: "red" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}} />
					</ListItemIcon>
					<Typography
						component="span"
						variant="button"
						sx={{
							alignTexe: "left",
							fontSize: ".98571rem",
							letterSpacing: ".1em",
							// border: "2px solid black",
							// width: '10em',
							padding: "1.16em 1.5em 1.05em 1.05em",
							fontWeight: "bold",
							color: "red",
						}}
					>
						Logout
					</Typography>
				</MenuItem>
				<Divider sx={{width: '100%'}}/>
			</Box>
	)

	const handleClickProfileMenu = (event) => {
		setAnchorElProfileMenu(event.currentTarget);
		setOpenProfileMenu((previousOpen) => !previousOpen);
	};
	
	const topNav = (
		<React.Fragment>
			{/* <MenuItem sx={{
					padding: 0,
					justifyContent: "start"
			}}> */}
			<Box sx={{width: '50%', objectFit: 'cover',}}>
				<img
					src={null}
				/>
			{/* </MenuItem> */}
			</Box>
			<Box
				component="div"
				sx={{
					flexDirection: "raw",
					// paddingTop: "1em",
					alignItems: "center",
					justifyContent: "space-evenly",
					display: { xs: "none", sm: 'none', md: 'none', lg: "flex" }
				}}
			>
				<MenuItem sx={menuItemsStyle}
					onClick={!cryptoWallet ? connectWallet : null}
				>
					<ListItemIcon>
						<AccountBalanceWalletIcon
							fontSize="medium"
							sx={{ color: "black" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}}
						/>
					</ListItemIcon>
					<Typography
						component="span"
						variant="button"
						sx={{
							fontSize: ".98571rem",
							letterSpacing: ".1em",
							// border: "2px solid black",
							// width: '10em',
							padding: "1.16em 1.5em 1.05em 1.05em",
							fontWeight: "bold",
							color: "black",
						}}
					>
						{cryptoWallet
							? `${cryptoWallet.slice(0, 7)}...${cryptoWallet.slice(
									cryptoWallet.length - 6,
									cryptoWallet.length
							)}`
							: "Connect wallet"}
					</Typography>
				</MenuItem>
				{userData && <MenuItem sx={menuItemsStyle} aria-describedby="profile" onClick={handleClickProfileMenu}>
					<ListItemIcon>
						<PersonOutlineIcon
							fontSize="medium"
							sx={{ color: "black" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}}
						/>
					</ListItemIcon>	
					<Popper id="profile" open={openProfileMenu} anchorEl={anchorElProfileMenu} transition>
						{({ TransitionProps }) => (
							<Fade {...TransitionProps} timeout={350}>
								<Box sx={{ border: 1, p: 1, pt: 3, bgcolor: 'background.paper', justifyContent: 'space-around', display: 'flex', flexDirection: 'column' }}>
								<Typography
									component="span"
									variant="button"
									sx={{
										fontSize: ".98571rem",
										letterSpacing: ".1em",
										padding: "1.16em 1.5em 1.05em 1.05em",
										fontWeight: "bold",
										color: "black",
									}}
								>
									Profile menu
								</Typography>
								<MenuItem sx={menuItemsStyle} onClick={logOut}>
									<ListItemIcon>
										<Logout fontSize="medium" sx={{ color: "red" , marginLeft: {xs: '8px', sm: '28px', md: '28px', lg: '0'}}} />
									</ListItemIcon>
									<Typography
										component="span"
										variant="button"
										sx={{
											alignTexe: "left",
											fontSize: ".98571rem",
											letterSpacing: ".1em",
											// border: "2px solid black",
											// width: '10em',
											padding: "1.16em 1.5em 1.05em 1.05em",
											fontWeight: "bold",
											color: "red",
										}}
									>
										Logout
									</Typography>
								</MenuItem>
								</Box>
							</Fade>
						)}
					</Popper>
				</MenuItem>}
			</Box>
			{/* <Button aria-describedby={id} variant="contained" onClick={handleClick}>
				Open Popover
			</Button> */}
			
			<IconButton
				color="inherit"
				aria-label="open drawer"
				edge="start"
				onClick={handleDrawerToggle}
				sx={{ display: { lg: 'none' }, marginRight: '0.7em' }}
				
			>
				{!mobileOpen ? <MenuIcon sx={{color: 'black'}} fontSize="large" /> : <CloseIcon sx={{color: 'black'}} fontSize="large" />}
			</IconButton>
		</React.Fragment>
	)

	if (!userData) return null
	return (
		<Box component="nav">
			<CssBaseline />
			<CustomAppBar handleDrawerToggle={handleDrawerToggle} mobileOpen={mobileOpen} topNav={topNav} />
			
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					fullwidth="true"
					anchor="right"
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: {
							xs: "block",
							sm: "block",
							md: "block",
							lg: "none"
						},
						"& .MuiDrawer-paper": {
							boxSizing: "unset",
							width: "100%",
						},
					}}
				>
					{drawer}
				</Drawer>
				{/* <Drawer
					anchor="right"
					variant="permanent"
					sx={{
						display: {
							xs: "none",
							sm: "none",
							md: "block"
						},
						"& .MuiDrawer-paper": {
							boxSizing: "unset",
							width: drawerWidth,
							// border: '0px',
							zIndex: 0,
							backgroundColor: 'unset',
							// borderColor: 'black'
						},
					}}
				>
					{drawer}
				</Drawer> */}
		</Box>
	);
}

