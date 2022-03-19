import TextField from "@mui/material/TextField";
import { alpha, styled } from "@mui/material/styles";

import theme from "../res/theme";

const BootstrapInput = styled((props) => <TextField {...props} />)(
	({ theme }) => ({
		"label + &": {
			marginTop: theme.spacing(3),
			marginBottom: theme.spacing(3),
		},
		"& .MuiInputBase-input": {
			color: "black",
			borderRadius: 0,
			position: "relative",
			backgroundColor: 'white'
				// theme.palette.mode === "light" ? "#fcfcfb" : "white"
				,
			// border: "1px solid black",
			fontSize: 16,
			padding: "10px 12px",
			transition: theme.transitions.create([
				"border-color",
				"background-color",
				"box-shadow",
			]),
			"&:focus": {
				boxShadow: `${alpha(
					theme.palette.primary.main,
					0.25
				)} 0 0 0 0.2rem`,
				borderColor: theme.palette.primary.main,
			},
		},
		"& .MuiOutlinedInput-root": {
			borderRadius: '0px'
		}
	})
);

export default BootstrapInput