import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import styled from 'styled-components';

import google from './google.png';
import microsoft from './microsoft.png';

const { ipcRenderer } = window.require('electron');

import { IconButton, ImageButton } from '../../../common/buttons';
import { IAccounts, IPlatformAccounts } from '../../../../common/types';

import { GoPlus } from 'react-icons/go';

export default function Calendar(): JSX.Element {
	const [accounts, setAccounts] = React.useState<IAccounts>({});
	const [showingOAuth, setShowingOAuth] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const accountsInfo: IAccounts = await ipcRenderer.invoke('getConnectedAccounts');
			setAccounts(accountsInfo);
		})();
	}, []);

	const triggerOAuth = async (provider: string) => {
		try {
			const nextAccounts = await ipcRenderer.invoke('triggerOAuth', provider);
			setAccounts(nextAccounts);
		} catch (err) {
			console.error(err);
		}
	};

	const connectedAccounts = React.useMemo(() => {
		if (!accounts) {
			return [];
		}
		return Object.keys(accounts).map((provider) => {
			const providerAccounts: IPlatformAccounts = accounts[provider as keyof IAccounts] || {};
			return (
				<>
					<Integration
						provider={provider}
						accounts={providerAccounts}
					/>
				</>
			);
		});
	}, [accounts]);

	return (
		<Container>
			<div
				style={{
					flex: 4,
				}}
			>
				{Object.keys(accounts).length ? (
					<>
						{connectedAccounts}
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
					text='Connect'
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
	provider: string;
	accounts: IPlatformAccounts;
}

const Integration = ({accounts, provider}: IntegrationProps) => {
	function capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	return (
		<IntegrationContainer>
			<IntegrationHeader>
				<img 
					style={{width: 20, height: 20}}
					src={provider == 'google' ? google : microsoft}
				/>
				<IntegrationTitle>
					{capitalizeFirstLetter(provider)}
				</IntegrationTitle>
			</IntegrationHeader>
			
			<div
				style={{
					marginTop: 8
				}}
			>
				{Object.entries(accounts).map((value, index) => {
					return (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'space-between',
								marginBottom: 8,
								// paddingRight: 4
							}}
						>
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
									}}
								>
									<IntegrationAccount>
										{value[0]}
									</IntegrationAccount>
								</div>
							</div>
							<FaChevronDown size={10}/>
						</div>
					);
				})}
			</div>
			
		</IntegrationContainer>
	);
};

const IntegrationContainer = styled.div`
	padding: 8px 0px;
`;

const IntegrationHeader = styled.div`
	display: flex;
	align-items: center;
	border-bottom: 1px solid #c0c0c0;
	padding-bottom: 6px;
`;

const IntegrationTitle = styled.div`
	font-size: 13px;
	margin-left: 4px;
`;

const IntegrationAccount = styled.div`
	font-weight: 200;
	font-size: 12px;

	width: 150px;
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
