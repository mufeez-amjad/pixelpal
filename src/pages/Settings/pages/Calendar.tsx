import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styled from 'styled-components';

import google from './google.png';
import microsoft from './microsoft.png';

const { ipcRenderer } = window.require('electron');

import { IconButton, ImageButton } from '../../../common/buttons';
import { IAccounts } from '../../../../common/types';

import { GoPlus } from 'react-icons/go';

export default function Calendar(): JSX.Element {
	const [accounts, setAccounts] = React.useState<Account[]>([]);
	const [showingOAuth, setShowingOAuth] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const accountsInfo: IAccounts = await ipcRenderer.invoke('getConnectedAccounts');
			console.log(accountsInfo);
			setAccounts(flattenAccounts(accountsInfo));
		})();
	}, []);

	const triggerOAuth = async (provider: string) => {
		try {
			const nextAccounts = await ipcRenderer.invoke('triggerOAuth', provider);
			setAccounts(flattenAccounts(nextAccounts));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<Container>
			<div
				style={{
					flex: 4,
				}}
			>
				{accounts.length ? (
					<>
						{accounts.map((account, i) => (
							<Integration 
								key={account.account+i}
								account={account.account}
								name={account.name}
								image={account.name == 'google' ? google : microsoft}
							/>
						))}
					</>
				) : (
					<span>No integrations.</span>
				)}
			</div>
			<div
				style={{flex: 1}}
			>
				<IconButton 
					Icon={GoPlus}
					text='Connect an account'
					onClick={() => setShowingOAuth(!showingOAuth)}
				/>

				{ showingOAuth && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							marginTop: 8
						}}
					>
						<ImageButton 
							image={google}
							onClick={() => triggerOAuth('google')}
							style={{
								flexGrow: 1,
								backgroundColor: '#e0e0e0',
							}}
						/>

						<ImageButton 
							image={microsoft}
							onClick={() => triggerOAuth('microsoft')}
							style={{
								flexGrow: 1,
								backgroundColor: '#e0e0e0',
								marginLeft: 8,
							}}
						/>
					</div>
				)}
			</div>
		</Container>
	);
}

const Container = styled.div`
	padding-left: 10px;
	height: 100%;
	display: flex;
	flex-direction: column;
	/* justify-content: space-between; */
`;

interface IntegrationProps {
	name: string;
	account: string;
	image: string;
}

const Integration = ({name, account, image}: IntegrationProps) => {
	
	function capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return (
		<IntegrationContainer>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					<img 
						style={{width: 20, height: 20}}
						src={image}
					/>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							marginLeft: 8,
						}}
					>
						<IntegrationTitle>
							{capitalizeFirstLetter(name)}
						</IntegrationTitle>
						<IntegrationAccount>
							{account}
						</IntegrationAccount>
					</div>
				</div>
				<FaChevronDown />
			</div>
			

			
		</IntegrationContainer>
	);
};

const IntegrationContainer = styled.div`
	padding: 8px 0px;
`;

const IntegrationTitle = styled.div`
	font-size: 13px;
`;

const IntegrationAccount = styled.div`
	font-weight: 200;
	font-size: 12px;

	width: 160px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

interface Account {
	name: string;
	account: string;
}

function flattenAccounts(accounts: IAccounts): Array<Account> {
	const res: Account[] = [];
	Object.keys(accounts.google || {}).forEach(account => {
		res.push({
			name: 'google',
			account: account
		});
	});
	
	Object.keys(accounts.microsoft || {}).forEach(account => {
		res.push({
			name: 'microsoft',
			account: account
		});
	});
	return res;
}