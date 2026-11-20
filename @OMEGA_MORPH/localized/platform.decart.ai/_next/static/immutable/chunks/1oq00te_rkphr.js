(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 150877, e => {
	"use strict";
	e.i(914374);
	var t = e.i(245159);
	e.s(["I", 0, function(e) {
		return "success" === e.state.status
	}, "a", 0, function(e, r, n) {
		let a = e.getMutationCache(),
			l = e.getQueryCache(),
			u = n?.defaultOptions?.deserializeData ?? e.getDefaultOptions().hydrate?.deserializeData;
		r.mutations?.forEach(({
			state: t,
			...r
		}) => {
			a.build(e, {
				...e.getDefaultOptions().hydrate?.mutations,
				...n?.defaultOptions?.mutations,
				...r
			}, t)
		}), r.queries?.forEach(({
			queryKey: r,
			state: a,
			queryHash: o,
			meta: s,
			promise: d,
			dehydratedAt: i,
			queryType: c
		}) => {
			let f = d ? function(e) {
					let r;
					if (e.then(e => (r = e, e), t.z)?.catch?.(t.z), void 0 !== r) return {
						data: r
					}
				}(d) : void 0,
				p = void 0 === a.data ? f?.data : a.data,
				y = void 0 === p ? p : u ? u(p) : p,
				m = l.get(o),
				h = m?.state.status === "pending",
				b = m?.state.fetchStatus === "fetching";
			if (m) {
				let e = f && i > m.state.dataUpdatedAt;
				if (a.dataUpdatedAt > m.state.dataUpdatedAt || e) {
					let {
						fetchStatus: e,
						...t
					} = a;
					m.setState({
						...t,
						data: y,
						..."pending" === a.status && void 0 !== y && {
							status: "success",
							dataUpdatedAt: i,
							...!b && {
								fetchStatus: "idle"
							}
						}
					})
				}
			} else m = l.build(e, {
				...e.getDefaultOptions().hydrate?.queries,
				...n?.defaultOptions?.queries,
				queryKey: r,
				queryHash: o,
				meta: s,
				_type: c
			}, {
				...a,
				data: y,
				fetchStatus: "idle",
				status: "pending" === a.status && void 0 !== y ? "success" : a.status,
				..."pending" === a.status && void 0 !== y && {
					dataUpdatedAt: i
				}
			});
			!d || f || h || b || !(i > m.state.dataUpdatedAt) || m.fetch(void 0, {
				initialPromise: Promise.resolve(d).then(u)
			}).catch(t.z)
		})
	}])
}, 816254, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "useRouterBFCache", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = e.r(170380);

	function a(e, t, r) {
		let [a, l] = (0, n.useState)(() => ({
			tree: e,
			renderTree: t,
			stateKey: r,
			next: null
		}));
		if (a.tree === e) return a;
		let u = {
				tree: e,
				renderTree: t,
				stateKey: r,
				next: null
			},
			o = 1,
			s = a,
			d = u;
		for (; null !== s && o < 3;) {
			if (s.stateKey === r) {
				d.next = s.next;
				break
			} {
				o++;
				let e = {
					tree: s.tree,
					renderTree: s.renderTree,
					stateKey: s.stateKey,
					next: null
				};
				d.next = e, d = e
			}
			s = s.next
		}
		return l(u), u
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 180973, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		createClientParams: function() {
			return l.createRenderParamsFromClient
		},
		createClientSearchParams: function() {
			return u.createRenderSearchParamsFromClient
		}
	};
	for (var a in n) Object.defineProperty(r, a, {
		enumerable: !0,
		get: n[a]
	});
	let l = e.r(482504),
		u = e.r(26193);
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 226532, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "ClientPageRoot", {
		enumerable: !0,
		get: function() {
			return d
		}
	});
	let n = e.r(234984),
		a = e.r(692023),
		l = e.r(170380),
		u = e.r(528709),
		o = e.r(776869),
		s = e.r(180973);

	function d({
		Component: e,
		serverProvidedParams: t
	}) {
		let r, i;
		if (null !== t) r = t.searchParams, i = t.params;
		else {
			let e = (0, l.use)(a.LayoutRouterContext);
			i = null !== e ? e.parentParams : {}, r = (0, u.urlSearchParamsToParsedUrlQuery)((0, l.use)(o.SearchParamsContext))
		}
		let c = (0, s.createClientSearchParams)(r),
			f = (0, s.createClientParams)(i);
		return (0, n.jsx)(e, {
			params: f,
			searchParams: c
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 319122, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "ClientSegmentRoot", {
		enumerable: !0,
		get: function() {
			return o
		}
	});
	let n = e.r(234984),
		a = e.r(692023),
		l = e.r(170380),
		u = e.r(180973);

	function o({
		Component: e,
		slots: t,
		serverProvidedParams: r
	}) {
		let s;
		if (null !== r) s = r.params;
		else {
			let e = (0, l.use)(a.LayoutRouterContext);
			s = null !== e ? e.parentParams : {}
		}
		let d = (0, u.createClientParams)(s);
		return (0, n.jsx)(e, {
			...t,
			params: d
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 145942, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "HTTPAccessFallbackBoundary", {
		enumerable: !0,
		get: function() {
			return i
		}
	});
	let n = e.r(56421),
		a = e.r(234984),
		l = n._(e.r(170380)),
		u = e.r(332244),
		o = e.r(140161),
		s = e.r(692023);
	class d extends l.default.Component {
		constructor(e) {
			super(e), this.state = {
				triggeredStatus: void 0,
				previousPathname: e.pathname
			}
		}
		componentDidCatch() {}
		static getDerivedStateFromError(e) {
			if ((0, o.isHTTPAccessFallbackError)(e)) return {
				triggeredStatus: (0, o.getAccessFallbackHTTPStatus)(e)
			};
			throw e
		}
		static getDerivedStateFromProps(e, t) {
			return e.pathname !== t.previousPathname && t.triggeredStatus ? {
				triggeredStatus: void 0,
				previousPathname: e.pathname
			} : {
				triggeredStatus: t.triggeredStatus,
				previousPathname: e.pathname
			}
		}
		render() {
			let {
				notFound: e,
				forbidden: t,
				unauthorized: r,
				children: n
			} = this.props, {
				triggeredStatus: l
			} = this.state, u = {
				[o.HTTPAccessErrorStatus.NOT_FOUND]: e,
				[o.HTTPAccessErrorStatus.FORBIDDEN]: t,
				[o.HTTPAccessErrorStatus.UNAUTHORIZED]: r
			};
			if (l) {
				let s = l === o.HTTPAccessErrorStatus.NOT_FOUND && e,
					d = l === o.HTTPAccessErrorStatus.FORBIDDEN && t,
					i = l === o.HTTPAccessErrorStatus.UNAUTHORIZED && r;
				return s || d || i ? (0, a.jsxs)(a.Fragment, {
					children: [(0, a.jsx)("meta", {
						name: "robots",
						content: "noindex"
					}), !1, u[l]]
				}) : n
			}
			return n
		}
	}

	function i({
		notFound: e,
		forbidden: t,
		unauthorized: r,
		children: n
	}) {
		let o = (0, u.useUntrackedPathname)(),
			c = (0, l.useContext)(s.MissingSlotContext);
		return e || t || r ? (0, a.jsx)(d, {
			pathname: o,
			notFound: e,
			forbidden: t,
			unauthorized: r,
			missingSlots: c,
			children: n
		}) : (0, a.jsx)(a.Fragment, {
			children: n
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 511062, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		InstantValidationBoundaryContext: function() {
			return l.InstantValidationBoundaryContext
		},
		PlaceValidationBoundaryBelowThisLevel: function() {
			return l.PlaceValidationBoundaryBelowThisLevel
		},
		RenderValidationBoundaryAtThisLevel: function() {
			return l.RenderValidationBoundaryAtThisLevel
		},
		SlotMarker: function() {
			return l.SlotMarker
		}
	};
	for (var a in n) Object.defineProperty(r, a, {
		enumerable: !0,
		get: n[a]
	});
	let l = e.r(428343);
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 428343, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		InstantValidationBoundaryContext: function() {
			return l
		},
		PlaceValidationBoundaryBelowThisLevel: function() {
			return u
		},
		RenderValidationBoundaryAtThisLevel: function() {
			return o
		},
		SlotMarker: function() {
			return s
		}
	};
	for (var a in n) Object.defineProperty(r, a, {
		enumerable: !0,
		get: n[a]
	});
	let l = null,
		u = null,
		o = null,
		s = null;
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 839471, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		LoadingBoundaryProvider: function() {
			return O
		},
		default: function() {
			return T
		}
	};
	for (var a in n) Object.defineProperty(r, a, {
		enumerable: !0,
		get: n[a]
	});
	let l = e.r(56421),
		u = e.r(234984),
		o = l._(e.r(170380)),
		s = e.r(692023),
		d = e.r(617249),
		i = e.r(872811),
		c = e.r(116028),
		f = e.r(664173),
		p = e.r(145942),
		y = e.r(511062),
		m = e.r(498106),
		h = e.r(816254);
	e.r(521844);
	let b = e.r(776869),
		v = e.r(528709),
		g = e.r(679944);

	function P(e, t, r) {
		let n = e.getClientRects();
		if (0 === n.length) return 0;
		let a = 1 / 0;
		for (let e = 0; e < n.length; e++) {
			let t = n[e];
			t.top < a && (a = t.top)
		}
		return a >= r() && a <= t ? 1 : 2
	}

	function j(e) {
		let t = o.default.useRef(null);
		return (0, o.useLayoutEffect)(() => {
			let {
				scrollRef: r,
				renderTree: n
			} = e, a = r.forceScroll ? r.scrollRef : n.data.scrollRef;
			if (null === a || !a.current) return;
			let l = null,
				u = r.hashFragment;
			if (u) {
				if (null === (l = "top" === u ? document.body : document.getElementById(u) ?? document.getElementsByName(u)[0] ?? null)) {
					a.current = !1, r.onlyHashChange = !1, r.hashFragment = null;
					return
				}
			} else l = t.current;
			if (null === l) return;
			let o = !1;
			(0, c.disableSmoothScrollDuringRouteTransition)(() => {
				let e = document.documentElement,
					t = null,
					r = null,
					n = null,
					s = () => {
						var r;
						let a, l;
						return null === n && (r = t, n = !Number.isFinite(l = Number.parseFloat(a = getComputedStyle(e).scrollPaddingTop)) || l < 0 ? 0 : a.endsWith("px") ? l : a.endsWith("%") ? l / 100 * r : 0), n
					};
				(u || (t = e.clientHeight, 0 !== (r = P(l, t, s)))) && ((o = !0, a.current = !1, u) ? l.scrollIntoView() : 1 !== r && (e.scrollTop = 0, 2 === P(l, t, s) && l.scrollIntoView()))
			}, {
				dontForceLayout: !0,
				onlyHashChange: r.onlyHashChange
			}), o && (r.onlyHashChange = !1, r.hashFragment = null)
		}, void 0), (0, u.jsx)(o.Fragment, {
			ref: t,
			children: e.children
		})
	}

	function _({
		children: e,
		renderTree: t
	}) {
		let r = (0, o.useContext)(s.GlobalLayoutRouterContext);
		if (!r) throw Error("invariant global layout router not mounted");
		return (0, u.jsx)(j, {
			scrollRef: r.scrollRef,
			renderTree: t,
			children: e
		})
	}

	function x({
		tree: e,
		segmentPath: t,
		debugNameContext: r,
		renderTree: n,
		params: a,
		url: l,
		isActive: i
	}) {
		let c, f = (0, o.useContext)(s.GlobalLayoutRouterContext);
		if ((0, o.useContext)(b.NavigationPromisesContext), !f) throw Error("invariant global layout router not mounted");
		let p = null !== n.data.prefetchRsc ? n.data.prefetchRsc : n.data.rsc,
			y = (0, o.useDeferredValue)(n.data.rsc, p);
		if ((0, g.isDeferredRsc)(y)) {
			let e = (0, o.use)(y);
			null === e && (0, o.use)(d.unresolvedThenable), c = e
		} else null === y && (0, o.use)(d.unresolvedThenable), c = y;
		let m = c;
		return (0, u.jsx)(s.LayoutRouterContext.Provider, {
			value: {
				parentTree: e,
				parentRenderTree: n,
				parentSegmentPath: t,
				parentParams: a,
				parentLoadingData: null,
				debugNameContext: r,
				url: l,
				isActive: i
			},
			children: m
		})
	}

	function O({
		loading: e,
		children: t
	}) {
		let r = (0, o.use)(s.LayoutRouterContext);
		return null === r ? t : (0, u.jsx)(s.LayoutRouterContext.Provider, {
			value: {
				parentTree: r.parentTree,
				parentRenderTree: r.parentRenderTree,
				parentSegmentPath: r.parentSegmentPath,
				parentParams: r.parentParams,
				parentLoadingData: e,
				debugNameContext: r.debugNameContext,
				url: r.url,
				isActive: r.isActive
			},
			children: t
		})
	}

	function C({
		name: e,
		loading: t,
		children: r
	}) {
		if (null !== t) {
			let n = t[0],
				a = t[1],
				l = t[2];
			return (0, u.jsx)(o.Suspense, {
				name: e,
				fallback: (0, u.jsxs)(u.Fragment, {
					children: [a, l, n]
				}),
				children: r
			})
		}
		return (0, u.jsx)(u.Fragment, {
			children: r
		})
	}

	function T({
		parallelRouterKey: e,
		error: t,
		errorStyles: r,
		errorScripts: n,
		templateStyles: a,
		templateScripts: l,
		template: c,
		notFound: b,
		forbidden: g,
		unauthorized: P,
		segmentViewBoundaries: j
	}) {
		let O = (0, o.useContext)(s.LayoutRouterContext);
		if (!O) throw Error("invariant expected layout router to be mounted");
		let {
			parentTree: S,
			parentRenderTree: M,
			parentSegmentPath: R,
			parentParams: F,
			parentLoadingData: A,
			url: B,
			isActive: E,
			debugNameContext: D
		} = O, L = S[0], w = null === R ? [e] : R.concat([L, e]), H = S[1][e], N = M.slots?.get(e);
		(void 0 === H || void 0 === N) && (0, o.use)(d.unresolvedThenable);
		let U = null;
		"u" < typeof window && (U = (0, o.use)(y.InstantValidationBoundaryContext));
		let V = H[0],
			k = (0, m.createSegmentKey)(V),
			I = (0, h.useRouterBFCache)(H, N, k),
			K = [];
		do {
			let e = I.tree,
				d = I.renderTree,
				m = I.stateKey,
				h = e[0],
				j = F;
			if (Array.isArray(h)) {
				let e = h[0],
					t = h[1],
					r = h[2],
					n = (0, v.getParamValueFromCacheKey)(t, r);
				null !== n && (j = {
					...F,
					[e]: n
				})
			}
			let O = function(e) {
					if ("/" === e) return "/";
					if ("string" == typeof e)
						if ("(__SLOT__)" === e) return;
						else return e + "/";
					return e[1] + "/"
				}(h),
				T = O ?? D,
				S = void 0 === O ? void 0 : D,
				M = (0, u.jsxs)(_, {
					renderTree: d,
					children: [(0, u.jsx)(i.ErrorBoundary, {
						errorComponent: t,
						errorStyles: r,
						errorScripts: n,
						children: (0, u.jsx)(C, {
							name: S,
							loading: A,
							children: (0, u.jsx)(p.HTTPAccessFallbackBoundary, {
								notFound: b,
								forbidden: g,
								unauthorized: P,
								children: (0, u.jsxs)(f.RedirectBoundary, {
									children: [(0, u.jsx)(x, {
										url: B,
										tree: e,
										params: j,
										renderTree: d,
										segmentPath: w,
										debugNameContext: T,
										isActive: E && m === k
									}), null]
								})
							})
						})
					}), null]
				});
			"u" < typeof window && "string" == typeof U && (M = (0, u.jsx)(y.RenderValidationBoundaryAtThisLevel, {
				id: U,
				children: M
			}));
			let R = (0, u.jsxs)(s.TemplateContext.Provider, {
				value: M,
				children: [a, l, c]
			}, m);
			R = (0, u.jsx)(o.Activity, {
				name: S,
				mode: m === k ? "visible" : "hidden",
				children: R
			}, m), K.push(R), I = I.next
		} while (null !== I) return K
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 761712, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "default", {
		enumerable: !0,
		get: function() {
			return o
		}
	});
	let n = e.r(56421),
		a = e.r(234984),
		l = n._(e.r(170380)),
		u = e.r(692023);

	function o() {
		let e = (0, l.useContext)(u.TemplateContext);
		return (0, a.jsx)(a.Fragment, {
			children: e
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 482504, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "createRenderParamsFromClient", {
		enumerable: !0,
		get: function() {
			return n
		}
	});
	let n = e.r(825825).createRenderParamsFromClient;
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 825825, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "createRenderParamsFromClient", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = new WeakMap;

	function a(e) {
		let t = n.get(e);
		if (t) return t;
		let r = Promise.resolve(e);
		return r.status = "fulfilled", r.value = e, n.set(e, r), r
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 26193, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "createRenderSearchParamsFromClient", {
		enumerable: !0,
		get: function() {
			return n
		}
	});
	let n = e.r(980359).createRenderSearchParamsFromClient;
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 980359, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "createRenderSearchParamsFromClient", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = new WeakMap;

	function a(e) {
		let t = n.get(e);
		if (t) return t;
		let r = Promise.resolve(e);
		return r.status = "fulfilled", r.value = e, n.set(e, r), r
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 194063, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "IconMark", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = e.r(234984),
		a = () => "u" > typeof window ? null : (0, n.jsx)("meta", {
			name: "«nxt-icon»"
		})
}, 116028, (e, t, r) => {
	"use strict";

	function n(e, t = {}) {
		if (t.onlyHashChange) return void e();
		let r = document.documentElement;
		if ("smooth" !== r.dataset.scrollBehavior) return void e();
		let a = r.style.scrollBehavior;
		r.style.scrollBehavior = "auto", t.dontForceLayout || r.getClientRects(), e(), r.style.scrollBehavior = a
	}
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "disableSmoothScrollDuringRouteTransition", {
		enumerable: !0,
		get: function() {
			return n
		}
	})
}]);