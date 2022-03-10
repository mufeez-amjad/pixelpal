import React from 'react';
import './connect.css'
import { ethers } from 'ethers';
import { useLocation } from 'react-router';

function ConnectMetamask(props) {
  async function connectMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accounts = await provider.send("eth_requestAccounts", []);
    props.callback({ accounts, provider, signer });
  }

  return (
    <div className='login-container'>
      <div className="login-formGroup">
        <button className='connect-mm-btn' onClick={connectMetamask}>Connect Metamask</button>
      </div>
    </div>
  )
}

function PixelPalForm(props) {
  const [ ppid, setPPID ] = React.useState(props.ppid);

  return (
    <div className='login-container'>
      <h1>Connect</h1>
      <form className='login-writeForm' autoComplete='off'>
        <div className="login-formGroup">
          <label>PixelPal ID</label>
          <input type="text" placeholder='ppid_a1b2c3d4...' value={ppid} onChange={e => setPPID(e.target.value)} />
          <button type='button' className='link-btn'> Link PixelPal ID </button>
        </div>
      </form>
    </div>
  )
}

function InstallMetamask() {
  return (
    <a className='link-btn' href='https://metamask.io/' target='_blank'>Install Metamask</a>
  )
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

const Connect = () => {
  const metamaskIsInstalled = typeof window.ethereum !== 'undefined';
  const [accounts, setAccounts] = React.useState([]);
  const [signer, setSigner] = React.useState();
  const [provider, setProvider] = React.useState();

  let query = useQuery();

  function onConnection(res) {
    setAccounts(res.accounts);
    setSigner(res.signer);
    setProvider(res.provider);
  }

  return (
    <div className='login section__padding'>
      {accounts.length == 0 ? (
        metamaskIsInstalled ? <ConnectMetamask callback={onConnection}/> : <InstallMetamask />
      ) : (
        <PixelPalForm ppid={query.get('ppid')} signer={signer}/>
      )}
    </div>
   )
};

export default Connect;
