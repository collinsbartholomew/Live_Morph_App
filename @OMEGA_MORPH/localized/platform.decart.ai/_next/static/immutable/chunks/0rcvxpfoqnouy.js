(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 120384, t => {
	"use strict";
	var e = t.i(234984),
		n = t.i(582018),
		r = t.i(818036);
	t.s(["N", 0, function(t) {
		let u, i, a, s, o = (0, n.c)(8);
		return o[0] !== t ? ({
			className: u,
			...i
		} = t, o[0] = t, o[1] = u, o[2] = i) : (u = o[1], i = o[2]), o[3] !== u ? (a = (0, r.c)("bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm", u), o[3] = u, o[4] = a) : a = o[4], o[5] !== i || o[6] !== a ? (s = (0, e.jsx)("div", {
			"data-slot": "card",
			className: a,
			...i
		}), o[5] = i, o[6] = a, o[7] = s) : s = o[7], s
	}, "O", 0, function(t) {
		let u, i, a, s, o = (0, n.c)(8);
		return o[0] !== t ? ({
			className: u,
			...i
		} = t, o[0] = t, o[1] = u, o[2] = i) : (u = o[1], i = o[2]), o[3] !== u ? (a = (0, r.c)("px-6", u), o[3] = u, o[4] = a) : a = o[4], o[5] !== i || o[6] !== a ? (s = (0, e.jsx)("div", {
			"data-slot": "card-content",
			className: a,
			...i
		}), o[5] = i, o[6] = a, o[7] = s) : s = o[7], s
	}])
}, 629841, t => {
	"use strict";
	var e = t.i(582018),
		n = t.i(584381),
		r = t.i(663303),
		u = t.i(205647);
	async function i() {
		let t = await fetch("/api/user/api-keys/list");
		return await (0, u.W)(t, "Failed to fetch API keys"), await t.json()
	}
	t.s(["f", 0, function() {
		let t, u, a = (0, e.c)(6),
			{
				data: s
			} = r.i.useSession(),
			o = s?.session?.activeOrganizationId ?? "personal";
		a[0] !== o ? (t = {
			queryKey: ["apiKeys", o],
			queryFn: i
		}, a[0] = o, a[1] = t) : t = a[1];
		let {
			data: c,
			isLoading: l,
			error: f
		} = (0, n.f)(t);
		return a[2] !== c || a[3] !== f || a[4] !== l ? (u = {
			data: c,
			isLoading: l,
			error: f
		}, a[2] = c, a[3] = f, a[4] = l, a[5] = u) : u = a[5], u
	}])
}, 642977, (t, e, n) => {
	"use strict";
	var r = t.r(170380),
		u = "function" == typeof Object.is ? Object.is : function(t, e) {
			return t === e && (0 !== t || 1 / t == 1 / e) || t != t && e != e
		},
		i = r.useState,
		a = r.useEffect,
		s = r.useLayoutEffect,
		o = r.useDebugValue;

	function c(t) {
		var e = t.getSnapshot;
		t = t.value;
		try {
			var n = e();
			return !u(t, n)
		} catch (t) {
			return !0
		}
	}
	var l = "u" < typeof window || void 0 === window.document || void 0 === window.document.createElement ? function(t, e) {
		return e()
	} : function(t, e) {
		var n = e(),
			r = i({
				inst: {
					value: n,
					getSnapshot: e
				}
			}),
			u = r[0].inst,
			l = r[1];
		return s(function() {
			u.value = n, u.getSnapshot = e, c(u) && l({
				inst: u
			})
		}, [t, n, e]), a(function() {
			return c(u) && l({
				inst: u
			}), t(function() {
				c(u) && l({
					inst: u
				})
			})
		}, [t]), o(n), n
	};
	n.useSyncExternalStore = void 0 !== r.useSyncExternalStore ? r.useSyncExternalStore : l
}, 991812, (t, e, n) => {
	"use strict";
	var r = t.r(170380),
		u = t.r(171948),
		i = "function" == typeof Object.is ? Object.is : function(t, e) {
			return t === e && (0 !== t || 1 / t == 1 / e) || t != t && e != e
		},
		a = u.useSyncExternalStore,
		s = r.useRef,
		o = r.useEffect,
		c = r.useMemo,
		l = r.useDebugValue;
	n.useSyncExternalStoreWithSelector = function(t, e, n, r, u) {
		var f = s(null);
		if (null === f.current) {
			var d = {
				hasValue: !1,
				value: null
			};
			f.current = d
		} else d = f.current;
		var v = a(t, (f = c(function() {
			function t(t) {
				if (!o) {
					if (o = !0, a = t, t = r(t), void 0 !== u && d.hasValue) {
						var e = d.value;
						if (u(e, t)) return s = e
					}
					return s = t
				}
				if (e = s, i(a, t)) return e;
				var n = r(t);
				return void 0 !== u && u(e, n) ? (a = t, e) : (a = t, s = n)
			}
			var a, s, o = !1,
				c = void 0 === n ? null : n;
			return [function() {
				return t(e())
			}, null === c ? void 0 : function() {
				return t(c())
			}]
		}, [e, n, r, u]))[0], f[1]);
		return o(function() {
			d.hasValue = !0, d.value = v
		}, [v]), l(v), v
	}
}, 171948, (t, e, n) => {
	"use strict";
	t.i(914374), e.exports = t.r(642977)
}, 356076, (t, e, n) => {
	"use strict";
	t.i(914374), e.exports = t.r(991812)
}, 426682, t => {
	"use strict";
	var e = t.i(377698);
	t.s(["z", 0, e])
}]);