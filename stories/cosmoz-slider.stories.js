export default {
	title: 'Cosmoz Slider',
};

import '../demo/basic-slider';
import '../demo/tab-slider';
import '../demo/advanced-slider';

const BasicSlider = () => '<demo-basic-slider></demo-basic-slider>',
	TabSlider = () => '<demo-tab-slider></demo-tab-slider>',
	AdvancedSlider = () => '<demo-advanced-slider></demo-advanced-slider>';

export { BasicSlider, TabSlider, AdvancedSlider };
