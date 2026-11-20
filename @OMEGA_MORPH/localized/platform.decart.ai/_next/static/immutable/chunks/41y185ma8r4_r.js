(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 924675, e => {
	"use strict";
	var t = e.i(234984),
		n = e.i(250576),
		r = e.i(745502),
		a = e.i(677417),
		i = e.i(595053);

	function s(e, t) {
		let n = (0, i.f)(e, t?.in);
		return n.setHours(0, 0, 0, 0), n
	}

	function o(e, t, i) {
		let [o, l] = (0, n.f)(i?.in, e, t), c = s(o), d = s(l);
		return Math.round((c - (0, r.f)(c) - (d - (0, r.f)(d))) / a._)
	}

	function l(e, t) {
		let n = e.getFullYear() - t.getFullYear() || e.getMonth() - t.getMonth() || e.getDate() - t.getDate() || e.getHours() - t.getHours() || e.getMinutes() - t.getMinutes() || e.getSeconds() - t.getSeconds() || e.getMilliseconds() - t.getMilliseconds();
		return n < 0 ? -1 : n > 0 ? 1 : n
	}
	var c = e.i(618508),
		d = e.i(893890);

	function u(e, t) {
		let n = (0, d.f)(),
			r = t?.weekStartsOn ?? t?.locale?.options?.weekStartsOn ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0,
			a = (0, i.f)(e, t?.in),
			s = a.getDay();
		return a.setDate(a.getDate() - (7 * (s < r) + s - r)), a.setHours(0, 0, 0, 0), a
	}

	function m(e, t) {
		return u(e, {
			...t,
			weekStartsOn: 1
		})
	}
	var h = e.i(255665);

	function f(e, t) {
		let n = (0, i.f)(e, t?.in),
			r = n.getFullYear(),
			a = (0, h.f)(n, 0);
		a.setFullYear(r + 1, 0, 4), a.setHours(0, 0, 0, 0);
		let s = m(a),
			o = (0, h.f)(n, 0);
		o.setFullYear(r, 0, 4), o.setHours(0, 0, 0, 0);
		let l = m(o);
		return n.getTime() >= s.getTime() ? r + 1 : n.getTime() >= l.getTime() ? r : r - 1
	}

	function x(e, t) {
		let n = (0, i.f)(e, t?.in),
			r = n.getFullYear(),
			a = (0, d.f)(),
			s = t?.firstWeekContainsDate ?? t?.locale?.options?.firstWeekContainsDate ?? a.firstWeekContainsDate ?? a.locale?.options?.firstWeekContainsDate ?? 1,
			o = (0, h.f)(t?.in || e, 0);
		o.setFullYear(r + 1, 0, s), o.setHours(0, 0, 0, 0);
		let l = u(o, t),
			c = (0, h.f)(t?.in || e, 0);
		c.setFullYear(r, 0, s), c.setHours(0, 0, 0, 0);
		let m = u(c, t);
		return +n >= +l ? r + 1 : +n >= +m ? r : r - 1
	}

	function g(e, t) {
		let n = Math.abs(e).toString().padStart(t, "0");
		return (e < 0 ? "-" : "") + n
	}
	let y = {
			y(e, t) {
				let n = e.getFullYear(),
					r = n > 0 ? n : 1 - n;
				return g("yy" === t ? r % 100 : r, t.length)
			},
			M(e, t) {
				let n = e.getMonth();
				return "M" === t ? String(n + 1) : g(n + 1, 2)
			},
			d: (e, t) => g(e.getDate(), t.length),
			a(e, t) {
				let n = e.getHours() / 12 >= 1 ? "pm" : "am";
				switch (t) {
					case "a":
					case "aa":
						return n.toUpperCase();
					case "aaa":
						return n;
					case "aaaaa":
						return n[0];
					default:
						return "am" === n ? "a.m." : "p.m."
				}
			},
			h: (e, t) => g(e.getHours() % 12 || 12, t.length),
			H: (e, t) => g(e.getHours(), t.length),
			m: (e, t) => g(e.getMinutes(), t.length),
			s: (e, t) => g(e.getSeconds(), t.length),
			S(e, t) {
				let n = t.length;
				return g(Math.trunc(e.getMilliseconds() * Math.pow(10, n - 3)), t.length)
			}
		},
		j = {
			G: function(e, t, n) {
				let r = +(e.getFullYear() > 0);
				switch (t) {
					case "G":
					case "GG":
					case "GGG":
						return n.era(r, {
							width: "abbreviated"
						});
					case "GGGGG":
						return n.era(r, {
							width: "narrow"
						});
					default:
						return n.era(r, {
							width: "wide"
						})
				}
			},
			y: function(e, t, n) {
				if ("yo" === t) {
					let t = e.getFullYear();
					return n.ordinalNumber(t > 0 ? t : 1 - t, {
						unit: "year"
					})
				}
				return y.y(e, t)
			},
			Y: function(e, t, n, r) {
				let a = x(e, r),
					i = a > 0 ? a : 1 - a;
				return "YY" === t ? g(i % 100, 2) : "Yo" === t ? n.ordinalNumber(i, {
					unit: "year"
				}) : g(i, t.length)
			},
			R: function(e, t) {
				return g(f(e), t.length)
			},
			u: function(e, t) {
				return g(e.getFullYear(), t.length)
			},
			Q: function(e, t, n) {
				let r = Math.ceil((e.getMonth() + 1) / 3);
				switch (t) {
					case "Q":
						return String(r);
					case "QQ":
						return g(r, 2);
					case "Qo":
						return n.ordinalNumber(r, {
							unit: "quarter"
						});
					case "QQQ":
						return n.quarter(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "QQQQQ":
						return n.quarter(r, {
							width: "narrow",
							context: "formatting"
						});
					default:
						return n.quarter(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			q: function(e, t, n) {
				let r = Math.ceil((e.getMonth() + 1) / 3);
				switch (t) {
					case "q":
						return String(r);
					case "qq":
						return g(r, 2);
					case "qo":
						return n.ordinalNumber(r, {
							unit: "quarter"
						});
					case "qqq":
						return n.quarter(r, {
							width: "abbreviated",
							context: "standalone"
						});
					case "qqqqq":
						return n.quarter(r, {
							width: "narrow",
							context: "standalone"
						});
					default:
						return n.quarter(r, {
							width: "wide",
							context: "standalone"
						})
				}
			},
			M: function(e, t, n) {
				let r = e.getMonth();
				switch (t) {
					case "M":
					case "MM":
						return y.M(e, t);
					case "Mo":
						return n.ordinalNumber(r + 1, {
							unit: "month"
						});
					case "MMM":
						return n.month(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "MMMMM":
						return n.month(r, {
							width: "narrow",
							context: "formatting"
						});
					default:
						return n.month(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			L: function(e, t, n) {
				let r = e.getMonth();
				switch (t) {
					case "L":
						return String(r + 1);
					case "LL":
						return g(r + 1, 2);
					case "Lo":
						return n.ordinalNumber(r + 1, {
							unit: "month"
						});
					case "LLL":
						return n.month(r, {
							width: "abbreviated",
							context: "standalone"
						});
					case "LLLLL":
						return n.month(r, {
							width: "narrow",
							context: "standalone"
						});
					default:
						return n.month(r, {
							width: "wide",
							context: "standalone"
						})
				}
			},
			w: function(e, t, n, r) {
				let s, o, l, c, m, f = Math.round((u(s = (0, i.f)(e, r?.in), r) - (o = (0, d.f)(), l = r?.firstWeekContainsDate ?? r?.locale?.options?.firstWeekContainsDate ?? o.firstWeekContainsDate ?? o.locale?.options?.firstWeekContainsDate ?? 1, c = x(s, r), (m = (0, h.f)(r?.in || s, 0)).setFullYear(c, 0, l), m.setHours(0, 0, 0, 0), u(m, r))) / a.A) + 1;
				return "wo" === t ? n.ordinalNumber(f, {
					unit: "week"
				}) : g(f, t.length)
			},
			I: function(e, t, n) {
				let r, s, o, l = Math.round((m(r = (0, i.f)(e, void 0)) - (s = f(r, void 0), (o = (0, h.f)(r, 0)).setFullYear(s, 0, 4), o.setHours(0, 0, 0, 0), m(o))) / a.A) + 1;
				return "Io" === t ? n.ordinalNumber(l, {
					unit: "week"
				}) : g(l, t.length)
			},
			d: function(e, t, n) {
				return "do" === t ? n.ordinalNumber(e.getDate(), {
					unit: "date"
				}) : y.d(e, t)
			},
			D: function(e, t, n) {
				let r, a, s = o(r = (0, i.f)(e, void 0), ((a = (0, i.f)(r, void 0)).setFullYear(a.getFullYear(), 0, 1), a.setHours(0, 0, 0, 0), a)) + 1;
				return "Do" === t ? n.ordinalNumber(s, {
					unit: "dayOfYear"
				}) : g(s, t.length)
			},
			E: function(e, t, n) {
				let r = e.getDay();
				switch (t) {
					case "E":
					case "EE":
					case "EEE":
						return n.day(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "EEEEE":
						return n.day(r, {
							width: "narrow",
							context: "formatting"
						});
					case "EEEEEE":
						return n.day(r, {
							width: "short",
							context: "formatting"
						});
					default:
						return n.day(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			e: function(e, t, n, r) {
				let a = e.getDay(),
					i = (a - r.weekStartsOn + 8) % 7 || 7;
				switch (t) {
					case "e":
						return String(i);
					case "ee":
						return g(i, 2);
					case "eo":
						return n.ordinalNumber(i, {
							unit: "day"
						});
					case "eee":
						return n.day(a, {
							width: "abbreviated",
							context: "formatting"
						});
					case "eeeee":
						return n.day(a, {
							width: "narrow",
							context: "formatting"
						});
					case "eeeeee":
						return n.day(a, {
							width: "short",
							context: "formatting"
						});
					default:
						return n.day(a, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			c: function(e, t, n, r) {
				let a = e.getDay(),
					i = (a - r.weekStartsOn + 8) % 7 || 7;
				switch (t) {
					case "c":
						return String(i);
					case "cc":
						return g(i, t.length);
					case "co":
						return n.ordinalNumber(i, {
							unit: "day"
						});
					case "ccc":
						return n.day(a, {
							width: "abbreviated",
							context: "standalone"
						});
					case "ccccc":
						return n.day(a, {
							width: "narrow",
							context: "standalone"
						});
					case "cccccc":
						return n.day(a, {
							width: "short",
							context: "standalone"
						});
					default:
						return n.day(a, {
							width: "wide",
							context: "standalone"
						})
				}
			},
			i: function(e, t, n) {
				let r = e.getDay(),
					a = 0 === r ? 7 : r;
				switch (t) {
					case "i":
						return String(a);
					case "ii":
						return g(a, t.length);
					case "io":
						return n.ordinalNumber(a, {
							unit: "day"
						});
					case "iii":
						return n.day(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "iiiii":
						return n.day(r, {
							width: "narrow",
							context: "formatting"
						});
					case "iiiiii":
						return n.day(r, {
							width: "short",
							context: "formatting"
						});
					default:
						return n.day(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			a: function(e, t, n) {
				let r = e.getHours() / 12 >= 1 ? "pm" : "am";
				switch (t) {
					case "a":
					case "aa":
						return n.dayPeriod(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "aaa":
						return n.dayPeriod(r, {
							width: "abbreviated",
							context: "formatting"
						}).toLowerCase();
					case "aaaaa":
						return n.dayPeriod(r, {
							width: "narrow",
							context: "formatting"
						});
					default:
						return n.dayPeriod(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			b: function(e, t, n) {
				let r, a = e.getHours();
				switch (r = 12 === a ? "noon" : 0 === a ? "midnight" : a / 12 >= 1 ? "pm" : "am", t) {
					case "b":
					case "bb":
						return n.dayPeriod(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "bbb":
						return n.dayPeriod(r, {
							width: "abbreviated",
							context: "formatting"
						}).toLowerCase();
					case "bbbbb":
						return n.dayPeriod(r, {
							width: "narrow",
							context: "formatting"
						});
					default:
						return n.dayPeriod(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			B: function(e, t, n) {
				let r, a = e.getHours();
				switch (r = a >= 17 ? "evening" : a >= 12 ? "afternoon" : a >= 4 ? "morning" : "night", t) {
					case "B":
					case "BB":
					case "BBB":
						return n.dayPeriod(r, {
							width: "abbreviated",
							context: "formatting"
						});
					case "BBBBB":
						return n.dayPeriod(r, {
							width: "narrow",
							context: "formatting"
						});
					default:
						return n.dayPeriod(r, {
							width: "wide",
							context: "formatting"
						})
				}
			},
			h: function(e, t, n) {
				if ("ho" === t) {
					let t = e.getHours() % 12;
					return 0 === t && (t = 12), n.ordinalNumber(t, {
						unit: "hour"
					})
				}
				return y.h(e, t)
			},
			H: function(e, t, n) {
				return "Ho" === t ? n.ordinalNumber(e.getHours(), {
					unit: "hour"
				}) : y.H(e, t)
			},
			K: function(e, t, n) {
				let r = e.getHours() % 12;
				return "Ko" === t ? n.ordinalNumber(r, {
					unit: "hour"
				}) : g(r, t.length)
			},
			k: function(e, t, n) {
				let r = e.getHours();
				return (0 === r && (r = 24), "ko" === t) ? n.ordinalNumber(r, {
					unit: "hour"
				}) : g(r, t.length)
			},
			m: function(e, t, n) {
				return "mo" === t ? n.ordinalNumber(e.getMinutes(), {
					unit: "minute"
				}) : y.m(e, t)
			},
			s: function(e, t, n) {
				return "so" === t ? n.ordinalNumber(e.getSeconds(), {
					unit: "second"
				}) : y.s(e, t)
			},
			S: function(e, t) {
				return y.S(e, t)
			},
			X: function(e, t, n) {
				let r = e.getTimezoneOffset();
				if (0 === r) return "Z";
				switch (t) {
					case "X":
						return b(r);
					case "XXXX":
					case "XX":
						return w(r);
					default:
						return w(r, ":")
				}
			},
			x: function(e, t, n) {
				let r = e.getTimezoneOffset();
				switch (t) {
					case "x":
						return b(r);
					case "xxxx":
					case "xx":
						return w(r);
					default:
						return w(r, ":")
				}
			},
			O: function(e, t, n) {
				let r = e.getTimezoneOffset();
				switch (t) {
					case "O":
					case "OO":
					case "OOO":
						return "GMT" + p(r, ":");
					default:
						return "GMT" + w(r, ":")
				}
			},
			z: function(e, t, n) {
				let r = e.getTimezoneOffset();
				switch (t) {
					case "z":
					case "zz":
					case "zzz":
						return "GMT" + p(r, ":");
					default:
						return "GMT" + w(r, ":")
				}
			},
			t: function(e, t, n) {
				return g(Math.trunc(e / 1e3), t.length)
			},
			T: function(e, t, n) {
				return g(+e, t.length)
			}
		};

	function p(e, t = "") {
		let n = e > 0 ? "-" : "+",
			r = Math.abs(e),
			a = Math.trunc(r / 60),
			i = r % 60;
		return 0 === i ? n + String(a) : n + String(a) + t + g(i, 2)
	}

	function b(e, t) {
		return e % 60 == 0 ? (e > 0 ? "-" : "+") + g(Math.abs(e) / 60, 2) : w(e, t)
	}

	function w(e, t = "") {
		let n = Math.abs(e);
		return (e > 0 ? "-" : "+") + g(Math.trunc(n / 60), 2) + t + g(n % 60, 2)
	}
	let v = (e, t) => {
			switch (e) {
				case "P":
					return t.date({
						width: "short"
					});
				case "PP":
					return t.date({
						width: "medium"
					});
				case "PPP":
					return t.date({
						width: "long"
					});
				default:
					return t.date({
						width: "full"
					})
			}
		},
		N = (e, t) => {
			switch (e) {
				case "p":
					return t.time({
						width: "short"
					});
				case "pp":
					return t.time({
						width: "medium"
					});
				case "ppp":
					return t.time({
						width: "long"
					});
				default:
					return t.time({
						width: "full"
					})
			}
		},
		k = {
			p: N,
			P: (e, t) => {
				let n, r = e.match(/(P+)(p+)?/) || [],
					a = r[1],
					i = r[2];
				if (!i) return v(e, t);
				switch (a) {
					case "P":
						n = t.dateTime({
							width: "short"
						});
						break;
					case "PP":
						n = t.dateTime({
							width: "medium"
						});
						break;
					case "PPP":
						n = t.dateTime({
							width: "long"
						});
						break;
					default:
						n = t.dateTime({
							width: "full"
						})
				}
				return n.replace("{{date}}", v(a, t)).replace("{{time}}", N(i, t))
			}
		},
		P = /^D+$/,
		C = /^Y+$/,
		S = ["D", "DD", "YY", "YYYY"],
		M = /[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,
		I = /P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,
		D = /^'([^]*?)'?$/,
		A = /''/g,
		z = /[a-zA-Z]/;
	var K = e.i(595884),
		q = e.i(663303),
		F = e.i(629841);
	let O = new Set(["delulu.stream@decart.ai"]);

	function E(e) {
		return !!e && O.has(e.toLowerCase())
	}
	var T = e.i(582018),
		Y = e.i(379797),
		_ = e.i(627433),
		L = e.i(200734),
		Q = e.i(170380),
		H = e.i(848148),
		U = e.i(322932),
		G = e.i(8774),
		$ = e.i(480381),
		B = e.i(684128),
		R = e.i(932767),
		V = e.i(232250),
		W = e.i(380491),
		X = e.i(512992),
		J = e.i(351570),
		Z = e.i(619525),
		ee = e.i(528506),
		et = e.i(871101),
		en = e.i(538882),
		er = e.i(426682);
	let ea = et.z.object({
			name: en.z.string().min(1, "Name is required").max(15, "Name must be at most 15 characters").regex(/^[a-zA-Z0-9\s-]+$/, "Name can only contain English letters, numbers, spaces and dashes"),
			expiration: er.z.enum(["1d", "7d", "30d", "90d", "never"]).refine(e => !!e, {
				message: "Please select an expiration option"
			}),
			quota: en.z.string().regex(/^\d*$/, "Must be a whole number").optional(),
			quotaPeriod: er.z.enum(["never", "monthly"]).optional()
		}),
		ei = [{
			value: "1d",
			label: "1 day"
		}, {
			value: "7d",
			label: "7 days"
		}, {
			value: "30d",
			label: "30 days"
		}, {
			value: "90d",
			label: "90 days"
		}, {
			value: "never",
			label: "Never"
		}];

	function es(e) {
		U.c.error(e.message || "Failed to create API key")
	}

	function eo(e) {
		let n, r, a = (0, T.c)(3),
			{
				onClick: i
			} = e;
		return a[0] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, t.jsx)(_.f, {
			className: "size-4"
		}), a[0] = n) : n = a[0], a[1] !== i ? (r = (0, t.jsxs)(G.f, {
			onClick: i,
			children: [n, "Create API Key"]
		}), a[1] = i, a[2] = r) : r = a[2], r
	}
	var el = e.i(969266);

	function ec(e) {
		U.c.error(e.message || "Failed to create management key")
	}
	async function ed(e) {
		let t = await fetch("/api/org/management-key", {
				method: "POST",
				headers: {
					"content-type": "application/json"
				},
				body: JSON.stringify({
					name: e
				})
			}),
			n = await t.json();
		if (!t.ok) throw Error(n.error || "Failed to create management key");
		return n
	}

	function eu() {
		let e, n, r, a, i, s, o = (0, T.c)(16),
			[l, c] = (0, Q.useState)(!1),
			[d, u] = (0, Q.useState)(""),
			[m, h] = (0, Q.useState)(null),
			f = function() {
				let e, t = (0, T.c)(3),
					n = (0, Z.d)(),
					{
						data: r
					} = q.i.useSession(),
					a = r?.session?.activeOrganizationId;
				return t[0] !== a || t[1] !== n ? (e = {
					mutationFn: ed,
					onSuccess: () => {
						n.invalidateQueries({
							queryKey: ["apiKeys", a ?? "personal"]
						})
					},
					onError: ec
				}, t[0] = a, t[1] = n, t[2] = e) : e = t[2], (0, J.f)(e)
			}();
		o[0] !== f || o[1] !== d ? (e = () => {
			d.trim() && f.mutate(d.trim(), {
				onSuccess: e => h(e.apiKey)
			})
		}, o[0] = f, o[1] = d, o[2] = e) : e = o[2];
		let x = e;
		o[3] === Symbol.for("react.memo_cache_sentinel") ? (n = () => {
			u(""), h(null)
		}, o[3] = n) : n = o[3];
		let g = n;
		return o[4] !== m ? (r = e => {
			(e || !m) && (c(e), e || g())
		}, o[4] = m, o[5] = r) : r = o[5], o[6] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsxs)(G.f, {
			variant: "outline",
			onClick: () => c(!0),
			children: [(0, t.jsx)(el.f, {
				className: "size-4"
			}), "Management Key"]
		}), o[6] = a) : a = o[6], o[7] !== f || o[8] !== m || o[9] !== x || o[10] !== d ? (i = (0, t.jsx)($.d, {
			children: m ? (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsxs)($.s, {
					children: [(0, t.jsx)($.F, {
						children: "Management Key Created"
					}), (0, t.jsx)($.C, {
						children: "Copy it now — this is the only time it's shown."
					})]
				}), (0, t.jsxs)("div", {
					className: "flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-lg",
					children: [(0, t.jsx)(L.f, {
						className: "size-4 text-orange-500 mt-0.5 flex-shrink-0"
					}), (0, t.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Backend use only. This key can create and manage every API key in your organization — never embed it in a client or share it with end users."
					})]
				}), (0, t.jsxs)("div", {
					className: "mt-2 flex items-center gap-2",
					children: [(0, t.jsx)("code", {
						className: "text-sm bg-muted px-2 py-1 rounded font-mono flex-1 break-all",
						children: m
					}), (0, t.jsx)(X.f, {
						text: m,
						className: "size-8"
					})]
				}), (0, t.jsx)($.c, {
					children: (0, t.jsx)(G.f, {
						onClick: () => {
							c(!1), g()
						},
						children: "Done"
					})
				})]
			}) : (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsxs)($.s, {
					children: [(0, t.jsx)($.F, {
						children: "Create Management Key"
					}), (0, t.jsx)($.C, {
						children: "A backend credential that can create and manage this organization's API keys via the API. It cannot be used to generate content."
					})]
				}), (0, t.jsxs)("div", {
					className: "space-y-2",
					children: [(0, t.jsx)(V.f, {
						htmlFor: "mgmt-name",
						children: "Name"
					}), (0, t.jsx)(R.f, {
						id: "mgmt-name",
						placeholder: "e.g., delulu-backend",
						value: d,
						onChange: e => u(e.target.value),
						"data-1p-ignore": !0,
						autoComplete: "off"
					})]
				}), (0, t.jsxs)($.c, {
					children: [(0, t.jsx)(G.f, {
						variant: "outline",
						onClick: () => c(!1),
						disabled: f.isPending,
						children: "Cancel"
					}), (0, t.jsx)(G.f, {
						onClick: x,
						disabled: f.isPending || !d.trim(),
						children: f.isPending ? "Creating..." : "Create"
					})]
				})]
			})
		}), o[7] = f, o[8] = m, o[9] = x, o[10] = d, o[11] = i) : i = o[11], o[12] !== l || o[13] !== r || o[14] !== i ? (s = (0, t.jsxs)($.N, {
			open: l,
			onOpenChange: r,
			children: [a, i]
		}), o[12] = l, o[13] = r, o[14] = i, o[15] = s) : s = o[15], s
	}
	var em = e.i(61993);

	function eh(e) {
		U.c.error(e.message || "Failed to delete API key")
	}

	function ef(e) {
		let n, r, a, i, s, o, l, c, d, u, m = (0, T.c)(23),
			{
				apiKeyId: h,
				apiKeyName: f
			} = e,
			[x, g] = (0, Q.useState)(!1),
			y = function() {
				let e, t, n, r = (0, T.c)(8),
					a = (0, Z.d)(),
					{
						data: i
					} = q.i.useSession(),
					s = i?.session?.activeOrganizationId;
				return r[0] !== s ? (e = async e => {
					let {
						data: t,
						error: n
					} = await q.i.apiKey.update({
						keyId: e,
						enabled: !1,
						...s && {
							configId: "org-default"
						}
					});
					if (n) throw Error(n.message || "Failed to delete API key");
					return t
				}, r[0] = s, r[1] = e) : e = r[1], r[2] !== s || r[3] !== a ? (t = () => {
					U.c.success("API key deleted successfully"), a.invalidateQueries({
						queryKey: ["apiKeys", s ?? "personal"]
					})
				}, r[2] = s, r[3] = a, r[4] = t) : t = r[4], r[5] !== e || r[6] !== t ? (n = {
					mutationFn: e,
					onSuccess: t,
					onError: eh
				}, r[5] = e, r[6] = t, r[7] = n) : n = r[7], (0, J.f)(n)
			}();
		m[0] !== h || m[1] !== y ? (n = () => {
			y.mutate(h, {
				onSuccess: () => {
					g(!1)
				}
			})
		}, m[0] = h, m[1] = y, m[2] = n) : n = m[2];
		let j = n;
		m[3] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)($.a, {
			asChild: !0,
			children: (0, t.jsx)(G.f, {
				size: "icon",
				variant: "destructive",
				className: "size-8",
				children: (0, t.jsx)(em.f, {
					className: "size-4"
				})
			})
		}), m[3] = r) : r = m[3], m[4] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)($.F, {
			children: "Delete API Key"
		}), m[4] = a) : a = m[4], m[5] !== f ? (i = (0, t.jsxs)($.s, {
			children: [a, (0, t.jsxs)($.C, {
				children: ['Are you sure you want to delete the API key "', f, '"? This action cannot be undone and will immediately revoke access for applications using this key.']
			})]
		}), m[5] = f, m[6] = i) : i = m[6], m[7] === Symbol.for("react.memo_cache_sentinel") ? (s = () => g(!1), m[7] = s) : s = m[7], m[8] !== y.isPending ? (o = (0, t.jsx)(G.f, {
			variant: "outline",
			onClick: s,
			disabled: y.isPending,
			children: "Cancel"
		}), m[8] = y.isPending, m[9] = o) : o = m[9];
		let p = y.isPending ? "Deleting..." : "Delete";
		return m[10] !== y.isPending || m[11] !== j || m[12] !== p ? (l = (0, t.jsx)(G.f, {
			variant: "destructive",
			onClick: j,
			disabled: y.isPending,
			children: p
		}), m[10] = y.isPending, m[11] = j, m[12] = p, m[13] = l) : l = m[13], m[14] !== o || m[15] !== l ? (c = (0, t.jsxs)($.c, {
			children: [o, l]
		}), m[14] = o, m[15] = l, m[16] = c) : c = m[16], m[17] !== i || m[18] !== c ? (d = (0, t.jsxs)($.d, {
			children: [i, c]
		}), m[17] = i, m[18] = c, m[19] = d) : d = m[19], m[20] !== x || m[21] !== d ? (u = (0, t.jsxs)($.N, {
			open: x,
			onOpenChange: g,
			children: [r, d]
		}), m[20] = x, m[21] = d, m[22] = u) : u = m[22], u
	}
	var ex = e.i(73575);

	function eg(e) {
		let n, r, a, i, s, o, l, c, d, u, m, h, f, x, g, y, j, p, b, w, v, N, k = (0, T.c)(51),
			{
				apiKeyId: P,
				apiKeyName: C,
				currentQuota: S,
				currentPeriodDays: M,
				existingMetadata: I
			} = e,
			[D, A] = (0, Q.useState)(!1);
		k[0] !== S ? (n = S?.toString() ?? "", k[0] = S, k[1] = n) : n = k[1];
		let [z, K] = (0, Q.useState)(n), [F, O] = (0, Q.useState)(M ? "monthly" : "never"), E = function() {
			let e = (0, Z.d)(),
				{
					data: t
				} = q.i.useSession(),
				n = t?.session?.activeOrganizationId;
			return (0, J.f)({
				mutationFn: async ({
					keyId: e,
					existingMetadata: t,
					creditQuota: r,
					periodDays: a
				}) => {
					let i = {};
					try {
						let e = "string" == typeof t ? JSON.parse(t) : t;
						"string" == typeof e && (e = JSON.parse(e)), e && "object" == typeof e && (i = {
							...e
						})
					} catch {}
					null === r ? (delete i.creditQuota, delete i.creditQuotaPeriodDays) : (i.creditQuota = r, null === a ? delete i.creditQuotaPeriodDays : i.creditQuotaPeriodDays = a);
					let {
						data: s,
						error: o
					} = await q.i.apiKey.update({
						keyId: e,
						metadata: i,
						...n && {
							configId: "org-default"
						}
					});
					if (o) throw Error(o.message || "Failed to update credit limit");
					return s
				},
				onSuccess: () => {
					U.c.success("Credit limit updated"), e.invalidateQueries({
						queryKey: ["apiKeys", n ?? "personal"]
					})
				},
				onError: e => {
					U.c.error(e.message || "Failed to update credit limit")
				}
			})
		}();
		k[2] !== z ? (r = "" === z || /^\d+$/.test(z), k[2] = z, k[3] = r) : r = k[3];
		let Y = r;
		k[4] !== P || k[5] !== I || k[6] !== Y || k[7] !== F || k[8] !== E || k[9] !== z ? (a = () => {
			Y && E.mutate({
				keyId: P,
				existingMetadata: I,
				creditQuota: "" === z ? null : Number(z),
				periodDays: "monthly" === F ? 30 : null
			}, {
				onSuccess: () => A(!1)
			})
		}, k[4] = P, k[5] = I, k[6] = Y, k[7] = F, k[8] = E, k[9] = z, k[10] = a) : a = k[10];
		let _ = a;
		k[11] !== M || k[12] !== S ? (i = e => {
			A(e), e && (K(S?.toString() ?? ""), O(M ? "monthly" : "never"))
		}, k[11] = M, k[12] = S, k[13] = i) : i = k[13];
		let L = i;
		k[14] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)($.a, {
			asChild: !0,
			children: (0, t.jsx)(G.f, {
				size: "icon",
				variant: "outline",
				className: "size-8",
				children: (0, t.jsx)(ex.f, {
					className: "size-4"
				})
			})
		}), k[14] = s) : s = k[14], k[15] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)($.F, {
			children: "Edit Credit Limit"
		}), k[15] = o) : o = k[15], k[16] !== C ? (l = (0, t.jsxs)($.s, {
			children: [o, (0, t.jsxs)($.C, {
				children: ['Maximum credits the key "', C, '" can spend. Leave empty to remove the limit.']
			})]
		}), k[16] = C, k[17] = l) : l = k[17], k[18] === Symbol.for("react.memo_cache_sentinel") ? (c = (0, t.jsx)(V.f, {
			htmlFor: "credit-limit",
			children: "Credit limit"
		}), k[18] = c) : c = k[18], k[19] === Symbol.for("react.memo_cache_sentinel") ? (d = e => K(e.target.value), k[19] = d) : d = k[19], k[20] !== z ? (u = (0, t.jsx)(R.f, {
			id: "credit-limit",
			placeholder: "e.g., 1000",
			inputMode: "numeric",
			value: z,
			onChange: d,
			"data-1p-ignore": !0,
			autoComplete: "off"
		}), k[20] = z, k[21] = u) : u = k[21], k[22] !== Y ? (m = !Y && (0, t.jsx)("p", {
			className: "text-sm text-destructive",
			children: "Must be a whole number"
		}), k[22] = Y, k[23] = m) : m = k[23], k[24] !== u || k[25] !== m ? (h = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [c, u, m]
		}), k[24] = u, k[25] = m, k[26] = h) : h = k[26], k[27] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, t.jsx)(V.f, {
			children: "Limit resets"
		}), k[27] = f) : f = k[27], k[28] === Symbol.for("react.memo_cache_sentinel") ? (x = (0, t.jsx)(W.P, {
			children: (0, t.jsx)(W.U, {})
		}), k[28] = x) : x = k[28], k[29] === Symbol.for("react.memo_cache_sentinel") ? (g = (0, t.jsxs)(W.r, {
			children: [(0, t.jsx)(W.T, {
				value: "never",
				children: "Never (lifetime limit)"
			}), (0, t.jsx)(W.T, {
				value: "monthly",
				children: "Every 30 days"
			})]
		}), k[29] = g) : g = k[29], k[30] !== F ? (y = (0, t.jsxs)("div", {
			className: "space-y-2",
			children: [f, (0, t.jsxs)(W.d, {
				value: F,
				onValueChange: O,
				children: [x, g]
			})]
		}), k[30] = F, k[31] = y) : y = k[31], k[32] === Symbol.for("react.memo_cache_sentinel") ? (j = () => A(!1), k[32] = j) : j = k[32], k[33] !== E.isPending ? (p = (0, t.jsx)(G.f, {
			variant: "outline",
			onClick: j,
			disabled: E.isPending,
			children: "Cancel"
		}), k[33] = E.isPending, k[34] = p) : p = k[34];
		let H = E.isPending || !Y,
			B = E.isPending ? "Saving..." : "Save";
		return k[35] !== _ || k[36] !== H || k[37] !== B ? (b = (0, t.jsx)(G.f, {
			onClick: _,
			disabled: H,
			children: B
		}), k[35] = _, k[36] = H, k[37] = B, k[38] = b) : b = k[38], k[39] !== p || k[40] !== b ? (w = (0, t.jsxs)($.c, {
			children: [p, b]
		}), k[39] = p, k[40] = b, k[41] = w) : w = k[41], k[42] !== h || k[43] !== y || k[44] !== w || k[45] !== l ? (v = (0, t.jsxs)($.d, {
			children: [l, h, y, w]
		}), k[42] = h, k[43] = y, k[44] = w, k[45] = l, k[46] = v) : v = k[46], k[47] !== L || k[48] !== D || k[49] !== v ? (N = (0, t.jsxs)($.N, {
			open: D,
			onOpenChange: L,
			children: [s, v]
		}), k[47] = L, k[48] = D, k[49] = v, k[50] = N) : N = k[50], N
	}

	function ey(e) {
		let n, r = (0, T.c)(2),
			{
				secretKey: a
			} = e,
			i = function(e) {
				return `${e.substring(0,7)}${"•".repeat(24)}`
			}(a);
		return r[0] !== i ? (n = (0, t.jsx)("code", {
			className: "text-sm bg-muted px-2 py-1 rounded font-mono",
			children: i
		}), r[0] = i, r[1] = n) : n = r[1], n
	}
	e.s(["ApiKeysTable", 0, function() {
		let {
			data: e,
			error: r
		} = (0, F.f)(), {
			dialog: a,
			openDialog: s
		} = function() {
			let [e, n] = (0, Q.useState)(!1), [r, a] = (0, Q.useState)(null), i = (0, Q.useRef)(null), s = function() {
				let e, t, n, r = (0, T.c)(9),
					a = (0, Z.d)(),
					{
						data: i
					} = q.i.useSession(),
					s = i?.session?.activeOrganizationId;
				return r[0] !== s ? (e = async e => {
					let t = `dct_${e.name.toLowerCase().replace(/\s+/g,"-")}_`,
						n = (e => {
							switch (e) {
								case "1d":
									return 86400;
								case "7d":
									return 604800;
								case "30d":
									return 2592e3;
								case "90d":
									return 7776e3;
								case "never":
									return null
							}
						})(e.expiration),
						r = e.quota ? {
							creditQuota: Number(e.quota),
							..."monthly" === e.quotaPeriod && {
								creditQuotaPeriodDays: 30
							}
						} : void 0,
						a = s ? {
							configId: "org-default",
							organizationId: s,
							name: e.name,
							prefix: t,
							...n && {
								expiresIn: n
							},
							...r && {
								metadata: r
							}
						} : {
							name: e.name,
							prefix: t,
							...n && {
								expiresIn: n
							},
							...r && {
								metadata: r
							}
						},
						{
							data: i,
							error: o
						} = await q.i.apiKey.create(a);
					if (o) throw Error(o.message || "Failed to create API key");
					return i
				}, r[0] = s, r[1] = e) : e = r[1], r[2] !== s || r[3] !== a || r[4] !== i?.user?.id ? (t = () => {
					let e = i?.user?.id;
					ee.f.trackApiKeyCreated(e), U.c.success("API key created successfully"), a.invalidateQueries({
						queryKey: ["apiKeys", s ?? "personal"]
					})
				}, r[2] = s, r[3] = a, r[4] = i?.user?.id, r[5] = t) : t = r[5], r[6] !== e || r[7] !== t ? (n = {
					mutationFn: e,
					onSuccess: t,
					onError: es
				}, r[6] = e, r[7] = t, r[8] = n) : n = r[8], (0, J.f)(n)
			}(), {
				data: o
			} = q.i.useSession(), l = E(o?.user?.email), c = (0, H.G)({
				resolver: (0, Y.f)(ea),
				defaultValues: {
					name: "",
					expiration: "30d",
					quota: "",
					quotaPeriod: "never"
				}
			}), d = (0, Q.useCallback)(e => {
				s.mutate(e, {
					onSuccess: t => {
						if (t?.key) {
							let n = {
								name: e.name,
								key: t.key
							};
							i.current = n, a(n), c.reset()
						} else U.c.error("API key was created but the key value was not returned")
					}
				})
			}, [s, c]), u = (0, Q.useCallback)(() => {
				n(!1), i.current = null, a(null), c.reset()
			}, []), m = (0, Q.useCallback)(() => {
				i.current = null, a(null)
			}, []), h = (0, Q.useCallback)(e => {
				(e || !i.current) && (n(e), e || (i.current = null, a(null), c.reset()))
			}, [c]), f = (0, Q.useMemo)(() => r ? (0, t.jsxs)($.d, {
				className: "max-w-3xl!",
				showCloseButton: !1,
				children: [(0, t.jsxs)($.s, {
					children: [(0, t.jsx)($.F, {
						children: "API Key Created"
					}), (0, t.jsx)($.C, {
						children: "Your API key has been created successfully."
					})]
				}), (0, t.jsxs)("div", {
					className: "flex items-start gap-3 p-4 bg-muted/30 border border-border rounded-lg",
					children: [(0, t.jsx)(L.f, {
						className: "size-4 text-orange-500 mt-0.5 flex-shrink-0"
					}), (0, t.jsxs)("div", {
						className: "space-y-1",
						children: [(0, t.jsx)("p", {
							className: "text-sm font-medium text-foreground",
							children: "Save your API key now"
						}), (0, t.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "This is the only time you'll see it. Copy and store it securely before closing."
						})]
					})]
				}), (0, t.jsxs)("div", {
					className: "space-y-4",
					children: [(0, t.jsxs)("div", {
						children: [(0, t.jsx)(V.f, {
							children: "Name"
						}), (0, t.jsx)("div", {
							className: "text-sm text-muted-foreground mt-1",
							children: r.name
						})]
					}), (0, t.jsxs)("div", {
						children: [(0, t.jsx)(V.f, {
							children: "API Key"
						}), (0, t.jsxs)("div", {
							className: "mt-2 flex items-center gap-2",
							children: [(0, t.jsx)("code", {
								className: "text-sm bg-muted px-2 py-1 rounded font-mono flex-1",
								children: r.key
							}), (0, t.jsx)(X.f, {
								text: r.key,
								className: "size-8"
							})]
						})]
					})]
				}), (0, t.jsxs)($.c, {
					children: [(0, t.jsx)(G.f, {
						variant: "outline",
						onClick: m,
						children: "Create Another"
					}), (0, t.jsx)(G.f, {
						onClick: u,
						children: "Done"
					})]
				})]
			}) : (0, t.jsxs)($.d, {
				children: [(0, t.jsxs)($.s, {
					children: [(0, t.jsx)($.F, {
						children: "Create API Key"
					}), (0, t.jsx)($.C, {
						children: "Create a new API key for your applications. Choose a descriptive name and expiration period."
					})]
				}), (0, t.jsx)(B.n, {
					...c,
					children: (0, t.jsxs)("form", {
						onSubmit: c.handleSubmit(d),
						className: "space-y-4",
						children: [(0, t.jsx)(B.G, {
							control: c.control,
							name: "name",
							render: ({
								field: e
							}) => (0, t.jsxs)(B.V, {
								children: [(0, t.jsxs)(B.y, {
									children: ["Name ", (0, t.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}), (0, t.jsx)(B.K, {
									children: (0, t.jsx)(R.f, {
										placeholder: "e.g., Production API Key",
										"data-1p-ignore": !0,
										autoComplete: "off",
										...e
									})
								}), (0, t.jsx)(B.Y, {
									children: "Maximum 15 characters. Only English letters, numbers, spaces and dashes allowed."
								}), (0, t.jsx)(B.o, {})]
							})
						}), l && (0, t.jsxs)(t.Fragment, {
							children: [(0, t.jsx)(B.G, {
								control: c.control,
								name: "quota",
								render: ({
									field: e
								}) => (0, t.jsxs)(B.V, {
									children: [(0, t.jsx)(B.y, {
										children: "Credit limit"
									}), (0, t.jsx)(B.K, {
										children: (0, t.jsx)(R.f, {
											placeholder: "e.g., 1000",
											inputMode: "numeric",
											"data-1p-ignore": !0,
											autoComplete: "off",
											...e
										})
									}), (0, t.jsx)(B.Y, {
										children: "Maximum credits this key can spend. Leave empty for unlimited."
									}), (0, t.jsx)(B.o, {})]
								})
							}), (0, t.jsx)(B.G, {
								control: c.control,
								name: "quotaPeriod",
								render: ({
									field: e
								}) => (0, t.jsxs)(B.V, {
									children: [(0, t.jsx)(B.y, {
										children: "Limit resets"
									}), (0, t.jsxs)(W.d, {
										onValueChange: e.onChange,
										defaultValue: e.value,
										children: [(0, t.jsx)(B.K, {
											children: (0, t.jsx)(W.P, {
												children: (0, t.jsx)(W.U, {
													placeholder: "Never"
												})
											})
										}), (0, t.jsxs)(W.r, {
											children: [(0, t.jsx)(W.T, {
												value: "never",
												children: "Never (lifetime limit)"
											}), (0, t.jsx)(W.T, {
												value: "monthly",
												children: "Every 30 days"
											})]
										})]
									}), (0, t.jsx)(B.Y, {
										children: "Only applies when a credit limit is set."
									}), (0, t.jsx)(B.o, {})]
								})
							})]
						}), (0, t.jsx)(B.G, {
							control: c.control,
							name: "expiration",
							render: ({
								field: e
							}) => (0, t.jsxs)(B.V, {
								children: [(0, t.jsxs)(B.y, {
									children: ["Expiration ", (0, t.jsx)("span", {
										className: "text-destructive",
										children: "*"
									})]
								}), (0, t.jsxs)(W.d, {
									onValueChange: e.onChange,
									defaultValue: e.value,
									children: [(0, t.jsx)(B.K, {
										children: (0, t.jsx)(W.P, {
											children: (0, t.jsx)(W.U, {
												placeholder: "Select expiration"
											})
										})
									}), (0, t.jsx)(W.r, {
										children: ei.map(e => (0, t.jsx)(W.T, {
											value: e.value,
											children: e.label
										}, e.value))
									})]
								}), (0, t.jsx)(B.o, {})]
							})
						}), (0, t.jsxs)($.c, {
							children: [(0, t.jsx)(G.f, {
								variant: "outline",
								type: "button",
								onClick: u,
								disabled: s.isPending,
								children: "Cancel"
							}), (0, t.jsx)(G.f, {
								type: "submit",
								disabled: s.isPending,
								children: s.isPending ? "Creating..." : "Create API Key"
							})]
						})]
					})
				})]
			}), [r, c, s.isPending, m, d, l]), x = (0, Q.useCallback)(() => n(!0), []);
			return {
				dialog: (0, t.jsx)($.N, {
					open: e,
					onOpenChange: h,
					children: f
				}),
				openDialog: x
			}
		}(), {
			data: u
		} = q.i.useSession(), {
			data: m
		} = (0, q.M)(), h = u?.session?.activeOrganizationId, f = m?.members?.find(e => e.userId === u?.user?.id), x = !h || !!f, g = f?.role === "owner" || f?.role === "admin", y = E(u?.user?.email), p = e => !!e.permissions, b = e => {
			try {
				return function(e, t) {
					let n = (0, d.f)(),
						r = (void 0) ?? n.locale ?? c.f,
						a = (void 0) ?? void 0 ?? n.firstWeekContainsDate ?? n.locale?.options?.firstWeekContainsDate ?? 1,
						s = (void 0) ?? void 0 ?? n.weekStartsOn ?? n.locale?.options?.weekStartsOn ?? 0,
						o = (0, i.f)(e, void 0);
					if (!(o instanceof Date || "object" == typeof o && "[object Date]" === Object.prototype.toString.call(o)) && "number" != typeof o || isNaN(+(0, i.f)(o))) throw RangeError("Invalid time value");
					let l = t.match(I).map(e => {
						let t = e[0];
						return "p" === t || "P" === t ? (0, k[t])(e, r.formatLong) : e
					}).join("").match(M).map(e => {
						if ("''" === e) return {
							isToken: !1,
							value: "'"
						};
						let t = e[0];
						if ("'" === t) {
							var n;
							let t;
							return {
								isToken: !1,
								value: (t = (n = e).match(D)) ? t[1].replace(A, "'") : n
							}
						}
						if (j[t]) return {
							isToken: !0,
							value: e
						};
						if (t.match(z)) throw RangeError("Format string contains an unescaped latin alphabet character `" + t + "`");
						return {
							isToken: !1,
							value: e
						}
					});
					r.localize.preprocessor && (l = r.localize.preprocessor(o, l));
					let u = {
						firstWeekContainsDate: a,
						weekStartsOn: s,
						locale: r
					};
					return l.map(n => {
						if (!n.isToken) return n.value;
						let a = n.value;
						return (C.test(a) || P.test(a)) && function(e, t, n) {
							var r, a, i;
							let s, o = (r = e, a = t, i = n, s = "Y" === r[0] ? "years" : "days of the month", `Use \`${r.toLowerCase()}\` instead of \`${r}\` (in \`${a}\`) for formatting ${s} to the input \`${i}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`);
							if (console.warn(o), S.includes(e)) throw RangeError(o)
						}(a, t, String(e)), (0, j[a[0]])(o, a, r.localize, u)
					}).join("")
				}(new Date(e), "MMM d, yyyy 'at' h:mm a")
			} catch (e) {
				return "Invalid date"
			}
		}, w = e => {
			try {
				let t = "string" == typeof e.metadata ? JSON.parse(e.metadata) : e.metadata;
				return "string" == typeof t && (t = JSON.parse(t)), t && "object" == typeof t ? t : null
			} catch {
				return null
			}
		}, v = e => {
			let t = w(e)?.creditQuota;
			return "number" == typeof t ? t : void 0
		}, N = e => {
			let t = w(e)?.creditQuotaPeriodDays;
			return "number" == typeof t ? t : void 0
		};
		if (r) return (0, t.jsx)("div", {
			className: "text-muted-foreground",
			children: "Failed to load API keys"
		});
		if (!e) return (0, t.jsx)("div", {
			className: "text-muted-foreground",
			children: "Loading API keys…"
		});
		let O = e.filter(p),
			_ = e.filter(e => !p(e));
		return (0, t.jsxs)("div", {
			className: "space-y-8 max-w-7xl mx-auto",
			children: [a, (0, t.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [(0, t.jsxs)("div", {
					children: [(0, t.jsx)("h1", {
						className: "text-2xl font-semibold",
						children: "API Keys"
					}), (0, t.jsx)("p", {
						className: "text-muted-foreground",
						children: "Manage your API keys for accessing the Decart API"
					})]
				}), x && (0, t.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [g && y && (0, t.jsx)(eu, {}), (0, t.jsx)(eo, {
						onClick: s
					})]
				})]
			}), y && O.length > 0 && (0, t.jsxs)("div", {
				className: "space-y-2",
				children: [(0, t.jsxs)("div", {
					children: [(0, t.jsx)("h2", {
						className: "text-lg font-medium",
						children: "Management keys"
					}), (0, t.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Backend credentials that manage this organization's API keys. They can't generate content."
					})]
				}), (0, t.jsx)("div", {
					className: "border rounded-lg",
					children: (0, t.jsxs)(K.s, {
						children: [(0, t.jsx)(K.E, {
							children: (0, t.jsxs)(K.N, {
								children: [(0, t.jsx)(K.U, {
									children: "Name"
								}), (0, t.jsx)(K.U, {
									children: "Secret Key"
								}), (0, t.jsx)(K.U, {
									children: "Created"
								}), (0, t.jsx)(K.U, {
									children: "Last Used"
								}), (0, t.jsx)(K.U, {
									className: "w-16",
									children: "Actions"
								})]
							})
						}), (0, t.jsx)(K.z, {
							children: O.map(e => (0, t.jsxs)(K.N, {
								children: [(0, t.jsx)(K.d, {
									className: "font-medium",
									children: e.name
								}), (0, t.jsx)(K.d, {
									children: (0, t.jsx)(ey, {
										secretKey: e.start ?? ""
									})
								}), (0, t.jsx)(K.d, {
									className: "text-muted-foreground",
									children: b(e.createdAt?.toString?.() ?? "")
								}), (0, t.jsx)(K.d, {
									className: "text-muted-foreground",
									children: "lastRequest" in e && e.lastRequest ? b(e.lastRequest?.toString?.() ?? "") : "Never"
								}), (0, t.jsx)(K.d, {
									children: x && (0, t.jsx)(ef, {
										apiKeyId: e.id,
										apiKeyName: e.name
									})
								})]
							}, e.id))
						})]
					})
				})]
			}), 0 === _.length ? (0, t.jsxs)("div", {
				className: "border rounded-lg p-8 text-center",
				children: [(0, t.jsx)("h3", {
					className: "text-lg font-medium mb-2",
					children: "No API keys found"
				}), (0, t.jsx)("p", {
					className: "text-muted-foreground mb-4",
					children: x ? "Create your first API key to start using the Decart API" : "No API keys have been created for this organization yet"
				}), x && (0, t.jsx)(eo, {
					onClick: s
				})]
			}) : (0, t.jsx)("div", {
				className: "border rounded-lg",
				children: (0, t.jsxs)(K.s, {
					children: [(0, t.jsx)(K.E, {
						children: (0, t.jsxs)(K.N, {
							children: [(0, t.jsx)(K.U, {
								children: "Name"
							}), (0, t.jsx)(K.U, {
								children: "Secret Key"
							}), (0, t.jsx)(K.U, {
								children: "Created"
							}), (0, t.jsx)(K.U, {
								children: "Last Used"
							}), y && (0, t.jsx)(K.U, {
								children: "Credits Used"
							}), y && (0, t.jsx)(K.U, {
								children: "Credit Limit"
							}), (0, t.jsx)(K.U, {
								children: "Expires In"
							}), (0, t.jsx)(K.U, {
								className: "w-24",
								children: "Actions"
							})]
						})
					}), (0, t.jsx)(K.z, {
						children: _.map(e => (0, t.jsxs)(K.N, {
							children: [(0, t.jsx)(K.d, {
								className: "font-medium",
								children: e.name
							}), (0, t.jsx)(K.d, {
								children: (0, t.jsx)(ey, {
									secretKey: e.start ?? ""
								})
							}), (0, t.jsx)(K.d, {
								className: "text-muted-foreground",
								children: b(e.createdAt?.toString?.() ?? "")
							}), (0, t.jsx)(K.d, {
								className: "text-muted-foreground",
								children: "lastRequest" in e && e.lastRequest ? b(e.lastRequest?.toString?.() ?? "") : "Never"
							}), y && (0, t.jsx)(K.d, {
								className: "text-muted-foreground",
								children: e.creditsSpent ?? 0
							}), y && (0, t.jsx)(K.d, {
								className: "text-muted-foreground",
								children: (e => {
									let t = v(e);
									if (void 0 === t) return "Unlimited";
									let n = N(e);
									return n ? `${t} / ${n}d` : `${t}`
								})(e)
							}), (0, t.jsx)(K.d, {
								className: "text-muted-foreground",
								children: (e => {
									if (!e) return "Never";
									try {
										let t = new Date(e),
											r = new Date,
											a = function(e, t) {
												let [r, a] = (0, n.f)(void 0, e, t), i = l(r, a), s = Math.abs(o(r, a));
												r.setDate(r.getDate() - i * s);
												let c = Number(l(r, a) === -i),
													d = i * (s - c);
												return 0 === d ? 0 : d
											}(t, r);
										if (a < 0) return "Expired";
										if (0 === a) return "Today";
										if (1 === a) return "1 day";
										else return `${a} days`
									} catch (e) {
										return "Invalid date"
									}
								})("expiresAt" in e ? e.expiresAt : null)
							}), (0, t.jsx)(K.d, {
								children: x && (0, t.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [y && (0, t.jsx)(eg, {
										apiKeyId: e.id,
										apiKeyName: e.name,
										currentQuota: v(e),
										currentPeriodDays: N(e),
										existingMetadata: e.metadata
									}), (0, t.jsx)(ef, {
										apiKeyId: e.id,
										apiKeyName: e.name
									})]
								})
							})]
						}, e.id))
					})]
				})
			})]
		})
	}], 924675)
}]);