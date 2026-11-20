(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 653970, e => {
	"use strict";
	var t = e.i(205647);
	class r extends Error {}
	async function a() {
		let e = await fetch("/api/preset-templates");
		return await (0, t.W)(e, `Request failed (${e.status})`), e.json()
	}
	async function i(e) {
		if (!e.imageUrl) return null;
		try {
			let t = await fetch(e.imageUrl);
			if (!t.ok) throw Error(String(t.status));
			let r = await t.blob(),
				a = e.imageUrl.split("/").pop() ?? e.id;
			return new File([r], a, {
				type: r.type
			})
		} catch {
			throw new r("Failed to load the template image")
		}
	}
	e.s(["p", 0, r, "h", 0, i, "L", 0, a])
}, 627859, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(232250),
		i = e.i(380491),
		n = e.i(3440);
	let l = "none";

	function s(e) {
		return (0, t.jsx)(i.T, {
			value: e.id,
			children: e.name
		}, e.id)
	}
	e.s(["f", 0, function(e) {
		let o, d, c, u, m, f, p, g, h, x, v, b, y, j, w, N = (0, r.c)(54),
			{
				folders: S,
				value: C,
				onChange: F,
				modelFamily: k,
				organizationId: z,
				visibility: P,
				disabled: _,
				idPrefix: U,
				labelAdornment: q
			} = e,
			D = void 0 !== _ && _;
		if (!k) {
			let e;
			return N[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsxs)("div", {
				className: "space-y-2",
				children: [(0, t.jsx)(a.f, {
					children: "Folder"
				}), (0, t.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Pick a model to file this preset in a folder."
				})]
			}), N[0] = e) : e = N[0], e
		}
		if (N[1] !== D || N[2] !== S || N[3] !== U || N[4] !== q || N[5] !== k || N[6] !== F || N[7] !== z || N[8] !== C || N[9] !== P) {
			let e, r, b;
			N[21] !== k || N[22] !== z || N[23] !== P ? (e = e => e.modelFamily === k && e.organizationId === z && ("private" === P || "org" === e.visibility), N[21] = k, N[22] = z, N[23] = P, N[24] = e) : e = N[24], c = (S ?? []).filter(e);
			let y = C && c.some(e => e.id === C) ? C : l;
			x = "space-y-2";
			let j = `${U}-folder`;
			N[25] !== j ? (r = (0, t.jsx)(a.f, {
				htmlFor: j,
				children: "Folder"
			}), N[25] = j, N[26] = r) : r = N[26], N[27] !== q || N[28] !== r ? (v = (0, t.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [r, q]
			}), N[27] = q, N[28] = r, N[29] = v) : v = N[29], d = i.d, f = y, N[30] !== F ? (p = e => F(e === l ? null : e), N[30] = F, N[31] = p) : p = N[31], g = D;
			let w = `${U}-folder`;
			N[32] === Symbol.for("react.memo_cache_sentinel") ? (b = (0, t.jsx)(i.U, {}), N[32] = b) : b = N[32], N[33] !== w ? (h = (0, t.jsx)(i.P, {
				id: w,
				className: "w-full",
				children: b
			}), N[33] = w, N[34] = h) : h = N[34], o = i.r, N[35] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, t.jsx)(i.T, {
				value: l,
				children: n.p
			}), N[35] = u) : u = N[35], m = c.map(s), N[1] = D, N[2] = S, N[3] = U, N[4] = q, N[5] = k, N[6] = F, N[7] = z, N[8] = C, N[9] = P, N[10] = o, N[11] = d, N[12] = c, N[13] = u, N[14] = m, N[15] = f, N[16] = p, N[17] = g, N[18] = h, N[19] = x, N[20] = v
		} else o = N[10], d = N[11], c = N[12], u = N[13], m = N[14], f = N[15], p = N[16], g = N[17], h = N[18], x = N[19], v = N[20];
		return N[36] !== o || N[37] !== u || N[38] !== m ? (b = (0, t.jsxs)(o, {
			children: [u, m]
		}), N[36] = o, N[37] = u, N[38] = m, N[39] = b) : b = N[39], N[40] !== d || N[41] !== b || N[42] !== f || N[43] !== p || N[44] !== g || N[45] !== h ? (y = (0, t.jsxs)(d, {
			value: f,
			onValueChange: p,
			disabled: g,
			children: [h, b]
		}), N[40] = d, N[41] = b, N[42] = f, N[43] = p, N[44] = g, N[45] = h, N[46] = y) : y = N[46], N[47] !== c.length ? (j = 0 === c.length && (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "No folders yet for this model — create one from the library."
		}), N[47] = c.length, N[48] = j) : j = N[48], N[49] !== y || N[50] !== j || N[51] !== x || N[52] !== v ? (w = (0, t.jsxs)("div", {
			className: x,
			children: [v, y, j]
		}), N[49] = y, N[50] = j, N[51] = x, N[52] = v, N[53] = w) : w = N[53], w
	}])
}, 2036, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(560716),
		i = e.i(61993),
		n = e.i(170380),
		l = e.i(322932),
		s = e.i(8774),
		o = e.i(932767),
		d = e.i(893603);
	e.s(["f", 0, function(e) {
		let c, u, m, f, p, g, h, x, v, b, y, j = (0, r.c)(29),
			{
				file: w,
				existingUrl: N,
				onFileChange: S,
				onClearExisting: C,
				disabled: F
			} = e,
			k = void 0 !== F && F,
			[z, P] = (0, n.useState)(null),
			[_, U] = (0, n.useState)(!1),
			q = (0, n.useRef)(null);
		j[0] !== w ? (c = () => {
			if (!w) return void P(null);
			let e = new FileReader;
			e.onloadend = () => P(e.result), e.readAsDataURL(w)
		}, u = [w], j[0] = w, j[1] = c, j[2] = u) : (c = j[1], u = j[2]), (0, n.useEffect)(c, u);
		let D = z ?? (w ? null : N ?? null),
			$ = !!(w || N);
		j[3] !== S ? (m = e => {
			let t = e.target.files?.[0];
			if (t) {
				if (!d.u.includes(t.type)) return void l.c.error("Only JPEG, PNG, and WebP images are allowed");
				if (t.size > d.D) return void l.c.error(`Image must be less than ${d.D/1024/1024}MB`);
				S(t)
			}
		}, j[3] = S, j[4] = m) : m = j[4];
		let I = m;
		j[5] !== N || j[6] !== w || j[7] !== C || j[8] !== S ? (f = () => {
			w ? S(null) : N && C?.(), q.current && (q.current.value = "")
		}, j[5] = N, j[6] = w, j[7] = C, j[8] = S, j[9] = f) : f = j[9];
		let M = f;
		return j[10] === Symbol.for("react.memo_cache_sentinel") ? (p = d.u.join(","), j[10] = p) : p = j[10], j[11] !== k ? (g = () => !k && U(!0), j[11] = k, j[12] = g) : g = j[12], j[13] === Symbol.for("react.memo_cache_sentinel") ? (h = () => U(!1), x = () => U(!1), j[13] = h, j[14] = x) : (h = j[13], x = j[14]), j[15] !== k || j[16] !== I || j[17] !== g ? (v = (0, t.jsx)(o.f, {
			ref: q,
			type: "file",
			title: "",
			"aria-label": "Upload preset image",
			accept: p,
			onChange: I,
			disabled: k,
			onDragEnter: g,
			onDragLeave: h,
			onDrop: x,
			className: "absolute inset-0 z-10 h-full cursor-pointer opacity-0 disabled:opacity-0!"
		}), j[15] = k, j[16] = I, j[17] = g, j[18] = v) : v = j[18], j[19] !== k || j[20] !== w || j[21] !== M || j[22] !== $ || j[23] !== _ || j[24] !== D ? (b = $ ? (0, t.jsxs)("div", {
			className: `group flex items-center gap-3 rounded-lg border p-2 transition-colors ${_?"border-accent bg-accent/5":"border-border bg-card"}`,
			children: [(0, t.jsx)("div", {
				className: "relative size-16 shrink-0 overflow-hidden rounded-md bg-muted",
				children: D && (0, t.jsx)("img", {
					src: D,
					alt: "Preset",
					className: "size-full object-cover"
				})
			}), (0, t.jsx)("p", {
				className: "flex-1 truncate text-xs text-muted-foreground",
				children: w ? w.name : "Current image"
			}), (0, t.jsx)(s.f, {
				type: "button",
				variant: "ghost",
				size: "icon",
				onClick: M,
				disabled: k,
				className: "z-20 size-8 shrink-0",
				children: (0, t.jsx)(i.f, {
					className: "size-4"
				})
			})]
		}) : (0, t.jsxs)("div", {
			className: `flex h-24 items-center justify-center gap-2 rounded-lg border border-dashed px-4 pointer-events-none transition-colors ${_?"border-accent bg-accent/5":k?"border-border bg-muted opacity-60":"border-border bg-card"}`,
			children: [(0, t.jsx)(a.f, {
				className: "size-4 text-muted-foreground"
			}), (0, t.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Upload an image (optional)"
			})]
		}), j[19] = k, j[20] = w, j[21] = M, j[22] = $, j[23] = _, j[24] = D, j[25] = b) : b = j[25], j[26] !== v || j[27] !== b ? (y = (0, t.jsxs)("div", {
			className: "relative",
			children: [v, b]
		}), j[26] = v, j[27] = b, j[28] = y) : y = j[28], y
	}])
}, 122638, 126165, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(253149),
		i = e.i(253662),
		n = e.i(8774),
		l = e.i(232250),
		s = e.i(76145),
		o = e.i(890850);
	e.s(["f", 0, function(e) {
		let d, c, u, m, f, p, g, h, x, v, b = (0, r.c)(34),
			{
				previewUrl: y,
				isCurrent: j,
				isGenerating: w,
				canGenerate: N,
				onGenerate: S,
				generateOnSave: C,
				onGenerateOnSaveChange: F,
				disabled: k,
				pendingGeneration: z,
				idPrefix: P,
				hintAction: _
			} = e,
			U = void 0 !== k && k,
			q = void 0 !== z && z;
		b[0] !== N || b[1] !== C || b[2] !== j || b[3] !== q || b[4] !== y ? (d = N ? q ? "A new preview is generating in the background." : j ? "Preview matches this content — saving won't spend credits." : C ? `Saving generates a new preview (~${(0,o.H)()} credit).` : y ? "Saving keeps the current preview." : "Saving without a preview." : "Add a prompt to generate a preview.", b[0] = N, b[1] = C, b[2] = j, b[3] = q, b[4] = y, b[5] = d) : d = b[5];
		let D = d,
			$ = U || w || !N;
		b[6] !== w ? (c = w ? (0, t.jsx)(a.f, {
			className: "size-4 animate-spin"
		}) : (0, t.jsx)(i.f, {
			className: "size-4"
		}), b[6] = w, b[7] = c) : c = b[7];
		let I = w ? "Generating..." : y ? "Regenerate preview" : "Generate preview";
		b[8] !== S || b[9] !== $ || b[10] !== c || b[11] !== I ? (u = (0, t.jsxs)(n.f, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: S,
			disabled: $,
			children: [c, I]
		}), b[8] = S, b[9] = $, b[10] = c, b[11] = I, b[12] = u) : u = b[12];
		let M = `${P}-generate-on-save`,
			T = U || w;
		b[13] !== C || b[14] !== F || b[15] !== M || b[16] !== T ? (m = (0, t.jsx)(s.f, {
			id: M,
			checked: C,
			onCheckedChange: F,
			disabled: T
		}), b[13] = C, b[14] = F, b[15] = M, b[16] = T, b[17] = m) : m = b[17];
		let A = `${P}-generate-on-save`;
		return b[18] !== A ? (f = (0, t.jsx)(l.f, {
			htmlFor: A,
			className: "whitespace-nowrap text-sm text-muted-foreground",
			children: "Generate on save"
		}), b[18] = A, b[19] = f) : f = b[19], b[20] !== m || b[21] !== f ? (p = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [m, f]
		}), b[20] = m, b[21] = f, b[22] = p) : p = b[22], b[23] !== p || b[24] !== u ? (g = (0, t.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [u, p]
		}), b[23] = p, b[24] = u, b[25] = g) : g = b[25], b[26] !== D ? (h = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: D
		}), b[26] = D, b[27] = h) : h = b[27], b[28] !== _ || b[29] !== h ? (x = (0, t.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [h, _]
		}), b[28] = _, b[29] = h, b[30] = x) : x = b[30], b[31] !== g || b[32] !== x ? (v = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [g, x]
		}), b[31] = g, b[32] = x, b[33] = v) : v = b[33], v
	}], 122638);
	var d = e.i(818036),
		c = e.i(55e3);
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
	let m = (0, c.f)(u);
	var f = e.i(189478),
		p = e.i(170380),
		g = e.i(221751);

	function h(e) {
		let a, i, n, l, s, o, d, c, u, h, b, y, j, w, N, S, C = (0, r.c)(35),
			{
				beforeSrc: F,
				afterSrc: k,
				alt: z
			} = e,
			[P, _] = (0, p.useState)(50);
		C[0] === Symbol.for("react.memo_cache_sentinel") ? (a = e => {
			let t = e.currentTarget.getBoundingClientRect();
			_(Math.min(100, Math.max(0, (e.clientX - t.left) / t.width * 100)))
		}, C[0] = a) : a = C[0];
		let U = a;
		C[1] !== P ? (i = Math.round(P), C[1] = P, C[2] = i) : i = C[2], C[3] === Symbol.for("react.memo_cache_sentinel") ? (n = e => {
			e.currentTarget.setPointerCapture(e.pointerId), U(e)
		}, l = e => {
			1 === e.buttons && U(e)
		}, s = e => {
			"ArrowLeft" === e.key && _(v), "ArrowRight" === e.key && _(x)
		}, C[3] = n, C[4] = l, C[5] = s) : (n = C[3], l = C[4], s = C[5]), C[6] !== k ? (o = (0, g.A)(k), C[6] = k, C[7] = o) : o = C[7], C[8] !== k || C[9] !== z || C[10] !== o ? (d = (0, t.jsx)(f.default, {
			src: k,
			alt: z,
			fill: !0,
			sizes: "400px",
			unoptimized: o,
			className: "object-cover"
		}), C[8] = k, C[9] = z, C[10] = o, C[11] = d) : d = C[11];
		let q = `inset(0 ${100-P}% 0 0)`;
		C[12] !== q ? (c = {
			clipPath: q
		}, C[12] = q, C[13] = c) : c = C[13], C[14] !== F ? (u = (0, t.jsx)(f.default, {
			src: F,
			alt: "Sample image before the preset",
			fill: !0,
			sizes: "400px",
			className: "object-cover"
		}), C[14] = F, C[15] = u) : u = C[15], C[16] !== u || C[17] !== c ? (h = (0, t.jsx)("div", {
			className: "absolute inset-0",
			style: c,
			children: u
		}), C[16] = u, C[17] = c, C[18] = h) : h = C[18];
		let D = `${P}%`;
		return C[19] !== D ? (b = {
			left: D
		}, C[19] = D, C[20] = b) : b = C[20], C[21] === Symbol.for("react.memo_cache_sentinel") ? (y = (0, t.jsx)("div", {
			className: "absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-md",
			children: (0, t.jsx)(m, {
				className: "size-4 text-muted-foreground"
			})
		}), C[21] = y) : y = C[21], C[22] !== b ? (j = (0, t.jsx)("div", {
			className: "absolute inset-y-0 w-px bg-background/80",
			style: b,
			children: y
		}), C[22] = b, C[23] = j) : j = C[23], C[24] !== P ? (w = P > 15 && (0, t.jsx)("span", {
			className: "absolute bottom-2 left-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Sample"
		}), C[24] = P, C[25] = w) : w = C[25], C[26] !== P ? (N = P < 85 && (0, t.jsx)("span", {
			className: "absolute bottom-2 right-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Preview"
		}), C[26] = P, C[27] = N) : N = C[27], C[28] !== h || C[29] !== j || C[30] !== w || C[31] !== N || C[32] !== i || C[33] !== d ? (S = (0, t.jsxs)("div", {
			role: "slider",
			"aria-label": "Compare the sample image with the generated preview",
			"aria-valuenow": i,
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			tabIndex: 0,
			className: "relative aspect-video w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg border bg-muted",
			onPointerDown: n,
			onPointerMove: l,
			onKeyDown: s,
			children: [d, h, j, w, N]
		}), C[28] = h, C[29] = j, C[30] = w, C[31] = N, C[32] = i, C[33] = d, C[34] = S) : S = C[34], S
	}

	function x(e) {
		return Math.min(100, e + 5)
	}

	function v(e) {
		return Math.max(0, e - 5)
	}
	e.s(["f", 0, function(e) {
		let a, i, n, l, s = (0, r.c)(9),
			{
				previewUrl: c,
				alt: u,
				className: m
			} = e;
		return s[0] !== m ? (a = (0, d.c)("space-y-1", m), s[0] = m, s[1] = a) : a = s[1], s[2] !== u || s[3] !== c ? (i = (0, t.jsx)(h, {
			beforeSrc: o.F,
			afterSrc: c,
			alt: u
		}), s[2] = u, s[3] = c, s[4] = i) : i = s[4], s[5] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Drag to compare the preset with the sample image."
		}), s[5] = n) : n = s[5], s[6] !== a || s[7] !== i ? (l = (0, t.jsxs)("div", {
			className: a,
			children: [i, n]
		}), s[6] = a, s[7] = i, s[8] = l) : l = s[8], l
	}], 126165)
}, 841597, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(55e3);
	let i = {
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
	i.node;
	let n = (0, a.f)(i);
	e.s(["f", 0, function(e) {
		let a, i, l, s, o = (0, r.c)(9),
			{
				prompt: d,
				compact: c
			} = e;
		if (void 0 !== c && c) {
			let e, r;
			return o[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(n, {
				className: "size-3 shrink-0 text-muted-foreground/50"
			}), o[0] = e) : e = o[0], o[1] !== d ? (r = (0, t.jsxs)("div", {
				className: "flex size-full flex-col gap-1 overflow-hidden bg-gradient-to-br from-muted/80 to-muted/20 p-2 text-left",
				children: [e, (0, t.jsx)("p", {
					className: "line-clamp-3 text-[10px] text-muted-foreground italic leading-snug",
					children: d
				})]
			}), o[1] = d, o[2] = r) : r = o[2], r
		}
		return o[3] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)(n, {
			className: "size-4 text-muted-foreground/50"
		}), o[3] = a) : a = o[3], o[4] !== d ? (i = (0, t.jsxs)("p", {
			className: "text-sm italic leading-snug text-muted-foreground line-clamp-3",
			children: ["“", d, "”"]
		}), o[4] = d, o[5] = i) : i = o[5], o[6] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("span", {
			className: "text-xs font-medium uppercase tracking-wider text-muted-foreground/60",
			children: "Prompt preset"
		}), o[6] = l) : l = o[6], o[7] !== i ? (s = (0, t.jsxs)("div", {
			className: "flex size-full flex-col justify-between gap-2 bg-gradient-to-br from-muted/80 to-muted/20 p-4",
			children: [a, i, l]
		}), o[7] = i, o[8] = s) : s = o[8], s
	}], 841597)
}, 486694, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		a = e.i(584381),
		i = e.i(619525),
		n = e.i(322932),
		l = e.i(663303),
		s = e.i(184644),
		o = e.i(3440);
	async function d() {
		return (await s.Q()).folders
	}

	function c(e) {
		n.c.error(e.message || "Failed to create folder")
	}
	async function u(e) {
		return (await s.B(e)).folder
	}

	function m(e) {
		n.c.error(e.message || "Failed to update folder")
	}

	function f(e) {
		n.c.error(e.message || "Failed to delete folder")
	}

	function p(e) {
		return s.O(e)
	}
	e.s(["z", 0, function() {
		let e, a = (0, t.c)(2),
			l = (0, i.d)();
		return a[0] !== l ? (e = {
			mutationFn: u,
			onSuccess: e => {
				n.c.success(`Folder "${e.name}" created`), l.invalidateQueries({
					queryKey: ["preset-folders"]
				})
			},
			onError: c
		}, a[0] = l, a[1] = e) : e = a[1], (0, r.f)(e)
	}, "x", 0, function() {
		let e, a = (0, t.c)(2),
			l = (0, i.d)();
		return a[0] !== l ? (e = {
			mutationFn: p,
			onSuccess: () => {
				n.c.success(`Folder deleted — its presets moved to ${o.p}`), l.invalidateQueries({
					queryKey: ["preset-folders"]
				}), l.invalidateQueries({
					queryKey: ["presets"]
				})
			},
			onError: f
		}, a[0] = l, a[1] = e) : e = a[1], (0, r.f)(e)
	}, "e", 0, function() {
		let e, r, i = (0, t.c)(5),
			{
				data: n
			} = l.i.useSession(),
			s = n?.session?.activeOrganizationId ?? "personal";
		i[0] !== s ? (e = ["preset-folders", "list", s], i[0] = s, i[1] = e) : e = i[1];
		let o = !!n?.user && !n?.user.isAnonymous;
		return i[2] !== e || i[3] !== o ? (r = {
			queryKey: e,
			queryFn: d,
			enabled: o
		}, i[2] = e, i[3] = o, i[4] = r) : r = i[4], (0, a.f)(r)
	}, "t", 0, function(e) {
		let a, n, l, o = (0, t.c)(7),
			d = (0, i.d)();
		return o[0] !== e ? (a = t => s.E(e, t), o[0] = e, o[1] = a) : a = o[1], o[2] !== d ? (n = () => {
			d.invalidateQueries({
				queryKey: ["preset-folders"]
			})
		}, o[2] = d, o[3] = n) : n = o[3], o[4] !== a || o[5] !== n ? (l = {
			mutationFn: a,
			onSuccess: n,
			onError: m
		}, o[4] = a, o[5] = n, o[6] = l) : l = o[6], (0, r.f)(l)
	}])
}, 866513, e => {
	"use strict";
	var t = e.i(170380),
		r = e.i(322932),
		a = e.i(968001),
		i = e.i(551897),
		n = e.i(410740);
	e.s(["f", 0, function({
		prompt: e,
		imageFile: l,
		existingImageUrl: s,
		seedPreviewUrl: o,
		seedSource: d,
		onImageHoisted: c,
		onGenerated: u,
		onGeneratingChange: m,
		pendingGeneration: f = !1,
		externalPreview: p = null
	}) {
		var g;
		let [h, x] = (0, t.useState)(o), [v, b] = (0, t.useState)(o ? d : null), [y, j] = (0, t.useState)(o), [w, N] = (0, t.useState)(!0), [S, C] = (0, t.useState)(!1), F = e.trim().length > 0, k = h !== y, z = k ? null : p, P = z?.url ?? h, _ = z ? z.matchesDraftBaseline : null !== h && (g = {
			prompt: e,
			imageFile: l,
			imageUrl: s
		}, !!v && v.prompt.trim() === g.prompt.trim() && v.imageFile === g.imageFile && (v.imageUrl ?? null) === (g.imageUrl ?? null)), U = async () => {
			if (!S && F) {
				C(!0), m?.(!0);
				try {
					let t = s;
					l && (t = await (0, a.f)(l, n.b), c(t));
					let r = await (0, i.f)({
						prompt: e.trim(),
						referenceImageUrl: t
					});
					x(r), b({
						prompt: e,
						imageFile: null,
						imageUrl: t
					}), u?.(r)
				} catch (e) {
					console.error("Thumbnail generation failed:", e), r.c.error(e instanceof Error ? e.message : "Preview generation failed")
				} finally {
					C(!1), m?.(!1)
				}
			}
		};
		return {
			previewUrl: P,
			isCurrent: _,
			isGenerating: S,
			canGenerate: F,
			generate: () => {
				U()
			},
			generateOnSave: w,
			setGenerateOnSave: N,
			shouldGenerateOnSave: w && F && !_ && !f,
			isDirty: k,
			commit: e => {
				x(e.previewUrl), j(e.previewUrl), b(e.previewUrl && !1 !== e.matchesSavedContent ? {
					prompt: e.prompt,
					imageFile: null,
					imageUrl: e.imageUrl
				} : null)
			},
			reset: () => {
				x(o), j(o), b(o ? d : null), N(!0)
			}
		}
	}], 866513)
}, 361367, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		a = e.i(584381),
		i = e.i(322932),
		n = e.i(663303),
		l = e.i(653970),
		s = e.i(221751),
		o = e.i(333869),
		d = e.i(410740);
	let c = e => !!(e?.startsWith("/") && !(0, s.D)(e));

	function u(e) {
		e instanceof l.p && i.c.error(e.message)
	}
	e.s(["L", 0, c, "U", 0, function() {
		let {
			data: e
		} = n.i.useSession();
		return (0, a.f)({
			queryKey: ["preset-templates", "list"],
			queryFn: async () => {
				try {
					let {
						templates: e,
						folders: t
					} = await (0, l.L)();
					return {
						templates: e,
						folders: t ?? []
					}
				} catch (e) {
					return console.error("Falling back to built-in templates:", e), {
						templates: o.V,
						folders: []
					}
				}
			},
			enabled: !!e?.user && !e?.user.isAnonymous
		})
	}, "j", 0, function() {
		let e, a = (0, t.c)(2),
			i = (0, d.d)();
		return a[0] !== i ? (e = {
			mutationFn: async e => {
				let {
					template: t,
					generateThumbnail: r
				} = e, a = c(t.imageUrl), n = a ? await (0, l.h)(t) : null;
				return i.mutateAsync({
					name: t.name,
					visibility: "private",
					prompt: t.prompt || void 0,
					imageFile: n,
					existingImageUrl: a ? void 0 : t.imageUrl,
					existingGeneratedThumbnailUrl: t.generatedThumbnailUrl,
					generateThumbnail: void 0 !== r && r && !t.generatedThumbnailUrl,
					modelFamily: t.modelFamily,
					enhance: t.enhance,
					note: `From Decart template "${t.name}"`
				})
			},
			onError: u
		}, a[0] = i, a[1] = e) : e = a[1], (0, r.f)(e)
	}])
}, 656352, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(663303);

	function a() {
		let e, a, i = (0, t.c)(5),
			{
				data: n
			} = r.i.useSession(),
			l = n?.session?.activeOrganizationId,
			{
				data: s
			} = (0, r.r)();
		i[0] !== l || i[1] !== s ? (e = l ? s?.find(e => e.id === l) : void 0, i[0] = l, i[1] = s, i[2] = e) : e = i[2];
		let o = e;
		return i[3] !== o ? (a = o ? {
			id: o.id,
			name: o.name
		} : null, i[3] = o, i[4] = a) : a = i[4], a
	}
	e.s(["m", 0, a, "I", 0, function() {
		return null !== a()
	}])
}, 3440, 299033, e => {
	"use strict";
	let t = ["lucy", "lucy-vton", "lucy-restyle"];

	function r(e, r, a) {
		let i = r.filter(e => "all" === a || e.modelFamily === a).sort((e, r) => t.indexOf(e.modelFamily) - t.indexOf(r.modelFamily) || e.name.localeCompare(r.name)).map(e => ({
				folder: e,
				items: []
			})),
			n = new Map(i.map(e => [e.folder.id, e])),
			l = [];
		for (let t of e) {
			let e = t.folderId ? n.get(t.folderId) : void 0;
			e ? e.items.push(t) : ("all" === a || t.modelFamily === a) && l.push(t)
		}
		return {
			sections: i,
			unfiled: l
		}
	}
	e.s(["p", 0, "General", "g", 0, function(e, a, {
		hideEmptyFolders: i = !1
	} = {}) {
		let n = t.map(t => {
				let {
					sections: n,
					unfiled: l
				} = r(e, a, t), s = n.filter(e => !i || e.items.length > 0).map(e => ({
					id: e.folder.id,
					name: e.folder.name,
					count: e.items.length
				}));
				return {
					family: t,
					defaultCount: l.length,
					showDefault: l.length > 0 || !i,
					folders: s,
					total: l.length + s.reduce((e, t) => e + t.count, 0)
				}
			}).filter(e => e.total > 0 || e.folders.length > 0),
			l = r(e, a, "all").unfiled.filter(e => null === e.modelFamily).length;
		return {
			total: e.length,
			families: n,
			anyModelCount: l
		}
	}, "h", 0, r, "r", 0, function(e, t, a) {
		if ("all" === a.kind) return e;
		if ("any-model" === a.kind) return r(e, t, "all").unfiled.filter(e => null === e.modelFamily);
		let {
			sections: i,
			unfiled: n
		} = r(e, t, a.family);
		return "default" === a.kind ? n : "folder" === a.kind ? i.find(e => e.folder.id === a.folderId)?.items ?? [] : [...i.flatMap(e => e.items), ...n]
	}, "l", 0, e => "folder" === e.kind ? `folder:${e.folderId}` : "family" === e.kind || "default" === e.kind ? `${e.kind}:${e.family}` : e.kind], 3440);
	var a = e.i(234984),
		i = e.i(582018),
		n = e.i(727677);
	let l = {
		lucy: "Lucy",
		"lucy-vton": "Lucy VTON",
		"lucy-restyle": "Lucy Restyle"
	};
	e.s(["C", 0, l, "q", 0, function(e) {
		let t, r = (0, i.c)(2),
			{
				family: s
			} = e;
		if (!s) return null;
		let o = l[s];
		return r[0] !== o ? (t = (0, a.jsx)(n.f, {
			variant: "outline",
			children: o
		}), r[0] = o, r[1] = t) : t = r[1], t
	}], 299033)
}, 828037, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(169497),
		i = e.i(486399),
		n = e.i(425720),
		l = e.i(885697),
		s = e.i(248697),
		o = e.i(791844),
		d = e.i(657367),
		c = e.i(196695),
		u = e.i(205643),
		m = e.i(991875),
		f = e.i(324207),
		p = e.i(904102),
		g = e.i(618600),
		h = e.i(818036),
		x = e.i(890882),
		v = e.i(567022),
		b = e.i(835755),
		y = e.i(278566),
		j = e.i(553775);

	function w(e) {
		let a, i, n, l, s = (0, r.c)(22),
			{
				modelData: o,
				values: d,
				errors: c,
				onChange: u,
				urlPageGroup: m
			} = e,
			f = (0, v.P)(m);
		if (s[0] !== c || s[1] !== o.formConfig.sections || s[2] !== o.parameters.apiParameters || s[3] !== o.parameters.quality || s[4] !== u || s[5] !== m || s[6] !== d || s[7] !== f) {
			let e, r = new Map(o.parameters.apiParameters.map(C)),
				i = o.formConfig.sections.flatMap(S).map(e => r.get(e)).filter(N);
			s[9] !== c || s[10] !== o.parameters.quality || s[11] !== u || s[12] !== m || s[13] !== d || s[14] !== f ? (e = e => {
				switch (e.type) {
					case "model-version":
						if (o.parameters.quality.length <= 1 || 0 === f.length) return null;
						return (0, t.jsx)(v.G, {
							urlPageGroup: m,
							variant: "pill"
						}, e.name);
					case "select":
						if ((e.options?.length ?? 0) <= 1) return null;
						return (0, t.jsxs)("div", {
							className: "flex min-w-0 flex-col gap-2",
							children: [(0, t.jsx)("label", {
								htmlFor: e.name,
								className: "text-muted-foreground text-xs",
								children: e.label ? e.label : e.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" ")
							}), (0, t.jsx)(y.f, {
								parameter: e,
								value: d[e.name],
								onChange: t => u(e.name, t),
								error: c[e.name],
								variant: "pill"
							})]
						}, e.name);
					case "number":
					case "integer":
						return (0, t.jsx)(x.f, {
							parameter: e,
							error: c[e.name],
							children: (0, t.jsx)(b.f, {
								parameter: e,
								value: d[e.name],
								onChange: t => u(e.name, t),
								error: c[e.name]
							})
						}, e.name);
					case "toggle":
					case "boolean":
						return (0, t.jsx)(x.f, {
							parameter: e,
							error: c[e.name],
							children: (0, t.jsx)(j.f, {
								parameter: e,
								value: d[e.name],
								onChange: t => u(e.name, t),
								error: c[e.name]
							})
						}, e.name);
					default:
						return null
				}
			}, s[9] = c, s[10] = o.parameters.quality, s[11] = u, s[12] = m, s[13] = d, s[14] = f, s[15] = e) : e = s[15];
			let n = e;
			a = i.map(n).filter(Boolean), s[0] = c, s[1] = o.formConfig.sections, s[2] = o.parameters.apiParameters, s[3] = o.parameters.quality, s[4] = u, s[5] = m, s[6] = d, s[7] = f, s[8] = a
		} else a = s[8];
		let p = a;
		if (0 === p.length) return null;
		s[16] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)("h3", {
			className: "font-medium text-cloud text-sm",
			children: "Generation settings"
		}), s[16] = i) : i = s[16];
		let g = p.length > 1 ? "grid-cols-1 @xs:grid-cols-2" : "grid-cols-1";
		return s[17] !== g ? (n = (0, h.c)("grid gap-4", g), s[17] = g, s[18] = n) : n = s[18], s[19] !== p || s[20] !== n ? (l = (0, t.jsxs)("div", {
			className: "@container flex shrink-0 flex-col gap-4",
			children: [i, (0, t.jsx)("div", {
				className: n,
				children: p
			})]
		}), s[19] = p, s[20] = n, s[21] = l) : l = s[21], l
	}

	function N(e) {
		return void 0 !== e
	}

	function S(e) {
		return e.fields
	}

	function C(e) {
		return [e.name, e]
	}
	var F = e.i(657714);

	function k(e) {
		let a, i, n, l, s, o, d, c = (0, r.c)(28),
			{
				parameter: u,
				value: f,
				onChange: p,
				disabled: g,
				disabledReason: h,
				error: x
			} = e,
			v = u.label ?? u.name,
			b = `panel-media-${u.name}`;
		c[0] !== b || c[1] !== v || c[2] !== u.description || c[3] !== u.required ? (a = (0, t.jsx)(F.f, {
			label: v,
			required: u.required,
			htmlFor: b,
			info: u.description
		}), c[0] = b, c[1] = v, c[2] = u.description, c[3] = u.required, c[4] = a) : a = c[4], c[5] !== v ? (i = v.toLowerCase(), c[5] = v, c[6] = i) : i = c[6];
		let y = `Choose ${i}`;
		return c[7] !== u.accept ? (n = (0, m.v)(u.accept), c[7] = u.accept, c[8] = n) : n = c[8], c[9] !== p ? (l = e => p(e), c[9] = p, c[10] = l) : l = c[10], c[11] !== g || c[12] !== h || c[13] !== b || c[14] !== u.allowedOrientations || c[15] !== u.skipCrop || c[16] !== y || c[17] !== n || c[18] !== l || c[19] !== f ? (s = (0, t.jsx)(m._, {
			variant: "field",
			inputId: b,
			compactLabel: y,
			compactTitle: h,
			modelInputTypes: n,
			value: f,
			onChange: l,
			disabled: g,
			allowedOrientations: u.allowedOrientations,
			skipCrop: u.skipCrop
		}), c[11] = g, c[12] = h, c[13] = b, c[14] = u.allowedOrientations, c[15] = u.skipCrop, c[16] = y, c[17] = n, c[18] = l, c[19] = f, c[20] = s) : s = c[20], c[21] !== x || c[22] !== u.name ? (o = x && (0, t.jsx)("p", {
			id: `${u.name}-error`,
			className: "text-destructive text-xs",
			children: x
		}), c[21] = x, c[22] = u.name, c[23] = o) : o = c[23], c[24] !== a || c[25] !== s || c[26] !== o ? (d = (0, t.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [a, s, o]
		}), c[24] = a, c[25] = s, c[26] = o, c[27] = d) : d = c[27], d
	}
	var z = e.i(266048),
		P = e.i(954716);
	let _ = {
		"lucy-edit-2": s.v,
		"lucy-vton": o.f,
		"lucy-restyle-v2v": l.f
	};

	function U(e) {
		return e.required
	}

	function q(e) {
		return "prompt" === e.name
	}

	function D(e) {
		return e.selectedModelKey
	}
	e.s(["BatchRailPanel", 0, function(e) {
		let l, s, o, h, x, v = (0, r.c)(26),
			{
				pageGroup: b,
				urlPageGroup: y,
				placeholderAsset: j,
				playgroundExample: N
			} = e,
			{
				isLoading: S,
				isAuthenticated: C,
				checkAuth: F
			} = (0, a.f)(),
			{
				creditCost: $
			} = (0, d.f)(),
			I = (0, c.useStudioStore)(D);
		v[0] !== I ? (l = (0, i.U)(I)?.name, v[0] = I, v[1] = l) : l = v[1];
		let M = l,
			{
				dialog: T,
				openDialog: A
			} = (0, n.f)();
		v[2] !== b ? (s = (0, i.R)(b), v[2] = b, v[3] = s) : s = v[3];
		let G = s;
		v[4] !== S || v[5] !== C ? (o = !S && C(), v[4] = S, v[5] = C, v[6] = o) : o = v[6];
		let O = o,
			R = N?.prompt,
			L = N?.inputMedia,
			E = N?.referenceImage;
		return v[7] !== F || v[8] !== $ || v[9] !== G || v[10] !== O || v[11] !== M || v[12] !== A || v[13] !== b || v[14] !== j || v[15] !== N?.outputMedia || v[16] !== T || v[17] !== y ? (h = e => {
			let {
				form: r,
				generate: a,
				applyPreset: i,
				selectedPresetId: n,
				isApplyingPreset: l,
				presetDraft: s
			} = e, {
				apiParameters: o
			} = r.modelData.parameters, d = r.modelData.formConfig.standaloneFields ?? [], c = o.find(q), u = o.filter(e => "file" === e.type && d.includes(e.name)), h = u.find(U), x = u.filter(e => e !== h), v = r.exclusionFor(h?.name ?? ""), S = "string" == typeof r.values.prompt ? r.values.prompt : "", C = r.exclusionFor("prompt"), D = !!(s.prompt.trim() || s.imageFile), I = a.isSubmitting ? "Submitting…" : a.isPolling ? "pending" === a.queueStatus ? "Queued…" : "Processing…" : a.hasSufficientCredits ? "Generate" : `Insufficient credits — this run needs ${a.totalCost}, you have ${a.userCredits}.`;
			return (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(z.f, {
					heading: "Prompt",
					headingRequired: c?.required ?? !1,
					headerAside: $ ? (0, t.jsx)(g.f, {
						creditsPerSecond: $
					}) : void 0,
					beforeInput: h ? (0, t.jsx)(k, {
						parameter: h,
						value: r.values[h.name] ?? null,
						onChange: e => r.onChange(h.name, e),
						disabled: r.disabled || v.isDisabled,
						disabledReason: v.isDisabled ? v.reason : void 0,
						error: r.errors[h.name]
					}) : void 0,
					input: (0, t.jsx)(p.z, {
						toolbarStart: x.map(e => {
							let a = r.exclusionFor(e.name);
							return (0, t.jsx)(m._, {
								variant: "chip",
								compactLabel: e.label ?? e.name,
								compactTitle: a.isDisabled ? a.reason : void 0,
								modelInputTypes: (0, m.v)(e.accept),
								value: r.values[e.name] ?? null,
								onChange: t => r.onChange(e.name, t),
								disabled: r.disabled || a.isDisabled,
								allowedOrientations: e.allowedOrientations,
								skipCrop: e.skipCrop
							}, e.name)
						}),
						toolbarEnd: (0, t.jsxs)(t.Fragment, {
							children: [(0, t.jsx)(p.y, {
								disabled: !D,
								onClick: () => {
									O ? A({
										prompt: s.prompt,
										imageFile: s.imageFile,
										modelFamily: G
									}) : F()
								}
							}), (0, t.jsx)(p.c, {
								onClick: a.run,
								disabled: a.disabled,
								isBusy: a.isSubmitting || a.isPolling,
								isAuthenticated: a.isAuthenticated,
								hint: I,
								label: "Generate"
							})]
						}),
						children: c ? (0, t.jsx)("textarea", {
							id: c.name,
							rows: 1,
							maxLength: c.maxLength,
							value: S,
							onChange: e => r.onChange("prompt", e.target.value),
							disabled: r.disabled || C.isDisabled,
							title: C.isDisabled ? C.reason : void 0,
							placeholder: C.isDisabled ? C.reason : c.placeholder,
							className: "size-full resize-none border-none bg-transparent text-base text-foreground leading-snug tracking-[0.24px] outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed md:text-sm"
						}) : null
					}),
					belowPresets: (0, t.jsx)(w, {
						modelData: r.modelData,
						values: r.values,
						errors: r.errors,
						onChange: r.onChange,
						urlPageGroup: y
					}),
					presets: (0, t.jsx)(P.f, {
						builtins: _[b] ?? [],
						family: G,
						selectedId: n,
						onSelect: i,
						onRequireAuth: F,
						disabled: l,
						modelName: M,
						surface: "batch"
					}),
					stage: (0, t.jsx)("div", {
						className: "relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-card md:aspect-video md:max-h-full md:flex-none md:rounded-panel",
						children: (0, t.jsx)(f.f, {
							placeholderAsset: j,
							exampleOutputMedia: N?.outputMedia
						})
					})
				}), T]
			})
		}, v[7] = F, v[8] = $, v[9] = G, v[10] = O, v[11] = M, v[12] = A, v[13] = b, v[14] = j, v[15] = N?.outputMedia, v[16] = T, v[17] = y, v[18] = h) : h = v[18], v[19] !== b || v[20] !== R || v[21] !== L || v[22] !== E || v[23] !== h || v[24] !== y ? (x = (0, t.jsx)(u.f, {
			pageGroup: b,
			urlPageGroup: y,
			defaultPrompt: R,
			defaultInputMedia: L,
			defaultReferenceImage: E,
			children: h
		}), v[19] = b, v[20] = R, v[21] = L, v[22] = E, v[23] = h, v[24] = y, v[25] = x) : x = v[25], x
	}], 828037)
}, 234409, function(e) {
	e.n(e.i(828037))
}, 994787, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "search",
		size: 24,
		node: [
			["path", {
				d: "m21 21-4.34-4.34",
				key: "14j7rj"
			}],
			["circle", {
				cx: "11",
				cy: "11",
				r: "8",
				key: "4ej97u"
			}]
		]
	};
	r.node;
	let a = (0, t.f)(r);
	e.s(["f", 0, a], 994787)
}]);