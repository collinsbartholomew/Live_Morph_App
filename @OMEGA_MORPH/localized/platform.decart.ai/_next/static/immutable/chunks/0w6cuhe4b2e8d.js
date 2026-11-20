(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 317607, e => {
	"use strict";
	var t = Object.defineProperty,
		n = (e, n) => t(e, "name", {
			value: n,
			configurable: !0
		}),
		r = !!("u" > typeof window && window.document && window.document.createElement);

	function o(e, t, {
		checkForDefaultPrevented: r = !0
	} = {}) {
		return n(function(n) {
			if (e?.(n), !1 === r || !n || !n.defaultPrevented) return t?.(n)
		}, "handleEvent")
	}

	function i(e) {
		if (!r) throw Error("Cannot access document outside of the DOM");
		return e?.ownerDocument ?? document
	}

	function u(e) {
		return "IFRAME" === e.tagName
	}
	n(o, "composeEventHandlers"), n(function(e) {
		if (!r) throw Error("Cannot access window outside of the DOM");
		return e?.ownerDocument?.defaultView ?? window
	}, "getOwnerWindow"), n(i, "getOwnerDocument"), n(function e(t, n = !1) {
		let {
			activeElement: r
		} = i(t);
		if (!r?.nodeName) return null;
		if (u(r) && r.contentDocument) return e(r.contentDocument.body, n);
		if (n) {
			let e = r.getAttribute("aria-activedescendant");
			if (e) {
				let t = i(r).getElementById(e);
				if (t) return t
			}
		}
		return r
	}, "getActiveElement"), n(u, "isFrame"), e.s(["f", 0, o])
}, 319573, e => {
	"use strict";
	e.s(["f", 0, !1])
}, 653132, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(234984),
		r = Object.defineProperty,
		o = (e, t) => r(e, "name", {
			value: t,
			configurable: !0
		});

	function i(e, r = []) {
		let a = [];

		function c(r, i) {
			let u = t.createContext(i);
			u.displayName = r + "Context";
			let c = a.length;
			a = [...a, i];
			let s = o(r => {
				let {
					scope: o,
					children: i,
					...a
				} = r, s = o?.[e]?.[c] || u, l = t.useMemo(() => a, Object.values(a));
				return (0, n.jsx)(s.Provider, {
					value: l,
					children: i
				})
			}, "Provider");

			function l(n, o, a = {}) {
				let {
					optional: s = !1
				} = a, f = o?.[e]?.[c] || u, d = t.useContext(f);
				if (d) return d;
				if (void 0 !== i) return i;
				if (!s) throw Error(`\`${n}\` must be used within \`${r}\``)
			}
			return s.displayName = r + "Provider", o(l, "useContext"), [s, l]
		}
		o(c, "createContext");
		let s = o(() => {
			let n = a.map(e => t.createContext(e));
			return o(function(r) {
				let o = r?.[e] || n;
				return t.useMemo(() => ({
					[`__scope${e}`]: {
						...r,
						[e]: o
					}
				}), [r, o])
			}, "useScope")
		}, "createScope");
		return s.scopeName = e, [c, u(s, ...r)]
	}

	function u(...e) {
		let n = e[0];
		if (1 === e.length) return n;
		let r = o(() => {
			let r = e.map(e => ({
				useScope: e(),
				scopeName: e.scopeName
			}));
			return o(function(e) {
				let o = r.reduce((t, {
					useScope: n,
					scopeName: r
				}) => {
					let o = n(e)[`__scope${r}`];
					return {
						...t,
						...o
					}
				}, {});
				return t.useMemo(() => ({
					[`__scope${n.scopeName}`]: o
				}), [o])
			}, "useComposedScopes")
		}, "createScope");
		return r.scopeName = n.scopeName, r
	}
	o(function(e, r) {
		let i = t.createContext(r);
		i.displayName = e + "Context";
		let u = o(e => {
			let {
				children: r,
				...o
			} = e, u = t.useMemo(() => o, Object.values(o));
			return (0, n.jsx)(i.Provider, {
				value: u,
				children: r
			})
		}, "Provider");

		function a(n, o = {}) {
			let {
				optional: u = !1
			} = o, c = t.useContext(i);
			if (c) return c;
			if (void 0 !== r) return r;
			if (!u) throw Error(`\`${n}\` must be used within \`${e}\``)
		}
		return u.displayName = e + "Provider", o(a, "useContext"), [u, a]
	}, "createContext"), o(i, "createContextScope"), o(u, "composeContextScopes"), e.s(["f", 0, i])
}, 352087, 167656, e => {
	"use strict";
	var t, n = e.i(170380),
		r = e.i(317607),
		o = e.i(378329),
		i = e.i(954264),
		u = e.i(794371),
		a = Object.defineProperty,
		c = n[" useInsertionEffect ".trim().toString()];

	function s(e) {
		let t = n.useRef(e);
		return "function" == typeof c ? c(() => {
			t.current = e
		}) : (0, u.f)(() => {
			t.current = e
		}), n.useMemo(() => (...e) => t.current?.(...e), [])
	}
	a(s, "name", {
		value: "useCallbackRef",
		configurable: !0
	}), e.s(["f", 0, s], 167656);
	var l = e.i(234984),
		f = Object.defineProperty,
		d = (e, t) => f(e, "name", {
			value: t,
			configurable: !0
		}),
		m = "dismissableLayer.update",
		v = n.createContext({
			layers: new Set,
			layersWithOutsidePointerEventsDisabled: new Set,
			branches: new Set,
			dismissableSurfaces: new Set
		}),
		p = n.forwardRef(d(function(e, u) {
			let {
				disableOutsidePointerEvents: a = !1,
				deferPointerDownOutside: c = !1,
				onEscapeKeyDown: f,
				onPointerDownOutside: p,
				onFocusOutside: h,
				onInteractOutside: y,
				onDismiss: w,
				...S
			} = e, C = n.useContext(v), [O, P] = n.useState(null), N = O?.ownerDocument ?? globalThis?.document, [, R] = n.useState({}), T = (0, i.f)(u, P), M = Array.from(C.layers), [L] = [...C.layersWithOutsidePointerEventsDisabled].slice(-1), k = L ? M.indexOf(L) : -1, A = O ? M.indexOf(O) : -1, x = C.layersWithOutsidePointerEventsDisabled.size > 0, D = A >= k, I = n.useRef(!1), j = b(e => {
				p?.(e), y?.(e), e.defaultPrevented || w?.()
			}, {
				ownerDocument: N,
				deferPointerDownOutside: c,
				isDeferredPointerDownOutsideRef: I,
				dismissableSurfaces: C.dismissableSurfaces,
				shouldHandlePointerDownOutside: n.useCallback(e => {
					if (!(e instanceof Node)) return !1;
					let t = [...C.branches].some(t => t.contains(e));
					return D && !t
				}, [C.branches, D])
			}), F = g(e => {
				if (c && I.current) return;
				let t = e.target;
				![...C.branches].some(e => e.contains(t)) && (h?.(e), y?.(e), e.defaultPrevented || w?.())
			}, N), _ = !!O && A === M.length - 1, W = s(e => {
				"Escape" === e.key && (f?.(e), !e.defaultPrevented && w && (e.preventDefault(), w()))
			});
			return n.useEffect(() => {
				if (_) return N.addEventListener("keydown", W, {
					capture: !0
				}), () => N.removeEventListener("keydown", W, {
					capture: !0
				})
			}, [N, _, W]), n.useEffect(() => {
				if (O) return a && (0 === C.layersWithOutsidePointerEventsDisabled.size && (t = N.body.style.pointerEvents, N.body.style.pointerEvents = "none"), C.layersWithOutsidePointerEventsDisabled.add(O)), C.layers.add(O), E(), () => {
					a && (C.layersWithOutsidePointerEventsDisabled.delete(O), 0 === C.layersWithOutsidePointerEventsDisabled.size && (N.body.style.pointerEvents = t))
				}
			}, [O, N, a, C]), n.useEffect(() => () => {
				O && (C.layers.delete(O), C.layersWithOutsidePointerEventsDisabled.delete(O), E())
			}, [O, C]), n.useEffect(() => {
				let e = d(() => R({}), "handleUpdate");
				return document.addEventListener(m, e), () => document.removeEventListener(m, e)
			}, []), (0, l.jsx)(o.V.div, {
				...S,
				ref: T,
				style: {
					pointerEvents: x ? D ? "auto" : "none" : void 0,
					...e.style
				},
				onFocusCapture: (0, r.f)(e.onFocusCapture, F.onFocusCapture),
				onBlurCapture: (0, r.f)(e.onBlurCapture, F.onBlurCapture),
				onPointerDownCapture: (0, r.f)(e.onPointerDownCapture, j.onPointerDownCapture)
			})
		}, "DismissableLayer"));

	function h() {
		let e = n.useContext(v),
			[t, r] = n.useState(null);
		return n.useEffect(() => {
			if (t) return e.dismissableSurfaces.add(t), () => {
				e.dismissableSurfaces.delete(t)
			}
		}, [t, e.dismissableSurfaces]), r
	}
	d(h, "useDismissableLayerSurface");
	var y = d(() => !0, "IS_TRUE");

	function b(e, t) {
		let {
			ownerDocument: r = globalThis?.document,
			deferPointerDownOutside: o = !1,
			isDeferredPointerDownOutsideRef: i,
			dismissableSurfaces: u,
			shouldHandlePointerDownOutside: a = y
		} = t, c = s(e), l = n.useRef(!1), f = n.useRef(!1), m = n.useRef(new Map), v = n.useRef(() => {});
		return n.useEffect(() => {
			function e() {
				f.current = !1, i.current = !1, m.current.clear()
			}

			function t() {
				return Array.from(m.current.values()).some(Boolean)
			}

			function n(e) {
				if (!f.current) return;
				let t = e.target;
				t instanceof Node && [...u].some(e => e.contains(t)) || m.current.set(e.type, !0), "click" === e.type && window.setTimeout(() => {
					f.current && v.current()
				}, 0)
			}

			function s(e) {
				f.current && m.current.set(e.type, !1)
			}
			d(e, "resetOutsideInteraction"), d(t, "isOutsideInteractionIntercepted"), d(n, "handleInteractionCapture"), d(s, "handleInteractionBubble");
			let p = d(n => {
					if (n.target && !l.current) {
						let u = function() {
							r.removeEventListener("click", v.current);
							let n = t();
							e(), n || w("dismissableLayer.pointerDownOutside", c, s, {
								discrete: !0
							})
						};
						if (d(u, "handleAndDispatchPointerDownOutsideEvent"), !a(n.target)) {
							r.removeEventListener("click", v.current), e(), l.current = !1;
							return
						}
						let s = {
							originalEvent: n
						};
						f.current = !0, i.current = o && 0 === n.button, m.current.clear(), o && 0 === n.button ? (r.removeEventListener("click", v.current), v.current = u, r.addEventListener("click", v.current, {
							once: !0
						})) : u()
					} else r.removeEventListener("click", v.current), e();
					l.current = !1
				}, "handlePointerDown"),
				h = ["pointerup", "mousedown", "mouseup", "touchstart", "touchend", "click"];
			for (let e of h) r.addEventListener(e, n, !0), r.addEventListener(e, s);
			let y = window.setTimeout(() => {
				r.addEventListener("pointerdown", p)
			}, 0);
			return () => {
				for (let e of (window.clearTimeout(y), r.removeEventListener("pointerdown", p), r.removeEventListener("click", v.current), h)) r.removeEventListener(e, n, !0), r.removeEventListener(e, s)
			}
		}, [r, c, o, i, u, a]), {
			onPointerDownCapture: d(() => l.current = !0, "onPointerDownCapture")
		}
	}

	function g(e, t = globalThis?.document) {
		let r = s(e),
			o = n.useRef(!1);
		return n.useEffect(() => {
			let e = d(e => {
				e.target && !o.current && w("dismissableLayer.focusOutside", r, {
					originalEvent: e
				}, {
					discrete: !1
				})
			}, "handleFocus");
			return t.addEventListener("focusin", e), () => t.removeEventListener("focusin", e)
		}, [t, r]), {
			onFocusCapture: d(() => o.current = !0, "onFocusCapture"),
			onBlurCapture: d(() => o.current = !1, "onBlurCapture")
		}
	}

	function E() {
		let e = new CustomEvent(m);
		document.dispatchEvent(e)
	}

	function w(e, t, n, {
		discrete: r
	}) {
		let i = n.originalEvent.target,
			u = new CustomEvent(e, {
				bubbles: !1,
				cancelable: !0,
				detail: n
			});
		t && i.addEventListener(e, t, {
			once: !0
		}), r ? (0, o.u)(i, u) : i.dispatchEvent(u)
	}
	d(b, "usePointerDownOutside"), d(g, "useFocusOutside"), d(E, "dispatchUpdate"), d(w, "handleAndDispatchCustomEvent"), e.s(["V", 0, p, "y", 0, h], 352087)
}, 177343, e => {
	"use strict";
	var t = e.i(170380),
		n = Object.defineProperty,
		r = (e, t) => n(e, "name", {
			value: t,
			configurable: !0
		}),
		o = 0,
		i = null;

	function u() {
		t.useEffect(() => {
			i || (i = {
				start: a(),
				end: a()
			});
			let {
				start: e,
				end: t
			} = i;
			return document.body.firstElementChild !== e && document.body.insertAdjacentElement("afterbegin", e), document.body.lastElementChild !== t && document.body.insertAdjacentElement("beforeend", t), o++, () => {
				1 === o && (i?.start.remove(), i?.end.remove(), i = null), o = Math.max(0, o - 1)
			}
		}, [])
	}

	function a() {
		let e = document.createElement("span");
		return e.setAttribute("data-radix-focus-guard", ""), e.tabIndex = 0, e.style.outline = "none", e.style.opacity = "0", e.style.position = "fixed", e.style.pointerEvents = "none", e
	}
	r(function(e) {
		return u(), e.children
	}, "FocusGuards"), r(u, "useFocusGuards"), r(a, "createFocusGuard"), e.s(["f", 0, u])
}, 865155, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(954264),
		r = e.i(378329),
		o = e.i(167656),
		i = e.i(234984),
		u = Object.defineProperty,
		a = (e, t) => u(e, "name", {
			value: t,
			configurable: !0
		}),
		c = "focusScope.autoFocusOnMount",
		s = "focusScope.autoFocusOnUnmount",
		l = {
			bubbles: !1,
			cancelable: !0
		},
		f = t.forwardRef(a(function(e, u) {
			let {
				loop: f = !1,
				trapped: d = !1,
				branches: m,
				onMountAutoFocus: v,
				onUnmountAutoFocus: p,
				...g
			} = e, [E, w] = t.useState(null), O = (0, o.f)(v), P = (0, o.f)(p), R = t.useRef(null), T = (0, n.f)(u, w), M = t.useRef(m);
			t.useEffect(() => {
				M.current = m
			});
			let L = t.useCallback(e => !!e && (!!E?.contains(e) || !!M.current?.some(t => t.contains(e))), [E]),
				k = t.useRef({
					paused: !1,
					pause() {
						this.paused = !0
					},
					resume() {
						this.paused = !1
					}
				}).current;
			t.useEffect(() => {
				if (d) {
					let e = function(e) {
							if (k.paused || !E) return;
							let t = e.target;
							L(t) ? R.current = t : S(R.current, {
								select: !0
							})
						},
						t = function(e) {
							if (k.paused || !E) return;
							let t = e.relatedTarget;
							null !== t && (L(t) || S(R.current, {
								select: !0
							}))
						},
						n = function(e) {
							if (document.activeElement === document.body)
								for (let t of e) t.removedNodes.length > 0 && S(E)
						};
					a(e, "handleFocusIn"), a(t, "handleFocusOut"), a(n, "handleMutations"), document.addEventListener("focusin", e), document.addEventListener("focusout", t);
					let r = new MutationObserver(n);
					return E && r.observe(E, {
						childList: !0,
						subtree: !0
					}), () => {
						document.removeEventListener("focusin", e), document.removeEventListener("focusout", t), r.disconnect()
					}
				}
			}, [d, E, k.paused, L]), t.useEffect(() => {
				if (E) {
					C.add(k);
					let e = document.activeElement;
					if (!E.contains(e)) {
						let t = new CustomEvent(c, l);
						E.addEventListener(c, O), E.dispatchEvent(t), t.defaultPrevented || (h(N(b(E)), {
							select: !0
						}), document.activeElement === e && S(E))
					}
					return () => {
						E.removeEventListener(c, O);
						let t = E.ownerDocument,
							n = CustomEvent;
						setTimeout(() => {
							let r = new n(s, l);
							E.addEventListener(s, P), E.dispatchEvent(r), r.defaultPrevented || S(e ?? t.body, {
								select: !0
							}), E.removeEventListener(s, P), C.remove(k)
						}, 0)
					}
				}
			}, [E, O, P, k]);
			let A = t.useCallback(e => {
				if (!f && !d || k.paused) return;
				let t = "Tab" === e.key && !e.altKey && !e.ctrlKey && !e.metaKey,
					n = document.activeElement;
				if (t && n) {
					let t = e.currentTarget,
						[r, o] = y(t);
					r && o ? e.shiftKey || n !== o ? e.shiftKey && n === r && (e.preventDefault(), f && S(o, {
						select: !0
					})) : (e.preventDefault(), f && S(r, {
						select: !0
					})) : n === t && e.preventDefault()
				}
			}, [f, d, k.paused]);
			return (0, i.jsx)(r.V.div, {
				tabIndex: -1,
				...g,
				ref: T,
				onKeyDown: A
			})
		}, "FocusScope")),
		d = t.createContext(null);

	function m({
		registry: e,
		children: t
	}) {
		return e ? (0, i.jsx)(d.Provider, {
			value: e,
			children: t
		}) : t
	}

	function v() {
		let [e, n] = t.useState([]);
		return {
			nodes: e,
			registry: t.useMemo(() => ({
				add: a(e => n(t => t.includes(e) ? t : [...t, e]), "add"),
				remove: a(e => n(t => t.filter(t => t !== e)), "remove")
			}), [])
		}
	}

	function p(e) {
		let n = t.useContext(d);
		t.useEffect(() => {
			if (e && n) return n.add(e), () => n.remove(e)
		}, [e, n])
	}

	function h(e, {
		select: t = !1
	} = {}) {
		let n = document.activeElement;
		for (let r of e)
			if (S(r, {
					select: t
				}), document.activeElement !== n) return
	}

	function y(e) {
		let t = b(e);
		return [g(t, e), g(t.reverse(), e)]
	}

	function b(e) {
		let t = [],
			n = e.ownerDocument.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, {
				acceptNode: a(e => {
					let t = "INPUT" === e.tagName && "hidden" === e.type;
					return e.disabled || e.hidden || t ? NodeFilter.FILTER_SKIP : e.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
				}, "acceptNode")
			});
		for (; n.nextNode();) t.push(n.currentNode);
		return t
	}

	function g(e, t) {
		let n = "function" == typeof t.checkVisibility && t.checkVisibility({
			checkVisibilityCSS: !0
		});
		for (let r of e)
			if (!(n ? !r.checkVisibility({
					checkVisibilityCSS: !0
				}) : E(r, {
					upTo: t
				}))) return r
	}

	function E(e, {
		upTo: t
	}) {
		if ("hidden" === getComputedStyle(e).visibility) return !0;
		for (; e && (void 0 === t || e !== t);) {
			if ("none" === getComputedStyle(e).display) return !0;
			e = e.parentElement
		}
		return !1
	}

	function w(e) {
		return "INPUT" === e.tagName && "function" == typeof e.select
	}

	function S(e, {
		select: t = !1
	} = {}) {
		if (e && e.focus) {
			let n = (e.ownerDocument ?? document).activeElement;
			e.focus({
				preventScroll: !0
			}), e !== n && w(e) && t && e.select()
		}
	}
	a(m, "FocusScopeBranchProvider"), a(v, "useFocusScopeBranchRegistry"), a(p, "useFocusScopeBranch"), a(h, "focusFirst"), a(y, "getTabbableEdges"), a(b, "getTabbableCandidates"), a(g, "findVisible"), a(E, "isHidden"), a(w, "isSelectableInput"), a(S, "focus");
	var C = O();

	function O() {
		let e = [];
		return {
			add(t) {
				let n = e[0];
				t !== n && n?.pause(), (e = P(e, t)).unshift(t)
			},
			remove(t) {
				e = P(e, t), e[0]?.resume()
			}
		}
	}

	function P(e, t) {
		let n = [...e],
			r = n.indexOf(t);
		return -1 !== r && n.splice(r, 1), n
	}

	function N(e) {
		return e.filter(e => "A" !== e.tagName)
	}
	a(O, "createFocusScopesStack"), a(P, "arrayRemove"), a(N, "removeLinks"), e.s(["v", 0, f, "l", 0, m, "i", 0, p, "D", 0, v])
}, 48150, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(794371),
		r = Object.defineProperty,
		o = t[" useId ".trim().toString()] || (() => void 0),
		i = 0;

	function u(e) {
		let [r, u] = t.useState(o());
		return (0, n.f)(() => {
			e || u(e => e ?? String(i++))
		}, [e]), e || (r ? `radix-${r}` : "")
	}
	r(u, "name", {
		value: "useId",
		configurable: !0
	}), e.s(["f", 0, u])
}, 812905, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(716455),
		r = e.i(378329),
		o = e.i(794371),
		i = e.i(234984),
		u = Object.defineProperty,
		a = t.forwardRef(u(function(e, u) {
			let {
				container: a,
				...c
			} = e, [s, l] = t.useState(!1);
			(0, o.f)(() => l(!0), []);
			let f = a || s && globalThis?.document?.body;
			return f ? n.createPortal((0, i.jsx)(r.V.div, {
				...c,
				ref: u
			}), f) : null
		}, "name", {
			value: "Portal",
			configurable: !0
		}));
	e.s(["f", 0, a])
}, 661530, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(794371),
		r = Object.defineProperty,
		o = (e, t) => r(e, "name", {
			value: t,
			configurable: !0
		});

	function i(e, n) {
		return t.useReducer((e, t) => n[e][t] ?? e, e)
	}
	o(i, "useStateMachine");
	var u = o(e => {
		let {
			present: n,
			children: r
		} = e, o = a(n), i = "function" == typeof r ? r({
			present: o.isPresent
		}) : t.Children.only(r), u = s(o.ref, f(i));
		return "function" == typeof r || o.isPresent ? t.cloneElement(i, {
			ref: u
		}) : null
	}, "Presence");

	function a(e) {
		let [r, u] = t.useState(), a = t.useRef(null), c = t.useRef(e), s = t.useRef("none"), f = t.useRef(void 0), [d, m] = i(e ? "mounted" : "unmounted", {
			mounted: {
				UNMOUNT: "unmounted",
				ANIMATION_OUT: "unmountSuspended"
			},
			unmountSuspended: {
				MOUNT: "mounted",
				ANIMATION_END: "unmounted"
			},
			unmounted: {
				MOUNT: "mounted"
			}
		});
		return t.useEffect(() => {
			"mounted" === d ? (s.current = f.current ?? l(a.current), f.current = void 0) : s.current = "none"
		}, [d]), (0, n.f)(() => {
			let t = a.current,
				n = c.current;
			if (n !== e) {
				let r = s.current,
					o = l(t);
				e ? (f.current = o, m("MOUNT")) : "none" === o || t?.display === "none" ? m("UNMOUNT") : n && r !== o ? m("ANIMATION_OUT") : m("UNMOUNT"), c.current = e
			}
		}, [e, m]), (0, n.f)(() => {
			if (r) {
				let e, t = r.ownerDocument.defaultView ?? window,
					n = o(n => {
						let o = l(a.current).includes(CSS.escape(n.animationName));
						if (n.target === r && o && (m("ANIMATION_END"), !c.current)) {
							let n = r.style.animationFillMode;
							r.style.animationFillMode = "forwards", e = t.setTimeout(() => {
								"forwards" === r.style.animationFillMode && (r.style.animationFillMode = n)
							})
						}
					}, "handleAnimationEnd"),
					i = o(e => {
						e.target === r && (s.current = l(a.current))
					}, "handleAnimationStart");
				return r.addEventListener("animationstart", i), r.addEventListener("animationcancel", n), r.addEventListener("animationend", n), () => {
					t.clearTimeout(e), r.removeEventListener("animationstart", i), r.removeEventListener("animationcancel", n), r.removeEventListener("animationend", n)
				}
			}
			m("ANIMATION_END")
		}, [r, m]), {
			isPresent: ["mounted", "unmountSuspended"].includes(d),
			ref: t.useCallback(e => {
				if (e) {
					let t = getComputedStyle(e);
					a.current = t, f.current = l(t)
				} else a.current = null;
				u(e)
			}, [])
		}
	}

	function c(e, t) {
		if ("function" == typeof e) return e(t);
		null != e && (e.current = t)
	}

	function s(...e) {
		let n = t.useRef(e);
		return n.current = e, t.useCallback(e => {
			let t = n.current,
				r = !1,
				o = t.map(t => {
					let n = c(t, e);
					return r || "function" != typeof n || (r = !0), n
				});
			if (r) return () => {
				for (let e = 0; e < o.length; e++) {
					let n = o[e];
					"function" == typeof n ? n() : c(t[e], null)
				}
			}
		}, [])
	}

	function l(e) {
		return e?.animationName || "none"
	}

	function f(e) {
		let t = Object.getOwnPropertyDescriptor(e.props, "ref")?.get,
			n = t && "isReactWarning" in t && t.isReactWarning;
		return n ? e.ref : (n = (t = Object.getOwnPropertyDescriptor(e, "ref")?.get) && "isReactWarning" in t && t.isReactWarning) ? e.props.ref : e.props.ref || e.ref
	}
	o(a, "usePresence"), o(c, "setRef"), o(s, "useStableComposedRefs"), o(l, "getAnimationName"), o(f, "getElementRef"), e.s(["f", 0, u])
}, 378329, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(716455),
		r = e.i(427658),
		o = e.i(234984),
		i = Object.defineProperty,
		u = ["a", "button", "div", "form", "h2", "h3", "img", "input", "label", "li", "nav", "ol", "p", "select", "span", "svg", "ul"].reduce((e, n) => {
			let i = (0, r.B)(`Primitive.${n}`),
				u = t.forwardRef((e, t) => {
					let {
						asChild: r,
						...u
					} = e;
					return "u" > typeof window && (window[Symbol.for("radix-ui")] = !0), (0, o.jsx)(r ? i : n, {
						...u,
						ref: t
					})
				});
			return u.displayName = `Primitive.${n}`, {
				...e,
				[n]: u
			}
		}, {});

	function a(e, t) {
		e && n.flushSync(() => e.dispatchEvent(t))
	}
	i(a, "name", {
		value: "dispatchDiscreteCustomEvent",
		configurable: !0
	}), e.s(["V", 0, u, "u", 0, a])
}, 82798, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(319573),
		r = e.i(794371),
		o = Object.defineProperty,
		i = t[" useEffectEvent ".trim().toString()],
		u = t[" useInsertionEffect ".trim().toString()];

	function a(e) {
		if ("function" == typeof i) return i(e);
		let n = t.useRef(() => {
			throw Error("Cannot call an event handler while rendering.")
		});
		return "function" == typeof u ? u(() => {
			n.current = e
		}) : (0, r.f)(() => {
			n.current = e
		}), t.useMemo(() => (...e) => n.current?.(...e), [])
	}
	o(a, "name", {
		value: "useEffectEvent",
		configurable: !0
	});
	var c = Object.defineProperty,
		s = (e, t) => c(e, "name", {
			value: t,
			configurable: !0
		}),
		l = t[" useInsertionEffect ".trim().toString()] || r.f;

	function f({
		prop: e,
		defaultProp: r,
		onChange: o = s(() => {}, "onChange"),
		caller: i
	}) {
		let [u, a, c] = d({
			defaultProp: r,
			onChange: o
		}), l = void 0 !== e, v = l ? e : u;
		if (n.f) {
			let n = t.useRef(void 0 !== e);
			t.useEffect(() => {
				let e = n.current;
				if (e !== l) {
					let t = l ? "controlled" : "uncontrolled";
					console.warn(`${i} is changing from ${e?"controlled":"uncontrolled"} to ${t}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`)
				}
				n.current = l
			}, [l, i])
		}
		return [v, t.useCallback(t => {
			if (l) {
				let n = m(t) ? t(e) : t;
				n !== e && c.current?.(n)
			} else a(t)
		}, [l, e, a, c])]
	}

	function d({
		defaultProp: e,
		onChange: n
	}) {
		let [r, o] = t.useState(e), i = t.useRef(r), u = t.useRef(n);
		return l(() => {
			u.current = n
		}, [n]), t.useEffect(() => {
			i.current !== r && (u.current?.(r), i.current = r)
		}, [r, i]), [r, o, u]
	}

	function m(e) {
		return "function" == typeof e
	}
	s(f, "useControllableState"), s(d, "useUncontrolledState"), s(m, "isFunction");
	var v = Symbol("RADIX:SYNC_STATE");
	s(function(e, r, o, i) {
		let {
			prop: u,
			defaultProp: c,
			onChange: s,
			caller: l
		} = r, f = void 0 !== u, d = a(s);
		if (n.f) {
			let e = t.useRef(void 0 !== u);
			t.useEffect(() => {
				let t = e.current;
				if (t !== f) {
					let e = f ? "controlled" : "uncontrolled";
					console.warn(`${l} is changing from ${t?"controlled":"uncontrolled"} to ${e}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`)
				}
				e.current = f
			}, [f, l])
		}
		let m = [{
			...o,
			state: c
		}];
		i && m.push(i);
		let [p, h] = t.useReducer((t, n) => {
			if (n.type === v) return {
				...t,
				state: n.state
			};
			let r = e(t, n);
			return f && !Object.is(r.state, t.state) && d(r.state), r
		}, ...m), y = p.state, b = t.useRef(y);
		t.useEffect(() => {
			b.current !== y && (b.current = y, f || d(y))
		}, [y, b, f]);
		let g = t.useMemo(() => void 0 !== u ? {
			...p,
			state: u
		} : p, [p, u]);
		return t.useEffect(() => {
			f && !Object.is(u, p.state) && h({
				type: v,
				state: u
			})
		}, [u, p.state, f]), [g, h]
	}, "useControllableStateReducer"), e.s(["f", 0, f], 82798)
}, 794371, e => {
	"use strict";
	var t = e.i(170380),
		n = globalThis?.document ? t.useLayoutEffect : () => {};
	e.s(["f", 0, n])
}, 73772, e => {
	"use strict";
	var t = new WeakMap,
		n = new WeakMap,
		r = {},
		o = 0,
		i = function(e) {
			return e && (e.host || i(e.parentNode))
		},
		u = function(e, u, a, c) {
			var s = (Array.isArray(e) ? e : [e]).map(function(e) {
				if (u.contains(e)) return e;
				var t = i(e);
				return t && u.contains(t) ? t : (console.error("aria-hidden", e, "in not contained inside", u, ". Doing nothing"), null)
			}).filter(function(e) {
				return !!e
			});
			r[a] || (r[a] = new WeakMap);
			var l = r[a],
				f = [],
				d = new Set,
				m = new Set(s),
				v = function(e) {
					!e || d.has(e) || (d.add(e), v(e.parentNode))
				};
			s.forEach(v);
			var p = function(e) {
				!e || m.has(e) || Array.prototype.forEach.call(e.children, function(e) {
					if (d.has(e)) p(e);
					else try {
						var r = e.getAttribute(c),
							o = null !== r && "false" !== r,
							i = (t.get(e) || 0) + 1,
							u = (l.get(e) || 0) + 1;
						t.set(e, i), l.set(e, u), f.push(e), 1 === i && o && n.set(e, !0), 1 === u && e.setAttribute(a, "true"), o || e.setAttribute(c, "true")
					} catch (t) {
						console.error("aria-hidden: cannot operate on ", e, t)
					}
				})
			};
			return p(u), d.clear(), o++,
				function() {
					f.forEach(function(e) {
						var r = t.get(e) - 1,
							o = l.get(e) - 1;
						t.set(e, r), l.set(e, o), r || (n.has(e) || e.removeAttribute(c), n.delete(e)), o || e.removeAttribute(a)
					}), --o || (t = new WeakMap, t = new WeakMap, n = new WeakMap, r = {})
				}
		};
	e.s(["f", 0, function(e, t, n) {
		void 0 === n && (n = "data-aria-hidden");
		var r = Array.from(Array.isArray(e) ? e : [e]),
			o = t || ("u" < typeof document ? null : (Array.isArray(e) ? e[0] : e).ownerDocument.body);
		return o ? (r.push.apply(r, Array.from(o.querySelectorAll("[aria-live], script"))), u(r, o, n, "aria-hidden")) : function() {
			return null
		}
	}])
}, 885961, 367305, e => {
	"use strict";
	var t, n, r, o, i, u, a, c = function(e, t) {
			return (c = Object.setPrototypeOf || ({
				__proto__: []
			}) instanceof Array && function(e, t) {
				e.__proto__ = t
			} || function(e, t) {
				for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n])
			})(e, t)
		},
		s = function() {
			return (s = Object.assign || function(e) {
				for (var t, n = 1, r = arguments.length; n < r; n++)
					for (var o in t = arguments[n]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
				return e
			}).apply(this, arguments)
		};

	function l(e, t) {
		var n = {};
		for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && 0 > t.indexOf(r) && (n[r] = e[r]);
		if (null != e && "function" == typeof Object.getOwnPropertySymbols)
			for (var o = 0, r = Object.getOwnPropertySymbols(e); o < r.length; o++) 0 > t.indexOf(r[o]) && Object.prototype.propertyIsEnumerable.call(e, r[o]) && (n[r[o]] = e[r[o]]);
		return n
	}

	function f(e, t, n) {
		if (n || 2 == arguments.length)
			for (var r, o = 0, i = t.length; o < i; o++) !r && o in t || (r || (r = Array.prototype.slice.call(t, 0, o)), r[o] = t[o]);
		return e.concat(r || Array.prototype.slice.call(t))
	}
	"function" == typeof SuppressedError && SuppressedError, e.s(["u", () => s, "w", 0, function(e, t) {
		if ("function" != typeof t && null !== t) throw TypeError("Class extends value " + String(t) + " is not a constructor or null");

		function n() {
			this.constructor = e
		}
		c(e, t), e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n)
	}, "J", 0, function(e, t) {
		var n = "function" == typeof Symbol && e[Symbol.iterator];
		if (!n) return e;
		var r, o, i = n.call(e),
			u = [];
		try {
			for (;
				(void 0 === t || t-- > 0) && !(r = i.next()).done;) u.push(r.value)
		} catch (e) {
			o = {
				error: e
			}
		} finally {
			try {
				r && !r.done && (n = i.return) && n.call(i)
			} finally {
				if (o) throw o.error
			}
		}
		return u
	}, "z", 0, l, "p", 0, f, "_", 0, function(e) {
		var t = "function" == typeof Symbol && Symbol.iterator,
			n = t && e[t],
			r = 0;
		if (n) return n.call(e);
		if (e && "number" == typeof e.length) return {
			next: function() {
				return e && r >= e.length && (e = void 0), {
					value: e && e[r++],
					done: !e
				}
			}
		};
		throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
	}], 367305);
	var d = e.i(170380),
		m = "right-scroll-bar-position",
		v = "width-before-scroll-bar";

	function p(e, t) {
		return "function" == typeof e ? e(t) : e && (e.current = t), e
	}
	var h = "u" > typeof window ? d.useLayoutEffect : d.useEffect,
		y = new WeakMap,
		b = (void 0 === t && (t = {}), (void 0 === n && (n = function(e) {
			return e
		}), r = [], o = !1, i = {
			read: function() {
				if (o) throw Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
				return r.length ? r[r.length - 1] : null
			},
			useMedium: function(e) {
				var t = n(e, o);
				return r.push(t),
					function() {
						r = r.filter(function(e) {
							return e !== t
						})
					}
			},
			assignSyncMedium: function(e) {
				for (o = !0; r.length;) {
					var t = r;
					r = [], t.forEach(e)
				}
				r = {
					push: function(t) {
						return e(t)
					},
					filter: function() {
						return r
					}
				}
			},
			assignMedium: function(e) {
				o = !0;
				var t = [];
				if (r.length) {
					var n = r;
					r = [], n.forEach(e), t = r
				}
				var i = function() {
						var n = t;
						t = [], n.forEach(e)
					},
					u = function() {
						return Promise.resolve().then(i)
					};
				u(), r = {
					push: function(e) {
						t.push(e), u()
					},
					filter: function(e) {
						return t = t.filter(e), r
					}
				}
			}
		}).options = s({
			async: !0,
			ssr: !1
		}, t), i),
		g = function() {},
		E = d.forwardRef(function(e, t) {
			var n, r, o, i, u = d.useRef(null),
				a = d.useState({
					onScrollCapture: g,
					onWheelCapture: g,
					onTouchMoveCapture: g
				}),
				c = a[0],
				f = a[1],
				m = e.forwardProps,
				v = e.children,
				E = e.className,
				w = e.removeScrollBar,
				S = e.enabled,
				C = e.shards,
				O = e.sideCar,
				P = e.noRelative,
				N = e.noIsolation,
				R = e.inert,
				T = e.allowPinchZoom,
				M = e.as,
				L = e.gapMode,
				k = l(e, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]),
				A = (n = [u, t], r = function(e) {
					return n.forEach(function(t) {
						return p(t, e)
					})
				}, (o = (0, d.useState)(function() {
					return {
						value: null,
						callback: r,
						facade: {
							get current() {
								return o.value
							},
							set current(e) {
								var t = o.value;
								t !== e && (o.value = e, o.callback(e, t))
							}
						}
					}
				})[0]).callback = r, i = o.facade, h(function() {
					var e = y.get(i);
					if (e) {
						var t = new Set(e),
							r = new Set(n),
							o = i.current;
						t.forEach(function(e) {
							r.has(e) || p(e, null)
						}), r.forEach(function(e) {
							t.has(e) || p(e, o)
						})
					}
					y.set(i, n)
				}, [n]), i),
				x = s(s({}, k), c);
			return d.createElement(d.Fragment, null, S && d.createElement(O, {
				sideCar: b,
				removeScrollBar: w,
				shards: C,
				noRelative: P,
				noIsolation: N,
				inert: R,
				setCallbacks: f,
				allowPinchZoom: !!T,
				lockRef: u,
				gapMode: L
			}), m ? d.cloneElement(d.Children.only(v), s(s({}, x), {
				ref: A
			})) : d.createElement(void 0 === M ? "div" : M, s({}, x, {
				className: E,
				ref: A
			}), v))
		});
	E.defaultProps = {
		enabled: !0,
		removeScrollBar: !0,
		inert: !1
	}, E.classNames = {
		fullWidth: v,
		zeroRight: m
	};
	var w = function(e) {
		var t = e.sideCar,
			n = l(e, ["sideCar"]);
		if (!t) throw Error("Sidecar: please provide `sideCar` property to import the right car");
		var r = t.read();
		if (!r) throw Error("Sidecar medium not found");
		return d.createElement(r, s({}, n))
	};
	w.isSideCarExport = !0;
	var S = function() {
			var e = 0,
				t = null;
			return {
				add: function(n) {
					if (0 == e && (t = function() {
							if (!document) return null;
							var e = document.createElement("style");
							e.type = "text/css";
							var t = a || ("u" > typeof __webpack_nonce__ ? __webpack_nonce__ : void 0);
							return t && e.setAttribute("nonce", t), e
						}())) {
						var r, o;
						(r = t).styleSheet ? r.styleSheet.cssText = n : r.appendChild(document.createTextNode(n)), o = t, (document.head || document.getElementsByTagName("head")[0]).appendChild(o)
					}
					e++
				},
				remove: function() {
					--e || !t || (t.parentNode && t.parentNode.removeChild(t), t = null)
				}
			}
		},
		C = function() {
			var e = S();
			return function(t, n) {
				d.useEffect(function() {
					return e.add(t),
						function() {
							e.remove()
						}
				}, [t && n])
			}
		},
		O = function() {
			var e = C();
			return function(t) {
				return e(t.styles, t.dynamic), null
			}
		},
		P = {
			left: 0,
			top: 0,
			right: 0,
			gap: 0
		},
		N = function(e) {
			return parseInt(e || "", 10) || 0
		},
		R = function(e) {
			var t = window.getComputedStyle(document.body),
				n = t["padding" === e ? "paddingLeft" : "marginLeft"],
				r = t["padding" === e ? "paddingTop" : "marginTop"],
				o = t["padding" === e ? "paddingRight" : "marginRight"];
			return [N(n), N(r), N(o)]
		},
		T = function(e) {
			if (void 0 === e && (e = "margin"), "u" < typeof window) return P;
			var t = R(e),
				n = document.documentElement.clientWidth,
				r = window.innerWidth;
			return {
				left: t[0],
				top: t[1],
				right: t[2],
				gap: Math.max(0, r - n + t[2] - t[0])
			}
		},
		M = O(),
		L = "data-scroll-locked",
		k = function(e, t, n, r) {
			var o = e.left,
				i = e.top,
				u = e.right,
				a = e.gap;
			return void 0 === n && (n = "margin"), "\n  .".concat("with-scroll-bars-hidden", " {\n   overflow: hidden ").concat(r, ";\n   padding-right: ").concat(a, "px ").concat(r, ";\n  }\n  body[").concat(L, "] {\n    overflow: hidden ").concat(r, ";\n    overscroll-behavior: contain;\n    ").concat([t && "position: relative ".concat(r, ";"), "margin" === n && "\n    padding-left: ".concat(o, "px;\n    padding-top: ").concat(i, "px;\n    padding-right: ").concat(u, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(a, "px ").concat(r, ";\n    "), "padding" === n && "padding-right: ".concat(a, "px ").concat(r, ";")].filter(Boolean).join(""), "\n  }\n  \n  .").concat(m, " {\n    right: ").concat(a, "px ").concat(r, ";\n  }\n  \n  .").concat(v, " {\n    margin-right: ").concat(a, "px ").concat(r, ";\n  }\n  \n  .").concat(m, " .").concat(m, " {\n    right: 0 ").concat(r, ";\n  }\n  \n  .").concat(v, " .").concat(v, " {\n    margin-right: 0 ").concat(r, ";\n  }\n  \n  body[").concat(L, "] {\n    ").concat("--removed-body-scroll-bar-size", ": ").concat(a, "px;\n  }\n")
		},
		A = function() {
			var e = parseInt(document.body.getAttribute(L) || "0", 10);
			return isFinite(e) ? e : 0
		},
		x = function() {
			d.useEffect(function() {
				return document.body.setAttribute(L, (A() + 1).toString()),
					function() {
						var e = A() - 1;
						e <= 0 ? document.body.removeAttribute(L) : document.body.setAttribute(L, e.toString())
					}
			}, [])
		},
		D = function(e) {
			var t = e.noRelative,
				n = e.noImportant,
				r = e.gapMode,
				o = void 0 === r ? "margin" : r;
			x();
			var i = d.useMemo(function() {
				return T(o)
			}, [o]);
			return d.createElement(M, {
				styles: k(i, !t, o, n ? "" : "!important")
			})
		},
		I = !1;
	if ("u" > typeof window) try {
		var j = Object.defineProperty({}, "passive", {
			get: function() {
				return I = !0, !0
			}
		});
		window.addEventListener("test", j, j), window.removeEventListener("test", j, j)
	} catch (e) {
		I = !1
	}
	var F = !!I && {
			passive: !1
		},
		_ = function(e, t) {
			if (!(e instanceof Element)) return !1;
			var n = window.getComputedStyle(e);
			return "hidden" !== n[t] && (n.overflowY !== n.overflowX || "TEXTAREA" === e.tagName || "visible" !== n[t])
		},
		W = function(e, t) {
			var n = t.ownerDocument,
				r = t;
			do {
				if ("u" > typeof ShadowRoot && r instanceof ShadowRoot && (r = r.host), B(e, r)) {
					var o = U(e, r);
					if (o[1] > o[2]) return !0
				}
				r = r.parentNode
			} while (r && r !== n.body) return !1
		},
		B = function(e, t) {
			return "v" === e ? _(t, "overflowY") : _(t, "overflowX")
		},
		U = function(e, t) {
			return "v" === e ? [t.scrollTop, t.scrollHeight, t.clientHeight] : [t.scrollLeft, t.scrollWidth, t.clientWidth]
		},
		$ = function(e, t, n, r, o) {
			var i, u = (i = window.getComputedStyle(t).direction, "h" === e && "rtl" === i ? -1 : 1),
				a = u * r,
				c = n.target,
				s = t.contains(c),
				l = !1,
				f = a > 0,
				d = 0,
				m = 0;
			do {
				if (!c) break;
				var v = U(e, c),
					p = v[0],
					h = v[1] - v[2] - u * p;
				(p || h) && B(e, c) && (d += h, m += p);
				var y = c.parentNode;
				c = y && y.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? y.host : y
			} while (!s && c !== document.body || s && (t.contains(c) || t === c)) return f && (o && 1 > Math.abs(d) || !o && a > d) ? l = !0 : !f && (o && 1 > Math.abs(m) || !o && -a > m) && (l = !0), l
		},
		V = function(e) {
			return "changedTouches" in e ? [e.changedTouches[0].clientX, e.changedTouches[0].clientY] : [0, 0]
		},
		K = function(e) {
			return [e.deltaX, e.deltaY]
		},
		X = function(e) {
			return e && "current" in e ? e.current : e
		},
		Y = 0,
		z = [];
	let H = (u = function(e) {
		var t = d.useRef([]),
			n = d.useRef([0, 0]),
			r = d.useRef(),
			o = d.useState(Y++)[0],
			i = d.useState(O)[0],
			u = d.useRef(e);
		d.useEffect(function() {
			u.current = e
		}, [e]), d.useEffect(function() {
			if (e.inert) {
				document.body.classList.add("block-interactivity-".concat(o));
				var t = f([e.lockRef.current], (e.shards || []).map(X), !0).filter(Boolean);
				return t.forEach(function(e) {
						return e.classList.add("allow-interactivity-".concat(o))
					}),
					function() {
						document.body.classList.remove("block-interactivity-".concat(o)), t.forEach(function(e) {
							return e.classList.remove("allow-interactivity-".concat(o))
						})
					}
			}
		}, [e.inert, e.lockRef.current, e.shards]);
		var a = d.useCallback(function(e, t) {
				if ("touches" in e && 2 === e.touches.length || "wheel" === e.type && e.ctrlKey) return !u.current.allowPinchZoom;
				var o, i = V(e),
					a = n.current,
					c = "deltaX" in e ? e.deltaX : a[0] - i[0],
					s = "deltaY" in e ? e.deltaY : a[1] - i[1],
					l = e.target,
					f = Math.abs(c) > Math.abs(s) ? "h" : "v";
				if ("touches" in e && "h" === f && "range" === l.type) return !1;
				var d = window.getSelection(),
					m = d && d.anchorNode;
				if (m && (m === l || m.contains(l))) return !1;
				var v = W(f, l);
				if (!v) return !0;
				if (v ? o = f : (o = "v" === f ? "h" : "v", v = W(f, l)), !v) return !1;
				if (!r.current && "changedTouches" in e && (c || s) && (r.current = o), !o) return !0;
				var p = r.current || o;
				return $(p, t, e, "h" === p ? c : s, !0)
			}, []),
			c = d.useCallback(function(e) {
				if (z.length && z[z.length - 1] === i) {
					var n = "deltaY" in e ? K(e) : V(e),
						r = t.current.filter(function(t) {
							var r;
							return t.name === e.type && (t.target === e.target || e.target === t.shadowParent) && (r = t.delta, r[0] === n[0] && r[1] === n[1])
						})[0];
					if (r && r.should) {
						e.cancelable && e.preventDefault();
						return
					}
					if (!r) {
						var o = (u.current.shards || []).map(X).filter(Boolean).filter(function(t) {
							return t.contains(e.target)
						});
						(o.length > 0 ? a(e, o[0]) : !u.current.noIsolation) && e.cancelable && e.preventDefault()
					}
				}
			}, []),
			s = d.useCallback(function(e, n, r, o) {
				var i = {
					name: e,
					delta: n,
					target: r,
					should: o,
					shadowParent: function(e) {
						for (var t = null; null !== e;) e instanceof ShadowRoot && (t = e.host, e = e.host), e = e.parentNode;
						return t
					}(r)
				};
				t.current.push(i), setTimeout(function() {
					t.current = t.current.filter(function(e) {
						return e !== i
					})
				}, 1)
			}, []),
			l = d.useCallback(function(e) {
				n.current = V(e), r.current = void 0
			}, []),
			m = d.useCallback(function(t) {
				s(t.type, K(t), t.target, a(t, e.lockRef.current))
			}, []),
			v = d.useCallback(function(t) {
				s(t.type, V(t), t.target, a(t, e.lockRef.current))
			}, []);
		d.useEffect(function() {
			return z.push(i), e.setCallbacks({
					onScrollCapture: m,
					onWheelCapture: m,
					onTouchMoveCapture: v
				}), document.addEventListener("wheel", c, F), document.addEventListener("touchmove", c, F), document.addEventListener("touchstart", l, F),
				function() {
					z = z.filter(function(e) {
						return e !== i
					}), document.removeEventListener("wheel", c, F), document.removeEventListener("touchmove", c, F), document.removeEventListener("touchstart", l, F)
				}
		}, []);
		var p = e.removeScrollBar,
			h = e.inert;
		return d.createElement(d.Fragment, null, h ? d.createElement(i, {
			styles: "\n  .block-interactivity-".concat(o, " {pointer-events: none;}\n  .allow-interactivity-").concat(o, " {pointer-events: all;}\n")
		}) : null, p ? d.createElement(D, {
			noRelative: e.noRelative,
			gapMode: e.gapMode
		}) : null)
	}, b.useMedium(u), w);
	var G = d.forwardRef(function(e, t) {
		return d.createElement(E, s({}, e, {
			ref: t,
			sideCar: H
		}))
	});
	G.classNames = E.classNames, e.s(["f", 0, G], 885961)
}]);