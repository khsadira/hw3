var express = require('express');
var router = express.Router();
var ethers = require('ethers');
const fetch = require("node-fetch");
var web3 = require('web3')
const cors = require('cors');
const { send } = require('process');


router.use(cors())


const API_KEY = process.env.API_KEY

async function checkSignature(signature) {  
	console.log("checkSignature")
	const address = null
	address = ethers.utils.verifyMessage('Welcome to Starton', signature);
	console.log("ADDRESS", address)
	return 'Succesfully signed';
}

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("TEST")
	res.render('index', { title: 'Express' });
});

router.post('/test', function(req, res, next) {
	console.log("TEST", req.body)
	checkSignature(req.body)
	res.send("OK")
	// res.render('index', { title: 'Express' });
});

router.post("/triggerWatcher", async function (req, res, next) {
	//send smthg to user to specify contract is over
	console.log("CC")
	console.log(req.body)

	res.send("UI")
});

router.post('/createWatcher', async function(req, res, next) {
	if (req.body && req.body.address) {
		console.log(req.body.address)
		var hostname = "";
		// var mapping_network = {
		// 	"ETH": "ethereum-ropsten",
		// 	"BNB": "binance-testnet",
		// 	"MATIC": "polygon-mumbai"
		// }

		var bodyReq = JSON.stringify({
			"address": "0x15b0FF0c4041d7f78F7DD48A442f94Ff68cDC16B",
			"network": "polygon-mumbai",
			"type": "ADDRESS_ACTIVITY",
			"webhookUrl": "https://" + hostname + "/triggerWatcher",
			"confirmationsBlocks": 0
		})

		fetch('https://api.starton.io/v2/watcher', {
			method: 'POST',
			body: bodyReq,
			headers: { "x-api-key": API_KEY, 'Content-Type': 'application/json' }
		}).then(res => res.json())
		.then(json => console.log(json));
	}
});

async function getMoneyValue(moneyName, date) {
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/histominute?fsym=${moneyName}&limit=60&tsym=USD&api_key=25630cc3cbe0bb371d4cb61b91b144c84e82d5d3174d48b7f10458f03cb9de36`);
    const myJson = await response.json();

      date -= date % 60;

      for (let i = 0; i < myJson.Data.Data.length; i++) {
          if (myJson.Data.Data[i].time == date) {
              return myJson.Data.Data[i].open;
          }
      }
     return "nop";
};

async function getBetsCount(network, address) {
	var params = JSON.stringify({
		functionName: "count",
		params: []
	})

	var ret

	await fetch('https://api.starton.io/v2/smart-contract/' + network + '/' + address + '/read', {
		method: 'POST',
		body: params,
		headers: { "x-api-key": API_KEY, 'Content-Type': 'application/json' }
	}).then(res => res.json())
	.then(json => ret = json.response.raw);
	return ret
}

async function getBetsData(network, address, index) {
	var params = JSON.stringify({
		functionName: "launch",
		params: ["1000","500","800","ETH","1200"],
		signerWallet: "0x35105801fc0bE99FD1A2Dd661A7B3d91b5a58541"
	})

	var ret;

	console.log('https://api.starton.io/v2/smart-contract/' + network + '/' + address + '/read')
	await fetch('https://api.starton.io/v2/smart-contract/' + network + '/' + address + '/call', {
		method: 'POST',
		body: params,
		headers: { "x-api-key": API_KEY, 'Content-Type': 'application/json' }
	}).then(res => res.json())
	.then(json => ret = json.response.raw);
	return ret
}

router.get('/getChallengeData', async function(req, res, next) {
	const value_polygon = await getMoneyValue("MATIC", Date.now()/1000)
	var resp = {"POLYGON": {"value": value_polygon, "transaction": []}}

	var countBets = await getBetsCount("polygon-mumbai", "0x436b4eB93ACe97cF99Ba40b592aEECB92484f37D");
	var getBetData = await getBetsData("polygon-mumbai", "0x436b4eB93ACe97cF99Ba40b592aEECB92484f37D", "100000000000000000");
	console.log(getBetData);

	// http.get('https://api.starton.io/v2/transaction', {
	// }).then(response => {
	// 	var length = response.data.items.length;

	// 	for (var index in response.data.items) {
	// 		var transactionJSON = {}
	// 		var transactionData = response.data.items[index]
			
	// 		// console.log(transactionData)
	// 		if (transactionData.to == "0x15b0FF0c4041d7f78F7DD48A442f94Ff68cDC16B") {
	// 			var data = transactionData.data
	// 			// console.log("STR DATA:", web3.utils.toAscii(transactionData.data));
	// 		}
	// 	}
	// })

	res.send("SALUT BG ")
});

router.post("/callApi", async function(req, res, next) {
  var reqBody = req.body;
  var header = reqBody.headers || {}

  header["x-api-key"] = API_KEY;

  console.log("NEW CALL to:\nURL:", reqBody.url, "\nMETHOD:", reqBody.method, "\nHEADERS:", reqBody.headers, "\nBODY:", reqBody.body);
  var ret;

  fetch(reqBody.url, {
    method: reqBody.method,
    body: JSON.stringify(reqBody.body),
    headers: header
  }).then(res => res.json())
  .then(json => res.send(json.response));
})

module.exports = router;
