(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 370193, e => {
	"use strict";
	let t;
	var n, r = e.i(914374);
	n = function() {
		let e, t, n, i;

		function a(e, t) {
			if (!e) throw Error(t)
		}

		function o(e) {
			if ("number" != typeof e) throw Error("invalid int 32: " + typeof e);
			if (!Number.isInteger(e) || e > 0x7fffffff || e < -0x80000000) throw Error("invalid int 32: " + e)
		}

		function s(e) {
			if ("number" != typeof e) throw Error("invalid uint 32: " + typeof e);
			if (!Number.isInteger(e) || e > 0xffffffff || e < 0) throw Error("invalid uint 32: " + e)
		}

		function c(e) {
			if ("number" != typeof e) throw Error("invalid float 32: " + typeof e);
			if (Number.isFinite(e) && (e > 34028234663852886e22 || e < -34028234663852886e22)) throw Error("invalid float 32: " + e)
		}
		let l = Symbol("@bufbuild/protobuf/enum-type");

		function u(e, t, n, r) {
			e[l] = d(t, n.map(t => ({
				no: t.no,
				name: t.name,
				localName: e[t.no]
			})))
		}

		function d(e, t, n) {
			let r = Object.create(null),
				i = Object.create(null),
				a = [];
			for (let e of t) {
				let t = f(e);
				a.push(t), r[e.name] = t, i[e.no] = t
			}
			return {
				typeName: e,
				values: a,
				findName: e => r[e],
				findNumber: e => i[e]
			}
		}

		function f(e) {
			return "localName" in e ? e : Object.assign(Object.assign({}, e), {
				localName: e.name
			})
		}
		class h {
			equals(e) {
				return this.getType().runtime.util.equals(this.getType(), this, e)
			}
			clone() {
				return this.getType().runtime.util.clone(this)
			}
			fromBinary(e, t) {
				let n = this.getType().runtime.bin,
					r = n.makeReadOptions(t);
				return n.readMessage(this, r.readerFactory(e), e.byteLength, r), this
			}
			fromJson(e, t) {
				let n = this.getType(),
					r = n.runtime.json,
					i = r.makeReadOptions(t);
				return r.readMessage(n, e, i, this), this
			}
			fromJsonString(e, t) {
				let n;
				try {
					n = JSON.parse(e)
				} catch (e) {
					throw Error("cannot decode ".concat(this.getType().typeName, " from JSON: ").concat(e instanceof Error ? e.message : String(e)))
				}
				return this.fromJson(n, t)
			}
			toBinary(e) {
				let t = this.getType().runtime.bin,
					n = t.makeWriteOptions(e),
					r = n.writerFactory();
				return t.writeMessage(this, r, n), r.finish()
			}
			toJson(e) {
				let t = this.getType().runtime.json,
					n = t.makeWriteOptions(e);
				return t.writeMessage(this, n)
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

		function p() {
			let e = 0,
				t = 0;
			for (let n = 0; n < 28; n += 7) {
				let r = this.buf[this.pos++];
				if (e |= (127 & r) << n, !(128 & r)) return this.assertBounds(), [e, t]
			}
			let n = this.buf[this.pos++];
			if (e |= (15 & n) << 28, t = (112 & n) >> 4, !(128 & n)) return this.assertBounds(), [e, t];
			for (let n = 3; n <= 31; n += 7) {
				let r = this.buf[this.pos++];
				if (t |= (127 & r) << n, !(128 & r)) return this.assertBounds(), [e, t]
			}
			throw Error("invalid varint")
		}

		function m(e, t, n) {
			for (let r = 0; r < 28; r += 7) {
				let i = e >>> r,
					a = i >>> 7 != 0 || 0 != t,
					o = 255 & (a ? 128 | i : i);
				if (n.push(o), !a) return
			}
			let r = e >>> 28 & 15 | (7 & t) << 4,
				i = !!(t >> 3);
			if (n.push(255 & (i ? 128 | r : r)), i) {
				for (let e = 3; e < 31; e += 7) {
					let r = t >>> e,
						i = r >>> 7 != 0,
						a = 255 & (i ? 128 | r : r);
					if (n.push(a), !i) return
				}
				n.push(t >>> 31 & 1)
			}
		}

		function g(e) {
			let t = "-" === e[0];
			t && (e = e.slice(1));
			let n = 0,
				r = 0;

			function i(t, i) {
				let a = Number(e.slice(t, i));
				r *= 1e6, (n = 1e6 * n + a) >= 0x100000000 && (r += n / 0x100000000 | 0, n %= 0x100000000)
			}
			return i(-24, -18), i(-18, -12), i(-12, -6), i(-6), t ? v(n, r) : y(n, r)
		}

		function b(e, t) {
			var n = {
				lo: e >>> 0,
				hi: t >>> 0
			};
			if (e = n.lo, (t = n.hi) <= 2097151) return String(0x100000000 * t + e);
			let r = 0xffffff & (e >>> 24 | t << 8),
				i = t >> 16 & 65535,
				a = (0xffffff & e) + 6777216 * r + 6710656 * i,
				o = r + 8147497 * i,
				s = 2 * i;
			return a >= 1e7 && (o += Math.floor(a / 1e7), a %= 1e7), o >= 1e7 && (s += Math.floor(o / 1e7), o %= 1e7), s.toString() + k(o) + k(a)
		}

		function y(e, t) {
			return {
				lo: 0 | e,
				hi: 0 | t
			}
		}

		function v(e, t) {
			return t = ~t, e ? e = 1 + ~e : t += 1, y(e, t)
		}
		let k = e => {
			let t = String(e);
			return "0000000".slice(t.length) + t
		};

		function T(e, t) {
			if (e >= 0) {
				for (; e > 127;) t.push(127 & e | 128), e >>>= 7;
				t.push(e)
			} else {
				for (let n = 0; n < 9; n++) t.push(127 & e | 128), e >>= 7;
				t.push(1)
			}
		}

		function w() {
			let e = this.buf[this.pos++],
				t = 127 & e;
			if (!(128 & e) || (t |= (127 & (e = this.buf[this.pos++])) << 7, !(128 & e)) || (t |= (127 & (e = this.buf[this.pos++])) << 14, !(128 & e)) || (t |= (127 & (e = this.buf[this.pos++])) << 21, !(128 & e))) return this.assertBounds(), t;
			t |= (15 & (e = this.buf[this.pos++])) << 28;
			for (let t = 5; 128 & e && t < 10; t++) e = this.buf[this.pos++];
			if (128 & e) throw Error("invalid varint");
			return this.assertBounds(), t >>> 0
		}
		let S = function() {
			let e = new DataView(new ArrayBuffer(8));
			if ("function" == typeof BigInt && "function" == typeof e.getBigInt64 && "function" == typeof e.getBigUint64 && "function" == typeof e.setBigInt64 && "function" == typeof e.setBigUint64 && ("object" != typeof r.default || "object" != typeof r.default.env || "1" !== r.default.env.BUF_BIGINT_DISABLE)) {
				let t = BigInt("-9223372036854775808"),
					n = BigInt("9223372036854775807"),
					r = BigInt("0"),
					i = BigInt("18446744073709551615");
				return {
					zero: BigInt(0),
					supported: !0,
					parse(e) {
						let r = "bigint" == typeof e ? e : BigInt(e);
						if (r > n || r < t) throw Error("int64 invalid: ".concat(e));
						return r
					},
					uParse(e) {
						let t = "bigint" == typeof e ? e : BigInt(e);
						if (t > i || t < r) throw Error("uint64 invalid: ".concat(e));
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
					dec: (t, n) => (e.setInt32(0, t, !0), e.setInt32(4, n, !0), e.getBigInt64(0, !0)),
					uDec: (t, n) => (e.setInt32(0, t, !0), e.setInt32(4, n, !0), e.getBigUint64(0, !0))
				}
			}
			let t = e => a(/^-?[0-9]+$/.test(e), "int64 invalid: ".concat(e)),
				n = e => a(/^[0-9]+$/.test(e), "uint64 invalid: ".concat(e));
			return {
				zero: "0",
				supported: !1,
				parse: e => ("string" != typeof e && (e = e.toString()), t(e), e),
				uParse: e => ("string" != typeof e && (e = e.toString()), n(e), e),
				enc: e => ("string" != typeof e && (e = e.toString()), t(e), g(e)),
				uEnc: e => ("string" != typeof e && (e = e.toString()), n(e), g(e)),
				dec: (e, t) => {
					let n, r, i;
					return (r = 0x80000000 & (n = y(e, t)).hi) && (n = v(n.lo, n.hi)), i = b(n.lo, n.hi), r ? "-" + i : i
				},
				uDec: (e, t) => b(e, t)
			}
		}();

		function E(e, t, n) {
			if (t === n) return !0;
			if (e == e3.BYTES) {
				if (!(t instanceof Uint8Array && n instanceof Uint8Array) || t.length !== n.length) return !1;
				for (let e = 0; e < t.length; e++)
					if (t[e] !== n[e]) return !1;
				return !0
			}
			switch (e) {
				case e3.UINT64:
				case e3.FIXED64:
				case e3.INT64:
				case e3.SFIXED64:
				case e3.SINT64:
					return t == n
			}
			return !1
		}

		function N(e, t) {
			switch (e) {
				case e3.BOOL:
					return !1;
				case e3.UINT64:
				case e3.FIXED64:
				case e3.INT64:
				case e3.SFIXED64:
				case e3.SINT64:
					return 0 == t ? S.zero : "0";
				case e3.DOUBLE:
				case e3.FLOAT:
					return 0;
				case e3.BYTES:
					return new Uint8Array(0);
				case e3.STRING:
					return "";
				default:
					return 0
			}
		}

		function I(e, t) {
			switch (e) {
				case e3.BOOL:
					return !1 === t;
				case e3.STRING:
					return "" === t;
				case e3.BYTES:
					return t instanceof Uint8Array && !t.byteLength;
				default:
					return 0 == t
			}
		}

		function O(e, t) {
			(null == t || t > e.length) && (t = e.length);
			for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
			return r
		}

		function C(e, t) {
			return function(e) {
				if (Array.isArray(e)) return e
			}(e) || function(e, t) {
				var n = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != n) {
					var r, i, a, o, s = [],
						c = !0,
						l = !1;
					try {
						if (a = (n = n.call(e)).next, 0 === t) {
							if (Object(n) !== n) return;
							c = !1
						} else
							for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
					} catch (e) {
						l = !0, i = e
					} finally {
						try {
							if (!c && null != n.return && (o = n.return(), Object(o) !== o)) return
						} finally {
							if (l) throw i
						}
					}
					return s
				}
			}(e, t) || function(e, t) {
				if (e) {
					if ("string" == typeof e) return O(e, t);
					var n = ({}).toString.call(e).slice(8, -1);
					return "Object" === n && e.constructor && (n = e.constructor.name), "Map" === n || "Set" === n ? Array.from(e) : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? O(e, t) : void 0
				}
			}(e, t) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}()
		}(eG = e3 || (e3 = {}))[eG.DOUBLE = 1] = "DOUBLE", eG[eG.FLOAT = 2] = "FLOAT", eG[eG.INT64 = 3] = "INT64", eG[eG.UINT64 = 4] = "UINT64", eG[eG.INT32 = 5] = "INT32", eG[eG.FIXED64 = 6] = "FIXED64", eG[eG.FIXED32 = 7] = "FIXED32", eG[eG.BOOL = 8] = "BOOL", eG[eG.STRING = 9] = "STRING", eG[eG.BYTES = 12] = "BYTES", eG[eG.UINT32 = 13] = "UINT32", eG[eG.SFIXED32 = 15] = "SFIXED32", eG[eG.SFIXED64 = 16] = "SFIXED64", eG[eG.SINT32 = 17] = "SINT32", eG[eG.SINT64 = 18] = "SINT64", (eX = e4 || (e4 = {}))[eX.BIGINT = 0] = "BIGINT", eX[eX.STRING = 1] = "STRING", (eq = e6 || (e6 = {}))[eq.Varint = 0] = "Varint", eq[eq.Bit64 = 1] = "Bit64", eq[eq.LengthDelimited = 2] = "LengthDelimited", eq[eq.StartGroup = 3] = "StartGroup", eq[eq.EndGroup = 4] = "EndGroup", eq[eq.Bit32 = 5] = "Bit32";
		class A {
			constructor(e) {
				this.stack = [], this.textEncoder = null != e ? e : new TextEncoder, this.chunks = [], this.buf = []
			}
			finish() {
				this.chunks.push(new Uint8Array(this.buf));
				let e = 0;
				for (let t = 0; t < this.chunks.length; t++) e += this.chunks[t].length;
				let t = new Uint8Array(e),
					n = 0;
				for (let e = 0; e < this.chunks.length; e++) t.set(this.chunks[e], n), n += this.chunks[e].length;
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
				for (s(e); e > 127;) this.buf.push(127 & e | 128), e >>>= 7;
				return this.buf.push(e), this
			}
			int32(e) {
				return o(e), T(e, this.buf), this
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
				c(e);
				let t = new Uint8Array(4);
				return new DataView(t.buffer).setFloat32(0, e, !0), this.raw(t)
			}
			double(e) {
				let t = new Uint8Array(8);
				return new DataView(t.buffer).setFloat64(0, e, !0), this.raw(t)
			}
			fixed32(e) {
				s(e);
				let t = new Uint8Array(4);
				return new DataView(t.buffer).setUint32(0, e, !0), this.raw(t)
			}
			sfixed32(e) {
				o(e);
				let t = new Uint8Array(4);
				return new DataView(t.buffer).setInt32(0, e, !0), this.raw(t)
			}
			sint32(e) {
				return o(e), T(e = (e << 1 ^ e >> 31) >>> 0, this.buf), this
			}
			sfixed64(e) {
				let t = new Uint8Array(8),
					n = new DataView(t.buffer),
					r = S.enc(e);
				return n.setInt32(0, r.lo, !0), n.setInt32(4, r.hi, !0), this.raw(t)
			}
			fixed64(e) {
				let t = new Uint8Array(8),
					n = new DataView(t.buffer),
					r = S.uEnc(e);
				return n.setInt32(0, r.lo, !0), n.setInt32(4, r.hi, !0), this.raw(t)
			}
			int64(e) {
				let t = S.enc(e);
				return m(t.lo, t.hi, this.buf), this
			}
			sint64(e) {
				let t = S.enc(e),
					n = t.hi >> 31;
				return m(t.lo << 1 ^ n, (t.hi << 1 | t.lo >>> 31) ^ n, this.buf), this
			}
			uint64(e) {
				let t = S.uEnc(e);
				return m(t.lo, t.hi, this.buf), this
			}
		}
		class U {
			constructor(e, t) {
				this.varint64 = p, this.uint32 = w, this.buf = e, this.len = e.length, this.pos = 0, this.view = new DataView(e.buffer, e.byteOffset, e.byteLength), this.textDecoder = null != t ? t : new TextDecoder
			}
			tag() {
				let e = this.uint32(),
					t = e >>> 3,
					n = 7 & e;
				if (t <= 0 || n < 0 || n > 5) throw Error("illegal tag: field no " + t + " wire type " + n);
				return [t, n]
			}
			skip(e, t) {
				let n = this.pos;
				switch (e) {
					case e6.Varint:
						for (; 128 & this.buf[this.pos++];);
						break;
					case e6.Bit64:
						this.pos += 4;
					case e6.Bit32:
						this.pos += 4;
						break;
					case e6.LengthDelimited:
						let r = this.uint32();
						this.pos += r;
						break;
					case e6.StartGroup:
						for (;;) {
							let e = C(this.tag(), 2),
								n = e[0],
								r = e[1];
							if (r === e6.EndGroup) {
								if (void 0 !== t && n !== t) throw Error("invalid end group tag");
								break
							}
							this.skip(r, n)
						}
						break;
					default:
						throw Error("cant skip wire type " + e)
				}
				return this.assertBounds(), this.buf.subarray(n, this.pos)
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
				return S.dec(...this.varint64())
			}
			uint64() {
				return S.uDec(...this.varint64())
			}
			sint64() {
				let e = C(this.varint64(), 2),
					t = e[0],
					n = e[1],
					r = -(1 & t);
				return t = (t >>> 1 | (1 & n) << 31) ^ r, n = n >>> 1 ^ r, S.dec(t, n)
			}
			bool() {
				let e = C(this.varint64(), 2),
					t = e[0],
					n = e[1];
				return 0 !== t || 0 !== n
			}
			fixed32() {
				return this.view.getUint32((this.pos += 4) - 4, !0)
			}
			sfixed32() {
				return this.view.getInt32((this.pos += 4) - 4, !0)
			}
			fixed64() {
				return S.uDec(this.sfixed32(), this.sfixed32())
			}
			sfixed64() {
				return S.dec(this.sfixed32(), this.sfixed32())
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

		function L(e) {
			let t = e.field.localName,
				n = Object.create(null);
			return n[t] = function(e) {
				let t = e.field;
				if (t.repeated) return [];
				if (void 0 !== t.default) return t.default;
				switch (t.kind) {
					case "enum":
						return t.T.values[0].no;
					case "scalar":
						return N(t.T, t.L);
					case "message":
						let n = t.T,
							r = new n;
						return n.fieldWrapper ? n.fieldWrapper.unwrapField(r) : r;
					case "map":
						throw "map fields are not allowed to be extensions"
				}
			}(e), [n, () => n[t]]
		}
		let F = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
			D = [];
		for (let e = 0; e < F.length; e++) D[F[e].charCodeAt(0)] = e;
		D[45] = F.indexOf("+"), D[95] = F.indexOf("/");
		let R = {
			dec(e) {
				let t = 3 * e.length / 4;
				"=" == e[e.length - 2] ? t -= 2 : "=" == e[e.length - 1] && (t -= 1);
				let n, r = new Uint8Array(t),
					i = 0,
					a = 0,
					o = 0;
				for (let t = 0; t < e.length; t++) {
					if (void 0 === (n = D[e.charCodeAt(t)])) switch (e[t]) {
						case "=":
							a = 0;
						case "\n":
						case "\r":
						case "	":
						case " ":
							continue;
						default:
							throw Error("invalid base64 string.")
					}
					switch (a) {
						case 0:
							o = n, a = 1;
							break;
						case 1:
							r[i++] = o << 2 | (48 & n) >> 4, o = n, a = 2;
							break;
						case 2:
							r[i++] = (15 & o) << 4 | (60 & n) >> 2, o = n, a = 3;
							break;
						case 3:
							r[i++] = (3 & o) << 6 | n, a = 0
					}
				}
				if (1 == a) throw Error("invalid base64 string.");
				return r.subarray(0, i)
			},
			enc(e) {
				let t, n = "",
					r = 0,
					i = 0;
				for (let a = 0; a < e.length; a++) switch (t = e[a], r) {
					case 0:
						n += F[t >> 2], i = (3 & t) << 4, r = 1;
						break;
					case 1:
						n += F[i | t >> 4], i = (15 & t) << 2, r = 2;
						break;
					case 2:
						n += F[i | t >> 6], n += F[63 & t], r = 0
				}
				return r && (n += F[i], n += "=", 1 == r && (n += "=")), n
			}
		};

		function B(e, t) {
			let n = e.getType();
			return t.extendee.typeName === n.typeName && !!n.runtime.bin.listUnknownFields(e).find(e => e.no == t.field.no)
		}

		function x(e, t) {
			a(e.extendee.typeName == t.getType().typeName, "extension ".concat(e.typeName, " can only be applied to message ").concat(e.extendee.typeName))
		}

		function P(e, t) {
			let n = e.localName;
			if (e.repeated) return t[n].length > 0;
			if (e.oneof) return t[e.oneof.localName].case === n;
			switch (e.kind) {
				case "enum":
				case "scalar":
					return e.opt || e.req ? void 0 !== t[n] : "enum" == e.kind ? t[n] !== e.T.values[0].no : !I(e.T, t[n]);
				case "message":
					return void 0 !== t[n];
				case "map":
					return Object.keys(t[n]).length > 0
			}
		}

		function j(e, t) {
			let n = e.localName,
				r = !e.opt && !e.req;
			if (e.repeated) t[n] = [];
			else if (e.oneof) t[e.oneof.localName] = {
				case: void 0
			};
			else switch (e.kind) {
				case "map":
					t[n] = {};
					break;
				case "enum":
					t[n] = r ? e.T.values[0].no : void 0;
					break;
				case "scalar":
					t[n] = r ? N(e.T, e.L) : void 0;
					break;
				case "message":
					t[n] = void 0
			}
		}

		function M(e, t) {
			if (null === e || "object" != typeof e || !Object.getOwnPropertyNames(h.prototype).every(t => t in e && "function" == typeof e[t])) return !1;
			let n = e.getType();
			return null !== n && "function" == typeof n && "typeName" in n && "string" == typeof n.typeName && (void 0 === t || n.typeName == t.typeName)
		}

		function V(e, t) {
			return M(t) || !e.fieldWrapper ? t : e.fieldWrapper.wrapField(t)
		}
		e3.DOUBLE, e3.FLOAT, e3.INT64, e3.UINT64, e3.INT32, e3.UINT32, e3.BOOL, e3.STRING, e3.BYTES;
		let _ = {
				ignoreUnknownFields: !1
			},
			J = {
				emitDefaultValues: !1,
				enumAsInteger: !1,
				useProtoFieldName: !1,
				prettySpaces: 0
			},
			G = Symbol(),
			X = Symbol();

		function q(e) {
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

		function W(e, t, n, r, i) {
			let o = n.localName;
			if (n.repeated) {
				if (a("map" != n.kind), null === t) return;
				if (!Array.isArray(t)) throw Error("cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(t)));
				let s = e[o];
				for (let e of t) {
					if (null === e) throw Error("cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(e)));
					switch (n.kind) {
						case "message":
							s.push(n.T.fromJson(e, r));
							break;
						case "enum":
							let t = K(n.T, e, r.ignoreUnknownFields, !0);
							t !== X && s.push(t);
							break;
						case "scalar":
							try {
								s.push(H(n.T, e, n.L, !0))
							} catch (r) {
								let t = "cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(e));
								throw r instanceof Error && r.message.length > 0 && (t += ": ".concat(r.message)), Error(t)
							}
					}
				}
			} else if ("map" == n.kind) {
				if (null === t) return;
				if ("object" != typeof t || Array.isArray(t)) throw Error("cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(t)));
				let a = e[o];
				for (let e of Object.entries(t)) {
					let o;
					var s = C(e, 2);
					let c = s[0],
						l = s[1];
					if (null === l) throw Error("cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: map value null"));
					try {
						o = function(e, t) {
							if (e === e3.BOOL) switch (t) {
								case "true":
									t = !0;
									break;
								case "false":
									t = !1
							}
							return H(e, t, e4.BIGINT, !0).toString()
						}(n.K, c)
					} catch (r) {
						let e = "cannot decode map key for field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(t));
						throw r instanceof Error && r.message.length > 0 && (e += ": ".concat(r.message)), Error(e)
					}
					switch (n.V.kind) {
						case "message":
							a[o] = n.V.T.fromJson(l, r);
							break;
						case "enum":
							let u = K(n.V.T, l, r.ignoreUnknownFields, !0);
							u !== X && (a[o] = u);
							break;
						case "scalar":
							try {
								a[o] = H(n.V.T, l, e4.BIGINT, !0)
							} catch (r) {
								let e = "cannot decode map value for field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(t));
								throw r instanceof Error && r.message.length > 0 && (e += ": ".concat(r.message)), Error(e)
							}
					}
				}
			} else switch (n.oneof && (e = e[n.oneof.localName] = {
					case: o
				}, o = "value"), n.kind) {
				case "message":
					let c = n.T;
					if (null === t && "google.protobuf.Value" != c.typeName) return;
					let l = e[o];
					M(l) ? l.fromJson(t, r) : (e[o] = l = c.fromJson(t, r), c.fieldWrapper && !n.oneof && (e[o] = c.fieldWrapper.unwrapField(l)));
					break;
				case "enum":
					let u = K(n.T, t, r.ignoreUnknownFields, !1);
					switch (u) {
						case G:
							j(n, e);
							break;
						case X:
							break;
						default:
							e[o] = u
					}
					break;
				case "scalar":
					try {
						let r = H(n.T, t, n.L, !1);
						r === G ? j(n, e) : e[o] = r
					} catch (r) {
						let e = "cannot decode field ".concat(i.typeName, ".").concat(n.name, " from JSON: ").concat(q(t));
						throw r instanceof Error && r.message.length > 0 && (e += ": ".concat(r.message)), Error(e)
					}
			}
		}

		function H(e, t, n, r) {
			if (null === t) return r ? N(e, n) : G;
			switch (e) {
				case e3.DOUBLE:
				case e3.FLOAT:
					if ("NaN" === t) return 0 / 0;
					if ("Infinity" === t) return 1 / 0;
					if ("-Infinity" === t) return -1 / 0;
					if ("" === t || "string" == typeof t && t.trim().length !== t.length || "string" != typeof t && "number" != typeof t) break;
					let i = Number(t);
					if (Number.isNaN(i) || !Number.isFinite(i)) break;
					return e == e3.FLOAT && c(i), i;
				case e3.INT32:
				case e3.FIXED32:
				case e3.SFIXED32:
				case e3.SINT32:
				case e3.UINT32:
					let a;
					if ("number" == typeof t ? a = t : "string" == typeof t && t.length > 0 && t.trim().length === t.length && (a = Number(t)), void 0 === a) break;
					return e == e3.UINT32 || e == e3.FIXED32 ? s(a) : o(a), a;
				case e3.INT64:
				case e3.SFIXED64:
				case e3.SINT64:
					if ("number" != typeof t && "string" != typeof t) break;
					let l = S.parse(t);
					return n ? l.toString() : l;
				case e3.FIXED64:
				case e3.UINT64:
					if ("number" != typeof t && "string" != typeof t) break;
					let u = S.uParse(t);
					return n ? u.toString() : u;
				case e3.BOOL:
					if ("boolean" != typeof t) break;
					return t;
				case e3.STRING:
					if ("string" != typeof t) break;
					try {
						encodeURIComponent(t)
					} catch (e) {
						throw Error("invalid UTF8")
					}
					return t;
				case e3.BYTES:
					if ("" === t) return new Uint8Array(0);
					if ("string" != typeof t) break;
					return R.dec(t)
			}
			throw Error()
		}

		function K(e, t, n, r) {
			if (null === t) return "google.protobuf.NullValue" == e.typeName ? 0 : r ? e.values[0].no : G;
			switch (typeof t) {
				case "number":
					if (Number.isInteger(t)) return t;
					break;
				case "string":
					let i = e.findName(t);
					if (void 0 !== i) return i.no;
					if (n) return X
			}
			throw Error("cannot decode enum ".concat(e.typeName, " from JSON: ").concat(q(t)))
		}

		function Y(e, t, n) {
			if ("map" == e.kind) {
				a("object" == typeof t && null != t);
				let s = {},
					c = Object.entries(t);
				switch (e.V.kind) {
					case "scalar":
						for (let t of c) {
							var r = C(t, 2);
							let n = r[0],
								i = r[1];
							s[n.toString()] = z(e.V.T, i)
						}
						break;
					case "message":
						for (let e of c) {
							var i = C(e, 2);
							let t = i[0],
								r = i[1];
							s[t.toString()] = r.toJson(n)
						}
						break;
					case "enum":
						let l = e.V.T;
						for (let e of c) {
							var o = C(e, 2);
							let t = o[0],
								r = o[1];
							s[t.toString()] = Q(l, r, n.enumAsInteger)
						}
				}
				return n.emitDefaultValues || c.length > 0 ? s : void 0
			}
			if (e.repeated) {
				a(Array.isArray(t));
				let r = [];
				switch (e.kind) {
					case "scalar":
						for (let n = 0; n < t.length; n++) r.push(z(e.T, t[n]));
						break;
					case "enum":
						for (let i = 0; i < t.length; i++) r.push(Q(e.T, t[i], n.enumAsInteger));
						break;
					case "message":
						for (let e = 0; e < t.length; e++) r.push(t[e].toJson(n))
				}
				return n.emitDefaultValues || r.length > 0 ? r : void 0
			}
			switch (e.kind) {
				case "scalar":
					return z(e.T, t);
				case "enum":
					return Q(e.T, t, n.enumAsInteger);
				case "message":
					return V(e.T, t).toJson(n)
			}
		}

		function Q(e, t, n) {
			var r;
			if (a("number" == typeof t), "google.protobuf.NullValue" == e.typeName) return null;
			if (n) return t;
			let i = e.findNumber(t);
			return null != (r = null == i ? void 0 : i.name) ? r : t
		}

		function z(e, t) {
			switch (e) {
				case e3.INT32:
				case e3.SFIXED32:
				case e3.SINT32:
				case e3.FIXED32:
				case e3.UINT32:
					return a("number" == typeof t), t;
				case e3.FLOAT:
				case e3.DOUBLE:
					return a("number" == typeof t), Number.isNaN(t) ? "NaN" : 1 / 0 === t ? "Infinity" : -1 / 0 === t ? "-Infinity" : t;
				case e3.STRING:
					return a("string" == typeof t), t;
				case e3.BOOL:
					return a("boolean" == typeof t), t;
				case e3.UINT64:
				case e3.FIXED64:
				case e3.INT64:
				case e3.SFIXED64:
				case e3.SINT64:
					return a("bigint" == typeof t || "string" == typeof t || "number" == typeof t), t.toString();
				case e3.BYTES:
					return a(t instanceof Uint8Array), R.enc(t)
			}
		}
		let $ = Symbol("@bufbuild/protobuf/unknown-fields"),
			Z = {
				readUnknownFields: !0,
				readerFactory: e => new U(e)
			},
			ee = {
				writeUnknownFields: !0,
				writerFactory: () => new A
			};

		function et(e, t, n, r, i) {
			let a = n.repeated,
				o = n.localName;
			switch (n.oneof && ((e = e[n.oneof.localName]).case != o && delete e.value, e.case = o, o = "value"), n.kind) {
				case "scalar":
				case "enum":
					let s = "enum" == n.kind ? e3.INT32 : n.T,
						c = ei;
					if ("scalar" == n.kind && n.L > 0 && (c = er), a) {
						let n = e[o];
						if (r == e6.LengthDelimited && s != e3.STRING && s != e3.BYTES) {
							let e = t.uint32() + t.pos;
							for (; t.pos < e;) n.push(c(t, s))
						} else n.push(c(t, s))
					} else e[o] = c(t, s);
					break;
				case "message":
					let l = n.T;
					a ? e[o].push(en(t, new l, i, n)) : M(e[o]) ? en(t, e[o], i, n) : (e[o] = en(t, new l, i, n), !l.fieldWrapper || n.oneof || n.repeated || (e[o] = l.fieldWrapper.unwrapField(e[o])));
					break;
				case "map":
					let u = function(e, t, n) {
							let r, i, a = t.uint32(),
								o = t.pos + a;
							for (; t.pos < o;) switch (C(t.tag(), 1)[0]) {
								case 1:
									r = ei(t, e.K);
									break;
								case 2:
									switch (e.V.kind) {
										case "scalar":
											i = ei(t, e.V.T);
											break;
										case "enum":
											i = t.int32();
											break;
										case "message":
											i = en(t, new e.V.T, n, void 0)
									}
							}
							if (void 0 === r && (r = N(e.K, e4.BIGINT)), "string" != typeof r && "number" != typeof r && (r = r.toString()), void 0 === i) switch (e.V.kind) {
								case "scalar":
									i = N(e.V.T, e4.BIGINT);
									break;
								case "enum":
									i = e.V.T.values[0].no;
									break;
								case "message":
									i = new e.V.T
							}
							return [r, i]
						}(n, t, i),
						d = C(u, 2),
						f = d[0],
						h = d[1];
					e[o][f] = h
			}
		}

		function en(e, t, n, r) {
			let i = t.getType().runtime.bin,
				a = null == r ? void 0 : r.delimited;
			return i.readMessage(t, e, a ? r.no : e.uint32(), n, a), t
		}

		function er(e, t) {
			let n = ei(e, t);
			return "bigint" == typeof n ? n.toString() : n
		}

		function ei(e, t) {
			switch (t) {
				case e3.STRING:
					return e.string();
				case e3.BOOL:
					return e.bool();
				case e3.DOUBLE:
					return e.double();
				case e3.FLOAT:
					return e.float();
				case e3.INT32:
					return e.int32();
				case e3.INT64:
					return e.int64();
				case e3.UINT64:
					return e.uint64();
				case e3.FIXED64:
					return e.fixed64();
				case e3.BYTES:
					return e.bytes();
				case e3.FIXED32:
					return e.fixed32();
				case e3.SFIXED32:
					return e.sfixed32();
				case e3.SFIXED64:
					return e.sfixed64();
				case e3.SINT64:
					return e.sint64();
				case e3.UINT32:
					return e.uint32();
				case e3.SINT32:
					return e.sint32()
			}
		}

		function ea(e, t, n, r) {
			a(void 0 !== t);
			let i = e.repeated;
			switch (e.kind) {
				case "scalar":
				case "enum":
					let o = "enum" == e.kind ? e3.INT32 : e.T;
					if (i)
						if (a(Array.isArray(t)), e.packed) ! function(e, t, n, r) {
							if (!r.length) return;
							e.tag(n, e6.LengthDelimited).fork();
							let i = C(ec(t), 2)[1];
							for (let t = 0; t < r.length; t++) e[i](r[t]);
							e.join()
						}(n, o, e.no, t);
						else
							for (let r of t) es(n, o, e.no, r);
					else es(n, o, e.no, t);
					break;
				case "message":
					if (i)
						for (let i of (a(Array.isArray(t)), t)) eo(n, r, e, i);
					else eo(n, r, e, t);
					break;
				case "map":
					for (let i of (a("object" == typeof t && null != t), Object.entries(t))) {
						var s = C(i, 2);
						! function(e, t, n, r, i) {
							e.tag(n.no, e6.LengthDelimited), e.fork();
							let o = r;
							switch (n.K) {
								case e3.INT32:
								case e3.FIXED32:
								case e3.UINT32:
								case e3.SFIXED32:
								case e3.SINT32:
									o = Number.parseInt(r);
									break;
								case e3.BOOL:
									a("true" == r || "false" == r), o = "true" == r
							}
							switch (es(e, n.K, 1, o), n.V.kind) {
								case "scalar":
									es(e, n.V.T, 2, i);
									break;
								case "enum":
									es(e, e3.INT32, 2, i);
									break;
								case "message":
									a(void 0 !== i), e.tag(2, e6.LengthDelimited).bytes(i.toBinary(t))
							}
							e.join()
						}(n, r, e, s[0], s[1])
					}
			}
		}

		function eo(e, t, n, r) {
			let i = V(n.T, r);
			n.delimited ? e.tag(n.no, e6.StartGroup).raw(i.toBinary(t)).tag(n.no, e6.EndGroup) : e.tag(n.no, e6.LengthDelimited).bytes(i.toBinary(t))
		}

		function es(e, t, n, r) {
			a(void 0 !== r);
			let i = C(ec(t), 2),
				o = i[0],
				s = i[1];
			e.tag(n, o)[s](r)
		}

		function ec(e) {
			let t = e6.Varint;
			switch (e) {
				case e3.BYTES:
				case e3.STRING:
					t = e6.LengthDelimited;
					break;
				case e3.DOUBLE:
				case e3.FIXED64:
				case e3.SFIXED64:
					t = e6.Bit64;
					break;
				case e3.FIXED32:
				case e3.SFIXED32:
				case e3.FLOAT:
					t = e6.Bit32
			}
			return [t, e3[e].toLowerCase()]
		}

		function el(e) {
			if (void 0 === e) return e;
			if (M(e)) return e.clone();
			if (e instanceof Uint8Array) {
				let t = new Uint8Array(e.byteLength);
				return t.set(e), t
			}
			return e
		}

		function eu(e) {
			return e instanceof Uint8Array ? e : new Uint8Array(e)
		}
		class ed {
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
					for (let n of this.list()) n.oneof ? n.oneof !== e && (e = n.oneof, t.push(e)) : t.push(n)
				}
				return this.members
			}
		}

		function ef(e, t) {
			let n = ep(e);
			return t ? n : ey(eb(n))
		}
		let eh = ep;

		function ep(e) {
			let t = !1,
				n = [];
			for (let r = 0; r < e.length; r++) {
				let i = e.charAt(r);
				switch (i) {
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
						n.push(i), t = !1;
						break;
					default:
						t && (t = !1, i = i.toUpperCase()), n.push(i)
				}
			}
			return n.join("")
		}
		let em = new Set(["constructor", "toString", "toJSON", "valueOf"]),
			eg = new Set(["getType", "clone", "equals", "fromBinary", "fromJson", "fromJsonString", "toBinary", "toJson", "toJsonString", "toObject"]),
			eb = e => eg.has(e) ? "".concat(e, "$") : e,
			ey = e => em.has(e) ? "".concat(e, "$") : e;
		class ev {
			constructor(e) {
				this.kind = "oneof", this.repeated = !1, this.packed = !1, this.opt = !1, this.req = !1, this.default = void 0, this.fields = [], this.name = e, this.localName = ef(e, !1)
			}
			addField(e) {
				a(e.oneof === this, "field ".concat(e.name, " not one of ").concat(this.name)), this.fields.push(e)
			}
			findField(e) {
				if (!this._lookup) {
					this._lookup = Object.create(null);
					for (let e = 0; e < this.fields.length; e++) this._lookup[this.fields[e].localName] = this.fields[e]
				}
				return this._lookup[e]
			}
		}
		let ek = (e5 = e => new ed(e, e => (function(e) {
				var t, n, r, i, a, o;
				let s, c = [];
				for (let l of "function" == typeof e ? e() : e) {
					if (l.localName = ef(l.name, void 0 !== l.oneof), l.jsonName = null != (t = l.jsonName) ? t : eh(l.name), l.repeated = null != (n = l.repeated) && n, "scalar" == l.kind && (l.L = null != (r = l.L) ? r : e4.BIGINT), l.delimited = null != (i = l.delimited) && i, l.req = null != (a = l.req) && a, l.opt = null != (o = l.opt) && o, void 0 === l.packed && (l.packed = "enum" == l.kind || "scalar" == l.kind && l.T != e3.BYTES && l.T != e3.STRING), void 0 !== l.oneof) {
						let e = "string" == typeof l.oneof ? l.oneof : l.oneof.name;
						s && s.name == e || (s = new ev(e)), l.oneof = s, s.addField(l)
					}
					c.push(l)
				}
				return c
			})(e)), e8 = e => {
				for (let t of e.getType().fields.byMember()) {
					if (t.opt) continue;
					let n = t.localName;
					if (t.repeated) e[n] = [];
					else switch (t.kind) {
						case "oneof":
							e[n] = {
								case: void 0
							};
							break;
						case "enum":
							e[n] = 0;
							break;
						case "map":
							e[n] = {};
							break;
						case "scalar":
							e[n] = N(t.T, t.L)
					}
				}
			}, {
				syntax: "proto3",
				json: {
					makeReadOptions: function(e) {
						return e ? Object.assign(Object.assign({}, _), e) : _
					},
					makeWriteOptions: function(e) {
						return e ? Object.assign(Object.assign({}, J), e) : J
					},
					readMessage(e, t, n, r) {
						if (null == t || Array.isArray(t) || "object" != typeof t) throw Error("cannot decode message ".concat(e.typeName, " from JSON: ").concat(q(t)));
						r = null != r ? r : new e;
						let i = new Map,
							a = n.typeRegistry;
						for (let s of Object.entries(t)) {
							var o = C(s, 2);
							let t = o[0],
								c = o[1],
								l = e.fields.findJsonName(t);
							if (l) {
								if (l.oneof) {
									if (null === c && "scalar" == l.kind) continue;
									let n = i.get(l.oneof);
									if (void 0 !== n) throw Error("cannot decode message ".concat(e.typeName, ' from JSON: multiple keys for oneof "').concat(l.oneof.name, '" present: "').concat(n, '", "').concat(t, '"'));
									i.set(l.oneof, t)
								}
								W(r, c, l, n, e)
							} else {
								let i = !1;
								if ((null == a ? void 0 : a.findExtension) && t.startsWith("[") && t.endsWith("]")) {
									let o = a.findExtension(t.substring(1, t.length - 1));
									if (o && o.extendee.typeName == e.typeName) {
										i = !0;
										let e = C(L(o), 2),
											t = e[0],
											a = e[1];
										W(t, c, o.field, n, o),
											function(e, t, n, r) {
												x(t, e);
												let i = t.runtime.bin.makeReadOptions(r),
													a = t.runtime.bin.makeWriteOptions(r);
												if (B(e, t)) {
													let n = e.getType().runtime.bin.listUnknownFields(e).filter(e => e.no != t.field.no);
													for (let t of (e.getType().runtime.bin.discardUnknownFields(e), n)) e.getType().runtime.bin.onUnknownField(e, t.no, t.wireType, t.data)
												}
												let o = a.writerFactory(),
													s = t.field;
												s.opt || s.repeated || "enum" != s.kind && "scalar" != s.kind || (s = Object.assign(Object.assign({}, t.field), {
													opt: !0
												})), t.runtime.bin.writeField(s, n, o, a);
												let c = i.readerFactory(o.finish());
												for (; c.pos < c.len;) {
													let t = C(c.tag(), 2),
														n = t[0],
														r = t[1],
														i = c.skip(r, n);
													e.getType().runtime.bin.onUnknownField(e, n, r, i)
												}
											}(r, o, a(), n)
									}
								}
								if (!i && !n.ignoreUnknownFields) throw Error("cannot decode message ".concat(e.typeName, ' from JSON: key "').concat(t, '" is unknown'))
							}
						}
						return r
					},
					writeMessage(e, t) {
						let n, r = e.getType(),
							i = {};
						try {
							for (n of r.fields.byNumber()) {
								if (!P(n, e)) {
									if (n.req) throw "required field not set";
									if (!t.emitDefaultValues || !(!(!n.repeated && "map" != n.kind) || !n.oneof && "message" != n.kind && !n.opt && !n.req)) continue
								}
								let r = Y(n, n.oneof ? e[n.oneof.localName].value : e[n.localName], t);
								void 0 !== r && (i[t.useProtoFieldName ? n.name : n.jsonName] = r)
							}
							let a = t.typeRegistry;
							if (null == a ? void 0 : a.findExtensionFor)
								for (let n of r.runtime.bin.listUnknownFields(e)) {
									let o = a.findExtensionFor(r.typeName, n.no);
									if (o && B(e, o)) {
										let n = function(e, t, n) {
												x(t, e);
												let r = t.runtime.bin.makeReadOptions(n),
													i = function(e, t) {
														if (!t.repeated && ("enum" == t.kind || "scalar" == t.kind)) {
															for (let n = e.length - 1; n >= 0; --n)
																if (e[n].no == t.no) return [e[n]];
															return []
														}
														return e.filter(e => e.no === t.no)
													}(e.getType().runtime.bin.listUnknownFields(e), t.field),
													a = C(L(t), 2),
													o = a[0],
													s = a[1];
												for (let e of i) t.runtime.bin.readField(o, r.readerFactory(e.data), t.field, e.wireType, r);
												return s()
											}(e, o, t),
											r = Y(o.field, n, t);
										void 0 !== r && (i[o.field.jsonName] = r)
									}
								}
						} catch (i) {
							let e = n ? "cannot encode field ".concat(r.typeName, ".").concat(n.name, " to JSON") : "cannot encode message ".concat(r.typeName, " to JSON"),
								t = i instanceof Error ? i.message : String(i);
							throw Error(e + (t.length > 0 ? ": ".concat(t) : ""))
						}
						return i
					},
					readScalar: (e, t, n) => H(e, t, null != n ? n : e4.BIGINT, !0),
					writeScalar(e, t, n) {
						if (void 0 !== t) return n || I(e, t) ? z(e, t) : void 0
					},
					debug: q
				},
				bin: {
					makeReadOptions: function(e) {
						return e ? Object.assign(Object.assign({}, Z), e) : Z
					},
					makeWriteOptions: function(e) {
						return e ? Object.assign(Object.assign({}, ee), e) : ee
					},
					listUnknownFields(e) {
						var t;
						return null != (t = e[$]) ? t : []
					},
					discardUnknownFields(e) {
						delete e[$]
					},
					writeUnknownFields(e, t) {
						let n = e[$];
						if (n)
							for (let e of n) t.tag(e.no, e.wireType).raw(e.data)
					},
					onUnknownField(e, t, n, r) {
						Array.isArray(e[$]) || (e[$] = []), e[$].push({
							no: t,
							wireType: n,
							data: r
						})
					},
					readMessage(e, t, n, r, i) {
						let a, o, s = e.getType(),
							c = i ? t.len : t.pos + n;
						for (; t.pos < c;) {
							var l = C(t.tag(), 2);
							if (a = l[0], o = l[1], !0 === i && o == e6.EndGroup) break;
							let n = s.fields.find(a);
							if (n) et(e, t, n, o, r);
							else {
								let n = t.skip(o, a);
								r.readUnknownFields && this.onUnknownField(e, a, o, n)
							}
						}
						if (i && (o != e6.EndGroup || a !== n)) throw Error("invalid end group tag")
					},
					readField: et,
					writeMessage(e, t, n) {
						let r = e.getType();
						for (let i of r.fields.byNumber())
							if (P(i, e)) ea(i, i.oneof ? e[i.oneof.localName].value : e[i.localName], t, n);
							else if (i.req) throw Error("cannot encode field ".concat(r.typeName, ".").concat(i.name, " to binary: required field not set"));
						return n.writeUnknownFields && this.writeUnknownFields(e, t), t
					},
					writeField(e, t, n, r) {
						void 0 !== t && ea(e, t, n, r)
					}
				},
				util: Object.assign(Object.assign({}, {
					setEnumType: u,
					initPartial(e, t) {
						if (void 0 !== e)
							for (let r of t.getType().fields.byMember()) {
								let i = r.localName;
								if (null != e[i]) switch (r.kind) {
									case "oneof":
										let a = e[i].case;
										if (void 0 === a) continue;
										let o = r.findField(a),
											s = e[i].value;
										o && "message" == o.kind && !M(s, o.T) ? s = new o.T(s) : o && "scalar" === o.kind && o.T === e3.BYTES && (s = eu(s)), t[i] = {
											case: a,
											value: s
										};
										break;
									case "scalar":
									case "enum":
										let c = e[i];
										r.T === e3.BYTES && (c = r.repeated ? c.map(eu) : eu(c)), t[i] = c;
										break;
									case "map":
										switch (r.V.kind) {
											case "scalar":
											case "enum":
												if (r.V.T === e3.BYTES)
													for (let r of Object.entries(e[i])) {
														var n = C(r, 2);
														let e = n[0],
															a = n[1];
														t[i][e] = eu(a)
													} else Object.assign(t[i], e[i]);
												break;
											case "message":
												let l = r.V.T;
												for (let n of Object.keys(e[i])) {
													let r = e[i][n];
													l.fieldWrapper || (r = new l(r)), t[i][n] = r
												}
										}
										break;
									case "message":
										let u = r.T;
										if (r.repeated) t[i] = e[i].map(e => M(e, u) ? e : new u(e));
										else {
											let n = e[i];
											u.fieldWrapper ? "google.protobuf.BytesValue" === u.typeName ? t[i] = eu(n) : t[i] = n : t[i] = M(n, u) ? n : new u(n)
										}
								}
							}
					},
					equals: (e, t, n) => t === n || !(!t || !n) && e.fields.byMember().every(e => {
						let r = t[e.localName],
							i = n[e.localName];
						if (e.repeated) {
							if (r.length !== i.length) return !1;
							switch (e.kind) {
								case "message":
									return r.every((t, n) => e.T.equals(t, i[n]));
								case "scalar":
									return r.every((t, n) => E(e.T, t, i[n]));
								case "enum":
									return r.every((e, t) => E(e3.INT32, e, i[t]))
							}
							throw Error("repeated cannot contain ".concat(e.kind))
						}
						switch (e.kind) {
							case "message":
								let a = r,
									o = i;
								return e.T.fieldWrapper && (void 0 === a || M(a) || (a = e.T.fieldWrapper.wrapField(a)), void 0 === o || M(o) || (o = e.T.fieldWrapper.wrapField(o))), e.T.equals(a, o);
							case "enum":
								return E(e3.INT32, r, i);
							case "scalar":
								return E(e.T, r, i);
							case "oneof":
								if (r.case !== i.case) return !1;
								let s = e.findField(r.case);
								if (void 0 === s) return !0;
								switch (s.kind) {
									case "message":
										return s.T.equals(r.value, i.value);
									case "enum":
										return E(e3.INT32, r.value, i.value);
									case "scalar":
										return E(s.T, r.value, i.value)
								}
								throw Error("oneof cannot contain ".concat(s.kind));
							case "map":
								let c = Object.keys(r).concat(Object.keys(i));
								switch (e.V.kind) {
									case "message":
										let l = e.V.T;
										return c.every(e => l.equals(r[e], i[e]));
									case "enum":
										return c.every(e => E(e3.INT32, r[e], i[e]));
									case "scalar":
										let u = e.V.T;
										return c.every(e => E(u, r[e], i[e]))
								}
						}
					}),
					clone(e) {
						let t = e.getType(),
							n = new t;
						for (let i of t.fields.byMember()) {
							let t, a = e[i.localName];
							if (i.repeated) t = a.map(el);
							else if ("map" == i.kind)
								for (let e of (t = n[i.localName], Object.entries(a))) {
									var r = C(e, 2);
									let n = r[0],
										i = r[1];
									t[n] = el(i)
								} else t = "oneof" == i.kind ? i.findField(a.case) ? {
									case: a.case,
									value: el(a.value)
								} : {
									case: void 0
								} : el(a);
							n[i.localName] = t
						}
						for (let r of t.runtime.bin.listUnknownFields(e)) t.runtime.bin.onUnknownField(n, r.no, r.wireType, r.data);
						return n
					}
				}), {
					newFieldList: e5,
					initFields: e8
				}),
				makeMessageType(e, t, n) {
					var r, i;
					let a, o;
					return r = this, Object.setPrototypeOf((o = ({
						[a = null != (i = null == n ? void 0 : n.localName) ? i : e.substring(e.lastIndexOf(".") + 1)]: function(e) {
							r.util.initFields(this), r.util.initPartial(e, this)
						}
					})[a]).prototype, new h), Object.assign(o, {
						runtime: r,
						typeName: e,
						fields: r.util.newFieldList(t),
						fromBinary: (e, t) => (new o).fromBinary(e, t),
						fromJson: (e, t) => (new o).fromJson(e, t),
						fromJsonString: (e, t) => (new o).fromJsonString(e, t),
						equals: (e, t) => r.util.equals(o, e, t)
					}), o
				},
				makeEnum: function(e, t, n) {
					let r = {};
					for (let e of t) {
						let t = f(e);
						r[t.localName] = t.no, r[t.no] = t.localName
					}
					return u(r, e, t), r
				},
				makeEnumType: d,
				getEnumType: function(e) {
					let t = e[l];
					return a(t, "missing enum type on enum object"), t
				},
				makeExtension(e, t, n) {
					var r;
					let i;
					return r = this, {
						typeName: e,
						extendee: t,
						get field() {
							if (!i) {
								let t = "function" == typeof n ? n() : n;
								t.name = e.split(".").pop(), t.jsonName = "[".concat(e, "]"), i = r.util.newFieldList([t]).list()[0]
							}
							return i
						},
						runtime: r
					}
				}
			}),
			eT = ek.makeEnum("livekit.TrackType", [{
				no: 0,
				name: "AUDIO"
			}, {
				no: 1,
				name: "VIDEO"
			}, {
				no: 2,
				name: "DATA"
			}]),
			ew = ek.makeEnum("livekit.TrackSource", [{
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
			eS = ek.makeEnum("livekit.StreamState", [{
				no: 0,
				name: "ACTIVE"
			}, {
				no: 1,
				name: "PAUSED"
			}]);
		"function" == typeof SuppressedError && SuppressedError;
		class eE extends(e7 = Promise) {
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
		eE.resolve = e => Reflect.get(e7, "resolve", eE).call(eE, e);
		let eN = /version\/(\d+(\.?_?\d+)+)/i;

		function eI(t) {
			let n = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
			if ("u" < typeof navigator) return;
			let r = navigator.userAgent.toLowerCase();
			if (void 0 === e || n) {
				let t = eO.find(e => e.test.test(r));
				e = null == t ? void 0 : t.describe(r)
			}
			return e
		}
		let eO = [{
			test: /firefox|iceweasel|fxios/i,
			describe: e => ({
				name: "Firefox",
				version: eC(/(?:firefox|iceweasel|fxios)[\s/](\d+(\.?_?\d+)+)/i, e),
				os: e.toLowerCase().includes("fxios") ? "iOS" : void 0,
				osVersion: eA(e)
			})
		}, {
			test: /chrom|crios|crmo/i,
			describe: e => ({
				name: "Chrome",
				version: eC(/(?:chrome|chromium|crios|crmo)\/(\d+(\.?_?\d+)+)/i, e),
				os: e.toLowerCase().includes("crios") ? "iOS" : void 0,
				osVersion: eA(e)
			})
		}, {
			test: /safari|applewebkit/i,
			describe: e => ({
				name: "Safari",
				version: eC(eN, e),
				os: e.includes("mobile/") ? "iOS" : "macOS",
				osVersion: eA(e)
			})
		}];

		function eC(e, t) {
			let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
				r = t.match(e);
			return r && r.length >= n && r[n] || ""
		}

		function eA(e) {
			return e.includes("mac os") ? eC(/\(.+?(\d+_\d+(:?_\d+)?)/, e, 1).replace(/_/g, ".") : void 0
		}(eW = e9 || (e9 = {}))[eW.NotAllowed = 0] = "NotAllowed", eW[eW.ServerUnreachable = 1] = "ServerUnreachable", eW[eW.InternalError = 2] = "InternalError", eW[eW.Cancelled = 3] = "Cancelled", eW[eW.LeaveRequest = 4] = "LeaveRequest", eW[eW.Timeout = 5] = "Timeout", eW[eW.WebSocket = 6] = "WebSocket", eW[eW.ServiceNotFound = 7] = "ServiceNotFound", (eH = te || (te = {}))[eH.AlreadyOpened = 0] = "AlreadyOpened", eH[eH.AbnormalEnd = 1] = "AbnormalEnd", eH[eH.DecodeFailed = 2] = "DecodeFailed", eH[eH.LengthExceeded = 3] = "LengthExceeded", eH[eH.Incomplete = 4] = "Incomplete", eH[eH.HandlerAlreadyRegistered = 7] = "HandlerAlreadyRegistered", eH[eH.EncryptionTypeMismatch = 8] = "EncryptionTypeMismatch", (eK = tt || (tt = {})).PermissionDenied = "PermissionDenied", eK.NotFound = "NotFound", eK.DeviceInUse = "DeviceInUse", eK.Other = "Other", (eY = tt || (tt = {})).getFailure = function(e) {
			if (e && "name" in e) return "NotFoundError" === e.name || "DevicesNotFoundError" === e.name ? eY.NotFound : "NotAllowedError" === e.name || "PermissionDeniedError" === e.name ? eY.PermissionDenied : "NotReadableError" === e.name || "TrackStartError" === e.name ? eY.DeviceInUse : eY.Other
		};
		var eU, eL, eF, eD, eR, eB, ex, eP, ej, eM, eV, e_, eJ, eG, eX, eq, eW, eH, eK, eY, eQ, ez, e$, eZ, e0, e2, e1, e3, e4, e6, e5, e8, e7, e9, te, tt, tn, tr, ti, ta, to, ts, tc = {
				exports: {}
			},
			tl = function() {
				if (tn) return tc.exports;
				tn = 1;
				var e, t = "object" == typeof Reflect ? Reflect : null,
					n = t && "function" == typeof t.apply ? t.apply : function(e, t, n) {
						return Function.prototype.apply.call(e, t, n)
					};
				e = t && "function" == typeof t.ownKeys ? t.ownKeys : Object.getOwnPropertySymbols ? function(e) {
					return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))
				} : function(e) {
					return Object.getOwnPropertyNames(e)
				};
				var r = Number.isNaN || function(e) {
					return e != e
				};

				function i() {
					i.init.call(this)
				}
				tc.exports = i, tc.exports.once = function(e, t) {
					return new Promise(function(n, r) {
						function i(n) {
							e.removeListener(t, a), r(n)
						}

						function a() {
							"function" == typeof e.removeListener && e.removeListener("error", i), n([].slice.call(arguments))
						}
						p(e, t, a, {
							once: !0
						}), "error" !== t && "function" == typeof e.on && p(e, "error", i, {
							once: !0
						})
					})
				}, i.EventEmitter = i, i.prototype._events = void 0, i.prototype._eventsCount = 0, i.prototype._maxListeners = void 0;
				var a = 10;

				function o(e) {
					if ("function" != typeof e) throw TypeError('The "listener" argument must be of type Function. Received type ' + typeof e)
				}

				function s(e) {
					return void 0 === e._maxListeners ? i.defaultMaxListeners : e._maxListeners
				}

				function c(e, t, n, r) {
					var i, a, c;
					if (o(n), void 0 === (a = e._events) ? (a = e._events = Object.create(null), e._eventsCount = 0) : (void 0 !== a.newListener && (e.emit("newListener", t, n.listener ? n.listener : n), a = e._events), c = a[t]), void 0 === c) c = a[t] = n, ++e._eventsCount;
					else if ("function" == typeof c ? c = a[t] = r ? [n, c] : [c, n] : r ? c.unshift(n) : c.push(n), (i = s(e)) > 0 && c.length > i && !c.warned) {
						c.warned = !0;
						var l = Error("Possible EventEmitter memory leak detected. " + c.length + " " + String(t) + " listeners added. Use emitter.setMaxListeners() to increase limit");
						l.name = "MaxListenersExceededWarning", l.emitter = e, l.type = t, l.count = c.length, console && console.warn && console.warn(l)
					}
					return e
				}

				function l() {
					if (!this.fired) return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, 0 == arguments.length ? this.listener.call(this.target) : this.listener.apply(this.target, arguments)
				}

				function u(e, t, n) {
					var r = {
							fired: !1,
							wrapFn: void 0,
							target: e,
							type: t,
							listener: n
						},
						i = l.bind(r);
					return i.listener = n, r.wrapFn = i, i
				}

				function d(e, t, n) {
					var r = e._events;
					if (void 0 === r) return [];
					var i = r[t];
					return void 0 === i ? [] : "function" == typeof i ? n ? [i.listener || i] : [i] : n ? function(e) {
						for (var t = Array(e.length), n = 0; n < t.length; ++n) t[n] = e[n].listener || e[n];
						return t
					}(i) : h(i, i.length)
				}

				function f(e) {
					var t = this._events;
					if (void 0 !== t) {
						var n = t[e];
						if ("function" == typeof n) return 1;
						if (void 0 !== n) return n.length
					}
					return 0
				}

				function h(e, t) {
					for (var n = Array(t), r = 0; r < t; ++r) n[r] = e[r];
					return n
				}

				function p(e, t, n, r) {
					if ("function" == typeof e.on) r.once ? e.once(t, n) : e.on(t, n);
					else {
						if ("function" != typeof e.addEventListener) throw TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof e);
						e.addEventListener(t, function i(a) {
							r.once && e.removeEventListener(t, i), n(a)
						})
					}
				}
				return Object.defineProperty(i, "defaultMaxListeners", {
					enumerable: !0,
					get: function() {
						return a
					},
					set: function(e) {
						if ("number" != typeof e || e < 0 || r(e)) throw RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + e + ".");
						a = e
					}
				}), i.init = function() {
					void 0 !== this._events && this._events !== Object.getPrototypeOf(this)._events || (this._events = Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0
				}, i.prototype.setMaxListeners = function(e) {
					if ("number" != typeof e || e < 0 || r(e)) throw RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + e + ".");
					return this._maxListeners = e, this
				}, i.prototype.getMaxListeners = function() {
					return s(this)
				}, i.prototype.emit = function(e) {
					for (var t = [], r = 1; r < arguments.length; r++) t.push(arguments[r]);
					var i = "error" === e,
						a = this._events;
					if (void 0 !== a) i = i && void 0 === a.error;
					else if (!i) return !1;
					if (i) {
						if (t.length > 0 && (o = t[0]), o instanceof Error) throw o;
						var o, s = Error("Unhandled error." + (o ? " (" + o.message + ")" : ""));
						throw s.context = o, s
					}
					var c = a[e];
					if (void 0 === c) return !1;
					if ("function" == typeof c) n(c, this, t);
					else {
						var l = c.length,
							u = h(c, l);
						for (r = 0; r < l; ++r) n(u[r], this, t)
					}
					return !0
				}, i.prototype.addListener = function(e, t) {
					return c(this, e, t, !1)
				}, i.prototype.on = i.prototype.addListener, i.prototype.prependListener = function(e, t) {
					return c(this, e, t, !0)
				}, i.prototype.once = function(e, t) {
					return o(t), this.on(e, u(this, e, t)), this
				}, i.prototype.prependOnceListener = function(e, t) {
					return o(t), this.prependListener(e, u(this, e, t)), this
				}, i.prototype.removeListener = function(e, t) {
					var n, r, i, a, s;
					if (o(t), void 0 === (r = this._events) || void 0 === (n = r[e])) return this;
					if (n === t || n.listener === t) 0 == --this._eventsCount ? this._events = Object.create(null) : (delete r[e], r.removeListener && this.emit("removeListener", e, n.listener || t));
					else if ("function" != typeof n) {
						for (i = -1, a = n.length - 1; a >= 0; a--)
							if (n[a] === t || n[a].listener === t) {
								s = n[a].listener, i = a;
								break
							} if (i < 0) return this;
						0 === i ? n.shift() : function(e, t) {
							for (; t + 1 < e.length; t++) e[t] = e[t + 1];
							e.pop()
						}(n, i), 1 === n.length && (r[e] = n[0]), void 0 !== r.removeListener && this.emit("removeListener", e, s || t)
					}
					return this
				}, i.prototype.off = i.prototype.removeListener, i.prototype.removeAllListeners = function(e) {
					var t, n, r;
					if (void 0 === (n = this._events)) return this;
					if (void 0 === n.removeListener) return 0 == arguments.length ? (this._events = Object.create(null), this._eventsCount = 0) : void 0 !== n[e] && (0 == --this._eventsCount ? this._events = Object.create(null) : delete n[e]), this;
					if (0 == arguments.length) {
						var i, a = Object.keys(n);
						for (r = 0; r < a.length; ++r) "removeListener" !== (i = a[r]) && this.removeAllListeners(i);
						return this.removeAllListeners("removeListener"), this._events = Object.create(null), this._eventsCount = 0, this
					}
					if ("function" == typeof(t = n[e])) this.removeListener(e, t);
					else if (void 0 !== t)
						for (r = t.length - 1; r >= 0; r--) this.removeListener(e, t[r]);
					return this
				}, i.prototype.listeners = function(e) {
					return d(this, e, !0)
				}, i.prototype.rawListeners = function(e) {
					return d(this, e, !1)
				}, i.listenerCount = function(e, t) {
					return "function" == typeof e.listenerCount ? e.listenerCount(t) : f.call(e, t)
				}, i.prototype.listenerCount = f, i.prototype.eventNames = function() {
					return this._eventsCount > 0 ? e(this._events) : []
				}, tc.exports
			}(),
			tu = {
				exports: {}
			},
			td = (tr || (tr = 1, ti = tu.exports, ta = function() {
				var e = function() {},
					t = "undefined",
					n = typeof window !== t && typeof window.navigator !== t && /Trident\/|MSIE /.test(window.navigator.userAgent),
					r = ["trace", "debug", "info", "warn", "error"],
					i = {},
					a = null;

				function o(e, t) {
					var n = e[t];
					if ("function" == typeof n.bind) return n.bind(e);
					try {
						return Function.prototype.bind.call(n, e)
					} catch (t) {
						return function() {
							return Function.prototype.apply.apply(n, [e, arguments])
						}
					}
				}

				function s() {
					console.log && (console.log.apply ? console.log.apply(console, arguments) : Function.prototype.apply.apply(console.log, [console, arguments])), console.trace && console.trace()
				}

				function c() {
					for (var n = this.getLevel(), i = 0; i < r.length; i++) {
						var a = r[i];
						this[a] = i < n ? e : this.methodFactory(a, n, this.name)
					}
					if (this.log = this.debug, typeof console === t && n < this.levels.SILENT) return "No console available for logging"
				}

				function l(e) {
					return function() {
						typeof console !== t && (c.call(this), this[e].apply(this, arguments))
					}
				}

				function u(r, i, a) {
					var c;
					return "debug" === (c = r) && (c = "log"), typeof console !== t && ("trace" === c && n ? s : void 0 !== console[c] ? o(console, c) : void 0 !== console.log ? o(console, "log") : e) || l.apply(this, arguments)
				}

				function d(e, n) {
					var o, s, l, d = this,
						f = "loglevel";

					function h() {
						var e;
						if (typeof window !== t && f) {
							try {
								e = window.localStorage[f]
							} catch (e) {}
							if (typeof e === t) try {
								var n = window.document.cookie,
									r = encodeURIComponent(f),
									i = n.indexOf(r + "="); - 1 !== i && (e = /^([^;]+)/.exec(n.slice(i + r.length + 1))[1])
							} catch (e) {}
							return void 0 === d.levels[e] && (e = void 0), e
						}
					}

					function p(e) {
						var t = e;
						if ("string" == typeof t && void 0 !== d.levels[t.toUpperCase()] && (t = d.levels[t.toUpperCase()]), "number" == typeof t && t >= 0 && t <= d.levels.SILENT) return t;
						throw TypeError("log.setLevel() called with invalid level: " + e)
					}
					"string" == typeof e ? f += ":" + e : "symbol" == typeof e && (f = void 0), d.name = e, d.levels = {
						TRACE: 0,
						DEBUG: 1,
						INFO: 2,
						WARN: 3,
						ERROR: 4,
						SILENT: 5
					}, d.methodFactory = n || u, d.getLevel = function() {
						return null != l ? l : null != s ? s : o
					}, d.setLevel = function(e, n) {
						return l = p(e), !1 !== n && function(e) {
							var n = (r[e] || "silent").toUpperCase();
							if (typeof window !== t && f) {
								try {
									return void(window.localStorage[f] = n)
								} catch (e) {}
								try {
									window.document.cookie = encodeURIComponent(f) + "=" + n + ";"
								} catch (e) {}
							}
						}(l), c.call(d)
					}, d.setDefaultLevel = function(e) {
						s = p(e), h() || d.setLevel(e, !1)
					}, d.resetLevel = function() {
						l = null,
							function() {
								if (typeof window !== t && f) {
									try {
										window.localStorage.removeItem(f)
									} catch (e) {}
									try {
										window.document.cookie = encodeURIComponent(f) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC"
									} catch (e) {}
								}
							}(), c.call(d)
					}, d.enableAll = function(e) {
						d.setLevel(d.levels.TRACE, e)
					}, d.disableAll = function(e) {
						d.setLevel(d.levels.SILENT, e)
					}, d.rebuild = function() {
						if (a !== d && (o = p(a.getLevel())), c.call(d), a === d)
							for (var e in i) i[e].rebuild()
					}, o = p(a ? a.getLevel() : "WARN");
					var m = h();
					null != m && (l = p(m)), c.call(d)
				}(a = new d).getLogger = function(e) {
					if ("symbol" != typeof e && "string" != typeof e || "" === e) throw TypeError("You must supply a name when creating a logger.");
					var t = i[e];
					return t || (t = i[e] = new d(e, a.methodFactory)), t
				};
				var f = typeof window !== t ? window.log : void 0;
				return a.noConflict = function() {
					return typeof window !== t && window.log === a && (window.log = f), a
				}, a.getLoggers = function() {
					return i
				}, a.default = a, a
			}, tu.exports ? tu.exports = ta() : ti.log = ta()), tu.exports);
		(eU = to || (to = {}))[eU.trace = 0] = "trace", eU[eU.debug = 1] = "debug", eU[eU.info = 2] = "info", eU[eU.warn = 3] = "warn", eU[eU.error = 4] = "error", eU[eU.silent = 5] = "silent", (eL = ts || (ts = {})).Default = "livekit", eL.Room = "livekit-room", eL.TokenSource = "livekit-token-source", eL.Participant = "livekit-participant", eL.Track = "livekit-track", eL.Publication = "livekit-track-publication", eL.Engine = "livekit-engine", eL.Signal = "livekit-signal", eL.PCManager = "livekit-pc-manager", eL.PCTransport = "livekit-pc-transport", eL.E2EE = "lk-e2ee", eL.DataTracks = "livekit-data-tracks";
		let tf = td.getLogger(ts.Default);

		function th(e, t) {
			let n = td.getLogger(e);
			return n.setDefaultLevel(tf.getLevel()), n
		}
		Object.values(ts).map(e => td.getLogger(e)), tf.setDefaultLevel(to.info), td.getLogger(ts.E2EE), (eF = eQ || (eQ = {})).Connected = "connected", eF.Reconnecting = "reconnecting", eF.SignalReconnecting = "signalReconnecting", eF.Reconnected = "reconnected", eF.Disconnected = "disconnected", eF.ConnectionStateChanged = "connectionStateChanged", eF.Moved = "moved", eF.MediaDevicesChanged = "mediaDevicesChanged", eF.ParticipantConnected = "participantConnected", eF.ParticipantDisconnected = "participantDisconnected", eF.TrackPublished = "trackPublished", eF.TrackSubscribed = "trackSubscribed", eF.TrackSubscriptionFailed = "trackSubscriptionFailed", eF.TrackUnpublished = "trackUnpublished", eF.TrackUnsubscribed = "trackUnsubscribed", eF.TrackMuted = "trackMuted", eF.TrackUnmuted = "trackUnmuted", eF.LocalTrackPublished = "localTrackPublished", eF.LocalTrackUnpublished = "localTrackUnpublished", eF.LocalAudioSilenceDetected = "localAudioSilenceDetected", eF.ActiveSpeakersChanged = "activeSpeakersChanged", eF.ParticipantMetadataChanged = "participantMetadataChanged", eF.ParticipantNameChanged = "participantNameChanged", eF.ParticipantAttributesChanged = "participantAttributesChanged", eF.ParticipantActive = "participantActive", eF.RoomMetadataChanged = "roomMetadataChanged", eF.DataReceived = "dataReceived", eF.SipDTMFReceived = "sipDTMFReceived", eF.TranscriptionReceived = "transcriptionReceived", eF.ConnectionQualityChanged = "connectionQualityChanged", eF.TrackStreamStateChanged = "trackStreamStateChanged", eF.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", eF.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", eF.AudioPlaybackStatusChanged = "audioPlaybackChanged", eF.VideoPlaybackStatusChanged = "videoPlaybackChanged", eF.MediaDevicesError = "mediaDevicesError", eF.ParticipantPermissionsChanged = "participantPermissionsChanged", eF.SignalConnected = "signalConnected", eF.RecordingStatusChanged = "recordingStatusChanged", eF.ParticipantEncryptionStatusChanged = "participantEncryptionStatusChanged", eF.EncryptionError = "encryptionError", eF.DCBufferStatusChanged = "dcBufferStatusChanged", eF.ActiveDeviceChanged = "activeDeviceChanged", eF.ChatMessage = "chatMessage", eF.LocalTrackSubscribed = "localTrackSubscribed", eF.MetricsReceived = "metricsReceived", eF.DataTrackPublished = "dataTrackPublished", eF.DataTrackUnpublished = "dataTrackUnpublished", eF.LocalDataTrackPublished = "localDataTrackPublished", eF.LocalDataTrackUnpublished = "localDataTrackUnpublished", (eD = ez || (ez = {})).TrackPublished = "trackPublished", eD.TrackSubscribed = "trackSubscribed", eD.TrackSubscriptionFailed = "trackSubscriptionFailed", eD.TrackUnpublished = "trackUnpublished", eD.TrackUnsubscribed = "trackUnsubscribed", eD.TrackMuted = "trackMuted", eD.TrackUnmuted = "trackUnmuted", eD.LocalTrackPublished = "localTrackPublished", eD.LocalTrackUnpublished = "localTrackUnpublished", eD.LocalTrackCpuConstrained = "localTrackCpuConstrained", eD.LocalSenderCreated = "localSenderCreated", eD.ParticipantMetadataChanged = "participantMetadataChanged", eD.ParticipantNameChanged = "participantNameChanged", eD.DataReceived = "dataReceived", eD.SipDTMFReceived = "sipDTMFReceived", eD.TranscriptionReceived = "transcriptionReceived", eD.IsSpeakingChanged = "isSpeakingChanged", eD.ConnectionQualityChanged = "connectionQualityChanged", eD.TrackStreamStateChanged = "trackStreamStateChanged", eD.TrackSubscriptionPermissionChanged = "trackSubscriptionPermissionChanged", eD.TrackSubscriptionStatusChanged = "trackSubscriptionStatusChanged", eD.TrackCpuConstrained = "trackCpuConstrained", eD.MediaDevicesError = "mediaDevicesError", eD.AudioStreamAcquired = "audioStreamAcquired", eD.ParticipantPermissionsChanged = "participantPermissionsChanged", eD.PCTrackAdded = "pcTrackAdded", eD.AttributesChanged = "attributesChanged", eD.LocalTrackSubscribed = "localTrackSubscribed", eD.ChatMessage = "chatMessage", eD.Active = "active", (eR = e$ || (e$ = {})).TransportsCreated = "transportsCreated", eR.Connected = "connected", eR.Disconnected = "disconnected", eR.Resuming = "resuming", eR.Resumed = "resumed", eR.Restarting = "restarting", eR.Restarted = "restarted", eR.SignalResumed = "signalResumed", eR.SignalRestarted = "signalRestarted", eR.Closing = "closing", eR.MediaTrackAdded = "mediaTrackAdded", eR.ActiveSpeakersUpdate = "activeSpeakersUpdate", eR.DataPacketReceived = "dataPacketReceived", eR.RTPVideoMapUpdate = "rtpVideoMapUpdate", eR.DCBufferStatusChanged = "dcBufferStatusChanged", eR.ParticipantUpdate = "participantUpdate", eR.RoomUpdate = "roomUpdate", eR.SpeakersChanged = "speakersChanged", eR.StreamStateChanged = "streamStateChanged", eR.ConnectionQualityUpdate = "connectionQualityUpdate", eR.SubscriptionError = "subscriptionError", eR.SubscriptionPermissionUpdate = "subscriptionPermissionUpdate", eR.RemoteMute = "remoteMute", eR.SubscribedQualityUpdate = "subscribedQualityUpdate", eR.LocalTrackUnpublished = "localTrackUnpublished", eR.LocalTrackSubscribed = "localTrackSubscribed", eR.Offline = "offline", eR.SignalRequestResponse = "signalRequestResponse", eR.SignalConnected = "signalConnected", eR.RoomMoved = "roomMoved", eR.PublishDataTrackResponse = "publishDataTrackResponse", eR.UnPublishDataTrackResponse = "unPublishDataTrackResponse", eR.DataTrackSubscriberHandles = "dataTrackSubscriberHandles", eR.DataTrackPacketReceived = "dataTrackPacketReceived", eR.Joined = "joined", eR.TokenRefreshed = "tokenRefreshed", eR.ServerRegionsReported = "serverRegionsReported", (eB = eZ || (eZ = {})).Message = "message", eB.Muted = "muted", eB.Unmuted = "unmuted", eB.Restarted = "restarted", eB.Ended = "ended", eB.Subscribed = "subscribed", eB.Unsubscribed = "unsubscribed", eB.CpuConstrained = "cpuConstrained", eB.UpdateSettings = "updateSettings", eB.UpdateSubscription = "updateSubscription", eB.AudioPlaybackStarted = "audioPlaybackStarted", eB.AudioPlaybackFailed = "audioPlaybackFailed", eB.AudioSilenceDetected = "audioSilenceDetected", eB.VisibilityChanged = "visibilityChanged", eB.VideoDimensionsChanged = "videoDimensionsChanged", eB.VideoPlaybackStarted = "videoPlaybackStarted", eB.VideoPlaybackFailed = "videoPlaybackFailed", eB.ElementAttached = "elementAttached", eB.ElementDetached = "elementDetached", eB.UpstreamPaused = "upstreamPaused", eB.UpstreamResumed = "upstreamResumed", eB.SubscriptionPermissionChanged = "subscriptionPermissionChanged", eB.SubscriptionStatusChanged = "subscriptionStatusChanged", eB.SubscriptionFailed = "subscriptionFailed", eB.TrackProcessorUpdate = "trackProcessorUpdate", eB.AudioTrackFeatureUpdate = "audioTrackFeatureUpdate", eB.TranscriptionReceived = "transcriptionReceived", eB.TimeSyncUpdate = "timeSyncUpdate", eB.PreConnectBufferFlushed = "preConnectBufferFlushed";
		class tp {
			constructor(e, t, n, r, i) {
				if ("object" == typeof e) this.width = e.width, this.height = e.height, this.aspectRatio = e.aspectRatio, this.encoding = {
					maxBitrate: e.maxBitrate,
					maxFramerate: e.maxFramerate,
					priority: e.priority
				};
				else {
					if (void 0 === t || void 0 === n) throw TypeError("Unsupported options: provide at least width, height and maxBitrate");
					this.width = e, this.height = t, this.aspectRatio = e / t, this.encoding = {
						maxBitrate: n,
						maxFramerate: r,
						priority: i
					}
				}
			}
			get resolution() {
				return {
					width: this.width,
					height: this.height,
					frameRate: this.encoding.maxFramerate,
					aspectRatio: this.aspectRatio
				}
			}
		}(ex = e0 || (e0 = {}))[ex.PREFER_REGRESSION = 0] = "PREFER_REGRESSION", ex[ex.SIMULCAST = 1] = "SIMULCAST", ex[ex.REGRESSION = 2] = "REGRESSION", (eP = e2 || (e2 = {})).telephone = {
			maxBitrate: 12e3
		}, eP.speech = {
			maxBitrate: 24e3
		}, eP.music = {
			maxBitrate: 48e3
		}, eP.musicStereo = {
			maxBitrate: 64e3
		}, eP.musicHighQuality = {
			maxBitrate: 96e3
		}, eP.musicHighQualityStereo = {
			maxBitrate: 128e3
		}, new tp(160, 90, 9e4, 20), new tp(320, 180, 16e4, 20), new tp(384, 216, 18e4, 20), new tp(640, 360, 45e4, 20), new tp(960, 540, 8e5, 25), new tp(1280, 720, 17e5, 30), new tp(1920, 1080, 3e6, 30), new tp(2560, 1440, 5e6, 30), new tp(3840, 2160, 8e6, 30), new tp(160, 120, 7e4, 20), new tp(240, 180, 125e3, 20), new tp(320, 240, 14e4, 20), new tp(480, 360, 33e4, 20), new tp(640, 480, 5e5, 20), new tp(720, 540, 6e5, 25), new tp(960, 720, 13e5, 30), new tp(1440, 1080, 23e5, 30), new tp(1920, 1440, 38e5, 30), new tp(640, 360, 2e5, 3, "medium"), new tp(640, 360, 4e5, 15, "medium"), new tp(1280, 720, 8e5, 5, "medium"), new tp(1280, 720, 15e5, 15, "medium"), new tp(1280, 720, 2e6, 30, "medium"), new tp(1920, 1080, 25e5, 15, "medium"), new tp(1920, 1080, 5e6, 30, "medium"), new tp(0, 0, 7e6, 30, "medium");
		let tm = [];
		(ej = e1 || (e1 = {}))[ej.LOW = 0] = "LOW", ej[ej.MEDIUM = 1] = "MEDIUM", ej[ej.HIGH = 2] = "HIGH";
		class tg extends tl.EventEmitter {
			get streamState() {
				return this._streamState
			}
			setStreamState(e) {
				this._streamState = e
			}
			constructor(e, t) {
				var n;
				let r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {};
				super(), this.attachedElements = [], this.isMuted = !1, this._streamState = tg.StreamState.Active, this.isInBackground = !1, this._currentBitrate = 0, this.log = tf, this.appVisibilityChangedListener = () => {
					this.backgroundTimeout && clearTimeout(this.backgroundTimeout), "hidden" === document.visibilityState ? this.backgroundTimeout = setTimeout(() => this.handleAppVisibilityChanged(), 5e3) : this.handleAppVisibilityChanged()
				}, this.log = th(null != (n = r.loggerName) ? n : ts.Track), this.loggerContextCb = r.loggerContextCb, this.setMaxListeners(100), this.kind = t, this._mediaStreamTrack = e, this._mediaStreamID = e.id, this.source = tg.Source.Unknown
			}
			get logContext() {
				var e;
				return Object.assign(Object.assign({}, null == (e = this.loggerContextCb) ? void 0 : e.call(this)), function e(t) {
					return "mediaStreamTrack" in t ? {
						trackID: t.sid,
						source: t.source,
						muted: t.isMuted,
						enabled: t.mediaStreamTrack.enabled,
						kind: t.kind,
						streamID: t.mediaStreamID,
						streamTrackID: t.mediaStreamTrack.id
					} : {
						trackID: t.trackSid,
						enabled: t.isEnabled,
						muted: t.isMuted,
						trackInfo: Object.assign({
							mimeType: t.mimeType,
							name: t.trackName,
							encrypted: t.isEncrypted,
							kind: t.kind,
							source: t.source
						}, t.track ? e(t.track) : {})
					}
				}(this))
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
				var t, n, r;
				let i, a, o = "audio";
				this.kind === tg.Kind.Video && (o = "video"), 0 === this.attachedElements.length && this.kind === tg.Kind.Video && this.addAppVisibilityListener(), e || ("audio" === o && (tm.forEach(t => {
					null !== t.parentElement || e || (e = t)
				}), e && tm.splice(tm.indexOf(e), 1)), e || (e = document.createElement(o))), this.attachedElements.includes(e) || this.attachedElements.push(e), t = this.mediaStreamTrack, i = (n = e).srcObject instanceof MediaStream ? n.srcObject : new MediaStream, (a = "audio" === t.kind ? i.getAudioTracks() : i.getVideoTracks()).includes(t) || (a.forEach(e => {
					i.removeTrack(e)
				}), i.addTrack(t)), ty() && n instanceof HTMLVideoElement || (n.autoplay = !0), n.muted = 0 === i.getAudioTracks().length, n instanceof HTMLVideoElement && (n.playsInline = !0), n.srcObject !== i && (n.srcObject = i, (ty() || "Firefox" === (null == (r = eI()) ? void 0 : r.name)) && n instanceof HTMLVideoElement && setTimeout(() => {
					n.srcObject = i, n.play().catch(() => {})
				}, 0));
				let s = e.srcObject.getTracks(),
					c = s.some(e => "audio" === e.kind);
				return e.play().then(() => {
					this.emit(c ? eZ.AudioPlaybackStarted : eZ.VideoPlaybackStarted)
				}).catch(t => {
					"NotAllowedError" === t.name ? this.emit(c ? eZ.AudioPlaybackFailed : eZ.VideoPlaybackFailed, t) : "AbortError" === t.name ? tf.debug("".concat(c ? "audio" : "video", " playback aborted, likely due to new play request")) : tf.warn("could not playback ".concat(c ? "audio" : "video"), t), c && e && s.some(e => "video" === e.kind) && "NotAllowedError" === t.name && (e.muted = !0, e.play().catch(() => {}))
				}), this.emit(eZ.ElementAttached, e), e
			}
			detach(e) {
				try {
					if (e) {
						tb(this.mediaStreamTrack, e);
						let t = this.attachedElements.indexOf(e);
						return t >= 0 && (this.attachedElements.splice(t, 1), this.recycleElement(e), this.emit(eZ.ElementDetached, e)), e
					}
					let t = [];
					return this.attachedElements.forEach(e => {
						tb(this.mediaStreamTrack, e), t.push(e), this.recycleElement(e), this.emit(eZ.ElementDetached, e)
					}), this.attachedElements = [], t
				} finally {
					0 === this.attachedElements.length && this.removeAppVisibilityListener()
				}
			}
			stop() {
				this.stopMonitor(), this._mediaStreamTrack.stop()
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
				e.loggerName && (this.log = th(e.loggerName)), e.loggerContextCb && (this.loggerContextCb = e.loggerContextCb)
			}
			recycleElement(e) {
				if (e instanceof HTMLAudioElement) {
					let t = !0;
					e.pause(), tm.forEach(e => {
						e.parentElement || (t = !1)
					}), t && tm.push(e)
				}
			}
			handleAppVisibilityChanged() {
				var e, t, n, r;
				return e = this, t = void 0, n = void 0, r = function*() {
					this.isInBackground = "hidden" === document.visibilityState, this.isInBackground || this.kind !== tg.Kind.Video || setTimeout(() => this.attachedElements.forEach(e => e.play().catch(() => {})), 0)
				}, new(n || (n = Promise))(function(i, a) {
					function o(e) {
						try {
							c(r.next(e))
						} catch (e) {
							a(e)
						}
					}

					function s(e) {
						try {
							c(r.throw(e))
						} catch (e) {
							a(e)
						}
					}

					function c(e) {
						var t;
						e.done ? i(e.value) : ((t = e.value) instanceof n ? t : new n(function(e) {
							e(t)
						})).then(o, s)
					}
					c((r = r.apply(e, t || [])).next())
				})
			}
			addAppVisibilityListener() {
				tv() ? (this.isInBackground = "hidden" === document.visibilityState, document.addEventListener("visibilitychange", this.appVisibilityChangedListener)) : this.isInBackground = !1
			}
			removeAppVisibilityListener() {
				tv() && document.removeEventListener("visibilitychange", this.appVisibilityChangedListener)
			}
		}

		function tb(e, t) {
			if (t.srcObject instanceof MediaStream) {
				let n = t.srcObject;
				n.removeTrack(e), n.getTracks().length > 0 ? t.srcObject = n : t.srcObject = null
			}
		}

		function ty() {
			var e;
			return "Safari" === (null == (e = eI()) ? void 0 : e.name)
		}

		function tv() {
			return "u" > typeof document
		}

		function tk(e) {
			return !(!(null == e ? void 0 : e.timestamp) && !(null == e ? void 0 : e.frameId))
		}(eV = t = (eM = tg || (tg = {})).Kind || (eM.Kind = {})).Audio = "audio", eV.Video = "video", eV.Unknown = "unknown", (e_ = n = eM.Source || (eM.Source = {})).Camera = "camera", e_.Microphone = "microphone", e_.ScreenShare = "screen_share", e_.ScreenShareAudio = "screen_share_audio", e_.Unknown = "unknown", (eJ = i = eM.StreamState || (eM.StreamState = {})).Active = "active", eJ.Paused = "paused", eJ.Unknown = "unknown", eM.kindToProto = function(e) {
			switch (e) {
				case t.Audio:
					return eT.AUDIO;
				case t.Video:
					return eT.VIDEO;
				default:
					return eT.DATA
			}
		}, eM.kindFromProto = function(e) {
			switch (e) {
				case eT.AUDIO:
					return t.Audio;
				case eT.VIDEO:
					return t.Video;
				default:
					return t.Unknown
			}
		}, eM.sourceToProto = function(e) {
			switch (e) {
				case n.Camera:
					return ew.CAMERA;
				case n.Microphone:
					return ew.MICROPHONE;
				case n.ScreenShare:
					return ew.SCREEN_SHARE;
				case n.ScreenShareAudio:
					return ew.SCREEN_SHARE_AUDIO;
				default:
					return ew.UNKNOWN
			}
		}, eM.sourceFromProto = function(e) {
			switch (e) {
				case ew.CAMERA:
					return n.Camera;
				case ew.MICROPHONE:
					return n.Microphone;
				case ew.SCREEN_SHARE:
					return n.ScreenShare;
				case ew.SCREEN_SHARE_AUDIO:
					return n.ScreenShareAudio;
				default:
					return n.Unknown
			}
		}, eM.streamStateFromProto = function(e) {
			switch (e) {
				case eS.ACTIVE:
					return i.Active;
				case eS.PAUSED:
					return i.Paused;
				default:
					return i.Unknown
			}
		};
		let tT = Uint8Array.from([76, 75, 84, 83]),
			tw = new Map;

		function tS(e, t, n, r) {
			let i = {
				trackId: n,
				hasPacketTrailer: r
			};
			tw.set(n, i);
			let a = new TransformStream({
				transform(e, t) {
					try {
						if (i.hasPacketTrailer) {
							let t = function(e, t) {
								if (0 === e.data.byteLength) return {};
								let n = function(e) {
									let t = e instanceof Uint8Array ? e : new Uint8Array(e);
									if (t.length < 5 || ! function(e, t) {
											for (let n = 0; n < tT.length; n += 1)
												if (e[t + n] !== tT[n]) return !1;
											return !0
										}(t, t.length - tT.length)) return {
										data: t
									};
									let n = 255 ^ t[t.length - 5];
									if (n < 5 || n > t.length) return {
										data: t
									};
									let r = t.length - n,
										i = t.length - 5,
										a = t.subarray(0, r),
										o = r,
										s = !1,
										c = {
											userTimestamp: BigInt(0),
											frameId: 0
										};
									for (; o + 2 <= i;) {
										let e = 255 ^ t[o++],
											n = 255 ^ t[o++];
										if (o + n > i) break;
										if (1 === e && 8 === n) c.userTimestamp = function(e, t) {
											let n = BigInt(((255 ^ e[t]) << 24 | (255 ^ e[t + 1]) << 16 | (255 ^ e[t + 2]) << 8 | 255 ^ e[t + 3]) >>> 0),
												r = BigInt(((255 ^ e[t + 4]) << 24 | (255 ^ e[t + 5]) << 16 | (255 ^ e[t + 6]) << 8 | 255 ^ e[t + 7]) >>> 0);
											return n << BigInt(32) | r
										}(t, o), s = !0;
										else if (2 === e && 4 === n) c.frameId = function(e, t, n) {
											let r = 0;
											for (let i = 0; i < n; i += 1) r = r << 8 | 255 ^ e[t + i];
											return r >>> 0
										}(t, o, n), s = !0;
										else if (3 === e) {
											let e = new Uint8Array(n);
											for (let r = 0; r < n; r += 1) e[r] = 255 ^ t[o + r];
											c.userData = e, s = !0
										}
										o += n
									}
									return s ? {
										data: a,
										metadata: c
									} : {
										data: t
									}
								}(e.data);
								if (!n.metadata) return {};
								let r = n.data.buffer.slice(n.data.byteOffset, n.data.byteOffset + n.data.byteLength),
									i = function(e) {
										try {
											let t = e.getMetadata();
											if ("number" == typeof t.rtpTimestamp) return t.rtpTimestamp;
											if ("number" == typeof t.timestamp) return t.timestamp
										} catch (e) {}
										if ("number" == typeof e.timestamp) return e.timestamp
									}(e);
								return void 0 !== i && t ? {
									data: r,
									payload: {
										trackId: t,
										rtpTimestamp: i,
										ssrc: function(e) {
											try {
												let t = e.getMetadata();
												if ("number" == typeof t.synchronizationSource) return t.synchronizationSource
											} catch (e) {}
											return 0
										}(e),
										metadata: n.metadata
									}
								} : {
									data: r
								}
							}(e, i.trackId);
							if (t.data && (e.data = t.data), t.payload) {
								let e = {
									kind: "metadata",
									data: t.payload
								};
								postMessage(e)
							}
						}
					} catch (e) {}
					t.enqueue(e)
				}
			});
			e.pipeThrough(a).pipeTo(t).catch(() => {
				tw.delete(i.trackId)
			})
		}

		function tE(e, t, n) {
			if (!tk(n)) return void e.pipeTo(t).catch(() => {});
			let r = 0,
				i = new TransformStream({
					transform(e, t) {
						try {
							(null == n ? void 0 : n.frameId) && (r = 0xffffffff === r ? 1 : r + 1),
							function(e, t, n) {
								if (!tk(t) || 0 === e.data.byteLength) return;
								let r = (null == t ? void 0 : t.timestamp) ? BigInt(Date.now()) * BigInt(1e3) : BigInt(0),
									i = (null == t ? void 0 : t.frameId) ? n : 0,
									a = new Uint8Array(e.data),
									o = function(e, t, n) {
										var r;
										let i, a, o = t !== BigInt(0),
											s = 0 !== n;
										if (!o && !s) return e;
										let c = 10 * !!o + 6 * !!s + 5,
											l = new Uint8Array(e.length + c),
											u = 0;
										return l.set(e, u), u += e.length, o && (l[u++] = 254, l[u++] = 247, r = u, i = Number(t >> BigInt(32) & BigInt(0xffffffff)), a = Number(t & BigInt(0xffffffff)), l[r] = i >>> 24 ^ 255, l[r + 1] = i >>> 16 & 255 ^ 255, l[r + 2] = i >>> 8 & 255 ^ 255, l[r + 3] = 255 & i ^ 255, l[r + 4] = a >>> 24 ^ 255, l[r + 5] = a >>> 16 & 255 ^ 255, l[r + 6] = a >>> 8 & 255 ^ 255, l[r + 7] = 255 & a ^ 255, u += 8), s && (l[u++] = 253, l[u++] = 251, function(e, t, n) {
											for (let r = 3; r >= 0; r -= 1) e[t + (3 - r)] = n >> 8 * r & 255 ^ 255
										}(l, u, n), u += 4), l[u++] = 255 ^ c, l.set(tT, u), l
									}(a, r, i);
								o.byteLength !== a.byteLength && (e.data = o.buffer.slice(o.byteOffset, o.byteOffset + o.byteLength))
							}(e, n, r)
						} catch (e) {}
						t.enqueue(e)
					}
				});
			e.pipeThrough(i).pipeTo(t).catch(() => {})
		}
		onmessage = e => {
			let t = e.data;
			switch (t.kind) {
				case "init":
					postMessage({
						kind: "initAck"
					});
					break;
				case "decode":
					tS(t.data.readableStream, t.data.writableStream, t.data.trackId, t.data.hasPacketTrailer);
					break;
				case "encode":
					tE(t.data.readableStream, t.data.writableStream, t.data.packetTrailer);
					break;
				case "updateTrackId":
					var n, r, i;
					let a;
					n = t.data.oldTrackId, r = t.data.newTrackId, i = t.data.hasPacketTrailer, (a = tw.get(n)) && (a.trackId = r, a.hasPacketTrailer = i, tw.delete(n), tw.set(r, a))
			}
		}, self.RTCTransformEvent && (self.onrtctransform = e => {
			let t = e.transformer,
				n = t.options;
			"encode" === n.kind ? tE(t.readable, t.writable, n.packetTrailer) : tS(t.readable, t.writable, n.trackId, !0)
		})
	}, "function" == typeof define && define.amd ? void 0 !== (t = n(e.r, exports, module)) && e.v(t) : n(), e.s([])
}]);