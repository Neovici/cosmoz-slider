import '../demo/basic-slider';
import '../demo/tab-slider';
import '../demo/advanced-slider';
import { html } from '@pionjs/pion';

export default {
	title: 'Cosmoz Slider',
	tags: ['autodocs'],
};

export const BasicSlider = () => html`<demo-basic-slider></demo-basic-slider>`;
BasicSlider.parameters = {
	docs: {
		description: {
			story: 'The basic version of Slider',
		},
	},
};

export const TabSlider = () => html`<demo-tab-slider></demo-tab-slider>`;
TabSlider.parameters = {
	docs: {
		description: {
			story: 'The tab version of Slider',
		},
	},
};

export const AdvancedSlider = ({ loop }) =>
	html`<demo-advanced-slider ?loop=${loop}></demo-advanced-slider>`;
AdvancedSlider.args = { loop: false };
AdvancedSlider.parameters = {
	docs: {
		description: {
			story: 'The advanced version of Slider',
		},
	},
};
