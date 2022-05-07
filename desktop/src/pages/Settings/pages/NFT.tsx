import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Title } from './common';

const { ipcRenderer } = window.require('electron');

import axios from 'axios';

export default function NFT(): JSX.Element {
	const PPID = 'ppid_fake'; // TODO (Michael) use localStorage.getItem('PPID') once wallet connection works

	const [msg, setMsg] = useState('Hi');
	const [inventory, setInventory] = useState([]);

	// call the backend once at the start to get inventory for this ppid
	useEffect(() => {
		setMsg('Loading');
		refresh();
	}, []);

	const savePixelPal = (pixelpal: any) => {
		localStorage.setItem('NFT_IMG', getIpfsUrl(pixelpal.image));	// TODO (Michael) use proper asset animations
	};

	const getIpfsUrl = (url: string) => {
		return 'https://ipfs.io/ipfs/' + url.substring(7);
	};

	const refresh = () => {
		/*
		NOTE: Format of reponse from backend is:
			[
				{
					"name": "Pixel Pal #2",
					"description": "Your digital companion",
					"image": "ipfs://QmZQhumc4Kv97LC52Cu6uSyNUsPJa1fets926Msjx3ZNmt/output1.gif",
					"attributes": [
						{
							"trait_type": "Tie",
							"value": "Tie.gif"
						}
					]
				}
			]
		*/
		
		axios.get(
			'https://pixelpal-test.herokuapp.com/nft/' + PPID, // TODO change to mainnet
		).then(function (response) {
			console.log('Fetched inventory: ' + response);
			setInventory(response.data);
			setMsg('Fetched inventory: ' + response.data);
		}).catch((err) => {
			setMsg('Unable to connect to OpenSea. Please try again later');
		});
	};

	const connectWallet = () => {
		ipcRenderer.invoke('externalLink', 'https://pixelpal-test.herokuapp.com/connect');
	};

	return (
		<Container>
			<h1>NFT</h1>
			<h3>Your Pixel Pal ID is: {PPID}</h3>
			<button onClick={() => navigator.clipboard.writeText(PPID)}>Copy</button>
			<button onClick={() => connectWallet()}> Connect Another Wallet</button>
			<button onClick={refresh}>Refresh</button>
			<div>{msg}</div>
			{
				inventory.map((pixelpal: any) => 
					<div key={pixelpal['name']} onClick={() => savePixelPal(pixelpal)}>
						{pixelpal['name']}
						<img src={getIpfsUrl(pixelpal.image)}/>
					</div>)
			}
		</Container>
	);
}

const Container = styled.div`
	padding-left: 10px;
`;
