import { component, html, useState } from 'haunted';
import { slideInRight } from '../src/animations';

const randValue = () => Math.trunc(Math.random() * 256),
	randColor = () => `rgb(${randValue()}, ${randValue()}, ${randValue()})`,
	newSlide = (id) => ({
		id,
		content: html`
			<style>
				div {
					display: flex;
					justify-content: center;
					align-items: center;
					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					user-select: none;
				}
			</style>
			<div style="background-color: ${randColor()}">
				<div>Click me!</div>
			</div>
		`,
		animation: slideInRight,
	}),
	DemoBasicSlider = () => {
		const [slide, setSlide] = useState(newSlide(1)),
			slideNow = () => setSlide((slide) => newSlide(slide.id + 1));
		return html`
			<style>
				cosmoz-slider {
					height: 80vh;
				}
			</style>
			<cosmoz-slider .slide=${slide} @click=${slideNow}></cosmoz-slider>
		`;
	};

customElements.define('demo-basic-slider', component(DemoBasicSlider));
