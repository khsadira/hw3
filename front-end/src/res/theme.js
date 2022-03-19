import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app

const maison = "Hublot"


const theme = createTheme({
  	palette: maison == "Hublot"
            	? 	{  
						// mode: 'dark',
						// background: {
						// 	default: "black"
						// }
					}
				: 	{ 	
						background: {
							default: "black"
						},
						primary: {
							main: '#556cd6',
						},
						secondary: {
							main: '#19857b',
						},
						error: {
							main: red.A400,
						},
					},
	overrides: {
		MuiCheckbox: {
			colorSecondary: {
			color: 'red',
			'&$checked': {
				color: 'black',
			},
			},
		},
		},
	}
);

export default theme;
