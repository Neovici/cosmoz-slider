export default {
	title: 'Cosmoz Slider',
};

import '../demo/basic-slider';
import '../demo/tab-slider';
import '../demo/advanced-slider';
import { html } from 'lit-html';

const BasicSlider = () => '<demo-basic-slider></demo-basic-slider>',
	TabSlider = () => '<demo-tab-slider></demo-tab-slider>',
	AdvancedSlider = ({ loop }) =>
		html`<demo-advanced-slider ?loop=${loop}></demo-advanced-slider>`;

AdvancedSlider.args = { loop: false };

export { BasicSlider, TabSlider, AdvancedSlider };
