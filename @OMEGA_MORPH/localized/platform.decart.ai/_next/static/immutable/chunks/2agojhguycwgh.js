(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 785865, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(633627),
		i = e.i(987873),
		n = e.i(170380),
		a = e.i(322932),
		o = e.i(480847),
		s = e.i(155990),
		c = e.i(169497),
		l = e.i(425720),
		d = e.i(743652),
		u = e.i(582018),
		m = e.i(120599),
		f = e.i(410740);

	function h(e, t) {
		return new Date(t.updatedAt).getTime() - new Date(e.updatedAt).getTime()
	}

	function g(e) {
		return !!e.prompt
	}
	var p = e.i(638644),
		v = e.i(528506),
		b = e.i(818036),
		x = e.i(745889),
		w = e.i(252376);
	let y = "Authentication failed. Your session key may have expired. Please try again.";

	function R(e, t = 30) {
		return "number" == typeof e ? e : e.ideal ?? e.max ?? e.exact ?? e.min ?? t
	}

	function k(e, t, r) {
		let i = e && "string" == typeof e && e.length > 0,
			n = r.width,
			a = r.height;
		return {
			...t && {
				facingMode: t
			},
			...i && {
				deviceId: {
					exact: e
				}
			},
			...r.fps && {
				frameRate: {
					ideal: R(r.fps)
				}
			},
			...r.width && {
				width: {
					ideal: n
				}
			},
			...r.height && {
				height: {
					ideal: a
				}
			}
		}
	}
	var j = e.i(962858);
	let S = "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
		C = "video/mp4;codecs=avc1.42E01E",
		T = "video/webm;codecs=vp9",
		N = "video/webm",
		L = "video/mp4";

	function M(e) {
		return Math.max(2, 2 * Math.round(e / 2))
	}

	function E(e, t, r, i, n) {
		let a, o, s, c = (a = Math.min(n.width / r, n.height / i), o = r * a, s = i * a, {
			x: (n.width - o) / 2,
			y: (n.height - s) / 2,
			width: o,
			height: s
		});
		e.fillStyle = "#000", e.fillRect(0, 0, n.width, n.height), e.drawImage(t, c.x, c.y, c.width, c.height)
	}

	function A(e) {
		let t = e.srcObject;
		return t instanceof MediaStream ? t : null
	}
	var D = e.i(196695);

	function z(e) {
		if (!e) return !1;
		let t = e.toLowerCase();
		return t.includes("back") || t.includes("rear") || t.includes("environment")
	}

	function I(e) {
		return e ? z(e) ? "environment" : ! function(e) {
			if (!e) return !1;
			let t = e.toLowerCase();
			return t.includes("front") || t.includes("user")
		}(e) ? null : "user" : null
	}
	var U = e.i(618600),
		F = e.i(266048),
		P = e.i(954716),
		B = e.i(505932),
		O = e.i(329474),
		_ = e.i(253662),
		W = e.i(55e3);
	let q = {
		name: "switch-camera",
		size: 24,
		node: [
			["path", {
				d: "M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5",
				key: "mtk2lu"
			}],
			["path", {
				d: "M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5",
				key: "120jsl"
			}],
			["circle", {
				cx: "12",
				cy: "12",
				r: "3",
				key: "1v7zrd"
			}],
			["path", {
				d: "m18 22-3-3 3-3",
				key: "kgdoj7"
			}],
			["path", {
				d: "m6 2 3 3-3 3",
				key: "1fnbkv"
			}]
		]
	};
	q.node;
	let V = (0, W.f)(q),
		G = {
			name: "upload",
			size: 24,
			node: [
				["path", {
					d: "M12 3v12",
					key: "1x0j5s"
				}],
				["path", {
					d: "m17 8-5-5-5 5",
					key: "7q97r8"
				}],
				["path", {
					d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
					key: "ih7n3h"
				}]
			]
		};
	G.node;
	let H = (0, W.f)(G);
	var Y = e.i(8774),
		$ = e.i(683225);
	let K = ["video/mp4", "video/webm", "video/quicktime"],
		X = ".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime";

	function J(e) {
		return K.includes(e.type) ? e.size > 524288e3 ? "Video file is too large. Please upload a file smaller than 500MB." : null : "Please upload a valid video file (MP4, WebM, or MOV)"
	}

	function Q(e) {
		let r, i, o, s, c, l, d, m, f, h, g, p, v, x, w, y, R = (0, u.c)(33),
			{
				onSelectSource: k,
				onSwitchCamera: j,
				label: S,
				className: C,
				align: T
			} = e,
			N = void 0 === S ? "Change input" : S,
			L = void 0 === T ? "start" : T,
			M = (0, n.useRef)(null);
		R[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, b.G)(), R[0] = r) : r = R[0];
		let E = r;
		R[1] !== k ? (i = e => {
			let t = e.target.files?.[0];
			if (t) {
				let e = J(t);
				e ? a.c.error(e) : k("upload", t)
			}
			e.target.value = ""
		}, R[1] = k, R[2] = i) : i = R[2];
		let A = i;
		return R[3] !== C ? (o = (0, b.c)("size-7 md:h-8 md:w-auto md:gap-1 md:px-3", C), R[3] = C, R[4] = o) : o = R[4], R[5] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)(V, {
			className: "size-3.5 md:hidden"
		}), R[5] = s) : s = R[5], R[6] !== N ? (c = (0, t.jsx)("span", {
			className: "hidden md:inline",
			children: N
		}), R[6] = N, R[7] = c) : c = R[7], R[8] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)(O.f, {
			className: "hidden size-3 md:inline"
		}), R[8] = l) : l = R[8], R[9] !== N || R[10] !== o || R[11] !== c ? (d = (0, t.jsx)($.X, {
			asChild: !0,
			children: (0, t.jsxs)(Y.f, {
				variant: "secondary",
				size: "icon",
				"aria-label": N,
				className: o,
				children: [s, c, l]
			})
		}), R[9] = N, R[10] = o, R[11] = c, R[12] = d) : d = R[12], R[13] !== k ? (m = () => k("camera"), R[13] = k, R[14] = m) : m = R[14], R[15] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, t.jsx)(B.f, {
			className: "mr-2 size-4"
		}), R[15] = f) : f = R[15], R[16] !== m ? (h = (0, t.jsxs)($.r, {
			onClick: m,
			children: [f, "Camera"]
		}), R[16] = m, R[17] = h) : h = R[17], R[18] === Symbol.for("react.memo_cache_sentinel") ? (g = !E && (0, t.jsxs)($.r, {
			onClick: () => M.current?.click(),
			children: [(0, t.jsx)(H, {
				className: "mr-2 size-4"
			}), "Upload video"]
		}), R[18] = g) : g = R[18], R[19] !== j ? (p = j && (0, t.jsxs)($.r, {
			onClick: j,
			children: [(0, t.jsx)(_.f, {
				className: "mr-2 size-4"
			}), "Switch camera"]
		}), R[19] = j, R[20] = p) : p = R[20], R[21] !== L || R[22] !== h || R[23] !== p ? (v = (0, t.jsxs)($.L, {
			align: L,
			children: [h, g, p]
		}), R[21] = L, R[22] = h, R[23] = p, R[24] = v) : v = R[24], R[25] !== v || R[26] !== d ? (x = (0, t.jsxs)($.G, {
			children: [d, v]
		}), R[25] = v, R[26] = d, R[27] = x) : x = R[27], R[28] !== A ? (w = !E && (0, t.jsx)("input", {
			ref: M,
			type: "file",
			accept: X,
			onChange: A,
			className: "hidden"
		}), R[28] = A, R[29] = w) : w = R[29], R[30] !== x || R[31] !== w ? (y = (0, t.jsxs)(t.Fragment, {
			children: [x, w]
		}), R[30] = x, R[31] = w, R[32] = y) : y = R[32], y
	}
	var Z = e.i(253149),
		ee = e.i(546009);
	let et = "bg-black/40 text-white backdrop-blur-md hover:bg-black/60 hover:text-white",
		er = `${et} size-8 rounded-full`,
		ei = `${et} h-8 gap-1.5 rounded-full px-3 text-xs`,
		en = ["h-1", "h-1.5", "h-2", "h-2.5"],
		ea = {
			label: "Reconnecting…",
			detail: "Connection lost. The stream will resume once it's back.",
			bars: null,
			tone: "text-white"
		},
		eo = {
			poor: {
				label: "Unstable connection",
				bars: 2,
				tone: "text-amber-400"
			},
			critical: {
				label: "Poor connection",
				bars: 1,
				tone: "text-destructive"
			}
		},
		es = {
			bandwidth: "Your upload is too slow to send video smoothly. Pause other uploads or move closer to your router.",
			latency: "The output is lagging behind your input. A wired connection or stronger Wi-Fi will help.",
			loss: "Video is getting lost on the way, so the output may stutter or blur. Try a wired connection or stronger Wi-Fi.",
			stall: "The output is choppy. Close other apps or tabs that use your network or CPU.",
			cpu: "Your connection is struggling to keep up with the model.",
			none: "Your connection is struggling to keep up with the model."
		};

	function ec(e) {
		let r, i, a, o, s = (0, u.c)(11),
			{
				report: c,
				reconnecting: l
			} = e,
			d = function(e) {
				let t, r, i = (0, u.c)(3),
					[a, o] = (0, n.useState)(!1);
				return i[0] !== e ? (t = () => {
					if (o(!1), e) return;
					let t = setTimeout(() => o(!0), 1e4);
					return () => clearTimeout(t)
				}, r = [e], i[0] = e, i[1] = t, i[2] = r) : (t = i[1], r = i[2]), (0, n.useEffect)(t, r), a
			}(l);
		if (s[0] !== l || s[1] !== c || s[2] !== d) r = l ? ea : d && c && !c.warmingUp && ("poor" === c.quality || "critical" === c.quality) ? {
			...eo[c.quality],
			detail: es[c.limitingFactor]
		} : null, s[0] = l, s[1] = c, s[2] = d, s[3] = r;
		else r = s[3];
		let m = r,
			f = m ? `${m.label} ${m.detail}` : "";
		return s[4] !== f ? (i = (0, t.jsx)("span", {
			role: "status",
			className: "sr-only",
			children: f
		}), s[4] = f, s[5] = i) : i = s[5], s[6] !== m ? (a = m && (0, t.jsx)(el, {
			notice: m
		}, m.label), s[6] = m, s[7] = a) : a = s[7], s[8] !== i || s[9] !== a ? (o = (0, t.jsxs)(t.Fragment, {
			children: [i, a]
		}), s[8] = i, s[9] = a, s[10] = o) : o = s[10], o
	}

	function el(e) {
		let r, i, a, o, s, c, l, d, m, f, h, g, p, v = (0, u.c)(30),
			{
				notice: x
			} = e,
			{
				label: w,
				detail: y,
				bars: R,
				tone: k
			} = x,
			[j, S] = (0, n.useState)(!0);
		v[0] !== R || v[1] !== j ? (r = () => {
			if (!j || null === R) return;
			let e = setTimeout(() => S(!1), 6e3);
			return () => clearTimeout(e)
		}, i = [j, R], v[0] = R, v[1] = j, v[2] = r, v[3] = i) : (r = v[2], i = v[3]), (0, n.useEffect)(r, i), v[4] === Symbol.for("react.memo_cache_sentinel") ? (a = () => S(!0), o = (0, b.c)(ei, "min-w-8 animate-in gap-0 px-2.5 fade-in-0 zoom-in-95"), v[4] = a, v[5] = o) : (a = v[4], o = v[5]), v[6] !== R ? (s = null === R ? (0, t.jsx)(Z.f, {
			className: "size-3 animate-spin"
		}) : (0, t.jsx)("span", {
			"aria-hidden": !0,
			className: "flex h-2.5 items-end gap-px",
			children: en.map((e, r) => (0, t.jsx)("span", {
				className: (0, b.c)("w-0.5 rounded-full", e, r < R ? "bg-current" : "bg-white/30")
			}, e))
		}), v[6] = R, v[7] = s) : s = v[7], v[8] !== s || v[9] !== k ? (c = (0, t.jsx)("span", {
			className: k,
			children: s
		}), v[8] = s, v[9] = k, v[10] = c) : c = v[10];
		let C = j ? "max-w-40 pl-1.5 opacity-100" : "max-w-0 opacity-0";
		return v[11] !== C ? (l = (0, b.c)("overflow-hidden transition-all duration-200", C), v[11] = C, v[12] = l) : l = v[12], v[13] !== w || v[14] !== l ? (d = (0, t.jsx)("span", {
			className: l,
			children: w
		}), v[13] = w, v[14] = l, v[15] = d) : d = v[15], v[16] !== w || v[17] !== c || v[18] !== d ? (m = (0, t.jsx)(ee.y, {
			asChild: !0,
			children: (0, t.jsxs)(Y.f, {
				variant: "secondary",
				"aria-label": w,
				onClick: a,
				className: o,
				children: [c, d]
			})
		}), v[16] = w, v[17] = c, v[18] = d, v[19] = m) : m = v[19], v[20] !== w ? (f = (0, t.jsx)("p", {
			className: "font-medium",
			children: w
		}), v[20] = w, v[21] = f) : f = v[21], v[22] !== y ? (h = (0, t.jsx)("p", {
			className: "text-background/70",
			children: y
		}), v[22] = y, v[23] = h) : h = v[23], v[24] !== f || v[25] !== h ? (g = (0, t.jsxs)(ee.Y, {
			side: "bottom",
			align: "start",
			className: "max-w-64",
			children: [f, h]
		}), v[24] = f, v[25] = h, v[26] = g) : g = v[26], v[27] !== m || v[28] !== g ? (p = (0, t.jsxs)(ee.W, {
			children: [m, g]
		}), v[27] = m, v[28] = g, v[29] = p) : p = v[29], p
	}
	var ed = e.i(782241);

	function eu(e) {
		let r, i, a, o, s, c, l, d, m, f, h, g = (0, u.c)(32),
			{
				checked: p,
				onCheckedChange: v,
				costMultiplier: x,
				disabled: y,
				disabledReason: R
			} = e,
			k = void 0 !== y && y,
			j = void 0 === R ? "Disconnect to change speed" : R,
			S = (0, n.useId)();
		g[0] !== x ? (r = (0, w.Z)(x), g[0] = x, g[1] = r) : r = g[1];
		let C = r,
			T = k && "cursor-not-allowed";
		g[2] !== T ? (i = (0, b.c)("flex shrink-0 items-center gap-1.5", T), g[2] = T, g[3] = i) : i = g[3], g[4] !== v ? (a = e => v(!0 === e), g[4] = v, g[5] = a) : a = g[5];
		let N = C ? `${S}-hint` : void 0;
		g[6] !== p || g[7] !== k || g[8] !== S || g[9] !== a || g[10] !== N ? (o = (0, t.jsx)(ed.f, {
			id: S,
			checked: p,
			onCheckedChange: a,
			disabled: k,
			"aria-describedby": N,
			className: "size-3.5"
		}), g[6] = p, g[7] = k, g[8] = S, g[9] = a, g[10] = N, g[11] = o) : o = g[11];
		let L = k ? "cursor-not-allowed" : "cursor-pointer";
		g[12] !== L ? (s = (0, b.c)("text-xs text-muted-foreground", L), g[12] = L, g[13] = s) : s = g[13], g[14] !== S || g[15] !== s ? (c = (0, t.jsx)("label", {
			htmlFor: S,
			className: s,
			children: "Fast mode"
		}), g[14] = S, g[15] = s, g[16] = c) : c = g[16], g[17] !== C || g[18] !== S ? (l = C && (0, t.jsx)("span", {
			id: `${S}-hint`,
			className: "text-xs text-muted-foreground/70",
			children: C
		}), g[17] = C, g[18] = S, g[19] = l) : l = g[19], g[20] !== c || g[21] !== l || g[22] !== i || g[23] !== o ? (d = (0, t.jsxs)("div", {
			className: i,
			children: [o, c, l]
		}), g[20] = c, g[21] = l, g[22] = i, g[23] = o, g[24] = d) : d = g[24];
		let M = d;
		return k ? (g[25] !== M ? (m = (0, t.jsx)(ee.y, {
			asChild: !0,
			children: M
		}), g[25] = M, g[26] = m) : m = g[26], g[27] !== j ? (f = (0, t.jsx)(ee.Y, {
			side: "top",
			children: j
		}), g[27] = j, g[28] = f) : f = g[28], g[29] !== m || g[30] !== f ? (h = (0, t.jsxs)(ee.W, {
			children: [m, f]
		}), g[29] = m, g[30] = f, g[31] = h) : h = g[31], h) : M
	}
	var em = e.i(480381);

	function ef(e) {
		let r, i, a, o, s, c, l, d, m, f = (0, u.c)(19),
			{
				open: h,
				onStayActive: g,
				onDisconnect: p
			} = e,
			[v, b] = (0, n.useState)(30);
		return f[0] !== h ? (r = () => {
			h && b(30)
		}, i = [h], f[0] = h, f[1] = r, f[2] = i) : (r = f[1], i = f[2]), (0, n.useEffect)(r, i), f[3] !== v || f[4] !== p || f[5] !== h ? (a = () => {
			if (!h) return;
			if (v <= 0) return void p();
			let e = setTimeout(() => {
				b(eh)
			}, 1e3);
			return () => clearTimeout(e)
		}, o = [h, v, p], f[3] = v, f[4] = p, f[5] = h, f[6] = a, f[7] = o) : (a = f[6], o = f[7]), (0, n.useEffect)(a, o), f[8] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)(em.F, {
			children: "Are you still there?"
		}), f[8] = s) : s = f[8], f[9] !== v ? (c = (0, t.jsxs)(em.s, {
			children: [s, (0, t.jsxs)(em.C, {
				children: ["Your session will disconnect in ", (0, t.jsx)("span", {
					className: "font-semibold",
					children: v
				}), " seconds due to inactivity. This helps prevent unnecessary credit usage."]
			})]
		}), f[9] = v, f[10] = c) : c = f[10], f[11] !== g ? (l = (0, t.jsx)(em.c, {
			children: (0, t.jsx)(Y.f, {
				onClick: g,
				className: "w-full sm:w-auto",
				children: "Yes, I'm here"
			})
		}), f[11] = g, f[12] = l) : l = f[12], f[13] !== c || f[14] !== l ? (d = (0, t.jsxs)(em.d, {
			showCloseButton: !1,
			children: [c, l]
		}), f[13] = c, f[14] = l, f[15] = d) : d = f[15], f[16] !== h || f[17] !== d ? (m = (0, t.jsx)(em.N, {
			open: h,
			children: d
		}), f[16] = h, f[17] = d, f[18] = m) : m = f[18], m
	}

	function eh(e) {
		return e - 1
	}
	let eg = "h-10 gap-1 rounded-full bg-background px-4 text-sm hover:bg-secondary has-[>svg]:px-4",
		ep = {
			lucy: ["../../../../models/realtime-examples/lucy/01-warm-white-wall.mp4", "../../../../models/realtime-examples/lucy/02-window-shadow.mp4", "../../../../models/realtime-examples/lucy/03-bare-desk.mp4"],
			"lucy-restyle": ["../../../../models/realtime-examples/lucy-restyle/01-podcast-mic.mp4", "../../../../models/realtime-examples/lucy-restyle/02-home-office-webcam.mp4", "../../../../models/realtime-examples/lucy-restyle/03-founder-pitch.mp4"],
			"lucy-vton": ["../../../../models/realtime-examples/lucy-vton/01-model.mp4", "../../../../models/realtime-examples/lucy-vton/02-lecturer.mp4", "../../../../models/realtime-examples/lucy-vton/03-home.mp4"]
		};

	function ev({
		onSelectSource: e,
		family: r,
		onOpenCamera: i
	}) {
		let o = ep[r ?? "lucy"],
			s = (0, n.useRef)(null),
			[l, d] = (0, n.useState)(null),
			{
				isLoading: u,
				isAuthenticated: m,
				checkAuth: f
			} = (0, c.f)(),
			h = (0, b.G)(),
			g = !u && m(),
			p = async t => {
				try {
					d(t);
					let r = await fetch(t),
						i = await r.blob(),
						n = t.split("/").pop() || "example.mp4",
						a = new File([i], n, {
							type: "video/mp4"
						});
					e("example_asset", a)
				} catch (e) {
					console.error("Failed to load example asset:", e), a.c.error("Failed to load example video. Please try another.")
				} finally {
					d(null)
				}
			};
		return (0, t.jsxs)("div", {
			className: "flex w-full max-w-sm flex-col items-center justify-center gap-10.5 sm:w-auto sm:max-w-md lg:max-w-lg",
			children: [(0, t.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-4",
				children: [(0, t.jsxs)("p", {
					className: "text-foreground text-xs sm:text-sm",
					children: ["Select video input", (0, t.jsx)("span", {
						className: "text-accent",
						children: "*"
					})]
				}), (0, t.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center gap-2",
					children: [(0, t.jsxs)(Y.f, {
						variant: "tertiary",
						disabled: u,
						onClick: i,
						className: eg,
						children: [(0, t.jsx)(B.f, {
							className: "size-4"
						}), "Open camera"]
					}), !h && (0, t.jsxs)(t.Fragment, {
						children: [(0, t.jsxs)(Y.f, {
							variant: "tertiary",
							disabled: u,
							onClick: () => {
								g ? s.current?.click() : f()
							},
							className: eg,
							children: [(0, t.jsx)(H, {
								className: "size-4"
							}), "Upload video"]
						}), (0, t.jsx)("input", {
							ref: s,
							type: "file",
							accept: X,
							onChange: t => {
								let r = t.target.files?.[0];
								if (r) {
									let t = J(r);
									t ? a.c.error(t) : e("upload", r)
								}
								t.target.value = ""
							},
							className: "hidden"
						})]
					})]
				})]
			}), !h && (0, t.jsxs)("div", {
				className: "flex w-full flex-col items-center gap-4",
				children: [(0, t.jsxs)("div", {
					className: "flex w-full items-center gap-3",
					children: [(0, t.jsx)("div", {
						className: "h-px flex-1 bg-border"
					}), (0, t.jsx)("p", {
						className: "whitespace-nowrap text-muted-foreground text-xs",
						children: "or start with asset"
					}), (0, t.jsx)("div", {
						className: "h-px flex-1 bg-border"
					})]
				}), (0, t.jsx)("div", {
					className: "flex w-full items-center justify-center gap-2",
					children: o.map(e => (0, t.jsx)("button", {
						type: "button",
						onClick: () => {
							g ? p(e) : f()
						},
						disabled: u || null !== l,
						className: "group relative aspect-[9/5] min-w-0 flex-1 overflow-hidden rounded-sm bg-card transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-15 sm:flex-none",
						children: l === e ? (0, t.jsx)("div", {
							className: "flex h-full items-center justify-center",
							children: (0, t.jsx)("div", {
								className: "size-4 animate-spin rounded-full border-2 border-accent border-t-transparent"
							})
						}) : (0, t.jsx)("video", {
							src: e,
							muted: !0,
							playsInline: !0,
							loop: !0,
							className: "size-full object-cover",
							onMouseEnter: e => e.currentTarget.play(),
							onMouseLeave: e => {
								e.currentTarget.pause(), e.currentTarget.currentTime = 0
							}
						})
					}, e))
				})]
			})]
		})
	}
	var eb = e.i(267729),
		ex = e.i(189478),
		ew = e.i(293819),
		ey = e.i(232250),
		eR = e.i(221751);
	let ek = e => e.image ?? e.icon;

	function ej(e) {
		let r, i, n, a, o, s, c, l, d, m = (0, u.c)(43),
			{
				presets: f,
				onSelect: h,
				selectedPreset: g,
				disabled: p,
				label: x,
				scrollable: w,
				compact: y,
				className: R,
				modelName: k,
				phase: j,
				moreHref: S,
				moreLabel: C
			} = e,
			T = void 0 !== p && p,
			N = void 0 !== w && w,
			L = void 0 !== y && y,
			M = g?.id ?? null;
		if (m[0] !== R || m[1] !== L || m[2] !== T || m[3] !== x || m[4] !== k || m[5] !== h || m[6] !== j || m[7] !== f || m[8] !== N || m[9] !== M) {
			let e;
			r = f.some(ek), m[16] !== k || m[17] !== h || m[18] !== j ? (e = e => {
				k && v.f.trackRealtimeSuggestionClicked({
					modelName: k,
					suggestionLabel: e.label,
					phase: j,
					source: e.source,
					presetId: e.id
				}), h(e)
			}, m[16] = k, m[17] = h, m[18] = j, m[19] = e) : e = m[19];
			let c = e,
				l = L ? "py-1.5 px-2" : "py-3 sm:py-4 lg:py-5";
			m[20] !== R || m[21] !== l ? (o = (0, b.c)("flex flex-col gap-2 w-full items-center", l, R), m[20] = R, m[21] = l, m[22] = o) : o = m[22], m[23] !== x ? (s = x && (0, t.jsx)(ey.f, {
				className: "text-center",
				children: x
			}), m[23] = x, m[24] = s) : s = m[24];
			let d = N ? "flex-nowrap overflow-x-auto w-full justify-center-safe scrollbar-hide" : "flex-wrap justify-center";
			m[25] !== d ? (i = (0, b.c)("flex gap-1.5 sm:gap-2 max-w-6xl", d), m[25] = d, m[26] = i) : i = m[26], m[27] !== N ? (n = N ? {
				WebkitOverflowScrolling: "touch"
			} : void 0, m[27] = N, m[28] = n) : n = m[28], a = f.map(e => {
				let i = M === e.id,
					n = ek(e);
				return (0, t.jsxs)(Y.f, {
					variant: "outline",
					size: L ? "lg" : "sm",
					onClick: () => c(e),
					disabled: T,
					className: (0, b.c)("gap-2 font-medium", r ? "h-auto rounded-lg py-1 pr-3 text-xs lg:text-sm" : L ? "rounded-md px-2 py-1" : "rounded-lg px-3 py-2 text-xs lg:text-sm", r && (n ? "pl-1" : "pl-3"), i ? "border-accent! bg-background! text-foreground!" : "border-border! bg-background! text-muted-foreground!"),
					children: [n && (0, t.jsx)(ex.default, {
						src: n,
						alt: "",
						width: 32,
						height: 32,
						unoptimized: (0, eR.A)(n),
						className: "size-7 lg:size-8 shrink-0 rounded object-cover"
					}), e.label]
				}, e.id)
			}), m[0] = R, m[1] = L, m[2] = T, m[3] = x, m[4] = k, m[5] = h, m[6] = j, m[7] = f, m[8] = N, m[9] = M, m[10] = r, m[11] = i, m[12] = n, m[13] = a, m[14] = o, m[15] = s
		} else r = m[10], i = m[11], n = m[12], a = m[13], o = m[14], s = m[15];
		return m[29] !== r || m[30] !== L || m[31] !== S || m[32] !== C ? (c = S && (0, t.jsx)(Y.f, {
			asChild: !0,
			variant: "ghost",
			size: L ? "lg" : "sm",
			className: (0, b.c)("shrink-0 gap-1 text-xs text-muted-foreground lg:text-sm", r ? "h-auto self-stretch rounded-lg px-3" : L ? "rounded-md" : "rounded-lg"),
			children: (0, t.jsxs)(ew.default, {
				href: S,
				children: [C ?? "See all", (0, t.jsx)(eb.f, {
					className: "size-3.5"
				})]
			})
		}), m[29] = r, m[30] = L, m[31] = S, m[32] = C, m[33] = c) : c = m[33], m[34] !== i || m[35] !== n || m[36] !== a || m[37] !== c ? (l = (0, t.jsxs)("div", {
			className: i,
			style: n,
			children: [a, c]
		}), m[34] = i, m[35] = n, m[36] = a, m[37] = c, m[38] = l) : l = m[38], m[39] !== l || m[40] !== o || m[41] !== s ? (d = (0, t.jsxs)("div", {
			className: o,
			children: [s, l]
		}), m[39] = l, m[40] = o, m[41] = s, m[42] = d) : d = m[42], d
	}
	var eS = e.i(115791);
	let eC = {
		name: "image-plus",
		size: 24,
		node: [
			["path", {
				d: "M16 5h6",
				key: "1vod17"
			}],
			["path", {
				d: "M19 2v6",
				key: "4bpg5p"
			}],
			["path", {
				d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",
				key: "1ue2ih"
			}],
			["path", {
				d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
				key: "1xmnt7"
			}],
			["circle", {
				cx: "9",
				cy: "9",
				r: "2",
				key: "af1f0g"
			}]
		]
	};
	eC.node;
	let eT = (0, W.f)(eC);
	var eN = e.i(833821),
		eL = e.i(326383),
		eM = e.i(678405),
		eE = e.i(904102);

	function eA(e) {
		let r, i, a, o, s, l, d, m, f, h, g, p, x, w, y, R, k, j, S, C, T, N, L, M = (0, u.c)(122),
			{
				value: E,
				onChange: A,
				onSubmit: D,
				disabled: z,
				placeholder: I,
				modelName: U,
				referenceImage: F,
				onImageSelect: P,
				onImageClear: B,
				onImageSubmit: O,
				showImageReference: _,
				allowPromptWithImage: W,
				isSending: q,
				allowToggleEnhance: V,
				enhancePrompt: G,
				onToggleEnhance: H,
				sessionControls: $,
				onSaveAsPreset: K,
				submitBlockedReason: X,
				onDraftChange: J,
				compact: Q
			} = e,
			et = void 0 !== z && z,
			er = void 0 === I ? "Describe the style (e.g. Cyberpunk city)" : I,
			ei = void 0 === U ? "Lucy Restyle Live" : U,
			en = void 0 !== _ && _,
			ea = void 0 !== W && W,
			eo = void 0 !== q && q,
			es = void 0 !== V && V,
			ec = void 0 === G || G,
			el = void 0 !== Q && Q,
			eu = el ? "flex w-full flex-1 flex-col" : "flex flex-col gap-2 items-center py-2 w-full max-w-lg lg:max-w-xl xl:max-w-2xl px-4",
			[em, ef] = (0, n.useState)(E),
			eh = (0, n.useId)(),
			{
				isLoading: eg,
				isAuthenticated: ep,
				checkAuth: ev
			} = (0, c.f)(),
			eb = (0, n.useRef)(null);
		M[0] !== P ? (r = e => {
			let t = e.target.files?.[0];
			t && P && P(t), eb.current && (eb.current.value = "")
		}, M[0] = P, M[1] = r) : r = M[1];
		let ex = r;
		M[2] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
			eb.current?.click()
		}, M[2] = i) : i = M[2];
		let ew = i;
		if (M[3] !== J || M[4] !== E ? (a = () => {
				ef(E), J?.(E)
			}, M[3] = J, M[4] = E, M[5] = a) : a = M[5], M[6] !== E ? (o = [E], M[6] = E, M[7] = o) : o = M[7], (0, n.useEffect)(a, o), eg) {
			let e, r, i, n;
			if (el) {
				let e, r, i;
				return M[8] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(Y.f, {
					disabled: !0,
					size: "icon",
					className: "size-7 shrink-0 rounded-full bg-input",
					children: (0, t.jsx)(Z.f, {
						className: "size-4 animate-spin text-accent-foreground"
					})
				}), M[8] = e) : e = M[8], M[9] !== em || M[10] !== er ? (r = (0, t.jsx)(eE.z, {
					toolbarEnd: e,
					children: (0, t.jsx)("textarea", {
						rows: 1,
						disabled: !0,
						value: em,
						placeholder: er,
						className: "size-full resize-none border-none bg-transparent text-base text-foreground leading-snug tracking-[0.24px] outline-none placeholder:text-muted-foreground md:text-sm"
					})
				}), M[9] = em, M[10] = er, M[11] = r) : r = M[11], M[12] !== r || M[13] !== eu ? (i = (0, t.jsx)("div", {
					className: eu,
					children: r
				}), M[12] = r, M[13] = eu, M[14] = i) : i = M[14], i
			}
			return M[15] !== em || M[16] !== er ? (e = (0, t.jsx)("input", {
				type: "text",
				maxLength: 1e3,
				value: em,
				disabled: !0,
				placeholder: er,
				className: "bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground flex-1 py-3 px-0 pr-2 min-w-0"
			}), M[15] = em, M[16] = er, M[17] = e) : e = M[17], M[18] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)(Y.f, {
				disabled: !0,
				size: "icon",
				className: "size-[34px] rounded-sm shrink-0 bg-foreground",
				children: (0, t.jsx)(Z.f, {
					className: "size-4 text-background brightness-0 animate-spin"
				})
			}), M[18] = r) : r = M[18], M[19] !== e ? (i = (0, t.jsxs)("div", {
				className: "bg-card rounded-xl flex items-center justify-between px-3 py-1 w-full min-h-14",
				children: [e, r]
			}), M[19] = e, M[20] = i) : i = M[20], M[21] !== i || M[22] !== eu ? (n = (0, t.jsx)("div", {
				className: eu,
				children: i
			}), M[21] = i, M[22] = eu, M[23] = n) : n = M[23], n
		}
		M[24] !== ep ? (s = ep(), M[24] = ep, M[25] = s) : s = M[25];
		let ey = s;
		M[26] !== et || M[27] !== em || M[28] !== F || M[29] !== X ? (l = (em.trim().length > 0 || !!F) && !et && !X, M[26] = et, M[27] = em, M[28] = F, M[29] = X, M[30] = l) : l = M[30];
		let eR = l,
			ek = ey ? X : "Sign in to run";
		M[31] !== ea || M[32] !== eR || M[33] !== eo || M[34] !== em || M[35] !== ei || M[36] !== A || M[37] !== O || M[38] !== D || M[39] !== F ? (d = () => {
			eR && !eo && (ea ? (em.trim() && ei && v.f.trackRealtimePromptManual({
				modelName: ei,
				promptText: em.trim()
			}), A(em), F ? O?.(em) : D(em)) : F ? O?.() : (ei && v.f.trackRealtimePromptManual({
				modelName: ei,
				promptText: em.trim()
			}), A(em), D(em)))
		}, M[31] = ea, M[32] = eR, M[33] = eo, M[34] = em, M[35] = ei, M[36] = A, M[37] = O, M[38] = D, M[39] = F, M[40] = d) : d = M[40];
		let ej = d;
		M[41] !== A || M[42] !== J || M[43] !== X ? (m = e => {
			ef(e), J?.(e), X && A(e)
		}, M[41] = A, M[42] = J, M[43] = X, M[44] = m) : m = M[44];
		let eC = m;
		M[45] !== eR || M[46] !== ej || M[47] !== eo ? (f = e => {
			"Enter" !== e.key || e.shiftKey || (e.preventDefault(), eR && !eo && ej())
		}, M[45] = eR, M[46] = ej, M[47] = eo, M[48] = f) : f = M[48];
		let eA = f;
		M[49] !== H ? (h = () => H?.(), M[49] = H, M[50] = h) : h = M[50], M[51] !== eh || M[52] !== ec || M[53] !== h ? (g = (0, t.jsx)(ed.f, {
			id: eh,
			checked: ec,
			onCheckedChange: h,
			className: "size-3.5"
		}), M[51] = eh, M[52] = ec, M[53] = h, M[54] = g) : g = M[54];
		let eD = el ? "Enhance" : "Enhance prompt";
		M[55] !== eh || M[56] !== eD ? (p = (0, t.jsx)("label", {
			htmlFor: eh,
			className: "text-xs text-muted-foreground cursor-pointer",
			children: eD
		}), M[55] = eh, M[56] = eD, M[57] = p) : p = M[57], M[58] !== g || M[59] !== p ? (x = (0, t.jsxs)("div", {
			className: "flex shrink-0 items-center gap-1.5",
			children: [g, p]
		}), M[58] = g, M[59] = p, M[60] = x) : x = M[60];
		let ez = x;
		M[61] !== ex || M[62] !== en ? (w = en && (0, t.jsx)("input", {
			ref: eb,
			type: "file",
			accept: "image/jpeg,image/png,image/webp",
			onChange: ex,
			className: "hidden"
		}), M[61] = ex, M[62] = en, M[63] = w) : w = M[63], M[64] !== ea || M[65] !== es || M[66] !== el || M[67] !== ez || M[68] !== B || M[69] !== F || M[70] !== $ ? (y = !el && (es || $ || ea && F) && (0, t.jsxs)("div", {
			className: "flex items-center justify-between w-full",
			children: [ea && F ? (0, t.jsxs)("div", {
				className: "flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-lg w-fit min-w-0",
				children: [(0, t.jsx)(eT, {
					className: "size-4 text-muted-foreground shrink-0"
				}), (0, t.jsx)("span", {
					className: "text-sm text-foreground truncate max-w-48",
					children: F.name
				}), (0, t.jsx)("button", {
					type: "button",
					onClick: B,
					className: "shrink-0 p-0.5 rounded hover:bg-muted transition-colors",
					"aria-label": "Remove image",
					children: (0, t.jsx)(eL.X, {
						className: "size-4 text-muted-foreground"
					})
				})]
			}) : (0, t.jsx)("div", {}), (0, t.jsxs)("div", {
				className: "flex flex-wrap items-center justify-end gap-3",
				children: [$, es && !el && ez]
			})]
		}), M[64] = ea, M[65] = es, M[66] = el, M[67] = ez, M[68] = B, M[69] = F, M[70] = $, M[71] = y) : y = M[71], M[72] !== ea || M[73] !== el || M[74] !== et || M[75] !== eC || M[76] !== eA || M[77] !== em || M[78] !== B || M[79] !== er || M[80] !== F ? (R = !ea && F ? (0, t.jsxs)("div", {
			className: (0, b.c)("flex min-w-0 items-center gap-2", el ? "px-1 py-2" : "flex-1 py-3"),
			children: [(0, t.jsx)("span", {
				className: "truncate text-base text-foreground",
				children: F.name
			}), (0, t.jsx)("button", {
				type: "button",
				onClick: B,
				className: "shrink-0 rounded p-0.5 transition-colors hover:bg-muted",
				"aria-label": "Remove image",
				children: (0, t.jsx)(eL.X, {
					className: "size-4 text-muted-foreground"
				})
			})]
		}) : el ? (0, t.jsx)("textarea", {
			rows: 1,
			maxLength: 1e3,
			value: em,
			onChange: e => eC(e.target.value),
			onKeyDown: eA,
			disabled: et,
			placeholder: er,
			className: "size-full resize-none border-none bg-transparent text-base text-foreground leading-snug tracking-[0.24px] outline-none placeholder:text-muted-foreground md:text-sm"
		}) : (0, t.jsx)("input", {
			type: "text",
			maxLength: 1e3,
			value: em,
			onChange: e => eC(e.target.value),
			onKeyDown: eA,
			disabled: et,
			placeholder: er,
			className: "bg-transparent border-none outline-none text-[16px] text-foreground placeholder:text-muted-foreground flex-1 py-3 px-0 pr-2 min-w-0"
		}), M[72] = ea, M[73] = el, M[74] = et, M[75] = eC, M[76] = eA, M[77] = em, M[78] = B, M[79] = er, M[80] = F, M[81] = R) : R = M[81];
		let eI = R;
		M[82] !== em || M[83] !== F ? (k = 0 === em.trim().length && !F, M[82] = em, M[83] = F, M[84] = k) : k = M[84];
		let eU = k;
		M[85] !== el || M[86] !== em || M[87] !== eU || M[88] !== K ? (j = K && (el ? (0, t.jsx)(eE.y, {
			onClick: () => K(em),
			disabled: eU
		}) : (0, t.jsxs)(ee.W, {
			children: [(0, t.jsx)(ee.y, {
				asChild: !0,
				children: (0, t.jsx)(Y.f, {
					variant: "ghost",
					size: "icon",
					onClick: () => K(em),
					disabled: eU,
					className: "size-[34px] shrink-0 rounded-lg",
					"aria-label": "Save as preset",
					children: (0, t.jsx)(eS.f, {
						className: "size-4 text-muted-foreground"
					})
				})
			}), (0, t.jsx)(ee.Y, {
				side: "top",
				children: "Save as preset"
			})]
		})), M[85] = el, M[86] = em, M[87] = eU, M[88] = K, M[89] = j) : j = M[89];
		let eF = j;
		M[90] !== ea || M[91] !== el || M[92] !== et || M[93] !== B || M[94] !== F || M[95] !== en ? (S = en && (el ? (0, t.jsx)(eE.m, {
			icon: (0, t.jsx)(eT, {
				className: "size-4 text-muted-foreground"
			}),
			file: ea ? F : null,
			label: ea && F ? F.name : "Reference image",
			onClick: ew,
			onClear: ea && F ? B : void 0,
			disabled: et,
			className: "max-w-44"
		}) : (0, t.jsxs)(Y.f, {
			variant: "tertiary",
			size: "compact",
			onClick: ew,
			disabled: et,
			className: "gap-1.5 rounded-lg bg-background px-4 hover:bg-muted",
			children: [(0, t.jsx)(eT, {
				className: "size-4"
			}), (0, t.jsx)("span", {
				className: "font-medium text-muted-foreground text-xs",
				children: "Image reference"
			})]
		})), M[90] = ea, M[91] = el, M[92] = et, M[93] = B, M[94] = F, M[95] = en, M[96] = S) : S = M[96];
		let eP = S;
		M[97] !== ev || M[98] !== ej || M[99] !== ey ? (C = () => {
			ey ? ej() : ev()
		}, M[97] = ev, M[98] = ej, M[99] = ey, M[100] = C) : C = M[100];
		let eB = C;
		M[101] !== eR || M[102] !== el || M[103] !== eB || M[104] !== eo || M[105] !== ey || M[106] !== ek ? (T = el ? (0, t.jsx)(eE.c, {
			onClick: eB,
			disabled: !eR || eo,
			isBusy: eo,
			isAuthenticated: ey,
			hint: ek,
			label: "Send prompt"
		}) : (0, t.jsxs)(ee.W, {
			children: [(0, t.jsx)(ee.y, {
				asChild: !0,
				children: (0, t.jsx)("span", {
					className: "inline-flex",
					children: (0, t.jsx)(Y.f, {
						onClick: eB,
						disabled: !!ey && (!eR || eo),
						size: "icon",
						className: (0, b.c)("size-[34px] shrink-0 rounded-lg", ey && (!eR || eo) ? "bg-foreground" : "bg-accent hover:bg-accent/90"),
						children: ey ? eo ? (0, t.jsx)(Z.f, {
							className: "size-4 text-background animate-spin"
						}) : (0, t.jsx)(eM.f, {
							className: (0, b.c)("size-4", eR ? "text-accent-foreground" : "text-background")
						}) : (0, t.jsx)(eN.f, {
							className: "size-4 text-accent-foreground"
						})
					})
				})
			}), ek && (0, t.jsx)(ee.Y, {
				side: "top",
				children: ek
			})]
		}), M[101] = eR, M[102] = el, M[103] = eB, M[104] = eo, M[105] = ey, M[106] = ek, M[107] = T) : T = M[107];
		let eO = T;
		M[108] !== es || M[109] !== el || M[110] !== ez || M[111] !== eP || M[112] !== eI || M[113] !== eF || M[114] !== $ || M[115] !== eO ? (N = el ? (0, t.jsx)(eE.z, {
			toolbarStart: (0, t.jsxs)(t.Fragment, {
				children: [eP, es && ez, $]
			}),
			toolbarEnd: (0, t.jsxs)(t.Fragment, {
				children: [eF, eO]
			}),
			children: eI
		}) : (0, t.jsxs)("div", {
			className: "bg-card rounded-xl flex items-center justify-between pl-3 pr-1 py-1 w-full min-h-14",
			children: [eI, (0, t.jsxs)("div", {
				className: "flex items-center gap-2 mr-1",
				children: [eF, eP, eO]
			})]
		}), M[108] = es, M[109] = el, M[110] = ez, M[111] = eP, M[112] = eI, M[113] = eF, M[114] = $, M[115] = eO, M[116] = N) : N = M[116];
		let e_ = N;
		return M[117] !== w || M[118] !== y || M[119] !== e_ || M[120] !== eu ? (L = (0, t.jsxs)("div", {
			className: eu,
			children: [w, y, e_]
		}), M[117] = w, M[118] = y, M[119] = e_, M[120] = eu, M[121] = L) : L = M[121], L
	}
	var eD = e.i(954033);

	function ez(e) {
		let r, i, n, a, o, s, c = (0, u.c)(11),
			{
				isConnected: l,
				hasRecording: d,
				onDownloadRecording: m,
				className: f
			} = e;
		return d && !l && m ? (c[0] !== f ? (r = (0, b.c)("flex items-center gap-2", f), c[0] = f, c[1] = r) : r = c[1], c[2] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(eD.f, {
			className: "size-3.5"
		}), c[2] = i) : i = c[2], c[3] !== m ? (n = (0, t.jsx)(ee.y, {
			asChild: !0,
			children: (0, t.jsxs)(Y.f, {
				onClick: m,
				variant: "secondary",
				size: "sm",
				"aria-label": "Download recording",
				className: "flex-1",
				children: [i, "Download recording"]
			})
		}), c[3] = m, c[4] = n) : n = c[4], c[5] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)(ee.Y, {
			side: "top",
			children: (0, t.jsx)("p", {
				children: "Download previous session recording"
			})
		}), c[5] = a) : a = c[5], c[6] !== n ? (o = (0, t.jsxs)(ee.W, {
			children: [n, a]
		}), c[6] = n, c[7] = o) : o = c[7], c[8] !== r || c[9] !== o ? (s = (0, t.jsx)("div", {
			className: r,
			children: o
		}), c[8] = r, c[9] = o, c[10] = s) : s = c[10], s) : null
	}
	let eI = {
		name: "expand",
		size: 24,
		node: [
			["path", {
				d: "m15 15 6 6",
				key: "1s409w"
			}],
			["path", {
				d: "m15 9 6-6",
				key: "ko1vev"
			}],
			["path", {
				d: "M21 16v5h-5",
				key: "1ck2sf"
			}],
			["path", {
				d: "M21 8V3h-5",
				key: "1qoq8a"
			}],
			["path", {
				d: "M3 16v5h5",
				key: "1t08am"
			}],
			["path", {
				d: "m3 21 6-6",
				key: "wwnumi"
			}],
			["path", {
				d: "M3 8V3h5",
				key: "1ln10m"
			}],
			["path", {
				d: "M9 9 3 3",
				key: "v551iv"
			}]
		]
	};
	eI.node;
	let eU = (0, W.f)(eI),
		eF = {
			name: "square",
			size: 24,
			node: [
				["rect", {
					width: "18",
					height: "18",
					x: "3",
					y: "3",
					rx: "2",
					key: "afitv7"
				}]
			]
		};
	eF.node;
	let eP = (0, W.f)(eF);
	var eB = e.i(267649),
		eO = e.i(503963);

	function e_(e) {
		let r, i, a, o, s = (0, u.c)(7),
			{
				className: c
			} = e,
			{
				data: l,
				isLoading: d
			} = (0, eO.k)(),
			[m, f] = (0, n.useState)(!1);
		if (s[0] === Symbol.for("react.memo_cache_sentinel") ? (r = () => {
				let e = () => f(!!document.fullscreenElement);
				return document.addEventListener("fullscreenchange", e), () => document.removeEventListener("fullscreenchange", e)
			}, i = [], s[0] = r, s[1] = i) : (r = s[0], i = s[1]), (0, n.useEffect)(r, i), d || !l || !l.active || "approved" === l.exemptReason || m) return null;
		let h = l.request?.status,
			g = "pending" === h ? "Watermarked · Pending review" : "declined" === h || "revoked" === h ? "Watermarked · Resubmit" : "Watermarked · Remove";
		return s[2] !== c ? (a = (0, b.c)("absolute z-10 inline-flex items-center rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/75", c), s[2] = c, s[3] = a) : a = s[3], s[4] !== g || s[5] !== a ? (o = (0, t.jsx)(ew.default, {
			href: "/watermark",
			className: a,
			children: g
		}), s[4] = g, s[5] = a, s[6] = o) : o = s[6], o
	}

	function eW(e) {
		let r, i, a, o, s, c = (0, u.c)(12),
			{
				videoRef: l,
				className: d
			} = e,
			[m, f] = (0, n.useState)(null);
		if (c[0] !== l ? (r = () => {
				let e = l.current;
				if (!e) return;
				let t = () => f(function(e) {
					let {
						videoWidth: t,
						videoHeight: r,
						clientWidth: i,
						clientHeight: n
					} = e;
					if (!t || !r || !i || !n) return null;
					let a = Math.min(i / t, n / r);
					return {
						top: (n - r * a) / 2,
						left: (i - t * a) / 2,
						height: r * a
					}
				}(e));
				t();
				let r = new ResizeObserver(t);
				return r.observe(e), e.addEventListener("loadedmetadata", t), e.addEventListener("resize", t), () => {
					r.disconnect(), e.removeEventListener("loadedmetadata", t), e.removeEventListener("resize", t)
				}
			}, i = [l], c[0] = l, c[1] = r, c[2] = i) : (r = c[1], i = c[2]), (0, n.useEffect)(r, i), !m) return null;
		let h = .035 * m.height;
		c[3] !== d ? (a = (0, b.c)("pointer-events-none absolute z-10 opacity-90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]", d), c[3] = d, c[4] = a) : a = c[4];
		let g = m.top + h,
			p = m.left + h,
			v = .1 * m.height;
		return c[5] !== g || c[6] !== p || c[7] !== v ? (o = {
			top: g,
			right: p,
			height: v,
			width: "auto"
		}, c[5] = g, c[6] = p, c[7] = v, c[8] = o) : o = c[8], c[9] !== a || c[10] !== o ? (s = (0, t.jsx)(ex.default, {
			src: "../../../../decart-watermark.png",
			alt: "",
			"aria-hidden": !0,
			width: 1400,
			height: 635,
			sizes: "240px",
			className: a,
			style: o
		}), c[9] = a, c[10] = o, c[11] = s) : s = c[11], s
	}
	var eq = e.i(720957);

	function eV(e) {
		let r, i, a, o, s, c = (0, u.c)(15),
			{
				localVideoRef: l,
				mirrorMode: d,
				visible: m,
				overlay: f,
				className: h
			} = e,
			g = "portrait" === function(e) {
				let t, r, i = (0, u.c)(3),
					[a, o] = (0, n.useState)("landscape");
				return i[0] !== e ? (t = () => {
					let t = e.current;
					if (!t) return;
					let r = () => {
						t.videoWidth && t.videoHeight && o((0, eq.n)(t.videoWidth, t.videoHeight))
					};
					return r(), t.addEventListener("loadedmetadata", r), t.addEventListener("resize", r), () => {
						t.removeEventListener("loadedmetadata", r), t.removeEventListener("resize", r)
					}
				}, r = [e], i[0] = e, i[1] = t, i[2] = r) : (t = i[1], r = i[2]), (0, n.useEffect)(t, r), a
			}(l) ? "aspect-[9/16] w-18 sm:w-22 lg:w-28" : "aspect-video w-32 sm:w-40 lg:w-50",
			p = !m && "pointer-events-none invisible";
		c[0] !== h || c[1] !== g || c[2] !== p ? (r = (0, b.c)("group absolute right-3 bottom-3 z-20 overflow-hidden rounded-xl bg-background shadow-xl md:right-3 md:bottom-3", g, p, h), c[0] = h, c[1] = g, c[2] = p, c[3] = r) : r = c[3];
		let v = d ? "scaleX(-1)" : "none";
		return c[4] !== v ? (i = {
			transform: v
		}, c[4] = v, c[5] = i) : i = c[5], c[6] !== l || c[7] !== i ? (a = (0, t.jsx)("video", {
			ref: l,
			autoPlay: !0,
			playsInline: !0,
			muted: !0,
			className: "size-full object-contain",
			style: i
		}), c[6] = l, c[7] = i, c[8] = a) : a = c[8], c[9] !== f ? (o = f && (0, t.jsx)("div", {
			className: (0, b.c)("absolute inset-0 flex items-end justify-end p-1", "md:items-center md:justify-center md:bg-black/40 md:p-0 md:opacity-0 md:transition-opacity md:group-focus-within:opacity-100 md:group-hover:opacity-100"),
			children: f
		}), c[9] = f, c[10] = o) : o = c[10], c[11] !== r || c[12] !== a || c[13] !== o ? (s = (0, t.jsxs)("div", {
			className: r,
			children: [a, o]
		}), c[11] = r, c[12] = a, c[13] = o, c[14] = s) : s = c[14], s
	}

	function eG(e) {
		let r, i, a, o, s, c, l, d, m, f = (0, u.c)(33),
			{
				localVideoRef: h,
				remoteVideoRef: g,
				isConnected: p,
				isConnecting: v,
				isSwitchingInput: b,
				mirrorMode: x,
				hasRecording: w,
				emptyState: y,
				pipOverlay: R,
				connectionStatus: k,
				onStopSession: j
			} = e,
			S = void 0 !== b && b,
			{
				refetchUser: C
			} = (0, eB.f)(),
			T = (0, n.useRef)(null);
		f[0] !== p || f[1] !== C ? (r = () => {
			if (!p) return;
			let e = setInterval(() => C(), 6e3);
			return () => clearInterval(e)
		}, f[0] = p, f[1] = C, f[2] = r) : r = f[2], f[3] !== p ? (i = [p], f[3] = p, f[4] = i) : i = f[4], (0, n.useEffect)(r, i);
		let N = !p && !v && !S,
			L = p || void 0 !== w && w;
		f[5] !== g ? (a = (0, t.jsx)("video", {
			ref: g,
			autoPlay: !0,
			playsInline: !0,
			muted: !0,
			className: "size-full object-contain"
		}), f[5] = g, f[6] = a) : a = f[6], f[7] !== p || f[8] !== g ? (o = p && (0, t.jsx)(eW, {
			videoRef: g
		}), f[7] = p, f[8] = g, f[9] = o) : o = f[9], f[10] !== y || f[11] !== N ? (s = N && (0, t.jsx)("div", {
			className: "absolute inset-0 z-10 flex items-center justify-center overflow-y-auto bg-card p-4",
			children: y || (0, t.jsx)(ex.default, {
				src: "../../../../icons/decart-logo-card-color.svg",
				alt: "",
				width: 72,
				height: 72,
				className: "opacity-50"
			})
		}), f[10] = y, f[11] = N, f[12] = s) : s = f[12], f[13] !== v || f[14] !== S ? (c = (v || S) && (0, t.jsxs)("div", {
			className: "absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-background/50",
			children: [(0, t.jsx)(Z.f, {
				className: "size-8 animate-spin text-foreground"
			}), S && (0, t.jsx)("p", {
				className: "font-medium text-foreground text-xs",
				children: "Switching input..."
			})]
		}), f[13] = v, f[14] = S, f[15] = c) : c = f[15];
		let M = p || v || S;
		return f[16] !== h || f[17] !== x || f[18] !== R || f[19] !== M ? (l = (0, t.jsx)(eV, {
			localVideoRef: h,
			mirrorMode: x,
			visible: M,
			overlay: R
		}), f[16] = h, f[17] = x, f[18] = R, f[19] = M, f[20] = l) : l = f[20], f[21] !== k || f[22] !== p || f[23] !== j || f[24] !== L ? (d = L && (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsxs)("div", {
				className: "absolute top-2 left-2 z-20 flex items-center gap-2",
				children: [p && j && (0, t.jsxs)(Y.f, {
					onClick: j,
					variant: "secondary",
					className: ei,
					children: [(0, t.jsx)(eP, {
						className: "size-2.5 fill-destructive text-destructive"
					}), "Stop session"]
				}), (0, t.jsxs)(ee.W, {
					children: [(0, t.jsx)(ee.y, {
						asChild: !0,
						children: (0, t.jsx)(Y.f, {
							onClick: () => T.current?.requestFullscreen?.(),
							variant: "secondary",
							size: "icon",
							"aria-label": "Expand video",
							className: er,
							children: (0, t.jsx)(eU, {
								className: "size-4"
							})
						})
					}), (0, t.jsx)(ee.Y, {
						children: (0, t.jsx)("p", {
							children: "Expand video"
						})
					})]
				}), p && k]
			}), (0, t.jsx)(e_, {
				className: "bottom-3 left-3 md:bottom-4 md:left-4"
			})]
		}), f[21] = k, f[22] = p, f[23] = j, f[24] = L, f[25] = d) : d = f[25], f[26] !== l || f[27] !== d || f[28] !== a || f[29] !== o || f[30] !== s || f[31] !== c ? (m = (0, t.jsxs)("div", {
			ref: T,
			className: "relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden bg-background md:aspect-video md:max-h-full md:flex-none md:rounded-panel md:bg-card [&:fullscreen]:aspect-auto [&:fullscreen]:max-h-none [&:fullscreen]:rounded-none",
			children: [a, o, s, c, l, d]
		}), f[26] = l, f[27] = d, f[28] = a, f[29] = o, f[30] = s, f[31] = c, f[32] = m) : m = f[32], m
	}
	var eH = e.i(620714),
		eH = eH;

	function eY(e) {
		let r, i, a, o, s, c, l, d, m, f, h, g, p, v, x, w, y, R, k, j = (0, u.c)(134),
			{
				localVideoRef: S,
				remoteVideoRef: C,
				isConnected: T,
				isConnecting: N,
				isSwitchingInput: L,
				mirrorMode: M,
				onStartCamera: E,
				onStopCamera: A,
				onSelectSource: D,
				isMobile: z,
				layout: I,
				showInputSelector: U,
				inputSelectorContent: F,
				hasRecording: P,
				onDownloadRecording: _,
				connectionStatus: W,
				canUseBackCamera: q,
				videoSource: V,
				onSwitchCamera: G,
				modelType: K
			} = e,
			X = void 0 !== L && L,
			J = void 0 !== z && z,
			Q = void 0 !== U && U,
			et = void 0 !== P && P,
			en = void 0 !== q && q,
			ea = void 0 === V ? null : V,
			{
				refetchUser: eo
			} = (0, eB.f)(),
			es = (0, n.useRef)(null);
		j[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, b.G)(), j[0] = r) : r = j[0];
		let ec = r,
			el = (0, n.useRef)(null);
		j[1] === Symbol.for("react.memo_cache_sentinel") ? (i = () => {
			let e = el.current;
			e && e.requestFullscreen && e.requestFullscreen()
		}, j[1] = i) : i = j[1];
		let ed = i;
		j[2] === Symbol.for("react.memo_cache_sentinel") ? (a = () => {
			es.current?.click()
		}, j[2] = a) : a = j[2];
		let eu = a;
		j[3] !== D ? (o = e => {
			let t = e.target.files?.[0];
			if (t && D) {
				if (!["video/mp4", "video/webm", "video/quicktime"].includes(t.type)) return void alert("Please upload a valid video file (MP4, WebM, or MOV)");
				if (t.size > 524288e3) return void alert("Video file is too large. Please upload a file smaller than 500MB.");
				D("upload", t)
			}
			e.target.value = ""
		}, j[3] = D, j[4] = o) : o = j[4];
		let em = o;
		if (j[5] !== T || j[6] !== eo ? (s = () => {
				let e;
				return T && (e = setInterval(() => {
					eo()
				}, 6e3)), () => {
					clearInterval(e)
				}
			}, j[5] = T, j[6] = eo, j[7] = s) : s = j[7], j[8] !== T ? (c = [T], j[8] = T, j[9] = c) : c = j[9], (0, n.useEffect)(s, c), "side-by-side" === (void 0 === I ? "pip" : I)) {
			let e, r, i, n, a, o, s, c, l, d, u, m, f, h, g, p, v, b, x, w, y, R, k, L, z;
			j[10] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("p", {
				className: "text-sm sm:text-base font-medium text-foreground",
				children: "Input"
			}), j[10] = e) : e = j[10], j[11] !== T || j[12] !== D ? (r = T && D && (0, t.jsxs)($.G, {
				children: [(0, t.jsx)($.X, {
					asChild: !0,
					children: (0, t.jsxs)(Y.f, {
						variant: "ghost",
						size: "sm",
						className: "h-6 gap-1 px-2",
						children: [(0, t.jsx)("span", {
							className: "text-[10px] sm:text-xs",
							children: "Change Input"
						}), (0, t.jsx)(O.f, {
							className: "size-3"
						})]
					})
				}), (0, t.jsxs)($.L, {
					align: "start",
					children: [(0, t.jsxs)($.r, {
						onClick: () => D("camera"),
						children: [(0, t.jsx)(B.f, {
							className: "size-4 mr-2"
						}), "Camera"]
					}), !ec && (0, t.jsxs)($.r, {
						onClick: eu,
						children: [(0, t.jsx)(H, {
							className: "size-4 mr-2"
						}), "Upload Video"]
					})]
				})]
			}), j[11] = T, j[12] = D, j[13] = r) : r = j[13], j[14] !== r ? (i = (0, t.jsx)("div", {
				className: "flex items-center justify-between h-8",
				children: (0, t.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [e, r]
				})
			}), j[14] = r, j[15] = i) : i = j[15];
			let I = M ? "scaleX(-1)" : "none";
			return j[16] !== I ? (n = {
				transform: I
			}, j[16] = I, j[17] = n) : n = j[17], j[18] !== S || j[19] !== n ? (a = (0, t.jsx)("video", {
				ref: S,
				autoPlay: !0,
				playsInline: !0,
				muted: !0,
				className: "w-full h-full object-contain",
				style: n
			}), j[18] = S, j[19] = n, j[20] = a) : a = j[20], j[21] !== E || j[22] !== Q ? (o = Q && (0, t.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background lg:hidden",
				children: (0, t.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [(0, t.jsxs)(ee.W, {
						children: [(0, t.jsx)(ee.y, {
							asChild: !0,
							children: (0, t.jsx)(Y.f, {
								onClick: E,
								className: "rounded-full size-16 p-0",
								children: (0, t.jsx)(eH.f, {
									className: "size-6 text-foreground"
								})
							})
						}), (0, t.jsx)(ee.Y, {
							children: (0, t.jsx)("p", {
								children: "Start camera streaming"
							})
						})]
					}), (0, t.jsx)("p", {
						className: "text-xs text-muted-foreground font-medium text-center px-4",
						children: "Press play to start with camera"
					})]
				})
			}), j[21] = E, j[22] = Q, j[23] = o) : o = j[23], j[24] !== F || j[25] !== Q ? (s = Q && F && (0, t.jsx)("div", {
				className: "absolute inset-0 hidden lg:flex items-center justify-center bg-background",
				children: F
			}), j[24] = F, j[25] = Q, j[26] = s) : s = j[26], j[27] !== N || j[28] !== X ? (c = (N || X) && (0, t.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-card/50",
				children: (0, t.jsxs)("div", {
					className: "flex flex-col items-center gap-2",
					children: [(0, t.jsx)(Z.f, {
						className: "size-8 animate-spin text-foreground"
					}), X && (0, t.jsx)("p", {
						className: "text-xs text-foreground font-medium",
						children: "Switching input..."
					})]
				})
			}), j[27] = N, j[28] = X, j[29] = c) : c = j[29], j[30] !== em ? (l = !ec && (0, t.jsx)("input", {
				ref: es,
				type: "file",
				accept: ".mp4,.webm,.mov,video/mp4,video/webm,video/quicktime",
				onChange: em,
				className: "hidden"
			}), j[30] = em, j[31] = l) : l = j[31], j[32] !== a || j[33] !== o || j[34] !== s || j[35] !== c || j[36] !== l ? (d = (0, t.jsxs)("div", {
				className: "bg-background rounded-xl border border-border aspect-video max-h-[35vh] sm:max-h-[40vh] lg:max-h-[45vh] flex items-center justify-center overflow-hidden relative",
				children: [a, o, s, c, l]
			}), j[32] = a, j[33] = o, j[34] = s, j[35] = c, j[36] = l, j[37] = d) : d = j[37], j[38] !== i || j[39] !== d ? (u = (0, t.jsxs)("div", {
				className: "flex-1 flex flex-col gap-2",
				children: [i, d]
			}), j[38] = i, j[39] = d, j[40] = u) : u = j[40], j[41] === Symbol.for("react.memo_cache_sentinel") ? (m = (0, t.jsx)("p", {
				className: "text-sm sm:text-base font-medium text-foreground",
				children: "Output"
			}), j[41] = m) : m = j[41], j[42] !== T || j[43] !== A ? (f = T && (0, t.jsx)("div", {
				children: (0, t.jsxs)(ee.W, {
					children: [(0, t.jsx)(ee.y, {
						asChild: !0,
						children: (0, t.jsxs)(Y.f, {
							onClick: A,
							variant: "secondary",
							className: ei,
							children: [(0, t.jsx)(eP, {
								className: "size-2.5 fill-destructive text-destructive"
							}), "Stop Session"]
						})
					}), (0, t.jsx)(ee.Y, {
						children: (0, t.jsx)("p", {
							children: "Stop streaming session"
						})
					})]
				})
			}), j[42] = T, j[43] = A, j[44] = f) : f = j[44], j[45] !== et || j[46] !== T || j[47] !== _ ? (h = et && !T && _ && (0, t.jsx)("div", {
				children: (0, t.jsxs)(ee.W, {
					children: [(0, t.jsx)(ee.y, {
						asChild: !0,
						children: (0, t.jsxs)(Y.f, {
							onClick: _,
							variant: "default",
							size: "compact",
							className: "gap-2",
							children: [(0, t.jsx)(eD.f, {
								className: "size-4"
							}), "Download Recording"]
						})
					}), (0, t.jsx)(ee.Y, {
						className: "bg-popover text-card-foreground",
						children: (0, t.jsx)("p", {
							children: "Download previous session recording"
						})
					})]
				})
			}), j[45] = et, j[46] = T, j[47] = _, j[48] = h) : h = j[48], j[49] !== f || j[50] !== h ? (g = (0, t.jsxs)("div", {
				className: "flex items-center justify-between h-8",
				children: [m, f, h]
			}), j[49] = f, j[50] = h, j[51] = g) : g = j[51], j[52] !== C ? (p = (0, t.jsx)("video", {
				ref: C,
				autoPlay: !0,
				playsInline: !0,
				muted: !0,
				className: "w-full h-full object-contain"
			}), j[52] = C, j[53] = p) : p = j[53], j[54] !== T || j[55] !== C ? (v = T && (0, t.jsx)(eW, {
				videoRef: C
			}), j[54] = T, j[55] = C, j[56] = v) : v = j[56], j[57] !== W || j[58] !== T ? (b = T && W && (0, t.jsx)("div", {
				className: "absolute top-2 left-2 z-10",
				children: W
			}), j[57] = W, j[58] = T, j[59] = b) : b = j[59], j[60] !== et || j[61] !== T ? (x = (T || et) && (0, t.jsx)("div", {
				className: "absolute bottom-2 right-2",
				children: (0, t.jsxs)(ee.W, {
					children: [(0, t.jsx)(ee.y, {
						asChild: !0,
						children: (0, t.jsx)(Y.f, {
							onClick: ed,
							variant: "secondary",
							size: "icon",
							"aria-label": "Expand video",
							className: er,
							children: (0, t.jsx)(eU, {
								className: "size-4"
							})
						})
					}), (0, t.jsx)(ee.Y, {
						children: (0, t.jsx)("p", {
							children: "Expand video"
						})
					})]
				})
			}), j[60] = et, j[61] = T, j[62] = x) : x = j[62], j[63] !== et || j[64] !== T ? (w = (T || et) && (0, t.jsx)(e_, {
				className: "bottom-2 left-2"
			}), j[63] = et, j[64] = T, j[65] = w) : w = j[65], j[66] !== N ? (y = N && (0, t.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background/50",
				children: (0, t.jsx)(Z.f, {
					className: "size-8 animate-spin text-foreground"
				})
			}), j[66] = N, j[67] = y) : y = j[67], j[68] !== T || j[69] !== N ? (R = !T && !N && (0, t.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center bg-background",
				children: (0, t.jsx)(ex.default, {
					src: "../../../../icons/decart-logo-card-color.svg",
					alt: "Decart Logo",
					width: 72,
					height: 72,
					className: "opacity-50"
				})
			}), j[68] = T, j[69] = N, j[70] = R) : R = j[70], j[71] !== p || j[72] !== v || j[73] !== b || j[74] !== x || j[75] !== w || j[76] !== y || j[77] !== R ? (k = (0, t.jsxs)("div", {
				ref: el,
				className: "bg-background rounded-xl border border-border aspect-video max-h-[35vh] sm:max-h-[40vh] lg:max-h-[45vh] flex items-center justify-center overflow-hidden relative",
				children: [p, v, b, x, w, y, R]
			}), j[71] = p, j[72] = v, j[73] = b, j[74] = x, j[75] = w, j[76] = y, j[77] = R, j[78] = k) : k = j[78], j[79] !== g || j[80] !== k ? (L = (0, t.jsxs)("div", {
				className: "flex-1 flex flex-col gap-2",
				children: [g, k]
			}), j[79] = g, j[80] = k, j[81] = L) : L = j[81], j[82] !== u || j[83] !== L ? (z = (0, t.jsx)(ee.g, {
				children: (0, t.jsxs)("div", {
					className: "flex gap-2 sm:gap-3 lg:gap-4 w-full",
					children: [u, L]
				})
			}), j[82] = u, j[83] = L, j[84] = z) : z = j[84], z
		}
		let ef = J ? "h-full" : "aspect-video";
		j[85] !== ef ? (l = (0, b.c)("bg-card rounded-lg content-stretch flex items-center justify-center overflow-hidden relative w-full", ef, "md:aspect-video md:size-full"), j[85] = ef, j[86] = l) : l = j[86], j[87] !== C ? (d = (0, t.jsx)("video", {
			ref: C,
			autoPlay: !0,
			playsInline: !0,
			muted: !0,
			className: "w-full h-full object-contain"
		}), j[87] = C, j[88] = d) : d = j[88], j[89] !== T || j[90] !== C ? (m = T && (0, t.jsx)(eW, {
			videoRef: C
		}), j[89] = T, j[90] = C, j[91] = m) : m = j[91], j[92] !== T || j[93] !== N || j[94] !== E ? (f = !T && !N && (0, t.jsxs)("div", {
			className: "absolute inset-0 flex flex-col items-center justify-center gap-3",
			children: [(0, t.jsx)("div", {
				className: "flex gap-4 items-center",
				children: (0, t.jsxs)(ee.W, {
					children: [(0, t.jsx)(ee.y, {
						asChild: !0,
						children: (0, t.jsx)(Y.f, {
							onClick: E,
							className: "rounded-full size-16 p-0",
							children: (0, t.jsx)(eH.f, {
								className: "size-6 text-foreground"
							})
						})
					}), (0, t.jsx)(ee.Y, {
						children: (0, t.jsx)("p", {
							children: "Start camera streaming"
						})
					})]
				})
			}), (0, t.jsx)("p", {
				className: "text-sm text-muted-foreground font-medium",
				children: "Press the play button to start restyling!"
			})]
		}), j[92] = T, j[93] = N, j[94] = E, j[95] = f) : f = j[95], j[96] !== N ? (h = N && (0, t.jsx)("div", {
			className: "absolute inset-0 flex items-center justify-center",
			children: (0, t.jsx)(Z.f, {
				className: "size-8 animate-spin text-foreground"
			})
		}), j[96] = N, j[97] = h) : h = j[97];
		let eh = !N && !T && "sm:hidden";
		j[98] !== eh ? (g = (0, b.c)("absolute bottom-4 left-4 sm:inline-block hidden", eh), j[98] = eh, j[99] = g) : g = j[99];
		let eg = M ? "scaleX(-1)" : "none";
		return j[100] !== eg ? (p = {
			transform: eg
		}, j[100] = eg, j[101] = p) : p = j[101], j[102] !== S || j[103] !== p ? (v = (0, t.jsx)("div", {
			className: "h-40 aspect-video rounded-lg overflow-hidden border-2 border-white/20 shadow-lg bg-background",
			children: (0, t.jsx)("video", {
				ref: S,
				autoPlay: !0,
				playsInline: !0,
				muted: !0,
				className: "w-full h-full object-contain",
				style: p
			})
		}), j[102] = S, j[103] = p, j[104] = v) : v = j[104], j[105] !== g || j[106] !== v ? (x = (0, t.jsx)("div", {
			className: g,
			children: v
		}), j[105] = g, j[106] = v, j[107] = x) : x = j[107], j[108] !== en || j[109] !== W || j[110] !== T || j[111] !== J || j[112] !== K || j[113] !== A || j[114] !== G || j[115] !== ea ? (w = T && (0, t.jsxs)("div", {
			className: "absolute top-4 left-4 flex flex-row items-center gap-2",
			children: [(0, t.jsxs)(Y.f, {
				onClick: A,
				variant: "secondary",
				className: ei,
				children: [(0, t.jsx)(eP, {
					className: "size-2.5 fill-destructive text-destructive"
				}), "Stop Session"]
			}), W, J && en && G && "camera" === ea && ("lucy-restyle-2" === K || "lucy-2.1" === K || "lucy-2.5" === K || "lucy-2.6" === K || "lucy-vton-3.5" === K || "lucy-vton-3.6" === K) && (0, t.jsxs)(Y.f, {
				onClick: G,
				variant: "secondary",
				size: "sm",
				children: [(0, t.jsx)(B.f, {
					className: "mr-2 h-4 w-4"
				}), "Switch camera"]
			})]
		}), j[108] = en, j[109] = W, j[110] = T, j[111] = J, j[112] = K, j[113] = A, j[114] = G, j[115] = ea, j[116] = w) : w = j[116], j[117] !== et || j[118] !== T || j[119] !== _ ? (y = et && !T && _ && (0, t.jsx)("div", {
			className: "absolute top-3 right-3",
			children: (0, t.jsxs)(ee.W, {
				children: [(0, t.jsx)(ee.y, {
					asChild: !0,
					children: (0, t.jsxs)(Y.f, {
						onClick: _,
						variant: "default",
						size: "compact",
						className: "gap-2",
						children: [(0, t.jsx)(eD.f, {
							className: "size-4"
						}), "Download Recording"]
					})
				}), (0, t.jsx)(ee.Y, {
					className: "bg-popover text-card-foreground",
					children: (0, t.jsx)("p", {
						children: "Download previous session recording"
					})
				})]
			})
		}), j[117] = et, j[118] = T, j[119] = _, j[120] = y) : y = j[120], j[121] !== et || j[122] !== T ? (R = (T || et) && (0, t.jsx)(e_, {
			className: "bottom-4 right-4"
		}), j[121] = et, j[122] = T, j[123] = R) : R = j[123], j[124] !== l || j[125] !== d || j[126] !== m || j[127] !== f || j[128] !== h || j[129] !== x || j[130] !== w || j[131] !== y || j[132] !== R ? (k = (0, t.jsx)(ee.g, {
			children: (0, t.jsxs)("div", {
				ref: el,
				className: l,
				children: [d, m, f, h, x, w, y, R]
			})
		}), j[124] = l, j[125] = d, j[126] = m, j[127] = f, j[128] = h, j[129] = x, j[130] = w, j[131] = y, j[132] = R, j[133] = k) : k = j[133], k
	}
	let e$ = e => `${e.name}|${e.size}|${e.lastModified}|${e.type}`;
	e.s(["RealTimePlayground", 0, function({
		modelType: e,
		title: B,
		defaultPrompt: O,
		presets: _,
		isActive: W,
		creditCostPerSecond: q,
		speed: V,
		offersFastMode: G = !1,
		fastModeCostMultiplier: H,
		enhancePresetPrompts: Y = !1,
		presetFamily: $,
		playgroundUi: K = "rail"
	}) {
		let X, J, Z, [ee, et] = (0, n.useState)(!1),
			[er, ei] = (0, n.useState)(!1),
			[en, ea] = (0, n.useState)(!1),
			[eo, es] = (0, n.useState)(null),
			[el, ed] = (0, n.useState)(!1),
			[em, eh] = (0, n.useState)(O),
			[eg, ep] = (0, n.useState)(null),
			eb = (0, n.useMemo)(() => _.map(m.w), [_]),
			[ex, ew] = (0, n.useState)(null),
			[ey, eR] = (0, n.useState)(!1),
			[ek, eS] = (0, n.useState)(null),
			[eC, eT] = (0, n.useState)(null),
			eN = (0, p.f)(),
			[eL, eM] = (0, n.useState)("user"),
			[eE, eD] = (0, n.useState)(!1),
			[eI, eU] = (0, n.useState)(null),
			[eF, eP] = (0, n.useState)(!1),
			[eB, eO] = (0, n.useState)(!0),
			{
				isAdmin: e_
			} = (0, o.f)(),
			eW = function(e) {
				let t, r = (0, u.c)(5),
					{
						data: i
					} = (0, f.a)(),
					n = i?.presets;
				if (r[0] !== e || r[1] !== n) {
					let i, a = new Set;
					r[3] !== e ? (i = t => void 0 === e || null == t.modelFamily || t.modelFamily === e, r[3] = e, r[4] = i) : i = r[4], t = (n ?? []).filter(g).filter(i).sort(h).filter(e => !a.has(e.name) && (a.add(e.name), !0)).slice(0, 8).map(m.p), r[0] = e, r[1] = n, r[2] = t
				} else t = r[2];
				return t
			}($),
			{
				dialog: eq,
				openDialog: eV
			} = (0, l.f)(),
			eH = (0, n.useRef)(null),
			eK = (0, n.useRef)(!1),
			eX = "lucy-restyle-2" === e || "lucy-2.1" === e || "lucy-2.5" === e || "lucy-2.6" === e || "lucy-vton-3.5" === e || "lucy-vton-3.6" === e,
			eJ = "lucy-vton-3.5" === e || "lucy-vton-3.6" === e,
			eQ = eJ ? "Replace everyone's outfit with the outfit from the reference image" : "",
			eZ = !!Y && eB,
			e0 = "lucy-2.5" === e || "lucy-2.6" === e,
			e1 = (0, n.useCallback)(e => void 0 === e.enhance ? eZ : e0 || e.enhance, [eZ, e0]),
			{
				isLoading: e2,
				isAuthenticated: e3,
				checkAuth: e4
			} = (0, c.f)(),
			e5 = !e2 && e3(),
			{
				getClientToken: e6
			} = (0, x.I)(),
			e8 = (0, s.f)() >= q,
			e7 = (0, n.useRef)(null),
			e9 = (0, n.useRef)(null),
			te = (0, n.useRef)(null),
			tt = (0, n.useRef)(null),
			tr = (0, n.useRef)(null),
			ti = (0, n.useRef)(null),
			tn = (0, n.useRef)(null),
			ta = (0, n.useRef)(null),
			to = (0, n.useRef)(null),
			ts = (0, n.useRef)(null);
		ts.current = eI;
		let tc = (0, n.useRef)(em);
		tc.current = em;
		let tl = (0, n.useRef)(em),
			td = (0, n.useCallback)(e => {
				let t = e$(e),
					i = to.current;
				if (i?.key === t) return i.promise;
				let n = (async () => {
						let t = await e6(),
							i = (0, r.f)({
								apiKey: t,
								integration: "platform"
							});
						return (await i.files.upload(e)).id
					})(),
					a = {
						key: t,
						promise: n
					};
				return to.current = a, n.catch(() => {
					to.current === a && (to.current = null)
				}), n
			}, [e6]),
			tu = (0, n.useCallback)((e, t) => t ? Promise.resolve(e) : td(e), [td]),
			{
				videoDevices: tm,
				getVideoDevices: tf,
				setupDeviceListener: th,
				removeDeviceListener: tg
			} = function() {
				let [e, t] = (0, n.useState)([]), r = (0, n.useRef)(!1), i = (0, n.useCallback)(async () => {
					try {
						let e = (await navigator.mediaDevices.enumerateDevices()).filter(e => "videoinput" === e.kind);
						e.length > 0 && e[0].label && t(e)
					} catch (e) {}
				}, []), a = (0, n.useCallback)(() => {
					r.current || (navigator.mediaDevices.addEventListener("devicechange", i), r.current = !0)
				}, [i]), o = (0, n.useCallback)(() => {
					r.current && (navigator.mediaDevices.removeEventListener("devicechange", i), r.current = !1)
				}, [i]);
				return {
					videoDevices: e,
					getVideoDevices: i,
					setupDeviceListener: a,
					removeDeviceListener: o
				}
			}(),
			{
				connectRealtime: tp,
				clearConnectionTimeout: tv
			} = (X = (0, n.useRef)(null), {
				connectRealtime: (0, n.useCallback)(async (e, {
					getApiKey: t,
					model: i,
					prompt: n,
					shouldEnrichPrompt: a,
					image: o,
					mirror: s,
					speed: c,
					remoteVideoRef: l,
					onConnected: d,
					onConnecting: u,
					onError: m,
					onDisconnect: f,
					onConnectionQuality: h,
					onReconnectingChange: g
				}) => {
					let p, v = (0, r.f)({
						apiKeyProvider: t,
						integration: "platform"
					});
					X.current && clearTimeout(X.current), X.current = setTimeout(() => {
						m("Connection timeout - please try again"), u(!1), f()
					}, 3e4);
					try {
						p = await v.realtime.connect(e, {
							model: i,
							mirror: s,
							...(0, w.u)(c),
							onConnectionQuality: h,
							onRemoteStream: e => {
								l.current && (l.current.srcObject = e, X.current && (clearTimeout(X.current), X.current = null), d(), u(!1))
							},
							initialState: {
								prompt: {
									text: n,
									enhance: a
								},
								...o ? {
									image: o
								} : {}
							}
						})
					} catch (e) {
						if (X.current && (clearTimeout(X.current), X.current = null), (0, x.L)(e)) throw Error(y, {
							cause: e
						});
						throw e
					}
					return p.on("connectionChange", e => {
						g?.("reconnecting" === e), "disconnected" === e && (u(!1), f())
					}), p.on("error", e => {
						if ("object" == typeof e && "message" in e) {
							let t = e.message;
							(0, x.L)(e) ? m(y): m(t)
						}
					}), p
				}, []),
				clearConnectionTimeout: (0, n.useCallback)(() => {
					X.current && (clearTimeout(X.current), X.current = null)
				}, [])
			}),
			{
				buildVideoConstraints: tb
			} = ((Z = (0, u.c)(1))[0] === Symbol.for("react.memo_cache_sentinel") ? (J = {
				buildVideoConstraints: k
			}, Z[0] = J) : J = Z[0], J),
			{
				isRecording: tx,
				recordedBlob: tw,
				startRecording: ty,
				stopRecording: tR,
				downloadRecording: tk,
				clearRecording: tj
			} = function() {
				let [e, t] = (0, n.useState)(!1), [r, i] = (0, n.useState)(null), [o, s] = (0, n.useState)(0), c = (0, n.useRef)(null), l = (0, n.useRef)("mp4"), d = (0, n.useRef)(null), u = (0, n.useRef)(0), m = (0, n.useRef)(0), f = (0, n.useRef)(null), h = (0, n.useRef)(!1), g = (0, n.useRef)(!1), p = (0, n.useRef)(null), v = (0, n.useRef)(null), b = (0, n.useRef)(null), x = (0, n.useCallback)(() => {
					let e = Date.now(),
						t = null === f.current ? 0 : e - f.current;
					return e - u.current - m.current - t
				}, []), w = (0, n.useCallback)(() => {
					p.current?.(), p.current = null
				}, []), y = (0, n.useCallback)(() => {
					v.current?.(), v.current = null
				}, []), R = (0, n.useCallback)(() => {
					y(), c.current && e && c.current.stopRecording(() => {
						let e = c.current?.getBlob();
						w(), b.current = null, e && e.size > 0 ? i(e) : (console.error("Recording failed: blob is empty or invalid"), a.c.error("Recording failed - no data captured")), t(!1), d.current && (clearInterval(d.current), d.current = null)
					})
				}, [e, y, w]), k = (0, n.useCallback)((e, r, n) => {
					let o = r.getAudioTracks().length > 0;
					try {
						c.current && (c.current.destroy(), c.current = null), w();
						let v = function(e, t, r) {
							if (e <= 0 || t <= 0) return null;
							let i = Math.max(e, t, r ? Math.max(r.width, r.height) : 0),
								n = e >= t,
								a = n ? i : i * e / t,
								o = n ? i * t / e : i;
							return {
								width: M(a),
								height: M(o)
							}
						}(e.videoWidth, e.videoHeight, n);
						if (!v) throw Error("Remote video has no frames to record");
						let [y] = r.getVideoTracks();
						if (!y) throw Error("Remote stream has no video track");
						let k = function(e, t) {
							let r, i, n, a = !(n = globalThis).MediaStreamTrackProcessor || !n.MediaStreamTrackGenerator || "u" < typeof OffscreenCanvas ? null : {
								MediaStreamTrackProcessor: n.MediaStreamTrackProcessor,
								MediaStreamTrackGenerator: n.MediaStreamTrackGenerator
							};
							if (!a) return null;
							let o = new OffscreenCanvas(t.width, t.height),
								s = o.getContext("2d");
							if (!s) return null;
							try {
								r = new a.MediaStreamTrackProcessor({
									track: e
								}), i = new a.MediaStreamTrackGenerator({
									kind: "video"
								})
							} catch {
								return null
							}
							let c = new TransformStream({
									transform(e, r) {
										E(s, e, e.displayWidth, e.displayHeight, t);
										let i = e.timestamp;
										e.close(), r.enqueue(new VideoFrame(o, {
											timestamp: i
										}))
									}
								}),
								l = new AbortController;
							return r.readable.pipeThrough(c).pipeTo(i.writable, {
								signal: l.signal
							}).catch(() => {}), {
								track: i,
								runsInBackground: !0,
								release: () => {
									l.abort(), i.stop()
								}
							}
						}(y, v) ?? function(e, t) {
							let r = document.createElement("canvas");
							r.width = t.width, r.height = t.height;
							let i = r.getContext("2d");
							if (!i) throw Error("Failed to create 2D canvas context for recording");
							let n = () => {
								e.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || e.videoWidth && e.videoHeight && E(i, e, e.videoWidth, e.videoHeight, t)
							};
							n();
							let a = function(e, t) {
									let r = !1;
									if ("requestVideoFrameCallback" in e) {
										let i = 0,
											n = () => {
												r || (t(), i = e.requestVideoFrameCallback(n))
											};
										return i = e.requestVideoFrameCallback(n), () => {
											r = !0, e.cancelVideoFrameCallback(i)
										}
									}
									let i = 0,
										n = () => {
											r || (t(), i = requestAnimationFrame(n))
										};
									return i = requestAnimationFrame(n), () => {
										r = !0, cancelAnimationFrame(i)
									}
								}(e, n),
								[o] = r.captureStream().getVideoTracks();
							return {
								track: o,
								runsInBackground: !1,
								release: () => {
									a(), o.stop()
								}
							}
						}(e, v);
						p.current = k.release;
						let A = function(e, t) {
								if (e && t(S)) return {
									mimeType: S,
									fileExtension: "mp4",
									videoOnly: !1
								};
								if (t(C)) return {
									mimeType: C,
									fileExtension: "mp4",
									videoOnly: e
								};
								for (let r of e ? ["video/webm;codecs=vp9,opus", T, N] : [T, N])
									if (t(r)) return {
										mimeType: r,
										fileExtension: "webm",
										videoOnly: !1
									};
								return t(L) ? {
									mimeType: L,
									fileExtension: "mp4",
									videoOnly: !1
								} : {
									mimeType: N,
									fileExtension: "webm",
									videoOnly: !1
								}
							}(o, e => MediaRecorder.isTypeSupported(e)),
							D = o && !A.videoOnly,
							z = new MediaStream([k.track, ...D ? r.getAudioTracks() : []]),
							I = new j.default(z, {
								type: "video",
								mimeType: A.mimeType,
								videoBitsPerSecond: 2e6,
								...D && {
									audioBitsPerSecond: 128e3
								},
								checkForInactiveTracks: !0,
								disableLogs: !0
							});
						if (l.current = A.fileExtension, i(null), h.current = !1, g.current = !1, u.current = Date.now(), m.current = 0, f.current = null, s(0), I.startRecording(), c.current = I, b.current = r.getTracks(), t(!0), !k.runsInBackground) {
							let e = () => {
								document.hidden ? (I.pauseRecording(), f.current = Date.now()) : (null !== f.current && (m.current += Date.now() - f.current, f.current = null), I.resumeRecording())
							};
							document.addEventListener("visibilitychange", e), p.current = () => {
								document.removeEventListener("visibilitychange", e), k.release()
							}
						}
						d.current = setInterval(() => {
							let e = x();
							s(e), e >= 29e4 && !h.current && (a.c.warning("Recording will stop in 10 seconds (5 minute limit)"), h.current = !0), e >= 3e5 && !g.current && (g.current = !0, R(), a.c.info("Recording stopped (5 minute limit reached)"))
						}, 1e3)
					} catch (e) {
						console.error("Failed to start recording:", e), a.c.error("Failed to start recording. Please try again."), w(), b.current = null, t(!1), d.current && (clearInterval(d.current), d.current = null)
					}
				}, [R, w, x]), D = (0, n.useCallback)((e, t) => {
					A(e)?.getTracks().length ? (y(), v.current = function(e, t) {
						let r = () => e.videoWidth > 0 && e.videoHeight > 0;
						if (r()) return t(), () => {};
						let i = () => {
								e.removeEventListener("loadedmetadata", n), e.removeEventListener("resize", n)
							},
							n = () => {
								r() && (i(), t())
							};
						return e.addEventListener("loadedmetadata", n), e.addEventListener("resize", n), i
					}(e, () => (r => {
						var i;
						let n;
						v.current = null, r && (b.current && (i = b.current, (n = new Set(r.getTracks().map(e => e.id))).size === i.length && i.every(e => n.has(e.id))) || k(e, r, t))
					})(A(e)))) : a.c.error("No video stream available for recording")
				}, [k, y]), z = (0, n.useCallback)(() => {
					if (!r) return void a.c.error("No recording available to download");
					try {
						let e = l.current,
							t = URL.createObjectURL(r),
							i = document.createElement("a");
						i.href = t, i.download = `decart-realtime-${Date.now()}.${e}`, document.body.appendChild(i), i.click(), document.body.removeChild(i), setTimeout(() => {
							URL.revokeObjectURL(t)
						}, 100), a.c.success("Recording downloaded successfully")
					} catch (e) {
						console.error("Failed to download recording:", e), a.c.error("Failed to download recording. Please try again.")
					}
				}, [r]), I = (0, n.useCallback)(() => {
					y(), e ? R() : (w(), b.current = null), i(null), s(0), h.current = !1, g.current = !1, d.current && (clearInterval(d.current), d.current = null)
				}, [e, R, y, w]);
				return (0, n.useEffect)(() => () => {
					v.current?.(), p.current?.(), c.current?.destroy(), c.current = null, b.current = null, d.current && clearInterval(d.current)
				}, []), {
					isRecording: e,
					recordedBlob: r,
					recordingDuration: o,
					startRecording: D,
					stopRecording: R,
					downloadRecording: z,
					clearRecording: I
				}
			}(),
			tS = (0, n.useRef)(tj);
		tS.current = tj;
		let tC = i.$.realtime(e),
			tT = (0, n.useCallback)(() => {
				setTimeout(() => {
					let e = e9.current;
					e?.srcObject && ty(e, {
						width: tC.width,
						height: tC.height
					})
				}, 500)
			}, [ty, tC.width, tC.height]),
			tN = (0, n.useCallback)(() => {
				ee && eR(!0)
			}, [ee]),
			tL = (0, n.useCallback)(() => {}, []),
			tM = (0, n.useCallback)(() => {
				eR(!1)
			}, []);
		! function(e) {
			let t, r, i, a, o, s = (0, u.c)(10),
				{
					onIdle: c,
					onActive: l,
					enabled: d
				} = e,
				m = (0, n.useRef)(!1);
			s[0] !== d || s[1] !== l || s[2] !== c ? (t = () => {
				if (!d) return;
				let e = document.hidden;
				e && !m.current ? (m.current = !0, c()) : !e && m.current && (m.current = !1, l())
			}, s[0] = d, s[1] = l, s[2] = c, s[3] = t) : t = s[3];
			let f = t;
			s[4] !== d || s[5] !== f ? (r = () => {
				if (!d) {
					m.current = !1;
					return
				}
				return document.addEventListener("visibilitychange", f), () => {
					document.removeEventListener("visibilitychange", f)
				}
			}, i = [d, f], s[4] = d, s[5] = f, s[6] = r, s[7] = i) : (r = s[6], i = s[7]), (0, n.useEffect)(r, i), s[8] === Symbol.for("react.memo_cache_sentinel") ? (a = () => {
				m.current = !1
			}, s[8] = a) : a = s[8];
			let h = a;
			s[9] === Symbol.for("react.memo_cache_sentinel") ? (o = {
				reset: h
			}, s[9] = o) : o = s[9]
		}({
			onIdle: tN,
			onActive: tL,
			enabled: ee
		}), (0, n.useEffect)(() => {
			tm.length > 0 && eD(tm.some(e => z(e.label)))
		}, [tm]);
		let tE = (0, n.useCallback)(() => {
				if (tS.current(), tt.current && (tt.current.disconnect(), tt.current = null), te.current) {
					for (let e of te.current.getTracks()) e.stop();
					te.current = null
				}
				null !== ti.current && (cancelAnimationFrame(ti.current), ti.current = null), tr.current && (tr.current.pause(), tr.current.src && URL.revokeObjectURL(tr.current.src), tr.current.srcObject = null, tr.current = null), tv(), e7.current && (e7.current.srcObject = null), e9.current && (e9.current.srcObject = null), et(!1), ei(!1), es(null), ed(!1), eS(null), eT(null), eM("user"), tn.current = null
			}, []),
			tA = (0, n.useCallback)(async (e, t, r) => {
				if (!r?.force && (ee || er) || eK.current) return;
				eK.current = !0;
				let i = null;
				try {
					tj(), ei(!0), ew(null);
					let r = t ?? eL;
					if (e && !t) {
						let t = tm.find(t => t.deviceId === e);
						if (t) {
							let e = I(t.label);
							e && (r = e)
						}
					}
					r !== eL && eM(r);
					let n = tb(e, r, tC),
						a = (i = await navigator.mediaDevices.getUserMedia({
							audio: !1,
							video: n
						})).getVideoTracks()[0];
					if (!a) throw Error("No video track available. Please try again.");
					if (tn.current = a.getSettings().deviceId ?? null, !i.active) throw Error("Camera stream is inactive. Please try again.");
					te.current = i, eS("camera"), e7.current && (e7.current.srcObject = i), await tf(), th();
					let o = !!eg,
						s = eg?.prompt || em;
					ta.current = s;
					let c = eI ? await tu(eI, o) : void 0;
					tt.current = await tp(i, {
						getApiKey: e6,
						model: tC,
						prompt: s,
						shouldEnrichPrompt: eg && (0, m.r)(eg) ? e1(eg) : eB,
						image: c,
						mirror: "user" === r,
						speed: V,
						remoteVideoRef: e9,
						onConnected: () => {
							et(!0), eS("camera"), tT()
						},
						onConnecting: ei,
						onError: ew,
						onDisconnect: tE,
						onConnectionQuality: es,
						onReconnectingChange: ed
					})
				} catch (e) {
					if (i) {
						for (let e of i.getTracks()) e.stop();
						te.current === i && (te.current = null), e7.current?.srcObject === i && (e7.current.srcObject = null), tn.current = null
					}
					ew(e instanceof Error ? e.message : "Failed to start streaming"), ei(!1)
				} finally {
					eK.current = !1
				}
			}, [tj, ee, er, tb, tC, tf, th, tp, em, tE, tT, eL, tm, eg, eI, eB, e1, e6, tu, V]),
			tD = async (e, t) => {
				if (!t?.force && (ee || er) || eK.current) return;
				eK.current = !0;
				let r = null,
					i = null,
					n = null;
				try {
					tj(), ei(!0), ew(null), eT(e), (r = document.createElement("video")).loop = !0, r.muted = !0, r.playsInline = !0, r.autoplay = !0, i = URL.createObjectURL(e), r.src = i, await new Promise((e, t) => {
						if (!r) return t(Error("Video element missing"));
						r.oncanplay = () => e(), r.onerror = () => t(Error("Failed to load video"))
					}), await r.play();
					let t = document.createElement("canvas");
					t.width = r.videoWidth, t.height = r.videoHeight;
					let a = t.getContext("2d");
					if (!a) throw Error("Failed to create 2D canvas context for video resampling");
					let o = R(tC.fps),
						s = 1e3 / o,
						c = 0;
					null !== ti.current && (cancelAnimationFrame(ti.current), ti.current = null);
					let l = r,
						d = e => {
							e - c >= s && (a.drawImage(l, 0, 0, t.width, t.height), c = e), ti.current = requestAnimationFrame(d)
						};
					if (a.drawImage(l, 0, 0, t.width, t.height), c = performance.now(), ti.current = requestAnimationFrame(d), !(n = t.captureStream(o)) || 0 === n.getVideoTracks().length) throw Error("Failed to capture video stream");
					tr.current = r, te.current = n, e7.current && (e7.current.srcObject = n);
					let u = !!eg,
						f = eg?.prompt || em;
					ta.current = f;
					let h = eI ? await tu(eI, u) : void 0;
					tt.current = await tp(n, {
						getApiKey: e6,
						model: tC,
						prompt: f,
						shouldEnrichPrompt: eg && (0, m.r)(eg) ? e1(eg) : eB,
						image: h,
						mirror: !1,
						speed: V,
						remoteVideoRef: e9,
						onConnected: () => {
							et(!0), eS("upload"), tT()
						},
						onConnecting: ei,
						onError: ew,
						onDisconnect: tE,
						onConnectionQuality: es,
						onReconnectingChange: ed
					})
				} catch (e) {
					if (null !== ti.current && (cancelAnimationFrame(ti.current), ti.current = null), n)
						for (let e of n.getTracks()) e.stop();
					te.current === n && (te.current = null), e7.current?.srcObject === n && (e7.current.srcObject = null), r && (r.pause(), r.removeAttribute("src"), r.load()), i && URL.revokeObjectURL(i), tr.current === r && (tr.current = null), ew(e instanceof Error ? e.message : "Failed to start video upload"), ei(!1), eT(null)
				} finally {
					eK.current = !1
				}
			}, tz = (0, n.useCallback)(async (e, t, r, i) => {
				try {
					if (ea(!0), ew(null), tt.current && (tt.current.disconnect(), tt.current = null), es(null), ed(!1), te.current) {
						for (let e of te.current.getTracks()) e.stop();
						te.current = null
					}
					tr.current && "upload" !== e && "example_asset" !== e && (null !== ti.current && (cancelAnimationFrame(ti.current), ti.current = null), tr.current.pause(), tr.current.src && URL.revokeObjectURL(tr.current.src), tr.current.srcObject = null, tr.current = null), e7.current && (e7.current.srcObject = null), et(!1), "camera" === e ? await tA(r, i, {
						force: !0
					}) : ("upload" === e || "example_asset" === e) && t && await tD(t, {
						force: !0
					}), ea(!1)
				} catch (e) {
					ew(e instanceof Error ? e.message : "Failed to switch input source"), ea(!1), ei(!1)
				}
			}, [tA]), tI = async (t, r) => {
				e5 ? (ee && ek ? v.f.trackRealtimeInputChanged({
					modelName: e,
					fromInput: ek,
					toInput: "example_asset" === t ? "example_asset" : t
				}) : v.f.trackGenerateStart({
					modelName: e,
					inputSource: t
				}), ee || e8) ? ee ? await tz(t, r) : "camera" === t ? await tA() : ("upload" === t || "example_asset" === t) && r && await tD(r) : a.c.error("Insufficient credits") : e4()
			}, tU = (0, n.useCallback)(() => {
				tx && tR(), tg(), tE()
			}, [tg, tE, tx, tR]), tF = (0, n.useCallback)(() => {
				eR(!1), tU()
			}, [tU]), tP = (0, n.useCallback)(async () => {
				e5 ? e8 ? (v.f.trackGenerateStart({
					modelName: e,
					inputSource: "camera"
				}), eM("user"), tA()) : a.c.error("Insufficient credits") : e4()
			}, [e5, e4, e8, tA, e]), tB = async () => {
				if (ee && "camera" === ek) {
					v.f.trackRealtimeInputChanged({
						modelName: e,
						fromInput: "camera",
						toInput: "camera"
					});
					let t = tn.current,
						r = tm.find(e => e.deviceId !== t && (!!t || z(e.label)));
					if (r) {
						let e = I(r.label) ?? ("user" === eL ? "environment" : "user");
						await tz("camera", void 0, r.deviceId, e)
					} else {
						let e = "user" === eL ? "environment" : "user";
						await tz("camera", void 0, void 0, e)
					}
					return
				}
				v.f.trackGenerateStart({
					modelName: e,
					inputSource: "camera"
				});
				let t = tm.find(e => z(e.label));
				tA(t?.deviceId, "environment")
			}, tO = (0, n.useCallback)(() => {
				tU()
			}, [tU]), t_ = "lucy-2.1" === e || "lucy-2.5" === e || "lucy-2.6" === e || "lucy-vton-3.5" === e || "lucy-vton-3.6" === e, tW = (0, n.useRef)(null), tq = (0, n.useCallback)(() => {
				tW.current && (clearTimeout(tW.current), tW.current = null)
			}, []), tV = (0, n.useCallback)((e, t) => {
				tq(), t_ && eI || (tW.current = setTimeout(() => {
					tW.current = null, tt.current?.setPrompt(e, {
						enhance: t
					})
				}, 500))
			}, [tq, t_, eI]), tG = (0, n.useCallback)(e => {
				e5 ? (eh(e), ep(e => e && (0, m.r)(e) ? null : e), tV(e, eB)) : e4()
			}, [e5, e4, tV, eB]), tH = (0, n.useCallback)(async e => {
				tq(), ep(e), eH.current = e;
				let t = (0, m.r)(e);
				if (e.image) try {
					let r = await fetch(e.image),
						i = await r.blob();
					if (eH.current !== e) return;
					let n = e.image.split("/").pop();
					if (!n) throw Error("Invalid preset image path");
					let a = new File([i], n, {
						type: i.type || "image/png",
						lastModified: 0
					});
					if (eU(a), ts.current = a, t) eh(e.shortPrompt || e.prompt);
					else t_ || eh("");
					if (tt.current && ee) {
						let r = tt.current;
						t ? await r.set({
							image: a,
							prompt: e.prompt,
							enhance: e1(e)
						}) : t_ ? await r.set({
							image: a,
							prompt: tc.current,
							enhance: eB
						}) : await r.setImage(a)
					}
				} catch (t) {
					if (eH.current !== e) return;
					console.error("Failed to load preset image:", t), a.c.error("Failed to load preset image")
				} else eU(null), ts.current = null, to.current = null, eh(e.shortPrompt || e.prompt), tt.current && ee && tt.current.setPrompt(e.prompt, {
					enhance: e1(e)
				})
			}, [ee, tq, e1, t_, eB]), tY = (0, d.f)($ ?? null, e => {
				tH(e)
			}), t$ = (0, n.useCallback)(e => {
				e5 ? tH(e) : e4()
			}, [e5, e4, tH]), tK = (0, n.useCallback)(async e => {
				if (eU(e), ts.current = e, ep(null), tq(), eJ && (eh(eQ), tt.current && ee && !eF)) {
					eP(!0);
					try {
						let t = await td(e);
						if (ts.current !== e) return;
						let r = tt.current;
						if (!r) return;
						await r.set({
							prompt: eQ,
							enhance: eB,
							image: t
						})
					} catch (e) {
						console.error("Failed to send image:", e), ew(e instanceof Error ? e.message : "Failed to send image reference")
					} finally {
						eP(!1)
					}
				}
			}, [eJ, ee, eF, eB, tq, eQ, td]), tX = (0, n.useCallback)(async () => {
				if (eU(null), ts.current = null, to.current = null, ep(e => e && !(0, m.r)(e) ? null : e), tt.current && ee) try {
					await tt.current.setImage(null)
				} catch (e) {
					console.error("Failed to clear image:", e)
				}
			}, [ee]), tJ = (0, n.useCallback)(async e => {
				if (eI && tt.current && ee && !eF) {
					tq(), eP(!0);
					try {
						let t = null !== eg,
							r = await tu(eI, t);
						if (!t && to.current?.key !== e$(eI)) return;
						let i = tt.current;
						if (!i) return;
						if (t_) {
							let t = e || eg?.prompt || em,
								n = !e && null !== eg && (0, m.r)(eg);
							await i.set({
								prompt: t || eQ,
								enhance: n && eg ? e1(eg) : eB,
								image: r
							})
						} else await i.setImage(r)
					} catch (e) {
						console.error("Failed to send image:", e), ew(e instanceof Error ? e.message : "Failed to send image reference")
					} finally {
						eP(!1)
					}
				}
			}, [eI, ee, eF, t_, em, eg, eB, e1, tq, eQ, tu]), tQ = (0, n.useCallback)(async e => {
				if (e && tt.current && ee) {
					tq(), eP(!0);
					try {
						await tt.current.setPrompt(e, {
							enhance: eB
						})
					} catch (e) {
						console.error("Failed to send prompt:", e), ew(e instanceof Error ? e.message : "Failed to send prompt")
					} finally {
						eP(!1)
					}
				}
			}, [ee, eB, tq]);
		(0, n.useEffect)(() => {
			!W && ee && tU()
		}, [W, ee, tU]), (0, n.useEffect)(() => {
			if ("pending" === tY || "applied" === tY) return;
			let e = eb[0];
			if (e?.image) ep(e), eH.current = e, eh(e.shortPrompt || e.prompt), fetch(e.image).then(e => e.blob()).then(t => {
				if (eH.current !== e) return;
				let r = e.image?.split("/").pop();
				if (r) {
					let e = new File([t], r, {
						type: t.type || "image/png",
						lastModified: 0
					});
					eU(e), ts.current = e
				}
			}).catch(e => {
				console.error("Failed to load default preset image:", e)
			});
			else eh(O), ep(null)
		}, [O, eb, tY]);
		let tZ = (0, D.useStudioStore)(e => e.fastMode),
			t0 = (0, D.useStudioStore)(e => e.setFastMode),
			t1 = G ? (0, t.jsx)(eu, {
				checked: tZ,
				onCheckedChange: t0,
				costMultiplier: H,
				disabled: ee || er || en
			}) : void 0,
			t2 = (0, D.useStudioStore)(e => e.setIsRealtimeConnected),
			t3 = (0, D.useStudioStore)(e => e.setIsRealtimeConnecting);
		(0, n.useEffect)(() => {
			t2(ee)
		}, [ee, t2]), (0, n.useEffect)(() => {
			t3(er)
		}, [er, t3]), (0, n.useEffect)(() => {
			ex && (console.error(ex), a.c.error(ex))
		}, [ex]), (0, n.useEffect)(() => () => {
			tE()
		}, [tE]);
		let t4 = ee || er || en,
			t5 = ee ? "in_session" : "pre_session",
			t6 = r => (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(ej, {
					presets: eb,
					selectedPreset: eg,
					onSelect: t$,
					scrollable: r,
					compact: r,
					modelName: e,
					phase: t5
				}), eW.length > 0 && (0, t.jsx)(ej, {
					presets: eW,
					selectedPreset: eg,
					onSelect: t$,
					label: "My presets",
					scrollable: !0,
					compact: r,
					className: r ? void 0 : "pt-0",
					modelName: e,
					phase: t5,
					moreHref: "/studio",
					moreLabel: "All presets"
				})]
			}),
			t8 = (0, t.jsx)(eA, {
				compact: "rail" === K,
				onDraftChange: e => {
					tl.current = e
				},
				value: em,
				onChange: tG,
				onSubmit: tQ,
				disabled: !e5,
				submitBlockedReason: t4 ? void 0 : "Select a video input to start",
				placeholder: e5 ? e.startsWith("lucy-2.") ? "Describe how you want to edit the video..." : "Describe the style (e.g. Cyberpunk city)" : "Sign in to start generating...",
				modelName: B,
				referenceImage: eI,
				onImageSelect: tK,
				onImageClear: tX,
				onImageSubmit: tJ,
				showImageReference: eX,
				allowPromptWithImage: t_,
				isSending: eF,
				allowToggleEnhance: e_,
				enhancePrompt: eB,
				onToggleEnhance: () => eO(e => !e),
				sessionControls: t1,
				onSaveAsPreset: e5 ? e => eV({
					prompt: e,
					imageFile: eI,
					modelFamily: $
				}) : void 0
			}),
			t7 = (0, t.jsx)(ec, {
				report: eo,
				reconnecting: el
			}),
			t9 = (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(ef, {
					open: ey,
					onStayActive: tM,
					onDisconnect: tF
				}), eq]
			});
		return "rail" === K ? (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(F.f, {
				input: t8,
				stageLive: ee || en,
				heading: "Prompt",
				headingRequired: !0,
				headerAside: (0, t.jsx)(U.f, {
					creditsPerSecond: q,
					note: "fast" === V ? "Fast mode rate — lower latency and higher throughput." : void 0
				}),
				belowPresets: (0, t.jsx)(ez, {
					isConnected: ee,
					hasRecording: !!tw,
					onDownloadRecording: tk
				}),
				presets: (0, t.jsx)(P.f, {
					builtins: _,
					family: $,
					selectedId: eg?.id ?? null,
					onSelect: t$,
					onRequireAuth: e4,
					modelName: e,
					surface: "realtime",
					phase: t5
				}),
				stage: (0, t.jsx)(eG, {
					localVideoRef: e7,
					remoteVideoRef: e9,
					isConnected: ee,
					isConnecting: er,
					isSwitchingInput: en,
					mirrorMode: "camera" === ek && "user" === eL,
					hasRecording: !!tw,
					connectionStatus: t7,
					onStopSession: tU,
					emptyState: (0, t.jsx)(ev, {
						onSelectSource: tI,
						family: $,
						onOpenCamera: tP
					}),
					pipOverlay: (0, t.jsx)(Q, {
						onSelectSource: tI,
						onSwitchCamera: eE ? tB : void 0,
						align: "end"
					})
				})
			}), t9]
		}) : (0, t.jsxs)("div", {
			className: "h-full p-2 sm:p-3 lg:p-4 min-w-0 w-full flex flex-col",
			children: [(0, t.jsxs)("div", {
				className: "w-full flex-1 min-h-0 min-w-0 flex flex-col space-y-2 sm:space-y-3 lg:space-y-4",
				children: [(0, t.jsxs)("div", {
					className: (0, b.c)("relative w-full", eN && "flex-1 min-h-0"),
					children: [(0, t.jsx)(eY, {
						localVideoRef: e7,
						remoteVideoRef: e9,
						isConnected: ee,
						isConnecting: er,
						isSwitchingInput: en,
						mirrorMode: "camera" === ek && "user" === eL,
						onStartCamera: tP,
						onStopCamera: tU,
						onChangeInput: tO,
						onSelectSource: tI,
						isMobile: eN,
						layout: eN ? "pip" : "side-by-side",
						showInputSelector: !ee && !er && !en,
						inputSelectorContent: (0, t.jsx)(ev, {
							onSelectSource: tI,
							family: $,
							onOpenCamera: tP
						}),
						hasRecording: !!tw,
						onDownloadRecording: tk,
						connectionStatus: t7,
						canUseBackCamera: eE,
						videoSource: ek,
						preferredFacing: eL,
						onSwitchCamera: tB,
						modelType: e
					}), eN && t4 && (0, t.jsx)("div", {
						className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 p-2",
						children: (0, t.jsx)("div", {
							className: "pointer-events-auto bg-background/80 backdrop-blur-md rounded-lg border border-border/50 shadow-md",
							children: t6(!0)
						})
					})]
				}), eN && !t4 && (0, t.jsx)("div", {
					className: "w-full",
					children: t6(!0)
				}), (0, t.jsx)("div", {
					className: "md:hidden flex justify-center w-full",
					children: t8
				}), (0, t.jsx)("div", {
					className: "hidden md:block",
					children: t6(!1)
				}), (0, t.jsx)("div", {
					className: "hidden md:flex justify-center w-full",
					children: t8
				})]
			}), t9, (0, t.jsx)("div", {
				"aria-hidden": !0,
				className: "w-full",
				style: {
					height: "calc(env(safe-area-inset-bottom) + 20px)"
				}
			})]
		})
	}], 785865)
}, 739238, function(e) {
	e.n(e.i(785865))
}, 962858, (e, t, r) => {
	"use strict";
	var i, n = e.i(914374);

	function a(e, t) {
		if (!e) throw "First parameter is required.";
		t = new o(e, t = t || {
			type: "video"
		});
		var r, i = this;

		function n(i) {
			i && (t.initCallback = function() {
				i(), i = t.initCallback = null
			}), (r = new new s(e, t)(e, t)).record(), m("recording"), t.disableLogs || console.log("Initialized recorderType:", r.constructor.name, "for output-type:", t.type)
		}

		function c(e) {
			if (e = e || function() {}, !r) return void g();
			if ("paused" === i.state) {
				i.resumeRecording(), setTimeout(function() {
					c(e)
				}, 1);
				return
			}

			function n(n) {
				if (!r) return void("function" == typeof e.call ? e.call(i, "") : e(""));
				Object.keys(r).forEach(function(e) {
					"function" != typeof r[e] && (i[e] = r[e])
				});
				var a, o = r.blob;
				if (!o)
					if (n) r.blob = o = n;
					else throw "Recording failed.";
				if (o && !t.disableLogs && console.log(o.type, "->", w(o.size)), e) {
					try {
						a = f.createObjectURL(o)
					} catch (e) {}
					"function" == typeof e.call ? e.call(i, a) : e(a)
				}
				t.autoWriteToDisk && d(function(e) {
					var r = {};
					r[t.type + "Blob"] = e, A.Store(r)
				})
			}
			"recording" === i.state || t.disableLogs || console.warn('Recording state should be: "recording", however current state is: ', i.state), t.disableLogs || console.log("Stopped recording " + t.type + " stream."), "gif" !== t.type ? r.stop(n) : (r.stop(), n()), m("stopped")
		}

		function l(e) {
			postMessage(new FileReaderSync().readAsDataURL(e))
		}

		function d(e, i) {
			if (!e) throw "Pass a callback function over getDataURL.";
			var n = i ? i.blob : (r || {}).blob;
			if (!n) {
				t.disableLogs || console.warn("Blob encoder did not finish its job yet."), setTimeout(function() {
					d(e, i)
				}, 1e3);
				return
			}
			if ("u" > typeof Worker && !navigator.mozGetUserMedia) {
				var a = function(e) {
					try {
						var t = f.createObjectURL(new Blob([e.toString(), "this.onmessage =  function (eee) {" + e.name + "(eee.data);}"], {
								type: "application/javascript"
							})),
							r = new Worker(t);
						return f.revokeObjectURL(t), r
					} catch (e) {}
				}(l);
				a.onmessage = function(t) {
					e(t.data)
				}, a.postMessage(n)
			} else {
				var o = new FileReader;
				o.readAsDataURL(n), o.onload = function(t) {
					e(t.target.result)
				}
			}
		}

		function u(e) {
			if (e = e || 0, "paused" === i.state) return void setTimeout(function() {
				u(e)
			}, 1e3);
			if ("stopped" !== i.state) {
				if (e >= i.recordingDuration) return void c(i.onRecordingStopped);
				e += 1e3, setTimeout(function() {
					u(e)
				}, 1e3)
			}
		}

		function m(e) {
			i && (i.state = e, "function" == typeof i.onStateChanged.call ? i.onStateChanged.call(i, e) : i.onStateChanged(e))
		}
		var h = 'It seems that recorder is destroyed or "startRecording" is not invoked for ' + t.type + " recorder.";

		function g() {
			!0 !== t.disableLogs && console.warn(h)
		}
		var p = {
			startRecording: function(a) {
				return (t.disableLogs || console.log("RecordRTC version: ", i.version), a && (t = new o(e, a)), t.disableLogs || console.log("started recording " + t.type + " stream."), r) ? (r.clearRecordedData(), r.record(), m("recording"), i.recordingDuration && u()) : n(function() {
					i.recordingDuration && u()
				}), i
			},
			stopRecording: c,
			pauseRecording: function() {
				if (!r) return void g();
				if ("recording" !== i.state) {
					t.disableLogs || console.warn("Unable to pause the recording. Recording state: ", i.state);
					return
				}
				m("paused"), r.pause(), t.disableLogs || console.log("Paused recording.")
			},
			resumeRecording: function() {
				if (!r) return void g();
				if ("paused" !== i.state) {
					t.disableLogs || console.warn("Unable to resume the recording. Recording state: ", i.state);
					return
				}
				m("recording"), r.resume(), t.disableLogs || console.log("Resumed recording.")
			},
			initRecorder: n,
			setRecordingDuration: function(e, t) {
				if (void 0 === e) throw "recordingDuration is required.";
				if ("number" != typeof e) throw "recordingDuration must be a number.";
				return i.recordingDuration = e, i.onRecordingStopped = t || function() {}, {
					onRecordingStopped: function(e) {
						i.onRecordingStopped = e
					}
				}
			},
			clearRecordedData: function() {
				r ? (r.clearRecordedData(), t.disableLogs || console.log("Cleared old recorded data.")) : g()
			},
			getBlob: function() {
				return r ? r.blob : void g()
			},
			getDataURL: d,
			toURL: function() {
				return r ? f.createObjectURL(r.blob) : void g()
			},
			getInternalRecorder: function() {
				return r
			},
			save: function(e) {
				r ? y(r.blob, e) : g()
			},
			getFromDisk: function(e) {
				r ? a.getFromDisk(t.type, e) : g()
			},
			setAdvertisementArray: function(e) {
				t.advertisement = [];
				for (var r = e.length, i = 0; i < r; i++) t.advertisement.push({
					duration: i,
					image: e[i]
				})
			},
			blob: null,
			bufferSize: 0,
			sampleRate: 0,
			buffer: null,
			reset: function() {
				"recording" !== i.state || t.disableLogs || console.warn("Stop an active recorder."), r && "function" == typeof r.clearRecordedData && r.clearRecordedData(), r = null, m("inactive"), i.blob = null
			},
			onStateChanged: function(e) {
				t.disableLogs || console.log("Recorder state changed:", e)
			},
			state: "inactive",
			getState: function() {
				return i.state
			},
			destroy: function() {
				var e = t.disableLogs;
				t = {
					disableLogs: !0
				}, i.reset(), m("destroyed"), p = i = null, S.AudioContextConstructor && (S.AudioContextConstructor.close(), S.AudioContextConstructor = null), t.disableLogs = e, t.disableLogs || console.log("RecordRTC is destroyed.")
			},
			version: "5.6.2"
		};
		if (!this) return i = p, p;
		for (var v in p) this[v] = p[v];
		return i = this, p
	}

	function o(e, t) {
		return t.recorderType || t.type || (t.audio && t.video ? t.type = "video" : t.audio && !t.video && (t.type = "audio")), t.recorderType && !t.type && (t.recorderType === M || t.recorderType === L || void 0 !== U && t.recorderType === U ? t.type = "video" : t.recorderType === D ? t.type = "gif" : t.recorderType === N ? t.type = "audio" : t.recorderType === T && (k(e, "audio").length && k(e, "video").length || !k(e, "audio").length && k(e, "video").length ? t.type = "video" : k(e, "audio").length && !k(e, "video").length && (t.type = "audio"))), void 0 !== T && "u" > typeof MediaRecorder && "requestData" in MediaRecorder.prototype && (t.mimeType || (t.mimeType = "video/webm"), t.type || (t.type = t.mimeType.split("/")[0]), !t.bitsPerSecond), !t.type && (t.mimeType && (t.type = t.mimeType.split("/")[0]), t.type || (t.type = "audio")), t
	}

	function s(e, t) {
		var r;
		return (v || h || g) && (r = N), "u" > typeof MediaRecorder && "requestData" in MediaRecorder.prototype && !v && (r = T), "video" === t.type && (v || g) && (r = M, void 0 !== U && "u" > typeof ReadableStream && (r = U)), "gif" === t.type && (r = D), "canvas" === t.type && (r = L), C() && r !== L && r !== D && "u" > typeof MediaRecorder && "requestData" in MediaRecorder.prototype && (k(e, "video").length || k(e, "audio").length) && ("audio" === t.type ? "function" == typeof MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported("audio/webm") && (r = T) : "function" == typeof MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported("video/webm") && (r = T)), e instanceof Array && e.length && (r = I), t.recorderType && (r = t.recorderType), !t.disableLogs && r && r.name && console.log("Using recorderType:", r.name || r.constructor.name), !r && b && (r = T), r
	}

	function c(e) {
		this.addStream = function(t) {
			t && (e = t)
		}, this.mediaType = {
			audio: !0,
			video: !0
		}, this.startRecording = function() {
			var t, r = this.mediaType,
				i = this.mimeType || {
					audio: null,
					video: null,
					gif: null
				};
			if ("function" != typeof r.audio && C() && !k(e, "audio").length && (r.audio = !1), "function" != typeof r.video && C() && !k(e, "video").length && (r.video = !1), "function" != typeof r.gif && C() && !k(e, "video").length && (r.gif = !1), !r.audio && !r.video && !r.gif) throw "MediaStream must have either audio or video tracks.";
			if (r.audio && (t = null, "function" == typeof r.audio && (t = r.audio), this.audioRecorder = new a(e, {
					type: "audio",
					bufferSize: this.bufferSize,
					sampleRate: this.sampleRate,
					numberOfAudioChannels: this.numberOfAudioChannels || 2,
					disableLogs: this.disableLogs,
					recorderType: t,
					mimeType: i.audio,
					timeSlice: this.timeSlice,
					onTimeStamp: this.onTimeStamp
				}), r.video || this.audioRecorder.startRecording()), r.video) {
				t = null, "function" == typeof r.video && (t = r.video);
				var n = e;
				if (C() && r.audio && "function" == typeof r.audio) {
					var o = k(e, "video")[0];
					p ? ((n = new x).addTrack(o), t && t === M && (t = T)) : (n = new x).addTrack(o)
				}
				this.videoRecorder = new a(n, {
					type: "video",
					video: this.video,
					canvas: this.canvas,
					frameInterval: this.frameInterval || 10,
					disableLogs: this.disableLogs,
					recorderType: t,
					mimeType: i.video,
					timeSlice: this.timeSlice,
					onTimeStamp: this.onTimeStamp,
					workerPath: this.workerPath,
					webAssemblyPath: this.webAssemblyPath,
					frameRate: this.frameRate,
					bitrate: this.bitrate
				}), r.audio || this.videoRecorder.startRecording()
			}
			if (r.audio && r.video) {
				var s = this,
					c = !0 === C();
				r.audio instanceof N && r.video ? c = !1 : !0 !== r.audio && !0 !== r.video && r.audio !== r.video && (c = !1), !0 === c ? (s.audioRecorder = null, s.videoRecorder.startRecording()) : s.videoRecorder.initRecorder(function() {
					s.audioRecorder.initRecorder(function() {
						s.videoRecorder.startRecording(), s.audioRecorder.startRecording()
					})
				})
			}
			r.gif && (t = null, "function" == typeof r.gif && (t = r.gif), this.gifRecorder = new a(e, {
				type: "gif",
				frameRate: this.frameRate || 200,
				quality: this.quality || 10,
				disableLogs: this.disableLogs,
				recorderType: t,
				mimeType: i.gif
			}), this.gifRecorder.startRecording())
		}, this.stopRecording = function(e) {
			e = e || function() {}, this.audioRecorder && this.audioRecorder.stopRecording(function(t) {
				e(t, "audio")
			}), this.videoRecorder && this.videoRecorder.stopRecording(function(t) {
				e(t, "video")
			}), this.gifRecorder && this.gifRecorder.stopRecording(function(t) {
				e(t, "gif")
			})
		}, this.pauseRecording = function() {
			this.audioRecorder && this.audioRecorder.pauseRecording(), this.videoRecorder && this.videoRecorder.pauseRecording(), this.gifRecorder && this.gifRecorder.pauseRecording()
		}, this.resumeRecording = function() {
			this.audioRecorder && this.audioRecorder.resumeRecording(), this.videoRecorder && this.videoRecorder.resumeRecording(), this.gifRecorder && this.gifRecorder.resumeRecording()
		}, this.getBlob = function(e) {
			var t = {};
			return this.audioRecorder && (t.audio = this.audioRecorder.getBlob()), this.videoRecorder && (t.video = this.videoRecorder.getBlob()), this.gifRecorder && (t.gif = this.gifRecorder.getBlob()), e && e(t), t
		}, this.destroy = function() {
			this.audioRecorder && (this.audioRecorder.destroy(), this.audioRecorder = null), this.videoRecorder && (this.videoRecorder.destroy(), this.videoRecorder = null), this.gifRecorder && (this.gifRecorder.destroy(), this.gifRecorder = null)
		}, this.getDataURL = function(e) {
			function t(e, t) {
				if ("u" > typeof Worker) {
					var r = function(e) {
						var t, r = f.createObjectURL(new Blob([e.toString(), "this.onmessage =  function (eee) {" + e.name + "(eee.data);}"], {
								type: "application/javascript"
							})),
							i = new Worker(r);
						if (void 0 !== f) t = f;
						else if ("u" > typeof webkitURL) t = webkitURL;
						else throw "Neither URL nor webkitURL detected.";
						return t.revokeObjectURL(r), i
					}(function(e) {
						postMessage(new FileReaderSync().readAsDataURL(e))
					});
					r.onmessage = function(e) {
						t(e.data)
					}, r.postMessage(e)
				} else {
					var i = new FileReader;
					i.readAsDataURL(e), i.onload = function(e) {
						t(e.target.result)
					}
				}
			}
			this.getBlob(function(r) {
				r.audio && r.video ? t(r.audio, function(i) {
					t(r.video, function(t) {
						e({
							audio: i,
							video: t
						})
					})
				}) : r.audio ? t(r.audio, function(t) {
					e({
						audio: t
					})
				}) : r.video && t(r.video, function(t) {
					e({
						video: t
					})
				})
			})
		}, this.writeToDisk = function() {
			a.writeToDisk({
				audio: this.audioRecorder,
				video: this.videoRecorder,
				gif: this.gifRecorder
			})
		}, this.save = function(e) {
			(e = e || {
				audio: !0,
				video: !0,
				gif: !0
			}).audio && this.audioRecorder && this.audioRecorder.save("string" == typeof e.audio ? e.audio : ""), e.video && this.videoRecorder && this.videoRecorder.save("string" == typeof e.video ? e.video : ""), e.gif && this.gifRecorder && this.gifRecorder.save("string" == typeof e.gif ? e.gif : "")
		}
	}
	a.version = "5.6.2", t.exports = a, "function" == typeof define && define.amd && void 0 !== a && e.v(a), a.getFromDisk = function(e, t) {
		if (!t) throw "callback is mandatory.";
		console.log("Getting recorded " + ("all" === e ? "blobs" : e + " blob ") + " from disk!"), A.Fetch(function(r, i) {
			"all" !== e && i === e + "Blob" && t && t(r), "all" === e && t && t(r, i.replace("Blob", ""))
		})
	}, a.writeToDisk = function(e) {
		console.log("Writing recorded blob(s) to disk!"), (e = e || {}).audio && e.video && e.gif ? e.audio.getDataURL(function(t) {
			e.video.getDataURL(function(r) {
				e.gif.getDataURL(function(e) {
					A.Store({
						audioBlob: t,
						videoBlob: r,
						gifBlob: e
					})
				})
			})
		}) : e.audio && e.video ? e.audio.getDataURL(function(t) {
			e.video.getDataURL(function(e) {
				A.Store({
					audioBlob: t,
					videoBlob: e
				})
			})
		}) : e.audio && e.gif ? e.audio.getDataURL(function(t) {
			e.gif.getDataURL(function(e) {
				A.Store({
					audioBlob: t,
					gifBlob: e
				})
			})
		}) : e.video && e.gif ? e.video.getDataURL(function(t) {
			e.gif.getDataURL(function(e) {
				A.Store({
					videoBlob: t,
					gifBlob: e
				})
			})
		}) : e.audio ? e.audio.getDataURL(function(e) {
			A.Store({
				audioBlob: e
			})
		}) : e.video ? e.video.getDataURL(function(e) {
			A.Store({
				videoBlob: e
			})
		}) : e.gif && e.gif.getDataURL(function(e) {
			A.Store({
				gifBlob: e
			})
		})
	}, c.getFromDisk = a.getFromDisk, c.writeToDisk = a.writeToDisk, a.MRecordRTC = c, (i = e.g) && "u" < typeof window && (e.g.navigator = {
		userAgent: "Fake/5.0 (FakeOS) AppleWebKit/123 (KHTML, like Gecko) Fake/12.3.4567.89 Fake/123.45",
		getUserMedia: function() {}
	}, e.g.console || (e.g.console = {}), (void 0 === e.g.console.log || void 0 === e.g.console.error) && (e.g.console.error = e.g.console.log = e.g.console.log || function() {
		console.log(arguments)
	}), "u" < typeof document && (i.document = {
		documentElement: {
			appendChild: function() {
				return ""
			}
		}
	}, document.createElement = document.captureStream = document.mozCaptureStream = function() {
		var e = {
			getContext: function() {
				return e
			},
			play: function() {},
			pause: function() {},
			drawImage: function() {},
			toDataURL: function() {
				return ""
			},
			style: {}
		};
		return e
	}, i.HTMLVideoElement = function() {}), "u" < typeof location && (i.location = {
		protocol: "file:",
		href: "",
		hash: ""
	}), "u" < typeof screen && (i.screen = {
		width: 0,
		height: 0
	}), void 0 === f && (i.URL = {
		createObjectURL: function() {
			return ""
		},
		revokeObjectURL: function() {
			return ""
		}
	}), i.window = e.g);
	var l = window.requestAnimationFrame;
	if (void 0 === l) {
		if ("u" > typeof webkitRequestAnimationFrame) l = webkitRequestAnimationFrame;
		else if ("u" > typeof mozRequestAnimationFrame) l = mozRequestAnimationFrame;
		else if ("u" > typeof msRequestAnimationFrame) l = msRequestAnimationFrame;
		else if (void 0 === l) {
			var d = 0;
			l = function(e, t) {
				var r = new Date().getTime(),
					i = Math.max(0, 16 - (r - d)),
					n = setTimeout(function() {
						e(r + i)
					}, i);
				return d = r + i, n
			}
		}
	}
	var u = window.cancelAnimationFrame;
	void 0 === u && ("u" > typeof webkitCancelAnimationFrame ? u = webkitCancelAnimationFrame : "u" > typeof mozCancelAnimationFrame ? u = mozCancelAnimationFrame : "u" > typeof msCancelAnimationFrame ? u = msCancelAnimationFrame : void 0 === u && (u = function(e) {
		clearTimeout(e)
	}));
	var m = window.AudioContext;
	void 0 === m && ("u" > typeof webkitAudioContext && (m = webkitAudioContext), "u" > typeof mozAudioContext && (m = mozAudioContext));
	var f = window.URL;
	void 0 === f && "u" > typeof webkitURL && (f = webkitURL), "u" > typeof navigator && void 0 === navigator.getUserMedia && (void 0 !== navigator.webkitGetUserMedia && (navigator.getUserMedia = navigator.webkitGetUserMedia), void 0 !== navigator.mozGetUserMedia && (navigator.getUserMedia = navigator.mozGetUserMedia));
	var h = -1 !== navigator.userAgent.indexOf("Edge") && (!!navigator.msSaveBlob || !!navigator.msSaveOrOpenBlob),
		g = !!window.opera || -1 !== navigator.userAgent.indexOf("OPR/"),
		p = navigator.userAgent.toLowerCase().indexOf("firefox") > -1 && "netscape" in window && / rv:/.test(navigator.userAgent),
		v = !g && !h && !!navigator.webkitGetUserMedia || R() || -1 !== navigator.userAgent.toLowerCase().indexOf("chrome/"),
		b = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	b && !v && -1 !== navigator.userAgent.indexOf("CriOS") && (b = !1, v = !0);
	var x = window.MediaStream;

	function w(e) {
		if (0 === e) return "0 Bytes";
		var t = parseInt(Math.floor(Math.log(e) / Math.log(1e3)), 10);
		return (e / Math.pow(1e3, t)).toPrecision(3) + " " + ["Bytes", "KB", "MB", "GB", "TB"][t]
	}

	function y(e, t) {
		if (!e) throw "Blob object is required.";
		if (!e.type) try {
			e.type = "video/webm"
		} catch (e) {}
		var r = (e.type || "video/webm").split("/")[1];
		if (-1 !== r.indexOf(";") && (r = r.split(";")[0]), t && -1 !== t.indexOf(".")) {
			var i = t.split(".");
			t = i[0], r = i[1]
		}
		var n = (t || Math.round(0x2540be3ff * Math.random()) + 0x34fb5e38) + "." + r;
		if (void 0 !== navigator.msSaveOrOpenBlob) return navigator.msSaveOrOpenBlob(e, n);
		if (void 0 !== navigator.msSaveBlob) return navigator.msSaveBlob(e, n);
		var a = document.createElement("a");
		a.href = f.createObjectURL(e), a.download = n, a.style = "display:none;opacity:0;color:transparent;", (document.body || document.documentElement).appendChild(a), "function" == typeof a.click ? a.click() : (a.target = "_blank", a.dispatchEvent(new MouseEvent("click", {
			view: window,
			bubbles: !0,
			cancelable: !0
		}))), f.revokeObjectURL(a.href)
	}

	function R() {
		return !!("u" > typeof window && "object" == typeof window.process && "renderer" === window.process.type || void 0 !== n.default && "object" == typeof n.default.versions && n.default.versions.electron || "object" == typeof navigator && "string" == typeof navigator.userAgent && navigator.userAgent.indexOf("Electron") >= 0)
	}

	function k(e, t) {
		return e && e.getTracks ? e.getTracks().filter(function(e) {
			return e.kind === (t || "audio")
		}) : []
	}

	function j(e, t) {
		"srcObject" in t ? t.srcObject = e : "mozSrcObject" in t ? t.mozSrcObject = e : t.srcObject = e
	}
	void 0 === x && "u" > typeof webkitMediaStream && (x = webkitMediaStream), void 0 !== x && void 0 === x.prototype.stop && (x.prototype.stop = function() {
		this.getTracks().forEach(function(e) {
			e.stop()
		})
	}), a.invokeSaveAsDialog = y, a.getTracks = k, a.getSeekableBlob = function(e, t) {
		if ("u" < typeof EBML) throw Error("Please link: https://www.webrtc-experiment.com/EBML.js");
		var r = new EBML.Reader,
			i = new EBML.Decoder,
			n = EBML.tools,
			a = new FileReader;
		a.onload = function(e) {
			i.decode(this.result).forEach(function(e) {
				r.read(e)
			}), r.stop(), t(new Blob([n.makeMetadataSeekable(r.metadatas, r.duration, r.cues), this.result.slice(r.metadataSize)], {
				type: "video/webm"
			}))
		}, a.readAsArrayBuffer(e)
	}, a.bytesToSize = w, a.isElectron = R;
	var S = {};

	function C() {
		if (p || b || h) return !0;
		navigator.appVersion;
		var e, t, r = navigator.userAgent,
			i = "" + parseFloat(navigator.appVersion),
			n = parseInt(navigator.appVersion, 10);
		return (v || g) && (e = r.indexOf("Chrome"), i = r.substring(e + 7)), -1 !== (t = i.indexOf(";")) && (i = i.substring(0, t)), -1 !== (t = i.indexOf(" ")) && (i = i.substring(0, t)), isNaN(n = parseInt("" + i, 10)) && (i = "" + parseFloat(navigator.appVersion), n = parseInt(navigator.appVersion, 10)), n >= 49
	}

	function T(e, t) {
		var r, i, n = this;
		if (void 0 === e) throw 'First argument "MediaStream" is required.';
		if ("u" < typeof MediaRecorder) throw "Your browser does not support the Media Recorder API. Please try other modules e.g. WhammyRecorder or StereoAudioRecorder.";
		"audio" === (t = t || {
			mimeType: "video/webm"
		}).type && (k(e, "video").length && k(e, "audio").length && (navigator.mozGetUserMedia ? (r = new x).addTrack(k(e, "audio")[0]) : r = new x(k(e, "audio")), e = r), t.mimeType && -1 !== t.mimeType.toString().toLowerCase().indexOf("audio") || (t.mimeType = v ? "audio/webm" : "audio/ogg"), t.mimeType && "audio/ogg" !== t.mimeType.toString().toLowerCase() && navigator.mozGetUserMedia && (t.mimeType = "audio/ogg"));
		var a = [];

		function o() {
			n.timestamps.push(new Date().getTime()), "function" == typeof t.onTimeStamp && t.onTimeStamp(n.timestamps[n.timestamps.length - 1], n.timestamps)
		}

		function s(e) {
			return i && i.mimeType ? i.mimeType : e.mimeType || "video/webm"
		}

		function c() {
			a = [], i = null, n.timestamps = []
		}
		this.getArrayOfBlobs = function() {
			return a
		}, this.record = function() {
			n.blob = null, n.clearRecordedData(), n.timestamps = [], l = [], a = [];
			var r = t;
			t.disableLogs || console.log("Passing following config over MediaRecorder API.", r), i && (i = null), v && !C() && (r = "video/vp8"), "function" == typeof MediaRecorder.isTypeSupported && r.mimeType && !MediaRecorder.isTypeSupported(r.mimeType) && (t.disableLogs || console.warn("MediaRecorder API seems unable to record mimeType:", r.mimeType), r.mimeType = "audio" === t.type ? "audio/webm" : "video/webm");
			try {
				i = new MediaRecorder(e, r), t.mimeType = r.mimeType
			} catch (t) {
				i = new MediaRecorder(e)
			}
			r.mimeType && !MediaRecorder.isTypeSupported && "canRecordMimeType" in i && !1 === i.canRecordMimeType(r.mimeType) && !t.disableLogs && console.warn("MediaRecorder API seems unable to record mimeType:", r.mimeType), i.ondataavailable = function(e) {
				if (e.data && l.push("ondataavailable: " + w(e.data.size)), "number" == typeof t.timeSlice) {
					if (e.data && e.data.size && (a.push(e.data), o(), "function" == typeof t.ondataavailable)) {
						var i = t.getNativeBlob ? e.data : new Blob([e.data], {
							type: s(r)
						});
						t.ondataavailable(i)
					}
					return
				}
				if (!e.data || !e.data.size || e.data.size < 100 || n.blob) {
					n.recordingCallback && (n.recordingCallback(new Blob([], {
						type: s(r)
					})), n.recordingCallback = null);
					return
				}
				n.blob = t.getNativeBlob ? e.data : new Blob([e.data], {
					type: s(r)
				}), n.recordingCallback && (n.recordingCallback(n.blob), n.recordingCallback = null)
			}, i.onstart = function() {
				l.push("started")
			}, i.onpause = function() {
				l.push("paused")
			}, i.onresume = function() {
				l.push("resumed")
			}, i.onstop = function() {
				l.push("stopped")
			}, i.onerror = function(e) {
				e && (e.name || (e.name = "UnknownError"), l.push("error: " + e), t.disableLogs || (-1 !== e.name.toString().toLowerCase().indexOf("invalidstate") ? console.error("The MediaRecorder is not in a state in which the proposed operation is allowed to be executed.", e) : -1 !== e.name.toString().toLowerCase().indexOf("notsupported") ? console.error("MIME type (", r.mimeType, ") is not supported.", e) : -1 !== e.name.toString().toLowerCase().indexOf("security") ? console.error("MediaRecorder security error", e) : "OutOfMemory" === e.name ? console.error("The UA has exhaused the available memory. User agents SHOULD provide as much additional information as possible in the message attribute.", e) : "IllegalStreamModification" === e.name ? console.error("A modification to the stream has occurred that makes it impossible to continue recording. An example would be the addition of a Track while recording is occurring. User agents SHOULD provide as much additional information as possible in the message attribute.", e) : "OtherRecordingError" === e.name ? console.error("Used for an fatal error other than those listed above. User agents SHOULD provide as much additional information as possible in the message attribute.", e) : "GenericError" === e.name ? console.error("The UA cannot provide the codec or recording option that has been requested.", e) : console.error("MediaRecorder Error", e)), function() {
					if (!n.manuallyStopped && i && "inactive" === i.state) {
						delete t.timeslice, i.start(6e5);
						return
					}
					setTimeout(void 0, 1e3)
				}(), "inactive" !== i.state && "stopped" !== i.state && i.stop())
			}, "number" == typeof t.timeSlice ? (o(), i.start(t.timeSlice)) : i.start(36e5), t.initCallback && t.initCallback()
		}, this.timestamps = [], this.stop = function(e) {
			e = e || function() {}, n.manuallyStopped = !0, i && (this.recordingCallback = e, "recording" === i.state && i.stop(), "number" == typeof t.timeSlice && setTimeout(function() {
				n.blob = new Blob(a, {
					type: s(t)
				}), n.recordingCallback(n.blob)
			}, 100))
		}, this.pause = function() {
			i && "recording" === i.state && i.pause()
		}, this.resume = function() {
			i && "paused" === i.state && i.resume()
		}, this.clearRecordedData = function() {
			i && "recording" === i.state && n.stop(c), c()
		}, this.getInternalRecorder = function() {
			return i
		}, this.blob = null, this.getState = function() {
			return i && i.state || "inactive"
		};
		var l = [];
		this.getAllStates = function() {
			return l
		}, void 0 === t.checkForInactiveTracks && (t.checkForInactiveTracks = !1);
		var n = this;
		! function r() {
			if (i && !1 !== t.checkForInactiveTracks) {
				if (!1 === function() {
						if ("active" in e) {
							if (!e.active) return !1
						} else if ("ended" in e && e.ended) return !1;
						return !0
					}()) {
					t.disableLogs || console.log("MediaStream seems stopped."), n.stop();
					return
				}
				setTimeout(r, 1e3)
			}
		}(), this.name = "MediaStreamRecorder", this.toString = function() {
			return this.name
		}
	}

	function N(e, t) {
		if (!k(e, "audio").length) throw "Your stream has no audio tracks.";
		var r, i = this,
			n = [],
			o = [],
			s = !1,
			c = 0,
			l = 2,
			d = (t = t || {}).desiredSampRate;

		function u() {
			if (!1 === t.checkForInactiveTracks) return !0;
			if ("active" in e) {
				if (!e.active) return !1
			} else if ("ended" in e && e.ended) return !1;
			return !0
		}

		function m(e, t) {
			function r(e, t) {
				var r, i = e.numberOfAudioChannels,
					n = e.leftBuffers.slice(0),
					a = e.rightBuffers.slice(0),
					o = e.sampleRate,
					s = e.internalInterleavedLength,
					c = e.desiredSampRate;

				function l(e, t, r) {
					var i = Math.round(e.length * (t / r)),
						n = [],
						a = Number((e.length - 1) / (i - 1));
					n[0] = e[0];
					for (var o = 1; o < i - 1; o++) {
						var s, c, l = o * a,
							d = Number(Math.floor(l)).toFixed(),
							u = Number(Math.ceil(l)).toFixed(),
							m = l - d;
						n[o] = (s = e[d], c = e[u], s + (c - s) * m)
					}
					return n[i - 1] = e[e.length - 1], n
				}

				function d(e, t) {
					for (var r = new Float64Array(t), i = 0, n = e.length, a = 0; a < n; a++) {
						var o = e[a];
						r.set(o, i), i += o.length
					}
					return r
				}

				function u(e, t, r) {
					for (var i = r.length, n = 0; n < i; n++) e.setUint8(t + n, r.charCodeAt(n))
				}
				2 === i && (n = d(n, s), a = d(a, s), c && (n = l(n, c, o), a = l(a, c, o))), 1 === i && (n = d(n, s), c && (n = l(n, c, o))), c && (o = c), 2 === i && (r = function(e, t) {
					for (var r = e.length + t.length, i = new Float64Array(r), n = 0, a = 0; a < r;) i[a++] = e[n], i[a++] = t[n], n++;
					return i
				}(n, a)), 1 === i && (r = n);
				var m = r.length,
					f = new ArrayBuffer(44 + 2 * m),
					h = new DataView(f);
				u(h, 0, "RIFF"), h.setUint32(4, 36 + 2 * m, !0), u(h, 8, "WAVE"), u(h, 12, "fmt "), h.setUint32(16, 16, !0), h.setUint16(20, 1, !0), h.setUint16(22, i, !0), h.setUint32(24, o, !0), h.setUint32(28, o * i * 2, !0), h.setUint16(32, 2 * i, !0), h.setUint16(34, 16, !0), u(h, 36, "data"), h.setUint32(40, 2 * m, !0);
				for (var g = 44, p = 0; p < m; p++) h.setInt16(g, 32767 * r[p], !0), g += 2;
				if (t) return t({
					buffer: f,
					view: h
				});
				postMessage({
					buffer: f,
					view: h
				})
			}
			if (e.noWorker) return void r(e, function(e) {
				t(e.buffer, e.view)
			});
			var i, n, a, o = (i = r, (a = new Worker(n = f.createObjectURL(new Blob([i.toString(), ";this.onmessage =  function (eee) {" + i.name + "(eee.data);}"], {
				type: "application/javascript"
			})))).workerURL = n, a);
			o.onmessage = function(e) {
				t(e.data.buffer, e.data.view), f.revokeObjectURL(o.workerURL), o.terminate()
			}, o.postMessage(e)
		}!0 === t.leftChannel && (l = 1), 1 === t.numberOfAudioChannels && (l = 1), (!l || l < 1) && (l = 2), t.disableLogs || console.log("StereoAudioRecorder is set to record number of channels: " + l), void 0 === t.checkForInactiveTracks && (t.checkForInactiveTracks = !0), this.record = function() {
			if (!1 === u()) throw "Please make sure MediaStream is active.";
			w(), R = x = !1, s = !0, void 0 !== t.timeSlice && function e() {
				s && "function" == typeof t.ondataavailable && void 0 !== t.timeSlice && (j.left.length ? (m({
					desiredSampRate: d,
					sampleRate: b,
					numberOfAudioChannels: l,
					internalInterleavedLength: j.recordingLength,
					leftBuffers: j.left,
					rightBuffers: 1 === l ? [] : j.right
				}, function(r, i) {
					var n = new Blob([i], {
						type: "audio/wav"
					});
					t.ondataavailable(n), setTimeout(e, t.timeSlice)
				}), j = {
					left: [],
					right: [],
					recordingLength: 0
				}) : setTimeout(e, t.timeSlice))
			}()
		}, this.stop = function(e) {
			e = e || function() {}, s = !1, m({
				desiredSampRate: d,
				sampleRate: b,
				numberOfAudioChannels: l,
				internalInterleavedLength: c,
				leftBuffers: n,
				rightBuffers: 1 === l ? [] : o,
				noWorker: t.noWorker
			}, function(t, r) {
				i.blob = new Blob([r], {
					type: "audio/wav"
				}), i.buffer = new ArrayBuffer(r.buffer.byteLength), i.view = r, i.sampleRate = d || b, i.bufferSize = v, i.length = c, R = !1, e && e(i.blob)
			})
		}, void 0 === a.Storage && (a.Storage = {
			AudioContextConstructor: null,
			AudioContext: window.AudioContext || window.webkitAudioContext
		}), a.Storage.AudioContextConstructor && "closed" !== a.Storage.AudioContextConstructor.state || (a.Storage.AudioContextConstructor = new a.Storage.AudioContext);
		var h = a.Storage.AudioContextConstructor,
			g = h.createMediaStreamSource(e),
			p = [0, 256, 512, 1024, 2048, 4096, 8192, 16384],
			v = void 0 === t.bufferSize ? 4096 : t.bufferSize;
		if (-1 !== p.indexOf(v) || t.disableLogs || console.log("Legal values for buffer-size are " + JSON.stringify(p, null, "	")), h.createJavaScriptNode) r = h.createJavaScriptNode(v, l, l);
		else if (h.createScriptProcessor) r = h.createScriptProcessor(v, l, l);
		else throw "WebAudio API has no support on this browser.";
		g.connect(r), t.bufferSize || (v = r.bufferSize);
		var b = void 0 !== t.sampleRate ? t.sampleRate : h.sampleRate || 44100;
		(b < 22050 || b > 96e3) && !t.disableLogs && console.log("sample-rate must be under range 22050 and 96000."), !t.disableLogs && t.desiredSampRate && console.log("Desired sample-rate: " + t.desiredSampRate);
		var x = !1;

		function w() {
			o = [], c = 0, R = !1, s = !1, x = !1, h = null, i.leftchannel = n = [], i.rightchannel = o, i.numberOfAudioChannels = l, i.desiredSampRate = d, i.sampleRate = b, i.recordingLength = c, j = {
				left: [],
				right: [],
				recordingLength: 0
			}
		}

		function y() {
			r && (r.onaudioprocess = null, r.disconnect(), r = null), g && (g.disconnect(), g = null), w()
		}
		this.pause = function() {
			x = !0
		}, this.resume = function() {
			if (!1 === u()) throw "Please make sure MediaStream is active.";
			if (!s) {
				t.disableLogs || console.log("Seems recording has been restarted."), this.record();
				return
			}
			x = !1
		}, this.clearRecordedData = function() {
			t.checkForInactiveTracks = !1, s && this.stop(y), y()
		}, this.name = "StereoAudioRecorder", this.toString = function() {
			return this.name
		};
		var R = !1;
		r.onaudioprocess = function(e) {
			if (!x) {
				if (!1 === u() && (t.disableLogs || console.log("MediaStream seems stopped."), r.disconnect(), s = !1), !s) {
					g && (g.disconnect(), g = null);
					return
				}!R && (R = !0, t.onAudioProcessStarted && t.onAudioProcessStarted(), t.initCallback && t.initCallback());
				var a = new Float32Array(e.inputBuffer.getChannelData(0));
				if (n.push(a), 2 === l) {
					var d = new Float32Array(e.inputBuffer.getChannelData(1));
					o.push(d)
				}
				i.recordingLength = c += v, void 0 !== t.timeSlice && (j.recordingLength += v, j.left.push(a), 2 === l && j.right.push(d))
			}
		}, h.createMediaStreamDestination ? r.connect(h.createMediaStreamDestination()) : r.connect(h.destination), this.leftchannel = n, this.rightchannel = o, this.numberOfAudioChannels = l, this.desiredSampRate = d, this.sampleRate = b, i.recordingLength = c;
		var j = {
			left: [],
			right: [],
			recordingLength: 0
		}
	}

	function L(e, t) {
		if ("u" < typeof html2canvas) throw "Please link: https://www.webrtc-experiment.com/screenshot.js";
		(t = t || {}).frameInterval || (t.frameInterval = 10);
		var r, i, n, a = !1;
		["captureStream", "mozCaptureStream", "webkitCaptureStream"].forEach(function(e) {
			e in document.createElement("canvas") && (a = !0)
		});
		var o = (!!window.webkitRTCPeerConnection || !!window.webkitGetUserMedia) && !!window.chrome,
			s = 50,
			c = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		if (o && c && c[2] && (s = parseInt(c[2], 10)), o && s < 52 && (a = !1), t.useWhammyRecorder && (a = !1), a)
			if (t.disableLogs || console.log("Your browser supports both MediRecorder API and canvas.captureStream!"), e instanceof HTMLCanvasElement) r = e;
			else if (e instanceof CanvasRenderingContext2D) r = e.canvas;
		else throw "Please pass either HTMLCanvasElement or CanvasRenderingContext2D.";
		else navigator.mozGetUserMedia && !t.disableLogs && console.error("Canvas recording is NOT supported in Firefox.");
		this.record = function() {
			if (n = !0, a && !t.useWhammyRecorder) {
				var o;
				"captureStream" in r ? o = r.captureStream(25) : "mozCaptureStream" in r ? o = r.mozCaptureStream(25) : "webkitCaptureStream" in r && (o = r.webkitCaptureStream(25));
				try {
					var s = new x;
					s.addTrack(k(o, "video")[0]), o = s
				} catch (e) {}
				if (!o) throw "captureStream API are NOT available.";
				(i = new T(o, {
					mimeType: t.mimeType || "video/webm"
				})).record()
			} else m.frames = [], u = new Date().getTime(),
				function r() {
					if (l) return u = new Date().getTime(), setTimeout(r, 500);
					if ("canvas" === e.nodeName.toLowerCase()) {
						var i, a, o = new Date().getTime() - u;
						u = new Date().getTime(), m.frames.push({
							image: (a = (i = document.createElement("canvas")).getContext("2d"), i.width = e.width, i.height = e.height, a.drawImage(e, 0, 0), i),
							duration: o
						}), n && setTimeout(r, t.frameInterval);
						return
					}
					html2canvas(e, {
						grabMouse: void 0 === t.showMousePointer || t.showMousePointer,
						onrendered: function(e) {
							var i = new Date().getTime() - u;
							if (!i) return setTimeout(r, t.frameInterval);
							u = new Date().getTime(), m.frames.push({
								image: e.toDataURL("image/webp", 1),
								duration: i
							}), n && setTimeout(r, t.frameInterval)
						}
					})
				}();
			t.initCallback && t.initCallback()
		}, this.getWebPImages = function(r) {
			if ("canvas" !== e.nodeName.toLowerCase()) return void r();
			var i = m.frames.length;
			m.frames.forEach(function(e, r) {
				var n = i - r;
				t.disableLogs || console.log(n + "/" + i + " frames remaining"), t.onEncodingCallback && t.onEncodingCallback(n, i);
				var a = e.image.toDataURL("image/webp", 1);
				m.frames[r].image = a
			}), t.disableLogs || console.log("Generating WebM"), r()
		}, this.stop = function(e) {
			n = !1;
			var r = this;
			a && i ? i.stop(e) : this.getWebPImages(function() {
				m.compile(function(i) {
					t.disableLogs || console.log("Recording finished!"), r.blob = i, r.blob.forEach && (r.blob = new Blob([], {
						type: "video/webm"
					})), e && e(r.blob), m.frames = []
				})
			})
		};
		var l = !1;

		function d() {
			m.frames = [], n = !1, l = !1
		}
		this.pause = function() {
			if (l = !0, i instanceof T) return void i.pause()
		}, this.resume = function() {
			(l = !1, i instanceof T) ? i.resume(): n || this.record()
		}, this.clearRecordedData = function() {
			n && this.stop(d), d()
		}, this.name = "CanvasRecorder", this.toString = function() {
			return this.name
		};
		var u = new Date().getTime(),
			m = new E.Video(100)
	}

	function M(e, t) {
		(t = t || {}).frameInterval || (t.frameInterval = 10), t.disableLogs || console.log("Using frames-interval:", t.frameInterval), this.record = function() {
			t.width || (t.width = 320), t.height || (t.height = 240), t.video || (t.video = {
					width: t.width,
					height: t.height
				}), t.canvas || (t.canvas = {
					width: t.width,
					height: t.height
				}), c.width = t.canvas.width || 320, c.height = t.canvas.height || 240, l = c.getContext("2d"), t.video && t.video instanceof HTMLVideoElement ? (r = t.video.cloneNode(), t.initCallback && t.initCallback()) : (j(e, r = document.createElement("video")), r.onloadedmetadata = function() {
					t.initCallback && t.initCallback()
				}, r.width = t.video.width, r.height = t.video.height), r.muted = !0, r.play(), i = new Date().getTime(), n = new E.Video, t.disableLogs || (console.log("canvas resolutions", c.width, "*", c.height), console.log("video width/height", r.width || c.width, "*", r.height || c.height)),
				function e(t) {
					t = void 0 !== t ? t : 10;
					var s = new Date().getTime() - i;
					return s ? o ? (i = new Date().getTime(), setTimeout(e, 100)) : void(i = new Date().getTime(), r.paused && r.play(), l.drawImage(r, 0, 0, c.width, c.height), n.frames.push({
						duration: s,
						image: c.toDataURL("image/webp")
					}), !a && setTimeout(e, t, t)) : setTimeout(e, t, t)
				}(t.frameInterval)
		};
		var r, i, n, a = !1;
		this.stop = function(e) {
			e = e || function() {}, a = !0;
			var r = this;
			setTimeout(function() {
				var i, a, o, s, l, d, u, m, f, h, g;
				i = n.frames, a = function(i) {
						n.frames = i, t.advertisement && t.advertisement.length && (n.frames = t.advertisement.concat(n.frames)), n.compile(function(t) {
							r.blob = t, r.blob.forEach && (r.blob = new Blob([], {
								type: "video/webm"
							})), e && e(r.blob)
						})
					}, (o = document.createElement("canvas")).width = c.width, o.height = c.height, s = o.getContext("2d"), l = [], d = i.length, u = Math.sqrt(195075), m = !1, h = -1, g = (f = {
						length: d,
						functionToLoop: function(e, t) {
							var r, n, a, o = function() {
								!m && a - r <= 0 * a || (m = !0, l.push(i[t])), e()
							};
							if (m) o();
							else {
								var d = new Image;
								d.onload = function() {
									s.drawImage(d, 0, 0, c.width, c.height);
									var e = s.getImageData(0, 0, c.width, c.height);
									r = 0, n = e.data.length, a = e.data.length / 4;
									for (var t = 0; t < n; t += 4) {
										var i = {
											r: e.data[t],
											g: e.data[t + 1],
											b: e.data[t + 2]
										};
										Math.sqrt(Math.pow(i.r - 0, 2) + Math.pow(i.g - 0, 2) + Math.pow(i.b - 0, 2)) <= 0 * u && r++
									}
									o()
								}, d.src = i[t].image
							}
						},
						callback: function() {
							(l = l.concat(i.slice(d))).length <= 0 && l.push(i[i.length - 1]), a(l)
						}
					}).length,
					function e() {
						++h === g ? f.callback() : setTimeout(function() {
							f.functionToLoop(e, h)
						}, 1)
					}()
			}, 10)
		};
		var o = !1;

		function s() {
			n.frames = [], a = !0, o = !1
		}
		this.pause = function() {
			o = !0
		}, this.resume = function() {
			o = !1, a && this.record()
		}, this.clearRecordedData = function() {
			a || this.stop(s), s()
		}, this.name = "WhammyRecorder", this.toString = function() {
			return this.name
		};
		var c = document.createElement("canvas"),
			l = c.getContext("2d")
	}
	void 0 !== m ? S.AudioContext = m : "u" > typeof webkitAudioContext && (S.AudioContext = webkitAudioContext), a.Storage = S, a.MediaStreamRecorder = T, a.StereoAudioRecorder = N, a.CanvasRecorder = L, a.WhammyRecorder = M;
	var E = function() {
		function e(e) {
			this.frames = [], this.duration = e || 1, this.quality = .8
		}

		function t(e) {
			function t(e) {
				var t = [];
				e = (e.length % 8 ? Array(9 - e.length % 8).join("0") : "") + e;
				for (var r = 0; r < e.length; r += 8) t.push(parseInt(e.substr(r, 8), 2));
				return new Uint8Array(t)
			}
			postMessage(new function(e) {
				var r, i = function(e) {
					if (!e[0]) return void postMessage({
						error: "Something went wrong. Maybe WebP format is not supported in the current browser."
					});
					for (var t = e[0].width, r = e[0].height, i = e[0].duration, n = 1; n < e.length; n++) i += e[n].duration;
					return {
						duration: i,
						width: t,
						height: r
					}
				}(e);
				if (!i) return [];
				for (var n = [{
						id: 0x1a45dfa3,
						data: [{
							data: 1,
							id: 17030
						}, {
							data: 1,
							id: 17143
						}, {
							data: 4,
							id: 17138
						}, {
							data: 8,
							id: 17139
						}, {
							data: "webm",
							id: 17026
						}, {
							data: 2,
							id: 17031
						}, {
							data: 2,
							id: 17029
						}]
					}, {
						id: 0x18538067,
						data: [{
							id: 0x1549a966,
							data: [{
								data: 1e6,
								id: 2807729
							}, {
								data: "whammy",
								id: 19840
							}, {
								data: "whammy",
								id: 22337
							}, {
								data: (r = i.duration, [].slice.call(new Uint8Array(new Float64Array([r]).buffer), 0).map(function(e) {
									return String.fromCharCode(e)
								}).reverse().join("")),
								id: 17545
							}]
						}, {
							id: 0x1654ae6b,
							data: [{
								id: 174,
								data: [{
									data: 1,
									id: 215
								}, {
									data: 1,
									id: 29637
								}, {
									data: 0,
									id: 156
								}, {
									data: "und",
									id: 2274716
								}, {
									data: "V_VP8",
									id: 134
								}, {
									data: "VP8",
									id: 2459272
								}, {
									data: 1,
									id: 131
								}, {
									id: 224,
									data: [{
										data: i.width,
										id: 176
									}, {
										data: i.height,
										id: 186
									}]
								}]
							}]
						}]
					}], a = 0, o = 0; a < e.length;) {
					var s = [],
						c = 0;
					do s.push(e[a]), c += e[a].duration, a++; while (a < e.length && c < 3e4) var l = {
						id: 0x1f43b675,
						data: function(e, t, r) {
							return [{
								data: e,
								id: 231
							}].concat(r.map(function(e) {
								var r = function(e) {
									var t = 0;
									if (e.keyframe && (t |= 128), e.invisible && (t |= 8), e.lacing && (t |= e.lacing << 1), e.discardable && (t |= 1), e.trackNum > 127) throw "TrackNumber > 127 not supported";
									return [128 | e.trackNum, e.timecode >> 8, 255 & e.timecode, t].map(function(e) {
										return String.fromCharCode(e)
									}).join("") + e.frame
								}({
									discardable: 0,
									frame: e.data.slice(4),
									invisible: 0,
									keyframe: 1,
									lacing: 0,
									trackNum: 1,
									timecode: Math.round(t)
								});
								return t += e.duration, {
									data: r,
									id: 163
								}
							}))
						}(o, 0, s)
					};
					n[1].data.push(l), o += c
				}
				return function e(r) {
					for (var i = [], n = 0; n < r.length; n++) {
						var a = r[n].data;
						"object" == typeof a && (a = e(a)), "number" == typeof a && (a = t(a.toString(2))), "string" == typeof a && (a = new Uint8Array(a.split("").map(function(e) {
							return e.charCodeAt(0)
						})));
						var o = a.size || a.byteLength || a.length,
							s = Math.ceil(Math.ceil(Math.log(o) / Math.log(2)) / 8),
							c = o.toString(2),
							l = Array(7 * s + 7 + 1 - c.length).join("0") + c,
							d = Array(s).join("0") + "1" + l;
						i.push(function(e) {
							for (var t = []; e > 0;) t.push(255 & e), e >>= 8;
							return new Uint8Array(t.reverse())
						}(r[n].id)), i.push(t(d)), i.push(a)
					}
					return new Blob(i, {
						type: "video/webm"
					})
				}(n)
			}(e.map(function(e) {
				var t = function(e) {
					for (var t, r = e.RIFF[0].WEBP[0], i = r.indexOf("\x01*"), n = 0, a = []; n < 4; n++) a[n] = r.charCodeAt(i + 3 + n);
					return {
						width: 16383 & (a[1] << 8 | a[0]),
						height: 16383 & (a[3] << 8 | a[2]),
						data: r,
						riff: e
					}
				}(function e(t) {
					for (var r = 0, i = {}; r < t.length;) {
						var n, a = t.substr(r, 4),
							o = (n = r, parseInt(t.substr(n + 4, 4).split("").map(function(e) {
								var t = e.charCodeAt(0).toString(2);
								return Array(8 - t.length + 1).join("0") + t
							}).join(""), 2)),
							s = t.substr(r + 4 + 4, o);
						r += 8 + o, i[a] = i[a] || [], "RIFF" === a || "LIST" === a ? i[a].push(e(s)) : i[a].push(s)
					}
					return i
				}(atob(e.image.slice(23))));
				return t.duration = e.duration, t
			})))
		}
		return e.prototype.add = function(e, t) {
			if ("canvas" in e && (e = e.canvas), "toDataURL" in e && (e = e.toDataURL("image/webp", this.quality)), !/^data:image\/webp;base64,/ig.test(e)) throw "Input must be formatted properly as a base64 encoded DataURI of type image/webp";
			this.frames.push({
				image: e,
				duration: t || this.duration
			})
		}, e.prototype.compile = function(e) {
			var r, i, n = (i = new Worker(r = f.createObjectURL(new Blob([t.toString(), "this.onmessage =  function (eee) {" + t.name + "(eee.data);}"], {
				type: "application/javascript"
			}))), f.revokeObjectURL(r), i);
			n.onmessage = function(t) {
				t.data.error ? console.error(t.data.error) : e(t.data)
			}, n.postMessage(this.frames)
		}, {
			Video: e
		}
	}();
	a.Whammy = E;
	var A = {
		init: function() {
			var e = this;
			if ("u" < typeof indexedDB || void 0 === indexedDB.open) return void console.error("IndexedDB API are not available in this browser.");
			var t, r = this.dbName || location.href.replace(/\/|:|#|%|\.|\[|\]/g, ""),
				i = indexedDB.open(r, 1);

			function n(t) {
				t.createObjectStore(e.dataStoreName)
			}

			function a() {
				var r = t.transaction([e.dataStoreName], "readwrite");

				function i(t) {
					r.objectStore(e.dataStoreName).get(t).onsuccess = function(r) {
						e.callback && e.callback(r.target.result, t)
					}
				}
				e.videoBlob && r.objectStore(e.dataStoreName).put(e.videoBlob, "videoBlob"), e.gifBlob && r.objectStore(e.dataStoreName).put(e.gifBlob, "gifBlob"), e.audioBlob && r.objectStore(e.dataStoreName).put(e.audioBlob, "audioBlob"), i("audioBlob"), i("videoBlob"), i("gifBlob")
			}
			i.onerror = e.onError, i.onsuccess = function() {
				(t = i.result).onerror = e.onError, t.setVersion && 1 !== t.version ? t.setVersion(1).onsuccess = function() {
					n(t), a()
				} : a()
			}, i.onupgradeneeded = function(e) {
				n(e.target.result)
			}
		},
		Fetch: function(e) {
			return this.callback = e, this.init(), this
		},
		Store: function(e) {
			return this.audioBlob = e.audioBlob, this.videoBlob = e.videoBlob, this.gifBlob = e.gifBlob, this.init(), this
		},
		onError: function(e) {
			console.error(JSON.stringify(e, null, "	"))
		},
		dataStoreName: "recordRTC",
		dbName: null
	};

	function D(e, t) {
		if ("u" < typeof GIFEncoder) {
			var r, i, n = document.createElement("script");
			n.src = "https://www.webrtc-experiment.com/gif-recorder.js", (document.body || document.documentElement).appendChild(n)
		}
		t = t || {};
		var a = e instanceof CanvasRenderingContext2D || e instanceof HTMLCanvasElement;
		this.record = function() {
			"u" < typeof GIFEncoder || !d ? setTimeout(h.record, 1e3) : (a || (t.width || (t.width = m.offsetWidth || 320), t.height || (t.height = m.offsetHeight || 240), t.video || (t.video = {
				width: t.width,
				height: t.height
			}), t.canvas || (t.canvas = {
				width: t.width,
				height: t.height
			}), s.width = t.canvas.width || 320, s.height = t.canvas.height || 240, m.width = t.video.width || 320, m.height = t.video.height || 240), (i = new GIFEncoder).setRepeat(0), i.setDelay(t.frameRate || 200), i.setQuality(t.quality || 10), i.start(), "function" == typeof t.onGifRecordingStarted && t.onGifRecordingStarted(), Date.now(), f = l(function e(n) {
				if (!0 !== h.clearedRecordedData) {
					if (o) return setTimeout(function() {
						e(n)
					}, 100);
					f = l(e), n - r < 90 || (!a && m.paused && m.play(), a || c.drawImage(m, 0, 0, s.width, s.height), t.onGifPreview && t.onGifPreview(s.toDataURL("image/png")), i.addFrame(c), r = n)
				}
			}), t.initCallback && t.initCallback())
		}, this.stop = function(e) {
			e = e || function() {}, f && u(f), Date.now(), this.blob = new Blob([new Uint8Array(i.stream().bin)], {
				type: "image/gif"
			}), e(this.blob), i.stream().bin = []
		};
		var o = !1;
		this.pause = function() {
			o = !0
		}, this.resume = function() {
			o = !1
		}, this.clearRecordedData = function() {
			h.clearedRecordedData = !0, i && (i.stream().bin = [])
		}, this.name = "GifRecorder", this.toString = function() {
			return this.name
		};
		var s = document.createElement("canvas"),
			c = s.getContext("2d");
		a && (e instanceof CanvasRenderingContext2D ? s = (c = e).canvas : e instanceof HTMLCanvasElement && (c = e.getContext("2d"), s = e));
		var d = !0;
		if (!a) {
			var m = document.createElement("video");
			m.muted = !0, m.autoplay = !0, m.playsInline = !0, d = !1, m.onloadedmetadata = function() {
				d = !0
			}, j(e, m), m.play()
		}
		var f = null,
			h = this
	}

	function z(t, r) {
		e.g, r = r || "multi-streams-mixer";
		var i = [],
			n = !1,
			a = document.createElement("canvas"),
			o = a.getContext("2d");
		a.style.opacity = 0, a.style.position = "absolute", a.style.zIndex = -1, a.style.top = "-1000em", a.style.left = "-1000em", a.className = r, (document.body || document.documentElement).appendChild(a), this.disableLogs = !1, this.frameInterval = 10, this.width = 360, this.height = 240, this.useGainNode = !0;
		var s = this,
			c = window.AudioContext;
		void 0 === c && ("u" > typeof webkitAudioContext && (c = webkitAudioContext), "u" > typeof mozAudioContext && (c = mozAudioContext));
		var l = window.URL;
		void 0 === l && "u" > typeof webkitURL && (l = webkitURL), "u" > typeof navigator && void 0 === navigator.getUserMedia && (void 0 !== navigator.webkitGetUserMedia && (navigator.getUserMedia = navigator.webkitGetUserMedia), void 0 !== navigator.mozGetUserMedia && (navigator.getUserMedia = navigator.mozGetUserMedia));
		var d = window.MediaStream;
		void 0 === d && "u" > typeof webkitMediaStream && (d = webkitMediaStream), void 0 !== d && void 0 === d.prototype.stop && (d.prototype.stop = function() {
			this.getTracks().forEach(function(e) {
				e.stop()
			})
		});
		var u = {};

		function m(e, t) {
			if (!n) {
				var r = 0,
					i = 0,
					a = e.width,
					s = e.height;
				1 === t && (r = e.width), 2 === t && (i = e.height), 3 === t && (r = e.width, i = e.height), 4 === t && (i = 2 * e.height), 5 === t && (r = e.width, i = 2 * e.height), 6 === t && (i = 3 * e.height), 7 === t && (r = e.width, i = 3 * e.height), void 0 !== e.stream.left && (r = e.stream.left), void 0 !== e.stream.top && (i = e.stream.top), void 0 !== e.stream.width && (a = e.stream.width), void 0 !== e.stream.height && (s = e.stream.height), o.drawImage(e, r, i, a, s), "function" == typeof e.stream.onRender && e.stream.onRender(o, r, i, a, s, t)
			}
		}

		function f(e) {
			var t = document.createElement("video");
			return "srcObject" in t ? t.srcObject = e : "mozSrcObject" in t ? t.mozSrcObject = e : t.srcObject = e, t.className = r, t.muted = !0, t.volume = 0, t.width = e.width || s.width || 360, t.height = e.height || s.height || 240, t.play(), t
		}

		function h(e) {
			i = [], (e = e || t).forEach(function(e) {
				if (e.getTracks().filter(function(e) {
						return "video" === e.kind
					}).length) {
					var t = f(e);
					t.stream = e, i.push(t)
				}
			})
		}
		void 0 !== c ? u.AudioContext = c : "u" > typeof webkitAudioContext && (u.AudioContext = webkitAudioContext), this.startDrawingFrames = function() {
			! function e() {
				if (!n) {
					var t = i.length,
						r = !1,
						o = [];
					if (i.forEach(function(e) {
							e.stream || (e.stream = {}), e.stream.fullcanvas ? r = e : o.push(e)
						}), r) a.width = r.stream.width, a.height = r.stream.height;
					else if (o.length) {
						a.width = t > 1 ? 2 * o[0].width : o[0].width;
						var c = 1;
						(3 === t || 4 === t) && (c = 2), (5 === t || 6 === t) && (c = 3), (7 === t || 8 === t) && (c = 4), (9 === t || 10 === t) && (c = 5), a.height = o[0].height * c
					} else a.width = s.width || 360, a.height = s.height || 240;
					r && r instanceof HTMLVideoElement && m(r), o.forEach(function(e, t) {
						m(e, t)
					}), setTimeout(e, s.frameInterval)
				}
			}()
		}, this.appendStreams = function(e) {
			if (!e) throw "First parameter is required.";
			e instanceof Array || (e = [e]), e.forEach(function(e) {
				var r = new d;
				if (e.getTracks().filter(function(e) {
						return "video" === e.kind
					}).length) {
					var n = f(e);
					n.stream = e, i.push(n), r.addTrack(e.getTracks().filter(function(e) {
						return "video" === e.kind
					})[0])
				}
				if (e.getTracks().filter(function(e) {
						return "audio" === e.kind
					}).length) {
					var a = s.audioContext.createMediaStreamSource(e);
					s.audioDestination = s.audioContext.createMediaStreamDestination(), a.connect(s.audioDestination), r.addTrack(s.audioDestination.stream.getTracks().filter(function(e) {
						return "audio" === e.kind
					})[0])
				}
				t.push(r)
			})
		}, this.releaseStreams = function() {
			i = [], n = !0, s.gainNode && (s.gainNode.disconnect(), s.gainNode = null), s.audioSources.length && (s.audioSources.forEach(function(e) {
				e.disconnect()
			}), s.audioSources = []), s.audioDestination && (s.audioDestination.disconnect(), s.audioDestination = null), s.audioContext && s.audioContext.close(), s.audioContext = null, o.clearRect(0, 0, a.width, a.height), a.stream && (a.stream.stop(), a.stream = null)
		}, this.resetVideoStreams = function(e) {
			!e || e instanceof Array || (e = [e]), h(e)
		}, this.name = "MultiStreamsMixer", this.toString = function() {
			return this.name
		}, this.getMixedStream = function() {
			n = !1;
			var e, r, i = (h(), "captureStream" in a ? e = a.captureStream() : "mozCaptureStream" in a ? e = a.mozCaptureStream() : s.disableLogs || console.error("Upgrade to latest Chrome or otherwise enable this flag: chrome://flags/#enable-experimental-web-platform-features"), r = new d, e.getTracks().filter(function(e) {
					return "video" === e.kind
				}).forEach(function(e) {
					r.addTrack(e)
				}), a.stream = r, r),
				o = function() {
					u.AudioContextConstructor || (u.AudioContextConstructor = new u.AudioContext), s.audioContext = u.AudioContextConstructor, s.audioSources = [], !0 === s.useGainNode && (s.gainNode = s.audioContext.createGain(), s.gainNode.connect(s.audioContext.destination), s.gainNode.gain.value = 0);
					var e = 0;
					if (t.forEach(function(t) {
							if (t.getTracks().filter(function(e) {
									return "audio" === e.kind
								}).length) {
								e++;
								var r = s.audioContext.createMediaStreamSource(t);
								!0 === s.useGainNode && r.connect(s.gainNode), s.audioSources.push(r)
							}
						}), e) return s.audioDestination = s.audioContext.createMediaStreamDestination(), s.audioSources.forEach(function(e) {
						e.connect(s.audioDestination)
					}), s.audioDestination.stream
				}();
			return o && o.getTracks().filter(function(e) {
				return "audio" === e.kind
			}).forEach(function(e) {
				i.addTrack(e)
			}), t.forEach(function(e) {
				e.fullcanvas
			}), i
		}
	}

	function I(e, t) {
		e = e || [];
		var r, i, n = this;
		(t = t || {
			elementClass: "multi-streams-mixer",
			mimeType: "video/webm",
			video: {
				width: 360,
				height: 240
			}
		}).frameInterval || (t.frameInterval = 10), t.video || (t.video = {}), t.video.width || (t.video.width = 360), t.video.height || (t.video.height = 240), this.record = function() {
			var n;
			r = new z(e, t.elementClass || "multi-streams-mixer"), (n = [], e.forEach(function(e) {
				k(e, "video").forEach(function(e) {
					n.push(e)
				})
			}), n).length && (r.frameInterval = t.frameInterval || 10, r.width = t.video.width || 360, r.height = t.video.height || 240, r.startDrawingFrames()), t.previewStream && "function" == typeof t.previewStream && t.previewStream(r.getMixedStream()), (i = new T(r.getMixedStream(), t)).record()
		}, this.stop = function(e) {
			i && i.stop(function(t) {
				n.blob = t, e(t), n.clearRecordedData()
			})
		}, this.pause = function() {
			i && i.pause()
		}, this.resume = function() {
			i && i.resume()
		}, this.clearRecordedData = function() {
			i && (i.clearRecordedData(), i = null), r && (r.releaseStreams(), r = null)
		}, this.addStreams = function(n) {
			if (!n) throw "First parameter is required.";
			n instanceof Array || (n = [n]), e.concat(n), i && r && (r.appendStreams(n), t.previewStream && "function" == typeof t.previewStream && t.previewStream(r.getMixedStream()))
		}, this.resetVideoStreams = function(e) {
			r && (!e || e instanceof Array || (e = [e]), r.resetVideoStreams(e))
		}, this.getMixer = function() {
			return r
		}, this.name = "MultiStreamRecorder", this.toString = function() {
			return this.name
		}
	}

	function U(e, t) {
		("u" < typeof ReadableStream || "u" < typeof WritableStream) && console.error("Following polyfill is strongly recommended: https://unpkg.com/@mattiasbuelens/web-streams-polyfill/dist/polyfill.min.js"), (t = t || {}).width = t.width || 640, t.height = t.height || 480, t.frameRate = t.frameRate || 30, t.bitrate = t.bitrate || 1200, t.realtime = t.realtime || !0, this.record = function() {
			a = [], n = !1, this.blob = null,
				function o(s, c) {
					if (!t.workerPath && !c) {
						r = !1, fetch("https://unpkg.com/webm-wasm@latest/dist/webm-worker.js").then(function(e) {
							e.arrayBuffer().then(function(e) {
								o(s, e)
							})
						});
						return
					}
					if (!t.workerPath && c instanceof ArrayBuffer) {
						var l = new Blob([c], {
							type: "text/javascript"
						});
						t.workerPath = f.createObjectURL(l)
					}
					t.workerPath || console.error("workerPath parameter is missing."), (i = new Worker(t.workerPath)).postMessage(t.webAssemblyPath || "https://unpkg.com/webm-wasm@latest/dist/webm-wasm.wasm"), i.addEventListener("message", function(o) {
						"READY" === o.data ? (i.postMessage({
							width: t.width,
							height: t.height,
							bitrate: t.bitrate || 1200,
							timebaseDen: t.frameRate || 30,
							realtime: t.realtime
						}), new ReadableStream({
							start: function(i) {
								var n = document.createElement("canvas"),
									a = document.createElement("video"),
									o = !0;
								a.srcObject = e, a.muted = !0, a.height = t.height, a.width = t.width, a.volume = 0, a.onplaying = function() {
									n.width = t.width, n.height = t.height;
									var e = n.getContext("2d"),
										s = setInterval(function() {
											if (r && (clearInterval(s), i.close()), o && (o = !1, t.onVideoProcessStarted && t.onVideoProcessStarted()), e.drawImage(a, 0, 0), "closed" !== i._controlledReadableStream.state) try {
												i.enqueue(e.getImageData(0, 0, t.width, t.height))
											} catch (e) {}
										}, 1e3 / t.frameRate)
								}, a.play()
							}
						}).pipeTo(new WritableStream({
							write: function(e) {
								r ? console.error("Got image, but recorder is finished!") : i.postMessage(e.data.buffer, [e.data.buffer])
							}
						}))) : o.data && !n && a.push(o.data)
					})
				}(e), "function" == typeof t.initCallback && t.initCallback()
		}, this.pause = function() {
			n = !0
		}, this.resume = function() {
			n = !1
		};
		var r, i, n, a = [];
		this.stop = function(e) {
			r = !0;
			var t = this;
			! function(e) {
				if (!i) {
					e && e();
					return
				}
				i.addEventListener("message", function(t) {
					null === t.data && (i.terminate(), i = null, e && e())
				}), i.postMessage(null)
			}(function() {
				t.blob = new Blob(a, {
					type: "video/webm"
				}), e(t.blob)
			})
		}, this.name = "WebAssemblyRecorder", this.toString = function() {
			return this.name
		}, this.clearRecordedData = function() {
			a = [], n = !1, this.blob = null
		}, this.blob = null
	}
	a.DiskStorage = A, a.GifRecorder = D, a.MultiStreamRecorder = I, a.RecordRTCPromisesHandler = function(e, t) {
		if (!this) throw 'Use "new RecordRTCPromisesHandler()"';
		if (void 0 === e) throw 'First argument "MediaStream" is required.';
		var r = this;
		r.recordRTC = new a(e, t), this.startRecording = function() {
			return new Promise(function(e, t) {
				try {
					r.recordRTC.startRecording(), e()
				} catch (e) {
					t(e)
				}
			})
		}, this.stopRecording = function() {
			return new Promise(function(e, t) {
				try {
					r.recordRTC.stopRecording(function(i) {
						(r.blob = r.recordRTC.getBlob(), r.blob && r.blob.size) ? e(i): t("Empty blob.", r.blob)
					})
				} catch (e) {
					t(e)
				}
			})
		}, this.pauseRecording = function() {
			return new Promise(function(e, t) {
				try {
					r.recordRTC.pauseRecording(), e()
				} catch (e) {
					t(e)
				}
			})
		}, this.resumeRecording = function() {
			return new Promise(function(e, t) {
				try {
					r.recordRTC.resumeRecording(), e()
				} catch (e) {
					t(e)
				}
			})
		}, this.getDataURL = function(e) {
			return new Promise(function(e, t) {
				try {
					r.recordRTC.getDataURL(function(t) {
						e(t)
					})
				} catch (e) {
					t(e)
				}
			})
		}, this.getBlob = function() {
			return new Promise(function(e, t) {
				try {
					e(r.recordRTC.getBlob())
				} catch (e) {
					t(e)
				}
			})
		}, this.getInternalRecorder = function() {
			return new Promise(function(e, t) {
				try {
					e(r.recordRTC.getInternalRecorder())
				} catch (e) {
					t(e)
				}
			})
		}, this.reset = function() {
			return new Promise(function(e, t) {
				try {
					e(r.recordRTC.reset())
				} catch (e) {
					t(e)
				}
			})
		}, this.destroy = function() {
			return new Promise(function(e, t) {
				try {
					e(r.recordRTC.destroy())
				} catch (e) {
					t(e)
				}
			})
		}, this.getState = function() {
			return new Promise(function(e, t) {
				try {
					e(r.recordRTC.getState())
				} catch (e) {
					t(e)
				}
			})
		}, this.blob = null, this.version = "5.6.2"
	}, a.WebAssemblyRecorder = U
}]);