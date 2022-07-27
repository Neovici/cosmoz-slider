import { expect, fixture, html, nextFrame, aTimeout } from '@open-wc/testing';
import { dropTop, slideInLeft, slideInRight } from '../src';

const expectSlide = (el, content) => expect(el).dom.to.equal(`<cosmoz-slider>${ content }</cosmoz-slider>`, { ignoreAttributes: ['style', 'class']});

it('renders an empty slider', async () => {
	const el = await fixture(html`<cosmoz-slider></cosmoz-slider>`);
	expect(el).dom.to.equal('<cosmoz-slider></cosmoz-slider>', { ignoreAttributes: ['style']});
});

it('renders a slide', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { content: html`Hello world` } }></cosmoz-slider>`);
	expectSlide(el, '<div>Hello world</div>');
});

it('switches between two slides', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expectSlide(el, '<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe` };
	await nextFrame();
	expectSlide(el, '<div>Greetings globe</div>');
});

it('animates between two slides', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expectSlide(el, '<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe`, animation: slideInRight };
	await nextFrame();
	expectSlide(el, '<div>Hello world</div><div>Greetings globe</div>');
	await aTimeout(300);
	expectSlide(el, '<div>Greetings globe</div>');
});

it('updates a slide by id', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expectSlide(el, '<div>Hello world</div>');

	el.slide = { id: 1, content: html`Greetings globe`, animation: slideInRight };
	await nextFrame();
	expectSlide(el, '<div>Greetings globe</div>');
});

it('animates using configurable animations', async () => {
	const el = await fixture(html`<cosmoz-slider .slide=${ { id: 1, content: html`Hello world` } }></cosmoz-slider>`);
	expectSlide(el, '<div>Hello world</div>');

	el.slide = { id: 2, content: html`Greetings globe`, animation: slideInLeft };
	await nextFrame();
	expectSlide(el, '<div>Hello world</div><div>Greetings globe</div>');
	el.slide = { id: 3, content: html`Aloha planet`, animation: dropTop };
	await nextFrame();
	expectSlide(el, '<div>Hello world</div><div>Greetings globe</div><div>Aloha planet</div>');
	await aTimeout(300);
	expectSlide(el, '<div>Aloha planet</div>');
});
