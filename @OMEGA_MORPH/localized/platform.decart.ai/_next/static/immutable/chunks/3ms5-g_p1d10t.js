(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 520311, e => {
	"use strict";
	var t = e.i(234984),
		a = e.i(582018),
		n = e.i(876532),
		l = e.i(55e3);
	let s = {
		name: "folder-plus",
		size: 24,
		node: [
			["path", {
				d: "M12 10v6",
				key: "1bos4e"
			}],
			["path", {
				d: "M9 13h6",
				key: "1uhe8q"
			}],
			["path", {
				d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
				key: "1kt360"
			}]
		]
	};
	s.node;
	let i = (0, l.f)(s),
		r = {
			name: "lock",
			size: 24,
			node: [
				["rect", {
					width: "18",
					height: "11",
					x: "3",
					y: "11",
					rx: "2",
					ry: "2",
					key: "1w4ew1"
				}],
				["path", {
					d: "M7 11V7a5 5 0 0 1 10 0v4",
					key: "fwvmzm"
				}]
			]
		};
	r.node;
	let o = (0, l.f)(r);
	var c = e.i(994787),
		d = e.i(189478),
		m = e.i(293819),
		u = e.i(927531),
		h = e.i(170380),
		x = e.i(322932),
		f = e.i(8774),
		p = e.i(480381),
		g = e.i(932767),
		v = e.i(380491),
		j = e.i(99756),
		y = e.i(214753),
		b = e.i(663303),
		N = e.i(818036);

	function w(e) {
		let n, l, s = (0, a.c)(5),
			{
				count: i,
				className: r
			} = e;
		return s[0] !== r ? (n = (0, N.c)("inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full px-1", "bg-accent text-[10px] text-accent-foreground leading-none tabular-nums", r), s[0] = r, s[1] = n) : n = s[1], s[2] !== i || s[3] !== n ? (l = (0, t.jsx)("span", {
			className: n,
			children: i
		}), s[2] = i, s[3] = n, s[4] = l) : l = s[4], l
	}
	var S = e.i(366361),
		C = e.i(653970),
		k = e.i(486694),
		U = e.i(410740),
		_ = e.i(361367),
		F = e.i(656352),
		z = e.i(3440),
		P = e.i(890850),
		T = e.i(232250),
		D = e.i(161978),
		O = e.i(866513),
		G = e.i(76145),
		M = e.i(149218),
		I = e.i(299033),
		$ = e.i(2036);

	function A(e) {
		let n, l, s, i, r, o, c, d, m, u, h, x, f, p, g, j, y, b, N = (0, a.c)(50),
			{
				prompt: w,
				onPromptChange: S,
				imageFile: C,
				onImageFileChange: k,
				existingImageUrl: U,
				onClearExistingImage: _,
				modelFamily: F,
				onModelFamilyChange: z,
				enhance: P,
				onEnhanceChange: D,
				showModelHint: O,
				disabled: A,
				idPrefix: L
			} = e,
			E = void 0 !== O && O,
			R = void 0 !== A && A,
			X = `${L}-prompt`;
		N[0] !== X ? (n = (0, t.jsx)(T.f, {
			htmlFor: X,
			children: "Prompt"
		}), N[0] = X, N[1] = n) : n = N[1];
		let H = `${L}-enhance`;
		N[2] !== R || N[3] !== P || N[4] !== D || N[5] !== H ? (l = (0, t.jsx)(G.f, {
			id: H,
			checked: P,
			onCheckedChange: D,
			disabled: R
		}), N[2] = R, N[3] = P, N[4] = D, N[5] = H, N[6] = l) : l = N[6];
		let Y = `${L}-enhance`;
		N[7] !== Y ? (s = (0, t.jsx)(T.f, {
			htmlFor: Y,
			className: "whitespace-nowrap text-sm text-muted-foreground",
			children: "Enhance prompt"
		}), N[7] = Y, N[8] = s) : s = N[8], N[9] !== l || N[10] !== s ? (i = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [l, s]
		}), N[9] = l, N[10] = s, N[11] = i) : i = N[11], N[12] !== n || N[13] !== i ? (r = (0, t.jsxs)("div", {
			className: "flex items-center justify-between gap-2",
			children: [n, i]
		}), N[12] = n, N[13] = i, N[14] = r) : r = N[14];
		let B = `${L}-prompt`;
		N[15] !== S ? (o = e => S(e.target.value), N[15] = S, N[16] = o) : o = N[16], N[17] !== R || N[18] !== w || N[19] !== B || N[20] !== o ? (c = (0, t.jsx)(M.f, {
			id: B,
			value: w,
			onChange: o,
			placeholder: "Describe the style or edit this preset applies...",
			className: "min-h-16",
			disabled: R
		}), N[17] = R, N[18] = w, N[19] = B, N[20] = o, N[21] = c) : c = N[21], N[22] !== r || N[23] !== c ? (d = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [r, c]
		}), N[22] = r, N[23] = c, N[24] = d) : d = N[24], N[25] === Symbol.for("react.memo_cache_sentinel") ? (m = (0, t.jsx)(T.f, {
			children: "Image"
		}), N[25] = m) : m = N[25], N[26] !== R || N[27] !== U || N[28] !== C || N[29] !== _ || N[30] !== k ? (u = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [m, (0, t.jsx)($.f, {
				file: C,
				existingUrl: U,
				onFileChange: k,
				onClearExisting: _,
				disabled: R
			})]
		}), N[26] = R, N[27] = U, N[28] = C, N[29] = _, N[30] = k, N[31] = u) : u = N[31], N[32] === Symbol.for("react.memo_cache_sentinel") ? (h = (0, t.jsx)(T.f, {
			children: "Model"
		}), N[32] = h) : h = N[32];
		let W = F ?? "general";
		return N[33] !== z ? (x = e => z("general" === e ? null : e), N[33] = z, N[34] = x) : x = N[34], N[35] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, t.jsx)(v.P, {
			className: "w-full",
			children: (0, t.jsx)(v.U, {
				placeholder: "Any model"
			})
		}), N[35] = f) : f = N[35], N[36] === Symbol.for("react.memo_cache_sentinel") ? (p = (0, t.jsxs)(v.r, {
			children: [(0, t.jsx)(v.T, {
				value: "general",
				children: "Any model"
			}), Object.entries(I.C).map(V)]
		}), N[36] = p) : p = N[36], N[37] !== R || N[38] !== W || N[39] !== x ? (g = (0, t.jsxs)(v.d, {
			value: W,
			onValueChange: x,
			disabled: R,
			children: [f, p]
		}), N[37] = R, N[38] = W, N[39] = x, N[40] = g) : g = N[40], N[41] !== E ? (j = E && (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Shown only on matching playground pages. Any-model presets appear everywhere, and can't be filed into a folder."
		}), N[41] = E, N[42] = j) : j = N[42], N[43] !== g || N[44] !== j ? (y = (0, t.jsx)("div", {
			className: "@container",
			children: (0, t.jsxs)("div", {
				className: "space-y-2 @md:w-64",
				children: [h, g, j]
			})
		}), N[43] = g, N[44] = j, N[45] = y) : y = N[45], N[46] !== d || N[47] !== u || N[48] !== y ? (b = (0, t.jsxs)(t.Fragment, {
			children: [d, u, y]
		}), N[46] = d, N[47] = u, N[48] = y, N[49] = b) : b = N[49], b
	}

	function V(e) {
		let [a, n] = e;
		return (0, t.jsx)(v.T, {
			value: a,
			children: n
		}, a)
	}
	var L = e.i(627859),
		E = e.i(122638),
		R = e.i(126165);

	function X(e) {
		let n, l, s, i, r, o, c, d, m, u, x, p, j, y, b, N, w, S, C, _, z, P, G, M, I, $, V, X, H, Y, B = (0, a.c)(115),
			{
				open: W,
				onOpenChange: K,
				initialValues: q
			} = e,
			J = (0, F.m)(),
			Q = null !== J,
			Z = (0, U.d)(),
			{
				data: ee
			} = (0, k.e)(),
			[et, ea] = (0, h.useState)(q?.name ?? ""),
			[en, el] = (0, h.useState)("private"),
			[es, ei] = (0, h.useState)(q?.prompt ?? ""),
			[er, eo] = (0, h.useState)(q?.imageFile ?? null),
			[ec, ed] = (0, h.useState)(q?.existingImageUrl ?? null),
			[em, eu] = (0, h.useState)(q?.modelFamily ?? null),
			[eh, ex] = (0, h.useState)(q?.enhance ?? !0),
			[ef, ep] = (0, h.useState)(""),
			[eg, ev] = (0, h.useState)(null),
			ej = Q ? en : "private";
		B[0] === Symbol.for("react.memo_cache_sentinel") ? (n = e => {
			eu(e), ev(null)
		}, B[0] = n) : n = B[0];
		let ey = n;
		B[1] === Symbol.for("react.memo_cache_sentinel") ? (l = e => {
			el(e), ev(null)
		}, B[1] = l) : l = B[1];
		let eb = l,
			eN = q?.existingGeneratedThumbnailUrl ?? null,
			ew = q?.prompt ?? "",
			eS = q?.imageFile ?? null,
			eC = q?.existingImageUrl ?? null;
		B[2] !== ew || B[3] !== eS || B[4] !== eC ? (s = {
			prompt: ew,
			imageFile: eS,
			imageUrl: eC
		}, B[2] = ew, B[3] = eS, B[4] = eC, B[5] = s) : s = B[5], B[6] === Symbol.for("react.memo_cache_sentinel") ? (i = e => {
			ed(e), eo(null)
		}, B[6] = i) : i = B[6], B[7] !== ec || B[8] !== er || B[9] !== es || B[10] !== eN || B[11] !== s ? (r = {
			prompt: es,
			imageFile: er,
			existingImageUrl: ec,
			seedPreviewUrl: eN,
			seedSource: s,
			onImageHoisted: i
		}, B[7] = ec, B[8] = er, B[9] = es, B[10] = eN, B[11] = s, B[12] = r) : r = B[12];
		let ek = (0, O.f)(r),
			eU = Z.isPending || ek.isGenerating;
		B[13] !== ec || B[14] !== er || B[15] !== es ? (o = es.trim().length > 0 || null !== er || null !== ec, B[13] = ec, B[14] = er, B[15] = es, B[16] = o) : o = B[16];
		let e_ = o;
		B[17] !== e_ || B[18] !== et ? (c = et.trim().length > 0 && e_, B[17] = e_, B[18] = et, B[19] = c) : c = B[19];
		let eF = c;
		B[20] !== q?.enhance || B[21] !== q?.existingImageUrl || B[22] !== q?.imageFile || B[23] !== q?.modelFamily || B[24] !== q?.name || B[25] !== q?.prompt || B[26] !== ek ? (d = () => {
			ea(q?.name ?? ""), el("private"), ei(q?.prompt ?? ""), eo(q?.imageFile ?? null), ed(q?.existingImageUrl ?? null), eu(q?.modelFamily ?? null), ex(q?.enhance ?? !0), ep(""), ev(null), ek.reset()
		}, B[20] = q?.enhance, B[21] = q?.existingImageUrl, B[22] = q?.imageFile, B[23] = q?.modelFamily, B[24] = q?.name, B[25] = q?.prompt, B[26] = ek, B[27] = d) : d = B[27];
		let ez = d;
		B[28] !== eU || B[29] !== K || B[30] !== ez ? (m = e => {
			(e || !eU) && (K(e), e || ez())
		}, B[28] = eU, B[29] = K, B[30] = ez, B[31] = m) : m = B[31];
		let eP = m;
		B[32] !== Z || B[33] !== ej || B[34] !== eh || B[35] !== ec || B[36] !== eg || B[37] !== eP || B[38] !== er || B[39] !== em || B[40] !== et || B[41] !== ef || B[42] !== ek.previewUrl || B[43] !== ek.shouldGenerateOnSave || B[44] !== es ? (u = () => {
			Z.mutate({
				name: et.trim(),
				visibility: ej,
				prompt: es.trim() || void 0,
				imageFile: er,
				existingImageUrl: er ? void 0 : ec,
				generateThumbnail: ek.shouldGenerateOnSave,
				existingGeneratedThumbnailUrl: ek.previewUrl ?? void 0,
				note: ef.trim() || void 0,
				modelFamily: em,
				enhance: eh,
				folderId: eg
			}, {
				onSuccess: () => eP(!1)
			})
		}, B[32] = Z, B[33] = ej, B[34] = eh, B[35] = ec, B[36] = eg, B[37] = eP, B[38] = er, B[39] = em, B[40] = et, B[41] = ef, B[42] = ek.previewUrl, B[43] = ek.shouldGenerateOnSave, B[44] = es, B[45] = u) : u = B[45];
		let eT = u;
		B[46] === Symbol.for("react.memo_cache_sentinel") ? (x = (0, t.jsxs)(D.D, {
			children: [(0, t.jsx)(D.L, {
				children: "New preset"
			}), (0, t.jsx)(D.c, {
				children: "Save a prompt and/or image to reuse later. Every change becomes a new version you can roll back to."
			})]
		}), B[46] = x) : x = B[46], B[47] === Symbol.for("react.memo_cache_sentinel") ? (p = (0, t.jsxs)(T.f, {
			htmlFor: "new-preset-name",
			children: ["Name ", (0, t.jsx)("span", {
				className: "text-destructive",
				children: "*"
			})]
		}), B[47] = p) : p = B[47], B[48] === Symbol.for("react.memo_cache_sentinel") ? (j = e => ea(e.target.value), B[48] = j) : j = B[48], B[49] !== eU || B[50] !== et ? (y = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [p, (0, t.jsx)(g.f, {
				id: "new-preset-name",
				value: et,
				onChange: j,
				placeholder: "e.g., Neon City Style",
				maxLength: 200,
				"data-1p-ignore": !0,
				autoComplete: "off",
				disabled: eU
			})]
		}), B[49] = eU, B[50] = et, B[51] = y) : y = B[51], B[52] === Symbol.for("react.memo_cache_sentinel") ? (b = () => ed(null), B[52] = b) : b = B[52], B[53] !== eU || B[54] !== eh || B[55] !== ec || B[56] !== er || B[57] !== em || B[58] !== es ? (N = (0, t.jsx)(A, {
			idPrefix: "new-preset",
			prompt: es,
			onPromptChange: ei,
			imageFile: er,
			onImageFileChange: eo,
			existingImageUrl: ec,
			onClearExistingImage: b,
			modelFamily: em,
			onModelFamilyChange: ey,
			enhance: eh,
			onEnhanceChange: ex,
			showModelHint: !0,
			disabled: eU
		}), B[53] = eU, B[54] = eh, B[55] = ec, B[56] = er, B[57] = em, B[58] = es, B[59] = N) : N = B[59], B[60] !== ek.previewUrl ? (w = ek.previewUrl && (0, t.jsx)(R.f, {
			previewUrl: ek.previewUrl,
			alt: "New preset preview"
		}), B[60] = ek.previewUrl, B[61] = w) : w = B[61], B[62] !== Z.isPending || B[63] !== ek.canGenerate || B[64] !== ek.generate || B[65] !== ek.generateOnSave || B[66] !== ek.isCurrent || B[67] !== ek.isGenerating || B[68] !== ek.previewUrl || B[69] !== ek.setGenerateOnSave ? (S = (0, t.jsx)(E.f, {
			idPrefix: "new-preset",
			previewUrl: ek.previewUrl,
			isCurrent: ek.isCurrent,
			isGenerating: ek.isGenerating,
			canGenerate: ek.canGenerate,
			onGenerate: ek.generate,
			generateOnSave: ek.generateOnSave,
			onGenerateOnSaveChange: ek.setGenerateOnSave,
			disabled: Z.isPending
		}), B[62] = Z.isPending, B[63] = ek.canGenerate, B[64] = ek.generate, B[65] = ek.generateOnSave, B[66] = ek.isCurrent, B[67] = ek.isGenerating, B[68] = ek.previewUrl, B[69] = ek.setGenerateOnSave, B[70] = S) : S = B[70], B[71] !== J?.name || B[72] !== eU || B[73] !== Q || B[74] !== en ? (C = Q && (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [(0, t.jsx)(T.f, {
				children: "Visibility"
			}), (0, t.jsxs)(v.d, {
				value: en,
				onValueChange: e => eb(e),
				disabled: eU,
				children: [(0, t.jsx)(v.P, {
					className: "w-full",
					children: (0, t.jsx)(v.U, {})
				}), (0, t.jsxs)(v.r, {
					children: [(0, t.jsx)(v.T, {
						value: "private",
						children: "Private — only you"
					}), (0, t.jsxs)(v.T, {
						value: "org",
						children: [J?.name ?? "Organization", " — all members"]
					})]
				})]
			})]
		}), B[71] = J?.name, B[72] = eU, B[73] = Q, B[74] = en, B[75] = C) : C = B[75];
		let eD = J?.id ?? null;
		B[76] !== eU || B[77] !== ej || B[78] !== eg || B[79] !== ee || B[80] !== em || B[81] !== eD ? (_ = (0, t.jsx)(L.f, {
			idPrefix: "new-preset",
			folders: ee,
			value: eg,
			onChange: ev,
			modelFamily: em,
			organizationId: eD,
			visibility: ej,
			disabled: eU
		}), B[76] = eU, B[77] = ej, B[78] = eg, B[79] = ee, B[80] = em, B[81] = eD, B[82] = _) : _ = B[82], B[83] === Symbol.for("react.memo_cache_sentinel") ? (z = (0, t.jsx)(T.f, {
			htmlFor: "new-preset-note",
			children: "Note"
		}), B[83] = z) : z = B[83], B[84] === Symbol.for("react.memo_cache_sentinel") ? (P = e => ep(e.target.value), B[84] = P) : P = B[84], B[85] !== eU || B[86] !== ef ? (G = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [z, (0, t.jsx)(g.f, {
				id: "new-preset-note",
				value: ef,
				onChange: P,
				placeholder: "Note for the first version (optional)",
				disabled: eU
			})]
		}), B[85] = eU, B[86] = ef, B[87] = G) : G = B[87], B[88] !== y || B[89] !== N || B[90] !== w || B[91] !== S || B[92] !== C || B[93] !== _ || B[94] !== G ? (M = (0, t.jsxs)("div", {
			className: "space-y-4 px-4",
			children: [y, N, w, S, C, _, G]
		}), B[88] = y, B[89] = N, B[90] = w, B[91] = S, B[92] = C, B[93] = _, B[94] = G, B[95] = M) : M = B[95];
		let eO = !eF || eU,
			eG = Z.isPending ? "Creating..." : "Create preset";
		return B[96] !== eT || B[97] !== eO || B[98] !== eG ? (I = (0, t.jsx)(f.f, {
			onClick: eT,
			disabled: eO,
			children: eG
		}), B[96] = eT, B[97] = eO, B[98] = eG, B[99] = I) : I = B[99], B[100] !== eP ? ($ = () => eP(!1), B[100] = eP, B[101] = $) : $ = B[101], B[102] !== eU || B[103] !== $ ? (V = (0, t.jsx)(f.f, {
			variant: "outline",
			onClick: $,
			disabled: eU,
			children: "Cancel"
		}), B[102] = eU, B[103] = $, B[104] = V) : V = B[104], B[105] !== I || B[106] !== V ? (X = (0, t.jsxs)(D.J, {
			children: [I, V]
		}), B[105] = I, B[106] = V, B[107] = X) : X = B[107], B[108] !== M || B[109] !== X ? (H = (0, t.jsxs)(D.U, {
			side: "right",
			className: "w-full overflow-y-auto sm:max-w-md",
			children: [x, M, X]
		}), B[108] = M, B[109] = X, B[110] = H) : H = B[110], B[111] !== eP || B[112] !== W || B[113] !== H ? (Y = (0, t.jsx)(D.j, {
			open: W,
			onOpenChange: eP,
			children: H
		}), B[111] = eP, B[112] = W, B[113] = H, B[114] = Y) : Y = B[114], Y
	}

	function H(e) {
		let n, l, s, i, r, o, c, d, m, u, x, j, y, b, N, w, S, C, U, _ = (0, a.c)(67),
			{
				open: z,
				onOpenChange: P,
				modelFamily: D,
				folder: O
			} = e,
			G = void 0 !== O,
			M = (0, F.m)(),
			$ = null !== M,
			A = (0, k.z)(),
			V = (0, k.t)(O?.id ?? ""),
			[L, E] = (0, h.useState)(O?.name ?? ""),
			[R, X] = (0, h.useState)(O?.visibility ?? "private"),
			[H, B] = (0, h.useState)(O?.modelFamily ?? D ?? "lucy"),
			W = A.isPending || V.isPending;
		_[0] !== L || _[1] !== W ? (n = L.trim().length > 0 && !W, _[0] = L, _[1] = W, _[2] = n) : n = _[2];
		let K = n;
		_[3] !== G || _[4] !== P ? (l = () => {
			P(!1), G || (E(""), X("private"))
		}, _[3] = G, _[4] = P, _[5] = l) : l = _[5];
		let q = l;
		_[6] !== K || _[7] !== q || _[8] !== A || _[9] !== H || _[10] !== $ || _[11] !== G || _[12] !== L || _[13] !== V || _[14] !== R ? (s = () => {
			if (K) {
				if (G) return void V.mutate({
					name: L.trim()
				}, {
					onSuccess: q
				});
				A.mutate({
					name: L.trim(),
					modelFamily: H,
					visibility: $ ? R : "private"
				}, {
					onSuccess: q
				})
			}
		}, _[6] = K, _[7] = q, _[8] = A, _[9] = H, _[10] = $, _[11] = G, _[12] = L, _[13] = V, _[14] = R, _[15] = s) : s = _[15];
		let J = s;
		_[16] !== q || _[17] !== P ? (i = e => e ? P(!0) : q(), _[16] = q, _[17] = P, _[18] = i) : i = _[18];
		let Q = G ? "Rename folder" : "New folder";
		_[19] !== Q ? (r = (0, t.jsx)(p.F, {
			children: Q
		}), _[19] = Q, _[20] = r) : r = _[20];
		let Z = G ? `Folders stay with ${I.C[H]} — only the name changes.` : D ? `Groups ${I.C[D]} presets in your library.` : "Groups presets for one model in your library.";
		_[21] !== Z ? (o = (0, t.jsx)(p.C, {
			children: Z
		}), _[21] = Z, _[22] = o) : o = _[22], _[23] !== r || _[24] !== o ? (c = (0, t.jsxs)(p.s, {
			children: [r, o]
		}), _[23] = r, _[24] = o, _[25] = c) : c = _[25], _[26] === Symbol.for("react.memo_cache_sentinel") ? (d = (0, t.jsx)(T.f, {
			htmlFor: "folder-name",
			children: "Name"
		}), _[26] = d) : d = _[26], _[27] === Symbol.for("react.memo_cache_sentinel") ? (m = e => E(e.target.value), _[27] = m) : m = _[27], _[28] !== J ? (u = e => "Enter" === e.key && J(), _[28] = J, _[29] = u) : u = _[29], _[30] !== L || _[31] !== W || _[32] !== u ? (x = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [d, (0, t.jsx)(g.f, {
				id: "folder-name",
				value: L,
				onChange: m,
				onKeyDown: u,
				placeholder: "e.g., Character swap",
				maxLength: 100,
				"data-1p-ignore": !0,
				autoComplete: "off",
				disabled: W
			})]
		}), _[30] = L, _[31] = W, _[32] = u, _[33] = x) : x = _[33], _[34] !== H || _[35] !== G || _[36] !== D || _[37] !== W ? (j = !G && !D && (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [(0, t.jsx)(T.f, {
				htmlFor: "folder-model",
				children: "Model"
			}), (0, t.jsxs)(v.d, {
				value: H,
				onValueChange: e => B(e),
				disabled: W,
				children: [(0, t.jsx)(v.P, {
					id: "folder-model",
					className: "w-full",
					children: (0, t.jsx)(v.U, {})
				}), (0, t.jsx)(v.r, {
					children: Object.entries(I.C).map(Y)
				})]
			})]
		}), _[34] = H, _[35] = G, _[36] = D, _[37] = W, _[38] = j) : j = _[38], _[39] !== M?.name || _[40] !== $ || _[41] !== G || _[42] !== W || _[43] !== R ? (y = !G && $ && (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [(0, t.jsx)(T.f, {
				children: "Visibility"
			}), (0, t.jsxs)(v.d, {
				value: R,
				onValueChange: e => X(e),
				disabled: W,
				children: [(0, t.jsx)(v.P, {
					className: "w-full",
					children: (0, t.jsx)(v.U, {})
				}), (0, t.jsxs)(v.r, {
					children: [(0, t.jsx)(v.T, {
						value: "private",
						children: "Private — only you"
					}), (0, t.jsxs)(v.T, {
						value: "org",
						children: [M?.name ?? "Organization", " — all members"]
					})]
				})]
			}), (0, t.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Only shared folders can hold presets shared with your organization."
			})]
		}), _[39] = M?.name, _[40] = $, _[41] = G, _[42] = W, _[43] = R, _[44] = y) : y = _[44], _[45] !== x || _[46] !== j || _[47] !== y ? (b = (0, t.jsxs)("div", {
			className: "space-y-4",
			children: [x, j, y]
		}), _[45] = x, _[46] = j, _[47] = y, _[48] = b) : b = _[48], _[49] !== q || _[50] !== W ? (N = (0, t.jsx)(f.f, {
			variant: "outline",
			onClick: q,
			disabled: W,
			children: "Cancel"
		}), _[49] = q, _[50] = W, _[51] = N) : N = _[51];
		let ee = !K,
			et = G ? "Save" : "Create folder";
		return _[52] !== J || _[53] !== ee || _[54] !== et ? (w = (0, t.jsx)(f.f, {
			onClick: J,
			disabled: ee,
			children: et
		}), _[52] = J, _[53] = ee, _[54] = et, _[55] = w) : w = _[55], _[56] !== N || _[57] !== w ? (S = (0, t.jsxs)(p.c, {
			children: [N, w]
		}), _[56] = N, _[57] = w, _[58] = S) : S = _[58], _[59] !== b || _[60] !== S || _[61] !== c ? (C = (0, t.jsxs)(p.d, {
			className: "sm:max-w-md",
			children: [c, b, S]
		}), _[59] = b, _[60] = S, _[61] = c, _[62] = C) : C = _[62], _[63] !== z || _[64] !== C || _[65] !== i ? (U = (0, t.jsx)(p.N, {
			open: z,
			onOpenChange: i,
			children: C
		}), _[63] = z, _[64] = C, _[65] = i, _[66] = U) : U = _[66], U
	}

	function Y(e) {
		let [a, n] = e;
		return (0, t.jsx)(v.T, {
			value: a,
			children: n
		}, a)
	}
	var B = e.i(255665),
		W = e.i(618508),
		K = e.i(893890),
		q = e.i(745502),
		J = e.i(250576),
		Q = e.i(595053);

	function Z(e, t) {
		let a = (0, Q.f)(e) - (0, Q.f)(t);
		return a < 0 ? -1 : a > 0 ? 1 : a
	}
	var ee = e.i(677417);

	function et(e, t) {
		return function(e, t, a) {
			var n;
			let l, s = (0, K.f)(),
				i = a?.locale ?? s.locale ?? W.f,
				r = Z(e, t);
			if (isNaN(r)) throw RangeError("Invalid time value");
			let o = Object.assign({}, a, {
					addSuffix: a?.addSuffix,
					comparison: r
				}),
				[c, d] = (0, J.f)(a?.in, ...r > 0 ? [t, e] : [e, t]),
				m = (n = void 0, e => {
					let t = (n ? Math[n] : Math.trunc)(e);
					return 0 === t ? 0 : t
				})(((0, Q.f)(d) - (0, Q.f)(c)) / 1e3),
				u = Math.round((m - ((0, q.f)(d) - (0, q.f)(c)) / 1e3) / 60);
			if (u < 2)
				if (a?.includeSeconds)
					if (m < 5) return i.formatDistance("lessThanXSeconds", 5, o);
					else if (m < 10) return i.formatDistance("lessThanXSeconds", 10, o);
			else if (m < 20) return i.formatDistance("lessThanXSeconds", 20, o);
			else if (m < 40) return i.formatDistance("halfAMinute", 0, o);
			else if (m < 60) return i.formatDistance("lessThanXMinutes", 1, o);
			else return i.formatDistance("xMinutes", 1, o);
			else if (0 === u) return i.formatDistance("lessThanXMinutes", 1, o);
			else return i.formatDistance("xMinutes", u, o);
			if (u < 45) return i.formatDistance("xMinutes", u, o);
			if (u < 90) return i.formatDistance("aboutXHours", 1, o);
			if (u < ee.k) {
				let e = Math.round(u / 60);
				return i.formatDistance("aboutXHours", e, o)
			}
			if (u < 2520) return i.formatDistance("xDays", 1, o);
			else if (u < ee.d) {
				let e = Math.round(u / ee.k);
				return i.formatDistance("xDays", e, o)
			} else if (u < 2 * ee.d) return l = Math.round(u / ee.d), i.formatDistance("aboutXMonths", l, o);
			if ((l = function(e, t) {
					var a, n;
					let l, s, i, r, [o, c, d] = (0, J.f)(void 0, e, e, t),
						m = Z(c, d),
						u = Math.abs(function(e, t) {
							let [a, n] = (0, J.f)(void 0, e, t);
							return 12 * (a.getFullYear() - n.getFullYear()) + (a.getMonth() - n.getMonth())
						}(c, d));
					if (u < 1) return 0;
					1 === c.getMonth() && c.getDate() > 27 && c.setDate(30), c.setMonth(c.getMonth() - m * u);
					let h = Z(c, d) === -m; + (l = (0, Q.f)(o, void 0), a = void 0, (s = (0, Q.f)(l, a?.in)).setHours(23, 59, 59, 999), s) == +(n = void 0, r = (i = (0, Q.f)(l, n?.in)).getMonth(), i.setFullYear(i.getFullYear(), r + 1, 0), i.setHours(23, 59, 59, 999), i) && 1 === u && 1 === Z(o, d) && (h = !1);
					let x = m * (u - h);
					return 0 === x ? 0 : x
				}(d, c)) < 12) {
				let e = Math.round(u / ee.d);
				return i.formatDistance("xMonths", e, o)
			} {
				let e = l % 12,
					t = Math.trunc(l / 12);
				return e < 3 ? i.formatDistance("aboutXYears", t, o) : e < 9 ? i.formatDistance("overXYears", t, o) : i.formatDistance("almostXYears", t + 1, o)
			}
		}(e, (0, B.f)(e, Date.now()), t)
	}
	let ea = {
		name: "ellipsis-vertical",
		size: 24,
		node: [
			["circle", {
				cx: "12",
				cy: "12",
				r: "1",
				key: "41hilf"
			}],
			["circle", {
				cx: "12",
				cy: "5",
				r: "1",
				key: "gxeob9"
			}],
			["circle", {
				cx: "12",
				cy: "19",
				r: "1",
				key: "lyex9k"
			}]
		],
		aliases: ["more-vertical"]
	};
	ea.node;
	let en = (0, l.f)(ea);
	var el = e.i(880582),
		es = e.i(73575),
		ei = e.i(790850),
		er = e.i(61993),
		eo = e.i(683225);

	function ec(e) {
		return `/models/${e.modelFamily??"lucy"}?tab=realtime&preset=${e.id}`
	}
	var ed = e.i(316141),
		em = e.i(221751);

	function eu(e) {
		let n, l, s, i, r, o = (0, a.c)(16),
			{
				src: c,
				alt: m,
				sizes: u
			} = e;
		return o[0] !== c ? (n = (0, em.A)(c), o[0] = c, o[1] = n) : n = o[1], o[2] !== u || o[3] !== c || o[4] !== n ? (l = (0, t.jsx)(d.default, {
			src: c,
			alt: "",
			"aria-hidden": !0,
			fill: !0,
			unoptimized: n,
			sizes: u,
			className: "scale-110 object-cover opacity-50 blur-lg"
		}), o[2] = u, o[3] = c, o[4] = n, o[5] = l) : l = o[5], o[6] !== c ? (s = (0, em.A)(c), o[6] = c, o[7] = s) : s = o[7], o[8] !== m || o[9] !== u || o[10] !== c || o[11] !== s ? (i = (0, t.jsx)(d.default, {
			src: c,
			alt: m,
			fill: !0,
			sizes: u,
			unoptimized: s,
			className: "object-contain"
		}), o[8] = m, o[9] = u, o[10] = c, o[11] = s, o[12] = i) : i = o[12], o[13] !== l || o[14] !== i ? (r = (0, t.jsxs)(t.Fragment, {
			children: [l, i]
		}), o[13] = l, o[14] = i, o[15] = r) : r = o[15], r
	}

	function eh(e) {
		let n, l, s = (0, a.c)(6),
			{
				src: i,
				alt: r
			} = e;
		return s[0] !== i ? (n = (0, em.A)(i), s[0] = i, s[1] = n) : n = s[1], s[2] !== r || s[3] !== i || s[4] !== n ? (l = (0, t.jsx)("div", {
			className: "absolute bottom-2 right-2 h-1/3 aspect-square overflow-hidden rounded-md border border-border/60 bg-muted shadow-md",
			children: (0, t.jsx)(d.default, {
				src: i,
				alt: r,
				fill: !0,
				sizes: "80px",
				unoptimized: n,
				className: "object-cover"
			})
		}), s[2] = r, s[3] = i, s[4] = n, s[5] = l) : l = s[5], l
	}
	var ex = e.i(432450);

	function ef(e) {
		let n, l, s, i, r, o, c, d = (0, a.c)(19),
			{
				preset: m,
				open: u,
				onOpenChange: h,
				onDeleted: x
			} = e,
			f = (0, U.U)();
		d[0] !== m.name ? (n = (0, t.jsxs)(ex.g, {
			children: ['Delete "', m.name, '"?']
		}), d[0] = m.name, d[1] = n) : n = d[1];
		let p = "org" === m.visibility ? " for everyone in your organization" : "";
		return d[2] !== p ? (l = (0, t.jsxs)(ex.I, {
			children: ["This permanently deletes the preset and its entire version history", p, ". There is no undo."]
		}), d[2] = p, d[3] = l) : l = d[3], d[4] !== n || d[5] !== l ? (s = (0, t.jsxs)(ex.O, {
			children: [n, l]
		}), d[4] = n, d[5] = l, d[6] = s) : s = d[6], d[7] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(ex.D, {
			children: "Cancel"
		}), d[7] = i) : i = d[7], d[8] !== f || d[9] !== x || d[10] !== m.id ? (r = (0, t.jsxs)(ex._, {
			children: [i, (0, t.jsx)(ex.s, {
				onClick: () => f.mutate(m.id, {
					onSuccess: x
				}),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Delete"
			})]
		}), d[8] = f, d[9] = x, d[10] = m.id, d[11] = r) : r = d[11], d[12] !== s || d[13] !== r ? (o = (0, t.jsxs)(ex.B, {
			children: [s, r]
		}), d[12] = s, d[13] = r, d[14] = o) : o = d[14], d[15] !== h || d[16] !== u || d[17] !== o ? (c = (0, t.jsx)(ex.m, {
			open: u,
			onOpenChange: h,
			children: o
		}), d[15] = h, d[16] = u, d[17] = o, d[18] = c) : c = d[18], c
	}
	var ep = e.i(253149);

	function eg() {
		let e, n = (0, a.c)(1);
		return n[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsxs)("div", {
			className: "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 bg-background/70",
			children: [(0, t.jsx)(ep.f, {
				className: "size-4 animate-spin text-muted-foreground"
			}), (0, t.jsx)("span", {
				className: "text-muted-foreground text-xs",
				children: "Generating preview…"
			})]
		}), n[0] = e) : e = n[0], e
	}

	function ev(e) {
		let n, l, s, i, r, o, c, d, m, u, h = (0, a.c)(29),
			{
				ariaLabel: x,
				onOpen: f,
				cover: p,
				title: g,
				subtitle: v,
				aside: j,
				menu: y,
				isGenerating: b,
				className: w
			} = e,
			S = void 0 !== b && b;
		return h[0] !== f ? (n = e => {
			("Enter" === e.key || " " === e.key) && (e.preventDefault(), f())
		}, h[0] = f, h[1] = n) : n = h[1], h[2] !== w ? (l = (0, N.c)("flex min-w-0 cursor-pointer flex-col gap-3 rounded-field border border-border px-2 pt-2 pb-3 transition-colors", "hover:border-accent focus-visible:border-accent focus-visible:outline-none", w), h[2] = w, h[3] = l) : l = h[3], h[4] !== S ? (s = S && (0, t.jsx)(eg, {}), h[4] = S, h[5] = s) : s = h[5], h[6] !== p || h[7] !== s ? (i = (0, t.jsxs)("div", {
			className: "relative aspect-video w-full overflow-hidden rounded-sm bg-muted",
			children: [p, s]
		}), h[6] = p, h[7] = s, h[8] = i) : i = h[8], h[9] !== g ? (r = (0, t.jsx)("h3", {
			className: "truncate font-medium text-base text-foreground tracking-[0.14px]",
			children: g
		}), h[9] = g, h[10] = r) : r = h[10], h[11] !== v ? (o = (0, t.jsx)("p", {
			className: "truncate text-muted-foreground text-sm",
			children: v
		}), h[11] = v, h[12] = o) : o = h[12], h[13] !== r || h[14] !== o ? (c = (0, t.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col gap-1.5",
			children: [r, o]
		}), h[13] = r, h[14] = o, h[15] = c) : c = h[15], h[16] !== y ? (d = y && (0, t.jsx)("span", {
			onClick: ey,
			onKeyDown: ej,
			className: "shrink-0",
			children: y
		}), h[16] = y, h[17] = d) : d = h[17], h[18] !== j || h[19] !== c || h[20] !== d ? (m = (0, t.jsxs)("div", {
			className: "flex min-h-9 items-center gap-2 pl-2",
			children: [c, j, d]
		}), h[18] = j, h[19] = c, h[20] = d, h[21] = m) : m = h[21], h[22] !== x || h[23] !== f || h[24] !== m || h[25] !== n || h[26] !== l || h[27] !== i ? (u = (0, t.jsxs)("div", {
			role: "button",
			tabIndex: 0,
			"aria-label": x,
			onClick: f,
			onKeyDown: n,
			className: l,
			children: [i, m]
		}), h[22] = x, h[23] = f, h[24] = m, h[25] = n, h[26] = l, h[27] = i, h[28] = u) : u = h[28], u
	}

	function ej(e) {
		return e.stopPropagation()
	}

	function ey(e) {
		return e.stopPropagation()
	}
	var eb = e.i(841597),
		eN = e.i(727677);

	function ew(e) {
		let l, s = (0, a.c)(4),
			{
				visibility: i,
				orgName: r
			} = e;
		if ("org" === i) {
			let e, a;
			s[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(n.f, {
				className: "size-3 shrink-0"
			}), s[0] = e) : e = s[0];
			let l = r ?? "Organization";
			return s[1] !== l ? (a = (0, t.jsxs)(eN.f, {
				variant: "default",
				className: "max-w-40 gap-1",
				children: [e, (0, t.jsx)("span", {
					className: "truncate",
					children: l
				})]
			}), s[1] = l, s[2] = a) : a = s[2], a
		}
		return s[3] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsxs)(eN.f, {
			variant: "secondary",
			className: "gap-1",
			children: [(0, t.jsx)(o, {
				className: "size-3"
			}), "Private"]
		}), s[3] = l) : l = s[3], l
	}
	let eS = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw";

	function eC(e) {
		let n, l, s, i, r, o, c, d, u, x, p, g, v, j, y, b, N, w, S, C, k = (0, a.c)(54),
			{
				preset: U,
				isOwn: _,
				onOpen: F
			} = e,
			z = (0, ed.O)(U.id),
			[P, T] = (0, h.useState)(!1),
			D = U.modelFamily ? I.C[U.modelFamily] : "Any model",
			O = _ ? "You" : U.creatorName ?? "Deleted user";
		k[0] !== U.updatedAt ? (n = et(new Date(U.updatedAt), {
			addSuffix: !0
		}), k[0] = U.updatedAt, k[1] = n) : n = k[1];
		let G = `updated ${n}`;
		k[2] !== D || k[3] !== O || k[4] !== G ? (l = [D, O, G], k[2] = D, k[3] = O, k[4] = G, k[5] = l) : l = k[5];
		let M = l.join(" · "),
			$ = `Open ${U.name}`;
		k[6] !== F || k[7] !== U ? (s = () => F(U), k[6] = F, k[7] = U, k[8] = s) : s = k[8];
		let A = U.name;
		k[9] !== U.organizationName || k[10] !== U.visibility ? (i = (0, t.jsx)(ew, {
			visibility: U.visibility,
			orgName: U.organizationName
		}), k[9] = U.organizationName, k[10] = U.visibility, k[11] = i) : i = k[11];
		let V = `Actions for ${U.name}`;
		return k[12] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)(en, {
			className: "size-4"
		}), k[12] = r) : r = k[12], k[13] !== V ? (o = (0, t.jsx)(eo.X, {
			asChild: !0,
			children: (0, t.jsx)(f.f, {
				variant: "ghost",
				size: "icon",
				className: "relative size-8 text-muted-foreground pointer-coarse:after:absolute pointer-coarse:after:-inset-2 pointer-coarse:after:content-['']",
				"aria-label": V,
				children: r
			})
		}), k[13] = V, k[14] = o) : o = k[14], k[15] !== F || k[16] !== U ? (c = () => F(U), k[15] = F, k[16] = U, k[17] = c) : c = k[17], k[18] === Symbol.for("react.memo_cache_sentinel") ? (d = (0, t.jsx)(es.f, {}), k[18] = d) : d = k[18], k[19] !== c ? (u = (0, t.jsxs)(eo.r, {
			onSelect: c,
			children: [d, "Edit"]
		}), k[19] = c, k[20] = u) : u = k[20], k[21] !== U ? (x = ec(U), k[21] = U, k[22] = x) : x = k[22], k[23] === Symbol.for("react.memo_cache_sentinel") ? (p = (0, t.jsx)(ei.f, {}), k[23] = p) : p = k[23], k[24] !== x ? (g = (0, t.jsx)(eo.r, {
			asChild: !0,
			children: (0, t.jsxs)(m.default, {
				href: x,
				children: [p, "Test in Playground"]
			})
		}), k[24] = x, k[25] = g) : g = k[25], k[26] === Symbol.for("react.memo_cache_sentinel") ? (v = (0, t.jsx)(eo.U, {}), k[26] = v) : v = k[26], k[27] === Symbol.for("react.memo_cache_sentinel") ? (j = (0, t.jsxs)(eo.r, {
			variant: "destructive",
			onSelect: () => T(!0),
			children: [(0, t.jsx)(er.f, {}), "Delete"]
		}), k[27] = j) : j = k[27], k[28] !== u || k[29] !== g ? (y = (0, t.jsxs)(eo.L, {
			align: "end",
			children: [u, g, v, j]
		}), k[28] = u, k[29] = g, k[30] = y) : y = k[30], k[31] !== o || k[32] !== y ? (b = (0, t.jsxs)(eo.G, {
			children: [o, y]
		}), k[31] = o, k[32] = y, k[33] = b) : b = k[33], k[34] !== P || k[35] !== U ? (N = (0, t.jsx)(ef, {
			preset: U,
			open: P,
			onOpenChange: T
		}), k[34] = P, k[35] = U, k[36] = N) : N = k[36], k[37] !== b || k[38] !== N ? (w = (0, t.jsxs)(t.Fragment, {
			children: [b, N]
		}), k[37] = b, k[38] = N, k[39] = w) : w = k[39], k[40] !== U.generatedThumbnailUrl || k[41] !== U.imageUrl || k[42] !== U.name || k[43] !== U.prompt ? (S = U.generatedThumbnailUrl ? (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(eu, {
				src: U.generatedThumbnailUrl,
				alt: U.name,
				sizes: eS
			}), U.imageUrl && (0, t.jsx)(eh, {
				src: U.imageUrl,
				alt: "Reference image"
			})]
		}) : U.imageUrl ? (0, t.jsx)(eu, {
			src: U.imageUrl,
			alt: U.name,
			sizes: eS
		}) : U.prompt ? (0, t.jsx)(eb.f, {
			prompt: U.prompt
		}) : (0, t.jsx)("div", {
			className: "flex size-full items-center justify-center",
			children: (0, t.jsx)(el.f, {
				className: "size-8 text-muted-foreground/50"
			})
		}), k[40] = U.generatedThumbnailUrl, k[41] = U.imageUrl, k[42] = U.name, k[43] = U.prompt, k[44] = S) : S = k[44], k[45] !== z || k[46] !== M || k[47] !== U.name || k[48] !== w || k[49] !== S || k[50] !== $ || k[51] !== s || k[52] !== i ? (C = (0, t.jsx)(ev, {
			ariaLabel: $,
			onOpen: s,
			title: A,
			subtitle: M,
			isGenerating: z,
			aside: i,
			menu: w,
			cover: S
		}), k[45] = z, k[46] = M, k[47] = U.name, k[48] = w, k[49] = S, k[50] = $, k[51] = s, k[52] = i, k[53] = C) : C = k[53], C
	}
	var ek = e.i(281731),
		eU = e.i(685808),
		e_ = e.i(540580),
		eF = e.i(976311);

	function ez(e) {
		let n, l, s, i, r, o, c, d, m = (0, a.c)(31),
			{
				tree: u,
				selection: x,
				onSelect: f,
				folders: p,
				readOnly: g
			} = e,
			v = void 0 !== g && g;
		m[0] !== x ? (n = (0, z.l)(x), m[0] = x, m[1] = n) : n = m[1];
		let j = n;
		m[2] === Symbol.for("react.memo_cache_sentinel") ? (l = new Set, m[2] = l) : l = m[2];
		let [y, b] = (0, h.useState)(l);
		m[3] === Symbol.for("react.memo_cache_sentinel") ? (s = e => b(t => {
			let a = new Set(t);
			return a.has(e) ? a.delete(e) : a.add(e), a
		}), m[3] = s) : s = m[3];
		let w = s,
			S = "all" === j;
		if (m[4] !== f ? (i = () => f({
				kind: "all"
			}), m[4] = f, m[5] = i) : i = m[5], m[6] !== S || m[7] !== i || m[8] !== u.total ? (r = (0, t.jsx)(eP, {
				label: "All presets",
				count: u.total,
				active: S,
				onSelect: i
			}), m[6] = S, m[7] = i, m[8] = u.total, m[9] = r) : r = m[9], m[10] !== j || m[11] !== y || m[12] !== p || m[13] !== f || m[14] !== v || m[15] !== u.families) {
			let e;
			m[17] !== j || m[18] !== y || m[19] !== p || m[20] !== f || m[21] !== v ? (e = e => {
				let a = !y.has(e.family);
				return (0, t.jsxs)(eF.Y, {
					open: a,
					onOpenChange: () => w(e.family),
					children: [(0, t.jsxs)("div", {
						className: "flex items-center",
						children: [(0, t.jsx)(eF.v, {
							"aria-label": `${I.C[e.family]} folders`,
							className: "flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary",
							children: (0, t.jsx)(eU.f, {
								className: (0, N.c)("size-3.5 transition-transform", a && "rotate-90")
							})
						}), (0, t.jsx)(eP, {
							label: I.C[e.family],
							count: e.total,
							active: j === `family:${e.family}`,
							onSelect: () => f({
								kind: "family",
								family: e.family
							}),
							className: "font-medium"
						})]
					}), (0, t.jsx)(eF.C, {
						className: "data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden",
						children: (0, t.jsxs)("div", {
							className: "ml-6 space-y-1 border-l pl-2",
							children: [e.showDefault && (0, t.jsx)(eP, {
								label: z.p,
								count: e.defaultCount,
								active: j === `default:${e.family}`,
								onSelect: () => f({
									kind: "default",
									family: e.family
								})
							}), e.folders.map(a => (0, t.jsx)(eP, {
								label: a.name,
								count: a.count,
								active: j === `folder:${a.id}`,
								onSelect: () => f({
									kind: "folder",
									family: e.family,
									folderId: a.id
								}),
								actions: v ? void 0 : (0, t.jsx)(eI, {
									folder: p?.find(e => e.id === a.id),
									count: a.count
								})
							}, a.id))]
						})
					})]
				}, e.family)
			}, m[17] = j, m[18] = y, m[19] = p, m[20] = f, m[21] = v, m[22] = e) : e = m[22], o = u.families.map(e), m[10] = j, m[11] = y, m[12] = p, m[13] = f, m[14] = v, m[15] = u.families, m[16] = o
		} else o = m[16];
		return m[23] !== j || m[24] !== f || m[25] !== u.anyModelCount ? (c = u.anyModelCount > 0 && (0, t.jsx)(eP, {
			label: "Any model",
			count: u.anyModelCount,
			active: "any-model" === j,
			onSelect: () => f({
				kind: "any-model"
			})
		}), m[23] = j, m[24] = f, m[25] = u.anyModelCount, m[26] = c) : c = m[26], m[27] !== r || m[28] !== o || m[29] !== c ? (d = (0, t.jsxs)("nav", {
			"aria-label": "Preset folders",
			className: "space-y-1 text-sm",
			children: [r, o, c]
		}), m[27] = r, m[28] = o, m[29] = c, m[30] = d) : d = m[30], d
	}

	function eP(e) {
		let n, l, s, i, r = (0, a.c)(14),
			{
				label: o,
				count: c,
				active: d,
				onSelect: m,
				actions: u,
				className: h
			} = e,
			x = d ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60";
		r[0] !== h || r[1] !== x ? (n = (0, N.c)("group/row flex min-w-0 flex-1 items-center gap-1 rounded-md pr-2 transition-colors", x, h), r[0] = h, r[1] = x, r[2] = n) : n = r[2];
		let f = d ? "true" : void 0;
		return r[3] !== o || r[4] !== m || r[5] !== f ? (l = (0, t.jsx)("button", {
			type: "button",
			onClick: m,
			"aria-current": f,
			className: "min-w-0 flex-1 truncate py-1.5 pl-2 text-left",
			children: o
		}), r[3] = o, r[4] = m, r[5] = f, r[6] = l) : l = r[6], r[7] !== u || r[8] !== c ? (s = u ?? (0, t.jsx)(eT, {
			count: c
		}), r[7] = u, r[8] = c, r[9] = s) : s = r[9], r[10] !== n || r[11] !== l || r[12] !== s ? (i = (0, t.jsxs)("div", {
			className: n,
			children: [l, s]
		}), r[10] = n, r[11] = l, r[12] = s, r[13] = i) : i = r[13], i
	}

	function eT(e) {
		let n, l, s = (0, a.c)(5),
			{
				count: i,
				className: r
			} = e;
		return s[0] !== r ? (n = (0, N.c)("w-6 shrink-0 text-right text-xs tabular-nums text-muted-foreground", r), s[0] = r, s[1] = n) : n = s[1], s[2] !== i || s[3] !== n ? (l = (0, t.jsx)("span", {
			className: n,
			children: i
		}), s[2] = i, s[3] = n, s[4] = l) : l = s[4], l
	}

	function eD(e) {
		let n, l, s, i, r, o, c, d, m, u, h, x = (0, a.c)(31),
			{
				tree: p,
				selection: g,
				onSelect: j,
				folders: y
			} = e;
		if (x[0] === Symbol.for("react.memo_cache_sentinel") ? (n = {
				kind: "all"
			}, x[0] = n) : n = x[0], x[1] !== p.total ? (l = {
				key: "all",
				label: "All presets",
				count: p.total,
				selection: n
			}, x[1] = p.total, x[2] = l) : l = x[2], x[3] !== l || x[4] !== p.anyModelCount || x[5] !== p.families) {
			let e;
			x[7] !== p.anyModelCount ? (e = p.anyModelCount > 0 ? [{
				key: "any-model",
				label: "Any model",
				count: p.anyModelCount,
				selection: {
					kind: "any-model"
				}
			}] : [], x[7] = p.anyModelCount, x[8] = e) : e = x[8], s = [l, ...p.families.flatMap(eG), ...e], x[3] = l, x[4] = p.anyModelCount, x[5] = p.families, x[6] = s
		} else s = x[6];
		let b = s;
		x[9] !== y || x[10] !== g.folderId || x[11] !== g.kind ? (i = "folder" === g.kind ? y?.find(e => e.id === g.folderId) : void 0, x[9] = y, x[10] = g.folderId, x[11] = g.kind, x[12] = i) : i = x[12];
		let N = i,
			w = "folder" === g.kind ? b.find(e => e.key === `folder:${g.folderId}`)?.count ?? 0 : 0;
		return x[13] !== g ? (r = (0, z.l)(g), x[13] = g, x[14] = r) : r = x[14], x[15] !== j || x[16] !== b ? (o = e => {
			let t = b.find(t => t.key === e);
			t && j(t.selection)
		}, x[15] = j, x[16] = b, x[17] = o) : o = x[17], x[18] === Symbol.for("react.memo_cache_sentinel") ? (c = (0, t.jsx)(v.P, {
			className: "min-w-0 flex-1",
			children: (0, t.jsx)(v.U, {})
		}), x[18] = c) : c = x[18], x[19] !== b ? (d = (0, t.jsx)(v.r, {
			children: b.map(eO)
		}), x[19] = b, x[20] = d) : d = x[20], x[21] !== r || x[22] !== o || x[23] !== d ? (m = (0, t.jsxs)(v.d, {
			value: r,
			onValueChange: o,
			children: [c, d]
		}), x[21] = r, x[22] = o, x[23] = d, x[24] = m) : m = x[24], x[25] !== N || x[26] !== w ? (u = N && (0, t.jsx)(eM, {
			folder: N,
			count: w,
			trigger: (0, t.jsx)(f.f, {
				variant: "outline",
				size: "sm",
				className: "shrink-0 px-2",
				"aria-label": `${N.name} folder actions`,
				children: (0, t.jsx)(e_.f, {
					className: "size-4"
				})
			})
		}), x[25] = N, x[26] = w, x[27] = u) : u = x[27], x[28] !== u || x[29] !== m ? (h = (0, t.jsxs)("div", {
			className: "flex min-w-0 flex-1 items-center gap-2",
			children: [m, u]
		}), x[28] = u, x[29] = m, x[30] = h) : h = x[30], h
	}

	function eO(e) {
		return (0, t.jsxs)(v.T, {
			value: e.key,
			children: [e.label, " · ", e.count]
		}, e.key)
	}

	function eG(e) {
		return [{
			key: `family:${e.family}`,
			label: I.C[e.family],
			count: e.total,
			selection: {
				kind: "family",
				family: e.family
			}
		}, ...e.showDefault ? [{
			key: `default:${e.family}`,
			label: `${I.C[e.family]} \xb7 ${z.p}`,
			count: e.defaultCount,
			selection: {
				kind: "default",
				family: e.family
			}
		}] : [], ...e.folders.map(t => ({
			key: `folder:${t.id}`,
			label: `${I.C[e.family]} \xb7 ${t.name}`,
			count: t.count,
			selection: {
				kind: "folder",
				family: e.family,
				folderId: t.id
			}
		}))]
	}

	function eM(e) {
		let n, l, s, i, r, o, c, d, m, u, x, f, p, g = (0, a.c)(32),
			{
				folder: v,
				count: j,
				trigger: y,
				open: b,
				onOpenChange: N
			} = e,
			[w, S] = (0, h.useState)(!1),
			[C, U] = (0, h.useState)(!1),
			_ = (0, k.x)();
		g[0] !== y ? (n = (0, t.jsx)(eo.X, {
			asChild: !0,
			children: y
		}), g[0] = y, g[1] = n) : n = g[1], g[2] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsxs)(eo.r, {
			onSelect: () => S(!0),
			children: [(0, t.jsx)(es.f, {
				className: "size-4"
			}), "Rename"]
		}), g[2] = l) : l = g[2], g[3] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsxs)(eo.L, {
			align: "start",
			children: [l, (0, t.jsxs)(eo.r, {
				variant: "destructive",
				onSelect: () => U(!0),
				children: [(0, t.jsx)(er.f, {
					className: "size-4"
				}), "Delete"]
			})]
		}), g[3] = s) : s = g[3], g[4] !== N || g[5] !== b || g[6] !== n ? (i = (0, t.jsxs)(eo.G, {
			open: b,
			onOpenChange: N,
			children: [n, s]
		}), g[4] = N, g[5] = b, g[6] = n, g[7] = i) : i = g[7], g[8] !== v || g[9] !== w ? (r = w && (0, t.jsx)(H, {
			open: !0,
			onOpenChange: S,
			modelFamily: v.modelFamily,
			folder: v
		}), g[8] = v, g[9] = w, g[10] = r) : r = g[10], g[11] !== v.name ? (o = (0, t.jsxs)(ex.g, {
			children: ['Delete "', v.name, '"?']
		}), g[11] = v.name, g[12] = o) : o = g[12];
		let F = 0 === j ? "This folder is empty." : `${j} preset${1===j?"":"s"} will move to ${z.p}. The presets themselves are not deleted.`;
		return g[13] !== F ? (c = (0, t.jsx)(ex.I, {
			children: F
		}), g[13] = F, g[14] = c) : c = g[14], g[15] !== o || g[16] !== c ? (d = (0, t.jsxs)(ex.O, {
			children: [o, c]
		}), g[15] = o, g[16] = c, g[17] = d) : d = g[17], g[18] === Symbol.for("react.memo_cache_sentinel") ? (m = (0, t.jsx)(ex.D, {
			children: "Cancel"
		}), g[18] = m) : m = g[18], g[19] !== _ || g[20] !== v.id ? (u = (0, t.jsxs)(ex._, {
			children: [m, (0, t.jsx)(ex.s, {
				onClick: () => _.mutate(v.id),
				className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
				children: "Delete folder"
			})]
		}), g[19] = _, g[20] = v.id, g[21] = u) : u = g[21], g[22] !== u || g[23] !== d ? (x = (0, t.jsxs)(ex.B, {
			children: [d, u]
		}), g[22] = u, g[23] = d, g[24] = x) : x = g[24], g[25] !== C || g[26] !== x ? (f = (0, t.jsx)(ex.m, {
			open: C,
			onOpenChange: U,
			children: x
		}), g[25] = C, g[26] = x, g[27] = f) : f = g[27], g[28] !== f || g[29] !== i || g[30] !== r ? (p = (0, t.jsxs)(t.Fragment, {
			children: [i, r, f]
		}), g[28] = f, g[29] = i, g[30] = r, g[31] = p) : p = g[31], p
	}

	function eI(e) {
		let n, l, s, i, r, o, c, d = (0, a.c)(19),
			{
				folder: m,
				count: u
			} = e,
			[x, p] = (0, h.useState)(!1);
		if (!m) return null;
		let g = x ? "opacity-0" : "group-hover/row:opacity-0 group-focus-within/row:opacity-0";
		d[0] !== g ? (n = (0, N.c)("transition-opacity", g), d[0] = g, d[1] = n) : n = d[1], d[2] !== u || d[3] !== n ? (l = (0, t.jsx)(eT, {
			count: u,
			className: n
		}), d[2] = u, d[3] = n, d[4] = l) : l = d[4];
		let v = `${m.name} actions`,
			j = x ? "opacity-100" : "opacity-0 focus-visible:opacity-100 group-hover/row:opacity-100";
		return d[5] !== j ? (s = (0, N.c)("absolute inset-0 size-6 transition-opacity", j), d[5] = j, d[6] = s) : s = d[6], d[7] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(e_.f, {
			className: "size-3.5"
		}), d[7] = i) : i = d[7], d[8] !== v || d[9] !== s ? (r = (0, t.jsx)(f.f, {
			variant: "ghost",
			size: "icon",
			"aria-label": v,
			className: s,
			children: i
		}), d[8] = v, d[9] = s, d[10] = r) : r = d[10], d[11] !== u || d[12] !== m || d[13] !== x || d[14] !== r ? (o = (0, t.jsx)(eM, {
			folder: m,
			count: u,
			open: x,
			onOpenChange: p,
			trigger: r
		}), d[11] = u, d[12] = m, d[13] = x, d[14] = r, d[15] = o) : o = d[15], d[16] !== l || d[17] !== o ? (c = (0, t.jsxs)("span", {
			className: "relative flex size-6 shrink-0 items-center justify-end",
			children: [l, o]
		}), d[16] = l, d[17] = o, d[18] = c) : c = d[18], c
	}
	var e$ = e.i(110430);
	let eA = {
		name: "link-2",
		size: 24,
		node: [
			["path", {
				d: "M9 17H7A5 5 0 0 1 7 7h2",
				key: "8i5ue5"
			}],
			["path", {
				d: "M15 7h2a5 5 0 1 1 0 10h-2",
				key: "1b9ql8"
			}],
			["line", {
				x1: "8",
				x2: "16",
				y1: "12",
				y2: "12",
				key: "1jonct"
			}]
		]
	};
	eA.node;
	let eV = (0, l.f)(eA);
	var eL = e.i(546009),
		eE = e.i(716455);

	function eR(e) {
		let n, l, s, i, r, o, c, d, m, u, x, p, v, j, y = (0, a.c)(76),
			{
				presetId: b,
				presetName: N,
				seedPrompt: w,
				seedImageUrl: S,
				seedGeneratedThumbnailUrl: C,
				latestGeneratedThumbnailUrl: k,
				pendingGeneration: _,
				seedVersionId: F,
				seedModelFamily: z,
				seedEnhance: P,
				onPreviewChange: T,
				onGeneratingChange: D,
				onDone: G,
				saveSlot: M,
				deleteAction: I
			} = e,
			[$, V] = (0, h.useState)(w ?? ""),
			[L, R] = (0, h.useState)(S),
			[X, H] = (0, h.useState)(null),
			[Y, B] = (0, h.useState)(""),
			[W, K] = (0, h.useState)(z),
			[q, J] = (0, h.useState)(P),
			[Q, Z] = (0, h.useState)(F ?? void 0),
			ee = w ?? "";
		y[0] !== P || y[1] !== S || y[2] !== z || y[3] !== ee ? (n = {
			prompt: ee,
			imageUrl: S,
			modelFamily: z,
			enhance: P
		}, y[0] = P, y[1] = S, y[2] = z, y[3] = ee, y[4] = n) : n = y[4];
		let [et, ea] = (0, h.useState)(n), en = (0, U.Q)(b, N), el = (0, ed.N)(b, Q), es = $ === et.prompt && null === X && L === et.imageUrl;
		y[5] !== es || y[6] !== el ? (l = el ? {
			url: el,
			matchesDraftBaseline: es
		} : null, y[5] = es, y[6] = el, y[7] = l) : l = y[7];
		let ei = l,
			er = w ?? "";
		y[8] !== S || y[9] !== er ? (s = {
			prompt: er,
			imageFile: null,
			imageUrl: S
		}, y[8] = S, y[9] = er, y[10] = s) : s = y[10], y[11] === Symbol.for("react.memo_cache_sentinel") ? (i = e => {
			R(e), H(null)
		}, y[11] = i) : i = y[11], y[12] !== L || y[13] !== ei || y[14] !== X || y[15] !== D || y[16] !== T || y[17] !== _ || y[18] !== $ || y[19] !== C || y[20] !== s ? (r = {
			prompt: $,
			imageFile: X,
			existingImageUrl: L,
			seedPreviewUrl: C,
			seedSource: s,
			onImageHoisted: i,
			onGenerated: T,
			onGeneratingChange: D,
			pendingGeneration: _,
			externalPreview: ei
		}, y[12] = L, y[13] = ei, y[14] = X, y[15] = D, y[16] = T, y[17] = _, y[18] = $, y[19] = C, y[20] = s, y[21] = r) : r = y[21];
		let eo = (0, O.f)(r),
			ec = en.isPending || eo.isGenerating,
			em = eo.isDirty ? eo.previewUrl : ei?.url ?? k ?? eo.previewUrl,
			eu = $ !== et.prompt || null !== X || L !== et.imageUrl || W !== et.modelFamily || q !== et.enhance || eo.isDirty;
		y[22] !== L || y[23] !== X || y[24] !== $ ? (o = $.trim().length > 0 || null !== X || null !== L, y[22] = L, y[23] = X, y[24] = $, y[25] = o) : o = y[25];
		let eh = o,
			ex = eu && eh,
			ef = eu && !eh;
		y[26] !== em || y[27] !== en || y[28] !== q || y[29] !== L || y[30] !== X || y[31] !== W || y[32] !== Y || y[33] !== T || y[34] !== Q || y[35] !== eo || y[36] !== $ ? (c = () => {
			let e = eo.shouldGenerateOnSave;
			en.mutate({
				prompt: $.trim() || void 0,
				imageFile: X,
				existingImageUrl: L,
				regenerateThumbnail: e,
				existingGeneratedThumbnailUrl: em,
				note: Y.trim() || void 0,
				modelFamily: W,
				enhance: q,
				parentVersionId: Q,
				publish: !0
			}, {
				onSuccess: t => {
					V(t.prompt ?? ""), H(null), R(t.imageUrl), eo.commit({
						previewUrl: t.generatedThumbnailUrl,
						prompt: t.prompt ?? "",
						imageUrl: t.imageUrl,
						matchesSavedContent: !e
					}), T?.(e ? null : t.generatedThumbnailUrl), B(""), K(t.modelFamily), J(t.enhance), Z(t.id), ea({
						prompt: t.prompt ?? "",
						imageUrl: t.imageUrl,
						modelFamily: t.modelFamily,
						enhance: t.enhance
					})
				}
			})
		}, y[26] = em, y[27] = en, y[28] = q, y[29] = L, y[30] = X, y[31] = W, y[32] = Y, y[33] = T, y[34] = Q, y[35] = eo, y[36] = $, y[37] = c) : c = y[37];
		let ep = c;
		return y[38] === Symbol.for("react.memo_cache_sentinel") ? (d = () => R(null), y[38] = d) : d = y[38], y[39] !== ec || y[40] !== q || y[41] !== L || y[42] !== X || y[43] !== W || y[44] !== $ ? (m = (0, t.jsx)(A, {
			idPrefix: "preset-editor",
			prompt: $,
			onPromptChange: V,
			imageFile: X,
			onImageFileChange: H,
			existingImageUrl: L,
			onClearExistingImage: d,
			modelFamily: W,
			onModelFamilyChange: K,
			enhance: q,
			onEnhanceChange: J,
			disabled: ec
		}), y[39] = ec, y[40] = q, y[41] = L, y[42] = X, y[43] = W, y[44] = $, y[45] = m) : m = y[45], y[46] === Symbol.for("react.memo_cache_sentinel") ? (u = e => B(e.target.value), y[46] = u) : u = y[46], y[47] !== ec || y[48] !== Y ? (x = (0, t.jsx)(g.f, {
			value: Y,
			onChange: u,
			placeholder: "What changed? (optional note)",
			disabled: ec
		}), y[47] = ec, y[48] = Y, y[49] = x) : x = y[49], y[50] !== en.isPending || y[51] !== I || y[52] !== _ || y[53] !== eo.canGenerate || y[54] !== eo.generate || y[55] !== eo.generateOnSave || y[56] !== eo.isCurrent || y[57] !== eo.isGenerating || y[58] !== eo.previewUrl || y[59] !== eo.setGenerateOnSave ? (p = (0, t.jsx)(E.f, {
			idPrefix: "preset-editor",
			previewUrl: eo.previewUrl,
			isCurrent: eo.isCurrent,
			isGenerating: eo.isGenerating,
			canGenerate: eo.canGenerate,
			onGenerate: eo.generate,
			generateOnSave: eo.generateOnSave,
			onGenerateOnSaveChange: eo.setGenerateOnSave,
			disabled: en.isPending,
			pendingGeneration: _,
			hintAction: I
		}), y[50] = en.isPending, y[51] = I, y[52] = _, y[53] = eo.canGenerate, y[54] = eo.generate, y[55] = eo.generateOnSave, y[56] = eo.isCurrent, y[57] = eo.isGenerating, y[58] = eo.previewUrl, y[59] = eo.setGenerateOnSave, y[60] = p) : p = y[60], y[61] !== ec || y[62] !== ex || y[63] !== en.isPending || y[64] !== ep || y[65] !== eu || y[66] !== ef || y[67] !== G || y[68] !== eo.isGenerating || y[69] !== M ? (v = M && (0, eE.createPortal)((0, t.jsxs)(t.Fragment, {
			children: [eu && (0, t.jsx)("span", {
				className: "min-w-0 text-xs text-muted-foreground",
				children: ef ? "Add a prompt or image to save" : "Unsaved changes"
			}), (0, t.jsx)(f.f, {
				onClick: ex ? ep : G,
				disabled: ec || ef,
				className: "flex-1",
				children: en.isPending ? "Saving..." : eo.isGenerating ? "Generating preview..." : eu ? "Save new version" : "Done"
			})]
		}), M), y[61] = ec, y[62] = ex, y[63] = en.isPending, y[64] = ep, y[65] = eu, y[66] = ef, y[67] = G, y[68] = eo.isGenerating, y[69] = M, y[70] = v) : v = y[70], y[71] !== m || y[72] !== x || y[73] !== p || y[74] !== v ? (j = (0, t.jsxs)("div", {
			className: "space-y-4",
			children: [m, x, p, v]
		}), y[71] = m, y[72] = x, y[73] = p, y[74] = v, y[75] = j) : j = y[75], j
	}
	var eX = e.i(120384);

	function eH(e) {
		let n, l, s, i, r, o, c, d, m, u, h, x, p, g, v, j, y = (0, a.c)(56),
			{
				version: b,
				versionNumber: N,
				isPublished: w,
				isSelected: S,
				canWrite: C,
				canDelete: k,
				onSelect: U,
				onPublish: _,
				onDelete: F
			} = e,
			z = b.generatedThumbnailUrl ?? b.imageUrl,
			P = `Load version ${N}`;
		y[0] !== U || y[1] !== b || y[2] !== N ? (n = () => U(b, N), l = e => {
			("Enter" === e.key || " " === e.key) && (e.preventDefault(), U(b, N))
		}, y[0] = U, y[1] = b, y[2] = N, y[3] = n, y[4] = l) : (n = y[3], l = y[4]);
		let T = `w-full cursor-pointer flex-row gap-0 overflow-hidden p-0 transition-shadow ${S?"ring-2 ring-accent/60":"hover:ring-1 hover:ring-accent/40"}`;
		y[5] !== z || y[6] !== b.generatedThumbnailUrl || y[7] !== b.imageUrl || y[8] !== N ? (s = z && (0, t.jsxs)("div", {
			className: "relative h-auto w-24 shrink-0 self-stretch overflow-hidden bg-muted",
			children: [(0, t.jsx)(eu, {
				src: z,
				alt: `Version ${N}`,
				sizes: "96px"
			}), b.generatedThumbnailUrl && b.imageUrl && (0, t.jsx)(eh, {
				src: b.imageUrl,
				alt: "Reference image"
			})]
		}), y[5] = z, y[6] = b.generatedThumbnailUrl, y[7] = b.imageUrl, y[8] = N, y[9] = s) : s = y[9], y[10] !== N ? (i = (0, t.jsxs)("span", {
			className: "text-sm font-medium text-foreground",
			children: ["v", N]
		}), y[10] = N, y[11] = i) : i = y[11], y[12] !== w ? (r = w && (0, t.jsx)(eN.f, {
			className: "gap-1",
			children: "Current"
		}), y[12] = w, y[13] = r) : r = y[13], y[14] !== w || y[15] !== S ? (o = S && !w && (0, t.jsx)(eN.f, {
			variant: "outline",
			children: "Loaded"
		}), y[14] = w, y[15] = S, y[16] = o) : o = y[16], y[17] !== b.modelFamily ? (c = (0, t.jsx)(I.q, {
			family: b.modelFamily
		}), y[17] = b.modelFamily, y[18] = c) : c = y[18];
		let D = b.authorName ?? "Deleted user";
		return y[19] !== b.createdAt ? (d = et(new Date(b.createdAt), {
			addSuffix: !0
		}), y[19] = b.createdAt, y[20] = d) : d = y[20], y[21] !== D || y[22] !== d ? (m = (0, t.jsxs)("span", {
			className: "text-xs text-muted-foreground",
			children: [D, " ·", " ", d]
		}), y[21] = D, y[22] = d, y[23] = m) : m = y[23], y[24] !== m || y[25] !== i || y[26] !== r || y[27] !== o || y[28] !== c ? (u = (0, t.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-2 gap-y-1",
			children: [i, r, o, c, m]
		}), y[24] = m, y[25] = i, y[26] = r, y[27] = o, y[28] = c, y[29] = u) : u = y[29], y[30] !== b.prompt ? (h = b.prompt && (0, t.jsxs)("p", {
			className: "text-xs italic text-muted-foreground line-clamp-1",
			children: ["“", b.prompt, "”"]
		}), y[30] = b.prompt, y[31] = h) : h = y[31], y[32] !== b.note ? (x = b.note && (0, t.jsx)("p", {
			className: "text-xs text-foreground line-clamp-1",
			children: b.note
		}), y[32] = b.note, y[33] = x) : x = y[33], y[34] !== u || y[35] !== h || y[36] !== x ? (p = (0, t.jsxs)("div", {
			className: "min-w-0 flex-1 space-y-1",
			children: [u, h, x]
		}), y[34] = u, y[35] = h, y[36] = x, y[37] = p) : p = y[37], y[38] !== k || y[39] !== C || y[40] !== w || y[41] !== F || y[42] !== _ || y[43] !== b.id || y[44] !== N ? (g = C && !w && (0, t.jsxs)("div", {
			className: "flex shrink-0 items-center gap-1",
			children: [(0, t.jsxs)(ex.m, {
				children: [(0, t.jsx)(ex.t, {
					asChild: !0,
					children: (0, t.jsx)(f.f, {
						variant: "outline",
						size: "sm",
						className: "h-8 gap-1 px-2 text-xs sm:h-7",
						onClick: eK,
						children: "Use this version"
					})
				}), (0, t.jsxs)(ex.B, {
					onClick: eW,
					children: [(0, t.jsxs)(ex.O, {
						children: [(0, t.jsxs)(ex.g, {
							children: ["Go back to v", N, "?"]
						}), (0, t.jsxs)(ex.I, {
							children: ["v", N, " becomes the current version — everyone using this preset gets its content. Whatever is current now stays in the history."]
						})]
					}), (0, t.jsxs)(ex._, {
						children: [(0, t.jsx)(ex.D, {
							children: "Cancel"
						}), (0, t.jsx)(ex.s, {
							onClick: () => _(b.id),
							children: "Use this version"
						})]
					})]
				})]
			}), k && (0, t.jsxs)(ex.m, {
				children: [(0, t.jsx)(ex.t, {
					asChild: !0,
					children: (0, t.jsx)(f.f, {
						variant: "outline",
						size: "sm",
						"aria-label": `Delete version ${N}`,
						className: "h-8 gap-1 px-2 text-xs text-destructive hover:text-destructive sm:h-7",
						onClick: eB,
						children: (0, t.jsx)(er.f, {
							className: "size-3"
						})
					})
				}), (0, t.jsxs)(ex.B, {
					onClick: eY,
					children: [(0, t.jsxs)(ex.O, {
						children: [(0, t.jsxs)(ex.g, {
							children: ["Delete v", N, "?"]
						}), (0, t.jsx)(ex.I, {
							children: "This permanently removes the version from the history. There is no undo."
						})]
					}), (0, t.jsxs)(ex._, {
						children: [(0, t.jsx)(ex.D, {
							children: "Cancel"
						}), (0, t.jsx)(ex.s, {
							onClick: () => F(b.id),
							className: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
							children: "Delete"
						})]
					})]
				})]
			})]
		}), y[38] = k, y[39] = C, y[40] = w, y[41] = F, y[42] = _, y[43] = b.id, y[44] = N, y[45] = g) : g = y[45], y[46] !== p || y[47] !== g ? (v = (0, t.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col gap-2 p-2.5 sm:flex-row sm:items-center",
			children: [p, g]
		}), y[46] = p, y[47] = g, y[48] = v) : v = y[48], y[49] !== P || y[50] !== v || y[51] !== n || y[52] !== l || y[53] !== T || y[54] !== s ? (j = (0, t.jsxs)(eX.N, {
			role: "button",
			tabIndex: 0,
			"aria-label": P,
			onClick: n,
			onKeyDown: l,
			className: T,
			children: [s, v]
		}), y[49] = P, y[50] = v, y[51] = n, y[52] = l, y[53] = T, y[54] = s, y[55] = j) : j = y[55], j
	}

	function eY(e) {
		return e.stopPropagation()
	}

	function eB(e) {
		return e.stopPropagation()
	}

	function eW(e) {
		return e.stopPropagation()
	}

	function eK(e) {
		return e.stopPropagation()
	}

	function eq(e) {
		let n, l, s, i, r, o = (0, a.c)(35),
			{
				versions: c,
				publishedVersionId: d,
				selectedVersionId: m,
				canWrite: u,
				onSelect: h,
				onPublish: x,
				onDelete: f
			} = e;
		o[0] !== c ? (n = new Map([...c].sort((e, t) => {
			let a = new Date(e.createdAt).getTime() - new Date(t.createdAt).getTime();
			return 0 !== a ? a : e.id < t.id ? -1 : +(e.id > t.id)
		}).map((e, t) => [e.id, t + 1])), o[0] = c, o[1] = n) : n = o[1];
		let p = n;
		if (o[2] !== d || o[3] !== c) {
			let e;
			o[5] !== d ? (e = e => e.id === d, o[5] = d, o[6] = e) : e = o[6], l = c.find(e), o[2] = d, o[3] = c, o[4] = l
		} else l = o[4];
		let g = l;
		if (o[7] !== g || o[8] !== d || o[9] !== c) {
			let e;
			o[11] !== d ? (e = e => e.id !== d, o[11] = d, o[12] = e) : e = o[12];
			let t = c.filter(e);
			s = g ? [g, ...t] : t, o[7] = g, o[8] = d, o[9] = c, o[10] = s
		} else s = o[10];
		let v = s;
		if (0 === c.length) {
			let e;
			return o[13] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "No versions yet."
			}), o[13] = e) : e = o[13], e
		}
		if (o[14] !== u || o[15] !== f || o[16] !== x || o[17] !== h || o[18] !== v || o[19] !== d || o[20] !== m || o[21] !== p || o[22] !== c.length) {
			let e;
			o[24] !== u || o[25] !== f || o[26] !== x || o[27] !== h || o[28] !== d || o[29] !== m || o[30] !== p || o[31] !== c.length ? (e = e => (0, t.jsx)(eH, {
				version: e,
				versionNumber: p.get(e.id) ?? 0,
				isPublished: e.id === d,
				isSelected: e.id === m,
				canWrite: u,
				canDelete: c.length > 1,
				onSelect: h,
				onPublish: x,
				onDelete: f
			}, e.id), o[24] = u, o[25] = f, o[26] = x, o[27] = h, o[28] = d, o[29] = m, o[30] = p, o[31] = c.length, o[32] = e) : e = o[32], i = v.map(e), o[14] = u, o[15] = f, o[16] = x, o[17] = h, o[18] = v, o[19] = d, o[20] = m, o[21] = p, o[22] = c.length, o[23] = i
		} else i = o[23];
		return o[33] !== i ? (r = (0, t.jsx)("div", {
			className: "flex flex-col gap-2",
			children: i
		}), o[33] = i, o[34] = r) : r = o[34], r
	}

	function eJ(e) {
		let n, l, s, i, r, o, c, d = (0, a.c)(14),
			{
				preset: m,
				onOpenChange: u
			} = e,
			[x, f] = (0, h.useState)(!1),
			p = (0, h.useRef)(!1);
		d[0] === Symbol.for("react.memo_cache_sentinel") ? (n = e => {
			p.current = e, f(e)
		}, d[0] = n) : n = d[0];
		let g = n;
		return m ? (d[1] !== u ? (l = e => {
			(e || !p.current) && u(e)
		}, d[1] = u, d[2] = l) : l = d[2], d[3] === Symbol.for("react.memo_cache_sentinel") ? (s = e => {
			p.current && e.preventDefault()
		}, i = e => {
			p.current && e.preventDefault()
		}, d[3] = s, d[4] = i) : (s = d[3], i = d[4]), d[5] !== u ? (r = () => u(!1), d[5] = u, d[6] = r) : r = d[6], d[7] !== x || d[8] !== m || d[9] !== r ? (o = (0, t.jsx)(D.U, {
			side: "right",
			className: "w-full gap-2 sm:max-w-xl",
			onEscapeKeyDown: s,
			onInteractOutside: i,
			children: (0, t.jsx)(eZ, {
				listPreset: m,
				onClose: r,
				generatingPreview: x,
				onGeneratingPreviewChange: g
			}, m.id)
		}), d[7] = x, d[8] = m, d[9] = r, d[10] = o) : o = d[10], d[11] !== l || d[12] !== o ? (c = (0, t.jsx)(D.j, {
			open: !0,
			onOpenChange: l,
			children: o
		}), d[11] = l, d[12] = o, d[13] = c) : c = d[13], c) : null
	}

	function eQ(e) {
		let n, l, s = (0, a.c)(5),
			{
				state: i
			} = e;
		if (!i) return null;
		if ("failed" === i) {
			let e;
			return s[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("span", {
				className: "text-destructive text-xs",
				children: "Not saved"
			}), s[0] = e) : e = s[0], e
		}
		return s[1] !== i ? (n = "saving" === i ? "Saving..." : (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(e$.f, {
				className: "size-3"
			}), "Saved"]
		}), s[1] = i, s[2] = n) : n = s[2], s[3] !== n ? (l = (0, t.jsx)("span", {
			className: "flex items-center gap-1 text-xs text-muted-foreground",
			children: n
		}), s[3] = n, s[4] = l) : l = s[4], l
	}

	function eZ({
		listPreset: e,
		onClose: a,
		generatingPreview: n,
		onGeneratingPreviewChange: l
	}) {
		let {
			data: s
		} = (0, U.c)(e.id), i = s?.preset ?? e, r = s?.versions, o = s?.permissions, c = (0, U.p)(i.id), d = (0, U.M)(i.id), u = (0, U.W)(i.id), p = (0, F.m)(), y = null !== p, {
			data: b
		} = (0, k.e)(), [N, w] = (0, h.useState)(null), S = (0, h.useRef)(0), [C, _] = (0, h.useState)(i.name), [z, P] = (0, h.useState)(!1), [O, G] = (0, h.useState)(null), [M, I] = (0, h.useState)(null), [$, A] = (0, h.useState)(!1), V = !!(o?.canChangeVisibility && (i.organizationId || y)), [E, X] = (0, h.useState)({}), H = (0, h.useRef)({});
		(0, h.useEffect)(() => () => {
			for (let e of Object.values(H.current)) e && clearTimeout(e)
		}, []);
		let Y = (e, t) => X(a => ({
				...a,
				[e]: t
			})),
			B = e => E[e] ?? null,
			W = async (e, t, a) => {
				Y(e, "saving");
				let n = H.current[e];
				n && clearTimeout(n);
				try {
					let {
						preset: n
					} = await c.mutateAsync(t);
					return a?.(n), Y(e, "saved"), H.current[e] = setTimeout(() => {
						X(t => "saved" === t[e] ? {
							...t,
							[e]: null
						} : t)
					}, 2e3), !0
				} catch {
					return Y(e, "failed"), !1
				}
			}, K = N ?? {
				prompt: i.prompt,
				imageUrl: i.imageUrl,
				generatedThumbnailUrl: i.generatedThumbnailUrl,
				modelFamily: i.modelFamily,
				enhance: i.enhance,
				versionId: i.publishedVersionId,
				key: "live"
			}, q = O?.key === K.key ? O.url : K.generatedThumbnailUrl ?? null, J = (0, ed.O)(i.id), Q = J && !N, Z = async () => {
				await navigator.clipboard.writeText(`${window.location.origin}/studio?preset=${i.id}`), P(!0), x.c.success("Link copied — anyone in your organization can open it"), setTimeout(() => P(!1), 2e3)
			};
		return (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsxs)(D.D, {
				className: "border-b pb-3",
				children: [(0, t.jsx)(D.L, {
					className: "truncate pr-6",
					children: i.name
				}), (0, t.jsxs)(D.c, {
					children: ["Created by ", i.creatorName ?? "Deleted user", " · updated", " ", et(new Date(i.updatedAt), {
						addSuffix: !0
					}), void 0 !== r && ` \xb7 ${r.length} version${1===r.length?"":"s"}`]
				})]
			}), (0, t.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-4 overflow-y-auto px-4 pb-6",
				children: [(q || Q) && (0, t.jsxs)("div", {
					className: "relative mx-auto w-full max-w-xs",
					children: [q ? (0, t.jsx)(R.f, {
						previewUrl: q,
						alt: `${i.name} preview`,
						className: "w-full"
					}) : (0, t.jsx)(j.f, {
						className: "aspect-video w-full"
					}), Q && (0, t.jsx)(eg, {})]
				}), (0, t.jsxs)("div", {
					className: "space-y-2",
					children: [(0, t.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [(0, t.jsx)(T.f, {
							htmlFor: "preset-name",
							children: "Name"
						}), (0, t.jsx)(eQ, {
							state: B("name")
						})]
					}), (0, t.jsx)(g.f, {
						id: "preset-name",
						value: C,
						onChange: e => _(e.target.value),
						onBlur: () => {
							let e = C.trim();
							if (!e) return void _(i.name);
							if (e === i.name) return;
							let t = i.name;
							W("name", {
								name: e
							}).then(a => {
								a || _(a => a === e ? t : a)
							})
						},
						onKeyDown: e => "Enter" === e.key && e.currentTarget.blur(),
						maxLength: 200,
						"data-1p-ignore": !0,
						autoComplete: "off"
					})]
				}), (0, t.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [(0, t.jsxs)(eL.W, {
						children: [(0, t.jsx)(eL.y, {
							asChild: !0,
							children: (0, t.jsxs)("div", {
								className: "min-w-0 space-y-2",
								children: [(0, t.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [(0, t.jsx)(T.f, {
										children: "Visibility"
									}), (0, t.jsx)(eQ, {
										state: B("visibility")
									})]
								}), (0, t.jsxs)(v.d, {
									value: i.visibility,
									onValueChange: e => {
										let t, a;
										return t = i.organizationName ?? p?.name, a = i.folderId, void W("visibility", {
											visibility: e
										}, n => {
											x.c.success("org" === e ? `Shared with ${t??"your organization"} — all members can view and edit it` : "Now private — only you can see it"), a && !n.folderId && x.c.info("Moved to General — its folder isn't shared with the new audience.")
										})
									},
									disabled: !V || c.isPending,
									children: [(0, t.jsx)(v.P, {
										className: "w-full",
										children: (0, t.jsx)(v.U, {})
									}), (0, t.jsxs)(v.r, {
										children: [(0, t.jsx)(v.T, {
											value: "private",
											children: "Private — only you"
										}), (0, t.jsx)(v.T, {
											value: "org",
											children: `${i.organizationName??p?.name??"Organization"} — all members`
										})]
									})]
								})]
							})
						}), !V && (0, t.jsx)(eL.Y, {
							side: "left",
							children: o?.canChangeVisibility ? "Join an organization to share presets" : "Only the preset's creator can change visibility"
						})]
					}), (0, t.jsx)("div", {
						className: "min-w-0",
						children: (0, t.jsx)(L.f, {
							idPrefix: "preset-sheet",
							folders: b,
							value: i.folderId,
							onChange: e => void W("folder", {
								folderId: e
							}),
							labelAdornment: (0, t.jsx)(eQ, {
								state: B("folder")
							}),
							modelFamily: i.modelFamily,
							organizationId: i.organizationId,
							visibility: i.visibility,
							disabled: !o?.canWrite || c.isPending
						})
					})]
				}), (0, t.jsx)("div", {
					className: "space-y-3 border-t pt-4",
					children: (0, t.jsx)(eR, {
						presetId: i.id,
						presetName: i.name,
						seedPrompt: K.prompt,
						seedImageUrl: K.imageUrl,
						seedGeneratedThumbnailUrl: K.generatedThumbnailUrl,
						latestGeneratedThumbnailUrl: N ? N.generatedThumbnailUrl : i.generatedThumbnailUrl,
						pendingGeneration: J,
						seedVersionId: K.versionId,
						seedModelFamily: K.modelFamily,
						seedEnhance: K.enhance,
						onPreviewChange: e => G(e ? {
							key: K.key,
							url: e
						} : null),
						onGeneratingChange: l,
						onDone: a,
						saveSlot: M,
						deleteAction: o?.canWrite ? (0, t.jsxs)(f.f, {
							variant: "outline",
							size: "sm",
							className: "text-destructive hover:text-destructive",
							onClick: () => A(!0),
							children: [(0, t.jsx)(er.f, {
								className: "size-4"
							}), "Delete"]
						}) : void 0
					}, K.key)
				}), (0, t.jsx)(ef, {
					preset: i,
					open: $,
					onOpenChange: A,
					onDeleted: a
				}), "org" === i.visibility && (0, t.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: (0, t.jsxs)(f.f, {
						variant: "outline",
						size: "sm",
						onClick: Z,
						children: [z ? (0, t.jsx)(e$.f, {
							className: "size-4"
						}) : (0, t.jsx)(eV, {
							className: "size-4"
						}), "Copy link"]
					})
				}), (0, t.jsxs)("div", {
					className: "space-y-3 border-t pt-4",
					children: [(0, t.jsx)("h3", {
						className: "text-sm font-medium text-foreground",
						children: "Version history"
					}), r ? (0, t.jsx)(eq, {
						versions: r,
						publishedVersionId: i.publishedVersionId,
						selectedVersionId: K.versionId,
						canWrite: o?.canWrite ?? !1,
						onSelect: (e, t) => {
							n ? x.c.info("Wait for the preview to finish generating") : (S.current += 1, G(null), w({
								prompt: e.prompt,
								imageUrl: e.imageUrl,
								generatedThumbnailUrl: e.generatedThumbnailUrl,
								modelFamily: e.modelFamily,
								enhance: e.enhance,
								versionId: e.id,
								key: `view-${e.id}-${S.current}`
							}), x.c.info(`v${t} loaded — edit and save to create a new version from it`))
						},
						onPublish: e => d.mutate(e),
						onDelete: e => u.mutate(e)
					}) : (0, t.jsx)(j.f, {
						className: "h-20 w-full rounded-lg"
					})]
				})]
			}), (0, t.jsxs)(D.J, {
				className: "gap-2 border-t px-4 py-3 sm:flex-row sm:items-center sm:gap-3",
				style: {
					paddingBottom: "calc(var(--spacing) * 3 + env(safe-area-inset-bottom))"
				},
				children: [n ? (0, t.jsxs)(f.f, {
					variant: "outline",
					disabled: !0,
					children: [(0, t.jsx)(ei.f, {
						className: "size-4"
					}), "Test in Playground"]
				}) : (0, t.jsx)(f.f, {
					variant: "outline",
					asChild: !0,
					children: (0, t.jsxs)(m.default, {
						href: ec(i),
						children: [(0, t.jsx)(ei.f, {
							className: "size-4"
						}), "Test in Playground"]
					})
				}), (0, t.jsx)("div", {
					ref: I,
					className: "flex w-full min-w-0 flex-1 items-center gap-3"
				})]
			})]
		})
	}

	function e0(e) {
		let n, l, s, i = (0, a.c)(16),
			{
				template: r,
				onPeek: o
			} = e,
			c = r.generatedThumbnailUrl ?? r.imageUrl ?? r.thumbnailUrl,
			d = !!(r.generatedThumbnailUrl && r.imageUrl),
			m = r.modelFamily ? I.C[r.modelFamily] : "Any model",
			u = `Preview ${r.name}`;
		i[0] !== o || i[1] !== r ? (n = () => o(r), i[0] = o, i[1] = r, i[2] = n) : n = i[2];
		let h = r.description.length > 0 ? `${m} \xb7 ${r.description}` : `${m} \xb7 Template`;
		return i[3] !== c || i[4] !== d || i[5] !== r.generatedThumbnailUrl || i[6] !== r.imageUrl || i[7] !== r.name || i[8] !== r.prompt ? (l = c ? (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(eu, {
				src: c,
				alt: r.name,
				sizes: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
			}), d && r.imageUrl && (0, t.jsx)(eh, {
				src: r.imageUrl,
				alt: "Reference image"
			}), !r.imageUrl && !r.generatedThumbnailUrl && (0, t.jsx)(eN.f, {
				variant: "secondary",
				className: "absolute bottom-2 left-2",
				children: "Prompt preset"
			})]
		}) : (0, t.jsx)(eb.f, {
			prompt: r.prompt
		}), i[3] = c, i[4] = d, i[5] = r.generatedThumbnailUrl, i[6] = r.imageUrl, i[7] = r.name, i[8] = r.prompt, i[9] = l) : l = i[9], i[10] !== u || i[11] !== n || i[12] !== h || i[13] !== l || i[14] !== r.name ? (s = (0, t.jsx)(ev, {
			ariaLabel: u,
			onOpen: n,
			title: r.name,
			subtitle: h,
			cover: l
		}), i[10] = u, i[11] = n, i[12] = h, i[13] = l, i[14] = r.name, i[15] = s) : s = i[15], s
	}
	let e1 = {
		name: "pencil-line",
		size: 24,
		node: [
			["path", {
				d: "M13 21h8",
				key: "1jsn5i"
			}],
			["path", {
				d: "m15 5 4 4",
				key: "1mk7zo"
			}],
			["path", {
				d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
				key: "1a8usu"
			}]
		]
	};
	e1.node;
	let e2 = (0, l.f)(e1);

	function e3({
		template: e,
		onOpenChange: a,
		onCustomize: n,
		onSaved: l
	}) {
		let s = (0, _.j)(),
			[i, r] = (0, h.useState)(!1),
			[o, c] = (0, h.useState)(!0);
		if (!e) return null;
		let d = !e.generatedThumbnailUrl && e.prompt.trim().length > 0,
			m = async () => {
				r(!0);
				try {
					await n(e)
				} finally {
					r(!1)
				}
			};
		return (0, t.jsx)(D.j, {
			open: !0,
			onOpenChange: e => {
				(e || !s.isPending) && a(e)
			},
			children: (0, t.jsxs)(D.U, {
				side: "right",
				className: "w-full overflow-y-auto sm:max-w-md",
				children: [(0, t.jsxs)(D.D, {
					children: [(0, t.jsx)(D.L, {
						className: "pr-6",
						children: e.name
					}), (0, t.jsx)(D.c, {
						children: "Decart quickstart template — save it to your presets as-is, or customize it first."
					})]
				}), (0, t.jsxs)("div", {
					className: "space-y-4 px-4",
					children: [e.generatedThumbnailUrl && (0, t.jsx)(R.f, {
						previewUrl: e.generatedThumbnailUrl,
						alt: `${e.name} preview`
					}), (0, t.jsxs)(eL.W, {
						children: [(0, t.jsx)(eL.y, {
							asChild: !0,
							children: (0, t.jsxs)("div", {
								className: "space-y-4",
								children: [(0, t.jsxs)("div", {
									className: "space-y-2",
									children: [(0, t.jsx)(T.f, {
										htmlFor: "template-peek-name",
										children: "Name"
									}), (0, t.jsx)(g.f, {
										id: "template-peek-name",
										value: e.name,
										disabled: !0,
										readOnly: !0
									})]
								}), (0, t.jsx)(A, {
									idPrefix: "template-peek",
									prompt: e.prompt,
									onPromptChange: () => {},
									imageFile: null,
									onImageFileChange: () => {},
									existingImageUrl: e.imageUrl,
									modelFamily: e.modelFamily,
									onModelFamilyChange: () => {},
									enhance: e.enhance,
									onEnhanceChange: () => {},
									disabled: !0
								})]
							})
						}), (0, t.jsx)(eL.Y, {
							side: "left",
							children: "Read-only template — save it to your presets to make changes"
						})]
					})]
				}), (0, t.jsxs)(D.J, {
					children: [d && (0, t.jsxs)("div", {
						className: "space-y-1 pb-1",
						children: [(0, t.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [(0, t.jsx)(G.f, {
								id: "template-peek-thumbnail",
								checked: o,
								onCheckedChange: c,
								disabled: s.isPending || i
							}), (0, t.jsx)(T.f, {
								htmlFor: "template-peek-thumbnail",
								className: "text-sm text-muted-foreground",
								children: "Generate preview thumbnail"
							})]
						}), (0, t.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: ["Applies this preset to a sample image (~", (0, P.H)(), " credit)."]
						})]
					}), (0, t.jsx)(f.f, {
						onClick: () => s.mutate({
							template: e,
							generateThumbnail: d && o
						}, {
							onSuccess: () => {
								l(), a(!1)
							}
						}),
						disabled: s.isPending || i,
						children: s.isPending ? "Saving..." : "Save to my presets"
					}), (0, t.jsxs)(f.f, {
						variant: "outline",
						onClick: m,
						disabled: s.isPending || i,
						children: [(0, t.jsx)(e2, {
							className: "size-4"
						}), i ? "Preparing..." : "Customize"]
					})]
				})]
			})
		})
	}
	let e4 = ["s1", "s2", "s3", "s4", "s5", "s6"];

	function e5(e) {
		let l, s, i, r, d, m = (0, a.c)(15),
			{
				source: u,
				hasValidOrg: h,
				visibilityFilter: x,
				onVisibilityFilterChange: f,
				search: p,
				onSearchChange: j,
				className: y
			} = e;
		return m[0] !== h || m[1] !== f || m[2] !== u || m[3] !== x ? (l = h && "templates" !== u && (0, t.jsxs)(v.d, {
			value: x,
			onValueChange: e => f(e),
			children: [(0, t.jsx)(v.P, {
				size: "sm",
				className: "w-fit gap-2",
				children: (0, t.jsx)(v.U, {})
			}), (0, t.jsxs)(v.r, {
				children: [(0, t.jsx)(v.T, {
					value: "all",
					children: "All visibility"
				}), (0, t.jsx)(v.T, {
					value: "private",
					children: (0, t.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [(0, t.jsx)(o, {
							className: "size-3.5"
						}), "Private"]
					})
				}), (0, t.jsx)(v.T, {
					value: "org",
					children: (0, t.jsxs)("span", {
						className: "flex items-center gap-2",
						children: [(0, t.jsx)(n.f, {
							className: "size-3.5"
						}), "Organization"]
					})
				})]
			})]
		}), m[0] = h, m[1] = f, m[2] = u, m[3] = x, m[4] = l) : l = m[4], m[5] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)(c.f, {
			className: "absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
		}), m[5] = s) : s = m[5], m[6] !== j ? (i = e => j(e.target.value), m[6] = j, m[7] = i) : i = m[7], m[8] !== p || m[9] !== i ? (r = (0, t.jsxs)("div", {
			className: "relative sm:w-64",
			children: [s, (0, t.jsx)(g.f, {
				placeholder: "Search all presets...",
				value: p,
				onChange: i,
				className: "pl-9"
			})]
		}), m[8] = p, m[9] = i, m[10] = r) : r = m[10], m[11] !== y || m[12] !== l || m[13] !== r ? (d = (0, t.jsxs)("div", {
			className: y,
			children: [l, r]
		}), m[11] = y, m[12] = l, m[13] = r, m[14] = d) : d = m[14], d
	}
	let e6 = [{
		value: "all",
		label: "All presets"
	}, {
		value: "templates",
		label: "Decart"
	}, {
		value: "mine",
		label: "Mine"
	}];

	function e7(e) {
		return (0, t.jsx)(j.f, {
			className: "aspect-4/3 rounded-field"
		}, e)
	}
	e.s(["PresetLibrary", 0, function() {
		let e, n, l, s, r, o, c, g, v, j, N, T, D, O, G, M, I, $, A, V, L, E, R, Y, B, W, K, q, J, Q, Z, ee, et, ea, en, el, es, ei, er, eo, ec, ed, em, eu, eh, ex, ef = (0, a.c)(158),
			{
				data: ep
			} = (0, U.a)(),
			eg = ep?.presets,
			{
				data: ev
			} = (0, _.U)(),
			ej = ev?.templates,
			{
				data: ey
			} = (0, k.e)(),
			{
				data: eb
			} = b.i.useSession(),
			eN = (0, F.I)(),
			[ew, eS] = (0, h.useState)(!1),
			[eU, e_] = (0, h.useState)(!1),
			[eF, eP] = (0, h.useState)(!1),
			[eT, eO] = (0, h.useState)(null),
			[eG, eM] = (0, h.useState)(""),
			eI = (0, u.useRouter)(),
			e$ = (0, u.useSearchParams)();
		ef[0] !== e$ ? (e = e$.get("preset"), ef[0] = e$, ef[1] = e) : e = ef[1];
		let eA = e;
		ef[2] !== e$ || ef[3] !== eA ? (n = eA ? null : e$.get("template"), ef[2] = e$, ef[3] = eA, ef[4] = n) : n = ef[4];
		let eV = n;
		ef[5] !== eg || ef[6] !== eA ? (l = eA ? eg?.find(e => e.id === eA) ?? null : null, ef[5] = eg, ef[6] = eA, ef[7] = l) : l = ef[7];
		let eL = l;
		ef[8] !== eV || ef[9] !== ej ? (s = eV ? ej?.find(e => e.id === eV) ?? null : null, ef[8] = eV, ef[9] = ej, ef[10] = s) : s = ef[10];
		let eE = s;
		ef[11] !== eI ? (r = e => eI.replace(`/studio?preset=${e.id}`, {
			scroll: !1
		}), ef[11] = eI, ef[12] = r) : r = ef[12];
		let eR = r;
		ef[13] !== eI ? (o = e => eI.replace(`/studio?template=${e.id}`, {
			scroll: !1
		}), ef[13] = eI, ef[14] = o) : o = ef[14];
		let eX = o;
		ef[15] !== eI ? (c = () => eI.replace("/studio", {
			scroll: !1
		}), ef[15] = eI, ef[16] = c) : c = ef[16];
		let eH = c,
			[eY, eB] = (0, h.useState)("all"),
			eW = "all" === eY;
		ef[17] === Symbol.for("react.memo_cache_sentinel") ? (g = {
			kind: "all"
		}, ef[17] = g) : g = ef[17];
		let [eK, eq] = (0, h.useState)(g), [eQ, eZ] = (0, h.useState)("all"), e1 = (0, h.useRef)(0);
		ef[18] !== eH ? (v = async e => {
			let t = e1.current = e1.current + 1,
				a = (0, _.L)(e.imageUrl),
				n = null;
			if (a) try {
				n = await (0, C.h)(e)
			} catch {
				x.c.warning("Couldn't load the template image — continuing without it")
			}
			t === e1.current && (eO({
				key: t,
				values: {
					name: e.name,
					prompt: e.prompt,
					imageFile: n,
					existingImageUrl: a ? void 0 : e.imageUrl,
					existingGeneratedThumbnailUrl: e.generatedThumbnailUrl,
					modelFamily: e.modelFamily,
					enhance: e.enhance
				}
			}), eS(!0), eH())
		}, ef[18] = eH, ef[19] = v) : v = ef[19];
		let e2 = v;
		ef[20] === Symbol.for("react.memo_cache_sentinel") ? (j = () => {
			eB("mine"), eq({
				kind: "all"
			}), eZ("all"), eM("")
		}, ef[20] = j) : j = ef[20];
		let e8 = j;
		ef[21] === Symbol.for("react.memo_cache_sentinel") ? (N = e => {
			eB(e), eq({
				kind: "all"
			})
		}, ef[21] = N) : N = ef[21];
		let e9 = N;
		ef[22] !== eG ? (T = eG.trim().toLowerCase(), ef[22] = eG, ef[23] = T) : T = ef[23];
		let te = T,
			tt = te.length > 0;
		e: {
			let e, t;
			if (!eg) {
				let e;
				ef[24] === Symbol.for("react.memo_cache_sentinel") ? (e = [], ef[24] = e) : e = ef[24], D = e;
				break e
			}
			let a = eN ? eQ : "all";ef[25] !== a || ef[26] !== eg ? (e = "all" === a ? eg : eg.filter(e => e.visibility === a), ef[25] = a, ef[26] = eg, ef[27] = e) : e = ef[27];
			let n = e;
			if (!te) {
				D = n;
				break e
			}
			if (ef[28] !== n || ef[29] !== te) {
				let e;
				ef[31] !== te ? (e = e => e.name.toLowerCase().includes(te) || e.prompt?.toLowerCase().includes(te), ef[31] = te, ef[32] = e) : e = ef[32], t = n.filter(e), ef[28] = n, ef[29] = te, ef[30] = t
			} else t = ef[30];D = t
		}
		let ta = D;
		t: {
			let e;
			if (!ej) {
				let e;
				ef[33] === Symbol.for("react.memo_cache_sentinel") ? (e = [], ef[33] = e) : e = ef[33], O = e;
				break t
			}
			if (!te) {
				O = ej;
				break t
			}
			if (ef[34] !== te || ef[35] !== ej) {
				let t;
				ef[37] !== te ? (t = e => e.name.toLowerCase().includes(te) || e.prompt.toLowerCase().includes(te) || e.description.toLowerCase().includes(te), ef[37] = te, ef[38] = t) : t = ef[38], e = ej.filter(t), ef[34] = te, ef[35] = ej, ef[36] = e
			} else e = ef[36];O = e
		}
		let tn = O;
		ef[39] !== eW || ef[40] !== ta || ef[41] !== tn || ef[42] !== eY ? (G = eW ? [...ta, ...tn] : "templates" === eY ? tn : ta, ef[39] = eW, ef[40] = ta, ef[41] = tn, ef[42] = eY, ef[43] = G) : G = ef[43];
		let tl = G;
		ef[44] !== ey || ef[45] !== eW || ef[46] !== eY || ef[47] !== ev?.folders ? (M = eW ? [] : "templates" === eY ? ev?.folders ?? [] : ey ?? [], ef[44] = ey, ef[45] = eW, ef[46] = eY, ef[47] = ev?.folders, ef[48] = M) : M = ef[48];
		let ts = M;
		ef[49] !== eR || ef[50] !== eX || ef[51] !== eb?.user?.id ? (I = e => "description" in e ? (0, t.jsx)(e0, {
			template: e,
			onPeek: eX
		}, e.id) : (0, t.jsx)(eC, {
			preset: e,
			isOwn: e.createdByUserId === eb?.user?.id,
			onOpen: eR
		}, e.id), ef[49] = eR, ef[50] = eX, ef[51] = eb?.user?.id, ef[52] = I) : I = ef[52];
		let ti = I,
			tr = "templates" === eY;
		ef[53] !== ts || ef[54] !== tl || ef[55] !== tr ? ($ = (0, z.g)(tl, ts, {
			hideEmptyFolders: tr
		}), ef[53] = ts, ef[54] = tl, ef[55] = tr, ef[56] = $) : $ = ef[56];
		let to = $,
			tc = eW || ("templates" === eY ? void 0 !== ev : void 0 !== ey);
		ef[57] !== ts || ef[58] !== tc || ef[59] !== eK ? (A = "folder" === eK.kind && tc && !ts.some(e => e.id === eK.folderId) ? {
			kind: "all"
		} : eK, ef[57] = ts, ef[58] = tc, ef[59] = eK, ef[60] = A) : A = ef[60];
		let td = A,
			tm = eW ? !eg || !ej : "templates" === eY ? !ej : !eg;
		ef[61] !== ts || ef[62] !== tl || ef[63] !== tt || ef[64] !== td ? (V = tt ? tl : (0, z.r)(tl, ts, td), ef[61] = ts, ef[62] = tl, ef[63] = tt, ef[64] = td, ef[65] = V) : V = ef[65];
		let tu = V,
			th = !eW && !tt && ("all" === td.kind || "family" === td.kind),
			tx = eT?.key ?? "blank",
			tf = eT?.values;
		return ef[66] !== ew || ef[67] !== tx || ef[68] !== tf ? (L = (0, t.jsx)(X, {
			open: ew,
			onOpenChange: eS,
			initialValues: tf
		}, tx), ef[66] = ew, ef[67] = tx, ef[68] = tf, ef[69] = L) : L = ef[69], ef[70] !== eH ? (E = e => !e && eH(), ef[70] = eH, ef[71] = E) : E = ef[71], ef[72] !== eL || ef[73] !== E ? (R = (0, t.jsx)(eJ, {
			preset: eL,
			onOpenChange: E
		}), ef[72] = eL, ef[73] = E, ef[74] = R) : R = ef[74], ef[75] !== eU || ef[76] !== td ? (Y = eU && (0, t.jsx)(H, {
			open: !0,
			onOpenChange: e_,
			modelFamily: "family" in td ? td.family : null
		}), ef[75] = eU, ef[76] = td, ef[77] = Y) : Y = ef[77], ef[78] !== eH ? (B = e => !e && eH(), ef[78] = eH, ef[79] = B) : B = ef[79], ef[80] !== e2 || ef[81] !== eE || ef[82] !== B ? (W = (0, t.jsx)(e3, {
			template: eE,
			onOpenChange: B,
			onCustomize: e2,
			onSaved: e8
		}), ef[80] = e2, ef[81] = eE, ef[82] = B, ef[83] = W) : W = ef[83], ef[84] === Symbol.for("react.memo_cache_sentinel") ? (K = (0, t.jsx)("h1", {
			className: "font-medium text-cloud text-xl tracking-[0.2px]",
			children: "Preset Studio"
		}), ef[84] = K) : K = ef[84], ef[85] === Symbol.for("react.memo_cache_sentinel") ? (q = (0, t.jsxs)("div", {
			className: "flex flex-col gap-1",
			children: [K, (0, t.jsxs)("p", {
				className: "max-w-2xl text-muted-foreground text-sm",
				children: ["Save the prompts and reference images you keep reusing, share them with your team, and roll back to any earlier version. Start from scratch, or build on a Decart Preset — then try any preset in the", " ", (0, t.jsx)(m.default, {
					href: "/models/lucy?tab=batch",
					className: "text-foreground underline underline-offset-4 hover:text-cloud",
					children: "model playground"
				}), "."]
			})]
		}), ef[85] = q) : q = ef[85], ef[86] === Symbol.for("react.memo_cache_sentinel") ? (J = (0, t.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [q, (0, t.jsx)(f.f, {
				className: "shrink-0 px-6",
				onClick: () => {
					e1.current = e1.current + 1, eO(null), eS(!0)
				},
				children: "Create Preset"
			})]
		}), ef[86] = J) : J = ef[86], ef[87] === Symbol.for("react.memo_cache_sentinel") ? (Q = e => e9(e), ef[87] = Q) : Q = ef[87], ef[88] !== eg ? (Z = e6.map(e => {
			let {
				value: a,
				label: n
			} = e;
			return (0, t.jsxs)(y.k, {
				variant: "underline",
				value: a,
				children: [n, "mine" === a && eg && eg.length > 0 && (0, t.jsx)(w, {
					count: eg.length
				})]
			}, a)
		}), ef[88] = eg, ef[89] = Z) : Z = ef[89], ef[90] !== Z ? (ee = (0, t.jsx)(y.U, {
			variant: "underline",
			className: "w-fit [&>*:first-child]:pl-0",
			children: Z
		}), ef[90] = Z, ef[91] = ee) : ee = ef[91], ef[92] !== eY || ef[93] !== ee ? (et = (0, t.jsx)(y.i, {
			value: eY,
			onValueChange: Q,
			className: "gap-0",
			children: ee
		}), ef[92] = eY, ef[93] = ee, ef[94] = et) : et = ef[94], ef[95] !== eN || ef[96] !== eG || ef[97] !== eY || ef[98] !== eQ ? (ea = (0, t.jsx)(e5, {
			className: "hidden gap-3 sm:flex sm:items-center",
			source: eY,
			hasValidOrg: eN,
			visibilityFilter: eQ,
			onVisibilityFilterChange: eZ,
			search: eG,
			onSearchChange: eM
		}), ef[95] = eN, ef[96] = eG, ef[97] = eY, ef[98] = eQ, ef[99] = ea) : ea = ef[99], ef[100] !== et || ef[101] !== ea ? (en = (0, t.jsxs)("div", {
			className: "sticky top-0 z-20 -mx-5 flex items-center justify-between gap-3 border-hairline border-b bg-background px-5",
			children: [et, ea]
		}), ef[100] = et, ef[101] = ea, ef[102] = en) : en = ef[102], ef[103] !== eN || ef[104] !== eG || ef[105] !== eY || ef[106] !== eQ ? (el = (0, t.jsx)(e5, {
			className: "flex flex-col gap-3 sm:hidden",
			source: eY,
			hasValidOrg: eN,
			visibilityFilter: eQ,
			onVisibilityFilterChange: eZ,
			search: eG,
			onSearchChange: eM
		}), ef[103] = eN, ef[104] = eG, ef[105] = eY, ef[106] = eQ, ef[107] = el) : el = ef[107], ef[108] !== eY ? (es = "mine" !== eY && (0, t.jsxs)(f.f, {
			variant: "ghost",
			size: "sm",
			onClick: () => eP(!0),
			className: "-mt-3 w-fit gap-2 px-2 text-xs text-muted-foreground",
			children: [(0, t.jsx)("span", {
				className: "relative size-6 shrink-0 overflow-hidden rounded",
				children: (0, t.jsx)(d.default, {
					src: P.F,
					alt: "Preview sample image",
					fill: !0,
					sizes: "24px",
					className: "object-cover"
				})
			}), "Previews show each preset applied to this sample image"]
		}), ef[108] = eY, ef[109] = es) : es = ef[109], ef[110] === Symbol.for("react.memo_cache_sentinel") ? (ei = (0, t.jsxs)(p.s, {
			children: [(0, t.jsx)(p.F, {
				children: "The preview sample image"
			}), (0, t.jsx)(p.C, {
				children: "Every preset preview is generated by applying that preset to this image."
			})]
		}), ef[110] = ei) : ei = ef[110], ef[111] === Symbol.for("react.memo_cache_sentinel") ? (er = (0, t.jsxs)(p.d, {
			className: "sm:max-w-2xl",
			children: [ei, (0, t.jsx)("div", {
				className: "relative aspect-video w-full overflow-hidden rounded-lg bg-muted",
				children: (0, t.jsx)(d.default, {
					src: P.F,
					alt: "Preview sample image",
					fill: !0,
					sizes: "672px",
					className: "object-cover"
				})
			})]
		}), ef[111] = er) : er = ef[111], ef[112] !== eF ? (eo = (0, t.jsx)(p.N, {
			open: eF,
			onOpenChange: eP,
			children: er
		}), ef[112] = eF, ef[113] = eo) : eo = ef[113], ef[114] !== ep?.hasMore || ef[115] !== eg?.length || ef[116] !== eY ? (ec = "templates" !== eY && ep?.hasMore && (0, t.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: ["Showing your ", eg?.length, " most recent presets. Older ones aren't listed yet."]
		}), ef[114] = ep?.hasMore, ef[115] = eg?.length, ef[116] = eY, ef[117] = ec) : ec = ef[117], ef[118] !== ey || ef[119] !== eW || ef[120] !== td || ef[121] !== eY || ef[122] !== to ? (ed = !eW && (0, t.jsxs)("aside", {
			className: "sticky top-15 hidden max-h-[calc(100vh-14rem)] w-56 shrink-0 space-y-2 overflow-y-auto lg:block",
			children: ["mine" === eY && (0, t.jsxs)("div", {
				className: "flex items-center justify-between pl-2",
				children: [(0, t.jsx)("span", {
					className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
					children: "Folders"
				}), (0, t.jsx)(f.f, {
					variant: "ghost",
					size: "icon",
					className: "size-7",
					"aria-label": "New folder",
					onClick: () => e_(!0),
					children: (0, t.jsx)(i, {
						className: "size-4"
					})
				})]
			}), (0, t.jsx)(ez, {
				tree: to,
				selection: td,
				onSelect: eq,
				folders: "mine" === eY ? ey : void 0,
				readOnly: "templates" === eY
			})]
		}), ef[118] = ey, ef[119] = eW, ef[120] = td, ef[121] = eY, ef[122] = to, ef[123] = ed) : ed = ef[123], ef[124] !== ey || ef[125] !== eW || ef[126] !== td || ef[127] !== eY || ef[128] !== to ? (em = !eW && (0, t.jsxs)("div", {
			className: "flex w-full items-center gap-2 lg:hidden",
			children: [(0, t.jsx)(eD, {
				tree: to,
				selection: td,
				onSelect: eq,
				folders: "mine" === eY ? ey : void 0
			}), "mine" === eY && (0, t.jsxs)(f.f, {
				variant: "outline",
				size: "sm",
				className: "shrink-0",
				onClick: () => e_(!0),
				children: [(0, t.jsx)(i, {
					className: "size-4"
				}), "New folder"]
			})]
		}), ef[124] = ey, ef[125] = eW, ef[126] = td, ef[127] = eY, ef[128] = to, ef[129] = em) : em = ef[129], ef[130] !== ts || ef[131] !== eN || ef[132] !== eW || ef[133] !== tm || ef[134] !== eg?.length || ef[135] !== ti || ef[136] !== eG || ef[137] !== tt || ef[138] !== th || ef[139] !== tu || ef[140] !== td || ef[141] !== eY ? (eu = (0, t.jsx)("div", {
			className: "min-w-0 flex-1 space-y-4",
			children: tm ? (0, t.jsx)(ek.PresetGrid, {
				children: e4.map(e7)
			}) : 0 === tu.length ? (0, t.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center",
				children: [(0, t.jsx)(S.Y, {
					className: "size-8 text-muted-foreground/50"
				}), "mine" === eY && eg?.length === 0 ? (0, t.jsxs)(t.Fragment, {
					children: [(0, t.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No presets yet."
					}), (0, t.jsxs)("p", {
						className: "max-w-sm text-xs text-muted-foreground",
						children: ["Create your first preset to save a prompt or image for reuse", eN ? " across your organization" : "", "."]
					}), (0, t.jsx)(f.f, {
						variant: "outline",
						size: "sm",
						onClick: () => e9("templates"),
						children: "Browse Decart presets"
					})]
				}) : tt ? (0, t.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ['Nothing matches "', eG.trim(), '".']
				}) : (0, t.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "templates" === eY ? "Nothing here yet." : "This folder is empty — set a preset's folder from its panel to fill it."
				})]
			}) : th ? (0, t.jsx)(ek.PresetFolderSections, {
				items: tu,
				folders: ts,
				family: "family" === td.kind ? td.family : "all",
				readOnly: "templates" === eY,
				renderItem: e => ti(e)
			}) : (0, t.jsxs)(t.Fragment, {
				children: [!tt && !eW && (0, t.jsx)(ek.SelectionHeading, {
					selection: td,
					folders: ts,
					count: tu.length
				}), (0, t.jsx)(ek.PresetGrid, {
					children: tu.map(e => ti(e))
				})]
			})
		}), ef[130] = ts, ef[131] = eN, ef[132] = eW, ef[133] = tm, ef[134] = eg?.length, ef[135] = ti, ef[136] = eG, ef[137] = tt, ef[138] = th, ef[139] = tu, ef[140] = td, ef[141] = eY, ef[142] = eu) : eu = ef[142], ef[143] !== ed || ef[144] !== em || ef[145] !== eu ? (eh = (0, t.jsxs)("div", {
			className: "flex flex-col gap-6 lg:flex-row lg:items-start",
			children: [ed, em, eu]
		}), ef[143] = ed, ef[144] = em, ef[145] = eu, ef[146] = eh) : eh = ef[146], ef[147] !== L || ef[148] !== R || ef[149] !== Y || ef[150] !== W || ef[151] !== en || ef[152] !== el || ef[153] !== es || ef[154] !== eo || ef[155] !== ec || ef[156] !== eh ? (ex = (0, t.jsxs)("div", {
			className: "mx-auto max-w-7xl space-y-6",
			children: [L, R, Y, W, J, en, el, es, eo, ec, eh]
		}), ef[147] = L, ef[148] = R, ef[149] = Y, ef[150] = W, ef[151] = en, ef[152] = el, ef[153] = es, ef[154] = eo, ef[155] = ec, ef[156] = eh, ef[157] = ex) : ex = ef[157], ex
	}], 520311)
}]);