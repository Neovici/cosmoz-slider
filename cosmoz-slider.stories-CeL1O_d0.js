import { f as f$1, j, p, v, r as r$1, h as h$2, m as m$1, w, T, x, i as i$4 } from './directive-helpers-BsidKJLT.js';

let current;
let currentId = 0;
function setCurrent(state) {
    current = state;
}
function clear() {
    current = null;
    currentId = 0;
}
function notify() {
    return currentId++;
}

const phaseSymbol = Symbol("haunted.phase");
const hookSymbol = Symbol("haunted.hook");
const updateSymbol = Symbol("haunted.update");
const commitSymbol = Symbol("haunted.commit");
const effectsSymbol = Symbol("haunted.effects");
const layoutEffectsSymbol = Symbol("haunted.layoutEffects");
const contextEvent = "haunted.context";

class State {
    update;
    host;
    virtual;
    [hookSymbol];
    [effectsSymbol];
    [layoutEffectsSymbol];
    constructor(update, host) {
        this.update = update;
        this.host = host;
        this[hookSymbol] = new Map();
        this[effectsSymbol] = [];
        this[layoutEffectsSymbol] = [];
    }
    run(cb) {
        setCurrent(this);
        let res = cb();
        clear();
        return res;
    }
    _runEffects(phase) {
        let effects = this[phase];
        setCurrent(this);
        for (let effect of effects) {
            effect.call(this);
        }
        clear();
    }
    runEffects() {
        this._runEffects(effectsSymbol);
    }
    runLayoutEffects() {
        this._runEffects(layoutEffectsSymbol);
    }
    teardown() {
        let hooks = this[hookSymbol];
        hooks.forEach((hook) => {
            if (typeof hook.teardown === "function") {
                hook.teardown();
            }
        });
    }
}

const defer = Promise.resolve().then.bind(Promise.resolve());
function runner() {
    let tasks = [];
    let id;
    function runTasks() {
        id = null;
        let t = tasks;
        tasks = [];
        for (var i = 0, len = t.length; i < len; i++) {
            t[i]();
        }
    }
    return function (task) {
        tasks.push(task);
        if (id == null) {
            id = defer(runTasks);
        }
    };
}
const read = runner();
const write = runner();
class BaseScheduler {
    renderer;
    host;
    state;
    [phaseSymbol];
    _updateQueued;
    constructor(renderer, host) {
        this.renderer = renderer;
        this.host = host;
        this.state = new State(this.update.bind(this), host);
        this[phaseSymbol] = null;
        this._updateQueued = false;
    }
    update() {
        if (this._updateQueued)
            return;
        read(() => {
            let result = this.handlePhase(updateSymbol);
            write(() => {
                this.handlePhase(commitSymbol, result);
                write(() => {
                    this.handlePhase(effectsSymbol);
                });
            });
            this._updateQueued = false;
        });
        this._updateQueued = true;
    }
    handlePhase(phase, arg) {
        this[phaseSymbol] = phase;
        switch (phase) {
            case commitSymbol:
                this.commit(arg);
                this.runEffects(layoutEffectsSymbol);
                return;
            case updateSymbol:
                return this.render();
            case effectsSymbol:
                return this.runEffects(effectsSymbol);
        }
    }
    render() {
        return this.state.run(() => this.renderer.call(this.host, this.host));
    }
    runEffects(phase) {
        this.state._runEffects(phase);
    }
    teardown() {
        this.state.teardown();
    }
}

const toCamelCase = (val = "") => val.replace(/-+([a-z])?/g, (_, char) => (char ? char.toUpperCase() : ""));
function makeComponent(render) {
    class Scheduler extends BaseScheduler {
        frag;
        renderResult;
        constructor(renderer, frag, host) {
            super(renderer, (host || frag));
            this.frag = frag;
        }
        commit(result) {
            this.renderResult = render(result, this.frag);
        }
    }
    function component(renderer, baseElementOrOptions, options) {
        const BaseElement = (options || baseElementOrOptions || {}).baseElement ||
            HTMLElement;
        const { observedAttributes = [], useShadowDOM = true, shadowRootInit = {}, styleSheets, } = options || baseElementOrOptions || {};
        class Element extends BaseElement {
            _scheduler;
            static get observedAttributes() {
                return renderer.observedAttributes || observedAttributes || [];
            }
            constructor() {
                super();
                if (useShadowDOM === false) {
                    this._scheduler = new Scheduler(renderer, this);
                }
                else {
                    const shadowRoot = this.attachShadow({
                        mode: "open",
                        ...shadowRootInit,
                    });
                    if (styleSheets)
                        shadowRoot.adoptedStyleSheets = styleSheets;
                    this._scheduler = new Scheduler(renderer, shadowRoot, this);
                }
            }
            connectedCallback() {
                this._scheduler.update();
                this._scheduler.renderResult?.setConnected(true);
            }
            disconnectedCallback() {
                this._scheduler.teardown();
                this._scheduler.renderResult?.setConnected(false);
            }
            attributeChangedCallback(name, oldValue, newValue) {
                if (oldValue === newValue) {
                    return;
                }
                let val = newValue === "" ? true : newValue;
                Reflect.set(this, toCamelCase(name), val);
            }
        }
        function reflectiveProp(initialValue) {
            let value = initialValue;
            let isSetup = false;
            return Object.freeze({
                enumerable: true,
                configurable: true,
                get() {
                    return value;
                },
                set(newValue) {
                    // Avoid scheduling update when prop value hasn't changed
                    if (isSetup && value === newValue)
                        return;
                    isSetup = true;
                    value = newValue;
                    if (this._scheduler) {
                        this._scheduler.update();
                    }
                },
            });
        }
        const proto = new Proxy(BaseElement.prototype, {
            getPrototypeOf(target) {
                return target;
            },
            set(target, key, value, receiver) {
                let desc;
                if (key in target) {
                    desc = Object.getOwnPropertyDescriptor(target, key);
                    if (desc && desc.set) {
                        desc.set.call(receiver, value);
                        return true;
                    }
                    Reflect.set(target, key, value, receiver);
                    return true;
                }
                if (typeof key === "symbol" || key[0] === "_") {
                    desc = {
                        enumerable: true,
                        configurable: true,
                        writable: true,
                        value,
                    };
                }
                else {
                    desc = reflectiveProp(value);
                }
                Object.defineProperty(receiver, key, desc);
                if (desc.set) {
                    desc.set.call(receiver, value);
                }
                return true;
            },
        });
        Object.setPrototypeOf(Element.prototype, proto);
        return Element;
    }
    return component;
}

class Hook {
    id;
    state;
    constructor(id, state) {
        this.id = id;
        this.state = state;
    }
}
function use(Hook, ...args) {
    let id = notify();
    let hooks = current[hookSymbol];
    let hook = hooks.get(id);
    if (!hook) {
        hook = new Hook(id, current, ...args);
        hooks.set(id, hook);
    }
    return hook.update(...args);
}
function hook(Hook) {
    return use.bind(null, Hook);
}

function createEffect(setEffects) {
    return hook(class extends Hook {
        callback;
        lastValues;
        values;
        _teardown;
        constructor(id, state, ignored1, ignored2) {
            super(id, state);
            setEffects(state, this);
        }
        update(callback, values) {
            this.callback = callback;
            this.values = values;
        }
        call() {
            const hasChanged = !this.values || this.hasChanged();
            this.lastValues = this.values;
            if (hasChanged) {
                this.run();
            }
        }
        run() {
            this.teardown();
            this._teardown = this.callback.call(this.state);
        }
        teardown() {
            if (typeof this._teardown === "function") {
                this._teardown();
            }
        }
        hasChanged() {
            return (!this.lastValues ||
                this.values.some((value, i) => this.lastValues[i] !== value));
        }
    });
}

function setEffects(state, cb) {
    state[effectsSymbol].push(cb);
}
/**
 * @function
 * @param {() => void} effect - callback function that runs each time dependencies change
 * @param {unknown[]} [dependencies] - list of dependencies to the effect
 * @return {void}
 */
const useEffect = createEffect(setEffects);

const getEmitter = (host) => {
    if (host instanceof Element)
        return host;
    return host.startNode || host.endNode || host.parentNode;
};
/**
 * @function
 * @template T
 * @param    {Context<T>} context
 * @return   {T}
 */
const useContext = hook(class extends Hook {
    Context;
    value;
    _ranEffect;
    _unsubscribe;
    constructor(id, state, _) {
        super(id, state);
        this._updater = this._updater.bind(this);
        this._ranEffect = false;
        this._unsubscribe = null;
        setEffects(state, this);
    }
    update(Context) {
        if (this.Context !== Context) {
            this._subscribe(Context);
            this.Context = Context;
        }
        return this.value;
    }
    call() {
        if (!this._ranEffect) {
            this._ranEffect = true;
            if (this._unsubscribe)
                this._unsubscribe();
            this._subscribe(this.Context);
            this.state.update();
        }
    }
    _updater(value) {
        this.value = value;
        this.state.update();
    }
    _subscribe(Context) {
        const detail = { Context, callback: this._updater };
        const emitter = getEmitter(this.state.host);
        emitter.dispatchEvent(new CustomEvent(contextEvent, {
            detail, // carrier
            bubbles: true, // to bubble up in tree
            cancelable: true, // to be able to cancel
            composed: true, // to pass ShadowDOM boundaries
        }));
        const { unsubscribe = null, value } = detail;
        this.value = unsubscribe ? value : Context.defaultValue;
        this._unsubscribe = unsubscribe;
    }
    teardown() {
        if (this._unsubscribe) {
            this._unsubscribe();
        }
    }
});

function makeContext(component) {
    return (defaultValue) => {
        const Context = {
            Provider: class extends HTMLElement {
                listeners;
                _value;
                constructor() {
                    super();
                    this.listeners = new Set();
                    this.addEventListener(contextEvent, this);
                }
                disconnectedCallback() {
                    this.removeEventListener(contextEvent, this);
                }
                handleEvent(event) {
                    const { detail } = event;
                    if (detail.Context === Context) {
                        detail.value = this.value;
                        detail.unsubscribe = this.unsubscribe.bind(this, detail.callback);
                        this.listeners.add(detail.callback);
                        event.stopPropagation();
                    }
                }
                unsubscribe(callback) {
                    this.listeners.delete(callback);
                }
                set value(value) {
                    this._value = value;
                    for (let callback of this.listeners) {
                        callback(value);
                    }
                }
                get value() {
                    return this._value;
                }
            },
            Consumer: component(function ({ render }) {
                const context = useContext(Context);
                return render(context);
            }, { useShadowDOM: false }),
            defaultValue,
        };
        return Context;
    };
}

/**
 * @function
 * @template T
 * @param  {() => T} fn function to memoize
 * @param  {unknown[]} values dependencies to the memoized computation
 * @return {T} The next computed value
 */
const useMemo = hook(class extends Hook {
    value;
    values;
    constructor(id, state, fn, values) {
        super(id, state);
        this.value = fn();
        this.values = values;
    }
    update(fn, values) {
        if (this.hasChanged(values)) {
            this.values = values;
            this.value = fn();
        }
        return this.value;
    }
    hasChanged(values = []) {
        return values.some((value, i) => this.values[i] !== value);
    }
});

/**
 * @function
 * @template {Function} T
 * @param    {T} fn - callback to memoize
 * @param    {unknown[]} inputs - dependencies to callback memoization
 * @return   {T}
 */
const useCallback = (fn, inputs) => useMemo(() => fn, inputs);

function setLayoutEffects(state, cb) {
    state[layoutEffectsSymbol].push(cb);
}
/**
 * @function
 * @param  {Effect} callback effecting callback
 * @param  {unknown[]} [values] dependencies to the effect
 * @return {void}
 */
const useLayoutEffect = createEffect(setLayoutEffects);

/**
 * @function
 * @template {*} T
 * @param {T} [initialState] - Optional initial state
 * @return {readonly [state: T, updaterFn: StateUpdater<T>]} stateTuple - Tuple of current state and state updater function
 */
const useState = hook(class extends Hook {
    args;
    constructor(id, state, initialValue) {
        super(id, state);
        this.updater = this.updater.bind(this);
        if (typeof initialValue === "function") {
            initialValue = initialValue();
        }
        this.makeArgs(initialValue);
    }
    update() {
        return this.args;
    }
    updater(value) {
        const [previousValue] = this.args;
        if (typeof value === "function") {
            const updaterFn = value;
            value = updaterFn(previousValue);
        }
        if (Object.is(previousValue, value)) {
            return;
        }
        this.makeArgs(value);
        this.state.update();
    }
    makeArgs(value) {
        this.args = Object.freeze([value, this.updater]);
    }
});

/**
 * Given a reducer function, initial state, and optional state initializer function, returns a tuple of state and dispatch function.
 * @function
 * @template S State
 * @template I Initial State
 * @template A Action
 * @param {Reducer<S, A>} reducer - reducer function to compute the next state given the previous state and the action
 * @param {I} initialState - the initial state of the reducer
 * @param {(init: I) => S} [init=undefined] - Optional initializer function, called on initialState if provided
 * @return {readonly [S, (action: A) => void]}
 */
hook(class extends Hook {
    reducer;
    currentState;
    constructor(id, state, _, initialState, init) {
        super(id, state);
        this.dispatch = this.dispatch.bind(this);
        this.currentState =
            init !== undefined ? init(initialState) : initialState;
    }
    update(reducer) {
        this.reducer = reducer;
        return [this.currentState, this.dispatch];
    }
    dispatch(action) {
        this.currentState = this.reducer(this.currentState, action);
        this.state.update();
    }
});

function useRef(initialValue) {
    return useMemo(() => ({
        current: initialValue,
    }), []);
}

function pion({ render }) {
    const component = makeComponent(render);
    const createContext = makeContext(component);
    return { component, createContext };
}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e$1=t=>(...e)=>({_$litDirective$:t,values:e});let i$3 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s$1=(i,t)=>{const e=i._$AN;if(void 0===e)return !1;for(const i of e)i._$AO?.(t,!1),s$1(i,t);return !0},o$2=i=>{let t,e;do{if(void 0===(t=i._$AM))break;e=t._$AN,e.delete(i),i=t;}while(0===e?.size)},r=i=>{for(let t;t=i._$AM;i=t){let e=t._$AN;if(void 0===e)t._$AN=e=new Set;else if(e.has(i))break;e.add(i),c$2(t);}};function h$1(i){void 0!==this._$AN?(o$2(this),this._$AM=i,r(this)):this._$AM=i;}function n$3(i,t=!1,e=0){const r=this._$AH,h=this._$AN;if(void 0!==h&&0!==h.size)if(t)if(Array.isArray(r))for(let i=e;i<r.length;i++)s$1(r[i],!1),o$2(r[i]);else null!=r&&(s$1(r,!1),o$2(r));else s$1(this,i);}const c$2=i=>{i.type==t.CHILD&&(i._$AP??=n$3,i._$AQ??=h$1);};class f extends i$3{constructor(){super(...arguments),this._$AN=void 0;}_$AT(i,t,e){super._$AT(i,t,e),r(this),this.isConnected=i._$AU;}_$AO(i,t=!0){i!==this.isConnected&&(this.isConnected=i,i?this.reconnected?.():this.disconnected?.()),t&&(s$1(this,i),o$2(this));}setValue(t){if(f$1(this._$Ct))this._$Ct._$AI(t,this);else {const i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0);}}disconnected(){}reconnected(){}}

const { component, createContext } = pion({ render: j });

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c$1=e$1(class extends i$3{constructor(e){if(super(e),e.type!==t.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.ht(e,s,t).values}update(s,[t,r,c]){const d=p(s),{values:p$1,keys:a}=this.ht(t,r,c);if(!Array.isArray(d))return this.dt=a,p$1;const h=this.dt??=[],v$1=[];let m,y,x=0,j=d.length-1,k=0,w$1=p$1.length-1;for(;x<=j&&k<=w$1;)if(null===d[x])x++;else if(null===d[j])j--;else if(h[x]===a[k])v$1[k]=v(d[x],p$1[k]),x++,k++;else if(h[j]===a[w$1])v$1[w$1]=v(d[j],p$1[w$1]),j--,w$1--;else if(h[x]===a[w$1])v$1[w$1]=v(d[x],p$1[w$1]),r$1(s,v$1[w$1+1],d[x]),x++,w$1--;else if(h[j]===a[k])v$1[k]=v(d[j],p$1[k]),r$1(s,d[x],d[j]),j--,k++;else if(void 0===m&&(m=u(a,k,w$1),y=u(h,x,j)),m.has(h[x]))if(m.has(h[j])){const e=y.get(a[k]),t=void 0!==e?d[e]:null;if(null===t){const e=r$1(s,d[x]);v(e,p$1[k]),v$1[k]=e;}else v$1[k]=v(t,p$1[k]),r$1(s,d[x],t),d[e]=null;k++;}else h$2(d[j]),j--;else h$2(d[x]),x++;for(;k<=w$1;){const e=r$1(s,v$1[w$1+1]);v(e,p$1[k]),v$1[k++]=e;}for(;x<=j;){const e=d[x++];null!==e&&h$2(e);}return this.dt=a,m$1(s,v$1),w}});

const o$1=new WeakMap,n$2=e$1(class extends f{render(i){return T}update(i,[s]){const e=s!==this.G;return e&&void 0!==this.G&&this.ot(void 0),(e||this.rt!==this.lt)&&(this.G=s,this.ct=i.options?.host,this.ot(this.lt=i.element)),T}ot(t){if("function"==typeof this.G){const i=this.ct??globalThis;let s=o$1.get(i);void 0===s&&(s=new WeakMap,o$1.set(i,s)),void 0!==s.get(this.G)&&this.G.call(this.ct,void 0),s.set(this.G,t),void 0!==t&&this.G.call(this.ct,t);}else this.G.value=t;}get rt(){return "function"==typeof this.G?o$1.get(this.ct??globalThis)?.get(this.G):this.G?.value}disconnected(){this.rt===this.lt&&this.ot(void 0);}reconnected(){this.ot(this.lt);}});

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n$1="important",i$2=" !"+n$1,o=e$1(class extends i$3{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ut)return this.ut=new Set(Object.keys(r)),this.render(r);for(const t of this.ut)null==r[t]&&(this.ut.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ut.add(t);const r="string"==typeof e&&e.endsWith(i$2);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n$1:""):s[t]=e;}}return w}});

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e={},i$1=e$1(class extends i$3{constructor(){super(...arguments),this.nt=e;}render(r,t){return t()}update(t,[s,e]){if(Array.isArray(s)){if(Array.isArray(this.nt)&&this.nt.length===s.length&&s.every(((r,t)=>r===this.nt[t])))return w}else if(this.nt===s)return w;return this.nt=Array.isArray(s)?Array.from(s):s,this.render(s,e)}});

class ManagedPromise extends Promise {
    constructor(callback) {
        const handles = {};
        super((resolve, reject) => Object.assign(handles, { resolve, reject }));
        Object.assign(this, handles);
        callback?.(handles.resolve, handles.reject);
    }
    // eslint-disable-next-line no-empty-function
    resolve = () => { };
}

const styles = {
  host: { position: "relative", display: "flex", overflow: "hidden" },
  slide: {
    position: "static",
    width: "100%",
    height: "100%"
  }
};
const useSlider = (host) => {
  const { slide } = host, [slides, setSlides] = useState([]);
  useLayoutEffect(() => void Object.assign(host.style, styles.host), []);
  useEffect(() => {
    if (slide == null) {
      return;
    }
    const _slide = {
      animationEnd$: new ManagedPromise(),
      ...slide
    };
    setSlides((slides2 = []) => {
      const idx = slides2.findIndex(({ id, out }) => id === _slide.id && out !== true);
      if (idx !== -1) {
        return [
          ...slides2.slice(0, idx),
          _slide,
          ...slides2.slice(idx + 1, slides2.length)
        ];
      }
      return [...slides2, _slide];
    });
  }, [slide]);
  useLayoutEffect(async () => {
    if (slides.filter((slide2) => !slide2.out).length < 2) {
      const slide2 = slides[0];
      slide2 && requestAnimationFrame(() => requestAnimationFrame(() => slide2.animationEnd$.resolve()));
      return;
    }
    const inSlide = slides[slides.length - 1], outSlide = slides[slides.length - 2], inEl = inSlide.el, outEl = outSlide.el;
    outSlide.out = true;
    if (inEl && outEl) {
      await inSlide.animation?.(inEl, outEl);
    }
    setSlides((slides2 = []) => slides2.filter((slide2) => slide2 !== outSlide));
  }, [slides]);
  return { slides };
};
const renderSlide$1 = (slide) => x`<div
		${n$2((el) => Object.assign(slide, { el }))}
		class="slide"
		style=${o(styles.slide)}
	>
		${i$1([slide], () => slide.content ?? slide.render?.(slide))}
	</div>`;
const renderSlider = ({ slides }) => i$1([slides], () => c$1(slides, ({ id }) => id, renderSlide$1));

const Slider = (host) => renderSlider(useSlider(host));
customElements.define("cosmoz-slider", component(Slider, { useShadowDOM: false }));

const slideInRight = (inEl, outEl) => {
  const inAnimation = inEl.animate([
    { position: "absolute", transform: "translateX(100%)" },
    { transform: "translateX(0%)" }
  ], { duration: 200, fill: "none", easing: "ease-in-out" }), outAnimation = outEl.animate([{}, { position: "absolute", transform: "translateX(-100%)" }], { duration: 200, fill: "none", easing: "ease-in-out" });
  return Promise.all([inAnimation.finished, outAnimation.finished]);
};
const slideInLeft = (inEl, outEl) => {
  const inAnimation = inEl.animate([
    { position: "absolute", transform: "translateX(-100%)" },
    { transform: "translateX(0%)" }
  ], { duration: 200, fill: "none", easing: "ease-in-out" }), outAnimation = outEl.animate([{}, { position: "absolute", transform: "translateX(100%)" }], { duration: 200, fill: "none", easing: "ease-in-out" });
  return Promise.all([inAnimation.finished, outAnimation.finished]);
};

const useLastValue = (value) => {
  const lastValue = useRef(void 0);
  useEffect(() => void (lastValue.current = value), [value]);
  return lastValue.current;
}, identity = (a) => a, find = (list, item, id) => list.find((i) => id(i) === id(item)) ?? list[0], emptySlide = () => ({
  id: Math.random(),
  content: T,
  animation: slideInRight
});
const useSlideList = (items, { initial, render, id = identity, loop }) => {
  const [item, setItem] = useState(() => initial ?? items[0]), index = useMemo(() => items.indexOf(item), [items, item]), prevIndex = useLastValue(index), prev = useCallback(() => setItem(() => loop ? items[(index - 1 + items.length) % items.length] : items[Math.max(0, Math.min(items.length - 1, index - 1))]), [items, index, loop]), next = useCallback(() => setItem(() => loop ? items[(index + 1) % items.length] : items[Math.max(0, Math.min(items.length - 1, index + 1))]), [items, index, loop]), goto = useCallback((index2) => setItem(() => items[index2]), [items]), first = loop ? false : index <= 0, last = loop ? false : index === items.length - 1, animation = (
    // eslint-disable-next-line no-nested-ternary
    index > (prevIndex ?? -1) ? loop && index === items.length - 1 && prevIndex === 0 ? slideInLeft : slideInRight : loop && index === 0 && prevIndex === items.length - 1 ? slideInRight : slideInLeft
  );
  useEffect(() => setItem((item2) => (
    // eslint-disable-next-line no-nested-ternary
    !item2 ? items[0] : items.indexOf(item2) >= 0 ? item2 : find(items, item2, id)
  )), [items]);
  return {
    index,
    item,
    slide: useMemo(() => {
      if (item == null)
        return emptySlide();
      return {
        id: id(item),
        render: (slide) => render(item, { next, prev, goto, first, last, ...slide }),
        animation
      };
    }, [item, render]),
    prev,
    next,
    goto,
    first,
    last
  };
};

const randValue = () => Math.trunc(Math.random() * 256), randColor = () => `rgb(${randValue()}, ${randValue()}, ${randValue()})`, newSlide = (id) => ({
  id,
  content: x`
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
  animation: slideInRight
}), DemoBasicSlider = () => {
  const [slide, setSlide] = useState(newSlide(1)), slideNow = () => setSlide((slide2) => newSlide(slide2.id + 1));
  return x`
			<style>
				cosmoz-slider {
					height: 80vh;
				}
			</style>
			<cosmoz-slider .slide=${slide} @click=${slideNow}></cosmoz-slider>
		`;
};
customElements.define("demo-basic-slider", component(DemoBasicSlider));

const tabs = {
  about: x`<h1>About</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
				veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
				commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
				velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
				occaecat cupidatat non proident, sunt in culpa qui officia deserunt
				mollit anim id est laborum.
			</p>`,
  mission: x`<h1>Mission</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Ut placerat orci
				nulla pellentesque dignissim. A diam maecenas sed enim ut sem viverra.
				Enim eu turpis egestas pretium aenean pharetra magna ac placerat.
				Suscipit adipiscing bibendum est ultricies integer quis auctor elit. Id
				neque aliquam vestibulum morbi blandit cursus risus at ultrices. Quam
				nulla porttitor massa id neque. Diam vel quam elementum pulvinar etiam
				non quam lacus suspendisse. Velit aliquet sagittis id consectetur.
				Venenatis urna cursus eget nunc. Arcu ac tortor dignissim convallis
				aenean et tortor at. Neque laoreet suspendisse interdum consectetur
				libero id faucibus nisl tincidunt. Pharetra massa massa ultricies mi
				quis hendrerit. Pellentesque nec nam aliquam sem et tortor consequat id.
				Semper feugiat nibh sed pulvinar proin gravida.
			</p>`,
  contact: x`<h1>Contact</h1>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
				tempor incididunt ut labore et dolore magna aliqua. Suscipit adipiscing
				bibendum est ultricies integer quis auctor elit sed. Id aliquet risus
				feugiat in. Amet cursus sit amet dictum sit amet justo donec enim.
				Lectus sit amet est placerat in egestas erat imperdiet. Imperdiet sed
				euismod nisi porta lorem. Facilisi morbi tempus iaculis urna id
				volutpat. Lectus nulla at volutpat diam ut. Blandit turpis cursus in hac
				habitasse platea dictumst quisque sagittis. In nibh mauris cursus mattis
				molestie a iaculis at. Iaculis eu non diam phasellus vestibulum lorem
				sed risus. Pharetra massa massa ultricies mi quis hendrerit. Ridiculus
				mus mauris vitae ultricies. Aliquam sem et tortor consequat id porta
				nibh venenatis. Amet volutpat consequat mauris nunc. Mattis ullamcorper
				velit sed ullamcorper.
			</p>`
}, animation = (prevTab, nextTab) => {
  const allTabs = Object.keys(tabs);
  return allTabs.indexOf(prevTab) < allTabs.indexOf(nextTab) ? slideInRight : slideInLeft;
}, DemoTabSlider = () => {
  const [slide, setSlide] = useState({
    id: "about",
    content: tabs.about,
    animation: slideInRight
  }), slideNow = (tab) => () => setSlide((slide2) => ({
    id: tab,
    content: tabs[tab],
    animation: animation(slide2.id, tab)
  }));
  return x`
			<style>
				cosmoz-slider {
					height: 80vh;
				}
			</style>
			<button @click=${slideNow("about")}>About</button>
			<button @click=${slideNow("mission")}>Mission</button>
			<button @click=${slideNow("contact")}>Contact</button>
			<cosmoz-slider .slide=${slide}></cosmoz-slider>
		`;
};
customElements.define("demo-tab-slider", component(DemoTabSlider));

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class s{constructor(t){this.G=t;}disconnect(){this.G=void 0;}reconnect(t){this.G=t;}deref(){return this.G}}class i{constructor(){this.Y=void 0,this.Z=void 0;}get(){return this.Y}pause(){this.Y??=new Promise((t=>this.Z=t));}resume(){this.Z?.(),this.Y=this.Z=void 0;}}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n=t=>!i$4(t)&&"function"==typeof t.then,h=1073741823;class c extends f{constructor(){super(...arguments),this._$C_t=h,this._$Cwt=[],this._$Cq=new s(this),this._$CK=new i;}render(...s){return s.find((t=>!n(t)))??w}update(s,i){const e=this._$Cwt;let r=e.length;this._$Cwt=i;const o=this._$Cq,c=this._$CK;this.isConnected||this.disconnected();for(let t=0;t<i.length&&!(t>this._$C_t);t++){const s=i[t];if(!n(s))return this._$C_t=t,s;t<r&&s===e[t]||(this._$C_t=h,r=0,Promise.resolve(s).then((async t=>{for(;c.get();)await c.get();const i=o.deref();if(void 0!==i){const e=i._$Cwt.indexOf(s);e>-1&&e<i._$C_t&&(i._$C_t=e,i.setValue(t));}})));}return w}disconnected(){this._$Cq.disconnect(),this._$CK.pause();}reconnected(){this._$Cq.reconnect(this),this._$CK.resume();}}const m=e$1(c);

const renderSlide = (item, { animationEnd$ }) => [
  x`<h1>my slide ${item.id}</h1>
			<p>${Math.random()}</p>
			<img
				src="${item.pic}"
				width="1200"
				height="300"
				style="background:gray;width:100%; height: auto;"
			/> `,
  i$1(
    animationEnd$,
    () => m(
      animationEnd$.then(() => x`<p>Animation done</p>`),
      x`<p>Animating...</p>`
    )
  )
], initItems = [
  { id: 1, pic: "https://picsum.photos/1200/300?random=1" },
  { id: 2, pic: "https://picsum.photos/1200/300?random=2" },
  { id: 3, pic: "https://picsum.photos/1200/300?random=3" },
  { id: 4, pic: "https://picsum.photos/1200/300?random=4" }
], DemoAdvancedSlider = ({ loop }) => {
  const [items, setItems] = useState(initItems), { index, slide, prev, next, first, last } = useSlideList(items, {
    loop,
    render: renderSlide,
    id: (a) => a?.id
  }), addItem = () => setItems((items2) => [
    ...items2,
    {
      id: items2.length + 1,
      pic: "https://picsum.photos/1200/300?random=" + (items2.length + 1)
    }
  ]), resetItems = () => setItems(initItems), shuffleItems = () => setItems(
    (items2) => items2.concat().sort(() => Math.random() > 0.5 ? 1 : -1)
  ), emptyItems = () => setItems([]), updateItem = () => setItems((items2) => [
    ...items2.slice(0, index),
    {
      ...items2[index],
      pic: "https://picsum.photos/1200/300?random=" + Math.round(Math.random() * 100)
    },
    ...items2.slice(index + 1)
  ]);
  return x`
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
customElements.define(
  "demo-advanced-slider",
  component(DemoAdvancedSlider, { observedAttributes: ["loop"] })
);

var cosmozSlider_stories = {
  title: "Cosmoz Slider",
  tags: ["autodocs"]
};
const BasicSlider = () => x`<demo-basic-slider></demo-basic-slider>`;
BasicSlider.parameters = {
  docs: {
    description: {
      story: "The basic version of Slider"
    }
  }
};
const TabSlider = () => x`<demo-tab-slider></demo-tab-slider>`;
TabSlider.parameters = {
  docs: {
    description: {
      story: "The tab version of Slider"
    }
  }
};
const AdvancedSlider = ({ loop }) => x`<demo-advanced-slider ?loop=${loop}></demo-advanced-slider>`;
AdvancedSlider.args = { loop: false };
AdvancedSlider.parameters = {
  docs: {
    description: {
      story: "The advanced version of Slider"
    }
  }
};
const __namedExportsOrder = ["BasicSlider", "TabSlider", "AdvancedSlider"];

export { AdvancedSlider, BasicSlider, TabSlider, __namedExportsOrder, cosmozSlider_stories as default };
