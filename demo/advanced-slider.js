import { component, html, useState } from 'haunted';
import { useSlideList } from '../src';
import { guard } from 'lit-html/directives/guard.js';
import { until } from 'lit-html/directives/until.js';

const renderSlide = (item, { animationEnd$ }) => [
		html`<h1>my slide ${item.id}</h1>
			<p>${Math.random()}</p>
			<img
				src="${item.pic}"
				width="1200"
				height="300"
				style="background:gray;width:100%; height: auto;"
			/> `,
		guard(animationEnd$, () =>
			until(
				animationEnd$.then(() => html`<p>Animation done</p>`),
				html`<p>Animating...</p>`,
			),
		),
	],
	initItems = [
		{ id: 1, pic: 'https://picsum.photos/1200/300?random=1' },
		{ id: 2, pic: 'https://picsum.photos/1200/300?random=2' },
		{ id: 3, pic: 'https://picsum.photos/1200/300?random=3' },
		{ id: 4, pic: 'https://picsum.photos/1200/300?random=4' },
	],
	DemoAdvancedSlider = () => {
		const [items, setItems] = useState(initItems),
			{ index, slide, prev, next, first, last } = useSlideList(items, {
				render: renderSlide,
				id: (a) => a?.id,
			}),
			addItem = () =>
				setItems((items) => [
					...items,
					{
						id: items.length + 1,
						pic: 'https://picsum.photos/1200/300?random=' + (items.length + 1),
					},
				]),
			resetItems = () => setItems(initItems),
			shuffleItems = () =>
				setItems((items) =>
					items.concat().sort(() => (Math.random() > 0.5 ? 1 : -1)),
				),
			emptyItems = () => setItems([]),
			updateItem = () =>
				setItems((items) => [
					...items.slice(0, index),
					{
						...items[index],
						pic:
							'https://picsum.photos/1200/300?random=' +
							Math.round(Math.random() * 100),
					},
					...items.slice(index + 1),
				]);

		return html`
			<style>
				cosmoz-slider {
					width: 90vw;
					height: 500px;
					background: lightgray;
					text-wrap: nowrap;
				}
			</style>

			<cosmoz-slider .slide=${slide}></cosmoz-slider>
			${index + 1} / ${items.length}
			<button @click=${prev} ?disabled=${first}>Prev</button>
			<button @click=${next} ?disabled=${last}>Next</button>
			<button @click=${addItem}>Add item</button>
			<button @click=${resetItems}>Reset items</button>
			<button @click=${shuffleItems}>Shuffle items</button>
			<button @click=${emptyItems}>Empty items</button>
			<button @click=${updateItem}>Update item</button>
		`;
	};

customElements.define('demo-advanced-slider', component(DemoAdvancedSlider));
