import * as React from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet'
import { ethers } from 'ethers'
import Button from '@mui/material/Button';

import './App.css';
import Menu from './Menu';


function App() {
  const [loginStep, setLoginStep] = React.useState(0)
  const [loggedOut, setLoggedOut] = React.useState(false)
  const [walletIdentifier, setWalletIdentifier] = React.useState(null);
  const wallet = useWallet()

  const login = React.useCallback(() => {
    if (wallet.status !== 'connected') {
      setLoginStep(1)
      wallet.connect()
    }
  }, [wallet])

  const logout = () => {
    setLoggedOut(true)
    setLoginStep(0)
    wallet.reset()
    setWalletIdentifier(null)
  }

  const test = async () => {
    fetch('/Dyor_bet.json')
      .then(resp => resp.json())
      .then(data => {
        console.log({x: data})
        const abi = data.abi
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const contract = new ethers.Contract('0x436b4eB93ACe97cF99Ba40b592aEECB92484f37D', abi, provider.getSigner())
        const now = parseInt(Date.now()/1000)
        contract.launch(100, now, now + 100, 'ETH', 4000)
      })
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
    <div className="App">
      <Menu
        walletIdentifier={walletIdentifier}
        setWalletIdentifier={setWalletIdentifier}
        login={login}
        logout={logout}
      />
      {walletIdentifier !== null && (
        <Button onClick={test}>test</Button>
      )}
    </div>
  </>
}

const exp = () => (
  <UseWalletProvider>
    <App />
  </UseWalletProvider>
)

export default exp
