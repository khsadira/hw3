const axios = require("axios");

const http = axios.create({
	baseURL: "https://api.starton.io/v2",
	headers: {
		"x-api-key": "yLcAmpNs3MHZaQ9Dfydp5VI24uI851jn",
	},
});

http.post('/smart-contract/ethereum-ropsten/0xc30E53CC485bF1D306040316Ccb687505554F74D/read', {
    functionName: 'bets',
    params: [1],
}).then(response => {
    console.log(response.data)
})