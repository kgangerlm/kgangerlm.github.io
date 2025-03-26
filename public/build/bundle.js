
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value == null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    let render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = /* @__PURE__ */ Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        // Do not reenter flush while dirty components are updated, as this can
        // result in an infinite loop. Instead, let the inner flush handle it.
        // Reentrancy is ok afterwards for bindings etc.
        if (flushidx !== 0) {
            return;
        }
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            try {
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
            }
            catch (e) {
                // reset dirty state to not end up in a deadlocked state and then rethrow
                dirty_components.length = 0;
                flushidx = 0;
                throw e;
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    /**
     * Useful for example to execute remaining `afterUpdate` callbacks before executing `destroy`.
     */
    function flush_render_callbacks(fns) {
        const filtered = [];
        const targets = [];
        render_callbacks.forEach((c) => fns.indexOf(c) === -1 ? filtered.push(c) : targets.push(c));
        targets.forEach((c) => c());
        render_callbacks = filtered;
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            flush_render_callbacks($$.after_update);
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.59.2' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation, has_stop_immediate_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        if (has_stop_immediate_propagation)
            modifiers.push('stopImmediatePropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/components/DayCard.svelte generated by Svelte v3.59.2 */

    const file$3 = "src/components/DayCard.svelte";

    function create_fragment$3(ctx) {
    	let div5;
    	let div1;
    	let h3;
    	let t0;
    	let t1_value = /*day*/ ctx[0].dayNumber + "";
    	let t1;
    	let t2;
    	let div0;
    	let t3_value = /*day*/ ctx[0].date + "";
    	let t3;
    	let t4;
    	let div4;
    	let div2;
    	let t5_value = /*day*/ ctx[0].emoji + "";
    	let t5;
    	let t6;
    	let t7_value = /*day*/ ctx[0].title + "";
    	let t7;
    	let t8;
    	let div3;
    	let strong;
    	let t10;
    	let t11_value = /*day*/ ctx[0].route.from + "";
    	let t11;
    	let t12;
    	let t13_value = /*day*/ ctx[0].route.to + "";
    	let t13;
    	let t14;
    	let p;
    	let t15_value = /*day*/ ctx[0].summary + "";
    	let t15;
    	let t16;
    	let button;
    	let div5_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div1 = element("div");
    			h3 = element("h3");
    			t0 = text("Day ");
    			t1 = text(t1_value);
    			t2 = space();
    			div0 = element("div");
    			t3 = text(t3_value);
    			t4 = space();
    			div4 = element("div");
    			div2 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			t7 = text(t7_value);
    			t8 = space();
    			div3 = element("div");
    			strong = element("strong");
    			strong.textContent = "Route:";
    			t10 = space();
    			t11 = text(t11_value);
    			t12 = text(" → ");
    			t13 = text(t13_value);
    			t14 = space();
    			p = element("p");
    			t15 = text(t15_value);
    			t16 = space();
    			button = element("button");
    			button.textContent = "View Details";
    			attr_dev(h3, "class", "svelte-1k3n61x");
    			add_location(h3, file$3, 9, 4, 237);
    			attr_dev(div0, "class", "card-date svelte-1k3n61x");
    			add_location(div0, file$3, 10, 4, 270);
    			attr_dev(div1, "class", "card-header svelte-1k3n61x");
    			add_location(div1, file$3, 8, 2, 207);
    			attr_dev(div2, "class", "card-highlight svelte-1k3n61x");
    			add_location(div2, file$3, 13, 4, 352);
    			attr_dev(strong, "class", "svelte-1k3n61x");
    			add_location(strong, file$3, 14, 28, 438);
    			attr_dev(div3, "class", "card-route svelte-1k3n61x");
    			add_location(div3, file$3, 14, 4, 414);
    			add_location(p, file$3, 15, 4, 506);
    			attr_dev(button, "class", "card-details svelte-1k3n61x");
    			add_location(button, file$3, 16, 4, 531);
    			attr_dev(div4, "class", "card-content svelte-1k3n61x");
    			add_location(div4, file$3, 12, 2, 321);
    			attr_dev(div5, "class", div5_class_value = "itinerary-card " + (/*isActive*/ ctx[1] ? 'active' : '') + " svelte-1k3n61x");
    			add_location(div5, file$3, 7, 0, 130);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div1);
    			append_dev(div1, h3);
    			append_dev(h3, t0);
    			append_dev(h3, t1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, t3);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, t5);
    			append_dev(div2, t6);
    			append_dev(div2, t7);
    			append_dev(div4, t8);
    			append_dev(div4, div3);
    			append_dev(div3, strong);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div4, t14);
    			append_dev(div4, p);
    			append_dev(p, t15);
    			append_dev(div4, t16);
    			append_dev(div4, button);

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						button,
    						"click",
    						stop_propagation(function () {
    							if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
    						}),
    						false,
    						false,
    						true,
    						false
    					),
    					listen_dev(
    						div5,
    						"click",
    						function () {
    							if (is_function(/*onClick*/ ctx[2])) /*onClick*/ ctx[2].apply(this, arguments);
    						},
    						false,
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*day*/ 1 && t1_value !== (t1_value = /*day*/ ctx[0].dayNumber + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*day*/ 1 && t3_value !== (t3_value = /*day*/ ctx[0].date + "")) set_data_dev(t3, t3_value);
    			if (dirty & /*day*/ 1 && t5_value !== (t5_value = /*day*/ ctx[0].emoji + "")) set_data_dev(t5, t5_value);
    			if (dirty & /*day*/ 1 && t7_value !== (t7_value = /*day*/ ctx[0].title + "")) set_data_dev(t7, t7_value);
    			if (dirty & /*day*/ 1 && t11_value !== (t11_value = /*day*/ ctx[0].route.from + "")) set_data_dev(t11, t11_value);
    			if (dirty & /*day*/ 1 && t13_value !== (t13_value = /*day*/ ctx[0].route.to + "")) set_data_dev(t13, t13_value);
    			if (dirty & /*day*/ 1 && t15_value !== (t15_value = /*day*/ ctx[0].summary + "")) set_data_dev(t15, t15_value);

    			if (dirty & /*isActive*/ 2 && div5_class_value !== (div5_class_value = "itinerary-card " + (/*isActive*/ ctx[1] ? 'active' : '') + " svelte-1k3n61x")) {
    				attr_dev(div5, "class", div5_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DayCard', slots, []);
    	let { day } = $$props;
    	let { isActive = false } = $$props;
    	let { onClick } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (day === undefined && !('day' in $$props || $$self.$$.bound[$$self.$$.props['day']])) {
    			console.warn("<DayCard> was created without expected prop 'day'");
    		}

    		if (onClick === undefined && !('onClick' in $$props || $$self.$$.bound[$$self.$$.props['onClick']])) {
    			console.warn("<DayCard> was created without expected prop 'onClick'");
    		}
    	});

    	const writable_props = ['day', 'isActive', 'onClick'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DayCard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    	};

    	$$self.$capture_state = () => ({ day, isActive, onClick });

    	$$self.$inject_state = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    		if ('isActive' in $$props) $$invalidate(1, isActive = $$props.isActive);
    		if ('onClick' in $$props) $$invalidate(2, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [day, isActive, onClick];
    }

    class DayCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { day: 0, isActive: 1, onClick: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DayCard",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get day() {
    		throw new Error("<DayCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set day(value) {
    		throw new Error("<DayCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isActive() {
    		throw new Error("<DayCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isActive(value) {
    		throw new Error("<DayCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onClick() {
    		throw new Error("<DayCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onClick(value) {
    		throw new Error("<DayCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/ActivityItem.svelte generated by Svelte v3.59.2 */

    const file$2 = "src/components/ActivityItem.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[15] = list[i];
    	return child_ctx;
    }

    // (22:4) {#if isFeatured || isGem || isUserSelected}
    function create_if_block_6$2(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block0 = /*isFeatured*/ ctx[2] && create_if_block_9(ctx);
    	let if_block1 = /*isGem*/ ctx[3] && create_if_block_8(ctx);
    	let if_block2 = /*isUserSelected*/ ctx[4] && create_if_block_7$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(div, "class", "badge-container svelte-na3pjd");
    			add_location(div, file$2, 22, 6, 897);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$2.name,
    		type: "if",
    		source: "(22:4) {#if isFeatured || isGem || isUserSelected}",
    		ctx
    	});

    	return block;
    }

    // (24:8) {#if isFeatured}
    function create_if_block_9(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "⭐ Featured";
    			attr_dev(span, "class", "badge featured-badge svelte-na3pjd");
    			add_location(span, file$2, 23, 24, 951);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(24:8) {#if isFeatured}",
    		ctx
    	});

    	return block;
    }

    // (25:8) {#if isGem}
    function create_if_block_8(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "💎 Hidden Gem";
    			attr_dev(span, "class", "badge gem-badge svelte-na3pjd");
    			add_location(span, file$2, 24, 19, 1028);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(25:8) {#if isGem}",
    		ctx
    	});

    	return block;
    }

    // (26:8) {#if isUserSelected}
    function create_if_block_7$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "✓ Selected";
    			attr_dev(span, "class", "badge selected-badge svelte-na3pjd");
    			add_location(span, file$2, 25, 28, 1112);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7$1.name,
    		type: "if",
    		source: "(26:8) {#if isUserSelected}",
    		ctx
    	});

    	return block;
    }

    // (32:6) {#if typeEmoji}
    function create_if_block_5$2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = `${/*typeEmoji*/ ctx[1]}`;
    			attr_dev(span, "class", "type-emoji svelte-na3pjd");
    			add_location(span, file$2, 31, 21, 1287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(32:6) {#if typeEmoji}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if item.description}
    function create_if_block_4$2(ctx) {
    	let div;
    	let t_value = /*item*/ ctx[0].description + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "activity-desc svelte-na3pjd");
    			add_location(div, file$2, 37, 6, 1429);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && t_value !== (t_value = /*item*/ ctx[0].description + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(37:4) {#if item.description}",
    		ctx
    	});

    	return block;
    }

    // (42:4) {#if details.length > 0}
    function create_if_block_3$2(ctx) {
    	let ul;
    	let each_value_2 = /*details*/ ctx[5];
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2$2(get_each_context_2$2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "details-list svelte-na3pjd");
    			add_location(ul, file$2, 42, 6, 1552);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*details*/ 32) {
    				each_value_2 = /*details*/ ctx[5];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(42:4) {#if details.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (44:8) {#each details as detail}
    function create_each_block_2$2(ctx) {
    	let li;
    	let t_value = /*detail*/ ctx[15] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-na3pjd");
    			add_location(li, file$2, 44, 10, 1622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$2.name,
    		type: "each",
    		source: "(44:8) {#each details as detail}",
    		ctx
    	});

    	return block;
    }

    // (51:4) {#if cost !== null}
    function create_if_block_2$2(ctx) {
    	let div;
    	let span0;
    	let t1;
    	let span1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			span0 = element("span");
    			span0.textContent = "Cost:";
    			t1 = space();
    			span1 = element("span");
    			span1.textContent = `${/*cost*/ ctx[7] || "Free"}`;
    			attr_dev(span0, "class", "cost-label svelte-na3pjd");
    			add_location(span0, file$2, 52, 8, 1767);
    			attr_dev(span1, "class", "cost-value svelte-na3pjd");
    			add_location(span1, file$2, 53, 8, 1814);
    			attr_dev(div, "class", "activity-cost svelte-na3pjd");
    			add_location(div, file$2, 51, 6, 1731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, span0);
    			append_dev(div, t1);
    			append_dev(div, span1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(51:4) {#if cost !== null}",
    		ctx
    	});

    	return block;
    }

    // (59:4) {#if links.length > 0}
    function create_if_block_1$2(ctx) {
    	let div;
    	let each_value_1 = /*links*/ ctx[8];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$2(get_each_context_1$2(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "activity-links svelte-na3pjd");
    			add_location(div, file$2, 59, 6, 1943);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*links*/ 256) {
    				each_value_1 = /*links*/ ctx[8];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$2(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(59:4) {#if links.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (61:8) {#each links as link}
    function create_each_block_1$2(ctx) {
    	let a;
    	let t_value = /*link*/ ctx[12].text + "";
    	let t;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", /*link*/ ctx[12].url);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-na3pjd");
    			add_location(a, file$2, 61, 10, 2012);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$2.name,
    		type: "each",
    		source: "(61:8) {#each links as link}",
    		ctx
    	});

    	return block;
    }

    // (70:0) {#if quickStops.length > 0}
    function create_if_block$2(ctx) {
    	let div1;
    	let div0;
    	let t1;
    	let ul;
    	let each_value = /*quickStops*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Quick Stops";
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "quick-stops-header svelte-na3pjd");
    			add_location(div0, file$2, 71, 4, 2236);
    			attr_dev(ul, "class", "quick-stops-list svelte-na3pjd");
    			add_location(ul, file$2, 72, 4, 2290);
    			attr_dev(div1, "class", "quick-stops-container svelte-na3pjd");
    			add_location(div1, file$2, 70, 2, 2196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			append_dev(div1, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*quickStops*/ 64) {
    				each_value = /*quickStops*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(70:0) {#if quickStops.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (74:6) {#each quickStops as stop}
    function create_each_block$2(ctx) {
    	let li;
    	let t_value = /*stop*/ ctx[9] + "";
    	let t;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);
    			attr_dev(li, "class", "svelte-na3pjd");
    			add_location(li, file$2, 74, 8, 2361);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(74:6) {#each quickStops as stop}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let span;
    	let t0_value = /*item*/ ctx[0].time + "";
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div0;
    	let t3;
    	let t4_value = /*item*/ ctx[0].title + "";
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let t8;
    	let t9;
    	let if_block6_anchor;
    	let if_block0 = (/*isFeatured*/ ctx[2] || /*isGem*/ ctx[3] || /*isUserSelected*/ ctx[4]) && create_if_block_6$2(ctx);
    	let if_block1 = /*typeEmoji*/ ctx[1] && create_if_block_5$2(ctx);
    	let if_block2 = /*item*/ ctx[0].description && create_if_block_4$2(ctx);
    	let if_block3 = /*details*/ ctx[5].length > 0 && create_if_block_3$2(ctx);
    	let if_block4 = /*cost*/ ctx[7] !== null && create_if_block_2$2(ctx);
    	let if_block5 = /*links*/ ctx[8].length > 0 && create_if_block_1$2(ctx);
    	let if_block6 = /*quickStops*/ ctx[6].length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t2 = space();
    			div0 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block2) if_block2.c();
    			t6 = space();
    			if (if_block3) if_block3.c();
    			t7 = space();
    			if (if_block4) if_block4.c();
    			t8 = space();
    			if (if_block5) if_block5.c();
    			t9 = space();
    			if (if_block6) if_block6.c();
    			if_block6_anchor = empty();
    			attr_dev(span, "class", "activity-time svelte-na3pjd");
    			add_location(span, file$2, 18, 2, 647);
    			attr_dev(div0, "class", "activity-title svelte-na3pjd");
    			add_location(div0, file$2, 30, 4, 1237);
    			attr_dev(div1, "class", "activity-content " + (/*isFeatured*/ ctx[2] ? 'featured' : '') + " " + (/*isGem*/ ctx[3] ? 'gem' : '') + " " + (/*isUserSelected*/ ctx[4] ? 'user-selected' : '') + " svelte-na3pjd");
    			add_location(div1, file$2, 19, 2, 696);
    			attr_dev(div2, "class", "activity-item svelte-na3pjd");
    			add_location(div2, file$2, 17, 0, 617);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t6);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div1, t7);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div1, t8);
    			if (if_block5) if_block5.m(div1, null);
    			insert_dev(target, t9, anchor);
    			if (if_block6) if_block6.m(target, anchor);
    			insert_dev(target, if_block6_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*item*/ 1 && t0_value !== (t0_value = /*item*/ ctx[0].time + "")) set_data_dev(t0, t0_value);
    			if (/*isFeatured*/ ctx[2] || /*isGem*/ ctx[3] || /*isUserSelected*/ ctx[4]) if_block0.p(ctx, dirty);
    			if (/*typeEmoji*/ ctx[1]) if_block1.p(ctx, dirty);
    			if (dirty & /*item*/ 1 && t4_value !== (t4_value = /*item*/ ctx[0].title + "")) set_data_dev(t4, t4_value);

    			if (/*item*/ ctx[0].description) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_4$2(ctx);
    					if_block2.c();
    					if_block2.m(div1, t6);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (/*details*/ ctx[5].length > 0) if_block3.p(ctx, dirty);
    			if (/*cost*/ ctx[7] !== null) if_block4.p(ctx, dirty);
    			if (/*links*/ ctx[8].length > 0) if_block5.p(ctx, dirty);
    			if (/*quickStops*/ ctx[6].length > 0) if_block6.p(ctx, dirty);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (detaching) detach_dev(t9);
    			if (if_block6) if_block6.d(detaching);
    			if (detaching) detach_dev(if_block6_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ActivityItem', slots, []);
    	let { item } = $$props;

    	// Handle backward compatibility by providing defaults
    	const typeEmoji = item.typeEmoji || '';

    	const isFeatured = item.isFeatured || false;
    	const isGem = item.isGem || false;
    	const isUserSelected = item.isUserSelected || false;
    	const details = item.details || [];
    	const quickStops = item.quickStops || [];
    	const cost = item.cost !== undefined ? item.cost : null;

    	// If it's an older format, links might be just a string
    	const links = item.links || (item.link ? [{ text: "More Info", url: item.link }] : []);

    	$$self.$$.on_mount.push(function () {
    		if (item === undefined && !('item' in $$props || $$self.$$.bound[$$self.$$.props['item']])) {
    			console.warn("<ActivityItem> was created without expected prop 'item'");
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ActivityItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		item,
    		typeEmoji,
    		isFeatured,
    		isGem,
    		isUserSelected,
    		details,
    		quickStops,
    		cost,
    		links
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		item,
    		typeEmoji,
    		isFeatured,
    		isGem,
    		isUserSelected,
    		details,
    		quickStops,
    		cost,
    		links
    	];
    }

    class ActivityItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActivityItem",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get item() {
    		throw new Error("<ActivityItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ActivityItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/DayDetail.svelte generated by Svelte v3.59.2 */
    const file$1 = "src/components/DayDetail.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    function get_each_context_3$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    function get_each_context_4$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[12] = list[i];
    	return child_ctx;
    }

    // (27:10) {#each day.driving.segments as segment}
    function create_each_block_4$1(ctx) {
    	let li;
    	let t0_value = /*segment*/ ctx[12].from + "";
    	let t0;
    	let t1;
    	let t2_value = /*segment*/ ctx[12].to + "";
    	let t2;
    	let t3;
    	let t4_value = /*segment*/ ctx[12].distance.km + "";
    	let t4;
    	let t5;
    	let t6_value = /*segment*/ ctx[12].distance.miles + "";
    	let t6;
    	let t7;
    	let t8_value = /*segment*/ ctx[12].time + "";
    	let t8;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t0 = text(t0_value);
    			t1 = text(" to ");
    			t2 = text(t2_value);
    			t3 = text(": ~");
    			t4 = text(t4_value);
    			t5 = text(" km (");
    			t6 = text(t6_value);
    			t7 = text(" miles), ");
    			t8 = text(t8_value);
    			add_location(li, file$1, 27, 12, 898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t0);
    			append_dev(li, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    			append_dev(li, t5);
    			append_dev(li, t6);
    			append_dev(li, t7);
    			append_dev(li, t8);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t0_value !== (t0_value = /*segment*/ ctx[12].from + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*day*/ 1 && t2_value !== (t2_value = /*segment*/ ctx[12].to + "")) set_data_dev(t2, t2_value);
    			if (dirty & /*day*/ 1 && t4_value !== (t4_value = /*segment*/ ctx[12].distance.km + "")) set_data_dev(t4, t4_value);
    			if (dirty & /*day*/ 1 && t6_value !== (t6_value = /*segment*/ ctx[12].distance.miles + "")) set_data_dev(t6, t6_value);
    			if (dirty & /*day*/ 1 && t8_value !== (t8_value = /*segment*/ ctx[12].time + "")) set_data_dev(t8, t8_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4$1.name,
    		type: "each",
    		source: "(27:10) {#each day.driving.segments as segment}",
    		ctx
    	});

    	return block;
    }

    // (41:8) {#each day.schedule as item}
    function create_each_block_3$1(ctx) {
    	let activityitem;
    	let current;

    	activityitem = new ActivityItem({
    			props: { item: /*item*/ ctx[9] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(activityitem.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activityitem, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const activityitem_changes = {};
    			if (dirty & /*day*/ 1) activityitem_changes.item = /*item*/ ctx[9];
    			activityitem.$set(activityitem_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activityitem.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activityitem.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activityitem, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3$1.name,
    		type: "each",
    		source: "(41:8) {#each day.schedule as item}",
    		ctx
    	});

    	return block;
    }

    // (55:12) {:else}
    function create_else_block$1(ctx) {
    	let strong;
    	let t0_value = /*highlight*/ ctx[6].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*highlight*/ ctx[6].description + "";
    	let t3;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(strong, file$1, 55, 14, 1702);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t0_value !== (t0_value = /*highlight*/ ctx[6].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*day*/ 1 && t3_value !== (t3_value = /*highlight*/ ctx[6].description + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(55:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (53:12) {#if typeof highlight === 'string'}
    function create_if_block_7(ctx) {
    	let t_value = /*highlight*/ ctx[6] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t_value !== (t_value = /*highlight*/ ctx[6] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(53:12) {#if typeof highlight === 'string'}",
    		ctx
    	});

    	return block;
    }

    // (51:8) {#each day.highlights as highlight, i}
    function create_each_block_2$1(ctx) {
    	let li;
    	let t;

    	function select_block_type(ctx, dirty) {
    		if (typeof /*highlight*/ ctx[6] === 'string') return create_if_block_7;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			add_location(li, file$1, 51, 10, 1589);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(51:8) {#each day.highlights as highlight, i}",
    		ctx
    	});

    	return block;
    }

    // (74:8) {#if day.accommodation.notes}
    function create_if_block_6$1(ctx) {
    	let br;
    	let t0;
    	let t1_value = /*day*/ ctx[0].accommodation.notes + "";
    	let t1;

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = text("\n          Note: ");
    			t1 = text(t1_value);
    			add_location(br, file$1, 74, 10, 2239);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t1_value !== (t1_value = /*day*/ ctx[0].accommodation.notes + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(74:8) {#if day.accommodation.notes}",
    		ctx
    	});

    	return block;
    }

    // (88:12) {#if alt.isGem}
    function create_if_block_5$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "💎 Hidden Gem";
    			attr_dev(span, "class", "badge gem-badge svelte-1vta30k");
    			add_location(span, file$1, 87, 27, 2619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(88:12) {#if alt.isGem}",
    		ctx
    	});

    	return block;
    }

    // (89:12) {#if alt.isUserSelected}
    function create_if_block_4$1(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "✓ Selected";
    			attr_dev(span, "class", "badge selected-badge svelte-1vta30k");
    			add_location(span, file$1, 88, 36, 2711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(89:12) {#if alt.isUserSelected}",
    		ctx
    	});

    	return block;
    }

    // (90:12) {#if alt.link}
    function create_if_block_3$1(ctx) {
    	let br;
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			a = element("a");
    			t1 = text("More Info");
    			add_location(br, file$1, 90, 14, 2810);
    			attr_dev(a, "href", a_href_value = /*alt*/ ctx[1].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$1, 91, 14, 2829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && a_href_value !== (a_href_value = /*alt*/ ctx[1].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(90:12) {#if alt.link}",
    		ctx
    	});

    	return block;
    }

    // (85:8) {#each day.alternatives as alt}
    function create_each_block_1$1(ctx) {
    	let li;
    	let strong;
    	let t0_value = /*alt*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*alt*/ ctx[1].description + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let if_block0 = /*alt*/ ctx[1].isGem && create_if_block_5$1(ctx);
    	let if_block1 = /*alt*/ ctx[1].isUserSelected && create_if_block_4$1(ctx);
    	let if_block2 = /*alt*/ ctx[1].link && create_if_block_3$1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			t7 = space();
    			add_location(strong, file$1, 86, 12, 2544);
    			add_location(li, file$1, 85, 10, 2527);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    			if (if_block0) if_block0.m(li, null);
    			append_dev(li, t5);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t6);
    			if (if_block2) if_block2.m(li, null);
    			append_dev(li, t7);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t0_value !== (t0_value = /*alt*/ ctx[1].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*day*/ 1 && t3_value !== (t3_value = /*alt*/ ctx[1].description + "")) set_data_dev(t3, t3_value);

    			if (/*alt*/ ctx[1].isGem) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_5$1(ctx);
    					if_block0.c();
    					if_block0.m(li, t5);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*alt*/ ctx[1].isUserSelected) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_4$1(ctx);
    					if_block1.c();
    					if_block1.m(li, t6);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*alt*/ ctx[1].link) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_3$1(ctx);
    					if_block2.c();
    					if_block2.m(li, t7);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(85:8) {#each day.alternatives as alt}",
    		ctx
    	});

    	return block;
    }

    // (106:12) {#if alt.link}
    function create_if_block_2$1(ctx) {
    	let br;
    	let t0;
    	let a;
    	let t1;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			br = element("br");
    			t0 = space();
    			a = element("a");
    			t1 = text("More Info");
    			add_location(br, file$1, 106, 14, 3266);
    			attr_dev(a, "href", a_href_value = /*alt*/ ctx[1].link);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file$1, 107, 14, 3285);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, br, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, a, anchor);
    			append_dev(a, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && a_href_value !== (a_href_value = /*alt*/ ctx[1].link)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(106:12) {#if alt.link}",
    		ctx
    	});

    	return block;
    }

    // (103:8) {#each day.badWeatherAlternatives as alt}
    function create_each_block$1(ctx) {
    	let li;
    	let strong;
    	let t0_value = /*alt*/ ctx[1].title + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*alt*/ ctx[1].description + "";
    	let t3;
    	let t4;
    	let t5;
    	let if_block = /*alt*/ ctx[1].link && create_if_block_2$1(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			add_location(strong, file$1, 104, 12, 3177);
    			add_location(li, file$1, 103, 10, 3160);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, strong);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			append_dev(li, t2);
    			append_dev(li, t3);
    			append_dev(li, t4);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t0_value !== (t0_value = /*alt*/ ctx[1].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*day*/ 1 && t3_value !== (t3_value = /*alt*/ ctx[1].description + "")) set_data_dev(t3, t3_value);

    			if (/*alt*/ ctx[1].link) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					if_block.m(li, t5);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(103:8) {#each day.badWeatherAlternatives as alt}",
    		ctx
    	});

    	return block;
    }

    // (116:4) {#if day.tip}
    function create_if_block_1$1(ctx) {
    	let div;
    	let t_value = /*day*/ ctx[0].tip + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "tip-box");
    			add_location(div, file$1, 116, 6, 3462);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t_value !== (t_value = /*day*/ ctx[0].tip + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(116:4) {#if day.tip}",
    		ctx
    	});

    	return block;
    }

    // (120:4) {#if day.notes}
    function create_if_block$1(ctx) {
    	let div;
    	let t_value = /*day*/ ctx[0].notes + "";
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", "notes-box");
    			add_location(div, file$1, 120, 6, 3540);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*day*/ 1 && t_value !== (t_value = /*day*/ ctx[0].notes + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(120:4) {#if day.notes}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let section;
    	let div14;
    	let div1;
    	let h2;
    	let t0_value = /*day*/ ctx[0].emoji + "";
    	let t0;
    	let t1;
    	let t2_value = /*day*/ ctx[0].dayNumber + "";
    	let t2;
    	let t3;
    	let t4_value = /*day*/ ctx[0].title + "";
    	let t4;
    	let t5;
    	let div0;
    	let t6_value = /*day*/ ctx[0].date + "";
    	let t6;
    	let t7;
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t8;
    	let div2;
    	let t9;
    	let t10_value = /*day*/ ctx[0].quote.text + "";
    	let t10;
    	let t11;
    	let t12_value = /*day*/ ctx[0].quote.author + "";
    	let t12;
    	let t13;
    	let div5;
    	let div3;
    	let t15;
    	let p;
    	let t16_value = /*day*/ ctx[0].summary + "";
    	let t16;
    	let t17;
    	let div4;
    	let strong0;
    	let t19;
    	let t20_value = /*day*/ ctx[0].driving.total.distance.km + "";
    	let t20;
    	let t21;
    	let t22_value = /*day*/ ctx[0].driving.total.distance.miles + "";
    	let t22;
    	let t23;
    	let t24_value = /*day*/ ctx[0].driving.total.time + "";
    	let t24;
    	let t25;
    	let ul0;
    	let t26;
    	let div6;
    	let raw_value = /*day*/ ctx[0].mapUrl + "";
    	let t27;
    	let div8;
    	let h3;
    	let t29;
    	let div7;
    	let t30;
    	let div9;
    	let h40;
    	let t32;
    	let ul1;
    	let t33;
    	let div11;
    	let h41;
    	let t35;
    	let div10;
    	let strong1;
    	let t36_value = /*day*/ ctx[0].accommodation.name + "";
    	let t36;
    	let t37;
    	let br0;
    	let t38;
    	let t39_value = /*day*/ ctx[0].accommodation.address + "";
    	let t39;
    	let t40;
    	let br1;
    	let t41;
    	let t42_value = /*day*/ ctx[0].accommodation.cost + "";
    	let t42;
    	let t43;
    	let br2;
    	let t44;
    	let t45_value = /*day*/ ctx[0].accommodation.roomType + "";
    	let t45;
    	let t46;
    	let t47;
    	let div12;
    	let h42;
    	let t49;
    	let ul2;
    	let t50;
    	let div13;
    	let h43;
    	let t52;
    	let ul3;
    	let t53;
    	let t54;
    	let section_id_value;
    	let current;
    	let each_value_4 = /*day*/ ctx[0].driving.segments;
    	validate_each_argument(each_value_4);
    	let each_blocks_4 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_4[i] = create_each_block_4$1(get_each_context_4$1(ctx, each_value_4, i));
    	}

    	let each_value_3 = /*day*/ ctx[0].schedule;
    	validate_each_argument(each_value_3);
    	let each_blocks_3 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_3[i] = create_each_block_3$1(get_each_context_3$1(ctx, each_value_3, i));
    	}

    	const out = i => transition_out(each_blocks_3[i], 1, 1, () => {
    		each_blocks_3[i] = null;
    	});

    	let each_value_2 = /*day*/ ctx[0].highlights;
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2$1(get_each_context_2$1(ctx, each_value_2, i));
    	}

    	let if_block0 = /*day*/ ctx[0].accommodation.notes && create_if_block_6$1(ctx);
    	let each_value_1 = /*day*/ ctx[0].alternatives;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	let each_value = /*day*/ ctx[0].badWeatherAlternatives;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	let if_block1 = /*day*/ ctx[0].tip && create_if_block_1$1(ctx);
    	let if_block2 = /*day*/ ctx[0].notes && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			section = element("section");
    			div14 = element("div");
    			div1 = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = text(" Day ");
    			t2 = text(t2_value);
    			t3 = text(": ");
    			t4 = text(t4_value);
    			t5 = space();
    			div0 = element("div");
    			t6 = text(t6_value);
    			t7 = space();
    			img = element("img");
    			t8 = space();
    			div2 = element("div");
    			t9 = text("\"");
    			t10 = text(t10_value);
    			t11 = text("\" - ");
    			t12 = text(t12_value);
    			t13 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Day Summary";
    			t15 = space();
    			p = element("p");
    			t16 = text(t16_value);
    			t17 = space();
    			div4 = element("div");
    			strong0 = element("strong");
    			strong0.textContent = "Total Driving:";
    			t19 = text(" ~");
    			t20 = text(t20_value);
    			t21 = text(" km (");
    			t22 = text(t22_value);
    			t23 = text(" miles), ");
    			t24 = text(t24_value);
    			t25 = space();
    			ul0 = element("ul");

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				each_blocks_4[i].c();
    			}

    			t26 = space();
    			div6 = element("div");
    			t27 = space();
    			div8 = element("div");
    			h3 = element("h3");
    			h3.textContent = "Daily Schedule";
    			t29 = space();
    			div7 = element("div");

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				each_blocks_3[i].c();
    			}

    			t30 = space();
    			div9 = element("div");
    			h40 = element("h4");
    			h40.textContent = "Key Highlights of the Day";
    			t32 = space();
    			ul1 = element("ul");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t33 = space();
    			div11 = element("div");
    			h41 = element("h4");
    			h41.textContent = "Accommodations";
    			t35 = space();
    			div10 = element("div");
    			strong1 = element("strong");
    			t36 = text(t36_value);
    			t37 = space();
    			br0 = element("br");
    			t38 = space();
    			t39 = text(t39_value);
    			t40 = space();
    			br1 = element("br");
    			t41 = text("\n        Cost: ");
    			t42 = text(t42_value);
    			t43 = space();
    			br2 = element("br");
    			t44 = space();
    			t45 = text(t45_value);
    			t46 = space();
    			if (if_block0) if_block0.c();
    			t47 = space();
    			div12 = element("div");
    			h42 = element("h4");
    			h42.textContent = "Alternative Activities";
    			t49 = space();
    			ul2 = element("ul");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t50 = space();
    			div13 = element("div");
    			h43 = element("h4");
    			h43.textContent = "Bad Weather Alternatives";
    			t52 = space();
    			ul3 = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t53 = space();
    			if (if_block1) if_block1.c();
    			t54 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(h2, "class", "day-title");
    			add_location(h2, file$1, 9, 6, 234);
    			attr_dev(div0, "class", "day-date");
    			add_location(div0, file$1, 10, 6, 312);
    			attr_dev(div1, "class", "day-header");
    			add_location(div1, file$1, 8, 4, 203);
    			if (!src_url_equal(img.src, img_src_value = /*day*/ ctx[0].image.src)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = /*day*/ ctx[0].image.alt);
    			attr_dev(img, "class", "day-image");
    			add_location(img, file$1, 13, 4, 371);
    			attr_dev(div2, "class", "quote-box");
    			add_location(div2, file$1, 15, 4, 444);
    			attr_dev(div3, "class", "summary-title");
    			add_location(div3, file$1, 20, 6, 568);
    			add_location(p, file$1, 21, 6, 619);
    			add_location(strong0, file$1, 24, 8, 686);
    			add_location(ul0, file$1, 25, 8, 831);
    			attr_dev(div4, "class", "drive-info");
    			add_location(div4, file$1, 23, 6, 653);
    			attr_dev(div5, "class", "daily-summary");
    			add_location(div5, file$1, 19, 4, 534);
    			attr_dev(div6, "class", "map-container");
    			add_location(div6, file$1, 33, 4, 1079);
    			attr_dev(h3, "class", "section-heading svelte-1vta30k");
    			add_location(h3, file$1, 38, 6, 1185);
    			attr_dev(div7, "class", "activity-timeline svelte-1vta30k");
    			add_location(div7, file$1, 39, 6, 1239);
    			attr_dev(div8, "class", "day-schedule");
    			add_location(div8, file$1, 37, 4, 1152);
    			add_location(h40, file$1, 48, 6, 1462);
    			attr_dev(ul1, "class", "highlights-list");
    			add_location(ul1, file$1, 49, 6, 1503);
    			attr_dev(div9, "class", "highlights-section");
    			add_location(div9, file$1, 47, 4, 1423);
    			add_location(h41, file$1, 64, 6, 1923);
    			add_location(strong1, file$1, 66, 8, 1998);
    			add_location(br0, file$1, 67, 8, 2048);
    			add_location(br1, file$1, 69, 8, 2097);
    			add_location(br2, file$1, 71, 8, 2149);
    			attr_dev(div10, "class", "accommodations-details");
    			add_location(div10, file$1, 65, 6, 1953);
    			attr_dev(div11, "class", "accommodations-section");
    			add_location(div11, file$1, 63, 4, 1880);
    			add_location(h42, file$1, 82, 6, 2408);
    			attr_dev(ul2, "class", "alternatives-list");
    			add_location(ul2, file$1, 83, 6, 2446);
    			attr_dev(div12, "class", "alternatives-section");
    			add_location(div12, file$1, 81, 4, 2367);
    			add_location(h43, file$1, 100, 6, 3034);
    			attr_dev(ul3, "class", "weather-list");
    			add_location(ul3, file$1, 101, 6, 3074);
    			attr_dev(div13, "class", "weather-section");
    			add_location(div13, file$1, 99, 4, 2998);
    			attr_dev(div14, "class", "container");
    			add_location(div14, file$1, 7, 2, 175);
    			attr_dev(section, "id", section_id_value = /*day*/ ctx[0].id);
    			attr_dev(section, "class", "day-section");
    			add_location(section, file$1, 6, 0, 131);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div14);
    			append_dev(div14, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t0);
    			append_dev(h2, t1);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(h2, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(div0, t6);
    			append_dev(div14, t7);
    			append_dev(div14, img);
    			append_dev(div14, t8);
    			append_dev(div14, div2);
    			append_dev(div2, t9);
    			append_dev(div2, t10);
    			append_dev(div2, t11);
    			append_dev(div2, t12);
    			append_dev(div14, t13);
    			append_dev(div14, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t15);
    			append_dev(div5, p);
    			append_dev(p, t16);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, strong0);
    			append_dev(div4, t19);
    			append_dev(div4, t20);
    			append_dev(div4, t21);
    			append_dev(div4, t22);
    			append_dev(div4, t23);
    			append_dev(div4, t24);
    			append_dev(div4, t25);
    			append_dev(div4, ul0);

    			for (let i = 0; i < each_blocks_4.length; i += 1) {
    				if (each_blocks_4[i]) {
    					each_blocks_4[i].m(ul0, null);
    				}
    			}

    			append_dev(div14, t26);
    			append_dev(div14, div6);
    			div6.innerHTML = raw_value;
    			append_dev(div14, t27);
    			append_dev(div14, div8);
    			append_dev(div8, h3);
    			append_dev(div8, t29);
    			append_dev(div8, div7);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				if (each_blocks_3[i]) {
    					each_blocks_3[i].m(div7, null);
    				}
    			}

    			append_dev(div14, t30);
    			append_dev(div14, div9);
    			append_dev(div9, h40);
    			append_dev(div9, t32);
    			append_dev(div9, ul1);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(ul1, null);
    				}
    			}

    			append_dev(div14, t33);
    			append_dev(div14, div11);
    			append_dev(div11, h41);
    			append_dev(div11, t35);
    			append_dev(div11, div10);
    			append_dev(div10, strong1);
    			append_dev(strong1, t36);
    			append_dev(div10, t37);
    			append_dev(div10, br0);
    			append_dev(div10, t38);
    			append_dev(div10, t39);
    			append_dev(div10, t40);
    			append_dev(div10, br1);
    			append_dev(div10, t41);
    			append_dev(div10, t42);
    			append_dev(div10, t43);
    			append_dev(div10, br2);
    			append_dev(div10, t44);
    			append_dev(div10, t45);
    			append_dev(div10, t46);
    			if (if_block0) if_block0.m(div10, null);
    			append_dev(div14, t47);
    			append_dev(div14, div12);
    			append_dev(div12, h42);
    			append_dev(div12, t49);
    			append_dev(div12, ul2);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(ul2, null);
    				}
    			}

    			append_dev(div14, t50);
    			append_dev(div14, div13);
    			append_dev(div13, h43);
    			append_dev(div13, t52);
    			append_dev(div13, ul3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul3, null);
    				}
    			}

    			append_dev(div14, t53);
    			if (if_block1) if_block1.m(div14, null);
    			append_dev(div14, t54);
    			if (if_block2) if_block2.m(div14, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*day*/ 1) && t0_value !== (t0_value = /*day*/ ctx[0].emoji + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*day*/ 1) && t2_value !== (t2_value = /*day*/ ctx[0].dayNumber + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*day*/ 1) && t4_value !== (t4_value = /*day*/ ctx[0].title + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty & /*day*/ 1) && t6_value !== (t6_value = /*day*/ ctx[0].date + "")) set_data_dev(t6, t6_value);

    			if (!current || dirty & /*day*/ 1 && !src_url_equal(img.src, img_src_value = /*day*/ ctx[0].image.src)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*day*/ 1 && img_alt_value !== (img_alt_value = /*day*/ ctx[0].image.alt)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			if ((!current || dirty & /*day*/ 1) && t10_value !== (t10_value = /*day*/ ctx[0].quote.text + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*day*/ 1) && t12_value !== (t12_value = /*day*/ ctx[0].quote.author + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*day*/ 1) && t16_value !== (t16_value = /*day*/ ctx[0].summary + "")) set_data_dev(t16, t16_value);
    			if ((!current || dirty & /*day*/ 1) && t20_value !== (t20_value = /*day*/ ctx[0].driving.total.distance.km + "")) set_data_dev(t20, t20_value);
    			if ((!current || dirty & /*day*/ 1) && t22_value !== (t22_value = /*day*/ ctx[0].driving.total.distance.miles + "")) set_data_dev(t22, t22_value);
    			if ((!current || dirty & /*day*/ 1) && t24_value !== (t24_value = /*day*/ ctx[0].driving.total.time + "")) set_data_dev(t24, t24_value);

    			if (dirty & /*day*/ 1) {
    				each_value_4 = /*day*/ ctx[0].driving.segments;
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4$1(ctx, each_value_4, i);

    					if (each_blocks_4[i]) {
    						each_blocks_4[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_4[i] = create_each_block_4$1(child_ctx);
    						each_blocks_4[i].c();
    						each_blocks_4[i].m(ul0, null);
    					}
    				}

    				for (; i < each_blocks_4.length; i += 1) {
    					each_blocks_4[i].d(1);
    				}

    				each_blocks_4.length = each_value_4.length;
    			}

    			if ((!current || dirty & /*day*/ 1) && raw_value !== (raw_value = /*day*/ ctx[0].mapUrl + "")) div6.innerHTML = raw_value;
    			if (dirty & /*day*/ 1) {
    				each_value_3 = /*day*/ ctx[0].schedule;
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3$1(ctx, each_value_3, i);

    					if (each_blocks_3[i]) {
    						each_blocks_3[i].p(child_ctx, dirty);
    						transition_in(each_blocks_3[i], 1);
    					} else {
    						each_blocks_3[i] = create_each_block_3$1(child_ctx);
    						each_blocks_3[i].c();
    						transition_in(each_blocks_3[i], 1);
    						each_blocks_3[i].m(div7, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_3.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*day*/ 1) {
    				each_value_2 = /*day*/ ctx[0].highlights;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2$1(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2$1(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(ul1, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if ((!current || dirty & /*day*/ 1) && t36_value !== (t36_value = /*day*/ ctx[0].accommodation.name + "")) set_data_dev(t36, t36_value);
    			if ((!current || dirty & /*day*/ 1) && t39_value !== (t39_value = /*day*/ ctx[0].accommodation.address + "")) set_data_dev(t39, t39_value);
    			if ((!current || dirty & /*day*/ 1) && t42_value !== (t42_value = /*day*/ ctx[0].accommodation.cost + "")) set_data_dev(t42, t42_value);
    			if ((!current || dirty & /*day*/ 1) && t45_value !== (t45_value = /*day*/ ctx[0].accommodation.roomType + "")) set_data_dev(t45, t45_value);

    			if (/*day*/ ctx[0].accommodation.notes) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_6$1(ctx);
    					if_block0.c();
    					if_block0.m(div10, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*day*/ 1) {
    				each_value_1 = /*day*/ ctx[0].alternatives;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1$1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(ul2, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*day*/ 1) {
    				each_value = /*day*/ ctx[0].badWeatherAlternatives;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul3, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (/*day*/ ctx[0].tip) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_1$1(ctx);
    					if_block1.c();
    					if_block1.m(div14, t54);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*day*/ ctx[0].notes) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block$1(ctx);
    					if_block2.c();
    					if_block2.m(div14, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (!current || dirty & /*day*/ 1 && section_id_value !== (section_id_value = /*day*/ ctx[0].id)) {
    				attr_dev(section, "id", section_id_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_3[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_3 = each_blocks_3.filter(Boolean);

    			for (let i = 0; i < each_blocks_3.length; i += 1) {
    				transition_out(each_blocks_3[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks_4, detaching);
    			destroy_each(each_blocks_3, detaching);
    			destroy_each(each_blocks_2, detaching);
    			if (if_block0) if_block0.d();
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('DayDetail', slots, []);
    	let { day } = $$props;

    	$$self.$$.on_mount.push(function () {
    		if (day === undefined && !('day' in $$props || $$self.$$.bound[$$self.$$.props['day']])) {
    			console.warn("<DayDetail> was created without expected prop 'day'");
    		}
    	});

    	const writable_props = ['day'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<DayDetail> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    	};

    	$$self.$capture_state = () => ({ ActivityItem, day });

    	$$self.$inject_state = $$props => {
    		if ('day' in $$props) $$invalidate(0, day = $$props.day);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [day];
    }

    class DayDetail extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { day: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DayDetail",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get day() {
    		throw new Error("<DayDetail>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set day(value) {
    		throw new Error("<DayDetail>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.59.2 */

    const { Error: Error_1, console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	return child_ctx;
    }

    // (87:2) {:else}
    function create_else_block(ctx) {
    	let header;
    	let div1;
    	let h1;
    	let t0_value = /*tripData*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let div0;
    	let t2_value = /*tripData*/ ctx[0].dateRange + "";
    	let t2;
    	let t3;
    	let section0;
    	let div5;
    	let h20;
    	let t5;
    	let div3;
    	let div2;
    	let t7;
    	let ul;
    	let li0;
    	let strong0;
    	let t9;
    	let t10_value = /*tripData*/ ctx[0].duration + "";
    	let t10;
    	let t11;
    	let t12_value = /*tripData*/ ctx[0].dateRange + "";
    	let t12;
    	let t13;
    	let t14;
    	let li1;
    	let strong1;
    	let t16;
    	let t17_value = /*tripData*/ ctx[0].travelers + "";
    	let t17;
    	let t18;
    	let li2;
    	let strong2;
    	let t20;
    	let t21_value = /*tripData*/ ctx[0].vehicle + "";
    	let t21;
    	let t22;
    	let li3;
    	let strong3;
    	let t24;
    	let t25_value = /*tripData*/ ctx[0].route + "";
    	let t25;
    	let t26;
    	let li4;
    	let strong4;
    	let t28;
    	let t29_value = /*tripData*/ ctx[0].totalDistance.km + "";
    	let t29;
    	let t30;
    	let t31_value = /*tripData*/ ctx[0].totalDistance.miles + "";
    	let t31;
    	let t32;
    	let t33;
    	let div4;
    	let t34;
    	let section1;
    	let div7;
    	let h21;
    	let t36;
    	let div6;
    	let iframe;
    	let iframe_src_value;
    	let t37;
    	let t38;
    	let section2;
    	let div9;
    	let h22;
    	let t40;
    	let div8;
    	let t41;
    	let footer;
    	let div10;
    	let p0;
    	let t42_value = /*tripData*/ ctx[0].title + "";
    	let t42;
    	let t43;
    	let t44_value = /*tripData*/ ctx[0].dateRange + "";
    	let t44;
    	let t45;
    	let p1;
    	let current;
    	let each_value_4 = /*daysData*/ ctx[1];
    	validate_each_argument(each_value_4);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		each_blocks_2[i] = create_each_block_4(get_each_context_4(ctx, each_value_4, i));
    	}

    	const out = i => transition_out(each_blocks_2[i], 1, 1, () => {
    		each_blocks_2[i] = null;
    	});

    	let each_value_3 = /*daysData*/ ctx[1];
    	validate_each_argument(each_value_3);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		each_blocks_1[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
    	}

    	const out_1 = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*tripData*/ ctx[0].resources;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			section0 = element("section");
    			div5 = element("div");
    			h20 = element("h2");
    			h20.textContent = "Trip Overview";
    			t5 = space();
    			div3 = element("div");
    			div2 = element("div");
    			div2.textContent = "Adventure Details";
    			t7 = space();
    			ul = element("ul");
    			li0 = element("li");
    			strong0 = element("strong");
    			strong0.textContent = "Duration:";
    			t9 = space();
    			t10 = text(t10_value);
    			t11 = text(" (");
    			t12 = text(t12_value);
    			t13 = text(")");
    			t14 = space();
    			li1 = element("li");
    			strong1 = element("strong");
    			strong1.textContent = "Travelers:";
    			t16 = space();
    			t17 = text(t17_value);
    			t18 = space();
    			li2 = element("li");
    			strong2 = element("strong");
    			strong2.textContent = "Vehicle:";
    			t20 = space();
    			t21 = text(t21_value);
    			t22 = space();
    			li3 = element("li");
    			strong3 = element("strong");
    			strong3.textContent = "Route:";
    			t24 = space();
    			t25 = text(t25_value);
    			t26 = space();
    			li4 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "Total Distance:";
    			t28 = space();
    			t29 = text(t29_value);
    			t30 = text(" km (");
    			t31 = text(t31_value);
    			t32 = text(" miles)");
    			t33 = space();
    			div4 = element("div");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t34 = space();
    			section1 = element("section");
    			div7 = element("div");
    			h21 = element("h2");
    			h21.textContent = "Trip Overview Map";
    			t36 = space();
    			div6 = element("div");
    			iframe = element("iframe");
    			t37 = space();

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t38 = space();
    			section2 = element("section");
    			div9 = element("div");
    			h22 = element("h2");
    			h22.textContent = "Essential Resources";
    			t40 = space();
    			div8 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t41 = space();
    			footer = element("footer");
    			div10 = element("div");
    			p0 = element("p");
    			t42 = text(t42_value);
    			t43 = text(" | ");
    			t44 = text(t44_value);
    			t45 = space();
    			p1 = element("p");
    			p1.textContent = "Safe travels and unforgettable adventures!";
    			add_location(h1, file, 90, 8, 2948);
    			attr_dev(div0, "class", "subtitle");
    			add_location(div0, file, 91, 8, 2982);
    			attr_dev(div1, "class", "container");
    			add_location(div1, file, 89, 6, 2916);
    			add_location(header, file, 88, 4, 2901);
    			attr_dev(h20, "class", "section-title");
    			add_location(h20, file, 98, 8, 3167);
    			attr_dev(div2, "class", "summary-title");
    			add_location(div2, file, 101, 10, 3267);
    			add_location(strong0, file, 103, 16, 3368);
    			add_location(li0, file, 103, 12, 3364);
    			add_location(strong1, file, 104, 16, 3459);
    			add_location(li1, file, 104, 12, 3455);
    			add_location(strong2, file, 105, 16, 3529);
    			add_location(li2, file, 105, 12, 3525);
    			add_location(strong3, file, 106, 16, 3595);
    			add_location(li3, file, 106, 12, 3591);
    			add_location(strong4, file, 107, 16, 3657);
    			add_location(li4, file, 107, 12, 3653);
    			attr_dev(ul, "class", "drive-info");
    			add_location(ul, file, 102, 10, 3328);
    			attr_dev(div3, "class", "daily-summary");
    			add_location(div3, file, 100, 8, 3229);
    			attr_dev(div4, "class", "itinerary-grid");
    			add_location(div4, file, 112, 8, 3855);
    			attr_dev(div5, "class", "container");
    			add_location(div5, file, 97, 6, 3135);
    			attr_dev(section0, "class", "overview-section");
    			add_location(section0, file, 96, 4, 3094);
    			attr_dev(h21, "class", "section-title");
    			add_location(h21, file, 127, 8, 4238);
    			if (!src_url_equal(iframe.src, iframe_src_value = /*tripData*/ ctx[0].mapUrl)) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "width", "100%");
    			attr_dev(iframe, "height", "450");
    			set_style(iframe, "border", "0");
    			set_style(iframe, "border-radius", "10px");
    			iframe.allowFullscreen = "";
    			attr_dev(iframe, "loading", "lazy");
    			add_location(iframe, file, 129, 10, 4333);
    			attr_dev(div6, "class", "map-container");
    			add_location(div6, file, 128, 8, 4295);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file, 126, 6, 4206);
    			attr_dev(section1, "class", "map-section");
    			add_location(section1, file, 125, 4, 4170);
    			attr_dev(h22, "class", "section-title");
    			add_location(h22, file, 143, 8, 4746);
    			attr_dev(div8, "class", "resources-grid");
    			add_location(div8, file, 145, 8, 4814);
    			attr_dev(div9, "class", "container");
    			add_location(div9, file, 142, 6, 4714);
    			attr_dev(section2, "class", "resources-section");
    			add_location(section2, file, 141, 4, 4672);
    			add_location(p0, file, 186, 8, 6264);
    			add_location(p1, file, 187, 8, 6319);
    			attr_dev(div10, "class", "container");
    			add_location(div10, file, 185, 6, 6232);
    			add_location(footer, file, 184, 4, 6217);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, t2);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, section0, anchor);
    			append_dev(section0, div5);
    			append_dev(div5, h20);
    			append_dev(div5, t5);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div3, t7);
    			append_dev(div3, ul);
    			append_dev(ul, li0);
    			append_dev(li0, strong0);
    			append_dev(li0, t9);
    			append_dev(li0, t10);
    			append_dev(li0, t11);
    			append_dev(li0, t12);
    			append_dev(li0, t13);
    			append_dev(ul, t14);
    			append_dev(ul, li1);
    			append_dev(li1, strong1);
    			append_dev(li1, t16);
    			append_dev(li1, t17);
    			append_dev(ul, t18);
    			append_dev(ul, li2);
    			append_dev(li2, strong2);
    			append_dev(li2, t20);
    			append_dev(li2, t21);
    			append_dev(ul, t22);
    			append_dev(ul, li3);
    			append_dev(li3, strong3);
    			append_dev(li3, t24);
    			append_dev(li3, t25);
    			append_dev(ul, t26);
    			append_dev(ul, li4);
    			append_dev(li4, strong4);
    			append_dev(li4, t28);
    			append_dev(li4, t29);
    			append_dev(li4, t30);
    			append_dev(li4, t31);
    			append_dev(li4, t32);
    			append_dev(div5, t33);
    			append_dev(div5, div4);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				if (each_blocks_2[i]) {
    					each_blocks_2[i].m(div4, null);
    				}
    			}

    			insert_dev(target, t34, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, div7);
    			append_dev(div7, h21);
    			append_dev(div7, t36);
    			append_dev(div7, div6);
    			append_dev(div6, iframe);
    			insert_dev(target, t37, anchor);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				if (each_blocks_1[i]) {
    					each_blocks_1[i].m(target, anchor);
    				}
    			}

    			insert_dev(target, t38, anchor);
    			insert_dev(target, section2, anchor);
    			append_dev(section2, div9);
    			append_dev(div9, h22);
    			append_dev(div9, t40);
    			append_dev(div9, div8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(div8, null);
    				}
    			}

    			insert_dev(target, t41, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div10);
    			append_dev(div10, p0);
    			append_dev(p0, t42);
    			append_dev(p0, t43);
    			append_dev(p0, t44);
    			append_dev(div10, t45);
    			append_dev(div10, p1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*tripData*/ 1) && t0_value !== (t0_value = /*tripData*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*tripData*/ 1) && t2_value !== (t2_value = /*tripData*/ ctx[0].dateRange + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*tripData*/ 1) && t10_value !== (t10_value = /*tripData*/ ctx[0].duration + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*tripData*/ 1) && t12_value !== (t12_value = /*tripData*/ ctx[0].dateRange + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*tripData*/ 1) && t17_value !== (t17_value = /*tripData*/ ctx[0].travelers + "")) set_data_dev(t17, t17_value);
    			if ((!current || dirty & /*tripData*/ 1) && t21_value !== (t21_value = /*tripData*/ ctx[0].vehicle + "")) set_data_dev(t21, t21_value);
    			if ((!current || dirty & /*tripData*/ 1) && t25_value !== (t25_value = /*tripData*/ ctx[0].route + "")) set_data_dev(t25, t25_value);
    			if ((!current || dirty & /*tripData*/ 1) && t29_value !== (t29_value = /*tripData*/ ctx[0].totalDistance.km + "")) set_data_dev(t29, t29_value);
    			if ((!current || dirty & /*tripData*/ 1) && t31_value !== (t31_value = /*tripData*/ ctx[0].totalDistance.miles + "")) set_data_dev(t31, t31_value);

    			if (dirty & /*daysData, currentDay, scrollToDay*/ 38) {
    				each_value_4 = /*daysData*/ ctx[1];
    				validate_each_argument(each_value_4);
    				let i;

    				for (i = 0; i < each_value_4.length; i += 1) {
    					const child_ctx = get_each_context_4(ctx, each_value_4, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    						transition_in(each_blocks_2[i], 1);
    					} else {
    						each_blocks_2[i] = create_each_block_4(child_ctx);
    						each_blocks_2[i].c();
    						transition_in(each_blocks_2[i], 1);
    						each_blocks_2[i].m(div4, null);
    					}
    				}

    				group_outros();

    				for (i = each_value_4.length; i < each_blocks_2.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*tripData*/ 1 && !src_url_equal(iframe.src, iframe_src_value = /*tripData*/ ctx[0].mapUrl)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (dirty & /*daysData*/ 2) {
    				each_value_3 = /*daysData*/ ctx[1];
    				validate_each_argument(each_value_3);
    				let i;

    				for (i = 0; i < each_value_3.length; i += 1) {
    					const child_ctx = get_each_context_3(ctx, each_value_3, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_3(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t38.parentNode, t38);
    					}
    				}

    				group_outros();

    				for (i = each_value_3.length; i < each_blocks_1.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*tripData*/ 1) {
    				each_value = /*tripData*/ ctx[0].resources;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div8, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if ((!current || dirty & /*tripData*/ 1) && t42_value !== (t42_value = /*tripData*/ ctx[0].title + "")) set_data_dev(t42, t42_value);
    			if ((!current || dirty & /*tripData*/ 1) && t44_value !== (t44_value = /*tripData*/ ctx[0].dateRange + "")) set_data_dev(t44, t44_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_4.length; i += 1) {
    				transition_in(each_blocks_2[i]);
    			}

    			for (let i = 0; i < each_value_3.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_2 = each_blocks_2.filter(Boolean);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				transition_out(each_blocks_2[i]);
    			}

    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(section0);
    			destroy_each(each_blocks_2, detaching);
    			if (detaching) detach_dev(t34);
    			if (detaching) detach_dev(section1);
    			if (detaching) detach_dev(t37);
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t38);
    			if (detaching) detach_dev(section2);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t41);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(87:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (81:22) 
    function create_if_block_1(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let p1;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Error Loading Data";
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*loadError*/ ctx[4]);
    			t3 = space();
    			p1 = element("p");
    			p1.textContent = "Please check that all data files are available and refresh the page.";
    			add_location(h2, file, 82, 6, 2721);
    			add_location(p0, file, 83, 6, 2755);
    			add_location(p1, file, 84, 6, 2780);
    			attr_dev(div, "class", "error-container svelte-r353nl");
    			add_location(div, file, 81, 4, 2685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*loadError*/ 16) set_data_dev(t2, /*loadError*/ ctx[4]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(81:22) ",
    		ctx
    	});

    	return block;
    }

    // (79:2) {#if isLoading}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "Loading trip data...";
    			attr_dev(div, "class", "loading svelte-r353nl");
    			add_location(div, file, 79, 4, 2610);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(79:2) {#if isLoading}",
    		ctx
    	});

    	return block;
    }

    // (114:10) {#each daysData as day}
    function create_each_block_4(ctx) {
    	let daycard;
    	let current;

    	function func() {
    		return /*func*/ ctx[6](/*day*/ ctx[16]);
    	}

    	daycard = new DayCard({
    			props: {
    				day: /*day*/ ctx[16],
    				isActive: /*currentDay*/ ctx[2] === /*day*/ ctx[16].id,
    				onClick: func
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(daycard.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(daycard, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const daycard_changes = {};
    			if (dirty & /*daysData*/ 2) daycard_changes.day = /*day*/ ctx[16];
    			if (dirty & /*currentDay, daysData*/ 6) daycard_changes.isActive = /*currentDay*/ ctx[2] === /*day*/ ctx[16].id;
    			if (dirty & /*daysData*/ 2) daycard_changes.onClick = func;
    			daycard.$set(daycard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daycard.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daycard.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daycard, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(114:10) {#each daysData as day}",
    		ctx
    	});

    	return block;
    }

    // (137:4) {#each daysData as day}
    function create_each_block_3(ctx) {
    	let daydetail;
    	let current;

    	daydetail = new DayDetail({
    			props: { day: /*day*/ ctx[16] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(daydetail.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(daydetail, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const daydetail_changes = {};
    			if (dirty & /*daysData*/ 2) daydetail_changes.day = /*day*/ ctx[16];
    			daydetail.$set(daydetail_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(daydetail.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(daydetail.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(daydetail, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(137:4) {#each daysData as day}",
    		ctx
    	});

    	return block;
    }

    // (155:20) {:else}
    function create_else_block_2(ctx) {
    	let strong;
    	let t0_value = /*item*/ ctx[10].name + "";
    	let t0;
    	let t1;
    	let t2;
    	let t3_value = /*item*/ ctx[10].description + "";
    	let t3;

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			t0 = text(t0_value);
    			t1 = text(":");
    			t2 = space();
    			t3 = text(t3_value);
    			add_location(strong, file, 155, 22, 5219);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);
    			append_dev(strong, t0);
    			append_dev(strong, t1);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t0_value !== (t0_value = /*item*/ ctx[10].name + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*tripData*/ 1 && t3_value !== (t3_value = /*item*/ ctx[10].description + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(155:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (153:20) {#if item.url}
    function create_if_block_6(ctx) {
    	let a;
    	let t_value = /*item*/ ctx[10].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*item*/ ctx[10].url);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 153, 22, 5118);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t_value !== (t_value = /*item*/ ctx[10].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*tripData*/ 1 && a_href_value !== (a_href_value = /*item*/ ctx[10].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(153:20) {#if item.url}",
    		ctx
    	});

    	return block;
    }

    // (159:20) {#if item.note}
    function create_if_block_5(ctx) {
    	let span;
    	let t_value = /*item*/ ctx[10].note + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "note");
    			add_location(span, file, 159, 22, 5373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t_value !== (t_value = /*item*/ ctx[10].note + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(159:20) {#if item.note}",
    		ctx
    	});

    	return block;
    }

    // (163:20) {#if item.subitems && item.subitems.length > 0}
    function create_if_block_2(ctx) {
    	let ul;
    	let each_value_2 = /*item*/ ctx[10].subitems;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(ul, file, 163, 22, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1) {
    				each_value_2 = /*item*/ ctx[10].subitems;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(163:20) {#if item.subitems && item.subitems.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (169:28) {:else}
    function create_else_block_1(ctx) {
    	let t_value = /*subitem*/ ctx[13].name + "";
    	let t;
    	let if_block_anchor;
    	let if_block = /*subitem*/ ctx[13].description && create_if_block_4(ctx);

    	const block = {
    		c: function create() {
    			t = text(t_value);
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t_value !== (t_value = /*subitem*/ ctx[13].name + "")) set_data_dev(t, t_value);

    			if (/*subitem*/ ctx[13].description) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(169:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (167:28) {#if subitem.url}
    function create_if_block_3(ctx) {
    	let a;
    	let t_value = /*subitem*/ ctx[13].name + "";
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			a = element("a");
    			t = text(t_value);
    			attr_dev(a, "href", a_href_value = /*subitem*/ ctx[13].url);
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 167, 30, 5717);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t_value !== (t_value = /*subitem*/ ctx[13].name + "")) set_data_dev(t, t_value);

    			if (dirty & /*tripData*/ 1 && a_href_value !== (a_href_value = /*subitem*/ ctx[13].url)) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(167:28) {#if subitem.url}",
    		ctx
    	});

    	return block;
    }

    // (170:44) {#if subitem.description}
    function create_if_block_4(ctx) {
    	let t0;
    	let t1_value = /*subitem*/ ctx[13].description + "";
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(": ");
    			t1 = text(t1_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t1_value !== (t1_value = /*subitem*/ ctx[13].description + "")) set_data_dev(t1, t1_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(170:44) {#if subitem.description}",
    		ctx
    	});

    	return block;
    }

    // (165:24) {#each item.subitems as subitem}
    function create_each_block_2(ctx) {
    	let li;
    	let t;

    	function select_block_type_2(ctx, dirty) {
    		if (/*subitem*/ ctx[13].url) return create_if_block_3;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			add_location(li, file, 165, 26, 5636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block.m(li, null);
    			append_dev(li, t);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(165:24) {#each item.subitems as subitem}",
    		ctx
    	});

    	return block;
    }

    // (151:16) {#each resource.items as item}
    function create_each_block_1(ctx) {
    	let li;
    	let t0;
    	let t1;
    	let t2;

    	function select_block_type_1(ctx, dirty) {
    		if (/*item*/ ctx[10].url) return create_if_block_6;
    		return create_else_block_2;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*item*/ ctx[10].note && create_if_block_5(ctx);
    	let if_block2 = /*item*/ ctx[10].subitems && /*item*/ ctx[10].subitems.length > 0 && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			add_location(li, file, 151, 18, 5056);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_block0.m(li, null);
    			append_dev(li, t0);
    			if (if_block1) if_block1.m(li, null);
    			append_dev(li, t1);
    			if (if_block2) if_block2.m(li, null);
    			append_dev(li, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(li, t0);
    				}
    			}

    			if (/*item*/ ctx[10].note) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_5(ctx);
    					if_block1.c();
    					if_block1.m(li, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*item*/ ctx[10].subitems && /*item*/ ctx[10].subitems.length > 0) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2(ctx);
    					if_block2.c();
    					if_block2.m(li, t2);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(151:16) {#each resource.items as item}",
    		ctx
    	});

    	return block;
    }

    // (147:10) {#each tripData.resources as resource}
    function create_each_block(ctx) {
    	let div;
    	let h3;
    	let t0_value = /*resource*/ ctx[7].title + "";
    	let t0;
    	let t1;
    	let ul;
    	let t2;
    	let each_value_1 = /*resource*/ ctx[7].items;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t2 = space();
    			add_location(h3, file, 148, 14, 4946);
    			add_location(ul, file, 149, 14, 4986);
    			attr_dev(div, "class", "resource-card");
    			add_location(div, file, 147, 12, 4904);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				if (each_blocks[i]) {
    					each_blocks[i].m(ul, null);
    				}
    			}

    			append_dev(div, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*tripData*/ 1 && t0_value !== (t0_value = /*resource*/ ctx[7].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*tripData*/ 1) {
    				each_value_1 = /*resource*/ ctx[7].items;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(147:10) {#each tripData.resources as resource}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block, create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*isLoading*/ ctx[3]) return 0;
    		if (/*loadError*/ ctx[4]) return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "app");
    			add_location(div, file, 77, 0, 2570);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let tripData = {};
    	let daysData = [];
    	let currentDay = null;
    	let isLoading = true;
    	let loadError = null;

    	onMount(async () => {
    		console.log("App component mounted");

    		try {
    			// Load trip overview data
    			console.log("Fetching trip overview data...");

    			const tripResponse = await fetch('data/trip-overview.json');

    			if (!tripResponse.ok) {
    				throw new Error(`Failed to load trip overview data: ${tripResponse.status}`);
    			}

    			$$invalidate(0, tripData = await tripResponse.json());
    			console.log("Trip overview data loaded successfully");

    			// Load all day data files with error handling
    			const dayPromises = [];

    			for (let i = 1; i <= tripData.totalDays; i++) {
    				console.log(`Fetching day ${i} data...`);

    				dayPromises.push(fetch(`data/day${i}.json`).then(async res => {
    					if (!res.ok) {
    						console.warn(`Day ${i} data not found (${res.status}). This day will be skipped.`);
    						return null; // Return null for days that aren't found
    					}

    					try {
    						const dayData = await res.json();
    						console.log(`Day ${i} data loaded successfully`);
    						return dayData;
    					} catch(parseError) {
    						console.error(`Error parsing day ${i} JSON:`, parseError);
    						return null;
    					}
    				}).catch(err => {
    					console.error(`Error loading day ${i} data:`, err);
    					return null; // Return null for errors
    				}));
    			}

    			// Filter out null values (days that weren't found or failed to load)
    			const daysResults = await Promise.all(dayPromises);

    			$$invalidate(1, daysData = daysResults.filter(day => day !== null));
    			console.log(`Successfully loaded ${daysData.length} days of data`);

    			if (daysData.length === 0) {
    				throw new Error('No day data could be loaded');
    			}

    			$$invalidate(3, isLoading = false);
    		} catch(error) {
    			console.error('Error loading data:', error);
    			$$invalidate(4, loadError = error.message || 'Failed to load trip data');
    			$$invalidate(3, isLoading = false);
    		}
    	});

    	function scrollToDay(dayId) {
    		const element = document.getElementById(dayId);

    		if (element) {
    			element.scrollIntoView({ behavior: 'smooth' });
    		}

    		$$invalidate(2, currentDay = dayId);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const func = day => scrollToDay(day.id);

    	$$self.$capture_state = () => ({
    		onMount,
    		DayCard,
    		DayDetail,
    		tripData,
    		daysData,
    		currentDay,
    		isLoading,
    		loadError,
    		scrollToDay
    	});

    	$$self.$inject_state = $$props => {
    		if ('tripData' in $$props) $$invalidate(0, tripData = $$props.tripData);
    		if ('daysData' in $$props) $$invalidate(1, daysData = $$props.daysData);
    		if ('currentDay' in $$props) $$invalidate(2, currentDay = $$props.currentDay);
    		if ('isLoading' in $$props) $$invalidate(3, isLoading = $$props.isLoading);
    		if ('loadError' in $$props) $$invalidate(4, loadError = $$props.loadError);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [tripData, daysData, currentDay, isLoading, loadError, scrollToDay, func];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
