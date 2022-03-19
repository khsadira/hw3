import * as React from "react";

import {Grid, IconButton, Slide, useScrollTrigger} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from '@mui/icons-material/Close';

import logoHublot from "../res/img/logo_hublot_hb.png";
import logoRimowa from "../res/img/RIMOWA_Logo.png";
import logoTag from "../res/img/logo_tag_hb.png"


function HideOnScroll(props) {
	const { children } = props;
	const trigger = useScrollTrigger()
  
	return (
	  <Slide appear={false} direction="down" in={!trigger}>
		{children}
	  </Slide>
	);
}

export default function CustomAppBar(props) {
	const {handleDrawerToggle, mobileOpen} = {...props}

	const maison = props.maison || localStorage.getItem('Maison')

	const logo = {
		"Hublot": {
			logo:logoHublot,
			style: { height: '7em'},
			styleBox: {marginLeft: { xs: "1em", sm: "1em", md: '0' }}
		},
		"Rimowa": {
			logo: logoRimowa,
			style: { height: '4em'},
			styleBox: {}
		},
		"Tag": {
			logo:logoTag,
			style: { height: '2.4em', width: '14em'},
			styleBox: {marginLeft: { xs: "1em", sm: "1em", md: '0' }}
		}
	}

	return (
		// <HideOnScroll {...props}>
			<AppBar
				position="fixed"
				sx={{
					backgroundColor: "white",
					height: '6em',
					justifyContent: 'center',
					zIndex: 9999,
					alignItems: 'center'
				}}
			>
				<Toolbar sx={{ padding: '0', justifyContent: 'space-between', display: 'flex', width: '100%', maxWidth: '200em'}}>
					{props.topNav}
				{/* <Grid container direction="row" spacing={1} sx={{justifyContent: 'space-between'}}>
					<Grid
						container
						item
						xs={3}
						alignItems="center"
						justifyContent="center"
						sx={{ display: { xs: "none", md: "none" } }}
					>	
					</Grid>
					<Grid
						container
						item
						xs
						alignItems="center"
						justifyContent={{xs:"start", md: "center", lg: 'center'}}
						sx={logo[maison].styleBox}
					>
						<img
							src={logo[maison].logo}
							style={logo[maison].style}
						/>
					</Grid>
					<Grid container
						item
						xs
						alignItems="center"
						justifyContent="flex-end"
						// mr={1}
						sx={{ display: { md: "none", lg: 'none' }, marginRight: '0.7em' }}
						>
						<IconButton
							color="inherit"
							aria-label="open drawer"
							edge="start"
							onClick={handleDrawerToggle}
							
						>
							{!mobileOpen ? <MenuIcon sx={{color: 'black'}} fontSize="large" /> : <CloseIcon sx={{color: 'black'}} fontSize="large" />}
						</IconButton>
					</Grid>
				</Grid> */}
				</Toolbar>
			</AppBar>
		// </HideOnScroll>
	)
}