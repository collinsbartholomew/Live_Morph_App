(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 288576, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(293819),
		o = e.i(170380),
		n = e.i(8774),
		l = e.i(782241),
		i = e.i(480381);
	let s = "decart:deepfake-disclosure-acknowledged";

	function c(e) {
		return e.preventDefault()
	}

	function d(e) {
		return e.preventDefault()
	}

	function u(e) {
		return e.preventDefault()
	}
	e.s(["DeepfakeDisclosureDialog", 0, function() {
		let e, m, p, f, h, g, b, x, w, y, S, j, v, k, I, D, _ = (0, r.c)(29),
			[C, N] = (0, o.useState)(!1),
			[R, A] = (0, o.useState)(!1),
			O = (0, o.useId)(),
			P = (0, o.useId)();
		_[0] === Symbol.for("react.memo_cache_sentinel") ? (e = () => {
			try {
				if ("1" === window.localStorage.getItem(s)) return
			} catch {}
			N(!0)
		}, m = [], _[0] = e, _[1] = m) : (e = _[0], m = _[1]), (0, o.useEffect)(e, m), _[2] === Symbol.for("react.memo_cache_sentinel") ? (p = () => {
			try {
				window.localStorage.setItem(s, "1")
			} catch {}
			N(!1)
		}, _[2] = p) : p = _[2];
		let M = p;
		_[3] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, t.jsxs)(i.s, {
			children: [(0, t.jsx)(i.F, {
				children: "Deepfake disclosure notice"
			}), (0, t.jsx)(i.C, {
				children: "Starting 2 August 2026, applicable law may require disclosure when AI-generated or manipulated image, audio or video content constitutes a deepfake."
			})]
		}), _[3] = f) : f = _[3], _[4] === Symbol.for("react.memo_cache_sentinel") ? (h = (0, t.jsx)("p", {
			children: "Deepfake content generally means realistic AI-generated or manipulated content that resembles an existing person, object, place, organization or event and could appear authentic or truthful."
		}), g = (0, t.jsx)("p", {
			children: "You are responsible for determining and applying any disclosure required for your content. Do not remove, hide or interfere with any AI label, watermark or machine-readable marker applied by Decart."
		}), _[4] = h, _[5] = g) : (h = _[4], g = _[5]), _[6] === Symbol.for("react.memo_cache_sentinel") ? (b = e => A(!0 === e), _[6] = b) : b = _[6], _[7] !== P || _[8] !== R || _[9] !== O ? (x = (0, t.jsx)(l.f, {
			id: O,
			checked: R,
			onCheckedChange: b,
			"aria-labelledby": P,
			className: "mt-0.5"
		}), _[7] = P, _[8] = R, _[9] = O, _[10] = x) : x = _[10], _[11] !== O ? (w = (0, t.jsx)("label", {
			htmlFor: O,
			children: "I acknowledge this notice and agree to the updated"
		}), _[11] = O, _[12] = w) : w = _[12], _[13] === Symbol.for("react.memo_cache_sentinel") ? (y = (0, t.jsx)(a.default, {
			href: "#",
			target: "_blank",
			rel: "noreferrer",
			className: "underline underline-offset-4 hover:text-foreground",
			children: "Terms of Service"
		}), _[13] = y) : y = _[13], _[14] === Symbol.for("react.memo_cache_sentinel") ? (S = (0, t.jsx)(a.default, {
			href: "#",
			target: "_blank",
			rel: "noreferrer",
			className: "underline underline-offset-4 hover:text-foreground",
			children: "Acceptable Use Policy"
		}), _[14] = S) : S = _[14], _[15] !== P || _[16] !== w ? (j = (0, t.jsxs)("span", {
			id: P,
			children: [w, " ", y, " ", "and", " ", S, "."]
		}), _[15] = P, _[16] = w, _[17] = j) : j = _[17], _[18] !== j || _[19] !== x ? (v = (0, t.jsxs)("div", {
			className: "flex flex-col gap-4 text-sm text-muted-foreground",
			children: [h, g, (0, t.jsxs)("div", {
				className: "flex items-start gap-3 text-foreground",
				children: [x, j]
			})]
		}), _[18] = j, _[19] = x, _[20] = v) : v = _[20];
		let T = !R;
		return _[21] !== T ? (k = (0, t.jsx)(i.c, {
			children: (0, t.jsx)(n.f, {
				onClick: M,
				disabled: T,
				children: "Accept and continue"
			})
		}), _[21] = T, _[22] = k) : k = _[22], _[23] !== v || _[24] !== k ? (I = (0, t.jsxs)(i.d, {
			showCloseButton: !1,
			onPointerDownOutside: u,
			onInteractOutside: d,
			onEscapeKeyDown: c,
			className: "sm:max-w-lg",
			children: [f, v, k]
		}), _[23] = v, _[24] = k, _[25] = I) : I = _[25], _[26] !== C || _[27] !== I ? (D = (0, t.jsx)(i.N, {
			open: C,
			children: I
		}), _[26] = C, _[27] = I, _[28] = D) : D = _[28], D
	}], 288576)
}, 196695, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(170380),
		a = e.i(868496),
		o = e.i(540675);
	let n = {
			selectedModelKey: "lucy-image-2|batch",
			selectedResolution: "720p",
			fastMode: !1,
			prompt: "",
			studioOutput: null,
			uploadedImage: null,
			uploadedMediaFile: null,
			isDrawing: !1,
			isGenerating: !1,
			showExampleOutput: !0,
			queueJobId: null,
			queueStatus: null,
			uploadedVideoDuration: null,
			jobStartTime: null,
			generationId: null,
			feedback: null,
			isRealtimeConnected: !1,
			isRealtimeConnecting: !1
		},
		l = (0, r.createContext)(null);
	e.s(["StudioStoreProvider", 0, ({
		children: e,
		initState: a
	}) => {
		let i = (0, r.useRef)(null);
		return i.current || (i.current = ((e = n) => (0, o.f)()(t => ({
			...e,
			setSelectedModelKey: e => t(t => t.selectedModelKey === e ? {} : {
				selectedModelKey: e,
				fastMode: !1
			}),
			setSelectedResolution: e => t({
				selectedResolution: e
			}),
			setFastMode: e => t({
				fastMode: e
			}),
			setPrompt: e => t({
				prompt: e
			}),
			setStudioOutput: e => t({
				studioOutput: e
			}),
			setUploadedImage: e => t({
				uploadedImage: e
			}),
			setUploadedMediaFile: e => t({
				uploadedMediaFile: e
			}),
			setIsDrawing: e => t({
				isDrawing: e
			}),
			setIsGenerating: e => t({
				isGenerating: e
			}),
			setShowExampleOutput: e => t({
				showExampleOutput: e
			}),
			setQueueJobId: e => t({
				queueJobId: e
			}),
			setQueueStatus: e => t({
				queueStatus: e
			}),
			clearQueueState: () => t({
				queueJobId: null,
				queueStatus: null
			}),
			setUploadedVideoDuration: e => t({
				uploadedVideoDuration: e
			}),
			setJobStartTime: e => t({
				jobStartTime: e
			}),
			clearProgressState: () => t({
				uploadedVideoDuration: null,
				jobStartTime: null
			}),
			setGenerationId: e => t({
				generationId: e,
				feedback: null
			}),
			setFeedback: e => t({
				feedback: e
			}),
			setIsRealtimeConnected: e => t({
				isRealtimeConnected: e
			}),
			setIsRealtimeConnecting: e => t({
				isRealtimeConnecting: e
			})
		})))({
			...n,
			...a
		})), (0, t.jsx)(l.Provider, {
			value: i.current,
			children: e
		})
	}, "useStudioStore", 0, e => {
		let t = (0, r.useContext)(l);
		if (!t) throw Error("useStudioStore must be used within StudioStoreProvider");
		return (0, a.f)(t, e)
	}], 196695)
}, 204271, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(293819),
		o = e.i(170380),
		n = e.i(8774),
		l = e.i(480381),
		i = e.i(996910),
		s = e.i(503963),
		c = e.i(862740);
	let d = "decart:watermark-disclosure-acknowledged",
		u = i.f.toLocaleDateString("en-US", {
			month: "long",
			day: "numeric",
			year: "numeric",
			timeZone: "UTC"
		});

	function m(e) {
		return e.preventDefault()
	}

	function p(e) {
		return e.preventDefault()
	}
	e.s(["WatermarkDisclosureDialog", 0, function() {
		let e, i, f, h, g, b, x, w, y, S, j, v, k, I = (0, r.c)(27),
			{
				data: D,
				isLoading: _
			} = (0, s.k)(),
			[C, N] = (0, o.useState)(!1);
		I[0] !== D || I[1] !== _ ? (e = () => {
			if (!_ && D) {
				if ("approved" === D.exemptReason || D.request?.status === "pending") {
					try {
						window.localStorage.setItem(d, "1")
					} catch {}
					return
				}
				if (D.active || D.grandfathered) {
					try {
						if ("1" === window.localStorage.getItem(d)) return
					} catch {}
					N(!0)
				}
			}
		}, i = [D, _], I[0] = D, I[1] = _, I[2] = e, I[3] = i) : (e = I[2], i = I[3]), (0, o.useEffect)(e, i), I[4] === Symbol.for("react.memo_cache_sentinel") ? (f = () => {
			try {
				window.localStorage.setItem(d, "1")
			} catch {}
			N(!1)
		}, I[4] = f) : f = I[4];
		let R = f;
		if (!D) return null;
		let A = D.grandfathered,
			O = A ? `Watermark turns on ${u}` : "Your realtime output carries a watermark",
			P = A ? `Starting ${u}, Decart's "AI generated" watermark applies to new realtime sessions. You can apply for removal now to skip it.` : 'Realtime output from your account is marked with an "AI generated" label in the corners. You can apply to have it removed.';
		I[5] === Symbol.for("react.memo_cache_sentinel") ? (h = e => {
			e || R()
		}, I[5] = h) : h = I[5], I[6] !== O ? (g = (0, t.jsx)(l.F, {
			children: O
		}), I[6] = O, I[7] = g) : g = I[7], I[8] !== P ? (b = (0, t.jsx)(l.C, {
			children: P
		}), I[8] = P, I[9] = b) : b = I[9], I[10] !== g || I[11] !== b ? (x = (0, t.jsxs)(l.s, {
			children: [g, b]
		}), I[10] = g, I[11] = b, I[12] = x) : x = I[12], I[13] === Symbol.for("react.memo_cache_sentinel") ? (w = (0, t.jsx)(c.f, {
			className: "mx-auto"
		}), I[13] = w) : w = I[13];
		let M = A ? "Got it" : "Continue with watermark";
		I[14] !== M ? (y = (0, t.jsx)(n.f, {
			variant: "outline",
			onClick: R,
			children: M
		}), I[14] = M, I[15] = y) : y = I[15];
		let T = A ? "Apply now" : "Apply to remove";
		return I[16] !== T ? (S = (0, t.jsx)(n.f, {
			asChild: !0,
			onClick: R,
			children: (0, t.jsx)(a.default, {
				href: "/watermark",
				children: T
			})
		}), I[16] = T, I[17] = S) : S = I[17], I[18] !== S || I[19] !== y ? (j = (0, t.jsxs)(l.c, {
			children: [y, S]
		}), I[18] = S, I[19] = y, I[20] = j) : j = I[20], I[21] !== j || I[22] !== x ? (v = (0, t.jsxs)(l.d, {
			showCloseButton: !1,
			onPointerDownOutside: p,
			onEscapeKeyDown: m,
			className: "sm:max-w-md",
			children: [x, w, j]
		}), I[21] = j, I[22] = x, I[23] = v) : v = I[23], I[24] !== C || I[25] !== v ? (k = (0, t.jsx)(l.N, {
			open: C,
			onOpenChange: h,
			children: v
		}), I[24] = C, I[25] = v, I[26] = k) : k = I[26], k
	}])
}, 862740, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(582018),
		a = e.i(818036);
	let o = ["top-2 left-2", "top-2 right-2", "bottom-2 right-2", "bottom-2 left-2"];

	function n(e, r) {
		return (0, t.jsx)("span", {
			className: (0, a.c)("absolute rounded-md border border-white/10 bg-black/55 px-2 py-0.5 text-xs font-medium tracking-wide text-white/90 opacity-0 backdrop-blur-md motion-safe:animate-watermark-chip-pulse", e, 0 === r && "opacity-100 motion-safe:opacity-0"),
			style: {
				animationDelay: `${3.5*r}s`
			},
			children: "AI generated"
		}, e)
	}
	e.s(["f", 0, function(e) {
		let l, i, s, c, d = (0, r.c)(6),
			{
				className: u
			} = e;
		return d[0] !== u ? (l = (0, a.c)("relative w-full max-w-xs", u), d[0] = u, d[1] = l) : l = d[1], d[2] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)("video", {
			className: "absolute inset-0 h-full w-full object-cover",
			src: "../../../../models-about/lucy-restyle/01.mp4",
			autoPlay: !0,
			loop: !0,
			muted: !0,
			playsInline: !0,
			preload: "metadata",
			children: (0, t.jsx)("track", {
				kind: "captions"
			})
		}), d[2] = i) : i = d[2], d[3] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsxs)("div", {
			className: "relative aspect-video w-full overflow-hidden rounded-lg border bg-black",
			children: [i, (0, t.jsx)("div", {
				className: "pointer-events-none absolute inset-0",
				children: o.map(n)
			})]
		}), d[3] = s) : s = d[3], d[4] !== l ? (c = (0, t.jsx)("figure", {
			className: l,
			"aria-hidden": "true",
			children: s
		}), d[4] = l, d[5] = c) : c = d[5], c
	}])
}]);