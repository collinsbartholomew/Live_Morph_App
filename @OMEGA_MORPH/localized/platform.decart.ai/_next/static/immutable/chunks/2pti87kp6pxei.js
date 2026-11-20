(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 691087, t => {
	"use strict";
	var e = t.i(234984),
		i = t.i(582018),
		n = t.i(927531),
		r = t.i(170380);
	t.s(["AuthRedirectWrapper", 0, function(t) {
		let o, u, s, c = (0, i.c)(8),
			{
				isAuthenticated: a,
				children: g
			} = t,
			l = (0, n.useRouter)(),
			h = (0, n.usePathname)(),
			d = (0, n.useSearchParams)();
		return (c[0] !== a || c[1] !== h || c[2] !== l || c[3] !== d ? (o = () => {
			if (!a) {
				let t = "/" !== h ? h : void 0,
					e = t ? `/sign-in?returnTo=${encodeURIComponent(t)}${d.toString()?`&${d.toString()}`:""}` : `/sign-in${d.toString()?`?${d.toString()}`:""}`;
				l.push(e)
			}
		}, u = [a, l, h, d], c[0] = a, c[1] = h, c[2] = l, c[3] = d, c[4] = o, c[5] = u) : (o = c[4], u = c[5]), (0, r.useEffect)(o, u), a) ? (c[6] !== g ? (s = (0, e.jsx)(e.Fragment, {
			children: g
		}), c[6] = g, c[7] = s) : s = c[7], s) : null
	}])
}]);