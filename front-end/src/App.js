import * as React from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet'
import { ethers } from 'ethers'

import './App.css';
import BetList from './betList'
import Menu from './Menu';
import BetForm from './BetForm';

import axios from "axios";
import { CircularProgress } from '@mui/material';

const http = axios.create({
	baseURL: "http://127.0.0.1:3001",
	headers: {},
});

function App() {
  const [loginStep, setLoginStep] = React.useState(0)
  const [loggedOut, setLoggedOut] = React.useState(false)
  const [walletIdentifier, setWalletIdentifier] = React.useState(null);
  const wallet = useWallet()
  const [betList, setBetList] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const login = React.useCallback(() => {
    if (wallet.status !== 'connected') {
      setLoginStep(1)
      wallet.connect()
    }
  }, [wallet])

  React.useEffect(() => {
    // if (walletIdentifier != null) {
      console.log("GET")
      getBets()
    // }
  },[])

  const logout = () => {
    setLoggedOut(true)
    setLoginStep(0)
    wallet.reset()
    setWalletIdentifier(null)
  }

  const getBets = async () => {
    try {
      setLoading(true)
      const res = await http.post('/callApi', {
        url: "https://api.starton.io/v2/smart-contract/ethereum-ropsten/0xc30E53CC485bF1D306040316Ccb687505554F74D/read",
        method: "post",
        headers: {
          'Content-Type': 'application/json' 
        },
        body: {
          functionName: 'count',
          params: []
        }
      })
      let nbBets = res.data.raw || 0
      let betListTmp = []
      for(let i = 1; i <= nbBets; i++) {
        let resBet = await http.post('/callApi', {
          url: "https://api.starton.io/v2/smart-contract/ethereum-ropsten/0xc30E53CC485bF1D306040316Ccb687505554F74D/read",
          method: "post",
          headers: {
            'Content-Type': 'application/json' 
          },
          body: {
            functionName: 'bets',
            params: [i],
          }
        })
        resBet.data.id = i
        betListTmp.unshift(resBet.data)
      }
      console.log("resBet", betListTmp)
      console.log("NB_BETS", nbBets)
      setBetList(betListTmp)
      setLoading(false)
    } catch(error) {
      console.log("ERRRO", error)
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const verifySignature = (message, signature) => {
      if (signature === null) {
        return false
      }
      const address = ethers.utils.verifyMessage(message, signature)
      const check = address === wallet.account
      if (!check) {
        console.error({address})
      }
      return check
    }

    if (loginStep === 1) {
      if (wallet.status === 'connected') {
        if (wallet.ethereum === undefined) {
          logout()
          return
        }
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const message = 'Welcome to Dyor Bet!'

        const storedSignature = sessionStorage.getItem('signature')
        if (verifySignature(message, storedSignature)) {
          setWalletIdentifier(wallet.account)
          return
        }

        provider.getSigner().signMessage(message).then(signature => {
          if (!verifySignature(message, signature)) {
            return
          }
          sessionStorage.setItem('signature', signature)
          setWalletIdentifier(wallet.account)
        })
      }
    }
  }, [loginStep, wallet.status, wallet.account, wallet.ethereum])

  React.useEffect(() => {
    if (loggedOut) {
      return
    }
    if (window.ethereum.selectedAddress !== null && window.ethereum.selectedAddress !== "" && wallet.ethereum === undefined) {
      login()
    }
  }, [loggedOut, wallet.ethereum, login])

  return <>
    <div className="App" style={{display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <Menu
        walletIdentifier={walletIdentifier}
        setWalletIdentifier={setWalletIdentifier}
        login={login}
        logout={logout}
        
      />
      {walletIdentifier !== null && (
        <BetForm wallet={wallet} />
      )}
      {!loading 
        ? <BetList betList={betList} />
        : <CircularProgress style={{marginTop:'2em'}} />}
    </div>
  </>
}

const exp = () => (
  <UseWalletProvider>
    <App />
  </UseWalletProvider>
)

export default exp
