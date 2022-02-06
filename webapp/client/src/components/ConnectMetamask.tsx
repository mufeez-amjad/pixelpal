import { ethers } from 'ethers';
declare const window: any;

export default function ConnectMetamask(props: { callback: Function }) {
  
  async function connectMetamask() {
    console.log('in connect metamask');
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const accounts = await provider.send("eth_requestAccounts", []);
    props.callback({ accounts, provider, signer });
  }

  return (
    <button onClick={connectMetamask}>Connect Metamask</button>
  )
}