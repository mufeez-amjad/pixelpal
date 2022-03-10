import React from 'react';
import MetamaskSVG from '../../images/MetaMask_Fox.svg';
import { ethers } from 'ethers';

export default function ConnectMetaMask(props) {
  async function connectMetamask() {    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accounts = await provider.send("eth_requestAccounts", []);
    props.callback({ accounts, signer });
  }

  return (
    <div className="flex flex-wrap -mx-3">
      <div className="w-full px-3">
        <button onClick={connectMetamask} className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
          <img src={MetamaskSVG} className="w-5 h-5 fill-current flex-shrink-0 mx-4" viewBox="0 0 16 16"/>
          <span className="flex-auto pl-16 pr-8 -ml-16 text-center cursor-pointer">Connect MetaMask</span>
        </button>
      </div>
    </div>
  )
}