(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 653970, e => {
	"use strict";
	var t = e.i(205647);
	class r extends Error {}
	async function i() {
		let e = await fetch("/api/preset-templates");
		return await (0, t.W)(e, `Request failed (${e.status})`), e.json()
	}
	async function a(e) {
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
	e.s(["p", 0, r, "h", 0, a, "L", 0, i])
}, 627859, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(232250),
		a = e.i(380491),
		l = e.i(3440);
	let n = "none";

	function s(e) {
		return (0, t.jsx)(a.T, {
			value: e.id,
			children: e.name
		}, e.id)
	}
	e.s(["f", 0, function(e) {
		let o, d, c, u, m, f, p, h, g, x, v, y, b, j, w, N = (0, r.c)(54),
			{
				folders: k,
				value: S,
				onChange: F,
				modelFamily: z,
				organizationId: U,
				visibility: _,
				disabled: $,
				idPrefix: C,
				labelAdornment: P
			} = e,
			T = void 0 !== $ && $;
		if (!z) {
			let e;
			return N[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsxs)("div", {
				className: "space-y-2",
				children: [(0, t.jsx)(i.f, {
					children: "Folder"
				}), (0, t.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Pick a model to file this preset in a folder."
				})]
			}), N[0] = e) : e = N[0], e
		}
		if (N[1] !== T || N[2] !== k || N[3] !== C || N[4] !== P || N[5] !== z || N[6] !== F || N[7] !== U || N[8] !== S || N[9] !== _) {
			let e, r, y;
			N[21] !== z || N[22] !== U || N[23] !== _ ? (e = e => e.modelFamily === z && e.organizationId === U && ("private" === _ || "org" === e.visibility), N[21] = z, N[22] = U, N[23] = _, N[24] = e) : e = N[24], c = (k ?? []).filter(e);
			let b = S && c.some(e => e.id === S) ? S : n;
			x = "space-y-2";
			let j = `${C}-folder`;
			N[25] !== j ? (r = (0, t.jsx)(i.f, {
				htmlFor: j,
				children: "Folder"
			}), N[25] = j, N[26] = r) : r = N[26], N[27] !== P || N[28] !== r ? (v = (0, t.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [r, P]
			}), N[27] = P, N[28] = r, N[29] = v) : v = N[29], d = a.d, f = b, N[30] !== F ? (p = e => F(e === n ? null : e), N[30] = F, N[31] = p) : p = N[31], h = T;
			let w = `${C}-folder`;
			N[32] === Symbol.for("react.memo_cache_sentinel") ? (y = (0, t.jsx)(a.U, {}), N[32] = y) : y = N[32], N[33] !== w ? (g = (0, t.jsx)(a.P, {
				id: w,
				className: "w-full",
				children: y
			}), N[33] = w, N[34] = g) : g = N[34], o = a.r, N[35] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, t.jsx)(a.T, {
				value: n,
				children: l.p
			}), N[35] = u) : u = N[35], m = c.map(s), N[1] = T, N[2] = k, N[3] = C, N[4] = P, N[5] = z, N[6] = F, N[7] = U, N[8] = S, N[9] = _, N[10] = o, N[11] = d, N[12] = c, N[13] = u, N[14] = m, N[15] = f, N[16] = p, N[17] = h, N[18] = g, N[19] = x, N[20] = v
		} else o = N[10], d = N[11], c = N[12], u = N[13], m = N[14], f = N[15], p = N[16], h = N[17], g = N[18], x = N[19], v = N[20];
		return N[36] !== o || N[37] !== u || N[38] !== m ? (y = (0, t.jsxs)(o, {
			children: [u, m]
		}), N[36] = o, N[37] = u, N[38] = m, N[39] = y) : y = N[39], N[40] !== d || N[41] !== y || N[42] !== f || N[43] !== p || N[44] !== h || N[45] !== g ? (b = (0, t.jsxs)(d, {
			value: f,
			onValueChange: p,
			disabled: h,
			children: [g, y]
		}), N[40] = d, N[41] = y, N[42] = f, N[43] = p, N[44] = h, N[45] = g, N[46] = b) : b = N[46], N[47] !== c.length ? (j = 0 === c.length && (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "No folders yet for this model — create one from the library."
		}), N[47] = c.length, N[48] = j) : j = N[48], N[49] !== b || N[50] !== j || N[51] !== x || N[52] !== v ? (w = (0, t.jsxs)("div", {
			className: x,
			children: [v, b, j]
		}), N[49] = b, N[50] = j, N[51] = x, N[52] = v, N[53] = w) : w = N[53], w
	}])
}, 2036, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(560716),
		a = e.i(61993),
		l = e.i(170380),
		n = e.i(322932),
		s = e.i(8774),
		o = e.i(932767),
		d = e.i(893603);
	e.s(["f", 0, function(e) {
		let c, u, m, f, p, h, g, x, v, y, b, j = (0, r.c)(29),
			{
				file: w,
				existingUrl: N,
				onFileChange: k,
				onClearExisting: S,
				disabled: F
			} = e,
			z = void 0 !== F && F,
			[U, _] = (0, l.useState)(null),
			[$, C] = (0, l.useState)(!1),
			P = (0, l.useRef)(null);
		j[0] !== w ? (c = () => {
			if (!w) return void _(null);
			let e = new FileReader;
			e.onloadend = () => _(e.result), e.readAsDataURL(w)
		}, u = [w], j[0] = w, j[1] = c, j[2] = u) : (c = j[1], u = j[2]), (0, l.useEffect)(c, u);
		let T = U ?? (w ? null : N ?? null),
			D = !!(w || N);
		j[3] !== k ? (m = e => {
			let t = e.target.files?.[0];
			if (t) {
				if (!d.u.includes(t.type)) return void n.c.error("Only JPEG, PNG, and WebP images are allowed");
				if (t.size > d.D) return void n.c.error(`Image must be less than ${d.D/1024/1024}MB`);
				k(t)
			}
		}, j[3] = k, j[4] = m) : m = j[4];
		let q = m;
		j[5] !== N || j[6] !== w || j[7] !== S || j[8] !== k ? (f = () => {
			w ? k(null) : N && S?.(), P.current && (P.current.value = "")
		}, j[5] = N, j[6] = w, j[7] = S, j[8] = k, j[9] = f) : f = j[9];
		let I = f;
		return j[10] === Symbol.for("react.memo_cache_sentinel") ? (p = d.u.join(","), j[10] = p) : p = j[10], j[11] !== z ? (h = () => !z && C(!0), j[11] = z, j[12] = h) : h = j[12], j[13] === Symbol.for("react.memo_cache_sentinel") ? (g = () => C(!1), x = () => C(!1), j[13] = g, j[14] = x) : (g = j[13], x = j[14]), j[15] !== z || j[16] !== q || j[17] !== h ? (v = (0, t.jsx)(o.f, {
			ref: P,
			type: "file",
			title: "",
			"aria-label": "Upload preset image",
			accept: p,
			onChange: q,
			disabled: z,
			onDragEnter: h,
			onDragLeave: g,
			onDrop: x,
			className: "absolute inset-0 z-10 h-full cursor-pointer opacity-0 disabled:opacity-0!"
		}), j[15] = z, j[16] = q, j[17] = h, j[18] = v) : v = j[18], j[19] !== z || j[20] !== w || j[21] !== I || j[22] !== D || j[23] !== $ || j[24] !== T ? (y = D ? (0, t.jsxs)("div", {
			className: `group flex items-center gap-3 rounded-lg border p-2 transition-colors ${$?"border-accent bg-accent/5":"border-border bg-card"}`,
			children: [(0, t.jsx)("div", {
				className: "relative size-16 shrink-0 overflow-hidden rounded-md bg-muted",
				children: T && (0, t.jsx)("img", {
					src: T,
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
				onClick: I,
				disabled: z,
				className: "z-20 size-8 shrink-0",
				children: (0, t.jsx)(a.f, {
					className: "size-4"
				})
			})]
		}) : (0, t.jsxs)("div", {
			className: `flex h-24 items-center justify-center gap-2 rounded-lg border border-dashed px-4 pointer-events-none transition-colors ${$?"border-accent bg-accent/5":z?"border-border bg-muted opacity-60":"border-border bg-card"}`,
			children: [(0, t.jsx)(i.f, {
				className: "size-4 text-muted-foreground"
			}), (0, t.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Upload an image (optional)"
			})]
		}), j[19] = z, j[20] = w, j[21] = I, j[22] = D, j[23] = $, j[24] = T, j[25] = y) : y = j[25], j[26] !== v || j[27] !== y ? (b = (0, t.jsxs)("div", {
			className: "relative",
			children: [v, y]
		}), j[26] = v, j[27] = y, j[28] = b) : b = j[28], b
	}])
}, 122638, 126165, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(253149),
		a = e.i(253662),
		l = e.i(8774),
		n = e.i(232250),
		s = e.i(76145),
		o = e.i(890850);
	e.s(["f", 0, function(e) {
		let d, c, u, m, f, p, h, g, x, v, y = (0, r.c)(34),
			{
				previewUrl: b,
				isCurrent: j,
				isGenerating: w,
				canGenerate: N,
				onGenerate: k,
				generateOnSave: S,
				onGenerateOnSaveChange: F,
				disabled: z,
				pendingGeneration: U,
				idPrefix: _,
				hintAction: $
			} = e,
			C = void 0 !== z && z,
			P = void 0 !== U && U;
		y[0] !== N || y[1] !== S || y[2] !== j || y[3] !== P || y[4] !== b ? (d = N ? P ? "A new preview is generating in the background." : j ? "Preview matches this content — saving won't spend credits." : S ? `Saving generates a new preview (~${(0,o.H)()} credit).` : b ? "Saving keeps the current preview." : "Saving without a preview." : "Add a prompt to generate a preview.", y[0] = N, y[1] = S, y[2] = j, y[3] = P, y[4] = b, y[5] = d) : d = y[5];
		let T = d,
			D = C || w || !N;
		y[6] !== w ? (c = w ? (0, t.jsx)(i.f, {
			className: "size-4 animate-spin"
		}) : (0, t.jsx)(a.f, {
			className: "size-4"
		}), y[6] = w, y[7] = c) : c = y[7];
		let q = w ? "Generating..." : b ? "Regenerate preview" : "Generate preview";
		y[8] !== k || y[9] !== D || y[10] !== c || y[11] !== q ? (u = (0, t.jsxs)(l.f, {
			type: "button",
			variant: "outline",
			size: "sm",
			onClick: k,
			disabled: D,
			children: [c, q]
		}), y[8] = k, y[9] = D, y[10] = c, y[11] = q, y[12] = u) : u = y[12];
		let I = `${_}-generate-on-save`,
			M = C || w;
		y[13] !== S || y[14] !== F || y[15] !== I || y[16] !== M ? (m = (0, t.jsx)(s.f, {
			id: I,
			checked: S,
			onCheckedChange: F,
			disabled: M
		}), y[13] = S, y[14] = F, y[15] = I, y[16] = M, y[17] = m) : m = y[17];
		let A = `${_}-generate-on-save`;
		return y[18] !== A ? (f = (0, t.jsx)(n.f, {
			htmlFor: A,
			className: "whitespace-nowrap text-sm text-muted-foreground",
			children: "Generate on save"
		}), y[18] = A, y[19] = f) : f = y[19], y[20] !== m || y[21] !== f ? (p = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [m, f]
		}), y[20] = m, y[21] = f, y[22] = p) : p = y[22], y[23] !== p || y[24] !== u ? (h = (0, t.jsxs)("div", {
			className: "flex flex-wrap items-center justify-between gap-3",
			children: [u, p]
		}), y[23] = p, y[24] = u, y[25] = h) : h = y[25], y[26] !== T ? (g = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: T
		}), y[26] = T, y[27] = g) : g = y[27], y[28] !== $ || y[29] !== g ? (x = (0, t.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [g, $]
		}), y[28] = $, y[29] = g, y[30] = x) : x = y[30], y[31] !== h || y[32] !== x ? (v = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [h, x]
		}), y[31] = h, y[32] = x, y[33] = v) : v = y[33], v
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
		h = e.i(221751);

	function g(e) {
		let i, a, l, n, s, o, d, c, u, g, y, b, j, w, N, k, S = (0, r.c)(35),
			{
				beforeSrc: F,
				afterSrc: z,
				alt: U
			} = e,
			[_, $] = (0, p.useState)(50);
		S[0] === Symbol.for("react.memo_cache_sentinel") ? (i = e => {
			let t = e.currentTarget.getBoundingClientRect();
			$(Math.min(100, Math.max(0, (e.clientX - t.left) / t.width * 100)))
		}, S[0] = i) : i = S[0];
		let C = i;
		S[1] !== _ ? (a = Math.round(_), S[1] = _, S[2] = a) : a = S[2], S[3] === Symbol.for("react.memo_cache_sentinel") ? (l = e => {
			e.currentTarget.setPointerCapture(e.pointerId), C(e)
		}, n = e => {
			1 === e.buttons && C(e)
		}, s = e => {
			"ArrowLeft" === e.key && $(v), "ArrowRight" === e.key && $(x)
		}, S[3] = l, S[4] = n, S[5] = s) : (l = S[3], n = S[4], s = S[5]), S[6] !== z ? (o = (0, h.A)(z), S[6] = z, S[7] = o) : o = S[7], S[8] !== z || S[9] !== U || S[10] !== o ? (d = (0, t.jsx)(f.default, {
			src: z,
			alt: U,
			fill: !0,
			sizes: "400px",
			unoptimized: o,
			className: "object-cover"
		}), S[8] = z, S[9] = U, S[10] = o, S[11] = d) : d = S[11];
		let P = `inset(0 ${100-_}% 0 0)`;
		S[12] !== P ? (c = {
			clipPath: P
		}, S[12] = P, S[13] = c) : c = S[13], S[14] !== F ? (u = (0, t.jsx)(f.default, {
			src: F,
			alt: "Sample image before the preset",
			fill: !0,
			sizes: "400px",
			className: "object-cover"
		}), S[14] = F, S[15] = u) : u = S[15], S[16] !== u || S[17] !== c ? (g = (0, t.jsx)("div", {
			className: "absolute inset-0",
			style: c,
			children: u
		}), S[16] = u, S[17] = c, S[18] = g) : g = S[18];
		let T = `${_}%`;
		return S[19] !== T ? (y = {
			left: T
		}, S[19] = T, S[20] = y) : y = S[20], S[21] === Symbol.for("react.memo_cache_sentinel") ? (b = (0, t.jsx)("div", {
			className: "absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-md",
			children: (0, t.jsx)(m, {
				className: "size-4 text-muted-foreground"
			})
		}), S[21] = b) : b = S[21], S[22] !== y ? (j = (0, t.jsx)("div", {
			className: "absolute inset-y-0 w-px bg-background/80",
			style: y,
			children: b
		}), S[22] = y, S[23] = j) : j = S[23], S[24] !== _ ? (w = _ > 15 && (0, t.jsx)("span", {
			className: "absolute bottom-2 left-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Sample"
		}), S[24] = _, S[25] = w) : w = S[25], S[26] !== _ ? (N = _ < 85 && (0, t.jsx)("span", {
			className: "absolute bottom-2 right-2 rounded bg-background/70 px-1.5 py-0.5 text-xs text-muted-foreground",
			children: "Preview"
		}), S[26] = _, S[27] = N) : N = S[27], S[28] !== g || S[29] !== j || S[30] !== w || S[31] !== N || S[32] !== a || S[33] !== d ? (k = (0, t.jsxs)("div", {
			role: "slider",
			"aria-label": "Compare the sample image with the generated preview",
			"aria-valuenow": a,
			"aria-valuemin": 0,
			"aria-valuemax": 100,
			tabIndex: 0,
			className: "relative aspect-video w-full cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-lg border bg-muted",
			onPointerDown: l,
			onPointerMove: n,
			onKeyDown: s,
			children: [d, g, j, w, N]
		}), S[28] = g, S[29] = j, S[30] = w, S[31] = N, S[32] = a, S[33] = d, S[34] = k) : k = S[34], k
	}

	function x(e) {
		return Math.min(100, e + 5)
	}

	function v(e) {
		return Math.max(0, e - 5)
	}
	e.s(["f", 0, function(e) {
		let i, a, l, n, s = (0, r.c)(9),
			{
				previewUrl: c,
				alt: u,
				className: m
			} = e;
		return s[0] !== m ? (i = (0, d.c)("space-y-1", m), s[0] = m, s[1] = i) : i = s[1], s[2] !== u || s[3] !== c ? (a = (0, t.jsx)(g, {
			beforeSrc: o.F,
			afterSrc: c,
			alt: u
		}), s[2] = u, s[3] = c, s[4] = a) : a = s[4], s[5] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Drag to compare the preset with the sample image."
		}), s[5] = l) : l = s[5], s[6] !== i || s[7] !== a ? (n = (0, t.jsxs)("div", {
			className: i,
			children: [a, l]
		}), s[6] = i, s[7] = a, s[8] = n) : n = s[8], n
	}], 126165)
}, 841597, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		i = e.i(55e3);
	let a = {
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
	a.node;
	let l = (0, i.f)(a);
	e.s(["f", 0, function(e) {
		let i, a, n, s, o = (0, r.c)(9),
			{
				prompt: d,
				compact: c
			} = e;
		if (void 0 !== c && c) {
			let e, r;
			return o[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(l, {
				className: "size-3 shrink-0 text-muted-foreground/50"
			}), o[0] = e) : e = o[0], o[1] !== d ? (r = (0, t.jsxs)("div", {
				className: "flex size-full flex-col gap-1 overflow-hidden bg-gradient-to-br from-muted/80 to-muted/20 p-2 text-left",
				children: [e, (0, t.jsx)("p", {
					className: "line-clamp-3 text-[10px] text-muted-foreground italic leading-snug",
					children: d
				})]
			}), o[1] = d, o[2] = r) : r = o[2], r
		}
		return o[3] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(l, {
			className: "size-4 text-muted-foreground/50"
		}), o[3] = i) : i = o[3], o[4] !== d ? (a = (0, t.jsxs)("p", {
			className: "text-sm italic leading-snug text-muted-foreground line-clamp-3",
			children: ["“", d, "”"]
		}), o[4] = d, o[5] = a) : a = o[5], o[6] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)("span", {
			className: "text-xs font-medium uppercase tracking-wider text-muted-foreground/60",
			children: "Prompt preset"
		}), o[6] = n) : n = o[6], o[7] !== a ? (s = (0, t.jsxs)("div", {
			className: "flex size-full flex-col justify-between gap-2 bg-gradient-to-br from-muted/80 to-muted/20 p-4",
			children: [i, a, n]
		}), o[7] = a, o[8] = s) : s = o[8], s
	}], 841597)
}, 486694, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		i = e.i(584381),
		a = e.i(619525),
		l = e.i(322932),
		n = e.i(663303),
		s = e.i(184644),
		o = e.i(3440);
	async function d() {
		return (await s.Q()).folders
	}

	function c(e) {
		l.c.error(e.message || "Failed to create folder")
	}
	async function u(e) {
		return (await s.B(e)).folder
	}

	function m(e) {
		l.c.error(e.message || "Failed to update folder")
	}

	function f(e) {
		l.c.error(e.message || "Failed to delete folder")
	}

	function p(e) {
		return s.O(e)
	}
	e.s(["z", 0, function() {
		let e, i = (0, t.c)(2),
			n = (0, a.d)();
		return i[0] !== n ? (e = {
			mutationFn: u,
			onSuccess: e => {
				l.c.success(`Folder "${e.name}" created`), n.invalidateQueries({
					queryKey: ["preset-folders"]
				})
			},
			onError: c
		}, i[0] = n, i[1] = e) : e = i[1], (0, r.f)(e)
	}, "x", 0, function() {
		let e, i = (0, t.c)(2),
			n = (0, a.d)();
		return i[0] !== n ? (e = {
			mutationFn: p,
			onSuccess: () => {
				l.c.success(`Folder deleted — its presets moved to ${o.p}`), n.invalidateQueries({
					queryKey: ["preset-folders"]
				}), n.invalidateQueries({
					queryKey: ["presets"]
				})
			},
			onError: f
		}, i[0] = n, i[1] = e) : e = i[1], (0, r.f)(e)
	}, "e", 0, function() {
		let e, r, a = (0, t.c)(5),
			{
				data: l
			} = n.i.useSession(),
			s = l?.session?.activeOrganizationId ?? "personal";
		a[0] !== s ? (e = ["preset-folders", "list", s], a[0] = s, a[1] = e) : e = a[1];
		let o = !!l?.user && !l?.user.isAnonymous;
		return a[2] !== e || a[3] !== o ? (r = {
			queryKey: e,
			queryFn: d,
			enabled: o
		}, a[2] = e, a[3] = o, a[4] = r) : r = a[4], (0, i.f)(r)
	}, "t", 0, function(e) {
		let i, l, n, o = (0, t.c)(7),
			d = (0, a.d)();
		return o[0] !== e ? (i = t => s.E(e, t), o[0] = e, o[1] = i) : i = o[1], o[2] !== d ? (l = () => {
			d.invalidateQueries({
				queryKey: ["preset-folders"]
			})
		}, o[2] = d, o[3] = l) : l = o[3], o[4] !== i || o[5] !== l ? (n = {
			mutationFn: i,
			onSuccess: l,
			onError: m
		}, o[4] = i, o[5] = l, o[6] = n) : n = o[6], (0, r.f)(n)
	}])
}, 866513, e => {
	"use strict";
	var t = e.i(170380),
		r = e.i(322932),
		i = e.i(968001),
		a = e.i(551897),
		l = e.i(410740);
	e.s(["f", 0, function({
		prompt: e,
		imageFile: n,
		existingImageUrl: s,
		seedPreviewUrl: o,
		seedSource: d,
		onImageHoisted: c,
		onGenerated: u,
		onGeneratingChange: m,
		pendingGeneration: f = !1,
		externalPreview: p = null
	}) {
		var h;
		let [g, x] = (0, t.useState)(o), [v, y] = (0, t.useState)(o ? d : null), [b, j] = (0, t.useState)(o), [w, N] = (0, t.useState)(!0), [k, S] = (0, t.useState)(!1), F = e.trim().length > 0, z = g !== b, U = z ? null : p, _ = U?.url ?? g, $ = U ? U.matchesDraftBaseline : null !== g && (h = {
			prompt: e,
			imageFile: n,
			imageUrl: s
		}, !!v && v.prompt.trim() === h.prompt.trim() && v.imageFile === h.imageFile && (v.imageUrl ?? null) === (h.imageUrl ?? null)), C = async () => {
			if (!k && F) {
				S(!0), m?.(!0);
				try {
					let t = s;
					n && (t = await (0, i.f)(n, l.b), c(t));
					let r = await (0, a.f)({
						prompt: e.trim(),
						referenceImageUrl: t
					});
					x(r), y({
						prompt: e,
						imageFile: null,
						imageUrl: t
					}), u?.(r)
				} catch (e) {
					console.error("Thumbnail generation failed:", e), r.c.error(e instanceof Error ? e.message : "Preview generation failed")
				} finally {
					S(!1), m?.(!1)
				}
			}
		};
		return {
			previewUrl: _,
			isCurrent: $,
			isGenerating: k,
			canGenerate: F,
			generate: () => {
				C()
			},
			generateOnSave: w,
			setGenerateOnSave: N,
			shouldGenerateOnSave: w && F && !$ && !f,
			isDirty: z,
			commit: e => {
				x(e.previewUrl), j(e.previewUrl), y(e.previewUrl && !1 !== e.matchesSavedContent ? {
					prompt: e.prompt,
					imageFile: null,
					imageUrl: e.imageUrl
				} : null)
			},
			reset: () => {
				x(o), j(o), y(o ? d : null), N(!0)
			}
		}
	}], 866513)
}, 361367, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(351570),
		i = e.i(584381),
		a = e.i(322932),
		l = e.i(663303),
		n = e.i(653970),
		s = e.i(221751),
		o = e.i(333869),
		d = e.i(410740);
	let c = e => !!(e?.startsWith("/") && !(0, s.D)(e));

	function u(e) {
		e instanceof n.p && a.c.error(e.message)
	}
	e.s(["L", 0, c, "U", 0, function() {
		let {
			data: e
		} = l.i.useSession();
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
						templates: o.V,
						folders: []
					}
				}
			},
			enabled: !!e?.user && !e?.user.isAnonymous
		})
	}, "j", 0, function() {
		let e, i = (0, t.c)(2),
			a = (0, d.d)();
		return i[0] !== a ? (e = {
			mutationFn: async e => {
				let {
					template: t,
					generateThumbnail: r
				} = e, i = c(t.imageUrl), l = i ? await (0, n.h)(t) : null;
				return a.mutateAsync({
					name: t.name,
					visibility: "private",
					prompt: t.prompt || void 0,
					imageFile: l,
					existingImageUrl: i ? void 0 : t.imageUrl,
					existingGeneratedThumbnailUrl: t.generatedThumbnailUrl,
					generateThumbnail: void 0 !== r && r && !t.generatedThumbnailUrl,
					modelFamily: t.modelFamily,
					enhance: t.enhance,
					note: `From Decart template "${t.name}"`
				})
			},
			onError: u
		}, i[0] = a, i[1] = e) : e = i[1], (0, r.f)(e)
	}])
}, 656352, e => {
	"use strict";
	var t = e.i(582018),
		r = e.i(663303);

	function i() {
		let e, i, a = (0, t.c)(5),
			{
				data: l
			} = r.i.useSession(),
			n = l?.session?.activeOrganizationId,
			{
				data: s
			} = (0, r.r)();
		a[0] !== n || a[1] !== s ? (e = n ? s?.find(e => e.id === n) : void 0, a[0] = n, a[1] = s, a[2] = e) : e = a[2];
		let o = e;
		return a[3] !== o ? (i = o ? {
			id: o.id,
			name: o.name
		} : null, a[3] = o, a[4] = i) : i = a[4], i
	}
	e.s(["m", 0, i, "I", 0, function() {
		return null !== i()
	}])
}, 3440, 299033, e => {
	"use strict";
	let t = ["lucy", "lucy-vton", "lucy-restyle"];

	function r(e, r, i) {
		let a = r.filter(e => "all" === i || e.modelFamily === i).sort((e, r) => t.indexOf(e.modelFamily) - t.indexOf(r.modelFamily) || e.name.localeCompare(r.name)).map(e => ({
				folder: e,
				items: []
			})),
			l = new Map(a.map(e => [e.folder.id, e])),
			n = [];
		for (let t of e) {
			let e = t.folderId ? l.get(t.folderId) : void 0;
			e ? e.items.push(t) : ("all" === i || t.modelFamily === i) && n.push(t)
		}
		return {
			sections: a,
			unfiled: n
		}
	}
	e.s(["p", 0, "General", "g", 0, function(e, i, {
		hideEmptyFolders: a = !1
	} = {}) {
		let l = t.map(t => {
				let {
					sections: l,
					unfiled: n
				} = r(e, i, t), s = l.filter(e => !a || e.items.length > 0).map(e => ({
					id: e.folder.id,
					name: e.folder.name,
					count: e.items.length
				}));
				return {
					family: t,
					defaultCount: n.length,
					showDefault: n.length > 0 || !a,
					folders: s,
					total: n.length + s.reduce((e, t) => e + t.count, 0)
				}
			}).filter(e => e.total > 0 || e.folders.length > 0),
			n = r(e, i, "all").unfiled.filter(e => null === e.modelFamily).length;
		return {
			total: e.length,
			families: l,
			anyModelCount: n
		}
	}, "h", 0, r, "r", 0, function(e, t, i) {
		if ("all" === i.kind) return e;
		if ("any-model" === i.kind) return r(e, t, "all").unfiled.filter(e => null === e.modelFamily);
		let {
			sections: a,
			unfiled: l
		} = r(e, t, i.family);
		return "default" === i.kind ? l : "folder" === i.kind ? a.find(e => e.folder.id === i.folderId)?.items ?? [] : [...a.flatMap(e => e.items), ...l]
	}, "l", 0, e => "folder" === e.kind ? `folder:${e.folderId}` : "family" === e.kind || "default" === e.kind ? `${e.kind}:${e.family}` : e.kind], 3440);
	var i = e.i(234984),
		a = e.i(582018),
		l = e.i(727677);
	let n = {
		lucy: "Lucy",
		"lucy-vton": "Lucy VTON",
		"lucy-restyle": "Lucy Restyle"
	};
	e.s(["C", 0, n, "q", 0, function(e) {
		let t, r = (0, a.c)(2),
			{
				family: s
			} = e;
		if (!s) return null;
		let o = n[s];
		return r[0] !== o ? (t = (0, i.jsx)(l.f, {
			variant: "outline",
			children: o
		}), r[0] = o, r[1] = t) : t = r[1], t
	}], 299033)
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
	let i = (0, t.f)(r);
	e.s(["f", 0, i], 994787)
}]);