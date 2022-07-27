import { component } from 'haunted';
import { Slide, renderSlider, useSlider } from './use-slider';

const Slider = <T extends HTMLElement & { slide: Slide }>(host: T) =>
	renderSlider(useSlider(host));

customElements.define(
	'cosmoz-slider',
	component(Slider, { useShadowDOM: false })
);
