(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 379797, 848148, e => {
	"use strict";
	var t = e.i(170380),
		r = e => e instanceof Date,
		a = e => null == e,
		l = e => !a(e) && !Array.isArray(e) && "object" == typeof e && !r(e),
		i = e => l(e) && e.target ? "checkbox" === e.target.type ? e.target.checked : "file" === e.target.type ? e.target.files : e.target.value : e;
	let s = /[.[\]'"]/;
	var n = e => e.split(s).filter(Boolean),
		u = (e, t) => t.split(".").some((t, r, a) => !isNaN(Number(t)) && e.has(a.slice(0, r).join("."))),
		o = "u" > typeof window && void 0 !== window.HTMLElement && "u" > typeof document;

	function d(e) {
		if (null === e || "object" != typeof e) return e;
		if (e instanceof Date) return new Date(e);
		let t = "u" > typeof Blob && e instanceof Blob,
			r = "u" > typeof FileList && e instanceof FileList;
		if (o && (t || r)) return e;
		let a = Array.isArray(e),
			l = Object.getPrototypeOf(e);
		if (!a && l && l.constructor !== Object) return e;
		let i = a ? Array(e.length) : Object.create(l);
		for (let t in e) Object.prototype.hasOwnProperty.call(e, t) && (i[t] = d(e[t]));
		return i
	}
	let f = "blur",
		c = "trigger",
		y = "onChange",
		m = "onSubmit",
		p = {
			max: "max",
			min: "min",
			maxLength: "maxLength",
			minLength: "minLength",
			pattern: "pattern",
			required: "required",
			validate: "validate"
		},
		h = [p.required, p.min, p.max, p.minLength, p.maxLength, p.pattern, p.validate],
		v = "form",
		g = "root",
		b = ["__proto__", "constructor", "prototype"],
		_ = /^\w*$/;
	var V = e => void 0 === e,
		A = (e, t, r) => {
			if (!t || !l(e)) return r;
			let i = _.test(t) ? [t] : n(t);
			if (i.some(e => b.includes(e))) return r;
			let s = i.reduce((e, t) => a(e) ? void 0 : e[t], e);
			return V(s) || s === e ? V(e[t]) ? r : e[t] : s
		},
		k = e => "function" == typeof e,
		F = (e, t, r) => {
			let a = -1,
				i = _.test(t) ? [t] : n(t),
				s = i.length,
				u = s - 1;
			for (; ++a < s;) {
				let t = i[a],
					s = r;
				if (a !== u) {
					let r = e[t];
					s = l(r) || Array.isArray(r) ? r : isNaN(+i[a + 1]) ? {} : []
				}
				if (b.includes(t)) return;
				e[t] = s, e = e[t]
			}
		};
	let w = t.default.createContext(null);
	w.displayName = "HookFormControlContext";
	var x = (e, t, r, a = !0) => {
		let l = {};
		for (let i in e) Object.defineProperty(l, i, {
			get: () => ("all" !== t._proxyFormState[i] && (t._proxyFormState[i] = !a || "all"), r && (r[i] = !0), e[i])
		});
		return l
	};
	let O = o ? t.default.useLayoutEffect : t.default.useEffect;
	var S = e => a(e) || "object" != typeof e;
	let E = (e, t) => {
		let r;
		return 0 === t.length && !Array.isArray(e) && null !== Object.getPrototypeOf(e) && !(l(r = e.constructor && e.constructor.prototype) && r.hasOwnProperty("isPrototypeOf"))
	};

	function D(e, t, a = !1, i = new WeakMap) {
		if (e === t) return !0;
		if (S(e) || S(t)) return Object.is(e, t);
		if (r(e) && r(t)) return Object.is(e.getTime(), t.getTime());
		if (Array.isArray(e) && Array.isArray(t) && e.length !== t.length) return !1;
		let s = Object.keys(e),
			n = Object.keys(t);
		if (s.length !== n.length) return !1;
		if (E(e, s) || E(t, n)) return Object.is(e, t);
		if (!s.length && Array.isArray(e) !== Array.isArray(t)) return !1;
		let u = i.get(e);
		if (u && u.has(t)) return !0;
		if (u) u.add(t);
		else {
			let r = new WeakSet;
			r.add(t), i.set(e, r)
		}
		for (let n of s) {
			let s = e[n];
			if (!Object.prototype.hasOwnProperty.call(t, n)) return !1;
			if (!a || "ref" !== n) {
				let e = t[n];
				if (r(s) && r(e) || (l(s) || Array.isArray(s)) && (l(e) || Array.isArray(e)) ? !D(s, e, a, i) : !Object.is(s, e)) return !1
			}
		}
		return !0
	}

	function j(e) {
		let r = t.default.useRef(!1),
			a = t.default.useRef(!1),
			l = t.default.useRef(void 0),
			i = t.default.useRef(0);
		return i.current++, !a.current && e && (a.current = !0, l.current = d(e())), {
			resyncIfNeeded: t.default.useCallback((e, t, s) => {
				if (e && (r.current || a.current && i.current > 1)) {
					let e = t();
					D(l.current, e) || s(e)
				}
				r.current = !0
			}, []),
			snapshot: t.default.useCallback((e, t) => {
				e && (l.current = d(t()))
			}, [])
		}
	}

	function C(e) {
		let r = t.default.useContext(w),
			{
				control: a = r,
				disabled: l,
				name: i,
				exact: s
			} = e || {},
			n = () => ({
				...a._formState,
				defaultValues: a._defaultValues
			}),
			[u, o] = t.default.useState(n),
			d = t.default.useRef({
				isDirty: !1,
				isLoading: !1,
				dirtyFields: !1,
				touchedFields: !1,
				validatingFields: !1,
				isValidating: !1,
				isValid: !1,
				errors: !1
			}),
			{
				resyncIfNeeded: f,
				snapshot: c
			} = j(n);
		return O(() => {
			f(!l, n, o);
			let e = a._subscribe({
				name: i,
				formState: d.current,
				exact: s,
				callback: e => {
					l || o({
						...a._formState,
						...e,
						defaultValues: a._defaultValues
					})
				}
			});
			return () => {
				e(), c(!l, n)
			}
		}, [a, i, l, s, f, c]), t.default.useEffect(() => {
			d.current.isValid && a._setValid(!0)
		}, [a]), t.default.useMemo(() => x(u, a, d.current, !1), [u, a])
	}
	var R = e => "string" == typeof e,
		M = (e, t, r, a, l) => R(e) ? (a && t.watch.add(e), A(r, e, l)) : Array.isArray(e) ? e.map(e => (a && t.watch.add(e), A(r, e, A(l, e)))) : (a && (t.watchAll = !0), r),
		N = e => ({
			isOnSubmit: !e || e === m,
			isOnBlur: "onBlur" === e,
			isOnChange: e === y,
			isOnAll: "all" === e,
			isOnTouch: "onTouched" === e
		}),
		T = (e, t, r) => {
			if (r) return !1;
			if (t.watchAll || t.watch.has(e)) return !0;
			for (let r of t.watch)
				if (e.startsWith(r) && "." === e.charAt(r.length)) return !0;
			return !1
		};
	let L = (e, t, r) => {
		for (let a of r || Object.keys(e)) {
			if ("_f" === a) continue;
			let i = r ? A(e, a) : e[a];
			if (i) {
				let {
					_f: e
				} = i;
				if (e) {
					if (e.refs && e.refs[0] && t(e.refs[0], e.name)) return !0;
					else if (e.ref && t(e.ref, e.name)) return !0;
					else if (L(i, t)) return !0
				} else if ((l(i) || Array.isArray(i)) && L(i, t)) return !0
			}
		}
	};
	var U = (e, t, r) => {
			let a = A(e, r),
				l = Array.isArray(a) ? a : [];
			return F(l, g, t[r]), F(e, r, l), e
		},
		P = e => l(e) && !Object.keys(e).length,
		B = e => {
			if (!o) return !1;
			let t = e ? e.ownerDocument : 0;
			return e instanceof(t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement)
		},
		I = (e, t, r, a, l) => t ? {
			...r[e],
			types: {
				...r[e] && r[e].types ? r[e].types : {},
				[a]: l || !0
			}
		} : {};
	let $ = {
			value: !1,
			isValid: !1
		},
		q = {
			value: !0,
			isValid: !0
		};
	var W = e => {
		if (!Array.isArray(e)) return $;
		if (e.length > 1) {
			let t = e.filter(e => e && e.checked && !e.disabled).map(e => e.value);
			return {
				value: t,
				isValid: !!t.length
			}
		}
		let t = e[0];
		return t && t.checked && !t.disabled ? t.attributes && "value" in t.attributes ? V(t.value) || "" === t.value ? q : {
			value: t.value,
			isValid: !0
		} : q : $
	};
	let z = {
		isValid: !1,
		value: null
	};
	var H = e => Array.isArray(e) ? e.reduce((e, t) => t && t.checked && !t.disabled ? {
		isValid: !0,
		value: t.value
	} : e, z) : z;

	function K(e, t, r = "validate") {
		if (R(e) || Array.isArray(e) && e.length && e.every(R) || "boolean" == typeof e && !e) return {
			type: r,
			message: R(e) ? e : "",
			ref: t
		}
	}
	var Z = e => !l(e) || e instanceof RegExp ? {
			value: e,
			message: ""
		} : e,
		G = async (e, t, i, s, n, u) => {
			let {
				ref: o,
				refs: d,
				required: f,
				maxLength: c,
				minLength: y,
				min: m,
				max: h,
				pattern: v,
				validate: g,
				name: b,
				valueAsNumber: _,
				mount: F,
				_c: w
			} = e._f, x = A(i, b);
			if (!F || t.has(b)) return {};
			let O = d ? d[0] : o,
				S = e => {
					if (n && O.reportValidity) {
						let t = "boolean" == typeof e ? "" : e || "";
						d ? d.forEach(e => k(e.setCustomValidity) && e.setCustomValidity(t)) : O.setCustomValidity(t), O.reportValidity()
					}
				},
				E = {},
				D = !w && "radio" === o.type,
				j = !w && "checkbox" === o.type,
				C = (_ || "file" === o.type) && V(o.value) && V(x) || B(o) && "" === o.value && !w || "" === x || Array.isArray(x) && !x.length,
				M = I.bind(null, b, s, E),
				N = (e, t, r, a = p.maxLength, l = p.minLength) => {
					let i = e ? t : r;
					E[b] = {
						type: e ? a : l,
						message: i,
						ref: o,
						...M(e ? a : l, i)
					}
				};
			if (u ? !Array.isArray(x) || !x.length : f && (!(D || j) && (C || a(x)) || "boolean" == typeof x && !x || j && !W(d).isValid || D && !H(d).isValid)) {
				let {
					value: e,
					message: t
				} = R(f) ? {
					value: !!f,
					message: f
				} : Z(f);
				if (e && (E[b] = {
						type: p.required,
						message: t,
						ref: O,
						...M(p.required, t)
					}, !s)) return S(t), E
			}
			if (!C && (!a(m) || !a(h))) {
				let e, t, l = Z(h),
					i = Z(m);
				if (a(x) || r(x) || isNaN(x)) {
					let r = !w && o.valueAsDate || new Date(x),
						a = e => new Date(new Date().toDateString() + " " + e),
						s = "time" == o.type,
						n = "week" == o.type;
					R(l.value) && x && (e = s ? a(x) > a(l.value) : n ? x > l.value : r > new Date(l.value)), R(i.value) && x && (t = s ? a(x) < a(i.value) : n ? x < i.value : r < new Date(i.value))
				} else {
					let r = !w && o.valueAsNumber || (x ? +x : x);
					a(l.value) || (e = r > l.value), a(i.value) || (t = r < i.value)
				}
				if ((e || t) && (N(!!e, l.message, i.message, p.max, p.min), !s)) return S(E[b].message), E
			}
			if ((!a(c) || !a(y)) && !C && (R(x) || u && Array.isArray(x))) {
				let e = Z(c),
					t = Z(y),
					r = !a(e.value) && x.length > +e.value,
					l = !a(t.value) && x.length < +t.value;
				if ((r || l) && (N(r, e.message, t.message), !s)) return S(E[b].message), E
			}
			if (v && !C && R(x)) {
				let {
					value: e,
					message: t
				} = Z(v);
				if (e instanceof RegExp && !x.match(e) && (E[b] = {
						type: p.pattern,
						message: t,
						ref: o,
						...M(p.pattern, t)
					}, !s)) return S(t), E
			}
			if (g) {
				if (k(g)) {
					let e = K(await g(x, i), O);
					if (e && (E[b] = {
							...e,
							...M(p.validate, e.message)
						}, !s)) return S(e.message), E
				} else if (l(g)) {
					let e = {};
					for (let t in g) {
						if (!P(e) && !s) break;
						let r = K(await g[t](x, i), O, t);
						r && (e = {
							...r,
							...M(t, r.message)
						}, s || S(r.message), s && (E[b] = e))
					}
					if (!P(e) && (E[b] = {
							ref: O,
							...e
						}, !s)) return E
				}
			}
			let T = E[b];
			return S(!T || T.message), E
		}, J = e => Array.isArray(e) ? e : [e], Q = e => Array.isArray(e) ? e.filter(Boolean) : [];

	function X(e, t) {
		if (R(t) && Object.prototype.hasOwnProperty.call(e, t)) return delete e[t], e;
		let r = Array.isArray(t) ? t : _.test(t) ? [t] : n(t);
		if (r.some(e => b.includes(String(e)))) return e;
		let i = 1 === r.length ? e : function(e, t) {
				let r = t.length - 1,
					l = 0;
				for (; l < r;) {
					if (a(e)) {
						e = void 0;
						break
					}
					e = e[t[l]], l++
				}
				return e
			}(e, r),
			s = r.length - 1,
			u = r[s];
		return i && delete i[u], 0 !== s && (l(i) && P(i) || Array.isArray(i) && function(e) {
			for (let t in e)
				if (e.hasOwnProperty(t) && !V(e[t])) return !1;
			return !0
		}(i)) && X(e, r.slice(0, -1)), e
	}
	var Y = () => {
		let e = new Set,
			t = 0;
		return {
			get observers() {
				return Array.from(e)
			},
			next: r => {
				let a = e;
				for (let e of (t++, a)) e.next && e.next(r);
				a === e && t--
			},
			subscribe: r => (e.add(r), {
				unsubscribe: () => {
					t && (e = new Set(e), t = 0), e.delete(r)
				}
			}),
			unsubscribe: () => {
				e = new Set, t = 0
			}
		}
	};
	let ee = (e, t) => null !== e && "object" == typeof e && Object.prototype.hasOwnProperty.call(e, t);
	var et = (e, t) => {
			if (!t) return !1;
			let r = e;
			for (let a of _.test(t) ? [t] : n(t)) {
				if (!ee(r, a)) return ee(e, t);
				r = r[a]
			}
			return !0
		},
		er = e => B(e) && e.isConnected;

	function ea(e) {
		return Array.isArray(e) || l(e)
	}

	function el(e) {
		return Array.isArray(e) || l(e) && !(e => {
			for (let t in e)
				if (k(e[t])) return !0;
			return !1
		})(e)
	}

	function ei(e) {
		return !!(e && "_f" in e)
	}

	function es(e) {
		return Array.isArray(e) ? !e.some(e => !V(e)) : !Object.keys(e).length
	}

	function en(e, t) {
		Array.isArray(e) ? e[t] = void 0 : delete e[t]
	}

	function eu(e, t = {}, r) {
		for (let a in e) {
			let l = e[a],
				i = r && r[a];
			!el(l) || Array.isArray(l) && ei(i) ? V(l) || (t[a] = !0) : (t[a] = Array.isArray(l) ? [] : {}, eu(l, t[a], i), es(t[a]) && en(t, a))
		}
		return t
	}

	function eo(e, t, r, l) {
		for (let i in r || (r = eu(t, Array.isArray(a(t) ? e : t) ? [] : {}, l)), e) {
			let s = e[i],
				n = l && l[i];
			!el(s) || Array.isArray(s) && ei(n) ? D(s, a(t) ? void 0 : t[i]) ? en(r, i) : r[i] = !0 : (V(t) || S(r[i]) ? r[i] = eu(s, Array.isArray(s) ? [] : {}, n) : eo(s, a(t) ? {} : t[i], r[i], n), es(r[i]) && en(r, i))
		}
		return r
	}
	var ed = (e, {
		valueAsNumber: t,
		valueAsDate: r,
		setValueAs: a
	}) => V(e) ? e : t ? "" === e ? 0 / 0 : e ? +e : e : r && R(e) ? new Date(e) : a ? a(e) : e;

	function ef(e) {
		let t = e.ref;
		return "file" === t.type ? t.files : "radio" === t.type ? H(e.refs).value : "select-multiple" === t.type ? [...t.selectedOptions].map(({
			value: e
		}) => e) : "checkbox" === t.type ? W(e.refs).value : ed(t.value, e)
	}
	var ec = e => V(e) ? e : e instanceof RegExp ? e.source : l(e) ? e.value instanceof RegExp ? e.value.source : e.value : e;
	let ey = "AsyncFunction";
	var em = e => {
		if (!e || !e.validate) return !1;
		if (k(e.validate)) return e.validate.constructor.name === ey;
		if (l(e.validate)) {
			for (let t in e.validate)
				if (e.validate[t].constructor.name === ey) return !0
		}
		return !1
	};

	function ep(e, t, r) {
		let a = A(e, r);
		if (a && (a.type || a.message) || Array.isArray(a)) return {
			error: a,
			name: r
		};
		let l = r.split(".");
		for (; l.length;) {
			let a = l.join("."),
				i = A(t, a),
				s = A(e, a);
			if (i && !Array.isArray(i) && r !== a) break;
			if (s && s.type) return {
				name: a,
				error: s
			};
			if (s && s.root && s.root.type) return {
				name: `${a}.root`,
				error: s.root
			};
			l.pop()
		}
		return {
			name: r
		}
	}
	let eh = (e, t, r) => r ? e === t || e.startsWith(t + ".") : e.startsWith(t) || t.startsWith(e);
	var ev = (e, t, r) => {
		if (!e || !t || e === t) return !0;
		if (!Array.isArray(e)) return eh(e, t, r);
		for (let a of e)
			if (a && eh(a, t, r)) return !0;
		return !1
	};
	let eg = {
			mode: m,
			reValidateMode: y,
			shouldFocusError: !0
		},
		eb = {
			submitCount: 0,
			isDirty: !1,
			isReady: !1,
			isValidating: !1,
			isSubmitted: !1,
			isSubmitting: !1,
			isSubmitSuccessful: !1,
			isValid: !1,
			touchedFields: {},
			dirtyFields: {},
			validatingFields: {}
		},
		e_ = {
			mode: eg.mode,
			reValidateMode: eg.reValidateMode,
			shouldFocusError: eg.shouldFocusError,
			resolver: void 0,
			criteriaMode: void 0,
			delayError: void 0,
			shouldUnregister: void 0,
			shouldUseNativeValidation: void 0,
			context: void 0,
			progressive: void 0,
			resetOptions: void 0
		},
		eV = t.default.createContext(null);
	eV.displayName = "HookFormContext", e.s(["e", 0, e => e.render(function(e) {
		let r = t.default.useContext(w),
			{
				name: a,
				disabled: l,
				control: s = r,
				shouldUnregister: o,
				defaultValue: c,
				exact: y = !0
			} = e,
			m = u(s._names.array, a),
			p = t.default.useMemo(() => {
				let e = A(s._formValues, a, A(s._defaultValues, a, c));
				return V(e) ? function(e, t) {
					let r = n(t),
						a = e._formValues,
						l = e._defaultValues;
					for (let e = 0; e < r.length - 1; e++) {
						let t = r[e];
						if (a = null == a ? a : a[t], l = null == l ? l : l[t], null === a || null === l) return null
					}
				}(s, a) : e
			}, [s, a, c]),
			h = function(e) {
				let r = t.default.useContext(w),
					{
						control: a = r,
						name: l,
						defaultValue: i,
						disabled: s,
						exact: n,
						compute: u
					} = e || {},
					o = t.default.useRef(i),
					f = t.default.useRef(u),
					c = t.default.useRef(a),
					y = t.default.useRef(l);
				f.current = u;
				let m = () => {
						let e = a._getWatch(l, o.current);
						return f.current ? f.current(e) : e
					},
					[p, h] = t.default.useState(m),
					v = t.default.useRef(p),
					g = t.default.useCallback(e => {
						let t = M(l, a._names, e || a._formValues, !1, o.current);
						return f.current ? f.current(t) : t
					}, [a._formValues, a._names, l]),
					b = t.default.useCallback(e => {
						if (!s) {
							let t = M(l, a._names, e || a._formValues, !1, o.current);
							if (f.current) {
								let e = f.current(t);
								D(e, v.current) || (h(e), v.current = e)
							} else h(t)
						}
					}, [a._formValues, a._names, s, l]),
					{
						resyncIfNeeded: _,
						snapshot: V
					} = j(m),
					A = t.default.useRef(b);
				A.current = b;
				let k = t.default.useRef(g);
				k.current = g, O(() => {
					c.current === a && D(y.current, l) ? _(!s, () => k.current(), e => {
						let t = d(e);
						h(t), v.current = t
					}) : (c.current = a, y.current = l, A.current());
					let e = a._subscribe({
						name: l,
						formState: {
							values: !0
						},
						exact: n,
						callback: e => {
							A.current(e.values)
						}
					});
					return () => {
						e(), V(!s, () => k.current())
					}
				}, [a, n, l, s, _, V]), t.default.useEffect(() => a._removeUnmounted());
				let F = c.current !== a,
					x = y.current,
					S = t.default.useMemo(() => !F && !D(x, l), [F, l, x]);
				return (F || S) && (o.current = i), !s && (F || S) ? g() : p
			}({
				control: s,
				name: a,
				defaultValue: p,
				exact: y
			}),
			v = C({
				control: s,
				name: a,
				exact: y
			}),
			g = t.default.useRef(e),
			b = t.default.useRef(null),
			_ = t.default.useRef(s.register(a, {
				...e.rules,
				value: h,
				..."boolean" == typeof e.disabled ? {
					disabled: e.disabled
				} : {}
			}));
		g.current = e;
		let x = t.default.useMemo(() => Object.defineProperties({}, {
				invalid: {
					enumerable: !0,
					get: () => !!A(v.errors, a)
				},
				isDirty: {
					enumerable: !0,
					get: () => !!A(v.dirtyFields, a)
				},
				isTouched: {
					enumerable: !0,
					get: () => !!A(v.touchedFields, a)
				},
				isValidating: {
					enumerable: !0,
					get: () => !!A(v.validatingFields, a)
				},
				error: {
					enumerable: !0,
					get: () => A(v.errors, a)
				}
			}), [v, a]),
			S = t.default.useCallback(e => {
				let t = i(e);
				return A(s._fields, a) || (_.current = s.register(a, {
					...g.current.rules,
					value: t
				})), _.current.onChange({
					target: {
						value: i(e),
						name: a
					},
					type: "change"
				})
			}, [a, s]),
			E = t.default.useCallback(() => {
				let e = A(s._formValues, a);
				return A(s._fields, a) || (_.current = s.register(a, {
					...g.current.rules,
					value: e
				})), _.current.onBlur({
					target: {
						value: e,
						name: a
					},
					type: f
				})
			}, [a, s]),
			R = t.default.useCallback(e => {
				e && (b.current = {
					focus: () => k(e.focus) && e.focus(),
					select: () => k(e.select) && e.select(),
					setCustomValidity: t => k(e.setCustomValidity) && e.setCustomValidity(t),
					reportValidity: () => k(e.reportValidity) && e.reportValidity()
				});
				let t = A(s._fields, a);
				t && t._f && e && (t._f.ref = b.current, t._f._c = !0)
			}, [s._fields, a]),
			N = t.default.useMemo(() => ({
				name: a,
				value: h,
				..."boolean" == typeof l || v.disabled ? {
					disabled: v.disabled || l
				} : {},
				onChange: S,
				onBlur: E,
				ref: R
			}), [a, l, v.disabled, S, E, R, h]);
		return t.default.useEffect(() => {
			let e = s._options.shouldUnregister || o;
			_.current = s.register(a, {
				...g.current.rules,
				..."boolean" == typeof g.current.disabled ? {
					disabled: g.current.disabled
				} : {}
			});
			let t = (e, t) => {
				let r = A(s._fields, e);
				r && r._f && (r._f.mount = t, r._f._c = t)
			};
			if (t(a, !0), e) {
				let e = d(A(o ? s._defaultValues : s._options.values || s._defaultValues, a, A(s._options.defaultValues, a, g.current.defaultValue)));
				F(s._defaultValues, a, e), V(A(s._formValues, a)) && F(s._formValues, a, e)
			}
			if (m || s.register(a, {
					...g.current.rules,
					..."boolean" == typeof g.current.disabled ? {
						disabled: g.current.disabled
					} : {}
				}), b.current) {
				let e = A(s._fields, a);
				e && e._f && (e._f.ref = b.current)
			}
			return () => {
				(m ? e && !s._state.action : e) ? s.unregister(a): t(a, !1)
			}
		}, [a, s, m, o]), t.default.useEffect(() => {
			s._setDisabledField({
				disabled: l,
				name: a
			})
		}, [l, a, s]), t.default.useMemo(() => ({
			field: N,
			formState: v,
			fieldState: x
		}), [N, v, x])
	}(e)), "p", 0, ({
		children: e,
		watch: r,
		getValues: a,
		getErrors: l,
		getFieldState: i,
		setError: s,
		clearErrors: n,
		setValue: u,
		setValues: o,
		trigger: d,
		formState: f,
		resetField: c,
		reset: y,
		resetDefaultValues: m,
		handleSubmit: p,
		unregister: h,
		control: v,
		register: g,
		setFocus: b,
		subscribe: _
	}) => {
		let V = t.default.useMemo(() => ({
			watch: r,
			getValues: a,
			getErrors: l,
			getFieldState: i,
			setError: s,
			clearErrors: n,
			setValue: u,
			setValues: o,
			trigger: d,
			formState: f,
			resetField: c,
			reset: y,
			resetDefaultValues: m,
			handleSubmit: p,
			unregister: h,
			control: v,
			register: g,
			setFocus: b,
			subscribe: _
		}), [n, v, f, l, i, a, p, g, y, m, c, s, b, u, o, _, d, h, r]);
		return t.default.createElement(eV.Provider, {
			value: V
		}, t.default.createElement(w.Provider, {
			value: V.control
		}, e))
	}, "I", 0, I, "g", 0, A, "u", 0, F, "G", 0, function(e = {}) {
		let s = t.default.useRef(void 0),
			y = t.default.useRef(void 0),
			m = t.default.useRef(e.formControl),
			b = t.default.useRef(!1),
			w = t.default.useRef(!!e.validate),
			S = t.default.useRef(!!e.errors),
			E = t.default.useRef(!1),
			[C, I] = t.default.useState(() => ({
				...d(eb),
				isLoading: k(e.defaultValues),
				errors: e.errors || {},
				disabled: e.disabled || !1,
				defaultValues: k(e.defaultValues) ? void 0 : e.defaultValues
			}));
		if (!s.current || e.formControl && m.current !== e.formControl)
			if (m.current = e.formControl, b.current = !1, e.formControl) s.current = {
				...e.formControl,
				formState: C
			}, e.defaultValues && !k(e.defaultValues) && e.formControl.reset(e.defaultValues, e.resetOptions);
			else {
				let {
					formControl: t,
					...y
				} = function(e = {}) {
					let t = {
							...eg,
							...e
						},
						s = {
							...d(eb),
							isLoading: k(t.defaultValues),
							errors: d(t.errors) || {},
							disabled: t.disabled || !1
						},
						y = {},
						m = (l(t.defaultValues) || l(t.values)) && d(t.defaultValues || t.values) || {},
						b = t.shouldUnregister ? {} : d(m),
						w = {
							action: !1,
							actionArrayLengths: new Map,
							mount: !1,
							watch: !1,
							keepIsValid: !1
						},
						x = !1,
						O = {
							mount: new Set,
							disabled: new Set,
							unMount: new Set,
							array: new Set,
							watch: new Set,
							registerName: new Set
						},
						S = {},
						E = {},
						j = new Set,
						C = N(t.mode),
						I = N(t.reValidateMode),
						$ = {
							isDirty: !1,
							dirtyFields: !1,
							validatingFields: !1,
							touchedFields: !1,
							isValidating: !1,
							isValid: !1,
							errors: !1
						},
						q = {
							...$
						},
						W = {},
						z = (...e) => e.some(e => q[e] || W[e]),
						H = e => {
							for (let t of j)
								if (ev(t.name, e, t.exact)) return !0;
							return !1
						},
						K = {
							array: Y(),
							state: Y()
						},
						Z = 0,
						ee = 0,
						el = 0,
						ei = {},
						es = "all" === t.criteriaMode,
						en = (e, t) => r => {
							clearTimeout(E[e]), E[e] = setTimeout(t, r)
						},
						eu = e => {
							clearTimeout(E[e]), delete E[e], delete S[e]
						},
						ey = e => {
							eu(e);
							let t = `${e}.`;
							for (let e of Object.keys(S)) e.startsWith(t) && eu(e)
						},
						eh = async e => {
							if (!w.keepIsValid && !t.disabled && (z("isValid") || e)) {
								let e, r = ++Z;
								t.resolver ? (e = P((await eO()).errors), r === Z && eV()) : e = await eD({
									fields: y,
									onlyCheckValid: !0,
									eventType: "valid"
								}), r === Z && e !== s.isValid && K.state.next({
									isValid: e
								})
							}
						}, e_ = (e, t) => {
							let r = [...e];
							if (!r.some(e => e && (t ? !0 !== A(s.validatingFields, e) : et(s.validatingFields, e)))) return;
							let a = d(s.validatingFields);
							for (let e of r) e && (t ? F(a, e, !0) : X(a, e));
							D(s.validatingFields, a) || (s.validatingFields = a)
						}, eV = (e, r) => {
							!t.disabled && z("isValidating", "validatingFields") && (e_(e || O.mount, r), K.state.next({
								validatingFields: s.validatingFields,
								isValidating: !P(s.validatingFields)
							}))
						}, eA = () => {
							s.dirtyFields = eo(m, b, void 0, y)
						}, ek = (e, t) => {
							F(s.errors, e, t), s.errors = {
								...s.errors
							}, K.state.next({
								errors: s.errors
							})
						}, eF = e => _.test(e) ? [e] : n(e), ew = (e, r, l, i) => {
							let n = A(y, e);
							if (n) {
								if ((e => {
										let t = eF(e),
											r = b,
											l = m;
										for (let e = 0; e < t.length - 1; e++) {
											let i = t[e];
											if (r = a(r) ? r : r[i], l = a(l) ? l : l[i], null === r && null !== l) return !0
										}
										return !1
									})(e) || (e => {
										if (!w.actionArrayLengths.size) return !1;
										let t = eF(e),
											r = b,
											l = "",
											i = -1,
											s = 0;
										for (let e = 0; e < t.length && !a(r); e++) {
											let a = t[e];
											if (l = l ? `${l}.${a}` : a, Array.isArray(r) && +a >= r.length) return -1 !== i && (e !== i || +a < s);
											if (w.actionArrayLengths.has(l) && (i = e + 1, s = w.actionArrayLengths.get(l)), V(r = r[a]) && -1 !== i && e > i && +t[i] < s) return !0
										}
										return !1
									})(e)) return;
								let u = V(A(b, e)),
									o = A(b, e, V(l) ? A(m, e) : l),
									d = !!i && !s.isReady && (e => {
										let t;
										return "checkbox" === e.type ? e.checked !== e.defaultChecked : "select-one" === e.type || "select-multiple" === e.type ? (t = [...e.options], e.multiple || !(e.size < 2) || t.some(e => e.defaultSelected) ? t.some(e => e.selected !== e.defaultSelected) : e.selectedIndex !== t.findIndex(e => !e.disabled)) : "radio" !== e.type && "defaultValue" in e && e.value !== e.defaultValue
									})(i);
								if (V(o) || i && i.defaultChecked || d || r) {
									let t = r ? o : ef(n._f);
									V(t) && (e => {
										let t = b;
										for (let r of eF(e)) {
											if (Array.isArray(t) && +r >= t.length) return !0;
											t = t && t[r]
										}
										return !1
									})(e) || (z("dirtyFields") && !D(A(b, e), t) && (x = !0), F(b, e, t), d && ex(e, t))
								} else eR(e, o);
								w.mount && !w.action && (t.resolver && z("isValidating", "validatingFields") ? Promise.resolve().then(() => eh()) : eh(), u && s.isDirty && z("isDirty") && (ej() || (s.isDirty = !1, K.state.next({
									...s
								}))), t.shouldUnregister && u && !V(A(b, e)) && T(e, O) && (w.watch = !0))
							}
						}, ex = (e, r, a, i, n) => {
							let u = !1,
								o = !1,
								d = {
									name: e
								};
							if (!t.disabled || !0 === i) {
								if (!a || i) {
									let t = D(A(m, e), r);
									if (z("isDirty") && (o = s.isDirty, s.isDirty = d.isDirty = !t || ej(), u = o !== d.isDirty), o = !!A(s.dirtyFields, e), t) X(s.dirtyFields, e);
									else {
										let t = A(m, e),
											a = A(y, e),
											i = !(!(a && a._f) && (l(t) || Array.isArray(t))) || eo(t, r, void 0, a);
										F(s.dirtyFields, e, i)
									}
									let a = !1;
									if (x || t && (z("isDirty") ? s.isDirty : ej())) {
										x = !1;
										let e = eo(m, b, void 0, y);
										if (!D(s.dirtyFields, e)) {
											a = !0;
											var f = s.dirtyFields;
											for (let e in f) delete f[e];
											Object.assign(f, e)
										}
									}
									d.dirtyFields = s.dirtyFields, u = u || z("dirtyFields") && (a || !t !== o)
								}
								if (a) {
									let t = et(s.touchedFields, e) ? A(s.touchedFields, e) : void 0;
									t || (F(s.touchedFields, e, a), d.touchedFields = s.touchedFields, u = u || z("touchedFields") && t !== a)
								}
								u && n && K.state.next(d)
							}
							return u ? d : {}
						}, eO = async e => (eV(e, !0), await t.resolver(b, t.context, ((e, t, r, a) => {
							let l = {};
							for (let r of e) {
								let e = A(t, r);
								e && F(l, r, e._f)
							}
							return {
								criteriaMode: r,
								names: [...e],
								fields: l,
								shouldUseNativeValidation: a
							}
						})(e || O.mount, y, t.criteriaMode, t.shouldUseNativeValidation))), eS = async e => {
							let t = ee,
								r = el,
								a = e ? e.filter(e => A(y, e)) : [],
								{
									errors: i
								} = await eO(e);
							if (t !== ee) return i;
							if (eV(e), e) {
								for (let t of e) {
									if (a.includes(t) && (!A(y, t) || ei[t] > r)) {
										X(i, t);
										continue
									}
									let e = A(i, t);
									ey(t);
									let n = O.array.has(t) && l(e) && !Object.keys(e).some(e => !Number.isNaN(Number(e))),
										u = A(y, t),
										o = l(u) && Object.keys(u).some(e => "_f" !== e);
									n ? U(s.errors, {
										[t]: e
									}, t) : e && (e.type || e.message) || Array.isArray(e) || l(e) && o ? F(s.errors, t, e) : X(s.errors, t)
								}
								s.errors = {
									...s.errors
								}
							} else Object.keys(S).forEach(eu), s.errors = i;
							return i
						}, eE = async ({
							name: e,
							eventType: r
						}) => {
							if (t.validate) {
								let a = ee,
									i = await t.validate({
										formValues: b,
										formState: s,
										name: e,
										eventType: r
									});
								if (a !== ee) return !0;
								if (l(i)) {
									let e = !0;
									for (let t in eI(v), i) {
										let r = i[t];
										r && (e = !1, e$(`${v}.${t}`, {
											message: R(r.message) ? r.message : "",
											type: r.type || p.validate
										}))
									}
									return e
								}
								if (R(i) || !i) return e$(v, {
									message: i || "",
									type: p.validate
								}), !1;
								eI(v)
							}
							return !0
						}, eD = async ({
							fields: e,
							onlyCheckValid: r,
							name: a,
							eventType: l,
							context: i = {
								valid: !0,
								runRootValidation: !1
							}
						}) => {
							let n = ee;
							if (t.validate && !i.runRootValidation && (i.runRootValidation = !0, !await eE({
									name: a,
									eventType: l
								})) && (i.valid = !1, r)) return i.valid;
							for (let a in e) {
								let u = e[a];
								if (u) {
									let {
										_f: e,
										...o
									} = u;
									if (e) {
										let a = O.array.has(e.name),
											l = u._f && em(u._f),
											o = z("isValidating", "validatingFields");
										l && o && eV([e.name], !0);
										let d = el,
											f = await G(u, O.disabled, b, es, t.shouldUseNativeValidation && !r, a);
										if (n !== ee) return i.valid;
										if (l && o && eV([e.name]), !A(y, e.name) || ei[e.name] > d) continue;
										if (f[e.name] && (i.valid = !1, r) || (r || (eu(e.name), A(f, e.name) ? a ? U(s.errors, f, e.name) : F(s.errors, e.name, f[e.name]) : X(s.errors, e.name)), t.shouldUseNativeValidation && f[e.name])) break
									}
									P(o) || await eD({
										context: i,
										onlyCheckValid: r,
										fields: o,
										name: a,
										eventType: l
									})
								}
							}
							return i.valid
						}, ej = (e, t) => (e && !V(t) && F(b, e, t), !D(w.mount ? b : m, m)), eC = (e, t, r) => {
							let a = w.mount ? b : V(t) || !V(e) ? m : t;
							return M(e, O, V(e) ? {
								...a
							} : a, r, t)
						}, eR = (e, t, r = {}, l = !1, i = !1, s = !1) => {
							let n = A(y, e),
								u = t;
							if (n) {
								let r = n._f;
								r && (r.disabled || F(b, e, ed(t, r)), u = B(r.ref) && a(t) ? "" : t, "select-multiple" === r.ref.type ? [...r.ref.options].forEach(e => e.selected = u.includes(e.value)) : r.refs ? "checkbox" === r.ref.type ? r.refs.forEach(e => {
									e.defaultChecked && e.disabled || (Array.isArray(u) ? e.checked = !!u.find(t => t === e.value) : e.checked = u === e.value || !!u)
								}) : r.refs.forEach(e => e.checked = e.value === u) : "file" === r.ref.type ? r.ref.value = "" : (r.ref.value = u, r.ref.type || i || s || K.state.next({
									name: e,
									values: l ? b : H(e) ? d(b) : void 0
								})))
							}(r.shouldDirty || r.shouldTouch) && ex(e, n && n._f && !n._f.disabled && (n._f.valueAsNumber || n._f.valueAsDate || n._f.setValueAs) ? ed(t, n._f) : u, r.shouldTouch, r.shouldDirty, !i), r.shouldValidate && eP(e, {
								delayError: r.delayError
							}), r.shouldValidate && n && n._f && n._f.deps && (!Array.isArray(n._f.deps) || n._f.deps.length > 0) && eP(n._f.deps)
						}, eM = (e, t, a, i = !1, s = !1, n = !1) => {
							for (let u in t) {
								if (!Object.prototype.hasOwnProperty.call(t, u)) continue;
								let o = t[u],
									f = e + "." + u,
									c = A(y, f);
								O.array.has(f) && K.array.next({
									name: f,
									values: i ? b : d(b)
								}), (O.array.has(e) || l(o) || c && !c._f) && !r(o) ? eM(f, o, a, i, s, n) : eR(f, o, a, i, s, n)
							}
						}, eN = (e, t, r, l, i = !1) => {
							let n = A(y, e),
								u = O.array.has(e),
								o = l ? t : d(t),
								f = D(A(b, e), o);
							if (f || F(b, e, o), u) K.array.next({
								name: e,
								values: l ? b : d(b)
							}), z("isDirty", "dirtyFields") && r.shouldDirty && (eA(), s.isDirty = ej(e, o), i || K.state.next({
								name: e,
								dirtyFields: s.dirtyFields,
								isDirty: s.isDirty
							})), r.shouldValidate && eP(e, {
								delayError: r.delayError
							});
							else {
								let t = Array.isArray(o) && !o.length || P(o),
									s = !f && !i;
								!n || n._f || a(o) || t ? eR(e, o, r, l, i, s) : eM(e, o, r, l, i, s)
							}
							if (!f && !i) {
								let t = T(e, O),
									r = w.mount || t ? e : void 0,
									a = u ? [] : ((e, t) => {
										let r = t.split("."),
											a = [],
											l = r[0];
										for (let t = 1; t < r.length; l += "." + r[t++]) !isNaN(+r[t]) && e.has(l) && a.push(`${l}.${r[t]}`);
										return a
									})(O.array, e),
									i = l ? b : H(r) || a.some(H) ? d(b) : void 0;
								for (let e of (K.state.next({
										...t && s,
										name: r,
										values: i
									}), a)) K.state.next({
									name: e,
									values: i
								})
							}
						}, eT = (e, t, r = {}) => eN(e, t, r, !1), eL = async e => {
							w.mount = !0;
							let r = e.target,
								a = r.name,
								l = !0,
								n = A(y, a),
								u = el,
								o = e => {
									l = !!A(y, a) && !(ei[a] > u) && D(e, A(b, a, e))
								};
							if (n) {
								let u, x, E;
								w.keepIsValid = !1;
								let j = !1,
									R = r.type ? ef(n._f) : i(e),
									M = e.type === f || "focusout" === e.type,
									N = !((E = n._f).mount && (E.required || !V(E.required) && !1 !== E.required || !V(E.min) || !V(E.max) || !V(E.maxLength) || !V(E.minLength) || E.pattern || E.validate)) && !t.validate && !t.resolver && !A(s.errors, a) && !n._f.deps,
									L = N || (c = M, m = A(s.touchedFields, a), p = s.isSubmitted, h = I, !(v = C).isOnAll && (!p && v.isOnTouch ? !(m || c) : (p ? h.isOnBlur : v.isOnBlur) ? !c : (p ? !h.isOnChange : !v.isOnChange) || c)),
									U = T(a, O, M);
								F(b, a, d(R)), M ? r && r.readOnly || (n._f.onBlur && n._f.onBlur(e), Object.prototype.hasOwnProperty.call(S, a) && (j = !0, S[a](0))) : n._f.onChange && n._f.onChange(e);
								let B = ex(a, R, M),
									$ = !P(B) || U;
								if (M || K.state.next({
										name: a,
										type: e.type,
										...H(a) ? {
											values: d(b)
										} : {}
									}), L) return (!N || !s.isValid) && z("isValid") && ("onBlur" === t.mode ? M && eh() : M || eh()), $ && K.state.next({
									name: a,
									...U ? {} : B
								});
								if (!t.resolver && t.validate && await eE({
										name: a,
										eventType: e.type
									}), !M && U && K.state.next({
										...s
									}), t.resolver) {
									let e = ee,
										{
											errors: t
										} = await eO([a]);
									if (e !== ee) return;
									if (eV([a]), o(R), !l) {
										P(B) || K.state.next(B);
										return
									}
									let r = ep(s.errors, y, a),
										i = ep(t, y, r.name || a);
									u = i.error, a = i.name, x = P(t)
								} else {
									let r = ee,
										i = ++Z;
									if (eV([a], !0), u = (await G(n, O.disabled, b, es, t.shouldUseNativeValidation))[a], r !== ee) return;
									if (eV([a]), o(R), l) {
										if (u) x = !1;
										else if (z("isValid")) {
											if (x = await eD({
													fields: y,
													onlyCheckValid: !0,
													name: a,
													eventType: e.type
												}), r !== ee) return;
											o(R), i !== Z && (x = void 0)
										}
									}
								}
								if (l) {
									n._f.deps && (!Array.isArray(n._f.deps) || n._f.deps.length > 0) && eP(n._f.deps);
									var c, m, p, h, v, g = a,
										_ = x,
										k = u;
									let e = A(s.errors, g),
										r = z("isValid") && "boolean" == typeof _ && s.isValid !== _;
									if (t.delayError && k ? (S[g] = en(g, () => ek(g, k)), S[g](t.delayError)) : (eu(g), k ? F(s.errors, g, k) : X(s.errors, g), s.errors = {
											...s.errors
										}), (k ? !D(e, k, !0) : e) || !P(B) || r) {
										let e = {
											...B,
											...r && "boolean" == typeof _ ? {
												isValid: _
											} : {},
											errors: s.errors,
											name: g
										};
										K.state.next(e)
									}
									j && Object.prototype.hasOwnProperty.call(S, a) && S[a](0)
								}
							}
						}, eU = (e, t) => {
							if (A(s.errors, t) && e.focus) return e.focus(), 1
						}, eP = async (e, r = {}) => {
							let a, l;
							w.keepIsValid = !1;
							let i = J(e),
								n = ee;
							if (t.resolver) {
								let t = await eS(V(e) ? e : i);
								a = P(t), l = e ? !i.some(e => A(t, e)) : a
							} else e ? ((l = (await Promise.all(i.map(async e => {
								let t = A(y, e);
								return await eD({
									fields: t && t._f ? {
										[e]: t
									} : t,
									eventType: c
								})
							}))).every(Boolean)) || s.isValid) && eh() : l = a = await eD({
								fields: y,
								name: e,
								eventType: c
							});
							if (n !== ee) return l;
							if (r.delayError && t.delayError && R(e)) {
								let r = A(s.errors, e);
								r ? (X(s.errors, e), S[e] = en(e, () => ek(e, r)), S[e](t.delayError)) : eu(e)
							}
							if (r.shouldTouch)
								for (let t of e ? i : O.mount) O.array.has(t) || F(s.touchedFields, t, !0);
							return s.errors = {
								...s.errors
							}, K.state.next({
								...!R(e) || z("isValid") && a !== s.isValid ? {} : {
									name: e
								},
								...t.resolver || !e ? {
									isValid: a
								} : {},
								...r.shouldTouch && z("touchedFields") ? {
									touchedFields: s.touchedFields
								} : {},
								errors: s.errors
							}), r.shouldFocus && !l && L(y, eU, e ? i : O.mount), l
						}, eB = (e, t) => {
							let r = t || s,
								a = A(r.errors, e);
							return {
								invalid: !!a,
								isDirty: !!A(r.dirtyFields, e),
								error: a,
								isValidating: !!A(r.validatingFields, e),
								isTouched: !!A(r.touchedFields, e)
							}
						}, eI = e => {
							let t = e ? J(e) : void 0;
							t ? t.forEach(e => {
								ey(e), X(s.errors, e), s.errors = {
									...s.errors
								}, K.state.next({
									name: e,
									errors: s.errors
								})
							}) : (Object.keys(S).forEach(eu), s.errors = {}, K.state.next({
								errors: s.errors
							}))
						}, e$ = (e, t, r) => {
							ey(e);
							let a = A(y, e, {
									_f: {}
								}),
								l = a._f && a._f.ref,
								{
									ref: i,
									message: n,
									type: u,
									types: o,
									...d
								} = A(s.errors, e) || {};
							F(s.errors, e, {
								...d,
								...t,
								ref: l
							}), s.errors = {
								...s.errors
							}, K.state.next({
								name: e,
								errors: s.errors,
								isValid: !1
							}), r && r.shouldFocus && l && l.focus && l.focus()
						}, eq = e => {
							let t = {
								name: e.name,
								exact: e.exact
							};
							e.formState && e.formState.values && j.add(t);
							let {
								unsubscribe: r
							} = K.state.subscribe({
								next: t => {
									var r, a;
									let l;
									if (ev(e.name, t.name, e.exact) && (r = e.formState || q, a = e.reRenderRoot, !(l = Object.keys(t).filter(e => "name" !== e)).length || a && l.length >= Object.keys(r).length || l.find(e => r[e] === (!a || "all")))) {
										let r = t.values || {
											...b
										};
										e.callback({
											...s,
											...t,
											validatingFields: s.validatingFields,
											isValidating: s.isValidating,
											values: r,
											defaultValues: m
										})
									}
								}
							});
							return () => {
								j.delete(t), r()
							}
						}, eW = (e, r = {}) => {
							let a = e ? J(e) : O.mount;
							for (let e of (r.keepIsValidating || e_(a), a)) O.mount.delete(e), O.array.delete(e), O.disabled.delete(e), X(y, e), r.keepValue || X(b, e), r.keepError || (ey(e), X(s.errors, e)), r.keepDirty || X(s.dirtyFields, e), r.keepTouched || X(s.touchedFields, e), t.shouldUnregister || r.keepDefaultValue || X(m, e);
							r.keepError || (s.errors = {
								...s.errors
							}), j.size && K.state.next({
								values: d(b)
							}), K.state.next({
								...s,
								...r.keepDirty ? {} : {
									isDirty: ej()
								},
								...r.keepIsValidating ? {} : {
									isValidating: !P(s.validatingFields)
								}
							}), r.keepIsValid || eh()
						}, ez = ({
							disabled: e,
							name: t
						}) => {
							if ("boolean" == typeof e && w.mount || e || O.disabled.has(t)) {
								let r = O.disabled.has(t);
								e ? O.disabled.add(t) : O.disabled.delete(t), !!e !== r && w.mount && !w.action && eh()
							}
						}, eH = (e, r = {}) => {
							let a = A(y, e),
								l = "boolean" == typeof r.disabled || "boolean" == typeof t.disabled,
								i = !O.registerName.has(e) && a && a._f && !a._f.mount;
							if (a && a._f || (ei[e] = ++el), F(y, e, {
									...a || {},
									_f: {
										...a && a._f ? a._f : {
											ref: {
												name: e
											}
										},
										name: e,
										mount: !0,
										...r
									}
								}), O.mount.add(e), a && a._f) {
								let t = A(y, e);
								for (let e of h) e in r || delete t._f[e]
							}
							return a && !i ? ez({
								disabled: "boolean" == typeof r.disabled ? r.disabled : t.disabled,
								name: e
							}) : ew(e, !0, r.value), {
								...l ? {
									disabled: r.disabled || t.disabled
								} : {},
								...t.progressive ? {
									required: !!ec(r.required),
									min: ec(r.min),
									max: ec(r.max),
									minLength: ec(r.minLength),
									maxLength: ec(r.maxLength),
									pattern: ec(r.pattern)
								} : {},
								name: e,
								onChange: eL,
								onBlur: eL,
								ref: l => {
									if (l) {
										let t;
										O.registerName.add(e), eH(e, r), O.registerName.delete(e), a = A(y, e);
										let i = V(l.value) && l.querySelectorAll && l.querySelectorAll("input,select,textarea")[0] || l,
											s = "radio" === (t = i).type || "checkbox" === t.type,
											n = a._f.refs || [];
										if (s ? n.find(e => e === i) : i === a._f.ref) return;
										let u = {
											...a._f
										};
										s ? (u.refs = [...n.filter(er), i, ...Array.isArray(A(m, e)) ? [{}] : []], u.ref = {
											type: i.type,
											name: e
										}) : (u.ref = i, delete u.refs), F(y, e, {
											_f: u
										}), ew(e, !1, void 0, i)
									} else(a = A(y, e, {}))._f && (a._f.mount = !1), (t.shouldUnregister || r.shouldUnregister) && !(u(O.array, e) && w.action) && O.unMount.add(e)
								}
							}
						}, eK = () => t.shouldFocusError && !t.shouldUseNativeValidation && L(y, eU, O.mount), eZ = (e, r) => async a => {
							let l, i;
							a && (a.preventDefault && a.preventDefault(), a.persist && a.persist());
							let n = d(b);
							K.state.next({
								isSubmitting: !0
							});
							let u = ee,
								o = e => {
									throw u === ee && K.state.next({
										isSubmitting: !1
									}), e
								};
							if (t.resolver) {
								let e;
								try {
									e = await eO()
								} catch (e) {
									o(e)
								}
								let {
									errors: t,
									values: r
								} = e;
								if (u !== ee) return;
								eV(), Object.keys(S).forEach(eu), s.errors = t, n = d(r)
							} else {
								try {
									await eD({
										fields: y,
										eventType: "submit"
									})
								} catch (e) {
									o(e)
								}
								if (u !== ee) return;
								X(s.errors, g), s.errors = {
									...s.errors
								}
							}
							if (O.disabled.size)
								for (let e of O.disabled) X(n, e);
							if (P(s.errors)) {
								K.state.next({
									errors: {}
								});
								try {
									l = await e(n, a)
								} catch (e) {
									i = e
								}
							} else {
								if (r) try {
									await r({
										...s.errors
									}, a)
								} catch (e) {
									o(e)
								}
								eK(), setTimeout(eK)
							}
							if (K.state.next({
									isSubmitted: !0,
									isSubmitting: !1,
									isSubmitSuccessful: P(s.errors) && !i,
									submitCount: s.submitCount + 1,
									errors: s.errors
								}), i) throw i;
							return l
						}, eG = (e, r = {}) => {
							ee++, Z++;
							let a = e ? d(e) : m,
								l = d(a),
								i = P(e),
								n = y;
							if (Object.keys(S).forEach(eu), r.keepDefaultValues || (m = a), !r.keepValues) {
								if (r.keepDirtyValues)
									for (let e of new Set([...O.mount, ... function e(t, r, a = "", l = []) {
											for (let i in t) {
												let s = a ? `${a}.${i}` : i,
													n = t[i];
												ea(n) && ea(A(r, s)) ? e(n, r, s, l) : l.push(s)
											}
											return l
										}(eo(m, b, void 0, n), s.dirtyFields)])) {
										let t = A(s.dirtyFields, e),
											r = A(b, e),
											a = A(l, e);
										t && !V(r) ? F(l, e, r) : t || V(a) || eT(e, a)
									} else {
										if (o && V(e))
											for (let e of O.mount) {
												let t = A(y, e);
												if (t && t._f) {
													let e = Array.isArray(t._f.refs) ? t._f.refs[0] : t._f.ref;
													if (B(e)) {
														let t = e.closest("form");
														if (t) {
															t.reset();
															break
														}
													}
												}
											}
										if (r.keepFieldsRef)
											for (let e of O.mount) eT(e, A(l, e));
										else y = {}
									}
								if (t.shouldUnregister) {
									if (b = r.keepDefaultValues ? d(m) : {}, r.keepFieldsRef)
										for (let e of O.mount) F(b, e, A(l, e))
								} else b = d(l);
								K.array.next({
									values: {
										...l
									}
								}), K.state.next({
									name: void 0,
									type: void 0,
									values: {
										...l
									}
								})
							}
							O = {
								mount: r.keepDirtyValues ? O.mount : new Set,
								unMount: new Set,
								array: new Set,
								registerName: new Set,
								disabled: r.keepValues || r.keepDirtyValues || r.keepFieldsRef ? new Set([...O.disabled].filter(e => A(y, e))) : new Set,
								watch: new Set,
								watchAll: !1,
								focus: ""
							}, w.mount = !q.isValid || !!r.keepIsValid || !!r.keepDirtyValues || !t.shouldUnregister && !P(l), w.watch = !!t.shouldUnregister, w.keepIsValid = !!r.keepIsValid, w.action = !1, w.actionArrayLengths.clear(), x = !1, r.keepErrors || (s.errors = {}), K.state.next({
								submitCount: r.keepSubmitCount ? s.submitCount : 0,
								isDirty: !i && (r.keepDirty ? s.isDirty : r.keepValues ? ej() : !!(r.keepDefaultValues && e && !D(e, m))),
								isSubmitted: !!r.keepIsSubmitted && s.isSubmitted,
								dirtyFields: i ? {} : r.keepDirtyValues ? r.keepDefaultValues && b ? eo(m, b, void 0, n) : s.dirtyFields : r.keepDefaultValues && e ? eo(m, e, void 0, n) : r.keepDirty ? s.dirtyFields : r.keepValues ? eo(m, b, void 0, n) : {},
								touchedFields: r.keepTouched ? s.touchedFields : {},
								...!r.keepIsValidating && (s.isValidating || !P(s.validatingFields)) ? {
									validatingFields: {},
									isValidating: !1
								} : null,
								errors: r.keepErrors ? s.errors : {},
								isSubmitSuccessful: !!r.keepIsSubmitSuccessful && s.isSubmitSuccessful,
								isSubmitting: !1,
								defaultValues: m
							})
						}, eJ = (e, r) => eG(k(e) ? e(b) : e, {
							...t.resetOptions,
							...r
						});
					K.state.subscribe({
						next: e => {
							let {
								name: t,
								type: r,
								values: a,
								...l
							} = e;
							Object.keys(l).length && (s = {
								...s,
								...l
							})
						}
					});
					let eQ = {
						control: {
							register: eH,
							unregister: eW,
							getFieldState: eB,
							handleSubmit: eZ,
							setError: e$,
							_subscribe: eq,
							_runSchema: eO,
							_updateIsValidating: eV,
							_focusError: eK,
							_getWatch: eC,
							_getDirty: ej,
							_setValid: eh,
							_setFieldArray: (e, r = [], a, l, i = !0, n = !0) => {
								if (l && a && !t.disabled) {
									w.action = !0, w.keepIsValid = !1;
									let t = A(y, e),
										o = t && t._f,
										d = o ? Object.assign([], t) : t;
									if (w.actionArrayLengths.has(e) || w.actionArrayLengths.set(e, Array.isArray(d) ? d.length : 0), n && Array.isArray(d)) {
										let t = a(d, l.argA, l.argB) || d;
										o ? F(y, e, {
											...t,
											_f: o
										}) : i && F(y, e, t)
									}
									let f = A(s.errors, e);
									if (n && Array.isArray(f)) {
										var u;
										let t, r = f.root,
											n = a(f, l.argA, l.argB) || f;
										r && (n.root = r), i && F(s.errors, e, n), Q(t = A(u = s.errors, e)).length || t && t.root || X(u, e), s.errors = {
											...s.errors
										}
									}
									let c = A(s.touchedFields, e),
										m = n && Array.isArray(c);
									if (m) {
										let t = a(c, l.argA, l.argB);
										i && F(s.touchedFields, e, t)
									}
									let p = A(s.dirtyFields, e);
									if (n && Array.isArray(p)) {
										let t = a(p, l.argA, l.argB) || p;
										i && F(s.dirtyFields, e, t)
									}
									z("dirtyFields") ? eA() : x = !0, K.state.next({
										name: e,
										isDirty: ej(e, r),
										dirtyFields: s.dirtyFields,
										...m && {
											touchedFields: s.touchedFields
										},
										errors: s.errors,
										isValid: s.isValid
									})
								} else F(b, e, r)
							},
							_setDisabledField: ez,
							_setErrors: e => {
								Object.keys(S).forEach(eu);
								let t = !P(e);
								s.errors = d(e), K.state.next({
									errors: s.errors,
									...t ? {
										isValid: !1
									} : {}
								}), !t && w.mount && eh()
							},
							_getFieldArray: e => Q(A(w.mount ? b : m, e, t.shouldUnregister ? A(m, e, []) : [])),
							_reset: eG,
							_resetDefaultValues: () => k(t.defaultValues) && t.defaultValues().then(e => {
								eJ(e, t.resetOptions), K.state.next({
									isLoading: !1
								})
							}),
							_removeUnmounted: () => {
								for (let e of O.unMount) {
									let t = A(y, e);
									t && (t._f.refs ? t._f.refs.every(e => !er(e)) : !er(t._f.ref)) && eW(e)
								}
								O.unMount = new Set
							},
							_disableForm: e => {
								"boolean" == typeof e && (K.state.next({
									disabled: e
								}), L(y, (t, r) => {
									let a = A(y, r);
									a && (t.disabled = a._f.disabled || e, Array.isArray(a._f.refs) && a._f.refs.forEach(t => {
										t.disabled = a._f.disabled || e
									}))
								}, 0))
							},
							_subjects: K,
							_proxyFormState: q,
							get _fields() {
								return y
							},
							get _formValues() {
								return b
							},
							get _state() {
								return w
							},
							set _state(e) {
								w = e
							},
							get _defaultValues() {
								return m
							},
							get _names() {
								return O
							},
							set _names(e) {
								O = e
							},
							get _formState() {
								return s
							},
							get _options() {
								return t
							},
							set _options(e) {
								C = N((t = {
									...t,
									...e
								}).mode), I = N(t.reValidateMode), es = "all" === t.criteriaMode
							}
						},
						subscribe: e => {
							w.mount = !0;
							let t = Object.keys(e.formState || {}).filter(t => e.formState && e.formState[t]);
							for (let e of t) W[e] = (W[e] || 0) + 1;
							let r = eq({
								...e,
								formState: {
									...$,
									...e.formState
								}
							});
							return () => {
								for (let e of t.splice(0)) W[e]--;
								r()
							}
						},
						trigger: eP,
						register: eH,
						handleSubmit: eZ,
						watch: (e, t) => {
							if (k(e)) {
								let r = {};
								j.add(r);
								let {
									unsubscribe: a
								} = K.state.subscribe({
									next: r => "values" in r && e(r.values || eC(void 0, t), r)
								});
								return {
									unsubscribe: () => {
										j.delete(r), a()
									}
								}
							}
							return eC(e, t, !0)
						},
						setValue: eT,
						setValues: (e, t = {}) => {
							let r = k(e) ? e(b) : e;
							if (!D(b, r)) {
								for (let e of (b = {
										...b,
										...r
									}, new Set([...O.mount, ...O.array]))) et(r, e) && eN(e, A(r, e), t, !0, !0);
								K.state.next({
									...s,
									name: void 0,
									type: void 0,
									...j.size ? {
										values: b
									} : {}
								}), t.shouldValidate && eh()
							}
						},
						getValues: (e, t) => {
							let r = V(e) && !t ? {
								...w.mount ? b : m
							} : w.mount ? b : m;
							return t && (r = function e(t, r) {
								let a = Array.isArray(t) ? [] : {};
								for (let i in t)
									if (Object.prototype.hasOwnProperty.call(t, i)) {
										let s = t[i],
											n = r[i];
										s && (l(s) || Array.isArray(s)) && n ? a[i] = e(s, n) : t[i] && (a[i] = n)
									} return a
							}(t.dirtyFields ? s.dirtyFields : s.touchedFields, r)), V(e) ? r : R(e) ? A(r, e) : e.map(e => A(r, e))
						},
						getErrors: e => V(e) ? {
							...s.errors
						} : R(e) ? A(s.errors, e) : e.map(e => A(s.errors, e)),
						reset: eJ,
						resetField: (e, t = {}) => {
							A(y, e) && (e_([e]), V(t.defaultValue) ? eT(e, d(A(m, e))) : (eT(e, t.defaultValue), F(m, e, d(t.defaultValue))), t.keepTouched || X(s.touchedFields, e), t.keepDirty || (X(s.dirtyFields, e), s.isDirty = V(t.defaultValue) ? ej() : ej(e, d(A(m, e)))), t.keepError || (ey(e), X(s.errors, e), s.errors = {
								...s.errors
							}, eh()), K.state.next({
								...s,
								isValidating: !P(s.validatingFields)
							}))
						},
						resetDefaultValues: (e, t = {}) => {
							if (m = d(e), !t.keepDirty) {
								let e = eo(m, b, void 0, y);
								s.dirtyFields = e, s.isDirty = !P(e)
							}
							t.keepIsValid || eh(), K.state.next({
								...s,
								defaultValues: m
							})
						},
						clearErrors: eI,
						unregister: eW,
						setError: e$,
						setFocus: (e, t = {}) => {
							let r = A(y, e),
								a = r && r._f;
							if (a) {
								let e = a.refs ? a.refs[0] : a.ref;
								e.focus && setTimeout(() => {
									e.focus(), t.shouldSelect && k(e.select) && e.select()
								})
							}
						},
						getFieldState: eB
					};
					return {
						...eQ,
						formControl: eQ
					}
				}(e);
				s.current = {
					...y,
					formState: C
				}
			} let $ = s.current.control,
			q = $._options,
			W = {};
		for (let t in e_) t in q && !(t in e) && (W[t] = e_[t]);
		b.current && !e.disabled && (W.disabled = !1), $._options = {
			...W,
			...e,
			validate: e.validate
		};
		let z = () => ({
				...$._formState,
				defaultValues: $._defaultValues
			}),
			{
				resyncIfNeeded: H,
				snapshot: K
			} = j(z);
		return O(() => {
			H(!0, z, I);
			let e = $._subscribe({
				formState: $._proxyFormState,
				callback: () => I({
					...$._formState,
					defaultValues: $._defaultValues
				}),
				reRenderRoot: !0
			});
			return I(e => ({
				...e,
				isReady: !0
			})), $._formState.isReady = !0, $._subjects.state.next({
				isReady: !0
			}), () => {
				e(), K(!0, z)
			}
		}, [$, H, K]), t.default.useEffect(() => {
			$._disableForm((!b.current || !!e.disabled) && e.disabled), b.current = !!e.disabled
		}, [$, e.disabled]), t.default.useEffect(() => {
			e.mode && ($._options.mode = e.mode), e.reValidateMode && ($._options.reValidateMode = e.reValidateMode)
		}, [$, e.mode, e.reValidateMode]), t.default.useEffect(() => {
			e.errors ? ($._setErrors(e.errors), $._focusError()) : S.current && $._setErrors({}), S.current = !!e.errors
		}, [$, e.errors]), t.default.useEffect(() => {
			w.current && !e.validate && s.current && s.current.clearErrors(v), w.current = !!e.validate
		}, [e.validate]), t.default.useEffect(() => {
			e.shouldUnregister && $._subjects.state.next({
				values: $._getWatch()
			})
		}, [$, e.shouldUnregister]), t.default.useEffect(() => {
			if ($._proxyFormState.isDirty) {
				let e = $._getDirty();
				e !== C.isDirty && $._subjects.state.next({
					isDirty: e
				})
			}
		}, [$, C.isDirty]), t.default.useEffect(() => {
			e.values && !D(e.values, y.current) ? ($._reset(e.values, {
				keepFieldsRef: !0,
				...$._options.resetOptions
			}), $._options.resetOptions && $._options.resetOptions.keepIsValid || $._setValid(), y.current = e.values, I(e => ({
				...e
			}))) : $._resetDefaultValues()
		}, [$, e.values]), t.default.useEffect(() => {
			$._state.mount && (E.current || e.values) || ($._setValid(), $._state.mount = !0), E.current = !0, $._state.watch && ($._state.watch = !1, $._subjects.state.next({
				...$._formState
			})), $._removeUnmounted()
		}), s.current.formState = t.default.useMemo(() => x(C, $), [$, C]), s.current
	}, "M", 0, () => t.default.useContext(eV), "B", 0, C], 848148);
	let eA = (e, t, r) => {
			if (e && "reportValidity" in e) {
				let a = A(r, t);
				e.setCustomValidity(a && a.message || ""), e.reportValidity()
			}
		},
		ek = (e, t) => {
			for (let r in t.fields) {
				let a = t.fields[r];
				a && a.ref && "reportValidity" in a.ref ? eA(a.ref, r, e) : a && a.refs && a.refs.forEach(t => eA(t, r, e))
			}
		},
		eF = (e, t) => {
			t.shouldUseNativeValidation && ek(e, t);
			let r = {};
			for (let a in e) {
				let l = A(t.fields, a),
					i = Object.assign(e[a] || {}, {
						ref: l && l.refs ? l.refs[0] : l && l.ref
					});
				if (ew(t.names || Object.keys(e), a)) {
					let e = Object.assign({}, A(r, a));
					F(e, "root", i), F(r, a, e)
				} else F(r, a, i)
			}
			return r
		},
		ew = (e, t) => {
			let r = ex(t).replace(/[.*+?^${}()|\\]/g, "\\$&");
			return e.some(e => ex(e).match(`^${r}\\.\\d+`))
		};

	function ex(e) {
		return e.replace(/\[(\d+)]/g, ".$1").replace(/[[\]]/g, "")
	}

	function eO() {
		return (eO = Object.assign.bind()).apply(null, arguments)
	}

	function eS(e, t) {
		try {
			var r = e()
		} catch (e) {
			return t(e)
		}
		return r && r.then ? r.then(void 0, t) : r
	}
	e.s(["f", 0, function(e, t, r) {
		if (void 0 === r && (r = {}), "_zod" in e && "object" == typeof e._zod) return function(a, l, i) {
			try {
				return Promise.resolve(eS(function() {
					function l(e) {
						return i.shouldUseNativeValidation && ek({}, i), {
							errors: {},
							values: r.raw ? Object.assign({}, a) : e
						}
					}
					return "sync" === r.mode ? l(e.parse(a, t)) : Promise.resolve(e.parseAsync(a, t)).then(l)
				}, function(e) {
					var t;
					if (!(null == e || null == (t = e._zod) || null == (t = t.traits) || !t.has("$ZodError"))) return {
						values: {},
						errors: eF(function(e, t) {
							for (var r = Object.create(null); e.length;) ! function() {
								var a = e[0],
									l = a.code,
									i = a.message,
									s = a.path.join(".");
								if (!r[s])
									if ("invalid_union" === a.code && a.errors.length > 0) {
										var n, u, o = a.errors.reduce(function(e, t) {
											return t.length < e.length ? t : e
										})[0];
										r[s] = {
											message: null != (n = null == o ? void 0 : o.message) ? n : i,
											type: null != (u = null == o ? void 0 : o.code) ? u : l
										}
									} else r[s] = {
										message: i,
										type: l
									};
								if ("invalid_union" === a.code && a.errors.forEach(function(t) {
										return t.forEach(function(t) {
											return e.push(eO({}, t, {
												path: [].concat(a.path, t.path)
											}))
										})
									}), t) {
									var d = r[s].types,
										f = d && d[a.code];
									r[s] = I(s, t, r, l, f ? [].concat(f, a.message) : a.message)
								}
								e.shift()
							}();
							return r
						}(e.issues, !i.shouldUseNativeValidation && "all" === i.criteriaMode), i)
					};
					throw e
				}))
			} catch (e) {
				return Promise.reject(e)
			}
		};
		if ("_def" in e && "object" == typeof e._def) return function(a, l, i) {
			try {
				return Promise.resolve(eS(function() {
					return Promise.resolve(e["sync" === r.mode ? "parse" : "parseAsync"](a, t)).then(function(e) {
						return i.shouldUseNativeValidation && ek({}, i), {
							errors: {},
							values: r.raw ? Object.assign({}, a) : e
						}
					})
				}, function(e) {
					if (Array.isArray(null == e ? void 0 : e.issues)) return {
						values: {},
						errors: eF(function(e, t) {
							for (var r = Object.create(null); e.length;) {
								var a = e[0],
									l = a.code,
									i = a.message,
									s = a.path.join(".");
								if (!r[s])
									if ("unionErrors" in a) {
										var n, u, o = a.unionErrors.reduce(function(e, t) {
											return t.errors.length < e.errors.length ? t : e
										}).errors[0];
										r[s] = {
											message: null != (n = null == o ? void 0 : o.message) ? n : i,
											type: null != (u = null == o ? void 0 : o.code) ? u : l
										}
									} else r[s] = {
										message: i,
										type: l
									};
								if ("unionErrors" in a && a.unionErrors.forEach(function(t) {
										return t.errors.forEach(function(t) {
											return e.push(t)
										})
									}), t) {
									var d = r[s].types,
										f = d && d[a.code];
									r[s] = I(s, t, r, l, f ? [].concat(f, a.message) : a.message)
								}
								e.shift()
							}
							return r
						}(e.errors, !i.shouldUseNativeValidation && "all" === i.criteriaMode), i)
					};
					throw e
				}))
			} catch (e) {
				return Promise.reject(e)
			}
		};
		throw Error("Invalid input: not a Zod schema")
	}], 379797)
}]);