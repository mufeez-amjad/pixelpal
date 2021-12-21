import Mixpanel from 'mixpanel';

const mixpanel = Mixpanel.init('e4914acb2794ddaa0478bfd6ec81064a');

export function getMixpanelInstance() {
	return mixpanel;
}
