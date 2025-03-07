import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Routes, useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

import Overview from './pages/Overview';
import Settings from './pages/Settings';

import 'normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import './index.css';

import store from './store';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { lightTheme } from './theme';
import { useLocalStorage } from './hooks/use_localstorage';

import { nanoid } from 'nanoid';
import NFT from './pages/Settings/pages/NFT';
import axios from 'axios';

const App = () => {
	const [showGuide, setShowGuide] = useState(false);
	const [PPID, setPPID] = useState<string | null>('');

	React.useEffect(() => {
		const temp = true;	// TODO (Michael or Mufeez) remove
		if (temp || localStorage.getItem('firstStartup') != 'false') {
			// Setup the PPID of this application
			const ppid = 'ppid_' + nanoid(16);
			setPPID(ppid);
			localStorage.setItem('PPID', ppid);
			localStorage.setItem('firstStartup', 'false');

			setShowGuide(true);
		} else {

			//validate that user still owns pixel pal
			// if they still own one, allow access to the app
			// otherwise, delete cached NFT assets and show the first startup guide
			if (validateInventory()) {
				setPPID(localStorage.getItem('PPID'));
			} else {
				localStorage.removeItem('NFT_IMG');	// TODO (Michael) use proper asset animations
				setShowGuide(true);
			}
		}
	}, []);

	const validateInventory = (): boolean => {
		axios.get(
			'https://pixelpal-test.herokuapp.com/nft/' + PPID, // TODO change to mainnet
		).then(function (response) {
			console.log('Fetched inventory: ' + response);
			if (response.data.length == 0) {
				return false;
			}
		}).catch((err) => {
			console.log('Unable to verify ownership: Unable to connect to OpenSea');
			return true;
		});

		return true;
	};

	return (
		showGuide ? <GuidePage ppid={PPID} setShowGuide={setShowGuide} /> :
			<Provider store={store}>
				<HashRouter>
					<RoutesComponent />
				</HashRouter>
			</Provider>
	);

};

const GuidePage = (props: any) => {
	const [step, setStep] = useState(0);
	const [msg, setMsg] = useState('');

	const connectWallet = () => {
		ipcRenderer.invoke('externalLink', 'https://pixelpal-test.herokuapp.com/connect');
		setStep(1);
	};

	const validateNFTSelection = () => {
		if (localStorage.getItem('NFT_IMG') == null) {	// TODO (Michael) use proper asset animations
			setMsg('Error: No pixel pal selected.');
		} else {
			props.setShowGuide(false);
		}
	};

	return (
		<div>
			{
				step == 0 ?
					<div>
						<h1>Hello 👋</h1>

						<p>Welcome to Pixel Pal! </p>

						<p>To begin, please connect your Metamask wallet holding one or more Pixel Pals by clicking the Connect button. You can update your connected wallet later in Settings. </p>

						<h3>Your Pixel Pal ID is: {props.ppid}</h3>
						<button onClick={() => navigator.clipboard.writeText(props.ppid)}>Copy</button>

						<button onClick={() => connectWallet()}> Connect</button>
					</div>
					: null
			}

			{
				step == 1 ?
					<div>
						<p>Select your Pixel Pal. Note: it may take up to 24 hours for OpenSea to register your ownership.</p>
						<NFT />
						<p>{msg}</p>
						<button onClick={() => validateNFTSelection()}>Next</button>
					</div>
					: null
			}
		</div>

	);
};

const RoutesComponent = () => {
	const [theme, setTheme] = useLocalStorage('theme', lightTheme);
	const navigate = useNavigate();

	React.useEffect(() => {
		function handleWindowHide() {
			navigate('/');
		}
		ipcRenderer.on('hide-tray-window', handleWindowHide);
		return () => ipcRenderer.removeListener('hide-tray-window', handleWindowHide);
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<Routes>
				<Route path="/" element={<Overview />} />
				<Route path="/settings/*" element={<Settings setTheme={setTheme} />} />
				{/* <Route path="/notification" component={Notification} /> */}
			</Routes>
		</ThemeProvider>

	);
};

ReactDOM.render(<App />, document.getElementById('root'));
