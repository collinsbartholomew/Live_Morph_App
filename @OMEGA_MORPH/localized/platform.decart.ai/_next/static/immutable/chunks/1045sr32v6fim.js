(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 551897, 745889, 833186, 981949, 527153, 890850, e => {
	"use strict";
	let t;
	var i = e.i(582018),
		r = e.i(633627),
		n = e.i(987873),
		a = e.i(351570),
		o = e.i(322932),
		s = e.i(155990),
		l = e.i(267649),
		c = e.i(486399),
		u = e.i(528506),
		d = e.i(170380),
		h = e.i(663303);
	let p = new Set(["INVALID_API_KEY", "ERROR_CODE_INVALID_API_KEY", "TOKEN_EXPIRED"]),
		m = new Set(["api key is disabled", "invalid api key", "invalidapikeyerror", "missing api key", "no or invalid api key provided", "unauthorized"]),
		g = ["api key expired", "client token expired", "expired api key", "expired client token", "token expired"];
	async function f(e, t) {
		let i = await fetch("/api/client/tokens", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				expiresIn: e
			}),
			signal: t
		});
		if (!i.ok) throw Error("Failed to generate ephemeral API key. Please sign in.", {
			cause: await i.json().then(e => e.error).catch(() => void 0)
		});
		let r = await i.json();
		if (!r.token) throw Error("Invalid client token response");
		return r.token
	}
	let y = 0;
	async function b(e) {
		if (t && Date.now() - t.mintedAt < 6e5) return t.token;
		let i = y,
			r = Date.now(),
			n = await f(3600, e);
		return i === y && (t = {
			token: n,
			mintedAt: r
		}), n
	}

	function v() {}
	async function w(e) {
		let t = v();
		if (t) return t;
		try {
			return await b(e)
		} catch (e) {
			if (e instanceof Error && "string" == typeof e.cause && e.cause) throw Error(e.cause, {
				cause: e
			});
			throw e
		}
	}
	h.i.$store.atoms.$sessionSignal.listen(() => {
		y++, t = void 0
	}), e.s(["b", 0, w, "L", 0, function(e) {
		let t = ("string" == typeof e ? [e] : e instanceof Error ? [e.name, e.message] : "object" != typeof e || null === e ? [] : ["message", "error", "detail", "code", "name", "status", "statusCode"].map(t => {
			let i = e[t];
			return "string" == typeof i || "number" == typeof i ? String(i) : ""
		}).filter(Boolean)).map(e => e.replace(/\s+/g, " ").trim()).filter(Boolean);
		if (0 === t.length) return !1;
		if (t.some(e => /\b401\b/.test(e)) || t.some(e => p.has(e.toUpperCase()))) return !0;
		let i = t.join(" ").toLowerCase();
		return !![...m].some(e => i.includes(e)) || g.some(e => i.includes(e))
	}, "I", 0, function() {
		let {
			isAuthenticated: e
		} = (0, l.f)(), t = (0, d.useRef)(!1);
		return t.current = e(), {
			getClientToken: (0, d.useCallback)(async () => {
				let e = v();
				if (e) return e;
				if (!t.current) throw Error("Not authenticated. Please sign in.");
				return b()
			}, [])
		}
	}], 745889);
	var k = e.i(196695);
	class S extends Error {
		status;
		details;
		constructor(e, t, i) {
			super(e), this.name = "GenerationError", this.status = t, this.details = i
		}
	}

	function T(e) {
		if (e instanceof S) {
			if ("Validation failed" === e.message && e.details?.length) {
				let t = e.details[0],
					i = t.path.join(".") || "input";
				return `Invalid ${i}: ${t.message}`
			}
			return e.message
		}
		return e instanceof Error ? e.message : "An unexpected error occurred"
	}
	async function R(e, t = "Request failed") {
		try {
			let i = await e.json();
			return new S(i.error || t, e.status, i.details)
		} catch {
			return new S(t, e.status)
		}
	}
	async function P(e) {
		let t = await w(e);
		return (0, r.f)({
			apiKey: t,
			integration: "platform"
		})
	}
	async function M(e, {
		prompt: t = "",
		resolution: i,
		data: r,
		reference_image: a
	}, o) {
		let s = (0, c.U)(e);
		if (!s) throw Error(`Unknown model key: ${e}`);
		let l = await P(o),
			u = a ? {
				reference_image: a
			} : void 0;
		try {
			if ("process" === s.generationKind) {
				let e = n.$.image(s.name);
				return await l.process({
					model: e,
					prompt: t,
					data: r,
					resolution: i,
					...u,
					signal: o
				})
			}
			if ("lucy-restyle-2" === s.name) return await l.queue.submit({
				model: n.$.video(s.name),
				data: r,
				resolution: "720p",
				...u ?? {
					prompt: t
				},
				signal: o
			});
			let e = n.$.video(s.name);
			return await l.queue.submit({
				model: e,
				prompt: t,
				data: r,
				...u,
				signal: o
			})
		} catch (e) {
			throw C(e)
		}
	}
	e.s(["Z", 0, T, "_", 0, R], 833186);
	let E = "Content violates our Terms of Service";

	function C(e) {
		let t = e?.message;
		if (e instanceof Error || "string" != typeof t) return e;
		if (t.includes(E)) return Error(E);
		let [, i, r] = t.match(/^(?:Failed to submit job|Failed to get job \w+|Processing failed): (\d+) - ([\s\S]*)$/) ?? [];
		return "504" === i ? Error("Service is experiencing high traffic. Please try again in a few moments.") : Error(r || t)
	}

	function I(e) {
		return e.selectedModelKey
	}

	function D(e) {
		return e.setJobStartTime
	}

	function x(e) {
		return e.setGenerationId
	}

	function A(e) {
		return e.setQueueStatus
	}

	function U(e) {
		return e.setQueueJobId
	}

	function z(e) {
		return e.setIsGenerating
	}

	function _(e) {
		return e.setStudioOutput
	}
	e.s(["N", 0, P, "d", 0, M, "X", 0, C, "_", 0, function() {
		let e, t, r, n, c, d = (0, i.c)(21),
			{
				refetchUser: h
			} = (0, l.f)(),
			p = (0, s.f)(),
			m = (0, k.useStudioStore)(_),
			g = (0, k.useStudioStore)(z),
			f = (0, k.useStudioStore)(U),
			y = (0, k.useStudioStore)(A),
			b = (0, k.useStudioStore)(x),
			v = (0, k.useStudioStore)(D),
			w = (0, k.useStudioStore)(I);
		return d[0] !== p || d[1] !== w ? (e = async e => {
			let {
				input: t,
				cost: i
			} = e;
			if (!w) throw Error("No model selected");
			if (p < i) throw Error("Insufficient credits");
			return u.f.trackGenerateStart({
				modelName: w,
				tokenAmount: i
			}), M(w, t)
		}, d[0] = p, d[1] = w, d[2] = e) : e = d[2], d[3] !== b || d[4] !== g ? (t = () => {
			g(!0), b(null)
		}, d[3] = b, d[4] = g, d[5] = t) : t = d[5], d[6] !== h || d[7] !== w || d[8] !== g || d[9] !== v || d[10] !== f || d[11] !== y || d[12] !== m ? (r = (e, t) => {
			if (!(e instanceof Blob)) {
				f(e.job_id), y(e.status), v(Date.now());
				return
			}
			m({
				modelOutputType: "image",
				modelOutput: URL.createObjectURL(e)
			}), u.f.trackGenerateComplete({
				modelName: w ?? "unknown",
				tokenAmount: t.cost
			}), h(), g(!1)
		}, d[6] = h, d[7] = w, d[8] = g, d[9] = v, d[10] = f, d[11] = y, d[12] = m, d[13] = r) : r = d[13], d[14] !== g ? (n = e => {
			console.log("Generation error:", e), o.c.error(T(e)), g(!1)
		}, d[14] = g, d[15] = n) : n = d[15], d[16] !== e || d[17] !== t || d[18] !== r || d[19] !== n ? (c = {
			mutationFn: e,
			onMutate: t,
			onSuccess: r,
			onError: n
		}, d[16] = e, d[17] = t, d[18] = r, d[19] = n, d[20] = c) : c = d[20], (0, a.f)(c)
	}], 981949);
	var L = e.i(968001);
	async function j(e, t) {
		let i = await fetch(e, {
			signal: t
		});
		if (!i.ok) throw Error(`Failed to fetch ${e}: ${i.status}`);
		let r = await i.blob();
		return new File([r], e.split("/").pop() || "file", {
			type: r.type
		})
	}
	e.s(["f", 0, j], 527153);
	let F = "https://dvxladfkw2vncz5p.public.blob.vercel-storage.com/preset-thumbnails/thumbnail-base.webp",
		$ = "preset-thumbnails",
		O = "lucy-image-2|batch",
		K = "480p";
	async function q(e) {
		let {
			signal: t
		} = e, [i, r] = await Promise.all([j(F, t), e.referenceImageUrl ? j(e.referenceImageUrl, t) : void 0]), n = await M(O, {
			prompt: e.prompt,
			resolution: K,
			data: i,
			reference_image: r
		}, t);
		if (!(n instanceof Blob)) throw Error(`${O} queued a job instead of returning an image`);
		let a = new File([n], "thumbnail.png", {
			type: "image/png"
		});
		return (0, L.f)(a, $)
	}
	e.s(["F", 0, F, "r", 0, $, "J", 0, O, "_", 0, K, "H", 0, function() {
		let e = (0, c.U)(O);
		return (e && (0, c.P)(e, K)) ?? 1
	}], 890850), e.s(["f", 0, q], 551897)
}, 184644, e => {
	"use strict";
	var t = e.i(205647);
	async function i(e, i) {
		let r = await fetch(e, {
			...i,
			...i?.body ? {
				headers: {
					"Content-Type": "application/json",
					...i?.headers
				}
			} : {}
		});
		return await (0, t.W)(r, `Request failed (${r.status})`), r.json()
	}
	e.s(["y", 0, function(e, t, r) {
		return i(`/api/presets/${e}/versions/${t}/thumbnail`, {
			method: "POST",
			body: JSON.stringify(r)
		})
	}, "B", 0, function(e) {
		return i("/api/preset-folders", {
			method: "POST",
			body: JSON.stringify(e)
		})
	}, "J", 0, function(e) {
		return i("/api/presets", {
			method: "POST",
			body: JSON.stringify(e)
		})
	}, "G", 0, function(e, t) {
		return i(`/api/presets/${e}/versions`, {
			method: "POST",
			body: JSON.stringify(t)
		})
	}, "O", 0, function(e) {
		return i(`/api/preset-folders/${e}`, {
			method: "DELETE"
		})
	}, "L", 0, function(e) {
		return i(`/api/presets/${e}`, {
			method: "DELETE"
		})
	}, "C", 0, function(e, t) {
		return i(`/api/presets/${e}/versions/${t}`, {
			method: "DELETE"
		})
	}, "n", 0, function(e) {
		return i(`/api/presets/${e}`)
	}, "Q", 0, function() {
		return i("/api/preset-folders")
	}, "X", 0, function() {
		return i("/api/presets")
	}, "M", 0, function(e, t) {
		return i(`/api/presets/${e}/versions/${t}/publish`, {
			method: "POST"
		})
	}, "E", 0, function(e, t) {
		return i(`/api/preset-folders/${e}`, {
			method: "PATCH",
			body: JSON.stringify(t)
		})
	}, "z", 0, function(e, t) {
		return i(`/api/presets/${e}`, {
			method: "PATCH",
			body: JSON.stringify(t)
		})
	}])
}, 410740, 316141, e => {
	"use strict";
	var t = e.i(582018),
		i = e.i(351570),
		r = e.i(584381),
		n = e.i(619525),
		a = e.i(322932),
		o = e.i(968001),
		s = e.i(663303),
		l = e.i(184644),
		c = e.i(102189),
		u = e.i(868496),
		d = e.i(551897);
	let h = (0, u.$)(e => ({
		pending: {},
		landed: {},
		recordLanded: (t, i, r) => e(e => ({
			landed: {
				...e.landed,
				[t]: {
					...e.landed[t],
					[i]: r
				}
			}
		})),
		start: t => e(e => ({
			pending: {
				...e.pending,
				[t]: (e.pending[t] ?? 0) + 1
			}
		})),
		finish: t => e(e => {
			let i = (e.pending[t] ?? 0) - 1,
				r = {
					...e.pending
				};
			return i > 0 ? r[t] = i : delete r[t], {
				pending: r
			}
		})
	}));

	function p(e) {
		e.preventDefault(), e.returnValue = ""
	}

	function m({
		presetId: e,
		presetName: t,
		versionId: i,
		prompt: r,
		referenceImageUrl: n,
		previousUrl: o,
		queryClient: s
	}) {
		let {
			start: u,
			finish: p
		} = h.getState();
		u(e), (async () => {
			try {
				let p = await (0, d.f)({
					prompt: r,
					referenceImageUrl: n,
					signal: AbortSignal.timeout(12e4)
				}).catch(e => (console.error("Thumbnail generation failed:", e), a.c.warning(o ? `Preview generation failed for "${t}" — kept the previous preview.` : `Preview generation failed — "${t}" was saved without a preview.`), null));
				if (!p) return;
				let {
					version: m,
					copiedThrough: g
				} = await l.y(e, i, {
					generatedThumbnailUrl: p,
					expectedPreviousUrl: o
				});
				if (m.generatedThumbnailUrl && h.getState().recordLanded(e, i, m.generatedThumbnailUrl), g && m.generatedThumbnailUrl) {
					var u;
					u = m.generatedThumbnailUrl, s.setQueriesData({
						queryKey: c.e
					}, t => t && {
						...t,
						presets: t.presets.map(t => t.id === e ? {
							...t,
							generatedThumbnailUrl: u
						} : t)
					}), s.setQueryData((0, c.O)(e), e => e && {
						...e,
						preset: {
							...e.preset,
							generatedThumbnailUrl: u
						}
					}), s.invalidateQueries({
						queryKey: ["presets"]
					})
				} else a.c.info(`"${t}" moved on before its preview finished — it's saved in version history.`), s.invalidateQueries({
					queryKey: (0, c.O)(e)
				})
			} catch (i) {
				console.error("Attaching the generated preview failed:", i);
				let e = i instanceof Error && /not found|forbidden/i.test(i.message);
				a.c.warning(e ? `The new preview for "${t}" couldn't be saved — you no longer have access to it.` : `Couldn't attach the new preview to "${t}" — save again to retry.`)
			} finally {
				p(e)
			}
		})()
	}
	h.subscribe((e, t) => {
		let i = Object.keys(e.pending).length > 0;
		i !== Object.keys(t.pending).length > 0 && (i ? window.addEventListener("beforeunload", p) : window.removeEventListener("beforeunload", p))
	}), e.s(["i", 0, m, "O", 0, function(e) {
		let i, r = (0, t.c)(2);
		return r[0] !== e ? (i = t => (t.pending[e] ?? 0) > 0, r[0] = e, r[1] = i) : i = r[1], h(i)
	}, "N", 0, function(e, i) {
		let r, n = (0, t.c)(3);
		return n[0] !== e || n[1] !== i ? (r = t => i ? t.landed[e]?.[i] ?? null : null, n[0] = e, n[1] = i, n[2] = r) : r = n[2], h(r)
	}], 316141);
	let g = "preset-images";

	function f() {
		return l.X()
	}

	function y(e, t) {
		return !t.message.includes("not found") && e < 2
	}

	function b(e) {
		a.c.error(e.message || "Failed to create preset")
	}
	async function v(e) {
		let t = e.imageFile ? await (0, o.f)(e.imageFile, g) : e.existingImageUrl ?? void 0,
			{
				preset: i
			} = await l.J({
				name: e.name,
				visibility: e.visibility,
				prompt: e.prompt,
				imageUrl: t,
				generatedThumbnailUrl: e.existingGeneratedThumbnailUrl ?? void 0,
				note: e.note,
				modelFamily: e.modelFamily ?? null,
				enhance: e.enhance ?? !0,
				folderId: e.folderId ?? null
			});
		return i
	}

	function w(e) {
		let [, t] = e;
		return void 0 !== t
	}

	function k(e) {
		a.c.error(e.message || "Failed to delete preset")
	}

	function S(e) {
		return l.L(e)
	}

	function T(e) {
		a.c.error(e.message || "Failed to save version")
	}

	function R() {
		a.c.success("That version is now current")
	}

	function P() {
		a.c.success("Version deleted")
	}
	e.s(["b", 0, g, "d", 0, function() {
		let e, r = (0, t.c)(2),
			o = (0, n.d)();
		return r[0] !== o ? (e = {
			mutationFn: v,
			onSuccess: (e, t) => {
				var i, r;
				let n = (i = t.generateThumbnail, r = t.prompt, !!(i && r));
				a.c.success(n ? "Preset created — generating preview…" : "Preset created"), o.invalidateQueries({
					queryKey: ["presets"]
				}), n && e.publishedVersionId && e.prompt && m({
					presetId: e.id,
					presetName: e.name,
					versionId: e.publishedVersionId,
					prompt: e.prompt,
					referenceImageUrl: e.imageUrl,
					previousUrl: e.generatedThumbnailUrl,
					queryClient: o
				})
			},
			onError: b
		}, r[0] = o, r[1] = e) : e = r[1], (0, i.f)(e)
	}, "Q", 0, function(e, r) {
		let s, c, u, d = (0, t.c)(9),
			h = (0, n.d)();
		return d[0] !== e ? (s = async t => {
			let i = t.imageFile ? await (0, o.f)(t.imageFile, g) : t.existingImageUrl ?? void 0,
				{
					version: r
				} = await l.G(e, {
					prompt: t.prompt,
					imageUrl: i,
					generatedThumbnailUrl: t.existingGeneratedThumbnailUrl ?? void 0,
					note: t.note,
					modelFamily: t.modelFamily ?? null,
					enhance: t.enhance ?? !0,
					parentVersionId: t.parentVersionId,
					publish: t.publish ?? !1
				});
			return r
		}, d[0] = e, d[1] = s) : s = d[1], d[2] !== e || d[3] !== r || d[4] !== h ? (c = (t, i) => {
			var n, o;
			let s = (n = i.regenerateThumbnail, o = i.prompt, !!(n && o)),
				l = i.publish ? "New version saved and set as current" : "Version saved";
			a.c.success(s ? `${l} — generating preview…` : l), h.invalidateQueries({
				queryKey: ["presets"]
			}), s && t.prompt && m({
				presetId: e,
				presetName: r,
				versionId: t.id,
				prompt: t.prompt,
				referenceImageUrl: t.imageUrl,
				previousUrl: t.generatedThumbnailUrl,
				queryClient: h
			})
		}, d[2] = e, d[3] = r, d[4] = h, d[5] = c) : c = d[5], d[6] !== s || d[7] !== c ? (u = {
			mutationFn: s,
			onSuccess: c,
			onError: T
		}, d[6] = s, d[7] = c, d[8] = u) : u = d[8], (0, i.f)(u)
	}, "U", 0, function() {
		let e, r = (0, t.c)(2),
			o = (0, n.d)();
		return r[0] !== o ? (e = {
			mutationFn: S,
			onSuccess: () => {
				a.c.success("Preset deleted"), o.invalidateQueries({
					queryKey: ["presets"]
				})
			},
			onError: k
		}, r[0] = o, r[1] = e) : e = r[1], (0, i.f)(e)
	}, "W", 0, function(e) {
		let r, o, s, u, d, h, p = (0, t.c)(17),
			m = (0, n.d)();
		p[0] !== e ? (r = (0, c.O)(e), p[0] = e, p[1] = r) : r = p[1];
		let g = r;
		return p[2] !== e ? (o = t => l.C(e, t), p[2] = e, p[3] = o) : o = p[3], p[4] !== g || p[5] !== m ? (s = async e => {
			await m.cancelQueries({
				queryKey: g
			});
			let t = m.getQueryData(g);
			return t && m.setQueryData(g, {
				...t,
				preset: {
					...t.preset,
					publishedVersionId: t.preset.publishedVersionId === e ? null : t.preset.publishedVersionId
				},
				versions: t.versions.filter(t => t.id !== e)
			}), {
				previous: t
			}
		}, p[4] = g, p[5] = m, p[6] = s) : s = p[6], p[7] !== g || p[8] !== m ? (u = (e, t, i) => {
			i?.previous && m.setQueryData(g, i.previous), a.c.error(e.message || "Failed to delete version")
		}, p[7] = g, p[8] = m, p[9] = u) : u = p[9], p[10] !== m ? (d = () => {
			m.invalidateQueries({
				queryKey: ["presets"]
			})
		}, p[10] = m, p[11] = d) : d = p[11], p[12] !== o || p[13] !== s || p[14] !== u || p[15] !== d ? (h = {
			mutationFn: o,
			onMutate: s,
			onSuccess: P,
			onError: u,
			onSettled: d
		}, p[12] = o, p[13] = s, p[14] = u, p[15] = d, p[16] = h) : h = p[16], (0, i.f)(h)
	}, "c", 0, function(e) {
		let i, n, a, o = (0, t.c)(8);
		o[0] !== e ? (i = (0, c.O)(e), o[0] = e, o[1] = i) : i = o[1], o[2] !== e ? (n = () => l.n(e), o[2] = e, o[3] = n) : n = o[3];
		let s = !!e;
		return o[4] !== i || o[5] !== n || o[6] !== s ? (a = {
			queryKey: i,
			queryFn: n,
			enabled: s,
			retry: y
		}, o[4] = i, o[5] = n, o[6] = s, o[7] = a) : a = o[7], (0, r.f)(a)
	}, "a", 0, function() {
		let e, i, n = (0, t.c)(5),
			{
				data: a
			} = s.i.useSession(),
			o = a?.session?.activeOrganizationId ?? "personal";
		n[0] !== o ? (e = [...c.e, o], n[0] = o, n[1] = e) : e = n[1];
		let l = !!a?.user && !a?.user.isAnonymous;
		return n[2] !== e || n[3] !== l ? (i = {
			queryKey: e,
			queryFn: f,
			enabled: l
		}, n[2] = e, n[3] = l, n[4] = i) : i = n[4], (0, r.f)(i)
	}, "M", 0, function(e) {
		let r, o, s, u, d, h, p = (0, t.c)(17),
			m = (0, n.d)();
		p[0] !== e ? (r = (0, c.O)(e), p[0] = e, p[1] = r) : r = p[1];
		let g = r;
		return p[2] !== e ? (o = t => l.M(e, t), p[2] = e, p[3] = o) : o = p[3], p[4] !== g || p[5] !== m ? (s = async e => {
			await m.cancelQueries({
				queryKey: g
			});
			let t = m.getQueryData(g);
			if (t) {
				let i = t.versions.find(t => t.id === e);
				m.setQueryData(g, {
					...t,
					preset: {
						...t.preset,
						publishedVersionId: e,
						...i && {
							prompt: i.prompt,
							imageUrl: i.imageUrl,
							generatedThumbnailUrl: i.generatedThumbnailUrl,
							modelFamily: i.modelFamily,
							enhance: i.enhance
						}
					}
				})
			}
			return {
				previous: t
			}
		}, p[4] = g, p[5] = m, p[6] = s) : s = p[6], p[7] !== g || p[8] !== m ? (u = (e, t, i) => {
			i?.previous && m.setQueryData(g, i.previous), a.c.error(e.message || "Failed to switch to that version")
		}, p[7] = g, p[8] = m, p[9] = u) : u = p[9], p[10] !== m ? (d = () => {
			m.invalidateQueries({
				queryKey: ["presets"]
			})
		}, p[10] = m, p[11] = d) : d = p[11], p[12] !== o || p[13] !== s || p[14] !== u || p[15] !== d ? (h = {
			mutationFn: o,
			onMutate: s,
			onSuccess: R,
			onError: u,
			onSettled: d
		}, p[12] = o, p[13] = s, p[14] = u, p[15] = d, p[16] = h) : h = p[16], (0, i.f)(h)
	}, "p", 0, function(e) {
		let r, o, s, u, d, h, p = (0, t.c)(18),
			m = (0, n.d)();
		p[0] !== e ? (r = (0, c.O)(e), p[0] = e, p[1] = r) : r = p[1];
		let g = r;
		return p[2] !== e ? (o = t => l.z(e, t), p[2] = e, p[3] = o) : o = p[3], p[4] !== g || p[5] !== e || p[6] !== m ? (s = async t => {
			await m.cancelQueries({
				queryKey: g
			}), await m.cancelQueries({
				queryKey: c.e
			});
			let i = Object.fromEntries(Object.entries(t).filter(w)),
				r = m.getQueryData(g);
			r && m.setQueryData(g, {
				...r,
				preset: {
					...r.preset,
					...i
				}
			});
			let n = m.getQueriesData({
				queryKey: c.e
			});
			return m.setQueriesData({
				queryKey: c.e
			}, t => t && {
				...t,
				presets: t.presets.map(t => t.id === e ? {
					...t,
					...i
				} : t)
			}), {
				previous: r,
				previousLists: n
			}
		}, p[4] = g, p[5] = e, p[6] = m, p[7] = s) : s = p[7], p[8] !== g || p[9] !== m ? (u = (e, t, i) => {
			for (let [e, t] of(i?.previous && m.setQueryData(g, i.previous), i?.previousLists ?? [])) m.setQueryData(e, t);
			a.c.error(e.message || "Failed to update preset")
		}, p[8] = g, p[9] = m, p[10] = u) : u = p[10], p[11] !== m ? (d = () => {
			m.invalidateQueries({
				queryKey: ["presets"]
			})
		}, p[11] = m, p[12] = d) : d = p[12], p[13] !== o || p[14] !== s || p[15] !== u || p[16] !== d ? (h = {
			mutationFn: o,
			onMutate: s,
			onError: u,
			onSettled: d
		}, p[13] = o, p[14] = s, p[15] = u, p[16] = d, p[17] = h) : h = p[17], (0, i.f)(h)
	}], 410740)
}, 221751, e => {
	"use strict";
	let t = "/api/preset-media/";

	function i(e) {
		return e.startsWith(t)
	}
	e.s(["g", 0, t, "D", 0, i, "A", 0, function(e) {
		return i(e) || /^https:\/\/[^/]+\.blob\.vercel-storage\.com\//.test(e)
	}])
}, 333869, e => {
	"use strict";
	let t;
	var i, r = e.i(885697),
		n = e.i(248697),
		a = e.i(791844);
	e.i(959114);
	let o = e => e.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

	function s(e, t) {
		return e.map(e => ({
			id: `${t}-${o(e.label)}`,
			name: e.label,
			description: e.shortPrompt,
			prompt: e.prompt,
			imageUrl: e.image ?? null,
			thumbnailUrl: e.icon ?? null,
			generatedThumbnailUrl: null,
			modelFamily: t,
			enhance: !0,
			source: "builtin",
			folderId: null
		}))
	}
	let l = (i = [...s(n.u, "lucy"), ...s(n.v, "lucy"), ...s(a.f, "lucy-vton"), ...s(r.f, "lucy-restyle")], t = new Set, i.filter(e => !t.has(e.id) && (t.add(e.id), !0)));
	e.s(["V", 0, l, "A", 0, o])
}, 102189, e => {
	"use strict";
	e.s(["e", 0, ["presets", "list"], "O", 0, e => ["presets", "detail", e]])
}, 959114, e => {
	"use strict";
	var t = e.i(426682),
		i = e.i(538882),
		r = e.i(690999),
		n = e.i(871101),
		a = e.i(930971),
		o = e.i(221751);
	let s = t.z.enum(["private", "org"]),
		l = t.z.enum(["lucy", "lucy-vton", "lucy-restyle"]),
		c = e => "string" == typeof e && "" === e.trim() ? void 0 : e,
		u = i.z.string().refine(e => e.startsWith(o.g) || /^https:\/\//i.test(e) && URL.canParse(e), {
			message: "Must be an uploaded image"
		}),
		d = r.z.preprocess(c, u.optional()),
		h = r.z.preprocess(c, i.z.string().max(5e3).optional()),
		p = r.z.preprocess(c, i.z.string().max(1e3).optional()),
		m = r.z.preprocess(c, l.nullish()),
		g = i.z.string().min(1).nullish(),
		f = e => void 0 !== e.prompt || void 0 !== e.imageUrl,
		y = "A preset needs a prompt or an image";
	n.z.object({
		name: i.z.string().trim().min(1, "Name is required").max(200),
		prompt: h,
		imageUrl: d,
		generatedThumbnailUrl: d,
		note: p,
		visibility: s.default("private"),
		modelFamily: m,
		enhance: a.z.boolean().default(!0),
		folderId: g
	}).refine(f, {
		message: y
	}), n.z.object({
		name: i.z.string().trim().min(1, "Name is required").max(200).optional(),
		visibility: s.optional(),
		folderId: g
	}).refine(e => void 0 !== e.name || void 0 !== e.visibility || void 0 !== e.folderId, {
		message: "Nothing to update"
	}), n.z.object({
		prompt: h,
		imageUrl: d,
		generatedThumbnailUrl: d,
		note: p,
		modelFamily: m,
		enhance: a.z.boolean().default(!0),
		parentVersionId: r.z.preprocess(c, i.z.string().optional()),
		publish: a.z.boolean().default(!1)
	}).refine(f, {
		message: y
	}), n.z.object({
		generatedThumbnailUrl: u,
		expectedPreviousUrl: u.nullish()
	});
	let b = n.z.object({
		name: i.z.string().trim().min(1, "Name is required").max(200),
		prompt: i.z.string().max(5e3).optional(),
		visibility: s,
		modelFamily: t.z.enum(["general", ...l.options]),
		enhance: a.z.boolean()
	});
	e.s(["f", 0, b])
}, 968001, e => {
	"use strict";
	var t = e.i(937129),
		i = e.i(221751),
		r = e.i(663303);
	let n = async (e, n) => {
		let {
			data: a
		} = await r.i.getSession();
		if (!a?.user) throw Error("Sign in to upload images");
		let o = Date.now(),
			s = e.name.split(".").pop(),
			l = `${n}/${a.user.id}/${o}.${s}`,
			c = await (0, t.f)(l, e, {
				access: "private",
				handleUploadUrl: "/api/blob/upload"
			});
		return `${i.g}${c.pathname}`
	};
	e.s(["f", 0, n])
}, 885697, 248697, 791844, e => {
	"use strict";
	e.s(["f", 0, [{
		label: "Pirates",
		shortPrompt: "Change the scene to Pirates style",
		prompt: "Transform the image into Pirates of the Caribbean swashbuckling fantasy style while maintaining the same composition. Use weathered nautical browns and blues, supernatural green ghost effects and tropical Caribbean colors with golden treasure accents. Add water-damaged wooden ship textures, weathered pirate clothing with character-specific details and supernatural decay with ghostly material properties. Apply dramatic lantern and moonlight with supernatural transformation effects, reimagining the elements with historical pirate meets cursed treasure qualities while keeping the same overall arrangement."
	}, {
		label: "Bee Hive",
		shortPrompt: "Bee hive style",
		prompt: "Transform the image into a bee hive style with whimsical synthetic-2D animation while maintaining the original composition. Apply a color palette of warm yellows and rich browns reflecting organic honey and wax materials. Create soft, rounded shapes and playful designs with vibrant, saturated colors evoking a lively, bustling atmosphere. Use bright, cheerful lighting simulating sunlight filtering through the hive for a sense of warmth and activity while keeping all elements in their current positions."
	}, {
		label: "Van Gogh",
		shortPrompt: "Van Gogh painting style",
		prompt: "Transform the image into Van Gogh painting style while maintaining the same composition. Use vibrant, emotionally expressive yellows, blues and greens with complementary color contrasts and pure unmixed pigments. Create swirling, directional brushwork with thick impasto application that suggests physical dimension. Make lighting appear to radiate from within objects with halos and auras around light sources, reimagining the elements with passionate Post-Impressionist qualities while keeping the same overall arrangement."
	}, {
		label: "Yellow Cartoon",
		shortPrompt: "Yellow Cartoon style",
		prompt: "Transform the image into The Simpsons animation style while maintaining the same composition. Use the iconic yellow skin tone with bright primary colors and suburban American color schemes in bold saturation. Apply flat cartoon rendering with bold outlines and simple shading techniques. Create bright television lighting with minimal shadows, keeping all elements in their original positions."
	}, {
		label: "Cyborgs",
		shortPrompt: "Cyborgs tech-noir style",
		prompt: "Transform the image into Terminator tech-noir style while maintaining the same composition. Use cold blue lighting for future scenes, warm human tones contrasted with metallic silver machine elements and electrical energy effects with blue-white intensity. Add hyperdetailed robotic components with exposed mechanical workings, battle-damaged cyborg elements revealing metal under flesh and post-apocalyptic environmental features. Apply harsh mechanical lighting emphasizing robotic elements with glowing red accents, reimagining the elements with technological horror qualities while keeping the same overall arrangement."
	}, {
		label: "Manga",
		shortPrompt: "Black and white manga style",
		prompt: "Transform the image into black and white manga illustration style while maintaining the same composition. Use pure blacks, clean whites and varied gray tones achieved through screen tones and hatching techniques. Apply crisp ink lines with varying weights, detailed texture work through stippling and cross-hatching. Create high contrast lighting with dramatic shadows and bright highlights, keeping all elements in their original positions."
	}, {
		label: "Animation",
		shortPrompt: "3D animation style",
		prompt: "Transform the image into Pixar 3D animation style while maintaining the same composition. Use carefully crafted color theory with warm family-friendly tones and cinematic color grading. Apply realistic 3D textures, advanced material shaders and subtle subsurface scattering effects. Create cinematic 3D lighting with realistic light behavior and atmospheric effects, keeping all elements in their original positions."
	}, {
		label: "Golden Hour",
		shortPrompt: "Golden hour sunset lighting",
		prompt: "Transform the image into golden hour style while maintaining the original composition. Apply warm tones with soft lighting that creates long shadows. Enhance the image with warm golden and orange hues throughout. Create a serene, tranquil atmosphere typical of sunset lighting while keeping all elements in their current positions."
	}, {
		label: "Ghibli Inspired",
		shortPrompt: "Studio Ghibli watercolor style",
		prompt: "Transform the image into Studio Ghibli style with hand-painted watercolor-like visuals while maintaining the same composition. Apply fine lines with soft shading and warm pastel colors in greens, blues and oranges with low saturation. Add delicate watercolor textures, gentle brushstrokes and subtle paper grain. Use soft diffused natural lighting reminiscent of light filtering through shoji screens, keeping all elements in their original positions."
	}, {
		label: "War Zone",
		shortPrompt: "Post-apocalyptic style",
		prompt: "Transform the image into Mad Max post-apocalyptic style while maintaining the same composition. Use harsh desert oranges and yellows, desaturated dusty neutrals and night scenes illuminated by fire with high contrast. Add rust-covered vehicular modifications with practical mechanical detail, makeshift clothing and armor from salvaged materials and barren wasteland environmental elements. Apply harsh desert lighting with silhouettes against vast wasteland horizons, reimagining the elements with brutal survival qualities while keeping the same overall arrangement."
	}, {
		label: "Zombies",
		shortPrompt: "Horror video game zombie style",
		prompt: "Transform the image into a synthetic-3D horror video game style featuring stylized zombies while maintaining the original composition. Apply exaggerated features with high detail and texture that highlight decayed, undead elements. Use a color palette of muted earth tones with pops of eerie greens and purples. Add dramatic lighting with high contrast and deep shadows for a suspenseful, mysterious atmosphere while keeping all elements in their current positions."
	}, {
		label: "K-pop",
		shortPrompt: "K-pop hyper-polished aesthetic",
		prompt: "Apply K-pop style with vibrant hyper-polished aesthetic, perfectly styled performers, coordinated fashion-forward outfits, candy-colored pastels alongside bold neons, immaculate styling with glossy skin, and flawless soft-focus lighting"
	}, {
		label: "Mythic",
		shortPrompt: "Norse mythology style",
		prompt: "Transform the image into God of War game style while maintaining the same composition. Use cold Nordic blues and whites, rich wooden browns and divine gold accents with blood-red highlights. Add weathered leather and metal with intricate Norse knotwork, godly artifacts with magical properties and massive environmental scale elements. Apply dramatic cinematic lighting emphasizing character moments and epic scale, reimagining the elements with a Norse mythological action aesthetic while keeping the same overall arrangement."
	}, {
		label: "Wild West",
		shortPrompt: "Wild West style",
		prompt: "Transform the image into Red Dead Redemption Western game style while maintaining the same composition. Use warm dusty earth tones with golden hour lighting, weathered browns and tans for frontier elements and natural greens for wilderness areas. Add weathered leather and denim with appropriate aging, wooden structures with detailed grain and wear patterns and natural environments with ecological detail. Apply dramatic lighting with stunning sunsets and atmospheric weather effects, reimagining the elements with an American frontier aesthetic while keeping the same overall arrangement."
	}, {
		label: "Sci-fi Anime",
		shortPrompt: "Sci-fi animation style",
		prompt: "Transform the image into Rick and Morty animation style while maintaining the same composition. Combine sci-fi colors with earth tones featuring portal greens, space blues and alien color schemes in vivid saturation. Add sci-fi technology textures, interdimensional effect work and adult animation detail levels. Apply dynamic sci-fi lighting with portal effects and alien illumination, keeping all elements in their original positions."
	}, {
		label: "Classic Anime",
		shortPrompt: "Classic anime style",
		prompt: "Transform the image into Naruto anime style while maintaining the same composition. Use earth tones with ninja blues, forest greens and warm orange accents in moderate saturation. Combine traditional anime techniques with subtle texture work representing fabric and natural materials. Apply natural outdoor lighting mixed with mystical chakra effects, keeping all elements in their original positions."
	}, {
		label: "Blocky",
		shortPrompt: "Blocky style",
		prompt: "Transform the image into a Minecraft-inspired blocky 3D style with pixelated visual design while maintaining the original composition. Apply distinct cubic shapes throughout. Use a clean, consistent color palette dominated by stone grays, browns, and whites. Create smooth, pixel-consistent textures with low-resolution detail. Add bright, even lighting for an open, constructive atmosphere while keeping all elements in their current positions."
	}, {
		label: "Football",
		shortPrompt: "American football style",
		prompt: "Transform the image into American football style with powerful, armored athletic elements. Apply team-specific uniform colors with bold primary hues against green field background. Add football leather grain textures, helmet sheen details, grass-stained jersey effects, and player exertion elements. Use dramatic stadium lighting creating strong contrasts with harsh shadows. Maintain the subject's position while incorporating football action characteristics. Create an intense, gritty atmosphere filled with tension and explosive athleticism."
	}, {
		label: "Picasso",
		shortPrompt: "Picasso Cubist style",
		prompt: "Transform the image into Picasso Cubist style while maintaining the same composition. Use flat, bold hues of blues, reds and earth tones applied in geometric patches with strong black outlines. Create flattened surfaces with angular planes that break traditional perspective rules, revealing multiple viewpoints simultaneously. Apply non-naturalistic, symbolic lighting rather than representational, reimagining the elements with fragmented, multi-perspective Cubist qualities while keeping the same overall arrangement."
	}, {
		label: "Super Hero",
		shortPrompt: "Superhero style",
		prompt: "Transform the image into Marvel Cinematic Universe superhero style while maintaining the same composition. Use character-specific signature colors, location-specific color grading and vibrant energy effect colors with high saturation. Add practical superhero costumes with functional detailing, urban environments with appropriate destruction physics and magical/technological effects with distinctive visual signatures. Apply dynamic action lighting emphasizing heroic moments with dramatic highlights, reimagining the elements with colorful optimistic superhero qualities while keeping the same overall arrangement."
	}, {
		label: "Neon Nostalgia",
		shortPrompt: "Cyberpunk neon anime style",
		prompt: "Transform the image into a cyberpunk anime style with neon colors and vibrant contrasts while maintaining the original composition. Apply a color palette of electric blues, pinks, and purples against a dark, rainy backdrop. Make surfaces appear reflective and wet with shimmering reflections. Create an intense, moody atmosphere with dynamic lighting to evoke an urban, futuristic aesthetic while keeping all elements in their current positions."
	}]], 885697), e.s(["u", 0, [{
		label: "Animated",
		shortPrompt: "Restyle to animated",
		prompt: "Restyle to animated movie",
		icon: "../../../../presets/animated.jpg"
	}, {
		label: "Hair on Fire",
		shortPrompt: "Add fire on the person's hair",
		prompt: "Add fire on the person's hair",
		icon: "../../../../presets/fire.png"
	}, {
		label: "Green Slime",
		shortPrompt: "Add bright green slime down my head",
		prompt: "Add bright green slime down my head",
		icon: "../../../../presets/slime.jpg"
	}, {
		label: "Shoulder Parrot",
		shortPrompt: "Add a colorful parrot on the person's shoulder",
		prompt: "Add a colorful parrot on the person's shoulder",
		icon: "../../../../presets/shoulder-parrot.jpg"
	}, {
		label: "René Decart",
		shortPrompt: "Turn into René Decart",
		prompt: "Replace the person with René Decart, mature man with dark curled hair, trimmed beard and mustache, wearing a black 17th-century doublet and white collar, subtle facial lines, natural skin texture, contemplative expression, softly lit portrait ambiance.",
		image: "../../../../presets/rene-descartes.webp"
	}, {
		label: "Claymation",
		shortPrompt: "Restyle to Claymation",
		prompt: "Restyle to Claymation",
		icon: "../../../../presets/claymation.jpg"
	}, {
		label: "Capybara",
		shortPrompt: "Turn into a Capybara",
		prompt: "Substitute the people with a capybara, which has smooth light-brown fur, a rounded relaxed body, small dark eyes, a blunt snout, and short rounded ears.",
		image: "../../../../presets/capybara.webp"
	}, {
		label: "Alien",
		shortPrompt: "Replace all the people with an alien caracter",
		prompt: "Replace all the people with an alien character",
		image: "../../../../presets/alien.webp"
	}, {
		label: "Tuxedo",
		shortPrompt: "Change the person's clothes to the tuxedo from the reference",
		prompt: "Change the person's clothes to the tuxedo from the reference",
		image: "../../../../presets/tuxedo.webp"
	}, {
		label: "Coat",
		shortPrompt: "Add the coat from the reference to the person",
		prompt: "Add the coat from the reference to the person",
		image: "../../../../presets/coat.webp"
	}, {
		label: "Blonde Bob",
		shortPrompt: "Blonde bob hairstyle",
		prompt: "Change the person's hair to blonde bob hairstyle",
		icon: "../../../../presets/blonde-bob.jpg"
	}], "v", 0, [{
		label: "Albert Stylestein",
		shortPrompt: "Turn the person into Albert Einstein",
		prompt: "Substitute the person with an elderly man, which has wild white hair, a prominent mustache, wrinkles, and is wearing a tweed jacket, a vest, a white shirt, and a patterned bow tie.",
		image: "../../../../presets/albert-stylestein.jpeg"
	}, {
		label: "Capybara",
		shortPrompt: "Turn the person into a Capybara",
		prompt: "Substitute the people with a capybara, which has smooth light-brown fur, a rounded relaxed body, small dark eyes, a blunt snout, and short rounded ears.",
		image: "../../../../presets/capybara.webp"
	}, {
		label: "Statue of Liberty",
		shortPrompt: "Turn the person into the Statue of Liberty",
		prompt: "Transform the person into the Statue of Liberty, complete with oxidized copper green patina, flowing robe with sculpted drapery, classic spiked crown, raised torch in hand, weathered metallic texture, soft daylight, full-body view, monumental presence"
	}, {
		label: "Politician 1",
		shortPrompt: "Turn the person into a president",
		prompt: "Replace the person with Donald Trump, mature male, distinct blond hair, formal navy suit, red tie, expressive facial features, realistic skin tone textures, confident posture, crisp clothing folds, detailed lighting, natural shadowing"
	}, {
		label: "Politician 2",
		shortPrompt: "Turn the person into a former president",
		prompt: "Substitute the person with Joe Biden, which has short gray hair, blue eyes, and is wearing a navy blue suit, a light blue collared shirt, and a striped tie with yellow and blue"
	}, {
		label: "Anime Businessman",
		shortPrompt: "Turn the person into an Anime Businessman",
		prompt: "Substitute the person with an anime style businesswoman, which features long, flowing pink hair, a white collared shirt, a red tie, a dark fitted suit jacket, a short dark skirt, and sheer dark hosiery.",
		image: "../../../../presets/anime-businessman.png"
	}, {
		label: "Your Grandma",
		shortPrompt: "Turn the person into Your Grandma",
		prompt: "Substitute the person with a grandma, which has soft gray hair tied in a loose bun, gentle wrinkles, warm eyes, and is wearing a cozy cardigan over a simple blouse.",
		image: "../../../../presets/grandma.png"
	}, {
		label: "Tuxedo",
		shortPrompt: "Dress the person in a Tuxedo",
		prompt: "Change the outfit to a classic black tuxedo with a satin lapel, crisp white dress shirt, black bow tie, tailored fit, subtle pocket square, soft fabric textures, formal trousers, polished shoes, even lighting, elegant ambiance"
	}, {
		label: "Wedding Dress",
		shortPrompt: "Dress the person in a Wedding Dress",
		prompt: "Change the outfit to a white wedding dress with lace sleeves, flowing satin skirt, delicate embroidery, gentle sheen, fitted bodice, long train, soft natural lighting, floral accents, subtle sparkle, classic bridal silhouette, full-length view"
	}, {
		label: "Felix the Cat",
		shortPrompt: "Turn the person into Felix the Cat",
		prompt: "Substitute the people with a black cat character, which has large white eyes, a wide grin, a yellow bow tie, and a crossbody satchel",
		image: "../../../../presets/felix-the-cat.png"
	}, {
		label: "Chicken",
		shortPrompt: "Turn the person into a Chicken",
		prompt: "Replace the person with a plump chicken, smooth white feathers, bright red comb and wattles, prominent beak, sturdy yellow legs, subtle feather texture, natural posture, daylight illumination, centered in the frame"
	}, {
		label: "René Decart",
		shortPrompt: "Turn the person into René Decart",
		prompt: "Replace the person with René Decart, mature man with dark curled hair, trimmed beard and mustache, wearing a black 17th-century doublet and white collar, subtle facial lines, natural skin texture, contemplative expression, softly lit portrait ambiance.",
		image: "../../../../presets/rene-descartes.webp"
	}, {
		label: "Grass Head",
		shortPrompt: "Give the person a Grass Head",
		prompt: "Substitute the person with a figure that has a glass terrarium head, which contains soil, rocks, moss, and small plants, wearing a futuristic black jacket with neon-pink piping and glossy textured panels.",
		image: "../../../../presets/grass-head.png"
	}, {
		label: "Chad Fox",
		shortPrompt: "Turn the person into Chad Fox",
		prompt: "Substitute the person with a muscular fox, which has orange fur, green eyes, and is wearing a tight black v-neck t-shirt",
		image: "../../../../presets/chad-fox.png"
	}, {
		label: "Unfortunate Model",
		shortPrompt: "Turn the person into the Unfortunate Model",
		prompt: "Substitute the person with an awkward teenage boy, which has short light-brown hair neatly combed to the side, visible braces on his teeth, pale skin, and a stiff, uneasy smile. He is wearing a red plaid sweater vest over a light blue collared shirt, giving a slightly outdated, nerdy school-portrait look.",
		image: "../../../../presets/unfortunate-model.jpg"
	}]], 248697), e.s(["f", 0, [{
		label: "Knit Sweater",
		shortPrompt: "White ribbed turtleneck",
		prompt: "Substitute the subject shirt with a chunky white ribbed turtleneck sweater with a relaxed fit and balloon sleeves.",
		image: "../../../../presets/vton/knit-sweater.webp"
	}, {
		label: "Denim Jacket",
		shortPrompt: "Classic blue denim jacket",
		prompt: "Substitute the subject shirt with a classic blue denim jacket featuring two chest pockets and a slightly distressed finish.",
		image: "../../../../presets/vton/denim-jacket.webp"
	}, {
		label: "Trench Coat",
		shortPrompt: "Beige trench coat",
		prompt: "Substitute the subject outfit with a beige trench coat with a belted waist and oversized sleeves, featuring a classic collar and functional shoulder straps.",
		image: "../../../../presets/vton/trench-coat.webp"
	}, {
		label: "Black Blazer",
		shortPrompt: "Black blazer over turtleneck",
		prompt: "Substitute the subject shirt with a fitted black turtleneck and add a tailored black blazer with a structured fit to the person's upper body.",
		image: "../../../../presets/vton/black-blazer.webp"
	}]], 791844)
}, 893603, e => {
	"use strict";
	e.s(["u", 0, ["image/jpeg", "image/png", "image/webp"], "d", 0, ["video/mp4", "video/webm", "video/quicktime"], "D", 0, 0x3200000, "m", 0, 0xc800000])
}, 633627, 624277, 987873, e => {
	"use strict";
	let t, i, r = "INVALID_API_KEY",
		n = "INVALID_INPUT",
		a = "TOKEN_INVALID",
		o = "TOKEN_EXPIRED",
		s = "UNSUPPORTED_PLATFORM_FEATURE";

	function l(e, t, i, r) {
		return {
			code: e,
			message: t,
			data: i,
			cause: r
		}
	}

	function c(e) {
		return "object" == typeof e && null !== e && "string" == typeof e.code && "string" == typeof e.message
	}
	var u = class extends Error {
		sdkError;
		constructor(e) {
			super(e.message), this.name = "DecartSDKException", this.sdkError = e, e.cause && (this.cause = e.cause)
		}
	};

	function d() {
		return l(r, "Missing API key. Pass `apiKey` or `apiKeyProvider` to createDecartClient(), or set the DECART_API_KEY environment variable.")
	}

	function h(e) {
		return l("INVALID_BASE_URL", `Invalid base URL${e?`: ${e}`:""}`)
	}

	function p(e, t) {
		return l("LIVEKIT_INITIALIZATION_ERROR", e, void 0, t)
	}

	function m(e) {
		var t, i;
		if (e instanceof u) return e.sdkError;
		let r = e.message.toLowerCase();
		if ("server" === e.source) return l("WEBRTC_SERVER_ERROR", e.message);
		if (r.includes("websocket")) return l("WEBRTC_WEBSOCKET_ERROR", "WebSocket connection failed", void 0, e);
		if (r.includes("ice connection failed")) return l("WEBRTC_ICE_ERROR", "ICE connection failed", void 0, e);
		if (r.includes("timeout") || r.includes("timed out")) {
			let n, a = r.match(/(\d+)\s*ms/);
			return t = "connection", i = a ? Number.parseInt(a[1], 10) : void 0, l("WEBRTC_TIMEOUT_ERROR", (n = "number" == typeof i && Number.isFinite(i)) ? `${t} timed out after ${i}ms` : `${t} timed out`, n ? {
				phase: t,
				timeoutMs: i
			} : {
				phase: t
			}, e)
		}
		return l("WEBRTC_SIGNALING_ERROR", "Signaling error", void 0, e)
	}

	function g(e) {
		return l("MODEL_NOT_FOUND", `Model ${e} not found`)
	}

	function f(e, t) {
		return l("QUEUE_SUBMIT_ERROR", e, {
			status: t
		})
	}
	let y = e => "string" == typeof e && e.startsWith("eyJ") && 3 === e.split(".").length,
		b = (e, t) => l(a, `Invalid client token: ${e}`, t),
		v = e => "string" == typeof e ? e : null,
		w = e => Array.isArray(e) && e.every(e => "string" == typeof e) ? e : null;

	function k(e) {
		let t;
		if ("string" != typeof e.sub || !e.sub) throw b("missing `sub` claim", {
			claim: "sub"
		});
		if ("number" != typeof e.exp) throw b("missing `exp` claim", {
			claim: "exp"
		});
		let i = ("number" == typeof(t = e.service_tier) && Number.isInteger(t) ? t : "string" == typeof t && /^\s*[+-]?\d+\s*$/.test(t) ? Number.parseInt(t, 10) : null) ?? (e.priority ? 3 : null),
			r = e.attribution;
		return {
			serviceTier: i,
			pool: 0 === i ? "free" : "paid",
			userId: e.sub,
			organizationId: v(e.organizationId),
			apiKeyName: v(e.api_key_name),
			apiKeyId: v(e.parent_api_key_id) ?? v(e.jti),
			allowedModels: w(e.models),
			allowedOrigins: w(e.origins),
			expiresAt: (new Date(1e3 * e.exp)).toISOString(),
			realtimeConcurrentSessionLimit: "number" == typeof e.realtimeConcurrentSessionLimit ? e.realtimeConcurrentSessionLimit : null,
			zeroDataRetention: !0 === e.zeroDataRetention,
			attribution: "object" != typeof r || null === r || Array.isArray(r) ? null : r,
			raw: e
		}
	}

	function S(e) {
		let t;
		if (!y(e)) throw b("not a JWT", {
			reason: "malformed"
		});
		try {
			let i = e.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"),
				r = atob(i).replace(/[\s\S]/g, e => `%${e.charCodeAt(0).toString(16).padStart(2,"0")}`);
			t = JSON.parse(decodeURIComponent(r))
		} catch {
			throw b("payload is not base64url JSON", {
				reason: "malformed"
			})
		}
		if ("object" != typeof t || null === t || Array.isArray(t)) throw b("payload is not a JSON object", {
			reason: "malformed"
		});
		return k(t)
	}
	let T = "../../../../index.html",
		R = new Map;
	async function P(i, r = {}) {
		if (!y(i)) throw l(a, "Invalid client token: not a JWT", {
			reason: "malformed"
		});
		if (!globalThis.crypto?.subtle) throw l(s, "verifyClientToken needs WebCrypto (crypto.subtle), which this runtime does not provide. Verify client tokens on your server; decodeClientToken works everywhere.", {
			feature: "verifyClientToken"
		});
		let n = r.jwksUrl ?? `${T}/api/auth/jwks`;
		t || (t = e.A(461629));
		let {
			jwtVerify: c,
			createRemoteJWKSet: u,
			errors: d
		} = await t, h = R.get(n);
		h || (h = u(new URL(n), {
			cooldownDuration: 6e4
		}), R.set(n, h));
		try {
			let {
				payload: e
			} = await c(i, h, {
				algorithms: ["EdDSA"],
				issuer: r.issuer ?? T,
				audience: r.audience ?? T,
				clockTolerance: r.clockTolerance ?? 60,
				requiredClaims: ["exp", "sub"]
			});
			return k(e)
		} catch (s) {
			let e = s instanceof Error ? s : void 0,
				{
					code: t = "unknown",
					claim: i
				} = e ?? {},
				r = {
					reason: t,
					...i ? {
						claim: i
					} : {}
				};
			if (s instanceof d.JWTExpired) throw l(o, `Client token expired: ${e?.message}`, r, e);
			if (!(!(s instanceof d.JOSEError) || /^ERR_(JOSE_GENERIC|JWKS_INVALID|JWKS_TIMEOUT)$/.test(t))) throw l(a, `Invalid client token: ${e?.message}`, r, e);
			throw l("TOKEN_VERIFY_ERROR", `Could not load the client-token JWKS from ${n}: ${e?.message??String(s)}`, {
				...r,
				jwksUrl: n
			}, e)
		}
	}
	let M = {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3
	};

	function E(e = "warn") {
		let t = M[e],
			i = (e, i, r) => {
				if (M[e] < t) return;
				let n = "[DecartSDK]";
				r ? console[e](n, i, r) : console[e](n, i)
			};
		return {
			debug: (e, t) => i("debug", e, t),
			info: (e, t) => i("info", e, t),
			warn: (e, t) => i("warn", e, t),
			error: (e, t) => i("error", e, t)
		}
	}
	var C = e.i(377698),
		C = C;

	function I(e, t) {
		let i = globalThis[t];
		return "function" == typeof i && e instanceof i
	}

	function D(e) {
		return C.custom(t => I(t, e), {
			message: `Expected ${e}`
		})
	}
	let x = "0.2.14";

	function A(e, t = globalThis) {
		return [`decart-js-sdk/${x}`, "lang/js", ...e ? [e] : [], function(e = globalThis) {
			return e.window ? "runtime/browser" : e.navigator?.userAgent ? `runtime/${e.navigator.userAgent.toLowerCase()}` : e.process?.versions?.node ? `runtime/node.js/${e.process.version.substring(0)}` : e.EdgeRuntime ? "runtime/vercel-edge" : "runtime/unknown"
		}(t)].join(" ")
	}

	function U(e) {
		return "object" == typeof e && null !== e && "string" == typeof e.uri && "string" == typeof e.type && "string" == typeof e.name
	}
	async function z(e) {
		if (U(e) || I(e, "Blob") || I(e, "File")) return e;
		if (I(e, "ReadableStream")) return new Response(e).blob();
		if ("string" == typeof e || I(e, "URL")) {
			let t = "string" == typeof e ? e : e.toString();
			if (!t.startsWith("http://") && !t.startsWith("https://")) throw l(n, "URL must start with http:// or https://");
			let i = await fetch(t);
			if (!i.ok) throw l(n, `Failed to fetch file from URL: ${i.statusText}`);
			return i.blob()
		}
		throw l(n, "Invalid file input type")
	}
	async function _(e) {
		let t = await e.text().catch(() => "");
		if (!t) return "Unknown error";
		try {
			let e = JSON.parse(t).detail;
			if ("string" == typeof e && e) return e
		} catch {}
		return t
	}

	function L(e = {}) {
		let {
			apiKey: t,
			integration: i
		} = e;
		return {
			"User-Agent": A(i),
			...t ? {
				"X-API-KEY": t
			} : {}
		}
	}

	function j(e) {
		let t = new FormData;
		for (let [i, r] of Object.entries(e)) null != r && (U(r) || I(r, "Blob") ? t.append(i, r) : "object" == typeof r && null !== r ? t.append(i, JSON.stringify(r)) : t.append(i, String(r)));
		return t
	}
	var F = C,
		$ = e.i(745831),
		O = e.i(462105);
	let K = F.union([$.z.number().int().min(60).max(2592e3), O.z.literal("persistent")]),
		q = /^[0-9a-f]{32}$/i;
	async function B({
		baseUrl: e,
		apiKey: t,
		model: i,
		inputs: r,
		signal: n,
		integration: a
	}) {
		let o = j(r),
			s = `${e}${i.urlPath}`,
			c = L({
				apiKey: t,
				integration: a
			}),
			u = await fetch(s, {
				method: "POST",
				headers: c,
				body: o,
				signal: n
			});
		if (!u.ok) {
			let e = await _(u);
			throw l("PROCESSING_ERROR", `Processing failed: ${u.status} - ${e}`)
		}
		return u.blob()
	}

	function N(e) {
		return new Promise(t => setTimeout(t, e))
	}
	async function W({
		checkStatus: e,
		getContent: t,
		onStatusChange: i,
		signal: r
	}) {
		for (await N(500);;) {
			if (r?.aborted) throw Error("Polling aborted");
			let n = await e();
			if (i && i(n), "completed" === n.status) {
				let e = await t();
				return {
					status: "completed",
					job_id: n.job_id,
					data: e
				}
			}
			if ("failed" === n.status) return {
				status: "failed",
				job_id: n.job_id,
				error: "Job failed"
			};
			await N(1500)
		}
	}
	async function G({
		baseUrl: e,
		apiKey: t,
		model: i,
		inputs: r,
		signal: n,
		integration: a
	}) {
		let o = j(r);
		if (!i.queueUrlPath) throw f(`Model ${i.name} does not support queue processing`, 400);
		let s = `${e}${i.queueUrlPath}`,
			l = L({
				apiKey: t,
				integration: a
			}),
			c = await fetch(s, {
				method: "POST",
				headers: l,
				body: o,
				signal: n
			});
		if (!c.ok) {
			let e = await _(c);
			throw f(`Failed to submit job: ${c.status} - ${e}`, c.status)
		}
		return c.json()
	}
	async function V({
		baseUrl: e,
		apiKey: t,
		jobId: i,
		signal: r,
		integration: n
	}) {
		let a = `${e}/v1/jobs/${i}`,
			o = L({
				apiKey: t,
				integration: n
			}),
			s = await fetch(a, {
				method: "GET",
				headers: o,
				signal: r
			});
		if (!s.ok) {
			var c;
			let e = await _(s);
			throw c = `Failed to get job status: ${s.status} - ${e}`, l("QUEUE_STATUS_ERROR", c, {
				status: s.status
			})
		}
		return s.json()
	}
	async function Q({
		baseUrl: e,
		apiKey: t,
		jobId: i,
		signal: r,
		integration: n
	}) {
		let a = `${e}/v1/jobs/${i}/content`,
			o = L({
				apiKey: t,
				integration: n
			}),
			s = await fetch(a, {
				method: "GET",
				headers: o,
				signal: r
			});
		if (!s.ok) {
			var c;
			let e = await _(s);
			throw c = `Failed to get job content: ${s.status} - ${e}`, l("QUEUE_RESULT_ERROR", c, {
				status: s.status
			})
		}
		return s.blob()
	}

	function J(e) {
		return Math.round((e + 61e4) / .8 / 1e3)
	}
	let H = {
		signaling: {
			connectTimeoutMs: 6e4,
			handshakeTimeoutMs: 15e3,
			requestTimeoutMs: 3e4
		},
		session: {
			connectionTimeoutMs: 3e5,
			retry: {
				retries: 5,
				factor: 2,
				minTimeout: 1e3,
				maxTimeout: 1e4
			},
			terminalEndReasons: ["moderation_violation", "insufficient_credits"],
			terminalCloseCode: 1008,
			sessionLimit: {
				closeCode: 1013,
				closeReason: "session limit reached",
				errorText: "concurrent session limit reached"
			},
			capacity: {
				errorType: "capacity",
				jitter: .2,
				minWaitMs: 1e3,
				budgetMs: 6e4
			},
			clientTokenExpiryToleranceSeconds: 5,
			permanentErrorCodes: [o, r],
			permanentErrorSubstrings: ["permission denied", "not allowed", "invalid session", "401", "invalid api key", "unauthorized", "failed to create livekit frame-metadata worker"]
		},
		methods: {
			promptTimeoutMs: 15e3,
			updateTimeoutMs: 3e4
		},
		livekit: {
			inferenceServerIdentityPrefix: "inference-server-",
			roomOptions: {
				adaptiveStream: !1,
				dynacast: !1
			},
			defaultVideoCodec: "h264",
			defaultMaxVideoBitrateBps: 35e5,
			vp9MaxVideoBitrateBps: 3e6,
			minVideoBitrateBps: 11e5,
			simulcastLowerLayersBitrateBps: 61e4,
			bweVideoShare: .8,
			defaultPublishFps: 30
		},
		observability: {
			stallFpsThreshold: .5,
			statsDefaultIntervalMs: 1e3,
			statsMinIntervalMs: 500,
			telemetryReportIntervalMs: 1e4,
			telemetryUrl: "#",
			telemetryMaxItemsPerReport: 120,
			connectionQuality: {
				windowSamples: 5,
				warmupSamples: 8,
				downgradeConsecutive: 5,
				upgradeConsecutive: 5,
				rtt: {
					goodMs: 150,
					fairMs: 300,
					poorMs: 500,
					relayExtraMs: 100
				},
				glassToGlass: {
					goodMs: 500,
					fairMs: 900,
					poorMs: 1500
				},
				ttff: {
					goodMs: 4e3,
					fairMs: 6e3,
					poorMs: 1e4
				},
				loss: {
					good: .001,
					fair: .01,
					poor: .05
				},
				g2gDrop: {
					good: .001,
					fair: .01,
					poor: .05
				},
				upstream: {
					goodKbps: J(35e5),
					fairKbps: J(11e5),
					poorKbps: J(55e4)
				},
				stall: {
					goodFps: 20,
					fairFps: 12,
					poorFps: 5
				}
			}
		},
		preflight: {
			defaultStunUrls: ["stun:stun.l.google.com:19302"],
			iceGatherTimeoutMs: 5e3,
			rtt: {
				goodMs: 150,
				marginalMs: 300
			},
			active: {
				durationMs: 12e3,
				minSamples: 5
			}
		}
	};

	function Y(e, t = Date.now()) {
		let i;
		try {
			({
				expiresAt: i
			} = S(e))
		} catch {
			return
		}
		let r = (t - Date.parse(i)) / 1e3;
		if (r > H.session.clientTokenExpiryToleranceSeconds) {
			var n, a;
			throw n = Math.round(r), a = i, l(o, `Client token expired ${n} s ago (exp ${a}). Mint a new one right before connecting, or pass apiKeyProvider to createDecartClient so the SDK fetches a fresh token before every connect and reconnect. Client tokens expire 60 s after minting by default (tokens.create({ expiresIn })).`, {
				claim: "exp",
				expiresAt: a,
				expiredSecondsAgo: n
			})
		}
	}

	function X(e) {
		let {
			apiKey: t,
			apiKeyProvider: i
		} = e;
		return i ? async () => {
			let e = await i();
			if ("string" != typeof e || 0 === e.length) throw l(r, `apiKeyProvider must resolve to a non-empty API key string (a client token's apiKey); got ${""===e?"an empty string":typeof e}.`);
			return Y(e), e
		}: () => (Y(t), t)
	}
	var F = C,
		Z = e.i(538882),
		ee = e.i(871101),
		C = C,
		et = C;
	let ei = F.union([Z.z.string().url(), Z.z.string().startsWith("/")]),
		er = ee.z.object({
			apiKey: Z.z.string().min(1).optional(),
			apiKeyProvider: C.custom(e => "function" == typeof e).optional(),
			baseUrl: et.url().optional(),
			proxy: ei.optional(),
			integration: Z.z.string().optional(),
			realtimeBaseUrl: et.url().optional()
		}).refine(e => {
			let t = !!e.proxy,
				i = !!e.apiKey;
			return !(t && i)
		}, {
			message: "Cannot provide both 'proxy' and 'apiKey'. Use 'proxy' for proxy mode or 'apiKey' for direct API access."
		});
	var en = e.i(426682),
		F = C,
		et = C,
		ea = e.i(930971),
		eo = C;
	e.s(["z", 0, eo], 624277);
	var eo = C,
		es = e.i(256827);
	let el = en.z.enum(["lucy-2.1", "lucy-2.5", "lucy-2.6", "lucy-vton-3.5", "lucy-vton-3.6", "lucy-restyle-2"]),
		ec = en.z.enum(["lucy-2.1", "lucy-2.5", "lucy-2.6", "lucy-vton-3.5", "lucy-vton-3.6", "lucy-restyle-2"]),
		eu = en.z.enum(["lucy-image-2"]),
		ed = en.z.enum(["lucy-2.1", "lucy-2.5", "lucy-2.6", "lucy-vton-3.5", "lucy-vton-3.6", "lucy-restyle-2", "lucy-image-2"]),
		eh = {
			"lucy-restyle-v2v": "lucy-restyle-2",
			"lucy-pro-i2i": "lucy-image-2"
		},
		ep = new Set;

	function em(e) {
		let t = eh[e];
		t && !ep.has(e) && (ep.add(e), console.warn(`[Decart SDK] Model "${e}" is deprecated. Use "${t}" instead. See # for details.`))
	}
	let eg = F.union([O.z.literal("lucy-2.1"), O.z.literal("lucy-2.5"), O.z.literal("lucy-2.6"), O.z.literal("lucy-vton-3.5"), O.z.literal("lucy-vton-3.6"), O.z.literal("lucy-restyle-2"), O.z.literal("lucy-latest"), O.z.literal("lucy-vton-latest"), O.z.literal("lucy-restyle-latest")]),
		ef = F.union([O.z.literal("lucy-2.1"), O.z.literal("lucy-2.5"), O.z.literal("lucy-2.6"), O.z.literal("lucy-vton-3.5"), O.z.literal("lucy-vton-3.6"), O.z.literal("lucy-restyle-2"), O.z.literal("lucy-latest"), O.z.literal("lucy-vton-latest"), O.z.literal("lucy-restyle-latest"), O.z.literal("lucy-restyle-v2v")]),
		ey = F.union([O.z.literal("lucy-image-2"), O.z.literal("lucy-image-latest"), O.z.literal("lucy-pro-i2i")]),
		eb = F.union([eg, ef, ey]),
		ev = F.union([D("File"), D("Blob"), D("ReadableStream"), D("URL"), et.url(), ee.z.object({
			uri: Z.z.string(),
			type: Z.z.string(),
			name: Z.z.string()
		})]),
		ew = O.z.literal("720p").optional().describe("The resolution to use for the generation").default("720p"),
		ek = ee.z.object({
			prompt: Z.z.string().min(1).max(1e3).describe("The prompt to use for the generation"),
			data: ev.describe("The image data to use for generation (File, Blob, ReadableStream, URL, or string URL)"),
			reference_image: ev.optional().describe("Optional reference image to guide the edit (File, Blob, ReadableStream, URL, or string URL)"),
			seed: $.z.number().optional().describe("The seed to use for the generation"),
			resolution: en.z.enum(["720p", "480p"]).optional().describe("The resolution to use for the generation").default("720p"),
			enhance_prompt: ea.z.boolean().optional().describe("Whether to enhance the prompt")
		}),
		eS = ee.z.object({
			prompt: Z.z.string().min(1).optional().describe("Text prompt for the video editing"),
			reference_image: ev.optional().describe("Reference image to transform into a prompt (File, Blob, ReadableStream, URL, or string URL)"),
			data: ev.describe("Video file to process (File, Blob, ReadableStream, URL, or string URL)"),
			seed: $.z.number().optional().describe("Seed for the video generation"),
			resolution: ew,
			enhance_prompt: ea.z.boolean().optional().describe("Whether to enhance the prompt (only valid with text prompt, defaults to true on backend)")
		}).refine(e => void 0 !== e.prompt != (void 0 !== e.reference_image), {
			message: "Must provide either 'prompt' or 'reference_image', but not both"
		}).refine(e => void 0 === e.reference_image || void 0 === e.enhance_prompt, {
			message: "'enhance_prompt' is only valid when using 'prompt', not 'reference_image'"
		}),
		eT = ee.z.object({
			prompt: Z.z.string().describe("Text prompt for the video editing. Send an empty string if you want no text prompt."),
			reference_image: ev.optional().describe("Optional reference image to guide the edit (File, Blob, ReadableStream, URL, or string URL)"),
			data: ev.describe("Video file to process (File, Blob, ReadableStream, URL, or string URL)"),
			seed: $.z.number().optional().describe("The seed to use for the generation"),
			resolution: ew,
			enhance_prompt: ea.z.boolean().optional().describe("Whether to enhance the prompt")
		}),
		eR = en.z.enum(["fast"]);

	function eP(e, t = 30) {
		return "number" == typeof e ? e : e.ideal ?? e.max ?? e.exact ?? e.min ?? t
	}
	let eM = ee.z.object({
			name: Z.z.string(),
			urlPath: Z.z.string(),
			queueUrlPath: Z.z.string().optional(),
			fps: F.union([$.z.number().min(1), ee.z.object({
				max: $.z.number().min(1).optional(),
				min: $.z.number().min(1).optional(),
				ideal: $.z.number().min(1).optional(),
				exact: $.z.number().min(1).optional()
			})]),
			width: $.z.number().min(1),
			height: $.z.number().min(1),
			inputSchema: eo.any().optional(),
			supportedSpeeds: es.z.array(eR).readonly().optional()
		}),
		eE = {
			realtime: {
				"lucy-2.1": {
					urlPath: "/v1/stream",
					name: "lucy-2.1",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({})
				},
				"lucy-2.5": {
					urlPath: "/v1/stream",
					name: "lucy-2.5",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-2.6": {
					urlPath: "/v1/stream",
					name: "lucy-2.6",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-vton-3.5": {
					urlPath: "/v1/stream",
					name: "lucy-vton-3.5",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-vton-3.6": {
					urlPath: "/v1/stream",
					name: "lucy-vton-3.6",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-restyle-2": {
					urlPath: "/v1/stream",
					name: "lucy-restyle-2",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 704,
					inputSchema: ee.z.object({})
				},
				"lucy-latest": {
					urlPath: "/v1/stream",
					name: "lucy-latest",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-vton-latest": {
					urlPath: "/v1/stream",
					name: "lucy-vton-latest",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 720,
					inputSchema: ee.z.object({}),
					supportedSpeeds: ["fast"]
				},
				"lucy-restyle-latest": {
					urlPath: "/v1/stream",
					name: "lucy-restyle-latest",
					fps: {
						ideal: 30,
						max: 30
					},
					width: 1280,
					height: 704,
					inputSchema: ee.z.object({})
				}
			},
			image: {
				"lucy-image-2": {
					urlPath: "/v1/generate/lucy-image-2",
					queueUrlPath: "/v1/jobs/lucy-image-2",
					name: "lucy-image-2",
					fps: 25,
					width: 1280,
					height: 704,
					inputSchema: ek
				},
				"lucy-image-latest": {
					urlPath: "/v1/generate/lucy-image-latest",
					queueUrlPath: "/v1/jobs/lucy-image-latest",
					name: "lucy-image-latest",
					fps: 25,
					width: 1280,
					height: 704,
					inputSchema: ek
				},
				"lucy-pro-i2i": {
					urlPath: "/v1/generate/lucy-pro-i2i",
					queueUrlPath: "/v1/jobs/lucy-pro-i2i",
					name: "lucy-pro-i2i",
					fps: 25,
					width: 1280,
					height: 704,
					inputSchema: ek
				}
			},
			video: {
				"lucy-2.1": {
					urlPath: "#",
					queueUrlPath: "#",
					name: "lucy-2.1",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-2.5": {
					urlPath: "#",
					queueUrlPath: "#",
					name: "lucy-2.5",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-2.6": {
					urlPath: "#",
					queueUrlPath: "#",
					name: "lucy-2.6",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-vton-3.5": {
					urlPath: "#",
					queueUrlPath: "#",
					name: "lucy-vton-3.5",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-vton-3.6": {
					urlPath: "#",
					queueUrlPath: "#",
					name: "lucy-vton-3.6",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-restyle-2": {
					urlPath: "/v1/generate/lucy-restyle-2",
					queueUrlPath: "/v1/jobs/lucy-restyle-2",
					name: "lucy-restyle-2",
					fps: 22,
					width: 1280,
					height: 704,
					inputSchema: eS
				},
				"lucy-latest": {
					urlPath: "/v1/generate/lucy-latest",
					queueUrlPath: "/v1/jobs/lucy-latest",
					name: "lucy-latest",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-vton-latest": {
					urlPath: "/v1/generate/lucy-vton-latest",
					queueUrlPath: "/v1/jobs/lucy-vton-latest",
					name: "lucy-vton-latest",
					fps: 20,
					width: 1280,
					height: 720,
					inputSchema: eT
				},
				"lucy-restyle-latest": {
					urlPath: "/v1/generate/lucy-restyle-latest",
					queueUrlPath: "/v1/jobs/lucy-restyle-latest",
					name: "lucy-restyle-latest",
					fps: 22,
					width: 1280,
					height: 704,
					inputSchema: eS
				},
				"lucy-restyle-v2v": {
					urlPath: "/v1/generate/lucy-restyle-v2v",
					queueUrlPath: "/v1/jobs/lucy-restyle-v2v",
					name: "lucy-restyle-v2v",
					fps: 22,
					width: 1280,
					height: 704,
					inputSchema: eS
				}
			}
		},
		eC = ["realtime", "video", "image"],
		eI = {
			realtime: el,
			video: ec,
			image: eu
		};
	e.s(["Y", 0, function(e) {
		return ed.safeParse(e).success
	}, "O", 0, function(e) {
		return ey.safeParse(e).success
	}, "p", 0, function(e) {
		return eb.safeParse(e).success
	}, "t", 0, function(e) {
		return eg.safeParse(e).success
	}, "_", 0, function(e) {
		return ef.safeParse(e).success
	}, "x", 0, function(e = {}) {
		return (e.kind ? [e.kind] : eC).flatMap(t => Object.values(eE[t]).filter(i => !e.canonicalOnly || eI[t].safeParse(i.name).success).map(e => ({
			...e,
			kind: t
		})))
	}, "B", 0, eh, "W", 0, eM, "$", 0, {
		realtime: e => {
			em(e);
			let t = eE.realtime[e];
			if (!t) throw g(e);
			return t
		},
		video: e => {
			em(e);
			let t = eE.video[e];
			if (!t) throw g(e);
			return t
		},
		image: e => {
			em(e);
			let t = eE.image[e];
			if (!t) throw g(e);
			return t
		}
	}, "M", 0, eR, "I", 0, function(e) {
		let t = eh[e];
		if (t) return t;
		let i = ed.safeParse(e);
		return i.success ? i.data : void 0
	}, "z", 0, eP, "h", 0, function(e) {
		let t = eh[e];
		if (t) return t;
		let i = eb.safeParse(e);
		return i.success ? i.data : void 0
	}], 987873);
	let eD = e => "string" == typeof e && e.startsWith("file_");
	var F = C;
	let ex = ee.z.object({
		prompt: ee.z.object({
			text: Z.z.string().min(1),
			enhance: ea.z.boolean().optional().default(!0)
		}).optional(),
		image: F.union([D("Blob"), D("File"), Z.z.string()]).optional(),
		passthrough: ea.z.boolean().optional()
	});
	async function eA(e) {
		return new Promise((t, i) => {
			let r = new FileReader;
			r.onloadend = () => {
				let e = r.result;
				if ("string" != typeof e) return void i(Error("FileReader did not return a string"));
				let n = e.split(",")[1];
				n ? t(n) : i(Error("Invalid data URL format"))
			}, r.onerror = i, r.readAsDataURL(e)
		})
	}
	async function eU(e) {
		if ("string" == typeof e) {
			let t = null;
			try {
				t = new URL(e)
			} catch {}
			if (t?.protocol === "data:") {
				let [, t] = e.split(",", 2);
				if (!t) throw Error("Invalid data URL image");
				return t
			}
			if (t?.protocol === "http:" || t?.protocol === "https:") {
				let t = await fetch(e);
				if (!t.ok) throw Error(`Failed to fetch image: ${t.status} ${t.statusText}`);
				return eA(await t.blob())
			}
			if (t) throw Error(`Unsupported image URL scheme: ${t.protocol}`);
			return e
		}
		return eA(e)
	}

	function ez(e) {
		return {
			all: e = e || new Map,
			on: function(t, i) {
				var r = e.get(t);
				r ? r.push(i) : e.set(t, [i])
			},
			off: function(t, i) {
				var r = e.get(t);
				r && (i ? r.splice(r.indexOf(i) >>> 0, 1) : e.set(t, []))
			},
			emit: function(t, i) {
				var r = e.get(t);
				r && r.slice().map(function(e) {
					e(i)
				}), (r = e.get("*")) && r.slice().map(function(e) {
					e(t, i)
				})
			}
		}
	}

	function e_() {
		let e = ez(),
			t = [],
			i = !0;
		return {
			emitter: e,
			emitOrBuffer: (r, n) => {
				i ? t.push({
					event: r,
					data: n
				}) : e.emit(r, n)
			},
			flush: () => {
				setTimeout(() => {
					for (let {
							event: r,
							data: n
						}
						of(i = !1, t)) e.emit(r, n);
					t.length = 0
				}, 0)
			},
			stop: () => {
				i = !1, t.length = 0
			}
		}
	}
	var F = C,
		eL = C;
	let ej = ee.z.object({
			prompt: Z.z.string().min(1).optional(),
			enhance: ea.z.boolean().optional().default(!0),
			image: F.union([D("Blob"), D("File"), Z.z.string(), eL.null()]).optional()
		}).refine(e => void 0 !== e.prompt || void 0 !== e.image, {
			message: "At least one of 'prompt' or 'image' must be provided"
		}),
		eF = ee.z.object({
			prompt: Z.z.string().min(1),
			enhance: ea.z.boolean().optional().default(!0)
		});
	var e$ = class {
			config;
			ws = null;
			events = ez();
			pendingAcks = [];
			bufferedAcks = [];
			pendingRoomInfo = null;
			connected = !1;
			closing = !1;
			logger;
			constructor(e) {
				this.config = e, this.logger = e.logger ?? E("warn")
			}
			on(e, t) {
				this.events.on(e, t)
			}
			off(e, t) {
				this.events.off(e, t)
			}
			async openAndJoin(e = {}) {
				let t, i = e.connectTimeout ?? H.signaling.connectTimeoutMs,
					r = e.handshakeTimeout ?? H.signaling.handshakeTimeoutMs,
					n = "function" == typeof this.config.url ? this.config.url() : this.config.url,
					a = "string" == typeof n ? n : await n;
				this.config.observability?.startPhase("websocket-open"), await this.openSocket(a, i), this.config.observability?.endPhase("websocket-open", {
					success: !0
				}), this.config.observability?.startPhase("room-join");
				let o = this.waitForRoomInfo(r),
					s = function(e) {
						if (!e) return null;
						if (void 0 !== e.imageRef || void 0 !== e.image) {
							let t = void 0 !== e.imageRef ? {
								type: "set_image",
								image_ref: e.imageRef
							} : {
								type: "set_image",
								image_data: e.image ?? null
							};
							return void 0 !== e.prompt && (t.prompt = e.prompt), void 0 !== e.enhance && (t.enhance_prompt = e.enhance), {
								message: t,
								matchAck: e => "set_image_ack" === e.type,
								label: "Image send"
							}
						}
						if (void 0 !== e.prompt && null !== e.prompt) {
							let t = e.prompt;
							return {
								message: {
									type: "prompt",
									prompt: t,
									enhance_prompt: e.enhance ?? !0
								},
								matchAck: e => "prompt_ack" === e.type && e.prompt === t,
								label: "Prompt send"
							}
						}
						return null
					}(e.initialState),
					l = null != e.initialState && (null != e.initialState.image || null != e.initialState.imageRef || null != e.initialState.prompt),
					c = {
						type: "livekit_join",
						passthrough: e.passthrough ?? !l,
						...e.frameTiming ? {
							client_capabilities: {
								frame_timing: !0
							}
						} : {}
					};
				if (!this.writeMessage(c) || s && !this.writeMessage(s.message)) throw o.cancel(), Error("WebSocket is not open");
				try {
					t = await o.promise
				} catch (e) {
					throw this.rejectAllPending(e instanceof Error ? e : Error(String(e))), e
				}
				this.config.observability?.endPhase("room-join", {
					success: !0
				}), this.connected = !0;
				let u = s ? this.flushInitialState(s) : Promise.resolve();
				return u.catch(() => {}), {
					roomInfo: t,
					initialStateAck: u
				}
			}
			async flushInitialState(e) {
				this.config.observability?.startPhase("initial-state-handshake");
				let t = await this.request({
					message: e.message,
					matchAck: e.matchAck,
					timeoutMs: H.signaling.requestTimeoutMs,
					label: e.label,
					write: !1
				});
				if (this.config.observability?.endPhase("initial-state-handshake", {
						success: !0
					}), !t.success) throw Error(t.error ?? `Failed: ${e.label}`)
			}
			close() {
				this.closing = !0, this.connected = !1;
				let e = this.ws;
				if (this.ws = null, e) try {
					e.close()
				} catch {}
				this.rejectPendingRoomInfo(Error("Control channel closed")), this.rejectAllPending(Error("Control channel closed"))
			}
			async sendPrompt(e, t = {}) {
				let i = await this.request({
					message: {
						type: "prompt",
						prompt: e,
						enhance_prompt: t.enhance ?? !0
					},
					matchAck: t => "prompt_ack" === t.type && t.prompt === e,
					timeoutMs: t.timeout ?? H.signaling.requestTimeoutMs,
					label: "Prompt send"
				});
				if (!i.success) throw Error(i.error ?? "Failed to send prompt")
			}
			async setImage(e, t = {}) {
				let i = "ref" === e.kind ? {
					type: "set_image",
					image_ref: e.ref
				} : {
					type: "set_image",
					image_data: e.data
				};
				void 0 !== t.prompt && (i.prompt = t.prompt), void 0 !== t.enhance && (i.enhance_prompt = t.enhance);
				let r = await this.request({
					message: i,
					matchAck: e => "set_image_ack" === e.type,
					timeoutMs: t.timeout ?? H.signaling.requestTimeoutMs,
					label: "Image send"
				});
				if (!r.success) throw Error(r.error ?? "Failed to send image")
			}
			async openSocket(e, t) {
				let i = encodeURIComponent(A(this.config.integration)),
					r = `${e}${e.includes("?")?"&":"?"}user_agent=${i}`;
				this.closing = !1, await new Promise((e, i) => {
					let n = setTimeout(() => i(Error(`WebSocket open timeout (${t}ms)`)), t),
						a = new WebSocket(r);
					this.ws = a, a.onopen = () => {
						clearTimeout(n), e()
					}, a.onclose = e => {
						clearTimeout(n);
						let t = this.connected,
							r = this.pendingAcks.length;
						this.connected = !1, this.ws = null, this.logger.warn("signaling: websocket closed", {
							code: e.code,
							reason: e.reason,
							wasConnected: t,
							closing: this.closing,
							pendingAcks: r
						});
						let a = Error(`WebSocket closed: ${e.code} ${e.reason}`);
						this.rejectPendingRoomInfo(a), this.rejectAllPending(a), t || this.closing ? this.events.emit("closed", {
							code: e.code,
							reason: e.reason
						}) : i(a)
					}, a.onerror = () => {}, a.onmessage = e => {
						try {
							this.handleMessage(JSON.parse(e.data))
						} catch {}
					}
				})
			}
			waitForRoomInfo(e) {
				let t = () => {};
				return {
					promise: new Promise((i, r) => {
						let n = setTimeout(() => {
								t(), this.logger.warn("signaling: livekit_room_info timeout", {
									timeoutMs: e
								}), r(Error(`livekit_room_info timeout (${e}ms)`))
							}, e),
							a = {
								resolve: e => {
									t(), i(e)
								},
								reject: e => {
									t(), r(e)
								},
								cancel: () => {
									t()
								},
								pauseTimeout: () => {
									n && (clearTimeout(n), n = null)
								}
							};
						t = () => {
							n && (clearTimeout(n), n = null), this.pendingRoomInfo === a && (this.pendingRoomInfo = null)
						}, this.pendingRoomInfo = a
					}),
					cancel: t
				}
			}
			async request({
				message: e,
				matchAck: t,
				timeoutMs: i,
				label: r,
				write: n = !0
			}) {
				return new Promise((a, o) => {
					let s = this.bufferedAcks.findIndex(e => t(e));
					if (-1 !== s) {
						let [e] = this.bufferedAcks.splice(s, 1);
						a(e);
						return
					}
					let l = setTimeout(() => {
							u(), this.logger.warn("signaling: ack timed out", {
								label: r,
								timeoutMs: i
							}), o(Error(`${r} timed out`))
						}, i),
						c = {
							matches: t,
							onMatch: e => {
								u(), a(e)
							},
							reject: e => {
								u(), o(e)
							}
						},
						u = () => {
							clearTimeout(l), this.pendingAcks = this.pendingAcks.filter(e => e !== c)
						};
					this.pendingAcks.push(c), n && !this.writeMessage(e) && (u(), o(Error("WebSocket is not open")))
				})
			}
			writeMessage(e) {
				return this.ws?.readyState === WebSocket.OPEN && (this.ws.send(JSON.stringify(e)), !0)
			}
			handleMessage(e) {
				for (let t of [...this.pendingAcks])
					if (t.matches(e)) return void t.onMatch(e);
				if (!this.connected && ("set_image_ack" === e.type || "prompt_ack" === e.type)) return void this.bufferedAcks.push(e);
				switch (e.type) {
					case "livekit_room_info":
						this.resolvePendingRoomInfo({
							livekitUrl: e.livekit_url,
							token: e.token,
							roomName: e.room_name,
							sessionId: e.session_id
						});
						break;
					case "queue_position":
						this.pendingRoomInfo?.pauseTimeout(), this.events.emit("queuePosition", {
							position: e.position,
							queueSize: e.queue_size
						});
						break;
					case "generation_started":
						this.events.emit("generationStarted");
						break;
					case "generation_tick":
						this.events.emit("generationTick", {
							seconds: e.seconds
						});
						break;
					case "generation_ended":
						this.events.emit("generationEnded", {
							seconds: e.seconds,
							reason: e.reason
						});
						break;
					case "error": {
						let t = Error(e.error);
						t.source = "server", "string" == typeof e.error_type && (t.errorType = e.error_type), "number" == typeof e.retry_after && (t.retryAfter = e.retry_after), this.logger.error("signaling: server error received", {
							error: e.error
						}), this.events.emit("serverError", t), this.rejectPendingRoomInfo(t), this.rejectAllPending(t)
					}
				}
			}
			resolvePendingRoomInfo(e) {
				let t = this.pendingRoomInfo;
				t && t.resolve(e)
			}
			rejectPendingRoomInfo(e) {
				let t = this.pendingRoomInfo;
				t && t.reject(e)
			}
			rejectAllPending(e) {
				let t = this.pendingAcks;
				for (let i of (this.pendingAcks = [], this.bufferedAcks = [], t)) i.reject(e)
			}
		},
		eO = e.i(629103);
	let eK = Object.prototype.toString,
		eq = new Set(["network error", "NetworkError when attempting to fetch resource.", "The Internet connection appears to be offline.", "Network request failed", "fetch failed", "terminated", " A network error occurred.", "Network connection lost"]);
	class eB extends Error {
		constructor(e) {
			super(), e instanceof Error ? (this.originalError = e, {
				message: e
			} = e) : (this.originalError = Error(e), this.originalError.stack = this.stack), this.name = "AbortError", this.message = e
		}
	}
	let eN = (e, t, i) => {
		let r = i.retries - (t - 1);
		return e.attemptNumber = t, e.retriesLeft = r, e
	};
	async function eW(e, t) {
		return new Promise((i, r) => {
			t = {
				...t
			}, t.onFailedAttempt ??= () => {}, t.shouldRetry ??= () => !0, t.retries ??= 10;
			let n = eO.default.operation(t),
				a = () => {
					n.stop(), r(t.signal?.reason)
				};
			t.signal && !t.signal.aborted && t.signal.addEventListener("abort", a, {
				once: !0
			});
			let o = () => {
				t.signal?.removeEventListener("abort", a), n.stop()
			};
			n.attempt(async a => {
				try {
					let t = await e(a);
					o(), i(t)
				} catch (e) {
					try {
						if (!(e instanceof Error)) throw TypeError(`Non-error was thrown: "${e}". You should only throw errors.`);
						if (e instanceof eB) throw e.originalError;
						if (e instanceof TypeError && ! function(e) {
								if (!(e && "[object Error]" === eK.call(e) && "TypeError" === e.name && "string" == typeof e.message)) return !1;
								let {
									message: t,
									stack: i
								} = e;
								return "Load failed" === t || t.startsWith("Load failed (") && t.endsWith(")") ? void 0 === i || "__sentry_captured__" in e : !!(t.startsWith("error sending request for url") || "Failed to fetch" === t || t.startsWith("Failed to fetch (") && t.endsWith(")")) || eq.has(t)
							}(e)) throw e;
						if (eN(e, a, t), await t.shouldRetry(e) || (n.stop(), r(e)), await t.onFailedAttempt(e), !n.retry(e)) throw n.mainError()
					} catch (e) {
						eN(e, a, t), o(), r(e)
					}
				}
			})
		})
	}
	let eG = "policy_violation",
		eV = "session_limit";

	function eQ(e) {
		return e.code === H.session.terminalCloseCode ? eG : ! function(e, t) {
			let {
				closeCode: i,
				closeReason: r
			} = H.session.sessionLimit;
			return e === i && "string" == typeof t && t.toLowerCase().includes(r)
		}(e.code, e.reason) ? null : eV
	}

	function eJ(e) {
		if (!(e instanceof Error)) return null;
		let t = e.message.toLowerCase(),
			{
				terminalCloseCode: i,
				sessionLimit: r
			} = H.session;
		return t.includes(`websocket closed: ${i}`) ? eG : t.includes(`websocket closed: ${r.closeCode} ${r.closeReason}`) || t.includes(r.errorText) ? eV : null
	}

	function eH(e) {
		if (!(e instanceof Error)) return;
		let {
			errorType: t,
			retryAfter: i
		} = e;
		if (t === H.session.capacity.errorType && "number" == typeof i && Number.isFinite(i) && !(i < 0)) return 1e3 * i
	}
	var eY = class {
			config;
			signaling;
			media;
			events = ez();
			state = "disconnected";
			queue = null;
			disposed = !1;
			dialed = !1;
			currentAttempt = 0;
			teardownGeneration = 0;
			terminalEndReason = null;
			appliedState = null;
			logger;
			constructor(e) {
				this.config = e, this.logger = e.logger ?? E("warn"), this.createTransport()
			}
			on(e, t) {
				this.events.on(e, t)
			}
			off(e, t) {
				this.events.off(e, t)
			}
			getStatus() {
				return {
					connection: this.state,
					queue: this.queue
				}
			}
			getConnectionState() {
				return this.state
			}
			isConnected() {
				return "connected" === this.state || "generating" === this.state
			}
			async connect() {
				this.disposed = !1, this.terminalEndReason = null;
				let e = ++this.currentAttempt;
				this.setState("connecting"), this.logger.info("realtime connect: starting", {
					attemptCycle: e
				});
				try {
					let t = Date.now();
					for (let i = 1;; i++) try {
						return await eW(() => this.runOneConnect(e), this.retryOptionsFor(e, this.config.connectRetries, !0))
					} catch (a) {
						let r = this.capacityWaitMs(e, a, t);
						if (void 0 === r) throw a;
						let n = {
							retryAfterMs: r,
							attempt: i
						};
						this.logger.warn("realtime connect: server at capacity; waiting before re-dial", n), this.events.emit("capacityWait", n), await

						function(e) {
							return new Promise(t => setTimeout(t, e))
						}(r)
					}
				} catch (r) {
					let t = r instanceof Error ? r.message : String(r),
						i = this.terminalEndReason ?? eJ(r);
					if (i) throw this.disposed || this.finishTerminally(i, {
						source: "connect",
						error: t
					}), r;
					throw this.logger.error("realtime connect: exhausted all retries", {
						error: t
					}), this.currentAttempt !== e || this.disposed || this.setState("disconnected"), r
				}
			}
			async sendPrompt(e, t) {
				this.assertConnected(), await this.signaling.sendPrompt(e, t), this.appliedState = {
					...this.getInitialState(),
					prompt: e,
					enhance: t?.enhance
				}
			}
			async setImage(e, t) {
				this.assertConnected(), await this.signaling.setImage(e, t), this.appliedState = "ref" === e.kind ? {
					imageRef: e.ref,
					prompt: t?.prompt ?? null,
					enhance: t?.enhance
				} : {
					image: e.data,
					prompt: t?.prompt ?? null,
					enhance: t?.enhance
				}
			}
			async replaceVideoTrack(e) {
				this.assertConnected(), await this.media.replaceVideoTrack(e);
				let t = this.config.localStream;
				this.config.localStream = new MediaStream(t ? [e, ...t.getAudioTracks()] : [e])
			}
			disconnect() {
				this.disposed = !0, this.tearDown(), this.setState("disconnected")
			}
			assertConnected() {
				if (!this.isConnected()) throw Error(`Cannot send message: connection is ${this.state}`)
			}
			capacityWaitMs(e, t, i) {
				let r = eH(t);
				if (void 0 === r || 0 === this.config.connectRetries || this.disposed || this.currentAttempt !== e) return;
				let {
					jitter: n,
					minWaitMs: a
				} = H.session.capacity, o = this.config.capacityRetryBudgetMs ?? H.session.capacity.budgetMs, s = Math.max(a, Math.round(r * (1 - n + 2 * Math.random() * n))), l = Date.now() - i;
				return l + s > o ? void this.logger.error("realtime connect: server at capacity, retry budget used up", {
					elapsedMs: l,
					delayMs: s,
					budgetMs: o
				}) : s
			}
			retryOptionsFor(e, t = H.session.retry.retries, i = !1) {
				return {
					...H.session.retry,
					retries: t,
					onFailedAttempt: e => {
						this.tearDown()
					},
					shouldRetry: t => {
						if (this.disposed || this.currentAttempt !== e || i && void 0 !== eH(t)) return !1;
						let r = this.terminalEndReason ?? eJ(t);
						if (r) return this.terminalEndReason = r, this.logger.error("realtime connect: session refused, not retrying", {
							reason: r
						}), !1;
						let n = t instanceof u ? t.sdkError.code : void 0;
						if (n && H.session.permanentErrorCodes.includes(n)) return this.logger.error("realtime connect: credential refused, not retrying", {
							code: n,
							error: t.message
						}), !1;
						let a = t.message.toLowerCase(),
							o = H.session.permanentErrorSubstrings.some(e => a.includes(e));
						return o && this.logger.error("realtime connect: permanent error, not retrying", {
							error: t.message
						}), !o
					}
				}
			}
			async runOneConnect(e) {
				if (this.disposed || this.currentAttempt !== e) throw new eB("Stale connect attempt");
				try {
					this.resetHandshakeState();
					let t = this.getInitialState();
					this.config.observability?.beginConnectionBreakdown(e, function(e) {
						if (!e) return null;
						let t = e.indexOf(","),
							i = t >= 0 && e.startsWith("data:") ? e.slice(t + 1) : e,
							r = i.endsWith("==") ? 2 : +!!i.endsWith("=");
						return Math.max(0, Math.round((Math.floor(3 * i.length / 4) - r) / 1024))
					}(t?.image)), this.config.observability?.markGlassToGlassStart();
					let {
						roomInfo: i,
						initialStateAck: r
					} = await this.signaling.openAndJoin({
						connectTimeout: H.session.connectionTimeoutMs,
						initialState: t,
						passthrough: this.config.initialPassthrough,
						frameTiming: this.config.frameTiming
					});
					if (this.watchInitialStateAck(r, e), this.disposed || this.currentAttempt !== e) throw this.tearDown(), new eB("Stale connect attempt");
					this.queue = null;
					try {
						await this.media.connect({
							url: i.livekitUrl,
							token: i.token
						}), await this.media.publishLocalTracks()
					} catch (e) {
						throw this.tearDown(), e
					}
					if (this.disposed || this.currentAttempt !== e) throw this.tearDown(), new eB("Stale connect attempt");
					this.config.observability?.finishConnectionBreakdown({
						success: !0
					}), this.setState("connected"), this.events.emit("sessionStarted", {
						sessionId: i.sessionId,
						subscribeToken: function(e, t = {}) {
							return btoa(JSON.stringify({
								room_name: e,
								...t.frameTiming ? {
									frame_timing: !0
								} : {}
							}))
						}(i.roomName, {
							frameTiming: this.config.frameTiming
						})
					})
				} catch (t) {
					let e = t instanceof Error ? t : c(t) ? new u(t) : Error(String(t));
					throw this.config.observability?.finishConnectionBreakdown({
						success: !1,
						error: e.message
					}), e
				}
			}
			watchInitialStateAck(e, t) {
				let i = this.teardownGeneration;
				e.catch(e => {
					this.disposed || this.currentAttempt !== t || this.teardownGeneration !== i || this.events.emit("error", e instanceof Error ? e : Error(String(e)))
				})
			}
			getInitialState() {
				return this.appliedState ?? this.configInitialState()
			}
			configInitialState() {
				return void 0 !== this.config.initialImageRef ? {
					imageRef: this.config.initialImageRef,
					prompt: this.config.initialPrompt?.text,
					enhance: this.config.initialPrompt?.enhance
				} : void 0 !== this.config.initialImage ? {
					image: this.config.initialImage,
					prompt: this.config.initialPrompt?.text,
					enhance: this.config.initialPrompt?.enhance
				} : this.config.initialPrompt ? {
					prompt: this.config.initialPrompt.text,
					enhance: this.config.initialPrompt.enhance
				} : void 0
			}
			wireSignalingEvents() {
				this.signaling.on("queuePosition", e => {
					this.queue = e, this.events.emit("queuePosition", e)
				}), this.signaling.on("generationStarted", () => this.markGenerating()), this.signaling.on("generationTick", e => {
					this.markGenerating(), this.events.emit("generationTick", e)
				}), this.signaling.on("generationEnded", e => {
					var t;
					void 0 !== (t = e.reason) && H.session.terminalEndReasons.includes(t) && (this.terminalEndReason = e.reason), this.events.emit("generationEnded", e)
				}), this.signaling.on("serverError", e => this.events.emit("error", e)), this.signaling.on("closed", e => {
					this.terminalEndReason ??= eQ({
						...e
					}), this.handleConnectionLoss({
						source: "signaling",
						...e
					})
				})
			}
			markGenerating() {
				"connected" === this.state && this.setState("generating")
			}
			wireMediaEvents() {
				this.media.on("remoteStream", e => this.events.emit("remoteStream", e)), this.media.on("disconnected", e => this.handleConnectionLoss({
					source: "media",
					reason: e.reason
				}))
			}
			handleConnectionLoss(e) {
				if (this.disposed) return;
				let t = this.terminalEndReason ?? eQ(e);
				t ? this.finishTerminally(t, e) : "connected" !== this.state && "generating" !== this.state ? this.logger.debug("connection loss ignored (not connected)", {
					state: this.state,
					...e
				}) : (this.logger.warn("realtime connection lost; scheduling reconnect", {
					state: this.state,
					...e
				}), this.scheduleReconnect())
			}
			finishTerminally(e, t) {
				this.logger.warn("realtime session ended by the server; not reconnecting", {
					...t,
					reason: e,
					state: this.state
				}), this.terminalEndReason = e, this.disposed = !0, this.tearDown(), this.setState("disconnected"), this.events.emit("sessionEnded", {
					reason: e
				})
			}
			scheduleReconnect() {
				let e = ++this.currentAttempt;
				this.setState("reconnecting"), eW(async () => {
					if (this.disposed || this.currentAttempt !== e) throw new eB("Reconnect cancelled");
					this.tearDown(), this.createTransport(), await this.runOneConnect(e)
				}, this.retryOptionsFor(e)).then(() => {
					this.disposed || this.currentAttempt !== e || this.logger.info("realtime reconnect: succeeded")
				}).catch(t => {
					if (this.disposed || this.currentAttempt !== e) return;
					let i = t instanceof Error ? t.message : String(t),
						r = this.terminalEndReason ?? eJ(t);
					r ? this.finishTerminally(r, {
						source: "reconnect",
						error: i
					}) : (this.logger.error("realtime reconnect: failed permanently", {
						error: i
					}), this.tearDown(), this.setState("disconnected"), this.events.emit("error", t instanceof Error ? t : Error(String(t))))
				})
			}
			resolveDialUrl() {
				let e = this.dialed ? this.config.redialUrl : void 0;
				if (this.dialed = !0, !e) return this.config.url;
				let t = e();
				if ("string" == typeof t) return t;
				let i = this.currentAttempt;
				return t.then(e => {
					if (this.disposed || this.currentAttempt !== i) throw new eB("Stale connect attempt");
					return e
				})
			}
			createTransport() {
				this.signaling = new e$({
					url: () => this.resolveDialUrl(),
					integration: this.config.integration,
					logger: this.logger,
					observability: this.config.observability
				}), this.media = this.config.createMediaChannel({
					observability: this.config.observability,
					localStream: this.config.localStream,
					logger: this.logger,
					videoCodec: this.config.videoCodec
				}), this.wireSignalingEvents(), this.wireMediaEvents()
			}
			tearDown() {
				this.teardownGeneration++, this.signaling.close(), this.media.disconnect(), this.resetHandshakeState()
			}
			resetHandshakeState() {
				this.queue = null
			}
			setState(e) {
				this.state !== e && (this.logger.debug("realtime state change", {
					from: this.state,
					to: e
				}), this.state = e, this.events.emit("connectionChange", e))
			}
		},
		C = C,
		eX = C,
		F = C;
	let eZ = ee.z.object({
		model: eM,
		onRemoteStream: C.custom(e => "function" == typeof e, {
			message: "onRemoteStream must be a function"
		}),
		onConnectionChange: C.custom(e => "function" == typeof e, {
			message: "onConnectionChange must be a function"
		}).optional(),
		onConnectionQuality: C.custom(e => "function" == typeof e, {
			message: "onConnectionQuality must be a function"
		}).optional(),
		onQueuePosition: C.custom(e => "function" == typeof e, {
			message: "onQueuePosition must be a function"
		}).optional(),
		onCapacityWait: C.custom(e => "function" == typeof e, {
			message: "onCapacityWait must be a function"
		}).optional(),
		initialState: ex.optional(),
		queryParams: eX.record(Z.z.string(), Z.z.string()).optional(),
		mirror: F.union([O.z.literal("auto"), ea.z.boolean()]).optional(),
		resolution: en.z.enum(["720p", "1080p"]).optional(),
		speed: eR.optional(),
		retries: $.z.number().int().min(0).optional(),
		capacityRetryBudgetMs: $.z.number().min(0).optional(),
		preferredVideoCodec: en.z.enum(["h264", "vp8", "vp9"]).optional(),
		debugQuality: ea.z.boolean().optional()
	});

	function e0(e) {
		let t = ["function" != typeof e.Room && "Room", ("object" != typeof e.RoomEvent || null === e.RoomEvent) && "RoomEvent", (null === e.Track || "object" != typeof e.Track && "function" != typeof e.Track) && "Track", e.Track?.Source?.Camera !== "camera" && "Track.Source.Camera", ("object" != typeof e.ConnectionState || null === e.ConnectionState) && "ConnectionState"].filter(e => !1 !== e);
		if (t.length > 0) throw p(`livekit-client is missing or has invalid required exports: ${t.join(", ")}`);
		return e
	}

	function e1() {
		return i ??= e.A(315273).then(e0).catch(e => {
			if (i = void 0, "object" == typeof e && null !== e && "code" in e && "LIVEKIT_INITIALIZATION_ERROR" === e.code) throw e;
			let t = e instanceof Error ? e : Error(String(e));
			throw p(`Failed to initialize livekit-client: ${t.message}`, t)
		})
	}
	let e2 = {
		critical: 0,
		poor: 1,
		fair: 2,
		good: 3
	};

	function e3(...e) {
		return e.reduce((e, t) => e2[e] <= e2[t] ? e : t)
	}

	function e5(e, t, i, r) {
		return null === e || e <= t ? "good" : e <= i ? "fair" : e <= r ? "poor" : "critical"
	}

	function e8(e, t, i, r) {
		return null === e || e >= t ? "good" : e >= i ? "fair" : e >= r ? "poor" : "critical"
	}

	function e6(e) {
		let t = e.remoteInbound?.roundTripTime ?? e.connection.currentRoundTripTime,
			i = e.connection.selectedCandidatePairs.some(e => "relay" === e.local.candidateType || "relay" === e.remote.candidateType);
		return {
			rttMs: null != t ? 1e3 * t : null,
			g2gMs: e.glassToGlass?.medianMs ?? null,
			ttffMs: e.glassToGlass?.ttffMs ?? null,
			upstreamJitterMs: e.remoteInbound?.jitter != null ? 1e3 * e.remoteInbound.jitter : null,
			fractionLost: e.remoteInbound?.fractionLost != null ? e.remoteInbound.fractionLost / 256 : null,
			g2gDropRatio: e.glassToGlass?.dropRatio ?? null,
			availableOutgoingKbps: null != e.connection.availableOutgoingBitrate ? e.connection.availableOutgoingBitrate / 1e3 : null,
			fps: e.video?.framesPerSecond ?? null,
			freezeCountDelta: e.video?.freezeCountDelta ?? null,
			qualityLimitationReason: e.outboundVideo?.qualityLimitationReason ?? null,
			isRelayed: i
		}
	}
	var e4 = class {
			size;
			values = [];
			constructor(e) {
				this.size = e
			}
			push(e) {
				null !== e && (this.values.push(e), this.values.length > this.size && this.values.shift())
			}
			median() {
				var e = this.values;
				if (0 === e.length) return null;
				let t = [...e].sort((e, t) => e - t),
					i = Math.floor(t.length / 2);
				return t.length % 2 == 0 ? (t[i - 1] + t[i]) / 2 : t[i]
			}
			min() {
				var e;
				return 0 === (e = this.values).length ? null : Math.min(...e)
			}
			clear() {
				this.values = []
			}
		},
		e7 = class {
			thresholds;
			rtt;
			glassToGlass;
			loss;
			availableOutgoing;
			fps;
			sampleCount = 0;
			currentLevel = null;
			currentFactor = "none";
			candidateLevel = null;
			candidateCount = 0;
			prevWarmingUp = !0;
			lastReport = null;
			constructor(e = H.observability.connectionQuality) {
				this.thresholds = e;
				let t = e.windowSamples;
				this.rtt = new e4(t), this.glassToGlass = new e4(t), this.loss = new e4(t), this.availableOutgoing = new e4(t), this.fps = new e4(t)
			}
			update(e) {
				let t;
				this.sampleCount++;
				let i = e6(e);
				this.rtt.push(i.rttMs), this.glassToGlass.push(i.g2gMs), this.loss.push(i.fractionLost), this.availableOutgoing.push(i.availableOutgoingKbps), this.fps.push(i.fps);
				let r = {
						...i,
						rttMs: this.rtt.median(),
						g2gMs: this.glassToGlass.median(),
						fractionLost: this.loss.median(),
						availableOutgoingKbps: this.availableOutgoing.median(),
						fps: this.fps.min()
					},
					n = this.sampleCount < this.thresholds.warmupSamples,
					{
						quality: a,
						limitingFactor: o
					} = function(e, t, i = {}) {
						let r, n = e.isRelayed ? t.rtt.relayExtraMs : 0,
							a = null != e.g2gMs ? e5(e.g2gMs, t.glassToGlass.goodMs, t.glassToGlass.fairMs, t.glassToGlass.poorMs) : e5(e.rttMs, t.rtt.goodMs + n, t.rtt.fairMs + n, t.rtt.poorMs + n),
							o = e5(e.fractionLost, t.loss.good, t.loss.fair, t.loss.poor),
							s = "good";
						if (!i.skipBitrate) {
							let {
								goodKbps: i,
								fairKbps: r,
								poorKbps: n
							} = t.upstream;
							s = e8(e.availableOutgoingKbps, i, r, n), "bandwidth" === e.qualityLimitationReason && (s = e3(s, "fair"))
						}
						let l = e8(e.fps, t.stall.goodFps, t.stall.fairFps, t.stall.poorFps);
						null != e.freezeCountDelta && e.freezeCountDelta > 0 && (l = e3(l, "fair")), l = e3(l, e5(e.g2gDropRatio, t.g2gDrop.good, t.g2gDrop.fair, t.g2gDrop.poor));
						let c = e3(s, a, o, l);
						return r = "good" === c ? "cpu" === e.qualityLimitationReason ? "cpu" : "none" : s === c ? "bandwidth" : o === c ? "loss" : a === c ? "latency" : "stall", {
							quality: c,
							limitingFactor: r
						}
					}(r, this.thresholds, {
						skipBitrate: n
					}),
					s = this.prevWarmingUp && !n;
				this.prevWarmingUp = n, s ? (t = this.currentLevel !== a, this.currentLevel = a, this.candidateLevel = null, this.candidateCount = 0) : t = this.applyHysteresis(a);
				let l = this.currentLevel ?? a;
				return "good" === l ? this.currentFactor = "cpu" === r.qualityLimitationReason ? "cpu" : "none" : e2[a] <= e2[l] && (this.currentFactor = o), this.lastReport = {
					quality: l,
					limitingFactor: this.currentFactor,
					warmingUp: n,
					metrics: {
						rttMs: r.rttMs,
						g2gMs: r.g2gMs,
						ttffMs: i.ttffMs,
						fps: r.fps,
						packetLoss: r.fractionLost,
						upstreamJitterMs: i.upstreamJitterMs,
						g2gDropRatio: i.g2gDropRatio,
						availableUpstreamKbps: r.availableOutgoingKbps
					}
				}, t || s ? this.lastReport : null
			}
			current() {
				return this.lastReport
			}
			reset() {
				this.rtt.clear(), this.glassToGlass.clear(), this.loss.clear(), this.availableOutgoing.clear(), this.fps.clear(), this.sampleCount = 0, this.currentLevel = null, this.currentFactor = "none", this.candidateLevel = null, this.candidateCount = 0, this.prevWarmingUp = !0, this.lastReport = null
			}
			applyHysteresis(e) {
				if (null === this.currentLevel) return this.currentLevel = e, this.candidateLevel = null, this.candidateCount = 0, !0;
				if (e === this.currentLevel) return this.candidateLevel = null, this.candidateCount = 0, !1;
				e === this.candidateLevel ? this.candidateCount++ : (this.candidateLevel = e, this.candidateCount = 1);
				let t = e2[e] < e2[this.currentLevel] ? this.thresholds.downgradeConsecutive : this.thresholds.upgradeConsecutive;
				return this.candidateCount >= t && (this.currentLevel = e, this.candidateLevel = null, this.candidateCount = 0, !0)
			}
		},
		e9 = class {
			start() {}
			addStats() {}
			addDiagnostic() {}
			flush() {}
			stop() {}
		},
		te = class {
			apiKey;
			sessionId;
			model;
			integration;
			reportIntervalMs;
			intervalId = null;
			statsBuffer = [];
			diagnosticsBuffer = [];
			constructor(e) {
				this.apiKey = e.apiKey, this.sessionId = e.sessionId, this.model = e.model, this.integration = e.integration, this.reportIntervalMs = e.reportIntervalMs ?? H.observability.telemetryReportIntervalMs
			}
			start() {
				null === this.intervalId && (this.intervalId = setInterval(() => this.flush(), this.reportIntervalMs))
			}
			addStats(e) {
				this.statsBuffer.push(e)
			}
			addDiagnostic(e) {
				this.diagnosticsBuffer.push(e)
			}
			flush() {
				this.sendReport()
			}
			stop() {
				null !== this.intervalId && (clearInterval(this.intervalId), this.intervalId = null), this.sendReport({
					keepalive: !0
				})
			}
			createReportChunk() {
				if (0 === this.statsBuffer.length && 0 === this.diagnosticsBuffer.length) return null;
				let e = {
					session_id: this.sessionId,
					sdk_version: x,
					...this.model ? {
						model: this.model
					} : {},
					...this.integration ? {
						integration: this.integration
					} : {}
				};
				return {
					sessionId: this.sessionId,
					timestamp: Date.now(),
					sdkVersion: x,
					...this.model ? {
						model: this.model
					} : {},
					tags: e,
					stats: this.statsBuffer.splice(0, H.observability.telemetryMaxItemsPerReport),
					diagnostics: this.diagnosticsBuffer.splice(0, H.observability.telemetryMaxItemsPerReport)
				}
			}
			sendReport(e = {}) {
				if (0 !== this.statsBuffer.length || 0 !== this.diagnosticsBuffer.length) try {
					let t = {
							...L({
								apiKey: this.apiKey,
								integration: this.integration
							}),
							"Content-Type": "application/json"
						},
						i = [],
						r = this.createReportChunk();
					for (; null !== r;) i.push(r), r = this.createReportChunk();
					i.forEach((r, n) => {
						let a = JSON.stringify(r),
							o = e.keepalive && n === i.length - 1 && new TextEncoder().encode(a).byteLength <= 61440;
						fetch(H.observability.telemetryUrl, {
							method: "POST",
							headers: t,
							body: a,
							...o ? {
								keepalive: !0
							} : {}
						}).catch(() => {})
					})
				} catch {}
			}
		},
		tt = class {
			source = null;
			intervalId = null;
			prevBytesVideo = 0;
			prevBytesAudio = 0;
			prevBytesSentVideo = 0;
			prevTimestamp = 0;
			prevPacketsLostVideo = 0;
			prevFramesDropped = 0;
			prevFreezeCount = 0;
			prevFreezeDuration = 0;
			prevPacketsLostAudio = 0;
			prevNackCountInbound = 0;
			onStats = null;
			intervalMs;
			constructor(e = {}) {
				this.intervalMs = Math.max(e.intervalMs ?? H.observability.statsDefaultIntervalMs, H.observability.statsMinIntervalMs)
			}
			start(e, t) {
				this.stop(), this.source = e, this.onStats = t, this.prevBytesVideo = 0, this.prevBytesAudio = 0, this.prevBytesSentVideo = 0, this.prevTimestamp = 0, this.prevPacketsLostVideo = 0, this.prevFramesDropped = 0, this.prevFreezeCount = 0, this.prevFreezeDuration = 0, this.prevPacketsLostAudio = 0, this.prevNackCountInbound = 0, this.intervalId = setInterval(() => this.collect(), this.intervalMs)
			}
			stop() {
				null !== this.intervalId && (clearInterval(this.intervalId), this.intervalId = null), this.source = null, this.onStats = null
			}
			isRunning() {
				return null !== this.intervalId
			}
			async collect() {
				if (this.source && this.onStats) try {
					let e = await this.source.getStats(),
						t = this.parse(e);
					this.onStats(t)
				} catch {
					this.stop()
				}
			}
			parse(e) {
				let t = performance.now(),
					i = this.prevTimestamp > 0 ? (t - this.prevTimestamp) / 1e3 : 0,
					r = null,
					n = null,
					a = null,
					o = null,
					s = {
						currentRoundTripTime: null,
						availableOutgoingBitrate: null,
						selectedCandidatePairs: []
					},
					l = [];
				if (e.forEach(e => {
						if ("inbound-rtp" === e.type && "video" === e.kind) {
							let t = e.bytesReceived ?? 0,
								n = i > 0 ? (t - this.prevBytesVideo) * 8 / i : 0;
							this.prevBytesVideo = t;
							let a = e.packetsLost ?? 0,
								o = e.framesDropped ?? 0,
								s = e.freezeCount ?? 0,
								l = e.totalFreezesDuration ?? 0,
								c = e.framesDecoded ?? 0,
								u = e.nackCount ?? 0,
								d = e.jitterBufferEmittedCount ?? 0,
								h = e.totalDecodeTime ?? 0,
								p = e.totalProcessingDelay ?? 0,
								m = e.totalInterFrameDelay ?? 0,
								g = e.totalSquaredInterFrameDelay ?? 0,
								f = e.jitterBufferDelay ?? 0,
								y = e.jitterBufferTargetDelay ?? 0,
								b = e.jitterBufferMinimumDelay ?? 0,
								v = c > 0 ? 1e3 * Math.sqrt(Math.max(0, g / c - (m / c) ** 2)) : null;
							r = {
								framesDecoded: c,
								framesDropped: o,
								framesReceived: e.framesReceived ?? 0,
								keyFramesDecoded: e.keyFramesDecoded ?? 0,
								framesPerSecond: e.framesPerSecond ?? 0,
								frameWidth: e.frameWidth ?? 0,
								frameHeight: e.frameHeight ?? 0,
								bytesReceived: t,
								packetsReceived: e.packetsReceived ?? 0,
								packetsLost: a,
								jitter: e.jitter ?? 0,
								bitrate: Math.round(n),
								freezeCount: s,
								totalFreezesDuration: l,
								packetsLostDelta: Math.max(0, a - this.prevPacketsLostVideo),
								framesDroppedDelta: Math.max(0, o - this.prevFramesDropped),
								freezeCountDelta: Math.max(0, s - this.prevFreezeCount),
								freezeDurationDelta: Math.max(0, l - this.prevFreezeDuration),
								nackCount: u,
								nackCountDelta: Math.max(0, u - this.prevNackCountInbound),
								pliCount: e.pliCount ?? 0,
								firCount: e.firCount ?? 0,
								avgDecodeTimeMs: c > 0 ? h / c * 1e3 : null,
								avgJitterBufferMs: d > 0 ? f / d * 1e3 : null,
								avgProcessingDelayMs: c > 0 ? p / c * 1e3 : null,
								avgInterFrameDelayMs: c > 0 ? m / c * 1e3 : null,
								interFrameDelayStdDevMs: v,
								jitterBufferTargetDelayMs: d > 0 ? y / d * 1e3 : null,
								jitterBufferMinimumDelayMs: d > 0 ? b / d * 1e3 : null,
								decoderImplementation: e.decoderImplementation ?? ""
							}, this.prevPacketsLostVideo = a, this.prevFramesDropped = o, this.prevFreezeCount = s, this.prevFreezeDuration = l, this.prevNackCountInbound = u
						}
						if ("outbound-rtp" === e.type && "video" === e.kind) {
							let t = e.bytesSent ?? 0,
								i = e.packetsSent ?? 0,
								r = e.frameWidth ?? 0,
								n = e.frameHeight ?? 0,
								o = r * n,
								s = e.framesEncoded ?? 0,
								l = e.totalEncodeTime ?? 0,
								c = e.totalPacketSendDelay ?? 0,
								u = e.qpSum ?? 0,
								d = e.nackCount ?? 0,
								h = e.pliCount ?? 0,
								p = e.firCount ?? 0,
								m = e.retransmittedBytesSent ?? 0,
								g = e.retransmittedPacketsSent ?? 0,
								f = e.targetBitrate ?? null,
								y = s > 0 ? l / s * 1e3 : null,
								b = i > 0 ? c / i * 1e3 : null,
								v = s > 0 ? u / s : null;
							null === a ? a = {
								qualityLimitationReason: e.qualityLimitationReason ?? "none",
								qualityLimitationDurations: e.qualityLimitationDurations ?? {},
								bytesSent: t,
								packetsSent: i,
								framesPerSecond: e.framesPerSecond ?? 0,
								frameWidth: r,
								frameHeight: n,
								bitrate: 0,
								targetBitrateKbps: null != f ? Math.round(f / 1e3) : null,
								avgEncodeTimeMs: y,
								avgPacketSendDelayMs: b,
								avgQp: v,
								nackCount: d,
								pliCount: h,
								firCount: p,
								retransmittedBytesSent: m,
								retransmittedPacketsSent: g,
								encoderImplementation: e.encoderImplementation ?? ""
							} : (a.bytesSent += t, a.packetsSent += i, a.nackCount += d, a.pliCount += h, a.firCount += p, a.retransmittedBytesSent += m, a.retransmittedPacketsSent += g, o > a.frameWidth * a.frameHeight && (a.frameWidth = r, a.frameHeight = n, a.framesPerSecond = e.framesPerSecond ?? 0, a.qualityLimitationReason = e.qualityLimitationReason ?? "none", a.qualityLimitationDurations = e.qualityLimitationDurations ?? {}, a.targetBitrateKbps = null != f ? Math.round(f / 1e3) : null, a.avgEncodeTimeMs = y, a.avgPacketSendDelayMs = b, a.avgQp = v, a.encoderImplementation = e.encoderImplementation ?? ""))
						}
						if ("remote-inbound-rtp" === e.type && "video" === e.kind && (o = {
								fractionLost: e.fractionLost ?? null,
								jitter: e.jitter ?? null,
								roundTripTime: e.roundTripTime ?? null
							}), "inbound-rtp" === e.type && "audio" === e.kind) {
							let t = e.bytesReceived ?? 0,
								r = i > 0 ? (t - this.prevBytesAudio) * 8 / i : 0;
							this.prevBytesAudio = t;
							let a = e.packetsLost ?? 0;
							n = {
								bytesReceived: t,
								packetsReceived: e.packetsReceived ?? 0,
								packetsLost: a,
								jitter: e.jitter ?? 0,
								bitrate: Math.round(r),
								packetsLostDelta: Math.max(0, a - this.prevPacketsLostAudio)
							}, this.prevPacketsLostAudio = a
						}
						if ("candidate-pair" === e.type && "succeeded" === e.state) {
							s.currentRoundTripTime = e.currentRoundTripTime ?? null, s.availableOutgoingBitrate = e.availableOutgoingBitrate ?? null;
							let t = e.localCandidateId,
								i = e.remoteCandidateId;
							t && i && l.push({
								localId: t,
								remoteId: i
							})
						}
					}), l.length > 0) {
					let t = t => {
						let i = e.get(t);
						return i ? {
							candidateType: i.candidateType ?? "",
							address: i.address ?? i.ip ?? "",
							port: i.port ?? 0,
							protocol: i.protocol ?? ""
						} : null
					};
					for (let {
							localId: e,
							remoteId: i
						}
						of l) {
						let r = t(e),
							n = t(i);
						r && n && s.selectedCandidatePairs.push({
							local: r,
							remote: n
						})
					}
				}
				let c = a;
				if (null !== c) {
					let e = i > 0 ? (c.bytesSent - this.prevBytesSentVideo) * 8 / i : 0;
					c.bitrate = Math.max(0, Math.round(e)), this.prevBytesSentVideo = c.bytesSent
				}
				return this.prevTimestamp = t, {
					timestamp: Date.now(),
					video: r,
					audio: n,
					outboundVideo: a,
					connection: s,
					remoteInbound: o,
					glassToGlass: null
				}
			}
		},
		ti = class {
			options;
			telemetryReporter = new e9;
			telemetryReporterReady = !1;
			pendingTelemetryDiagnostics = [];
			statsCollector = null;
			statsCollectorSource = null;
			liveKitRoom = null;
			videoStalled = !1;
			stallStartMs = 0;
			connectionBreakdown = null;
			connectionQuality = new e7;
			glassToGlass;
			constructor(e) {
				this.options = e, this.glassToGlass = e.glassToGlass
			}
			attachRemoteVideoTrack(e) {
				this.glassToGlass?.attachRemoteVideoTrack(e)
			}
			markGlassToGlassStart() {
				this.glassToGlass?.markStart()
			}
			diagnostic(e, t, i = Date.now()) {
				this.options.logger.debug(e, t), this.options.onDiagnostic?.({
					name: e,
					data: t
				}), this.addTelemetryDiagnostic(e, t, i)
			}
			beginConnectionBreakdown(e, t) {
				this.connectionBreakdown = {
					attempt: e,
					connectStartedAt: Date.now(),
					initialImageSizeKb: t,
					phases: new Map
				}
			}
			startPhase(e) {
				this.connectionBreakdown && this.connectionBreakdown.phases.set(e, {
					startedAt: Date.now()
				})
			}
			endPhase(e, t) {
				if (!this.connectionBreakdown) return;
				let i = this.connectionBreakdown.phases.get(e);
				i ? (i.endedAt = Date.now(), i.success = t.success, void 0 !== t.error && (i.error = t.error)) : this.options.logger.warn("observability: endPhase called for unknown phase", {
					phase: e
				})
			}
			finishConnectionBreakdown(e) {
				let t = this.connectionBreakdown;
				if (!t) return;
				this.connectionBreakdown = null;
				let i = Date.now(),
					r = [];
				for (let [n, a] of t.phases) {
					let t = void 0 === a.endedAt,
						o = a.endedAt ?? i,
						s = a.success ?? !1,
						l = a.error ?? (t && !e.success ? e.error : void 0);
					r.push({
						phase: n,
						durationMs: o - a.startedAt,
						success: s,
						...void 0 !== l ? {
							error: l
						} : {}
					})
				}
				this.diagnostic("client-session-connection-breakdown", {
					attempt: t.attempt,
					success: e.success,
					totalDurationMs: i - t.connectStartedAt,
					initialImageSizeKb: t.initialImageSizeKb,
					phases: r,
					...void 0 !== e.error ? {
						error: e.error
					} : {}
				}, i)
			}
			sessionStarted(e, t = this.options.apiKey) {
				if (!this.options.telemetryEnabled) return;
				this.telemetryReporterReady && this.telemetryReporter.stop();
				let i = new te({
					apiKey: t,
					sessionId: e,
					model: this.options.model,
					integration: this.options.integration,
					logger: this.options.logger
				});
				for (let e of (i.start(), this.telemetryReporter = i, this.telemetryReporterReady = !0, this.pendingTelemetryDiagnostics)) this.telemetryReporter.addDiagnostic(e);
				this.pendingTelemetryDiagnostics.length = 0
			}
			setStatsProvider(e) {
				e ? e === this.statsCollectorSource || (this.stopStats(), this.resetStallDetection(), this.statsCollectorSource = e, (this.options.telemetryEnabled || this.options.onStats || this.options.onConnectionQuality) && (this.statsCollector = new tt, this.statsCollector.start(e, e => this.handleStats(e)))) : this.stopStats()
			}
			setLiveKitRoom(e) {
				if (!e) {
					this.liveKitRoom = null, this.setStatsProvider(null);
					return
				}
				if (e !== this.liveKitRoom) {
					let t, i;
					this.setStatsProvider((t = 0, i = async (e, i) => {
						let r;
						if (e) {
							try {
								r = await e.getRTCStatsReport()
							} catch {
								return
							}
							r && r.forEach((e, r) => {
								i.push([`${r}#${t++}`, e])
							})
						}
					}, {
						async getStats() {
							let t = [];
							for (let r of e.localParticipant.trackPublications.values()) await i(r.track, t);
							for (let r of e.remoteParticipants.values())
								for (let e of r.trackPublications.values()) await i(e.track, t);
							return new Map(t)
						}
					})), this.liveKitRoom = e
				}
			}
			stopStats() {
				this.statsCollector?.stop(), this.statsCollector = null, this.statsCollectorSource = null, this.liveKitRoom = null, this.resetStallDetection()
			}
			stop() {
				this.stopStats(), this.glassToGlass?.dispose(), this.telemetryReporter.stop(), this.telemetryReporter = new e9, this.telemetryReporterReady = !1, this.pendingTelemetryDiagnostics.length = 0, this.connectionBreakdown = null
			}
			getConnectionQuality() {
				return this.connectionQuality.current()
			}
			handleStats(e) {
				this.glassToGlass && (e.glassToGlass = this.glassToGlass.snapshot()), this.options.onStats?.(e), this.telemetryReporter.addStats(e), this.detectVideoStall(e);
				let t = this.connectionQuality.update(e);
				t && this.options.onConnectionQuality?.(t)
			}
			detectVideoStall(e) {
				let t = e.video?.framesPerSecond ?? 0;
				if (!this.videoStalled && e.video && t < H.observability.stallFpsThreshold) this.videoStalled = !0, this.stallStartMs = Date.now(), this.diagnostic("videoStall", {
					stalled: !0,
					durationMs: 0
				}, this.stallStartMs);
				else if (this.videoStalled && t >= H.observability.stallFpsThreshold) {
					let e = Date.now() - this.stallStartMs;
					this.videoStalled = !1, this.diagnostic("videoStall", {
						stalled: !1,
						durationMs: e
					})
				}
			}
			addTelemetryDiagnostic(e, t, i) {
				if (!this.options.telemetryEnabled) return;
				let r = {
					name: e,
					data: t,
					timestamp: i
				};
				this.telemetryReporterReady ? this.telemetryReporter.addDiagnostic(r) : this.pendingTelemetryDiagnostics.push(r)
			}
			resetStallDetection() {
				this.videoStalled = !1, this.stallStartMs = 0, this.connectionQuality.reset()
			}
		};

	function tr(e) {
		let t = e ? `: ${e}` : "";
		return l(s, `This realtime stream requires LiveKit frame metadata, which this SDK environment does not support${t}.`, {
			feature: "LiveKit frame metadata subscribe",
			platform: "this SDK environment"
		})
	}

	function tn(e) {
		switch (e) {
			case "connecting":
				return "connecting";
			case "connected":
				return "connected";
			case "reconnecting":
			case "signalReconnecting":
				return "reconnecting";
			default:
				return "disconnected"
		}
	}

	function ta(e, t) {
		let i = (e?.getTracks() ?? []).filter(e => "ended" !== e.readyState);
		return i.includes(t) || i.push(t), new MediaStream(i)
	}
	async function to(e) {
		if (!/^https?:\/\//i.test(e.baseUrl)) throw Error(`watch-stream baseUrl must use http(s); got ${e.baseUrl}`);
		let t = `${e.baseUrl}/watch-stream/${encodeURIComponent(e.roomName)}`,
			i = await fetch(t, {
				method: "POST",
				headers: {
					"x-api-key": e.apiKey,
					"content-type": "application/json"
				}
			});
		if (!i.ok) {
			let e = await i.text().catch(() => "");
			throw Error(`watch-stream request failed (${i.status}): ${e||i.statusText}`)
		}
		let r = await i.json();
		if (!r.livekit_url || !r.token || !r.room_name) throw Error("watch-stream response missing required fields");
		return {
			livekit_url: r.livekit_url,
			token: r.token,
			room_name: r.room_name
		}
	}
	var ts = class {
		latencies = [];
		startMs = null;
		firstFrameMs = null;
		ttffMs = null;
		markStart(e) {
			this.reset(), this.startMs = e
		}
		recordFrame(e, t) {
			if (e <= 0n) return;
			let i = t - Number(e) / 1e3;
			!Number.isFinite(i) || i < 0 || i > 6e4 || (null === this.firstFrameMs && (this.firstFrameMs = t, null !== this.startMs && (this.ttffMs = Math.round(t - this.startMs))), !(t < this.firstFrameMs + 2e3) && (this.latencies.push(i), this.latencies.length > 300 && this.latencies.shift()))
		}
		snapshot() {
			let e = [...this.latencies].sort((e, t) => e - t),
				t = e.length,
				i = 0 === t ? null : t % 2 == 0 ? Math.round((e[t / 2 - 1] + e[t / 2]) / 2) : Math.round(e[(t - 1) / 2]),
				r = 0 === t ? null : Math.round(e[Math.min(t - 1, Math.floor(.9 * t))]);
			return {
				ttffMs: this.ttffMs,
				medianMs: i,
				p90Ms: r,
				sampleCount: t,
				dropRatio: null
			}
		}
		reset() {
			this.latencies.length = 0, this.startMs = null, this.firstFrameMs = null, this.ttffMs = null
		}
	};
	let tl = "timeSyncUpdate";

	function tc() {
		return e.r(873384)(Worker)
	}

	function tu() {
		if ("u" < typeof window) return !1;
		try {
			var t, i;
			if (t = new e.U(e.r(473368)), i = window.location?.origin, ("http:" === t.protocol || "https:" === t.protocol) && t.origin !== i) return !1
		} catch {
			return !1
		}
		let r = window,
			n = window.navigator?.userAgent?.toLowerCase() ?? "",
			a = /(?:chrome|chromium|crmo)\//.test(n) && !/crios\//.test(n),
			o = void 0 !== r.RTCRtpScriptTransform && !a,
			s = void 0 !== r.RTCRtpSender?.prototype?.createEncodedStreams && void 0 !== r.RTCRtpReceiver?.prototype?.createEncodedStreams;
		return o || s
	}

	function td() {
		return globalThis.performance?.now?.() ?? Date.now()
	}
	async function th(e, t, i, r) {
		if (i?.aborted) return {
			transport: "failed",
			rttMs: null
		};
		let n = globalThis?.RTCPeerConnection;
		if ("function" != typeof n) return r.warn("preflight: RTCPeerConnection unavailable in this environment"), {
			transport: "failed",
			rttMs: null
		};
		let a = null;
		try {
			(a = new n({
				iceServers: e
			})).createDataChannel("decart-preflight");
			let o = !1,
				s = !1,
				l = null,
				c = td();
			await new Promise(e => {
				let n, c = !1,
					u = () => {
						c || (c = !0, clearTimeout(n), i?.removeEventListener("abort", u), e())
					};
				n = setTimeout(u, t), i?.addEventListener("abort", u, {
					once: !0
				}), i?.aborted && u();
				let d = a;
				d.onicecandidate = e => {
					var t;
					if (!e.candidate || "" === e.candidate.candidate) return u();
					"srflx" === ((t = e.candidate).type ? t.type : /\btyp (\w+)/.exec(t.candidate)?.[1] ?? "") ? (o = !0, null === l && (l = td())) : s = !0
				}, d.onicegatheringstatechange = () => {
					"complete" === d.iceGatheringState && u()
				}, d.createOffer().then(e => d.setLocalDescription(e)).catch(e => {
					r.warn("preflight: failed to create offer", {
						error: e instanceof Error ? e.message : String(e)
					}), u()
				})
			});
			let u = null !== l ? Math.round(l - c) : null;
			return {
				transport: o ? "udp" : s ? "relay" : "failed",
				rttMs: u
			}
		} catch (e) {
			return r.warn("preflight: connectivity probe threw", {
				error: e instanceof Error ? e.message : String(e)
			}), {
				transport: "failed",
				rttMs: null
			}
		} finally {
			try {
				a?.close()
			} catch {}
		}
	}

	function tp(e, t) {
		let i = [];
		if ("failed" === e.transport) return {
			quality: "critical",
			metrics: e,
			reasons: ["Could not establish a realtime session for the deep probe."]
		};
		let r = [];
		if (null != e.ttffMs) {
			let n = t.ttff,
				a = e5(e.ttffMs, n.goodMs, n.fairMs, n.poorMs);
			r.push(a), "good" !== a && i.push(`Time to first frame is ~${(e.ttffMs/1e3).toFixed(1)}s (good ≤ ${(n.goodMs/1e3).toFixed(0)}s); the session is slow to start.`)
		}
		if (null != e.g2gMs) {
			let n = t.glassToGlass,
				a = e5(e.g2gMs, n.goodMs, n.fairMs, n.poorMs);
			r.push(a), "good" !== a && i.push(`Mid-stream glass-to-glass latency is ~${e.g2gMs}ms (good ≤ ${n.goodMs}ms); the real-time experience may feel laggy.`)
		}
		if (null == e.ttffMs && null == e.g2gMs && (null != e.rttMs ? (i.push("Could not measure glass-to-glass latency during the probe (no frame metadata); using network RTT instead."), r.push(e5(e.rttMs, t.rtt.goodMs, t.rtt.fairMs, t.rtt.poorMs))) : i.push("The probe connected but could not measure latency (no frame metadata and no RTT sample).")), null != e.g2gDropRatio) {
			let n = t.g2gDrop,
				a = e5(e.g2gDropRatio, n.good, n.fair, n.poor);
			r.push(a), "good" !== a && i.push(`End-to-end frame drop ratio is ${(100*e.g2gDropRatio).toFixed(1)}% (good ≤ ${100*n.good}%).`)
		}
		if (null != e.packetLoss) {
			let n = t.loss,
				a = e5(e.packetLoss, n.good, n.fair, n.poor);
			r.push(a), "good" !== a && i.push(`Upstream packet loss is ${(100*e.packetLoss).toFixed(1)}% (good ≤ ${100*n.good}%).`)
		}
		return 0 === r.length ? {
			quality: "fair",
			metrics: e,
			reasons: i
		} : {
			quality: e3(...r),
			metrics: e,
			reasons: i
		}
	}
	let tm = {
		quality: "fair",
		metrics: {
			transport: "failed",
			rttMs: null,
			g2gMs: null,
			ttffMs: null,
			g2gDropRatio: null,
			upstreamJitterMs: null,
			packetLoss: null,
			sampleCount: 0
		},
		reasons: ["Deep connectivity probe aborted."]
	};

	function tg() {
		let e = globalThis.DOMException;
		if ("function" == typeof e) return new e("Aborted", "AbortError");
		let t = Error("Aborted");
		return t.name = "AbortError", t
	}
	async function tf(e) {
		let t, i, {
				connect: r,
				logger: n,
				model: a,
				durationMs: o,
				signal: s
			} = e,
			l = H.observability.connectionQuality,
			c = null;
		if (s?.aborted) return tm;
		try {
			var u, d;
			t = function(e, t, i) {
				if ("u" < typeof document) throw Error("deep connectivity probe requires a DOM environment (document is undefined)");
				let r = document.createElement("canvas");
				r.width = e, r.height = t;
				let n = r.getContext("2d");
				if (!n) throw Error("deep connectivity probe: 2D canvas context unavailable");
				if ("function" != typeof r.captureStream) throw Error("deep connectivity probe: canvas.captureStream unavailable");
				let a = null,
					o = 0,
					s = () => {
						o++, n.fillStyle = `hsl(${o%360}, 60%, 50%)`, n.fillRect(0, 0, r.width, r.height), n.fillStyle = "white", n.fillRect(7 * o % r.width, 48, 96, 96), a = requestAnimationFrame(s)
					};
				a = requestAnimationFrame(s);
				let l = r.captureStream(i);
				return {
					stream: l,
					dispose: () => {
						for (let e of (null !== a && cancelAnimationFrame(a), l.getTracks())) e.stop()
					}
				}
			}(a.width, a.height, eP(a.fps));
			let e = r(t.stream, {
				model: a,
				onRemoteStream: () => {}
			});
			if (s?.addEventListener("abort", () => e.then(e => e.disconnect()).catch(() => {}), {
					once: !0
				}), (i = await
					function(e, t) {
						if (!t) return e;
						if (t.aborted) throw t.reason ?? tg();
						return Promise.race([e, new Promise((e, i) => {
							t.addEventListener("abort", () => i(t.reason ?? tg()), {
								once: !0
							})
						})])
					}(e, s)).on("stats", e => {
					c = e
				}), await (u = () => c, d = H.preflight.active.minSamples, new Promise(e => {
					let t = performance.now(),
						i = () => {
							if (s?.aborted || (u()?.glassToGlass?.sampleCount ?? 0) >= d || performance.now() - t >= o) return e();
							setTimeout(i, 200)
						};
					setTimeout(i, 200)
				})), s?.aborted) return tm
		} catch (e) {
			if (s?.aborted) return tm;
			return n.warn("deep connectivity probe failed", {
				error: e instanceof Error ? e.message : String(e)
			}), tp({
				transport: "failed",
				rttMs: null,
				g2gMs: null,
				g2gDropRatio: null,
				upstreamJitterMs: null,
				packetLoss: null,
				sampleCount: 0
			}, l)
		} finally {
			i?.disconnect(), t?.dispose()
		}
		return tp(function(e) {
			if (!e) return {
				transport: "udp",
				rttMs: null,
				g2gMs: null,
				ttffMs: null,
				g2gDropRatio: null,
				upstreamJitterMs: null,
				packetLoss: null,
				sampleCount: 0
			};
			let t = e6(e);
			return {
				transport: t.isRelayed ? "relay" : "udp",
				rttMs: null != t.rttMs ? Math.round(t.rttMs) : null,
				g2gMs: t.g2gMs,
				ttffMs: t.ttffMs,
				g2gDropRatio: t.g2gDropRatio,
				upstreamJitterMs: null != t.upstreamJitterMs ? Math.round(t.upstreamJitterMs) : null,
				packetLoss: t.fractionLost,
				sampleCount: e.glassToGlass?.sampleCount ?? 0
			}
		}(c), l)
	}
	let ty = H.preflight.defaultStunUrls.map(e => ({
			urls: e
		})),
		tb = "x-google-start-bitrate";

	function tv(e) {
		return (e ?? H.livekit.defaultVideoCodec) !== "vp9"
	}
	var tw = class {
		config;
		room = null;
		cameraTrackSource = null;
		remoteStream = null;
		frameMetadataEnabled = !1;
		events = ez();
		logger;
		constructor(e) {
			this.config = e, this.logger = e.logger ?? E("warn")
		}
		get localStream() {
			return this.config.localStream
		}
		on(e, t) {
			this.events.on(e, t)
		}
		off(e, t) {
			this.events.off(e, t)
		}
		async connect(e) {
			let {
				Room: t,
				RoomEvent: i,
				Track: r
			} = await e1();
			if (this.cameraTrackSource = r.Source.Camera, !this.room) {
				let e;
				if (this.config.createFrameMetadataWorker) try {
					e = this.config.createFrameMetadataWorker()
				} catch (t) {
					let e = t instanceof Error ? t.message : String(t);
					throw this.logger.warn("Failed to create LiveKit frame-metadata worker", {
						error: e
					}), Error(`Failed to create LiveKit frame-metadata worker: ${e}`, {
						cause: t
					})
				}
				this.frameMetadataEnabled = void 0 !== e;
				try {
					this.room = new t({
						...H.livekit.roomOptions,
						...e ? {
							frameMetadata: {
								worker: e
							}
						} : {}
					})
				} catch (t) {
					throw e?.terminate(), this.frameMetadataEnabled = !1, t
				}
			}
			let n = this.room,
				a = this.wantsRemoteAudio(),
				o = e => e.identity.startsWith(H.livekit.inferenceServerIdentityPrefix),
				s = (e, t) => {
					o(t) && ("video" === e.kind || "audio" === e.kind && a) && e.setSubscribed(!0)
				},
				l = () => {
					for (let e of n.remoteParticipants.values())
						for (let t of e.trackPublications.values()) s(t, e)
				};
			n.on(i.TrackPublished, s), n.on(i.Reconnected, l), n.on(i.TrackSubscribed, (e, t, i) => {
				if (!o(i) || "video" !== e.kind && !("audio" === e.kind && a)) return;
				let r = e.mediaStreamTrack;
				if (r) {
					"video" === e.kind && this.config.observability?.attachRemoteVideoTrack(e);
					let t = this.remoteStream?.getTracks() ?? [];
					t.includes(r) || t.push(r), this.remoteStream = new MediaStream(t), this.events.emit("remoteStream", this.remoteStream)
				}
			}), n.on(i.Disconnected, e => {
				this.logger.warn("livekit: room disconnected", {
					reason: e
				}), this.events.emit("disconnected", {
					reason: e
				})
			}), this.config.observability?.startPhase("webrtc-handshake"), await n.connect(e.url, e.token, {
				autoSubscribe: !1
			}), this.config.observability?.endPhase("webrtc-handshake", {
				success: !0
			}), l(), this.seedStartBitrate(n), this.config.observability?.setLiveKitRoom(n)
		}
		async publishLocalTracks() {
			this.config.localStream && (this.config.observability?.startPhase("publish-local-track"), await this.publishTracks(this.config.localStream), this.config.observability?.endPhase("publish-local-track", {
				success: !0
			}))
		}
		async replaceVideoTrack(e) {
			let t = this.room;
			if (!t) throw Error("Cannot replace video track: media channel is not connected");
			let i = [...t.localParticipant.videoTrackPublications.values()][0]?.videoTrack;
			if (!i) throw Error("Cannot replace video track: no published video track");
			await i.replaceTrack(e)
		}
		disconnect() {
			let e = this.room;
			this.room = null, this.cameraTrackSource = null, this.remoteStream = null, this.frameMetadataEnabled = !1, this.config.observability?.setLiveKitRoom(null), e && e.disconnect().catch(() => {})
		}
		wantsRemoteAudio() {
			return (this.config.localStream?.getAudioTracks().length ?? 0) > 0
		}
		seedStartBitrate(e) {
			let t = e.engine?.pcManager?.publisher,
				i = t?.setRemoteDescription;
			if (!t || "function" != typeof i) return;
			let r = function(e) {
				let {
					minVideoBitrateBps: t,
					simulcastLowerLayersBitrateBps: i,
					bweVideoShare: r
				} = H.livekit;
				return Math.round((t + (tv(e) ? i : 0)) / r / 1e3)
			}(this.config.videoCodec);
			t.setRemoteDescription = (e, n) => {
				var a;
				let o;
				return i.call(t, "answer" === e.type && e.sdp ? {
					type: e.type,
					sdp: (a = e.sdp, o = `${tb}=${r}`, a.split(/(?=^m=)/m).map(e => {
						if (!e.startsWith("m=video")) return e;
						let t = new Set(Array.from(e.matchAll(/^a=fmtp:(\d+) /gm), e => e[1]));
						return e.replace(/^a=fmtp:\d+ [^\r\n]*/gm, e => e.includes(tb) ? e : `${e};${o}`).replace(/^a=rtpmap:(\d+) (?!rtx|red|ulpfec|flexfec)[^\r\n]*(\r?\n)/gim, (e, i, r) => t.has(i) ? e : `${e}a=fmtp:${i} ${o}${r}`)
					}).join(""))
				} : e, n)
			}
		}
		async publishTracks(e) {
			if (this.room)
				for (let t of e.getTracks())
					if ("video" === t.kind) {
						if (!this.cameraTrackSource) throw Error("Cannot publish video track: media channel is not connected");
						await this.room.localParticipant.publishTrack(t, function(e, t, i = !1) {
							let r = t ?? H.livekit.defaultVideoCodec,
								n = "vp9" === r ? H.livekit.vp9MaxVideoBitrateBps : H.livekit.defaultMaxVideoBitrateBps;
							return {
								source: e,
								videoCodec: r,
								simulcast: tv(r),
								videoEncoding: {
									maxBitrate: n,
									maxFramerate: H.livekit.defaultPublishFps
								},
								...i ? {
									frameMetadata: {
										timestamp: !0
									}
								} : {}
							}
						}(this.cameraTrackSource, this.config.videoCodec, this.frameMetadataEnabled))
					} else await this.room.localParticipant.publishTrack(t)
		}
	};
	let tk = ({
			stream: e,
			mirror: t,
			preferredVideoCodec: i,
			fps: r,
			logger: n,
			observability: a
		}) => {
			var o, s;
			let l, c, u, d, h, p, m, g, f, y, b = e ?? new MediaStream,
				v = () => {};
			if (!1 !== t) try {
				let e = b.getVideoTracks?.()[0];
				if (e && (!0 === t || function(e) {
						let t;
						if ("video" !== e.kind) return !1;
						try {
							t = e.getSettings?.().facingMode
						} catch {
							return !1
						}
						return "user" === t
					}(e))) {
					let e = (o = b, s = {
						fps: r
					}, function(e, t) {
						let [i] = e.getVideoTracks(), r = e.getAudioTracks();
						return i ? "u" > typeof globalThis && "function" == typeof globalThis.MediaStreamTrackProcessor && "function" == typeof globalThis.MediaStreamTrackGenerator ? function(e, t, i) {
							let r = globalThis.MediaStreamTrackProcessor,
								n = globalThis.MediaStreamTrackGenerator;
							if (!new OffscreenCanvas(1, 1).getContext("2d")) throw Error("createFrameTransformPump: OffscreenCanvas 2D context unavailable");
							let a = new r({
									track: e
								}),
								o = new n({
									kind: "video"
								}),
								s = new OffscreenCanvas(1, 1),
								l = s.getContext("2d"),
								c = new TransformStream({
									transform(e, t) {
										let r, n = e.displayWidth,
											a = e.displayHeight;
										(s.width !== n || s.height !== a) && (l = (s = new OffscreenCanvas(n, a)).getContext("2d"));
										try {
											i(l, e, n, a), r = new VideoFrame(s, {
												timestamp: e.timestamp,
												alpha: "discard"
											}), t.enqueue(r), r = void 0
										} finally {
											r?.close(), e.close()
										}
									}
								});
							a.readable.pipeThrough(c).pipeTo(o.writable).catch(() => {});
							let u = !1;
							return {
								stream: new MediaStream([o, ...t]),
								impl: "track-processor",
								dispose: () => {
									u || (u = !0, o.stop())
								}
							}
						}(i, r, t.transform) : function(e, t, i, r) {
							if ("u" < typeof document) throw Error("createFrameTransformPump requires a DOM environment (document is undefined)");
							let n = document.createElement("canvas"),
								a = n.getContext("2d");
							if (!a) throw Error("createFrameTransformPump: 2D canvas context unavailable");
							if ("function" != typeof n.captureStream) throw Error("createFrameTransformPump: canvas.captureStream unavailable");
							let [o] = n.captureStream(i).getVideoTracks();
							if (!o) throw Error("createFrameTransformPump: canvas.captureStream produced no video track");
							let s = document.createElement("video");
							s.muted = !0, s.playsInline = !0, s.autoplay = !0, s.srcObject = new MediaStream([e]);
							let l = !1,
								c = null,
								u = () => {
									if (l) return;
									let e = s.videoWidth,
										t = s.videoHeight;
									e > 0 && t > 0 && (n.width !== e && (n.width = e), n.height !== t && (n.height = t), r(a, s, e, t)), c = requestAnimationFrame(u)
								};
							return s.play().catch(() => {}), c = requestAnimationFrame(u), {
								stream: new MediaStream([o, ...t]),
								impl: "canvas",
								dispose: () => {
									l || (l = !0, null !== c && cancelAnimationFrame(c), o.stop(), s.srcObject = null)
								}
							}
						}(i, r, t.fps, t.transform) : {
							stream: e,
							dispose: () => {},
							impl: "noop"
						}
					}(o, {
						fps: s.fps,
						transform: (e, t, i, r) => {
							e.save(), e.setTransform(-1, 0, 0, 1, i, 0), e.drawImage(t, 0, 0, i, r), e.restore()
						}
					}));
					b = e.stream, v = e.dispose
				} else !0 !== t || e || n.warn("mirror: true requested but no video track was found on the input stream")
			} catch (e) {
				n.warn("Failed to mirror input stream; falling back to un-mirrored input", {
					error: e instanceof Error ? e.message : String(e)
				})
			}
			if (tu()) try {
				y = tc()
			} catch (e) {
				n.debug("Frame-metadata worker unavailable; glass-to-glass latency measurement disabled", {
					error: e instanceof Error ? e.message : String(e)
				})
			} else n.debug("Frame-metadata runtime unavailable; glass-to-glass latency measurement disabled");
			let w = void 0 !== y,
				k = () => {
					if (y) {
						let e = y;
						return y = void 0, e
					}
					return tc()
				},
				S = new ti({
					...a,
					glassToGlass: w ? (l = new ts, c = null, u = ({
						timestamp: e,
						rtpTimestamp: t
					}) => {
						let i = c?.lookupFrameMetadata?.({
							rtpTimestamp: t
						});
						i && l.recordFrame(i.userTimestamp, e)
					}, h = {
						attach: e => {
							e !== c && (d(), c = e, e.on(tl, u))
						},
						detach: d = () => {
							c?.off(tl, u), c = null
						},
						dispose: d
					}, {
						attachRemoteVideoTrack: e => h.attach(e),
						markStart: () => {
							h.detach(), l.markStart(performance.timeOrigin + performance.now())
						},
						snapshot: () => l.snapshot(),
						dispose: () => h.dispose()
					}) : void 0
				}),
				T = (p = globalThis, m = p?.navigator?.userAgent ?? "", g = p?.navigator?.platform ?? "", f = p?.navigator?.maxTouchPoints ?? 0, !/^((?!chrome|chromium|crios|fxios|edg|firefox|opr|opera|android).)*safari/i.test(m) || /iPad|iPhone|iPod/.test(m) || "MacIntel" === g && f > 1 || 0) ? void 0 : "vp8";
			return {
				stream: b,
				observability: S,
				frameTiming: w,
				videoCodec: T ?? i,
				queryParams: {
					...T ? {
						livekit_server_codec: T
					} : {}
				},
				createMediaChannel: e => new tw({
					...e,
					createFrameMetadataWorker: w ? k : void 0
				}),
				dispose: () => {
					v(), y?.terminate()
				}
			}
		},
		tS = e => {
			let t = (e => {
					let {
						baseUrl: t,
						integration: i
					} = e, r = e.logger ?? E("info"), n = X({
						apiKey: e.apiKey,
						apiKeyProvider: e.apiKeyProvider
					});
					return {
						connect: async (a, o) => {
							let s, l, c, d = eZ.safeParse(o);
							if (!d.success) throw d.error;
							let {
								onRemoteStream: h,
								onConnectionChange: p,
								onConnectionQuality: g,
								onQueuePosition: f,
								onCapacityWait: y,
								initialState: b,
								queryParams: v,
								resolution: w,
								speed: k,
								retries: S,
								capacityRetryBudgetMs: T,
								preferredVideoCodec: R
							} = d.data, P = d.data.mirror ?? !1;
							try {
								let u = eD(b?.image) ? b.image : void 0,
									[d, M] = await Promise.all([n(), void 0 === u && b?.image ? eU(b.image) : void 0]),
									E = b?.prompt ? {
										text: b.prompt.text,
										enhance: b.prompt.enhance
									} : void 0,
									C = `${t}${o.model.urlPath}`,
									{
										emitter: I,
										emitOrBuffer: D,
										flush: x,
										stop: A
									} = e_();
								l = (c = e.prepareConnection({
									stream: a,
									mirror: P,
									preferredVideoCodec: R,
									fps: eP(o.model.fps),
									logger: r,
									observability: {
										telemetryEnabled: e.telemetryEnabled,
										apiKey: d,
										model: o.model.name,
										integration: i,
										logger: r,
										onDiagnostic: e => D("diagnostic", e),
										onStats: e => D("stats", e),
										onConnectionQuality: e => {
											D("connectionQuality", e), g?.(e)
										}
									}
								})).observability, k && !o.model.supportedSpeeds?.includes(k) && r.warn("realtime: model does not support the requested speed tier; the server serves it at standard speed", {
									model: o.model.name,
									speed: k,
									supportedSpeeds: o.model.supportedSpeeds ?? []
								});
								let U = c.queryParams,
									z = o.model.name,
									_ = d,
									L = e => {
										_ = e;
										let t = new URLSearchParams({
											...U,
											...v,
											api_key: e,
											model: z,
											...w ? {
												resolution: w
											} : {},
											...k ? {
												speed: k
											} : {}
										});
										return `${C}?${t.toString()}`
									};
								s = new eY({
									url: L(d),
									redialUrl: () => {
										let e = n();
										return "string" == typeof e ? L(e) : e.then(L)
									},
									integration: i,
									observability: l,
									frameTiming: c.frameTiming,
									localStream: c.stream,
									initialImage: M,
									initialImageRef: u,
									initialPrompt: E,
									initialPassthrough: b?.passthrough,
									connectRetries: S,
									capacityRetryBudgetMs: T,
									logger: r,
									videoCodec: c.videoCodec,
									createMediaChannel: c.createMediaChannel
								});
								let j = null,
									F = null;
								s.on("remoteStream", h), s.on("connectionChange", e => {
									D("connectionChange", e), p?.(e)
								}), s.on("queuePosition", e => {
									D("queuePosition", e), f?.(e)
								}), s.on("capacityWait", e => y?.(e)), s.on("sessionStarted", ({
									sessionId: e,
									subscribeToken: t
								}) => {
									j = e, F = t, l?.sessionStarted(e, _)
								}), s.on("generationTick", e => D("generationTick", e)), s.on("generationEnded", e => D("generationEnded", e)), s.on("sessionEnded", e => D("sessionEnded", e)), s.on("error", e => {
									r.error("Realtime error", {
										error: e.message
									}), D("error", m(e))
								});
								let $ = s;
								await $.connect();
								let O = {
									...{
										set: async e => {
											let t = ej.safeParse(e);
											if (!t.success) throw t.error;
											let {
												prompt: i,
												enhance: r,
												image: n
											} = t.data, a = {
												prompt: i,
												enhance: r,
												timeout: H.methods.updateTimeoutMs
											};
											if (eD(n)) return void await $.setImage({
												kind: "ref",
												ref: n
											}, a);
											let o = null != n ? await eU(n) : null;
											await $.setImage({
												kind: "data",
												data: o
											}, a)
										},
										setPrompt: async (e, {
											enhance: t
										} = {}) => {
											let i = eF.safeParse({
												prompt: e,
												enhance: t
											});
											if (!i.success) throw i.error;
											await $.sendPrompt(i.data.prompt, {
												enhance: i.data.enhance,
												timeout: H.methods.promptTimeoutMs
											})
										},
										replaceVideoTrack: async e => {
											await $.replaceVideoTrack(e)
										}
									},
									isConnected: () => $.isConnected(),
									getConnectionState: () => $.getConnectionState(),
									getConnectionQuality: () => l?.getConnectionQuality() ?? null,
									disconnect: () => {
										l?.stop(), A(), $.disconnect(), c?.dispose()
									},
									on: I.on,
									off: I.off,
									get sessionId() {
										return j
									},
									get subscribeToken() {
										return F
									},
									getSubscribeToken: () => F,
									setImage: async (e, t) => {
										if (eD(e)) return $.setImage({
											kind: "ref",
											ref: e
										}, t);
										if (null === e) return $.setImage({
											kind: "data",
											data: null
										}, t);
										let i = await eU(e);
										return $.setImage({
											kind: "data",
											data: i
										}, t)
									}
								};
								return x(), O
							} catch (e) {
								throw l?.stop(), s?.disconnect(), c?.dispose(), e instanceof u ? e.sdkError : e
							}
						}
					}
				})({
					baseUrl: e.publishBaseUrl,
					apiKey: e.apiKey,
					apiKeyProvider: e.apiKeyProvider,
					integration: e.integration,
					logger: e.logger,
					telemetryEnabled: e.telemetryEnabled,
					prepareConnection: tk
				}),
				i = (e => {
					let {
						baseUrl: t,
						integration: i
					} = e, r = e.logger ?? E("info"), n = X({
						apiKey: e.apiKey,
						apiKeyProvider: e.apiKeyProvider
					});
					return {
						subscribe: async a => {
							let o, s, l, {
									room_name: u,
									frame_timing: d
								} = function(e) {
									try {
										let t = JSON.parse(atob(e));
										if (!t.room_name || "string" != typeof t.room_name) throw Error("Invalid subscribe token format");
										return {
											room_name: t.room_name,
											...!0 === t.frame_timing ? {
												frame_timing: !0
											} : {}
										}
									} catch {
										throw Error("Invalid subscribe token")
									}
								}(a.token),
								{
									emitter: h,
									emitOrBuffer: p,
									flush: g,
									stop: f
								} = e_(),
								y = "connecting",
								b = null,
								v = null,
								w = e => {
									y !== e && (y = e, a.onConnectionChange?.(e), p("connectionChange", e))
								},
								k = await n();
							try {
								let n = await e1(),
									{
										Room: c,
										RoomEvent: m
									} = n;
								o = new ti({
									telemetryEnabled: !1,
									apiKey: k,
									integration: i,
									logger: r,
									onDiagnostic: e => p("diagnostic", e)
								}), w("connecting");
								let y = await to({
									baseUrl: t,
									apiKey: k,
									roomName: u
								});
								if (d) {
									if (!e.createFrameMetadataWorker) throw tr("this platform has no frame-metadata worker");
									if (!e.isFrameMetadataRuntimeSupported?.()) throw tr("encoded transforms are unavailable or the SDK is served cross-origin");
									try {
										l = e.createFrameMetadataWorker()
									} catch (e) {
										throw tr(`failed to create the required worker (${e instanceof Error?e.message:String(e)})`)
									}
								}
								try {
									s = new c({
										...H.livekit.roomOptions,
										...l ? {
											frameMetadata: {
												worker: l
											}
										} : {}
									})
								} catch (e) {
									throw l?.terminate(), l = void 0, e
								}
								let S = s,
									{
										onInputStream: T
									} = a,
									R = T ? ({
										low: n.VideoQuality.LOW,
										medium: n.VideoQuality.MEDIUM,
										high: n.VideoQuality.HIGH
									})[a.inputVideoQuality ?? "high"] : void 0,
									P = e => e.identity.startsWith(H.livekit.inferenceServerIdentityPrefix),
									M = (e, t) => {
										("video" === e.kind || "audio" === e.kind) && (P(t) ? e.setSubscribed(!0) : T && (e.setSubscribed(!0), "video" === e.kind && void 0 !== R && e.setVideoQuality(R)))
									},
									E = () => {
										for (let e of S.remoteParticipants.values())
											for (let t of e.trackPublications.values()) M(t, e)
									};
								S.on(m.TrackPublished, M), S.on(m.Reconnected, E), S.on(m.TrackSubscribed, (e, t, i) => {
									if ("video" !== e.kind && "audio" !== e.kind) return;
									let r = e.mediaStreamTrack;
									r && (P(i) ? (b = ta(b, r), a.onRemoteStream(b)) : T && T(v = ta(v, r)))
								}), S.on(m.ConnectionStateChanged, e => {
									w(tn(e))
								}), S.on(m.Disconnected, () => {
									w("disconnected")
								}), await S.connect(y.livekit_url, y.token, {
									autoSubscribe: !1
								}), E(), o.setLiveKitRoom(S), w("connected");
								let C = {
									isConnected: () => "connected" === S.state,
									getConnectionState: () => tn(S.state),
									disconnect: () => {
										o?.stop(), f(), S.disconnect().catch(() => {})
									},
									on: h.on,
									off: h.off
								};
								return g(), C
							} catch (t) {
								if (o?.stop(), s && s.disconnect().catch(() => {}), l?.terminate(), c(t)) throw r.error("Realtime subscribe error", {
									error: t.message
								}), t;
								let e = t instanceof Error ? t : Error(String(t));
								throw r.error("Realtime subscribe error", {
									error: e.message
								}), m(e)
							}
						}
					}
				})({
					baseUrl: e.subscribeBaseUrl,
					apiKey: e.apiKey,
					apiKeyProvider: e.apiKeyProvider,
					integration: e.integration,
					logger: e.logger,
					createFrameMetadataWorker: tc,
					isFrameMetadataRuntimeSupported: tu
				}),
				r = (({
					logger: e,
					connect: t
				}) => ({
					checkConnectivity: async (i = {}) => {
						var r, n;
						let a, o;
						if (i.deep) {
							if (!t) throw Error("deep connectivity probe is unavailable (realtime client not wired)");
							if (!i.model) throw Error("deep connectivity probe requires a `model` (latency is model-specific)");
							return tf({
								connect: t,
								logger: e,
								model: i.model,
								durationMs: i.durationMs ?? H.preflight.active.durationMs,
								signal: i.signal
							})
						}
						return r = await th(i.iceServers ?? ty, i.iceGatherTimeoutMs ?? H.preflight.iceGatherTimeoutMs, i.signal, e), n = H.preflight.rtt, o = [], "failed" === r.transport ? (a = "critical", o.push("Could not establish any WebRTC connectivity (no ICE candidates gathered). Real-time streaming is unlikely to work on this network.")) : "relay" === r.transport ? (a = "poor", o.push("Direct UDP connectivity could not be confirmed; the session will need a TURN relay, which adds latency and can't be verified without starting a session.")) : null != r.rttMs && r.rttMs > n.marginalMs ? (a = "poor", o.push(`Network round-trip time is high (~${r.rttMs}ms > ${n.marginalMs}ms); the real-time experience may feel laggy.`)) : null != r.rttMs && r.rttMs > n.goodMs ? (a = "fair", o.push(`Network round-trip time is elevated (~${r.rttMs}ms > ${n.goodMs}ms).`)) : a = "good", {
							quality: a,
							metrics: {
								transport: r.transport,
								rttMs: r.rttMs
							},
							reasons: o
						}
					}
				}))({
					logger: e.logger,
					connect: t.connect
				});
			return {
				connect: (e, i) => t.connect(e, i),
				subscribe: i.subscribe,
				checkConnectivity: r.checkConnectivity
			}
		};
	e.s(["f", 0, (e = {}) => ((e, t = {}) => {
		var i;
		let r, a, o = er.safeParse(t);
		if (!o.success) {
			let e = o.error.issues[0];
			if (e.path.includes("apiKey")) throw d();
			if (e.path.includes("apiKeyProvider")) throw l("INVALID_OPTIONS", "apiKeyProvider must be a function returning a client token's apiKey (a string or a Promise of one).");
			if (e.path.includes("baseUrl") || e.path.includes("realtimeBaseUrl")) throw h(t[e.path.includes("realtimeBaseUrl") ? "realtimeBaseUrl" : "baseUrl"]);
			if (e.path.includes("proxy")) throw h(e.path.includes("proxy") ? t.proxy : void 0);
			throw o.error
		}
		let s = "proxy" in o.data && !!o.data.proxy,
			c = s ? void 0 : ("apiKey" in o.data ? o.data.apiKey : void 0) ?? (i = "DECART_API_KEY", void 0 !== (a = globalThis).process ? a.process.env?.[i]?.trim() : void 0 !== a.Deno ? a.Deno.env?.get?.(i)?.trim() : void 0),
			{
				apiKeyProvider: u
			} = o.data;
		if (!s && !c && !u) throw d();
		r = s && "proxy" in o.data && o.data.proxy ? o.data.proxy : o.data.baseUrl || "https://api.decart.ai";
		let {
			integration: p
		} = o.data, m = "logger" in t && t.logger ? t.logger : E("info"), g = !("telemetry" in t && !1 === t.telemetry), f = o.data.realtimeBaseUrl || "wss://api.decart.ai", y = e({
			publishBaseUrl: f,
			subscribeBaseUrl: s || void 0 !== o.data.baseUrl ? r : f.replace(/^wss?:\/\//i, "https://"),
			apiKey: c || "",
			apiKeyProvider: u,
			integration: p,
			logger: m,
			telemetryEnabled: g
		}), b = u && !s ? X({
			apiKey: "",
			apiKeyProvider: u
		}) : () => c || "", v = (e => {
			let {
				getApiKey: t,
				baseUrl: i,
				integration: r
			} = e;
			return async e => {
				let {
					model: a,
					signal: o,
					...s
				} = e, c = a.inputSchema.safeParse(s);
				if (!c.success) throw l(n, `Invalid inputs for ${a.name}: ${c.error.message}`);
				let u = {};
				for (let [e, t] of Object.entries(c.data)) "data" === e || "start" === e || "end" === e || "reference_image" === e ? u[e] = await z(t) : u[e] = t;
				return await B({
					baseUrl: i,
					apiKey: await t(),
					model: a,
					inputs: u,
					signal: o,
					integration: r
				})
			}
		})({
			baseUrl: r,
			getApiKey: b,
			integration: p
		}), w = (e => {
			let {
				getApiKey: t,
				baseUrl: i,
				integration: r
			} = e, a = async e => {
				let {
					model: a,
					signal: o,
					...s
				} = e, c = a.inputSchema.safeParse(s);
				if (!c.success) throw l(n, `Invalid inputs for ${a.name}: ${c.error.message}`);
				let u = {};
				for (let [e, t] of Object.entries(c.data)) "data" === e || "start" === e || "end" === e || "reference_image" === e ? u[e] = await z(t) : u[e] = t;
				return G({
					baseUrl: i,
					apiKey: await t(),
					model: a,
					inputs: u,
					signal: o,
					integration: r
				})
			}, o = async e => {
				let {
					onStatusChange: n,
					signal: o,
					...s
				} = e, l = await a(s);
				return n && n(l), W({
					checkStatus: async () => V({
						baseUrl: i,
						apiKey: await t(),
						jobId: l.job_id,
						signal: o,
						integration: r
					}),
					getContent: async () => Q({
						baseUrl: i,
						apiKey: await t(),
						jobId: l.job_id,
						signal: o,
						integration: r
					}),
					onStatusChange: n,
					signal: o
				})
			};
			return {
				submit: a,
				status: async e => V({
					baseUrl: i,
					apiKey: await t(),
					jobId: e,
					integration: r
				}),
				result: async e => Q({
					baseUrl: i,
					apiKey: await t(),
					jobId: e,
					integration: r
				}),
				submitAndPoll: o
			}
		})({
			baseUrl: r,
			getApiKey: b,
			integration: p
		}), k = (e => {
			let {
				baseUrl: t,
				getApiKey: i,
				integration: r
			} = e;
			return {
				create: async e => {
					let n = {
							...L({
								apiKey: await i(),
								integration: r
							}),
							"content-type": "application/json"
						},
						a = await fetch(`${t}/v1/client/tokens`, {
							method: "POST",
							headers: n,
							body: JSON.stringify(e ?? {})
						});
					if (!a.ok) {
						let e = await a.text().catch(() => "Unknown error");
						throw l("TOKEN_CREATE_ERROR", `Failed to create token: ${a.status} - ${e}`, {
							status: a.status
						})
					}
					return a.json()
				},
				verify: P,
				decode: S
			}
		})({
			baseUrl: r,
			getApiKey: b,
			integration: p
		}), T = (e => {
			let {
				baseUrl: t,
				getApiKey: i,
				integration: r
			} = e, a = async e => {
				let n = await fetch(`${t}${e}`, {
					method: "GET",
					headers: L({
						apiKey: await i(),
						integration: r
					})
				});
				if (!n.ok) {
					let e = await n.text().catch(() => "Unknown error");
					throw l("FILES_GET_ERROR", `Failed to get file: ${n.status} - ${e}`, {
						status: n.status
					})
				}
				return n.json()
			};
			return {
				upload: async (e, a) => {
					if (a?.ttlSeconds !== void 0 && !K.safeParse(a.ttlSeconds).success) throw l(n, 'ttlSeconds must be an integer in [60, 2592000] or the literal "persistent"');
					let o = new FormData;
					o.append("file", e), a?.ttlSeconds !== void 0 && o.append("ttl_seconds", String(a.ttlSeconds));
					let s = await fetch(`${t}/v1/files`, {
						method: "POST",
						headers: L({
							apiKey: await i(),
							integration: r
						}),
						body: o,
						signal: a?.signal
					});
					if (!s.ok) {
						let e = await s.text().catch(() => "Unknown error");
						throw l("FILES_UPLOAD_ERROR", `Failed to upload file: ${s.status} - ${e}`, {
							status: s.status
						})
					}
					return s.json()
				},
				get: e => a(`/v1/files/${encodeURIComponent(e)}`),
				getByMd5: async e => {
					if (!q.test(e)) throw l(n, "md5 must be 32 hex characters");
					return a(`/v1/files/by-md5/${e.toLowerCase()}`)
				},
				delete: async e => {
					let n = await fetch(`${t}/v1/files/${encodeURIComponent(e)}`, {
						method: "DELETE",
						headers: L({
							apiKey: await i(),
							integration: r
						})
					});
					if (!n.ok) {
						let e = await n.text().catch(() => "Unknown error");
						throw l("FILES_DELETE_ERROR", `Failed to delete file: ${n.status} - ${e}`, {
							status: n.status
						})
					}
				}
			}
		})({
			baseUrl: r,
			getApiKey: b,
			integration: p
		});
		return {
			realtime: {
				connect: y.connect,
				subscribe: y.subscribe,
				checkConnectivity: y.checkConnectivity
			},
			process: v,
			queue: w,
			tokens: k,
			files: T
		}
	})(tS, e)], 633627)
}, 873384, e => {
	e.v(e.r(510914).f("static/immutable/chunks/turbopack-worker-17xj571juv_5b.js", ["static/immutable/chunks/3wecvsx36bnn2.js", "static/immutable/chunks/0xle44opq74c5.js", "static/immutable/chunks/turbopack-3dornshs1q-vm.js", "static/immutable/chunks/turbopack-3h_ctkfaeun7f.js"]))
}, 560716, e => {
	"use strict";
	var t = e.i(55e3);
	let i = {
		name: "image-up",
		size: 24,
		node: [
			["path", {
				d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21",
				key: "9csbqa"
			}],
			["path", {
				d: "m14 19.5 3-3 3 3",
				key: "9vmjn0"
			}],
			["path", {
				d: "M17 22v-5.5",
				key: "1aa6fl"
			}],
			["circle", {
				cx: "9",
				cy: "9",
				r: "2",
				key: "af1f0g"
			}]
		]
	};
	i.node;
	let r = (0, t.f)(i);
	e.s(["f", 0, r], 560716)
}, 880582, e => {
	"use strict";
	var t = e.i(55e3);
	let i = {
		name: "image",
		size: 24,
		node: [
			["rect", {
				width: "18",
				height: "18",
				x: "3",
				y: "3",
				rx: "2",
				ry: "2",
				key: "1m3agn"
			}],
			["circle", {
				cx: "9",
				cy: "9",
				r: "2",
				key: "af1f0g"
			}],
			["path", {
				d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
				key: "1xmnt7"
			}]
		]
	};
	i.node;
	let r = (0, t.f)(i);
	e.s(["f", 0, r], 880582)
}, 510914, e => {
	"use strict";
	e.s(["f", 0, function(t, i) {
		return (r, n) => (function(t, i, r, n) {
			let a = "SharedWorker" === t.name,
				o = e.b,
				s = [r.map(t => e.h("string" == typeof t ? t : t.path, o)).reverse(), e.X, o],
				l = ["NEXT_DEPLOYMENT_ID", "NEXT_CLIENT_ASSET_SUFFIX"];
			for (let e = 0; e < l.length; e++) s.push(globalThis[l[e]]);
			let c = new URL(e.h(i, o), location.origin),
				u = JSON.stringify(s);
			return a ? c.searchParams.set("params", u) : c.hash = "#params=" + encodeURIComponent(u), new t(c, n ? {
				...n,
				type: void 0
			} : void 0)
		})(r, t, i, n)
	}])
}]);