(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 425720, t => {
	"use strict";
	var e = t.i(234984);
	t.i(582018);
	var i = t.i(379797),
		s = t.i(170380),
		n = t.i(848148),
		r = t.i(8774),
		a = t.i(480381),
		o = t.i(684128),
		l = t.i(932767),
		h = t.i(380491),
		u = t.i(76145),
		d = t.i(149218),
		c = t.i(486694),
		p = t.i(866513),
		m = t.i(410740),
		f = t.i(656352),
		g = t.i(959114),
		y = t.i(299033),
		v = t.i(627859),
		x = t.i(2036),
		b = t.i(122638),
		w = t.i(126165);
	t.s(["f", 0, function({
		initialValues: t
	} = {}) {
		let [S, T] = (0, s.useState)(!1), [A, P] = (0, s.useState)(t?.imageFile ?? null), [k, M] = (0, s.useState)(null), [j, E] = (0, s.useState)(null), C = (0, m.d)(), V = (0, f.m)(), D = null !== V, {
			data: R
		} = (0, c.e)(), L = (0, n.G)({
			resolver: (0, i.f)(g.f),
			defaultValues: {
				name: "",
				prompt: t?.prompt ?? "",
				visibility: "private",
				modelFamily: t?.modelFamily ?? "general",
				enhance: !0
			}
		}), F = (0, p.f)({
			prompt: L.watch("prompt") ?? "",
			imageFile: A,
			existingImageUrl: k,
			seedPreviewUrl: null,
			seedSource: {
				prompt: t?.prompt ?? "",
				imageFile: t?.imageFile ?? null,
				imageUrl: null
			},
			onImageHoisted: t => {
				M(t), P(null)
			}
		}), N = C.isPending || F.isGenerating, O = L.watch("modelFamily"), B = D ? L.watch("visibility") ?? "private" : "private", I = e => {
			(e || !N) && (T(e), e || (L.reset(), P(t?.imageFile ?? null), M(null), E(null), F.reset()))
		}, U = t => e => {
			t(e), E(null)
		}, W = (0, s.useCallback)(t => {
			t?.prompt !== void 0 && L.setValue("prompt", t.prompt), t?.imageFile !== void 0 && P(t.imageFile), t?.modelFamily !== void 0 && L.setValue("modelFamily", t.modelFamily ?? "general"), T(!0)
		}, [L]);
		return {
			dialog: (0, e.jsx)(a.N, {
				open: S,
				onOpenChange: I,
				children: (0, e.jsxs)(a.d, {
					children: [(0, e.jsxs)(a.s, {
						children: [(0, e.jsx)(a.F, {
							children: "Create Preset"
						}), (0, e.jsx)(a.C, {
							children: "Save a prompt and/or image to reuse later. Every change becomes a new version you can roll back to."
						})]
					}), (0, e.jsx)(o.n, {
						...L,
						children: (0, e.jsxs)("form", {
							onSubmit: L.handleSubmit(t => {
								let e = t.prompt?.trim();
								e || A || k ? C.mutate({
									name: t.name,
									visibility: D ? t.visibility : "private",
									prompt: e || void 0,
									imageFile: A,
									existingImageUrl: A ? void 0 : k,
									generateThumbnail: F.shouldGenerateOnSave,
									existingGeneratedThumbnailUrl: F.previewUrl ?? void 0,
									modelFamily: "general" === t.modelFamily ? null : t.modelFamily,
									enhance: t.enhance,
									folderId: j
								}, {
									onSuccess: () => I(!1)
								}) : L.setError("prompt", {
									message: "Add a prompt or an image"
								})
							}),
							className: "space-y-4",
							children: [(0, e.jsx)(o.G, {
								control: L.control,
								name: "name",
								render: ({
									field: t
								}) => (0, e.jsxs)(o.V, {
									children: [(0, e.jsxs)(o.y, {
										children: ["Name ", (0, e.jsx)("span", {
											className: "text-destructive",
											children: "*"
										})]
									}), (0, e.jsx)(o.K, {
										children: (0, e.jsx)(l.f, {
											placeholder: "e.g., Neon City Style",
											"data-1p-ignore": !0,
											autoComplete: "off",
											...t,
											disabled: N
										})
									}), (0, e.jsx)(o.o, {})]
								})
							}), (0, e.jsx)(o.G, {
								control: L.control,
								name: "prompt",
								render: ({
									field: t
								}) => (0, e.jsxs)(o.V, {
									children: [(0, e.jsx)(o.y, {
										children: "Prompt"
									}), (0, e.jsx)(o.K, {
										children: (0, e.jsx)(d.f, {
											placeholder: "Describe the style or edit this preset applies...",
											className: "min-h-24",
											...t,
											disabled: N
										})
									}), (0, e.jsx)(o.o, {})]
								})
							}), (0, e.jsxs)("div", {
								className: "space-y-2",
								children: [(0, e.jsx)(o.y, {
									children: "Image"
								}), (0, e.jsx)(x.f, {
									file: A,
									existingUrl: k,
									onFileChange: P,
									onClearExisting: () => M(null),
									disabled: N
								})]
							}), F.previewUrl && (0, e.jsx)(w.f, {
								previewUrl: F.previewUrl,
								alt: "New preset preview"
							}), (0, e.jsx)(b.f, {
								idPrefix: "create-preset-dialog",
								previewUrl: F.previewUrl,
								isCurrent: F.isCurrent,
								isGenerating: F.isGenerating,
								canGenerate: F.canGenerate,
								onGenerate: F.generate,
								generateOnSave: F.generateOnSave,
								onGenerateOnSaveChange: F.setGenerateOnSave,
								disabled: C.isPending
							}), (0, e.jsx)(o.G, {
								control: L.control,
								name: "modelFamily",
								render: ({
									field: t
								}) => (0, e.jsxs)(o.V, {
									children: [(0, e.jsx)(o.y, {
										children: "Model"
									}), (0, e.jsxs)(h.d, {
										onValueChange: U(t.onChange),
										value: t.value,
										disabled: N,
										children: [(0, e.jsx)(o.K, {
											children: (0, e.jsx)(h.P, {
												children: (0, e.jsx)(h.U, {
													placeholder: "General — any model"
												})
											})
										}), (0, e.jsxs)(h.r, {
											children: [(0, e.jsx)(h.T, {
												value: "general",
												children: "General — any model"
											}), Object.entries(y.C).map(([t, i]) => (0, e.jsx)(h.T, {
												value: t,
												children: i
											}, t))]
										})]
									}), (0, e.jsx)(o.Y, {
										children: "Shown only on matching playground pages. General presets appear everywhere."
									}), (0, e.jsx)(o.o, {})]
								})
							}), (0, e.jsx)(v.f, {
								idPrefix: "create-preset-dialog",
								folders: R,
								value: j,
								onChange: E,
								modelFamily: O && "general" !== O ? O : null,
								organizationId: V?.id ?? null,
								visibility: B,
								disabled: N
							}), (0, e.jsx)(o.G, {
								control: L.control,
								name: "enhance",
								render: ({
									field: t
								}) => (0, e.jsxs)(o.V, {
									className: "flex items-center justify-between gap-4",
									children: [(0, e.jsxs)("div", {
										className: "space-y-1",
										children: [(0, e.jsx)(o.y, {
											children: "Enhance prompt"
										}), (0, e.jsx)(o.Y, {
											children: "Expands the prompt server-side before generation. Lucy 2.5 and 2.6 always enhance applied presets."
										})]
									}), (0, e.jsx)(o.K, {
										children: (0, e.jsx)(u.f, {
											checked: t.value,
											onCheckedChange: t.onChange,
											disabled: N
										})
									})]
								})
							}), D && (0, e.jsx)(o.G, {
								control: L.control,
								name: "visibility",
								render: ({
									field: t
								}) => (0, e.jsxs)(o.V, {
									children: [(0, e.jsx)(o.y, {
										children: "Visibility"
									}), (0, e.jsxs)(h.d, {
										onValueChange: U(t.onChange),
										defaultValue: t.value,
										disabled: N,
										children: [(0, e.jsx)(o.K, {
											children: (0, e.jsx)(h.P, {
												children: (0, e.jsx)(h.U, {
													placeholder: "Private"
												})
											})
										}), (0, e.jsxs)(h.r, {
											children: [(0, e.jsx)(h.T, {
												value: "private",
												children: "Private — only you"
											}), (0, e.jsxs)(h.T, {
												value: "org",
												children: [V?.name ?? "Organization", " — visible to all members"]
											})]
										})]
									}), (0, e.jsx)(o.Y, {
										children: "You can change this later."
									}), (0, e.jsx)(o.o, {})]
								})
							}), (0, e.jsxs)(a.c, {
								children: [(0, e.jsx)(r.f, {
									variant: "outline",
									type: "button",
									onClick: () => I(!1),
									disabled: N,
									children: "Cancel"
								}), (0, e.jsx)(r.f, {
									type: "submit",
									disabled: N,
									children: C.isPending ? "Creating..." : "Create Preset"
								})]
							})]
						})
					})]
				})
			}),
			openDialog: W
		}
	}])
}, 904102, 115791, t => {
	"use strict";
	var e = t.i(234984),
		i = t.i(582018),
		s = t.i(55e3);
	let n = {
		name: "bookmark",
		size: 24,
		node: [
			["path", {
				d: "M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z",
				key: "oz39mx"
			}]
		]
	};
	n.node;
	let r = (0, s.f)(n);
	t.s(["f", 0, r], 115791);
	var a = t.i(253149),
		o = t.i(833821),
		l = t.i(326383),
		h = t.i(170380),
		u = t.i(8774),
		d = t.i(546009),
		c = t.i(818036),
		p = t.i(678405);
	t.s(["m", 0, function(t) {
		let s, n, r, a, o, u, d, p, m = (0, i.c)(34),
			{
				icon: f,
				file: g,
				label: y,
				onClear: v,
				onClick: x,
				disabled: b,
				className: w
			} = t,
			S = x ? "button" : "div",
			T = function(t) {
				let e, s, n = (0, i.c)(3),
					[r, a] = (0, h.useState)(null);
				return n[0] !== t ? (e = () => {
					if (!t?.type.startsWith("image/")) return void a(null);
					let e = URL.createObjectURL(t);
					return a(e), () => URL.revokeObjectURL(e)
				}, s = [t], n[0] = t, n[1] = e, n[2] = s) : (e = n[1], s = n[2]), (0, h.useEffect)(e, s), r
			}(g),
			A = T ? "pl-1" : "pl-2",
			P = v ? "pr-2" : "pr-3",
			k = x && !b && "cursor-pointer hover:bg-secondary",
			M = b && "opacity-50";
		m[0] !== w || m[1] !== A || m[2] !== P || m[3] !== k || m[4] !== M ? (s = (0, c.c)("group flex h-7 min-w-0 items-center gap-1 rounded-full bg-background transition-colors", A, P, k, M, w), m[0] = w, m[1] = A, m[2] = P, m[3] = k, m[4] = M, m[5] = s) : s = m[5];
		let j = x ? "button" : void 0,
			E = x ? b : void 0,
			C = g ? y : void 0,
			V = x && !b && "cursor-pointer";
		m[6] !== V ? (n = (0, c.c)("flex min-w-0 items-center gap-1.5 rounded-full outline-none", "focus-visible:ring-2 focus-visible:ring-ring/50", V), m[6] = V, m[7] = n) : n = m[7], m[8] !== f || m[9] !== T ? (r = T ? (0, e.jsx)("span", {
			className: "size-5 shrink-0 overflow-hidden rounded-full bg-muted",
			children: (0, e.jsx)("img", {
				src: T,
				alt: "",
				className: "size-full object-cover"
			})
		}) : (0, e.jsx)("span", {
			className: "flex size-4 shrink-0 items-center justify-center",
			children: f
		}), m[8] = f, m[9] = T, m[10] = r) : r = m[10];
		let D = g && "max-w-20",
			R = x && !b && "group-hover:text-foreground";
		return m[11] !== D || m[12] !== R ? (a = (0, c.c)("min-w-0 truncate text-muted-foreground text-xs transition-colors", D, R), m[11] = D, m[12] = R, m[13] = a) : a = m[13], m[14] !== y || m[15] !== a ? (o = (0, e.jsx)("span", {
			className: a,
			children: y
		}), m[14] = y, m[15] = a, m[16] = o) : o = m[16], m[17] !== S || m[18] !== x || m[19] !== n || m[20] !== r || m[21] !== o || m[22] !== j || m[23] !== E || m[24] !== C ? (u = (0, e.jsxs)(S, {
			type: j,
			onClick: x,
			disabled: E,
			title: C,
			className: n,
			children: [r, o]
		}), m[17] = S, m[18] = x, m[19] = n, m[20] = r, m[21] = o, m[22] = j, m[23] = E, m[24] = C, m[25] = u) : u = m[25], m[26] !== b || m[27] !== y || m[28] !== v ? (d = v && (0, e.jsx)("button", {
			type: "button",
			onClick: v,
			disabled: b,
			"aria-label": `Remove ${y}`,
			className: "flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
			children: (0, e.jsx)(l.X, {
				className: "size-3"
			})
		}), m[26] = b, m[27] = y, m[28] = v, m[29] = d) : d = m[29], m[30] !== u || m[31] !== d || m[32] !== s ? (p = (0, e.jsxs)("div", {
			className: s,
			children: [u, d]
		}), m[30] = u, m[31] = d, m[32] = s, m[33] = p) : p = m[33], p
	}, "y", 0, function(t) {
		let s, n, a, o, l = (0, i.c)(6),
			{
				onClick: h,
				disabled: c
			} = t;
		return c ? null : (l[0] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, e.jsx)(r, {
			className: "size-3.5 group-hover:fill-current"
		}), l[0] = s) : s = l[0], l[1] !== h ? (n = (0, e.jsx)(d.y, {
			asChild: !0,
			children: (0, e.jsx)(u.f, {
				variant: "ghost",
				size: "icon",
				onClick: h,
				"aria-label": "Save as preset",
				className: "group size-7 shrink-0 rounded-full bg-background text-muted-foreground hover:bg-background hover:text-foreground!",
				children: s
			})
		}), l[1] = h, l[2] = n) : n = l[2], l[3] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, e.jsx)(d.Y, {
			side: "top",
			children: "Save as preset"
		}), l[3] = a) : a = l[3], l[4] !== n ? (o = (0, e.jsxs)(d.W, {
			children: [n, a]
		}), l[4] = n, l[5] = o) : o = l[5], o)
	}, "c", 0, function(t) {
		let s, n, r, l, h, m = (0, i.c)(16),
			{
				onClick: f,
				disabled: g,
				isBusy: y,
				isAuthenticated: v,
				hint: x,
				label: b
			} = t,
			w = void 0 !== y && y,
			S = void 0 === v || v,
			T = !!S && g,
			A = S && g ? "bg-input hover:bg-input disabled:opacity-100" : "bg-accent hover:bg-accent/90";
		return m[0] !== A ? (s = (0, c.c)("size-7 shrink-0 rounded-full", A), m[0] = A, m[1] = s) : s = m[1], m[2] !== S || m[3] !== w ? (n = S ? w ? (0, e.jsx)(a.f, {
			className: "size-3.5 animate-spin text-accent-foreground"
		}) : (0, e.jsx)(p.f, {
			className: "size-3 text-accent-foreground"
		}) : (0, e.jsx)(o.f, {
			className: "size-3.5 text-accent-foreground"
		}), m[2] = S, m[3] = w, m[4] = n) : n = m[4], m[5] !== b || m[6] !== f || m[7] !== T || m[8] !== s || m[9] !== n ? (r = (0, e.jsx)(d.y, {
			asChild: !0,
			children: (0, e.jsx)("span", {
				className: "inline-flex",
				children: (0, e.jsx)(u.f, {
					onClick: f,
					disabled: T,
					size: "icon",
					"aria-label": b,
					className: s,
					children: n
				})
			})
		}), m[5] = b, m[6] = f, m[7] = T, m[8] = s, m[9] = n, m[10] = r) : r = m[10], m[11] !== x ? (l = x && (0, e.jsx)(d.Y, {
			side: "top",
			children: x
		}), m[11] = x, m[12] = l) : l = m[12], m[13] !== r || m[14] !== l ? (h = (0, e.jsxs)(d.W, {
			children: [r, l]
		}), m[13] = r, m[14] = l, m[15] = h) : h = m[15], h
	}, "z", 0, function(t) {
		let s, n, r, a, o, l, h = (0, i.c)(15),
			{
				children: u,
				toolbarStart: d,
				toolbarEnd: p,
				className: m
			} = t;
		return h[0] !== m ? (s = (0, c.c)("flex min-h-21 flex-1 flex-col gap-2 rounded-field bg-card pt-3 pr-2 pb-2 pl-4 md:min-h-41 md:pt-4", m), h[0] = m, h[1] = s) : s = h[1], h[2] !== u ? (n = (0, e.jsx)("div", {
			className: "flex min-h-0 flex-1 flex-col overflow-y-auto",
			children: u
		}), h[2] = u, h[3] = n) : n = h[3], h[4] !== d ? (r = (0, e.jsx)("div", {
			className: "flex min-w-0 flex-wrap items-center gap-2",
			children: d
		}), h[4] = d, h[5] = r) : r = h[5], h[6] !== p ? (a = (0, e.jsx)("div", {
			className: "flex shrink-0 items-center gap-2",
			children: p
		}), h[6] = p, h[7] = a) : a = h[7], h[8] !== r || h[9] !== a ? (o = (0, e.jsxs)("div", {
			className: "flex shrink-0 items-end justify-between gap-2",
			children: [r, a]
		}), h[8] = r, h[9] = a, h[10] = o) : o = h[10], h[11] !== s || h[12] !== n || h[13] !== o ? (l = (0, e.jsxs)("div", {
			className: s,
			children: [n, o]
		}), h[11] = s, h[12] = n, h[13] = o, h[14] = l) : l = h[14], l
	}], 904102)
}, 618600, t => {
	"use strict";
	var e = t.i(234984),
		i = t.i(582018),
		s = t.i(583228),
		n = t.i(546009),
		r = t.i(678405);
	t.s(["f", 0, function(t) {
		let a, o, l, h, u, d, c, p = (0, i.c)(15),
			{
				creditsPerSecond: m,
				note: f
			} = t;
		p[0] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, e.jsx)(r.f, {
			className: "size-3.5"
		}), p[0] = a) : a = p[0], p[1] !== m ? (o = (0, e.jsxs)("span", {
			className: "flex items-center gap-1 text-muted-foreground text-xs",
			children: [a, m, " /sec"]
		}), p[1] = m, p[2] = o) : o = p[2], p[3] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, e.jsx)(n.y, {
			asChild: !0,
			children: (0, e.jsx)("button", {
				type: "button",
				"aria-label": "How billing works",
				className: "flex text-muted-foreground",
				children: (0, e.jsx)(s.f, {
					className: "size-3.5"
				})
			})
		}), p[3] = l) : l = p[3];
		let g = 1 === m ? "" : "s";
		return p[4] !== m || p[5] !== g ? (h = (0, e.jsxs)("p", {
			children: [m, " credit", g, " per second of output."]
		}), p[4] = m, p[5] = g, p[6] = h) : h = p[6], p[7] !== f ? (u = f && (0, e.jsx)("p", {
			children: f
		}), p[7] = f, p[8] = u) : u = p[8], p[9] !== h || p[10] !== u ? (d = (0, e.jsxs)(n.W, {
			children: [l, (0, e.jsxs)(n.Y, {
				side: "bottom",
				children: [h, u]
			})]
		}), p[9] = h, p[10] = u, p[11] = d) : d = p[11], p[12] !== o || p[13] !== d ? (c = (0, e.jsxs)("div", {
			className: "flex shrink-0 items-center gap-1",
			children: [o, d]
		}), p[12] = o, p[13] = d, p[14] = c) : c = p[14], c
	}])
}, 657714, t => {
	"use strict";
	var e = t.i(234984),
		i = t.i(582018),
		s = t.i(329474),
		n = t.i(332409),
		r = t.i(583228),
		a = t.i(546009),
		o = t.i(818036);
	t.s(["f", 0, function(t) {
		let l, h, u, d, c, p = (0, i.c)(27),
			{
				label: m,
				required: f,
				htmlFor: g,
				info: y,
				aside: v,
				onToggle: x,
				expanded: b,
				opensUpward: w
			} = t,
			S = void 0 !== f && f,
			T = void 0 !== b && b;
		p[0] !== S ? (l = S && (0, e.jsx)("span", {
			className: "text-brand",
			children: "*"
		}), p[0] = S, p[1] = l) : l = p[1], p[2] !== m || p[3] !== l ? (h = (0, e.jsxs)(e.Fragment, {
			children: [m, l]
		}), p[2] = m, p[3] = l, p[4] = h) : h = p[4];
		let A = h;
		if (x) {
			let t, i, r, a, l, h = (void 0 !== w && w ? !T : T) ? n.f : s.f;
			return p[5] === Symbol.for("react.memo_cache_sentinel") ? (t = (0, o.c)("flex h-4 shrink-0 items-center justify-between gap-2 overflow-hidden", "w-full"), p[5] = t) : t = p[5], p[6] !== A ? (i = (0, e.jsx)("span", {
				className: "min-w-0 truncate font-medium text-cloud text-sm",
				children: A
			}), p[6] = A, p[7] = i) : i = p[7], p[8] !== h ? (r = (0, e.jsx)(h, {
				className: "size-4"
			}), p[8] = h, p[9] = r) : r = p[9], p[10] !== v || p[11] !== r ? (a = (0, e.jsxs)("span", {
				className: "flex shrink-0 items-center gap-1 text-muted-foreground",
				children: [v, r]
			}), p[10] = v, p[11] = r, p[12] = a) : a = p[12], p[13] !== T || p[14] !== x || p[15] !== i || p[16] !== a ? (l = (0, e.jsxs)("button", {
				type: "button",
				onClick: x,
				"aria-expanded": T,
				className: t,
				children: [i, a]
			}), p[13] = T, p[14] = x, p[15] = i, p[16] = a, p[17] = l) : l = p[17], l
		}
		return p[18] !== g || p[19] !== A ? (u = g ? (0, e.jsx)("label", {
			htmlFor: g,
			className: (0, o.c)("min-w-0 truncate font-medium text-cloud text-sm", "cursor-pointer"),
			children: A
		}) : (0, e.jsx)("h2", {
			className: "min-w-0 truncate font-medium text-cloud text-sm",
			children: A
		}), p[18] = g, p[19] = A, p[20] = u) : u = p[20], p[21] !== v || p[22] !== y ? (d = (v || y) && (0, e.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2",
			children: [v, y && (0, e.jsxs)(a.W, {
				children: [(0, e.jsx)(a.y, {
					asChild: !0,
					children: (0, e.jsx)("span", {
						className: "flex size-4 cursor-help items-center justify-center text-muted-foreground",
						children: (0, e.jsx)(r.f, {
							className: "size-3.5"
						})
					})
				}), (0, e.jsx)(a.Y, {
					side: "top",
					className: "max-w-xs",
					children: (0, e.jsx)("p", {
						className: "whitespace-pre-line",
						children: y
					})
				})]
			})]
		}), p[21] = v, p[22] = y, p[23] = d) : d = p[23], p[24] !== u || p[25] !== d ? (c = (0, e.jsxs)("div", {
			className: "flex h-4 shrink-0 items-center justify-between gap-2 overflow-hidden",
			children: [u, d]
		}), p[24] = u, p[25] = d, p[26] = c) : c = p[26], c
	}])
}, 266048, 954716, t => {
	"use strict";
	var e = t.i(234984),
		i = t.i(582018),
		s = t.i(551769),
		n = t.i(810647),
		r = t.i(170380),
		a = t.i(818036),
		o = t.i(657714);
	let l = () => {},
		h = (0, r.createContext)({
			isSheet: !1,
			open: !1,
			expand: l,
			collapse: l
		}),
		u = "(max-width: 767px)",
		d = {
			type: "spring",
			stiffness: 320,
			damping: 34
		};

	function c() {
		let t, e, s = (0, i.c)(3),
			[n, a] = (0, r.useState)(0);
		s[0] === Symbol.for("react.memo_cache_sentinel") ? (t = t => {
			if (!t) return void a(0);
			let e = () => a(t.getBoundingClientRect().height);
			e();
			let i = new ResizeObserver(e);
			return i.observe(t), () => i.disconnect()
		}, s[0] = t) : t = s[0];
		let o = t;
		return s[1] !== n ? (e = [o, n], s[1] = n, s[2] = e) : e = s[2], e
	}

	function p() {
		return window.matchMedia(u).matches
	}
	t.s(["f", 0, function({
		input: t,
		beforeInput: l,
		presets: m,
		belowPresets: f,
		stage: g,
		heading: y = "Input",
		headingRequired: v = !1,
		headerAside: x,
		stageLive: b = !1
	}) {
		let [w, S] = (0, r.useState)(!1), T = function() {
			let t, e, s = (0, i.c)(2),
				[n, a] = (0, r.useState)(p);
			return s[0] === Symbol.for("react.memo_cache_sentinel") ? (t = () => {
				let t = window.matchMedia(u),
					e = () => a(t.matches);
				return t.addEventListener("change", e), e(), () => t.removeEventListener("change", e)
			}, e = [], s[0] = t, s[1] = e) : (t = s[0], e = s[1]), (0, r.useEffect)(t, e), n
		}(), [A, P] = (0, n.f)(), [k, M] = c(), [j, E] = c(), C = M + 16 * !!l + E + (m && !b ? 136 : 0), V = (0, r.useRef)(w), D = (0, r.useRef)(b);
		(0, r.useLayoutEffect)(() => {
			let t = A.current;
			if (!t) return;
			let e = w !== V.current || b !== D.current;
			if (V.current = w, D.current = b, !T) {
				t.style.height = "";
				return
			}
			let i = w ? "auto" : `${C}px`;
			if (!e) {
				t.style.height = i;
				return
			}
			let s = P(t, {
				height: i
			}, d);
			return () => s.stop()
		}, [T, w, b, C, P, A]);
		let R = (0, r.useCallback)(() => S(!0), []),
			L = (0, r.useCallback)(() => {
				S(!1), A.current?.scrollTo({
					top: 0
				})
			}, [A]);
		(0, r.useEffect)(() => {
			T && b && L()
		}, [T, b, L]);
		let F = (0, r.useMemo)(() => ({
				isSheet: T,
				open: w,
				expand: T ? R : () => {},
				collapse: T ? L : () => {}
			}), [T, w, R, L]),
			N = (0, r.useRef)(!1);
		return (0, e.jsx)(h.Provider, {
			value: F,
			children: (0, e.jsxs)("div", {
				className: "flex h-full min-h-0 w-full flex-col md:flex-row md:gap-6 md:px-4 md:pt-6 md:pb-4",
				children: [(0, e.jsxs)("aside", {
					className: (0, a.c)("order-last flex max-h-3/4 shrink-0 flex-col gap-4 bg-background py-3", "md:order-none md:h-full md:max-h-none md:w-80 md:bg-transparent md:py-0 lg:w-90"),
					style: T ? {
						paddingBottom: "calc(var(--spacing) * 3 + env(safe-area-inset-bottom) + var(--app-bottom-inset, 0px))"
					} : void 0,
					children: [(0, e.jsxs)(s.f.button, {
						type: "button",
						onPanStart: () => {
							N.current = !0
						},
						onPanEnd: (t, e) => {
							setTimeout(() => {
								N.current = !1
							}, 0), (Math.abs(e.offset.y) > 60 || Math.abs(e.velocity.y) > 400) && (e.offset.y < 0 ? R() : L())
						},
						onClick: () => {
							N.current || (w ? L() : R())
						},
						"aria-expanded": w,
						className: "-mt-1 flex shrink-0 cursor-grab touch-none select-none items-center justify-center py-1 active:cursor-grabbing md:hidden",
						children: [(0, e.jsx)("span", {
							className: "sr-only",
							children: w ? "Collapse panel" : "Expand panel"
						}), (0, e.jsx)("span", {
							"aria-hidden": !0,
							className: "h-1 w-10 rounded-full bg-card"
						})]
					}), (0, e.jsxs)("div", {
						ref: A,
						className: "flex min-h-0 flex-col gap-4 overflow-y-auto overscroll-contain px-4 md:flex-1 md:px-0",
						children: [l && (0, e.jsx)("div", {
							ref: k,
							className: "shrink-0",
							children: l
						}), (0, e.jsxs)("div", {
							ref: j,
							className: "flex flex-none flex-col gap-2 md:flex-auto md:max-h-88",
							children: [(0, e.jsx)(o.f, {
								label: y,
								required: v,
								aside: x
							}), t]
						}), m, f && (0, e.jsx)("div", {
							className: "shrink-0 pb-1 empty:hidden",
							children: f
						})]
					})]
				}), (0, e.jsx)("div", {
					className: "flex min-h-0 min-w-0 flex-1 flex-col md:justify-start",
					children: g
				})]
			})
		})
	}], 266048);
	var m = t.i(329474),
		f = t.i(994787),
		g = t.i(326383),
		y = t.i(293819),
		v = t.i(8774),
		x = t.i(932767),
		b = t.i(99756),
		w = t.i(663303),
		S = t.i(120599),
		T = t.i(486694),
		A = t.i(410740),
		P = t.i(361367);
	let k = (t, e) => void 0 === e || null == t || t === e;

	function M(t, e) {
		return new Date(e.updatedAt).getTime() - new Date(t.updatedAt).getTime()
	}
	var j = t.i(3440),
		E = t.i(528506),
		C = t.i(880582),
		V = t.i(189478),
		D = t.i(841597),
		R = t.i(221751);

	function L(t) {
		let s, n, r, o, l, h, u, d = (0, i.c)(22),
			{
				preset: c,
				isSelected: p,
				isFocusTarget: m,
				onSelect: f,
				disabled: g
			} = t,
			y = c.icon ?? c.image,
			v = m ? 0 : -1,
			x = c.shortPrompt || c.prompt || c.label;
		d[0] !== f || d[1] !== c ? (s = () => f(c), d[0] = f, d[1] = c, d[2] = s) : s = d[2], d[3] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, a.c)("group flex min-w-0 flex-col gap-1.5 rounded-sm outline-none disabled:pointer-events-none disabled:opacity-50", "focus-visible:ring-[3px] focus-visible:ring-ring/50"), d[3] = n) : n = d[3];
		let b = p ? "ring-2 ring-brand" : "group-hover:opacity-85";
		return d[4] !== b ? (r = (0, a.c)("relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-sm bg-muted transition-[box-shadow,opacity]", b), d[4] = b, d[5] = r) : r = d[5], d[6] !== c || d[7] !== y ? (o = y ? (0, e.jsx)(V.default, {
			src: y,
			alt: "",
			fill: !0,
			sizes: "120px",
			unoptimized: (0, R.A)(y),
			className: "object-cover"
		}) : (0, S.r)(c) ? (0, e.jsx)(D.f, {
			prompt: c.shortPrompt || c.prompt,
			compact: !0
		}) : (0, e.jsx)(C.f, {
			className: "size-4 text-muted-foreground"
		}), d[6] = c, d[7] = y, d[8] = o) : o = d[8], d[9] !== r || d[10] !== o ? (l = (0, e.jsx)("span", {
			className: r,
			children: o
		}), d[9] = r, d[10] = o, d[11] = l) : l = d[11], d[12] !== c.label ? (h = (0, e.jsx)("span", {
			className: "min-w-0 truncate text-center font-medium text-cloud text-xs leading-tight",
			children: c.label
		}), d[12] = c.label, d[13] = h) : h = d[13], d[14] !== g || d[15] !== p || d[16] !== v || d[17] !== x || d[18] !== s || d[19] !== l || d[20] !== h ? (u = (0, e.jsxs)("button", {
			type: "button",
			role: "option",
			"aria-selected": p,
			tabIndex: v,
			"data-rail-tile": !0,
			title: x,
			onClick: s,
			disabled: g,
			className: n,
			children: [l, h]
		}), d[14] = g, d[15] = p, d[16] = v, d[17] = x, d[18] = s, d[19] = l, d[20] = h, d[21] = u) : u = d[21], u
	}
	let F = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"],
		N = ["all", "decart", "mine"],
		O = {
			all: "All presets",
			decart: "Decart",
			mine: "Mine"
		};

	function B(t) {
		return (0, e.jsx)(b.f, {
			className: "aspect-square rounded-sm"
		}, t)
	}

	function I(t, i) {
		return (0, e.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-2 py-10 text-center",
			children: [(0, e.jsx)("p", {
				className: "text-muted-foreground text-xs",
				children: t
			}), i]
		})
	}

	function U(t) {
		return t.items
	}

	function W(t) {
		return "mine" !== t.source
	}

	function z(t) {
		return "mine" === t.source
	}

	function $(t, e, i, s) {
		let {
			sections: n,
			unfiled: r
		} = (0, j.h)(t, e, "all");
		return [...r.length > 0 ? [{
			key: `${s}:default`,
			label: i,
			items: r
		}] : [], ...n.filter(K).map(_)]
	}

	function _(t) {
		return {
			key: t.folder.id,
			label: t.folder.name,
			items: t.items
		}
	}

	function K(t) {
		return t.items.length > 0
	}
	t.s(["f", 0, function(t) {
		let s, n, l, u, d, c, p, b, C, V, D, R, _, K, Y, G = (0, i.c)(86),
			{
				builtins: H,
				family: X,
				selectedId: q,
				onSelect: Z,
				onRequireAuth: J,
				disabled: Q,
				modelName: tt,
				surface: te,
				phase: ti,
				className: ts
			} = t,
			tn = void 0 !== Q && Q,
			{
				decart: tr,
				mine: ta,
				mineFolders: to,
				decartFolders: tl,
				isMineLoading: th,
				isSignedOut: tu
			} = function(t, e) {
				let s, n, r, a, o, l, h, u = (0, i.c)(32),
					{
						data: d,
						isPending: c
					} = w.i.useSession(),
					{
						data: p,
						isError: m
					} = (0, A.a)(),
					{
						data: f
					} = (0, P.U)(),
					{
						data: g
					} = (0, T.e)(),
					y = p?.presets,
					v = f?.templates,
					x = !c && (!d?.user || !!d.user.isAnonymous);
				if (u[0] !== t || u[1] !== e || u[2] !== v) {
					let i;
					u[4] !== e ? (i = t => "org" === t.source && k(t.modelFamily, e), u[4] = e, u[5] = i) : i = u[5];
					let n = (v ?? []).filter(i).map(S.x);
					s = (0, S.v)(n, t.map(S.w)), u[0] = t, u[1] = e, u[2] = v, u[3] = s
				} else s = u[3];
				let b = s;
				if (u[6] !== e || u[7] !== y) {
					let t;
					u[9] !== e ? (t = t => k(t.modelFamily, e), u[9] = e, u[10] = t) : t = u[10], n = (y ?? []).filter(t).sort(M).map(S.p), u[6] = e, u[7] = y, u[8] = n
				} else n = u[8];
				let j = n;
				if (u[11] !== g ? (r = g ?? [], u[11] = g, u[12] = r) : r = u[12], u[13] !== e || u[14] !== r) {
					let t;
					u[16] !== e ? (t = t => null == e || t.modelFamily === e, u[16] = e, u[17] = t) : t = u[17], a = r.filter(t), u[13] = e, u[14] = r, u[15] = a
				} else a = u[15];
				let E = a;
				if (u[18] !== f?.folders ? (o = f?.folders ?? [], u[18] = f?.folders, u[19] = o) : o = u[19], u[20] !== e || u[21] !== o) {
					let t;
					u[23] !== e ? (t = t => null == e || t.modelFamily === e, u[23] = e, u[24] = t) : t = u[24], l = o.filter(t), u[20] = e, u[21] = o, u[22] = l
				} else l = u[22];
				let C = l,
					V = !x && void 0 === p && !m;
				return u[25] !== b || u[26] !== C || u[27] !== x || u[28] !== j || u[29] !== E || u[30] !== V ? (h = {
					decart: b,
					mine: j,
					mineFolders: E,
					decartFolders: C,
					isMineLoading: V,
					isSignedOut: x
				}, u[25] = b, u[26] = C, u[27] = x, u[28] = j, u[29] = E, u[30] = V, u[31] = h) : h = u[31], h
			}(H, X),
			[td, tc] = (0, r.useState)("all"),
			[tp, tm] = (0, r.useState)(""),
			[tf, tg] = (0, r.useState)(!1),
			[ty, tv] = (0, r.useState)(!1),
			tx = (0, r.useContext)(h),
			tb = (0, r.useRef)(null),
			tw = (0, r.useDeferredValue)(tp);
		t: {
			let t;
			if ("decart" === td) {
				s = tr;
				break t
			}
			if ("mine" === td) {
				s = ta;
				break t
			}
			G[0] !== tr || G[1] !== ta ? (t = [...ta, ...tr], G[0] = tr, G[1] = ta, G[2] = t) : t = G[2],
			s = t
		}
		let tS = s;
		if (G[3] !== tw || G[4] !== tS) {
			let t;
			G[6] !== tw ? (t = t => (0, S.G)(t, tw), G[6] = tw, G[7] = t) : t = G[7], n = tS.filter(t), G[3] = tw, G[4] = tS, G[5] = n
		} else n = G[5];
		let tT = n;
		e: {
			let t;
			if (tw.trim()) {
				let t;
				G[8] !== tT ? (t = [{
					key: "results",
					label: null,
					items: tT
				}], G[8] = tT, G[9] = t) : t = G[9], l = t;
				break e
			}
			if (G[10] !== tl || G[11] !== to || G[12] !== td || G[13] !== tT) {
				let e = tT.filter(z),
					i = tT.filter(W);
				t = [..."decart" === td ? [] : $(e, to, j.p, "mine"), ..."mine" === td ? [] : $(i, tl, "Decart", "decart")], G[10] = tl, G[11] = to, G[12] = td, G[13] = tT, G[14] = t
			} else t = G[14];l = t
		}
		let tA = l,
			tP = tA.length > 1;
		G[15] !== tt || G[16] !== Z || G[17] !== ti || G[18] !== tx || G[19] !== te ? (u = t => {
			tt && (E.f.trackPlaygroundPresetClicked({
				surface: te,
				modelName: tt,
				presetLabel: t.label,
				source: t.source,
				presetId: t.id,
				phase: ti
			}), "realtime" === te && E.f.trackRealtimeSuggestionClicked({
				modelName: tt,
				suggestionLabel: t.label,
				phase: ti,
				source: t.source,
				presetId: t.id
			})), Z(t), tx.collapse()
		}, G[15] = tt, G[16] = Z, G[17] = ti, G[18] = tx, G[19] = te, G[20] = u) : u = G[20];
		let tk = u;
		G[21] === Symbol.for("react.memo_cache_sentinel") ? (d = t => {
			if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(t.key)) return;
			let e = Array.from(tb.current?.querySelectorAll("[data-rail-tile]") ?? []);
			if (0 === e.length) return;
			let i = Math.max(1, e.filter(t => t.offsetTop === e[0]?.offsetTop).length),
				s = Math.max(0, e.indexOf(document.activeElement)),
				n = {
					ArrowLeft: -1,
					ArrowRight: 1,
					ArrowUp: -i,
					ArrowDown: i
				} [t.key],
				r = "Home" === t.key ? 0 : "End" === t.key ? e.length - 1 : Math.min(e.length - 1, Math.max(0, s + (n ?? 0)));
			t.preventDefault(), e[r]?.focus()
		}, G[21] = d) : d = G[21];
		let tM = d,
			tj = Math.max(tA.flatMap(U).findIndex(t => t.id === q), 0);
		if (G[22] !== ts || G[23] !== tn || G[24] !== tj || G[25] !== tA || G[26] !== tk || G[27] !== th || G[28] !== tu || G[29] !== J || G[30] !== ty || G[31] !== tp || G[32] !== tf || G[33] !== q || G[34] !== tx || G[35] !== tP || G[36] !== td || G[37] !== tT) {
			C = Symbol.for("react.early_return_sentinel");
			i: {
				let t, i, s, n, r;
				if (!ty && !tx.isSheet) {
					let t, i, s, n;
					G[45] !== ts ? (t = (0, a.c)("shrink-0", ts), G[45] = ts, G[46] = t) : t = G[46], G[47] === Symbol.for("react.memo_cache_sentinel") ? (i = () => tv(!0), G[47] = i) : i = G[47], G[48] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, e.jsxs)("button", {
						type: "button",
						onClick: i,
						"aria-expanded": !1,
						className: "flex h-10.5 w-full cursor-pointer items-center justify-center gap-1 rounded-field bg-card text-muted-foreground text-sm tracking-[0.24px] transition-colors hover:text-foreground",
						children: ["Show Presets", (0, e.jsx)(m.f, {
							className: "size-4"
						})]
					}), G[48] = s) : s = G[48], G[49] !== t ? (n = (0, e.jsx)("div", {
						className: t,
						children: s
					}), G[49] = t, G[50] = n) : n = G[50], C = n;
					break i
				}
				G[51] !== ts ? (p = (0, a.c)("@container flex min-h-44 flex-col gap-2", ts), G[51] = ts, G[52] = p) : p = G[52];
				let l = !tx.isSheet || tx.open;G[53] !== tx.collapse || G[54] !== tx.expand || G[55] !== tx.isSheet || G[56] !== tx.open ? (t = tx.isSheet ? tx.open ? tx.collapse : tx.expand : () => tv(!1), G[53] = tx.collapse, G[54] = tx.expand, G[55] = tx.isSheet, G[56] = tx.open, G[57] = t) : t = G[57],
				G[58] !== tT.length ? (i = tT.length > 0 ? (0, e.jsx)("span", {
					className: "text-xs",
					children: tT.length
				}) : void 0, G[58] = tT.length, G[59] = i) : i = G[59],
				G[60] !== tx.isSheet || G[61] !== l || G[62] !== t || G[63] !== i ? (b = (0, e.jsx)(o.f, {
					label: "Presets",
					expanded: l,
					opensUpward: tx.isSheet,
					onToggle: t,
					aside: i
				}), G[60] = tx.isSheet, G[61] = l, G[62] = t, G[63] = i, G[64] = b) : b = G[64],
				R = "flex min-h-0 flex-col gap-4 rounded-field bg-card px-4 py-2",
				G[65] !== td ? (s = N.map(t => (0, e.jsx)("button", {
					type: "button",
					onClick: () => tc(t),
					"aria-pressed": td === t,
					className: (0, a.c)("-mb-px flex h-full shrink-0 items-center gap-1 border-b px-2.5 text-sm transition-colors", td === t ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"),
					children: O[t]
				}, t)), G[65] = td, G[66] = s) : s = G[66],
				G[67] !== s ? (n = (0, e.jsx)("div", {
					className: "flex h-full min-w-0 items-center overflow-x-auto scrollbar-hide",
					children: s
				}), G[67] = s, G[68] = n) : n = G[68],
				G[69] !== tp || G[70] !== tf ? (r = tf ? (0, e.jsxs)("div", {
					className: "relative w-32 shrink-0",
					children: [(0, e.jsx)(x.f, {
						autoFocus: !0,
						value: tp,
						onChange: t => tm(t.target.value),
						onBlur: () => !tp && tg(!1),
						placeholder: "Search",
						"aria-label": "Search presets",
						className: "h-7 pr-6 pl-2 text-xs"
					}), tp && (0, e.jsx)(v.f, {
						variant: "ghost",
						size: "icon",
						"aria-label": "Clear search",
						onClick: () => {
							tm(""), tg(!1)
						},
						className: "-translate-y-1/2 absolute top-1/2 right-0.5 size-5",
						children: (0, e.jsx)(g.X, {
							className: "size-3"
						})
					})]
				}) : (0, e.jsx)(v.f, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Search presets",
					onClick: () => tg(!0),
					className: "size-7 shrink-0 text-muted-foreground",
					children: (0, e.jsx)(f.f, {
						className: "size-3.5"
					})
				}), G[69] = tp, G[70] = tf, G[71] = r) : r = G[71],
				G[72] !== n || G[73] !== r ? (c = (0, e.jsxs)("div", {
					className: "flex h-8 shrink-0 items-center justify-between gap-2 border-hairline border-b",
					children: [n, r]
				}), G[72] = n, G[73] = r, G[74] = c) : c = G[74],
				V = "-mx-1 -mt-1 min-h-0 overflow-y-auto p-1 max-md:overscroll-contain",
				D = (() => {
					if ("mine" === td && tu) return I("Sign in to use your saved presets.", J && (0, e.jsx)(v.f, {
						variant: "outline",
						size: "sm",
						onClick: J,
						children: "Sign in"
					}));
					if ("decart" !== td && th && 0 === tT.length) return (0, e.jsx)("div", {
						className: "grid grid-cols-3 gap-x-3.5 gap-y-4 @xs:grid-cols-4",
						children: F.map(B)
					});
					if (0 === tT.length) return tp.trim() ? I(`No presets match "${tp.trim()}".`, (0, e.jsx)(v.f, {
						variant: "ghost",
						size: "sm",
						onClick: () => tm(""),
						children: "Clear search"
					})) : I("No presets yet.", "mine" === td ? (0, e.jsx)(v.f, {
						asChild: !0,
						variant: "outline",
						size: "sm",
						children: (0, e.jsx)(y.default, {
							href: "/studio",
							children: "Create a preset"
						})
					}) : void 0);
					let t = -1;
					return (0, e.jsxs)(e.Fragment, {
						children: [(0, e.jsx)("div", {
							ref: tb,
							role: "listbox",
							"aria-label": "Presets",
							onKeyDown: tM,
							className: "flex flex-col gap-4",
							children: tA.map(i => (0, e.jsxs)("div", {
								className: "flex flex-col gap-2",
								children: [tP && i.label && (0, e.jsx)("h3", {
									className: "px-0.5 font-medium text-[11px] text-muted-foreground uppercase tracking-wide",
									children: i.label
								}), (0, e.jsx)("div", {
									className: "grid grid-cols-3 gap-x-3.5 gap-y-4 @xs:grid-cols-4",
									children: i.items.map(i => (t += 1, (0, e.jsx)(L, {
										preset: i,
										isSelected: i.id === q,
										isFocusTarget: t === tj,
										onSelect: tk,
										disabled: tn
									}, i.id)))
								})]
							}, i.key))
						}), "mine" === td && !tp.trim() && (0, e.jsx)(y.default, {
							href: "/studio",
							className: "mt-3 block px-0.5 text-muted-foreground text-xs underline-offset-2 hover:text-foreground hover:underline",
							children: "Manage in Studio"
						})]
					})
				})()
			}
			G[22] = ts, G[23] = tn, G[24] = tj, G[25] = tA, G[26] = tk, G[27] = th, G[28] = tu, G[29] = J, G[30] = ty, G[31] = tp, G[32] = tf, G[33] = q, G[34] = tx, G[35] = tP, G[36] = td, G[37] = tT, G[38] = c, G[39] = p, G[40] = b, G[41] = C, G[42] = V, G[43] = D, G[44] = R
		} else c = G[38], p = G[39], b = G[40], C = G[41], V = G[42], D = G[43], R = G[44];
		return C !== Symbol.for("react.early_return_sentinel") ? C : (G[75] !== V || G[76] !== D ? (_ = (0, e.jsx)("div", {
			className: V,
			children: D
		}), G[75] = V, G[76] = D, G[77] = _) : _ = G[77], G[78] !== c || G[79] !== _ || G[80] !== R ? (K = (0, e.jsxs)("div", {
			className: R,
			children: [c, _]
		}), G[78] = c, G[79] = _, G[80] = R, G[81] = K) : K = G[81], G[82] !== p || G[83] !== b || G[84] !== K ? (Y = (0, e.jsxs)("div", {
			className: p,
			children: [b, K]
		}), G[82] = p, G[83] = b, G[84] = K, G[85] = Y) : Y = G[85], Y)
	}], 954716)
}, 551769, 810647, t => {
	"use strict";
	let e, i, s, n, r, a, o, l, h = ["transformPerspective", "x", "y", "z", "translateX", "translateY", "translateZ", "scale", "scaleX", "scaleY", "scaleZ", "rotate", "rotateX", "rotateY", "rotateZ", "skew", "skewX", "skewY"],
		u = new Set([...h, "pathRotation"]),
		d = (t, e, i) => i > e ? e : i < t ? t : i,
		c = {
			test: t => "number" == typeof t,
			parse: parseFloat,
			transform: t => t
		},
		p = {
			...c,
			transform: t => d(0, 1, t)
		},
		m = {
			...c,
			default: 1
		},
		f = t => Math.round(1e5 * t) / 1e5,
		g = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu,
		y = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
		v = (t, e) => i => !!("string" == typeof i && y.test(i) && i.startsWith(t) || e && null != i && Object.prototype.hasOwnProperty.call(i, e)),
		x = (t, e, i) => s => {
			if ("string" != typeof s) return s;
			let [n, r, a, o] = s.match(g);
			return {
				[t]: parseFloat(n),
				[e]: parseFloat(r),
				[i]: parseFloat(a),
				alpha: void 0 !== o ? parseFloat(o) : 1
			}
		},
		b = {
			...c,
			transform: t => Math.round(d(0, 255, t))
		},
		w = {
			test: v("rgb", "red"),
			parse: x("red", "green", "blue"),
			transform: ({
				red: t,
				green: e,
				blue: i,
				alpha: s = 1
			}) => "rgba(" + b.transform(t) + ", " + b.transform(e) + ", " + b.transform(i) + ", " + f(p.transform(s)) + ")"
		},
		S = (t, e, i) => {
			let s = t.substring(1 + e * i, 1 + (e + 1) * i);
			return i > 1 ? s : s + s
		},
		T = {
			test: v("#"),
			parse: function(t) {
				let e = t.length > 5 ? 2 : 1,
					i = S(t, 3, e);
				return {
					red: parseInt(S(t, 0, e), 16),
					green: parseInt(S(t, 1, e), 16),
					blue: parseInt(S(t, 2, e), 16),
					alpha: i ? parseInt(i, 16) / 255 : 1
				}
			},
			transform: w.transform
		},
		A = t => ({
			test: e => "string" == typeof e && e.endsWith(t) && 1 === e.split(" ").length,
			parse: parseFloat,
			transform: e => `${e}${t}`
		}),
		P = A("deg"),
		k = A("%"),
		M = A("px"),
		j = A("vh"),
		E = A("vw"),
		C = {
			...k,
			parse: t => k.parse(t) / 100,
			transform: t => k.transform(100 * t)
		},
		V = {
			test: v("hsl", "hue"),
			parse: x("hue", "saturation", "lightness"),
			transform: ({
				hue: t,
				saturation: e,
				lightness: i,
				alpha: s = 1
			}) => "hsla(" + Math.round(t) + ", " + k.transform(f(e)) + ", " + k.transform(f(i)) + ", " + f(p.transform(s)) + ")"
		},
		D = {
			test: t => w.test(t) || T.test(t) || V.test(t),
			parse: t => w.test(t) ? w.parse(t) : V.test(t) ? V.parse(t) : T.parse(t),
			transform: t => "string" == typeof t ? t : t.hasOwnProperty("red") ? w.transform(t) : V.transform(t),
			getAnimatableNone: t => {
				let e = D.parse(t);
				return e.alpha = 0, D.transform(e)
			}
		},
		R = new RegExp(g.source),
		L = RegExp(/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu.source, "i"),
		F = "number",
		N = "color",
		O = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?![a-z]*\()/giu;

	function B(t) {
		let e = t.toString(),
			i = [],
			s = {
				color: [],
				number: [],
				var: []
			},
			n = [],
			r = 0,
			a = e.replace(O, t => (D.test(t) ? (s.color.push(r), n.push(N), i.push(D.parse(t))) : t.startsWith("var(") ? (s.var.push(r), n.push("var"), i.push(t)) : (s.number.push(r), n.push(F), i.push(parseFloat(t))), ++r, "${}")).split("${}");
		return {
			values: i,
			split: a,
			indexes: s,
			types: n
		}
	}

	function I({
		split: t,
		types: e
	}) {
		let i = t.length;
		return s => {
			let n = "";
			for (let r = 0; r < i; r++)
				if (n += t[r], void 0 !== s[r]) {
					let t = e[r];
					t === F ? n += f(s[r]) : t === N ? n += D.transform(s[r]) : n += s[r]
				} return n
		}
	}
	let U = {
			test: function(t) {
				return isNaN(t) && "string" == typeof t && (R.test(t) || L.test(t))
			},
			parse: function(t) {
				return B(t).values
			},
			createTransformer: function(t) {
				return I(B(t))
			},
			getAnimatableNone: function(t) {
				let e = B(t);
				return I(e)(e.values.map((t, i) => ((t, e) => "number" == typeof t ? e?.trim().endsWith("/") ? t : 0 : "number" == typeof t ? 0 : D.test(t) ? D.getAnimatableNone(t) : t)(t, e.split[i])))
			}
		},
		W = new Set(["brightness", "contrast", "saturate", "opacity"]);

	function z(t) {
		let [e, i] = t.slice(0, -1).split("(");
		if ("drop-shadow" === e) return t;
		let [s] = i.match(g) || [];
		if (!s) return t;
		let n = i.replace(s, ""),
			r = +!!W.has(e);
		return s !== i && (r *= 100), e + "(" + r + n + ")"
	}
	let $ = /\b([a-z-]*)\(.*?\)/gu,
		_ = {
			...U,
			getAnimatableNone: t => {
				let e = t.match($);
				return e ? e.map(z).join(" ") : t
			}
		},
		K = {
			...U,
			getAnimatableNone: t => {
				let e = U.parse(t);
				return U.createTransformer(t)(e.map(t => "number" == typeof t ? 0 : "object" == typeof t ? {
					...t,
					alpha: 1
				} : t))
			}
		},
		Y = {
			...c,
			transform: Math.round
		},
		G = {
			rotate: P,
			pathRotation: P,
			rotateX: P,
			rotateY: P,
			rotateZ: P,
			scale: m,
			scaleX: m,
			scaleY: m,
			scaleZ: m,
			skew: P,
			skewX: P,
			skewY: P,
			distance: M,
			translateX: M,
			translateY: M,
			translateZ: M,
			x: M,
			y: M,
			z: M,
			perspective: M,
			transformPerspective: M,
			opacity: p,
			originX: C,
			originY: C,
			originZ: M
		},
		H = {
			borderWidth: M,
			borderTopWidth: M,
			borderRightWidth: M,
			borderBottomWidth: M,
			borderLeftWidth: M,
			borderRadius: M,
			borderTopLeftRadius: M,
			borderTopRightRadius: M,
			borderBottomRightRadius: M,
			borderBottomLeftRadius: M,
			width: M,
			maxWidth: M,
			height: M,
			maxHeight: M,
			top: M,
			right: M,
			bottom: M,
			left: M,
			inset: M,
			insetBlock: M,
			insetBlockStart: M,
			insetBlockEnd: M,
			insetInline: M,
			insetInlineStart: M,
			insetInlineEnd: M,
			padding: M,
			paddingTop: M,
			paddingRight: M,
			paddingBottom: M,
			paddingLeft: M,
			paddingBlock: M,
			paddingBlockStart: M,
			paddingBlockEnd: M,
			paddingInline: M,
			paddingInlineStart: M,
			paddingInlineEnd: M,
			margin: M,
			marginTop: M,
			marginRight: M,
			marginBottom: M,
			marginLeft: M,
			marginBlock: M,
			marginBlockStart: M,
			marginBlockEnd: M,
			marginInline: M,
			marginInlineStart: M,
			marginInlineEnd: M,
			fontSize: M,
			backgroundPositionX: M,
			backgroundPositionY: M,
			...G,
			zIndex: Y,
			fillOpacity: p,
			strokeOpacity: p,
			numOctaves: Y
		},
		X = {
			...H,
			color: D,
			backgroundColor: D,
			outlineColor: D,
			fill: D,
			stroke: D,
			borderColor: D,
			borderTopColor: D,
			borderRightColor: D,
			borderBottomColor: D,
			borderLeftColor: D,
			filter: _,
			WebkitFilter: _,
			mask: K,
			WebkitMask: K
		},
		q = t => X[t],
		Z = () => ({
			translate: 0,
			scale: 1,
			origin: 0,
			originPoint: 0
		}),
		J = () => ({
			x: Z(),
			y: Z()
		}),
		Q = () => ({
			min: 0,
			max: 0
		}),
		tt = () => ({
			x: Q(),
			y: Q()
		}),
		te = t => !!(t && t.getVelocity),
		ti = new Set(["width", "height", "top", "left", "right", "bottom", ...h]),
		ts = [c, M, k, P, E, j, {
			test: t => "auto" === t,
			parse: t => t
		}],
		tn = t => ts.find(e => e.test(t));
	var tr = t.i(914374);
	let ta = t => e => "string" == typeof e && e.startsWith(t),
		to = ta("--"),
		tl = ta("var(--"),
		th = t => !!tl(t) && tu.test(t.split("/*")[0].trim()),
		tu = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;

	function td(t) {
		return "string" == typeof t && t.split("/*")[0].includes("var(--")
	}
	let tc = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;

	function tp(t, e, i = 1) {
		let [s, n] = function(t) {
			let e = tc.exec(t);
			if (!e) return [, ];
			let [, i, s, n] = e;
			return [`--${i??s}`, n]
		}(t);
		if (!s) return;
		let r = window.getComputedStyle(e).getPropertyValue(s);
		if (r) {
			let t = r.trim();
			return /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t) ? parseFloat(t) : t
		}
		return th(n) ? tp(n, e, i + 1) : n
	}
	let tm = new Set([_, K]);

	function tf(t, n) {
		if (t === e && n === i) return s;
		let r = q(t);
		return tm.has(r) || (r = U), s = r.getAnimatableNone ? r.getAnimatableNone(n) : void 0, e = t, i = n, s
	}
	let tg = t => 180 * t / Math.PI,
		ty = t => tx(tg(Math.atan2(t[1], t[0]))),
		tv = {
			x: 4,
			y: 5,
			translateX: 4,
			translateY: 5,
			scaleX: 0,
			scaleY: 3,
			scaleZ: () => 1,
			scale: t => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
			rotate: ty,
			rotateZ: ty,
			skewX: t => tg(Math.atan(t[1])),
			skewY: t => tg(Math.atan(t[2])),
			skew: t => (Math.abs(t[1]) + Math.abs(t[2])) / 2
		},
		tx = t => ((t %= 360) < 0 && (t += 360), t),
		tb = t => Math.hypot(t[0], t[1]),
		tw = t => Math.hypot(t[4], t[5]),
		tS = {
			x: 12,
			y: 13,
			z: 14,
			translateX: 12,
			translateY: 13,
			translateZ: 14,
			scaleX: tb,
			scaleY: tw,
			scaleZ: t => Math.hypot(t[8], t[9], t[10]),
			scale: t => (tb(t) + tw(t)) / 2,
			rotateX: t => tx(tg(Math.atan2(t[6], t[5]))),
			rotateY: t => tx(tg(Math.atan2(-t[2], t[0]))),
			rotateZ: ty,
			rotate: ty,
			skewX: t => tg(Math.atan(t[4])),
			skewY: t => tg(Math.atan(t[1])),
			skew: t => (Math.abs(t[1]) + Math.abs(t[4])) / 2
		};

	function tT(t) {
		return +!!t.includes("scale")
	}

	function tA(t, e) {
		if (!t || "none" === t) return tT(e);
		let i = t.match(/^matrix(3d)?\(([-\d.e\s,]+)\)$/u);
		if (!i) return tT(e);
		let s = (i[1] ? tS : tv)[e],
			n = i[2].split(",").map(t => parseFloat(t));
		return "function" == typeof s ? s(n) : n[s]
	}
	let tP = (t, e) => {
			let {
				transform: i = "none"
			} = getComputedStyle(t);
			return tA(i, e)
		},
		tk = t => t === c || t === M,
		tM = new Set(["x", "y", "z"]),
		tj = h.filter(t => !tM.has(t)),
		tE = new Set(["bottom", "right"]);

	function tC(t, e, i, s, n, r) {
		let a = parseFloat(t);
		if (!isNaN(a)) return a;
		let {
			min: o,
			max: l
		} = e()[i], h = l - o;
		return "border-box" === r ? h : h - parseFloat(s) - parseFloat(n)
	}
	let tV = ({
			transform: t
		}) => tA(t, "x"),
		tD = ({
			transform: t
		}) => tA(t, "y"),
		tR = {
			width: ({
				width: t,
				paddingLeft: e = "0",
				paddingRight: i = "0",
				boxSizing: s
			}, n) => tC(t, n, "x", e, i, s),
			height: ({
				height: t,
				paddingTop: e = "0",
				paddingBottom: i = "0",
				boxSizing: s
			}, n) => tC(t, n, "y", e, i, s),
			top: ({
				top: t
			}) => parseFloat(t),
			left: ({
				left: t
			}) => parseFloat(t),
			bottom: ({
				top: t
			}, e) => {
				let {
					y: i
				} = e();
				return parseFloat(t) + (i.max - i.min)
			},
			right: ({
				left: t
			}, e) => {
				let {
					x: i
				} = e();
				return parseFloat(t) + (i.max - i.min)
			},
			x: tV,
			y: tD,
			translateX: tV,
			translateY: tD
		},
		tL = t => t,
		tF = {},
		tN = ["setup", "read", "resolveKeyframes", "preUpdate", "update", "preRender", "render", "postRender"];

	function tO(t, e, i = {
		delta: 0,
		timestamp: 0,
		isProcessing: !1
	}) {
		let s = !1,
			n = !0,
			r = () => s = !0,
			a = tN.reduce((t, e) => (t[e] = function(t) {
				let e, i = new Set,
					s = new Set,
					n = !1,
					r = !1,
					a = new Set,
					o = {
						delta: 0,
						timestamp: 0,
						isProcessing: !1
					};

				function l(i) {
					a.has(i) && (s.add(i), t()), (e = i)(o)
				}
				let h = {
					schedule: (t, r = !1, o = !1) => {
						let l = o && n,
							h = l ? i : s;
						return r && a.add(t), l && t !== e && h.delete(t), h.add(t), t
					},
					cancel: t => {
						s.delete(t), a.delete(t)
					},
					process: t => {
						if (o = t, n) {
							r = !0;
							return
						}
						n = !0;
						let a = i;
						i = s, s = a, i.forEach(l), i.clear(), e = void 0, n = !1, r && (r = !1, h.process(t))
					}
				};
				return h
			}(r), t), {}),
			{
				setup: o,
				read: l,
				resolveKeyframes: h,
				preUpdate: u,
				update: d,
				preRender: c,
				render: p,
				postRender: m
			} = a,
			f = () => {
				let r = tF.useManualTiming,
					a = r ? i.timestamp : performance.now();
				s = !1, r || (i.delta = n ? 1e3 / 60 : Math.max(Math.min(a - i.timestamp, 40), 1)), i.timestamp = a, i.isProcessing = !0, o.process(i), l.process(i), h.process(i), u.process(i), d.process(i), c.process(i), p.process(i), m.process(i), i.isProcessing = !1, s && e && (n = !1, t(f))
			};
		return {
			schedule: tN.reduce((e, r) => {
				let o = a[r];
				return e[r] = (e, r = !1, a = !1) => (!s && (s = !0, n = !0, i.isProcessing || t(f)), o.schedule(e, r, a)), e
			}, {}),
			cancel: t => {
				for (let e = 0; e < tN.length; e++) a[tN[e]].cancel(t)
			},
			state: i,
			steps: a
		}
	}
	let tB = {
			delta: 0,
			timestamp: 0,
			isProcessing: !1
		},
		{
			schedule: tI,
			cancel: tU,
			steps: tW
		} = tO("u" > typeof requestAnimationFrame ? requestAnimationFrame : tL, !0, tB),
		tz = new Set,
		t$ = !1,
		t_ = !1,
		tK = !1;

	function tY() {
		if (t_) {
			let t = [],
				e = new Set,
				i = new Set;
			tz.forEach(s => {
				s.needsMeasurement && (t.push(s), e.add(s.element), tE.has(s.name) && i.add(s.element))
			});
			let s = new Map;
			i.forEach(t => {
				let e, i = (e = [], tj.forEach(i => {
					let s = t.getValue(i);
					if (void 0 !== s) {
						let t = s.get(),
							n = +!!i.startsWith("scale");
						if (t === n) return;
						e.push([i, t]), s.set(n)
					}
				}), e);
				i.length && (s.set(t, i), t.render())
			}), t.forEach(t => t.measureInitialState()), e.forEach(t => {
				t.render();
				let e = s.get(t);
				e && e.forEach(([e, i]) => {
					t.getValue(e)?.set(i)
				})
			}), t.forEach(t => t.measureEndState()), t.forEach(t => {
				void 0 !== t.suspendedScrollY && window.scrollTo(0, t.suspendedScrollY)
			})
		}
		t_ = !1, t$ = !1, tz.forEach(t => t.complete(tK)), tz.clear()
	}

	function tG() {
		tz.forEach(t => {
			t.readKeyframes(), t.needsMeasurement && (t_ = !0)
		})
	}
	class tH {
		constructor(t, e, i, s, n, r = !1) {
			this.state = "pending", this.isAsync = !1, this.needsMeasurement = !1, this.unresolvedKeyframes = [...t], this.onComplete = e, this.name = i, this.motionValue = s, this.element = n, this.isAsync = r
		}
		scheduleResolve() {
			this.state = "scheduled", this.isAsync ? (tz.add(this), t$ || (t$ = !0, tI.read(tG), tI.resolveKeyframes(tY))) : (this.readKeyframes(), this.complete())
		}
		readKeyframes() {
			let {
				unresolvedKeyframes: t,
				name: e,
				element: i,
				motionValue: s
			} = this;
			if (null === t[0]) {
				let n = s?.get(),
					r = t[t.length - 1];
				if (void 0 !== n) t[0] = n;
				else if (i && e) {
					let s = function(t, e, i) {
						if ("string" == typeof t) {
							if (/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t) || /^0[^.\s]+$/u.test(t)) return parseFloat(t);
							if (!U.test(t) && U.test(i)) return tf(e, i)
						}
						return t ?? void 0
					}(i.readValue(e, r), e, r);
					void 0 !== s && (t[0] = s)
				}
				void 0 === t[0] && (t[0] = r), s && void 0 === n && s.set(t[0])
			}
			for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1])
		}
		setFinalKeyframe() {}
		measureInitialState() {}
		renderEndStyles() {}
		measureEndState() {}
		complete(t = !1) {
			this.state = "complete", this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t), tz.delete(this)
		}
		cancel() {
			"scheduled" === this.state && (tz.delete(this), this.state = "pending")
		}
		resume() {
			"pending" === this.state && this.scheduleResolve()
		}
	}
	let tX = new Set(["auto", "none", "0"]);
	class tq extends tH {
		constructor(t, e, i, s, n) {
			super(t, e, i, s, n, !0)
		}
		scheduleResolve() {
			if (this.canReadNow() && (this.readKeyframes(), !this.needsMeasurement)) return this.complete();
			super.scheduleResolve()
		}
		canReadNow() {
			let {
				unresolvedKeyframes: t,
				element: e,
				motionValue: i
			} = this, s = t[0] ?? i?.get();
			if (!e?.current || void 0 === s) return !1;
			for (let e = 0; e < t.length; e++)
				if (td(e ? t[e] : s)) return !1;
			return !0
		}
		readKeyframes() {
			let {
				unresolvedKeyframes: t,
				element: e,
				name: i
			} = this;
			if (!e?.current) return;
			super.readKeyframes();
			for (let i = 0; i < t.length; i++) {
				let s = t[i];
				if ("string" == typeof s && th(s = s.trim())) {
					let n = tp(s, e.current);
					void 0 !== n && (t[i] = n), i === t.length - 1 && (this.finalKeyframe = s)
				}
			}
			if (this.resolveNoneKeyframes(), !ti.has(i) || 2 !== t.length) return;
			let [s, n] = t;
			if ("number" == typeof s && "number" == typeof n) return;
			let r = tn(s),
				a = tn(n);
			if (td(s) !== td(n) && tR[i]) {
				this.needsMeasurement = !0;
				return
			}
			if (r !== a)
				if (tk(r) && tk(a))
					for (let e = 0; e < t.length; e++) {
						let i = t[e];
						"string" == typeof i && (t[e] = parseFloat(i))
					} else tR[i] && (this.needsMeasurement = !0)
		}
		resolveNoneKeyframes() {
			let {
				unresolvedKeyframes: t,
				name: e
			} = this, i = [];
			for (let e = 0; e < t.length; e++)(null === t[e] || function(t) {
				if ("number" == typeof t) return 0 === t;
				if (null === t) return !0;
				return "none" === t || "0" === t || /^0[^.\s]+$/u.test(t)
			}(t[e])) && i.push(e);
			i.length && function(t, e, i) {
				let s, n = 0;
				for (; n < t.length && !s;) {
					let e = t[n];
					"string" == typeof e && !tX.has(e) && function(t) {
						let e = t.toString();
						return R.test(e) || L.test(e)
					}(e) && (s = t[n]), n++
				}
				if (s && i)
					for (let n of e) t[n] !== s && (t[n] = tf(i, s))
			}(t, i, e)
		}
		measure() {
			let {
				element: t,
				name: e
			} = this;
			return tR[e](window.getComputedStyle(t.current), () => t.measureViewportBox())
		}
		measureInitialState() {
			let {
				element: t,
				unresolvedKeyframes: e,
				name: i
			} = this;
			if (!t?.current) return;
			"height" === i && (this.suspendedScrollY = window.pageYOffset), this.measuredOrigin = this.measure(), e[0] = this.measuredOrigin;
			let s = e[e.length - 1];
			void 0 !== s && this.motionValue?.jump(s, !1)
		}
		measureEndState() {
			let {
				element: t,
				unresolvedKeyframes: e
			} = this;
			if (!t?.current) return;
			this.motionValue?.jump(this.measuredOrigin, !1);
			let i = e.length - 1,
				s = e[i];
			e[i] = this.measure(), null !== s && void 0 === this.finalKeyframe && (this.finalKeyframe = s), this.resolveNoneKeyframes()
		}
	}
	let tZ = t => 1e3 * t;

	function tJ(t, e) {
		-1 === t.indexOf(e) && t.push(e)
	}

	function tQ(t, e) {
		let i = t.indexOf(e);
		i > -1 && t.splice(i, 1)
	}
	class t0 {
		constructor() {
			this.subscriptions = []
		}
		add(t) {
			return tJ(this.subscriptions, t), () => this.remove(t)
		}
		remove(t) {
			tQ(this.subscriptions, t)
		}
		notify(t, e, i) {
			let s = this.subscriptions.length;
			if (s)
				if (1 === s) this.subscriptions[0](t, e, i);
				else
					for (let n = 0; n < s; n++) {
						let s = this.subscriptions[n];
						s && s(t, e, i)
					}
		}
		getSize() {
			return this.subscriptions.length
		}
		clear() {
			this.subscriptions.length = 0
		}
	}

	function t1(t, e, i) {
		e.startsWith("--") ? t.style.setProperty(e, i) : t.style[e] = i
	}
	let t2 = {};

	function t3(t, e) {
		let i, s = () => (void 0 === i && (i = t()), i);
		return () => t2[e] ?? s()
	}
	let t5 = t3(() => void 0 !== window.ScrollTimeline, "scrollTimeline");

	function t4(t, {
		repeat: e,
		repeatType: i = "loop"
	}, s, n = 1) {
		let r, a, o = 0;
		for (let e = 0; e < t.length; e++) {
			let i = t[e];
			null !== i && (o++ || (r = i), a = i)
		}
		let l = n < 0 || e && "loop" !== i && e % 2 == 1 ? 0 : o - 1;
		return l && void 0 !== s ? s : l ? a : r
	}
	class t8 {
		constructor() {
			this.isResolved = !1
		}
		get finished() {
			return this._finished || (this._finished = this.isResolved ? Promise.resolve() : new Promise(t => {
				this._resolve = t
			})), this._finished
		}
		updateFinished() {
			this._finished = this._resolve = void 0, this.isResolved = !1
		}
		notifyFinished() {
			this.isResolved = !0, this._resolve?.()
		}
		then(t, e) {
			return this.finished.then(t, e)
		}
	}

	function t6() {
		n = void 0
	}
	let t9 = {
		now: () => (void 0 === n && t9.set(tB.isProcessing || tF.useManualTiming ? tB.timestamp : performance.now()), n),
		set: t => {
			n = t, queueMicrotask(t6)
		}
	};

	function t7(t, e) {
		return {
			kind: t,
			animation: e,
			timestamp: t9.now(),
			frameTimestamp: tB.timestamp,
			frameIsProcessing: tB.isProcessing
		}
	}

	function et(t, e, i) {
		let s = globalThis.__MOTION_INSPECT__;
		if (s) try {
			s({
				...t7("animation-start", t),
				options: i ? {
					...e,
					...i
				} : e
			})
		} catch {}
	}
	let ee = t => Array.isArray(t) && "number" == typeof t[0],
		ei = t3(() => {
			try {
				document.createElement("div").animate({
					opacity: 0
				}, {
					easing: "linear(0, 1)"
				})
			} catch (t) {
				return !1
			}
			return !0
		}, "linearEasing"),
		es = (t, e, i = 10) => {
			let s = "",
				n = Math.max(Math.round(e / i), 2);
			for (let e = 0; e < n; e++) s += Math.round(1e4 * t(e / (n - 1))) / 1e4 + ", ";
			return `linear(${s.substring(0,s.length-2)})`
		},
		en = ([t, e, i, s]) => `cubic-bezier(${t}, ${e}, ${i}, ${s})`,
		er = {
			linear: "linear",
			ease: "ease",
			easeIn: "ease-in",
			easeOut: "ease-out",
			easeInOut: "ease-in-out",
			circIn: en([0, .65, .55, 1]),
			circOut: en([.55, 0, 1, .45]),
			backIn: en([.31, .01, .66, -.59]),
			backOut: en([.33, 1.53, .69, .99])
		};

	function ea(t) {
		return "function" == typeof t && "applyToOptions" in t
	}
	class eo extends t8 {
		constructor(t) {
			if (super(), this.finishedTime = null, this.isStopped = !1, this.manualStartTime = null, !t) return;
			let {
				element: e,
				name: i,
				keyframes: s,
				pseudoElement: n,
				allowFlatten: r = !1,
				finalKeyframe: a,
				onComplete: o
			} = t;
			this.isPseudoElement = !!n, this.allowFlatten = r, this.options = t, tr.default;
			let l = function({
				type: t,
				...e
			}) {
				return ea(t) && ei() ? t.applyToOptions(e) : (e.duration ?? (e.duration = 300), e.ease ?? (e.ease = "easeOut"), e)
			}(t);
			this.animation = function(t, e, i, {
				delay: s = 0,
				duration: n = 300,
				repeat: r = 0,
				repeatType: a = "loop",
				ease: o = "easeOut",
				times: l
			} = {}, h) {
				let u = {
					[e]: i
				};
				l && (u.offset = l);
				let d = function t(e, i) {
					if (e) return "function" == typeof e ? ei() ? es(e, i) : "ease-out" : ee(e) ? en(e) : Array.isArray(e) ? e.map(e => t(e, i) || er.easeOut) : er[e]
				}(o, n);
				Array.isArray(d) && (u.easing = d);
				let c = {
					delay: s,
					duration: n,
					easing: Array.isArray(d) ? "linear" : d,
					fill: "both",
					iterations: r + 1,
					direction: "reverse" === a ? "alternate" : "normal"
				};
				return h && (c.pseudoElement = h), t.animate(u, c)
			}(e, i, s, l, n), !1 === l.autoplay && this.animation.pause(), this.animation.onfinish = this.onFinish = () => {
				if (this.animation.onfinish = null, this.finishedTime = this.time, !n) {
					let t = t4(s, this.options, a, this.speed);
					this.updateMotionValue?.(t), t1(e, i, t), this.animation.cancel()
				}
				o?.(), this.notifyFinished()
			}, et(this, t, l)
		}
		play() {
			this.isStopped || (this.manualStartTime = null, this.animation.onfinish = this.onFinish, this.animation.play(), "finished" === this.state && this.updateFinished())
		}
		pause() {
			this.animation.pause()
		}
		complete() {
			this.isStopped || (this.animation.onfinish = this.onFinish), this.animation.finish?.()
		}
		cancel() {
			this.animation.onfinish = null;
			try {
				this.animation.cancel()
			} catch (t) {}
		}
		stop() {
			this.isStopped || (this.isStopped = !0, "idle" !== this.state && null === this.finishedTime && (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(), this.isPseudoElement || this.cancel()))
		}
		commitStyles() {
			let t = this.options?.element;
			!this.isPseudoElement && t?.isConnected && this.animation.commitStyles?.()
		}
		get duration() {
			return Number(this.animation.effect?.getComputedTiming?.().duration || 0) / 1e3
		}
		get iterationDuration() {
			let {
				delay: t = 0
			} = this.options || {};
			return this.duration + t / 1e3
		}
		get time() {
			return (Number(this.animation.currentTime) || 0) / 1e3
		}
		set time(t) {
			let e = null !== this.finishedTime;
			this.manualStartTime = null, this.finishedTime = null, this.animation.currentTime = tZ(t), e && (this.animation.pause(), this.updateFinished())
		}
		get speed() {
			return this.animation.playbackRate
		}
		set speed(t) {
			t < 0 && (this.finishedTime = null), this.animation.playbackRate = t
		}
		get state() {
			return null !== this.finishedTime ? "finished" : this.animation.playState
		}
		get startTime() {
			return this.manualStartTime ?? Number(this.animation.startTime)
		}
		set startTime(t) {
			this.manualStartTime = this.animation.startTime = t
		}
		attachTimeline({
			timeline: t,
			onAttach: e,
			observe: i
		}) {
			return (this.allowFlatten && this.animation.effect?.updateTiming({
				easing: "linear"
			}), this.animation.onfinish = this.onFinish = null, t && t5()) ? (this.animation.timeline = t, e?.(this.animation), tL) : i(this)
		}
	}
	let el = new Set(["opacity", "clipPath", "filter", "transform"]),
		eh = new WeakMap,
		{
			schedule: eu
		} = tO(queueMicrotask, !1),
		ed = (t, e) => e ? 1e3 / e * t : 0,
		ec;
	class ep {
		constructor(t, e = {}) {
			this.canTrackVelocity = null, this.events = {}, this.updateAndNotify = t => {
				let e = t9.now();
				if (this.updatedAt !== e && this.setPrevFrameValue(), this.prev = this.current, this.setCurrent(t), this.current !== this.prev && (this.dirty(), this.dependents))
					for (let t of this.dependents) t.dirty()
			}, this.hasAnimated = !1, this.setCurrent(t), this.owner = e.owner
		}
		setCurrent(t) {
			this.current = t, this.updatedAt = t9.now(), null === this.canTrackVelocity && void 0 !== t && (this.canTrackVelocity = !isNaN(parseFloat(this.current)))
		}
		setPrevFrameValue(t = this.current) {
			this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt
		}
		onChange(t) {
			return this.on("change", t)
		}
		on(t, e) {
			var i;
			return "change" === t ? this.onChangeSubscribe(e) : ((i = this.events)[t] || (i[t] = new t0)).add(e)
		}
		onChangeSubscribe(t) {
			let {
				events: e
			} = this;
			return e.change || this.changeSubscriber ? (e.change || (e.change = new t0, e.change.add(this.changeSubscriber), this.changeSubscriber = void 0), e.change.add(t)) : this.changeSubscriber = t, () => {
				this.changeSubscriber === t ? this.changeSubscriber = void 0 : e.change?.remove(t), this.stopIfUnobserved()
			}
		}
		stopIfUnobserved() {
			tI.read(() => {
				this.changeSubscriber || this.events.change?.getSize() || this.stop()
			})
		}
		clearListeners() {
			for (let t in this.changeSubscriber = void 0, this.events) this.events[t].clear()
		}
		attach(t, e) {
			this.passiveEffect = t, this.stopPassiveEffect = e
		}
		set(t) {
			this.passiveEffect ? this.passiveEffect(t, this.updateAndNotify) : this.updateAndNotify(t)
		}
		setWithVelocity(t, e, i) {
			this.set(e), this.prev = void 0, this.prevFrameValue = t, this.prevUpdatedAt = this.updatedAt - i
		}
		jump(t, e = !0) {
			e && (this.updatedAt = t9.now(), this.stop()), this.updateAndNotify(t), this.prev = t, this.prevUpdatedAt = this.prevFrameValue = void 0, this.stopPassiveEffect?.()
		}
		dirty() {
			let {
				current: t,
				changeSubscriber: e
			} = this;
			e ? e(t) : this.events.change?.notify(t)
		}
		addDependent(t) {
			(this.dependents || (this.dependents = new Set)).add(t)
		}
		removeDependent(t) {
			this.dependents?.delete(t)
		}
		get() {
			ec?.push(this);
			let t = this.animation?.liveValue?.();
			return void 0 === t ? this.current : t
		}
		getCurrent() {
			return this.current
		}
		getPrevious() {
			return this.prev
		}
		getVelocity() {
			let t = t9.now();
			if (!this.canTrackVelocity || void 0 === this.prevFrameValue || t - this.updatedAt > 30) return 0;
			let e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
			return ed(parseFloat(this.current) - parseFloat(this.prevFrameValue), e)
		}
		start(t) {
			return new Promise(e => this.run(t, e))
		}
		run(t, e) {
			let i;
			this.stop(), this.hasAnimated = !0;
			let s = !1;
			i = t(() => {
				s = !0, this.events.animationComplete?.notify(), this.animation === i && (this.animation = void 0), e?.()
			}), s || (this.animation = i), this.events.animationStart?.notify()
		}
		stop() {
			this.animation && (this.animation.stop(), this.events.animationCancel?.notify()), this.animation = void 0
		}
		isAnimating() {
			return !!this.animation
		}
		destroy() {
			this.dependents?.clear(), this.events.destroy?.notify(), this.clearListeners(), this.stop(), this.stopPassiveEffect?.()
		}
	}

	function em(t, e) {
		return new ep(t, e)
	}
	let ef = new WeakMap;

	function eg(t) {
		return null !== t && "object" == typeof t && "function" == typeof t.start
	}

	function ey(t) {
		return "string" == typeof t || Array.isArray(t)
	}
	let ev = ["animate", "whileInView", "whileFocus", "whileHover", "whileTap", "whileDrag", "exit"],
		ex = ["initial"].concat(ev);

	function eb(t) {
		if (eg(t.animate)) return !0;
		for (let e = 0; e < ex.length; e++)
			if (ey(t[ex[e]])) return !0;
		return !1
	}

	function ew(t) {
		return !!(eb(t) || t.variants)
	}
	let eS = {
			current: null
		},
		eT = {
			current: !1
		},
		eA = "u" > typeof window;

	function eP() {
		if (eT.current = !0, eA)
			if (window.matchMedia) {
				let t = window.matchMedia("(prefers-reduced-motion)"),
					e = () => eS.current = t.matches;
				t.addEventListener("change", e), e()
			} else eS.current = !1
	}
	let ek = ["AnimationStart", "AnimationComplete", "Update", "BeforeLayoutMeasure", "LayoutMeasure", "LayoutAnimationStart", "LayoutAnimationComplete"],
		eM = {};
	class ej {
		scrapeMotionValuesFromProps(t, e, i) {
			return {}
		}
		constructor({
			parent: t,
			props: e,
			presenceContext: i,
			reducedMotionConfig: s,
			skipAnimations: n,
			blockInitialAnimation: r,
			visualState: a
		}, o = {}) {
			this.current = null, this.children = new Set, this.isVariantNode = !1, this.isControllingVariants = !1, this.shouldReduceMotion = null, this.shouldSkipAnimations = !1, this.values = new Map, this.KeyframeResolver = tH, this.features = {}, this.valueSubscriptions = new Map, this.prevMotionValues = {}, this.hasBeenMounted = !1, this.events = {}, this.propEventSubscriptions = {}, this.notifyUpdate = () => this.notify("Update", this.latestValues), this.render = () => {
				this.current && (this.triggerBuild(), this.renderInstance(this.current, this.renderState, this.props.style, this.projection))
			}, this.renderScheduledAt = 0, this.scheduleRender = () => {
				let t = t9.now();
				this.renderScheduledAt < t && (this.renderScheduledAt = t, tI.render(this.render, !1, !0))
			};
			let {
				latestValues: l,
				renderState: h
			} = a;
			this.latestValues = l, this.baseTarget = {
				...l
			}, this.initialValues = e.initial ? {
				...l
			} : {}, this.renderState = h, this.parent = t, this.props = e, this.presenceContext = i, this.depth = t ? t.depth + 1 : 0, this.reducedMotionConfig = s, this.skipAnimationsConfig = n, this.options = o, this.blockInitialAnimation = !!r, this.isControllingVariants = eb(e), this.isVariantNode = ew(e), this.isVariantNode && (this.variantChildren = new Set), this.manuallyAnimateOnMount = !!(t && t.current);
			let {
				willChange: u,
				...d
			} = this.scrapeMotionValuesFromProps(e, {}, this);
			for (let t in d) {
				let e = d[t];
				void 0 !== l[t] && te(e) && e.set(l[t])
			}
		}
		mount(t) {
			let e = this.presenceContext;
			if (this.hasBeenMounted && e?.isPresent !== !1 && !e?.keepValuesOnRemount)
				for (let t in this.initialValues) this.values.get(t)?.jump(this.initialValues[t]), this.latestValues[t] = this.initialValues[t];
			if (this.current = t, ef.set(t, this), this.projection?.instance || this.projection?.mount(t), this.isVariantNode && !this.isControllingVariants) {
				let t = this;
				do t = !1 !== t.props.inherit && t.parent; while (t && !t.isVariantNode) if (t) {
					let {
						variantChildren: e
					} = t;
					e.add(this), this.removeFromVariantTree = () => e.delete(this)
				}
			}
			this.values.forEach((t, e) => this.bindToMotionValue(e, t)), "never" === this.reducedMotionConfig ? this.shouldReduceMotion = !1 : "always" === this.reducedMotionConfig ? this.shouldReduceMotion = !0 : (eT.current || eP(), this.shouldReduceMotion = eS.current), this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1, this.parent?.addChild(this), this.update(this.props, this.presenceContext), this.hasBeenMounted = !0
		}
		unmount() {
			for (let t in this.projection?.unmount(), tU(this.notifyUpdate), tU(this.render), this.valueSubscriptions.forEach(t => t()), this.valueSubscriptions.clear(), this.removeFromVariantTree?.(), this.parent?.removeChild(this), this.events) this.events[t].clear();
			for (let t in this.features) {
				let e = this.features[t];
				e && (e.unmount(), e.isMounted = !1)
			}
			this.current = null
		}
		addChild(t) {
			this.children.add(t), (this.enteringChildren || (this.enteringChildren = new Set)).add(t)
		}
		removeChild(t) {
			this.children.delete(t), this.enteringChildren?.delete(t)
		}
		bindToMotionValue(t, e) {
			let i;
			if (this.valueSubscriptions.get(t)?.(), e.accelerate && el.has(t) && this.current instanceof HTMLElement) {
				let {
					factory: i,
					keyframes: s,
					times: n,
					ease: r,
					duration: a
				} = e.accelerate, o = new eo({
					element: this.current,
					name: t,
					keyframes: s,
					times: n,
					ease: r,
					duration: tZ(a)
				}), l = i(o);
				this.valueSubscriptions.set(t, () => {
					l(), o.cancel()
				});
				return
			}
			let s = u.has(t);
			s && this.onBindTransform && this.onBindTransform();
			let n = e.on("change", e => {
				this.latestValues[t] = e, this.props.onUpdate && tI.preRender(this.notifyUpdate), s && (this.projection && (this.projection.isTransformDirty = !0), eh.get(this.current)?.check()), this.scheduleRender()
			});
			"u" > typeof window && window.MotionCheckAppearSync && (i = window.MotionCheckAppearSync(this, t, e)), this.valueSubscriptions.set(t, () => {
				n(), i?.()
			})
		}
		sortNodePosition(t) {
			return this.current && t.current && this.sortInstanceNodePosition && this.type === t.type ? this.sortInstanceNodePosition(this.current, t.current) : 0
		}
		updateFeatures() {
			let t = "animation";
			for (t in eM) {
				let e = eM[t];
				if (!e) continue;
				let {
					isEnabled: i,
					Feature: s
				} = e;
				if (!this.features[t] && s && i(this.props) && (this.features[t] = new s(this)), this.features[t]) {
					let e = this.features[t];
					e.isMounted ? e.update() : (e.mount(), e.isMounted = !0)
				}
			}
		}
		triggerBuild() {
			this.build(this.renderState, this.latestValues, this.props)
		}
		measureViewportBox() {
			return this.current ? this.measureInstanceViewportBox(this.current, this.props) : tt()
		}
		getStaticValue(t) {
			return this.latestValues[t]
		}
		setStaticValue(t, e) {
			this.latestValues[t] = e
		}
		update(t, e) {
			let {
				transformTemplate: i,
				onUpdate: s
			} = this.props;
			(t.transformTemplate || i) && this.scheduleRender(), (t.transformTemplate && !i || t.onUpdate && !s) && eh.get(this.current)?.demote(), this.prevProps = this.props, this.props = t, this.prevPresenceContext = this.presenceContext, this.presenceContext = e;
			for (let e = 0; e < ek.length; e++) {
				let i = ek[e];
				this.propEventSubscriptions[i]?.(), delete this.propEventSubscriptions[i];
				let s = t["on" + i];
				s && (this.propEventSubscriptions[i] = this.on(i, s))
			}
			this.prevMotionValues = function(t, e, i) {
				for (let s in e) {
					let n = e[s],
						r = i[s];
					if (te(n)) t.addValue(s, n);
					else if (te(r)) t.addValue(s, em(n, {
						owner: t
					}));
					else if (r !== n)
						if (t.hasValue(s)) {
							let e = t.getValue(s);
							!0 === e.liveStyle ? e.jump(n) : e.hasAnimated || e.set(n)
						} else {
							let e = t.getStaticValue(s);
							t.addValue(s, em(void 0 !== e ? e : n, {
								owner: t
							}))
						}
				}
				for (let s in i) void 0 === e[s] && t.removeValue(s);
				return e
			}(this, this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this), this.prevMotionValues), this.handleChildMotionValue?.()
		}
		getProps() {
			return this.props
		}
		getVariant(t) {
			return this.props.variants?.[t]
		}
		getDefaultTransition() {
			return this.props.transition
		}
		getTransformPagePoint() {
			return this.props.transformPagePoint
		}
		addValue(t, e) {
			let i = this.values.get(t);
			if (e !== i) {
				i && this.removeValue(t), this.bindToMotionValue(t, e), this.values.set(t, e);
				let s = e.get();
				void 0 !== s && (this.latestValues[t] = s)
			}
		}
		removeValue(t) {
			this.values.delete(t), this.valueSubscriptions.get(t)?.(), this.valueSubscriptions.delete(t), delete this.latestValues[t], this.removeValueFromRenderState(t, this.renderState)
		}
		hasValue(t) {
			return this.values.has(t)
		}
		getValue(t, e) {
			let i = this.props.values?.[t];
			return i || void 0 === (i = this.values.get(t)) && void 0 !== e && (i = em(e ?? this.getDefaultValue?.(t), {
				owner: this
			}), this.addValue(t, i)), i
		}
		readValue(t, e) {
			let i = void 0 === this.latestValues[t] && this.current ? this.getBaseTargetFromProps(this.props, t) ?? this.readValueFromInstance(this.current, t, this.options) : this.latestValues[t];
			if (null != i) {
				let s, n;
				"string" == typeof i && (s = i, /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(s) || (n = i, /^0[^.\s]+$/u.test(n))) ? i = parseFloat(i) : "number" != typeof i && !U.test(i) && U.test(e) && (i = tf(t, e)), this.setBaseTarget(t, te(i) ? i.get() : i)
			}
			return te(i) ? i.get() : i
		}
		setBaseTarget(t, e) {
			this.baseTarget[t] = e
		}
		on(t, e) {
			return (this.events[t] || (this.events[t] = new t0)).add(e)
		}
		notify(t, ...e) {
			this.events[t]?.notify(...e)
		}
		scheduleRenderMicrotask() {
			eu.render(this.render)
		}
	}
	class eE extends ej {
		constructor() {
			super(...arguments), this.KeyframeResolver = tq
		}
		sortInstanceNodePosition(t, e) {
			return 2 & t.compareDocumentPosition(e) ? 1 : -1
		}
		getBaseTargetFromProps(t, e) {
			let i = t.style;
			return i ? i[e] : void 0
		}
		removeValueFromRenderState(t, {
			vars: e,
			style: i
		}) {
			delete e[t], delete i[t]
		}
		handleChildMotionValue() {
			this.childSubscription && (this.childSubscription(), delete this.childSubscription);
			let {
				children: t
			} = this.props;
			te(t) && (this.childSubscription = t.on("change", t => {
				this.current && (this.current.textContent = `${t}`)
			}))
		}
	}

	function eC(t) {
		return t.replace(/([A-Z])/g, t => `-${t.toLowerCase()}`)
	}
	let eV = (t, e) => e && "number" == typeof t ? e.transform(t) : t,
		eD = {
			x: "translateX",
			y: "translateY",
			z: "translateZ",
			transformPerspective: "perspective"
		},
		eR = h.length,
		eL = {},
		eF = (t, e, i = eV(e, G[t])) => (eL[t] || (eL[t] = (eD[t] || t) + "(")) + i + ")",
		eN = (t, e) => ("number" == typeof e ? e : parseFloat(e)) === +!!t.startsWith("scale");

	function eO(t, e, i) {
		let {
			style: s,
			vars: n,
			transformOrigin: r
		} = t, a = !1, o = !1;
		for (let t in e) {
			let i = e[t];
			if (u.has(t)) {
				a = !0;
				continue
			}
			if (to(t)) {
				n[t] = i;
				continue
			} {
				let e = eV(i, H[t]);
				t.startsWith("origin") ? (o = !0, r[t] = e) : s[t] = e
			}
		}
		if (!e.transform && (a || i ? s.transform = function(t, e, i) {
				let s = "";
				for (let n = 0; n < eR; n++) {
					let r = h[n],
						a = t[r];
					if (void 0 === a) continue;
					let o = i && (e[r] = eV(a, H[r]));
					eN(r, a) || (s += eF(r, a, o || void 0) + " ")
				}
				let n = t.pathRotation;
				return n && (s += eF("rotate", n)), s = s.trim(), i ? i(e, s) : s || "none"
			}(e, t.transform, i) : s.transform && (s.transform = "none")), o) {
			let {
				originX: t = "50%",
				originY: e = "50%",
				originZ: i = 0
			} = r;
			s.transformOrigin = `${t} ${e} ${i}`
		}
	}
	let eB = {
			offset: "stroke-dashoffset",
			array: "stroke-dasharray"
		},
		eI = {
			offset: "strokeDashoffset",
			array: "strokeDasharray"
		},
		eU = ["transform", "opacity", "clipPath", "filter", "offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];

	function eW(t, {
		attrX: e,
		attrY: i,
		attrScale: s,
		pathLength: n,
		pathSpacing: r = 1,
		pathOffset: a = 0,
		...o
	}, l, h, u) {
		if (eO(t, o, h), l) {
			t.style.viewBox && (t.attrs.viewBox = t.style.viewBox);
			return
		}
		t.attrs = t.style, t.style = {};
		let {
			attrs: d,
			style: c
		} = t;
		for (let t of eU) void 0 !== d[t] && (c[t] = d[t], delete d[t]);
		(c.transform || d.transformOrigin) && (c.transformOrigin = d.transformOrigin ?? "50% 50%", delete d.transformOrigin), c.transform && (c.transformBox = u?.transformBox ?? "fill-box", delete d.transformBox), void 0 !== e && (d.x = e), void 0 !== i && (d.y = i), void 0 !== s && (d.scale = s), void 0 !== n && function(t, e, i = 1, s = 0, n = !0) {
			t.pathLength = 1;
			let r = n ? eB : eI;
			t[r.offset] = `${-s}`, t[r.array] = `${e} ${i}`
		}(d, n, r, a, !1)
	}
	let ez = new Set(["baseFrequency", "diffuseConstant", "kernelMatrix", "kernelUnitLength", "keySplines", "keyTimes", "limitingConeAngle", "markerHeight", "markerWidth", "numOctaves", "targetX", "targetY", "surfaceScale", "specularConstant", "specularExponent", "stdDeviation", "tableValues", "viewBox", "gradientTransform", "pathLength", "startOffset", "textLength", "lengthAdjust"]),
		e$ = t => "string" == typeof t && "svg" === t.toLowerCase();

	function e_(t, {
		style: e,
		vars: i
	}, s, n) {
		let r, a = t.style;
		for (r in e) a[r] = e[r];
		for (r in n?.applyProjectionStyles(a, s), i) a.setProperty(r, i[r])
	}
	let eK = {};

	function eY(t, {
		layout: e,
		layoutId: i
	}) {
		return u.has(t) || t.startsWith("origin") || (e || void 0 !== i) && (!!eK[t] || "opacity" === t)
	}

	function eG(t, e, i) {
		let s = t.style,
			n = e?.style,
			r = {};
		if (!s) return r;
		for (let e in s)(te(s[e]) || n && te(n[e]) || eY(e, t) || i?.getValue(e)?.liveStyle !== void 0) && (r[e] = s[e]);
		return r
	}

	function eH(t, e, i) {
		let s = eG(t, e, i);
		for (let i in t) "children" !== i && (te(t[i]) || te(e[i])) && (s[-1 !== h.indexOf(i) ? "attr" + i.charAt(0).toUpperCase() + i.substring(1) : i] = t[i]);
		return s
	}
	class eX extends eE {
		constructor() {
			super(...arguments), this.type = "svg", this.isSVGTag = !1, this.measureInstanceViewportBox = tt
		}
		getBaseTargetFromProps(t, e) {
			return u.has(e) ? super.getBaseTargetFromProps(t, e) ?? tT(e) : t[e]
		}
		getDefaultValue(t) {
			return u.has(t) ? this.latestValues[t] ?? tT(t) : void 0
		}
		readValueFromInstance(t, e) {
			if (u.has(e)) {
				let t = q(e);
				return t && t.default || 0
			}
			if (eU.includes(e)) {
				let i = getComputedStyle(t)[e];
				if ("string" == typeof i && i) return i.trim()
			}
			return e = ez.has(e) ? e : eC(e), t.getAttribute(e)
		}
		scrapeMotionValuesFromProps(t, e, i) {
			return eH(t, e, i)
		}
		build(t, e, i) {
			eW(t, e, this.isSVGTag, i.transformTemplate, i.style)
		}
		renderInstance(t, e, i, s) {
			for (let i in e_(t, e, void 0, s), e.attrs) t.setAttribute(ez.has(i) ? i : eC(i), e.attrs[i])
		}
		mount(t) {
			this.isSVGTag = e$(t.tagName), super.mount(t)
		}
	}

	function eq({
		top: t,
		left: e,
		right: i,
		bottom: s
	}) {
		return {
			x: {
				min: e,
				max: i
			},
			y: {
				min: t,
				max: s
			}
		}
	}
	let eZ = (t, e, i) => t + (e - t) * i;

	function eJ(t) {
		return void 0 === t || 1 === t
	}

	function eQ({
		scale: t,
		scaleX: e,
		scaleY: i
	}) {
		return !eJ(t) || !eJ(e) || !eJ(i)
	}
	let e0 = ["rotate", "rotateX", "rotateY", "rotateZ", "skewX", "skewY"];

	function e1(t) {
		return eQ(t) || e3(t) || e2(t)
	}

	function e2(t) {
		return t.z || t.rotate || t.rotateX || t.rotateY || t.rotateZ || t.skewX || t.skewY
	}

	function e3(t) {
		var e, i;
		return (e = t.x) && "0%" !== e || (i = t.y) && "0%" !== i
	}

	function e5(t, e, i, s, n) {
		return void 0 !== n && (t = s + n * (t - s)), s + i * (t - s) + e
	}

	function e4(t, e = 0, i = 1, s, n) {
		t.min = e5(t.min, e, i, s, n), t.max = e5(t.max, e, i, s, n)
	}

	function e8(t, {
		x: e,
		y: i
	}) {
		e4(t.x, e.translate, e.scale, e.originPoint), e4(t.y, i.translate, i.scale, i.originPoint)
	}

	function e6(t, e) {
		t.min += e, t.max += e
	}

	function e9(t, e, i, s, n = .5) {
		let r = eZ(t.min, t.max, n);
		e4(t, e, i, r, s)
	}

	function e7(t, e) {
		return "string" == typeof t ? parseFloat(t) / 100 * (e.max - e.min) : t
	}

	function it(t, e, i) {
		let s = i ?? t;
		e9(t.x, e7(e.x, s.x), e.scaleX, e.scale, e.originX), e9(t.y, e7(e.y, s.y), e.scaleY, e.scale, e.originY)
	}

	function ie(t, e) {
		return eq(function(t, e) {
			if (!e) return t;
			let i = e({
					x: t.left,
					y: t.top
				}),
				s = e({
					x: t.right,
					y: t.bottom
				});
			return {
				top: i.y,
				left: i.x,
				bottom: s.y,
				right: s.x
			}
		}(t.getBoundingClientRect(), e))
	}
	class ii extends eE {
		constructor() {
			super(...arguments), this.type = "html", this.renderInstance = e_
		}
		mount(t) {
			super.mount(t)
		}
		readValueFromInstance(t, e) {
			if (u.has(e)) return this.projection?.isProjecting ? tT(e) : tP(t, e);
			{
				let i = window.getComputedStyle(t),
					s = (to(e) ? i.getPropertyValue(e) : i[e]) || 0;
				return "string" == typeof s ? s.trim() : s
			}
		}
		measureInstanceViewportBox(t, {
			transformPagePoint: e
		}) {
			return ie(t, e)
		}
		build(t, e, i) {
			eO(t, e, i.transformTemplate)
		}
		scrapeMotionValuesFromProps(t, e, i) {
			return eG(t, e, i)
		}
	}
	var is = t.i(170380);
	let ir = ["animate", "circle", "defs", "desc", "ellipse", "g", "image", "line", "filter", "marker", "mask", "metadata", "path", "pattern", "polygon", "polyline", "rect", "stop", "switch", "symbol", "svg", "text", "tspan", "use", "view"];

	function ia(t) {
		if ("string" != typeof t || t.includes("-"));
		else if (ir.indexOf(t) > -1 || /[A-Z]/u.test(t)) return !0;
		return !1
	}
	var io = t.i(234984);
	let il = {
			current: void 0
		},
		ih = (0, is.createContext)({}),
		iu = (0, is.createContext)({
			strict: !1
		}),
		id = (0, is.createContext)({
			transformPagePoint: t => t,
			isStatic: !1,
			reducedMotion: "never"
		}),
		ic = (0, is.createContext)({});

	function ip(t) {
		return Array.isArray(t) ? t.join(" ") : t
	}
	let im = () => ({
		style: {},
		transform: {},
		transformOrigin: {},
		vars: {}
	});

	function ig(t, e, i) {
		for (let s in e) te(e[s]) || eY(s, i) || (t[s] = e[s])
	}
	let iy = () => ({
			...im(),
			attrs: {}
		}),
		iv = new Set(["animate", "exit", "variants", "initial", "style", "values", "transition", "transformTemplate", "custom", "inherit", "onBeforeLayoutMeasure", "onAnimationStart", "onAnimationComplete", "onUpdate", "onDragStart", "onDrag", "onDragEnd", "onMeasureDragConstraints", "onDirectionLock", "onDragTransitionEnd", "_dragX", "_dragY", "onHoverStart", "onHoverEnd", "onViewportEnter", "onViewportLeave", "globalTapTarget", "tap", "propagate", "ignoreStrict", "viewport"]);

	function ix(t) {
		return t.startsWith("while") || t.startsWith("drag") && "draggable" !== t || t.startsWith("layout") || t.startsWith("onTap") || t.startsWith("onPan") || t.startsWith("onLayout") || iv.has(t)
	}

	function ib(t) {
		return te(t) ? t.get() : t
	}

	function iw(t, e, i, s) {
		let n = e => {
			let n;
			return "function" == typeof e ? e(void 0 !== i ? i : t.custom, ...(n = [{}, {}], s?.values.forEach((t, e) => {
				n[0][e] = t.get(), n[1][e] = t.getVelocity()
			}), n)) : e
		};
		return "string" == typeof(e = n(e)) && (e = t.variants && t.variants[e]), n(e)
	}
	let iS = (0, is.createContext)(null);

	function iT(t) {
		let e = (0, is.useRef)(null);
		return null === e.current && (e.current = t()), e.current
	}
	let iA = t => (e, i) => {
			let s = (0, is.useContext)(ic),
				n = (0, is.useContext)(iS),
				r = () => (function({
					scrapeMotionValuesFromProps: t,
					createRenderState: e
				}, i, s, n) {
					return {
						latestValues: function(t, e, i, s) {
							let n = {},
								r = s(t, {});
							for (let t in r) n[t] = ib(r[t]);
							let {
								initial: a,
								animate: o
							} = t, l = eb(t), h = ew(t);
							e && h && !l && !1 !== t.inherit && (void 0 === a && (a = e.initial), void 0 === o && (o = e.animate));
							let u = !!i && !1 === i.initial,
								d = (u = u || !1 === a) ? o : a;
							if (d && "boolean" != typeof d && !eg(d)) {
								let e = Array.isArray(d) ? d : [d];
								for (let i = 0; i < e.length; i++) {
									let s = iw(t, e[i]);
									if (s) {
										let {
											transitionEnd: t,
											transition: e,
											...i
										} = s;
										for (let t in i) {
											let e = i[t];
											if (Array.isArray(e)) {
												let t = u ? e.length - 1 : 0;
												e = e[t]
											}
											null !== e && (n[t] = e)
										}
										for (let e in t) n[e] = t[e]
									}
								}
							}
							return n
						}(i, s, n, t),
						renderState: e()
					}
				})(t, e, s, n);
			return i ? r() : iT(r)
		},
		iP = iA({
			scrapeMotionValuesFromProps: eG,
			createRenderState: im
		}),
		ik = iA({
			scrapeMotionValuesFromProps: eH,
			createRenderState: iy
		}),
		iM = {
			animation: ["variants", ...ev],
			exit: ["exit"],
			drag: ["drag", "dragControls"],
			focus: ["whileFocus"],
			hover: ["whileHover", "onHoverStart", "onHoverEnd"],
			tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
			pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
			inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
			layout: ["layout", "layoutId"]
		},
		ij = !1;

	function iE() {
		return ! function() {
			if (ij) return;
			let t = {};
			for (let e in iM) t[e] = {
				isEnabled: t => iM[e].some(e => !!t[e])
			};
			eM = t, ij = !0
		}(), eM
	}
	let iC = Symbol.for("motionComponentSymbol"),
		iV = "data-framer-appear-id",
		iD = (0, is.createContext)({}),
		iR = "u" > typeof window ? is.useLayoutEffect : is.useEffect;

	function iL(t, {
		forwardMotionProps: e = !1,
		type: i
	} = {}, s, n) {
		s && function(t) {
			let e = iE();
			for (let i in t) e[i] = {
				...e[i],
				...t[i]
			};
			eM = e
		}(s);
		let r = i ? "svg" === i : ia(t),
			a = r ? ik : iP;

		function o(i, s) {
			var o;
			let l, h, u, d = function({
				layoutId: t
			}) {
				let e = (0, is.useContext)(ih).id;
				return e && void 0 !== t ? e + "-" + t : t
			}(i);
			iT(() => !!il.current?.sharedNodes.get(d)?.lead && i.initial) && (i = {
				...i,
				initial: !1
			});
			let c = {
					...(0, is.useContext)(id),
					...i,
					layoutId: d
				},
				{
					isStatic: p,
					isValidProp: m
				} = c,
				f = function(t) {
					let {
						initial: e,
						animate: i
					} = function(t, e) {
						if (eb(t)) {
							let {
								initial: e,
								animate: i
							} = t;
							return {
								initial: !1 === e || ey(e) ? e : void 0,
								animate: ey(i) ? i : void 0
							}
						}
						return !1 !== t.inherit ? e : {}
					}(t, (0, is.useContext)(ic));
					return (0, is.useMemo)(() => ({
						initial: e,
						animate: i
					}), [ip(e), ip(i)])
				}(i),
				g = a(i, p);
			if (!p && "u" > typeof window) {
				(0, is.useContext)(iu).strict;
				let e = function(t) {
					let {
						drag: e,
						layout: i
					} = iE();
					if (!e && !i) return {};
					let s = {
						...e,
						...i
					};
					return {
						MeasureLayout: s.MeasureLayout,
						isEnabled: e?.isEnabled(t) || i?.isEnabled(t),
						ProjectionNode: s.ProjectionNode
					}
				}(c);
				f.visualElement = function(t, e, i, s, n, r) {
					let {
						visualElement: a
					} = (0, is.useContext)(ic), o = (0, is.useContext)(iu), l = (0, is.useContext)(iS), h = (0, is.useContext)(id), u = h.reducedMotion, d = h.skipAnimations, c = (0, is.useRef)(null), p = (0, is.useRef)(!1);
					s = s || o.renderer, !c.current && s && (c.current = s(t, {
						visualState: e,
						parent: a,
						props: i,
						presenceContext: l,
						blockInitialAnimation: !!l && !1 === l.initial,
						reducedMotionConfig: u,
						skipAnimations: d,
						isSVG: r
					}), p.current && c.current && (c.current.manuallyAnimateOnMount = !0));
					let m = c.current,
						f = (0, is.useContext)(iD);
					m && !m.projection && n && ("html" === m.type || "svg" === m.type) && n.create(m, i, f), (0, is.useInsertionEffect)(() => {
						m && m.props !== i && m.update(i, l)
					});
					let g = i[iV],
						y = (0, is.useRef)(!!g && "u" > typeof window && !window.MotionHandoffIsComplete?.(g) && window.MotionHasOptimisedAnimation?.(g));
					return iR(() => {
						p.current && m && (m.animationState?.animateChanges(), m.enteringChildren = void 0)
					}, []), iR(() => {
						p.current = !0, m && (window.MotionIsMounted = !0, m.updateFeatures(), m.scheduleRenderMicrotask(), y.current && m.animationState && m.animationState.animateChanges())
					}), (0, is.useEffect)(() => {
						m && (!y.current && m.animationState && m.animationState.animateChanges(), y.current && (queueMicrotask(() => {
							window.MotionHandoffMarkAsComplete?.(g)
						}), y.current = !1), m.enteringChildren = void 0)
					}), m
				}(t, g, c, n, e.ProjectionNode, r), (e.isEnabled || f.visualElement?.projection?.options.layoutId) && (l = e.MeasureLayout)
			}
			return (0, io.jsxs)(ic.Provider, {
				value: f,
				children: [l && f.visualElement ? (0, io.jsx)(l, {
					visualElement: f.visualElement,
					...c
				}) : null, function(t, e, i, {
					latestValues: s
				}, n, r = !1, a, o) {
					let l = (a ?? ia(t) ? function(t, e, i, s) {
							let n = (0, is.useMemo)(() => {
								let i = iy();
								return eW(i, e, e$(s), t.transformTemplate, t.style), {
									...i.attrs,
									style: {
										...i.style
									}
								}
							}, [e]);
							if (t.style) {
								let e = {};
								return ig(e, t.style, t), {
									...n,
									style: {
										...e,
										...n.style
									}
								}
							}
							return n
						} : function(t, e) {
							let i, s, n = {},
								r = (i = t.style || {}, ig(s = {}, i, t), Object.assign(s, function({
									transformTemplate: t
								}, e) {
									return (0, is.useMemo)(() => {
										let i = im();
										return eO(i, e, t), Object.assign({}, i.vars, i.style)
									}, [e])
								}(t, e)), s);
							return t.drag && !1 !== t.dragListener && (n.draggable = !1, r.userSelect = r.WebkitUserSelect = r.WebkitTouchCallout = "none", r.touchAction = !0 === t.drag ? "none" : `pan-${"x"===t.drag?"y":"x"}`), void 0 === t.tabIndex && (t.onTap || t.onTapStart || t.whileTap) && (n.tabIndex = 0), n.style = r, n
						})(e, s, n, t),
						h = function(t, e, i, s) {
							let n = {};
							for (let r in t)("values" !== r || "object" != typeof t.values) && !te(t[r]) && ((r.startsWith("on") ? !ix(r) : s?.(r) ?? !ix(r)) || !0 === i && ix(r) || !e && !ix(r) || t.draggable && r.startsWith("onDrag")) && (n[r] = t[r]);
							return n
						}(e, "string" == typeof t, r, o),
						u = t !== is.Fragment ? {
							...h,
							...l,
							ref: i
						} : {},
						{
							children: d
						} = e,
						c = (0, is.useMemo)(() => te(d) ? d.get() : d, [d]);
					return (0, is.createElement)(t, {
						...u,
						children: c
					})
				}(t, i, (o = f.visualElement, h = (0, is.useRef)(s), (0, is.useInsertionEffect)(() => {
					h.current = s
				}), u = (0, is.useRef)(null), (0, is.useCallback)(t => {
					t && g.onMount?.(t), o && (t ? o.mount(t) : o.unmount());
					let e = h.current;
					if ("function" == typeof e)
						if (t) {
							let i = e(t);
							"function" == typeof i && (u.current = i)
						} else u.current ? (u.current(), u.current = null) : e(t);
					else e && (e.current = t)
				}, [o])), g, p, e, r, m)]
			})
		}
		o.displayName = `motion.${"string"==typeof t?t:`create(${t.displayName??t.name??""})`}`;
		let l = (0, is.forwardRef)(o);
		return l[iC] = t, l
	}
	class iF {
		constructor(t) {
			this.isMounted = !1, this.node = t
		}
		update() {}
	}

	function iN(t, e, i) {
		return iw(t.getProps(), e, i, t)
	}
	let iO = (t, e) => "exit" === e ? t.presenceContext?.custom : void 0;

	function iB(t, e) {
		if (t?.inherit && e) {
			let {
				inherit: i,
				...s
			} = t;
			return {
				...e,
				...s
			}
		}
		return t
	}

	function iI(t, e) {
		let i = t?.[e] ?? t?.default ?? t;
		return i !== t ? iB(i, t) : i
	}

	function iU(t, e) {
		let i = t.getValue("willChange");
		if (te(i) && i.add) return i.add(e);
		if (!i && tF.WillChange) {
			let i = new tF.WillChange("auto");
			t.addValue("willChange", i), i.add(e)
		}
	}
	let iW = (...t) => t.reduce((t, e) => i => e(t(i)));

	function iz(t, e, i) {
		return (i < 0 && (i += 1), i > 1 && (i -= 1), i < 1 / 6) ? t + (e - t) * 6 * i : i < .5 ? e : i < 2 / 3 ? t + (e - t) * (2 / 3 - i) * 6 : t
	}

	function i$(t, e) {
		return i => i > 0 ? e : t
	}
	let i_ = (t, e, i) => {
			let s = t * t,
				n = i * (e * e - s) + s;
			return n < 0 ? 0 : Math.sqrt(n)
		},
		iK = [T, w, V];

	function iY(t) {
		let e = iK.find(e => e.test(t));
		if (!e) return !1;
		let i = e.parse(t);
		return e === V && (i = function({
			hue: t,
			saturation: e,
			lightness: i,
			alpha: s
		}) {
			t /= 360, i /= 100;
			let n = 0,
				r = 0,
				a = 0;
			if (e /= 100) {
				let s = i < .5 ? i * (1 + e) : i + e - i * e,
					o = 2 * i - s;
				n = iz(o, s, t + 1 / 3), r = iz(o, s, t), a = iz(o, s, t - 1 / 3)
			} else n = r = a = i;
			return {
				red: Math.round(255 * n),
				green: Math.round(255 * r),
				blue: Math.round(255 * a),
				alpha: s
			}
		}(i)), i
	}
	let iG = (t, e) => {
			let i = iY(t),
				s = iY(e);
			if (!i || !s) return i$(t, e);
			let n = {
				...i
			};
			return t => (n.red = i_(i.red, s.red, t), n.green = i_(i.green, s.green, t), n.blue = i_(i.blue, s.blue, t), n.alpha = eZ(i.alpha, s.alpha, t), w.transform(n))
		},
		iH = new Set(["none", "hidden"]);

	function iX(t, e) {
		return i => eZ(t, e, i)
	}

	function iq(t) {
		return "number" == typeof t ? iX : "string" == typeof t ? th(t) ? i$ : D.test(t) ? iG : iQ : Array.isArray(t) ? iZ : "object" == typeof t ? D.test(t) ? iG : iJ : i$
	}

	function iZ(t, e) {
		let i = [...t],
			s = i.length,
			n = t.map((t, i) => iq(t)(t, e[i]));
		return t => {
			for (let e = 0; e < s; e++) i[e] = n[e](t);
			return i
		}
	}

	function iJ(t, e) {
		let i = {
				...t,
				...e
			},
			s = {};
		for (let n in i) void 0 !== t[n] && void 0 !== e[n] && (s[n] = iq(t[n])(t[n], e[n]));
		return t => {
			for (let e in s) i[e] = s[e](t);
			return i
		}
	}
	let iQ = (t, e) => {
			let i = B(t),
				s = B(e);
			if (!(i.indexes.var.length === s.indexes.var.length && i.indexes.color.length === s.indexes.color.length && i.indexes.number.length >= s.indexes.number.length)) return i$(t, e);
			if (iH.has(t) && !s.values.length || iH.has(e) && !i.values.length) return iH.has(t) ? i => i <= 0 ? t : e : i => i >= 1 ? e : t;
			return iW(iZ(function(t, e) {
				let i = [],
					s = {
						color: 0,
						var: 0,
						number: 0
					};
				for (let n = 0; n < e.values.length; n++) {
					let r = e.types[n],
						a = t.indexes[r][s[r]],
						o = t.values[a] ?? 0;
					i[n] = o, s[r]++
				}
				return i
			}(i, s), s.values), I(s))
		},
		i0 = /^(-?(?:\d+(?:\.\d*)?|\.\d+))([a-z%]*)$/iu;

	function i1(t, e, i) {
		if ("number" == typeof t && "number" == typeof e && "number" == typeof i) return eZ(t, e, i);
		if ("string" == typeof t && "string" == typeof e) {
			let i = function(t, e) {
				let i = i0.exec(t);
				if (!i) return;
				let s = i0.exec(e);
				if (!s || i[2] !== s[2]) return;
				let n = i[2],
					r = parseFloat(i[1]),
					a = parseFloat(s[1]);
				return t => f(eZ(r, a, t)) + n
			}(t, e);
			if (i) return i
		}
		return iq(t)(t, e)
	}
	let i2 = t => {
		let e = ({
			timestamp: e
		}) => t(e);
		return {
			start: (t = !0) => tI.update(e, t),
			stop: () => tU(e),
			now: () => tB.isProcessing ? tB.timestamp : t9.now()
		}
	};

	function i3(t, e = 50, i = 2e4, s) {
		let n = 0,
			r = t.next(n);
		for (s?.push(r.value); !r.done && n < i;) n += e, r = t.next(n), s?.push(r.value);
		return n >= i ? 1 / 0 : n
	}

	function i5(t, e = 100, i) {
		let {
			keyframes: s,
			velocity: n
		} = t, r = s && s[s.length - 1] - s[0], a = i({
			...t,
			velocity: n && r ? n * e / r : n,
			keyframes: [0, e]
		}), o = Math.min(i3(a), 2e4);
		return {
			type: "keyframes",
			ease: t => a.next(o * t).value / e,
			duration: o / 1e3
		}
	}
	let i4 = t => t < 0 ? 1 / Math.max(1 + t, .05) : Math.max(1 - t, .05);

	function i8(t, e) {
		if (!(t > 1)) return 1;
		let i = Math.sqrt(t * t - 1),
			s = t - i,
			n = t + i,
			r = 2 * i * Math.exp(-e) * (1 + e);
		return i9(t => n * Math.exp(-s * t) - s * Math.exp(-n * t) - r, t => Math.exp(-n * t) - Math.exp(-s * t), e) / e
	}

	function i6(t, e) {
		return t * Math.sqrt(1 - e * e)
	}

	function i9(t, e, i) {
		let s = i;
		for (let i = 1; i < 12; i++) s -= t(s) / e(s);
		return s
	}
	let i7 = (t, e) => (e ? t >= 0 : t > 0) && t < 1 / 0;

	function st(t, e) {
		if (i7(t, e)) return t
	}

	function se(t = .3, e = .3) {
		let i, s, n, r = "object" != typeof t ? {
				visualDuration: t,
				keyframes: [0, 1],
				bounce: e
			} : t,
			a = r.keyframes[0],
			o = r.keyframes[r.keyframes.length - 1],
			l = {
				done: !1,
				value: a
			},
			{
				stiffness: h,
				damping: u,
				mass: c,
				duration: p,
				isResolvedFromDuration: m,
				isTimeDefined: f
			} = function(t) {
				let e = st(t.stiffness),
					i = st(t.damping, !0),
					s = st(t.mass),
					n = {
						...t,
						stiffness: e ?? 100,
						damping: i ?? 10,
						mass: s ?? 1,
						isResolvedFromDuration: !1,
						isTimeDefined: (e ?? i ?? s) === void 0 && (void 0 !== t.duration || void 0 !== t.bounce)
					};
				if (n.isTimeDefined) {
					if (t.visualDuration) {
						let e = i4(t.bounce || 0),
							i = 2 * Math.PI / (1.2 * t.visualDuration) * i8(e, 2 * Math.PI / 1.2);
						n.stiffness = i * i, n.damping = 2 * e * Math.sqrt(n.stiffness)
					} else Object.assign(n, function({
						duration: t = 800,
						bounce: e = .3
					}) {
						let i, s, n = i4(e);
						t = d(.01, 10, t / 1e3), n < 1 ? (i = e => {
							let i = e * n,
								s = i * t;
							return .001 - i / i6(e, n) * Math.exp(-s)
						}, s = e => {
							let s = e * n * t,
								r = n * n * e * e * t,
								a = Math.exp(-s),
								o = i6(e * e, n);
							return -((-i(e) + .001 > 0 ? -1 : 1) * r) * a / o
						}) : (i = e => -.001 + Math.exp(-e * t) * (e * t + 1), s = e => -(t * t * e * Math.exp(-e * t)));
						let r = i9(i, s, 5 / t),
							a = r * i8(n, r * t),
							o = a * a;
						return {
							stiffness: o,
							damping: 2 * n * Math.sqrt(o),
							duration: tZ(t)
						}
					}(n)), n.isResolvedFromDuration = !0;
					i7(n.stiffness) && i7(n.damping, !0) || (n.stiffness = 100, n.damping = 10)
				}
				return n
			}({
				...r
			}),
			g = t => f ? 0 : -(t / 1e3),
			y = u / (2 * Math.sqrt(h * c)),
			v = Math.sqrt(h / c) / 1e3,
			x = y * v,
			b = {
				target: o,
				delta: o - a,
				velocity: g(r.velocity || 0) || 0,
				restSpeed: 0,
				restDelta: 0
			},
			w = () => {
				let t = 5 > Math.abs(b.delta);
				b.restSpeed = r.restSpeed || (t ? .01 : 2), b.restDelta = r.restDelta || (t ? .005 : .5)
			};
		if (w(), y < 1) {
			let t = i6(v, y),
				e = {
					A: 0,
					sinC: 0,
					cosC: 0,
					t: -1,
					env: 0,
					sin: 0,
					cos: 0
				};
			n = () => {
				e.A = (b.velocity + x * b.delta) / t, e.sinC = x * e.A + b.delta * t, e.cosC = x * b.delta - e.A * t
			};
			let r = i => {
				i !== e.t && (e.t = i, e.env = Math.exp(-x * i), e.sin = Math.sin(t * i), e.cos = Math.cos(t * i))
			};
			i = t => (r(t), b.target - e.env * (e.A * e.sin + b.delta * e.cos)), s = t => (r(t), e.env * (e.sinC * e.sin + e.cosC * e.cos))
		} else if (1 === y) {
			i = t => b.target - Math.exp(-v * t) * (b.delta + (b.velocity + v * b.delta) * t);
			let t = {
				C: 0
			};
			n = () => {
				t.C = b.velocity + v * b.delta
			}, s = e => Math.exp(-v * e) * (v * t.C * e - b.velocity)
		} else {
			let t = v * Math.sqrt(y * y - 1),
				e = x - t,
				r = x + t,
				a = t < 1 || f ? 1 / 0 : 300 / t,
				o = (t, e) => Math.exp(e > a ? (x - t) * a - x * e : -t * e),
				l = {
					S: 0,
					F: 0
				};
			n = () => {
				let e = (b.velocity + x * b.delta) / t;
				l.S = (b.delta + e) / 2, l.F = (b.delta - e) / 2
			}, i = t => b.target - l.S * o(e, t) - l.F * o(r, t), s = t => e * l.S * o(e, t) + r * l.F * o(r, t)
		}
		n();
		let S = m && p || null,
			T = {
				calculatedDuration: S,
				retarget: (t, e) => {
					b.target = t[t.length - 1], b.delta = b.target - t[0], b.velocity = g(e), r.restSpeed && r.restDelta || w(), T.calculatedDuration = S, l.done = !1, n()
				},
				velocity: t => tZ(s(t)),
				next: t => {
					let e = i(t);
					return m ? l.done = t >= p : l.done = Math.abs(tZ(s(t))) <= b.restSpeed && Math.abs(b.target - e) <= b.restDelta, l.value = l.done ? b.target : e, l
				},
				toString: () => {
					let t = Math.min(i3(T), 2e4),
						e = es(e => T.next(t * e).value, t, 30);
					return t + "ms " + e
				},
				toTransition: () => {}
			};
		return T
	}
	let si = Object.assign(se, {
		applyToOptions: t => {
			let e = i5(t, 100, se);
			return t.ease = e.ease, t.duration = tZ(e.duration), t.type = "keyframes", t
		}
	});

	function ss({
		keyframes: t,
		velocity: e = 0,
		power: i = .8,
		timeConstant: s = 325,
		bounceDamping: n = 10,
		bounceStiffness: r = 500,
		modifyTarget: a,
		min: o,
		max: l,
		restDelta: h = .5,
		restSpeed: u
	}) {
		let d, c, p = t[0],
			m = {
				done: !1,
				value: p
			},
			f = i * e,
			g = p + f,
			y = a ? a(g) : g;
		y !== g && (f = y - p);
		let v = t => -f * Math.exp(-t / s),
			x = t => {
				let e = v(t);
				m.done = Math.abs(e) <= h, m.value = m.done ? y : t ? y + e : p
			},
			b = t => {
				let e;
				if ((e = m.value) < o || e > l) {
					var i;
					d = t, c = si({
						keyframes: [m.value, (i = m.value, void 0 === o ? l : void 0 === l || Math.abs(o - i) < Math.abs(l - i) ? o : l)],
						velocity: -v(t) / s * 1e3,
						damping: n,
						stiffness: r,
						restDelta: h,
						restSpeed: u
					})
				}
			};
		return b(0), {
			calculatedDuration: null,
			next: t => {
				let e = !1;
				return (c || void 0 !== d || (e = !0, x(t), b(t)), void 0 !== d && t >= d) ? c.next(t - d) : (e || x(t), m)
			}
		}
	}
	let sn = (t, e, i) => t * (3 * (1 - t) * ((1 - t) * e + t * i) + t * t);

	function sr(t, e, i, s) {
		return t === e && i === s ? tL : n => {
			let r = 0,
				a = 1,
				o = n;
			for (let e = 0;; e++) {
				o >= r && o <= a || (o = (r + a) / 2);
				let s = sn(o, t, i) - n;
				if (s * s < 1e-28 || 40 === e) break;
				s > 0 ? a = o : r = o, o -= 1e-7 * s / (sn(o + 1e-7, t, i) - n - s)
			}
			return sn(o, e, s)
		}
	}
	let sa = sr(.42, 0, 1, 1),
		so = sr(0, 0, .58, 1),
		sl = sr(.42, 0, .58, 1),
		sh = t => Array.isArray(t) && "number" != typeof t[0],
		su = t => e => e <= .5 ? t(2 * e) / 2 : (2 - t(2 * (1 - e))) / 2,
		sd = t => e => 1 - t(1 - e),
		sc = sr(.33, 1.53, .69, .99),
		sp = sd(sc),
		sm = su(sp),
		sf = t => t >= 1 ? 1 : (t *= 2) < 1 ? .5 * sp(t) : .5 * (2 - Math.pow(2, -10 * (t - 1))),
		sg = t => 1 - Math.sin(Math.acos(t)),
		sy = sd(sg),
		sv = su(sg),
		sx = {
			linear: tL,
			easeIn: sa,
			easeInOut: sl,
			easeOut: so,
			circIn: sg,
			circInOut: sv,
			circOut: sy,
			backIn: sp,
			backInOut: sm,
			backOut: sc,
			anticipate: sf
		},
		sb = t => {
			if (ee(t)) {
				tr.default;
				let [e, i, s, n] = t;
				return sr(e, i, s, n)
			}
			return "string" == typeof t ? (tr.default, sx[t]) : t
		},
		sw = (t, e, i) => {
			let s = e - t;
			return s ? (i - t) / s : 1
		};

	function sS(t, e) {
		let i = t[t.length - 1];
		for (let s = 1; s <= e; s++) {
			let n = sw(0, e, s);
			t.push(eZ(i, 1, n))
		}
	}

	function sT(t) {
		let e = [0];
		return sS(e, t.length - 1), e
	}

	function sA({
		duration: t = 300,
		keyframes: e,
		times: i,
		ease: s = "easeInOut",
		mixer: n
	}) {
		var r;
		let a = "number" == typeof e[0] ? void 0 : n,
			o = sh(s) ? s.map(sb) : sb(s) || sl,
			l = {
				done: !1,
				value: e[0]
			},
			h = -1;
		if (!a) {
			for (let t = 1; t < e.length; t++)
				if (e[t] !== e[t - 1]) {
					if (h >= 0) {
						h = -2;
						break
					}
					h = t - 1
				}
		}
		if (h >= 0) {
			let s = i && i.length === e.length ? i : sT(e),
				n = s[h] * t,
				r = s[h + 1] * t,
				a = e[h],
				u = e[h + 1],
				d = Array.isArray(o) ? o[h] : o,
				c = (tF.mix || i1)(a, u),
				p = e.length - 2;
			return {
				calculatedDuration: t,
				next: e => (l.value = h && e < n ? c(0) : h < p && (e >= r || !t) ? "number" == typeof u ? u : c(1) : c(d(e >= r || !t ? 1 : e <= n ? 0 : (e - n) / (r - n))), l.done = e >= t, l)
			}
		}
		let u = function(t, e, {
			clamp: i = !0,
			ease: s,
			mixer: n
		} = {}) {
			let r = t.length;
			if (1 === r) return () => e[0];
			if (2 === r && e[0] === e[1]) return () => e[1];
			let a = t[0] === t[1];
			t[0] > t[r - 1] && (t = [...t].reverse(), e = [...e].reverse());
			let o = function(t, e, i) {
					let s = [],
						n = tF.mix || i1,
						r = t.length - 1;
					for (let a = 0; a < r; a++) {
						let r = i?.(t[a], t[a + 1]) || n(t[a], t[a + 1]);
						e && (r = iW(Array.isArray(e) ? e[a] || tL : e, r)), s.push(r)
					}
					return s
				}(e, s, n),
				l = o.length,
				h = i => {
					if (a && i < t[0]) return e[0];
					let s = 0;
					if (l > 1)
						for (; s < t.length - 2 && !(i < t[s + 1]); s++);
					let n = sw(t[s], t[s + 1], i);
					return o[s](n)
				};
			return i ? e => h(d(t[0], t[r - 1], e)) : h
		}((r = i && i.length === e.length ? i : sT(e), r.map(e => e * t)), e, {
			ease: Array.isArray(o) ? o : e.map(() => o || sl).splice(0, e.length - 1),
			mixer: a
		});
		return {
			calculatedDuration: t,
			next: e => (l.value = u(e), l.done = e >= t, l)
		}
	}
	let sP = {
		decay: ss,
		inertia: ss,
		tween: sA,
		keyframes: sA,
		spring: si
	};

	function sk(t) {
		"string" == typeof t.type && (t.type = sP[t.type])
	}
	let sM = (t, e) => e - t > 40 && !tF.useManualTiming ? e : t,
		sj = t => t / 100,
		sE = t => Math.round(1e4 * t) / 1e4;
	class sC extends t8 {
		constructor(t) {
			super(), this.state = "idle", this.startTime = null, this.isStopped = !1, this.currentTime = 0, this.holdTime = null, this.playbackSpeed = 1, this.delayState = {
				done: !1,
				value: void 0
			}, this.stop = () => {
				let {
					motionValue: t
				} = this.options;
				t && t.updatedAt !== t9.now() && this.tick(t9.now()), this.isStopped = !0, "idle" !== this.state && (this.teardown(), this.options.onStop?.())
			}, this.options = t, this.initAnimation(), this.play(), !1 === t.autoplay && this.pause(), et(this, this.options)
		}
		initAnimation() {
			let {
				options: t
			} = this;
			sk(t);
			let {
				type: e = sA,
				repeat: i = 0,
				repeatDelay: s = 0,
				repeatType: n,
				velocity: r = 0
			} = t, {
				keyframes: a
			} = t, o = e || sA;
			this.mixKeyframes = void 0, o !== sA && "number" != typeof a[0] && (this.mixKeyframes = iW(sj, t.mixer?.(a[0], a[1]) || i1(a[0], a[1])), a = [0, 100]);
			let l = o(a === t.keyframes ? t : {
				...t,
				keyframes: a
			});
			"mirror" === n && (this.mirroredGenerator = o({
				...t,
				keyframes: [...a].reverse(),
				velocity: -r
			})), null === l.calculatedDuration && (l.calculatedDuration = i3(l));
			let {
				calculatedDuration: h
			} = l;
			this.calculatedDuration = h, this.resolvedDuration = h + s, this.totalDuration = this.resolvedDuration * (i + 1) - s, this.generator = l
		}
		updateTime(t) {
			this.currentTime = this.holdTime ?? Math.round(t - this.startTime) * this.playbackSpeed
		}
		tick(t, e = !1) {
			let {
				generator: i,
				totalDuration: s,
				calculatedDuration: n
			} = this;
			if (null === this.startTime) return i.next(0);
			let {
				delay: r = 0,
				keyframes: a,
				type: o,
				onUpdate: l,
				finalKeyframe: h
			} = this.options;
			this.startTime === this.pendingStartTime && (this.startTime = sM(this.startTime, t)), this.pendingStartTime = void 0, this.speed > 0 ? this.startTime = Math.min(this.startTime, t) : this.speed < 0 && (this.startTime = Math.min(t - s / this.speed, this.startTime)), e ? this.currentTime = t : this.updateTime(t);
			let u = this.currentTime - r * (this.playbackSpeed >= 0 ? 1 : -1),
				d = this.playbackSpeed >= 0 ? u < 0 : u > s;
			this.currentTime = Math.max(u, 0), "finished" === this.state && null === this.holdTime && (this.currentTime = s);
			let c = this.generate(this.currentTime, d),
				{
					done: p
				} = c;
			d || (p = this.playbackSpeed >= 0 ? n < 1 / 0 ? this.currentTime >= s : p : this.currentTime <= 0);
			let m = null === this.holdTime && ("finished" === this.state || "running" === this.state && p);
			return m && o !== ss && (c.value = t4(a, this.options, h, this.speed)), l && l(c.value), m && this.finish(), c
		}
		at(t) {
			return this.holdTime ?? sE((t - this.startTime) * this.playbackSpeed)
		}
		sampleAt(t, e) {
			let {
				options: i,
				totalDuration: s
			} = this, n = this.at(t) - (i.delay || 0);
			return n >= s && i.type !== ss ? t4(i.keyframes, i, e ? void 0 : i.finalKeyframe) : this.generate(Math.max(n, 0), n < 0).value
		}
		generate(t, e) {
			let i, {
					generator: s,
					totalDuration: n,
					mixKeyframes: r,
					mirroredGenerator: a,
					resolvedDuration: o
				} = this,
				{
					keyframes: l,
					repeat: h,
					repeatType: u,
					repeatDelay: c
				} = this.options,
				p = t,
				m = s;
			if (h) {
				let e = Math.min(t, n) / o,
					i = Math.floor(e),
					s = e % 1;
				!s && e >= 1 && (s = 1), 1 === s && i--, (i = Math.min(i, h + 1)) % 2 && ("reverse" === u ? (s = 1 - s, c && (s -= c / o)) : "mirror" === u && (m = a)), p = d(0, 1, s) * o
			}
			return e ? (this.delayState.value = l[0], i = this.delayState) : i = m.next(p), r && !e && (i.value = r(i.value)), i
		}
		get duration() {
			return this.calculatedDuration / 1e3
		}
		get iterationDuration() {
			return this.duration + (this.options.delay ?? 0) / 1e3
		}
		get time() {
			return this.currentTime / 1e3
		}
		set time(t) {
			"finished" === this.state && this.updateFinished(), t = tZ(t), this.currentTime = t, null === this.startTime || null !== this.holdTime || 0 === this.playbackSpeed ? this.holdTime = t : this.driver && (this.startTime = this.driver.now() - t / this.playbackSpeed), this.driver ? this.driver.start(!1) : (this.startTime = 0, this.state = "paused", this.holdTime = t, this.tick(t))
		}
		getGeneratorVelocity() {
			return function(t, e, i = 0) {
				var s, n;
				let r;
				return e <= 0 ? i : t.velocity ? t.velocity(e) : (s = e => t.next(e).value, n = t.next(e).value, ed(n - s(r = Math.max(e - 5, 0)), e - r))
			}(this.generator, this.currentTime, this.options.velocity)
		}
		get speed() {
			return this.playbackSpeed
		}
		set speed(t) {
			let e = this.playbackSpeed !== t;
			e && this.driver && this.updateTime(t9.now()), this.playbackSpeed = t, e && this.driver && (this.time = this.currentTime / 1e3)
		}
		play() {
			if (this.isStopped) return;
			let {
				driver: t = i2,
				startTime: e
			} = this.options;
			this.driver || (this.driver = t(t => this.tick(t))), this.options.onPlay?.();
			let i = this.driver.now();
			"finished" === this.state ? (this.updateFinished(), this.startTime = i) : null !== this.holdTime ? this.startTime = i - this.holdTime / (this.playbackSpeed || 1) : this.startTime || (this.startTime = e ?? (this.pendingStartTime = i)), "finished" === this.state && this.speed < 0 && (this.startTime += this.calculatedDuration), this.holdTime = null, this.state = "running", this.driver.start()
		}
		pause() {
			this.state = "paused", this.updateTime(t9.now()), this.holdTime = this.currentTime
		}
		complete() {
			"running" !== this.state && this.play(), this.state = "finished", this.holdTime = null
		}
		finish() {
			this.notifyFinished(), this.teardown(), this.state = "finished", this.options.onComplete?.()
		}
		cancel() {
			this.holdTime = null, this.startTime = 0, this.tick(0), this.teardown(), this.options.onCancel?.()
		}
		teardown() {
			this.state = "idle", this.driver?.stop(), this.driver = void 0, this.startTime = this.holdTime = null
		}
		sample(t) {
			return this.startTime = 0, this.tick(t, !0)
		}
		attachTimeline(t) {
			return this.options.allowFlatten && (this.options.type = "keyframes", this.options.ease = "linear", this.initAnimation()), this.driver?.stop(), t.observe(this)
		}
	}
	let sV = {
		anticipate: sf,
		backInOut: sm,
		circInOut: sv
	};
	class sD extends eo {
		constructor(t) {
			"string" == typeof t.ease && t.ease in sV && (t.ease = sV[t.ease]), sk(t), super(t), void 0 !== t.startTime && !1 !== t.autoplay && (this.startTime = t.startTime), this.options = t
		}
		elapsed() {
			return "running" === this.state ? (t9.now() - this.startTime) * this.speed : 1e3 * this.time
		}
		sample(t) {
			if (!this.sampler) {
				let {
					motionValue: t,
					onUpdate: e,
					onComplete: i,
					onPlay: s,
					onStop: n,
					element: r,
					...a
				} = this.options;
				this.sampler = new sC({
					...a,
					autoplay: !1
				}), this.sampler.stop()
			}
			return this.sampler.sample(Math.max(0, t)).value
		}
		liveValue() {
			let {
				state: t
			} = this;
			if ("running" === t || "paused" === t) return this.sample(this.elapsed())
		}
		updateMotionValue(t) {
			let {
				motionValue: e,
				element: i,
				name: s
			} = this.options;
			if (!e) return;
			if (void 0 !== t) return void e.set(t);
			let {
				speed: n
			} = this, r = this.elapsed(), a = "running" === this.state && n ? d(0, 10, r) : 0, o = this.sample(r);
			i && s && t1(i, s, o), e.setWithVelocity(this.sample(r - a * Math.sign(n)), o, a / Math.abs(n || 1))
		}
	}
	let sR = (t, e) => "zIndex" !== e && !!("number" == typeof t || Array.isArray(t) || "string" == typeof t && (U.test(t) || "0" === t) && !t.startsWith("url("));

	function sL(t) {
		t.duration = 0, t.type = "keyframes"
	}
	let sF = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/,
		sN = ({
			mixer: t,
			keyframes: e
		}) => t && "number" != typeof e[0] && e.some((i, s) => s && t(e[s - 1], i)),
		sO = new Set(["color", "backgroundColor", "outlineColor", "fill", "stroke", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor"]),
		sB = () => !tF.useManualTiming && Object.hasOwnProperty.call(Element.prototype, "animate"),
		sI = new Set(["linear", "easeIn", "easeOut", "easeInOut"]),
		sU = new WeakMap,
		sW = (t, e) => Math.min(200, Math.max(2, Math.ceil((e - t) / 10))),
		sz = (t, e) => .001 >= Math.abs(t - e),
		s$ = (t, e) => t - e,
		s_ = (t, e, i) => sT(Array(i + 1)).map(i => eZ(t, e, i)),
		sK = ({
			state: t
		}) => "idle" === t || "finished" === t,
		sY = (t, e) => t.latestValues ? t.latestValues[e] : t.getValue(e)?.get();
	class sG {
		constructor(t, e, i, s) {
			this.element = t, this.update = e, this.makeDriver = i, this.animation = s
		}
		get js() {
			return this.driver || (this.driver = this.makeDriver(this.update))
		}
		now() {
			return this.driver || this.makeDriver !== i2 ? this.js.now() : tB.isProcessing ? tB.timestamp : t9.now()
		}
		start(t = !0) {
			let e, i = (e = this.element, eh.get(e));
			!i || i.isJS ? this.js.start(t) : i.schedule(!1, !t)
		}
		stopJS() {
			this.driver?.stop()
		}
		stop() {
			let t;
			this.stopJS();
			let e = (t = this.element, eh.get(t));
			e && !e.isFinishing && e.release(this.animation)
		}
	}
	class sH extends sC {
		constructor(t) {
			let e, i = t.motionValue.owner.current,
				{
					driver: s = i2
				} = t,
				n = function(t) {
					let e = t.motionValue.owner,
						{
							onUpdate: i,
							transformTemplate: s
						} = e.getProps();
					return !t.isHandoff && !i && !t.hasOnUpdate && !s && "inertia" !== t.type && "none" === (sY(e, "transform") || "none") && !sY(e, "pathRotation") && !e.projection?.isProjecting() && !sN(t)
				}(t);
			t.driver = t => new sG(i, t, s, e), super(t), e = this;
			let r = this.driver;
			r && (r.animation = this), this.canAccelerate = n;
			let {
				stop: a
			} = this;
			this.stop = () => {
				this.isAccelerated() && this.sync(), a()
			}
		}
		offsets() {
			let {
				keyframes: t,
				times: e
			} = this.options;
			return e || (this.offsetsOf !== t && (this.offsetsOf = t, this.cachedOffsets = sT(t)), this.cachedOffsets)
		}
		get group() {
			let t;
			return t = this.options.motionValue.owner.current, eh.get(t)
		}
		get js() {
			return this.driver?.js
		}
		stopJS() {
			this.driver?.stopJS()
		}
		get name() {
			return this.options.name
		}
		timing() {
			let {
				startTime: t,
				speed: e,
				totalDuration: i
			} = this, {
				delay: s = 0,
				repeatType: n
			} = this.options;
			return null !== this.holdTime ? [1 / 0, 0] : 1 / 0 === i ? [t + s / e, this.resolvedDuration * ("loop" === n ? 1 : 2) / e || 1] : [t + (s + i) / e, 0]
		}
		isAccelerated() {
			let {
				group: t,
				state: e
			} = this;
			return t?.tracks.has(this) && !t.isJS && this.canAccelerate && ("running" === e || "paused" === e)
		}
		liveValue() {
			return this.isAccelerated() ? this.sampleAt(t9.now()) : void 0
		}
		tween() {
			let {
				keyframes: t,
				type: e,
				repeat: i,
				delay: s = 0
			} = this.options, n = -1;
			if (i || e !== sA || null !== this.holdTime) return;
			for (let e = 1; e < t.length; e++)
				if (t[e] !== t[e - 1]) {
					if (n >= 0) return;
					n = e - 1
				} let {
				ease: r
			} = this.options;
			sh(r) && (r = r[n]);
			let a = this.offsets(),
				o = t => this.startTime + (s + a[t] * this.totalDuration) / this.speed;
			if (n >= 0) {
				let t, e = ee(r) ? en(r) : (t = r, sI.has(t)) ? er[r] : sb(r);
				return [o(n), o(n + 1), "string" == typeof e || sz(e(0), 0) && sz(e(1), 1) ? e : void 0]
			}
		}
		boundaries(t, e) {
			let {
				startTime: i,
				speed: s,
				resolvedDuration: n,
				options: r
			} = this, {
				delay: a = 0,
				repeat: o = 0,
				repeatDelay: l = 0,
				repeatType: h,
				type: u
			} = r, d = (u || sA) === sA ? this.offsets() : [0, 1], c = i + a / s, p = [];
			if (null !== this.holdTime || !(n > 0)) return p;
			for (let i = Math.max(0, Math.floor((t - c) * s / n)); i <= o; i++) {
				let r = c + i * n / s;
				if (r > e) break;
				for (let a of d) {
					let o = r + (i % 2 && h && "loop" !== h ? 1 - a : a) * (n - l) / s;
					o > t && o < e && p.push(o)
				}
			}
			return p
		}
		numberAt(t) {
			return parseFloat(this.sampleAt(t, !0))
		}
		sync() {
			let t = t9.now(),
				e = this.sampleAt(t, !0);
			this.options.motionValue.setWithVelocity(null === this.holdTime ? this.sampleAt(t - 10, !0) : e, e, 10)
		}
		play() {
			var t;
			let e, i, s, n, r, o, l, u, d, c, p, m, f, g, y, v, x, b, w, S, T, A, P, k, M, j, E, C, V, D;
			this.isStopped || ((this.group || (s = (t = this.options.motionValue.owner).current, n = new Set, r = new Map, o = {}, l = [], u = new Map, d = [], c = !1, p = !1, m = !1, f = !1, g = -1 / 0, y = 1 / 0, v = t => {
				for (let e of n)
					if (e.name === t) return !0
			}, x = (e, i) => {
				let s = {};
				for (let n of void 0 === e ? h : l) {
					let a = r.get(n),
						l = void 0 === e ? sY(t, n) : a ? a.sampleAt(i > e && !a.timing()[1] ? i : e) : o[n];
					void 0 !== l && (s[n] = l)
				}
				return s
			}, b = (t, e) => {
				let i = "";
				for (let s in t) {
					let n = t[s];
					e && eN(s, n) || (i += eF(s, n) + " ")
				}
				return (e ? i.trim() : i) || "none"
			}, w = (t = x()) => {
				s.style.transform = b(t, !0)
			}, S = t => {
				t.onfinish = t.oncancel = null, t.cancel()
			}, T = (t = !0) => {
				clearTimeout(e), y = 1 / 0, i = void 0, t && w(), d.forEach(({
					animation: t
				}) => S(t)), d = []
			}, A = (t, e) => new Animation(new KeyframeEffect(s, t, e)), P = (t, e, i = 1 / 0) => {
				let s = {
					animation: t,
					offset: e,
					end: i
				};
				t.startTime = t9.now() + e, i < 1 / 0 && (t.onfinish = () => {
					s.isDone = !0, d.some(t => 1 / 0 === t.end) && (S(t), d = d.filter(t => t !== s)), D.schedule(!1)
				}), t.oncancel = () => d.includes(s) && D.demote(), d.push(s)
			}, k = (t, e, i) => {
				let s = (e, i) => Math.abs(t(i) - t(e)),
					n = s(e, i);
				for (; i - e > .01;) {
					let t = (e + i) / 2;
					s(e, t) > s(t, i) ? i = t : e = t
				}
				return s(e, i) > n / 2 ? [e, i] : []
			}, M = (t, e, i, s) => {
				let n, r, a, o = sW(e, i);
				if (4 * s.length > o) return;
				for (let s of t) {
					let t = s.numberAt(e),
						r = (s.numberAt((e + i) / 2) - t) / (s.numberAt(i) - t);
					if (r == r) {
						if (void 0 === n) n = r;
						else if (!sz(r, n)) return
					}
				}
				let l = s_(e, i, o).concat(s).sort(s$);
				for (let i of t) {
					let t = i.numberAt(e),
						s = l.map(e => i.numberAt(e) - t),
						n = s[s.length - 1],
						o = s.some(t => .001 * Math.abs(t) > Math.abs(n)) ? 0 : n,
						h = s.map(t => o ? t / o : t);
					if (o && !r) r = h, a = e => (i.numberAt(e) - t) / o;
					else if (h.some((t, e) => !sz(t, o && r[e]))) return
				}
				if (!r || r.every((t, s) => sz(t, sw(e, i, l[s])))) return "linear";
				let h = [],
					u = (t, s = a(t)) => h.push(sE(s) + " " + sE(100 * sw(e, i, t)) + "%");
				return r.forEach((t, e) => {
					e && Math.abs(t - r[e - 1]) > .2 && k(a, l[e - 1], l[e]).forEach(t => u(t)), u(l[e], t)
				}), "linear(" + h + ")"
			}, j = (t, e, i, s, n = {
				fill: "both"
			}, r) => {
				let a = s ? [] : t.flatMap(t => t.boundaries(e, i)),
					o = s || M(t, e, i, a),
					l = o ? [e, i] : ((t, e, i, s) => {
						let n = [e],
							r = [],
							a = i,
							o = e;
						for (let s of t) {
							let t = s.tween();
							if (t?.[2] !== "linear") {
								let [n, l] = s.timing(), [h, u] = t || [e, l ? i : n];
								a = Math.min(a, h), o = Math.max(o, u), r.push(s)
							}
						}
						a = Math.max(e, a);
						let l = (e, i, s) => {
								if (i - e < 1 || r.every(t => !(Math.abs(t.numberAt((e + i) / 2) - (t.numberAt(e) + t.numberAt(i)) / 2) > (t.name.startsWith("scale") ? .001 : .1)))) n.push(i);
								else if (s < 4) l(e, (e + i) / 2, s + 1), l((e + i) / 2, i, s + 1);
								else {
									for (let s of t) n.push(...k(t => s.numberAt(t), e, i));
									n.push(i)
								}
							},
							h = (o = Math.min(i, o)) > a ? s_(a, o, Math.ceil((o - a) / 100)) : [];
						for (let t of (h.push(i), s)) h.push(t, Math.min(t + .01, i));
						let u = e;
						for (let t of h.sort(s$)) t > u && l(u, t, 0), u = t;
						return n.sort(s$)
					})(t, e, i, a),
					h = l.map(t => b(x(t, r))),
					u = {
						transform: h
					};
				return o || (u.offset = l.map(t => sw(e, i, t))), h.every(t => t === h[0]) && (w(x(e, r)), u = null), A(u, {
					...n,
					duration: i - e,
					easing: o || "linear"
				})
			}, E = t => {
				let i = t9.now() + t;
				i < y && (clearTimeout(e), y = i, e = setTimeout(() => {
					y = 1 / 0, D.schedule(!1)
				}, t))
			}, C = () => !n.size && (m = !0, eh.get(s) === D && eh.delete(s), D.isJS || T(), !0), V = () => {
				let e = t9.now();
				if (D.isJS || (D.isFinishing = !0, n.forEach(i => {
						let [s, n] = i.timing();
						"running" === i.state && i.speed > 0 && !n && s <= e + 1 && (i.complete(), o[i.name] = sY(t, i.name), u.has(i) || (c = !0))
					}), D.isFinishing = !1), p = !1, m || (n.forEach(t => sK(t) && n.delete(t)), C())) return;
				for (let t of n)
					if (!t.canAccelerate) return D.demote(!0);
				D.isJS && (D.isJS = !1, c = !0, n.forEach(t => t.stopJS()));
				let s = c,
					a = f;
				if (c = f = !1, s || !((t, e) => {
						let s, r = 0;
						for (let e of n) {
							let i = u.get(e);
							if (!i) return !1;
							let [n, a, o] = i, l = e.at(t), h = 1 / 0 === e.timing()[0];
							if (o) {
								if (h && (l === n || !d.length)) continue;
								return !1
							}
							let c = (l - n) / a,
								p = h ? 0 : e.speed / a;
							if (void 0 === s) s = c, r = p;
							else if (Math.abs(c - s) > 1 || p !== r) return !1
						}
						if (void 0 === s) return !0;
						if (!d.length) {
							if (void 0 === i || e && r) return !1;
							if (r) {
								let t = (i - s) / r;
								if (t < 1) return !1;
								E(t)
							}
							return !0
						}
						for (let {
								offset: t,
								end: i,
								isDone: n
							}
							of d) {
							let r = s - t;
							if (i < 1 / 0 && (n ? r < i - 1 : r < 0 && (e || t <= 0) || r >= i)) return !1
						}
						for (let {
								animation: e,
								offset: i,
								isDone: n
							}
							of d) {
							if (n) continue;
							let a = s - i;
							r && e.updatePlaybackRate && "running" === e.playState && 20 > Math.abs(Number(e.currentTime) - a) ? e.playbackRate !== r && e.updatePlaybackRate(r) : r ? (e.playbackRate !== r && (e.playbackRate = r), e.startTime = t - a / r) : (e.startTime = null, e.currentTime = a)
						}
						return !0
					})(e, a)) {
					if (a) {
						if (e - g < 100) return D.demote();
						g = e
					}
					if (!(e => {
							let s = e,
								a = 0,
								c = 0,
								p = [],
								m = [],
								f = new Set;
							for (let t of (r.clear(), u = new Map, n)) {
								r.set(t.name, t);
								let [i, n] = t.timing(), o = 1 / 0 === i;
								if (u.set(t, [t.at(e), t.speed, o]), !o) {
									if (t.speed < 0) return;
									if (n) {
										if (a) {
											let t = (i - c) / n;
											if (Math.abs(n - a) > 1 || Math.abs(t - Math.round(t)) * a > 1) return
										} else a = n, c = i;
										m.push(t)
									} else f.add(i);
									p.push(t), s = Math.max(s, i)
								}
							}
							o = {}, l = h.filter(e => {
								if (r.has(e)) return !0;
								let i = o[e] = sY(t, e);
								return void 0 !== i && !eN(e, i)
							}), T(!1);
							let g = !a && (t => {
								let e;
								for (let i of t) {
									let t = i.tween();
									if (!t || e && (Math.abs(t[0] - e[0]) > 1 || Math.abs(t[1] - e[1]) > 1)) return;
									e = [t[0], t[1], e && t[2] !== e[2] ? void 0 : t[2]]
								}
								return e
							})(p);
							try {
								if (s > e) {
									let t;
									if (g && g[1] > e) {
										var y;
										let n, [r, a, o] = g;
										if (r - e > 100) return p.forEach(t => t.sync()), E(i = r - e - 100), !0;
										(t = "string" == typeof o ? o : o ? (y = sW(r, a), n = sU.get(o), n?.[0] !== y && (n = [y, "linear(" + sT(Array(y + 1)).map(t => sE(o(t)) + " " + sE(100 * t) + "%") + ")"], sU.set(o, n)), n[1]) : M(p, r, a, [])) && P(j(p, r, a, t, {
											fill: "both",
											endDelay: s - a
										}), r - e, s - r)
									}
									t || P(j(p, e, s), 0, s - e), f.forEach(t => t < s - 1 && P(A(null, {
										duration: t - e
									}), 0, t - e))
								}
								if (a) {
									let t = c + Math.floor((s - c) / a) * a;
									P(j(m, t, t + a, void 0, {
										iterations: 1 / 0,
										iterationStart: (s - t) / a,
										fill: "forwards"
									}, s), s - e)
								}
							} catch {
								return
							}
							return d.length || T(), !0
						})(e)) return D.demote()
				} else if (void 0 !== i && !a) return;
				n.forEach(t => 1 / 0 === t.timing()[0] && t.sync())
			}, D = {
				tracks: n,
				isJS: !1,
				isFinishing: !1,
				schedule(t, e) {
					!m && (c || (c = t), f || (f = !!e), !p) && (p = !0, tB.isProcessing ? tI.render(V, !1, !0) : (a || queueMicrotask(() => {
						let t = a;
						a = void 0, t.forEach(t => t())
					}), (a || (a = [])).push(V)))
				},
				release(t) {
					sK(t) && n.delete(t), C() || D.schedule(!0)
				},
				check() {
					if (!D.isJS) {
						for (let e in o)
							if (sY(t, e) !== o[e] && !v(e)) return D.schedule(!0, !0)
					}
				},
				demote(t) {
					if (!D.isJS && !m) return n.forEach(e => {
						e.isAccelerated() && e.sync(), t || (e.canAccelerate = !1)
					}), D.isJS = !0, u = new Map, T(), n.forEach(t => "running" === t.state && t.js?.start()), !0
				}
			}, eh.set(s, D), D)).tracks.add(this), super.play())
		}
		pause() {
			super.pause(), this.isAccelerated() && this.group.schedule(!1)
		}
		complete() {
			super.complete();
			let {
				group: t
			} = this;
			t && !t.isJS && this.tick(t9.now())
		}
		get time() {
			return this.isAccelerated() ? d(0, this.totalDuration, this.at(t9.now()) - (this.options.delay || 0)) / 1e3 : super.time
		}
		set time(t) {
			(r ?? (r = Object.getOwnPropertyDescriptor(sC.prototype, "time").set)).call(this, t)
		}
		attachTimeline(t) {
			return this.canAccelerate = !1, this.group?.demote(!0), super.attachTimeline(t)
		}
	}
	class sX extends t8 {
		constructor(t) {
			super(), this.stop = () => {
				this._animation && (this._animation.stop(), this.stopTimeline?.()), this.keyframeResolver?.cancel()
			}, this.createdAt = t9.now();
			let {
				keyframes: e,
				name: i,
				motionValue: s,
				element: n
			} = t;
			t.autoplay ?? (t.autoplay = !0), t.delay ?? (t.delay = 0), t.type ?? (t.type = "keyframes"), t.repeat ?? (t.repeat = 0), t.repeatDelay ?? (t.repeatDelay = 0), t.repeatType ?? (t.repeatType = "loop");
			let r = n?.KeyframeResolver || tH;
			this.keyframeResolver = new r(e, (e, i, s) => this.onKeyframesResolved(e, i, t, !s), i, s, n), this.keyframeResolver?.scheduleResolve()
		}
		onKeyframesResolved(t, e, i, s) {
			let n;
			this.keyframeResolver = void 0;
			let {
				name: r,
				type: a,
				velocity: o,
				delay: l,
				isHandoff: u,
				onUpdate: d
			} = i;
			this.resolvedAt = t9.now();
			let c = function(t, e, i, s) {
				let n = t[0];
				if (null === n) return !1;
				if ("display" === e || "visibility" === e) return !0;
				let r = t[t.length - 1],
					a = sR(n, e),
					o = sR(r, e);
				return !!a && !!o && (function(t) {
					let e = t[0];
					if (1 === t.length) return !0;
					for (let i = 0; i < t.length; i++)
						if (t[i] !== e) return !0
				}(t) || ("spring" === i || ea(i)) && s)
			}(t, r, a, o);
			c || ((tF.instantAnimations || !l) && d?.(t4(t, i, e)), t[0] = t[t.length - 1], sL(i), i.repeat = 0);
			let {
				onComplete: p
			} = i;
			i.finalKeyframe = e, i.keyframes = t, i.onComplete = () => {
				p?.(), this.notifyFinished()
			};
			let m = c && !u && function(t) {
					let {
						motionValue: e,
						name: i,
						repeatDelay: s,
						repeatType: n,
						damping: r,
						type: a,
						keyframes: o
					} = t;
					if (!i || !(el.has(i) || sO.has(i))) return !1;
					let l = e?.owner?.current;
					if (!(l instanceof HTMLElement) && !(l instanceof SVGElement)) return !1;
					let {
						onUpdate: h,
						transformTemplate: u
					} = e.owner.getProps();
					return sB() && (el.has(i) || sO.has(i) && function(t) {
						for (let e = 0; e < t.length; e++)
							if ("string" == typeof t[e] && sF.test(t[e])) return !0;
						return !1
					}(o)) && ("transform" !== i || !u) && !h && !s && "mirror" !== n && 0 !== r && "inertia" !== a && !sN(t)
				}(i),
				f = !m && (({
					name: t,
					motionValue: e
				}) => t && h.includes(t) && e?.owner?.current instanceof HTMLElement && sB() && ei())(i);
			if (s && (m || f || this.resolvedAt !== this.createdAt) && (i.startTime ?? (i.startTime = sM(this.createdAt, this.resolvedAt))), m) {
				i.element = i.motionValue?.owner?.current;
				try {
					n = new sD(i)
				} catch {
					n = new sC(i)
				}
			} else n = f ? new sH(i) : new sC(i);
			this.pendingTimeline && (this.stopTimeline = n.attachTimeline(this.pendingTimeline), this.pendingTimeline = void 0), this._animation = n
		}
		get finished() {
			return this._animation ? this._animation.finished : super.finished
		}
		then(t, e) {
			return this.finished.finally(t).then(() => {})
		}
		liveValue() {
			return this._animation?.liveValue?.()
		}
		get animation() {
			return this._animation || (this.keyframeResolver?.resume(), tK = !0, tG(), tY(), tK = !1), this._animation
		}
		get duration() {
			return this.animation.duration
		}
		get iterationDuration() {
			return this.animation.iterationDuration
		}
		get time() {
			return this.animation.time
		}
		set time(t) {
			this.animation.time = t
		}
		get speed() {
			return this.animation.speed
		}
		get state() {
			return this.animation.state
		}
		set speed(t) {
			this.animation.speed = t
		}
		get startTime() {
			return this.animation.startTime
		}
		attachTimeline(t) {
			return this._animation ? this.stopTimeline = this.animation.attachTimeline(t) : this.pendingTimeline = t, () => this.stop()
		}
		play() {
			this.animation.play()
		}
		pause() {
			this.animation.pause()
		}
		complete() {
			this.animation.complete()
		}
		cancel() {
			this._animation?.cancel(), this.keyframeResolver?.cancel()
		}
	}
	let sq = {
			type: "spring",
			stiffness: 500,
			damping: 25,
			restSpeed: 10
		},
		sZ = {
			type: "keyframes",
			duration: .8
		},
		sJ = {
			type: "keyframes",
			ease: [.25, .1, .35, 1],
			duration: .3
		},
		sQ = new Set(["when", "delay", "delayChildren", "staggerChildren", "staggerDirection", "repeat", "repeatType", "repeatDelay", "from", "elapsed", "out", "mixer"]),
		s0 = (t, e, i, s = {}, n, r) => a => {
			let o = iI(s, t) || {},
				l = o.delay || s.delay || 0,
				{
					elapsed: h = 0
				} = s;
			h -= tZ(l);
			let d = {
				keyframes: Array.isArray(i) ? i : [null, i],
				ease: "easeOut",
				velocity: e.getVelocity(),
				...o,
				delay: -h,
				onUpdate: t => {
					e.set(t), o.onUpdate && o.onUpdate(t)
				},
				onComplete: () => {
					a(), o.onComplete && o.onComplete()
				},
				name: t,
				motionValue: e,
				element: r ? void 0 : n,
				hasOnUpdate: !!o.onUpdate
			};
			! function(t) {
				for (let e in t)
					if (!sQ.has(e)) return !0;
				return !1
			}(o) && Object.assign(d, ((t, {
				keyframes: e
			}) => e.length > 2 ? sZ : u.has(t) ? t.startsWith("scale") ? {
				type: "spring",
				stiffness: 550,
				damping: 0 === e[1] ? 2 * Math.sqrt(550) : 30,
				restSpeed: 10
			} : sq : sJ)(t, d)), d.duration && (d.duration = tZ(d.duration)), d.repeatDelay && (d.repeatDelay = tZ(d.repeatDelay)), void 0 !== d.from && (d.keyframes[0] = d.from);
			let c = !1;
			if (!1 !== d.type && (0 !== d.duration || d.repeatDelay) || (sL(d), 0 === d.delay && (c = !0)), (tF.instantAnimations || tF.skipAnimations || n?.shouldSkipAnimations || o.skipAnimations) && (c = !0, sL(d), d.delay = 0), d.allowFlatten = !o.type && !o.ease, c && !r && void 0 !== e.get()) {
				let t = t4(d.keyframes, o);
				if (void 0 !== t) return void tI.update(() => {
					d.onUpdate(t), d.onComplete()
				})
			}
			return o.isSync ? new sC(d) : new sX(d)
		},
		s1 = "u" > typeof window;

	function s2(t, e, {
		delay: i = 0,
		transitionOverride: s,
		type: n
	} = {}) {
		let {
			transition: r,
			transitionEnd: a,
			...o
		} = e, l = t.getDefaultTransition();
		r = r ? iB(r, l) : l;
		let h = r?.reduceMotion,
			u = r?.skipAnimations;
		s && (r = s);
		let d = [],
			c = n && t.animationState?.getState()[n],
			p = r?.path;
		for (let e in p && (p.animateValues ? p.animateValues(e => t.getValue(e, t.latestValues[e] ?? 0), o, r, i, d) : p.animateVisualElement?.(t, o, r, i, d)), o) {
			let s = t.getValue(e, t.latestValues[e] ?? null),
				n = o[e];
			if (void 0 === n || c && function({
					protectedKeys: t,
					needsAnimating: e
				}, i) {
					let s = i in t && !e[i];
					return e[i] = !1, s
				}(c, e)) continue;
			let a = {
				delay: i,
				...iI(c?.out[e] || r || {}, e)
			};
			u && (a.skipAnimations = !0);
			let l = s.get();
			if (void 0 !== l && !s.isAnimating() && !Array.isArray(n) && n === l && !a.velocity) {
				tI.update(() => s.set(n));
				continue
			}
			let p = !1;
			if (s1 && window.MotionHandoffAnimation) {
				let i = t.props[iV];
				if (i) {
					let t = window.MotionHandoffAnimation(i, e, tI);
					null !== t && (a.startTime = t, p = !0)
				}
			}
			iU(t, e);
			let m = h ?? t.shouldReduceMotion;
			s.run(s0(e, s, n, m && ti.has(e) ? {
				type: !1
			} : a, t, p));
			let f = s.animation;
			f && d.push(f)
		}
		if (a) {
			let e = () => tI.update(() => {
				a && function(t, e) {
					let {
						transitionEnd: i = {},
						transition: s = {},
						...n
					} = iN(t, e) || {};
					for (let e in n = {
							...n,
							...i
						}) {
						var r;
						let i = Array.isArray(r = n[e]) ? r[r.length - 1] || 0 : r;
						t.hasValue(e) ? t.getValue(e).set(i) : t.addValue(e, em(i))
					}
				}(t, a)
			});
			d.length ? Promise.all(d).then(e) : e()
		}
		return d
	}

	function s3(t, e, i, s = 0, n = 1) {
		let r = Array.from(t).sort((t, e) => t.sortNodePosition(e)).indexOf(e),
			a = t.size,
			o = (a - 1) * s;
		return "function" == typeof i ? i(r, a) : 1 === n ? r * s : o - r * s
	}

	function s5(t, e, i = {}) {
		let s = iN(t, e, iO(t, i.type)),
			n = i.transitionOverride || (s?.transition ?? (t.getDefaultTransition() || {})),
			r = () => Promise.all(s ? s2(t, s, i) : []),
			a = (s = 0) => {
				let {
					variantChildren: r
				} = t, {
					delayChildren: a = 0,
					staggerChildren: o,
					staggerDirection: l
				} = n, h = [];
				return r?.forEach(t => {
					t.notify("AnimationStart", e), h.push(s5(t, e, {
						...i,
						delay: s + ("function" == typeof a ? 0 : a) + s3(r, t, a, o, l)
					}).then(() => t.notify("AnimationComplete", e)))
				}), Promise.all(h)
			},
			{
				when: o
			} = n;
		return o ? "beforeChildren" === o ? r().then(() => a()) : a().then(r) : Promise.all([r(), a(i.delay)])
	}

	function s4(t, e) {
		if (!Array.isArray(e)) return !1;
		let i = e.length;
		if (i !== t.length) return !1;
		for (let s = 0; s < i; s++)
			if (e[s] !== t[s]) return !1;
		return !0
	}
	let s8 = [...ev].reverse(),
		s6 = t => t?.out === !0 ? t : t?.out;

	function s9() {
		let t = {};
		for (let e of ev) t[e] = {
			isActive: "animate" === e,
			protectedKeys: {},
			needsAnimating: {},
			prevResolvedValues: {},
			out: {}
		};
		return t
	}
	let s7 = 0;

	function nt(t, e, i, s = {
		passive: !0
	}) {
		return t.addEventListener(e, i, s), () => t.removeEventListener(e, i, s)
	}
	let ne = t => "mouse" === t.pointerType ? "number" != typeof t.button || t.button <= 0 : !1 !== t.isPrimary;

	function ni(t) {
		return {
			point: {
				x: t.pageX,
				y: t.pageY
			}
		}
	}

	function ns(t, e, i, s) {
		return nt(t, e, t => ne(t) && i(t, ni(t)), s)
	}

	function nn(t) {
		return t.max - t.min
	}

	function nr(t, e, i, s = .5) {
		t.origin = s, t.originPoint = eZ(e.min, e.max, t.origin), t.scale = nn(i) / nn(e), t.translate = eZ(i.min, i.max, t.origin) - t.originPoint, (t.scale >= .9999 && t.scale <= 1.0001 || isNaN(t.scale)) && (t.scale = 1), (t.translate >= -.01 && t.translate <= .01 || isNaN(t.translate)) && (t.translate = 0)
	}

	function na(t, e, i, s) {
		nr(t.x, e.x, i.x, s?.originX), nr(t.y, e.y, i.y, s?.originY)
	}

	function no(t, e, i, s = 0) {
		t.min = (s ? eZ(i.min, i.max, s) : i.min) + e.min, t.max = t.min + nn(e)
	}

	function nl(t, e, i, s = 0) {
		let n = s ? eZ(i.min, i.max, s) : i.min;
		t.min = e.min - n, t.max = t.min + nn(e)
	}

	function nh(t, e, i, s) {
		nl(t.x, e.x, i.x, s?.x), nl(t.y, e.y, i.y, s?.y)
	}

	function nu(t) {
		return [t("x"), t("y")]
	}
	let nd = {};

	function nc(t) {
		return nd.current?.add(t), t
	}
	let np = t => nd.current ? nd.current.bind(t) : t,
		nm = t => "object" == typeof t && null !== t;

	function nf(t) {
		return nm(t) && "ownerSVGElement" in t
	}

	function ng(t, e, i) {
		if (null == t) return [];
		if (t instanceof EventTarget) return [t];
		if ("string" == typeof t) {
			let s = e ? e.current : nd.current?.root || document,
				n = i?.[t] ?? s.querySelectorAll(t);
			return n ? Array.from(n) : []
		}
		return Array.from(t).filter(t => null != t)
	}
	let ny = new WeakMap,
		nv = (t, e, i) => (s, n) => n && n[0] ? n[0][t + "Size"] : nf(s) && "getBBox" in s ? s.getBBox()[e] : s[i],
		nx = nv("inline", "width", "offsetWidth"),
		nb = nv("block", "height", "offsetHeight");

	function nw({
		target: t,
		borderBoxSize: e
	}) {
		ny.get(t)?.forEach(i => {
			i(t, {
				get width() {
					return nx(t, e)
				},
				get height() {
					return nb(t, e)
				}
			})
		})
	}

	function nS(t) {
		t.forEach(nw)
	}
	let nT = new Set;

	function nA(t, e) {
		let i;
		return nc("function" == typeof t ? (nT.add(t), l || (l = () => {
			let t = {
				get width() {
					return window.innerWidth
				},
				get height() {
					return window.innerHeight
				}
			};
			nT.forEach(e => e(t))
		}, window.addEventListener("resize", l)), () => {
			nT.delete(t), nT.size || "function" != typeof l || (window.removeEventListener("resize", l), l = void 0)
		}) : (!o && "u" > typeof ResizeObserver && (o = new ResizeObserver(nS)), (i = ng(t)).forEach(t => {
			let i = ny.get(t);
			i || (i = new Set, ny.set(t, i)), i.add(e), o?.observe(t)
		}), () => {
			i.forEach(t => {
				let i = ny.get(t);
				i?.delete(e), i?.size || o?.unobserve(t)
			})
		}))
	}
	let nP = (t, e) => Math.abs(t - e),
		nk = new Set(["auto", "scroll"]);
	class nM {
		constructor(t, e, {
			transformPagePoint: i,
			contextWindow: s = window,
			dragSnapToOrigin: n = !1,
			distanceThreshold: r = 3,
			element: a,
			immediate: o
		} = {}) {
			if (this.startEvent = null, this.lastMoveEvent = null, this.lastMoveEventInfo = null, this.lastRawMoveEventInfo = null, this.handlers = {}, this.contextWindow = window, this.scrollPositions = new Map, this.onElementScroll = t => {
					this.handleScroll(t.target)
				}, this.onWindowScroll = () => {
					this.handleScroll(window)
				}, this.updatePoint = () => {
					var t, e;
					if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
					this.hasPendingMove = !1, this.lastRawMoveEventInfo && (this.lastMoveEventInfo = nE(this.lastRawMoveEventInfo, this.transformPagePoint));
					let i = nV(this.lastMoveEventInfo, this.history),
						s = null !== this.startEvent,
						n = (t = i.offset, e = {
							x: 0,
							y: 0
						}, Math.sqrt(nP(t.x, e.x) ** 2 + nP(t.y, e.y) ** 2) >= this.distanceThreshold);
					if (!s && !n) return;
					let {
						point: r
					} = i;
					this.history.push({
						...r,
						timestamp: t9.now()
					});
					let {
						onStart: a,
						onMove: o
					} = this.handlers;
					s || (a?.(this.lastMoveEvent, i), this.startEvent = this.lastMoveEvent), o?.(this.lastMoveEvent, i)
				}, this.handlePointerMove = (t, e) => {
					this.handleScroll(window), this.lastMoveEvent = t, this.lastRawMoveEventInfo = e, this.lastMoveEventInfo = nE(e, this.transformPagePoint), this.hasPendingMove = !0, tI.update(this.updatePoint, !0)
				}, this.handlePointerUp = (t, e) => {
					this.hasPendingMove && this.updatePoint(), this.end();
					let {
						onEnd: i,
						onSessionEnd: s,
						resumeAnimation: n
					} = this.handlers;
					if ((this.dragSnapToOrigin || !this.startEvent) && n?.(), !(this.lastMoveEvent && this.lastMoveEventInfo)) return;
					let r = nV("pointercancel" === t.type ? this.lastMoveEventInfo : nE(e, this.transformPagePoint), this.history);
					this.startEvent && i?.(t, r), s?.(t, r)
				}, !ne(t)) return;
			this.dragSnapToOrigin = n, this.handlers = e, this.transformPagePoint = i, this.distanceThreshold = o ? 0 : r, this.contextWindow = s || window;
			let l = ni(t),
				h = nE(l, this.transformPagePoint),
				{
					point: u
				} = h;
			this.history = [{
				...u,
				timestamp: t9.now()
			}];
			let {
				onSessionStart: d
			} = e;
			d && d(t, nV(h, this.history));
			let c = {
				passive: !0,
				capture: !0
			};
			this.removeListeners = iW(ns(this.contextWindow, "pointermove", this.handlePointerMove, c), ns(this.contextWindow, "pointerup", this.handlePointerUp, c), ns(this.contextWindow, "pointercancel", this.handlePointerUp, c)), a && this.startScrollTracking(a), o && (this.handlePointerMove(t, l), this.updatePoint())
		}
		startScrollTracking(t) {
			let e = t.parentElement;
			for (; e;) {
				let t = getComputedStyle(e);
				(nk.has(t.overflowX) || nk.has(t.overflowY)) && this.scrollPositions.set(e, nj(e)), e = e.parentElement
			}
			this.scrollPositions.set(window, nj(window)), this.removeScrollListeners = iW(nt(window, "scroll", this.onElementScroll, {
				capture: !0
			}), nt(window, "scroll", this.onWindowScroll, {}))
		}
		handleScroll(t) {
			let e = this.scrollPositions.get(t);
			if (!e) return;
			let i = t === window,
				s = nj(t),
				n = {
					x: s.x - e.x,
					y: s.y - e.y
				};
			(0 !== n.x || 0 !== n.y) && (i ? this.lastMoveEventInfo && (this.lastMoveEventInfo.point.x += n.x, this.lastMoveEventInfo.point.y += n.y) : this.history.length > 0 && (this.history[0].x -= n.x, this.history[0].y -= n.y), this.scrollPositions.set(t, s), tI.update(this.updatePoint, !0))
		}
		updateHandlers(t) {
			this.handlers = t
		}
		end() {
			this.removeListeners?.(), this.removeScrollListeners?.(), this.scrollPositions.clear(), tU(this.updatePoint)
		}
	}
	let nj = t => t === window ? {
		x: window.scrollX,
		y: window.scrollY
	} : {
		x: t.scrollLeft,
		y: t.scrollTop
	};

	function nE(t, e) {
		return e ? {
			point: e(t.point)
		} : t
	}

	function nC(t, e) {
		return {
			x: t.x - e.x,
			y: t.y - e.y
		}
	}

	function nV({
		point: t
	}, e) {
		return {
			point: t,
			delta: nC(t, nD(e)),
			offset: nC(t, e[0]),
			velocity: function(t) {
				if (t.length < 2) return {
					x: 0,
					y: 0
				};
				let e = t.length - 1,
					i = null,
					s = nD(t);
				for (; e >= 0 && (i = t[e], !(s.timestamp - i.timestamp > tZ(.1)));) e--;
				if (!i) return {
					x: 0,
					y: 0
				};
				i === t[0] && t.length > 2 && s.timestamp - i.timestamp > 2 * tZ(.1) && (i = t[1]);
				let n = (s.timestamp - i.timestamp) / 1e3;
				if (0 === n) return {
					x: 0,
					y: 0
				};
				let r = {
					x: (s.x - i.x) / n,
					y: (s.y - i.y) / n
				};
				return 1 / 0 === r.x && (r.x = 0), 1 / 0 === r.y && (r.y = 0), r
			}(e)
		}
	}

	function nD(t) {
		return t[t.length - 1]
	}
	let nR = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]),
		nL = new Set(["INPUT", "SELECT", "TEXTAREA"]),
		nF = {
			x: !1,
			y: !1
		};

	function nN() {
		return nF.x || nF.y
	}

	function nO(t, e, i) {
		return {
			min: void 0 !== e ? t.min + e : void 0,
			max: void 0 !== i ? t.max + i - (t.max - t.min) : void 0
		}
	}

	function nB(t, e) {
		let i = e.min - t.min,
			s = e.max - t.max;
		return e.max - e.min < t.max - t.min && ([i, s] = [s, i]), {
			min: i,
			max: s
		}
	}

	function nI(t, e, i) {
		return {
			min: nU(t, e),
			max: nU(t, i)
		}
	}

	function nU(t, e) {
		return "number" == typeof t ? t : t[e] || 0
	}

	function nW(t) {
		let e = "";
		for (let i of t.path) {
			i.scroll = void 0, i.updateScroll();
			let {
				scroll: s
			} = i;
			i !== t.root && s && (e += s.offset.x + "," + s.offset.y + ",")
		}
		return e
	}
	let nz = new WeakMap;
	class n$ {
		constructor(t, e = () => t.getProps()) {
			this.openDragLock = null, this.isDragging = !1, this.currentDirection = null, this.originPoint = {
				x: 0,
				y: 0
			}, this.constraints = !1, this.hasMutatedConstraints = !1, this.elastic = tt(), this.latestPointerEvent = null, this.latestPanInfo = null, this.visualElement = t, this.readProps = e
		}
		start(t, e = {}) {
			if (this.visualElement.presenceContext?.isPresent === !1) return;
			let i = t => {
					e.snapToCursor && this.snapToCursor(t), this.stopAnimation()
				},
				s = (t, e) => {
					let {
						drag: i,
						dragConstraints: s,
						dragPropagation: n,
						onDragStart: r
					} = this.getProps();
					if (i && !n && (this.openDragLock?.(), this.openDragLock = function(t) {
							if ("x" === t || "y" === t)
								if (nF[t]) return null;
								else return nF[t] = !0, () => {
									nF[t] = !1
								};
							return nF.x || nF.y ? null : (nF.x = nF.y = !0, () => {
								nF.x = nF.y = !1
							})
						}(i), !this.openDragLock)) return;
					this.latestPointerEvent = t, this.latestPanInfo = e, this.isDragging = !0, this.currentDirection = null, this.resolveConstraints();
					let {
						projection: a
					} = this.visualElement;
					a && (a.isAnimationBlocked = !0, a.target = void 0), nu(t => {
						let e = this.getAxisMotionValue(t).get() || 0;
						if (th(e) && (e = tp(e, this.visualElement.current) || 0), M.test(e)) e = parseFloat(e);
						else if (k.test(e)) {
							let i = a?.layout?.layoutBox[t];
							i && (e = nn(i) * (parseFloat(e) / 100))
						}
						this.originPoint[t] = e
					}), this.point = "function" == typeof s && s(this), r && tI.update(() => r(t, e), !1, !0), iU(this.visualElement, "transform"), this.visualElement.animationState?.setActive("whileDrag", !0)
				},
				n = (t, e) => {
					this.latestPointerEvent = t, this.latestPanInfo = e;
					let {
						dragPropagation: i,
						dragDirectionLock: s,
						onDirectionLock: n,
						onDrag: r
					} = this.getProps();
					if (!i && !this.openDragLock) return;
					let {
						offset: a
					} = e;
					if (s && null === this.currentDirection) {
						if (this.currentDirection = function(t, e = 10) {
								let i = null;
								return Math.abs(t.y) > e ? i = "y" : Math.abs(t.x) > e && (i = "x"), i
							}(a), null === this.currentDirection) return;
						n && n(this.currentDirection)
					}
					this.updateAxis("x", a), this.updateAxis("y", a), this.point && this.point.move(), this.visualElement.render(), r && tI.update(() => r(t, e), !1, !0)
				},
				r = (t, e) => {
					this.latestPointerEvent = t, this.latestPanInfo = e, this.stop(t, e), this.latestPointerEvent = null, this.latestPanInfo = null
				},
				a = () => {
					let {
						dragSnapToOrigin: t
					} = this.getProps();
					(t || this.constraints || this.point) && this.startAnimation({
						x: 0,
						y: 0
					})
				},
				{
					dragSnapToOrigin: o
				} = this.getProps();
			this.panSession = new nM(t, {
				onSessionStart: i,
				onStart: s,
				onMove: n,
				onSessionEnd: r,
				resumeAnimation: a
			}, {
				...e,
				transformPagePoint: this.visualElement.getTransformPagePoint(),
				dragSnapToOrigin: o,
				contextWindow: this.visualElement.current?.ownerDocument.defaultView,
				element: this.visualElement.current
			})
		}
		stop(t, e, i) {
			let s = t || this.latestPointerEvent,
				n = e || this.latestPanInfo,
				r = this.isDragging;
			if (this.cancel(), !r || !n || !s) return;
			let {
				velocity: a
			} = n;
			this.startAnimation(a, i);
			let {
				onDragEnd: o
			} = this.getProps();
			o && tI.postRender(() => o(s, n))
		}
		cancel() {
			this.isDragging = !1;
			let {
				projection: t,
				animationState: e
			} = this.visualElement;
			t && (t.isAnimationBlocked = !1), this.endPanSession(), !this.getProps().dragPropagation && this.openDragLock && (this.openDragLock(), this.openDragLock = null), e?.setActive("whileDrag", !1)
		}
		endPanSession() {
			this.panSession?.end(), this.panSession = void 0
		}
		updateAxis(t, e) {
			let {
				drag: i
			} = this.readProps();
			if (!e || !nG(t, i, this.currentDirection)) return;
			let s = this.getAxisMotionValue(t),
				n = this.originPoint[t] + e[t],
				r = this.constraints && this.constraints[t];
			r && (n = function(t, {
				min: e,
				max: i
			}, s) {
				return void 0 !== e && t < e ? t = s ? eZ(e, t, s.min) : Math.max(t, e) : void 0 !== i && t > i && (t = s ? eZ(i, t, s.max) : Math.min(t, i)), t
			}(n, r, this.elastic[t])), this.point ? this.point[t] = n : s.set(n)
		}
		resolveConstraints() {
			let {
				dragConstraints: t,
				dragElastic: e
			} = this.getProps(), {
				projection: i
			} = this.visualElement, s = i && (i.layout || i.measure(!1)), n = this.constraints;
			n_(t) ? this.constraints && this.scroll === nW(i) || (this.constraints = this.resolveRefConstraints()) : t && s && "object" == typeof t ? this.constraints = function(t, {
				top: e,
				left: i,
				bottom: s,
				right: n
			}) {
				return {
					x: nO(t.x, i, n),
					y: nO(t.y, e, s)
				}
			}(s.layoutBox, t) : this.constraints = !1, this.elastic = function(t = .35) {
				return !1 === t ? t = 0 : !0 === t && (t = .35), {
					x: nI(t, "left", "right"),
					y: nI(t, "top", "bottom")
				}
			}(e), n !== this.constraints && !n_(t) && s && this.constraints && !this.hasMutatedConstraints && nu(t => {
				var e, i;
				let n;
				!1 !== this.constraints && this.getAxisMotionValue(t) && (this.constraints[t] = (e = s.layoutBox[t], i = this.constraints[t], n = {}, void 0 !== i.min && (n.min = i.min - e.min), void 0 !== i.max && (n.max = i.max - e.min), n))
			})
		}
		resolveRefConstraints() {
			var t, e;
			let {
				dragConstraints: i,
				onMeasureDragConstraints: s
			} = this.getProps();
			if (!n_(i)) return !1;
			let n = nK(i),
				{
					projection: r
				} = this.visualElement;
			if (!r || !r.layout) return !1;
			this.scroll = nW(r);
			let a = function(t, e, i) {
					let s = ie(t, i),
						{
							scroll: n
						} = e;
					return n && (e6(s.x, n.offset.x), e6(s.y, n.offset.y)), s
				}(n, r.root, this.visualElement.getTransformPagePoint()),
				o = (t = r.layout.layoutBox, e = r.removeElementScroll(a), {
					x: nB(t.x, e.x),
					y: nB(t.y, e.y)
				});
			if (s) {
				let t = s(function({
					x: t,
					y: e
				}) {
					return {
						top: e.min,
						right: t.max,
						bottom: e.max,
						left: t.min
					}
				}(o));
				this.hasMutatedConstraints = !!t, t && (o = eq(t))
			}
			return o
		}
		startAnimation(t, e) {
			let {
				drag: i,
				dragMomentum: s,
				dragElastic: n,
				dragTransition: r,
				dragSnapToOrigin: a,
				onDragTransitionEnd: o
			} = this.getProps(), l = {
				bounceStiffness: n ? 200 : 1e6,
				bounceDamping: n ? 40 : 1e7,
				timeConstant: 750,
				restDelta: 1,
				restSpeed: 10,
				...r
			}, h = n => s && !(this.point && a) && nG(n, e || i, this.currentDirection) ? t[n] : 0;
			if (this.point && !a) return this.point.release({
				x: h("x"),
				y: h("y")
			}, l).then(o);
			let u = this.constraints || {};
			return Promise.all(nu(t => {
				if (!nG(t, e || i, this.currentDirection)) return;
				let s = u[t] || {};
				(!0 === a || a === t) && (s = {
					min: 0,
					max: 0
				});
				let n = {
					type: "inertia",
					velocity: h(t),
					...l,
					...s
				};
				return this.startAxisValueAnimation(t, n)
			})).then(o)
		}
		startAxisValueAnimation(t, e) {
			let i = this.getAxisMotionValue(t);
			return iU(this.visualElement, t), i.start(s0(t, i, 0, e, this.visualElement, !1))
		}
		stopAnimation() {
			nu(t => this.getAxisMotionValue(t).stop())
		}
		getAxisMotionValue(t) {
			let e = `_drag${t.toUpperCase()}`;
			return this.readProps()[e] || this.visualElement.getValue(t, this.visualElement.latestValues[t] ?? 0)
		}
		snapToCursor({
			clientX: t,
			clientY: e
		}) {
			let {
				drag: i
			} = this.getProps(), s = {
				x: t,
				y: e
			}, n = this.visualElement.getTransformPagePoint()?.(s) || s, r = this.visualElement.measureViewportBox();
			nu(t => {
				if (!nG(t, i, this.currentDirection)) return;
				let e = this.getAxisMotionValue(t),
					{
						min: s,
						max: a
					} = r[t];
				e.set((e.get() || 0) + n[t] - eZ(s, a, .5))
			})
		}
		scalePositionWithinConstraints() {
			if (!this.visualElement.current) return;
			let {
				drag: t,
				dragConstraints: e
			} = this.getProps(), {
				projection: i
			} = this.visualElement;
			if (!n_(e) || !i || !this.constraints) return;
			this.stopAnimation();
			let s = this.constraints,
				n = {
					x: 0,
					y: 0
				};
			nu(t => {
				var e, i;
				let r, a, o, l = this.getAxisMotionValue(t).get();
				n[t] = (e = {
					min: l,
					max: l
				}, i = s[t], r = .5, a = nn(e), (o = nn(i)) > a ? r = sw(i.min, i.max - a, e.min) : a > o && (r = sw(e.min, e.max - o, i.min)), d(0, 1, r))
			});
			let {
				transformTemplate: r
			} = this.visualElement.getProps();
			this.visualElement.current.style.transform = r ? r({}, "") : "none", i.root?.updateScroll(), i.updateLayout(), this.constraints = !1, this.resolveConstraints(), nu(e => {
				let i = this.getAxisMotionValue(e);
				if (!nG(e, t, null) || !i.get()) return;
				let {
					min: s,
					max: r
				} = this.constraints[e];
				i.set(eZ(s, r, n[e]))
			}), this.visualElement.render()
		}
		addListeners() {
			let t;
			if (!this.visualElement.current) return;
			nz.set(this.visualElement, this);
			let e = this.visualElement.current,
				i = ns(e, "pointerdown", t => {
					let {
						drag: i,
						dragListener: s = !0
					} = this.getProps(), n = t.target, r = n !== e && (nL.has(n.tagName) || !0 === n.isContentEditable);
					i && s && !r && this.start(t)
				}),
				s = () => {
					var i, s, n;
					let r, a, {
							dragConstraints: o
						} = this.getProps(),
						l = n_(o) && nK(o);
					l && (this.constraints = this.resolveRefConstraints(), t || (i = e, s = l, r = nA(i, nY(n = () => this.scalePositionWithinConstraints())), a = nA(s, nY(n)), t = () => {
						r(), a()
					}))
				},
				{
					projection: n
				} = this.visualElement,
				r = n.addEventListener("measure", s);
			n.layout || (n.root?.updateScroll(), n.updateLayout()), tI.read(s);
			let a = nt(window, "resize", () => this.scalePositionWithinConstraints()),
				o = n.addEventListener("didUpdate", ({
					delta: t,
					hasLayoutChanged: e
				}) => {
					this.isDragging && e && (nu(e => {
						if (!nG(e, this.getProps().drag, this.currentDirection)) return;
						let i = this.getAxisMotionValue(e);
						this.originPoint[e] += t[e].translate, i.set(i.get() + t[e].translate)
					}), this.visualElement.render())
				});
			return () => {
				a(), i(), r(), o(), t?.()
			}
		}
		getProps() {
			let t = this.readProps(),
				{
					dragElastic: e = .35,
					dragMomentum: i = !0
				} = t;
			return {
				...t,
				dragElastic: e,
				dragMomentum: i
			}
		}
	}

	function n_(t) {
		return !!t && "object" == typeof t && ("current" in t || "nodeType" in t)
	}
	let nK = t => "current" in t ? t.current : t;

	function nY(t) {
		let e = !0;
		return () => {
			if (e) {
				e = !1;
				return
			}
			t()
		}
	}

	function nG(t, e, i) {
		return (!0 === e || e === t) && (null === i || i === t)
	}
	let nH = t => (e, i) => {
			t && tI.update(() => t(e, i), !1, !0)
		},
		nX = {
			hasAnimatedSinceResize: !0,
			hasEverUpdated: !1
		};
	var nq = is;
	let nZ = !1,
		nJ = ({
			layout: t,
			layoutDependency: e,
			layoutAnchor: i
		}) => ({
			layout: t,
			layoutDependency: e,
			layoutAnchor: i,
			animationType: "string" == typeof t ? t : "both"
		}),
		nQ = (t, e) => {
			let {
				snapshot: i
			} = t, s = t.getStack();
			s?.remove(t);
			let n = s?.lead;
			if (s?.prevLead === t && n.resumeFrom === t && (n.resumeFrom = n.currentAnimation = t.resumingFrom = void 0), t.options.layoutId = e, !e) {
				t.needsShow = !0;
				return
			}
			return t.root.registerSharedNode(e, t), () => {
				let {
					resumeFrom: e
				} = t;
				e?.isPresent !== !1 && t.getStack().members.includes(e) && (e.hide(), t.resumeFrom = void 0, t.snapshot = i)
			}
		};
	class n0 extends nq.Component {
		componentDidMount() {
			let {
				visualElement: t,
				layoutGroup: e,
				switchLayoutGroup: i,
				layoutId: s
			} = this.props, {
				projection: n
			} = t;
			n && (e.group?.add(n), s && i?.register?.(n), nZ && n.root.didUpdate(), n.options.layoutId !== s && nQ(n, s)?.(), n.addEventListener("animationComplete", () => this.safeToRemove()), n.setOptions({
				...n.options,
				...nJ(this.props),
				onExitComplete: () => this.safeToRemove()
			})), nX.hasEverUpdated = !0
		}
		getSnapshotBeforeUpdate(t) {
			let {
				layoutDependency: e,
				layoutId: i,
				visualElement: s,
				drag: n,
				isPresent: r
			} = this.props, {
				projection: a
			} = s;
			return a && (a.isPresent = r, this.takeOver = t.layoutId !== i ? (a.willUpdate(), nQ(a, i)) : void 0, a.setOptions({
				...a.options,
				...nJ(this.props)
			}), nZ = !0, n || t.layoutDependency !== e || void 0 === e || t.isPresent !== r ? a.willUpdate() : this.safeToRemove(), t.isPresent !== r && (r ? a.promote() : a.relegate() || tI.postRender(() => {
				a.getStack()?.members.length || this.safeToRemove()
			}))), null
		}
		componentDidUpdate() {
			let {
				projection: t
			} = this.props.visualElement;
			t && (this.takeOver?.(), t.root.didUpdate(), eu.postRender(() => {
				!t.currentAnimation && t.isLead() && this.safeToRemove()
			}))
		}
		componentWillUnmount() {
			let {
				visualElement: t,
				layoutGroup: e,
				switchLayoutGroup: i
			} = this.props, {
				projection: s
			} = t;
			nZ = !0, s && (s.scheduleCheckAfterUnmount(), e.group?.remove(s), i?.deregister?.(s))
		}
		safeToRemove() {
			this.props.safeToRemove?.()
		}
		render() {
			return null
		}
	}

	function n1(t) {
		let [e, i] = function(t = !0) {
			let e = (0, is.useContext)(iS);
			if (null === e) return [!0, null];
			let {
				isPresent: i,
				onExitComplete: s,
				register: n
			} = e, r = (0, is.useId)();
			(0, is.useEffect)(() => {
				if (t) return n(r)
			}, [t]);
			let a = (0, is.useCallback)(() => t && s && s(r), [r, s, t]);
			return !i && s ? [!1, a] : [!0]
		}(), s = (0, nq.useContext)(ih);
		return (0, io.jsx)(n0, {
			...t,
			layoutGroup: s,
			switchLayoutGroup: (0, nq.useContext)(iD),
			isPresent: e,
			safeToRemove: i
		})
	}

	function n2(t, e, i) {
		let s = te(t) ? t : em(t);
		return s.run(s0("", s, e, i)), s.animation
	}
	let n3, n5 = ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomRightRadius", "borderBottomLeftRadius"],
		n4 = t => "number" == typeof t ? t : parseFloat(t),
		n8 = n5.length,
		n6 = t => "number" == typeof t || M.test(t);

	function n9(t, e) {
		return void 0 !== t[e] ? t[e] : t.borderRadius
	}
	let n7 = re(0, .5, sy),
		rt = re(.5, .95, tL);

	function re(t, e, i) {
		return s => s < t ? 0 : s > e ? 1 : i(sw(t, e, s))
	}

	function ri(t, e) {
		t.min = e.min, t.max = e.max
	}

	function rs(t, e) {
		ri(t.x, e.x), ri(t.y, e.y)
	}

	function rn(t, e) {
		t.translate = e.translate, t.scale = e.scale, t.originPoint = e.originPoint, t.origin = e.origin
	}

	function rr(t, e, i, s, n) {
		return t -= e, t = s + 1 / i * (t - s), void 0 !== n && (t = s + 1 / n * (t - s)), t
	}

	function ra(t, e, [i, s, n], r, a) {
		! function(t, e = 0, i = 1, s = .5, n, r = t, a = t) {
			if (k.test(e) && (e = parseFloat(e), e = eZ(a.min, a.max, e / 100) - a.min), "number" != typeof e) return;
			let o = eZ(r.min, r.max, s);
			t === r && (o -= e), t.min = rr(t.min, e, i, o, n), t.max = rr(t.max, e, i, o, n)
		}(t, e[i], e[s], e[n], e.scale, r, a)
	}
	let ro = ["x", "scaleX", "originX"],
		rl = ["y", "scaleY", "originY"];

	function rh(t, e, i, s) {
		ra(t.x, e, ro, i?.x, s?.x), ra(t.y, e, rl, i?.y, s?.y)
	}
	let ru = t => "u" > typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().includes(t),
		rd = ru("applewebkit/") && !ru("chrome/") ? Math.round : tL;

	function rc(t) {
		t.min = rd(t.min), t.max = rd(t.max)
	}

	function rp(t) {
		return 0 === t.translate && 1 === t.scale
	}

	function rm(t) {
		return rp(t.x) && rp(t.y)
	}

	function rf(t, e) {
		return t.min === e.min && t.max === e.max
	}

	function rg(t, e) {
		return Math.round(t.min) === Math.round(e.min) && Math.round(t.max) === Math.round(e.max)
	}

	function ry(t, e) {
		return rg(t.x, e.x) && rg(t.y, e.y)
	}

	function rv(t) {
		return nn(t.x) / nn(t.y)
	}

	function rx(t, e) {
		return t.translate === e.translate && t.scale === e.scale && t.originPoint === e.originPoint
	}
	class rb {
		constructor() {
			this.members = []
		}
		add(t) {
			tJ(this.members, t);
			for (let e = this.members.length - 1; e >= 0; e--) {
				let i = this.members[e];
				if (i === t || i === this.lead || i === this.prevLead) continue;
				let s = i.instance;
				s && !1 !== s.isConnected || i.snapshot || (tQ(this.members, i), i.unmount())
			}
			t.scheduleRender()
		}
		remove(t) {
			if (tQ(this.members, t), t === this.prevLead && (this.prevLead = void 0), t === this.lead) {
				let t = this.members[this.members.length - 1];
				t && this.promote(t)
			}
		}
		relegate(t) {
			for (let e = this.members.indexOf(t) - 1; e >= 0; e--) {
				let t = this.members[e];
				if (!1 !== t.isPresent && t.instance?.isConnected !== !1) return this.promote(t), !0
			}
			return !1
		}
		promote(t, e) {
			let i = this.lead;
			if (t !== i && (this.prevLead = i, this.lead = t, t.show(), i)) {
				i.updateSnapshot(), t.scheduleRender();
				let {
					layoutDependency: s
				} = i.options, {
					layoutDependency: n
				} = t.options;
				(void 0 === s || s !== n) && (t.resumeFrom = i, e && (i.preserveOpacity = !0), i.snapshot && (t.snapshot = i.snapshot, t.snapshot.latestValues = i.animationValues || i.latestValues), t.root?.isUpdating && (t.isLayoutDirty = !0)), !1 === t.options.crossfade && i.hide()
			}
		}
		exitAnimationComplete() {
			this.members.forEach(t => {
				t.options.onExitComplete?.(), t.resumingFrom?.options.onExitComplete?.()
			})
		}
		scheduleRender() {
			this.members.forEach(t => t.instance && t.scheduleRender(!1))
		}
		removeLeadSnapshot() {
			this.lead?.snapshot && (this.lead.snapshot = void 0)
		}
	}

	function rw(t, e) {
		return e.max === e.min ? 0 : t / (e.max - e.min) * 100
	}
	let rS = {
			correct: (t, e) => {
				if (!e.target) return t;
				if ("string" == typeof t)
					if (!M.test(t)) return t;
					else t = parseFloat(t);
				let i = rw(t, e.target.x),
					s = rw(t, e.target.y);
				return `${i}% ${s}%`
			}
		},
		rT = {
			borderRadius: Object.assign({}, rS, {
				applyTo: n5.slice()
			}),
			borderTopLeftRadius: rS,
			borderTopRightRadius: rS,
			borderBottomLeftRadius: rS,
			borderBottomRightRadius: rS,
			boxShadow: {
				correct: (t, {
					treeScale: e,
					projectionDelta: i
				}) => {
					let s = U.parse(t);
					if (s.length > 5) return t;
					let n = U.createTransformer(t),
						r = +("number" != typeof s[0]),
						a = i.x.scale * e.x,
						o = i.y.scale * e.y;
					s[0 + r] /= a, s[1 + r] /= o;
					let l = eZ(a, o, .5);
					return "number" == typeof s[2 + r] && (s[2 + r] /= l), "number" == typeof s[3 + r] && (s[3 + r] /= l), n(s)
				}
			}
		},
		rA = (t, e) => t.depth - e.depth;
	class rP {
		constructor() {
			this.children = [], this.isDirty = !1
		}
		add(t) {
			tJ(this.children, t), this.isDirty = !0
		}
		remove(t) {
			tQ(this.children, t), this.isDirty = !0
		}
		forEach(t) {
			this.isDirty && this.children.sort(rA), this.isDirty = !1, this.children.forEach(t)
		}
	}
	let rk = ["z", "skew", "skewZ"],
		rM = 0;

	function rj(t, e, i, s) {
		let {
			latestValues: n
		} = e;
		n[t] && (i[t] = n[t], e.setStaticValue(t, 0), s && (s[t] = 0))
	}
	let rE = t => t.instance && eh.get(t.instance)?.demote() && t.resetSkewAndRotation();

	function rC({
		attachResizeListener: t,
		defaultParent: e,
		measureScroll: i,
		checkIsScrollRoot: s,
		resetTransform: n
	}) {
		return Object.assign(eK, {
			...rT,
			...eK
		}), class {
			static create(t, e, i) {
				var s;
				let {
					layoutId: n,
					layout: r,
					drag: a,
					dragConstraints: o,
					layoutScroll: l,
					layoutRoot: h,
					layoutAnchor: u,
					layoutCrossfade: d
				} = e, c = t.projection = new this(t.latestValues, e["data-framer-portal-id"] ? void 0 : function t(e) {
					if (e) return !1 !== e.options.allowProjection ? e.projection : t(e.parent)
				}(t.parent));
				c.setOptions({
					layoutId: n,
					layout: r,
					alwaysMeasureLayout: !!a || o && (s = o) && "object" == typeof s && Object.prototype.hasOwnProperty.call(s, "current"),
					visualElement: t,
					animationType: "string" == typeof r ? r : "both",
					initialPromotionConfig: i,
					crossfade: d,
					layoutScroll: l,
					layoutRoot: h,
					layoutAnchor: u
				});
				let p = c.getStack()?.lead;
				p && !c.root.isUpdateBlocked() && (p.willUpdate(), p.scheduleCheckAfterUnmount())
			}
			constructor(t = {}, i = e?.()) {
				this.id = rM++, this.animationId = 0, this.animationCommitId = 0, this.children = new Set, this.options = {}, this.isTreeAnimating = !1, this.isAnimationBlocked = !1, this.isLayoutDirty = !1, this.isProjectionDirty = !1, this.isSharedProjectionDirty = !1, this.isTransformDirty = !1, this.updateManuallyBlocked = !1, this.updateBlockedByResize = !1, this.isUpdating = !1, this.isSVG = !1, this.needsReset = !1, this.shouldResetTransform = !1, this.hasCheckedOptimisedAppear = !1, this.treeScale = {
					x: 1,
					y: 1
				}, this.eventHandlers = new Map, this.hasTreeAnimated = !1, this.updateScheduled = !1, this.scheduleUpdate = () => this.update(), this.projectionUpdateScheduled = !1, this.checkUpdateFailed = () => {
					this.isUpdating && (this.isUpdating = !1, this.clearAllSnapshots())
				}, this.updateProjection = () => {
					this.projectionUpdateScheduled = !1, this.nodes.forEach(rR), this.nodes.forEach(r$), this.nodes.forEach(r_), this.nodes.forEach(rL), n3?.()
				}, this.resolvedRelativeTargetAt = 0, this.hasProjected = !1, this.isVisible = !0, this.animationProgress = 0, this.sharedNodes = new Map, this.latestValues = t, this.root = i ? i.root || i : this, this.path = i ? [...i.path, i] : [], this.parent = i, this.depth = i ? i.depth + 1 : 0;
				for (let t = 0; t < this.path.length; t++) this.path[t].shouldResetTransform = !0;
				this.root === this && (this.nodes = new rP)
			}
			addEventListener(t, e) {
				return this.eventHandlers.has(t) || this.eventHandlers.set(t, new t0), this.eventHandlers.get(t).add(e)
			}
			notifyListeners(t, ...e) {
				this.eventHandlers.get(t)?.notify(...e)
			}
			hasListeners(t) {
				return this.eventHandlers.has(t)
			}
			mount(e) {
				if (this.instance) return;
				this.isSVG = nf(e) && !(nf(e) && "svg" === e.tagName), this.instance = e;
				let {
					layoutId: i,
					layout: s,
					visualElement: n
				} = this.options;
				if (n && !n.current && n.mount(e), this.root.nodes.add(this), this.parent?.children.add(this), this.root.hasTreeAnimated && (s || i) && (this.isLayoutDirty = !0), t) {
					let i, s = 0,
						n = () => this.root.updateBlockedByResize = !1;
					tI.read(() => {
						s = window.innerWidth
					}), t(e, () => {
						let t = window.innerWidth;
						if (t !== s) {
							var e;
							let r, a;
							s = t, this.root.updateBlockedByResize = !0, i?.(), e = n, r = t9.now(), e = np(e), a = ({
								timestamp: t
							}) => {
								let i = t - r;
								i >= 250 && (tU(a), e(i - 250))
							}, tI.setup(a, !0), i = nc(() => tU(a)), nX.hasAnimatedSinceResize && (nX.hasAnimatedSinceResize = !1, this.nodes.forEach(rz))
						}
					})
				}
				i && this.root.registerSharedNode(i, this), this.addLayoutListener()
			}
			addLayoutListener() {
				let {
					layoutId: t,
					layout: e,
					visualElement: i,
					animate: s
				} = this.options;
				this.instance && !this.hasLayoutListener && !1 !== s && i && (t || e) && (this.hasLayoutListener = !0, this.addEventListener("didUpdate", ({
					delta: t,
					hasLayoutChanged: e,
					hasRelativeLayoutChanged: s,
					layout: n
				}) => {
					if (this.isAnimationBlocked) {
						this.target = void 0, this.relativeTarget = void 0;
						return
					}
					let r = this.options.transition || i.getDefaultTransition() || rX,
						{
							onLayoutAnimationStart: a,
							onLayoutAnimationComplete: o
						} = i.getProps(),
						l = !this.targetLayout || !ry(this.targetLayout, n),
						h = !e && s;
					if (this.options.layoutRoot || this.resumeFrom || h || e && (l || !this.currentAnimation)) {
						this.resumeFrom && (this.resumingFrom = this.resumeFrom, this.resumingFrom.resumingFrom = void 0);
						let e = {
							...iI(r, "layout"),
							onPlay: a,
							onComplete: o
						};
						(i.shouldReduceMotion || this.options.layoutRoot) && (e.delay = 0, e.type = !1), this.startAnimation(e), this.setAnimationOrigin(t, h, e.path)
					} else e || rz(this), this.isLead() && this.options.onExitComplete?.();
					this.targetLayout = n
				}))
			}
			unmount() {
				this.options.layoutId && this.willUpdate(), this.root.nodes.remove(this), this.getStack()?.remove(this), this.parent?.children.delete(this), this.instance = void 0, this.eventHandlers.clear(), this.hasLayoutListener = !1, tU(this.updateProjection)
			}
			blockUpdate() {
				this.updateManuallyBlocked = !0
			}
			unblockUpdate() {
				this.updateManuallyBlocked = !1
			}
			isUpdateBlocked() {
				return this.updateManuallyBlocked || this.updateBlockedByResize
			}
			startUpdate() {
				!this.isUpdateBlocked() && (this.isUpdating = !0, this.nodes?.forEach(rK), this.animationId++)
			}
			getTransformTemplate() {
				let {
					visualElement: t
				} = this.options;
				return t && t.getProps().transformTemplate
			}
			willUpdate(t = !0) {
				if (this.root.hasTreeAnimated = !0, this.root.isUpdateBlocked()) return void this.options.onExitComplete?.();
				if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear && function t(e) {
						if (e.hasCheckedOptimisedAppear = !0, e.root === e) return;
						let {
							visualElement: i
						} = e.options;
						if (!i) return;
						let s = i.props[iV];
						if (window.MotionHasOptimisedAnimation(s, "transform")) {
							let {
								layout: t,
								layoutId: i
							} = e.options;
							window.MotionCancelOptimisedAnimation(s, "transform", tI, !(t || i))
						}
						let {
							parent: n
						} = e;
						n && !n.hasCheckedOptimisedAppear && t(n)
					}(this), this.root.isUpdating || this.root.startUpdate(), this.isLayoutDirty) return;
				rE(this), this.isLayoutDirty = !0;
				for (let t = 0; t < this.path.length; t++) {
					let e = this.path[t];
					e.shouldResetTransform = !0, rE(e), ("string" == typeof e.latestValues.x || "string" == typeof e.latestValues.y) && (e.isLayoutDirty = !0), e.updateScroll("snapshot"), e.options.layoutRoot && e.willUpdate(!1), e.isAnimationBlocked && (e.dragSnapshot || (e.dragSnapshot = e.measure()), this.dragAncestor = e)
				}
				let {
					layoutId: e,
					layout: i
				} = this.options;
				if (void 0 === e && !i) return;
				let s = this.getTransformTemplate();
				this.prevTransformTemplateValue = s ? s(this.latestValues, "") : void 0, this.updateSnapshot(), t && this.notifyListeners("willUpdate")
			}
			update() {
				if (this.updateScheduled = !1, this.isUpdateBlocked()) {
					let t = this.updateBlockedByResize;
					this.unblockUpdate(), this.updateBlockedByResize = !1, this.clearAllSnapshots(), t && this.nodes.forEach(rO), this.nodes.forEach(rN);
					return
				}
				if (this.animationId <= this.animationCommitId) return void this.nodes.forEach(rB);
				this.animationCommitId = this.animationId, this.isUpdating ? (this.isUpdating = !1, this.nodes.forEach(rI), this.nodes.forEach(rU), this.nodes.forEach(rW), this.nodes.forEach(rV), this.nodes.forEach(rD)) : this.nodes.forEach(rB), this.clearAllSnapshots();
				let t = t9.now();
				tB.delta = d(0, 1e3 / 60, t - tB.timestamp), tB.timestamp = t, tB.isProcessing = !0, tW.update.process(tB), tW.preRender.process(tB), tW.render.process(tB), tB.isProcessing = !1
			}
			didUpdate() {
				this.updateScheduled || (this.updateScheduled = !0, eu.read(this.scheduleUpdate))
			}
			clearAllSnapshots() {
				this.nodes.forEach(rF), this.sharedNodes.forEach((t, e) => t.members.length ? t.removeLeadSnapshot() : this.sharedNodes.delete(e))
			}
			scheduleUpdateProjection() {
				this.projectionUpdateScheduled || (this.projectionUpdateScheduled = !0, tI.preRender(this.updateProjection, !1, !0))
			}
			scheduleCheckAfterUnmount() {
				tI.postRender(() => {
					this.isLayoutDirty ? this.root.didUpdate() : this.root.checkUpdateFailed()
				})
			}
			updateSnapshot() {
				!this.snapshot && this.instance && (this.snapshot = this.measure(), !this.snapshot || nn(this.snapshot.measuredBox.x) || nn(this.snapshot.measuredBox.y) || (this.snapshot = void 0))
			}
			updateLayout() {
				if (!this.instance || (this.updateScroll(), !(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty)) return;
				if (this.resumeFrom && !this.resumeFrom.instance)
					for (let t = 0; t < this.path.length; t++) this.path[t].updateScroll();
				let t = this.layout;
				this.layout = this.measure(!1), this.layoutCorrected || (this.layoutCorrected = tt()), this.isLayoutDirty = !1, this.projectionDelta = void 0, this.notifyListeners("measure", this.layout.layoutBox);
				let {
					visualElement: e
				} = this.options;
				e?.notify("LayoutMeasure", this.layout.layoutBox, t?.layoutBox)
			}
			updateScroll(t = "measure") {
				let {
					scroll: e,
					instance: n
				} = this, {
					animationId: r
				} = this.root;
				if (this.options.layoutScroll && n && !(e && e.animationId === r && e.phase === t)) {
					let a = s(n);
					this.scroll = {
						animationId: r,
						phase: t,
						isRoot: a,
						offset: i(n),
						wasRoot: e ? e.isRoot : a
					}
				}
			}
			resetTransform() {
				if (!n) return;
				let t = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
				t && rE(this);
				let e = this.projectionDelta && !rm(this.projectionDelta),
					i = this.getTransformTemplate(),
					s = i ? i(this.latestValues, "") : void 0,
					r = s !== this.prevTransformTemplateValue;
				t && this.instance && (e || e1(this.latestValues) || r) && (n(this.instance, s), this.shouldResetTransform = !1, this.scheduleRender())
			}
			measure(t = !0) {
				var e;
				let i = this.measurePageBox(),
					s = this.removeElementScroll(i);
				return t && (s = this.removeTransform(s)), rc((e = s).x), rc(e.y), {
					animationId: this.root.animationId,
					measuredBox: i,
					layoutBox: s,
					latestValues: {},
					source: this.id
				}
			}
			measurePageBox() {
				let {
					visualElement: t
				} = this.options;
				if (!t) return tt();
				let e = t.measureViewportBox();
				if (!(this.scroll?.wasRoot || this.path.some(rJ))) {
					let {
						scroll: t
					} = this.root;
					t && (e6(e.x, t.offset.x), e6(e.y, t.offset.y))
				}
				return e
			}
			removeElementScroll(t) {
				let e = tt();
				if (rs(e, t), this.scroll?.wasRoot) return e;
				for (let i = 0; i < this.path.length; i++) {
					let s = this.path[i],
						{
							scroll: n,
							options: r
						} = s;
					s !== this.root && n && r.layoutScroll && (n.wasRoot && rs(e, t), e6(e.x, n.offset.x), e6(e.y, n.offset.y))
				}
				return e
			}
			applyTransform(t, e = !1, i, s, n = 0) {
				let r = i || tt();
				rs(r, t);
				for (let t = n; t < this.path.length; t++) {
					let i = this.path[t];
					!e && i.options.layoutScroll && i.scroll && i !== i.root && (e6(r.x, -i.scroll.offset.x), e6(r.y, -i.scroll.offset.y)), e1(i.latestValues) && it(r, i.latestValues, i.layout?.layoutBox)
				}
				return !s && e1(this.latestValues) && it(r, this.latestValues, this.layout?.layoutBox), r
			}
			removeTransform(t) {
				let e = tt();
				rs(e, t);
				for (let t = 0; t < this.path.length; t++) {
					let i, s = this.path[t];
					e1(s.latestValues) && (s.instance && (eQ(s.latestValues) && s.updateSnapshot(), rs(i = tt(), s.measurePageBox())), rh(e, s.latestValues, s.snapshot?.layoutBox, i))
				}
				return e1(this.latestValues) && rh(e, this.latestValues), e
			}
			setTargetDelta(t) {
				this.targetDelta = t, this.root.scheduleUpdateProjection(), this.isProjectionDirty = !0
			}
			setOptions(t) {
				this.options = {
					...this.options,
					...t,
					crossfade: void 0 === t.crossfade || t.crossfade
				}, this.addLayoutListener()
			}
			clearMeasurements() {
				this.scroll = void 0, this.layout = void 0, this.snapshot = void 0, this.prevTransformTemplateValue = void 0, this.targetDelta = void 0, this.target = void 0, this.isLayoutDirty = !1
			}
			forceRelativeParentToResolveTarget() {
				this.relativeParent && this.relativeParent.resolvedRelativeTargetAt !== tB.timestamp && this.relativeParent.resolveTargetDelta(!0)
			}
			resolveTargetDelta(t = !1) {
				let e = this.getLead();
				this.isProjectionDirty || (this.isProjectionDirty = e.isProjectionDirty), this.isTransformDirty || (this.isTransformDirty = e.isTransformDirty), this.isSharedProjectionDirty || (this.isSharedProjectionDirty = e.isSharedProjectionDirty);
				let i = !!this.resumingFrom || this !== e;
				if (!(t || i && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize)) return;
				let {
					layout: s,
					layoutId: n
				} = this.options;
				if (!this.layout || !(s || n)) return;
				this.resolvedRelativeTargetAt = tB.timestamp;
				let r = this.getClosestProjectingParent();
				if (this.targetDelta || this.relativeTarget || (!1 !== this.options.layoutAnchor && r && r.layout ? this.createRelativeTarget(r, this.layout.layoutBox, r.layout.layoutBox) : this.removeRelativeTarget()), this.relativeTarget || this.targetDelta) {
					if (this.target || (this.target = tt(), this.targetWithTransforms = tt()), this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
						var a, o, l, h;
						this.forceRelativeParentToResolveTarget(), a = this.target, o = this.relativeTarget, l = this.relativeParent.target, h = this.options.layoutAnchor || void 0, no(a.x, o.x, l.x, h?.x), no(a.y, o.y, l.y, h?.y)
					} else this.targetDelta ? (this.resumingFrom ? this.applyTransform(this.layout.layoutBox, !1, this.target, !0) : rs(this.target, this.layout.layoutBox), e8(this.target, this.targetDelta)) : rs(this.target, this.layout.layoutBox);
					this.attemptToResolveRelativeTarget && (this.attemptToResolveRelativeTarget = !1, !1 !== this.options.layoutAnchor && r && (!r.resumingFrom == !this.resumingFrom || r.options.layoutRoot && !r.resumingFrom) && !r.options.layoutScroll && r.target && 1 !== this.animationProgress ? this.createRelativeTarget(r, this.target, r.target) : this.relativeParent = this.relativeTarget = void 0), n3?.(1)
				}
			}
			getClosestProjectingParent() {
				if (!(!this.parent || eQ(this.parent.latestValues) || e3(this.parent.latestValues)))
					if (this.parent.isProjecting()) return this.parent;
					else return this.parent.getClosestProjectingParent()
			}
			isProjecting() {
				return !!((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout)
			}
			createRelativeTarget(t, e, i) {
				this.relativeParent = t, this.forceRelativeParentToResolveTarget(), this.relativeTarget = tt(), this.relativeTargetOrigin = tt(), nh(this.relativeTargetOrigin, e, i, this.options.layoutAnchor || void 0), rs(this.relativeTarget, this.relativeTargetOrigin)
			}
			removeRelativeTarget() {
				this.relativeParent = this.relativeTarget = void 0
			}
			calcProjection() {
				let t = this.getLead(),
					e = !!this.resumingFrom || this !== t,
					i = !0;
				if ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (i = !1), e && (this.isSharedProjectionDirty || this.isTransformDirty) && (i = !1), this.resolvedRelativeTargetAt === tB.timestamp && (i = !1), i) return;
				let {
					layout: s,
					layoutId: n
				} = this.options;
				if (this.isTreeAnimating = !!(this.parent?.isTreeAnimating || this.currentAnimation || this.pendingAnimation), this.isTreeAnimating || (this.targetDelta = this.relativeTarget = void 0), !this.layout || !(s || n)) return;
				rs(this.layoutCorrected, this.layout.layoutBox);
				let r = this.treeScale.x,
					a = this.treeScale.y;
				! function(t, e, i, s = !1) {
					let n, r, a = i.length;
					if (a) {
						e.x = e.y = 1;
						for (let o = 0; o < a; o++) r = (n = i[o]).projectionDelta, n.options.visualElement?.props.style?.display !== "contents" && (!0 === s && n.options.layoutScroll && n.scroll && n !== n.root && (e6(t.x, -n.scroll.offset.x), e6(t.y, -n.scroll.offset.y)), r && (e.x *= r.x.scale, e.y *= r.y.scale, e8(t, r)), s && (s.path?.[o] || s) !== n && e1(n.latestValues) && it(t, n.latestValues, n.layout?.layoutBox));
						e.x < 1.0000000000001 && e.x > .999999999999 && (e.x = 1), e.y < 1.0000000000001 && e.y > .999999999999 && (e.y = 1)
					}
				}(this.layoutCorrected, this.treeScale, this.path, e && (!t.relativeTarget || !!t.relativeParent.resumingFrom || t.relativeParent)), t.layout && !t.target && (1 !== this.treeScale.x || 1 !== this.treeScale.y) && (t.target = t.layout.layoutBox, t.targetWithTransforms = tt());
				let {
					target: o
				} = t;
				if (!o) {
					this.prevProjectionDelta && (this.createProjectionDeltas(), this.scheduleRender());
					return
				}
				this.projectionDelta && this.prevProjectionDelta ? (rn(this.prevProjectionDelta.x, this.projectionDelta.x), rn(this.prevProjectionDelta.y, this.projectionDelta.y)) : this.createProjectionDeltas(), na(this.projectionDelta, this.layoutCorrected, o, this.latestValues), this.treeScale.x === r && this.treeScale.y === a && rx(this.projectionDelta.x, this.prevProjectionDelta.x) && rx(this.projectionDelta.y, this.prevProjectionDelta.y) || (this.hasProjected = !0, this.scheduleRender(), this.notifyListeners("projectionUpdate", o)), n3?.(2)
			}
			hide() {
				this.isVisible = !1
			}
			show() {
				this.isVisible = !0
			}
			scheduleRender(t = !0) {
				this.options.visualElement?.scheduleRender(), t && this.getStack()?.scheduleRender(), this.resumingFrom && !this.resumingFrom.instance && (this.resumingFrom = void 0)
			}
			createProjectionDeltas() {
				this.prevProjectionDelta = J(), this.projectionDelta = J(), this.projectionDeltaWithTransform = J()
			}
			setAnimationOrigin(t, e = !1, i) {
				let s, n = this.snapshot,
					r = n ? n.latestValues : {},
					a = {
						...this.latestValues
					},
					o = J();
				this.relativeParent && this.relativeParent.options.layoutRoot || (this.relativeTarget = this.relativeTargetOrigin = void 0), this.attemptToResolveRelativeTarget = !e;
				let l = tt(),
					h = n?.source !== this.layout?.source,
					u = this.getStack(),
					d = !u || u.members.length <= 1,
					c = !!(h && !d && !0 === this.options.crossfade && !this.path.some(rH));
				this.animationProgress = 0;
				let p = i?.interpolateProjection(t);
				this.mixTargetDelta = e => {
					let i = e / 1e3,
						n = p?.(i);
					if (rY(o.x, t.x, i), rY(o.y, t.y, i), n && (o.x.translate = n.x, o.y.translate = n.y), this.setTargetDelta(o), this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
						var u, m, f, g, y, v;
						nh(l, this.layout.layoutBox, this.relativeParent.layout.layoutBox, this.options.layoutAnchor || void 0), f = this.relativeTarget, g = this.relativeTargetOrigin, y = l, v = i, rG(f.x, g.x, y.x, v), rG(f.y, g.y, y.y, v), s && (u = this.relativeTarget, m = s, rf(u.x, m.x) && rf(u.y, m.y)) && (this.isProjectionDirty = !1), s || (s = tt()), rs(s, this.relativeTarget)
					}
					h && (this.animationValues = a, function(t, e, i, s, n, r) {
						n ? (t.opacity = eZ(0, i.opacity ?? 1, n7(s)), t.opacityExit = eZ(e.opacity ?? 1, 0, rt(s))) : r && (t.opacity = eZ(e.opacity ?? 1, i.opacity ?? 1, s));
						for (let n = 0; n < n8; n++) {
							let r = n5[n],
								a = n9(e, r),
								o = n9(i, r);
							(void 0 !== a || void 0 !== o) && (a || (a = 0), o || (o = 0), 0 === a || 0 === o || n6(a) === n6(o) ? (t[r] = Math.max(eZ(n4(a), n4(o), s), 0), (k.test(o) || k.test(a)) && (t[r] += "%")) : t[r] = o)
						}
						for (let n = 0; n < e0.length; n++) {
							let r = e0[n];
							(e[r] || i[r]) && (t[r] = eZ(e[r] || 0, i[r] || 0, s))
						}
					}(a, r, this.latestValues, i, c, d)), n?.rotate !== void 0 && (this.animationValues || (this.animationValues = a), this.animationValues.pathRotation = n.rotate), this.root.scheduleUpdateProjection(), this.scheduleRender(), this.animationProgress = i
				}, this.mixTargetDelta(1e3 * !!this.options.layoutRoot)
			}
			startAnimation(t) {
				this.notifyListeners("animationStart"), this.currentAnimation?.stop(), this.resumingFrom?.currentAnimation?.stop(), this.pendingAnimation && (tU(this.pendingAnimation), this.pendingAnimation = void 0), this.pendingAnimation = tI.update(() => {
					nX.hasAnimatedSinceResize = !0, this.motionValue || (this.motionValue = em(0)), this.motionValue.jump(0, !1), this.currentAnimation = n2(this.motionValue, [0, 1e3], {
							...t,
							velocity: 0,
							isSync: !0,
							onUpdate: e => {
								this.mixTargetDelta(e), t.onUpdate && t.onUpdate(e)
							},
							onComplete: () => {
								t.onComplete && t.onComplete(), this.completeAnimation()
							}
						}),
						function(t, e) {
							let i = globalThis.__MOTION_INSPECT__;
							if (i) try {
								i({
									...t7("layout-animation-start", t),
									node: e
								})
							} catch {}
						}(this.currentAnimation, this), this.resumingFrom && (this.resumingFrom.currentAnimation = this.currentAnimation), this.pendingAnimation = void 0
				})
			}
			completeAnimation() {
				this.resumingFrom && (this.resumingFrom.currentAnimation = void 0, this.resumingFrom.preserveOpacity = void 0);
				let t = this.getStack();
				t && t.exitAnimationComplete(), this.resumingFrom = this.currentAnimation = this.animationValues = void 0, this.notifyListeners("animationComplete")
			}
			finishAnimation() {
				this.currentAnimation && (this.mixTargetDelta?.(1e3), this.currentAnimation.stop()), this.completeAnimation()
			}
			applyTransformsToTarget() {
				let t = this.getLead(),
					{
						targetWithTransforms: e,
						layout: i,
						latestValues: s
					} = t,
					{
						target: n
					} = t;
				if (e && n && i) {
					if (this !== t && this.layout && i && rZ(this.options.animationType, this.layout.layoutBox, i.layoutBox)) {
						let {
							layoutBox: t
						} = this.layout, e = n;
						rq((n = this.target || tt()).x, e.x, t.x), rq(n.y, e.y, t.y)
					}
					rs(e, n), it(e, s), na(this.projectionDeltaWithTransform, this.layoutCorrected, e, s)
				}
			}
			registerSharedNode(t, e) {
				this.sharedNodes.has(t) || this.sharedNodes.set(t, new rb), this.sharedNodes.get(t).add(e);
				let i = e.options.initialPromotionConfig;
				e.promote({
					transition: i?.transition,
					preserveFollowOpacity: i?.shouldPreserveFollowOpacity ? i.shouldPreserveFollowOpacity(e) : void 0
				})
			}
			isLead() {
				let t = this.getStack();
				return !t || t.lead === this
			}
			getLead() {
				let {
					layoutId: t
				} = this.options;
				return t && this.getStack()?.lead || this
			}
			getPrevLead() {
				let {
					layoutId: t
				} = this.options;
				return t ? this.getStack()?.prevLead : void 0
			}
			getStack() {
				let {
					layoutId: t
				} = this.options;
				if (t) return this.root.sharedNodes.get(t)
			}
			promote({
				needsReset: t,
				transition: e,
				preserveFollowOpacity: i
			} = {}) {
				this.getStack()?.promote(this, i), t && (this.projectionDelta = void 0, this.needsReset = !0), e && this.setOptions({
					transition: e
				})
			}
			relegate() {
				return this.getStack()?.relegate(this) || !1
			}
			resetSkewAndRotation() {
				let {
					visualElement: t
				} = this.options;
				if (!t) return;
				let {
					latestValues: e
				} = t;
				if (!e2(e)) return;
				let i = {};
				for (let e = 0; e < rk.length; e++) rj(rk[e], t, i, this.animationValues);
				for (let e = 0; e < e0.length; e++) rj(e0[e], t, i, this.animationValues);
				for (let e in t.render(), i) t.setStaticValue(e, i[e]), this.animationValues && (this.animationValues[e] = i[e]);
				t.scheduleRender()
			}
			applyProjectionStyles(t, e) {
				if (!this.instance || this.isSVG) return;
				let i = this.getLead();
				if (!this.isVisible && i !== this) {
					t.visibility = "hidden";
					return
				}
				let s = this.getTransformTemplate();
				if (this.needsReset) {
					this.needsReset = !1, t.visibility = "", t.opacity = "", t.pointerEvents = ib(e?.pointerEvents) || "", t.transform = s ? s(this.latestValues, "") : "none";
					return
				}
				if (!this.projectionDelta || !this.layout || !i.target) {
					(this.options.layoutId || this.needsShow) && (this.needsShow = !1, t.visibility = "", t.opacity = void 0 !== this.latestValues.opacity ? this.latestValues.opacity : 1, t.pointerEvents = ib(e?.pointerEvents) || ""), this.hasProjected && !e1(this.latestValues) && (t.transform = s ? s({}, "") : "none", this.hasProjected = !1);
					return
				}
				t.visibility = "";
				let n = i.animationValues || i.latestValues;
				this.applyTransformsToTarget();
				let r = function(t, e, i) {
					let s = "",
						n = t.x.translate / e.x,
						r = t.y.translate / e.y,
						a = i?.z || 0;
					(n || r || a) && (s = `translate3d(${n}px, ${r}px, ${a}px) `);
					let o = "";
					if (i) {
						let {
							transformPerspective: t
						} = i;
						t && (s = `perspective(${t}px) ${s}`);
						for (let t = 0; t < e0.length; t++) {
							let e = e0[t],
								s = i[e];
							s && (o += `${e}(${s}deg) `), !t && i.pathRotation && (o += `rotate(${i.pathRotation}deg) `)
						}
					}
					if (o) {
						(1 !== e.x || 1 !== e.y) && (s += `scale(${1/e.x}, ${1/e.y}) `), s += o;
						let i = t.x.scale * e.x,
							n = t.y.scale * e.y;
						(1 !== i || 1 !== n) && (s += `scale(${i}, ${n})`)
					} else 1 !== t.x.scale || 1 !== t.y.scale ? s += `scale(${t.x.scale}, ${t.y.scale})` : s || 1 === e.x && 1 === e.y || (s = "scale(1, 1)");
					return s || "none"
				}(this.projectionDeltaWithTransform, this.treeScale, n);
				s && (r = s(n, r)), t.transform = r;
				let {
					x: a,
					y: o
				} = this.projectionDelta;
				for (let e in t.transformOrigin = `${100*a.origin}% ${100*o.origin}% 0`, i.animationValues ? t.opacity = i === this ? n.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : n.opacityExit : t.opacity = i === this ? void 0 !== n.opacity ? n.opacity : "" : void 0 !== n.opacityExit ? n.opacityExit : 0, eK) {
					if (void 0 === n[e]) continue;
					let {
						correct: s,
						applyTo: a,
						isCSSVariable: o
					} = eK[e], l = "none" === r ? n[e] : s(n[e], i);
					if (a) {
						let e = a.length;
						for (let i = 0; i < e; i++) t[a[i]] = l
					} else o ? this.options.visualElement.renderState.vars[e] = l : t[e] = l
				}
				this.options.layoutId && (t.pointerEvents = i === this ? ib(e?.pointerEvents) || "" : "none")
			}
			clearSnapshot() {
				this.resumeFrom = this.snapshot = this.dragSnapshot = this.dragAncestor = void 0
			}
			resetTree() {
				this.root.nodes.forEach(t => t.currentAnimation?.stop()), this.root.nodes.forEach(rN), this.root.sharedNodes.clear()
			}
		}
	}

	function rV(t) {
		t.updateLayout(),
			function(t) {
				let {
					snapshot: e,
					dragAncestor: i
				} = t, s = i?.isAnimationBlocked && i.layout;
				if (!e || !s || t.resumeFrom || t.isAnimationBlocked) return;
				let n = i.dragSnapshot;
				nu(t => e6(e.layoutBox[t], s.layoutBox[t].min - n.layoutBox[t].min))
			}(t)
	}

	function rD(t) {
		let e = t.resumeFrom?.snapshot || t.snapshot;
		if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
			let {
				layoutBox: i,
				measuredBox: s
			} = t.layout, {
				animationType: n
			} = t.options, r = e.source !== t.layout.source, a = (s, r) => {
				if ("size" === n) nu(t => {
					let e = nn(s[t]);
					s[t].min = r[t].min, s[t].max = s[t].min + e
				});
				else if ("x" === n || "y" === n) {
					let t = "x" === n ? "y" : "x";
					ri(s[t], r[t])
				} else rZ(n, e.layoutBox, i) && nu(e => {
					let i = nn(r[e]);
					s[e].max = s[e].min + i, t.relativeTarget && !t.currentAnimation && (t.isProjectionDirty = !0, t.relativeTarget[e].max = t.relativeTarget[e].min + i)
				})
			}, o = r ? e.measuredBox : e.layoutBox;
			a(o, i);
			let l = J();
			na(l, i, e.layoutBox);
			let h = J();
			na(h, r ? t.applyTransform(s, !0) : i, o);
			let u = !rm(l),
				d = !1,
				c = t.getClosestProjectingParent();
			if ((!r || c?.options.layoutRoot && t.resumeFrom?.path.includes(c)) && c && !c.resumeFrom) {
				let {
					snapshot: s,
					layout: n
				} = c;
				if (s && n) {
					let o = t.options.layoutAnchor || void 0,
						l = tt();
					nh(l, r ? t.resumeFrom.applyTransform(e.layoutBox, !0, void 0, !0, c.depth + 1) : e.layoutBox, s.layoutBox, o);
					let h = tt();
					nh(h, i, n.layoutBox, o), r && a(l, h), ry(l, h) || (d = !0), c.options.layoutRoot && (t.relativeTarget = h, t.relativeTargetOrigin = l, t.relativeParent = c)
				}
			}
			t.notifyListeners("didUpdate", {
				layout: i,
				snapshot: e,
				delta: h,
				layoutDelta: l,
				hasLayoutChanged: u,
				hasRelativeLayoutChanged: d
			})
		} else t.isLead() && t.options.onExitComplete?.();
		t.options.transition = void 0
	}

	function rR(t) {
		n3?.(0), t.parent && (t.isProjecting() || (t.isProjectionDirty = t.parent.isProjectionDirty), t.isSharedProjectionDirty || (t.isSharedProjectionDirty = !!(t.isProjectionDirty || t.parent.isProjectionDirty || t.parent.isSharedProjectionDirty)), t.isTransformDirty || (t.isTransformDirty = t.parent.isTransformDirty))
	}

	function rL(t) {
		t.isProjectionDirty = t.isSharedProjectionDirty = t.isTransformDirty = !1
	}

	function rF(t) {
		t.clearSnapshot()
	}

	function rN(t) {
		t.clearMeasurements()
	}

	function rO(t) {
		t.isLayoutDirty = !0, t.updateLayout()
	}

	function rB(t) {
		t.isLayoutDirty = !1
	}

	function rI(t) {
		t.isAnimationBlocked && t.layout && !t.isLayoutDirty && (t.snapshot = t.dragSnapshot || t.layout, t.isLayoutDirty = !0)
	}

	function rU(t) {
		t.relativeTarget && t.relativeParent?.isLayoutDirty && (t.currentAnimation ? t.isLayoutDirty = !0 : (t.targetDelta = void 0, t.removeRelativeTarget()))
	}

	function rW(t) {
		let {
			visualElement: e
		} = t.options;
		e?.getProps().onBeforeLayoutMeasure && e.notify("BeforeLayoutMeasure"), t.resetTransform()
	}

	function rz(t) {
		t.finishAnimation(), t.targetDelta = t.relativeTarget = t.target = void 0, t.isProjectionDirty = !0
	}

	function r$(t) {
		t.resolveTargetDelta()
	}

	function r_(t) {
		t.calcProjection()
	}

	function rK(t) {
		t.resetSkewAndRotation()
	}

	function rY(t, e, i) {
		t.translate = eZ(e.translate, 0, i), t.scale = eZ(e.scale, 1, i), t.origin = e.origin, t.originPoint = e.originPoint
	}

	function rG(t, e, i, s) {
		t.min = eZ(e.min, i.min, s), t.max = eZ(e.max, i.max, s)
	}

	function rH(t) {
		return t.animationValues?.opacityExit !== void 0
	}
	let rX = {
		duration: .45,
		ease: [.4, 0, .1, 1]
	};

	function rq(t, e, i) {
		t.max = nn(i) + (t.min = e.min)
	}

	function rZ(t, e, i) {
		return "position" === t || "preserve-aspect" === t && !(.2 >= Math.abs(rv(e) - rv(i)))
	}

	function rJ(t) {
		return t !== t.root && t.scroll?.wasRoot
	}
	let rQ = rC({
			attachResizeListener: (t, e) => nt(t, "resize", e),
			measureScroll: () => ({
				x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
				y: document.documentElement.scrollTop || document.body?.scrollTop || 0
			}),
			checkIsScrollRoot: () => !0
		}),
		r0 = rC({
			measureScroll: t => ({
				x: t.scrollLeft,
				y: t.scrollTop
			}),
			defaultParent: () => {
				if (!il.current) {
					let t = new rQ({});
					t.mount(window), t.setOptions({
						layoutScroll: !0
					}), il.current = t
				}
				return il.current
			},
			resetTransform: (t, e) => {
				t.style.transform = void 0 !== e ? e : "none"
			},
			checkIsScrollRoot: t => "fixed" === window.getComputedStyle(t).position
		});

	function r1(t, e) {
		let i = ng(t),
			s = new AbortController;
		return [i, {
			passive: !0,
			...e,
			signal: s.signal
		}, nc(() => s.abort())]
	}

	function r2(t, e, i, s, n) {
		let {
			props: r
		} = t, a = "while" + i;
		!n && t.animationState && r[a] && t.animationState.setActive(a, "Start" === s);
		let o = r["on" + i + s];
		o && tI.postRender(() => o(e, ni(e)))
	}

	function r3(t) {
		return nm(t) && "offsetHeight" in t && !("ownerSVGElement" in t)
	}
	let r5 = (t, e) => !!e && (t === e || r5(t, e.parentElement)),
		r4 = new WeakSet;

	function r8(t) {
		return e => {
			"Enter" === e.key && t(e)
		}
	}

	function r6(t, e) {
		t.dispatchEvent(new PointerEvent("pointer" + e, {
			isPrimary: !0,
			bubbles: !0
		}))
	}
	let r9 = new WeakSet,
		r7 = (t, e, i) => Math.hypot(t.clientX - e.clientX, t.clientY - e.clientY) > i,
		at = t => t.preventDefault();

	function ae(t, e, i, s) {
		t.current instanceof HTMLButtonElement && t.current.disabled || r2(t, e, "Tap", i, s)
	}
	let ai = new WeakMap,
		as = new WeakMap,
		an = t => {
			let e = ai.get(t.target);
			e && e(t)
		},
		ar = t => {
			t.forEach(an)
		},
		aa = {
			some: 0,
			all: 1
		},
		ao = function(t, e) {
			if ("u" < typeof Proxy) return iL;
			let i = new Map,
				s = (i, s) => iL(i, s, t, e);
			return new Proxy((t, e) => s(t, e), {
				get: (n, r) => "create" === r ? s : (i.has(r) || i.set(r, iL(r, void 0, t, e)), i.get(r))
			})
		}(Object.assign({}, {
			animation: {
				Feature: class extends iF {
					constructor(t) {
						super(t), t.animationState || (t.animationState = function(t) {
							let e = e => Promise.all(e.map(({
									animation: e,
									options: i
								}) => (function(t, e, i = {}) {
									return t.notify("AnimationStart", e), (Array.isArray(e) ? Promise.all(e.map(e => s5(t, e, i))) : "string" == typeof e ? s5(t, e, i) : Promise.all(s2(t, iN(t, e, i.custom), i))).then(() => {
										t.notify("AnimationComplete", e)
									})
								})(t, e, i))),
								i = s9(),
								s = !0,
								n = !1;

							function r(r) {
								let {
									props: a,
									parent: o,
									manuallyAnimateOnMount: l
								} = t, {
									initial: h
								} = a, u = s || n, d = [], c = (e = h) => "boolean" != typeof e && iN(t, Array.isArray(e) ? e[0] : e, t.presenceContext?.custom) || void 0, p = new Map, m = {}, f = 1 / 0, g = t;
								do g = !1 !== g.props.inherit && g.parent; while (g && !g.isControllingVariants) let y = u && s6(c(h ?? (g && g.props.initial))?.transition);
								if (s8.forEach((e, s) => {
										var n, h;
										let c, v = i[e],
											x = a[e],
											b = g && g.props[e],
											w = void 0 !== x ? x : ey(b) || !1 === b ? b : void 0,
											S = ey(w),
											T = e === r ? v.isActive : null,
											A = S && void 0 === x && !(u && l);
										if (v.protectedKeys = {
												...m
											}, !v.isActive && null === T || !w && !v.prevProp || eg(w) || "boolean" == typeof w) return;
										if (!1 === T && (f = s), "exit" === e && v.isActive && !0 !== T) {
											m = {
												...m,
												...v.prevResolvedValues
											};
											return
										}
										let P = (n = v.prevProp, "string" == typeof(h = w) ? h !== n : !!Array.isArray(h) && !s4(h, n)),
											k = P || S && (T && !A || s > f),
											M = !1,
											j = Array.isArray(w) ? w : [w],
											E = {};
										if (!1 !== T)
											for (let i of j) {
												let {
													transition: s,
													transitionEnd: n,
													...r
												} = iN(t, i, iO(t, e)) || {};
												E = {
													...E,
													...r,
													...n
												}, c = s6(s) || c
											}
										let {
											prevResolvedValues: C
										} = v;
										for (let e in {
												...C,
												...E
											}) {
											let i;
											if (e in m) continue;
											let s = E[e],
												n = C[e],
												r = Array.isArray(s) && Array.isArray(n) ? !s4(s, n) || P : s !== n;
											if (r && null == s) p.has(e) || p.set(e, v.prevOut);
											else if (r || void 0 !== s && p.has(e)) {
												k = !0, i = p.get(e) || y, p.delete(e) && (M = !0), v.needsAnimating[e] = !0;
												let s = t.getValue(e);
												s && (s.liveStyle = !1)
											} else v.protectedKeys[e] = !0;
											v.out[e] = i
										}
										if (v.prevProp = w, v.prevResolvedValues = E, v.prevOut = c, v.isActive && (m = {
												...m,
												...E
											}), k && (!(A && P) || M))
											for (let i of j) {
												let s = {
													type: e
												};
												if ("string" == typeof i && u && l && o?.enteringChildren) {
													let e = iN(o, i)?.transition?.delayChildren;
													s.delay = s3(o.enteringChildren, t, e)
												}
												d.push({
													animation: i,
													options: s
												})
											}
									}), p.size) {
									let e = {},
										i = c(),
										s = i?.transition;
									p.forEach((n, r) => {
										n && (s = {
											...s || t.getDefaultTransition(),
											[r]: n
										});
										let o = t.getValue(r);
										o && (o.liveStyle = !0);
										let l = i && !Array.isArray(h) ? i[r] : void 0,
											u = t.getBaseTargetFromProps(a, r);
										e[r] = (void 0 !== l ? l : void 0 === u || te(u) ? void 0 === t.initialValues[r] ? t.baseTarget[r] : void 0 : u) ?? null
									}), s && (e.transition = s), d.push({
										animation: e
									})
								}
								let v = u && t.blockInitialAnimation || s && !l && (!1 === a.initial || a.initial === a.animate);
								return s = n = !1, !v && d.length ? e(d) : Promise.resolve()
							}
							return {
								animateChanges: r,
								setActive: function(e, s) {
									if (i[e].isActive === s) return Promise.resolve();
									t.variantChildren?.forEach(t => t.animationState?.setActive(e, s)), i[e].isActive = s;
									let n = r(e);
									for (let t in i) i[t].protectedKeys = {};
									return n
								},
								setAnimateFunction: i => {
									e = i(t)
								},
								getState: () => i,
								reset: () => {
									i = s9(), n = !0
								}
							}
						}(t))
					}
					updateAnimationControlsSubscription() {
						let {
							animate: t
						} = this.node.getProps();
						eg(t) && (this.unmountControls = t.subscribe(this.node))
					}
					mount() {
						this.updateAnimationControlsSubscription()
					}
					update() {
						this.node.getProps().animate !== this.node.prevProps?.animate && this.updateAnimationControlsSubscription()
					}
					unmount() {
						this.node.animationState.reset(), this.unmountControls?.()
					}
				}
			},
			exit: {
				Feature: class extends iF {
					constructor() {
						super(...arguments), this.id = s7++
					}
					update() {
						let {
							presenceContext: t,
							animationState: e
						} = this.node;
						if (!t || !e) return;
						let {
							isPresent: i,
							onExitComplete: s
						} = t;
						if (i === !this.exit) return;
						if (i) {
							if (!0 === this.exit) {
								let {
									initial: t
								} = this.node.getProps();
								if (t && !Array.isArray(t)) {
									let {
										transition: e,
										transitionEnd: i,
										...s
									} = iN(this.node, t) || {};
									for (let t in s) this.node.getValue(t)?.jump(s[t])
								}
								this.node.blockInitialAnimation = !1, e.reset(), e.animateChanges()
							} else e.setActive("exit", !1);
							this.exit = void 0;
							return
						}
						let n = this.exit = e.setActive("exit", !0);
						s && n.then(() => {
							this.exit === n && (this.exit = !0, s(this.id))
						})
					}
					mount() {
						let {
							register: t
						} = this.node.presenceContext || {};
						t && (this.unmount = t(this.id, this.node)), this.update()
					}
					unmount() {}
				}
			}
		}, {
			inView: {
				Feature: class extends iF {
					constructor() {
						super(...arguments), this.hasEnteredView = !1, this.isInView = !1
					}
					startObserver() {
						var t;
						let e;
						this.stopObserver?.();
						let {
							viewport: i = {}
						} = this.node.getProps(), {
							root: s,
							margin: n,
							amount: r = "some",
							once: a
						} = i, o = {
							root: s ? s.current : void 0,
							rootMargin: n,
							threshold: "number" == typeof r ? r : aa[r]
						}, l = t => {
							let {
								isIntersecting: e
							} = t;
							if (this.isInView === e || (this.isInView = e, a && !e && this.hasEnteredView)) return;
							e && (this.hasEnteredView = !0), this.node.animationState && this.node.animationState.setActive("whileInView", e);
							let {
								onViewportEnter: i,
								onViewportLeave: s
							} = this.node.getProps(), n = e ? i : s;
							n && n(t)
						};
						this.stopObserver = (t = this.node.current, e = function({
							root: t,
							...e
						}) {
							let i = t || document;
							as.has(i) || as.set(i, {});
							let s = as.get(i),
								n = JSON.stringify(e);
							return s[n] || (s[n] = new IntersectionObserver(ar, {
								root: t,
								...e
							})), s[n]
						}(o), ai.set(t, l), e.observe(t), () => {
							ai.delete(t), e.unobserve(t)
						})
					}
					mount() {
						this.startObserver()
					}
					update() {
						if ("u" < typeof IntersectionObserver) return;
						let {
							props: t,
							prevProps: e
						} = this.node;
						["amount", "margin", "root"].some(function({
							viewport: t = {}
						}, {
							viewport: e = {}
						} = {}) {
							return i => t[i] !== e[i]
						}(t, e)) && this.startObserver()
					}
					unmount() {
						this.stopObserver?.(), this.hasEnteredView = !1, this.isInView = !1
					}
				}
			},
			tap: {
				Feature: class extends iF {
					constructor() {
						super(...arguments), this.options = {}
					}
					mount() {
						let {
							current: t
						} = this.node;
						t && (this.update(), this.unmount = function(t, e, i = {}) {
							e = np(e);
							let [s, n, r] = r1(t, i), a = new WeakMap, o = t => {
								let s, r = t.currentTarget;
								if (!(ne(t) && !nN()) || r9.has(t)) return;
								i.stopPropagation && r9.add(t);
								let {
									count: o = 1,
									countTimeout: l = .3,
									hold: h = 0,
									repeat: u
								} = i, d = t9.now(), c = tZ(h), p = tZ(l), m = a.get(r);
								m?.expire(r7(m.event, t, 100)) ? m = void 0 : m && (tU(m.expire), a.delete(r));
								let f = m ? m.count + 1 : 1,
									g = f >= o,
									y = g && (h || u),
									v = !h,
									x = 0;
								if (r4.add(r), m) s = m.handlers;
								else {
									let i = e(r, t);
									s = "function" == typeof i ? {
										onComplete: i
									} : i || {}
								}
								g && v && s.onActive?.();
								let b = tZ(u),
									w = c || b,
									S = d + w,
									T = !0,
									A = () => {
										if (n.signal.aborted) return tU(A);
										let t = Math.min(1 - (S - t9.now()) / w, 1);
										T && t < 1 && (t = 0), T = !1, s.onHold?.(t), t < 1 || (v ? s.onRepeat?.(++x) : (v = !0, s.onActive?.()), u ? (T = !0, S += w = b) : tU(A))
									},
									P = {
										...n,
										capture: !0
									},
									k = (e, i) => {
										if (window.removeEventListener("pointerup", M, P), window.removeEventListener("pointercancel", j, P), window.removeEventListener("pointermove", E, P), r.removeEventListener("contextmenu", at), tU(A), r4.delete(r), ne(e))
											if (nN() && (i = !1), i && !g) {
												let i = t9.now(),
													o = t => {
														let l = n.signal.aborted;
														if (l || !0 === t || t9.now() - i > p) return tU(o), a.delete(r), l || s.onComplete?.(e, {
															success: !1
														}), !0
													};
												a.set(r, {
													count: f,
													event: t,
													handlers: s,
													expire: o
												}), tI.update(o, !0)
											} else s.onComplete?.(e, {
												success: i && v
											})
									},
									M = t => {
										k(t, r === window || r === document || i.useGlobalTarget || r5(r, t.target))
									},
									j = t => {
										k(t, !1)
									},
									E = e => {
										ne(e) && ((u || !v) && r7(t, e, 8) || o > 1 && nN()) && j(e)
									};
								window.addEventListener("pointerup", M, P), window.addEventListener("pointercancel", j, P), (y || o > 1) && window.addEventListener("pointermove", E, P), y && (tI.update(A, !0), r.addEventListener("contextmenu", at, {
									...n,
									passive: !1
								}))
							};
							return s.forEach(t => {
								((i.useGlobalTarget ? window : t).addEventListener("pointerdown", o, n), r3(t)) && (t.addEventListener("focus", () => {
									let e, i, s;
									return e = !1, i = r8(() => {
										e || r4.has(t) || (e = !0, r6(t, "down"))
									}), s = r8(() => {
										e && (e = !1, r6(t, "up"))
									}), void(t.addEventListener("keydown", i, n), t.addEventListener("keyup", s, n), t.addEventListener("blur", () => {
										t.removeEventListener("keydown", i), t.removeEventListener("keyup", s), e && r6(t, "cancel")
									}, {
										...n,
										once: !0
									}))
								}, n), nR.has(t.tagName) || !0 === t.isContentEditable || t.hasAttribute("tabindex") || (t.tabIndex = 0))
							}), r
						}(t, (t, e) => (ae(this.node, e, "Start"), {
							onComplete: (t, {
								success: e
							}) => ae(this.node, t, e ? "" : "Cancel"),
							onRepeat: () => ae(this.node, e, "", !0)
						}), this.options))
					}
					update() {
						let {
							options: t,
							node: e
						} = this, {
							globalTapTarget: i,
							propagate: s,
							tap: n
						} = e.props;
						for (let e in t) delete t[e];
						Object.assign(t, n, {
							useGlobalTarget: i,
							stopPropagation: s?.tap === !1
						})
					}
					unmount() {}
				}
			},
			focus: {
				Feature: class extends iF {
					constructor() {
						super(...arguments), this.isActive = !1
					}
					onFocus() {
						let t = !1;
						try {
							t = this.node.current.matches(":focus-visible")
						} catch (e) {
							t = !0
						}
						t && this.node.animationState && (this.node.animationState.setActive("whileFocus", !0), this.isActive = !0)
					}
					onBlur() {
						this.isActive && this.node.animationState && (this.node.animationState.setActive("whileFocus", !1), this.isActive = !1)
					}
					mount() {
						this.unmount = iW(nt(this.node.current, "focus", () => this.onFocus()), nt(this.node.current, "blur", () => this.onBlur()))
					}
					unmount() {}
				}
			},
			hover: {
				Feature: class extends iF {
					mount() {
						let {
							current: t
						} = this.node;
						t && (this.unmount = function(t, e, i = {}) {
							e = np(e);
							let [s, n, r] = r1(t, i);
							return s.forEach(t => {
								let i, s = !1,
									r = !1,
									a = e => {
										i && (i(e), i = void 0), t.removeEventListener("pointerleave", l)
									},
									o = t => {
										s = !1, window.removeEventListener("pointerup", o), window.removeEventListener("pointercancel", o), r && (r = !1, a(t))
									},
									l = t => {
										if ("touch" !== t.pointerType) {
											if (s) {
												r = !0;
												return
											}
											a(t)
										}
									};
								t.addEventListener("pointerenter", s => {
									if ("touch" === s.pointerType || nN()) return;
									r = !1;
									let a = e(t, s);
									"function" == typeof a && (i = a, t.addEventListener("pointerleave", l, n))
								}, n), t.addEventListener("pointerdown", () => {
									s = !0, window.addEventListener("pointerup", o, n), window.addEventListener("pointercancel", o, n)
								}, n)
							}), r
						}(t, (t, e) => (r2(this.node, e, "Hover", "Start"), t => r2(this.node, t, "Hover", "End"))))
					}
					unmount() {}
				}
			}
		}, {
			pan: {
				Feature: class extends iF {
					constructor() {
						super(...arguments), this.removePointerDownListener = tL
					}
					onPointerDown(t) {
						this.session = new nM(t, this.createPanHandlers(), {
							transformPagePoint: this.node.getTransformPagePoint(),
							contextWindow: this.node.current?.ownerDocument.defaultView
						})
					}
					createPanHandlers() {
						let {
							onPanSessionStart: t,
							onPanStart: e,
							onPan: i,
							onPanEnd: s
						} = this.node.getProps();
						return {
							onSessionStart: nH(t),
							onStart: nH(e),
							onMove: nH(i),
							onEnd: (t, e) => {
								delete this.session, s && tI.postRender(() => s(t, e))
							}
						}
					}
					mount() {
						this.removePointerDownListener = ns(this.node.current, "pointerdown", t => this.onPointerDown(t))
					}
					update() {
						this.session?.updateHandlers(this.createPanHandlers())
					}
					unmount() {
						this.removePointerDownListener(), this.session?.end()
					}
				}
			},
			drag: {
				Feature: class extends iF {
					constructor(t) {
						super(t), this.removeGroupControls = tL, this.removeListeners = tL, this.controls = new n$(t)
					}
					mount() {
						let {
							dragControls: t
						} = this.node.getProps();
						t && (this.removeGroupControls = t.subscribe(this.controls)), this.removeListeners = this.controls.addListeners() || tL
					}
					update() {
						let {
							dragControls: t,
							drag: e
						} = this.node.getProps(), {
							dragControls: i,
							drag: s
						} = this.node.prevProps || {};
						t !== i && (this.removeGroupControls(), t && (this.removeGroupControls = t.subscribe(this.controls))), s && !e && this.controls.stop(void 0, void 0, s)
					}
					unmount() {
						this.removeGroupControls(), this.removeListeners(), this.controls.isDragging || this.controls.endPanSession()
					}
				},
				ProjectionNode: r0,
				MeasureLayout: n1
			}
		}, {
			layout: {
				ProjectionNode: r0,
				MeasureLayout: n1
			}
		}), (t, e) => e.isSVG ?? ia(t) ? new eX(e) : new ii(e, {
			allowProjection: t !== is.Fragment
		}));
	t.s(["f", 0, ao], 551769);
	let al = [];

	function ah(t, e, i = {}, s) {
		let n = [],
			{
				velocity: r,
				path: a
			} = i,
			o = i.reduceMotion ?? s?.shouldReduceMotion;
		for (let l in a?.animateValues && s && (e = {
				...e
			}, a.animateValues(t, e, i, 0, n)), e) {
			if ("transition" === l || "transitionEnd" === l) continue;
			let a = e[l];
			if (void 0 === a) continue;
			let h = t(l),
				u = h.get();
			if (void 0 !== u && !h.isAnimating() && !Array.isArray(a) && a === u && !r) {
				tI.update(() => h.set(a));
				continue
			}
			h.run(s0(l, h, a, o && ti.has(l) ? {
				type: !1
			} : i, s)), h.animation && n.push(h.animation)
		}
		let {
			transitionEnd: l
		} = e;
		if (l) {
			let e = () => tI.update(() => {
				for (let e in l) t(e).set(l[e])
			});
			n.length ? Promise.all(n).then(e) : e()
		}
		return n
	}

	function au(t, e, i, s, n) {
		let r, a = !1,
			o = ah(s => {
				let o = r?.[s] ?? t.get(e, s);
				if (!o) {
					let h;
					if (!n) {
						var l;
						let n, r = i[s];
						h = (null === (n = Array.isArray(l = r) ? l[0] : void 0) ? void 0 : n) ?? t.read(e, s, r)
					}
					o = em(h, {
						owner: n
					}), a ? t(e, {
						[s]: o
					}) : (r || (r = {}))[s] = o
				}
				return o
			}, i, s, n);
		return a = !0, r && t(e, r), o
	}
	class ad {
		constructor(t) {
			this.stop = () => {
				for (let t of this.animations) t.stop()
			}, this.animations = t.filter(Boolean)
		}
		get finished() {
			return Promise.all(this.animations.map(t => t.finished))
		}
		getAll(t) {
			return this.animations[0][t]
		}
		attachTimeline(t) {
			let e = this.animations.map(e => e.attachTimeline(t));
			return () => {
				e.forEach((t, e) => {
					t && t(), this.animations[e].stop()
				})
			}
		}
		get time() {
			return this.getAll("time")
		}
		set time(t) {
			for (let e of this.animations) e.time = t
		}
		get speed() {
			return this.getAll("speed")
		}
		set speed(t) {
			for (let e of this.animations) e.speed = t
		}
		get state() {
			return this.getAll("state")
		}
		get startTime() {
			return this.getAll("startTime")
		}
		get duration() {
			return ac(this.animations, "duration")
		}
		get iterationDuration() {
			return ac(this.animations, "iterationDuration")
		}
		play() {
			for (let t of this.animations) t.play()
		}
		pause() {
			for (let t of this.animations) t.pause()
		}
		cancel() {
			for (let t of this.animations) t.cancel()
		}
		complete() {
			for (let t of this.animations) t.complete()
		}
	}

	function ac(t, e) {
		let i = 0;
		for (let s = 0; s < t.length; s++) {
			let n = t[s][e];
			null !== n && n > i && (i = n)
		}
		return i
	}
	class ap extends ad {
		then(t, e) {
			return this.finished.finally(t).then(() => {})
		}
	}

	function am(t, e) {
		var i;
		let s;
		return sh(t) ? t[i = t.length, ((e - 0) % (s = i - 0) + s) % s + 0] : t
	}

	function af(t) {
		return "object" == typeof t && !Array.isArray(t)
	}

	function ag(t, e, i, s) {
		return null == t ? [] : "string" == typeof t && af(e) ? ng(t, i, s) : t instanceof NodeList ? Array.from(t) : Array.isArray(t) ? t.filter(t => null != t) : [t]
	}

	function ay(t, e) {
		if (e.has(t)) return e.get(t);
		let [, i, s] = t.match(/^(.+?)([+-][\d.]+)$/) || [];
		return e.has(i) ? Math.max(0, e.get(i) + parseFloat(s)) : void 0
	}

	function av(t, e) {
		return t.at !== e.at ? t.at - e.at : null === t.value ? 1 : null === e.value ? -1 : 0
	}

	function ax(t, e) {
		return e.has(t) || e.set(t, {}), e.get(t)
	}

	function ab(t, e) {
		return e[t] || (e[t] = []), e[t]
	}
	let aw = t => "number" == typeof t,
		aS = t => t.every(aw);
	class aT {
		constructor(t = tI.render) {
			this.step = t, this.values = new Map, this.pending = [], this.numPending = 0, this.flush = () => {
				let {
					pending: t,
					numPending: e
				} = this;
				this.numPending = 0;
				for (let i = 0; i < e; i++) t[i]()
			}
		}
		set(t, e, i, s) {
			if (this.values.get(t)?.onRemove(), s)
				for (let t of this.values.values()) t.value === s && (i = t.render);
			let n = () => i && this.schedule(i);
			void 0 !== e.get() && n();
			let r = e.on("change", n),
				a = () => {
					r(), i && !s && this.cancel(i), this.values.get(t)?.onRemove === a && this.values.delete(t)
				};
			return this.values.set(t, {
				value: e,
				render: s ? void 0 : i,
				onRemove: a
			}), a
		}
		get(t) {
			return this.values.get(t)?.value
		}
		release() {
			let t = new Map;
			return this.values.forEach((e, i) => {
				t.set(i, e.value), e.onRemove()
			}), this.transformKeys = this.transformValues = void 0, t
		}
		schedule(t) {
			let {
				pending: e,
				numPending: i
			} = this;
			for (let s = 0; s < i; s++)
				if (e[s] === t) return;
			i || this.step(this.flush), e[this.numPending++] = t
		}
		cancel(t) {
			let {
				pending: e
			} = this;
			for (let i = 0; i < this.numPending; i++)
				if (e[i] === t) {
					e[i] = e[--this.numPending];
					return
				}
		}
	}

	function aA(t, {
		step: e,
		...i
	} = {}) {
		let s = new WeakMap;
		return Object.assign((i, n) => {
			let r = s.get(i) ?? new aT(e);
			s.set(i, r);
			let a = [];
			for (let e in n) {
				let s = n[e],
					o = t(i, r, e, s);
				a.push(o)
			}
			return () => {
				for (let t of a) t()
			}
		}, i, {
			get: (t, e) => s.get(t)?.get(e),
			flush: t => s.get(t)?.flush(),
			state: t => s.get(t)
		})
	}
	let aP = new Set(["originX", "originY", "originZ"]),
		ak = (t, e) => eV(t.get(e)?.get(), H[e]),
		aM = (t, e, i, s) => {
			let n, r;
			if (u.has(i)) {
				if ("pathRotation" !== i) {
					let t = e.transformKeys ?? (e.transformKeys = []);
					(e.transformValues ?? (e.transformValues = {}))[i] = s, t.includes(i) || (t.push(i), t.sort((t, e) => h.indexOf(t) - h.indexOf(e)))
				}
				e.get("transform") || (r3(t) || e.get("transformBox") || aM(t, e, "transformBox", new ep("fill-box")), e.set("transform", new ep("none"), () => {
					eh.get(t)?.check(), t.style.transform = function(t) {
						let e = "",
							{
								transformKeys: i = [],
								transformValues: s = {}
							} = t;
						for (let t = 0; t < i.length; t++) {
							let n = i[t],
								r = s[n].getCurrent();
							void 0 !== r && (eN(n, r) || (e += (e && " ") + eF(n, r)))
						}
						let n = t.get("pathRotation")?.get();
						return n && (e += (e && " ") + eF("rotate", n)), e || "none"
					}(e)
				})), r = e.get("transform")
			} else aP.has(i) ? (e.get("transformOrigin") || e.set("transformOrigin", new ep(""), () => {
				let i = ak(e, "originX") ?? "50%",
					s = ak(e, "originY") ?? "50%",
					n = ak(e, "originZ") ?? 0;
				t.style.transformOrigin = `${i} ${s} ${n}`
			}), r = e.get("transformOrigin")) : n = i.startsWith("--") ? () => {
				t.style.setProperty(i, s.getCurrent())
			} : () => {
				t.style[i] = eV(s.getCurrent(), H[i])
			};
			return e.set(i, s, n, r)
		},
		aj = (t, e) => {
			if (u.has(e)) return tP(t, e);
			let i = getComputedStyle(t),
				s = e.startsWith("--") ? i.getPropertyValue(e) : i[e];
			return "string" == typeof s && s.trim() || 0
		},
		aE = aA(aM, {
			test: t => r3(t) || nf(t),
			read: aj
		}),
		aC = (t, e, i, s, n = i) => {
			let r = function(t, e) {
				if (!(e in t)) return !1;
				let i = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(t), e) || Object.getOwnPropertyDescriptor(t, e);
				return i && "function" == typeof i.set
			}(t, n);
			!r && (n.startsWith("data") || n.startsWith("aria")) && (n = eC(n));
			let a = H[i] || H[n],
				o = r ? () => {
					t[n] = eV(s.get(), H[i])
				} : () => {
					let e = eV(s.get(), a);
					null == e ? t.removeAttribute(n) : t.setAttribute(n, String(e))
				};
			return e.set(i, s, o)
		},
		aV = aA((t, e, i, s) => {
			if (i.startsWith("path") && !u.has(i)) return (tI.render(() => t.setAttribute("pathLength", "1")), "pathOffset" === i) ? e.set(i, s, () => {
				let e = s.get();
				t.setAttribute("stroke-dashoffset", `${-e}`)
			}) : (e.get("stroke-dasharray") || e.set("stroke-dasharray", new ep("1 1"), () => {
				let i = e.get("pathLength")?.get() ?? 1,
					s = e.get("pathSpacing")?.get();
				t.setAttribute("stroke-dasharray", `${i} ${s??1-Number(i)}`)
			}), e.set(i, s, void 0, e.get("stroke-dasharray")));
			return i.startsWith("attr") ? aC(t, e, i, s, aD(i)) : "d" === i ? e.set(i, s, () => {
				let e = s.get()?.replace(/path\(|["')]/g, "");
				void 0 === e ? t.removeAttribute(i) : t.setAttribute(i, e)
			}) : (u.has(i) || aP.has(i) || i.startsWith("--") || i in t.style ? aM : aC)(t, e, i, s)
		}, {
			test: nf,
			read: (t, e) => u.has(e) ? H[e]?.default || 0 : e.startsWith("--") || eU.includes(e) ? aj(t, e) || t.getAttribute(eC(e)) || 0 : (e = aD(e), t.getAttribute(eC(e)) ?? t.getAttribute(e) ?? void 0)
		});

	function aD(t) {
		return t.replace(/^attr([A-Z])/, (t, e) => e.toLowerCase())
	}
	let aR = {};
	class aL {
		constructor(t, e) {
			this.effect = t, this.current = e, this.KeyframeResolver = tq
		}
		getValue(t) {
			return this.effect.get(this.current, t)
		}
		readValue(t, e) {
			return this.effect.read(this.current, t, e)
		}
		render() {
			this.effect.flush(this.current)
		}
		measureViewportBox() {
			return ie(this.current)
		}
		getProps() {
			return aR
		}
	}
	let aF = aA((t, e, i, s) => e.set(i, s, () => {
		t[i] = s.get()
	}), {
		test: t => nm(t),
		read: (t, e) => {
			let i = t[e];
			return "string" == typeof i || "number" == typeof i ? i : void 0
		}
	});

	function aN(t, e, i, s) {
		let n = [];
		if (te(t) || "number" == typeof t || "string" == typeof t && !af(e)) n.push(n2(t, af(e) && e.default || e, i && i.default || i));
		else {
			if (null == t) return n;
			let r = ag(t, e, s),
				a = r.length;
			for (let t = 0; t < a; t++) {
				let s = r[t],
					o = {
						...i
					};
				"delay" in o && "function" == typeof o.delay && (o.delay = o.delay(t, a)), s instanceof Element ? n.push(... function(t, e, i, s) {
					if (nd.current?.track(t), s) return ah(t => s.getValue(t, null), e, i, s);
					let n = nf(t) ? aV : aE;
					return au(n, t, e, i, new aL(n, t))
				}(s, e, o, ef.get(s))) : n.push(...au(function(t) {
					return al.find(e => e.test(t))
				}(s) ?? aF, s, e, o))
			}
		}
		return n
	}
	let aO = 0;

	function aB({
		repeat: t = 0,
		repeatDelay: e = 0,
		repeatType: i = "loop",
		delay: s = 0
	}, n, r, a) {
		let o = n + e,
			l = void 0 === a;
		if (l) {
			let e = Math.max(0, r - s);
			a = o && e > 0 ? Math.min(t, Math.ceil(e / o - 1e-9) - 1) : 0, r = Math.min(e - a * o, n)
		}
		return "loop" !== i && a % 2 && (r = n - r), [a, l ? r : s + a * o + r]
	}
	let aI = (t, e) => void 0 === e ? t : {
		name: t,
		at: e
	};

	function aU(t) {
		t.pause(), t.time = 0, t.stop()
	}
	class aW {
		constructor(t = [], e = {}, i) {
			this.options = e, this.entries = [], this.repeatIndex = 0, this.prevTime = 0, this.markers = [], this.labels = new Map, this.totalDuration = 0, this.isDirty = !1, this.isDone = !1, this.isRebuilding = !1, this.playbackSpeed = 1, this.motionScope = nd.current, this.isKilled = !1, this.isWrapped = !1, this.stop = () => {
				this.flush(), this.group?.stop()
			}, this.isPaused = !1 === e.autoplay, this.newFinished(), t.forEach(t => this.add(t)), i ? (this.isDirty = !1, this.isWrapped = !0, this.group = new ap(i), this.watch()) : (this.invalidate(), this.flush())
		}
		add(t, e) {
			return t instanceof aW && t.adopt(this), this.push({
				item: t,
				at: e
			})
		}
		call(t, e) {
			return this.push({
				item: t,
				at: e,
				marker: {
					name: "_m" + aO++,
					time: 0,
					callback: t
				}
			})
		}
		addPause(t, e) {
			return this.push({
				item: e || {},
				at: t,
				marker: {
					name: "_m" + aO++,
					time: 0,
					callback: e,
					pause: !0
				}
			})
		}
		move(t, e) {
			return this.entries.forEach(i => {
				i.item === t && (i.at = e)
			}), this.invalidate()
		}
		remove(t) {
			return t instanceof aW && (t.parent = void 0), this.entries = this.entries.filter(e => e.item !== t), this.invalidate()
		}
		clear() {
			return this.entries = [], this.invalidate()
		}
		getLabelTime(t) {
			return this.flush(), this.labels.get(t)
		}
		seek(t) {
			return this.time = this.resolve(t), this
		}
		playTo(t) {
			let e = this.resolve(t),
				i = this.iterationDuration,
				s = this.time,
				[n] = aB(this.options, i, s),
				r = aB(this.options, i, e, n)[1],
				a = Math.abs(this.speed);
			return this.speed = r < s ? -a : a, this.stopAt = e, this.clock || this.invalidate(), this.play(), this
		}
		reverse() {
			return this.speed = -this.speed, this.play(), this
		}
		get progress() {
			return this.duration ? this.time / this.duration : 0
		}
		set progress(t) {
			this.time = t * this.duration
		}
		get time() {
			return this.active()?.time ?? 0
		}
		set time(t) {
			this.flush(), this.prevTime = t, this.group && (this.group.time = t), this.repeatIndex = this.currentRepeat()
		}
		get speed() {
			return this.playbackSpeed
		}
		set speed(t) {
			this.playbackSpeed = t, this.group && (this.group.speed = t)
		}
		get duration() {
			return this.flush(), this.isWrapped ? this.group.duration : this.totalDuration
		}
		get iterationDuration() {
			return this.flush(), this.isWrapped ? this.group.iterationDuration : this.totalDuration
		}
		get state() {
			return this.active()?.state ?? "idle"
		}
		get startTime() {
			return this.active()?.startTime ?? null
		}
		play() {
			this.flush(), this.isPaused = !1, this.group?.play(), this.isDone && (this.newFinished(), this.watch())
		}
		pause() {
			this.flush(), this.isPaused = !0, this.group?.pause()
		}
		cancel() {
			this.flush(), this.group?.cancel()
		}
		complete() {
			this.flush(), this.group?.complete()
		}
		attachTimeline(t) {
			return this.flush(), this.scrollTimeline = t, this.detachScroll = this.group?.attachTimeline(t), () => {
				this.scrollTimeline = void 0, this.detachScroll?.()
			}
		}
		then(t, e) {
			return this.finished.then(t, e)
		}
		active() {
			return this.flush(), this.group?.animations.length ? this.group : void 0
		}
		push(t) {
			return this.entries.push(t), this.invalidate()
		}
		invalidate() {
			return this.parent ? this.parent.invalidate() : this.isDirty || (this.isDirty = !0, queueMicrotask(() => this.flush())), this
		}
		flush() {
			!this.isDirty || this.parent || this.isKilled || this.build()
		}
		adopt(t) {
			this.group && (aU(this.group), this.group = void 0), this.isDirty = !1, this.parent = t
		}
		build() {
			let t, e = this.isWrapped ? this.group.iterationDuration : this.totalDuration;
			this.isDirty = !1, this.isWrapped = !1;
			let i = this.group,
				s = 0;
			i && (this.isRebuilding = !0, this.scrollTimeline ? (this.detachScroll?.(), i.cancel()) : (s = i.animations.length ? i.time : 0, aU(i)), this.isRebuilding = !1);
			let {
				defaultTransition: n,
				onComplete: r,
				onUpdate: a,
				onRepeat: o,
				onReverseComplete: l,
				autoplay: h,
				scope: u,
				...d
			} = this.options, c = {};
			u?.reduceMotion !== void 0 && (c.reduceMotion = u.reduceMotion), u?.skipAnimations !== void 0 && (c.skipAnimations = u.skipAnimations), Object.assign(c, d);
			let p = new Map,
				m = {},
				f = nd.current;
			nd.current = this.motionScope;
			try {
				var g, y;
				let e, i, s;
				g = this.toSequence(p), y = {
					defaultTransition: n,
					...c
				}, e = [], i = function(t, {
					defaultTransition: e = {},
					...i
				} = {}, s, n, r) {
					let a = e.duration || .3,
						o = new Map,
						l = new Map,
						h = {},
						u = new Map,
						d = 0,
						c = 0,
						p = 0,
						m = (t, i) => {
							let r = i,
								o = t => {
									var e, s, n, r;
									return "number" == typeof t ? i + t : (e = c, s = t, n = d, r = u, "number" == typeof s ? s : s.startsWith("-") || s.startsWith("+") ? Math.max(0, e + parseFloat(s)) : "<" === s ? n : s.startsWith("<") ? Math.max(0, n + parseFloat(s.slice(1))) : ay(s, r) ?? e)
								};
							for (let i = 0; i < t.length; i++) {
								let y = t[i];
								if ("string" == typeof y) {
									u.set(y, c);
									continue
								}
								if (!Array.isArray(y)) {
									let t = void 0 === y.at ? c : o(y.at);
									"sequence" in y ? (d = c = t, c = m(y.sequence, t), d = t, r = Math.max(r, c)) : u.set(y.name, t);
									continue
								}
								let [v, x, b = {}] = y;
								void 0 !== b.at && (c = o(b.at));
								let w = 0,
									S = (t, i, s, r = 0, o = 0) => {
										var l;
										let h = Array.isArray(l = t) ? l : [l],
											{
												delay: u = 0,
												times: d = sT(h),
												type: m = e.type || "keyframes",
												repeat: f,
												repeatType: g,
												repeatDelay: y = 0,
												...v
											} = i,
											{
												ease: x = e.ease || "easeOut",
												duration: b
											} = i;
										s.mixer || (s.mixer = i.mixer);
										let S = "function" == typeof u ? u(r, o) : u,
											T = h.length,
											A = ea(m) ? m : n?.[m || "keyframes"];
										if (T <= 2 && A) {
											let t = 100;
											2 === T && aS(h) && (t = Math.abs(h[1] - h[0]));
											let i = {
												...e,
												...v
											};
											void 0 !== b && (i.duration = tZ(b));
											let s = i5(i, t, A);
											x = s.ease, b = s.duration
										}
										b ?? (b = a);
										let P = c + S;
										1 === d.length && 0 === d[0] && (d[1] = 1);
										let k = d.length - h.length;
										if (k > 0 && sS(d, k), 1 === h.length && h.unshift(null), f && tr.default, f && f < 20) {
											let t = b > 0 ? y / b : 0;
											b = b * (f + 1) + y * f;
											let e = [...h],
												i = [...d],
												s = [...x = Array.isArray(x) ? [...x] : [x]],
												n = "reverse" === g || "mirror" === g,
												r = e,
												a = s;
											n && (r = [...e].reverse(), "reverse" === g && (a = [...s].reverse().map(t => "function" == typeof t ? sd(t) : t)));
											for (let o = 0; o < f; o++) {
												let l = n && o % 2 == 0,
													u = l ? r : e,
													c = l ? a : s,
													p = (o + 1) * (1 + t);
												t > 0 && (h.push(h[h.length - 1]), d.push(p), x.push("linear")), h.push(...u);
												for (let t = 0; t < u.length; t++) d.push(i[t] + p), x.push(0 === t ? "linear" : am(c, t - 1))
											}! function(t, e, i = 0) {
												let s = e + 1 + e * i;
												for (let e = 0; e < t.length; e++) t[e] = t[e] / s
											}(d, f, t)
										}
										let M = P + b;
										! function(t, e, i, s, n, r) {
											for (let e = 0; e < t.length; e++) {
												let i = t[e];
												i.at > n && i.at < r && (tQ(t, i), e--)
											}
											for (let a = 0; a < e.length; a++) t.push({
												value: e[a],
												at: eZ(n, r, s[a]),
												easing: am(i, a)
											})
										}(s, h, x, d, P, M), w = Math.max(S + b, w), p = Math.max(M, p)
									};
								if (te(v)) S(x, b, ab("default", ax(v, l)));
								else {
									let t = ag(v, x, s, h),
										e = t.length;
									for (let i = 0; i < e; i++) {
										let s = ax(t[i], l);
										for (let t in x) {
											var f, g;
											S(x[t], (f = b, g = t, f && f[g] ? {
												...f,
												...f[g]
											} : {
												...f
											}), ab(t, s), i, e)
										}
									}
								}
								d = c, c += w, r = Math.max(r, c)
							}
							return r
						};
					m(t, 0), r && (r.duration = p, r.labels = u);
					let {
						type: f,
						...g
					} = e;
					return l.forEach((t, s) => {
						for (let n in t) {
							let r = t[n];
							r.sort(av);
							let a = [],
								l = [],
								h = [];
							for (let t = 0; t < r.length; t++) {
								let {
									at: e,
									value: i,
									easing: s
								} = r[t];
								a.push(i), l.push(sw(0, p, e)), h.push(s || "easeOut")
							}
							0 !== l[0] && (l.unshift(0), a.unshift(a[0]), h.unshift("easeInOut")), 1 !== l[l.length - 1] && (l.push(1), a.push(null)), o.has(s) || o.set(s, {
								keyframes: {},
								transition: {}
							});
							let u = o.get(s);
							u.keyframes[n] = a, u.transition[n] = {
								...g,
								duration: p,
								ease: h,
								times: l,
								mixer: r.mixer || e.mixer,
								...i
							}
						}
					}), o
				}(g.map(t => {
					if (Array.isArray(t) && "function" == typeof t[0]) {
						let e = t[0],
							i = em(0);
						return (i.on("change", e), 1 === t.length) ? [i, [0, 1]] : 2 === t.length ? [i, [0, 1], t[1]] : [i, t[1], t[2]]
					}
					return t
				}), y, u, {
					spring: si
				}, m), s = y?.reduceMotion ?? y?.defaultTransition?.reduceMotion, i.forEach(({
					keyframes: t,
					transition: i
				}, n) => {
					e.push(...aN(n, t, {
						...i,
						reduceMotion: s
					}))
				}), t = e
			} finally {
				nd.current = f
			}
			let v = m.labels,
				x = c.duration ?? m.duration,
				b = m.duration ? x / m.duration : 1;
			if (v.forEach((t, e) => v.set(e, t * b)), this.markers = [], p.forEach((t, e) => {
					t.time = v.get(e), v.delete(e), x = Math.max(x, t.time), this.markers.push(t)
				}), this.markers.sort((t, e) => t.time - e.time), this.labels = v, this.totalDuration = x, this.clock = this.clockAnimation = void 0, this.markers.length || void 0 !== this.stopAt || a || o) {
				let e = this.clock = em(0);
				e.on("change", t => e === this.clock && this.onClock(t)), t.unshift(this.clockAnimation = n2(e, [0, x], {
					...c,
					duration: x,
					ease: "linear"
				}))
			}
			let w = this.group = new ap(t),
				{
					delay: S = 0,
					repeat: T = 0,
					repeatDelay: A = 0
				} = this.options,
				[P, k] = aB(this.options, e, s);
			s > S && (s = aB(this.options, x, Math.min(k, x), P)[1]), this.isDone && s < S + (T + 1) * (x + A) - A && this.newFinished(), this.scrollTimeline ? this.detachScroll = w.attachTimeline(this.scrollTimeline) : (w.speed = this.playbackSpeed, this.isPaused && w.pause(), s && (w.time = s)), this.repeatIndex = this.currentRepeat(), this.prevTime = s || -1, this.watch()
		}
		toSequence(t) {
			return this.entries.map(({
				item: e,
				at: i,
				marker: s
			}) => {
				let n, r;
				return s ? (t.set(s.name, s), aI(s.name, i)) : e instanceof aW ? {
					sequence: e.toSequence(t),
					at: i
				} : "string" == typeof e ? aI(e, i) : void 0 === i ? e : Array.isArray(e) ? (r = "function" == typeof(n = [...e])[0] ? Math.max(1, n.length - 1) : 2, n[r] = {
					...n[r],
					at: i
				}, n) : {
					...e,
					at: i
				}
			})
		}
		resolve(t) {
			return this.flush(), "number" == typeof t ? t : ay(t, this.labels) ?? this.time
		}
		currentRepeat() {
			return aB(this.options, this.totalDuration, this.clockAnimation?.time ?? 0)[0]
		}
		onClock(t) {
			let e = this.prevTime;
			if (this.prevTime = t, this.isRebuilding) return;
			let {
				onUpdate: i,
				onRepeat: s,
				repeatType: n = "loop"
			} = this.options;
			i?.(t);
			let r = this.currentRepeat(),
				a = r > this.repeatIndex ? 1 : -1;
			for (; r !== this.repeatIndex;) {
				let t = this.speed > 0 == ("loop" === n || !(this.repeatIndex % 2)),
					i = t ? this.totalDuration : 0;
				if (this.cross(e, i)) return;
				this.repeatIndex += a, s?.(), e = "loop" === n ? t ? -1 : 1 / 0 : i
			}
			this.cross(e, t)
		}
		cross(t, e) {
			if (t === e) return;
			let i = e > t,
				s = s => i ? s > t && s <= e : s < t && s >= e;
			for (let t of i ? this.markers : [...this.markers].reverse())
				if (s(t.time) && (t.callback?.(i ? 1 : -1), t.pause)) return this.pauseAt(t.time);
			if (void 0 !== this.stopAt && s(this.stopAt)) return this.pauseAt(this.stopAt), this.stopAt = void 0, !0
		}
		pauseAt(t) {
			return this.pause(), this.time = aB(this.options, this.totalDuration, t, this.repeatIndex)[1], !0
		}
		watch() {
			let t = this.group;
			t.finished.then(() => {
				if (t !== this.group || this.isDone) return;
				this.isDone = !0;
				let {
					onComplete: e,
					onReverseComplete: i
				} = this.options, s = this.speed < 0 && i || e, n = this.resolveFinished;
				s?.(), n()
			})
		}
		newFinished() {
			this.isDone = !1, this.finished = new Promise(t => {
				this.resolveFinished = t
			});
			let {
				scope: t
			} = this.options, e = this.motionScope?.add(() => {
				this.isKilled = !0, this.stop()
			});
			t?.animations.push(this), this.finished.then(() => {
				e?.(), t && tQ(t.animations, this)
			})
		}
	}
	t.s(["f", 0, function() {
		var t;
		let e = iT(() => ({
				current: null,
				animations: []
			})),
			i = function() {
				let t = function() {
						eT.current || eP();
						let [t] = (0, is.useState)(eS.current);
						return t
					}(),
					{
						reducedMotion: e
					} = (0, is.useContext)(id);
				return "never" !== e && ("always" === e || t)
			}() ?? void 0,
			{
				skipAnimations: s
			} = (0, is.useContext)(id);
		e.reduceMotion = i, e.skipAnimations = s;
		let n = (0, is.useMemo)(() => (function(t = {}) {
			let {
				scope: e,
				reduceMotion: i,
				skipAnimations: s
			} = t;
			return function(t, n, r) {
				let a, o = nd.current?.transition,
					l = {};
				if (void 0 !== i && (l.reduceMotion = i), void 0 !== s && (l.skipAnimations = s), Array.isArray(t) && t.some(t => Array.isArray(t) || t?.sequence)) {
					let s = {
						...l,
						...n,
						scope: e
					};
					o && (s.defaultTransition = {
						...o,
						...s.defaultTransition
					}), s.reduceMotion = n?.reduceMotion ?? s.defaultTransition?.reduceMotion ?? i, a = new aW(t, s)
				} else {
					let {
						onComplete: i,
						...s
					} = r || {}, h = {
						...l,
						...o,
						...s
					}, {
						onUpdate: u
					} = s;
					a = new aW(["number" == typeof t || "string" == typeof t && ("string" == typeof n || Array.isArray(n)) ? [u || (() => {}), Array.isArray(n) ? n : [t, n], {
						...h,
						onUpdate: void 0
					}] : [t, n, h]], {
						...l,
						onComplete: i,
						scope: e
					}, aN(t, n, h, e))
				}
				return a
			}
		})({
			scope: e,
			reduceMotion: i,
			skipAnimations: s
		}), [e, i, s]);
		return t = () => {
			e.animations.forEach(t => t.stop()), e.animations.length = 0
		}, (0, is.useEffect)(() => () => t(), []), [e, n]
	}], 810647)
}]);