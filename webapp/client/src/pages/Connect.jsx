import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import Header from '../partials/Header';
import ConnectMetaMask from '../components/connect/ConnectMetaMask';
import InstallMetaMask from '../components/connect/InstallMetaMask';
import PixelPalForm from '../components/connect/PixelPalForm';

import OpenseaSVG from '../images/opensea.svg';

function ViewOnOpensea() {
  return (
    <div className="flex flex-wrap -mx-3">
      <div className="w-full px-3">
        <a href="https://opensea.io/" target="_blank" className="btn px-0 text-white bg-blue-opensea hover:bg-blue-openseahover w-full relative flex items-center">
          <img src={OpenseaSVG} className="w-4 h-4 fill-current flex-shrink-0 mx-4" viewBox="0 0 16 16" />
          <span className="flex-auto pl-16 pr-8 -ml-16 text-center cursor-pointer">View on OpenSea</span>
        </a>
      </div>
    </div>
  )
}

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Connect() {
  const metamaskIsInstalled = typeof window.ethereum !== 'undefined';
  const linkGreeting = 'Link your PixelPal ID with your ETH address.';
  const installGreeting = 'Welcome. You need a MetaMask wallet to own a PixelPal.';
  const connectGreeting = 'Welcome. Connect your MetaMask wallet.'

  let query = useQuery();

  const [accounts, setAccounts] = React.useState([]);
  const [signer, setSigner] = React.useState();
  const [state, setState] = React.useState(metamaskIsInstalled ? 'installed' : 'uninstalled');
  const [greeting, setGreeting] = React.useState(metamaskIsInstalled ? connectGreeting : installGreeting);

  function onConnection(res) {
    setAccounts(res.accounts);
    setSigner(res.signer);
    setState('connected');
    setGreeting(linkGreeting);
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">

      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">

        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">

              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">{greeting}</h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                {state === 'installed' ? <ConnectMetaMask callback={onConnection} /> : null}
                {state === 'uninstalled' ? <InstallMetaMask /> : null}
                {state === 'connected' ? <PixelPalForm signer={signer} ppid={query.get('ppid')} /> : null}
                
                <div className="flex items-center my-6">
                  <div className="border-t border-gray-300 flex-grow mr-3" aria-hidden="true"></div>
                  <div className="text-gray-600 italic">Or</div>
                  <div className="border-t border-gray-300 flex-grow ml-3" aria-hidden="true"></div>
                </div>
                <form>
                  <div className="flex flex-wrap -mx-3 mb-3">
                    <div className="w-full px-3">
                      <button className="btn px-0 text-white bg-gray-900 hover:bg-gray-800 w-full relative flex items-center">
                        <svg className="w-4 h-4 fill-current text-white opacity-75 flex-shrink-0 mx-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                          <path d="M7.95 0C3.578 0 0 3.578 0 7.95c0 3.479 2.286 6.46 5.466 7.553.397.1.497-.199.497-.397v-1.392c-2.187.497-2.683-.993-2.683-.993-.398-.895-.895-1.193-.895-1.193-.696-.497.1-.497.1-.497.795.1 1.192.795 1.192.795.696 1.292 1.888.895 2.286.696.1-.497.298-.895.497-1.093-1.79-.2-3.578-.895-3.578-3.975 0-.895.298-1.59.795-2.087-.1-.2-.397-.994.1-2.087 0 0 .695-.2 2.186.795a6.408 6.408 0 011.987-.299c.696 0 1.392.1 1.988.299 1.49-.994 2.186-.795 2.186-.795.398 1.093.199 1.888.1 2.087.496.596.795 1.291.795 2.087 0 3.08-1.889 3.677-3.677 3.875.298.398.596.895.596 1.59v2.187c0 .198.1.497.596.397C13.714 14.41 16 11.43 16 7.95 15.9 3.578 12.323 0 7.95 0z" />
                        </svg>
                        <span className="flex-auto pl-16 pr-8 -ml-16">View on GitHub</span>
                      </button>
                    </div>
                  </div>
                  <ViewOnOpensea />
                </form>
                <div className="text-gray-600 text-center mt-6">
                  Already using Simple? <Link to="/signin" className="text-blue-600 hover:underline transition duration-150 ease-in-out">Sign in</Link>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

    </div>
  );
}

export default Connect;
