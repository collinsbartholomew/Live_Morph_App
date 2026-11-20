(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 977197, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		n = e.i(927531),
		s = e.i(740086),
		i = e.i(170380),
		a = e.i(528506),
		o = e.i(663303);

	function u() {
		let e, t, u, l, c = (0, r.c)(10),
			{
				data: d
			} = (0, o.U)(),
			f = (0, n.usePathname)(),
			h = (0, n.useSearchParams)(),
			p = (0, s.f)();
		c[0] !== d ? (e = () => {
			d?.session.userId && d?.user && a.f.identify(d.session.userId, {
				email: d.user.email,
				name: d.user.name,
				createdAt: d.user.createdAt.toISOString(),
				credits: d.user.credits,
				unsubscribe: !d.user.consentForMailingList
			})
		}, c[0] = d, c[1] = e) : e = c[1];
		let m = d?.session.userId,
			y = d?.user;
		return c[2] !== m || c[3] !== y ? (t = [m, y], c[2] = m, c[3] = y, c[4] = t) : t = c[4], (0, i.useEffect)(e, t), c[5] !== f || c[6] !== p || c[7] !== h ? (u = () => {
			if (f && p) {
				let e = window.origin + f;
				h.toString() && (e = `${e}?${h.toString()}`), p.capture("$pageview", {
					$current_url: e
				})
			}
		}, l = [f, h, p], c[5] = f, c[6] = p, c[7] = h, c[8] = u, c[9] = l) : (u = c[8], l = c[9]), (0, i.useEffect)(u, l), null
	}
	e.s(["default", 0, function() {
		let e, n = (0, r.c)(1);
		return n[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(i.Suspense, {
			fallback: null,
			children: (0, t.jsx)(u, {})
		}), n[0] = e) : e = n[0], e
	}])
}, 677120, e => {
	"use strict";
	let t;
	var r = e.i(234984),
		n = e.i(582018),
		s = e.i(619525),
		i = e.i(775050),
		a = e.i(292109),
		o = e.i(740086),
		u = e.i(170380),
		l = e.i(150877),
		c = e.i(245159),
		d = e.i(568191),
		f = e.i(213002),
		h = e.i(627888),
		p = e.i(96468),
		m = e.i(999540),
		y = class extends p.f {
			#e;
			#t;
			#r;
			constructor(e = {}) {
				super(), this.config = e, this.#e = new Set, this.#t = new Map, this.#r = 0
			}
			build(e, t, r) {
				let n = new m.I({
					client: e,
					mutationCache: this,
					mutationId: ++this.#r,
					options: e.defaultMutationOptions(t),
					state: r
				});
				return this.add(n), n
			}
			add(e) {
				this.#e.add(e);
				let t = g(e);
				if ("string" == typeof t) {
					let r = this.#t.get(t);
					r ? r.push(e) : this.#t.set(t, [e])
				}
				this.notify({
					type: "added",
					mutation: e
				})
			}
			remove(e) {
				if (this.#e.delete(e)) {
					let t = g(e);
					if ("string" == typeof t) {
						let r = this.#t.get(t);
						if (r)
							if (r.length > 1) {
								let t = r.indexOf(e); - 1 !== t && r.splice(t, 1)
							} else r[0] === e && this.#t.delete(t)
					}
				}
				this.notify({
					type: "removed",
					mutation: e
				})
			}
			canRun(e) {
				let t = g(e);
				if ("string" != typeof t) return !0;
				{
					let r = this.#t.get(t)?.find(e => "pending" === e.state.status);
					return !r || r === e
				}
			}
			runNext(e) {
				let t = g(e);
				return "string" == typeof t ? this.#t.get(t)?.find(t => t !== e && t.state.isPaused)?.continue() ?? Promise.resolve() : Promise.resolve()
			}
			clear() {
				f.f.batch(() => {
					let e = this.getAll();
					this.#e.clear(), this.#t.clear(), e.forEach(e => {
						this.notify({
							type: "removed",
							mutation: e
						})
					})
				})
			}
			getAll() {
				return Array.from(this.#e)
			}
			find(e) {
				let t = {
					exact: !0,
					...e
				};
				return this.getAll().find(e => (0, c.L)(t, e))
			}
			findAll(e = {}) {
				return this.getAll().filter(t => (0, c.L)(e, t))
			}
			notify(e) {
				f.f.batch(() => {
					this.listeners.forEach(t => {
						t(e)
					})
				})
			}
			resumePausedMutations() {
				let e = this.getAll().filter(e => e.state.isPaused);
				return f.f.batch(() => Promise.all(e.map(e => e.continue().catch(c.z))))
			}
		};

	function g(e) {
		return e.options.scope?.id
	}
	var b = p,
		v = e.i(427578),
		w = class extends b.f {
			#n;
			constructor(e = {}) {
				super(), this.config = e, this.#n = new Map
			}
			build(e, t, r) {
				let n = t.queryKey,
					s = t.queryHash ?? (0, c.K)(n, t),
					i = this.get(s);
				return i || (i = new v.X({
					client: e,
					queryKey: n,
					queryHash: s,
					options: e.defaultQueryOptions(t),
					state: r,
					defaultOptions: e.getQueryDefaults(n)
				}), this.add(i)), i
			}
			add(e) {
				this.#n.has(e.queryHash) || (this.#n.set(e.queryHash, e), this.notify({
					type: "added",
					query: e
				}))
			}
			remove(e) {
				this.#n.get(e.queryHash) === e && (e.destroy(), this.#n.delete(e.queryHash), this.notify({
					type: "removed",
					query: e
				}))
			}
			clear() {
				f.f.batch(() => {
					this.getAll().forEach(e => {
						this.remove(e)
					})
				})
			}
			get(e) {
				return this.#n.get(e)
			}
			getAll() {
				return [...this.#n.values()]
			}
			find(e) {
				let t = {
					exact: !0,
					...e
				};
				return this.getAll().find(e => (0, c.N)(t, e))
			}
			findAll(e = {}) {
				let t = this.getAll();
				return Object.keys(e).length > 0 ? t.filter(t => (0, c.N)(e, t)) : t
			}
			notify(e) {
				f.f.batch(() => {
					this.listeners.forEach(t => {
						t(e)
					})
				})
			}
			onFocus() {
				f.f.batch(() => {
					this.getAll().forEach(e => {
						e.onFocus()
					})
				})
			}
			onOnline() {
				f.f.batch(() => {
					this.getAll().forEach(e => {
						e.onOnline()
					})
				})
			}
		},
		E = class {
			#s;
			#i;
			#a;
			#o;
			#u;
			#l;
			#c;
			#d;
			constructor(e = {}) {
				this.#s = e.queryCache || new w, this.#i = e.mutationCache || new y, this.#a = e.defaultOptions || {}, this.#o = new Map, this.#u = new Map, this.#l = 0
			}
			mount() {
				this.#l++, 1 === this.#l && (this.#c = d.f.subscribe(async e => {
					e && (await this.resumePausedMutations(), this.#s.onFocus())
				}), this.#d = h.f.subscribe(async e => {
					e && (await this.resumePausedMutations(), this.#s.onOnline())
				}))
			}
			unmount() {
				this.#l--, 0 === this.#l && (this.#c?.(), this.#c = void 0, this.#d?.(), this.#d = void 0)
			}
			isFetching(e) {
				return this.#s.findAll({
					...e,
					fetchStatus: "fetching"
				}).length
			}
			isMutating(e) {
				return this.#i.findAll({
					...e,
					status: "pending"
				}).length
			}
			getQueryData(e) {
				let t = this.defaultQueryOptions({
					queryKey: e
				});
				return this.#s.get(t.queryHash)?.state.data
			}
			ensureQueryData(e) {
				let t = this.defaultQueryOptions(e),
					r = this.#s.build(this, t),
					n = r.state.data;
				return void 0 === n ? this.fetchQuery(e) : (e.revalidateIfStale && r.isStaleByTime((0, c.S)(t.staleTime, r)) && this.prefetchQuery(t), Promise.resolve(n))
			}
			getQueriesData(e) {
				return this.#s.findAll(e).map(({
					queryKey: e,
					state: t
				}) => [e, t.data])
			}
			setQueryData(e, t, r) {
				let n = this.defaultQueryOptions({
						queryKey: e
					}),
					s = this.#s.get(n.queryHash)?.state.data,
					i = (0, c.b)(t, s);
				if (void 0 !== i) return this.#s.build(this, n).setData(i, {
					...r,
					manual: !0
				})
			}
			setQueriesData(e, t, r) {
				return f.f.batch(() => this.#s.findAll(e).map(({
					queryKey: e
				}) => [e, this.setQueryData(e, t, r)]))
			}
			getQueryState(e) {
				let t = this.defaultQueryOptions({
					queryKey: e
				});
				return this.#s.get(t.queryHash)?.state
			}
			removeQueries(e) {
				let t = this.#s;
				f.f.batch(() => {
					t.findAll(e).forEach(e => {
						t.remove(e)
					})
				})
			}
			resetQueries(e, t) {
				let r = this.#s;
				return f.f.batch(() => {
					let n = r.findAll(e),
						s = new Set(n);
					return n.forEach(e => {
						e.reset()
					}), this.refetchQueries({
						type: "active",
						predicate: e => s.has(e)
					}, t)
				})
			}
			cancelQueries(e, t = {}) {
				let r = {
					revert: !0,
					...t
				};
				return Promise.all(f.f.batch(() => this.#s.findAll(e).map(e => e.cancel(r)))).then(c.z).catch(c.z)
			}
			invalidateQueries(e, t = {}) {
				return f.f.batch(() => (this.#s.findAll(e).forEach(e => {
					e.invalidate()
				}), e?.refetchType === "none") ? Promise.resolve() : this.refetchQueries({
					...e,
					type: e?.refetchType ?? e?.type ?? "active"
				}, t))
			}
			refetchQueries(e, t = {}) {
				let r = {
					...t,
					cancelRefetch: t.cancelRefetch ?? !0
				};
				return Promise.all(f.f.batch(() => this.#s.findAll(e).filter(e => !e.isDisabled() && !e.isStatic()).map(e => {
					let t = e.fetch(void 0, r),
						n = "paused" === e.state.fetchStatus;
					return (!r.throwOnError || n) && (t = t.catch(c.z)), n ? Promise.resolve() : t
				}))).then(c.z)
			}
			async query(e) {
				let t = this.defaultQueryOptions(e);
				void 0 === t.retry && (t.retry = !1);
				let r = this.#s.build(this, t),
					n = r.isStaleByTime((0, c.S)(t.staleTime, r)) ? await r.fetch(t) : r.state.data,
					s = t.select;
				return s ? s(n) : n
			}
			fetchQuery(e) {
				let t = this.defaultQueryOptions(e);
				void 0 === t.retry && (t.retry = !1);
				let r = this.#s.build(this, t);
				return r.isStaleByTime((0, c.S)(t.staleTime, r)) ? r.fetch(t) : Promise.resolve(r.state.data)
			}
			prefetchQuery(e) {
				return this.fetchQuery(e).then(c.z).catch(c.z)
			}
			infiniteQuery(e) {
				return e._type = "infinite", this.query(e)
			}
			fetchInfiniteQuery(e) {
				return e._type = "infinite", this.fetchQuery(e)
			}
			prefetchInfiniteQuery(e) {
				return this.fetchInfiniteQuery(e).then(c.z).catch(c.z)
			}
			ensureInfiniteQueryData(e) {
				return e._type = "infinite", this.ensureQueryData(e)
			}
			resumePausedMutations() {
				return h.f.isOnline() ? this.#i.resumePausedMutations() : Promise.resolve()
			}
			getQueryCache() {
				return this.#s
			}
			getMutationCache() {
				return this.#i
			}
			getDefaultOptions() {
				return this.#a
			}
			setDefaultOptions(e) {
				this.#a = e
			}
			setQueryDefaults(e, t) {
				this.#o.set((0, c.q)(e), {
					queryKey: e,
					defaultOptions: t
				})
			}
			getQueryDefaults(e) {
				let t = [...this.#o.values()],
					r = {};
				return t.forEach(t => {
					(0, c.P)(e, t.queryKey) && Object.assign(r, t.defaultOptions)
				}), r
			}
			setMutationDefaults(e, t) {
				this.#u.set((0, c.q)(e), {
					mutationKey: e,
					defaultOptions: t
				})
			}
			getMutationDefaults(e) {
				let t = [...this.#u.values()],
					r = {};
				return t.forEach(t => {
					(0, c.P)(e, t.mutationKey) && Object.assign(r, t.defaultOptions)
				}), r
			}
			defaultQueryOptions(e) {
				if (e._defaulted) return e;
				let t = {
					...this.#a.queries,
					...this.getQueryDefaults(e.queryKey),
					...e,
					_defaulted: !0
				};
				return t.queryHash || (t.queryHash = (0, c.K)(t.queryKey, t)), void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = "always" !== t.networkMode), void 0 === t.throwOnError && (t.throwOnError = !!t.suspense), !t.networkMode && t.persister && (t.networkMode = "offlineFirst"), t.queryFn === c.V && (t.enabled = !1), t
			}
			defaultMutationOptions(e) {
				return e?._defaulted ? e : {
					...this.#a.mutations,
					...e?.mutationKey && this.getMutationDefaults(e.mutationKey),
					...e,
					_defaulted: !0
				}
			}
			clear() {
				this.#s.clear(), this.#i.clear()
			}
		},
		S = e.i(205647);

	function P() {
		return new E({
			defaultOptions: {
				queries: {
					staleTime: 6e4,
					retry: c.l ? 0 : S.b
				},
				dehydrate: {
					shouldDehydrateQuery: e => (0, l.I)(e) || "pending" === e.state.status
				}
			}
		})
	}

	function _() {
		a.f.init("phc_yQbkWmkrpdvsfkp0tY77iJ6yhkZ5UFKv7XAW87qWYub", {
			api_host: "https://us.i.posthog.com",
			person_profiles: "identified_only",
			defaults: "2025-05-24",
			autocapture: !1,
			enable_recording_console_log: !1,
			capture_pageview: !1,
			capture_pageleave: !0,
			session_recording: {
				maskAllInputs: !1,
				maskInputOptions: {
					password: !0,
					textarea: !1
				},
				captureCanvas: {
					recordCanvas: !0
				}
			}
		})
	}
	e.s(["Providers", 0, function(e) {
		let l, d, f, h, p, m = (0, n.c)(8);
		m[0] !== e ? ({
			children: l,
			...d
		} = e, m[0] = e, m[1] = l, m[2] = d) : (l = m[1], d = m[2]), m[3] === Symbol.for("react.memo_cache_sentinel") ? (f = c.l ? P() : (t || (t = P()), t), m[3] = f) : f = m[3];
		let y = f;
		return m[4] === Symbol.for("react.memo_cache_sentinel") ? (h = [], m[4] = h) : h = m[4], (0, u.useEffect)(_, h), m[5] !== l || m[6] !== d ? (p = (0, r.jsx)(s.P, {
			client: y,
			children: (0, r.jsx)(o.d, {
				client: a.f,
				children: (0, r.jsx)(i.J, {
					...d,
					children: l
				})
			})
		}), m[5] = l, m[6] = d, m[7] = p) : p = m[7], p
	}], 677120)
}, 111255, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(170380);

	function n() {
		window.dataLayer = window.dataLayer || [], window.dataLayer.push({
			event: "consent",
			consent: "default",
			ad_storage: "denied",
			ad_user_data: "denied",
			ad_personalization: "denied",
			analytics_storage: "denied",
			functionality_storage: "denied",
			personalization_storage: "denied",
			security_storage: "granted",
			wait_for_update: 500
		})
	}
	e.s(["ConsentInitializer", 0, function() {
		let e, s = (0, t.c)(1);
		return s[0] === Symbol.for("react.memo_cache_sentinel") ? (e = [], s[0] = e) : e = s[0], (0, r.useEffect)(n, e), null
	}])
}, 882305, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		n = e.i(775050),
		s = e.i(322932);
	e.s(["Toaster", 0, e => {
		let i, a, o, u = (0, r.c)(6);
		u[0] !== e ? ({
			...i
		} = e, u[0] = e, u[1] = i) : i = u[1];
		let {
			theme: l
		} = (0, n.i)(), c = void 0 === l ? "system" : l;
		return u[2] === Symbol.for("react.memo_cache_sentinel") ? (a = {
			classNames: {
				toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
				description: "group-[.toast]:text-muted-foreground",
				actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
				cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
			}
		}, u[2] = a) : a = u[2], u[3] !== i || u[4] !== c ? (o = (0, t.jsx)(s.K, {
			theme: c,
			className: "toaster group",
			toastOptions: a,
			...i
		}), u[3] = i, u[4] = c, u[5] = o) : o = u[5], o
	}])
}, 25318, e => {
	"use strict";
	var t = e.i(914374),
		r = e.i(170380),
		n = e.i(927531);

	function s() {
		return false
	}

	function i(e) {
		return RegExp(`/${e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}(?=[/?#]|$)`)
	}

	function a(e) {
		return e.startsWith("http://") || e.startsWith("https://") || e.startsWith("/") ? e : `/${e}`
	}

	function o(e) {
		(0, r.useEffect)(() => {
			var t;
			e.beforeSend && (null == (t = window.si) || t.call(window, "beforeSend", e.beforeSend))
		}, [e.beforeSend]);
		let n = (0, r.useRef)(null);
		return (0, r.useEffect)(() => {
			if (!n.current) {
				let r = function(e = {}, t) {
					var r;
					if (!("u" > typeof window) || null === e.route) return null;
					window.si || (window.si = function(...e) {
						window.siq = window.siq || [], window.siq.push(e)
					});
					let {
						beforeSend: n,
						src: i,
						dataset: o
					} = function(e, t) {
						var r, n;
						let i = e;
						if (t) try {
							i = {
								...null == (r = JSON.parse(t)) ? void 0 : r.speedInsights,
								...e
							}
						} catch {}
						let o = {
							sdkn: "@vercel/speed-insights" + (i.framework ? `/${i.framework}` : ""),
							sdkv: "2.1.0"
						};
						return i.sampleRate && (o.sampleRate = i.sampleRate.toString()), i.route && (o.route = i.route), "boolean" == typeof i.softNavs && (o.softNavs = String(i.softNavs)), s() && !1 === i.debug && (o.debug = "false"), i.dsn && (o.dsn = i.dsn), i.endpoint ? o.endpoint = a(i.endpoint) : i.basePath && (o.endpoint = a(`${i.basePath}/speed-insights/vitals`)), {
							src: (n = i).scriptSrc ? a(n.scriptSrc) : s() ? "https://va.vercel-scripts.com/v1/speed-insights/script.debug.js" : n.dsn ? "https://va.vercel-scripts.com/v1/speed-insights/script.js" : n.basePath ? a(`${n.basePath}/speed-insights/script.js`) : "../../../../_vercel/speed-insights/script.js",
							beforeSend: i.beforeSend,
							dataset: o
						}
					}(e, t);
					if (document.head.querySelector(`script[src*="${i}"]`)) return null;
					n && (null == (r = window.si) || r.call(window, "beforeSend", n));
					let u = document.createElement("script");
					for (let [e, t] of(u.src = i, u.defer = !0, Object.entries(o))) u.dataset[e] = t;
					return u.onerror = () => {
						console.log(`[Vercel Speed Insights] Failed to load script from ${i}. Please check if any content blockers are enabled and try again.`)
					}, document.head.appendChild(u), {
						setRoute: e => {
							u.dataset.route = e ?? void 0
						}
					}
				}({
					framework: e.framework ?? "react",
					basePath: e.basePath ?? function() {
						if (void 0 !== t.default && void 0 !== t.default.env) return t.default.env.REACT_APP_VERCEL_OBSERVABILITY_BASEPATH
					}(),
					...e
				}, e.configString ?? function() {
					if (void 0 !== t.default && void 0 !== t.default.env) return t.default.env.REACT_APP_VERCEL_OBSERVABILITY_CLIENT_CONFIG
				}());
				r && (n.current = r.setRoute)
			}
		}, [e]), (0, r.useEffect)(() => {
			n.current && e.route && n.current(e.route)
		}, [e.route]), null
	}

	function u(e) {
		let s = (() => {
			let e = (0, n.useParams)(),
				t = (0, n.useSearchParams)() || new URLSearchParams,
				r = (0, n.usePathname)();
			if (!e) return null;
			let s = Object.keys(e).length ? e : Object.fromEntries(t.entries());
			if (!r || !s) return r;
			let a = r;
			try {
				let e = Object.entries(s);
				for (let [t, r] of e)
					if (!Array.isArray(r)) {
						let e = i(r);
						e.test(a) && (a = a.replace(e, `/[${t}]`))
					} for (let [t, r] of e)
					if (Array.isArray(r)) {
						let e = i(r.join("/"));
						e.test(a) && (a = a.replace(e, `/[...${t}]`))
					} return a
			} catch {
				return r
			}
		})();
		return r.default.createElement(o, {
			route: s,
			...e,
			framework: "next",
			basePath: function() {
				if (void 0 !== t.default && void 0 !== t.default.env) return t.default.env.NEXT_PUBLIC_VERCEL_OBSERVABILITY_BASEPATH
			}(),
			configString: function() {
				if (void 0 !== t.default && void 0 !== t.default.env) return '{"analytics":{"scriptSrc":"4eeb3372dabe24b1/script.js","viewEndpoint":"4eeb3372dabe24b1/view","eventEndpoint":"4eeb3372dabe24b1/event","sessionEndpoint":"4eeb3372dabe24b1/session"},"speedInsights":{"scriptSrc":"bcc7d7ff301db145/script.js","endpoint":"bcc7d7ff301db145/vitals"}}'
			}()
		})
	}
	e.s(["SpeedInsights", 0, function(e) {
		return r.default.createElement(r.Suspense, {
			fallback: null
		}, r.default.createElement(u, {
			...e
		}))
	}])
}, 775050, e => {
	"use strict";
	var t = e.i(170380),
		r = (e, t, r, n, s, i, a, o) => {
			let u = document.documentElement,
				l = ["light", "dark"];

			function c(t) {
				var r;
				(Array.isArray(e) ? e : [e]).forEach(e => {
					let r = "class" === e,
						n = r && i ? s.map(e => i[e] || e) : s;
					r ? (u.classList.remove(...n), u.classList.add(i && i[t] ? i[t] : t)) : u.setAttribute(e, t)
				}), r = t, o && l.includes(r) && (u.style.colorScheme = r)
			}
			if (n) c(n);
			else try {
				let e = localStorage.getItem(t) || r,
					n = a && "system" === e ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : e;
				c(n)
			} catch (e) {}
		},
		n = ["light", "dark"],
		s = "(prefers-color-scheme: dark)",
		i = "u" < typeof window,
		a = t.createContext(void 0),
		o = {
			setTheme: e => {},
			themes: []
		},
		u = ["light", "dark"],
		l = ({
			forcedTheme: e,
			disableTransitionOnChange: r = !1,
			enableSystem: i = !0,
			enableColorScheme: o = !0,
			storageKey: l = "theme",
			themes: p = u,
			defaultTheme: m = i ? "system" : "light",
			attribute: y = "data-theme",
			value: g,
			children: b,
			nonce: v,
			scriptProps: w
		}) => {
			let [E, S] = t.useState(() => d(l, m)), [P, _] = t.useState(() => "system" === E ? h() : E), C = g ? Object.values(g) : p, O = t.useCallback(e => {
				let t = e;
				if (!t) return;
				"system" === e && i && (t = h());
				let s = g ? g[t] : t,
					a = r ? f(v) : null,
					u = document.documentElement,
					l = e => {
						"class" === e ? (u.classList.remove(...C), s && u.classList.add(s)) : e.startsWith("data-") && (s ? u.setAttribute(e, s) : u.removeAttribute(e))
					};
				if (Array.isArray(y) ? y.forEach(l) : l(y), o) {
					let e = n.includes(m) ? m : null,
						r = n.includes(t) ? t : e;
					u.style.colorScheme = r
				}
				null == a || a()
			}, [v]), q = t.useCallback(e => {
				let t = "function" == typeof e ? e(E) : e;
				S(t);
				try {
					localStorage.setItem(l, t)
				} catch (e) {}
			}, [E]), A = t.useCallback(t => {
				_(h(t)), "system" === E && i && !e && O("system")
			}, [E, e]);
			t.useEffect(() => {
				let e = window.matchMedia(s);
				return e.addListener(A), A(e), () => e.removeListener(A)
			}, [A]), t.useEffect(() => {
				let e = e => {
					e.key === l && (e.newValue ? S(e.newValue) : q(m))
				};
				return window.addEventListener("storage", e), () => window.removeEventListener("storage", e)
			}, [q]), t.useEffect(() => {
				O(null != e ? e : E)
			}, [e, E]);
			let k = t.useMemo(() => ({
				theme: E,
				setTheme: q,
				forcedTheme: e,
				resolvedTheme: "system" === E ? P : E,
				themes: i ? [...p, "system"] : p,
				systemTheme: i ? P : void 0
			}), [E, q, e, P, i, p]);
			return t.createElement(a.Provider, {
				value: k
			}, t.createElement(c, {
				forcedTheme: e,
				storageKey: l,
				attribute: y,
				enableSystem: i,
				enableColorScheme: o,
				defaultTheme: m,
				value: g,
				themes: p,
				nonce: v,
				scriptProps: w
			}), b)
		},
		c = t.memo(({
			forcedTheme: e,
			storageKey: n,
			attribute: s,
			enableSystem: i,
			enableColorScheme: a,
			defaultTheme: o,
			value: u,
			themes: l,
			nonce: c,
			scriptProps: d
		}) => {
			let f = JSON.stringify([s, n, o, e, l, u, i, a]).slice(1, -1);
			return t.createElement("script", {
				...d,
				suppressHydrationWarning: !0,
				nonce: "u" < typeof window ? c : "",
				dangerouslySetInnerHTML: {
					__html: `(${r.toString()})(${f})`
				}
			})
		}),
		d = (e, t) => {
			let r;
			if (!i) {
				try {
					r = localStorage.getItem(e) || void 0
				} catch (e) {}
				return r || t
			}
		},
		f = e => {
			let t = document.createElement("style");
			return e && t.setAttribute("nonce", e), t.appendChild(document.createTextNode("*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")), document.head.appendChild(t), () => {
				window.getComputedStyle(document.body), setTimeout(() => {
					document.head.removeChild(t)
				}, 1)
			}
		},
		h = e => (e || (e = window.matchMedia(s)), e.matches ? "dark" : "light");
	e.s(["J", 0, e => t.useContext(a) ? t.createElement(t.Fragment, null, e.children) : t.createElement(l, {
		...e
	}), "i", 0, () => {
		var e;
		return null != (e = t.useContext(a)) ? e : o
	}])
}, 740086, e => {
	"use strict";
	var t, r, n, s, i, a, o, u = e.i(292109),
		l = e.i(170380),
		c = (t = function(e, r) {
			return (t = Object.setPrototypeOf || ({
				__proto__: []
			}) instanceof Array && function(e, t) {
				e.__proto__ = t
			} || function(e, t) {
				for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
			})(e, r)
		}, function(e, r) {
			if ("function" != typeof r && null !== r) throw TypeError("Class extends value " + String(r) + " is not a constructor or null");

			function n() {
				this.constructor = e
			}
			t(e, r), e.prototype = null === r ? Object.create(r) : (n.prototype = r.prototype, new n)
		}),
		d = "__POSTHOG_REACT_SHARED_STATE__",
		f = "u" > typeof globalThis ? globalThis : "u" > typeof window ? window : {};
	try {
		a = f[d] = f[d] || new WeakMap
	} catch (e) {
		a = new WeakMap
	}
	a.has(l.createContext) || a.set(l.createContext, {});
	var h = a.get(l.createContext);
	h.context || (h.context = (0, l.createContext)({
		get client() {
			return o || h.defaultPostHogInstance
		},
		bootstrap: void 0
	}));
	var p = h.context,
		m = function(e) {
			return "function" == typeof e
		},
		y = function(e) {
			var t = Object.prototype.toString.call(e);
			return e instanceof Error || "[object Error]" === t || "[object Exception]" === t || "[object DOMException]" === t || "[object DOMError]" === t
		},
		g = function(e, t) {
			try {
				Object.defineProperty(e, "name", {
					value: t,
					writable: !0,
					enumerable: !0,
					configurable: !0
				})
			} catch (e) {}
		},
		b = function(e, t) {
			for (var r = new WeakSet, n = e; !r.has(n);) {
				if (r.add(n), !y(n.cause)) {
					void 0 !== n.cause && (t.cause = n.cause), n.cause = t;
					return
				}
				n = n.cause
			}
		},
		v = function(e, t) {
			if (!t) return e;
			var r = Error(y(e) ? e.message : "Primitive value captured as exception: ".concat(String(e)));
			return (g(r, "React ErrorBoundary ".concat(y(e) ? e.name : "Error")), r.stack = t, y(e)) ? (b(e, r), e) : r
		},
		w = {
			componentStack: null,
			exceptionEvent: null,
			error: null
		};
	r = i = function(e) {
		function t(t) {
			var r = e.call(this, t) || this;
			return r._resetError = function() {
				r.setState(w)
			}, r.state = w, r
		}
		return c(t, e), t.prototype.componentDidCatch = function(e, t) {
			var r, n = this.props.additionalProperties;
			m(n) ? r = n(e, t) : "object" == typeof n && (r = n);
			var s = this.context.client,
				i = t.componentStack,
				a = s.captureException(v(e, i), r);
			this.setState({
				error: e,
				componentStack: null != i ? i : null,
				exceptionEvent: a
			})
		}, t.prototype.render = function() {
			var e = this.props,
				t = e.children,
				r = e.fallback,
				n = this.state;
			if (null == n.componentStack) return m(t) ? t() : t;
			var s = m(r) ? l.default.createElement(r, {
				error: n.error,
				componentStack: n.componentStack,
				exceptionEvent: n.exceptionEvent,
				resetError: this._resetError
			}) : r;
			return l.default.isValidElement(s) ? s : (console.warn("[PostHog.js][PostHogErrorBoundary] Invalid fallback prop, provide a valid React element or a function that returns a valid React element."), l.default.createElement(l.default.Fragment, null))
		}, t
	}(l.default.Component), "symbol" == typeof(n = "PostHogErrorBoundary") && (n = n.description ? "[".concat(n.description, "]") : ""), Object.defineProperty(r, "name", {
		configurable: !0,
		value: n
	}), i.contextType = p, s = u.f, h.defaultPostHogInstance && h.defaultPostHogInstance !== o || (h.defaultPostHogInstance = s), o = s, e.s(["d", 0, function(e) {
		var t, r, n = e.children,
			s = e.client,
			i = e.apiKey,
			a = e.options,
			u = (0, l.useRef)(null),
			c = (0, l.useMemo)(function() {
				if (s) return i && console.warn("[PostHog.js] You have provided both `client` and `apiKey` to `PostHogProvider`. `apiKey` will be ignored in favour of `client`."), a && console.warn("[PostHog.js] You have provided both `client` and `options` to `PostHogProvider`. `options` will be ignored in favour of `client`."), s;
				var e = o;
				return i || console.warn("[PostHog.js] No `apiKey` or `client` were provided to `PostHogProvider`. Using default global `window.posthog` instance. You must initialize it manually. This is not recommended behavior."), e
			}, [s, i, JSON.stringify(a)]);
		return (0, l.useEffect)(function() {
			if (!s && i) {
				var e = o,
					t = u.current;
				t ? (i !== t.apiKey && console.warn("[PostHog.js] You have provided a different `apiKey` to `PostHogProvider` than the one that was already initialized. This is not supported by our provider and we'll keep using the previous key. If you need to toggle between API Keys you need to control the `client` yourself and pass it in as a prop rather than an `apiKey` prop."), a && ! function e(t, r, n) {
					if (void 0 === n && (n = new WeakMap), t === r) return !0;
					if ("object" != typeof t || null === t || "object" != typeof r || null === r) return !1;
					if (n.has(t) && n.get(t) === r) return !0;
					n.set(t, r);
					var s = Object.keys(t),
						i = Object.keys(r);
					if (s.length !== i.length) return !1;
					for (var a = 0; a < s.length; a++) {
						var o = s[a];
						if (!i.includes(o) || !e(t[o], r[o], n)) return !1
					}
					return !0
				}(a, t.options) && e.set_config(a)) : (e.__loaded && console.warn("[PostHog.js] `posthog` was already loaded elsewhere. This may cause issues."), e.init(i, a)), u.current = {
					apiKey: i,
					options: null != a ? a : {}
				}
			}
		}, [s, i, JSON.stringify(a)]), l.default.createElement(p.Provider, {
			value: {
				client: c,
				bootstrap: null != (t = null == a ? void 0 : a.bootstrap) ? t : null == (r = null == s ? void 0 : s.config) ? void 0 : r.bootstrap
			}
		}, n)
	}, "f", 0, function() {
		return (0, l.useContext)(p).client
	}])
}]);