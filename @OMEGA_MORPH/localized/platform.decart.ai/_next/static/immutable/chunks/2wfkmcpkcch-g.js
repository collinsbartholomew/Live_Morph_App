(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 281731, e => {
	"use strict";
	var l = e.i(234984),
		t = e.i(582018),
		n = e.i(3440),
		i = e.i(299033);

	function d(e) {
		return e.items.length > 0
	}

	function r(e) {
		let n, i = (0, t.c)(2),
			{
				children: d
			} = e;
		return i[0] !== d ? (n = (0, l.jsx)("div", {
			className: "@container",
			children: (0, l.jsx)("div", {
				className: "grid grid-cols-1 gap-5 @xl:grid-cols-2 @4xl:grid-cols-3",
				children: d
			})
		}), i[0] = d, i[1] = n) : n = i[1], n
	}

	function s(e) {
		let n, i, d, r, s = (0, t.c)(10),
			{
				label: o,
				count: a,
				children: c
			} = e;
		return s[0] !== o ? (n = (0, l.jsx)("h2", {
			className: "text-sm font-medium text-foreground",
			children: o
		}), s[0] = o, s[1] = n) : n = s[1], s[2] !== a ? (i = (0, l.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: a
		}), s[2] = a, s[3] = i) : i = s[3], s[4] !== n || s[5] !== i ? (d = (0, l.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [n, i]
		}), s[4] = n, s[5] = i, s[6] = d) : d = s[6], s[7] !== c || s[8] !== d ? (r = (0, l.jsxs)("section", {
			className: "space-y-3",
			children: [d, c]
		}), s[7] = c, s[8] = d, s[9] = r) : r = s[9], r
	}
	e.s(["PresetFolderSections", 0, function(e) {
		let o, a, c, m, f = (0, t.c)(17),
			{
				items: u,
				folders: h,
				family: x,
				renderItem: g,
				readOnly: p
			} = e,
			y = void 0 !== p && p;
		if (f[0] !== x || f[1] !== h || f[2] !== u || f[3] !== y || f[4] !== g) {
			let e, t, {
					sections: m,
					unfiled: p
				} = (0, n.h)(u, h, x),
				j = y ? m.filter(d) : m;
			f[8] !== x ? (e = e => "all" === x ? `${i.C[e.modelFamily]} \xb7 ${e.name}` : e.name, f[8] = x, f[9] = e) : e = f[9];
			let k = e;
			o = "space-y-8", a = p.length > 0 && (0, l.jsx)(s, {
				label: n.p,
				count: p.length,
				children: (0, l.jsx)(r, {
					children: p.map(g)
				})
			}), f[10] !== k || f[11] !== g ? (t = e => (0, l.jsx)(s, {
				label: k(e.folder),
				count: e.items.length,
				children: 0 === e.items.length ? (0, l.jsx)("p", {
					className: "rounded-lg border border-dashed px-4 py-6 text-center text-sm text-muted-foreground",
					children: "Nothing filed here yet — set a preset's folder from its panel."
				}) : (0, l.jsx)(r, {
					children: e.items.map(g)
				})
			}, e.folder.id), f[10] = k, f[11] = g, f[12] = t) : t = f[12], c = j.map(t), f[0] = x, f[1] = h, f[2] = u, f[3] = y, f[4] = g, f[5] = o, f[6] = a, f[7] = c
		} else o = f[5], a = f[6], c = f[7];
		return f[13] !== o || f[14] !== a || f[15] !== c ? (m = (0, l.jsxs)("div", {
			className: o,
			children: [a, c]
		}), f[13] = o, f[14] = a, f[15] = c, f[16] = m) : m = f[16], m
	}, "PresetGrid", 0, r, "SelectionHeading", 0, function(e) {
		let i, d, r, s, o = (0, t.c)(11),
			{
				selection: a,
				folders: c,
				count: m
			} = e;
		o[0] !== c || o[1] !== a.folderId || o[2] !== a.kind ? (i = "folder" === a.kind ? c.find(e => e.id === a.folderId)?.name ?? n.p : "default" === a.kind ? n.p : "Any model", o[0] = c, o[1] = a.folderId, o[2] = a.kind, o[3] = i) : i = o[3];
		let f = i;
		return o[4] !== f ? (d = (0, l.jsx)("h2", {
			className: "text-sm font-medium text-foreground",
			children: f
		}), o[4] = f, o[5] = d) : d = o[5], o[6] !== m ? (r = (0, l.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: m
		}), o[6] = m, o[7] = r) : r = o[7], o[8] !== d || o[9] !== r ? (s = (0, l.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [d, r]
		}), o[8] = d, o[9] = r, o[10] = s) : s = o[10], s
	}])
}, 3440, 299033, e => {
	"use strict";
	let l = ["lucy", "lucy-vton", "lucy-restyle"];

	function t(e, t, n) {
		let i = t.filter(e => "all" === n || e.modelFamily === n).sort((e, t) => l.indexOf(e.modelFamily) - l.indexOf(t.modelFamily) || e.name.localeCompare(t.name)).map(e => ({
				folder: e,
				items: []
			})),
			d = new Map(i.map(e => [e.folder.id, e])),
			r = [];
		for (let l of e) {
			let e = l.folderId ? d.get(l.folderId) : void 0;
			e ? e.items.push(l) : ("all" === n || l.modelFamily === n) && r.push(l)
		}
		return {
			sections: i,
			unfiled: r
		}
	}
	e.s(["p", 0, "General", "g", 0, function(e, n, {
		hideEmptyFolders: i = !1
	} = {}) {
		let d = l.map(l => {
				let {
					sections: d,
					unfiled: r
				} = t(e, n, l), s = d.filter(e => !i || e.items.length > 0).map(e => ({
					id: e.folder.id,
					name: e.folder.name,
					count: e.items.length
				}));
				return {
					family: l,
					defaultCount: r.length,
					showDefault: r.length > 0 || !i,
					folders: s,
					total: r.length + s.reduce((e, l) => e + l.count, 0)
				}
			}).filter(e => e.total > 0 || e.folders.length > 0),
			r = t(e, n, "all").unfiled.filter(e => null === e.modelFamily).length;
		return {
			total: e.length,
			families: d,
			anyModelCount: r
		}
	}, "h", 0, t, "r", 0, function(e, l, n) {
		if ("all" === n.kind) return e;
		if ("any-model" === n.kind) return t(e, l, "all").unfiled.filter(e => null === e.modelFamily);
		let {
			sections: i,
			unfiled: d
		} = t(e, l, n.family);
		return "default" === n.kind ? d : "folder" === n.kind ? i.find(e => e.folder.id === n.folderId)?.items ?? [] : [...i.flatMap(e => e.items), ...d]
	}, "l", 0, e => "folder" === e.kind ? `folder:${e.folderId}` : "family" === e.kind || "default" === e.kind ? `${e.kind}:${e.family}` : e.kind], 3440);
	var n = e.i(234984),
		i = e.i(582018),
		d = e.i(727677);
	let r = {
		lucy: "Lucy",
		"lucy-vton": "Lucy VTON",
		"lucy-restyle": "Lucy Restyle"
	};
	e.s(["C", 0, r, "q", 0, function(e) {
		let l, t = (0, i.c)(2),
			{
				family: s
			} = e;
		if (!s) return null;
		let o = r[s];
		return t[0] !== o ? (l = (0, n.jsx)(d.f, {
			variant: "outline",
			children: o
		}), t[0] = o, t[1] = l) : l = t[1], l
	}], 299033)
}]);