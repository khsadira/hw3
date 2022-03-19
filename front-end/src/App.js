import * as React from 'react';
import './App.css';
import Menu from './Menu';


function App() {
  const [walletIdentifier, setWalletIdentifier] = React.useState(null);

  const login = () => {
  }

  const logout = () => {
    setWalletIdentifier(null);
  }

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

export default App;
