import { component, html, useState } from 'haunted';
import { slideInLeft, slideInRight } from '../lib/animations';
import '../cosmoz-slider';

const
	tabs = {
		about: html`<h1>About</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis
aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>`,
		mission: html`<h1>Mission</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
aliqua. Ut placerat orci nulla pellentesque dignissim. A diam maecenas sed enim ut sem viverra. Enim eu turpis egestas
pretium aenean pharetra magna ac placerat. Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Id neque
aliquam vestibulum morbi blandit cursus risus at ultrices. Quam nulla porttitor massa id neque. Diam vel quam elementum
pulvinar etiam non quam lacus suspendisse. Velit aliquet sagittis id consectetur. Venenatis urna cursus eget nunc. Arcu
ac tortor dignissim convallis aenean et tortor at. Neque laoreet suspendisse interdum consectetur libero id faucibus
nisl tincidunt. Pharetra massa massa ultricies mi quis hendrerit. Pellentesque nec nam aliquam sem et tortor consequat
id. Semper feugiat nibh sed pulvinar proin gravida.</p>`,
		contact: html`<h1>Contact</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
aliqua. Suscipit adipiscing bibendum est ultricies integer quis auctor elit sed. Id aliquet risus feugiat in. Amet
cursus sit amet dictum sit amet justo donec enim. Lectus sit amet est placerat in egestas erat imperdiet. Imperdiet sed
euismod nisi porta lorem. Facilisi morbi tempus iaculis urna id volutpat. Lectus nulla at volutpat diam ut. Blandit
turpis cursus in hac habitasse platea dictumst quisque sagittis. In nibh mauris cursus mattis molestie a iaculis at.
Iaculis eu non diam phasellus vestibulum lorem sed risus. Pharetra massa massa ultricies mi quis hendrerit. Ridiculus
mus mauris vitae ultricies. Aliquam sem et tortor consequat id porta nibh venenatis. Amet volutpat consequat mauris
nunc. Mattis ullamcorper velit sed ullamcorper.</p>`
	},
	animation = (prevTab, nextTab) => {
		const allTabs = Object.keys(tabs);
		return allTabs.indexOf(prevTab) < allTabs.indexOf(nextTab) ? slideInRight : slideInLeft;
	},
	DemoTabSlider = () => {
		const
			[slide, setSlide] = useState({ id: 'about', content: tabs.about, animation: slideInRight }),
			slideNow = tab => () => setSlide(slide => ({ id: tab, content: tabs[tab], animation: animation(slide.id, tab) }));
		return html`
		<style>cosmoz-slider{height: 80vh}</style>
		<button @click=${ slideNow('about') }>About</button>
		<button @click=${ slideNow('mission') }>Mission</button>
		<button @click=${ slideNow('contact') }>Contact</button>
		<cosmoz-slider .slide=${ slide }></cosmoz-slider>
	`;
	};

customElements.define('demo-tab-slider', component(DemoTabSlider));
