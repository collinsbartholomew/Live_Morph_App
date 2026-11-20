(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 78287, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		l = e.i(189478),
		s = e.i(170380),
		i = e.i(818036);

	function n() {
		let e, l = (0, r.c)(1);
		return l[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 12 12",
			fill: "none",
			"aria-hidden": "true",
			children: (0, t.jsx)("path", {
				d: "M6.83 10H8V2H6.83M4 10H5.17V2H4V10Z",
				fill: "white"
			})
		}), l[0] = e) : e = l[0], e
	}

	function a() {
		let e, l = (0, r.c)(1);
		return l[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("svg", {
			width: "12",
			height: "12",
			viewBox: "0 0 12 12",
			fill: "none",
			"aria-hidden": "true",
			children: (0, t.jsx)("path", {
				d: "M3.5 1.9v8.2c0 .4.44.64.78.42l6.44-4.1a.5.5 0 0 0 0-.84L4.28 1.48a.5.5 0 0 0-.78.42Z",
				fill: "white"
			})
		}), l[0] = e) : e = l[0], e
	}

	function c(e) {
		let l, s, i, n = (0, r.c)(4),
			{
				className: a
			} = e;
		return n[0] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("circle", {
			cx: "6.29573",
			cy: "5.03659",
			r: "4.49695",
			fill: "white"
		}), s = (0, t.jsx)("path", {
			d: "M4.94617 6.3851L6.29526 5.03601M6.29526 5.03601L7.64434 3.68693M6.29526 5.03601L4.94617 3.68693M6.29526 5.03601L7.64434 6.3851",
			stroke: "#393939",
			strokeWidth: "0.539634",
			strokeLinecap: "round",
			strokeLinejoin: "round"
		}), n[0] = l, n[1] = s) : (l = n[0], s = n[1]), n[2] !== a ? (i = (0, t.jsxs)("svg", {
			width: "14",
			height: "14",
			viewBox: "0 0 11.872 11.872",
			fill: "none",
			"aria-hidden": "true",
			className: a,
			children: [l, s]
		}), n[2] = a, n[3] = i) : i = n[3], i
	}

	function o(e) {
		let l, s, i = (0, r.c)(3),
			{
				className: n
			} = e;
		return i[0] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("path", {
			d: "M5.3 4 2.6 1.3a.66.66 0 0 1 0-.94.66.66 0 0 1 .94 0l3.2 3.17a.66.66 0 0 1 0 .94L3.54 7.64a.66.66 0 0 1-.94 0 .66.66 0 0 1 0-.94L5.3 4Z",
			fill: "white"
		}), i[0] = l) : l = i[0], i[1] !== n ? (s = (0, t.jsx)("svg", {
			width: "8",
			height: "8",
			viewBox: "0 0 8 8",
			fill: "none",
			"aria-hidden": "true",
			className: n,
			children: l
		}), i[1] = n, i[2] = s) : s = i[2], s
	}
	e.s(["HeroShowcase", 0, function({
		useCases: e
	}) {
		let [r, u] = (0, s.useState)(0), [d, f] = (0, s.useState)(0), [h, m] = (0, s.useState)(!0), [x, b] = (0, s.useState)(!1), [p, g] = (0, s.useState)({
			left: !1,
			right: !0
		}), j = (0, s.useRef)([]), v = (0, s.useRef)(null), w = (0, s.useRef)(0), [y, N] = (0, s.useState)(() => new Set), k = e[r], L = e => !y.has(k.clips[e].src), S = (0, s.useCallback)(e => {
			for (let t of j.current) t && e(t)
		}, []);
		(0, s.useLayoutEffect)(() => {
			window.matchMedia("(prefers-reduced-motion: reduce)").matches && (m(!1), S(e => e.pause()))
		}, [S]);
		let T = e => {
				u(e), f(0), b(!1)
			},
			M = () => {
				if (h) {
					let t; - 1 === (t = k.clips.findIndex((e, t) => t > d && L(t))) ? T((r + 1) % e.length) : (f(t), S(e => {
						e.currentTime = 0, h && e.play().catch(() => {})
					}))
				}
			},
			C = () => {
				if (h) {
					if (w.current += 1, w.current >= e.length) return void m(!1);
					T((r + 1) % e.length)
				}
			},
			_ = () => {
				w.current = 0, b(!0)
			},
			E = e => {
				let t = d === e ? 0 : e,
					r = j.current[d],
					l = j.current[t];
				r && l && r !== l && Number.isFinite(r.currentTime) && (l.currentTime = r.currentTime, h && l.play().catch(() => {})), f(t)
			};
		(0, s.useEffect)(() => {
			if (x) return;
			let e = window.setTimeout(() => b(!0), 1e3);
			return () => window.clearTimeout(e)
		}, [x]), (0, s.useEffect)(() => {
			S(e => {
				h ? e.play().catch(() => {}) : e.pause()
			})
		}, [h, S]), (0, s.useEffect)(() => {
			let e = v.current,
				t = e?.children[r];
			if (!e || !t) return;
			let l = t.offsetLeft - e.offsetLeft,
				s = l + t.offsetWidth;
			l < e.scrollLeft ? e.scrollTo({
				left: l - 4,
				behavior: "smooth"
			}) : s > e.scrollLeft + e.clientWidth && e.scrollTo({
				left: s - e.clientWidth + 4,
				behavior: "smooth"
			})
		}, [r]);
		let z = (0, s.useCallback)(() => {
			let e = v.current;
			e && g({
				left: e.scrollLeft > 4,
				right: e.scrollLeft + e.clientWidth < e.scrollWidth - 4
			})
		}, []);
		return (0, s.useEffect)(() => (z(), window.addEventListener("resize", z), () => window.removeEventListener("resize", z)), [z]), (0, t.jsxs)("div", {
			className: "flex flex-col gap-3 w-full",
			children: [(0, t.jsxs)("div", {
				className: "relative w-full aspect-[590/315] rounded-2xl overflow-hidden bg-card",
				children: [k.clips.map((e, r) => 0 === r || r === d || x ? (0, t.jsx)("video", {
					ref: e => (j.current[r] = e, () => {
						j.current[r] = null
					}),
					src: e.src,
					poster: e.poster,
					className: (0, i.c)("absolute inset-0 size-full object-cover", r !== d && "opacity-0"),
					autoPlay: h,
					muted: !0,
					playsInline: !0,
					preload: "auto",
					onLoadedData: () => (e => {
						let t = j.current[e];
						if (!t) return;
						let r = j.current[0];
						r && r !== t && Number.isFinite(r.currentTime) && (t.currentTime = r.currentTime), h && t.play().catch(() => {})
					})(r),
					onCanPlay: 0 === r ? _ : void 0,
					onEnded: 0 === r ? M : void 0,
					onError: 0 === r ? C : () => {
						N(e => new Set(e).add(k.clips[r].src)), d === r && f(0)
					}
				}, e.src) : null), (0, t.jsx)("div", {
					className: "absolute bottom-3 right-3 flex items-start gap-1 rounded-[10px] bg-[#f0f0f0] p-1 drop-shadow-[1px_6px_37px_rgba(0,0,0,0.25)] empty:hidden",
					children: k.clips.map((e, r) => e.thumb && L(r) && (0, t.jsxs)("span", {
						className: "relative shrink-0",
						children: [(0, t.jsx)("button", {
							type: "button",
							onClick: () => E(r),
							"aria-label": `Variation ${r}`,
							"aria-pressed": d === r,
							className: (0, i.c)("relative block size-[41px] overflow-hidden rounded-md bg-white", d === r && "ring-[1.1px] ring-[#2548f6]"),
							children: (0, t.jsx)(l.default, {
								src: e.thumb,
								alt: "",
								fill: !0,
								sizes: "41px",
								className: "object-cover"
							})
						}), d === r && (0, t.jsx)("button", {
							type: "button",
							onClick: () => E(0),
							"aria-label": "Clear variation",
							className: "absolute -top-1.5 -right-2 z-10 flex size-5 items-center justify-center",
							children: (0, t.jsx)(c, {
								className: "drop-shadow-sm"
							})
						})]
					}, e.src))
				}), (0, t.jsx)("button", {
					type: "button",
					onClick: () => m(e => !e),
					"aria-label": h ? "Pause showcase" : "Play showcase",
					className: "absolute top-3 right-3 flex size-7 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-colors hover:bg-white/30",
					children: h ? (0, t.jsx)(n, {}) : (0, t.jsx)(a, {})
				})]
			}), (0, t.jsxs)("div", {
				className: "relative w-full",
				children: [(0, t.jsx)("div", {
					ref: v,
					onScroll: z,
					className: "flex items-center gap-1 w-full p-1 rounded-full bg-card overflow-x-auto scrollbar-hide",
					children: e.map((e, l) => (0, t.jsxs)("button", {
						type: "button",
						onClick: () => T(l),
						"aria-current": l === r,
						className: (0, i.c)("relative shrink-0 grow h-8 px-3 rounded-full text-sm tracking-[0.02em] whitespace-nowrap transition-colors", l === r ? "bg-border text-foreground" : "text-muted-foreground hover:text-foreground"),
						children: [(0, t.jsx)("span", {
							"aria-hidden": !0,
							className: "invisible block font-medium",
							children: e.label
						}), (0, t.jsx)("span", {
							className: (0, i.c)("absolute inset-0 flex items-center justify-center", l === r && "font-medium"),
							children: e.label
						})]
					}, e.id))
				}), p.left && (0, t.jsx)("div", {
					className: "absolute inset-y-0 left-0 flex w-10 items-center justify-center rounded-l-full bg-gradient-to-r from-card from-45% to-transparent",
					children: (0, t.jsx)("button", {
						type: "button",
						"aria-label": "Scroll use cases left",
						onClick: () => v.current?.scrollBy({
							left: -160,
							behavior: "smooth"
						}),
						className: "flex h-[25px] w-3 items-center justify-center rounded-full bg-muted-foreground/10 backdrop-blur-sm",
						children: (0, t.jsx)(o, {
							className: "rotate-180"
						})
					})
				}), p.right && (0, t.jsx)("div", {
					className: "absolute inset-y-0 right-0 flex w-10 items-center justify-center rounded-r-full bg-gradient-to-l from-card from-45% to-transparent",
					children: (0, t.jsx)("button", {
						type: "button",
						"aria-label": "Scroll use cases right",
						onClick: () => v.current?.scrollBy({
							left: 160,
							behavior: "smooth"
						}),
						className: "flex h-[25px] w-3 items-center justify-center rounded-full bg-muted-foreground/10 backdrop-blur-sm",
						children: (0, t.jsx)(o, {})
					})
				})]
			})]
		})
	}])
}, 733631, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		l = e.i(189478),
		s = e.i(293819),
		i = e.i(170380);
	e.s(["ModelCard", 0, function(e) {
		let n, a, c, o, u, d, f, h, m, x, b = (0, r.c)(35),
			{
				name: p,
				description: g,
				image: j,
				icon: v,
				hoverIcon: w,
				href: y,
				isVideo: N,
				poster: k,
				external: L
			} = e,
			S = (0, i.useRef)(null),
			[T, M] = (0, i.useState)(!1);
		b[0] !== N ? (n = () => {
			M(!0), N && S.current && S.current.play()
		}, b[0] = N, b[1] = n) : n = b[1];
		let C = n;
		b[2] !== N ? (a = () => {
			M(!1), N && S.current && (S.current.pause(), S.current.currentTime = 0)
		}, b[2] = N, b[3] = a) : a = b[3];
		let _ = a;
		b[4] !== j || b[5] !== N || b[6] !== p || b[7] !== k ? (c = (0, t.jsx)("div", {
			className: "relative w-full aspect-296/170 rounded-[8px] overflow-hidden bg-black",
			children: N ? (0, t.jsx)("video", {
				ref: S,
				src: j,
				poster: k,
				className: "w-full h-full object-cover",
				muted: !0,
				loop: !0,
				playsInline: !0
			}) : (0, t.jsx)(l.default, {
				src: j,
				alt: p,
				className: "w-full h-full object-cover",
				width: 296,
				height: 170
			})
		}), b[4] = j, b[5] = N, b[6] = p, b[7] = k, b[8] = c) : c = b[8], b[9] !== p ? (o = (0, t.jsx)("h3", {
			className: "text-base font-medium tracking-[0.01em] text-foreground",
			children: p
		}), b[9] = p, b[10] = o) : o = b[10], b[11] !== g ? (u = (0, t.jsx)("p", {
			className: "text-sm font-medium text-muted-foreground",
			children: g
		}), b[11] = g, b[12] = u) : u = b[12], b[13] !== o || b[14] !== u ? (d = (0, t.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [o, u]
		}), b[13] = o, b[14] = u, b[15] = d) : d = b[15];
		let E = T ? w : v,
			z = `${p} icon`;
		b[16] !== E || b[17] !== z ? (f = (0, t.jsx)(l.default, {
			src: E,
			alt: z,
			className: "size-11 shrink-0",
			width: 44,
			height: 44
		}), b[16] = E, b[17] = z, b[18] = f) : f = b[18], b[19] !== d || b[20] !== f ? (h = (0, t.jsxs)("div", {
			className: "flex items-center justify-between pl-2",
			children: [d, f]
		}), b[19] = d, b[20] = f, b[21] = h) : h = b[21], b[22] !== h || b[23] !== c ? (m = (0, t.jsxs)("div", {
			className: "flex flex-col gap-3 rounded-[14px] border border-border px-2 pt-2 pb-3 h-full transition-colors hover:bg-card/60",
			children: [c, h]
		}), b[22] = h, b[23] = c, b[24] = m) : m = b[24];
		let B = m;
		if (L) {
			let e;
			return b[25] !== B || b[26] !== C || b[27] !== _ || b[28] !== y ? (e = (0, t.jsx)("a", {
				href: y,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "block",
				onMouseEnter: C,
				onMouseLeave: _,
				children: B
			}), b[25] = B, b[26] = C, b[27] = _, b[28] = y, b[29] = e) : e = b[29], e
		}
		return b[30] !== B || b[31] !== C || b[32] !== _ || b[33] !== y ? (x = (0, t.jsx)(s.default, {
			href: y,
			className: "block",
			onMouseEnter: C,
			onMouseLeave: _,
			children: B
		}), b[30] = B, b[31] = C, b[32] = _, b[33] = y, b[34] = x) : x = b[34], x
	}])
}]);