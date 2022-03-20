import * as React from 'react';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { ethers } from 'ethers'
import { NonceManager } from "@ethersproject/experimental";

function BetForm(props) {
  const { wallet } = props

  const createBet = async (betValue, betLength, currencyName, currencyValue) => {
    fetch('/Dyor_bet.json')
      .then(resp => resp.json())
      .then(data => {
        const abi = data.abi
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const signer = provider.getSigner()
        const nonceManager = new NonceManager(signer)
        const contract = new ethers.Contract(
          '0xc30E53CC485bF1D306040316Ccb687505554F74D', abi, nonceManager)
        const now = parseInt(Date.now() / 1000)
        contract.launch(now, now + betLength, currencyName, currencyValue, {
          value: ethers.utils.parseEther(betValue).toString(),
        })
      })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({data})
    createBet(
      data.get('betValue'),
      parseInt(data.get('betLength')),
      selectedCurrency,
      parseInt(data.get('currencyValue')))
  }

  const [selectedCurrency, setSelectedCurrency] = React.useState('ETH')

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Create a Bet
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Bet value"
            name="betValue"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Length"
            name="betLength"
          />
          <InputLabel id="demo-simple-select-label">Currency</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            value={selectedCurrency}
            label="Currency"
            name="currency"
            onChange={event => { setSelectedCurrency(event.target.value) }}
          >
            <MenuItem value="ETH">Ethereum</MenuItem>
            <MenuItem value="BTC">Bitcoin</MenuItem>
            <MenuItem value="DOGE">Dogecoin</MenuItem>
            <MenuItem value="MATIC">Polygon</MenuItem>
          </Select>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Currency value"
            name="currencyValue"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default BetForm
