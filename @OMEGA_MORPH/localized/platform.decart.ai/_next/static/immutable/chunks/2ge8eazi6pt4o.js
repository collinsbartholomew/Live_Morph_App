(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 937129, e => {
	"use strict";
	var t, r, n, a = e.i(733665),
		o = e.i(914374),
		i = e.i(906202);
	let s = {
		toWeb() {
			throw Error("Vercel Blob: Sorry, we cannot get a Readable stream in this environment. If you see this message please open an issue here: https://github.com/vercel/storage/ with details on your environment.")
		}
	};
	var c = e.i(56424),
		l = e.i(452172);
	let u = globalThis.fetch.bind(globalThis);
	var d = e.i(561030),
		h = new Promise(e => {
			try {
				let t = new Uint8Array([104, 101, 108, 108, 111]);
				new Blob([t]).text().then(t => {
					e("hello" === t)
				}).catch(() => {
					e(!1)
				})
			} catch {
				e(!1)
			}
		});
	async function p(e) {
		var t, r;
		let n;
		return e instanceof ReadableStream ? e : e instanceof Blob ? e.stream() : f(e) ? s.toWeb(e) : (n = e instanceof ArrayBuffer ? new Uint8Array(e) : (t = e, (0, i.default)(t)) ? e : (r = e, new TextEncoder().encode(r)), await h) ? new Blob([n]).stream() : new ReadableStream({
			start(e) {
				e.enqueue(n), e.close()
			}
		})
	}

	function f(e) {
		return "object" == typeof e && "function" == typeof e.pipe && e.readable && "function" == typeof e._read && "object" == typeof e._readableState
	}
	async function y() {
		try {
			let e = (await (0, c.getVercelOidcToken)()).trim();
			return "" === e ? void 0 : e
		} catch {
			return
		}
	}
	var w = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i,
		m = {
			b: 1,
			kb: 1024,
			mb: 1048576,
			gb: 0x40000000,
			tb: 0x10000000000,
			pb: 0x4000000000000
		};

	function g(e) {
		let t;
		if ("number" == typeof e && !Number.isNaN(e)) return e;
		if ("string" != typeof e) return null;
		let r = w.exec(e),
			n = "b";
		if (r) {
			let [, e, , , a] = r;
			if (!e) return null;
			t = parseFloat(e), a && (n = a.toLowerCase())
		} else t = parseInt(e, 10);
		return Number.isNaN(t) ? null : Math.floor(m[n] * t)
	}

	function b(e) {
		try {
			let t = o.default.env[e];
			return "string" == typeof t && "" !== t.trim() ? t.trim() : void 0
		} catch {
			return
		}
	}

	function E(e) {
		let [, , , t = ""] = e.split("_");
		return t
	}

	function v(e) {
		return e.startsWith("store_") ? e.slice(6) : e
	}
	async function A(e) {
		var t, r;
		if (null == e ? void 0 : e.presignedUrlPayload) return {
			kind: "presigned",
			storeId: function(e) {
				let t, r = e.indexOf(".");
				if (r < 0) throw new S("Invalid delegation token format.");
				let n = e.slice(0, r);
				try {
					t = JSON.parse(function(e) {
						let t = e.replace(/-/g, "+").replace(/_/g, "/"),
							r = 4 - t.length % 4;
						if (4 !== r && (t += "=".repeat(r)), "function" == typeof atob) return atob(t);
						if (void 0 !== a.Buffer) return a.Buffer.from(t, "base64").toString("utf8");
						throw new S("Cannot decode base64: no atob or Buffer available.")
					}(n))
				} catch {
					throw new S("Invalid delegation token payload.")
				}
				if (!t.storeId || "string" != typeof t.storeId) throw new S("Delegation token payload is missing `storeId`.");
				return v(t.storeId)
			}(e.presignedUrlPayload.delegationToken)
		};
		if (null == e ? void 0 : e.token) {
			let t = E(e.token);
			return {
				kind: "readWrite",
				token: e.token,
				storeId: t
			}
		}
		let n = null == (t = null == e ? void 0 : e.oidcToken) ? void 0 : t.trim(),
			o = n || await y();
		if (o) {
			let t = null == (r = null == e ? void 0 : e.storeId) ? void 0 : r.trim();
			if (t) return {
				kind: "oidc",
				token: o,
				storeId: v(t)
			};
			let a = b("BLOB_STORE_ID");
			if (a) return {
				kind: "oidc",
				token: o,
				storeId: v(a)
			};
			if (n) throw new S("oidcToken was passed, but no storeId was found. Pass a `storeId` option or set `BLOB_STORE_ID` to use OIDC auth")
		}
		let i = b("BLOB_READ_WRITE_TOKEN");
		if (i) {
			let e = E(i);
			return {
				kind: "readWrite",
				token: i,
				storeId: e
			}
		}
		throw new S("No blob credentials found. Pass a `token` option, set `BLOB_READ_WRITE_TOKEN`, or use `oidcToken` (or `VERCEL_OIDC_TOKEN`) with `storeId` or `BLOB_STORE_ID`.")
	}
	var S = class extends Error {
		constructor(e) {
			super(`Vercel Blob: ${e}`)
		}
	};

	function _(e) {
		if ("object" != typeof e || null === e) return !1;
		let t = Object.getPrototypeOf(e);
		return (null === t || t === Object.prototype || null === Object.getPrototypeOf(t)) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e)
	}
	var T = ["//"],
		k = (() => {
			if (function() {
					if ("u" > typeof navigator && "ReactNative" === navigator.product) return !0;
					if (void 0 !== o.default) {
						let e = o.default.type;
						return "renderer" !== e && "worker" !== e && !!(o.default.versions && o.default.versions.node)
					}
					return !1
				}()) return !0;
			if (P().startsWith("http://localhost")) return !1;
			let e = !1,
				t = new Request(P(), {
					body: new ReadableStream,
					method: "POST",
					get duplex() {
						return e = !0, "half"
					}
				}).headers.has("Content-Type");
			return e && !t
		})();

	function P(e = "") {
		var t;
		return `${null!=(t=function(){try{return o.default.env.VERCEL_BLOB_API_URL||o.default.env.NEXT_PUBLIC_VERCEL_BLOB_API_URL||null}catch{return null}}())?t:"https://vercel.com/api/blob"}${e}`
	}
	var C = "function" == typeof TextEncoder ? new TextEncoder : null;

	function H(e) {
		return e ? "string" == typeof e ? C ? C.encode(e).byteLength : new Blob([e]).size : "byteLength" in e && "number" == typeof e.byteLength ? e.byteLength : "size" in e && "number" == typeof e.size ? e.size : 0 : 0
	}

	function R(e) {
		return globalThis.ReadableStream && e instanceof ReadableStream
	}

	function O(e) {
		return !!(R(e) || f(e))
	}
	var x = !1;
	try {
		((null == (t = o.default.env.DEBUG) ? void 0 : t.includes("blob")) || (null == (r = o.default.env.NEXT_PUBLIC_DEBUG) ? void 0 : r.includes("blob"))) && (x = !0)
	} catch {}

	function U(e, ...t) {
		x && console.debug(`vercel-blob: ${e}`, ...t)
	}
	var I = null != (n = globalThis.DOMException) ? n : (() => {
			try {
				atob("~")
			} catch (e) {
				return Object.getPrototypeOf(e).constructor
			}
		})(),
		K = Object.prototype.toString,
		W = new Set(["network error", "Failed to fetch", "NetworkError when attempting to fetch resource.", "The Internet connection appears to be offline.", "Load failed", "Network request failed", "fetch failed", "terminated"]),
		J = "function" == typeof u,
		B = J && k,
		M = async ({
			input: e,
			init: t,
			onUploadProgress: r
		}) => {
			let n;
			if (U("using fetch"), t.body)
				if (r) {
					var a;
					let e, o = await p(t.body),
						i = 0,
						s = (a = e => {
							r(i += e)
						}, e = new Uint8Array(0), new TransformStream({
							transform(t, r) {
								let n = new Uint8Array(e.length + t.byteLength);
								for (n.set(e), n.set(new Uint8Array(t), e.length), e = n; e.length >= 65536;) {
									let t = e.slice(0, 65536);
									r.enqueue(t), null == a || a(t.byteLength), e = e.slice(65536)
								}
							},
							flush(t) {
								e.length > 0 && (t.enqueue(e), null == a || a(e.byteLength))
							}
						}));
					n = o.pipeThrough(s)
				} else n = t.body;
			let o = k && n && O(n) ? "half" : void 0;
			return u(e, {
				...t,
				...t.body ? {
					body: n
				} : {},
				duplex: o
			})
		}, D = "u" > typeof XMLHttpRequest, L = async ({
			input: e,
			init: t,
			onUploadProgress: r
		}) => {
			U("using xhr");
			let n = null;
			return t.body && (n = R(t.body) ? await new Response(t.body).blob() : t.body), new Promise((a, o) => {
				let i = new XMLHttpRequest;
				(i.open(t.method || "GET", e.toString(), !0), r && i.upload.addEventListener("progress", e => {
					e.lengthComputable && r(e.loaded)
				}), i.onload = () => {
					var e;
					if (null == (e = t.signal) ? void 0 : e.aborted) return void o(new DOMException("The user aborted the request.", "AbortError"));
					let r = new Headers;
					i.getAllResponseHeaders().trim().split(/[\r\n]+/).forEach(e => {
						let t = e.split(": "),
							n = t.shift(),
							a = t.join(": ");
						n && r.set(n.toLowerCase(), a)
					}), a(new Response(i.response, {
						status: i.status,
						statusText: i.statusText,
						headers: r
					}))
				}, i.onerror = () => {
					o(TypeError("Network request failed"))
				}, i.ontimeout = () => {
					o(TypeError("Network request timed out"))
				}, i.onabort = () => {
					o(new DOMException("The user aborted a request.", "AbortError"))
				}, t.headers && new Headers(t.headers).forEach((e, t) => {
					i.setRequestHeader(t, e)
				}), t.signal && (t.signal.addEventListener("abort", () => {
					i.abort()
				}), t.signal.aborted)) ? i.abort(): i.send(n)
			})
		}, N = async ({
			input: e,
			init: t,
			onUploadProgress: r
		}) => {
			if (r) {
				if (B) return M({
					input: e,
					init: t,
					onUploadProgress: r
				});
				if (D) return L({
					input: e,
					init: t,
					onUploadProgress: r
				})
			}
			if (J) return M({
				input: e,
				init: t
			});
			if (D) return L({
				input: e,
				init: t
			});
			throw Error("No request implementation available")
		}, j = class extends S {
			constructor() {
				super("Access denied, please provide a valid token for this resource.")
			}
		}, $ = class extends S {
			constructor(e) {
				super(null != e ? e : "OIDC is enabled for this project, but not for this token's environment.")
			}
		}, V = class extends S {
			constructor(e) {
				super(`Content type mismatch, ${e}.`)
			}
		}, F = class extends S {
			constructor(e) {
				super(`Pathname mismatch, ${e}. Check the pathname used in upload() or put() matches the one from the client token.`)
			}
		}, G = class extends S {
			constructor() {
				super("Client token has expired.")
			}
		}, z = class extends S {
			constructor(e) {
				super(`File is too large, ${e}.`)
			}
		}, q = class extends S {
			constructor() {
				super("This store does not exist.")
			}
		}, X = class extends S {
			constructor() {
				super("This store has been suspended.")
			}
		}, Y = class extends S {
			constructor() {
				super("Unknown error, please visit https://vercel.com/help.")
			}
		}, Q = class extends S {
			constructor() {
				super("The requested blob does not exist")
			}
		}, Z = class extends S {
			constructor() {
				super("The blob service is currently not available. Please try again.")
			}
		}, ee = class extends S {
			constructor(e) {
				super(`Too many requests please lower the number of concurrent requests ${e?` - try again in ${e} seconds`:""}.`), this.retryAfter = null != e ? e : 0
			}
		}, et = class extends S {
			constructor() {
				super("The request was aborted.")
			}
		}, er = class extends S {
			constructor() {
				super("Precondition failed: ETag mismatch.")
			}
		};
	async function en(e) {
		var t, r, n;
		let a, o, i, s;
		try {
			let i = await e.json();
			a = null != (r = null == (t = i.error) ? void 0 : t.code) ? r : "unknown_error", o = null == (n = i.error) ? void 0 : n.message
		} catch {
			a = "unknown_error"
		}
		switch ((null == o ? void 0 : o.includes("contentType")) && o.includes("is not allowed") && (a = "content_type_not_allowed"), (null == o ? void 0 : o.includes('"pathname"')) && o.includes("does not match the token payload") && (a = "client_token_pathname_mismatch"), "Token expired" === o && (a = "client_token_expired"), (null == o ? void 0 : o.includes("the file length cannot be greater than")) && (a = "file_too_large"), (null == o ? void 0 : o.startsWith("OIDC is enabled for this project, but not for the")) && o.includes("environment.") && (a = "oidc_environment_not_allowed"), a) {
			case "store_suspended":
				i = new X;
				break;
			case "forbidden":
				i = new j;
				break;
			case "oidc_environment_not_allowed":
				i = new $(o);
				break;
			case "content_type_not_allowed":
				i = new V(o);
				break;
			case "client_token_pathname_mismatch":
				i = new F(o);
				break;
			case "client_token_expired":
				i = new G;
				break;
			case "file_too_large":
				i = new z(o);
				break;
			case "not_found":
				i = new Q;
				break;
			case "client_token_not_allowed":
				i = new S(null != o ? o : "This operation is not available when using a client token. Use a read–write or OIDC token on the server.");
				break;
			case "store_not_found":
				i = new q;
				break;
			case "bad_request":
				i = new S(null != o ? o : "Bad request");
				break;
			case "service_unavailable":
				i = new Z;
				break;
			case "rate_limited":
				i = new ee((s = e.headers.get("retry-after")) ? parseInt(s, 10) : void 0);
				break;
			case "precondition_failed":
				i = new er;
				break;
			default:
				i = new Y
		}
		return {
			code: a,
			error: i
		}
	}
	async function ea(e, t, r) {
		let n = function() {
				let e = null;
				try {
					e = o.default.env.VERCEL_BLOB_API_VERSION_OVERRIDE || o.default.env.NEXT_PUBLIC_VERCEL_BLOB_API_VERSION_OVERRIDE
				} catch {}
				return `${null!=e?e:13}`
			}(),
			a = await A(r),
			i = "presigned" === a.kind ? void 0 : a.token,
			s = function() {
				let e = {};
				try {
					"VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in o.default.env && void 0 !== o.default.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API ? e["x-proxy-through-alternative-api"] = o.default.env.VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API : "NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API" in o.default.env && void 0 !== o.default.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API && (e["x-proxy-through-alternative-api"] = o.default.env.NEXT_PUBLIC_VERCEL_BLOB_PROXY_THROUGH_ALTERNATIVE_API)
				} catch {}
				return e
			}(),
			c = P(e);
		(null == r ? void 0 : r.presignedUrlPayload) && (c = ((e, t) => {
			let r = new URL(e);
			for (let [e, n] of Object.entries(t.params)) r.searchParams.set(e, n);
			return r.searchParams.set("vercel-blob-delegation", t.delegationToken), r.searchParams.set("vercel-blob-signature", t.signature), r.toString()
		})(c, r.presignedUrlPayload));
		let u = `${a.storeId}:${Date.now()}:${Math.random().toString(16).slice(2)}`,
			d = 0,
			h = 0,
			p = 0,
			f = (null == r ? void 0 : r.onUploadProgress) || function() {
				try {
					return "1" === o.default.env.VERCEL_BLOB_USE_X_CONTENT_LENGTH
				} catch {
					return !1
				}
			}();
		t.body && f && (h = H(t.body)), (null == r ? void 0 : r.onUploadProgress) && r.onUploadProgress({
			loaded: 0,
			total: h,
			percentage: 0
		});
		let y = await (0, l.default)(async e => {
			let o;
			try {
				o = await N({
					input: c,
					init: {
						...t,
						headers: {
							"x-api-blob-request-id": u,
							"x-vercel-blob-store-id": a.storeId,
							"x-api-blob-request-attempt": String(d),
							"x-api-version": n,
							...f ? {
								"x-content-length": String(h)
							} : {},
							...void 0 !== i ? {
								authorization: `Bearer ${i}`
							} : {},
							...s,
							...t.headers
						}
					},
					onUploadProgress: (null == r ? void 0 : r.onUploadProgress) ? e => {
						var t;
						let n = 0 !== h ? h : e;
						p = e;
						let a = h > 0 ? Number((e / n * 100).toFixed(2)) : 0;
						100 === a && h > 0 || null == (t = r.onUploadProgress) || t.call(r, {
							loaded: e,
							total: n,
							percentage: a
						})
					} : void 0
				})
			} catch (t) {
				if (t instanceof I && "AbortError" === t.name) return void e(new et);
				if (t && "[object Error]" === K.call(t) && "TypeError" === t.name && "string" == typeof t.message && ("Load failed" === t.message ? void 0 === t.stack : W.has(t.message))) throw t;
				if (t instanceof TypeError) return void e(t);
				throw t
			}
			if (o.ok) return o;
			let {
				code: l,
				error: y
			} = await en(o);
			if ("unknown_error" === l || "service_unavailable" === l || "internal_server_error" === l) throw y;
			e(y)
		}, {
			retries: function() {
				try {
					let e = o.default.env.VERCEL_BLOB_RETRIES || "10";
					return parseInt(e, 10)
				} catch {
					return 10
				}
			}(),
			onRetry: t => {
				t instanceof Error && U(`retrying API request to ${e}`, t.message), d += 1
			}
		});
		if (!y) throw new Y;
		return (null == r ? void 0 : r.onUploadProgress) && r.onUploadProgress({
			loaded: p,
			total: p,
			percentage: 100
		}), await y.json()
	}
	var eo = {
			jpeg: "image/jpeg",
			png: "image/png",
			webp: "image/webp",
			avif: "image/avif"
		},
		ei = "x-allow-overwrite";

	function es(e, t) {
		let r = {};
		if (r["x-vercel-blob-access"] = t.access, e.includes("contentType") && t.contentType && (r["x-content-type"] = t.contentType), e.includes("addRandomSuffix") && void 0 !== t.addRandomSuffix && (r["x-add-random-suffix"] = t.addRandomSuffix ? "1" : "0"), e.includes("ifMatch") && t.ifMatch) {
			if (!1 === t.allowOverwrite) throw new S("ifMatch and allowOverwrite: false are contradictory. ifMatch is used for conditional overwrites, which requires allowOverwrite to be true.");
			r["x-if-match"] = t.ifMatch, e.includes("allowOverwrite") && void 0 === t.allowOverwrite && (r[ei] = "1")
		}
		return e.includes("allowOverwrite") && void 0 !== t.allowOverwrite && (r[ei] = t.allowOverwrite ? "1" : "0"), e.includes("cacheControlMaxAge") && void 0 !== t.cacheControlMaxAge && (r["x-cache-control-max-age"] = t.cacheControlMaxAge.toString()), r
	}
	async function ec({
		pathname: e,
		options: t,
		extraChecks: r,
		getToken: n
	}) {
		if (!e) throw new S("pathname is required");
		if (e.length > 950) throw new S("pathname is too long, maximum length is 950");
		for (let t of T)
			if (e.includes(t)) throw new S(`pathname cannot contain "${t}", please encode it if needed`);
		if (!t) throw new S("missing options, see usage");
		if ("public" !== t.access && "private" !== t.access) throw new S('access must be "private" or "public", see https://vercel.com/docs/vercel-blob');
		return r && r(t), n && (t.token = await n(e, t)), t
	}
	async function el({
		uploadId: e,
		key: t,
		pathname: r,
		parts: n,
		headers: a,
		options: o
	}) {
		let i = new URLSearchParams({
			pathname: r
		});
		try {
			let r = await ea(`/mpu?${i.toString()}`, {
				method: "POST",
				headers: {
					...a,
					"content-type": "application/json",
					"x-mpu-action": "complete",
					"x-mpu-upload-id": e,
					"x-mpu-key": encodeURIComponent(t)
				},
				body: JSON.stringify(n),
				signal: o.abortSignal
			}, o);
			return U("mpu: complete", r), r
		} catch (e) {
			if (e instanceof TypeError && ("Failed to fetch" === e.message || "fetch failed" === e.message)) throw new Z;
			throw e
		}
	}
	async function eu(e, t, r) {
		U("mpu: create", "pathname:", e);
		let n = new URLSearchParams({
			pathname: e
		});
		try {
			let e = await ea(`/mpu?${n.toString()}`, {
				method: "POST",
				headers: {
					...t,
					"x-mpu-action": "create"
				},
				signal: r.abortSignal
			}, r);
			return U("mpu: create", e), e
		} catch (e) {
			if (e instanceof TypeError && ("Failed to fetch" === e.message || "fetch failed" === e.message)) throw new Z;
			throw e
		}
	}
	async function ed({
		uploadId: e,
		key: t,
		pathname: r,
		headers: n,
		options: a,
		internalAbortController: o = new AbortController,
		part: i
	}) {
		var s, c, l;
		let u = new URLSearchParams({
				pathname: r
			}),
			d = ea(`/mpu?${u.toString()}`, {
				signal: o.signal,
				method: "POST",
				headers: {
					...n,
					"x-mpu-action": "upload",
					"x-mpu-key": encodeURIComponent(t),
					"x-mpu-upload-id": e,
					"x-mpu-part-number": i.partNumber.toString()
				},
				body: i.blob
			}, a);

		function h() {
			o.abort()
		}(null == (s = a.abortSignal) ? void 0 : s.aborted) ? h(): null == (c = a.abortSignal) || c.addEventListener("abort", h);
		let p = await d;
		return null == (l = a.abortSignal) || l.removeEventListener("abort", h), p
	}
	var eh = "u" > typeof window ? 6 : 8,
		ep = 8388608 * eh * 2;
	async function ef(e, t, r, n) {
		U("mpu: init", "pathname:", e, "headers:", r);
		let a = {
			...n,
			onUploadProgress: void 0
		};
		if (void 0 !== n.maximumSizeInBytes && !O(t) && H(t) > n.maximumSizeInBytes) throw new S(`Body size of ${H(t)} bytes exceeds the maximum allowed size of ${n.maximumSizeInBytes} bytes`);
		let o = await eu(e, r, a),
			i = H(t),
			s = await p(t),
			c = await

		function({
			uploadId: e,
			key: t,
			pathname: r,
			stream: n,
			headers: a,
			options: o,
			totalToLoad: i
		}) {
			U("mpu: upload init", "key:", t);
			let s = new AbortController;
			return new Promise((c, l) => {
				let u, h = [],
					p = [],
					f = n.getReader(),
					y = 0,
					w = !1,
					m = 1,
					b = !1,
					E = 0,
					v = !1,
					A = 0,
					S = [],
					_ = 0,
					T = {};
				async function k() {
					for (U("mpu: upload read start", "activeUploads:", y, "currentBytesInMemory:", `${g(E)}/${g(ep)}`, "bytesSent:", g(A)), w = !0; E < ep && !b;) try {
						let {
							value: e,
							done: t
						} = await f.read();
						if (t) {
							v = !0, U("mpu: upload read consumed the whole stream"), S.length > 0 ? (h.push({
								partNumber: m++,
								blob: new Blob(S, {
									type: "application/octet-stream"
								})
							}), C()) : 0 === y && (f.releaseLock(), c(p)), w = !1;
							return
						}
						E += e.byteLength;
						let r = 0;
						for (; r < e.byteLength;) {
							let t = 8388608 - _,
								n = Math.min(r + t, e.byteLength),
								a = e.slice(r, n);
							S.push(a), _ += a.byteLength, r = n, 8388608 === _ && (h.push({
								partNumber: m++,
								blob: new Blob(S, {
									type: "application/octet-stream"
								})
							}), S = [], _ = 0, C())
						}
					} catch (e) {
						H(e)
					}
					U("mpu: upload read end", "activeUploads:", y, "currentBytesInMemory:", `${g(E)}/${g(ep)}`, "bytesSent:", g(A)), w = !1
				}
				async function P(n) {
					y++, U("mpu: upload send part start", "partNumber:", n.partNumber, "size:", n.blob.size, "activeUploads:", y, "currentBytesInMemory:", `${g(E)}/${g(ep)}`, "bytesSent:", g(A));
					try {
						let i = o.onUploadProgress ? e => {
								T[n.partNumber] = e.loaded, u && u()
							} : void 0,
							l = await ed({
								uploadId: e,
								key: t,
								pathname: r,
								headers: a,
								options: {
									...o,
									onUploadProgress: i
								},
								internalAbortController: s,
								part: n
							});
						if (U("mpu: upload send part end", "partNumber:", n.partNumber, "activeUploads", y, "currentBytesInMemory:", `${g(E)}/${g(ep)}`, "bytesSent:", g(A)), b) return;
						if (p.push({
								partNumber: n.partNumber,
								etag: l.etag
							}), E -= n.blob.size, y--, A += n.blob.size, h.length > 0 && C(), v) {
							0 === y && (f.releaseLock(), c(p));
							return
						}
						w || k().catch(H)
					} catch (e) {
						H(e)
					}
				}

				function C() {
					if (!b)
						for (U("send parts", "activeUploads", y, "partsToUpload", h.length); y < eh && h.length > 0;) {
							let e = h.shift();
							e && P(e)
						}
				}

				function H(e) {
					b || (b = !0, s.abort(), f.releaseLock(), e instanceof TypeError && ("Failed to fetch" === e.message || "fetch failed" === e.message) ? l(new Z) : l(e))
				}
				o.onUploadProgress && (u = (0, d.default)(() => {
					var e;
					let t = Object.values(T).reduce((e, t) => e + t, 0),
						r = i || t,
						n = i > 0 ? Number((100 * (t / i || t)).toFixed(2)) : 0;
					null == (e = o.onUploadProgress) || e.call(o, {
						loaded: t,
						total: r,
						percentage: n
					})
				}, 150)), k().catch(H)
			})
		}({
			uploadId: o.uploadId,
			key: o.key,
			pathname: e,
			stream: s,
			headers: r,
			options: n,
			totalToLoad: i
		});
		return await el({
			uploadId: o.uploadId,
			key: o.key,
			pathname: e,
			parts: c,
			headers: r,
			options: a
		})
	}

	function ey({
		allowedOptions: e,
		getToken: t,
		getPresignedUrlPayload: r,
		extraChecks: n
	}) {
		return async function(a, o, i) {
			var s;
			if (!o) throw new S("body is required");
			if (_(o)) throw new S("Body must be a string, buffer or stream. You sent a plain JavaScript object, double check what you're trying to upload.");
			let c = await ec({
					pathname: a,
					options: i,
					extraChecks: n,
					getToken: t
				}),
				l = await (null == r ? void 0 : r(a, c)),
				u = {
					...c,
					presignedUrlPayload: l
				},
				h = es(e, c);
			if (c.optimizeImage) {
				if (!0 === c.multipart) throw new S("optimizeImage cannot be combined with multipart uploads");
				var p, f, y = null != (s = c.contentType) ? s : "u" > typeof Blob && o instanceof Blob ? o.type : void 0;
				if (y && "application/octet-stream" !== y && !y.startsWith("image/")) throw new S(`optimizeImage requires an image body, but the content type is "${y}"`);
				let e = new URLSearchParams({
					pathname: a
				});
				(function(e) {
					if ("object" != typeof e || null === e) throw new S("optimizeImage must be an object, see usage");
					let {
						width: t,
						quality: r,
						format: n
					} = e;
					if (!Number.isInteger(t) || t < 1 || t > 8192) throw new S("optimizeImage.width must be an integer between 1 and 8192");
					if (void 0 !== r && (!Number.isInteger(r) || r < 1 || r > 100)) throw new S("optimizeImage.quality must be an integer between 1 and 100");
					if (void 0 !== n && !(n in eo)) throw new S(`optimizeImage.format must be one of: ${Object.keys(eo).join(", ")}`)
				})(p = c.optimizeImage), e.set("width", String(p.width)), e.set("quality", String(null != (f = p.quality) ? f : 75)), p.format && e.set("format", eo[p.format]);
				let t = await ea(`/put-optimized?${e.toString()}`, {
					method: "POST",
					body: o,
					headers: h,
					signal: c.abortSignal
				}, u);
				return {
					url: t.url,
					downloadUrl: t.downloadUrl,
					pathname: t.pathname,
					contentType: t.contentType,
					contentDisposition: t.contentDisposition,
					etag: t.etag
				}
			}
			if (!0 === c.multipart) return ef(a, o, h, u);
			let w = c.onUploadProgress ? (0, d.default)(c.onUploadProgress, 100) : void 0,
				m = new URLSearchParams({
					pathname: a
				}),
				g = await ea(`/?${m.toString()}`, {
					method: "PUT",
					body: o,
					headers: h,
					signal: c.abortSignal
				}, {
					...u,
					onUploadProgress: w
				});
			return {
				url: g.url,
				downloadUrl: g.downloadUrl,
				pathname: g.pathname,
				contentType: g.contentType,
				contentDisposition: g.contentDisposition,
				etag: g.etag
			}
		}
	}

	function ew(e) {
		return function(t) {
			if (!t.token.startsWith("vercel_blob_client_")) throw new S(`${e} must be called with a client token`);
			if (void 0 !== t.addRandomSuffix || void 0 !== t.allowOverwrite || void 0 !== t.cacheControlMaxAge) throw new S(`${e} doesn't allow \`addRandomSuffix\`, \`cacheControlMaxAge\` or \`allowOverwrite\`. Configure these options at the server side when generating client tokens.`)
		}
	}
	new TextEncoder, ey({
			allowedOptions: ["contentType"],
			extraChecks: ew("client/`put`")
		}),
		function({
			allowedOptions: e,
			getToken: t,
			extraChecks: r
		}) {}({
			allowedOptions: ["contentType"],
			extraChecks: ew("client/`createMultipartUpload`")
		}),
		function({
			allowedOptions: e,
			getToken: t,
			extraChecks: r
		}) {}({
			allowedOptions: ["contentType"],
			extraChecks: ew("client/`createMultipartUpload`")
		}),
		function({
			allowedOptions: e,
			getToken: t,
			extraChecks: r
		}) {}({
			allowedOptions: ["contentType"],
			extraChecks: ew("client/`multipartUpload`")
		}),
		function({
			allowedOptions: e,
			getToken: t,
			extraChecks: r
		}) {}({
			allowedOptions: ["contentType"],
			extraChecks: ew("client/`completeMultipartUpload`")
		});
	var em = ey({
		allowedOptions: ["contentType"],
		extraChecks(e) {
			if (void 0 === e.handleUploadUrl) throw new S("client/`upload` requires the 'handleUploadUrl' parameter");
			if (void 0 !== e.addRandomSuffix || void 0 !== e.allowOverwrite || void 0 !== e.cacheControlMaxAge || void 0 !== e.ifMatch) throw new S("client/`upload` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating client tokens.")
		},
		async getToken(e, t) {
			var r, n;
			return eg({
				handleUploadUrl: t.handleUploadUrl,
				pathname: e,
				clientPayload: null != (r = t.clientPayload) ? r : null,
				multipart: null != (n = t.multipart) && n,
				headers: t.headers
			})
		}
	});
	ey({
		allowedOptions: ["contentType"],
		extraChecks(e) {
			if (void 0 === e.handleUploadUrl) throw new S("client/`upload` requires the 'handleUploadUrl' parameter");
			if (void 0 !== e.addRandomSuffix || void 0 !== e.allowOverwrite || void 0 !== e.cacheControlMaxAge || void 0 !== e.ifMatch) throw new S("client/`uploadPresigned` doesn't allow `addRandomSuffix`, `cacheControlMaxAge`, `allowOverwrite` or `ifMatch`. Configure these options at the server side when generating presigned URLs.")
		},
		async getPresignedUrlPayload(e, t) {
			var r, n;
			return eb({
				pathname: e,
				handleUploadUrl: t.handleUploadUrl,
				clientPayload: null != (r = t.clientPayload) ? r : null,
				multipart: null != (n = t.multipart) && n,
				headers: t.headers
			})
		}
	});
	async function eg(e) {
		let {
			handleUploadUrl: t,
			pathname: r
		} = e, n = ev(t) ? t : eE(t), a = {
			type: "blob.generate-client-token",
			payload: {
				pathname: r,
				clientPayload: e.clientPayload,
				multipart: e.multipart
			}
		}, o = await u(n, {
			method: "POST",
			body: JSON.stringify(a),
			headers: {
				"content-type": "application/json",
				...e.headers
			},
			signal: e.abortSignal
		});
		if (!o.ok) throw new S("Failed to  retrieve the client token");
		try {
			let {
				clientToken: e
			} = await o.json();
			return e
		} catch {
			throw new S("Failed to retrieve the client token")
		}
	}
	async function eb(e) {
		let {
			handleUploadUrl: t,
			pathname: r
		} = e, n = ev(t) ? t : eE(t), a = {
			type: "blob.generate-presigned-url",
			payload: {
				pathname: r,
				clientPayload: e.clientPayload,
				multipart: e.multipart
			}
		}, o = await u(n, {
			method: "POST",
			body: JSON.stringify(a),
			headers: {
				"content-type": "application/json",
				...e.headers
			},
			signal: e.abortSignal
		});
		if (!o.ok) throw new S("Failed to retrieve the presigned URL");
		try {
			let {
				presignedUrlPayload: e
			} = await o.json();
			if (e) return e;
			throw new S("Missing presignedUrlPayload")
		} catch (e) {
			if (e instanceof S) throw e;
			throw new S("Failed to retrieve the presigned URL")
		}
	}

	function eE(e) {
		return new URL(e, location.href).href
	}

	function ev(e) {
		try {
			return new URL(e), !0
		} catch {
			return !1
		}
	}
	e.s(["f", 0, em], 937129)
}, 840422, (e, t, r) => {
	"use strict";
	var n = Object.defineProperty,
		a = Object.getOwnPropertyDescriptor,
		o = Object.getOwnPropertyNames,
		i = Object.prototype.hasOwnProperty,
		s = {},
		c = {
			AccessTokenMissingError: () => u,
			RefreshAccessTokenFailedError: () => d
		};
	for (var l in c) n(s, l, {
		get: c[l],
		enumerable: !0
	});
	t.exports = ((e, t, r) => {
		if (t && "object" == typeof t || "function" == typeof t)
			for (let s of o(t)) i.call(e, s) || void 0 === s || n(e, s, {
				get: () => t[s],
				enumerable: !(r = a(t, s)) || r.enumerable
			});
		return e
	})(n({}, "__esModule", {
		value: !0
	}), s);
	class u extends Error {
		constructor() {
			super("No authentication found. Please log in with the Vercel CLI (vercel login)."), this.name = "AccessTokenMissingError"
		}
	}
	class d extends Error {
		constructor(e) {
			super("Failed to refresh authentication token."), this.name = "RefreshAccessTokenFailedError", void 0 !== e && (this.cause = e)
		}
	}
}, 435615, (e, t, r) => {
	"use strict";
	var n = Object.defineProperty,
		a = Object.getOwnPropertyDescriptor,
		o = Object.getOwnPropertyNames,
		i = Object.prototype.hasOwnProperty,
		s = {},
		c = {
			SYMBOL_FOR_REQ_CONTEXT: () => u,
			getContext: () => d
		};
	for (var l in c) n(s, l, {
		get: c[l],
		enumerable: !0
	});
	t.exports = ((e, t, r) => {
		if (t && "object" == typeof t || "function" == typeof t)
			for (let s of o(t)) i.call(e, s) || void 0 === s || n(e, s, {
				get: () => t[s],
				enumerable: !(r = a(t, s)) || r.enumerable
			});
		return e
	})(n({}, "__esModule", {
		value: !0
	}), s);
	let u = Symbol.for("@vercel/request-context");

	function d() {
		let e = globalThis;
		return e[u]?.get?.() ?? {}
	}
}, 56424, (e, t, r) => {
	"use strict";
	var n = Object.defineProperty,
		a = Object.getOwnPropertyDescriptor,
		o = Object.getOwnPropertyNames,
		i = Object.prototype.hasOwnProperty,
		s = {},
		c = {
			AccessTokenMissingError: () => h.AccessTokenMissingError,
			RefreshAccessTokenFailedError: () => h.RefreshAccessTokenFailedError,
			getContext: () => u.getContext,
			getVercelOidcToken: () => p,
			getVercelOidcTokenSync: () => f,
			getVercelToken: () => y,
			verifyVercelOidcToken: () => d.verifyVercelOidcToken
		};
	for (var l in c) n(s, l, {
		get: c[l],
		enumerable: !0
	});
	t.exports = ((e, t, r) => {
		if (t && "object" == typeof t || "function" == typeof t)
			for (let s of o(t)) i.call(e, s) || void 0 === s || n(e, s, {
				get: () => t[s],
				enumerable: !(r = a(t, s)) || r.enumerable
			});
		return e
	})(n({}, "__esModule", {
		value: !0
	}), s);
	var u = e.r(435615),
		d = e.r(822474),
		h = e.r(840422);
	async function p() {
		return ""
	}

	function f() {
		return ""
	}
	async function y() {
		throw Error("getVercelToken is not supported in browser environments")
	}
}, 822474, (e, t, r) => {
	"use strict";
	var n = e.i(914374),
		a = Object.defineProperty,
		o = Object.getOwnPropertyDescriptor,
		i = Object.getOwnPropertyNames,
		s = Object.prototype.hasOwnProperty,
		c = {},
		l = {
			verifyVercelOidcToken: () => w
		};
	for (var u in l) a(c, u, {
		get: l[u],
		enumerable: !0
	});
	t.exports = ((e, t, r) => {
		if (t && "object" == typeof t || "function" == typeof t)
			for (let n of i(t)) s.call(e, n) || void 0 === n || a(e, n, {
				get: () => t[n],
				enumerable: !(r = o(t, n)) || r.enumerable
			});
		return e
	})(a({}, "__esModule", {
		value: !0
	}), c);
	var d = e.r(951584);
	let h = "https://oidc.vercel.com",
		p = new URL("https://oidc.vercel.com/.well-known/jwks"),
		f = ["RS256"],
		y = (0, d.createRemoteJWKSet)(p);
	async function w(e, t) {
		var r;
		let {
			algorithms: a,
			projectId: o = n.default.env.VERCEL_PROJECT_ID,
			environment: i = n.default.env.VERCEL_TARGET_ENV || n.default.env.VERCEL_ENV,
			ownerId: s,
			...c
		} = t ?? {};
		if ("*" === o && void 0 === s && !(Array.isArray(r = c.audience) ? r.length > 0 : void 0 !== r)) throw TypeError("Expected ownerId or audience to be provided when projectId is '*'.");
		let l = await (0, d.jwtVerify)(e, y, {
			...c,
			algorithms: a ?? f
		});
		return function(e) {
				if (e !== h && ("string" != typeof e || !e.startsWith(`${h}/`))) throw TypeError(`Expected Vercel OIDC token iss claim to be "${h}" or to start with "${h}/".`)
			}(l.payload.iss), m({
				actual: l.payload.project_id,
				claim: "project_id",
				env: "VERCEL_PROJECT_ID",
				expected: o,
				option: "projectId"
			}), m({
				actual: l.payload.environment,
				claim: "environment",
				env: "VERCEL_TARGET_ENV or VERCEL_ENV",
				expected: i,
				option: "environment"
			}),
			function({
				actual: e,
				claim: t,
				expected: r
			}) {
				if (void 0 !== r && e !== r) throw TypeError(`Expected Vercel OIDC token ${t} claim to be "${r}".`)
			}({
				actual: l.payload.owner_id,
				claim: "owner_id",
				expected: s
			}), l
	}

	function m({
		actual: e,
		claim: t,
		env: r,
		expected: n,
		option: a
	}) {
		if ("*" !== n) {
			if (void 0 === n || 0 === n.length) throw TypeError(`Expected ${r} to be set or ${a} to be provided. Pass ${a}: '*' to allow any ${t} claim.`);
			if (!(Array.isArray(n) && "string" == typeof e && n.includes(e)) && e !== n) throw TypeError(Array.isArray(n) ? `Expected Vercel OIDC token ${t} claim to be one of: ${n.map(e=>`"${e}"`).join(", ")}.` : `Expected Vercel OIDC token ${t} claim to be "${n}".`)
		}
	}
}, 452172, (e, t, r) => {
	var n = e.r(629103);
	t.exports = function(e, t) {
		return new Promise(function(r, a) {
			var o, i = t || {};

			function s(e) {
				a(e || Error("Aborted"))
			}

			function c(e, t) {
				e.bail ? s(e) : o.retry(e) ? i.onRetry && i.onRetry(e, t) : a(o.mainError())
			}
			"randomize" in i || (i.randomize = !0), (o = n.operation(i)).attempt(function(t) {
				var n;
				try {
					n = e(s, t)
				} catch (e) {
					c(e, t);
					return
				}
				Promise.resolve(n).then(r).catch(function(e) {
					c(e, t)
				})
			})
		})
	}
}, 906202, (e, t, r) => {
	t.exports = function(e) {
		return null != e && null != e.constructor && "function" == typeof e.constructor.isBuffer && e.constructor.isBuffer(e)
	}
}, 951584, e => {
	"use strict";
	let t, r, n, a = crypto,
		o = async (e, t) => {
			let r = `SHA-${e.slice(-3)}`;
			return new Uint8Array(await a.subtle.digest(r, t))
		}, i = new TextEncoder, s = new TextDecoder;

	function c(...e) {
		let t = new Uint8Array(e.reduce((e, {
				length: t
			}) => e + t, 0)),
			r = 0;
		for (let n of e) t.set(n, r), r += n.length;
		return t
	}

	function l(e, t, r) {
		if (t < 0 || t >= 0x100000000) throw RangeError(`value must be >= 0 and <= 4294967295. Received ${t}`);
		e.set([t >>> 24, t >>> 16, t >>> 8, 255 & t], r)
	}

	function u(e) {
		let t = Math.floor(e / 0x100000000),
			r = new Uint8Array(8);
		return l(r, t, 0), l(r, e % 0x100000000, 4), r
	}

	function d(e) {
		let t = new Uint8Array(4);
		return l(t, e), t
	}

	function h(e) {
		return c(d(e.length), e)
	}
	async function p(e, t, r) {
		let n = Math.ceil((t >> 3) / 32),
			a = new Uint8Array(32 * n);
		for (let t = 0; t < n; t++) {
			let n = new Uint8Array(4 + e.length + r.length);
			n.set(d(t + 1)), n.set(e, 4), n.set(r, 4 + e.length), a.set(await o("sha256", n), 32 * t)
		}
		return a.slice(0, t >> 3)
	}
	let f = e => {
			let t = e;
			"string" == typeof t && (t = i.encode(t));
			let r = [];
			for (let e = 0; e < t.length; e += 32768) r.push(String.fromCharCode.apply(null, t.subarray(e, e + 32768)));
			return btoa(r.join(""))
		},
		y = e => f(e).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_"),
		w = e => {
			let t = atob(e),
				r = new Uint8Array(t.length);
			for (let e = 0; e < t.length; e++) r[e] = t.charCodeAt(e);
			return r
		},
		m = e => {
			let t = e;
			t instanceof Uint8Array && (t = s.decode(t)), t = t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
			try {
				return w(t)
			} catch {
				throw TypeError("The input to be decoded is not correctly encoded.")
			}
		};
	class g extends Error {
		constructor(e, t) {
			super(e, t), this.code = "ERR_JOSE_GENERIC", this.name = this.constructor.name, Error.captureStackTrace?.(this, this.constructor)
		}
	}
	g.code = "ERR_JOSE_GENERIC";
	class b extends g {
		constructor(e, t, r = "unspecified", n = "unspecified") {
			super(e, {
				cause: {
					claim: r,
					reason: n,
					payload: t
				}
			}), this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED", this.claim = r, this.reason = n, this.payload = t
		}
	}
	b.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
	class E extends g {
		constructor(e, t, r = "unspecified", n = "unspecified") {
			super(e, {
				cause: {
					claim: r,
					reason: n,
					payload: t
				}
			}), this.code = "ERR_JWT_EXPIRED", this.claim = r, this.reason = n, this.payload = t
		}
	}
	E.code = "ERR_JWT_EXPIRED";
	class v extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_ALG_NOT_ALLOWED"
		}
	}
	v.code = "ERR_JOSE_ALG_NOT_ALLOWED";
	class A extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JOSE_NOT_SUPPORTED"
		}
	}
	A.code = "ERR_JOSE_NOT_SUPPORTED";
	class S extends g {
		constructor(e = "decryption operation failed", t) {
			super(e, t), this.code = "ERR_JWE_DECRYPTION_FAILED"
		}
	}
	S.code = "ERR_JWE_DECRYPTION_FAILED";
	class _ extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JWE_INVALID"
		}
	}
	_.code = "ERR_JWE_INVALID";
	class T extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JWS_INVALID"
		}
	}
	T.code = "ERR_JWS_INVALID";
	class k extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JWT_INVALID"
		}
	}
	k.code = "ERR_JWT_INVALID";
	class P extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JWK_INVALID"
		}
	}
	P.code = "ERR_JWK_INVALID";
	class C extends g {
		constructor() {
			super(...arguments), this.code = "ERR_JWKS_INVALID"
		}
	}
	C.code = "ERR_JWKS_INVALID";
	class H extends g {
		constructor(e = "no applicable key found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_NO_MATCHING_KEY"
		}
	}
	H.code = "ERR_JWKS_NO_MATCHING_KEY";
	class R extends g {
		constructor(e = "multiple matching keys found in the JSON Web Key Set", t) {
			super(e, t), this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS"
		}
	}
	R.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
	class O extends g {
		constructor(e = "request timed out", t) {
			super(e, t), this.code = "ERR_JWKS_TIMEOUT"
		}
	}
	O.code = "ERR_JWKS_TIMEOUT";
	class x extends g {
		constructor(e = "signature verification failed", t) {
			super(e, t), this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED"
		}
	}
	x.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED", e.s(["JOSEAlgNotAllowed", 0, v, "JOSEError", 0, g, "JOSENotSupported", 0, A, "JWEDecryptionFailed", 0, S, "JWEInvalid", 0, _, "JWKInvalid", 0, P, "JWKSInvalid", 0, C, "JWKSMultipleMatchingKeys", 0, R, "JWKSNoMatchingKey", 0, H, "JWKSTimeout", 0, O, "JWSInvalid", 0, T, "JWSSignatureVerificationFailed", 0, x, "JWTClaimValidationFailed", 0, b, "JWTExpired", 0, E, "JWTInvalid", 0, k], 133186);
	let U = a.getRandomValues.bind(a);

	function I(e) {
		switch (e) {
			case "A128GCM":
			case "A128GCMKW":
			case "A192GCM":
			case "A192GCMKW":
			case "A256GCM":
			case "A256GCMKW":
				return 96;
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512":
				return 128;
			default:
				throw new A(`Unsupported JWE Algorithm: ${e}`)
		}
	}
	let K = (e, t) => {
			if (t.length << 3 !== I(e)) throw new _("Invalid Initialization Vector length")
		},
		W = (e, t) => {
			let r = e.byteLength << 3;
			if (r !== t) throw new _(`Invalid Content Encryption Key length. Expected ${t} bits, got ${r} bits`)
		};

	function J(e, t = "algorithm.name") {
		return TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`)
	}

	function B(e, t) {
		return e.name === t
	}

	function M(e) {
		return parseInt(e.name.slice(4), 10)
	}

	function D(e, t) {
		if (t.length && !t.some(t => e.usages.includes(t))) {
			let e = "CryptoKey does not support this operation, its usages must include ";
			if (t.length > 2) {
				let r = t.pop();
				e += `one of ${t.join(", ")}, or ${r}.`
			} else 2 === t.length ? e += `one of ${t[0]} or ${t[1]}.` : e += `${t[0]}.`;
			throw TypeError(e)
		}
	}

	function L(e, t, ...r) {
		switch (t) {
			case "A128GCM":
			case "A192GCM":
			case "A256GCM": {
				if (!B(e.algorithm, "AES-GCM")) throw J("AES-GCM");
				let r = parseInt(t.slice(1, 4), 10);
				if (e.algorithm.length !== r) throw J(r, "algorithm.length");
				break
			}
			case "A128KW":
			case "A192KW":
			case "A256KW": {
				if (!B(e.algorithm, "AES-KW")) throw J("AES-KW");
				let r = parseInt(t.slice(1, 4), 10);
				if (e.algorithm.length !== r) throw J(r, "algorithm.length");
				break
			}
			case "ECDH":
				switch (e.algorithm.name) {
					case "ECDH":
					case "X25519":
					case "X448":
						break;
					default:
						throw J("ECDH, X25519, or X448")
				}
				break;
			case "PBES2-HS256+A128KW":
			case "PBES2-HS384+A192KW":
			case "PBES2-HS512+A256KW":
				if (!B(e.algorithm, "PBKDF2")) throw J("PBKDF2");
				break;
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512": {
				if (!B(e.algorithm, "RSA-OAEP")) throw J("RSA-OAEP");
				let r = parseInt(t.slice(9), 10) || 1;
				if (M(e.algorithm.hash) !== r) throw J(`SHA-${r}`, "algorithm.hash");
				break
			}
			default:
				throw TypeError("CryptoKey does not support this operation")
		}
		D(e, r)
	}

	function N(e, t, ...r) {
		if ((r = r.filter(Boolean)).length > 2) {
			let t = r.pop();
			e += `one of type ${r.join(", ")}, or ${t}.`
		} else 2 === r.length ? e += `one of type ${r[0]} or ${r[1]}.` : e += `of type ${r[0]}.`;
		return null == t ? e += ` Received ${t}` : "function" == typeof t && t.name ? e += ` Received function ${t.name}` : "object" == typeof t && null != t && t.constructor?.name && (e += ` Received an instance of ${t.constructor.name}`), e
	}
	let j = (e, ...t) => N("Key must be ", e, ...t);

	function $(e, t, ...r) {
		return N(`Key for the ${e} algorithm must be `, t, ...r)
	}
	let V = e => e instanceof CryptoKey || e?.[Symbol.toStringTag] === "KeyObject",
		F = ["CryptoKey"];
	async function G(e, t, r, n, o, i) {
		let s, l;
		if (!(t instanceof Uint8Array)) throw TypeError(j(t, "Uint8Array"));
		let d = parseInt(e.slice(1, 4), 10),
			h = await a.subtle.importKey("raw", t.subarray(d >> 3), "AES-CBC", !1, ["decrypt"]),
			p = await a.subtle.importKey("raw", t.subarray(0, d >> 3), {
				hash: `SHA-${d<<1}`,
				name: "HMAC"
			}, !1, ["sign"]),
			f = c(i, n, r, u(i.length << 3)),
			y = new Uint8Array((await a.subtle.sign("HMAC", p, f)).slice(0, d >> 3));
		try {
			s = ((e, t) => {
				if (!(e instanceof Uint8Array)) throw TypeError("First argument must be a buffer");
				if (!(t instanceof Uint8Array)) throw TypeError("Second argument must be a buffer");
				if (e.length !== t.length) throw TypeError("Input buffers must have the same length");
				let r = e.length,
					n = 0,
					a = -1;
				for (; ++a < r;) n |= e[a] ^ t[a];
				return 0 === n
			})(o, y)
		} catch {}
		if (!s) throw new S;
		try {
			l = new Uint8Array(await a.subtle.decrypt({
				iv: n,
				name: "AES-CBC"
			}, h, r))
		} catch {}
		if (!l) throw new S;
		return l
	}
	async function z(e, t, r, n, o, i) {
		let s;
		t instanceof Uint8Array ? s = await a.subtle.importKey("raw", t, "AES-GCM", !1, ["decrypt"]) : (L(t, e, "decrypt"), s = t);
		try {
			return new Uint8Array(await a.subtle.decrypt({
				additionalData: i,
				iv: n,
				name: "AES-GCM",
				tagLength: 128
			}, s, c(r, o)))
		} catch {
			throw new S
		}
	}
	let q = async (e, t, r, n, a, o) => {
		if (!(t instanceof CryptoKey) && !(t instanceof Uint8Array)) throw TypeError(j(t, ...F, "Uint8Array"));
		if (!n) throw new _("JWE Initialization Vector missing");
		if (!a) throw new _("JWE Authentication Tag missing");
		switch (K(e, n), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512":
				return t instanceof Uint8Array && W(t, parseInt(e.slice(-3), 10)), G(e, t, r, n, a, o);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM":
				return t instanceof Uint8Array && W(t, parseInt(e.slice(1, 4), 10)), z(e, t, r, n, a, o);
			default:
				throw new A("Unsupported JWE Content Encryption Algorithm")
		}
	}, X = (...e) => {
		let t, r = e.filter(Boolean);
		if (0 === r.length || 1 === r.length) return !0;
		for (let e of r) {
			let r = Object.keys(e);
			if (!t || 0 === t.size) {
				t = new Set(r);
				continue
			}
			for (let e of r) {
				if (t.has(e)) return !1;
				t.add(e)
			}
		}
		return !0
	};

	function Y(e) {
		if ("object" != typeof e || null === e || "[object Object]" !== Object.prototype.toString.call(e)) return !1;
		if (null === Object.getPrototypeOf(e)) return !0;
		let t = e;
		for (; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
		return Object.getPrototypeOf(e) === t
	}
	let Q = [{
		hash: "SHA-256",
		name: "HMAC"
	}, !0, ["sign"]];

	function Z(e, t) {
		if (e.algorithm.length !== parseInt(t.slice(1, 4), 10)) throw TypeError(`Invalid key size for alg: ${t}`)
	}

	function ee(e, t, r) {
		if (e instanceof CryptoKey) return L(e, t, r), e;
		if (e instanceof Uint8Array) return a.subtle.importKey("raw", e, "AES-KW", !0, [r]);
		throw TypeError(j(e, ...F, "Uint8Array"))
	}
	let et = async (e, t, r) => {
		let n = await ee(t, e, "wrapKey");
		Z(n, e);
		let o = await a.subtle.importKey("raw", r, ...Q);
		return new Uint8Array(await a.subtle.wrapKey("raw", o, n, "AES-KW"))
	}, er = async (e, t, r) => {
		let n = await ee(t, e, "unwrapKey");
		Z(n, e);
		let o = await a.subtle.unwrapKey("raw", r, n, "AES-KW", ...Q);
		return new Uint8Array(await a.subtle.exportKey("raw", o))
	};
	async function en(e, t, r, n, o = new Uint8Array(0), s = new Uint8Array(0)) {
		let l;
		if (!(e instanceof CryptoKey)) throw TypeError(j(e, ...F));
		if (L(e, "ECDH"), !(t instanceof CryptoKey)) throw TypeError(j(t, ...F));
		L(t, "ECDH", "deriveBits");
		let u = c(h(i.encode(r)), h(o), h(s), d(n));
		return l = "X25519" === e.algorithm.name ? 256 : "X448" === e.algorithm.name ? 448 : Math.ceil(parseInt(e.algorithm.namedCurve.substr(-3), 10) / 8) << 3, p(new Uint8Array(await a.subtle.deriveBits({
			name: e.algorithm.name,
			public: e
		}, t, l)), n, u)
	}
	async function ea(e) {
		if (!(e instanceof CryptoKey)) throw TypeError(j(e, ...F));
		return a.subtle.generateKey(e.algorithm, !0, ["deriveBits"])
	}

	function eo(e) {
		if (!(e instanceof CryptoKey)) throw TypeError(j(e, ...F));
		return ["P-256", "P-384", "P-521"].includes(e.algorithm.namedCurve) || "X25519" === e.algorithm.name || "X448" === e.algorithm.name
	}
	async function ei(e, t, r, n) {
		if (!(e instanceof Uint8Array) || e.length < 8) throw new _("PBES2 Salt Input must be 8 or more octets");
		let o = c(i.encode(t), new Uint8Array([0]), e),
			s = parseInt(t.slice(13, 16), 10),
			l = {
				hash: `SHA-${t.slice(8,11)}`,
				iterations: r,
				name: "PBKDF2",
				salt: o
			},
			u = await

		function(e, t) {
			if (e instanceof Uint8Array) return a.subtle.importKey("raw", e, "PBKDF2", !1, ["deriveBits"]);
			if (e instanceof CryptoKey) return L(e, t, "deriveBits", "deriveKey"), e;
			throw TypeError(j(e, ...F, "Uint8Array"))
		}(n, t);
		if (u.usages.includes("deriveBits")) return new Uint8Array(await a.subtle.deriveBits(l, u, s));
		if (u.usages.includes("deriveKey")) return a.subtle.deriveKey(l, u, {
			length: s,
			name: "AES-KW"
		}, !1, ["wrapKey", "unwrapKey"]);
		throw TypeError('PBKDF2 key "usages" must include "deriveBits" or "deriveKey"')
	}
	let es = async (e, t, r, n = 2048, a = U(new Uint8Array(16))) => {
		let o = await ei(a, e, n, t);
		return {
			encryptedKey: await et(e.slice(-6), o, r),
			p2c: n,
			p2s: y(a)
		}
	}, ec = async (e, t, r, n, a) => {
		let o = await ei(a, e, n, t);
		return er(e.slice(-6), o, r)
	};

	function el(e) {
		switch (e) {
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512":
				return "RSA-OAEP";
			default:
				throw new A(`alg ${e} is not supported either by JOSE or your javascript runtime`)
		}
	}
	let eu = (e, t) => {
			if (e.startsWith("RS") || e.startsWith("PS")) {
				let {
					modulusLength: r
				} = t.algorithm;
				if ("number" != typeof r || r < 2048) throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`)
			}
		},
		ed = async (e, t, r) => {
			if (!(t instanceof CryptoKey)) throw TypeError(j(t, ...F));
			if (L(t, e, "encrypt", "wrapKey"), eu(e, t), t.usages.includes("encrypt")) return new Uint8Array(await a.subtle.encrypt(el(e), t, r));
			if (t.usages.includes("wrapKey")) {
				let n = await a.subtle.importKey("raw", r, ...Q);
				return new Uint8Array(await a.subtle.wrapKey("raw", n, t, el(e)))
			}
			throw TypeError('RSA-OAEP key "usages" must include "encrypt" or "wrapKey" for this operation')
		}, eh = async (e, t, r) => {
			if (!(t instanceof CryptoKey)) throw TypeError(j(t, ...F));
			if (L(t, e, "decrypt", "unwrapKey"), eu(e, t), t.usages.includes("decrypt")) return new Uint8Array(await a.subtle.decrypt(el(e), t, r));
			if (t.usages.includes("unwrapKey")) {
				let n = await a.subtle.unwrapKey("raw", r, t, el(e), ...Q);
				return new Uint8Array(await a.subtle.exportKey("raw", n))
			}
			throw TypeError('RSA-OAEP key "usages" must include "decrypt" or "unwrapKey" for this operation')
		};

	function ep(e) {
		return Y(e) && "string" == typeof e.kty
	}
	let ef = async e => {
		if (!e.alg) throw TypeError('"alg" argument is required when "jwk.alg" is not present');
		let {
			algorithm: t,
			keyUsages: r
		} = function(e) {
			let t, r;
			switch (e.kty) {
				case "RSA":
					switch (e.alg) {
						case "PS256":
						case "PS384":
						case "PS512":
							t = {
								name: "RSA-PSS",
								hash: `SHA-${e.alg.slice(-3)}`
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "RS256":
						case "RS384":
						case "RS512":
							t = {
								name: "RSASSA-PKCS1-v1_5",
								hash: `SHA-${e.alg.slice(-3)}`
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "RSA-OAEP":
						case "RSA-OAEP-256":
						case "RSA-OAEP-384":
						case "RSA-OAEP-512":
							t = {
								name: "RSA-OAEP",
								hash: `SHA-${parseInt(e.alg.slice(-3),10)||1}`
							}, r = e.d ? ["decrypt", "unwrapKey"] : ["encrypt", "wrapKey"];
							break;
						default:
							throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
					}
					break;
				case "EC":
					switch (e.alg) {
						case "ES256":
							t = {
								name: "ECDSA",
								namedCurve: "P-256"
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "ES384":
							t = {
								name: "ECDSA",
								namedCurve: "P-384"
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "ES512":
							t = {
								name: "ECDSA",
								namedCurve: "P-521"
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "ECDH-ES":
						case "ECDH-ES+A128KW":
						case "ECDH-ES+A192KW":
						case "ECDH-ES+A256KW":
							t = {
								name: "ECDH",
								namedCurve: e.crv
							}, r = e.d ? ["deriveBits"] : [];
							break;
						default:
							throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
					}
					break;
				case "OKP":
					switch (e.alg) {
						case "Ed25519":
							t = {
								name: "Ed25519"
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "EdDSA":
							t = {
								name: e.crv
							}, r = e.d ? ["sign"] : ["verify"];
							break;
						case "ECDH-ES":
						case "ECDH-ES+A128KW":
						case "ECDH-ES+A192KW":
						case "ECDH-ES+A256KW":
							t = {
								name: e.crv
							}, r = e.d ? ["deriveBits"] : [];
							break;
						default:
							throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
					}
					break;
				default:
					throw new A('Invalid or unsupported JWK "kty" (Key Type) Parameter value')
			}
			return {
				algorithm: t,
				keyUsages: r
			}
		}(e), n = [t, e.ext ?? !1, e.key_ops ?? r], o = {
			...e
		};
		return delete o.alg, delete o.use, a.subtle.importKey("jwk", o, ...n)
	}, ey = e => e?.[Symbol.toStringTag] === "KeyObject", ew = async (e, t, r, n, a = !1) => {
		let o = e.get(t);
		if (o?.[n]) return o[n];
		let i = await ef({
			...r,
			alg: n
		});
		return a && Object.freeze(t), o ? o[n] = i : e.set(t, {
			[n]: i
		}), i
	}, em = (e, t) => {
		if (ey(e)) {
			let n = e.export({
				format: "jwk"
			});
			return (delete n.d, delete n.dp, delete n.dq, delete n.p, delete n.q, delete n.qi, n.k) ? m(n.k) : (r || (r = new WeakMap), ew(r, e, n, t))
		}
		return ep(e) ? e.k ? m(e.k) : (r || (r = new WeakMap), ew(r, e, e, t, !0)) : e
	}, eg = (e, r) => {
		if (ey(e)) {
			let n = e.export({
				format: "jwk"
			});
			return n.k ? m(n.k) : (t || (t = new WeakMap), ew(t, e, n, r))
		}
		return ep(e) ? e.k ? m(e.k) : (t || (t = new WeakMap), ew(t, e, e, r, !0)) : e
	};

	function eb(e) {
		switch (e) {
			case "A128GCM":
				return 128;
			case "A192GCM":
				return 192;
			case "A256GCM":
			case "A128CBC-HS256":
				return 256;
			case "A192CBC-HS384":
				return 384;
			case "A256CBC-HS512":
				return 512;
			default:
				throw new A(`Unsupported JWE Algorithm: ${e}`)
		}
	}
	let eE = e => U(new Uint8Array(eb(e) >> 3)),
		ev = (e, t) => {
			let r = (e.match(/.{1,64}/g) || []).join("\n");
			return `-----BEGIN ${t}-----
${r}
-----END ${t}-----`
		},
		eA = async (e, t, r) => {
			if (!(r instanceof CryptoKey)) throw TypeError(j(r, ...F));
			if (!r.extractable) throw TypeError("CryptoKey is not extractable");
			if (r.type !== e) throw TypeError(`key is not a ${e} key`);
			return ev(f(new Uint8Array(await a.subtle.exportKey(t, r))), `${e.toUpperCase()} KEY`)
		}, eS = (e, t, r = 0) => {
			0 === r && (t.unshift(t.length), t.unshift(6));
			let n = e.indexOf(t[0], r);
			if (-1 === n) return !1;
			let a = e.subarray(n, n + t.length);
			return a.length === t.length && (a.every((e, r) => e === t[r]) || eS(e, t, n + 1))
		}, e_ = e => {
			switch (!0) {
				case eS(e, [42, 134, 72, 206, 61, 3, 1, 7]):
					return "P-256";
				case eS(e, [43, 129, 4, 0, 34]):
					return "P-384";
				case eS(e, [43, 129, 4, 0, 35]):
					return "P-521";
				case eS(e, [43, 101, 110]):
					return "X25519";
				case eS(e, [43, 101, 111]):
					return "X448";
				case eS(e, [43, 101, 112]):
					return "Ed25519";
				case eS(e, [43, 101, 113]):
					return "Ed448";
				default:
					throw new A("Invalid or unsupported EC Key Curve or OKP Key Sub Type")
			}
		}, eT = async (e, t, r, n, o) => {
			let i, s, c = new Uint8Array(atob(r.replace(e, "")).split("").map(e => e.charCodeAt(0))),
				l = "spki" === t;
			switch (n) {
				case "PS256":
				case "PS384":
				case "PS512":
					i = {
						name: "RSA-PSS",
						hash: `SHA-${n.slice(-3)}`
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "RS256":
				case "RS384":
				case "RS512":
					i = {
						name: "RSASSA-PKCS1-v1_5",
						hash: `SHA-${n.slice(-3)}`
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "RSA-OAEP":
				case "RSA-OAEP-256":
				case "RSA-OAEP-384":
				case "RSA-OAEP-512":
					i = {
						name: "RSA-OAEP",
						hash: `SHA-${parseInt(n.slice(-3),10)||1}`
					}, s = l ? ["encrypt", "wrapKey"] : ["decrypt", "unwrapKey"];
					break;
				case "ES256":
					i = {
						name: "ECDSA",
						namedCurve: "P-256"
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "ES384":
					i = {
						name: "ECDSA",
						namedCurve: "P-384"
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "ES512":
					i = {
						name: "ECDSA",
						namedCurve: "P-521"
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "ECDH-ES":
				case "ECDH-ES+A128KW":
				case "ECDH-ES+A192KW":
				case "ECDH-ES+A256KW": {
					let e = e_(c);
					i = e.startsWith("P-") ? {
						name: "ECDH",
						namedCurve: e
					} : {
						name: e
					}, s = l ? [] : ["deriveBits"];
					break
				}
				case "Ed25519":
					i = {
						name: "Ed25519"
					}, s = l ? ["verify"] : ["sign"];
					break;
				case "EdDSA":
					i = {
						name: e_(c)
					}, s = l ? ["verify"] : ["sign"];
					break;
				default:
					throw new A('Invalid or unsupported "alg" (Algorithm) value')
			}
			return a.subtle.importKey(t, c, i, o?.extractable ?? !1, s)
		};

	function ek(e) {
		let t = [],
			r = 0;
		for (; r < e.length;) {
			let n = eP(e.subarray(r));
			t.push(n), r += n.byteLength
		}
		return t
	}

	function eP(e) {
		let t = 0,
			r = 31 & e[0];
		if (t++, 31 === r) {
			for (r = 0; e[t] >= 128;) r = 128 * r + e[t] - 128, t++;
			r = 128 * r + e[t] - 128, t++
		}
		let n = 0;
		if (e[t] < 128) n = e[t], t++;
		else if (128 === n) {
			for (n = 0; 0 !== e[t + n] || 0 !== e[t + n + 1];) {
				if (n > e.byteLength) throw TypeError("invalid indefinite form length");
				n++
			}
			let r = t + n + 2;
			return {
				byteLength: r,
				contents: e.subarray(t, t + n),
				raw: e.subarray(0, r)
			}
		} else {
			let r = 127 & e[t];
			t++, n = 0;
			for (let a = 0; a < r; a++) n = 256 * n + e[t], t++
		}
		let a = t + n;
		return {
			byteLength: a,
			contents: e.subarray(t, a),
			raw: e.subarray(0, a)
		}
	}
	async function eC(e, t, r) {
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN PUBLIC KEY-----")) throw TypeError('"spki" must be SPKI formatted string');
		return eT(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", e, t, r)
	}
	async function eH(e, t, r) {
		let n;
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN CERTIFICATE-----")) throw TypeError('"x509" must be X.509 formatted string');
		try {
			var a;
			let t;
			a = e, n = ev(f((t = ek(ek(eP(w(a.replace(/(?:-----(?:BEGIN|END) CERTIFICATE-----|\s)/g, ""))).contents)[0].contents))[160 === t[0].raw[0] ? 6 : 5].raw), "PUBLIC KEY")
		} catch (e) {
			throw TypeError("Failed to parse the X.509 certificate", {
				cause: e
			})
		}
		return eT(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, "spki", n, t, r)
	}
	async function eR(e, t, r) {
		if ("string" != typeof e || 0 !== e.indexOf("-----BEGIN PRIVATE KEY-----")) throw TypeError('"pkcs8" must be PKCS#8 formatted string');
		return eT(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, "pkcs8", e, t, r)
	}
	async function eO(e, t) {
		if (!Y(e)) throw TypeError("JWK must be an object");
		switch (t || (t = e.alg), e.kty) {
			case "oct":
				if ("string" != typeof e.k || !e.k) throw TypeError('missing "k" (Key Value) Parameter value');
				return m(e.k);
			case "RSA":
				if ("oth" in e && void 0 !== e.oth) throw new A('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
			case "EC":
			case "OKP":
				return ef({
					...e,
					alg: t
				});
			default:
				throw new A('Unsupported "kty" (Key Type) Parameter value')
		}
	}
	let ex = e => e?.[Symbol.toStringTag],
		eU = (e, t, r) => {
			if (void 0 !== t.use && "sig" !== t.use) throw TypeError("Invalid key for this operation, when present its use must be sig");
			if (void 0 !== t.key_ops && t.key_ops.includes?.(r) !== !0) throw TypeError(`Invalid key for this operation, when present its key_ops must include ${r}`);
			if (void 0 !== t.alg && t.alg !== e) throw TypeError(`Invalid key for this operation, when present its alg must be ${e}`);
			return !0
		};

	function eI(e, t, r, n) {
		t.startsWith("HS") || "dir" === t || t.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(t) ? ((e, t, r, n) => {
			if (!(t instanceof Uint8Array)) {
				if (n && ep(t)) {
					if (ep(t) && "oct" === t.kty && "string" == typeof t.k && eU(e, t, r)) return;
					throw TypeError('JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present')
				}
				if (!V(t)) throw TypeError($(e, t, ...F, "Uint8Array", n ? "JSON Web Key" : null));
				if ("secret" !== t.type) throw TypeError(`${ex(t)} instances for symmetric algorithms must be of type "secret"`)
			}
		})(t, r, n, e) : ((e, t, r, n) => {
			if (n && ep(t)) switch (r) {
				case "sign":
					if ("oct" !== t.kty && "string" == typeof t.d && eU(e, t, r)) return;
					throw TypeError("JSON Web Key for this operation be a private JWK");
				case "verify":
					if ("oct" !== t.kty && void 0 === t.d && eU(e, t, r)) return;
					throw TypeError("JSON Web Key for this operation be a public JWK")
			}
			if (!V(t)) throw TypeError($(e, t, ...F, n ? "JSON Web Key" : null));
			if ("secret" === t.type) throw TypeError(`${ex(t)} instances for asymmetric algorithms must not be of type "secret"`);
			if ("sign" === r && "public" === t.type) throw TypeError(`${ex(t)} instances for asymmetric algorithm signing must be of type "private"`);
			if ("decrypt" === r && "public" === t.type) throw TypeError(`${ex(t)} instances for asymmetric algorithm decryption must be of type "private"`);
			if (t.algorithm && "verify" === r && "private" === t.type) throw TypeError(`${ex(t)} instances for asymmetric algorithm verifying must be of type "public"`);
			if (t.algorithm && "encrypt" === r && "private" === t.type) throw TypeError(`${ex(t)} instances for asymmetric algorithm encryption must be of type "public"`)
		})(t, r, n, e)
	}
	let eK = eI.bind(void 0, !1),
		eW = eI.bind(void 0, !0);
	async function eJ(e, t, r, n, o) {
		if (!(r instanceof Uint8Array)) throw TypeError(j(r, "Uint8Array"));
		let i = parseInt(e.slice(1, 4), 10),
			s = await a.subtle.importKey("raw", r.subarray(i >> 3), "AES-CBC", !1, ["encrypt"]),
			l = await a.subtle.importKey("raw", r.subarray(0, i >> 3), {
				hash: `SHA-${i<<1}`,
				name: "HMAC"
			}, !1, ["sign"]),
			d = new Uint8Array(await a.subtle.encrypt({
				iv: n,
				name: "AES-CBC"
			}, s, t)),
			h = c(o, n, d, u(o.length << 3));
		return {
			ciphertext: d,
			tag: new Uint8Array((await a.subtle.sign("HMAC", l, h)).slice(0, i >> 3)),
			iv: n
		}
	}
	async function eB(e, t, r, n, o) {
		let i;
		r instanceof Uint8Array ? i = await a.subtle.importKey("raw", r, "AES-GCM", !1, ["encrypt"]) : (L(r, e, "encrypt"), i = r);
		let s = new Uint8Array(await a.subtle.encrypt({
				additionalData: o,
				iv: n,
				name: "AES-GCM",
				tagLength: 128
			}, i, t)),
			c = s.slice(-16);
		return {
			ciphertext: s.slice(0, -16),
			tag: c,
			iv: n
		}
	}
	let eM = async (e, t, r, n, a) => {
		if (!(r instanceof CryptoKey) && !(r instanceof Uint8Array)) throw TypeError(j(r, ...F, "Uint8Array"));
		switch (n ? K(e, n) : n = U(new Uint8Array(I(e) >> 3)), e) {
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512":
				return r instanceof Uint8Array && W(r, parseInt(e.slice(-3), 10)), eJ(e, t, r, n, a);
			case "A128GCM":
			case "A192GCM":
			case "A256GCM":
				return r instanceof Uint8Array && W(r, parseInt(e.slice(1, 4), 10)), eB(e, t, r, n, a);
			default:
				throw new A("Unsupported JWE Content Encryption Algorithm")
		}
	};
	async function eD(e, t, r, n) {
		let a = e.slice(0, 7),
			o = await eM(a, r, t, n, new Uint8Array(0));
		return {
			encryptedKey: o.ciphertext,
			iv: y(o.iv),
			tag: y(o.tag)
		}
	}
	async function eL(e, t, r, n, a) {
		return q(e.slice(0, 7), t, r, n, a, new Uint8Array(0))
	}
	async function eN(e, t, r, n, a) {
		switch (eK(e, t, "decrypt"), t = await eg?.(t, e) || t, e) {
			case "dir":
				if (void 0 !== r) throw new _("Encountered unexpected JWE Encrypted Key");
				return t;
			case "ECDH-ES":
				if (void 0 !== r) throw new _("Encountered unexpected JWE Encrypted Key");
			case "ECDH-ES+A128KW":
			case "ECDH-ES+A192KW":
			case "ECDH-ES+A256KW": {
				let a, o;
				if (!Y(n.epk)) throw new _('JOSE Header "epk" (Ephemeral Public Key) missing or invalid');
				if (!eo(t)) throw new A("ECDH with the provided key is not allowed or not supported by your javascript runtime");
				let i = await eO(n.epk, e);
				if (void 0 !== n.apu) {
					if ("string" != typeof n.apu) throw new _('JOSE Header "apu" (Agreement PartyUInfo) invalid');
					try {
						a = m(n.apu)
					} catch {
						throw new _("Failed to base64url decode the apu")
					}
				}
				if (void 0 !== n.apv) {
					if ("string" != typeof n.apv) throw new _('JOSE Header "apv" (Agreement PartyVInfo) invalid');
					try {
						o = m(n.apv)
					} catch {
						throw new _("Failed to base64url decode the apv")
					}
				}
				let s = await en(i, t, "ECDH-ES" === e ? n.enc : e, "ECDH-ES" === e ? eb(n.enc) : parseInt(e.slice(-5, -2), 10), a, o);
				if ("ECDH-ES" === e) return s;
				if (void 0 === r) throw new _("JWE Encrypted Key missing");
				return er(e.slice(-6), s, r)
			}
			case "RSA1_5":
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512":
				if (void 0 === r) throw new _("JWE Encrypted Key missing");
				return eh(e, t, r);
			case "PBES2-HS256+A128KW":
			case "PBES2-HS384+A192KW":
			case "PBES2-HS512+A256KW": {
				let o;
				if (void 0 === r) throw new _("JWE Encrypted Key missing");
				if ("number" != typeof n.p2c) throw new _('JOSE Header "p2c" (PBES2 Count) missing or invalid');
				let i = a?.maxPBES2Count || 1e4;
				if (n.p2c > i) throw new _('JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds');
				if ("string" != typeof n.p2s) throw new _('JOSE Header "p2s" (PBES2 Salt) missing or invalid');
				try {
					o = m(n.p2s)
				} catch {
					throw new _("Failed to base64url decode the p2s")
				}
				return ec(e, t, r, n.p2c, o)
			}
			case "A128KW":
			case "A192KW":
			case "A256KW":
				if (void 0 === r) throw new _("JWE Encrypted Key missing");
				return er(e, t, r);
			case "A128GCMKW":
			case "A192GCMKW":
			case "A256GCMKW": {
				let a, o;
				if (void 0 === r) throw new _("JWE Encrypted Key missing");
				if ("string" != typeof n.iv) throw new _('JOSE Header "iv" (Initialization Vector) missing or invalid');
				if ("string" != typeof n.tag) throw new _('JOSE Header "tag" (Authentication Tag) missing or invalid');
				try {
					a = m(n.iv)
				} catch {
					throw new _("Failed to base64url decode the iv")
				}
				try {
					o = m(n.tag)
				} catch {
					throw new _("Failed to base64url decode the tag")
				}
				return eL(e, t, r, a, o)
			}
			default:
				throw new A('Invalid or unsupported "alg" (JWE Algorithm) header value')
		}
	}
	let ej = function(e, t, r, n, a) {
			let o;
			if (void 0 !== a.crit && n?.crit === void 0) throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');
			if (!n || void 0 === n.crit) return new Set;
			if (!Array.isArray(n.crit) || 0 === n.crit.length || n.crit.some(e => "string" != typeof e || 0 === e.length)) throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
			for (let i of (o = void 0 !== r ? new Map([...Object.entries(r), ...t.entries()]) : t, n.crit)) {
				if (!o.has(i)) throw new A(`Extension Header Parameter "${i}" is not recognized`);
				if (void 0 === a[i]) throw new e(`Extension Header Parameter "${i}" is missing`);
				if (o.get(i) && void 0 === n[i]) throw new e(`Extension Header Parameter "${i}" MUST be integrity protected`)
			}
			return new Set(n.crit)
		},
		e$ = (e, t) => {
			if (void 0 !== t && (!Array.isArray(t) || t.some(e => "string" != typeof e))) throw TypeError(`"${e}" option must be an array of strings`);
			if (t) return new Set(t)
		};
	async function eV(e, t, r) {
		let n, a, o, l, u, d, h;
		if (!Y(e)) throw new _("Flattened JWE must be an object");
		if (void 0 === e.protected && void 0 === e.header && void 0 === e.unprotected) throw new _("JOSE Header missing");
		if (void 0 !== e.iv && "string" != typeof e.iv) throw new _("JWE Initialization Vector incorrect type");
		if ("string" != typeof e.ciphertext) throw new _("JWE Ciphertext missing or incorrect type");
		if (void 0 !== e.tag && "string" != typeof e.tag) throw new _("JWE Authentication Tag incorrect type");
		if (void 0 !== e.protected && "string" != typeof e.protected) throw new _("JWE Protected Header incorrect type");
		if (void 0 !== e.encrypted_key && "string" != typeof e.encrypted_key) throw new _("JWE Encrypted Key incorrect type");
		if (void 0 !== e.aad && "string" != typeof e.aad) throw new _("JWE AAD incorrect type");
		if (void 0 !== e.header && !Y(e.header)) throw new _("JWE Shared Unprotected Header incorrect type");
		if (void 0 !== e.unprotected && !Y(e.unprotected)) throw new _("JWE Per-Recipient Unprotected Header incorrect type");
		if (e.protected) try {
			let t = m(e.protected);
			n = JSON.parse(s.decode(t))
		} catch {
			throw new _("JWE Protected Header is invalid")
		}
		if (!X(n, e.header, e.unprotected)) throw new _("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
		let p = {
			...n,
			...e.header,
			...e.unprotected
		};
		if (ej(_, new Map, r?.crit, n, p), void 0 !== p.zip) throw new A('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
		let {
			alg: f,
			enc: y
		} = p;
		if ("string" != typeof f || !f) throw new _("missing JWE Algorithm (alg) in JWE Header");
		if ("string" != typeof y || !y) throw new _("missing JWE Encryption Algorithm (enc) in JWE Header");
		let w = r && e$("keyManagementAlgorithms", r.keyManagementAlgorithms),
			g = r && e$("contentEncryptionAlgorithms", r.contentEncryptionAlgorithms);
		if (w && !w.has(f) || !w && f.startsWith("PBES2")) throw new v('"alg" (Algorithm) Header Parameter value not allowed');
		if (g && !g.has(y)) throw new v('"enc" (Encryption Algorithm) Header Parameter value not allowed');
		if (void 0 !== e.encrypted_key) try {
			a = m(e.encrypted_key)
		} catch {
			throw new _("Failed to base64url decode the encrypted_key")
		}
		let b = !1;
		"function" == typeof t && (t = await t(n, e), b = !0);
		try {
			o = await eN(f, t, a, p, r)
		} catch (e) {
			if (e instanceof TypeError || e instanceof _ || e instanceof A) throw e;
			o = eE(y)
		}
		if (void 0 !== e.iv) try {
			l = m(e.iv)
		} catch {
			throw new _("Failed to base64url decode the iv")
		}
		if (void 0 !== e.tag) try {
			u = m(e.tag)
		} catch {
			throw new _("Failed to base64url decode the tag")
		}
		let E = i.encode(e.protected ?? "");
		d = void 0 !== e.aad ? c(E, i.encode("."), i.encode(e.aad)) : E;
		try {
			h = m(e.ciphertext)
		} catch {
			throw new _("Failed to base64url decode the ciphertext")
		}
		let S = {
			plaintext: await q(y, o, h, l, u, d)
		};
		if (void 0 !== e.protected && (S.protectedHeader = n), void 0 !== e.aad) try {
			S.additionalAuthenticatedData = m(e.aad)
		} catch {
			throw new _("Failed to base64url decode the aad")
		}
		return (void 0 !== e.unprotected && (S.sharedUnprotectedHeader = e.unprotected), void 0 !== e.header && (S.unprotectedHeader = e.header), b) ? {
			...S,
			key: t
		} : S
	}
	async function eF(e, t, r) {
		if (e instanceof Uint8Array && (e = s.decode(e)), "string" != typeof e) throw new _("Compact JWE must be a string or Uint8Array");
		let {
			0: n,
			1: a,
			2: o,
			3: i,
			4: c,
			length: l
		} = e.split(".");
		if (5 !== l) throw new _("Invalid Compact JWE");
		let u = await eV({
				ciphertext: i,
				iv: o || void 0,
				protected: n,
				tag: c || void 0,
				encrypted_key: a || void 0
			}, t, r),
			d = {
				plaintext: u.plaintext,
				protectedHeader: u.protectedHeader
			};
		return "function" == typeof t ? {
			...d,
			key: u.key
		} : d
	}
	async function eG(e, t, r) {
		if (!Y(e)) throw new _("General JWE must be an object");
		if (!Array.isArray(e.recipients) || !e.recipients.every(Y)) throw new _("JWE Recipients missing or incorrect type");
		if (!e.recipients.length) throw new _("JWE Recipients has no members");
		for (let n of e.recipients) try {
			return await eV({
				aad: e.aad,
				ciphertext: e.ciphertext,
				encrypted_key: n.encrypted_key,
				header: n.header,
				iv: e.iv,
				protected: e.protected,
				tag: e.tag,
				unprotected: e.unprotected
			}, t, r)
		} catch {}
		throw new S
	}
	let ez = Symbol(),
		eq = async e => {
			if (e instanceof Uint8Array) return {
				kty: "oct",
				k: y(e)
			};
			if (!(e instanceof CryptoKey)) throw TypeError(j(e, ...F, "Uint8Array"));
			if (!e.extractable) throw TypeError("non-extractable CryptoKey cannot be exported as a JWK");
			let {
				ext: t,
				key_ops: r,
				alg: n,
				use: o,
				...i
			} = await a.subtle.exportKey("jwk", e);
			return i
		};
	async function eX(e) {
		return eA("public", "spki", e)
	}
	async function eY(e) {
		return eA("private", "pkcs8", e)
	}
	async function eQ(e) {
		return eq(e)
	}
	async function eZ(e, t, r, n, a = {}) {
		let o, i, s;
		switch (eK(e, r, "encrypt"), r = await em?.(r, e) || r, e) {
			case "dir":
				s = r;
				break;
			case "ECDH-ES":
			case "ECDH-ES+A128KW":
			case "ECDH-ES+A192KW":
			case "ECDH-ES+A256KW": {
				if (!eo(r)) throw new A("ECDH with the provided key is not allowed or not supported by your javascript runtime");
				let {
					apu: c,
					apv: l
				} = a, {
					epk: u
				} = a;
				u || (u = (await ea(r)).privateKey);
				let {
					x: d,
					y: h,
					crv: p,
					kty: f
				} = await eQ(u), w = await en(r, u, "ECDH-ES" === e ? t : e, "ECDH-ES" === e ? eb(t) : parseInt(e.slice(-5, -2), 10), c, l);
				if (i = {
						epk: {
							x: d,
							crv: p,
							kty: f
						}
					}, "EC" === f && (i.epk.y = h), c && (i.apu = y(c)), l && (i.apv = y(l)), "ECDH-ES" === e) {
					s = w;
					break
				}
				s = n || eE(t);
				let m = e.slice(-6);
				o = await et(m, w, s);
				break
			}
			case "RSA1_5":
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512":
				s = n || eE(t), o = await ed(e, r, s);
				break;
			case "PBES2-HS256+A128KW":
			case "PBES2-HS384+A192KW":
			case "PBES2-HS512+A256KW": {
				s = n || eE(t);
				let {
					p2c: c,
					p2s: l
				} = a;
				({
					encryptedKey: o,
					...i
				} = await es(e, r, s, c, l));
				break
			}
			case "A128KW":
			case "A192KW":
			case "A256KW":
				s = n || eE(t), o = await et(e, r, s);
				break;
			case "A128GCMKW":
			case "A192GCMKW":
			case "A256GCMKW": {
				s = n || eE(t);
				let {
					iv: c
				} = a;
				({
					encryptedKey: o,
					...i
				} = await eD(e, r, s, c));
				break
			}
			default:
				throw new A('Invalid or unsupported "alg" (JWE Algorithm) header value')
		}
		return {
			cek: s,
			encryptedKey: o,
			parameters: i
		}
	}
	class e0 {
		constructor(e) {
			if (!(e instanceof Uint8Array)) throw TypeError("plaintext must be an instance of Uint8Array");
			this._plaintext = e
		}
		setKeyManagementParameters(e) {
			if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
			return this._keyManagementParameters = e, this
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this
		}
		setSharedUnprotectedHeader(e) {
			if (this._sharedUnprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
			return this._sharedUnprotectedHeader = e, this
		}
		setUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this
		}
		setAdditionalAuthenticatedData(e) {
			return this._aad = e, this
		}
		setContentEncryptionKey(e) {
			if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
			return this._cek = e, this
		}
		setInitializationVector(e) {
			if (this._iv) throw TypeError("setInitializationVector can only be called once");
			return this._iv = e, this
		}
		async encrypt(e, t) {
			let r, n, a, o, l;
			if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) throw new _("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
			if (!X(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) throw new _("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
			let u = {
				...this._protectedHeader,
				...this._unprotectedHeader,
				...this._sharedUnprotectedHeader
			};
			if (ej(_, new Map, t?.crit, this._protectedHeader, u), void 0 !== u.zip) throw new A('JWE "zip" (Compression Algorithm) Header Parameter is not supported.');
			let {
				alg: d,
				enc: h
			} = u;
			if ("string" != typeof d || !d) throw new _('JWE "alg" (Algorithm) Header Parameter missing or invalid');
			if ("string" != typeof h || !h) throw new _('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
			if (this._cek && ("dir" === d || "ECDH-ES" === d)) throw TypeError(`setContentEncryptionKey cannot be called with JWE "alg" (Algorithm) Header ${d}`);
			{
				let a;
				({
					cek: n,
					encryptedKey: r,
					parameters: a
				} = await eZ(d, h, e, this._cek, this._keyManagementParameters)), a && (t && ez in t ? this._unprotectedHeader ? this._unprotectedHeader = {
					...this._unprotectedHeader,
					...a
				} : this.setUnprotectedHeader(a) : this._protectedHeader ? this._protectedHeader = {
					...this._protectedHeader,
					...a
				} : this.setProtectedHeader(a))
			}
			o = this._protectedHeader ? i.encode(y(JSON.stringify(this._protectedHeader))) : i.encode(""), this._aad ? (l = y(this._aad), a = c(o, i.encode("."), i.encode(l))) : a = o;
			let {
				ciphertext: p,
				tag: f,
				iv: w
			} = await eM(h, this._plaintext, n, this._iv, a), m = {
				ciphertext: y(p)
			};
			return w && (m.iv = y(w)), f && (m.tag = y(f)), r && (m.encrypted_key = y(r)), l && (m.aad = l), this._protectedHeader && (m.protected = s.decode(o)), this._sharedUnprotectedHeader && (m.unprotected = this._sharedUnprotectedHeader), this._unprotectedHeader && (m.header = this._unprotectedHeader), m
		}
	}
	class e1 {
		constructor(e, t, r) {
			this.parent = e, this.key = t, this.options = r
		}
		setUnprotectedHeader(e) {
			if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this.unprotectedHeader = e, this
		}
		addRecipient(...e) {
			return this.parent.addRecipient(...e)
		}
		encrypt(...e) {
			return this.parent.encrypt(...e)
		}
		done() {
			return this.parent
		}
	}

	function e2(e, t) {
		let r = `SHA-${e.slice(-3)}`;
		switch (e) {
			case "HS256":
			case "HS384":
			case "HS512":
				return {
					hash: r, name: "HMAC"
				};
			case "PS256":
			case "PS384":
			case "PS512":
				return {
					hash: r, name: "RSA-PSS", saltLength: e.slice(-3) >> 3
				};
			case "RS256":
			case "RS384":
			case "RS512":
				return {
					hash: r, name: "RSASSA-PKCS1-v1_5"
				};
			case "ES256":
			case "ES384":
			case "ES512":
				return {
					hash: r, name: "ECDSA", namedCurve: t.namedCurve
				};
			case "Ed25519":
				return {
					name: "Ed25519"
				};
			case "EdDSA":
				return {
					name: t.name
				};
			default:
				throw new A(`alg ${e} is not supported either by JOSE or your javascript runtime`)
		}
	}
	async function e5(e, t, r) {
		if ("sign" === r && (t = await eg(t, e)), "verify" === r && (t = await em(t, e)), t instanceof CryptoKey) return ! function(e, t, ...r) {
			switch (t) {
				case "HS256":
				case "HS384":
				case "HS512": {
					if (!B(e.algorithm, "HMAC")) throw J("HMAC");
					let r = parseInt(t.slice(2), 10);
					if (M(e.algorithm.hash) !== r) throw J(`SHA-${r}`, "algorithm.hash");
					break
				}
				case "RS256":
				case "RS384":
				case "RS512": {
					if (!B(e.algorithm, "RSASSA-PKCS1-v1_5")) throw J("RSASSA-PKCS1-v1_5");
					let r = parseInt(t.slice(2), 10);
					if (M(e.algorithm.hash) !== r) throw J(`SHA-${r}`, "algorithm.hash");
					break
				}
				case "PS256":
				case "PS384":
				case "PS512": {
					if (!B(e.algorithm, "RSA-PSS")) throw J("RSA-PSS");
					let r = parseInt(t.slice(2), 10);
					if (M(e.algorithm.hash) !== r) throw J(`SHA-${r}`, "algorithm.hash");
					break
				}
				case "EdDSA":
					if ("Ed25519" !== e.algorithm.name && "Ed448" !== e.algorithm.name) throw J("Ed25519 or Ed448");
					break;
				case "Ed25519":
					if (!B(e.algorithm, "Ed25519")) throw J("Ed25519");
					break;
				case "ES256":
				case "ES384":
				case "ES512": {
					if (!B(e.algorithm, "ECDSA")) throw J("ECDSA");
					let r = function(e) {
						switch (e) {
							case "ES256":
								return "P-256";
							case "ES384":
								return "P-384";
							case "ES512":
								return "P-521";
							default:
								throw Error("unreachable")
						}
					}(t);
					if (e.algorithm.namedCurve !== r) throw J(r, "algorithm.namedCurve");
					break
				}
				default:
					throw TypeError("CryptoKey does not support this operation")
			}
			D(e, r)
		}(t, e, r), t;
		if (t instanceof Uint8Array) {
			if (!e.startsWith("HS")) throw TypeError(j(t, ...F));
			return a.subtle.importKey("raw", t, {
				hash: `SHA-${e.slice(-3)}`,
				name: "HMAC"
			}, !1, [r])
		}
		throw TypeError(j(t, ...F, "Uint8Array", "JSON Web Key"))
	}
	let e8 = async (e, t, r, n) => {
		let o = await e5(e, t, "verify");
		eu(e, o);
		let i = e2(e, o.algorithm);
		try {
			return await a.subtle.verify(i, o, r, n)
		} catch {
			return !1
		}
	};
	async function e6(e, t, r) {
		let n, a;
		if (!Y(e)) throw new T("Flattened JWS must be an object");
		if (void 0 === e.protected && void 0 === e.header) throw new T('Flattened JWS must have either of the "protected" or "header" members');
		if (void 0 !== e.protected && "string" != typeof e.protected) throw new T("JWS Protected Header incorrect type");
		if (void 0 === e.payload) throw new T("JWS Payload missing");
		if ("string" != typeof e.signature) throw new T("JWS Signature missing or incorrect type");
		if (void 0 !== e.header && !Y(e.header)) throw new T("JWS Unprotected Header incorrect type");
		let o = {};
		if (e.protected) try {
			let t = m(e.protected);
			o = JSON.parse(s.decode(t))
		} catch {
			throw new T("JWS Protected Header is invalid")
		}
		if (!X(o, e.header)) throw new T("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
		let l = {
				...o,
				...e.header
			},
			u = ej(T, new Map([
				["b64", !0]
			]), r?.crit, o, l),
			d = !0;
		if (u.has("b64") && "boolean" != typeof(d = o.b64)) throw new T('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
		let {
			alg: h
		} = l;
		if ("string" != typeof h || !h) throw new T('JWS "alg" (Algorithm) Header Parameter missing or invalid');
		let p = r && e$("algorithms", r.algorithms);
		if (p && !p.has(h)) throw new v('"alg" (Algorithm) Header Parameter value not allowed');
		if (d) {
			if ("string" != typeof e.payload) throw new T("JWS Payload must be a string")
		} else if ("string" != typeof e.payload && !(e.payload instanceof Uint8Array)) throw new T("JWS Payload must be a string or an Uint8Array instance");
		let f = !1;
		"function" == typeof t ? (t = await t(o, e), f = !0, eW(h, t, "verify"), ep(t) && (t = await eO(t, h))) : eW(h, t, "verify");
		let y = c(i.encode(e.protected ?? ""), i.encode("."), "string" == typeof e.payload ? i.encode(e.payload) : e.payload);
		try {
			n = m(e.signature)
		} catch {
			throw new T("Failed to base64url decode the signature")
		}
		if (!await e8(h, t, n, y)) throw new x;
		if (d) try {
			a = m(e.payload)
		} catch {
			throw new T("Failed to base64url decode the payload")
		} else a = "string" == typeof e.payload ? i.encode(e.payload) : e.payload;
		let w = {
			payload: a
		};
		return (void 0 !== e.protected && (w.protectedHeader = o), void 0 !== e.header && (w.unprotectedHeader = e.header), f) ? {
			...w,
			key: t
		} : w
	}
	async function e4(e, t, r) {
		if (e instanceof Uint8Array && (e = s.decode(e)), "string" != typeof e) throw new T("Compact JWS must be a string or Uint8Array");
		let {
			0: n,
			1: a,
			2: o,
			length: i
		} = e.split(".");
		if (3 !== i) throw new T("Invalid Compact JWS");
		let c = await e6({
				payload: a,
				protected: n,
				signature: o
			}, t, r),
			l = {
				payload: c.payload,
				protectedHeader: c.protectedHeader
			};
		return "function" == typeof t ? {
			...l,
			key: c.key
		} : l
	}
	async function e3(e, t, r) {
		if (!Y(e)) throw new T("General JWS must be an object");
		if (!Array.isArray(e.signatures) || !e.signatures.every(Y)) throw new T("JWS Signatures missing or incorrect type");
		for (let n of e.signatures) try {
			return await e6({
				header: n.header,
				payload: e.payload,
				protected: n.protected,
				signature: n.signature
			}, t, r)
		} catch {}
		throw new x
	}
	let e9 = e => Math.floor(e.getTime() / 1e3),
		e7 = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i,
		te = e => {
			let t, r = e7.exec(e);
			if (!r || r[4] && r[1]) throw TypeError("Invalid time period format");
			let n = parseFloat(r[2]);
			switch (r[3].toLowerCase()) {
				case "sec":
				case "secs":
				case "second":
				case "seconds":
				case "s":
					t = Math.round(n);
					break;
				case "minute":
				case "minutes":
				case "min":
				case "mins":
				case "m":
					t = Math.round(60 * n);
					break;
				case "hour":
				case "hours":
				case "hr":
				case "hrs":
				case "h":
					t = Math.round(3600 * n);
					break;
				case "day":
				case "days":
				case "d":
					t = Math.round(86400 * n);
					break;
				case "week":
				case "weeks":
				case "w":
					t = Math.round(604800 * n);
					break;
				default:
					t = Math.round(0x1e187e0 * n)
			}
			return "-" === r[1] || "ago" === r[4] ? -t : t
		},
		tt = e => e.toLowerCase().replace(/^application\//, ""),
		tr = (e, t, r = {}) => {
			var n, a;
			let o, i;
			try {
				o = JSON.parse(s.decode(t))
			} catch {}
			if (!Y(o)) throw new k("JWT Claims Set must be a top-level JSON object");
			let {
				typ: c
			} = r;
			if (c && ("string" != typeof e.typ || tt(e.typ) !== tt(c))) throw new b('unexpected "typ" JWT header value', o, "typ", "check_failed");
			let {
				requiredClaims: l = [],
				issuer: u,
				subject: d,
				audience: h,
				maxTokenAge: p
			} = r, f = [...l];
			for (let e of (void 0 !== p && f.push("iat"), void 0 !== h && f.push("aud"), void 0 !== d && f.push("sub"), void 0 !== u && f.push("iss"), new Set(f.reverse())))
				if (!(e in o)) throw new b(`missing required "${e}" claim`, o, e, "missing");
			if (u && !(Array.isArray(u) ? u : [u]).includes(o.iss)) throw new b('unexpected "iss" claim value', o, "iss", "check_failed");
			if (d && o.sub !== d) throw new b('unexpected "sub" claim value', o, "sub", "check_failed");
			if (h && (n = o.aud, a = "string" == typeof h ? [h] : h, "string" == typeof n ? !a.includes(n) : !(Array.isArray(n) && a.some(Set.prototype.has.bind(new Set(n)))))) throw new b('unexpected "aud" claim value', o, "aud", "check_failed");
			switch (typeof r.clockTolerance) {
				case "string":
					i = te(r.clockTolerance);
					break;
				case "number":
					i = r.clockTolerance;
					break;
				case "undefined":
					i = 0;
					break;
				default:
					throw TypeError("Invalid clockTolerance option type")
			}
			let {
				currentDate: y
			} = r, w = e9(y || new Date);
			if ((void 0 !== o.iat || p) && "number" != typeof o.iat) throw new b('"iat" claim must be a number', o, "iat", "invalid");
			if (void 0 !== o.nbf) {
				if ("number" != typeof o.nbf) throw new b('"nbf" claim must be a number', o, "nbf", "invalid");
				if (o.nbf > w + i) throw new b('"nbf" claim timestamp check failed', o, "nbf", "check_failed")
			}
			if (void 0 !== o.exp) {
				if ("number" != typeof o.exp) throw new b('"exp" claim must be a number', o, "exp", "invalid");
				if (o.exp <= w - i) throw new E('"exp" claim timestamp check failed', o, "exp", "check_failed")
			}
			if (p) {
				let e = w - o.iat;
				if (e - i > ("number" == typeof p ? p : te(p))) throw new E('"iat" claim timestamp check failed (too far in the past)', o, "iat", "check_failed");
				if (e < 0 - i) throw new b('"iat" claim timestamp check failed (it should be in the past)', o, "iat", "check_failed")
			}
			return o
		};
	async function tn(e, t, r) {
		let n = await e4(e, t, r);
		if (n.protectedHeader.crit?.includes("b64") && !1 === n.protectedHeader.b64) throw new k("JWTs MUST NOT use unencoded payload");
		let a = {
			payload: tr(n.protectedHeader, n.payload, r),
			protectedHeader: n.protectedHeader
		};
		return "function" == typeof t ? {
			...a,
			key: n.key
		} : a
	}
	async function ta(e, t, r) {
		let n = await eF(e, t, r),
			a = tr(n.protectedHeader, n.plaintext, r),
			{
				protectedHeader: o
			} = n;
		if (void 0 !== o.iss && o.iss !== a.iss) throw new b('replicated "iss" claim header parameter mismatch', a, "iss", "mismatch");
		if (void 0 !== o.sub && o.sub !== a.sub) throw new b('replicated "sub" claim header parameter mismatch', a, "sub", "mismatch");
		if (void 0 !== o.aud && JSON.stringify(o.aud) !== JSON.stringify(a.aud)) throw new b('replicated "aud" claim header parameter mismatch', a, "aud", "mismatch");
		let i = {
			payload: a,
			protectedHeader: o
		};
		return "function" == typeof t ? {
			...i,
			key: n.key
		} : i
	}
	class to {
		constructor(e) {
			this._flattened = new e0(e)
		}
		setContentEncryptionKey(e) {
			return this._flattened.setContentEncryptionKey(e), this
		}
		setInitializationVector(e) {
			return this._flattened.setInitializationVector(e), this
		}
		setProtectedHeader(e) {
			return this._flattened.setProtectedHeader(e), this
		}
		setKeyManagementParameters(e) {
			return this._flattened.setKeyManagementParameters(e), this
		}
		async encrypt(e, t) {
			let r = await this._flattened.encrypt(e, t);
			return [r.protected, r.encrypted_key, r.iv, r.ciphertext, r.tag].join(".")
		}
	}
	let ti = async (e, t, r) => {
		let n = await e5(e, t, "sign");
		return eu(e, n), new Uint8Array(await a.subtle.sign(e2(e, n.algorithm), n, r))
	};
	class ts {
		constructor(e) {
			if (!(e instanceof Uint8Array)) throw TypeError("payload must be an instance of Uint8Array");
			this._payload = e
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this
		}
		setUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this
		}
		async sign(e, t) {
			let r;
			if (!this._protectedHeader && !this._unprotectedHeader) throw new T("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
			if (!X(this._protectedHeader, this._unprotectedHeader)) throw new T("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
			let n = {
					...this._protectedHeader,
					...this._unprotectedHeader
				},
				a = ej(T, new Map([
					["b64", !0]
				]), t?.crit, this._protectedHeader, n),
				o = !0;
			if (a.has("b64") && "boolean" != typeof(o = this._protectedHeader.b64)) throw new T('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
			let {
				alg: l
			} = n;
			if ("string" != typeof l || !l) throw new T('JWS "alg" (Algorithm) Header Parameter missing or invalid');
			eW(l, e, "sign");
			let u = this._payload;
			o && (u = i.encode(y(u)));
			let d = c(r = this._protectedHeader ? i.encode(y(JSON.stringify(this._protectedHeader))) : i.encode(""), i.encode("."), u),
				h = {
					signature: y(await ti(l, e, d)),
					payload: ""
				};
			return o && (h.payload = s.decode(u)), this._unprotectedHeader && (h.header = this._unprotectedHeader), this._protectedHeader && (h.protected = s.decode(r)), h
		}
	}
	class tc {
		constructor(e) {
			this._flattened = new ts(e)
		}
		setProtectedHeader(e) {
			return this._flattened.setProtectedHeader(e), this
		}
		async sign(e, t) {
			let r = await this._flattened.sign(e, t);
			if (void 0 === r.payload) throw TypeError("use the flattened module for creating JWS with b64: false");
			return `${r.protected}.${r.payload}.${r.signature}`
		}
	}
	class tl {
		constructor(e, t, r) {
			this.parent = e, this.key = t, this.options = r
		}
		setProtectedHeader(e) {
			if (this.protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this.protectedHeader = e, this
		}
		setUnprotectedHeader(e) {
			if (this.unprotectedHeader) throw TypeError("setUnprotectedHeader can only be called once");
			return this.unprotectedHeader = e, this
		}
		addSignature(...e) {
			return this.parent.addSignature(...e)
		}
		sign(...e) {
			return this.parent.sign(...e)
		}
		done() {
			return this.parent
		}
	}

	function tu(e, t) {
		if (!Number.isFinite(t)) throw TypeError(`Invalid ${e} input`);
		return t
	}
	class td {
		constructor(e = {}) {
			if (!Y(e)) throw TypeError("JWT Claims Set MUST be an object");
			this._payload = e
		}
		setIssuer(e) {
			return this._payload = {
				...this._payload,
				iss: e
			}, this
		}
		setSubject(e) {
			return this._payload = {
				...this._payload,
				sub: e
			}, this
		}
		setAudience(e) {
			return this._payload = {
				...this._payload,
				aud: e
			}, this
		}
		setJti(e) {
			return this._payload = {
				...this._payload,
				jti: e
			}, this
		}
		setNotBefore(e) {
			return "number" == typeof e ? this._payload = {
				...this._payload,
				nbf: tu("setNotBefore", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				nbf: tu("setNotBefore", e9(e))
			} : this._payload = {
				...this._payload,
				nbf: e9(new Date) + te(e)
			}, this
		}
		setExpirationTime(e) {
			return "number" == typeof e ? this._payload = {
				...this._payload,
				exp: tu("setExpirationTime", e)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				exp: tu("setExpirationTime", e9(e))
			} : this._payload = {
				...this._payload,
				exp: e9(new Date) + te(e)
			}, this
		}
		setIssuedAt(e) {
			return void 0 === e ? this._payload = {
				...this._payload,
				iat: e9(new Date)
			} : e instanceof Date ? this._payload = {
				...this._payload,
				iat: tu("setIssuedAt", e9(e))
			} : "string" == typeof e ? this._payload = {
				...this._payload,
				iat: tu("setIssuedAt", e9(new Date) + te(e))
			} : this._payload = {
				...this._payload,
				iat: tu("setIssuedAt", e)
			}, this
		}
	}
	let th = (e, t) => {
		if ("string" != typeof e || !e) throw new P(`${t} missing or invalid`)
	};
	async function tp(e, t) {
		let r;
		if (!Y(e)) throw TypeError("JWK must be an object");
		if (t ?? (t = "sha256"), "sha256" !== t && "sha384" !== t && "sha512" !== t) throw TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
		switch (e.kty) {
			case "EC":
				th(e.crv, '"crv" (Curve) Parameter'), th(e.x, '"x" (X Coordinate) Parameter'), th(e.y, '"y" (Y Coordinate) Parameter'), r = {
					crv: e.crv,
					kty: e.kty,
					x: e.x,
					y: e.y
				};
				break;
			case "OKP":
				th(e.crv, '"crv" (Subtype of Key Pair) Parameter'), th(e.x, '"x" (Public Key) Parameter'), r = {
					crv: e.crv,
					kty: e.kty,
					x: e.x
				};
				break;
			case "RSA":
				th(e.e, '"e" (Exponent) Parameter'), th(e.n, '"n" (Modulus) Parameter'), r = {
					e: e.e,
					kty: e.kty,
					n: e.n
				};
				break;
			case "oct":
				th(e.k, '"k" (Key Value) Parameter'), r = {
					k: e.k,
					kty: e.kty
				};
				break;
			default:
				throw new A('"kty" (Key Type) Parameter missing or unsupported')
		}
		let n = i.encode(JSON.stringify(r));
		return y(await o(t, n))
	}
	async function tf(e, t) {
		t ?? (t = "sha256");
		let r = await tp(e, t);
		return `urn:ietf:params:oauth:jwk-thumbprint:sha-${t.slice(-3)}:${r}`
	}
	async function ty(e, t) {
		let r = {
			...e,
			...t?.header
		};
		if (!Y(r.jwk)) throw new T('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
		let n = await eO({
			...r.jwk,
			ext: !0
		}, r.alg);
		if (n instanceof Uint8Array || "public" !== n.type) throw new T('"jwk" (JSON Web Key) Header Parameter must be a public key');
		return n
	}

	function tw(e) {
		return Y(e)
	}

	function tm(e) {
		return "function" == typeof structuredClone ? structuredClone(e) : JSON.parse(JSON.stringify(e))
	}
	class tg {
		constructor(e) {
			if (this._cached = new WeakMap, !(e && "object" == typeof e && Array.isArray(e.keys) && e.keys.every(tw))) throw new C("JSON Web Key Set malformed");
			this._jwks = tm(e)
		}
		async getKey(e, t) {
			let {
				alg: r,
				kid: n
			} = {
				...e,
				...t?.header
			}, a = function(e) {
				switch ("string" == typeof e && e.slice(0, 2)) {
					case "RS":
					case "PS":
						return "RSA";
					case "ES":
						return "EC";
					case "Ed":
						return "OKP";
					default:
						throw new A('Unsupported "alg" value for a JSON Web Key Set')
				}
			}(r), o = this._jwks.keys.filter(e => {
				let t = a === e.kty;
				if (t && "string" == typeof n && (t = n === e.kid), t && "string" == typeof e.alg && (t = r === e.alg), t && "string" == typeof e.use && (t = "sig" === e.use), t && Array.isArray(e.key_ops) && (t = e.key_ops.includes("verify")), t) switch (r) {
					case "ES256":
						t = "P-256" === e.crv;
						break;
					case "ES256K":
						t = "secp256k1" === e.crv;
						break;
					case "ES384":
						t = "P-384" === e.crv;
						break;
					case "ES512":
						t = "P-521" === e.crv;
						break;
					case "Ed25519":
						t = "Ed25519" === e.crv;
						break;
					case "EdDSA":
						t = "Ed25519" === e.crv || "Ed448" === e.crv
				}
				return t
			}), {
				0: i,
				length: s
			} = o;
			if (0 === s) throw new H;
			if (1 !== s) {
				let e = new R,
					{
						_cached: t
					} = this;
				throw e[Symbol.asyncIterator] = async function*() {
					for (let e of o) try {
						yield await tb(t, e, r)
					} catch {}
				}, e
			}
			return tb(this._cached, i, r)
		}
	}
	async function tb(e, t, r) {
		let n = e.get(t) || e.set(t, {}).get(t);
		if (void 0 === n[r]) {
			let e = await eO({
				...t,
				ext: !0
			}, r);
			if (e instanceof Uint8Array || "public" !== e.type) throw new C("JSON Web Key Set members must be public keys");
			n[r] = e
		}
		return n[r]
	}

	function tE(e) {
		let t = new tg(e),
			r = async (e, r) => t.getKey(e, r);
		return Object.defineProperties(r, {
			jwks: {
				value: () => tm(t._jwks),
				enumerable: !0,
				configurable: !1,
				writable: !1
			}
		}), r
	}
	let tv = async (e, t, r) => {
		let n, a, o = !1;
		"function" == typeof AbortController && (n = new AbortController, a = setTimeout(() => {
			o = !0, n.abort()
		}, t));
		let i = await fetch(e.href, {
			signal: n ? n.signal : void 0,
			redirect: "manual",
			headers: r.headers
		}).catch(e => {
			if (o) throw new O;
			throw e
		});
		if (void 0 !== a && clearTimeout(a), 200 !== i.status) throw new g("Expected 200 OK from the JSON Web Key Set HTTP response");
		try {
			return await i.json()
		} catch {
			throw new g("Failed to parse the JSON Web Key Set HTTP response as JSON")
		}
	};
	("u" < typeof navigator || !navigator.userAgent?.startsWith?.("Mozilla/5.0 ")) && (n = "jose/v5.10.0");
	let tA = Symbol();
	class tS {
		constructor(e, t) {
			if (!(e instanceof URL)) throw TypeError("url must be an instance of URL");
			if (this._url = new URL(e.href), this._options = {
					agent: t?.agent,
					headers: t?.headers
				}, this._timeoutDuration = "number" == typeof t?.timeoutDuration ? t?.timeoutDuration : 5e3, this._cooldownDuration = "number" == typeof t?.cooldownDuration ? t?.cooldownDuration : 3e4, this._cacheMaxAge = "number" == typeof t?.cacheMaxAge ? t?.cacheMaxAge : 6e5, t?.[tA] !== void 0) {
				var r, n;
				this._cache = t?.[tA], r = t?.[tA], n = this._cacheMaxAge, !("object" != typeof r || null === r || !("uat" in r) || "number" != typeof r.uat || Date.now() - r.uat >= n) && "jwks" in r && Y(r.jwks) && Array.isArray(r.jwks.keys) && Array.prototype.every.call(r.jwks.keys, Y) && 1 && (this._jwksTimestamp = this._cache.uat, this._local = tE(this._cache.jwks))
			}
		}
		coolingDown() {
			return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cooldownDuration
		}
		fresh() {
			return "number" == typeof this._jwksTimestamp && Date.now() < this._jwksTimestamp + this._cacheMaxAge
		}
		async getKey(e, t) {
			this._local && this.fresh() || await this.reload();
			try {
				return await this._local(e, t)
			} catch (r) {
				if (r instanceof H && !1 === this.coolingDown()) return await this.reload(), this._local(e, t);
				throw r
			}
		}
		async reload() {
			this._pendingFetch && ("u" > typeof WebSocketPair || "u" > typeof navigator && "Cloudflare-Workers" === navigator.userAgent || "u" > typeof EdgeRuntime && "vercel" === EdgeRuntime) && (this._pendingFetch = void 0);
			let e = new Headers(this._options.headers);
			n && !e.has("User-Agent") && (e.set("User-Agent", n), this._options.headers = Object.fromEntries(e.entries())), this._pendingFetch || (this._pendingFetch = tv(this._url, this._timeoutDuration, this._options).then(e => {
				this._local = tE(e), this._cache && (this._cache.uat = Date.now(), this._cache.jwks = e), this._jwksTimestamp = Date.now(), this._pendingFetch = void 0
			}).catch(e => {
				throw this._pendingFetch = void 0, e
			})), await this._pendingFetch
		}
	}
	e.s(["decode", 0, m, "encode", 0, y], 741574);
	var t_ = e.i(133186);
	async function tT(e, t) {
		let r, n, o;
		switch (e) {
			case "HS256":
			case "HS384":
			case "HS512":
				r = parseInt(e.slice(-3), 10), n = {
					name: "HMAC",
					hash: `SHA-${r}`,
					length: r
				}, o = ["sign", "verify"];
				break;
			case "A128CBC-HS256":
			case "A192CBC-HS384":
			case "A256CBC-HS512":
				return U(new Uint8Array((r = parseInt(e.slice(-3), 10)) >> 3));
			case "A128KW":
			case "A192KW":
			case "A256KW":
				n = {
					name: "AES-KW",
					length: r = parseInt(e.slice(1, 4), 10)
				}, o = ["wrapKey", "unwrapKey"];
				break;
			case "A128GCMKW":
			case "A192GCMKW":
			case "A256GCMKW":
			case "A128GCM":
			case "A192GCM":
			case "A256GCM":
				n = {
					name: "AES-GCM",
					length: r = parseInt(e.slice(1, 4), 10)
				}, o = ["encrypt", "decrypt"];
				break;
			default:
				throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
		}
		return a.subtle.generateKey(n, t?.extractable ?? !1, o)
	}

	function tk(e) {
		let t = e?.modulusLength ?? 2048;
		if ("number" != typeof t || t < 2048) throw new A("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
		return t
	}
	async function tP(e, t) {
		let r, n;
		switch (e) {
			case "PS256":
			case "PS384":
			case "PS512":
				r = {
					name: "RSA-PSS",
					hash: `SHA-${e.slice(-3)}`,
					publicExponent: new Uint8Array([1, 0, 1]),
					modulusLength: tk(t)
				}, n = ["sign", "verify"];
				break;
			case "RS256":
			case "RS384":
			case "RS512":
				r = {
					name: "RSASSA-PKCS1-v1_5",
					hash: `SHA-${e.slice(-3)}`,
					publicExponent: new Uint8Array([1, 0, 1]),
					modulusLength: tk(t)
				}, n = ["sign", "verify"];
				break;
			case "RSA-OAEP":
			case "RSA-OAEP-256":
			case "RSA-OAEP-384":
			case "RSA-OAEP-512":
				r = {
					name: "RSA-OAEP",
					hash: `SHA-${parseInt(e.slice(-3),10)||1}`,
					publicExponent: new Uint8Array([1, 0, 1]),
					modulusLength: tk(t)
				}, n = ["decrypt", "unwrapKey", "encrypt", "wrapKey"];
				break;
			case "ES256":
				r = {
					name: "ECDSA",
					namedCurve: "P-256"
				}, n = ["sign", "verify"];
				break;
			case "ES384":
				r = {
					name: "ECDSA",
					namedCurve: "P-384"
				}, n = ["sign", "verify"];
				break;
			case "ES512":
				r = {
					name: "ECDSA",
					namedCurve: "P-521"
				}, n = ["sign", "verify"];
				break;
			case "Ed25519":
				r = {
					name: "Ed25519"
				}, n = ["sign", "verify"];
				break;
			case "EdDSA": {
				n = ["sign", "verify"];
				let e = t?.crv ?? "Ed25519";
				switch (e) {
					case "Ed25519":
					case "Ed448":
						r = {
							name: e
						};
						break;
					default:
						throw new A("Invalid or unsupported crv option provided")
				}
				break
			}
			case "ECDH-ES":
			case "ECDH-ES+A128KW":
			case "ECDH-ES+A192KW":
			case "ECDH-ES+A256KW": {
				n = ["deriveKey", "deriveBits"];
				let e = t?.crv ?? "P-256";
				switch (e) {
					case "P-256":
					case "P-384":
					case "P-521":
						r = {
							name: "ECDH",
							namedCurve: e
						};
						break;
					case "X25519":
					case "X448":
						r = {
							name: e
						};
						break;
					default:
						throw new A("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448")
				}
				break
			}
			default:
				throw new A('Invalid or unsupported JWK "alg" (Algorithm) Parameter value')
		}
		return a.subtle.generateKey(r, t?.extractable ?? !1, n)
	}
	async function tC(e, t) {
		return tP(e, t)
	}
	async function tH(e, t) {
		return tT(e, t)
	}
	var tR = e.i(741574);
	e.s(["CompactEncrypt", 0, to, "CompactSign", 0, tc, "EmbeddedJWK", 0, ty, "EncryptJWT", 0, class extends td {
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this
		}
		setKeyManagementParameters(e) {
			if (this._keyManagementParameters) throw TypeError("setKeyManagementParameters can only be called once");
			return this._keyManagementParameters = e, this
		}
		setContentEncryptionKey(e) {
			if (this._cek) throw TypeError("setContentEncryptionKey can only be called once");
			return this._cek = e, this
		}
		setInitializationVector(e) {
			if (this._iv) throw TypeError("setInitializationVector can only be called once");
			return this._iv = e, this
		}
		replicateIssuerAsHeader() {
			return this._replicateIssuerAsHeader = !0, this
		}
		replicateSubjectAsHeader() {
			return this._replicateSubjectAsHeader = !0, this
		}
		replicateAudienceAsHeader() {
			return this._replicateAudienceAsHeader = !0, this
		}
		async encrypt(e, t) {
			let r = new to(i.encode(JSON.stringify(this._payload)));
			return this._replicateIssuerAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				iss: this._payload.iss
			}), this._replicateSubjectAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				sub: this._payload.sub
			}), this._replicateAudienceAsHeader && (this._protectedHeader = {
				...this._protectedHeader,
				aud: this._payload.aud
			}), r.setProtectedHeader(this._protectedHeader), this._iv && r.setInitializationVector(this._iv), this._cek && r.setContentEncryptionKey(this._cek), this._keyManagementParameters && r.setKeyManagementParameters(this._keyManagementParameters), r.encrypt(e, t)
		}
	}, "FlattenedEncrypt", 0, e0, "FlattenedSign", 0, ts, "GeneralEncrypt", 0, class {
		constructor(e) {
			this._recipients = [], this._plaintext = e
		}
		addRecipient(e, t) {
			let r = new e1(this, e, {
				crit: t?.crit
			});
			return this._recipients.push(r), r
		}
		setProtectedHeader(e) {
			if (this._protectedHeader) throw TypeError("setProtectedHeader can only be called once");
			return this._protectedHeader = e, this
		}
		setSharedUnprotectedHeader(e) {
			if (this._unprotectedHeader) throw TypeError("setSharedUnprotectedHeader can only be called once");
			return this._unprotectedHeader = e, this
		}
		setAdditionalAuthenticatedData(e) {
			return this._aad = e, this
		}
		async encrypt() {
			let e;
			if (!this._recipients.length) throw new _("at least one recipient must be added");
			if (1 === this._recipients.length) {
				let [e] = this._recipients, t = await new e0(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(e.unprotectedHeader).encrypt(e.key, {
					...e.options
				}), r = {
					ciphertext: t.ciphertext,
					iv: t.iv,
					recipients: [{}],
					tag: t.tag
				};
				return t.aad && (r.aad = t.aad), t.protected && (r.protected = t.protected), t.unprotected && (r.unprotected = t.unprotected), t.encrypted_key && (r.recipients[0].encrypted_key = t.encrypted_key), t.header && (r.recipients[0].header = t.header), r
			}
			for (let t = 0; t < this._recipients.length; t++) {
				let r = this._recipients[t];
				if (!X(this._protectedHeader, this._unprotectedHeader, r.unprotectedHeader)) throw new _("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
				let n = {
						...this._protectedHeader,
						...this._unprotectedHeader,
						...r.unprotectedHeader
					},
					{
						alg: a
					} = n;
				if ("string" != typeof a || !a) throw new _('JWE "alg" (Algorithm) Header Parameter missing or invalid');
				if ("dir" === a || "ECDH-ES" === a) throw new _('"dir" and "ECDH-ES" alg may only be used with a single recipient');
				if ("string" != typeof n.enc || !n.enc) throw new _('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
				if (e) {
					if (e !== n.enc) throw new _('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients')
				} else e = n.enc;
				if (ej(_, new Map, r.options.crit, this._protectedHeader, n), void 0 !== n.zip) throw new A('JWE "zip" (Compression Algorithm) Header Parameter is not supported.')
			}
			let t = eE(e),
				r = {
					ciphertext: "",
					iv: "",
					recipients: [],
					tag: ""
				};
			for (let n = 0; n < this._recipients.length; n++) {
				let a = this._recipients[n],
					o = {};
				r.recipients.push(o);
				let i = ({
					...this._protectedHeader,
					...this._unprotectedHeader,
					...a.unprotectedHeader
				}).alg.startsWith("PBES2") ? 2048 + n : void 0;
				if (0 === n) {
					let e = await new e0(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(t).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(a.unprotectedHeader).setKeyManagementParameters({
						p2c: i
					}).encrypt(a.key, {
						...a.options,
						[ez]: !0
					});
					r.ciphertext = e.ciphertext, r.iv = e.iv, r.tag = e.tag, e.aad && (r.aad = e.aad), e.protected && (r.protected = e.protected), e.unprotected && (r.unprotected = e.unprotected), o.encrypted_key = e.encrypted_key, e.header && (o.header = e.header);
					continue
				}
				let {
					encryptedKey: s,
					parameters: c
				} = await eZ(a.unprotectedHeader?.alg || this._protectedHeader?.alg || this._unprotectedHeader?.alg, e, a.key, t, {
					p2c: i
				});
				o.encrypted_key = y(s), (a.unprotectedHeader || c) && (o.header = {
					...a.unprotectedHeader,
					...c
				})
			}
			return r
		}
	}, "GeneralSign", 0, class {
		constructor(e) {
			this._signatures = [], this._payload = e
		}
		addSignature(e, t) {
			let r = new tl(this, e, t);
			return this._signatures.push(r), r
		}
		async sign() {
			if (!this._signatures.length) throw new T("at least one signature must be added");
			let e = {
				signatures: [],
				payload: ""
			};
			for (let t = 0; t < this._signatures.length; t++) {
				let r = this._signatures[t],
					n = new ts(this._payload);
				n.setProtectedHeader(r.protectedHeader), n.setUnprotectedHeader(r.unprotectedHeader);
				let {
					payload: a,
					...o
				} = await n.sign(r.key, r.options);
				if (0 === t) e.payload = a;
				else if (e.payload !== a) throw new T("inconsistent use of JWS Unencoded Payload (RFC7797)");
				e.signatures.push(o)
			}
			return e
		}
	}, "SignJWT", 0, class extends td {
		setProtectedHeader(e) {
			return this._protectedHeader = e, this
		}
		async sign(e, t) {
			let r = new tc(i.encode(JSON.stringify(this._payload)));
			if (r.setProtectedHeader(this._protectedHeader), Array.isArray(this._protectedHeader?.crit) && this._protectedHeader.crit.includes("b64") && !1 === this._protectedHeader.b64) throw new k("JWTs MUST NOT use unencoded payload");
			return r.sign(e, t)
		}
	}, "UnsecuredJWT", 0, class extends td {
		encode() {
			let e = y(JSON.stringify({
					alg: "none"
				})),
				t = y(JSON.stringify(this._payload));
			return `${e}.${t}.`
		}
		static decode(e, t) {
			let r;
			if ("string" != typeof e) throw new k("Unsecured JWT must be a string");
			let {
				0: n,
				1: a,
				2: o,
				length: i
			} = e.split(".");
			if (3 !== i || "" !== o) throw new k("Invalid Unsecured JWT");
			try {
				if (r = JSON.parse(s.decode(m(n))), "none" !== r.alg) throw Error()
			} catch {
				throw new k("Invalid Unsecured JWT")
			}
			return {
				payload: tr(r, m(a), t),
				header: r
			}
		}
	}, "base64url", 0, tR, "calculateJwkThumbprint", 0, tp, "calculateJwkThumbprintUri", 0, tf, "compactDecrypt", 0, eF, "compactVerify", 0, e4, "createLocalJWKSet", 0, tE, "createRemoteJWKSet", 0, function(e, t) {
		let r = new tS(e, t),
			n = async (e, t) => r.getKey(e, t);
		return Object.defineProperties(n, {
			coolingDown: {
				get: () => r.coolingDown(),
				enumerable: !0,
				configurable: !1
			},
			fresh: {
				get: () => r.fresh(),
				enumerable: !0,
				configurable: !1
			},
			reload: {
				value: () => r.reload(),
				enumerable: !0,
				configurable: !1,
				writable: !1
			},
			reloading: {
				get: () => !!r._pendingFetch,
				enumerable: !0,
				configurable: !1
			},
			jwks: {
				value: () => r._local?.jwks(),
				enumerable: !0,
				configurable: !1,
				writable: !1
			}
		}), n
	}, "cryptoRuntime", 0, "WebCryptoAPI", "decodeJwt", 0, function(e) {
		let t, r;
		if ("string" != typeof e) throw new k("JWTs must use Compact JWS serialization, JWT must be a string");
		let {
			1: n,
			length: a
		} = e.split(".");
		if (5 === a) throw new k("Only JWTs using Compact JWS serialization can be decoded");
		if (3 !== a) throw new k("Invalid JWT");
		if (!n) throw new k("JWTs must contain a payload");
		try {
			t = m(n)
		} catch {
			throw new k("Failed to base64url decode the payload")
		}
		try {
			r = JSON.parse(s.decode(t))
		} catch {
			throw new k("Failed to parse the decoded payload as JSON")
		}
		if (!Y(r)) throw new k("Invalid JWT Claims Set");
		return r
	}, "decodeProtectedHeader", 0, function(e) {
		let t;
		if ("string" == typeof e) {
			let r = e.split(".");
			(3 === r.length || 5 === r.length) && ([t] = r)
		} else if ("object" == typeof e && e)
			if ("protected" in e) t = e.protected;
			else throw TypeError("Token does not contain a Protected Header");
		try {
			if ("string" != typeof t || !t) throw Error();
			let e = JSON.parse(s.decode(m(t)));
			if (!Y(e)) throw Error();
			return e
		} catch {
			throw TypeError("Invalid Token or Protected Header formatting")
		}
	}, "errors", 0, t_, "experimental_jwksCache", 0, tA, "exportJWK", 0, eQ, "exportPKCS8", 0, eY, "exportSPKI", 0, eX, "flattenedDecrypt", 0, eV, "flattenedVerify", 0, e6, "generalDecrypt", 0, eG, "generalVerify", 0, e3, "generateKeyPair", 0, tC, "generateSecret", 0, tH, "importJWK", 0, eO, "importPKCS8", 0, eR, "importSPKI", 0, eC, "importX509", 0, eH, "jwksCache", 0, tA, "jwtDecrypt", 0, ta, "jwtVerify", 0, tn], 951584)
}, 733665, (e, t, r) => {
	var n = {
			872: function(e, t) {
				"use strict";
				t.byteLength = function(e) {
					var t = c(e),
						r = t[0],
						n = t[1];
					return (r + n) * 3 / 4 - n
				}, t.toByteArray = function(e) {
					var t, r, o = c(e),
						i = o[0],
						s = o[1],
						l = new a((i + s) * 3 / 4 - s),
						u = 0,
						d = s > 0 ? i - 4 : i;
					for (r = 0; r < d; r += 4) t = n[e.charCodeAt(r)] << 18 | n[e.charCodeAt(r + 1)] << 12 | n[e.charCodeAt(r + 2)] << 6 | n[e.charCodeAt(r + 3)], l[u++] = t >> 16 & 255, l[u++] = t >> 8 & 255, l[u++] = 255 & t;
					return 2 === s && (t = n[e.charCodeAt(r)] << 2 | n[e.charCodeAt(r + 1)] >> 4, l[u++] = 255 & t), 1 === s && (t = n[e.charCodeAt(r)] << 10 | n[e.charCodeAt(r + 1)] << 4 | n[e.charCodeAt(r + 2)] >> 2, l[u++] = t >> 8 & 255, l[u++] = 255 & t), l
				}, t.fromByteArray = function(e) {
					for (var t, n = e.length, a = n % 3, o = [], i = 0, s = n - a; i < s; i += 16383) o.push(function(e, t, n) {
						for (var a, o = [], i = t; i < n; i += 3) a = (e[i] << 16 & 0xff0000) + (e[i + 1] << 8 & 65280) + (255 & e[i + 2]), o.push(r[a >> 18 & 63] + r[a >> 12 & 63] + r[a >> 6 & 63] + r[63 & a]);
						return o.join("")
					}(e, i, i + 16383 > s ? s : i + 16383));
					return 1 === a ? o.push(r[(t = e[n - 1]) >> 2] + r[t << 4 & 63] + "==") : 2 === a && o.push(r[(t = (e[n - 2] << 8) + e[n - 1]) >> 10] + r[t >> 4 & 63] + r[t << 2 & 63] + "="), o.join("")
				};
				for (var r = [], n = [], a = "u" > typeof Uint8Array ? Uint8Array : Array, o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", i = 0, s = o.length; i < s; ++i) r[i] = o[i], n[o.charCodeAt(i)] = i;

				function c(e) {
					var t = e.length;
					if (t % 4 > 0) throw Error("Invalid string. Length must be a multiple of 4");
					var r = e.indexOf("="); - 1 === r && (r = t);
					var n = r === t ? 0 : 4 - r % 4;
					return [r, n]
				}
				n[45] = 62, n[95] = 63
			},
			230: function(e, t, r) {
				"use strict";
				var n = r(872),
					a = r(321),
					o = "function" == typeof Symbol && "function" == typeof Symbol.for ? Symbol.for("nodejs.util.inspect.custom") : null;

				function i(e) {
					if (e > 0x7fffffff) throw RangeError('The value "' + e + '" is invalid for option "size"');
					var t = new Uint8Array(e);
					return Object.setPrototypeOf(t, s.prototype), t
				}

				function s(e, t, r) {
					if ("number" == typeof e) {
						if ("string" == typeof t) throw TypeError('The "string" argument must be of type string. Received type number');
						return u(e)
					}
					return c(e, t, r)
				}

				function c(e, t, r) {
					if ("string" == typeof e) {
						var n = e,
							a = t;
						if (("string" != typeof a || "" === a) && (a = "utf8"), !s.isEncoding(a)) throw TypeError("Unknown encoding: " + a);
						var o = 0 | p(n, a),
							c = i(o),
							l = c.write(n, a);
						return l !== o && (c = c.slice(0, l)), c
					}
					if (ArrayBuffer.isView(e)) return d(e);
					if (null == e) throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e);
					if (H(e, ArrayBuffer) || e && H(e.buffer, ArrayBuffer) || "u" > typeof SharedArrayBuffer && (H(e, SharedArrayBuffer) || e && H(e.buffer, SharedArrayBuffer))) return function(e, t, r) {
						var n;
						if (t < 0 || e.byteLength < t) throw RangeError('"offset" is outside of buffer bounds');
						if (e.byteLength < t + (r || 0)) throw RangeError('"length" is outside of buffer bounds');
						return Object.setPrototypeOf(n = void 0 === t && void 0 === r ? new Uint8Array(e) : void 0 === r ? new Uint8Array(e, t) : new Uint8Array(e, t, r), s.prototype), n
					}(e, t, r);
					if ("number" == typeof e) throw TypeError('The "value" argument must not be of type number. Received type number');
					var u = e.valueOf && e.valueOf();
					if (null != u && u !== e) return s.from(u, t, r);
					var f = function(e) {
						if (s.isBuffer(e)) {
							var t = 0 | h(e.length),
								r = i(t);
							return 0 === r.length || e.copy(r, 0, 0, t), r
						}
						return void 0 !== e.length ? "number" != typeof e.length || function(e) {
							return e != e
						}(e.length) ? i(0) : d(e) : "Buffer" === e.type && Array.isArray(e.data) ? d(e.data) : void 0
					}(e);
					if (f) return f;
					if ("u" > typeof Symbol && null != Symbol.toPrimitive && "function" == typeof e[Symbol.toPrimitive]) return s.from(e[Symbol.toPrimitive]("string"), t, r);
					throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof e)
				}

				function l(e) {
					if ("number" != typeof e) throw TypeError('"size" argument must be of type number');
					if (e < 0) throw RangeError('The value "' + e + '" is invalid for option "size"')
				}

				function u(e) {
					return l(e), i(e < 0 ? 0 : 0 | h(e))
				}

				function d(e) {
					for (var t = e.length < 0 ? 0 : 0 | h(e.length), r = i(t), n = 0; n < t; n += 1) r[n] = 255 & e[n];
					return r
				}
				t.Buffer = s, t.SlowBuffer = function(e) {
					return +e != e && (e = 0), s.alloc(+e)
				}, t.INSPECT_MAX_BYTES = 50, t.kMaxLength = 0x7fffffff, s.TYPED_ARRAY_SUPPORT = function() {
					try {
						var e = new Uint8Array(1),
							t = {
								foo: function() {
									return 42
								}
							};
						return Object.setPrototypeOf(t, Uint8Array.prototype), Object.setPrototypeOf(e, t), 42 === e.foo()
					} catch (e) {
						return !1
					}
				}(), !s.TYPED_ARRAY_SUPPORT && "u" > typeof console && "function" == typeof console.error && console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."), Object.defineProperty(s.prototype, "parent", {
					enumerable: !0,
					get: function() {
						if (s.isBuffer(this)) return this.buffer
					}
				}), Object.defineProperty(s.prototype, "offset", {
					enumerable: !0,
					get: function() {
						if (s.isBuffer(this)) return this.byteOffset
					}
				}), s.poolSize = 8192, s.from = function(e, t, r) {
					return c(e, t, r)
				}, Object.setPrototypeOf(s.prototype, Uint8Array.prototype), Object.setPrototypeOf(s, Uint8Array), s.alloc = function(e, t, r) {
					return (l(e), e <= 0) ? i(e) : void 0 !== t ? "string" == typeof r ? i(e).fill(t, r) : i(e).fill(t) : i(e)
				}, s.allocUnsafe = function(e) {
					return u(e)
				}, s.allocUnsafeSlow = function(e) {
					return u(e)
				};

				function h(e) {
					if (e >= 0x7fffffff) throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");
					return 0 | e
				}

				function p(e, t) {
					if (s.isBuffer(e)) return e.length;
					if (ArrayBuffer.isView(e) || H(e, ArrayBuffer)) return e.byteLength;
					if ("string" != typeof e) throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof e);
					var r = e.length,
						n = arguments.length > 2 && !0 === arguments[2];
					if (!n && 0 === r) return 0;
					for (var a = !1;;) switch (t) {
						case "ascii":
						case "latin1":
						case "binary":
							return r;
						case "utf8":
						case "utf-8":
							return T(e).length;
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return 2 * r;
						case "hex":
							return r >>> 1;
						case "base64":
							return P(e).length;
						default:
							if (a) return n ? -1 : T(e).length;
							t = ("" + t).toLowerCase(), a = !0
					}
				}

				function f(e, t, r) {
					var a, o, i, s = !1;
					if ((void 0 === t || t < 0) && (t = 0), t > this.length || ((void 0 === r || r > this.length) && (r = this.length), r <= 0 || (r >>>= 0) <= (t >>>= 0))) return "";
					for (e || (e = "utf8");;) switch (e) {
						case "hex":
							return function(e, t, r) {
								var n = e.length;
								(!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
								for (var a = "", o = t; o < r; ++o) a += R[e[o]];
								return a
							}(this, t, r);
						case "utf8":
						case "utf-8":
							return g(this, t, r);
						case "ascii":
							return function(e, t, r) {
								var n = "";
								r = Math.min(e.length, r);
								for (var a = t; a < r; ++a) n += String.fromCharCode(127 & e[a]);
								return n
							}(this, t, r);
						case "latin1":
						case "binary":
							return function(e, t, r) {
								var n = "";
								r = Math.min(e.length, r);
								for (var a = t; a < r; ++a) n += String.fromCharCode(e[a]);
								return n
							}(this, t, r);
						case "base64":
							return a = this, o = t, i = r, 0 === o && i === a.length ? n.fromByteArray(a) : n.fromByteArray(a.slice(o, i));
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return function(e, t, r) {
								for (var n = e.slice(t, r), a = "", o = 0; o < n.length; o += 2) a += String.fromCharCode(n[o] + 256 * n[o + 1]);
								return a
							}(this, t, r);
						default:
							if (s) throw TypeError("Unknown encoding: " + e);
							e = (e + "").toLowerCase(), s = !0
					}
				}

				function y(e, t, r) {
					var n = e[t];
					e[t] = e[r], e[r] = n
				}

				function w(e, t, r, n, a) {
					var o;
					if (0 === e.length) return -1;
					if ("string" == typeof r ? (n = r, r = 0) : r > 0x7fffffff ? r = 0x7fffffff : r < -0x80000000 && (r = -0x80000000), (o = r *= 1) != o && (r = a ? 0 : e.length - 1), r < 0 && (r = e.length + r), r >= e.length)
						if (a) return -1;
						else r = e.length - 1;
					else if (r < 0)
						if (!a) return -1;
						else r = 0;
					if ("string" == typeof t && (t = s.from(t, n)), s.isBuffer(t)) return 0 === t.length ? -1 : m(e, t, r, n, a);
					if ("number" == typeof t) {
						if (t &= 255, "function" == typeof Uint8Array.prototype.indexOf)
							if (a) return Uint8Array.prototype.indexOf.call(e, t, r);
							else return Uint8Array.prototype.lastIndexOf.call(e, t, r);
						return m(e, [t], r, n, a)
					}
					throw TypeError("val must be string, number or Buffer")
				}

				function m(e, t, r, n, a) {
					var o, i = 1,
						s = e.length,
						c = t.length;
					if (void 0 !== n && ("ucs2" === (n = String(n).toLowerCase()) || "ucs-2" === n || "utf16le" === n || "utf-16le" === n)) {
						if (e.length < 2 || t.length < 2) return -1;
						i = 2, s /= 2, c /= 2, r /= 2
					}

					function l(e, t) {
						return 1 === i ? e[t] : e.readUInt16BE(t * i)
					}
					if (a) {
						var u = -1;
						for (o = r; o < s; o++)
							if (l(e, o) === l(t, -1 === u ? 0 : o - u)) {
								if (-1 === u && (u = o), o - u + 1 === c) return u * i
							} else - 1 !== u && (o -= o - u), u = -1
					} else
						for (r + c > s && (r = s - c), o = r; o >= 0; o--) {
							for (var d = !0, h = 0; h < c; h++)
								if (l(e, o + h) !== l(t, h)) {
									d = !1;
									break
								} if (d) return o
						}
					return -1
				}
				s.isBuffer = function(e) {
					return null != e && !0 === e._isBuffer && e !== s.prototype
				}, s.compare = function(e, t) {
					if (H(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), H(t, Uint8Array) && (t = s.from(t, t.offset, t.byteLength)), !s.isBuffer(e) || !s.isBuffer(t)) throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');
					if (e === t) return 0;
					for (var r = e.length, n = t.length, a = 0, o = Math.min(r, n); a < o; ++a)
						if (e[a] !== t[a]) {
							r = e[a], n = t[a];
							break
						} return r < n ? -1 : +(n < r)
				}, s.isEncoding = function(e) {
					switch (String(e).toLowerCase()) {
						case "hex":
						case "utf8":
						case "utf-8":
						case "ascii":
						case "latin1":
						case "binary":
						case "base64":
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return !0;
						default:
							return !1
					}
				}, s.concat = function(e, t) {
					if (!Array.isArray(e)) throw TypeError('"list" argument must be an Array of Buffers');
					if (0 === e.length) return s.alloc(0);
					if (void 0 === t)
						for (r = 0, t = 0; r < e.length; ++r) t += e[r].length;
					var r, n = s.allocUnsafe(t),
						a = 0;
					for (r = 0; r < e.length; ++r) {
						var o = e[r];
						if (H(o, Uint8Array) && (o = s.from(o)), !s.isBuffer(o)) throw TypeError('"list" argument must be an Array of Buffers');
						o.copy(n, a), a += o.length
					}
					return n
				}, s.byteLength = p, s.prototype._isBuffer = !0, s.prototype.swap16 = function() {
					var e = this.length;
					if (e % 2 != 0) throw RangeError("Buffer size must be a multiple of 16-bits");
					for (var t = 0; t < e; t += 2) y(this, t, t + 1);
					return this
				}, s.prototype.swap32 = function() {
					var e = this.length;
					if (e % 4 != 0) throw RangeError("Buffer size must be a multiple of 32-bits");
					for (var t = 0; t < e; t += 4) y(this, t, t + 3), y(this, t + 1, t + 2);
					return this
				}, s.prototype.swap64 = function() {
					var e = this.length;
					if (e % 8 != 0) throw RangeError("Buffer size must be a multiple of 64-bits");
					for (var t = 0; t < e; t += 8) y(this, t, t + 7), y(this, t + 1, t + 6), y(this, t + 2, t + 5), y(this, t + 3, t + 4);
					return this
				}, s.prototype.toString = function() {
					var e = this.length;
					return 0 === e ? "" : 0 == arguments.length ? g(this, 0, e) : f.apply(this, arguments)
				}, s.prototype.toLocaleString = s.prototype.toString, s.prototype.equals = function(e) {
					if (!s.isBuffer(e)) throw TypeError("Argument must be a Buffer");
					return this === e || 0 === s.compare(this, e)
				}, s.prototype.inspect = function() {
					var e = "",
						r = t.INSPECT_MAX_BYTES;
					return e = this.toString("hex", 0, r).replace(/(.{2})/g, "$1 ").trim(), this.length > r && (e += " ... "), "<Buffer " + e + ">"
				}, o && (s.prototype[o] = s.prototype.inspect), s.prototype.compare = function(e, t, r, n, a) {
					if (H(e, Uint8Array) && (e = s.from(e, e.offset, e.byteLength)), !s.isBuffer(e)) throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof e);
					if (void 0 === t && (t = 0), void 0 === r && (r = e ? e.length : 0), void 0 === n && (n = 0), void 0 === a && (a = this.length), t < 0 || r > e.length || n < 0 || a > this.length) throw RangeError("out of range index");
					if (n >= a && t >= r) return 0;
					if (n >= a) return -1;
					if (t >= r) return 1;
					if (t >>>= 0, r >>>= 0, n >>>= 0, a >>>= 0, this === e) return 0;
					for (var o = a - n, i = r - t, c = Math.min(o, i), l = this.slice(n, a), u = e.slice(t, r), d = 0; d < c; ++d)
						if (l[d] !== u[d]) {
							o = l[d], i = u[d];
							break
						} return o < i ? -1 : +(i < o)
				}, s.prototype.includes = function(e, t, r) {
					return -1 !== this.indexOf(e, t, r)
				}, s.prototype.indexOf = function(e, t, r) {
					return w(this, e, t, r, !0)
				}, s.prototype.lastIndexOf = function(e, t, r) {
					return w(this, e, t, r, !1)
				};

				function g(e, t, r) {
					r = Math.min(e.length, r);
					for (var n = [], a = t; a < r;) {
						var o, i, s, c, l = e[a],
							u = null,
							d = l > 239 ? 4 : l > 223 ? 3 : l > 191 ? 2 : 1;
						if (a + d <= r) switch (d) {
							case 1:
								l < 128 && (u = l);
								break;
							case 2:
								(192 & (o = e[a + 1])) == 128 && (c = (31 & l) << 6 | 63 & o) > 127 && (u = c);
								break;
							case 3:
								o = e[a + 1], i = e[a + 2], (192 & o) == 128 && (192 & i) == 128 && (c = (15 & l) << 12 | (63 & o) << 6 | 63 & i) > 2047 && (c < 55296 || c > 57343) && (u = c);
								break;
							case 4:
								o = e[a + 1], i = e[a + 2], s = e[a + 3], (192 & o) == 128 && (192 & i) == 128 && (192 & s) == 128 && (c = (15 & l) << 18 | (63 & o) << 12 | (63 & i) << 6 | 63 & s) > 65535 && c < 1114112 && (u = c)
						}
						null === u ? (u = 65533, d = 1) : u > 65535 && (u -= 65536, n.push(u >>> 10 & 1023 | 55296), u = 56320 | 1023 & u), n.push(u), a += d
					}
					var h = n,
						p = h.length;
					if (p <= 4096) return String.fromCharCode.apply(String, h);
					for (var f = "", y = 0; y < p;) f += String.fromCharCode.apply(String, h.slice(y, y += 4096));
					return f
				}

				function b(e, t, r) {
					if (e % 1 != 0 || e < 0) throw RangeError("offset is not uint");
					if (e + t > r) throw RangeError("Trying to access beyond buffer length")
				}

				function E(e, t, r, n, a, o) {
					if (!s.isBuffer(e)) throw TypeError('"buffer" argument must be a Buffer instance');
					if (t > a || t < o) throw RangeError('"value" argument is out of bounds');
					if (r + n > e.length) throw RangeError("Index out of range")
				}

				function v(e, t, r, n, a, o) {
					if (r + n > e.length || r < 0) throw RangeError("Index out of range")
				}

				function A(e, t, r, n, o) {
					return t *= 1, r >>>= 0, o || v(e, t, r, 4, 34028234663852886e22, -34028234663852886e22), a.write(e, t, r, n, 23, 4), r + 4
				}

				function S(e, t, r, n, o) {
					return t *= 1, r >>>= 0, o || v(e, t, r, 8, 17976931348623157e292, -17976931348623157e292), a.write(e, t, r, n, 52, 8), r + 8
				}
				s.prototype.write = function(e, t, r, n) {
					if (void 0 === t) n = "utf8", r = this.length, t = 0;
					else if (void 0 === r && "string" == typeof t) n = t, r = this.length, t = 0;
					else if (isFinite(t)) t >>>= 0, isFinite(r) ? (r >>>= 0, void 0 === n && (n = "utf8")) : (n = r, r = void 0);
					else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");
					var a, o, i, s, c, l, u, d, h = this.length - t;
					if ((void 0 === r || r > h) && (r = h), e.length > 0 && (r < 0 || t < 0) || t > this.length) throw RangeError("Attempt to write outside buffer bounds");
					n || (n = "utf8");
					for (var p = !1;;) switch (n) {
						case "hex":
							return function(e, t, r, n) {
								r = Number(r) || 0;
								var a = e.length - r;
								n ? (n = Number(n)) > a && (n = a) : n = a;
								var o = t.length;
								n > o / 2 && (n = o / 2);
								for (var i = 0; i < n; ++i) {
									var s, c = parseInt(t.substr(2 * i, 2), 16);
									if ((s = c) != s) break;
									e[r + i] = c
								}
								return i
							}(this, e, t, r);
						case "utf8":
						case "utf-8":
							return a = t, o = r, C(T(e, this.length - a), this, a, o);
						case "ascii":
							return i = t, s = r, C(k(e), this, i, s);
						case "latin1":
						case "binary":
							return function(e, t, r, n) {
								return C(k(t), e, r, n)
							}(this, e, t, r);
						case "base64":
							return c = t, l = r, C(P(e), this, c, l);
						case "ucs2":
						case "ucs-2":
						case "utf16le":
						case "utf-16le":
							return u = t, d = r, C(function(e, t) {
								for (var r, n, a = [], o = 0; o < e.length && !((t -= 2) < 0); ++o) n = (r = e.charCodeAt(o)) >> 8, a.push(r % 256), a.push(n);
								return a
							}(e, this.length - u), this, u, d);
						default:
							if (p) throw TypeError("Unknown encoding: " + n);
							n = ("" + n).toLowerCase(), p = !0
					}
				}, s.prototype.toJSON = function() {
					return {
						type: "Buffer",
						data: Array.prototype.slice.call(this._arr || this, 0)
					}
				}, s.prototype.slice = function(e, t) {
					var r = this.length;
					e = ~~e, t = void 0 === t ? r : ~~t, e < 0 ? (e += r) < 0 && (e = 0) : e > r && (e = r), t < 0 ? (t += r) < 0 && (t = 0) : t > r && (t = r), t < e && (t = e);
					var n = this.subarray(e, t);
					return Object.setPrototypeOf(n, s.prototype), n
				}, s.prototype.readUIntLE = function(e, t, r) {
					e >>>= 0, t >>>= 0, r || b(e, t, this.length);
					for (var n = this[e], a = 1, o = 0; ++o < t && (a *= 256);) n += this[e + o] * a;
					return n
				}, s.prototype.readUIntBE = function(e, t, r) {
					e >>>= 0, t >>>= 0, r || b(e, t, this.length);
					for (var n = this[e + --t], a = 1; t > 0 && (a *= 256);) n += this[e + --t] * a;
					return n
				}, s.prototype.readUInt8 = function(e, t) {
					return e >>>= 0, t || b(e, 1, this.length), this[e]
				}, s.prototype.readUInt16LE = function(e, t) {
					return e >>>= 0, t || b(e, 2, this.length), this[e] | this[e + 1] << 8
				}, s.prototype.readUInt16BE = function(e, t) {
					return e >>>= 0, t || b(e, 2, this.length), this[e] << 8 | this[e + 1]
				}, s.prototype.readUInt32LE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + 0x1000000 * this[e + 3]
				}, s.prototype.readUInt32BE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), 0x1000000 * this[e] + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
				}, s.prototype.readIntLE = function(e, t, r) {
					e >>>= 0, t >>>= 0, r || b(e, t, this.length);
					for (var n = this[e], a = 1, o = 0; ++o < t && (a *= 256);) n += this[e + o] * a;
					return n >= (a *= 128) && (n -= Math.pow(2, 8 * t)), n
				}, s.prototype.readIntBE = function(e, t, r) {
					e >>>= 0, t >>>= 0, r || b(e, t, this.length);
					for (var n = t, a = 1, o = this[e + --n]; n > 0 && (a *= 256);) o += this[e + --n] * a;
					return o >= (a *= 128) && (o -= Math.pow(2, 8 * t)), o
				}, s.prototype.readInt8 = function(e, t) {
					return (e >>>= 0, t || b(e, 1, this.length), 128 & this[e]) ? -((255 - this[e] + 1) * 1) : this[e]
				}, s.prototype.readInt16LE = function(e, t) {
					e >>>= 0, t || b(e, 2, this.length);
					var r = this[e] | this[e + 1] << 8;
					return 32768 & r ? 0xffff0000 | r : r
				}, s.prototype.readInt16BE = function(e, t) {
					e >>>= 0, t || b(e, 2, this.length);
					var r = this[e + 1] | this[e] << 8;
					return 32768 & r ? 0xffff0000 | r : r
				}, s.prototype.readInt32LE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
				}, s.prototype.readInt32BE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
				}, s.prototype.readFloatLE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), a.read(this, e, !0, 23, 4)
				}, s.prototype.readFloatBE = function(e, t) {
					return e >>>= 0, t || b(e, 4, this.length), a.read(this, e, !1, 23, 4)
				}, s.prototype.readDoubleLE = function(e, t) {
					return e >>>= 0, t || b(e, 8, this.length), a.read(this, e, !0, 52, 8)
				}, s.prototype.readDoubleBE = function(e, t) {
					return e >>>= 0, t || b(e, 8, this.length), a.read(this, e, !1, 52, 8)
				}, s.prototype.writeUIntLE = function(e, t, r, n) {
					if (e *= 1, t >>>= 0, r >>>= 0, !n) {
						var a = Math.pow(2, 8 * r) - 1;
						E(this, e, t, r, a, 0)
					}
					var o = 1,
						i = 0;
					for (this[t] = 255 & e; ++i < r && (o *= 256);) this[t + i] = e / o & 255;
					return t + r
				}, s.prototype.writeUIntBE = function(e, t, r, n) {
					if (e *= 1, t >>>= 0, r >>>= 0, !n) {
						var a = Math.pow(2, 8 * r) - 1;
						E(this, e, t, r, a, 0)
					}
					var o = r - 1,
						i = 1;
					for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) this[t + o] = e / i & 255;
					return t + r
				}, s.prototype.writeUInt8 = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 1, 255, 0), this[t] = 255 & e, t + 1
				}, s.prototype.writeUInt16LE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 2, 65535, 0), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
				}, s.prototype.writeUInt16BE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 2, 65535, 0), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
				}, s.prototype.writeUInt32LE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 4, 0xffffffff, 0), this[t + 3] = e >>> 24, this[t + 2] = e >>> 16, this[t + 1] = e >>> 8, this[t] = 255 & e, t + 4
				}, s.prototype.writeUInt32BE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 4, 0xffffffff, 0), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
				}, s.prototype.writeIntLE = function(e, t, r, n) {
					if (e *= 1, t >>>= 0, !n) {
						var a = Math.pow(2, 8 * r - 1);
						E(this, e, t, r, a - 1, -a)
					}
					var o = 0,
						i = 1,
						s = 0;
					for (this[t] = 255 & e; ++o < r && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o - 1] && (s = 1), this[t + o] = (e / i | 0) - s & 255;
					return t + r
				}, s.prototype.writeIntBE = function(e, t, r, n) {
					if (e *= 1, t >>>= 0, !n) {
						var a = Math.pow(2, 8 * r - 1);
						E(this, e, t, r, a - 1, -a)
					}
					var o = r - 1,
						i = 1,
						s = 0;
					for (this[t + o] = 255 & e; --o >= 0 && (i *= 256);) e < 0 && 0 === s && 0 !== this[t + o + 1] && (s = 1), this[t + o] = (e / i | 0) - s & 255;
					return t + r
				}, s.prototype.writeInt8 = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 1, 127, -128), e < 0 && (e = 255 + e + 1), this[t] = 255 & e, t + 1
				}, s.prototype.writeInt16LE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 2, 32767, -32768), this[t] = 255 & e, this[t + 1] = e >>> 8, t + 2
				}, s.prototype.writeInt16BE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 2, 32767, -32768), this[t] = e >>> 8, this[t + 1] = 255 & e, t + 2
				}, s.prototype.writeInt32LE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 4, 0x7fffffff, -0x80000000), this[t] = 255 & e, this[t + 1] = e >>> 8, this[t + 2] = e >>> 16, this[t + 3] = e >>> 24, t + 4
				}, s.prototype.writeInt32BE = function(e, t, r) {
					return e *= 1, t >>>= 0, r || E(this, e, t, 4, 0x7fffffff, -0x80000000), e < 0 && (e = 0xffffffff + e + 1), this[t] = e >>> 24, this[t + 1] = e >>> 16, this[t + 2] = e >>> 8, this[t + 3] = 255 & e, t + 4
				}, s.prototype.writeFloatLE = function(e, t, r) {
					return A(this, e, t, !0, r)
				}, s.prototype.writeFloatBE = function(e, t, r) {
					return A(this, e, t, !1, r)
				}, s.prototype.writeDoubleLE = function(e, t, r) {
					return S(this, e, t, !0, r)
				}, s.prototype.writeDoubleBE = function(e, t, r) {
					return S(this, e, t, !1, r)
				}, s.prototype.copy = function(e, t, r, n) {
					if (!s.isBuffer(e)) throw TypeError("argument should be a Buffer");
					if (r || (r = 0), n || 0 === n || (n = this.length), t >= e.length && (t = e.length), t || (t = 0), n > 0 && n < r && (n = r), n === r || 0 === e.length || 0 === this.length) return 0;
					if (t < 0) throw RangeError("targetStart out of bounds");
					if (r < 0 || r >= this.length) throw RangeError("Index out of range");
					if (n < 0) throw RangeError("sourceEnd out of bounds");
					n > this.length && (n = this.length), e.length - t < n - r && (n = e.length - t + r);
					var a = n - r;
					if (this === e && "function" == typeof Uint8Array.prototype.copyWithin) this.copyWithin(t, r, n);
					else if (this === e && r < t && t < n)
						for (var o = a - 1; o >= 0; --o) e[o + t] = this[o + r];
					else Uint8Array.prototype.set.call(e, this.subarray(r, n), t);
					return a
				}, s.prototype.fill = function(e, t, r, n) {
					if ("string" == typeof e) {
						if ("string" == typeof t ? (n = t, t = 0, r = this.length) : "string" == typeof r && (n = r, r = this.length), void 0 !== n && "string" != typeof n) throw TypeError("encoding must be a string");
						if ("string" == typeof n && !s.isEncoding(n)) throw TypeError("Unknown encoding: " + n);
						if (1 === e.length) {
							var a, o = e.charCodeAt(0);
							("utf8" === n && o < 128 || "latin1" === n) && (e = o)
						}
					} else "number" == typeof e ? e &= 255 : "boolean" == typeof e && (e = Number(e));
					if (t < 0 || this.length < t || this.length < r) throw RangeError("Out of range index");
					if (r <= t) return this;
					if (t >>>= 0, r = void 0 === r ? this.length : r >>> 0, e || (e = 0), "number" == typeof e)
						for (a = t; a < r; ++a) this[a] = e;
					else {
						var i = s.isBuffer(e) ? e : s.from(e, n),
							c = i.length;
						if (0 === c) throw TypeError('The value "' + e + '" is invalid for argument "value"');
						for (a = 0; a < r - t; ++a) this[a + t] = i[a % c]
					}
					return this
				};
				var _ = /[^+/0-9A-Za-z-_]/g;

				function T(e, t) {
					t = t || 1 / 0;
					for (var r, n = e.length, a = null, o = [], i = 0; i < n; ++i) {
						if ((r = e.charCodeAt(i)) > 55295 && r < 57344) {
							if (!a) {
								if (r > 56319 || i + 1 === n) {
									(t -= 3) > -1 && o.push(239, 191, 189);
									continue
								}
								a = r;
								continue
							}
							if (r < 56320) {
								(t -= 3) > -1 && o.push(239, 191, 189), a = r;
								continue
							}
							r = (a - 55296 << 10 | r - 56320) + 65536
						} else a && (t -= 3) > -1 && o.push(239, 191, 189);
						if (a = null, r < 128) {
							if ((t -= 1) < 0) break;
							o.push(r)
						} else if (r < 2048) {
							if ((t -= 2) < 0) break;
							o.push(r >> 6 | 192, 63 & r | 128)
						} else if (r < 65536) {
							if ((t -= 3) < 0) break;
							o.push(r >> 12 | 224, r >> 6 & 63 | 128, 63 & r | 128)
						} else if (r < 1114112) {
							if ((t -= 4) < 0) break;
							o.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, 63 & r | 128)
						} else throw Error("Invalid code point")
					}
					return o
				}

				function k(e) {
					for (var t = [], r = 0; r < e.length; ++r) t.push(255 & e.charCodeAt(r));
					return t
				}

				function P(e) {
					return n.toByteArray(function(e) {
						if ((e = (e = e.split("=")[0]).trim().replace(_, "")).length < 2) return "";
						for (; e.length % 4 != 0;) e += "=";
						return e
					}(e))
				}

				function C(e, t, r, n) {
					for (var a = 0; a < n && !(a + r >= t.length) && !(a >= e.length); ++a) t[a + r] = e[a];
					return a
				}

				function H(e, t) {
					return e instanceof t || null != e && null != e.constructor && null != e.constructor.name && e.constructor.name === t.name
				}
				var R = function() {
					for (var e = "0123456789abcdef", t = Array(256), r = 0; r < 16; ++r)
						for (var n = 16 * r, a = 0; a < 16; ++a) t[n + a] = e[r] + e[a];
					return t
				}()
			},
			321: function(e, t) {
				t.read = function(e, t, r, n, a) {
					var o, i, s = 8 * a - n - 1,
						c = (1 << s) - 1,
						l = c >> 1,
						u = -7,
						d = r ? a - 1 : 0,
						h = r ? -1 : 1,
						p = e[t + d];
					for (d += h, o = p & (1 << -u) - 1, p >>= -u, u += s; u > 0; o = 256 * o + e[t + d], d += h, u -= 8);
					for (i = o & (1 << -u) - 1, o >>= -u, u += n; u > 0; i = 256 * i + e[t + d], d += h, u -= 8);
					if (0 === o) o = 1 - l;
					else {
						if (o === c) return i ? 0 / 0 : (p ? -1 : 1) * 2e308;
						i += Math.pow(2, n), o -= l
					}
					return (p ? -1 : 1) * i * Math.pow(2, o - n)
				}, t.write = function(e, t, r, n, a, o) {
					var i, s, c, l = 8 * o - a - 1,
						u = (1 << l) - 1,
						d = u >> 1,
						h = 5960464477539062e-23 * (23 === a),
						p = n ? 0 : o - 1,
						f = n ? 1 : -1,
						y = +(t < 0 || 0 === t && 1 / t < 0);
					for (isNaN(t = Math.abs(t)) || 1 / 0 === t ? (s = +!!isNaN(t), i = u) : (i = Math.floor(Math.log(t) / Math.LN2), t * (c = Math.pow(2, -i)) < 1 && (i--, c *= 2), i + d >= 1 ? t += h / c : t += h * Math.pow(2, 1 - d), t * c >= 2 && (i++, c /= 2), i + d >= u ? (s = 0, i = u) : i + d >= 1 ? (s = (t * c - 1) * Math.pow(2, a), i += d) : (s = t * Math.pow(2, d - 1) * Math.pow(2, a), i = 0)); a >= 8; e[r + p] = 255 & s, p += f, s /= 256, a -= 8);
					for (i = i << a | s, l += a; l > 0; e[r + p] = 255 & i, p += f, i /= 256, l -= 8);
					e[r + p - f] |= 128 * y
				}
			}
		},
		a = {};

	function o(e) {
		var t = a[e];
		if (void 0 !== t) return t.exports;
		var r = a[e] = {
				exports: {}
			},
			i = !0;
		try {
			n[e](r, r.exports, o), i = !1
		} finally {
			i && delete a[e]
		}
		return r.exports
	}
	o.ab = "/ROOT/node_modules/.pnpm/next@16.4.5_@opentelemetry+api@1.9.0_@playwright+test@1.65.0_@types+node@24.19.2_babel-_17b4f2f99b0f6a0c6b17cfbd2a006b80/node_modules/next/dist/compiled/buffer/", t.exports = o(230)
}, 629103, (e, t, r) => {
	t.exports = e.r(731238)
}, 731238, (e, t, r) => {
	var n = e.r(970210);
	r.operation = function(e) {
		return new n(r.timeouts(e), {
			forever: e && (e.forever || 1 / 0 === e.retries),
			unref: e && e.unref,
			maxRetryTime: e && e.maxRetryTime
		})
	}, r.timeouts = function(e) {
		if (e instanceof Array) return [].concat(e);
		var t = {
			retries: 10,
			factor: 2,
			minTimeout: 1e3,
			maxTimeout: 1 / 0,
			randomize: !1
		};
		for (var r in e) t[r] = e[r];
		if (t.minTimeout > t.maxTimeout) throw Error("minTimeout is greater than maxTimeout");
		for (var n = [], a = 0; a < t.retries; a++) n.push(this.createTimeout(a, t));
		return e && e.forever && !n.length && n.push(this.createTimeout(a, t)), n.sort(function(e, t) {
			return e - t
		}), n
	}, r.createTimeout = function(e, t) {
		var r = Math.round((t.randomize ? Math.random() + 1 : 1) * Math.max(t.minTimeout, 1) * Math.pow(t.factor, e));
		return Math.min(r, t.maxTimeout)
	}, r.wrap = function(e, t, n) {
		if (t instanceof Array && (n = t, t = null), !n)
			for (var a in n = [], e) "function" == typeof e[a] && n.push(a);
		for (var o = 0; o < n.length; o++) {
			var i = n[o],
				s = e[i];
			e[i] = (function(n) {
				var a = r.operation(t),
					o = Array.prototype.slice.call(arguments, 1),
					i = o.pop();
				o.push(function(e) {
					a.retry(e) || (e && (arguments[0] = a.mainError()), i.apply(this, arguments))
				}), a.attempt(function() {
					n.apply(e, o)
				})
			}).bind(e, s), e[i].options = t
		}
	}
}, 970210, (e, t, r) => {
	function n(e, t) {
		"boolean" == typeof t && (t = {
			forever: t
		}), this._originalTimeouts = JSON.parse(JSON.stringify(e)), this._timeouts = e, this._options = t || {}, this._maxRetryTime = t && t.maxRetryTime || 1 / 0, this._fn = null, this._errors = [], this._attempts = 1, this._operationTimeout = null, this._operationTimeoutCb = null, this._timeout = null, this._operationStart = null, this._timer = null, this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0))
	}
	t.exports = n, n.prototype.reset = function() {
		this._attempts = 1, this._timeouts = this._originalTimeouts.slice(0)
	}, n.prototype.stop = function() {
		this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), this._timeouts = [], this._cachedTimeouts = null
	}, n.prototype.retry = function(e) {
		if (this._timeout && clearTimeout(this._timeout), !e) return !1;
		var t = new Date().getTime();
		if (e && t - this._operationStart >= this._maxRetryTime) return this._errors.push(e), this._errors.unshift(Error("RetryOperation timeout occurred")), !1;
		this._errors.push(e);
		var r = this._timeouts.shift();
		if (void 0 === r)
			if (!this._cachedTimeouts) return !1;
			else this._errors.splice(0, this._errors.length - 1), r = this._cachedTimeouts.slice(-1);
		var n = this;
		return this._timer = setTimeout(function() {
			n._attempts++, n._operationTimeoutCb && (n._timeout = setTimeout(function() {
				n._operationTimeoutCb(n._attempts)
			}, n._operationTimeout), n._options.unref && n._timeout.unref()), n._fn(n._attempts)
		}, r), this._options.unref && this._timer.unref(), !0
	}, n.prototype.attempt = function(e, t) {
		this._fn = e, t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
		var r = this;
		this._operationTimeoutCb && (this._timeout = setTimeout(function() {
			r._operationTimeoutCb()
		}, r._operationTimeout)), this._operationStart = new Date().getTime(), this._fn(this._attempts)
	}, n.prototype.try = function(e) {
		console.log("Using RetryOperation.try() is deprecated"), this.attempt(e)
	}, n.prototype.start = function(e) {
		console.log("Using RetryOperation.start() is deprecated"), this.attempt(e)
	}, n.prototype.start = n.prototype.try, n.prototype.errors = function() {
		return this._errors
	}, n.prototype.attempts = function() {
		return this._attempts
	}, n.prototype.mainError = function() {
		if (0 === this._errors.length) return null;
		for (var e = {}, t = null, r = 0, n = 0; n < this._errors.length; n++) {
			var a = this._errors[n],
				o = a.message,
				i = (e[o] || 0) + 1;
			e[o] = i, i >= r && (t = a, r = i)
		}
		return t
	}
}, 561030, (e, t, r) => {
	t.exports = function(e, t) {
		let r;
		if ("function" != typeof e) throw TypeError(`Expected the first argument to be a \`function\`, got \`${typeof e}\`.`);
		let n = 0;
		return function(...a) {
			clearTimeout(r);
			let o = Date.now(),
				i = t - (o - n);
			i <= 0 ? (n = o, e.apply(this, a)) : r = setTimeout(() => {
				n = Date.now(), e.apply(this, a)
			}, i)
		}
	}
}]);