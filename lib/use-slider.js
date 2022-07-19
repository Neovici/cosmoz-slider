import { html, useEffect, useLayoutEffect, useState } from 'haunted';
import { repeat } from 'lit-html/directives/repeat.js';
import { ref } from 'lit-html/directives/ref.js';
import { styleMap } from 'lit-html/directives/style-map.js';
import { guard } from 'lit-html/directives/guard.js';
import { ManagedPromise } from '@neovici/cosmoz-utils/promise';

export const styles = {
		host: { position: 'relative', display: 'block', overflow: 'hidden' },
		slide: {
			position: 'static',
			width: '100%',
			height: '100%',
		},
	},
	useSlider = (host) => {
		const { slide } = host,
			[slides, setSlides] = useState([]);

		useLayoutEffect(() => Object.assign(host.style, styles.host), []);

		useEffect(() => {
			if (slide == null) {
				return;
			}

			const _slide = { animationEnd$: new ManagedPromise(), ...slide };

			setSlides((slides) => {
				const idx = slides.findIndex(
					({ id, out }) => id === _slide.id && out !== true
				);

				if (idx !== -1) {
					return [
						...slides.slice(0, idx),
						_slide,
						...slides.slice(idx + 1, slides.length),
					];
				}

				return [...slides, _slide];
			});
		}, [slide]);

		// @ts-ignore
		useLayoutEffect(async () => {
			if (slides.filter((slide) => !slide.out).length < 2) {
				slides[0] &&
					requestAnimationFrame(() =>
						requestAnimationFrame(slides[0].animationEnd$.resolve)
					);
				return;
			}

			const inSlide = slides[slides.length - 1],
				outSlide = slides[slides.length - 2],
				inEl = inSlide.el,
				outEl = outSlide.el;

			outSlide.out = true;

			await inSlide.animation?.(inEl, outEl);

			setSlides((slides) => slides.filter((slide) => slide !== outSlide));
		}, [slides]);

		return { slides };
	},
	renderSlide = (slide) =>
		html`<div
			${ref((el) => Object.assign(slide, { el }))}
			class="slide"
			style=${styleMap(styles.slide)}
		>
			${slide.content ?? slide.render(slide)}
		</div>`,
	renderSlider = ({ slides }) =>
		guard([slides], () => repeat(slides, ({ id }) => id, renderSlide));
