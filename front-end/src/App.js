import * as React from 'react';
import { useWallet, UseWalletProvider } from 'use-wallet'
import { ethers } from 'ethers'

import './App.css';
import Menu from './Menu';


function App() {
  const [loginStep, setLoginStep] = React.useState(0)
  const [walletIdentifier, setWalletIdentifier] = React.useState(null);
  const wallet = useWallet()

  const login = () => {
    if (wallet.status !== 'connected') {
      setLoginStep(1)
      wallet.connect()
    }
  }

  const logout = () => {
    wallet.reset()
    setWalletIdentifier(null)
  }

  React.useEffect(() => {
    if (loginStep === 1) {
      if (wallet.status === 'connected') {
        //setLoginStep(2)
        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        provider.getSigner().signMessage('Welcome to Dyor Bet!').then(ret => {
          //setLoginStep(3)
          console.log({ret})
          setWalletIdentifier(wallet.account)
        })
      }
    }
  }, [loginStep, wallet.status, wallet.account, wallet.ethereum])

  /*
  React.useEffect(() => {
    if (walletIdentifier === null && wallet.status === 'connected') {
      setWalletIdentifier(wallet.account)
    }
  }, [walletIdentifier, wallet.status, wallet.account])
  */

  return <>
    <div className="App">
      <Menu
        walletIdentifier={walletIdentifier}
        setWalletIdentifier={setWalletIdentifier}
        login={login}
        logout={logout}
      />
    </div>
  </>
}

const exp = () => (
  <UseWalletProvider>
    <App />
  </UseWalletProvider>
)

export default exp
