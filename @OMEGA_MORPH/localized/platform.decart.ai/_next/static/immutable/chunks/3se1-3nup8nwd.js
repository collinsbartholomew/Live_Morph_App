(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 348637, e => {
	"use strict";
	let t, r, n, i = new TextEncoder,
		a = new TextDecoder,
		o = new TextDecoder("utf-8", {
			fatal: !0
		});

	function s(...e) {
		let t = new Uint8Array(e.reduce((e, {
				length: t
			}) => e + t, 0)),
			r = 0;
		for (let n of e) t.set(n, r), r += n.length;
		return t
	}

	function c(e, t, r) {
		if (t < 0 || t >= 0x100000000) throw RangeError(`value must be >= 0 and <= 4294967295. Received ${t}`);
		e.set([t >>> 24, t >>> 16, t >>> 8, 255 & t], r)
	}

	function u(e) {
		let t = Math.floor(e / 0x100000000),
			r = new Uint8Array(8);
		return c(r, t, 0), c(r, e % 0x100000000, 4), r
	}

	function l(e) {
		let t = new Uint8Array(4);
		return c(t, e), t
	}
	let d = /[^\x00-\x7f]/;

	function p(e) {
		if ("string" == typeof e && e.length >= 128) {
			if (d.test(e)) throw TypeError("non-ASCII string encountered in encode()");
			return i.encode(e)
		}
		let t = new Uint8Array(e.length);
		for (let r = 0; r < e.length; r++) {
			let n = e.charCodeAt(r);
			if (n > 127) throw TypeError("non-ASCII string encountered in encode()");
			t[r] = n
		}
		return t
	}

	function y(e, t = !1) {
		if (Uint8Array.prototype.toBase64) return e.toBase64({
			alphabet: t ? "base64url" : "base64",
			omitPadding: t
		});
		let r = [];
		for (let t = 0; t < e.length; t += 32768) r.push(String.fromCharCode.apply(null, e.subarray(t, t + 32768)));
		let n = btoa(r.join(""));
		return t ? n.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_") : n
	}

	function h(e, t = !1) {
		if (Uint8Array.fromBase64) return Uint8Array.fromBase64(e, {
			alphabet: t ? "base64url" : "base64"
		});
		if (t) {
			if (e.includes("+") || e.includes("/")) throw TypeError("Invalid base64url");
			e = e.replace(/-/g, "+").replace(/_/g, "/")
		}
		let r = atob(e),
			n = new Uint8Array(r.length);
		for (let e = 0; e < r.length; e++) n[e] = r.charCodeAt(e);
		return n
	}
	async function f(e, t) {
		let r = `SHA-${e.slice(-3)}`;
		return new Uint8Array(await crypto.subtle.digest(r, t))
	}
	class w extends Error {
		static code = "ERR_JOSE_GENERIC";
		code = "ERR_JOSE_GENERIC";
		constructor(e, t) {
			super(e, t), this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor)
		}
	}
	class m extends w {
		static code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
		code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
		claim;
		reason;
		payload;
		constructor(e, t, r = "unspecified", n = "unspecified") {
			super(e, {
				cause: {
					claim: r,
					reason: n,
					payload: t
				}
			}), this.claim = r, this.reason = n, this.payload = t
		}
	}
	class g extends w {
		static code = "ERR_JWT_EXPIRED";
		code = "ERR_JWT_EXPIRED";
		claim;
		reason;
		payload;
		constructor(e, t, r = "unspecified", n = "unspecified") {
			super(e, {
				cause: {
					claim: r,
					reason: n,
					payload: t
				}
			}), this.claim = r, this.reason = n, this.payload = t
		}
	}
	class b extends w {
		static code = "ERR_JOSE_ALG_NOT_ALLOWED";
		code = "ERR_JOSE_ALG_NOT_ALLOWED"
	}
	class v extends w {
		static code = "ERR_JOSE_NOT_SUPPORTED";
		code = "ERR_JOSE_NOT_SUPPORTED"
	}
	class E extends w {
		static code = "ERR_JWE_DECRYPTION_FAILED";
		code = "ERR_JWE_DECRYPTION_FAILED";
		constructor(e = "decryption operation failed", t) {
			super(e, t)
		}
	}
	class A extends w {
		static code = "ERR_JWE_INVALID";
		code = "ERR_JWE_INVALID"
	}
	class S extends w {
		static code = "ERR_JWS_INVALID";
		code = "ERR_JWS_INVALID"
	}
	class J extends w {
		static code = "ERR_JWT_INVALID";
		code = "ERR_JWT_INVALID"
	}
	class K extends w {
		static code = "ERR_JWK_INVALID";
		code = "ERR_JWK_INVALID"
	}
	class W extends w {
		static code = "ERR_JWKS_INVALID";
		code = "ERR_JWKS_INVALID"
	}
	class k extends w {
		static code = "ERR_JWKS_NO_MATCHING_KEY";
		code = "ERR_JWKS_NO_MATCHING_KEY";
		constructor(e = "no applicable key found in the JSON Web Key Set", t) {
			super(e, t)
		}
	}
	class P extends w {
		[Symbol.asyncIterator] = async function*() {};
		static code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
		code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
		constructor(e = "multiple matching keys found in the JSON Web Key Set", t) {
			super(e, t)
		}
	}
	class T extends w {
		static code = "ERR_JWKS_TIMEOUT";
		code = "ERR_JWKS_TIMEOUT";
		constructor(e = "request timed out", t) {
			super(e, t)
		}
	}
	class C extends w {
		static code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
		code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
		constructor(e = "signature verification failed", t) {
			super(e, t)
		}
	}

	function H(e) {
		try {
			return h("string" == typeof e ? e : a.decode(e), !0)
		} catch (e) {
			throw TypeError("The input to be decoded is not correctly encoded.", {
				cause: e
			})
		}
	}

	function I(e) {
		return y("string" == typeof e ? i.encode(e) : e, !0)
	}

	function U(e, t) {
		if (!(e instanceof Uint8Array)) throw TypeError(`${t} must be an instance of Uint8Array`)
	}

	function _(e) {
		if ("object" != typeof e || null === e || "[object Object]" !== Object.prototype.toString.call(e)) return !1;
		let t = Object.getPrototypeOf(e);
		return null === t || null === Object.getPrototypeOf(t)
	}

	function O(e) {
		return _(e) && Array.isArray(e.keys) && Array.from(e.keys).every(_)
	}

	function R(...e) {
		let t = new Set;
		for (let r of e)
			if (r)
				for (let e of Object.keys(r)) {
					if (t.has(e)) return !1;
					t.add(e)
				}
		return !0
	}

	function x(e, t) {
		if (void 0 !== e) throw TypeError(`${t} can only be called once`)
	}

	function N(e, t, r) {
		try {
			return H(e)
		} catch (e) {
			throw new r(`Failed to base64url decode the ${t}`, {
				cause: e
			})
		}
	}

	function D(e, t, r) {
		try {
			return p(e)
		} catch (e) {
			throw new r(`The ${t} is not a valid base64url string`, {
				cause: e
			})
		}
	}

	function $(e, t, r) {
		let n;
		try {
			n = JSON.parse(o.decode(H(e)))
		} catch (e) {
			throw new t(r, {
				cause: e
			})
		}
		if (!_(n)) throw new t(r);
		return n
	}
	e.s(["JOSEAlgNotAllowed", 0, b, "JOSEError", 0, w, "JOSENotSupported", 0, v, "JWEDecryptionFailed", 0, E, "JWEInvalid", 0, A, "JWKInvalid", 0, K, "JWKSInvalid", 0, W, "JWKSMultipleMatchingKeys", 0, P, "JWKSNoMatchingKey", 0, k, "JWKSTimeout", 0, T, "JWSInvalid", 0, S, "JWSSignatureVerificationFailed", 0, C, "JWTClaimValidationFailed", 0, m, "JWTExpired", 0, g, "JWTInvalid", 0, J], 409978), e.s(["decode", 0, H, "encode", 0, I], 98580);
	let j = {
			__proto__: null,
			b64: !0
		},
		M = {
			__proto__: null
		};

	function B(e, t) {
		if (void 0 !== t && (!Array.isArray(t) || t.some(e => "string" != typeof e))) throw TypeError(`"${e}" option must be an array of strings`);
		return void 0 === t ? void 0 : new Set(t)
	}

	function L(e, t) {
		let {
			crit: r
		} = t ?? {};
		if (Array.isArray(r) && new Set(r).size !== r.length) throw new e('"crit" (Critical) Header Parameter MUST NOT contain duplicate values')
	}

	function V(e, t, r, n, i) {
		if (void 0 !== i.crit && n?.crit === void 0) throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
		if (!n || void 0 === n.crit) return [];
		if (!Array.isArray(n.crit) || 0 === n.crit.length || n.crit.some(e => "string" != typeof e || 0 === e.length)) throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
		let a = void 0 === r ? t : {
			__proto__: null,
			...r,
			...t
		};
		for (let t of n.crit) {
			if (!(t in a)) throw new v(`Extension Header Parameter "${t}" is not recognized`);
			if (!Object.hasOwn(i, t) || void 0 === i[t]) throw new e(`Extension Header Parameter "${t}" is missing`);
			if (a[t] && (!Object.hasOwn(n, t) || void 0 === n[t])) throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`)
		}
		return n.crit
	}

	function G(e, t) {
		if (t.includes("b64")) {
			let t = e.b64;
			if ("boolean" != typeof t) throw new S('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
			return t
		}
		return !0
	}

	function F(e, t) {
		let r, n;
		try {
			r = JSON.stringify(t), n = JSON.parse(r)
		} catch (t) {
			throw new e("JOSE Header is not valid JSON", {
				cause: t
			})
		}
		if (!_(n)) throw new e("JOSE Header is not a JSON object");
		return [n, r]
	}
	async function z(e, r, n) {
		let i, a, {
				alg: o,
				secret: s
			} = e,
			c = "decrypt" === n || "sign" === n;
		if (s && r instanceof Uint8Array) return r;
		if (_(r)) {
			if ("string" != typeof(i = ec(r)).kty) throw er(o, r, s);
			if (!(s ? "oct" === i.kty && "string" == typeof i.k : "oct" !== i.kty && (c ? "AKP" === i.kty && "string" == typeof i.priv || "string" == typeof i.d : void 0 === i.d && void 0 === i.priv))) throw TypeError(s ? 'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present' : `JSON Web Key for this operation must be a ${c?"private":"public"} JWK`);
			if (((e, t, r) => {
					let {
						alg: n
					} = e;
					if (void 0 !== t.use) {
						let e = "sign" === r || "verify" === r ? "sig" : "enc";
						if (t.use !== e) throw TypeError(`Invalid key for this operation, its "use" must be "${e}" when present`)
					}
					if (void 0 !== t.alg && t.alg !== n) throw TypeError(`Invalid key for this operation, its "alg" must be "${n}" when present`);
					if (Array.isArray(t.key_ops)) {
						let n = "encrypt" === r || "decrypt" === r ? e.ops?.[+("encrypt" !== r)] : r;
						if (n && !t.key_ops.includes(n)) throw TypeError(`Invalid key for this operation, its "key_ops" must include "${n}" when present`)
					}
				})(e, i, n), "oct" === i.kty) return H(i.k);
			if (!Object.isFrozen(r)) {
				let {
					key_ops: e
				} = r;
				Array.isArray(e) && Object.freeze(e), Object.freeze(r)
			}
		} else {
			if (!Z(r)) throw er(o, r, s);
			let e = s ? "secret" : c ? "private" : "public";
			if (r.type !== e && (s || ["secret", "public", "private"].includes(r.type))) throw TypeError(`${r[Symbol.toStringTag]} instances must be of type "${e}" for the ${o} algorithm`);
			if (q(r)) return r;
			if ("secret" === (a = r).type) return a.export()
		}
		let u = (t ||= new WeakMap).get(r);
		if (u?.[o]) return u[o];
		if (u || t.set(r, u = {}), a && "function" == typeof a.toCryptoKey) {
			let t = "public" === a.type,
				r = X[a.asymmetricKeyDetails?.namedCurve],
				n = e.resolve?.({
					crv: r,
					asymmetricKeyType: a.asymmetricKeyType
				}) ?? e.subtle;
			return u[o] = a.toCryptoKey(n, t, e.usages[+!t])
		}
		return (i ??= a.export({
			format: "jwk"
		})).alg = o, u[o] = await el(e, i)
	}
	let X = {
		__proto__: null,
		prime256v1: "P-256",
		secp384r1: "P-384",
		secp521r1: "P-521"
	};

	function Y(e) {
		if (!q(e)) throw Error("CryptoKey instance expected")
	}
	let q = e => {
			if (e?.[Symbol.toStringTag] === "CryptoKey") return !0;
			try {
				return e instanceof CryptoKey
			} catch {
				return !1
			}
		},
		Q = e => e?.[Symbol.toStringTag] === "KeyObject",
		Z = e => q(e) || Q(e);

	function ee(e, t, ...r) {
		if (r.length > 2) {
			let t = r.pop();
			e += `one of type ${r.join(", ")}, or ${t}.`
		} else 2 === r.length ? e += `one of type ${r[0]} or ${r[1]}.` : e += `of type ${r[0]}.`;
		return null == t ? e += ` Received ${t}` : "function" == typeof t && t.name ? e += ` Received function ${t.name}` : "object" == typeof t && null != t && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e
	}
	let et = (e, ...t) => ee("Key must be ", e, ...t);

	function er(e, t, r) {
		let n = ["CryptoKey", "KeyObject", "JSON Web Key"];
		return r && n.push("Uint8Array"), TypeError(ee(`Key for the ${e} algorithm must be `, t, ...n))
	}
	let en = (e, t = "algorithm.name") => TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);

	function ei(e, t) {
		if (t && !e.usages.includes(t)) throw TypeError(`CryptoKey does not support this operation, its usages must include ${t}.`)
	}

	function ea(e, t) {
		let {
			modulusLength: r
		} = t.algorithm;
		if ("number" != typeof r || r < 2048) throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`)
	}

	function eo(e, t, r) {
		let n = e.algorithm;
		if (n.name !== t.name) throw en(t.name);
		if (t.hash && n.hash?.name !== t.hash) throw en(t.hash, "algorithm.hash");
		if (t.namedCurve && n.namedCurve !== t.namedCurve) throw en(t.namedCurve, "algorithm.namedCurve");
		if (void 0 !== t.length && n.length !== t.length) throw en(t.length, "algorithm.length");
		ei(e, r)
	}

	function es(e) {
		return {
			__proto__: null,
			...e
		}
	}

	function ec(e) {
		let t = es(e);
		if (void 0 !== t.ext && "boolean" != typeof t.ext) throw TypeError('"ext" (Extractable) Parameter must be a boolean');
		if (void 0 !== t.key_ops) {
			let e = t.key_ops,
				r = Array.isArray(e) ? [...e] : void 0;
			if (!r || r.some(e => "string" != typeof e) || new Set(r).size !== r.length) throw TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');
			t.key_ops = r
		}
		return t
	}

	function eu(e) {
		if (void 0 !== e && "boolean" != typeof e) throw TypeError('"extractable" option must be a boolean');
		return e
	}
	async function el(e, t, r) {
		if (!e.kty.includes(t.kty)) throw new v('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
		let n = e.resolve?.({
				kty: t.kty,
				crv: t.crv
			}) ?? e.subtle,
			i = !!(t.d || t.priv),
			a = {
				...t,
				ext: r ?? t.ext
			};
		return "AKP" !== a.kty && delete a.alg, delete a.use, crypto.subtle.importKey("jwk", a, n, a.ext ?? !i, t.key_ops ?? e.usages[+!!i])
	}
	async function ed(e, t, r, n = !1) {
		return e instanceof Uint8Array && (e = await crypto.subtle.importKey("raw", e, t, n, [r])), eo(e, t, r), e
	}
	let ep = e => crypto.getRandomValues(new Uint8Array(e.cekBits >> 3));

	function ey(e, t) {
		let r = e.byteLength << 3;
		if (r !== t) throw new A(`Invalid Content Encryption Key length. Expected ${t} bits, got ${r} bits`)
	}

	function eh(e, t) {
		if (t.length << 3 !== e.ivBits) throw new A("Invalid Initialization Vector length")
	}
	async function ef(e, t, r) {
		if (!(t instanceof Uint8Array)) throw TypeError(et(t, "Uint8Array"));
		let n = e.cekBits >> 1;
		return [await crypto.subtle.importKey("raw", t.subarray(n >> 3), "AES-CBC", !1, [r]), await crypto.subtle.importKey("raw", t.subarray(0, n >> 3), {
			hash: `SHA-${n<<1}`,
			name: "HMAC"
		}, !1, ["sign"]), n]
	}
	async function ew(e, t, r) {
		return new Uint8Array((await crypto.subtle.sign("HMAC", e, t)).slice(0, r >> 3))
	}
	async function em(e, t, r, n, i) {
		let [a, o, c] = await ef(e, r, "encrypt"), l = new Uint8Array(await crypto.subtle.encrypt({
			iv: n,
			name: "AES-CBC"
		}, a, t)), d = u(8 * i.length), p = s(i, n, l, d);
		return {
			ciphertext: l,
			tag: await ew(o, p, c),
			iv: n
		}
	}
	async function eg(e, t) {
		let r = {
				name: "HMAC",
				hash: "SHA-256"
			},
			n = await crypto.subtle.generateKey(r, !1, ["sign", "verify"]),
			i = await crypto.subtle.sign(r, n, e);
		return crypto.subtle.verify(r, n, i, t)
	}
	async function eb(e, t, r, n, i, a) {
		let [o, c, l] = await ef(e, t, "decrypt"), d = u(8 * a.length), p = s(a, n, r, d), y = await ew(c, p, l);
		try {
			if (await eg(i, y)) return new Uint8Array(await crypto.subtle.decrypt({
				iv: n,
				name: "AES-CBC"
			}, o, r))
		} catch {}
		throw new E
	}
	async function ev(e, t, r, n, i) {
		if (!q(r) && !(r instanceof Uint8Array)) throw TypeError(et(r, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
		if (n ? eh(e, n) : n = crypto.getRandomValues(new Uint8Array(e.ivBits >> 3)), r instanceof Uint8Array && ey(r, e.cekBits), e.cbc) return em(e, t, r, n, i);
		let a = await ed(r, e.subtle, "encrypt"),
			o = new Uint8Array(await crypto.subtle.encrypt({
				additionalData: i,
				iv: n,
				name: "AES-GCM",
				tagLength: 128
			}, a, t));
		return {
			ciphertext: o.subarray(0, -16),
			tag: o.subarray(-16),
			iv: n
		}
	}
	async function eE(e, t, r, n, i, a) {
		if (!q(t) && !(t instanceof Uint8Array)) throw TypeError(et(t, "CryptoKey", "KeyObject", "Uint8Array", "JSON Web Key"));
		if (!n) throw new A("JWE Initialization Vector missing");
		if (!i) throw new A("JWE Authentication Tag missing");
		if (!e.cbc && 16 !== i.length) throw new A("Invalid Authentication Tag length");
		if (eh(e, n), t instanceof Uint8Array && ey(t, e.cekBits), e.cbc) return eb(e, t, r, n, i, a);
		let o = await ed(t, e.subtle, "decrypt");
		try {
			return new Uint8Array(await crypto.subtle.decrypt({
				additionalData: a,
				iv: n,
				name: "AES-GCM",
				tagLength: 128
			}, o, s(r, i)))
		} catch {
			throw new E
		}
	}

	function eA(e) {
		let t = {
			__proto__: null
		};
		for (let r in e) t[r] = {
			...e[r],
			alg: r
		};
		return t
	}
	let eS = [
			["encrypt", "wrapKey"],
			["decrypt", "unwrapKey"]
		],
		eJ = [
			[],
			["deriveBits"]
		],
		eK = [
			[],
			[]
		];

	function eW(e) {
		return {
			kty: ["RSA"],
			mode: "key-encryption",
			subtle: {
				name: "RSA-OAEP",
				hash: `SHA-${e}`
			},
			usages: eS,
			ops: ["wrapKey", "unwrapKey"]
		}
	}

	function ek(e) {
		return {
			kty: ["EC", "OKP"],
			mode: e,
			subtle: {
				name: "ECDH"
			},
			resolve: ({
				kty: e,
				crv: t,
				asymmetricKeyType: r
			}) => {
				if ("X25519" === t || "x25519" === r) return {
					name: "X25519"
				};
				if ("OKP" === e) throw new v('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
				return {
					name: "ECDH",
					namedCurve: t
				}
			},
			usages: eJ,
			ops: [void 0, "deriveBits"]
		}
	}

	function eP(e, t = !1) {
		return {
			kty: ["oct"],
			mode: "key-wrapping",
			secret: !0,
			subtle: {
				name: t ? "AES-GCM" : "AES-KW",
				length: e
			},
			usages: eK,
			ops: t ? ["encrypt", "decrypt"] : ["wrapKey", "unwrapKey"]
		}
	}

	function eT() {
		return {
			kty: ["oct"],
			mode: "key-wrapping",
			secret: !0,
			subtle: {
				name: "PBKDF2"
			},
			usages: eK,
			ops: ["deriveBits", "deriveBits"]
		}
	}
	let eC = eA({
			dir: {
				kty: ["oct"],
				mode: "direct-encryption",
				secret: !0,
				subtle: {
					name: "AES-GCM"
				},
				usages: eK,
				ops: ["encrypt", "decrypt"]
			},
			"RSA-OAEP": eW(1),
			"RSA-OAEP-256": eW(256),
			"RSA-OAEP-384": eW(384),
			"RSA-OAEP-512": eW(512),
			"ECDH-ES": ek("direct-key-agreement"),
			"ECDH-ES+A128KW": ek("key-agreement-with-key-wrapping"),
			"ECDH-ES+A192KW": ek("key-agreement-with-key-wrapping"),
			"ECDH-ES+A256KW": ek("key-agreement-with-key-wrapping"),
			A128KW: eP(128),
			A192KW: eP(192),
			A256KW: eP(256),
			A128GCMKW: eP(128, !0),
			A192GCMKW: eP(192, !0),
			A256GCMKW: eP(256, !0),
			"PBES2-HS256+A128KW": eT(),
			"PBES2-HS384+A192KW": eT(),
			"PBES2-HS512+A256KW": eT()
		}),
		eH = ["encrypt", "decrypt"];

	function eI(e, t = !1) {
		return {
			kty: ["oct"],
			secret: !0,
			subtle: {
				name: t ? "AES-CBC" : "AES-GCM",
				length: e
			},
			usages: eK,
			ops: eH,
			cekBits: e,
			ivBits: t ? 128 : 96,
			cbc: t
		}
	}
	let eU = eA({
		A128GCM: eI(128),
		A192GCM: eI(192),
		A256GCM: eI(256),
		"A128CBC-HS256": eI(256, !0),
		"A192CBC-HS384": eI(384, !0),
		"A256CBC-HS512": eI(512, !0)
	});

	function e_(e, t) {
		throw new v(`Invalid or unsupported "${e}" (JWE ${t}) header value`)
	}

	function eO(e) {
		return ("string" == typeof e ? eC[e] : void 0) ?? e_("alg", "Algorithm")
	}

	function eR(e) {
		return "key-wrapping" === e.mode || "key-encryption" === e.mode || "key-agreement-with-key-wrapping" === e.mode
	}

	function ex(e) {
		return ("string" == typeof e ? eU[e] : void 0) ?? e_("enc", "Encryption Algorithm")
	}

	function eN(e, t) {
		if ("ECDH" !== e.algorithm.name && "X25519" !== e.algorithm.name) throw TypeError("CryptoKey does not support this operation, its algorithm.name must be ECDH or X25519");
		ei(e, t)
	}
	async function eD(e, t, r) {
		let n = await ed(t, eO(e).subtle, "wrapKey", !0),
			i = await crypto.subtle.importKey("raw", r, {
				hash: "SHA-256",
				name: "HMAC"
			}, !0, ["sign"]);
		return new Uint8Array(await crypto.subtle.wrapKey("raw", i, n, "AES-KW"))
	}
	async function e$(e, t, r) {
		let n = await ed(t, eO(e).subtle, "unwrapKey", !0),
			i = await crypto.subtle.unwrapKey("raw", r, n, "AES-KW", {
				hash: "SHA-256",
				name: "HMAC"
			}, !0, ["sign"]);
		return new Uint8Array(await crypto.subtle.exportKey("raw", i))
	}

	function ej(e, t, r) {
		eo(t, eO(e).subtle, r), ea(e, t)
	}
	async function eM(e, t, r, n) {
		if (!(e instanceof Uint8Array) || e.length < 8) throw new A("PBES2 Salt Input must be 8 or more octets");
		if (!Number.isSafeInteger(r) || 1 !== Math.sign(r)) throw new A("PBES2 Count Input must be a positive integer");
		let i = s(p(t), Uint8Array.of(0), e),
			a = parseInt(t.slice(13, 16), 10),
			o = {
				hash: `SHA-${t.slice(8,11)}`,
				iterations: r,
				name: "PBKDF2",
				salt: i
			},
			c = await ed(n, eO(t).subtle, "deriveBits");
		return new Uint8Array(await crypto.subtle.deriveBits(o, c, a))
	}

	function eB(e) {
		return s(l(e.length), e)
	}
	async function eL(e, t, r) {
		let n = t >> 3,
			i = Math.ceil(n / 32),
			a = new Uint8Array(32 * i);
		for (let t = 1; t <= i; t++) {
			let n = await f("sha256", s(l(t), e, r));
			a.set(n, (t - 1) * 32)
		}
		return a.slice(0, n)
	}
	async function eV(e, t, r, n, i = new Uint8Array, a = new Uint8Array) {
		eN(e), eN(t, "deriveBits");
		let o = s(eB(p(r)), eB(i), eB(a), l(n));
		return eL(new Uint8Array(await crypto.subtle.deriveBits({
			name: e.algorithm.name,
			public: e
		}, t, "X25519" === e.algorithm.name ? 256 : Math.ceil(parseInt(e.algorithm.namedCurve.slice(-3), 10) / 8) << 3)), n, o)
	}

	function eG(e) {
		Y(e);
		let t = e.algorithm.namedCurve;
		if ("P-256" !== t && "P-384" !== t && "P-521" !== t && "X25519" !== e.algorithm.name) throw new v("ECDH with the provided key is not allowed or not supported by your javascript runtime")
	}

	function eF(e, t) {
		let r = e[t];
		if (void 0 !== r) {
			if ("string" != typeof r) throw new A(`JOSE Header "${t}" (Agreement Party${"apu"===t?"U":"V"}Info) invalid`);
			return N(r, t, A)
		}
	}

	function ez(e, t) {
		if (void 0 !== e && void 0 !== t && e.byteLength === t.byteLength) {
			for (let r = 0; r < e.byteLength; r++)
				if (e[r] !== t[r]) return;
			throw new A('JOSE Header "apu" and "apv" values must be distinct')
		}
	}

	function eX(e) {
		if (void 0 !== e) throw new A("Encountered unexpected JWE Encrypted Key")
	}
	async function eY(e, t, r, n, i, a) {
		let {
			alg: o
		} = e, s = e.mode;
		if ("direct-encryption" === s) return eX(n), r;
		let c = "direct-key-agreement" === s;
		switch (c ? eX(n) : function(e) {
				if (void 0 === e) throw new A("JWE Encrypted Key missing")
			}(n), e.subtle.name) {
			case "ECDH": {
				let {
					epk: n
				} = i;
				if (!_(n) || ["d", "k", "p", "q", "dp", "dq", "qi", "oth", "priv"].some(e => Object.hasOwn(n, e))) throw new A('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
				eG(r);
				let a = await el(e, n),
					s = eF(i, "apu"),
					u = eF(i, "apv");
				ez(s, u);
				let l = await eV(a, r, c ? t.alg : o, c ? t.cekBits : parseInt(o.slice(-5, -2), 10), s, u);
				if (c) return l;
				r = l;
				break
			}
			case "RSA-OAEP":
				return Y(r), ej(o, r, "decrypt"), new Uint8Array(await crypto.subtle.decrypt("RSA-OAEP", r, n));
			case "PBKDF2": {
				if ("number" != typeof i.p2c) throw new A('JOSE Header "p2c" (PBES2 Count) missing or invalid');
				if (i.p2c > (a ?? 1e4)) throw new A('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
				if ("string" != typeof i.p2s) throw new A('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
				let e = N(i.p2s, "p2s", A);
				r = await eM(e, o, i.p2c, r);
				break
			}
			case "AES-GCM": {
				if ("string" != typeof i.iv) throw new A('JOSE Header "iv" (Initialization Vector) missing or invalid');
				if ("string" != typeof i.tag) throw new A('JOSE Header "tag" (Authentication Tag) missing or invalid');
				let e = N(i.iv, "iv", A),
					t = N(i.tag, "tag", A);
				if (12 !== e.byteLength) throw new A("Invalid Initialization Vector length");
				if (16 !== t.byteLength) throw new A("Invalid Authentication Tag length");
				return eE(ex(o.slice(0, -2)), r, n, e, t, new Uint8Array)
			}
		}
		return e$(o.slice(-6), r, n)
	}
	async function eq(e, t, r, n, i, a = {}) {
		let o, s, {
				alg: c,
				mode: u
			} = e,
			l = eR(e);
		if (void 0 !== i && !l) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${c}`);
		let d = await z("direct-encryption" === u ? t : e, r, "encrypt");
		if ("direct-encryption" === u) return [d, void 0, void 0];
		let p = l ? i ?? ep(t) : void 0;
		switch (p && ey(p, t.cekBits), e.subtle.name) {
			case "ECDH": {
				let r;
				eG(d);
				let {
					apu: i,
					apv: o
				} = a;
				void 0 !== i && U(i, '"apu"'), void 0 !== o && U(o, '"apv"');
				let l = i ?? eF(n, "apu"),
					p = o ?? eF(n, "apv");
				ez(l, p), r = void 0 !== a.epk ? await z(e, a.epk, "decrypt") : (await crypto.subtle.generateKey(d.algorithm, !0, ["deriveBits"])).privateKey;
				let y = crypto.subtle,
					h = r;
				if (!h.extractable) {
					if ("function" != typeof y.getPublicKey) throw TypeError('CryptoKey for "epk" must be extractable');
					h = await y.getPublicKey(r, [])
				}
				let {
					x: f,
					y: w,
					crv: m,
					kty: g
				} = await y.exportKey("jwk", h), b = "direct-key-agreement" === u, v = await eV(d, r, b ? t.alg : c, b ? t.cekBits : parseInt(c.slice(-5, -2), 10), l, p), E = {
					x: f,
					crv: m,
					kty: g
				};
				if ("EC" === g && (E.y = w), s = {
						epk: E
					}, void 0 !== i && (s.apu = I(i)), void 0 !== o && (s.apv = I(o)), b) return [v, void 0, s];
				d = v;
				break
			}
			case "RSA-OAEP":
				Y(d), ej(c, d, "encrypt"), o = new Uint8Array(await crypto.subtle.encrypt("RSA-OAEP", d, p));
				break;
			case "PBKDF2": {
				let {
					p2c: e = 2048,
					p2s: t = crypto.getRandomValues(new Uint8Array(16))
				} = a;
				d = await eM(t, c, e, d), s = {
					p2c: e,
					p2s: I(t)
				};
				break
			}
			case "AES-GCM": {
				let e = void 0 === a.iv ? crypto.getRandomValues(new Uint8Array(12)) : a.iv;
				if (!(e instanceof Uint8Array)) throw TypeError('"iv" must be an instance of Uint8Array');
				let t = await ev(ex(c.slice(0, -2)), p, d, e, new Uint8Array);
				o = t.ciphertext, s = {
					iv: I(t.iv),
					tag: I(t.tag)
				}
			}
		}
		if (!((o ??= await eD(c.slice(-6), d, p)) instanceof Uint8Array) || !o.byteLength) throw TypeError("JWE key management algorithm did not produce an Encrypted Key");
		return [p, o, s]
	}

	function eQ(e, t) {
		if (void 0 !== e.zip && "DEF" !== e.zip) throw new v('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value.');
		if (void 0 !== e.zip && !t?.zip) throw new A('JWE "zip" (Compression Algorithm) Header Parameter MUST be in a protected header.')
	}

	function eZ(e) {
		if (typeof globalThis[e] > "u") throw new v(`JWE "zip" (Compression Algorithm) Header Parameter requires the ${e} API.`)
	}
	async function e0(e, t, r = 1 / 0) {
		let n = e.writable.getWriter();
		n.write(t).catch(() => {}), n.close().catch(() => {});
		let i = [],
			a = 0,
			o = e.readable.getReader();
		for (;;) {
			let {
				value: e,
				done: t
			} = await o.read();
			if (t) break;
			if (i.push(e), a += e.byteLength, 1 / 0 !== r && a > r) throw await o.cancel().catch(() => {}), new A("Decompressed plaintext exceeded the configured limit")
		}
		return s(...i)
	}
	async function e2(e) {
		return eZ("CompressionStream"), e0(new CompressionStream("deflate-raw"), e)
	}
	async function e1(e, t) {
		return eZ("DecompressionStream"), e0(new DecompressionStream("deflate-raw"), e, t)
	}

	function e8(e) {
		let {
			aad: t,
			ciphertext: r,
			iv: n,
			protected: i,
			tag: a,
			unprotected: o
		} = e;
		if (void 0 !== n && ("string" != typeof n || !n)) throw new A("JWE Initialization Vector incorrect type");
		if ("string" != typeof r) throw new A("JWE Ciphertext missing or incorrect type");
		if (void 0 !== a && ("string" != typeof a || !a)) throw new A("JWE Authentication Tag incorrect type");
		if (void 0 !== i && "string" != typeof i) throw new A("JWE Protected Header incorrect type");
		if (void 0 !== t && ("string" != typeof t || !t)) throw new A("JWE AAD incorrect type");
		if (void 0 !== o && !_(o)) throw new A("JWE Shared Unprotected Header incorrect type");
		return {
			aad: t,
			ciphertext: r,
			iv: n,
			protected: i,
			tag: a,
			unprotected: void 0 === o ? void 0 : {
				...o
			}
		}
	}

	function e5(e) {
		let t, r;
		try {
			let {
				header: n
			} = e;
			if (_(n)) {
				r = n.alg;
				let e = Object.keys(n);
				e.includes("alg") || (r = void 0), t = Object.fromEntries(e.map(e => [e, "alg" === e ? r : n[e]]))
			} else t = n;
			let {
				encrypted_key: i
			} = e;
			return [{
				encrypted_key: i,
				header: t
			}, r]
		} catch (e) {
			return [void 0, r, e]
		}
	}

	function e6(e) {
		let {
			encrypted_key: t,
			header: r
		} = e;
		if (void 0 !== t && "string" != typeof t) throw new A("JWE Encrypted Key incorrect type");
		if (void 0 !== r && !_(r)) throw new A("JWE Per-Recipient Unprotected Header incorrect type");
		if (void 0 === e.protected && void 0 === r && void 0 === e.unprotected) throw new A("JOSE Header missing")
	}

	function e4(e) {
		let t, {
			protected: r,
			ciphertext: n,
			iv: i,
			tag: a,
			aad: o
		} = e;
		return void 0 !== r && (t = $(r, A, "JWE Protected Header is invalid")), [t, N(n, "ciphertext", A), void 0 !== i ? N(i, "iv", A) : void 0, void 0 !== a ? N(a, "tag", A) : void 0, D((r ?? "") + (void 0 !== o ? `.${o}` : ""), "aad", A)]
	}

	function e3(e) {
		let t = e && B("keyManagementAlgorithms", e.keyManagementAlgorithms),
			r = e && B("contentEncryptionAlgorithms", e.contentEncryptionAlgorithms),
			{
				crit: n,
				maxPBES2Count: i,
				maxDecompressedLength: a
			} = e ?? {};
		if (void 0 !== i && 1 / 0 !== i && (!Number.isSafeInteger(i) || i < 1)) throw TypeError("maxPBES2Count must be a positive safe integer or Infinity");
		let o = a ?? 25e4;
		if (0 !== o && 1 / 0 !== o && (!Number.isSafeInteger(o) || o < 1)) throw TypeError("maxDecompressedLength must be 0, a positive safe integer, or Infinity");
		return [t, r, n, i, a]
	}
	async function e9(e, t, r, n = e4(e)) {
		let i, a, o, s, [c, u, l, d, p] = n,
			{
				header: y,
				unprotected: h,
				aad: f
			} = e;
		if (void 0 !== y || void 0 !== h) {
			if (!R(c, y, h)) throw new A("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
			i = {
				...c,
				...y,
				...h
			}
		} else i = c ?? {};
		let [w, m, g, E, S] = t, {
			encrypted_key: J
		} = e;
		V(A, M, g, c, i), eQ(i, c);
		let {
			alg: K,
			enc: W
		} = i;
		if ("string" != typeof K || !K) throw new A("missing JWE Algorithm (alg) in JWE Header");
		let k = eC[K];
		if ("" === J && (!k || !eR(k))) throw new A("JWE Encrypted Key incorrect type");
		let P = k?.mode === "integrated-encryption";
		if (!P && ("string" != typeof W || !W)) throw new A("missing JWE Encryption Algorithm (enc) in JWE Header");
		if (w && !w.has(K) || !w && K.startsWith("PBES2")) throw new b('"alg" (Algorithm) Header Parameter value not allowed');
		if (P) {
			if (void 0 !== W) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
			if (l?.byteLength) throw new A("JWE Initialization Vector must be empty for integrated encryption");
			if (d?.byteLength) throw new A("JWE Authentication Tag must be empty for integrated encryption")
		} else {
			if (m && !m.has(W)) throw new b('"enc" (Encryption Algorithm) Header Parameter value not allowed');
			a = ex(W)
		}
		if (void 0 !== J) try {
			o = N(J, "encrypted_key", A)
		} catch (e) {
			if (!k || !eR(k)) throw e;
			o = new Uint8Array
		}
		let T = !1;
		"function" == typeof r && (r = await r(c, e), T = !0);
		let C = k ?? eO(K);
		eR(C) && void 0 === o && (o = new Uint8Array);
		let H = await z("direct-encryption" === C.mode ? a : C, r, "decrypt");
		if ("integrated-encryption" === C.mode) s = await C.decrypt(H, o, u, p, c, i);
		else {
			let e, t = a;
			try {
				e = await eY(C, t, H, o, i, E), eR(C) && e instanceof Uint8Array && e.byteLength << 3 !== t.cekBits && (e = ep(t))
			} catch (r) {
				if (r instanceof TypeError || r instanceof A || r instanceof v) throw r;
				e = ep(t)
			}
			s = await eE(t, e, u, l, d, p)
		}
		if ("DEF" === i.zip) {
			let e = S ?? 25e4;
			if (0 === e) throw new v('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
			s = await e1(s, e).catch(e => {
				throw e instanceof A ? e : new A("Failed to decompress plaintext", {
					cause: e
				})
			})
		}
		return {
			plaintext: s,
			...c && {
				protectedHeader: c
			},
			...void 0 !== f && {
				additionalAuthenticatedData: N(f, "aad", A)
			},
			...h && {
				sharedUnprotectedHeader: h
			},
			...y && {
				unprotectedHeader: y
			},
			...T && {
				key: H
			}
		}
	}
	async function e7(e, t, r) {
		if (e instanceof Uint8Array && (e = a.decode(e)), "string" != typeof e) throw new A("Compact JWE must be a string or Uint8Array");
		let {
			0: n,
			1: i,
			2: o,
			3: s,
			4: c,
			length: u
		} = e.split(".");
		if (5 !== u) throw new A("Invalid Compact JWE");
		return e9({
			ciphertext: s,
			iv: o || void 0,
			protected: n,
			tag: c || void 0,
			encrypted_key: i || void 0
		}, t, r)
	}
	async function te(e, t, r) {
		return e7(e, e3(r), t)
	}
	async function tt(e, t, r) {
		if (!_(e)) throw new A("Flattened JWE must be an object");
		let n = e8(e),
			[i, , a] = e5(e);
		if (!i) throw a;
		let o = {
			...n,
			...i
		};
		return e6(o), e9(o, e3(r), t)
	}
	async function tr(e, t, r) {
		let n, i;
		if (!_(e)) throw new A("General JWE must be an object");
		let a = e.recipients;
		if (!Array.isArray(a)) throw new A("JWE Recipients missing or incorrect type");
		let o = Array.from(a);
		if (!o.every(_)) throw new A("JWE Recipients missing or incorrect type");
		if (!o.length) throw new A("JWE Recipients has no members");
		let s = e3(r);
		try {
			n = e8(e), i = e4(n)
		} catch {
			throw new E
		}
		let c = o.map(e => e5(e));
		if (o.length > 1)
			for (let [, e] of c) {
				let t = i[0]?.alg ?? e ?? n.unprotected?.alg,
					r = "string" == typeof t ? eC[t] : void 0;
				if (r && !eR(r)) throw new A(`"${t}" alg may only have a single recipient`)
			}
		for (let [e] of c)
			if (e) try {
				let r = {
					...n,
					...e
				};
				return e6(r), await e9(r, s, t, i)
			} catch {}
		throw new E
	}

	function tn(e, t, r) {
		if (!R(e, t, r)) throw new A("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint")
	}

	function ti(e, t, r = !1) {
		if (!e[1] && !e[2] && !e[3]) throw new A("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
		void 0 !== t && (e[8] = t?.crit);
		let [, n, i, a, o, s, c, u, l] = e;
		if (void 0 !== o && U(o, "JWE Additional Authenticated Data"), void 0 !== s && U(s, "JWE Content Encryption Key"), void 0 !== c && U(c, "JWE Initialization Vector"), r || void 0 === n || (n = F(A, n)[0], e[1] = n), void 0 !== i && (i = F(A, i)[0], e[2] = i), r || void 0 === a || (a = F(A, a)[0], e[3] = a), void 0 !== u && !_(u)) throw TypeError("JWE Key Management Parameters must be an object");
		tn(n, i, a);
		let d = {
			...n,
			...i,
			...a
		};
		L(A, n), V(A, M, l, n, d), eQ(d, n);
		let {
			alg: p,
			enc: y
		} = d;
		if ("string" != typeof p || !p) throw new A('JWE "alg" (Algorithm) Header Parameter missing or invalid');
		let h = eC[p];
		if (h?.mode === "integrated-encryption") {
			if (void 0 !== y) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter must not be present for integrated encryption');
			if (void 0 !== s) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${p}`);
			if (void 0 !== c) throw TypeError(`setInitializationVector cannot be called with JWE "alg" (Algorithm) Header ${p}`);
			return [d, void 0, h]
		}
		if ("string" != typeof y || !y) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
		return [d, ex(y), h]
	}
	async function ta(e, t, r) {
		let n, i, a, o, s, c, [u, l, d] = t,
			[y, h, f, w, m, g, b, v, , E] = e,
			S = h,
			J = f,
			K = d ?? eO(u.alg);
		"integrated-encryption" === K.mode ? a = await z(K, r, "encrypt") : [a, n, i] = await eq(K, l, r, u, g, v), i && (E ? J = J ? {
			...J,
			...i
		} : i : S = S ? {
			...S,
			...i
		} : i, tn(S, J, w));
		let W = S ? I(JSON.stringify(S)) : "",
			k = m?.byteLength ? I(m) : void 0,
			P = p(k ? `${W}.${k}` : W),
			T = y;
		"DEF" === u.zip && (T = await e2(T).catch(e => {
			throw new A("Failed to compress plaintext", {
				cause: e
			})
		})), "integrated-encryption" === K.mode ? [n, o] = await K.encrypt(a, T, P, S, u, v) : {
			ciphertext: o,
			tag: s,
			iv: c
		} = await ev(l, T, a, b, P);
		let C = {
			ciphertext: I(o)
		};
		return c && (C.iv = I(c)), s && (C.tag = I(s)), n?.byteLength && (C.encrypted_key = I(n)), k && (C.aad = k), S && (C.protected = W), w && (C.unprotected = w), J && (C.header = J), C
	}
	async function to(e, t, r) {
		return ta(e, ti(e, r), t)
	}

	function ts(e) {
		return [e.protected, e.encrypted_key, e.iv, e.ciphertext, e.tag].join(".")
	}
	class tc {
		#e;
		state;
		constructor(e, t, r) {
			this.#e = e, this.state = [void 0, void 0, t, r]
		}
		setUnprotectedHeader(e) {
			return x(this.state[0], "setUnprotectedHeader"), this.state[0] = e, this
		}
		setKeyManagementParameters(e) {
			return x(this.state[1], "setKeyManagementParameters"), this.state[1] = e, this
		}
		addRecipient(...e) {
			return this.#e.addRecipient(...e)
		}
		encrypt(...e) {
			return this.#e.encrypt(...e)
		}
		done() {
			return this.#e
		}
	}
	let tu = [
		["verify"],
		["sign"]
	];

	function tl(e) {
		let t = {
			name: "HMAC",
			hash: `SHA-${e}`
		};
		return {
			kty: ["oct"],
			secret: !0,
			subtle: t,
			signing: t,
			usages: tu
		}
	}

	function td(e, t) {
		let r = {
			name: t ? "RSA-PSS" : "RSASSA-PKCS1-v1_5",
			hash: `SHA-${e}`
		};
		return {
			kty: ["RSA"],
			subtle: r,
			signing: t ? {
				...r,
				saltLength: t
			} : r,
			usages: tu,
			minRsaBits: 2048
		}
	}

	function tp(e, t) {
		return {
			kty: ["EC"],
			crv: e,
			subtle: {
				name: "ECDSA",
				namedCurve: e
			},
			signing: {
				name: "ECDSA",
				hash: `SHA-${t}`
			},
			usages: tu
		}
	}

	function ty() {
		let e = {
			name: "Ed25519"
		};
		return {
			kty: ["OKP"],
			crv: "Ed25519",
			subtle: e,
			signing: e,
			usages: tu
		}
	}

	function th(e) {
		let t = {
			name: `ML-DSA-${e}`
		};
		return {
			kty: ["AKP"],
			subtle: t,
			signing: t,
			usages: tu
		}
	}
	let tf = eA({
		HS256: tl(256),
		HS384: tl(384),
		HS512: tl(512),
		RS256: td(256),
		RS384: td(384),
		RS512: td(512),
		PS256: td(256, 32),
		PS384: td(384, 48),
		PS512: td(512, 64),
		ES256: tp("P-256", 256),
		ES384: tp("P-384", 384),
		ES512: tp("P-521", 512),
		EdDSA: ty(),
		Ed25519: ty(),
		"ML-DSA-44": th(44),
		"ML-DSA-65": th(65),
		"ML-DSA-87": th(87)
	});

	function tw(e) {
		let t = "string" == typeof e ? tf[e] : void 0;
		if (!t) throw new v(`alg ${e} is not supported either by JOSE or your javascript runtime`);
		return t
	}

	function tm(e, t) {
		let r = e.protected,
			n = e.header,
			i = _(n) ? {
				...n
			} : n,
			a = t ? t[0] : e.payload;
		!t && a instanceof Uint8Array && (a = new Uint8Array(a));
		let o = e.signature,
			s = {
				payload: a,
				signature: o
			};
		if (void 0 !== r && (s.protected = r), void 0 !== n && (s.header = i), void 0 === r && void 0 === i) throw new S('Flattened JWS must have either of the "protected" or "header" members');
		if (void 0 !== r && "string" != typeof r) throw new S("JWS Protected Header incorrect type");
		if (void 0 === a) throw new S("JWS Payload missing");
		if ("string" != typeof o) throw new S("JWS Signature missing or incorrect type");
		if (void 0 !== i && !_(i)) throw new S("JWS Unprotected Header incorrect type");
		return s
	}

	function tg(e) {
		return [e && B("algorithms", e.algorithms), e?.crit]
	}

	function tb(e) {
		return void 0 === e ? {} : $(e, S, "JWS Protected Header is invalid")
	}

	function tv(e) {
		let t = /[\p{Cs}\p{Cn}]/u.exec(e)?.[0];
		if (void 0 !== t) throw new S(/\p{Cs}/u.test(t) ? "JWS Payload must be a well-formed Unicode string" : "JWS Payload must not contain unassigned Unicode code points");
		return i.encode(e)
	}

	function tE(e) {
		try {
			return p(e)
		} catch (e) {
			throw new S("JWS Compact Serialization payload must use only ASCII characters", {
				cause: e
			})
		}
	}
	async function tA(e, t, r, n, i) {
		let {
			protected: a,
			header: o,
			payload: c
		} = e, u = i ?? tb(a);
		if (!R(u, o)) throw new S("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
		let l = {
				...u,
				...o
			},
			d = G(u, V(S, j, t[1], u, l)),
			{
				alg: y
			} = l;
		if ("string" != typeof y || !y) throw new S('JWS "alg" (Algorithm) Header Parameter missing or invalid');
		if (t[0] && !t[0].has(y)) throw new b('"alg" (Algorithm) Header Parameter value not allowed');
		if (d) {
			if ("string" != typeof c) throw new S("JWS Payload must be a string")
		} else if ("string" != typeof c && !(c instanceof Uint8Array)) throw new S("JWS Payload must be a string or an Uint8Array instance");
		let h = d || "string" != typeof c ? c : n(c),
			f = !1;
		"function" == typeof r && (r = await r(u, e), f = !0);
		let w = tw(y),
			m = s(void 0 !== a ? p(a) : new Uint8Array, p("."), "string" == typeof h ? t[2] ??= D(h, "payload", S) : h),
			g = N(e.signature, "signature", S),
			v = await z(w, r, "verify"),
			E = await ed(v, w.subtle, "verify");
		w.minRsaBits && ea(w.alg, E);
		let A = !1;
		try {
			A = await crypto.subtle.verify(w.signing, E, g, m)
		} catch (e) {
			throw new C(void 0, {
				cause: e
			})
		}
		if (!A) throw new C;
		let J = {
			payload: "string" == typeof h ? N(h, "payload", S) : h
		};
		return void 0 !== a && (J.protectedHeader = u), void 0 !== o && (J.unprotectedHeader = o), f ? [{
			...J,
			key: v
		}, d] : [J, d]
	}
	async function tS(e, t, r) {
		if (e instanceof Uint8Array && (e = a.decode(e)), "string" != typeof e) throw new S("Compact JWS must be a string or Uint8Array");
		let {
			0: n,
			1: i,
			2: o,
			length: s
		} = e.split(".");
		if (3 !== s) throw new S("Invalid Compact JWS");
		return tA({
			payload: i,
			protected: n,
			signature: o
		}, t, r, tE)
	}
	async function tJ(e, t, r) {
		let [n] = await tS(e, tg(r), t);
		return n
	}
	async function tK(e, t, r) {
		if (!_(e)) throw new S("Flattened JWS must be an object");
		let n = tm(e),
			[i] = await tA(n, tg(r), t, tv);
		return i
	}
	async function tW(e, t, r) {
		if (!_(e)) throw new S("General JWS must be an object");
		let {
			signatures: n,
			payload: i
		} = e;
		if (!Array.isArray(n)) throw new S("JWS Signatures missing or incorrect type");
		let a = Array.from(n);
		if (!a.every(_)) throw new S("JWS Signatures missing or incorrect type");
		if (void 0 === i) throw new C;
		let o = tg(r),
			s = i instanceof Uint8Array ? new Uint8Array(i) : i,
			c = a.map(e => (function(e, t) {
				try {
					let r = tm(e, [t]),
						n = tb(r.protected),
						{
							b64: i,
							crit: a
						} = n;
					return [r, n, Array.isArray(a) && a.includes("b64") ? "boolean" == typeof i ? i ? 1 : 2 : 0 : 1]
				} catch {
					return
				}
			})(e, s)).filter(e => void 0 !== e),
			u = 0;
		for (let [, , e] of c)
			if (3 == (u |= e)) throw new S("inconsistent use of JWS Unencoded Payload (RFC7797)");
		for (let e of c) try {
			let [r] = await tA(e[0], o, t, tv, e[1]);
			return r
		} catch {}
		throw new C
	}
	let tk = e => Math.floor(e.getTime() / 1e3),
		tP = {
			s: 1,
			m: 60,
			h: 3600,
			d: 86400,
			w: 604800,
			y: 0x1e187e0
		},
		tT = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i,
		tC = "check_failed";

	function tH() {
		throw TypeError("Invalid time period format")
	}

	function tI(e) {
		"string" != typeof e && tH();
		let t = tT.exec(e);
		(!t || t[4] && t[1]) && tH();
		let r = Math.round(parseFloat(t[2]) * tP[t[3][0].toLowerCase()]);
		return Number.isFinite(r) || tH(), "-" === t[1] || "ago" === t[4] ? -r : r
	}

	function tU(e, t) {
		if (!Number.isFinite(t)) throw TypeError(`Invalid ${e} input`);
		return t
	}

	function t_(e, t) {
		if ("string" != typeof t) throw TypeError(`"${e}" claim must be a string`)
	}

	function tO(e, t) {
		return "number" == typeof e ? tU(t, e) : e instanceof Date ? tU(t, tk(e)) : tk(new Date) + tI(e)
	}
	let tR = e => {
		let t = e.toLowerCase();
		return e.includes("/") ? t : `application/${t}`
	};

	function tx(e, t, r = !1) {
		let n = e[t];
		if (!(void 0 === n && !r)) {
			if ("number" != typeof n) throw new m(`"${t}" claim must be a number`, e, t, "invalid");
			return n
		}
	}

	function tN(e, t) {
		throw new m(`unexpected "${t}" claim value`, e, t, tC)
	}

	function tD(e, t, r = {}) {
		let n, i, a;
		try {
			n = JSON.parse(o.decode(t))
		} catch (e) {
			throw new J("JWT Claims Set must be a top-level JSON object", {
				cause: e
			})
		}
		if (!_(n)) throw new J("JWT Claims Set must be a top-level JSON object");
		let {
			typ: s
		} = r;
		if (void 0 !== s && ("string" != typeof e.typ || tR(e.typ) !== tR(s))) throw new m('unexpected "typ" JWT header value', n, "typ", tC);
		let {
			requiredClaims: c = [],
			issuer: u,
			subject: l,
			audience: d,
			maxTokenAge: p
		} = r, y = [...c];
		for (let e of (void 0 !== p && y.push("iat"), void 0 !== d && y.push("aud"), void 0 !== l && y.push("sub"), void 0 !== u && y.push("iss"), new Set(y.reverse())))
			if (!Object.hasOwn(n, e)) throw new m(`missing required "${e}" claim`, n, e, "missing");
		void 0 === u || (Array.isArray(u) ? u : [u]).includes(n.iss) || tN(n, "iss"), void 0 !== l && n.sub !== l && tN(n, "sub"), void 0 === d || (i = n.aud, a = "string" == typeof d ? [d] : d, "string" == typeof i ? a.includes(i) : !!Array.isArray(i) && a.some(e => i.includes(e))) || tN(n, "aud");
		let {
			clockTolerance: h
		} = r, f = 0;
		if ("string" == typeof h) f = tI(h);
		else if (void 0 !== h) {
			if ("number" != typeof h) throw TypeError("Invalid clockTolerance option type");
			f = h
		}
		if (tU("clockTolerance option", f), f < 0) throw TypeError("Invalid clockTolerance option input");
		let {
			currentDate: w
		} = r, b = tU("currentDate option", tk(void 0 === w ? new Date : w)), v = tx(n, "iat", void 0 !== p), E = tx(n, "nbf");
		if (void 0 !== E && E > b + f) throw new m('"nbf" claim timestamp check failed', n, "nbf", tC);
		let A = tx(n, "exp");
		if (void 0 !== A && A <= b - f) throw new g('"exp" claim timestamp check failed', n, "exp", tC);
		if (void 0 !== p) {
			let e = b - v,
				t = tU("maxTokenAge option", "number" == typeof p ? p : tI(p));
			if (t < 0) throw TypeError("Invalid maxTokenAge option input");
			if (e - f > t) throw new g('"iat" claim timestamp check failed (too far in the past)', n, "iat", tC);
			if (e < -f) throw new m('"iat" claim timestamp check failed (it should be in the past)', n, "iat", tC)
		}
		return n
	}

	function t$(e) {
		return r.get(e)
	}

	function tj(e) {
		let t = t$(e);
		for (let e of ["iat", "nbf", "exp"]) {
			let r = t[e];
			if ("number" == typeof r && !Number.isFinite(r)) throw TypeError(`"${e}" claim must be a finite number`)
		}
		return i.encode(JSON.stringify(t))
	}
	class tM {
		constructor(e = {}) {
			if (!_(e)) throw TypeError("JWT Claims Set MUST be an object");
			(r ||= new WeakMap).set(this, structuredClone(e))
		}
		setIssuer(e) {
			return t_("iss", e), t$(this).iss = e, this
		}
		setSubject(e) {
			return t_("sub", e), t$(this).sub = e, this
		}
		setAudience(e) {
			return function(e) {
				if ("string" != typeof e && (!Array.isArray(e) || Array.from(e).some(e => "string" != typeof e))) throw TypeError('"aud" claim must be a string or an array of strings')
			}(e), t$(this).aud = e, this
		}
		setJti(e) {
			return t_("jti", e), t$(this).jti = e, this
		}
		setNotBefore(e) {
			return t$(this).nbf = tO(e, "setNotBefore"), this
		}
		setExpirationTime(e) {
			return t$(this).exp = tO(e, "setExpirationTime"), this
		}
		setIssuedAt(e) {
			let t = t$(this);
			return void 0 === e ? t.iat = tk(new Date) : "string" == typeof e ? t.iat = tU("setIssuedAt", tk(new Date) + tI(e)) : t.iat = tO(e, "setIssuedAt"), this
		}
	}
	async function tB(e, t, r) {
		let [n, i] = await tS(e, tg(r), t);
		if (!i) throw new J("JWTs MUST NOT use unencoded payload");
		let a = tD(n.protectedHeader, n.payload, r);
		return {
			...n,
			payload: a
		}
	}
	async function tL(e, t, r) {
		let {
			plaintext: n,
			...i
		} = await e7(e, e3(r), t), {
			protectedHeader: a
		} = i, o = tD(a, n, r);
		for (let e of ["iss", "sub", "aud"])
			if (void 0 !== a[e] && ("aud" === e ? JSON.stringify(a.aud) !== JSON.stringify(o.aud) : a[e] !== o[e])) throw new m(`replicated "${e}" claim header parameter mismatch`, o, e, "mismatch");
		return {
			payload: o,
			...i
		}
	}
	async function tV(e, t, r) {
		let [n, a, o, c] = e, u = "";
		if (void 0 !== a) {
			let e = F(S, a);
			a = e[0], u = I(e[1])
		}
		if (void 0 !== o && (o = F(S, o)[0]), !a && !o) throw new S("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
		if (!R(a, o)) throw new S("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
		let l = {
			...a,
			...o
		};
		L(S, a);
		let d = G(a, V(S, j, c, a, l));
		d || r?.();
		let {
			alg: y
		} = l;
		if ("string" != typeof y || !y) throw new S('JWS "alg" (Algorithm) Header Parameter missing or invalid');
		let h = tw(y),
			f = "",
			w = n,
			m;
		if (d) {
			let t = e[4];
			t ? (f = t[0] ??= I(n), w = t[1] ??= p(f)) : (f = I(n), m = i.encode(`${u}.${f}`))
		}
		m ??= s(p(u), p("."), w);
		let g = await ed(await z(h, t, "sign"), h.subtle, "sign");
		h.minRsaBits && ea(h.alg, g);
		let b = {
			signature: I(new Uint8Array(await crypto.subtle.sign(h.signing, g, m))),
			payload: f
		};
		return a && (b.protected = u), o && (b.header = o), [b, d]
	}
	async function tG(e, t, r, n, i) {
		let [a] = await tV([e, t, void 0, r], n, i);
		return `${a.protected}.${a.payload}.${a.signature}`
	}
	class tF {
		#e;
		state;
		constructor(e, t, r) {
			this.#e = e, this.state = [void 0, void 0, t, r?.crit]
		}
		setProtectedHeader(e) {
			return x(this.state[0], "setProtectedHeader"), this.state[0] = e, this
		}
		setUnprotectedHeader(e) {
			return x(this.state[1], "setUnprotectedHeader"), this.state[1] = e, this
		}
		addSignature(...e) {
			return this.#e.addSignature(...e)
		}
		sign(...e) {
			return this.#e.sign(...e)
		}
		done() {
			return this.#e
		}
	}
	let tz = tM,
		tX = tM,
		tY = '"alg" (Algorithm)';

	function tq(e = 'JWK "alg" (Algorithm) Parameter') {
		throw new v(`Invalid or unsupported ${e} value`)
	}

	function tQ(e, t) {
		return ("string" == typeof e ? tf[e] ?? eC[e] : void 0) ?? tq(t)
	}
	let tZ = async (e, t, r) => {
		var n, i;
		let a;
		if (Q(r)) {
			if (r.type !== e) throw TypeError(`key is not a ${e} key`);
			return r.export({
				format: "pem",
				type: t
			})
		}
		if (!q(r)) throw TypeError(et(r, "CryptoKey", "KeyObject"));
		if (!r.extractable) throw TypeError("CryptoKey is not extractable");
		if (r.type !== e) throw TypeError(`key is not a ${e} key`);
		return n = y(new Uint8Array(await crypto.subtle.exportKey(t, r))), i = `${e.toUpperCase()} KEY`, a = (n.match(/.{1,64}/g) || []).join(`
`), `-----BEGIN ${i}-----
${a}
-----END ${i}-----`
	}, t0 = (e, t) => {
		if (e.byteLength !== t.length) return !1;
		for (let r = 0; r < e.byteLength; r++)
			if (e[r] !== t[r]) return !1;
		return !0
	}, t2 = e => ({
		data: e,
		pos: 0
	}), t1 = e => {
		let t = e.data[e.pos++];
		if (void 0 === t) throw Error("Unexpected end of ASN.1 input");
		return t
	}, t8 = e => {
		let t = t1(e);
		if (128 & t) {
			let r = 127 & t,
				n = 0;
			for (let t = 0; t < r; t++) n = n << 8 | t1(e);
			return n
		}
		return t
	}, t5 = (e, t = 1) => {
		for (; t-- > 0;) {
			e.pos++;
			let t = t8(e);
			e.pos += t
		}
	}, t6 = (e, t, r) => {
		if (t1(e) !== t) throw Error(r)
	}, t4 = (e, t) => {
		if (t < 0 || e.pos + t > e.data.length) throw Error("Unexpected end of ASN.1 input");
		let r = e.data.subarray(e.pos, e.pos + t);
		return e.pos += t, r
	}, t3 = async (e, t, r, n) => {
		let i, a = eu(n?.extractable),
			o = tQ(r, tY);
		o.secret && tq(tY);
		let s = "spki" === e;
		if (o.resolve) try {
			let r = t2(t);
			(function(e, t) {
				if (t6(e, 48, `Invalid ${"spki"===t?"SPKI":"PKCS#8"} structure`), t8(e), "pkcs8" === t) {
					t6(e, 2, "Expected version field");
					let t = t8(e);
					e.pos += t
				}
				t6(e, 48, "Expected algorithm identifier"), t8(e)
			})(r, e), i = o.resolve({
				crv: (e => {
					let t, r = (t6(e, 6, "Expected algorithm OID"), t = t8(e), t4(e, t));
					if (t0(r, [43, 101, 110])) return "X25519";
					if (!t0(r, [42, 134, 72, 206, 61, 2, 1])) throw Error("Unsupported key algorithm");
					t6(e, 6, "Expected curve OID");
					let n = t8(e),
						i = t4(e, n);
					if (t0(i, [42, 134, 72, 206, 61, 3, 1, 7])) return "P-256";
					if (t0(i, [43, 129, 4, 0, 34])) return "P-384";
					if (t0(i, [43, 129, 4, 0, 35])) return "P-521";
					throw Error("Unsupported named curve")
				})(r)
			})
		} catch (e) {
			throw new v("Invalid or unsupported key format", {
				cause: e
			})
		} else i = o.subtle;
		return crypto.subtle.importKey(e, t, i, a ?? s, o.usages[+!s])
	}, t9 = (e, t) => h(e.replace(t, ""));
	async function t7(e) {
		if (Q(e))
			if ("secret" !== e.type) return e.export({
				format: "jwk"
			});
			else e = e.export();
		if (e instanceof Uint8Array) return {
			kty: "oct",
			k: I(e)
		};
		if (!q(e)) throw TypeError(et(e, "CryptoKey", "KeyObject", "Uint8Array"));
		if (!e.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
		let t = await crypto.subtle.exportKey("jwk", e);
		for (let e of (delete t.ext, delete t.key_ops, delete t.use, "AKP" !== t.kty && delete t.alg, Object.keys(t))) void 0 === t[e] && delete t[e];
		return t
	}
	let re = (e, t) => {
		if ("string" != typeof e || !e) throw new K(`${t} missing or invalid`)
	};
	async function rt(e, t) {
		let r, n;
		if (_(e)) {
			if ("string" != typeof(r = es(e)).kty) throw TypeError(et(e, "CryptoKey", "KeyObject", "JSON Web Key"))
		} else if (Z(e)) r = es(await t7(e));
		else throw TypeError(et(e, "CryptoKey", "KeyObject", "JSON Web Key"));
		if ("sha256" !== (t ??= "sha256") && "sha384" !== t && "sha512" !== t) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
		switch (r.kty) {
			case "AKP":
				re(r.alg, '"alg" (Algorithm) Parameter'), re(r.pub, '"pub" (Public key) Parameter'), n = {
					alg: r.alg,
					kty: r.kty,
					pub: r.pub
				};
				break;
			case "EC":
				re(r.crv, '"crv" (Curve) Parameter'), re(r.x, '"x" (X Coordinate) Parameter'), re(r.y, '"y" (Y Coordinate) Parameter'), n = {
					crv: r.crv,
					kty: r.kty,
					x: r.x,
					y: r.y
				};
				break;
			case "OKP":
				re(r.crv, '"crv" (Subtype of Key Pair) Parameter'), re(r.x, '"x" (Public Key) Parameter'), n = {
					crv: r.crv,
					kty: r.kty,
					x: r.x
				};
				break;
			case "RSA":
				re(r.e, '"e" (Exponent) Parameter'), re(r.n, '"n" (Modulus) Parameter'), n = {
					e: r.e,
					kty: r.kty,
					n: r.n
				};
				break;
			case "oct":
				if ("string" != typeof r.k) throw new K('"k" (Key Value) Parameter missing or invalid');
				n = {
					k: r.k,
					kty: r.kty
				};
				break;
			default:
				throw new v('"kty" (Key Type) Parameter missing or unsupported')
		}
		let i = p(JSON.stringify(n));
		return I(await f(t, i))
	}
	async function rr(e, t) {
		t ??= "sha256";
		let r = await rt(e, t);
		return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${r}`
	}
	async function rn(e, t) {
		let r, n = {
			...e,
			...t?.header
		};
		if (!_(n.jwk)) throw new S('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
		try {
			r = ec(n.jwk)
		} catch (e) {
			throw new S("Invalid Embedded JWK", {
				cause: e
			})
		}
		let i = tw(n.alg);
		if (void 0 !== r.use && "sig" !== r.use) throw new S('Invalid Embedded JWK, its "use" must be "sig" when present');
		if (void 0 !== r.alg && r.alg !== i.alg) throw new S(`Invalid Embedded JWK, its "alg" must be "${i.alg}" when present`);
		let a = await el(i, r, !0);
		if ("public" !== a.type) throw new S('"jwk" (JSON Web Key) Header Parameter must be a public key');
		return a
	}
	async function ri(e, t, r) {
		let n = e.get(t) || e.set(t, {}).get(t),
			{
				alg: i
			} = r;
		if (void 0 === n[i]) {
			let e = el(r, t, !0).then(e => {
				if ("public" !== e.type) throw new W("JSON Web Key Set members must be public keys");
				return n[i] = e, e
			}).catch(t => {
				throw n[i] === e && delete n[i], t
			});
			n[i] = e
		}
		return n[i]
	}

	function ra(e) {
		let t;
		try {
			t = structuredClone(e)
		} catch (e) {
			throw new W("JSON Web Key Set malformed", {
				cause: e
			})
		}
		if (!O(t)) throw new W("JSON Web Key Set malformed");
		let r = t.keys.map(e => {
				let t = es(e);
				return Array.isArray(t.key_ops) && (t.key_ops = [...t.key_ops]), t
			}),
			n = new WeakMap;
		return Object.defineProperty(async (e, i) => {
			let {
				alg: a,
				kid: o
			} = {
				...e,
				...i?.header
			}, s = "string" == typeof a ? tf[a] : void 0;
			if (!s || s.secret) throw new v('Unsupported "alg" value for a JSON Web Key Set');
			let c = t.keys.filter((e, t) => (function(e, t, r, n) {
					let {
						kty: i,
						key_ops: a,
						ext: o,
						kid: s,
						alg: c,
						use: u,
						crv: l
					} = e;
					return (void 0 === o || "boolean" == typeof o) && (void 0 === a || Array.isArray(a) && a.every((e, t) => "string" == typeof e && a.indexOf(e) === t) && a.includes("verify")) && t.kty.includes(i) && (void 0 === n || "string" == typeof n && n === s) && (void 0 === c ? "AKP" !== i : r === c) && (void 0 === u || "sig" === u) && (!t.crv || l === t.crv)
				})(r[t], s, a, o)),
				{
					0: u,
					length: l
				} = c;
			if (!l) throw new k;
			if (1 !== l) {
				let e = new P;
				throw e[Symbol.asyncIterator] = async function*() {
					for (let e of c) try {
						yield await ri(n, e, s)
					} catch {}
				}, e
			}
			return ri(n, u, s)
		}, "jwks", {
			value: () => structuredClone(t)
		})
	}(typeof navigator > "u" || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (n = "jose/v6.2.17");
	let ro = Symbol();
	async function rs(e, t, r, n = fetch) {
		let i = await n(e, {
			method: "GET",
			signal: r,
			redirect: "manual",
			headers: t
		}).catch(e => {
			throw "TimeoutError" === e.name ? new T(void 0, {
				cause: e
			}) : e
		});
		if (200 !== i.status) throw new w("Expected 200 OK from the JSON Web Key Set HTTP response");
		try {
			return await i.json()
		} catch (e) {
			throw new w("Failed to parse the JSON Web Key Set HTTP response as JSON", {
				cause: e
			})
		}
	}
	let rc = Symbol();

	function ru(e, t) {
		return Number.isFinite(e) && Date.now() < e + t
	}

	function rl(e, t, r) {
		if (Number.isNaN(e)) throw TypeError(`"${r}" option must not be NaN`);
		if ("number" == typeof e && e < 0) throw TypeError(`"${r}" option must not be negative`);
		return "number" == typeof e ? e : t
	}
	let rd = tM;
	async function rp(e, t, r) {
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN PUBLIC KEY-----")) throw TypeError('"spki" must be SPKI formatted string');
		return t3("spki", t9(e, /(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g), t, r)
	}
	async function ry(e, t, r) {
		let n;
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN CERTIFICATE-----")) throw TypeError('"x509" must be X.509 formatted string');
		try {
			let t = t9(e, /(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g);
			n = function(e) {
				let t = t2(e);
				t6(t, 48, "Invalid certificate structure");
				let r = t8(t);
				if (r < 0 || t.pos + r > t.data.length) throw Error("Unexpected end of ASN.1 input");
				t6(t, 48, "Invalid tbsCertificate structure"), t8(t), 160 === e[t.pos] ? t5(t, 6) : t5(t, 5);
				let n = t.pos;
				t6(t, 48, "Invalid SPKI structure");
				let i = t8(t);
				return e.subarray(n, n + i + (t.pos - n))
			}(t)
		} catch (e) {
			throw TypeError("Failed to parse the X.509 certificate", {
				cause: e
			})
		}
		return t3("spki", n, t, r)
	}
	async function rh(e, t, r) {
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN PRIVATE KEY-----")) throw TypeError('"pkcs8" must be PKCS#8 formatted string');
		return t3("pkcs8", t9(e, /(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g), t, r)
	}
	async function rf(e, t, r) {
		if (!_(e)) throw TypeError("JWK must be an object");
		let n = ec(e),
			i = eu(r?.extractable),
			{
				alg: a
			} = n;
		if (t ??= a, "oct" !== n.kty && !t) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
		switch (n.kty) {
			case "oct":
				if ("string" != typeof n.k) throw TypeError('missing "k" (Key Value) Parameter value');
				return H(n.k);
			case "AKP":
				if ("string" != typeof a || !a) throw TypeError('missing "alg" (Algorithm) Parameter value');
				if (t !== a) throw TypeError("JWK alg and alg option value mismatch");
				return el(tQ(t), n, i);
			case "RSA":
			case "EC":
			case "OKP":
				return el(tQ(t), n, i);
			default:
				throw new v('Unsupported "kty" (Key Type) Parameter value')
		}
	}
	var rw = e.i(409978);
	async function rm(e, t) {
		let r, n = eu(t?.extractable),
			i = tQ(e, tY);
		if (i.secret && tq(tY), i.resolve) {
			let e = t?.crv ?? "P-256";
			if (!["P-256", "P-384", "P-521", "X25519"].includes(e)) throw new v("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, and X25519");
			r = i.resolve({
				crv: e
			})
		} else {
			if (void 0 !== i.crv && t?.crv !== void 0 && t.crv !== i.crv) throw new v(`Invalid or unsupported crv option provided, the only supported value for ${e} is ${i.crv}`);
			r = "RSA" === i.kty[0] ? {
				...i.subtle,
				publicExponent: Uint8Array.of(1, 0, 1),
				modulusLength: function(e) {
					let t = e?.modulusLength ?? 2048;
					if ("number" != typeof t || !Number.isInteger(t) || t < 2048) throw new v("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
					return t
				}(t)
			} : i.subtle
		}
		return crypto.subtle.generateKey(r, n ?? !1, [...i.usages[1], ...i.usages[0]])
	}
	async function rg(e, t) {
		let r, n, i, a = eu(t?.extractable);
		switch (e) {
			case "HS256":
			case "HS384":
			case "HS512":
				r = +e.slice(-3), n = {
					name: "HMAC",
					hash: `SHA-${r}`,
					length: r
				}, i = ["sign", "verify"];
				break;
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512":
				return crypto.getRandomValues(new Uint8Array(e.slice(-3) >> 3));
			case "A128KW":
			case "A192KW":
			case "A256KW":
				n = {
					name: "AES-KW",
					length: r = +e.slice(1, 4)
				}, i = ["wrapKey", "unwrapKey"];
				break;
			case "A128GCMKW":
			case "A192GCMKW":
			case "A256GCMKW":
			case "A128GCM":
			case "A192GCM":
			case "A256GCM":
				n = {
					name: "AES-GCM",
					length: r = +e.slice(1, 4)
				}, i = ["encrypt", "decrypt"];
				break;
			default:
				tq(tY)
		}
		return crypto.subtle.generateKey(n, a ?? !1, i)
	}
	var rb = e.i(98580);
	e.s(["CompactEncrypt", 0, class {
		#t;
		constructor(e) {
			U(e, "plaintext"), this.#t = [e]
		}
		setContentEncryptionKey(e) {
			return x(this.#t[5], "setContentEncryptionKey"), this.#t[5] = e, this
		}
		setInitializationVector(e) {
			return x(this.#t[6], "setInitializationVector"), this.#t[6] = e, this
		}
		setProtectedHeader(e) {
			return x(this.#t[1], "setProtectedHeader"), this.#t[1] = e, this
		}
		setKeyManagementParameters(e) {
			return x(this.#t[7], "setKeyManagementParameters"), this.#t[7] = e, this
		}
		async encrypt(e, t) {
			return ts(await to([...this.#t], e, t))
		}
	}, "CompactSign", 0, class {
		#r;
		#n;
		constructor(e) {
			U(e, "payload"), this.#r = e
		}
		setProtectedHeader(e) {
			return x(this.#n, "setProtectedHeader"), this.#n = e, this
		}
		async sign(e, t) {
			return tG(this.#r, this.#n, t?.crit, e, () => {
				throw TypeError("use the flattened module for creating JWS with b64: false")
			})
		}
	}, "EmbeddedJWK", 0, rn, "EncryptJWT", 0, class extends tX {
		#t = [void 0];
		#i;
		#a;
		#o;
		setProtectedHeader(e) {
			return x(this.#t[1], "setProtectedHeader"), this.#t[1] = e, this
		}
		setKeyManagementParameters(e) {
			return x(this.#t[7], "setKeyManagementParameters"), this.#t[7] = e, this
		}
		setContentEncryptionKey(e) {
			return x(this.#t[5], "setContentEncryptionKey"), this.#t[5] = e, this
		}
		setInitializationVector(e) {
			return x(this.#t[6], "setInitializationVector"), this.#t[6] = e, this
		}
		replicateIssuerAsHeader() {
			return this.#i = !0, this
		}
		replicateSubjectAsHeader() {
			return this.#a = !0, this
		}
		replicateAudienceAsHeader() {
			return this.#o = !0, this
		}
		async encrypt(e, t) {
			let r = tj(this);
			this.#t[1] && (this.#i || this.#a || this.#o) && (this.#t[1] = {
				...this.#t[1],
				iss: this.#i ? t$(this).iss : void 0,
				sub: this.#a ? t$(this).sub : void 0,
				aud: this.#o ? t$(this).aud : void 0
			});
			let n = [...this.#t];
			return n[0] = r, ts(await to(n, e, t))
		}
	}, "FlattenedEncrypt", 0, class {
		#t;
		constructor(e) {
			U(e, "plaintext"), this.#t = [e]
		}
		setKeyManagementParameters(e) {
			return x(this.#t[7], "setKeyManagementParameters"), this.#t[7] = e, this
		}
		setProtectedHeader(e) {
			return x(this.#t[1], "setProtectedHeader"), this.#t[1] = e, this
		}
		setSharedUnprotectedHeader(e) {
			return x(this.#t[3], "setSharedUnprotectedHeader"), this.#t[3] = e, this
		}
		setUnprotectedHeader(e) {
			return x(this.#t[2], "setUnprotectedHeader"), this.#t[2] = e, this
		}
		setAdditionalAuthenticatedData(e) {
			return this.#t[4] = e, this
		}
		setContentEncryptionKey(e) {
			return x(this.#t[5], "setContentEncryptionKey"), this.#t[5] = e, this
		}
		setInitializationVector(e) {
			return x(this.#t[6], "setInitializationVector"), this.#t[6] = e, this
		}
		async encrypt(e, t) {
			return to([...this.#t], e, t)
		}
	}, "FlattenedSign", 0, class {
		#t;
		constructor(e) {
			U(e, "payload"), this.#t = [e]
		}
		setProtectedHeader(e) {
			return x(this.#t[1], "setProtectedHeader"), this.#t[1] = e, this
		}
		setUnprotectedHeader(e) {
			return x(this.#t[2], "setUnprotectedHeader"), this.#t[2] = e, this
		}
		async sign(e, t) {
			let r = [...this.#t];
			r[3] = t?.crit;
			let [n] = await tV(r, e);
			return n
		}
	}, "GeneralEncrypt", 0, class {
		#s;
		#c = [];
		#n;
		#u;
		#l;
		constructor(e) {
			this.#s = e
		}
		addRecipient(e, t) {
			let r = new tc(this, e, t?.crit);
			return this.#c.push(r), r
		}
		setProtectedHeader(e) {
			return x(this.#n, "setProtectedHeader"), this.#n = e, this
		}
		setSharedUnprotectedHeader(e) {
			return x(this.#u, "setSharedUnprotectedHeader"), this.#u = e, this
		}
		setAdditionalAuthenticatedData(e) {
			return this.#l = e, this
		}
		async encrypt() {
			if (!this.#c.length) throw new A("at least one recipient must be added");
			U(this.#s, "plaintext");
			let e = this.#c.length > 1,
				t, r = this.#n,
				n = this.#u,
				i = [];
			for (let a of this.#c) {
				let [o, s, c, u] = a.state, l = [this.#s, r, o, n, this.#l, void 0, void 0, s, u, e], d = ti(l, void 0, i.length > 0);
				i.length || (r = l[1], n = l[3]), i.push([l, d, c]);
				let [{
					alg: p,
					enc: y
				}, , h] = d;
				if (e && h && !eR(h)) throw new A(`"${p}" alg may only have a single recipient`);
				if (t) {
					if (t !== y) throw new A('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients')
				} else t = y
			}
			for (let [, e] of i) e[2] ??= eO(e[0].alg);
			let [a, o, s] = i[0], c = e ? ep(o[1]) : void 0;
			a[5] = c;
			let {
				encrypted_key: u,
				header: l,
				...d
			} = await ta(a, o, s), p = {
				...d,
				recipients: [{}]
			};
			u && (p.recipients[0].encrypted_key = u), l && (p.recipients[0].header = l);
			for (let e = 1; e < i.length; e++) {
				let [t, [r, n, a], o] = i[e], s = t[2], [, u, l] = await eq(a, n, o, r, c, t[7]), d = {
					encrypted_key: I(u)
				};
				if (s || l) {
					let e = {
						...s,
						...l
					};
					l && tn(t[1], e, t[3]), d.header = e
				}
				p.recipients.push(d)
			}
			return p
		}
	}, "GeneralSign", 0, class {
		#r;
		#d = [];
		constructor(e) {
			this.#r = e
		}
		addSignature(e, t) {
			let r = new tF(this, e, t);
			return this.#d.push(r), r
		}
		async sign() {
			let e;
			if (!this.#d.length) throw new S("at least one signature must be added");
			U(this.#r, "payload");
			let t = {
					signatures: [],
					payload: ""
				},
				r = [];
			for (let n of this.#d) {
				let [i, a, o, s] = n.state, [{
					payload: c,
					...u
				}, l] = await tV([this.#r, i, a, s, r], o);
				if (void 0 === e) e = l, t.payload = c;
				else if (e !== l) throw new S("inconsistent use of JWS Unencoded Payload (RFC7797)");
				t.signatures.push(u)
			}
			return t
		}
	}, "SignJWT", 0, class extends tz {
		#n;
		setProtectedHeader(e) {
			return x(this.#n, "setProtectedHeader"), this.#n = e, this
		}
		async sign(e, t) {
			return tG(tj(this), this.#n, t?.crit, e, () => {
				throw new J("JWTs MUST NOT use unencoded payload")
			})
		}
	}, "UnsecuredJWT", 0, class extends rd {
		encode() {
			let e = I(JSON.stringify({
					alg: "none"
				})),
				t = I(tj(this));
			return `${e}.${t}.`
		}
		static decode(e, t) {
			let r, n;
			if ("string" != typeof e) throw new J("Unsecured JWT must be a string");
			let {
				0: i,
				1: a,
				2: o,
				length: s
			} = e.split(".");
			if (3 !== s || "" !== o) throw new J("Invalid Unsecured JWT");
			try {
				r = $(i, S, "JWS Protected Header is invalid");
				let e = V(S, j, void 0, r, r);
				n = G(r, e)
			} catch (e) {
				throw e instanceof S ? new J("Invalid Unsecured JWT", {
					cause: e
				}) : e
			}
			if ("none" !== r.alg) throw new J("Invalid Unsecured JWT");
			if (!n) throw new J("JWTs MUST NOT use unencoded payload");
			return {
				payload: tD(r, N(a, "payload", J), t),
				header: r
			}
		}
	}, "base64url", 0, rb, "calculateJwkThumbprint", 0, rt, "calculateJwkThumbprintUri", 0, rr, "compactDecrypt", 0, te, "compactVerify", 0, tJ, "createLocalJWKSet", 0, ra, "createRemoteJWKSet", 0, function(e, t) {
		if (!(e instanceof URL)) throw TypeError("url must be an instance of URL");
		let r = new URL(e.href).href,
			i = t ?? {},
			a = i.timeoutDuration;
		if ("number" == typeof a && (!Number.isInteger(a) || a < 0)) throw TypeError('"timeoutDuration" option must be a non-negative integer');
		let o = "number" == typeof a ? a : 5e3,
			s = rl(i.cooldownDuration, 3e4, "cooldownDuration"),
			c = rl(i.cacheMaxAge, 6e5, "cacheMaxAge"),
			u = new Headers(i.headers);
		n && !u.has("User-Agent") && u.set("User-Agent", n), u.has("accept") || u.set("accept", "application/json, application/jwk-set+json");
		let l = i[ro],
			d = i[rc],
			p, y, h = 0,
			f = 0,
			w;
		if (d && "object" == typeof d) {
			let {
				uat: e,
				jwks: t
			} = d;
			ru(e, c) && O(t) && (p = e, w = ra(t))
		}
		let m = async () => {
			if (y && ("u" > typeof WebSocketPair || "u" > typeof navigator && "Cloudflare-Workers" === navigator.userAgent || "u" > typeof EdgeRuntime && "vercel" === EdgeRuntime) && (y = void 0), !y) {
				let e = ++h,
					t = y = rs(r, u, AbortSignal.timeout(o), l).then(t => {
						let r = ra(t);
						if (e <= f) return;
						w = r;
						let n = Date.now();
						d && (d.uat = n, d.jwks = t), p = n, f = e
					}).finally(() => {
						y === t && (y = void 0)
					})
			}
			await y
		};
		return Object.defineProperties(async (e, t) => {
			w && ru(p, c) || await m();
			try {
				return await w(e, t)
			} catch (r) {
				if (r instanceof k && !ru(p, s)) return await m(), w(e, t);
				throw r
			}
		}, {
			coolingDown: {
				get: () => ru(p, s),
				enumerable: !0
			},
			fresh: {
				get: () => ru(p, c),
				enumerable: !0
			},
			reload: {
				value: m,
				enumerable: !0
			},
			reloading: {
				get: () => !!y,
				enumerable: !0
			},
			jwks: {
				value: () => w?.jwks(),
				enumerable: !0
			}
		})
	}, "cryptoRuntime", 0, "WebCryptoAPI", "customFetch", 0, ro, "decodeJwt", 0, function(e) {
		let t, r;
		if ("string" != typeof e) throw new J("JWTs must use Compact JWS serialization, JWT must be a string");
		let {
			1: n,
			length: i
		} = e.split(".");
		if (5 === i) throw new J("Only JWTs using Compact JWS serialization can be decoded");
		if (3 !== i) throw new J("Invalid JWT");
		if (!n) throw new J("JWTs must contain a payload");
		try {
			t = H(n)
		} catch (e) {
			throw new J("Failed to base64url decode the payload", {
				cause: e
			})
		}
		try {
			r = JSON.parse(o.decode(t))
		} catch (e) {
			throw new J("Failed to parse the decoded payload as JSON", {
				cause: e
			})
		}
		if (!_(r)) throw new J("Invalid JWT Claims Set");
		return r
	}, "decodeProtectedHeader", 0, function(e) {
		let t;
		if ("string" == typeof e) {
			let r = e.split(".");
			(3 === r.length || 5 === r.length) && ([t] = r)
		} else if ("object" == typeof e && e)
			if ("protected" in e) t = e.protected;
			else throw TypeError("Token does not contain a Protected Header");
		let r = "Invalid Token or Protected Header formatting";
		if ("string" != typeof t || !t) throw TypeError(r);
		return $(t, TypeError, r)
	}, "errors", 0, rw, "exportJWK", 0, t7, "exportPKCS8", 0, function(e) {
		return tZ("private", "pkcs8", e)
	}, "exportSPKI", 0, function(e) {
		return tZ("public", "spki", e)
	}, "flattenedDecrypt", 0, tt, "flattenedVerify", 0, tK, "generalDecrypt", 0, tr, "generalVerify", 0, tW, "generateKeyPair", 0, rm, "generateSecret", 0, rg, "importJWK", 0, rf, "importPKCS8", 0, rh, "importSPKI", 0, rp, "importX509", 0, ry, "jwksCache", 0, rc, "jwtDecrypt", 0, tL, "jwtVerify", 0, tB], 348637)
}]);