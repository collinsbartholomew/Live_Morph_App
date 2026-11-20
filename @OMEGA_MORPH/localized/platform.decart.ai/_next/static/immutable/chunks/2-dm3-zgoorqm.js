(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 595884, e => {
	"use strict";
	var t = e.i(234984),
		a = e.i(582018),
		n = e.i(818036);
	e.s(["s", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("w-full caption-bottom text-sm", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("div", {
			"data-slot": "table-container",
			className: "relative w-full overflow-x-auto",
			children: (0, t.jsx)("table", {
				"data-slot": "table",
				className: o,
				...i
			})
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}, "z", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("[&_tr:last-child]:border-0", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("tbody", {
			"data-slot": "table-body",
			className: o,
			...i
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}, "d", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("td", {
			"data-slot": "table-cell",
			className: o,
			...i
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}, "U", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("th", {
			"data-slot": "table-head",
			className: o,
			...i
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}, "E", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("[&_tr]:border-b", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("thead", {
			"data-slot": "table-header",
			className: o,
			...i
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}, "N", 0, function(e) {
		let r, i, o, s, l = (0, a.c)(8);
		return l[0] !== e ? ({
			className: r,
			...i
		} = e, l[0] = e, l[1] = r, l[2] = i) : (r = l[1], i = l[2]), l[3] !== r ? (o = (0, n.c)("hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors", r), l[3] = r, l[4] = o) : o = l[4], l[5] !== i || l[6] !== o ? (s = (0, t.jsx)("tr", {
			"data-slot": "table-row",
			className: o,
			...i
		}), l[5] = i, l[6] = o, l[7] = s) : s = l[7], s
	}])
}, 629841, e => {
	"use strict";
	var t = e.i(582018),
		a = e.i(584381),
		n = e.i(663303),
		r = e.i(205647);
	async function i() {
		let e = await fetch("/api/user/api-keys/list");
		return await (0, r.W)(e, "Failed to fetch API keys"), await e.json()
	}
	e.s(["f", 0, function() {
		let e, r, o = (0, t.c)(6),
			{
				data: s
			} = n.i.useSession(),
			l = s?.session?.activeOrganizationId ?? "personal";
		o[0] !== l ? (e = {
			queryKey: ["apiKeys", l],
			queryFn: i
		}, o[0] = l, o[1] = e) : e = o[1];
		let {
			data: u,
			isLoading: d,
			error: h
		} = (0, a.f)(e);
		return o[2] !== u || o[3] !== h || o[4] !== d ? (r = {
			data: u,
			isLoading: d,
			error: h
		}, o[2] = u, o[3] = h, o[4] = d, o[5] = r) : r = o[5], r
	}])
}, 512992, e => {
	"use strict";
	var t = e.i(234984),
		a = e.i(110430),
		n = e.i(195907),
		r = e.i(170380),
		i = e.i(8774),
		o = e.i(546009);
	e.s(["f", 0, function({
		text: e,
		className: s,
		variant: l = "ghost",
		size: u = "icon",
		onCopy: d
	}) {
		let [h, c] = (0, r.useState)(!1), m = async () => {
			try {
				await navigator.clipboard.writeText(e), c(!0), d?.(), setTimeout(() => c(!1), 3e3)
			} catch (e) {}
		};
		return (0, t.jsx)(o.g, {
			children: (0, t.jsxs)(o.W, {
				open: h,
				children: [(0, t.jsx)(o.y, {
					asChild: !0,
					children: (0, t.jsx)(i.f, {
						variant: l,
						size: u,
						onClick: m,
						className: s,
						"aria-label": "Copy to clipboard",
						children: h ? (0, t.jsx)(a.f, {
							className: "size-4"
						}) : (0, t.jsx)(n.f, {
							className: "size-4"
						})
					})
				}), (0, t.jsx)(o.Y, {
					children: (0, t.jsx)("p", {
						children: "Copied!"
					})
				})]
			})
		})
	}])
}, 745502, 595053, e => {
	"use strict";
	var t = e.i(255665);

	function a(e, a) {
		return (0, t.f)(a || e, e)
	}
	e.s(["f", 0, a], 595053), e.s(["f", 0, function(e) {
		let t = a(e),
			n = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), t.getMilliseconds()));
		return n.setUTCFullYear(t.getFullYear()), e - n
	}], 745502)
}, 250576, e => {
	"use strict";
	var t = e.i(255665);
	e.s(["f", 0, function(e, ...a) {
		let n = t.f.bind(null, e || a.find(e => "object" == typeof e));
		return a.map(n)
	}])
}, 255665, 677417, e => {
	"use strict";
	let t = Symbol.for("constructDateFrom");
	e.s(["C", 0, t, "_", 0, 864e5, "A", 0, 6048e5, "k", 0, 1440, "d", 0, 43200], 677417), e.s(["f", 0, function(e, a) {
		return "function" == typeof e ? e(a) : e && "object" == typeof e && t in e ? e[t](a) : e instanceof Date ? new e.constructor(a) : new Date(a)
	}], 255665)
}, 618508, 893890, e => {
	"use strict";
	var t;
	let a = {
		lessThanXSeconds: {
			one: "less than a second",
			other: "less than {{count}} seconds"
		},
		xSeconds: {
			one: "1 second",
			other: "{{count}} seconds"
		},
		halfAMinute: "half a minute",
		lessThanXMinutes: {
			one: "less than a minute",
			other: "less than {{count}} minutes"
		},
		xMinutes: {
			one: "1 minute",
			other: "{{count}} minutes"
		},
		aboutXHours: {
			one: "about 1 hour",
			other: "about {{count}} hours"
		},
		xHours: {
			one: "1 hour",
			other: "{{count}} hours"
		},
		xDays: {
			one: "1 day",
			other: "{{count}} days"
		},
		aboutXWeeks: {
			one: "about 1 week",
			other: "about {{count}} weeks"
		},
		xWeeks: {
			one: "1 week",
			other: "{{count}} weeks"
		},
		aboutXMonths: {
			one: "about 1 month",
			other: "about {{count}} months"
		},
		xMonths: {
			one: "1 month",
			other: "{{count}} months"
		},
		aboutXYears: {
			one: "about 1 year",
			other: "about {{count}} years"
		},
		xYears: {
			one: "1 year",
			other: "{{count}} years"
		},
		overXYears: {
			one: "over 1 year",
			other: "over {{count}} years"
		},
		almostXYears: {
			one: "almost 1 year",
			other: "almost {{count}} years"
		}
	};

	function n(e) {
		return (t = {}) => {
			let a = t.width ? String(t.width) : e.defaultWidth;
			return e.formats[a] || e.formats[e.defaultWidth]
		}
	}
	let r = {
			date: n({
				formats: {
					full: "EEEE, MMMM do, y",
					long: "MMMM do, y",
					medium: "MMM d, y",
					short: "MM/dd/yyyy"
				},
				defaultWidth: "full"
			}),
			time: n({
				formats: {
					full: "h:mm:ss a zzzz",
					long: "h:mm:ss a z",
					medium: "h:mm:ss a",
					short: "h:mm a"
				},
				defaultWidth: "full"
			}),
			dateTime: n({
				formats: {
					full: "{{date}} 'at' {{time}}",
					long: "{{date}} 'at' {{time}}",
					medium: "{{date}}, {{time}}",
					short: "{{date}}, {{time}}"
				},
				defaultWidth: "full"
			})
		},
		i = {
			lastWeek: "'last' eeee 'at' p",
			yesterday: "'yesterday at' p",
			today: "'today at' p",
			tomorrow: "'tomorrow at' p",
			nextWeek: "eeee 'at' p",
			other: "P"
		};

	function o(e) {
		return (t, a) => {
			let n;
			if ("formatting" === (a?.context ? String(a.context) : "standalone") && e.formattingValues) {
				let t = e.defaultFormattingWidth || e.defaultWidth,
					r = a?.width ? String(a.width) : t;
				n = e.formattingValues[r] || e.formattingValues[t]
			} else {
				let t = e.defaultWidth,
					r = a?.width ? String(a.width) : e.defaultWidth;
				n = e.values[r] || e.values[t]
			}
			return n[e.argumentCallback ? e.argumentCallback(t) : t]
		}
	}
	let s = {
		ordinalNumber: (e, t) => {
			let a = Number(e),
				n = a % 100;
			if (n > 20 || n < 10) switch (n % 10) {
				case 1:
					return a + "st";
				case 2:
					return a + "nd";
				case 3:
					return a + "rd"
			}
			return a + "th"
		},
		era: o({
			values: {
				narrow: ["B", "A"],
				abbreviated: ["BC", "AD"],
				wide: ["Before Christ", "Anno Domini"]
			},
			defaultWidth: "wide"
		}),
		quarter: o({
			values: {
				narrow: ["1", "2", "3", "4"],
				abbreviated: ["Q1", "Q2", "Q3", "Q4"],
				wide: ["1st quarter", "2nd quarter", "3rd quarter", "4th quarter"]
			},
			defaultWidth: "wide",
			argumentCallback: e => e - 1
		}),
		month: o({
			values: {
				narrow: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
				abbreviated: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				wide: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
			},
			defaultWidth: "wide"
		}),
		day: o({
			values: {
				narrow: ["S", "M", "T", "W", "T", "F", "S"],
				short: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
				abbreviated: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
				wide: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			},
			defaultWidth: "wide"
		}),
		dayPeriod: o({
			values: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "mi",
					noon: "n",
					morning: "morning",
					afternoon: "afternoon",
					evening: "evening",
					night: "night"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "midnight",
					noon: "noon",
					morning: "morning",
					afternoon: "afternoon",
					evening: "evening",
					night: "night"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "midnight",
					noon: "noon",
					morning: "morning",
					afternoon: "afternoon",
					evening: "evening",
					night: "night"
				}
			},
			defaultWidth: "wide",
			formattingValues: {
				narrow: {
					am: "a",
					pm: "p",
					midnight: "mi",
					noon: "n",
					morning: "in the morning",
					afternoon: "in the afternoon",
					evening: "in the evening",
					night: "at night"
				},
				abbreviated: {
					am: "AM",
					pm: "PM",
					midnight: "midnight",
					noon: "noon",
					morning: "in the morning",
					afternoon: "in the afternoon",
					evening: "in the evening",
					night: "at night"
				},
				wide: {
					am: "a.m.",
					pm: "p.m.",
					midnight: "midnight",
					noon: "noon",
					morning: "in the morning",
					afternoon: "in the afternoon",
					evening: "in the evening",
					night: "at night"
				}
			},
			defaultFormattingWidth: "wide"
		})
	};

	function l(e) {
		return (t, a = {}) => {
			let n, r = a.width,
				i = r && e.matchPatterns[r] || e.matchPatterns[e.defaultMatchWidth],
				o = t.match(i);
			if (!o) return null;
			let s = o[0],
				l = r && e.parsePatterns[r] || e.parsePatterns[e.defaultParseWidth],
				u = Array.isArray(l) ? function(e, t) {
					for (let a = 0; a < e.length; a++)
						if (t(e[a])) return a
				}(l, e => e.test(s)) : function(e, t) {
					for (let a in e)
						if (Object.prototype.hasOwnProperty.call(e, a) && t(e[a])) return a
				}(l, e => e.test(s));
			return n = e.valueCallback ? e.valueCallback(u) : u, {
				value: n = a.valueCallback ? a.valueCallback(n) : n,
				rest: t.slice(s.length)
			}
		}
	}
	let u = {
		ordinalNumber: (t = {
			matchPattern: /^(\d+)(th|st|nd|rd)?/i,
			parsePattern: /\d+/i,
			valueCallback: e => parseInt(e, 10)
		}, (e, a = {}) => {
			let n = e.match(t.matchPattern);
			if (!n) return null;
			let r = n[0],
				i = e.match(t.parsePattern);
			if (!i) return null;
			let o = t.valueCallback ? t.valueCallback(i[0]) : i[0];
			return {
				value: o = a.valueCallback ? a.valueCallback(o) : o,
				rest: e.slice(r.length)
			}
		}),
		era: l({
			matchPatterns: {
				narrow: /^(b|a)/i,
				abbreviated: /^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,
				wide: /^(before christ|before common era|anno domini|common era)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/^b/i, /^(a|c)/i]
			},
			defaultParseWidth: "any"
		}),
		quarter: l({
			matchPatterns: {
				narrow: /^[1234]/i,
				abbreviated: /^q[1234]/i,
				wide: /^[1234](th|st|nd|rd)? quarter/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				any: [/1/i, /2/i, /3/i, /4/i]
			},
			defaultParseWidth: "any",
			valueCallback: e => e + 1
		}),
		month: l({
			matchPatterns: {
				narrow: /^[jfmasond]/i,
				abbreviated: /^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,
				wide: /^(january|february|march|april|may|june|july|august|september|october|november|december)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^j/i, /^f/i, /^m/i, /^a/i, /^m/i, /^j/i, /^j/i, /^a/i, /^s/i, /^o/i, /^n/i, /^d/i],
				any: [/^ja/i, /^f/i, /^mar/i, /^ap/i, /^may/i, /^jun/i, /^jul/i, /^au/i, /^s/i, /^o/i, /^n/i, /^d/i]
			},
			defaultParseWidth: "any"
		}),
		day: l({
			matchPatterns: {
				narrow: /^[smtwf]/i,
				short: /^(su|mo|tu|we|th|fr|sa)/i,
				abbreviated: /^(sun|mon|tue|wed|thu|fri|sat)/i,
				wide: /^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i
			},
			defaultMatchWidth: "wide",
			parsePatterns: {
				narrow: [/^s/i, /^m/i, /^t/i, /^w/i, /^t/i, /^f/i, /^s/i],
				any: [/^su/i, /^m/i, /^tu/i, /^w/i, /^th/i, /^f/i, /^sa/i]
			},
			defaultParseWidth: "any"
		}),
		dayPeriod: l({
			matchPatterns: {
				narrow: /^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,
				any: /^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i
			},
			defaultMatchWidth: "any",
			parsePatterns: {
				any: {
					am: /^a/i,
					pm: /^p/i,
					midnight: /^mi/i,
					noon: /^no/i,
					morning: /morning/i,
					afternoon: /afternoon/i,
					evening: /evening/i,
					night: /night/i
				}
			},
			defaultParseWidth: "any"
		})
	};
	e.s(["f", 0, {
		code: "en-US",
		formatDistance: (e, t, n) => {
			let r, i = a[e];
			if (r = "string" == typeof i ? i : 1 === t ? i.one : i.other.replace("{{count}}", t.toString()), n?.addSuffix)
				if (n.comparison && n.comparison > 0) return "in " + r;
				else return r + " ago";
			return r
		},
		formatLong: r,
		formatRelative: (e, t, a, n) => i[e],
		localize: s,
		match: u,
		options: {
			weekStartsOn: 0,
			firstWeekContainsDate: 1
		}
	}], 618508);
	let d = {};
	e.s(["f", 0, function() {
		return d
	}], 893890)
}, 110430, e => {
	"use strict";
	var t = e.i(427592);
	e.s(["f", () => t.f])
}, 195907, e => {
	"use strict";
	var t = e.i(55e3);
	let a = {
		name: "copy",
		size: 24,
		node: [
			["rect", {
				width: "14",
				height: "14",
				x: "8",
				y: "8",
				rx: "2",
				ry: "2",
				key: "17jyea"
			}],
			["path", {
				d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
				key: "zix9uf"
			}]
		]
	};
	a.node;
	let n = (0, t.f)(a);
	e.s(["f", 0, n], 195907)
}, 969266, e => {
	"use strict";
	var t = e.i(55e3);
	let a = {
		name: "key-round",
		size: 24,
		node: [
			["path", {
				d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
				key: "1s6t7t"
			}],
			["circle", {
				cx: "16.5",
				cy: "7.5",
				r: ".5",
				fill: "currentColor",
				key: "w0ekpg"
			}]
		]
	};
	a.node;
	let n = (0, t.f)(a);
	e.s(["f", 0, n], 969266)
}, 73575, e => {
	"use strict";
	var t = e.i(55e3);
	let a = {
		name: "pencil",
		size: 24,
		node: [
			["path", {
				d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
				key: "1a8usu"
			}],
			["path", {
				d: "m15 5 4 4",
				key: "1mk7zo"
			}]
		]
	};
	a.node;
	let n = (0, t.f)(a);
	e.s(["f", 0, n], 73575)
}, 61993, e => {
	"use strict";
	var t = e.i(55e3);
	let a = {
		name: "trash",
		size: 24,
		node: [
			["path", {
				d: "M10 11v6",
				key: "nco0om"
			}],
			["path", {
				d: "M14 11v6",
				key: "outv1u"
			}],
			["path", {
				d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
				key: "miytrc"
			}],
			["path", {
				d: "M3 6h18",
				key: "d0wm0j"
			}],
			["path", {
				d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
				key: "e791ji"
			}]
		],
		aliases: ["trash-2"]
	};
	a.node;
	let n = (0, t.f)(a);
	e.s(["f", 0, n], 61993)
}, 200734, e => {
	"use strict";
	var t = e.i(55e3);
	let a = {
		name: "triangle-exclamation-point",
		size: 24,
		node: [
			["path", {
				d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
				key: "wmoenq"
			}],
			["path", {
				d: "M12 9v4",
				key: "juzpu7"
			}],
			["path", {
				d: "M12 17h.01",
				key: "p32p05"
			}]
		],
		aliases: ["alert-triangle", "triangle-alert"]
	};
	a.node;
	let n = (0, t.f)(a);
	e.s(["f", 0, n], 200734)
}, 426682, e => {
	"use strict";
	var t = e.i(377698);
	e.s(["z", 0, t])
}]);