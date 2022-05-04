import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Title } from './common';

import axios from 'axios';

export default function NFT(): JSX.Element {
	const PPID = 'ppid_fake'; // TODO use localStorage.getItem('PPID')

	const [msg, setMsg] = useState('Hi');
	const [inventory, setInventory] = useState([]);
	const [selectedPP, setSelectedPP] = useState({});

	// call the backend once at the start to get inventory for this ppid
	useEffect(() => {
		setMsg('Loading');

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
	}, []);

	const savePixelPal = (pixelpal: any) => {
		localStorage.setItem('img', getIpfsUrl(pixelpal.image));
	};

	const getIpfsUrl = (url: string) => {
		return 'https://ipfs.io/ipfs/' + url.substring(7);
	};

	return (
		<Container>
			<h1>NFT</h1>
			<div>{msg}</div>
			{
				inventory.map((pixelpal: any) => 
					<div key={pixelpal['name']} onClick={() => setSelectedPP(pixelpal)}>
						{pixelpal['name']}
						<img src={getIpfsUrl(pixelpal.image)}/>
					</div>)
			}
			<button onClick={savePixelPal}>Save</button>
		</Container>
	);
}

const Container = styled.div`
	padding-left: 10px;
`;
