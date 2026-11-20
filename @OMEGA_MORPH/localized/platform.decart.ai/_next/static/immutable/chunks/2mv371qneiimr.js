(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 385569, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(170380),
		i = e.i(378329),
		s = Object.defineProperty,
		l = (e, t) => s(e, "name", {
			value: t,
			configurable: !0
		}),
		n = {
			Horizontal: "horizontal",
			Vertical: "vertical"
		},
		o = n.Horizontal,
		c = Object.values(n),
		d = a.forwardRef(l(function(e, r) {
			let {
				decorative: a,
				orientation: s = o,
				...l
			} = e, c = m(s) ? s : o, d = c === n.Vertical ? c : void 0;
			return (0, t.jsx)(i.V.div, {
				"data-orientation": c,
				...a ? {
					role: "none"
				} : {
					"aria-orientation": d,
					role: "separator"
				},
				...l,
				ref: r
			})
		}, "Separator"));

	function m(e) {
		return c.includes(e)
	}
	l(m, "isValidOrientation");
	var u = e.i(818036);
	e.s(["Separator", 0, function(e) {
		let a, i, s, l, n, o, c = (0, r.c)(12);
		c[0] !== e ? ({
			className: a,
			orientation: s,
			decorative: l,
			...i
		} = e, c[0] = e, c[1] = a, c[2] = i, c[3] = s, c[4] = l) : (a = c[1], i = c[2], s = c[3], l = c[4]);
		let m = void 0 === s ? "horizontal" : s,
			h = void 0 === l || l;
		return c[5] !== a ? (n = (0, u.c)("bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px", a), c[5] = a, c[6] = n) : n = c[6], c[7] !== h || c[8] !== m || c[9] !== i || c[10] !== n ? (o = (0, t.jsx)(d, {
			"data-slot": "separator",
			decorative: h,
			orientation: m,
			className: n,
			...i
		}), c[7] = h, c[8] = m, c[9] = i, c[10] = n, c[11] = o) : o = c[11], o
	}], 385569)
}, 210742, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(427658),
		i = e.i(294237),
		s = e.i(55e3);
	let l = {
		name: "panel-left",
		size: 24,
		node: [
			["rect", {
				width: "18",
				height: "18",
				x: "3",
				y: "3",
				rx: "2",
				key: "afitv7"
			}],
			["path", {
				d: "M9 3v18",
				key: "fh3hqa"
			}]
		],
		aliases: ["sidebar"]
	};
	l.node;
	let n = (0, s.f)(l);
	var o = e.i(170380),
		c = e.i(8774);
	e.i(932767), e.i(385569);
	var d = e.i(161978);
	e.i(99756);
	var m = e.i(546009),
		u = e.i(638644),
		h = e.i(818036);
	let x = o.createContext(null);

	function f() {
		let e = o.useContext(x);
		if (!e) throw Error("useSidebar must be used within a SidebarProvider.");
		return e
	}

	function p(e) {
		return !e
	}

	function b(e) {
		return !e
	}
	let g = (0, i.f)("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
		variants: {
			variant: {
				default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
				outline: "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"
			},
			size: {
				default: "h-8 text-sm",
				sm: "h-7 text-xs",
				lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!"
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default"
		}
	});
	e.s(["Sidebar", 0, function(e) {
		let a, i, s, l, n, o, c, m, u, x, p, b, g = (0, r.c)(46);
		g[0] !== e ? ({
			side: l,
			variant: n,
			collapsible: o,
			className: i,
			children: a,
			...s
		} = e, g[0] = e, g[1] = a, g[2] = i, g[3] = s, g[4] = l, g[5] = n, g[6] = o) : (a = g[1], i = g[2], s = g[3], l = g[4], n = g[5], o = g[6]);
		let j = void 0 === l ? "left" : l,
			v = void 0 === n ? "sidebar" : n,
			y = void 0 === o ? "offcanvas" : o,
			{
				isMobile: C,
				state: w,
				openMobile: N,
				setOpenMobile: k
			} = f();
		if ("none" === y) {
			let e, r;
			return g[7] !== i ? (e = (0, h.c)("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col", i), g[7] = i, g[8] = e) : e = g[8], g[9] !== a || g[10] !== s || g[11] !== e ? (r = (0, t.jsx)("div", {
				"data-slot": "sidebar",
				className: e,
				...s,
				children: a
			}), g[9] = a, g[10] = s, g[11] = e, g[12] = r) : r = g[12], r
		}
		if (C) {
			let e, r, i, l, n;
			return g[13] === Symbol.for("react.memo_cache_sentinel") ? (e = {
				"--sidebar-width": "18rem"
			}, g[13] = e) : e = g[13], g[14] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsxs)(d.D, {
				className: "sr-only",
				children: [(0, t.jsx)(d.L, {
					children: "Sidebar"
				}), (0, t.jsx)(d.c, {
					children: "Displays the mobile sidebar."
				})]
			}), g[14] = r) : r = g[14], g[15] !== a ? (i = (0, t.jsx)("div", {
				className: "flex h-full w-full flex-col",
				children: a
			}), g[15] = a, g[16] = i) : i = g[16], g[17] !== j || g[18] !== i ? (l = (0, t.jsxs)(d.U, {
				"data-sidebar": "sidebar",
				"data-slot": "sidebar",
				"data-mobile": "true",
				className: "bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",
				style: e,
				side: j,
				children: [r, i]
			}), g[17] = j, g[18] = i, g[19] = l) : l = g[19], g[20] !== N || g[21] !== s || g[22] !== k || g[23] !== l ? (n = (0, t.jsx)(d.j, {
				open: N,
				onOpenChange: k,
				...s,
				children: l
			}), g[20] = N, g[21] = s, g[22] = k, g[23] = l, g[24] = n) : n = g[24], n
		}
		let S = "collapsed" === w ? y : "",
			_ = "floating" === v || "inset" === v ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)";
		g[25] !== _ ? (c = (0, h.c)("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", _), g[25] = _, g[26] = c) : c = g[26], g[27] !== c ? (m = (0, t.jsx)("div", {
			"data-slot": "sidebar-gap",
			className: c
		}), g[27] = c, g[28] = m) : m = g[28];
		let z = "left" === j ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
			L = "floating" === v || "inset" === v ? "py-3 pl-3 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)] group-data-[side=left]:border-r group-data-[side=right]:border-l border-sidebar-border" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l";
		return g[29] !== i || g[30] !== z || g[31] !== L ? (u = (0, h.c)("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", z, L, i), g[29] = i, g[30] = z, g[31] = L, g[32] = u) : u = g[32], g[33] !== a ? (x = (0, t.jsx)("div", {
			"data-sidebar": "sidebar",
			"data-slot": "sidebar-inner",
			className: "bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm",
			children: a
		}), g[33] = a, g[34] = x) : x = g[34], g[35] !== s || g[36] !== u || g[37] !== x ? (p = (0, t.jsx)("div", {
			"data-slot": "sidebar-container",
			className: u,
			...s,
			children: x
		}), g[35] = s, g[36] = u, g[37] = x, g[38] = p) : p = g[38], g[39] !== j || g[40] !== w || g[41] !== p || g[42] !== S || g[43] !== m || g[44] !== v ? (b = (0, t.jsxs)("div", {
			className: "group peer text-sidebar-foreground hidden md:block",
			"data-state": w,
			"data-collapsible": S,
			"data-variant": v,
			"data-side": j,
			"data-slot": "sidebar",
			children: [m, p]
		}), g[39] = j, g[40] = w, g[41] = p, g[42] = S, g[43] = m, g[44] = v, g[45] = b) : b = g[45], b
	}, "SidebarContent", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("flex min-h-0 flex-1 flex-col gap-2 px-2 md:px-0 md:pr-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("div", {
			"data-slot": "sidebar-content",
			"data-sidebar": "content",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarFooter", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("flex flex-col gap-2 ", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("div", {
			"data-slot": "sidebar-footer",
			"data-sidebar": "footer",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarGroup", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("relative flex w-full gap-2 min-w-0 flex-col", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("div", {
			"data-slot": "sidebar-group",
			"data-sidebar": "group",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarGroupContent", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("w-full text-sm", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("div", {
			"data-slot": "sidebar-group-content",
			"data-sidebar": "group-content",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarGroupLabel", 0, function(e) {
		let i, s, l, n, o, c = (0, r.c)(10);
		c[0] !== e ? ({
			className: i,
			asChild: l,
			...s
		} = e, c[0] = e, c[1] = i, c[2] = s, c[3] = l) : (i = c[1], s = c[2], l = c[3]);
		let d = void 0 !== l && l ? a.M : "div";
		return c[4] !== i ? (n = (0, h.c)("text-muted-foreground ring-sidebar-ring flex ms-1 h-8 shrink-0 items-center rounded-md px-2 font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", i), c[4] = i, c[5] = n) : n = c[5], c[6] !== d || c[7] !== s || c[8] !== n ? (o = (0, t.jsx)(d, {
			"data-slot": "sidebar-group-label",
			"data-sidebar": "group-label",
			className: n,
			...s
		}), c[6] = d, c[7] = s, c[8] = n, c[9] = o) : o = c[9], o
	}, "SidebarHeader", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("flex flex-col gap-2 p-2", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("div", {
			"data-slot": "sidebar-header",
			"data-sidebar": "header",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarInset", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("bg-background relative flex w-full flex-1 flex-col", "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("main", {
			"data-slot": "sidebar-inset",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarMenu", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("flex w-full min-w-0 flex-col gap-1", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("ul", {
			"data-slot": "sidebar-menu",
			"data-sidebar": "menu",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarMenuButton", 0, function(e) {
		let i, s, l, n, o, c, d, u, x, p, b, j, v = (0, r.c)(28);
		v[0] !== e ? ({
			asChild: l,
			isActive: n,
			variant: o,
			size: c,
			tooltip: d,
			className: i,
			...s
		} = e, v[0] = e, v[1] = i, v[2] = s, v[3] = l, v[4] = n, v[5] = o, v[6] = c, v[7] = d) : (i = v[1], s = v[2], l = v[3], n = v[4], o = v[5], c = v[6], d = v[7]);
		let y = void 0 !== n && n,
			C = void 0 === o ? "default" : o,
			w = void 0 === c ? "default" : c,
			N = void 0 !== l && l ? a.M : "button",
			{
				isMobile: k,
				state: S
			} = f();
		v[8] !== i || v[9] !== w || v[10] !== C ? (u = (0, h.c)(g({
			variant: C,
			size: w
		}), i), v[8] = i, v[9] = w, v[10] = C, v[11] = u) : u = v[11], v[12] !== N || v[13] !== y || v[14] !== s || v[15] !== w || v[16] !== u ? (x = (0, t.jsx)(N, {
			"data-slot": "sidebar-menu-button",
			"data-sidebar": "menu-button",
			"data-size": w,
			"data-active": y,
			className: u,
			...s
		}), v[12] = N, v[13] = y, v[14] = s, v[15] = w, v[16] = u, v[17] = x) : x = v[17];
		let _ = x;
		if (!d) return _;
		if ("string" == typeof d) {
			let e;
			v[18] !== d ? (e = {
				children: d
			}, v[18] = d, v[19] = e) : e = v[19], d = e
		}
		v[20] !== _ ? (p = (0, t.jsx)(m.y, {
			asChild: !0,
			children: _
		}), v[20] = _, v[21] = p) : p = v[21];
		let z = "collapsed" !== S || k;
		return v[22] !== z || v[23] !== d ? (b = (0, t.jsx)(m.Y, {
			side: "right",
			align: "center",
			hidden: z,
			...d
		}), v[22] = z, v[23] = d, v[24] = b) : b = v[24], v[25] !== p || v[26] !== b ? (j = (0, t.jsxs)(m.W, {
			children: [p, b]
		}), v[25] = p, v[26] = b, v[27] = j) : j = v[27], j
	}, "SidebarMenuItem", 0, function(e) {
		let a, i, s, l, n = (0, r.c)(8);
		return n[0] !== e ? ({
			className: a,
			...i
		} = e, n[0] = e, n[1] = a, n[2] = i) : (a = n[1], i = n[2]), n[3] !== a ? (s = (0, h.c)("group/menu-item relative", a), n[3] = a, n[4] = s) : s = n[4], n[5] !== i || n[6] !== s ? (l = (0, t.jsx)("li", {
			"data-slot": "sidebar-menu-item",
			"data-sidebar": "menu-item",
			className: s,
			...i
		}), n[5] = i, n[6] = s, n[7] = l) : l = n[7], l
	}, "SidebarProvider", 0, function(e) {
		let a, i, s, l, n, c, d, f, g, j, v, y, C, w, N, k, S = (0, r.c)(36);
		S[0] !== e ? ({
			defaultOpen: d,
			open: s,
			onOpenChange: n,
			className: i,
			style: c,
			children: a,
			...l
		} = e, S[0] = e, S[1] = a, S[2] = i, S[3] = s, S[4] = l, S[5] = n, S[6] = c, S[7] = d) : (a = S[1], i = S[2], s = S[3], l = S[4], n = S[5], c = S[6], d = S[7]);
		let _ = void 0 === d || d,
			z = (0, u.f)(),
			[L, M] = o.useState(!1),
			[A, P] = o.useState(_),
			V = s ?? A;
		S[8] !== V || S[9] !== n ? (f = e => {
			let t = "function" == typeof e ? e(V) : e;
			n ? n(t) : P(t), document.cookie = `sidebar_state=${t}; path=/; max-age=604800`
		}, S[8] = V, S[9] = n, S[10] = f) : f = S[10];
		let U = f;
		S[11] !== z || S[12] !== U ? (g = () => z ? M(b) : U(p), S[11] = z, S[12] = U, S[13] = g) : g = S[13];
		let H = g;
		S[14] !== H ? (j = () => {
			let e = e => {
				"b" === e.key && (e.metaKey || e.ctrlKey) && (e.preventDefault(), H())
			};
			return window.addEventListener("keydown", e), () => window.removeEventListener("keydown", e)
		}, v = [H], S[14] = H, S[15] = j, S[16] = v) : (j = S[15], v = S[16]), o.useEffect(j, v);
		let O = V ? "expanded" : "collapsed";
		S[17] !== z || S[18] !== V || S[19] !== L || S[20] !== U || S[21] !== O || S[22] !== H ? (y = {
			state: O,
			open: V,
			setOpen: U,
			isMobile: z,
			openMobile: L,
			setOpenMobile: M,
			toggleSidebar: H
		}, S[17] = z, S[18] = V, S[19] = L, S[20] = U, S[21] = O, S[22] = H, S[23] = y) : y = S[23];
		let I = y;
		S[24] !== c ? (C = {
			"--sidebar-width": "12.375rem",
			"--sidebar-width-icon": "4rem",
			...c
		}, S[24] = c, S[25] = C) : C = S[25];
		let W = C;
		return S[26] !== i ? (w = (0, h.c)("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full", i), S[26] = i, S[27] = w) : w = S[27], S[28] !== a || S[29] !== l || S[30] !== W || S[31] !== w ? (N = (0, t.jsx)(m.g, {
			delayDuration: 0,
			children: (0, t.jsx)("div", {
				"data-slot": "sidebar-wrapper",
				style: W,
				className: w,
				...l,
				children: a
			})
		}), S[28] = a, S[29] = l, S[30] = W, S[31] = w, S[32] = N) : N = S[32], S[33] !== I || S[34] !== N ? (k = (0, t.jsx)(x.Provider, {
			value: I,
			children: N
		}), S[33] = I, S[34] = N, S[35] = k) : k = S[35], k
	}, "SidebarTrigger", 0, function(e) {
		let a, i, s, l, o, d, m, u, x, p = (0, r.c)(18);
		p[0] !== e ? ({
			className: i,
			onClick: s,
			children: a,
			...l
		} = e, p[0] = e, p[1] = a, p[2] = i, p[3] = s, p[4] = l) : (a = p[1], i = p[2], s = p[3], l = p[4]);
		let {
			toggleSidebar: b
		} = f();
		return p[5] !== i ? (o = (0, h.c)("size-7", i), p[5] = i, p[6] = o) : o = p[6], p[7] !== s || p[8] !== b ? (d = e => {
			s?.(e), b()
		}, p[7] = s, p[8] = b, p[9] = d) : d = p[9], p[10] !== a ? (m = a ?? (0, t.jsx)(n, {}), p[10] = a, p[11] = m) : m = p[11], p[12] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, t.jsx)("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		}), p[12] = u) : u = p[12], p[13] !== l || p[14] !== o || p[15] !== d || p[16] !== m ? (x = (0, t.jsxs)(c.f, {
			"data-sidebar": "trigger",
			"data-slot": "sidebar-trigger",
			variant: "ghost",
			size: "icon",
			className: o,
			onClick: d,
			...l,
			children: [m, u]
		}), p[13] = l, p[14] = o, p[15] = d, p[16] = m, p[17] = x) : x = p[17], x
	}, "useSidebar", 0, f], 210742)
}, 178292, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(15173),
		i = e.i(927531),
		s = e.i(8774),
		l = e.i(876532),
		n = e.i(329474),
		o = e.i(837714),
		c = e.i(55e3);
	let d = {
		name: "key",
		size: 24,
		node: [
			["path", {
				d: "m2 21 9.6-9.6",
				key: "9l79m3"
			}],
			["path", {
				d: "m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19",
				key: "fw8biw"
			}],
			["circle", {
				cx: "15.5",
				cy: "7.5",
				r: "5.5",
				key: "4wxmhb"
			}]
		]
	};
	d.node;
	let m = (0, c.f)(d);
	var u = e.i(627007),
		h = e.i(833473),
		x = e.i(627433),
		f = e.i(206116),
		p = e.i(583289),
		b = e.i(189478),
		g = e.i(170380),
		j = e.i(683225),
		v = e.i(480847),
		y = e.i(155990),
		C = e.i(528506),
		w = e.i(663303),
		N = e.i(480381),
		k = e.i(932767),
		S = e.i(232250),
		_ = e.i(818036),
		z = e.i(887700);

	function L(e) {
		let a, i, l, n, o, c, d, m, u, h, x, f, p, b, j, v, y, C, L = (0, r.c)(44),
			{
				open: M,
				onOpenChange: A
			} = e,
			[P, V] = (0, g.useState)(""),
			[U, H] = (0, g.useState)(""),
			[O, I] = (0, g.useState)(null),
			[W, G] = (0, g.useState)(!1),
			[F, B] = (0, g.useState)(null);
		L[0] === Symbol.for("react.memo_cache_sentinel") ? (a = e => {
			V(e), H((0, _.F)(e))
		}, L[0] = a) : a = L[0];
		let T = a;
		L[1] !== O || L[2] !== P || L[3] !== A || L[4] !== U ? (i = async () => {
			if (!P.trim()) return;
			G(!0), B(null);
			let {
				data: e,
				error: t
			} = await w.i.organization.create({
				name: P.trim(),
				slug: U || (0, _.F)(P),
				...O && {
					logo: O
				}
			});
			if (t) {
				B(t.message || "Failed to create organization"), G(!1);
				return
			}
			e?.id && await w.i.organization.setActive({
				organizationId: e.id
			}), V(""), H(""), I(null), G(!1), A(!1)
		}, L[1] = O, L[2] = P, L[3] = A, L[4] = U, L[5] = i) : i = L[5];
		let R = i;
		L[6] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsxs)(N.s, {
			children: [(0, t.jsx)(N.F, {
				children: "Create Organization"
			}), (0, t.jsx)(N.C, {
				children: "Create a new organization to share API keys and credits with your team."
			})]
		}), L[6] = l) : l = L[6], L[7] !== O || L[8] !== P ? (n = (0, t.jsx)("div", {
			className: "flex flex-col gap-2 items-center",
			children: (0, t.jsx)(z.f, {
				value: O,
				onChange: I,
				orgName: P
			})
		}), L[7] = O, L[8] = P, L[9] = n) : n = L[9], L[10] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)(S.f, {
			htmlFor: "org-name",
			children: "Name"
		}), L[10] = o) : o = L[10], L[11] === Symbol.for("react.memo_cache_sentinel") ? (c = e => T(e.target.value), L[11] = c) : c = L[11], L[12] !== P ? (d = (0, t.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [o, (0, t.jsx)(k.f, {
				id: "org-name",
				value: P,
				onChange: c,
				placeholder: "My Organization"
			})]
		}), L[12] = P, L[13] = d) : d = L[13], L[14] === Symbol.for("react.memo_cache_sentinel") ? (m = (0, t.jsx)(S.f, {
			htmlFor: "org-slug",
			children: "Slug"
		}), L[14] = m) : m = L[14], L[15] === Symbol.for("react.memo_cache_sentinel") ? (u = e => H(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")), L[15] = u) : u = L[15], L[16] !== U ? (h = (0, t.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [m, (0, t.jsx)(k.f, {
				id: "org-slug",
				value: U,
				onChange: u,
				placeholder: "my-organization"
			})]
		}), L[16] = U, L[17] = h) : h = L[17], L[18] !== F ? (x = F && (0, t.jsx)("p", {
			className: "text-sm text-destructive",
			children: F
		}), L[18] = F, L[19] = x) : x = L[19], L[20] !== h || L[21] !== x || L[22] !== n || L[23] !== d ? (f = (0, t.jsxs)("div", {
			className: "flex flex-col gap-4 py-4",
			children: [n, d, h, x]
		}), L[20] = h, L[21] = x, L[22] = n, L[23] = d, L[24] = f) : f = L[24], L[25] !== A ? (p = (0, t.jsx)(s.f, {
			variant: "outline",
			onClick: () => A(!1),
			children: "Cancel"
		}), L[25] = A, L[26] = p) : p = L[26], L[27] !== W || L[28] !== P ? (b = W || !P.trim(), L[27] = W, L[28] = P, L[29] = b) : b = L[29];
		let E = W ? "Creating..." : "Create";
		return L[30] !== R || L[31] !== b || L[32] !== E ? (j = (0, t.jsx)(s.f, {
			onClick: R,
			disabled: b,
			children: E
		}), L[30] = R, L[31] = b, L[32] = E, L[33] = j) : j = L[33], L[34] !== p || L[35] !== j ? (v = (0, t.jsxs)(N.c, {
			children: [p, j]
		}), L[34] = p, L[35] = j, L[36] = v) : v = L[36], L[37] !== f || L[38] !== v ? (y = (0, t.jsxs)(N.d, {
			children: [l, f, v]
		}), L[37] = f, L[38] = v, L[39] = y) : y = L[39], L[40] !== A || L[41] !== M || L[42] !== y ? (C = (0, t.jsx)(N.N, {
			open: M,
			onOpenChange: A,
			children: y
		}), L[40] = A, L[41] = M, L[42] = y, L[43] = C) : C = L[43], C
	}

	function M() {
		let e, a, c, d, N, k, S, _, z, M, V, U, H, O, I, W, G, F, B, T, R, E, D, K, $, Z, Y, q, X, J, Q, ee, et, er, ea, ei, es, el, en, eo, ec, ed = (0, r.c)(104),
			{
				data: em
			} = (0, w.U)(),
			{
				data: eu
			} = (0, w.r)(),
			{
				isAdmin: eh
			} = (0, v.f)(),
			ex = (0, y.f)(),
			ef = (0, i.useRouter)(),
			[ep, eb] = (0, g.useState)(!1),
			eg = em?.user;
		if (!eg) return null;
		let ej = em?.session?.activeOrganizationId;
		if (ed[0] !== ej || ed[1] !== eu || ed[2] !== eg.email?.[0] || ed[3] !== eg.name) {
			let t;
			e = eu?.find(e => e.id === ej), ed[7] !== eg.email?.[0] || ed[8] !== eg.name ? (t = eg.name ? eg.name.split(" ").map(P).join("").toUpperCase().slice(0, 2) : eg.email?.[0]?.toUpperCase() || "U", ed[7] = eg.email?.[0], ed[8] = eg.name, ed[9] = t) : t = ed[9], a = t, c = e?.name?.[0]?.toUpperCase(), ed[0] = ej, ed[1] = eu, ed[2] = eg.email?.[0], ed[3] = eg.name, ed[4] = e, ed[5] = a, ed[6] = c
		} else e = ed[4], a = ed[5], c = ed[6];
		let ev = c,
			ey = A;
		ed[10] !== ef || ed[11] !== em?.session.userId ? (d = async () => {
			C.f.logout(em?.session.userId), await (0, w._)(), ef.push("/"), ef.refresh()
		}, ed[10] = ef, ed[11] = em?.session.userId, ed[12] = d) : d = ed[12];
		let eC = d;
		ed[13] !== e || ed[14] !== a || ed[15] !== ev || ed[16] !== eg.image || ed[17] !== eg.name ? (N = (0, t.jsx)("div", {
			className: "size-7 rounded-full overflow-hidden",
			children: e?.logo ? (0, t.jsx)(b.default, {
				src: e.logo,
				alt: e.name,
				width: 36,
				height: 36,
				className: "h-full w-full object-cover"
			}) : e ? (0, t.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-primary text-primary-foreground font-bold text-sm",
				children: ev
			}) : eg.image ? (0, t.jsx)(b.default, {
				src: eg.image,
				alt: eg.name || "User",
				width: 36,
				height: 36,
				className: "h-full w-full object-cover"
			}) : (0, t.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium text-sm",
				children: a
			})
		}), ed[13] = e, ed[14] = a, ed[15] = ev, ed[16] = eg.image, ed[17] = eg.name, ed[18] = N) : N = ed[18], ed[19] !== e || ed[20] !== a || ed[21] !== eg.image || ed[22] !== eg.name ? (k = e && (0, t.jsx)("div", {
			className: "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-background overflow-hidden",
			children: eg.image ? (0, t.jsx)(b.default, {
				src: eg.image,
				alt: eg.name || "User",
				width: 16,
				height: 16,
				className: "h-full w-full object-cover"
			}) : (0, t.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-primary/10 text-primary text-[8px] font-bold",
				children: a
			})
		}), ed[19] = e, ed[20] = a, ed[21] = eg.image, ed[22] = eg.name, ed[23] = k) : k = ed[23], ed[24] !== N || ed[25] !== k ? (S = (0, t.jsxs)("div", {
			className: "relative",
			children: [N, k]
		}), ed[24] = N, ed[25] = k, ed[26] = S) : S = ed[26], ed[27] === Symbol.for("react.memo_cache_sentinel") ? (_ = (0, t.jsx)(n.f, {
			className: "size-3 text-muted-foreground"
		}), ed[27] = _) : _ = ed[27], ed[28] !== S ? (z = (0, t.jsx)(j.X, {
			asChild: !0,
			children: (0, t.jsxs)(s.f, {
				variant: "ghost",
				className: "h-8 gap-1 rounded-full p-0 pr-1 hover:bg-accent/50 transition-all",
				children: [S, _]
			})
		}), ed[28] = S, ed[29] = z) : z = ed[29], ed[30] !== e || ed[31] !== a || ed[32] !== ev || ed[33] !== eg.image || ed[34] !== eg.name ? (M = e ? (0, t.jsxs)("div", {
			className: "relative shrink-0",
			children: [(0, t.jsx)("div", {
				className: "h-8 w-8 rounded-full overflow-hidden",
				children: e.logo ? (0, t.jsx)(b.default, {
					src: e.logo,
					alt: e.name,
					width: 32,
					height: 32,
					className: "h-full w-full object-cover"
				}) : (0, t.jsx)("div", {
					className: "flex h-full w-full items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold",
					children: ev
				})
			}), (0, t.jsx)("div", {
				className: "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full ring-2 ring-popover overflow-hidden",
				children: eg.image ? (0, t.jsx)(b.default, {
					src: eg.image,
					alt: eg.name || "User",
					width: 16,
					height: 16,
					className: "h-full w-full object-cover"
				}) : (0, t.jsx)("div", {
					className: "flex h-full w-full items-center justify-center bg-primary/10 text-primary text-[8px] font-bold",
					children: a
				})
			})]
		}) : (0, t.jsx)("div", {
			className: "h-8 w-8 rounded-full overflow-hidden shrink-0",
			children: eg.image ? (0, t.jsx)(b.default, {
				src: eg.image,
				alt: eg.name || "User",
				width: 32,
				height: 32,
				className: "h-full w-full object-cover"
			}) : (0, t.jsx)("div", {
				className: "flex h-full w-full items-center justify-center bg-primary/10 text-primary font-medium text-sm rounded-full",
				children: a
			})
		}), ed[30] = e, ed[31] = a, ed[32] = ev, ed[33] = eg.image, ed[34] = eg.name, ed[35] = M) : M = ed[35];
		let ew = e ? e.name : eg.name || "User";
		ed[36] !== ew ? (V = (0, t.jsx)("p", {
			className: "text-sm font-medium leading-none truncate",
			children: ew
		}), ed[36] = ew, ed[37] = V) : V = ed[37];
		let eN = e ? eg.name || eg.email : eg.email || "Personal";
		return ed[38] !== eN ? (U = (0, t.jsx)("p", {
			className: "text-xs text-muted-foreground mt-0.5 truncate",
			children: eN
		}), ed[38] = eN, ed[39] = U) : U = ed[39], ed[40] !== U || ed[41] !== V ? (H = (0, t.jsxs)("div", {
			className: "flex flex-col min-w-0",
			children: [V, U]
		}), ed[40] = U, ed[41] = V, ed[42] = H) : H = ed[42], ed[43] !== H || ed[44] !== M ? (O = (0, t.jsx)(j.B, {
			className: "font-normal",
			children: (0, t.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [M, H]
			})
		}), ed[43] = H, ed[44] = M, ed[45] = O) : O = ed[45], ed[46] === Symbol.for("react.memo_cache_sentinel") ? (I = (0, t.jsx)(j.U, {}), ed[46] = I) : I = ed[46], ed[47] !== ej || ed[48] !== eu ? (W = (ej || eu && eu.length > 0) && (0, t.jsx)(j.B, {
			className: "text-xs text-muted-foreground",
			children: "Switch to"
		}), ed[47] = ej, ed[48] = eu, ed[49] = W) : W = ed[49], ed[50] !== ej ? (G = ej && (0, t.jsxs)(j.r, {
			onClick: () => ey(null),
			className: "cursor-pointer",
			children: [(0, t.jsx)(p.f, {
				className: "size-4 mr-2 shrink-0"
			}), (0, t.jsx)("span", {
				children: "Personal"
			})]
		}), ed[50] = ej, ed[51] = G) : G = ed[51], ed[52] !== ej || ed[53] !== eu ? (F = eu?.filter(e => e.id !== ej).map(e => (0, t.jsxs)(j.r, {
			onClick: () => ey(e.id),
			className: "cursor-pointer",
			children: [e.logo ? (0, t.jsx)(b.default, {
				src: e.logo,
				alt: e.name,
				width: 16,
				height: 16,
				className: "size-4 mr-2 shrink-0 rounded-full object-cover"
			}) : (0, t.jsx)(l.f, {
				className: "size-4 mr-2 shrink-0"
			}), (0, t.jsx)("span", {
				className: "truncate",
				children: e.name
			})]
		}, e.id)), ed[52] = ej, ed[53] = eu, ed[54] = F) : F = ed[54], ed[55] === Symbol.for("react.memo_cache_sentinel") ? (B = () => eb(!0), ed[55] = B) : B = ed[55], ed[56] === Symbol.for("react.memo_cache_sentinel") ? (T = (0, t.jsxs)(j.r, {
			onClick: B,
			className: "cursor-pointer",
			children: [(0, t.jsx)(x.f, {
				className: "size-4 mr-2 shrink-0 text-muted-foreground"
			}), (0, t.jsx)("span", {
				className: "text-muted-foreground",
				children: "Create new organization"
			})]
		}), R = (0, t.jsx)(j.U, {}), ed[56] = T, ed[57] = R) : (T = ed[56], R = ed[57]), ed[58] !== ex ? (E = ex.toLocaleString(), ed[58] = ex, ed[59] = E) : E = ed[59], ed[60] !== E ? (D = (0, t.jsxs)(j.B, {
			className: "text-xs text-muted-foreground",
			children: ["Credits: ", E]
		}), ed[60] = E, ed[61] = D) : D = ed[61], ed[62] === Symbol.for("react.memo_cache_sentinel") ? (K = (0, t.jsx)(j.U, {}), ed[62] = K) : K = ed[62], ed[63] !== ef ? ($ = () => ef.push("/usage"), ed[63] = ef, ed[64] = $) : $ = ed[64], ed[65] === Symbol.for("react.memo_cache_sentinel") ? (Z = (0, t.jsx)(u.f, {
			className: "mr-2 h-4 w-4"
		}), ed[65] = Z) : Z = ed[65], ed[66] !== $ ? (Y = (0, t.jsxs)(j.r, {
			onClick: $,
			className: "cursor-pointer",
			children: [Z, "Usage"]
		}), ed[66] = $, ed[67] = Y) : Y = ed[67], ed[68] !== ef ? (q = () => ef.push("/api-keys"), ed[68] = ef, ed[69] = q) : q = ed[69], ed[70] === Symbol.for("react.memo_cache_sentinel") ? (X = (0, t.jsx)(m, {
			className: "mr-2 h-4 w-4"
		}), ed[70] = X) : X = ed[70], ed[71] !== q ? (J = (0, t.jsxs)(j.r, {
			onClick: q,
			className: "cursor-pointer",
			children: [X, "API Keys"]
		}), ed[71] = q, ed[72] = J) : J = ed[72], ed[73] !== ef ? (Q = () => ef.push("/billing"), ed[73] = ef, ed[74] = Q) : Q = ed[74], ed[75] === Symbol.for("react.memo_cache_sentinel") ? (ee = (0, t.jsx)(o.f, {
			className: "mr-2 h-4 w-4"
		}), ed[75] = ee) : ee = ed[75], ed[76] !== Q ? (et = (0, t.jsxs)(j.r, {
			onClick: Q,
			className: "cursor-pointer",
			children: [ee, "Billing"]
		}), ed[76] = Q, ed[77] = et) : et = ed[77], ed[78] !== eh || ed[79] !== ef ? (er = eh && (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(j.U, {}), (0, t.jsxs)(j.r, {
				onClick: () => ef.push("/admin"),
				className: "cursor-pointer",
				children: [(0, t.jsx)(f.f, {
					className: "mr-2 h-4 w-4"
				}), "Admin Panel"]
			})]
		}), ed[78] = eh, ed[79] = ef, ed[80] = er) : er = ed[80], ed[81] === Symbol.for("react.memo_cache_sentinel") ? (ea = (0, t.jsx)(j.U, {}), ed[81] = ea) : ea = ed[81], ed[82] === Symbol.for("react.memo_cache_sentinel") ? (ei = (0, t.jsx)(h.f, {
			className: "mr-2 h-4 w-4"
		}), ed[82] = ei) : ei = ed[82], ed[83] !== eC ? (es = (0, t.jsxs)(j.r, {
			onClick: eC,
			className: "cursor-pointer text-destructive",
			children: [ei, "Sign out"]
		}), ed[83] = eC, ed[84] = es) : es = ed[84], ed[85] !== O || ed[86] !== W || ed[87] !== G || ed[88] !== F || ed[89] !== D || ed[90] !== Y || ed[91] !== J || ed[92] !== et || ed[93] !== er || ed[94] !== es ? (el = (0, t.jsxs)(j.L, {
			className: "w-64",
			align: "end",
			forceMount: !0,
			children: [O, I, W, G, F, T, R, D, K, Y, J, et, er, ea, es]
		}), ed[85] = O, ed[86] = W, ed[87] = G, ed[88] = F, ed[89] = D, ed[90] = Y, ed[91] = J, ed[92] = et, ed[93] = er, ed[94] = es, ed[95] = el) : el = ed[95], ed[96] !== el || ed[97] !== z ? (en = (0, t.jsxs)(j.G, {
			children: [z, el]
		}), ed[96] = el, ed[97] = z, ed[98] = en) : en = ed[98], ed[99] !== ep ? (eo = (0, t.jsx)(L, {
			open: ep,
			onOpenChange: eb
		}), ed[99] = ep, ed[100] = eo) : eo = ed[100], ed[101] !== en || ed[102] !== eo ? (ec = (0, t.jsxs)(t.Fragment, {
			children: [en, eo]
		}), ed[101] = en, ed[102] = eo, ed[103] = ec) : ec = ed[103], ec
	}
	async function A(e) {
		await w.i.organization.setActive({
			organizationId: e
		})
	}

	function P(e) {
		return e[0]
	}
	var V = e.i(678405),
		U = e.i(181384);

	function H() {
		let e, a, l, n = (0, r.c)(15),
			{
				data: o,
				isPending: c
			} = (0, w.U)(),
			d = (0, y.f)(),
			m = (0, i.useRouter)(),
			u = (0, i.useSearchParams)();
		if (c) {
			let e;
			return n[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("div", {
				className: "h-9 w-9 rounded-full bg-muted animate-pulse"
			}), n[0] = e) : e = n[0], e
		}
		if (o?.user && !o.user.isAnonymous) {
			let e, r, a, i, s;
			return n[1] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(V.f, {
				className: "size-4 text-accent"
			}), n[1] = e) : e = n[1], n[2] !== d ? (r = (0, _.Y)(d), n[2] = d, n[3] = r) : r = n[3], n[4] !== r ? (a = (0, t.jsxs)("span", {
				className: "flex items-center gap-0.5 text-sm font-medium text-foreground",
				children: [e, r]
			}), n[4] = r, n[5] = a) : a = n[5], n[6] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(M, {}), n[6] = i) : i = n[6], n[7] !== a ? (s = (0, t.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [a, i]
			}), n[7] = a, n[8] = s) : s = n[8], s
		}
		return n[9] !== m || n[10] !== u ? (e = () => {
			m.push(`/sign-in${u.toString()?`?${u.toString()}`:""}`)
		}, n[9] = m, n[10] = u, n[11] = e) : e = n[11], n[12] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)("span", {
			className: "flex size-7 items-center justify-center rounded-full",
			children: (0, t.jsx)(U.v, {
				className: "size-4"
			})
		}), n[12] = a) : a = n[12], n[13] !== e ? (l = (0, t.jsxs)(s.f, {
			variant: "ghost",
			onClick: e,
			className: "h-8 gap-1 rounded-full border border-secondary py-0.5 pl-3 pr-1 text-sm tracking-[0.02em] text-foreground hover:bg-secondary/50",
			children: ["Sign in", a]
		}), n[13] = e, n[14] = l) : l = n[14], l
	}
	let O = (0, a.default)(() => Promise.resolve(H), {
		ssr: !1,
		loading: () => (0, t.jsx)("div", {
			className: "h-9 w-9 rounded-full bg-muted animate-pulse"
		})
	});
	e.s(["AuthHeader", 0, O], 178292)
}, 377316, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(55e3);
	let i = {
		name: "arrow-up-right",
		size: 24,
		node: [
			["path", {
				d: "M7 7h10v10",
				key: "1tivn9"
			}],
			["path", {
				d: "M7 17 17 7",
				key: "1vkiza"
			}]
		]
	};
	i.node;
	let s = (0, a.f)(i),
		l = {
			name: "circle-exclamation-point",
			size: 24,
			node: [
				["circle", {
					cx: "12",
					cy: "12",
					r: "10",
					key: "1mglay"
				}],
				["line", {
					x1: "12",
					x2: "12",
					y1: "8",
					y2: "12",
					key: "1pkeuh"
				}],
				["line", {
					x1: "12",
					x2: "12.01",
					y1: "16",
					y2: "16",
					key: "4dfq90"
				}]
			],
			aliases: ["alert-circle", "circle-alert"]
		};
	l.node;
	let n = (0, a.f)(l);
	var o = e.i(293819),
		c = e.i(927531),
		d = e.i(170380),
		m = e.i(996910),
		u = e.i(503963);
	let h = m.f.toLocaleDateString("en-US", {
		month: "long",
		day: "numeric",
		year: "numeric",
		timeZone: "UTC"
	});
	e.s(["GlobalWatermarkBanner", 0, function() {
		var e;
		let a, i, l, m, x, f, p, b, g, j, v, y, C, w, N, k, S = (0, r.c)(21),
			_ = (0, c.usePathname)(),
			{
				data: z,
				isLoading: L
			} = (0, u.k)();
		S[0] !== z || S[1] !== L || S[2] !== _ ? (a = L || !z || "/watermark" === _ || !!_?.startsWith("/watermark/") || !!_?.startsWith("/onboarding") || "approved" === z.exemptReason || !z.active && !z.grandfathered, S[0] = z, S[1] = L, S[2] = _, S[3] = a) : a = S[3];
		let M = a,
			A = (e = !M, N = (0, r.c)(3), k = (0, d.useRef)(null), N[0] !== e ? (C = () => {
				let t = document.documentElement,
					r = k.current;
				if (!e || !r) return void t.style.removeProperty("--app-bottom-inset");
				let a = new ResizeObserver(e => {
					let [r] = e;
					t.style.setProperty("--app-bottom-inset", `${Math.round(r.contentRect.height)}px`)
				});
				return a.observe(r), () => {
					a.disconnect(), t.style.removeProperty("--app-bottom-inset")
				}
			}, w = [e], N[0] = e, N[1] = C, N[2] = w) : (C = N[1], w = N[2]), (0, d.useLayoutEffect)(C, w), k);
		if (M || !z) return null;
		let P = z.request?.status;
		return z.grandfathered ? (i = `Realtime watermark turns on ${h}.`, l = "Apply now to keep your output watermark-free.", m = "pending" === P ? "View status" : "Apply now") : "pending" === P ? (i = "Watermark removal request under review.", l = "We'll let you know once it's reviewed.", m = "View status") : "declined" === P ? (i = "Your watermark removal request was declined.", l = "You can resubmit with more details.", m = "Resubmit") : "revoked" === P ? (i = "Your watermark removal was revoked.", l = "Reapply for removal in a couple of clicks.", m = "Reapply") : (i = "Your realtime output carries an AI-generated watermark.", l = "Apply for removal in a couple of clicks.", m = "Apply to remove"), S[4] === Symbol.for("react.memo_cache_sentinel") ? (x = (0, t.jsx)(n, {
			className: "size-5 shrink-0",
			"aria-hidden": "true"
		}), S[4] = x) : x = S[4], S[5] !== i ? (f = (0, t.jsx)("span", {
			className: "font-semibold",
			children: i
		}), S[5] = i, S[6] = f) : f = S[6], S[7] !== l ? (p = (0, t.jsxs)("span", {
			className: "hidden opacity-90 md:inline",
			children: [" ", l]
		}), S[7] = l, S[8] = p) : p = S[8], S[9] !== f || S[10] !== p ? (b = (0, t.jsxs)("p", {
			className: "min-w-0 flex-1 text-sm md:text-[0.95rem]",
			children: [f, p]
		}), S[9] = f, S[10] = p, S[11] = b) : b = S[11], S[12] === Symbol.for("react.memo_cache_sentinel") ? (g = (0, t.jsx)(s, {
			className: "size-3.5 md:size-4"
		}), S[12] = g) : g = S[12], S[13] !== m ? (j = (0, t.jsxs)(o.default, {
			href: "/watermark",
			className: "inline-flex items-center gap-1.5 whitespace-nowrap rounded-md bg-background px-3 py-2 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-background/90 md:text-sm",
			children: [m, g]
		}), S[13] = m, S[14] = j) : j = S[14], S[15] !== b || S[16] !== j ? (v = (0, t.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 md:gap-4 md:px-6 md:py-3.5",
			children: [x, b, j]
		}), S[15] = b, S[16] = j, S[17] = v) : v = S[17], S[18] !== A || S[19] !== v ? (y = (0, t.jsx)("div", {
			ref: A,
			role: "status",
			className: "sticky bottom-0 z-30 w-full border-t bg-accent text-accent-foreground shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.15)]",
			children: v
		}), S[18] = A, S[19] = v, S[20] = y) : y = S[20], y
	}], 377316)
}, 291042, e => {
	"use strict";
	var t, r = e.i(234984),
		a = e.i(582018),
		i = e.i(927531),
		s = e.i(427658),
		l = e.i(685808);
	e.i(540580);
	var n = e.i(818036);

	function o(e) {
		let t, i, s = (0, a.c)(4);
		return s[0] !== e ? ({
			...t
		} = e, s[0] = e, s[1] = t) : t = s[1], s[2] !== t ? (i = (0, r.jsx)("nav", {
			"aria-label": "breadcrumb",
			"data-slot": "breadcrumb",
			...t
		}), s[2] = t, s[3] = i) : i = s[3], i
	}

	function c(e) {
		let t, i, s, l, o = (0, a.c)(8);
		return o[0] !== e ? ({
			className: t,
			...i
		} = e, o[0] = e, o[1] = t, o[2] = i) : (t = o[1], i = o[2]), o[3] !== t ? (s = (0, n.c)("text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words", t), o[3] = t, o[4] = s) : s = o[4], o[5] !== i || o[6] !== s ? (l = (0, r.jsx)("ol", {
			"data-slot": "breadcrumb-list",
			className: s,
			...i
		}), o[5] = i, o[6] = s, o[7] = l) : l = o[7], l
	}

	function d(e) {
		let t, i, s, l, o = (0, a.c)(8);
		return o[0] !== e ? ({
			className: t,
			...i
		} = e, o[0] = e, o[1] = t, o[2] = i) : (t = o[1], i = o[2]), o[3] !== t ? (s = (0, n.c)("inline-flex items-center gap-1.5", t), o[3] = t, o[4] = s) : s = o[4], o[5] !== i || o[6] !== s ? (l = (0, r.jsx)("li", {
			"data-slot": "breadcrumb-item",
			className: s,
			...i
		}), o[5] = i, o[6] = s, o[7] = l) : l = o[7], l
	}

	function m(e) {
		let t, i, l, o, c, d = (0, a.c)(10);
		d[0] !== e ? ({
			asChild: t,
			className: i,
			...l
		} = e, d[0] = e, d[1] = t, d[2] = i, d[3] = l) : (t = d[1], i = d[2], l = d[3]);
		let m = t ? s.M : "a";
		return d[4] !== i ? (o = (0, n.c)("hover:text-foreground transition-colors", i), d[4] = i, d[5] = o) : o = d[5], d[6] !== m || d[7] !== l || d[8] !== o ? (c = (0, r.jsx)(m, {
			"data-slot": "breadcrumb-link",
			className: o,
			...l
		}), d[6] = m, d[7] = l, d[8] = o, d[9] = c) : c = d[9], c
	}

	function u(e) {
		let t, i, s, l, o = (0, a.c)(8);
		return o[0] !== e ? ({
			className: t,
			...i
		} = e, o[0] = e, o[1] = t, o[2] = i) : (t = o[1], i = o[2]), o[3] !== t ? (s = (0, n.c)("text-foreground font-normal", t), o[3] = t, o[4] = s) : s = o[4], o[5] !== i || o[6] !== s ? (l = (0, r.jsx)("span", {
			"data-slot": "breadcrumb-page",
			"aria-disabled": "true",
			"aria-current": "page",
			className: s,
			...i
		}), o[5] = i, o[6] = s, o[7] = l) : l = o[7], l
	}

	function h(e) {
		let t, i, s, o, c, d, m = (0, a.c)(12);
		return m[0] !== e ? ({
			children: t,
			className: i,
			...s
		} = e, m[0] = e, m[1] = t, m[2] = i, m[3] = s) : (t = m[1], i = m[2], s = m[3]), m[4] !== i ? (o = (0, n.c)("[&>svg]:size-3.5", i), m[4] = i, m[5] = o) : o = m[5], m[6] !== t ? (c = t ?? (0, r.jsx)(l.f, {}), m[6] = t, m[7] = c) : c = m[7], m[8] !== s || m[9] !== o || m[10] !== c ? (d = (0, r.jsx)("li", {
			"data-slot": "breadcrumb-separator",
			role: "presentation",
			"aria-hidden": "true",
			className: o,
			...s,
			children: c
		}), m[8] = s, m[9] = o, m[10] = c, m[11] = d) : d = m[11], d
	}
	var x = e.i(663303),
		f = e.i(669982);
	e.i(170380);
	let p = (0, e.i(868496).$)(e => ({
			overrides: {},
			setOverride: (t, r) => e(e => {
				let a = {
					...e.overrides
				};
				return null === r ? delete a[t] : a[t] = r, {
					overrides: a
				}
			})
		})),
		b = [...f.y, ...f.P],
		g = {
			studio: "Preset Studio"
		};
	var j = ((t = j || {}).MODELS = "/models", t.PLAYGROUND = "/playground", t);
	let v = {
		"/models": "/",
		"/playground": "/"
	};

	function y(e) {
		return "" !== e
	}

	function C(e) {
		return e.overrides
	}
	e.s(["AppBreadCrumbs", 0, function() {
		let e, t, s, l, n, f, j, w = (0, a.c)(24),
			N = (0, i.usePathname)(),
			k = p(C),
			{
				data: S
			} = (0, x.U)();
		w[0] !== N ? (e = b.find(e => e.url === N) ?? null, w[0] = N, w[1] = e) : e = w[1];
		let _ = e;
		if (w[2] !== _ || w[3] !== k || w[4] !== N || w[5] !== S?.user?.isAnonymous || w[6] !== S?.user?.name) {
			n = Symbol.for("react.early_return_sentinel");
			e: {
				let e, a, i = N.split("/").filter(y);w[11] !== S?.user?.isAnonymous || w[12] !== S?.user?.name ? (e = S?.user?.isAnonymous ? void 0 : S?.user?.name?.trim().split(/\s+/)[0], w[11] = S?.user?.isAnonymous, w[12] = S?.user?.name, w[13] = e) : e = w[13];
				let x = e,
					f = x ? `Welcome back, ${x}` : "Welcome!";
				if (0 === i.length) {
					let e;
					w[14] !== f ? (e = (0, r.jsx)(o, {
						children: (0, r.jsx)(c, {
							children: (0, r.jsx)(d, {
								children: (0, r.jsx)(u, {
									children: f
								})
							})
						})
					}), w[14] = f, w[15] = e) : e = w[15], n = e;
					break e
				}
				let p = i.map((e, t) => {
					let r, a = `/${i.slice(0,t+1).join("/")}`,
						s = t === i.length - 1;
					return r = k[e] ? k[e] : g[e] ? g[e] : s && _ ? _.title : e.split("-").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" "), {
						href: a in v ? v[a] : a,
						label: r,
						isLast: s
					}
				});s = o,
				t = c,
				w[16] !== f ? (a = (e, t) => (0, r.jsxs)("div", {
					className: "flex items-center gap-[inherit]",
					children: [(0, r.jsx)("div", {
						className: "flex items-center",
						children: (0, r.jsx)(d, {
							className: 0 === t ? "hidden md:block" : "",
							children: e.isLast ? (0, r.jsx)(u, {
								children: "/" === e.href ? f : e.label
							}) : (0, r.jsx)(m, {
								href: e.href,
								children: e.label
							})
						})
					}), !e.isLast && (0, r.jsx)(h, {
						className: 0 === t ? "hidden md:block" : ""
					})]
				}, e.href), w[16] = f, w[17] = a) : a = w[17],
				l = p.map(a)
			}
			w[2] = _, w[3] = k, w[4] = N, w[5] = S?.user?.isAnonymous, w[6] = S?.user?.name, w[7] = t, w[8] = s, w[9] = l, w[10] = n
		} else t = w[7], s = w[8], l = w[9], n = w[10];
		return n !== Symbol.for("react.early_return_sentinel") ? n : (w[18] !== t || w[19] !== l ? (f = (0, r.jsx)(t, {
			children: l
		}), w[18] = t, w[19] = l, w[20] = f) : f = w[20], w[21] !== s || w[22] !== f ? (j = (0, r.jsx)(s, {
			children: f
		}), w[21] = s, w[22] = f, w[23] = j) : j = w[23], j)
	}], 291042)
}, 589225, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(927531),
		i = e.i(480847),
		s = e.i(55e3);
	let l = {
		name: "arrow-left",
		size: 24,
		node: [
			["path", {
				d: "m12 19-7-7 7-7",
				key: "1l729n"
			}],
			["path", {
				d: "M19 12H5",
				key: "x3x0zl"
			}]
		]
	};
	l.node;
	let n = (0, s.f)(l);
	var o = e.i(815924),
		c = e.i(876532);
	let d = {
		name: "clapperboard",
		size: 24,
		node: [
			["path", {
				d: "m12.296 3.464 3.02 3.956",
				key: "qash78"
			}],
			["path", {
				d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z",
				key: "1h7j8b"
			}],
			["path", {
				d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
				key: "4lm6w1"
			}],
			["path", {
				d: "m6.18 5.276 3.1 3.899",
				key: "zjj9t3"
			}]
		]
	};
	d.node;
	let m = (0, s.f)(d);
	var u = e.i(510342),
		h = e.i(627007),
		x = e.i(206116),
		f = e.i(255402),
		p = e.i(366559),
		b = e.i(67344),
		g = e.i(385569),
		j = e.i(210742),
		v = e.i(18709),
		y = e.i(293819),
		C = e.i(638644),
		w = e.i(818036);
	let N = e => {
			let a, i, s, l, n, o, c, d = (0, r.c)(60),
				{
					icon: m,
					title: u,
					url: h,
					isActive: x,
					isExternal: f,
					onClick: p,
					className: b,
					children: g,
					showTooltip: v,
					iconClassName: N,
					size: k
				} = e,
				S = void 0 === k ? "compact" : k,
				{
					toggleSidebar: _,
					state: z
				} = (0, j.useSidebar)(),
				L = (0, C.f)(),
				M = "collapsed" === z,
				A = "function" == typeof m,
				P = "nav" !== S || M ? void 0 : N ?? "size-4";
			d[0] !== P ? (a = (0, w.c)("shrink-0", P), d[0] = P, d[1] = a) : a = d[1];
			let V = a;
			d[2] !== m || d[3] !== V || d[4] !== A || d[5] !== x ? (i = m && (A ? (0, t.jsx)(m, {
				isActive: x,
				className: V
			}) : (0, t.jsx)(m, {
				className: V
			})), d[2] = m, d[3] = V, d[4] = A, d[5] = x, d[6] = i) : i = d[6];
			let U = i;
			d[7] !== U || d[8] !== M || d[9] !== S ? (s = "nav" !== S || M ? U : (0, t.jsx)("span", {
				className: "flex size-8 shrink-0 items-center justify-center",
				children: U
			}), d[7] = U, d[8] = M, d[9] = S, d[10] = s) : s = d[10], d[11] !== g || d[12] !== M || d[13] !== u ? (l = !M && (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)("span", {
					className: "text-sm font-normal leading-tight whitespace-nowrap truncate min-w-0",
					children: u
				}), g]
			}), d[11] = g, d[12] = M, d[13] = u, d[14] = l) : l = d[14], d[15] !== s || d[16] !== l ? (n = (0, t.jsxs)(t.Fragment, {
				children: [s, l]
			}), d[15] = s, d[16] = l, d[17] = n) : n = d[17];
			let H = n,
				O = "nav" === S ? "gap-1 px-1 h-[38px] rounded-lg" : "gap-2 px-3 h-8 rounded-xl",
				I = x ? "bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
				W = M && "!w-full !h-auto !p-2 justify-center [&>svg]:!size-5";
			d[18] !== b || d[19] !== O || d[20] !== I || d[21] !== W ? (o = (0, w.c)(O, I, W, b), d[18] = b, d[19] = O, d[20] = I, d[21] = W, d[22] = o) : o = d[22];
			let G = o,
				F = void 0 === v || v ? u : void 0;
			if (h) {
				let e, r, a;
				if (void 0 !== f && f) {
					let e, r, a;
					d[23] !== p ? (e = () => {
						p?.()
					}, d[23] = p, d[24] = e) : e = d[24];
					let i = e;
					return d[25] !== H || d[26] !== i || d[27] !== h ? (r = (0, t.jsx)("a", {
						href: h,
						target: "_blank",
						rel: "noopener noreferrer",
						onClick: i,
						children: H
					}), d[25] = H, d[26] = i, d[27] = h, d[28] = r) : r = d[28], d[29] !== G || d[30] !== x || d[31] !== r || d[32] !== F ? (a = (0, t.jsx)(j.SidebarMenuButton, {
						asChild: !0,
						className: G,
						isActive: x,
						tooltip: F,
						children: r
					}), d[29] = G, d[30] = x, d[31] = r, d[32] = F, d[33] = a) : a = d[33], a
				}
				d[34] !== L || d[35] !== p || d[36] !== _ ? (e = () => {
					p?.(), L && _()
				}, d[34] = L, d[35] = p, d[36] = _, d[37] = e) : e = d[37];
				let i = e;
				return d[38] !== H || d[39] !== i || d[40] !== h ? (r = (0, t.jsx)(y.default, {
					href: h,
					onClick: i,
					children: H
				}), d[38] = H, d[39] = i, d[40] = h, d[41] = r) : r = d[41], d[42] !== G || d[43] !== x || d[44] !== r || d[45] !== F ? (a = (0, t.jsx)(j.SidebarMenuButton, {
					asChild: !0,
					className: G,
					isActive: x,
					tooltip: F,
					children: r
				}), d[42] = G, d[43] = x, d[44] = r, d[45] = F, d[46] = a) : a = d[46], a
			}
			if (p) {
				let e, r;
				return d[47] !== H || d[48] !== p ? (e = (0, t.jsx)("button", {
					type: "button",
					onClick: p,
					children: H
				}), d[47] = H, d[48] = p, d[49] = e) : e = d[49], d[50] !== G || d[51] !== x || d[52] !== e || d[53] !== F ? (r = (0, t.jsx)(j.SidebarMenuButton, {
					asChild: !0,
					className: G,
					isActive: x,
					tooltip: F,
					children: e
				}), d[50] = G, d[51] = x, d[52] = e, d[53] = F, d[54] = r) : r = d[54], r
			}
			return d[55] !== G || d[56] !== H || d[57] !== x || d[58] !== F ? (c = (0, t.jsx)(j.SidebarMenuButton, {
				className: G,
				isActive: x,
				tooltip: F,
				children: H
			}), d[55] = G, d[56] = H, d[57] = x, d[58] = F, d[59] = c) : c = d[59], c
		},
		k = [{
			title: "Dashboard",
			url: "/admin",
			icon: h.f
		}, {
			title: "Users",
			url: "/admin/users",
			icon: p.f
		}, {
			title: "Organizations",
			url: "/admin/organizations",
			icon: c.f
		}, {
			title: "Credits",
			url: "/admin/credits",
			icon: b.f
		}, {
			title: "Watermark Removal",
			url: "/admin/watermark-removal",
			icon: u.f
		}, {
			title: "Refunds",
			url: "/admin/refunds",
			icon: o.f
		}, {
			title: "Model Examples",
			url: "/admin/model-examples",
			icon: m
		}, {
			title: "Presets",
			url: "/admin/presets",
			icon: f.f
		}],
		S = [{
			title: "Back to App",
			url: "/",
			icon: n
		}];

	function _() {
		let e, i, s, l, n, o, c, d = (0, r.c)(10),
			m = (0, a.usePathname)();
		return d[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(j.SidebarHeader, {
			className: "mb-2",
			children: (0, t.jsx)(v.P, {
				className: "text-8xl",
				href: "/admin"
			})
		}), d[0] = e) : e = d[0], d[1] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsxs)(j.SidebarGroupLabel, {
			className: "flex items-center gap-2",
			children: [(0, t.jsx)(x.f, {
				className: "h-4 w-4"
			}), "Admin Panel"]
		}), d[1] = i) : i = d[1], d[2] !== m ? (s = k.map(e => {
			let r = m === e.url;
			return (0, t.jsx)(j.SidebarMenuItem, {
				children: (0, t.jsx)(N, {
					icon: e.icon,
					title: e.title,
					url: e.url,
					isActive: r
				})
			}, e.title)
		}), d[2] = m, d[3] = s) : s = d[3], d[4] !== s ? (l = (0, t.jsxs)(j.SidebarGroup, {
			children: [i, (0, t.jsx)(j.SidebarGroupContent, {
				children: (0, t.jsx)(j.SidebarMenu, {
					className: "gap-2",
					children: s
				})
			})]
		}), d[4] = s, d[5] = l) : l = d[5], d[6] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)(g.Separator, {
			className: "my-2"
		}), d[6] = n) : n = d[6], d[7] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)(j.SidebarFooter, {
			className: "mt-auto",
			children: S.map(z)
		}), d[7] = o) : o = d[7], d[8] !== l ? (c = (0, t.jsx)(j.Sidebar, {
			variant: "inset",
			children: (0, t.jsxs)(j.SidebarContent, {
				children: [e, l, n, o]
			})
		}), d[8] = l, d[9] = c) : c = d[9], c
	}

	function z(e) {
		let r = e.url.startsWith("http");
		return (0, t.jsx)(N, {
			icon: e.icon,
			title: e.title,
			url: e.url,
			isActive: !1,
			isExternal: r
		}, e.title)
	}
	var L = e.i(170380),
		M = e.i(727677),
		A = e.i(379797),
		P = e.i(80885),
		P = P,
		V = e.i(848148),
		U = e.i(322932),
		H = e.i(8774),
		O = e.i(782241),
		I = e.i(480381),
		W = e.i(684128),
		G = e.i(932767),
		F = e.i(380491),
		B = e.i(149218),
		T = e.i(663303),
		R = e.i(689489);

	function E({
		open: e,
		onOpenChange: r,
		onEnterpriseLinkClick: a
	}) {
		let [i, s] = (0, L.useState)(!1), {
			data: l
		} = (0, T.U)(), n = l?.user?.email || "", o = (0, V.G)({
			resolver: (0, A.f)(R.t),
			defaultValues: {
				products: [],
				email: n,
				firstName: "",
				lastName: "",
				companyName: "",
				industry: "",
				companySize: "",
				message: ""
			}
		});
		(0, L.useEffect)(() => {
			n && o.setValue("email", n)
		}, [n, o]);
		let c = o.watch("products") || [],
			d = async e => {
				s(!0);
				try {
					let t = await fetch("/api/contact", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(e)
					});
					if (!t.ok) {
						let e = await t.json();
						throw Error(e.error || "Failed to send message")
					}
					U.c.success("Message sent successfully!", {
						description: "We'll get back to you as soon as possible."
					}), o.reset(), r(!1)
				} catch (e) {
					console.error("Contact form error:", e), U.c.error("Failed to send message", {
						description: e instanceof Error ? e.message : "Please try again later."
					})
				} finally {
					s(!1)
				}
			};
		return (0, t.jsx)(I.N, {
			open: e,
			onOpenChange: r,
			children: (0, t.jsxs)(I.d, {
				className: "sm:max-w-2xl max-h-[90vh] overflow-y-auto",
				children: [(0, t.jsxs)(I.s, {
					children: [(0, t.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [(0, t.jsx)("div", {
							className: "rounded-full bg-accent p-2",
							children: (0, t.jsx)(P.f, {
								className: "size-4"
							})
						}), (0, t.jsx)(I.F, {
							children: "Contact us"
						})]
					}), (0, t.jsxs)(I.C, {
						children: ["Please fill out the form below, and a team member will get in touch with you shortly. If you're interested to use the API, please review our", " ", (0, t.jsx)("a", {
							href: "#",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-primary underline hover:no-underline",
							children: "API Documentation"
						}), "."]
					})]
				}), (0, t.jsx)(W.n, {
					...o,
					children: (0, t.jsxs)("form", {
						onSubmit: o.handleSubmit(d),
						className: "flex flex-col gap-8",
						children: [(0, t.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-2",
							children: [(0, t.jsx)(W.G, {
								control: o.control,
								name: "firstName",
								render: ({
									field: e
								}) => (0, t.jsxs)(W.V, {
									children: [(0, t.jsx)(W.y, {
										children: "First Name"
									}), (0, t.jsx)(W.K, {
										children: (0, t.jsx)(G.f, {
											placeholder: "John",
											...e
										})
									}), (0, t.jsx)(W.o, {})]
								})
							}), (0, t.jsx)(W.G, {
								control: o.control,
								name: "lastName",
								render: ({
									field: e
								}) => (0, t.jsxs)(W.V, {
									children: [(0, t.jsx)(W.y, {
										children: "Last Name"
									}), (0, t.jsx)(W.K, {
										children: (0, t.jsx)(G.f, {
											placeholder: "Doe",
											...e
										})
									}), (0, t.jsx)(W.o, {})]
								})
							})]
						}), (0, t.jsx)(W.G, {
							control: o.control,
							name: "email",
							render: ({
								field: e
							}) => (0, t.jsxs)(W.V, {
								children: [(0, t.jsx)(W.y, {
									children: "Email"
								}), (0, t.jsx)(W.K, {
									children: (0, t.jsx)(G.f, {
										type: "email",
										placeholder: "john@company.com",
										...e
									})
								}), (0, t.jsx)(W.o, {})]
							})
						}), (0, t.jsxs)("div", {
							className: "grid gap-4 md:grid-cols-3",
							children: [(0, t.jsx)(W.G, {
								control: o.control,
								name: "companyName",
								render: ({
									field: e
								}) => (0, t.jsxs)(W.V, {
									children: [(0, t.jsx)(W.y, {
										children: "Company Name"
									}), (0, t.jsx)(W.K, {
										children: (0, t.jsx)(G.f, {
											placeholder: "Acme Inc.",
											...e
										})
									}), (0, t.jsx)(W.o, {})]
								})
							}), (0, t.jsx)(W.G, {
								control: o.control,
								name: "companySize",
								render: ({
									field: e
								}) => (0, t.jsxs)(W.V, {
									children: [(0, t.jsx)(W.y, {
										children: "Company Size"
									}), (0, t.jsxs)(F.d, {
										onValueChange: e.onChange,
										value: e.value,
										children: [(0, t.jsx)(W.K, {
											children: (0, t.jsx)(F.P, {
												children: (0, t.jsx)(F.U, {
													placeholder: "Select company size"
												})
											})
										}), (0, t.jsx)(F.r, {
											children: R.s.map(e => (0, t.jsxs)(F.T, {
												value: e,
												children: [e, " employees"]
											}, e))
										})]
									}), (0, t.jsx)(W.o, {})]
								})
							}), (0, t.jsx)(W.G, {
								control: o.control,
								name: "industry",
								render: ({
									field: e
								}) => (0, t.jsxs)(W.V, {
									children: [(0, t.jsx)(W.y, {
										children: "Industry"
									}), (0, t.jsxs)(F.d, {
										onValueChange: e.onChange,
										value: e.value,
										children: [(0, t.jsx)(W.K, {
											children: (0, t.jsx)(F.P, {
												children: (0, t.jsx)(F.U, {
													placeholder: "Select your industry"
												})
											})
										}), (0, t.jsx)(F.r, {
											children: R.Z.map(e => (0, t.jsx)(F.T, {
												value: e,
												children: e
											}, e))
										})]
									}), (0, t.jsx)(W.o, {})]
								})
							})]
						}), (0, t.jsx)(W.G, {
							control: o.control,
							name: "products",
							render: ({
								field: e
							}) => (0, t.jsxs)(W.V, {
								children: [(0, t.jsx)(W.y, {
									children: "What products are you interested in?"
								}), (0, t.jsx)("div", {
									className: "grid gap-3 md:grid-cols-2",
									children: R.f.map(r => (0, t.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [(0, t.jsx)(O.f, {
											id: `product-${r}`,
											checked: c.includes(r),
											onCheckedChange: t => {
												let a = e.value || [],
													i = t ? [...a, r] : a.filter(e => e !== r);
												e.onChange(i)
											}
										}), (0, t.jsx)("label", {
											htmlFor: `product-${r}`,
											className: "text-sm cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
											children: r
										})]
									}, r))
								}), (0, t.jsx)(W.o, {})]
							})
						}), (0, t.jsx)(W.G, {
							control: o.control,
							name: "message",
							render: ({
								field: e
							}) => (0, t.jsxs)(W.V, {
								children: [(0, t.jsx)(W.y, {
									children: "Message"
								}), (0, t.jsx)(W.K, {
									children: (0, t.jsx)(B.f, {
										placeholder: "Tell us about your use case and how we can help...",
										rows: 5,
										className: "resize-none",
										...e
									})
								}), (0, t.jsx)(W.o, {})]
							})
						}), (0, t.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [a ? (0, t.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: ["Need custom volumes or SLAs?", " ", (0, t.jsx)("button", {
									type: "button",
									onClick: a,
									className: "text-primary underline hover:no-underline",
									children: "Talk to sales"
								})]
							}) : (0, t.jsx)("div", {}), (0, t.jsxs)("div", {
								className: "flex gap-3",
								children: [(0, t.jsx)(H.f, {
									type: "button",
									variant: "outline",
									onClick: () => r(!1),
									disabled: i,
									children: "Cancel"
								}), (0, t.jsx)(H.f, {
									type: "submit",
									disabled: i,
									children: i ? "Sending..." : "Send message"
								})]
							})]
						})]
					})
				})]
			})
		})
	}
	var D = e.i(483561),
		K = e.i(528506),
		$ = e.i(366361),
		Z = e.i(181384),
		Y = e.i(669982);

	function q() {
		let e, i, s, l, n, o, c, d, m, u, h, x, f, p, b, g, C, k, S, _, z, A, P = (0, r.c)(59),
			V = (0, a.usePathname)(),
			{
				state: U
			} = (0, j.useSidebar)(),
			H = "collapsed" === U,
			[O, I] = (0, L.useState)(!1),
			[W, G] = (0, L.useState)(!1),
			{
				data: F
			} = (0, T.U)(),
			B = F?.session?.activeOrganizationId,
			{
				data: R
			} = (0, T.r)();
		P[0] !== B || P[1] !== R ? (e = B && R?.some(e => e.id === B), P[0] = B, P[1] = R, P[2] = e) : e = P[2];
		let K = e;
		P[3] !== K ? (i = K ? Y.P : Y.P.filter(J), P[3] = K, P[4] = i) : i = P[4];
		let q = i;
		P[5] !== H || P[6] !== V ? (s = (e, r) => {
			let a = e.url === V || !!e.url && "/" !== e.url && V.startsWith(`${e.url}/`),
				i = e.icon;
			if (H) {
				let r = (0, t.jsxs)("div", {
					className: (0, w.c)("flex flex-col items-center justify-center gap-1 py-2 w-full rounded-lg transition-colors", a ? "bg-sidebar-accent text-sidebar-foreground" : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"),
					children: ["function" == typeof i ? (0, t.jsx)(i, {
						className: "size-5",
						isActive: a
					}) : (0, t.jsx)(i, {
						className: "size-5"
					}), (0, t.jsx)("span", {
						className: "text-[10px] leading-tight",
						children: e.collapsedLabel || e.title
					})]
				});
				return (0, t.jsx)(j.SidebarMenuItem, {
					children: e.url ? (0, t.jsx)(y.default, {
						href: e.url,
						children: r
					}) : r
				}, e.title)
			}
			return (0, t.jsx)(j.SidebarMenuItem, {
				children: (0, t.jsx)(N, {
					icon: e.icon,
					iconClassName: e.iconClassName,
					title: e.title,
					url: e.url,
					isActive: a,
					size: void 0 === r ? "nav" : r,
					children: e.badge && (0, t.jsx)(M.f, {
						className: "bg-muted-foreground text-sidebar text-[10px] leading-none tracking-[0.02em] px-1 py-0.5 hover:bg-muted-foreground rounded-full",
						children: e.badge
					})
				})
			}, e.title)
		}, P[5] = H, P[6] = V, P[7] = s) : s = P[7];
		let Q = s,
			ee = X;
		P[8] !== H ? (l = e => {
			let r = e.icon;
			return H ? (0, t.jsx)(j.SidebarMenuItem, {
				children: (0, t.jsxs)("a", {
					href: e.url,
					target: "_blank",
					rel: "noopener noreferrer",
					onClick: () => ee(e),
					className: "flex flex-col items-center justify-center gap-1 py-2 w-full rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
					title: e.title,
					children: [(0, t.jsx)(r, {
						className: "size-5"
					}), (0, t.jsx)("span", {
						className: "text-[10px] leading-tight",
						children: e.collapsedLabel || e.title
					})]
				})
			}, e.title) : (0, t.jsx)(j.SidebarMenuItem, {
				children: (0, t.jsx)(N, {
					icon: e.icon,
					title: e.title,
					url: e.url,
					isActive: !1,
					isExternal: e.url?.startsWith("http"),
					onClick: () => ee(e)
				})
			}, e.title)
		}, P[8] = H, P[9] = l) : l = P[9];
		let et = l,
			er = H ? "flex-col justify-center gap-4 py-2 border-b border-sidebar-border" : "h-12 flex-row justify-between px-3 py-2";
		P[10] !== er ? (n = (0, w.c)("items-center", er), P[10] = er, P[11] = n) : n = P[11], P[12] !== H ? (o = H ? (0, t.jsx)("a", {
			href: "/",
			children: (0, t.jsx)(v.l, {
				className: "size-7"
			})
		}) : (0, t.jsxs)(t.Fragment, {
			children: [(0, t.jsx)(v.P, {
				className: "text-[85px]",
				href: "/"
			}), (0, t.jsx)(j.SidebarTrigger, {
				className: "size-[30px] rounded-full border border-sidebar-border text-muted-foreground hover:text-sidebar-foreground hover:bg-transparent",
				children: (0, t.jsx)(Z.Q, {
					className: "size-3"
				})
			})]
		}), P[12] = H, P[13] = o) : o = P[13], P[14] !== n || P[15] !== o ? (c = (0, t.jsx)(j.SidebarHeader, {
			className: n,
			children: o
		}), P[14] = n, P[15] = o, P[16] = c) : c = P[16], P[17] !== H ? (d = H && (0, t.jsx)(j.SidebarGroup, {
			className: "p-2 pb-0",
			children: (0, t.jsx)("div", {
				className: "flex flex-col items-center px-2 py-2 rounded-full border border-sidebar-border mx-auto w-fit",
				children: (0, t.jsx)(j.SidebarTrigger, {
					className: "text-muted-foreground hover:text-sidebar-foreground hover:bg-transparent! size-5!"
				})
			})
		}), P[17] = H, P[18] = d) : d = P[18], P[19] !== H || P[20] !== Q ? (m = Y.X.map(e => (0, t.jsxs)(j.SidebarGroup, {
			className: (0, w.c)(H ? "p-2" : "px-3 py-0", !H && e.label && "pt-3"),
			...e.label ? {
				role: "group",
				"aria-label": e.label
			} : {},
			children: [e.label && !H && (0, t.jsx)(j.SidebarGroupLabel, {
				className: "h-auto p-0 mb-2 ms-0 text-xs font-normal uppercase text-muted-foreground",
				children: e.label
			}), (0, t.jsx)(j.SidebarGroupContent, {
				children: (0, t.jsx)(j.SidebarMenu, {
					className: (0, w.c)(e.label ? "gap-0" : "gap-1", H && "gap-2"),
					children: e.items.map(e => Q(e))
				})
			})]
		}, e.label ?? "primary")), P[19] = H, P[20] = Q, P[21] = m) : m = P[21], P[22] !== d || P[23] !== m ? (u = (0, t.jsxs)(j.SidebarContent, {
			className: "md:pr-0",
			children: [d, m]
		}), P[22] = d, P[23] = m, P[24] = u) : u = P[24];
		let ea = !H && "mx-3 px-0";
		P[25] !== ea ? (h = (0, w.c)("mt-auto pt-3 pb-3", ea), P[25] = ea, P[26] = h) : h = P[26];
		let ei = H && "gap-2";
		if (P[27] !== ei ? (x = (0, w.c)("gap-0", ei), P[27] = ei, P[28] = x) : x = P[28], P[29] !== q || P[30] !== Q) {
			let e;
			P[32] !== Q ? (e = e => Q(e, "compact"), P[32] = Q, P[33] = e) : e = P[33], f = q.map(e), P[29] = q, P[30] = Q, P[31] = f
		} else f = P[31];
		return P[34] !== et ? (p = Y.i.map(et), P[34] = et, P[35] = p) : p = P[35], P[36] !== H ? (b = (0, t.jsx)(j.SidebarMenuItem, {
			children: H ? (0, t.jsxs)("button", {
				type: "button",
				onClick: () => I(!0),
				className: "flex flex-col items-center justify-center gap-1 py-2 w-full rounded-lg text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors",
				title: "Contact us",
				children: [(0, t.jsx)($.A, {
					className: "size-5"
				}), (0, t.jsx)("span", {
					className: "text-[10px] leading-tight",
					children: "Contact"
				})]
			}) : (0, t.jsx)(N, {
				icon: $.A,
				title: "Contact us",
				onClick: () => I(!0),
				isActive: !1
			})
		}), P[36] = H, P[37] = b) : b = P[37], P[38] !== x || P[39] !== f || P[40] !== p || P[41] !== b ? (g = (0, t.jsxs)(j.SidebarMenu, {
			className: x,
			children: [f, p, b]
		}), P[38] = x, P[39] = f, P[40] = p, P[41] = b, P[42] = g) : g = P[42], P[43] !== h || P[44] !== g ? (C = (0, t.jsx)(j.SidebarFooter, {
			className: h,
			children: g
		}), P[43] = h, P[44] = g, P[45] = C) : C = P[45], P[46] !== u || P[47] !== C || P[48] !== c ? (k = (0, t.jsxs)(j.Sidebar, {
			variant: "inset",
			collapsible: "icon",
			className: "py-0 pl-0 group-data-[side=left]:border-r-0",
			children: [c, u, C]
		}), P[46] = u, P[47] = C, P[48] = c, P[49] = k) : k = P[49], P[50] === Symbol.for("react.memo_cache_sentinel") ? (S = () => {
			I(!1), G(!0)
		}, P[50] = S) : S = P[50], P[51] !== O ? (_ = (0, t.jsx)(E, {
			open: O,
			onOpenChange: I,
			onEnterpriseLinkClick: S
		}), P[51] = O, P[52] = _) : _ = P[52], P[53] !== W ? (z = (0, t.jsx)(D.f, {
			open: W,
			onOpenChange: G
		}), P[53] = W, P[54] = z) : z = P[54], P[55] !== k || P[56] !== _ || P[57] !== z ? (A = (0, t.jsxs)(t.Fragment, {
			children: [k, _, z]
		}), P[55] = k, P[56] = _, P[57] = z, P[58] = A) : A = P[58], A
	}

	function X(e) {
		"Documentation" === e.title && K.f.trackDocumentationClicked()
	}

	function J(e) {
		return "/organization" !== e.url
	}
	e.s(["ConditionalSidebar", 0, function() {
		let e, s, l = (0, r.c)(4),
			n = (0, a.usePathname)(),
			{
				isAdmin: o
			} = (0, i.f)();
		l[0] !== n ? (e = n.startsWith("/admin"), l[0] = n, l[1] = e) : e = l[1];
		let c = e && o;
		return l[2] !== c ? (s = c ? (0, t.jsx)(_, {}) : (0, t.jsx)(q, {}), l[2] = c, l[3] = s) : s = l[3], s
	}], 589225)
}, 669982, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(818036);
	let i = "shrink-0 size-4",
		s = e => {
			let a, i, s, l = (0, r.c)(5),
				{
					frame: n
				} = e;
			return l[0] !== n ? (a = (0, t.jsx)("path", {
				d: n,
				stroke: "currentColor",
				strokeWidth: "1.2",
				strokeLinecap: "round"
			}), l[0] = n, l[1] = a) : a = l[1], l[2] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)("path", {
				d: "M4.1 8.25237V4.55734C4.1 3.92607 4.79692 3.5435 5.3295 3.88241L8.45606 5.87204C8.96998 6.19908 8.94441 6.95759 8.40964 7.24929L5.28308 8.95468C4.74998 9.24546 4.1 8.85961 4.1 8.25237Z",
				stroke: "currentColor",
				strokeWidth: "1.2",
				strokeLinecap: "round"
			}), l[2] = i) : i = l[2], l[3] !== a ? (s = (0, t.jsxs)(t.Fragment, {
				children: [a, i]
			}), l[3] = a, l[4] = s) : s = l[4], s
		},
		l = "M12.1 6.1V3.4C12.1 1.8536 10.8464 0.6 9.3 0.6H3.4C1.8536 0.6 0.6 1.8536 0.6 3.4L0.6 9.8C0.6 11.3464 1.8536 12.6 3.4 12.6H5.8";
	var n = e.i(366361);
	let o = [{
			items: [{
				title: "Home",
				url: "/",
				icon: n._
			}, {
				title: "Preset Studio",
				url: "/studio",
				icon: n.e,
				collapsedLabel: "Presets"
			}]
		}, {
			label: "Models",
			items: [{
				title: "Lucy",
				url: "/models/lucy",
				icon: e => {
					let n, o, c, d, m = (0, r.c)(6),
						{
							className: u
						} = e;
					return m[0] !== u ? (n = (0, a.c)(i, u), m[0] = u, m[1] = n) : n = m[1], m[2] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)(s, {
						frame: l
					}), c = (0, t.jsx)("path", {
						d: "M16.0495 13.166V11.6029L14.993 11.5341C14.9351 11.3351 14.8555 11.1433 14.7578 10.966L15.4561 10.17L14.3525 9.06645L13.5565 9.76477C13.3756 9.66708 13.1874 9.58748 12.9848 9.52959L12.9161 8.47305H11.3566L11.2878 9.52959C11.0888 9.58748 10.8971 9.66708 10.7161 9.76477L9.92012 9.06645L8.81654 10.17L9.51487 10.966C9.41717 11.147 9.33757 11.3351 9.27968 11.5341L8.22315 11.6029V13.1623L9.27968 13.2311C9.33757 13.4301 9.41717 13.6219 9.51487 13.7992L8.81654 14.5952L9.92012 15.6988L10.7161 15.0004C10.8971 15.0981 11.0852 15.1777 11.2842 15.2356L11.353 16.2922H12.9124L12.9812 15.2356C13.1802 15.1777 13.372 15.0981 13.5529 15.0004L14.3489 15.6988L15.4525 14.5952L14.7541 13.7992C14.8518 13.6182 14.9314 13.4301 14.9893 13.2311L16.0459 13.1623L16.0495 13.166ZM12.1345 13.3867C11.5809 13.3867 11.1322 12.938 11.1322 12.3844C11.1322 11.8308 11.5809 11.3821 12.1345 11.3821C12.6881 11.3821 13.1368 11.8308 13.1368 12.3844C13.1368 12.938 12.6881 13.3867 12.1345 13.3867Z",
						fill: "currentColor"
					}), m[2] = o, m[3] = c) : (o = m[2], c = m[3]), m[4] !== n ? (d = (0, t.jsxs)("svg", {
						className: n,
						viewBox: "0 0 16.3 16.3",
						fill: "none",
						"aria-hidden": "true",
						children: [o, c]
					}), m[4] = n, m[5] = d) : d = m[5], d
				}
			}, {
				title: "Virtual Try-On",
				url: "/models/lucy-vton",
				icon: e => {
					let n, o, c, d, m = (0, r.c)(6),
						{
							className: u
						} = e;
					return m[0] !== u ? (n = (0, a.c)(i, u), m[0] = u, m[1] = n) : n = m[1], m[2] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)(s, {
						frame: l
					}), c = (0, t.jsx)("path", {
						d: "M10.3979 8.56387C10.5985 8.56387 10.763 8.72754 10.7631 8.92813C10.7631 9.26892 11.0415 9.54801 11.3822 9.54824C11.7232 9.54824 12.0023 9.26907 12.0023 8.92813C12.0025 8.72754 12.167 8.56387 12.3676 8.56387H12.6957V8.56484C12.7187 8.56435 12.7416 8.56549 12.7641 8.56973L12.8314 8.58926L12.8354 8.59121L14.4721 9.52383L14.5209 9.54824C14.5678 9.57563 14.6083 9.61325 14.6391 9.65859C14.68 9.71904 14.7016 9.79068 14.7016 9.86367V11.5541C14.7016 11.7547 14.5379 11.9192 14.3373 11.9193H13.7172V14.8373C13.717 15.0379 13.5525 15.2016 13.352 15.2016H9.41348C9.21289 15.2016 9.0484 15.0379 9.04824 14.8373V11.9193H8.42813C8.22751 11.9192 8.06387 11.7547 8.06387 11.5541V9.86367C8.0638 9.79065 8.08543 9.71906 8.12637 9.65859C8.16734 9.59812 8.22549 9.55086 8.29336 9.52383L9.93008 8.59121L9.93398 8.58926L10.0014 8.56973C10.0238 8.56563 10.0465 8.56387 10.0697 8.56387H10.3979Z",
						fill: "currentColor",
						stroke: "currentColor",
						strokeWidth: "0.0729475"
					}), m[2] = o, m[3] = c) : (o = m[2], c = m[3]), m[4] !== n ? (d = (0, t.jsxs)("svg", {
						className: n,
						viewBox: "0 0 16.3 16.3",
						fill: "none",
						"aria-hidden": "true",
						children: [o, c]
					}), m[4] = n, m[5] = d) : d = m[5], d
				},
				collapsedLabel: "VTON"
			}, {
				title: "Restyle",
				url: "/models/lucy-restyle",
				icon: e => {
					let l, n, o, c, d = (0, r.c)(6),
						{
							className: m
						} = e;
					return d[0] !== m ? (l = (0, a.c)(i, m), d[0] = m, d[1] = l) : l = d[1], d[2] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)(s, {
						frame: "M12.1 5.1V3.4C12.1 1.8536 10.8464 0.6 9.3 0.6H3.4C1.8536 0.6 0.6 1.8536 0.6 3.4L0.6 9.8C0.6 11.3464 1.8536 12.6 3.4 12.6H4.6"
					}), o = (0, t.jsx)("path", {
						d: "M8.25044 11.4807C8.58705 11.2564 9.03219 11.2058 9.38423 11.3528C9.87166 11.5578 10.1815 11.9374 10.228 12.3938C10.2783 12.8581 10.0452 13.3302 9.62349 13.6243C9.24425 13.8873 8.49392 13.9573 7.92134 13.9573C7.65052 13.9573 7.42203 13.9415 7.29048 13.9221V13.9261C7.20553 13.9182 7.13593 13.8568 7.10884 13.7757C7.08565 13.6906 7.10858 13.6013 7.17036 13.5432C7.30579 13.4117 7.68111 13.0554 7.68111 12.6917C7.67734 12.1579 7.87908 11.7283 8.25044 11.4807ZM13.435 6.84988C13.7716 6.51713 14.3171 6.51714 14.6499 6.84988C14.8124 7.01239 14.9018 7.22902 14.9018 7.4573C14.9017 7.68935 14.8123 7.90228 14.6499 8.06473L11.0629 11.6516C11.0204 11.694 10.9626 11.7171 10.9047 11.7171C10.8469 11.7171 10.7891 11.694 10.7465 11.6516L9.8481 10.7532C9.75962 10.6643 9.7596 10.5257 9.8481 10.4368L13.435 6.84988Z",
						fill: "currentColor"
					}), d[2] = n, d[3] = o) : (n = d[2], o = d[3]), d[4] !== l ? (c = (0, t.jsxs)("svg", {
						className: l,
						viewBox: "0 0 16.3 16.3",
						fill: "none",
						"aria-hidden": "true",
						children: [n, o]
					}), d[4] = l, d[5] = c) : c = d[5], c
				},
				collapsedLabel: "Restyle"
			}]
		}],
		c = o.flatMap(e => e.items),
		d = [{
			title: "API Keys",
			url: "/api-keys",
			icon: n.W,
			collapsedLabel: "Keys"
		}, {
			title: "Usage",
			url: "/usage",
			icon: n.$
		}, {
			title: "Billing",
			url: "/billing",
			icon: n.O
		}, {
			title: "Organization",
			url: "/organization",
			icon: n.X
		}],
		m = [{
			title: "Documentation",
			url: "#",
			icon: n.N,
			collapsedLabel: "Docs"
		}];
	e.s(["P", 0, d, "i", 0, m, "y", 0, c, "X", 0, o], 669982)
}, 627007, 181384, e => {
	"use strict";
	var t = e.i(55e3);
	let r = {
		name: "layout-dashboard",
		size: 24,
		node: [
			["rect", {
				width: "7",
				height: "9",
				x: "3",
				y: "3",
				rx: "1",
				key: "10lvy0"
			}],
			["rect", {
				width: "7",
				height: "5",
				x: "14",
				y: "3",
				rx: "1",
				key: "16une8"
			}],
			["rect", {
				width: "7",
				height: "9",
				x: "14",
				y: "12",
				rx: "1",
				key: "1hutg5"
			}],
			["rect", {
				width: "7",
				height: "5",
				x: "3",
				y: "16",
				rx: "1",
				key: "ldoo1y"
			}]
		]
	};
	r.node;
	let a = (0, t.f)(r);
	e.s(["f", 0, a], 627007);
	var i = e.i(234984),
		s = e.i(582018);
	e.s(["Q", 0, e => {
		let t, r, a, l, n, o, c = (0, s.c)(7),
			{
				className: d
			} = e;
		return c[0] === Symbol.for("react.memo_cache_sentinel") ? (t = (0, i.jsx)("title", {
			children: "Toggle sidebar"
		}), r = (0, i.jsx)("path", {
			d: "M2.85 3.6H3.6",
			stroke: "currentColor",
			strokeWidth: "1.125",
			strokeLinecap: "round"
		}), a = (0, i.jsx)("path", {
			d: "M2.85 5.85H3.6",
			stroke: "currentColor",
			strokeWidth: "1.125",
			strokeLinecap: "round"
		}), l = (0, i.jsx)("path", {
			d: "M5.85 0.6V11.1",
			stroke: "currentColor",
			strokeWidth: "1.125"
		}), n = (0, i.jsx)("rect", {
			x: "0.6",
			y: "0.6",
			width: "12",
			height: "10.5",
			rx: "3",
			stroke: "currentColor",
			strokeWidth: "1.2"
		}), c[0] = t, c[1] = r, c[2] = a, c[3] = l, c[4] = n) : (t = c[0], r = c[1], a = c[2], l = c[3], n = c[4]), c[5] !== d ? (o = (0, i.jsxs)("svg", {
			className: d,
			xmlns: "http://www.w3.org/2000/svg",
			width: "14",
			height: "12",
			viewBox: "0 0 13.2 11.7",
			fill: "none",
			children: [t, r, a, l, n]
		}), c[5] = d, c[6] = o) : o = c[6], o
	}, "v", 0, e => {
		let t, r, a, l = (0, s.c)(4),
			{
				className: n
			} = e;
		return l[0] === Symbol.for("react.memo_cache_sentinel") ? (t = (0, i.jsx)("title", {
			children: "Sign in"
		}), r = (0, i.jsx)("path", {
			transform: "rotate(-90 8 8) translate(2 1.3333)",
			d: "M3.52667 7.52667C3.46418 7.58864 3.41459 7.66238 3.38074 7.74362C3.34689 7.82485 3.32947 7.91199 3.32947 8C3.32947 8.08801 3.34689 8.17514 3.38074 8.25638C3.41459 8.33762 3.46418 8.41136 3.52667 8.47333L5.52667 10.4733C5.58864 10.5358 5.66238 10.5854 5.74362 10.6193C5.82486 10.6531 5.91199 10.6705 6 10.6705C6.08801 10.6705 6.17515 10.6531 6.25638 10.6193C6.33762 10.5854 6.41136 10.5358 6.47333 10.4733L8.47333 8.47333C8.59887 8.3478 8.66939 8.17753 8.66939 8C8.66939 7.82247 8.59887 7.6522 8.47333 7.52667C8.3478 7.40113 8.17753 7.33061 8 7.33061C7.82247 7.33061 7.6522 7.40113 7.52667 7.52667L6.66667 8.39333V0.666667C6.66667 0.489856 6.59643 0.320286 6.4714 0.195262C6.34638 0.0702379 6.17681 0 6 0C5.82319 0 5.65362 0.0702379 5.5286 0.195262C5.40357 0.320286 5.33333 0.489856 5.33333 0.666667V8.39333L4.47333 7.52667C4.41136 7.46418 4.33762 7.41458 4.25638 7.38074C4.17515 7.34689 4.08801 7.32947 4 7.32947C3.91199 7.32947 3.82486 7.34689 3.74362 7.38074C3.66238 7.41458 3.58864 7.46418 3.52667 7.52667ZM10 4.66667H8.66667C8.48986 4.66667 8.32029 4.7369 8.19526 4.86193C8.07024 4.98695 8 5.15652 8 5.33333C8 5.51014 8.07024 5.67971 8.19526 5.80474C8.32029 5.92976 8.48986 6 8.66667 6H10C10.1768 6 10.3464 6.07024 10.4714 6.19526C10.5964 6.32029 10.6667 6.48986 10.6667 6.66667V11.3333C10.6667 11.5101 10.5964 11.6797 10.4714 11.8047C10.3464 11.9298 10.1768 12 10 12H2C1.82319 12 1.65362 11.9298 1.5286 11.8047C1.40357 11.6797 1.33333 11.5101 1.33333 11.3333V6.66667C1.33333 6.48986 1.40357 6.32029 1.5286 6.19526C1.65362 6.07024 1.82319 6 2 6H3.33333C3.51014 6 3.67971 5.92976 3.80474 5.80474C3.92976 5.67971 4 5.51014 4 5.33333C4 5.15652 3.92976 4.98695 3.80474 4.86193C3.67971 4.7369 3.51014 4.66667 3.33333 4.66667H2C1.46957 4.66667 0.960859 4.87738 0.585787 5.25245C0.210714 5.62753 0 6.13623 0 6.66667V11.3333C0 11.8638 0.210714 12.3725 0.585787 12.7475C0.960859 13.1226 1.46957 13.3333 2 13.3333H10C10.5304 13.3333 11.0391 13.1226 11.4142 12.7475C11.7893 12.3725 12 11.8638 12 11.3333V6.66667C12 6.13623 11.7893 5.62753 11.4142 5.25245C11.0391 4.87738 10.5304 4.66667 10 4.66667Z",
			fill: "currentColor"
		}), l[0] = t, l[1] = r) : (t = l[0], r = l[1]), l[2] !== n ? (a = (0, i.jsxs)("svg", {
			className: n,
			xmlns: "http://www.w3.org/2000/svg",
			width: "16",
			height: "16",
			viewBox: "0 0 16 16",
			fill: "none",
			children: [t, r]
		}), l[2] = n, l[3] = a) : a = l[3], a
	}], 181384)
}]);