var express = require('express');
var router = express.Router();
var ethers = require('ethers');

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

module.exports = router;
