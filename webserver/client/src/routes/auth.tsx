import PixelPalForm from '../components/PixelPalForm';
import ConnectMetamask from '../components/ConnectMetamask';
import InstallMetamask from '../components/InstallMetamask';
import React from 'react';
import { Signer } from '@ethersproject/abstract-signer';
import { Provider } from '@ethersproject/abstract-provider'

declare const window: any;

export default function Auth() {
  const metamaskIsInstalled = typeof window.ethereum !== 'undefined';
  const [accounts, setAccounts] = React.useState<string[]>([]);
  const [signer, setSigner] = React.useState<Signer>();
  const [provider, setProvider] = React.useState<Provider>();

  function connectMMCB(res: { accounts: string[], signer: Signer, provider: Provider }) {
    setAccounts(res.accounts);
    setSigner(res.signer);
    setProvider(res.provider);
  }

  return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Auth</h2>
      {accounts.length == 0 ? (
        metamaskIsInstalled ? <ConnectMetamask callback={connectMMCB}/> : <InstallMetamask />
      ) : (
        <PixelPalForm />
      )}
    </main>
  );
}