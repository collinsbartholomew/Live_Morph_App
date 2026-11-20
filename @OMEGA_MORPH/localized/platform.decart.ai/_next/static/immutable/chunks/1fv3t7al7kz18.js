(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 120384, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(818036);
	e.s(["N", 0, function(e) {
		let o, a, l, n, c = (0, r.c)(8);
		return c[0] !== e ? ({
			className: o,
			...a
		} = e, c[0] = e, c[1] = o, c[2] = a) : (o = c[1], a = c[2]), c[3] !== o ? (l = (0, i.c)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", o), c[3] = o, c[4] = l) : l = c[4], c[5] !== a || c[6] !== l ? (n = (0, t.jsx)("div", {
			"data-slot": "card",
			className: l,
			...a
		}), c[5] = a, c[6] = l, c[7] = n) : n = c[7], n
	}, "O", 0, function(e) {
		let o, a, l, n, c = (0, r.c)(8);
		return c[0] !== e ? ({
			className: o,
			...a
		} = e, c[0] = e, c[1] = o, c[2] = a) : (o = c[1], a = c[2]), c[3] !== o ? (l = (0, i.c)("px-6", o), c[3] = o, c[4] = l) : l = c[4], c[5] !== a || c[6] !== l ? (n = (0, t.jsx)("div", {
			"data-slot": "card-content",
			className: l,
			...a
		}), c[5] = a, c[6] = l, c[7] = n) : n = c[7], n
	}])
}, 76145, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(170380),
		o = e.i(317607),
		a = e.i(954264),
		l = e.i(653132),
		n = e.i(82798),
		c = e.i(931986),
		s = e.i(378329),
		u = Object.defineProperty,
		d = (e, t) => u(e, "name", {
			value: t,
			configurable: !0
		}),
		p = "Switch",
		[y, m] = (0, l.f)(p),
		[v, f] = y(p);

	function g(e) {
		let {
			__scopeSwitch: r,
			checked: o,
			children: a,
			defaultChecked: l,
			disabled: c,
			form: s,
			name: u,
			onCheckedChange: d,
			required: y,
			value: m = "on",
			internal_do_not_use_render: f
		} = e, [g, h] = (0, n.f)({
			prop: o,
			defaultProp: l ?? !1,
			onChange: d,
			caller: p
		}), [b, w] = i.useState(null), [L, x] = i.useState(null), [$, j] = i.useState(null), S = !b || !!s || !!b.closest("form"), T = {
			checked: g,
			setChecked: h,
			disabled: c,
			control: b,
			setControl: w,
			name: u,
			form: s,
			value: m,
			userClick: $,
			onUserClick: j,
			required: y,
			defaultChecked: l,
			isFormControl: S,
			bubbleInput: L,
			setBubbleInput: x
		};
		return (0, t.jsx)(v, {
			scope: r,
			...T,
			children: k(f) ? f(T) : a
		})
	}
	d(g, "SwitchProvider");
	var h = i.forwardRef(d(function({
			__scopeSwitch: e,
			onClick: r,
			...l
		}, n) {
			let {
				control: c,
				form: u,
				value: p,
				disabled: y,
				checked: m,
				required: v,
				setControl: g,
				setChecked: h,
				onUserClick: b,
				isFormControl: w,
				bubbleInput: L
			} = f("SwitchTrigger", e), k = (0, a.f)(n, g), $ = i.useRef(m);
			return i.useEffect(() => {
				let e = u ? c?.ownerDocument.getElementById(u) : c?.form;
				if (e instanceof HTMLFormElement) {
					let t = d(() => h($.current), "reset");
					return e.addEventListener("reset", t), () => e.removeEventListener("reset", t)
				}
			}, [c, u, h]), (0, t.jsx)(s.V.button, {
				type: "button",
				role: "switch",
				"aria-checked": m,
				"aria-required": v,
				"data-state": x(m),
				"data-disabled": y ? "" : void 0,
				disabled: y,
				value: p,
				...l,
				ref: k,
				onClick: (0, o.f)(r, e => {
					let t = e.isPropagationStopped();
					b({
						requestedChecked: !m,
						hasConsumerStoppedPropagation: t
					}), h(e => !e), L && w && !t && e.stopPropagation()
				})
			})
		}, "SwitchTrigger")),
		b = i.forwardRef(d(function(e, r) {
			let {
				__scopeSwitch: i,
				name: o,
				checked: a,
				defaultChecked: l,
				required: n,
				disabled: c,
				value: s,
				onCheckedChange: u,
				form: d,
				...p
			} = e;
			return (0, t.jsx)(g, {
				__scopeSwitch: i,
				checked: a,
				defaultChecked: l,
				disabled: c,
				required: n,
				onCheckedChange: u,
				name: o,
				form: d,
				value: s,
				internal_do_not_use_render: ({
					isFormControl: e
				}) => (0, t.jsxs)(t.Fragment, {
					children: [(0, t.jsx)(h, {
						...p,
						ref: r,
						__scopeSwitch: i
					}), e && (0, t.jsx)(L, {
						__scopeSwitch: i
					})]
				})
			})
		}, "Switch")),
		w = i.forwardRef(d(function(e, r) {
			let {
				__scopeSwitch: i,
				...o
			} = e, a = f("SwitchThumb", i);
			return (0, t.jsx)(s.V.span, {
				"data-state": x(a.checked),
				"data-disabled": a.disabled ? "" : void 0,
				...o,
				ref: r
			})
		}, "SwitchThumb")),
		L = i.forwardRef(d(function({
			__scopeSwitch: e,
			onClick: r,
			...l
		}, n) {
			let {
				control: u,
				userClick: d,
				checked: p,
				defaultChecked: y,
				required: m,
				disabled: v,
				name: g,
				value: h,
				form: b,
				bubbleInput: w,
				setBubbleInput: L
			} = f("SwitchBubbleInput", e), k = (0, a.f)(n, L), x = (0, c.f)(u), $ = i.useRef(!1), j = i.useRef(p), S = i.useRef(d), T = i.useRef(null);
			i.useEffect(() => {
				if (!w) return;
				let e = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "checked").set;
				if (!e) return;
				let t = j.current !== p;
				j.current = p;
				let r = null !== d && d !== S.current;
				if (S.current = d, r) T.current = t ? null : d, t && e.call(w, p), w.dispatchEvent(new Event("click", {
					bubbles: !d.hasConsumerStoppedPropagation
				}));
				else if (t) {
					let t = T.current;
					T.current = null;
					let r = t?.requestedChecked === p;
					$.current = !0, e.call(w, p), w.dispatchEvent(new Event("click", {
						bubbles: !(r && t.hasConsumerStoppedPropagation)
					})), $.current = !1
				}
			}, [w, p, d]);
			let U = i.useRef(p);
			return (0, t.jsx)(s.V.input, {
				type: "checkbox",
				"aria-hidden": !0,
				defaultChecked: y ?? U.current,
				required: m,
				disabled: v,
				name: g,
				value: h,
				form: b,
				...l,
				tabIndex: -1,
				ref: k,
				onClick: (0, o.f)(r, e => {
					$.current && e.stopPropagation()
				}),
				style: {
					...l.style,
					...x,
					position: "absolute",
					pointerEvents: "none",
					opacity: 0,
					margin: 0,
					transform: "translateX(-100%)"
				}
			})
		}, "SwitchBubbleInput"));

	function k(e) {
		return "function" == typeof e
	}

	function x(e) {
		return e ? "checked" : "unchecked"
	}
	d(k, "isFunction"), d(x, "getState");
	var $ = e.i(818036);
	e.s(["f", 0, function(e) {
		let i, o, a, l, n, c = (0, r.c)(9);
		return c[0] !== e ? ({
			className: i,
			...o
		} = e, c[0] = e, c[1] = i, c[2] = o) : (i = c[1], o = c[2]), c[3] !== i ? (a = (0, $.c)("peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50", i), c[3] = i, c[4] = a) : a = c[4], c[5] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)(w, {
			"data-slot": "switch-thumb",
			className: (0, $.c)("bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0")
		}), c[5] = l) : l = c[5], c[6] !== o || c[7] !== a ? (n = (0, t.jsx)(b, {
			"data-slot": "switch",
			className: a,
			...o,
			children: l
		}), c[6] = o, c[7] = a, c[8] = n) : n = c[8], n
	}], 76145)
}, 267649, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(927531),
		i = e.i(663303);
	e.s(["f", 0, function() {
		let e, o, a, l, n, c, s, u, d = (0, t.c)(27),
			{
				data: p,
				refetch: y
			} = (0, i.U)(),
			m = (0, r.useRouter)(),
			v = (0, r.usePathname)(),
			f = (0, r.useSearchParams)();
		d[0] !== p ? (e = () => !(!p?.user || p.user.isAnonymous), d[0] = p, d[1] = e) : e = d[1];
		let g = e;
		d[2] !== g || d[3] !== v || d[4] !== m || d[5] !== f ? (o = () => {
			if (!g()) {
				let e = "/" !== v && "/sign-in" !== v ? v : void 0,
					t = e ? `/sign-in?returnTo=${encodeURIComponent(e)}${f.toString()?`&${f.toString()}`:""}` : `/sign-in${f.toString()?`?${f.toString()}`:""}`;
				return m.push(t), !1
			}
			return !0
		}, d[2] = g, d[3] = v, d[4] = m, d[5] = f, d[6] = o) : o = d[6];
		let h = o;
		d[7] !== h ? (a = e => (...t) => {
			if (h()) return e(...t)
		}, d[7] = h, d[8] = a) : a = d[8];
		let b = a;
		d[9] !== g || d[10] !== p?.user?.id ? (l = () => g() && p?.user?.id || null, d[9] = g, d[10] = p?.user?.id, d[11] = l) : l = d[11];
		let w = l;
		d[12] !== p?.user?.credits ? (n = () => p?.user?.credits || 0, d[12] = p?.user?.credits, d[13] = n) : n = d[13];
		let L = n;
		d[14] !== L ? (c = e => L() >= e, d[14] = L, d[15] = c) : c = d[15];
		let k = c;
		d[16] !== y ? (s = () => y({
			query: {
				disableCookieCache: !0
			}
		}), d[16] = y, d[17] = s) : s = d[17];
		let x = s;
		return d[18] !== h || d[19] !== L || d[20] !== w || d[21] !== k || d[22] !== g || d[23] !== x || d[24] !== p || d[25] !== b ? (u = {
			isAuthenticated: g,
			checkAuth: h,
			withAuthCheck: b,
			getUserId: w,
			getUserCredits: L,
			hasEnoughCredits: k,
			session: p,
			refetchUser: x
		}, d[18] = h, d[19] = L, d[20] = w, d[21] = k, d[22] = g, d[23] = x, d[24] = p, d[25] = b, d[26] = u) : u = d[26], u
	}])
}, 527511, e => {
	"use strict";
	e.s(["t", 0, "decart:last-checkout-plan", "a", 0, 100, "_", 0, 30, "Z", 0, [7, 14, 30, 45, 60], "f", 0, 2e8, "O", 0, 1e6, "M", 0, 1, "b", 0, [{
		id: "starter",
		name: "Starter",
		tagline: "Try the API",
		credits: 1e3,
		priceId: "price_1S7u1ZLTB8uy1caJ4TaRfcKK",
		price: 10,
		selected: !1,
		popular: !1
	}, {
		id: "medium",
		name: "Creator",
		tagline: "Solo video projects",
		credits: 5e3,
		priceId: "price_1S7wS1LTB8uy1caJEsGBiD6K",
		price: 50,
		selected: !1,
		popular: !1
	}, {
		id: "large",
		name: "Pro",
		tagline: "Run a small app in production",
		credits: 1e4,
		priceId: "price_1S7wPILTB8uy1caJ0U8jvzZV",
		price: 100,
		selected: !0,
		popular: !0
	}, {
		id: "xlarge",
		name: "Scale",
		tagline: "Production traffic, several streams",
		credits: 5e4,
		priceId: "price_1S8JWNLTB8uy1caJjEhnntpr",
		price: 500,
		selected: !1,
		popular: !1
	}], "m", 0, 5e3, "c", 0, 501, "Q", 0, "custom"])
}, 486399, e => {
	"use strict";
	let t = ["720p", "480p"],
		r = ["fast"],
		i = "#",
		o = "https://api.decart.ai",
		a = "wss://api.decart.ai",
		l = {
			lucy: {
				title: "Lucy",
				description: "Edit video with controlled, targeted prompts",
				surfaces: {
					realtime: "lucy-edit-live",
					batch: "lucy-edit-2"
				}
			},
			"lucy-vton": {
				title: "Lucy Virtual Try-On",
				description: "Dress subjects with a prompt or a garment reference image",
				surfaces: {
					realtime: "lucy-vton-realtime",
					batch: "lucy-vton"
				}
			},
			"lucy-restyle": {
				title: "Lucy Restyle",
				description: "Restyle video with text prompts",
				surfaces: {
					realtime: "lucy-restyle-live",
					batch: "lucy-restyle-v2v"
				}
			}
		},
		n = {
			"lucy-image-edit": {
				title: "Lucy Image",
				description: "Lucy Image edits images with text prompts and reference images.",
				placeholderAsset: "../../../../placeholder/lucid/LucidEdit.jpg",
				docsUrl: `${i}/models/image/image-editing`,
				surface: "batch"
			},
			"lucy-edit-live": {
				title: "Lucy",
				description: "Edit video in realtime with controlled, targeted prompts",
				placeholderAsset: "#",
				docsUrl: `${i}/models/realtime/lucy-2.6`,
				surface: "realtime",
				homepage: {
					name: "Lucy",
					description: "Live video editing",
					image: "../../../../homepage/lucy-edit.webm",
					icon: "../../../../icons/models/v2/lucy-edit-live.svg",
					hoverIcon: "../../../../icons/models/v2/lucy-edit-live-hover.svg",
					href: "/models/lucy",
					isVideo: !0,
					poster: "../../../../homepage/single-frame/lucy-edit.avif"
				}
			},
			"lucy-restyle-live": {
				title: "Lucy Restyle",
				description: "Restyle video in realtime",
				placeholderAsset: "#",
				docsUrl: `${i}/models/realtime/video-restyling`,
				surface: "realtime",
				homepage: {
					name: "Restyle",
					description: "Video restyling",
					image: "../../../../homepage/lucy-restyle.webm",
					icon: "../../../../icons/models/v2/lucy-restyle-live.svg",
					hoverIcon: "../../../../icons/models/v2/lucy-restyle-live-hover.svg",
					href: "/models/lucy-restyle",
					isVideo: !0,
					poster: "../../../../homepage/single-frame/lucy-restyle.avif"
				}
			},
			"lucy-restyle-v2v": {
				title: "Lucy Restyle",
				description: "Long-Form Video Restyling",
				placeholderAsset: "#",
				docsUrl: `${i}/models/video/video-restyling`,
				iconKey: "lucy-restyle-live",
				surface: "batch"
			},
			"lucy-edit-2": {
				title: "Lucy",
				description: "Long-Form Video Editing",
				placeholderAsset: "#",
				docsUrl: `${i}/models/video/video-editing`,
				iconKey: "lucy-edit-live",
				surface: "batch"
			},
			"lucy-vton": {
				title: "Lucy Virtual Try-On",
				description: "Dress subjects in long-form video using a prompt or a garment reference image",
				placeholderAsset: "#",
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				iconKey: "lucy-vton-live",
				surface: "batch"
			},
			"lucy-vton-realtime": {
				title: "Lucy Virtual Try-On",
				description: "Dress subjects live with a prompt or a garment reference image",
				placeholderAsset: "#",
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				iconKey: "lucy-vton-live",
				surface: "realtime",
				homepage: {
					name: "Virtual Try-On",
					description: "Garment swap",
					image: "../../../../homepage/lucy-vton.webm",
					icon: "../../../../icons/models/v2/lucy-vton-live.svg",
					hoverIcon: "../../../../icons/models/v2/lucy-vton-live-hover.svg",
					href: "/models/lucy-vton",
					isVideo: !0,
					poster: "../../../../homepage/single-frame/lucy-vton.avif"
				}
			}
		},
		c = {
			"lucy-image-2|batch": {
				name: "lucy-image-2",
				surface: "batch",
				output: "image",
				pageGroup: "lucy-image-edit",
				generationKind: "process",
				credits: {
					"480p": 1,
					"720p": 2
				},
				endpoint: `${o}/v1/generate/lucy-image-2`,
				docsUrl: `${i}/api-reference/lucy-image-2`
			},
			"lucy-restyle-2|batch": {
				name: "lucy-restyle-2",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-restyle-v2v",
				generationKind: "queue",
				credits: {
					"720p": 1
				},
				endpoint: `${o}/v1/jobs/lucy-restyle-2`,
				docsUrl: `${i}/api-reference/lucy-restyle-2`
			},
			"lucy-2.6|batch": {
				name: "lucy-2.6",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-edit-2",
				generationKind: "queue",
				credits: {
					"720p": 4
				},
				endpoint: `${o}/v1/jobs/lucy-2.6`,
				docsUrl: `${i}/api-reference/lucy-26`,
				versionLabel: "2.6",
				capabilities: {
					dropdownLabel: "Lucy 2.6",
					dropdownDescription: "Latest long video editing"
				}
			},
			"lucy-2.5|batch": {
				name: "lucy-2.5",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-edit-2",
				generationKind: "queue",
				credits: {
					"720p": 4
				},
				endpoint: `${o}/v1/jobs/lucy-2.5`,
				docsUrl: `${i}/api-reference/lucy-21`,
				versionLabel: "2.5",
				capabilities: {
					dropdownLabel: "Lucy 2.5",
					dropdownDescription: "Previous-generation long video editing (Lucy 2.5)"
				}
			},
			"lucy-2.1|batch": {
				name: "lucy-2.1",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-edit-2",
				generationKind: "queue",
				credits: {
					"720p": 4
				},
				endpoint: `${o}/v1/jobs/lucy-2.1`,
				docsUrl: `${i}/api-reference/lucy-21`,
				versionLabel: "2.1",
				capabilities: {
					dropdownLabel: "Lucy 2.1",
					dropdownDescription: "Previous-generation long video editing"
				}
			},
			"lucy-vton-3.6|batch": {
				name: "lucy-vton-3.6",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-vton",
				generationKind: "queue",
				credits: {
					"720p": 4
				},
				endpoint: `${o}/v1/jobs/lucy-vton-3.6`,
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				versionLabel: "Virtual Try-On 3.6",
				capabilities: {
					dropdownLabel: "Lucy Virtual Try-On 3.6",
					dropdownDescription: "Latest virtual try-on"
				}
			},
			"lucy-vton-3.5|batch": {
				name: "lucy-vton-3.5",
				surface: "batch",
				output: "video",
				pageGroup: "lucy-vton",
				generationKind: "queue",
				credits: {
					"720p": 4
				},
				endpoint: `${o}/v1/jobs/lucy-vton-3.5`,
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				versionLabel: "Virtual Try-On 3.5",
				capabilities: {
					dropdownLabel: "Lucy Virtual Try-On 3.5",
					dropdownDescription: "Previous-generation virtual try-on"
				}
			},
			"lucy-restyle-2|realtime": {
				name: "lucy-restyle-2",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-restyle-live",
				generationKind: "stream",
				credits: {
					"720p": 1
				},
				endpoint: `${a}/v1/stream?model=lucy-restyle-2`,
				docsUrl: `${i}/models/realtime/video-restyling`
			},
			"lucy-2.6|realtime": {
				name: "lucy-2.6",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-edit-live",
				generationKind: "stream",
				credits: {
					"720p": 2
				},
				speedCredits: {
					fast: {
						"720p": 4
					}
				},
				endpoint: `${a}/v1/stream?model=lucy-2.6`,
				docsUrl: `${i}/models/realtime/lucy-2.6`,
				versionLabel: "2.6",
				capabilities: {
					dropdownLabel: "Lucy 2.6",
					dropdownDescription: "Latest quality with reference image support"
				}
			},
			"lucy-2.5|realtime": {
				name: "lucy-2.5",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-edit-live",
				generationKind: "stream",
				credits: {
					"720p": 2
				},
				speedCredits: {
					fast: {
						"720p": 4
					}
				},
				endpoint: `${a}/v1/stream?model=lucy-2.5`,
				docsUrl: `${i}/models/realtime/lucy-2.5`,
				versionLabel: "2.5",
				capabilities: {
					dropdownLabel: "Lucy 2.5",
					dropdownDescription: "Previous-generation quality with reference image support"
				}
			},
			"lucy-2.1|realtime": {
				name: "lucy-2.1",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-edit-live",
				generationKind: "stream",
				credits: {
					"720p": 2
				},
				endpoint: `${a}/v1/stream?model=lucy-2.1`,
				docsUrl: `${i}/models/realtime/lucy-2.1`,
				versionLabel: "2.1",
				capabilities: {
					dropdownLabel: "Lucy 2.1",
					dropdownDescription: "Previous-generation video editing"
				}
			},
			"lucy-vton-3.6|realtime": {
				name: "lucy-vton-3.6",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-vton-realtime",
				generationKind: "stream",
				credits: {
					"720p": 2
				},
				speedCredits: {
					fast: {
						"720p": 4
					}
				},
				endpoint: `${a}/v1/stream?model=lucy-vton-3.6`,
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				versionLabel: "Virtual Try-On 3.6",
				capabilities: {
					dropdownLabel: "Lucy Virtual Try-On 3.6",
					dropdownDescription: "Latest virtual try-on"
				}
			},
			"lucy-vton-3.5|realtime": {
				name: "lucy-vton-3.5",
				surface: "realtime",
				output: "video",
				pageGroup: "lucy-vton-realtime",
				generationKind: "stream",
				credits: {
					"720p": 2
				},
				speedCredits: {
					fast: {
						"720p": 4
					}
				},
				endpoint: `${a}/v1/stream?model=lucy-vton-3.5`,
				docsUrl: `${i}/models/realtime/virtual-try-on`,
				versionLabel: "Virtual Try-On 3.5",
				capabilities: {
					dropdownLabel: "Lucy Virtual Try-On 3.5",
					dropdownDescription: "Previous-generation virtual try-on"
				}
			}
		},
		s = {
			"lucy-edit-live": "lucy-2.6|realtime",
			"lucy-edit-2": "lucy-2.6|batch",
			"lucy-vton": "lucy-vton-3.6|batch",
			"lucy-vton-realtime": "lucy-vton-3.6|realtime"
		},
		u = new Map(Object.entries(l).flatMap(([e, t]) => Object.values(t.surfaces).map(t => [t, e])));

	function d(e) {
		let t = [];
		for (let r of Object.values(c)) r.pageGroup === e && t.push(r);
		return t
	}
	e.s(["h", 0, l, "I", 0, n, "t", 0, r, "p", 0, {
		realtime: "Realtime",
		batch: "Batch"
	}, "P", 0, function(e, t, r) {
		return r ? e.speedCredits?.[r]?.[t] : e.credits[t]
	}, "Q", 0, function(e) {
		let t = s[e];
		if (t) return t;
		let r = d(e)[0];
		return r ? `${r.name}|${r.surface}` : void 0
	}, "a", 0, function(e) {
		return t.find(t => void 0 !== e.credits[t])
	}, "f", 0, function(e) {
		let t = 1 === d(e.pageGroup).length;
		return e.capabilities?.dropdownLabel ? e.capabilities.dropdownLabel : t ? n[e.pageGroup].title : e.versionLabel ?? n[e.pageGroup].title
	}, "H", 0, d, "R", 0, function(e) {
		return u.get(e) ?? null
	}, "U", 0, function(e) {
		return c[e]
	}, "J", 0, function(e, t) {
		return l[e].surfaces[t]
	}, "S", 0, function(e) {
		let {
			realtime: t,
			batch: r
		} = l[e].surfaces, i = t ?? r;
		if (!i) throw Error(`Model product has no surfaces: ${e}`);
		return i
	}, "d", 0, function(e) {
		return r.filter(t => e.speedCredits?.[t] !== void 0)
	}, "s", 0, function(e) {
		return ["realtime", "batch"].filter(t => l[e].surfaces[t])
	}])
}, 892602, e => {
	"use strict";
	var t = e.i(818036);
	e.s(["f", 0, function(e) {
		return (0, t.K)(e)
	}])
}, 267729, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "arrow-right",
		size: 24,
		node: [
			["path", {
				d: "M5 12h14",
				key: "1ays0h"
			}],
			["path", {
				d: "m12 5 7 7-7 7",
				key: "xquz4c"
			}]
		]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 267729)
}, 278396, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "circle-check",
		size: 24,
		node: [
			["circle", {
				cx: "12",
				cy: "12",
				r: "10",
				key: "1mglay"
			}],
			["path", {
				d: "m16 9-5.5 5.5L8 12",
				key: "xofnsj"
			}]
		],
		aliases: ["check-circle-2"]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 278396)
}, 870505, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "clock",
		size: 24,
		node: [
			["circle", {
				cx: "12",
				cy: "12",
				r: "10",
				key: "1mglay"
			}],
			["path", {
				d: "M12 6v6l4 2",
				key: "mmk7yg"
			}]
		]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 870505)
}, 195907, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "copy",
		size: 24,
		node: [
			["rect", {
				width: "14",
				height: "14",
				x: "8",
				y: "8",
				rx: "2",
				ry: "2",
				key: "17jyea"
			}],
			["path", {
				d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
				key: "zix9uf"
			}]
		]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 195907)
}, 207196, 785156, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "external-link",
		size: 24,
		node: [
			["path", {
				d: "M15 3h6v6",
				key: "1q9fwt"
			}],
			["path", {
				d: "M10 14 21 3",
				key: "gplh6r"
			}],
			["path", {
				d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
				key: "a6xqqp"
			}]
		]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 785156), e.s(["f", 0, i], 207196)
}]);