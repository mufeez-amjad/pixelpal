import React from 'react';
import MetaMaskSVG from '../../images/MetaMask_Fox.svg';

export default function InstallMetaMask() {
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="w-full px-3">
        <a href="https://metamask.io/" target="_blank" className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full relative flex items-center">
          <img src={MetaMaskSVG} className="w-5 h-5 fill-current flex-shrink-0 mx-4" viewBox="0 0 16 16"/>
          <span className="flex-auto pl-16 pr-8 -ml-16 text-center cursor-pointer">Install MetaMask</span>
        </a>
      </div>
    </div>
  )
}
