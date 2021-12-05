import { component } from 'haunted';
import { renderSlider, useSlider } from './lib/use-slider';

const Slider = host => renderSlider(useSlider(host));

customElements.define('cosmoz-slider', component(Slider, { useShadowDOM: false }));
