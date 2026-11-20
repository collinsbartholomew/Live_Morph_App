(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 136551, e => {
	"use strict";
	let t, i, n, r, a, s;
	var o, c, l, d, u, h, p, m, g, f, v, k, y, b, T, S, C, w, E, R, P, I, D, M, _, O, A, x, L, N, U, F, B, j, q, V, H, W, K, z, J, G, Q, Y, X, Z, $, ee, et, ei, en, er, ea, es, eo, ec, el, ed, eu, eh, ep, em, eg, ef, ev, ek, ey, eb, eT, eS, eC, ew, eE, eR, eP, eI, eD, eM, e_, eO, eA, ex, eL, eN, eU, eF, eB, ej, eq, eV, eH, eW, eK, ez, eJ, eG, eQ, eY, eX = e.i(914374),
		eZ = Object.defineProperty,
		e$ = (e, t, i) => {
			let n;
			return (n = "symbol" != typeof t ? t + "" : t) in e ? eZ(e, n, {
				enumerable: !0,
				configurable: !0,
				writable: !0,
				value: i
			}) : e[n] = i
		};
	class e0 {
		constructor() {
			e$(this, "_locking"), e$(this, "_locks"), this._locking = Promise.resolve(), this._locks = 0
		}
		isLocked() {
			return this._locks > 0
		}
		lock() {
			let e;
			this._locks += 1;
			let t = new Promise(t => e = () => {
					this._locks -= 1, t()
				}),
				i = this._locking.then(() => e);
			return this._locking = this._locking.then(() => t), i
		}
	}

	function e1(e, t) {
		if (!e) throw Error(t)
	}

	function e2(e) {
		if ("number" != typeof e) throw Error("invalid int 32: " + typeof e);
		if (!Number.isInteger(e) || e > 0x7fffffff || e < -0x80000000) throw Error("invalid int 32: " + e)
	}

	function e3(e) {
		if ("number" != typeof e) throw Error("invalid uint 32: " + typeof e);
		if (!Number.isInteger(e) || e > 0xffffffff || e < 0) throw Error("invalid uint 32: " + e)
	}

	function e4(e) {
		if ("number" != typeof e) throw Error("invalid float 32: " + typeof e);
		if (Number.isFinite(e) && (e > 34028234663852886e22 || e < -34028234663852886e22)) throw Error("invalid float 32: " + e)
	}
	let e9 = Symbol("@bufbuild/protobuf/enum-type");

	function e6(e, t, i, n) {
		e[e9] = e8(t, i.map(t => ({
			no: t.no,
			name: t.name,
			localName: e[t.no]
		})))
	}

	function e8(e, t, i) {
		let n = Object.create(null),
			r = Object.create(null),
			a = [];
		for (let e of t) {
			let t = e5(e);
			a.push(t), n[e.name] = t, r[e.no] = t
		}
		return {
			typeName: e,
			values: a,
			findName: e => n[e],
			findNumber: e => r[e]
		}
	}

	function e5(e) {
		return "localName" in e ? e : Object.assign(Object.assign({}, e), {
			localName: e.name
		})
	}
	class e7 {
		equals(e) {
			return this.getType().runtime.util.equals(this.getType(), this, e)
		}
		clone() {
			return this.getType().runtime.util.clone(this)
		}
		fromBinary(e, t) {
			let i = this.getType().runtime.bin,
				n = i.makeReadOptions(t);
			return i.readMessage(this, n.readerFactory(e), e.byteLength, n), this
		}
		fromJson(e, t) {
			let i = this.getType(),
				n = i.runtime.json,
				r = n.makeReadOptions(t);
			return n.readMessage(i, e, r, this), this
		}
		fromJsonString(e, t) {
			let i;
			try {
				i = JSON.parse(e)
			} catch (e) {
				throw Error("cannot decode ".concat(this.getType().typeName, " from JSON: ").concat(e instanceof Error ? e.message : String(e)))
			}
			return this.fromJson(i, t)
		}
		toBinary(e) {
			let t = this.getType().runtime.bin,
				i = t.makeWriteOptions(e),
				n = i.writerFactory();
			return t.writeMessage(this, n, i), n.finish()
		}
		toJson(e) {
			let t = this.getType().runtime.json,
				i = t.makeWriteOptions(e);
			return t.writeMessage(this, i)
		}
		toJsonString(e) {
			var t;
			return JSON.stringify(this.toJson(e), null, null != (t = null == e ? void 0 : e.prettySpaces) ? t : 0)
		}
		toJSON() {
			return this.toJson({
				emitDefaultValues: !0
			})
		}
		getType() {
			return Object.getPrototypeOf(this).constructor
		}
	}

	function te() {
		let e = 0,
			t = 0;
		for (let i = 0; i < 28; i += 7) {
			let n = this.buf[this.pos++];
			if (e |= (127 & n) << i, (128 & n) == 0) return this.assertBounds(), [e, t]
		}
		let i = this.buf[this.pos++];
		if (e |= (15 & i) << 28, t = (112 & i) >> 4, (128 & i) == 0) return this.assertBounds(), [e, t];
		for (let i = 3; i <= 31; i += 7) {
			let n = this.buf[this.pos++];
			if (t |= (127 & n) << i, (128 & n) == 0) return this.assertBounds(), [e, t]
		}
		throw Error("invalid varint")
	}

	function tt(e, t, i) {
		for (let n = 0; n < 28; n += 7) {
			let r = e >>> n,
				a = r >>> 7 != 0 || 0 != t,
				s = (a ? 128 | r : r) & 255;
			if (i.push(s), !a) return
		}
		let n = e >>> 28 & 15 | (7 & t) << 4,
			r = t >> 3 != 0;
		if (i.push((r ? 128 | n : n) & 255), r) {
			for (let e = 3; e < 31; e += 7) {
				let n = t >>> e,
					r = n >>> 7 != 0,
					a = (r ? 128 | n : n) & 255;
				if (i.push(a), !r) return
			}
			i.push(t >>> 31 & 1)
		}
	}

	function ti(e) {
		let t = "-" === e[0];
		t && (e = e.slice(1));
		let i = 0,
			n = 0;

		function r(t, r) {
			let a = Number(e.slice(t, r));
			n *= 1e6, (i = 1e6 * i + a) >= 0x100000000 && (n += i / 0x100000000 | 0, i %= 0x100000000)
		}
		return r(-24, -18), r(-18, -12), r(-12, -6), r(-6), t ? ta(i, n) : tr(i, n)
	}

	function tn(e, t) {
		var i = {
			lo: e >>> 0,
			hi: t >>> 0
		};
		if (e = i.lo, (t = i.hi) <= 2097151) return String(0x100000000 * t + e);
		let n = 0xffffff & e,
			r = (e >>> 24 | t << 8) & 0xffffff,
			a = t >> 16 & 65535,
			s = n + 6777216 * r + 6710656 * a,
			o = r + 8147497 * a,
			c = 2 * a;
		return s >= 1e7 && (o += Math.floor(s / 1e7), s %= 1e7), o >= 1e7 && (c += Math.floor(o / 1e7), o %= 1e7), c.toString() + ts(o) + ts(s)
	}

	function tr(e, t) {
		return {
			lo: 0 | e,
			hi: 0 | t
		}
	}

	function ta(e, t) {
		return t = ~t, e ? e = ~e + 1 : t += 1, tr(e, t)
	}
	let ts = e => {
		let t = String(e);
		return "0000000".slice(t.length) + t
	};

	function to(e, t) {
		if (e >= 0) {
			for (; e > 127;) t.push(127 & e | 128), e >>>= 7;
			t.push(e)
		} else {
			for (let i = 0; i < 9; i++) t.push(127 & e | 128), e >>= 7;
			t.push(1)
		}
	}

	function tc() {
		let e = this.buf[this.pos++],
			t = 127 & e;
		if ((128 & e) == 0 || (t |= (127 & (e = this.buf[this.pos++])) << 7, (128 & e) == 0) || (t |= (127 & (e = this.buf[this.pos++])) << 14, (128 & e) == 0) || (t |= (127 & (e = this.buf[this.pos++])) << 21, (128 & e) == 0)) return this.assertBounds(), t;
		t |= (15 & (e = this.buf[this.pos++])) << 28;
		for (let t = 5;
			(128 & e) != 0 && t < 10; t++) e = this.buf[this.pos++];
		if ((128 & e) != 0) throw Error("invalid varint");
		return this.assertBounds(), t >>> 0
	}
	let tl = function() {
		let e = new DataView(new ArrayBuffer(8));
		if ("function" == typeof BigInt && "function" == typeof e.getBigInt64 && "function" == typeof e.getBigUint64 && "function" == typeof e.setBigInt64 && "function" == typeof e.setBigUint64 && ("object" != typeof eX.default || "object" != typeof eX.default.env || "1" !== eX.default.env.BUF_BIGINT_DISABLE)) {
			let t = BigInt("-9223372036854775808"),
				i = BigInt("9223372036854775807"),
				n = BigInt("0"),
				r = BigInt("18446744073709551615");
			return {
				zero: BigInt(0),
				supported: !0,
				parse(e) {
					let n = "bigint" == typeof e ? e : BigInt(e);
					if (n > i || n < t) throw Error("int64 invalid: ".concat(e));
					return n
				},
				uParse(e) {
					let t = "bigint" == typeof e ? e : BigInt(e);
					if (t > r || t < n) throw Error("uint64 invalid: ".concat(e));
					return t
				},
				enc(t) {
					return e.setBigInt64(0, this.parse(t), !0), {
						lo: e.getInt32(0, !0),
						hi: e.getInt32(4, !0)
					}
				},
				uEnc(t) {
					return e.setBigInt64(0, this.uParse(t), !0), {
						lo: e.getInt32(0, !0),
						hi: e.getInt32(4, !0)
					}
				},
				dec: (t, i) => (e.setInt32(0, t, !0), e.setInt32(4, i, !0), e.getBigInt64(0, !0)),
				uDec: (t, i) => (e.setInt32(0, t, !0), e.setInt32(4, i, !0), e.getBigUint64(0, !0))
			}
		}
		let t = e => e1(/^-?[0-9]+$/.test(e), "int64 invalid: ".concat(e)),
			i = e => e1(/^[0-9]+$/.test(e), "uint64 invalid: ".concat(e));
		return {
			zero: "0",
			supported: !1,
			parse: e => ("string" != typeof e && (e = e.toString()), t(e), e),
			uParse: e => ("string" != typeof e && (e = e.toString()), i(e), e),
			enc: e => ("string" != typeof e && (e = e.toString()), t(e), ti(e)),
			uEnc: e => ("string" != typeof e && (e = e.toString()), i(e), ti(e)),
			dec: (e, t) => {
				let i, n, r;
				return (n = 0x80000000 & (i = tr(e, t)).hi) && (i = ta(i.lo, i.hi)), r = tn(i.lo, i.hi), n ? "-" + r : r
			},
			uDec: (e, t) => tn(e, t)
		}
	}();

	function td(e, t, i) {
		if (t === i) return !0;
		if (e == ei.BYTES) {
			if (!(t instanceof Uint8Array) || !(i instanceof Uint8Array) || t.length !== i.length) return !1;
			for (let e = 0; e < t.length; e++)
				if (t[e] !== i[e]) return !1;
			return !0
		}
		switch (e) {
			case ei.UINT64:
			case ei.FIXED64:
			case ei.INT64:
			case ei.SFIXED64:
			case ei.SINT64:
				return t == i
		}
		return !1
	}

	function tu(e, t) {
		switch (e) {
			case ei.BOOL:
				return !1;
			case ei.UINT64:
			case ei.FIXED64:
			case ei.INT64:
			case ei.SFIXED64:
			case ei.SINT64:
				return 0 == t ? tl.zero : "0";
			case ei.DOUBLE:
			case ei.FLOAT:
				return 0;
			case ei.BYTES:
				return new Uint8Array(0);
			case ei.STRING:
				return "";
			default:
				return 0
		}
	}

	function th(e, t) {
		switch (e) {
			case ei.BOOL:
				return !1 === t;
			case ei.STRING:
				return "" === t;
			case ei.BYTES:
				return t instanceof Uint8Array && !t.byteLength;
			default:
				return 0 == t
		}
	}

	function tp(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var i = 0, n = Array(t); i < t; i++) n[i] = e[i];
		return n
	}

	function tm(e, t, i) {
		var n;
		return (t = "symbol" == typeof(n = function(e, t) {
			if ("object" != typeof e || !e) return e;
			var i = e[Symbol.toPrimitive];
			if (void 0 !== i) {
				var n = i.call(e, t);
				if ("object" != typeof n) return n;
				throw TypeError("@@toPrimitive must return a primitive value.")
			}
			return ("string" === t ? String : Number)(e)
		}(t, "string")) ? n : n + "") in e ? Object.defineProperty(e, t, {
			value: i,
			enumerable: !0,
			configurable: !0,
			writable: !0
		}) : e[t] = i, e
	}

	function tg(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var i = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != i) {
				var n, r, a, s, o = [],
					c = !0,
					l = !1;
				try {
					if (a = (i = i.call(e)).next, 0 === t) {
						if (Object(i) !== i) return;
						c = !1
					} else
						for (; !(c = (n = a.call(i)).done) && (o.push(n.value), o.length !== t); c = !0);
				} catch (e) {
					l = !0, r = e
				} finally {
					try {
						if (!c && null != i.return && (s = i.return(), Object(s) !== s)) return
					} finally {
						if (l) throw r
					}
				}
				return o
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return tp(e, t);
				var i = ({}).toString.call(e).slice(8, -1);
				return "Object" === i && e.constructor && (i = e.constructor.name), "Map" === i || "Set" === i ? Array.from(e) : "Arguments" === i || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? tp(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}(o = ei || (ei = {}))[o.DOUBLE = 1] = "DOUBLE", o[o.FLOAT = 2] = "FLOAT", o[o.INT64 = 3] = "INT64", o[o.UINT64 = 4] = "UINT64", o[o.INT32 = 5] = "INT32", o[o.FIXED64 = 6] = "FIXED64", o[o.FIXED32 = 7] = "FIXED32", o[o.BOOL = 8] = "BOOL", o[o.STRING = 9] = "STRING", o[o.BYTES = 12] = "BYTES", o[o.UINT32 = 13] = "UINT32", o[o.SFIXED32 = 15] = "SFIXED32", o[o.SFIXED64 = 16] = "SFIXED64", o[o.SINT32 = 17] = "SINT32", o[o.SINT64 = 18] = "SINT64", (c = en || (en = {}))[c.BIGINT = 0] = "BIGINT", c[c.STRING = 1] = "STRING", (l = er || (er = {}))[l.Varint = 0] = "Varint", l[l.Bit64 = 1] = "Bit64", l[l.LengthDelimited = 2] = "LengthDelimited", l[l.StartGroup = 3] = "StartGroup", l[l.EndGroup = 4] = "EndGroup", l[l.Bit32 = 5] = "Bit32";
	class tf {
		constructor(e) {
			this.stack = [], this.textEncoder = null != e ? e : new TextEncoder, this.chunks = [], this.buf = []
		}
		finish() {
			this.chunks.push(new Uint8Array(this.buf));
			let e = 0;
			for (let t = 0; t < this.chunks.length; t++) e += this.chunks[t].length;
			let t = new Uint8Array(e),
				i = 0;
			for (let e = 0; e < this.chunks.length; e++) t.set(this.chunks[e], i), i += this.chunks[e].length;
			return this.chunks = [], t
		}
		fork() {
			return this.stack.push({
				chunks: this.chunks,
				buf: this.buf
			}), this.chunks = [], this.buf = [], this
		}
		join() {
			let e = this.finish(),
				t = this.stack.pop();
			if (!t) throw Error("invalid state, fork stack empty");
			return this.chunks = t.chunks, this.buf = t.buf, this.uint32(e.byteLength), this.raw(e)
		}
		tag(e, t) {
			return this.uint32((e << 3 | t) >>> 0)
		}
		raw(e) {
			return this.buf.length && (this.chunks.push(new Uint8Array(this.buf)), this.buf = []), this.chunks.push(e), this
		}
		uint32(e) {
			for (e3(e); e > 127;) this.buf.push(127 & e | 128), e >>>= 7;
			return this.buf.push(e), this
		}
		int32(e) {
			return e2(e), to(e, this.buf), this
		}
		bool(e) {
			return this.buf.push(+!!e), this
		}
		bytes(e) {
			return this.uint32(e.byteLength), this.raw(e)
		}
		string(e) {
			let t = this.textEncoder.encode(e);
			return this.uint32(t.byteLength), this.raw(t)
		}
		float(e) {
			e4(e);
			let t = new Uint8Array(4);
			return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t)
		}
		double(e) {
			let t = new Uint8Array(8);
			return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t)
		}
		fixed32(e) {
			e3(e);
			let t = new Uint8Array(4);
			return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t)
		}
		sfixed32(e) {
			e2(e);
			let t = new Uint8Array(4);
			return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t)
		}
		sint32(e) {
			return e2(e), to(e = (e << 1 ^ e >> 31) >>> 0, this.buf), this
		}
		sfixed64(e) {
			let t = new Uint8Array(8),
				i = new DataView(t.buffer),
				n = tl.enc(e);
			return i.setInt32(0, n.lo, !0), i.setInt32(4, n.hi, !0), this.raw(t)
		}
		fixed64(e) {
			let t = new Uint8Array(8),
				i = new DataView(t.buffer),
				n = tl.uEnc(e);
			return i.setInt32(0, n.lo, !0), i.setInt32(4, n.hi, !0), this.raw(t)
		}
		int64(e) {
			let t = tl.enc(e);
			return tt(t.lo, t.hi, this.buf), this
		}
		sint64(e) {
			let t = tl.enc(e),
				i = t.hi >> 31;
			return tt(t.lo << 1 ^ i, (t.hi << 1 | t.lo >>> 31) ^ i, this.buf), this
		}
		uint64(e) {
			let t = tl.uEnc(e);
			return tt(t.lo, t.hi, this.buf), this
		}
	}
	class tv {
		constructor(e, t) {
			this.varint64 = te, this.uint32 = tc, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = null != t ? t : new TextDecoder
		}
		tag() {
			let e = this.uint32(),
				t = e >>> 3,
				i = 7 & e;
			if (t <= 0 || i < 0 || i > 5) throw Error("illegal tag: field no " + t + " wire type " + i);
			return [t, i]
		}
		skip(e, t) {
			let i = this.pos;
			switch (e) {
				case er.Varint:
					for (; 128 & this.buf[this.pos++];);
					break;
				case er.Bit64:
					this.pos += 4;
				case er.Bit32:
					this.pos += 4;
					break;
				case er.LengthDelimited:
					let n = this.uint32();
					this.pos += n;
					break;
				case er.StartGroup:
					for (;;) {
						let e = tg(this.tag(), 2),
							i = e[0],
							n = e[1];
						if (n === er.EndGroup) {
							if (void 0 !== t && i !== t) throw Error("invalid end group tag");
							break
						}
						this.skip(n, i)
					}
					break;
				default:
					throw Error("cant skip wire type " + e)
			}
			return this.assertBounds(), this.buf.subarray(i, this.pos)
		}
		assertBounds() {
			if (this.pos > this.len) throw RangeError("premature EOF")
		}
		int32() {
			return 0 | this.uint32()
		}
		sint32() {
			let e = this.uint32();
			return e >>> 1 ^ -(1 & e)
		}
		int64() {
			return tl.dec(...this.varint64())
		}
		uint64() {
			return tl.uDec(...this.varint64())
		}
		sint64() {
			let e = tg(this.varint64(), 2),
				t = e[0],
				i = e[1],
				n = -(1 & t);
			return t = (t >>> 1 | (1 & i) << 31) ^ n, i = i >>> 1 ^ n, tl.dec(t, i)
		}
		bool() {
			let e = tg(this.varint64(), 2),
				t = e[0],
				i = e[1];
			return 0 !== t || 0 !== i
		}
		fixed32() {
			return this.view.getUint32((this.pos += 4) - 4, !0)
		}
		sfixed32() {
			return this.view.getInt32((this.pos += 4) - 4, !0)
		}
		fixed64() {
			return tl.uDec(this.sfixed32(), this.sfixed32())
		}
		sfixed64() {
			return tl.dec(this.sfixed32(), this.sfixed32())
		}
		float() {
			return this.view.getFloat32((this.pos += 4) - 4, !0)
		}
		double() {
			return this.view.getFloat64((this.pos += 8) - 8, !0)
		}
		bytes() {
			let e = this.uint32(),
				t = this.pos;
			return this.pos += e, this.assertBounds(), this.buf.subarray(t, t + e)
		}
		string() {
			return this.textDecoder.decode(this.bytes())
		}
	}

	function tk(e) {
		let t = e.field.localName,
			i = Object.create(null);
		return i[t] = function(e) {
			let t = e.field;
			if (t.repeated) return [];
			if (void 0 !== t.default) return t.default;
			switch (t.kind) {
				case "enum":
					return t.T.values[0].no;
				case "scalar":
					return tu(t.T, t.L);
				case "message":
					let i = t.T,
						n = new i;
					return i.fieldWrapper ? i.fieldWrapper.unwrapField(n) : n;
				case "map":
					throw "map fields are not allowed to be extensions"
			}
		}(e), [i, () => i[t]]
	}
	let ty = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
		tb = [];
	for (let e = 0; e < ty.length; e++) tb[ty[e].charCodeAt(0)] = e;
	tb[45] = ty.indexOf("+"), tb[95] = ty.indexOf("/");
	let tT = {
		dec(e) {
			let t = 3 * e.length / 4;
			"=" == e[e.length - 2] ? t -= 2 : "=" == e[e.length - 1] && (t -= 1);
			let i = new Uint8Array(t),
				n = 0,
				r = 0,
				a, s = 0;
			for (let t = 0; t < e.length; t++) {
				if (void 0 === (a = tb[e.charCodeAt(t)])) switch (e[t]) {
					case "=":
						r = 0;
					case "\n":
					case "\r":
					case "	":
					case " ":
						continue;
					default:
						throw Error("invalid base64 string.")
				}
				switch (r) {
					case 0:
						s = a, r = 1;
						break;
					case 1:
						i[n++] = s << 2 | (48 & a) >> 4, s = a, r = 2;
						break;
					case 2:
						i[n++] = (15 & s) << 4 | (60 & a) >> 2, s = a, r = 3;
						break;
					case 3:
						i[n++] = (3 & s) << 6 | a, r = 0
				}
			}
			if (1 == r) throw Error("invalid base64 string.");
			return i.subarray(0, n)
		},
		enc(e) {
			let t = "",
				i = 0,
				n, r = 0;
			for (let a = 0; a < e.length; a++) switch (n = e[a], i) {
				case 0:
					t += ty[n >> 2], r = (3 & n) << 4, i = 1;
					break;
				case 1:
					t += ty[r | n >> 4], r = (15 & n) << 2, i = 2;
					break;
				case 2:
					t += ty[r | n >> 6], t += ty[63 & n], i = 0
			}
			return i && (t += ty[r], t += "=", 1 == i && (t += "=")), t
		}
	};

	function tS(e, t) {
		let i = e.getType();
		return t.extendee.typeName === i.typeName && !!i.runtime.bin.listUnknownFields(e).find(e => e.no == t.field.no)
	}

	function tC(e, t) {
		e1(e.extendee.typeName == t.getType().typeName, "extension ".concat(e.typeName, " can only be applied to message ").concat(e.extendee.typeName))
	}

	function tw(e, t) {
		let i = e.localName;
		if (e.repeated) return t[i].length > 0;
		if (e.oneof) return t[e.oneof.localName].case === i;
		switch (e.kind) {
			case "enum":
			case "scalar":
				if (e.opt || e.req) return void 0 !== t[i];
				if ("enum" == e.kind) return t[i] !== e.T.values[0].no;
				return !th(e.T, t[i]);
			case "message":
				return void 0 !== t[i];
			case "map":
				return Object.keys(t[i]).length > 0
		}
	}

	function tE(e, t) {
		let i = e.localName,
			n = !e.opt && !e.req;
		if (e.repeated) t[i] = [];
		else if (e.oneof) t[e.oneof.localName] = {
			case: void 0
		};
		else switch (e.kind) {
			case "map":
				t[i] = {};
				break;
			case "enum":
				t[i] = n ? e.T.values[0].no : void 0;
				break;
			case "scalar":
				t[i] = n ? tu(e.T, e.L) : void 0;
				break;
			case "message":
				t[i] = void 0
		}
	}

	function tR(e, t) {
		if (null === e || "object" != typeof e || !Object.getOwnPropertyNames(e7.prototype).every(t => t in e && "function" == typeof e[t])) return !1;
		let i = e.getType();
		return null !== i && "function" == typeof i && "typeName" in i && "string" == typeof i.typeName && (void 0 === t || i.typeName == t.typeName)
	}

	function tP(e, t) {
		return tR(t) || !e.fieldWrapper ? t : e.fieldWrapper.wrapField(t)
	}
	ei.DOUBLE, ei.FLOAT, ei.INT64, ei.UINT64, ei.INT32, ei.UINT32, ei.BOOL, ei.STRING, ei.BYTES;
	let tI = {
			ignoreUnknownFields: !1
		},
		tD = {
			emitDefaultValues: !1,
			enumAsInteger: !1,
			useProtoFieldName: !1,
			prettySpaces: 0
		},
		tM = Symbol(),
		t_ = Symbol();

	function tO(e) {
		if (null === e) return "null";
		switch (typeof e) {
			case "object":
				return Array.isArray(e) ? "array" : "object";
			case "string":
				return e.length > 100 ? "string" : '"'.concat(e.split('"').join('\\"'), '"');
			default:
				return String(e)
		}
	}

	function tA(e, t, i, n, r) {
		let a = i.localName;
		if (i.repeated) {
			if (e1("map" != i.kind), null === t) return;
			if (!Array.isArray(t)) throw Error("cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(t)));
			let s = e[a];
			for (let e of t) {
				if (null === e) throw Error("cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(e)));
				switch (i.kind) {
					case "message":
						s.push(i.T.fromJson(e, n));
						break;
					case "enum":
						let t = tL(i.T, e, n.ignoreUnknownFields, !0);
						t !== t_ && s.push(t);
						break;
					case "scalar":
						try {
							s.push(tx(i.T, e, i.L, !0))
						} catch (n) {
							let t = "cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(e));
							throw n instanceof Error && n.message.length > 0 && (t += ": ".concat(n.message)), Error(t)
						}
				}
			}
		} else if ("map" == i.kind) {
			if (null === t) return;
			if ("object" != typeof t || Array.isArray(t)) throw Error("cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(t)));
			let o = e[a];
			for (let e of Object.entries(t)) {
				let a;
				var s = tg(e, 2);
				let c = s[0],
					l = s[1];
				if (null === l) throw Error("cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: map value null"));
				try {
					a = function(e, t) {
						if (e === ei.BOOL) switch (t) {
							case "true":
								t = !0;
								break;
							case "false":
								t = !1
						}
						return tx(e, t, en.BIGINT, !0).toString()
					}(i.K, c)
				} catch (n) {
					let e = "cannot decode map key for field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(t));
					throw n instanceof Error && n.message.length > 0 && (e += ": ".concat(n.message)), Error(e)
				}
				switch (i.V.kind) {
					case "message":
						o[a] = i.V.T.fromJson(l, n);
						break;
					case "enum":
						let d = tL(i.V.T, l, n.ignoreUnknownFields, !0);
						d !== t_ && (o[a] = d);
						break;
					case "scalar":
						try {
							o[a] = tx(i.V.T, l, en.BIGINT, !0)
						} catch (n) {
							let e = "cannot decode map value for field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(t));
							throw n instanceof Error && n.message.length > 0 && (e += ": ".concat(n.message)), Error(e)
						}
				}
			}
		} else switch (i.oneof && (e = e[i.oneof.localName] = {
				case: a
			}, a = "value"), i.kind) {
			case "message":
				let o = i.T;
				if (null === t && "google.protobuf.Value" != o.typeName) return;
				let c = e[a];
				tR(c) ? c.fromJson(t, n) : (e[a] = c = o.fromJson(t, n), o.fieldWrapper && !i.oneof && (e[a] = o.fieldWrapper.unwrapField(c)));
				break;
			case "enum":
				let l = tL(i.T, t, n.ignoreUnknownFields, !1);
				switch (l) {
					case tM:
						tE(i, e);
						break;
					case t_:
						break;
					default:
						e[a] = l
				}
				break;
			case "scalar":
				try {
					let n = tx(i.T, t, i.L, !1);
					n === tM ? tE(i, e) : e[a] = n
				} catch (n) {
					let e = "cannot decode field ".concat(r.typeName, ".").concat(i.name, " from JSON: ").concat(tO(t));
					throw n instanceof Error && n.message.length > 0 && (e += ": ".concat(n.message)), Error(e)
				}
		}
	}

	function tx(e, t, i, n) {
		if (null === t) return n ? tu(e, i) : tM;
		switch (e) {
			case ei.DOUBLE:
			case ei.FLOAT:
				if ("NaN" === t) return 0 / 0;
				if ("Infinity" === t) return 1 / 0;
				if ("-Infinity" === t) return -1 / 0;
				if ("" === t || "string" == typeof t && t.trim().length !== t.length || "string" != typeof t && "number" != typeof t) break;
				let r = Number(t);
				if (Number.isNaN(r) || !Number.isFinite(r)) break;
				return e == ei.FLOAT && e4(r), r;
			case ei.INT32:
			case ei.FIXED32:
			case ei.SFIXED32:
			case ei.SINT32:
			case ei.UINT32:
				let a;
				if ("number" == typeof t ? a = t : "string" == typeof t && t.length > 0 && t.trim().length === t.length && (a = Number(t)), void 0 === a) break;
				return e == ei.UINT32 || e == ei.FIXED32 ? e3(a) : e2(a), a;
			case ei.INT64:
			case ei.SFIXED64:
			case ei.SINT64:
				if ("number" != typeof t && "string" != typeof t) break;
				let s = tl.parse(t);
				return i ? s.toString() : s;
			case ei.FIXED64:
			case ei.UINT64:
				if ("number" != typeof t && "string" != typeof t) break;
				let o = tl.uParse(t);
				return i ? o.toString() : o;
			case ei.BOOL:
				if ("boolean" != typeof t) break;
				return t;
			case ei.STRING:
				if ("string" != typeof t) break;
				try {
					encodeURIComponent(t)
				} catch (e) {
					throw Error("invalid UTF8")
				}
				return t;
			case ei.BYTES:
				if ("" === t) return new Uint8Array(0);
				if ("string" != typeof t) break;
				return tT.dec(t)
		}
		throw Error()
	}

	function tL(e, t, i, n) {
		if (null === t) return "google.protobuf.NullValue" == e.typeName ? 0 : n ? e.values[0].no : tM;
		switch (typeof t) {
			case "number":
				if (Number.isInteger(t)) return t;
				break;
			case "string":
				let r = e.findName(t);
				if (void 0 !== r) return r.no;
				if (i) return t_
		}
		throw Error("cannot decode enum ".concat(e.typeName, " from JSON: ").concat(tO(t)))
	}

	function tN(e, t, i) {
		if ("map" == e.kind) {
			e1("object" == typeof t && null != t);
			let s = {},
				o = Object.entries(t);
			switch (e.V.kind) {
				case "scalar":
					for (let t of o) {
						var n = tg(t, 2);
						let i = n[0],
							r = n[1];
						s[i.toString()] = tF(e.V.T, r)
					}
					break;
				case "message":
					for (let e of o) {
						var r = tg(e, 2);
						let t = r[0],
							n = r[1];
						s[t.toString()] = n.toJson(i)
					}
					break;
				case "enum":
					let c = e.V.T;
					for (let e of o) {
						var a = tg(e, 2);
						let t = a[0],
							n = a[1];
						s[t.toString()] = tU(c, n, i.enumAsInteger)
					}
			}
			return i.emitDefaultValues || o.length > 0 ? s : void 0
		}
		if (e.repeated) {
			e1(Array.isArray(t));
			let n = [];
			switch (e.kind) {
				case "scalar":
					for (let i = 0; i < t.length; i++) n.push(tF(e.T, t[i]));
					break;
				case "enum":
					for (let r = 0; r < t.length; r++) n.push(tU(e.T, t[r], i.enumAsInteger));
					break;
				case "message":
					for (let e = 0; e < t.length; e++) n.push(t[e].toJson(i))
			}
			return i.emitDefaultValues || n.length > 0 ? n : void 0
		}
		switch (e.kind) {
			case "scalar":
				return tF(e.T, t);
			case "enum":
				return tU(e.T, t, i.enumAsInteger);
			case "message":
				return tP(e.T, t).toJson(i)
		}
	}

	function tU(e, t, i) {
		var n;
		if (e1("number" == typeof t), "google.protobuf.NullValue" == e.typeName) return null;
		if (i) return t;
		let r = e.findNumber(t);
		return null != (n = null == r ? void 0 : r.name) ? n : t
	}

	function tF(e, t) {
		switch (e) {
			case ei.INT32:
			case ei.SFIXED32:
			case ei.SINT32:
			case ei.FIXED32:
			case ei.UINT32:
				return e1("number" == typeof t), t;
			case ei.FLOAT:
			case ei.DOUBLE:
				if (e1("number" == typeof t), Number.isNaN(t)) return "NaN";
				if (1 / 0 === t) return "Infinity";
				if (-1 / 0 === t) return "-Infinity";
				return t;
			case ei.STRING:
				return e1("string" == typeof t), t;
			case ei.BOOL:
				return e1("boolean" == typeof t), t;
			case ei.UINT64:
			case ei.FIXED64:
			case ei.INT64:
			case ei.SFIXED64:
			case ei.SINT64:
				return e1("bigint" == typeof t || "string" == typeof t || "number" == typeof t), t.toString();
			case ei.BYTES:
				return e1(t instanceof Uint8Array), tT.enc(t)
		}
	}
	let tB = Symbol("@bufbuild/protobuf/unknown-fields"),
		tj = {
			readUnknownFields: !0,
			readerFactory: e => new tv(e)
		},
		tq = {
			writeUnknownFields: !0,
			writerFactory: () => new tf
		};

	function tV(e, t, i, n, r) {
		let a = i.repeated,
			s = i.localName;
		switch (i.oneof && ((e = e[i.oneof.localName]).case != s && delete e.value, e.case = s, s = "value"), i.kind) {
			case "scalar":
			case "enum":
				let o = "enum" == i.kind ? ei.INT32 : i.T,
					c = tK;
				if ("scalar" == i.kind && i.L > 0 && (c = tW), a) {
					let i = e[s];
					if (n == er.LengthDelimited && o != ei.STRING && o != ei.BYTES) {
						let e = t.uint32() + t.pos;
						for (; t.pos < e;) i.push(c(t, o))
					} else i.push(c(t, o))
				} else e[s] = c(t, o);
				break;
			case "message":
				let l = i.T;
				a ? e[s].push(tH(t, new l, r, i)) : tR(e[s]) ? tH(t, e[s], r, i) : (e[s] = tH(t, new l, r, i), !l.fieldWrapper || i.oneof || i.repeated || (e[s] = l.fieldWrapper.unwrapField(e[s])));
				break;
			case "map":
				let d = tg(function(e, t, i) {
						let n, r, a = t.uint32(),
							s = t.pos + a;
						for (; t.pos < s;) switch (tg(t.tag(), 1)[0]) {
							case 1:
								n = tK(t, e.K);
								break;
							case 2:
								switch (e.V.kind) {
									case "scalar":
										r = tK(t, e.V.T);
										break;
									case "enum":
										r = t.int32();
										break;
									case "message":
										r = tH(t, new e.V.T, i, void 0)
								}
						}
						if (void 0 === n && (n = tu(e.K, en.BIGINT)), "string" != typeof n && "number" != typeof n && (n = n.toString()), void 0 === r) switch (e.V.kind) {
							case "scalar":
								r = tu(e.V.T, en.BIGINT);
								break;
							case "enum":
								r = e.V.T.values[0].no;
								break;
							case "message":
								r = new e.V.T
						}
						return [n, r]
					}(i, t, r), 2),
					u = d[0],
					h = d[1];
				e[s][u] = h
		}
	}

	function tH(e, t, i, n) {
		let r = t.getType().runtime.bin,
			a = null == n ? void 0 : n.delimited;
		return r.readMessage(t, e, a ? n.no : e.uint32(), i, a), t
	}

	function tW(e, t) {
		let i = tK(e, t);
		return "bigint" == typeof i ? i.toString() : i
	}

	function tK(e, t) {
		switch (t) {
			case ei.STRING:
				return e.string();
			case ei.BOOL:
				return e.bool();
			case ei.DOUBLE:
				return e.double();
			case ei.FLOAT:
				return e.float();
			case ei.INT32:
				return e.int32();
			case ei.INT64:
				return e.int64();
			case ei.UINT64:
				return e.uint64();
			case ei.FIXED64:
				return e.fixed64();
			case ei.BYTES:
				return e.bytes();
			case ei.FIXED32:
				return e.fixed32();
			case ei.SFIXED32:
				return e.sfixed32();
			case ei.SFIXED64:
				return e.sfixed64();
			case ei.SINT64:
				return e.sint64();
			case ei.UINT32:
				return e.uint32();
			case ei.SINT32:
				return e.sint32()
		}
	}

	function tz(e, t, i, n) {
		e1(void 0 !== t);
		let r = e.repeated;
		switch (e.kind) {
			case "scalar":
			case "enum":
				let a = "enum" == e.kind ? ei.INT32 : e.T;
				if (r)
					if (e1(Array.isArray(t)), e.packed) ! function(e, t, i, n) {
						if (!n.length) return;
						e.tag(i, er.LengthDelimited).fork();
						let r = tg(tQ(t), 2)[1];
						for (let t = 0; t < n.length; t++) e[r](n[t]);
						e.join()
					}(i, a, e.no, t);
					else
						for (let n of t) tG(i, a, e.no, n);
				else tG(i, a, e.no, t);
				break;
			case "message":
				if (r)
					for (let r of (e1(Array.isArray(t)), t)) tJ(i, n, e, r);
				else tJ(i, n, e, t);
				break;
			case "map":
				for (let r of (e1("object" == typeof t && null != t), Object.entries(t))) {
					var s = tg(r, 2);
					! function(e, t, i, n, r) {
						e.tag(i.no, er.LengthDelimited), e.fork();
						let a = n;
						switch (i.K) {
							case ei.INT32:
							case ei.FIXED32:
							case ei.UINT32:
							case ei.SFIXED32:
							case ei.SINT32:
								a = Number.parseInt(n);
								break;
							case ei.BOOL:
								e1("true" == n || "false" == n), a = "true" == n
						}
						switch (tG(e, i.K, 1, a), i.V.kind) {
							case "scalar":
								tG(e, i.V.T, 2, r);
								break;
							case "enum":
								tG(e, ei.INT32, 2, r);
								break;
							case "message":
								e1(void 0 !== r), e.tag(2, er.LengthDelimited).bytes(r.toBinary(t))
						}
						e.join()
					}(i, n, e, s[0], s[1])
				}
		}
	}

	function tJ(e, t, i, n) {
		let r = tP(i.T, n);
		i.delimited ? e.tag(i.no, er.StartGroup).raw(r.toBinary(t)).tag(i.no, er.EndGroup) : e.tag(i.no, er.LengthDelimited).bytes(r.toBinary(t))
	}

	function tG(e, t, i, n) {
		e1(void 0 !== n);
		let r = tg(tQ(t), 2),
			a = r[0],
			s = r[1];
		e.tag(i, a)[s](n)
	}

	function tQ(e) {
		let t = er.Varint;
		switch (e) {
			case ei.BYTES:
			case ei.STRING:
				t = er.LengthDelimited;
				break;
			case ei.DOUBLE:
			case ei.FIXED64:
			case ei.SFIXED64:
				t = er.Bit64;
				break;
			case ei.FIXED32:
			case ei.SFIXED32:
			case ei.FLOAT:
				t = er.Bit32
		}
		return [t, ei[e].toLowerCase()]
	}

	function tY(e) {
		if (void 0 === e) return e;
		if (tR(e)) return e.clone();
		if (e instanceof Uint8Array) {
			let t = new Uint8Array(e.byteLength);
			return t.set(e), t
		}
		return e
	}

	function tX(e) {
		return e instanceof Uint8Array ? e : new Uint8Array(e)
	}
	class tZ {
		constructor(e, t) {
			this._fields = e, this._normalizer = t
		}
		findJsonName(e) {
			if (!this.jsonNames) {
				let e = {};
				for (let t of this.list()) e[t.jsonName] = e[t.name] = t;
				this.jsonNames = e
			}
			return this.jsonNames[e]
		}
		find(e) {
			if (!this.numbers) {
				let e = {};
				for (let t of this.list()) e[t.no] = t;
				this.numbers = e
			}
			return this.numbers[e]
		}
		list() {
			return this.all || (this.all = this._normalizer(this._fields)), this.all
		}
		byNumber() {
			return this.numbersAsc || (this.numbersAsc = this.list().concat().sort((e, t) => e.no - t.no)), this.numbersAsc
		}
		byMember() {
			if (!this.members) {
				let e;
				this.members = [];
				let t = this.members;
				for (let i of this.list()) i.oneof ? i.oneof !== e && (e = i.oneof, t.push(e)) : t.push(i)
			}
			return this.members
		}
	}

	function t$(e, t) {
		let i = t1(e);
		return t ? i : t9(t4(i))
	}
	let t0 = t1;

	function t1(e) {
		let t = !1,
			i = [];
		for (let n = 0; n < e.length; n++) {
			let r = e.charAt(n);
			switch (r) {
				case "_":
					t = !0;
					break;
				case "0":
				case "1":
				case "2":
				case "3":
				case "4":
				case "5":
				case "6":
				case "7":
				case "8":
				case "9":
					i.push(r), t = !1;
					break;
				default:
					t && (t = !1, r = r.toUpperCase()), i.push(r)
			}
		}
		return i.join("")
	}
	let t2 = new Set(["constructor", "toString", "toJSON", "valueOf"]),
		t3 = new Set(["getType", "clone", "equals", "fromBinary", "fromJson", "fromJsonString", "toBinary", "toJson", "toJsonString", "toObject"]),
		t4 = e => {
			if (t3.has(e)) return "".concat(e, "$");
			return e
		},
		t9 = e => {
			if (t2.has(e)) return "".concat(e, "$");
			return e
		};
	class t6 {
		constructor(e) {
			this.kind = "oneof", this.repeated = !1, this.packed = !1, this.opt = !1, this.req = !1, this.default = void 0, this.fields = [], this.name = e, this.localName = t$(e, !1)
		}
		addField(e) {
			e1(e.oneof === this, "field ".concat(e.name, " not one of ").concat(this.name)), this.fields.push(e)
		}
		findField(e) {
			if (!this._lookup) {
				this._lookup = Object.create(null);
				for (let e = 0; e < this.fields.length; e++) this._lookup[this.fields[e].localName] = this.fields[e]
			}
			return this._lookup[e]
		}
	}
	let t8 = (d = e => new tZ(e, e => (function(e) {
		var t, i, n, r, a, s;
		let o, c = [];
		for (let l of "function" == typeof e ? e() : e) {
			if (l.localName = t$(l.name, void 0 !== l.oneof), l.jsonName = null != (t = l.jsonName) ? t : t0(l.name), l.repeated = null != (i = l.repeated) && i, "scalar" == l.kind && (l.L = null != (n = l.L) ? n : en.BIGINT), l.delimited = null != (r = l.delimited) && r, l.req = null != (a = l.req) && a, l.opt = null != (s = l.opt) && s, void 0 === l.packed && (l.packed = "enum" == l.kind || "scalar" == l.kind && l.T != ei.BYTES && l.T != ei.STRING), void 0 !== l.oneof) {
				let e = "string" == typeof l.oneof ? l.oneof : l.oneof.name;
				o && o.name == e || (o = new t6(e)), l.oneof = o, o.addField(l)
			}
			c.push(l)
		}
		return c
	})(e)), u = e => {
		for (let t of e.getType().fields.byMember()) {
			if (t.opt) continue;
			let i = t.localName;
			if (t.repeated) {
				e[i] = [];
				continue
			}
			switch (t.kind) {
				case "oneof":
					e[i] = {
						case: void 0
					};
					break;
				case "enum":
					e[i] = 0;
					break;
				case "map":
					e[i] = {};
					break;
				case "scalar":
					e[i] = tu(t.T, t.L)
			}
		}
	}, {
		syntax: "proto3",
		json: {
			makeReadOptions: function(e) {
				return e ? Object.assign(Object.assign({}, tI), e) : tI
			},
			makeWriteOptions: function(e) {
				return e ? Object.assign(Object.assign({}, tD), e) : tD
			},
			readMessage(e, t, i, n) {
				if (null == t || Array.isArray(t) || "object" != typeof t) throw Error("cannot decode message ".concat(e.typeName, " from JSON: ").concat(tO(t)));
				n = null != n ? n : new e;
				let r = new Map,
					a = i.typeRegistry;
				for (let o of Object.entries(t)) {
					var s = tg(o, 2);
					let t = s[0],
						c = s[1],
						l = e.fields.findJsonName(t);
					if (l) {
						if (l.oneof) {
							if (null === c && "scalar" == l.kind) continue;
							let i = r.get(l.oneof);
							if (void 0 !== i) throw Error("cannot decode message ".concat(e.typeName, ' from JSON: multiple keys for oneof "').concat(l.oneof.name, '" present: "').concat(i, '", "').concat(t, '"'));
							r.set(l.oneof, t)
						}
						tA(n, c, l, i, e)
					} else {
						let r = !1;
						if ((null == a ? void 0 : a.findExtension) && t.startsWith("[") && t.endsWith("]")) {
							let s = a.findExtension(t.substring(1, t.length - 1));
							if (s && s.extendee.typeName == e.typeName) {
								r = !0;
								let e = tg(tk(s), 2),
									t = e[0],
									a = e[1];
								tA(t, c, s.field, i, s),
									function(e, t, i, n) {
										tC(t, e);
										let r = t.runtime.bin.makeReadOptions(n),
											a = t.runtime.bin.makeWriteOptions(n);
										if (tS(e, t)) {
											let i = e.getType().runtime.bin.listUnknownFields(e).filter(e => e.no != t.field.no);
											for (let t of (e.getType().runtime.bin.discardUnknownFields(e), i)) e.getType().runtime.bin.onUnknownField(e, t.no, t.wireType, t.data)
										}
										let s = a.writerFactory(),
											o = t.field;
										o.opt || o.repeated || "enum" != o.kind && "scalar" != o.kind || (o = Object.assign(Object.assign({}, t.field), {
											opt: !0
										})), t.runtime.bin.writeField(o, i, s, a);
										let c = r.readerFactory(s.finish());
										for (; c.pos < c.len;) {
											let t = tg(c.tag(), 2),
												i = t[0],
												n = t[1],
												r = c.skip(n, i);
											e.getType().runtime.bin.onUnknownField(e, i, n, r)
										}
									}(n, s, a(), i)
							}
						}
						if (!r && !i.ignoreUnknownFields) throw Error("cannot decode message ".concat(e.typeName, ' from JSON: key "').concat(t, '" is unknown'))
					}
				}
				return n
			},
			writeMessage(e, t) {
				let i, n = e.getType(),
					r = {};
				try {
					for (i of n.fields.byNumber()) {
						if (!tw(i, e)) {
							var a;
							if (i.req) throw "required field not set";
							if (!t.emitDefaultValues || !((a = i).repeated || "map" == a.kind || !a.oneof && "message" != a.kind && !a.opt && !a.req)) continue
						}
						let n = i.oneof ? e[i.oneof.localName].value : e[i.localName],
							s = tN(i, n, t);
						void 0 !== s && (r[t.useProtoFieldName ? i.name : i.jsonName] = s)
					}
					let s = t.typeRegistry;
					if (null == s ? void 0 : s.findExtensionFor)
						for (let i of n.runtime.bin.listUnknownFields(e)) {
							let a = s.findExtensionFor(n.typeName, i.no);
							if (a && tS(e, a)) {
								let i = function(e, t, i) {
										tC(t, e);
										let n = t.runtime.bin.makeReadOptions(i),
											r = function(e, t) {
												if (!t.repeated && ("enum" == t.kind || "scalar" == t.kind)) {
													for (let i = e.length - 1; i >= 0; --i)
														if (e[i].no == t.no) return [e[i]];
													return []
												}
												return e.filter(e => e.no === t.no)
											}(e.getType().runtime.bin.listUnknownFields(e), t.field),
											a = tg(tk(t), 2),
											s = a[0],
											o = a[1];
										for (let e of r) t.runtime.bin.readField(s, n.readerFactory(e.data), t.field, e.wireType, n);
										return o()
									}(e, a, t),
									n = tN(a.field, i, t);
								void 0 !== n && (r[a.field.jsonName] = n)
							}
						}
				} catch (r) {
					let e = i ? "cannot encode field ".concat(n.typeName, ".").concat(i.name, " to JSON") : "cannot encode message ".concat(n.typeName, " to JSON"),
						t = r instanceof Error ? r.message : String(r);
					throw Error(e + (t.length > 0 ? ": ".concat(t) : ""))
				}
				return r
			},
			readScalar: (e, t, i) => tx(e, t, null != i ? i : en.BIGINT, !0),
			writeScalar(e, t, i) {
				if (void 0 !== t && (i || th(e, t))) return tF(e, t)
			},
			debug: tO
		},
		bin: {
			makeReadOptions: function(e) {
				return e ? Object.assign(Object.assign({}, tj), e) : tj
			},
			makeWriteOptions: function(e) {
				return e ? Object.assign(Object.assign({}, tq), e) : tq
			},
			listUnknownFields(e) {
				var t;
				return null != (t = e[tB]) ? t : []
			},
			discardUnknownFields(e) {
				delete e[tB]
			},
			writeUnknownFields(e, t) {
				let i = e[tB];
				if (i)
					for (let e of i) t.tag(e.no, e.wireType).raw(e.data)
			},
			onUnknownField(e, t, i, n) {
				Array.isArray(e[tB]) || (e[tB] = []), e[tB].push({
					no: t,
					wireType: i,
					data: n
				})
			},
			readMessage(e, t, i, n, r) {
				let a, s, o = e.getType(),
					c = r ? t.len : t.pos + i;
				for (; t.pos < c;) {
					var l = tg(t.tag(), 2);
					if (a = l[0], s = l[1], !0 === r && s == er.EndGroup) break;
					let i = o.fields.find(a);
					if (!i) {
						let i = t.skip(s, a);
						n.readUnknownFields && this.onUnknownField(e, a, s, i);
						continue
					}
					tV(e, t, i, s, n)
				}
				if (r && (s != er.EndGroup || a !== i)) throw Error("invalid end group tag")
			},
			readField: tV,
			writeMessage(e, t, i) {
				let n = e.getType();
				for (let r of n.fields.byNumber()) {
					if (!tw(r, e)) {
						if (r.req) throw Error("cannot encode field ".concat(n.typeName, ".").concat(r.name, " to binary: required field not set"));
						continue
					}
					let a = r.oneof ? e[r.oneof.localName].value : e[r.localName];
					tz(r, a, t, i)
				}
				return i.writeUnknownFields && this.writeUnknownFields(e, t), t
			},
			writeField(e, t, i, n) {
				void 0 !== t && tz(e, t, i, n)
			}
		},
		util: Object.assign(Object.assign({}, {
			setEnumType: e6,
			initPartial(e, t) {
				if (void 0 !== e)
					for (let n of t.getType().fields.byMember()) {
						let r = n.localName;
						if (null != e[r]) switch (n.kind) {
							case "oneof":
								let a = e[r].case;
								if (void 0 === a) continue;
								let s = n.findField(a),
									o = e[r].value;
								s && "message" == s.kind && !tR(o, s.T) ? o = new s.T(o) : s && "scalar" === s.kind && s.T === ei.BYTES && (o = tX(o)), t[r] = {
									case: a,
									value: o
								};
								break;
							case "scalar":
							case "enum":
								let c = e[r];
								n.T === ei.BYTES && (c = n.repeated ? c.map(tX) : tX(c)), t[r] = c;
								break;
							case "map":
								switch (n.V.kind) {
									case "scalar":
									case "enum":
										if (n.V.T === ei.BYTES)
											for (let n of Object.entries(e[r])) {
												var i = tg(n, 2);
												let e = i[0],
													a = i[1];
												t[r][e] = tX(a)
											} else Object.assign(t[r], e[r]);
										break;
									case "message":
										let l = n.V.T;
										for (let i of Object.keys(e[r])) {
											let n = e[r][i];
											l.fieldWrapper || (n = new l(n)), t[r][i] = n
										}
								}
								break;
							case "message":
								let d = n.T;
								if (n.repeated) t[r] = e[r].map(e => tR(e, d) ? e : new d(e));
								else {
									let i = e[r];
									d.fieldWrapper ? "google.protobuf.BytesValue" === d.typeName ? t[r] = tX(i) : t[r] = i : t[r] = tR(i, d) ? i : new d(i)
								}
						}
					}
			},
			equals: (e, t, i) => t === i || !!t && !!i && e.fields.byMember().every(e => {
				let n = t[e.localName],
					r = i[e.localName];
				if (e.repeated) {
					if (n.length !== r.length) return !1;
					switch (e.kind) {
						case "message":
							return n.every((t, i) => e.T.equals(t, r[i]));
						case "scalar":
							return n.every((t, i) => td(e.T, t, r[i]));
						case "enum":
							return n.every((e, t) => td(ei.INT32, e, r[t]))
					}
					throw Error("repeated cannot contain ".concat(e.kind))
				}
				switch (e.kind) {
					case "message":
						let a = n,
							s = r;
						return e.T.fieldWrapper && (void 0 === a || tR(a) || (a = e.T.fieldWrapper.wrapField(a)), void 0 === s || tR(s) || (s = e.T.fieldWrapper.wrapField(s))), e.T.equals(a, s);
					case "enum":
						return td(ei.INT32, n, r);
					case "scalar":
						return td(e.T, n, r);
					case "oneof":
						if (n.case !== r.case) return !1;
						let o = e.findField(n.case);
						if (void 0 === o) return !0;
						switch (o.kind) {
							case "message":
								return o.T.equals(n.value, r.value);
							case "enum":
								return td(ei.INT32, n.value, r.value);
							case "scalar":
								return td(o.T, n.value, r.value)
						}
						throw Error("oneof cannot contain ".concat(o.kind));
					case "map":
						let c = Object.keys(n).concat(Object.keys(r));
						switch (e.V.kind) {
							case "message":
								let l = e.V.T;
								return c.every(e => l.equals(n[e], r[e]));
							case "enum":
								return c.every(e => td(ei.INT32, n[e], r[e]));
							case "scalar":
								let d = e.V.T;
								return c.every(e => td(d, n[e], r[e]))
						}
				}
			}),
			clone(e) {
				let t = e.getType(),
					i = new t;
				for (let r of t.fields.byMember()) {
					let t, a = e[r.localName];
					if (r.repeated) t = a.map(tY);
					else if ("map" == r.kind)
						for (let e of (t = i[r.localName], Object.entries(a))) {
							var n = tg(e, 2);
							let i = n[0],
								r = n[1];
							t[i] = tY(r)
						} else t = "oneof" == r.kind ? r.findField(a.case) ? {
							case: a.case,
							value: tY(a.value)
						} : {
							case: void 0
						} : tY(a);
					i[r.localName] = t
				}
				for (let n of t.runtime.bin.listUnknownFields(e)) t.runtime.bin.onUnknownField(i, n.no, n.wireType, n.data);
				return i
			}
		}), {
			newFieldList: d,
			initFields: u
		}),
		makeMessageType(e, t, i) {
			var n, r;
			let a, s;
			return n = this, Object.setPrototypeOf((s = ({
				[a = null != (r = null == i ? void 0 : i.localName) ? r : e.substring(e.lastIndexOf(".") + 1)]: function(e) {
					n.util.initFields(this), n.util.initPartial(e, this)
				}
			})[a]).prototype, new e7), Object.assign(s, {
				runtime: n,
				typeName: e,
				fields: n.util.newFieldList(t),
				fromBinary: (e, t) => new s().fromBinary(e, t),
				fromJson: (e, t) => new s().fromJson(e, t),
				fromJsonString: (e, t) => new s().fromJsonString(e, t),
				equals: (e, t) => n.util.equals(s, e, t)
			}), s
		},
		makeEnum: function(e, t, i) {
			let n = {};
			for (let e of t) {
				let t = e5(e);
				n[t.localName] = t.no, n[t.no] = t.localName
			}
			return e6(n, e, t), n
		},
		makeEnumType: e8,
		getEnumType: function(e) {
			let t = e[e9];
			return e1(t, "missing enum type on enum object"), t
		},
		makeExtension(e, t, i) {
			var n;
			let r;
			return n = this, {
				typeName: e,
				extendee: t,
				get field() {
					if (!r) {
						let t = "function" == typeof i ? i() : i;
						t.name = e.split(".").pop(), t.jsonName = "[".concat(e, "]"), r = n.util.newFieldList([t]).list()[0]
					}
					return r
				},
				runtime: n
			}
		}
	});
	class t5 extends e7 {
		constructor(e) {
			super(), this.seconds = tl.zero, this.nanos = 0, t8.util.initPartial(e, this)
		}
		fromJson(e, t) {
			if ("string" != typeof e) throw Error("cannot decode google.protobuf.Timestamp from JSON: ".concat(t8.json.debug(e)));
			let i = e.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2}):([0-9]{2})(?:Z|\.([0-9]{3,9})Z|([+-][0-9][0-9]:[0-9][0-9]))$/);
			if (!i) throw Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
			let n = Date.parse(i[1] + "-" + i[2] + "-" + i[3] + "T" + i[4] + ":" + i[5] + ":" + i[6] + (i[8] ? i[8] : "Z"));
			if (Number.isNaN(n)) throw Error("cannot decode google.protobuf.Timestamp from JSON: invalid RFC 3339 string");
			if (n < Date.parse("0001-01-01T00:00:00Z") || n > Date.parse("9999-12-31T23:59:59Z")) throw Error("cannot decode message google.protobuf.Timestamp from JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
			return this.seconds = tl.parse(n / 1e3), this.nanos = 0, i[7] && (this.nanos = parseInt("1" + i[7] + "0".repeat(9 - i[7].length)) - 1e9), this
		}
		toJson(e) {
			let t = 1e3 * Number(this.seconds);
			if (t < Date.parse("0001-01-01T00:00:00Z") || t > Date.parse("9999-12-31T23:59:59Z")) throw Error("cannot encode google.protobuf.Timestamp to JSON: must be from 0001-01-01T00:00:00Z to 9999-12-31T23:59:59Z inclusive");
			if (this.nanos < 0) throw Error("cannot encode google.protobuf.Timestamp to JSON: nanos must not be negative");
			let i = "Z";
			if (this.nanos > 0) {
				let e = (this.nanos + 1e9).toString().substring(1);
				i = "000000" === e.substring(3) ? "." + e.substring(0, 3) + "Z" : "000" === e.substring(6) ? "." + e.substring(0, 6) + "Z" : "." + e + "Z"
			}
			return new Date(t).toISOString().replace(".000Z", i)
		}
		toDate() {
			return new Date(1e3 * Number(this.seconds) + Math.ceil(this.nanos / 1e6))
		}
		static now() {
			return t5.fromDate(new Date)
		}
		static fromDate(e) {
			let t = e.getTime();
			return new t5({
				seconds: tl.parse(Math.floor(t / 1e3)),
				nanos: t % 1e3 * 1e6
			})
		}
		static fromBinary(e, t) {
			return new t5().fromBinary(e, t)
		}
		static fromJson(e, t) {
			return new t5().fromJson(e, t)
		}
		static fromJsonString(e, t) {
			return new t5().fromJsonString(e, t)
		}
		static equals(e, t) {
			return t8.util.equals(t5, e, t)
		}
	}
	t5.runtime = t8, t5.typeName = "google.protobuf.Timestamp", t5.fields = t8.util.newFieldList(() => [{
		no: 1,
		name: "seconds",
		kind: "scalar",
		T: 3
	}, {
		no: 2,
		name: "nanos",
		kind: "scalar",
		T: 5
	}]);
	let t7 = t8.makeMessageType("livekit.MetricsBatch", () => [{
			no: 1,
			name: "timestamp_ms",
			kind: "scalar",
			T: 3
		}, {
			no: 2,
			name: "normalized_timestamp",
			kind: "message",
			T: t5
		}, {
			no: 3,
			name: "str_data",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 4,
			name: "time_series",
			kind: "message",
			T: ie,
			repeated: !0
		}, {
			no: 5,
			name: "events",
			kind: "message",
			T: ii,
			repeated: !0
		}]),
		ie = t8.makeMessageType("livekit.TimeSeriesMetric", () => [{
			no: 1,
			name: "label",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "participant_identity",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "track_sid",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "samples",
			kind: "message",
			T: it,
			repeated: !0
		}, {
			no: 5,
			name: "rid",
			kind: "scalar",
			T: 13
		}]),
		it = t8.makeMessageType("livekit.MetricSample", () => [{
			no: 1,
			name: "timestamp_ms",
			kind: "scalar",
			T: 3
		}, {
			no: 2,
			name: "normalized_timestamp",
			kind: "message",
			T: t5
		}, {
			no: 3,
			name: "value",
			kind: "scalar",
			T: 2
		}]),
		ii = t8.makeMessageType("livekit.EventMetric", () => [{
			no: 1,
			name: "label",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "participant_identity",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "track_sid",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "start_timestamp_ms",
			kind: "scalar",
			T: 3
		}, {
			no: 5,
			name: "end_timestamp_ms",
			kind: "scalar",
			T: 3,
			opt: !0
		}, {
			no: 6,
			name: "normalized_start_timestamp",
			kind: "message",
			T: t5
		}, {
			no: 7,
			name: "normalized_end_timestamp",
			kind: "message",
			T: t5,
			opt: !0
		}, {
			no: 8,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 9,
			name: "rid",
			kind: "scalar",
			T: 13
		}]),
		ir = t8.makeEnum("livekit.AudioCodec", [{
			no: 0,
			name: "DEFAULT_AC"
		}, {
			no: 1,
			name: "OPUS"
		}, {
			no: 2,
			name: "AAC"
		}, {
			no: 3,
			name: "AC_MP3"
		}]),
		ia = t8.makeEnum("livekit.VideoCodec", [{
			no: 0,
			name: "DEFAULT_VC"
		}, {
			no: 1,
			name: "H264_BASELINE"
		}, {
			no: 2,
			name: "H264_MAIN"
		}, {
			no: 3,
			name: "H264_HIGH"
		}, {
			no: 4,
			name: "VP8"
		}]),
		is = t8.makeEnum("livekit.ImageCodec", [{
			no: 0,
			name: "IC_DEFAULT"
		}, {
			no: 1,
			name: "IC_JPEG"
		}]),
		io = t8.makeEnum("livekit.BackupCodecPolicy", [{
			no: 0,
			name: "PREFER_REGRESSION"
		}, {
			no: 1,
			name: "SIMULCAST"
		}, {
			no: 2,
			name: "REGRESSION"
		}]),
		ic = t8.makeEnum("livekit.TrackType", [{
			no: 0,
			name: "AUDIO"
		}, {
			no: 1,
			name: "VIDEO"
		}, {
			no: 2,
			name: "DATA"
		}]),
		il = t8.makeEnum("livekit.TrackSource", [{
			no: 0,
			name: "UNKNOWN"
		}, {
			no: 1,
			name: "CAMERA"
		}, {
			no: 2,
			name: "MICROPHONE"
		}, {
			no: 3,
			name: "SCREEN_SHARE"
		}, {
			no: 4,
			name: "SCREEN_SHARE_AUDIO"
		}]),
		id = t8.makeEnum("livekit.VideoQuality", [{
			no: 0,
			name: "LOW"
		}, {
			no: 1,
			name: "MEDIUM"
		}, {
			no: 2,
			name: "HIGH"
		}, {
			no: 3,
			name: "OFF"
		}]),
		iu = t8.makeEnum("livekit.ConnectionQuality", [{
			no: 0,
			name: "POOR"
		}, {
			no: 1,
			name: "GOOD"
		}, {
			no: 2,
			name: "EXCELLENT"
		}, {
			no: 3,
			name: "LOST"
		}]),
		ih = t8.makeEnum("livekit.ClientConfigSetting", [{
			no: 0,
			name: "UNSET"
		}, {
			no: 1,
			name: "DISABLED"
		}, {
			no: 2,
			name: "ENABLED"
		}]),
		ip = t8.makeEnum("livekit.DisconnectReason", [{
			no: 0,
			name: "UNKNOWN_REASON"
		}, {
			no: 1,
			name: "CLIENT_INITIATED"
		}, {
			no: 2,
			name: "DUPLICATE_IDENTITY"
		}, {
			no: 3,
			name: "SERVER_SHUTDOWN"
		}, {
			no: 4,
			name: "PARTICIPANT_REMOVED"
		}, {
			no: 5,
			name: "ROOM_DELETED"
		}, {
			no: 6,
			name: "STATE_MISMATCH"
		}, {
			no: 7,
			name: "JOIN_FAILURE"
		}, {
			no: 8,
			name: "MIGRATION"
		}, {
			no: 9,
			name: "SIGNAL_CLOSE"
		}, {
			no: 10,
			name: "ROOM_CLOSED"
		}, {
			no: 11,
			name: "USER_UNAVAILABLE"
		}, {
			no: 12,
			name: "USER_REJECTED"
		}, {
			no: 13,
			name: "SIP_TRUNK_FAILURE"
		}, {
			no: 14,
			name: "CONNECTION_TIMEOUT"
		}, {
			no: 15,
			name: "MEDIA_FAILURE"
		}, {
			no: 16,
			name: "AGENT_ERROR"
		}]),
		im = t8.makeEnum("livekit.ReconnectReason", [{
			no: 0,
			name: "RR_UNKNOWN"
		}, {
			no: 1,
			name: "RR_SIGNAL_DISCONNECTED"
		}, {
			no: 2,
			name: "RR_PUBLISHER_FAILED"
		}, {
			no: 3,
			name: "RR_SUBSCRIBER_FAILED"
		}, {
			no: 4,
			name: "RR_SWITCH_CANDIDATE"
		}]),
		ig = t8.makeEnum("livekit.SubscriptionError", [{
			no: 0,
			name: "SE_UNKNOWN"
		}, {
			no: 1,
			name: "SE_CODEC_UNSUPPORTED"
		}, {
			no: 2,
			name: "SE_TRACK_NOTFOUND"
		}]),
		iv = t8.makeEnum("livekit.AudioTrackFeature", [{
			no: 0,
			name: "TF_STEREO"
		}, {
			no: 1,
			name: "TF_NO_DTX"
		}, {
			no: 2,
			name: "TF_AUTO_GAIN_CONTROL"
		}, {
			no: 3,
			name: "TF_ECHO_CANCELLATION"
		}, {
			no: 4,
			name: "TF_NOISE_SUPPRESSION"
		}, {
			no: 5,
			name: "TF_ENHANCED_NOISE_CANCELLATION"
		}, {
			no: 6,
			name: "TF_PRECONNECT_BUFFER"
		}]),
		ik = t8.makeEnum("livekit.PacketTrailerFeature", [{
			no: 0,
			name: "PTF_USER_TIMESTAMP"
		}, {
			no: 1,
			name: "PTF_FRAME_ID"
		}]),
		iy = t8.makeMessageType("livekit.Room", () => [{
			no: 1,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "empty_timeout",
			kind: "scalar",
			T: 13
		}, {
			no: 14,
			name: "departure_timeout",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "max_participants",
			kind: "scalar",
			T: 13
		}, {
			no: 5,
			name: "creation_time",
			kind: "scalar",
			T: 3
		}, {
			no: 15,
			name: "creation_time_ms",
			kind: "scalar",
			T: 3
		}, {
			no: 6,
			name: "turn_password",
			kind: "scalar",
			T: 9
		}, {
			no: 7,
			name: "enabled_codecs",
			kind: "message",
			T: ib,
			repeated: !0
		}, {
			no: 8,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 9,
			name: "num_participants",
			kind: "scalar",
			T: 13
		}, {
			no: 11,
			name: "num_publishers",
			kind: "scalar",
			T: 13
		}, {
			no: 10,
			name: "active_recording",
			kind: "scalar",
			T: 8
		}, {
			no: 13,
			name: "version",
			kind: "message",
			T: i3
		}]),
		ib = t8.makeMessageType("livekit.Codec", () => [{
			no: 1,
			name: "mime",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "fmtp_line",
			kind: "scalar",
			T: 9
		}]),
		iT = t8.makeMessageType("livekit.ParticipantPermission", () => [{
			no: 1,
			name: "can_subscribe",
			kind: "scalar",
			T: 8
		}, {
			no: 2,
			name: "can_publish",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "can_publish_data",
			kind: "scalar",
			T: 8
		}, {
			no: 9,
			name: "can_publish_sources",
			kind: "enum",
			T: t8.getEnumType(il),
			repeated: !0
		}, {
			no: 7,
			name: "hidden",
			kind: "scalar",
			T: 8
		}, {
			no: 8,
			name: "recorder",
			kind: "scalar",
			T: 8
		}, {
			no: 10,
			name: "can_update_metadata",
			kind: "scalar",
			T: 8
		}, {
			no: 11,
			name: "agent",
			kind: "scalar",
			T: 8
		}, {
			no: 12,
			name: "can_subscribe_metrics",
			kind: "scalar",
			T: 8
		}, {
			no: 13,
			name: "can_manage_agent_session",
			kind: "scalar",
			T: 8
		}]),
		iS = t8.makeMessageType("livekit.ParticipantInfo", () => [{
			no: 1,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "identity",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "state",
			kind: "enum",
			T: t8.getEnumType(iC)
		}, {
			no: 4,
			name: "tracks",
			kind: "message",
			T: iI,
			repeated: !0
		}, {
			no: 5,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "joined_at",
			kind: "scalar",
			T: 3
		}, {
			no: 17,
			name: "joined_at_ms",
			kind: "scalar",
			T: 3
		}, {
			no: 9,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 10,
			name: "version",
			kind: "scalar",
			T: 13
		}, {
			no: 11,
			name: "permission",
			kind: "message",
			T: iT
		}, {
			no: 12,
			name: "region",
			kind: "scalar",
			T: 9
		}, {
			no: 13,
			name: "is_publisher",
			kind: "scalar",
			T: 8
		}, {
			no: 14,
			name: "kind",
			kind: "enum",
			T: t8.getEnumType(iw)
		}, {
			no: 15,
			name: "attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 16,
			name: "disconnect_reason",
			kind: "enum",
			T: t8.getEnumType(ip)
		}, {
			no: 18,
			name: "kind_details",
			kind: "enum",
			T: t8.getEnumType(iE),
			repeated: !0
		}, {
			no: 19,
			name: "data_tracks",
			kind: "message",
			T: iD,
			repeated: !0
		}, {
			no: 20,
			name: "client_protocol",
			kind: "scalar",
			T: 5
		}]),
		iC = t8.makeEnum("livekit.ParticipantInfo.State", [{
			no: 0,
			name: "JOINING"
		}, {
			no: 1,
			name: "JOINED"
		}, {
			no: 2,
			name: "ACTIVE"
		}, {
			no: 3,
			name: "DISCONNECTED"
		}]),
		iw = t8.makeEnum("livekit.ParticipantInfo.Kind", [{
			no: 0,
			name: "STANDARD"
		}, {
			no: 1,
			name: "INGRESS"
		}, {
			no: 2,
			name: "EGRESS"
		}, {
			no: 3,
			name: "SIP"
		}, {
			no: 4,
			name: "AGENT"
		}, {
			no: 7,
			name: "CONNECTOR"
		}, {
			no: 8,
			name: "BRIDGE"
		}]),
		iE = t8.makeEnum("livekit.ParticipantInfo.KindDetail", [{
			no: 0,
			name: "CLOUD_AGENT"
		}, {
			no: 1,
			name: "FORWARDED"
		}, {
			no: 2,
			name: "CONNECTOR_WHATSAPP"
		}, {
			no: 3,
			name: "CONNECTOR_TWILIO"
		}, {
			no: 4,
			name: "BRIDGE_RTSP"
		}]),
		iR = t8.makeEnum("livekit.Encryption.Type", [{
			no: 0,
			name: "NONE"
		}, {
			no: 1,
			name: "GCM"
		}, {
			no: 2,
			name: "CUSTOM"
		}]),
		iP = t8.makeMessageType("livekit.SimulcastCodecInfo", () => [{
			no: 1,
			name: "mime_type",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "mid",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "cid",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "layers",
			kind: "message",
			T: i_,
			repeated: !0
		}, {
			no: 5,
			name: "video_layer_mode",
			kind: "enum",
			T: t8.getEnumType(iO)
		}, {
			no: 6,
			name: "sdp_cid",
			kind: "scalar",
			T: 9
		}]),
		iI = t8.makeMessageType("livekit.TrackInfo", () => [{
			no: 1,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "type",
			kind: "enum",
			T: t8.getEnumType(ic)
		}, {
			no: 3,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "muted",
			kind: "scalar",
			T: 8
		}, {
			no: 5,
			name: "width",
			kind: "scalar",
			T: 13
		}, {
			no: 6,
			name: "height",
			kind: "scalar",
			T: 13
		}, {
			no: 7,
			name: "simulcast",
			kind: "scalar",
			T: 8
		}, {
			no: 8,
			name: "disable_dtx",
			kind: "scalar",
			T: 8
		}, {
			no: 9,
			name: "source",
			kind: "enum",
			T: t8.getEnumType(il)
		}, {
			no: 10,
			name: "layers",
			kind: "message",
			T: i_,
			repeated: !0
		}, {
			no: 11,
			name: "mime_type",
			kind: "scalar",
			T: 9
		}, {
			no: 12,
			name: "mid",
			kind: "scalar",
			T: 9
		}, {
			no: 13,
			name: "codecs",
			kind: "message",
			T: iP,
			repeated: !0
		}, {
			no: 14,
			name: "stereo",
			kind: "scalar",
			T: 8
		}, {
			no: 15,
			name: "disable_red",
			kind: "scalar",
			T: 8
		}, {
			no: 16,
			name: "encryption",
			kind: "enum",
			T: t8.getEnumType(iR)
		}, {
			no: 17,
			name: "stream",
			kind: "scalar",
			T: 9
		}, {
			no: 18,
			name: "version",
			kind: "message",
			T: i3
		}, {
			no: 19,
			name: "audio_features",
			kind: "enum",
			T: t8.getEnumType(iv),
			repeated: !0
		}, {
			no: 20,
			name: "backup_codec_policy",
			kind: "enum",
			T: t8.getEnumType(io)
		}, {
			no: 21,
			name: "packet_trailer_features",
			kind: "enum",
			T: t8.getEnumType(ik),
			repeated: !0
		}]),
		iD = t8.makeMessageType("livekit.DataTrackInfo", () => [{
			no: 1,
			name: "pub_handle",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "encryption",
			kind: "enum",
			T: t8.getEnumType(iR)
		}]),
		iM = t8.makeMessageType("livekit.DataTrackSubscriptionOptions", () => [{
			no: 1,
			name: "target_fps",
			kind: "scalar",
			T: 13,
			opt: !0
		}]),
		i_ = t8.makeMessageType("livekit.VideoLayer", () => [{
			no: 1,
			name: "quality",
			kind: "enum",
			T: t8.getEnumType(id)
		}, {
			no: 2,
			name: "width",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "height",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "bitrate",
			kind: "scalar",
			T: 13
		}, {
			no: 5,
			name: "ssrc",
			kind: "scalar",
			T: 13
		}, {
			no: 6,
			name: "spatial_layer",
			kind: "scalar",
			T: 5
		}, {
			no: 7,
			name: "rid",
			kind: "scalar",
			T: 9
		}, {
			no: 8,
			name: "repair_ssrc",
			kind: "scalar",
			T: 13
		}]),
		iO = t8.makeEnum("livekit.VideoLayer.Mode", [{
			no: 0,
			name: "MODE_UNUSED"
		}, {
			no: 1,
			name: "ONE_SPATIAL_LAYER_PER_STREAM"
		}, {
			no: 2,
			name: "MULTIPLE_SPATIAL_LAYERS_PER_STREAM"
		}, {
			no: 3,
			name: "ONE_SPATIAL_LAYER_PER_STREAM_INCOMPLETE_RTCP_SR"
		}]),
		iA = t8.makeMessageType("livekit.DataPacket", () => [{
			no: 1,
			name: "kind",
			kind: "enum",
			T: t8.getEnumType(ix)
		}, {
			no: 4,
			name: "participant_identity",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "destination_identities",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 2,
			name: "user",
			kind: "message",
			T: iB,
			oneof: "value"
		}, {
			no: 3,
			name: "speaker",
			kind: "message",
			T: iU,
			oneof: "value"
		}, {
			no: 6,
			name: "sip_dtmf",
			kind: "message",
			T: ij,
			oneof: "value"
		}, {
			no: 7,
			name: "transcription",
			kind: "message",
			T: iq,
			oneof: "value"
		}, {
			no: 8,
			name: "metrics",
			kind: "message",
			T: t7,
			oneof: "value"
		}, {
			no: 9,
			name: "chat_message",
			kind: "message",
			T: iH,
			oneof: "value"
		}, {
			no: 10,
			name: "rpc_request",
			kind: "message",
			T: iW,
			oneof: "value"
		}, {
			no: 11,
			name: "rpc_ack",
			kind: "message",
			T: iK,
			oneof: "value"
		}, {
			no: 12,
			name: "rpc_response",
			kind: "message",
			T: iz,
			oneof: "value"
		}, {
			no: 13,
			name: "stream_header",
			kind: "message",
			T: i8,
			oneof: "value"
		}, {
			no: 14,
			name: "stream_chunk",
			kind: "message",
			T: i5,
			oneof: "value"
		}, {
			no: 15,
			name: "stream_trailer",
			kind: "message",
			T: i7,
			oneof: "value"
		}, {
			no: 18,
			name: "encrypted_packet",
			kind: "message",
			T: iL,
			oneof: "value"
		}, {
			no: 16,
			name: "sequence",
			kind: "scalar",
			T: 13
		}, {
			no: 17,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}]),
		ix = t8.makeEnum("livekit.DataPacket.Kind", [{
			no: 0,
			name: "RELIABLE"
		}, {
			no: 1,
			name: "LOSSY"
		}]),
		iL = t8.makeMessageType("livekit.EncryptedPacket", () => [{
			no: 1,
			name: "encryption_type",
			kind: "enum",
			T: t8.getEnumType(iR)
		}, {
			no: 2,
			name: "iv",
			kind: "scalar",
			T: 12
		}, {
			no: 3,
			name: "key_index",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "encrypted_value",
			kind: "scalar",
			T: 12
		}]),
		iN = t8.makeMessageType("livekit.EncryptedPacketPayload", () => [{
			no: 1,
			name: "user",
			kind: "message",
			T: iB,
			oneof: "value"
		}, {
			no: 3,
			name: "chat_message",
			kind: "message",
			T: iH,
			oneof: "value"
		}, {
			no: 4,
			name: "rpc_request",
			kind: "message",
			T: iW,
			oneof: "value"
		}, {
			no: 5,
			name: "rpc_ack",
			kind: "message",
			T: iK,
			oneof: "value"
		}, {
			no: 6,
			name: "rpc_response",
			kind: "message",
			T: iz,
			oneof: "value"
		}, {
			no: 7,
			name: "stream_header",
			kind: "message",
			T: i8,
			oneof: "value"
		}, {
			no: 8,
			name: "stream_chunk",
			kind: "message",
			T: i5,
			oneof: "value"
		}, {
			no: 9,
			name: "stream_trailer",
			kind: "message",
			T: i7,
			oneof: "value"
		}]),
		iU = t8.makeMessageType("livekit.ActiveSpeakerUpdate", () => [{
			no: 1,
			name: "speakers",
			kind: "message",
			T: iF,
			repeated: !0
		}]),
		iF = t8.makeMessageType("livekit.SpeakerInfo", () => [{
			no: 1,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "level",
			kind: "scalar",
			T: 2
		}, {
			no: 3,
			name: "active",
			kind: "scalar",
			T: 8
		}]),
		iB = t8.makeMessageType("livekit.UserPacket", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "participant_identity",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "payload",
			kind: "scalar",
			T: 12
		}, {
			no: 3,
			name: "destination_sids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 6,
			name: "destination_identities",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 4,
			name: "topic",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 8,
			name: "id",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 9,
			name: "start_time",
			kind: "scalar",
			T: 4,
			opt: !0
		}, {
			no: 10,
			name: "end_time",
			kind: "scalar",
			T: 4,
			opt: !0
		}, {
			no: 11,
			name: "nonce",
			kind: "scalar",
			T: 12
		}]),
		ij = t8.makeMessageType("livekit.SipDTMF", () => [{
			no: 3,
			name: "code",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "digit",
			kind: "scalar",
			T: 9
		}]),
		iq = t8.makeMessageType("livekit.Transcription", () => [{
			no: 2,
			name: "transcribed_participant_identity",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "track_id",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "segments",
			kind: "message",
			T: iV,
			repeated: !0
		}]),
		iV = t8.makeMessageType("livekit.TranscriptionSegment", () => [{
			no: 1,
			name: "id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "text",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "start_time",
			kind: "scalar",
			T: 4
		}, {
			no: 4,
			name: "end_time",
			kind: "scalar",
			T: 4
		}, {
			no: 5,
			name: "final",
			kind: "scalar",
			T: 8
		}, {
			no: 6,
			name: "language",
			kind: "scalar",
			T: 9
		}]),
		iH = t8.makeMessageType("livekit.ChatMessage", () => [{
			no: 1,
			name: "id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "timestamp",
			kind: "scalar",
			T: 3
		}, {
			no: 3,
			name: "edit_timestamp",
			kind: "scalar",
			T: 3,
			opt: !0
		}, {
			no: 4,
			name: "message",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "deleted",
			kind: "scalar",
			T: 8
		}, {
			no: 6,
			name: "generated",
			kind: "scalar",
			T: 8
		}]),
		iW = t8.makeMessageType("livekit.RpcRequest", () => [{
			no: 1,
			name: "id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "method",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "payload",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "response_timeout_ms",
			kind: "scalar",
			T: 13
		}, {
			no: 5,
			name: "version",
			kind: "scalar",
			T: 13
		}, {
			no: 6,
			name: "compressed_payload",
			kind: "scalar",
			T: 12
		}]),
		iK = t8.makeMessageType("livekit.RpcAck", () => [{
			no: 1,
			name: "request_id",
			kind: "scalar",
			T: 9
		}]),
		iz = t8.makeMessageType("livekit.RpcResponse", () => [{
			no: 1,
			name: "request_id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "payload",
			kind: "scalar",
			T: 9,
			oneof: "value"
		}, {
			no: 3,
			name: "error",
			kind: "message",
			T: iJ,
			oneof: "value"
		}, {
			no: 4,
			name: "compressed_payload",
			kind: "scalar",
			T: 12,
			oneof: "value"
		}]),
		iJ = t8.makeMessageType("livekit.RpcError", () => [{
			no: 1,
			name: "code",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "message",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "data",
			kind: "scalar",
			T: 9
		}]),
		iG = t8.makeMessageType("livekit.ParticipantTracks", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "track_sids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}]),
		iQ = t8.makeMessageType("livekit.ServerInfo", () => [{
			no: 1,
			name: "edition",
			kind: "enum",
			T: t8.getEnumType(iY)
		}, {
			no: 2,
			name: "version",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "protocol",
			kind: "scalar",
			T: 5
		}, {
			no: 4,
			name: "region",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "node_id",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "debug_info",
			kind: "scalar",
			T: 9
		}, {
			no: 7,
			name: "agent_protocol",
			kind: "scalar",
			T: 5
		}]),
		iY = t8.makeEnum("livekit.ServerInfo.Edition", [{
			no: 0,
			name: "Standard"
		}, {
			no: 1,
			name: "Cloud"
		}]),
		iX = t8.makeMessageType("livekit.ClientInfo", () => [{
			no: 1,
			name: "sdk",
			kind: "enum",
			T: t8.getEnumType(iZ)
		}, {
			no: 2,
			name: "version",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "protocol",
			kind: "scalar",
			T: 5
		}, {
			no: 4,
			name: "os",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "os_version",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "device_model",
			kind: "scalar",
			T: 9
		}, {
			no: 7,
			name: "browser",
			kind: "scalar",
			T: 9
		}, {
			no: 8,
			name: "browser_version",
			kind: "scalar",
			T: 9
		}, {
			no: 9,
			name: "address",
			kind: "scalar",
			T: 9
		}, {
			no: 10,
			name: "network",
			kind: "scalar",
			T: 9
		}, {
			no: 11,
			name: "other_sdks",
			kind: "scalar",
			T: 9
		}, {
			no: 12,
			name: "client_protocol",
			kind: "scalar",
			T: 5
		}, {
			no: 13,
			name: "capabilities",
			kind: "enum",
			T: t8.getEnumType(i$),
			repeated: !0
		}]),
		iZ = t8.makeEnum("livekit.ClientInfo.SDK", [{
			no: 0,
			name: "UNKNOWN"
		}, {
			no: 1,
			name: "JS"
		}, {
			no: 2,
			name: "SWIFT"
		}, {
			no: 3,
			name: "ANDROID"
		}, {
			no: 4,
			name: "FLUTTER"
		}, {
			no: 5,
			name: "GO"
		}, {
			no: 6,
			name: "UNITY"
		}, {
			no: 7,
			name: "REACT_NATIVE"
		}, {
			no: 8,
			name: "RUST"
		}, {
			no: 9,
			name: "PYTHON"
		}, {
			no: 10,
			name: "CPP"
		}, {
			no: 11,
			name: "UNITY_WEB"
		}, {
			no: 12,
			name: "NODE"
		}, {
			no: 13,
			name: "UNREAL"
		}, {
			no: 14,
			name: "ESP32"
		}]),
		i$ = t8.makeEnum("livekit.ClientInfo.Capability", [{
			no: 0,
			name: "CAP_UNUSED"
		}, {
			no: 1,
			name: "CAP_PACKET_TRAILER"
		}]),
		i0 = t8.makeMessageType("livekit.ClientConfiguration", () => [{
			no: 1,
			name: "video",
			kind: "message",
			T: i1
		}, {
			no: 2,
			name: "screen",
			kind: "message",
			T: i1
		}, {
			no: 3,
			name: "resume_connection",
			kind: "enum",
			T: t8.getEnumType(ih)
		}, {
			no: 4,
			name: "disabled_codecs",
			kind: "message",
			T: i2
		}, {
			no: 5,
			name: "force_relay",
			kind: "enum",
			T: t8.getEnumType(ih)
		}]),
		i1 = t8.makeMessageType("livekit.VideoConfiguration", () => [{
			no: 1,
			name: "hardware_encoder",
			kind: "enum",
			T: t8.getEnumType(ih)
		}]),
		i2 = t8.makeMessageType("livekit.DisabledCodecs", () => [{
			no: 1,
			name: "codecs",
			kind: "message",
			T: ib,
			repeated: !0
		}, {
			no: 2,
			name: "publish",
			kind: "message",
			T: ib,
			repeated: !0
		}]),
		i3 = t8.makeMessageType("livekit.TimedVersion", () => [{
			no: 1,
			name: "unix_micro",
			kind: "scalar",
			T: 3
		}, {
			no: 2,
			name: "ticks",
			kind: "scalar",
			T: 5
		}]),
		i4 = t8.makeEnum("livekit.DataStream.OperationType", [{
			no: 0,
			name: "CREATE"
		}, {
			no: 1,
			name: "UPDATE"
		}, {
			no: 2,
			name: "DELETE"
		}, {
			no: 3,
			name: "REACTION"
		}]),
		i9 = t8.makeMessageType("livekit.DataStream.TextHeader", () => [{
			no: 1,
			name: "operation_type",
			kind: "enum",
			T: t8.getEnumType(i4)
		}, {
			no: 2,
			name: "version",
			kind: "scalar",
			T: 5
		}, {
			no: 3,
			name: "reply_to_stream_id",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "attached_stream_ids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 5,
			name: "generated",
			kind: "scalar",
			T: 8
		}], {
			localName: "DataStream_TextHeader"
		}),
		i6 = t8.makeMessageType("livekit.DataStream.ByteHeader", () => [{
			no: 1,
			name: "name",
			kind: "scalar",
			T: 9
		}], {
			localName: "DataStream_ByteHeader"
		}),
		i8 = t8.makeMessageType("livekit.DataStream.Header", () => [{
			no: 1,
			name: "stream_id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "timestamp",
			kind: "scalar",
			T: 3
		}, {
			no: 3,
			name: "topic",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "mime_type",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "total_length",
			kind: "scalar",
			T: 4,
			opt: !0
		}, {
			no: 7,
			name: "encryption_type",
			kind: "enum",
			T: t8.getEnumType(iR)
		}, {
			no: 8,
			name: "attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 9,
			name: "text_header",
			kind: "message",
			T: i9,
			oneof: "content_header"
		}, {
			no: 10,
			name: "byte_header",
			kind: "message",
			T: i6,
			oneof: "content_header"
		}], {
			localName: "DataStream_Header"
		}),
		i5 = t8.makeMessageType("livekit.DataStream.Chunk", () => [{
			no: 1,
			name: "stream_id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "chunk_index",
			kind: "scalar",
			T: 4
		}, {
			no: 3,
			name: "content",
			kind: "scalar",
			T: 12
		}, {
			no: 4,
			name: "version",
			kind: "scalar",
			T: 5
		}, {
			no: 5,
			name: "iv",
			kind: "scalar",
			T: 12,
			opt: !0
		}], {
			localName: "DataStream_Chunk"
		}),
		i7 = t8.makeMessageType("livekit.DataStream.Trailer", () => [{
			no: 1,
			name: "stream_id",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "reason",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}], {
			localName: "DataStream_Trailer"
		}),
		ne = t8.makeMessageType("livekit.FilterParams", () => [{
			no: 1,
			name: "include_events",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 2,
			name: "exclude_events",
			kind: "scalar",
			T: 9,
			repeated: !0
		}]),
		nt = t8.makeMessageType("livekit.WebhookConfig", () => [{
			no: 1,
			name: "url",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "signing_key",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "filter_params",
			kind: "message",
			T: ne
		}]),
		ni = t8.makeMessageType("livekit.SubscribedAudioCodec", () => [{
			no: 1,
			name: "codec",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "enabled",
			kind: "scalar",
			T: 8
		}]),
		nn = t8.makeEnum("livekit.JobRestartPolicy", [{
			no: 0,
			name: "JRP_ON_FAILURE"
		}, {
			no: 1,
			name: "JRP_NEVER"
		}]),
		nr = t8.makeMessageType("livekit.RoomAgentDispatch", () => [{
			no: 1,
			name: "agent_name",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "restart_policy",
			kind: "enum",
			T: t8.getEnumType(nn)
		}, {
			no: 4,
			name: "deployment",
			kind: "scalar",
			T: 9
		}]),
		na = t8.makeEnum("livekit.EncodingOptionsPreset", [{
			no: 0,
			name: "H264_720P_30"
		}, {
			no: 1,
			name: "H264_720P_60"
		}, {
			no: 2,
			name: "H264_1080P_30"
		}, {
			no: 3,
			name: "H264_1080P_60"
		}, {
			no: 4,
			name: "PORTRAIT_H264_720P_30"
		}, {
			no: 5,
			name: "PORTRAIT_H264_720P_60"
		}, {
			no: 6,
			name: "PORTRAIT_H264_1080P_30"
		}, {
			no: 7,
			name: "PORTRAIT_H264_1080P_60"
		}]),
		ns = t8.makeEnum("livekit.EncodedFileType", [{
			no: 0,
			name: "DEFAULT_FILETYPE"
		}, {
			no: 1,
			name: "MP4"
		}, {
			no: 2,
			name: "OGG"
		}, {
			no: 3,
			name: "MP3"
		}]),
		no = t8.makeEnum("livekit.StreamProtocol", [{
			no: 0,
			name: "DEFAULT_PROTOCOL"
		}, {
			no: 1,
			name: "RTMP"
		}, {
			no: 2,
			name: "SRT"
		}, {
			no: 3,
			name: "WEBSOCKET"
		}]),
		nc = t8.makeEnum("livekit.SegmentedFileProtocol", [{
			no: 0,
			name: "DEFAULT_SEGMENTED_FILE_PROTOCOL"
		}, {
			no: 1,
			name: "HLS_PROTOCOL"
		}]),
		nl = t8.makeEnum("livekit.SegmentedFileSuffix", [{
			no: 0,
			name: "INDEX"
		}, {
			no: 1,
			name: "TIMESTAMP"
		}]),
		nd = t8.makeEnum("livekit.ImageFileSuffix", [{
			no: 0,
			name: "IMAGE_SUFFIX_INDEX"
		}, {
			no: 1,
			name: "IMAGE_SUFFIX_TIMESTAMP"
		}, {
			no: 2,
			name: "IMAGE_SUFFIX_NONE_OVERWRITE"
		}]),
		nu = t8.makeEnum("livekit.AudioMixing", [{
			no: 0,
			name: "DEFAULT_MIXING"
		}, {
			no: 1,
			name: "DUAL_CHANNEL_AGENT"
		}, {
			no: 2,
			name: "DUAL_CHANNEL_ALTERNATE"
		}]),
		nh = t8.makeMessageType("livekit.EncodingOptions", () => [{
			no: 1,
			name: "width",
			kind: "scalar",
			T: 5
		}, {
			no: 2,
			name: "height",
			kind: "scalar",
			T: 5
		}, {
			no: 3,
			name: "depth",
			kind: "scalar",
			T: 5
		}, {
			no: 4,
			name: "framerate",
			kind: "scalar",
			T: 5
		}, {
			no: 5,
			name: "audio_codec",
			kind: "enum",
			T: t8.getEnumType(ir)
		}, {
			no: 6,
			name: "audio_bitrate",
			kind: "scalar",
			T: 5
		}, {
			no: 7,
			name: "audio_frequency",
			kind: "scalar",
			T: 5
		}, {
			no: 8,
			name: "video_codec",
			kind: "enum",
			T: t8.getEnumType(ia)
		}, {
			no: 9,
			name: "video_bitrate",
			kind: "scalar",
			T: 5
		}, {
			no: 10,
			name: "key_frame_interval",
			kind: "scalar",
			T: 1
		}, {
			no: 11,
			name: "audio_quality",
			kind: "scalar",
			T: 5
		}, {
			no: 12,
			name: "video_quality",
			kind: "scalar",
			T: 5
		}]),
		np = t8.makeMessageType("livekit.StreamOutput", () => [{
			no: 1,
			name: "protocol",
			kind: "enum",
			T: t8.getEnumType(no)
		}, {
			no: 2,
			name: "urls",
			kind: "scalar",
			T: 9,
			repeated: !0
		}]),
		nm = t8.makeMessageType("livekit.SegmentedFileOutput", () => [{
			no: 1,
			name: "protocol",
			kind: "enum",
			T: t8.getEnumType(nc)
		}, {
			no: 2,
			name: "filename_prefix",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "playlist_name",
			kind: "scalar",
			T: 9
		}, {
			no: 11,
			name: "live_playlist_name",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "segment_duration",
			kind: "scalar",
			T: 13
		}, {
			no: 10,
			name: "filename_suffix",
			kind: "enum",
			T: t8.getEnumType(nl)
		}, {
			no: 8,
			name: "disable_manifest",
			kind: "scalar",
			T: 8
		}, {
			no: 5,
			name: "s3",
			kind: "message",
			T: nf,
			oneof: "output"
		}, {
			no: 6,
			name: "gcp",
			kind: "message",
			T: nv,
			oneof: "output"
		}, {
			no: 7,
			name: "azure",
			kind: "message",
			T: nk,
			oneof: "output"
		}, {
			no: 9,
			name: "aliOSS",
			kind: "message",
			T: ny,
			oneof: "output"
		}]),
		ng = t8.makeMessageType("livekit.ImageOutput", () => [{
			no: 1,
			name: "capture_interval",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "width",
			kind: "scalar",
			T: 5
		}, {
			no: 3,
			name: "height",
			kind: "scalar",
			T: 5
		}, {
			no: 4,
			name: "filename_prefix",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "filename_suffix",
			kind: "enum",
			T: t8.getEnumType(nd)
		}, {
			no: 6,
			name: "image_codec",
			kind: "enum",
			T: t8.getEnumType(is)
		}, {
			no: 7,
			name: "disable_manifest",
			kind: "scalar",
			T: 8
		}, {
			no: 8,
			name: "s3",
			kind: "message",
			T: nf,
			oneof: "output"
		}, {
			no: 9,
			name: "gcp",
			kind: "message",
			T: nv,
			oneof: "output"
		}, {
			no: 10,
			name: "azure",
			kind: "message",
			T: nk,
			oneof: "output"
		}, {
			no: 11,
			name: "aliOSS",
			kind: "message",
			T: ny,
			oneof: "output"
		}]),
		nf = t8.makeMessageType("livekit.S3Upload", () => [{
			no: 1,
			name: "access_key",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "secret",
			kind: "scalar",
			T: 9
		}, {
			no: 11,
			name: "session_token",
			kind: "scalar",
			T: 9
		}, {
			no: 12,
			name: "assume_role_arn",
			kind: "scalar",
			T: 9
		}, {
			no: 13,
			name: "assume_role_external_id",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "region",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "endpoint",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "bucket",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "force_path_style",
			kind: "scalar",
			T: 8
		}, {
			no: 7,
			name: "metadata",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 8,
			name: "tagging",
			kind: "scalar",
			T: 9
		}, {
			no: 9,
			name: "content_disposition",
			kind: "scalar",
			T: 9
		}, {
			no: 10,
			name: "proxy",
			kind: "message",
			T: nb
		}]),
		nv = t8.makeMessageType("livekit.GCPUpload", () => [{
			no: 1,
			name: "credentials",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "bucket",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "proxy",
			kind: "message",
			T: nb
		}]),
		nk = t8.makeMessageType("livekit.AzureBlobUpload", () => [{
			no: 1,
			name: "account_name",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "account_key",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "container_name",
			kind: "scalar",
			T: 9
		}]),
		ny = t8.makeMessageType("livekit.AliOSSUpload", () => [{
			no: 1,
			name: "access_key",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "secret",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "region",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "endpoint",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "bucket",
			kind: "scalar",
			T: 9
		}]),
		nb = t8.makeMessageType("livekit.ProxyConfig", () => [{
			no: 1,
			name: "url",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "username",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "password",
			kind: "scalar",
			T: 9
		}]),
		nT = t8.makeMessageType("livekit.AutoParticipantEgress", () => [{
			no: 1,
			name: "preset",
			kind: "enum",
			T: t8.getEnumType(na),
			oneof: "options"
		}, {
			no: 2,
			name: "advanced",
			kind: "message",
			T: nh,
			oneof: "options"
		}, {
			no: 3,
			name: "file_outputs",
			kind: "message",
			T: nw,
			repeated: !0
		}, {
			no: 4,
			name: "segment_outputs",
			kind: "message",
			T: nm,
			repeated: !0
		}]),
		nS = t8.makeMessageType("livekit.AutoTrackEgress", () => [{
			no: 1,
			name: "filepath",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "disable_manifest",
			kind: "scalar",
			T: 8
		}, {
			no: 2,
			name: "s3",
			kind: "message",
			T: nf,
			oneof: "output"
		}, {
			no: 3,
			name: "gcp",
			kind: "message",
			T: nv,
			oneof: "output"
		}, {
			no: 4,
			name: "azure",
			kind: "message",
			T: nk,
			oneof: "output"
		}, {
			no: 6,
			name: "aliOSS",
			kind: "message",
			T: ny,
			oneof: "output"
		}]),
		nC = t8.makeMessageType("livekit.RoomCompositeEgressRequest", () => [{
			no: 1,
			name: "room_name",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "layout",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "audio_only",
			kind: "scalar",
			T: 8
		}, {
			no: 15,
			name: "audio_mixing",
			kind: "enum",
			T: t8.getEnumType(nu)
		}, {
			no: 4,
			name: "video_only",
			kind: "scalar",
			T: 8
		}, {
			no: 5,
			name: "custom_base_url",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "file",
			kind: "message",
			T: nw,
			oneof: "output"
		}, {
			no: 7,
			name: "stream",
			kind: "message",
			T: np,
			oneof: "output"
		}, {
			no: 10,
			name: "segments",
			kind: "message",
			T: nm,
			oneof: "output"
		}, {
			no: 8,
			name: "preset",
			kind: "enum",
			T: t8.getEnumType(na),
			oneof: "options"
		}, {
			no: 9,
			name: "advanced",
			kind: "message",
			T: nh,
			oneof: "options"
		}, {
			no: 11,
			name: "file_outputs",
			kind: "message",
			T: nw,
			repeated: !0
		}, {
			no: 12,
			name: "stream_outputs",
			kind: "message",
			T: np,
			repeated: !0
		}, {
			no: 13,
			name: "segment_outputs",
			kind: "message",
			T: nm,
			repeated: !0
		}, {
			no: 14,
			name: "image_outputs",
			kind: "message",
			T: ng,
			repeated: !0
		}, {
			no: 16,
			name: "webhooks",
			kind: "message",
			T: nt,
			repeated: !0
		}]),
		nw = t8.makeMessageType("livekit.EncodedFileOutput", () => [{
			no: 1,
			name: "file_type",
			kind: "enum",
			T: t8.getEnumType(ns)
		}, {
			no: 2,
			name: "filepath",
			kind: "scalar",
			T: 9
		}, {
			no: 6,
			name: "disable_manifest",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "s3",
			kind: "message",
			T: nf,
			oneof: "output"
		}, {
			no: 4,
			name: "gcp",
			kind: "message",
			T: nv,
			oneof: "output"
		}, {
			no: 5,
			name: "azure",
			kind: "message",
			T: nk,
			oneof: "output"
		}, {
			no: 7,
			name: "aliOSS",
			kind: "message",
			T: ny,
			oneof: "output"
		}]),
		nE = t8.makeMessageType("livekit.RoomEgress", () => [{
			no: 1,
			name: "room",
			kind: "message",
			T: nC
		}, {
			no: 3,
			name: "participant",
			kind: "message",
			T: nT
		}, {
			no: 2,
			name: "tracks",
			kind: "message",
			T: nS
		}]),
		nR = t8.makeMessageType("livekit.RoomConfiguration", () => [{
			no: 1,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "empty_timeout",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "departure_timeout",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "max_participants",
			kind: "scalar",
			T: 13
		}, {
			no: 11,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "egress",
			kind: "message",
			T: nE
		}, {
			no: 7,
			name: "min_playout_delay",
			kind: "scalar",
			T: 13
		}, {
			no: 8,
			name: "max_playout_delay",
			kind: "scalar",
			T: 13
		}, {
			no: 9,
			name: "sync_streams",
			kind: "scalar",
			T: 8
		}, {
			no: 10,
			name: "agents",
			kind: "message",
			T: nr,
			repeated: !0
		}, {
			no: 12,
			name: "tags",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}]),
		nP = t8.makeEnum("livekit.SignalTarget", [{
			no: 0,
			name: "PUBLISHER"
		}, {
			no: 1,
			name: "SUBSCRIBER"
		}]),
		nI = t8.makeEnum("livekit.StreamState", [{
			no: 0,
			name: "ACTIVE"
		}, {
			no: 1,
			name: "PAUSED"
		}]),
		nD = t8.makeEnum("livekit.CandidateProtocol", [{
			no: 0,
			name: "UDP"
		}, {
			no: 1,
			name: "TCP"
		}, {
			no: 2,
			name: "TLS"
		}]),
		nM = t8.makeMessageType("livekit.SignalRequest", () => [{
			no: 1,
			name: "offer",
			kind: "message",
			T: nz,
			oneof: "message"
		}, {
			no: 2,
			name: "answer",
			kind: "message",
			T: nz,
			oneof: "message"
		}, {
			no: 3,
			name: "trickle",
			kind: "message",
			T: nj,
			oneof: "message"
		}, {
			no: 4,
			name: "add_track",
			kind: "message",
			T: nA,
			oneof: "message"
		}, {
			no: 5,
			name: "mute",
			kind: "message",
			T: nq,
			oneof: "message"
		}, {
			no: 6,
			name: "subscription",
			kind: "message",
			T: nG,
			oneof: "message"
		}, {
			no: 7,
			name: "track_setting",
			kind: "message",
			T: nX,
			oneof: "message"
		}, {
			no: 8,
			name: "leave",
			kind: "message",
			T: n0,
			oneof: "message"
		}, {
			no: 10,
			name: "update_layers",
			kind: "message",
			T: n2,
			oneof: "message"
		}, {
			no: 11,
			name: "subscription_permission",
			kind: "message",
			T: rs,
			oneof: "message"
		}, {
			no: 12,
			name: "sync_state",
			kind: "message",
			T: rl,
			oneof: "message"
		}, {
			no: 13,
			name: "simulate",
			kind: "message",
			T: rh,
			oneof: "message"
		}, {
			no: 14,
			name: "ping",
			kind: "scalar",
			T: 3,
			oneof: "message"
		}, {
			no: 15,
			name: "update_metadata",
			kind: "message",
			T: n3,
			oneof: "message"
		}, {
			no: 16,
			name: "ping_req",
			kind: "message",
			T: rp,
			oneof: "message"
		}, {
			no: 17,
			name: "update_audio_track",
			kind: "message",
			T: nZ,
			oneof: "message"
		}, {
			no: 18,
			name: "update_video_track",
			kind: "message",
			T: n$,
			oneof: "message"
		}, {
			no: 19,
			name: "publish_data_track_request",
			kind: "message",
			T: nx,
			oneof: "message"
		}, {
			no: 20,
			name: "unpublish_data_track_request",
			kind: "message",
			T: nN,
			oneof: "message"
		}, {
			no: 21,
			name: "update_data_subscription",
			kind: "message",
			T: nQ,
			oneof: "message"
		}]),
		n_ = t8.makeMessageType("livekit.SignalResponse", () => [{
			no: 1,
			name: "join",
			kind: "message",
			T: nV,
			oneof: "message"
		}, {
			no: 2,
			name: "answer",
			kind: "message",
			T: nz,
			oneof: "message"
		}, {
			no: 3,
			name: "offer",
			kind: "message",
			T: nz,
			oneof: "message"
		}, {
			no: 4,
			name: "trickle",
			kind: "message",
			T: nj,
			oneof: "message"
		}, {
			no: 5,
			name: "update",
			kind: "message",
			T: nJ,
			oneof: "message"
		}, {
			no: 6,
			name: "track_published",
			kind: "message",
			T: nW,
			oneof: "message"
		}, {
			no: 8,
			name: "leave",
			kind: "message",
			T: n0,
			oneof: "message"
		}, {
			no: 9,
			name: "mute",
			kind: "message",
			T: nq,
			oneof: "message"
		}, {
			no: 10,
			name: "speakers_changed",
			kind: "message",
			T: n9,
			oneof: "message"
		}, {
			no: 11,
			name: "room_update",
			kind: "message",
			T: n6,
			oneof: "message"
		}, {
			no: 12,
			name: "connection_quality",
			kind: "message",
			T: n5,
			oneof: "message"
		}, {
			no: 13,
			name: "stream_state_update",
			kind: "message",
			T: re,
			oneof: "message"
		}, {
			no: 14,
			name: "subscribed_quality_update",
			kind: "message",
			T: rn,
			oneof: "message"
		}, {
			no: 15,
			name: "subscription_permission_update",
			kind: "message",
			T: ro,
			oneof: "message"
		}, {
			no: 16,
			name: "refresh_token",
			kind: "scalar",
			T: 9,
			oneof: "message"
		}, {
			no: 17,
			name: "track_unpublished",
			kind: "message",
			T: nK,
			oneof: "message"
		}, {
			no: 18,
			name: "pong",
			kind: "scalar",
			T: 3,
			oneof: "message"
		}, {
			no: 19,
			name: "reconnect",
			kind: "message",
			T: nH,
			oneof: "message"
		}, {
			no: 20,
			name: "pong_resp",
			kind: "message",
			T: rm,
			oneof: "message"
		}, {
			no: 21,
			name: "subscription_response",
			kind: "message",
			T: rv,
			oneof: "message"
		}, {
			no: 22,
			name: "request_response",
			kind: "message",
			T: rk,
			oneof: "message"
		}, {
			no: 23,
			name: "track_subscribed",
			kind: "message",
			T: rb,
			oneof: "message"
		}, {
			no: 24,
			name: "room_moved",
			kind: "message",
			T: rc,
			oneof: "message"
		}, {
			no: 25,
			name: "media_sections_requirement",
			kind: "message",
			T: rE,
			oneof: "message"
		}, {
			no: 26,
			name: "subscribed_audio_codec_update",
			kind: "message",
			T: rr,
			oneof: "message"
		}, {
			no: 27,
			name: "publish_data_track_response",
			kind: "message",
			T: nL,
			oneof: "message"
		}, {
			no: 28,
			name: "unpublish_data_track_response",
			kind: "message",
			T: nU,
			oneof: "message"
		}, {
			no: 29,
			name: "data_track_subscriber_handles",
			kind: "message",
			T: nF,
			oneof: "message"
		}]),
		nO = t8.makeMessageType("livekit.SimulcastCodec", () => [{
			no: 1,
			name: "codec",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "cid",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "layers",
			kind: "message",
			T: i_,
			repeated: !0
		}, {
			no: 5,
			name: "video_layer_mode",
			kind: "enum",
			T: t8.getEnumType(iO)
		}]),
		nA = t8.makeMessageType("livekit.AddTrackRequest", () => [{
			no: 1,
			name: "cid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "type",
			kind: "enum",
			T: t8.getEnumType(ic)
		}, {
			no: 4,
			name: "width",
			kind: "scalar",
			T: 13
		}, {
			no: 5,
			name: "height",
			kind: "scalar",
			T: 13
		}, {
			no: 6,
			name: "muted",
			kind: "scalar",
			T: 8
		}, {
			no: 7,
			name: "disable_dtx",
			kind: "scalar",
			T: 8
		}, {
			no: 8,
			name: "source",
			kind: "enum",
			T: t8.getEnumType(il)
		}, {
			no: 9,
			name: "layers",
			kind: "message",
			T: i_,
			repeated: !0
		}, {
			no: 10,
			name: "simulcast_codecs",
			kind: "message",
			T: nO,
			repeated: !0
		}, {
			no: 11,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 12,
			name: "stereo",
			kind: "scalar",
			T: 8
		}, {
			no: 13,
			name: "disable_red",
			kind: "scalar",
			T: 8
		}, {
			no: 14,
			name: "encryption",
			kind: "enum",
			T: t8.getEnumType(iR)
		}, {
			no: 15,
			name: "stream",
			kind: "scalar",
			T: 9
		}, {
			no: 16,
			name: "backup_codec_policy",
			kind: "enum",
			T: t8.getEnumType(io)
		}, {
			no: 17,
			name: "audio_features",
			kind: "enum",
			T: t8.getEnumType(iv),
			repeated: !0
		}, {
			no: 18,
			name: "packet_trailer_features",
			kind: "enum",
			T: t8.getEnumType(ik),
			repeated: !0
		}]),
		nx = t8.makeMessageType("livekit.PublishDataTrackRequest", () => [{
			no: 1,
			name: "pub_handle",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "encryption",
			kind: "enum",
			T: t8.getEnumType(iR)
		}]),
		nL = t8.makeMessageType("livekit.PublishDataTrackResponse", () => [{
			no: 1,
			name: "info",
			kind: "message",
			T: iD
		}]),
		nN = t8.makeMessageType("livekit.UnpublishDataTrackRequest", () => [{
			no: 1,
			name: "pub_handle",
			kind: "scalar",
			T: 13
		}]),
		nU = t8.makeMessageType("livekit.UnpublishDataTrackResponse", () => [{
			no: 1,
			name: "info",
			kind: "message",
			T: iD
		}]),
		nF = t8.makeMessageType("livekit.DataTrackSubscriberHandles", () => [{
			no: 1,
			name: "sub_handles",
			kind: "map",
			K: 13,
			V: {
				kind: "message",
				T: nB
			}
		}]),
		nB = t8.makeMessageType("livekit.DataTrackSubscriberHandles.PublishedDataTrack", () => [{
			no: 1,
			name: "publisher_identity",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "publisher_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}], {
			localName: "DataTrackSubscriberHandles_PublishedDataTrack"
		}),
		nj = t8.makeMessageType("livekit.TrickleRequest", () => [{
			no: 1,
			name: "candidateInit",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "target",
			kind: "enum",
			T: t8.getEnumType(nP)
		}, {
			no: 3,
			name: "final",
			kind: "scalar",
			T: 8
		}]),
		nq = t8.makeMessageType("livekit.MuteTrackRequest", () => [{
			no: 1,
			name: "sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "muted",
			kind: "scalar",
			T: 8
		}]),
		nV = t8.makeMessageType("livekit.JoinResponse", () => [{
			no: 1,
			name: "room",
			kind: "message",
			T: iy
		}, {
			no: 2,
			name: "participant",
			kind: "message",
			T: iS
		}, {
			no: 3,
			name: "other_participants",
			kind: "message",
			T: iS,
			repeated: !0
		}, {
			no: 4,
			name: "server_version",
			kind: "scalar",
			T: 9
		}, {
			no: 5,
			name: "ice_servers",
			kind: "message",
			T: n4,
			repeated: !0
		}, {
			no: 6,
			name: "subscriber_primary",
			kind: "scalar",
			T: 8
		}, {
			no: 7,
			name: "alternative_url",
			kind: "scalar",
			T: 9
		}, {
			no: 8,
			name: "client_configuration",
			kind: "message",
			T: i0
		}, {
			no: 9,
			name: "server_region",
			kind: "scalar",
			T: 9
		}, {
			no: 10,
			name: "ping_timeout",
			kind: "scalar",
			T: 5
		}, {
			no: 11,
			name: "ping_interval",
			kind: "scalar",
			T: 5
		}, {
			no: 12,
			name: "server_info",
			kind: "message",
			T: iQ
		}, {
			no: 13,
			name: "sif_trailer",
			kind: "scalar",
			T: 12
		}, {
			no: 14,
			name: "enabled_publish_codecs",
			kind: "message",
			T: ib,
			repeated: !0
		}, {
			no: 15,
			name: "fast_publish",
			kind: "scalar",
			T: 8
		}]),
		nH = t8.makeMessageType("livekit.ReconnectResponse", () => [{
			no: 1,
			name: "ice_servers",
			kind: "message",
			T: n4,
			repeated: !0
		}, {
			no: 2,
			name: "client_configuration",
			kind: "message",
			T: i0
		}, {
			no: 3,
			name: "server_info",
			kind: "message",
			T: iQ
		}, {
			no: 4,
			name: "last_message_seq",
			kind: "scalar",
			T: 13
		}]),
		nW = t8.makeMessageType("livekit.TrackPublishedResponse", () => [{
			no: 1,
			name: "cid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "track",
			kind: "message",
			T: iI
		}]),
		nK = t8.makeMessageType("livekit.TrackUnpublishedResponse", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}]),
		nz = t8.makeMessageType("livekit.SessionDescription", () => [{
			no: 1,
			name: "type",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "sdp",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "id",
			kind: "scalar",
			T: 13
		}, {
			no: 4,
			name: "mid_to_track_id",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}]),
		nJ = t8.makeMessageType("livekit.ParticipantUpdate", () => [{
			no: 1,
			name: "participants",
			kind: "message",
			T: iS,
			repeated: !0
		}]),
		nG = t8.makeMessageType("livekit.UpdateSubscription", () => [{
			no: 1,
			name: "track_sids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 2,
			name: "subscribe",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "participant_tracks",
			kind: "message",
			T: iG,
			repeated: !0
		}]),
		nQ = t8.makeMessageType("livekit.UpdateDataSubscription", () => [{
			no: 1,
			name: "updates",
			kind: "message",
			T: nY,
			repeated: !0
		}]),
		nY = t8.makeMessageType("livekit.UpdateDataSubscription.Update", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "subscribe",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "options",
			kind: "message",
			T: iM
		}], {
			localName: "UpdateDataSubscription_Update"
		}),
		nX = t8.makeMessageType("livekit.UpdateTrackSettings", () => [{
			no: 1,
			name: "track_sids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 3,
			name: "disabled",
			kind: "scalar",
			T: 8
		}, {
			no: 4,
			name: "quality",
			kind: "enum",
			T: t8.getEnumType(id)
		}, {
			no: 5,
			name: "width",
			kind: "scalar",
			T: 13
		}, {
			no: 6,
			name: "height",
			kind: "scalar",
			T: 13
		}, {
			no: 7,
			name: "fps",
			kind: "scalar",
			T: 13
		}, {
			no: 8,
			name: "priority",
			kind: "scalar",
			T: 13
		}]),
		nZ = t8.makeMessageType("livekit.UpdateLocalAudioTrack", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "features",
			kind: "enum",
			T: t8.getEnumType(iv),
			repeated: !0
		}]),
		n$ = t8.makeMessageType("livekit.UpdateLocalVideoTrack", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "width",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "height",
			kind: "scalar",
			T: 13
		}]),
		n0 = t8.makeMessageType("livekit.LeaveRequest", () => [{
			no: 1,
			name: "can_reconnect",
			kind: "scalar",
			T: 8
		}, {
			no: 2,
			name: "reason",
			kind: "enum",
			T: t8.getEnumType(ip)
		}, {
			no: 3,
			name: "action",
			kind: "enum",
			T: t8.getEnumType(n1)
		}, {
			no: 4,
			name: "regions",
			kind: "message",
			T: rg
		}]),
		n1 = t8.makeEnum("livekit.LeaveRequest.Action", [{
			no: 0,
			name: "DISCONNECT"
		}, {
			no: 1,
			name: "RESUME"
		}, {
			no: 2,
			name: "RECONNECT"
		}]),
		n2 = t8.makeMessageType("livekit.UpdateVideoLayers", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "layers",
			kind: "message",
			T: i_,
			repeated: !0
		}]),
		n3 = t8.makeMessageType("livekit.UpdateParticipantMetadata", () => [{
			no: 1,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "name",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 4,
			name: "request_id",
			kind: "scalar",
			T: 13
		}]),
		n4 = t8.makeMessageType("livekit.ICEServer", () => [{
			no: 1,
			name: "urls",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 2,
			name: "username",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "credential",
			kind: "scalar",
			T: 9
		}]),
		n9 = t8.makeMessageType("livekit.SpeakersChanged", () => [{
			no: 1,
			name: "speakers",
			kind: "message",
			T: iF,
			repeated: !0
		}]),
		n6 = t8.makeMessageType("livekit.RoomUpdate", () => [{
			no: 1,
			name: "room",
			kind: "message",
			T: iy
		}]),
		n8 = t8.makeMessageType("livekit.ConnectionQualityInfo", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "quality",
			kind: "enum",
			T: t8.getEnumType(iu)
		}, {
			no: 3,
			name: "score",
			kind: "scalar",
			T: 2
		}]),
		n5 = t8.makeMessageType("livekit.ConnectionQualityUpdate", () => [{
			no: 1,
			name: "updates",
			kind: "message",
			T: n8,
			repeated: !0
		}]),
		n7 = t8.makeMessageType("livekit.StreamStateInfo", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "state",
			kind: "enum",
			T: t8.getEnumType(nI)
		}]),
		re = t8.makeMessageType("livekit.StreamStateUpdate", () => [{
			no: 1,
			name: "stream_states",
			kind: "message",
			T: n7,
			repeated: !0
		}]),
		rt = t8.makeMessageType("livekit.SubscribedQuality", () => [{
			no: 1,
			name: "quality",
			kind: "enum",
			T: t8.getEnumType(id)
		}, {
			no: 2,
			name: "enabled",
			kind: "scalar",
			T: 8
		}]),
		ri = t8.makeMessageType("livekit.SubscribedCodec", () => [{
			no: 1,
			name: "codec",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "qualities",
			kind: "message",
			T: rt,
			repeated: !0
		}]),
		rn = t8.makeMessageType("livekit.SubscribedQualityUpdate", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "subscribed_qualities",
			kind: "message",
			T: rt,
			repeated: !0
		}, {
			no: 3,
			name: "subscribed_codecs",
			kind: "message",
			T: ri,
			repeated: !0
		}]),
		rr = t8.makeMessageType("livekit.SubscribedAudioCodecUpdate", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "subscribed_audio_codecs",
			kind: "message",
			T: ni,
			repeated: !0
		}]),
		ra = t8.makeMessageType("livekit.TrackPermission", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "all_tracks",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "track_sids",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 4,
			name: "participant_identity",
			kind: "scalar",
			T: 9
		}]),
		rs = t8.makeMessageType("livekit.SubscriptionPermission", () => [{
			no: 1,
			name: "all_participants",
			kind: "scalar",
			T: 8
		}, {
			no: 2,
			name: "track_permissions",
			kind: "message",
			T: ra,
			repeated: !0
		}]),
		ro = t8.makeMessageType("livekit.SubscriptionPermissionUpdate", () => [{
			no: 1,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "allowed",
			kind: "scalar",
			T: 8
		}]),
		rc = t8.makeMessageType("livekit.RoomMovedResponse", () => [{
			no: 1,
			name: "room",
			kind: "message",
			T: iy
		}, {
			no: 2,
			name: "token",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "participant",
			kind: "message",
			T: iS
		}, {
			no: 4,
			name: "other_participants",
			kind: "message",
			T: iS,
			repeated: !0
		}]),
		rl = t8.makeMessageType("livekit.SyncState", () => [{
			no: 1,
			name: "answer",
			kind: "message",
			T: nz
		}, {
			no: 2,
			name: "subscription",
			kind: "message",
			T: nG
		}, {
			no: 3,
			name: "publish_tracks",
			kind: "message",
			T: nW,
			repeated: !0
		}, {
			no: 4,
			name: "data_channels",
			kind: "message",
			T: ru,
			repeated: !0
		}, {
			no: 5,
			name: "offer",
			kind: "message",
			T: nz
		}, {
			no: 6,
			name: "track_sids_disabled",
			kind: "scalar",
			T: 9,
			repeated: !0
		}, {
			no: 7,
			name: "datachannel_receive_states",
			kind: "message",
			T: rd,
			repeated: !0
		}, {
			no: 8,
			name: "publish_data_tracks",
			kind: "message",
			T: nL,
			repeated: !0
		}]),
		rd = t8.makeMessageType("livekit.DataChannelReceiveState", () => [{
			no: 1,
			name: "publisher_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "last_seq",
			kind: "scalar",
			T: 13
		}]),
		ru = t8.makeMessageType("livekit.DataChannelInfo", () => [{
			no: 1,
			name: "label",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "id",
			kind: "scalar",
			T: 13
		}, {
			no: 3,
			name: "target",
			kind: "enum",
			T: t8.getEnumType(nP)
		}]),
		rh = t8.makeMessageType("livekit.SimulateScenario", () => [{
			no: 1,
			name: "speaker_update",
			kind: "scalar",
			T: 5,
			oneof: "scenario"
		}, {
			no: 2,
			name: "node_failure",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}, {
			no: 3,
			name: "migration",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}, {
			no: 4,
			name: "server_leave",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}, {
			no: 5,
			name: "switch_candidate_protocol",
			kind: "enum",
			T: t8.getEnumType(nD),
			oneof: "scenario"
		}, {
			no: 6,
			name: "subscriber_bandwidth",
			kind: "scalar",
			T: 3,
			oneof: "scenario"
		}, {
			no: 7,
			name: "disconnect_signal_on_resume",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}, {
			no: 8,
			name: "disconnect_signal_on_resume_no_messages",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}, {
			no: 9,
			name: "leave_request_full_reconnect",
			kind: "scalar",
			T: 8,
			oneof: "scenario"
		}]),
		rp = t8.makeMessageType("livekit.Ping", () => [{
			no: 1,
			name: "timestamp",
			kind: "scalar",
			T: 3
		}, {
			no: 2,
			name: "rtt",
			kind: "scalar",
			T: 3
		}]),
		rm = t8.makeMessageType("livekit.Pong", () => [{
			no: 1,
			name: "last_ping_timestamp",
			kind: "scalar",
			T: 3
		}, {
			no: 2,
			name: "timestamp",
			kind: "scalar",
			T: 3
		}]),
		rg = t8.makeMessageType("livekit.RegionSettings", () => [{
			no: 1,
			name: "regions",
			kind: "message",
			T: rf,
			repeated: !0
		}]),
		rf = t8.makeMessageType("livekit.RegionInfo", () => [{
			no: 1,
			name: "region",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "url",
			kind: "scalar",
			T: 9
		}, {
			no: 3,
			name: "distance",
			kind: "scalar",
			T: 3
		}]),
		rv = t8.makeMessageType("livekit.SubscriptionResponse", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "err",
			kind: "enum",
			T: t8.getEnumType(ig)
		}]),
		rk = t8.makeMessageType("livekit.RequestResponse", () => [{
			no: 1,
			name: "request_id",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "reason",
			kind: "enum",
			T: t8.getEnumType(ry)
		}, {
			no: 3,
			name: "message",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "trickle",
			kind: "message",
			T: nj,
			oneof: "request"
		}, {
			no: 5,
			name: "add_track",
			kind: "message",
			T: nA,
			oneof: "request"
		}, {
			no: 6,
			name: "mute",
			kind: "message",
			T: nq,
			oneof: "request"
		}, {
			no: 7,
			name: "update_metadata",
			kind: "message",
			T: n3,
			oneof: "request"
		}, {
			no: 8,
			name: "update_audio_track",
			kind: "message",
			T: nZ,
			oneof: "request"
		}, {
			no: 9,
			name: "update_video_track",
			kind: "message",
			T: n$,
			oneof: "request"
		}, {
			no: 10,
			name: "publish_data_track",
			kind: "message",
			T: nx,
			oneof: "request"
		}, {
			no: 11,
			name: "unpublish_data_track",
			kind: "message",
			T: nN,
			oneof: "request"
		}]),
		ry = t8.makeEnum("livekit.RequestResponse.Reason", [{
			no: 0,
			name: "OK"
		}, {
			no: 1,
			name: "NOT_FOUND"
		}, {
			no: 2,
			name: "NOT_ALLOWED"
		}, {
			no: 3,
			name: "LIMIT_EXCEEDED"
		}, {
			no: 4,
			name: "QUEUED"
		}, {
			no: 5,
			name: "UNSUPPORTED_TYPE"
		}, {
			no: 6,
			name: "UNCLASSIFIED_ERROR"
		}, {
			no: 7,
			name: "INVALID_HANDLE"
		}, {
			no: 8,
			name: "INVALID_NAME"
		}, {
			no: 9,
			name: "DUPLICATE_HANDLE"
		}, {
			no: 10,
			name: "DUPLICATE_NAME"
		}]),
		rb = t8.makeMessageType("livekit.TrackSubscribed", () => [{
			no: 1,
			name: "track_sid",
			kind: "scalar",
			T: 9
		}]),
		rT = t8.makeMessageType("livekit.ConnectionSettings", () => [{
			no: 1,
			name: "auto_subscribe",
			kind: "scalar",
			T: 8
		}, {
			no: 2,
			name: "adaptive_stream",
			kind: "scalar",
			T: 8
		}, {
			no: 3,
			name: "subscriber_allow_pause",
			kind: "scalar",
			T: 8,
			opt: !0
		}, {
			no: 4,
			name: "disable_ice_lite",
			kind: "scalar",
			T: 8
		}, {
			no: 5,
			name: "auto_subscribe_data_track",
			kind: "scalar",
			T: 8,
			opt: !0
		}]),
		rS = t8.makeMessageType("livekit.JoinRequest", () => [{
			no: 1,
			name: "client_info",
			kind: "message",
			T: iX
		}, {
			no: 2,
			name: "connection_settings",
			kind: "message",
			T: rT
		}, {
			no: 3,
			name: "metadata",
			kind: "scalar",
			T: 9
		}, {
			no: 4,
			name: "participant_attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 5,
			name: "add_track_requests",
			kind: "message",
			T: nA,
			repeated: !0
		}, {
			no: 6,
			name: "publisher_offer",
			kind: "message",
			T: nz
		}, {
			no: 7,
			name: "reconnect",
			kind: "scalar",
			T: 8
		}, {
			no: 8,
			name: "reconnect_reason",
			kind: "enum",
			T: t8.getEnumType(im)
		}, {
			no: 9,
			name: "participant_sid",
			kind: "scalar",
			T: 9
		}, {
			no: 10,
			name: "sync_state",
			kind: "message",
			T: rl
		}]),
		rC = t8.makeMessageType("livekit.WrappedJoinRequest", () => [{
			no: 1,
			name: "compression",
			kind: "enum",
			T: t8.getEnumType(rw)
		}, {
			no: 2,
			name: "join_request",
			kind: "scalar",
			T: 12
		}]),
		rw = t8.makeEnum("livekit.WrappedJoinRequest.Compression", [{
			no: 0,
			name: "NONE"
		}, {
			no: 1,
			name: "GZIP"
		}]),
		rE = t8.makeMessageType("livekit.MediaSectionsRequirement", () => [{
			no: 1,
			name: "num_audios",
			kind: "scalar",
			T: 13
		}, {
			no: 2,
			name: "num_videos",
			kind: "scalar",
			T: 13
		}]),
		rR = t8.makeMessageType("livekit.TokenSourceRequest", () => [{
			no: 1,
			name: "room_name",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 2,
			name: "participant_name",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 3,
			name: "participant_identity",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 4,
			name: "participant_metadata",
			kind: "scalar",
			T: 9,
			opt: !0
		}, {
			no: 5,
			name: "participant_attributes",
			kind: "map",
			K: 9,
			V: {
				kind: "scalar",
				T: 9
			}
		}, {
			no: 6,
			name: "room_config",
			kind: "message",
			T: nR,
			opt: !0
		}]),
		rP = t8.makeMessageType("livekit.TokenSourceResponse", () => [{
			no: 1,
			name: "server_url",
			kind: "scalar",
			T: 9
		}, {
			no: 2,
			name: "participant_token",
			kind: "scalar",
			T: 9
		}]);
	var rI = {
			exports: {}
		},
		rD = rI.exports,
		rM = function() {
			var e;
			return ea ? rI.exports : (ea = 1, e = function() {
				var e = function() {},
					t = "undefined",
					i = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent),
					n = ["trace", "debug", "info", "warn", "error"],
					r = {},
					a = null;

				function s(e, t) {
					var i = e[t];
					if ("function" == typeof i.bind) return i.bind(e);
					try {
						return Function.prototype.bind.call(i, e)
					} catch (t) {
						return function() {
							return Function.prototype.apply.apply(i, [e, arguments])
						}
					}
				}

				function o() {
					console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace()
				}

				function c() {
					for (var i = this.getLevel(), r = 0; r < n.length; r++) {
						var a = n[r];
						this[a] = r < i ? e : this.methodFactory(a, i, this.name)
					}
					if (this.log = this.debug, typeof console === t && i < this.levels.SILENT) return "No console available for logging"
				}

				function l(e) {
					return function() {
						typeof console !== t && (c.call(this), this[e].apply(this, arguments))
					}
				}

				function d(n, r, a) {
					var c;
					return "debug" === (c = n) && (c = "log"), typeof console !== t && ("trace" === c && i ? o : void 0 !== console[c] ? s(console, c) : void 0 !== console.log ? s(console, "log") : e) || l.apply(this, arguments)
				}

				function u(e, i) {
					var s, o, l, u = this,
						h = "loglevel";

					function p() {
						var e;
						if (typeof window !== t && h) {
							try {
								e = window.localStorage[h]
							} catch (e) {}
							if (typeof e === t) try {
								var i = window.document.cookie,
									n = encodeURIComponent(h),
									r = i.indexOf(n + "="); - 1 !== r && (e = /^([^;]+)/.exec(i.slice(r + n.length + 1))[1])
							} catch (e) {}
							return void 0 === u.levels[e] && (e = void 0), e
						}
					}

					function m(e) {
						var t = e;
						if ("string" == typeof t && void 0 !== u.levels[t.toUpperCase()] && (t = u.levels[t.toUpperCase()]), "number" == typeof t && t >= 0 && t <= u.levels.SILENT) return t;
						throw TypeError("log.setLevel() called with invalid level: " + e)
					}
					"string" == typeof e ? h += ":" + e : "symbol" == typeof e && (h = void 0), u.name = e, u.levels = {
						TRACE: 0,
						DEBUG: 1,
						INFO: 2,
						WARN: 3,
						ERROR: 4,
						SILENT: 5
					}, u.methodFactory = i || d, u.getLevel = function() {
						return null != l ? l : null != o ? o : s
					}, u.setLevel = function(e, i) {
						return l = m(e), !1 !== i && function(e) {
							var i = (n[e] || "silent").toUpperCase();
							if (typeof window !== t && h) {
								try {
									window.localStorage[h] = i;
									return
								} catch (e) {}
								try {
									window.document.cookie = encodeURIComponent(h) + "=" + i + ";"
								} catch (e) {}
							}
						}(l), c.call(u)
					}, u.setDefaultLevel = function(e) {
						o = m(e), p() || u.setLevel(e, !1)
					}, u.resetLevel = function() {
						if (l = null, typeof window !== t && h) {
							try {
								window.localStorage.removeItem(h)
							} catch (e) {}
							try {
								window.document.cookie = encodeURIComponent(h) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
							} catch (e) {}
						}
						c.call(u)
					}, u.enableAll = function(e) {
						u.setLevel(u.levels.TRACE, e)
					}, u.disableAll = function(e) {
						u.setLevel(u.levels.SILENT, e)
					}, u.rebuild = function() {
						if (a !== u && (s = m(a.getLevel())), c.call(u), a === u)
							for (var e in r) r[e].rebuild()
					}, s = m(a ? a.getLevel() : "WARN");
					var g = p();
					null != g && (l = m(g)), c.call(u)
				}(a = new u).getLogger = function(e) {
					if ("symbol" != typeof e && "string" != typeof e || "" === e) throw TypeError("You must supply a name when creating a logger.");
					var t = r[e];
					return t || (t = r[e] = new u(e, a.methodFactory)), t
				};
				var h = typeof window !== t ? window.log : void 0;
				return a.noConflict = function() {
					return typeof window !== t && window.log === a && (window.log = h), a
				}, a.getLoggers = function() {
					return r
				}, a.default = a, a
			}, rI.exports ? rI.exports = e() : rD.log = e(), rI.exports)
		}();
	(h = es || (es = {}))[h.trace = 0] = "trace", h[h.debug = 1] = "debug", h[h.info = 2] = "info", h[h.warn = 3] = "warn", h[h.error = 4] = "error", h[h.silent = 5] = "silent", (p = eo || (eo = {})).Default = "livekit", p.Room = "livekit-room", p.TokenSource = "livekit-token-source", p.Participant = "livekit-participant", p.Track = "livekit-track", p.Publication = "livekit-track-publication", p.Engine = "livekit-engine", p.Signal = "livekit-signal", p.PCManager = "livekit-pc-manager", p.PCTransport = "livekit-pc-transport", p.E2EE = "lk-e2ee", p.DataTracks = "livekit-data-tracks", p.Region = "livekit-region", p.ICE = "livekit-ice";
	let r_ = rM.getLogger(eo.Default),
		rO = Object.values(eo).map(e => rM.getLogger(e));

	function rA(e, t) {
		var i, n;
		let r, a, s = rM.getLogger(e);
		return (s.setDefaultLevel(r_.getLevel()), t) ? (i = s, n = t, r = e => (t, r) => {
			let a = n(),
				s = a || r ? Object.assign(Object.assign({}, a), r) : void 0;
			i[e](t, s)
		}, (a = Object.create(i)).trace = r("trace"), a.debug = r("debug"), a.info = r("info"), a.warn = r("warn"), a.error = r("error"), a) : s
	}
	r_.setDefaultLevel(es.info);
	let rx = rM.getLogger(eo.E2EE),
		rL = [0, 300, 1200, 2700, 4800, 7e3, 7e3, 7e3, 7e3, 7e3];
	class rN {
		constructor(e) {
			this._retryDelays = void 0 !== e ? [...e] : rL
		}
		nextRetryDelayInMs(e) {
			if (e.retryCount >= this._retryDelays.length) return null;
			let t = this._retryDelays[e.retryCount];
			return e.retryCount <= 1 ? t : t + 1e3 * Math.random()
		}
	}

	function rU(e, t) {
		var i = {};
		for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && 0 > t.indexOf(n) && (i[n] = e[n]);
		if (null != e && "function" == typeof Object.getOwnPropertySymbols)
			for (var r = 0, n = Object.getOwnPropertySymbols(e); r < n.length; r++) 0 > t.indexOf(n[r]) && Object.prototype.propertyIsEnumerable.call(e, n[r]) && (i[n[r]] = e[n[r]]);
		return i
	}

	function rF(e, t, i, n) {
		return new(i || (i = Promise))(function(r, a) {
			function s(e) {
				try {
					c(n.next(e))
				} catch (e) {
					a(e)
				}
			}

			function o(e) {
				try {
					c(n.throw(e))
				} catch (e) {
					a(e)
				}
			}

			function c(e) {
				var t;
				e.done ? r(e.value) : ((t = e.value) instanceof i ? t : new i(function(e) {
					e(t)
				})).then(s, o)
			}
			c((n = n.apply(e, t || [])).next())
		})
	}

	function rB(e) {
		return this instanceof rB ? (this.v = e, this) : new rB(e)
	}

	function rj(e) {
		if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
		var t, i = e[Symbol.asyncIterator];
		return i ? i.call(e) : (e = function(e) {
			var t = "function" == typeof Symbol && Symbol.iterator,
				i = t && e[t],
				n = 0;
			if (i) return i.call(e);
			if (e && "number" == typeof e.length) return {
				next: function() {
					return e && n >= e.length && (e = void 0), {
						value: e && e[n++],
						done: !e
					}
				}
			};
			throw TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
		}(e), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function() {
			return this
		}, t);

		function n(i) {
			t[i] = e[i] && function(t) {
				return new Promise(function(n, r) {
					var a, s, o;
					a = n, s = r, o = (t = e[i](t)).done, Promise.resolve(t.value).then(function(e) {
						a({
							value: e,
							done: o
						})
					}, s)
				})
			}
		}
	}
	"function" == typeof SuppressedError && SuppressedError;
	var rq = {
			exports: {}
		},
		rV = function() {
			if (ec) return rq.exports;
			ec = 1;
			var e, t = "object" == typeof Reflect ? Reflect : null,
				i = t && "function" == typeof t.apply ? t.apply : function(e, t, i) {
					return Function.prototype.apply.call(e, t, i)
				};
			e = t && "function" == typeof t.ownKeys ? t.ownKeys : Object.getOwnPropertySymbols ? function(e) {
				return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
			} : function(e) {
				return Object.getOwnPropertyNames(e)
			};
			var n = Number.isNaN || function(e) {
				return e != e
			};

			function r() {
				r.init.call(this)
			}
			rq.exports = r, rq.exports.once = function(e, t) {
				return new Promise(function(i, n) {
					var r, a, s;

					function o(i) {
						e.removeListener(t, c), n(i)
					}

					function c() {
						"function" == typeof e.removeListener && e.removeListener("error", o), i([].slice.call(arguments))
					}
					m(e, t, c, {
						once: !0
					}), "error" !== t && (r = e, a = o, s = {
						once: !0
					}, "function" == typeof r.on && m(r, "error", a, s))
				})
			}, r.EventEmitter = r, r.prototype._events = void 0, r.prototype._eventsCount = 0, r.prototype._maxListeners = void 0;
			var a = 10;

			function s(e) {
				if ("function" != typeof e) throw TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
			}

			function o(e) {
				return void 0 === e._maxListeners ? r.defaultMaxListeners : e._maxListeners
			}

			function c(e, t, i, n) {
				if (s(i), void 0 === (a = e._events) ? (a = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== a.newListener && (e.emit("newListener", t, i.listener ? i.listener : i), a = e._events), c = a[t]), void 0 === c) c = a[t] = i, ++e._eventsCount;
				else if ("function" == typeof c ? c = a[t] = n ? [i, c] : [c, i] : n ? c.unshift(i) : c.push(i), (r = o(e)) > 0 && c.length > r && !c.warned) {
					c.warned = !0;
					var r, a, c, l = Error("Possible EventEmitter memory leak detected. " + c.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
					l.name = "MaxListenersExceededWarning", l.emitter = e, l.type = t, l.count = c.length, console && console.warn && console.warn(l)
				}
				return e
			}

			function l() {
				if (!this.fired) return (this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 == arguments.length) ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
			}

			function d(e, t, i) {
				var n = {
						fired: !1,
						wrapFn: void 0,
						target: e,
						type: t,
						listener: i
					},
					r = l.bind(n);
				return r.listener = i, n.wrapFn = r, r
			}

			function u(e, t, i) {
				var n = e._events;
				if (void 0 === n) return [];
				var r = n[t];
				return void 0 === r ? [] : "function" == typeof r ? i ? [r.listener || r] : [r] : i ? function(e) {
					for (var t = Array(e.length), i = 0; i < t.length; ++i) t[i] = e[i].listener || e[i];
					return t
				}(r) : p(r, r.length)
			}

			function h(e) {
				var t = this._events;
				if (void 0 !== t) {
					var i = t[e];
					if ("function" == typeof i) return 1;
					if (void 0 !== i) return i.length
				}
				return 0
			}

			function p(e, t) {
				for (var i = Array(t), n = 0; n < t; ++n) i[n] = e[n];
				return i
			}

			function m(e, t, i, n) {
				if ("function" == typeof e.on) n.once ? e.once(t, i) : e.on(t, i);
				else if ("function" == typeof e.addEventListener) e.addEventListener(t, function r(a) {
					n.once && e.removeEventListener(t, r), i(a)
				});
				else throw TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e)
			}
			return Object.defineProperty(r, "defaultMaxListeners", {
				enumerable: !0,
				get: function() {
					return a
				},
				set: function(e) {
					if ("number" != typeof e || e < 0 || n(e)) throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
					a = e
				}
			}), r.init = function() {
				(void 0 === this._events || this._events === Object.getPrototypeOf(this)._events) && (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
			}, r.prototype.setMaxListeners = function(e) {
				if ("number" != typeof e || e < 0 || n(e)) throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
				return this._maxListeners = e, this
			}, r.prototype.getMaxListeners = function() {
				return o(this)
			}, r.prototype.emit = function(e) {
				for (var t = [], n = 1; n < arguments.length; n++) t.push(arguments[n]);
				var r = "error" === e,
					a = this._events;
				if (void 0 !== a) r = r && void 0 === a.error;
				else if (!r) return !1;
				if (r) {
					if (t.length > 0 && (s = t[0]), s instanceof Error) throw s;
					var s, o = Error("Unhandled error." + (s ? " (" + s.message + ")" : ""));
					throw o.context = s, o
				}
				var c = a[e];
				if (void 0 === c) return !1;
				if ("function" == typeof c) i(c, this, t);
				else
					for (var l = c.length, d = p(c, l), n = 0; n < l; ++n) i(d[n], this, t);
				return !0
			}, r.prototype.addListener = function(e, t) {
				return c(this, e, t, !1)
			}, r.prototype.on = r.prototype.addListener, r.prototype.prependListener = function(e, t) {
				return c(this, e, t, !0)
			}, r.prototype.once = function(e, t) {
				return s(t), this.on(e, d(this, e, t)), this
			}, r.prototype.prependOnceListener = function(e, t) {
				return s(t), this.prependListener(e, d(this, e, t)), this
			}, r.prototype.removeListener = function(e, t) {
				var i, n, r, a, o;
				if (s(t), void 0 === (n = this._events) || void 0 === (i = n[e])) return this;
				if (i === t || i.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete n[e], n.removeListener && this.emit("removeListener", e, i.listener || t));
				else if ("function" != typeof i) {
					for (r = -1, a = i.length - 1; a >= 0; a--)
						if (i[a] === t || i[a].listener === t) {
							o = i[a].listener, r = a;
							break
						} if (r < 0) return this;
					0 === r ? i.shift() : function(e, t) {
						for (; t + 1 < e.length; t++) e[t] = e[t + 1];
						e.pop()
					}(i, r), 1 === i.length && (n[e] = i[0]), void 0 !== n.removeListener && this.emit("removeListener", e, o || t)
				}
				return this
			}, r.prototype.off = r.prototype.removeListener, r.prototype.removeAllListeners = function(e) {
				var t, i, n;
				if (void 0 === (i = this._events)) return this;
				if (void 0 === i.removeListener) return 0 == arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== i[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete i[e]), this;
				if (0 == arguments.length) {
					var r, a = Object.keys(i);
					for (n = 0; n < a.length; ++n) "removeListener" !== (r = a[n]) && this.removeAllListeners(r);
					return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
				}
				if ("function" == typeof(t = i[e])) this.removeListener(e, t);
				else if (void 0 !== t)
					for (n = t.length - 1; n >= 0; n--) this.removeListener(e, t[n]);
				return this
			}, r.prototype.listeners = function(e) {
				return u(this, e, !0)
			}, r.prototype.rawListeners = function(e) {
				return u(this, e, !1)
			}, r.listenerCount = function(e, t) {
				return "function" == typeof e.listenerCount ? e.listenerCount(t) : h.call(e, t)
			}, r.prototype.listenerCount = h, r.prototype.eventNames = function() {
				return this._eventsCount > 0 ? e(this._events) : []
			}, rq.exports
		}();
	let rH = !0,
		rW = !0;

	function rK(e, t, i) {
		let n = e.match(t);
		return n && n.length >= i && parseFloat(n[i], 10)
	}

	function rz(e, t, i) {
		if (!e.RTCPeerConnection) return;
		if (!Object.getOwnPropertyDescriptor(EventTarget.prototype, "addEventListener").writable) return void rQ("Unable to polyfill events");
		let n = e.RTCPeerConnection.prototype,
			r = n.addEventListener;
		n.addEventListener = function(e, n) {
			if (e !== t) return r.apply(this, arguments);
			let a = e => {
				let t = i(e);
				t && (n.handleEvent ? n.handleEvent(t) : n(t))
			};
			return this._eventMap = this._eventMap || {}, this._eventMap[t] || (this._eventMap[t] = new Map), this._eventMap[t].set(n, a), r.apply(this, [e, a])
		};
		let a = n.removeEventListener;
		n.removeEventListener = function(e, i) {
			if (e !== t || !this._eventMap || !this._eventMap[t] || !this._eventMap[t].has(i)) return a.apply(this, arguments);
			let n = this._eventMap[t].get(i);
			return this._eventMap[t].delete(i), 0 === this._eventMap[t].size && delete this._eventMap[t], 0 === Object.keys(this._eventMap).length && delete this._eventMap, a.apply(this, [e, n])
		}, Object.defineProperty(n, "on" + t, {
			get() {
				return this["_on" + t]
			},
			set(e) {
				this["_on" + t] && (this.removeEventListener(t, this["_on" + t]), delete this["_on" + t]), e && this.addEventListener(t, this["_on" + t] = e)
			},
			enumerable: !0,
			configurable: !0
		})
	}

	function rJ(e) {
		return "boolean" != typeof e ? Error("Argument type: " + typeof e + ". Please use a boolean.") : (rH = e, e ? "adapter.js logging disabled" : "adapter.js logging enabled")
	}

	function rG(e) {
		return "boolean" != typeof e ? Error("Argument type: " + typeof e + ". Please use a boolean.") : (rW = !e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
	}

	function rQ() {
		"object" == typeof window && !rH && "u" > typeof console && "function" == typeof console.log && console.log.apply(console, arguments)
	}

	function rY(e, t) {
		rW && console.warn(e + " is deprecated, please use " + t + " instead.")
	}

	function rX(e) {
		return "[object Object]" === Object.prototype.toString.call(e)
	}

	function rZ(e, t, i) {
		let n = i ? "outbound-rtp" : "inbound-rtp",
			r = new Map;
		if (null === t) return r;
		let a = [];
		return e.forEach(e => {
			"track" === e.type && e.trackIdentifier === t.id && a.push(e)
		}), a.forEach(t => {
			e.forEach(i => {
				i.type === n && i.trackId === t.id && function e(t, i, n) {
					!i || n.has(i.id) || (n.set(i.id, i), Object.keys(i).forEach(r => {
						r.endsWith("Id") ? e(t, t.get(i[r]), n) : r.endsWith("Ids") && i[r].forEach(i => {
							e(t, t.get(i), n)
						})
					}))
				}(e, i, r)
			})
		}), r
	}
	let r$ = rQ;

	function r0(e, t) {
		if (t.version >= 64) return;
		let i = e && e.navigator;
		if (!i.mediaDevices) return;
		let n = function(e) {
				if ("object" != typeof e || e.mandatory || e.optional) return e;
				let t = {};
				return Object.keys(e).forEach(i => {
					if ("require" === i || "advanced" === i || "mediaSource" === i) return;
					let n = "object" == typeof e[i] ? e[i] : {
						ideal: e[i]
					};
					void 0 !== n.exact && "number" == typeof n.exact && (n.min = n.max = n.exact);
					let r = function(e, t) {
						return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
					};
					if (void 0 !== n.ideal) {
						t.optional = t.optional || [];
						let e = {};
						"number" == typeof n.ideal ? (e[r("min", i)] = n.ideal, t.optional.push(e), (e = {})[r("max", i)] = n.ideal) : e[r("", i)] = n.ideal, t.optional.push(e)
					}
					void 0 !== n.exact && "number" != typeof n.exact ? (t.mandatory = t.mandatory || {}, t.mandatory[r("", i)] = n.exact) : ["min", "max"].forEach(e => {
						void 0 !== n[e] && (t.mandatory = t.mandatory || {}, t.mandatory[r(e, i)] = n[e])
					})
				}), e.advanced && (t.optional = (t.optional || []).concat(e.advanced)), t
			},
			r = function(e, r) {
				if (t.version >= 61) return r(e);
				if ((e = JSON.parse(JSON.stringify(e))) && "object" == typeof e.audio) {
					let t = function(e, t, i) {
						t in e && !(i in e) && (e[i] = e[t], delete e[t])
					};
					t((e = JSON.parse(JSON.stringify(e))).audio, "autoGainControl", "googAutoGainControl"), t(e.audio, "noiseSuppression", "googNoiseSuppression"), e.audio = n(e.audio)
				}
				if (e && "object" == typeof e.video) {
					let a = e.video.facingMode;
					a = a && ("object" == typeof a ? a : {
						ideal: a
					});
					let s = t.version < 66;
					if (a && ("user" === a.exact || "environment" === a.exact || "user" === a.ideal || "environment" === a.ideal) && !(i.mediaDevices.getSupportedConstraints && i.mediaDevices.getSupportedConstraints().facingMode && !s)) {
						let t;
						if (delete e.video.facingMode, "environment" === a.exact || "environment" === a.ideal ? t = ["back", "rear"] : ("user" === a.exact || "user" === a.ideal) && (t = ["front"]), t) return i.mediaDevices.enumerateDevices().then(i => {
							let s = (i = i.filter(e => "videoinput" === e.kind)).find(e => t.some(t => e.label.toLowerCase().includes(t)));
							return !s && i.length && t.includes("back") && (s = i[i.length - 1]), s && (e.video.deviceId = a.exact ? {
								exact: s.deviceId
							} : {
								ideal: s.deviceId
							}), e.video = n(e.video), r$("chrome: " + JSON.stringify(e)), r(e)
						})
					}
					e.video = n(e.video)
				}
				return r$("chrome: " + JSON.stringify(e)), r(e)
			},
			a = function(e) {
				return t.version >= 64 ? e : {
					name: ({
						PermissionDeniedError: "NotAllowedError",
						PermissionDismissedError: "NotAllowedError",
						InvalidStateError: "NotAllowedError",
						DevicesNotFoundError: "NotFoundError",
						ConstraintNotSatisfiedError: "OverconstrainedError",
						TrackStartError: "NotReadableError",
						MediaDeviceFailedDueToShutdown: "NotAllowedError",
						MediaDeviceKillSwitchOn: "NotAllowedError",
						TabCaptureError: "AbortError",
						ScreenCaptureError: "AbortError",
						DeviceCaptureError: "AbortError"
					})[e.name] || e.name,
					message: e.message,
					constraint: e.constraint || e.constraintName,
					toString() {
						return this.name + (this.message && ": ") + this.message
					}
				}
			};
		if (i.getUserMedia = (function(e, t, n) {
				r(e, e => {
					i.webkitGetUserMedia(e, t, e => {
						n && n(a(e))
					})
				})
			}).bind(i), i.mediaDevices.getUserMedia) {
			let e = i.mediaDevices.getUserMedia.bind(i.mediaDevices);
			i.mediaDevices.getUserMedia = function(t) {
				return r(t, t => e(t).then(e => {
					if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(e => {
						e.stop()
					}), new DOMException("", "NotFoundError");
					return e
				}, e => Promise.reject(a(e))))
			}
		}
	}

	function r1(e) {
		e.MediaStream = e.MediaStream || e.webkitMediaStream
	}

	function r2(e, t) {
		if (!(t.version > 102))
			if ("object" != typeof e || !e.RTCPeerConnection || "ontrack" in e.RTCPeerConnection.prototype) rz(e, "track", e => (e.transceiver || Object.defineProperty(e, "transceiver", {
				value: {
					receiver: e.receiver
				}
			}), e));
			else {
				Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
					get() {
						return this._ontrack
					},
					set(e) {
						this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e)
					},
					enumerable: !0,
					configurable: !0
				});
				let t = e.RTCPeerConnection.prototype.setRemoteDescription;
				e.RTCPeerConnection.prototype.setRemoteDescription = function() {
					return this._ontrackpoly || (this._ontrackpoly = t => {
						t.stream.addEventListener("addtrack", i => {
							let n;
							n = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(e => e.track && e.track.id === i.track.id) : {
								track: i.track
							};
							let r = new Event("track");
							r.track = i.track, r.receiver = n, r.transceiver = {
								receiver: n
							}, r.streams = [t.stream], this.dispatchEvent(r)
						}), t.stream.getTracks().forEach(i => {
							let n;
							n = e.RTCPeerConnection.prototype.getReceivers ? this.getReceivers().find(e => e.track && e.track.id === i.id) : {
								track: i
							};
							let r = new Event("track");
							r.track = i, r.receiver = n, r.transceiver = {
								receiver: n
							}, r.streams = [t.stream], this.dispatchEvent(r)
						})
					}, this.addEventListener("addstream", this._ontrackpoly)), t.apply(this, arguments)
				}
			}
	}

	function r3(e) {
		if ("object" == typeof e && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
			let t = function(e, t) {
				return {
					track: t,
					get dtmf() {
						return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null), this._dtmf
					},
					_pc: e
				}
			};
			if (!e.RTCPeerConnection.prototype.getSenders) {
				e.RTCPeerConnection.prototype.getSenders = function() {
					return this._senders = this._senders || [], this._senders.slice()
				};
				let i = e.RTCPeerConnection.prototype.addTrack;
				e.RTCPeerConnection.prototype.addTrack = function(e, n) {
					let r = i.apply(this, arguments);
					return r || (r = t(this, e), this._senders.push(r)), r
				};
				let n = e.RTCPeerConnection.prototype.removeTrack;
				e.RTCPeerConnection.prototype.removeTrack = function(e) {
					n.apply(this, arguments);
					let t = this._senders.indexOf(e); - 1 !== t && this._senders.splice(t, 1)
				}
			}
			let i = e.RTCPeerConnection.prototype.addStream;
			e.RTCPeerConnection.prototype.addStream = function(e) {
				this._senders = this._senders || [], i.apply(this, [e]), e.getTracks().forEach(e => {
					this._senders.push(t(this, e))
				})
			};
			let n = e.RTCPeerConnection.prototype.removeStream;
			e.RTCPeerConnection.prototype.removeStream = function(e) {
				this._senders = this._senders || [], n.apply(this, [e]), e.getTracks().forEach(e => {
					let t = this._senders.find(t => t.track === e);
					t && this._senders.splice(this._senders.indexOf(t), 1)
				})
			}
		} else if ("object" == typeof e && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
			let t = e.RTCPeerConnection.prototype.getSenders;
			e.RTCPeerConnection.prototype.getSenders = function() {
				let e = t.apply(this, []);
				return e.forEach(e => e._pc = this), e
			}, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
				get() {
					return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf
				}
			})
		}
	}

	function r4(e, t) {
		if (t.version >= 67 || !("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver)) return;
		if (!("getStats" in e.RTCRtpSender.prototype)) {
			let t = e.RTCPeerConnection.prototype.getSenders;
			t && (e.RTCPeerConnection.prototype.getSenders = function() {
				let e = t.apply(this, []);
				return e.forEach(e => e._pc = this), e
			});
			let i = e.RTCPeerConnection.prototype.addTrack;
			i && (e.RTCPeerConnection.prototype.addTrack = function() {
				let e = i.apply(this, arguments);
				return e._pc = this, e
			}), e.RTCRtpSender.prototype.getStats = function() {
				let e = this;
				return this._pc.getStats().then(t => rZ(t, e.track, !0))
			}
		}
		if (!("getStats" in e.RTCRtpReceiver.prototype)) {
			let t = e.RTCPeerConnection.prototype.getReceivers;
			t && (e.RTCPeerConnection.prototype.getReceivers = function() {
				let e = t.apply(this, []);
				return e.forEach(e => e._pc = this), e
			}), rz(e, "track", e => (e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
				let e = this;
				return this._pc.getStats().then(t => rZ(t, e.track, !1))
			}
		}
		if (!("getStats" in e.RTCRtpSender.prototype && "getStats" in e.RTCRtpReceiver.prototype)) return;
		let i = e.RTCPeerConnection.prototype.getStats;
		e.RTCPeerConnection.prototype.getStats = function() {
			if (arguments.length > 0 && arguments[0] instanceof e.MediaStreamTrack) {
				let e, t, i, n = arguments[0];
				return (this.getSenders().forEach(t => {
					t.track === n && (e ? i = !0 : e = t)
				}), this.getReceivers().forEach(e => (e.track === n && (t ? i = !0 : t = e), e.track === n)), i || e && t) ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : e ? e.getStats() : t ? t.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"))
			}
			return i.apply(this, arguments)
		}
	}

	function r9(e) {
		e.RTCPeerConnection.prototype.getLocalStreams = function() {
			return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map(e => this._shimmedLocalStreams[e][0])
		};
		let t = e.RTCPeerConnection.prototype.addTrack;
		e.RTCPeerConnection.prototype.addTrack = function(e, i) {
			if (!i) return t.apply(this, arguments);
			this._shimmedLocalStreams = this._shimmedLocalStreams || {};
			let n = t.apply(this, arguments);
			return this._shimmedLocalStreams[i.id] ? -1 === this._shimmedLocalStreams[i.id].indexOf(n) && this._shimmedLocalStreams[i.id].push(n) : this._shimmedLocalStreams[i.id] = [i, n], n
		};
		let i = e.RTCPeerConnection.prototype.addStream;
		e.RTCPeerConnection.prototype.addStream = function(e) {
			this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach(e => {
				if (this.getSenders().find(t => t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError")
			});
			let t = this.getSenders();
			i.apply(this, arguments);
			let n = this.getSenders().filter(e => -1 === t.indexOf(e));
			this._shimmedLocalStreams[e.id] = [e].concat(n)
		};
		let n = e.RTCPeerConnection.prototype.removeStream;
		e.RTCPeerConnection.prototype.removeStream = function(e) {
			return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], n.apply(this, arguments)
		};
		let r = e.RTCPeerConnection.prototype.removeTrack;
		e.RTCPeerConnection.prototype.removeTrack = function(e) {
			return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e && Object.keys(this._shimmedLocalStreams).forEach(t => {
				let i = this._shimmedLocalStreams[t].indexOf(e); - 1 !== i && this._shimmedLocalStreams[t].splice(i, 1), 1 === this._shimmedLocalStreams[t].length && delete this._shimmedLocalStreams[t]
			}), r.apply(this, arguments)
		}
	}

	function r6(e, t) {
		if (!e.RTCPeerConnection) return;
		if (e.RTCPeerConnection.prototype.addTrack && t.version >= 65) return r9(e);
		let i = e.RTCPeerConnection.prototype.getLocalStreams;
		e.RTCPeerConnection.prototype.getLocalStreams = function() {
			let e = i.apply(this);
			return this._reverseStreams = this._reverseStreams || {}, e.map(e => this._reverseStreams[e.id])
		};
		let n = e.RTCPeerConnection.prototype.addStream;
		e.RTCPeerConnection.prototype.addStream = function(t) {
			if (this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, t.getTracks().forEach(e => {
					if (this.getSenders().find(t => t.track === e)) throw new DOMException("Track already exists.", "InvalidAccessError")
				}), !this._reverseStreams[t.id]) {
				let i = new e.MediaStream(t.getTracks());
				this._streams[t.id] = i, this._reverseStreams[i.id] = t, t = i
			}
			n.apply(this, [t])
		};
		let r = e.RTCPeerConnection.prototype.removeStream;

		function a(e, t) {
			let i = t.sdp;
			return Object.keys(e._reverseStreams || []).forEach(t => {
				let n = e._reverseStreams[t],
					r = e._streams[n.id];
				i = i.replace(RegExp(r.id, "g"), n.id)
			}), new RTCSessionDescription({
				type: t.type,
				sdp: i
			})
		}
		e.RTCPeerConnection.prototype.removeStream = function(e) {
			this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {}, r.apply(this, [this._streams[e.id] || e]), delete this._reverseStreams[this._streams[e.id] ? this._streams[e.id].id : e.id], delete this._streams[e.id]
		}, e.RTCPeerConnection.prototype.addTrack = function(t, i) {
			if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
			let n = [].slice.call(arguments, 1);
			if (1 !== n.length || !n[0].getTracks().find(e => e === t)) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
			if (this.getSenders().find(e => e.track === t)) throw new DOMException("Track already exists.", "InvalidAccessError");
			this._streams = this._streams || {}, this._reverseStreams = this._reverseStreams || {};
			let r = this._streams[i.id];
			if (r) r.addTrack(t), Promise.resolve().then(() => {
				this.dispatchEvent(new Event("negotiationneeded"))
			});
			else {
				let n = new e.MediaStream([t]);
				this._streams[i.id] = n, this._reverseStreams[n.id] = i, this.addStream(n)
			}
			return this.getSenders().find(e => e.track === t)
		}, ["createOffer", "createAnswer"].forEach(function(t) {
			let i = e.RTCPeerConnection.prototype[t];
			e.RTCPeerConnection.prototype[t] = ({
				[t]() {
					let e = arguments,
						t = arguments.length && "function" == typeof arguments[0];
					return t ? i.apply(this, [t => {
						let i = a(this, t);
						e[0].apply(null, [i])
					}, t => {
						e[1] && e[1].apply(null, t)
					}, arguments[2]]) : i.apply(this, arguments).then(e => a(this, e))
				}
			})[t]
		});
		let s = e.RTCPeerConnection.prototype.setLocalDescription;
		e.RTCPeerConnection.prototype.setLocalDescription = function() {
			var e, t;
			let i;
			return arguments.length && arguments[0].type ? (arguments[0] = (e = this, t = arguments[0], i = t.sdp, Object.keys(e._reverseStreams || []).forEach(t => {
				let n = e._reverseStreams[t],
					r = e._streams[n.id];
				i = i.replace(RegExp(n.id, "g"), r.id)
			}), new RTCSessionDescription({
				type: t.type,
				sdp: i
			})), s.apply(this, arguments)) : s.apply(this, arguments)
		};
		let o = Object.getOwnPropertyDescriptor(e.RTCPeerConnection.prototype, "localDescription");
		Object.defineProperty(e.RTCPeerConnection.prototype, "localDescription", {
			get() {
				let e = o.get.apply(this);
				return "" === e.type ? e : a(this, e)
			}
		}), e.RTCPeerConnection.prototype.removeTrack = function(e) {
			let t;
			if ("closed" === this.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
			if (!e._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
			if (e._pc !== this) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
			this._streams = this._streams || {}, Object.keys(this._streams).forEach(i => {
				this._streams[i].getTracks().find(t => e.track === t) && (t = this._streams[i])
			}), t && (1 === t.getTracks().length ? this.removeStream(this._reverseStreams[t.id]) : t.removeTrack(e.track), this.dispatchEvent(new Event("negotiationneeded")))
		}
	}

	function r8(e, t) {
		!e.RTCPeerConnection && e.webkitRTCPeerConnection && (e.RTCPeerConnection = e.webkitRTCPeerConnection), e.RTCPeerConnection && t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(t) {
			let i = e.RTCPeerConnection.prototype[t];
			e.RTCPeerConnection.prototype[t] = ({
				[t]() {
					return arguments[0] = new("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), i.apply(this, arguments)
				}
			})[t]
		})
	}

	function r5(e, t) {
		t.version > 102 || rz(e, "negotiationneeded", e => {
			let i = e.target;
			if (!(t.version < 72) && (!i.getConfiguration || "plan-b" !== i.getConfiguration().sdpSemantics) || "stable" === i.signalingState) return e
		})
	}
	var r7 = Object.freeze({
		__proto__: null,
		fixNegotiationNeeded: r5,
		shimAddTrackRemoveTrack: r6,
		shimAddTrackRemoveTrackWithNative: r9,
		shimGetSendersWithDtmf: r3,
		shimGetUserMedia: r0,
		shimMediaStream: r1,
		shimOnTrack: r2,
		shimPeerConnection: r8,
		shimSenderReceiverGetStats: r4
	});

	function ae(e, t) {
		let i = e && e.navigator;
		if (!i.mediaDevices) return;
		let n = e && e.MediaStreamTrack;
		if (i.getUserMedia = function(e, t, n) {
				rY("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), i.mediaDevices.getUserMedia(e).then(t, n)
			}, !(t.version > 55 && "autoGainControl" in i.mediaDevices.getSupportedConstraints())) {
			let e = function(e, t, i) {
					t in e && !(i in e) && (e[i] = e[t], delete e[t])
				},
				t = i.mediaDevices.getUserMedia.bind(i.mediaDevices);
			if (i.mediaDevices.getUserMedia = function(i) {
					return "object" == typeof i && "object" == typeof i.audio && (e((i = JSON.parse(JSON.stringify(i))).audio, "autoGainControl", "mozAutoGainControl"), e(i.audio, "noiseSuppression", "mozNoiseSuppression")), t(i)
				}, n && n.prototype.getSettings) {
				let t = n.prototype.getSettings;
				n.prototype.getSettings = function() {
					let i = t.apply(this, arguments);
					return e(i, "mozAutoGainControl", "autoGainControl"), e(i, "mozNoiseSuppression", "noiseSuppression"), i
				}
			}
			if (n && n.prototype.applyConstraints) {
				let t = n.prototype.applyConstraints;
				n.prototype.applyConstraints = function(i) {
					return "audio" === this.kind && "object" == typeof i && (e(i = JSON.parse(JSON.stringify(i)), "autoGainControl", "mozAutoGainControl"), e(i, "noiseSuppression", "mozNoiseSuppression")), t.apply(this, [i])
				}
			}
		}
	}

	function at(e) {
		"object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
			get() {
				return {
					receiver: this.receiver
				}
			}
		})
	}

	function ai(e, t) {
		"object" == typeof e && (e.RTCPeerConnection || e.mozRTCPeerConnection) && (!e.RTCPeerConnection && e.mozRTCPeerConnection && (e.RTCPeerConnection = e.mozRTCPeerConnection), t.version < 53 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(t) {
			let i = e.RTCPeerConnection.prototype[t];
			e.RTCPeerConnection.prototype[t] = ({
				[t]() {
					return arguments[0] = new("addIceCandidate" === t ? e.RTCIceCandidate : e.RTCSessionDescription)(arguments[0]), i.apply(this, arguments)
				}
			})[t]
		}))
	}

	function an(e, t) {
		if ("object" != typeof e || !(e.RTCPeerConnection || e.mozRTCPeerConnection) || t.version >= 151) return;
		let i = {
				inboundrtp: "inbound-rtp",
				outboundrtp: "outbound-rtp",
				candidatepair: "candidate-pair",
				localcandidate: "local-candidate",
				remotecandidate: "remote-candidate"
			},
			n = e.RTCPeerConnection.prototype.getStats;
		e.RTCPeerConnection.prototype.getStats = function() {
			let e = Array.prototype.slice.call(arguments),
				r = e[0],
				a = e[1],
				s = e[2];
			return "closed" === this.signalingState ? Promise.resolve(new Map) : n.apply(this, [r || null]).then(e => {
				if (t.version < 53 && !a) try {
					e.forEach(e => {
						e.type = i[e.type] || e.type
					})
				} catch (t) {
					if ("TypeError" !== t.name) throw t;
					e.forEach((t, n) => {
						e.set(n, Object.assign({}, t, {
							type: i[t.type] || t.type
						}))
					})
				}
				return e
			}).then(a, s)
		}
	}

	function ar(e) {
		if (!("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender) || e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype) return;
		let t = e.RTCPeerConnection.prototype.getSenders;
		t && (e.RTCPeerConnection.prototype.getSenders = function() {
			let e = t.apply(this, []);
			return e.forEach(e => e._pc = this), e
		});
		let i = e.RTCPeerConnection.prototype.addTrack;
		i && (e.RTCPeerConnection.prototype.addTrack = function() {
			let e = i.apply(this, arguments);
			return e._pc = this, e
		}), e.RTCRtpSender.prototype.getStats = function() {
			return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map)
		}
	}

	function aa(e) {
		if (!("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender) || e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype) return;
		let t = e.RTCPeerConnection.prototype.getReceivers;
		t && (e.RTCPeerConnection.prototype.getReceivers = function() {
			let e = t.apply(this, []);
			return e.forEach(e => e._pc = this), e
		}), rz(e, "track", e => (e.receiver._pc = e.srcElement, e)), e.RTCRtpReceiver.prototype.getStats = function() {
			return this._pc.getStats(this.track)
		}
	}

	function as(e) {
		!e.RTCPeerConnection || "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function(e) {
			rY("removeStream", "removeTrack"), this.getSenders().forEach(t => {
				t.track && e.getTracks().includes(t.track) && this.removeTrack(t)
			})
		})
	}

	function ao(e) {
		e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel)
	}

	function ac(e, t) {
		if (!("object" == typeof e && e.RTCPeerConnection) || t.version >= 110) return;
		let i = e.RTCPeerConnection.prototype.addTransceiver;
		i && (e.RTCPeerConnection.prototype.addTransceiver = function() {
			this.setParametersPromises = [];
			let e = arguments[1] && arguments[1].sendEncodings;
			void 0 === e && (e = []);
			let t = (e = [...e]).length > 0;
			t && e.forEach(e => {
				if ("rid" in e && !/^[a-z0-9]{0,16}$/i.test(e.rid)) throw TypeError("Invalid RID value provided.");
				if ("scaleResolutionDownBy" in e && !(parseFloat(e.scaleResolutionDownBy) >= 1)) throw RangeError("scale_resolution_down_by must be >= 1.0");
				if ("maxFramerate" in e && !(parseFloat(e.maxFramerate) >= 0)) throw RangeError("max_framerate must be >= 0.0")
			});
			let n = i.apply(this, arguments);
			if (t) {
				let t = n.sender,
					i = t.getParameters();
				"encodings" in i && (1 !== i.encodings.length || 0 !== Object.keys(i.encodings[0]).length) || (i.encodings = e, t.sendEncodings = e, this.setParametersPromises.push(t.setParameters(i).then(() => {
					delete t.sendEncodings
				}).catch(() => {
					delete t.sendEncodings
				})))
			}
			return n
		})
	}

	function al(e, t) {
		if (!("object" == typeof e && e.RTCRtpSender) || t.version >= 110) return;
		let i = e.RTCRtpSender.prototype.getParameters;
		i && (e.RTCRtpSender.prototype.getParameters = function() {
			let e = i.apply(this, arguments);
			return "encodings" in e || (e.encodings = [].concat(this.sendEncodings || [{}])), e
		})
	}

	function ad(e, t) {
		if (!("object" == typeof e && e.RTCPeerConnection) || t.version >= 110) return;
		let i = e.RTCPeerConnection.prototype.createOffer;
		e.RTCPeerConnection.prototype.createOffer = function() {
			return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => i.apply(this, arguments)).finally(() => {
				this.setParametersPromises = []
			}) : i.apply(this, arguments)
		}
	}

	function au(e, t) {
		if (!("object" == typeof e && e.RTCPeerConnection) || t.version >= 110) return;
		let i = e.RTCPeerConnection.prototype.createAnswer;
		e.RTCPeerConnection.prototype.createAnswer = function() {
			return this.setParametersPromises && this.setParametersPromises.length ? Promise.all(this.setParametersPromises).then(() => i.apply(this, arguments)).finally(() => {
				this.setParametersPromises = []
			}) : i.apply(this, arguments)
		}
	}
	var ah = Object.freeze({
		__proto__: null,
		shimAddTransceiver: ac,
		shimCreateAnswer: au,
		shimCreateOffer: ad,
		shimGetDisplayMedia: function(e, t) {
			!e.navigator.mediaDevices || e.navigator.mediaDevices && "getDisplayMedia" in e.navigator.mediaDevices || (e.navigator.mediaDevices.getDisplayMedia = function(i) {
				if (!(i && i.video)) {
					let e = new DOMException("getDisplayMedia without video constraints is undefined");
					return e.name = "NotFoundError", e.code = 8, Promise.reject(e)
				}
				return !0 === i.video ? i.video = {
					mediaSource: t
				} : i.video.mediaSource = t, e.navigator.mediaDevices.getUserMedia(i)
			})
		},
		shimGetParameters: al,
		shimGetStats: an,
		shimGetUserMedia: ae,
		shimOnTrack: at,
		shimPeerConnection: ai,
		shimRTCDataChannel: ao,
		shimReceiverGetStats: aa,
		shimRemoveStream: as,
		shimSenderGetStats: ar
	});

	function ap(e) {
		if ("object" == typeof e && e.RTCPeerConnection) {
			if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function() {
					return this._localStreams || (this._localStreams = []), this._localStreams
				}), !("addStream" in e.RTCPeerConnection.prototype)) {
				let t = e.RTCPeerConnection.prototype.addTrack;
				e.RTCPeerConnection.prototype.addStream = function(e) {
					this._localStreams || (this._localStreams = []), this._localStreams.includes(e) || this._localStreams.push(e), e.getAudioTracks().forEach(i => t.call(this, i, e)), e.getVideoTracks().forEach(i => t.call(this, i, e))
				}, e.RTCPeerConnection.prototype.addTrack = function(e) {
					for (var i = arguments.length, n = Array(i > 1 ? i - 1 : 0), r = 1; r < i; r++) n[r - 1] = arguments[r];
					return n && n.forEach(e => {
						this._localStreams ? this._localStreams.includes(e) || this._localStreams.push(e) : this._localStreams = [e]
					}), t.apply(this, arguments)
				}
			}
			"removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function(e) {
				this._localStreams || (this._localStreams = []);
				let t = this._localStreams.indexOf(e);
				if (-1 === t) return;
				this._localStreams.splice(t, 1);
				let i = e.getTracks();
				this.getSenders().forEach(e => {
					i.includes(e.track) && this.removeTrack(e)
				})
			})
		}
	}

	function am(e) {
		if ("object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function() {
				return this._remoteStreams ? this._remoteStreams : []
			}), !("onaddstream" in e.RTCPeerConnection.prototype))) {
			Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
				get() {
					return this._onaddstream
				},
				set(e) {
					this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly)), this.addEventListener("addstream", this._onaddstream = e), this.addEventListener("track", this._onaddstreampoly = e => {
						e.streams.forEach(e => {
							if (this._remoteStreams || (this._remoteStreams = []), this._remoteStreams.includes(e)) return;
							this._remoteStreams.push(e);
							let t = new Event("addstream");
							t.stream = e, this.dispatchEvent(t)
						})
					})
				}
			});
			let t = e.RTCPeerConnection.prototype.setRemoteDescription;
			e.RTCPeerConnection.prototype.setRemoteDescription = function() {
				let e = this;
				return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function(t) {
					t.streams.forEach(t => {
						if (e._remoteStreams || (e._remoteStreams = []), e._remoteStreams.indexOf(t) >= 0) return;
						e._remoteStreams.push(t);
						let i = new Event("addstream");
						i.stream = t, e.dispatchEvent(i)
					})
				}), t.apply(e, arguments)
			}
		}
	}

	function ag(e) {
		if ("object" != typeof e || !e.RTCPeerConnection) return;
		let t = e.RTCPeerConnection.prototype,
			i = t.createOffer,
			n = t.createAnswer,
			r = t.setLocalDescription,
			a = t.setRemoteDescription,
			s = t.addIceCandidate;
		t.createOffer = function(e, t) {
			let n = arguments.length >= 2 ? arguments[2] : arguments[0],
				r = i.apply(this, [n]);
			return t ? (r.then(e, t), Promise.resolve()) : r
		}, t.createAnswer = function(e, t) {
			let i = arguments.length >= 2 ? arguments[2] : arguments[0],
				r = n.apply(this, [i]);
			return t ? (r.then(e, t), Promise.resolve()) : r
		};
		let o = function(e, t, i) {
			let n = r.apply(this, [e]);
			return i ? (n.then(t, i), Promise.resolve()) : n
		};
		t.setLocalDescription = o, t.setRemoteDescription = o = function(e, t, i) {
			let n = a.apply(this, [e]);
			return i ? (n.then(t, i), Promise.resolve()) : n
		}, t.addIceCandidate = function(e, t, i) {
			let n = s.apply(this, [e]);
			return i ? (n.then(t, i), Promise.resolve()) : n
		}
	}

	function af(e) {
		let t = e && e.navigator;
		if (t.mediaDevices && t.mediaDevices.getUserMedia) {
			let e = t.mediaDevices,
				i = e.getUserMedia.bind(e);
			t.mediaDevices.getUserMedia = e => i(av(e))
		}!t.getUserMedia && t.mediaDevices && t.mediaDevices.getUserMedia && (t.getUserMedia = (function(e, i, n) {
			t.mediaDevices.getUserMedia(e).then(i, n)
		}).bind(t))
	}

	function av(e) {
		return e && void 0 !== e.video ? Object.assign({}, e, {
			video: function e(t) {
				return rX(t) ? Object.keys(t).reduce(function(i, n) {
					let r = rX(t[n]),
						a = r ? e(t[n]) : t[n],
						s = r && !Object.keys(a).length;
					return void 0 === a || s ? i : Object.assign(i, {
						[n]: a
					})
				}, {}) : t
			}(e.video)
		}) : e
	}

	function ak(e) {
		if (!e.RTCPeerConnection) return;
		let t = e.RTCPeerConnection;
		e.RTCPeerConnection = function(e, i) {
			if (e && e.iceServers) {
				let t = [];
				for (let i = 0; i < e.iceServers.length; i++) {
					let n = e.iceServers[i];
					void 0 === n.urls && n.url ? (rY("RTCIceServer.url", "RTCIceServer.urls"), (n = JSON.parse(JSON.stringify(n))).urls = n.url, delete n.url, t.push(n)) : t.push(e.iceServers[i])
				}
				e.iceServers = t
			}
			return new t(e, i)
		}, e.RTCPeerConnection.prototype = t.prototype, "generateCertificate" in t && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
			get: () => t.generateCertificate
		})
	}

	function ay(e) {
		"object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
			get() {
				return {
					receiver: this.receiver
				}
			}
		})
	}

	function ab(e) {
		let t = e.RTCPeerConnection.prototype.createOffer;
		e.RTCPeerConnection.prototype.createOffer = function(e) {
			if (e) {
				void 0 !== e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
				let t = this.getTransceivers().find(e => "audio" === e.receiver.track.kind);
				!1 === e.offerToReceiveAudio && t ? "sendrecv" === t.direction ? t.setDirection ? t.setDirection("sendonly") : t.direction = "sendonly" : "recvonly" === t.direction && (t.setDirection ? t.setDirection("inactive") : t.direction = "inactive") : !0 !== e.offerToReceiveAudio || t || this.addTransceiver("audio", {
					direction: "recvonly"
				}), void 0 !== e.offerToReceiveVideo && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
				let i = this.getTransceivers().find(e => "video" === e.receiver.track.kind);
				!1 === e.offerToReceiveVideo && i ? "sendrecv" === i.direction ? i.setDirection ? i.setDirection("sendonly") : i.direction = "sendonly" : "recvonly" === i.direction && (i.setDirection ? i.setDirection("inactive") : i.direction = "inactive") : !0 !== e.offerToReceiveVideo || i || this.addTransceiver("video", {
					direction: "recvonly"
				})
			}
			return t.apply(this, arguments)
		}
	}

	function aT(e) {
		"object" != typeof e || e.AudioContext || (e.AudioContext = e.webkitAudioContext)
	}
	var aS = Object.freeze({
			__proto__: null,
			shimAudioContext: aT,
			shimCallbacksAPI: ag,
			shimConstraints: av,
			shimCreateOfferLegacy: ab,
			shimGetUserMedia: af,
			shimLocalStreamsAPI: ap,
			shimRTCIceServerUrls: ak,
			shimRemoteStreamsAPI: am,
			shimTrackEventTransceiver: ay
		}),
		aC = {
			exports: {}
		},
		aw = function() {
			let e;
			return el ? aC.exports : (el = 1, (e = {}).generateIdentifier = function() {
				return Math.random().toString(36).substring(2, 12)
			}, e.localCName = e.generateIdentifier(), e.splitLines = function(e) {
				return e.trim().split("\n").map(e => e.trim())
			}, e.splitSections = function(e) {
				return e.split("\nm=").map((e, t) => (t > 0 ? "m=" + e : e).trim() + "\r\n")
			}, e.getDescription = function(t) {
				let i = e.splitSections(t);
				return i && i[0]
			}, e.getMediaSections = function(t) {
				let i = e.splitSections(t);
				return i.shift(), i
			}, e.matchPrefix = function(t, i) {
				return e.splitLines(t).filter(e => 0 === e.indexOf(i))
			}, e.parseCandidate = function(e) {
				let t, i = {
					foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
					component: {
						1: "rtp",
						2: "rtcp"
					} [t[1]] || t[1],
					protocol: t[2].toLowerCase(),
					priority: parseInt(t[3], 10),
					ip: t[4],
					address: t[4],
					port: parseInt(t[5], 10),
					type: t[7]
				};
				for (let e = 8; e < t.length; e += 2) switch (t[e]) {
					case "raddr":
						i.relatedAddress = t[e + 1];
						break;
					case "rport":
						i.relatedPort = parseInt(t[e + 1], 10);
						break;
					case "tcptype":
						i.tcpType = t[e + 1];
						break;
					case "ufrag":
						i.ufrag = t[e + 1], i.usernameFragment = t[e + 1];
						break;
					default:
						void 0 === i[t[e]] && (i[t[e]] = t[e + 1])
				}
				return i
			}, e.writeCandidate = function(e) {
				let t = [];
				t.push(e.foundation);
				let i = e.component;
				"rtp" === i ? t.push(1) : "rtcp" === i ? t.push(2) : t.push(i), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.address || e.ip), t.push(e.port);
				let n = e.type;
				return t.push("typ"), t.push(n), "host" !== n && e.relatedAddress && void 0 !== e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ")
			}, e.parseIceOptions = function(e) {
				return e.substring(14).split(" ")
			}, e.parseRtpMap = function(e) {
				let t = e.substring(9).split(" "),
					i = {
						payloadType: parseInt(t.shift(), 10)
					};
				return i.name = (t = t[0].split("/"))[0], i.clockRate = parseInt(t[1], 10), i.channels = 3 === t.length ? parseInt(t[2], 10) : 1, i.numChannels = i.channels, i
			}, e.writeRtpMap = function(e) {
				let t = e.payloadType;
				void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
				let i = e.channels || e.numChannels || 1;
				return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== i ? "/" + i : "") + "\r\n"
			}, e.parseExtmap = function(e) {
				let t = e.substring(9).split(" ");
				return {
					id: parseInt(t[0], 10),
					direction: t[0].indexOf("/") > 0 ? t[0].split("/")[1] : "sendrecv",
					uri: t[1],
					attributes: t.slice(2).join(" ")
				}
			}, e.writeExtmap = function(e) {
				return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + (e.attributes ? " " + e.attributes : "") + "\r\n"
			}, e.parseFmtp = function(e) {
				let t, i = {},
					n = e.substring(e.indexOf(" ") + 1).split(";");
				for (let e = 0; e < n.length; e++) i[(t = n[e].trim().split("="))[0].trim()] = t[1];
				return i
			}, e.writeFmtp = function(e) {
				let t = "",
					i = e.payloadType;
				if (void 0 !== e.preferredPayloadType && (i = e.preferredPayloadType), e.parameters && Object.keys(e.parameters).length) {
					let n = [];
					Object.keys(e.parameters).forEach(t => {
						void 0 !== e.parameters[t] ? n.push(t + "=" + e.parameters[t]) : n.push(t)
					}), t += "a=fmtp:" + i + " " + n.join(";") + "\r\n"
				}
				return t
			}, e.parseRtcpFb = function(e) {
				let t = e.substring(e.indexOf(" ") + 1).split(" ");
				return {
					type: t.shift(),
					parameter: t.join(" ")
				}
			}, e.writeRtcpFb = function(e) {
				let t = "",
					i = e.payloadType;
				return void 0 !== e.preferredPayloadType && (i = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(e => {
					t += "a=rtcp-fb:" + i + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
				}), t
			}, e.parseSsrcMedia = function(e) {
				let t = e.indexOf(" "),
					i = {
						ssrc: parseInt(e.substring(7, t), 10)
					},
					n = e.indexOf(":", t);
				return n > -1 ? (i.attribute = e.substring(t + 1, n), i.value = e.substring(n + 1)) : i.attribute = e.substring(t + 1), i
			}, e.parseSsrcGroup = function(e) {
				let t = e.substring(13).split(" ");
				return {
					semantics: t.shift(),
					ssrcs: t.map(e => parseInt(e, 10))
				}
			}, e.getMid = function(t) {
				let i = e.matchPrefix(t, "a=mid:")[0];
				if (i) return i.substring(6)
			}, e.parseFingerprint = function(e) {
				let t = e.substring(14).split(" ");
				return {
					algorithm: t[0].toLowerCase(),
					value: t[1].toUpperCase()
				}
			}, e.getDtlsParameters = function(t, i) {
				return {
					role: "auto",
					fingerprints: e.matchPrefix(t + i, "a=fingerprint:").map(e.parseFingerprint)
				}
			}, e.writeDtlsParameters = function(e, t) {
				let i = "a=setup:" + t + "\r\n";
				return e.fingerprints.forEach(e => {
					i += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
				}), i
			}, e.parseCryptoLine = function(e) {
				let t = e.substring(9).split(" ");
				return {
					tag: parseInt(t[0], 10),
					cryptoSuite: t[1],
					keyParams: t[2],
					sessionParams: t.slice(3)
				}
			}, e.writeCryptoLine = function(t) {
				return "a=crypto:" + t.tag + " " + t.cryptoSuite + " " + ("object" == typeof t.keyParams ? e.writeCryptoKeyParams(t.keyParams) : t.keyParams) + (t.sessionParams ? " " + t.sessionParams.join(" ") : "") + "\r\n"
			}, e.parseCryptoKeyParams = function(e) {
				if (0 !== e.indexOf("inline:")) return null;
				let t = e.substring(7).split("|");
				return {
					keyMethod: "inline",
					keySalt: t[0],
					lifeTime: t[1],
					mkiValue: t[2] ? t[2].split(":")[0] : void 0,
					mkiLength: t[2] ? t[2].split(":")[1] : void 0
				}
			}, e.writeCryptoKeyParams = function(e) {
				return e.keyMethod + ":" + e.keySalt + (e.lifeTime ? "|" + e.lifeTime : "") + (e.mkiValue && e.mkiLength ? "|" + e.mkiValue + ":" + e.mkiLength : "")
			}, e.getCryptoParameters = function(t, i) {
				return e.matchPrefix(t + i, "a=crypto:").map(e.parseCryptoLine)
			}, e.getIceParameters = function(t, i) {
				let n = e.matchPrefix(t + i, "a=ice-ufrag:")[0],
					r = e.matchPrefix(t + i, "a=ice-pwd:")[0];
				return n && r ? {
					usernameFragment: n.substring(12),
					password: r.substring(10)
				} : null
			}, e.writeIceParameters = function(e) {
				let t = "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n";
				return e.iceLite && (t += "a=ice-lite\r\n"), t
			}, e.parseRtpParameters = function(t) {
				let i = {
						codecs: [],
						headerExtensions: [],
						fecMechanisms: [],
						rtcp: []
					},
					n = e.splitLines(t)[0].split(" ");
				i.profile = n[2];
				for (let r = 3; r < n.length; r++) {
					let a = n[r],
						s = e.matchPrefix(t, "a=rtpmap:" + a + " ")[0];
					if (s) {
						let n = e.parseRtpMap(s),
							r = e.matchPrefix(t, "a=fmtp:" + a + " ");
						switch (n.parameters = r.length ? e.parseFmtp(r[0]) : {}, n.rtcpFeedback = e.matchPrefix(t, "a=rtcp-fb:" + a + " ").map(e.parseRtcpFb), i.codecs.push(n), n.name.toUpperCase()) {
							case "RED":
							case "ULPFEC":
								i.fecMechanisms.push(n.name.toUpperCase())
						}
					}
				}
				e.matchPrefix(t, "a=extmap:").forEach(t => {
					i.headerExtensions.push(e.parseExtmap(t))
				});
				let r = e.matchPrefix(t, "a=rtcp-fb:* ").map(e.parseRtcpFb);
				return i.codecs.forEach(e => {
					r.forEach(t => {
						e.rtcpFeedback.find(e => e.type === t.type && e.parameter === t.parameter) || e.rtcpFeedback.push(t)
					})
				}), i
			}, e.writeRtpDescription = function(t, i) {
				let n = "";
				n += "m=" + t + " ", n += i.codecs.length > 0 ? "9" : "0", n += " " + (i.profile || "UDP/TLS/RTP/SAVPF") + " ", n += i.codecs.map(e => void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType).join(" ") + "\r\n", n += "c=IN IP4 0.0.0.0\r\n", n += "a=rtcp:9 IN IP4 0.0.0.0\r\n", i.codecs.forEach(t => {
					n += e.writeRtpMap(t), n += e.writeFmtp(t), n += e.writeRtcpFb(t)
				});
				let r = 0;
				return i.codecs.forEach(e => {
					e.maxptime > r && (r = e.maxptime)
				}), r > 0 && (n += "a=maxptime:" + r + "\r\n"), i.headerExtensions && i.headerExtensions.forEach(t => {
					n += e.writeExtmap(t)
				}), n
			}, e.parseRtpEncodingParameters = function(t) {
				let i, n = [],
					r = e.parseRtpParameters(t),
					a = -1 !== r.fecMechanisms.indexOf("RED"),
					s = -1 !== r.fecMechanisms.indexOf("ULPFEC"),
					o = e.matchPrefix(t, "a=ssrc:").map(t => e.parseSsrcMedia(t)).filter(e => "cname" === e.attribute),
					c = o.length > 0 && o[0].ssrc,
					l = e.matchPrefix(t, "a=ssrc-group:FID").map(e => e.substring(17).split(" ").map(e => parseInt(e, 10)));
				l.length > 0 && l[0].length > 1 && l[0][0] === c && (i = l[0][1]), r.codecs.forEach(e => {
					if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
						let t = {
							ssrc: c,
							codecPayloadType: parseInt(e.parameters.apt, 10)
						};
						c && i && (t.rtx = {
							ssrc: i
						}), n.push(t), a && ((t = JSON.parse(JSON.stringify(t))).fec = {
							ssrc: c,
							mechanism: s ? "red+ulpfec" : "red"
						}, n.push(t))
					}
				}), 0 === n.length && c && n.push({
					ssrc: c
				});
				let d = e.matchPrefix(t, "b=");
				return d.length && (d = 0 === d[0].indexOf("b=TIAS:") ? parseInt(d[0].substring(7), 10) : 0 === d[0].indexOf("b=AS:") ? 1e3 * parseInt(d[0].substring(5), 10) * .95 - 16e3 : void 0, n.forEach(e => {
					e.maxBitrate = d
				})), n
			}, e.parseRtcpParameters = function(t) {
				let i = {},
					n = e.matchPrefix(t, "a=ssrc:").map(t => e.parseSsrcMedia(t)).filter(e => "cname" === e.attribute)[0];
				n && (i.cname = n.value, i.ssrc = n.ssrc);
				let r = e.matchPrefix(t, "a=rtcp-rsize");
				return i.reducedSize = r.length > 0, i.compound = 0 === r.length, i.mux = e.matchPrefix(t, "a=rtcp-mux").length > 0, i
			}, e.writeRtcpParameters = function(e) {
				let t = "";
				return e.reducedSize && (t += "a=rtcp-rsize\r\n"), e.mux && (t += "a=rtcp-mux\r\n"), void 0 !== e.ssrc && e.cname && (t += "a=ssrc:" + e.ssrc + " cname:" + e.cname + "\r\n"), t
			}, e.parseMsid = function(t) {
				let i, n = e.matchPrefix(t, "a=msid:");
				if (1 === n.length) return {
					stream: (i = n[0].substring(7).split(" "))[0],
					track: i[1]
				};
				let r = e.matchPrefix(t, "a=ssrc:").map(t => e.parseSsrcMedia(t)).filter(e => "msid" === e.attribute);
				if (r.length > 0) return {
					stream: (i = r[0].value.split(" "))[0],
					track: i[1]
				}
			}, e.parseSctpDescription = function(t) {
				let i, n = e.parseMLine(t),
					r = e.matchPrefix(t, "a=max-message-size:");
				r.length > 0 && (i = parseInt(r[0].substring(19), 10)), isNaN(i) && (i = 65536);
				let a = e.matchPrefix(t, "a=sctp-port:");
				if (a.length > 0) return {
					port: parseInt(a[0].substring(12), 10),
					protocol: n.fmt,
					maxMessageSize: i
				};
				let s = e.matchPrefix(t, "a=sctpmap:");
				if (s.length > 0) {
					let e = s[0].substring(10).split(" ");
					return {
						port: parseInt(e[0], 10),
						protocol: e[1],
						maxMessageSize: i
					}
				}
			}, e.writeSctpDescription = function(e, t) {
				let i = [];
				return i = "DTLS/SCTP" !== e.protocol ? ["m=" + e.kind + " 9 " + e.protocol + " " + t.protocol + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctp-port:" + t.port + "\r\n"] : ["m=" + e.kind + " 9 " + e.protocol + " " + t.port + "\r\n", "c=IN IP4 0.0.0.0\r\n", "a=sctpmap:" + t.port + " " + t.protocol + " 65535\r\n"], void 0 !== t.maxMessageSize && i.push("a=max-message-size:" + t.maxMessageSize + "\r\n"), i.join("")
			}, e.generateSessionId = function() {
				return Math.random().toString().substr(2, 22)
			}, e.writeSessionBoilerplate = function(t, i, n) {
				return "v=0\r\no=" + (n || "thisisadapterortc") + " " + (t || e.generateSessionId()) + " " + (void 0 !== i ? i : 2) + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
			}, e.getDirection = function(t, i) {
				let n = e.splitLines(t);
				for (let e = 0; e < n.length; e++) switch (n[e]) {
					case "a=sendrecv":
					case "a=sendonly":
					case "a=recvonly":
					case "a=inactive":
						return n[e].substring(2)
				}
				return i ? e.getDirection(i) : "sendrecv"
			}, e.getKind = function(t) {
				return e.splitLines(t)[0].split(" ")[0].substring(2)
			}, e.isRejected = function(e) {
				return "0" === e.split(" ", 2)[1]
			}, e.parseMLine = function(t) {
				let i = e.splitLines(t)[0].substring(2).split(" ");
				return {
					kind: i[0],
					port: parseInt(i[1], 10),
					protocol: i[2],
					fmt: i.slice(3).join(" ")
				}
			}, e.parseOLine = function(t) {
				let i = e.matchPrefix(t, "o=")[0].substring(2).split(" ");
				return {
					username: i[0],
					sessionId: i[1],
					sessionVersion: parseInt(i[2], 10),
					netType: i[3],
					addressType: i[4],
					address: i[5]
				}
			}, e.isValidSDP = function(t) {
				if ("string" != typeof t || 0 === t.length) return !1;
				let i = e.splitLines(t);
				for (let e = 0; e < i.length; e++)
					if (i[e].length < 2 || "=" !== i[e].charAt(1)) return !1;
				return !0
			}, aC.exports = e, aC.exports)
		}(),
		aE = aw && aw.__esModule && Object.prototype.hasOwnProperty.call(aw, "default") ? aw.default : aw,
		aR = (m = {
			__proto__: null,
			default: aE
		}, [aw].forEach(function(e) {
			e && "string" != typeof e && !Array.isArray(e) && Object.keys(e).forEach(function(t) {
				if ("default" !== t && !(t in m)) {
					var i = Object.getOwnPropertyDescriptor(e, t);
					Object.defineProperty(m, t, i.get ? i : {
						enumerable: !0,
						get: function() {
							return e[t]
						}
					})
				}
			})
		}), Object.freeze(m));

	function aP(e) {
		if (!e.RTCIceCandidate || e.RTCIceCandidate && "foundation" in e.RTCIceCandidate.prototype) return;
		let t = e.RTCIceCandidate;
		e.RTCIceCandidate = function(e) {
			if ("object" == typeof e && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substring(2)), e.candidate && e.candidate.length) {
				let i = new t(e),
					n = aE.parseCandidate(e.candidate);
				for (let e in n) e in i || Object.defineProperty(i, e, {
					value: n[e]
				});
				return i.toJSON = function() {
					return {
						candidate: i.candidate,
						sdpMid: i.sdpMid,
						sdpMLineIndex: i.sdpMLineIndex,
						usernameFragment: i.usernameFragment
					}
				}, i
			}
			return new t(e)
		}, e.RTCIceCandidate.prototype = t.prototype, rz(e, "icecandidate", t => (t.candidate && Object.defineProperty(t, "candidate", {
			value: new e.RTCIceCandidate(t.candidate),
			writable: "false"
		}), t))
	}

	function aI(e) {
		!e.RTCIceCandidate || e.RTCIceCandidate && "relayProtocol" in e.RTCIceCandidate.prototype || rz(e, "icecandidate", e => {
			if (e.candidate) {
				let t = aE.parseCandidate(e.candidate.candidate);
				"relay" === t.type && (e.candidate.relayProtocol = ({
					0: "tls",
					1: "tcp",
					2: "udp"
				})[t.priority >> 24])
			}
			return e
		})
	}

	function aD(e, t) {
		if (!e.RTCPeerConnection || "chrome" === t.browser && t.version > 102 || "firefox" === t.browser && t.version >= 113) return;
		"sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
			get() {
				return void 0 === this._sctp ? null : this._sctp
			}
		});
		let i = function(e) {
				if (!e || !e.sdp) return !1;
				let t = aE.splitSections(e.sdp);
				return t.shift(), t.some(e => {
					let t = aE.parseMLine(e);
					return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP")
				})
			},
			n = function(e) {
				let t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
				if (null === t || t.length < 2) return -1;
				let i = parseInt(t[1], 10);
				return i != i ? -1 : i
			},
			r = function(e) {
				let i = 65536;
				return "firefox" === t.browser && (i = t.version < 57 ? -1 === e ? 16384 : 0x7ffffff5 : t.version < 60 ? 57 === t.version ? 65535 : 65536 : 0x7ffffff5), i
			},
			a = function(e, i) {
				let n = 65536;
				"firefox" === t.browser && 57 === t.version && (n = 65535);
				let r = aE.matchPrefix(e.sdp, "a=max-message-size:");
				return r.length > 0 ? n = parseInt(r[0].substring(19), 10) : "firefox" === t.browser && -1 !== i && (n = 0x7ffffff5), n
			},
			s = e.RTCPeerConnection.prototype.setRemoteDescription;
		e.RTCPeerConnection.prototype.setRemoteDescription = function() {
			if (this._sctp = null, "chrome" === t.browser && t.version >= 76 && "plan-b" === this.getConfiguration().sdpSemantics && Object.defineProperty(this, "sctp", {
					get() {
						return void 0 === this._sctp ? null : this._sctp
					},
					enumerable: !0,
					configurable: !0
				}), i(arguments[0])) {
				let e, t = n(arguments[0]),
					i = r(t),
					s = a(arguments[0], t);
				e = 0 === i && 0 === s ? 1 / 0 : 0 === i || 0 === s ? Math.max(i, s) : Math.min(i, s);
				let o = {};
				Object.defineProperty(o, "maxMessageSize", {
					get: () => e
				}), this._sctp = o
			}
			return s.apply(this, arguments)
		}
	}

	function aM(e, t) {
		if (!(e.RTCPeerConnection && "createDataChannel" in e.RTCPeerConnection.prototype) || "chrome" === t.browser && t.version >= 149 || "firefox" === t.browser && t.version > 60) return;

		function i(e, t) {
			let i = e.send;
			e.send = function() {
				let n = arguments[0],
					r = n.length || n.size || n.byteLength;
				if ("open" === e.readyState && t.sctp && r > t.sctp.maxMessageSize) throw TypeError("Message too large (can send a maximum of " + t.sctp.maxMessageSize + " bytes)");
				return i.apply(e, arguments)
			}
		}
		let n = e.RTCPeerConnection.prototype.createDataChannel;
		e.RTCPeerConnection.prototype.createDataChannel = function() {
			let e = n.apply(this, arguments);
			return i(e, this), e
		}, rz(e, "datachannel", e => (i(e.channel, e.target), e))
	}

	function a_(e) {
		if (!e.RTCPeerConnection || "connectionState" in e.RTCPeerConnection.prototype) return;
		let t = e.RTCPeerConnection.prototype;
		Object.defineProperty(t, "connectionState", {
			get() {
				return ({
					completed: "connected",
					checking: "connecting"
				})[this.iceConnectionState] || this.iceConnectionState
			},
			enumerable: !0,
			configurable: !0
		}), Object.defineProperty(t, "onconnectionstatechange", {
			get() {
				return this._onconnectionstatechange || null
			},
			set(e) {
				this._onconnectionstatechange && (this.removeEventListener("connectionstatechange", this._onconnectionstatechange), delete this._onconnectionstatechange), e && this.addEventListener("connectionstatechange", this._onconnectionstatechange = e)
			},
			enumerable: !0,
			configurable: !0
		}), ["setLocalDescription", "setRemoteDescription"].forEach(e => {
			let i = t[e];
			t[e] = function() {
				return this._connectionstatechangepoly || (this._connectionstatechangepoly = e => {
					let t = e.target;
					if (t._lastConnectionState !== t.connectionState) {
						t._lastConnectionState = t.connectionState;
						let i = new Event("connectionstatechange", e);
						t.dispatchEvent(i)
					}
					return e
				}, this.addEventListener("iceconnectionstatechange", this._connectionstatechangepoly)), i.apply(this, arguments)
			}
		})
	}

	function aO(e, t) {
		if (!e.RTCPeerConnection || "chrome" === t.browser && t.version >= 71 || "safari" === t.browser && t._safariVersion >= 13.1) return;
		let i = e.RTCPeerConnection.prototype.setRemoteDescription;
		e.RTCPeerConnection.prototype.setRemoteDescription = function(t) {
			if (t && t.sdp && -1 !== t.sdp.indexOf("\na=extmap-allow-mixed")) {
				let i = t.sdp.split("\n").filter(e => "a=extmap-allow-mixed" !== e.trim()).join("\n");
				e.RTCSessionDescription && t instanceof e.RTCSessionDescription ? arguments[0] = new e.RTCSessionDescription({
					type: t.type,
					sdp: i
				}) : t.sdp = i
			}
			return i.apply(this, arguments)
		}
	}

	function aA(e, t) {
		if (!(e.RTCPeerConnection && e.RTCPeerConnection.prototype)) return;
		let i = e.RTCPeerConnection.prototype.addIceCandidate;
		i && 0 !== i.length && (e.RTCPeerConnection.prototype.addIceCandidate = function() {
			return arguments[0] ? ("chrome" === t.browser && t.version < 78 || "firefox" === t.browser && t.version < 68 || "safari" === t.browser) && arguments[0] && "" === arguments[0].candidate ? Promise.resolve() : i.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
		})
	}

	function ax(e, t) {
		if (!(e.RTCPeerConnection && e.RTCPeerConnection.prototype)) return;
		let i = e.RTCPeerConnection.prototype.setLocalDescription;
		i && 0 !== i.length && (e.RTCPeerConnection.prototype.setLocalDescription = function() {
			let e = arguments[0] || {};
			if ("object" != typeof e || e.type && e.sdp) return i.apply(this, arguments);
			if (!(e = {
					type: e.type,
					sdp: e.sdp
				}).type) switch (this.signalingState) {
				case "stable":
				case "have-local-offer":
				case "have-remote-pranswer":
					e.type = "offer";
					break;
				default:
					e.type = "answer"
			}
			return e.sdp || "offer" !== e.type && "answer" !== e.type ? i.apply(this, [e]) : ("offer" === e.type ? this.createOffer : this.createAnswer).apply(this).then(e => i.apply(this, [e]))
		})
	}
	var aL = Object.freeze({
		__proto__: null,
		removeExtmapAllowMixed: aO,
		shimAddIceCandidateNullOrEmpty: aA,
		shimConnectionState: a_,
		shimMaxMessageSize: aD,
		shimParameterlessSetLocalDescription: ax,
		shimRTCIceCandidate: aP,
		shimRTCIceCandidateRelayProtocol: aI,
		shimSendThrowTypeError: aM
	});
	! function() {
		let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
			t = e.window,
			i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
				shimChrome: !0,
				shimFirefox: !0,
				shimSafari: !0
			},
			n = rQ,
			r = function(e) {
				let t = {
					browser: null,
					version: null
				};
				if (void 0 === e || !e.navigator || !e.navigator.userAgent) return t.browser = "Not a browser.", t;
				let i = e.navigator;
				if (i.userAgentData && i.userAgentData.brands) {
					let e = i.userAgentData.brands.find(e => "Chromium" === e.brand);
					if (e) {
						let t = parseInt(e.version, 10);
						if (t >= 90) return {
							browser: "chrome",
							version: t
						}
					}
				}
				return i.mozGetUserMedia ? (t.browser = "firefox", t.version = parseInt(rK(i.userAgent, /Firefox\/(\d+)\./, 1))) : i.webkitGetUserMedia || !1 === e.isSecureContext && e.webkitRTCPeerConnection ? (t.browser = "chrome", t.version = parseInt(rK(i.userAgent, /Chrom(e|ium)\/(\d+)\./, 2)) || null) : e.RTCPeerConnection && i.userAgent.match(/AppleWebKit\/(\d+)\./) ? (t.browser = "safari", t.version = parseInt(rK(i.userAgent, /AppleWebKit\/(\d+)\./, 1)), t.supportsUnifiedPlan = e.RTCRtpTransceiver && "currentDirection" in e.RTCRtpTransceiver.prototype, t._safariVersion = rK(i.userAgent, /Version\/(\d+(\.?\d+))/, 1)) : t.browser = "Not a supported browser.", t
			}(t),
			a = {
				browserDetails: r,
				commonShim: aL,
				extractVersion: rK,
				disableLog: rJ,
				disableWarnings: rG,
				sdp: aR
			};
		switch (r.browser) {
			case "chrome":
				if (!r7 || !r8 || !i.shimChrome) {
					n("Chrome shim is not included in this adapter release.");
					break
				}
				if (null === r.version) {
					n("Chrome shim can not determine version, not shimming.");
					break
				}
				n("adapter.js shimming chrome."), a.browserShim = r7, aA(t, r), ax(t), r0(t, r), r1(t), r8(t, r), r2(t, r), r6(t, r), r3(t), r4(t, r), r5(t, r), aP(t), aI(t), a_(t), aD(t, r), aM(t, r), aO(t, r);
				break;
			case "firefox":
				if (!ah || !ai || !i.shimFirefox) {
					n("Firefox shim is not included in this adapter release.");
					break
				}
				n("adapter.js shimming firefox."), a.browserShim = ah, aA(t, r), ax(t), ae(t, r), ai(t, r), an(t, r), at(t), as(t), ar(t), aa(t), ao(t), ac(t, r), al(t, r), ad(t, r), au(t, r), aP(t), a_(t), aD(t, r), aM(t, r);
				break;
			case "safari":
				if (!aS || !i.shimSafari) {
					n("Safari shim is not included in this adapter release.");
					break
				}
				n("adapter.js shimming safari."), a.browserShim = aS, aA(t, r), ax(t), ak(t), ab(t), ag(t), ap(t), am(t), ay(t), af(t), aT(t), aP(t), aI(t), aD(t, r), aM(t, r), aO(t, r);
				break;
			default:
				n("Unsupported browser!")
		}
	}({
		window: "u" < typeof window ? void 0 : window
	});
	class aN extends(ed = Promise) {
		constructor(e) {
			super(e)
		} catch (e) {
			return super.catch(e)
		}
		static reject(e) {
			return super.reject(e)
		}
		static all(e) {
			return super.all(e)
		}
		static race(e) {
			return super.race(e)
		}
	}
	aN.resolve = e => Reflect.get(ed, "resolve", aN).call(aN, e);
	let aU = /version\/(\d+(\.?_?\d+)+)/i;

	function aF(e) {
		let i = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
		if (void 0 === e && "u" < typeof navigator) return;
		let n = (null != e ? e : navigator.userAgent).toLowerCase();
		if (void 0 === t || i) {
			let e = aB.find(e => e.test.test(n));
			t = null == e ? void 0 : e.describe(n)
		}
		return t
	}
	let aB = [{
		test: /firefox|iceweasel|fxios/i,
		describe: e => ({
			name: "Firefox",
			version: aj(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e),
			os: e.toLowerCase().includes("fxios") ? "iOS" : void 0,
			osVersion: aq(e)
		})
	}, {
		test: /chrom|crios|crmo/i,
		describe: e => ({
			name: "Chrome",
			version: aj(/(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e),
			os: e.toLowerCase().includes("crios") ? "iOS" : void 0,
			osVersion: aq(e)
		})
	}, {
		test: /safari|applewebkit/i,
		describe: e => ({
			name: "Safari",
			version: aj(aU, e),
			os: e.includes("mobile/") ? "iOS" : "macOS",
			osVersion: aq(e)
		})
	}];

	function aj(e, t) {
		let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
			n = t.match(e);
		return n && n.length >= i && n[i] || ""
	}

	function aq(e) {
		return e.includes("mac os") ? aj(/\(.+?(\d+_\d+(:?_\d+)?)/, e, 1).replace(/_/g, ".") : void 0
	}
	let aV = "2.20.2";
	class aH extends Error {
		constructor(e, t, i) {
			super(t || "an error has occurred"), this.name = "LiveKitError", this.code = e, void 0 !== (null == i ? void 0 : i.cause) && (this.cause = null == i ? void 0 : i.cause)
		}
	}
	class aW extends aH {}(g = eu || (eu = {}))[g.NotAllowed = 0] = "NotAllowed", g[g.ServerUnreachable = 1] = "ServerUnreachable", g[g.InternalError = 2] = "InternalError", g[g.Cancelled = 3] = "Cancelled", g[g.LeaveRequest = 4] = "LeaveRequest", g[g.Timeout = 5] = "Timeout", g[g.WebSocket = 6] = "WebSocket", g[g.ServiceNotFound = 7] = "ServiceNotFound";
	class aK extends aW {
		constructor(e, t, i, n) {
			super(1, e), this.name = "ConnectionError", this.status = i, this.reason = t, this.context = n, this.reasonName = eu[t]
		}
		static notAllowed(e, t, i) {
			return new aK(e, eu.NotAllowed, t, i)
		}
		static timeout(e) {
			return new aK(e, eu.Timeout)
		}
		static leaveRequest(e, t) {
			return new aK(e, eu.LeaveRequest, void 0, t)
		}
		static internal(e, t) {
			return new aK(e, eu.InternalError, void 0, t)
		}
		static cancelled(e) {
			return new aK(e, eu.Cancelled)
		}
		static serverUnreachable(e, t) {
			return new aK(e, eu.ServerUnreachable, t)
		}
		static websocket(e, t, i) {
			return new aK(e, eu.WebSocket, t, i)
		}
		static serviceNotFound(e, t) {
			return new aK(e, eu.ServiceNotFound, void 0, t)
		}
	}
	class az extends aH {
		constructor(e) {
			super(21, null != e ? e : "device is unsupported"), this.name = "DeviceUnsupportedError"
		}
	}
	class aJ extends aH {
		constructor(e) {
			super(20, null != e ? e : "track is invalid"), this.name = "TrackInvalidError"
		}
	}
	class aG extends aH {
		constructor(e) {
			super(10, e || "unsupported server"), this.name = "UnsupportedServer"
		}
	}
	class aQ extends aH {
		constructor(e) {
			super(12, e || "unexpected connection state"), this.name = "UnexpectedConnectionState"
		}
	}
	class aY extends aH {
		constructor(e) {
			super(13, e || "unable to negotiate"), this.name = "NegotiationError"
		}
	}
	class aX extends aH {
		constructor(e) {
			super(14, e || "unable to publish data"), this.name = "PublishDataError"
		}
	}
	class aZ extends aH {
		constructor(e, t) {
			super(15, e), this.name = "PublishTrackError", this.status = t
		}
	}
	class a$ extends aW {
		constructor(e, t) {
			super(15, e), this.name = "SignalRequestError", this.reason = t, this.reasonName = "string" == typeof t ? t : ry[t]
		}
	}(f = eh || (eh = {}))[f.AlreadyOpened = 0] = "AlreadyOpened", f[f.AbnormalEnd = 1] = "AbnormalEnd", f[f.DecodeFailed = 2] = "DecodeFailed", f[f.LengthExceeded = 3] = "LengthExceeded", f[f.Incomplete = 4] = "Incomplete", f[f.HandlerAlreadyRegistered = 7] = "HandlerAlreadyRegistered", f[f.EncryptionTypeMismatch = 8] = "EncryptionTypeMismatch";
	class a0 extends aW {
		constructor(e, t) {
			super(16, e), this.name = "DataStreamError", this.reason = t, this.reasonName = eh[t]
		}
	}
	class a1 extends aH {
		constructor(e) {
			super(18, e), this.name = "SignalReconnectError"
		}
	}(v = ep || (ep = {})).PermissionDenied = "PermissionDenied", v.NotFound = "NotFound", v.DeviceInUse = "DeviceInUse", v.Other = "Other", (k = ep || (ep = {})).getFailure = function(e) {
		if (e && "name" in e) return "NotFoundError" === e.name || "DevicesNotFoundError" === e.name ? k.NotFound : "NotAllowedError" === e.name || "PermissionDeniedError" === e.name ? k.PermissionDenied : "NotReadableError" === e.name || "TrackStartError" === e.name ? k.DeviceInUse : k.Other
	};
	class a2 {}
	a2.setTimeout = function() {
		return setTimeout(...arguments)
	}, a2.setInterval = function() {
		return setInterval(...arguments)
	}, a2.clearTimeout = function() {
		return clearTimeout(...arguments)
	}, a2.clearInterval = function() {
		return clearInterval(...arguments)
	}, (y = em || (em = {})).Connected = "connected", y.Reconnecting = "reconnecting", y.SignalReconnecting = "signalReconnecting", y.Reconnected = "reconnected", y.Disconnected = "disconnected", y.ConnectionStateChanged = "connectionStateChanged", y.Moved = "moved", y.MediaDevicesChanged = "mediaDevicesChanged", y.ParticipantConnected = "participantConnected", y.ParticipantDisconnected = "participantDisconnected", y.TrackPublished = "trackPublished", y.TrackSubscribed = "trackSubscribed", y.TrackSubscriptionFailed = "trackSubscriptionFailed", y.TrackUnpublished = "trackUnpublished", y.TrackUnsubscribed = "trackUnsubscribed", y.TrackMuted = "trackMuted", y.TrackUnmuted = "trackUnmuted", y.LocalTrackPublished = "localTrackPublished", y.LocalTrackUnpublished = "localTrackUnpublished", y.LocalAudioSilenceDetected = "localAudioSilenceDetected", y.ActiveSpeakersChanged = "activeSpeakersChanged", y.ParticipantMetadataChanged = "participantMetadataChanged", y.ParticipantNameChanged = "participantNameChanged", y.ParticipantAttributesChanged = "participantAttributesChanged", y.ParticipantActive = "participantActive", y.RoomMetadataChanged = "roomMetadataChanged", y.DataReceived = "dataReceived", y.SipDTMFReceived = "sipDTMFReceived", y.TranscriptionReceived = "transcriptionReceived", y.ConnectionQualityChanged = "connectionQualityChanged", y.TrackStreamStateChanged = "trackStreamStateChanged", y.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", y.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", y.AudioPlaybackStatusChanged = "audioPlaybackChanged", y.VideoPlaybackStatusChanged = "videoPlaybackChanged", y.MediaDevicesError = "mediaDevicesError", y.ParticipantPermissionsChanged = "participantPermissionsChanged", y.SignalConnected = "signalConnected", y.RecordingStatusChanged = "recordingStatusChanged", y.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", y.EncryptionError = "encryptionError", y.DCBufferStatusChanged = "dcBufferStatusChanged", y.ActiveDeviceChanged = "activeDeviceChanged", y.ChatMessage = "chatMessage", y.LocalTrackSubscribed = "localTrackSubscribed", y.MetricsReceived = "metricsReceived", y.DataTrackPublished = "dataTrackPublished", y.DataTrackUnpublished = "dataTrackUnpublished", y.LocalDataTrackPublished = "localDataTrackPublished", y.LocalDataTrackUnpublished = "localDataTrackUnpublished", (b = eg || (eg = {})).TrackPublished = "trackPublished", b.TrackSubscribed = "trackSubscribed", b.TrackSubscriptionFailed = "trackSubscriptionFailed", b.TrackUnpublished = "trackUnpublished", b.TrackUnsubscribed = "trackUnsubscribed", b.TrackMuted = "trackMuted", b.TrackUnmuted = "trackUnmuted", b.LocalTrackPublished = "localTrackPublished", b.LocalTrackUnpublished = "localTrackUnpublished", b.LocalTrackCpuConstrained = "localTrackCpuConstrained", b.LocalSenderCreated = "localSenderCreated", b.ParticipantMetadataChanged = "participantMetadataChanged", b.ParticipantNameChanged = "participantNameChanged", b.DataReceived = "dataReceived", b.SipDTMFReceived = "sipDTMFReceived", b.TranscriptionReceived = "transcriptionReceived", b.IsSpeakingChanged = "isSpeakingChanged", b.ConnectionQualityChanged = "connectionQualityChanged", b.TrackStreamStateChanged = "trackStreamStateChanged", b.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", b.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", b.TrackCpuConstrained = "trackCpuConstrained", b.MediaDevicesError = "mediaDevicesError", b.AudioStreamAcquired = "audioStreamAcquired", b.ParticipantPermissionsChanged = "participantPermissionsChanged", b.PCTrackAdded = "pcTrackAdded", b.AttributesChanged = "attributesChanged", b.LocalTrackSubscribed = "localTrackSubscribed", b.ChatMessage = "chatMessage", b.Active = "active", (T = ef || (ef = {})).TransportsCreated = "transportsCreated", T.Connected = "connected", T.Disconnected = "disconnected", T.Resuming = "resuming", T.Resumed = "resumed", T.Restarting = "restarting", T.Restarted = "restarted", T.SignalResumed = "signalResumed", T.SignalRestarted = "signalRestarted", T.Closing = "closing", T.MediaTrackAdded = "mediaTrackAdded", T.ActiveSpeakersUpdate = "activeSpeakersUpdate", T.DataPacketReceived = "dataPacketReceived", T.RTPVideoMapUpdate = "rtpVideoMapUpdate", T.DCBufferStatusChanged = "dcBufferStatusChanged", T.ParticipantUpdate = "participantUpdate", T.RoomUpdate = "roomUpdate", T.SpeakersChanged = "speakersChanged", T.StreamStateChanged = "streamStateChanged", T.ConnectionQualityUpdate = "connectionQualityUpdate", T.SubscriptionError = "subscriptionError", T.SubscriptionPermissionUpdate = "subscriptionPermissionUpdate", T.RemoteMute = "remoteMute", T.SubscribedQualityUpdate = "subscribedQualityUpdate", T.LocalTrackUnpublished = "localTrackUnpublished", T.LocalTrackSubscribed = "localTrackSubscribed", T.Offline = "offline", T.SignalRequestResponse = "signalRequestResponse", T.SignalConnected = "signalConnected", T.RoomMoved = "roomMoved", T.PublishDataTrackResponse = "publishDataTrackResponse", T.UnPublishDataTrackResponse = "unPublishDataTrackResponse", T.DataTrackSubscriberHandles = "dataTrackSubscriberHandles", T.DataTrackPacketReceived = "dataTrackPacketReceived", T.Joined = "joined", T.TokenRefreshed = "tokenRefreshed", T.ServerRegionsReported = "serverRegionsReported", (S = ev || (ev = {})).Message = "message", S.Muted = "muted", S.Unmuted = "unmuted", S.Restarted = "restarted", S.Ended = "ended", S.Subscribed = "subscribed", S.Unsubscribed = "unsubscribed", S.CpuConstrained = "cpuConstrained", S.UpdateSettings = "updateSettings", S.UpdateSubscription = "updateSubscription", S.AudioPlaybackStarted = "audioPlaybackStarted", S.AudioPlaybackFailed = "audioPlaybackFailed", S.AudioSilenceDetected = "audioSilenceDetected", S.VisibilityChanged = "visibilityChanged", S.VideoDimensionsChanged = "videoDimensionsChanged", S.VideoPlaybackStarted = "videoPlaybackStarted", S.VideoPlaybackFailed = "videoPlaybackFailed", S.ElementAttached = "elementAttached", S.ElementDetached = "elementDetached", S.UpstreamPaused = "upstreamPaused", S.UpstreamResumed = "upstreamResumed", S.SubscriptionPermissionChanged = "subscriptionPermissionChanged", S.SubscriptionStatusChanged = "subscriptionStatusChanged", S.SubscriptionFailed = "subscriptionFailed", S.TrackProcessorUpdate = "trackProcessorUpdate", S.AudioTrackFeatureUpdate = "audioTrackFeatureUpdate", S.TranscriptionReceived = "transcriptionReceived", S.TimeSyncUpdate = "timeSyncUpdate", S.PreConnectBufferFlushed = "preConnectBufferFlushed";
	class a3 {
		constructor(e, t, i, n, r) {
			if ("object" == typeof e) this.width = e.width, this.height = e.height, this.aspectRatio = e.aspectRatio, this.encoding = {
				maxBitrate: e.maxBitrate,
				maxFramerate: e.maxFramerate,
				priority: e.priority
			};
			else if (void 0 !== t && void 0 !== i) this.width = e, this.height = t, this.aspectRatio = e / t, this.encoding = {
				maxBitrate: i,
				maxFramerate: n,
				priority: r
			};
			else throw TypeError("Unsupported options: provide at least width, height and maxBitrate")
		}
		get resolution() {
			return {
				width: this.width,
				height: this.height,
				frameRate: this.encoding.maxFramerate,
				aspectRatio: this.aspectRatio
			}
		}
	}
	let a4 = ["opus", "red"],
		a9 = ["vp8", "h264"],
		a6 = ["vp8", "h264", "vp9", "av1", "h265"];

	function a8(e) {
		return !!a9.find(t => t === e)
	}(C = ek || (ek = {}))[C.PREFER_REGRESSION = 0] = "PREFER_REGRESSION", C[C.SIMULCAST = 1] = "SIMULCAST", C[C.REGRESSION = 2] = "REGRESSION", (w = ey || (ey = {})).telephone = {
		maxBitrate: 12e3
	}, w.speech = {
		maxBitrate: 24e3
	}, w.music = {
		maxBitrate: 48e3
	}, w.musicStereo = {
		maxBitrate: 64e3
	}, w.musicHighQuality = {
		maxBitrate: 96e3
	}, w.musicHighQualityStereo = {
		maxBitrate: 128e3
	};
	let a5 = {
			h90: new a3(160, 90, 9e4, 20),
			h180: new a3(320, 180, 16e4, 20),
			h216: new a3(384, 216, 18e4, 20),
			h360: new a3(640, 360, 45e4, 20),
			h540: new a3(960, 540, 8e5, 25),
			h720: new a3(1280, 720, 17e5, 30),
			h1080: new a3(1920, 1080, 3e6, 30),
			h1440: new a3(2560, 1440, 5e6, 30),
			h2160: new a3(3840, 2160, 8e6, 30)
		},
		a7 = {
			h120: new a3(160, 120, 7e4, 20),
			h180: new a3(240, 180, 125e3, 20),
			h240: new a3(320, 240, 14e4, 20),
			h360: new a3(480, 360, 33e4, 20),
			h480: new a3(640, 480, 5e5, 20),
			h540: new a3(720, 540, 6e5, 25),
			h720: new a3(960, 720, 13e5, 30),
			h1080: new a3(1440, 1080, 23e5, 30),
			h1440: new a3(1920, 1440, 38e5, 30)
		},
		se = {
			h360fps3: new a3(640, 360, 2e5, 3, "medium"),
			h360fps15: new a3(640, 360, 4e5, 15, "medium"),
			h720fps5: new a3(1280, 720, 8e5, 5, "medium"),
			h720fps15: new a3(1280, 720, 15e5, 15, "medium"),
			h720fps30: new a3(1280, 720, 2e6, 30, "medium"),
			h1080fps15: new a3(1920, 1080, 25e5, 15, "medium"),
			h1080fps30: new a3(1920, 1080, 5e6, 30, "medium"),
			original: new a3(0, 0, 7e6, 30, "medium")
		};

	function st(e, t, i) {
		var n, r;
		let a = sd(null != e ? e : {}),
			s = a.optionsWithoutProcessor,
			o = a.audioProcessor,
			c = a.videoProcessor,
			l = null == t ? void 0 : t.processor,
			d = null == i ? void 0 : i.processor,
			u = null != s ? s : {};
		return !0 === u.audio && (u.audio = {}), !0 === u.video && (u.video = {}), u.audio && (si(u.audio, t), null != (n = u.audio).deviceId || (n.deviceId = {
			ideal: "default"
		}), (o || l) && (u.audio.processor = null != o ? o : l)), u.video && (si(u.video, i), null != (r = u.video).deviceId || (r.deviceId = {
			ideal: "default"
		}), (c || d) && (u.video.processor = null != c ? c : d)), u
	}

	function si(e, t) {
		return Object.keys(t).forEach(i => {
			void 0 === e[i] && (e[i] = t[i])
		}), e
	}

	function sn(e) {
		var t, i;
		let n = {};
		if (e.video)
			if ("object" == typeof e.video) {
				let i = {},
					r = e.video;
				Object.keys(r).forEach(e => {
					"resolution" === e ? si(i, r.resolution) : i[e] = r[e]
				}), n.video = i, null != (t = n.video).deviceId || (t.deviceId = {
					ideal: "default"
				})
			} else n.video = !!e.video && {
				deviceId: {
					ideal: "default"
				}
			};
		else n.video = !1;
		return e.audio ? "object" == typeof e.audio ? (n.audio = e.audio, null != (i = n.audio).deviceId || (i.deviceId = {
			ideal: "default"
		})) : n.audio = {
			deviceId: {
				ideal: "default"
			}
		} : n.audio = !1, n
	}

	function sr(e) {
		return rF(this, arguments, void 0, function(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200;
			return function*() {
				let i = sa();
				if (i) {
					let n = i.createAnalyser();
					n.fftSize = 2048;
					let r = new Uint8Array(n.frequencyBinCount);
					i.createMediaStreamSource(new MediaStream([e.mediaStreamTrack])).connect(n), yield sv(t), n.getByteTimeDomainData(r);
					let a = r.some(e => 128 !== e && 0 !== e);
					return i.close(), !a
				}
				return !1
			}()
		})
	}

	function sa() {
		var e;
		let t = "u" > typeof window && (window.AudioContext || window.webkitAudioContext);
		if (t) {
			let i = new t({
				latencyHint: "interactive"
			});
			if ("suspended" === i.state && "u" > typeof window && (null == (e = window.document) ? void 0 : e.body)) {
				let e = () => rF(this, void 0, void 0, function*() {
					var t;
					try {
						"suspended" === i.state && (yield i.resume())
					} catch (e) {
						console.warn("Error trying to auto-resume audio context", e)
					} finally {
						null == (t = window.document.body) || t.removeEventListener("click", e)
					}
				});
				i.addEventListener("statechange", () => {
					var t;
					"closed" === i.state && (null == (t = window.document.body) || t.removeEventListener("click", e))
				}), window.document.body.addEventListener("click", e)
			}
			return i
		}
	}

	function ss(e) {
		return e === sp.Source.Microphone ? "audioinput" : e === sp.Source.Camera ? "videoinput" : void 0
	}

	function so(e) {
		var t, i;
		let n = null == (t = e.video) || t;
		return e.resolution && e.resolution.width > 0 && e.resolution.height > 0 && (n = "boolean" == typeof n ? {} : n, n = sP() ? Object.assign(Object.assign({}, n), {
			width: {
				max: e.resolution.width
			},
			height: {
				max: e.resolution.height
			},
			frameRate: e.resolution.frameRate
		}) : Object.assign(Object.assign({}, n), {
			width: {
				ideal: e.resolution.width
			},
			height: {
				ideal: e.resolution.height
			},
			frameRate: e.resolution.frameRate
		})), {
			audio: null != (i = e.audio) && i,
			video: n,
			controller: e.controller,
			selfBrowserSurface: e.selfBrowserSurface,
			surfaceSwitching: e.surfaceSwitching,
			systemAudio: e.systemAudio,
			preferCurrentTab: e.preferCurrentTab
		}
	}

	function sc(e) {
		return e.split("/")[1].toLowerCase()
	}

	function sl(e) {
		return "mediaStreamTrack" in e ? {
			trackID: e.sid,
			source: e.source,
			muted: e.isMuted,
			enabled: e.mediaStreamTrack.enabled,
			kind: e.kind,
			streamID: e.mediaStreamID,
			streamTrackID: e.mediaStreamTrack.id
		} : {
			trackID: e.trackSid,
			enabled: e.isEnabled,
			muted: e.isMuted,
			trackInfo: Object.assign({
				mimeType: e.mimeType,
				name: e.trackName,
				encrypted: e.isEncrypted,
				kind: e.kind,
				source: e.source
			}, e.track ? sl(e.track) : {})
		}
	}

	function sd(e) {
		let t, i, n = Object.assign({}, e);
		return "object" == typeof n.audio && n.audio.processor && (t = n.audio.processor, n.audio = Object.assign(Object.assign({}, n.audio), {
			processor: void 0
		})), "object" == typeof n.video && n.video.processor && (i = n.video.processor, n.video = Object.assign(Object.assign({}, n.video), {
			processor: void 0
		})), {
			audioProcessor: t,
			videoProcessor: i,
			optionsWithoutProcessor: void 0 === n ? n : "function" != typeof structuredClone ? JSON.parse(JSON.stringify(n)) : "object" == typeof n && null !== n ? structuredClone(Object.assign({}, n)) : structuredClone(n)
		}
	}

	function su(e, t) {
		return e.width * e.height < t.width * t.height
	}
	let sh = [];
	(E = eb || (eb = {}))[E.LOW = 0] = "LOW", E[E.MEDIUM = 1] = "MEDIUM", E[E.HIGH = 2] = "HIGH";
	class sp extends rV.EventEmitter {
		get streamState() {
			return this._streamState
		}
		setStreamState(e) {
			this._streamState !== e && this.log.debug("stream state changed: ".concat(this._streamState, " -> ").concat(e)), this._streamState = e
		}
		constructor(e, t) {
			var i;
			let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
			super(), this.attachedElements = [], this.isMuted = !1, this._streamState = sp.StreamState.Active, this.isInBackground = !1, this._currentBitrate = 0, this.log = r_, this.appVisibilityChangedListener = () => {
				this.backgroundTimeout && clearTimeout(this.backgroundTimeout), "hidden" === document.visibilityState ? this.backgroundTimeout = setTimeout(() => this.handleAppVisibilityChanged(), 5e3) : this.handleAppVisibilityChanged()
			}, this.loggerContextCb = n.loggerContextCb, this.log = rA(null != (i = n.loggerName) ? i : eo.Track, () => this.logContext), this.setMaxListeners(100), this.kind = t, this._mediaStreamTrack = e, this._mediaStreamID = e.id, this.source = sp.Source.Unknown
		}
		get logContext() {
			var e;
			return Object.assign(Object.assign({}, null == (e = this.loggerContextCb) ? void 0 : e.call(this)), sl(this))
		}
		get currentBitrate() {
			return this._currentBitrate
		}
		get mediaStreamTrack() {
			return this._mediaStreamTrack
		}
		get mediaStreamID() {
			return this._mediaStreamID
		}
		attach(e) {
			let t = "audio";
			this.kind === sp.Kind.Video && (t = "video"), 0 === this.attachedElements.length && this.kind === sp.Kind.Video && this.addAppVisibilityListener(), !e && ("audio" === t && (sh.forEach(t => {
				null !== t.parentElement || e || (e = t)
			}), e && sh.splice(sh.indexOf(e), 1)), e || (e = document.createElement(t))), this.attachedElements.includes(e) || this.attachedElements.push(e), sm(this.mediaStreamTrack, e);
			let i = e.srcObject.getTracks(),
				n = i.some(e => "audio" === e.kind);
			return e.play().then(() => {
				this.emit(n ? ev.AudioPlaybackStarted : ev.VideoPlaybackStarted)
			}).catch(t => {
				"NotAllowedError" === t.name ? this.emit(n ? ev.AudioPlaybackFailed : ev.VideoPlaybackFailed, t) : "AbortError" === t.name ? this.log.debug("".concat(n ? "audio" : "video", " playback aborted, likely due to new play request")) : this.log.warn("could not playback ".concat(n ? "audio" : "video"), {
					error: t
				}), n && e && i.some(e => "video" === e.kind) && "NotAllowedError" === t.name && (e.muted = !0, e.play().catch(() => {}))
			}), this.emit(ev.ElementAttached, e), e
		}
		detach(e) {
			try {
				if (e) {
					sg(this.mediaStreamTrack, e);
					let t = this.attachedElements.indexOf(e);
					return t >= 0 && (this.attachedElements.splice(t, 1), this.recycleElement(e), this.emit(ev.ElementDetached, e)), e
				}
				let t = [];
				return this.attachedElements.forEach(e => {
					sg(this.mediaStreamTrack, e), t.push(e), this.recycleElement(e), this.emit(ev.ElementDetached, e)
				}), this.attachedElements = [], t
			} finally {
				0 === this.attachedElements.length && this.removeAppVisibilityListener()
			}
		}
		stop() {
			this.log.debug("stopping track"), this.stopMonitor(), this._mediaStreamTrack.stop()
		}
		enable() {
			this._mediaStreamTrack.enabled = !0
		}
		disable() {
			this._mediaStreamTrack.enabled = !1
		}
		stopMonitor() {
			this.monitorInterval && clearInterval(this.monitorInterval), this.timeSyncHandle && cancelAnimationFrame(this.timeSyncHandle)
		}
		updateLoggerOptions(e) {
			e.loggerContextCb && (this.loggerContextCb = e.loggerContextCb), e.loggerName && (this.log = rA(e.loggerName, () => this.logContext))
		}
		recycleElement(e) {
			if (e instanceof HTMLAudioElement) {
				let t = !0;
				e.pause(), sh.forEach(e => {
					e.parentElement || (t = !1)
				}), t && sh.push(e)
			}
		}
		handleAppVisibilityChanged() {
			return rF(this, void 0, void 0, function*() {
				this.isInBackground = "hidden" === document.visibilityState, this.isInBackground || this.kind !== sp.Kind.Video || setTimeout(() => this.attachedElements.forEach(e => e.play().catch(() => {})), 0)
			})
		}
		addAppVisibilityListener() {
			s_() ? (this.isInBackground = "hidden" === document.visibilityState, document.addEventListener("visibilitychange", this.appVisibilityChangedListener)) : this.isInBackground = !1
		}
		removeAppVisibilityListener() {
			s_() && document.removeEventListener("visibilitychange", this.appVisibilityChangedListener)
		}
	}

	function sm(e, t) {
		let i, n;
		i = t.srcObject instanceof MediaStream ? t.srcObject : new MediaStream, (n = "audio" === e.kind ? i.getAudioTracks() : i.getVideoTracks()).includes(e) || (n.forEach(e => {
			i.removeTrack(e)
		}), i.addTrack(e)), sP() && t instanceof HTMLVideoElement || (t.autoplay = !0), t.muted = 0 === i.getAudioTracks().length, t instanceof HTMLVideoElement && (t.playsInline = !0), t.srcObject !== i && (t.srcObject = i, (sP() || sE()) && t instanceof HTMLVideoElement && setTimeout(() => {
			t.srcObject = i, t.play().catch(() => {})
		}, 0))
	}

	function sg(e, t) {
		if (t.srcObject instanceof MediaStream) {
			let i = t.srcObject;
			i.removeTrack(e), i.getTracks().length > 0 ? t.srcObject = i : t.srcObject = null
		}
	}(P = r = (R = sp || (sp = {})).Kind || (R.Kind = {})).Audio = "audio", P.Video = "video", P.Unknown = "unknown", (I = a = R.Source || (R.Source = {})).Camera = "camera", I.Microphone = "microphone", I.ScreenShare = "screen_share", I.ScreenShareAudio = "screen_share_audio", I.Unknown = "unknown", (D = s = R.StreamState || (R.StreamState = {})).Active = "active", D.Paused = "paused", D.Unknown = "unknown", R.kindToProto = function(e) {
		switch (e) {
			case r.Audio:
				return ic.AUDIO;
			case r.Video:
				return ic.VIDEO;
			default:
				return ic.DATA
		}
	}, R.kindFromProto = function(e) {
		switch (e) {
			case ic.AUDIO:
				return r.Audio;
			case ic.VIDEO:
				return r.Video;
			default:
				return r.Unknown
		}
	}, R.sourceToProto = function(e) {
		switch (e) {
			case a.Camera:
				return il.CAMERA;
			case a.Microphone:
				return il.MICROPHONE;
			case a.ScreenShare:
				return il.SCREEN_SHARE;
			case a.ScreenShareAudio:
				return il.SCREEN_SHARE_AUDIO;
			default:
				return il.UNKNOWN
		}
	}, R.sourceFromProto = function(e) {
		switch (e) {
			case il.CAMERA:
				return a.Camera;
			case il.MICROPHONE:
				return a.Microphone;
			case il.SCREEN_SHARE:
				return a.ScreenShare;
			case il.SCREEN_SHARE_AUDIO:
				return a.ScreenShareAudio;
			default:
				return a.Unknown
		}
	}, R.streamStateFromProto = function(e) {
		switch (e) {
			case nI.ACTIVE:
				return s.Active;
			case nI.PAUSED:
				return s.Paused;
			default:
				return s.Unknown
		}
	};
	let sf = "https://aomediacodec.github.io/av1-rtp-spec/#dependency-descriptor-rtp-header-extension";

	function sv(e) {
		return new aN(t => a2.setTimeout(t, e))
	}

	function sk() {
		return "addTransceiver" in RTCPeerConnection.prototype
	}

	function sy() {
		return "addTrack" in RTCPeerConnection.prototype
	}

	function sb() {
		if (!("getCapabilities" in RTCRtpSender) || sP() || sE()) return !1;
		let e = RTCRtpSender.getCapabilities("video"),
			t = !1;
		if (e) {
			for (let i of e.codecs)
				if ("video/av1" === i.mimeType.toLowerCase()) {
					t = !0;
					break
				}
		}
		return t
	}

	function sT() {
		if (!("getCapabilities" in RTCRtpSender) || sE()) return !1;
		if (sP()) {
			let e = aF();
			if ((null == e ? void 0 : e.version) && 0 > sF(e.version, "16") || (null == e ? void 0 : e.os) === "iOS" && (null == e ? void 0 : e.osVersion) && 0 > sF(e.osVersion, "16")) return !1
		}
		let e = RTCRtpSender.getCapabilities("video"),
			t = !1;
		if (e) {
			for (let i of e.codecs)
				if ("video/vp9" === i.mimeType.toLowerCase()) {
					t = !0;
					break
				}
		}
		return t
	}

	function sS(e) {
		return "av1" === e || "vp9" === e
	}

	function sC(e) {
		return !(!document || sI()) && (e || (e = document.createElement("audio")), "setSinkId" in e)
	}

	function sw() {
		return !("u" < typeof RTCPeerConnection) && (sk() || sy())
	}

	function sE() {
		var e;
		return (null == (e = aF()) ? void 0 : e.name) === "Firefox"
	}

	function sR() {
		let e;
		return "u" > typeof window && void 0 !== window.RTCRtpScriptTransform && (!(e = aF()) || "Chrome" !== e.name || "iOS" === e.os)
	}

	function sP() {
		var e;
		return (null == (e = aF()) ? void 0 : e.name) === "Safari"
	}

	function sI() {
		let e = aF();
		return (null == e ? void 0 : e.name) === "Safari" || (null == e ? void 0 : e.os) === "iOS"
	}

	function sD() {
		let e = aF();
		return (null == e ? void 0 : e.name) === "Safari" && e.version.startsWith("17.") || (null == e ? void 0 : e.os) === "iOS" && !!(null == e ? void 0 : e.osVersion) && sF(e.osVersion, "17") >= 0
	}

	function sM() {
		var e, t;
		return !!s_() && (null != (t = null == (e = navigator.userAgentData) ? void 0 : e.mobile) ? t : /Tablet|iPad|Mobile|Android|BlackBerry/.test(navigator.userAgent))
	}

	function s_() {
		return "u" > typeof document
	}

	function sO() {
		return "ReactNative" == navigator.product
	}

	function sA(e) {
		return e.hostname.endsWith(".livekit.cloud") || e.hostname.endsWith(".livekit.run")
	}

	function sx(e) {
		return sA(e) ? e.hostname.split(".")[0] : null
	}

	function sL() {
		if (e.g && e.g.LiveKitReactNativeGlobal) return e.g.LiveKitReactNativeGlobal
	}

	function sN() {
		if (!sO()) return;
		let e = sL();
		if (e) return e.platform
	}

	function sU() {
		if (s_()) return window.devicePixelRatio;
		if (sO()) {
			let e = sL();
			if (e) return e.devicePixelRatio
		}
		return 1
	}

	function sF(e, t) {
		let i = e.split("."),
			n = t.split("."),
			r = Math.min(i.length, n.length);
		for (let e = 0; e < r; ++e) {
			let t = parseInt(i[e], 10),
				a = parseInt(n[e], 10);
			if (t > a) return 1;
			if (t < a) return -1;
			if (e === r - 1 && t === a) return 0
		}
		return "" === e && "" !== t ? -1 : "" === t ? 1 : i.length == n.length ? 0 : i.length < n.length ? -1 : 1
	}

	function sB(e) {
		for (let t of e) t.target.handleResize(t)
	}

	function sj(e) {
		for (let t of e) t.target.handleVisibilityChanged(t)
	}
	let sq = null,
		sV = () => (sq || (sq = new ResizeObserver(sB)), sq),
		sH = null,
		sW = () => (sH || (sH = new IntersectionObserver(sj, {
			root: null,
			rootMargin: "0px"
		})), sH);

	function sK() {
		let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 16,
			t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 16,
			i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
			n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
			r = document.createElement("canvas");
		r.width = e, r.height = t;
		let a = r.getContext("2d");
		null == a || a.fillRect(0, 0, r.width, r.height), n && a && (a.beginPath(), a.arc(e / 2, t / 2, 50, 0, 2 * Math.PI, !0), a.closePath(), a.fillStyle = "grey", a.fill());
		let s = tg(r.captureStream().getTracks(), 1)[0];
		if (!s) throw Error("Could not get empty media stream video track");
		return s.enabled = i, s
	}

	function sz() {
		if (!n) {
			let e = new AudioContext,
				t = e.createOscillator(),
				i = e.createGain();
			i.gain.setValueAtTime(0, 0);
			let r = e.createMediaStreamDestination();
			if (t.connect(i), i.connect(r), t.start(), !(n = tg(r.stream.getAudioTracks(), 1)[0])) throw Error("Could not get empty media stream audio track");
			n.enabled = !1
		}
		return n.clone()
	}
	class sJ {
		get isResolved() {
			return this._isResolved
		}
		constructor(e, t) {
			this._isResolved = !1, this.onFinally = t, this.promise = new Promise((t, i) => rF(this, void 0, void 0, function*() {
				this.resolve = t, this.reject = i, e && (yield e(t, i))
			})).finally(() => {
				var e;
				this._isResolved = !0, null == (e = this.onFinally) || e.call(this)
			})
		}
	}

	function sG(e) {
		return a6.includes(e)
	}

	function sQ(e) {
		if ("string" == typeof e || "number" == typeof e) return e;
		if (Array.isArray(e)) return e[0];
		if (void 0 !== e.exact) return Array.isArray(e.exact) ? e.exact[0] : e.exact;
		if (void 0 !== e.ideal) return Array.isArray(e.ideal) ? e.ideal[0] : e.ideal;
		throw Error("could not unwrap constraint")
	}

	function sY(e) {
		return e.startsWith("ws") ? e.replace(/^(ws)/, "http") : e
	}

	function sX(e) {
		switch (e.reason) {
			case eu.LeaveRequest:
				return e.context;
			case eu.Cancelled:
				return ip.CLIENT_INITIATED;
			case eu.NotAllowed:
				return ip.USER_REJECTED;
			case eu.ServerUnreachable:
				return ip.JOIN_FAILURE;
			default:
				return ip.UNKNOWN_REASON
		}
	}

	function sZ(e) {
		return void 0 !== e ? Number(e) : void 0
	}

	function s$(e) {
		return void 0 !== e ? BigInt(e) : void 0
	}

	function s0(e) {
		return !!e && !(e instanceof MediaStreamTrack) && e.isLocal
	}

	function s1(e) {
		return !!e && e.kind == sp.Kind.Audio
	}

	function s2(e) {
		return !!e && e.kind == sp.Kind.Video
	}

	function s3(e) {
		return s0(e) && s2(e)
	}

	function s4(e) {
		return s0(e) && s1(e)
	}

	function s9(e) {
		return !!e && !e.isLocal
	}

	function s6(e) {
		return s9(e) && s2(e)
	}

	function s8(e) {
		return e.isLocal
	}

	function s5() {
		return "u" > typeof CompressionStream
	}

	function s7(e) {
		return e.endsWith("/") ? e : "".concat(e, "/")
	}

	function oe(e, t) {
		return e.pathname = "".concat(s7(e.pathname)).concat(t), e
	}

	function ot(e) {
		if ("string" == typeof e) return n_.fromJson(JSON.parse(e), {
			ignoreUnknownFields: !0
		});
		if (e instanceof ArrayBuffer) return n_.fromBinary(new Uint8Array(e));
		throw Error("could not decode websocket message: ".concat(typeof e))
	}
	let oi = "AES-GCM",
		on = "lk_e2ee",
		or = {
			sharedKey: !1,
			ratchetSalt: "LKFrameEncryptionKey",
			ratchetWindowSize: 8,
			failureTolerance: 10,
			keyringSize: 16,
			keySize: 128
		};

	function oa() {
		return oo() || os()
	}

	function os() {
		return "u" > typeof window && void 0 !== window.RTCRtpScriptTransform
	}

	function oo() {
		return "u" > typeof window && void 0 !== window.RTCRtpSender && void 0 !== window.RTCRtpSender.prototype.createEncodedStreams
	}

	function oc(e) {
		return rF(this, void 0, void 0, function*() {
			let t = new TextEncoder;
			return yield crypto.subtle.importKey("raw", t.encode(e), {
				name: "PBKDF2"
			}, !1, ["deriveBits", "deriveKey"])
		})
	}

	function ol(e) {
		return rF(this, void 0, void 0, function*() {
			return yield crypto.subtle.importKey("raw", e, "HKDF", !1, ["deriveBits", "deriveKey"])
		})
	}

	function od(e, t) {
		let i = new TextEncoder().encode(t);
		switch (e) {
			case "HKDF":
				return {
					name: "HKDF", salt: i, hash: "SHA-256", info: new ArrayBuffer(128)
				};
			case "PBKDF2":
				return {
					name: "PBKDF2", salt: i, hash: "SHA-256", iterations: 1e5
				};
			default:
				throw Error("algorithm ".concat(e, " is currently unsupported"))
		}
	}

	function ou(e) {
		var t, i, n, r, a;
		if ((null == (t = e.value) ? void 0 : t.case) !== "sipDtmf" && (null == (i = e.value) ? void 0 : i.case) !== "metrics" && (null == (n = e.value) ? void 0 : n.case) !== "speaker" && (null == (r = e.value) ? void 0 : r.case) !== "transcription" && (null == (a = e.value) ? void 0 : a.case) !== "encryptedPacket") return new iN({
			value: e.value
		})
	}(M = eT || (eT = {})).SetKey = "setKey", M.RatchetRequest = "ratchetRequest", M.KeyRatcheted = "keyRatcheted", (eS || (eS = {})).KeyRatcheted = "keyRatcheted", (_ = eC || (eC = {})).ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", _.EncryptionError = "encryptionError", (ew || (ew = {})).Error = "cryptorError";
	class oh extends rV.EventEmitter {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			super(), this.latestManuallySetKeyIndex = 0, this.onKeyRatcheted = (e, t, i) => {
				r_.debug("key ratcheted event received", {
					ratchetResult: e,
					participantId: t,
					keyIndex: i
				})
			}, this.keyInfoMap = new Map, this.options = Object.assign(Object.assign({}, or), e), this.on(eT.KeyRatcheted, this.onKeyRatcheted)
		}
		onSetEncryptionKey(e, t, i) {
			let n = {
				key: e,
				participantIdentity: t,
				keyIndex: i
			};
			if (!this.options.sharedKey && !t) throw Error("participant identity needs to be passed for encryption key if sharedKey option is false");
			this.keyInfoMap.set("".concat(null != t ? t : "shared", "-").concat(null != i ? i : 0), n), void 0 !== i && (this.latestManuallySetKeyIndex = i), this.emit(eT.SetKey, n, void 0 !== i)
		}
		getKeys() {
			return Array.from(this.keyInfoMap.values())
		}
		getLatestManuallySetKeyIndex() {
			return this.latestManuallySetKeyIndex
		}
		getOptions() {
			return this.options
		}
		ratchetKey(e, t) {
			this.emit(eT.RatchetRequest, e, t)
		}
	}(O = eE || (eE = {}))[O.InvalidKey = 0] = "InvalidKey", O[O.MissingKey = 1] = "MissingKey", O[O.InternalError = 2] = "InternalError";

	function op(e) {
		return !!(null == e ? void 0 : e.worker) && (oo() || sR())
	}

	function om(e) {
		return !!((null == e ? void 0 : e.timestamp) || (null == e ? void 0 : e.frameId))
	}

	function og(e) {
		var t, i;
		let n, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 50,
			a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
			s = null != (t = a.isImmediate) && t,
			o = null != (i = a.callback) && i,
			c = a.maxWait,
			l = Date.now(),
			d = [],
			u = function() {
				for (var t = arguments.length, i = Array(t), a = 0; a < t; a++) i[a] = arguments[a];
				let u = this;
				return new Promise((t, a) => {
					let h = s && void 0 === n;
					if (void 0 !== n && a2.clearTimeout(n), n = a2.setTimeout(function() {
							if (n = void 0, l = Date.now(), !s) {
								let t = e.apply(u, i);
								o && o(t), d.forEach(e => (0, e.resolve)(t)), d = []
							}
						}, function() {
							if (void 0 !== c) {
								let e = Date.now() - l;
								if (e + r >= c) return c - e
							}
							return r
						}()), h) {
						let n = e.apply(u, i);
						return o && o(n), t(n)
					}
					d.push({
						resolve: t,
						reject: a
					})
				})
			};
		return u.cancel = function(e) {
			void 0 !== n && a2.clearTimeout(n), d.forEach(t => (0, t.reject)(e)), d = []
		}, u
	}

	function of(e, t) {
		let i, n;
		return t ? ("bytesReceived" in e ? (i = e.bytesReceived, n = t.bytesReceived) : "bytesSent" in e && (i = e.bytesSent, n = t.bytesSent), void 0 === i || void 0 === n || void 0 === e.timestamp || void 0 === t.timestamp) ? 0 : (i - n) * 8e3 / (e.timestamp - t.timestamp) : 0
	}
	class ov extends sp {
		constructor(e, t, i, n, r) {
			super(e, i, r), this.sid = t, this.receiver = n
		}
		get isLocal() {
			return !1
		}
		setMuted(e) {
			this.isMuted !== e && (this.isMuted = e, this._mediaStreamTrack.enabled = !e, this.emit(e ? ev.Muted : ev.Unmuted, this))
		}
		setMediaStream(e) {
			this.mediaStream = e;
			let t = i => {
				i.track === this._mediaStreamTrack && (e.removeEventListener("removetrack", t), this.receiver && "playoutDelayHint" in this.receiver && (this.receiver.playoutDelayHint = void 0), this.receiver = void 0, this._currentBitrate = 0, this.emit(ev.Ended, this))
			};
			e.addEventListener("removetrack", t)
		}
		start() {
			this.startMonitor(), super.enable()
		}
		stop() {
			this.stopMonitor(), super.disable()
		}
		getRTCStatsReport() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (null == (e = this.receiver) ? void 0 : e.getStats) return yield this.receiver.getStats()
			})
		}
		setPlayoutDelay(e) {
			this.receiver ? "playoutDelayHint" in this.receiver ? this.receiver.playoutDelayHint = e : this.log.warn("Playout delay not supported in this browser") : this.log.warn("Cannot set playout delay, track already ended")
		}
		getPlayoutDelay() {
			if (this.receiver)
				if ("playoutDelayHint" in this.receiver) return this.receiver.playoutDelayHint;
				else this.log.warn("Playout delay not supported in this browser");
			else this.log.warn("Cannot get playout delay, track already ended");
			return 0
		}
		startMonitor() {
			this.monitorInterval || (this.monitorInterval = setInterval(() => this.monitorReceiver(), 2e3)), "u" > typeof RTCRtpReceiver && "function" == typeof RTCRtpReceiver.prototype.getSynchronizationSources && this.registerTimeSyncUpdate()
		}
		registerTimeSyncUpdate() {
			let e = () => {
				var t;
				this.timeSyncHandle = requestAnimationFrame(() => e());
				let i = null == (t = this.receiver) ? void 0 : t.getSynchronizationSources()[0];
				if (i) {
					let e = i.timestamp,
						t = i.rtpTimestamp;
					t && this.rtpTimestamp !== t && (this.emit(ev.TimeSyncUpdate, {
						timestamp: e,
						rtpTimestamp: t
					}), this.rtpTimestamp = t)
				}
			};
			e()
		}
	}
	class ok extends ov {
		constructor(e, t, i, n, r) {
			super(e, t, sp.Kind.Video, i, r), this.elementInfos = [], this.monitorReceiver = () => rF(this, void 0, void 0, function*() {
				if (!this.receiver) {
					this._currentBitrate = 0;
					return
				}
				let e = yield this.getReceiverStats();
				e && this.prevStats && this.receiver && (this._currentBitrate = of(e, this.prevStats)), this.prevStats = e
			}), this.debouncedHandleResize = og(() => {
				this.updateDimensions()
			}, 100), this.adaptiveStreamSettings = n
		}
		get isAdaptiveStream() {
			return void 0 !== this.adaptiveStreamSettings
		}
		lookupFrameMetadata(e) {
			var t;
			let i = e.rtpTimestamp;
			return null == (t = this.frameMetadataExtractor) ? void 0 : t.lookupMetadata(i)
		}
		setStreamState(e) {
			super.setStreamState(e), this.log.debug("setStreamState", e), this.isAdaptiveStream && e === sp.StreamState.Active && this.updateVisibility()
		}
		get mediaStreamTrack() {
			return this._mediaStreamTrack
		}
		setMuted(e) {
			super.setMuted(e), this.attachedElements.forEach(t => {
				e ? sg(this._mediaStreamTrack, t) : sm(this._mediaStreamTrack, t)
			})
		}
		attach(e) {
			if (e ? super.attach(e) : e = super.attach(), this.adaptiveStreamSettings && void 0 === this.elementInfos.find(t => t.element === e)) {
				let t = new oy(e);
				this.observeElementInfo(t)
			}
			return e
		}
		observeElementInfo(e) {
			this.adaptiveStreamSettings && void 0 === this.elementInfos.find(t => t === e) ? (e.handleResize = () => {
				this.debouncedHandleResize()
			}, e.handleVisibilityChanged = () => {
				this.updateVisibility()
			}, this.elementInfos.push(e), e.observe(), this.debouncedHandleResize(), this.updateVisibility()) : this.log.warn("visibility resize observer not triggered", this.logContext)
		}
		stopObservingElementInfo(e) {
			if (!this.isAdaptiveStream) return void this.log.warn("stopObservingElementInfo ignored", this.logContext);
			for (let t of this.elementInfos.filter(t => t === e)) t.stopObserving();
			this.elementInfos = this.elementInfos.filter(t => t !== e), this.updateVisibility(), this.debouncedHandleResize()
		}
		detach(e) {
			if (e) return this.stopObservingElement(e), super.detach(e);
			let t = super.detach();
			for (let e of t) this.stopObservingElement(e);
			return t
		}
		getDecoderImplementation() {
			var e;
			return null == (e = this.prevStats) ? void 0 : e.decoderImplementation
		}
		getReceiverStats() {
			return rF(this, void 0, void 0, function*() {
				let e;
				if (!this.receiver || !this.receiver.getStats) return;
				let t = yield this.receiver.getStats(), i = "", n = new Map;
				return t.forEach(t => {
					"inbound-rtp" === t.type ? (i = t.codecId, e = {
						type: "video",
						streamId: t.id,
						framesDecoded: t.framesDecoded,
						framesDropped: t.framesDropped,
						framesReceived: t.framesReceived,
						packetsReceived: t.packetsReceived,
						packetsLost: t.packetsLost,
						frameWidth: t.frameWidth,
						frameHeight: t.frameHeight,
						pliCount: t.pliCount,
						firCount: t.firCount,
						nackCount: t.nackCount,
						jitter: t.jitter,
						timestamp: t.timestamp,
						bytesReceived: t.bytesReceived,
						decoderImplementation: t.decoderImplementation
					}) : "codec" === t.type && n.set(t.id, t)
				}), e && "" !== i && n.get(i) && (e.mimeType = n.get(i).mimeType), e
			})
		}
		stopObservingElement(e) {
			for (let t of this.elementInfos.filter(t => t.element === e)) this.stopObservingElementInfo(t)
		}
		handleAppVisibilityChanged() {
			let e = Object.create(null, {
				handleAppVisibilityChanged: {
					get: () => super.handleAppVisibilityChanged
				}
			});
			return rF(this, void 0, void 0, function*() {
				yield e.handleAppVisibilityChanged.call(this), this.isAdaptiveStream && this.updateVisibility()
			})
		}
		updateVisibility(e) {
			var t, i;
			let n = this.elementInfos.reduce((e, t) => Math.max(e, t.visibilityChangedAt || 0), 0),
				r = (null == (i = null == (t = this.adaptiveStreamSettings) ? void 0 : t.pauseVideoInBackground) || !!i) && this.isInBackground,
				a = this.elementInfos.some(e => e.pictureInPicture),
				s = this.elementInfos.some(e => e.visible) && !r || a;
			if (this.lastVisible !== s || e) {
				if (!s && Date.now() - n < 100) return void a2.setTimeout(() => {
					this.updateVisibility()
				}, 100);
				this.lastVisible = s, this.emit(ev.VisibilityChanged, s, this)
			}
		}
		updateDimensions() {
			var e, t;
			let i = 0,
				n = 0,
				r = this.getPixelDensity();
			for (let e of this.elementInfos) {
				let t = e.width() * r,
					a = e.height() * r;
				t + a > i + n && (i = t, n = a)
			}((null == (e = this.lastDimensions) ? void 0 : e.width) !== i || (null == (t = this.lastDimensions) ? void 0 : t.height) !== n) && (this.lastDimensions = {
				width: i,
				height: n
			}, this.emit(ev.VideoDimensionsChanged, this.lastDimensions, this))
		}
		getPixelDensity() {
			var e;
			let t = null == (e = this.adaptiveStreamSettings) ? void 0 : e.pixelDensity;
			return "screen" === t ? sU() : t ? t : sU() > 2 ? 2 : 1
		}
	}
	class oy {
		get visible() {
			return this.isPiP || this.isIntersecting
		}
		get pictureInPicture() {
			return this.isPiP
		}
		constructor(e, t) {
			this.onVisibilityChanged = e => {
				var t;
				let i = e.target,
					n = e.isIntersecting;
				i === this.element && (this.isIntersecting = n, this.isPiP = ob(this.element), this.visibilityChangedAt = Date.now(), null == (t = this.handleVisibilityChanged) || t.call(this))
			}, this.onEnterPiP = () => {
				var e, t;
				null == (t = null == (e = window.documentPictureInPicture) ? void 0 : e.window) || t.addEventListener("pagehide", this.onLeavePiP), queueMicrotask(() => {
					requestAnimationFrame(() => {
						var e;
						this.isPiP = ob(this.element), null == (e = this.handleVisibilityChanged) || e.call(this)
					})
				})
			}, this.onLeavePiP = () => {
				var e;
				this.isPiP = ob(this.element), null == (e = this.handleVisibilityChanged) || e.call(this)
			}, this.element = e, this.isIntersecting = null != t ? t : oT(e), this.isPiP = s_() && ob(e), this.visibilityChangedAt = 0
		}
		width() {
			return this.element.clientWidth
		}
		height() {
			return this.element.clientHeight
		}
		observe() {
			var e, t, i;
			this.isIntersecting = oT(this.element), this.isPiP = ob(this.element), this.element.handleResize = () => {
				var e;
				null == (e = this.handleResize) || e.call(this)
			}, this.element.handleVisibilityChanged = this.onVisibilityChanged, sW().observe(this.element), sV().observe(this.element), this.element.addEventListener("enterpictureinpicture", this.onEnterPiP), this.element.addEventListener("leavepictureinpicture", this.onLeavePiP), null == (e = window.documentPictureInPicture) || e.addEventListener("enter", this.onEnterPiP), null == (i = null == (t = window.documentPictureInPicture) ? void 0 : t.window) || i.addEventListener("pagehide", this.onLeavePiP)
		}
		stopObserving() {
			var e, t, i, n, r;
			null == (e = sW()) || e.unobserve(this.element), null == (t = sV()) || t.unobserve(this.element), this.element.removeEventListener("enterpictureinpicture", this.onEnterPiP), this.element.removeEventListener("leavepictureinpicture", this.onLeavePiP), null == (i = window.documentPictureInPicture) || i.removeEventListener("enter", this.onEnterPiP), null == (r = null == (n = window.documentPictureInPicture) ? void 0 : n.window) || r.removeEventListener("pagehide", this.onLeavePiP)
		}
	}

	function ob(e) {
		var t, i;
		return document.pictureInPictureElement === e || null != (t = window.documentPictureInPicture) && !!t.window && oT(e, null == (i = window.documentPictureInPicture) ? void 0 : i.window)
	}

	function oT(e, t) {
		let i = t || window,
			n = e.offsetTop,
			r = e.offsetLeft,
			a = e.offsetWidth,
			s = e.offsetHeight,
			o = e.hidden,
			c = getComputedStyle(e).display;
		for (; e.offsetParent;) n += (e = e.offsetParent).offsetTop, r += e.offsetLeft;
		return n < i.pageYOffset + i.innerHeight && r < i.pageXOffset + i.innerWidth && n + s > i.pageYOffset && r + a > i.pageXOffset && !o && "none" !== c
	}
	class oS extends rV.EventEmitter {
		constructor(e, t) {
			super(), this.decryptDataRequests = new Map, this.encryptDataRequests = new Map, this.onWorkerMessage = e => {
				var t, i;
				let n = e.data,
					r = n.kind,
					a = n.data;
				switch (r) {
					case "error":
						if (r_.error(a.error.message), a.uuid) {
							let e = this.decryptDataRequests.get(a.uuid);
							if (null == e ? void 0 : e.reject) {
								e.reject(a.error);
								break
							}
							let t = this.encryptDataRequests.get(a.uuid);
							if (null == t ? void 0 : t.reject) {
								t.reject(a.error);
								break
							}
						}
						this.emit(eC.EncryptionError, a.error, a.participantIdentity);
						break;
					case "initAck":
						a.enabled && this.keyProvider.getKeys().forEach(e => {
							this.postKey(e, !1)
						});
						break;
					case "enable":
						if (a.enabled && this.keyProvider.getKeys().forEach(e => {
								this.postKey(e, !1)
							}), this.encryptionEnabled !== a.enabled && a.participantIdentity === (null == (t = this.room) ? void 0 : t.localParticipant.identity)) this.emit(eC.ParticipantEncryptionStatusChanged, a.enabled, this.room.localParticipant), this.encryptionEnabled = a.enabled;
						else if (a.participantIdentity) {
							let e = null == (i = this.room) ? void 0 : i.getParticipantByIdentity(a.participantIdentity);
							if (!e) throw TypeError("couldn't set encryption status, participant not found".concat(a.participantIdentity));
							this.emit(eC.ParticipantEncryptionStatusChanged, a.enabled, e)
						}
						break;
					case "ratchetKey":
						this.keyProvider.emit(eT.KeyRatcheted, a.ratchetResult, a.participantIdentity, a.keyIndex);
						break;
					case "decryptDataResponse":
						let s = this.decryptDataRequests.get(a.uuid);
						(null == s ? void 0 : s.resolve) && s.resolve(a);
						break;
					case "encryptDataResponse":
						let o = this.encryptDataRequests.get(a.uuid);
						(null == o ? void 0 : o.resolve) && o.resolve(a);
						break;
					case "packetTrailerMetadata":
						this.handleFrameMetadata(a.trackId, a.rtpTimestamp, a.ssrc, a.metadata)
				}
			}, this.onWorkerError = e => {
				r_.error("e2ee worker encountered an error:", {
					error: e.error
				}), this.emit(eC.EncryptionError, e.error, void 0)
			}, this.keyProvider = e.keyProvider, this.worker = e.worker, this.encryptionEnabled = !1, this.dataChannelEncryptionEnabled = t
		}
		get isEnabled() {
			return this.encryptionEnabled
		}
		get isDataChannelEncryptionEnabled() {
			return this.isEnabled && this.dataChannelEncryptionEnabled
		}
		setup(e) {
			if (!oa()) throw new az("tried to setup end-to-end encryption on an unsupported browser");
			if (r_.info("setting up e2ee"), e !== this.room) {
				this.room = e, this.setupEventListeners(e, this.keyProvider);
				let t = {
					kind: "init",
					data: {
						keyProviderOptions: this.keyProvider.getOptions(),
						loglevel: rx.getLevel()
					}
				};
				this.worker && (r_.info("initializing worker", {
					worker: this.worker
				}), this.worker.onmessage = this.onWorkerMessage, this.worker.onerror = this.onWorkerError, this.worker.postMessage(t))
			}
		}
		setParticipantCryptorEnabled(e, t) {
			r_.debug("set e2ee to ".concat(e, " for participant ").concat(t)), this.postEnable(e, t)
		}
		setSifTrailer(e) {
			e && 0 !== e.length ? this.postSifTrailer(e) : r_.warn("ignoring server sent trailer as it's empty")
		}
		handleFrameMetadata(e, t, i, n) {
			if (this.room) {
				for (let r of [this.room.localParticipant, ...this.room.remoteParticipants.values()])
					for (let a of r.trackPublications.values())
						if (a.track && a.track.mediaStreamID === e && a.track instanceof ok && a.track.frameMetadataExtractor) return void a.track.frameMetadataExtractor.storeMetadata(t, i, n)
			}
		}
		setupEngine(e) {
			e.on(ef.RTPVideoMapUpdate, e => {
				this.postRTPMap(e)
			})
		}
		setupEventListeners(e, t) {
			e.on(em.TrackPublished, (e, t) => this.setParticipantCryptorEnabled(e.trackInfo.encryption !== iR.NONE, t.identity)), e.on(em.ConnectionStateChanged, t => {
				t === eQ.Connected && e.remoteParticipants.forEach(e => {
					e.trackPublications.forEach(t => {
						this.setParticipantCryptorEnabled(t.trackInfo.encryption !== iR.NONE, e.identity)
					})
				})
			}).on(em.TrackUnsubscribed, (e, t, i) => {
				var n;
				let r = {
					kind: "removeTransform",
					data: {
						participantIdentity: i.identity,
						trackId: e.mediaStreamID
					}
				};
				null == (n = this.worker) || n.postMessage(r)
			}).on(em.TrackSubscribed, (e, t, i) => {
				this.setupE2EEReceiver(e, i.identity, t.trackInfo)
			}).on(em.SignalConnected, () => {
				if (!this.room) throw TypeError("expected room to be present on signal connect");
				let e = t.getLatestManuallySetKeyIndex();
				t.getKeys().forEach(t => {
					var i;
					this.postKey(t, e === (null != (i = t.keyIndex) ? i : 0))
				}), this.setParticipantCryptorEnabled(this.room.localParticipant.isE2EEEnabled, this.room.localParticipant.identity)
			}), e.localParticipant.on(eg.LocalSenderCreated, (e, t) => rF(this, void 0, void 0, function*() {
				this.setupE2EESender(t, e)
			})), e.localParticipant.on(eg.LocalTrackPublished, e => {
				if (!s2(e.track) || !sI()) return;
				let t = {
					kind: "updateCodec",
					data: {
						trackId: e.track.mediaStreamID,
						codec: sc(e.trackInfo.codecs[0].mimeType),
						participantIdentity: this.room.localParticipant.identity,
						hasPacketTrailer: !1
					}
				};
				this.worker.postMessage(t)
			}), t.on(eT.SetKey, (e, t) => this.postKey(e, null == t || t)).on(eT.RatchetRequest, (e, t) => this.postRatchetRequest(e, t))
		}
		encryptData(e) {
			return rF(this, void 0, void 0, function*() {
				if (!this.worker) throw Error("could not encrypt data, worker is missing");
				let t = crypto.randomUUID(),
					i = {
						kind: "encryptDataRequest",
						data: {
							uuid: t,
							payload: e,
							participantIdentity: this.room.localParticipant.identity
						}
					},
					n = new sJ;
				return n.onFinally = () => {
					this.encryptDataRequests.delete(t)
				}, this.encryptDataRequests.set(t, n), this.worker.postMessage(i), n.promise
			})
		}
		handleEncryptedData(e, t, i, n) {
			if (!this.worker) throw Error("could not handle encrypted data, worker is missing");
			let r = crypto.randomUUID(),
				a = new sJ;
			return a.onFinally = () => {
				this.decryptDataRequests.delete(r)
			}, this.decryptDataRequests.set(r, a), this.worker.postMessage({
				kind: "decryptDataRequest",
				data: {
					uuid: r,
					payload: e,
					iv: t,
					participantIdentity: i,
					keyIndex: n
				}
			}), a.promise
		}
		postRatchetRequest(e, t) {
			if (!this.worker) throw Error("could not ratchet key, worker is missing");
			this.worker.postMessage({
				kind: "ratchetRequest",
				data: {
					participantIdentity: e,
					keyIndex: t
				}
			})
		}
		postKey(e, t) {
			var i;
			let n = e.key,
				r = e.participantIdentity,
				a = e.keyIndex;
			if (!this.worker) throw Error("could not set key, worker is missing");
			let s = {
				kind: "setKey",
				data: {
					participantIdentity: r,
					isPublisher: r === (null == (i = this.room) ? void 0 : i.localParticipant.identity),
					key: n,
					keyIndex: a,
					updateCurrentKeyIndex: t
				}
			};
			this.worker.postMessage(s)
		}
		postEnable(e, t) {
			if (this.worker) this.worker.postMessage({
				kind: "enable",
				data: {
					enabled: e,
					participantIdentity: t
				}
			});
			else throw ReferenceError("failed to enable e2ee, worker is not ready")
		}
		postRTPMap(e) {
			var t;
			if (!this.worker) throw TypeError("could not post rtp map, worker is missing");
			if (!(null == (t = this.room) ? void 0 : t.localParticipant.identity)) throw TypeError("could not post rtp map, local participant identity is missing");
			let i = {
				kind: "setRTPMap",
				data: {
					map: e,
					participantIdentity: this.room.localParticipant.identity
				}
			};
			this.worker.postMessage(i)
		}
		postSifTrailer(e) {
			if (!this.worker) throw Error("could not post SIF trailer, worker is missing");
			this.worker.postMessage({
				kind: "setSifTrailer",
				data: {
					trailer: e
				}
			})
		}
		setupE2EEReceiver(e, t, i) {
			if (!e.receiver) return;
			if (!(null == i ? void 0 : i.mimeType) || "" === i.mimeType) throw TypeError("MimeType missing from trackInfo, cannot set up E2EE cryptor");
			let n = "video" === e.kind && !!i.packetTrailerFeatures && i.packetTrailerFeatures.length > 0;
			this.handleReceiver(e.receiver, e.mediaStreamID, t, "video" === e.kind ? sc(i.mimeType) : void 0, n)
		}
		setupE2EESender(e, t) {
			var i, n, r;
			if (!s0(e) || !t) {
				t || r_.warn("early return because sender is not ready");
				return
			}
			this.handleSender(t, e.mediaStreamID, void 0, s2(e) ? null != (n = null == (i = e.publishOptions) ? void 0 : i.frameMetadata) ? n : null == (r = e.publishOptions) ? void 0 : r.packetTrailer : void 0)
		}
		handleReceiver(e, t, i, n, r) {
			return rF(this, void 0, void 0, function*() {
				if (this.worker) {
					if (sR()) e.transform = new RTCRtpScriptTransform(this.worker, {
						kind: "decode",
						participantIdentity: i,
						trackId: t,
						codec: n,
						hasPacketTrailer: r
					});
					else {
						if (on in e && n) return void this.worker.postMessage({
							kind: "updateCodec",
							data: {
								trackId: t,
								codec: n,
								participantIdentity: i,
								hasPacketTrailer: r
							}
						});
						let a = e.writableStream,
							s = e.readableStream;
						if (!a || !s) {
							let t = e.createEncodedStreams();
							e.writableStream = t.writable, a = t.writable, e.readableStream = t.readable, s = t.readable
						}
						let o = {
							kind: "decode",
							data: {
								readableStream: s,
								writableStream: a,
								trackId: t,
								codec: n,
								participantIdentity: i,
								isReuse: on in e,
								hasPacketTrailer: r
							}
						};
						this.worker.postMessage(o, [s, a])
					}
					e[on] = !0
				}
			})
		}
		handleSender(e, t, i, n) {
			var r;
			if (!(on in e) && this.worker) {
				if (!(null == (r = this.room) ? void 0 : r.localParticipant.identity) || "" === this.room.localParticipant.identity) throw TypeError("local identity needs to be known in order to set up encrypted sender");
				if (sR()) {
					r_.info("initialize script transform");
					let r = {
						kind: "encode",
						participantIdentity: this.room.localParticipant.identity,
						trackId: t,
						codec: i,
						hasPacketTrailer: om(n),
						packetTrailer: n
					};
					e.transform = new RTCRtpScriptTransform(this.worker, r)
				} else {
					r_.info("initialize encoded streams");
					let r = e.createEncodedStreams(),
						a = {
							kind: "encode",
							data: {
								readableStream: r.readable,
								writableStream: r.writable,
								codec: i,
								trackId: t,
								participantIdentity: this.room.localParticipant.identity,
								isReuse: !1,
								hasPacketTrailer: om(n),
								packetTrailer: n
							}
						};
					this.worker.postMessage(a, [r.readable, r.writable])
				}
				e[on] = !0
			}
		}
	}
	class oC {
		constructor() {
			this.metadataMap = new Map, this.activeSsrc = 0
		}
		storeMetadata(e, t, i) {
			for (0 !== this.activeSsrc && this.activeSsrc !== t && this.metadataMap.clear(), this.activeSsrc = t; this.metadataMap.size >= 300;) {
				let e = this.metadataMap.keys().next().value;
				this.metadataMap.delete(e)
			}
			this.metadataMap.set(e, i)
		}
		lookupMetadata(e) {
			return this.metadataMap.get(e)
		}
		dispose() {
			this.metadataMap.clear(), this.activeSsrc = 0
		}
	}
	class ow {
		constructor(e) {
			this.extractors = new Map, this.workerPipelines = new Map, this.onWorkerMessage = e => {
				let t = e.data;
				if ("metadata" === t.kind) {
					let e = this.extractors.get(t.data.trackId);
					e && e.storeMetadata(t.data.rtpTimestamp, t.data.ssrc, t.data.metadata)
				}
			}, this.onWorkerError = e => {
				r_.error("frame metadata worker encountered an error:", {
					error: e.error
				})
			}, this.worker = null == e ? void 0 : e.worker
		}
		setup(e) {
			e !== this.room && (this.room = e, this.worker && (this.worker.onmessage = this.onWorkerMessage, this.worker.onerror = this.onWorkerError, this.worker.postMessage({
				kind: "init"
			})), e.on(em.TrackSubscribed, (e, t, i) => {
				"video" === e.kind && this.setupReceiver(e, t.trackInfo)
			}).on(em.TrackUnsubscribed, e => {
				this.teardownTrack(e)
			}).on(em.Disconnected, () => {
				this.cleanup()
			}))
		}
		setupReceiver(e, t) {
			var i, n, r;
			let a = e.receiver;
			if (!a) return;
			if (!((null == t ? void 0 : t.packetTrailerFeatures) && t.packetTrailerFeatures.length > 0)) {
				(null == (i = this.room) ? void 0 : i.hasE2EESetup) || this.setupPassthroughReceiver(a, e.mediaStreamID);
				return
			}
			if (!op(this.worker ? {
					worker: this.worker
				} : void 0) && !(null == (n = this.room) ? void 0 : n.hasE2EESetup)) return void r_.warn("frame metadata transform not supported; skipping extraction");
			let s = new oC,
				o = e.mediaStreamID;
			this.extractors.set(o, s), e.frameMetadataExtractor = s, null != (r = this.room) && r.hasE2EESetup || this.setupWorkerReceiver(a, o, !0)
		}
		setupPassthroughReceiver(e, t) {
			if (sR()) {
				"transform" in e && (e.transform = null);
				return
			}
			this.worker && op({
				worker: this.worker
			}) && !this.workerPipelines.has(e) ? this.setupWorkerReceiver(e, t, !1) : this.worker && this.workerPipelines.has(e) && this.setupWorkerReceiver(e, t, !1)
		}
		setupWorkerReceiver(e, t) {
			let i, n = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
				r = this.worker;
			if (!r) return;
			if (sR()) {
				e.transform = new RTCRtpScriptTransform(r, {
					kind: "decode",
					trackId: t
				});
				return
			}
			let a = this.workerPipelines.get(e);
			if (a) {
				r.postMessage({
					kind: "updateTrackId",
					data: {
						oldTrackId: a,
						newTrackId: t,
						hasPacketTrailer: n
					}
				}), this.workerPipelines.set(e, t);
				return
			}
			if (!("createEncodedStreams" in e)) return void r_.warn("createEncodedStreams not supported");
			try {
				i = e.createEncodedStreams()
			} catch (e) {
				r_.warn("failed to create encoded streams", {
					error: e
				});
				return
			}
			let s = {
				kind: "decode",
				data: {
					readableStream: i.readable,
					writableStream: i.writable,
					trackId: t,
					hasPacketTrailer: n
				}
			};
			r.postMessage(s, [i.readable, i.writable]), this.workerPipelines.set(e, t)
		}
		teardownTrack(e) {
			let t = e.mediaStreamID,
				i = this.extractors.get(t);
			i && (i.dispose(), this.extractors.delete(t)), e instanceof ok && (e.frameMetadataExtractor = void 0)
		}
		cleanup() {
			var e;
			for (let e of this.extractors.values()) e.dispose();
			this.extractors.clear(), this.workerPipelines.clear(), null == (e = this.worker) || e.terminate()
		}
	}
	class oE {
		constructor() {
			this.failedConnectionAttempts = new Map, this.backOffPromises = new Map
		}
		static getInstance() {
			return this._instance || (this._instance = new oE), this._instance
		}
		addFailedConnectionAttempt(e) {
			var t;
			let i = sx(new URL(e));
			if (!i) return;
			let n = null != (t = this.failedConnectionAttempts.get(i)) ? t : 0;
			this.failedConnectionAttempts.set(i, n + 1), this.backOffPromises.set(i, sv(Math.min(500 * Math.pow(2, n), 15e3)))
		}
		getBackOffPromise(e) {
			let t = new URL(e),
				i = t && sx(t);
			return i && this.backOffPromises.get(i) || Promise.resolve()
		}
		resetFailedConnectionAttempts(e) {
			let t = new URL(e),
				i = t && sx(t);
			i && (this.failedConnectionAttempts.set(i, 0), this.backOffPromises.set(i, Promise.resolve()))
		}
		resetAll() {
			this.backOffPromises.clear(), this.failedConnectionAttempts.clear()
		}
	}
	oE._instance = null;
	let oR = "default";
	class oP {
		constructor() {
			this._previousDevices = []
		}
		static getInstance() {
			return void 0 === this.instance && (this.instance = new oP), this.instance
		}
		get previousDevices() {
			return this._previousDevices
		}
		getDevices(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
				return function*() {
					var n;
					if ((null == (n = oP.userMediaPromiseMap) ? void 0 : n.size) > 0) {
						r_.debug("awaiting getUserMedia promise");
						try {
							e ? yield oP.userMediaPromiseMap.get(e): yield Promise.all(oP.userMediaPromiseMap.values())
						} catch (e) {
							r_.warn("error waiting for media permissons")
						}
					}
					let r = yield navigator.mediaDevices.enumerateDevices();
					if (i && !(sP() && t.hasDeviceInUse(e)) && (0 === r.filter(t => t.kind === e).length || r.some(t => {
							let i = "" === t.label,
								n = !e || t.kind === e;
							return i && n
						}))) {
						let t = yield navigator.mediaDevices.getUserMedia({
							video: "audioinput" !== e && "audiooutput" !== e,
							audio: "videoinput" !== e && {
								deviceId: {
									ideal: "default"
								}
							}
						});
						r = yield navigator.mediaDevices.enumerateDevices(), t.getTracks().forEach(e => {
							e.stop()
						})
					}
					return t._previousDevices = r, e && (r = r.filter(t => t.kind === e)), r
				}()
			})
		}
		normalizeDeviceId(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				if (t !== oR) return t;
				let n = yield this.getDevices(e), r = n.find(e => e.deviceId === oR);
				if (!r) return void r_.warn("could not reliably determine default device");
				let a = n.find(e => e.deviceId !== oR && e.groupId === (null != i ? i : r.groupId));
				return a ? null == a ? void 0 : a.deviceId : void r_.warn("could not reliably determine default device")
			})
		}
		hasDeviceInUse(e) {
			return e ? oP.userMediaPromiseMap.has(e) : oP.userMediaPromiseMap.size > 0
		}
	}
	oP.mediaDeviceKinds = ["audioinput", "audiooutput", "videoinput"], oP.userMediaPromiseMap = new Map;
	class oI {
		static u16(e) {
			return new oI(e, 65535)
		}
		static u32(e) {
			return new oI(e, 0xffffffff)
		}
		constructor(e, t) {
			if (this.value = e, e < 0) throw Error("WrapAroundUnsignedInt: cannot faithfully represent an integer smaller than 0");
			if (t > Number.MAX_SAFE_INTEGER) throw Error("WrapAroundUnsignedInt: cannot faithfully represent an integer bigger than MAX_SAFE_INTEGER.");
			this.maxSize = t, this.clamp()
		}
		clamp() {
			for (; this.value > this.maxSize;) this.value -= this.maxSize + 1;
			for (; this.value < 0;) this.value += this.maxSize + 1
		}
		clone() {
			return new oI(this.value, this.maxSize)
		}
		update(e) {
			this.value = e(this.value), this.clamp()
		}
		increment() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
			this.update(t => t + e)
		}
		decrement() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
			this.update(t => t - e)
		}
		getThenIncrement() {
			let e = this.value;
			return this.increment(), new oI(e, this.maxSize)
		}
		isBefore(e) {
			let t = this.value >>> 0,
				i = (e.value >>> 0) - t >>> 0;
			return 0 !== i && i < this.maxSize + 1
		}
	}
	class oD {
		static fromRtpTicks(e) {
			return new oD(e, 9e4)
		}
		static rtpRandom() {
			let e = Math.round(0xffffffff * Math.random());
			return oD.fromRtpTicks(e)
		}
		constructor(e, t) {
			this.timestamp = oI.u32(e), this.rateInHz = t
		}
		asTicks() {
			return this.timestamp.value
		}
		clone() {
			return new oD(this.timestamp.value, this.rateInHz)
		}
		wrappingAdd(e) {
			this.timestamp.increment(e)
		}
		isBefore(e) {
			return this.timestamp.isBefore(e.timestamp)
		}
	}
	class oM {
		constructor(e, t, i) {
			this.epoch = t, this.base = i, this.previous = i.clone(), this.rateInHz = e
		}
		static startingNow(e, t) {
			return new oM(t, new Date, e)
		}
		static startingAtTime(e, t, i) {
			return new oM(i, e, t)
		}
		static rtpStartingNow(e) {
			return oM.startingNow(e, 9e4)
		}
		static rtpStartingAtTime(e, t) {
			return oM.startingAtTime(e, t, 9e4)
		}
		now() {
			return this.at(new Date)
		}
		at(e) {
			let t = e.getTime() - this.epoch.getTime(),
				i = oM.durationInMsToTicks(t, this.rateInHz),
				n = this.base.clone();
			return n.wrappingAdd(i), n.isBefore(this.previous) && (n = this.previous), this.previous = n.clone(), n.clone()
		}
		static durationInMsToTicks(e, t) {
			return Math.round((1e6 * e * t + 5e8) / 1e9)
		}
	}

	function o_(e) {
		if (e instanceof DataView) return e;
		if (e instanceof ArrayBuffer) return new DataView(e);
		if (e instanceof Uint8Array) return new DataView(e.buffer, e.byteOffset, e.byteLength);
		throw Error("Error coercing ".concat(e, " to DataView - input was not DataView, ArrayBuffer, or Uint8Array."))
	}(A = eR || (eR = {}))[A.Reserved = 0] = "Reserved", A[A.TooLarge = 1] = "TooLarge";
	class oO extends aW {
		constructor(e, t) {
			super(19, e), this.name = "DataTrackHandleError", this.reason = t, this.reasonName = eR[t]
		}
		isReason(e) {
			return this.reason === e
		}
		static tooLarge() {
			return new oO("Value too large to be a valid track handle", eR.TooLarge)
		}
		static reserved(e) {
			return new oO("0x".concat(e.toString(16), " is a reserved value."), eR.Reserved)
		}
	}
	let oA = {
		fromNumber(e) {
			if (0 === e) throw oO.reserved(e);
			if (e > 65535) throw oO.tooLarge();
			return e
		}
	};
	class ox {
		constructor() {
			this.value = 0
		}
		get() {
			return (this.value += 1, this.value > 65535) ? null : this.value
		}
		reset() {
			this.value = 0
		}
	}
	let oL = e => ({
		sid: e.sid,
		pubHandle: e.pubHandle,
		name: e.name,
		usesE2ee: e.encryption !== iR.NONE
	});
	(x = eP || (eP = {}))[x.WAITING = 0] = "WAITING", x[x.RUNNING = 1] = "RUNNING", x[x.COMPLETED = 2] = "COMPLETED";
	class oN {
		constructor() {
			this.pendingTasks = new Map, this.taskMutex = new e0, this.nextTaskIndex = 0
		}
		run(e) {
			return rF(this, void 0, void 0, function*() {
				let t = {
					id: this.nextTaskIndex++,
					enqueuedAt: Date.now(),
					status: eP.WAITING
				};
				this.pendingTasks.set(t.id, t);
				let i = yield this.taskMutex.lock();
				try {
					return t.executedAt = Date.now(), t.status = eP.RUNNING, yield e()
				} finally {
					t.status = eP.COMPLETED, this.pendingTasks.delete(t.id), i()
				}
			})
		}
		flush() {
			return rF(this, void 0, void 0, function*() {
				return this.run(() => rF(this, void 0, void 0, function*() {}))
			})
		}
		snapshot() {
			return Array.from(this.pendingTasks.values())
		}
	}
	class oU {
		get readyState() {
			return this.ws.readyState
		}
		constructor(e) {
			var t, i;
			let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			if (null == (t = n.signal) ? void 0 : t.aborted) throw new DOMException("This operation was aborted", "AbortError");
			this.url = e;
			let r = new WebSocket(e, null != (i = n.protocols) ? i : []);
			r.binaryType = "arraybuffer", this.ws = r;
			let a = function() {
				let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
					t = e.closeCode,
					i = e.reason;
				return r.close(t, i)
			};
			this.opened = new aN((e, t) => {
				let i = () => {
					t(aK.websocket("Encountered websocket error during connection establishment"))
				};
				r.onopen = () => {
					e({
						readable: new ReadableStream({
							start(e) {
								r.onmessage = t => {
									let i = t.data;
									return e.enqueue(i)
								}, r.onerror = t => e.error(t)
							},
							cancel: a
						}),
						writable: new WritableStream({
							write(e) {
								r.send(e)
							},
							abort() {
								r.close()
							},
							close: a
						}),
						protocol: r.protocol,
						extensions: r.extensions
					}), r.removeEventListener("error", i)
				}, r.addEventListener("error", i)
			}), this.closed = new aN((e, t) => {
				let i = () => rF(this, void 0, void 0, function*() {
					let i = new aN(e => {
							r.readyState === WebSocket.CLOSED || r.addEventListener("close", t => {
								e(t)
							}, {
								once: !0
							})
						}),
						n = yield aN.race([sv(250), i]);
					n ? e(n) : t(aK.websocket("Encountered unspecified websocket error without a timely close event"))
				});
				r.onclose = t => {
					e({
						closeCode: t.code,
						reason: t.reason
					}), r.removeEventListener("error", i)
				}, r.addEventListener("error", i)
			}), n.signal && (n.signal.onabort = () => r.close()), this.close = a
		}
	}
	let oF = ["syncState", "trickle", "offer", "answer", "simulate", "leave"];
	(L = eI || (eI = {}))[L.CONNECTING = 0] = "CONNECTING", L[L.CONNECTED = 1] = "CONNECTED", L[L.RECONNECTING = 2] = "RECONNECTING", L[L.DISCONNECTING = 3] = "DISCONNECTING", L[L.DISCONNECTED = 4] = "DISCONNECTED";
	class oB {
		get currentState() {
			return this.state
		}
		get isDisconnected() {
			return this.state === eI.DISCONNECTING || this.state === eI.DISCONNECTED
		}
		get isEstablishingConnection() {
			return this.state === eI.CONNECTING || this.state === eI.RECONNECTING
		}
		getNextRequestId() {
			return this._requestId += 1, this._requestId
		}
		constructor() {
			var e;
			let t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
				i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			this.rtt = 0, this.state = eI.DISCONNECTED, this.log = r_, this._requestId = 0, this.useV0SignalPath = !1, this.resetCallbacks = () => {
				this.onAnswer = void 0, this.onLeave = void 0, this.onLocalTrackPublished = void 0, this.onLocalTrackUnpublished = void 0, this.onNegotiateRequested = void 0, this.onOffer = void 0, this.onRemoteMuteChanged = void 0, this.onSubscribedQualityUpdate = void 0, this.onTokenRefresh = void 0, this.onTrickle = void 0, this.onClose = void 0, this.onMediaSectionsRequirement = void 0
			}, this.loggerContextCb = i.loggerContextCb, this.log = rA(null != (e = i.loggerName) ? e : eo.Signal, () => this.logContext), this.useJSON = t, this.requestQueue = new oN, this.queuedRequests = [], this.closingLock = new e0, this.connectionLock = new e0, this.state = eI.DISCONNECTED
		}
		get logContext() {
			var e, t;
			return null != (t = null == (e = this.loggerContextCb) ? void 0 : e.call(this)) ? t : {}
		}
		join(e, t, i, n) {
			return rF(this, arguments, void 0, function(e, t, i, n) {
				var r = this;
				let a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
					s = arguments.length > 5 ? arguments[5] : void 0;
				return function*() {
					return r.state = eI.CONNECTING, r.options = i, yield r.connect(e, t, i, n, a, s)
				}()
			})
		}
		reconnect(e, t, i, n) {
			return rF(this, void 0, void 0, function*() {
				return this.options ? (this.state = eI.RECONNECTING, this.clearPingInterval(), yield this.connect(e, t, Object.assign(Object.assign({}, this.options), {
					reconnect: !0,
					sid: i,
					reconnectReason: n
				}), void 0, this.useV0SignalPath)) : void this.log.warn("attempted to reconnect without signal options being set, ignoring")
			})
		}
		connect(e, t, i, n) {
			return rF(this, arguments, void 0, function(e, t, i, n) {
				var r = this;
				let a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4],
					s = arguments.length > 5 ? arguments[5] : void 0;
				return function*() {
					var o, c, l, d, u;
					let h, p, m = yield r.connectionLock.lock();
					r.connectOptions = i, r.useV0SignalPath = a;
					let g = (p = new iX({
							capabilities: i.clientInfoCapabilities,
							sdk: iZ.JS,
							protocol: 17,
							clientProtocol: 1,
							version: aV
						}), sO() && (p.os = null != (o = sN()) ? o : ""), p),
						f = (function(e, t) {
							let i = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
								n = function(e, t) {
									let i = new URL(e.startsWith("http") ? e.replace(/^(http)/, "ws") : e);
									return t.forEach((e, t) => {
										i.searchParams.set(t, e)
									}), oe(i, "rtc")
								}(e, t);
							return i ? n : oe(n, "v1")
						})(e, a ? (c = t, l = g, d = i, (h = new URLSearchParams).set("access_token", c), d.reconnect && (h.set("reconnect", "1"), d.sid && h.set("sid", d.sid)), h.set("auto_subscribe", d.autoSubscribe ? "1" : "0"), h.set("sdk", sO() ? "reactnative" : "js"), h.set("version", l.version), h.set("protocol", l.protocol.toString()), h.set("client_protocol", l.clientProtocol.toString()), l.deviceModel && h.set("device_model", l.deviceModel), l.os && h.set("os", l.os), l.osVersion && h.set("os_version", l.osVersion), l.browser && h.set("browser", l.browser), l.browserVersion && h.set("browser_version", l.browserVersion), d.adaptiveStream && h.set("adaptive_stream", "1"), d.reconnectReason && h.set("reconnect_reason", d.reconnectReason.toString()), (null == (u = navigator.connection) ? void 0 : u.type) && h.set("network", navigator.connection.type), h) : yield function(e, t, i, n) {
							return rF(this, void 0, void 0, function*() {
								let r, a, s = new URLSearchParams;
								s.set("access_token", e);
								let o = new rS({
									clientInfo: t,
									connectionSettings: new rT({
										autoSubscribe: !!i.autoSubscribe,
										adaptiveStream: !!i.adaptiveStream
									}),
									reconnect: !!i.reconnect,
									participantSid: i.sid ? i.sid : void 0,
									publisherOffer: n
								});
								i.reconnectReason && (o.reconnectReason = i.reconnectReason);
								let c = o.toBinary();
								if (s5()) {
									let e = new CompressionStream("gzip"),
										t = e.writable.getWriter();
									t.write(new Uint8Array(c)), t.close();
									let i = [],
										n = e.readable.getReader();
									for (;;) {
										let e = yield n.read(), t = e.done, r = e.value;
										if (t) break;
										i.push(r)
									}
									let s = new Uint8Array(i.reduce((e, t) => e + t.length, 0)),
										o = 0;
									for (let e of i) s.set(e, o), o += e.length;
									r = s, a = rw.GZIP
								} else r = c, a = rw.NONE;
								let l = new rC({
									joinRequest: r,
									compression: a
								}).toBinary();
								return s.set("join_request", btoa(Array.from(l, e => String.fromCodePoint(e)).join("")).replace(/\+/g, "-").replace(/\//g, "_")), s
							})
						}(t, g, i, s), a).toString(),
						v = oe(new URL(sY(f)), "validate").toString();
					return new Promise((e, t) => rF(r, void 0, void 0, function*() {
						var r, a;
						try {
							let s = !1,
								o = e => rF(this, void 0, void 0, function*() {
									if (s) return;
									s = !0;
									let i = function(e) {
										let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Unknown reason";
										if (!(e instanceof AbortSignal)) return t;
										let i = e.reason;
										switch (typeof i) {
											case "string":
												return i;
											case "object":
												return i instanceof Error ? i.message : t;
											default:
												return "toString" in i ? i.toString() : t
										}
									}(e instanceof Event ? e.currentTarget : e, "Abort handler called");
									this.streamWriter && !this.isDisconnected ? this.sendLeave().then(() => this.close(i)).catch(e => {
										this.log.error(e), this.close()
									}) : this.close(), c(), t(aK.cancelled(i))
								});
							null == n || n.addEventListener("abort", o);
							let c = () => {
									clearTimeout(l), null == n || n.removeEventListener("abort", o)
								},
								l = setTimeout(() => {
									o(aK.timeout("room connection has timed out (signal)"))
								}, i.websocketTimeout),
								d = (e, t) => {
									this.handleSignalConnected(e, l, t)
								},
								u = new URL(f);
							if (u.searchParams.has("access_token") && u.searchParams.set("access_token", "<redacted>"), this.ws) {
								let e = performance.now();
								yield this.close(!1), this.log.debug("closed previous ws connection in ".concat(performance.now() - e, "ms"))
							}
							this.log.info("signal connecting to ".concat(u), {
								reconnect: i.reconnect,
								reconnectReason: i.reconnectReason
							}), this.ws = new oU(f);
							try {
								let n, s;
								this.ws.closed.then(e => {
									this.isEstablishingConnection && t(aK.internal("Websocket got closed during a (re)connection attempt: ".concat(e.reason))), 1e3 !== e.closeCode && (this.log.warn("websocket closed", {
										reason: e.reason,
										code: e.closeCode,
										wasClean: 1e3 === e.closeCode,
										state: this.state
									}), this.state === eI.CONNECTED && this.handleOnClose(e.reason || "Unexpected WS error"))
								}).catch(e => {
									this.isEstablishingConnection && t(aK.internal("Websocket error during a (re)connection attempt: ".concat(e)))
								});
								let o = yield this.ws.opened.catch(e => rF(this, void 0, void 0, function*() {
									if (this.state !== eI.CONNECTED) {
										this.state = eI.DISCONNECTED, clearTimeout(l), t((yield this.handleConnectionError(e, v)));
										return
									}
									this.handleWSError(e), t(e)
								}));
								if (clearTimeout(l), !o) return;
								let c = o.readable.getReader();
								this.streamWriter = o.writable.getWriter();
								try {
									n = yield Promise.race([c.read(), new Promise((e, t) => {
										s = setTimeout(() => {
											t(aK.timeout("signal connection timed out while waiting for the first message"))
										}, 5e3)
									})])
								} catch (e) {
									c.releaseLock(), t(e), this.close();
									return
								} finally {
									clearTimeout(s)
								}
								if (c.releaseLock(), !n.value) throw aK.internal("no message received as first message");
								let u = ot(n.value),
									h = this.validateFirstMessage(u, null != (r = i.reconnect) && r);
								if (!h.isValid) return void t(h.error);
								(null == (a = u.message) ? void 0 : a.case) === "join" && (this.pingTimeoutDuration = u.message.value.pingTimeout, this.pingIntervalDuration = u.message.value.pingInterval, this.pingTimeoutDuration && this.pingTimeoutDuration > 0 && this.log.debug("ping config", {
									timeout: this.pingTimeoutDuration,
									interval: this.pingIntervalDuration
								}), this.onJoined && this.onJoined(u.message.value));
								let p = h.shouldProcessFirstMessage ? u : void 0;
								d(o, p), e(h.response)
							} catch (e) {
								t(e)
							} finally {
								c()
							}
						} finally {
							m()
						}
					}))
				}()
			})
		}
		startReadingLoop(e, t) {
			return rF(this, void 0, void 0, function*() {
				for (t && this.handleSignalResponse(t);;) {
					this.signalLatency && (yield sv(this.signalLatency));
					let t = yield e.read(), i = t.done, n = t.value;
					if (i) break;
					let r = ot(n);
					this.handleSignalResponse(r)
				}
			})
		}
		close() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0],
					i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Close method called on signal client";
				return function*() {
					if ([eI.DISCONNECTING || eI.DISCONNECTED].includes(e.state)) return void e.log.debug("ignoring signal close as it's already in disconnecting state");
					let n = yield e.closingLock.lock();
					try {
						if (e.clearPingInterval(), t && (e.state = eI.DISCONNECTING), e.ws) {
							e.ws.close({
								closeCode: 1e3,
								reason: i
							});
							let t = e.ws.closed;
							e.ws = void 0, e.streamWriter = void 0, yield Promise.race([t, sv(250)])
						}
					} catch (t) {
						e.log.debug("websocket error while closing", {
							error: t
						})
					} finally {
						t && (e.state = eI.DISCONNECTED), n()
					}
				}()
			})
		}
		sendOffer(e, t) {
			this.log.debug("sending offer", {
				offerSdp: e.sdp
			}), this.sendRequest({
				case: "offer",
				value: oq(e, t)
			})
		}
		sendAnswer(e, t) {
			return this.log.debug("sending answer", {
				answerSdp: e.sdp
			}), this.sendRequest({
				case: "answer",
				value: oq(e, t)
			})
		}
		sendIceCandidate(e, t) {
			return this.log.debug("sending ice candidate", {
				candidate: e
			}), this.sendRequest({
				case: "trickle",
				value: new nj({
					candidateInit: JSON.stringify(e),
					target: t
				})
			})
		}
		sendMuteTrack(e, t) {
			return this.sendRequest({
				case: "mute",
				value: new nq({
					sid: e,
					muted: t
				})
			})
		}
		sendAddTrack(e) {
			return this.sendRequest({
				case: "addTrack",
				value: e
			})
		}
		sendUpdateLocalMetadata(e, t) {
			return rF(this, arguments, void 0, function(e, t) {
				var i = this;
				let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
				return function*() {
					let r = i.getNextRequestId();
					return yield i.sendRequest({
						case: "updateMetadata",
						value: new n3({
							requestId: r,
							metadata: e,
							name: t,
							attributes: n
						})
					}), r
				}()
			})
		}
		sendUpdateTrackSettings(e) {
			this.sendRequest({
				case: "trackSetting",
				value: e
			})
		}
		sendUpdateSubscription(e) {
			return this.sendRequest({
				case: "subscription",
				value: e
			})
		}
		sendSyncState(e) {
			return this.sendRequest({
				case: "syncState",
				value: e
			})
		}
		sendUpdateVideoLayers(e, t) {
			return this.sendRequest({
				case: "updateLayers",
				value: new n2({
					trackSid: e,
					layers: t
				})
			})
		}
		sendUpdateSubscriptionPermissions(e, t) {
			return this.sendRequest({
				case: "subscriptionPermission",
				value: new rs({
					allParticipants: e,
					trackPermissions: t
				})
			})
		}
		sendSimulateScenario(e) {
			return this.sendRequest({
				case: "simulate",
				value: e
			})
		}
		sendPing() {
			return Promise.all([this.sendRequest({
				case: "ping",
				value: tl.parse(Date.now())
			}), this.sendRequest({
				case: "pingReq",
				value: new rp({
					timestamp: tl.parse(Date.now()),
					rtt: tl.parse(this.rtt)
				})
			})])
		}
		sendUpdateLocalAudioTrack(e, t) {
			return this.sendRequest({
				case: "updateAudioTrack",
				value: new nZ({
					trackSid: e,
					features: t
				})
			})
		}
		sendLeave() {
			return this.sendRequest({
				case: "leave",
				value: new n0({
					reason: ip.CLIENT_INITIATED,
					action: n1.DISCONNECT
				})
			})
		}
		sendPublishDataTrackRequest(e, t, i) {
			return this.sendRequest({
				case: "publishDataTrackRequest",
				value: new nx({
					pubHandle: e,
					name: t,
					encryption: i ? iR.GCM : iR.NONE
				})
			})
		}
		sendUnPublishDataTrackRequest(e) {
			return this.sendRequest({
				case: "unpublishDataTrackRequest",
				value: new nN({
					pubHandle: e
				})
			})
		}
		sendUpdateDataSubscription(e, t) {
			return this.sendRequest({
				case: "updateDataSubscription",
				value: new nQ({
					updates: [new nY({
						trackSid: e,
						subscribe: t
					})]
				})
			})
		}
		sendRequest(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
				return function*() {
					let n;
					if (!i && (n = oF.indexOf(e.case) >= 0, r_.trace("request allowed to bypass queue:", {
							canPass: n,
							req: e
						}), !n) && t.state === eI.RECONNECTING) return void t.queuedRequests.push(() => rF(t, void 0, void 0, function*() {
						yield this.sendRequest(e, !0)
					}));
					if (i || (yield t.requestQueue.flush()), t.signalLatency && (yield sv(t.signalLatency)), t.isDisconnected) return void t.log.debug("skipping signal request (type: ".concat(e.case, ") - SignalClient disconnected"));
					if (!t.streamWriter) return void t.log.error("cannot send signal request before connected, type: ".concat(null == e ? void 0 : e.case));
					let r = new nM({
						message: e
					});
					try {
						t.useJSON ? yield t.streamWriter.write(r.toJsonString()): yield t.streamWriter.write(r.toBinary().buffer)
					} catch (e) {
						t.log.error("error sending signal message", {
							error: e
						})
					}
				}()
			})
		}
		handleSignalResponse(e) {
			var t, i;
			let n = e.message;
			if (void 0 == n) return void this.log.debug("received unsupported message");
			let r = !1;
			if ("answer" === n.case) {
				let e = oj(n.value);
				this.onAnswer && this.onAnswer(e, n.value.id, n.value.midToTrackId)
			} else if ("offer" === n.case) {
				let e = oj(n.value);
				this.onOffer && this.onOffer(e, n.value.id, n.value.midToTrackId)
			} else if ("trickle" === n.case) {
				let e = JSON.parse(n.value.candidateInit);
				this.onTrickle && this.onTrickle(e, n.value.target)
			} else "update" === n.case ? this.onParticipantUpdate && this.onParticipantUpdate(null != (t = n.value.participants) ? t : []) : "trackPublished" === n.case ? this.onLocalTrackPublished && this.onLocalTrackPublished(n.value) : "speakersChanged" === n.case ? this.onSpeakersChanged && this.onSpeakersChanged(null != (i = n.value.speakers) ? i : []) : "leave" === n.case ? this.onLeave && this.onLeave(n.value) : "mute" === n.case ? this.onRemoteMuteChanged && this.onRemoteMuteChanged(n.value.sid, n.value.muted) : "roomUpdate" === n.case ? this.onRoomUpdate && n.value.room && this.onRoomUpdate(n.value.room) : "connectionQuality" === n.case ? this.onConnectionQuality && this.onConnectionQuality(n.value) : "streamStateUpdate" === n.case ? this.onStreamStateUpdate && this.onStreamStateUpdate(n.value) : "subscribedQualityUpdate" === n.case ? this.onSubscribedQualityUpdate && this.onSubscribedQualityUpdate(n.value) : "subscriptionPermissionUpdate" === n.case ? this.onSubscriptionPermissionUpdate && this.onSubscriptionPermissionUpdate(n.value) : "refreshToken" === n.case ? this.onTokenRefresh && this.onTokenRefresh(n.value) : "trackUnpublished" === n.case ? this.onLocalTrackUnpublished && this.onLocalTrackUnpublished(n.value) : "subscriptionResponse" === n.case ? this.onSubscriptionError && this.onSubscriptionError(n.value) : "pong" === n.case || ("pongResp" === n.case ? (this.rtt = Date.now() - Number.parseInt(n.value.lastPingTimestamp.toString()), this.resetPingTimeout(), r = !0) : "requestResponse" === n.case ? this.onRequestResponse && this.onRequestResponse(n.value) : "trackSubscribed" === n.case ? this.onLocalTrackSubscribed && this.onLocalTrackSubscribed(n.value.trackSid) : "roomMoved" === n.case ? (this.onTokenRefresh && this.onTokenRefresh(n.value.token), this.onRoomMoved && this.onRoomMoved(n.value)) : "mediaSectionsRequirement" === n.case ? this.onMediaSectionsRequirement && this.onMediaSectionsRequirement(n.value) : "publishDataTrackResponse" === n.case ? this.onPublishDataTrackResponse && this.onPublishDataTrackResponse(n.value) : "unpublishDataTrackResponse" === n.case ? this.onUnPublishDataTrackResponse && this.onUnPublishDataTrackResponse(n.value) : "dataTrackSubscriberHandles" === n.case ? this.onDataTrackSubscriberHandles && this.onDataTrackSubscriberHandles(n.value) : this.log.debug("unsupported message", {
				msgCase: n.case
			}));
			r || this.resetPingTimeout()
		}
		setReconnected() {
			for (; this.queuedRequests.length > 0;) {
				let e = this.queuedRequests.shift();
				e && this.requestQueue.run(e)
			}
		}
		handleOnClose(e) {
			return rF(this, void 0, void 0, function*() {
				if (this.state === eI.DISCONNECTED) return;
				let t = this.onClose;
				yield this.close(void 0, e), this.log.info("websocket connection closed: ".concat(e), {
					reason: e
				}), t && t(e)
			})
		}
		handleWSError(e) {
			this.log.error("websocket error", {
				error: e
			})
		}
		resetPingTimeout() {
			(this.clearPingTimeout(), this.pingTimeoutDuration) ? this.pingTimeout = a2.setTimeout(() => {
				this.log.warn("ping timeout triggered. last pong received at: ".concat(new Date(Date.now() - 1e3 * this.pingTimeoutDuration).toUTCString())), this.handleOnClose("ping timeout")
			}, 1e3 * this.pingTimeoutDuration): this.log.warn("ping timeout duration not set")
		}
		clearPingTimeout() {
			this.pingTimeout && a2.clearTimeout(this.pingTimeout)
		}
		startPingInterval() {
			(this.clearPingInterval(), this.resetPingTimeout(), this.pingIntervalDuration) ? (this.log.debug("start ping interval"), this.pingInterval = a2.setInterval(() => {
				this.sendPing()
			}, 1e3 * this.pingIntervalDuration)) : this.log.warn("ping interval duration not set")
		}
		clearPingInterval() {
			this.log.debug("clearing ping interval"), this.clearPingTimeout(), this.pingInterval && a2.clearInterval(this.pingInterval)
		}
		handleSignalConnected(e, t, i) {
			this.state = eI.CONNECTED, this.log.info("signal connected"), clearTimeout(t), this.startPingInterval(), this.startReadingLoop(e.readable.getReader(), i)
		}
		validateFirstMessage(e, t) {
			var i, n, r, a, s;
			if ((null == (i = e.message) ? void 0 : i.case) === "join") return {
				isValid: !0,
				response: e.message.value
			};
			if (this.state === eI.RECONNECTING && (null == (n = e.message) ? void 0 : n.case) !== "leave")
				if ((null == (r = e.message) ? void 0 : r.case) === "reconnect") return {
					isValid: !0,
					response: e.message.value
				};
				else return this.log.debug("declaring signal reconnected without reconnect response received"), {
					isValid: !0,
					response: void 0,
					shouldProcessFirstMessage: !0
				};
			return this.isEstablishingConnection && (null == (a = e.message) ? void 0 : a.case) === "leave" ? {
				isValid: !1,
				error: aK.leaveRequest("Received leave request while trying to (re)connect", e.message.value.reason)
			} : t ? {
				isValid: !1,
				error: aK.internal("Unexpected first message")
			} : {
				isValid: !1,
				error: aK.internal("did not receive join response, got ".concat(null == (s = e.message) ? void 0 : s.case, " instead"))
			}
		}
		handleConnectionError(e, t) {
			return rF(this, void 0, void 0, function*() {
				try {
					let i = yield fetch(t);
					switch (i.status) {
						case 404:
							let n = yield i.text();
							if (n.includes("requested room does not exist")) return aK.notAllowed(n, i.status);
							return aK.serviceNotFound("v1 RTC path not found. Consider upgrading your LiveKit server version", "v0-rtc");
						case 401:
						case 403:
							let r = yield i.text();
							return aK.notAllowed(r, i.status)
					}
					if (e instanceof aK) return e;
					return aK.internal("Encountered unknown websocket error during connection: ".concat(e), {
						status: i.status,
						statusText: i.statusText
					})
				} catch (e) {
					return e instanceof aK ? e : aK.serverUnreachable(e instanceof Error ? e.message : "server was not reachable")
				}
			})
		}
	}

	function oj(e) {
		let t = {
			type: "offer",
			sdp: e.sdp
		};
		switch (e.type) {
			case "answer":
			case "offer":
			case "pranswer":
			case "rollback":
				t.type = e.type
		}
		return t
	}

	function oq(e, t) {
		return new nz({
			sdp: e.sdp,
			type: e.type,
			id: t
		})
	}
	class oV {
		constructor() {
			this.buffer = [], this._totalSize = 0, this._sentSize = 0
		}
		push(e) {
			this.buffer.push(e), this._totalSize += e.data.byteLength, e.sent && (this._sentSize += e.data.byteLength)
		}
		pop() {
			let e = this.buffer.shift();
			return e && (this._totalSize -= e.data.byteLength, e.sent && (this._sentSize -= e.data.byteLength)), e
		}
		getAll() {
			return this.buffer.slice()
		}
		getUnsent() {
			return this.buffer.filter(e => !e.sent)
		}
		markSent(e) {
			e.sent || (e.sent = !0, this._sentSize += e.data.byteLength)
		}
		markAllUnsent() {
			for (let e of this.buffer) e.sent = !1;
			this._sentSize = 0
		}
		popToSequence(e) {
			for (; this.buffer.length > 0;)
				if (this.buffer[0].sequence <= e) this.pop();
				else break
		}
		alignBufferedAmount(e) {
			for (; this.buffer.length > 0;) {
				let t = this.buffer[0];
				if (!t.sent || this._sentSize - t.data.byteLength <= e) break;
				this.pop()
			}
		}
		get length() {
			return this.buffer.length
		}
	}
	class oH {
		constructor(e) {
			this._map = new Map, this._lastCleanup = 0, this.ttl = e
		}
		set(e, t) {
			let i = Date.now();
			i - this._lastCleanup > this.ttl / 2 && this.cleanup();
			let n = i + this.ttl;
			return this._map.set(e, {
				value: t,
				expiresAt: n
			}), this
		}
		get(e) {
			let t = this._map.get(e);
			if (t) return t.expiresAt < Date.now() ? void this._map.delete(e) : t.value
		}
		has(e) {
			let t = this._map.get(e);
			return !!t && (!(t.expiresAt < Date.now()) || (this._map.delete(e), !1))
		}
		delete(e) {
			return this._map.delete(e)
		}
		clear() {
			this._map.clear()
		}
		cleanup() {
			let e = Date.now();
			for (let i of this._map.entries()) {
				var t = tg(i, 2);
				let n = t[0];
				t[1].expiresAt < e && this._map.delete(n)
			}
			this._lastCleanup = e
		}
		get size() {
			return this.cleanup(), this._map.size
		}
		forEach(e) {
			for (let i of (this.cleanup(), this._map.entries())) {
				var t = tg(i, 2);
				let n = t[0],
					r = t[1];
				r.expiresAt >= Date.now() && e(r.value, n, this.asValueMap())
			}
		}
		map(e) {
			this.cleanup();
			let t = [],
				i = this.asValueMap();
			for (let r of i.entries()) {
				var n = tg(r, 2);
				let a = n[0],
					s = n[1];
				t.push(e(s, a, i))
			}
			return t
		}
		asValueMap() {
			let e = new Map;
			for (let i of this._map.entries()) {
				var t = tg(i, 2);
				let n = t[0],
					r = t[1];
				r.expiresAt >= Date.now() && e.set(n, r.value)
			}
			return e
		}
	}
	var oW = {},
		oK = {},
		oz = {
			exports: {}
		};

	function oJ() {
		if (eD) return oz.exports;
		eD = 1;
		var e = oz.exports = {
			v: [{
				name: "version",
				reg: /^(\d*)$/
			}],
			o: [{
				name: "origin",
				reg: /^(\S*) (\d*) (\d*) (\S*) IP(\d) (\S*)/,
				names: ["username", "sessionId", "sessionVersion", "netType", "ipVer", "address"],
				format: "%s %s %d %s IP%d %s"
			}],
			s: [{
				name: "name"
			}],
			i: [{
				name: "description"
			}],
			u: [{
				name: "uri"
			}],
			e: [{
				name: "email"
			}],
			p: [{
				name: "phone"
			}],
			z: [{
				name: "timezones"
			}],
			r: [{
				name: "repeats"
			}],
			t: [{
				name: "timing",
				reg: /^(\d*) (\d*)/,
				names: ["start", "stop"],
				format: "%d %d"
			}],
			c: [{
				name: "connection",
				reg: /^IN IP(\d) (\S*)/,
				names: ["version", "ip"],
				format: "IN IP%d %s"
			}],
			b: [{
				push: "bandwidth",
				reg: /^(TIAS|AS|CT|RR|RS):(\d*)/,
				names: ["type", "limit"],
				format: "%s:%s"
			}],
			m: [{
				reg: /^(\w*) (\d*) ([\w/]*)(?: (.*))?/,
				names: ["type", "port", "protocol", "payloads"],
				format: "%s %d %s %s"
			}],
			a: [{
				push: "rtp",
				reg: /^rtpmap:(\d*) ([\w\-.]*)(?:\s*\/(\d*)(?:\s*\/(\S*))?)?/,
				names: ["payload", "codec", "rate", "encoding"],
				format: function(e) {
					return e.encoding ? "rtpmap:%d %s/%s/%s" : e.rate ? "rtpmap:%d %s/%s" : "rtpmap:%d %s"
				}
			}, {
				push: "fmtp",
				reg: /^fmtp:(\d*) ([\S| ]*)/,
				names: ["payload", "config"],
				format: "fmtp:%d %s"
			}, {
				name: "control",
				reg: /^control:(.*)/,
				format: "control:%s"
			}, {
				name: "rtcp",
				reg: /^rtcp:(\d*)(?: (\S*) IP(\d) (\S*))?/,
				names: ["port", "netType", "ipVer", "address"],
				format: function(e) {
					return null != e.address ? "rtcp:%d %s IP%d %s" : "rtcp:%d"
				}
			}, {
				push: "rtcpFbTrrInt",
				reg: /^rtcp-fb:(\*|\d*) trr-int (\d*)/,
				names: ["payload", "value"],
				format: "rtcp-fb:%s trr-int %d"
			}, {
				push: "rtcpFb",
				reg: /^rtcp-fb:(\*|\d*) ([\w-_]*)(?: ([\w-_]*))?/,
				names: ["payload", "type", "subtype"],
				format: function(e) {
					return null != e.subtype ? "rtcp-fb:%s %s %s" : "rtcp-fb:%s %s"
				}
			}, {
				push: "ext",
				reg: /^extmap:(\d+)(?:\/(\w+))?(?: (urn:ietf:params:rtp-hdrext:encrypt))? (\S*)(?: (\S*))?/,
				names: ["value", "direction", "encrypt-uri", "uri", "config"],
				format: function(e) {
					return "extmap:%d" + (e.direction ? "/%s" : "%v") + (e["encrypt-uri"] ? " %s" : "%v") + " %s" + (e.config ? " %s" : "")
				}
			}, {
				name: "extmapAllowMixed",
				reg: /^(extmap-allow-mixed)/
			}, {
				push: "crypto",
				reg: /^crypto:(\d*) ([\w_]*) (\S*)(?: (\S*))?/,
				names: ["id", "suite", "config", "sessionConfig"],
				format: function(e) {
					return null != e.sessionConfig ? "crypto:%d %s %s %s" : "crypto:%d %s %s"
				}
			}, {
				name: "setup",
				reg: /^setup:(\w*)/,
				format: "setup:%s"
			}, {
				name: "connectionType",
				reg: /^connection:(new|existing)/,
				format: "connection:%s"
			}, {
				name: "mid",
				reg: /^mid:([^\s]*)/,
				format: "mid:%s"
			}, {
				name: "msid",
				reg: /^msid:(.*)/,
				format: "msid:%s"
			}, {
				name: "ptime",
				reg: /^ptime:(\d*(?:\.\d*)*)/,
				format: "ptime:%d"
			}, {
				name: "maxptime",
				reg: /^maxptime:(\d*(?:\.\d*)*)/,
				format: "maxptime:%d"
			}, {
				name: "direction",
				reg: /^(sendrecv|recvonly|sendonly|inactive)/
			}, {
				name: "icelite",
				reg: /^(ice-lite)/
			}, {
				name: "iceUfrag",
				reg: /^ice-ufrag:(\S*)/,
				format: "ice-ufrag:%s"
			}, {
				name: "icePwd",
				reg: /^ice-pwd:(\S*)/,
				format: "ice-pwd:%s"
			}, {
				name: "fingerprint",
				reg: /^fingerprint:(\S*) (\S*)/,
				names: ["type", "hash"],
				format: "fingerprint:%s %s"
			}, {
				push: "candidates",
				reg: /^candidate:(\S*) (\d*) (\S*) (\d*) (\S*) (\d*) typ (\S*)(?: raddr (\S*) rport (\d*))?(?: tcptype (\S*))?(?: generation (\d*))?(?: network-id (\d*))?(?: network-cost (\d*))?/,
				names: ["foundation", "component", "transport", "priority", "ip", "port", "type", "raddr", "rport", "tcptype", "generation", "network-id", "network-cost"],
				format: function(e) {
					var t = "candidate:%s %d %s %d %s %d typ %s";
					return t += (null != e.raddr ? " raddr %s rport %d" : "%v%v") + (null != e.tcptype ? " tcptype %s" : "%v"), null != e.generation && (t += " generation %d"), t += (null != e["network-id"] ? " network-id %d" : "%v") + (null != e["network-cost"] ? " network-cost %d" : "%v")
				}
			}, {
				name: "endOfCandidates",
				reg: /^(end-of-candidates)/
			}, {
				name: "remoteCandidates",
				reg: /^remote-candidates:(.*)/,
				format: "remote-candidates:%s"
			}, {
				name: "iceOptions",
				reg: /^ice-options:(\S*)/,
				format: "ice-options:%s"
			}, {
				push: "ssrcs",
				reg: /^ssrc:(\d*) ([\w_-]*)(?::(.*))?/,
				names: ["id", "attribute", "value"],
				format: function(e) {
					var t = "ssrc:%d";
					return null != e.attribute && (t += " %s", null != e.value && (t += ":%s")), t
				}
			}, {
				push: "ssrcGroups",
				reg: /^ssrc-group:([\x21\x23\x24\x25\x26\x27\x2A\x2B\x2D\x2E\w]*) (.*)/,
				names: ["semantics", "ssrcs"],
				format: "ssrc-group:%s %s"
			}, {
				name: "msidSemantic",
				reg: /^msid-semantic:\s?(\w*) (\S*)/,
				names: ["semantic", "token"],
				format: "msid-semantic: %s %s"
			}, {
				push: "groups",
				reg: /^group:(\w*) (.*)/,
				names: ["type", "mids"],
				format: "group:%s %s"
			}, {
				name: "rtcpMux",
				reg: /^(rtcp-mux)/
			}, {
				name: "rtcpRsize",
				reg: /^(rtcp-rsize)/
			}, {
				name: "sctpmap",
				reg: /^sctpmap:([\w_/]*) (\S*)(?: (\S*))?/,
				names: ["sctpmapNumber", "app", "maxMessageSize"],
				format: function(e) {
					return null != e.maxMessageSize ? "sctpmap:%s %s %s" : "sctpmap:%s %s"
				}
			}, {
				name: "xGoogleFlag",
				reg: /^x-google-flag:([^\s]*)/,
				format: "x-google-flag:%s"
			}, {
				push: "rids",
				reg: /^rid:([\d\w]+) (\w+)(?: ([\S| ]*))?/,
				names: ["id", "direction", "params"],
				format: function(e) {
					return e.params ? "rid:%s %s %s" : "rid:%s %s"
				}
			}, {
				push: "imageattrs",
				reg: RegExp("^imageattr:(\\d+|\\*)[\\s\\t]+(send|recv)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*)(?:[\\s\\t]+(recv|send)[\\s\\t]+(\\*|\\[\\S+\\](?:[\\s\\t]+\\[\\S+\\])*))?"),
				names: ["pt", "dir1", "attrs1", "dir2", "attrs2"],
				format: function(e) {
					return "imageattr:%s %s %s" + (e.dir2 ? " %s %s" : "")
				}
			}, {
				name: "simulcast",
				reg: RegExp("^simulcast:(send|recv) ([a-zA-Z0-9\\-_~;,]+)(?:\\s?(send|recv) ([a-zA-Z0-9\\-_~;,]+))?$"),
				names: ["dir1", "list1", "dir2", "list2"],
				format: function(e) {
					return "simulcast:%s %s" + (e.dir2 ? " %s %s" : "")
				}
			}, {
				name: "simulcast_03",
				reg: /^simulcast:[\s\t]+([\S+\s\t]+)$/,
				names: ["value"],
				format: "simulcast: %s"
			}, {
				name: "framerate",
				reg: /^framerate:(\d+(?:$|\.\d+))/,
				format: "framerate:%s"
			}, {
				name: "sourceFilter",
				reg: /^source-filter: *(excl|incl) (\S*) (IP4|IP6|\*) (\S*) (.*)/,
				names: ["filterMode", "netType", "addressTypes", "destAddress", "srcList"],
				format: "source-filter: %s %s %s %s %s"
			}, {
				name: "bundleOnly",
				reg: /^(bundle-only)/
			}, {
				name: "label",
				reg: /^label:(.+)/,
				format: "label:%s"
			}, {
				name: "sctpPort",
				reg: /^sctp-port:(\d+)$/,
				format: "sctp-port:%s"
			}, {
				name: "maxMessageSize",
				reg: /^max-message-size:(\d+)$/,
				format: "max-message-size:%s"
			}, {
				push: "tsRefClocks",
				reg: /^ts-refclk:([^\s=]*)(?:=(\S*))?/,
				names: ["clksrc", "clksrcExt"],
				format: function(e) {
					return "ts-refclk:%s" + (null != e.clksrcExt ? "=%s" : "")
				}
			}, {
				name: "mediaClk",
				reg: /^mediaclk:(?:id=(\S*))? *([^\s=]*)(?:=(\S*))?(?: *rate=(\d+)\/(\d+))?/,
				names: ["id", "mediaClockName", "mediaClockValue", "rateNumerator", "rateDenominator"],
				format: function(e) {
					var t = "mediaclk:";
					return t + ((null != e.id ? "id=%s %s" : "%v%s") + (null != e.mediaClockValue ? "=%s" : "") + (null != e.rateNumerator ? " rate=%s" : "") + (null != e.rateDenominator ? "/%s" : ""))
				}
			}, {
				name: "keywords",
				reg: /^keywds:(.+)$/,
				format: "keywds:%s"
			}, {
				name: "content",
				reg: /^content:(.+)/,
				format: "content:%s"
			}, {
				name: "bfcpFloorCtrl",
				reg: /^floorctrl:(c-only|s-only|c-s)/,
				format: "floorctrl:%s"
			}, {
				name: "bfcpConfId",
				reg: /^confid:(\d+)/,
				format: "confid:%s"
			}, {
				name: "bfcpUserId",
				reg: /^userid:(\d+)/,
				format: "userid:%s"
			}, {
				name: "bfcpFloorId",
				reg: /^floorid:(.+) (?:m-stream|mstrm):(.+)/,
				names: ["id", "mStream"],
				format: "floorid:%s mstrm:%s"
			}, {
				push: "invalid",
				names: ["value"]
			}]
		};
		return Object.keys(e).forEach(function(t) {
			e[t].forEach(function(e) {
				e.reg || (e.reg = /(.*)/), e.format || (e.format = "%s")
			})
		}), oz.exports
	}
	var oG = function() {
		if (eA) return oW;
		eA = 1;
		var e = function() {
				var e, t, i, n, r, a;
				return eM ? oK : (eM = 1, e = function(e) {
					return String(Number(e)) === e ? Number(e) : e
				}, t = function(t, i, n, r) {
					if (r && !n) i[r] = e(t[1]);
					else
						for (var a = 0; a < n.length; a += 1) null != t[a + 1] && (i[n[a]] = e(t[a + 1]))
				}, i = function(e, i, n) {
					var r = e.name && e.names;
					e.push && !i[e.push] ? i[e.push] = [] : r && !i[e.name] && (i[e.name] = {});
					var a = e.push ? {} : r ? i[e.name] : i;
					t(n.match(e.reg), a, e.names, e.name), e.push && i[e.push].push(a)
				}, n = oJ(), r = RegExp.prototype.test.bind(/^([a-z])=(.*)/), oK.parse = function(e) {
					var t = {},
						a = [],
						s = t;
					return e.split(/(\r\n|\r|\n)/).filter(r).forEach(function(e) {
						var t = e[0],
							r = e.slice(2);
						"m" === t && (a.push({
							rtp: [],
							fmtp: []
						}), s = a[a.length - 1]);
						for (var o = 0; o < (n[t] || []).length; o += 1) {
							var c = n[t][o];
							if (c.reg.test(r)) return i(c, s, r)
						}
					}), t.media = a, t
				}, a = function(t, i) {
					var n = i.split(/=(.+)/, 2);
					return 2 === n.length ? t[n[0]] = e(n[1]) : 1 === n.length && i.length > 1 && (t[n[0]] = void 0), t
				}, oK.parseParams = function(e) {
					return e.split(/;\s?/).reduce(a, {})
				}, oK.parseFmtpConfig = oK.parseParams, oK.parsePayloads = function(e) {
					return e.toString().split(" ").map(Number)
				}, oK.parseRemoteCandidates = function(t) {
					for (var i = [], n = t.split(" ").map(e), r = 0; r < n.length; r += 3) i.push({
						component: n[r],
						ip: n[r + 1],
						port: n[r + 2]
					});
					return i
				}, oK.parseImageAttributes = function(e) {
					return e.split(" ").map(function(e) {
						return e.substring(1, e.length - 1).split(",").reduce(a, {})
					})
				}, oK.parseSimulcastStreamList = function(t) {
					return t.split(";").map(function(t) {
						return t.split(",").map(function(t) {
							var i, n = !1;
							return "~" !== t[0] ? i = e(t) : (i = e(t.substring(1, t.length)), n = !0), {
								scid: i,
								paused: n
							}
						})
					})
				}, oK)
			}(),
			t = function() {
				if (eO) return e_;
				eO = 1;
				var e = oJ(),
					t = /%[sdv%]/g,
					i = function(e) {
						var i = 1,
							n = arguments,
							r = n.length;
						return e.replace(t, function(e) {
							if (i >= r) return e;
							var t = n[i];
							switch (i += 1, e) {
								case "%%":
									return "%";
								case "%s":
									return String(t);
								case "%d":
									return Number(t);
								case "%v":
									return ""
							}
						})
					},
					n = function(e, t, n) {
						var r = [e + "=" + (t.format instanceof Function ? t.format(t.push ? n : n[t.name]) : t.format)];
						if (t.names)
							for (var a = 0; a < t.names.length; a += 1) {
								var s = t.names[a];
								t.name ? r.push(n[t.name][s]) : r.push(n[t.names[a]])
							} else r.push(n[t.name]);
						return i.apply(null, r)
					},
					r = ["v", "o", "s", "i", "u", "e", "p", "c", "b", "t", "r", "z", "a"],
					a = ["i", "c", "b", "a"];
				return e_ = function(t, i) {
					i = i || {}, null == t.version && (t.version = 0), null == t.name && (t.name = " "), t.media.forEach(function(e) {
						null == e.payloads && (e.payloads = "")
					});
					var s = i.outerOrder || r,
						o = i.innerOrder || a,
						c = [];
					return s.forEach(function(i) {
						e[i].forEach(function(e) {
							e.name in t && null != t[e.name] ? c.push(n(i, e, t)) : e.push in t && null != t[e.push] && t[e.push].forEach(function(t) {
								c.push(n(i, e, t))
							})
						})
					}), t.media.forEach(function(t) {
						c.push(n("m", e.m[0], t)), o.forEach(function(i) {
							e[i].forEach(function(e) {
								e.name in t && null != t[e.name] ? c.push(n(i, e, t)) : e.push in t && null != t[e.push] && t[e.push].forEach(function(t) {
									c.push(n(i, e, t))
								})
							})
						})
					}), c.join("\r\n") + "\r\n"
				}
			}();
		return oW.grammar = oJ(), oW.write = t, oW.parse = e.parse, oW.parseParams = e.parseParams, oW.parseFmtpConfig = e.parseFmtpConfig, oW.parsePayloads = e.parsePayloads, oW.parseRemoteCandidates = e.parseRemoteCandidates, oW.parseImageAttributes = e.parseImageAttributes, oW.parseSimulcastStreamList = e.parseSimulcastStreamList, oW
	}();
	let oQ = "offerAnswered",
		oY = "rtpVideoPayloadTypes";
	class oX extends rV.EventEmitter {
		get pc() {
			return this._pc || (this._pc = this.createPC()), this._pc
		}
		constructor(e) {
			var t;
			let i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			super(), this.log = r_, this.iceLog = r_, this.ddExtID = 0, this.latestOfferId = 0, this.latestAcknowledgedOfferId = 0, this.pendingCandidates = [], this.restartingIce = !1, this.renegotiate = !1, this.trackBitrates = [], this.remoteStereoMids = [], this.remoteNackMids = [], this.negotiate = og(e => rF(this, void 0, void 0, function*() {
				this.emit("negotiationStarted");
				try {
					yield this.createAndSendOffer()
				} catch (t) {
					if (e) e(t);
					else throw t
				}
			}), 20), this.close = () => {
				this._pc && (this.log.debug("closing peer connection"), this.pendingInitialOffer = void 0, this._pc.close(), this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc.onicegatheringstatechange = null, this._pc.ondatachannel = null, this._pc.onnegotiationneeded = null, this._pc.onsignalingstatechange = null, this._pc.onicecandidate = null, this._pc.ondatachannel = null, this._pc.ontrack = null, this._pc.onconnectionstatechange = null, this._pc.oniceconnectionstatechange = null, this._pc = null)
			}, this.loggerOptions = i, this.log = rA(null != (t = i.loggerName) ? t : eo.PCTransport, () => this.logContext), this.iceLog = rA(eo.ICE, () => this.logContext), this.config = e, this._pc = this.createPC(), this.offerLock = new e0
		}
		createPC() {
			let e = new RTCPeerConnection(this.config);
			return e.onicecandidate = e => {
				var t;
				e.candidate && (this.iceLog.debug("local ICE candidate gathered", {
					candidate: e.candidate.candidate
				}), null == (t = this.onIceCandidate) || t.call(this, e.candidate))
			}, e.onicecandidateerror = e => {
				var t;
				this.iceLog.debug("ICE candidate error", {
					event: e
				}), null == (t = this.onIceCandidateError) || t.call(this, e)
			}, e.oniceconnectionstatechange = () => {
				var t;
				this.iceLog.debug("ICE connection state: ".concat(e.iceConnectionState)), null == (t = this.onIceConnectionStateChange) || t.call(this, e.iceConnectionState)
			}, e.onsignalingstatechange = () => {
				var t;
				this.log.debug("signaling state: ".concat(e.signalingState)), null == (t = this.onSignalingStatechange) || t.call(this, e.signalingState)
			}, e.onconnectionstatechange = () => {
				var t;
				this.log.debug("connection state: ".concat(e.connectionState)), null == (t = this.onConnectionStateChange) || t.call(this, e.connectionState)
			}, e.ondatachannel = e => {
				var t;
				this.log.debug("data channel opened by peer", {
					label: e.channel.label,
					id: e.channel.id
				}), null == (t = this.onDataChannel) || t.call(this, e)
			}, e.ontrack = e => {
				var t;
				null == (t = this.onTrack) || t.call(this, e)
			}, e
		}
		get logContext() {
			var e, t;
			return Object.assign({}, null == (t = (e = this.loggerOptions).loggerContextCb) ? void 0 : t.call(e))
		}
		get isICEConnected() {
			return null !== this._pc && ("connected" === this.pc.iceConnectionState || "completed" === this.pc.iceConnectionState)
		}
		addIceCandidate(e) {
			return rF(this, void 0, void 0, function*() {
				if (this.pc.remoteDescription && !this.restartingIce) return this.pc.addIceCandidate(e);
				this.iceLog.debug("queuing remote ICE candidate until remote description applied", {
					pendingCount: this.pendingCandidates.length + 1
				}), this.pendingCandidates.push(e)
			})
		}
		setRemoteDescription(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i, n, r, a;
				let s;
				if ("answer" === e.type && this.latestOfferId > 0 && t > 0 && t !== this.latestOfferId) return this.log.warn("ignoring answer for old offer", {
					offerId: t,
					latestOfferId: this.latestOfferId
				}), !1;
				if ("offer" === e.type) {
					let t, i, n, s, o = (r = e, t = [], i = [], n = oG.parse(null != (a = r.sdp) ? a : ""), s = 0, n.media.forEach(e => {
							var n;
							let r = o1(e.mid);
							"audio" === e.type && (e.rtp.some(e => "opus" === e.codec && (s = e.payload, !0)), (null == (n = e.rtcpFb) ? void 0 : n.some(e => e.payload === s && "nack" === e.type)) && i.push(r), e.fmtp.some(e => e.payload === s && (e.config.includes("sprop-stereo=1") && t.push(r), !0)))
						}), {
							stereoMids: t,
							nackMids: i
						}),
						c = o.stereoMids,
						l = o.nackMids;
					this.remoteStereoMids = c, this.remoteNackMids = l
				} else if ("answer" === e.type) {
					if (this.pendingInitialOffer && this._pc) {
						let e = this.pendingInitialOffer;
						this.pendingInitialOffer = void 0;
						let t = oG.parse(null != (i = e.sdp) ? i : "");
						t.media.forEach(e => {
							o0(e)
						}), this.log.debug("setting pending initial offer before processing answer"), yield this.setMungedSDP(e, oG.write(t))
					}
					let t = oG.parse(null != (n = e.sdp) ? n : "");
					t.media.forEach(e => {
						let t = o1(e.mid);
						"audio" === e.type && this.trackBitrates.some(i => {
							if (!i.transceiver || t != i.transceiver.mid) return !1;
							let n = 0;
							if (e.rtp.some(e => e.codec.toUpperCase() === i.codec.toUpperCase() && (n = e.payload, !0)), 0 === n) return !0;
							let r = !1;
							for (let t of e.fmtp)
								if (t.payload === n) {
									t.config = t.config.split(";").filter(e => !e.includes("maxaveragebitrate")).join(";"), i.maxbr > 0 && (t.config += ";maxaveragebitrate=".concat(1e3 * i.maxbr)), r = !0;
									break
								} return !r && i.maxbr > 0 && e.fmtp.push({
								payload: n,
								config: "maxaveragebitrate=".concat(1e3 * i.maxbr)
							}), !0
						})
					});
					let r = this.getPlaceholderMids();
					r.size > 0 && o$(t.media, e => r.has(o1(e.mid))), s = oG.write(t)
				}
				return yield this.setMungedSDP(e, s, !0), this.pendingCandidates.length > 0 && this.iceLog.debug("flushing queued ICE candidates", {
					count: this.pendingCandidates.length
				}), this.pendingCandidates.forEach(e => {
					this.pc.addIceCandidate(e)
				}), this.pendingCandidates = [], this.restartingIce = !1, "answer" === e.type && (this.latestAcknowledgedOfferId = t, this.emit(oQ, t)), this.renegotiate ? (this.renegotiate = !1, yield this.createAndSendOffer()) : "answer" === e.type && (this.emit("negotiationComplete"), e.sdp && oG.parse(e.sdp).media.forEach(e => {
					"video" === e.type && this.emit(oY, e.rtp)
				})), !0
			})
		}
		createInitialOffer() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.offerLock.lock();
				try {
					if ("stable" !== this.pc.signalingState) return void this.log.warn("signaling state is not stable, cannot create initial offer");
					let t = this.latestOfferId + 1;
					this.latestOfferId = t;
					let i = yield this.pc.createOffer();
					this.pendingInitialOffer = {
						sdp: i.sdp,
						type: i.type
					};
					let n = oG.parse(null != (e = i.sdp) ? e : "");
					return n.media.forEach(e => {
						o0(e)
					}), i.sdp = oG.write(n), {
						offer: i,
						offerId: t
					}
				} finally {
					t()
				}
			})
		}
		createAndSendOffer(e) {
			return rF(this, void 0, void 0, function*() {
				var t;
				let i = yield this.offerLock.lock();
				try {
					if (void 0 === this.onOffer) return;
					if ((null == e ? void 0 : e.iceRestart) && (this.iceLog.debug("restarting ICE"), this.restartingIce = !0), this._pc && ("have-local-offer" === this._pc.signalingState || this.pendingInitialOffer)) {
						let t = this._pc.remoteDescription;
						if ((null == e ? void 0 : e.iceRestart) && t) yield this._pc.setRemoteDescription(t);
						else {
							this.renegotiate = !0, this.log.debug("requesting renegotiation");
							return
						}
					} else if (!this._pc || "closed" === this._pc.signalingState) return void this.log.warn("could not createOffer with closed peer connection");
					this.log.debug("starting to negotiate");
					let i = this.latestOfferId + 1;
					this.latestOfferId = i;
					let n = yield this.pc.createOffer(e);
					this.log.debug("original offer", {
						sdp: n.sdp
					});
					let r = oG.parse(null != (t = n.sdp) ? t : "");
					r.media.forEach(e => {
						o0(e), "audio" === e.type ? oZ(e, ["all"], []) : "video" === e.type && this.trackBitrates.some(t => {
							if (!e.msid || !t.cid || !e.msid.includes(t.cid)) return !1;
							let i = 0;
							if (e.rtp.some(e => e.codec.toUpperCase() === t.codec.toUpperCase() && (i = e.payload, !0)), 0 === i) return !0;
							sS(t.codec) && !sP() && this.ensureVideoDDExtensionForSVC(e, r);
							let n = Math.round(.9 * t.maxbr),
								a = t.isScreenShare ? n : Math.min(n, 1e3),
								s = !1;
							for (let t of e.fmtp)
								if (t.payload === i) {
									s = !0, t.config.includes("x-google-start-bitrate") || (t.config += ";x-google-start-bitrate=".concat(a));
									break
								} return s || e.fmtp.push({
								payload: i,
								config: "x-google-start-bitrate=".concat(a)
							}), !0
						})
					});
					let a = this.getPlaceholderMids();
					if (a.size > 0 && o$(r.media, e => a.has(o1(e.mid))), this.latestOfferId > i) return void this.log.warn("latestOfferId mismatch", {
						latestOfferId: this.latestOfferId,
						offerId: i
					});
					yield this.setMungedSDP(n, oG.write(r)), this.onOffer(n, this.latestOfferId)
				} finally {
					i()
				}
			})
		}
		createAndSetAnswer() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.pc.createAnswer(), i = oG.parse(null != (e = t.sdp) ? e : "");
				return i.media.forEach(e => {
					o0(e), "audio" === e.type && oZ(e, this.remoteStereoMids, this.remoteNackMids)
				}), yield this.setMungedSDP(t, oG.write(i)), t
			})
		}
		getPlaceholderMids() {
			var e, t, i = null != (t = null == (e = this._pc) ? void 0 : e.getTransceivers()) ? t : [];
			let n = new Set;
			for (let e of i) e.mid && !e.sender.track && n.add(e.mid);
			return n
		}
		createDataChannel(e, t) {
			return this.pc.createDataChannel(e, t)
		}
		addTransceiver(e, t) {
			return this.pc.addTransceiver(e, t)
		}
		addTransceiverOfKind(e, t) {
			return this.pc.addTransceiver(e, t)
		}
		addTrack(e) {
			if (!this._pc) throw new aQ("PC closed, cannot add track");
			return this._pc.addTrack(e)
		}
		setTrackCodecBitrate(e) {
			this.trackBitrates.push(e)
		}
		setConfiguration(e) {
			var t;
			if (!this._pc) throw new aQ("PC closed, cannot configure");
			return null == (t = this._pc) ? void 0 : t.setConfiguration(e)
		}
		canRemoveTrack() {
			var e;
			return !!(null == (e = this._pc) ? void 0 : e.removeTrack)
		}
		removeTrack(e) {
			var t;
			return null == (t = this._pc) ? void 0 : t.removeTrack(e)
		}
		getConnectionState() {
			var e, t;
			return null != (t = null == (e = this._pc) ? void 0 : e.connectionState) ? t : "closed"
		}
		getICEConnectionState() {
			var e, t;
			return null != (t = null == (e = this._pc) ? void 0 : e.iceConnectionState) ? t : "closed"
		}
		getSignallingState() {
			var e, t;
			return null != (t = null == (e = this._pc) ? void 0 : e.signalingState) ? t : "closed"
		}
		getTransceivers() {
			var e, t;
			return null != (t = null == (e = this._pc) ? void 0 : e.getTransceivers()) ? t : []
		}
		getSenders() {
			var e, t;
			return null != (t = null == (e = this._pc) ? void 0 : e.getSenders()) ? t : []
		}
		getLocalDescription() {
			var e;
			return null == (e = this._pc) ? void 0 : e.localDescription
		}
		getRemoteDescription() {
			var e;
			return null == (e = this.pc) ? void 0 : e.remoteDescription
		}
		getStats() {
			return this.pc.getStats()
		}
		getMaxMessageSize() {
			var e, t;
			return null == (t = null == (e = this._pc) ? void 0 : e.sctp) ? void 0 : t.maxMessageSize
		}
		getConnectedAddress() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (!this._pc) return;
				let t = "",
					i = new Map,
					n = new Map;
				if ((yield this._pc.getStats()).forEach(e => {
						switch (e.type) {
							case "transport":
								t = e.selectedCandidatePairId;
								break;
							case "candidate-pair":
								"" === t && e.selected && (t = e.id), i.set(e.id, e);
								break;
							case "remote-candidate":
								n.set(e.id, "".concat(e.address, ":").concat(e.port))
						}
					}), "" === t) return;
				let r = null == (e = i.get(t)) ? void 0 : e.remoteCandidateId;
				if (void 0 !== r) return n.get(r)
			})
		}
		setMungedSDP(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				var n, r;
				let a = e.sdp;
				if (t) {
					e.sdp = t;
					try {
						this.log.debug("setting munged ".concat(i ? "remote" : "local", " description")), i ? yield this.pc.setRemoteDescription(e): yield this.pc.setLocalDescription(e);
						return
					} catch (i) {
						this.log.warn("not able to set ".concat(e.type, ", falling back to unmodified sdp"), {
							error: i,
							mungedSdp: t,
							originalSdp: a
						}), e.sdp = a
					}
				}
				try {
					i ? yield null == (n = this._pc) ? void 0 : n.setRemoteDescription(e): yield null == (r = this._pc) ? void 0 : r.setLocalDescription(e)
				} catch (s) {
					let n = "unknown error";
					s instanceof Error ? n = s.message : "string" == typeof s && (n = s);
					let r = {
						error: n,
						sdp: e.sdp
					};
					throw t && t !== a && (r.mungedSdp = t), !i && this.pc.remoteDescription && (r.remoteSdp = this.pc.remoteDescription), this.log.error("unable to set ".concat(e.type), {
						fields: r
					}), new aY(n)
				}
			})
		}
		ensureVideoDDExtensionForSVC(e, t) {
			var i, n;
			if (!(null == (i = e.ext) ? void 0 : i.some(e => e.uri === sf))) {
				if (0 === this.ddExtID) {
					let e = 0;
					t.media.forEach(t => {
						var i;
						null == (i = t.ext) || i.forEach(t => {
							t.value > e && (e = t.value)
						})
					}), this.ddExtID = e + 1
				}
				null == (n = e.ext) || n.push({
					value: this.ddExtID,
					uri: sf
				})
			}
		}
	}

	function oZ(e, t, i) {
		let n = o1(e.mid),
			r = 0;
		e.rtp.some(e => "opus" === e.codec && (r = e.payload, !0)), r > 0 && (e.rtcpFb || (e.rtcpFb = []), i.includes(n) && !e.rtcpFb.some(e => e.payload === r && "nack" === e.type) && e.rtcpFb.push({
			payload: r,
			type: "nack"
		}), (t.includes(n) || 1 === t.length && "all" === t[0]) && e.fmtp.some(e => e.payload === r && (e.config.includes("stereo=1") || (e.config += ";stereo=1"), !0)))
	}

	function o$(e, t) {
		var i, n;
		let r = new Map,
			a = new Set;
		for (let n of e) {
			let e = t(n);
			for (let t of null != (i = n.fmtp) ? i : []) e ? r.has(t.payload) || r.set(t.payload, t.config) : (r.set(t.payload, t.config), a.add(t.payload))
		}
		if (0 !== r.size) {
			for (let i of e)
				if (t(i))
					for (let e of null != (n = i.fmtp) ? n : []) {
						let t = r.get(e.payload);
						void 0 !== t && e.config !== t && (e.config = t)
					}
		}
	}

	function o0(e) {
		if (e.connection) {
			let t = e.connection.ip.indexOf(":") >= 0;
			(4 === e.connection.version && t || 6 === e.connection.version && !t) && (e.connection.ip = "0.0.0.0", e.connection.version = 4)
		}
	}

	function o1(e) {
		return "number" == typeof e ? e.toFixed(0) : e
	}
	let o2 = {
			audioPreset: ey.music,
			dtx: !0,
			red: !0,
			forceStereo: !1,
			simulcast: !0,
			screenShareEncoding: se.h1080fps15.encoding,
			stopMicTrackOnMute: !1,
			videoCodec: "vp8",
			backupCodec: !0,
			preConnectBuffer: !1
		},
		o3 = {
			deviceId: {
				ideal: "default"
			},
			autoGainControl: !0,
			echoCancellation: !0,
			noiseSuppression: !0,
			voiceIsolation: !0
		},
		o4 = {
			deviceId: {
				ideal: "default"
			},
			resolution: a5.h720.resolution
		},
		o9 = {
			adaptiveStream: !1,
			dynacast: !1,
			stopLocalTrackOnUnpublish: !0,
			reconnectPolicy: new rN,
			disconnectOnPageLeave: !0,
			webAudioMix: !1,
			singlePeerConnection: !0
		},
		o6 = {
			autoSubscribe: !0,
			maxRetries: 1,
			peerConnectionTimeout: 15e3,
			websocketTimeout: 15e3
		};
	(N = ex || (ex = {}))[N.NEW = 0] = "NEW", N[N.CONNECTING = 1] = "CONNECTING", N[N.CONNECTED = 2] = "CONNECTED", N[N.FAILED = 3] = "FAILED", N[N.CLOSING = 4] = "CLOSING", N[N.CLOSED = 5] = "CLOSED";
	class o8 {
		get needsPublisher() {
			return this.isPublisherConnectionRequired
		}
		get needsSubscriber() {
			return this.isSubscriberConnectionRequired
		}
		get currentState() {
			return this.state
		}
		get mode() {
			return this._mode
		}
		constructor(e, t, i) {
			var n;
			this.peerConnectionTimeout = o6.peerConnectionTimeout, this.log = r_, this.iceLog = r_, this.updateState = () => {
				var e, t;
				let i = this.state,
					n = this.requiredTransports.map(e => e.getConnectionState());
				n.every(e => "connected" === e) ? this.state = ex.CONNECTED : n.some(e => "failed" === e) ? this.state = ex.FAILED : n.some(e => "connecting" === e) ? this.state = ex.CONNECTING : n.every(e => "closed" === e) ? this.state = ex.CLOSED : n.some(e => "closed" === e) ? this.state = ex.CLOSING : n.every(e => "new" === e) && (this.state = ex.NEW), i !== this.state && (this.log.debug("pc state change: from ".concat(ex[i], " to ").concat(ex[this.state])), null == (e = this.onStateChange) || e.call(this, this.state, this.publisher.getConnectionState(), null == (t = this.subscriber) ? void 0 : t.getConnectionState()))
			}, this.loggerOptions = t, this.log = rA(null != (n = t.loggerName) ? n : eo.PCManager, () => this.logContext), this.iceLog = rA(eo.ICE, () => this.logContext), this.isPublisherConnectionRequired = "subscriber-primary" !== e, this.isSubscriberConnectionRequired = "subscriber-primary" === e, this.publisher = new oX(i, t), this._mode = e, "publisher-only" !== e && (this.subscriber = new oX(i, t), this.subscriber.onConnectionStateChange = this.updateState, this.subscriber.onIceConnectionStateChange = this.updateState, this.subscriber.onSignalingStatechange = this.updateState, this.subscriber.onIceCandidate = e => {
				var t;
				null == (t = this.onIceCandidate) || t.call(this, e, nP.SUBSCRIBER)
			}, this.subscriber.onDataChannel = e => {
				var t;
				null == (t = this.onDataChannel) || t.call(this, e)
			}, this.subscriber.onTrack = e => {
				var t;
				null == (t = this.onTrack) || t.call(this, e)
			}), this.publisher.onConnectionStateChange = this.updateState, this.publisher.onIceConnectionStateChange = this.updateState, this.publisher.onSignalingStatechange = this.updateState, this.publisher.onIceCandidate = e => {
				var t;
				null == (t = this.onIceCandidate) || t.call(this, e, nP.PUBLISHER)
			}, this.publisher.onTrack = e => {
				var t;
				null == (t = this.onTrack) || t.call(this, e)
			}, this.publisher.onOffer = (e, t) => {
				var i;
				null == (i = this.onPublisherOffer) || i.call(this, e, t)
			}, this.state = ex.NEW, this.connectionLock = new e0, this.remoteOfferLock = new e0
		}
		get logContext() {
			var e, t;
			return Object.assign({}, null == (t = (e = this.loggerOptions).loggerContextCb) ? void 0 : t.call(e))
		}
		requirePublisher() {
			let e = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
			this.isPublisherConnectionRequired = e, this.updateState()
		}
		createAndSendPublisherOffer(e) {
			return this.publisher.createAndSendOffer(e)
		}
		setPublisherAnswer(e, t) {
			return this.publisher.setRemoteDescription(e, t)
		}
		removeTrack(e) {
			return this.publisher.removeTrack(e)
		}
		close() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (this.publisher && "closed" !== this.publisher.getSignallingState()) {
					let e = this.publisher;
					for (let t of e.getSenders()) try {
						e.canRemoveTrack() && e.removeTrack(t)
					} catch (e) {
						this.log.warn("could not removeTrack", {
							error: e
						})
					}
				}
				yield Promise.all([this.publisher.close(), null == (e = this.subscriber) ? void 0 : e.close()]), this.updateState()
			})
		}
		triggerIceRestart() {
			return rF(this, void 0, void 0, function*() {
				this.iceLog.warn("triggering ICE restart"), this.subscriber && (this.subscriber.restartingIce = !0), this.needsPublisher && (yield this.createAndSendPublisherOffer({
					iceRestart: !0
				}))
			})
		}
		addIceCandidate(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i;
				this.iceLog.debug("adding remote ICE candidate", {
					target: t,
					candidate: e
				}), t === nP.PUBLISHER ? yield this.publisher.addIceCandidate(e): yield null == (i = this.subscriber) ? void 0 : i.addIceCandidate(e)
			})
		}
		createSubscriberAnswerFromOffer(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i, n, r;
				this.log.debug("received server offer", {
					RTCSdpType: e.type,
					sdp: e.sdp,
					signalingState: null == (i = this.subscriber) ? void 0 : i.getSignallingState().toString()
				});
				let a = yield this.remoteOfferLock.lock();
				try {
					if (!(yield null == (n = this.subscriber) ? void 0 : n.setRemoteDescription(e, t))) return;
					return yield null == (r = this.subscriber) ? void 0 : r.createAndSetAnswer()
				} finally {
					a()
				}
			})
		}
		updateConfiguration(e, t) {
			var i;
			this.log.debug("updating rtc configuration", {
				iceRestart: t
			}), this.publisher.setConfiguration(e), null == (i = this.subscriber) || i.setConfiguration(e), t && this.triggerIceRestart()
		}
		ensurePCTransportConnection(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i;
				let n = yield this.connectionLock.lock();
				try {
					this.isPublisherConnectionRequired && "connected" !== this.publisher.getConnectionState() && "connecting" !== this.publisher.getConnectionState() && (this.log.debug("negotiation required, start negotiating"), this.publisher.negotiate()), yield Promise.all(null == (i = this.requiredTransports) ? void 0 : i.map(i => this.ensureTransportConnected(i, e, t)))
				} finally {
					n()
				}
			})
		}
		negotiate(e) {
			return rF(this, void 0, void 0, function*() {
				return new aN((t, i) => {
					let n = this.publisher.latestOfferId;
					if (this.publisher.latestAcknowledgedOfferId > n) {
						this.log.debug("negotiation already handled in more recent acknowledged offer", this.logContext), t();
						return
					}
					let r = !1,
						a = () => {
							r || (r = !0, clearTimeout(c), this.publisher.off(oQ, s), e.signal.removeEventListener("abort", o))
						},
						s = e => {
							e > n && (a(), t())
						},
						o = () => {
							a(), i(new aY("negotiation aborted"))
						},
						c = setTimeout(() => {
							a(), i(new aY("negotiation timed out"))
						}, this.peerConnectionTimeout);
					e.signal.addEventListener("abort", o), this.publisher.on(oQ, s), this.publisher.negotiate(e => {
						a(), e instanceof Error ? i(e) : i(Error(String(e)))
					})
				})
			})
		}
		addPublisherTransceiver(e, t) {
			return this.publisher.addTransceiver(e, t)
		}
		addPublisherTransceiverOfKind(e, t) {
			return this.publisher.addTransceiverOfKind(e, t)
		}
		getMidForReceiver(e) {
			let t = (this.subscriber ? this.subscriber.getTransceivers() : this.publisher.getTransceivers()).find(t => t.receiver === e);
			return null == t ? void 0 : t.mid
		}
		getMaxPublisherMessageSize() {
			return this.publisher.getMaxMessageSize()
		}
		addPublisherTrack(e) {
			return this.publisher.addTrack(e)
		}
		createPublisherDataChannel(e, t) {
			return this.publisher.createDataChannel(e, t)
		}
		getConnectedAddress(e) {
			return e === nP.PUBLISHER || e === nP.SUBSCRIBER ? this.publisher.getConnectedAddress() : this.requiredTransports[0].getConnectedAddress()
		}
		get requiredTransports() {
			let e = [];
			return this.isPublisherConnectionRequired && e.push(this.publisher), this.isSubscriberConnectionRequired && this.subscriber && e.push(this.subscriber), e
		}
		ensureTransportConnected(e, t) {
			return rF(this, arguments, void 0, function(e, t) {
				var i = this;
				let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this.peerConnectionTimeout;
				return function*() {
					if ("connected" !== e.getConnectionState()) return new Promise((e, r) => rF(i, void 0, void 0, function*() {
						let i = () => {
							this.log.warn("abort transport connection"), a2.clearTimeout(a), r(aK.cancelled("room connection has been cancelled"))
						};
						(null == t ? void 0 : t.signal.aborted) && i(), null == t || t.signal.addEventListener("abort", i);
						let a = a2.setTimeout(() => {
							null == t || t.signal.removeEventListener("abort", i), r(aK.internal("could not establish pc connection"))
						}, n);
						for (; this.state !== ex.CONNECTED;)
							if (yield sv(50), null == t ? void 0 : t.signal.aborted) return void r(aK.cancelled("room connection has been cancelled"));
						a2.clearTimeout(a), null == t || t.signal.removeEventListener("abort", i), e()
					}))
				}()
			})
		}
	}
	let o5 = "u" > typeof MediaRecorder,
		o7 = o5 ? MediaRecorder : class {
			constructor() {
				throw Error("MediaRecorder is not available in this environment")
			}
		};
	class ce extends o7 {
		constructor(e, t) {
			let i, n;
			if (!o5) throw Error("MediaRecorder is not available in this environment");
			super(new MediaStream([e.mediaStreamTrack]), t);
			let r = () => {
					this.removeEventListener("dataavailable", i), this.removeEventListener("stop", r), this.removeEventListener("error", a), null == n || n.close(), n = void 0
				},
				a = e => {
					null == n || n.error(e), this.removeEventListener("dataavailable", i), this.removeEventListener("stop", r), this.removeEventListener("error", a), n = void 0
				};
			this.byteStream = new ReadableStream({
				start: e => {
					n = e, i = t => rF(this, void 0, void 0, function*() {
						let i;
						if (t.data.arrayBuffer) i = new Uint8Array((yield t.data.arrayBuffer()));
						else if (t.data.byteArray) i = t.data.byteArray;
						else throw Error("no data available!");
						void 0 !== n && e.enqueue(i)
					}), this.addEventListener("dataavailable", i)
				},
				cancel: () => {
					r()
				}
			}), this.addEventListener("stop", r), this.addEventListener("error", a)
		}
	}
	class ct extends sp {
		get sender() {
			return this._sender
		}
		set sender(e) {
			this._sender = e
		}
		get constraints() {
			return this._constraints
		}
		get hasPreConnectBuffer() {
			return !!this.localTrackRecorder
		}
		constructor(e, t, i) {
			let n = arguments.length > 3 && void 0 !== arguments[3] && arguments[3],
				r = arguments.length > 4 ? arguments[4] : void 0;
			super(e, t, r), this.manuallyStopped = !1, this.pendingDeviceChange = !1, this._isUpstreamPaused = !1, this.handleTrackMuteEvent = () => this.debouncedTrackMuteHandler().catch(() => this.log.debug("track mute bounce got cancelled by an unmute event", this.logContext)), this.debouncedTrackMuteHandler = og(() => rF(this, void 0, void 0, function*() {
				yield this.pauseUpstream()
			}), 5e3), this.handleTrackUnmuteEvent = () => rF(this, void 0, void 0, function*() {
				this.debouncedTrackMuteHandler.cancel("unmute"), yield this.resumeUpstream()
			}), this.handleEnded = () => {
				this.isInBackground && (this.reacquireTrack = !0), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), this.emit(ev.Ended, this)
			}, this.reacquireTrack = !1, this.providedByUser = n, this.muteLock = new e0, this.pauseUpstreamLock = new e0, this.trackChangeLock = new e0, this.trackChangeLock.lock().then(t => rF(this, void 0, void 0, function*() {
				try {
					yield this.setMediaStreamTrack(e, !0)
				} finally {
					t()
				}
			})), this._constraints = e.getConstraints(), i && (this._constraints = i)
		}
		get id() {
			return this._mediaStreamTrack.id
		}
		get dimensions() {
			if (this.kind !== sp.Kind.Video) return;
			let e = this._mediaStreamTrack.getSettings(),
				t = e.width,
				i = e.height;
			if (t && i) return {
				width: t,
				height: i
			}
		}
		get isUpstreamPaused() {
			return this._isUpstreamPaused
		}
		get isUserProvided() {
			return this.providedByUser
		}
		get mediaStreamTrack() {
			var e, t;
			return null != (t = null == (e = this.processor) ? void 0 : e.processedTrack) ? t : this._mediaStreamTrack
		}
		get isLocal() {
			return !0
		}
		getSourceTrackSettings() {
			return this._mediaStreamTrack.getSettings()
		}
		setMediaStreamTrack(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				var n;
				let r;
				if (e !== this._mediaStreamTrack || t) {
					if (this._mediaStreamTrack && (this.attachedElements.forEach(e => {
							sg(this._mediaStreamTrack, e)
						}), this.debouncedTrackMuteHandler.cancel("new-track"), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent)), this.mediaStream = new MediaStream([e]), e && (e.addEventListener("ended", this.handleEnded), e.addEventListener("mute", this.handleTrackMuteEvent), e.addEventListener("unmute", this.handleTrackUnmuteEvent), this._constraints = e.getConstraints()), this.processor && e) {
						if (this.log.debug("restarting processor", this.logContext), "unknown" === this.kind) throw TypeError("cannot set processor on track of unknown kind");
						this.processorElement && (sm(e, this.processorElement), this.processorElement.muted = !0), yield this.processor.restart({
							track: e,
							kind: this.kind,
							element: this.processorElement,
							localTrack: this
						}), r = this.processor.processedTrack
					}
					this.sender && (null == (n = this.sender.transport) ? void 0 : n.state) !== "closed" && (yield this.sender.replaceTrack(null != r ? r : e)), this.providedByUser || this._mediaStreamTrack === e || this._mediaStreamTrack.stop(), this._mediaStreamTrack = e, e && (this._mediaStreamTrack.enabled = !!i || !this.isMuted, yield this.resumeUpstream(), this.attachedElements.forEach(t => {
						sm(null != r ? r : e, t)
					}))
				}
			})
		}
		waitForDimensions() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1e3;
				return function*() {
					var i;
					if (e.kind === sp.Kind.Audio) throw Error("cannot get dimensions for audio tracks");
					(null == (i = aF()) ? void 0 : i.os) === "iOS" && (yield sv(10));
					let n = Date.now();
					for (; Date.now() - n < t;) {
						let t = e.dimensions;
						if (t) return t;
						yield sv(50)
					}
					throw new aJ("unable to get track dimensions after timeout")
				}()
			})
		}
		setDeviceId(e) {
			return rF(this, void 0, void 0, function*() {
				return this._constraints.deviceId === e && this._mediaStreamTrack.getSettings().deviceId === sQ(e) || ((this._constraints.deviceId = e, this.isMuted) ? (this.pendingDeviceChange = !0, !0) : (yield this.restartTrack(), sQ(e) === this._mediaStreamTrack.getSettings().deviceId))
			})
		}
		getDeviceId() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
				return function*() {
					if (e.source === sp.Source.ScreenShare) return;
					let i = e._mediaStreamTrack.getSettings(),
						n = i.deviceId,
						r = i.groupId,
						a = e.kind === sp.Kind.Audio ? "audioinput" : "videoinput";
					return t ? oP.getInstance().normalizeDeviceId(a, n, r) : n
				}()
			})
		}
		mute() {
			return rF(this, void 0, void 0, function*() {
				return this.setTrackMuted(!0), this
			})
		}
		unmute() {
			return rF(this, void 0, void 0, function*() {
				return this.setTrackMuted(!1), this
			})
		}
		replaceTrack(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = yield this.trackChangeLock.lock();
				try {
					let i, n;
					if (!this.sender) throw new aJ("unable to replace an unpublished track");
					"boolean" == typeof t ? i = t : void 0 !== t && (i = t.userProvidedTrack, n = t.stopProcessor), this.providedByUser = null == i || i, this.log.debug("replace MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(e), n && this.processor && (yield this.internalStopProcessor())
				} finally {
					i()
				}
				return yield this.onSenderTrackSwapped(), this
			})
		}
		onSenderTrackSwapped() {
			return rF(this, void 0, void 0, function*() {})
		}
		restart(e, t) {
			return rF(this, void 0, void 0, function*() {
				this.manuallyStopped = !1;
				let i = yield this.trackChangeLock.lock();
				try {
					e || (e = this._constraints);
					let i = e,
						n = i.deviceId,
						r = i.facingMode,
						a = rU(e, ["deviceId", "facingMode"]);
					this.log.debug("restarting track with constraints", Object.assign(Object.assign({}, this.logContext), {
						constraints: e
					}));
					let s = {
						audio: !1,
						video: !1
					};
					this.kind === sp.Kind.Video ? s.video = !n && !r || {
						deviceId: n,
						facingMode: r
					} : s.audio = !n || Object.assign({
						deviceId: n
					}, a), this.attachedElements.forEach(e => {
						sg(this.mediaStreamTrack, e)
					}), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.stop();
					let o = (yield navigator.mediaDevices.getUserMedia(s)).getTracks()[0];
					return this.kind === sp.Kind.Video && (yield o.applyConstraints(a)), o.addEventListener("ended", this.handleEnded), this.log.debug("re-acquired MediaStreamTrack", this.logContext), yield this.setMediaStreamTrack(o, !1, t), this._constraints = e, this.pendingDeviceChange = !1, this.emit(ev.Restarted, this), this.manuallyStopped && (this.log.warn("track was stopped during a restart, stopping restarted track", this.logContext), this.stop()), this
				} finally {
					i()
				}
			})
		}
		setTrackMuted(e) {
			this.log.debug("setting ".concat(this.kind, " track ").concat(e ? "muted" : "unmuted"), this.logContext), (this.isMuted !== e || this._mediaStreamTrack.enabled === e) && (this.isMuted = e, this._mediaStreamTrack.enabled = !e, this.emit(e ? ev.Muted : ev.Unmuted, this))
		}
		get needsReAcquisition() {
			return "live" !== this._mediaStreamTrack.readyState || this._mediaStreamTrack.muted || !this._mediaStreamTrack.enabled || this.reacquireTrack
		}
		handleAppVisibilityChanged() {
			let e = Object.create(null, {
				handleAppVisibilityChanged: {
					get: () => super.handleAppVisibilityChanged
				}
			});
			return rF(this, void 0, void 0, function*() {
				yield e.handleAppVisibilityChanged.call(this), sM() && (this.log.debug("visibility changed, is in Background: ".concat(this.isInBackground), this.logContext), this.isInBackground || !this.needsReAcquisition || this.isUserProvided || this.isMuted || (this.log.debug("track needs to be reacquired, restarting ".concat(this.source), this.logContext), yield this.restart(), this.reacquireTrack = !1))
			})
		}
		stop() {
			var e;
			this.manuallyStopped = !0, super.stop(), this._mediaStreamTrack.removeEventListener("ended", this.handleEnded), this._mediaStreamTrack.removeEventListener("mute", this.handleTrackMuteEvent), this._mediaStreamTrack.removeEventListener("unmute", this.handleTrackUnmuteEvent), null == (e = this.processor) || e.destroy(), this.processor = void 0
		}
		pauseUpstream() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.pauseUpstreamLock.lock();
				try {
					if (!0 === this._isUpstreamPaused) return;
					if (!this.sender) return void this.log.warn("unable to pause upstream for an unpublished track", this.logContext);
					this._isUpstreamPaused = !0, this.emit(ev.UpstreamPaused, this);
					let t = aF();
					if ((null == t ? void 0 : t.name) === "Safari" && 0 > sF(t.version, "12.0")) throw new az("pauseUpstream is not supported on Safari < 12.");
					(null == (e = this.sender.transport) ? void 0 : e.state) !== "closed" && (yield this.sender.replaceTrack(null))
				} finally {
					t()
				}
			})
		}
		resumeUpstream() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.pauseUpstreamLock.lock();
				try {
					if (!1 === this._isUpstreamPaused) return;
					if (!this.sender) return void this.log.warn("unable to resume upstream for an unpublished track", this.logContext);
					this._isUpstreamPaused = !1, this.emit(ev.UpstreamResumed, this), (null == (e = this.sender.transport) ? void 0 : e.state) !== "closed" && (yield this.sender.replaceTrack(this.mediaStreamTrack))
				} finally {
					t()
				}
			})
		}
		getRTCStatsReport() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (null == (e = this.sender) ? void 0 : e.getStats) return yield this.sender.getStats()
			})
		}
		setProcessor(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
				return function*() {
					var n;
					let r = yield t.trackChangeLock.lock();
					try {
						t.log.debug("setting up processor", t.logContext);
						let r = document.createElement(t.kind),
							a = {
								kind: t.kind,
								track: t._mediaStreamTrack,
								element: r,
								audioContext: t.audioContext,
								localTrack: t
							};
						if (yield e.init(a), t.log.debug("processor initialized", t.logContext), t.processor && (yield t.internalStopProcessor()), "unknown" === t.kind) throw TypeError("cannot set processor on track of unknown kind");
						if (sm(t._mediaStreamTrack, r), r.muted = !0, r.play().catch(e => {
								e instanceof DOMException && "AbortError" === e.name ? (t.log.warn("failed to play processor element, retrying", Object.assign(Object.assign({}, t.logContext), {
									error: e
								})), setTimeout(() => {
									r.play().catch(e => {
										t.log.error("failed to play processor element", Object.assign(Object.assign({}, t.logContext), {
											err: e
										}))
									})
								}, 100)) : t.log.error("failed to play processor element", Object.assign(Object.assign({}, t.logContext), {
									error: e
								}))
							}), t.processor = e, t.processorElement = r, t.processor.processedTrack) {
							for (let e of t.attachedElements) e !== t.processorElement && i && (sg(t._mediaStreamTrack, e), sm(t.processor.processedTrack, e));
							yield null == (n = t.sender) ? void 0 : n.replaceTrack(t.processor.processedTrack)
						}
						t.emit(ev.TrackProcessorUpdate, t.processor)
					} finally {
						r()
					}
					yield t.onSenderTrackSwapped()
				}()
			})
		}
		getProcessor() {
			return this.processor
		}
		stopProcessor() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
				return function*() {
					let i = yield e.trackChangeLock.lock();
					try {
						yield e.internalStopProcessor(t)
					} finally {
						i()
					}
					yield e.onSenderTrackSwapped()
				}()
			})
		}
		internalStopProcessor() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
				return function*() {
					var i, n;
					e.processor && (e.log.debug("stopping processor", e.logContext), null == (i = e.processor.processedTrack) || i.stop(), yield e.processor.destroy(), e.processor = void 0, t || (null == (n = e.processorElement) || n.remove(), e.processorElement = void 0), yield e._mediaStreamTrack.applyConstraints(e._constraints), yield e.setMediaStreamTrack(e._mediaStreamTrack, !0), e.emit(ev.TrackProcessorUpdate))
				}()
			})
		}
		startPreConnectBuffer() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 100;
			if (!o5) return void this.log.warn("MediaRecorder is not available, cannot start preconnect buffer", this.logContext);
			if (this.localTrackRecorder) return void this.log.warn("preconnect buffer already started");
			{
				let e = "audio/webm;codecs=opus";
				MediaRecorder.isTypeSupported(e) || (e = "video/mp4"), this.localTrackRecorder = new ce(this, {
					mimeType: e
				})
			}
			this.localTrackRecorder.start(e), this.autoStopPreConnectBuffer = setTimeout(() => {
				this.log.warn("preconnect buffer timed out, stopping recording automatically", this.logContext), this.stopPreConnectBuffer()
			}, 1e4)
		}
		stopPreConnectBuffer() {
			clearTimeout(this.autoStopPreConnectBuffer), this.localTrackRecorder && (this.localTrackRecorder.stop(), this.localTrackRecorder = void 0)
		}
		getPreConnectBuffer() {
			var e;
			return null == (e = this.localTrackRecorder) ? void 0 : e.byteStream
		}
		getPreConnectBufferMimeType() {
			var e;
			return null == (e = this.localTrackRecorder) ? void 0 : e.mimeType
		}
	}
	class ci extends ct {
		get enhancedNoiseCancellation() {
			return this.isKrispNoiseFilterEnabled
		}
		constructor(e, t) {
			let i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
				n = arguments.length > 3 ? arguments[3] : void 0,
				r = arguments.length > 4 ? arguments[4] : void 0;
			super(e, sp.Kind.Audio, t, i, r), this.stopOnMute = !1, this.isKrispNoiseFilterEnabled = !1, this.monitorSender = () => rF(this, void 0, void 0, function*() {
				let e;
				if (!this.sender) {
					this._currentBitrate = 0;
					return
				}
				try {
					e = yield this.getSenderStats()
				} catch (e) {
					this.log.error("could not get audio sender stats", Object.assign(Object.assign({}, this.logContext), {
						error: e
					}));
					return
				}
				e && this.prevStats && (this._currentBitrate = of(e, this.prevStats)), this.prevStats = e
			}), this.handleKrispNoiseFilterEnable = () => {
				this.isKrispNoiseFilterEnabled = !0, this.log.debug("Krisp noise filter enabled", this.logContext), this.emit(ev.AudioTrackFeatureUpdate, this, iv.TF_ENHANCED_NOISE_CANCELLATION, !0)
			}, this.handleKrispNoiseFilterDisable = () => {
				this.isKrispNoiseFilterEnabled = !1, this.log.debug("Krisp noise filter disabled", this.logContext), this.emit(ev.AudioTrackFeatureUpdate, this, iv.TF_ENHANCED_NOISE_CANCELLATION, !1)
			}, this.audioContext = n, this.checkForSilence()
		}
		mute() {
			let e = Object.create(null, {
				mute: {
					get: () => super.mute
				}
			});
			return rF(this, void 0, void 0, function*() {
				let t = yield this.muteLock.lock();
				try {
					if (this.isMuted) return this.log.debug("Track already muted", this.logContext), this;
					return this.source === sp.Source.Microphone && this.stopOnMute && !this.isUserProvided && (this.log.debug("stopping mic track", this.logContext), this._mediaStreamTrack.stop()), yield e.mute.call(this), this
				} finally {
					t()
				}
			})
		}
		unmute() {
			let e = Object.create(null, {
				unmute: {
					get: () => super.unmute
				}
			});
			return rF(this, void 0, void 0, function*() {
				let t = yield this.muteLock.lock();
				try {
					if (!this.isMuted) return this.log.debug("Track already unmuted", this.logContext), this;
					return this.source === sp.Source.Microphone && (this.stopOnMute || "ended" === this._mediaStreamTrack.readyState || this.pendingDeviceChange) && !this.isUserProvided && (this.log.debug("reacquiring mic track", this.logContext), yield this.restart(void 0, !0)), yield e.unmute.call(this), this
				} finally {
					t()
				}
			})
		}
		restartTrack(e) {
			return rF(this, void 0, void 0, function*() {
				let t;
				if (e) {
					let i = sn({
						audio: e
					});
					"boolean" != typeof i.audio && (t = i.audio)
				}
				yield this.restart(t)
			})
		}
		applyConstraints(e) {
			return rF(this, void 0, void 0, function*() {
				let t = yield this.trackChangeLock.lock();
				try {
					let t = yield this._mediaStreamTrack.applyConstraints(e);
					return this._constraints = Object.assign(Object.assign({}, this._constraints), e), t
				} finally {
					t()
				}
			})
		}
		restart(e, t) {
			let i = Object.create(null, {
				restart: {
					get: () => super.restart
				}
			});
			return rF(this, void 0, void 0, function*() {
				let n = yield i.restart.call(this, e, t);
				return this.checkForSilence(), n
			})
		}
		startMonitor() {
			!s_() || this.monitorInterval || (this.monitorInterval = setInterval(() => {
				this.monitorSender()
			}, 2e3))
		}
		setProcessor(e) {
			return rF(this, void 0, void 0, function*() {
				var t;
				let i = yield this.trackChangeLock.lock();
				try {
					if (!sO() && !this.audioContext) throw Error("Audio context needs to be set on LocalAudioTrack in order to enable processors");
					this.processor && (yield this.internalStopProcessor());
					let i = {
						kind: this.kind,
						track: this._mediaStreamTrack,
						audioContext: this.audioContext,
						localTrack: this
					};
					this.log.debug("setting up audio processor ".concat(e.name), this.logContext), yield e.init(i), this.processor = e, this.processor.processedTrack && (yield null == (t = this.sender) ? void 0 : t.replaceTrack(this.processor.processedTrack), this.processor.processedTrack.addEventListener("enable-lk-krisp-noise-filter", this.handleKrispNoiseFilterEnable), this.processor.processedTrack.addEventListener("disable-lk-krisp-noise-filter", this.handleKrispNoiseFilterDisable)), this.emit(ev.TrackProcessorUpdate, this.processor)
				} finally {
					i()
				}
			})
		}
		setAudioContext(e) {
			this.audioContext = e
		}
		getSenderStats() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t;
				if (null == (e = this.sender) ? void 0 : e.getStats) return (yield this.sender.getStats()).forEach(e => {
					"outbound-rtp" === e.type && (t = {
						type: "audio",
						streamId: e.id,
						packetsSent: e.packetsSent,
						packetsLost: e.packetsLost,
						bytesSent: e.bytesSent,
						timestamp: e.timestamp,
						roundTripTime: e.roundTripTime,
						jitter: e.jitter
					})
				}), t
			})
		}
		checkForSilence() {
			return rF(this, void 0, void 0, function*() {
				let e = yield sr(this);
				return e && (this.isMuted || this.log.debug("silence detected on local audio track", this.logContext), this.emit(ev.AudioSilenceDetected)), e
			})
		}
	}
	let cn = Object.values(a5),
		cr = Object.values(a7),
		ca = Object.values(se),
		cs = [a5.h180, a5.h360],
		co = [a7.h180, a7.h360],
		cc = ["q", "h", "f"];

	function cl(e, t, i, n) {
		var r, a, s;
		let o, c, l = null == n ? void 0 : n.videoEncoding;
		e && (l = null == n ? void 0 : n.screenShareEncoding);
		let d = null == n ? void 0 : n.simulcast,
			u = null == n ? void 0 : n.scalabilityMode,
			h = null == n ? void 0 : n.videoCodec;
		if (!l && !d && !u || !t || !i) return [{}];
		l || (l = function(e, t, i, n) {
			let r = function(e, t, i) {
					if (e) return ca;
					let n = t > i ? t / i : i / t;
					return Math.abs(n - 16 / 9) < Math.abs(n - 4 / 3) ? cn : cr
				}(e, t, i),
				a = r[0].encoding,
				s = Math.max(t, i);
			for (let e = 0; e < r.length; e += 1) {
				let t = r[e];
				if (a = t.encoding, t.width >= s) break
			}
			if (n) switch (n) {
				case "av1":
				case "h265":
					(a = Object.assign({}, a)).maxBitrate = .7 * a.maxBitrate;
					break;
				case "vp9":
					(a = Object.assign({}, a)).maxBitrate = .85 * a.maxBitrate
			}
			return a
		}(e, t, i, h), r_.debug("using video encoding", l));
		let p = l.maxFramerate,
			m = new a3(t, i, l.maxBitrate, l.maxFramerate, l.priority);
		if (u && sS(h)) {
			let e = new cm(u),
				t = [];
			if (e.spatial > 3) throw Error("unsupported scalabilityMode: ".concat(u));
			let i = aF();
			if (sI() || sO() || (null == i ? void 0 : i.name) === "Chrome" && 0 > sF(null == i ? void 0 : i.version, "113")) {
				let n = "h" == e.suffix ? 2 : 3,
					a = ((r = i) || (r = aF()), (null == r ? void 0 : r.name) === "Safari" && sF(r.version, "18.3") > 0 || (null == r ? void 0 : r.os) === "iOS" && !!(null == r ? void 0 : r.osVersion) && sF(r.osVersion, "18.3") > 0);
				for (let i = 0; i < e.spatial; i += 1) t.push({
					rid: cc[2 - i],
					maxBitrate: l.maxBitrate / Math.pow(n, i),
					maxFramerate: m.encoding.maxFramerate,
					scaleResolutionDownBy: a ? Math.pow(2, i) : void 0
				});
				t[0].scalabilityMode = u
			} else t.push({
				maxBitrate: l.maxBitrate,
				maxFramerate: m.encoding.maxFramerate,
				scalabilityMode: u
			});
			return m.encoding.priority && (t[0].priority = m.encoding.priority, t[0].networkPriority = m.encoding.priority), r_.debug("using svc encoding", {
				encodings: t
			}), t
		}
		if (!d) return [l];
		if ((o = e ? null != (a = cp(null == n ? void 0 : n.screenShareSimulcastLayers)) ? a : cu(e, m) : null != (s = cp(null == n ? void 0 : n.videoSimulcastLayers)) ? s : cu(e, m)).length > 0) {
			let e = o[0];
			o.length > 1 && (c = tg(o, 2)[1]);
			let n = Math.max(t, i);
			if (n >= 960 && c) return ch(t, i, [e, c, m], p);
			if (n >= 480) return ch(t, i, [e, m], p)
		}
		return ch(t, i, [m])
	}

	function cd(e, t, i) {
		var n, r, a, s;
		if (!i.backupCodec || !0 === i.backupCodec || i.backupCodec.codec === i.videoCodec) return;
		t !== i.backupCodec.codec && r_.warn("requested a different codec than specified as backup", {
			serverRequested: t,
			backup: i.backupCodec.codec
		}), i.videoCodec = t, i.videoEncoding = i.backupCodec.encoding;
		let o = e.mediaStreamTrack.getSettings(),
			c = null != (n = o.width) ? n : null == (r = e.dimensions) ? void 0 : r.width,
			l = null != (a = o.height) ? a : null == (s = e.dimensions) ? void 0 : s.height;
		return e.source === sp.Source.ScreenShare && i.simulcast && (i.simulcast = !1), cl(e.source === sp.Source.ScreenShare, c, l, i)
	}

	function cu(e, t) {
		if (e) return [{
			scaleResolutionDownBy: 2,
			fps: t.encoding.maxFramerate
		}].map(e => {
			var i, n;
			return new a3(Math.floor(t.width / e.scaleResolutionDownBy), Math.floor(t.height / e.scaleResolutionDownBy), Math.max(15e4, Math.floor(t.encoding.maxBitrate / (Math.pow(e.scaleResolutionDownBy, 2) * ((null != (i = t.encoding.maxFramerate) ? i : 30) / (null != (n = e.fps) ? n : 30))))), e.fps, t.encoding.priority)
		});
		let i = t.width,
			n = t.height,
			r = i > n ? i / n : n / i;
		return Math.abs(r - 16 / 9) < Math.abs(r - 4 / 3) ? cs : co
	}

	function ch(e, t, i, n) {
		let r = [];
		if (i.forEach((i, a) => {
				if (a >= cc.length) return;
				let s = Math.min(e, t),
					o = {
						rid: cc[a],
						scaleResolutionDownBy: Math.max(1, s / Math.min(i.width, i.height)),
						maxBitrate: i.encoding.maxBitrate
					},
					c = n && i.encoding.maxFramerate ? Math.min(n, i.encoding.maxFramerate) : i.encoding.maxFramerate;
				c && (o.maxFramerate = c);
				let l = aF(),
					d = (null == l ? void 0 : l.name) === "Firefox" && "iOS" !== l.os || 0 === a;
				i.encoding.priority && d && (o.priority = i.encoding.priority, o.networkPriority = i.encoding.priority), r.push(o)
			}), sO() && "ios" === sN()) {
			let e;
			r.forEach(t => {
				e ? t.maxFramerate && t.maxFramerate > e && (e = t.maxFramerate) : e = t.maxFramerate
			});
			let t = !0;
			r.forEach(i => {
				var n;
				i.maxFramerate != e && (t && (t = !1, r_.info("Simulcast on iOS React-Native requires all encodings to share the same framerate.")), r_.info('Setting framerate of encoding "'.concat(null != (n = i.rid) ? n : "", '" to ').concat(e)), i.maxFramerate = e)
			})
		}
		return r
	}

	function cp(e) {
		if (e) return e.slice().sort((e, t) => {
			let i = e.encoding,
				n = t.encoding;
			return i.maxBitrate > n.maxBitrate ? 1 : i.maxBitrate < n.maxBitrate ? -1 : i.maxBitrate === n.maxBitrate && i.maxFramerate && n.maxFramerate ? i.maxFramerate > n.maxFramerate ? 1 : -1 : 0
		})
	}
	class cm {
		constructor(e) {
			let t = e.match(/^L(\d)T(\d)(h|_KEY|_KEY_SHIFT){0,1}$/);
			if (!t) throw Error("invalid scalability mode");
			if (this.spatial = parseInt(t[1]), this.temporal = parseInt(t[2]), t.length > 3) switch (t[3]) {
				case "h":
				case "_KEY":
				case "_KEY_SHIFT":
					this.suffix = t[3]
			}
		}
		toString() {
			var e;
			return "L".concat(this.spatial, "T").concat(this.temporal).concat(null != (e = this.suffix) ? e : "")
		}
	}
	class cg extends ct {
		get sender() {
			return this._sender
		}
		set sender(e) {
			this._sender = e, this.degradationPreference && this.setDegradationPreference(this.degradationPreference)
		}
		constructor(e, t) {
			let i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
				n = arguments.length > 3 ? arguments[3] : void 0;
			super(e, sp.Kind.Video, t, i, n), this.simulcastCodecs = new Map, this.degradationPreference = "balanced", this.isCpuConstrained = !1, this.optimizeForPerformance = !1, this.monitorSender = () => rF(this, void 0, void 0, function*() {
				let e;
				if (!this.sender) {
					this._currentBitrate = 0;
					return
				}
				try {
					e = yield this.getSenderStats()
				} catch (e) {
					this.log.error("could not get video sender stats", Object.assign(Object.assign({}, this.logContext), {
						error: e
					}));
					return
				}
				let t = new Map(e.map(e => [e.rid, e])),
					i = e.some(e => "cpu" === e.qualityLimitationReason);
				if (i !== this.isCpuConstrained && (this.isCpuConstrained = i, this.isCpuConstrained && this.emit(ev.CpuConstrained)), this.prevStats) {
					let e = 0;
					t.forEach((t, i) => {
						var n;
						let r = null == (n = this.prevStats) ? void 0 : n.get(i);
						e += of(t, r)
					}), this._currentBitrate = e
				}
				this.prevStats = t
			}), this.senderLock = new e0
		}
		get isSimulcast() {
			return !!this.sender && !!(this.sender.getParameters().encodings.length > 1)
		}
		startMonitor(e) {
			var t;
			if (this.signalClient = e, !s_()) return;
			let i = null == (t = this.sender) ? void 0 : t.getParameters();
			i && (this.encodings = i.encodings), this.monitorInterval || (this.monitorInterval = setInterval(() => {
				this.monitorSender()
			}, 2e3))
		}
		stop() {
			this._mediaStreamTrack.getConstraints(), this.simulcastCodecs.forEach(e => {
				e.mediaStreamTrack.stop()
			}), super.stop()
		}
		pauseUpstream() {
			let e = Object.create(null, {
				pauseUpstream: {
					get: () => super.pauseUpstream
				}
			});
			return rF(this, void 0, void 0, function*() {
				yield e.pauseUpstream.call(this);
				try {
					for (var t, i, n, r, a, s, o = !0, c = rj(this.simulcastCodecs.values()); !(t = (s = yield c.next()).done); o = !0) r = s.value, o = !1, yield null == (a = r.sender) ? void 0 : a.replaceTrack(null)
				} catch (e) {
					i = {
						error: e
					}
				} finally {
					try {
						!o && !t && (n = c.return) && (yield n.call(c))
					} finally {
						if (i) throw i.error
					}
				}
			})
		}
		resumeUpstream() {
			let e = Object.create(null, {
				resumeUpstream: {
					get: () => super.resumeUpstream
				}
			});
			return rF(this, void 0, void 0, function*() {
				yield e.resumeUpstream.call(this);
				try {
					for (var t, i, n, r, a, s, o = !0, c = rj(this.simulcastCodecs.values()); !(t = (s = yield c.next()).done); o = !0) r = s.value, o = !1, yield null == (a = r.sender) ? void 0 : a.replaceTrack(r.mediaStreamTrack)
				} catch (e) {
					i = {
						error: e
					}
				} finally {
					try {
						!o && !t && (n = c.return) && (yield n.call(c))
					} finally {
						if (i) throw i.error
					}
				}
			})
		}
		mute() {
			let e = Object.create(null, {
				mute: {
					get: () => super.mute
				}
			});
			return rF(this, void 0, void 0, function*() {
				let t = yield this.muteLock.lock();
				try {
					if (this.isMuted) return this.log.debug("Track already muted", this.logContext), this;
					return this.source !== sp.Source.Camera || this.isUserProvided || (this.log.debug("stopping camera track", this.logContext), this._mediaStreamTrack.stop()), yield e.mute.call(this), this
				} finally {
					t()
				}
			})
		}
		unmute() {
			let e = Object.create(null, {
				unmute: {
					get: () => super.unmute
				}
			});
			return rF(this, void 0, void 0, function*() {
				let t = yield this.muteLock.lock();
				try {
					if (!this.isMuted) return this.log.debug("Track already unmuted", this.logContext), this;
					return this.source !== sp.Source.Camera || this.isUserProvided || (this.log.debug("reacquiring camera track", this.logContext), yield this.restart(void 0, !0)), yield e.unmute.call(this), this
				} finally {
					t()
				}
			})
		}
		setTrackMuted(e) {
			for (let t of (super.setTrackMuted(e), this.simulcastCodecs.values())) t.mediaStreamTrack.enabled = !e
		}
		getSenderStats() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (!(null == (e = this.sender) ? void 0 : e.getStats)) return [];
				let t = [],
					i = yield this.sender.getStats();
				return i.forEach(e => {
					var n;
					if ("outbound-rtp" === e.type) {
						let r = {
								type: "video",
								streamId: e.id,
								frameHeight: e.frameHeight,
								frameWidth: e.frameWidth,
								framesPerSecond: e.framesPerSecond,
								framesSent: e.framesSent,
								firCount: e.firCount,
								pliCount: e.pliCount,
								nackCount: e.nackCount,
								packetsSent: e.packetsSent,
								bytesSent: e.bytesSent,
								qualityLimitationReason: e.qualityLimitationReason,
								qualityLimitationDurations: e.qualityLimitationDurations,
								qualityLimitationResolutionChanges: e.qualityLimitationResolutionChanges,
								rid: null != (n = e.rid) ? n : e.id,
								retransmittedPacketsSent: e.retransmittedPacketsSent,
								targetBitrate: e.targetBitrate,
								timestamp: e.timestamp
							},
							a = i.get(e.remoteId);
						a && (r.jitter = a.jitter, r.packetsLost = a.packetsLost, r.roundTripTime = a.roundTripTime), t.push(r)
					}
				}), t.sort((e, t) => {
					var i, n;
					return (null != (i = t.frameWidth) ? i : 0) - (null != (n = e.frameWidth) ? n : 0)
				}), t
			})
		}
		setPublishingQuality(e) {
			let t = [];
			for (let i = eb.LOW; i <= eb.HIGH; i += 1) t.push(new rt({
				quality: i,
				enabled: i <= e
			}));
			this.log.debug("setting publishing quality. max quality ".concat(e), this.logContext), this.setPublishingLayers(sS(this.codec), t)
		}
		restartTrack(e) {
			return rF(this, void 0, void 0, function*() {
				let t;
				if (e) {
					let i = sn({
						video: e
					});
					"boolean" != typeof i.video && (t = i.video)
				}
				yield this.restart(t), this.isCpuConstrained = !1;
				try {
					for (var i, n, r, a, s, o, c = !0, l = rj(this.simulcastCodecs.values()); !(i = (o = yield l.next()).done); c = !0) a = o.value, c = !1, a.sender && (null == (s = a.sender.transport) ? void 0 : s.state) !== "closed" && (a.mediaStreamTrack = this.mediaStreamTrack.clone(), yield a.sender.replaceTrack(a.mediaStreamTrack))
				} catch (e) {
					n = {
						error: e
					}
				} finally {
					try {
						!c && !i && (r = l.return) && (yield r.call(l))
					} finally {
						if (n) throw n.error
					}
				}
				yield this.onSenderTrackSwapped()
			})
		}
		onSenderTrackSwapped() {
			return rF(this, void 0, void 0, function*() {
				yield this.refreshSenderEncodings()
			})
		}
		refreshSenderEncodings() {
			return rF(this, void 0, void 0, function*() {
				var e;
				if (!this.sender || !this.publishOptions || this.optimizeForPerformance) return;
				let t = yield this.senderLock.lock();
				try {
					let t;
					try {
						t = yield this.waitForDimensions()
					} catch (e) {
						this.log.warn("could not determine new track dimensions, skipping encoding recompute", Object.assign(Object.assign({}, this.logContext), {
							error: e
						}));
						return
					}
					if (this.lastEncodedDimensions && this.lastEncodedDimensions.width === t.width && this.lastEncodedDimensions.height === t.height) return;
					let n = this.source === sp.Source.ScreenShare,
						r = cl(n, t.width, t.height, Object.assign({}, this.publishOptions));
					for (let n of (yield this.applyEncodingsToSender(this.sender, r), this.encodings = r, this.lastEncodedDimensions = t, this.simulcastCodecs)) {
						var i = tg(n, 2);
						let t = i[0],
							r = i[1];
						if (!r.sender || (null == (e = r.sender.transport) ? void 0 : e.state) === "closed" || !a8(t)) continue;
						let a = Object.assign({}, this.publishOptions),
							s = cd(this, t, a);
						s && (yield this.applyEncodingsToSender(r.sender, s), r.encodings = s)
					}
				} catch (e) {
					this.log.warn("failed to apply recomputed encodings", Object.assign(Object.assign({}, this.logContext), {
						error: e
					}))
				} finally {
					t()
				}
			})
		}
		applyEncodingsToSender(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = e.getParameters();
				i.encodings && i.encodings.length === t.length && (i.encodings.forEach((e, i) => {
					if (!1 === e.active) return;
					let n = t[i];
					void 0 !== n.scaleResolutionDownBy && (e.scaleResolutionDownBy = n.scaleResolutionDownBy), void 0 !== n.maxBitrate && (e.maxBitrate = n.maxBitrate), void 0 !== n.maxFramerate && (e.maxFramerate = n.maxFramerate), void 0 !== n.priority && (e.priority = n.priority, e.networkPriority = n.priority)
				}), this.log.debug("updating sender encodings after track restart", Object.assign(Object.assign({}, this.logContext), {
					encodings: i.encodings
				})), yield e.setParameters(i))
			})
		}
		setProcessor(e) {
			let t = Object.create(null, {
				setProcessor: {
					get: () => super.setProcessor
				}
			});
			return rF(this, arguments, void 0, function(e) {
				var i = this;
				let n = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
				return function*() {
					if (yield t.setProcessor.call(i, e, n), null == (c = i.processor) ? void 0 : c.processedTrack) try {
						for (var r, a, s, o, c, l, d, u = !0, h = rj(i.simulcastCodecs.values()); !(r = (d = yield h.next()).done); u = !0) o = d.value, u = !1, yield null == (l = o.sender) ? void 0 : l.replaceTrack(i.processor.processedTrack)
					} catch (e) {
						a = {
							error: e
						}
					} finally {
						try {
							!u && !r && (s = h.return) && (yield s.call(h))
						} finally {
							if (a) throw a.error
						}
					}
				}()
			})
		}
		setDegradationPreference(e) {
			return rF(this, void 0, void 0, function*() {
				if (this.degradationPreference = e, this.sender) try {
					this.log.debug("setting degradationPreference to ".concat(e), this.logContext);
					let t = this.sender.getParameters();
					t.degradationPreference = e, this.sender.setParameters(t)
				} catch (e) {
					this.log.warn("failed to set degradationPreference", Object.assign({
						error: e
					}, this.logContext))
				}
			})
		}
		addSimulcastTrack(e, t) {
			if (this.simulcastCodecs.has(e)) return void this.log.error("".concat(e, " already added, skipping adding simulcast codec"), this.logContext);
			let i = {
				codec: e,
				mediaStreamTrack: this.mediaStreamTrack.clone(),
				sender: void 0,
				encodings: t
			};
			return this.simulcastCodecs.set(e, i), i
		}
		setSimulcastTrackSender(e, t) {
			let i = this.simulcastCodecs.get(e);
			i && (i.sender = t, setTimeout(() => {
				this.subscribedCodecs && this.setPublishingCodecs(this.subscribedCodecs)
			}, 5e3))
		}
		setPublishingCodecs(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n, r, a, s, o;
				if (this.log.debug("setting publishing codecs", Object.assign(Object.assign({}, this.logContext), {
						codecs: e,
						currentCodec: this.codec
					})), !this.codec && e.length > 0) return yield this.setPublishingLayers(sS(e[0].codec), e[0].qualities), [];
				this.subscribedCodecs = e;
				let c = [];
				try {
					for (t = !0, i = rj(e); !(r = (n = yield i.next()).done); t = !0)
						if (o = n.value, t = !1, this.codec && this.codec !== o.codec) {
							let e = this.simulcastCodecs.get(o.codec);
							if (this.log.debug("try setPublishingCodec for ".concat(o.codec), Object.assign(Object.assign({}, this.logContext), {
									simulcastCodecInfo: e
								})), e && e.sender) e.encodings && (this.log.debug("try setPublishingLayersForSender ".concat(o.codec), this.logContext), yield cf(e.sender, e.encodings, o.qualities, this.senderLock, sS(o.codec), this.log, this.logContext));
							else
								for (let e of o.qualities)
									if (e.enabled) {
										c.push(o.codec);
										break
									}
						} else yield this.setPublishingLayers(sS(o.codec), o.qualities)
				} catch (e) {
					a = {
						error: e
					}
				} finally {
					try {
						!t && !r && (s = i.return) && (yield s.call(i))
					} finally {
						if (a) throw a.error
					}
				}
				return c
			})
		}
		setPublishingLayers(e, t) {
			return rF(this, void 0, void 0, function*() {
				this.optimizeForPerformance ? this.log.info("skipping setPublishingLayers due to optimized publishing performance", Object.assign(Object.assign({}, this.logContext), {
					qualities: t
				})) : (this.log.debug("setting publishing layers", Object.assign(Object.assign({}, this.logContext), {
					qualities: t
				})), this.sender && this.encodings && (yield cf(this.sender, this.encodings, t, this.senderLock, e, this.log, this.logContext)))
			})
		}
		prioritizePerformance() {
			return rF(this, void 0, void 0, function*() {
				if (!this.sender) throw Error("sender not found");
				let e = yield this.senderLock.lock();
				try {
					this.optimizeForPerformance = !0;
					let e = this.sender.getParameters();
					e.encodings = e.encodings.map((e, t) => {
						var i;
						return Object.assign(Object.assign({}, e), {
							active: 0 === t,
							scaleResolutionDownBy: Math.max(1, Math.ceil((null != (i = this.mediaStreamTrack.getSettings().height) ? i : 360) / 360)),
							scalabilityMode: 0 === t && sS(this.codec) ? "L1T3" : void 0,
							maxFramerate: 15 * (0 === t),
							maxBitrate: 0 === t ? e.maxBitrate : 0
						})
					}), this.log.debug("setting performance optimised encodings", Object.assign(Object.assign({}, this.logContext), {
						encodings: e.encodings
					})), this.encodings = e.encodings, yield this.sender.setParameters(e)
				} catch (e) {
					this.log.error("failed to set performance optimised encodings", Object.assign(Object.assign({}, this.logContext), {
						error: e
					})), this.optimizeForPerformance = !1
				} finally {
					e()
				}
			})
		}
		handleAppVisibilityChanged() {
			let e = Object.create(null, {
				handleAppVisibilityChanged: {
					get: () => super.handleAppVisibilityChanged
				}
			});
			return rF(this, void 0, void 0, function*() {
				yield e.handleAppVisibilityChanged.call(this), sM() && this.isInBackground && this.source === sp.Source.Camera && (this._mediaStreamTrack.enabled = !1)
			})
		}
	}

	function cf(e, t, i, n, r, a, s) {
		return rF(this, void 0, void 0, function*() {
			let o = yield n.lock();
			a.debug("setPublishingLayersForSender", Object.assign(Object.assign({}, s), {
				sender: e,
				qualities: i,
				senderEncodings: t
			}));
			try {
				let n = e.getParameters(),
					o = n.encodings;
				if (!o) return;
				if (o.length !== t.length) return void a.warn("cannot set publishing layers, encodings mismatch", Object.assign(Object.assign({}, s), {
					encodings: o,
					senderEncodings: t
				}));
				let c = !1;
				r && i.some(e => e.enabled) && i.forEach(e => e.enabled = !0), o.forEach((e, n) => {
					var r;
					let o = null != (r = e.rid) ? r : "";
					"" === o && (o = "q");
					let l = cv(o),
						d = i.find(e => e.quality === l);
					d && e.active !== d.enabled && (c = !0, e.active = d.enabled, a.debug("setting layer ".concat(d.quality, " to ").concat(e.active ? "enabled" : "disabled"), s), sE() && (d.enabled ? (e.scaleResolutionDownBy = t[n].scaleResolutionDownBy, e.maxBitrate = t[n].maxBitrate, e.maxFrameRate = t[n].maxFrameRate) : (e.scaleResolutionDownBy = 4, e.maxBitrate = 10, e.maxFrameRate = 2)))
				}), c && (n.encodings = o, a.debug("setting encodings", Object.assign(Object.assign({}, s), {
					encodings: n.encodings
				})), yield e.setParameters(n))
			} finally {
				o()
			}
		})
	}

	function cv(e) {
		switch (e) {
			case "f":
			default:
				return eb.HIGH;
			case "h":
				return eb.MEDIUM;
			case "q":
				return eb.LOW
		}
	}

	function ck(e, t, i, n) {
		if (!i) return [new i_({
			quality: eb.HIGH,
			width: e,
			height: t,
			bitrate: 0,
			ssrc: 0
		})];
		if (n) {
			let n = new cm(i[0].scalabilityMode),
				r = [],
				a = "h" == n.suffix ? 1.5 : 2,
				s = "h" == n.suffix ? 2 : 3;
			for (let o = 0; o < n.spatial; o += 1) r.push(new i_({
				quality: Math.min(eb.HIGH, n.spatial - 1) - o,
				width: Math.ceil(e / Math.pow(a, o)),
				height: Math.ceil(t / Math.pow(a, o)),
				bitrate: i[0].maxBitrate ? Math.ceil(i[0].maxBitrate / Math.pow(s, o)) : 0,
				ssrc: 0
			}));
			return r
		}
		return i.map(i => {
			var n, r, a;
			let s = null != (n = i.scaleResolutionDownBy) ? n : 1;
			return new i_({
				quality: cv(null != (r = i.rid) ? r : ""),
				width: Math.ceil(e / s),
				height: Math.ceil(t / s),
				bitrate: null != (a = i.maxBitrate) ? a : 0,
				ssrc: 0
			})
		})
	}
	let cy = "_lossy",
		cb = "_reliable",
		cT = "_data_track",
		cS = "leave-reconnect";
	(U = eL || (eL = {}))[U.New = 0] = "New", U[U.Connected = 1] = "Connected", U[U.Disconnected = 2] = "Disconnected", U[U.Reconnecting = 3] = "Reconnecting", U[U.Closed = 4] = "Closed", (F = eN || (eN = {}))[F.RELIABLE = 0] = "RELIABLE", F[F.LOSSY = 1] = "LOSSY", F[F.DATA_TRACK_LOSSY = 2] = "DATA_TRACK_LOSSY";
	class cC extends rV.EventEmitter {
		get isClosed() {
			return this._isClosed
		}
		get isNewlyCreated() {
			return this._isNewlyCreated
		}
		get pendingReconnect() {
			return !!this.reconnectTimeout
		}
		constructor(e) {
			var t;
			super(), this.options = e, this.rtcConfig = {}, this.peerConnectionTimeout = o6.peerConnectionTimeout, this.fullReconnectOnNext = !1, this.latestRemoteOfferId = 0, this.subscriberPrimary = !1, this.pcState = eL.New, this._isClosed = !0, this._isNewlyCreated = !0, this.pendingTrackResolvers = {}, this.reconnectAttempts = 0, this.reconnectStart = 0, this.attemptingReconnect = !1, this.joinAttempts = 0, this.maxJoinAttempts = 1, this.shouldFailNext = !1, this.shouldFailOnV1Path = !1, this.log = r_, this.reliableDataSequence = 1, this.reliableMessageBuffer = new oV, this.reliableReceivedState = new oH(3e4), this.lossyDataStatCurrentBytes = 0, this.lossyDataStatByterate = 0, this.lossyDataDropCount = 0, this.midToTrackId = {}, this.isWaitingForNetworkReconnect = !1, this.handleDataChannel = e => rF(this, [e], void 0, function(e) {
				var t = this;
				let i = e.channel;
				return function*() {
					let e;
					if (i) {
						if (i.label === cb) t.reliableDCSub = i, e = t.handleDataMessage;
						else if (i.label === cy) t.lossyDCSub = i, e = t.handleDataMessage;
						else {
							if (i.label !== cT) return;
							t.dataTrackDCSub = i, e = t.handleDataTrackMessage
						}
						t.log.debug("on data channel ".concat(i.id, ", ").concat(i.label)), i.onmessage = e
					}
				}()
			}), this.handleDataMessage = e => rF(this, void 0, void 0, function*() {
				var t, i, n, r, a;
				let s = yield this.dataProcessLock.lock();
				try {
					let s;
					if (e.data instanceof ArrayBuffer) s = e.data;
					else {
						if (!(e.data instanceof Blob)) return void this.log.error("unsupported data type", {
							data: e.data
						});
						s = yield e.data.arrayBuffer()
					}
					let o = iA.fromBinary(new Uint8Array(s));
					if (o.sequence > 0 && "" !== o.participantSid) {
						let e = this.reliableReceivedState.get(o.participantSid);
						if (e && o.sequence <= e) return;
						this.reliableReceivedState.set(o.participantSid, o.sequence)
					}
					if ((null == (t = o.value) ? void 0 : t.case) === "speaker") this.emit(ef.ActiveSpeakersUpdate, o.value.value.speakers);
					else if ((null == (i = o.value) ? void 0 : i.case) === "encryptedPacket") {
						if (!this.e2eeManager) return void this.log.error("Received encrypted packet but E2EE not set up");
						let e = yield null == (n = this.e2eeManager) ? void 0 : n.handleEncryptedData(o.value.value.encryptedValue, o.value.value.iv, o.participantIdentity, o.value.value.keyIndex), t = iN.fromBinary(e.payload), i = new iA({
							value: t.value,
							participantIdentity: o.participantIdentity,
							participantSid: o.participantSid
						});
						(null == (r = i.value) ? void 0 : r.case) === "user" && cw(i, i.value.value), this.emit(ef.DataPacketReceived, i, o.value.value.encryptionType)
					} else(null == (a = o.value) ? void 0 : a.case) === "user" && cw(o, o.value.value), this.emit(ef.DataPacketReceived, o, iR.NONE)
				} finally {
					s()
				}
			}), this.handleDataTrackMessage = e => rF(this, void 0, void 0, function*() {
				let t;
				if (e.data instanceof ArrayBuffer) t = e.data;
				else {
					if (!(e.data instanceof Blob)) return void this.log.error("unsupported data type", {
						data: e.data
					});
					t = yield e.data.arrayBuffer()
				}
				this.emit("dataTrackPacketReceived", new Uint8Array(t))
			}), this.handleDataError = e => {
				if (this._isClosed) return;
				let t = 0 === e.currentTarget.maxRetransmits ? "lossy" : "reliable";
				if ("u" > typeof RTCErrorEvent && e instanceof RTCErrorEvent && e.error) {
					let i = e.error;
					this.log.error("DataChannel error on ".concat(t, ": ").concat(i.message), {
						error: i,
						errorDetail: i.errorDetail,
						sctpCauseCode: i.sctpCauseCode
					})
				} else this.log.error("Unknown DataChannel error on ".concat(t), {
					event: e
				})
			}, this.handleDataChannelClose = e => () => {
				var t;
				this._isClosed || (null == (t = this.pcManager) ? void 0 : t.publisher.getConnectionState()) !== "connected" || this.log.error("publisher data channel '".concat(eN[e], "' closed unexpectedly"), this.logContext)
			}, this.handleBufferedAmountLow = e => {
				this.updateAndEmitDCBufferStatus(e)
			}, this.handleDisconnect = (e, t) => {
				if (this._isClosed) return;
				this.log.warn("".concat(e, " disconnected")), 0 === this.reconnectAttempts && (this.reconnectStart = Date.now());
				let i = e => {
						this.log.warn("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(e, "ms. giving up")), this.emit(ef.Disconnected), this.close()
					},
					n = Date.now() - this.reconnectStart,
					r = this.getNextRetryDelay({
						elapsedMs: n,
						retryCount: this.reconnectAttempts
					});
				null === r ? i(n) : (e === cS && (r = 0), this.log.debug("reconnecting in ".concat(r, "ms")), this.clearReconnectTimeout(), this.token && this.emit(ef.TokenRefreshed, this.token), this.reconnectTimeout = a2.setTimeout(() => this.attemptReconnect(t).finally(() => this.reconnectTimeout = void 0), r))
			}, this.waitForRestarted = () => new Promise((e, t) => {
				this.pcState === eL.Connected && e();
				let i = () => {
						this.off(ef.Disconnected, n), e()
					},
					n = () => {
						this.off(ef.Restarted, i), t()
					};
				this.once(ef.Restarted, i), this.once(ef.Disconnected, n)
			}), this.updateAndEmitDCBufferStatus = e => {
				if (e === eN.RELIABLE) {
					let t = this.dataChannelForKind(e);
					t && this.reliableMessageBuffer.alignBufferedAmount(t.bufferedAmount)
				}
				try {
					let t = this.isBelowLowWaterMark(e);
					void 0 !== t && t !== this.dcBufferStatus.get(e) && (this.dcBufferStatus.set(e, t), this.emit(ef.DCBufferStatusChanged, t, e))
				} catch (e) {
					this.log.warn("could not update buffer status", {
						error: e
					})
				}
			}, this.isBelowHighWaterMark = e => {
				let t = this.dataChannelForKind(e);
				if (!t) throw TypeError("Could not get data channel for kind ".concat(e));
				let i = e === eN.RELIABLE ? 1048576 : 262144;
				return t.bufferedAmount <= i
			}, this.isBelowLowWaterMark = e => {
				let t = this.dataChannelForKind(e);
				if (!t) throw TypeError("Could not get data channel for kind ".concat(e));
				return t.bufferedAmount <= t.bufferedAmountLowThreshold
			}, this.waitForBufferHeadroomLocks = new Map, this.waiterAbortControllers = new Map, this.onRtpMapAvailable = e => {
				let t = new Map;
				e.forEach(e => {
					let i = e.codec.toLowerCase();
					sG(i) && t.set(e.payload, i)
				}), this.emit(ef.RTPVideoMapUpdate, t)
			}, this.handleBrowserOnLine = () => rF(this, void 0, void 0, function*() {
				!this.url || (yield fetch(sY(this.url), {
					method: "HEAD"
				}).then(e => e.ok).catch(() => !1)) && (this.log.info("detected network reconnected"), (this.client.currentState === eI.RECONNECTING || this.isWaitingForNetworkReconnect && this.client.currentState === eI.CONNECTED) && (this.clearReconnectTimeout(), this.attemptReconnect(im.RR_SIGNAL_DISCONNECTED), this.isWaitingForNetworkReconnect = !1))
			}), this.handleBrowserOffline = () => rF(this, void 0, void 0, function*() {
				if (this.url) try {
					yield Promise.race([fetch(sY(this.url), {
						method: "HEAD"
					}), sv(4e3).then(() => Promise.reject())])
				} catch (e) {
					!1 === window.navigator.onLine && (this.log.info("detected network interruption"), this.isWaitingForNetworkReconnect = !0)
				}
			}), this.log = rA(null != (t = e.loggerName) ? t : eo.Engine, () => this.logContext), this.loggerOptions = {
				loggerName: e.loggerName,
				loggerContextCb: () => this.logContext
			}, this.client = new oB(void 0, this.loggerOptions), this.client.signalLatency = this.options.expSignalLatency, this.reconnectPolicy = this.options.reconnectPolicy, this.closingLock = new e0, this.dataProcessLock = new e0, this.dcBufferStatus = new Map([
				[eN.RELIABLE, !0],
				[eN.LOSSY, !0],
				[eN.DATA_TRACK_LOSSY, !0]
			]), this.client.onParticipantUpdate = e => this.emit(ef.ParticipantUpdate, e), this.client.onConnectionQuality = e => this.emit(ef.ConnectionQualityUpdate, e), this.client.onRoomUpdate = e => this.emit(ef.RoomUpdate, e), this.client.onSubscriptionError = e => this.emit(ef.SubscriptionError, e), this.client.onSubscriptionPermissionUpdate = e => this.emit(ef.SubscriptionPermissionUpdate, e), this.client.onSpeakersChanged = e => this.emit(ef.SpeakersChanged, e), this.client.onStreamStateUpdate = e => this.emit(ef.StreamStateChanged, e), this.client.onRequestResponse = e => this.emit(ef.SignalRequestResponse, e), this.client.onParticipantUpdate = e => this.emit(ef.ParticipantUpdate, e), this.client.onJoined = e => this.emit(ef.Joined, e)
		}
		get logContext() {
			var e, t, i, n, r, a;
			return {
				room: null == (t = null == (e = this.latestJoinResponse) ? void 0 : e.room) ? void 0 : t.name,
				roomID: null == (n = null == (i = this.latestJoinResponse) ? void 0 : i.room) ? void 0 : n.sid,
				participant: null == (a = null == (r = this.latestJoinResponse) ? void 0 : r.participant) ? void 0 : a.identity,
				participantID: this.participantSid
			}
		}
		join(e, t, i, n) {
			return rF(this, arguments, void 0, function(e, t, i, n) {
				var r = this;
				let a = arguments.length > 4 && void 0 !== arguments[4] && arguments[4];
				return function*() {
					var s, o, c;
					r._isNewlyCreated = !1, r.url = e, r.token = t, r.signalOpts = i, r.maxJoinAttempts = i.maxRetries;
					try {
						let l;
						r.joinAttempts += 1, r.setupSignalClientCallbacks();
						let d = !a && s5() && !sE();
						if (d) {
							r.pcManager || (yield r.configure(), r.applyInitialPublisherLayout());
							let e = yield null == (s = r.pcManager) ? void 0 : s.publisher.createInitialOffer();
							e && (l = oq(e.offer, e.offerId))
						}
						if (null == n ? void 0 : n.aborted) throw aK.cancelled("Connection aborted");
						if (!a && r.shouldFailOnV1Path) throw r.shouldFailOnV1Path = !1, aK.serviceNotFound("Simulated v1 path failure", "v0-rtc");
						let u = yield r.client.join(e, t, i, n, a, l);
						r._isClosed = !1, r.latestJoinResponse = u, r.participantSid = null == (o = u.participant) ? void 0 : o.sid, r.subscriberPrimary = u.subscriberPrimary, d ? null == (c = r.pcManager) || c.updateConfiguration(r.makeRTCConfiguration(u)) : (!r.pcManager && (yield r.configure(u, !a), a || r.applyInitialPublisherLayout()), (!r.subscriberPrimary || u.fastPublish) && r.negotiate().catch(e => {
							r.log.error(e)
						})), r.registerOnLineListener(), r.clientConfiguration = u.clientConfiguration, r.emit(ef.SignalConnected, u);
						let h = u.serverInfo;
						return h || (h = {
							version: u.serverVersion,
							region: u.serverRegion
						}), r.log.info("connected to Livekit Server ".concat(Object.entries(h).map(e => {
							let t = tg(e, 2),
								i = t[0],
								n = t[1];
							return "".concat(i, ": ").concat(n)
						}).join(", "))), {
							joinResponse: u,
							serverInfo: h
						}
					} catch (s) {
						if (s instanceof aK) {
							if (s.reason === eu.ServerUnreachable) {
								if (r.log.warn("Couldn't connect to server, attempt ".concat(r.joinAttempts, " of ").concat(r.maxJoinAttempts)), r.joinAttempts < r.maxJoinAttempts) return r.join(e, t, i, n, a)
							} else if (s.reason === eu.ServiceNotFound) return r.log.warn("Initial connection failed: ".concat(s.message, " – Retrying")), r.pcManager && (r.pcManager.onStateChange = void 0, yield r.cleanupPeerConnections()), r.join(e, t, i, n, !0)
						}
						throw s
					}
				}()
			})
		}
		close() {
			return rF(this, void 0, void 0, function*() {
				let e = yield this.closingLock.lock();
				if (this.isClosed) return void e();
				try {
					this._isClosed = !0, this.joinAttempts = 0, this.emit(ef.Closing), this.removeAllListeners(), this.deregisterOnLineListener(), this.clearPendingReconnect(), this.cleanupLossyDataStats(), yield this.cleanupPeerConnections(), yield this.cleanupClient()
				} finally {
					e()
				}
			})
		}
		cleanupPeerConnections() {
			return rF(this, void 0, void 0, function*() {
				var e;
				this.invalidateDataChannelWaiters("peer connections cleaned up");
				let t = e => {
					e && (e.onbufferedamountlow = null, e.onclose = null, e.onclosing = null, e.onerror = null, e.onmessage = null, e.onopen = null, e.close())
				};
				t(this.lossyDC), t(this.lossyDCSub), t(this.reliableDC), t(this.reliableDCSub), t(this.dataTrackDC), t(this.dataTrackDCSub), yield null == (e = this.pcManager) ? void 0 : e.close(), this.pcManager = void 0, this.lossyDC = void 0, this.lossyDCSub = void 0, this.reliableDC = void 0, this.reliableDCSub = void 0, this.dataTrackDC = void 0, this.dataTrackDCSub = void 0, this.reliableMessageBuffer = new oV, this.reliableDataSequence = 1, this.reliableReceivedState.clear()
			})
		}
		cleanupLossyDataStats() {
			this.lossyDataStatByterate = 0, this.lossyDataStatCurrentBytes = 0, this.lossyDataStatInterval && (clearInterval(this.lossyDataStatInterval), this.lossyDataStatInterval = void 0), this.lossyDataDropCount = 0
		}
		cleanupClient() {
			return rF(this, void 0, void 0, function*() {
				for (let e of (yield this.client.close(), this.client.resetCallbacks(), Object.keys(this.pendingTrackResolvers))) this.pendingTrackResolvers[e].reject();
				this.pendingTrackResolvers = {}
			})
		}
		addTrack(e) {
			if (this.pendingTrackResolvers[e.cid]) throw new aJ("a track with the same ID has already been published");
			return new Promise((t, i) => {
				let n = setTimeout(() => {
					delete this.pendingTrackResolvers[e.cid], i(aK.timeout("publication of local track timed out, no response from server"))
				}, 1e4);
				this.pendingTrackResolvers[e.cid] = {
					resolve: e => {
						clearTimeout(n), t(e)
					},
					reject: () => {
						clearTimeout(n), i(Error("Cancelled publication by calling unpublish"))
					}
				}, this.client.sendAddTrack(e)
			})
		}
		removeTrack(e) {
			if (e.track && this.pendingTrackResolvers[e.track.id]) {
				let t = this.pendingTrackResolvers[e.track.id].reject;
				t && t(), delete this.pendingTrackResolvers[e.track.id]
			}
			try {
				return this.pcManager.removeTrack(e), !0
			} catch (e) {
				this.log.warn("failed to remove track", {
					error: e
				})
			}
			return !1
		}
		updateMuteStatus(e, t) {
			this.client.sendMuteTrack(e, t)
		}
		get dataSubscriberReadyState() {
			var e;
			return null == (e = this.reliableDCSub) ? void 0 : e.readyState
		}
		getConnectedServerAddress() {
			return rF(this, void 0, void 0, function*() {
				var e;
				return null == (e = this.pcManager) ? void 0 : e.getConnectedAddress()
			})
		}
		setRegionStrategy(e) {
			this.regionStrategy = e
		}
		configure(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i;
				if (!this.pcManager || this.pcManager.currentState === ex.NEW) {
					if (e) {
						this.participantSid = null == (i = e.participant) ? void 0 : i.sid;
						let n = this.makeRTCConfiguration(e);
						this.pcManager = new o8(t ? "publisher-only" : e.subscriberPrimary ? "subscriber-primary" : "publisher-primary", this.loggerOptions, n)
					} else {
						let e = this.makeRTCConfiguration();
						this.pcManager = new o8("publisher-only", this.loggerOptions, e)
					}
					this.emit(ef.TransportsCreated, this.pcManager.publisher, this.pcManager.subscriber), this.pcManager.onIceCandidate = (e, t) => {
						this.client.sendIceCandidate(e, t)
					}, this.pcManager.onPublisherOffer = (e, t) => {
						this.client.sendOffer(e, t)
					}, this.pcManager.onDataChannel = this.handleDataChannel, this.pcManager.onStateChange = (e, t, i) => rF(this, void 0, void 0, function*() {
						if (this.log.debug("primary PC state changed ".concat(e)), ["closed", "disconnected", "failed"].includes(t) && (this.publisherConnectionPromise = void 0), e === ex.CONNECTED) {
							let e = this.pcState === eL.New;
							this.pcState = eL.Connected, e && this.emit(ef.Connected, this.latestJoinResponse)
						} else e === ex.FAILED && (this.pcState === eL.Connected || this.pcState === eL.Reconnecting) && (this.pcState = eL.Disconnected, this.handleDisconnect("peerconnection failed", "failed" === i ? im.RR_SUBSCRIBER_FAILED : im.RR_PUBLISHER_FAILED));
						let n = this.client.isDisconnected || this.client.currentState === eI.RECONNECTING,
							r = [ex.FAILED, ex.CLOSING, ex.CLOSED].includes(e);
						n && r && !this._isClosed && this.emit(ef.Offline)
					}), this.pcManager.onTrack = e => {
						0 !== e.streams.length && this.emit(ef.MediaTrackAdded, e.track, e.streams[0], e.receiver)
					}
				}
			})
		}
		setupSignalClientCallbacks() {
			this.client.onAnswer = (e, t, i) => rF(this, void 0, void 0, function*() {
				this.pcManager && (this.log.debug("received server answer", {
					RTCSdpType: e.type,
					sdp: e.sdp,
					midToTrackId: i
				}), this.midToTrackId = i, yield this.pcManager.setPublisherAnswer(e, t))
			}), this.client.onTrickle = (e, t) => {
				this.pcManager && (this.log.debug("got ICE candidate from peer", {
					candidate: e,
					target: t
				}), this.pcManager.addIceCandidate(e, t))
			}, this.client.onOffer = (e, t, i) => rF(this, void 0, void 0, function*() {
				if (this.latestRemoteOfferId = t, !this.pcManager) return;
				this.midToTrackId = i;
				let n = yield this.pcManager.createSubscriberAnswerFromOffer(e, t);
				n && this.client.sendAnswer(n, t)
			}), this.client.onLocalTrackPublished = e => {
				var t;
				if (this.log.debug("received trackPublishedResponse", {
						cid: e.cid,
						track: null == (t = e.track) ? void 0 : t.sid
					}), !this.pendingTrackResolvers[e.cid]) return void this.log.error("missing track resolver for ".concat(e.cid), {
					cid: e.cid
				});
				let i = this.pendingTrackResolvers[e.cid].resolve;
				delete this.pendingTrackResolvers[e.cid], i(e.track)
			}, this.client.onLocalTrackUnpublished = e => {
				this.emit(ef.LocalTrackUnpublished, e)
			}, this.client.onLocalTrackSubscribed = e => {
				this.emit(ef.LocalTrackSubscribed, e)
			}, this.client.onTokenRefresh = e => {
				this.token = e, this.emit(ef.TokenRefreshed, e)
			}, this.client.onRemoteMuteChanged = (e, t) => {
				this.emit(ef.RemoteMute, e, t)
			}, this.client.onSubscribedQualityUpdate = e => {
				this.emit(ef.SubscribedQualityUpdate, e)
			}, this.client.onRoomMoved = e => {
				var t;
				this.participantSid = null == (t = e.participant) ? void 0 : t.sid, this.latestJoinResponse && (this.latestJoinResponse.room = e.room), this.emit(ef.RoomMoved, e)
			}, this.client.onMediaSectionsRequirement = e => {
				this.addMediaSections(e.numAudios, e.numVideos), this.negotiate()
			}, this.client.onPublishDataTrackResponse = e => {
				this.emit(ef.PublishDataTrackResponse, e)
			}, this.client.onUnPublishDataTrackResponse = e => {
				this.emit(ef.UnPublishDataTrackResponse, e)
			}, this.client.onDataTrackSubscriberHandles = e => {
				this.emit(ef.DataTrackSubscriberHandles, e)
			}, this.client.onClose = () => {
				this.handleDisconnect("signal", im.RR_SIGNAL_DISCONNECTED)
			}, this.client.onLeave = e => {
				switch (this.log.info("client leave request received (action=".concat(null == e ? void 0 : e.action, ")"), {
						reason: null == e ? void 0 : e.reason
					}), e.regions && (this.log.debug("updating regions"), this.emit(ef.ServerRegionsReported, e.regions)), e.action) {
					case n1.DISCONNECT:
						this.emit(ef.Disconnected, null == e ? void 0 : e.reason), this.close();
						break;
					case n1.RECONNECT:
						this.fullReconnectOnNext = !0, this.handleDisconnect(cS);
						break;
					case n1.RESUME:
						this.handleDisconnect(cS)
				}
			}
		}
		makeRTCConfiguration(e) {
			var t;
			let i = Object.assign({}, this.rtcConfig);
			if (((null == (t = this.signalOpts) ? void 0 : t.e2eeEnabled) || this.frameMetadataWorker && !sR()) && oo() && (this.log.debug("E2EE - setting up transports with insertable streams"), i.encodedInsertableStreams = !0), i.sdpSemantics = "unified-plan", i.continualGatheringPolicy = "gather_continually", !e) return i;
			if (e.iceServers && !i.iceServers) {
				let t = [];
				e.iceServers.forEach(e => {
					let i = {
						urls: e.urls
					};
					e.username && (i.username = e.username), e.credential && (i.credential = e.credential), t.push(i)
				}), i.iceServers = t
			}
			return e.clientConfiguration && e.clientConfiguration.forceRelay === ih.ENABLED && (i.iceTransportPolicy = "relay"), i
		}
		applyInitialPublisherLayout() {
			this.createDataChannels(), sO() || this.addMediaSections(3, 3)
		}
		addMediaSections(e, t) {
			var i, n;
			let r = {
				direction: "recvonly"
			};
			for (let t = 0; t < e; t++) null == (i = this.pcManager) || i.addPublisherTransceiverOfKind("audio", r);
			for (let e = 0; e < t; e++) null == (n = this.pcManager) || n.addPublisherTransceiverOfKind("video", r)
		}
		createDataChannels() {
			this.pcManager && (this.invalidateDataChannelWaiters("data channels recreated"), this.lossyDC && (this.lossyDC.onmessage = null, this.lossyDC.onerror = null, this.lossyDC.onclose = null), this.reliableDC && (this.reliableDC.onmessage = null, this.reliableDC.onerror = null, this.reliableDC.onclose = null), this.dataTrackDC && (this.dataTrackDC.onmessage = null, this.dataTrackDC.onerror = null, this.dataTrackDC.onclose = null), this.lossyDC = this.pcManager.createPublisherDataChannel(cy, {
				ordered: !1,
				maxRetransmits: 0
			}), this.reliableDC = this.pcManager.createPublisherDataChannel(cb, {
				ordered: !0
			}), this.dataTrackDC = this.pcManager.createPublisherDataChannel(cT, {
				ordered: !1,
				maxRetransmits: 0
			}), this.lossyDC.onmessage = this.handleDataMessage, this.reliableDC.onmessage = this.handleDataMessage, this.dataTrackDC.onmessage = this.handleDataTrackMessage, this.lossyDC.onerror = this.handleDataError, this.reliableDC.onerror = this.handleDataError, this.dataTrackDC.onerror = this.handleDataError, this.lossyDC.onclose = this.handleDataChannelClose(eN.LOSSY), this.reliableDC.onclose = this.handleDataChannelClose(eN.RELIABLE), this.dataTrackDC.onclose = this.handleDataChannelClose(eN.DATA_TRACK_LOSSY), this.lossyDC.bufferedAmountLowThreshold = 8192, this.reliableDC.bufferedAmountLowThreshold = 65536, this.dataTrackDC.bufferedAmountLowThreshold = 8192, this.lossyDC.onbufferedamountlow = () => this.handleBufferedAmountLow(eN.LOSSY), this.reliableDC.onbufferedamountlow = () => this.handleBufferedAmountLow(eN.RELIABLE), this.dataTrackDC.onbufferedamountlow = () => this.handleBufferedAmountLow(eN.DATA_TRACK_LOSSY), this.cleanupLossyDataStats(), this.lossyDataStatInterval = setInterval(() => {
				this.lossyDataStatByterate = this.lossyDataStatCurrentBytes, this.lossyDataStatCurrentBytes = 0;
				let e = this.dataChannelForKind(eN.LOSSY);
				e && (e.bufferedAmountLowThreshold = Math.min(Math.max(this.lossyDataStatByterate / 10, 8192), 262144))
			}, 1e3))
		}
		createSender(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				let n;
				if (sk()) n = yield this.createTransceiverRTCRtpSender(e, t, i);
				else if (sy()) this.log.warn("using add-track fallback"), n = yield this.createRTCRtpSender(e.mediaStreamTrack);
				else throw new aQ("Required webRTC APIs not supported on this device");
				return this.setupFrameMetadataSender(n, t), n
			})
		}
		createSimulcastSender(e, t, i, n) {
			return rF(this, void 0, void 0, function*() {
				let r;
				if (sk()) r = yield this.createSimulcastTransceiverSender(e, t, i, n);
				else if (sy()) this.log.debug("using add-track fallback"), r = yield this.createRTCRtpSender(e.mediaStreamTrack);
				else throw new aQ("Cannot stream on this device");
				return r && this.setupFrameMetadataSender(r, i), r
			})
		}
		get frameMetadataWorker() {
			var e, t;
			return null == (t = null != (e = this.options.frameMetadata) ? e : this.options.packetTrailer) ? void 0 : t.worker
		}
		setupFrameMetadataSender(e) {
			var t, i, n;
			let r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
				a = this.frameMetadataWorker;
			if (!a || (null == (t = this.signalOpts) ? void 0 : t.e2eeEnabled)) return;
			let s = null != (i = r.frameMetadata) ? i : r.packetTrailer,
				o = om(s);
			if (sR()) {
				o && (e.transform = new RTCRtpScriptTransform(a, {
					kind: "encode",
					packetTrailer: s
				}));
				return
			}
			if (!op(null != (n = this.options.frameMetadata) ? n : this.options.packetTrailer) || !("createEncodedStreams" in e)) {
				o && this.log.warn("frame metadata transform not supported; skipping write", this.logContext);
				return
			}
			let c = e.createEncodedStreams(),
				l = c.readable,
				d = c.writable;
			o ? a.postMessage({
				kind: "encode",
				data: {
					readableStream: l,
					writableStream: d,
					packetTrailer: s
				}
			}, [l, d]) : l.pipeTo(d)
		}
		createTransceiverRTCRtpSender(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				if (!this.pcManager) throw new aQ("publisher is closed");
				let n = [];
				e.mediaStream && n.push(e.mediaStream), s2(e) && (e.codec = t.videoCodec);
				let r = {
					direction: "sendonly",
					streams: n
				};
				return i && (r.sendEncodings = i), (yield this.pcManager.addPublisherTransceiver(e.mediaStreamTrack, r)).sender
			})
		}
		createSimulcastTransceiverSender(e, t, i, n) {
			return rF(this, void 0, void 0, function*() {
				if (!this.pcManager) throw new aQ("publisher is closed");
				let r = {
					direction: "sendonly"
				};
				n && (r.sendEncodings = n);
				let a = yield this.pcManager.addPublisherTransceiver(t.mediaStreamTrack, r);
				if (i.videoCodec) return e.setSimulcastTrackSender(i.videoCodec, a.sender), a.sender
			})
		}
		createRTCRtpSender(e) {
			return rF(this, void 0, void 0, function*() {
				if (!this.pcManager) throw new aQ("publisher is closed");
				return this.pcManager.addPublisherTrack(e)
			})
		}
		attemptReconnect(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n;
				if (!this._isClosed) {
					if (this.attemptingReconnect) return void this.log.warn("already attempting reconnect, returning early");
					((null == (t = this.clientConfiguration) ? void 0 : t.resumeConnection) === ih.DISABLED || (null != (n = null == (i = this.pcManager) ? void 0 : i.currentState) ? n : ex.NEW) === ex.NEW) && (this.fullReconnectOnNext = !0);
					try {
						this.attemptingReconnect = !0, this.fullReconnectOnNext ? yield this.restartConnection(): yield this.resumeConnection(e), this.clearPendingReconnect(), this.fullReconnectOnNext = !1
					} catch (t) {
						this.reconnectAttempts += 1;
						let e = !0;
						t instanceof aQ ? (this.log.debug("received unrecoverable error", {
							error: t
						}), e = !1) : t instanceof a1 || (this.fullReconnectOnNext = !0), e ? this.handleDisconnect("reconnect", im.RR_UNKNOWN) : (this.log.info("could not recover connection after ".concat(this.reconnectAttempts, " attempts, ").concat(Date.now() - this.reconnectStart, "ms. giving up")), this.emit(ef.Disconnected), yield this.close())
					} finally {
						this.attemptingReconnect = !1
					}
				}
			})
		}
		getNextRetryDelay(e) {
			try {
				return this.reconnectPolicy.nextRetryDelayInMs(e)
			} catch (e) {
				this.log.warn("encountered error in reconnect policy", {
					error: e
				})
			}
			return null
		}
		restartConnection(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n;
				try {
					let i;
					if (!this.url || !this.token) throw new aQ("could not reconnect, url or token not saved");
					this.log.info("reconnecting, attempt: ".concat(this.reconnectAttempts)), this.emit(ef.Restarting), this.client.isDisconnected || (yield this.client.sendLeave()), yield this.cleanupPeerConnections(), yield this.cleanupClient();
					try {
						if (!this.signalOpts) throw this.log.warn("attempted connection restart, without signal options present"), new a1;
						i = (yield this.join(null != e ? e : this.url, this.token, this.signalOpts, void 0, !this.options.singlePeerConnection)).joinResponse
					} catch (e) {
						if (e instanceof aK && e.reason === eu.NotAllowed) throw new aQ("could not reconnect, token might be expired");
						throw new a1
					}
					if (this.shouldFailNext) throw this.shouldFailNext = !1, Error("simulated failure");
					if (this.client.setReconnected(), this.emit(ef.SignalRestarted, i), yield this.waitForPCReconnected(), this.client.currentState !== eI.CONNECTED) throw new a1("Signal connection got severed during reconnect");
					null == (t = this.regionStrategy) || t.resetAttempts(), this.emit(ef.Restarted)
				} catch (t) {
					let e = yield null == (i = this.regionStrategy) ? void 0 : i.getNextUrl();
					if (e) return void(yield this.restartConnection(e));
					throw null == (n = this.regionStrategy) || n.resetAttempts(), t
				}
			})
		}
		resumeConnection(e) {
			return rF(this, void 0, void 0, function*() {
				var t;
				let i;
				if (!this.url || !this.token) throw new aQ("could not reconnect, url or token not saved");
				if (!this.pcManager) throw new aQ("publisher and subscriber connections unset");
				this.log.info("resuming signal connection, attempt ".concat(this.reconnectAttempts)), this.emit(ef.Resuming);
				try {
					this.setupSignalClientCallbacks(), i = yield this.client.reconnect(this.url, this.token, this.participantSid, e)
				} catch (t) {
					let e = "";
					if (t instanceof Error && (e = t.message, this.log.error(t.message, {
							error: t
						})), t instanceof aK && t.reason === eu.NotAllowed) throw new aQ("could not reconnect, token might be expired");
					if (t instanceof aK && t.reason === eu.LeaveRequest) throw t;
					throw new a1(e)
				}
				if (this.emit(ef.SignalResumed), i) {
					let e = this.makeRTCConfiguration(i);
					this.pcManager.updateConfiguration(e), this.latestJoinResponse && (this.latestJoinResponse.serverInfo = i.serverInfo)
				} else this.log.warn("Did not receive reconnect response");
				if (this.shouldFailNext) throw this.shouldFailNext = !1, Error("simulated failure");
				if (yield this.pcManager.triggerIceRestart(), yield this.waitForPCReconnected(), this.client.currentState !== eI.CONNECTED) throw new a1("Signal connection got severed during reconnect");
				this.client.setReconnected(), (null == (t = this.reliableDC) ? void 0 : t.readyState) === "open" && null === this.reliableDC.id && this.createDataChannels(), (null == i ? void 0 : i.lastMessageSeq) && this.resendReliableMessagesForResume(i.lastMessageSeq).catch(e => {
					this.log.warn("failed to resend reliable messages after resume", Object.assign(Object.assign({}, this.logContext), {
						error: e
					}))
				}), this.emit(ef.Resumed)
			})
		}
		waitForPCInitialConnection(e, t) {
			return rF(this, void 0, void 0, function*() {
				if (!this.pcManager) throw new aQ("PC manager is closed");
				yield this.pcManager.ensurePCTransportConnection(t, e)
			})
		}
		waitForPCReconnected() {
			return rF(this, void 0, void 0, function*() {
				this.pcState = eL.Reconnecting, this.log.debug("waiting for peer connection to reconnect");
				try {
					if (yield sv(2e3), !this.pcManager) throw new aQ("PC manager is closed");
					yield this.pcManager.ensurePCTransportConnection(void 0, this.peerConnectionTimeout), this.pcState = eL.Connected
				} catch (e) {
					throw this.pcState = eL.Disconnected, aK.internal("could not establish PC connection, ".concat(e.message))
				}
			})
		}
		publishRpcAck(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = new iA({
					destinationIdentities: [e],
					kind: ix.RELIABLE,
					value: {
						case: "rpcAck",
						value: new iK({
							requestId: t
						})
					}
				});
				yield this.sendDataPacket(i, eN.RELIABLE)
			})
		}
		sendDataPacket(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i, n;
				if (yield this.ensurePublisherConnected(t), this.e2eeManager && this.e2eeManager.isDataChannelEncryptionEnabled) {
					let t = ou(e);
					if (t) {
						let i = yield this.e2eeManager.encryptData(t.toBinary());
						e.value = {
							case: "encryptedPacket",
							value: new iL({
								encryptedValue: i.payload,
								iv: i.iv,
								keyIndex: i.keyIndex
							})
						}
					}
				}
				t === eN.RELIABLE && (e.sequence = this.reliableDataSequence, this.reliableDataSequence += 1);
				let r = e.toBinary(),
					a = Math.min(null != (n = null == (i = this.pcManager) ? void 0 : i.getMaxPublisherMessageSize()) ? n : 64e3, 64e3);
				if (void 0 !== a && 0 !== a && r.byteLength > a) throw new aX("cannot publish data packet larger than ".concat(a, " bytes (got ").concat(r.byteLength, ")"));
				switch (t) {
					case eN.LOSSY:
					case eN.DATA_TRACK_LOSSY:
						return this.sendLossyBytes(r, t);
					case eN.RELIABLE: {
						if (this.attemptingReconnect) return void this.reliableMessageBuffer.push({
							data: r,
							sequence: e.sequence,
							sent: !1
						});
						let i = this.dataChannelForKind(t);
						if (i) {
							try {
								yield this.waitForBufferHeadroomWithLock(t)
							} catch (t) {
								if (this.isClosed) throw t;
								this.reliableMessageBuffer.push({
									data: r,
									sequence: e.sequence,
									sent: !1
								});
								return
							}
							if (this.attemptingReconnect) return void this.reliableMessageBuffer.push({
								data: r,
								sequence: e.sequence,
								sent: !1
							});
							this.reliableMessageBuffer.push({
								data: r,
								sequence: e.sequence,
								sent: !0
							}), i.send(r)
						}
						this.updateAndEmitDCBufferStatus(t)
					}
				}
			})
		}
		sendLossyBytes(e, t) {
			return rF(this, arguments, void 0, function(e, t) {
				var i = this;
				let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "drop";
				return function*() {
					yield i.ensurePublisherConnected(t);
					let r = i.dataChannelForKind(t);
					try {
						if (r) {
							switch (n) {
								case "wait":
									i.isBelowHighWaterMark(t) || (yield i.waitForBufferHeadroomWithLock(t));
									break;
								case "drop":
									if (!i.isBelowLowWaterMark(t)) {
										i.lossyDataDropCount += 1, i.lossyDataDropCount % 100 == 0 && i.log.warn("dropping lossy data channel messages, total dropped: ".concat(i.lossyDataDropCount));
										return
									}
							}
							if (t === eN.LOSSY && (i.lossyDataStatCurrentBytes += e.byteLength), i.attemptingReconnect) return;
							r.send(e)
						}
						i.updateAndEmitDCBufferStatus(t)
					} catch (e) {
						if (e instanceof TypeError) i.log.error(e);
						else throw e
					}
				}()
			})
		}
		resendReliableMessagesForResume(e) {
			return rF(this, void 0, void 0, function*() {
				yield this.ensurePublisherConnected(eN.RELIABLE);
				let t = this.dataChannelForKind(eN.RELIABLE);
				if (t) {
					this.reliableMessageBuffer.popToSequence(e);
					let i = yield this.getBufferHeadroomLock(eN.RELIABLE).lock();
					try {
						this.reliableMessageBuffer.markAllUnsent();
						for (let e = this.reliableMessageBuffer.getUnsent(); e.length > 0; e = this.reliableMessageBuffer.getUnsent())
							for (let i of e) yield this.waitForBufferHeadroomWithoutLock(eN.RELIABLE), t.send(i.data), this.reliableMessageBuffer.markSent(i)
					} finally {
						i()
					}
				}
				this.updateAndEmitDCBufferStatus(eN.RELIABLE)
			})
		}
		waiterAbortSignal(e) {
			let t = this.waiterAbortControllers.get(e);
			return t || (t = new AbortController, this.waiterAbortControllers.set(e, t)), t.signal
		}
		invalidateDataChannelWaiters(e) {
			for (let t of this.waiterAbortControllers.values()) t.abort(e);
			this.waiterAbortControllers.clear()
		}
		getBufferHeadroomLock(e) {
			let t = this.waitForBufferHeadroomLocks.get(e);
			return t || (t = new e0, this.waitForBufferHeadroomLocks.set(e, t)), t
		}
		waitForBufferHeadroomWithLock(e) {
			return rF(this, void 0, void 0, function*() {
				let t = yield this.getBufferHeadroomLock(e).lock();
				try {
					yield this.waitForBufferHeadroomWithoutLock(e)
				} finally {
					t()
				}
			})
		}
		waitForBufferHeadroomWithoutLock(e) {
			return rF(this, void 0, void 0, function*() {
				if (this.isClosed) throw new aQ("engine closed");
				if (this.isBelowHighWaterMark(e)) return;
				let t = this.dataChannelForKind(e);
				if (!t) throw new aQ("DataChannel not found, kind: ".concat(e));
				let i = this.waiterAbortSignal(e);
				yield new aN((n, r) => {
					let a = () => {
							c(), n()
						},
						s = () => {
							c(), r(new aQ("DataChannel ".concat(e, " closed while draining the buffer")))
						},
						o = () => {
							c(), r(new aQ("DataChannel ".concat(e, " was replaced or torn down while waiting for headroom")))
						},
						c = () => {
							t.removeEventListener("bufferedamountlow", a), t.removeEventListener("close", s), i.removeEventListener("abort", o)
						};
					i.aborted ? o() : (t.addEventListener("bufferedamountlow", a), t.addEventListener("close", s), i.addEventListener("abort", o))
				})
			})
		}
		ensureDataTransportConnected(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : this.subscriberPrimary;
				return function*() {
					var n;
					if (!t.pcManager) throw new aQ("PC manager is closed");
					let r = i ? t.pcManager.subscriber : t.pcManager.publisher,
						a = i ? "Subscriber" : "Publisher";
					if (!r) throw aK.internal("".concat(a, " connection not set"));
					let s = !1;
					i || t.dataChannelForKind(e, i) || (t.createDataChannels(), s = !0), s || i || t.pcManager.publisher.isICEConnected || "checking" === t.pcManager.publisher.getICEConnectionState() || (s = !0), s && t.negotiate().catch(e => {
						t.log.error(e)
					});
					let o = t.dataChannelForKind(e, i);
					if ((null == o ? void 0 : o.readyState) === "open") return;
					let c = new Date().getTime() + t.peerConnectionTimeout;
					for (; new Date().getTime() < c;) {
						if (r.isICEConnected && (null == (n = t.dataChannelForKind(e, i)) ? void 0 : n.readyState) === "open") return;
						yield sv(50)
					}
					throw aK.internal("could not establish ".concat(a, " connection, state: ").concat(r.getICEConnectionState()))
				}()
			})
		}
		ensurePublisherConnected(e) {
			return rF(this, void 0, void 0, function*() {
				this.publisherConnectionPromise || (this.publisherConnectionPromise = this.ensureDataTransportConnected(e, !1)), yield this.publisherConnectionPromise
			})
		}
		verifyTransport() {
			return !!this.pcManager && !![ex.CONNECTING, ex.CONNECTED].includes(this.pcManager.currentState) && !!this.client.ws && this.client.ws.readyState !== WebSocket.CLOSED
		}
		negotiate() {
			return rF(this, void 0, void 0, function*() {
				return new aN((e, t) => rF(this, void 0, void 0, function*() {
					if (!this.pcManager) return void t(new aY("PC manager is closed"));
					this.pcManager.requirePublisher(), 0 != this.pcManager.publisher.getTransceivers().length || this.lossyDC || this.reliableDC || this.dataTrackDC || this.createDataChannels();
					let i = new AbortController,
						n = () => {
							i.abort(), this.log.debug("engine disconnected while negotiation was ongoing"), e()
						};
					this.isClosed && t(new aY("cannot negotiate on closed engine")), this.on(ef.Closing, n), this.on(ef.Restarting, n), this.pcManager.publisher.off(oY, this.onRtpMapAvailable), this.pcManager.publisher.once(oY, this.onRtpMapAvailable);
					try {
						yield this.pcManager.negotiate(i), e()
					} catch (n) {
						if (i.signal.aborted) return void e();
						n instanceof aY && (this.fullReconnectOnNext = !0), this.handleDisconnect("negotiation", im.RR_UNKNOWN), n instanceof Error ? t(n) : t(Error(String(n)))
					} finally {
						this.off(ef.Closing, n), this.off(ef.Restarting, n)
					}
				}))
			})
		}
		dataChannelForKind(e, t) {
			switch (e) {
				case eN.RELIABLE:
					if (!t) return this.reliableDC;
					return this.reliableDCSub;
				case eN.LOSSY:
					if (!t) return this.lossyDC;
					return this.lossyDCSub;
				case eN.DATA_TRACK_LOSSY:
					if (!t) return this.dataTrackDC;
					return this.dataTrackDCSub
			}
		}
		sendSyncState(e, t, i) {
			var n, r, a, s;
			let o;
			if (!this.pcManager) return void this.log.warn("sync state cannot be sent without peer connection setup");
			let c = this.pcManager.publisher.getLocalDescription(),
				l = this.pcManager.publisher.getRemoteDescription(),
				d = null == (n = this.pcManager.subscriber) ? void 0 : n.getRemoteDescription(),
				u = null == (r = this.pcManager.subscriber) ? void 0 : r.getLocalDescription(),
				h = null == (s = null == (a = this.signalOpts) ? void 0 : a.autoSubscribe) || s,
				p = [],
				m = [];
			e.forEach(e => {
				e.isDesired !== h && p.push(e.trackSid), e.isEnabled || m.push(e.trackSid)
			}), this.client.sendSyncState(new rl({
				answer: "publisher-only" === this.pcManager.mode ? l ? oq({
					sdp: l.sdp,
					type: l.type
				}) : void 0 : u ? oq({
					sdp: u.sdp,
					type: u.type
				}) : void 0,
				offer: "publisher-only" === this.pcManager.mode ? c ? oq({
					sdp: c.sdp,
					type: c.type
				}) : void 0 : d ? oq({
					sdp: d.sdp,
					type: d.type
				}) : void 0,
				subscription: new nG({
					trackSids: p,
					subscribe: !h,
					participantTracks: []
				}),
				publishTracks: (o = [], t.forEach(e => {
					void 0 !== e.track && o.push(new nW({
						cid: e.track.mediaStreamID,
						track: e.trackInfo
					}))
				}), o),
				dataChannels: this.dataChannelsInfo(),
				trackSidsDisabled: m,
				datachannelReceiveStates: this.reliableReceivedState.map((e, t) => new rd({
					publisherSid: t,
					lastSeq: e
				})),
				publishDataTracks: i.map(e => {
					let t;
					return new nL({
						info: new iD({
							sid: (t = e).sid,
							pubHandle: t.pubHandle,
							name: t.name,
							encryption: t.usesE2ee ? iR.GCM : iR.NONE
						})
					})
				})
			}))
		}
		failNext() {
			this.shouldFailNext = !0
		}
		failNextV1Path() {
			this.shouldFailOnV1Path = !0
		}
		dataChannelsInfo() {
			let e = [],
				t = (t, i) => {
					(null == t ? void 0 : t.id) !== void 0 && null !== t.id && e.push(new ru({
						label: t.label,
						id: t.id,
						target: i
					}))
				};
			return t(this.dataChannelForKind(eN.LOSSY), nP.PUBLISHER), t(this.dataChannelForKind(eN.RELIABLE), nP.PUBLISHER), t(this.dataChannelForKind(eN.LOSSY, !0), nP.SUBSCRIBER), t(this.dataChannelForKind(eN.RELIABLE, !0), nP.SUBSCRIBER), e
		}
		clearReconnectTimeout() {
			this.reconnectTimeout && a2.clearTimeout(this.reconnectTimeout)
		}
		clearPendingReconnect() {
			this.clearReconnectTimeout(), this.reconnectAttempts = 0
		}
		registerOnLineListener() {
			s_() && (window.addEventListener("online", this.handleBrowserOnLine), window.addEventListener("offline", this.handleBrowserOffline))
		}
		deregisterOnLineListener() {
			s_() && (window.removeEventListener("online", this.handleBrowserOnLine), window.removeEventListener("offline", this.handleBrowserOffline))
		}
		getTrackIdForReceiver(e) {
			var t;
			let i = null == (t = this.pcManager) ? void 0 : t.getMidForReceiver(e);
			if (i) {
				let e = Object.entries(this.midToTrackId).find(e => tg(e, 1)[0] === i);
				if (e) return e[1]
			}
		}
	}

	function cw(e, t) {
		let i = e.participantIdentity ? e.participantIdentity : t.participantIdentity;
		e.participantIdentity = i, t.participantIdentity = i;
		let n = 0 !== e.destinationIdentities.length ? e.destinationIdentities : t.destinationIdentities;
		e.destinationIdentities = n, t.destinationIdentities = n
	}
	let cE = rA(eo.Region);
	class cR {
		static fetchRegionSettings(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				let n = yield cR.fetchLock.lock();
				try {
					var r;
					let n = yield fetch("".concat((r = e, "".concat(r.protocol.replace("ws", "http"), "//").concat(r.host, "/settings")), "/regions"), {
						headers: {
							authorization: "Bearer ".concat(t)
						},
						signal: i
					});
					if (n.ok) {
						let e = function(e) {
							var t;
							let i = e.get("Cache-Control");
							if (i) {
								let e = null == (t = i.match(/(?:^|[,\s])max-age=(\d+)/)) ? void 0 : t[1];
								if (e) return parseInt(e, 10)
							}
						}(n.headers);
						return {
							regionSettings: yield n.json(),
							updatedAtInMs: Date.now(),
							maxAgeInMs: e ? 1e3 * e : 5e3
						}
					}
					if (401 === n.status) throw aK.notAllowed("Could not fetch region settings: ".concat(n.statusText), n.status);
					throw aK.internal("Could not fetch region settings: ".concat(n.statusText))
				} catch (e) {
					if (e instanceof aK) throw e;
					if (null == i ? void 0 : i.aborted) throw aK.cancelled("Region fetching was aborted");
					throw aK.serverUnreachable("Could not fetch region settings, ".concat(e instanceof Error ? "".concat(e.name, ": ").concat(e.message) : e))
				} finally {
					n()
				}
			})
		}
		static scheduleRefetch(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				clearTimeout(cR.settingsTimeouts.get(e.hostname)), cR.settingsTimeouts.set(e.hostname, setTimeout(() => rF(this, void 0, void 0, function*() {
					try {
						let i = yield cR.fetchRegionSettings(e, t);
						cR.updateCachedRegionSettings(e, t, i)
					} catch (n) {
						if (n instanceof aK && n.reason === eu.NotAllowed) return void cE.debug("token is not valid, cancelling auto region refresh");
						cE.debug("auto refetching of region settings failed", {
							error: n
						}), cR.scheduleRefetch(e, t, i)
					}
				}), i))
			})
		}
		static updateCachedRegionSettings(e, t, i) {
			cR.cache.set(e.hostname, i), cR.scheduleRefetch(e, t, i.maxAgeInMs)
		}
		static stopRefetch(e) {
			let t = cR.settingsTimeouts.get(e);
			t && (clearTimeout(t), cR.settingsTimeouts.delete(e))
		}
		static scheduleCleanup(e) {
			let t = cR.connectionTrackers.get(e);
			t && (t.cleanupTimeout && clearTimeout(t.cleanupTimeout), t.cleanupTimeout = setTimeout(() => {
				let t = cR.connectionTrackers.get(e);
				t && 0 === t.connectionCount && (cE.debug("stopping region refetch after disconnect delay", {
					hostname: e
				}), cR.stopRefetch(e)), t && (t.cleanupTimeout = void 0)
			}, 3e4))
		}
		static cancelCleanup(e) {
			let t = cR.connectionTrackers.get(e);
			(null == t ? void 0 : t.cleanupTimeout) && (clearTimeout(t.cleanupTimeout), t.cleanupTimeout = void 0)
		}
		notifyConnected() {
			let e = this.serverUrl.hostname,
				t = cR.connectionTrackers.get(e);
			t || (t = {
				connectionCount: 0
			}, cR.connectionTrackers.set(e, t)), t.connectionCount++, cR.cancelCleanup(e)
		}
		notifyDisconnected() {
			let e = this.serverUrl.hostname,
				t = cR.connectionTrackers.get(e);
			t && (t.connectionCount = Math.max(0, t.connectionCount - 1), 0 === t.connectionCount && cR.scheduleCleanup(e))
		}
		constructor(e, t) {
			this.attemptedRegions = [], this.serverUrl = new URL(e), this.token = t
		}
		updateToken(e) {
			var t;
			this.token = e;
			let i = this.getServerUrl(),
				n = cR.cache.get(i.hostname);
			cR.scheduleRefetch(this.serverUrl, this.token, null != (t = null == n ? void 0 : n.maxAgeInMs) ? t : 5e3)
		}
		isCloud() {
			return sA(this.serverUrl)
		}
		getServerUrl() {
			return this.serverUrl
		}
		fetchRegionSettings(e) {
			return rF(this, void 0, void 0, function*() {
				return cR.fetchRegionSettings(this.serverUrl, this.token, e)
			})
		}
		getNextBestRegionUrl(e) {
			return rF(this, void 0, void 0, function*() {
				if (!this.isCloud()) throw Error("region availability is only supported for LiveKit Cloud domains");
				let t = cR.cache.get(this.serverUrl.hostname);
				(!t || Date.now() - t.updatedAtInMs > t.maxAgeInMs) && (t = yield this.fetchRegionSettings(e), cR.updateCachedRegionSettings(this.serverUrl, this.token, t));
				let i = t.regionSettings.regions.filter(e => !this.attemptedRegions.find(t => t.url === e.url));
				if (!(i.length > 0)) return null;
				{
					let e = i[0];
					return this.attemptedRegions.push(e), cE.info("switching to region: ".concat(e.region), {
						region: e.region
					}), e.url
				}
			})
		}
		resetAttempts() {
			this.attemptedRegions = []
		}
		setServerReportedRegions(e) {
			cR.updateCachedRegionSettings(this.serverUrl, this.token, e)
		}
	}
	cR.cache = new Map, cR.settingsTimeouts = new Map, cR.connectionTrackers = new Map, cR.fetchLock = new e0;
	class cP {
		get info() {
			return this._info
		}
		validateBytesReceived() {
			let e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
			if ("number" == typeof this.totalByteSize && 0 !== this.totalByteSize) {
				if (e && this.bytesReceived < this.totalByteSize) throw new a0("Not enough chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, only received ").concat(this.bytesReceived, " bytes"), eh.Incomplete);
				else if (this.bytesReceived > this.totalByteSize) throw new a0("Extra chunk(s) received - expected ".concat(this.totalByteSize, " bytes of data total, received ").concat(this.bytesReceived, " bytes"), eh.LengthExceeded)
			}
		}
		constructor(e, t, i) {
			this.reader = t, this.totalByteSize = i, this._info = e, this.bytesReceived = 0
		}
	}
	class cI extends cP {
		handleChunkReceived(e) {
			var t;
			this.bytesReceived += e.content.byteLength, this.validateBytesReceived();
			let i = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
			null == (t = this.onProgress) || t.call(this, i)
		} [Symbol.asyncIterator]() {
			let e = this.reader.getReader();
			e.closed.catch(() => {});
			let t = () => {
				e.releaseLock(), this.signal = void 0
			};
			return {
				next: () => rF(this, void 0, void 0, function*() {
					try {
						let t = this.signal;
						if (null == t ? void 0 : t.aborted) throw t.reason;
						let i = yield new Promise((i, n) => {
							if (t) {
								let r = () => n(t.reason);
								t.addEventListener("abort", r, {
									once: !0
								}), e.read().then(i, n).finally(() => {
									t.removeEventListener("abort", r)
								})
							} else e.read().then(i, n)
						});
						if (i.done) return this.validateBytesReceived(!0), {
							done: !0,
							value: void 0
						};
						return this.handleChunkReceived(i.value), {
							done: !1,
							value: i.value.content
						}
					} catch (e) {
						throw t(), e
					}
				}),
				return () {
					return rF(this, void 0, void 0, function*() {
						return t(), {
							done: !0,
							value: void 0
						}
					})
				}
			}
		}
		withAbortSignal(e) {
			return this.signal = e, this
		}
		readAll() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				return function*() {
					var i, n, r, a;
					let s = new Set,
						o = t.signal ? e.withAbortSignal(t.signal) : e;
					try {
						for (var c, l = !0, d = rj(o); !(i = (c = yield d.next()).done); l = !0) a = c.value, l = !1, s.add(a)
					} catch (e) {
						n = {
							error: e
						}
					} finally {
						try {
							!l && !i && (r = d.return) && (yield r.call(d))
						} finally {
							if (n) throw n.error
						}
					}
					return Array.from(s)
				}()
			})
		}
	}
	class cD extends cP {
		constructor(e, t, i) {
			super(e, t, i), this.receivedChunks = new Map
		}
		handleChunkReceived(e) {
			var t;
			let i = sZ(e.chunkIndex),
				n = this.receivedChunks.get(i);
			if (n && n.version > e.version) return;
			this.receivedChunks.set(i, e), this.bytesReceived += e.content.byteLength, this.validateBytesReceived();
			let r = this.totalByteSize ? this.bytesReceived / this.totalByteSize : void 0;
			null == (t = this.onProgress) || t.call(this, r)
		} [Symbol.asyncIterator]() {
			let e = this.reader.getReader();
			e.closed.catch(() => {});
			let t = new TextDecoder("utf-8", {
					fatal: !0
				}),
				i = this.signal,
				n = () => {
					e.releaseLock(), this.signal = void 0
				};
			return {
				next: () => rF(this, void 0, void 0, function*() {
					try {
						if (null == i ? void 0 : i.aborted) throw i.reason;
						let n = yield new Promise((t, n) => {
							if (i) {
								let r = () => n(i.reason);
								i.addEventListener("abort", r, {
									once: !0
								}), e.read().then(t, n).finally(() => {
									i.removeEventListener("abort", r)
								})
							} else e.read().then(t, n)
						});
						if (n.done) return this.validateBytesReceived(!0), {
							done: !0,
							value: void 0
						};
						{
							let e;
							this.handleChunkReceived(n.value);
							try {
								e = t.decode(n.value.content)
							} catch (e) {
								throw new a0("Cannot decode datastream chunk ".concat(n.value.chunkIndex, " as text: ").concat(e), eh.DecodeFailed)
							}
							return {
								done: !1,
								value: e
							}
						}
					} catch (e) {
						throw n(), e
					}
				}),
				return () {
					return rF(this, void 0, void 0, function*() {
						return n(), {
							done: !0,
							value: void 0
						}
					})
				}
			}
		}
		withAbortSignal(e) {
			return this.signal = e, this
		}
		readAll() {
			return rF(this, arguments, void 0, function() {
				var e = this;
				let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				return function*() {
					var i, n, r, a;
					let s = "",
						o = t.signal ? e.withAbortSignal(t.signal) : e;
					try {
						for (var c, l = !0, d = rj(o); !(i = (c = yield d.next()).done); l = !0) a = c.value, l = !1, s += a
					} catch (e) {
						n = {
							error: e
						}
					} finally {
						try {
							!l && !i && (r = d.return) && (yield r.call(d))
						} finally {
							if (n) throw n.error
						}
					}
					return s
				}()
			})
		}
	}
	class cM {
		constructor() {
			this.log = r_, this.byteStreamControllers = new Map, this.textStreamControllers = new Map, this.byteStreamHandlers = new Map, this.textStreamHandlers = new Map, this.isConnected = !1, this.bufferedPackets = []
		}
		setConnected(e) {
			this.isConnected = e, e && this.flushBufferedPackets()
		}
		flushBufferedPackets() {
			let e = this.bufferedPackets;
			for (let t of (this.bufferedPackets = [], e)) {
				let e = t.packet,
					i = t.encryptionType;
				this.handleDataStreamPacket(e, i)
			}
		}
		registerTextStreamHandler(e, t) {
			if (this.textStreamHandlers.has(e)) throw new a0('A text stream handler for topic "'.concat(e, '" has already been set.'), eh.HandlerAlreadyRegistered);
			this.textStreamHandlers.set(e, t)
		}
		unregisterTextStreamHandler(e) {
			this.textStreamHandlers.delete(e)
		}
		registerByteStreamHandler(e, t) {
			if (this.byteStreamHandlers.has(e)) throw new a0('A byte stream handler for topic "'.concat(e, '" has already been set.'), eh.HandlerAlreadyRegistered);
			this.byteStreamHandlers.set(e, t)
		}
		unregisterByteStreamHandler(e) {
			this.byteStreamHandlers.delete(e)
		}
		clearControllers() {
			this.byteStreamControllers.clear(), this.textStreamControllers.clear(), this.bufferedPackets = []
		}
		validateParticipantHasNoActiveDataStreams(e) {
			let t = Array.from(this.textStreamControllers.entries()).filter(t => t[1].sendingParticipantIdentity === e),
				i = Array.from(this.byteStreamControllers.entries()).filter(t => t[1].sendingParticipantIdentity === e);
			if (t.length > 0 || i.length > 0) {
				let a = new a0("Participant ".concat(e, " unexpectedly disconnected in the middle of sending data"), eh.AbnormalEnd);
				for (let e of i) {
					var n = tg(e, 2);
					let t = n[0];
					n[1].controller.error(a), this.byteStreamControllers.delete(t)
				}
				for (let e of t) {
					var r = tg(e, 2);
					let t = r[0];
					r[1].controller.error(a), this.textStreamControllers.delete(t)
				}
			}
		}
		handleDataStreamPacket(e, t) {
			if (!this.isConnected) return void this.bufferedPackets.push({
				packet: e,
				encryptionType: t
			});
			switch (e.value.case) {
				case "streamHeader":
					return this.handleStreamHeader(e.value.value, e.participantIdentity, t);
				case "streamChunk":
					return this.handleStreamChunk(e.value.value, t);
				case "streamTrailer":
					return this.handleStreamTrailer(e.value.value, t);
				default:
					throw Error('DataPacket of value "'.concat(e.value.case, '" is not data stream related!'))
			}
		}
		handleStreamHeader(e, t, i) {
			var n;
			if ("byteHeader" === e.contentHeader.case) {
				let r, a = this.byteStreamHandlers.get(e.topic);
				if (!a) return void this.log.debug("ignoring incoming byte stream due to no handler for topic", e.topic);
				let s = {
						id: e.streamId,
						name: null != (n = e.contentHeader.value.name) ? n : "unknown",
						mimeType: e.mimeType,
						size: e.totalLength ? Number(e.totalLength) : void 0,
						topic: e.topic,
						timestamp: sZ(e.timestamp),
						attributes: e.attributes,
						encryptionType: i
					},
					o = new ReadableStream({
						start: i => {
							if (r = i, this.textStreamControllers.has(e.streamId)) throw new a0("A data stream read is already in progress for a stream with id ".concat(e.streamId, "."), eh.AlreadyOpened);
							this.byteStreamControllers.set(e.streamId, {
								info: s,
								controller: r,
								startTime: Date.now(),
								sendingParticipantIdentity: t
							})
						}
					});
				a(new cI(s, o, sZ(e.totalLength)), {
					identity: t
				})
			} else if ("textHeader" === e.contentHeader.case) {
				let n, r = this.textStreamHandlers.get(e.topic);
				if (!r) return void this.log.debug("ignoring incoming text stream due to no handler for topic", e.topic);
				let a = {
						id: e.streamId,
						mimeType: e.mimeType,
						size: e.totalLength ? Number(e.totalLength) : void 0,
						topic: e.topic,
						timestamp: Number(e.timestamp),
						attributes: e.attributes,
						encryptionType: i,
						attachedStreamIds: e.contentHeader.value.attachedStreamIds
					},
					s = new ReadableStream({
						start: i => {
							if (n = i, this.textStreamControllers.has(e.streamId)) throw new a0("A data stream read is already in progress for a stream with id ".concat(e.streamId, "."), eh.AlreadyOpened);
							this.textStreamControllers.set(e.streamId, {
								info: a,
								controller: n,
								startTime: Date.now(),
								sendingParticipantIdentity: t
							})
						}
					});
				r(new cD(a, s, sZ(e.totalLength)), {
					identity: t
				})
			}
		}
		handleStreamChunk(e, t) {
			let i = this.byteStreamControllers.get(e.streamId);
			i && (i.info.encryptionType !== t ? (i.controller.error(new a0("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(i.info.encryptionType), eh.EncryptionTypeMismatch)), this.byteStreamControllers.delete(e.streamId)) : e.content.length > 0 && i.controller.enqueue(e));
			let n = this.textStreamControllers.get(e.streamId);
			n && (n.info.encryptionType !== t ? (n.controller.error(new a0("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(n.info.encryptionType), eh.EncryptionTypeMismatch)), this.textStreamControllers.delete(e.streamId)) : e.content.length > 0 && n.controller.enqueue(e))
		}
		handleStreamTrailer(e, t) {
			let i = this.textStreamControllers.get(e.streamId);
			i && (i.info.encryptionType !== t ? i.controller.error(new a0("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(i.info.encryptionType), eh.EncryptionTypeMismatch)) : (i.info.attributes = Object.assign(Object.assign({}, i.info.attributes), e.attributes), i.controller.close(), this.textStreamControllers.delete(e.streamId)));
			let n = this.byteStreamControllers.get(e.streamId);
			n && (n.info.encryptionType !== t ? n.controller.error(new a0("Encryption type mismatch for stream ".concat(e.streamId, ". Expected ").concat(t, ", got ").concat(n.info.encryptionType), eh.EncryptionTypeMismatch)) : (n.info.attributes = Object.assign(Object.assign({}, n.info.attributes), e.attributes), n.controller.close()), this.byteStreamControllers.delete(e.streamId))
		}
	}
	class c_ {
		constructor(e, t, i) {
			this.writableStream = e, this.defaultWriter = e.getWriter(), this.onClose = i, this.info = t
		}
		write(e) {
			return this.defaultWriter.write(e)
		}
		close() {
			return rF(this, void 0, void 0, function*() {
				var e;
				yield this.defaultWriter.close(), this.defaultWriter.releaseLock(), null == (e = this.onClose) || e.call(this)
			})
		}
	}
	class cO extends c_ {}
	class cA extends c_ {}
	class cx {
		constructor(e, t) {
			this.engine = e, this.log = t
		}
		setupEngine(e) {
			this.engine = e
		}
		sendText(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i;
				let n = crypto.randomUUID(),
					r = new TextEncoder().encode(e).byteLength,
					a = null == (i = null == t ? void 0 : t.attachments) ? void 0 : i.map(() => crypto.randomUUID()),
					s = Array(a ? a.length + 1 : 1).fill(0),
					o = (e, i) => {
						var n;
						s[i] = e;
						let r = s.reduce((e, t) => e + t, 0);
						null == (n = null == t ? void 0 : t.onProgress) || n.call(t, r)
					},
					c = yield this.streamText({
						streamId: n,
						totalSize: r,
						destinationIdentities: null == t ? void 0 : t.destinationIdentities,
						topic: null == t ? void 0 : t.topic,
						attachedStreamIds: a,
						attributes: null == t ? void 0 : t.attributes
					});
				return yield c.write(e), o(1, 0), yield c.close(), (null == t ? void 0 : t.attachments) && a && (yield Promise.all(t.attachments.map((e, i) => rF(this, void 0, void 0, function*() {
					return this._sendFile(a[i], e, {
						topic: t.topic,
						mimeType: e.type,
						onProgress: e => {
							o(e, i + 1)
						}
					})
				})))), c.info
			})
		}
		streamText(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n;
				let r = null != (t = null == e ? void 0 : e.streamId) ? t : crypto.randomUUID(),
					a = {
						id: r,
						mimeType: "text/plain",
						timestamp: Date.now(),
						topic: null != (i = null == e ? void 0 : e.topic) ? i : "",
						size: null == e ? void 0 : e.totalSize,
						attributes: null == e ? void 0 : e.attributes,
						encryptionType: (null == (n = this.engine.e2eeManager) ? void 0 : n.isDataChannelEncryptionEnabled) ? iR.GCM : iR.NONE,
						attachedStreamIds: null == e ? void 0 : e.attachedStreamIds
					},
					s = new i8({
						streamId: r,
						mimeType: a.mimeType,
						topic: a.topic,
						timestamp: s$(a.timestamp),
						totalLength: s$(a.size),
						attributes: a.attributes,
						contentHeader: {
							case: "textHeader",
							value: new i9({
								version: null == e ? void 0 : e.version,
								attachedStreamIds: a.attachedStreamIds,
								replyToStreamId: null == e ? void 0 : e.replyToStreamId,
								operationType: (null == e ? void 0 : e.type) === "update" ? i4.UPDATE : i4.CREATE
							})
						}
					}),
					o = null == e ? void 0 : e.destinationIdentities,
					c = new iA({
						destinationIdentities: o,
						value: {
							case: "streamHeader",
							value: s
						}
					});
				yield this.engine.sendDataPacket(c, eN.RELIABLE);
				let l = 0,
					d = this.engine,
					u = new WritableStream({
						write(e) {
							return rF(this, void 0, void 0, function*() {
								for (let t of function(e) {
										let t = [],
											i = new TextEncoder().encode(e);
										for (; i.length > 15e3;) {
											let e = 15e3;
											for (; e > 0;) {
												let t = i[e];
												if (void 0 !== t && (192 & t) != 128) break;
												e--
											}
											t.push(i.slice(0, e)), i = i.slice(e)
										}
										return i.length > 0 && t.push(i), t
									}(e)) {
									let e = new iA({
										destinationIdentities: o,
										value: {
											case: "streamChunk",
											value: new i5({
												content: t,
												streamId: r,
												chunkIndex: s$(l)
											})
										}
									});
									yield d.sendDataPacket(e, eN.RELIABLE), l += 1
								}
							})
						},
						close() {
							return rF(this, void 0, void 0, function*() {
								let e = new iA({
									destinationIdentities: o,
									value: {
										case: "streamTrailer",
										value: new i7({
											streamId: r
										})
									}
								});
								yield d.sendDataPacket(e, eN.RELIABLE)
							})
						},
						abort(e) {
							console.log("Sink error:", e)
						}
					}),
					h = () => rF(this, void 0, void 0, function*() {
						yield p.close()
					});
				d.once(ef.Closing, h);
				let p = new cO(u, a, () => this.engine.off(ef.Closing, h));
				return p
			})
		}
		sendFile(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = crypto.randomUUID();
				return yield this._sendFile(i, e, t), {
					id: i
				}
			})
		}
		_sendFile(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				var n;
				let r = yield this.streamBytes({
					streamId: e,
					totalSize: t.size,
					name: t.name,
					mimeType: null != (n = null == i ? void 0 : i.mimeType) ? n : t.type,
					topic: null == i ? void 0 : i.topic,
					destinationIdentities: null == i ? void 0 : i.destinationIdentities
				}), a = t.stream().getReader();
				for (;;) {
					let e = yield a.read(), t = e.done, i = e.value;
					if (t) break;
					yield r.write(i)
				}
				return yield r.close(), r.info
			})
		}
		streamBytes(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n, r, a;
				let s = null != (t = null == e ? void 0 : e.streamId) ? t : crypto.randomUUID(),
					o = null == e ? void 0 : e.destinationIdentities,
					c = {
						id: s,
						mimeType: null != (i = null == e ? void 0 : e.mimeType) ? i : "application/octet-stream",
						topic: null != (n = null == e ? void 0 : e.topic) ? n : "",
						timestamp: Date.now(),
						attributes: null == e ? void 0 : e.attributes,
						size: null == e ? void 0 : e.totalSize,
						name: null != (r = null == e ? void 0 : e.name) ? r : "unknown",
						encryptionType: (null == (a = this.engine.e2eeManager) ? void 0 : a.isDataChannelEncryptionEnabled) ? iR.GCM : iR.NONE
					},
					l = new iA({
						destinationIdentities: o,
						value: {
							case: "streamHeader",
							value: new i8({
								totalLength: s$(c.size),
								mimeType: c.mimeType,
								streamId: s,
								topic: c.topic,
								timestamp: s$(Date.now()),
								attributes: c.attributes,
								contentHeader: {
									case: "byteHeader",
									value: new i6({
										name: c.name
									})
								}
							})
						}
					});
				yield this.engine.sendDataPacket(l, eN.RELIABLE);
				let d = 0,
					u = new e0,
					h = this.engine,
					p = this.log;
				return new cA(new WritableStream({
					write(e) {
						return rF(this, void 0, void 0, function*() {
							let t = yield u.lock(), i = 0;
							try {
								for (; i < e.byteLength;) {
									let t = e.slice(i, i + 15e3),
										n = new iA({
											destinationIdentities: o,
											value: {
												case: "streamChunk",
												value: new i5({
													content: t,
													streamId: s,
													chunkIndex: s$(d)
												})
											}
										});
									yield h.sendDataPacket(n, eN.RELIABLE), d += 1, i += t.byteLength
								}
							} finally {
								t()
							}
						})
					},
					close() {
						return rF(this, void 0, void 0, function*() {
							let e = new iA({
								destinationIdentities: o,
								value: {
									case: "streamTrailer",
									value: new i7({
										streamId: s
									})
								}
							});
							yield h.sendDataPacket(e, eN.RELIABLE)
						})
					},
					abort(e) {
						p.error("Sink error:", e)
					}
				}), c)
			})
		}
	}

	function cL(e) {
		if (0 === e.length) return new AbortController().signal;
		if (1 === e.length) return e[0];
		for (let t of e)
			if (t.aborted) return t;
		let t = new AbortController,
			i = Array(e.length);
		return e.forEach((e, n) => {
			let r = () => {
				for (let n of (t.abort(e.reason), i)) n()
			};
			e.addEventListener("abort", r), i[n] = () => e.removeEventListener("abort", r)
		}), t.signal
	}

	function cN(e) {
		let t = new AbortController;
		return setTimeout(() => {
			t.abort(new DOMException("signal timed out after ".concat(e, " ms"), "TimeoutError"))
		}, e), t.signal
	}(B = eU || (eU = {}))[B.TooShort = 0] = "TooShort", B[B.HeaderOverrun = 1] = "HeaderOverrun", B[B.MissingExtWords = 2] = "MissingExtWords", B[B.UnsupportedVersion = 3] = "UnsupportedVersion", B[B.InvalidHandle = 4] = "InvalidHandle", B[B.MalformedExt = 5] = "MalformedExt";
	class cU extends aW {
		constructor(e, t, i) {
			super(19, e, i), this.name = "DataTrackDeserializeError", this.reason = t, this.reasonName = eU[t]
		}
		static tooShort() {
			return new cU("Too short to contain a valid header", eU.TooShort)
		}
		static headerOverrun() {
			return new cU("Header exceeds total packet length", eU.HeaderOverrun)
		}
		static missingExtWords() {
			return new cU("Extension word indicator is missing", eU.MissingExtWords)
		}
		static unsupportedVersion(e) {
			return new cU("Unsupported version ".concat(e), eU.UnsupportedVersion)
		}
		static invalidHandle(e) {
			return new cU("invalid track handle: ".concat(e.message), eU.InvalidHandle, {
				cause: e
			})
		}
		static malformedExt(e) {
			return new cU("Extension with tag ".concat(e, " is malformed"), eU.MalformedExt)
		}
	}(j = eF || (eF = {}))[j.TooSmallForHeader = 0] = "TooSmallForHeader", j[j.TooSmallForPayload = 1] = "TooSmallForPayload";
	class cF extends aW {
		constructor(e, t, i) {
			super(19, e, i), this.name = "DataTrackSerializeError", this.reason = t, this.reasonName = eF[t]
		}
		static tooSmallForHeader() {
			return new cF("Buffer cannot fit header", eF.TooSmallForHeader)
		}
		static tooSmallForPayload() {
			return new cF("Buffer cannot fit payload", eF.TooSmallForPayload)
		}
	}
	class cB {
		toBinary() {
			let e = this.toBinaryLengthBytes(),
				t = new ArrayBuffer(e),
				i = new DataView(t),
				n = this.toBinaryInto(i);
			if (e !== n) throw Error("".concat(this.constructor.name, ".toBinary: written bytes (").concat(n, " bytes) not equal to allocated array buffer length (").concat(e, " bytes)."));
			return new Uint8Array(t)
		}
	}(q = eB || (eB = {}))[q.UserTimestamp = 2] = "UserTimestamp", q[q.E2ee = 1] = "E2ee";
	class cj extends cB {}
	class cq extends cj {
		constructor(e) {
			super(), this.timestamp = e
		}
		toBinaryLengthBytes() {
			return 2 + cq.lengthBytes
		}
		toBinaryInto(e) {
			let t = 0;
			e.setUint8(t, cq.tag), t += 1, e.setUint8(t, cq.lengthBytes), t += 1, e.setBigUint64(t, this.timestamp), t += 8;
			let i = this.toBinaryLengthBytes();
			if (t !== i) throw Error("DataTrackUserTimestampExtension.toBinaryInto: Wrote ".concat(t, " bytes but expected length was ").concat(i, " bytes"));
			return t
		}
		toJSON() {
			return {
				tag: cq.tag,
				lengthBytes: cq.lengthBytes,
				timestamp: this.timestamp
			}
		}
	}
	cq.tag = eB.UserTimestamp, cq.lengthBytes = 8;
	class cV extends cj {
		constructor(e, t) {
			super(), this.keyIndex = e, this.iv = t
		}
		toBinaryLengthBytes() {
			return 2 + cV.lengthBytes
		}
		toBinaryInto(e) {
			let t = 0;
			e.setUint8(t, cV.tag), t += 1, e.setUint8(t, cV.lengthBytes), t += 1, e.setUint8(t, this.keyIndex), t += 1;
			for (let i = 0; i < this.iv.length; i += 1) e.setUint8(t, this.iv[i]), t += 1;
			let i = this.toBinaryLengthBytes();
			if (t !== i) throw Error("DataTrackE2eeExtension.toBinaryInto: Wrote ".concat(t, " bytes but expected length was ").concat(i, " bytes"));
			return t
		}
		toJSON() {
			return {
				tag: cV.tag,
				lengthBytes: cV.lengthBytes,
				keyIndex: this.keyIndex,
				iv: this.iv
			}
		}
	}
	cV.tag = eB.E2ee, cV.lengthBytes = 13;
	class cH extends cB {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			super(), this.userTimestamp = e.userTimestamp, this.e2ee = e.e2ee
		}
		toBinaryLengthBytes() {
			let e = 0;
			return this.userTimestamp && (e += this.userTimestamp.toBinaryLengthBytes()), this.e2ee && (e += this.e2ee.toBinaryLengthBytes()), e
		}
		toBinaryInto(e) {
			let t = 0;
			if (this.e2ee && (t += this.e2ee.toBinaryInto(e)), this.userTimestamp) {
				let i = this.userTimestamp.toBinaryInto(new DataView(e.buffer, e.byteOffset + t));
				t += i
			}
			let i = this.toBinaryLengthBytes();
			if (t !== i) throw Error("DataTrackExtensions.toBinaryInto: Wrote ".concat(t, " bytes but expected length was ").concat(i, " bytes"));
			return t
		}
		static fromBinary(e) {
			let t, i, n = o_(e),
				r = 0;
			for (; n.byteLength - r >= 2;) {
				let e = n.getUint8(r);
				r += 1;
				let a = n.getUint8(r);
				if (r += 1, 0 !== e) switch (e) {
					case eB.UserTimestamp:
						if (n.byteLength - r < cq.lengthBytes) throw cU.malformedExt(e);
						t = new cq(n.getBigUint64(r)), r += a;
						break;
					case eB.E2ee:
						if (n.byteLength - r < cV.lengthBytes) throw cU.malformedExt(e);
						let s = n.getUint8(r),
							o = new Uint8Array(12);
						for (let e = 0; e < o.length; e += 1) {
							let t = r;
							t += 1, t += +e, o[e] = n.getUint8(t)
						}
						i = new cV(s, o), r += a;
						break;
					default:
						if (n.byteLength - r < a) throw cU.malformedExt(e);
						r += a
				}
			}
			return [new cH({
				userTimestamp: t,
				e2ee: i
			}), n.byteLength]
		}
		toJSON() {
			var e, t, i, n;
			return {
				userTimestamp: null != (t = null == (e = this.userTimestamp) ? void 0 : e.toJSON()) ? t : null,
				e2ee: null != (n = null == (i = this.e2ee) ? void 0 : i.toJSON()) ? n : null
			}
		}
	}
	let cW = {
			from: e => ({
				payload: e.payload,
				extensions: new cH({
					userTimestamp: e.userTimestamp ? new cq(e.userTimestamp) : void 0
				})
			}),
			lossyIntoFrame(e) {
				var t;
				return {
					payload: e.payload,
					userTimestamp: null == (t = e.extensions.userTimestamp) ? void 0 : t.timestamp
				}
			}
		},
		cK = Symbol.for("lk.track"),
		cz = Symbol.for("lk.data-track");
	class cJ {
		constructor(e, t, i) {
			this.trackSymbol = cK, this.isLocal = !1, this.typeSymbol = cz, this.info = e, this.manager = t, this.publisherIdentity = i.publisherIdentity
		}
		subscribe(e) {
			try {
				let t = this.manager.openSubscriptionStream(this.info.sid, null == e ? void 0 : e.signal, null == e ? void 0 : e.bufferSize),
					i = tg(t, 2),
					n = i[0];
				return i[1].catch(() => {}), n
			} catch (e) {
				throw e
			}
		}
		setPipelineOptions(e) {
			this.manager.setPipelineOptions(this.info.sid, e)
		}
	}
	class cG extends cB {
		constructor(e) {
			var t;
			super(), this.marker = e.marker, this.trackHandle = e.trackHandle, this.sequence = e.sequence, this.frameNumber = e.frameNumber, this.timestamp = e.timestamp, this.extensions = null != (t = e.extensions) ? t : new cH
		}
		extensionsMetrics() {
			let e = this.extensions.toBinaryLengthBytes(),
				t = Math.ceil((2 + e) / 4);
			return {
				lengthBytes: e,
				lengthWords: t,
				paddingLengthBytes: 4 * t - 2 - e
			}
		}
		toBinaryLengthBytes() {
			let e = this.extensionsMetrics(),
				t = e.lengthBytes,
				i = e.paddingLengthBytes,
				n = 12;
			return t > 0 && (n += 2 + t + i), n
		}
		toBinaryInto(e) {
			let t;
			if (e.byteLength < this.toBinaryLengthBytes()) throw cF.tooSmallForHeader();
			let i = 0;
			switch (this.marker) {
				case ej.Inter:
					t = 0;
					break;
				case ej.Final:
					t = 1;
					break;
				case ej.Start:
					t = 2;
					break;
				case ej.Single:
					t = 3
			}
			i |= t << 3;
			let n = this.extensionsMetrics(),
				r = n.lengthBytes,
				a = n.lengthWords,
				s = n.paddingLengthBytes;
			r > 0 && (i |= 4);
			let o = 0;
			if (e.setUint8(o, i), o += 1, e.setUint8(o, 0), o += 1, e.setUint16(o, this.trackHandle), o += 2, e.setUint16(o, this.sequence.value), o += 2, e.setUint16(o, this.frameNumber.value), o += 2, e.setUint32(o, this.timestamp.asTicks()), o += 4, r > 0) {
				e.setUint16(o, a - 1), o += 2;
				let t = this.extensions.toBinaryInto(new DataView(e.buffer, e.byteOffset + o));
				o += t;
				for (let t = 0; t < s; t += 1) e.setUint8(o, 0), o += 1
			}
			let c = this.toBinaryLengthBytes();
			if (o !== c) throw Error("DataTrackPacketHeader.toBinaryInto: Wrote ".concat(o, " bytes but expected length was ").concat(c, " bytes"));
			return c
		}
		static fromBinary(e) {
			let t, i, n = o_(e);
			if (n.byteLength < 12) throw cU.tooShort();
			let r = 0,
				a = n.getUint8(r);
			r += 1;
			let s = a >> 5 & 7;
			if (s > 0) throw cU.unsupportedVersion(s);
			switch (a >> 3 & 3) {
				case 2:
					t = ej.Start;
					break;
				case 1:
					t = ej.Final;
					break;
				case 3:
					t = ej.Single;
					break;
				default:
					t = ej.Inter
			}
			r += 1;
			try {
				i = oA.fromNumber(n.getUint16(r))
			} catch (e) {
				if (e instanceof oO && (e.isReason(eR.Reserved) || e.isReason(eR.TooLarge))) throw cU.invalidHandle(e);
				throw e
			}
			r += 2;
			let o = oI.u16(n.getUint16(r));
			r += 2;
			let c = oI.u16(n.getUint16(r));
			r += 2;
			let l = oD.fromRtpTicks(n.getUint32(r));
			r += 4;
			let d = new cH;
			if ((a >> 2 & 1) > 0) {
				if (n.byteLength - r < 2) throw cU.missingExtWords();
				let e = n.getUint16(r),
					t = 4 * (e + 1) - 2;
				if ((r += 2) + t > n.byteLength) throw cU.headerOverrun();
				let i = new DataView(n.buffer, n.byteOffset + r, t),
					a = tg(cH.fromBinary(i), 2),
					s = a[0],
					o = a[1];
				d = s, r += o
			}
			return [new cG({
				marker: t,
				trackHandle: i,
				sequence: o,
				frameNumber: c,
				timestamp: l,
				extensions: d
			}), r]
		}
		toJSON() {
			return {
				marker: this.marker,
				trackHandle: this.trackHandle,
				sequence: this.sequence.value,
				frameNumber: this.frameNumber.value,
				timestamp: this.timestamp.asTicks(),
				extensions: this.extensions.toJSON()
			}
		}
	}(V = ej || (ej = {}))[V.Start = 0] = "Start", V[V.Inter = 1] = "Inter", V[V.Final = 2] = "Final", V[V.Single = 3] = "Single";
	class cQ extends cB {
		constructor(e, t) {
			super(), this.header = e, this.payload = t
		}
		toBinaryLengthBytes() {
			return this.header.toBinaryLengthBytes() + this.payload.byteLength
		}
		toBinaryInto(e) {
			let t;
			if (t = 0 + this.header.toBinaryInto(e), e.byteLength - t < this.payload.byteLength) throw cF.tooSmallForPayload();
			for (let i = 0; i < this.payload.length; i += 1) e.setUint8(t, this.payload[i]), t += 1;
			let i = this.toBinaryLengthBytes();
			if (t !== i) throw Error("DataTrackPacket.toBinaryInto: Wrote ".concat(t, " bytes but expected length was ").concat(i, " bytes"));
			return i
		}
		static fromBinary(e) {
			let t = o_(e),
				i = tg(cG.fromBinary(t), 2),
				n = i[0],
				r = i[1];
			return [new cQ(n, new Uint8Array(t.buffer.slice(t.byteOffset + r, t.byteOffset + t.byteLength))), t.byteLength]
		}
		toJSON() {
			return {
				header: this.header.toJSON(),
				payload: this.payload
			}
		}
	}
	let cY = rA(eo.DataTracks);
	class cX extends aW {
		constructor(e, t, i, n) {
			super(19, "Frame ".concat(i, " dropped: ").concat(e), n), this.name = "DataTrackDepacketizerDropError", this.reason = t, this.reasonName = eq[t], this.frameNumber = i
		}
		static interrupted(e, t) {
			return new cX("Interrupted by the start of a new frame ".concat(t), eq.Interrupted, e)
		}
		static unknownFrame(e) {
			return new cX("Initial packet was never received.", eq.UnknownFrame, e)
		}
		static bufferFull(e) {
			return new cX("Reorder buffer is full.", eq.BufferFull, e)
		}
		static incomplete(e, t, i) {
			return new cX("Not all packets received before final packet. Received ".concat(t, " packets, expected ").concat(i, " packets."), eq.Incomplete, e)
		}
	}(H = eq || (eq = {}))[H.Interrupted = 0] = "Interrupted", H[H.UnknownFrame = 1] = "UnknownFrame", H[H.BufferFull = 2] = "BufferFull", H[H.Incomplete = 3] = "Incomplete";
	class cZ {
		constructor() {
			this.partials = new Map
		}
		push(e, t) {
			switch (e.header.marker) {
				case ej.Single:
					return this.frameFromSingle(e, t);
				case ej.Start:
					return this.beginPartial(e, t);
				case ej.Inter:
				case ej.Final:
					return this.pushToPartial(e)
			}
		}
		reset() {
			this.partials.clear()
		}
		peekOldestPartialFrameNumber() {
			let e = this.partials.keys().next();
			return e.done ? null : e.value
		}
		frameFromSingle(e, t) {
			var i;
			if (e.header.marker !== ej.Single) throw Error("Depacketizer.frameFromSingle: packet.header.marker was not FrameMarker.Single, found ".concat(e.header.marker, "."));
			let n = null != (i = null == t ? void 0 : t.maxPartialFrames) ? i : 1;
			if (this.partials.size >= n) {
				let i = this.peekOldestPartialFrameNumber();
				if ("number" != typeof i) throw Error("Depacketizer.frameFromSingle: no oldest frame number found, but partials.size is ".concat(this.partials.size, "."));
				if (this.partials.delete(i), null == t ? void 0 : t.throwOnInterruption) throw cX.interrupted(i, e.header.frameNumber.value);
				cY.warn("Data track frame ".concat(i, " was interrupted by single-packet frame ").concat(e.header.frameNumber.value, ", dropping."))
			}
			return {
				payload: e.payload,
				extensions: e.header.extensions
			}
		}
		beginPartial(e, t) {
			var i;
			if (e.header.marker !== ej.Start) throw Error("Depacketizer.beginPartial: packet.header.marker was not FrameMarker.Start, found ".concat(e.header.marker, "."));
			let n = e.header.sequence,
				r = e.header.frameNumber.value,
				a = {
					startSequence: n,
					extensions: e.header.extensions,
					payloads: new Map([
						[n.value, e.payload]
					])
				},
				s = null != (i = null == t ? void 0 : t.maxPartialFrames) ? i : 1;
			for (; this.partials.size >= s;) {
				let e = this.peekOldestPartialFrameNumber();
				if ("number" != typeof e) break;
				if (this.partials.delete(e), null == t ? void 0 : t.throwOnInterruption) throw cX.interrupted(e, r);
				cY.warn("Data track partials full (max ".concat(s, "), evicted oldest frame ").concat(e, " to make room for new frame ").concat(r, "."))
			}
			return this.partials.set(r, a), null
		}
		pushToPartial(e) {
			if (e.header.marker !== ej.Inter && e.header.marker !== ej.Final) throw Error("Depacketizer.pushToPartial: packet.header.marker was not FrameMarker.Inter or FrameMarker.Final, found ".concat(e.header.marker, "."));
			let t = e.header.frameNumber.value,
				i = this.partials.get(t);
			if (!i) throw this.partials.delete(t), cX.unknownFrame(t);
			if (i.payloads.size >= cZ.MAX_BUFFER_PACKETS) throw this.partials.delete(t), cX.bufferFull(t);
			return (i.payloads.has(e.header.sequence.value) && cY.warn("Data track frame ".concat(t, " received duplicate packet for sequence ").concat(e.header.sequence.value, ", so replacing with newly received packet.")), i.payloads.set(e.header.sequence.value, e.payload), e.header.marker === ej.Final) ? this.finalize(t, i, e.header.sequence.value) : null
		}
		finalize(e, t, i) {
			let n = t.payloads.size,
				r = 0;
			for (let e of t.payloads.values()) r += e.length;
			let a = new Uint8Array(r),
				s = t.startSequence.clone(),
				o = 0;
			for (;;) {
				let n = t.payloads.get(s.value);
				if (!n) break;
				t.payloads.delete(s.value);
				let r = a.length - o;
				if (n.length > r) throw Error("Depacketizer.finalize: Expected at least ".concat(n.length, " more bytes left in the payload buffer, only got ").concat(r, " bytes."));
				if (a.set(n, o), o += n.length, s.value != i) {
					s.increment();
					continue
				}
				return this.partials.delete(e), {
					payload: a,
					extensions: t.extensions
				}
			}
			throw this.partials.delete(e), cX.incomplete(e, n, i - t.startSequence.value + 1)
		}
	}
	cZ.MAX_BUFFER_PACKETS = 128, (W = eV || (eV = {}))[W.Unpublished = 0] = "Unpublished", W[W.Timeout = 1] = "Timeout", W[W.Disconnected = 2] = "Disconnected", W[W.Cancelled = 4] = "Cancelled";
	class c$ extends aW {
		constructor(e, t, i) {
			super(22, e, i), this.name = "DataTrackSubscribeError", this.reason = t, this.reasonName = eV[t]
		}
		static unpublished() {
			return new c$("The track has been unpublished and is no longer available", eV.Unpublished)
		}
		static timeout() {
			return new c$("Request to subscribe to data track timed-out", eV.Timeout)
		}
		static disconnected() {
			return new c$("Cannot subscribe to data track when disconnected", eV.Disconnected)
		}
		static cancelled() {
			return new c$("Subscription to data track cancelled by caller", eV.Cancelled)
		}
	}
	let c0 = rA(eo.DataTracks);
	class c1 {
		constructor(e) {
			var t, i;
			let n = null !== e.e2eeManager;
			if (e.info.usesE2ee !== n) throw Error("IncomingDataTrackPipeline: DataTrackInfo.usesE2ee must match presence of decryptionProvider");
			let r = new cZ;
			this.publisherIdentity = e.publisherIdentity, this.e2eeManager = null != (t = e.e2eeManager) ? t : null, this.depacketizer = r, this.options = null != (i = e.pipelineOptions) ? i : {}
		}
		updateE2eeManager(e) {
			this.e2eeManager = e
		}
		setOptions(e) {
			this.options = e
		}
		processPacket(e) {
			return rF(this, void 0, void 0, function*() {
				let t = this.depacketize(e);
				if (!t) return null;
				let i = yield this.decryptIfNeeded(t);
				return i || null
			})
		}
		depacketize(e) {
			let t;
			try {
				t = this.depacketizer.push(e, {
					throwOnInterruption: !1,
					maxPartialFrames: this.options.maxPartialFrames
				})
			} catch (e) {
				return c0.warn("Data frame depacketize error: ".concat(e)), null
			}
			return t
		}
		decryptIfNeeded(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i;
				let n, r = this.e2eeManager;
				if (!r) return e;
				let a = null != (i = null == (t = e.extensions) ? void 0 : t.e2ee) ? i : null;
				if (!a) return c0.error("Missing E2EE meta"), null;
				try {
					n = yield r.handleEncryptedData(e.payload, a.iv, this.publisherIdentity, a.keyIndex)
				} catch (e) {
					return c0.error("Error decrypting packet: ".concat(e)), null
				}
				return e.payload = n.payload, e
			})
		}
	}
	let c2 = rA(eo.DataTracks);
	class c3 extends rV.EventEmitter {
		constructor(e) {
			var t;
			super(), this.descriptors = new Map, this.subscriptionHandles = new Map, this.e2eeManager = null != (t = null == e ? void 0 : e.e2eeManager) ? t : null
		}
		updateE2eeManager(e) {
			for (let t of (this.e2eeManager = e, this.descriptors.values())) "active" === t.subscription.type && t.subscription.pipeline.updateE2eeManager(e)
		}
		setPipelineOptions(e, t) {
			let i = this.descriptors.get(e);
			i ? (i.pipelineOptions = t, "active" === i.subscription.type && i.subscription.pipeline.setOptions(t)) : c2.warn("Unknown track ".concat(e, ", cannot set pipeline options."))
		}
		openSubscriptionStream(e, t) {
			let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 16,
				n = null,
				r = new sJ,
				a = this.descriptors.get(e),
				s = () => {
					null == t || t.removeEventListener("abort", c)
				},
				o = () => {
					(s(), n) ? a && this.descriptors.get(a.info.sid) === a ? "active" !== a.subscription.type ? c2.warn("Subscription for track ".concat(e, " is not active, skipping cancel...")) : (a.subscription.streamControllers.delete(n), 0 === a.subscription.streamControllers.size && this.unSubscribeRequest(a.info.sid)) : c2.warn("Unknown track ".concat(e, ", skipping cancel...")): c2.warn("ReadableStream subscribed to ".concat(e, " was not started."))
				},
				c = () => {
					var e;
					n && ((null == a ? void 0 : a.subscription.type) === "active" && a.subscription.streamControllers.delete(n), n.error(c$.cancelled()), null == (e = r.reject) || e.call(r, c$.cancelled()), o())
				};
			return [new ReadableStream({
				start: i => {
					n = i, this.subscribeRequest(e, t).then(() => rF(this, void 0, void 0, function*() {
						var n, o, l;
						if (!a || this.descriptors.get(a.info.sid) !== a) {
							c2.error("Unknown track ".concat(e));
							let t = c$.disconnected();
							i.error(t), null == (n = r.reject) || n.call(r, t);
							return
						}
						if ("active" !== a.subscription.type) {
							c2.error("Subscription for track ".concat(e, " is not active"));
							let t = c$.disconnected();
							i.error(t), null == (o = r.reject) || o.call(r, t);
							return
						}(null == t ? void 0 : t.aborted) ? c(): (null == t || t.addEventListener("abort", c), a.subscription.streamControllers.set(i, s), null == (l = r.resolve) || l.call(r))
					})).catch(e => {
						var t;
						i.error(e), null == (t = r.reject) || t.call(r, e)
					})
				},
				cancel: () => {
					o()
				}
			}, new CountQueuingStrategy({
				highWaterMark: i
			})), r.promise]
		}
		subscribeRequest(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = this.descriptors.get(e);
				if (!i) throw Error("Cannot subscribe to unknown track");
				let n = (t, i, n) => rF(this, void 0, void 0, function*() {
					if ("active" === t.subscription.type) return;
					if ("pending" !== t.subscription.type) throw Error("Descriptor for track ".concat(e, " is not pending, found ").concat(t.subscription.type));
					let r = cL([i, n].filter(e => void 0 !== e)),
						a = new sJ;
					t.subscription.completionFuture.promise.then(() => {
						var e;
						return null == (e = a.resolve) ? void 0 : e.call(a)
					}).catch(e => {
						var t;
						return null == (t = a.reject) ? void 0 : t.call(a, e)
					});
					let s = () => {
						var e;
						if ("pending" === t.subscription.type) {
							if (t.subscription.pendingRequestCount -= 1, (null == n ? void 0 : n.aborted) || t.subscription.pendingRequestCount <= 0) return void t.subscription.cancel();
							null == (e = a.reject) || e.call(a, c$.cancelled())
						}
					};
					r.aborted && s(), r.addEventListener("abort", s), yield a.promise, r.removeEventListener("abort", s)
				});
				switch (i.subscription.type) {
					case "none": {
						i.subscription = {
							type: "pending",
							completionFuture: new sJ,
							pendingRequestCount: 1,
							cancel: () => {
								var e, t;
								let n = i.subscription;
								i.subscription = {
									type: "none"
								}, this.emit("sfuUpdateSubscription", {
									sid: i.info.sid,
									subscribe: !1
								}), "pending" === n.type && (null == (t = (e = n.completionFuture).reject) || t.call(e, r.aborted ? c$.timeout() : c$.cancelled()))
							}
						}, this.emit("sfuUpdateSubscription", {
							sid: e,
							subscribe: !0
						});
						let r = cN(1e4);
						yield n(i, t, r);
						return
					}
					case "pending":
						i.subscription.pendingRequestCount += 1, yield n(i, t);
						return;
					case "active":
						return
				}
			})
		}
		querySubscribed() {
			return rF(this, void 0, void 0, function*() {
				return Array.from(this.descriptors.values()).filter(e => "active" === e.subscription.type).map(e => [e.info, e.publisherIdentity])
			})
		}
		unSubscribeRequest(e) {
			var t;
			let i = this.descriptors.get(e);
			if (!i) throw Error("Cannot subscribe to unknown track");
			if ("active" !== i.subscription.type) return void c2.warn("Unexpected descriptor state in unSubscribeRequest, expected active, found ".concat(null == (t = i.subscription) ? void 0 : t.type));
			this.closeStreamControllers(i.subscription.streamControllers, e);
			let n = i.subscription;
			i.subscription = {
				type: "none"
			}, this.subscriptionHandles.delete(n.subcriptionHandle), this.emit("sfuUpdateSubscription", {
				sid: e,
				subscribe: !1
			})
		}
		closeStreamControllers(e, t) {
			for (let n of e) {
				var i = tg(n, 2);
				let e = i[0];
				(0, i[1])();
				try {
					e.close()
				} catch (e) {
					c2.warn("Failed to close readable stream for track ".concat(t, ": ").concat(e))
				}
			}
		}
		receiveSfuPublicationUpdates(e) {
			return rF(this, void 0, void 0, function*() {
				if (0 === e.size) return;
				let t = new Map;
				for (let n of e.entries()) {
					var i = tg(n, 2);
					let e = i[0],
						r = i[1],
						a = new Set;
					for (let t of r) a.add(t.sid), !this.descriptors.has(t.sid) && (this.handleSidReassigned(e, t) || (yield this.handleTrackPublished(e, t)));
					t.set(e, a)
				}
				for (let e of t.entries()) {
					var n = tg(e, 2);
					let t = n[0],
						i = n[1];
					for (let e of Array.from(this.descriptors.entries()).filter(e => {
							let i = tg(e, 2);
							return i[0], i[1].publisherIdentity === t
						}).map(e => tg(e, 1)[0]).filter(e => !i.has(e))) this.handleTrackUnpublished(e)
				}
			})
		}
		queryPublications() {
			return rF(this, void 0, void 0, function*() {
				return Array.from(this.descriptors.values()).map(e => e.info)
			})
		}
		handleTrackPublished(e, t) {
			return rF(this, void 0, void 0, function*() {
				if (this.descriptors.has(t.sid)) return void c2.error("Existing descriptor for track ".concat(t.sid));
				let i = {
					info: t,
					publisherIdentity: e,
					subscription: {
						type: "none"
					},
					pipelineOptions: {}
				};
				this.descriptors.set(i.info.sid, i);
				let n = new cJ(i.info, this, {
					publisherIdentity: e
				});
				this.emit("trackPublished", {
					track: n
				})
			})
		}
		handleSidReassigned(e, t) {
			let i = Array.from(this.descriptors.entries()).find(i => {
				let n = tg(i, 2);
				n[0];
				let r = n[1];
				return r.publisherIdentity === e && r.info.pubHandle === t.pubHandle
			});
			if (!i) return !1;
			let n = tg(i, 2),
				r = n[0],
				a = n[1],
				s = a.info,
				o = s.name,
				c = s.usesE2ee;
			if (o !== t.name || c !== t.usesE2ee) return c2.warn("Info mismatch for ".concat(r, ", treating as new publication")), !1;
			let l = t.sid;
			if (c2.debug("SID reassigned: ".concat(r, " -> ").concat(l)), !this.descriptors.delete(r)) return !1;
			switch (a.info.sid = l, a.subscription.type) {
				case "none":
					break;
				case "pending":
				case "active":
					this.emit("sfuUpdateSubscription", {
						sid: l,
						subscribe: !0
					})
			}
			return "active" === a.subscription.type && this.subscriptionHandles.set(a.subscription.subcriptionHandle, l), this.descriptors.set(l, a), !0
		}
		handleTrackUnpublished(e) {
			let t = this.descriptors.get(e);
			t ? (this.descriptors.delete(e), "active" === t.subscription.type && (this.closeStreamControllers(t.subscription.streamControllers, e), this.subscriptionHandles.delete(t.subscription.subcriptionHandle)), this.emit("trackUnpublished", {
				sid: e,
				publisherIdentity: t.publisherIdentity
			})) : c2.error("Unknown track ".concat(e))
		}
		receivedSfuSubscriberHandles(e) {
			for (let i of e.entries()) {
				var t = tg(i, 2);
				let e = t[0],
					n = t[1];
				this.registerSubscriberHandle(e, n)
			}
		}
		registerSubscriberHandle(e, t) {
			var i, n;
			let r = this.descriptors.get(t);
			if (!r) return void c2.error("Unknown track ".concat(t));
			switch (r.subscription.type) {
				case "none":
					return void c2.warn("No subscription for ".concat(t));
				case "active":
					this.subscriptionHandles.delete(r.subscription.subcriptionHandle), r.subscription.subcriptionHandle = e, this.subscriptionHandles.set(e, t);
					return;
				case "pending": {
					c2.debug("data track subscription activated", {
						sid: t,
						handle: e
					});
					let a = new c1({
							info: r.info,
							publisherIdentity: r.publisherIdentity,
							e2eeManager: this.e2eeManager,
							pipelineOptions: r.pipelineOptions
						}),
						s = r.subscription;
					r.subscription = {
						type: "active",
						subcriptionHandle: e,
						pipeline: a,
						streamControllers: new Map
					}, this.subscriptionHandles.set(e, t), null == (n = (i = s.completionFuture).resolve) || n.call(i)
				}
			}
		}
		packetReceived(e) {
			return rF(this, void 0, void 0, function*() {
				let t;
				try {
					var i = cQ.fromBinary(e);
					t = tg(i, 1)[0]
				} catch (e) {
					c2.error("Failed to deserialize packet: ".concat(e));
					return
				}
				let n = this.subscriptionHandles.get(t.header.trackHandle);
				if (!n) return void c2.warn("Unknown subscriber handle ".concat(t.header.trackHandle));
				let r = this.descriptors.get(n);
				if (!r) return void c2.error("Missing descriptor for track ".concat(n));
				if ("active" !== r.subscription.type) return void c2.warn("Received packet for track ".concat(n, " without active subscription"));
				let a = yield r.subscription.pipeline.processPacket(t);
				if (a)
					for (let e of r.subscription.streamControllers.keys()) {
						if (null !== e.desiredSize && e.desiredSize <= 0) {
							c2.warn("Cannot send frame to subscribers: readable stream is full (desiredSize is ".concat(e.desiredSize, "). To increase this threshold, set a higher 'options.highWaterMark' when calling .subscribe()."));
							continue
						}
						let t = cW.lossyIntoFrame(a);
						e.enqueue(t)
					}
			})
		}
		resendSubscriptionUpdates() {
			for (let t of this.descriptors) {
				var e = tg(t, 2);
				let i = e[0];
				"none" !== e[1].subscription.type && this.emit("sfuUpdateSubscription", {
					sid: i,
					subscribe: !0
				})
			}
		}
		handleRemoteParticipantDisconnected(e) {
			var t, i;
			for (let n of this.descriptors.values())
				if (n.publisherIdentity === e) switch (n.subscription.type) {
					case "none":
						break;
					case "pending":
						null == (i = (t = n.subscription.completionFuture).reject) || i.call(t, c$.disconnected());
						break;
					case "active":
						this.unSubscribeRequest(n.info.sid)
				}
		}
		reset() {
			var e, t;
			for (let i of this.descriptors.values()) this.emit("trackUnpublished", {
				sid: i.info.sid,
				publisherIdentity: i.publisherIdentity
			}), "pending" === i.subscription.type && (null == (t = (e = i.subscription.completionFuture).reject) || t.call(e, c$.disconnected())), "active" === i.subscription.type && this.closeStreamControllers(i.subscription.streamControllers, i.info.sid);
			this.descriptors.clear(), this.subscriptionHandles.clear()
		}
	}
	class c4 extends aW {
		constructor(e, t, i) {
			super(19, e, i), this.name = "DataTrackPacketizerError", this.reason = t, this.reasonName = eH[t]
		}
		static mtuTooShort() {
			return new c4("MTU is too short to send frame", eH.MtuTooShort)
		}
	}(K = eH || (eH = {}))[K.MtuTooShort = 0] = "MtuTooShort";
	class c9 {
		constructor(e, t) {
			this.sequence = oI.u16(0), this.frameNumber = oI.u16(0), this.clock = oM.rtpStartingNow(oD.rtpRandom()), this.handle = e, this.mtuSizeBytes = t
		}
		static computeFrameMarker(e, t) {
			return t <= 1 ? ej.Single : 0 === e ? ej.Start : e === t - 1 ? ej.Final : ej.Inter
		}* packetize(e, t) {
			var i, n;
			let r = this.frameNumber.getThenIncrement(),
				a = {
					marker: ej.Inter,
					trackHandle: this.handle,
					sequence: oI.u16(0),
					frameNumber: r,
					timestamp: null != (i = null == t ? void 0 : t.now) ? i : this.clock.now(),
					extensions: e.extensions
				},
				s = new cG(a).toBinaryLengthBytes();
			if (s >= this.mtuSizeBytes) throw c4.mtuTooShort();
			let o = this.mtuSizeBytes - s,
				c = Math.ceil(e.payload.byteLength / o);
			for (let t = 0, i = 0; i < e.payload.byteLength; t = (n = [t + 1, i + o])[0], i = n[1]) {
				let n = this.sequence.getThenIncrement(),
					r = new cG(Object.assign(Object.assign({}, a), {
						marker: c9.computeFrameMarker(t, c),
						sequence: n
					})),
					s = Math.min(o, e.payload.byteLength - i),
					l = new Uint8Array(e.payload.buffer, e.payload.byteOffset + i, s);
				yield new cQ(r, l)
			}
		}
	}(z = eW || (eW = {}))[z.NotAllowed = 0] = "NotAllowed", z[z.DuplicateName = 1] = "DuplicateName", z[z.Timeout = 2] = "Timeout", z[z.LimitReached = 3] = "LimitReached", z[z.Disconnected = 4] = "Disconnected", z[z.Cancelled = 5] = "Cancelled", z[z.InvalidName = 6] = "InvalidName", z[z.Unknown = 7] = "Unknown";
	class c6 extends aW {
		constructor(e, t, i) {
			super(21, e, i), this.name = "DataTrackPublishError", this.reason = t, this.reasonName = eW[t], this.rawMessage = null == i ? void 0 : i.rawMessage
		}
		static notAllowed(e) {
			return new c6("Data track publishing unauthorized", eW.NotAllowed, {
				rawMessage: e
			})
		}
		static duplicateName(e) {
			return new c6("Track name already taken", eW.DuplicateName, {
				rawMessage: e
			})
		}
		static invalidName(e) {
			return new c6("Track name is invalid", eW.InvalidName, {
				rawMessage: e
			})
		}
		static timeout() {
			return new c6("Publish data track timed-out. Does the LiveKit server support data tracks?", eW.Timeout)
		}
		static limitReached(e) {
			return new c6("Data track publication limit reached", eW.LimitReached, {
				rawMessage: e
			})
		}
		static unknown(e, t) {
			return new c6("Received RequestResponse for publishDataTrack, but reason was unrecognised (".concat(e, ", ").concat(t, ")"), eW.Unknown)
		}
		static disconnected() {
			return new c6("Room disconnected", eW.Disconnected)
		}
		static cancelled() {
			return new c6("Publish data track cancelled by caller", eW.Cancelled)
		}
	}(J = eK || (eK = {}))[J.TrackUnpublished = 0] = "TrackUnpublished", J[J.Dropped = 1] = "Dropped";
	class c8 extends aW {
		constructor(e, t, i) {
			super(22, e, i), this.name = "DataTrackPushFrameError", this.reason = t, this.reasonName = eK[t]
		}
		static trackUnpublished() {
			return new c8("Track is no longer published", eK.TrackUnpublished)
		}
		static dropped(e) {
			return new c8("Frame was dropped", eK.Dropped, {
				cause: e
			})
		}
	}(G = ez || (ez = {}))[G.Packetizer = 0] = "Packetizer", G[G.Encryption = 1] = "Encryption";
	class c5 extends aW {
		constructor(e, t, i) {
			super(21, e, i), this.name = "DataTrackOutgoingPipelineError", this.reason = t, this.reasonName = ez[t]
		}
		static packetizer(e) {
			return new c5("Error packetizing frame", ez.Packetizer, {
				cause: e
			})
		}
		static encryption(e) {
			return new c5("Error encrypting frame", ez.Encryption, {
				cause: e
			})
		}
	}
	class c7 {
		constructor(e, t) {
			this.trackSymbol = cK, this.isLocal = !0, this.typeSymbol = cz, this.handle = null, this.log = r_, this.flushedFuture = new sJ, this.isFlushed = !0, this.handleManagerReset = () => {
				var e, t;
				null == (t = (e = this.flushedFuture).resolve) || t.call(e), this.manager.off("packetsFlushedChange", this.handleManagerPacketsFlushedChange), this.manager.off("reset", this.handleManagerReset)
			}, this.handleManagerPacketsFlushedChange = e => {
				var t, i;
				this.isFlushed = e.isFlushed, e.isFlushed && (null == (i = (t = this.flushedFuture).resolve) || i.call(t), this.flushedFuture = new sJ)
			}, this.options = e, this.manager = t, this.log = rA(eo.DataTracks), this.manager.on("packetsFlushedChange", this.handleManagerPacketsFlushedChange), this.manager.on("reset", this.handleManagerReset)
		}
		static withExplicitHandle(e, t, i) {
			let n = new c7(e, t);
			return n.handle = i, n
		}
		get info() {
			let e = this.descriptor;
			return (null == e ? void 0 : e.type) === "active" ? e.info : void 0
		}
		get descriptor() {
			return this.handle ? this.manager.getDescriptor(this.handle) : null
		}
		publish(e) {
			return rF(this, void 0, void 0, function*() {
				try {
					this.handle = yield this.manager.publishRequest(this.options, e)
				} catch (e) {
					throw e
				}
			})
		}
		isPublished() {
			var e;
			return (null == (e = this.descriptor) ? void 0 : e.type) === "active" && "unpublished" !== this.descriptor.publishState
		}
		tryPush(e) {
			if (!this.handle) throw c8.trackUnpublished();
			let t = cW.from(e);
			try {
				return this.manager.tryProcessAndSend(this.handle, t)
			} catch (e) {
				throw e
			}
		}
		flush() {
			return rF(this, void 0, void 0, function*() {
				if (!this.isFlushed) return this.flushedFuture.promise
			})
		}
		unpublish() {
			return rF(this, void 0, void 0, function*() {
				if (!this.handle) return void r_.warn('Data track "'.concat(this.options.name, '" is not published, so unpublishing has no effect.'));
				try {
					yield this.manager.unpublishRequest(this.handle)
				} catch (e) {
					throw e
				}
			})
		}
	}
	class le {
		constructor(e) {
			this.e2eeManager = e.e2eeManager, this.packetizer = new c9(e.info.pubHandle, le.TRANSPORT_MTU_BYTES)
		}
		updateE2eeManager(e) {
			this.e2eeManager = e
		}
		processFrame(e) {
			return function(e, t, i) {
				if (!Symbol.asyncIterator) throw TypeError("Symbol.asyncIterator is not defined.");
				var n, r = i.apply(e, t || []),
					a = [];
				return n = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), s("next"), s("throw"), s("return", function(e) {
					return function(t) {
						return Promise.resolve(t).then(e, l)
					}
				}), n[Symbol.asyncIterator] = function() {
					return this
				}, n;

				function s(e, t) {
					r[e] && (n[e] = function(t) {
						return new Promise(function(i, n) {
							a.push([e, t, i, n]) > 1 || o(e, t)
						})
					}, t && (n[e] = t(n[e])))
				}

				function o(e, t) {
					try {
						var i;
						(i = r[e](t)).value instanceof rB ? Promise.resolve(i.value.v).then(c, l) : d(a[0][2], i)
					} catch (e) {
						d(a[0][3], e)
					}
				}

				function c(e) {
					o("next", e)
				}

				function l(e) {
					o("throw", e)
				}

				function d(e, t) {
					e(t), a.shift(), a.length && o(a[0][0], a[0][1])
				}
			}(this, arguments, function*() {
				let t = yield rB(this.encryptIfNeeded(e));
				try {
					yield rB((yield* function(e) {
						var t, i;
						return t = {}, n("next"), n("throw", function(e) {
							throw e
						}), n("return"), t[Symbol.iterator] = function() {
							return this
						}, t;

						function n(n, r) {
							t[n] = e[n] ? function(t) {
								return (i = !i) ? {
									value: rB(e[n](t)),
									done: !1
								} : r ? r(t) : t
							} : r
						}
					}(rj(this.packetizer.packetize(t)))))
				} catch (e) {
					if (e instanceof c4) throw c5.packetizer(e);
					throw e
				}
			})
		}
		encryptIfNeeded(e) {
			return rF(this, void 0, void 0, function*() {
				let t;
				if (!this.e2eeManager) return e;
				try {
					t = yield this.e2eeManager.encryptData(e.payload)
				} catch (e) {
					throw c5.encryption(e)
				}
				return e.payload = t.payload, e.extensions.e2ee = new cV(t.keyIndex, t.iv), e
			})
		}
	}
	le.TRANSPORT_MTU_BYTES = 16e3;
	let lt = rA(eo.DataTracks);
	class li extends rV.EventEmitter {
		constructor(e) {
			var t;
			super(), this.handleAllocator = new ox, this.descriptors = new Map, this.inFlightPacketCounter = new Map, this.e2eeManager = null != (t = null == e ? void 0 : e.e2eeManager) ? t : null
		}
		static withDescriptors(e) {
			let t = new li;
			return t.descriptors = e, t
		}
		updateE2eeManager(e) {
			for (let t of (this.e2eeManager = e, this.descriptors.values())) "active" === t.type && t.pipeline.updateE2eeManager(e)
		}
		getDescriptor(e) {
			var t;
			return null != (t = this.descriptors.get(e)) ? t : null
		}
		tryProcessAndSend(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = this.getDescriptor(e);
				if ((null == i ? void 0 : i.type) !== "active" || "unpublished" === i.publishState) throw c8.trackUnpublished();
				if ("republishing" === i.publishState) throw c8.dropped("Data track republishing");
				try {
					try {
						for (var n, r, a, s, o, c, l = !0, d = rj(i.pipeline.processFrame(t)); !(n = (c = yield d.next()).done); l = !0) {
							s = c.value, l = !1;
							let t = null != (o = this.inFlightPacketCounter.get(e)) ? o : 0;
							this.inFlightPacketCounter.set(e, t + 1), 0 === t && this.emit("packetsFlushedChange", {
								handle: e,
								isFlushed: !1
							}), this.emit("packetAvailable", {
								handle: e,
								bytes: s.toBinary()
							})
						}
					} catch (e) {
						r = {
							error: e
						}
					} finally {
						try {
							!l && !n && (a = d.return) && (yield a.call(d))
						} finally {
							if (r) throw r.error
						}
					}
				} catch (e) {
					throw c8.dropped(e)
				}
			})
		}
		handlePacketSendComplete(e) {
			var t;
			let i = (null != (t = this.inFlightPacketCounter.get(e)) ? t : 0) - 1;
			i < 0 && (lt.warn("OutgoingDataTrackManager.handlePacketSendComplete: inFlightPacketCounter was decremented below 0 (got ".concat(this.inFlightPacketCounter, " - resetting to 0. Were more packets send than were emitted?")), i = 0), this.inFlightPacketCounter.set(e, i), 0 === i && this.emit("packetsFlushedChange", {
				handle: e,
				isFlushed: !0
			})
		}
		publishRequest(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = this.handleAllocator.get();
				if (!i) throw c6.limitReached();
				let n = cN(1e4),
					r = t ? cL([t, n]) : n;
				if (this.descriptors.has(i)) throw Error("Descriptor for handle already exists");
				let a = {
					type: "pending",
					completionFuture: new sJ
				};
				this.descriptors.set(i, a);
				let s = () => {
					var e, t;
					let r = this.descriptors.get(i);
					r ? (this.descriptors.delete(i), this.emit("sfuUnpublishRequest", {
						handle: i
					}), "pending" === r.type && (null == (t = (e = r.completionFuture).reject) || t.call(e, n.aborted ? c6.timeout() : c6.cancelled()))) : lt.warn("No descriptor for ".concat(i))
				};
				return r.aborted ? (s(), a.completionFuture.promise.then(() => i)) : (r.addEventListener("abort", s), this.emit("sfuPublishRequest", {
					handle: i,
					name: e.name,
					usesE2ee: null !== this.e2eeManager
				}), yield a.completionFuture.promise, r.removeEventListener("abort", s), this.emit("trackPublished", {
					track: c7.withExplicitHandle(e, this, i)
				}), i)
			})
		}
		queryPublished() {
			return Array.from(this.descriptors.values()).filter(e => "active" === e.type).map(e => e.info)
		}
		unpublishRequest(e) {
			return rF(this, void 0, void 0, function*() {
				let t = this.descriptors.get(e);
				t ? "active" !== t.type ? lt.warn("Track ".concat(e, " not active")) : (this.emit("sfuUnpublishRequest", {
					handle: e
				}), yield t.unpublishingFuture.promise, this.inFlightPacketCounter.delete(e), this.emit("trackUnpublished", {
					sid: t.info.sid
				})) : lt.warn("No descriptor for ".concat(e))
			})
		}
		receivedSfuPublishResponse(e, t) {
			var i, n, r, a;
			let s = this.descriptors.get(e);
			if (!s) return void lt.warn("No descriptor for ".concat(e));
			switch (this.descriptors.delete(e), s.type) {
				case "pending":
					if ("ok" === t.type) {
						let r, a = t.data;
						lt.debug("SFU accepted publish request for handle ".concat(e), {
							sid: a.sid
						});
						let o = a.usesE2ee ? this.e2eeManager : null;
						this.descriptors.set(a.pubHandle, (r = a, {
							type: "active",
							info: r,
							publishState: "published",
							pipeline: new le({
								info: r,
								e2eeManager: o
							}),
							unpublishingFuture: new sJ
						})), null == (n = (i = s.completionFuture).resolve) || n.call(i)
					} else lt.debug("SFU rejected publish request for handle ".concat(e), {
						error: t.error
					}), null == (a = (r = s.completionFuture).reject) || a.call(r, t.error);
					return;
				case "active":
					if ("republishing" !== s.publishState) return void lt.warn("Track ".concat(e, " already active"));
					if ("error" === t.type) return void lt.warn("Republish failed for track ".concat(e));
					lt.debug("Track ".concat(e, " republished")), s.info.sid = t.data.sid, s.publishState = "published", this.descriptors.set(s.info.pubHandle, s)
			}
		}
		receivedSfuUnpublishResponse(e) {
			var t, i;
			let n = this.descriptors.get(e);
			n ? (this.descriptors.delete(e), "active" !== n.type) ? lt.warn("Track ".concat(e, " not active")) : (n.publishState = "unpublished", null == (i = (t = n.unpublishingFuture).resolve) || i.call(t)) : lt.warn("No descriptor for ".concat(e))
		}
		sfuWillRepublishTracks() {
			var e, t;
			for (let n of this.descriptors.entries()) {
				var i = tg(n, 2);
				let r = i[0],
					a = i[1];
				switch (a.type) {
					case "pending":
						this.descriptors.delete(r), null == (t = (e = a.completionFuture).reject) || t.call(e, c6.disconnected());
						break;
					case "active":
						a.publishState = "republishing", this.emit("sfuPublishRequest", {
							handle: a.info.pubHandle,
							name: a.info.name,
							usesE2ee: a.info.usesE2ee
						})
				}
			}
		}
		reset() {
			return rF(this, void 0, void 0, function*() {
				var e, t, i, n;
				for (let r of (this.handleAllocator.reset(), this.descriptors.values())) switch (r.type) {
					case "pending":
						null == (t = (e = r.completionFuture).reject) || t.call(e, c6.disconnected());
						break;
					case "active":
						null == (n = (i = r.unpublishingFuture).resolve) || n.call(i), yield this.unpublishRequest(r.info.pubHandle)
				}
				this.descriptors.clear(), this.inFlightPacketCounter.clear(), this.emit("reset")
			})
		}
	}
	class ln extends Error {
		constructor(e, t, i, n) {
			super(t), this.code = e, this.message = lo(t, ln.MAX_MESSAGE_BYTES), this.data = i ? lo(i, ln.MAX_DATA_BYTES) : void 0, void 0 !== (null == n ? void 0 : n.cause) && (this.cause = null == n ? void 0 : n.cause)
		}
		static fromProto(e) {
			return new ln(e.code, e.message, e.data)
		}
		toProto() {
			return new iJ({
				code: this.code,
				message: this.message,
				data: this.data
			})
		}
		static builtIn(e, t, i) {
			return new ln(ln.ErrorCode[e], ln.ErrorMessage[e], t, i)
		}
	}
	ln.MAX_MESSAGE_BYTES = 256, ln.MAX_DATA_BYTES = 15360, ln.ErrorCode = {
		APPLICATION_ERROR: 1500,
		CONNECTION_TIMEOUT: 1501,
		RESPONSE_TIMEOUT: 1502,
		RECIPIENT_DISCONNECTED: 1503,
		RESPONSE_PAYLOAD_TOO_LARGE: 1504,
		SEND_FAILED: 1505,
		UNSUPPORTED_METHOD: 1400,
		RECIPIENT_NOT_FOUND: 1401,
		REQUEST_PAYLOAD_TOO_LARGE: 1402,
		UNSUPPORTED_SERVER: 1403,
		UNSUPPORTED_VERSION: 1404
	}, ln.ErrorMessage = {
		APPLICATION_ERROR: "Application error in method handler",
		CONNECTION_TIMEOUT: "Connection timeout",
		RESPONSE_TIMEOUT: "Response timeout",
		RECIPIENT_DISCONNECTED: "Recipient disconnected",
		RESPONSE_PAYLOAD_TOO_LARGE: "Response payload too large",
		SEND_FAILED: "Failed to send",
		UNSUPPORTED_METHOD: "Method not supported at destination",
		RECIPIENT_NOT_FOUND: "Recipient not found",
		REQUEST_PAYLOAD_TOO_LARGE: "Request payload too large",
		UNSUPPORTED_SERVER: "RPC not supported by server",
		UNSUPPORTED_VERSION: "Unsupported RPC version"
	};
	let lr = "lk.rpc_request",
		la = "lk.rpc_response";

	function ls(e) {
		return new TextEncoder().encode(e).length
	}

	function lo(e, t) {
		if (ls(e) <= t) return e;
		let i = 0,
			n = e.length,
			r = new TextEncoder;
		for (; i < n;) {
			let a = Math.floor((i + n + 1) / 2);
			r.encode(e.slice(0, a)).length <= t ? i = a : n = a - 1
		}
		return e.slice(0, i)
	}(Q = eJ || (eJ = {})).RPC_REQUEST_ID = "lk.rpc_request_id", Q.RPC_REQUEST_METHOD = "lk.rpc_request_method", Q.RPC_REQUEST_RESPONSE_TIMEOUT_MS = "lk.rpc_request_response_timeout_ms", Q.RPC_REQUEST_VERSION = "lk.rpc_request_version";
	class lc extends rV.EventEmitter {
		constructor(e, t, i, n) {
			super(), this.pendingAcks = new Map, this.pendingResponses = new Map, this.log = e, this.outgoingDataStreamManager = t, this.getRemoteParticipantClientProtocol = i, this.getServerVersion = n
		}
		performRpc(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = e.destinationIdentity,
					n = e.method,
					r = e.payload,
					a = e.responseTimeout,
					s = void 0 === a ? 15e3 : a;
				return function*() {
					let e = t.getRemoteParticipantClientProtocol(i);
					if (ls(r) > 15360 && e < 1) throw ln.builtIn("REQUEST_PAYLOAD_TOO_LARGE");
					let a = t.getServerVersion();
					if (a && 0 > sF(a, "1.8.0")) throw ln.builtIn("UNSUPPORTED_SERVER");
					let o = Math.max(s, 8e3),
						c = crypto.randomUUID(),
						l = new sJ,
						d = null,
						u = setTimeout(() => {
							var e;
							t.pendingAcks.delete(c), null == (e = l.reject) || e.call(l, ln.builtIn("CONNECTION_TIMEOUT")), t.pendingResponses.delete(c), null !== d && clearTimeout(d)
						}, 7e3);
					t.pendingAcks.set(c, {
						resolve: () => {
							clearTimeout(u)
						},
						participantIdentity: i
					}), t.pendingResponses.set(c, {
						completionFuture: l,
						participantIdentity: i
					}), yield t.publishRpcRequest(i, c, n, r, o, e), d = setTimeout(() => {
						var e;
						t.pendingResponses.delete(c), null == (e = l.reject) || e.call(l, ln.builtIn("RESPONSE_TIMEOUT"))
					}, s);
					let h = l.promise.finally(() => {
						clearTimeout(d), t.pendingAcks.has(c) && (t.log.warn("RPC response received before ack", c), t.pendingAcks.delete(c), clearTimeout(u))
					});
					return [c, h]
				}()
			})
		}
		publishRpcRequest(e, t, i, n, r, a) {
			return rF(this, void 0, void 0, function*() {
				if (a >= 1) {
					let a = yield this.outgoingDataStreamManager.streamText({
						topic: lr,
						destinationIdentities: [e],
						attributes: {
							[eJ.RPC_REQUEST_ID]: t,
							[eJ.RPC_REQUEST_METHOD]: i,
							[eJ.RPC_REQUEST_RESPONSE_TIMEOUT_MS]: "".concat(r),
							[eJ.RPC_REQUEST_VERSION]: "".concat(2)
						}
					});
					yield a.write(n), yield a.close();
					return
				}
				this.emit("sendDataPacket", {
					packet: new iA({
						destinationIdentities: [e],
						kind: ix.RELIABLE,
						value: {
							case: "rpcRequest",
							value: new iW({
								id: t,
								method: i,
								payload: n,
								responseTimeoutMs: r,
								version: 1
							})
						}
					})
				})
			})
		}
		handleIncomingDataStream(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				let n, r = i[eJ.RPC_REQUEST_ID];
				if (!r) return void this.log.warn("RPC data stream malformed: ".concat(eJ.RPC_REQUEST_ID, " not set."));
				let a = this.pendingResponses.get(r);
				if (a && a.participantIdentity !== t) return void this.log.warn("RPC response stream for ".concat(r, " arrived from unexpected sender ").concat(t, ", expected ").concat(a.participantIdentity, ". Ignoring."));
				try {
					n = yield e.readAll()
				} catch (e) {
					this.log.warn("Error reading RPC response payload: ".concat(e)), this.handleIncomingRpcResponseFailure(r, ln.builtIn("APPLICATION_ERROR", "Error reading RPC response payload", {
						cause: e
					}));
					return
				}
				this.handleIncomingRpcResponseSuccess(r, n)
			})
		}
		handleIncomingRpcResponseSuccess(e, t) {
			var i, n;
			let r = this.pendingResponses.get(e);
			r ? (null == (n = (i = r.completionFuture).resolve) || n.call(i, t), this.pendingResponses.delete(e)) : this.log.error("Response received for unexpected RPC request", e)
		}
		handleIncomingRpcResponseFailure(e, t) {
			var i, n;
			let r = this.pendingResponses.get(e);
			r ? (null == (n = (i = r.completionFuture).reject) || n.call(i, t), this.pendingResponses.delete(e)) : this.log.error("Response received for unexpected RPC request", e)
		}
		handleIncomingRpcAck(e) {
			let t = this.pendingAcks.get(e);
			t ? (t.resolve(), this.pendingAcks.delete(e)) : this.log.error("Ack received for unexpected RPC request: ".concat(e))
		}
		handleParticipantDisconnected(e) {
			var t;
			for (let t of this.pendingAcks) {
				var i = tg(t, 2);
				let n = i[0];
				i[1].participantIdentity === e && this.pendingAcks.delete(n)
			}
			for (let i of this.pendingResponses) {
				var n = tg(i, 2);
				let a = n[0];
				var r = n[1];
				let s = r.participantIdentity,
					o = r.completionFuture;
				s === e && (null == (t = o.reject) || t.call(o, ln.builtIn("RECIPIENT_DISCONNECTED")), this.pendingResponses.delete(a))
			}
		}
	}
	class ll extends rV.EventEmitter {
		constructor(e, t, i) {
			super(), this.rpcHandlers = new Map, this.log = e, this.outgoingDataStreamManager = t, this.getRemoteParticipantClientProtocol = i
		}
		registerRpcMethod(e, t) {
			if (this.rpcHandlers.has(e)) throw Error("RPC handler already registered for method ".concat(e, ", unregisterRpcMethod before trying to register again"));
			this.rpcHandlers.set(e, t)
		}
		unregisterRpcMethod(e) {
			this.rpcHandlers.delete(e)
		}
		handleIncomingRpcRequest(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i;
				let n;
				if (this.publishRpcAck(e, t.id), 1 !== t.version) return void this.publishRpcResponsePacket(e, t.id, null, ln.builtIn("UNSUPPORTED_VERSION"));
				let r = this.rpcHandlers.get(t.method);
				if (!r) return void this.publishRpcResponsePacket(e, t.id, null, ln.builtIn("UNSUPPORTED_METHOD"));
				try {
					n = yield r({
						requestId: t.id,
						callerIdentity: e,
						payload: t.payload,
						responseTimeout: t.responseTimeoutMs
					})
				} catch (r) {
					let n;
					r instanceof ln ? n = r : (this.log.warn("Uncaught error returned by RPC handler for ".concat(t.method, ". Returning APPLICATION_ERROR instead."), r), n = ln.builtIn("APPLICATION_ERROR", "Uncaught error: ".concat(null != (i = null == r ? void 0 : r.message) ? i : r), {
						cause: r
					})), this.publishRpcResponsePacket(e, t.id, null, n);
					return
				}
				yield this.publishRpcResponse(e, t.id, null != n ? n : "")
			})
		}
		handleIncomingDataStream(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				let n, r, a = i[eJ.RPC_REQUEST_ID],
					s = i[eJ.RPC_REQUEST_METHOD],
					o = parseInt(i[eJ.RPC_REQUEST_RESPONSE_TIMEOUT_MS], 10),
					c = parseInt(i[eJ.RPC_REQUEST_VERSION], 10);
				if (!a || !s || Number.isNaN(o) || Number.isNaN(c)) {
					this.log.warn("RPC data stream malformed: ".concat(eJ.RPC_REQUEST_ID, " / ").concat(eJ.RPC_REQUEST_METHOD, " / ").concat(eJ.RPC_REQUEST_RESPONSE_TIMEOUT_MS, " / ").concat(eJ.RPC_REQUEST_VERSION, " not set.")), this.publishRpcResponsePacket(t, a, null, ln.builtIn("APPLICATION_ERROR", "RPC data stream malformed"));
					return
				}
				if (this.publishRpcAck(t, a), 2 !== c) return void this.publishRpcResponsePacket(t, a, null, ln.builtIn("UNSUPPORTED_VERSION"));
				try {
					n = yield e.readAll()
				} catch (e) {
					this.log.warn("Error reading RPC request payload: ".concat(e)), this.publishRpcResponsePacket(t, a, null, ln.builtIn("APPLICATION_ERROR", "Error reading RPC request payload", {
						cause: e
					}));
					return
				}
				let l = this.rpcHandlers.get(s);
				if (!l) return void this.publishRpcResponsePacket(t, a, null, ln.builtIn("UNSUPPORTED_METHOD"));
				try {
					r = yield l({
						requestId: a,
						callerIdentity: t,
						payload: n,
						responseTimeout: o
					})
				} catch (i) {
					let e;
					i instanceof ln ? e = i : (this.log.warn("Uncaught error returned by RPC handler for ".concat(s, ". Returning APPLICATION_ERROR instead."), i), e = ln.builtIn("APPLICATION_ERROR")), this.publishRpcResponsePacket(t, a, null, e);
					return
				}
				yield this.publishRpcResponse(t, a, null != r ? r : "")
			})
		}
		publishRpcAck(e, t) {
			this.emit("sendDataPacket", {
				packet: new iA({
					destinationIdentities: [e],
					kind: ix.RELIABLE,
					value: {
						case: "rpcAck",
						value: new iK({
							requestId: t
						})
					}
				})
			})
		}
		publishRpcResponsePacket(e, t, i, n) {
			this.emit("sendDataPacket", {
				packet: new iA({
					destinationIdentities: [e],
					kind: ix.RELIABLE,
					value: {
						case: "rpcResponse",
						value: new iz({
							requestId: t,
							value: n ? {
								case: "error",
								value: n.toProto()
							} : {
								case: "payload",
								value: null != i ? i : ""
							}
						})
					}
				})
			})
		}
		publishRpcResponse(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				if (this.getRemoteParticipantClientProtocol(e) >= 1) {
					let n = yield this.outgoingDataStreamManager.streamText({
						topic: la,
						destinationIdentities: [e],
						attributes: {
							[eJ.RPC_REQUEST_ID]: t
						}
					});
					yield n.write(i), yield n.close();
					return
				}
				if (ls(i) > 15360) {
					this.log.warn("RPC Response payload too large for request ".concat(t, ". To send larger responses, consider updating the sending client.")), this.publishRpcResponsePacket(e, t, null, ln.builtIn("RESPONSE_PAYLOAD_TOO_LARGE"));
					return
				}
				this.publishRpcResponsePacket(e, t, i, null)
			})
		}
	}
	class ld extends ov {
		constructor(e, t, i, n, r, a) {
			super(e, t, sp.Kind.Audio, i, a), this.monitorReceiver = () => rF(this, void 0, void 0, function*() {
				if (!this.receiver) {
					this._currentBitrate = 0;
					return
				}
				let e = yield this.getReceiverStats();
				e && this.prevStats && this.receiver && (this._currentBitrate = of(e, this.prevStats)), this.prevStats = e
			}), this.audioContext = n, this.webAudioPluginNodes = [], r && (this.sinkId = r.deviceId)
		}
		setVolume(e) {
			var t;
			for (let i of this.attachedElements) this.audioContext ? null == (t = this.gainNode) || t.gain.setTargetAtTime(e, 0, .1) : i.volume = e;
			sO() && this._mediaStreamTrack._setVolume(e), this.elementVolume = e
		}
		getVolume() {
			if (this.elementVolume) return this.elementVolume;
			if (sO()) return 1;
			let e = 0;
			return this.attachedElements.forEach(t => {
				t.volume > e && (e = t.volume)
			}), e
		}
		setSinkId(e) {
			return rF(this, void 0, void 0, function*() {
				this.sinkId = e, yield Promise.all(this.attachedElements.map(t => {
					if (sC(t)) return t.setSinkId(e)
				}))
			})
		}
		attach(e) {
			let t = 0 === this.attachedElements.length;
			return e ? super.attach(e) : e = super.attach(), this.sinkId && sC(e) && e.setSinkId(this.sinkId).catch(e => {
				this.log.error("Failed to set sink id on remote audio track", e, this.logContext)
			}), this.audioContext && t && (this.log.debug("using audio context mapping", this.logContext), this.connectWebAudio(this.audioContext, e), e.volume = 0, e.muted = !0), this.elementVolume && this.setVolume(this.elementVolume), e
		}
		detach(e) {
			let t;
			return e ? (t = super.detach(e), this.audioContext && (this.attachedElements.length > 0 ? this.connectWebAudio(this.audioContext, this.attachedElements[0]) : this.disconnectWebAudio())) : (t = super.detach(), this.disconnectWebAudio()), t
		}
		setAudioContext(e) {
			this.audioContext = e, e && this.attachedElements.length > 0 ? this.connectWebAudio(e, this.attachedElements[0]) : e || this.disconnectWebAudio()
		}
		setWebAudioPlugins(e) {
			this.webAudioPluginNodes = e, this.attachedElements.length > 0 && this.audioContext && this.connectWebAudio(this.audioContext, this.attachedElements[0])
		}
		connectWebAudio(e, t) {
			this.disconnectWebAudio(), this.sourceNode = e.createMediaStreamSource(t.srcObject);
			let i = this.sourceNode;
			this.webAudioPluginNodes.forEach(e => {
				i.connect(e), i = e
			}), this.gainNode = e.createGain(), i.connect(this.gainNode), this.gainNode.connect(e.destination), this.elementVolume && this.gainNode.gain.setTargetAtTime(this.elementVolume, 0, .1), "running" !== e.state && e.resume().then(() => {
				"running" !== e.state && this.emit(ev.AudioPlaybackFailed, Error("Audio Context couldn't be started automatically"))
			}).catch(e => {
				this.emit(ev.AudioPlaybackFailed, e)
			})
		}
		disconnectWebAudio() {
			var e, t;
			null == (e = this.gainNode) || e.disconnect(), null == (t = this.sourceNode) || t.disconnect(), this.gainNode = void 0, this.sourceNode = void 0
		}
		getReceiverStats() {
			return rF(this, void 0, void 0, function*() {
				let e;
				if (this.receiver && this.receiver.getStats) return (yield this.receiver.getStats()).forEach(t => {
					"inbound-rtp" === t.type && (e = {
						type: "audio",
						streamId: t.id,
						timestamp: t.timestamp,
						jitter: t.jitter,
						bytesReceived: t.bytesReceived,
						concealedSamples: t.concealedSamples,
						concealmentEvents: t.concealmentEvents,
						silentConcealedSamples: t.silentConcealedSamples,
						silentConcealmentEvents: t.silentConcealmentEvents,
						totalAudioEnergy: t.totalAudioEnergy,
						totalSamplesDuration: t.totalSamplesDuration
					})
				}), e
			})
		}
	}
	class lu extends rV.EventEmitter {
		constructor(e, t, i, n) {
			var r;
			super(), this.metadataMuted = !1, this.encryption = iR.NONE, this.log = r_, this.handleMuted = () => {
				this.emit(ev.Muted)
			}, this.handleUnmuted = () => {
				this.emit(ev.Unmuted)
			}, this.log = rA(null != (r = null == n ? void 0 : n.loggerName) ? r : eo.Publication), this.loggerContextCb = this.loggerContextCb, this.setMaxListeners(100), this.kind = e, this.trackSid = t, this.trackName = i, this.source = sp.Source.Unknown
		}
		setTrack(e) {
			this.track && (this.track.off(ev.Muted, this.handleMuted), this.track.off(ev.Unmuted, this.handleUnmuted)), this.track = e, e && (e.on(ev.Muted, this.handleMuted), e.on(ev.Unmuted, this.handleUnmuted))
		}
		get logContext() {
			var e;
			return Object.assign(Object.assign({}, null == (e = this.loggerContextCb) ? void 0 : e.call(this)), sl(this))
		}
		get isMuted() {
			return this.metadataMuted
		}
		get isEnabled() {
			return !0
		}
		get isSubscribed() {
			return void 0 !== this.track
		}
		get isEncrypted() {
			return this.encryption !== iR.NONE
		}
		get audioTrack() {
			if (s1(this.track)) return this.track
		}
		get videoTrack() {
			if (s2(this.track)) return this.track
		}
		updateInfo(e) {
			this.trackSid = e.sid, this.trackName = e.name, this.source = sp.sourceFromProto(e.source), this.mimeType = e.mimeType, this.kind === sp.Kind.Video && e.width > 0 && (this.dimensions = {
				width: e.width,
				height: e.height
			}, this.simulcasted = e.simulcast), this.encryption = e.encryption, this.trackInfo = e, this.log.debug("update publication info", Object.assign(Object.assign({}, this.logContext), {
				info: e
			}))
		}
	}(X = (Y = lu || (lu = {})).SubscriptionStatus || (Y.SubscriptionStatus = {})).Desired = "desired", X.Subscribed = "subscribed", X.Unsubscribed = "unsubscribed", (Z = Y.PermissionStatus || (Y.PermissionStatus = {})).Allowed = "allowed", Z.NotAllowed = "not_allowed";
	class lh extends lu {
		get isUpstreamPaused() {
			var e;
			return null == (e = this.track) ? void 0 : e.isUpstreamPaused
		}
		constructor(e, t, i, n) {
			super(e, t.sid, t.name, n), this.track = void 0, this.handleTrackEnded = () => {
				this.emit(ev.Ended)
			}, this.handleCpuConstrained = () => {
				this.track && s2(this.track) && this.emit(ev.CpuConstrained, this.track)
			}, this.updateInfo(t), this.setTrack(i)
		}
		setTrack(e) {
			this.track && (this.track.off(ev.Ended, this.handleTrackEnded), this.track.off(ev.CpuConstrained, this.handleCpuConstrained)), super.setTrack(e), e && (e.on(ev.Ended, this.handleTrackEnded), e.on(ev.CpuConstrained, this.handleCpuConstrained))
		}
		get isMuted() {
			return this.track ? this.track.isMuted : super.isMuted
		}
		get audioTrack() {
			return super.audioTrack
		}
		get videoTrack() {
			return super.videoTrack
		}
		get isLocal() {
			return !0
		}
		mute() {
			return rF(this, void 0, void 0, function*() {
				var e;
				return null == (e = this.track) ? void 0 : e.mute()
			})
		}
		unmute() {
			return rF(this, void 0, void 0, function*() {
				var e;
				return null == (e = this.track) ? void 0 : e.unmute()
			})
		}
		pauseUpstream() {
			return rF(this, void 0, void 0, function*() {
				var e;
				yield null == (e = this.track) ? void 0 : e.pauseUpstream()
			})
		}
		resumeUpstream() {
			return rF(this, void 0, void 0, function*() {
				var e;
				yield null == (e = this.track) ? void 0 : e.resumeUpstream()
			})
		}
		getTrackFeatures() {
			var e;
			if (!s1(this.track)) return [];
			{
				let t = this.track.getSourceTrackSettings(),
					i = new Set;
				return t.autoGainControl && i.add(iv.TF_AUTO_GAIN_CONTROL), t.echoCancellation && i.add(iv.TF_ECHO_CANCELLATION), t.noiseSuppression && i.add(iv.TF_NOISE_SUPPRESSION), t.channelCount && t.channelCount > 1 && i.add(iv.TF_STEREO), (null == (e = this.options) ? void 0 : e.dtx) || i.add(iv.TF_NO_DTX), this.track.enhancedNoiseCancellation && i.add(iv.TF_ENHANCED_NOISE_CANCELLATION), Array.from(i.values())
			}
		}
	}

	function lp(e, t) {
		return rF(this, void 0, void 0, function*() {
			null != e || (e = {});
			let i = !1,
				n = sd(e),
				r = n.audioProcessor,
				a = n.videoProcessor,
				s = n.optionsWithoutProcessor,
				o = s.audio,
				c = s.video;
			if (r && "object" == typeof s.audio && (s.audio.processor = r), a && "object" == typeof s.video && (s.video.processor = a), e.audio && "object" == typeof s.audio && "string" == typeof s.audio.deviceId) {
				let e = s.audio.deviceId;
				s.audio.deviceId = {
					exact: e
				}, i = !0, o = Object.assign(Object.assign({}, s.audio), {
					deviceId: {
						ideal: e
					}
				})
			}
			if (s.video && "object" == typeof s.video && "string" == typeof s.video.deviceId) {
				let e = s.video.deviceId;
				s.video.deviceId = {
					exact: e
				}, i = !0, c = Object.assign(Object.assign({}, s.video), {
					deviceId: {
						ideal: e
					}
				})
			}!0 === s.audio ? s.audio = {
				deviceId: "default"
			} : "object" == typeof s.audio && null !== s.audio && (s.audio = Object.assign(Object.assign({}, s.audio), {
				deviceId: s.audio.deviceId || "default"
			})), !0 === s.video ? s.video = {
				deviceId: "default"
			} : "object" != typeof s.video || s.video.deviceId || (s.video.deviceId = "default");
			let l = sn(st(s, o3, o4)),
				d = navigator.mediaDevices.getUserMedia(l);
			s.audio && (oP.userMediaPromiseMap.set("audioinput", d), d.catch(() => oP.userMediaPromiseMap.delete("audioinput"))), s.video && (oP.userMediaPromiseMap.set("videoinput", d), d.catch(() => oP.userMediaPromiseMap.delete("videoinput")));
			try {
				let e = yield d;
				return yield Promise.all(e.getTracks().map(i => rF(this, void 0, void 0, function*() {
					let n, s = "audio" === i.kind ? l.audio : l.video;
					"boolean" != typeof s && (n = s);
					let o = i.getSettings().deviceId;
					(null == n ? void 0 : n.deviceId) && sQ(n.deviceId) !== o ? n.deviceId = o : n || (n = {
						deviceId: o
					});
					let c = function(e, t, i) {
						switch (e.kind) {
							case "audio":
								return new ci(e, t, !1, void 0, i);
							case "video":
								return new cg(e, t, !1, i);
							default:
								throw new aJ("unsupported track type: ".concat(e.kind))
						}
					}(i, n, t);
					return c.kind === sp.Kind.Video ? c.source = sp.Source.Camera : c.kind === sp.Kind.Audio && (c.source = sp.Source.Microphone), c.mediaStream = e, s1(c) && r ? yield c.setProcessor(r): s2(c) && a && (yield c.setProcessor(a)), c
				})))
			} catch (n) {
				if (!i) throw n;
				return lp(Object.assign(Object.assign({}, e), {
					audio: o,
					video: c
				}), t)
			}
		})
	}

	function lm(e) {
		return rF(this, void 0, void 0, function*() {
			return (yield lp({
				audio: !1,
				video: null == e || e
			}))[0]
		})
	}

	function lg(e) {
		return rF(this, void 0, void 0, function*() {
			return (yield lp({
				audio: null == e || e,
				video: !1
			}))[0]
		})
	}($ = eG || (eG = {})).Excellent = "excellent", $.Good = "good", $.Poor = "poor", $.Lost = "lost", $.Unknown = "unknown";
	class lf extends rV.EventEmitter {
		get logContext() {
			var e, t;
			return Object.assign({}, null == (t = null == (e = this.loggerOptions) ? void 0 : e.loggerContextCb) ? void 0 : t.call(e))
		}
		get isEncrypted() {
			return this.trackPublications.size > 0 && Array.from(this.trackPublications.values()).every(e => e.isEncrypted)
		}
		get isAgent() {
			var e;
			return (null == (e = this.permissions) ? void 0 : e.agent) || this.kind === iw.AGENT
		}
		get isActive() {
			var e;
			return (null == (e = this.participantInfo) ? void 0 : e.state) === iC.ACTIVE
		}
		get kind() {
			return this._kind
		}
		get attributes() {
			return Object.freeze(Object.assign({}, this._attributes))
		}
		constructor(e, t, i, n, r, a) {
			var s;
			let o = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : iw.STANDARD;
			super(), this.audioLevel = 0, this.isSpeaking = !1, this._connectionQuality = eG.Unknown, this.log = r_, this.loggerOptions = a, this.log = rA(null != (s = null == a ? void 0 : a.loggerName) ? s : eo.Participant, () => this.logContext), this.setMaxListeners(100), this.sid = e, this.identity = t, this.name = i, this.metadata = n, this.audioTrackPublications = new Map, this.videoTrackPublications = new Map, this.trackPublications = new Map, this._kind = o, this._attributes = null != r ? r : {}
		}
		getTrackPublications() {
			return Array.from(this.trackPublications.values())
		}
		getTrackPublication(e) {
			for (let t of this.trackPublications) {
				let i = tg(t, 2)[1];
				if (i.source === e) return i
			}
		}
		getTrackPublicationByName(e) {
			for (let t of this.trackPublications) {
				let i = tg(t, 2)[1];
				if (i.trackName === e) return i
			}
		}
		waitUntilActive() {
			return this.isActive ? Promise.resolve() : (this.activeFuture || (this.activeFuture = new sJ, this.once(eg.Active, () => {
				var e, t;
				null == (t = null == (e = this.activeFuture) ? void 0 : e.resolve) || t.call(e), this.activeFuture = void 0
			})), this.activeFuture.promise)
		}
		get connectionQuality() {
			return this._connectionQuality
		}
		get isCameraEnabled() {
			var e;
			let t = this.getTrackPublication(sp.Source.Camera);
			return !(null == (e = null == t ? void 0 : t.isMuted) || e)
		}
		get isMicrophoneEnabled() {
			var e;
			let t = this.getTrackPublication(sp.Source.Microphone);
			return !(null == (e = null == t ? void 0 : t.isMuted) || e)
		}
		get isScreenShareEnabled() {
			return !!this.getTrackPublication(sp.Source.ScreenShare)
		}
		get isLocal() {
			return !1
		}
		get joinedAt() {
			return this.participantInfo ? new Date(1e3 * Number.parseInt(this.participantInfo.joinedAt.toString())) : new Date
		}
		updateInfo(e) {
			var t;
			return (!this.participantInfo || this.participantInfo.sid !== e.sid || !(this.participantInfo.version > e.version)) && (this.identity = e.identity, this.sid = e.sid, this._setName(e.name), this._setMetadata(e.metadata), this._setAttributes(e.attributes), e.state === iC.ACTIVE && (null == (t = this.participantInfo) ? void 0 : t.state) !== iC.ACTIVE && this.emit(eg.Active), e.permission && this.setPermissions(e.permission), this.participantInfo = e, !0)
		}
		_setMetadata(e) {
			let t = this.metadata !== e,
				i = this.metadata;
			this.metadata = e, t && this.emit(eg.ParticipantMetadataChanged, i)
		}
		_setName(e) {
			let t = this.name !== e;
			this.name = e, t && this.emit(eg.ParticipantNameChanged, e)
		}
		_setAttributes(e) {
			let t = function(e, t) {
				var i;
				void 0 === e && (e = {}), void 0 === t && (t = {});
				let n = [...Object.keys(t), ...Object.keys(e)],
					r = {};
				for (let a of n) e[a] !== t[a] && (r[a] = null != (i = t[a]) ? i : "");
				return r
			}(this.attributes, e);
			this._attributes = e, Object.keys(t).length > 0 && this.emit(eg.AttributesChanged, t)
		}
		setPermissions(e) {
			var t, i, n, r, a, s;
			let o = this.permissions,
				c = e.canPublish !== (null == (t = this.permissions) ? void 0 : t.canPublish) || e.canSubscribe !== (null == (i = this.permissions) ? void 0 : i.canSubscribe) || e.canPublishData !== (null == (n = this.permissions) ? void 0 : n.canPublishData) || e.hidden !== (null == (r = this.permissions) ? void 0 : r.hidden) || e.recorder !== (null == (a = this.permissions) ? void 0 : a.recorder) || e.canPublishSources.length !== this.permissions.canPublishSources.length || e.canPublishSources.some((e, t) => {
					var i;
					return e !== (null == (i = this.permissions) ? void 0 : i.canPublishSources[t])
				}) || e.canSubscribeMetrics !== (null == (s = this.permissions) ? void 0 : s.canSubscribeMetrics);
			return this.permissions = e, c && this.emit(eg.ParticipantPermissionsChanged, o), c
		}
		setIsSpeaking(e) {
			e !== this.isSpeaking && (this.isSpeaking = e, e && (this.lastSpokeAt = new Date), this.emit(eg.IsSpeakingChanged, e))
		}
		setConnectionQuality(e) {
			let t = this._connectionQuality;
			this._connectionQuality = function(e) {
				switch (e) {
					case iu.EXCELLENT:
						return eG.Excellent;
					case iu.GOOD:
						return eG.Good;
					case iu.POOR:
						return eG.Poor;
					case iu.LOST:
						return eG.Lost;
					default:
						return eG.Unknown
				}
			}(e), t !== this._connectionQuality && this.emit(eg.ConnectionQualityChanged, this._connectionQuality)
		}
		setDisconnected() {
			var e, t;
			this.activeFuture && (null == (t = (e = this.activeFuture).reject) || t.call(e, Error("Participant disconnected")), this.activeFuture = void 0)
		}
		setAudioContext(e) {
			this.audioContext = e, this.audioTrackPublications.forEach(t => s1(t.track) && t.track.setAudioContext(e))
		}
		addTrackPublication(e) {
			switch (this.log.debug("adding track publication", {
					trackSid: e.trackSid,
					source: e.source,
					kind: e.kind
				}), e.on(ev.Muted, () => {
					this.emit(eg.TrackMuted, e)
				}), e.on(ev.Unmuted, () => {
					this.emit(eg.TrackUnmuted, e)
				}), e.track && (e.track.sid = e.trackSid), this.trackPublications.set(e.trackSid, e), e.kind) {
				case sp.Kind.Audio:
					this.audioTrackPublications.set(e.trackSid, e);
					break;
				case sp.Kind.Video:
					this.videoTrackPublications.set(e.trackSid, e)
			}
		}
	}
	class lv extends lf {
		constructor(e, t, i, n, r, a, s, o) {
			super(e, t, void 0, void 0, void 0, {
				loggerName: n.loggerName,
				loggerContextCb: () => this.engine.logContext
			}), this.pendingPublishing = new Set, this.pendingPublishPromises = new Map, this.participantTrackPermissions = [], this.allParticipantsAllowedToSubscribe = !0, this.encryptionType = iR.NONE, this.e2eeStateMutex = new e0, this.enabledPublishVideoCodecs = [], this.handleReconnecting = () => {
				this.reconnectFuture || (this.reconnectFuture = new sJ)
			}, this.handleReconnected = () => {
				var e, t;
				null == (t = null == (e = this.reconnectFuture) ? void 0 : e.resolve) || t.call(e), this.reconnectFuture = void 0, this.updateTrackSubscriptionPermissions()
			}, this.handleClosing = () => {
				var e, t, i, n, r, a;
				this.reconnectFuture && (this.reconnectFuture.promise.catch(e => this.log.warn(e.message)), null == (t = null == (e = this.reconnectFuture) ? void 0 : e.reject) || t.call(e, Error("Got disconnected during reconnection attempt")), this.reconnectFuture = void 0), this.signalConnectedFuture && (null == (n = (i = this.signalConnectedFuture).reject) || n.call(i, Error("Got disconnected without signal connected")), this.signalConnectedFuture = void 0), null == (a = null == (r = this.activeAgentFuture) ? void 0 : r.reject) || a.call(r, Error("Got disconnected without active agent present")), this.activeAgentFuture = void 0, this.firstActiveAgent = void 0
			}, this.handleSignalConnected = e => {
				var t, i;
				e.participant && this.updateInfo(e.participant), this.signalConnectedFuture || (this.signalConnectedFuture = new sJ), null == (i = (t = this.signalConnectedFuture).resolve) || i.call(t)
			}, this.handleSignalRequestResponse = e => {
				let t = e.requestId,
					i = e.reason,
					n = e.message,
					r = this.pendingSignalRequests.get(t);
				if (r && (i !== ry.OK && r.reject(new a$(n, i)), this.pendingSignalRequests.delete(t)), "publishDataTrack" === e.request.case) {
					let t;
					switch (e.reason) {
						case ry.NOT_ALLOWED:
							t = c6.notAllowed(e.message);
							break;
						case ry.DUPLICATE_NAME:
							t = c6.duplicateName(e.message);
							break;
						case ry.INVALID_NAME:
							t = c6.invalidName(e.message);
							break;
						case ry.LIMIT_EXCEEDED:
							t = c6.limitReached(e.message);
							break;
						default:
							t = c6.unknown(e.reason, e.message)
					}
					this.roomOutgoingDataTrackManager.receivedSfuPublishResponse(e.request.value.pubHandle, {
						type: "error",
						error: t
					})
				}
			}, this.updateTrackSubscriptionPermissions = () => {
				this.log.debug("updating track subscription permissions", {
					allParticipantsAllowed: this.allParticipantsAllowedToSubscribe,
					participantTrackPermissions: this.participantTrackPermissions
				}), this.engine.client.sendUpdateSubscriptionPermissions(this.allParticipantsAllowedToSubscribe, this.participantTrackPermissions.map(e => (function(e) {
					var t, i, n;
					if (!e.participantSid && !e.participantIdentity) throw Error("Invalid track permission, must provide at least one of participantIdentity and participantSid");
					return new ra({
						participantIdentity: null != (t = e.participantIdentity) ? t : "",
						participantSid: null != (i = e.participantSid) ? i : "",
						allTracks: null != (n = e.allowAll) && n,
						trackSids: e.allowedTrackSids || []
					})
				})(e)))
			}, this.onTrackUnmuted = e => {
				this.onTrackMuted(e, e.isUpstreamPaused)
			}, this.onTrackMuted = (e, t) => {
				(void 0 === t && (t = !0), e.sid) ? this.engine.updateMuteStatus(e.sid, t): this.log.error("could not update mute status for unpublished track", sl(e))
			}, this.onTrackUpstreamPaused = e => {
				this.log.debug("upstream paused", sl(e)), this.onTrackMuted(e, !0)
			}, this.onTrackUpstreamResumed = e => {
				this.log.debug("upstream resumed", sl(e)), this.onTrackMuted(e, e.isMuted)
			}, this.onTrackFeatureUpdate = e => {
				let t = this.audioTrackPublications.get(e.sid);
				t ? this.engine.client.sendUpdateLocalAudioTrack(t.trackSid, t.getTrackFeatures()) : this.log.warn("Could not update local audio track settings, missing publication for track ".concat(e.sid))
			}, this.onTrackCpuConstrained = (e, t) => {
				this.log.debug("track cpu constrained", sl(t)), this.emit(eg.LocalTrackCpuConstrained, e, t)
			}, this.handleSubscribedQualityUpdate = e => rF(this, void 0, void 0, function*() {
				if (!(null == (o = this.roomOptions) ? void 0 : o.dynacast)) return;
				let t = this.videoTrackPublications.get(e.trackSid);
				if (!t) return void this.log.warn("received subscribed quality update for unknown track", {
					trackSid: e.trackSid
				});
				if (!t.videoTrack) return;
				let i = yield t.videoTrack.setPublishingCodecs(e.subscribedCodecs);
				try {
					for (var n, r, a, s, o, c, l = !0, d = rj(i); !(n = (c = yield d.next()).done); l = !0) s = c.value, l = !1, a8(s) && (this.log.debug("publish ".concat(s, " for ").concat(t.videoTrack.sid), sl(t)), yield this.publishAdditionalCodecForTrack(t.videoTrack, s, t.options))
				} catch (e) {
					r = {
						error: e
					}
				} finally {
					try {
						!l && !n && (a = d.return) && (yield a.call(d))
					} finally {
						if (r) throw r.error
					}
				}
			}), this.handleLocalTrackUnpublished = e => {
				let t = this.trackPublications.get(e.trackSid);
				t ? this.unpublishTrack(t.track) : this.log.warn("received unpublished event for unknown track", {
					trackSid: e.trackSid
				})
			}, this.handleTrackEnded = e => rF(this, void 0, void 0, function*() {
				if (e.source === sp.Source.ScreenShare || e.source === sp.Source.ScreenShareAudio) this.log.debug("unpublishing local track due to TrackEnded", sl(e)), this.unpublishTrack(e);
				else if (e.isUserProvided) yield e.mute();
				else if (s4(e) || s3(e)) try {
					if (s_()) try {
						let t = yield null == navigator ? void 0 : navigator.permissions.query({
							name: e.source === sp.Source.Camera ? "camera" : "microphone"
						});
						if (t && "denied" === t.state) throw this.log.warn("user has revoked access to ".concat(e.source), sl(e)), t.onchange = () => {
							"denied" !== t.state && (e.isMuted || e.restartTrack(), t.onchange = null)
						}, Error("GetUserMedia Permission denied")
					} catch (e) {}
					e.isMuted || (this.log.debug("track ended, attempting to use a different device", sl(e)), s4(e) ? yield e.restartTrack({
						deviceId: "default"
					}): yield e.restartTrack())
				} catch (t) {
					this.log.warn("could not restart track, muting instead", sl(e)), yield e.mute()
				}
			}), this.audioTrackPublications = new Map, this.videoTrackPublications = new Map, this.trackPublications = new Map, this.engine = i, this.roomOptions = n, this.setupEngine(i), this.activeDeviceMap = new Map([
				["audioinput", "default"],
				["videoinput", "default"],
				["audiooutput", "default"]
			]), this.pendingSignalRequests = new Map, this.roomOutgoingDataStreamManager = r, this.roomOutgoingDataTrackManager = a, this.rpcClientManager = s, this.rpcServerManager = o
		}
		get lastCameraError() {
			return this.cameraError
		}
		get lastMicrophoneError() {
			return this.microphoneError
		}
		get isE2EEEnabled() {
			return this.encryptionType !== iR.NONE
		}
		getTrackPublication(e) {
			let t = super.getTrackPublication(e);
			if (t) return t
		}
		getTrackPublicationByName(e) {
			let t = super.getTrackPublicationByName(e);
			if (t) return t
		}
		setupEngine(e) {
			var t;
			this.engine = e, this.engine.on(ef.RemoteMute, (e, t) => {
				let i = this.trackPublications.get(e);
				i && i.track && (t ? i.mute() : i.unmute())
			}), (null == (t = this.signalConnectedFuture) ? void 0 : t.isResolved) && (this.signalConnectedFuture = void 0), this.engine.on(ef.Connected, this.handleReconnected).on(ef.SignalConnected, this.handleSignalConnected).on(ef.SignalRestarted, this.handleReconnected).on(ef.SignalResumed, this.handleReconnected).on(ef.Restarting, this.handleReconnecting).on(ef.Resuming, this.handleReconnecting).on(ef.LocalTrackUnpublished, this.handleLocalTrackUnpublished).on(ef.SubscribedQualityUpdate, this.handleSubscribedQualityUpdate).on(ef.Closing, this.handleClosing).on(ef.SignalRequestResponse, this.handleSignalRequestResponse)
		}
		setMetadata(e) {
			return rF(this, void 0, void 0, function*() {
				yield this.requestMetadataUpdate({
					metadata: e
				})
			})
		}
		setName(e) {
			return rF(this, void 0, void 0, function*() {
				yield this.requestMetadataUpdate({
					name: e
				})
			})
		}
		setAttributes(e) {
			return rF(this, void 0, void 0, function*() {
				yield this.requestMetadataUpdate({
					attributes: e
				})
			})
		}
		requestMetadataUpdate(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = e.metadata,
					n = e.name,
					r = e.attributes;
				return function*() {
					return new aN((e, a) => rF(t, void 0, void 0, function*() {
						var t, s;
						try {
							let o = !1,
								c = yield this.engine.client.sendUpdateLocalMetadata(null != (t = null != i ? i : this.metadata) ? t : "", null != (s = null != n ? n : this.name) ? s : "", r), l = performance.now();
							for (this.pendingSignalRequests.set(c, {
									resolve: e,
									reject: e => {
										a(e), o = !0
									},
									values: {
										name: n,
										metadata: i,
										attributes: r
									}
								}); performance.now() - l < 5e3 && !o;) {
								if ((!n || this.name === n) && (!i || this.metadata === i) && (!r || Object.entries(r).every(e => {
										let t = tg(e, 2),
											i = t[0],
											n = t[1];
										return this.attributes[i] === n || "" === n && !this.attributes[i]
									}))) {
									this.pendingSignalRequests.delete(c), e();
									return
								}
								yield sv(50)
							}
							a(new a$("Request to update local metadata timed out", "TimeoutError"))
						} catch (e) {
							e instanceof Error ? a(e) : a(Error(String(e)))
						}
					}))
				}()
			})
		}
		setCameraEnabled(e, t, i) {
			return this.setTrackEnabled(sp.Source.Camera, e, t, i)
		}
		setMicrophoneEnabled(e, t, i) {
			return this.setTrackEnabled(sp.Source.Microphone, e, t, i)
		}
		setScreenShareEnabled(e, t, i) {
			return this.setTrackEnabled(sp.Source.ScreenShare, e, t, i)
		}
		setE2EEEnabled(e) {
			return rF(this, void 0, void 0, function*() {
				let t = yield this.e2eeStateMutex.lock();
				try {
					if (this.encryptionType = e ? iR.GCM : iR.NONE, yield Promise.all(this.pendingPublishPromises.values()), 0 === this.trackPublications.size || Array.from(this.trackPublications.values()).every(t => t.isEncrypted === e)) return;
					yield this.republishAllTracks(void 0, !1)
				} finally {
					t()
				}
			})
		}
		setTrackEnabled(e, t, i, n) {
			return rF(this, void 0, void 0, function*() {
				this.log.debug("setTrackEnabled", {
					source: e,
					enabled: t
				}), this.republishPromise && (yield this.republishPromise);
				let r = this.getTrackPublication(e);
				if (t)
					if (r) yield r.unmute();
					else {
						let t;
						if (this.pendingPublishing.has(e)) {
							let t = yield this.waitForPendingPublicationOfSource(e);
							return t || this.log.info("waiting for pending publication promise timed out", {
								source: e
							}), yield null == t ? void 0 : t.unmute(), t
						}
						this.pendingPublishing.add(e);
						try {
							switch (e) {
								case sp.Source.Camera:
									t = yield this.createTracks({
										video: null == i || i
									});
									break;
								case sp.Source.Microphone:
									t = yield this.createTracks({
										audio: null == i || i
									});
									break;
								case sp.Source.ScreenShare:
									t = yield this.createScreenTracks(Object.assign({}, i));
									break;
								default:
									throw new aJ(e)
							}
						} catch (i) {
							throw null == t || t.forEach(e => {
								e.stop()
							}), i instanceof Error && this.emit(eg.MediaDevicesError, i, ss(e)), this.pendingPublishing.delete(e), i
						}
						for (let n of t) {
							let t = Object.assign(Object.assign({}, this.roomOptions.publishDefaults), i);
							e === sp.Source.Microphone && s1(n) && t.preConnectBuffer && (this.log.info("starting preconnect buffer for microphone"), n.startPreConnectBuffer())
						}
						try {
							let e = [];
							for (let i of t) this.log.info("publishing track", sl(i)), e.push(this.publishTrack(i, n));
							let i = yield Promise.all(e);
							r = tg(i, 1)[0]
						} catch (e) {
							throw null == t || t.forEach(e => {
								e.stop()
							}), e
						} finally {
							this.pendingPublishing.delete(e)
						}
					}
				else if (!(null == r ? void 0 : r.track) && this.pendingPublishing.has(e) && ((r = yield this.waitForPendingPublicationOfSource(e)) || this.log.info("waiting for pending publication promise timed out", {
						source: e
					})), r && r.track)
					if (e === sp.Source.ScreenShare) {
						let e = [this.unpublishTrack(r.track)],
							t = this.getTrackPublication(sp.Source.ScreenShareAudio);
						t && t.track && e.push(this.unpublishTrack(t.track)), r = tg((yield Promise.all(e)), 1)[0]
					} else yield r.mute();
				return r
			})
		}
		enableCameraAndMicrophone() {
			return rF(this, void 0, void 0, function*() {
				if (!(this.pendingPublishing.has(sp.Source.Camera) || this.pendingPublishing.has(sp.Source.Microphone))) {
					this.pendingPublishing.add(sp.Source.Camera), this.pendingPublishing.add(sp.Source.Microphone);
					try {
						let e = yield this.createTracks({
							audio: !0,
							video: !0
						});
						yield Promise.all(e.map(e => this.publishTrack(e)))
					} finally {
						this.pendingPublishing.delete(sp.Source.Camera), this.pendingPublishing.delete(sp.Source.Microphone)
					}
				}
			})
		}
		createTracks(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i;
				null != e || (e = {});
				let n = st(e, null == (t = this.roomOptions) ? void 0 : t.audioCaptureDefaults, null == (i = this.roomOptions) ? void 0 : i.videoCaptureDefaults);
				try {
					return (yield lp(n, {
						loggerName: this.roomOptions.loggerName,
						loggerContextCb: () => this.logContext
					})).map(e => (s1(e) && (this.microphoneError = void 0, e.setAudioContext(this.audioContext), e.source = sp.Source.Microphone, this.emit(eg.AudioStreamAcquired)), s2(e) && (this.cameraError = void 0, e.source = sp.Source.Camera), e))
				} catch (t) {
					throw t instanceof Error && (e.audio && (this.microphoneError = t), e.video && (this.cameraError = t)), t
				}
			})
		}
		createScreenTracks(e) {
			return rF(this, void 0, void 0, function*() {
				if (void 0 === e && (e = {}), void 0 === navigator.mediaDevices.getDisplayMedia) throw new az("getDisplayMedia not supported");
				void 0 !== e.resolution || sD() || (e.resolution = se.h1080fps30.resolution);
				let t = so(e),
					i = yield navigator.mediaDevices.getDisplayMedia(t), n = i.getVideoTracks();
				if (0 === n.length) throw new aJ("no video track found");
				let r = new cg(n[0], void 0, !1, {
					loggerName: this.roomOptions.loggerName,
					loggerContextCb: () => this.logContext
				});
				r.source = sp.Source.ScreenShare, e.contentHint && (r.mediaStreamTrack.contentHint = e.contentHint);
				let a = [r];
				if (i.getAudioTracks().length > 0) {
					this.emit(eg.AudioStreamAcquired);
					let e = new ci(i.getAudioTracks()[0], void 0, !1, this.audioContext, {
						loggerName: this.roomOptions.loggerName,
						loggerContextCb: () => this.logContext
					});
					e.source = sp.Source.ScreenShareAudio, a.push(e)
				}
				return a
			})
		}
		publishTrack(e, t) {
			return rF(this, void 0, void 0, function*() {
				return this.publishOrRepublishTrack(e, t)
			})
		}
		waitForNextEngineRestart() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 15e3;
			return new Promise((t, i) => {
				let n = () => {
						clearTimeout(s), this.engine.off(ef.Restarted, r), this.engine.off(ef.Closing, a)
					},
					r = () => {
						n(), t()
					},
					a = () => {
						n(), i(Error("engine closed before restart completed"))
					},
					s = setTimeout(() => {
						n(), i(Error("timed out waiting for engine restart"))
					}, e);
				this.engine.once(ef.Restarted, r), this.engine.once(ef.Closing, a)
			})
		}
		publishOrRepublishTrack(e, t) {
			return rF(this, arguments, void 0, function(e, t) {
				var i = this;
				let n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
					r = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
				return function*() {
					var a, s;
					let o, c;
					if (s4(e) && e.setAudioContext(i.audioContext), yield null == (a = i.reconnectFuture) ? void 0 : a.promise, i.republishPromise && !n && (yield i.republishPromise), s0(e) && i.pendingPublishPromises.has(e) && (yield i.pendingPublishPromises.get(e)), e instanceof MediaStreamTrack) o = e.getConstraints();
					else {
						let t;
						switch (o = e.constraints, e.source) {
							case sp.Source.Microphone:
								t = "audioinput";
								break;
							case sp.Source.Camera:
								t = "videoinput"
						}
						t && i.activeDeviceMap.has(t) && (o = Object.assign(Object.assign({}, o), {
							deviceId: i.activeDeviceMap.get(t)
						}))
					}
					if (e instanceof MediaStreamTrack) switch (e.kind) {
						case "audio":
							e = new ci(e, o, !0, i.audioContext, {
								loggerName: i.roomOptions.loggerName,
								loggerContextCb: () => i.logContext
							});
							break;
						case "video":
							e = new cg(e, o, !0, {
								loggerName: i.roomOptions.loggerName,
								loggerContextCb: () => i.logContext
							});
							break;
						default:
							throw new aJ("unsupported MediaStreamTrack kind ".concat(e.kind))
					} else e.updateLoggerOptions({
						loggerName: i.roomOptions.loggerName,
						loggerContextCb: () => i.logContext
					});
					if (i.trackPublications.forEach(t => {
							t.track && t.track === e && (c = t)
						}), c) return i.log.warn("track has already been published, skipping", sl(c)), c;
					let l = Object.assign(Object.assign({}, i.roomOptions.publishDefaults), t),
						d = "channelCount" in e.mediaStreamTrack.getSettings() && 2 === e.mediaStreamTrack.getSettings().channelCount || 2 === e.mediaStreamTrack.getConstraints().channelCount,
						u = null != (s = l.forceStereo) ? s : d;
					u && (void 0 === l.dtx && i.log.debug("Opus DTX will be disabled for stereo tracks by default. Enable them explicitly to make it work.", sl(e)), void 0 === l.red && i.log.debug("Opus RED will be disabled for stereo tracks by default. Enable them explicitly to make it work."), null != l.dtx || (l.dtx = !1), null != l.red || (l.red = !1)), ! function() {
						let e = aF(),
							t = "17.2";
						if (e)
							if ("Safari" !== e.name && "iOS" !== e.os) return !0;
							else if ("iOS" === e.os && e.osVersion && sF(e.osVersion, t) >= 0) return !0;
						else if ("Safari" === e.name && sF(e.version, t) >= 0) return !0;
						else return !1
					}() && i.roomOptions.e2ee && (i.log.info("End-to-end encryption is set up, simulcast publishing will be disabled on Safari versions and iOS browsers running iOS < v17.2"), l.simulcast = !1), l.source && (e.source = l.source);
					let h = new Promise((t, n) => rF(i, void 0, void 0, function*() {
						try {
							if (this.engine.client.currentState !== eI.CONNECTED) {
								this.log.debug("deferring track publication until signal is connected", {
									track: sl(e)
								});
								let i = !1,
									r = setTimeout(() => {
										i = !0, e.stop(), n(new aZ("publishing rejected as engine not connected within timeout", 408))
									}, 15e3);
								if (yield this.waitUntilEngineConnected(), clearTimeout(r), i) return;
								let a = yield this.publish(e, l, u);
								t(a)
							} else try {
								let i = yield this.publish(e, l, u);
								t(i)
							} catch (e) {
								n(e)
							}
						} catch (e) {
							n(e)
						}
					}));
					i.pendingPublishPromises.set(e, h);
					try {
						return yield h
					} catch (a) {
						if (!r && a instanceof aY) return i.log.warn("negotiation due to track publish failed, retrying after reconnect", {
							error: a
						}), i.pendingPublishPromises.delete(e), yield i.waitForNextEngineRestart(), yield i.publishOrRepublishTrack(e, t, n, !0);
						throw a
					} finally {
						i.pendingPublishPromises.delete(e)
					}
				}()
			})
		}
		waitUntilEngineConnected() {
			return this.signalConnectedFuture || (this.signalConnectedFuture = new sJ), this.signalConnectedFuture.promise
		}
		hasPermissionsToPublish(e) {
			if (!this.permissions) return this.log.warn("no permissions present for publishing track", sl(e)), !1;
			let t = this.permissions,
				i = t.canPublish,
				n = t.canPublishSources;
			return !!(i && (0 === n.length || n.map(e => (function(e) {
				switch (e) {
					case il.CAMERA:
						return sp.Source.Camera;
					case il.MICROPHONE:
						return sp.Source.Microphone;
					case il.SCREEN_SHARE:
						return sp.Source.ScreenShare;
					case il.SCREEN_SHARE_AUDIO:
						return sp.Source.ScreenShareAudio;
					default:
						return sp.Source.Unknown
				}
			})(e)).includes(e.source))) || (this.log.warn("insufficient permissions to publish", sl(e)), !1)
		}
		publish(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				var n, r, a, s, o, c, l, d, u, h;
				let p, m;
				if (!this.hasPermissionsToPublish(e)) throw new aZ("failed to publish track, insufficient permissions", 403);
				Array.from(this.trackPublications.values()).find(t => s0(e) && t.source === e.source) && e.source !== sp.Source.Unknown && this.log.info("publishing a second track with the same source: ".concat(e.source), sl(e)), t.stopMicTrackOnMute && s1(e) && (e.stopOnMute = !0), e.source === sp.Source.ScreenShare && sE() && (t.simulcast = !1), "av1" !== t.videoCodec || sb() || (t.videoCodec = void 0), "vp9" !== t.videoCodec || sT() || (t.videoCodec = void 0), void 0 === t.videoCodec && (t.videoCodec = "vp8"), this.enabledPublishVideoCodecs.length > 0 && !this.enabledPublishVideoCodecs.some(e => t.videoCodec === sc(e.mime)) && (t.videoCodec = sc(this.enabledPublishVideoCodecs[0].mime));
				let g = t.videoCodec;
				e.on(ev.Muted, this.onTrackMuted), e.on(ev.Unmuted, this.onTrackUnmuted), e.on(ev.Ended, this.handleTrackEnded), e.on(ev.UpstreamPaused, this.onTrackUpstreamPaused), e.on(ev.UpstreamResumed, this.onTrackUpstreamResumed), e.on(ev.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate);
				let f = [],
					v = !(null == (n = t.dtx) || n),
					k = e.getSourceTrackSettings();
				k.autoGainControl && f.push(iv.TF_AUTO_GAIN_CONTROL), k.echoCancellation && f.push(iv.TF_ECHO_CANCELLATION), k.noiseSuppression && f.push(iv.TF_NOISE_SUPPRESSION), k.channelCount && k.channelCount > 1 && f.push(iv.TF_STEREO), v && f.push(iv.TF_NO_DTX), s4(e) && e.hasPreConnectBuffer && f.push(iv.TF_PRECONNECT_BUFFER);
				let y = this.normalizeRequestedFrameMetadataOptions(e, t),
					b = new nA({
						cid: e.mediaStreamTrack.id,
						name: t.name,
						type: sp.kindToProto(e.kind),
						muted: e.isMuted,
						source: sp.sourceToProto(e.source),
						disableDtx: v,
						encryption: this.encryptionType,
						stereo: i,
						disableRed: this.isE2EEEnabled || !(null == (r = t.red) || r),
						stream: null == t ? void 0 : t.stream,
						backupCodecPolicy: null == t ? void 0 : t.backupCodecPolicy,
						audioFeatures: f,
						packetTrailerFeatures: y
					});
				if (e.kind === sp.Kind.Video) {
					let i;
					try {
						i = yield e.waitForDimensions()
					} catch (n) {
						let t = null != (s = null == (a = this.roomOptions.videoCaptureDefaults) ? void 0 : a.resolution) ? s : a5.h720.resolution;
						i = {
							width: t.width,
							height: t.height
						}, this.log.error("could not determine track dimensions, using defaults", Object.assign(Object.assign({}, sl(e)), {
							dims: i
						}))
					}
					b.width = i.width, b.height = i.height, s3(e) && (sS(g) && (e.source === sp.Source.ScreenShare && (t.scalabilityMode = "L1T3", "contentHint" in e.mediaStreamTrack && (e.mediaStreamTrack.contentHint = "motion", this.log.debug("forcing contentHint to motion for screenshare with SVC codecs", sl(e)))), t.scalabilityMode = null != (o = t.scalabilityMode) ? o : "L3T3_KEY"), b.simulcastCodecs = [new nO({
						codec: g,
						cid: e.mediaStreamTrack.id
					})], !0 === t.backupCodec && (t.backupCodec = {
						codec: "vp8"
					}), t.backupCodec && g !== t.backupCodec.codec && b.encryption === iR.NONE && (this.roomOptions.dynacast || (this.roomOptions.dynacast = !0), b.simulcastCodecs.push(new nO({
						codec: t.backupCodec.codec,
						cid: ""
					})))), p = cl(e.source === sp.Source.ScreenShare, b.width, b.height, t), b.layers = ck(b.width, b.height, p, sS(t.videoCodec))
				} else e.kind === sp.Kind.Audio && (p = [{
					maxBitrate: null == (c = t.audioPreset) ? void 0 : c.maxBitrate,
					priority: null != (d = null == (l = t.audioPreset) ? void 0 : l.priority) ? d : "high",
					networkPriority: null != (h = null == (u = t.audioPreset) ? void 0 : u.priority) ? h : "high"
				}]);
				if (!this.engine || this.engine.isClosed) throw new aQ("cannot publish track when not connected");
				let T = () => rF(this, void 0, void 0, function*() {
						var i, n, r;
						if (!this.engine.pcManager) throw new aQ("pcManager is not ready");
						if (e.sender = yield this.engine.createSender(e, t, p), s3(e) && (e.publishOptions = t), this.emit(eg.LocalSenderCreated, e.sender, e), s3(e) && (null != t.degradationPreference || (t.degradationPreference = function(e) {
								switch (e.source) {
									case sp.Source.Camera:
										return "maintain-framerate";
									case sp.Source.ScreenShare:
										return "maintain-resolution";
									default:
										return "balanced"
								}
							}(e)), e.setDegradationPreference(t.degradationPreference)), p) {
							if (sE() && e.kind === sp.Kind.Audio) {
								let t;
								for (let i of this.engine.pcManager.publisher.getTransceivers())
									if (i.sender === e.sender) {
										t = i;
										break
									} t && this.engine.pcManager.publisher.setTrackCodecBitrate({
									transceiver: t,
									codec: "opus",
									maxbr: (null == (i = p[0]) ? void 0 : i.maxBitrate) ? p[0].maxBitrate / 1e3 : 0
								})
							} else if (e.codec && sG(e.codec)) {
								let t = sS(e.codec) ? null != (r = null == (n = p[0]) ? void 0 : n.maxBitrate) ? r : 0 : p.reduce((e, t) => {
									var i;
									return e + (null != (i = t.maxBitrate) ? i : 0)
								}, 0);
								t > 0 && this.engine.pcManager.publisher.setTrackCodecBitrate({
									cid: b.cid,
									codec: e.codec,
									maxbr: t / 1e3,
									isScreenShare: e.source === sp.Source.ScreenShare
								})
							}
						}
						yield this.engine.negotiate()
					}),
					S = new Promise((t, i) => rF(this, void 0, void 0, function*() {
						var n;
						try {
							m = yield this.engine.addTrack(b), t(m)
						} catch (t) {
							if (e.sender && (null == (n = this.engine.pcManager) ? void 0 : n.publisher)) {
								try {
									this.engine.pcManager.publisher.removeTrack(e.sender)
								} catch (e) {
									this.log.error(e)
								}
								yield this.engine.negotiate().catch(t => {
									this.log.error("failed to negotiate after removing track due to failed add track request", Object.assign(Object.assign({}, sl(e)), {
										error: t
									}))
								})
							}
							i(t)
						}
					}));
				if (this.enabledPublishVideoCodecs.length > 0 && 0 === y.length) m = (yield Promise.all([S, T()]))[0];
				else {
					let i;
					if ((m = yield S).codecs.forEach(e => {
							void 0 === i && (i = e.mimeType)
						}), i && e.kind === sp.Kind.Video) {
						let n = sc(i);
						n !== g && (this.log.debug("falling back to server selected codec", Object.assign(Object.assign({}, sl(e)), {
							codec: n
						})), t.videoCodec = n, p = cl(e.source === sp.Source.ScreenShare, b.width, b.height, t))
					}
					yield T()
				}
				let C = new lh(e.kind, m, e, {
					loggerName: this.roomOptions.loggerName,
					loggerContextCb: () => this.logContext
				});
				if (C.on(ev.CpuConstrained, e => this.onTrackCpuConstrained(e, C)), C.options = t, e.sid = m.sid, s3(e) && (e.publishOptions = t, b.width && b.height && (e.lastEncodedDimensions = {
						width: b.width,
						height: b.height
					})), this.log.debug("publishing ".concat(e.kind, " with encodings"), {
						encodings: p,
						trackInfo: m
					}), s3(e) ? e.startMonitor(this.engine.client) : s4(e) && e.startMonitor(), this.addTrackPublication(C), this.emit(eg.LocalTrackPublished, C), s4(e) && m.audioFeatures.includes(iv.TF_PRECONNECT_BUFFER)) {
					let t = e.getPreConnectBuffer(),
						i = e.getPreConnectBufferMimeType();
					this.on(eg.LocalTrackSubscribed, t => {
						if (t.trackSid === m.sid) {
							if (!e.hasPreConnectBuffer) return void this.log.warn("subscribe event came to late, buffer already closed");
							this.log.debug("finished recording preconnect buffer", sl(e)), e.stopPreConnectBuffer()
						}
					}), t && new Promise((n, r) => rF(this, void 0, void 0, function*() {
						try {
							this.log.debug("waiting for agent", sl(e));
							let m = setTimeout(() => {
									r(Error("agent not active within 10 seconds"))
								}, 1e4),
								g = yield this.waitUntilActiveAgentPresent();
							clearTimeout(m), this.log.debug("sending preconnect buffer", sl(e));
							let f = yield this.streamBytes({
								name: "preconnect-buffer",
								mimeType: i,
								topic: "lk.agent.pre-connect-audio-buffer",
								destinationIdentities: [g.identity],
								attributes: {
									trackId: C.trackSid,
									sampleRate: String(null != (l = k.sampleRate) ? l : "48000"),
									channels: String(null != (d = k.channelCount) ? d : "1")
								}
							});
							try {
								for (var a, s, o, c, l, d, u, h = !0, p = rj(t); !(a = (u = yield p.next()).done); h = !0) c = u.value, h = !1, yield f.write(c)
							} catch (e) {
								s = {
									error: e
								}
							} finally {
								try {
									!h && !a && (o = p.return) && (yield o.call(p))
								} finally {
									if (s) throw s.error
								}
							}
							yield f.close(), n()
						} catch (e) {
							r(e)
						}
					})).then(() => {
						this.log.debug("preconnect buffer sent successfully", sl(e))
					}).catch(t => {
						this.log.error("error sending preconnect buffer", Object.assign(Object.assign({}, sl(e)), {
							error: t
						}))
					})
				}
				return C
			})
		}
		canPublishFrameMetadata() {
			var e;
			return !!(this.roomOptions.e2ee || this.roomOptions.encryption || op(null != (e = this.roomOptions.frameMetadata) ? e : this.roomOptions.packetTrailer))
		}
		normalizeRequestedFrameMetadataOptions(e, t) {
			var i;
			let n, r = null != (i = t.frameMetadata) ? i : t.packetTrailer;
			if (e.kind !== sp.Kind.Video || !om(r)) return t.frameMetadata = void 0, t.packetTrailer = void 0, [];
			if (!this.canPublishFrameMetadata()) return this.log.warn("frame metadata transform not supported; not advertising features", Object.assign(Object.assign({}, this.logContext), sl(e))), t.frameMetadata = void 0, t.packetTrailer = void 0, [];
			let a = (n = [], (null == r ? void 0 : r.timestamp) && n.push(ik.PTF_USER_TIMESTAMP), (null == r ? void 0 : r.frameId) && n.push(ik.PTF_FRAME_ID), n),
				s = function(e) {
					if (!e || 0 === e.length) return;
					let t = {};
					return e.includes(ik.PTF_USER_TIMESTAMP) && (t.timestamp = !0), e.includes(ik.PTF_FRAME_ID) && (t.frameId = !0), t.timestamp || t.frameId ? t : void 0
				}(a);
			return t.frameMetadata = s, t.packetTrailer = s, a
		}
		get isLocal() {
			return !0
		}
		publishAdditionalCodecForTrack(e, t, i) {
			return rF(this, void 0, void 0, function*() {
				var n;
				let r;
				if (this.encryptionType !== iR.NONE) return;
				if (this.trackPublications.forEach(t => {
						t.track && t.track === e && (r = t)
					}), !r) throw new aJ("track is not published");
				if (!s3(e)) throw new aJ("track is not a video track");
				let a = Object.assign(Object.assign({}, null == (n = this.roomOptions) ? void 0 : n.publishDefaults), i),
					s = cd(e, t, a);
				if (!s) return void this.log.info("backup codec has been disabled, ignoring request to add additional codec for track", sl(e));
				let o = e.addSimulcastTrack(t, s);
				if (!o) return;
				let c = this.normalizeRequestedFrameMetadataOptions(e, a),
					l = new nA({
						cid: o.mediaStreamTrack.id,
						type: sp.kindToProto(e.kind),
						muted: e.isMuted,
						source: sp.sourceToProto(e.source),
						sid: e.sid,
						packetTrailerFeatures: c,
						simulcastCodecs: [{
							codec: a.videoCodec,
							cid: o.mediaStreamTrack.id
						}]
					});
				if (l.layers = ck(l.width, l.height, s), !this.engine || this.engine.isClosed) throw new aQ("cannot publish track when not connected");
				let d = () => rF(this, void 0, void 0, function*() {
						yield this.engine.createSimulcastSender(e, o, a, s), yield this.engine.negotiate()
					}),
					u = (yield Promise.all([this.engine.addTrack(l), d()]))[0];
				this.log.debug("published ".concat(t, " for track ").concat(e.sid), {
					encodings: s,
					trackInfo: u
				})
			})
		}
		unpublishTrack(e, t) {
			return rF(this, void 0, void 0, function*() {
				var i, n;
				if (s0(e)) {
					let t = this.pendingPublishPromises.get(e);
					t && (this.log.debug("awaiting publish promise before attempting to unpublish", sl(e)), yield t)
				}
				let r = this.getPublicationForTrack(e),
					a = r ? sl(r) : void 0;
				if (this.log.info("unpublishing track", a), !r || !r.track) return void this.log.warn("track was not unpublished because no publication was found", a);
				(e = r.track).off(ev.Muted, this.onTrackMuted), e.off(ev.Unmuted, this.onTrackUnmuted), e.off(ev.Ended, this.handleTrackEnded), e.off(ev.UpstreamPaused, this.onTrackUpstreamPaused), e.off(ev.UpstreamResumed, this.onTrackUpstreamResumed), e.off(ev.AudioTrackFeatureUpdate, this.onTrackFeatureUpdate), void 0 === t && (t = null == (n = null == (i = this.roomOptions) ? void 0 : i.stopLocalTrackOnUnpublish) || n), t ? e.stop() : e.stopMonitor();
				let s = !1,
					o = e.sender;
				if (e.sender = void 0, this.engine.pcManager && this.engine.pcManager.currentState < ex.FAILED && o) try {
					for (let e of this.engine.pcManager.publisher.getTransceivers()) e.sender === o && (e.direction = "inactive", s = !0);
					try {
						s = this.engine.removeTrack(o)
					} catch (e) {
						this.log.warn(e), s = !0
					}
					if (s3(e)) {
						for (let t of e.simulcastCodecs) {
							let e = tg(t, 2)[1];
							if (e.sender) {
								try {
									s = this.engine.removeTrack(e.sender)
								} catch (e) {
									this.log.warn(e), s = !0
								}
								e.sender = void 0
							}
						}
						e.simulcastCodecs.clear()
					}
				} catch (e) {
					this.log.warn("failed to unpublish track", Object.assign(Object.assign({}, a), {
						error: e
					}))
				}
				switch (this.trackPublications.delete(r.trackSid), r.kind) {
					case sp.Kind.Audio:
						this.audioTrackPublications.delete(r.trackSid);
						break;
					case sp.Kind.Video:
						this.videoTrackPublications.delete(r.trackSid)
				}
				return this.emit(eg.LocalTrackUnpublished, r), r.setTrack(void 0), s && (yield this.engine.negotiate()), r
			})
		}
		unpublishTracks(e) {
			return rF(this, void 0, void 0, function*() {
				return (yield Promise.all(e.map(e => this.unpublishTrack(e)))).filter(e => !!e)
			})
		}
		republishAllTracks(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
				return function*() {
					t.republishPromise && (yield t.republishPromise), t.republishPromise = new aN((n, r) => rF(t, void 0, void 0, function*() {
						try {
							let t = [];
							this.trackPublications.forEach(i => {
								i.track && (e && (i.options = Object.assign(Object.assign({}, i.options), e)), t.push(i))
							}), yield Promise.all(t.map(e => rF(this, void 0, void 0, function*() {
								let t = e.track;
								yield this.unpublishTrack(t, !1), i && !t.isMuted && t.source !== sp.Source.ScreenShare && t.source !== sp.Source.ScreenShareAudio && (s4(t) || s3(t)) && !t.isUserProvided && (this.log.debug("restarting existing track", {
									track: e.trackSid
								}), yield t.restartTrack()), yield this.publishOrRepublishTrack(t, e.options, !0)
							}))), n()
						} catch (e) {
							e instanceof Error ? r(e) : r(Error(String(e)))
						} finally {
							this.republishPromise = void 0
						}
					})), yield t.republishPromise
				}()
			})
		}
		publishData(e) {
			return rF(this, arguments, void 0, function(e) {
				var t = this;
				let i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
				return function*() {
					let n = i.reliable ? eN.RELIABLE : eN.LOSSY,
						r = i.reliable ? ix.RELIABLE : ix.LOSSY,
						a = i.destinationIdentities,
						s = i.topic,
						o = new iA({
							kind: r,
							value: {
								case: "user",
								value: new iB({
									participantIdentity: t.identity,
									payload: e,
									destinationIdentities: a,
									topic: s
								})
							}
						});
					yield t.engine.sendDataPacket(o, n)
				}()
			})
		}
		publishDtmf(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = new iA({
					kind: ix.RELIABLE,
					value: {
						case: "sipDtmf",
						value: new ij({
							code: e,
							digit: t
						})
					}
				});
				yield this.engine.sendDataPacket(i, eN.RELIABLE)
			})
		}
		sendChatMessage(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = {
						id: crypto.randomUUID(),
						message: e,
						timestamp: Date.now(),
						attachedFiles: null == t ? void 0 : t.attachments
					},
					n = new iA({
						value: {
							case: "chatMessage",
							value: new iH(Object.assign(Object.assign({}, i), {
								timestamp: tl.parse(i.timestamp)
							}))
						}
					});
				return yield this.engine.sendDataPacket(n, eN.RELIABLE), this.emit(eg.ChatMessage, i), i
			})
		}
		editChatMessage(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = Object.assign(Object.assign({}, t), {
						message: e,
						editTimestamp: Date.now()
					}),
					n = new iA({
						value: {
							case: "chatMessage",
							value: new iH(Object.assign(Object.assign({}, i), {
								timestamp: tl.parse(i.timestamp),
								editTimestamp: tl.parse(i.editTimestamp)
							}))
						}
					});
				return yield this.engine.sendDataPacket(n, eN.RELIABLE), this.emit(eg.ChatMessage, i), i
			})
		}
		sendText(e, t) {
			return rF(this, void 0, void 0, function*() {
				return this.roomOutgoingDataStreamManager.sendText(e, t)
			})
		}
		streamText(e) {
			return rF(this, void 0, void 0, function*() {
				return this.roomOutgoingDataStreamManager.streamText(e)
			})
		}
		sendFile(e, t) {
			return rF(this, void 0, void 0, function*() {
				return this.roomOutgoingDataStreamManager.sendFile(e, t)
			})
		}
		streamBytes(e) {
			return rF(this, void 0, void 0, function*() {
				return this.roomOutgoingDataStreamManager.streamBytes(e)
			})
		}
		performRpc(e) {
			return this.rpcClientManager.performRpc(e).then(e => {
				let t = tg(e, 2);
				return t[0], t[1]
			})
		}
		registerRpcMethod(e, t) {
			this.rpcServerManager.registerRpcMethod(e, t)
		}
		unregisterRpcMethod(e) {
			this.rpcServerManager.unregisterRpcMethod(e)
		}
		setTrackSubscriptionPermissions(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
			this.participantTrackPermissions = t, this.allParticipantsAllowedToSubscribe = e, this.engine.client.isDisconnected || this.updateTrackSubscriptionPermissions()
		}
		setEnabledPublishCodecs(e) {
			this.enabledPublishVideoCodecs = e.filter(e => "video" === e.mime.split("/")[0].toLowerCase())
		}
		updateInfo(e) {
			return !!super.updateInfo(e) && (e.tracks.forEach(e => {
				var t, i;
				let n = this.trackPublications.get(e.sid);
				if (n) {
					let r = n.isMuted || null != (i = null == (t = n.track) ? void 0 : t.isUpstreamPaused) && i;
					r !== e.muted && (this.log.debug("updating server mute state after reconcile", Object.assign(Object.assign({}, sl(n)), {
						mutedOnServer: r
					})), this.engine.client.sendMuteTrack(e.sid, r))
				}
			}), !0)
		}
		setActiveAgent(e) {
			var t, i, n, r;
			this.firstActiveAgent = e, e && !this.firstActiveAgent && (this.firstActiveAgent = e), e ? null == (i = null == (t = this.activeAgentFuture) ? void 0 : t.resolve) || i.call(t, e) : null == (r = null == (n = this.activeAgentFuture) ? void 0 : n.reject) || r.call(n, Error("Agent disconnected")), this.activeAgentFuture = void 0
		}
		waitUntilActiveAgentPresent() {
			return this.firstActiveAgent ? Promise.resolve(this.firstActiveAgent) : (this.activeAgentFuture || (this.activeAgentFuture = new sJ), this.activeAgentFuture.promise)
		}
		getPublicationForTrack(e) {
			let t;
			return this.trackPublications.forEach(i => {
				let n = i.track;
				n && (e instanceof MediaStreamTrack ? (s4(n) || s3(n)) && n.mediaStreamTrack === e && (t = i) : e === n && (t = i))
			}), t
		}
		waitForPendingPublicationOfSource(e) {
			return rF(this, void 0, void 0, function*() {
				let t = Date.now();
				for (; Date.now() < t + 1e4;) {
					let t = Array.from(this.pendingPublishPromises.entries()).find(t => tg(t, 1)[0].source === e);
					if (t) return t[1];
					yield sv(20)
				}
			})
		}
		publishDataTrack(e) {
			return rF(this, void 0, void 0, function*() {
				let t = new c7(e, this.roomOutgoingDataTrackManager);
				return yield t.publish(), t
			})
		}
	}
	class lk extends DOMException {
		constructor(e, t) {
			super(e, "AbortError"), this.reason = t
		}
	}
	class ly extends Map {
		constructor() {
			super(...arguments), this.pending = new Map
		}
		set(e, t) {
			var i, n;
			super.set(e, t);
			let r = null == (i = this.pending) ? void 0 : i.get(e);
			if (r) {
				for (let e of r) e.isResolved || null == (n = e.resolve) || n.call(e, t);
				this.pending.delete(e)
			}
			return this
		}
		get[Symbol.toStringTag]() {
			return "DeferrableMap"
		}
		getDeferred(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = this.get(e);
				if (void 0 !== i) return i;
				if (null == t ? void 0 : t.aborted) throw new lk("The operation was aborted.", t.reason);
				let n = new sJ(void 0, () => {
						let t = this.pending.get(e);
						if (!t) return;
						let i = t.indexOf(n); - 1 !== i && t.splice(i, 1), 0 === t.length && this.pending.delete(e)
					}),
					r = this.pending.get(e);
				if (r ? r.push(n) : this.pending.set(e, [n]), t) {
					let e = () => {
						var e;
						n.isResolved || null == (e = n.reject) || e.call(n, new lk("The operation was aborted.", t.reason))
					};
					t.addEventListener("abort", e, {
						once: !0
					}), n.promise.finally(() => {
						t.removeEventListener("abort", e)
					})
				}
				return n.promise
			})
		}
	}
	class lb extends lu {
		constructor(e, t, i, n) {
			super(e, t.sid, t.name, n), this.track = void 0, this.allowed = !0, this.requestedDisabled = void 0, this.visible = !0, this.handleEnded = e => {
				this.setTrack(void 0), this.emit(ev.Ended, e)
			}, this.handleVisibilityChange = e => {
				this.log.debug("adaptivestream video visibility ".concat(this.trackSid, ", visible=").concat(e), this.logContext), this.visible = e, this.emitTrackUpdate()
			}, this.handleVideoDimensionsChange = e => {
				this.log.debug("adaptivestream video dimensions ".concat(e.width, "x").concat(e.height), this.logContext), this.videoDimensionsAdaptiveStream = e, this.emitTrackUpdate()
			}, this.subscribed = i, this.updateInfo(t)
		}
		setSubscribed(e) {
			let t = this.subscriptionStatus,
				i = this.permissionStatus;
			this.subscribed = e, e && (this.allowed = !0);
			let n = new nG({
				trackSids: [this.trackSid],
				subscribe: this.subscribed,
				participantTracks: [new iG({
					participantSid: "",
					trackSids: [this.trackSid]
				})]
			});
			this.emit(ev.UpdateSubscription, n), this.emitSubscriptionUpdateIfChanged(t), this.emitPermissionUpdateIfChanged(i)
		}
		get subscriptionStatus() {
			return !1 === this.subscribed ? lu.SubscriptionStatus.Unsubscribed : super.isSubscribed ? lu.SubscriptionStatus.Subscribed : lu.SubscriptionStatus.Desired
		}
		get permissionStatus() {
			return this.allowed ? lu.PermissionStatus.Allowed : lu.PermissionStatus.NotAllowed
		}
		get isSubscribed() {
			return !1 !== this.subscribed && super.isSubscribed
		}
		get isDesired() {
			return !1 !== this.subscribed
		}
		get isEnabled() {
			return void 0 !== this.requestedDisabled ? !this.requestedDisabled : !this.isAdaptiveStream || this.visible
		}
		get isLocal() {
			return !1
		}
		setEnabled(e) {
			this.isManualOperationAllowed() && !e !== this.requestedDisabled && (this.requestedDisabled = !e, this.emitTrackUpdate())
		}
		setVideoQuality(e) {
			this.isManualOperationAllowed() && this.requestedMaxQuality !== e && (this.requestedMaxQuality = e, this.requestedVideoDimensions = void 0, this.emitTrackUpdate())
		}
		setVideoDimensions(e) {
			var t, i;
			this.isManualOperationAllowed() && ((null == (t = this.requestedVideoDimensions) ? void 0 : t.width) !== e.width || (null == (i = this.requestedVideoDimensions) ? void 0 : i.height) !== e.height) && (s6(this.track) && (this.requestedVideoDimensions = e), this.requestedMaxQuality = void 0, this.emitTrackUpdate())
		}
		setVideoFPS(e) {
			this.isManualOperationAllowed() && s6(this.track) && this.fps !== e && (this.fps = e, this.emitTrackUpdate())
		}
		get videoQuality() {
			var e;
			return null != (e = this.requestedMaxQuality) ? e : eb.HIGH
		}
		setTrack(e) {
			let t = this.subscriptionStatus,
				i = this.permissionStatus,
				n = this.track;
			n !== e && (n && (n.off(ev.VideoDimensionsChanged, this.handleVideoDimensionsChange), n.off(ev.VisibilityChanged, this.handleVisibilityChange), n.off(ev.Ended, this.handleEnded), n.detach(), n.stopMonitor(), this.emit(ev.Unsubscribed, n)), super.setTrack(e), e && (e.sid = this.trackSid, e.on(ev.VideoDimensionsChanged, this.handleVideoDimensionsChange), e.on(ev.VisibilityChanged, this.handleVisibilityChange), e.on(ev.Ended, this.handleEnded), this.emit(ev.Subscribed, e)), this.emitPermissionUpdateIfChanged(i), this.emitSubscriptionUpdateIfChanged(t))
		}
		setAllowed(e) {
			let t = this.subscriptionStatus,
				i = this.permissionStatus;
			this.allowed = e, this.emitPermissionUpdateIfChanged(i), this.emitSubscriptionUpdateIfChanged(t)
		}
		setSubscriptionError(e) {
			this.emit(ev.SubscriptionFailed, e)
		}
		updateInfo(e) {
			super.updateInfo(e);
			let t = this.metadataMuted;
			this.metadataMuted = e.muted, this.track ? this.track.setMuted(e.muted) : t !== e.muted && this.emit(e.muted ? ev.Muted : ev.Unmuted)
		}
		emitSubscriptionUpdateIfChanged(e) {
			let t = this.subscriptionStatus;
			e !== t && this.emit(ev.SubscriptionStatusChanged, t, e)
		}
		emitPermissionUpdateIfChanged(e) {
			this.permissionStatus !== e && this.emit(ev.SubscriptionPermissionChanged, this.permissionStatus, e)
		}
		isManualOperationAllowed() {
			return !!this.isDesired || (this.log.warn("cannot update track settings when not subscribed", this.logContext), !1)
		}
		get isAdaptiveStream() {
			return s6(this.track) && this.track.isAdaptiveStream
		}
		emitTrackUpdate() {
			let e = new nX({
				trackSids: [this.trackSid],
				disabled: !this.isEnabled,
				fps: this.fps
			});
			if (this.kind === sp.Kind.Video) {
				let r = this.requestedVideoDimensions;
				if (void 0 !== this.videoDimensionsAdaptiveStream)
					if (r) su(this.videoDimensionsAdaptiveStream, r) && (this.log.debug("using adaptive stream dimensions instead of requested", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), r = this.videoDimensionsAdaptiveStream);
					else if (void 0 !== this.requestedMaxQuality && this.trackInfo) {
					var t, i, n;
					let e = (t = this.trackInfo, i = this.requestedMaxQuality, null == (n = t.layers) ? void 0 : n.find(e => e.quality === i));
					e && su(this.videoDimensionsAdaptiveStream, e) && (this.log.debug("using adaptive stream dimensions instead of max quality layer", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), r = this.videoDimensionsAdaptiveStream)
				} else this.log.debug("using adaptive stream dimensions", Object.assign(Object.assign({}, this.logContext), this.videoDimensionsAdaptiveStream)), r = this.videoDimensionsAdaptiveStream;
				r ? (e.width = Math.ceil(r.width), e.height = Math.ceil(r.height)) : void 0 !== this.requestedMaxQuality ? (this.log.debug("using requested max quality", Object.assign(Object.assign({}, this.logContext), {
					quality: this.requestedMaxQuality
				})), e.quality = this.requestedMaxQuality) : (this.log.debug("using default quality", Object.assign(Object.assign({}, this.logContext), {
					quality: eb.HIGH
				})), e.quality = eb.HIGH)
			}
			this.emit(ev.UpdateSettings, e)
		}
	}
	class lT extends lf {
		static fromParticipantInfo(e, t, i, n) {
			return new lT(e, t.sid, t.identity, t.name, t.metadata, t.attributes, i, t.kind, t.dataTracks.map(e => new cJ(oL(e), n, {
				publisherIdentity: t.identity
			})), t.clientProtocol)
		}
		get logContext() {
			return Object.assign(Object.assign({}, super.logContext), {
				remoteParticipantID: this.sid,
				remoteParticipant: this.identity
			})
		}
		constructor(e, t, i, n, r, a, s) {
			let o = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : iw.STANDARD,
				c = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : [],
				l = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 0;
			super(t, i || "", n, r, a, s, o), this.signalClient = e, this.trackPublications = new Map, this.audioTrackPublications = new Map, this.videoTrackPublications = new Map, this.dataTracks = new ly(c.map(e => [e.info.name, e])), this.volumeMap = new Map, this.clientProtocol = l
		}
		addTrackPublication(e) {
			super.addTrackPublication(e), e.on(ev.UpdateSettings, t => {
				this.log.debug("send update settings", Object.assign(Object.assign(Object.assign({}, this.logContext), sl(e)), {
					settings: t
				})), this.signalClient.sendUpdateTrackSettings(t)
			}), e.on(ev.UpdateSubscription, e => {
				e.participantTracks.forEach(e => {
					e.participantSid = this.sid
				}), this.signalClient.sendUpdateSubscription(e)
			}), e.on(ev.SubscriptionPermissionChanged, t => {
				this.emit(eg.TrackSubscriptionPermissionChanged, e, t)
			}), e.on(ev.SubscriptionStatusChanged, t => {
				this.emit(eg.TrackSubscriptionStatusChanged, e, t)
			}), e.on(ev.Subscribed, t => {
				this.emit(eg.TrackSubscribed, t, e)
			}), e.on(ev.Unsubscribed, t => {
				this.emit(eg.TrackUnsubscribed, t, e)
			}), e.on(ev.SubscriptionFailed, t => {
				this.emit(eg.TrackSubscriptionFailed, e.trackSid, t)
			})
		}
		getTrackPublication(e) {
			let t = super.getTrackPublication(e);
			if (t) return t
		}
		getTrackPublicationByName(e) {
			let t = super.getTrackPublicationByName(e);
			if (t) return t
		}
		setVolume(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : sp.Source.Microphone;
			this.volumeMap.set(t, e);
			let i = this.getTrackPublication(t);
			i && i.track && i.track.setVolume(e)
		}
		getVolume() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : sp.Source.Microphone,
				t = this.getTrackPublication(e);
			return t && t.track ? t.track.getVolume() : this.volumeMap.get(e)
		}
		addSubscribedMediaTrack(e, t, i, n, r, a) {
			let s, o = this.getTrackPublicationBySid(t);
			if (o || t.startsWith("TR") || this.trackPublications.forEach(t => {
					o || e.kind !== t.kind.toString() || (o = t)
				}), !o) {
				if (0 === a) {
					this.log.error("could not find published track", Object.assign(Object.assign({}, this.logContext), {
						trackSid: t
					})), this.emit(eg.TrackSubscriptionFailed, t);
					return
				}
				void 0 === a && (a = 20), setTimeout(() => {
					this.addSubscribedMediaTrack(e, t, i, n, r, a - 1)
				}, 150);
				return
			}
			if ("ended" === e.readyState) {
				this.log.error("unable to subscribe because MediaStreamTrack is ended. Do not call MediaStreamTrack.stop()", Object.assign(Object.assign({}, this.logContext), sl(o))), this.emit(eg.TrackSubscriptionFailed, t);
				return
			}
			return (s = "video" === e.kind ? new ok(e, t, n, r) : new ld(e, t, n, this.audioContext, this.audioOutput)).source = o.source, s.isMuted = o.isMuted, s.setMediaStream(i), s.start(), o.setTrack(s), this.volumeMap.has(o.source) && s9(s) && s1(s) && s.setVolume(this.volumeMap.get(o.source)), o
		}
		get hasMetadata() {
			return !!this.participantInfo
		}
		getTrackPublicationBySid(e) {
			return this.trackPublications.get(e)
		}
		updateInfo(e) {
			if (!super.updateInfo(e)) return !1;
			let t = new Map,
				i = new Map;
			return e.tracks.forEach(e => {
				var n, r;
				let a = this.getTrackPublicationBySid(e.sid);
				if (a) a.updateInfo(e);
				else {
					let t = sp.kindFromProto(e.type);
					if (!t) return;
					(a = new lb(t, e, null == (n = this.signalClient.connectOptions) ? void 0 : n.autoSubscribe, {
						loggerContextCb: () => this.logContext,
						loggerName: null == (r = this.loggerOptions) ? void 0 : r.loggerName
					})).updateInfo(e), i.set(e.sid, a);
					let s = Array.from(this.trackPublications.values()).find(e => e.source === (null == a ? void 0 : a.source));
					s && a.source !== sp.Source.Unknown && this.log.debug("received a second track publication for ".concat(this.identity, " with the same source: ").concat(a.source), Object.assign(Object.assign({}, this.logContext), {
						oldTrack: sl(s),
						newTrack: sl(a)
					})), this.addTrackPublication(a)
				}
				t.set(e.sid, a)
			}), this.trackPublications.forEach(e => {
				t.has(e.trackSid) || (this.log.trace("detected removed track on remote participant, unpublishing", Object.assign(Object.assign({}, this.logContext), sl(e))), this.unpublishTrack(e.trackSid, !0))
			}), i.forEach(e => {
				this.emit(eg.TrackPublished, e)
			}), !0
		}
		unpublishTrack(e, t) {
			let i = this.trackPublications.get(e);
			if (!i) return;
			let n = i.track;
			switch (n && (n.stop(), i.setTrack(void 0)), this.trackPublications.delete(e), i.kind) {
				case sp.Kind.Audio:
					this.audioTrackPublications.delete(e);
					break;
				case sp.Kind.Video:
					this.videoTrackPublications.delete(e)
			}
			t && this.emit(eg.TrackUnpublished, i)
		}
		setAudioOutput(e) {
			return rF(this, void 0, void 0, function*() {
				this.audioOutput = e;
				let t = [];
				this.audioTrackPublications.forEach(i => {
					var n;
					s1(i.track) && s9(i.track) && t.push(i.track.setSinkId(null != (n = e.deviceId) ? n : "default"))
				}), yield Promise.all(t)
			})
		}
		addRemoteDataTrack(e) {
			this.dataTracks.set(e.info.name, e)
		}
		removeRemoteDataTrack(e) {
			for (let i of this.dataTracks.entries()) {
				var t = tg(i, 2);
				let n = t[0];
				e === t[1].info.sid && this.dataTracks.delete(n)
			}
		}
		emit(e) {
			for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
			return this.log.trace("participant event", Object.assign(Object.assign({}, this.logContext), {
				event: e,
				args: i
			})), super.emit(e, ...i)
		}
	}(ee = eQ || (eQ = {})).Disconnected = "disconnected", ee.Connecting = "connecting", ee.Connected = "connected", ee.Reconnecting = "reconnecting", ee.SignalReconnecting = "signalReconnecting";
	class lS extends rV.EventEmitter {
		get hasE2EESetup() {
			return void 0 !== this.e2eeManager
		}
		constructor(e) {
			var t, i, n, r, a, s, o;
			if (super(), t = this, this.state = eQ.Disconnected, this.activeSpeakers = [], this.isE2EEEnabled = !1, this.audioEnabled = !0, this.e2eeStateMutex = new e0, this.isVideoPlaybackBlocked = !1, this.log = r_, this.bufferedEvents = [], this.isResuming = !1, this.connect = (e, t, i) => rF(this, void 0, void 0, function*() {
					var n;
					if (!sw())
						if (sO()) throw Error("WebRTC isn't detected, have you called registerGlobals?");
						else throw Error("LiveKit doesn't seem to be supported on this browser. Try to update your browser and make sure no browser extensions are disabling webRTC.");
					let r = yield this.disconnectLock.lock();
					if (this.state === eQ.Connected) return this.log.info("already connected to room ".concat(this.name)), r(), Promise.resolve();
					if (this.connectFuture) return r(), this.connectFuture.promise;
					this.setAndEmitConnectionState(eQ.Connecting), (null == (n = this.regionUrlProvider) ? void 0 : n.getServerUrl().toString()) !== s7(e) && (this.regionUrl = void 0, this.regionUrlProvider = void 0), sA(new URL(e)) && (void 0 === this.regionUrlProvider ? this.regionUrlProvider = new cR(e, t) : this.regionUrlProvider.updateToken(t), this.regionUrlProvider.fetchRegionSettings().then(e => {
						var t;
						null == (t = this.regionUrlProvider) || t.setServerReportedRegions(e)
					}).catch(e => {
						this.log.warn("could not fetch region settings", {
							error: e
						})
					}));
					let a = (n, s, o) => rF(this, void 0, void 0, function*() {
							var c, l;
							this.abortController && this.abortController.abort();
							let d = new AbortController;
							this.abortController = d, null == r || r();
							try {
								if (yield oE.getInstance().getBackOffPromise(e), d.signal.aborted) throw aK.cancelled("Connection attempt aborted");
								yield this.attemptConnection(null != o ? o : e, t, i, d), this.abortController = void 0, n()
							} catch (t) {
								if (this.regionUrlProvider && t instanceof aK && t.reason !== eu.Cancelled && t.reason !== eu.NotAllowed) {
									let i = null;
									try {
										this.log.debug("Fetching next region"), i = yield this.regionUrlProvider.getNextBestRegionUrl(null == (c = this.abortController) ? void 0 : c.signal)
									} catch (e) {
										if (e instanceof aK && (401 === e.status || e.reason === eu.Cancelled)) {
											this.handleDisconnect(this.options.stopLocalTrackOnUnpublish), s(e);
											return
										}
									} [eu.InternalError, eu.ServerUnreachable, eu.Timeout].includes(t.reason) && (this.log.debug("Adding failed connection attempt to back off"), oE.getInstance().addFailedConnectionAttempt(e)), !i || (null == (l = this.abortController) ? void 0 : l.signal.aborted) ? (this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, sX(t)), s(t)) : (this.log.info("Initial connection failed with ConnectionError: ".concat(t.message, ". Retrying with another region: ").concat(i)), this.recreateEngine(!0), yield a(n, s, i))
								} else {
									let e = ip.UNKNOWN_REASON;
									t instanceof aK && (e = sX(t)), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, e), s(t)
								}
							}
						}),
						s = this.regionUrl;
					return this.regionUrl = void 0, this.connectFuture = new sJ((e, t) => {
						a(e, t, s)
					}, () => {
						this.clearConnectionFutures()
					}), this.connectFuture.promise
				}), this.connectSignal = (e, t, i, n, r, a) => rF(this, void 0, void 0, function*() {
					var s;
					let o = yield i.join(e, t, {
						autoSubscribe: n.autoSubscribe,
						adaptiveStream: "object" == typeof r.adaptiveStream || r.adaptiveStream,
						clientInfoCapabilities: op(null != (s = r.frameMetadata) ? s : r.packetTrailer) || this.e2eeManager ? [i$.CAP_PACKET_TRAILER] : void 0,
						maxRetries: n.maxRetries,
						e2eeEnabled: !!this.e2eeManager,
						websocketTimeout: n.websocketTimeout
					}, a.signal, !r.singlePeerConnection), c = o.joinResponse, l = o.serverInfo;
					if (this.serverInfo = l, !l.version) throw new aG("unknown server version");
					return "0.15.1" === l.version && this.options.dynacast && (this.log.debug("disabling dynacast due to server version"), r.dynacast = !1), c
				}), this.applyJoinResponse = e => {
					let t = e.participant;
					if (this.localParticipant.sid = t.sid, this.localParticipant.identity = t.identity, this.localParticipant.setEnabledPublishCodecs(e.enabledPublishCodecs), this.e2eeManager) try {
						this.e2eeManager.setSifTrailer(e.sifTrailer)
					} catch (e) {
						this.log.error(e instanceof Error ? e.message : "Could not set SifTrailer", {
							error: e
						})
					}
					this.handleParticipantUpdates([t, ...e.otherParticipants]), e.room && this.handleRoomUpdate(e.room)
				}, this.attemptConnection = (e, t, i, n) => rF(this, void 0, void 0, function*() {
					var r, a;
					this.state === eQ.Reconnecting || this.isResuming || (null == (r = this.engine) ? void 0 : r.pendingReconnect) ? (this.log.info("Reconnection attempt replaced by new connection attempt"), this.recreateEngine(!0)) : this.maybeCreateEngine(), (null == (a = this.regionUrlProvider) ? void 0 : a.isCloud()) && this.engine.setRegionStrategy(this.createRegionStrategy()), this.acquireAudioContext(), this.connOptions = Object.assign(Object.assign({}, o6), i), this.connOptions.rtcConfig && (this.engine.rtcConfig = this.connOptions.rtcConfig), this.connOptions.peerConnectionTimeout && (this.engine.peerConnectionTimeout = this.connOptions.peerConnectionTimeout);
					try {
						let i = yield this.connectSignal(e, t, this.engine, this.connOptions, this.options, n);
						this.applyJoinResponse(i), this.setupLocalParticipantEvents(), this.emit(em.SignalConnected)
					} catch (t) {
						yield this.engine.close(), this.recreateEngine();
						let e = n.signal.aborted ? aK.cancelled("Signal connection aborted") : aK.serverUnreachable("could not establish signal connection");
						throw t instanceof Error && (e.message = "".concat(e.message, ": ").concat(t.message)), t instanceof aK && (e.reason = t.reason, e.status = t.status), this.log.debug("error trying to establish signal connection", {
							error: t
						}), e
					}
					if (n.signal.aborted) throw yield this.engine.close(), this.recreateEngine(), aK.cancelled("Connection attempt aborted");
					try {
						yield this.engine.waitForPCInitialConnection(this.connOptions.peerConnectionTimeout, n)
					} catch (e) {
						throw yield this.engine.close(), this.recreateEngine(), e
					}
					s_() && this.options.disconnectOnPageLeave && (window.addEventListener("pagehide", this.onPageLeave), window.addEventListener("beforeunload", this.onPageLeave)), s_() && window.addEventListener("freeze", this.onPageLeave), this.setAndEmitConnectionState(eQ.Connected), this.emit(em.Connected), oE.getInstance().resetFailedConnectionAttempts(e), this.registerConnectionReconcile(), this.regionUrlProvider && this.regionUrlProvider.notifyConnected()
				}), this.disconnect = function() {
					for (var e = arguments.length, i = Array(e), n = 0; n < e; n++) i[n] = arguments[n];
					return rF(t, [...i], void 0, function() {
						var e = this;
						let t = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0];
						return function*() {
							var i, n, r;
							let a = yield e.disconnectLock.lock();
							try {
								if (e.state === eQ.Disconnected) return void e.log.debug("already disconnected");
								if (e.log.info("disconnect from room"), e.state === eQ.Connecting || e.state === eQ.Reconnecting || e.isResuming) {
									let t = "Abort connection attempt due to user initiated disconnect";
									e.log.warn(t), null == (i = e.abortController) || i.abort(t), null == (r = null == (n = e.connectFuture) ? void 0 : n.reject) || r.call(n, aK.cancelled("Client initiated disconnect")), e.connectFuture = void 0
								}
								e.engine && (e.engine.client.isDisconnected || (yield e.engine.client.sendLeave()), yield e.engine.close()), e.handleDisconnect(t, ip.CLIENT_INITIATED), e.engine = void 0
							} finally {
								a()
							}
						}()
					})
				}, this.onPageLeave = () => rF(this, void 0, void 0, function*() {
					this.log.info("Page leave detected, disconnecting"), yield this.disconnect()
				}), this.startAudio = () => rF(this, void 0, void 0, function*() {
					let e = [],
						t = aF();
					if (t && "iOS" === t.os) {
						let t = "livekit-dummy-audio-el",
							i = document.getElementById(t);
						if (!i) {
							(i = document.createElement("audio")).id = t, i.autoplay = !0, i.hidden = !0;
							let e = sz();
							e.enabled = !0;
							let n = new MediaStream([e]);
							i.srcObject = n, document.addEventListener("visibilitychange", () => {
								i && (i.srcObject = document.hidden ? null : n, document.hidden || (this.log.debug("page visible again, triggering startAudio to resume playback and update playback status"), this.startAudio()))
							}), document.body.append(i), this.once(em.Disconnected, () => {
								null == i || i.remove(), i = null
							})
						}
						e.push(i)
					}
					this.remoteParticipants.forEach(t => {
						t.audioTrackPublications.forEach(t => {
							t.track && t.track.attachedElements.forEach(t => {
								e.push(t)
							})
						})
					});
					try {
						yield Promise.all([this.acquireAudioContext(), ...e.map(e => (this.options.webAudioMix || (e.muted = !1), e.play()))]), this.handleAudioPlaybackStarted()
					} catch (e) {
						throw this.handleAudioPlaybackFailed(e), e
					}
				}), this.startVideo = () => rF(this, void 0, void 0, function*() {
					let e = [];
					for (let t of this.remoteParticipants.values()) t.videoTrackPublications.forEach(t => {
						var i;
						null == (i = t.track) || i.attachedElements.forEach(t => {
							e.includes(t) || e.push(t)
						})
					});
					yield Promise.all(e.map(e => e.play())).then(() => {
						this.handleVideoPlaybackStarted()
					}).catch(e => {
						"NotAllowedError" === e.name ? this.handleVideoPlaybackFailed() : this.log.warn("Resuming video playback failed, make sure you call `startVideo` directly in a user gesture handler")
					})
				}), this.handleRestarting = () => {
					for (let e of (this.clearConnectionReconcile(), this.isResuming = !1, this.remoteParticipants.values())) this.handleParticipantDisconnected(e.identity, e);
					this.setAndEmitConnectionState(eQ.Reconnecting) && this.emit(em.Reconnecting)
				}, this.handleRestarted = () => {
					this.outgoingDataTrackManager.sfuWillRepublishTracks(), this.incomingDataTrackManager.resendSubscriptionUpdates()
				}, this.handleSignalRestarted = e => rF(this, void 0, void 0, function*() {
					this.log.debug("signal reconnected to server, region ".concat(e.serverRegion), {
						region: e.serverRegion
					}), this.bufferedEvents = [], this.applyJoinResponse(e);
					try {
						yield this.localParticipant.republishAllTracks(void 0, !0)
					} catch (e) {
						this.log.error("error trying to re-publish tracks after reconnection", {
							error: e
						})
					}
					try {
						yield this.engine.waitForRestarted(), this.log.debug("fully reconnected to server", {
							region: e.serverRegion
						})
					} catch (e) {
						return
					}
					this.setAndEmitConnectionState(eQ.Connected), this.emit(em.Reconnected), this.registerConnectionReconcile(), this.emitBufferedEvents()
				}), this.handleParticipantUpdates = e => {
					var t;
					for (let i of e) {
						if (i.identity === this.localParticipant.identity) {
							this.localParticipant.updateInfo(i);
							continue
						}
						"" === i.identity && (i.identity = null != (t = this.sidToIdentity.get(i.sid)) ? t : "");
						let e = this.remoteParticipants.get(i.identity);
						i.state === iC.DISCONNECTED ? this.handleParticipantDisconnected(i.identity, e) : this.getOrCreateParticipant(i.identity, i)
					}
					let i = new Map(e.filter(e => e.identity !== this.localParticipant.identity).map(e => [e.identity, e.dataTracks.map(e => oL(e))]));
					this.incomingDataTrackManager.receiveSfuPublicationUpdates(i)
				}, this.handleActiveSpeakersUpdate = e => {
					let t = [],
						i = {};
					e.forEach(e => {
						if (i[e.sid] = !0, e.sid === this.localParticipant.sid) this.localParticipant.audioLevel = e.level, this.localParticipant.setIsSpeaking(!0), t.push(this.localParticipant);
						else {
							let i = this.getRemoteParticipantBySid(e.sid);
							i && (i.audioLevel = e.level, i.setIsSpeaking(!0), t.push(i))
						}
					}), i[this.localParticipant.sid] || (this.localParticipant.audioLevel = 0, this.localParticipant.setIsSpeaking(!1)), this.remoteParticipants.forEach(e => {
						i[e.sid] || (e.audioLevel = 0, e.setIsSpeaking(!1))
					}), this.activeSpeakers = t, this.emitWhenConnected(em.ActiveSpeakersChanged, t)
				}, this.handleSpeakersChanged = e => {
					let t = new Map;
					this.activeSpeakers.forEach(e => {
						let i = this.remoteParticipants.get(e.identity);
						i && i.sid !== e.sid || t.set(e.sid, e)
					}), e.forEach(e => {
						let i = this.getRemoteParticipantBySid(e.sid);
						e.sid === this.localParticipant.sid && (i = this.localParticipant), i && (i.audioLevel = e.level, i.setIsSpeaking(e.active), e.active ? t.set(e.sid, i) : t.delete(e.sid))
					});
					let i = Array.from(t.values());
					i.sort((e, t) => t.audioLevel - e.audioLevel), this.activeSpeakers = i, this.emitWhenConnected(em.ActiveSpeakersChanged, i)
				}, this.handleStreamStateUpdate = e => {
					e.streamStates.forEach(e => {
						let t = this.getRemoteParticipantBySid(e.participantSid);
						if (!t) return;
						let i = t.getTrackPublicationBySid(e.trackSid);
						if (!i || !i.track) return;
						let n = sp.streamStateFromProto(e.state);
						i.track.setStreamState(n), n !== i.track.streamState && (t.emit(eg.TrackStreamStateChanged, i, i.track.streamState), this.emitWhenConnected(em.TrackStreamStateChanged, i, i.track.streamState, t))
					})
				}, this.handleSubscriptionPermissionUpdate = e => {
					let t = this.getRemoteParticipantBySid(e.participantSid);
					if (!t) return;
					let i = t.getTrackPublicationBySid(e.trackSid);
					i && i.setAllowed(e.allowed)
				}, this.handleSubscriptionError = e => {
					let t = Array.from(this.remoteParticipants.values()).find(t => t.trackPublications.has(e.trackSid));
					if (!t) return;
					let i = t.getTrackPublicationBySid(e.trackSid);
					i && i.setSubscriptionError(e.err)
				}, this.handleDataPacket = (e, t) => {
					let i = this.remoteParticipants.get(e.participantIdentity);
					if ("user" === e.value.case) this.handleUserPacket(i, e.value.value, e.kind, t);
					else if ("transcription" === e.value.case) this.handleTranscription(i, e.value.value);
					else if ("sipDtmf" === e.value.case) this.handleSipDtmf(i, e.value.value);
					else if ("chatMessage" === e.value.case) this.handleChatMessage(i, e.value.value);
					else if ("metrics" === e.value.case) this.handleMetrics(e.value.value, i);
					else if ("streamHeader" === e.value.case || "streamChunk" === e.value.case || "streamTrailer" === e.value.case) this.handleDataStream(e, t);
					else if ("rpcRequest" === e.value.case) {
						let t = e.value.value;
						this.rpcServerManager.handleIncomingRpcRequest(e.participantIdentity, t)
					} else if ("rpcResponse" === e.value.case) {
						let t = e.value.value;
						switch (t.value.case) {
							case "payload":
								this.rpcClientManager.handleIncomingRpcResponseSuccess(t.requestId, t.value.value);
								break;
							case "error":
								this.rpcClientManager.handleIncomingRpcResponseFailure(t.requestId, ln.fromProto(t.value.value));
								break;
							default:
								this.log.warn("Unknown rpcResponse.value.case: ".concat(t.value.case), this.logContext)
						}
					} else "rpcAck" === e.value.case && this.rpcClientManager.handleIncomingRpcAck(e.value.value.requestId)
				}, this.handleUserPacket = (e, t, i, n) => {
					this.emit(em.DataReceived, t.payload, e, i, t.topic, n), null == e || e.emit(eg.DataReceived, t.payload, i, n)
				}, this.handleSipDtmf = (e, t) => {
					this.emit(em.SipDTMFReceived, t, e), null == e || e.emit(eg.SipDTMFReceived, t)
				}, this.handleTranscription = (e, t) => {
					var i;
					let n = t.transcribedParticipantIdentity === this.localParticipant.identity ? this.localParticipant : this.getParticipantByIdentity(t.transcribedParticipantIdentity),
						r = null == n ? void 0 : n.trackPublications.get(t.trackId),
						a = (i = this.transcriptionReceivedTimes, t.segments.map(e => {
							var t;
							let n = e.id,
								r = e.text,
								a = e.language,
								s = e.startTime,
								o = e.endTime,
								c = e.final,
								l = null != (t = i.get(n)) ? t : Date.now(),
								d = Date.now();
							return c ? i.delete(n) : i.set(n, l), {
								id: n,
								text: r,
								startTime: Number.parseInt(s.toString()),
								endTime: Number.parseInt(o.toString()),
								final: c,
								language: a,
								firstReceivedTime: l,
								lastReceivedTime: d
							}
						}));
					null == r || r.emit(ev.TranscriptionReceived, a), null == n || n.emit(eg.TranscriptionReceived, a, r), this.emit(em.TranscriptionReceived, a, n, r)
				}, this.handleChatMessage = (e, t) => {
					let i, n, r, a, s = (i = t.id, n = t.timestamp, r = t.message, a = t.editTimestamp, {
						id: i,
						timestamp: Number.parseInt(n.toString()),
						editTimestamp: a ? Number.parseInt(a.toString()) : void 0,
						message: r
					});
					this.emit(em.ChatMessage, s, e)
				}, this.handleMetrics = (e, t) => {
					this.emit(em.MetricsReceived, e, t)
				}, this.handleDataStream = (e, t) => {
					this.incomingDataStreamManager.handleDataStreamPacket(e, t)
				}, this.bufferedSegments = new Map, this.handleAudioPlaybackStarted = () => {
					this.canPlaybackAudio || (this.audioEnabled = !0, this.emit(em.AudioPlaybackStatusChanged, !0))
				}, this.handleAudioPlaybackFailed = e => {
					this.log.warn("could not playback audio", {
						error: e
					}), this.canPlaybackAudio && (this.audioEnabled = !1, this.emit(em.AudioPlaybackStatusChanged, !1))
				}, this.handleVideoPlaybackStarted = () => {
					this.isVideoPlaybackBlocked && (this.isVideoPlaybackBlocked = !1, this.emit(em.VideoPlaybackStatusChanged, !0))
				}, this.handleVideoPlaybackFailed = () => {
					this.isVideoPlaybackBlocked || (this.isVideoPlaybackBlocked = !0, this.emit(em.VideoPlaybackStatusChanged, !1))
				}, this.handleDeviceChange = () => rF(this, void 0, void 0, function*() {
					var e;
					(null == (e = aF()) ? void 0 : e.os) !== "iOS" && (yield this.selectDefaultDevices()), this.emit(em.MediaDevicesChanged)
				}), this.handleRoomUpdate = e => {
					let t = this.roomInfo;
					this.roomInfo = e, t && t.metadata !== e.metadata && this.emitWhenConnected(em.RoomMetadataChanged, e.metadata), (null == t ? void 0 : t.activeRecording) !== e.activeRecording && this.emitWhenConnected(em.RecordingStatusChanged, e.activeRecording)
				}, this.handleConnectionQualityUpdate = e => {
					e.updates.forEach(e => {
						if (e.participantSid === this.localParticipant.sid) return void this.localParticipant.setConnectionQuality(e.quality);
						let t = this.getRemoteParticipantBySid(e.participantSid);
						t && t.setConnectionQuality(e.quality)
					})
				}, this.getRemoteParticipantClientProtocol = e => {
					var t, i;
					return null != (i = null == (t = this.remoteParticipants.get(e)) ? void 0 : t.clientProtocol) ? i : 0
				}, this.onLocalParticipantMetadataChanged = e => {
					this.emit(em.ParticipantMetadataChanged, e, this.localParticipant)
				}, this.onLocalParticipantNameChanged = e => {
					this.emit(em.ParticipantNameChanged, e, this.localParticipant)
				}, this.onLocalAttributesChanged = e => {
					this.emit(em.ParticipantAttributesChanged, e, this.localParticipant)
				}, this.onLocalTrackMuted = e => {
					this.emit(em.TrackMuted, e, this.localParticipant)
				}, this.onLocalTrackUnmuted = e => {
					this.emit(em.TrackUnmuted, e, this.localParticipant)
				}, this.onTrackProcessorUpdate = e => {
					var t;
					null == (t = null == e ? void 0 : e.onPublish) || t.call(e, this)
				}, this.onLocalTrackPublished = e => rF(this, void 0, void 0, function*() {
					var t, i, n, r, a, s;
					null == (t = e.track) || t.on(ev.TrackProcessorUpdate, this.onTrackProcessorUpdate), null == (i = e.track) || i.on(ev.Restarted, this.onLocalTrackRestarted), null == (a = null == (r = null == (n = e.track) ? void 0 : n.getProcessor()) ? void 0 : r.onPublish) || a.call(r, this), this.emit(em.LocalTrackPublished, e, this.localParticipant), s4(e.track) && (yield e.track.checkForSilence()) && this.emit(em.LocalAudioSilenceDetected, e);
					let o = yield null == (s = e.track) ? void 0 : s.getDeviceId(!1), c = ss(e.source);
					c && o && o !== this.localParticipant.activeDeviceMap.get(c) && (this.localParticipant.activeDeviceMap.set(c, o), this.emit(em.ActiveDeviceChanged, c, o))
				}), this.onLocalTrackUnpublished = e => {
					var t, i;
					null == (t = e.track) || t.off(ev.TrackProcessorUpdate, this.onTrackProcessorUpdate), null == (i = e.track) || i.off(ev.Restarted, this.onLocalTrackRestarted), this.emit(em.LocalTrackUnpublished, e, this.localParticipant)
				}, this.onLocalTrackRestarted = e => rF(this, void 0, void 0, function*() {
					let t = yield e.getDeviceId(!1), i = ss(e.source);
					i && t && t !== this.localParticipant.activeDeviceMap.get(i) && (this.log.debug("local track restarted, setting ".concat(i, " ").concat(t, " active")), this.localParticipant.activeDeviceMap.set(i, t), this.emit(em.ActiveDeviceChanged, i, t))
				}), this.onLocalConnectionQualityChanged = e => {
					this.emit(em.ConnectionQualityChanged, e, this.localParticipant)
				}, this.onMediaDevicesError = (e, t) => {
					this.emit(em.MediaDevicesError, e, t)
				}, this.onLocalParticipantPermissionsChanged = e => {
					this.emit(em.ParticipantPermissionsChanged, e, this.localParticipant)
				}, this.onLocalChatMessageSent = e => {
					this.emit(em.ChatMessage, e, this.localParticipant)
				}, this.setMaxListeners(100), this.remoteParticipants = new Map, this.sidToIdentity = new Map, this.options = Object.assign(Object.assign({}, o9), e), this.log = rA(null != (i = this.options.loggerName) ? i : eo.Room, () => this.logContext), this.transcriptionReceivedTimes = new Map, this.options.audioCaptureDefaults = Object.assign(Object.assign({}, o3), null == e ? void 0 : e.audioCaptureDefaults), this.options.videoCaptureDefaults = Object.assign(Object.assign({}, o4), null == e ? void 0 : e.videoCaptureDefaults), this.options.publishDefaults = Object.assign(Object.assign({}, o2), null == e ? void 0 : e.publishDefaults), this.maybeCreateEngine(), this.incomingDataStreamManager = new cM, this.outgoingDataStreamManager = new cx(this.engine, this.log), this.incomingDataTrackManager = new c3({
					e2eeManager: this.e2eeManager
				}), this.incomingDataTrackManager.on("sfuUpdateSubscription", e => {
					this.engine.client.sendUpdateDataSubscription(e.sid, e.subscribe)
				}).on("trackPublished", e => {
					var t;
					e.track.publisherIdentity !== this.localParticipant.identity && (this.emit(em.DataTrackPublished, e.track), null == (t = this.remoteParticipants.get(e.track.publisherIdentity)) || t.addRemoteDataTrack(e.track))
				}).on("trackUnpublished", e => {
					var t;
					e.publisherIdentity !== this.localParticipant.identity && (this.emit(em.DataTrackUnpublished, e.sid), null == (t = this.remoteParticipants.get(e.publisherIdentity)) || t.removeRemoteDataTrack(e.sid))
				}), this.outgoingDataTrackManager = new li({
					e2eeManager: this.e2eeManager
				}), this.outgoingDataTrackManager.on("sfuPublishRequest", e => {
					this.engine.client.sendPublishDataTrackRequest(e.handle, e.name, e.usesE2ee)
				}).on("sfuUnpublishRequest", e => {
					this.engine.client.sendUnPublishDataTrackRequest(e.handle)
				}).on("trackPublished", e => {
					this.emit(em.LocalDataTrackPublished, e.track)
				}).on("trackUnpublished", e => {
					this.emit(em.LocalDataTrackUnpublished, e.sid)
				}).on("packetAvailable", e => {
					let t = e.handle,
						i = e.bytes;
					this.engine.sendLossyBytes(i, eN.DATA_TRACK_LOSSY, "wait").finally(() => this.outgoingDataTrackManager.handlePacketSendComplete(t))
				}), this.registerRpcDataStreamHandler(), this.rpcClientManager = new lc(this.log, this.outgoingDataStreamManager, this.getRemoteParticipantClientProtocol, () => {
					var e, t;
					return null == (t = null == (e = this.engine.latestJoinResponse) ? void 0 : e.serverInfo) ? void 0 : t.version
				}), this.rpcClientManager.on("sendDataPacket", e => {
					var t;
					let i = e.packet;
					null == (t = this.engine) || t.sendDataPacket(i, eN.RELIABLE)
				}), this.rpcServerManager = new ll(this.log, this.outgoingDataStreamManager, this.getRemoteParticipantClientProtocol), this.rpcServerManager.on("sendDataPacket", e => {
					var t;
					let i = e.packet;
					null == (t = this.engine) || t.sendDataPacket(i, eN.RELIABLE)
				}), this.disconnectLock = new e0, this.localParticipant = new lv("", "", this.engine, this.options, this.outgoingDataStreamManager, this.outgoingDataTrackManager, this.rpcClientManager, this.rpcServerManager), this.setupFrameMetadata(), (this.options.e2ee || this.options.encryption) && this.setupE2EE(), this.engine.e2eeManager = this.e2eeManager, this.incomingDataTrackManager.updateE2eeManager(null != (n = this.e2eeManager) ? n : null), this.outgoingDataTrackManager.updateE2eeManager(null != (r = this.e2eeManager) ? r : null), this.options.videoCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("videoinput", sQ(this.options.videoCaptureDefaults.deviceId)), this.options.audioCaptureDefaults.deviceId && this.localParticipant.activeDeviceMap.set("audioinput", sQ(this.options.audioCaptureDefaults.deviceId)), (null == (a = this.options.audioOutput) ? void 0 : a.deviceId) && this.switchActiveDevice("audiooutput", sQ(this.options.audioOutput.deviceId)).catch(e => this.log.warn("Could not set audio output: ".concat(e.message))), s_()) {
				let e, t = new AbortController;
				if (lS.cleanupRegistry) {
					let i = new WeakRef(this);
					e = () => {
						let e = i.deref();
						e && e.handleDeviceChange()
					}, lS.cleanupRegistry.register(this, () => {
						t.abort()
					})
				} else e = this.handleDeviceChange;
				null == (o = null == (s = navigator.mediaDevices) ? void 0 : s.addEventListener) || o.call(s, "devicechange", e, {
					signal: t.signal
				})
			}
		}
		registerTextStreamHandler(e, t) {
			return this.incomingDataStreamManager.registerTextStreamHandler(e, t)
		}
		unregisterTextStreamHandler(e) {
			return this.incomingDataStreamManager.unregisterTextStreamHandler(e)
		}
		registerByteStreamHandler(e, t) {
			return this.incomingDataStreamManager.registerByteStreamHandler(e, t)
		}
		unregisterByteStreamHandler(e) {
			return this.incomingDataStreamManager.unregisterByteStreamHandler(e)
		}
		registerRpcMethod(e, t) {
			this.rpcServerManager.registerRpcMethod(e, t)
		}
		unregisterRpcMethod(e) {
			this.rpcServerManager.unregisterRpcMethod(e)
		}
		setE2EEEnabled(e) {
			return rF(this, void 0, void 0, function*() {
				let t = yield this.e2eeStateMutex.lock();
				try {
					if (this.e2eeManager) this.isE2EEEnabled !== e && (yield this.localParticipant.setE2EEEnabled(e), "" !== this.localParticipant.identity && this.e2eeManager.setParticipantCryptorEnabled(e, this.localParticipant.identity));
					else throw Error("e2ee not configured, please set e2ee settings within the room options")
				} finally {
					t()
				}
			})
		}
		setupE2EE() {
			var e, t;
			let i = !!this.options.encryption,
				n = this.options.encryption || this.options.e2ee;
			n && ("e2eeManager" in n ? (this.e2eeManager = n.e2eeManager, this.e2eeManager.isDataChannelEncryptionEnabled = i) : this.e2eeManager = new oS(n, i), this.e2eeManager.on(eC.ParticipantEncryptionStatusChanged, (e, t) => {
				s8(t) && (this.isE2EEEnabled = e), this.emit(em.ParticipantEncryptionStatusChanged, e, t)
			}), this.e2eeManager.on(eC.EncryptionError, (e, t) => {
				let i = t ? this.getParticipantByIdentity(t) : void 0;
				this.emit(em.EncryptionError, e, i)
			}), null == (e = this.e2eeManager) || e.setup(this), null == (t = this.e2eeManager) || t.setupEngine(this.engine))
		}
		setupFrameMetadata() {
			var e;
			let t = null != (e = this.options.frameMetadata) ? e : this.options.packetTrailer;
			this.frameMetadataManager = new ow(t), this.frameMetadataManager.setup(this)
		}
		get logContext() {
			var e, t, i;
			return {
				room: this.name,
				roomID: null == (e = this.roomInfo) ? void 0 : e.sid,
				participant: null == (t = this.localParticipant) ? void 0 : t.identity,
				participantID: null == (i = this.localParticipant) ? void 0 : i.sid
			}
		}
		get isRecording() {
			var e, t;
			return null != (t = null == (e = this.roomInfo) ? void 0 : e.activeRecording) && t
		}
		getSid() {
			return this.state === eQ.Disconnected ? aN.resolve("") : this.roomInfo && "" !== this.roomInfo.sid ? aN.resolve(this.roomInfo.sid) : new aN((e, t) => {
				let i = t => {
					"" !== t.sid && (this.engine.off(ef.RoomUpdate, i), e(t.sid))
				};
				this.engine.on(ef.RoomUpdate, i), this.once(em.Disconnected, () => {
					this.engine.off(ef.RoomUpdate, i), t(new aQ("Room disconnected before room server id was available"))
				})
			})
		}
		get name() {
			var e, t;
			return null != (t = null == (e = this.roomInfo) ? void 0 : e.name) ? t : ""
		}
		get metadata() {
			var e;
			return null == (e = this.roomInfo) ? void 0 : e.metadata
		}
		get numParticipants() {
			var e, t;
			return null != (t = null == (e = this.roomInfo) ? void 0 : e.numParticipants) ? t : 0
		}
		get numPublishers() {
			var e, t;
			return null != (t = null == (e = this.roomInfo) ? void 0 : e.numPublishers) ? t : 0
		}
		maybeCreateEngine() {
			(!this.engine || !this.engine.isNewlyCreated && this.engine.isClosed) && (this.engine = new cC(this.options), this.engine.e2eeManager = this.e2eeManager, this.engine.on(ef.ParticipantUpdate, this.handleParticipantUpdates).on(ef.RoomUpdate, this.handleRoomUpdate).on(ef.SpeakersChanged, this.handleSpeakersChanged).on(ef.StreamStateChanged, this.handleStreamStateUpdate).on(ef.ConnectionQualityUpdate, this.handleConnectionQualityUpdate).on(ef.SubscriptionError, this.handleSubscriptionError).on(ef.SubscriptionPermissionUpdate, this.handleSubscriptionPermissionUpdate).on(ef.MediaTrackAdded, (e, t, i) => {
				this.onTrackAdded(e, t, i)
			}).on(ef.Disconnected, e => {
				this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, e)
			}).on(ef.ActiveSpeakersUpdate, this.handleActiveSpeakersUpdate).on(ef.DataPacketReceived, this.handleDataPacket).on(ef.Resuming, () => {
				this.clearConnectionReconcile(), this.isResuming = !0, this.log.debug("Resuming signal connection"), this.setAndEmitConnectionState(eQ.SignalReconnecting) && this.emit(em.SignalReconnecting)
			}).on(ef.Resumed, () => {
				this.registerConnectionReconcile(), this.isResuming = !1, this.log.debug("Resumed signal connection"), this.updateSubscriptions(), this.emitBufferedEvents(), this.setAndEmitConnectionState(eQ.Connected) && this.emit(em.Reconnected)
			}).on(ef.SignalResumed, () => {
				this.bufferedEvents = [], (this.state === eQ.Reconnecting || this.isResuming) && this.sendSyncState()
			}).on(ef.Restarting, this.handleRestarting).on(ef.Restarted, this.handleRestarted).on(ef.SignalRestarted, this.handleSignalRestarted).on(ef.Offline, () => {
				this.setAndEmitConnectionState(eQ.Reconnecting) && this.emit(em.Reconnecting)
			}).on(ef.DCBufferStatusChanged, (e, t) => {
				this.emit(em.DCBufferStatusChanged, e, t)
			}).on(ef.LocalTrackSubscribed, e => {
				this.handleLocalTrackSubscribed(e)
			}).on(ef.RoomMoved, e => {
				this.log.debug("room moved", e), e.room && this.handleRoomUpdate(e.room), this.remoteParticipants.forEach((e, t) => {
					this.handleParticipantDisconnected(t, e)
				}), this.emit(em.Moved, e.room.name), e.participant ? this.handleParticipantUpdates([e.participant, ...e.otherParticipants]) : this.handleParticipantUpdates(e.otherParticipants)
			}).on(ef.PublishDataTrackResponse, e => {
				e.info ? this.outgoingDataTrackManager.receivedSfuPublishResponse(e.info.pubHandle, {
					type: "ok",
					data: {
						sid: e.info.sid,
						pubHandle: e.info.pubHandle,
						name: e.info.name,
						usesE2ee: e.info.encryption !== iR.NONE
					}
				}) : this.log.warn("received PublishDataTrackResponse, but event.info was ".concat(e.info, ", so skipping."))
			}).on(ef.UnPublishDataTrackResponse, e => {
				e.info ? this.outgoingDataTrackManager.receivedSfuUnpublishResponse(e.info.pubHandle) : this.log.warn("received UnPublishDataTrackResponse, but event.info was ".concat(e.info, ", so skipping."))
			}).on(ef.DataTrackSubscriberHandles, e => {
				let t = new Map(Object.entries(e.subHandles).map(e => {
					let t = tg(e, 2),
						i = t[0],
						n = t[1];
					return [parseInt(i, 10), n.trackSid]
				}));
				this.incomingDataTrackManager.receivedSfuSubscriberHandles(t)
			}).on(ef.DataTrackPacketReceived, e => {
				try {
					this.incomingDataTrackManager.packetReceived(e)
				} catch (e) {
					throw e
				}
			}).on(ef.Joined, e => {
				let t = new Map(e.otherParticipants.map(e => [e.identity, e.dataTracks.map(e => oL(e))]));
				this.incomingDataTrackManager.receiveSfuPublicationUpdates(t)
			}).on(ef.TokenRefreshed, e => {
				var t;
				null == (t = this.regionUrlProvider) || t.updateToken(e)
			}).on(ef.ServerRegionsReported, e => {
				var t;
				null == (t = this.regionUrlProvider) || t.setServerReportedRegions({
					regionSettings: e,
					updatedAtInMs: Date.now(),
					maxAgeInMs: 5e3
				})
			}), this.localParticipant && this.localParticipant.setupEngine(this.engine), this.e2eeManager && this.e2eeManager.setupEngine(this.engine), this.outgoingDataStreamManager && this.outgoingDataStreamManager.setupEngine(this.engine))
		}
		createRegionStrategy() {
			return {
				getNextUrl: e => rF(this, void 0, void 0, function*() {
					return this.regionUrlProvider ? this.regionUrlProvider.getNextBestRegionUrl(e) : null
				}),
				resetAttempts: () => {
					var e;
					return null == (e = this.regionUrlProvider) ? void 0 : e.resetAttempts()
				}
			}
		}
		static getLocalDevices(e) {
			let t = !(arguments.length > 1) || void 0 === arguments[1] || arguments[1];
			return oP.getInstance().getDevices(e, t)
		}
		prepareConnection(e, t) {
			return rF(this, void 0, void 0, function*() {
				if (this.state === eQ.Disconnected) {
					this.log.debug("prepareConnection to ".concat(e));
					try {
						if (sA(new URL(e)) && t) {
							this.regionUrlProvider = new cR(e, t);
							let i = yield this.regionUrlProvider.getNextBestRegionUrl();
							i && this.state === eQ.Disconnected && (this.regionUrl = i, yield fetch(sY(i), {
								method: "HEAD"
							}), this.log.debug("prepared connection to ".concat(i)))
						} else yield fetch(sY(e), {
							method: "HEAD"
						})
					} catch (e) {
						this.log.warn("could not prepare connection", {
							error: e
						})
					}
				}
			})
		}
		getParticipantByIdentity(e) {
			return this.localParticipant.identity === e ? this.localParticipant : this.remoteParticipants.get(e)
		}
		clearConnectionFutures() {
			this.connectFuture = void 0
		}
		simulateScenario(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i, n = () => rF(this, void 0, void 0, function*() {});
				switch (e) {
					case "signal-reconnect":
						yield this.engine.client.handleOnClose("simulate disconnect");
						break;
					case "fail-on-v1-path":
						this.engine.failNextV1Path();
						break;
					case "speaker":
						i = new rh({
							scenario: {
								case: "speakerUpdate",
								value: 3
							}
						});
						break;
					case "node-failure":
						i = new rh({
							scenario: {
								case: "nodeFailure",
								value: !0
							}
						});
						break;
					case "server-leave":
						i = new rh({
							scenario: {
								case: "serverLeave",
								value: !0
							}
						});
						break;
					case "migration":
						i = new rh({
							scenario: {
								case: "migration",
								value: !0
							}
						});
						break;
					case "resume-reconnect":
						this.engine.failNext(), yield this.engine.client.handleOnClose("simulate resume-disconnect");
						break;
					case "disconnect-signal-on-resume":
						n = () => rF(this, void 0, void 0, function*() {
							yield this.engine.client.handleOnClose("simulate resume-disconnect")
						}), i = new rh({
							scenario: {
								case: "disconnectSignalOnResume",
								value: !0
							}
						});
						break;
					case "disconnect-signal-on-resume-no-messages":
						n = () => rF(this, void 0, void 0, function*() {
							yield this.engine.client.handleOnClose("simulate resume-disconnect")
						}), i = new rh({
							scenario: {
								case: "disconnectSignalOnResumeNoMessages",
								value: !0
							}
						});
						break;
					case "full-reconnect":
						this.engine.fullReconnectOnNext = !0, yield this.engine.client.handleOnClose("simulate full-reconnect");
						break;
					case "force-tcp":
					case "force-tls":
						i = new rh({
							scenario: {
								case: "switchCandidateProtocol",
								value: "force-tls" === e ? 2 : 1
							}
						}), n = () => rF(this, void 0, void 0, function*() {
							let e = this.engine.client.onLeave;
							e && e(new n0({
								reason: ip.CLIENT_INITIATED,
								action: n1.RECONNECT
							}))
						});
						break;
					case "subscriber-bandwidth":
						if (void 0 === t || "number" != typeof t) throw Error("subscriber-bandwidth requires a number as argument");
						i = new rh({
							scenario: {
								case: "subscriberBandwidth",
								value: s$(t)
							}
						});
						break;
					case "leave-full-reconnect":
						i = new rh({
							scenario: {
								case: "leaveRequestFullReconnect",
								value: !0
							}
						})
				}
				i && (yield this.engine.client.sendSimulateScenario(i), yield n())
			})
		}
		get canPlaybackAudio() {
			return this.audioEnabled
		}
		get canPlaybackVideo() {
			return !this.isVideoPlaybackBlocked
		}
		getActiveDevice(e) {
			return this.localParticipant.activeDeviceMap.get(e)
		}
		switchActiveDevice(e, t) {
			return rF(this, arguments, void 0, function(e, t) {
				var i = this;
				let n = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
				return function*() {
					var r, a, s, o, c, l;
					let d = !0,
						u = !1,
						h = n ? {
							exact: t
						} : t;
					if ("audioinput" === e) {
						u = 0 === i.localParticipant.audioTrackPublications.size;
						let t = null != (r = i.getActiveDevice(e)) ? r : i.options.audioCaptureDefaults.deviceId;
						i.options.audioCaptureDefaults.deviceId = h;
						let n = Array.from(i.localParticipant.audioTrackPublications.values()).filter(e => e.source === sp.Source.Microphone);
						try {
							d = (yield Promise.all(n.map(e => {
								var t;
								return null == (t = e.audioTrack) ? void 0 : t.setDeviceId(h)
							}))).every(e => !0 === e)
						} catch (e) {
							throw i.options.audioCaptureDefaults.deviceId = t, e
						}
						let a = n.some(e => {
							var t, i;
							return null != (i = null == (t = e.track) ? void 0 : t.isMuted) && i
						});
						d && a && (u = !0)
					} else if ("videoinput" === e) {
						u = 0 === i.localParticipant.videoTrackPublications.size;
						let t = null != (a = i.getActiveDevice(e)) ? a : i.options.videoCaptureDefaults.deviceId;
						i.options.videoCaptureDefaults.deviceId = h;
						let n = Array.from(i.localParticipant.videoTrackPublications.values()).filter(e => e.source === sp.Source.Camera);
						try {
							d = (yield Promise.all(n.map(e => {
								var t;
								return null == (t = e.videoTrack) ? void 0 : t.setDeviceId(h)
							}))).every(e => !0 === e)
						} catch (e) {
							throw i.options.videoCaptureDefaults.deviceId = t, e
						}
						let r = n.some(e => {
							var t, i;
							return null != (i = null == (t = e.track) ? void 0 : t.isMuted) && i
						});
						d && r && (u = !0)
					} else if ("audiooutput" === e) {
						if (u = !0, !sC() && !i.options.webAudioMix || i.options.webAudioMix && i.audioContext && !("setSinkId" in i.audioContext)) throw Error("cannot switch audio output, the current browser does not support it");
						i.options.webAudioMix && (t = null != (s = yield oP.getInstance().normalizeDeviceId("audiooutput", t)) ? s : ""), null != (l = i.options).audioOutput || (l.audioOutput = {});
						let n = null != (o = i.getActiveDevice(e)) ? o : i.options.audioOutput.deviceId;
						i.options.audioOutput.deviceId = t;
						try {
							i.options.webAudioMix && (null == (c = i.audioContext) || c.setSinkId(t)), yield Promise.all(Array.from(i.remoteParticipants.values()).map(e => e.setAudioOutput({
								deviceId: t
							})))
						} catch (e) {
							throw i.options.audioOutput.deviceId = n, e
						}
					}
					return u && (i.localParticipant.activeDeviceMap.set(e, t), i.emit(em.ActiveDeviceChanged, e, t)), d
				}()
			})
		}
		setupLocalParticipantEvents() {
			this.localParticipant.on(eg.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).on(eg.ParticipantNameChanged, this.onLocalParticipantNameChanged).on(eg.AttributesChanged, this.onLocalAttributesChanged).on(eg.TrackMuted, this.onLocalTrackMuted).on(eg.TrackUnmuted, this.onLocalTrackUnmuted).on(eg.LocalTrackPublished, this.onLocalTrackPublished).on(eg.LocalTrackUnpublished, this.onLocalTrackUnpublished).on(eg.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).on(eg.MediaDevicesError, this.onMediaDevicesError).on(eg.AudioStreamAcquired, this.startAudio).on(eg.ChatMessage, this.onLocalChatMessageSent).on(eg.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged)
		}
		recreateEngine(e) {
			let t = this.engine;
			e && t && !t.client.isDisconnected ? t.client.sendLeave().finally(() => t.close()) : null == t || t.close(), this.engine = void 0, this.isResuming = !1, this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.bufferedEvents = [], this.maybeCreateEngine()
		}
		onTrackAdded(e, t, i) {
			var n;
			let r, a;
			if (this.state === eQ.Connecting || this.state === eQ.Reconnecting) {
				let n = () => {
						this.log.debug("deferring on track for later", {
							mediaTrackId: e.id,
							mediaStreamId: t.id,
							tracksInStream: t.getTracks().map(e => e.id)
						}), this.onTrackAdded(e, t, i), r()
					},
					r = () => {
						this.off(em.Reconnected, n), this.off(em.Connected, n), this.off(em.Disconnected, r)
					};
				this.once(em.Reconnected, n), this.once(em.Connected, n), this.once(em.Disconnected, r);
				return
			}
			if (this.state === eQ.Disconnected) return void this.log.warn("skipping incoming track after Room disconnected");
			if ("ended" === e.readyState) return void this.log.debug("skipping incoming track as it already ended");
			let s = (a = (n = t.id).split("|")).length > 1 ? [a[0], n.substr(a[0].length + 1)] : [n, ""],
				o = s[0],
				c = s[1],
				l = e.id;
			if (c && c.startsWith("TR") && (l = c), o === this.localParticipant.sid) return void this.log.warn("tried to create RemoteParticipant for local participant");
			let d = Array.from(this.remoteParticipants.values()).find(e => e.sid === o);
			if (!d) {
				o.startsWith("PA") && this.log.error("Tried to add a track for a participant, that's not present. Sid: ".concat(o));
				return
			}
			if (!l.startsWith("TR")) {
				let e = this.engine.getTrackIdForReceiver(i);
				if (!e) return void this.log.error("Tried to add a track whose 'sid' could not be found for a participant, that's not present. Sid: ".concat(o));
				l = e
			}
			l.startsWith("TR") || this.log.warn("Tried to add a track whose 'sid' could not be determined for a participant, that's not present. Sid: ".concat(o, ", streamId: ").concat(c, ", trackId: ").concat(l), {
				remoteParticipantID: o,
				streamId: c,
				trackId: l
			}), this.options.adaptiveStream && (r = "object" == typeof this.options.adaptiveStream ? this.options.adaptiveStream : {});
			let u = d.addSubscribedMediaTrack(e, l, t, i, r);
			(null == u ? void 0 : u.isEncrypted) && !this.e2eeManager && this.emit(em.EncryptionError, Error("Encrypted ".concat(u.source, " track received from participant ").concat(d.sid, ", but room does not have encryption enabled!")))
		}
		handleLocalTrackSubscribed(e) {
			let t, i = () => this.localParticipant.getTrackPublications().find(t => t.trackSid === e),
				n = i();
			if (n) return void this.emitLocalTrackSubscribed(n);
			this.log.debug("deferring LocalTrackSubscribed, publication not yet available", {
				subscribedSid: e
			});
			let r = t => {
					t.trackSid === e && (a(), this.emitLocalTrackSubscribed(t))
				},
				a = () => {
					clearTimeout(t), this.localParticipant.off(eg.LocalTrackPublished, r), this.off(em.Disconnected, a)
				};
			this.localParticipant.on(eg.LocalTrackPublished, r), this.once(em.Disconnected, a), t = setTimeout(() => {
				a();
				let t = i();
				t ? this.emitLocalTrackSubscribed(t) : this.log.warn("could not find local track publication for LocalTrackSubscribed event after timeout", {
					subscribedSid: e
				})
			}, 1e4)
		}
		emitLocalTrackSubscribed(e) {
			this.localParticipant.emit(eg.LocalTrackSubscribed, e), this.emitWhenConnected(em.LocalTrackSubscribed, e, this.localParticipant)
		}
		handleDisconnect() {
			var e, t;
			let i = !(arguments.length > 0) || void 0 === arguments[0] || arguments[0],
				n = arguments.length > 1 ? arguments[1] : void 0;
			if (this.clearConnectionReconcile(), this.isResuming = !1, this.bufferedEvents = [], this.transcriptionReceivedTimes.clear(), this.incomingDataStreamManager.clearControllers(), this.incomingDataTrackManager.reset(), this.outgoingDataTrackManager.reset(), this.state !== eQ.Disconnected) {
				this.regionUrl = void 0, this.regionUrlProvider && this.regionUrlProvider.notifyDisconnected();
				try {
					this.remoteParticipants.forEach(e => {
						e.trackPublications.forEach(t => {
							e.unpublishTrack(t.trackSid)
						})
					}), this.localParticipant.trackPublications.forEach(e => {
						var t, n, r;
						e.track && this.localParticipant.unpublishTrack(e.track, i), i ? (null == (t = e.track) || t.detach(), null == (n = e.track) || n.stop()) : null == (r = e.track) || r.stopMonitor()
					}), this.localParticipant.off(eg.ParticipantMetadataChanged, this.onLocalParticipantMetadataChanged).off(eg.ParticipantNameChanged, this.onLocalParticipantNameChanged).off(eg.AttributesChanged, this.onLocalAttributesChanged).off(eg.TrackMuted, this.onLocalTrackMuted).off(eg.TrackUnmuted, this.onLocalTrackUnmuted).off(eg.LocalTrackPublished, this.onLocalTrackPublished).off(eg.LocalTrackUnpublished, this.onLocalTrackUnpublished).off(eg.ConnectionQualityChanged, this.onLocalConnectionQualityChanged).off(eg.MediaDevicesError, this.onMediaDevicesError).off(eg.AudioStreamAcquired, this.startAudio).off(eg.ChatMessage, this.onLocalChatMessageSent).off(eg.ParticipantPermissionsChanged, this.onLocalParticipantPermissionsChanged), this.localParticipant.trackPublications.clear(), this.localParticipant.videoTrackPublications.clear(), this.localParticipant.audioTrackPublications.clear(), this.remoteParticipants.clear(), this.sidToIdentity.clear(), this.activeSpeakers = [], this.audioContext && "boolean" == typeof this.options.webAudioMix && (this.audioContext.close(), this.audioContext = void 0), s_() && (window.removeEventListener("beforeunload", this.onPageLeave), window.removeEventListener("pagehide", this.onPageLeave), window.removeEventListener("freeze", this.onPageLeave), null == (t = null == (e = navigator.mediaDevices) ? void 0 : e.removeEventListener) || t.call(e, "devicechange", this.handleDeviceChange))
				} finally {
					this.setAndEmitConnectionState(eQ.Disconnected), this.emit(em.Disconnected, n)
				}
			}
		}
		handleParticipantDisconnected(e, t) {
			this.remoteParticipants.delete(e), t && (this.incomingDataStreamManager.validateParticipantHasNoActiveDataStreams(e), this.incomingDataTrackManager.handleRemoteParticipantDisconnected(e), t.trackPublications.forEach(e => {
				t.unpublishTrack(e.trackSid, !0)
			}), this.emit(em.ParticipantDisconnected, t), t.setDisconnected(), this.rpcClientManager.handleParticipantDisconnected(t.identity))
		}
		selectDefaultDevices() {
			return rF(this, void 0, void 0, function*() {
				var e, t, i;
				let n = oP.getInstance().previousDevices,
					r = yield oP.getInstance().getDevices(void 0, !1), a = aF();
				if ((null == a ? void 0 : a.name) === "Chrome" && "iOS" !== a.os)
					for (let e of r) {
						let t = n.find(t => t.deviceId === e.deviceId);
						t && "" !== t.label && t.kind === e.kind && t.label !== e.label && "default" === this.getActiveDevice(e.kind) && this.emit(em.ActiveDeviceChanged, e.kind, e.deviceId)
					}
				for (let a of ["audiooutput", "audioinput", "videoinput"]) {
					let s = "audioinput" === a ? sp.Source.Microphone : "videoinput" === a ? sp.Source.Camera : sp.Source.Unknown,
						o = this.localParticipant.getTrackPublication(s);
					if (o && (null == (e = o.track) ? void 0 : e.isUserProvided)) continue;
					let c = r.filter(e => e.kind === a),
						l = this.getActiveDevice(a);
					if (l === (null == (t = n.filter(e => e.kind === a)[0]) ? void 0 : t.deviceId) && c.length > 0 && (null == (i = c[0]) ? void 0 : i.deviceId) !== l) {
						yield this.switchActiveDevice(a, c[0].deviceId);
						continue
					}("audioinput" !== a || sI()) && "videoinput" !== a && (!(c.length > 0) || c.find(e => e.deviceId === this.getActiveDevice(a)) || "audiooutput" === a && sI() || (yield this.switchActiveDevice(a, c[0].deviceId)))
				}
			})
		}
		acquireAudioContext() {
			return rF(this, void 0, void 0, function*() {
				var e, t;
				if ("boolean" != typeof this.options.webAudioMix && this.options.webAudioMix.audioContext ? this.audioContext = this.options.webAudioMix.audioContext : this.audioContext && "closed" !== this.audioContext.state || (this.audioContext = null != (e = sa()) ? e : void 0), this.options.webAudioMix && this.remoteParticipants.forEach(e => e.setAudioContext(this.audioContext)), this.localParticipant.setAudioContext(this.audioContext), this.audioContext && "suspended" === this.audioContext.state) try {
					yield Promise.race([this.audioContext.resume(), sv(200)])
				} catch (e) {
					this.log.warn("Could not resume audio context", {
						error: e
					})
				}
				let i = (null == (t = this.audioContext) ? void 0 : t.state) === "running";
				i !== this.canPlaybackAudio && (this.audioEnabled = i, this.emit(em.AudioPlaybackStatusChanged, i))
			})
		}
		createParticipant(e, t) {
			var i;
			let n;
			return n = t ? lT.fromParticipantInfo(this.engine.client, t, {
				loggerContextCb: () => this.logContext,
				loggerName: this.options.loggerName
			}, this.incomingDataTrackManager) : new lT(this.engine.client, "", e, void 0, void 0, void 0, {
				loggerContextCb: () => this.logContext,
				loggerName: this.options.loggerName
			}), this.options.webAudioMix && n.setAudioContext(this.audioContext), (null == (i = this.options.audioOutput) ? void 0 : i.deviceId) && n.setAudioOutput(this.options.audioOutput).catch(e => this.log.warn("Could not set audio output: ".concat(e.message))), n
		}
		getOrCreateParticipant(e, t) {
			if (this.remoteParticipants.has(e)) {
				let i = this.remoteParticipants.get(e);
				return t && i.updateInfo(t) && this.sidToIdentity.set(t.sid, t.identity), i
			}
			let i = this.createParticipant(e, t);
			return this.remoteParticipants.set(e, i), this.sidToIdentity.set(t.sid, t.identity), this.emitWhenConnected(em.ParticipantConnected, i), i.on(eg.TrackPublished, e => {
				this.emitWhenConnected(em.TrackPublished, e, i)
			}).on(eg.TrackSubscribed, (e, t) => {
				e.kind === sp.Kind.Audio ? (e.on(ev.AudioPlaybackStarted, this.handleAudioPlaybackStarted), e.on(ev.AudioPlaybackFailed, this.handleAudioPlaybackFailed)) : e.kind === sp.Kind.Video && (e.on(ev.VideoPlaybackFailed, this.handleVideoPlaybackFailed), e.on(ev.VideoPlaybackStarted, this.handleVideoPlaybackStarted)), this.emitWhenConnected(em.TrackSubscribed, e, t, i)
			}).on(eg.TrackUnpublished, e => {
				this.emit(em.TrackUnpublished, e, i)
			}).on(eg.TrackUnsubscribed, (e, t) => {
				this.emit(em.TrackUnsubscribed, e, t, i)
			}).on(eg.TrackMuted, e => {
				this.emitWhenConnected(em.TrackMuted, e, i)
			}).on(eg.TrackUnmuted, e => {
				this.emitWhenConnected(em.TrackUnmuted, e, i)
			}).on(eg.ParticipantMetadataChanged, e => {
				this.emitWhenConnected(em.ParticipantMetadataChanged, e, i)
			}).on(eg.ParticipantNameChanged, e => {
				this.emitWhenConnected(em.ParticipantNameChanged, e, i)
			}).on(eg.AttributesChanged, e => {
				this.emitWhenConnected(em.ParticipantAttributesChanged, e, i)
			}).on(eg.ConnectionQualityChanged, e => {
				this.emitWhenConnected(em.ConnectionQualityChanged, e, i)
			}).on(eg.ParticipantPermissionsChanged, e => {
				this.emitWhenConnected(em.ParticipantPermissionsChanged, e, i)
			}).on(eg.TrackSubscriptionStatusChanged, (e, t) => {
				this.emitWhenConnected(em.TrackSubscriptionStatusChanged, e, t, i)
			}).on(eg.TrackSubscriptionFailed, (e, t) => {
				this.emit(em.TrackSubscriptionFailed, e, i, t)
			}).on(eg.TrackSubscriptionPermissionChanged, (e, t) => {
				this.emitWhenConnected(em.TrackSubscriptionPermissionChanged, e, t, i)
			}).on(eg.Active, () => {
				this.emitWhenConnected(em.ParticipantActive, i), i.kind === iw.AGENT && this.localParticipant.setActiveAgent(i)
			}), t && i.updateInfo(t), i
		}
		sendSyncState() {
			let e = Array.from(this.remoteParticipants.values()).reduce((e, t) => (e.push(...t.getTrackPublications()), e), []),
				t = this.localParticipant.getTrackPublications(),
				i = this.outgoingDataTrackManager.queryPublished();
			this.engine.sendSyncState(e, t, i)
		}
		updateSubscriptions() {
			for (let t of this.remoteParticipants.values())
				for (let i of t.videoTrackPublications.values()) {
					var e;
					i.isSubscribed && (e = i) && !e.isLocal && i.emitTrackUpdate()
				}
		}
		getRemoteParticipantBySid(e) {
			let t = this.sidToIdentity.get(e);
			if (t) return this.remoteParticipants.get(t)
		}
		registerRpcDataStreamHandler() {
			this.incomingDataStreamManager.registerTextStreamHandler(lr, (e, t) => rF(this, [e, t], void 0, function(e, t) {
				var i = this;
				let n = t.identity;
				return function*() {
					var t;
					let r = null != (t = e.info.attributes) ? t : {};
					yield i.rpcServerManager.handleIncomingDataStream(e, n, r)
				}()
			})), this.incomingDataStreamManager.registerTextStreamHandler(la, (e, t) => rF(this, [e, t], void 0, function(e, t) {
				var i = this;
				let n = t.identity;
				return function*() {
					var t;
					let r = null != (t = e.info.attributes) ? t : {};
					yield i.rpcClientManager.handleIncomingDataStream(e, n, r)
				}()
			}))
		}
		registerConnectionReconcile() {
			this.clearConnectionReconcile();
			let e = 0;
			this.connectionReconcileInterval = a2.setInterval(() => {
				this.engine && !this.engine.isClosed && this.engine.verifyTransport() ? e = 0 : (e++, this.log.warn("detected connection state mismatch", {
					numFailures: e,
					engine: this.engine ? {
						closed: this.engine.isClosed,
						transportsConnectedOrConnecting: this.engine.verifyTransport()
					} : void 0
				}), e >= 3 && (this.recreateEngine(), this.handleDisconnect(this.options.stopLocalTrackOnUnpublish, ip.STATE_MISMATCH)))
			}, 4e3)
		}
		clearConnectionReconcile() {
			this.connectionReconcileInterval && a2.clearInterval(this.connectionReconcileInterval)
		}
		setAndEmitConnectionState(e) {
			return e !== this.state && (this.log.info("connection state changed: ".concat(this.state, " -> ").concat(e)), this.state = e, this.incomingDataStreamManager.setConnected(e === eQ.Connected), this.emit(em.ConnectionStateChanged, this.state), !0)
		}
		emitBufferedEvents() {
			this.bufferedEvents.forEach(e => {
				let t = tg(e, 2),
					i = t[0],
					n = t[1];
				this.emit(i, ...n)
			}), this.bufferedEvents = []
		}
		emitWhenConnected(e) {
			for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
			if (this.state === eQ.Reconnecting || this.isResuming || !this.engine || this.engine.pendingReconnect) this.bufferedEvents.push([e, i]);
			else if (this.state === eQ.Connected) return this.emit(e, ...i);
			return !1
		}
		simulateParticipants(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i, n, r;
				let a = Object.assign({
						audio: !0,
						video: !0,
						useRealTracks: !1
					}, e.publish),
					s = Object.assign({
						count: 9,
						audio: !1,
						video: !0,
						aspectRatios: [1.66, 1.7, 1.3]
					}, e.participants);
				if (this.handleDisconnect(), this.roomInfo = new iy({
						sid: "RM_SIMULATED",
						name: "simulated-room",
						emptyTimeout: 0,
						maxParticipants: 0,
						creationTime: tl.parse(new Date().getTime()),
						metadata: "",
						numParticipants: 1,
						numPublishers: 1,
						turnPassword: "",
						enabledCodecs: [],
						activeRecording: !1
					}), this.localParticipant.updateInfo(new iS({
						identity: "simulated-local",
						name: "local-name"
					})), this.setupLocalParticipantEvents(), this.emit(em.SignalConnected), this.emit(em.Connected), this.setAndEmitConnectionState(eQ.Connected), a.video) {
					let e = new lh(sp.Kind.Video, new iI({
						source: il.CAMERA,
						sid: Math.floor(1e4 * Math.random()).toString(),
						type: ic.AUDIO,
						name: "video-dummy"
					}), new cg(a.useRealTracks && (null == (t = window.navigator.mediaDevices) ? void 0 : t.getUserMedia) ? (yield window.navigator.mediaDevices.getUserMedia({
						video: !0
					})).getVideoTracks()[0] : sK(160 * (null != (i = s.aspectRatios[0]) ? i : 1), 160, !0, !0), void 0, !1, {
						loggerName: this.options.loggerName,
						loggerContextCb: () => this.logContext
					}), {
						loggerName: this.options.loggerName,
						loggerContextCb: () => this.logContext
					});
					this.localParticipant.addTrackPublication(e), this.localParticipant.emit(eg.LocalTrackPublished, e)
				}
				if (a.audio) {
					let e = new lh(sp.Kind.Audio, new iI({
						source: il.MICROPHONE,
						sid: Math.floor(1e4 * Math.random()).toString(),
						type: ic.AUDIO
					}), new ci(a.useRealTracks && (null == (n = navigator.mediaDevices) ? void 0 : n.getUserMedia) ? (yield navigator.mediaDevices.getUserMedia({
						audio: !0
					})).getAudioTracks()[0] : sz(), void 0, !1, this.audioContext, {
						loggerName: this.options.loggerName,
						loggerContextCb: () => this.logContext
					}), {
						loggerName: this.options.loggerName,
						loggerContextCb: () => this.logContext
					});
					this.localParticipant.addTrackPublication(e), this.localParticipant.emit(eg.LocalTrackPublished, e)
				}
				for (let e = 0; e < s.count - 1; e += 1) {
					let t = new iS({
							sid: Math.floor(1e4 * Math.random()).toString(),
							identity: "simulated-".concat(e),
							state: iC.ACTIVE,
							tracks: [],
							joinedAt: tl.parse(Date.now())
						}),
						i = this.getOrCreateParticipant(t.identity, t);
					if (s.video) {
						let n = sK(160 * (null != (r = s.aspectRatios[e % s.aspectRatios.length]) ? r : 1), 160, !1, !0),
							a = new iI({
								source: il.CAMERA,
								sid: Math.floor(1e4 * Math.random()).toString(),
								type: ic.AUDIO
							});
						i.addSubscribedMediaTrack(n, a.sid, new MediaStream([n]), new RTCRtpReceiver), t.tracks = [...t.tracks, a]
					}
					if (s.audio) {
						let e = sz(),
							n = new iI({
								source: il.MICROPHONE,
								sid: Math.floor(1e4 * Math.random()).toString(),
								type: ic.AUDIO
							});
						i.addSubscribedMediaTrack(e, n.sid, new MediaStream([e]), new RTCRtpReceiver), t.tracks = [...t.tracks, n]
					}
					i.updateInfo(t)
				}
			})
		}
		emit(e) {
			for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) i[n - 1] = arguments[n];
			if (e !== em.ActiveSpeakersChanged && e !== em.TranscriptionReceived) {
				let t = (function e(t) {
					return t.map(t => {
						if (t) return Array.isArray(t) ? e(t) : "object" == typeof t ? "logContext" in t ? t.logContext : void 0 : t
					})
				})(i).filter(e => void 0 !== e);
				(e === em.TrackSubscribed || e === em.TrackUnsubscribed) && this.log.trace("subscribe trace: ".concat(e), {
					event: e,
					args: t
				}), this.log.debug("room event ".concat(e), {
					event: e,
					args: t
				})
			}
			return super.emit(e, ...i)
		}
	}
	lS.cleanupRegistry = "u" > typeof FinalizationRegistry && "u" > typeof WeakRef && new FinalizationRegistry(e => {
		e()
	});
	var lC = Object.freeze({
		__proto__: null,
		Convert: class {
			static toAgentAttributes(e) {
				return JSON.parse(e)
			}
			static agentAttributesToJson(e) {
				return JSON.stringify(e)
			}
			static toTranscriptionAttributes(e) {
				return JSON.parse(e)
			}
			static transcriptionAttributesToJson(e) {
				return JSON.stringify(e)
			}
		}
	});
	(et = eY || (eY = {}))[et.IDLE = 0] = "IDLE", et[et.RUNNING = 1] = "RUNNING", et[et.SKIPPED = 2] = "SKIPPED", et[et.SUCCESS = 3] = "SUCCESS", et[et.FAILED = 4] = "FAILED";
	class lw extends rV.EventEmitter {
		constructor(e, t) {
			let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
			super(), this.status = eY.IDLE, this.logs = [], this.options = {}, this.url = e, this.token = t, this.name = this.constructor.name, this.room = new lS(i.roomOptions), this.connectOptions = i.connectOptions, this.options = i
		}
		run(e) {
			return rF(this, void 0, void 0, function*() {
				if (this.status !== eY.IDLE) throw Error("check is running already");
				this.setStatus(eY.RUNNING);
				try {
					yield this.perform()
				} catch (e) {
					e instanceof Error && (this.options.errorsAsWarnings ? this.appendWarning(e.message) : this.appendError(e.message))
				}
				return yield this.disconnect(), yield new Promise(e => setTimeout(e, 500)), this.status !== eY.SKIPPED && this.setStatus(this.isSuccess() ? eY.SUCCESS : eY.FAILED), e && e(), this.getInfo()
			})
		}
		isSuccess() {
			return !this.logs.some(e => "error" === e.level)
		}
		connect(e) {
			return rF(this, void 0, void 0, function*() {
				return this.room.state === eQ.Connected || (e || (e = this.url), yield this.room.connect(e, this.token, this.connectOptions)), this.room
			})
		}
		disconnect() {
			return rF(this, void 0, void 0, function*() {
				this.room && this.room.state !== eQ.Disconnected && (yield this.room.disconnect(), yield new Promise(e => setTimeout(e, 500)))
			})
		}
		skip() {
			this.setStatus(eY.SKIPPED)
		}
		switchProtocol(e) {
			return rF(this, void 0, void 0, function*() {
				let t = !1,
					i = !1;
				if (this.room.on(em.Reconnecting, () => {
						t = !0
					}), this.room.once(em.Reconnected, () => {
						i = !0
					}), this.room.simulateScenario("force-".concat(e)), yield new Promise(e => setTimeout(e, 1e3)), !t) return;
				let n = Date.now() + 1e4;
				for (; Date.now() < n;) {
					if (i) return;
					yield sv(100)
				}
				throw Error("Could not reconnect using ".concat(e, " protocol after 10 seconds"))
			})
		}
		appendMessage(e) {
			this.logs.push({
				level: "info",
				message: e
			}), this.emit("update", this.getInfo())
		}
		appendWarning(e) {
			this.logs.push({
				level: "warning",
				message: e
			}), this.emit("update", this.getInfo())
		}
		appendError(e) {
			this.logs.push({
				level: "error",
				message: e
			}), this.emit("update", this.getInfo())
		}
		setStatus(e) {
			this.status = e, this.emit("update", this.getInfo())
		}
		get engine() {
			var e;
			return null == (e = this.room) ? void 0 : e.engine
		}
		getInfo() {
			return {
				logs: this.logs,
				name: this.name,
				status: this.status,
				description: this.description
			}
		}
	}
	class lE extends lw {
		get description() {
			return "Cloud regions"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				let e = new cR(this.url, this.token);
				if (!e.isCloud()) return void this.skip();
				let t = [],
					i = new Set;
				for (let n = 0; n < 3; n++) {
					let n = yield e.getNextBestRegionUrl();
					if (!n) break;
					if (i.has(n)) continue;
					i.add(n);
					let r = yield this.checkCloudRegion(n);
					this.appendMessage("".concat(r.region, " RTT: ").concat(r.rtt, "ms, duration: ").concat(r.duration, "ms")), t.push(r)
				}
				t.sort((e, t) => (e.duration - t.duration) * .5 + (e.rtt - t.rtt) * .5);
				let n = t[0];
				this.bestStats = n, this.appendMessage("best Cloud region: ".concat(n.region))
			})
		}
		getInfo() {
			let e = super.getInfo();
			return e.data = this.bestStats, e
		}
		checkCloudRegion(e) {
			return rF(this, void 0, void 0, function*() {
				var t, i;
				yield this.connect(e), "tcp" === this.options.protocol && (yield this.switchProtocol("tcp"));
				let n = null == (t = this.room.serverInfo) ? void 0 : t.region;
				if (!n) throw Error("Region not found");
				let r = yield this.room.localParticipant.streamText({
					topic: "test"
				}), a = "A".repeat(1e3), s = Date.now();
				for (let e = 0; e < 1e3; e++) yield r.write(a);
				yield r.close();
				let o = Date.now(),
					c = yield null == (i = this.room.engine.pcManager) ? void 0 : i.publisher.getStats(), l = {
						region: n,
						rtt: 1e4,
						duration: o - s
					};
				return null == c || c.forEach(e => {
					"candidate-pair" === e.type && e.nominated && (l.rtt = 1e3 * e.currentRoundTripTime)
				}), yield this.disconnect(), l
			})
		}
	}
	class lR extends lw {
		get description() {
			return "Connection via UDP vs TCP"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				let e = yield this.checkConnectionProtocol("udp"), t = yield this.checkConnectionProtocol("tcp");
				this.bestStats = e, e.qualityLimitationDurations.bandwidth - t.qualityLimitationDurations.bandwidth > .5 || (e.packetsLost - t.packetsLost) / e.packetsSent > .01 ? (this.appendMessage("best connection quality via tcp"), this.bestStats = t) : this.appendMessage("best connection quality via udp");
				let i = this.bestStats;
				this.appendMessage("upstream bitrate: ".concat((i.bitrateTotal / i.count / 1e3 / 1e3).toFixed(2), " mbps")), this.appendMessage("RTT: ".concat((i.rttTotal / i.count * 1e3).toFixed(2), " ms")), this.appendMessage("jitter: ".concat((i.jitterTotal / i.count * 1e3).toFixed(2), " ms")), i.packetsLost > 0 && this.appendWarning("packets lost: ".concat((i.packetsLost / i.packetsSent * 100).toFixed(2), "%")), i.qualityLimitationDurations.bandwidth > 1 && this.appendWarning("bandwidth limited ".concat((i.qualityLimitationDurations.bandwidth / 10 * 100).toFixed(2), "%")), i.qualityLimitationDurations.cpu > 0 && this.appendWarning("cpu limited ".concat((i.qualityLimitationDurations.cpu / 10 * 100).toFixed(2), "%"))
			})
		}
		getInfo() {
			let e = super.getInfo();
			return e.data = this.bestStats, e
		}
		checkConnectionProtocol(e) {
			return rF(this, void 0, void 0, function*() {
				yield this.connect(), "tcp" === e ? yield this.switchProtocol("tcp"): yield this.switchProtocol("udp");
				let t = document.createElement("canvas");
				t.width = 1280, t.height = 720;
				let i = t.getContext("2d");
				if (!i) throw Error("Could not get canvas context");
				let n = 0,
					r = () => {
						n = (n + 1) % 360, i.fillStyle = "hsl(".concat(n, ", 100%, 50%)"), i.fillRect(0, 0, t.width, t.height), requestAnimationFrame(r)
					};
				r();
				let a = t.captureStream(30).getVideoTracks()[0],
					s = (yield this.room.localParticipant.publishTrack(a, {
						simulcast: !1,
						degradationPreference: "maintain-resolution",
						videoEncoding: {
							maxBitrate: 2e6
						}
					})).track,
					o = {
						protocol: e,
						packetsLost: 0,
						packetsSent: 0,
						qualityLimitationDurations: {},
						rttTotal: 0,
						jitterTotal: 0,
						bitrateTotal: 0,
						count: 0
					},
					c = setInterval(() => rF(this, void 0, void 0, function*() {
						let e = yield s.getRTCStatsReport();
						null == e || e.forEach(e => {
							"outbound-rtp" === e.type ? (o.packetsSent = e.packetsSent, o.qualityLimitationDurations = e.qualityLimitationDurations, o.bitrateTotal += e.targetBitrate, o.count++) : "remote-inbound-rtp" === e.type && (o.packetsLost = e.packetsLost, o.rttTotal += e.roundTripTime, o.jitterTotal += e.jitter)
						})
					}), 1e3);
				return yield new Promise(e => setTimeout(e, 1e4)), clearInterval(c), a.stop(), t.remove(), yield this.disconnect(), o
			})
		}
	}
	class lP extends lw {
		get description() {
			return "Can publish audio"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.connect(), i = yield lg();
				if (yield sr(i, 1e3)) throw Error("unable to detect audio from microphone");
				this.appendMessage("detected audio from microphone"), t.localParticipant.publishTrack(i), yield new Promise(e => setTimeout(e, 3e3));
				let n = yield null == (e = i.sender) ? void 0 : e.getStats();
				if (!n) throw Error("Could not get RTCStats");
				let r = 0;
				if (n.forEach(e => {
						"outbound-rtp" !== e.type || "audio" !== e.kind && (e.kind || "audio" !== e.mediaType) || (r = e.packetsSent)
					}), 0 === r) throw Error("Could not determine packets are sent");
				this.appendMessage("published ".concat(r, " audio packets"))
			})
		}
	}
	class lI extends lw {
		get description() {
			return "Can publish video"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t = yield this.connect(), i = yield lm();
				yield this.checkForVideo(i.mediaStreamTrack), t.localParticipant.publishTrack(i), yield new Promise(e => setTimeout(e, 5e3));
				let n = yield null == (e = i.sender) ? void 0 : e.getStats();
				if (!n) throw Error("Could not get RTCStats");
				let r = 0;
				if (n.forEach(e => {
						"outbound-rtp" !== e.type || "video" !== e.kind && (e.kind || "video" !== e.mediaType) || (r += e.packetsSent)
					}), 0 === r) throw Error("Could not determine packets are sent");
				this.appendMessage("published ".concat(r, " video packets"))
			})
		}
		checkForVideo(e) {
			return rF(this, void 0, void 0, function*() {
				let t = new MediaStream;
				t.addTrack(e.clone());
				let i = document.createElement("video");
				i.srcObject = t, i.muted = !0, i.autoplay = !0, i.playsInline = !0, i.setAttribute("playsinline", "true"), document.body.appendChild(i), yield new Promise(t => {
					i.onplay = () => {
						setTimeout(() => {
							var n, r, a, s;
							let o = document.createElement("canvas"),
								c = e.getSettings(),
								l = null != (r = null != (n = c.width) ? n : i.videoWidth) ? r : 1280,
								d = null != (s = null != (a = c.height) ? a : i.videoHeight) ? s : 720;
							o.width = l, o.height = d;
							let u = o.getContext("2d");
							u.drawImage(i, 0, 0);
							let h = u.getImageData(0, 0, o.width, o.height).data,
								p = !0;
							for (let e = 0; e < h.length; e += 4)
								if (0 !== h[e] || 0 !== h[e + 1] || 0 !== h[e + 2]) {
									p = !1;
									break
								} p ? this.appendError("camera appears to be producing only black frames") : this.appendMessage("received video frames"), t()
						}, 1e3)
					}, i.play()
				}), t.getTracks().forEach(e => e.stop()), i.remove()
			})
		}
	}
	class lD extends lw {
		get description() {
			return "Resuming connection after interruption"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				var e;
				let t, i = yield this.connect(), n = !1, r = !1, a = new Promise(e => {
					setTimeout(e, 5e3), t = e
				}), s = () => {
					n = !0
				};
				i.on(em.SignalReconnecting, s).on(em.Reconnecting, s).on(em.Reconnected, () => {
					r = !0, t(!0)
				}), null == (e = i.engine.client.ws) || e.close();
				let o = i.engine.client.onClose;
				if (o && o(""), yield a, n) {
					if (!r || i.state !== eQ.Connected) throw this.appendWarning("reconnection is only possible in Redis-based configurations"), Error("Not able to reconnect")
				} else throw Error("Did not attempt to reconnect")
			})
		}
	}
	class lM extends lw {
		get description() {
			return "Can connect via TURN"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				var e, t, i;
				sA(new URL(this.url)) && (this.appendMessage("Using region specific url"), this.url = null != (e = yield new cR(this.url, this.token).getNextBestRegionUrl()) ? e : this.url);
				let n = new oB,
					r = yield n.join(this.url, this.token, {
						autoSubscribe: !0,
						maxRetries: 0,
						e2eeEnabled: !1,
						websocketTimeout: 15e3
					}, void 0, !0), a = !1, s = !1, o = !1;
				for (let e of r.iceServers)
					for (let t of e.urls) t.startsWith("turn:") ? (s = !0, o = !0) : t.startsWith("turns:") && (s = !0, o = !0, a = !0), t.startsWith("stun:") && (o = !0);
				o ? s && !a && this.appendWarning("TURN is configured server side, but TURN/TLS is unavailable.") : this.appendWarning("No STUN servers configured on server side."), yield n.close(), (null == (i = null == (t = this.connectOptions) ? void 0 : t.rtcConfig) ? void 0 : i.iceServers) || s ? yield this.room.connect(this.url, this.token, {
					rtcConfig: {
						iceTransportPolicy: "relay"
					}
				}): (this.appendWarning("No TURN servers configured."), this.skip(), yield new Promise(e => setTimeout(e, 0)))
			})
		}
	}
	class l_ extends lw {
		get description() {
			return "Establishing WebRTC connection"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				let e = !1,
					t = !1;
				this.room.on(em.SignalConnected, () => {
					var i;
					let n = this.room.engine.client.onTrickle;
					this.room.engine.client.onTrickle = (i, r) => {
						if (i.candidate) {
							let n = new RTCIceCandidate(i),
								r = "".concat(n.protocol, " ").concat(n.address, ":").concat(n.port, " ").concat(n.type);
							n.address && (function(e) {
								let t = e.split(".");
								if (4 === t.length) {
									if ("10" === t[0]) return !0;
									else if ("192" === t[0] && "168" === t[1]) return !0;
									else if ("172" === t[0]) {
										let e = parseInt(t[1], 10);
										if (e >= 16 && e <= 31) return !0
									}
								}
								return !1
							}(n.address) ? r += " (private)" : "tcp" === n.protocol && "passive" === n.tcpType ? (e = !0, r += " (passive)") : "udp" === n.protocol && (t = !0)), this.appendMessage(r)
						}
						n && n(i, r)
					}, (null == (i = this.room.engine.pcManager) ? void 0 : i.subscriber) && (this.room.engine.pcManager.subscriber.onIceCandidateError = e => {
						e instanceof RTCPeerConnectionIceErrorEvent && this.appendWarning("error with ICE candidate: ".concat(e.errorCode, " ").concat(e.errorText, " ").concat(e.url))
					})
				});
				try {
					yield this.connect(), r_.info("now the room is connected")
				} catch (e) {
					throw this.appendWarning("ports need to be open on firewall in order to connect."), e
				}
				e || this.appendWarning("Server is not configured for ICE/TCP"), t || this.appendWarning("No public IPv4 UDP candidates were found. Your server is likely not configured correctly")
			})
		}
	}
	class lO extends lw {
		get description() {
			return "Connecting to signal connection via WebSocket"
		}
		perform() {
			return rF(this, void 0, void 0, function*() {
				var e, t, i;
				let n;
				(this.url.startsWith("ws:") || this.url.startsWith("http:")) && this.appendWarning("Server is insecure, clients may block connections to it");
				let r = new oB;
				try {
					n = yield r.join(this.url, this.token, {
						autoSubscribe: !0,
						maxRetries: 0,
						e2eeEnabled: !1,
						websocketTimeout: 15e3
					}, void 0, !0)
				} catch (e) {
					if (sA(new URL(this.url))) {
						this.appendMessage("Initial connection failed with error ".concat(e.message, ". Retrying with region fallback"));
						let t = new cR(this.url, this.token),
							i = yield t.getNextBestRegionUrl();
						i && (n = yield r.join(i, this.token, {
							autoSubscribe: !0,
							maxRetries: 0,
							e2eeEnabled: !1,
							websocketTimeout: 15e3
						}, void 0, !0), this.appendMessage("Fallback to region worked. To avoid initial connections failing, ensure you're calling room.prepareConnection() ahead of time"))
					}
				}
				n ? (this.appendMessage("Connected to server, version ".concat(n.serverVersion, ".")), (null == (e = n.serverInfo) ? void 0 : e.edition) === iY.Cloud && (null == (t = n.serverInfo) ? void 0 : t.region) && this.appendMessage("LiveKit Cloud: ".concat(null == (i = n.serverInfo) ? void 0 : i.region))) : this.appendError("Websocket connection could not be established"), yield r.close()
			})
		}
	}
	class lA extends rV.EventEmitter {
		constructor(e, t) {
			let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
			super(), this.options = {}, this.checkResults = new Map, this.url = e, this.token = t, this.options = i
		}
		getNextCheckId() {
			let e = this.checkResults.size;
			return this.checkResults.set(e, {
				logs: [],
				status: eY.IDLE,
				name: "",
				description: ""
			}), e
		}
		updateCheck(e, t) {
			this.checkResults.set(e, t), this.emit("checkUpdate", e, t)
		}
		isSuccess() {
			return Array.from(this.checkResults.values()).every(e => e.status !== eY.FAILED)
		}
		getResults() {
			return Array.from(this.checkResults.values())
		}
		createAndRunCheck(e) {
			return rF(this, void 0, void 0, function*() {
				let t = this.getNextCheckId(),
					i = new e(this.url, this.token, this.options),
					n = e => {
						this.updateCheck(t, e)
					};
				i.on("update", n);
				let r = yield i.run();
				return i.off("update", n), r
			})
		}
		checkWebsocket() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lO)
			})
		}
		checkWebRTC() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(l_)
			})
		}
		checkTURN() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lM)
			})
		}
		checkReconnect() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lD)
			})
		}
		checkPublishAudio() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lP)
			})
		}
		checkPublishVideo() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lI)
			})
		}
		checkConnectionProtocol() {
			return rF(this, void 0, void 0, function*() {
				let e = yield this.createAndRunCheck(lR);
				if (e.data && "protocol" in e.data) {
					let t = e.data;
					this.options.protocol = t.protocol
				}
				return e
			})
		}
		checkCloudRegion() {
			return rF(this, void 0, void 0, function*() {
				return this.createAndRunCheck(lE)
			})
		}
	}
	class lx {}
	class lL {}
	new TextEncoder;
	let lN = new TextDecoder;
	class lU extends Error {
		constructor(e, t) {
			var i;
			super(e, t), tm(this, "code", "ERR_JOSE_GENERIC"), this.name = this.constructor.name, null == (i = Error.captureStackTrace) || i.call(Error, this, this.constructor)
		}
	}
	tm(lU, "code", "ERR_JOSE_GENERIC"), tm(class extends lU {
		constructor(e, t) {
			let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified",
				n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
			super(e, {
				cause: {
					claim: i,
					reason: n,
					payload: t
				}
			}), tm(this, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), tm(this, "claim", void 0), tm(this, "reason", void 0), tm(this, "payload", void 0), this.claim = i, this.reason = n, this.payload = t
		}
	}, "code", "ERR_JWT_CLAIM_VALIDATION_FAILED"), tm(class extends lU {
		constructor(e, t) {
			let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "unspecified",
				n = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "unspecified";
			super(e, {
				cause: {
					claim: i,
					reason: n,
					payload: t
				}
			}), tm(this, "code", "ERR_JWT_EXPIRED"), tm(this, "claim", void 0), tm(this, "reason", void 0), tm(this, "payload", void 0), this.claim = i, this.reason = n, this.payload = t
		}
	}, "code", "ERR_JWT_EXPIRED"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JOSE_ALG_NOT_ALLOWED")
		}
	}, "code", "ERR_JOSE_ALG_NOT_ALLOWED"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JOSE_NOT_SUPPORTED")
		}
	}, "code", "ERR_JOSE_NOT_SUPPORTED"), tm(class extends lU {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "decryption operation failed",
				t = arguments.length > 1 ? arguments[1] : void 0;
			super(e, t), tm(this, "code", "ERR_JWE_DECRYPTION_FAILED")
		}
	}, "code", "ERR_JWE_DECRYPTION_FAILED"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JWE_INVALID")
		}
	}, "code", "ERR_JWE_INVALID"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JWS_INVALID")
		}
	}, "code", "ERR_JWS_INVALID");
	class lF extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JWT_INVALID")
		}
	}
	tm(lF, "code", "ERR_JWT_INVALID"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JWK_INVALID")
		}
	}, "code", "ERR_JWK_INVALID"), tm(class extends lU {
		constructor() {
			super(...arguments), tm(this, "code", "ERR_JWKS_INVALID")
		}
	}, "code", "ERR_JWKS_INVALID"), tm(class extends lU {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "no applicable key found in the JSON Web Key Set",
				t = arguments.length > 1 ? arguments[1] : void 0;
			super(e, t), tm(this, "code", "ERR_JWKS_NO_MATCHING_KEY")
		}
	}, "code", "ERR_JWKS_NO_MATCHING_KEY"), tm(class extends lU {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "multiple matching keys found in the JSON Web Key Set",
				t = arguments.length > 1 ? arguments[1] : void 0;
			super(e, t), tm(this, Symbol.asyncIterator, void 0), tm(this, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS")
		}
	}, "code", "ERR_JWKS_MULTIPLE_MATCHING_KEYS"), tm(class extends lU {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "request timed out",
				t = arguments.length > 1 ? arguments[1] : void 0;
			super(e, t), tm(this, "code", "ERR_JWKS_TIMEOUT")
		}
	}, "code", "ERR_JWKS_TIMEOUT"), tm(class extends lU {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "signature verification failed",
				t = arguments.length > 1 ? arguments[1] : void 0;
			super(e, t), tm(this, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED")
		}
	}, "code", "ERR_JWS_SIGNATURE_VERIFICATION_FAILED");

	function lB(e) {
		let t = function(e) {
			let t, i;
			if ("string" != typeof e) throw new lF("JWTs must use Compact JWS serialization, JWT must be a string");
			let n = e.split("."),
				r = n[1],
				a = n.length;
			if (5 === a) throw new lF("Only JWTs using Compact JWS serialization can be decoded");
			if (3 !== a) throw new lF("Invalid JWT");
			if (!r) throw new lF("JWTs must contain a payload");
			try {
				t = function(e) {
					if (Uint8Array.fromBase64) return Uint8Array.fromBase64("string" == typeof e ? e : lN.decode(e), {
						alphabet: "base64url"
					});
					let t = e;
					t instanceof Uint8Array && (t = lN.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/");
					try {
						var i = t;
						if (Uint8Array.fromBase64) return Uint8Array.fromBase64(i);
						let e = atob(i),
							n = new Uint8Array(e.length);
						for (let t = 0; t < e.length; t++) n[t] = e.charCodeAt(t);
						return n
					} catch (e) {
						throw TypeError("The input to be decoded is not correctly encoded.")
					}
				}(r)
			} catch (e) {
				throw new lF("Failed to base64url decode the payload")
			}
			try {
				i = JSON.parse(lN.decode(t))
			} catch (e) {
				throw new lF("Failed to parse the decoded payload as JSON")
			}
			if (! function(e) {
					if ("object" != typeof e || null === e || "[object Object]" !== Object.prototype.toString.call(e)) return !1;
					if (null === Object.getPrototypeOf(e)) return !0;
					let t = e;
					for (; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
					return Object.getPrototypeOf(e) === t
				}(i)) throw new lF("Invalid JWT Claims Set");
			return i
		}(e);
		return t.roomConfig, Object.assign(Object.assign({}, rU(t, ["roomConfig"])), {
			roomConfig: t.roomConfig ? nR.fromJson(t.roomConfig, {
				ignoreUnknownFields: !0
			}) : void 0
		})
	}

	function lj(e, t) {
		for (let i of new Set([...Object.keys(e), ...Object.keys(t)])) switch (i) {
			case "roomName":
			case "participantName":
			case "participantIdentity":
			case "participantMetadata":
			case "participantAttributes":
			case "agentName":
			case "agentMetadata":
			case "deployment":
				if (e[i] !== t[i]) return !1;
				break;
			default:
				throw Error("Options key ".concat(i, " not being checked for equality!"))
		}
		return !0
	}
	class lq extends lL {
		constructor() {
			super(...arguments), this.cachedFetchOptions = null, this.cachedResponse = null, this.fetchMutex = new e0
		}
		isSameAsCachedFetchOptions(e) {
			return !!this.cachedFetchOptions && lj(e, this.cachedFetchOptions)
		}
		shouldReturnCachedValueFromFetch(e) {
			return !!this.cachedResponse && !! function(e) {
				let t = lB(e.participantToken);
				if (!(null == t ? void 0 : t.nbf) || !(null == t ? void 0 : t.exp)) return !0;
				let i = new Date,
					n = new Date(1e3 * t.nbf),
					r = new Date(1e3 * t.exp - 6e4);
				return n <= i && r > i
			}(this.cachedResponse) && !!this.isSameAsCachedFetchOptions(e)
		}
		getCachedResponseJwtPayload() {
			return this.cachedResponse ? lB(this.cachedResponse.participantToken) : null
		}
		fetch(e, t) {
			return rF(this, void 0, void 0, function*() {
				let i = yield this.fetchMutex.lock();
				try {
					if (t && (this.cachedResponse = null), this.shouldReturnCachedValueFromFetch(e)) return this.cachedResponse.toJson();
					this.cachedFetchOptions = e;
					let i = yield this.update(e);
					return this.cachedResponse = i, i.toJson()
				} finally {
					i()
				}
			})
		}
	}
	class lV extends lx {
		constructor(e) {
			super(), this.literalOrFn = e
		}
		fetch() {
			return rF(this, void 0, void 0, function*() {
				return "function" == typeof this.literalOrFn ? this.literalOrFn() : this.literalOrFn
			})
		}
	}
	class lH extends lq {
		constructor(e) {
			super(), this.customFn = e
		}
		update(e) {
			return rF(this, void 0, void 0, function*() {
				let t, i = this.customFn(e);
				return t = i instanceof Promise ? yield i: i, rP.fromJson(t, {
					ignoreUnknownFields: !0
				})
			})
		}
	}
	class lW extends lq {
		constructor(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			super(), this.url = e, this.endpointOptions = t
		}
		createRequestFromOptions(e) {
			var t, i, n, r;
			let a = new rR;
			for (let s of Object.keys(e)) switch (s) {
				case "roomName":
				case "participantName":
				case "participantIdentity":
				case "participantMetadata":
					a[s] = e[s];
					break;
				case "participantAttributes":
					a.participantAttributes = null != (t = e.participantAttributes) ? t : {};
					break;
				case "agentName":
					a.roomConfig = null != (i = a.roomConfig) ? i : new nR, 0 === a.roomConfig.agents.length && a.roomConfig.agents.push(new nr), a.roomConfig.agents[0].agentName = e.agentName;
					break;
				case "agentMetadata":
					a.roomConfig = null != (n = a.roomConfig) ? n : new nR, 0 === a.roomConfig.agents.length && a.roomConfig.agents.push(new nr), a.roomConfig.agents[0].metadata = e.agentMetadata;
					break;
				case "deployment":
					a.roomConfig = null != (r = a.roomConfig) ? r : new nR, 0 === a.roomConfig.agents.length && a.roomConfig.agents.push(new nr), a.roomConfig.agents[0].deployment = e.deployment;
					break;
				default:
					throw Error("Options key ".concat(s, " not being included in forming request!"))
			}
			return a
		}
		update(e) {
			return rF(this, void 0, void 0, function*() {
				var t;
				let i = this.createRequestFromOptions(e),
					n = yield fetch(this.url, Object.assign(Object.assign({}, this.endpointOptions), {
						method: null != (t = this.endpointOptions.method) ? t : "POST",
						headers: Object.assign({
							"Content-Type": "application/json"
						}, this.endpointOptions.headers),
						body: i.toJsonString({
							useProtoFieldName: !0
						})
					}));
				if (!n.ok) throw Error("Error generating token from endpoint ".concat(this.url, ": received ").concat(n.status, " / ").concat((yield n.text())));
				let r = yield n.json();
				return rP.fromJson(r, {
					ignoreUnknownFields: !0
				})
			})
		}
	}
	class lK extends lW {
		constructor(e, t) {
			let i = t.baseUrl,
				n = rU(t, ["baseUrl"]);
			super("".concat(void 0 === i ? "https://cloud-api.livekit.io" : i, "/api/v2/sandbox/connection-details"), Object.assign(Object.assign({}, n), {
				headers: {
					"X-Sandbox-ID": e
				}
			}))
		}
	}
	let lz = new Map([
			["obs virtual camera", {
				facingMode: "environment",
				confidence: "medium"
			}]
		]),
		lJ = new Map([
			["iphone", {
				facingMode: "environment",
				confidence: "medium"
			}],
			["ipad", {
				facingMode: "environment",
				confidence: "medium"
			}]
		]);

	function lG(e) {
		var t;
		let i = e.trim().toLowerCase();
		if ("" !== i) return lz.has(i) ? lz.get(i) : null == (t = Array.from(lJ.entries()).find(e => {
			let t = tg(e, 1)[0];
			return i.includes(t)
		})) ? void 0 : t[1]
	}
	let lQ = Symbol.for("lk.serializer");

	function lY(e) {
		return Object.assign(Object.assign({}, e), {
			symbol: lQ
		})
	}
	e.s(["AudioPresets", 0, ey, "BackupCodecPolicy", 0, ek, "BaseKeyProvider", 0, oh, "CLIENT_PROTOCOL_DATA_STREAM_RPC", 0, 1, "CLIENT_PROTOCOL_DEFAULT", 0, 0, "CheckStatus", 0, eY, "Checker", 0, lw, "ConnectionCheck", 0, lA, "ConnectionError", 0, aK, "ConnectionErrorReason", 0, eu, "ConnectionQuality", 0, eG, "ConnectionState", 0, eQ, "CriticalTimers", 0, a2, "CryptorError", 0, class extends aH {
		constructor(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : eE.InternalError,
				i = arguments.length > 2 ? arguments[2] : void 0;
			super(40, e), this.reason = t, this.participantIdentity = i
		}
	}, "CryptorErrorReason", 0, eE, "CryptorEvent", 0, ew, "DataPacket_Kind", 0, ix, "DataStreamError", 0, a0, "DataStreamErrorReason", 0, eh, "DataTrackPacket", 0, cQ, "DefaultReconnectPolicy", 0, rN, "DeviceUnsupportedError", 0, az, "DisconnectReason", 0, ip, "EncryptionEvent", 0, eC, "Encryption_Type", 0, iR, "EngineEvent", 0, ef, "ExternalE2EEKeyProvider", 0, class extends oh {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
			super(Object.assign(Object.assign({}, e), {
				sharedKey: !0,
				ratchetWindowSize: 0,
				failureTolerance: -1
			}))
		}
		setKey(e) {
			return rF(this, void 0, void 0, function*() {
				let t = "string" == typeof e ? yield oc(e): yield ol(e);
				this.onSetEncryptionKey(t)
			})
		}
	}, "FrameMetadataManager", 0, ow, "KeyHandlerEvent", 0, eS, "KeyProviderEvent", 0, eT, "LivekitError", 0, aH, "LivekitReasonedError", 0, aW, "LocalAudioTrack", 0, ci, "LocalDataTrack", 0, c7, "LocalParticipant", 0, lv, "LocalTrack", 0, ct, "LocalTrackPublication", 0, lh, "LocalTrackRecorder", 0, ce, "LocalVideoTrack", 0, cg, "LogLevel", 0, es, "LoggerNames", 0, eo, "MediaDeviceFailure", 0, ep, "Mutex", 0, e0, "NegotiationError", 0, aY, "PacketTrailerManager", 0, ow, "Participant", 0, lf, "ParticipantEvent", 0, eg, "ParticipantKind", 0, iw, "PublishDataError", 0, aX, "PublishTrackError", 0, aZ, "RemoteAudioTrack", 0, ld, "RemoteDataTrack", 0, cJ, "RemoteParticipant", 0, lT, "RemoteTrack", 0, ov, "RemoteTrackPublication", 0, lb, "RemoteVideoTrack", 0, ok, "Room", 0, lS, "RoomEvent", 0, em, "RpcError", 0, ln, "ScreenSharePresets", 0, se, "SignalReconnectError", 0, a1, "SignalRequestError", 0, a$, "SimulatedError", 0, class extends aH {
		constructor() {
			let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "Simulated failure";
			super(-1, e), this.name = "simulated"
		}
	}, "SubscriptionError", 0, ig, "TokenSource", 0, {
		literal: e => new lV(e),
		custom: e => new lH(e),
		endpoint(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			return new lW(e, t)
		},
		sandboxTokenServer(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			return new lK(e, t)
		}
	}, "TokenSourceConfigurable", 0, lL, "TokenSourceFixed", 0, lx, "Track", 0, sp, "TrackEvent", 0, ev, "TrackInvalidError", 0, aJ, "TrackPublication", 0, lu, "TrackType", 0, ic, "UnexpectedConnectionState", 0, aQ, "UnsupportedServer", 0, aG, "VideoPreset", 0, a3, "VideoPresets", 0, a5, "VideoPresets43", 0, a7, "VideoQuality", 0, eb, "areTokenSourceFetchOptionsEqual", 0, lj, "asEncryptablePacket", 0, ou, "attachToElement", 0, sm, "attributes", 0, lC, "audioCodecs", 0, a4, "clientProtocol", 0, 1, "compareVersions", 0, sF, "createAudioAnalyser", 0, function(e, t) {
		let i = Object.assign({
				cloneTrack: !1,
				fftSize: 2048,
				smoothingTimeConstant: .8,
				minDecibels: -100,
				maxDecibels: -80
			}, t),
			n = sa();
		if (!n) throw Error("Audio Context not supported on this browser");
		let r = i.cloneTrack ? e.mediaStreamTrack.clone() : e.mediaStreamTrack,
			a = n.createMediaStreamSource(new MediaStream([r])),
			s = n.createAnalyser();
		s.minDecibels = i.minDecibels, s.maxDecibels = i.maxDecibels, s.fftSize = i.fftSize, s.smoothingTimeConstant = i.smoothingTimeConstant, a.connect(s);
		let o = new Uint8Array(s.frequencyBinCount);
		return {
			calculateVolume: () => {
				s.getByteFrequencyData(o);
				let e = 0;
				for (let t of o) e += Math.pow(t / 255, 2);
				return Math.sqrt(e / o.length)
			},
			analyser: s,
			cleanup: () => rF(this, void 0, void 0, function*() {
				yield n.close(), i.cloneTrack && r.stop()
			})
		}
	}, "createE2EEKey", 0, function() {
		return window.crypto.getRandomValues(new Uint8Array(32))
	}, "createKeyMaterialFromBuffer", 0, ol, "createKeyMaterialFromString", 0, oc, "createLocalAudioTrack", 0, lg, "createLocalScreenTracks", 0, function(e) {
		return rF(this, void 0, void 0, function*() {
			if (void 0 === e && (e = {}), void 0 !== e.resolution || sD() || (e.resolution = se.h1080fps30.resolution), void 0 === navigator.mediaDevices.getDisplayMedia) throw new az("getDisplayMedia not supported");
			let t = so(e),
				i = yield navigator.mediaDevices.getDisplayMedia(t), n = i.getVideoTracks();
			if (0 === n.length) throw new aJ("no video track found");
			let r = new cg(n[0], void 0, !1);
			r.source = sp.Source.ScreenShare;
			let a = [r];
			if (i.getAudioTracks().length > 0) {
				let e = new ci(i.getAudioTracks()[0], void 0, !1);
				e.source = sp.Source.ScreenShareAudio, a.push(e)
			}
			return a
		})
	}, "createLocalTracks", 0, lp, "createLocalVideoTrack", 0, lm, "decodeTokenPayload", 0, lB, "deriveKeys", 0, function(e, t) {
		return rF(this, void 0, void 0, function*() {
			let i = od(e.algorithm.name, t.ratchetSalt),
				n = yield crypto.subtle.deriveKey(i, e, {
					name: oi,
					length: t.keySize
				}, !1, ["encrypt", "decrypt"]);
			return {
				material: e,
				encryptionKey: n
			}
		})
	}, "detachTrack", 0, sg, "facingModeFromDeviceLabel", 0, lG, "facingModeFromLocalTrack", 0, function(e) {
		var t, i;
		let n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
			r = s0(e) ? e.mediaStreamTrack : e,
			a = r.getSettings(),
			s = {
				facingMode: null != (t = n.defaultFacingMode) ? t : "user",
				confidence: "low"
			};
		if ("facingMode" in a) {
			let e = a.facingMode;
			r_.trace("rawFacingMode", {
				rawFacingMode: e
			}), e && "string" == typeof e && (void 0 === (i = e) || ["user", "environment", "left", "right"].includes(i)) && (s = {
				facingMode: e,
				confidence: "high"
			})
		}
		if (["low", "medium"].includes(s.confidence)) {
			r_.trace("Try to get facing mode from device label: (".concat(r.label, ")"));
			let e = lG(r.label);
			void 0 !== e && (s = e)
		}
		return s
	}, "getBrowser", 0, aF, "getEmptyAudioStreamTrack", 0, sz, "getEmptyVideoStreamTrack", 0, function() {
		return i || (i = sK()), i.clone()
	}, "getLogger", 0, rA, "importKey", 0, function(e) {
		return rF(this, arguments, void 0, function(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
					name: oi
				},
				i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "encrypt";
			return function*() {
				return crypto.subtle.importKey("raw", e, t, !1, "derive" === i ? ["deriveBits", "deriveKey"] : ["encrypt", "decrypt"])
			}()
		})
	}, "isAudioCodec", 0, function(e) {
		return a4.includes(e)
	}, "isAudioTrack", 0, s1, "isBackupCodec", 0, a8, "isBackupVideoCodec", 0, a8, "isBrowserSupported", 0, sw, "isE2EESupported", 0, oa, "isInsertableStreamSupported", 0, oo, "isLocalParticipant", 0, s8, "isLocalTrack", 0, s0, "isRemoteParticipant", 0, function(e) {
		return !e.isLocal
	}, "isRemoteTrack", 0, s9, "isScriptTransformSupported", 0, os, "isSerializer", 0, function(e) {
		return "object" == typeof e && null !== e && "symbol" in e && e.symbol === lQ
	}, "isVideoCodec", 0, sG, "isVideoFrame", 0, function(e) {
		return "type" in e
	}, "isVideoTrack", 0, s2, "needsRbspUnescaping", 0, function(e) {
		for (var t = 0; t < e.length - 3; t++)
			if (0 == e[t] && 0 == e[t + 1] && 3 == e[t + 2]) return !0;
		return !1
	}, "parseRbsp", 0, function(e) {
		let t = [];
		for (var i = e.length, n = 0; n < e.length;) !(i - n >= 3) || e[n] || e[n + 1] || 3 != e[n + 2] ? t.push(e[n++]) : (t.push(e[n++]), t.push(e[n++]), n++);
		return new Uint8Array(t)
	}, "protocolVersion", 0, 17, "ratchet", 0, function(e, t) {
		return rF(this, void 0, void 0, function*() {
			let i = od(e.algorithm.name, t);
			return crypto.subtle.deriveBits(i, e, 256)
		})
	}, "serializers", 0, {
		json: function() {
			return lY({
				parse: e => JSON.parse(e),
				serialize: e => JSON.stringify(e)
			})
		},
		raw: function() {
			return lY({
				parse: e => e,
				serialize: e => e
			})
		},
		custom: function(e) {
			return lY(e)
		}
	}, "setLogExtension", 0, function(e, t) {
		(t ? [t] : rO).forEach(t => {
			let i = t.methodFactory;
			t.methodFactory = (t, n, r) => {
				let a = i(t, n, r),
					s = es[t],
					o = s >= n && s < es.silent;
				return (t, i) => {
					i ? a(t, i) : a(t), o && e(s, t, i)
				}
			}, t.setLevel(t.getLevel())
		})
	}, "setLogLevel", 0, function(e, t) {
		if (t) rM.getLogger(t).setLevel(e);
		else
			for (let t of rO) t.setLevel(e)
	}, "supportsAV1", 0, sb, "supportsAdaptiveStream", 0, function() {
		return !0
	}, "supportsAudioOutputSelection", 0, function() {
		return sC()
	}, "supportsDynacast", 0, function() {
		return sk()
	}, "supportsVP9", 0, sT, "version", 0, aV, "videoCodecs", 0, a6, "writeRbsp", 0, function(e) {
		let t = [];
		for (var i = 0, n = 0; n < e.length; ++n) {
			var r = e[n];
			r <= 3 && i >= 2 && (t.push(3), i = 0), t.push(r), 0 == r ? ++i : i = 0
		}
		return new Uint8Array(t)
	}])
}]);