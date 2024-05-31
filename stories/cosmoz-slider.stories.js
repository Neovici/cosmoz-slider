import '../demo/basic-slider';
import '../demo/tab-slider';
import '../demo/advanced-slider';
import { html } from '@pionjs/pion';

export default {
	title: 'Cosmoz Slider',
};

export const BasicSlider = () => html`<demo-basic-slider></demo-basic-slider>`;

export const TabSlider = () => html`<demo-tab-slider></demo-tab-slider>`;

export const AdvancedSlider = ({ loop }) =>
	html`<demo-advanced-slider ?loop=${loop}></demo-advanced-slider>`;
AdvancedSlider.args = { loop: false };
