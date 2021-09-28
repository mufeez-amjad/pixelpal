import React from 'react';
import styled from 'styled-components';

import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdError, MdInfo, MdCheckCircle } from 'react-icons/md';

const Banner = ({ banner }) => {
	const getBannerProperties = type => {
		switch (type) {
		case 'SUCCESS':
			return {
				bannerIcon: MdCheckCircle,
				bannerBackground: '#78c078',
				bannerText: '#3d703d'
			};
		case 'FAILURE':
			return {
				bannerIcon: MdError,
				bannerBackground: '#db8181',
				bannerText: '#962d2d'
			};
		default:
			return {
				bannerIcon: MdInfo,
				bannerBackground: '#acacac',
				bannerText: '#000000'
			};
		}
	};

	const { bannerBackground, bannerText } = React.useMemo(
		() => getBannerProperties(banner.type),
		[banner]
	);

	return (
		<Container color={bannerText} backgroundColor={bannerBackground}>
			<BannerIcon>
				{banner.type == 'SUCCESS' ? (
					<MdCheckCircle style={{ display: 'block' }} />
				) : banner.type == 'FAILURE' ? (
					<MdError style={{ display: 'block' }} />
				) : (
					<MdInfo style={{ display: 'block' }} />
				)}
			</BannerIcon>
			<BannerText>{banner.text}</BannerText>
			<BannerClose>
				<IoCloseCircleOutline
					color={bannerText}
					style={{ display: 'block' }}
				/>
			</BannerClose>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	border-radius: 10px;
	padding: 10px 15px;
	background-color: ${({ backgroundColor }) => backgroundColor};
	color: ${({ color }) => color};
`;

const BannerIcon = styled.div`
	font-size: 20px;
`;

const BannerText = styled.div`
	/* color: ${({ color }) => color} */

	padding-left: 10px;
	padding-right: 10px;
`;

const BannerClose = styled.button`
	cursor: default;
	background-color: transparent;
	/* padding: 5px; */
	margin: 0;
	padding: 0;
	border: none;
	font-size: 20px;
`;

export default Banner;
