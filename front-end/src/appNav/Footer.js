import * as React from "react";

import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";

import logoAura from "../res/img/logo_aura_vc.png";

export default function Footer(props) {
	return (
		<Box
			sx={{
				bgcolor: "#2e3131",
				height: "fit-content",
				// borderTop: "1px solid #2e3131",
				display: "flex",
				flexDirection: "columm",
				alignItems: "center",
				justifyContent: "center",
				// position: 'fixed',
				// left: 0,
				// bottom: 0,
				width: '100%',
				zIndex: 1100,
				// marginTop: `calc(${heightMain}px)`,
			}}
			component="footer"
		>
			<Box
				sx={{
					padding: '1em',
					bgcolor: "#2e3131",
					// height: "12em",
					// borderTop: "1px solid #2e3131",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					width: "90%",
					zIndex: 1100
					// maxWidth: "45em",
					// position: 'sticky',
					// marginTop: `calc(${heightMain}px)`,
				}}
				component="div"
			>
				<Link
					href="https://auraluxuryblockchain.com/"
					underline="none"
					target="_blank"
				>
					<img
						src={logoAura}
						style={{ width: "8.6em", height: "4em" }}
					/>
				</Link>
				<Box
					// ml={2}
					// mr={2}
					sx={{
						bgcolor: "#2e3131",
						// height: "12em",
						// p: 3,
						// borderTop: "1px solid #2e3131",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						// position: 'sticky',
						// marginTop: `calc(${heightMain}px)`,
					}}
					component="span"
				>
					<Typography
						variant="h7"
						align="center"
						gutterBottom
						sx={{
							whiteSpace: "pre-line",
							color: "#dedede",
							fontSize: ".725rem",
							lineHeight: "2",
							letterSpacing: ".125rem",
							alignItems: "baseline",
							textAlign: "center",
						}}
					>
						{"©2021 DYOR BET"}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}
