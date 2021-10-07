import { html, useEffect, useLayoutEffect, useState } from 'haunted';
import { directive } from 'lit-html';
import { repeat } from 'lit-html/directives/repeat';

export const
	style = html`<style>
		:host {
			display: block;
			position: relative;
			overflow: hidden;
		}

		:host > div {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
		}
	</style>`,
	useSlider = host => {
		const
			{ slide } = host,
			[slides, setSlides] = useState([]);

		useEffect(() => {
			if (slide == null) {
				return;
			}

			setSlides(slides => {
				const idx = slides.findIndex(({ id, out }) => id === slide.id && out !== true);

				if (idx !== -1) {
					return [...slides.slice(0, idx), slide, ...slides.slice(idx + 1, slides.length)];
				}

				return [...slides, slide];
			});
		}, [slide]);

		// @ts-ignore
		useLayoutEffect(async () => {
			if (slides.filter(slide => !slide.out).length < 2) {
				return;
			}

			const
				inSlide = slides[slides.length - 1],
				outSlide = slides[slides.length - 2],
				inEl = inSlide.el,
				outEl = outSlide.el;

			outSlide.out = true;

			await slide.animation?.(inEl, outEl);

			setSlides(slides => slides.filter(slide => slide !== outSlide));
		}, [slides]);

		return { slides };
	},
	slideRef = directive(slide => part => {
		slide.el = part?.committer?.element;
	}),
	renderSlide = slide => html`<div ceva=${ slideRef(slide) }>${ slide.content }</div>`,
	renderSlider = ({ slides }) => [style, repeat(slides, ({ id }) => id, renderSlide)];
