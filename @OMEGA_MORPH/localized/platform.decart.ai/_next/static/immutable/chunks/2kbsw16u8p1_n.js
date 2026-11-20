(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 976311, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(170380),
		l = e.i(317607),
		a = e.i(653132),
		n = e.i(82798),
		o = e.i(794371),
		s = e.i(954264),
		c = e.i(378329),
		d = e.i(661530),
		u = e.i(48150),
		m = Object.defineProperty,
		p = (e, t) => m(e, "name", {
			value: t,
			configurable: !0
		}),
		f = "Collapsible",
		[y, v] = (0, a.f)(f),
		[g, h] = y(f),
		b = i.forwardRef(p(function(e, r) {
			let {
				__scopeCollapsible: l,
				open: a,
				defaultOpen: o,
				disabled: s,
				onOpenChange: d,
				...m
			} = e, [p, y] = (0, n.f)({
				prop: a,
				defaultProp: o ?? !1,
				onChange: d,
				caller: f
			});
			return (0, t.jsx)(g, {
				scope: l,
				disabled: s,
				contentId: (0, u.f)(),
				open: p,
				onOpenToggle: i.useCallback(() => y(e => !e), [y]),
				children: (0, t.jsx)(c.V.div, {
					"data-state": L(p),
					"data-disabled": s ? "" : void 0,
					...m,
					ref: r
				})
			})
		}, "Collapsible")),
		x = i.forwardRef(p(function(e, r) {
			let {
				__scopeCollapsible: i,
				...a
			} = e, n = h("CollapsibleTrigger", i);
			return (0, t.jsx)(c.V.button, {
				type: "button",
				"aria-controls": n.open ? n.contentId : void 0,
				"aria-expanded": n.open || !1,
				"data-state": L(n.open),
				"data-disabled": n.disabled ? "" : void 0,
				disabled: n.disabled,
				...a,
				ref: r,
				onClick: (0, l.f)(e.onClick, n.onOpenToggle)
			})
		}, "CollapsibleTrigger")),
		w = "CollapsibleContent",
		j = i.forwardRef(p(function(e, r) {
			let {
				forceMount: i,
				...l
			} = e, a = h(w, e.__scopeCollapsible);
			return (0, t.jsx)(d.f, {
				present: i || a.open,
				children: ({
					present: e
				}) => (0, t.jsx)(S, {
					...l,
					ref: r,
					present: e
				})
			})
		}, "CollapsibleContent")),
		S = i.forwardRef(p(function(e, r) {
			let {
				__scopeCollapsible: l,
				present: a,
				children: n,
				...d
			} = e, u = h(w, l), [m, p] = i.useState(a), f = i.useRef(null), y = (0, s.f)(r, f), v = i.useRef(0), g = v.current, b = i.useRef(0), x = b.current, j = u.open || m, S = i.useRef(j), $ = i.useRef(void 0);
			return i.useEffect(() => {
				let e = requestAnimationFrame(() => S.current = !1);
				return () => cancelAnimationFrame(e)
			}, []), (0, o.f)(() => {
				let e = f.current;
				if (e) {
					$.current = $.current || {
						transitionDuration: e.style.transitionDuration,
						animationName: e.style.animationName
					}, e.style.transitionDuration = "0s", e.style.animationName = "none";
					let t = e.getBoundingClientRect();
					v.current = t.height, b.current = t.width, S.current || (e.style.transitionDuration = $.current.transitionDuration, e.style.animationName = $.current.animationName), p(a)
				}
			}, [u.open, a]), (0, t.jsx)(c.V.div, {
				"data-state": L(u.open),
				"data-disabled": u.disabled ? "" : void 0,
				id: u.contentId,
				hidden: !j,
				...d,
				ref: y,
				style: {
					"--radix-collapsible-content-height": g ? `${g}px` : void 0,
					"--radix-collapsible-content-width": x ? `${x}px` : void 0,
					...e.style
				},
				children: j && n
			})
		}, "CollapsibleContentImpl"));

	function L(e) {
		return e ? "open" : "closed"
	}
	p(L, "getState"), e.s(["Y", 0, function(e) {
		let i, l, a = (0, r.c)(4);
		return a[0] !== e ? ({
			...i
		} = e, a[0] = e, a[1] = i) : i = a[1], a[2] !== i ? (l = (0, t.jsx)(b, {
			"data-slot": "collapsible",
			...i
		}), a[2] = i, a[3] = l) : l = a[3], l
	}, "C", 0, function(e) {
		let i, l, a = (0, r.c)(4);
		return a[0] !== e ? ({
			...i
		} = e, a[0] = e, a[1] = i) : i = a[1], a[2] !== i ? (l = (0, t.jsx)(j, {
			"data-slot": "collapsible-content",
			...i
		}), a[2] = i, a[3] = l) : l = a[3], l
	}, "v", 0, function(e) {
		let i, l, a = (0, r.c)(4);
		return a[0] !== e ? ({
			...i
		} = e, a[0] = e, a[1] = i) : i = a[1], a[2] !== i ? (l = (0, t.jsx)(x, {
			"data-slot": "collapsible-trigger",
			...i
		}), a[2] = i, a[3] = l) : l = a[3], l
	}], 976311)
}, 267649, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(927531),
		i = e.i(663303);
	e.s(["f", 0, function() {
		let e, l, a, n, o, s, c, d, u = (0, t.c)(27),
			{
				data: m,
				refetch: p
			} = (0, i.U)(),
			f = (0, r.useRouter)(),
			y = (0, r.usePathname)(),
			v = (0, r.useSearchParams)();
		u[0] !== m ? (e = () => !(!m?.user || m.user.isAnonymous), u[0] = m, u[1] = e) : e = u[1];
		let g = e;
		u[2] !== g || u[3] !== y || u[4] !== f || u[5] !== v ? (l = () => {
			if (!g()) {
				let e = "/" !== y && "/sign-in" !== y ? y : void 0,
					t = e ? `/sign-in?returnTo=${encodeURIComponent(e)}${v.toString()?`&${v.toString()}`:""}` : `/sign-in${v.toString()?`?${v.toString()}`:""}`;
				return f.push(t), !1
			}
			return !0
		}, u[2] = g, u[3] = y, u[4] = f, u[5] = v, u[6] = l) : l = u[6];
		let h = l;
		u[7] !== h ? (a = e => (...t) => {
			if (h()) return e(...t)
		}, u[7] = h, u[8] = a) : a = u[8];
		let b = a;
		u[9] !== g || u[10] !== m?.user?.id ? (n = () => g() && m?.user?.id || null, u[9] = g, u[10] = m?.user?.id, u[11] = n) : n = u[11];
		let x = n;
		u[12] !== m?.user?.credits ? (o = () => m?.user?.credits || 0, u[12] = m?.user?.credits, u[13] = o) : o = u[13];
		let w = o;
		u[14] !== w ? (s = e => w() >= e, u[14] = w, u[15] = s) : s = u[15];
		let j = s;
		u[16] !== p ? (c = () => p({
			query: {
				disableCookieCache: !0
			}
		}), u[16] = p, u[17] = c) : c = u[17];
		let S = c;
		return u[18] !== h || u[19] !== w || u[20] !== x || u[21] !== j || u[22] !== g || u[23] !== S || u[24] !== m || u[25] !== b ? (d = {
			isAuthenticated: g,
			checkAuth: h,
			withAuthCheck: b,
			getUserId: x,
			getUserCredits: w,
			hasEnoughCredits: j,
			session: m,
			refetchUser: S
		}, u[18] = h, u[19] = w, u[20] = x, u[21] = j, u[22] = g, u[23] = S, u[24] = m, u[25] = b, u[26] = d) : d = u[26], d
	}])
}, 486399, e => {
	"use strict";
	let t = ["720p", "480p"],
		r = ["fast"],
		i = "#",
		l = "https://api.decart.ai",
		a = "wss://api.decart.ai",
		n = {
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
		o = {
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
		s = {
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
				endpoint: `${l}/v1/generate/lucy-image-2`,
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
				endpoint: `${l}/v1/jobs/lucy-restyle-2`,
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
				endpoint: `${l}/v1/jobs/lucy-2.6`,
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
				endpoint: `${l}/v1/jobs/lucy-2.5`,
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
				endpoint: `${l}/v1/jobs/lucy-2.1`,
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
				endpoint: `${l}/v1/jobs/lucy-vton-3.6`,
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
				endpoint: `${l}/v1/jobs/lucy-vton-3.5`,
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
		c = {
			"lucy-edit-live": "lucy-2.6|realtime",
			"lucy-edit-2": "lucy-2.6|batch",
			"lucy-vton": "lucy-vton-3.6|batch",
			"lucy-vton-realtime": "lucy-vton-3.6|realtime"
		},
		d = new Map(Object.entries(n).flatMap(([e, t]) => Object.values(t.surfaces).map(t => [t, e])));

	function u(e) {
		let t = [];
		for (let r of Object.values(s)) r.pageGroup === e && t.push(r);
		return t
	}
	e.s(["h", 0, n, "I", 0, o, "t", 0, r, "p", 0, {
		realtime: "Realtime",
		batch: "Batch"
	}, "P", 0, function(e, t, r) {
		return r ? e.speedCredits?.[r]?.[t] : e.credits[t]
	}, "Q", 0, function(e) {
		let t = c[e];
		if (t) return t;
		let r = u(e)[0];
		return r ? `${r.name}|${r.surface}` : void 0
	}, "a", 0, function(e) {
		return t.find(t => void 0 !== e.credits[t])
	}, "f", 0, function(e) {
		let t = 1 === u(e.pageGroup).length;
		return e.capabilities?.dropdownLabel ? e.capabilities.dropdownLabel : t ? o[e.pageGroup].title : e.versionLabel ?? o[e.pageGroup].title
	}, "H", 0, u, "R", 0, function(e) {
		return d.get(e) ?? null
	}, "U", 0, function(e) {
		return s[e]
	}, "J", 0, function(e, t) {
		return n[e].surfaces[t]
	}, "S", 0, function(e) {
		let {
			realtime: t,
			batch: r
		} = n[e].surfaces, i = t ?? r;
		if (!i) throw Error(`Model product has no surfaces: ${e}`);
		return i
	}, "d", 0, function(e) {
		return r.filter(t => e.speedCredits?.[t] !== void 0)
	}, "s", 0, function(e) {
		return ["realtime", "batch"].filter(t => n[e].surfaces[t])
	}])
}, 653970, e => {
	"use strict";
	var t = e.i(205647);
	class r extends Error {}
	async function i() {
		let e = await fetch("/api/preset-templates");
		return await (0, t.W)(e, `Request failed (${e.status})`), e.json()
	}
	async function l(e) {
		if (!e.imageUrl) return null;
		try {
			let t = await fetch(e.imageUrl);
			if (!t.ok) throw Error(String(t.status));
			let r = await t.blob(),
				i = e.imageUrl.split("/").pop() ?? e.id;
			return new File([r], i, {
				type: r.type
			})
		} catch {
			throw new r("Failed to load the template image")
		}
	}
	e.s(["p", 0, r, "h", 0, l, "L", 0, i])
}, 627859, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(232250),
		l = e.i(380491),
		a = e.i(3440);
	let n = "none";

	function o(e) {
		return (0, t.jsx)(l.T, {
			value: e.id,
			children: e.name
		}, e.id)
	}
	e.s(["f", 0, function(e) {
		let s, c, d, u, m, p, f, y, v, g, h, b, x, w, j, S = (0, r.c)(54),
			{
				folders: L,
				value: $,
				onChange: U,
				modelFamily: N,
				organizationId: C,
				visibility: k,
				disabled: F,
				idPrefix: R,
				labelAdornment: D
			} = e,
			I = void 0 !== F && F;
		if (!N) {
			let e;
			return S[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsxs)("div", {
				className: "space-y-2",
				children: [(0, t.jsx)(i.f, {
					children: "Folder"
				}), (0, t.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Pick a model to file this preset in a folder."
				})]
			}), S[0] = e) : e = S[0], e
		}
		if (S[1] !== I || S[2] !== L || S[3] !== R || S[4] !== D || S[5] !== N || S[6] !== U || S[7] !== C || S[8] !== $ || S[9] !== k) {
			let e, r, b;
			S[21] !== N || S[22] !== C || S[23] !== k ? (e = e => e.modelFamily === N && e.organizationId === C && ("private" === k || "org" === e.visibility), S[21] = N, S[22] = C, S[23] = k, S[24] = e) : e = S[24], d = (L ?? []).filter(e);
			let x = $ && d.some(e => e.id === $) ? $ : n;
			g = "space-y-2";
			let w = `${R}-folder`;
			S[25] !== w ? (r = (0, t.jsx)(i.f, {
				htmlFor: w,
				children: "Folder"
			}), S[25] = w, S[26] = r) : r = S[26], S[27] !== D || S[28] !== r ? (h = (0, t.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [r, D]
			}), S[27] = D, S[28] = r, S[29] = h) : h = S[29], c = l.d, p = x, S[30] !== U ? (f = e => U(e === n ? null : e), S[30] = U, S[31] = f) : f = S[31], y = I;
			let j = `${R}-folder`;
			S[32] === Symbol.for("react.memo_cache_sentinel") ? (b = (0, t.jsx)(l.U, {}), S[32] = b) : b = S[32], S[33] !== j ? (v = (0, t.jsx)(l.P, {
				id: j,
				className: "w-full",
				children: b
			}), S[33] = j, S[34] = v) : v = S[34], s = l.r, S[35] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, t.jsx)(l.T, {
				value: n,
				children: a.p
			}), S[35] = u) : u = S[35], m = d.map(o), S[1] = I, S[2] = L, S[3] = R, S[4] = D, S[5] = N, S[6] = U, S[7] = C, S[8] = $, S[9] = k, S[10] = s, S[11] = c, S[12] = d, S[13] = u, S[14] = m, S[15] = p, S[16] = f, S[17] = y, S[18] = v, S[19] = g, S[20] = h
		} else s = S[10], c = S[11], d = S[12], u = S[13], m = S[14], p = S[15], f = S[16], y = S[17], v = S[18], g = S[19], h = S[20];
		return S[36] !== s || S[37] !== u || S[38] !== m ? (b = (0, t.jsxs)(s, {
			children: [u, m]
		}), S[36] = s, S[37] = u, S[38] = m, S[39] = b) : b = S[39], S[40] !== c || S[41] !== b || S[42] !== p || S[43] !== f || S[44] !== y || S[45] !== v ? (x = (0, t.jsxs)(c, {
			value: p,
			onValueChange: f,
			disabled: y,
			children: [v, b]
		}), S[40] = c, S[41] = b, S[42] = p, S[43] = f, S[44] = y, S[45] = v, S[46] = x) : x = S[46], S[47] !== d.length ? (w = 0 === d.length && (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "No folders yet for this model — create one from the library."
		}), S[47] = d.length, S[48] = w) : w = S[48], S[49] !== x || S[50] !== w || S[51] !== g || S[52] !== h ? (j = (0, t.jsxs)("div", {
			className: g,
			children: [h, x, w]
		}), S[49] = x, S[50] = w, S[51] = g, S[52] = h, S[53] = j) : j = S[53], j
	}])
}, 2036, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(560716),
		l = e.i(61993),
		a = e.i(170380),
		n = e.i(322932),
		o = e.i(8774),
		s = e.i(932767),
		c = e.i(893603);
	e.s(["f", 0, function(e) {
		let d, u, m, p, f, y, v, g, h, b, x, w = (0, r.c)(29),
			{
				file: j,
				existingUrl: S,
				onFileChange: L,
				onClearExisting: $,
				disabled: U
			} = e,
			N = void 0 !== U && U,
			[C, k] = (0, a.useState)(null),
			[F, R] = (0, a.useState)(!1),
			D = (0, a.useRef)(null);
		w[0] !== j ? (d = () => {
			if (!j) return void k(null);
			let e = new FileReader;
			e.onloadend = () => k(e.result), e.readAsDataURL(j)
		}, u = [j], w[0] = j, w[1] = d, w[2] = u) : (d = w[1], u = w[2]), (0, a.useEffect)(d, u);
		let I = C ?? (j ? null : S ?? null),
			T = !!(j || S);
		w[3] !== L ? (m = e => {
			let t = e.target.files?.[0];
			if (t) {
				if (!c.u.includes(t.type)) return void n.c.error("Only JPEG, PNG, and WebP images are allowed");
				if (t.size > c.D) return void n.c.error(`Image must be less than ${c.D/1024/1024}MB`);
				L(t)
			}
		}, w[3] = L, w[4] = m) : m = w[4];
		let O = m;
		w[5] !== S || w[6] !== j || w[7] !== $ || w[8] !== L ? (p = () => {
			j ? L(null) : S && $?.(), D.current && (D.current.value = "")
		}, w[5] = S, w[6] = j, w[7] = $, w[8] = L, w[9] = p) : p = w[9];
		let _ = p;
		return w[10] === Symbol.for("react.memo_cache_sentinel") ? (f = c.u.join(","), w[10] = f) : f = w[10], w[11] !== N ? (y = () => !N && R(!0), w[11] = N, w[12] = y) : y = w[12], w[13] === Symbol.for("react.memo_cache_sentinel") ? (v = () => R(!1), g = () => R(!1), w[13] = v, w[14] = g) : (v = w[13], g = w[14]), w[15] !== N || w[16] !== O || w[17] !== y ? (h = (0, t.jsx)(s.f, {
			ref: D,
			type: "file",
			title: "",
			"aria-label": "Upload preset image",
			accept: f,
			onChange: O,
			disabled: N,
			onDragEnter: y,
			onDragLeave: v,
			onDrop: g,
			className: "absolute inset-0 z-10 h-full cursor-pointer opacity-0 disabled:opacity-0!"
		}), w[15] = N, w[16] = O, w[17] = y, w[18] = h) : h = w[18], w[19] !== N || w[20] !== j || w[21] !== _ || w[22] !== T || w[23] !== F || w[24] !== I ? (b = T ? (0, t.jsxs)("div", {
			className: `group flex items-center gap-3 rounded-lg border p-2 transition-colors ${F?"border-accent bg-accent/5":"border-border bg-card"}`,
			children: [(0, t.jsx)("div", {
				className: "relative size-16 shrink-0 overflow-hidden rounded-md bg-muted",
				children: I && (0, t.jsx)("img", {
					src: I,
					alt: "Preset",
					className: "size-full object-cover"
				})
			}), (0, t.jsx)("p", {
				className: "flex-1 truncate text-xs text-muted-foreground",
				children: j ? j.name : "Current image"
			}), (0, t.jsx)(o.f, {
				type: "button",
				variant: "ghost",
				size: "icon",
				onClick: _,
				disabled: N,
				className: "z-20 size-8 shrink-0",
				children: (0, t.jsx)(l.f, {
					className: "size-4"
				})
			})]
		}) : (0, t.jsxs)("div", {
			className: `flex h-24 items-center justify-center gap-2 rounded-lg border border-dashed px-4 pointer-events-none transition-colors ${F?"border-accent bg-accent/5":N?"border-border bg-muted opacity-60":"border-border bg-card"}`,
			children: [(0, t.jsx)(i.f, {
				className: "size-4 text-muted-foreground"
			}), (0, t.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Upload an image (optional)"
			})]
		}), w[19] = N, w[20] = j, w[21] = _, w[22] = T, w[23] = F, w[24] = I, w[25] = b) : b = w[25], w[26] !== h || w[27] !== b ? (x = (0, t.jsxs)("div", {
			className: "relative",
			children: [h, b]
		}), w[26] = h, w[27] = b, w[28] = x) : x = w[28], x
	}])
}, 122638, 126165, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(253149),
		l = e.i(253662),
		a = e.i(8774),
		n = e.i(232250),
		o = e.i(76145),
		s = e.i(890850);
	e.s(["f", 0, function(e) {
		let c, d, u, m, p, f, y, v, g, h, b = (0, r.c)(34),
			{
				previewUrl: x,
				isCurrent: w,
				isGenerating: j,
				canGenerate: S,
				onGenerate: L,
				generateOnSave: $,
				onGenerateOnSaveChange: U,
				disabled: N,
				pendingGeneration: C,
				idPrefix: k,
				hintAction: F
			} = e,
			R = void 0 !== N && N,
			D = void 0 !== C && C;
		b[0] !== S || b[1] !== $ || b[2] !== w || b[3] !== D || b[4] !== x ? (c = S ? D ? "A new preview is generating in the background." : w ? "Preview matches this content — saving won't spend credits." : $ ? `Saving generates a new preview (~${(0,s.H)()} credit).` : x ? "Saving keeps the current preview." : "Saving without a preview." : "Add a prompt to generate a preview.", b[0] = S, b[1] = $, b[2] = w, b[3] = D, b[4] = x, b[5] = c) : c = b[5];
		let I = c,
			T = R || j || !S;
		b[6] !== j ? (d = j ? (0, t.jsx)(i.f, {
			className: "size-4 animate-spin"
		}) : (0, t.jsx)(l.f, {
			className: "size-4"
		}), b[6] = j, b[7] = d) : d = b[7];
		let O = j ? "Generating..." : x ? "Regenerate preview" : "Generate preview";
		b[8] !== L || b[9] !== T || b[10] !== d || b[11] !== O ? (u = (0, t.jsxs)(a.f, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: L,
			disabled: T,
			children: [d, O]
		}), b[8] = L, b[9] = T, b[10] = d, b[11] = O, b[12] = u) : u = b[12];
		let _ = `${k}-generate-on-save`,
			P = R || j;
		b[13] !== $ || b[14] !== U || b[15] !== _ || b[16] !== P ? (m = (0, t.jsx)(o.f, {
			id: _,
			checked: $,
			onCheckedChange: U,
			disabled: P
		}), b[13] = $, b[14] = U, b[15] = _, b[16] = P, b[17] = m) : m = b[17];
		let z = `${k}-generate-on-save`;
		return b[18] !== z ? (p = (0, t.jsx)(n.f, {
			htmlFor: z,
			className: "whitespace-nowrap text-sm text-muted-foreground",
			children: "Generate on save"
		}), b[18] = z, b[19] = p) : p = b[19], b[20] !== m || b[21] !== p ? (f = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [m, p]
		}), b[20] = m, b[21] = p, b[22] = f) : f = b[22], b[23] !== f || b[24] !== u ? (y = (0, t.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [u, f]
		}), b[23] = f, b[24] = u, b[25] = y) : y = b[25], b[26] !== I ? (v = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: I
		}), b[26] = I, b[27] = v) : v = b[27], b[28] !== F || b[29] !== v ? (g = (0, t.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [v, F]
		}), b[28] = F, b[29] = v, b[30] = g) : g = b[30], b[31] !== y || b[32] !== g ? (h = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [y, g]
		}), b[31] = y, b[32] = g, b[33] = h) : h = b[33], h
	}], 122638);
	var c = e.i(818036),
		d = e.i(55e3);
	let u = {
		name: "chevrons-left-right",
		size: 24,
		node: [
			["path", {
				d: "m9 7-5 5 5 5",
				key: "j5w590"
			}],
			["path", {
				d: "m15 7 5 5-5 5",
				key: "1bl6da"
			}]
		]
	};
	u.node;
	let m = (0, d.f)(u);
	var p = e.i(189478),
		f = e.i(170380),
		y = e.i(221751);

	function v(e) {
		let i, l, a, n, o, s, c, d, u, v, b, x, w, j, S, L, $ = (0, r.c)(35),
			{
				beforeSrc: U,
				afterSrc: N,
				alt: C
			} = e,
			[k, F] = (0, f.useState)(50);
		$[0] === Symbol.for("react.memo_cache_sentinel") ? (i = e => {
			let t = e.currentTarget.getBoundingClientRect();
			F(Math.min(100, Math.max(0, (e.clientX - t.left) / t.width * 100)))
		}, $[0] = i) : i = $[0];
		let R = i;
		$[1] !== k ? (l = Math.round(k), $[1] = k, $[2] = l) : l = $[2], $[3] === Symbol.for("react.memo_cache_sentinel") ? (a = e => {
			e.currentTarget.setPointerCapture(e.pointerId), R(e)
		}, n = e => {
			1 === e.buttons && R(e)
		}, o = e => {
			"ArrowLeft" === e.key && F(h), "ArrowRight" === e.key && F(g)
		}, $[3] = a, $[4] = n, $[5] = o) : (a = $[3], n = $[4], o = $[5]), $[6] !== N ? (s = (0, y.A)(N), $[6] = N, $[7] = s) : s = $[7], $[8] !== N || $[9] !== C || $[10] !== s ? (c = (0, t.jsx)(p.default, {
			src: N,
			alt: C,
			fill: !0,
			sizes: "400px",
			unoptimized: s,
			className: "object-cover"
		}), $[8] = N, $[9] = C, $[10] = s, $[11] = c) : c = $[11];
		let D = `inset(0 ${100-k}% 0 0)`;
		$[12] !== D ? (d = {
			clipPath: D
		}, $[12] = D, $[13] = d) : d = $[13], $[14] !== U ? (u = (0, t.jsx)(p.default, {
			src: U,
			alt: "Sample image before the preset",
			fill: !0,
			sizes: "400px",
			className: "object-cover"
		}), $[14] = U, $[15] = u) : u = $[15], $[16] !== u || $[17] !== d ? (v = (0, t.jsx)("div", {
			className: "absolute inset-0",
			style: d,
			children: u
		}), $[16] = u, $[17] = d, $[18] = v) : v = $[18];
		let I = `${k}%`;
		return $[19] !== I ? (b = {
			left: I
		}, $[19] = I, $[20] = b) : b = $[20], $[21] === Symbol.for("react.memo_cache_sentinel") ? (x = (0, t.jsx)("div", {
			className: "absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-md",
			children: (0, t.jsx)(m, {
				className: "size-4 text-muted-foreground"
			})
		}), $[21] = x) : x = $[21], $[22] !== b ? (w = (0, t.jsx)("div", {
			className: "absolute inset-y-0 w-px bg-background/80",
			style: b,
			children: x
		}), $[22] = b, $[23] = w) : w = $[23], $[24] !== k ? (j = k > 15 && (0, t.jsx)("span", {
			className: "absolute bottom-2 left-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Sample"
		}), $[24] = k, $[25] = j) : j = $[25], $[26] !== k ? (S = k < 85 && (0, t.jsx)("span", {
			className: "absolute bottom-2 right-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Preview"
		}), $[26] = k, $[27] = S) : S = $[27], $[28] !== v || $[29] !== w || $[30] !== j || $[31] !== S || $[32] !== l || $[33] !== c ? (L = (0, t.jsxs)("div", {
			role: "slider",
			"aria-label": "Compare the sample image with the generated preview",
			"aria-valuenow": l,
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			tabIndex: 0,
			className: "relative aspect-video w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg border bg-muted",
			onPointerDown: a,
			onPointerMove: n,
			onKeyDown: o,
			children: [c, v, w, j, S]
		}), $[28] = v, $[29] = w, $[30] = j, $[31] = S, $[32] = l, $[33] = c, $[34] = L) : L = $[34], L
	}

	function g(e) {
		return Math.min(100, e + 5)
	}

	function h(e) {
		return Math.max(0, e - 5)
	}
	e.s(["f", 0, function(e) {
		let i, l, a, n, o = (0, r.c)(9),
			{
				previewUrl: d,
				alt: u,
				className: m
			} = e;
		return o[0] !== m ? (i = (0, c.c)("space-y-1", m), o[0] = m, o[1] = i) : i = o[1], o[2] !== u || o[3] !== d ? (l = (0, t.jsx)(v, {
			beforeSrc: s.F,
			afterSrc: d,
			alt: u
		}), o[2] = u, o[3] = d, o[4] = l) : l = o[4], o[5] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Drag to compare the preset with the sample image."
		}), o[5] = a) : a = o[5], o[6] !== i || o[7] !== l ? (n = (0, t.jsxs)("div", {
			className: i,
			children: [l, a]
		}), o[6] = i, o[7] = l, o[8] = n) : n = o[8], n
	}], 126165)
}, 841597, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(55e3);
	let l = {
		name: "quote",
		size: 24,
		node: [
			["path", {
				d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
				key: "rib7q0"
			}],
			["path", {
				d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z",
				key: "1ymkrd"
			}]
		]
	};
	l.node;
	let a = (0, i.f)(l);
	e.s(["f", 0, function(e) {
		let i, l, n, o, s = (0, r.c)(9),
			{
				prompt: c,
				compact: d
			} = e;
		if (void 0 !== d && d) {
			let e, r;
			return s[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(a, {
				className: "size-3 shrink-0 text-muted-foreground/50"
			}), s[0] = e) : e = s[0], s[1] !== c ? (r = (0, t.jsxs)("div", {
				className: "flex size-full flex-col gap-1 overflow-hidden bg-gradient-to-br from-muted/80 to-muted/20 p-2 text-left",
				children: [e, (0, t.jsx)("p", {
					className: "line-clamp-3 text-[10px] text-muted-foreground italic leading-snug",
					children: c
				})]
			}), s[1] = c, s[2] = r) : r = s[2], r
		}
		return s[3] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(a, {
			className: "size-4 text-muted-foreground/50"
		}), s[3] = i) : i = s[3], s[4] !== c ? (l = (0, t.jsxs)("p", {
			className: "text-sm italic leading-snug text-muted-foreground line-clamp-3",
			children: ["“", c, "”"]
		}), s[4] = c, s[5] = l) : l = s[5], s[6] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)("span", {
			className: "text-xs font-medium uppercase tracking-wider text-muted-foreground/60",
			children: "Prompt preset"
		}), s[6] = n) : n = s[6], s[7] !== l ? (o = (0, t.jsxs)("div", {
			className: "flex size-full flex-col justify-between gap-2 bg-gradient-to-br from-muted/80 to-muted/20 p-4",
			children: [i, l, n]
		}), s[7] = l, s[8] = o) : o = s[8], o
	}], 841597)
}, 486694, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		i = e.i(584381),
		l = e.i(619525),
		a = e.i(322932),
		n = e.i(663303),
		o = e.i(184644),
		s = e.i(3440);
	async function c() {
		return (await o.Q()).folders
	}

	function d(e) {
		a.c.error(e.message || "Failed to create folder")
	}
	async function u(e) {
		return (await o.B(e)).folder
	}

	function m(e) {
		a.c.error(e.message || "Failed to update folder")
	}

	function p(e) {
		a.c.error(e.message || "Failed to delete folder")
	}

	function f(e) {
		return o.O(e)
	}
	e.s(["z", 0, function() {
		let e, i = (0, t.c)(2),
			n = (0, l.d)();
		return i[0] !== n ? (e = {
			mutationFn: u,
			onSuccess: e => {
				a.c.success(`Folder "${e.name}" created`), n.invalidateQueries({
					queryKey: ["preset-folders"]
				})
			},
			onError: d
		}, i[0] = n, i[1] = e) : e = i[1], (0, r.f)(e)
	}, "x", 0, function() {
		let e, i = (0, t.c)(2),
			n = (0, l.d)();
		return i[0] !== n ? (e = {
			mutationFn: f,
			onSuccess: () => {
				a.c.success(`Folder deleted — its presets moved to ${s.p}`), n.invalidateQueries({
					queryKey: ["preset-folders"]
				}), n.invalidateQueries({
					queryKey: ["presets"]
				})
			},
			onError: p
		}, i[0] = n, i[1] = e) : e = i[1], (0, r.f)(e)
	}, "e", 0, function() {
		let e, r, l = (0, t.c)(5),
			{
				data: a
			} = n.i.useSession(),
			o = a?.session?.activeOrganizationId ?? "personal";
		l[0] !== o ? (e = ["preset-folders", "list", o], l[0] = o, l[1] = e) : e = l[1];
		let s = !!a?.user && !a?.user.isAnonymous;
		return l[2] !== e || l[3] !== s ? (r = {
			queryKey: e,
			queryFn: c,
			enabled: s
		}, l[2] = e, l[3] = s, l[4] = r) : r = l[4], (0, i.f)(r)
	}, "t", 0, function(e) {
		let i, a, n, s = (0, t.c)(7),
			c = (0, l.d)();
		return s[0] !== e ? (i = t => o.E(e, t), s[0] = e, s[1] = i) : i = s[1], s[2] !== c ? (a = () => {
			c.invalidateQueries({
				queryKey: ["preset-folders"]
			})
		}, s[2] = c, s[3] = a) : a = s[3], s[4] !== i || s[5] !== a ? (n = {
			mutationFn: i,
			onSuccess: a,
			onError: m
		}, s[4] = i, s[5] = a, s[6] = n) : n = s[6], (0, r.f)(n)
	}])
}, 866513, e => {
	"use strict";
	var t = e.i(170380),
		r = e.i(322932),
		i = e.i(968001),
		l = e.i(551897),
		a = e.i(410740);
	e.s(["f", 0, function({
		prompt: e,
		imageFile: n,
		existingImageUrl: o,
		seedPreviewUrl: s,
		seedSource: c,
		onImageHoisted: d,
		onGenerated: u,
		onGeneratingChange: m,
		pendingGeneration: p = !1,
		externalPreview: f = null
	}) {
		var y;
		let [v, g] = (0, t.useState)(s), [h, b] = (0, t.useState)(s ? c : null), [x, w] = (0, t.useState)(s), [j, S] = (0, t.useState)(!0), [L, $] = (0, t.useState)(!1), U = e.trim().length > 0, N = v !== x, C = N ? null : f, k = C?.url ?? v, F = C ? C.matchesDraftBaseline : null !== v && (y = {
			prompt: e,
			imageFile: n,
			imageUrl: o
		}, !!h && h.prompt.trim() === y.prompt.trim() && h.imageFile === y.imageFile && (h.imageUrl ?? null) === (y.imageUrl ?? null)), R = async () => {
			if (!L && U) {
				$(!0), m?.(!0);
				try {
					let t = o;
					n && (t = await (0, i.f)(n, a.b), d(t));
					let r = await (0, l.f)({
						prompt: e.trim(),
						referenceImageUrl: t
					});
					g(r), b({
						prompt: e,
						imageFile: null,
						imageUrl: t
					}), u?.(r)
				} catch (e) {
					console.error("Thumbnail generation failed:", e), r.c.error(e instanceof Error ? e.message : "Preview generation failed")
				} finally {
					$(!1), m?.(!1)
				}
			}
		};
		return {
			previewUrl: k,
			isCurrent: F,
			isGenerating: L,
			canGenerate: U,
			generate: () => {
				R()
			},
			generateOnSave: j,
			setGenerateOnSave: S,
			shouldGenerateOnSave: j && U && !F && !p,
			isDirty: N,
			commit: e => {
				g(e.previewUrl), w(e.previewUrl), b(e.previewUrl && !1 !== e.matchesSavedContent ? {
					prompt: e.prompt,
					imageFile: null,
					imageUrl: e.imageUrl
				} : null)
			},
			reset: () => {
				g(s), w(s), b(s ? c : null), S(!0)
			}
		}
	}], 866513)
}, 361367, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		i = e.i(584381),
		l = e.i(322932),
		a = e.i(663303),
		n = e.i(653970),
		o = e.i(221751),
		s = e.i(333869),
		c = e.i(410740);
	let d = e => !!(e?.startsWith("/") && !(0, o.D)(e));

	function u(e) {
		e instanceof n.p && l.c.error(e.message)
	}
	e.s(["L", 0, d, "U", 0, function() {
		let {
			data: e
		} = a.i.useSession();
		return (0, i.f)({
			queryKey: ["preset-templates", "list"],
			queryFn: async () => {
				try {
					let {
						templates: e,
						folders: t
					} = await (0, n.L)();
					return {
						templates: e,
						folders: t ?? []
					}
				} catch (e) {
					return console.error("Falling back to built-in templates:", e), {
						templates: s.V,
						folders: []
					}
				}
			},
			enabled: !!e?.user && !e?.user.isAnonymous
		})
	}, "j", 0, function() {
		let e, i = (0, t.c)(2),
			l = (0, c.d)();
		return i[0] !== l ? (e = {
			mutationFn: async e => {
				let {
					template: t,
					generateThumbnail: r
				} = e, i = d(t.imageUrl), a = i ? await (0, n.h)(t) : null;
				return l.mutateAsync({
					name: t.name,
					visibility: "private",
					prompt: t.prompt || void 0,
					imageFile: a,
					existingImageUrl: i ? void 0 : t.imageUrl,
					existingGeneratedThumbnailUrl: t.generatedThumbnailUrl,
					generateThumbnail: void 0 !== r && r && !t.generatedThumbnailUrl,
					modelFamily: t.modelFamily,
					enhance: t.enhance,
					note: `From Decart template "${t.name}"`
				})
			},
			onError: u
		}, i[0] = l, i[1] = e) : e = i[1], (0, r.f)(e)
	}])
}, 656352, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(663303);

	function i() {
		let e, i, l = (0, t.c)(5),
			{
				data: a
			} = r.i.useSession(),
			n = a?.session?.activeOrganizationId,
			{
				data: o
			} = (0, r.r)();
		l[0] !== n || l[1] !== o ? (e = n ? o?.find(e => e.id === n) : void 0, l[0] = n, l[1] = o, l[2] = e) : e = l[2];
		let s = e;
		return l[3] !== s ? (i = s ? {
			id: s.id,
			name: s.name
		} : null, l[3] = s, l[4] = i) : i = l[4], i
	}
	e.s(["m", 0, i, "I", 0, function() {
		return null !== i()
	}])
}, 3440, 299033, e => {
	"use strict";
	let t = ["lucy", "lucy-vton", "lucy-restyle"];

	function r(e, r, i) {
		let l = r.filter(e => "all" === i || e.modelFamily === i).sort((e, r) => t.indexOf(e.modelFamily) - t.indexOf(r.modelFamily) || e.name.localeCompare(r.name)).map(e => ({
				folder: e,
				items: []
			})),
			a = new Map(l.map(e => [e.folder.id, e])),
			n = [];
		for (let t of e) {
			let e = t.folderId ? a.get(t.folderId) : void 0;
			e ? e.items.push(t) : ("all" === i || t.modelFamily === i) && n.push(t)
		}
		return {
			sections: l,
			unfiled: n
		}
	}
	e.s(["p", 0, "General", "g", 0, function(e, i, {
		hideEmptyFolders: l = !1
	} = {}) {
		let a = t.map(t => {
				let {
					sections: a,
					unfiled: n
				} = r(e, i, t), o = a.filter(e => !l || e.items.length > 0).map(e => ({
					id: e.folder.id,
					name: e.folder.name,
					count: e.items.length
				}));
				return {
					family: t,
					defaultCount: n.length,
					showDefault: n.length > 0 || !l,
					folders: o,
					total: n.length + o.reduce((e, t) => e + t.count, 0)
				}
			}).filter(e => e.total > 0 || e.folders.length > 0),
			n = r(e, i, "all").unfiled.filter(e => null === e.modelFamily).length;
		return {
			total: e.length,
			families: a,
			anyModelCount: n
		}
	}, "h", 0, r, "r", 0, function(e, t, i) {
		if ("all" === i.kind) return e;
		if ("any-model" === i.kind) return r(e, t, "all").unfiled.filter(e => null === e.modelFamily);
		let {
			sections: l,
			unfiled: a
		} = r(e, t, i.family);
		return "default" === i.kind ? a : "folder" === i.kind ? l.find(e => e.folder.id === i.folderId)?.items ?? [] : [...l.flatMap(e => e.items), ...a]
	}, "l", 0, e => "folder" === e.kind ? `folder:${e.folderId}` : "family" === e.kind || "default" === e.kind ? `${e.kind}:${e.family}` : e.kind], 3440);
	var i = e.i(234984),
		l = e.i(582018),
		a = e.i(727677);
	let n = {
		lucy: "Lucy",
		"lucy-vton": "Lucy VTON",
		"lucy-restyle": "Lucy Restyle"
	};
	e.s(["C", 0, n, "q", 0, function(e) {
		let t, r = (0, l.c)(2),
			{
				family: o
			} = e;
		if (!o) return null;
		let s = n[o];
		return r[0] !== s ? (t = (0, i.jsx)(a.f, {
			variant: "outline",
			children: s
		}), r[0] = s, r[1] = t) : t = r[1], t
	}], 299033)
}, 196695, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(170380),
		i = e.i(868496),
		l = e.i(540675);
	let a = {
			selectedModelKey: "lucy-image-2|batch",
			selectedResolution: "720p",
			fastMode: !1,
			prompt: "",
			studioOutput: null,
			uploadedImage: null,
			uploadedMediaFile: null,
			isDrawing: !1,
			isGenerating: !1,
			showExampleOutput: !0,
			queueJobId: null,
			queueStatus: null,
			uploadedVideoDuration: null,
			jobStartTime: null,
			generationId: null,
			feedback: null,
			isRealtimeConnected: !1,
			isRealtimeConnecting: !1
		},
		n = (0, r.createContext)(null);
	e.s(["StudioStoreProvider", 0, ({
		children: e,
		initState: i
	}) => {
		let o = (0, r.useRef)(null);
		return o.current || (o.current = ((e = a) => (0, l.f)()(t => ({
			...e,
			setSelectedModelKey: e => t(t => t.selectedModelKey === e ? {} : {
				selectedModelKey: e,
				fastMode: !1
			}),
			setSelectedResolution: e => t({
				selectedResolution: e
			}),
			setFastMode: e => t({
				fastMode: e
			}),
			setPrompt: e => t({
				prompt: e
			}),
			setStudioOutput: e => t({
				studioOutput: e
			}),
			setUploadedImage: e => t({
				uploadedImage: e
			}),
			setUploadedMediaFile: e => t({
				uploadedMediaFile: e
			}),
			setIsDrawing: e => t({
				isDrawing: e
			}),
			setIsGenerating: e => t({
				isGenerating: e
			}),
			setShowExampleOutput: e => t({
				showExampleOutput: e
			}),
			setQueueJobId: e => t({
				queueJobId: e
			}),
			setQueueStatus: e => t({
				queueStatus: e
			}),
			clearQueueState: () => t({
				queueJobId: null,
				queueStatus: null
			}),
			setUploadedVideoDuration: e => t({
				uploadedVideoDuration: e
			}),
			setJobStartTime: e => t({
				jobStartTime: e
			}),
			clearProgressState: () => t({
				uploadedVideoDuration: null,
				jobStartTime: null
			}),
			setGenerationId: e => t({
				generationId: e,
				feedback: null
			}),
			setFeedback: e => t({
				feedback: e
			}),
			setIsRealtimeConnected: e => t({
				isRealtimeConnected: e
			}),
			setIsRealtimeConnecting: e => t({
				isRealtimeConnecting: e
			})
		})))({
			...a,
			...i
		})), (0, t.jsx)(n.Provider, {
			value: o.current,
			children: e
		})
	}, "useStudioStore", 0, e => {
		let t = (0, r.useContext)(n);
		if (!t) throw Error("useStudioStore must be used within StudioStoreProvider");
		return (0, i.f)(t, e)
	}], 196695)
}, 473368, e => {
	e.q("../media/frame-metadata-worker.01oh17o59vk6p.js")
}, 253662, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "refresh-cw",
		size: 24,
		node: [
			["path", {
				d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
				key: "v9h5vc"
			}],
			["path", {
				d: "M21 3v5h-5",
				key: "1q7to0"
			}],
			["path", {
				d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
				key: "3uifl3"
			}],
			["path", {
				d: "M8 16H3v5",
				key: "1cv678"
			}]
		]
	};
	r.node;
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 253662)
}]);