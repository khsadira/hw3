import React from "react";
import { Redirect, Route, useHistory } from "react-router-dom";

export default function PrivateRoute({ children, ...props }) {

	return (
	  <Route
		{...props}
		render={({location}) => children}
	  />
	)
}