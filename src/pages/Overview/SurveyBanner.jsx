import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdInfo } from 'react-icons/md';

const SurveyBanner = () => {
	const bannerBackground = '#eeeeee';
	const bannerText = '#000000';

	return (
		<Container color={bannerText} backgroundColor={bannerBackground}>
			<BannerIcon>
				<MdInfo style={{ display: 'block' }} />
			</BannerIcon>
			<Link to={'/survey'}>
				<BannerText>Help us by completing a quick survey!</BannerText>
			</Link>
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

export default SurveyBanner;
