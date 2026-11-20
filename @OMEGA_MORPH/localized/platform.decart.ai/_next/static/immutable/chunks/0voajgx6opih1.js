(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 528506, e => {
	"use strict";
	var t = e.i(261909),
		i = e.i(292109);
	let r = {
		track: (e, t) => {
			i.f && i.f.capture(e, t)
		},
		identify: (e, r) => {
			if (i.f) {
				let {
					credits: t,
					...s
				} = r || {};
				i.f.identify(e, {
					credits: t ?? void 0
				}, s)
			}(0, t.sendGTMEvent)({
				event: "user_identify",
				user_id: e,
				user_traits: r || {}
			})
		},
		logout: e => {
			i.f && i.f.reset(), (0, t.sendGTMEvent)({
				event: "user_logout",
				...e && {
					user_id: e
				}
			})
		},
		trackSignUp: (e, i) => {
			r.track("user_signed_up", {
				method: e
			}), (0, t.sendGTMEvent)({
				event: "sign_up",
				method: e,
				...i && {
					user_id: i
				}
			})
		},
		setOnboardingProperties: e => {
			(0, t.sendGTMEvent)({
				event: "set_user_properties",
				...e.userId && {
					user_id: e.userId
				},
				usage_plan: e.usagePlan,
				goal: e.goal,
				role: e.role,
				marketing_consent: e.marketingConsent
			})
		},
		trackSignIn: (e, i) => {
			r.track("user_signed_in", {
				method: e
			}), (0, t.sendGTMEvent)({
				event: "login",
				method: e,
				...i && {
					user_id: i
				}
			})
		},
		trackApiKeyCreated: e => {
			r.track("api_key_created", {
				user_id: e
			}), (0, t.sendGTMEvent)({
				event: "api_key_created",
				...e && {
					user_id: e
				}
			})
		},
		trackCheckoutBegin: e => {
			let {
				planId: i,
				credits: s,
				price: n,
				userId: o
			} = e;
			r.track("checkout_begin", {
				plan_id: i,
				credits: s,
				value: n,
				currency: "USD"
			}), (0, t.sendGTMEvent)({
				event: "begin_checkout",
				value: n,
				currency: "USD",
				items: [{
					item_id: i,
					item_name: `${s} Credits`,
					price: n,
					quantity: 1
				}],
				...o && {
					user_id: o
				}
			})
		},
		trackPurchaseComplete: e => {
			let {
				transactionId: i,
				credits: s,
				price: n,
				planId: o,
				userId: a
			} = e;
			r.track("purchase_credits", {
				transaction_id: i,
				credits: s,
				value: n,
				currency: "USD"
			}), (0, t.sendGTMEvent)({
				event: "purchase",
				transaction_id: i,
				value: n,
				currency: "USD",
				items: [{
					item_id: o,
					item_name: `${s} Credits`,
					price: n,
					quantity: 1
				}],
				...a && {
					user_id: a
				}
			})
		},
		trackAutoTopUpAddCardClicked: () => {
			r.track("auto_top_up_add_card_clicked")
		},
		trackAutoTopUpPaymentMethodSaved: () => {
			r.track("auto_top_up_payment_method_saved")
		},
		trackAutoTopUpSettingsSaved: e => {
			r.track("auto_top_up_settings_saved", {
				threshold: e.threshold,
				plan_id: e.planId,
				monthly_cap_usd: e.monthlyCap / 100,
				enabled: e.enabled
			})
		},
		trackAutoTopUpEnabled: () => {
			r.track("auto_top_up_enabled")
		},
		trackAutoTopUpDisabled: () => {
			r.track("auto_top_up_disabled")
		},
		trackGenerateStart: e => {
			let {
				modelName: t,
				tokenAmount: i,
				inputSource: s
			} = e;
			r.track("api_model_generate_start", {
				model_name: t,
				token_amount: i,
				input_source: s
			})
		},
		trackGenerateComplete: e => {
			let {
				modelName: t,
				tokenAmount: i
			} = e;
			r.track("api_model_generate_complete", {
				model_name: t,
				token_amount: i
			})
		},
		trackVideoGenerationStarted: (e, t) => {
			r.track("video_generation_started", {
				prompt: e,
				prompt_length: e.length,
				settings: t
			})
		},
		trackVideoGenerationCompleted: (e, t) => {
			r.track("video_generation_completed", {
				success: e,
				duration_ms: t
			})
		},
		trackGenerationFailedInsufficientCredits: (e, t) => {
			r.track("generation_failed_insufficient_credits", {
				current_credits: e,
				required_credits: t
			})
		},
		trackVideoDownloaded: (e, t) => {
			r.track("video_downloaded", {
				video_id: e,
				video_url: t
			})
		},
		trackVideoShared: (e, t) => {
			r.track("video_shared", {
				video_id: e,
				video_url: t
			})
		},
		trackGenerationError: (e, t) => {
			r.track("generation_error", {
				error_type: e,
				error_message: t
			})
		},
		trackRealtimeInputChanged: e => {
			r.track("realtime_input_changed", {
				model_name: e.modelName,
				from_input: e.fromInput,
				to_input: e.toInput
			})
		},
		trackRealtimePromptManual: e => {
			r.track("realtime_prompt_manual", {
				model_name: e.modelName,
				prompt_text: e.promptText
			})
		},
		trackRealtimeSuggestionClicked: e => {
			let t = "builtin" === e.source || "decart" === e.source;
			r.track("realtime_suggestion_clicked", {
				model_name: e.modelName,
				suggestion_label: t ? e.suggestionLabel : "(saved preset)",
				phase: e.phase,
				preset_source: e.source,
				preset_id: e.presetId
			})
		},
		trackPlaygroundPresetClicked: e => {
			let t = "builtin" === e.source || "decart" === e.source;
			r.track("playground_preset_clicked", {
				surface: e.surface,
				model_name: e.modelName,
				preset_label: t ? e.presetLabel : "(saved preset)",
				preset_source: e.source,
				preset_id: e.presetId,
				phase: e.phase
			})
		},
		trackExampleClicked: e => {
			r.track("example_clicked", {
				example_id: e
			})
		},
		trackSuggestionUsed: (e, t) => {
			r.track("suggestion_used", {
				prompt: e,
				title: t
			})
		},
		trackFileUploaded: (e, t) => {
			r.track("file_uploaded", {
				file_type: e,
				file_size_kb: t ? Math.round(t / 1024) : void 0
			})
		},
		trackModelTabClicked: (e, i, s) => {
			r.track("model_tab_clicked", {
				model_name: e,
				tab_name: i
			}), (0, t.sendGTMEvent)({
				event: "model_tab_clicked",
				...s && {
					user_id: s
				},
				model_name: e,
				tab_name: i
			})
		},
		trackCodeSnippetCopied: e => {
			r.track("api_tab_code_snippet_copied", {
				model_name: e.modelName,
				language: e.language
			})
		},
		trackDocumentationClicked: () => {
			r.track("documentation_clicked")
		}
	};
	e.s(["f", 0, r])
}, 163834, (e, t, i) => {
	"use strict";
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.default = function({
		html: e,
		height: t = null,
		width: i = null,
		children: n,
		dataNtpc: o = ""
	}) {
		return (0, s.useEffect)(() => {
			o && performance.mark("mark_feature_usage", {
				detail: {
					feature: `next-third-parties-${o}`
				}
			})
		}, [o]), (0, r.jsxs)(r.Fragment, {
			children: [n, e ? (0, r.jsx)("div", {
				style: {
					height: null != t ? `${t}px` : "auto",
					width: null != i ? `${i}px` : "auto"
				},
				"data-ntpc": o,
				dangerouslySetInnerHTML: {
					__html: e
				}
			}) : null]
		})
	};
	let r = e.r(234984),
		s = e.r(170380)
}, 701986, (e, t, i) => {
	"use strict";
	let r;
	var s = e.e && e.e.__importDefault || function(e) {
		return e && e.__esModule ? e : {
			default: e
		}
	};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.GoogleAnalytics = function(e) {
		let {
			gaId: t,
			debugMode: i,
			dataLayerName: s = "dataLayer",
			nonce: l
		} = e;
		return void 0 === r && (r = s), (0, o.useEffect)(() => {
			performance.mark("mark_feature_usage", {
				detail: {
					feature: "next-third-parties-ga"
				}
			})
		}, []), (0, n.jsxs)(n.Fragment, {
			children: [(0, n.jsx)(a.default, {
				id: "_next-ga-init",
				dangerouslySetInnerHTML: {
					__html: `
          window['${s}'] = window['${s}'] || [];
          function gtag(){window['${s}'].push(arguments);}
          gtag('js', new Date());

          gtag('config', '${t}' ${i?",{ 'debug_mode': true }":""});`
				},
				nonce: l
			}), (0, n.jsx)(a.default, {
				id: "_next-ga",
				src: `https://www.googletagmanager.com/gtag/js?id=${t}`,
				nonce: l
			})]
		})
	}, i.sendGAEvent = function() {
		void 0 === r ? console.warn("@next/third-parties: GA has not been initialized") : window[r] ? window[r].push(arguments) : console.warn(`@next/third-parties: GA dataLayer ${r} does not exist`)
	};
	let n = e.r(234984),
		o = e.r(170380),
		a = s(e.r(447098))
}, 197065, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__importDefault || function(e) {
		return e && e.__esModule ? e : {
			default: e
		}
	};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.default = function(e) {
		let {
			apiKey: t,
			...i
		} = e, r = {
			...i,
			key: t
		}, {
			html: a
		} = (0, n.GoogleMapsEmbed)(r);
		return (0, s.jsx)(o.default, {
			height: r.height || null,
			width: r.width || null,
			html: a,
			dataNtpc: "GoogleMapsEmbed"
		})
	};
	let s = e.r(234984),
		n = e.r(508751),
		o = r(e.r(163834))
}, 169437, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__importDefault || function(e) {
		return e && e.__esModule ? e : {
			default: e
		}
	};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.sendGTMEvent = void 0, i.GoogleTagManager = function(e) {
		let {
			gtmId: t,
			gtmScriptUrl: i,
			dataLayerName: r = "dataLayer",
			auth: l,
			preview: u,
			dataLayer: c,
			nonce: h
		} = e;
		a = r;
		let d = new URL(i || "https://www.googletagmanager.com/gtm.js");
		return t && d.searchParams.set("id", t), "dataLayer" !== r && d.searchParams.set("l", r), l && d.searchParams.set("gtm_auth", l), u && (d.searchParams.set("gtm_preview", u), d.searchParams.set("gtm_cookies_win", "x")), (0, n.useEffect)(() => {
			performance.mark("mark_feature_usage", {
				detail: {
					feature: "next-third-parties-gtm"
				}
			})
		}, []), (0, s.jsxs)(s.Fragment, {
			children: [(0, s.jsx)(o.default, {
				id: "_next-gtm-init",
				dangerouslySetInnerHTML: {
					__html: `
      (function(w,l){
        w[l]=w[l]||[];
        w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
        ${c?`w[l].push(${JSON.stringify(c)})`:""}
      })(window,'${r}');`
				},
				nonce: h
			}), (0, s.jsx)(o.default, {
				id: "_next-gtm",
				"data-ntpc": "GTM",
				src: d.href,
				nonce: h
			})]
		})
	};
	let s = e.r(234984),
		n = e.r(170380),
		o = r(e.r(447098)),
		a = "dataLayer";
	i.sendGTMEvent = (e, t) => {
		let i = t || a;
		window[i] = window[i] || [], window[i].push(e)
	}
}, 261909, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__importDefault || function(e) {
		return e && e.__esModule ? e : {
			default: e
		}
	};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.sendGAEvent = i.GoogleAnalytics = i.sendGTMEvent = i.GoogleTagManager = i.YouTubeEmbed = i.GoogleMapsEmbed = void 0;
	var s = e.r(197065);
	Object.defineProperty(i, "GoogleMapsEmbed", {
		enumerable: !0,
		get: function() {
			return r(s).default
		}
	});
	var n = e.r(360687);
	Object.defineProperty(i, "YouTubeEmbed", {
		enumerable: !0,
		get: function() {
			return r(n).default
		}
	});
	var o = e.r(169437);
	Object.defineProperty(i, "GoogleTagManager", {
		enumerable: !0,
		get: function() {
			return o.GoogleTagManager
		}
	}), Object.defineProperty(i, "sendGTMEvent", {
		enumerable: !0,
		get: function() {
			return o.sendGTMEvent
		}
	});
	var a = e.r(701986);
	Object.defineProperty(i, "GoogleAnalytics", {
		enumerable: !0,
		get: function() {
			return a.GoogleAnalytics
		}
	}), Object.defineProperty(i, "sendGAEvent", {
		enumerable: !0,
		get: function() {
			return a.sendGAEvent
		}
	})
}, 360687, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__importDefault || function(e) {
		return e && e.__esModule ? e : {
			default: e
		}
	};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.default = function(e) {
		let {
			html: t,
			scripts: i,
			stylesheets: r
		} = (0, o.YouTubeEmbed)(e);
		return (0, s.jsx)(a.default, {
			height: e.height || null,
			width: e.width || null,
			html: t,
			dataNtpc: "YouTubeEmbed",
			children: null == i ? void 0 : i.map(e => (0, s.jsx)(n.default, {
				src: e.url,
				strategy: l[e.strategy],
				stylesheets: r
			}, e.url))
		})
	};
	let s = e.r(234984),
		n = r(e.r(447098)),
		o = e.r(508751),
		a = r(e.r(163834)),
		l = {
			server: "beforeInteractive",
			client: "afterInteractive",
			idle: "lazyOnload",
			worker: "worker"
		}
}, 385524, (e, t, i) => {
	"use strict";
	Object.defineProperty(i, "__esModule", {
		value: !0
	});
	var r = {
		cancelIdleCallback: function() {
			return o
		},
		requestIdleCallback: function() {
			return n
		}
	};
	for (var s in r) Object.defineProperty(i, s, {
		enumerable: !0,
		get: r[s]
	});
	let n = "u" > typeof self && self.requestIdleCallback && self.requestIdleCallback.bind(window) || function(e) {
			let t = Date.now();
			return self.setTimeout(function() {
				e({
					didTimeout: !1,
					timeRemaining: function() {
						return Math.max(0, 50 - (Date.now() - t))
					}
				})
			}, 1)
		},
		o = "u" > typeof self && self.cancelIdleCallback && self.cancelIdleCallback.bind(window) || function(e) {
			return clearTimeout(e)
		};
	("function" == typeof i.default || "object" == typeof i.default && null !== i.default) && void 0 === i.default.__esModule && (Object.defineProperty(i.default, "__esModule", {
		value: !0
	}), Object.assign(i.default, i), t.exports = i.default)
}, 378305, (e, t, i) => {
	"use strict";
	Object.defineProperty(i, "__esModule", {
		value: !0
	});
	var r = {
		default: function() {
			return b
		},
		handleClientScriptLoad: function() {
			return _
		},
		initScriptLoader: function() {
			return m
		}
	};
	for (var s in r) Object.defineProperty(i, s, {
		enumerable: !0,
		get: r[s]
	});
	let n = e.r(514719),
		o = e.r(56421),
		a = e.r(234984),
		l = n._(e.r(716455)),
		u = o._(e.r(170380)),
		c = e.r(651281),
		h = e.r(700722),
		d = e.r(385524),
		p = e.r(287019),
		f = new Map,
		g = new Set,
		v = e => {
			let {
				src: t,
				id: i,
				onLoad: r = () => {},
				onReady: s = null,
				dangerouslySetInnerHTML: n,
				children: o = "",
				strategy: a = "afterInteractive",
				onError: u,
				stylesheets: c
			} = e, d = i || t;
			if (d && g.has(d)) return;
			if (f.has(t)) {
				g.add(d), f.get(t).then(r, u);
				return
			}
			let p = () => {
					s && s(), g.add(d)
				},
				v = document.createElement("script"),
				_ = new Promise((e, t) => {
					v.addEventListener("load", function(t) {
						e(), r && r.call(this, t), p()
					}), v.addEventListener("error", function(e) {
						t(e)
					})
				}).catch(function(e) {
					u && u(e)
				});
			n ? (v.innerHTML = n.__html || "", p()) : o ? (v.textContent = "string" == typeof o ? o : Array.isArray(o) ? o.join("") : "", p()) : t && (v.src = t, f.set(t, _)), (0, h.setAttributesFromProps)(v, e), "worker" === a && v.setAttribute("type", "text/partytown"), v.setAttribute("data-nscript", a), c && (e => {
				if (l.default.preinit) return e.forEach(e => {
					l.default.preinit(e, {
						as: "style"
					})
				});
				if ("u" > typeof window) {
					let t = document.head;
					e.forEach(e => {
						let i = document.createElement("link");
						i.type = "text/css", i.rel = "stylesheet", i.href = e, t.appendChild(i)
					})
				}
			})(c), document.body.appendChild(v)
		};

	function _(e) {
		let {
			strategy: t = "afterInteractive"
		} = e;
		"lazyOnload" === t ? window.addEventListener("load", () => {
			(0, d.requestIdleCallback)(() => v(e))
		}) : v(e)
	}

	function m(e) {
		e.forEach(_), [...document.querySelectorAll('[data-nscript="beforeInteractive"]'), ...document.querySelectorAll('[data-nscript="beforePageRender"]')].forEach(e => {
			let t = e.id || e.getAttribute("src");
			g.add(t)
		})
	}

	function y(e) {
		let {
			id: t,
			src: i = "",
			onLoad: r = () => {},
			onReady: s = null,
			strategy: n = "afterInteractive",
			onError: o,
			stylesheets: h,
			...f
		} = e, {
			updateScripts: _,
			scripts: m,
			getIsSsr: y,
			appDir: b,
			nonce: w
		} = (0, u.useContext)(c.HeadManagerContext);
		w = f.nonce || w;
		let x = (0, u.useRef)(!1);
		(0, u.useEffect)(() => {
			let e = t || i;
			x.current || (s && e && g.has(e) && s(), x.current = !0)
		}, [s, t, i]);
		let k = (0, u.useRef)(!1);
		if ((0, u.useEffect)(() => {
				if (!k.current) {
					if ("afterInteractive" === n) v(e);
					else "lazyOnload" === n && ("complete" === document.readyState ? (0, d.requestIdleCallback)(() => v(e)) : window.addEventListener("load", () => {
						(0, d.requestIdleCallback)(() => v(e))
					}));
					k.current = !0
				}
			}, [e, n]), ("beforeInteractive" === n || "worker" === n) && (_ ? (m[n] = (m[n] || []).concat([{
				id: t,
				src: i,
				onLoad: r,
				onReady: s,
				onError: o,
				...f,
				nonce: w
			}]), _(m)) : y && y() ? g.add(t || i) : y && !y() && v({
				...e,
				nonce: w
			})), b) {
			if (h && h.forEach(e => {
					l.default.preinit(e, {
						as: "style"
					})
				}), "beforeInteractive" === n)
				if (!i) return f.dangerouslySetInnerHTML && (f.children = f.dangerouslySetInnerHTML.__html, delete f.dangerouslySetInnerHTML), (0, a.jsx)("script", {
					nonce: w,
					dangerouslySetInnerHTML: {
						__html: `(self.__next_s=self.__next_s||[]).push(${(0,p.htmlEscapeJsonString)(JSON.stringify([0,{...f,id:t}]))})`
					}
				});
				else return l.default.preload(i, f.integrity ? {
					as: "script",
					integrity: f.integrity,
					nonce: w,
					crossOrigin: f.crossOrigin
				} : {
					as: "script",
					nonce: w,
					crossOrigin: f.crossOrigin
				}), (0, a.jsx)("script", {
					nonce: w,
					dangerouslySetInnerHTML: {
						__html: `(self.__next_s=self.__next_s||[]).push(${(0,p.htmlEscapeJsonString)(JSON.stringify([i,{...f,id:t}]))})`
					}
				});
			"afterInteractive" === n && i && l.default.preload(i, f.integrity ? {
				as: "script",
				integrity: f.integrity,
				nonce: w,
				crossOrigin: f.crossOrigin
			} : {
				as: "script",
				nonce: w,
				crossOrigin: f.crossOrigin
			})
		}
		return null
	}
	Object.defineProperty(y, "__nextScript", {
		value: !0
	});
	let b = y;
	("function" == typeof i.default || "object" == typeof i.default && null !== i.default) && void 0 === i.default.__esModule && (Object.defineProperty(i.default, "__esModule", {
		value: !0
	}), Object.assign(i.default, i), t.exports = i.default)
}, 287019, (e, t, i) => {
	"use strict";
	Object.defineProperty(i, "__esModule", {
		value: !0
	});
	var r = {
		ESCAPE_REGEX: function() {
			return o
		},
		htmlEscapeAttributeString: function() {
			return c
		},
		htmlEscapeJsonString: function() {
			return u
		}
	};
	for (var s in r) Object.defineProperty(i, s, {
		enumerable: !0,
		get: r[s]
	});
	let n = {
			"&": "\\u0026",
			">": "\\u003e",
			"<": "\\u003c",
			"\u2028": "\\u2028",
			"\u2029": "\\u2029"
		},
		o = /[&><\u2028\u2029]/g,
		a = {
			"&": "&amp;",
			'"': "&quot;",
			"'": "&#39;",
			"<": "&lt;",
			">": "&gt;"
		},
		l = /[&"'<>]/g;

	function u(e) {
		return e.replace(o, e => n[e])
	}

	function c(e) {
		return e.replace(l, e => a[e])
	}
}, 447098, (e, t, i) => {
	t.exports = e.r(378305)
}, 292109, e => {
	"use strict";
	let t, i, r, s, n, o, a, l, u, c, h, d;
	var p, f, g, v, _, m = e.i(914374);
	let y = "u" > typeof window ? window : void 0,
		b = "u" > typeof globalThis ? globalThis : y,
		w = null == b ? void 0 : b.navigator,
		x = null == b ? void 0 : b.document,
		k = null == b ? void 0 : b.location,
		E = null == b ? void 0 : b.fetch,
		S = (null == b ? void 0 : b.XMLHttpRequest) && "withCredentials" in new b.XMLHttpRequest ? b.XMLHttpRequest : void 0,
		$ = null == b ? void 0 : b.AbortController,
		F = null == b ? void 0 : b.CompressionStream,
		P = null == w ? void 0 : w.userAgent,
		T = "u" > typeof globalThis ? globalThis : y;
	T && "u" < typeof self && (T.self = T), T && "u" < typeof File && (T.File = function() {});
	let O = null != y ? y : {},
		I = "0.10.7",
		R = {
			DEBUG: !1,
			LIB_VERSION: I,
			LIB_NAME: "browser-common",
			JS_SDK_VERSION: I
		};
	var C = ((p = {}).AnonymousId = "anonymous_id", p.DistinctId = "distinct_id", p.Props = "props", p.EnablePersonProcessing = "enable_person_processing", p.PersonMode = "person_mode", p.FeatureFlagDetails = "feature_flag_details", p.FeatureFlags = "feature_flags", p.FeatureFlagPayloads = "feature_flag_payloads", p.BootstrapFeatureFlagDetails = "bootstrap_feature_flag_details", p.BootstrapFeatureFlags = "bootstrap_feature_flags", p.BootstrapFeatureFlagPayloads = "bootstrap_feature_flag_payloads", p.OverrideFeatureFlags = "override_feature_flags", p.Queue = "queue", p.AiQueue = "ai_queue", p.AiCaptureQueue = "ai_capture_queue", p.LogsQueue = "logs_queue", p.OptedOut = "opted_out", p.SessionId = "session_id", p.SessionStartTimestamp = "session_start_timestamp", p.SessionLastTimestamp = "session_timestamp", p.PersonProperties = "person_properties", p.GroupProperties = "group_properties", p.InstalledAppBuild = "installed_app_build", p.InstalledAppVersion = "installed_app_version", p.SessionReplay = "session_replay", p.PushRegistered = "push_registered", p.SessionReplayEventTriggerActivatedSession = "session_replay_event_trigger_activated_session", p.SurveyLastSeenDate = "survey_last_seen_date", p.SurveysInProgress = "surveys_in_progress", p.SurveysSeen = "surveys_seen", p.Surveys = "surveys", p.RemoteConfig = "remote_config", p.FlagsEndpointWasHit = "flags_endpoint_was_hit", p.DeviceId = "device_id", p),
		M = ((f = {}).GZipJS = "gzip-js", f.Base64 = "base64", f);
	let A = ["$snapshot", "$pageview", "$pageleave", "$set", "survey dismissed", "survey sent", "survey shown", "$identify", "$groupidentify", "$create_alias", "$$client_ingestion_warning", "$web_experiment_applied", "$feature_enrollment_update", "$feature_flag_called"],
		L = ["token"];

	function D(e, t) {
		return -1 !== e.indexOf(t)
	}
	let N = function(e) {
			return e.trim()
		},
		j = function(e) {
			return e.replace(/^\$/, "")
		};

	function z(e) {
		var t;
		let i = [];
		return null != (t = JSON.stringify(e, function(e, t) {
			if ("bigint" == typeof t) return t.toString();
			if ("function" != typeof t && "symbol" != typeof t) {
				if (t instanceof Error) return {
					name: t.name,
					message: t.message,
					stack: t.stack
				};
				if (t && "object" == typeof t) {
					for (; i.length > 0 && i[i.length - 1] !== this;) i.pop();
					if (i.includes(t)) return "[Circular]";
					i.push(t)
				}
				return t
			}
		})) ? t : "null"
	}
	let H = Object.prototype,
		U = H.hasOwnProperty,
		B = H.toString,
		q = Array.isArray || function(e) {
			return "[object Array]" === B.call(e)
		},
		G = e => "function" == typeof e,
		W = e => e === Object(e) && !q(e),
		V = e => {
			if (W(e)) {
				for (let t in e)
					if (U.call(e, t)) return !1;
				return !0
			}
			return !1
		},
		J = e => void 0 === e,
		K = e => "[object String]" == B.call(e),
		Y = e => K(e) && 0 === e.trim().length,
		X = e => null === e,
		Z = e => J(e) || X(e),
		Q = e => "[object Number]" == B.call(e) && e == e,
		ee = e => Q(e) && e > 0,
		et = e => "[object Boolean]" === B.call(e),
		ei = e => D(A, e),
		er = e => D(L, e);

	function es(e) {
		return null === e || "object" != typeof e
	}

	function en(e, t) {
		return ({}).toString.call(e) === `[object ${t}]`
	}

	function eo(e) {
		switch (({}).toString.call(e)) {
			case "[object Error]":
			case "[object Exception]":
			case "[object DOMException]":
			case "[object DOMError]":
			case "[object WebAssembly.Exception]":
				return !0;
			default:
				return el(e, Error)
		}
	}

	function ea(e) {
		return "u" > typeof Event && el(e, Event)
	}

	function el(e, t) {
		try {
			return e instanceof t
		} catch (e) {
			return !1
		}
	}
	let eu = [!0, "true", 1, "1", "yes"],
		ec = [!1, "false", 0, "0", "no"];

	function eh(e, t, i, r, s, n, o) {
		try {
			var a = e[n](o),
				l = a.value
		} catch (e) {
			return void i(e)
		}
		a.done ? t(l) : Promise.resolve(l).then(r, s)
	}

	function ed(e) {
		return function() {
			var t = this,
				i = arguments;
			return new Promise(function(r, s) {
				var n = e.apply(t, i);

				function o(e) {
					eh(n, r, s, o, a, "next", e)
				}

				function a(e) {
					eh(n, r, s, o, a, "throw", e)
				}
				o(void 0)
			})
		}
	}
	let ep = ["amazonbot", "amazonproductbot", "app.hypefactors.com", "applebot", "archive.org_bot", "awariobot", "backlinksextendedbot", "baiduspider", "bingbot", "bingpreview", "chrome-lighthouse", "dataforseobot", "deepscan", "duckduckbot", "facebookexternal", "facebookcatalog", "http://yandex.com/bots", "hubspot", "ia_archiver", "leikibot", "linkedinbot", "meta-externalagent", "mj12bot", "msnbot", "nessus", "petalbot", "pinterestbot", "prerender", "rogerbot", "screaming frog", "sebot-wa", "sitebulb", "slackbot", "slurp", "trendictionbot", "turnitin", "twitterbot", "vercel-screenshot", "vercelbot", "yahoo! slurp", "yandexbot", "zoombot", "bot.htm", "bot.php", "(bot;", "bot/", "crawler", "ahrefsbot", "ahrefssiteaudit", "semrushbot", "siteauditbot", "splitsignalbot", "gptbot", "oai-searchbot", "chatgpt-user", "perplexitybot", "better uptime bot", "sentryuptimebot", "uptimerobot", "headlesschrome", "lightpanda", "cypress", "google-hoteladsverifier", "adsbot-google", "apis-google", "duplexweb-google", "feedfetcher-google", "google favicon", "google web preview", "google-read-aloud", "googlebot", "googleother", "google-cloudvertexbot", "googleweblight", "mediapartners-google", "storebot-google", "google-inspectiontool", "bytespider"],
		ef = new Map,
		eg = function(e, t = []) {
			if (!e) return !1;
			let i = function(e, t) {
					let i = "";
					for (let e = 0; t.length > e; e++) {
						let r = t[e];
						i += r.length + ":" + r
					}
					return e.length + ":" + e + "|" + t.length + ":" + i
				}(e, t),
				r = ef.get(i);
			if (void 0 !== r) return r;
			let s = e.toLowerCase(),
				n = ep.concat(t).some(e => -1 !== s.indexOf(e.toLowerCase()));
			return 256 > ef.size || ef.clear(), ef.set(i, n), n
		};

	function ev(e, t, i, r, s) {
		return t > i && (r.warn("min cannot be greater than max."), t = i), Q(e) ? e > i ? (r.warn(" cannot be  greater than max: " + i + ". Using max value instead."), i) : t > e ? (r.warn(" cannot be less than min: " + t + ". Using min value instead."), t) : e : (r.warn(" must be a number. using max or fallback. max: " + i + ", fallback: " + s), ev(null != s ? s : i, t, i, r))
	}
	var e_ = class {
		constructor(e) {
			this.C = {}, this.I = e.I, this.A = ev(e.bucketSize, 0, 100, e.R), this.O = ev(e.refillRate, 0, this.A, e.R), this.$ = ev(e.refillInterval, 0, 864e5, e.R)
		}
		F(e, t) {
			let i = Math.floor((t - e.lastAccess) / this.$);
			i > 0 && (e.tokens = Math.min(e.tokens + i * this.O, this.A), e.lastAccess = e.lastAccess + i * this.$)
		}
		consumeRateLimit(e) {
			var t;
			let i = Date.now(),
				r = String(e),
				s = this.C[r];
			return s ? this.F(s, i) : (s = {
				tokens: this.A,
				lastAccess: i
			}, this.C[r] = s), 0 === s.tokens || (s.tokens--, 0 === s.tokens && (null == (t = this.I) || t.call(this, e)), 0 === s.tokens)
		}
		stop() {
			this.C = {}
		}
	};
	let em = "Mobile",
		ey = "Android",
		eb = "Tablet",
		ew = "Android Tablet",
		ex = "iPad",
		ek = "Apple Watch",
		eE = "Safari",
		eS = "BlackBerry",
		e$ = "Samsung Internet",
		eF = "Chrome",
		eP = "Chrome iOS",
		eT = "Internet Explorer",
		eO = "Internet Explorer Mobile",
		eI = "Opera",
		eR = "Microsoft Edge",
		eC = "Firefox",
		eM = "Firefox iOS",
		eA = "Nintendo",
		eL = "PlayStation",
		eD = "Xbox",
		eN = "Android Mobile",
		ej = "Mobile Safari",
		ez = "Windows",
		eH = "Windows Phone",
		eU = "Nokia",
		eB = "Ouya",
		eq = "Generic tablet",
		eG = "Konqueror",
		eW = "Oculus Browser",
		eV = "Vivaldi",
		eJ = "Yandex",
		eK = "Whale",
		eY = "DuckDuckGo",
		eX = "Pale Moon",
		eZ = "Waterfox",
		eQ = "Brave",
		e0 = "Claude",
		e1 = "Codex",
		e2 = "ChatGPT",
		e3 = "Google Search App",
		e5 = RegExp("Version/(\\d+(\\.\\d+)?)"),
		e4 = RegExp("(Claude|Codex|ChatGPT)\\/(\\d+(\\.\\d+)?)"),
		e8 = RegExp(eD, "i"),
		e6 = RegExp("PlayStation \\w+", "i"),
		e9 = RegExp("Nintendo \\w+", "i"),
		e7 = RegExp("BlackBerry|PlayBook|BB10", "i"),
		te = {
			"NT3.51": "NT 3.11",
			"NT4.0": "NT 4.0",
			"5.0": "2000",
			5.1: "XP",
			5.2: "XP",
			"6.0": "Vista",
			6.1: "7",
			6.2: "8",
			6.3: "8.1",
			6.4: "10",
			"10.0": "10"
		},
		tt = function(e, t, i, r) {
			var s;
			return t = t || "", ((null == i ? void 0 : i.brave) ? eQ : null) || ((null == r ? void 0 : r.detectGoogleSearchApp) && D(e, "GSA/") ? e3 : D(e, " OPR/") && D(e, "Mini") ? "Opera Mini" : D(e, " OPR/") ? eI : e7.test(e) ? eS : D(e, "IEMobile") || D(e, "WPDesktop") ? eO : D(e, "OculusBrowser") ? eW : D(e, "SamsungBrowser") ? e$ : D(e, "Edge") || D(e, "Edg/") ? eR : D(e, "Vivaldi/") ? eV : D(e, "YaBrowser/") ? eJ : D(e, "Whale/") ? eK : D(e, "DuckDuckGo/") || D(e, "Ddg/") ? eY : D(e, "Claude/") ? e0 : D(e, "Codex/") ? e1 : D(e, "ChatGPT/") ? e2 : D(e, "FBIOS") ? "Facebook Mobile" : D(e, "UCWEB") || D(e, "UCBrowser") ? "UC Browser" : D(e, "CriOS") ? eP : D(e, "CrMo") || D(e, eF) ? eF : D(e, ey) && D(e, eE) ? eN : D(e, "FxiOS") ? eM : D(e.toLowerCase(), eG.toLowerCase()) ? eG : D(e, "Brave/") ? eQ : (s = t) && D(s, "Apple") || D(e, eE) && !D(e, eF) && !D(e, ey) ? D(e, em) ? ej : eE : D(e, "PaleMoon/") ? eX : D(e, "Waterfox/") ? eZ : D(e, eC) ? eC : D(e, "MSIE") || D(e, "Trident/") ? eT : D(e, "Gecko") ? eC : "")
		},
		ti = {
			[eO]: [RegExp("rv:(\\d+(\\.\\d+)?)")],
			[eR]: [RegExp("Edge?\\/(\\d+(\\.\\d+)?)")],
			[eF]: [RegExp("(Chrome|CrMo)\\/(\\d+(\\.\\d+)?)")],
			[eP]: [RegExp("CriOS\\/(\\d+(\\.\\d+)?)")],
			"UC Browser": [RegExp("(UCBrowser|UCWEB)\\/(\\d+(\\.\\d+)?)")],
			[eE]: [e5],
			[ej]: [e5],
			[eI]: [RegExp("(Opera|OPR)\\/(\\d+(\\.\\d+)?)")],
			[eC]: [RegExp("Firefox\\/(\\d+(\\.\\d+)?)")],
			[eM]: [RegExp("FxiOS\\/(\\d+(\\.\\d+)?)")],
			[eG]: [RegExp("Konqueror[:/]?(\\d+(\\.\\d+)?)", "i")],
			[eS]: [RegExp("BlackBerry (\\d+(\\.\\d+)?)"), e5],
			[eN]: [RegExp("android\\s(\\d+(\\.\\d+)?)", "i")],
			[e$]: [RegExp("SamsungBrowser\\/(\\d+(\\.\\d+)?)")],
			[eW]: [RegExp("OculusBrowser\\/(\\d+(\\.\\d+)?)")],
			[eV]: [RegExp("Vivaldi\\/(\\d+(\\.\\d+)?)")],
			[eJ]: [RegExp("YaBrowser\\/(\\d+(\\.\\d+)?)")],
			[eK]: [RegExp("Whale\\/(\\d+(\\.\\d+)?)")],
			[eQ]: [RegExp("Brave\\/(\\d+(\\.\\d+)?)")],
			[e0]: [e4],
			[e1]: [e4],
			[e2]: [e4],
			[eY]: [RegExp("(DuckDuckGo|Ddg)\\/(\\d+(\\.\\d+)?)")],
			[eX]: [RegExp("PaleMoon\\/(\\d+(\\.\\d+)?)")],
			[eZ]: [RegExp("Waterfox\\/(\\d+(\\.\\d+)?)")],
			[e3]: [RegExp("GSA\\/(\\d+(\\.\\d+)?)")],
			[eT]: [RegExp("(rv:|MSIE )(\\d+(\\.\\d+)?)")],
			Mozilla: [RegExp("rv:(\\d+(\\.\\d+)?)")]
		},
		tr = function(e, t, i, r) {
			let s = ti[tt(e, t, i, r)];
			if (J(s)) return null;
			for (let t = 0; s.length > t; t++) {
				let i = e.match(s[t]);
				if (i) return parseFloat(i[i.length - 2])
			}
			return null
		},
		ts = [
			[RegExp("Xbox; Xbox (.*?)[);]", "i"), e => [eD, e && e[1] || ""]],
			[RegExp(eA, "i"), [eA, ""]],
			[RegExp(eL, "i"), [eL, ""]],
			[e7, [eS, ""]],
			[RegExp(ez, "i"), (e, t) => {
				if (/Phone/.test(t) || /WPDesktop/.test(t)) return [eH, ""];
				if (new RegExp(em).test(t) && !/IEMobile\b/.test(t)) return ["Windows Mobile", ""];
				let i = /Windows NT ([0-9.]+)/i.exec(t);
				if (i && i[1]) {
					let e = te[i[1]] || "";
					return /arm/i.test(t) && (e = "RT"), [ez, e]
				}
				return [ez, ""]
			}],
			[/((iPhone|iPad|iPod).*?OS (\d+)_(\d+)_?(\d+)?|iPhone)/, e => e && e[3] ? ["iOS", [e[3], e[4], e[5] || "0"].join(".")] : ["iOS", ""]],
			[/(watch.*\/(\d+\.\d+\.\d+)|watch os,(\d+\.\d+),)/i, e => {
				let t = "";
				return e && e.length >= 3 && (t = J(e[2]) ? e[3] : e[2]), ["watchOS", t]
			}],
			[RegExp("(Android (\\d+)\\.(\\d+)\\.?(\\d+)?|Android)", "i"), e => e && e[2] ? [ey, [e[2], e[3], e[4] || "0"].join(".")] : [ey, ""]],
			[/Mac OS X (\d+)[_.](\d+)[_.]?(\d+)?/i, e => {
				let t = ["Mac OS X", ""];
				return e && e[1] && (t[1] = [e[1], e[2], e[3] || "0"].join(".")), t
			}],
			[/Mac/i, ["Mac OS X", ""]],
			[/CrOS/, ["Chrome OS", ""]],
			[/Linux|debian/i, ["Linux", ""]]
		],
		tn = function(e) {
			for (let t = 0; ts.length > t; t++) {
				let [i, r] = ts[t], s = i.exec(e), n = s && (G(r) ? r(s, e) : r);
				if (n) return n
			}
			return ["", ""]
		},
		to = function(e) {
			return e9.test(e) ? eA : e6.test(e) ? eL : e8.test(e) ? eD : RegExp(eB, "i").test(e) ? eB : RegExp("(Windows Phone|WPDesktop)", "i").test(e) ? eH : /iPad/.test(e) ? ex : /iPod/.test(e) ? "iPod Touch" : /iPhone/.test(e) ? "iPhone" : /(watch)(?: ?os[,/]|\d,\d\/)[\d.]+/i.test(e) ? ek : e7.test(e) ? eS : /(kobo)\s(ereader|touch)/i.test(e) ? "Kobo" : RegExp(eU, "i").test(e) ? eU : /(kf[a-z]{2}wi|aeo[c-r]{2})( bui|\))/i.test(e) || /(kf[a-z]+)( bui|\)).+silk\//i.test(e) ? "Kindle Fire" : /(Android|ZTE)/i.test(e) ? new RegExp(em).test(e) && !/(9138B|TB782B|Nexus [97]|pixel c|HUAWEISHT|BTV|noble nook|smart ultra 6)/i.test(e) || /pixel[\daxl ]{1,6}/i.test(e) && !/pixel c/i.test(e) || /(huaweimed-al00|tah-|APA|SM-G92|i980|zte|U304AA)/i.test(e) || /lmy47v/i.test(e) && !/QTAQZ3/i.test(e) ? ey : ew : RegExp("(pda|Mobile)", "i").test(e) ? "Generic mobile" : RegExp(eb, "i").test(e) && !RegExp("Tablet pc", "i").test(e) ? eq : ""
		},
		ta = function(e, t) {
			var i, r, s, n;
			let o = to(e);
			return o === ex || o === ew || "Kobo" === o || "Kindle Fire" === o || o === eq ? eb : o === eA || o === eD || o === eL || o === eB ? "Console" : o === ek ? "Wearable" : o ? em : "Android" === (null == t ? void 0 : t.userAgentDataPlatform) && (null != (n = null == t ? void 0 : t.maxTouchPoints) ? n : 0) > 0 ? 600 > Math.min(null != (i = null == t ? void 0 : t.screenWidth) ? i : 0, null != (r = null == t ? void 0 : t.screenHeight) ? r : 0) / (null != (s = null == t ? void 0 : t.devicePixelRatio) ? s : 1) ? em : eb : "Desktop"
		},
		tl = /\bFBAV\/(\d+(?:\.\d+)*)/i,
		tu = [
			[/\bInstagram(?:[ /](\d+(?:\.\d+)*))?\b/i, "Instagram"],
			[/\bBarcelona[ /](\d+(?:\.\d+)*)?/i, "Threads"],
			[/\b(?:MessengerForiOS|(?:FBAN|FB_IAB)\/Orca-Android)\b/i, "Messenger", tl],
			[/\bFBAN\/EMA\b/i, "Facebook Lite", tl],
			[/\b(?:FBIOS|(?:FBAN|FB_IAB)\/(?:FB4A|FBIOS))\b/i, "Facebook", tl],
			[/\bLinkedInApp(?:\]?\/(\d+(?:\.\d+)*))?\b/i, "LinkedIn"],
			[/\bTwitter(?:Android| for (?:iPhone|iPad|Android))(?:\/(\d+(?:\.\d+)*))?\b/i, "Twitter"],
			[/\b(?:musical_ly|trill)(?:[_/](\d+\.\d+(?:\.\d+)*))?(?=\b|_)/i, "TikTok", /\bapp_version\/(\d+(?:\.\d+)*)/i],
			[/\b(?:MicroMessenger|WeChat)\/(\d+(?:\.\d+)*)?/i, "WeChat"],
			[/\bLine\/(\d+(?:\.\d+)*)?/i, "Line"],
			[/\bGSA\/(\d+(?:\.\d+)*)?/i, "Google"],
			[/\[Pinterest\/(?:iOS|Android)\b|\bPinterest(?: for (?:Android(?: Tablet)?|iOS))?\/(\d+(?:\.\d+)*)/i, "Pinterest"],
			[/\b(?:WA4A|WAiOS)\/(\d+(?:\.\d+)*)?/i, "WhatsApp"],
			[/\bSnapchat[ /](\d+(?:\.\d+)*)?/i, "Snapchat"],
			[/\bBing(?:Web|Sapphire)\/(\d+(?:\.\d+)*)?/i, "Bing"],
			[/\bNAVER\(inapp; search;/i, "Naver", /\bNAVER\(inapp; search;[^;)]*; (\d+(?:\.\d+)*)/i],
			[/\bKAKAOTALK[ /](\d+\.\d+(?:\.\d+)*)?/i, "KakaoTalk"]
		],
		tc = "[Truncated]",
		th = "[Unserializable]";

	function td(e) {
		let t = "";
		for (let i = 0; e.length > i; i++) {
			let r = e.charCodeAt(i);
			if (55296 > r || r > 56319) t += 56320 > r || r > 57343 ? e[i] : "�";
			else {
				let r = e.charCodeAt(i + 1);
				56320 > r || r > 57343 ? t += "�" : (t += e[i] + e[i + 1], i++)
			}
		}
		return t
	}

	function tp(e, t) {
		if (!t) return e;
		let i = [];
		try {
			i = Object.keys(t)
		} catch (e) {
			i = []
		}
		for (let r of i) {
			let i;
			try {
				i = t[r]
			} catch (e) {
				i = th
			}
			Object.defineProperty(e, r, {
				value: i,
				enumerable: !0,
				writable: !0,
				configurable: !0
			})
		}
		return e
	}
	var tf = class {
		record(e) {
			if ("too-large" === e.kind) return;
			if ("retry-later" !== e.kind) return void this.reset();
			if (!e.retryAfterMs) return;
			let t = this.isOpen(),
				i = Date.now(),
				r = Math.min(e.retryAfterMs, 3e5);
			t ? this.es = Math.max(this.es, Math.min(i + r, this.ts + 3e5)) : (this.ts = i, this.es = i + r)
		}
		remainingMs() {
			let e = Date.now();
			if (this.ts - 5e3 > e) return this.reset(), 0;
			let t = Math.min(3e5, Math.max(0, this.es - e));
			return 0 === t && this.reset(), t
		}
		isOpen() {
			return this.remainingMs() > 0
		}
		reset() {
			this.es = 0, this.ts = 0
		}
		constructor() {
			this.es = 0, this.ts = 0
		}
	};
	let tg = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

	function tv(e, t) {
		return "string" == typeof e && tg.test(e) ? e : t()
	}

	function t_(e, t) {
		let i = Error(t);
		try {
			Object.defineProperty(i, "name", {
				value: e,
				writable: !0,
				enumerable: !0,
				configurable: !0
			})
		} catch (e) {}
		return i
	}

	function tm(e) {
		return e ? e.split("#")[0] : e
	}

	function ty(e) {
		try {
			return e()
		} catch (e) {
			return
		}
	}

	function tb(e, t) {
		let i = setTimeout(e, t);
		return null != i && i.unref && (null == i || i.unref()), i
	}

	function tw(e, t, i) {
		return tx.apply(this, arguments)
	}

	function tx() {
		return (tx = ed(function*(e, t, i) {
			let r;
			try {
				return yield Promise.race([e, new Promise((e, s) => {
					r = tb(() => {
						try {
							null == i || i(), e()
						} catch (e) {
							s(e)
						}
					}, t)
				})])
			} finally {
				clearTimeout(r)
			}
		})).apply(this, arguments)
	}

	function tk(e) {
		return (tk = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
			return typeof e
		} : function(e) {
			return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
		})(e)
	}

	function tE(e, t) {
		var i = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var r = Object.getOwnPropertySymbols(e);
			t && (r = r.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), i.push.apply(i, r)
		}
		return i
	}

	function tS(e) {
		for (var t = 1; arguments.length > t; t++) {
			var i = null != arguments[t] ? arguments[t] : {};
			t % 2 ? tE(Object(i), !0).forEach(function(t) {
				! function(e, t, i) {
					var r;
					(r = function(e) {
						if ("object" != tk(e) || !e) return e;
						var t = e[Symbol.toPrimitive];
						if (void 0 !== t) {
							var i = t.call(e, "string");
							if ("object" != tk(i)) return i;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return String(e)
					}(t), (t = "symbol" == tk(r) ? r : r + "") in e) ? Object.defineProperty(e, t, {
						value: i,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}): e[t] = i
				}(e, t, i[t])
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(i)) : tE(Object(i)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(i, t))
			})
		}
		return e
	}

	function t$(e, t, i) {
		return e && i ? t.length === Object.keys(i).length && t.every(t => e[t] === i[t]) : e === i
	}
	var tF = class {
		constructor(e, t, i = []) {
			this.coercers = e, this.stackParser = t, this.modifiers = i
		}
		buildFromUnknown(e, t = {}) {
			let i = t && t.mechanism || {
					handled: !0,
					type: "generic"
				},
				r = this.buildCoercingContext(i, t, 0).apply(e),
				s = this.buildParsingContext(t),
				n = this.parseStacktrace(r, s);
			return {
				$exception_list: this.convertToExceptionList(n, i),
				$exception_level: "error"
			}
		}
		modifyFrames(e) {
			var t = this;
			return ed(function*() {
				for (let i of e) i.stacktrace && i.stacktrace.frames && q(i.stacktrace.frames) && (i.stacktrace.frames = yield t.applyModifiers(i.stacktrace.frames));
				return e
			})()
		}
		coerceFallback(e) {
			var t;
			return {
				type: "Error",
				value: "Unknown error",
				stack: null == (t = e.syntheticException) ? void 0 : t.stack,
				synthetic: !0
			}
		}
		parseStacktrace(e, t) {
			var i;
			let r, s;
			if (null != e.cause && (r = this.parseStacktrace(e.cause, t)), "" != e.stack && null != e.stack) try {
				s = this.applyChunkIds(this.stackParser(e.stack, e.synthetic ? t.skipFirstLines : 0), t.chunkIdMap)
			} catch (e) {}
			return tS(tS({}, e), {}, {
				cause: r,
				stack: s,
				errors: null == (i = e.errors) ? void 0 : i.map(e => this.parseStacktrace(e, t))
			})
		}
		applyChunkIds(e, t) {
			return e.map(e => (e.filename && t && (e.chunk_id = t[e.filename]), e))
		}
		applyCoercers(e, t) {
			for (let i of this.coercers)
				if (i.match(e)) return i.coerce(e, t);
			return this.coerceFallback(t)
		}
		applyModifiers(e) {
			var t = this;
			return ed(function*() {
				let i = e;
				for (let e of t.modifiers) i = yield e(i);
				return i
			})()
		}
		convertToExceptionList(e, t) {
			let i = [],
				r = (e, s, n) => {
					var o;
					let a = i.length,
						l = void 0 === s ? tS(tS({
							type: "string" == typeof t.type && t.type.length > 0 ? t.type : "generic"
						}, "boolean" == typeof t.handled ? {
							handled: t.handled
						} : void 0 === t.handled ? {
							handled: !0
						} : {}), {}, {
							synthetic: "boolean" == typeof t.synthetic ? t.synthetic : e.synthetic,
							exception_id: a
						}) : {
							type: "chained",
							source: n,
							synthetic: e.synthetic,
							exception_id: a,
							parent_id: s
						},
						u = {
							type: e.type,
							value: e.value,
							mechanism: l
						};
					for (let t of (e.stack && (u.stacktrace = {
							type: "raw",
							frames: e.stack
						}), i.push(u), e.cause && r(e.cause, a, "cause"), null != (o = e.errors) ? o : [])) r(t, a, "member")
				};
			return r(e), i
		}
		buildParsingContext(e) {
			var n;
			return {
				chunkIdMap: function(e) {
					let n = globalThis._posthogChunkIds,
						o = globalThis._debugIds;
					if (!n && !o) return;
					let a = n ? Object.keys(n) : [],
						l = o ? Object.keys(o) : [];
					if (s && t$(n, a, i) && t$(o, l, r)) return s;
					i = n ? tS({}, n) : void 0, r = o ? tS({}, o) : void 0, s = {}, null != t || (t = {});
					let u = (i, r) => {
						for (let o of i) {
							let i = r[o];
							if (!i) continue;
							let a = null == t ? void 0 : t[o];
							if (a) {
								s[a] = i;
								continue
							}
							let l = e(o);
							for (let e = l.length - 1; e >= 0; e--) {
								var n;
								let r = null == (n = l[e]) ? void 0 : n.filename;
								if (r) {
									s[r] = i, t[o] = r;
									break
								}
							}
						}
					};
					return o && u(l, o), n && u(a, n), s
				}(this.stackParser),
				skipFirstLines: null != (n = e.skipFirstLines) ? n : 1
			}
		}
		getAggregateErrors(e) {
			try {
				if (eo(e)) {
					let i = Object.getPrototypeOf(e);
					for (let r = 0; i && 100 > r; r++) {
						var t;
						let r = null == (t = Object.getOwnPropertyDescriptor(i, "constructor")) ? void 0 : t.value;
						if ("function" == typeof r && "AggregateError" === r.name) {
							let t = e.errors;
							return q(t) ? t : void 0
						}
						i = Object.getPrototypeOf(i)
					}
				}
			} catch (e) {}
		}
		buildCoercingContext(e, t, i = 0) {
			let r = 0,
				s = 0,
				n = !1,
				o = new Set,
				a = [],
				l = {},
				u = (e, t, i = 0) => {
					let u, h, d = c(t, i),
						p = d.apply;
					if (d.apply = t => {
							a.push(e);
							try {
								return p(t)
							} finally {
								a.pop()
							}
						}, i > 4 || i > 0 && -1 !== a.indexOf(e)) return this.coerceFallback(d);
					let f = "object" == typeof e && null !== e || "function" == typeof e;
					if (0 === i && r >= 50 || f && o.has(e)) return;
					f && o.add(e), 0 === i && r++;
					let g = this.getAggregateErrors(e);
					n || (n = !!g);
					try {
						if (!(u = this.applyCoercers(e, d))) throw l
					} catch (e) {
						if (e === l) return void(0 === i && r--);
						if (!n) throw e;
						u = this.coerceFallback(d)
					}
					if (!g || r >= 50) return u;
					try {
						h = g.length
					} catch (e) {
						return u
					}
					if (!Number.isInteger(h) || 0 > h || h > 0xffffffff) return u;
					let v = [];
					for (let e = 0; 50 > r && 1e3 > s && h > e; e++) {
						let i;
						s++;
						try {
							i = d.next(g[e])
						} catch (e) {
							r++, i = this.coerceFallback(c(t + 1))
						}
						i && v.push(i)
					}
					return tS(tS({}, u), {}, {
						errors: v
					})
				},
				c = (i, r = 0) => tS(tS({}, t), {}, {
					syntheticException: 0 == i ? t.syntheticException : void 0,
					mechanism: 0 == i ? e : {},
					apply(e) {
						let t = u(e, i, r + 1);
						if (!t) throw l;
						return t
					},
					next: e => u(e, i + 1)
				}),
				h = c(i);
			return tS(tS({}, h), {}, {
				apply: e => {
					var t;
					return null != (t = u(e, i)) ? t : this.coerceFallback(h)
				}
			})
		}
	};
	let tP = /^([a-z][a-z0-9.+-]+):/i,
		tT = ["http", "https", "file", "blob", "app", "capacitor", "ionic", "webpack", "webpack-internal", "ng"];

	function tO(e, t, i, r, s) {
		let n = {
			platform: e,
			filename: t,
			function: "<anonymous>" === i ? "?" : i,
			in_app: function(e) {
				if (!e || "<anonymous>" === e) return !1;
				let t = tP.exec(e);
				return !t || tT.includes(t[1].toLowerCase())
			}(t)
		};
		return J(r) || (n.lineno = r), J(s) || (n.colno = s), n
	}
	let tI = (e, t) => {
			let i = -1 !== e.indexOf("safari-extension"),
				r = -1 !== e.indexOf("safari-web-extension");
			return i || r ? [-1 !== e.indexOf("@") ? e.split("@")[0] : "?", i ? `safari-extension:${t}` : `safari-web-extension:${t}`] : [e, t]
		},
		tR = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i,
		tC = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
		tM = /\((\S*)(?::(\d+))(?::(\d+))\)/,
		tA = (e, t) => {
			let i = tR.exec(e);
			if (i) {
				let [, e, r, s] = i;
				return tO(t, e, "?", +r, +s)
			}
			let r = tC.exec(e);
			if (r) {
				if (r[2] && 0 === r[2].indexOf("eval")) {
					let e = tM.exec(r[2]);
					e && (r[2] = e[1], r[3] = e[2], r[4] = e[3])
				}
				let [e, i] = tI(r[1] || "?", r[2]);
				return tO(t, i, e, r[3] ? +r[3] : void 0, r[4] ? +r[4] : void 0)
			}
		},
		tL = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i,
		tD = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
		tN = (e, t) => {
			let i = tL.exec(e);
			if (i) {
				if (i[3] && i[3].indexOf(" > eval") > -1) {
					let e = tD.exec(i[3]);
					e && (i[1] = i[1] || "eval", i[3] = e[1], i[4] = e[2], i[5] = "")
				}
				let e = i[3],
					r = i[1] || "?";
				return [r, e] = tI(r, e), tO(t, e, r, i[4] ? +i[4] : void 0, i[5] ? +i[5] : void 0)
			}
		},
		tj = /\(error: (.*)\)/;

	function tz(e, t) {
		return e.filename === t.filename && e.function === t.function && e.module === t.module && e.lineno === t.lineno && e.colno === t.colno
	}

	function tH(e, t) {
		let i = t.start;
		for (; i > 0 && tz(e[i - 1], e[i - 1 + t.length]);) i--;
		return t.start - i
	}

	function tU(e, t) {
		let i = t.start + t.length,
			r = i;
		for (; e.length > r && tz(e[r], e[r - t.length]);) r++;
		return r - i
	}
	var tB = class {
			match(e) {
				return this.isDOMException(e) || this.isDOMError(e)
			}
			coerce(e, t) {
				let i = K(e.stack);
				return {
					type: this.getType(e),
					value: this.getValue(e),
					stack: i ? e.stack : void 0,
					cause: e.cause ? t.next(e.cause) : void 0,
					synthetic: !1
				}
			}
			getType(e) {
				return this.isDOMError(e) ? "DOMError" : "DOMException"
			}
			getValue(e) {
				let t = e.name || (this.isDOMError(e) ? "DOMError" : "DOMException");
				return e.message ? `${t}: ${e.message}` : t
			}
			isDOMException(e) {
				return en(e, "DOMException")
			}
			isDOMError(e) {
				return en(e, "DOMError")
			}
		},
		tq = class {
			match(e) {
				return eo(e)
			}
			coerce(e, t) {
				var i;
				let r = this.getStack(e),
					s = void 0 === r ? null == (i = t.syntheticException) ? void 0 : i.stack : void 0;
				return {
					type: this.getType(e),
					value: this.getMessage(e, t),
					stack: null != r ? r : s,
					cause: e.cause ? t.next(e.cause) : void 0,
					synthetic: !!s
				}
			}
			getType(e) {
				return e.name || e.constructor.name
			}
			getMessage(e, t) {
				let i = e.message;
				return String(i.error && "string" == typeof i.error.message ? i.error.message : i)
			}
			getStack(e) {
				try {
					let t = e.stacktrace;
					if ("string" == typeof t && t.length > 0) return t;
					let i = e.stack;
					return "string" == typeof i && i.length > 0 ? i : void 0
				} catch (e) {
					return
				}
			}
		},
		tG = class {
			match(e) {
				return !!en(e, "ErrorEvent") && (null != e.error || this.yr(e))
			}
			coerce(e, t) {
				var i;
				if (null != e.error) return t.apply(e.error);
				let r = t.apply(e.message);
				return tS(tS({}, r), {}, {
					stack: null != (i = this.br(e)) ? i : r.stack,
					synthetic: !0
				})
			}
			yr(e) {
				return K(e.message) && e.message.length > 0
			}
			br(e) {
				var t, i;
				let r = null != (t = e.lineno) ? t : 0,
					s = null != (i = e.colno) ? i : 0;
				if (K(e.filename) && 0 !== e.filename.length && 0 !== r) return `Error
    at ${e.filename}:${r}:${s}`
			}
		};
	let tW = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
	var tV = class {
		match(e) {
			return "string" == typeof e
		}
		coerce(e, t) {
			var i;
			let [r, s] = this.getInfos(e);
			return {
				type: null != r ? r : "Error",
				value: null != s ? s : e,
				stack: null == (i = t.syntheticException) ? void 0 : i.stack,
				synthetic: !0
			}
		}
		getInfos(e) {
			let t = "Error",
				i = e,
				r = e.match(tW);
			return r && (t = r[1], i = r[2]), [t, i]
		}
	};
	let tJ = ["fatal", "error", "warning", "log", "info", "debug"];

	function tK(e, t = 40) {
		let i = Object.keys(e);
		if (i.sort(), !i.length) return "[object has no keys]";
		for (let e = i.length; e > 0; e--) {
			let r = i.slice(0, e).join(", ");
			if (t >= r.length) return e === i.length ? r : r.length > t ? `${r.slice(0,t)}...` : r
		}
		return ""
	}
	var tY = class {
			match(e) {
				return "object" == typeof e && null !== e
			}
			coerce(e, t) {
				var i, r;
				let s = this.getErrorPropertyFromObject(e);
				return s ? t.apply(s) : {
					type: this.getType(e),
					value: this.getValue(e),
					stack: null != (i = this.getStack(e)) ? i : null == (r = t.syntheticException) ? void 0 : r.stack,
					level: this.isSeverityLevel(e.level) ? e.level : "error",
					synthetic: !0
				}
			}
			getType(e) {
				if (ea(e)) return e.constructor.name;
				let t = "name" in e ? e.name : void 0;
				return K(t) && !Y(t) ? t : "Error"
			}
			getValue(e) {
				if ("name" in e && "string" == typeof e.name) {
					let t = `'${e.name}' captured as exception`;
					return "message" in e && "string" == typeof e.message && (t += ` with message: '${e.message}'`), t
				}
				if ("message" in e && "string" == typeof e.message) return e.message;
				let t = this.getObjectClassName(e);
				return `${t&&"Object"!==t?`'${t}'`:"Object"} captured as exception with keys: ${tK(e)}`
			}
			isSeverityLevel(e) {
				return K(e) && !Y(e) && tJ.indexOf(e) >= 0
			}
			getStack(e) {
				try {
					return K(e.stacktrace) && e.stacktrace.length > 0 ? e.stacktrace : K(e.stack) && e.stack.length > 0 ? e.stack : void 0
				} catch (e) {
					return
				}
			}
			getErrorPropertyFromObject(e) {
				for (let t in e)
					if (({}).hasOwnProperty.call(e, t)) {
						let i = e[t];
						if (eo(i)) return i
					}
			}
			getObjectClassName(e) {
				try {
					let t = Object.getPrototypeOf(e);
					return t ? t.constructor.name : void 0
				} catch (e) {
					return
				}
			}
		},
		tX = class {
			match(e) {
				return ea(e)
			}
			coerce(e, t) {
				var i;
				let r = e.constructor.name;
				return {
					type: r,
					value: `${r} captured as exception with keys: ${tK(e)}`,
					stack: null == (i = t.syntheticException) ? void 0 : i.stack,
					synthetic: !0
				}
			}
		},
		tZ = class {
			match(e) {
				return es(e)
			}
			coerce(e, t) {
				var i;
				return {
					type: "Error",
					value: `Primitive value captured as exception: ${String(e)}`,
					stack: null == (i = t.syntheticException) ? void 0 : i.stack,
					synthetic: !0
				}
			}
		},
		tQ = class {
			match(e) {
				return en(e, "PromiseRejectionEvent") || this.isCustomEventWrappingRejection(e)
			}
			isCustomEventWrappingRejection(e) {
				if (!ea(e)) return !1;
				try {
					let t = e.detail;
					return null != t && "object" == typeof t && "reason" in t
				} catch (e) {
					return !1
				}
			}
			coerce(e, t) {
				var i;
				let r = this.getUnhandledRejectionReason(e);
				return es(r) ? {
					type: "UnhandledRejection",
					value: `Non-Error promise rejection captured with value: ${String(r)}`,
					stack: null == (i = t.syntheticException) ? void 0 : i.stack,
					synthetic: !0
				} : t.apply(r)
			}
			getUnhandledRejectionReason(e) {
				try {
					if ("reason" in e) return e.reason;
					if ("detail" in e && null != e.detail && "object" == typeof e.detail && "reason" in e.detail) return e.detail.reason
				} catch (e) {}
				return e
			}
		};
	let t0 = "$message",
		t1 = "$timestamp",
		t2 = new Set([t0, t1]),
		t3 = {
			enabled: !0,
			max_bytes: 32768
		};

	function t5(e) {
		var t;
		return e ? {
			enabled: null != (t = e.enabled) ? t : t3.enabled,
			max_bytes: function(e, t) {
				if (!Q(e) || 1 / 0 === e || -1 / 0 === e) return t;
				let i = Math.floor(e);
				return 0 > i ? t : i
			}(e.max_bytes, t3.max_bytes)
		} : tS({}, t3)
	}
	var t4 = class {
		constructor(e) {
			this.ns = [], this.ss = 0, this.Fr = t5(e)
		}
		setConfig(e) {
			this.Fr = t5(e), this.rs()
		}
		add(e) {
			let t = function(e) {
				let t;
				try {
					t = z(e)
				} catch (e) {
					return
				}
				try {
					let e = JSON.parse(t);
					if (!W(e)) return;
					let i = e[t0],
						r = e[t1];
					if (!K(i) || 0 === i.trim().length || !K(r) && !Q(r)) return;
					return {
						step: e,
						json: t
					}
				} catch (e) {
					return
				}
			}(e);
			if (!t) return;
			let i = function(e) {
				if ("u" > typeof TextEncoder) return (new TextEncoder).encode(e).length;
				let t = encodeURIComponent(e),
					i = 0;
				for (let e = 0; t.length > e; e++) "%" === t[e] ? (i += 1, e += 2) : i += 1;
				return i
			}(t.json);
			i > this.Fr.max_bytes || (this.ns.push({
				step: t.step,
				bytes: i
			}), this.ss += i, this.rs())
		}
		getAttachable() {
			return this.ns.map(e => e.step)
		}
		clear() {
			this.ns = [], this.ss = 0
		}
		size() {
			return this.ns.length
		}
		rs() {
			for (; this.ss > this.Fr.max_bytes && this.ns.length > 0;) {
				let e = this.ns.shift();
				e && (this.ss -= e.bytes)
			}
		}
	};
	let t8 = e => {
		if ("string" != typeof e) return e;
		try {
			return JSON.parse(e)
		} catch (t) {
			return e
		}
	};

	function t6(e) {
		return "string" == typeof e || e
	}

	function t9(e) {
		return "string" == typeof e ? e : void 0
	}
	let t7 = ["$feature_flag", "$feature_flag_response", "$feature_flag_has_experiment", "$feature_flag_id", "$feature_flag_version", "$feature_flag_reason", "$feature_flag_request_id", "$feature_flag_evaluated_at", "$feature_flag_error", "locally_evaluated", "$groups", "$process_person_profile", "$geoip_disable", "$current_url", "$pathname", "$referring_domain", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid", "gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "oppref", "bfcid", "irclid", "_kx", "$session_id", "$window_id", "$lib", "$lib_version", "$device_id", "$is_server"],
		ie = "NativeGzipValidationError",
		it = e => e.length >= 2 && 31 === e[0] && 139 === e[1],
		ii = (e, t) => e === M.GZipJS || t === M.GZipJS || "gzip" === t,
		ir = e => !(!e || "object" != typeof e) && "NotReadableError" === ("name" in e ? String(e.name) : ""),
		is = e => {
			throw t_(ie, `Native gzip produced invalid output: ${e}`)
		},
		io = (g = ed(function*(e, t) {
			18 > e.size && is("too-short");
			let i = new Uint8Array((yield e.slice(0, 10).arrayBuffer()));
			it(i) && 8 === i[2] || is("invalid-header");
			let r = new DataView((yield e.slice(e.size - 8).arrayBuffer()));
			r.getUint32(0, !0) !== (e => {
				let t = (() => {
						if (n) return n;
						n = [];
						for (let e = 0; 256 > e; e++) {
							let t = e;
							for (let e = 0; 8 > e; e++) t = 1 & t ? 0xedb88320 ^ t >>> 1 : t >>> 1;
							n[e] = t >>> 0
						}
						return n
					})(),
					i = 0xffffffff;
				for (let r = 0; e.length > r; r++) i = t[255 & (i ^ e[r])] ^ i >>> 8;
				return (0xffffffff ^ i) >>> 0
			})(t) && is("invalid-crc");
			let s = t.length >>> 0;
			r.getUint32(4, !0) !== s && is("invalid-size")
		}), function(e, t) {
			return g.apply(this, arguments)
		});

	function ia() {
		return (ia = ed(function*(e, t = !0, i) {
			var r;
			try {
				let t = (new TextEncoder).encode(e),
					i = new globalThis.CompressionStream("gzip"),
					s = i.writable.getWriter(),
					n = s.write(t).then(() => s.close()).catch((r = ed(function*(e) {
						try {
							yield s.abort(e)
						} catch (e) {}
						throw e
					}), function(e) {
						return r.apply(this, arguments)
					})),
					o = new Response(i.readable).blob(),
					[a] = yield Promise.all([o, n]);
				return yield io(a, t), a
			} catch (e) {
				if (null == i ? void 0 : i.rethrow) throw e;
				return t && console.error("Failed to gzip compress data", e), null
			}
		})).apply(this, arguments)
	}

	function il(e, t) {
		if (null == e) return {};
		var i, r, s = function(e, t) {
			if (null == e) return {};
			var i = {};
			for (var r in e)
				if (({}).hasOwnProperty.call(e, r)) {
					if (t.includes(r)) continue;
					i[r] = e[r]
				} return i
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			for (r = 0; n.length > r; r++) t.includes(i = n[r]) || ({}).propertyIsEnumerable.call(e, i) && (s[i] = e[i])
		}
		return s
	}
	let iu = "[redacted]",
		ic = /^[A-Za-z0-9+/\n\r]+=*$/,
		ih = /^[A-Za-z0-9_-]+={0,2}$/,
		id = /[-_]/,
		ip = /^data:[^,\s]*;base64,/i,
		ig = /^[A-Za-z0-9+/_-]+={0,2}$/,
		iv = /\bph[a-z]_[A-Za-z0-9_-]{20,}\b/g,
		i_ = /^(authorization|cookie|set-cookie|x-api-key|api[-_]?key|api[-_]?token|access[-_]?token|refresh[-_]?token|token|password|secret|client[-_]?secret|private[-_]?key)$/i,
		im = /[a-z][a-z0-9+.-]{0,63}:[^\s<>"]+/gi,
		iy = /[\s<>"]/,
		ib = RegExp(im.source, "i"),
		iw = /[a-z][a-z0-9+.-]{0,63}:\/\//i,
		ix = RegExp(`^${iw.source}`, "i"),
		ik = RegExp(iw.source, "gi"),
		iE = /(^|[-_./;])(auth|token|secret|password|passwd|pwd|credential|signature|sig|key|hmac|sas|bearer|jwt|session|sessionid)([-_./;]|$)/i,
		iS = /^(code|AWSAccessKeyId|GoogleAccessId|Policy)$/i,
		i$ = /[\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000]/g,
		iF = /[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9.-]{1,255}\.[A-Za-z]{2,24}/g,
		iP = /\b(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\b/g,
		iT = /(^|[^\w:])((?:(?:[0-9A-Fa-f]{1,4}:){7}[0-9A-Fa-f]{1,4}|(?:[0-9A-Fa-f]{1,4}:){1,7}:|(?:[0-9A-Fa-f]{1,4}:){1,6}:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4}){0,5}|::(?:[0-9A-Fa-f]{1,4}(?::[0-9A-Fa-f]{1,4}){0,6})))(?=$|[^\w:])/g,
		iO = /\b\d{3}[ .-]\d{2}[ .-]\d{4}\b/g,
		iI = /\b\d(?:[ ./-]?\d){12,}\b/g,
		iR = /\d+/g,
		iC = /(^|[^\w+])((?:\+?1[ ./-]?)?(?:\(\d{3}\)[ ./-]?|\d{3}[ ./-])\d{3}[ ./-]\d{4})(?![\w])/g,
		iM = /(^|[^\w])(\+\d{1,3}(?:[ ./()-]{0,2}\d){7,13})(?![\w])/g;

	function iA(e) {
		return i_.test(e) || iE.test(e) || iS.test(e)
	}

	function iL(e) {
		return e.split("&", 129).length > 128
	}

	function iD(e, t) {
		let i = new URLSearchParams,
			r = !1,
			s = !1;
		for (let [l, u] of new URLSearchParams(e)) {
			var n, o, a;
			let e = iH(l),
				c = iH(u);
			r || (r = e !== l || c !== u);
			let h = (n = e, o = c, a = t, iA(n) || o.includes(";") && o.split(";").some(e => iA(e.split("=", 1)[0])) ? iu : ib.test(o) ? a ? iz(o, {
				allowNestedUrls: !1,
				stripPunctuation: !0
			}) : iu : o);
			r || (r = h !== c), s = iA(e) || h !== c, i.append(e, h)
		}
		return {
			changed: r,
			lastFieldSensitive: s,
			serialized: i.toString()
		}
	}

	function iN(e, t) {
		if (!e.includes("=")) {
			var i;
			return {
				value: (i = e, t ? iz(i, {
					allowNestedUrls: !1,
					stripPunctuation: !0
				}) : ib.test(i) ? iu : i),
				lastFieldSensitive: !1
			}
		}
		let r = iD(e, t);
		return {
			value: r.changed ? r.serialized : e,
			lastFieldSensitive: r.lastFieldSensitive
		}
	}

	function ij(e, t) {
		var i, r;
		let s, n, o;
		if (e.length > 8192 && ix.test(e)) return iu;
		let {
			address: a,
			suffix: l
		} = t.stripPunctuation ? function(e) {
			let t = e.length;
			for (; t > 0 && ".,;:!?)]}'".includes(e[t - 1]);) t--;
			return {
				address: e.slice(0, t),
				suffix: e.slice(t)
			}
		}(e) : {
			address: e,
			suffix: ""
		};
		try {
			s = new URL(a)
		} catch (e) {
			return iu + l
		}
		let u = s.search.slice(1),
			c = "" !== s.hash,
			h = 0 > (o = (n = s.hash.slice(1)).indexOf("?")) ? {
				head: n,
				tail: null
			} : {
				head: n.slice(0, o),
				tail: n.slice(o + 1)
			};
		if (iL(u) || iL(h.head) || iL(null != (i = h.tail) ? i : "")) return iu + l;
		let d = !1;
		(s.username || s.password) && (s.username = iu, s.password = "", d = !0);
		let p = iD(u, t.allowNestedUrls);
		p.changed && (s.search = p.serialized, d = !0);
		let f = iN(h.head, t.allowNestedUrls),
			g = null === h.tail ? null : (r = h.tail, f.lastFieldSensitive ? {
				value: "" === r ? "" : iu,
				lastFieldSensitive: !0
			} : iN(r, t.allowNestedUrls)),
			v = null === g ? f.value : `${f.value}?${g.value}`;
		v !== s.hash.slice(1) && (s.hash = v, d = !0);
		let _ = c ? null != g ? g : f : p;
		return (d ? iH(s.toString()) : a) + (_.lastFieldSensitive ? "" : l)
	}

	function iz(e, t) {
		return e.replace(im, i => (function(e, t) {
			let i = function(e) {
				if (!e.includes("://")) return [];
				let t = [...e.matchAll(ik)].map(e => e.index),
					i = [],
					r = {
						query: !1,
						fragment: !1,
						fragmentQuery: !1
					},
					s = 0,
					n = !1,
					o = "";
				for (let l = 0; e.length > l && t.length > s; l++) {
					var a;
					t[s] === l && (l > 0 && "=" !== o && i.push(l), s++);
					let u = e[l];
					(a = o, "#" === u ? !r.fragment && (r.fragment = !0) : "?" === u && (r.fragment ? "=" !== a && !r.fragmentQuery && (r.fragmentQuery = !0) : !r.query && (r.query = !0))) ? (o = u, n = !0) : n && "=&".includes(u) && (o = u)
				}
				return i
			}(e);
			if (0 === i.length) return ij(e, t);
			let r = "",
				s = 0;
			for (let n of i) r += ij(e.slice(s, n), tS(tS({}, t), {}, {
				stripPunctuation: !1
			})), s = n;
			return r + ij(e.slice(s), t)
		})(i, tS(tS({}, t), {}, {
			stripPunctuation: t.stripPunctuation && i.length !== e.length
		})))
	}

	function iH(e) {
		return e.replace(iv, iu)
	}

	function iU(e, t) {
		return e.length >= 10240 && (ic.test(e) || function(e) {
			let t, i = ip.exec(e);
			if (!i) return !1;
			try {
				t = decodeURIComponent(e.slice(i[0].length))
			} catch (e) {
				return !1
			}
			return ig.test(t.replace(/[\r\n]/g, ""))
		}(e) || id.test(e) && ih.test(e)) ? "[binary data redacted - not supported by PostHog MCP analytics]" : function(e, t, i) {
			let r = 4 * i.maxStringLength;
			if (e.length > r) {
				let s = t(e.slice(0, function(e, t) {
					let i = t;
					for (; i > 0 && !iy.test(e[i - 1]);) i--;
					return i
				}(e, r)));
				if (s.length >= 2 * i.maxStringLength) return s + i.truncationSuffix
			}
			return t(e)
		}(e, e => iz(iH(e).replace(i$, " ").replace(iF, iu).replace(iP, iu).replace(iT, `$1${iu}`).replace(iI, iB).replace(iO, iu).replace(iC, `$1${iu}`).replace(iM, `$1${iu}`), {
			allowNestedUrls: !0,
			stripPunctuation: !0
		}), t)
	}

	function iB(e) {
		let t = [];
		for (let i = iR.exec(e); null !== i; i = iR.exec(e)) t.push({
			digits: i[0],
			start: i.index,
			end: i.index + i[0].length
		});
		let i = "",
			r = 0,
			s = 0;
		for (; t.length > s;) {
			let n = "",
				o = -1;
			for (let e = s; t.length > e && 19 >= (n += t[e].digits).length; e++) n.length >= 13 && function(e) {
				let t = 0,
					i = !1;
				for (let r = e.length - 1; r >= 0; r--) {
					let s = e.charCodeAt(r) - 48;
					if (0 > s || s > 9) return !1;
					i && (s *= 2) > 9 && (s -= 9), t += s, i = !i
				}
				return t % 10 == 0
			}(n) && (o = e);
			0 > o ? s++ : (i += e.slice(r, t[s].start) + iu, r = t[o].end, s = o + 1)
		}
		return i + e.slice(r)
	}
	let iq = {}.propertyIsEnumerable;

	function iG(e, t) {
		try {
			return iW(e, t, {
				ancestors: new WeakSet,
				remainingNodes: 1e4
			}, 0)
		} catch (e) {
			return []
		}
	}

	function iW(e, t, i, r) {
		let s = [];
		for (let n in e)
			if (iq.call(e, n)) {
				if (!n) {
					null == t || t.debug("Dropping an attribute with an empty key");
					continue
				}
				if (s.length >= 1e3 || 0 >= i.remainingNodes) {
					null == t || t.debug("Attributes truncated: the value exceeds the OTLP encoder budget");
					break
				}
				try {
					let o = e[n];
					if (X(o) || J(o)) continue;
					s.push({
						key: td(n),
						value: function e(t, i, r, s) {
							if (0 >= r.remainingNodes) return {
								stringValue: tc
							};
							if (r.remainingNodes--, et(t)) return {
								boolValue: t
							};
							if ("bigint" == typeof t) {
								let e, r;
								return e = t.toString(), t >= (r = BigInt("9223372036854775808")) || -r > t ? (null == i || i.debug(`Attribute ${e} is outside the int64 range; encoding it as a string`), {
									stringValue: e
								}) : {
									intValue: e
								}
							}
							if ("number" == typeof t) {
								if (!Number.isFinite(t)) return {
									stringValue: String(t)
								};
								if (Number.isInteger(t)) {
									if (Number.isSafeInteger(t)) return {
										intValue: String(t)
									};
									if (typeof BigInt > "u") return {
										stringValue: String(t)
									};
									let e = BigInt(t).toString();
									return t >= 0x8000000000000000 || -0x8000000000000000 > t ? (null == i || i.debug(`Attribute ${e} is outside the int64 range; encoding it as a string`), {
										stringValue: e
									}) : {
										intValue: e
									}
								}
								return {
									doubleValue: t
								}
							}
							if ("string" == typeof t) return {
								stringValue: td(t)
							};
							if ("function" == typeof t) return {
								stringValue: "[Function]"
							};
							if ("symbol" == typeof t) return {
								stringValue: String(t)
							};
							if ("object" == typeof t && null !== t) {
								if (r.ancestors.has(t)) return {
									stringValue: "[Circular]"
								};
								if (s >= 20) return {
									stringValue: tc
								};
								if (t instanceof Date) {
									let e = Number.isFinite(t.getTime()) ? t.toISOString() : String(t);
									return {
										stringValue: "string" == typeof e ? td(e) : String(e)
									}
								}
								r.ancestors.add(t);
								try {
									try {
										let n = t.toJSON;
										if ("function" == typeof n) return e(n.call(t), i, r, s + 1)
									} catch (e) {}
									return q(t) ? {
										arrayValue: {
											values: function(t, i, r, s) {
												let n = [],
													o = Math.min(t.length, 1e3),
													a = 0;
												for (; o > a && r.remainingNodes > 0; a++) try {
													let o = a in t ? t[a] : void 0;
													if (Z(o)) continue;
													n.push(e(o, i, r, s))
												} catch (e) {
													n.push({
														stringValue: th
													})
												}
												return t.length > a && n.push({
													stringValue: tc
												}), n
											}(t, i, r, s + 1)
										}
									} : {
										kvlistValue: {
											values: iW(t, i, r, s + 1)
										}
									}
								} finally {
									r.ancestors.delete(t)
								}
							}
							return {
								stringValue: td(String(t))
							}
						}(o, t, i, r)
					})
				} catch (e) {
					s.push({
						key: td(n),
						value: {
							stringValue: th
						}
					})
				}
			} return s
	}

	function iV(e, t, i) {
		return tS(tS(tS(tS({}, tp({}, e.resourceAttributes)), {}, {
			"service.name": e.serviceName || "unknown_service"
		}, e.environment && {
			"deployment.environment": e.environment
		}), e.serviceVersion && {
			"service.version": e.serviceVersion
		}), {}, {
			"telemetry.sdk.name": t,
			"telemetry.sdk.version": i
		})
	}
	let iJ = ["service.name", "deployment.environment", "service.version", "telemetry.sdk.name", "telemetry.sdk.version"];

	function iK(e, t) {
		let i = tp({}, e),
			r = {};
		for (let e of iJ)({}).hasOwnProperty.call(i, e) && (r[e] = i[e], delete i[e]);
		return [...iG(i, t), ...iG(r, t)]
	}
	let iY = {
			darwin: "macOS",
			win32: "Windows",
			cygwin: "Windows",
			linux: "Linux",
			android: "Android",
			freebsd: "FreeBSD",
			openbsd: "OpenBSD",
			netbsd: "NetBSD",
			sunos: "SunOS",
			aix: "AIX",
			haiku: "Haiku",
			"Mac OS X": "macOS"
		},
		iX = {
			text: "INFO",
			number: 9
		},
		iZ = {
			trace: {
				text: "TRACE",
				number: 1
			},
			debug: {
				text: "DEBUG",
				number: 5
			},
			info: iX,
			warn: {
				text: "WARN",
				number: 13
			},
			error: {
				text: "ERROR",
				number: 17
			},
			fatal: {
				text: "FATAL",
				number: 21
			}
		};

	function iQ(e, t, i, r) {
		return {
			resourceLogs: [{
				resource: {
					attributes: iK(t)
				},
				scopeLogs: [{
					scope: {
						name: i,
						version: r
					},
					logRecords: e
				}]
			}]
		}
	}
	var i0 = class {
		constructor(e) {
			this.ls = e, this.us = 0
		}
		get pending() {
			return !!this.cs
		}
		arm(e) {
			this.clear(), this.us = Date.now() + e, this.cs = tb(() => {
				this.cs = void 0, this.ls()
			}, e)
		}
		armNoEarlierThan(e) {
			this.cs && Date.now() + e <= this.us || this.arm(e)
		}
		clear() {
			this.cs && (clearTimeout(this.cs), this.cs = void 0)
		}
	};

	function i1() {
		return .75 + .5 * Math.random()
	}

	function i2(e, t, i, r) {
		let s = e * Math.pow(2, Math.min(Math.max(0, t - 1), 6));
		return Math.round((void 0 === r ? s : Math.min(s, Math.max(r, e))) * i)
	}
	var i3 = class {
		constructor(e, t, i, r, s, n = () => Promise.resolve(), o) {
			var a;
			this._instance = e, this.Fr = t, this.R = i, this.hs = r, this.ds = s, this.vs = n, this.fs = o, this.ps = new i0(() => this.gs()), this.ys = null, this.bs = 0, this._s = 0, this.ws = new tf, this.ks = 0, this.Ss = 1, this.xs = 0, this.$s = 0, this.Cs = !1, this.Ts = t.maxBufferSize, this.Is = Math.max(null != (a = t.maxQueueSize) ? a : t.maxBufferSize, t.maxBufferSize), this.Ms = t.flushIntervalMs, this.Es = t.maxBatchRecordsPerPost, this.As = t.rateCapWindowMs, this.Rs = t.maxLogsPerInterval
		}
		clearQueue() {
			this._s++, this._instance.setPersistedProperty(C.LogsQueue, [])
		}
		reset() {
			this.ps.clear(), this.xs = 0, this.$s = 0, this.Cs = !1, this.ks = 0, this.Ss = 1, this.ws.reset(), this.Es = this.Fr.maxBatchRecordsPerPost
		}
		onReconnect() {
			this.ks = 0, this.Ss = 1, this.ws.isOpen() ? this.Ps() && this.Os() : this.gs()
		}
		captureLog(e, t) {
			var i;
			if (this._instance.isDisabled || this._instance.optedOut || !(null == e ? void 0 : e.body)) return;
			let r = this.Fs(e);
			if (null === r) return;
			if (!r.body) return void this.R.info("Log was rejected in beforeSend function");
			if (!this.Ds()) return;
			let s = {
				record: function(e, t, i, r) {
					let {
						text: s,
						number: n
					} = iZ[e.level || "info"] || iX, o = function(e = Date.now()) {
						return String(e) + "000000"
					}(Q(r) ? r : void 0), a = {};
					t.distinctId && (a.posthogDistinctId = t.distinctId), t.sessionId && (a.sessionId = t.sessionId), t.windowId && (a["window.id"] = t.windowId), Z(t.sessionStartTimestamp) || (a.sessionStartTimestamp = String(t.sessionStartTimestamp)), Z(t.lastActivityTimestamp) || (a.lastActivityTimestamp = String(t.lastActivityTimestamp)), t.currentUrl && (a["url.full"] = t.currentUrl), t.screenName && (a["screen.name"] = t.screenName), t.appState && (a["app.state"] = t.appState), t.activeFeatureFlags && t.activeFeatureFlags.length > 0 && (a.feature_flags = t.activeFeatureFlags);
					let l = tS({}, a),
						u = e.attributes;
					if (u) {
						let e = [];
						try {
							e = Object.keys(u)
						} catch (t) {
							e = []
						}
						for (let t of e) {
							let e;
							try {
								e = u[t]
							} catch (t) {
								e = th
							}
							Object.defineProperty(l, t, {
								value: e,
								enumerable: !0,
								writable: !0,
								configurable: !0
							})
						}
					}
					let c = {
						timeUnixNano: o,
						observedTimeUnixNano: o,
						severityNumber: n,
						severityText: s,
						body: {
							stringValue: function(e) {
								try {
									return td(String(e))
								} catch (e) {
									return th
								}
							}(e.body)
						},
						attributes: iG(l, i)
					};
					return e.trace_id && (c.traceId = e.trace_id), e.span_id && (c.spanId = e.span_id), J(e.trace_flags) || (c.flags = e.trace_flags), c
				}(r, null != (i = null == t ? void 0 : t.context) ? i : this.hs(), this.R, null == t ? void 0 : t.occurredAtMs)
			};
			this.ds(() => this.Ls(s))
		}
		Fs(e) {
			let t = this.Fr.beforeSend;
			if (!t) return e;
			let i = q(t) ? t : [t],
				r = e;
			for (let e of i) try {
				let t = e(r);
				if (!t) return this.R.info("Log was rejected in beforeSend function"), null;
				r = t
			} catch (e) {
				return this.R.error("Error in beforeSend function for log:", e), null
			}
			return r
		}
		Ds() {
			if (void 0 === this.Rs) return !0;
			let e = Date.now(),
				t = e - this.xs;
			return this.As > t && t >= 0 || (this.xs = e, this.$s = 0, this.Cs = !1), this.Rs > this.$s ? (this.$s++, !0) : (this.Cs || (this.R.warn(`captureLog dropping logs: exceeded ${this.Rs} logs per ${this.As}ms`), this.Cs = !0), !1)
		}
		flush() {
			var e = this;
			return ed(function*() {
				if (!e._instance.isDisabled) return e.ys || (e.ys = e.Ns().finally(() => {
					e.ys = null
				})), e.ys
			})()
		}
		Ns() {
			var e = this;
			return ed(function*() {
				var t, i, r;
				e.ps.clear();
				let s = null != (t = e._instance.getPersistedProperty(C.LogsQueue)) ? t : [];
				if (0 === s.length) return;
				let n = s.length,
					o = 0;
				for (; s.length > 0 && n > o;) {
					let t = e._s;
					e.bs = 0;
					let n = Math.min(s.length, e.Es),
						a = s.slice(0, n),
						l = iQ(a.map(e => e.record), e.js(), null != (i = e.fs) ? i : e._instance.getLibraryId(), e._instance.getLibraryVersion()),
						u = yield e._instance.qs(l);
					if (e._s !== t) return;
					if ("too-large" === u.kind && a.length > 1) e.Es = Math.max(1, Math.floor(a.length / 2)), e.R.warn(`Logs batch of size ${a.length} was too large for the ingestion endpoint, reducing batch size to ${e.Es}`);
					else if (e.ws.record(u), e.ps.pending && e.ps.arm(Math.max(e.Ms, e.ws.remainingMs())), "retry-later" === u.kind || ("too-large" === u.kind ? e.R.warn("Dropping a single log record with batch size 1 — the record is larger than the server cap and cannot be split further.") : "ok" === u.kind && e.Fr.maxBatchRecordsPerPost > e.Es && (e.Es = Math.min(e.Fr.maxBatchRecordsPerPost, e.Es + 1)), yield e.Bs(a.length), s = null != (r = e._instance.getPersistedProperty(C.LogsQueue)) ? r : [], o += a.length, "fatal" === u.kind)) throw u.error
				}
			})()
		}
		Bs(e) {
			var t = this;
			return ed(function*() {
				var i;
				let r = Math.max(0, e - t.bs),
					s = null != (i = t._instance.getPersistedProperty(C.LogsQueue)) ? i : [];
				t._instance.setPersistedProperty(C.LogsQueue, s.slice(r)), yield t.vs()
			})()
		}
		js() {
			var e;
			return e = this.Fr, iV(e, this._instance.getLibraryId(), this._instance.getLibraryVersion())
		}
		Ls(e) {
			var t;
			if (this._instance.optedOut) return;
			let i = null != (t = this._instance.getPersistedProperty(C.LogsQueue)) ? t : [];
			this.Is > i.length || (i.shift(), this.bs++, this.R.info("Logs queue is full, dropping oldest record.")), i.push(e), this._instance.setPersistedProperty(C.LogsQueue, i), this.Ts > i.length || this.ws.isOpen() ? this.Os() : this.gs()
		}
		Os() {
			this.ps.pending || this.ps.arm(Math.max(this.Ms, this.ws.remainingMs()))
		}
		zs() {
			return Math.max(i2(this.Ms, this.ks, this.Ss, 3e4), this.ws.remainingMs())
		}
		Ps() {
			let e = this._instance.getPersistedProperty(C.LogsQueue);
			return !!e && e.length > 0
		}
		shutdown(e) {
			var t = this;
			return ed(function*() {
				t.ps.clear();
				let i = t.flush().catch(() => {});
				void 0 !== e ? yield tw(i, e): yield i
			})()
		}
		flushWithTimeout(e) {
			var t = this;
			return ed(function*() {
				let i = t.flush();
				yield tw(i, e, () => {
					i.catch(() => {})
				})
			})()
		}
		gs() {
			this.flush().then(() => {
				this.ks = 0, this.Ss = 1
			}, e => {
				this.ks++, this.Ss = i1(), this.R.error("PostHog logs flush failed:", e)
			}).finally(() => {
				!this._instance.isDisabled && this.Ps() && this.ps.armNoEarlierThan(this.zs())
			})
		}
	};
	let i5 = /^[0-9a-f]+$/;

	function i4(e, t, i) {
		return "string" == typeof e && e.length === t && e !== i && i5.test(e)
	}
	let i8 = /^([0-9a-f]{2})-([0-9a-f]{32})-([0-9a-f]{16})-([0-9a-f]{2})(-.*)?$/,
		i6 = [0, 5, 10, 25, 50, 75, 100, 250, 500, 750, 1e3, 2500, 5e3, 7500, 1e4];

	function i9(e) {
		return String(e) + "000000"
	}

	function i7(e, t, i, r) {
		let s = "";
		return r && (s = Object.keys(r).sort().map(e => `${JSON.stringify(e)}:${JSON.stringify(r[e])}`).join(",")), `${e}\0${t}\0${null!=i?i:""}\0${s}`
	}
	var re = class {
		constructor(e, t, i) {
			this._instance = e, this.Fr = t, this.R = i, this.Hs = new Map, this.ps = new i0(() => this.flush().catch(e => {
				this.R.error("Metrics flush failed:", e)
			})), this.ys = null, this.Us = !1, this.Ws = new Map, this.Vs = new Set, this.Gs = new Map, this.Qs = new Set, this.Js = !1, this.ws = new tf, this.ks = 0, this.Ss = 1, this.Zs = 0
		}
		count(e, t = 1, i) {
			this.Ks({
				name: e,
				type: "count",
				value: t,
				unit: null == i ? void 0 : i.unit,
				attributes: null == i ? void 0 : i.attributes
			})
		}
		gauge(e, t, i) {
			this.Ks({
				name: e,
				type: "gauge",
				value: t,
				unit: null == i ? void 0 : i.unit,
				attributes: null == i ? void 0 : i.attributes
			})
		}
		histogram(e, t, i) {
			this.Ks({
				name: e,
				type: "histogram",
				value: t,
				unit: null == i ? void 0 : i.unit,
				attributes: null == i ? void 0 : i.attributes,
				bounds: q(null == i ? void 0 : i.bounds) ? i.bounds.slice() : null == i ? void 0 : i.bounds
			})
		}
		flush() {
			var e, t = this;
			let i = this.ys,
				r = (e = ed(function*() {
					i && (yield i.catch(() => {})), yield t.Ys()
				}), function() {
					return e.apply(this, arguments)
				})().finally(() => {
					this.ys === r && (this.ys = null)
				});
			return this.ys = r, r
		}
		drainWindow() {
			if (0 === this.Hs.size) return null;
			let e = this.Hs;
			return this.Xs(), this._o(e)
		}
		reset() {
			this.Zs++, this.ws.reset(), this.ks = 0, this.Ss = 1, this.ps.clear(), this.ys = null, this.Xs(), this.Gs = new Map, this.Js = !1
		}
		Xs() {
			this.Hs = new Map, this.Us = !1, this.Ws = new Map, this.Vs = new Set, this.Qs = new Set
		}
		Ks(e) {
			var t;
			let i, r;
			if (this._instance.isDisabled || this._instance.optedOut) return;
			let s = this.Fs(e);
			if (null === s) return;
			if (!s.name || "string" != typeof s.name) return void this.R.warn("Dropping metric with empty name");
			if ("number" != typeof s.value || !Number.isFinite(s.value)) return void this.R.warn(`Dropping metric '${s.name}': value must be a finite number`);
			if ("count" !== s.type && "gauge" !== s.type && "histogram" !== s.type) return void this.R.warn(`Dropping metric '${s.name}': unknown type '${String(s.type)}'`);
			if ("count" === s.type && 0 > s.value) return void this.R.warn(`Dropping count '${s.name}': counters are monotonic, value must be >= 0`);
			try {
				i = s.attributes ? tS({}, s.attributes) : void 0, r = i7(s.type, s.name, s.unit, i)
			} catch (e) {
				return void this.R.warn(`Dropping metric '${s.name}': attributes could not be serialized`, e)
			}
			let n, o = this.Hs.get(r);
			if (!o && !this.ko() || "histogram" === s.type && !(n = this.So(s.name, s.unit, s.bounds))) return;
			o || (o = {
				name: s.name,
				type: s.type,
				unit: s.unit,
				attributes: i,
				windowStartMs: Date.now(),
				hist: n && {
					bounds: t = n,
					count: 0,
					sum: 0,
					min: 1 / 0,
					max: -1 / 0,
					bucketCounts: Array(t.length + 1).fill(0)
				}
			}, this.Hs.set(r, o));
			let a = this.Ws.get(s.name);
			void 0 === a ? this.Ws.set(s.name, s.type) : a === s.type || this.Vs.has(s.name) || (this.Vs.add(s.name), this.R.warn(`Metric name '${s.name}' is already used as a ${a}; recording it as a ${s.type} too will blend both series in charts. Use a distinct name.`)), this.xo(o, s.value);
			let l = this.$o();
			l && (o.exemplar = tS(tS({}, l), {}, {
				value: s.value,
				timeMs: Date.now()
			})), this.Os()
		}
		$o() {
			try {
				var e, t, i;
				let r, s = (i = null == (e = (t = this._instance).getActiveSpan) || null == (e = e.call(t)) ? void 0 : e.traceparent(), (r = function(e) {
					if ("string" != typeof e) return;
					let t = i8.exec(e.trim());
					if (!t) return;
					let [, i, r, s, n, o] = t;
					return "ff" !== i && ("00" !== i || !o) && i4(r, 32, "00000000000000000000000000000000") && i4(s, 16, "0000000000000000") ? {
						version: i,
						traceId: r,
						spanId: s,
						flags: n
					} : void 0
				}(i)) && {
					traceId: r.traceId,
					spanId: r.spanId,
					flags: 1 & parseInt(r.flags, 16) ? "01" : "00"
				});
				if (s && "01" === s.flags) return {
					traceId: s.traceId,
					spanId: s.spanId
				}
			} catch (e) {}
		}
		ko() {
			return this.Fr.maxSeriesPerFlush > this.Hs.size || (this.Us || (this.Us = !0, this.R.warn(`Metric series cap reached (${this.Fr.maxSeriesPerFlush} per flush window); dropping new series until the next flush. Reduce attribute cardinality.`)), !1)
		}
		So(e, t, i) {
			if (void 0 !== i && ! function(e) {
					if (!q(e) || 0 === e.length) return !1;
					for (let t = 0; e.length > t; t++)
						if (!Number.isFinite(e[t]) || t > 0 && e[t - 1] >= e[t]) return !1;
					return !0
				}(i)) return void this.R.warn(`Dropping histogram '${e}': bounds must be a non-empty array of finite, strictly increasing numbers`);
			let r = i7("histogram", e, t, void 0),
				s = this.Gs.get(r);
			if (s) return this.Co(e, r, s, i), s;
			if (this.Gs.size >= this.Fr.maxSeriesPerFlush) {
				if (this.Js || (this.Js = !0, this.R.warn(`Histogram bounds limit reached (${this.Fr.maxSeriesPerFlush} distinct histograms); new histograms that pass custom bounds are dropped. Reduce histogram name cardinality.`)), i && !rt(i, i6)) return;
				return i6
			}
			let n = i ? i.slice() : i6;
			return this.Gs.set(r, n), n
		}
		Co(e, t, i, r) {
			rt(i, null != r ? r : i6) || this.Qs.has(t) || (this.Qs.add(t), this.R.warn(`Histogram '${e}' already uses the bounds [${i.join(", ")}]; samples that pass different bounds are recorded in those buckets.`))
		}
		xo(e, t) {
			switch (e.type) {
				case "count":
					var i;
					e.total = (null != (i = e.total) ? i : 0) + t;
					break;
				case "gauge":
					e.last = t;
					break;
				case "histogram": {
					let i = e.hist;
					i.count += 1, i.sum += t, i.min = Math.min(i.min, t), i.max = Math.max(i.max, t), i.bucketCounts[function(e, t) {
						for (let i = 0; t.length > i; i++)
							if (t[i] >= e) return i;
						return t.length
					}(t, i.bounds)] += 1
				}
			}
		}
		Fs(e) {
			let t = this.Fr.beforeSend;
			if (!t) return e;
			let i = q(t) ? t : [t],
				r = e;
			for (let e of i) try {
				let t = e(r);
				if (!t) return this.R.info("Metric was rejected in beforeSend function"), null;
				r = t
			} catch (e) {
				return this.R.error("Error in beforeSend function for metric:", e), null
			}
			return r
		}
		Os() {
			this.ps.pending || this.ps.arm(this.zs())
		}
		zs() {
			return Math.max(i2(this.Fr.flushIntervalMs, this.ks, this.Ss, 3e4), this.ws.remainingMs())
		}
		Ys() {
			var e = this;
			return ed(function*() {
				if (e.ps.clear(), 0 === e.Hs.size) return;
				let t = e.Hs;
				e.Xs();
				let i = e.Zs,
					r = yield e._instance.To(e._o(t));
				if (i === e.Zs) switch (e.ws.record(r), "retry-later" === r.kind ? (e.ks++, e.Ss = i1()) : (e.ks = 0, e.Ss = 1), e.ps.pending && e.ps.arm(e.zs()), r.kind) {
					case "ok":
						return;
					case "retry-later":
						return e.Io(t), void e.ps.armNoEarlierThan(e.zs());
					case "too-large":
						return void e.R.warn("Metrics batch exceeded the server size limit and was dropped");
					case "fatal":
						return void e.R.error("Failed to send metrics batch:", r.error)
				}
			})()
		}
		_o(e) {
			var t, i, r, s;
			return t = this.Mo(e), i = iV(this.Fr, this._instance.getLibraryId(), this._instance.getLibraryVersion()), r = this._instance.getLibraryId(), s = this._instance.getLibraryVersion(), {
				resourceMetrics: [{
					resource: {
						attributes: iK(i)
					},
					scopeMetrics: [{
						scope: {
							name: r,
							version: s
						},
						metrics: t
					}]
				}]
			}
		}
		Mo(e) {
			let t = i9(Date.now()),
				i = new Map;
			for (let a of e.values()) {
				var r, s, n, o;
				let e = i7(a.type, a.name, a.unit, void 0),
					l = i.get(e);
				l || (l = tS({
					name: a.name
				}, a.unit && {
					unit: a.unit
				}), "count" === a.type ? l.sum = {
					aggregationTemporality: 1,
					isMonotonic: !0,
					dataPoints: []
				} : "gauge" === a.type ? l.gauge = {
					dataPoints: []
				} : l.histogram = {
					aggregationTemporality: 1,
					dataPoints: []
				}, i.set(e, l));
				let u = iG(null != (r = a.attributes) ? r : {}, this.R),
					c = i9(a.windowStartMs),
					h = (o = a.exemplar) ? {
						exemplars: [{
							filteredAttributes: [],
							timeUnixNano: i9(o.timeMs),
							asDouble: o.value,
							traceId: o.traceId,
							spanId: o.spanId
						}]
					} : {};
				if ("count" === a.type) {
					let e = tS({
						attributes: u,
						startTimeUnixNano: c,
						timeUnixNano: t,
						asDouble: null != (s = a.total) ? s : 0
					}, h);
					l.sum.dataPoints.push(e)
				} else if ("gauge" === a.type) {
					let e = tS({
						attributes: u,
						timeUnixNano: t,
						asDouble: null != (n = a.last) ? n : 0
					}, h);
					l.gauge.dataPoints.push(e)
				} else {
					let e = a.hist,
						i = tS({
							attributes: u,
							startTimeUnixNano: c,
							timeUnixNano: t,
							count: e.count,
							sum: e.sum,
							min: e.min,
							max: e.max,
							bucketCounts: e.bucketCounts,
							explicitBounds: e.bounds
						}, h);
					l.histogram.dataPoints.push(i)
				}
			}
			return Array.from(i.values())
		}
		Io(e) {
			for (let [s, n] of e) {
				var t, i, r;
				let e = this.Hs.get(s);
				if (e) switch (e.windowStartMs = Math.min(e.windowStartMs, n.windowStartMs), e.exemplar = null != (t = e.exemplar) ? t : n.exemplar, e.type) {
					case "count":
						e.total = (null != (i = e.total) ? i : 0) + (null != (r = n.total) ? r : 0);
						break;
					case "gauge":
						break;
					case "histogram": {
						let t = e.hist,
							i = n.hist;
						t.count += i.count, t.sum += i.sum, t.min = Math.min(t.min, i.min), t.max = Math.max(t.max, i.max);
						for (let e = 0; t.bucketCounts.length > e; e++) t.bucketCounts[e] += i.bucketCounts[e]
					}
				} else this.ko() && this.Hs.set(s, n)
			}
		}
	};

	function rt(e, t) {
		if (e === t) return !0;
		if (e.length !== t.length) return !1;
		for (let i = 0; e.length > i; i++)
			if (e[i] !== t[i]) return !1;
		return !0
	}
	let ri = (e, {
			debugEnabled: t
		} = {}) => {
			let i = {
				N(i, ...r) {
					let s;
					try {
						s = typeof window > "u" ? void 0 : window
					} catch (e) {
						return
					}
					s && (R.DEBUG || s.POSTHOG_DEBUG || t) && !J(s.console) && s.console && ("__rrweb_original__" in s.console[i] ? s.console[i].__rrweb_original__ : s.console[i])(e, ...r)
				},
				debug(...e) {
					i.N("debug", ...e)
				},
				info(...e) {
					i.N("log", ...e)
				},
				warn(...e) {
					i.N("warn", ...e)
				},
				error(...e) {
					i.N("error", ...e)
				},
				critical(...t) {
					console.error(e, ...t)
				},
				uninitializedWarning(e) {
					i.error(`You must initialize PostHog before calling ${e}`)
				},
				createLogger: (t, i) => ri(`${e} ${t}`, i)
			};
			return i
		},
		rr = ri("[PostHog.js]"),
		rs = rr.createLogger("[ExternalScriptsLoader]", void 0),
		rn = e => {
			let t = null == x ? void 0 : x.querySelectorAll("script");
			if (t) {
				for (let i = 0; t.length > i; i++)
					if (t[i].src === e || t[i].getAttribute("src") === e) return t[i]
			}
		},
		ro = (e, t, i) => {
			if (e.config.disable_external_dependency_loading) return rs.warn(`${t} was requested but loading of external scripts is disabled.`), i("Loading of external scripts is disabled");
			let r = () => {
					if (null == x || x.removeEventListener("DOMContentLoaded", r), e.config.disable_external_dependency_loading) return i("Loading of external scripts is disabled");
					if (!x) return i("document not found");
					let n = x.createElement("script");
					if (n.type = "text/javascript", n.crossOrigin = "anonymous", n.src = t, n.onload = e => {
							n.__posthog_loading_callback_fired = !0, i(void 0, e)
						}, n.onerror = e => {
							n.__posthog_loading_error = e, i(e)
						}, e.config.prepare_external_dependency_script && (n = e.config.prepare_external_dependency_script(n)), !n) return i("prepare_external_dependency_script returned null");
					if (e.config.disable_external_dependency_loading) return i("Loading of external scripts is disabled");
					let o = rn(n.src);
					if (o) {
						if (o.integrity !== n.integrity || o.crossOrigin !== n.crossOrigin || o.nonce !== n.nonce) return i("Existing script conflicts with prepared script policy");
						if (o.__posthog_loading_callback_fired) return i();
						let e = o.__posthog_loading_error;
						return e ? i(e) : (o.addEventListener("load", e => {
							o.__posthog_loading_callback_fired = !0, i(void 0, e)
						}), void o.addEventListener("error", e => {
							o.__posthog_loading_error = e, i(e)
						}))
					}
					if (!x.body) return s();
					if ("head" === e.config.external_scripts_inject_target) x.head.appendChild(n);
					else {
						var a;
						let e = x.querySelectorAll("body > script");
						e.length > 0 ? null == (a = e[0].parentNode) || a.insertBefore(n, e[0]) : x.body.appendChild(n)
					}
				},
				s = () => {
					null == x || x.addEventListener("DOMContentLoaded", r)
				};
			(null == x ? void 0 : x.body) || rn(t) ? r() : s()
		},
		ra = {},
		rl = (e, t) => {
			let i = `/static/${t}.js?v=${e.version}`;
			return "toolbar" === t && (i = `${i}&t=${3e5*Math.floor(Date.now()/3e5)}`), e.requestRouter.endpointFor("assets", i)
		};
	O.__PosthogExtensions__ = O.__PosthogExtensions__ || {}, O.__PosthogExtensions__.loadExternalDependency = (e, t, i) => {
		if ("remote-config" === t) {
			let t = e.requestRouter.endpointFor("assets", `/array/${e.config.token}/config.js`);
			return void ro(e, t, i)
		}
		let r = e.config.strict_script_versioning;
		if (r) {
			let s = e.requestRouter.endpointFor("assets", `/static/${e.version}/${t}.js`),
				n = ra[s];
			if ("fallback" === r && n) {
				if (rn(n)) return void ro(e, n, i);
				delete ra[s]
			}
			return void ro(e, s, "fallback" === r ? (r, n) => {
				if (r)
					if ("string" == typeof r) i(r);
					else {
						var o;
						let r = rl(e, t);
						ra[s] = r;
						let n = rn(s);
						null == n || null == (o = n.parentNode) || o.removeChild(n), ro(e, r, i)
					}
				else i(void 0, n)
			} : i)
		}
		ro(e, rl(e, t), i)
	}, O.__PosthogExtensions__.loadSiteApp = (e, t, i) => {
		let r = e.requestRouter.endpointFor("api", t);
		ro(e, r, i)
	}, R.DEBUG = !1, R.LIB_VERSION = "1.447.3", R.LIB_NAME = "web";
	let ru = "$early_access_features",
		rc = "$active_feature_flags",
		rh = "$feature_flag_details",
		rd = "$feature_flag_errors",
		rp = "$feature_flag_evaluated_at",
		rf = "$feature_flag_request_id",
		rg = "$minimal_flag_called_events",
		rv = "$enabled_feature_flags",
		r_ = "$stored_group_properties",
		rm = "$stored_person_properties",
		ry = "$flag_call_reported",
		rb = "$flag_call_reported_session_id",
		rw = "$feature_flag_payloads",
		rx = "$override_feature_flags",
		rk = "$override_feature_flag_payloads",
		rE = "visibilitychange",
		rS = "$autocapture_disabled_server_side",
		r$ = "$surveys",
		rF = "$surveys_loaded_at",
		rP = "PostHog loadExternalDependency extension not found.",
		rT = "$surveys_activated",
		rO = "$surveys_activated_session",
		rI = "$surveys_activated_timestamps",
		rR = "distinct_id",
		rC = "$device_id",
		rM = "$device_model",
		rA = "__alias",
		rL = "$fbc",
		rD = "$fbc_persistence",
		rN = "$fbp",
		rj = "$fbp_persistence",
		rz = "__timers",
		rH = "$heatmaps_enabled_server_side",
		rU = "$exception_capture_enabled_server_side",
		rB = "$error_tracking_suppression_rules",
		rq = "$error_tracking_capture_extension_exceptions",
		rG = "$web_vitals_enabled_server_side",
		rW = "$dead_clicks_enabled_server_side",
		rV = "$product_tours_enabled_server_side",
		rJ = "$logs_capture_enabled_server_side",
		rK = "$web_vitals_allowed_metrics",
		rY = "$session_recording_remote_config",
		rX = "$sesid",
		rZ = "$session_is_sampled",
		rQ = "$groups",
		r0 = "ph_product_tours",
		r1 = "$user_state",
		r2 = "$client_session_props",
		r3 = "$capture_rate_limit",
		r5 = "$initial_campaign_params",
		r4 = "$initial_referrer_info",
		r8 = "$initial_person_info",
		r6 = "$epp",
		r9 = "$posthog_cookieless",
		r7 = "$cookieless_mode",
		se = "$sdk_debug_extensions_init_method",
		st = "$sdk_debug_extensions_init_time_ms",
		si = "$sdk_debug_recording_script_not_loaded",
		sr = "$sdk_debug_replay_stale_config",
		ss = "$sdk_debug_replay_event_trigger_status",
		sn = "$sdk_debug_replay_linked_flag_trigger_status",
		so = "$sdk_debug_replay_matched_recording_trigger_groups",
		sa = "$sdk_debug_replay_pending_trigger_conditions",
		sl = "$sdk_debug_replay_remote_trigger_matching_config",
		su = "$sdk_debug_replay_trigger_groups_count",
		sc = "$sdk_debug_replay_url_trigger_status",
		sh = "anonymous",
		sd = "identified",
		sp = "identified_only",
		sf = "beforeunload",
		sg = "$pageview",
		sv = "$pageleave",
		s_ = "$identify",
		sm = "$groupidentify";

	function sy(e, t) {
		q(e) && e.forEach(t)
	}

	function sb(e, t) {
		if (!Z(e))
			if (q(e)) e.forEach(t);
			else if (e instanceof FormData) e.forEach((e, i) => t(e, i));
		else
			for (let i in e) U.call(e, i) && t(e[i], i)
	}
	let sw = function(e, ...t) {
		for (let i of t)
			for (let t in i) void 0 !== i[t] && (e[t] = i[t]);
		return e
	};

	function sx(e) {
		let t = Object.keys(e),
			i = t.length,
			r = Array(i);
		for (; i--;) r[i] = [t[i], e[t[i]]];
		return r
	}
	let sk = function(e) {
			return function(...t) {
				try {
					return e.apply(this, t)
				} catch (e) {
					rr.critical("Implementation error. Please turn on debug mode and open a ticket on https://app.posthog.com/home#panel=support%3Asupport%3A."), rr.critical(e)
				}
			}
		},
		sE = function(e) {
			let t = {};
			return sb(e, function(e, i) {
				(K(e) && e.length > 0 || Q(e)) && (t[i] = e)
			}), t
		};

	function sS(e) {
		let t = tS({}, e);
		for (let i of ["name", "message", "stack", "cause", "errors"]) try {
			i in e && (t[i] = e[i])
		} catch (e) {}
		return t
	}
	let s$ = ["herokuapp.com", "vercel.app", "netlify.app"];

	function sF(e, t, i, r) {
		let {
			capture: s = !1,
			passive: n = !0
		} = null != r ? r : {};
		null == e || e.addEventListener(t, i, {
			capture: s,
			passive: n
		})
	}

	function sP(e) {
		return "ph_toolbar_internal" === e.name
	}
	let sT = e => {
		if (x) {
			try {
				let t = e + "=",
					i = x.cookie.split(";").filter(e => e.length);
				for (let e = 0; i.length > e; e++) {
					let r = i[e];
					for (;
						" " == r.charAt(0);) r = r.substring(1, r.length);
					if (0 === r.indexOf(t)) return decodeURIComponent(r.substring(t.length, r.length))
				}
			} catch (e) {}
			return null
		}
	};
	var sO = class e {
			constructor(e) {
				if (this.bytes = e, 16 !== e.length) throw TypeError("not 128-bit length")
			}
			static fromFieldsV7(t, i, r, s) {
				if (!Number.isInteger(t) || !Number.isInteger(i) || !Number.isInteger(r) || !Number.isInteger(s) || 0 > t || 0 > i || 0 > r || 0 > s || t > 0xffffffffffff || i > 4095 || r > 0x3fffffff || s > 0xffffffff) throw RangeError("invalid field value");
				let n = new Uint8Array(16);
				return n[0] = t / 0x10000000000, n[1] = t / 0x100000000, n[2] = t / 0x1000000, n[3] = t / 65536, n[4] = t / 256, n[5] = t, n[6] = 112 | i >>> 8, n[7] = i, n[8] = 128 | r >>> 24, n[9] = r >>> 16, n[10] = r >>> 8, n[11] = r, n[12] = s >>> 24, n[13] = s >>> 16, n[14] = s >>> 8, n[15] = s, new e(n)
			}
			toString() {
				let e = "";
				for (let t = 0; this.bytes.length > t; t++) e = e + (this.bytes[t] >>> 4).toString(16) + (15 & this.bytes[t]).toString(16), 3 !== t && 5 !== t && 7 !== t && 9 !== t || (e += "-");
				if (36 !== e.length) throw Error("Invalid UUIDv7 was generated");
				return e
			}
			clone() {
				return new e(this.bytes.slice(0))
			}
			equals(e) {
				return 0 === this.compareTo(e)
			}
			compareTo(e) {
				for (let t = 0; 16 > t; t++) {
					let i = this.bytes[t] - e.bytes[t];
					if (0 !== i) return Math.sign(i)
				}
				return 0
			}
		},
		sI = class {
			generate() {
				let e = this.generateOrAbort();
				if (!J(e)) return e;
				{
					this.Tt = 0;
					let e = this.generateOrAbort();
					if (J(e)) throw Error("Could not generate UUID after timestamp reset");
					return e
				}
			}
			generateOrAbort() {
				let e, t = Q(e = Date.now()) && isFinite(e) ? Math.min(Math.max(Math.floor(e), 0), 0xffffffffffff) : 0;
				if (t > this.Tt) this.Tt = t, this.It();
				else {
					if (this.Tt >= t + 1e4) return;
					this.Mt++, this.Mt > 0x3ffffffffff && (this.Tt++, this.It())
				}
				return sO.fromFieldsV7(this.Tt, Math.trunc(this.Mt / 0x40000000), 0x3fffffff & this.Mt, this.At.nextUint32())
			}
			It() {
				this.Mt = 1024 * this.At.nextUint32() + (1023 & this.At.nextUint32())
			}
			constructor() {
				this.Tt = 0, this.Mt = 0, this.At = new sC
			}
		};
	let sR = e => {
		if ("u" > typeof UUIDV7_DENY_WEAK_RNG && UUIDV7_DENY_WEAK_RNG) throw Error("no cryptographically strong RNG available");
		for (let t = 0; e.length > t; t++) e[t] = 65536 * Math.trunc(65536 * Math.random()) + Math.trunc(65536 * Math.random());
		return e
	};
	var sC = class {
		nextUint32() {
			var e;
			return this.Rt.length > this.Et || ((null != (e = o) ? e : o = "u" > typeof window && !J(window.crypto) && crypto.getRandomValues ? e => {
				try {
					return crypto.getRandomValues(e)
				} catch (t) {
					return sR(e)
				}
			} : sR)(this.Rt), this.Et = 0), this.Rt[this.Et++]
		}
		constructor() {
			this.Rt = new Uint32Array(8), this.Et = 1 / 0
		}
	};
	let sM = () => sA().toString(),
		sA = () => (a || (a = new sI)).generate(),
		sL = "",
		sD = /[a-z0-9][a-z0-9-]+\.[a-z]{2,}$/i,
		sN = null,
		sj = {
			Ot() {
				if (!X(sN)) return sN;
				if (sN = !1, x) try {
					let e = `__ph_cookie_support_${sM()}`;
					sj.$t(e, "xyz"), sN = '"xyz"' === sT(e), sj.Dt(e)
				} catch (e) {
					sN = !1
				}
				return sN
			},
			Pt(e) {
				rr.error("cookieStore error: " + e)
			},
			Lt: sT,
			Ft(e) {
				let t;
				try {
					t = JSON.parse(sj.Lt(e)) || {}
				} catch (e) {}
				return t
			},
			$t(e, t, i, r, s) {
				if (!x) return !1;
				try {
					let n = "",
						o = "",
						a = function(e, t) {
							if (t) {
								let t = function(e, t = x) {
									if (sL) return sL;
									if (!t || ["localhost", "127.0.0.1"].includes(e)) return "";
									let i = e.split("."),
										r = Math.min(i.length, 8),
										s = "dmn_chk_" + sM();
									for (; !sL && r--;) {
										let e = i.slice(r).join("."),
											n = s + "=1;domain=." + e + ";path=/";
										t.cookie = n + ";max-age=3", t.cookie.includes(s) && (t.cookie = n + ";max-age=0", sL = e)
									}
									return sL
								}(e);
								if (!t) {
									let i, r = (i = e.match(sD)) ? i[0] : "";
									r !== t && rr.info("Warning: cookie subdomain discovery mismatch", r, t), t = r
								}
								return t ? "; domain=." + t : ""
							}
							return ""
						}(x.location.hostname, r);
					if (i) {
						let e = new Date;
						e.setTime(e.getTime() + 864e5 * i), n = "; expires=" + e.toUTCString()
					}
					s && (o = "; secure");
					let l = e + "=" + encodeURIComponent(JSON.stringify(t)) + n + "; SameSite=Lax; path=/" + a + o;
					return l.length > 3686.4 && rr.warn("cookieStore warning: large cookie, len=" + l.length), x.cookie = l, !0
				} catch (e) {
					return !1
				}
			},
			Dt(e, t) {
				if ((null == x ? void 0 : x.cookie) && (!t || !X(sT(e)))) try {
					sj.$t(e, "", -1, t)
				} catch (e) {
					return
				}
			}
		},
		sz = null,
		sH = {
			Ot() {
				if (!X(sz)) return sz;
				let e = !0;
				if (J(y)) e = !1;
				else try {
					let t = "__mplssupport__";
					sH.$t(t, "xyz"), '"xyz"' !== sH.Lt(t) && (e = !1), sH.Dt(t)
				} catch (t) {
					e = !1
				}
				return e || rr.error("localStorage unsupported; falling back to cookie store"), sz = e, e
			},
			Pt(e) {
				rr.error("localStorage error: " + e)
			},
			Lt(e) {
				try {
					return null == y ? void 0 : y.localStorage.getItem(e)
				} catch (e) {
					sH.Pt(e)
				}
				return null
			},
			Ft(e) {
				try {
					return JSON.parse(sH.Lt(e)) || {}
				} catch (e) {}
				return null
			},
			$t(e, t) {
				try {
					return null == y || y.localStorage.setItem(e, JSON.stringify(t)), !0
				} catch (e) {
					sH.Pt(e)
				}
				return !1
			},
			Dt(e) {
				try {
					null == y || y.localStorage.removeItem(e)
				} catch (e) {
					sH.Pt(e)
				}
			}
		},
		sU = [rm, rc, rv, rh, rw, rf, rp, rd, ry],
		sB = [rC, rR, rX, rZ, r6, r8, rD, r1],
		sq = ["__proto__", "constructor", "prototype"],
		sG = e => {
			if (!W(e)) return {};
			let t = {};
			return Object.keys(e).forEach(i => {
				-1 === sq.indexOf(i) && (t[i] = e[i])
			}), t
		},
		sW = (e, t = []) => {
			let i = {};
			return [...sB, ...t].forEach(t => {
				let r = e[t];
				J(r) || X(r) || "" === r || (i[t] = r)
			}), i
		},
		sV = e => {
			let t = 5381,
				i = 0x811c9dc5;
			for (let r = 0; e.length > r; r++) {
				let s = e.charCodeAt(r);
				t = 33 * t ^ s, i = Math.imul(i ^ s, 0x1000193)
			}
			return e.length.toString(36) + "." + (t >>> 0).toString(36) + "." + (i >>> 0).toString(36)
		},
		sJ = (e, t) => ({
			p: t,
			f: sV(JSON.stringify(e))
		}),
		sK = (e, t) => {
			if (!t) return {
				properties: [],
				isValid: !1
			};
			try {
				let i = sj.Ft(e + "_cpm"),
					r = (null == i ? void 0 : i.f) === sV(t) && q(i.p);
				return {
					properties: r ? i.p : [],
					isValid: r
				}
			} catch (e) {
				return {
					properties: [],
					isValid: !1
				}
			}
		},
		sY = (e, t) => t + "|" + (sj.Lt(e + "_cpm") || ""),
		sX = {},
		sZ = {
			Ot: () => !0,
			Pt(e) {
				rr.error("memoryStorage error: " + e)
			},
			Lt: e => e in sX ? sX[e] : null,
			Ft: e => e in sX ? sX[e] : null,
			$t: (e, t) => (sX[e] = t, !0),
			Dt(e) {
				delete sX[e]
			}
		},
		sQ = null,
		s0 = {
			Ot() {
				if (!X(sQ)) return sQ;
				if (sQ = !0, J(y)) sQ = !1;
				else try {
					let e = "__support__";
					s0.$t(e, "xyz"), '"xyz"' !== s0.Lt(e) && (sQ = !1), s0.Dt(e)
				} catch (e) {
					sQ = !1
				}
				return sQ
			},
			Pt(e) {
				rr.error("sessionStorage error: ", e)
			},
			Lt(e) {
				try {
					return null == y ? void 0 : y.sessionStorage.getItem(e)
				} catch (e) {
					s0.Pt(e)
				}
				return null
			},
			Ft(e) {
				try {
					return JSON.parse(s0.Lt(e)) || null
				} catch (e) {}
				return null
			},
			$t(e, t) {
				try {
					return null == y || y.sessionStorage.setItem(e, JSON.stringify(t)), !0
				} catch (e) {
					s0.Pt(e)
				}
				return !1
			},
			Dt(e) {
				try {
					null == y || y.sessionStorage.removeItem(e)
				} catch (e) {
					s0.Pt(e)
				}
			}
		};
	var s1 = class {
		constructor(e) {
			this._instance = e
		}
		get Fr() {
			return this._instance.config
		}
		get consent() {
			return this.Fl() ? 0 : this.Dl
		}
		isOptedOut() {
			return "always" === this.Fr.cookieless_mode || this.isRejected() || -1 === this.consent && "on_reject" === this.Fr.cookieless_mode
		}
		isOptedIn() {
			return !this.isOptedOut()
		}
		isExplicitlyOptedOut() {
			return 0 === this.consent
		}
		isRejected() {
			return 0 === this.consent || -1 === this.consent && this.Fr.opt_out_capturing_by_default
		}
		optInOut(e) {
			this.Ll.$t(this.Nl, +!!e, this.Fr.cookie_expiration, this.Fr.cross_subdomain_cookie, this.Fr.secure_cookie)
		}
		reset() {
			this.Ll.Dt(this.Nl, this.Fr.cross_subdomain_cookie)
		}
		get Nl() {
			let {
				token: e,
				opt_out_capturing_cookie_prefix: t,
				consent_persistence_name: i
			} = this._instance.config;
			return i || (t ? t + e : "__ph_opt_in_out_" + e)
		}
		get Dl() {
			let e = this.Ll.Lt(this.Nl);
			return D(eu, e) ? 1 : D(ec, e) ? 0 : -1
		}
		get Ll() {
			let e = this.Fr.opt_out_capturing_persistence_type,
				t = "localStorage" === e ? sH : sj,
				i = t.Ot() ? t : sZ;
			if (!this.jl || this.jl !== i) {
				this.jl = i;
				let t = "localStorage" === e ? sj : sH;
				t.Lt(this.Nl) && (this.jl.Lt(this.Nl) || this.optInOut(D(eu, t.Lt(this.Nl))), t.Dt(this.Nl, this.Fr.cross_subdomain_cookie))
			}
			return this.jl
		}
		Fl() {
			return !!this.Fr.respect_dnt && [null == w ? void 0 : w.doNotTrack, null == w ? void 0 : w.msDoNotTrack, O.doNotTrack, null == w ? void 0 : w.globalPrivacyControl].some(e => D(eu, e))
		}
	};

	function s2(e, t) {
		var i;
		let r = null == e || null == (i = e.config) ? void 0 : i.get_current_url;
		if (!G(r)) return t;
		try {
			let e = r(t);
			return K(e) && e ? e : t
		} catch (e) {
			return rr.error("Error in get_current_url, falling back to window.location.href", e), t
		}
	}

	function s3(e) {
		var t;
		return e instanceof Element && ("__POSTHOG_TOOLBAR__" === e.id || !!(null == (t = e.closest) ? void 0 : t.call(e, ".toolbar-global-fade-container")))
	}

	function s5(e) {
		return !!e && 1 === e.nodeType
	}

	function s4(e, t) {
		return !!e && !!e.tagName && e.tagName.toLowerCase() === t.toLowerCase()
	}

	function s8(e) {
		return !!e && 3 === e.nodeType
	}

	function s6(e) {
		return !!e && 11 === e.nodeType && s5(e.host)
	}

	function s9(e) {
		return e ? N(e).split(/\s+/) : []
	}

	function s7(e, t) {
		var i;
		let r, s, n = J(s = null == (r = typeof window > "u" ? void 0 : window) || null == (i = r.location) ? void 0 : i.href) ? void 0 : s2(t, s);
		return !!(n && e && e.some(e => n.match(e)))
	}

	function ne(e) {
		let t = "";
		switch (typeof e.className) {
			case "string":
				t = e.className;
				break;
			case "object":
				t = (e.className && "baseVal" in e.className ? e.className.baseVal : null) || e.getAttribute("class") || "";
				break;
			default:
				t = ""
		}
		return s9(t)
	}

	function nt(e) {
		return Z(e) ? null : N(e).split(/(\s+)/).filter(e => nO(e)).join("").replace(/[\r\n]/g, " ").replace(/[ ]+/g, " ").substring(0, 255)
	}

	function ni(e) {
		let t = "";
		return nx(e) && !nk(e) && e.childNodes && e.childNodes.length && sb(e.childNodes, function(e) {
			var i;
			s8(e) && e.textContent && (t += null != (i = nt(e.textContent)) ? i : "")
		}), N(t)
	}

	function nr(e) {
		var t;
		return J(e.target) ? e.srcElement || null : (null == (t = e.target) ? void 0 : t.shadowRoot) ? e.composedPath()[0] || null : e.target || null
	}
	let ns = ["a", "button", "form", "input", "select", "textarea", "label"];

	function nn(e, t) {
		let i = e.matches || e.matchesSelector || e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || e.oMatchesSelector;
		try {
			return !!i && i.call(e, t)
		} catch (e) {
			return !1
		}
	}

	function no(e, t) {
		if (J(t)) return !0;
		for (let i of e)
			if (t.some(e => nn(i, e))) return !0;
		return !1
	}

	function na(e) {
		let t = e.parentNode;
		return !(!t || !s5(t)) && t
	}
	let nl = [".ph-no-autocapture", "[data-ph-no-autocapture]"],
		nu = ["next", "previous", "prev", ">", "<", "→", "←", "›", "‹", "»", "«", "▶", "◀", "❯", "❮"],
		nc = [...nu, "+", "-", "−", "–"],
		nh = nc.length + 10,
		nd = ["button", "a", "input", "select", "textarea", "label"],
		np = ["button", "link", "tab", "menuitem", "option"],
		nf = (e, t) => /[a-z0-9]/i.test(t) ? D(nc, t) ? RegExp(`\\b${t}\\b`).test(e) : e.includes(t) : e === t,
		ng = e => D(nd, e.tagName.toLowerCase()) || D(np, (e.getAttribute("role") || "").toLowerCase());

	function nv(e) {
		let t = "",
			i = "",
			r = e => {
				s5(e) && nx(e) && !nk(e) && (t += ` ${ni(e)}`, i = i || e.getAttribute("aria-label") || "", sb(e.childNodes, r))
			};
		r(e);
		let s = (nO(t = N(t.replace(/\s+/g, " "))) ? t : "").toLowerCase(),
			n = e.getAttribute("aria-label") || (s ? "" : i);
		return {
			safeText: s,
			ariaLabel: N(n).toLowerCase()
		}
	}
	let n_ = [".ph-no-rageclick", ".ph-no-capture"],
		nm = ["", "text", "search", "email", "password", "url", "tel", "number"];

	function ny(e, t) {
		var i, r, s;
		let n, o, a;
		if (!(typeof window > "u" ? void 0 : window) || nb(e) || (et(t) ? (n = !!t && n_, o = void 0, a = !1) : (n = null != (i = null == t ? void 0 : t.css_selector_ignorelist) ? i : n_, o = null == t ? void 0 : t.content_ignorelist, a = null != (r = null == t ? void 0 : t.ignore_text_selection) && r), !1 === n) || a && !(!(s = e) || !s5(s)) && (s4(s, "textarea") || (s4(s, "input") ? D(nm, (s.getAttribute("type") || "").toLowerCase()) : function(e) {
				var t;
				if (e.isContentEditable) return !0;
				let i = null == (t = e.getAttribute) ? void 0 : t.call(e, "contenteditable");
				return "true" === i || "" === i
			}(s)))) return !1;
		let {
			targetElementList: l
		} = nw(e, !1);
		return !(o && function(e, {
			safeText: t,
			ariaLabel: i
		}) {
			let r;
			if (!0 === e) r = nu;
			else {
				if (!q(e)) return !1;
				if (e.length > nh) return rr.error(`[PostHog] content_ignorelist array cannot exceed ${nh} items. Use css_selector_ignorelist for more complex matching.`), !1;
				r = e.map(e => e.toLowerCase())
			}
			return r.some(e => nf(t, e) || nf(i, e))
		}(o, function(e, t) {
			for (let e of t)
				if (ng(e)) return nv(e);
			for (let e of t) {
				try {
					var i;
					if ("pointer" !== (null == (i = window) ? void 0 : i.getComputedStyle(e).getPropertyValue("cursor"))) break
				} catch (e) {
					break
				}
				let t = nv(e);
				if (t.safeText || t.ariaLabel) return t
			}
			return nv(e)
		}(e, l)) || no(l, n))
	}
	let nb = e => !e || s4(e, "html") || !s5(e),
		nw = (e, t) => {
			let i = typeof window > "u" ? void 0 : window;
			if (!i || nb(e)) return {
				parentIsUsefulElement: !1,
				targetElementList: []
			};
			let r = !1,
				s = [e],
				n = e;
			for (; n.parentNode && !s4(n, "body");) {
				if (s6(n.parentNode)) {
					s.push(n.parentNode.host), n = n.parentNode.host;
					continue
				}
				let e = na(n);
				if (!e) break;
				if (t || ns.indexOf(e.tagName.toLowerCase()) > -1) r = !0;
				else try {
					let t = i.getComputedStyle(e);
					t && "pointer" === t.getPropertyValue("cursor") && (r = !0)
				} catch (e) {}
				s.push(e), n = e
			}
			return {
				parentIsUsefulElement: r,
				targetElementList: s
			}
		};

	function nx(e) {
		let t = new Set,
			i = 0;
		for (let r = e; r.parentNode && !s4(r, "body"); r = r.parentNode) {
			if (i++ >= 1e3 || t.has(r)) return !1;
			t.add(r);
			let e = ne(r);
			if (D(e, "ph-sensitive") || D(e, "ph-no-capture")) return !1
		}
		if (D(ne(e), "ph-include")) return !0;
		let r = e.type || "";
		if (K(r)) switch (r.toLowerCase()) {
			case "hidden":
			case "password":
				return !1
		}
		let s = e.name || e.id || "";
		return !K(s) || !/^cc|cardnum|ccnum|creditcard|csc|cvc|cvv|exp|pass|pwd|routing|seccode|securitycode|securitynum|socialsec|socsec|ssn/i.test(s.replace(/[^a-zA-Z0-9]/g, ""))
	}

	function nk(e) {
		return !!(s4(e, "input") && !["button", "checkbox", "submit", "reset"].includes(e.type) || s4(e, "select") || s4(e, "textarea") || "true" === e.getAttribute("contenteditable"))
	}
	let nE = RegExp("^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$"),
		nS = /(^|[^0-9A-Za-z_])([0-9][0-9 -]*[0-9])(?=$|[^0-9A-Za-z_])/g,
		n$ = [16, 15, 14, 13],
		nF = RegExp("^(\\d{3}-?\\d{2}-?\\d{4})$"),
		nP = RegExp("(^|[^0-9])((?!000|666)[0-9]{3}-?(?!00)[0-9]{2}-?(?!0000)[0-9]{4})(?=$|([^0-9]))", "g"),
		nT = /[0-9A-Za-z_]/;

	function nO(e, t = !0) {
		return !(Z(e) || K(e) && (e = N(e), (t ? nE.test((e || "").replace(/[- ]/g, "")) : function(e) {
			let t;
			for (nS.lastIndex = 0; t = nS.exec(e);) {
				let e = t[2];
				if (!e) continue;
				let i = e.replace(/[- ]/g, "");
				for (let e = 0; i.length > e; e++)
					for (let t of n$) {
						let r = e + t;
						if (i.length >= r) {
							let t = i.slice(e, r);
							if (nE.test(t) && function(e) {
									let t = 0,
										i = !1;
									for (let r = e.length - 1; r >= 0; r--) {
										let s = e.charCodeAt(r) - 48;
										i && (s *= 2) > 9 && (s -= 9), t += s, i = !i
									}
									return t % 10 == 0
								}(t)) return !0
						}
					}
			}
			return !1
		}(e)) || (t ? nF.test(e) : function(e) {
			let t;
			for (nP.lastIndex = 0; t = nP.exec(e);) {
				let e = t[1],
					i = t[3];
				if (!(e && i && nT.test(e) && nT.test(i))) return !0
			}
			return !1
		}(e)))) && !0
	}

	function nI(e) {
		let t = ni(e);
		return nO(t = `${t} ${(function e(t){let i="";return t&&t.childNodes&&t.childNodes.length&&sb(t.childNodes,function(t){var r;if(t&&"span"===(null==(r=t.tagName)?void 0:r.toLowerCase()))try{let r=ni(t);i=`${i} ${r}`.trim(),t.childNodes&&t.childNodes.length&&(i=`${i} ${e(t)}`.trim())}catch(e){rr.error("[AutoCapture]",e)}}),i})(e)}`.trim()) ? t : ""
	}

	function nR(e) {
		return e.replace(/"|\\"/g, '\\"')
	}
	let nC = rr.createLogger("[Dead Clicks]", void 0),
		nM = () => !0,
		nA = e => {
			var t;
			let i = !!(null == (t = e.instance.persistence) ? void 0 : t.get_property(rW)),
				r = e.instance.config.capture_dead_clicks;
			return et(r) ? r : !!W(r) || i
		};
	var nL = class {
		get lazyLoadedDeadClicksAutocapture() {
			return this.ql
		}
		constructor(e, t, i) {
			this.instance = e, this.isEnabled = t, this.onCapture = i, this.startIfEnabledOrStop()
		}
		onRemoteConfig(e) {
			if (!e.ok) return;
			let t = e.config;
			"captureDeadClicks" in t && (this.instance.persistence && this.instance.persistence.register({
				[rW]: t.captureDeadClicks
			}), this.startIfEnabledOrStop())
		}
		startIfEnabledOrStop() {
			this.isEnabled(this) ? this.Bl(() => {
				this.zl()
			}) : this.stop()
		}
		Bl(e) {
			var t, i, r;
			(null == (t = O.__PosthogExtensions__) ? void 0 : t.initDeadClicksAutocapture) ? e(): null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this.instance, "dead-clicks-autocapture", t => {
				t ? nC.error("failed to load script", t) : e()
			})
		}
		zl() {
			var e;
			if (x) {
				if (!this.ql && (null == (e = O.__PosthogExtensions__) ? void 0 : e.initDeadClicksAutocapture)) {
					let e = W(this.instance.config.capture_dead_clicks) ? tS({}, this.instance.config.capture_dead_clicks) : {};
					e.__onCapture = this.onCapture, this.onCapture && (e.capture_dead_swipes = !1), this.ql = O.__PosthogExtensions__.initDeadClicksAutocapture(this.instance, e), this.ql.start(x), nC.info("starting...")
				}
			} else nC.error("`document` not found. Cannot start.")
		}
		stop() {
			this.ql && (this.ql.stop(), this.ql = void 0, nC.info("stopping..."))
		}
	};
	let nD = rr.createLogger("[SegmentIntegration]", void 0);

	function nN(e, t, i = !0) {
		let r, s, n = e.config.segment;
		if (!n) return t();
		let {
			analytics: o,
			filterProperties: a
		} = G(n.register) ? {
			analytics: n
		} : n;
		r = r => {
			let s = () => r.anonymousId() || sM();
			e.config.get_device_id = s, i && r.id() && (e.register({
				distinct_id: r.id(),
				$device_id: s()
			}), e.persistence.set_property(r1, sd)), (i => {
				o.register(((e, t, {
					filterProperties: i
				} = {}) => {
					"u" > typeof Promise && Promise.resolve || nD.warn("This browser does not have Promise support, and can not use the segment integration");
					let r = (r, s) => {
						if (!s) return r;
						let n = !!t && r.event.anonymousId === t && !r.event.userId;
						n || r.event.userId || r.event.anonymousId === e.get_distinct_id() || (nD.info("No userId set, resetting PostHog"), e.reset()), n || (t = void 0), r.event.userId && r.event.userId !== e.get_distinct_id() && (nD.info("UserId set, identifying with PostHog"), e.identify(r.event.userId));
						let o = e.calculateEventProperties(s, r.event.properties);
						if (!Z(i)) {
							let e = r.event.properties || {},
								t = {};
							for (let i of Object.keys(o)) U.call(e, i) || (t[i] = o[i]);
							let s = ((e, t) => {
								let i = q(e) ? e : [e],
									r = tS({}, t);
								for (let e of i) try {
									if (r = e(r), Z(r)) return null
								} catch (e) {
									return nD.error("Error in Segment filterProperties:", e), null
								}
								return r
							})(i, t);
							if (Z(s)) return r;
							o = s
						}
						return r.event.properties = Object.assign({}, o, r.event.properties), r
					};
					return {
						name: "PostHog JS",
						type: "enrichment",
						version: "1.0.0",
						isLoaded: () => !0,
						load: () => Promise.resolve(),
						track: e => r(e, e.event.event),
						page: e => r(e, sg),
						identify: e => r(e, s_),
						screen: e => r(e, "$screen")
					}
				})(e, i, {
					filterProperties: a
				})).then(() => {
					t()
				}, e => {
					nD.error("Failed to register the Segment integration", e), t()
				})
			})(i ? void 0 : r.anonymousId() || void 0)
		}, "then" in (s = o.user()) && G(s.then) ? s.then(r) : r(s)
	}
	let nj = "posthog-js";

	function nz(e, {
		organization: t,
		projectId: i,
		prefix: r,
		severityAllowList: s = ["error"],
		sendExceptionsToPostHog: n = !0
	} = {}) {
		return o => {
			var a, l, u, c, h, d;
			if ("*" !== s && !s.includes(o.level) || !e.__loaded) return o;
			o.tags || (o.tags = {});
			let p = e.requestRouter.endpointFor("ui", `/project/${e.config.token}/person/${e.get_distinct_id()}`);
			o.tags["PostHog Person URL"] = p, e.sessionRecordingStarted() && (o.tags["PostHog Recording URL"] = e.get_session_replay_url({
				withTimestamp: !0
			}));
			let f = (null == (a = o.exception) ? void 0 : a.values) || [],
				g = f.map(e => tS(tS({}, e), {}, {
					stacktrace: e.stacktrace ? tS(tS({}, e.stacktrace), {}, {
						type: "raw",
						frames: (e.stacktrace.frames || []).map(e => tS(tS({}, e), {}, {
							platform: "web:javascript"
						}))
					}) : void 0
				})),
				v = {
					$exception_message: (null == (l = f[0]) ? void 0 : l.value) || o.message,
					$exception_type: null == (u = f[0]) ? void 0 : u.type,
					$exception_level: o.level,
					$exception_list: g,
					$sentry_event_id: o.event_id,
					$sentry_exception: o.exception,
					$sentry_exception_message: (null == (c = f[0]) ? void 0 : c.value) || o.message,
					$sentry_exception_type: null == (h = f[0]) ? void 0 : h.type,
					$sentry_tags: o.tags
				};
			return t && i && (v.$sentry_url = (r || "https://sentry.io/organizations/") + t + "/issues/?project=" + i + "&query=" + o.event_id), n && (null == (d = e.exceptions) || d.sendExceptionEvent(v)), o
		}
	}
	var nH = class {
			constructor(e, t, i, r, s, n) {
				this.name = nj, this.setupOnce = function(o) {
					o(nz(e, {
						organization: t,
						projectId: i,
						prefix: r,
						severityAllowList: s,
						sendExceptionsToPostHog: null == n || n
					}))
				}
			}
		},
		nU = class {
			constructor(e) {
				this.Hl = (e, t, i) => {
					i && (i.noSessionId || i.activityTimeout || i.sessionPastMaximumLength || i.crossTabAdoption) && (rr.info("[PageViewManager] Session rotated, clearing pageview state", {
						sessionId: e,
						changeReason: i
					}), this.Ul = void 0, this._instance.scrollManager.resetContext())
				}, this._instance = e, this.Wl()
			}
			Wl() {
				var e;
				this.Vl = null == (e = this._instance.sessionManager) ? void 0 : e.onSessionId(this.Hl)
			}
			destroy() {
				var e;
				null == (e = this.Vl) || e.call(this), this.Vl = void 0
			}
			doPageView(e, t) {
				var i;
				let r = this.Gl(e, t);
				return this.Ul = {
					pathname: null != (i = null == y ? void 0 : y.location.pathname) ? i : "",
					pageViewId: t,
					timestamp: e
				}, this._instance.scrollManager.resetContext(), r
			}
			doPageLeave(e) {
				var t;
				return this.Gl(e, null == (t = this.Ul) ? void 0 : t.pageViewId)
			}
			doEvent() {
				var e;
				return {
					$pageview_id: null == (e = this.Ul) ? void 0 : e.pageViewId
				}
			}
			Gl(e, t) {
				let i = this.Ul;
				if (!i) return {
					$pageview_id: t
				};
				let r = {
						$pageview_id: t,
						$prev_pageview_id: i.pageViewId
					},
					s = this._instance.scrollManager.getContext();
				if (s && !this._instance.config.disable_scroll_properties) {
					let {
						maxScrollHeight: e,
						lastScrollY: t,
						maxScrollY: i,
						maxContentHeight: n,
						lastContentY: o,
						maxContentY: a
					} = s;
					if (!(J(e) || J(t) || J(i) || J(n) || J(o) || J(a))) {
						e = Math.ceil(e), t = Math.ceil(t), i = Math.ceil(i), n = Math.ceil(n), o = Math.ceil(o), a = Math.ceil(a);
						let s = e > 1 ? ev(t / e, 0, 1, rr) : 1,
							l = e > 1 ? ev(i / e, 0, 1, rr) : 1,
							u = n > 1 ? ev(o / n, 0, 1, rr) : 1,
							c = n > 1 ? ev(a / n, 0, 1, rr) : 1;
						r = sw(r, {
							$prev_pageview_last_scroll: t,
							$prev_pageview_last_scroll_percentage: s,
							$prev_pageview_max_scroll: i,
							$prev_pageview_max_scroll_percentage: l,
							$prev_pageview_last_content: o,
							$prev_pageview_last_content_percentage: u,
							$prev_pageview_max_content: a,
							$prev_pageview_max_content_percentage: c
						})
					}
				}
				return i.pathname && (r.$prev_pageview_pathname = i.pathname), i.timestamp && (r.$prev_pageview_duration = (e.getTime() - i.timestamp.getTime()) / 1e3), r
			}
		};
	let nB = ["flags", "surveys"],
		nq = {
			$people_distinct_id: {
				exposure: "hidden"
			},
			[rA]: {
				exposure: "hidden"
			},
			__cmpns: {
				exposure: "hidden"
			},
			[rz]: {
				exposure: "hidden"
			},
			[rD]: {
				exposure: "hidden"
			},
			[rj]: {
				exposure: "hidden"
			},
			[rS]: {
				exposure: "event"
			},
			[rH]: {
				exposure: "hidden"
			},
			[rJ]: {
				exposure: "hidden"
			},
			[rU]: {
				exposure: "event"
			},
			[rB]: {
				exposure: "hidden"
			},
			[rq]: {
				exposure: "event"
			},
			[rG]: {
				exposure: "event"
			},
			[rW]: {
				exposure: "event"
			},
			[rV]: {
				exposure: "hidden"
			},
			[rK]: {
				exposure: "event"
			},
			[rY]: {
				exposure: "hidden"
			},
			$session_recording_enabled_server_side: {
				exposure: "hidden"
			},
			[rX]: {
				exposure: "hidden"
			},
			[rZ]: {
				exposure: "event"
			},
			$replay_sample_rate: {
				exposure: "event",
				shouldSkipFromEventProperties: e => X(e)
			},
			$session_past_minimum_duration: {
				exposure: "event"
			},
			$session_recording_url_trigger_activated_session: {
				exposure: "event"
			},
			$session_recording_event_trigger_activated_session: {
				exposure: "event"
			},
			$debug_first_full_snapshot_timestamp: {
				exposure: "event"
			},
			$sess_rec_flush_size: {
				exposure: "hidden"
			},
			[rv]: {
				exposure: "hidden",
				storageGroup: "flags"
			},
			[rc]: {
				exposure: "hidden",
				storageGroup: "flags"
			},
			[ru]: {
				exposure: "hidden"
			},
			[rh]: {
				exposure: "hidden",
				storageGroup: "flags"
			},
			[rw]: {
				exposure: "hidden",
				storageGroup: "flags"
			},
			[rf]: {
				exposure: "hidden",
				storageGroup: "flags",
				volatile: !0
			},
			[rg]: {
				exposure: "hidden",
				storageGroup: "flags"
			},
			[rx]: {
				exposure: "hidden"
			},
			[rk]: {
				exposure: "hidden"
			},
			[rm]: {
				exposure: "hidden"
			},
			[r_]: {
				exposure: "hidden"
			},
			[r$]: {
				exposure: "hidden",
				storageGroup: "surveys"
			},
			[rF]: {
				exposure: "hidden",
				storageGroup: "surveys",
				volatile: !0
			},
			[rT]: {
				exposure: "event"
			},
			[rO]: {
				exposure: "hidden"
			},
			[rI]: {
				exposure: "hidden"
			},
			[r0]: {
				exposure: "hidden"
			},
			$product_tours_activated: {
				exposure: "hidden"
			},
			$product_tours_activated_session: {
				exposure: "hidden"
			},
			$conversations_widget_session_id: {
				exposure: "event"
			},
			$conversations_ticket_id: {
				exposure: "event"
			},
			$conversations_widget_state: {
				exposure: "event"
			},
			$conversations_user_traits: {
				exposure: "event"
			},
			[ry]: {
				exposure: "hidden"
			},
			[rb]: {
				exposure: "hidden"
			},
			[rQ]: {
				exposure: "event"
			},
			[rd]: {
				exposure: "hidden"
			},
			[rp]: {
				exposure: "hidden",
				storageGroup: "flags",
				volatile: !0
			},
			[r1]: {
				exposure: "hidden"
			},
			[r2]: {
				exposure: "hidden"
			},
			[r3]: {
				exposure: "hidden"
			},
			[r5]: {
				exposure: "hidden"
			},
			[r4]: {
				exposure: "hidden"
			},
			[r8]: {
				exposure: "hidden"
			},
			[r6]: {
				exposure: "hidden"
			},
			$replay_override_sampling: {
				exposure: "event"
			},
			$replay_override_linked_flag: {
				exposure: "event"
			},
			$replay_override_url_trigger: {
				exposure: "event"
			},
			$replay_override_event_trigger: {
				exposure: "event"
			},
			[se]: {
				exposure: "event"
			},
			[st]: {
				exposure: "event"
			},
			[si]: {
				exposure: "hidden"
			},
			[sr]: {
				exposure: "hidden"
			},
			[ss]: {
				exposure: "hidden"
			},
			[sn]: {
				exposure: "hidden"
			},
			[so]: {
				exposure: "hidden"
			},
			[sa]: {
				exposure: "hidden"
			},
			[sl]: {
				exposure: "hidden"
			},
			[su]: {
				exposure: "hidden"
			},
			[sc]: {
				exposure: "hidden"
			},
			$session_recording_start_reason: {
				exposure: "event"
			}
		},
		nG = [
			["$posthog_sr_group_event_trigger_", {
				exposure: "hidden"
			}],
			["$posthog_sr_group_url_trigger_", {
				exposure: "hidden"
			}],
			["$posthog_sr_group_sampling_", {
				exposure: "hidden"
			}]
		],
		nW = e => {
			let t = nq[e];
			if (t) return t;
			for (let [t, i] of nG)
				if (0 === e.indexOf(t)) return i
		};

	function nV() {
		try {
			return Intl.DateTimeFormat().resolvedOptions().timeZone
		} catch (e) {
			return
		}
	}
	let nJ = e => {
			let t = typeof document > "u" ? void 0 : document,
				i = null == t ? void 0 : t.createElement("a");
			return J(i) ? null : (i.href = e, i)
		},
		nK = () => {
			try {
				return "u" > typeof window && !1 !== window.navigator.onLine
			} catch (e) {
				return !1
			}
		},
		nY = (e, t) => e >= t && nK(),
		nX = (e, t, i, r) => {
			if (0 === e) {
				if (nK()) {
					let e = t + 1;
					return e === i && r(), e
				}
				return t
			}
			return 0
		},
		nZ = (e, t) => {
			try {
				let i;
				return JSON.stringify(e, (e, t) => eo(t) ? (null != i || (i = new WeakMap), i.has(t) || i.set(t, sS(t)), i.get(t)) : "bigint" == typeof t ? t.toString() : t, t)
			} catch (t) {
				return z(e)
			}
		},
		nQ = function(e, t) {
			let i, r = ((e.split("#")[0] || "").split(/\?(.*)/)[1] || "").replace(/^\?+/g, "").split("&");
			for (let e = 0; r.length > e; e++) {
				let s = r[e].split(/=(.*)/);
				if (s[0] === t) {
					i = s;
					break
				}
			}
			if (!q(i) || 2 > i.length) return "";
			{
				let e = i[1].replace(/\+/g, " ");
				try {
					e = decodeURIComponent(e)
				} catch (t) {
					rr.error("Skipping decoding for malformed query param: " + e)
				}
				return e
			}
		},
		n0 = function(e, t, i) {
			if (!e || !t || !t.length) return e;
			let r = e.split(/#(.*)/),
				s = r[1],
				n = (r[0] || "").split(/\?(.*)/),
				o = n[1],
				a = n[0],
				l = (o || "").split("&"),
				u = [];
			for (let e = 0; l.length > e; e++) {
				let r = l[e].split("?"),
					s = 0;
				for (; r.length > s && !t.includes(r[s].split("=")[0]);) s++;
				u.push(r.length > s ? r.slice(0, s).concat(r[s].split("=")[0] + "=" + i).join("?") : l[e])
			}
			let c = a;
			return null != o && (c += "?" + u.join("&")), null != s && (c += "#" + s), c
		},
		n1 = function(e, t) {
			let i = e.match(RegExp(t + "=([^&]*)"));
			return i ? i[1] : null
		},
		n2 = ["gclid", "gclsrc", "dclid", "gbraid", "wbraid", "fbclid", "msclkid", "twclid", "li_fat_id", "igshid", "ttclid", "rdt_cid", "epik", "qclid", "sccid", "oppref", "bfcid", "irclid", "_kx"],
		n3 = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "gad_source", "mc_cid", ...n2],
		n5 = "<masked>",
		n4 = ["li_fat_id"];

	function n8(e, t, i) {
		let r;
		if (!x) return {};
		let s = t ? [...n2, ...i || []] : [],
			n = n6(n0(x.URL, s, n5), e);
		return sw((r = {}, sb(n4, function(e) {
			let t = sT(e);
			r[e] = t || null
		}), r), n)
	}

	function n6(e, t) {
		let i = n3.concat(t || []),
			r = {};
		return sb(i, function(t) {
			let i = nQ(e, t);
			r[t] = i || null
		}), r
	}

	function n9(e) {
		let t = e ? 0 === e.search("https?://(.*)google.([^/?]*)") ? "google" : 0 === e.search("https?://(.*)bing.com") ? "bing" : 0 === e.search("https?://(.*)yahoo.com") ? "yahoo" : 0 === e.search("https?://(.*)duckduckgo.com") ? "duckduckgo" : null : null,
			i = {};
		if (!X(t)) {
			i.$search_engine = t;
			let e = x ? nQ(x.referrer, "yahoo" != t ? "q" : "p") : "";
			e.length && (i.ph_keyword = e)
		}
		return i
	}

	function n7() {
		return navigator.language || navigator.userLanguage
	}
	let oe = "$direct";

	function ot() {
		return (null == x ? void 0 : x.referrer) || oe
	}

	function oi(e, t, i = !1) {
		let r = e ? [...n2, ...t || []] : [],
			s = i ? tm(null == k ? void 0 : k.href) : null == k ? void 0 : k.href,
			n = null == s ? void 0 : s.substring(0, 1e3);
		return {
			r: ot().substring(0, 1e3),
			u: n ? n0(n, r, n5) : void 0
		}
	}

	function or(e, t = !1) {
		var i;
		let {
			r: r,
			u: s
		} = e, n = t ? tm(s) : s, o = {
			$referrer: r,
			$referring_domain: null == r ? void 0 : r == oe ? oe : null == (i = nJ(r)) ? void 0 : i.host
		};
		if (n) {
			o.$current_url = n;
			let e = nJ(n);
			o.$host = null == e ? void 0 : e.host, o.$pathname = null == e ? void 0 : e.pathname, sw(o, n6(n))
		}
		return r && sw(o, n9(r)), o
	}
	let os = {
			flags: rp,
			surveys: rF
		},
		on = ["cookie", "localstorage", "localstorage+cookie", "sessionstorage", "memory"],
		oo = e => `${e}_cookie_identity_change_pending`,
		oa = e => {
			let t = "",
				i = 0;
			for (let r of e) {
				let e = encodeURIComponent(JSON.stringify(r).slice(1, -1)).length;
				if (i + e > 1e3) break;
				t += r, i += e
			}
			return t
		},
		ol = "main",
		ou = [rv, rc, rh, rw, rf, rp, rg, rm],
		oc = e => -1 !== ou.indexOf(e),
		oh = [rD, rj],
		od = e => -1 !== oh.indexOf(e),
		op = (e, t) => {
			try {
				return JSON.stringify(e) === JSON.stringify(t)
			} catch (i) {
				return e === t
			}
		},
		of = e => {
			if (!e) return {};
			let t = JSON.parse(e);
			return W(t) ? t : {}
		},
		og = (e, t) => {
			sb(e, (i, r) => {
				let s = nW(r);
				s && "event" !== s.exposure || ({}).hasOwnProperty.call(t, r) || delete e[r]
			})
		};
	var ov = class {
		constructor(e, t, i = !0, r = !e.cookieless_mode) {
			let s;
			if (this.Ql = {}, this.Jl = !1, this.Zl = !1, this.Kl = !1, this.Yl = !1, this.Xl = !1, this.tu = new Map, this.eu = !1, this.iu = !1, this.nu = !1, this.su = new Set, this.ru = new Set, this.Fr = e, this.ou = i, this.props = {}, this.au = void 0, this.lu = (s = "", e.token && (s = e.token.replace(/\+/g, "PL").replace(/\//g, "SL").replace(/=/g, "EQ")), e.persistence_name ? "ph_" + e.persistence_name : "ph_" + s + "_posthog"), this.fi = e.disable_persistence || !!t, this.Ll = this.uu(e), this.Kl = this.cu(e), this.load(r), this.hu(), e.debug && rr.info("Persistence loaded", e.persistence, tS({}, this.props)), this.update_config(e, e, t), this.save(), y) {
				let e = () => this.flush();
				sF(y, "beforeunload", e, {
					capture: !1
				}), sF(y, "pagehide", e, {
					capture: !1
				}), this.du = e => {
					if (this.Jl && (!e.storageArea || e.storageArea === (null == y ? void 0 : y.localStorage)) && e.key)
						if (e.key !== this.lu) {
							if (this.Kl) {
								let t = nB.find(t => e.key === this.vu(t));
								t && this.fu(e.key, t)
							}
						} else this.fu(e.key, ol)
				}, sF(y, "storage", this.du)
			}
		}
		markCrossTabFeatureFlagChanges(e) {
			Object.entries(e).forEach(([e, t]) => {
				let i = this.tu.get(e);
				if (!oc(e) || !0 === i) return;
				if (!0 === t) return void this.pu(e, !0);
				let r = new Set(i || []);
				t.forEach(e => r.add(e)), r.size && this.pu(e, r)
			})
		}
		onCrossTabFeatureFlagChange(e) {
			return this.ru.add(e), () => this.ru.delete(e)
		}
		destroy() {
			this.du && y && (y.removeEventListener("storage", this.du), this.du = void 0), this.ru.clear()
		}
		fu(e, t, i = !0) {
			let r, s;
			if (this.fi) return !1;
			try {
				if (s = sH.Lt(e), X(s)) {
					let e = this.gu(t);
					return e.storageValue = null, t !== ol && (e.persisted = !1), !1
				}
				r = of(s)
			} catch (e) {
				return !1
			}
			let n = t === ol ? r : sH.Ft(this.lu);
			if (n && this.mu(n)) return !1;
			let o = this.yu(r, t, i);
			return t === ol && this.Kl && !op(this.bu().main, r) || this._u(r, t, !0, s), o
		}
		mu(e) {
			let t = this.props[rR],
				i = e[rR];
			return !J(t) && !J(i) && t !== i
		}
		_u(e, t, i, r) {
			let s = this.gu(t);
			s.storageValue = r, t !== ol && (s.persisted = i);
			try {
				s.fingerprint = this.wu(e, t)
			} catch (e) {
				s.fingerprint = void 0
			}
		}
		yu(e, t, i) {
			let r = !1;
			return ou.forEach(i => {
				var s;
				let n = null == (s = nW(i)) ? void 0 : s.storageGroup;
				if (t === ol && this.Kl && n || t !== ol && n !== t) return;
				let o = i in e,
					a = this.ku(i, o ? e[i] : void 0),
					l = this.tu.has(i) ? i in this.props : o;
				l === i in this.props && op(a, this.props[i]) || (l ? this.Su(i, a, !1) : this.xu(i, !1), r = !0)
			}), r && i && this.ru.forEach(e => e()), r
		}
		$u() {
			if (!this.Jl) return !1;
			try {
				this.nu = !1;
				let e = sH.Lt(this.lu),
					t = this.gu(ol),
					i, r = !1,
					s = !1;
				if (e !== t.storageValue)
					if (X(e)) t.storageValue = null;
					else {
						if (i = of(e), this.nu = !this.iu && this.mu(i), this.nu) return !1;
						s = this.yu(i, ol, !1), !this.Kl || op(this.bu().main, i) ? this._u(i, ol, !0, e) : t.storageValue = e, r = !0
					} return this.Kl && nB.forEach(e => {
					let t = sH.Lt(this.vu(e)),
						n = this.gu(e),
						o = i || {},
						a = r && ou.some(t => {
							var i;
							return (null == (i = nW(t)) ? void 0 : i.storageGroup) === e && t in o
						});
					if (t === n.storageValue && !a) return;
					if (X(t)) return n.storageValue = null, n.persisted = !1, void(a && (s = this.yu(o, e, !1) || s));
					let l = of(t);
					s = this.yu(l, e, !1) || s, this._u(l, e, !0, t)
				}), s
			} catch (e) {
				return !1
			}
		}
		pu(e, t) {
			this.tu.set(e, t);
			let i = nW(e);
			(null == i ? void 0 : i.volatile) || (this.gu((this.Kl ? null == i ? void 0 : i.storageGroup : void 0) || ol).fingerprint = void 0, this.Cu(e))
		}
		Tu() {
			ou.forEach(e => this.tu.set(e, !0))
		}
		hu() {
			if (this.Jl) try {
				let e = sH.Lt(this.lu),
					t = of(e);
				this.gu(ol).storageValue = e, ou.forEach(e => {
					var i;
					let r = this.Kl ? null == (i = nW(e)) ? void 0 : i.storageGroup : void 0,
						s = r ? sH.Lt(this.vu(r)) : null;
					if (r) {
						let e = this.gu(r);
						e.storageValue = s, e.persisted = !X(s)
					}
					let n = r && !X(s) ? of(s) : t;
					e in this.props ? this.Iu(e, n[e], this.props[e]) : e in n && this.pu(e, !0)
				})
			} catch (e) {}
		}
		ku(e, t) {
			let i = this.tu.get(e);
			if (!i) return t;
			if (!0 === i) return this.props[e];
			if ("$active_feature_flags" === e) {
				let r = new Set(q(t) ? t : []),
					s = new Set(q(this.props[e]) ? this.props[e] : []);
				return i.forEach(e => s.has(e) ? r.add(e) : r.delete(e)), Array.from(r)
			}
			let r = W(t) ? tS({}, t) : {},
				s = W(this.props[e]) ? this.props[e] : {};
			return i.forEach(e => {
				e in s ? r[e] = s[e] : delete r[e]
			}), r
		}
		Iu(e, t, i) {
			if (!oc(e)) return;
			let r = this.tu.get(e);
			if (!0 === r) return;
			let s = t;
			if (this.Jl) try {
				var n;
				let t = this.Kl ? null == (n = nW(e)) ? void 0 : n.storageGroup : void 0,
					i = t ? this.vu(t) : this.lu;
				s = of(sH.Lt(i))[e]
			} catch (e) {}
			let o = new Set(r || []);
			if ("$active_feature_flags" === e) {
				if (!J(t) && !q(t) || !J(s) && !q(s) || !q(i)) return void this.pu(e, !0);
				let r = new Set(t || []),
					n = new Set(s || []),
					a = new Set(i);
				new Set([...r, ...a]).forEach(e => {
					r.has(e) !== a.has(e) && o.add(e)
				}), o.forEach(e => {
					n.has(e) === a.has(e) && o.delete(e)
				})
			} else {
				if (!W(i)) return void(op(s, i) ? this.tu.delete(e) : this.pu(e, !0));
				{
					if (!J(t) && !W(t) || J(t) && V(i) && J(s)) return void this.pu(e, !0);
					let r = W(t) ? t : {},
						n = W(s) ? s : {};
					new Set([...Object.keys(r), ...Object.keys(i)]).forEach(e => {
						e in r == e in i && op(r[e], i[e]) || o.add(e)
					}), o.forEach(e => {
						e in n == e in i && op(n[e], i[e]) && o.delete(e)
					})
				}
			}
			o.size ? this.pu(e, o) : this.tu.delete(e)
		}
		Mu() {
			var e;
			let t = null == (e = this.Fr) ? void 0 : e.persistence_save_debounce_ms;
			return Q(t) && t > 0 ? t : 0
		}
		Eu(e) {
			if (this.Fr.cookieWinsOnConflict && "localstorage+cookie" === this.Fr.persistence.toLowerCase())
				if (e) try {
					let t = sW(e, this.Fr.cookie_persisted_properties || []),
						i = sJ(t, this.Fr.cookie_persisted_properties || []),
						r = JSON.stringify(t) + "|" + JSON.stringify(i),
						s = sj.Lt(this.lu) || void 0;
					s && sY(this.lu, s) === r && (this.Au = r, this.Ru = s)
				} catch (e) {} else try {
					let e = sj.Lt(this.lu) || void 0;
					this.Au = e ? sY(this.lu, e) : void 0, this.Ru = e
				} catch (e) {}
		}
		syncCookieProperties() {
			return this.Pu(this.Fr)
		}
		Pu(e, t = !1) {
			let i, r;
			if (this.fi && !t || this.Xl || !e.cookieWinsOnConflict || "localstorage+cookie" !== e.persistence.toLowerCase()) return !1;
			try {
				i = sj.Lt(this.lu) || void 0
			} catch (e) {}
			if (!i || i === this.Ru) return !1;
			let s = sY(this.lu, i);
			try {
				r = sG(JSON.parse(i))
			} catch (e) {
				return !1
			}
			if ((sj.Lt(this.lu) || void 0) !== i) return !1;
			this.Au = s, this.Ru = i;
			let n = sK(this.lu, i),
				o = [...sB, ...n.properties],
				a = {};
			if (Object.keys(r).forEach(e => {
					let t = r[e];
					(J(t) || X(t) || "" === t || "$user_state" === e && "anonymous" !== t && "identified" !== t) && (a[e] = !0, delete r[e])
				}), V(r)) return !1;
			let l = "distinct_id" in r || "anonymous" === r.$user_state || "identified" === r.$user_state,
				u = this.props,
				c = u[rR],
				h = u[r1],
				d = sw({}, u);
			[...sB, ...e.cookie_persisted_properties || []].forEach(e => {
				if (-1 !== o.indexOf(e) && !(e in r) && !a[e] && (l || "distinct_id" !== e && "$user_state" !== e)) {
					let t = d[e];
					(n.isValid || -1 === sB.indexOf(e) || !1 !== t && 0 !== t) && delete d[e]
				}
			}), this.props = sw(d, r), ou.forEach(e => {
				let t = e in this.props;
				e in u === t && op(u[e], this.props[e]) || (t ? this.Iu(e, u[e], this.props[e]) : this.pu(e, !0))
			}), !l || "$user_state" in r || "$user_state" in this.props || this.Su(r1, sh);
			let p = this.props[rR],
				f = this.props[r1];
			return l && (p !== c || f !== h) && (this.iu = !0, this.Yl = !0, s0.$t(oo(this.lu), !0), this.xu(rm), this.xu(rc), this.xu(rv), this.xu(rh), this.xu(rw), this.xu(rf), this.xu(rp), this.xu(rd), this.xu(ry), "anonymous" !== f || "identified" !== h && "anonymous" !== r.$user_state && (J(c) || p === c) || (og(this.props, r), this.xu(r_)), "identified" === f ? this.props.$user_id = p : delete this.props.$user_id, this.xu(rA)), !0
		}
		consumeCookieIdentityChange() {
			let e = oo(this.lu),
				t = this.Yl || !!s0.Lt(e);
			return this.Yl = !1, t && s0.Dt(e), t
		}
		Ou(e = !1) {
			return !(this.Xl || this.fi && !e || !this.Fr.cookieWinsOnConflict || "localstorage+cookie" !== this.Fr.persistence.toLowerCase() || (this.Xl = !0, 0))
		}
		Fu() {
			this.Xl && (J(this.Du) || (clearTimeout(this.Du), this.Du = void 0), delete this.Ql[ol], this.Lu(!0))
		}
		Nu(e = !0) {
			if (this.Xl) try {
				e ? this.Fu() : J(this.Du) || (clearTimeout(this.Du), this.Du = void 0)
			} finally {
				this.Xl = !1
			}
		}
		isDisabled() {
			return !!this.fi
		}
		uu(e) {
			-1 === on.indexOf(e.persistence.toLowerCase()) && (rr.critical("Unknown persistence type " + e.persistence + "; falling back to localStorage+cookie"), e.persistence = "localStorage+cookie");
			let t = ((e = [], t = !1, i = () => !1) => {
					let r = [...sB, ...e];
					return tS(tS({}, sH), {}, {
						ju: e => [sj.Lt(e), sj.Lt(e + "_cpm"), sH.Lt(e)].join("\0"),
						Ft(e) {
							try {
								let n, o, a = {};
								try {
									a = (o = sj.Lt(e) || void 0) ? sG(JSON.parse(o)) : {}
								} catch (e) {}
								let l = JSON.parse(sH.Lt(e) || "{}");
								if (t) {
									let t = sK(e, o),
										i = [...sB, ...t.properties],
										u = {};
									Object.keys(a).forEach(e => {
										let t = a[e];
										X(t) || "" === t || "$user_state" === e && "anonymous" !== t && "identified" !== t || (u[e] = t)
									});
									let c = "distinct_id" in u || "anonymous" === u.$user_state || "identified" === u.$user_state;
									if (Object.keys(u).length > 0) {
										var s;
										let e = l[rR],
											n = null != (s = l.$user_state) ? s : sh;
										r.forEach(e => {
											if (-1 !== i.indexOf(e) && !(e in a) && (c || "distinct_id" !== e && "$user_state" !== e)) {
												let i = l[e];
												(t.isValid || -1 === sB.indexOf(e) || !1 !== i && 0 !== i) && delete l[e]
											}
										}), !c || "$user_state" in a || "$user_state" in l || (l[r1] = sh), c && (("distinct_id" in u ? u[rR] : l[rR]) !== e || ("$user_state" in u ? u[r1] : l[r1]) !== n) && (sU.forEach(e => delete l[e]), "identified" === u.$user_state && "distinct_id" in u ? l.$user_id = u[rR] : delete l.$user_id, "identified" !== u.$user_state && (delete l[rQ], delete l[r_]), delete l.__alias)
									}
									n = sw(l, u)
								} else n = sw(a, l);
								return i() || sH.$t(e, n), n
							} catch (e) {}
							return null
						},
						$t(i, r, s, n, o, a) {
							let l = sH.$t(i, r, void 0, void 0, a);
							try {
								let u = sW(r, e);
								if (Object.keys(u).length) {
									if (t) {
										let t = i + "_cpm",
											c = sJ(u, e);
										if (sj.$t(t, c, s, n, o, a), sj.Lt(t) !== JSON.stringify(c)) {
											sj.Dt(t, n);
											let e = sW(r);
											return sj.$t(i, e, s, n, o, a), l
										}
									}
									sj.$t(i, u, s, n, o, a)
								}
							} catch (e) {
								sH.Pt(e)
							}
							return l
						},
						Dt(e, t) {
							try {
								null == y || y.localStorage.removeItem(e), sj.Dt(e, t), sj.Dt(e + "_cpm", t)
							} catch (e) {
								sH.Pt(e)
							}
						}
					})
				})(e.cookie_persisted_properties || [], e.cookieWinsOnConflict, () => !!this.fi),
				i, r = !1,
				s = !1,
				n = e.persistence.toLowerCase();
			return "localstorage" === n && sH.Ot() ? (i = sH, s = !0) : "localstorage+cookie" === n && t.Ot() ? (i = t, s = !0, r = !0) : "sessionstorage" === n && s0.Ot() ? i = s0 : "memory" === n ? i = sZ : "cookie" === n && sj.Ot() ? (i = sj, r = !0) : t.Ot() ? (i = t, s = !0, r = !0) : sj.Ot() ? (i = sj, r = !0) : i = sZ, this.Jl = s, this.Zl = r, i
		}
		vu(e) {
			return `${this.lu}__${e}`
		}
		cu(e) {
			return this.Jl && !!e.split_storage
		}
		properties() {
			let e = {};
			return sb(this.props, (t, i) => {
				let r = nW(i);
				if (!r || "event" === r.exposure) {
					var s;
					if (null == r || null == (s = r.shouldSkipFromEventProperties) ? void 0 : s.call(r, t)) return;
					e[i] = t
				}
			}), e
		}
		load(e = !1) {
			if (this.fi && !e) return;
			let t = this.Fr.cookieWinsOnConflict && "localstorage+cookie" === this.Fr.persistence.toLowerCase(),
				i = t ? sH.Ft(this.lu) : null,
				r = {};
			if (t) try {
				r = sG(sj.Ft(this.lu)), sb(r, (e, t) => {
					(J(e) || X(e) || "" === e) && delete r[t]
				})
			} catch (e) {}
			let s = this.Ll.Ft(this.lu);
			if (s && (this.props = sw({}, s)), this.Kl && this.qu(), t && s) {
				var n, o;
				let e = null == i ? void 0 : i[rR],
					t = null != (n = null == i ? void 0 : i.$user_state) ? n : sh,
					a = s[rR],
					l = null != (o = s.$user_state) ? o : sh;
				if (a !== e || l !== t) {
					this.Yl = !0, this.fi || s0.$t(oo(this.lu), !0);
					let i = sw({}, this.props);
					sU.forEach(e => delete i[e]), "anonymous" !== l || "identified" !== t && "anonymous" !== r.$user_state && (J(e) || a === e) || (og(i, r), delete i[r_]), this.props = i;
					let s = new Set;
					sU.forEach(e => {
						var t;
						let i = null == (t = nW(e)) ? void 0 : t.storageGroup;
						i && s.add(i)
					}), s.forEach(e => {
						if (this.fi) return;
						let t = {};
						sb(this.props, (i, r) => {
							var s;
							(null == (s = nW(r)) ? void 0 : s.storageGroup) === e && (t[r] = i)
						}), V(t) ? (sH.Dt(this.vu(e)), this.Ql[e] = {}) : sH.$t(this.vu(e), t) && (this.Ql[e] = {
							persisted: !0,
							fingerprint: this.wu(t, e)
						})
					})
				}
			}
			s0.Lt(oo(this.lu)) && (this.Yl = !0)
		}
		qu() {
			for (let e of nB) {
				let t = sH.Ft(this.vu(e));
				if (t && !V(t)) {
					let i = this.gu(e);
					i.persisted = !0, this.Bu(e) || (i.fingerprint = this.wu(t, e)), this.zu(e, t) || sw(this.props, t)
				}
			}
		}
		Bu(e) {
			return Object.keys(this.props).some(t => {
				var i;
				return (null == (i = nW(t)) ? void 0 : i.storageGroup) === e
			})
		}
		zu(e, t) {
			let i = os[e];
			if (!i) return !1;
			let r = t[i],
				s = this.props[i];
			return Q(r) && Q(s) && s > r
		}
		refreshKey(e) {
			this.Hu([e])
		}
		Hu(e) {
			if (this.fi) return;
			let t, i = !1,
				r = () => (i || (t = this.Ll.Ft(this.lu), i = !0), t);
			e.forEach(e => {
				var t;
				if (this.su.has(e)) return;
				let i = this.Kl ? null == (t = nW(e)) ? void 0 : t.storageGroup : void 0,
					s = i ? sH.Ft(this.vu(i)) : r();
				if (s && e in s) this.Su(e, s[e], !1);
				else {
					if (i) {
						let t = r();
						if (t && e in t) return void this.Su(e, t[e], !1)
					}
					this.xu(e, !1)
				}
			})
		}
		refreshMetaIdentifiers() {
			if (this.fi) return;
			let e = this.Uu();
			(J(e) || e !== this.Wu) && (this.Hu(oh), this.Vu(e))
		}
		Vu(e = this.Uu()) {
			this.Wu = 0 === this.su.size ? e : void 0
		}
		Uu() {
			let e = this.Ll.ju ? this.Ll.ju(this.lu) : this.Ll.Lt(this.lu);
			return K(e) ? e : void 0
		}
		save() {
			if (this.fi) return;
			let e = this.Mu();
			e > 0 ? J(this.Du) && (this.Du = setTimeout(() => {
				this.Du = void 0, this.Lu()
			}, e)) : this.Lu()
		}
		flush() {
			J(this.Du) || (clearTimeout(this.Du), this.Du = void 0, this.Lu())
		}
		Lu(e = !1) {
			if (this.fi || this.Xl && !e) return;
			e || (this.syncCookieProperties(), this.Fr.cookieWinsOnConflict && "localstorage+cookie" === this.Fr.persistence.toLowerCase() || this.refreshMetaIdentifiers());
			let t = !e && !this.eu;
			t || (this.nu = !1);
			let i = !!t && this.$u();
			if (this.nu) return void(this.Fr.debug && rr.warn("skipping persistence write because storage belongs to a different distinct ID"));
			if (this.Kl) return this.Gu(), void(i && this.ru.forEach(e => e()));
			let r = this.Qu(this.Ll, this.lu, this.props, ol);
			"written" === r && this.Eu(this.props), "failed" !== r && (this.tu.clear(), this.iu = !1, this.su.clear()), "written" === r && this.Vu(), i && this.ru.forEach(e => e())
		}
		Gu() {
			let {
				main: e,
				groups: t
			} = this.bu(), i = this.Qu(this.Ll, this.lu, e, ol);
			for (let s of ("written" === i && this.Eu(e), "failed" !== i && (this.iu = !1, this.su.clear(), ou.forEach(e => {
					var t;
					(null == (t = nW(e)) ? void 0 : t.storageGroup) || this.tu.delete(e)
				})), "written" === i && this.Vu(), nB)) {
				var r;
				let e = t[s];
				if (V(e) && !(null == (r = this.Ql[s]) ? void 0 : r.persisted)) {
					ou.forEach(e => {
						var t;
						(null == (t = nW(e)) ? void 0 : t.storageGroup) === s && this.tu.delete(e)
					});
					continue
				}
				let i = this.Qu(sH, this.vu(s), e, s);
				"failed" !== i && ou.forEach(e => {
					let t = nW(e);
					(null == t ? void 0 : t.storageGroup) !== s || "written" !== i && t.volatile || this.tu.delete(e)
				})
			}
		}
		bu() {
			let e = {},
				t = {
					flags: {},
					surveys: {}
				};
			return sb(this.props, (i, r) => {
				var s;
				let n = null == (s = nW(r)) ? void 0 : s.storageGroup;
				n ? t[n][r] = i : e[r] = i
			}), {
				main: e,
				groups: t
			}
		}
		wu(e, t) {
			if (t === ol) return JSON.stringify(e) + "|" + this.Ju + "|" + this.Zu + "|" + this.Ku;
			let i = {};
			return sb(e, (e, t) => {
				var r;
				i[t] = (null == (r = nW(t)) ? void 0 : r.volatile) ? "__volatile__" : e
			}), JSON.stringify(i)
		}
		Qu(e, t, i, r) {
			let s, n = this.gu(r);
			if (r !== ol && !n.dirty && !J(n.fingerprint)) return "skipped";
			try {
				if ((s = this.wu(i, r)) === n.fingerprint) return n.dirty = !1, "skipped"
			} catch (e) {
				s = void 0
			}
			return e.$t(t, i, this.Ju, this.Zu, this.Ku, this.Fr.debug) ? (n.dirty = !1, r !== ol && (n.persisted = !0), J(s) || (n.fingerprint = s), this.Jl && (n.storageValue = sH.Lt(t)), "written") : (this.Fr.debug && rr.warn(`failed to persist storage entry "${t}"; will retry on next save`), "failed")
		}
		remove({
			keepGroupEntries: e = !1
		} = {}) {
			if (this.Tu(), J(this.Du) || (clearTimeout(this.Du), this.Du = void 0), this.Ll.Dt(this.lu, !1), this.Ll.Dt(this.lu, !0), !e && this.ou)
				for (let e of nB) sH.Dt(this.vu(e));
			e ? delete this.Ql[ol] : this.Ql = {}, this.Au = void 0, this.Ru = void 0
		}
		clear() {
			this.remove(), this.props = {}
		}
		register_once(e, t, i) {
			if (W(e)) {
				this.syncCookieProperties(), J(t) && (t = "None"), this.Ju = J(i) ? this.Yu : i;
				let r = !1;
				if (sb(e, (e, i) => {
						this.props.hasOwnProperty(i) && this.props[i] !== t || (this.Su(i, e), r = !0)
					}), r) return this.save(), !0
			}
			return !1
		}
		register(e, t) {
			if (W(e)) {
				this.syncCookieProperties(), this.Ju = J(t) ? this.Yu : t;
				let i = !1;
				if (sb(e, (t, r) => {
						e.hasOwnProperty(r) && (this.props[r] !== t || W(t) || q(t)) && (this.Su(r, t), i = !0)
					}), i) return this.save(), !0
			}
			return !1
		}
		unregister(e) {
			this.syncCookieProperties();
			let t = !1;
			for (let i of "string" == typeof e ? [e] : e) i in this.props && (this.xu(i), t = !0);
			t && this.save()
		}
		update_campaign_params() {
			let e = null == x ? void 0 : x.URL;
			if (e === this.au) return;
			let t = n8(this.Fr.custom_campaign_params, this.Fr.mask_personal_data_properties, this.Fr.custom_personal_data_properties),
				i = !V(sE(t));
			return i && this.register(t), this.au = e, i ? t : void 0
		}
		update_search_keyword() {
			let e;
			this.register((e = null == x ? void 0 : x.referrer) ? n9(e) : {})
		}
		update_referrer_info() {
			var e;
			this.register_once({
				$referrer: ot(),
				$referring_domain: (null == x ? void 0 : x.referrer) && (null == (e = nJ(x.referrer)) ? void 0 : e.host) || oe
			}, void 0)
		}
		set_initial_person_info() {
			if (this.props.$initial_campaign_params || this.props.$initial_referrer_info) return;
			let e = oi(this.Fr.mask_personal_data_properties, this.Fr.custom_personal_data_properties, this.Fr.disable_capture_url_hashes);
			this.register_once({
				[r8]: this.Zl ? {
					r: oa(e.r),
					u: e.u ? oa(e.u) : void 0
				} : e
			}, void 0)
		}
		get_initial_props() {
			let e = {};
			sb([r4, r5], t => {
				let i = this.props[t];
				i && sb(i, function(t, i) {
					e["$initial_" + j(i)] = t
				})
			});
			let t = this.props[r8];
			return t && sw(e, function(e, t = !1) {
				let i = or(e, t),
					r = {};
				return sb(i, function(e, t) {
					r[`$initial_${j(t)}`] = e
				}), r
			}(t, this.Fr.disable_capture_url_hashes)), e
		}
		safe_merge(e) {
			return sb(this.props, function(t, i) {
				i in e || (e[i] = t)
			}), e
		}
		update_config(e, t, i) {
			let r = e.persistence !== t.persistence,
				s = !((e, t) => {
					if (e.length !== t.length) return !1;
					let i = [...e].sort(),
						r = [...t].sort();
					return i.every((e, t) => e === r[t])
				})(e.cookie_persisted_properties || [], t.cookie_persisted_properties || []),
				n = r || s,
				o = e.cookieWinsOnConflict !== t.cookieWinsOnConflict,
				a = e.disable_persistence || !!i,
				l = !!this.fi && !a;
			a || this.Pu(t, l), this.Fr = e, !a && (r || s || o) && (this.Au = void 0, this.Ru = void 0, this.Pu(tS(tS({}, e), {}, {
				cookie_persisted_properties: t.cookie_persisted_properties
			}), l));
			let u = n || o ? this.uu(e) : this.Ll;
			this.Xu();
			let c = this.cu(e),
				h = n || c !== this.Kl,
				d = !a && (h || e.cross_subdomain_cookie !== this.Zu || e.secure_cookie !== this.Ku) && this.Ou(l);
			this.eu = h;
			try {
				if (this.Yu = this.Ju = e.cookie_expiration, this.set_disabled(a), this.set_cross_subdomain(e.cross_subdomain_cookie), this.set_secure(e.secure_cookie), h) {
					let e = this.props;
					this.clear(), this.Ll = u, this.Kl = c, this.props = e, this.save()
				} else o && (this.Ll = u, a || (delete this.Ql[ol], this.Lu()))
			} finally {
				this.eu = !1, d && this.Nu()
			}
		}
		Xu() {
			let e = this.props[r8];
			if (!this.Zl || !W(e) || "string" != typeof e.r) return;
			let t = oa(e.r),
				i = "string" == typeof e.u ? oa(e.u) : e.u;
			t === e.r && i === e.u || this.Su(r8, tS(tS({}, e), {}, {
				r: t,
				u: i
			}))
		}
		set_disabled(e) {
			this.fi = e, this.fi ? this.remove() : this.save()
		}
		set_cross_subdomain(e) {
			e !== this.Zu && (this.Zu = e, this.remove({
				keepGroupEntries: !0
			}), this.save())
		}
		set_secure(e) {
			e !== this.Ku && (this.Ku = e, this.remove({
				keepGroupEntries: !0
			}), this.save())
		}
		set_event_timer(e, t) {
			let i = this.props.__timers || {};
			i[e] = t, this.Su(rz, i), this.save()
		}
		remove_event_timer(e) {
			let t = this.props.__timers || {},
				i = t[e];
			return J(i) || (delete t[e], this.Su(rz, t), this.save()), i
		}
		get_property(e) {
			return this.props[e]
		}
		set_property(e, t) {
			this.Su(e, t), this.save()
		}
		Su(e, t, i = !0) {
			var r;
			let s = this.props[e];
			this.props[e] = t, i && ("distinct_id" !== e && "$user_state" !== e || s === t || (this.iu = !0), od(e) && !op(s, t) && this.su.add(e), this.Iu(e, s, t), (null == (r = nW(e)) ? void 0 : r.volatile) || this.Cu(e))
		}
		xu(e, t = !0) {
			delete this.props[e], t && (oc(e) && this.pu(e, !0), od(e) && this.su.add(e), this.Cu(e))
		}
		Cu(e) {
			var t;
			let i = null == (t = nW(e)) ? void 0 : t.storageGroup;
			i && (this.gu(i).dirty = !0)
		}
		gu(e) {
			return this.Ql[e] || (this.Ql[e] = {})
		}
	};
	let o_ = "gzip-js",
		om = "base64",
		oy = "events",
		ob = "cancelEvents",
		ow = "survey shown",
		ox = "survey dismissed",
		ok = "survey sent",
		oE = "popover";

	function oS(e) {
		let t = !0;
		return {
			dispose() {
				if (t) {
					t = !1;
					let i = e();
					i && G(i.then) && i.then(void 0, () => {})
				}
			}
		}
	}
	let o$ = rr.createLogger("[RateLimiter]", void 0);
	var oF = class {
		constructor(e) {
			this.serverLimits = {}, this.lastEventRateLimited = !1, this.checkForLimiting = e => {
				let t = e.text;
				if (t && t.length) try {
					(JSON.parse(t).quota_limited || []).forEach(e => {
						o$.info(`${e||"events"} is quota limited.`), this.serverLimits[e] = (new Date).getTime() + 6e4
					})
				} catch (e) {
					return void o$.warn(`could not rate limit - continuing. Error: "${null==e?void 0:e.message}"`, {
						text: t
					})
				}
			}, this.instance = e, this.lastEventRateLimited = this.clientRateLimitContext(!0).isRateLimited
		}
		get captureEventsPerSecond() {
			var e;
			return (null == (e = this.instance.config.rate_limiting) ? void 0 : e.events_per_second) || 10
		}
		get captureEventsBurstLimit() {
			var e;
			return Math.max((null == (e = this.instance.config.rate_limiting) ? void 0 : e.events_burst_limit) || 10 * this.captureEventsPerSecond, this.captureEventsPerSecond)
		}
		get isClientRateLimited() {
			return 1 > this.tc().tokens
		}
		clientRateLimitContext(e = !1) {
			var t;
			let i = this.tc(),
				r = 1 > i.tokens;
			if (r || e || (i.tokens = Math.max(0, i.tokens - 1)), r && !e) {
				let e = (Q(i.dropped) ? i.dropped : 0) + 1;
				i.dropped = e, !this.lastEventRateLimited && this.ec(e) && (i.dropped = 0)
			}
			return this.lastEventRateLimited = r, null == (t = this.instance.persistence) || t.set_property("$capture_rate_limit", i), {
				isRateLimited: r,
				remainingTokens: i.tokens
			}
		}
		tc() {
			var e;
			let {
				captureEventsBurstLimit: t,
				captureEventsPerSecond: i
			} = this, r = (new Date).getTime(), s = null == (e = this.instance.persistence) ? void 0 : e.get_property(r3), n = s ? tS({}, s) : {
				tokens: t,
				last: r
			};
			return n.tokens += Math.max(0, r - n.last) / 1e3 * i, n.last = Math.max(n.last, r), n.tokens > t && (n.tokens = t), n
		}
		nc(e) {
			let t = this.instance.config.property_denylist;
			return !q(t) || !t.includes(e)
		}
		sc() {
			var e;
			if (this.nc("$current_url") && this.nc("$pathname") && (null == k ? void 0 : k.pathname)) return `${null!=(e=k.origin)?e:""}${k.pathname}`
		}
		ec(e) {
			var t, i;
			let {
				captureEventsBurstLimit: r,
				captureEventsPerSecond: s
			} = this, n = this.sc(), o = this.nc("$session_id") ? null == (t = (i = this.instance).get_session_id) ? void 0 : t.call(i) : void 0, a = [`${e} event(s) dropped since the last warning`, n ? `triggered on ${n}` : void 0, o ? `session ${o}` : void 0].filter(Boolean).join(", ");
			return !!this.instance.capture("$$client_ingestion_warning", {
				$$client_ingestion_warning_message: `posthog-js client rate limited: ${a}. Config is set to ${s} events per second and ${r} events burst limit.`
			}, {
				skip_client_rate_limiting: !0
			})
		}
		isServerRateLimited(e) {
			let t = this.serverLimits[e || "events"] || !1;
			return !1 !== t && (new Date).getTime() < t
		}
	};
	let oP = rr.createLogger("[RemoteConfig]", void 0);
	var oT = class {
			constructor(e) {
				this._instance = e
			}
			get remoteConfig() {
				var e;
				return null == (e = O._POSTHOG_REMOTE_CONFIG) || null == (e = e[this._instance.config.token]) ? void 0 : e.config
			}
			rc(e) {
				var t, i, r;
				(null == (t = O.__PosthogExtensions__) ? void 0 : t.loadExternalDependency) ? null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this._instance, "remote-config", () => e(this.remoteConfig)): e()
			}
			oc(e) {
				this._instance._send_request({
					method: "GET",
					url: this._instance.requestRouter.endpointFor("assets", `/array/${this._instance.config.token}/config`),
					callback: e
				})
			}
			load() {
				try {
					if (this.remoteConfig) return oP.info("Using preloaded remote config", this.remoteConfig), void this.ac(this.remoteConfig);
					if (this._instance.lc()) return void oP.warn("Remote config is disabled. Falling back to local config.");
					this.rc(e => {
						e ? this.ac(e) : (oP.info("No config found after loading remote JS config. Falling back to JSON."), this.oc(e => {
							this.ac(e.json, e)
						}))
					})
				} catch (e) {
					oP.error("Error loading remote config", e), this.ac()
				}
			}
			ac(e, t) {
				!e && t && (0 === t.statusCode ? t.error || oP.warn("Failed to fetch remote config from PostHog.") : oP.error("Failed to fetch remote config from PostHog."));
				try {
					this._instance.ac(e ? {
						ok: !0,
						config: e
					} : {
						ok: !1
					})
				} catch (e) {
					oP.error("Error applying remote config", e)
				}
				if (!1 !== (null == e ? void 0 : e.hasFeatureFlags) && !this._instance.config.advanced_disable_feature_flags_on_first_load) try {
					var i;
					null == (i = this._instance.featureFlags) || i.ensureFlagsLoaded()
				} catch (e) {
					oP.error("Error loading feature flags", e)
				}
			}
		},
		oO = Uint8Array,
		oI = Uint16Array,
		oR = Uint32Array,
		oC = new oO([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]),
		oM = new oO([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]),
		oA = new oO([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]),
		oL = function(e, t) {
			for (var i = new oI(31), r = 0; 31 > r; ++r) i[r] = t += 1 << e[r - 1];
			var s = new oR(i[30]);
			for (r = 1; 30 > r; ++r)
				for (var n = i[r]; i[r + 1] > n; ++n) s[n] = n - i[r] << 5 | r;
			return [i, s]
		},
		oD = oL(oC, 2),
		oN = oD[1];
	oD[0][28] = 258, oN[258] = 28;
	for (var oj = oL(oM, 0)[1], oz = new oI(32768), oH = 0; 32768 > oH; ++oH) {
		var oU = (43690 & oH) >>> 1 | (21845 & oH) << 1;
		oz[oH] = ((65280 & (oU = (61680 & (oU = (52428 & oU) >>> 2 | (13107 & oU) << 2)) >>> 4 | (3855 & oU) << 4)) >>> 8 | (255 & oU) << 8) >>> 1
	}
	var oB = function(e, t, i) {
			for (var r = e.length, s = 0, n = new oI(t); r > s; ++s) ++n[e[s] - 1];
			var o, a = new oI(t);
			for (s = 0; t > s; ++s) a[s] = a[s - 1] + n[s - 1] << 1;
			if (i) {
				o = new oI(1 << t);
				var l = 15 - t;
				for (s = 0; r > s; ++s)
					if (e[s])
						for (var u = s << 4 | e[s], c = t - e[s], h = a[e[s] - 1]++ << c, d = h | (1 << c) - 1; d >= h; ++h) o[oz[h] >>> l] = u
			} else
				for (o = new oI(r), s = 0; r > s; ++s) o[s] = oz[a[e[s] - 1]++] >>> 15 - e[s];
			return o
		},
		oq = new oO(288);
	for (oH = 0; 144 > oH; ++oH) oq[oH] = 8;
	for (oH = 144; 256 > oH; ++oH) oq[oH] = 9;
	for (oH = 256; 280 > oH; ++oH) oq[oH] = 7;
	for (oH = 280; 288 > oH; ++oH) oq[oH] = 8;
	var oG = new oO(32);
	for (oH = 0; 32 > oH; ++oH) oG[oH] = 5;
	var oW = oB(oq, 9, 0),
		oV = oB(oG, 5, 0),
		oJ = function(e) {
			return (e / 8 | 0) + (7 & e && 1)
		},
		oK = function(e, t, i) {
			(null == t || 0 > t) && (t = 0), (null == i || i > e.length) && (i = e.length);
			var r = new(e instanceof oI ? oI : e instanceof oR ? oR : oO)(i - t);
			return r.set(e.subarray(t, i)), r
		},
		oY = function(e, t, i) {
			var r = t / 8 | 0;
			e[r] |= i <<= 7 & t, e[r + 1] |= i >>> 8
		},
		oX = function(e, t, i) {
			var r = t / 8 | 0;
			e[r] |= i <<= 7 & t, e[r + 1] |= i >>> 8, e[r + 2] |= i >>> 16
		},
		oZ = function(e, t) {
			for (var i = [], r = 0; e.length > r; ++r) e[r] && i.push({
				s: r,
				f: e[r]
			});
			var s = i.length,
				n = i.slice();
			if (!s) return [new oO(0), 0];
			if (1 == s) {
				var o = new oO(i[0].s + 1);
				return o[i[0].s] = 1, [o, 1]
			}
			i.sort(function(e, t) {
				return e.f - t.f
			}), i.push({
				s: -1,
				f: 25001
			});
			var a = i[0],
				l = i[1],
				u = 0,
				c = 1,
				h = 2;
			for (i[0] = {
					s: -1,
					f: a.f + l.f,
					l: a,
					r: l
				}; c != s - 1;) a = i[i[h].f > i[u].f ? u++ : h++], l = i[u != c && i[h].f > i[u].f ? u++ : h++], i[c++] = {
				s: -1,
				f: a.f + l.f,
				l: a,
				r: l
			};
			var d = n[0].s;
			for (r = 1; s > r; ++r) n[r].s > d && (d = n[r].s);
			var p = new oI(d + 1),
				f = oQ(i[c - 1], p, 0);
			if (f > t) {
				r = 0;
				var g = 0,
					v = f - t,
					_ = 1 << v;
				for (n.sort(function(e, t) {
						return p[t.s] - p[e.s] || e.f - t.f
					}); s > r; ++r) {
					var m = n[r].s;
					if (t >= p[m]) break;
					g += _ - (1 << f - p[m]), p[m] = t
				}
				for (g >>>= v; g > 0;) {
					var y = n[r].s;
					t > p[y] ? g -= 1 << t - p[y]++ - 1 : ++r
				}
				for (; r >= 0 && g; --r) {
					var b = n[r].s;
					p[b] == t && (--p[b], ++g)
				}
				f = t
			}
			return [new oO(p), f]
		},
		oQ = function(e, t, i) {
			return -1 == e.s ? Math.max(oQ(e.l, t, i + 1), oQ(e.r, t, i + 1)) : t[e.s] = i
		},
		o0 = function(e) {
			for (var t = e.length; t && !e[--t];);
			for (var i = new oI(++t), r = 0, s = e[0], n = 1, o = function(e) {
					i[r++] = e
				}, a = 1; t >= a; ++a)
				if (e[a] == s && a != t) ++n;
				else {
					if (!s && n > 2) {
						for (; n > 138; n -= 138) o(32754);
						n > 2 && (o(n > 10 ? n - 11 << 5 | 28690 : n - 3 << 5 | 12305), n = 0)
					} else if (n > 3) {
						for (o(s), --n; n > 6; n -= 6) o(8304);
						n > 2 && (o(n - 3 << 5 | 8208), n = 0)
					}
					for (; n--;) o(s);
					n = 1, s = e[a]
				} return [i.subarray(0, r), t]
		},
		o1 = function(e, t) {
			for (var i = 0, r = 0; t.length > r; ++r) i += e[r] * t[r];
			return i
		},
		o2 = function(e, t, i) {
			var r = i.length,
				s = oJ(t + 2);
			e[s] = 255 & r, e[s + 1] = r >>> 8, e[s + 2] = 255 ^ e[s], e[s + 3] = 255 ^ e[s + 1];
			for (var n = 0; r > n; ++n) e[s + n + 4] = i[n];
			return 8 * (s + 4 + r)
		},
		o3 = function(e, t, i, r, s, n, o, a, l, u, c) {
			oY(t, c++, i), ++s[256];
			for (var h = oZ(s, 15), d = h[0], p = h[1], f = oZ(n, 15), g = f[0], v = f[1], _ = o0(d), m = _[0], y = _[1], b = o0(g), w = b[0], x = b[1], k = new oI(19), E = 0; m.length > E; ++E) k[31 & m[E]]++;
			for (E = 0; w.length > E; ++E) k[31 & w[E]]++;
			for (var S = oZ(k, 7), $ = S[0], F = S[1], P = 19; P > 4 && !$[oA[P - 1]]; --P);
			var T, O, I, R, C = u + 5 << 3,
				M = o1(s, oq) + o1(n, oG) + o,
				A = o1(s, d) + o1(n, g) + o + 14 + 3 * P + o1(k, $) + (2 * k[16] + 3 * k[17] + 7 * k[18]);
			if (M >= C && A >= C) return o2(t, c, e.subarray(l, l + u));
			if (oY(t, c, 1 + (M > A)), c += 2, M > A) {
				T = oB(d, p, 0), O = d, I = oB(g, v, 0), R = g;
				var L = oB($, F, 0);
				for (oY(t, c, y - 257), oY(t, c + 5, x - 1), oY(t, c + 10, P - 4), c += 14, E = 0; P > E; ++E) oY(t, c + 3 * E, $[oA[E]]);
				c += 3 * P;
				for (var D = [m, w], N = 0; 2 > N; ++N) {
					var j = D[N];
					for (E = 0; j.length > E; ++E) oY(t, c, L[z = 31 & j[E]]), c += $[z], z > 15 && (oY(t, c, j[E] >>> 5 & 127), c += j[E] >>> 12)
				}
			} else T = oW, O = oq, I = oV, R = oG;
			for (E = 0; a > E; ++E)
				if (r[E] > 255) {
					oX(t, c, T[257 + (z = r[E] >>> 18 & 31)]), c += O[z + 257], z > 7 && (oY(t, c, r[E] >>> 23 & 31), c += oC[z]);
					var z, H = 31 & r[E];
					oX(t, c, I[H]), c += R[H], H > 3 && (oX(t, c, r[E] >>> 5 & 8191), c += oM[H])
				} else oX(t, c, T[r[E]]), c += O[r[E]];
			return oX(t, c, T[256]), c + O[256]
		},
		o5 = new oR([65540, 131080, 131088, 131104, 262176, 1048704, 1048832, 2114560, 2117632]),
		o4 = new oO(0),
		o8 = function() {
			for (var e = new oR(256), t = 0; 256 > t; ++t) {
				for (var i = t, r = 9; --r;) i = (1 & i && 0xedb88320) ^ i >>> 1;
				e[t] = i
			}
			return e
		}(),
		o6 = function(e, t, i) {
			for (; i; ++t) e[t] = i, i >>>= 8
		};
	let o9 = !!S || !!E,
		o7 = new WeakMap,
		ae = "text/plain",
		at = 0,
		ai = !1,
		ar = (e, t) => {
			let [i, r] = e.split("#"), [s, n] = i.split("?");
			if (!n) return e;
			let o = n.split("&").filter(e => e.split("=")[0] !== t).join("&");
			return `${s}${o?`?${o}`:""}${r?`#${r}`:""}`
		},
		as = (e, t, i = !0) => {
			var r;
			let [s, n] = e.split("?"), o = tS({}, t), a = null != (r = null == n ? void 0 : n.split("&").map(e => {
				var t;
				let [r, s] = e.split("="), n = i && null != (t = o[r]) ? t : s;
				return delete o[r], `${r}=${n}`
			})) ? r : [], l = function(e, t = "&") {
				let i, r, s = [];
				return sb(e, function(e, t) {
					J(e) || J(t) || "undefined" === t || (i = encodeURIComponent(e instanceof File ? e.name : e.toString()), r = encodeURIComponent(t), s[s.length] = r + "=" + i)
				}), s.join(t)
			}(o);
			return l && a.push(l), a.length > 0 ? `${s}?${a.join("&")}` : s
		},
		an = e => {
			var t, i, r, s, n, o, a, l, u, c;
			if (e.cr) return e.cr;
			let {
				data: h,
				compression: d
			} = e;
			if (!h) return;
			if (d === o_) {
				let e = (t = function(e) {
					var t = e.length;
					if ("u" > typeof TextEncoder) return (new TextEncoder).encode(e);
					for (var i = new oO(e.length + (e.length >>> 1)), r = 0, s = function(e) {
							i[r++] = e
						}, n = 0; t > n; ++n) {
						if (r + 5 > i.length) {
							var o = new oO(r + 8 + (t - n << 1));
							o.set(i), i = o
						}
						var a = e.charCodeAt(n);
						128 > a ? s(a) : (2048 > a ? s(192 | a >>> 6) : (a > 55295 && 57344 > a ? (s(240 | (a = 65536 + (1047552 & a) | 1023 & e.charCodeAt(++n)) >>> 18), s(128 | a >>> 12 & 63)) : s(224 | a >>> 12), s(128 | a >>> 6 & 63)), s(128 | 63 & a))
					}
					return oK(i, 0, r)
				}(nZ(h)), i = {
					mtime: 0
				}, r = 0xffffffff, s = {
					p(e) {
						for (var t = r, i = 0; e.length > i; ++i) t = o8[255 & t ^ e[i]] ^ t >>> 8;
						r = t
					},
					d: () => 0xffffffff ^ r
				}, n = t.length, s.p(t), u = (o = 10 + (i.filename && i.filename.length + 1 || 0), l = function(e, t, i, r, s) {
					var n = e.length,
						o = new oO(r + n + 5 * (1 + Math.floor(n / 7e3)) + 8),
						a = o.subarray(r, o.length - 8),
						l = 0;
					if (!t || 8 > n)
						for (var u = 0; n >= u; u += 65535) {
							var c = u + 65535;
							n > c ? l = o2(a, l, e.subarray(u, c)) : (a[u] = s, l = o2(a, l, e.subarray(u, n)))
						} else {
							for (var h = o5[t - 1], d = h >>> 13, p = 8191 & h, f = (1 << i) - 1, g = new oI(32768), v = new oI(f + 1), _ = Math.ceil(i / 3), m = 2 * _, y = function(t) {
									return (e[t] ^ e[t + 1] << _ ^ e[t + 2] << m) & f
								}, b = new oR(25e3), w = new oI(288), x = new oI(32), k = 0, E = 0, S = (u = 0, 0), $ = 0, F = 0; n > u; ++u) {
								var P = y(u),
									T = 32767 & u,
									O = v[P];
								if (g[T] = O, v[P] = T, u >= $) {
									var I = n - u;
									if ((k > 7e3 || S > 24576) && I > 423) {
										l = o3(e, a, 0, b, w, x, E, S, F, u - F, l), S = k = E = 0, F = u;
										for (var R = 0; 286 > R; ++R) w[R] = 0;
										for (R = 0; 30 > R; ++R) x[R] = 0
									}
									var C = 2,
										M = 0,
										A = p,
										L = T - O & 32767;
									if (I > 2 && P == y(u - L))
										for (var D = Math.min(d, I) - 1, N = Math.min(32767, u), j = Math.min(258, I); N >= L && --A && T != O;) {
											if (e[u + C] == e[u + C - L]) {
												for (var z = 0; j > z && e[u + z] == e[u + z - L]; ++z);
												if (z > C) {
													if (C = z, M = L, z > D) break;
													var H = Math.min(L, z - 2),
														U = 0;
													for (R = 0; H > R; ++R) {
														var B = u - L + R + 32768 & 32767,
															q = B - g[B] + 32768 & 32767;
														q > U && (U = q, O = B)
													}
												}
											}
											L += (T = O) - (O = g[T]) + 32768 & 32767
										}
									if (M) {
										b[S++] = 0x10000000 | oN[C] << 18 | oj[M];
										var G = 31 & oN[C],
											W = 31 & oj[M];
										E += oC[G] + oM[W], ++w[257 + G], ++x[W], $ = u + C, ++k
									} else b[S++] = e[u], ++w[e[u]]
								}
							}
							l = o3(e, a, s, b, w, x, E, S, F, u - F, l), s || (l = o2(a, l, o4))
						}
					return oK(o, 0, r + oJ(l) + 8)
				}(t, null == i.level ? 6 : i.level, null == i.mem ? Math.ceil(1.5 * Math.max(8, Math.min(13, Math.log(t.length)))) : 12 + i.mem, o, !a)).length, function(e, t) {
					var i = t.filename;
					if (e[0] = 31, e[1] = 139, e[2] = 8, e[8] = 2 > t.level ? 4 : 2 * (9 == t.level), e[9] = 3, 0 != t.mtime && o6(e, 4, Math.floor(new Date(t.mtime || Date.now()) / 1e3)), i) {
						e[3] = 8;
						for (var r = 0; i.length >= r; ++r) e[r + 10] = i.charCodeAt(r)
					}
				}(l, i), o6(l, u - 8, s.d()), o6(l, u - 4, n), l);
				return {
					contentType: ae,
					body: e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength),
					estimatedSize: e.byteLength
				}
			}
			if (d === om) {
				let e, t = "data=" + encodeURIComponent("string" == typeof(e = (c = nZ(h)) ? btoa(encodeURIComponent(c).replace(/%([0-9A-F]{2})/g, (e, t) => String.fromCharCode(parseInt(t, 16)))) : c) ? e : nZ(e));
				return {
					contentType: "application/x-www-form-urlencoded",
					body: t,
					estimatedSize: new Blob([t]).size
				}
			}
			let p = nZ(h);
			return {
				contentType: "application/json",
				body: p,
				estimatedSize: new Blob([p]).size
			}
		},
		ao = e => {
			var t;
			let i, r = () => "sendBeacon" === e.transport ? {
				url: as(e.url, {
					compression: om
				}),
				encodedBody: an(tS(tS({}, e), {}, {
					compression: om,
					cr: void 0
				}))
			} : {
				url: ar(e.url, "compression"),
				encodedBody: an(tS(tS({}, e), {}, {
					compression: void 0,
					cr: void 0
				}))
			};
			try {
				i = an(e)
			} catch (t) {
				if (ii(e.compression, nQ(e.url, "compression"))) return rr.error("Failed to gzip request body, sending uncompressed payload", t), r();
				throw t
			}
			return !(i && ii(e.compression, nQ(e.url, "compression"))) || ((t = i.body) instanceof ArrayBuffer ? it(new Uint8Array(t)) : ArrayBuffer.isView(t) && it(new Uint8Array(t.buffer, t.byteOffset, t.byteLength))) ? {
				url: e.url,
				encodedBody: i
			} : (ai = !0, r())
		},
		aa = e => {
			try {
				return ao(e)
			} catch (i) {
				var t;
				return rr.error(i), void(null == (t = e.callback) || t.call(e, {
					statusCode: 0,
					error: i
				}))
			}
		},
		al = (v = ed(function*(e) {
			let t = yield function(e) {
				return ia.apply(this, arguments)
			}(nZ(e.data), R.DEBUG, {
				rethrow: !0
			});
			if (!t) return e;
			let i = yield t.arrayBuffer();
			return tS(tS({}, e), {}, {
				cr: {
					contentType: ae,
					body: i,
					estimatedSize: i.byteLength
				}
			})
		}), function(e) {
			return v.apply(this, arguments)
		}),
		au = e => t_("AbortError", "PostHog request timed out" + (e ? ` after ${e}ms` : "")),
		ac = /Failed to fetch|NetworkError|Load failed/i,
		ah = e => "TypeError" === (null == e ? void 0 : e.name) && ac.test((null == e ? void 0 : e.message) || ""),
		ad = e => {
			try {
				let t = function(e, t = Date.now(), i = 3e5) {
					if ("string" != typeof e || !e) return;
					let r = e.trim(),
						s = /^\d+\s*,/.test(r) ? r.slice(0, r.indexOf(",")).trim() : r;
					if (/^\d+$/.test(s)) {
						let e = 1e3 * Math.min(Number(s), i / 1e3);
						return e > 0 ? e : void 0
					}
					if (!/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*[ ,]/.test(s)) return;
					let n = Date.parse(/^\w{3} \w{3} /.test(s) ? s + " GMT" : s) - t;
					return Number.isFinite(n) && n > 0 ? Math.min(n, i) : void 0
				}(e());
				return J(t) ? void 0 : Math.min(t, 3e4)
			} catch (e) {
				return
			}
		},
		ap = e => {
			let t = aa(e);
			if (!t) return;
			let i = new S;
			o7.set(i, !0);
			let {
				url: r,
				encodedBody: s
			} = t;
			i.open(e.method || "GET", r, !0);
			let {
				contentType: n,
				body: o
			} = null != s ? s : {};
			sb(e.headers, function(e, t) {
				i.setRequestHeader(t, e)
			}), n && i.setRequestHeader("Content-Type", n), e.timeout && (i.timeout = e.timeout);
			let a = !1;
			i.ontimeout = () => {
				a = !0
			}, i.onloadend = () => {
				var t, r;
				if (a) {
					let t = au(e.timeout);
					return rr.warn(t), void(null == (r = e.callback) || r.call(e, {
						statusCode: 0,
						error: t
					}))
				}
				let s = {
					statusCode: i.status,
					text: i.responseText
				};
				if (200 === i.status) try {
					s.json = JSON.parse(i.responseText)
				} catch (e) {}
				null == (t = e.callback) || t.call(e, s, ad(() => i.getResponseHeader("Retry-After")))
			}, i.send(o)
		},
		af = e => {
			let t = aa(e);
			if (!t) return;
			let {
				url: i,
				encodedBody: r
			} = t, {
				contentType: s,
				body: n,
				estimatedSize: o
			} = null != r ? r : {}, a = new Headers;
			sb(e.headers, function(e, t) {
				a.append(t, e)
			}), s && a.append("Content-Type", s);
			let l = null,
				u = !1;
			if ($) {
				let t = new $;
				l = {
					signal: t.signal,
					timeout: setTimeout(() => {
						u = !0;
						try {
							t.abort(au(e.timeout))
						} catch (e) {
							h(e)
						}
					}, e.timeout)
				}
			}
			let c = !1,
				h = t => {
					var i;
					c || (c = !0, u && "AbortError" === (null == t ? void 0 : t.name) || ah(t) ? rr.warn(t) : rr.error(t), null == (i = e.callback) || i.call(e, {
						statusCode: 0,
						error: t
					}))
				},
				d = 0,
				p = () => {
					at -= d, d = 0, l && clearTimeout(l.timeout)
				};
			try {
				let t = tS({
						method: (null == e ? void 0 : e.method) || "GET",
						headers: a,
						referrerPolicy: "strict-origin",
						body: n,
						signal: null == l ? void 0 : l.signal
					}, e.fetchOptions),
					r = null != o ? o : J(n) ? 0 : void 0;
				t.keepalive = "POST" === t.method && !e.Ol && !1 !== t.keepalive && t.body === n && !J(r) && r >= 0 && 52428.8 > at + r, t.keepalive && (d = r, at += d), E(i, t).then(t => t.text().then(i => {
					var r;
					if (c) return;
					let s = {
						statusCode: t.status,
						text: i
					};
					if (200 === t.status) try {
						s.json = JSON.parse(i)
					} catch (e) {
						rr.error(e)
					}
					c = !0, p(), null == (r = e.callback) || r.call(e, s, ad(() => t.headers.get("Retry-After")))
				})).catch(e => {
					p(), h(e)
				}).finally(p)
			} catch (e) {
				p(), h(e)
			}
		},
		ag = e => {
			try {
				var t;
				let {
					url: i,
					encodedBody: r
				} = ao(e), {
					contentType: s,
					body: n,
					estimatedSize: o
				} = null != r ? r : {};
				if (!n) return;
				let a = n instanceof Blob ? n : new Blob([n], {
					type: s
				});
				if (w.sendBeacon(i, a)) return;
				let l = q(e.data) ? e.data : null == (t = e.data) ? void 0 : t.batch;
				if (q(l) && l.length > 1 && (null != o ? o : 0) > 16384) {
					let t = Math.ceil(l.length / 2),
						i = t => q(e.data) ? t : tS(tS({}, e.data), {}, {
							batch: t
						});
					return ag(tS(tS({}, e), {}, {
						data: i(l.slice(0, t))
					})), void ag(tS(tS({}, e), {}, {
						data: i(l.slice(t))
					}))
				}
				rr.warn(`Beacon of ~${null!=o?o:0} bytes was rejected by the browser, falling back to ${E?"fetch":"XHR"}`), E ? af(tS(tS({}, e), {}, {
					Ol: !0
				})) : ap(e)
			} catch (e) {
				rr.warn("Beacon send failed", e)
			}
		},
		av = (e, t, i, r) => {
			let s = "query" === r ? "POST" === t ? "sent_at" : "_" : void 0;
			return as(i === o_ ? ar(e, "compression") : e, tS(tS({}, s ? {
				[s]: Date.now().toString()
			} : {}), i === o_ ? {} : {
				compression: i
			}))
		},
		a_ = (u = [], E && u.push({
			transport: "fetch",
			method: af
		}), S && u.push({
			transport: "XHR",
			method: ap
		}), (null == w ? void 0 : w.sendBeacon) && u.push({
			transport: "sendBeacon",
			method: ag
		}), u),
		am = !o9 && -1 === (null == P ? void 0 : P.indexOf("MSIE")) && -1 === (null == P ? void 0 : P.indexOf("Mozilla"));

	function ay(e, t, i) {
		var r, s, n, o;
		i && (t = tS(tS({}, t), {}, {
			callback: e => i(e)
		})), e.__loaded ? am ? e.__request_queue.push(t) : e.rateLimiter.isServerRateLimited(t.batchKey) ? t.fireCallbackOnDrop && (null == (n = t.callback) || n.call(t, {
			statusCode: 429
		})) : (t.transport = t.transport || e.config.api_transport, t.headers = tS(tS({}, e.config.request_headers), t.headers), t.compression = "best-available" === t.compression ? null != (r = e.compression) ? r : t.compressionFallback : t.compression, (J(e.config.disable_beacon) ? e.config.__preview_disable_beacon : e.config.disable_beacon) && (t.disableTransport = ["sendBeacon"]), t.fetchOptions = t.fetchOptions || e.config.fetch_options, null == (s = t.onDispatch) || s.call(t), ((e, t) => {
			var i, r, s, n, o, a;
			let l, u, c = tS(tS({}, e), {}, {
				callback: null != t ? t : t => {
					var i;
					return null == (i = e.callback) ? void 0 : i.call(e, t)
				}
			});
			c.timeout = c.timeout || 6e4;
			let h = null != (i = c.transport) ? i : "fetch";
			"sendBeacon" === h && J(c.compression) && c.data && (c.compression = om), "POST" === c.method && c.data && ("capture-body" === c.timestampMode ? (u = (l = (q(n = c.data) ? n : [n]).map(e => tS(tS({}, e), e.timestamp instanceof Date && !isNaN(e.timestamp.getTime()) ? {
				timestamp: e.timestamp.toISOString()
			} : {})))[0], c.data = {
				api_key: null != (o = null == u || null == (a = u.properties) ? void 0 : a.token) ? o : null == u ? void 0 : u.token,
				batch: l,
				sent_at: (new Date).toISOString()
			}) : "body" === c.timestampMode && (c.data = ((e, t = (new Date).toISOString()) => q(e) ? e.map(e => tS(tS({}, e), {}, {
				sent_at: t
			})) : tS(tS({}, e), {}, {
				sent_at: t
			}))(c.data))), c.url = av(c.url, c.method, c.compression, c.timestampMode);
			let d = a_.filter(e => !c.disableTransport || !e.transport || !c.disableTransport.includes(e.transport)),
				p = null != (r = null == (s = function(e, t) {
					for (let i = 0; e.length > i; i++)
						if (t(e[i])) return e[i]
				}(d, e => e.transport === h)) ? void 0 : s.method) ? r : d[0].method;
			if (!p) throw Error("No available transport method");
			let f = e => {
				try {
					p(e)
				} catch (e) {
					var t;
					ah(e) ? rr.warn(e) : rr.error(e), null == (t = c.callback) || t.call(c, {
						statusCode: 0,
						error: e
					})
				}
			};
			"sendBeacon" !== h && !c.preferSyncCompression && c.data && c.compression === o_ && F && "u" > typeof Promise && !ai ? al(c).then(e => {
				f(e)
			}).catch(t => {
				ir(t) ? (ai = !0, f(tS(tS({}, c), {}, {
					compression: void 0,
					url: av(e.url, e.method, void 0, e.timestampMode)
				}))) : ((e => {
					if (!e || "object" != typeof e) return !1;
					let t = "name" in e ? String(e.name) : "";
					return ir(e) || t === ie
				})(t) && (ai = !0), f(c))
			}) : f(c)
		})(t, (r, s) => {
			var n, o, a;
			e.rateLimiter.checkForLimiting(r), 400 > r.statusCode || null == (n = (o = e.config).on_request_error) || n.call(o, r), i ? i(r, s) : null == (a = t.callback) || a.call(t, r)
		})) : t.fireCallbackOnDrop && (null == (o = t.callback) || o.call(t, {
			statusCode: 0
		}))
	}
	var ab = class {
		constructor(e, t) {
			this.uc = !0, this.cc = [], this.hc = ev((null == t ? void 0 : t.flush_interval_ms) || 3e3, 250, 5e3, rr.createLogger("flush interval"), 3e3), this.dc = e
		}
		enqueue(e) {
			this.cc.push(e), this.vc || this.fc()
		}
		unload() {
			this.gc();
			let e = Object.values(this.cc.length > 0 ? this.mc() : {});
			[...e.filter(e => 0 === e.url.indexOf("/e")), ...e.filter(e => 0 !== e.url.indexOf("/e"))].map(e => {
				this.yc(tS(tS({}, e), {}, {
					callback: void 0
				}), "sendBeacon")
			})
		}
		enable() {
			this.uc = !1, this.fc()
		}
		fc() {
			this.uc || (this.vc = setTimeout(() => {
				this.gc(), this.bc()
			}, this.hc))
		}
		bc() {
			if (this.cc.length > 0) {
				let e = this.mc();
				for (let t in e) this.yc(e[t])
			}
		}
		yc(e, t) {
			try {
				this.dc(e, t)
			} catch (e) {
				rr.error(e)
			}
		}
		gc() {
			clearTimeout(this.vc), this.vc = void 0
		}
		mc() {
			let e = {},
				t = {};
			for (let i in sb(this.cc, i => {
					var r;
					let s = ((i ? i.batchKey : null) || i.url) + (i.batchGroup ? `:${i.batchGroup}` : "");
					J(e[s]) && (e[s] = tS(tS({}, i), {}, {
						data: [],
						callback: void 0,
						fireCallbackOnDrop: void 0
					}), t[s] = []), null == (r = e[s].data) || r.push(i.data), i.callback && t[s].push(i.callback)
				}), t) {
				let r = t[i];
				r.length && (e[i].callback = e => {
					for (let t of r) t(e)
				})
			}
			return this.cc = [], e
		}
	};
	let aw = ["retriesPerformedSoFar"];
	var ax = class {
			constructor(e) {
				this._instance = e, this._c = !1, this.wc = 3e3, this.cc = [], this.cc = [], this.kc = !0, this.resume()
			}
			resume() {
				!J(y) && "onLine" in y.navigator && (this.kc = y.navigator.onLine, this.Sc || (this.Sc = () => {
					this.kc = !0, this.bc()
				}, this.xc = () => {
					this.kc = !1
				}, sF(y, "online", this.Sc), sF(y, "offline", this.xc)))
			}
			get length() {
				return this.cc.length
			}
			retriableRequest(e, t) {
				let {
					retriesPerformedSoFar: i
				} = e, r = il(e, aw);
				ee(i) && (r.url = as(r.url, {
					retry_count: i
				})), ay(this._instance, t ? tS(tS({}, r), {}, {
					transport: t
				}) : r, (e, t) => {
					var s;
					if (200 !== e.statusCode && (400 > e.statusCode || e.statusCode >= 500)) {
						if ((0 === e.statusCode ? 3 : 10) > (null != i ? i : 0)) return void this.Ls(tS({
							retriesPerformedSoFar: i
						}, r), t);
						0 === e.statusCode && rr.warn(`Request failed before receiving an HTTP response; this can happen due to network issues, CORS, browser blocking, or ad blockers. Stopped retrying after ${null!=i?i:0} retries.`)
					}
					null == (s = r.callback) || s.call(r, e)
				})
			}
			Ls(e, t) {
				let i, r, s, n = e.retriesPerformedSoFar || 0;
				e.retriesPerformedSoFar = n + 1;
				let o = Math.max((s = (Math.random() - .5) * ((r = Math.min(18e5, i = 3e3 * Math.pow(2, n))) - i / 2), Math.ceil(r + s)), null != t ? t : 0),
					a = Date.now() + o;
				this.cc.push({
					retryAt: a,
					requestOptions: e
				});
				let l = `Enqueued failed request for retry in ${o}`;
				navigator.onLine || (l += " (Browser is offline)"), rr.warn(l), this._c || (this._c = !0, this.$c())
			}
			$c() {
				(this.Cc && clearTimeout(this.Cc), 0 === this.cc.length) ? (this._c = !1, this.Cc = void 0) : this.Cc = setTimeout(() => {
					this.kc && this.cc.length > 0 && this.bc(), this.$c()
				}, this.wc)
			}
			bc() {
				let e = Date.now(),
					t = [],
					i = this.cc.filter(i => e > i.retryAt || (t.push(i), !1));
				if (this.cc = t, i.length > 0)
					for (let {
							requestOptions: e
						}
						of i) this.retriableRequest(e)
			}
			unload() {
				for (let {
						requestOptions: e
					}
					of(this.Cc && (clearTimeout(this.Cc), this.Cc = void 0), this._c = !1, J(y) || (this.Sc && (y.removeEventListener("online", this.Sc), this.Sc = void 0), this.xc && (y.removeEventListener("offline", this.xc), this.xc = void 0)), this.cc)) try {
					this._instance._send_request(tS(tS({}, e), {}, {
						callback: q(e.data) ? void 0 : e.callback,
						transport: "sendBeacon"
					}))
				} catch (e) {
					rr.error(e)
				}
				this.cc = []
			}
		},
		ak = class {
			constructor(e) {
				this._instance = e, this.Tc = () => {
					var e, t, i, r;
					this.Ic || (this.Ic = {});
					let s = this.scrollElement(),
						n = this.scrollY(),
						o = s ? Math.max(0, s.scrollHeight - s.clientHeight) : 0,
						a = n + ((null == s ? void 0 : s.clientHeight) || 0),
						l = (null == s ? void 0 : s.scrollHeight) || 0;
					this.Ic.lastScrollY = Math.ceil(n), this.Ic.maxScrollY = Math.max(n, null != (e = this.Ic.maxScrollY) ? e : 0), this.Ic.maxScrollHeight = Math.max(o, null != (t = this.Ic.maxScrollHeight) ? t : 0), this.Ic.lastContentY = a, this.Ic.maxContentY = Math.max(a, null != (i = this.Ic.maxContentY) ? i : 0), this.Ic.maxContentHeight = Math.max(l, null != (r = this.Ic.maxContentHeight) ? r : 0)
				}
			}
			get Mc() {
				return this._instance.config.scroll_root_selector
			}
			getContext() {
				return this.Ic
			}
			resetContext() {
				let e = this.Ic;
				return this.Ic = void 0, setTimeout(this.Tc, 0), e
			}
			startMeasuringScrollPosition() {
				sF(y, "scroll", this.Tc, {
					capture: !0
				}), sF(y, "scrollend", this.Tc, {
					capture: !0
				}), sF(y, "resize", this.Tc)
			}
			scrollElement() {
				var e, t;
				if (this.Mc) {
					for (let t of q(this.Mc) ? this.Mc : [this.Mc]) {
						let i = null == y || null == (e = y.document) ? void 0 : e.querySelector(t);
						if (i) return i
					}
					return
				}
				return null == y || null == (t = y.document) ? void 0 : t.documentElement
			}
			Ec(e) {
				var t, i;
				if (this.Mc) {
					let t = this.scrollElement();
					return t && t["y" === e ? "scrollTop" : "scrollLeft"] || 0
				}
				return y ? "y" === e ? y.scrollY || y.pageYOffset || (null == (t = y.document) || null == (t = t.documentElement) ? void 0 : t.scrollTop) || 0 : y.scrollX || y.pageXOffset || (null == (i = y.document) || null == (i = i.documentElement) ? void 0 : i.scrollLeft) || 0 : 0
			}
			scrollY() {
				return this.Ec("y")
			}
			scrollX() {
				return this.Ec("x")
			}
		};
	let aE = e => oi(null == e ? void 0 : e.config.mask_personal_data_properties, null == e ? void 0 : e.config.custom_personal_data_properties, null == e ? void 0 : e.config.disable_capture_url_hashes);
	var aS = class {
			constructor(e, t, i, r) {
				this.je = e => {
					let t = this.Ac();
					if (t && t.sessionId === e) return;
					let i = {
						sessionId: e,
						props: this.Rc(this._instance)
					};
					this.Pc.register({
						[r2]: i
					})
				}, this._instance = e, this.Oc = t, this.Pc = i, this.Rc = r || aE, this.Oc.onSessionId(this.je)
			}
			Ac() {
				return this.Pc.props[r2]
			}
			getSetOnceProps() {
				var e;
				let t = null == (e = this.Ac()) ? void 0 : e.props;
				return t ? "r" in t ? or(t, this._instance.config.disable_capture_url_hashes) : {
					$referring_domain: t.referringDomain,
					$pathname: t.initialPathName,
					utm_source: t.utm_source,
					utm_campaign: t.utm_campaign,
					utm_medium: t.utm_medium,
					utm_content: t.utm_content,
					utm_term: t.utm_term
				} : {}
			}
			getSessionProps() {
				let e = {};
				return sb(sE(this.getSetOnceProps()), (t, i) => {
					"$current_url" === i && (i = "url"), e[`$session_entry_${j(i)}`] = t
				}), e
			}
		},
		a$ = class {
			on(e, t) {
				return this.Eo[e] || (this.Eo[e] = []), this.Eo[e].push(t), () => {
					this.Eo[e] = this.Eo[e].filter(e => e !== t)
				}
			}
			emit(e, t) {
				for (let i of this.Eo[e] || []) i(t);
				for (let i of this.Eo["*"] || []) i(e, t)
			}
			constructor() {
				this.Eo = {}
			}
		};
	let aF = rr.createLogger("[SessionId]", void 0);
	var aP = class {
		on(e, t) {
			return this.Fc.on(e, t)
		}
		constructor(e, t, i) {
			var r;
			if (this.Dc = null, this.Lc = null, this.Nc = [], this.jc = void 0, this.qc = !1, this.Fc = new a$, this.Bc = (e, t) => !(!ee(e) || !ee(t)) && Math.abs(e - t) > this.sessionTimeoutMs, !e.persistence) throw Error("SessionIdManager requires a PostHogPersistence instance");
			if ("always" === e.config.cookieless_mode) throw Error('SessionIdManager cannot be used with cookieless_mode="always"');
			this.Fr = e.config, this.Pc = e.persistence, this.Be = void 0, this.Xt = void 0, this._sessionStartTimestamp = null, this.zc = void 0, this._sessionActivityTimestamp = null, this.Hc = t || sM, this.Uc = i || sM;
			let s = this.Fr.persistence_name || this.Fr.token;
			if (this._sessionTimeoutMs = 1e3 * ev(this.Fr.session_idle_timeout_seconds || 1800, 60, 36e3, aF.createLogger("session_idle_timeout_seconds"), 1800), e.register({
					$configured_session_timeout_ms: this._sessionTimeoutMs
				}), this.Wc(), this.Vc = "ph_" + s + "_window_id", this.Gc = "ph_" + s + "_primary_window_exists", this.Qc()) {
				let e = s0.Ft(this.Vc),
					t = s0.Ft(this.Gc);
				e && !t ? this.Be = e : s0.Dt(this.Vc), s0.$t(this.Gc, !0)
			}(null == (r = this.Fr.bootstrap) ? void 0 : r.sessionID) && this.setBootstrapSessionId(this.Fr.bootstrap.sessionID), this.Jc()
		}
		get sessionTimeoutMs() {
			return this._sessionTimeoutMs
		}
		onSessionId(e) {
			return J(this.Nc) && (this.Nc = []), this.Nc.push(e), this.Xt && e(this.Xt, this.Be), () => {
				this.Nc = this.Nc.filter(t => t !== e)
			}
		}
		Qc() {
			return "memory" !== this.Fr.persistence && !this.Pc.fi && s0.Ot()
		}
		Zc(e) {
			e !== this.Be && (this.Be = e, this.Qc() && s0.$t(this.Vc, e))
		}
		Kc() {
			return this.Be ? this.Be : this.Qc() ? s0.Ft(this.Vc) : null
		}
		Yc(e) {
			let t = this.Dc;
			return !X(t) && !X(e) && 5e3 > Math.abs(e - t)
		}
		Xc(e, t, i) {
			let r = t !== this._sessionActivityTimestamp,
				s = e === this.Xt && i === this._sessionStartTimestamp;
			this._sessionStartTimestamp = i, this._sessionActivityTimestamp = t, this.Xt = e, s && !r || s && this.Yc(t) || (this.Dc = t, this.Pc.register({
				[rX]: [t, e, i]
			}))
		}
		eh() {
			var e;
			let t = null == (e = this.Fr) ? void 0 : e.persistence_save_debounce_ms;
			return ee(t) && t > 0
		}
		ih() {
			this.eh() ? this.Pc.refreshKey(rX) : (this.Pc.flush(), this.Pc.load())
		}
		nh() {
			var e;
			if (X(this._sessionActivityTimestamp) || this._sessionActivityTimestamp === this.Dc) return;
			this.ih();
			let [, t, i] = this.sh();
			t === this.Xt && i === this._sessionStartTimestamp && (this.Dc = this._sessionActivityTimestamp, this.Pc.register({
				[rX]: [this._sessionActivityTimestamp, null != (e = this.Xt) ? e : null, this._sessionStartTimestamp]
			}), this.Pc.flush())
		}
		rh() {
			let [e] = this.sh();
			return Math.max(ee(e) ? e : 0, ee(this._sessionActivityTimestamp) ? this._sessionActivityTimestamp : 0)
		}
		oh(e) {
			return this.ih(), this.Bc(e, this.rh())
		}
		sh() {
			let e = this.Pc.props[rX];
			return q(e) && 2 === e.length && e.push(e[0]), e || [0, null, 0]
		}
		resetSessionId() {
			this.Dc = null, this.zc = void 0, clearTimeout(this.ah), this.ah = void 0, this.Xc(null, null, null)
		}
		setBootstrapSessionId(e, t = !1) {
			let i = ((e, t = (new Date).getTime()) => {
				try {
					let i = (e => {
						let t = e.replace(/-/g, "");
						if (32 !== t.length) throw Error("Not a valid UUID");
						if ("7" !== t[12]) throw Error("Not a UUIDv7");
						return parseInt(t.substring(0, 12), 16)
					})(e);
					return i > t + 6e4 ? void aF.error("Bootstrap sessionID cannot be in the future") : i
				} catch (e) {
					return void aF.error("Invalid sessionID in bootstrap", e)
				}
			})(e);
			return !J(i) && (t ? this.zc = {
				sessionId: e,
				sessionStartTimestamp: i
			} : this.Xc(e, (new Date).getTime(), i), !0)
		}
		destroy() {
			this.qc = !0, this.nh(), clearTimeout(this.ah), this.ah = void 0, this.jc && y && (y.removeEventListener(sf, this.jc, {
				capture: !1
			}), this.jc = void 0), this.Nc = []
		}
		Jc() {
			this.jc = () => {
				this.nh(), this.Qc() && s0.Dt(this.Gc)
			}, sF(y, sf, this.jc, {
				capture: !1
			})
		}
		checkAndGetSessionAndWindowId(e = !1, t = null, i = !1) {
			if ("always" === this.Fr.cookieless_mode) throw Error('checkAndGetSessionAndWindowId should not be called with cookieless_mode="always"');
			let r = t || (new Date).getTime(),
				s = this.Xt;
			if (i) this.Lc = r;
			else if (X(this.Lc) || this.Lc > r || r - this.Lc >= 1e3) {
				var n, o;
				null == (n = (o = this.Pc).syncCookieProperties) || n.call(o), this.Lc = r
			}
			let [, a, l] = this.sh(), u = !J(s) && a !== s, c = this.rh(), h = this.Kc(), d = this.zc, p = !!d && (d.sessionStartTimestamp > r + 6e4 || r - d.sessionStartTimestamp > 864e5), f = d ? p : ee(l) && Math.abs(r - l) > 864e5, g = !1, v = u, _ = !a || !!d, m = a, y = !_ && !e && this.Bc(r, c);
			if (y && ((y = this.oh(r)) || aF.info("cross-tab refresh kept the session alive", {
					sessionId: a
				}), [, a, l] = this.sh(), y || (_ = !a || !!d)), _ || y || f) {
				v = !1;
				let e = d && !p;
				a = e ? d.sessionId : this.Hc(), h = this.Uc(), aF.info("new session ID assigned", {
					sessionId: a,
					windowId: h,
					bootstrapped: !!e,
					changeReason: {
						noSessionId: _,
						activityTimeout: y,
						sessionPastMaximumLength: f
					}
				}), l = e ? d.sessionStartTimestamp : r, this.zc = void 0, g = !0
			} else h || (h = this.Uc(), g = !0), (v = v || a !== m) && (aF.info("adopted cross-tab session id", {
				sessionId: a,
				windowId: h
			}), g = !0);
			let b = ee(c) && e && !f ? c : r,
				w = ee(l) ? l : (new Date).getTime();
			this.Zc(h), this.Xc(a, b, w), e || this.Wc();
			let x = {
				noSessionId: _,
				activityTimeout: y,
				sessionPastMaximumLength: f,
				crossTabAdoption: v
			};
			return g && this.Nc.forEach(e => e(a, h, x)), {
				sessionId: a,
				windowId: h,
				sessionStartTimestamp: w,
				changeReason: g ? x : void 0,
				lastActivityTimestamp: c
			}
		}
		Wc() {
			this.qc || (clearTimeout(this.ah), this.ah = setTimeout(() => {
				if (!this.qc)
					if (this.oh((new Date).getTime())) {
						let e = this.Xt;
						this.resetSessionId(), this.Fc.emit("forcedIdleReset", {
							idleSessionId: e
						})
					} else this.Wc()
			}, 1.1 * this.sessionTimeoutMs))
		}
	};
	let aT = Object.freeze(["2026-08-30", "2026-08-29", "2026-06-25", "2026-05-30", "2026-01-30", "2025-11-30", "2025-05-24"]),
		aO = function(e, t) {
			if (!e) return !1;
			let i = e.userAgent;
			if (i && eg(i, t)) return !0;
			try {
				let i = null == e ? void 0 : e.userAgentData;
				if ((null == i ? void 0 : i.brands) && i.brands.some(e => eg(null == e ? void 0 : e.brand, t))) return !0
			} catch (e) {}
			return !!e.webdriver
		};

	function aI() {
		return (aI = ed(function*() {
			let e = null == w ? void 0 : w.userAgentData;
			if (null == e ? void 0 : e.getHighEntropyValues) try {
				let t = yield e.getHighEntropyValues(["model"]), i = null == t ? void 0 : t.model;
				return K(i) && i.length > 0 ? i : void 0
			} catch (e) {
				return void rr.info("Unable to resolve $device_model from userAgentData.getHighEntropyValues", e)
			}
		})).apply(this, arguments)
	}

	function aR(e) {
		var t;
		return !!(null == (t = e.conditions) || null == (t = t.events) || null == (t = t.values) ? void 0 : t.length)
	}
	let aC = (e, t) => {
			if (!(e => {
					try {
						new RegExp(e)
					} catch (e) {
						return !1
					}
					return !0
				})(t)) return !1;
			try {
				return new RegExp(t).test(e)
			} catch (e) {
				return !1
			}
		},
		aM = e => e.toLowerCase(),
		aA = {
			exact: (e, t) => t.some(t => e.some(e => t === e)),
			is_not: (e, t) => t.every(t => e.every(e => t !== e)),
			regex: (e, t) => t.some(t => e.some(e => aC(t, e))),
			not_regex: (e, t) => t.every(t => e.every(e => !aC(t, e))),
			icontains: (e, t) => t.map(aM).some(t => e.map(aM).some(e => t.includes(e))),
			not_icontains: (e, t) => t.map(aM).every(t => e.map(aM).every(e => !t.includes(e))),
			gt: (e, t) => t.some(t => {
				let i = parseFloat(t);
				return !isNaN(i) && e.some(e => i > parseFloat(e))
			}),
			lt: (e, t) => t.some(t => {
				let i = parseFloat(t);
				return !isNaN(i) && e.some(e => i < parseFloat(e))
			})
		};

	function aL(e, t) {
		return !e || Object.entries(e).every(([e, i]) => {
			let r = null == t ? void 0 : t[e];
			if (null == r) return !1;
			let s = aA[i.operator];
			return !!s && s(i.values.map(String), [String(r)])
		})
	}

	function aD(e, t, i) {
		return nZ({
			distinct_id: e,
			userPropertiesToSet: t,
			userPropertiesToSetOnce: i
		})
	}
	let aN = "custom",
		aj = "i.posthog.com",
		az = /^\/static\//,
		aH = ["/s/", "/e/", "/i/"];
	var aU = class {
		constructor(e) {
			this.uh = {}, this.instance = e
		}
		get apiHost() {
			let e = this.instance.config.api_host.trim().replace(/\/$/, "");
			return "https://app.posthog.com" === e ? "https://us.i.posthog.com" : e
		}
		get flagsApiHost() {
			let e = this.instance.config.flags_api_host;
			return e ? e.trim().replace(/\/$/, "") : this.apiHost
		}
		get uiHost() {
			var e;
			let t = null == (e = this.instance.config.ui_host) ? void 0 : e.replace(/\/$/, "");
			return t || (t = this.apiHost.replace(`.${aj}`, ".posthog.com")), "https://app.posthog.com" === t ? "https://us.posthog.com" : t
		}
		get region() {
			return this.uh[this.apiHost] || (this.uh[this.apiHost] = /https:\/\/(app|us|us-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "us" : /https:\/\/(eu|eu-assets)(\.i)?\.posthog\.com/i.test(this.apiHost) ? "eu" : aN), this.uh[this.apiHost]
		}
		hh(e) {
			if (!az.test(e)) return;
			let t = this.instance.config.asset_host;
			return "string" == typeof t && t.trim().replace(/\/$/, "") || void 0
		}
		dh(e) {
			let t = nJ(e);
			return t ? t.protocol + "//" + t.host + t.pathname : void 0
		}
		fh(e, t, i) {
			if ("ui" === e) return i;
			let r = i,
				s = this.instance.config.rewriteRequestPath;
			if (s) {
				var n;
				r = s(new URL((null == (n = nJ(i)) ? void 0 : n.href) || i)).toString()
			}
			if (s && "api" === e && aH.some(e => 0 === t.indexOf(e))) {
				let e = this.dh(r);
				if (e) {
					let t = this.apiHost,
						i = this.ph;
					(null == i ? void 0 : i.apiHost) === t && i.rewriteRequestPath === s || (i = {
						apiHost: t,
						rewriteRequestPath: s,
						urls: new Set
					}, this.ph = i), i.urls.add(e)
				}
			}
			return r
		}
		isIngestionEndpoint(e) {
			let t = this.ph,
				i = this.dh(e);
			return (null == t ? void 0 : t.apiHost) === this.apiHost && t.rewriteRequestPath === this.instance.config.rewriteRequestPath && !!i && t.urls.has(i)
		}
		endpointFor(e, t = "") {
			if (t && (t = "/" === t[0] ? t : `/${t}`), "ui" === e) return this.fh(e, t, this.uiHost + t);
			if ("flags" === e) return this.fh(e, t, this.flagsApiHost + t);
			if ("assets" === e) {
				let i = this.hh(t);
				if (i) return this.fh(e, t, `${i}${t}`)
			}
			if (this.region === aN) return this.fh(e, t, this.apiHost + t);
			let i = aj + t;
			switch (e) {
				case "assets":
					return this.fh(e, t, `https://${this.region}-assets.${i}`);
				case "api":
					return this.fh(e, t, `https://${this.region}.${i}`)
			}
		}
	};
	let aB = rr.createLogger("[Surveys]", void 0),
		aq = e => {
			try {
				let t = `seenSurvey_${e.current_iteration&&e.current_iteration>0?`${e.id}_${e.current_iteration}`:e.id}`;
				if (localStorage.getItem(t)) return;
				localStorage.setItem(t, "true")
			} catch (e) {
				aB.error("Failed to persist survey seen state", e)
			}
		},
		aG = ["popover", "widget", "api"],
		aW = {
			ignoreConditions: !1,
			ignoreDelay: !1,
			displayType: oE
		},
		aV = rr.createLogger("[PostHog ExternalIntegrations]", void 0),
		aJ = {
			intercom: "intercom-integration",
			crispChat: "crisp-chat-integration"
		};
	var aK = class {
			constructor(e) {
				this._instance = e
			}
			Bl(e, t) {
				var i, r;
				null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this._instance, e, e => {
					if (e) return aV.error("failed to load script", e);
					t()
				})
			}
			startIfEnabledOrStop() {
				var e, t, i, r;
				for (let [s, n] of Object.entries(null != (e = this._instance.config.integrations) ? e : {})) !n || (null == (t = O.__PosthogExtensions__) || null == (t = t.integrations) ? void 0 : t[s]) || this.Bl(aJ[s], () => {
					var e;
					null == (e = O.__PosthogExtensions__) || null == (e = e.integrations) || null == (e = e[s]) || e.start(this._instance)
				}), !n && (null == (i = O.__PosthogExtensions__) || null == (i = i.integrations) ? void 0 : i[s]) && (null == (r = O.__PosthogExtensions__) || null == (r = r.integrations) || null == (r = r[s]) || r.stop())
			}
		},
		aY = class {
			constructor(e) {
				this.disabled = !1 === e;
				let t = W(e) ? e : {};
				this.thresholdPx = t.threshold_px || 30, this.timeoutMs = t.timeout_ms || 1e3, this.clickCount = t.click_count || 3, this.clicks = []
			}
			isRageClick(e, t, i) {
				if (this.disabled) return !1;
				let r = this.clicks[this.clicks.length - 1];
				if (r && Math.abs(e - r.x) + Math.abs(t - r.y) < this.thresholdPx && this.timeoutMs > i - r.timestamp) {
					if (this.clicks.push({
							x: e,
							y: t,
							timestamp: i
						}), this.clicks.length === this.clickCount) return !0
				} else this.clicks = [{
					x: e,
					y: t,
					timestamp: i
				}];
				return !1
			}
		};
	let aX = () => typeof window > "u" ? void 0 : window,
		aZ = () => typeof document > "u" ? void 0 : document,
		aQ = "$copy_autocapture",
		a0 = ["password", "hidden", "file", "checkbox", "button", "submit", "reset", "image"],
		a1 = rr.createLogger("[AutoCapture]", void 0);

	function a2(e, t) {
		return t.length > e ? t.slice(0, e) + "..." : t
	}
	let a3 = "autocapture";
	var a5 = class {
		vl() {
			this.fl = void 0, clearTimeout(this.pl), this.pl = void 0
		}
		gl(e) {
			var t;
			if (!nx(e)) return !0;
			let i = null != (t = this.ml().css_selector_ignorelist) ? t : nl,
				r = new Set,
				s = e;
			for (; s;) {
				if (r.size >= 1e3 || r.has(s)) return !0;
				r.add(s);
				let e = s,
					t = ne(e);
				if (D(t, "ph-no-capture") || D(t, "ph-sensitive") || nk(e) || i.some(t => nn(e, t))) return !0;
				let n = s.parentNode;
				s = s6(n) ? n.host : n && s5(n) ? n : null
			}
			return !1
		}
		yl(e) {
			if (!this.isEnabled || "pointercancel" === e.type) return void this.vl();
			if ("pointerdown" === e.type) {
				var t;
				this.vl();
				let i = nr(e);
				return void(e.isPrimary && 0 === e.button && !e.ctrlKey && i && s5(i) && (this.fl = {
					target: i,
					excluded: this.gl(i),
					id: e.pointerId,
					x: e.clientX,
					y: e.clientY,
					released: !1,
					distinctId: null == (t = this.Fa) ? void 0 : t.distinctId
				}))
			}
			let i = this.fl;
			i && (e.pointerId !== i.id || Math.abs(e.clientX - i.x) > 5 || Math.abs(e.clientY - i.y) > 5 ? this.vl() : "pointerup" === e.type && (i.released = !0, this.pl = setTimeout(() => this.vl(), 0)))
		}
		bl(e) {
			var t, i, r, s;
			let n = this.fl;
			this.vl();
			let o = nr(e);
			if ((null == n ? void 0 : n.released) && n.target.isConnected && n.distinctId === (null == (t = this.Fa) ? void 0 : t.distinctId) && e.pointerId === n.id && (e.detail > 0 || "touch" === e.pointerType || "pen" === e.pointerType) && 0 === e.button && 5 >= Math.abs(e.clientX - n.x) && 5 >= Math.abs(e.clientY - n.y) && o && (s4(o, "html") || s4(o, "body"))) {
				if (n.excluded) return null;
				let e = null != (i = this.ml().css_selector_ignorelist) ? i : nl;
				return [o, null == (r = aZ()) ? void 0 : r.documentElement, null == (s = aZ()) ? void 0 : s.body].some(t => {
					if (!t) return !1;
					let i = ne(t);
					return D(i, "ph-no-capture") || D(i, "ph-sensitive") || !nx(t) || nk(t) || e.some(e => nn(t, e))
				}) ? null : n.target
			}
		}
		constructor(e) {
			this.Na = e, this.name = a3, this._l = !1, this.wl = null, this.kl = !1, this.Sl = new Map, this.xl = !1, this.Fr = {
				enabled: !1,
				rageclick: !1,
				maskAllElementAttributes: !1,
				maskAllText: !1,
				disableCaptureUrlHashes: !1,
				remoteRequestsDisabled: !1
			}, this.Ti = !1, this.Na.refresh(this.Fr), this.rageclicks = new aY(this.Fr.rageclick), this.$l = null
		}
		setup(e) {
			this.Cl(), this.Fa = e;
			let t = e.onRemoteConfig(this.onRemoteConfig.bind(this));
			this.Ti ? t.dispose() : (this.Za = t, this.startIfEnabled())
		}
		dispose() {
			var e;
			this.Ti || (this.Ti = !0, this.Fa = void 0, null == (e = this.Za) || e.dispose(), this.Za = void 0, this.Sl.clear(), this.$l = null, this.Tl())
		}
		ml() {
			return this.Na.refresh(this.Fr), this.Fr
		}
		Cl() {
			var e, t;
			return this.ml(), this.Fr.url_allowlist = null == (e = this.Fr.url_allowlist) ? void 0 : e.map(e => new RegExp(e)), this.Fr.url_ignorelist = null == (t = this.Fr.url_ignorelist) ? void 0 : t.map(e => new RegExp(e)), this.Fr
		}
		Il() {
			let e = aX(),
				t = aZ();
			if (!this.isBrowserSupported()) return void a1.info("Disabling Automatic Event Collection because this browser is not supported");
			if (!e || !t) return;
			this.Ml = e, this.El = t;
			let i = this.Al = t => {
				t = t || (null == e ? void 0 : e.event);
				try {
					if ("blur" === t.type) return void this.vl();
					if (0 === t.type.indexOf("pointer")) return void this.yl(t);
					let e = "click" === t.type ? this.bl(t) : void 0;
					if (X(e)) return;
					this.Rl(t, "$autocapture", e)
				} catch (e) {
					a1.error("Failed to capture event", e)
				}
			};
			if (sF(e, "blur", i), sF(t, "submit", i, {
					capture: !0
				}), sF(t, "change", i, {
					capture: !0
				}), sF(t, "click", i, {
					capture: !0
				}), sb(["pointerdown", "pointermove", "pointerup", "pointercancel"], e => {
					sF(t, e, i, {
						capture: !0
					})
				}), this.ml().capture_copied_text) {
				let i = this.Pl = t => {
					t = t || (null == e ? void 0 : e.event);
					try {
						this.Rl(t, aQ)
					} catch (e) {
						a1.error("Failed to capture clipboard event", e)
					}
				};
				sF(t, "copy", i, {
					capture: !0
				}), sF(t, "cut", i, {
					capture: !0
				}), sF(t, "paste", i, {
					capture: !0
				})
			}
		}
		Tl() {
			let e = this.Ml,
				t = this.El;
			this.vl(), this.Al && (null == e || e.removeEventListener("blur", this.Al), sb(["pointerdown", "pointermove", "pointerup", "pointercancel"], e => {
				null == t || t.removeEventListener(e, this.Al, !0)
			}), null == t || t.removeEventListener("submit", this.Al, !0), null == t || t.removeEventListener("change", this.Al, !0), null == t || t.removeEventListener("click", this.Al, !0), this.Al = void 0), this.Pl && (null == t || t.removeEventListener("copy", this.Pl, !0), null == t || t.removeEventListener("cut", this.Pl, !0), null == t || t.removeEventListener("paste", this.Pl, !0), this.Pl = void 0), this.Ml = void 0, this.El = void 0, this._l = !1
		}
		startIfEnabled() {
			this.isEnabled || this.vl(), !this.Ti && this.Fa && this.isEnabled && !this._l && (this.Il(), this._l = !0)
		}
		onRemoteConfig(e) {
			var t;
			if (this.Ti) return;
			if (this.kl = !0, !e.ok) return void this.startIfEnabled();
			let i = e.config;
			i.elementsChainAsString && (this.xl = i.elementsChainAsString);
			let r = i.autocapture_opt_out;
			et(r) && (null == (t = this.Fa) || t.kv.set("$autocapture_disabled_server_side", r), this.wl = r), this.startIfEnabled()
		}
		setElementSelectors(e, t = this) {
			if (this.Ti) return;
			e.size ? this.Sl.set(t, new Set(e)) : this.Sl.delete(t);
			let i = new Set;
			this.Sl.forEach(e => {
				e.forEach(e => i.add(e))
			}), this.$l = i
		}
		getElementSelectors(e, t) {
			var i;
			let r = [];
			return null == (i = this.$l) || i.forEach(i => {
				var s;
				let n = null == (s = aZ()) ? void 0 : s.querySelectorAll(i);
				null == n || n.forEach(s => {
					e !== s && t !== s || D(r, i) || r.push(i)
				})
			}), r
		}
		get isEnabled() {
			var e, t;
			if (this.Ti) return !1;
			let i = null == (e = this.Fa) ? void 0 : e.kv.get(rS),
				r = this.wl,
				s = this.ml();
			if (!s.remoteRequestsDisabled && !this.kl) return !1;
			let n = s.remoteRequestsDisabled && !this.kl;
			if (X(r) && !et(i) && !n) return !1;
			let o = null != (t = this.wl) ? t : !!i;
			return !!s.enabled && !o
		}
		Rl(e, t = "$autocapture", i) {
			var r, s, n, o, a;
			if (!this.isEnabled) return void this.vl();
			let l = i || nr(e);
			s8(l) && (l = l.parentNode || null);
			let u = this.Cl();
			"$autocapture" === t && "click" === e.type && e instanceof MouseEvent && u.rageclick && (null == (r = this.rageclicks) ? void 0 : r.isRageClick(e.clientX, e.clientY, e.timeStamp || (new Date).getTime())) && ny(l, u.rageclick) && this.Rl(e, "$rageclick", i);
			let c = t === aQ,
				h = c ? tS(tS({}, u), {}, {
					dom_event_allowlist: void 0
				}) : u;
			if (l && function(e, t, i, r, s, n) {
					var o;
					let a = typeof window > "u" ? void 0 : window;
					if (!a || nb(e) || (null == i ? void 0 : i.url_allowlist) && !s7(i.url_allowlist, n) || (null == i ? void 0 : i.url_ignorelist) && s7(i.url_ignorelist, n)) return !1;
					if (null == i ? void 0 : i.dom_event_allowlist) {
						let e = i.dom_event_allowlist;
						if (e && !e.some(e => t.type === e)) return !1
					}
					let {
						parentIsUsefulElement: l,
						targetElementList: u
					} = nw(e, r);
					if (! function(e, t) {
							let i = null == t ? void 0 : t.element_allowlist;
							if (J(i)) return !0;
							for (let t of e)
								if (i.some(e => t.tagName.toLowerCase() === e)) return !0;
							return !1
						}(u, i) || !no(u, null == i ? void 0 : i.css_selector_allowlist) || no(u, null != (o = null == i ? void 0 : i.css_selector_ignorelist) ? o : nl)) return !1;
					try {
						let i = a.getComputedStyle(e);
						if (i && "pointer" === i.getPropertyValue("cursor") && "click" === t.type) return !0
					} catch (e) {}
					let c = e.tagName.toLowerCase();
					switch (c) {
						case "html":
							return !1;
						case "form":
							return (s || ["submit"]).indexOf(t.type) >= 0;
						case "input":
						case "select":
						case "textarea":
							return (s || ["change", "click"]).indexOf(t.type) >= 0;
						default:
							return l ? (s || ["click"]).indexOf(t.type) >= 0 : (s || ["click"]).indexOf(t.type) >= 0 && (ns.indexOf(c) > -1 || "true" === e.getAttribute("contenteditable"))
					}
				}(l, e, h, c, c ? ["copy", "cut", "paste"] : void 0, {
					config: {
						get_current_url: u.getCurrentUrl
					}
				})) {
				let {
					props: i,
					explicitNoCapture: r,
					target: c
				} = function(e, {
					e: t,
					maskAllElementAttributes: i,
					maskAllText: r,
					elementAttributeIgnoreList: s,
					elementsChainAsString: n,
					disableCaptureUrlHashes: o
				}) {
					var a, l, u, c;
					if (!s5(e)) return {
						props: {}
					};
					let h = [e],
						d = new Set([e]),
						p = e;
					for (; p.parentNode && !s4(p, "body") && 1e3 > h.length;) {
						if (s6(p.parentNode)) {
							let e = p.parentNode.host;
							if (d.has(e)) break;
							d.add(e), h.push(e), p = e;
							continue
						}
						if (!s5(p.parentNode) || d.has(p.parentNode)) break;
						d.add(p.parentNode), h.push(p.parentNode), p = p.parentNode
					}
					let f = "click" === t.type && "http://www.w3.org/2000/svg" === e.namespaceURI ? h.findIndex(e => s4(e, "button") || s4(e, "a")) : -1;
					f > 0 && (r = r || h.slice(0, f + 1).some(e => !nx(e) || nk(e)));
					let g = [],
						v = {},
						_, m = !1,
						y = !1;
					if (sb(h, e => {
							let t = nx(e);
							if (s4(e, "a") && !i && !(null == s ? void 0 : s.includes("href"))) {
								let i = e.getAttribute("href");
								m = !!(t && i && nO(i)) && (o ? tm(i) : i)
							}
							D(ne(e), "ph-no-capture") && (y = !0), g.push(function(e, t, i, r, s = !1) {
								let n = e.tagName.toLowerCase(),
									o = {
										tag_name: n
									};
								ns.indexOf(n) > -1 && !i && (o.$el_text = "a" === n.toLowerCase() || "button" === n.toLowerCase() ? a2(1024, nI(e)) : a2(1024, ni(e)));
								let a = ne(e);
								t || (null == r ? void 0 : r.includes("class")) || 0 >= a.length || (o.classes = a.filter(function(e) {
									return "" !== e
								})), sb(e.attributes, function(i) {
									var n;
									if ((!nk(e) || -1 !== ["name", "id", "class", "aria-label"].indexOf(i.name)) && !(null == r ? void 0 : r.includes(i.name)) && !t && nO(i.value) && (!K(n = i.name) || "_ngcontent" !== n.substring(0, 10) && "_nghost" !== n.substring(0, 7))) {
										let e = i.value;
										"class" === i.name && (e = s9(e).join(" ")), o["attr__" + i.name] = a2(1024, "href" === i.name && s ? tm(e) : e)
									}
								});
								let l = 1,
									u = 1,
									c = e;
								for (; c = function(e) {
										if (e.previousElementSibling) return e.previousElementSibling;
										let t = e;
										do t = t.previousSibling; while (t && !s5(t)) return t
									}(c);) l++, c.tagName === e.tagName && u++;
								return o.nth_child = l, o.nth_of_type = u, o
							}(e, i, r, s, o)), sb(function(e) {
								if (!nx(e)) return {};
								let t = {};
								return sb(e.attributes, function(e) {
									if (e.name && 0 === e.name.indexOf("data-ph-capture-attribute")) {
										let i = e.name.replace("data-ph-capture-attribute-", ""),
											r = e.value;
										i && r && nO(r) && (t[i] = r)
									}
								}), t
							}(e), (e, t) => {
								({}).hasOwnProperty.call(v, t) || (v[t] = e)
							})
						}), y) return {
						props: {},
						explicitNoCapture: y
					};
					if (f > 0 && (e = h[f], g.splice(0, f)), r || (g[0].$el_text = s4(e, "a") || s4(e, "button") ? nI(e) : ni(e)), m) {
						g[0].attr__href = m;
						let e = null == (u = nJ(m)) ? void 0 : u.host,
							t = null == (c = aX()) || null == (c = c.location) ? void 0 : c.host;
						e && t && e !== t && (_ = m)
					}
					return {
						props: sw({
							$event_type: t.type,
							$ce_version: 1
						}, n ? {} : {
							$elements: g
						}, {
							$elements_chain: q(g) ? g.map(e => {
								var t, i;
								let r = {
									text: null == (t = e.$el_text) ? void 0 : t.slice(0, 400),
									tag_name: e.tag_name,
									href: null == (i = e.attr__href) ? void 0 : i.slice(0, 2048),
									attr_class: function(e) {
										let t = e.attr__class;
										if (t) return q(t) ? t : s9(t)
									}(e),
									attr_id: e.attr__id,
									nth_child: e.nth_child,
									nth_of_type: e.nth_of_type,
									attributes: {}
								};
								return sx(e).filter(([e]) => 0 === e.indexOf("attr__")).forEach(([e, t]) => r.attributes[e] = t), r
							}).map(e => {
								var t, i;
								let r = "";
								if (e.tag_name && (r += e.tag_name), e.attr_class)
									for (let t of (e.attr_class.sort(), e.attr_class)) r += `.${t.replace(/"/g,"")}`;
								let s = tS(tS(tS(tS({}, e.text ? {
										text: e.text
									} : {}), {}, {
										"nth-child": null != (t = e.nth_child) ? t : 0,
										"nth-of-type": null != (i = e.nth_of_type) ? i : 0
									}, e.href ? {
										href: e.href
									} : {}), e.attr_id ? {
										attr_id: e.attr_id
									} : {}), e.attributes),
									n = {};
								return sx(s).sort(([e], [t]) => t > e ? -1 : +(e > t)).forEach(([e, t]) => n[nR(e.toString())] = nR(t.toString())), r += ":", r += sx(n).map(([e, t]) => `${e}="${t}"`).join("")
							}).join(";") : ""
						}, (null == (a = g[0]) ? void 0 : a.$el_text) ? {
							$el_text: null == (l = g[0]) ? void 0 : l.$el_text
						} : {}, _ && "click" === t.type ? {
							$external_click_url: _
						} : {}, v),
						target: e
					}
				}(l, {
					e: e,
					maskAllElementAttributes: u.maskAllElementAttributes,
					maskAllText: u.maskAllText,
					elementAttributeIgnoreList: u.element_attribute_ignorelist,
					elementsChainAsString: this.xl,
					disableCaptureUrlHashes: u.disableCaptureUrlHashes
				});
				if (r) return !1;
				let h = this.getElementSelectors(l, c);
				if (h && h.length > 0 && (i.$element_selectors = h), t === aQ) {
					let t = e.type || "clipboard";
					if ("paste" !== t) {
						let e = null == (n = aX()) || null == (n = n.getSelection()) ? void 0 : n.toString(),
							t = nt(e);
						if (!t) return !1;
						i.$selected_content = t, i.$clipboard_text_length = null != (o = null == e ? void 0 : e.length) ? o : 0
					}
					i.$copy_type = t
				}
				if ("$autocapture" === t && "change" === e.type && u.capture_value_css_selector_allowlist && !u.maskAllText && (s4(a = l, "input") ? !D(a0, a.type) : s4(a, "textarea") || s4(a, "select") && !a.multiple) && function(e, t) {
						var i;
						if (!nx(e)) return !1;
						let r = null != (i = t.css_selector_ignorelist) ? i : nl,
							s = new Set,
							n = e;
						for (s4(e, "select") && (n = e.options[e.selectedIndex] || e); n;) {
							let e = n,
								t = ne(e);
							if (s.size >= 1e3 || s.has(n) || D(t, "ph-sensitive") || D(t, "ph-no-capture") || r.some(t => nn(e, t))) return !1;
							s.add(n);
							let i = n.assignedSlot || n.parentNode;
							n = s6(i) ? i.host : i && s5(i) ? i : null
						}
						return !0
					}(l, u) && !l.querySelector(".ph-no-capture, .ph-sensitive")) {
					let e = u.capture_value_css_selector_allowlist,
						t = !1;
					try {
						t = G(e) ? !!e(l) : q(e) && e.some(e => nn(l, e))
					} catch (e) {
						a1.error("capture_value_css_selector_allowlist threw", e)
					}
					t && (i.$input_value = l.value)
				}
				return null == (s = this.Fa) || s.capture(t, i), !0
			}
		}
		isBrowserSupported() {
			var e;
			return G(null == (e = aZ()) ? void 0 : e.querySelectorAll)
		}
	};
	let a4 = "featureFlags",
		a8 = "logs",
		a6 = () => {
			var e;
			return (null == y || null == (e = y.performance) ? void 0 : e.now) ? y.performance.now() : Date.now()
		},
		a9 = [50, 75, 100, 150, 200, 300, 400, 500, 750, 1e3, 1500, 2e3, 3e3, 5e3, 1e4];
	var a7 = class {
			constructor(e) {
				this._instance = e
			}
			initialize() {}
			get(e) {
				let t = this._instance.persistence;
				if ("string" == typeof e) return null == t ? void 0 : t.get_property(e);
				let i = {};
				for (let r of e) {
					let e = null == t ? void 0 : t.get_property(r);
					J(e) || (i[r] = e)
				}
				return i
			}
			set(e, t) {
				var i;
				null == (i = this._instance.persistence) || i.register("string" == typeof e ? {
					[e]: t
				} : e)
			}
			remove(e) {
				var t;
				null == (t = this._instance.persistence) || t.unregister(e)
			}
		},
		le = class {
			constructor(e) {
				this.instance = e, this.R = rr, this.kv = new a7(e), this.onSession = e => oS(this.instance.onSessionId(t => {
					try {
						e(t)
					} catch (e) {
						this.R.error("Browser extension session listener failed", e)
					}
				})), this.onEvent = e => oS(this.instance._addCaptureHook((t, i) => {
					if (i) try {
						e({
							event: t,
							properties: i.properties
						})
					} catch (e) {
						this.R.error("Browser extension event listener failed", e)
					}
				})), this.onRemoteConfig = e => {
					let t = t => {
							try {
								e(t)
							} catch (e) {
								this.R.error("Browser extension remote config listener failed", e)
							}
						},
						i = this.instance.dr.on("extensionsRemoteConfig", t);
					return this.instance.vr && t(this.instance.vr), oS(i)
				}
			}
			get logger() {
				return this.R
			}
			get distinctId() {
				return this.instance.get_distinct_id()
			}
			get anonymousId() {
				var e;
				return null != (e = this.instance.get_property("$device_id")) ? e : this.distinctId
			}
			get deviceId() {
				let e = this.instance.get_property(rC);
				return "string" == typeof e ? e : void 0
			}
			get library() {
				return {
					name: R.LIB_NAME,
					version: R.LIB_VERSION
				}
			}
			get initialPersonProperties() {
				var e, t;
				return null != (e = null == (t = this.instance.persistence) ? void 0 : t.get_initial_props()) ? e : {}
			}
			get groups() {
				return this.instance.getGroups()
			}
			get session() {
				try {
					var e, t, i, r, s;
					let n = null == (e = this.instance.sessionManager) ? void 0 : e.checkAndGetSessionAndWindowId(!0);
					return {
						sessionId: null != (t = null == n ? void 0 : n.sessionId) ? t : "",
						windowId: null != (i = null == n ? void 0 : n.windowId) ? i : "",
						sessionStartTimestamp: null != (r = null == n ? void 0 : n.sessionStartTimestamp) ? r : 0,
						lastActivityTimestamp: null != (s = null == n ? void 0 : n.lastActivityTimestamp) ? s : 0
					}
				} catch (e) {
					return {
						sessionId: "",
						windowId: "",
						sessionStartTimestamp: 0,
						lastActivityTimestamp: 0
					}
				}
			}
			get isOptedOut() {
				return this.instance.has_opted_out_capturing()
			}
			get canCapture() {
				return G(this.instance.is_capturing) ? this.instance.is_capturing() : !this.isOptedOut
			}
			get isRateLimited() {
				var e;
				return !!(null == (e = this.instance.rateLimiter) ? void 0 : e.isClientRateLimited)
			}
			get projectToken() {
				return this.instance.config.token
			}
			getExtension(e) {
				let t;
				switch (e) {
					case a4:
					case "featureFlagsCommon":
						t = this.instance.featureFlags;
						break;
					case a8:
						t = this.instance.logs;
						break;
					case "surveys":
						t = this.instance.surveys;
						break;
					case a3:
						t = this.instance.autocapture
				}
				return t
			}
			capture(e, t, i) {
				if (!i) return this.pr(this.instance.capture(e, t));
				let r = tS({
					timestamp: i.timestamp,
					uuid: i.uuid,
					$set: i.set,
					$set_once: i.setOnce
				}, "unload" === i.delivery ? {
					transport: "sendBeacon",
					send_instantly: !0
				} : {});
				return this.pr(this.instance.capture(e, t, r))
			}
			pr(e) {
				var t;
				return !J(e) || !(null == (t = this.instance.rateLimiter) ? void 0 : t.lastEventRateLimited)
			}
			registerDynamicEventProperties(e) {
				return oS(this.instance.mr(e))
			}
			sendRequest(e) {
				var t = this;
				return ed(function*(e, i = {}) {
					var r;
					let s = null != (r = i.target) ? r : "api",
						n = i.query ? as(e, i.query) : e,
						o = t.instance.requestRouter.endpointFor(s, n),
						a = {
							method: i.method,
							url: o,
							data: i.body,
							headers: i.headers,
							timeout: i.timeoutMs,
							fireCallbackOnDrop: !0,
							transport: i.transport,
							compression: i.compression,
							compressionFallback: "flags" === i.target && "best-available" === i.compression ? M.Base64 : void 0,
							timestampMode: i.sentAt
						};
					return "api" === s && "/i/v1/logs" === e && (a.batchKey = "logs"), "sendBeacon" === i.transport ? (t.instance._send_request(a), {
						statusCode: 202
					}) : new Promise(e => {
						var i;
						if (a.callback = e, "flags" === s && (null == (i = t.instance.config.metrics) ? void 0 : i.flags)) {
							let i;
							a.onDispatch = () => {
								i = a6()
							}, a.callback = r => {
								J(i) || t.gr(o, r, a6() - i), e(r)
							}
						}
						t.instance._send_request(a)
					})
				}).apply(this, arguments)
			}
			gr(e, t, i) {
				try {
					var r, s, n;
					let o, a = t.statusCode || void 0,
						l = {
							"server.address": (null != (r = null == (s = nJ(e)) ? void 0 : s.hostname) ? r : e).replace(/^\[(.*)\]$/, "$1")
						};
					a && (l["http.response.status_code"] = a);
					let u = (o = t.error, a ? 400 > a ? void 0 : String(a) : "AbortError" === (null == o ? void 0 : o.name) ? "timeout" : "_OTHER");
					u && (l["error.type"] = u);
					let c = nV();
					c && (l["client.timezone"] = c), null == (n = this.instance.metrics) || n.histogram("posthog.flags.request.duration", i, {
						unit: "ms",
						attributes: l,
						bounds: a9
					})
				} catch (e) {
					rr.error("Failed to record the /flags request duration", e)
				}
			}
		};
	let lt = {},
		li = 0,
		lr = () => {},
		ls = 'Consent opt in/out is not valid with cookieless_mode="always" and will be ignored',
		ln = "Surveys module not available",
		lo = "sanitize_properties is deprecated. Use before_send instead",
		la = "Invalid value for property_denylist config: ",
		ll = ["$recording_status", "$sdk_debug_recording_script_not_loaded", "$sdk_debug_replay_url_trigger_status", "$sdk_debug_replay_event_trigger_status", "$sdk_debug_replay_linked_flag_trigger_status", "$sdk_debug_replay_rrweb_error", "$sdk_debug_replay_internal_buffer_length", "$sdk_debug_replay_flushed_size"],
		lu = ["$feature_flag_called", "$$heatmap", "$snapshot"],
		lc = e => "$" === e.charAt(0) && !D(lu, e),
		lh = /^[A-Za-z0-9_-]{1,400}$/,
		ld = /^fb\.[0-9]+\.[0-9]+\.[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)?$/,
		lp = /^fb\.[0-9]+\.[0-9]+\.[0-9]+$/,
		lf = ["token", "distinct_id", r7],
		lg = "posthog",
		lv = [...aT].sort()[aT.length - 1],
		l_ = e => {
			var t;
			let i;
			return tS({
				api_host: "https://us.i.posthog.com",
				flags_api_host: null,
				ui_host: null,
				asset_host: null,
				token: "",
				autocapture: !0,
				cross_subdomain_cookie: function(e) {
					let t = null == e ? void 0 : e.hostname;
					if (!K(t)) return !1;
					let i = t.split(".").slice(-2).join(".");
					for (let e of s$)
						if (i === e) return !1;
					return !0
				}(null == x ? void 0 : x.location),
				persistence: "localStorage+cookie",
				persistence_name: "",
				cookie_persisted_properties: [],
				loaded: lr,
				save_campaign_params: !0,
				custom_campaign_params: [],
				custom_blocked_useragents: [],
				save_referrer: !0,
				capture_pageleave: "if_capture_pageview",
				defaults: null != e ? e : "unset",
				__preview_deferred_init_extensions: !1,
				__preview_replay_sync_fetch: !0,
				__preview_external_dependency_versioned_paths: !1,
				__preview_cookie_wins_on_conflict: !1,
				debug: k && K(null == k ? void 0 : k.search) && -1 !== k.search.indexOf("__posthog_debug=true") || !1,
				cookie_expiration: 365,
				upgrade: !1,
				disable_session_recording: !1,
				disable_persistence: !1,
				disable_web_experiments: !0,
				disable_surveys: !1,
				disable_surveys_automatic_display: !1,
				disable_conversations: !1,
				disable_product_tours: !1,
				disableDeviceModel: !1,
				reuseAnonymousId: !1,
				disable_external_dependency_loading: !1,
				strict_script_versioning: "fallback",
				enable_recording_console_log: void 0,
				secure_cookie: "https:" === (null == y || null == (t = y.location) ? void 0 : t.protocol),
				ip: !1,
				opt_out_capturing_by_default: !1,
				opt_out_persistence_by_default: !1,
				opt_out_useragent_filter: !1,
				opt_out_capturing_persistence_type: "localStorage",
				consent_persistence_name: null,
				opt_out_capturing_cookie_prefix: null,
				opt_in_site_apps: !1,
				property_denylist: [],
				respect_dnt: !1,
				sanitize_properties: null,
				request_headers: {},
				request_batching: !0,
				properties_string_max_length: 65535,
				mask_all_element_attributes: !1,
				mask_all_text: !1,
				mask_personal_data_properties: !1,
				custom_personal_data_properties: [],
				advanced_disable_flags: !1,
				advanced_disable_decide: !1,
				advanced_disable_feature_flags: !1,
				advanced_disable_feature_flags_on_first_load: !1,
				advanced_only_evaluate_survey_feature_flags: !1,
				advanced_feature_flags_dedup_per_session: !1,
				advanced_enable_surveys: !1,
				advanced_disable_toolbar_metrics: !1,
				feature_flag_request_timeout_ms: 3e3,
				feature_flag_request_max_retries: 1,
				surveys_request_timeout_ms: 1e4,
				on_request_error(e) {
					rr.error("Bad HTTP status: " + e.statusCode + " " + e.text)
				},
				get_device_id: e => e,
				capture_performance: void 0,
				name: "posthog",
				bootstrap: {},
				disable_compression: !1,
				session_idle_timeout_seconds: 1800,
				person_profiles: sp,
				before_send: void 0,
				get_current_url: void 0,
				request_queue_config: {
					flush_interval_ms: 3e3
				},
				error_tracking: {},
				_onCapture: lr
			}, {
				rageclick: e && e >= "2026-05-30" ? {
					content_ignorelist: nc,
					ignore_text_selection: !0
				} : !e || "2025-11-30" > e || {
					content_ignorelist: !0
				},
				capture_pageview: !e || "2025-05-24" > e || "history_change",
				session_recording: (i = {}, e && "unset" !== e && ("2025-11-30" > e || (i.strictMinimumDuration = !0), "2026-05-30" > e || (i.canvasCapture = {
					resolutionScale: .6
				}), "2026-06-25" > e || (i.streamNetworkBody = !0), "2026-08-30" > e || (i.captureJsonLd = !0)), i),
				external_scripts_inject_target: e && e >= "2026-01-30" ? "head" : "body",
				internal_or_test_user_hostname: e && e >= "2026-01-30" ? /^(localhost|127\.0\.0\.1)$/ : void 0,
				persistence_save_debounce_ms: e && e >= "2026-05-30" ? 250 : 0,
				split_storage: !(!e || "2026-05-30" > e),
				detect_google_search_app: !(!e || "2026-05-30" > e),
				disable_capture_url_hashes: !(!e || "2026-06-25" > e),
				cookieWinsOnConflict: !(!e || "unset" === e || "2026-08-29" > e)
			})
		},
		lm = [
			["process_person", "person_profiles"],
			["xhr_headers", "request_headers"],
			["cookie_name", "persistence_name"],
			["disable_cookie", "disable_persistence"],
			["__preview_disable_beacon", "disable_beacon"],
			["store_google", "save_campaign_params"],
			["verbose", "debug"],
			["__preview_cookie_wins_on_conflict", "cookieWinsOnConflict"]
		],
		ly = e => {
			let t = {};
			for (let [i, r] of lm) J(e[i]) || (t[r] = e[i]);
			let i = sw({}, t, e),
				r = e.__preview_external_dependency_versioned_paths;
			return J(r) || (J(e.strict_script_versioning) && (i.strict_script_versioning = !!r), K(r) && J(e.asset_host) && (i.asset_host = r)), q(e.property_blacklist) && (J(e.property_denylist) ? i.property_denylist = e.property_blacklist : q(e.property_denylist) ? i.property_denylist = [...e.property_blacklist, ...e.property_denylist] : rr.error(la + e.property_denylist)), i
		};
	var lb = class {
			constructor() {
				this.__forceAllowLocalhost = !1
			}
			get gh() {
				return this.__forceAllowLocalhost
			}
			set gh(e) {
				rr.error("WebPerformanceObserver is deprecated and has no impact on network capture. Use `_forceAllowLocalhostNetworkCapture` on `posthog.sessionRecording`"), this.__forceAllowLocalhost = e
			}
		},
		lw = class e {
			mh(e) {
				if (!e) return;
				let t = this.yh.indexOf(e); - 1 !== t && this.yh.splice(t, 1)
			}
			bh(e, t) {
				var i;
				return this.mh(e), this.yh.push(t), null == (i = t.initialize) || i.call(t), t
			}
			_h() {
				return "always" === this.config.cookieless_mode || "on_reject" === this.config.cookieless_mode && this.consent.isRejected()
			}
			wh() {
				let e, t, i;
				if (this.kh || this.config.reuseAnonymousId || this.config.segment || this._h()) return;
				let r = "memory" === this.config.persistence || "sessionStorage" === this.config.persistence;
				(r || this.config.disable_persistence) && (this.Sh || (r ? (e = `persistence is set to '${this.config.persistence}'`, t = "memory" === this.config.persistence ? "on every page load" : "for every new browser tab or window", i = "Either set persistence to 'localStorage+cookie', keep this persistence and pass a stable ID through bootstrap.distinctID, or enable reuseAnonymousId.") : (e = "persistence is disabled (disable_persistence is true)", t = "on every page load", i = "Either set disable_persistence to false, keep persistence disabled and pass a stable ID through bootstrap.distinctID, or enable reuseAnonymousId."), this.kh = !0, console.warn("[PostHog.js]", `${e} but no bootstrap.distinctID was provided. PostHog will mint a new distinct ID ${t}, so calling identify() merges a new ID onto the person each time. A person can then pass the distinct-ID limit and its events stop appearing on person pages and the session tab. ${i}`)))
			}
			xh() {
				let e = this.persistence;
				if (!e || this.$h) return;
				if (this._h()) return void("on_reject" === this.config.cookieless_mode && "$posthog_cookieless" !== this.get_distinct_id() && (this.Ch(), this.Th()));
				if ("$posthog_cookieless" !== this.get_distinct_id()) return;
				this.Ih() || e.load(!0);
				let t = this.get_distinct_id();
				if (!t || "$posthog_cookieless" === t) {
					let t = this.config.get_device_id(sM());
					this.register({
						distinct_id: t,
						$device_id: t
					}), e.set_property(r1, sh)
				}
				this.Ch()
			}
			get decideEndpointWasHit() {
				var e, t;
				return null != (e = null == (t = this.featureFlags) ? void 0 : t.hasLoadedFlags) && e
			}
			get flagsEndpointWasHit() {
				var e, t;
				return null != (e = null == (t = this.featureFlags) ? void 0 : t.hasLoadedFlags) && e
			}
			constructor() {
				var t;
				this.Mh = !1, this.Eh = !1, this.webPerformance = new lb, this.Ah = !1, this.version = R.LIB_VERSION, this.Rh = new Set, this.Ph = "", this.dr = new a$, this.yh = [], this.Oh = [], this.Fh = !1, this.Sh = !1, this.kh = !1, this.$h = !1, this._calculate_event_properties = this.calculateEventProperties.bind(this), this.config = l_(), this.SentryIntegration = nH, this.sentryIntegration = e => {
					let t;
					return t = nz(this, e), {
						name: nj,
						processEvent: e => t(e)
					}
				}, this.__request_queue = [], this.__loaded = !1, this.analyticsDefaultEndpoint = "/e/", this.Dh = !1, this.Lh = null, this.Nh = null, this.jh = null, this.scrollManager = new ak(this), this.pageViewManager = new nU(this), this.rateLimiter = new oF(this), this.requestRouter = new aU(this), this.consent = new s1(this), this.externalIntegrations = new aK(this);
				let i = null != (t = e.__defaultExtensionClasses) ? t : {};
				this.featureFlags = i.featureFlags && new i.featureFlags(this), this.toolbar = i.toolbar && new i.toolbar(this), this.surveys = i.surveys && new i.surveys(this), this.conversations = i.conversations && new i.conversations(this), this.logs = i.logs && new i.logs(this), this.metrics = i.metrics && new i.metrics(this), this.experiments = i.experiments && new i.experiments(this), this.exceptions = i.exceptions && new i.exceptions(this), this.people = {
					set: (e, t, i) => {
						let r = K(e) ? {
							[e]: t
						} : e;
						this.setPersonProperties(r), null == i || i({})
					},
					set_once: (e, t, i) => {
						let r = K(e) ? {
							[e]: t
						} : e;
						this.setPersonProperties(void 0, r), null == i || i({})
					}
				}, this.on("eventCaptured", e => rr.info(`send "${null==e?void 0:e.event}"`, e))
			}
			init(t, i, r) {
				if (r && r !== lg) {
					var s;
					let n = null != (s = lt[r]) ? s : new e;
					return n._init(t, i, r), lt[r] = n, lt[lg][r] = n, n
				}
				return this._init(t, i, r)
			}
			_init(e, t = {}, i) {
				var r, s, n, o;
				let a = K(e) ? e.trim() : "";
				if (!a) return rr.critical("PostHog was initialized without a token. This likely indicates a misconfiguration. Please check the first argument passed to posthog.init()"), this;
				if (this.__loaded) return a !== (null == (o = this.config) ? void 0 : o.token) ? console.warn("[PostHog.js]", `You have already initialized PostHog with a different project token! Re-initializing is a no-op, so events will keep going to the project this instance was initialized with. To capture into a second project, load PostHog once, then initialize a named instance after the SDK has loaded, e.g. posthog.init('${a}', { ... }, 'project2')`) : console.warn("[PostHog.js]", "You have already initialized PostHog! Re-initializing is a no-op"), this;
				this.__loaded = !0, this.config = l_(t.defaults), t.debug = this.qh(t.debug), this.Bh = t, this.zh = [], t.person_profiles ? this.Nh = t.person_profiles : t.process_person && (this.Nh = t.process_person);
				let l = l_(t.defaults),
					u = ly(t),
					c = sw({}, l, u, {
						name: i,
						token: a
					});
				W(l.rageclick) && W(u.rageclick) && (c.rageclick = sw({}, l.rageclick, u.rageclick)), W(l.session_recording) && W(u.session_recording) && (c.session_recording = sw({}, l.session_recording, u.session_recording)), this.set_config(c), this.config.on_xhr_error && rr.error("on_xhr_error is deprecated. Use on_request_error instead"), this.compression = t.disable_compression ? void 0 : o_;
				let h = this.Ih(),
					d = !this._h();
				if (this.persistence = new ov(this.config, h, !0, d), this.sessionPersistence = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence ? this.persistence : new ov(tS(tS({}, this.config), {}, {
						persistence: "sessionStorage"
					}), h, !1, d), this.Ph = "ph_" + (this.config.persistence_name || this.config.token) + "_session_registered_properties", "memory" !== this.config.persistence && !h && s0.Ot()) {
					let e = s0.Ft(this.Ph);
					q(e) && e.forEach(e => {
						K(e) && this.Rh.add(e)
					})
				} else s0.Dt(this.Ph);
				let p = tS({}, this.persistence.props),
					f = tS({}, this.sessionPersistence.props);
				this.register({
					$initialization_time: (new Date).toISOString()
				}), this.Hh = new ab((e, t) => this.Uh(e, t), this.config.request_queue_config), this.Wh = new ax(this), this.__request_queue = [];
				let g = this._h();
				g || (this.sessionManager = new aP(this), this.sessionPropsManager = new aS(this, this.sessionManager, this.persistence), this.sessionManager.onSessionId((e, t, i) => {
					((null == i ? void 0 : i.activityTimeout) || (null == i ? void 0 : i.sessionPastMaximumLength) || (null == i ? void 0 : i.crossTabAdoption)) && this.Vh()
				})), this.Gh(), this.config.__preview_deferred_init_extensions ? (rr.info("Deferring extension initialization to improve startup performance"), this.Qh = setTimeout(() => {
					this.Qh = void 0, this.Jh(g)
				}, 0)) : (rr.info("Initializing extensions synchronously"), this.Jh(g)), R.DEBUG = R.DEBUG || this.config.debug, R.DEBUG && rr.info("Starting in debug mode", {
					this: this,
					config: t,
					thisC: tS({}, this.config),
					p: p,
					s: f
				}), !this.config.identity_distinct_id || (null == (r = t.bootstrap) ? void 0 : r.distinctID) || (t.bootstrap = tS(tS({}, t.bootstrap), {}, {
					distinctID: this.config.identity_distinct_id,
					isIdentifiedID: !0
				}));
				let v = null == (s = t.bootstrap) ? void 0 : s.distinctID;
				if (this.Sh = !!v && !Y(v), null == (n = t.bootstrap) ? void 0 : n.distinctID) {
					let e = t.bootstrap.distinctID,
						i = this.get_distinct_id(),
						r = this.persistence.get_property(r1);
					if (t.bootstrap.isIdentifiedID && null != i && i !== e && "anonymous" === r) this.identify(e);
					else if (t.bootstrap.isIdentifiedID && null != i && i !== e && "identified" === r) rr.warn("Bootstrap distinctID differs from an already-identified user. The existing identity is preserved. Call reset() before reinitializing if you intend to switch users.");
					else {
						let i = this.config.get_device_id(sM()),
							r = t.bootstrap.isIdentifiedID ? i : e;
						this.persistence.set_property(r1, t.bootstrap.isIdentifiedID ? sd : sh), this.register({
							distinct_id: e,
							$device_id: r
						})
					}
				}
				if (g) this.register_once({
					distinct_id: r9,
					$device_id: null
				}, "");
				else if (!this.get_distinct_id()) {
					let e = this.config.get_device_id(sM());
					this.register_once({
						distinct_id: e,
						$device_id: e
					}, ""), this.persistence.set_property(r1, sh)
				}
				return sF(y, "onpagehide" in self ? "pagehide" : "unload", this._handle_unload.bind(this), {
					passive: !1
				}), sF(y, "pageshow", e => {
					if (this.Mh = !1, !this.Eh) {
						var t;
						if (e.persisted && this.persistence) {
							let e = this.persistence.get_property(rR),
								t = this.persistence.get_property(r1);
							this.persistence.load(), this.Zh() || e === this.persistence.get_property("distinct_id") && t === this.persistence.get_property("$user_state") || this.Kh()
						}
						null == (t = this.Wh) || t.resume()
					}
				}), t.segment ? nN(this, () => this.Yh()) : this.Yh(), G(this.config._onCapture) && this.config._onCapture !== lr && (rr.warn("onCapture is deprecated. Please use `before_send` instead"), this.on("eventCaptured", e => this.config._onCapture(e.event, e))), this.config.ip && rr.warn('The `ip` config option has NO EFFECT AT ALL and has been deprecated. Use a custom transformation or "Discard IP data" project setting instead. See https://posthog.com/tutorials/web-redact-properties#hiding-customer-ip-address for more information.'), this.config.disableDeviceModel || (function() {
					return aI.apply(this, arguments)
				})().then(e => {
					e && this.register({
						[rM]: e
					})
				}).catch(lr), this
			}
			Xh(e) {
				return K(e.name) && G(e.setup)
			}
			ed(e, t) {
				var i = this;
				this.Xh(e) ? t.push(ed(function*() {
					try {
						yield e.setup(i.nd())
					} catch (i) {
						rr.error(`Failed to set up extension "${e.name}"`, i);
						try {
							var t;
							yield null == (t = e.dispose) ? void 0 : t.call(e)
						} catch (t) {
							rr.error(`Failed to dispose extension "${e.name}"`, t)
						}
					}
				})) : this.yh.push(e)
			}
			Gh() {
				var t, i, r, s, n, o, a = this;
				let l = null != (s = null == (n = this.config.__extensionClasses) ? void 0 : n.featureFlags) ? s : null == (o = e.__defaultExtensionClasses) ? void 0 : o.featureFlags;
				if (l)
					if (this.featureFlags && this.featureFlags instanceof l || (null == (t = this.sd) || t.call(this), this.sd = void 0, this.featureFlags = new l(this)), G(this.featureFlags.onReloading) && G(this.featureFlags.setup)) {
						if (!this.sd) {
							this.sd = this.featureFlags.onReloading(() => {
								this.dr.emit("featureFlagsReloading", !0)
							});
							let e = this.featureFlags;
							ed(function*() {
								try {
									yield e.setup(a.nd())
								} catch (i) {
									rr.error("Failed to set up feature flags", i);
									let t = a.sd;
									a.sd = void 0;
									try {
										null == t || t()
									} catch (e) {
										rr.error("Failed to unsubscribe feature flag reloading", e)
									}
									try {
										yield e.dispose()
									} catch (e) {
										rr.error("Failed to dispose feature flags", e)
									}
								}
							})()
						}
					} else null == (i = (r = this.featureFlags).initialize) || i.call(r)
			}
			Jh(t) {
				var i, r, s, n, o, a, l, u;
				let c = performance.now(),
					h = tS(tS({}, e.__defaultExtensionClasses), this.config.__extensionClasses),
					d = [];
				h.exceptions && this.yh.push(this.exceptions = null != (i = this.exceptions) ? i : new h.exceptions(this)), h.historyAutocapture && this.yh.push(this.historyAutocapture = new h.historyAutocapture(this)), h.tracingHeaders && this.yh.push(this.tracingHeaders = new h.tracingHeaders(this)), h.siteApps && this.yh.push(this.siteApps = new h.siteApps(this)), h.sessionRecording && !t && this.yh.push(this.sessionRecording = new h.sessionRecording(this)), this.config.disable_scroll_properties || d.push(() => {
					this.scrollManager.startMeasuringScrollPosition()
				}), h.autocapture && this.ed(this.autocapture = new h.autocapture(this), d), h.surveys && this.ed(this.surveys = null != (r = this.surveys) ? r : new h.surveys(this), d), h.logs && this.ed(this.logs = null != (s = this.logs) ? s : new h.logs(this), d), h.metrics && this.yh.push(this.metrics = null != (n = this.metrics) ? n : new h.metrics(this)), h.conversations && this.yh.push(this.conversations = null != (o = this.conversations) ? o : new h.conversations(this)), h.productTours && this.yh.push(this.productTours = new h.productTours(this)), h.heatmaps && this.yh.push(this.heatmaps = new h.heatmaps(this)), h.webVitalsAutocapture && this.yh.push(this.webVitalsAutocapture = new h.webVitalsAutocapture(this)), h.exceptionObserver && this.yh.push(this.exceptionObserver = new h.exceptionObserver(this)), h.deadClicksAutocapture && this.yh.push(this.deadClicksAutocapture = new h.deadClicksAutocapture(this, nA)), h.toolbar && this.yh.push(this.toolbar = null != (a = this.toolbar) ? a : new h.toolbar(this)), h.experiments && this.yh.push(this.experiments = null != (l = this.experiments) ? l : new h.experiments(this)), h.webMCP && this.yh.push(this.webMCP = null != (u = this.webMCP) ? u : new h.webMCP(this)), this.yh.forEach(e => {
					e.initialize && d.push(() => {
						var t;
						null == (t = e.initialize) || t.call(e)
					})
				}), d.push(() => {
					if (this.rd) {
						let e = this.rd;
						this.rd = void 0, this.yh.forEach(t => {
							var i;
							return null == (i = t.onRemoteConfig) ? void 0 : i.call(t, e)
						})
					}
				}), this.od(d, c)
			}
			od(e, t) {
				for (; e.length > 0;) {
					if (this.config.__preview_deferred_init_extensions && performance.now() - t >= 30 && e.length > 0) return void(this.Qh = setTimeout(() => {
						this.Qh = void 0, this.od(e, t)
					}, 0));
					let i = e.shift();
					if (i) try {
						i()
					} catch (e) {
						rr.error("Error initializing extension:", e)
					}
				}
				let i = Math.round(performance.now() - t);
				this.register_for_session({
					[se]: this.config.__preview_deferred_init_extensions ? "deferred" : "synchronous",
					[st]: i
				}), this.config.__preview_deferred_init_extensions && rr.info(`PostHog extensions initialized (${i}ms)`)
			}
			ac(e) {
				if (!x || !x.body) return rr.info("document not ready yet, trying again in 500 milliseconds..."), void setTimeout(() => {
					this.ac(e)
				}, 500);
				if (this.config.__preview_deferred_init_extensions && (this.rd = e), this.vr = e, this.compression = void 0, e.ok) {
					var t;
					let i = e.config;
					i.supportedCompression && !this.config.disable_compression && (this.compression = D(i.supportedCompression, o_) ? o_ : D(i.supportedCompression, om) ? om : void 0), (null == (t = i.analytics) ? void 0 : t.endpoint) && (this.analyticsDefaultEndpoint = i.analytics.endpoint)
				}
				this.set_config({
					person_profiles: this.Nh ? this.Nh : sp
				}), this.dr.emit("extensionsRemoteConfig", e), this.yh.forEach(t => {
					var i;
					return null == (i = t.onRemoteConfig) ? void 0 : i.call(t, e)
				})
			}
			Yh() {
				try {
					this.config.loaded(this)
				} catch (e) {
					rr.critical("`loaded` function failed", e)
				}
				if (this.ad(), this.config.internal_or_test_user_hostname && (null == k ? void 0 : k.hostname)) {
					let e = k.hostname,
						t = this.config.internal_or_test_user_hostname;
					("string" == typeof t ? e === t : t.test(e)) && this.setInternalOrTestUser()
				}
				this.config.capture_pageview && setTimeout(() => {
					(this.consent.isOptedIn() || this._h()) && this.ld()
				}, 1), this.ud = new oT(this), this.ud.load()
			}
			ad() {
				var e;
				this.is_capturing() && this.config.request_batching && (null == (e = this.Hh) || e.enable())
			}
			_dom_loaded() {
				this.is_capturing() && sy(this.__request_queue, e => this.Uh(e)), this.__request_queue = [], this.ad()
			}
			_handle_unload() {
				var e, t, i, r, s, n;
				this.Mh = !0, null == (e = this.surveys) || null == (t = e.handlePageUnload) || t.call(e), null == (i = this.metrics) || i.flush("sendBeacon"), this.config.request_batching ? (this.hd() && this.capture(sv), null == (r = this.logs) || r.flushLogs("sendBeacon"), null == (s = this.Hh) || s.unload(), null == (n = this.Wh) || n.unload()) : this.hd() && this.capture(sv, null, {
					transport: "sendBeacon"
				})
			}
			_send_request(e) {
				ay(this, e)
			}
			Uh(e, t) {
				this.Wh ? this.Wh.retriableRequest(e, t) : this._send_request(t ? tS(tS({}, e), {}, {
					transport: t
				}) : e)
			}
			_execute_array(e) {
				li++;
				try {
					let t, i = [],
						r = [],
						s = [];
					sy(e, e => {
						if (e)
							if (q(t = e[0])) s.push(e);
							else if (G(e)) try {
							e.call(this)
						} catch (t) {
							rr.error("Error executing queued PostHog call", e, t)
						} else q(e) && "alias" === t ? i.push(e) : q(e) && -1 !== t.indexOf("capture") && G(this[t]) ? s.push(e) : r.push(e)
					});
					let n = function(e, t) {
						sy(e, function(e) {
							try {
								if (q(e[0])) {
									let i = t;
									sb(e, function(e) {
										i = i[e[0]].apply(i, e.slice(1))
									})
								} else t[e[0]].apply(t, e.slice(1))
							} catch (t) {
								rr.error("Error executing queued PostHog call", e, t)
							}
						})
					};
					n(i, this), n(r, this), n(s, this)
				} finally {
					li--
				}
			}
			push(t) {
				if (li > 0 && q(t) && K(t[0])) {
					let i = e.prototype[t[0]];
					return void(G(i) && i.apply(this, t.slice(1)))
				}
				this._execute_array([t])
			}
			get dd() {
				return {
					property: rL,
					persistenceKey: rD,
					cookieName: "_fbc",
					pattern: ld,
					register: (e, t) => {
						var i;
						return null == (i = this.persistence) ? void 0 : i.register({
							[rD]: {
								value: e,
								delivered: t
							}
						})
					},
					unregister: () => {
						var e;
						return null == (e = this.persistence) ? void 0 : e.unregister(rD)
					}
				}
			}
			get vd() {
				return {
					property: rN,
					persistenceKey: rj,
					cookieName: "_fbp",
					pattern: lp,
					register: (e, t) => {
						var i;
						return null == (i = this.persistence) ? void 0 : i.register({
							[rj]: {
								value: e,
								delivered: t
							}
						})
					},
					unregister: () => {
						var e;
						return null == (e = this.persistence) ? void 0 : e.unregister(rj)
					}
				}
			}
			fd(e) {
				var t;
				let i = null == (t = this.persistence) ? void 0 : t.get_property(e.persistenceKey);
				return K(i) && e.pattern.test(i) ? {
					value: i,
					delivered: !1
				} : W(i) && K(i.value) && e.pattern.test(i.value) ? {
					value: i.value,
					delivered: !0 === i.delivered
				} : void 0
			}
			pd(e, t, i) {
				return t === (null == i ? void 0 : i.value) ? {
					value: t,
					pending: !i.delivered
				} : (e.register(t, !1), {
					value: t,
					pending: !0
				})
			}
			gd(e) {
				if (!this.config.save_campaign_params || this._h()) return;
				let t = sT(e.cookieName);
				return K(t) && e.pattern.test(t) ? t : void 0
			}
			md(e, t, i, r) {
				if (!this.persistence) return;
				let s = this.dd;
				this.persistence.refreshMetaIdentifiers();
				let n = this.fd(s);
				if (r) return void s.unregister();
				if (i) return K(t) && ld.test(t) ? this.pd(s, t, n) : void s.unregister();
				let o = K(e) && lh.test(e) ? e : void 0,
					a = this.gd(s);
				return a && ((e, t, i) => {
					let r = e.split(".");
					if (t) return r[3] === t;
					if (!i) return !0;
					let s = i.value.split(".");
					return r[3] === s[3] || Number(r[2]) > Number(s[2])
				})(a, o, n) ? this.pd(s, a, n) : o ? (null == n ? void 0 : n.value.split(".")[3]) === o ? {
					value: n.value,
					pending: !n.delivered
				} : this.pd(s, `fb.1.${Date.now()}.${o}`, n) : n ? {
					value: n.value,
					pending: !n.delivered
				} : void 0
			}
			yd(e, t, i) {
				if (!this.persistence) return;
				let r = this.vd;
				this.persistence.refreshMetaIdentifiers();
				let s = this.fd(r);
				if (i) return void r.unregister();
				if (t) return K(e) && lp.test(e) ? this.pd(r, e, s) : void r.unregister();
				let n = this.gd(r);
				return n ? this.pd(r, n, s) : s ? {
					value: s.value,
					pending: !s.delivered
				} : void 0
			}
			bd(e, t) {
				if (!this.persistence) return;
				this.persistence.refreshMetaIdentifiers();
				let i = this.fd(e);
				(null == i ? void 0 : i.value) !== t || i.delivered || e.register(t, !0)
			}
			capture(e, t, i) {
				var r, s, n, o, a, l, u, c, h;
				let d, p;
				if (!(this.__loaded && this.persistence && this.sessionPersistence && this.Hh)) return void rr.uninitializedWarning("posthog.capture");
				if (!this.is_capturing()) return void rr.info(`Event "${e}" was not captured because capturing is disabled (opted out or consent pending).`);
				if (J(e) || !K(e)) return void rr.error("No event name provided to posthog.capture");
				if (this.xh(), "$snapshot" === e && this._h()) return;
				let f = !this.config.opt_out_useragent_filter && this._is_bot();
				if (f && !this.config.__preview_capture_bot_pageviews) return void rr.info(`Event "${e}" was not captured because the user agent looks like a bot. Set \`opt_out_useragent_filter: true\` to capture it.`);
				let g = (null == i ? void 0 : i.skip_client_rate_limiting) ? void 0 : this.rateLimiter.clientRateLimitContext();
				if (null == g ? void 0 : g.isRateLimited) return void rr.critical("This capture call is ignored due to client rate limiting.");
				(null == t ? void 0 : t.$current_url) && !K(null == t ? void 0 : t.$current_url) && (rr.error("Invalid `$current_url` property provided to `posthog.capture`. Input must be a string. Ignoring provided value."), null == t || delete t.$current_url), "$exception" !== e || (null == i ? void 0 : i._d) || rr.warn("Using `posthog.capture('$exception')` is unreliable because it does not attach required metadata. Use `posthog.captureException(error)` instead, which attaches required metadata automatically."), this.sessionPersistence.update_search_keyword(), this.config.save_campaign_params && (d = this.sessionPersistence.update_campaign_params()), this.config.save_referrer && this.sessionPersistence.update_referrer_info(), (this.config.save_campaign_params || this.config.save_referrer) && this.persistence.set_initial_person_info();
				let v = new Date,
					_ = (null == i ? void 0 : i.timestamp) || v,
					m = tv(null == i ? void 0 : i.uuid, sM),
					y = {
						uuid: m,
						event: e,
						properties: this.calculateEventProperties(e, t || {}, _, m)
					};
				"$pageview" === e && this.config.__preview_capture_bot_pageviews && f && (y.event = "$bot_pageview", y.properties.$browser_type = "bot"), g && (y.properties.$lib_rate_limit_remaining_tokens = g.remainingTokens);
				let b = "$feature_flag_called" === e && !1 === y.properties.$feature_flag_has_experiment && !0 === this.get_property("$minimal_flag_called_events");
				(null == i ? void 0 : i.$set) && !b && (y.$set = null == i ? void 0 : i.$set);
				let w = W(null == t ? void 0 : t.$set) ? t.$set : void 0,
					x = q(null == t ? void 0 : t.$unset) ? t.$unset : [],
					k = (null == i ? void 0 : i.$unset) || [],
					E = e => {
						var t;
						let r = !!(null == i ? void 0 : i.$set) && e in i.$set;
						return {
							hasProvided: r || !!w && e in w,
							provided: r ? null == i || null == (t = i.$set) ? void 0 : t[e] : null == w ? void 0 : w[e],
							unset: -1 !== x.indexOf(e) || -1 !== k.indexOf(e)
						}
					},
					S = E(rL),
					$ = E(rN),
					F = [{
						channel: this.dd,
						hasProvided: S.hasProvided,
						update: this.md(null == d ? void 0 : d.fbclid, S.provided, S.hasProvided, S.unset)
					}, {
						channel: this.vd,
						hasProvided: $.hasProvided,
						update: this.yd($.provided, $.hasProvided, $.unset)
					}];
				for (let {
						channel: e,
						hasProvided: t,
						update: i
					}
					of F) i && !0 === y.properties.$process_person_profile && i.pending && !t && !b && (y.$set = tS({
					[e.property]: i.value
				}, y.$set));
				let P = null == i ? void 0 : i.$unset;
				P && (y.$unset = P);
				let T = b ? void 0 : this.wd(null == i ? void 0 : i.$set_once, e !== sm, e === s_);
				if (T && (y.$set_once = T), (null == i ? void 0 : i._noTruncate) || (o = this.config.properties_string_max_length, l = y, u = e => K(e) ? e.slice(0, o) : e, p = new Set, y = function e(t, i) {
						let r;
						if (t !== Object(t)) return u(t);
						if (!p.has(t)) {
							if (p.add(t), q(t)) r = [], sy(t, t => {
								r.push(e(t))
							});
							else {
								let i = {};
								sb(eo(t) ? sS(t) : t, (t, r) => {
									p.has(t) || (i[r] = e(t, r))
								}), r = i
							}
							return r
						}
					}(l)), y.timestamp = _, J(null == i ? void 0 : i.timestamp) || (y.properties.$event_time_override_provided = !0, y.properties.$event_time_override_system_time = v), b && (y.properties = ((e, t = []) => {
						let i = {},
							r = t => {
								void 0 !== e[t] && (i[t] = e[t])
							};
						return t7.forEach(r), t.forEach(r), i
					})(y.properties, lf)), e === ox || e === ok) {
					let i, r = null == t ? void 0 : t.$survey_id,
						s = null == t ? void 0 : t.$survey_iteration;
					aq({
						id: r,
						current_iteration: s
					}), y.$set = tS(tS({}, y.$set), {}, {
						[(c = {
							id: r,
							current_iteration: s
						}, h = e === ok ? "responded" : "dismissed", i = `$survey_${h}/${c.id}`, c.current_iteration && c.current_iteration > 0 && (i = `$survey_${h}/${c.id}/${c.current_iteration}`), i)]: !0
					})
				} else e === ow && (y.$set = tS(tS({}, y.$set), {}, {
					$survey_last_seen_date: (new Date).toISOString()
				}));
				if ("product tour shown" === e) {
					let e = null == t ? void 0 : t.$product_tour_type;
					e && (y.$set = tS(tS({}, y.$set), {}, {
						[`$product_tour_last_seen_date/${e}`]: (new Date).toISOString()
					}))
				}
				let O = tS(tS({}, y.properties.$set), y.$set);
				if (V(O) || this.setPersonPropertiesForFlags(O), !Z(this.config.before_send)) {
					let e = this.Fs(y);
					if (!e) return;
					(y = e).uuid = tv(y.uuid, sM)
				}
				this.sessionRecording && !this.Fh && lc(e) && (this.Fh = !0, setTimeout(() => this.Fh = !1, 3e4));
				let I = F.filter(({
					channel: e,
					update: t
				}) => {
					var i, r, s;
					let n = null != (i = null == (r = y.$set) ? void 0 : r[e.property]) ? i : W(null == (s = y.properties) ? void 0 : s.$set) ? y.properties.$set[e.property] : void 0;
					return (null == t ? void 0 : t.pending) && n === t.value
				});
				this.dr.emit("eventCaptured", y);
				let R = null != (r = null == i ? void 0 : i._url) ? r : this.requestRouter.endpointFor("api", this.analyticsDefaultEndpoint),
					C = "recordings" === (null == i ? void 0 : i._batchKey) || /\/s\/(?:\?|$)/.test(R),
					M = tS(tS(tS({
						method: "POST",
						url: R,
						data: y,
						compression: "best-available",
						preferSyncCompression: null == i ? void 0 : i.send_instantly,
						timestampMode: C ? "body" : "capture-body",
						batchKey: null == i ? void 0 : i._batchKey
					}, C && (null == (s = y.properties) ? void 0 : s.$session_id) ? {
						batchGroup: y.properties.$session_id + (y.properties.$window_id ? `-${y.properties.$window_id}` : "")
					} : {}), (null == i ? void 0 : i.transport) ? {
						transport: i.transport
					} : {}), I.length ? {
						fireCallbackOnDrop: !0,
						callback: e => {
							if (e.statusCode >= 200 && 300 > e.statusCode)
								for (let {
										channel: e,
										update: t
									}
									of I) this.bd(e, t.value)
						}
					} : {});
				if (!this.config.request_batching || i && !(null == i ? void 0 : i._batchKey) || (null == i ? void 0 : i.send_instantly)) {
					let e;
					!M.transport && !M.callback && V(null != (a = this.config.request_headers) ? a : {}) && this.Mh && (e = "sendBeacon"), this.Uh(M, e)
				} else this.Hh.enqueue(M);
				return null == (n = this.featureFlags) || n.sendFlagCallsPendingCapture(), y
			}
			_addCaptureHook(e) {
				return this.on("eventCaptured", t => e(t.event, t))
			}
			getExtension(e) {
				var t;
				return null == (t = this.kd) ? void 0 : t.getExtension(e)
			}
			nd() {
				var e;
				return null != (e = this.kd) ? e : this.kd = new le(this)
			}
			mr(e) {
				this.Oh.push(e);
				let t = !0;
				return () => {
					if (!t) return;
					t = !1;
					let i = this.Oh.indexOf(e); - 1 !== i && this.Oh.splice(i, 1)
				}
			}
			Zh(e = !0) {
				var t;
				return !!(null == (t = this.persistence) ? void 0 : t.consumeCookieIdentityChange()) && (this.Kh(e), !0)
			}
			Kh(e = !0) {
				var t, i, r;
				this.jh = null, "anonymous" === (null == (t = this.persistence) ? void 0 : t.get_property("$user_state")) && (null == (r = this.sessionPersistence) || r.clear(), this.Rh.clear(), this.Sd()), null == (i = this.featureFlags) || i.reset(), e && this.reloadFeatureFlags()
			}
			calculateEventProperties(e, t, i, r, s) {
				let n;
				if (i = i || new Date, !this.persistence || !this.sessionPersistence) return t;
				this.xh(), this.persistence.syncCookieProperties(), this.Zh();
				let o = s ? void 0 : this.persistence.remove_event_timer(e),
					a = tS({}, t);
				if (a.token = this.config.token, a.$config_defaults = "latest" === this.config.defaults ? lv : this.config.defaults, this._h() && (a[r7] = !0), "$snapshot" === e) {
					let e = tS(tS({}, this.persistence.properties()), this.sessionPersistence.properties());
					return a.distinct_id = e.distinct_id, (!K(a.distinct_id) && !Q(a.distinct_id) || Y(a.distinct_id)) && rr.error("Invalid distinct_id for replay event. This indicates a bug in your implementation"), a
				}
				let l = function(e, t, i, r = !1) {
					var s, n, o, a;
					let l, u;
					if (!P) return {};
					let c = e ? [...n2, ...t || []] : [],
						[h, d] = tn(P),
						[p, f] = function(e) {
							for (let t = 0; tu.length > t; t++) {
								let [i, r, s] = tu[t], n = e.match(i);
								if (n) {
									let t = s && e.match(s) || n;
									return [r, (null == t ? void 0 : t[1]) || ""]
								}
							}
							return ["", ""]
						}(P),
						g = (null == (l = "u" > typeof navigator ? navigator : void 0) ? void 0 : l.brave) ? {
							brave: !0
						} : {},
						v = {};
					J(i) || (v.detectGoogleSearchApp = i);
					let _ = {},
						m = null == (s = navigator) || null == (s = s.userAgentData) ? void 0 : s.platform,
						b = null == (n = navigator) ? void 0 : n.maxTouchPoints,
						w = null == y || null == (o = y.screen) ? void 0 : o.width,
						x = null == y || null == (a = y.screen) ? void 0 : a.height,
						E = null == y ? void 0 : y.devicePixelRatio;
					J(m) || (_.userAgentDataPlatform = m), J(b) || (_.maxTouchPoints = b), J(w) || (_.screenWidth = w), J(x) || (_.screenHeight = x), J(E) || (_.devicePixelRatio = E);
					let S = sw(sE({
						$os: h,
						$os_version: d,
						$browser: tt(P, navigator.vendor, g, v),
						$webview_app: p,
						$webview_app_version: f,
						$device: to(P),
						$device_type: ta(P, _),
						$timezone: nV(),
						$timezone_offset: function() {
							try {
								return (new Date).getTimezoneOffset()
							} catch (e) {
								return
							}
						}()
					}), {
						$current_url: n0(r ? tm(null == k ? void 0 : k.href) : null == k ? void 0 : k.href, c, n5),
						$host: null == k ? void 0 : k.host,
						$pathname: null == k ? void 0 : k.pathname,
						$raw_user_agent: P.length > 1e3 ? P.substring(0, 997) + "..." : P,
						$browser_version: tr(P, navigator.vendor, g, v),
						$browser_language: n7(),
						$browser_language_prefix: "string" == typeof(u = n7()) ? u.split("-")[0] : void 0,
						$screen_height: null == y ? void 0 : y.screen.height,
						$screen_width: null == y ? void 0 : y.screen.width,
						$viewport_height: null == y ? void 0 : y.innerHeight,
						$viewport_width: null == y ? void 0 : y.innerWidth,
						$lib: R.LIB_NAME,
						$lib_version: R.LIB_VERSION,
						$insert_id: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
						$time: Date.now() / 1e3
					});
					return R.SDK_DIST_CHANNEL && (S.$sdk_dist_channel = R.SDK_DIST_CHANNEL), S
				}(this.config.mask_personal_data_properties, this.config.custom_personal_data_properties, this.config.detect_google_search_app, this.config.disable_capture_url_hashes);
				if (this.sessionManager) {
					let {
						sessionId: e,
						windowId: t
					} = this.sessionManager.checkAndGetSessionAndWindowId(s, i.getTime(), !0);
					a.$session_id = e, a.$window_id = t
				}
				this.sessionPropsManager && sw(a, this.sessionPropsManager.getSessionProps());
				try {
					var u;
					if (this.sessionRecording) {
						let t = this.sessionRecording.sdkDebugProperties,
							i = !this.Fh && lc(e);
						for (let e in t)(i || D(ll, e)) && (a[e] = t[e])
					}
					a.$sdk_debug_retry_queue_size = null == (u = this.Wh) ? void 0 : u.length
				} catch (e) {
					a.$sdk_debug_error_capturing_properties = String(e)
				}
				if (this.requestRouter.region === aN && (a.$lib_custom_api_host = this.config.api_host), n = "$pageview" !== e || s ? "$pageleave" !== e || s ? this.pageViewManager.doEvent() : this.pageViewManager.doPageLeave(i) : this.pageViewManager.doPageView(i, r), a = sw(a, n), "$pageview" === e && x && (a.title = x.title), !J(o)) {
					let e = i.getTime() - o;
					a.$duration = parseFloat((e / 1e3).toFixed(3))
				}
				P && this.config.opt_out_useragent_filter && (a.$browser_type = this._is_bot() ? "bot" : "browser");
				let c = this.persistence.properties(),
					h = this.sessionPersistence.properties(),
					d = a.$groups,
					p = c.$groups;
				W(d) && !V(d) && (a.$groups = tS(tS({}, W(p) ? p : {}), d)), sb(["$referrer", "$referring_domain"], e => {
					e in c && delete h[e]
				});
				let f = {};
				if (this.Oh.length > 0)
					for (let e of this.Oh.slice()) try {
						sw(f, e())
					} catch (e) {
						rr.error("Failed to produce browser extension event properties", e)
					}(a = sw({}, l, c, h, tS(tS({}, f), a))).$is_identified = this._isIdentified(), q(this.config.property_denylist) ? sb(this.config.property_denylist, function(e) {
						delete a[e]
					}) : rr.error(la + this.config.property_denylist + " or property_blacklist config: " + this.config.property_blacklist);
				let g = this.config.sanitize_properties;
				g && (rr.error(lo), a = g(a, e));
				let v = this.xd();
				return a.$process_person_profile = v, v && !s && this.$d("_calculate_event_properties"), a
			}
			wd(e, t = !0, i = !1) {
				var r;
				if (!this.persistence || !this.xd() || this.Ah && !i) return e;
				let s = sw({}, this.persistence.get_initial_props(), (null == (r = this.sessionPropsManager) ? void 0 : r.getSetOnceProps()) || {}, e || {}),
					n = this.config.sanitize_properties;
				return n && (rr.error(lo), s = n(s, "$set_once")), t && (this.Ah = !0), V(s) ? void 0 : s
			}
			register(e, t) {
				var i;
				null == (i = this.persistence) || i.register(e, t)
			}
			register_once(e, t, i) {
				var r;
				null == (r = this.persistence) || r.register_once(e, t, i)
			}
			register_for_session(e) {
				var t, i;
				null == (t = this.persistence) || t.syncCookieProperties(), this.Zh(), null == (i = this.sessionPersistence) || i.register(e), Object.keys(e).forEach(e => this.Rh.add(e)), this.Sd()
			}
			unregister(e) {
				var t;
				null == (t = this.persistence) || t.unregister(e)
			}
			unregister_for_session(e) {
				var t;
				null == (t = this.sessionPersistence) || t.unregister(e), this.Rh.delete(e), this.Sd()
			}
			Cd(e, t) {
				this.register({
					[e]: t
				})
			}
			Vh() {
				this.Rh.forEach(e => {
					var t;
					null == (t = this.sessionPersistence) || t.unregister(e)
				}), this.Rh.clear(), this.Sd()
			}
			Sd() {
				var e;
				if (!this.Ph) return;
				if ("memory" === this.config.persistence || (null == (e = this.sessionPersistence) ? void 0 : e.fi) || !s0.Ot()) return void s0.Dt(this.Ph);
				let t = [];
				this.Rh.forEach(e => t.push(e)), t.length > 0 ? s0.$t(this.Ph, t) : s0.Dt(this.Ph)
			}
			getFeatureFlag(e, t) {
				var i;
				return null == (i = this.featureFlags) ? void 0 : i.getFeatureFlag(e, t)
			}
			getFeatureFlagPayload(e) {
				var t;
				return null == (t = this.featureFlags) ? void 0 : t.getFeatureFlagPayload(e)
			}
			getFeatureFlagResult(e, t) {
				var i;
				return null == (i = this.featureFlags) ? void 0 : i.getFeatureFlagResult(e, t)
			}
			getAllFeatureFlags() {
				var e, t;
				return null != (e = null == (t = this.featureFlags) ? void 0 : t.getAllFeatureFlags()) ? e : []
			}
			isFeatureEnabled(e, t) {
				var i, r;
				return null != (i = null == (r = this.featureFlags) ? void 0 : r.isFeatureEnabled(e, t)) ? i : null == t ? void 0 : t.defaultValue
			}
			reloadFeatureFlags() {
				var e;
				null == (e = this.featureFlags) || e.reloadFeatureFlags()
			}
			updateFlags(e, t, i) {
				var r;
				null == (r = this.featureFlags) || r.updateFlags(e, t, i)
			}
			updateEarlyAccessFeatureEnrollment(e, t, i) {
				var r;
				null == (r = this.featureFlags) || r.updateEarlyAccessFeatureEnrollment(e, t, i)
			}
			getEarlyAccessFeatures(e, t = !1, i) {
				var r;
				return null == (r = this.featureFlags) ? void 0 : r.getEarlyAccessFeatures(e, t, i)
			}
			on(e, t) {
				return this.dr.on(e, t)
			}
			onFeatureFlags(e) {
				return this.featureFlags ? this.featureFlags.onFeatureFlags(e) : (e([], {}, {
					errorsLoading: !0
				}), () => {})
			}
			onSurveysLoaded(e) {
				return this.surveys ? this.surveys.onSurveysLoaded(e) : (e([], {
					isLoaded: !1,
					error: ln
				}), () => {})
			}
			onSessionId(e) {
				var t, i;
				return null != (t = null == (i = this.sessionManager) ? void 0 : i.onSessionId(e)) ? t : () => {}
			}
			getSurveys(e, t = !1) {
				this.surveys ? this.surveys.getSurveys(e, t) : e([], {
					isLoaded: !1,
					error: ln
				})
			}
			getActiveMatchingSurveys(e, t = !1) {
				this.surveys ? this.surveys.getActiveMatchingSurveys(e, t) : e([], {
					isLoaded: !1,
					error: ln
				})
			}
			onActiveMatchingSurveysChanged(e) {
				return this.surveys ? this.surveys.onActiveMatchingSurveysChanged(e) : (e([], {
					isLoaded: !1,
					error: ln
				}), () => {})
			}
			renderSurvey(e, t) {
				var i;
				null == (i = this.surveys) || i.renderSurvey(e, t)
			}
			displaySurvey(e, t = aW) {
				var i;
				null == (i = this.surveys) || i.displaySurvey(e, t)
			}
			cancelPendingSurvey(e) {
				var t;
				null == (t = this.surveys) || t.cancelPendingSurvey(e)
			}
			canRenderSurvey(e) {
				var t, i;
				return null != (t = null == (i = this.surveys) ? void 0 : i.canRenderSurvey(e)) ? t : {
					visible: !1,
					disabledReason: ln
				}
			}
			canRenderSurveyAsync(e, t = !1) {
				var i, r;
				return null != (i = null == (r = this.surveys) ? void 0 : r.canRenderSurveyAsync(e, t)) ? i : Promise.resolve({
					visible: !1,
					disabledReason: ln
				})
			}
			Td(e) {
				return !e || Y(e) ? (rr.critical("Unique user id has not been set in posthog.identify"), !1) : "$posthog_cookieless" === e ? (rr.critical(`The string "${e}" was set in posthog.identify which indicates an error. This ID is only used as a sentinel value.`), !1) : !["distinct_id", "distinctid"].includes(e.toLowerCase()) && !["undefined", "null"].includes(e.toLowerCase()) || (rr.critical(`The string "${e}" was set in posthog.identify which indicates an error. This ID should be unique to the user and not a hardcoded string.`), !1)
			}
			identify(e, t, i) {
				if (!this.__loaded || !this.persistence) return rr.uninitializedWarning("posthog.identify");
				if (Q(e) && (e = e.toString(), rr.warn("The first argument to posthog.identify was a number, but it should be a string. It has been converted to a string.")), !this.Td(e) || !this.$d("posthog.identify")) return;
				this.xh();
				let r = this.get_distinct_id(),
					s = this.persistence.syncCookieProperties() && this.get_distinct_id() !== r,
					n = this.Zh(!1),
					o = this.persistence.Ou(),
					a = !1;
				try {
					let r = this.get_distinct_id();
					this.register({
						$user_id: e
					}), this.get_property("$device_id") || this.register_once({
						$had_persisted_distinct_id: !0,
						$device_id: r
					}, ""), e !== r && e !== this.get_property("__alias") && (this.unregister(rA), this.register({
						distinct_id: e
					}));
					let o = (this.persistence.get_property("$user_state") || "anonymous") === sh,
						u = e !== r,
						c = !u && o;
					if (u && o) {
						var l;
						let s = this.config.reuseAnonymousId ? {
							distinct_id: e
						} : {
							distinct_id: e,
							$anon_distinct_id: r
						};
						this.persistence.set_property(r1, sd), this.setPersonPropertiesForFlags({
							$set: t || {},
							$set_once: i || {}
						}, !1), this.config.cookieWinsOnConflict && this.persistence.Fu(), this.capture("$identify", s, {
							$set: t || {},
							$set_once: i || {}
						}) && (this.jh = aD(e, t, i)), null == (l = this.featureFlags) || l.setAnonymousDistinctId(this.config.reuseAnonymousId ? void 0 : r)
					} else if (c) {
						this.persistence.set_property(r1, sd);
						let r = t || {},
							s = i || {};
						this.setPersonPropertiesForFlags({
							$set: r,
							$set_once: s
						}, !1), this.config.cookieWinsOnConflict && this.persistence.Fu(), this.capture("$set", {
							$set: r,
							$set_once: s
						}) && (this.jh = aD(e, t, i))
					} else(t || i) && this.setPersonProperties(t, i);
					u || s || n ? (this.reloadFeatureFlags(), this.featureFlags ? this.featureFlags.resetFlagCallReported() : this.unregister(ry)) : c && (t || i) && this.reloadFeatureFlags(), a = !0
				} finally {
					o && this.persistence.Nu(a)
				}
			}
			setPersonProperties(e, t) {
				if (!e && !t || !this.$d("posthog.setPersonProperties")) return;
				let i = aD(this.get_distinct_id(), e, t);
				this.jh !== i ? (this.setPersonPropertiesForFlags({
					$set: e || {},
					$set_once: t || {}
				}, !0), this.capture("$set", {
					$set: e || {},
					$set_once: t || {}
				}) && (this.jh = i)) : rr.info("A duplicate setPersonProperties call was made with the same properties. It has been ignored.")
			}
			unsetPersonProperties(e) {
				var t;
				let i = (q(e) ? e : [e]).filter(e => K(e) && e.length > 0);
				0 !== i.length && this.$d("posthog.unsetPersonProperties") && (null == (t = this.featureFlags) || t.unsetPersonPropertiesForFlags(i, !0), this.capture("$set", {
					$unset: i
				}), this.jh = null)
			}
			group(e, t, i) {
				var r;
				if (!e || !t) return void rr.error("posthog.group requires a group type and group key");
				null == (r = this.persistence) || r.syncCookieProperties(), this.Zh();
				let s = this.getGroups(),
					n = s[e] !== t;
				if (n && this.resetGroupPropertiesForFlags(e), this.register({
						$groups: tS(tS({}, s), {}, {
							[e]: t
						})
					}), (n || i) && this.xd()) {
					let r = {
						$group_type: e,
						$group_key: t
					};
					i && (r.$group_set = i), this.capture(sm, r)
				}
				i && this.setGroupPropertiesForFlags({
					[e]: i
				}), n && !i && this.reloadFeatureFlags()
			}
			resetGroups() {
				this.register({
					$groups: {}
				}), this.resetGroupPropertiesForFlags(), this.reloadFeatureFlags()
			}
			setPersonPropertiesForFlags(e, t = !0) {
				var i;
				null == (i = this.featureFlags) || i.setPersonPropertiesForFlags(e, t)
			}
			resetPersonPropertiesForFlags(e = !0) {
				var t;
				null == (t = this.featureFlags) || t.resetPersonPropertiesForFlags(e)
			}
			setGroupPropertiesForFlags(e, t = !0) {
				var i;
				this.$d("posthog.setGroupPropertiesForFlags") && (null == (i = this.featureFlags) || i.setGroupPropertiesForFlags(e, t))
			}
			resetGroupPropertiesForFlags(e) {
				var t;
				null == (t = this.featureFlags) || t.resetGroupPropertiesForFlags(e)
			}
			reset(e) {
				let t = et(e) ? e : null == e ? void 0 : e.resetDeviceID,
					i = et(e) || null == e ? void 0 : e.bootstrap;
				this.Id(t, !1, i)
			}
			Id(e, t = !1, i) {
				var r, s, n, o, a, l, u, c, h, d, p, f, g, v, _, m, y, b, w, x, k, E;
				if (rr.info("reset"), !this.__loaded) return rr.uninitializedWarning("posthog.reset");
				let S = null == i ? void 0 : i.sessionID;
				this.config.bootstrap = i || (null == (r = this.Bh) ? void 0 : r.bootstrap) || {}, null == (s = this.featureFlags) || null == (n = s.updateConfig) || n.call(s, this.config, this.lc());
				let $ = this.get_property(rC),
					F = this.get_property(rM),
					P = this.get_property(rY);
				null == (o = this.sessionRecording) || o.flushBeforeIdentityReset();
				let T = this.is_capturing();
				t || this.consent.reset(), t || !T || this.is_capturing() || console.warn("[PostHog.js]", "reset() cleared the stored consent, and capturing is now off because of `opt_out_capturing_by_default`. Call opt_in_capturing() again, and prefer calling reset() before opting in rather than after.");
				let O = null == (a = this.persistence) || null == (l = a.Ou) ? void 0 : l.call(a),
					I = this.$h;
				this.$h = I || t;
				let R = !1;
				try {
					if (null == (u = this.persistence) || u.clear(), null == (c = this.sessionPersistence) || c.clear(), this.Rh.clear(), this.Sd(), J(P) || null == (m = this.persistence) || m.register({
							$session_recording_remote_config: P
						}), null == (h = this.surveys) || h.reset(), null == (d = this.featureFlags) || d.reset(), null == (p = this.conversations) || p.reset(), null == (f = this.logs) || f.reset(), null == (g = this.metrics) || g.reset(), null == (v = this.persistence) || v.set_property("$user_state", "anonymous"), null == (_ = this.sessionManager) || _.resetSessionId(), this.jh = null, "always" === this.config.cookieless_mode) this.register_once({
						distinct_id: r9,
						$device_id: null
					}, "");
					else {
						let t = this.config.get_device_id(sM());
						this.register_once({
							distinct_id: t,
							$device_id: e ? t : $
						}, ""), e || J(F) || this.register({
							[rM]: F
						})
					}
					if (this.register({
							$last_posthog_reset: (new Date).toISOString()
						}, 1), i && (i.distinctID && !this._h() && (null == (w = this.persistence) || w.set_property("$user_state", i.isIdentifiedID ? "identified" : "anonymous"), this.register({
							distinct_id: i.distinctID
						})), null == (y = this.featureFlags) || y.initialize(), !Z(S) && !(null == (b = this.sessionManager) ? void 0 : b.setBootstrapSessionId(S, !0)))) {
						let e = tS({}, i);
						delete e.sessionID, this.config.bootstrap = e
					}
					delete this.config.identity_distinct_id, delete this.config.identity_hash, delete this.config.identity_claims, R = !0
				} finally {
					this.$h = I, O && (null == (x = this.persistence) || null == (k = x.Nu) || k.call(x, R))
				}
				this.vr && (null == (E = this.conversations) || E.onRemoteConfig(this.vr)), this.reloadFeatureFlags()
			}
			shutdown(e) {
				var t = this;
				return ed(function*() {
					if (!t.__loaded) return void rr.uninitializedWarning("posthog.shutdown");
					t.Eh = !0, clearTimeout(t.Qh), t.Qh = void 0;
					let e = t.sd;
					for (let i of (t.sd = void 0, [() => {
							var e;
							return null == (e = t.sessionRecording) ? void 0 : e.dispose()
						}, () => {
							var e;
							return null == (e = t.logs) ? void 0 : e.flushLogs("sendBeacon")
						}, () => {
							var e;
							return null == (e = t.metrics) ? void 0 : e.flush("sendBeacon")
						}, () => {
							var e;
							return null == (e = t.metrics) ? void 0 : e.dispose()
						}, () => {
							var e;
							return null == (e = t.logs) ? void 0 : e.dispose()
						}, () => {
							var e;
							return null == (e = t.surveys) ? void 0 : e.dispose()
						}, () => {
							var e;
							return null == (e = t.autocapture) ? void 0 : e.dispose()
						}, () => null == e ? void 0 : e(), () => {
							var e;
							return null == (e = t.Hh) ? void 0 : e.unload()
						}, () => {
							var e;
							return null == (e = t.Wh) ? void 0 : e.unload()
						}, () => {
							var e;
							return null == (e = t.featureFlags) ? void 0 : e.destroy()
						}, () => {
							var e;
							return null == (e = t.persistence) ? void 0 : e.destroy()
						}, () => {
							var e;
							return null == (e = t.sessionPersistence) ? void 0 : e.destroy()
						}])) try {
						let e = i();
						e && G(e.then) && e.then(void 0, e => {
							rr.error("Error during shutdown", e)
						})
					} catch (e) {
						rr.error("Error during shutdown", e)
					}
				})()
			}
			setIdentity(e, t) {
				var i;
				delete this.config.identity_claims, this.config.identity_distinct_id = e, this.config.identity_hash = t, this.alias(e), null == (i = this.conversations) || i.Md()
			}
			clearIdentity() {
				var e;
				delete this.config.identity_distinct_id, delete this.config.identity_hash, delete this.config.identity_claims, null == (e = this.conversations) || e.Ed()
			}
			get_distinct_id() {
				return this.get_property("distinct_id")
			}
			getGroups() {
				return this.get_property("$groups") || {}
			}
			get_session_id() {
				var e, t;
				return null != (e = null == (t = this.sessionManager) ? void 0 : t.checkAndGetSessionAndWindowId(!0).sessionId) ? e : ""
			}
			get_session_replay_url(e) {
				if (!this.sessionManager) return "";
				let {
					sessionId: t,
					sessionStartTimestamp: i
				} = this.sessionManager.checkAndGetSessionAndWindowId(!0), r = this.requestRouter.endpointFor("ui", `/project/${this.config.token}/replay/${t}`);
				if ((null == e ? void 0 : e.withTimestamp) && i) {
					var s;
					let t = null != (s = e.timestampLookBack) ? s : 10;
					if (!i) return r;
					r += `?t=${Math.max(Math.floor(((new Date).getTime()-i)/1e3)-t,0)}`
				}
				return r
			}
			alias(e, t) {
				return e === this.get_property("$people_distinct_id") ? (rr.critical("Attempting to create alias for existing People user - aborting."), -2) : this.$d("posthog.alias") ? (J(t) && (t = this.get_distinct_id()), e !== t ? (this.Cd(rA, e), this.capture("$create_alias", {
					alias: e,
					distinct_id: t
				})) : (rr.warn("alias matches current distinct_id - skipping api call."), this.identify(e), -1)) : void 0
			}
			set_config(e) {
				let t = tS({}, this.config);
				if (W(e)) {
					var i, r, s, n, o, a, l, u, c, h, d, p, f, g, v, _, m, y;
					sw(this.config, ly(e));
					let b = this.Ih();
					if (this.persistence) {
						let e = "sessionStorage" === this.config.persistence || "memory" === this.config.persistence;
						(e && this.sessionPersistence !== this.persistence && (null == (v = this.sessionPersistence) || v.remove(), null == (_ = this.sessionPersistence) || _.destroy()), this.persistence.update_config(this.config, t, b), e) ? this.sessionPersistence = this.persistence: this.sessionPersistence === this.persistence ? this.sessionPersistence = new ov(tS(tS({}, this.config), {}, {
							persistence: "sessionStorage"
						}), b, !1) : null == (m = this.sessionPersistence) || m.update_config(tS(tS({}, this.config), {}, {
							persistence: "sessionStorage"
						}), tS(tS({}, t), {}, {
							persistence: "sessionStorage"
						}), b)
					}
					let w = this.qh(this.config.debug);
					et(w) && (this.config.debug = w), et(this.config.debug) && (this.config.debug ? (R.DEBUG = !0, sH.Ot() && sH.$t("ph_debug", !0), rr.info("set_config", {
						config: e,
						oldConfig: t,
						newConfig: tS({}, this.config)
					})) : (R.DEBUG = !1, sH.Ot() && sH.Dt("ph_debug"))), null == (i = this.featureFlags) || null == (r = i.updateConfig) || r.call(i, this.config, this.lc()), null == (s = this.exceptionObserver) || s.onConfigChange(), null == (n = this.exceptions) || n.onConfigChange(), null == (o = this.metrics) || o.onConfigChange(), null == (a = this.webMCP) || a.startIfEnabled(), null == (l = this.sessionRecording) || l.startIfEnabledOrStop(), null == (u = this.tracingHeaders) || u.startIfEnabledOrStop(), null == (c = this.autocapture) || c.startIfEnabled(), null == (h = this.heatmaps) || h.startIfEnabled(), ("capture_pageview" in e || "disable_capture_url_hashes" in e) && (null == (y = this.historyAutocapture) || y.startIfEnabledOrStop()), null == (d = this.exceptionObserver) || d.startIfEnabledOrStop(), null == (p = this.deadClicksAutocapture) || p.startIfEnabledOrStop(), null == (f = this.surveys) || f.loadIfEnabled(), this.Ch(), null == (g = this.externalIntegrations) || g.startIfEnabledOrStop(), !t.segment && this.config.segment && this.persistence && nN(this, lr, !1)
				}
			}
			_overrideSDKInfo(e, t) {
				R.LIB_NAME = e, R.LIB_VERSION = t
			}
			startSessionRecording(e) {
				var t, i, r, s, n;
				let o = !0 === e,
					a = {
						sampling: o || !!(null == e ? void 0 : e.sampling),
						linked_flag: o || !!(null == e ? void 0 : e.linked_flag),
						url_trigger: o || !!(null == e ? void 0 : e.url_trigger),
						event_trigger: o || !!(null == e ? void 0 : e.event_trigger)
					};
				Object.values(a).some(Boolean) && (null == (t = this.sessionManager) || t.checkAndGetSessionAndWindowId(), a.sampling && (null == (i = this.sessionRecording) || i.overrideSampling()), a.linked_flag && (null == (r = this.sessionRecording) || r.overrideLinkedFlag()), a.url_trigger && (null == (s = this.sessionRecording) || s.overrideTrigger("url")), a.event_trigger && (null == (n = this.sessionRecording) || n.overrideTrigger("event"))), this.set_config({
					disable_session_recording: !1
				})
			}
			stopSessionRecording() {
				this.set_config({
					disable_session_recording: !0
				})
			}
			sessionRecordingStarted() {
				var e;
				return !!(null == (e = this.sessionRecording) ? void 0 : e.started)
			}
			captureException(e, t) {
				try {
					if (!this.exceptions) return;
					let i = this.exceptions.buildProperties(e, {
						handled: !0,
						syntheticException: Error("PostHog syntheticException")
					});
					return this.exceptions.sendExceptionEvent(tS(tS({}, i), t))
				} catch (e) {
					return
				}
			}
			addExceptionStep(e, t) {
				var i;
				null == (i = this.exceptions) || i.addExceptionStep(e, t)
			}
			captureLog(e) {
				var t;
				null == (t = this.logs) || t.captureLog(e)
			}
			get logger() {
				var t, i;
				return null != (t = null == (i = this.logs) ? void 0 : i.logger) ? t : e.Ad
			}
			startExceptionAutocapture(e) {
				this.set_config({
					capture_exceptions: null == e || e
				})
			}
			stopExceptionAutocapture() {
				this.set_config({
					capture_exceptions: !1
				})
			}
			loadToolbar(e) {
				var t, i;
				return null != (t = null == (i = this.toolbar) ? void 0 : i.loadToolbar(e)) && t
			}
			get_property(e) {
				var t;
				return null == (t = this.persistence) ? void 0 : t.props[e]
			}
			getSessionProperty(e) {
				var t;
				return null == (t = this.sessionPersistence) ? void 0 : t.props[e]
			}
			toString() {
				var e;
				let t = null != (e = this.config.name) ? e : lg;
				return t !== lg && (t = "posthog." + t), t
			}
			_isIdentified() {
				var e, t;
				return "identified" === (null == (e = this.persistence) ? void 0 : e.get_property("$user_state")) || "identified" === (null == (t = this.sessionPersistence) ? void 0 : t.get_property("$user_state"))
			}
			xd() {
				var e, t;
				return !("never" === this.config.person_profiles || "identified_only" === this.config.person_profiles && !this._isIdentified() && V(this.getGroups()) && !(null == (e = this.persistence) || null == (e = e.props) ? void 0 : e.__alias) && !(null == (t = this.persistence) || null == (t = t.props) ? void 0 : t.$epp))
			}
			hd() {
				return !0 === this.config.capture_pageleave || "if_capture_pageview" === this.config.capture_pageleave && !!this.config.capture_pageview
			}
			createPersonProfile() {
				this.xd() || this.$d("posthog.createPersonProfile") && this.setPersonProperties({}, {})
			}
			setInternalOrTestUser() {
				this.$d("posthog.setInternalOrTestUser") && this.setPersonProperties({
					$internal_or_test_user: !0
				})
			}
			$d(e) {
				return "never" === this.config.person_profiles ? (rr.error(e + ' was called, but process_person is set to "never". This call will be ignored.'), !1) : (this.wh(), this.Cd(r6, !0), !0)
			}
			Ih() {
				if ("always" === this.config.cookieless_mode) return !0;
				let e = this.consent.isOptedOut();
				return this.config.disable_persistence || e && !(!this.config.opt_out_persistence_by_default && "on_reject" !== this.config.cookieless_mode)
			}
			Ch() {
				var e, t, i, r, s;
				let n = this.Ih();
				return this.is_capturing() || null == (i = this.logs) || i.Rd(), (null == (e = this.persistence) ? void 0 : e.fi) !== n && (null == (r = this.persistence) || r.set_disabled(n)), (null == (t = this.sessionPersistence) ? void 0 : t.fi) !== n && (null == (s = this.sessionPersistence) || s.set_disabled(n)), this.Sd(), n
			}
			opt_in_capturing(t) {
				var i, r, s, n, o, a, l, u, c, h, d, p, f, g;
				if ("always" === this.config.cookieless_mode) return void rr.warn(ls);
				if (this._h()) {
					null == (n = this.sessionRecording) || n.dispose({
						discardBufferedEvents: !0
					}), this.Id(!0, !0), null == (o = this.sessionManager) || o.destroy(), null == (a = this.pageViewManager) || a.destroy(), this.sessionManager = new aP(this), this.pageViewManager = new nU(this), this.persistence && (this.sessionPropsManager = new aS(this, this.sessionManager, this.persistence));
					let t = null != (l = null == (u = this.config.__extensionClasses) ? void 0 : u.sessionRecording) ? l : null == (c = e.__defaultExtensionClasses) ? void 0 : c.sessionRecording;
					t && (this.sessionRecording = this.bh(this.sessionRecording, new t(this)), this.vr && (null == (h = this.sessionRecording) || null == (d = h.onRemoteConfig) || d.call(h, this.vr)))
				}
				let v = 1 === this.consent.consent;
				v && this.xh(), this.consent.optInOut(!0), this.Ch(), this.ad(), null == (i = this.sessionRecording) || i.startIfEnabledOrStop(), "on_reject" == this.config.cookieless_mode && (null == (p = this.surveys) || p.loadIfEnabled(), null == (f = this.conversations) || f.loadIfEnabled()), !v && (J(null == t ? void 0 : t.captureEventName) || (null == t ? void 0 : t.captureEventName)) && this.capture(null != (g = null == t ? void 0 : t.captureEventName) ? g : "$opt_in", null == t ? void 0 : t.captureProperties, {
					send_instantly: !0
				}), null == (r = this.persistence) || r.syncCookieProperties(), this.Zh(), null == (s = this.featureFlags) || s.sendFlagCallsPendingCapture(), this.config.capture_pageview && this.ld()
			}
			opt_out_capturing() {
				"always" !== this.config.cookieless_mode ? (this.consent.optInOut(!1), this.Ch(), "on_reject" === this.config.cookieless_mode && this.Th()) : rr.warn(ls)
			}
			Th() {
				var e, t;
				let i = this.sessionRecording;
				null == i || i.dispose({
					discardBufferedEvents: !0
				}), "$posthog_cookieless" !== this.get_distinct_id() && this.Id(!0, !0), this.register({
					distinct_id: r9,
					$device_id: null
				}), this.mh(i), this.sessionRecording = void 0, null == (e = this.sessionManager) || e.destroy(), null == (t = this.pageViewManager) || t.destroy(), this.sessionManager = void 0, this.sessionPropsManager = void 0, this.config.capture_pageview && this.ld(), this.ad()
			}
			has_opted_in_capturing() {
				return this.consent.isOptedIn()
			}
			has_opted_out_capturing() {
				return this.consent.isOptedOut()
			}
			get_explicit_consent_status() {
				let e = this.consent.consent;
				return 1 === e ? "granted" : 0 === e ? "denied" : "pending"
			}
			is_capturing() {
				return !this.$h && ("always" === this.config.cookieless_mode || ("on_reject" === this.config.cookieless_mode ? this.consent.isRejected() || this.consent.isOptedIn() : !this.has_opted_out_capturing()))
			}
			clear_opt_in_out_capturing() {
				this.consent.reset(), this.Ch()
			}
			_is_bot() {
				return w ? aO(w, this.config.custom_blocked_useragents) : void 0
			}
			ld() {
				x && ("visible" === x.visibilityState ? this.Dh || (this.Dh = !0, this.capture(sg, {
					title: x.title
				}, {
					send_instantly: !0
				}), this.Lh && (x.removeEventListener(rE, this.Lh), this.Lh = null)) : this.Lh || (this.Lh = this.ld.bind(this), sF(x, rE, this.Lh)))
			}
			debug(e) {
				!1 === e ? (null == y || y.console.log("You've disabled debug mode."), this.set_config({
					debug: !1
				})) : (null == y || y.console.log("You're now in debug mode. All calls to PostHog will be logged in your console.\nYou can disable this with `posthog.debug(false)`."), this.set_config({
					debug: !0
				}))
			}
			lc() {
				var e, t;
				let i, r, s = this.Bh || {};
				return "advanced_disable_flags" in s ? !!s.advanced_disable_flags : !1 !== this.config.advanced_disable_flags ? !!this.config.advanced_disable_flags : !0 === this.config.advanced_disable_decide ? (rr.warn("Config field 'advanced_disable_decide' is deprecated. Please use 'advanced_disable_flags' instead. The old field will be removed in a future major version."), !0) : (t = "advanced_disable_decide", i = (e = "advanced_disable_flags") in s && !Z(s[e]), r = t in s && !Z(s[t]), i ? s[e] : !!r && (rr && rr.warn(`Config field '${t}' is deprecated. Please use '${e}' instead. The old field will be removed in a future major version.`), s[t]))
			}
			Fs(e) {
				var t;
				if (Z(this.config.before_send)) return e;
				let i = Object.keys(null != (t = e.properties) ? t : {}).filter(er),
					r = q(this.config.before_send) ? this.config.before_send : [this.config.before_send],
					s = e;
				for (let t of r) try {
					if (s = t(s), Z(s)) {
						let t = `Event '${e.event}' was rejected in beforeSend function`;
						return ei(e.event) ? rr.warn(`${t}. This can cause unexpected behavior.`) : rr.info(t), null
					}
					s.properties && !V(s.properties) || rr.warn(`Event '${e.event}' has no properties after beforeSend function, this is likely an error.`)
				} catch (t) {
					return rr.error(`Error in beforeSend function for event '${e.event}':`, t), null
				}
				for (let t of i)
					if (s.properties && Z(s.properties[t])) return rr.warn(`Event '${e.event}' had its '${t}' property removed in a beforeSend function. This property is required for ingestion, so the event will be dropped.`), null;
				return s
			}
			getPageViewId() {
				var e;
				return null == (e = this.pageViewManager.Ul) ? void 0 : e.pageViewId
			}
			captureTraceFeedback(e, t) {
				this.capture("$ai_feedback", {
					$ai_trace_id: String(e),
					$ai_feedback_text: t
				})
			}
			captureTraceMetric(e, t, i) {
				this.capture("$ai_metric", {
					$ai_trace_id: String(e),
					$ai_metric_name: t,
					$ai_metric_value: String(i)
				})
			}
			qh(e) {
				let t = et(e) && !e,
					i = sH.Ot() && "true" === sH.Lt("ph_debug");
				return !t && (!!i || e)
			}
		};
	lw.__defaultExtensionClasses = {}, lw.Ad = {
			trace: c = () => {},
			debug: c,
			info: c,
			warn: c,
			error: c,
			fatal: c
		},
		function(e, t) {
			for (let i = 0; t.length > i; i++) e.prototype[t[i]] = sk(e.prototype[t[i]])
		}(lw, ["identify"]);
	let lx = ["[data-ph-capture-value]"];
	var lk = class {
		constructor(e) {
			this._instance = e
		}
		refresh(e) {
			var t;
			let i = this._instance.config,
				r = W(i.autocapture) ? i.autocapture : void 0;
			e.enabled = !!i.autocapture, e.rageclick = i.rageclick, e.maskAllElementAttributes = i.mask_all_element_attributes, e.maskAllText = i.mask_all_text, e.disableCaptureUrlHashes = i.disable_capture_url_hashes, e.getCurrentUrl = i.get_current_url, e.remoteRequestsDisabled = this._instance.lc(), e.url_allowlist = null == r ? void 0 : r.url_allowlist, e.url_ignorelist = null == r ? void 0 : r.url_ignorelist, e.dom_event_allowlist = null == r ? void 0 : r.dom_event_allowlist, e.element_allowlist = null == r ? void 0 : r.element_allowlist, e.css_selector_allowlist = null == r ? void 0 : r.css_selector_allowlist, e.css_selector_ignorelist = null == r ? void 0 : r.css_selector_ignorelist, e.element_attribute_ignorelist = null == r ? void 0 : r.element_attribute_ignorelist, e.capture_copied_text = null == r ? void 0 : r.capture_copied_text, e.capture_value_css_selector_allowlist = null != (t = null == r ? void 0 : r.capture_value_css_selector_allowlist) ? t : lx
		}
	};
	let lE = rr.createLogger("[ExceptionAutocapture]", void 0),
		lS = () => {},
		l$ = e => {
			var t;
			if (G(e)) return null != (t = e.__posthog_layer__) ? t : e.__rrweb_layer__
		};

	function lF(e, t, i) {
		try {
			if (!(t in e)) return lS;
			let r = {
					next: e[t]
				},
				s = i(function(...e) {
					return r.next.apply(this, e)
				});
			return G(s) && (s.prototype = s.prototype || {}, Object.defineProperties(s, {
				__posthog_wrapped__: {
					enumerable: !1,
					value: !0
				},
				__posthog_layer__: {
					enumerable: !1,
					value: r
				}
			})), e[t] = s, () => {
				if (e[t] === s) return void(e[t] = r.next);
				let i = e[t],
					n = l$(i);
				for (; n;) {
					if (n.next === s) return void(n.next = r.next);
					n = l$(i = n.next)
				}
			}
		} catch (e) {
			return lS
		}
	}
	let lP = rr.createLogger("[TracingHeaders]", void 0),
		lT = rr.createLogger("[Web Vitals]", void 0),
		lO = ["CLS", "FCP", "INP", "LCP"],
		lI = ["INP", "LCP"],
		lR = ["interactionTarget", "interactionType", "inputDelay", "processingDuration", "presentationDelay", "loadState", "target", "url", "timeToFirstByte", "resourceLoadDelay", "resourceLoadDuration", "elementRenderDelay", "largestShiftTarget", "largestShiftTime", "largestShiftValue", "firstByteToFCP"],
		lC = "disabled",
		lM = "lazy_loading",
		lA = rr.createLogger("[SessionRecording]", void 0),
		lL = [si, sr, ss, sn, so, sa, sl, su, sc],
		lD = rr.createLogger("[Heatmaps]", void 0);

	function lN(e) {
		return W(e) && "clientX" in e && "clientY" in e && Q(e.clientX) && Q(e.clientY)
	}
	let lj = rr.createLogger("[Product Tours]", void 0),
		lz = e => {
			var t;
			return !e.config.disable_product_tours && !!(null == (t = e.persistence) ? void 0 : t.get_property(rV))
		},
		lH = ["$set_once", "$set"],
		lU = rr.createLogger("[SiteApps]", void 0),
		lB = "Error while initializing PostHog app with config id ";

	function lq(e, t, i) {
		if (Z(e)) return !1;
		switch (i) {
			case "exact":
				return e === t;
			case "contains":
				return RegExp(t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/_/g, ".").replace(/%/g, ".*"), "i").test(e);
			case "regex":
				try {
					return new RegExp(t).test(e)
				} catch (e) {
					return !1
				}
			default:
				return !1
		}
	}
	var lG = class {
			constructor(e) {
				this.$i = e, this.Ao = new Set, this.Ro = new Set, this.Po = new a$, this.Oo = (e, t) => this.Fo(e, t) && this.Do(e, t) && this.Lo(e, t) && this.No(e, t), this.Fo = (e, t) => !(null == t ? void 0 : t.event) || (null == e ? void 0 : e.event) === (null == t ? void 0 : t.event)
			}
			init() {
				var e, t;
				J(null == (e = this.$i) ? void 0 : e.subscribeCapture) || (this.jo = null == (t = this.$i) ? void 0 : t.subscribeCapture((e, t) => {
					this.on(e, t)
				}))
			}
			dispose() {
				var e, t, i;
				null == (e = this.jo) || e.call(this), this.jo = void 0, null == (t = this.$i) || null == (i = t.setElementSelectors) || i.call(t, new Set, this), this.Po = new a$
			}
			register(e) {
				var t, i;
				if (!J(null == (t = this.$i) ? void 0 : t.subscribeCapture) && (e.forEach(e => {
						var t;
						this.Ao.add(e), null == (t = e.steps) || t.forEach(e => {
							this.Ro.add((null == e ? void 0 : e.event) || "")
						})
					}), null == (i = this.$i) ? void 0 : i.setElementSelectors)) {
					let e = new Set;
					this.Ao.forEach(t => {
						var i;
						null == (i = t.steps) || i.forEach(t => {
							(null == t ? void 0 : t.selector) && e.add(t.selector)
						})
					}), this.$i.setElementSelectors(e, this)
				}
			}
			replace(e) {
				this.Ao.clear(), this.Ro.clear(), this.register(e)
			}
			on(e, t) {
				null != t && 0 != e.length && (this.Ro.has(e) || this.Ro.has(t.event)) && this.Ao.forEach(e => {
					this.qo(t, e) && this.Po.emit("actionCaptured", e.name)
				})
			}
			Bo(e) {
				this.onAction("actionCaptured", t => e(t))
			}
			qo(e, t) {
				if (null == (null == t ? void 0 : t.steps)) return !1;
				for (let i of t.steps)
					if (this.Oo(e, i)) return !0;
				return !1
			}
			onAction(e, t) {
				return this.Po.on(e, t)
			}
			Do(e, t) {
				if (null == t ? void 0 : t.url) {
					var i, r, s;
					let n = null == e || null == (i = e.properties) ? void 0 : i.$current_url;
					if (!(null == e ? void 0 : e.properties) || !("$current_url" in e.properties)) try {
						n = null == (r = this.$i) || null == (s = r.getActionUrl) ? void 0 : s.call(r)
					} catch (e) {
						return !1
					}
					if (!n || "string" != typeof n || !lq(n, t.url, t.url_matching || "contains")) return !1
				}
				return !0
			}
			Lo(e, t) {
				return !!this.zo(e, t) && !!this.Ho(e, t) && !!this.Uo(e, t)
			}
			zo(e, t) {
				var i;
				let r;
				if (!(null == t ? void 0 : t.href)) return !0;
				let s = this.Wo(e);
				if (s.length > 0) return s.some(e => lq(e.href, t.href, t.href_matching || "exact"));
				let n = (null == e || null == (i = e.properties) ? void 0 : i.$elements_chain) || "";
				return !!n && lq((r = n.match(/(?::|")href="(.*?)"/)) ? r[1] : "", t.href, t.href_matching || "exact")
			}
			Ho(e, t) {
				var i, r, s, n;
				if (!(null == t ? void 0 : t.text)) return !0;
				let o = this.Wo(e);
				if (o.length > 0) return o.some(e => lq(e.text, t.text, t.text_matching || "exact") || lq(e.$el_text, t.text, t.text_matching || "exact"));
				let a = (null == e || null == (n = e.properties) ? void 0 : n.$elements_chain) || "";
				return !!a && (i = function(e) {
					let t, i = [],
						r = /(?::|")text="(.*?)"/g;
					for (; !Z(t = r.exec(e));) i.includes(t[1]) || i.push(t[1]);
					return i
				}(a), r = t.text, s = t.text_matching || "exact", i.some(e => lq(e, r, s)))
			}
			Uo(e, t) {
				var i, r;
				if (!(null == t ? void 0 : t.selector)) return !0;
				let s = null == e || null == (i = e.properties) ? void 0 : i.$element_selectors;
				if (null == s ? void 0 : s.includes(t.selector)) return !0;
				let n = (null == e || null == (r = e.properties) ? void 0 : r.$elements_chain) || "";
				if (t.selector_regex && n) try {
					return new RegExp(t.selector_regex).test(n)
				} catch (e) {}
				return !1
			}
			Wo(e) {
				var t;
				return null == (null == e || null == (t = e.properties) ? void 0 : t.$elements) ? [] : null == e ? void 0 : e.properties.$elements
			}
			No(e, t) {
				return !(null == t ? void 0 : t.properties) || 0 === t.properties.length || aL(t.properties.reduce((e, t) => {
					let i = q(t.value) ? t.value.map(String) : null != t.value ? [String(t.value)] : [];
					return e[t.key] = {
						values: i,
						operator: t.operator || "exact"
					}, e
				}, {}), null == e ? void 0 : e.properties)
			}
		},
		lW = class {
			constructor(e, t) {
				this.Vo = t, this.Go = [], this.$i = e, this.Qo = new Map, this.Jo = new Map, this.Zo = new Map
			}
			Ko() {
				var e, t;
				this.Yo = null == (e = (t = this.$i).subscribeSession) ? void 0 : e.call(t, e => this.Xo(e))
			}
			ta(e) {
				return !1
			}
			ea() {
				return null
			}
			ia(e) {}
			na() {}
			sa(e, t) {
				return !!e && aL(e.propertyFilters, null == t ? void 0 : t.properties)
			}
			ra(e, t) {
				let i = new Map;
				return e.forEach(e => {
					var r;
					null == (r = e.conditions) || null == (r = r[t]) || null == (r = r.values) || r.forEach(t => {
						if (null == t ? void 0 : t.name) {
							let r = i.get(t.name) || [];
							r.push(e.id), i.set(t.name, r)
						}
					})
				}), i
			}
			oa(e, t, i) {
				let r = (i === oy ? this.Qo : this.Jo).get(e),
					s = [];
				return this.aa(e => {
					s = e.filter(e => null == r ? void 0 : r.includes(e.id))
				}), s.filter(r => {
					var s;
					let n = null == (s = r.conditions) || null == (s = s[i]) || null == (s = s.values) ? void 0 : s.find(t => t.name === e);
					return this.sa(n, t)
				})
			}
			register(e) {
				this.la(e, !1)
			}
			replace(e) {
				this.la(e, !0)
			}
			la(e, t) {
				J(this.$i.subscribeCapture) || (this.ua(e, t), this.ca(e, t))
			}
			ca(e, t) {
				var i;
				let r = e.filter(e => {
					var t;
					return null == (t = e.conditions) || null == (t = t.actions) || null == (t = t.values) ? void 0 : t.length
				});
				if (t && this.Zo.clear(), 0 === r.length) return void(t && (null == (i = this.ha) || i.replace([])));
				this.ha || (this.ha = new lG(this.$i), this.ha.init(), this.ha.Bo(e => this.onAction(e)));
				let s = [];
				r.forEach(e => {
					var t;
					null == (t = e.conditions) || null == (t = t.actions) || t.values.forEach(t => {
						if (s.push(t), t.name) {
							var i;
							let r = null != (i = this.Zo.get(t.name)) ? i : [];
							r.includes(e.id) || r.push(e.id), this.Zo.set(t.name, r)
						}
					})
				}), t ? this.ha.replace(s) : this.ha.register(s)
			}
			da(e, t) {
				t.forEach((t, i) => {
					var r;
					let s = null != (r = e.get(i)) ? r : [];
					t.forEach(e => {
						s.includes(e) || s.push(e)
					}), e.set(i, s)
				})
			}
			ua(e, t) {
				var i, r;
				let s = e.filter(e => {
						var t, i;
						return (null == (t = e.conditions) ? void 0 : t.events) && (null == (i = e.conditions) || null == (i = i.events) || null == (i = i.values) ? void 0 : i.length) > 0
					}),
					n = e.filter(e => {
						var t, i;
						return (null == (t = e.conditions) ? void 0 : t.cancelEvents) && (null == (i = e.conditions) || null == (i = i.cancelEvents) || null == (i = i.values) ? void 0 : i.length) > 0
					}),
					o = this.ra(e, oy),
					a = this.ra(e, ob);
				t ? (this.Qo = o, this.Jo = a) : (this.da(this.Qo, o), this.da(this.Jo, a)), (0 !== s.length || 0 !== n.length || e.some(e => {
					var t;
					return null == (t = e.conditions) || null == (t = t.actions) || null == (t = t.values) ? void 0 : t.length
				})) && (null != this.jo || (this.jo = null == (i = (r = this.$i).subscribeCapture) ? void 0 : i.call(r, (e, t) => {
					this.onEvent(e, t)
				})))
			}
			onEvent(e, t) {
				var i, r;
				let s = this.va(),
					n = (null == t || null == (i = t.properties) ? void 0 : i.$survey_id) || (null == t || null == (r = t.properties) ? void 0 : r.$product_tour_id);
				if (n && this.getActivatedIds().includes(n)) {
					let i = this.fa(e, n, t);
					if ("consume" === i) return s.info("event consumed activated item, removing it", {
						event: e,
						itemId: n
					}), void this.pa([n]);
					if ("persist" === i) return s.info("shown item promoted to persisted activation", {
						event: e,
						itemId: n
					}), this.ga(n), void this.ma([n])
				}
				if (this.Jo.has(e)) {
					let i = this.oa(e, t, ob);
					i.length > 0 && (s.info("cancel event matched, cancelling items", {
						event: e,
						itemsToCancel: i.map(e => e.id)
					}), this.pa(i.map(e => e.id)), i.forEach(e => this.ya(e.id)))
				}
				if (!this.Qo.has(e)) return;
				s.info("event name matched", {
					event: e,
					eventPayload: t,
					items: this.Qo.get(e)
				});
				let o = this.oa(e, t, oy);
				this.ba(o.map(e => e.id))
			}
			onAction(e) {
				this.Zo.has(e) && this.ba(this.Zo.get(e) || [])
			}
			ba(e) {
				if (0 === e.length) return;
				let t = !!this.$i.getSessionId(),
					i = [];
				for (let r of e) t && this.ta(r) ? this.ga(r) && this._a(r) : i.push(r);
				i.length > 0 && (this.Go = [...new Set([...this.Go, ...i])]), this.va().info("updating activated items", {
					activatedItems: this.getActivatedIds()
				}), this.wa()
			}
			ga(e) {
				this.Go = this.Go.filter(t => t !== e);
				let t = this.ka();
				return !t.includes(e) && (this.Sa([...t, e]), this.xa(), !0)
			}
			pa(e) {
				let t = new Set(e);
				this.Go = this.Go.filter(e => !t.has(e));
				let i = this.$a(),
					r = i.filter(e => !t.has(e));
				r.length !== i.length && (this.Sa(r), 0 === r.length && this.Ca()), this.ma(e), this.wa()
			}
			wa() {
				try {
					var e;
					null == (e = this.Vo) || e.call(this)
				} catch (e) {
					this.va().error("Error while handling activated items change", e)
				}
			}
			Ta() {
				let e = this.ea();
				if (!e) return {};
				let t = this.$i.getProperty(e);
				return t && "object" == typeof t ? t : {}
			}
			_a(e) {
				if (!this.ea()) return;
				let t = this.Ta();
				this.ia(tS(tS({}, t), {}, {
					[e]: Date.now()
				}))
			}
			ma(e) {
				if (!this.ea()) return;
				let t = this.Ta(),
					i = {},
					r = !1;
				for (let [s, n] of Object.entries(t)) e.includes(s) ? r = !0 : i[s] = n;
				r && (V(i) ? this.na() : this.ia(i))
			}
			Ia() {
				this.ea() && this.na()
			}
			getActivationTimestamp(e) {
				if (!this.ka().includes(e)) return;
				let t = this.Ta()[e];
				return Q(t) ? t : void 0
			}
			$a() {
				let e = this.Ma();
				return this.$i.getProperty(e) || []
			}
			ka() {
				let e = this.$a();
				if (0 === e.length) return [];
				let t = this.$i.getProperty(this.Ea()),
					i = this.$i.getSessionId();
				return i && t === i ? e : []
			}
			xa() {
				let e = this.$i.getSessionId();
				e && this.Aa(e)
			}
			Ca() {
				this.Ra()
			}
			Xo(e) {
				let t = this.$i.getProperty(this.Ea());
				if (t && t !== e) {
					let e = this.$a(),
						t = this.Ta();
					e.length > 0 && (this.Sa([]), e.filter(e => Q(t[e])).forEach(e => this.ya(e))), this.Ca(), this.Ia(), e.length > 0 && this.wa()
				}
			}
			getActivatedIds() {
				return [...new Set([...this.ka(), ...this.Go])].filter(e => !this.Pa(e))
			}
			dispose() {
				var e, t, i;
				null == (e = this.Yo) || e.call(this), this.Yo = void 0, null == (t = this.jo) || t.call(this), this.jo = void 0, null == (i = this.ha) || i.dispose(), this.ha = void 0
			}
			reset() {
				this.Go = [], this.$a().length > 0 && this.Sa([]), this.Ca(), this.Ia(), this.wa()
			}
			getEventToItemsMap() {
				return this.Qo
			}
			Oa() {
				return this.ha
			}
		},
		lV = class extends lW {
			constructor(e, t, i, r) {
				var s;
				super({
					subscribeCapture(t) {
						let i = e.onEvent(e => t(e.event, e));
						return () => i.dispose()
					},
					subscribeSession(t) {
						let i = e.onSession(t);
						return () => i.dispose()
					},
					getSessionId() {
						var t;
						return null == (t = e.session) ? void 0 : t.sessionId
					},
					getProperty: t => e.kv.get(t),
					getActionUrl: null == i ? void 0 : i.getActionUrl,
					setElementSelectors: null != (s = null == i ? void 0 : i.setElementSelectors) ? s : (t, i) => {
						var r;
						return null == (r = e.getExtension("autocapture")) ? void 0 : r.setElementSelectors(t, i)
					}
				}, r), this.Fa = e, this.Da = t, this.Ko()
			}
			Ma() {
				return rT
			}
			Ea() {
				return rO
			}
			ea() {
				return rI
			}
			ia(e) {
				this.Fa.kv.set({
					[rI]: e
				})
			}
			na() {
				this.Fa.kv.remove(rI)
			}
			ta(e) {
				var t;
				let i;
				this.aa(t => {
					i = t.find(t => t.id === e)
				});
				let r = null == i || null == (t = i.appearance) ? void 0 : t.surveyPopupDelaySeconds;
				return Q(r) && r > 0
			}
			La() {
				return ow
			}
			aa(e) {
				this.Da.getSurveys(e)
			}
			ya(e) {
				this.Da.cancelPendingSurvey(e)
			}
			va() {
				return aB
			}
			Sa(e) {
				this.Fa.kv.set({
					[rT]: e
				})
			}
			Aa(e) {
				this.Fa.kv.set({
					[rO]: e
				})
			}
			Ra() {
				this.Fa.kv.remove(rO)
			}
			Pa() {
				return !1
			}
			fa(e, t, i) {
				var r, s, n;
				let o;
				return e === ok && !1 === (null == i || null == (r = i.properties) ? void 0 : r.$survey_completed) ? "ignore" : (this.aa(e => {
					o = e.find(e => e.id === t)
				}), !o || aR(s = o) && (null == (n = s.conditions) || null == (n = n.events) ? void 0 : n.repeatedActivation) || "always" === s.schedule ? e === ow ? "consume" : "ignore" : e === ow ? "persist" : e === ox || e === ok ? "consume" : "ignore")
			}
			getSurveys() {
				return this.getActivatedIds()
			}
			getEventToSurveys() {
				return this.getEventToItemsMap()
			}
		};
	let lJ = (e, t) => (null == e ? void 0 : e.then) ? e.then(t) : t(e),
		lK = "SDK is not enabled or survey functionality is not yet loaded",
		lY = "Disabled. Not loading surveys.";
	var lX = class {
			constructor(e) {
				this.Na = e, this.name = "surveys", this._surveyEventReceiver = null, this._surveyManager = null, this.ja = !1, this.qa = !1, this.Ba = [], this.za = [], this.Ha = null, this.Ua = null, this.Ti = !1, this.Wa = new Set, this.onRemoteConfig = e => {
					if (this.Ti || this.Fr.disableSurveys) return;
					if (!e.ok) return this.qa = !0, this.Va({
						isLoaded: !1,
						error: "Remote config unavailable. Not loading surveys."
					}), aB.warn("Remote config unavailable. Not loading surveys.");
					let t = e.config.surveys;
					if (Z(t)) return aB.warn("Flags not loaded yet. Not loading surveys.");
					this.Ga = et(t) ? t : t.length > 0, aB.info(`flags response received, isSurveysEnabled: ${this.Ga}`), this.loadIfEnabled()
				}, this.Va = e => {
					this.za.slice().forEach(t => this.Qa(t, e))
				}
			}
			setup(e) {
				if (!this.Ti) return this.Ja = e, lJ(e.kv.initialize(), () => {
					if (this.Ja !== e || this.Ti) return;
					this.Ja = void 0, this.Fa = e;
					let t = e.onRemoteConfig(this.onRemoteConfig);
					this.Ti ? t.dispose() : (this.Za = t, this.loadIfEnabled())
				})
			}
			dispose() {
				var e, t, i, r, s;
				this.Ti || (this.Ti = !0, this.Ja = void 0, this.Fa = void 0, null == (e = this.Za) || e.dispose(), this.Za = void 0, null == (t = this._surveyEventReceiver) || t.dispose(), this._surveyEventReceiver = null, null == (i = this._surveyManager) || null == (r = i.dispose) || r.call(i), this._surveyManager = null, this.Ba = [], this.za.forEach(e => {
					e.active = !1
				}), this.za = [], null == (s = this.Ka) || s.call(this), this.Ka = void 0, this.Ha = null, this.Wa.forEach(e => clearTimeout(e)), this.Wa.clear())
			}
			get Fr() {
				return this.Na.get()
			}
			getRenderContext() {
				if (!this.Fa) return;
				let e = this;
				return {
					client: this.Fa,
					get config() {
						return e.Fr
					},
					surveys: e
				}
			}
			initialize() {
				this.loadIfEnabled()
			}
			reset() {
				var e, t, i;
				null == (e = this._surveyManager) || null == (t = e.clearInMemoryInProgressSurveyState) || t.call(e);
				try {
					null == (i = this._surveyEventReceiver) || i.reset(), localStorage.removeItem("lastSeenSurveyDate");
					let e = [];
					for (let t = 0; t < localStorage.length; t++) {
						let i = localStorage.key(t);
						((null == i ? void 0 : i.startsWith("seenSurvey_")) || (null == i ? void 0 : i.startsWith("inProgressSurvey_"))) && e.push(i)
					}
					e.forEach(e => localStorage.removeItem(e))
				} catch (e) {}
				this.Va()
			}
			loadIfEnabled() {
				if (this.Ti || !this.Fa) return;
				let e = this.Fr;
				if (this._surveyManager) return;
				if (this.ja) return void aB.info("Already initializing surveys, skipping...");
				if (e.disableSurveys) return void aB.info(lY);
				if (e.cookielessMode && this.Fa.isOptedOut) return void aB.info("Not loading surveys in cookieless mode without consent.");
				let t = this.Na.getExtensions();
				if (!t) return void this.Ya("PostHog Extensions not found.");
				if (J(this.Ga) && !e.advancedEnableSurveys) return;
				let i = this.Ga || e.advancedEnableSurveys;
				this.ja = !0, this.qa = !1;
				try {
					let e = t.generateSurveys;
					if (e) return this.Xa(e, i), void(this.ja = !1);
					let r = t.loadExternalDependency;
					if (!r) return this.Ya(rP), void(this.ja = !1);
					r(e => {
						try {
							if (this.Ti) return;
							let t = this.Na.getExtensions();
							!e && (null == t ? void 0 : t.generateSurveys) ? this.Xa(t.generateSurveys, i) : this.Ya("Could not load surveys script", e)
						} finally {
							this.ja = !1
						}
					})
				} catch (e) {
					throw this.ja = !1, this.Ya("Error initializing surveys", e), e
				}
			}
			Xa(e, t) {
				var i;
				if (this.Ti) return;
				this._surveyManager = e(t), this._surveyEventReceiver = this.tl(this.Fa, this.Va);
				let r = null == (i = this.Fa) ? void 0 : i.kv.get(r$);
				r && this.el(r), aB.info("Surveys loaded successfully"), this.il(), this.Va(), this.nl({
					isLoaded: !0
				})
			}
			tl(e, t) {
				return new lV(e, this, void 0, t)
			}
			Ya(e, t) {
				this.qa = !0, aB.error(e, t), this.Va({
					isLoaded: !1,
					error: e
				}), this.nl({
					isLoaded: !1,
					error: e
				})
			}
			onSurveysLoaded(e) {
				return this.Ba.push(e), this._surveyManager && this.nl({
					isLoaded: !0
				}), () => {
					this.Ba = this.Ba.filter(t => t !== e)
				}
			}
			getSurveys(e, t = !1) {
				if (this.Ti) return;
				let i = this.Fa;
				if (!i) return e([], {
					isLoaded: !1,
					error: lK
				});
				if (this.Fr.disableSurveys) return aB.info(lY), e([]);
				let r = i.kv.get(r$);
				if (r && !t) return e(r, {
					isLoaded: !0
				}), void(this.sl() && this.getSurveys(() => {}, !0));
				if (this.Ha) return void this.Ha.then(({
					surveys: t,
					context: i
				}) => {
					this.Ti || e(t, i)
				}).catch(e => aB.error("Error in survey callback", e));
				let s = i.sendRequest("/api/surveys/", {
					method: "GET",
					query: {
						token: i.projectToken
					},
					sentAt: "query",
					timeoutMs: this.Fr.requestTimeoutMs
				}).then(e => {
					try {
						return this.rl(i, e)
					} catch (e) {
						return aB.error("Error processing surveys response", e), this.rl(i, {
							statusCode: 0,
							error: e
						})
					}
				}, e => this.rl(i, {
					statusCode: 0,
					error: e
				}));
				this.Ha = s;
				let n = () => {
					this.Ha === s && (this.Ha = null)
				};
				s.then(t => {
					n(), this.Ti || (this.Va(t.context), e(t.surveys, t.context))
				}, n).catch(e => aB.error("Error in survey callback", e))
			}
			rl(e, t) {
				if (this.Ti) return {
					surveys: [],
					context: {
						isLoaded: !1,
						error: lK
					}
				};
				let i = t.statusCode;
				if (200 !== i || !t.json) {
					let e = `Surveys API could not be loaded, status: ${i}`;
					return 0 !== i ? aB.error(e) : t.error || aB.warn(e), this.Ua = Date.now(), {
						surveys: [],
						context: {
							isLoaded: !1,
							error: e
						}
					}
				}
				this.Ua = null;
				let r = t.json.surveys || [];
				return e.kv.set({
					[r$]: r,
					[rF]: Date.now()
				}), this.el(r), {
					surveys: r,
					context: {
						isLoaded: !0
					}
				}
			}
			el(e) {
				let t = e.filter(e => {
					var t;
					return !(!e.start_date || e.end_date) && (aR(e) || !!(null == (t = e.conditions) || null == (t = t.actions) || null == (t = t.values) ? void 0 : t.length))
				});
				this.al(t)
			}
			al(e) {
				var t;
				null == (t = this._surveyEventReceiver) || t.replace(e)
			}
			sl() {
				return this.ll() && !this.Ha && !this.ul()
			}
			ll() {
				var e;
				let t = null == (e = this.Fa) ? void 0 : e.kv.get(rF);
				return Q(t) && Date.now() - t > 3e5
			}
			ul() {
				return Q(this.Ua) && 3e5 > Date.now() - this.Ua
			}
			markSurveyAsSeen(e, t) {
				var i;
				aq({
					id: e,
					current_iteration: null != (i = null == t ? void 0 : t.iteration) ? i : null
				});
				try {
					localStorage.setItem("lastSeenSurveyDate", (new Date).toISOString())
				} catch (e) {}
				this.Va()
			}
			nl(e) {
				for (let t of this.Ba) {
					if (this.Ti) return;
					try {
						e.isLoaded ? this.getSurveys(t) : t([], e)
					} catch (e) {
						aB.error("Error in survey callback", e)
					}
				}
			}
			getActiveMatchingSurveys(e, t = !1) {
				if (!Z(this._surveyManager)) return this._surveyManager.getActiveMatchingSurveys(e, t);
				aB.warn("init was not called")
			}
			onActiveMatchingSurveysChanged(e) {
				var t;
				if (this.Ti) return () => {};
				let i = {
					callback: e,
					active: !0,
					revision: 0
				};
				this.za.push(i), this.il();
				let r = null == (t = this.Fa) ? void 0 : t.kv.get(r$);
				return !this.Fr.disableSurveys && (this._surveyManager || !this.qa || this.ja) && (r || Z(this.Ua) || this.Ha) ? this._surveyManager && this.Qa(i) : this.Qa(i, {
					isLoaded: !1
				}), () => {
					var e;
					i.active = !1, this.za = this.za.filter(e => e !== i), 0 === this.za.length && (null == (e = this.Ka) || e.call(this), this.Ka = void 0)
				}
			}
			il() {
				var e, t;
				this._surveyManager && this.za.length > 0 && (null != this.Ka || (this.Ka = null == (e = (t = this.Na).onMatchingConditionsChanged) ? void 0 : e.call(t, this.Va)))
			}
			Qa(e, t) {
				if (this.Ti || !e.active) return;
				let i = ++e.revision,
					r = r => {
						if (!this.Ti && e.active && i === e.revision) try {
							let i = null != t ? t : {
									isLoaded: !0
								},
								s = JSON.stringify([r, i]);
							if (s === e.lastResult) return;
							e.lastResult = s, e.callback(r, i)
						} catch (e) {
							aB.error("Error in active matching surveys callback", e)
						}
					};
				try {
					t && !t.isLoaded ? r([]) : this.getActiveMatchingSurveys(r)
				} catch (e) {
					aB.error("Error in active matching surveys callback", e)
				}
			}
			cl(e) {
				let t = null;
				return this.getSurveys(i => {
					var r;
					t = null != (r = i.find(t => t.id === e)) ? r : null
				}), t
			}
			hl(e) {
				if (Z(this._surveyManager)) return {
					eligible: !1,
					reason: lK
				};
				let t = "string" == typeof e ? this.cl(e) : e;
				return t ? this._surveyManager.checkSurveyEligibility(t) : {
					eligible: !1,
					reason: "Survey not found"
				}
			}
			dl(e) {
				var t;
				if (!(null == (t = this.Fa) ? void 0 : t.canCapture)) return {
					eligible: !1,
					reason: "PostHog is not capturing, so a survey response cannot be recorded"
				};
				if (Z(this._surveyManager)) return {
					eligible: !1,
					reason: lK
				};
				let i = "string" == typeof e ? this.cl(e) : e;
				return i ? this._surveyManager.checkSurveyRenderability(i) : {
					eligible: !1,
					reason: "Survey not found"
				}
			}
			canRenderSurvey(e) {
				if (Z(this._surveyManager)) return aB.warn("init was not called"), {
					visible: !1,
					disabledReason: lK
				};
				let t = this.dl(e);
				return {
					visible: t.eligible,
					disabledReason: t.reason
				}
			}
			canRenderSurveyAsync(e, t) {
				return Z(this._surveyManager) ? (aB.warn("init was not called"), Promise.resolve({
					visible: !1,
					disabledReason: lK
				})) : new Promise(i => {
					this.getSurveys(t => {
						var r;
						let s = null != (r = t.find(t => t.id === e)) ? r : null;
						if (s) {
							let e = this.dl(s);
							i({
								visible: e.eligible,
								disabledReason: e.reason
							})
						} else i({
							visible: !1,
							disabledReason: "Survey not found"
						})
					}, t)
				})
			}
			renderSurvey(e, t, i) {
				var r, s, n;
				if (!(null == (r = this.Fa) ? void 0 : r.canCapture)) return;
				if (Z(this._surveyManager)) return void aB.warn("init was not called");
				let o = "string" == typeof e ? this.cl(e) : e;
				if (!(null == o ? void 0 : o.id)) return void aB.warn("Survey not found");
				if (!aG.includes(o.type)) return void aB.warn(`Surveys of type ${o.type} cannot be rendered in the app`);
				let a = null == (s = typeof document > "u" ? void 0 : document) ? void 0 : s.querySelector(t);
				if (a) {
					if (null == (n = o.appearance) ? void 0 : n.surveyPopupDelaySeconds) {
						aB.info(`Rendering survey ${o.id} with delay of ${o.appearance.surveyPopupDelaySeconds} seconds`);
						let e = setTimeout(() => {
							var t, r, s;
							this.Wa.delete(e), !this.Ti && (null == (t = this.Fa) ? void 0 : t.canCapture) && (aB.info(`Rendering survey ${o.id} with delay of ${null==(r=o.appearance)?void 0:r.surveyPopupDelaySeconds} seconds`), null == (s = this._surveyManager) || s.renderSurvey(o, a, i), aB.info(`Survey ${o.id} rendered`))
						}, 1e3 * o.appearance.surveyPopupDelaySeconds);
						return void this.Wa.add(e)
					}
					this._surveyManager.renderSurvey(o, a, i)
				} else aB.warn("Survey element not found")
			}
			displaySurvey(e, t) {
				var i, r;
				if (!(null == (i = this.Fa) ? void 0 : i.canCapture)) return;
				if (Z(this._surveyManager)) return void aB.warn("init was not called");
				let s = this.cl(e);
				if (!s) return void aB.warn("Survey not found");
				let n = s;
				if ((null == (r = s.appearance) ? void 0 : r.surveyPopupDelaySeconds) && t.ignoreDelay && (n = tS(tS({}, s), {}, {
						appearance: tS(tS({}, s.appearance), {}, {
							surveyPopupDelaySeconds: 0
						})
					})), t.displayType !== oE && t.initialResponses && aB.warn("initialResponses is only supported for popover surveys. prefill will not be applied."), !1 === t.ignoreConditions) {
					let e = this.hl(s);
					if (!e.eligible) return void aB.warn("Survey is not eligible to be displayed: ", e.reason)
				}
				"inline" !== t.displayType ? this._surveyManager.handlePopoverSurvey(n, t) : this.renderSurvey(n, t.selector, t.properties)
			}
			cancelPendingSurvey(e) {
				Z(this._surveyManager) ? aB.warn("init was not called") : this._surveyManager.cancelSurvey(e)
			}
			handlePageUnload() {
				var e, t;
				null == (e = this._surveyManager) || null == (t = e.handlePageUnload) || t.call(e)
			}
		},
		lZ = class {
			constructor(e) {
				this._instance = e
			}
			get() {
				var e, t, i, r;
				let s = null == (e = this._instance) ? void 0 : e.config;
				return {
					disableSurveys: !!(null == s ? void 0 : s.disable_surveys),
					cookielessMode: !!(null == s ? void 0 : s.cookieless_mode),
					advancedEnableSurveys: !!(null == s ? void 0 : s.advanced_enable_surveys),
					requestTimeoutMs: null != (t = null == s ? void 0 : s.surveys_request_timeout_ms) ? t : 1e4,
					prefillFromUrl: !!(null == s || null == (i = s.surveys) ? void 0 : i.prefillFromUrl),
					automaticDisplay: !(null == s ? void 0 : s.disable_surveys_automatic_display),
					featureFlagEvaluation: !(null == s ? void 0 : s.advanced_disable_feature_flags),
					overrideLanguage: null == s ? void 0 : s.override_display_language,
					prepareStylesheet: null == s ? void 0 : s.prepare_external_dependency_stylesheet,
					get_current_url: null == s ? void 0 : s.get_current_url,
					uiHost: null == (r = this._instance) || null == (r = r.requestRouter) ? void 0 : r.endpointFor("ui", "")
				}
			}
			getExtensions() {
				let e = null == O ? void 0 : O.__PosthogExtensions__;
				if (!e || !this._instance) return;
				let t = this._instance,
					{
						generateSurveys: i,
						loadExternalDependency: r
					} = e;
				return {
					generateSurveys: i ? e => i(t, e) : void 0,
					loadExternalDependency: r ? e => r(t, "surveys", e) : void 0
				}
			}
			onMatchingConditionsChanged(e) {
				var t, i;
				let r = null == (t = this._instance) ? void 0 : t._addCaptureHook(t => {
						"$pageview" !== t && t !== ow && t !== ox && t !== ok || e()
					}),
					s = () => e();
				sF(y, "PHSurveyShown", s);
				let n = !1,
					o = null == (i = this._instance) ? void 0 : i.onFeatureFlags(() => {
						n && e()
					});
				return n = !0, () => {
					n = !1, null == r || r(), null == o || o(), null == y || y.removeEventListener("PHSurveyShown", s)
				}
			}
		};
	let lQ = (null == y ? void 0 : y.location) ? n1(y.location.hash, "__posthog") || n1(location.hash, "state") : null,
		l0 = "_postHogToolbarParams",
		l1 = rr.createLogger("[Toolbar]", void 0),
		l2 = rr.createLogger("[FeatureFlags]", void 0),
		l3 = (h = {
			debugEnabled: !0
		}, rr.createLogger("[FeatureFlags]", h)),
		l5 = "\" failed. Feature flags didn't load in time.",
		l4 = [502, 504],
		l8 = ["click", "keydown", "wheel", "touchstart", "pointerdown"],
		l6 = "connection_error",
		l9 = e => {
			let t = {};
			for (let i = 0; e.length > i; i++) t[e[i]] = !0;
			return t
		},
		l7 = e => {
			let t = {};
			for (let [i, r] of sx(e || {})) r && (t[i] = r);
			return t
		},
		ue = (e, t) => {
			var i, r;
			let s;
			return e.distinctId === t.distinctId && e.sessionId === t.sessionId && (i = e.groups, r = t.groups, (s = Object.keys(i)).length === Object.keys(r).length && s.every(e => i[e] === r[e]))
		};
	var ut = class {
		constructor(e) {
			this.name = "featureFlags", this.Pd = !1, this.featureFlagEventHandlers = [], this.R = l2, this.Od = {}, this.Fd = {}, this.Dd = [], this.Ld = new Set, this.Nd = new Set, this.jd = !1, this.qd = !1, this.Bd = 0, this.zd = !1, this.Hd = !1, this.Ud = !1, this.Wd = new Map, this.Vd = !1, this.Gd = !1, this.Qd = !1, this.Jd = 0, this.Zd = !1, this.sn = () => {
				let e = this.Kd();
				this.Jd = 0, e && this.reloadFeatureFlags()
			}, this.Yd = () => {
				var e, t;
				let i = this.Xd,
					r = null != (e = this.tv) ? e : i;
				J(i) || J(r) || this.Fr.remoteRequestsDisabled || !this.ev || "hidden" === this.ev.visibilityState || Date.now() - (null != (t = this.iv) ? t : 0) < r || (this.tv = this.Zd || !this.Fr.idleRefreshBackoff ? i : Math.min(2 * r, 36e5), this.Zd = !1, this.reloadFeatureFlags(), this.nv())
			}, this.sv = () => {
				this.Zd && this.tv === this.Xd || this.rv()
			}, this.an = () => {
				var e;
				"visible" === (null == (e = this.ev) ? void 0 : e.visibilityState) && this.rv()
			}, this.Na = e
		}
		get ov() {}
		av() {
			this.Fa && this.lv()
		}
		setup(e) {
			try {
				this.uv = typeof window > "u" ? void 0 : window, this.ev = typeof document > "u" ? void 0 : document
			} catch (e) {
				this.uv = void 0, this.ev = void 0
			}
			return this.Ja = e, this.R = e.logger.createLogger("[FeatureFlags]"), lJ(e.kv.initialize(), () => {
				this.Ja === e && (this.Ja = void 0, this.Fa = e, this.hv(e))
			})
		}
		hv(e) {
			var t;
			if (this.Fa === e) return this.uv && sF(this.uv, "online", this.sn), this.lv(), this.dv = e.registerDynamicEventProperties(() => this.vv() ? this.Od : this.Fd), this.fv = null == (t = this.ov) ? void 0 : t.onCrossTabFeatureFlagChange(() => {
				this.pv(), this.gv(), this.mv()
			}), this.gv(), this.initialize()
		}
		rv() {
			this.Zd = !0, this.tv = this.Xd, this.Yd()
		}
		lv() {
			var e;
			let t = this.Fr.refreshIntervalMs,
				i = !this.Fr.remoteRequestsDisabled && this.ev && !J(t) && t > 0 ? t : void 0;
			this.Fr.idleRefreshBackoff || (this.tv = i), i !== this.Xd && (this.yv(), J(i) || (this.Xd = i, this.tv = i, this.nv(), (null == (e = this.ev) ? void 0 : e.addEventListener) && (sF(this.ev, rE, this.an), sy(l8, e => {
				sF(this.ev, e, this.sv, {
					capture: !0
				})
			}))))
		}
		nv() {
			J(this.Xd) || (J(this.bv) || clearInterval(this.bv), this.iv = Date.now(), this.bv = setInterval(this.Yd, this.Xd))
		}
		yv() {
			var e, t;
			J(this.bv) || (clearInterval(this.bv), this.bv = void 0, null == (e = this.ev) || null == (t = e.removeEventListener) || t.call(e, "visibilitychange", this.an), sy(l8, e => {
				var t, i;
				null == (t = this.ev) || null == (i = t.removeEventListener) || i.call(t, e, this.sv, {
					capture: !0
				})
			})), this.Xd = void 0, this.tv = void 0, this.Zd = !1, this.iv = void 0
		}
		destroy() {
			this._v()
		}
		dispose() {
			this._v()
		}
		_v() {
			var e, t, i;
			this.yv(), this.Bd++, this.Hd = !1, this.Ja = void 0, this.wv(this.Ld, "cancelled"), this.wv(this.Nd, "cancelled"), this.Fa && (this.Sv(), null == (e = this.dv) || e.dispose(), this.dv = void 0, null == (t = this.fv) || t.call(this), this.fv = void 0, this.Dd = [], null == (i = this.uv) || i.removeEventListener("online", this.sn), this.Fa = void 0)
		}
		get Fr() {
			return this.Na.get()
		}
		xv(e) {
			var t;
			return this.$v && e in this.$v ? this.$v[e] : null == (t = this.Fa) ? void 0 : t.kv.get(e)
		}
		pv() {
			return !!this.$v && (this.$v = void 0, !0)
		}
		Cv() {
			var e;
			return !J(null == (e = this.Fa) ? void 0 : e.kv.get("$enabled_feature_flags")) && this.pv()
		}
		$t(e) {
			this.Tv(() => {
				var t;
				return null == (t = this.Fa) ? void 0 : t.kv.set(e)
			})
		}
		Iv(e, t, i) {
			if (!this.ov || !e.$enabled_feature_flags) return;
			let r = this.xv("$enabled_feature_flags") || {},
				s = e.$enabled_feature_flags || {},
				n = t.flags || t.featureFlags,
				o = t.flags ? Object.entries(t.flags).filter(([, e]) => !(null == e ? void 0 : e.failed)).map(([e]) => e) : [],
				a = !!t.errorsWhileComputingFlags && !!t.flags,
				l = a ? o : i && !q(n) ? Object.keys(n || {}) : Array.from(new Set([...Object.keys(r), ...Object.keys(s)])),
				u = this.xv("$feature_flag_payloads") || {},
				c = e.$feature_flag_payloads || {},
				h = a || i ? l : Array.from(new Set([...Object.keys(u), ...Object.keys(c)])),
				d = !a && !i,
				p = !!d || l,
				f = {
					[rc]: p,
					[rv]: p,
					[rw]: !!d || h
				};
			for (let t of (e.$feature_flag_details && (f[rh] = p), [rf, rp, rg])) J(e[t]) || (f[t] = !0);
			this.ov.markCrossTabFeatureFlagChanges(f)
		}
		Dt(e) {
			this.Tv(() => {
				var t;
				return null == (t = this.Fa) ? void 0 : t.kv.remove(e)
			})
		}
		Tv(e) {
			try {
				e()
			} catch (e) {
				this.R.error("Failed to update feature flag persistence", e)
			}
		}
		gv() {
			let e = {};
			for (let t of [rc, rw, rf, rx]) {
				let i = this.xv(t);
				J(i) || (e[t] = i)
			}
			this.Od = e;
			let t = tS({}, e),
				i = this.xv(rv);
			if (i)
				for (let [e, r] of Object.entries(i)) t[`$feature/${e}`] = r;
			this.Fd = t
		}
		vv() {
			let e = this.Fr.cacheTtlMs;
			if (!e || 0 >= e) return !1;
			let t = this.xv(rp);
			return "number" != typeof t || Date.now() - t > e
		}
		Mv() {
			return !!this.vv() && (this.Qd || this.qd || (this.Qd = !0, this.R.warn("Feature flag cache is stale, triggering refresh..."), this.reloadFeatureFlags()), !0)
		}
		Ev() {
			let e = this.Fr.evaluationContexts;
			return (null == e ? void 0 : e.length) ? e.filter(e => {
				let t = e && "string" == typeof e && e.trim().length > 0;
				return t || this.R.error("Invalid evaluation context found:", e, "Expected non-empty string"), t
			}) : []
		}
		Av() {
			let e = this.Fr.flagKeys;
			if (!J(e)) return e.filter(e => {
				let t = e && "string" == typeof e && e.trim().length > 0;
				return t || this.R.error("Invalid flag key found:", e, "Expected non-empty string"), t
			})
		}
		initialize() {
			var e, t, i, r;
			let s = this.Fr,
				n = null != (e = null == (t = s.bootstrap) ? void 0 : t.featureFlags) ? e : {};
			if (Object.keys(n).length) {
				let e = null != (i = null == (r = s.bootstrap) ? void 0 : r.featureFlagPayloads) ? i : {},
					t = Object.keys(n).filter(e => !J(n[e])).reduce((e, t) => (e[t] = n[t], e), {}),
					o = Object.keys(e).filter(e => t[e]).reduce((t, i) => (t[i] = e[i], t), {});
				return this.Rv({
					featureFlags: t,
					featureFlagPayloads: o
				}, void 0, {
					persist: !1
				})
			}
		}
		updateFlags(e, t, i) {
			var r, s;
			let n = (null == i ? void 0 : i.merge) && null != (r = this.xv("$enabled_feature_flags")) ? r : {},
				o = (null == i ? void 0 : i.merge) && null != (s = this.xv("$feature_flag_payloads")) ? s : {},
				a = tS(tS({}, n), e),
				l = tS(tS({}, o), t),
				u = {};
			for (let [e, t] of Object.entries(a)) u[e] = {
				key: e,
				enabled: t6(t),
				variant: t9(t),
				reason: void 0,
				metadata: J(null == l ? void 0 : l[e]) ? void 0 : {
					id: 0,
					version: void 0,
					description: void 0,
					payload: l[e]
				}
			};
			this.Rv({
				flags: u
			})
		}
		get hasLoadedFlags() {
			return this.jd
		}
		getFlags() {
			return Object.keys(this.getFlagVariants())
		}
		getFlagsWithDetails() {
			let e = this.xv(rh),
				t = this.xv(rx),
				i = this.xv(rk);
			if (!i && !t) return e || {};
			let r = sw({}, e || {});
			for (let e of [...new Set([...Object.keys(i || {}), ...Object.keys(t || {})])]) {
				var s, n;
				let o = r[e],
					a = null == t ? void 0 : t[e],
					l = J(a) ? null != (s = null == o ? void 0 : o.enabled) && s : !!a,
					u = J(a) ? null == o ? void 0 : o.variant : "string" == typeof a ? a : void 0,
					c = null == i ? void 0 : i[e],
					h = tS(tS({}, o), {}, {
						enabled: l,
						variant: l ? null != u ? u : null == o ? void 0 : o.variant : void 0
					});
				l !== (null == o ? void 0 : o.enabled) && (h.original_enabled = null == o ? void 0 : o.enabled), u !== (null == o ? void 0 : o.variant) && (h.original_variant = null == o ? void 0 : o.variant), c && (h.metadata = tS(tS({}, null == o ? void 0 : o.metadata), {}, {
					payload: c,
					original_payload: null == o || null == (n = o.metadata) ? void 0 : n.payload
				})), r[e] = h
			}
			return this.Pd || (this.R.warn(" Overriding feature flag details!", {
				flagDetails: e,
				overriddenPayloads: i,
				finalDetails: r
			}), this.Pd = !0), r
		}
		getAllFeatureFlags() {
			let e = this.getFlagVariants(),
				t = this.getFlagPayloads();
			return Object.keys(e).map(i => {
				let r = e[i];
				return {
					key: i,
					enabled: t6(r),
					variant: t9(r),
					payload: t8(t[i])
				}
			})
		}
		getFlagVariants() {
			let e = this.xv(rv),
				t = this.xv(rx);
			if (!t) return e || {};
			let i = sw({}, e || {}),
				r = Object.keys(t);
			for (let e = 0; r.length > e; e++) i[r[e]] = t[r[e]];
			return this.Pd || (this.R.warn(" Overriding feature flags!", {
				enabledFlags: e,
				overriddenFlags: t,
				finalFlags: i
			}), this.Pd = !0), i
		}
		getFlagPayloads() {
			let e = this.xv(rw),
				t = this.xv(rk);
			if (!t) return e || {};
			let i = sw({}, e || {}),
				r = Object.keys(t);
			for (let e = 0; r.length > e; e++) i[r[e]] = t[r[e]];
			return this.Pd || (this.R.warn(" Overriding feature flag payloads!", {
				flagPayloads: e,
				overriddenPayloads: t,
				finalPayloads: i
			}), this.Pd = !0), i
		}
		reloadFeatureFlags() {
			this.zd || this.Fr.featureFlagsDisabled || this.Kd() || (this.Ud && this.R.warn("reloadFeatureFlags() was called inside an onFeatureFlags callback. This callback also runs when flags change in other tabs, so this can cause a request loop."), this.qd && (this.Hd = !0), this.Pv || (this.Dd.slice().forEach(e => {
				try {
					e()
				} catch (e) {
					this.R.error("Error while running feature flags reloading callback", e)
				}
			}), this.Pv = setTimeout(() => {
				this.Ov()
			}, 5)))
		}
		reloadFeatureFlagsAsync() {
			return !this.Fa || this.zd || this.Fr.featureFlagsDisabled || this.Fr.remoteRequestsDisabled || this.Kd() ? Promise.resolve({
				status: "skipped"
			}) : new Promise(e => {
				this.Ld.add(e), this.reloadFeatureFlags()
			})
		}
		wv(e, t) {
			e.forEach(e => e({
				status: t
			})), e.clear()
		}
		Sv() {
			clearTimeout(this.Pv), this.Pv = void 0
		}
		onReloading(e) {
			return this.Dd.push(e), () => {
				this.Dd = this.Dd.filter(t => t !== e)
			}
		}
		ensureFlagsLoaded() {
			this.jd || this.qd || this.Pv || this.reloadFeatureFlags()
		}
		setAnonymousDistinctId(e) {
			this.$anon_distinct_id = e
		}
		setReloadingPaused(e) {
			this.zd = e
		}
		resetFlagCallReported() {
			this.Dt(ry), this.Wd = new Map
		}
		sendFlagCallsPendingCapture() {
			var e;
			if (0 !== this.Wd.size && !this.Vd && (null == (e = this.Fa) ? void 0 : e.canCapture) && !this.Fa.isRateLimited) {
				this.Vd = !0;
				try {
					let e = this.getFlagVariants();
					for (let t of Array.from(this.Wd.keys())) {
						let i = this.Wd.get(t);
						if (i) {
							if (i.value !== String(e[t]) || !ue(i.context, this.Fv())) {
								this.Wd.delete(t);
								continue
							}
							if (this.getFeatureFlagResult(t), this.Wd.has(t)) break
						}
					}
				} finally {
					this.Vd = !1
				}
			}
		}
		Ov(e) {
			var t;
			this.Sv();
			let i = this.Fa;
			if (!i || this.Fr.remoteRequestsDisabled || this.Kd()) return void this.wv(this.Ld, "skipped");
			if (this.qd) return void(this.Hd = !0);
			let r = {
				token: i.projectToken,
				distinct_id: i.distinctId,
				groups: i.groups,
				$anon_distinct_id: this.$anon_distinct_id,
				person_properties: tS(tS(tS({}, i.initialPersonProperties), this.xv("$stored_person_properties") || {}), {}, {
					$lib: i.library.name,
					$lib_version: i.library.version
				}),
				group_properties: this.xv(r_),
				timezone: nV()
			};
			J(i.deviceId) || (r.$device_id = i.deviceId), ((null == e ? void 0 : e.disableFlags) || this.Fr.featureFlagsDisabled) && (r.disable_flags = !0);
			let s = this.Ev();
			s.length && (r.evaluation_contexts = s);
			let n = this.Av();
			J(n) || (r.flag_keys = n);
			let o = this.Fr.onlyEvaluateSurveyFeatureFlags,
				a = "/flags/?v=2" + (o ? "&only_evaluate_survey_feature_flags=true" : ""),
				l = this.Bd,
				u = this.Ld;
			this.Ld = new Set, this.Nd = u, this.qd = !0;
			let c = () => {
					this.Hd && (this.Hd = !1, this.Ov())
				},
				h = e => {
					var t, i;
					let s = null != (t = e.json) ? t : {},
						n = 200 !== e.statusCode;
					if (this.qd = !1, l !== this.Bd) return void c();
					if (this.Dv(e.statusCode), n || this.Hd || (this.$anon_distinct_id = void 0), r.disable_flags && !this.Hd) return void this.wv(u, "skipped");
					this.Gd = !n;
					let a = [];
					e.error ? a.push(e.error instanceof Error && "AbortError" === e.error.name ? "timeout" : e.error instanceof Error ? l6 : "unknown_error") : 200 !== e.statusCode && a.push(`api_error_${e.statusCode}`), s.errorsWhileComputingFlags && a.push("errors_while_computing_flags");
					let h = !!(null == (i = s.quotaLimited) ? void 0 : i.includes("feature_flags"));
					h && a.push("quota_limited"), this.$t({
						[rd]: a
					}), h ? this.R.warn("You have hit your feature flags quota limit, and will not be able to load feature flags until the quota is reset.  Please visit https://posthog.com/docs/billing/limits-alerts to learn more.") : r.disable_flags || this.Rv(s, n, {
						partialResponse: o
					}), this.wv(u, r.disable_flags ? "skipped" : !a.length && (s.flags || s.featureFlags) ? "loaded" : "error"), c()
				},
				d = e => {
					this.qd = !1, l === this.Bd && (this.$t({
						[rd]: [l6]
					}), this.R.error("Feature flag request failed", e), this.Cv() && this.mv(!0), this.wv(u, "error")), c()
				},
				p = null != (t = this.Fr.requestMaxRetries) ? t : 1,
				f = () => p > 0 && l === this.Bd,
				g = () => {
					if (l !== this.Bd || !this.Fa || this.Fr.remoteRequestsDisabled) return this.qd = !1, this.wv(u, "skipped"), void c();
					try {
						i.sendRequest(a, {
							target: "flags",
							method: "POST",
							body: r,
							compression: this.Fr.compression,
							sentAt: "body",
							timeoutMs: this.Fr.requestTimeoutMs
						}).then(e => {
							(l4.includes(e.statusCode) || 0 === e.statusCode && e.error instanceof Error && "AbortError" === e.error.name) && f() ? (p--, setTimeout(g, 500)) : h(e)
						}).catch(d)
					} catch (e) {
						d(e)
					}
				};
			g()
		}
		Kd() {
			return nY(this.Jd, 3)
		}
		Dv(e) {
			this.Jd = nX(e, this.Jd, 3, () => this.R.warn("Feature flag requests are failing before receiving an HTTP response; this can happen due to network issues, CORS, browser blocking, or ad blockers. Stopped refreshing feature flags; will try again when connectivity changes."))
		}
		getFeatureFlag(e, t = {}) {
			var i;
			if (t.fresh && !this.Gd) return;
			if (!(this.jd || this.getFlags() && this.getFlags().length > 0)) return void this.R.warn('getFeatureFlag for key "' + e + l5);
			if (this.Mv()) return;
			let r = this.getFeatureFlagResult(e, t);
			return null != (i = null == r ? void 0 : r.variant) ? i : null == r ? void 0 : r.enabled
		}
		getFeatureFlagDetails(e) {
			return this.getFlagsWithDetails()[e]
		}
		getFeatureFlagPayload(e) {
			let t = this.getFeatureFlagResult(e, {
				send_event: !1
			});
			return null == t ? void 0 : t.payload
		}
		getFeatureFlagResult(e, t = {}) {
			var i, r, s, n, o, a, l, u, c, h, d, p, f, g, v, _, m, y;
			if (t.fresh && !this.Gd) return;
			if (!(this.jd || this.getFlags() && this.getFlags().length > 0)) return void this.R.warn('getFeatureFlagResult for key "' + e + l5);
			if (this.Mv()) return;
			let b = this.getFlagVariants(),
				w = e in b,
				x = b[e],
				k = this.getFlagPayloads()[e],
				E = String(x),
				S = this.xv("$feature_flag_request_id") || void 0,
				$ = this.xv("$feature_flag_evaluated_at") || void 0,
				F, P = this.xv("$flag_call_reported") || {};
			if (this.Fr.deduplicateCallsPerSession) {
				let e = null == (i = this.Fa) || null == (i = i.session) ? void 0 : i.sessionId,
					t = this.xv(rb);
				e && e !== t && (P = {}, F = e)
			}
			if (!t.send_event && "send_event" in t) F && this.$t({
				[ry]: P,
				[rb]: F
			});
			else {
				let t = !(null == (r = this.Fa) ? void 0 : r.canCapture),
					i = !t && !(null == (s = this.Fa) ? void 0 : s.isRateLimited);
				if (i ? this.Wd.delete(e) : (t && Object.keys(P).length > 0 && (P = {}, this.$t({
						[ry]: P
					})), (null == (o = P[e]) ? void 0 : o.includes(E)) || this.Lv(e, E)), !i || (null == (n = P[e]) ? void 0 : n.includes(E))) F && this.$t({
					[ry]: P,
					[rb]: F
				});
				else {
					q(P[e]) ? P[e].push(E) : P[e] = [E], this.$t(tS({
						[ry]: P
					}, F ? {
						[rb]: F
					} : {}));
					let t = this.getFeatureFlagDetails(e),
						i = [...null != (a = this.xv("$feature_flag_errors")) ? a : []];
					J(x) && i.push("flag_missing");
					let r = {
						$feature_flag: e,
						$feature_flag_response: x,
						$feature_flag_payload: null != k ? k : null,
						$feature_flag_request_id: S,
						$feature_flag_evaluated_at: $,
						$feature_flag_bootstrapped_response: null != (l = null == (u = this.Fr.bootstrap) || null == (u = u.featureFlags) ? void 0 : u[e]) ? l : null,
						$feature_flag_bootstrapped_payload: null != (c = null == (h = this.Fr.bootstrap) || null == (h = h.featureFlagPayloads) ? void 0 : h[e]) ? c : null,
						$used_bootstrap_value: !this.Gd
					};
					J(null == t || null == (d = t.metadata) ? void 0 : d.has_experiment) || (r.$feature_flag_has_experiment = t.metadata.has_experiment), J(null == t || null == (p = t.metadata) ? void 0 : p.version) || (r.$feature_flag_version = t.metadata.version);
					let s = null != (f = null == t || null == (g = t.reason) ? void 0 : g.description) ? f : null == t || null == (v = t.reason) ? void 0 : v.code;
					s && (r.$feature_flag_reason = s), (null == t || null == (_ = t.metadata) ? void 0 : _.id) && (r.$feature_flag_id = t.metadata.id), J(null == t ? void 0 : t.original_variant) && J(null == t ? void 0 : t.original_enabled) || (r.$feature_flag_original_response = J(t.original_variant) ? t.original_enabled : t.original_variant), (null == t || null == (m = t.metadata) ? void 0 : m.original_payload) && (r.$feature_flag_original_payload = null == t || null == (y = t.metadata) ? void 0 : y.original_payload), i.length && (r.$feature_flag_error = i.join(",")), this.Nv(r) || (this.jv(e, E), this.Lv(e, E))
				}
			}
			return w ? {
				key: e,
				enabled: !!x,
				variant: "string" == typeof x ? x : void 0,
				payload: t8(k)
			} : void 0
		}
		Nv(e) {
			try {
				var t;
				return !1 !== (null == (t = this.Fa) ? void 0 : t.capture("$feature_flag_called", e))
			} catch (e) {
				return this.R.error("Failed to capture feature flag call", e), !0
			}
		}
		Lv(e, t) {
			this.Wd.set(e, {
				value: t,
				context: this.Fv()
			})
		}
		Fv() {
			var e, t, i;
			return {
				distinctId: null == (e = this.Fa) ? void 0 : e.distinctId,
				groups: tS({}, null == (t = this.Fa) ? void 0 : t.groups),
				sessionId: this.Fr.deduplicateCallsPerSession ? null == (i = this.Fa) || null == (i = i.session) ? void 0 : i.sessionId : void 0
			}
		}
		jv(e, t) {
			let i = this.xv("$flag_call_reported") || {},
				r = i[e];
			q(r) && r.includes(t) && (i[e] = r.filter(e => e !== t), this.$t({
				[ry]: i
			}))
		}
		getRemoteConfigPayload(e, t) {
			this.qv(e, t)
		}
		qv(e, t) {
			var i = this;
			return ed(function*() {
				let r, s = i.Fa;
				if (!s) return;
				let n = {
						distinct_id: s.distinctId,
						token: s.projectToken,
						person_properties: {
							$lib: s.library.name,
							$lib_version: s.library.version
						}
					},
					o = i.Ev();
				o.length && (n.evaluation_contexts = o);
				let a = i.Av();
				J(a) || (n.flag_keys = a);
				try {
					var l;
					let t = null == (l = (yield s.sendRequest("/flags/?v=2", {
						target: "flags",
						method: "POST",
						body: n,
						compression: i.Fr.compression,
						sentAt: "body",
						timeoutMs: i.Fr.requestTimeoutMs
					})).json) ? void 0 : l.featureFlagPayloads;
					r = (null == t ? void 0 : t[e]) || void 0
				} catch (e) {
					return void i.R.error("Remote config feature flag request failed", e)
				}
				try {
					t(r)
				} catch (e) {
					i.R.error("Remote config feature flag callback failed", e)
				}
			})()
		}
		isFeatureEnabled(e, t = {}) {
			if (t.fresh && !this.Gd) return t.defaultValue;
			if (!(this.jd || this.getFlags() && this.getFlags().length > 0)) return this.R.warn('isFeatureEnabled for key "' + e + l5), t.defaultValue;
			let i = this.getFeatureFlag(e, t);
			return J(i) ? t.defaultValue : !!i
		}
		addFeatureFlagsHandler(e) {
			this.featureFlagEventHandlers.push(e)
		}
		removeFeatureFlagsHandler(e) {
			this.featureFlagEventHandlers = this.featureFlagEventHandlers.filter(t => t !== e)
		}
		receivedFeatureFlags(e, t, i) {
			this.Rv(e, t, i)
		}
		Rv(e, t, i) {
			if (!this.Fa) return;
			this.jd = !0;
			let r = ((e, t = {}, i = {}, r = {}, s, n = l2) => {
				let o = ((e, t) => {
						let i = e.flags;
						if (i) {
							let t = Object.fromEntries(Object.keys(i).map(e => {
									var t;
									return [e, null != (t = i[e].variant) ? t : i[e].enabled]
								})),
								r = Object.fromEntries(Object.keys(i).filter(e => i[e].enabled).filter(e => {
									var t;
									return !J(null == (t = i[e].metadata) ? void 0 : t.payload)
								}).map(e => {
									var t;
									return [e, null == (t = i[e].metadata) ? void 0 : t.payload]
								}));
							return tS(tS({}, e), {}, {
								featureFlags: t,
								featureFlagPayloads: r
							})
						}
						return e.featureFlags && t.warn("Using an older version of the feature flags endpoint. Please upgrade your PostHog server to the latest version"), e
					})(e, n),
					a = o.flags,
					l = o.featureFlags,
					u = o.featureFlagPayloads;
				if (!l) return;
				let c = e.requestId,
					h = e.evaluatedAt;
				if (q(l)) {
					n.warn("v1 of the feature flags endpoint is deprecated. Please use the latest version.");
					let e = {};
					if (l)
						for (let t = 0; l.length > t; t++) e[l[t]] = !0;
					return {
						[rc]: l,
						[rv]: e,
						[rg]: !1
					}
				}
				let d = l,
					p = u,
					f = a;
				if (null == s ? void 0 : s.partialResponse) {
					let e = Object.keys(d),
						s = p || {};
					d = tS(tS({}, t), d), p = tS(tS({}, i), s), e.forEach(e => {
						e in s || null == p || delete p[e]
					}), f = tS(tS({}, r), f)
				} else if (e.errorsWhileComputingFlags)
					if (a) {
						let e = new Set(Object.keys(a).filter(e => {
							var t;
							return !(null == (t = a[e]) ? void 0 : t.failed)
						}));
						d = tS(tS({}, t), Object.fromEntries(Object.entries(d).filter(([t]) => e.has(t))));
						let s = Object.fromEntries(Object.entries(p || {}).filter(([t]) => e.has(t)));
						p = tS(tS({}, i), s), e.forEach(e => {
							e in s || null == p || delete p[e]
						}), f = tS(tS({}, r), Object.fromEntries(Object.entries(f || {}).filter(([t]) => e.has(t))))
					} else d = tS(tS({}, t), d), p = tS(tS({}, i), p), f = tS(tS({}, r), f);
				return tS(tS({
					[rc]: Object.keys(l7(d)),
					[rv]: d || {},
					[rw]: p || {},
					[rh]: f || {},
					[rg]: !0 === e.minimalFlagCalledEvents
				}, c ? {
					[rf]: c
				} : {}), h ? {
					[rp]: h
				} : {})
			})(e, this.getFlagVariants(), this.getFlagPayloads(), this.getFlagsWithDetails(), i, this.R);
			if (r)
				if (!1 === (null == i ? void 0 : i.persist)) {
					let e = !J(this.Fa.kv.get(rv));
					this.$v = r, e || this.$t(r)
				} else this.pv(), this.Iv(r, e, !!(null == i ? void 0 : i.partialResponse)), this.$t(r);
			else t && this.Cv();
			t || (this.Qd = !1), this.mv(t)
		}
		override(e, t = !1) {
			this.R.warn("override is deprecated. Please use overrideFeatureFlags instead."), this.overrideFeatureFlags({
				flags: e,
				suppressWarning: t
			})
		}
		overrideFeatureFlags(e) {
			this.Bv(e)
		}
		Bv(e) {
			if (this.Fa) {
				if (!1 === e) return this.Dt([rx, rk]), this.mv(), void l3.info("All overrides cleared");
				if (q(e)) return this.$t({
					[rx]: l9(e)
				}), this.mv(), void l3.info("Flag overrides set", {
					flags: e
				});
				if (e && "object" == typeof e && ("flags" in e || "payloads" in e)) {
					var t;
					this.Pd = !!(null != (t = e.suppressWarning) && t);
					let i = {},
						r = e.flags,
						s = e.payloads;
					return r && (i[rx] = q(r) ? l9(r) : r), s && (i[rk] = s), Object.keys(i).length && this.$t(i), !1 === r && !1 === s ? this.Dt([rx, rk]) : !1 === r ? this.Dt(rx) : !1 === s && this.Dt(rk), this.mv(), !1 === r ? l3.info("Flag overrides cleared") : r && l3.info("Flag overrides set", {
						flags: r
					}), void(!1 === s ? l3.info("Payload overrides cleared") : s && l3.info("Payload overrides set", {
						payloads: s
					}))
				}
				if (e && "object" == typeof e) return this.$t({
					[rx]: e
				}), this.mv(), void l3.info("Flag overrides set", {
					flags: e
				});
				this.R.warn("Invalid overrideOptions provided to overrideFeatureFlags", {
					overrideOptions: e
				})
			} else this.R.warn("posthog.featureFlags.overrideFeatureFlags called before feature flags were ready")
		}
		onFeatureFlags(e) {
			if (this.addFeatureFlagsHandler(e), this.jd) {
				let {
					flags: t,
					flagVariants: i
				} = this.zv();
				try {
					e(t, i)
				} catch (e) {
					this.R.error("Error while running feature flags callback", e)
				}
			}
			return () => this.removeFeatureFlagsHandler(e)
		}
		updateEarlyAccessFeatureEnrollment(e, t, i) {
			var r, s;
			let n = (this.xv("$early_access_features") || []).find(t => t.flagKey === e),
				o = {
					[`$feature_enrollment/${e}`]: t
				},
				a = {
					$feature_flag: e,
					$feature_enrollment: t,
					$set: o
				};
			n && (a.$early_access_feature_name = n.name), i && (a.$feature_enrollment_stage = i);
			let l = tS(tS({}, this.getFlagVariants()), {}, {
				[e]: t
			});
			null == (r = this.ov) || r.markCrossTabFeatureFlagChanges({
				$active_feature_flags: [e],
				$enabled_feature_flags: [e],
				$stored_person_properties: Object.keys(o)
			}), this.$t({
				[rc]: Object.keys(l7(l)),
				[rv]: l,
				[rm]: tS(tS({}, this.xv("$stored_person_properties") || {}), o)
			}), this.mv();
			try {
				null == (s = this.Fa) || s.capture("$feature_enrollment_update", a)
			} catch (e) {
				this.R.error("Failed to capture early access feature enrollment", e)
			}
		}
		getEarlyAccessFeatures(e, t = !1, i) {
			let r = this.xv(ru);
			!r || t ? this.Hv(e, i) : e(r)
		}
		Hv(e, t) {
			var i = this;
			return ed(function*() {
				let r, s = i.Fa;
				if (!s) return;
				let n = t ? `&${t.map(e=>`stage=${e}`).join("&")}` : "";
				try {
					let e = yield s.sendRequest(`/api/early_access_features/?token=${s.projectToken}${n}`, {
						target: "api",
						method: "GET",
						sentAt: "query"
					});
					if (!e.json) return;
					r = e.json.earlyAccessFeatures, i.$t({
						[ru]: r
					})
				} catch (e) {
					return void i.R.error("Early access feature request failed", e)
				}
				try {
					e(r)
				} catch (e) {
					i.R.error("Early access feature callback failed", e)
				}
			})()
		}
		zv() {
			let e = this.getFlags(),
				t = this.getFlagVariants();
			return {
				flags: e.filter(e => t[e]),
				flagVariants: Object.keys(t).filter(e => t[e]).reduce((e, i) => (e[i] = t[i], e), {})
			}
		}
		mv(e) {
			this.gv();
			let {
				flags: t,
				flagVariants: i
			} = this.zv(), r = this.Ud;
			this.Ud = !0, this.featureFlagEventHandlers.forEach(r => {
				try {
					r(t, i, {
						errorsLoading: e
					})
				} catch (e) {
					this.R.error("Error while running feature flags callback", e)
				}
			}), this.Ud = r
		}
		setPersonPropertiesForFlags(e, t = !0) {
			this.Uv(e, t)
		}
		Uv(e, t = !0) {
			let i = this.xv("$stored_person_properties") || {},
				r = (null == e ? void 0 : e.$set) || ((null == e ? void 0 : e.$set_once) ? {} : e),
				s = null == e ? void 0 : e.$set_once,
				n = {};
			if (s)
				for (let e in s)({}).hasOwnProperty.call(s, e) && (e in i || (n[e] = s[e]));
			this.$t({
				[rm]: tS(tS(tS({}, i), n), r)
			}), t && this.reloadFeatureFlags()
		}
		unsetPersonPropertiesForFlags(e, t = !0) {
			let i = tS({}, this.xv("$stored_person_properties") || {});
			e.forEach(e => {
				delete i[e]
			}), this.$t({
				[rm]: i
			}), t && this.reloadFeatureFlags()
		}
		resetPersonPropertiesForFlags(e = !0) {
			this.Dt(rm), e && this.reloadFeatureFlags()
		}
		setGroupPropertiesForFlags(e, t = !0) {
			let i = this.xv("$stored_group_properties") || {},
				r = tS({}, i);
			for (let t of Object.keys(e)) r[t] = tS(tS({}, i[t]), e[t]);
			this.$t({
				[r_]: r
			}), t && this.reloadFeatureFlags()
		}
		resetGroupPropertiesForFlags(e) {
			if (e) {
				let t = this.xv("$stored_group_properties") || {};
				this.$t({
					[r_]: tS(tS({}, t), {}, {
						[e]: {}
					})
				})
			} else this.Dt(r_)
		}
		reset() {
			this.Bd++, this.wv(this.Ld, "cancelled"), this.wv(this.Nd, "cancelled"), this.Hd = !1, this.Od = {}, this.Fd = {}, this.$v = void 0, this.jd = !1, this.zd = !1, this.Gd = !1, this.$anon_distinct_id = void 0, this.Sv(), this.Pd = !1, this.Jd = 0, this.Wd = new Map
		}
	};
	let ui = rr.createLogger("[FeatureFlags]", void 0);
	var ur = class {
			constructor(e, t = !1) {
				this.Wv = !1, this.update(e, t)
			}
			update(e, t) {
				var i, r, s, n, o, a, l, u;
				this.Vv = {
					bootstrap: {
						featureFlags: null != (i = null == (r = e.bootstrap) ? void 0 : r.featureFlags) ? i : void 0,
						featureFlagPayloads: null != (s = null == (n = e.bootstrap) ? void 0 : n.featureFlagPayloads) ? s : void 0
					},
					remoteRequestsDisabled: t,
					featureFlagsDisabled: !!e.advanced_disable_feature_flags,
					onlyEvaluateSurveyFeatureFlags: !!e.advanced_only_evaluate_survey_feature_flags,
					deduplicateCallsPerSession: !!e.advanced_feature_flags_dedup_per_session,
					cacheTtlMs: e.feature_flag_cache_ttl_ms,
					refreshIntervalMs: null != (o = e.remote_config_refresh_interval_ms) ? o : 3e5,
					idleRefreshBackoff: J(e.remote_config_refresh_interval_ms),
					requestTimeoutMs: e.feature_flag_request_timeout_ms,
					requestMaxRetries: Math.max(0, null != (a = e.feature_flag_request_max_retries) ? a : 1),
					compression: e.disable_compression ? void 0 : "best-available",
					evaluationContexts: null != (l = null != (u = e.evaluation_contexts) ? u : e.evaluation_environments) ? l : [],
					flagKeys: q(e.flag_keys) ? e.flag_keys : void 0
				}, !e.evaluation_environments || e.evaluation_contexts || this.Wv || (ui.warn("evaluation_environments is deprecated. Use evaluation_contexts instead. evaluation_environments will be removed in a future version."), this.Wv = !0), J(e.flag_keys) || q(e.flag_keys) || ui.error("Invalid flag_keys found:", e.flag_keys, "Expected array of non-empty strings")
			}
			get() {
				return this.Vv
			}
		},
		us = class extends ut {
			constructor(e) {
				let t = new ur(e.config, e.lc());
				super(t), this.name = a4, this._instance = e, this.Gv = t
			}
			get ov() {
				return this._instance.persistence
			}
			updateConfig(e, t) {
				this.Gv.update(e, t), this.av()
			}
		};
	let un = e => eo(e) && ("RangeError" === e.name && 0 === e.message.indexOf("Maximum call stack size exceeded") || "InternalError" === e.name && "too much recursion" === e.message),
		uo = rr.createLogger("[Error tracking]", void 0),
		ua = "webkit-masked-url:",
		ul = [{
			value: "isolatedAPI.contexts.topHostname",
			exact: !1
		}, {
			value: "No response from target",
			exact: !0
		}],
		uu = ["chrome-extension://", "moz-extension://", "safari-extension:", "safari-web-extension:", ua],
		uc = ["__firefox__", "__gCrWeb"];

	function uh(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var i = 0, r = Array(t); t > i; i++) r[i] = e[i];
		return r
	}
	let ud = Object.entries,
		up = Object.setPrototypeOf,
		uf = Object.isFrozen,
		ug = Object.getPrototypeOf,
		uv = Object.getOwnPropertyDescriptor,
		u_ = Object.freeze,
		um = Object.seal,
		uy = Object.create,
		ub = "u" > typeof Reflect && Reflect,
		uw = ub.apply,
		ux = ub.construct;
	u_ || (u_ = function(e) {
		return e
	}), um || (um = function(e) {
		return e
	}), uw || (uw = function(e, t) {
		for (var i = arguments.length, r = Array(i > 2 ? i - 2 : 0), s = 2; i > s; s++) r[s - 2] = arguments[s];
		return e.apply(t, r)
	}), ux || (ux = function(e) {
		for (var t = arguments.length, i = Array(t > 1 ? t - 1 : 0), r = 1; t > r; r++) i[r - 1] = arguments[r];
		return new e(...i)
	});
	let uk = uB([].forEach),
		uE = uB([].lastIndexOf),
		uS = uB([].pop),
		u$ = uB([].push),
		uF = uB([].splice),
		uP = Array.isArray,
		uT = uB("".toLowerCase),
		uO = uB("".toString),
		uI = uB("".match),
		uR = uB("".replace),
		uC = uB("".indexOf),
		uM = uB("".trim),
		uA = uB(0..toString),
		uL = uB(Boolean.prototype.toString),
		uD = "u" < typeof BigInt ? null : uB(BigInt.prototype.toString),
		uN = "u" < typeof Symbol ? null : uB(Symbol.prototype.toString),
		uj = uB({}.hasOwnProperty),
		uz = uB({}.toString),
		uH = uB(/t/.test),
		uU = (_ = TypeError, function() {
			for (var e = arguments.length, t = Array(e), i = 0; e > i; i++) t[i] = arguments[i];
			return ux(_, t)
		});

	function uB(e) {
		return function(t) {
			t instanceof RegExp && (t.lastIndex = 0);
			for (var i = arguments.length, r = Array(i > 1 ? i - 1 : 0), s = 1; i > s; s++) r[s - 1] = arguments[s];
			return uw(e, t, r)
		}
	}

	function uq(e, t) {
		let i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : uT;
		if (up && up(e, null), !uP(t)) return e;
		let r = t.length;
		for (; r--;) {
			let s = t[r];
			if ("string" == typeof s) {
				let e = i(s);
				e !== s && (uf(t) || (t[r] = e), s = e)
			}
			e[s] = !0
		}
		return e
	}

	function uG(e) {
		let t = uy(null);
		for (let r of ud(e)) {
			var i = function(e) {
				if (Array.isArray(e)) return e
			}(r) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var i, r, s, n, o = [],
						a = !0,
						l = !1;
					try {
						s = (t = t.call(e)).next, !1;
						for (; !(a = (i = s.call(t)).done) && (o.push(i.value), 2 !== o.length); a = !0);
					} catch (e) {
						l = !0, r = e
					} finally {
						try {
							if (!a && null != t.return && (n = t.return(), Object(n) !== n)) return
						} finally {
							if (l) throw r
						}
					}
					return o
				}
			}(r) || function(e) {
				if (e) {
					if ("string" == typeof e) return uh(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? uh(e, 2) : void 0
				}
			}(r) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}();
			let s = i[0],
				n = i[1];
			uj(e, s) && (t[s] = uP(n) ? function(e) {
				for (let t = 0; e.length > t; t++) uj(e, t) || (e[t] = null);
				return e
			}(n) : n && "object" == typeof n && n.constructor === Object ? uG(n) : n)
		}
		return t
	}

	function uW(e, t) {
		for (; null !== e;) {
			let i = uv(e, t);
			if (i) {
				if (i.get) return uB(i.get);
				if ("function" == typeof i.value) return uB(i.value)
			}
			e = ug(e)
		}
		return function() {
			return null
		}
	}
	let uV = u_(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]),
		uJ = u_(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]),
		uK = u_(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]),
		uY = u_(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]),
		uX = u_(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]),
		uZ = u_(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]),
		uQ = u_(["#text"]),
		u0 = u_(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]),
		u1 = u_(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]),
		u2 = u_(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]),
		u3 = u_(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]),
		u5 = um(/{{[\w\W]*|^[\w\W]*}}/g),
		u4 = um(/<%[\w\W]*|^[\w\W]*%>/g),
		u8 = um(/\${[\w\W]*/g),
		u6 = um(/^data-[\-\w.\u00B7-\uFFFF]+$/),
		u9 = um(/^aria-[\-\w]+$/),
		u7 = um(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),
		ce = um(/^(?:\w+script|data):/i),
		ct = um(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
		ci = um(/^html$/i),
		cr = um(/^[a-z][.\w]*(-[.\w]+)+$/i),
		cs = um(/<[/\w!]/g),
		cn = um(/<[/\w]/g),
		co = um(/<\/no(script|embed|frames)/i),
		ca = um(/\/>/i),
		cl = function(e, t, i, r) {
			return uj(e, t) && uP(e[t]) ? uq(r.base ? uG(r.base) : {}, e[t], r.transform) : i
		};
	var cu = function e() {
		let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "u" < typeof window ? null : window,
			i = t => e(t);
		if (i.version = "3.4.13", i.removed = [], !t || !t.document || 9 !== t.document.nodeType || !t.Element) return i.isSupported = !1, i;
		let r = t.document,
			s = r,
			n = s.currentScript,
			o = t.HTMLTemplateElement,
			a = t.Node,
			l = t.NodeFilter,
			u = t.DOMParser,
			c = t.trustedTypes,
			h = t.Element.prototype,
			d = uW(h, "cloneNode"),
			p = uW(h, "remove"),
			f = uW(h, "nextSibling"),
			g = uW(h, "childNodes"),
			v = uW(h, "parentNode"),
			_ = uW(h, "shadowRoot"),
			m = uW(h, "attributes"),
			y = a && a.prototype ? uW(a.prototype, "nodeType") : null,
			b = a && a.prototype ? uW(a.prototype, "nodeName") : null,
			w = a && a.prototype ? uW(a.prototype, "ownerDocument") : null;
		if ("function" == typeof o) {
			let e = r.createElement("template");
			e.content && e.content.ownerDocument && (r = e.content.ownerDocument)
		}
		let x, k, E = "",
			S = !1,
			$ = 0,
			F = function() {
				if ($ > 0) throw uU('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.')
			},
			P = function(e) {
				F(), $++;
				try {
					return x.createHTML(e)
				} finally {
					$--
				}
			},
			T = r.implementation,
			O = r.createNodeIterator,
			I = r.createDocumentFragment,
			R = r.getElementsByTagName,
			C = s.importNode,
			M = {
				afterSanitizeAttributes: [],
				afterSanitizeElements: [],
				afterSanitizeShadowDOM: [],
				beforeSanitizeAttributes: [],
				beforeSanitizeElements: [],
				beforeSanitizeShadowDOM: [],
				uponSanitizeAttribute: [],
				uponSanitizeElement: [],
				uponSanitizeShadowNode: []
			};
		i.isSupported = "function" == typeof ud && "function" == typeof v && T && void 0 !== T.createHTMLDocument;
		let A = u7,
			L = null,
			D = uq({}, [...uV, ...uJ, ...uK, ...uX, ...uQ]),
			N = null,
			j = uq({}, [...u0, ...u1, ...u2, ...u3]),
			z = Object.seal(uy(null, {
				tagNameCheck: {
					writable: !0,
					configurable: !1,
					enumerable: !0,
					value: null
				},
				attributeNameCheck: {
					writable: !0,
					configurable: !1,
					enumerable: !0,
					value: null
				},
				allowCustomizedBuiltInElements: {
					writable: !0,
					configurable: !1,
					enumerable: !0,
					value: !1
				}
			})),
			H = null,
			U = null,
			B = Object.seal(uy(null, {
				tagCheck: {
					writable: !0,
					configurable: !1,
					enumerable: !0,
					value: null
				},
				attributeCheck: {
					writable: !0,
					configurable: !1,
					enumerable: !0,
					value: null
				}
			})),
			q = !0,
			G = !0,
			W = !1,
			V = !0,
			J = !1,
			K = !0,
			Y = !1,
			X = !1,
			Z = null,
			Q = null,
			ee = !1,
			et = !1,
			ei = !1,
			er = !1,
			es = !0,
			en = !1,
			eo = "user-content-",
			ea = !0,
			el = !1,
			eu = {},
			ec = null,
			eh = uq({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "selectedcontent", "style", "svg", "template", "thead", "title", "video", "xmp"]),
			ed = null,
			ep = uq({}, ["audio", "video", "img", "source", "image", "track"]),
			ef = null,
			eg = uq({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]),
			ev = "http://www.w3.org/1998/Math/MathML",
			e_ = "http://www.w3.org/2000/svg",
			em = "http://www.w3.org/1999/xhtml",
			ey = em,
			eb = !1,
			ew = null,
			ex = uq({}, [ev, e_, em], uO),
			ek = u_(["mi", "mo", "mn", "ms", "mtext"]),
			eE = uq({}, ek),
			eS = u_(["annotation-xml"]),
			e$ = uq({}, eS),
			eF = uq({}, ["title", "style", "font", "a", "script"]),
			eP = null,
			eT = ["application/xhtml+xml", "text/html"],
			eO = null,
			eI = null,
			eR = r.createElement("form"),
			eC = function(e) {
				return e instanceof RegExp || e instanceof Function
			},
			eM = function() {
				let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
				if (eI && eI === e) return;
				e && "object" == typeof e || (e = {}), e = uG(e), eO = "application/xhtml+xml" === (eP = -1 === eT.indexOf(e.PARSER_MEDIA_TYPE) ? "text/html" : e.PARSER_MEDIA_TYPE) ? uO : uT, L = cl(e, "ALLOWED_TAGS", D, {
					transform: eO
				}), N = cl(e, "ALLOWED_ATTR", j, {
					transform: eO
				}), ew = cl(e, "ALLOWED_NAMESPACES", ex, {
					transform: uO
				}), ef = cl(e, "ADD_URI_SAFE_ATTR", eg, {
					transform: eO,
					base: eg
				}), ed = cl(e, "ADD_DATA_URI_TAGS", ep, {
					transform: eO,
					base: ep
				}), ec = cl(e, "FORBID_CONTENTS", eh, {
					transform: eO
				}), H = cl(e, "FORBID_TAGS", uG({}), {
					transform: eO
				}), U = cl(e, "FORBID_ATTR", uG({}), {
					transform: eO
				}), eu = !!uj(e, "USE_PROFILES") && (e.USE_PROFILES && "object" == typeof e.USE_PROFILES ? uG(e.USE_PROFILES) : e.USE_PROFILES), q = !1 !== e.ALLOW_ARIA_ATTR, G = !1 !== e.ALLOW_DATA_ATTR, W = e.ALLOW_UNKNOWN_PROTOCOLS || !1, V = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR, J = e.SAFE_FOR_TEMPLATES || !1, K = !1 !== e.SAFE_FOR_XML, Y = e.WHOLE_DOCUMENT || !1, et = e.RETURN_DOM || !1, ei = e.RETURN_DOM_FRAGMENT || !1, er = e.RETURN_TRUSTED_TYPE || !1, ee = e.FORCE_BODY || !1, es = !1 !== e.SANITIZE_DOM, en = e.SANITIZE_NAMED_PROPS || !1, ea = !1 !== e.KEEP_CONTENT, el = e.IN_PLACE || !1, A = ! function(e) {
					try {
						return uH(e, ""), !0
					} catch (e) {
						return !1
					}
				}(e.ALLOWED_URI_REGEXP) ? u7 : e.ALLOWED_URI_REGEXP, ey = "string" == typeof e.NAMESPACE ? e.NAMESPACE : em, eE = uj(e, "MATHML_TEXT_INTEGRATION_POINTS") && e.MATHML_TEXT_INTEGRATION_POINTS && "object" == typeof e.MATHML_TEXT_INTEGRATION_POINTS ? uG(e.MATHML_TEXT_INTEGRATION_POINTS) : uq({}, ek), e$ = uj(e, "HTML_INTEGRATION_POINTS") && e.HTML_INTEGRATION_POINTS && "object" == typeof e.HTML_INTEGRATION_POINTS ? uG(e.HTML_INTEGRATION_POINTS) : uq({}, eS);
				let t = uj(e, "CUSTOM_ELEMENT_HANDLING") && e.CUSTOM_ELEMENT_HANDLING && "object" == typeof e.CUSTOM_ELEMENT_HANDLING ? uG(e.CUSTOM_ELEMENT_HANDLING) : uy(null);
				if (z = uy(null), uj(t, "tagNameCheck") && eC(t.tagNameCheck) && (z.tagNameCheck = t.tagNameCheck), uj(t, "attributeNameCheck") && eC(t.attributeNameCheck) && (z.attributeNameCheck = t.attributeNameCheck), uj(t, "allowCustomizedBuiltInElements") && "boolean" == typeof t.allowCustomizedBuiltInElements && (z.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), um(z), J && (G = !1), ei && (et = !0), eu && (L = uq({}, uQ), N = uy(null), !0 === eu.html && (uq(L, uV), uq(N, u0)), !0 === eu.svg && (uq(L, uJ), uq(N, u1), uq(N, u3)), !0 === eu.svgFilters && (uq(L, uK), uq(N, u1), uq(N, u3)), !0 === eu.mathMl && (uq(L, uX), uq(N, u2), uq(N, u3))), B.tagCheck = null, B.attributeCheck = null, uj(e, "ADD_TAGS") && ("function" == typeof e.ADD_TAGS ? B.tagCheck = e.ADD_TAGS : uP(e.ADD_TAGS) && (L === D && (L = uG(L)), uq(L, e.ADD_TAGS, eO))), uj(e, "ADD_ATTR") && ("function" == typeof e.ADD_ATTR ? B.attributeCheck = e.ADD_ATTR : uP(e.ADD_ATTR) && (N === j && (N = uG(N)), uq(N, e.ADD_ATTR, eO))), uj(e, "ADD_URI_SAFE_ATTR") && uP(e.ADD_URI_SAFE_ATTR) && uq(ef, e.ADD_URI_SAFE_ATTR, eO), uj(e, "FORBID_CONTENTS") && uP(e.FORBID_CONTENTS) && (ec === eh && (ec = uG(ec)), uq(ec, e.FORBID_CONTENTS, eO)), uj(e, "ADD_FORBID_CONTENTS") && uP(e.ADD_FORBID_CONTENTS) && (ec === eh && (ec = uG(ec)), uq(ec, e.ADD_FORBID_CONTENTS, eO)), ea && (L["#text"] = !0), Y && uq(L, ["html", "head", "body"]), L.table && (uq(L, ["tbody"]), delete H.tbody), e.TRUSTED_TYPES_POLICY) {
					if ("function" != typeof e.TRUSTED_TYPES_POLICY.createHTML) throw uU('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
					if ("function" != typeof e.TRUSTED_TYPES_POLICY.createScriptURL) throw uU('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
					let t = x;
					x = e.TRUSTED_TYPES_POLICY;
					try {
						E = P("")
					} catch (e) {
						throw x = t, e
					}
				} else null === e.TRUSTED_TYPES_POLICY ? (x = void 0, E = "") : (void 0 === x && (S || (k = function(e, t) {
					if ("object" != typeof e || "function" != typeof e.createPolicy) return null;
					let i = null,
						r = "data-tt-policy-suffix";
					t && t.hasAttribute(r) && (i = t.getAttribute(r));
					let s = "dompurify" + (i ? "#" + i : "");
					try {
						return e.createPolicy(s, {
							createHTML: e => e,
							createScriptURL: e => e
						})
					} catch (e) {
						return console.warn("TrustedTypes policy " + s + " could not be created."), null
					}
				}(c, n), S = !0), x = k), x && "string" == typeof E && (E = P("")));
				u_ && u_(e), eI = e
			},
			eA = uq({}, [...uJ, ...uK, ...uY]),
			eL = uq({}, [...uX, ...uZ]),
			eD = function(e) {
				u$(i.removed, {
					element: e
				});
				try {
					v(e).removeChild(e)
				} catch (t) {
					if (p(e), !v(e)) throw uU("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place")
				}
			},
			eN = function(e) {
				eH(e);
				let t = g(e);
				if (t) {
					let e = [];
					uk(t, t => {
						u$(e, t)
					}), uk(e, e => {
						try {
							p(e)
						} catch (e) {}
					})
				}
				let i = m(e);
				if (i)
					for (let t = i.length - 1; t >= 0; --t) {
						let r = i[t],
							s = r && r.name;
						if ("string" == typeof s) try {
							e.removeAttribute(s)
						} catch (e) {}
					}
			},
			ej = function(e, t) {
				try {
					u$(i.removed, {
						attribute: t.getAttributeNode(e),
						from: t
					})
				} catch (e) {
					u$(i.removed, {
						attribute: null,
						from: t
					})
				}
				if (t.removeAttribute(e), "is" === e)
					if (et || ei) try {
						eD(t)
					} catch (e) {} else try {
						t.setAttribute(e, "")
					} catch (e) {}
			},
			ez = function(e) {
				let t = m(e);
				if (t)
					for (let i = t.length - 1; i >= 0; --i) {
						let r = t[i],
							s = r && r.name;
						if ("string" == typeof s && !N[eO(s)]) try {
							e.removeAttribute(s)
						} catch (e) {}
					}
			},
			eH = function(e) {
				let t = [e];
				for (; t.length > 0;) {
					let e = t.pop();
					1 === (y ? y(e) : e.nodeType) && ez(e);
					let i = g(e);
					if (i)
						for (let e = i.length - 1; e >= 0; --e) t.push(i[e])
				}
			},
			eU = function(e) {
				let t = null,
					i = null;
				if (ee) e = "<remove></remove>" + e;
				else {
					let t = uI(e, /^[\r\n\t ]+/);
					i = t && t[0]
				}
				"application/xhtml+xml" === eP && ey === em && (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + "</body></html>");
				let s = x ? P(e) : e;
				if (ey === em) try {
					t = (new u).parseFromString(s, eP)
				} catch (e) {}
				if (!t || !t.documentElement) {
					t = T.createDocument(ey, "template", null);
					try {
						t.documentElement.innerHTML = eb ? E : s
					} catch (e) {}
				}
				let n = t.body || t.documentElement;
				return e && i && n.insertBefore(r.createTextNode(i), n.childNodes[0] || null), ey === em ? R.call(t, Y ? "html" : "body")[0] : Y ? t.documentElement : n
			},
			eB = function(e) {
				let t = w ? w(e) : e.ownerDocument;
				return O.call(t || e, e, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT | l.SHOW_PROCESSING_INSTRUCTION | l.SHOW_CDATA_SECTION, null)
			},
			eq = function(e) {
				return e = uR(e, u5, " "), e = uR(e, u4, " "), uR(e, u8, " ")
			},
			eG = function(e) {
				var t;
				e.normalize();
				let i = w ? w(e) : e.ownerDocument,
					r = O.call(i || e, e, l.SHOW_TEXT | l.SHOW_COMMENT | l.SHOW_CDATA_SECTION | l.SHOW_PROCESSING_INSTRUCTION, null),
					s = r.nextNode();
				for (; s;) s.data = eq(s.data), s = r.nextNode();
				let n = null == (t = e.querySelectorAll) ? void 0 : t.call(e, "template");
				n && uk(n, e => {
					eV(e.content) && eG(e.content)
				})
			},
			eW = function(e) {
				let t = b ? b(e) : null;
				return "string" == typeof t && "form" === eO(t) && ("string" != typeof e.nodeName || "string" != typeof e.textContent || "function" != typeof e.removeChild || e.attributes !== m(e) || "function" != typeof e.removeAttribute || "function" != typeof e.setAttribute || "string" != typeof e.namespaceURI || "function" != typeof e.insertBefore || "function" != typeof e.hasChildNodes || e.nodeType !== y(e) || e.childNodes !== g(e))
			},
			eV = function(e) {
				if (!y || "object" != typeof e || null === e) return !1;
				try {
					return 11 === y(e)
				} catch (e) {
					return !1
				}
			},
			eJ = function(e) {
				if (!y || "object" != typeof e || null === e) return !1;
				try {
					return "number" == typeof y(e)
				} catch (e) {
					return !1
				}
			};

		function eK(e, t, r) {
			0 !== e.length && uk(e, e => {
				e.call(i, t, r, eI)
			})
		}
		let eY = function(e, t, i, r) {
				return 0 === e.length ? t : t === i || t === r ? uG(t) : t
			},
			eX = function(e, t) {
				var r, s, n;
				let o, a, l;
				if (eK(M.beforeSanitizeElements, e, null), e !== t && null === v(e)) return el && eH(e), !0;
				if (eW(e)) return eD(e), !0;
				let u = eO(b ? b(e) : e.nodeName);
				if (L = eY(M.uponSanitizeElement, L, D, Z), eK(M.uponSanitizeElement, e, {
						tagName: u,
						allowedTags: L
					}), e !== t && null === v(e)) return el && eH(e), !0;
				if (K && e.hasChildNodes() && !eJ(e.firstElementChild) && uH(cs, e.textContent) && uH(cs, e.innerHTML) || !(!K || e.namespaceURI !== em || "style" !== u || !eJ(e.firstElementChild)) || 7 === e.nodeType || !(!K || 8 !== e.nodeType || !uH(cn, e.data))) return eD(e), !0;
				if (H[u] || !(B.tagCheck instanceof Function && B.tagCheck(u)) && !L[u]) {
					let i = function(e, t, i) {
						if (!H[t] && e0(t) && (z.tagNameCheck instanceof RegExp && uH(z.tagNameCheck, t) || z.tagNameCheck instanceof Function && z.tagNameCheck(t))) return !1;
						if (ea && !ec[t]) {
							let t = v(e),
								r = g(e);
							if (r && t)
								for (let s = r.length - 1; s >= 0; --s) {
									let n = e === i ? d(r[s], !0) : r[s];
									t.insertBefore(n, f(e))
								}
						}
						return eD(e), !0
					}(e, u, t);
					return !1 === i && eK(M.afterSanitizeElements, e, null), i
				}
				if (1 === (y ? y(e) : e.nodeType) && ((o = v(e)) && o.tagName || (o = {
						namespaceURI: ey,
						tagName: "template"
					}), a = uT(e.tagName), l = uT(o.tagName), !ew[e.namespaceURI] || (e.namespaceURI === e_ ? (r = o).namespaceURI === em ? "svg" !== a : r.namespaceURI === ev ? "svg" !== a || "annotation-xml" !== l && !eE[l] : !eA[a] : e.namespaceURI === ev ? (s = o).namespaceURI === em ? "math" !== a : s.namespaceURI === e_ ? "math" !== a || !e$[l] : !eL[a] : e.namespaceURI === em ? !!((n = o).namespaceURI === e_ && !e$[l]) || !!(n.namespaceURI === ev && !eE[l]) || !!eL[a] || !eF[a] && !!eA[a] : !!("application/xhtml+xml" !== eP || !ew[e.namespaceURI]))) || ("noscript" === u || "noembed" === u || "noframes" === u) && uH(co, e.innerHTML)) return eD(e), !0;
				if (J && 3 === e.nodeType) {
					let t = eq(e.textContent);
					e.textContent !== t && (u$(i.removed, {
						element: e.cloneNode()
					}), e.textContent = t)
				}
				return eK(M.afterSanitizeElements, e, null), !1
			},
			eZ = function(e, t, i) {
				if (U[t] || K && "patchsrc" === t || K && "for" === t && "label" !== e && "output" !== e || es && ("id" === t || "name" === t) && (i in r || i in eR)) return !1;
				let s = N[t] || B.attributeCheck instanceof Function && B.attributeCheck(t, e);
				if (G && uH(u6, t));
				else if (q && uH(u9, t));
				else if (s) {
					if (ef[t]);
					else if (uH(A, uR(i, ct, "")));
					else if ("src" !== t && "xlink:href" !== t && "href" !== t || "script" === e || 0 !== uC(i, "data:") || !ed[e]) {
						if (W && !uH(ce, uR(i, ct, "")));
						else if (i) return !1
					}
				} else if (!(e0(e) && (z.tagNameCheck instanceof RegExp && uH(z.tagNameCheck, e) || z.tagNameCheck instanceof Function && z.tagNameCheck(e)) && (z.attributeNameCheck instanceof RegExp && uH(z.attributeNameCheck, t) || z.attributeNameCheck instanceof Function && z.attributeNameCheck(t, e)) || "is" === t && z.allowCustomizedBuiltInElements && (z.tagNameCheck instanceof RegExp && uH(z.tagNameCheck, i) || z.tagNameCheck instanceof Function && z.tagNameCheck(i)))) return !1;
				return !0
			},
			eQ = uq({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]),
			e0 = function(e) {
				return !eQ[uT(e)] && uH(cr, e)
			},
			e1 = function(e, t, i, r) {
				if (x && "object" == typeof c && "function" == typeof c.getAttributeType && !i) switch (c.getAttributeType(e, t)) {
					case "TrustedHTML":
						return P(r);
					case "TrustedScriptURL":
						F(), $++;
						try {
							return x.createScriptURL(r)
						} finally {
							$--
						}
				}
				return r
			},
			e2 = function(e, t, r, s) {
				try {
					r ? e.setAttributeNS(r, t, s) : e.setAttribute(t, s), eW(e) ? eD(e) : uS(i.removed)
				} catch (i) {
					ej(t, e)
				}
			},
			e3 = function(e) {
				eK(M.beforeSanitizeAttributes, e, null);
				let t = e.attributes;
				if (!t || eW(e)) return;
				let i = {
						attrName: "",
						attrValue: "",
						keepAttr: !0,
						allowedAttributes: N = eY(M.uponSanitizeAttribute, N, j, Q),
						forceKeepAttr: void 0
					},
					r = t.length,
					s = eO(e.nodeName);
				for (; r--;) {
					let n = t[r],
						o = n.name,
						a = n.namespaceURI,
						l = n.value,
						u = eO(o),
						c = "value" === o ? l : uM(l);
					i.attrName = u, i.attrValue = c, i.keepAttr = !0, i.forceKeepAttr = void 0, eK(M.uponSanitizeAttribute, e, i), c = i.attrValue, en && ("id" === u || "name" === u) && 0 !== uC(c, eo) && (ej(o, e), c = eo + c), K && uH(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, c) || "attributename" === u && uI(c, "href") ? ej(o, e) : i.forceKeepAttr || (!i.keepAttr || !V && uH(ca, c) ? ej(o, e) : (J && (c = eq(c)), eZ(s, u, c) ? (c = e1(s, u, a, c)) !== l && e2(e, o, a, c) : ej(o, e)))
				}
				eK(M.afterSanitizeAttributes, e, null)
			},
			e5 = function(e) {
				let t = null,
					i = eB(e);
				for (eK(M.beforeSanitizeShadowDOM, e, null); t = i.nextNode();)
					if (eK(M.uponSanitizeShadowNode, t, null), eX(t, e), e3(t), eV(t.content) && e5(t.content), 1 === (y ? y(t) : t.nodeType)) {
						let e = _(t);
						eV(e) && (e4(e), e5(e))
					} eK(M.afterSanitizeShadowDOM, e, null)
			},
			e4 = function(e) {
				let t = [{
					node: e,
					shadow: null
				}];
				for (; t.length > 0;) {
					let e = t.pop();
					if (e.shadow) {
						e5(e.shadow);
						continue
					}
					let i = e.node,
						r = 1 === (y ? y(i) : i.nodeType),
						s = g(i);
					if (s)
						for (let e = s.length - 1; e >= 0; --e) t.push({
							node: s[e],
							shadow: null
						});
					if (r) {
						let e = b ? b(i) : null;
						if ("string" == typeof e && "template" === eO(e)) {
							let e = i.content;
							eV(e) && t.push({
								node: e,
								shadow: null
							})
						}
					}
					if (r) {
						let e = _(i);
						eV(e) && t.push({
							node: null,
							shadow: e
						}, {
							node: e,
							shadow: null
						})
					}
				}
			};
		return i.sanitize = function(e) {
			let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
				r = null,
				n = null,
				o = null,
				a = null;
			if ((eb = !e) && (e = "<!-->"), "string" != typeof e && !eJ(e) && "string" != typeof(e = function(e) {
					switch (typeof e) {
						case "string":
							return e;
						case "number":
							return uA(e);
						case "boolean":
							return uL(e);
						case "bigint":
							return uD ? uD(e) : "0";
						case "symbol":
							return uN ? uN(e) : "Symbol()";
						case "undefined":
						default:
							return uz(e);
						case "function":
						case "object": {
							if (null === e) return uz(e);
							let t = uW(e, "toString");
							if ("function" == typeof t) {
								let i = t(e);
								return "string" == typeof i ? i : uz(i)
							}
							return uz(e)
						}
					}
				}(e))) throw uU("dirty is not a string, aborting");
			if (!i.isSupported) return e;
			X ? (L = Z, N = Q) : eM(t), (M.uponSanitizeElement.length > 0 || M.uponSanitizeAttribute.length > 0) && (L = uG(L)), M.uponSanitizeAttribute.length > 0 && (N = uG(N)), i.removed = [];
			let l = el && "string" != typeof e && eJ(e);
			if (l) {
				! function(e) {
					if (!K) return;
					let t = [e];
					for (; t.length > 0;) {
						let e = t.pop(),
							i = y ? y(e) : e.nodeType;
						if (7 === i || 8 === i && uH(cn, e.data)) {
							try {
								p(e)
							} catch (e) {}
							continue
						}
						if (1 === i) {
							let t = eO(b ? b(e) : e.nodeName);
							try {
								e.hasAttribute && e.hasAttribute("patchsrc") && e.removeAttribute("patchsrc"), e.hasAttribute && e.hasAttribute("for") && "label" !== t && "output" !== t && e.removeAttribute("for")
							} catch (e) {}
						}
						let r = g(e);
						if (r)
							for (let e = r.length - 1; e >= 0; --e) t.push(r[e])
					}
				}(e);
				let t = b ? b(e) : e.nodeName;
				if ("string" == typeof t) {
					let i = eO(t);
					if (!L[i] || H[i]) throw eN(e), uU("root node is forbidden and cannot be sanitized in-place")
				}
				if (eW(e)) throw eN(e), uU("root node is clobbered and cannot be sanitized in-place");
				try {
					e4(e)
				} catch (t) {
					throw eN(e), t
				}
			} else if (eJ(e)) 1 === (n = (r = eU("<!---->")).ownerDocument.importNode(e, !0)).nodeType && "BODY" === n.nodeName || "HTML" === n.nodeName ? r = n : r.appendChild(n), e4(n);
			else {
				if (!et && !J && !Y && -1 === e.indexOf("<")) return x && er ? P(e) : e;
				if (!(r = eU(e))) return et ? null : er ? E : ""
			}
			r && ee && eD(r.firstChild);
			let u = l ? e : r;
			try {
				let e = eB(u);
				for (; o = e.nextNode();) eX(o, u), e3(o), eV(o.content) && e5(o.content)
			} catch (t) {
				throw l && (eN(e), uk(i.removed, e => {
					e.element && eH(e.element)
				})), t
			}
			if (l) return uk(i.removed, e => {
				e.element && eH(e.element)
			}), J && eG(e), e;
			if (et) {
				if (J && eG(r), ei)
					for (a = I.call(r.ownerDocument); r.firstChild;) a.appendChild(r.firstChild);
				else a = r;
				return (N.shadowroot || N.shadowrootmode) && (a = C.call(s, a, !0)), a
			}
			let c = Y ? r.outerHTML : r.innerHTML;
			return Y && L["!doctype"] && r.ownerDocument && r.ownerDocument.doctype && r.ownerDocument.doctype.name && uH(ci, r.ownerDocument.doctype.name) && (c = "<!DOCTYPE " + r.ownerDocument.doctype.name + ">\n" + c), J && (c = eq(c)), x && er ? P(c) : c
		}, i.setConfig = function() {
			eM(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}), X = !0, Z = L, Q = N
		}, i.clearConfig = function() {
			eI = null, X = !1, Z = null, Q = null, x = k, E = ""
		}, i.isValidAttribute = function(e, t, i) {
			return eI || eM({}), eZ(eO(e), eO(t), i)
		}, i.addHook = function(e, t) {
			"function" == typeof t && uj(M, e) && u$(M[e], t)
		}, i.removeHook = function(e, t) {
			if (uj(M, e)) {
				if (void 0 !== t) {
					let i = uE(M[e], t);
					return -1 === i ? void 0 : uF(M[e], i, 1)[0]
				}
				return uS(M[e])
			}
		}, i.removeHooks = function(e) {
			uj(M, e) && (M[e] = [])
		}, i.removeAllHooks = function() {
			M = {
				afterSanitizeAttributes: [],
				afterSanitizeElements: [],
				afterSanitizeShadowDOM: [],
				beforeSanitizeAttributes: [],
				beforeSanitizeElements: [],
				beforeSanitizeShadowDOM: [],
				uponSanitizeAttribute: [],
				uponSanitizeElement: [],
				uponSanitizeShadowNode: []
			}
		}, i
	}();
	let cc = "Refusing to render web experiment since the viewer is a likely bot",
		ch = {
			ADD_ATTR: (e, t) => "target" === e && "a" === t || "form" === e && /^(button|fieldset|input|output|select|textarea)$/.test(t),
			ADD_URI_SAFE_ATTR: ["form"]
		},
		cd = {
			icontains: (e, t) => t.toLowerCase().indexOf(e.toLowerCase()) > -1,
			not_icontains: (e, t) => -1 === t.toLowerCase().indexOf(e.toLowerCase()),
			regex: (e, t) => aC(t, e),
			not_regex: (e, t) => !aC(t, e),
			exact: (e, t) => t === e,
			is_not: (e, t) => t !== e
		},
		cp = rr.createLogger("[Conversations]", void 0),
		cf = "Conversations not available yet.";

	function cg(e, t) {
		var i, r, s, n, o, a, l;
		let u = null != (i = null == e ? void 0 : e.flushIntervalMs) ? i : 3e3,
			c = null != (r = null == e ? void 0 : e.maxBufferSize) ? r : 100,
			h = (null == t ? void 0 : t.consoleCapture) ? void 0 : null != (s = null == e ? void 0 : e.maxLogsPerInterval) ? s : 1e3,
			d = J(h) ? Math.max(c, 2048) : Math.max(c, h),
			p = tS(tS({}, function() {
				var e, t, i;
				let r, s = "",
					n = "";
				try {
					let t = "u" > typeof globalThis ? globalThis : "u" > typeof window ? window : void 0,
						i = null == t || null == (e = t.navigator) ? void 0 : e.userAgent;
					i && ([s, n] = tn(i))
				} catch (e) {}
				return t = s, i = n, tS(tS({}, (r = function(e) {
					if (e) return ({}).hasOwnProperty.call(iY, e) ? iY[e] : e
				}(t)) ? {
					"os.name": r
				} : {}), i ? {
					"os.version": i
				} : {})
			}()), null == e ? void 0 : e.resourceAttributes);
		return {
			serviceName: null != (n = null != (o = null == p ? void 0 : p["service.name"]) ? o : null == e ? void 0 : e.serviceName) ? n : null == t ? void 0 : t.serviceNameDefault,
			serviceVersion: null != (a = null == p ? void 0 : p["service.version"]) ? a : null == e ? void 0 : e.serviceVersion,
			environment: null != (l = null == p ? void 0 : p["deployment.environment"]) ? l : null == e ? void 0 : e.environment,
			resourceAttributes: p,
			beforeSend: null == e ? void 0 : e.beforeSend,
			flushIntervalMs: u,
			maxBufferSize: c,
			maxQueueSize: d,
			maxBatchRecordsPerPost: 100,
			rateCapWindowMs: u,
			maxLogsPerInterval: h,
			backgroundFlushBudgetMs: 0,
			terminationFlushBudgetMs: 0
		}
	}
	let cv = ["debug", "log", "warn", "error", "info"],
		c_ = e => {
			for (; null == e ? void 0 : e.__rrweb_original__;) e = e.__rrweb_original__;
			return e
		},
		cm = "console",
		cy = "__posthogHandledLogsRequestError",
		cb = (e, t) => {
			let i = e instanceof Error ? e : Error(t);
			return i[cy] = !0, i
		},
		cw = e => !!e && "object" == typeof e && !0 === e[cy];
	var cx = class {
		get Qv() {
			return tS(tS({}, this.R), {}, {
				error: (...e) => {
					e.some(cw) || this.R.error(...e)
				}
			})
		}
		constructor(e, t) {
			var i;
			this.Na = e, this.Jv = t, this.name = "logs", this.Zv = !1, this.Kv = !1, this.Yv = !1, this.R = rr.createLogger("[logs]", void 0), this.cc = [], this.Xv = [], this.Jd = 0, this.tf = !1, this.Ti = !1, this.ef = [], this.if = [], this.nf = !1, this.sf = !1, this.rf = !1, this.af = () => {
				var e, t;
				this.Ti || (this.Jd = 0, null == (e = this.lf) || e.onReconnect(), null == (t = this.uf) || t.onReconnect())
			}, this.Zv = !!(null == (i = e.get()) ? void 0 : i.captureConsoleLogs)
		}
		get cf() {
			return !0
		}
		hf() {}
		df() {
			if (!this.rf) {
				try {
					this.uv = typeof window > "u" ? void 0 : window
				} catch (e) {
					this.uv = void 0
				}
				this.uv && (sF(this.uv, "online", this.af), this.rf = !0)
			}
		}
		vf(e, t, i, r) {
			this.df();
			let s = cg(this.Na.get(), i);
			return [new i3(this.ff(e, t), s, this.Qv, () => this.Jv(), e => e(), void 0, r), s]
		}
		pf() {
			var e;
			let t = this.Na.get();
			return this.lf && this.gf === t || (null == (e = this.lf) || e.reset(), this.gf = t, [this.lf, this.mf] = this.vf(() => this.cc, e => {
				this.cc = e
			})), this.lf
		}
		yf() {
			var e;
			let t = this.Na.get();
			return this.uf && this.bf === t || (null == (e = this.uf) || e.reset(), this.bf = t, [this.uf, this._f] = this.vf(() => this.Xv, e => {
				this.Xv = e
			}, {
				serviceNameDefault: "posthog-browser-logs",
				consoleCapture: !0
			}, cm)), this.uf
		}
		setup(e) {
			if (!this.Ti && !this.tf) return this.tf = !0, this.Fa = e, this.R = e.logger.createLogger("[logs]"), lJ(e.kv.initialize(), () => {
				this.Ti || this.hv(e)
			})
		}
		hv(e) {
			var t;
			this.df(), (null == (t = this.Na.get()) ? void 0 : t.captureConsoleLogs) && (this.Zv = !0), (this.Zv || this.Na.remoteConfigWillArrive && e.kv.get(this.Na.captureHintKey)) && this.wf();
			let i = !1,
				r = e.onRemoteConfig(e => {
					var t;
					i = e.ok && !0 === (null == (t = e.config.logs) ? void 0 : t.captureConsoleLogs), this.onRemoteConfig(e)
				});
			this.Ti ? r.dispose() : (this.Za = r, i || this.loadIfEnabled())
		}
		dispose() {
			var e, t, i, r, s, n, o;
			this.Ti || (this.Ti = !0, this.kf(), null == (e = this.Za) || e.dispose(), this.Za = void 0, this.Fa = void 0, this.Yv = !1, null == (t = this.uv) || t.removeEventListener("online", this.af), null == (i = this.Sf) || i.call(this), this.Sf = void 0, null == (r = this.lf) || r.clearQueue(), null == (s = this.uf) || s.clearQueue(), null == (n = this.lf) || n.reset(), null == (o = this.uf) || o.reset())
		}
		onRemoteConfig(e) {
			var t, i;
			if (this.Ti) return;
			let r = e.ok ? null == (t = e.config.logs) ? void 0 : t.captureConsoleLogs : void 0;
			Z(r) ? this.xf() : (null == (i = this.Fa) || i.kv.set(this.Na.captureHintKey, !!r), r ? (this.Zv = !0, this.Kv || this.wf(), this.loadIfEnabled()) : this.xf())
		}
		reset() {
			var e, t, i, r;
			this.kf(), null == (e = this.lf) || e.clearQueue(), this.cc = [], null == (t = this.lf) || t.reset(), null == (i = this.uf) || i.clearQueue(), this.Xv = [], null == (r = this.uf) || r.reset(), this.Jd = 0
		}
		captureLog(e) {
			!this.Ti && this.Fa && this.pf().captureLog(e)
		}
		captureConsoleLog(e) {
			!this.Ti && this.Fa && this.yf().captureLog(e)
		}
		captureBufferedConsoleLog(e, t, i) {
			!this.Ti && this.Fa && this.yf().captureLog(e, {
				context: t,
				occurredAtMs: i
			})
		}
		Rd() {
			var e;
			this.kf(), null == (e = this.uf) || e.clearQueue(), this.Xv = []
		}
		xf() {
			this.Zv || this.kf()
		}
		wf() {
			var e;
			if (this.nf || !(null == (e = this.uv) ? void 0 : e.console)) return;
			let t = cg(this.Na.get()).maxBufferSize,
				i = !0;
			for (let e of (this.if.push(() => {
					i = !1
				}), cv)) {
				let r;
				try {
					r = c_(this.uv.console[e])
				} catch (e) {
					continue
				}
				r && this.if.push(lF(this.uv.console, e, s => {
					let n = (...r) => {
						try {
							i && this.$f(e, r, t)
						} catch (e) {}
						return s.apply(this.uv.console, r)
					};
					return n.__rrweb_original__ = r, n
				}))
			}
			this.nf = !0, this.Cf = setTimeout(() => {
				this.kf()
			}, 3e4)
		}
		$f(e, t, i) {
			var r;
			if (this.nf && !this.sf && 0 !== t.length)
				if (null == (r = this.Fa) ? void 0 : r.canCapture) {
					if (i > this.ef.length) {
						this.sf = !0;
						try {
							this.ef.push({
								level: e,
								args: t,
								occurredAtMs: Date.now(),
								context: this.Jv()
							})
						} finally {
							this.sf = !1
						}
					}
				} else this.kf()
		}
		kf() {
			if (this.ef = [], this.nf) {
				for (let e of (this.nf = !1, this.Cf && (clearTimeout(this.Cf), this.Cf = void 0), this.if)) e();
				this.if = []
			}
		}
		Tf() {
			let e = this.ef;
			return this.kf(), e
		}
		get logger() {
			return this.If || (this.If = {
				trace: (e, t) => this.captureLog({
					body: e,
					level: "trace",
					attributes: t
				}),
				debug: (e, t) => this.captureLog({
					body: e,
					level: "debug",
					attributes: t
				}),
				info: (e, t) => this.captureLog({
					body: e,
					level: "info",
					attributes: t
				}),
				warn: (e, t) => this.captureLog({
					body: e,
					level: "warn",
					attributes: t
				}),
				error: (e, t) => this.captureLog({
					body: e,
					level: "error",
					attributes: t
				}),
				fatal: (e, t) => this.captureLog({
					body: e,
					level: "fatal",
					attributes: t
				})
			}), this.If
		}
		flushLogs(e) {
			this.Fa && (e ? this.Mf(e) : (this.lf && this.lf.flush().catch(e => this.Ef(e)), this.uf && this.uf.flush().catch(e => this.Ef(e))))
		}
		flush() {
			var e = this;
			return ed(function*() {
				var t, i;
				let r = null == (t = e.lf) ? void 0 : t.flush().catch(t => e.Ef(t)),
					s = null == (i = e.uf) ? void 0 : i.flush().catch(t => e.Ef(t));
				yield r, yield s
			})()
		}
		Ef(e) {
			cw(e) || this.R.error("PostHog logs flush failed:", e)
		}
		loadIfEnabled() {
			if (this.Ti || !this.Zv || this.Kv || this.Yv) return;
			let e = this.hf();
			if (e) {
				this.Yv = !0;
				try {
					e((e, t) => {
						if (this.Yv = !1, !this.Ti && this.Zv)
							if (e || !t) this.R.error("Could not load logs script", e), this.kf();
							else {
								let e = this.Tf();
								this.Sf = t.initialize(this.Fa), this.Kv = !0, e.length > 0 && t.replay(this.Fa, e)
							}
					})
				} catch (e) {
					throw this.Yv = !1, e
				}
			} else this.kf()
		}
		ff(e, t) {
			let i = this.Fa;
			return {
				get isDisabled() {
					return !1
				},
				get optedOut() {
					return !i.canCapture
				},
				getPersistedProperty: t => t === C.LogsQueue ? e() : void 0,
				setPersistedProperty(e, i) {
					e === C.LogsQueue && t(null != i ? i : [])
				},
				qs: e => this.qs(e),
				getLibraryId: () => i.library.name,
				getLibraryVersion: () => i.library.version
			}
		}
		qs(e) {
			return new Promise(t => {
				if (nY(this.Jd, 3)) return void t({
					kind: "fatal",
					error: cb(void 0, "logs endpoint is unreachable, dropping batch")
				});
				let i = !1,
					r = e => {
						i || (i = !0, clearTimeout(s), t(e))
					},
					s = setTimeout(() => {
						this.R.warn("Logs request timed out before receiving a response"), r({
							kind: "retry-later",
							error: cb(void 0, "logs request timed out")
						})
					}, 9e4),
					n = this.cf;
				this.Fa.sendRequest("/i/v1/logs", {
					method: "POST",
					query: {
						token: this.Fa.projectToken
					},
					body: e,
					compression: "best-available",
					timeoutMs: 6e4
				}).then(e => {
					var t;
					let i = e.statusCode;
					this.Af(i, n), i >= 200 && 300 > i ? r({
						kind: "ok"
					}) : 413 === i ? r({
						kind: "too-large"
					}) : 0 !== i && 408 !== i && 429 !== i && 500 > i ? r({
						kind: "fatal",
						error: Error(`logs request failed with status ${i}`)
					}) : 0 === i ? (e.error || this.R.warn("Logs request failed before receiving an HTTP response"), r({
						kind: "retry-later",
						error: cb(e.error, "logs request failed before receiving an HTTP response")
					})) : r({
						kind: "retry-later",
						error: null != (t = e.error) ? t : Error(`logs request failed with status ${i}`)
					})
				}, e => {
					r({
						kind: "retry-later",
						error: e
					})
				})
			})
		}
		Af(e, t) {
			(0 !== e || t) && (this.Jd = nX(e, this.Jd, 3, () => this.R.warn("Log requests are failing before receiving an HTTP response; this can happen due to network issues, CORS, browser blocking, or ad blockers. Stopped sending logs; will try again when connectivity changes.")))
		}
		Mf(e) {
			this.cc.length > 0 && this.Rf(e, this.cc, this.mf, this.Fa.library.name, e => {
				this.cc = e
			}), this.Xv.length > 0 && this.Rf(e, this.Xv, this._f, cm, e => {
				this.Xv = e
			})
		}
		Rf(e, t, i, r, s) {
			if (0 === t.length) return;
			let n = t.map(e => e.record);
			s([]);
			let o = iQ(n, iV(i, this.Fa.library.name, this.Fa.library.version), r, this.Fa.library.version);
			this.Fa.sendRequest("/i/v1/logs", {
				method: "POST",
				query: {
					token: this.Fa.projectToken
				},
				body: o,
				compression: "best-available",
				transport: e,
				timeoutMs: 6e4
			}).catch(e => this.Ef(e))
		}
	};
	let ck = rr.createLogger("[NetworkMetrics]", void 0),
		cE = {
			"http:": 80,
			"https:": 443
		},
		cS = new Set(["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT", "TRACE"]),
		c$ = (e, t) => {
			var i;
			let r = String(t);
			return {
				method: String(e).toUpperCase(),
				url: (null == (i = nJ(r)) ? void 0 : i.href) || r
			}
		},
		cF = (e, t, i, r, s, n, o = !1) => {
			try {
				var a, l, u;
				let c, h = s();
				if (!h) return;
				let d = i || void 0,
					p = a6() - r,
					f = nJ(t.url);
				if (f && "http:" !== f.protocol && "https:" !== f.protocol) return;
				let g = {
						url: (null == f ? void 0 : f.href) || t.url,
						method: t.method
					},
					v = G(h.name) ? h.name(g) : K(h.name) ? h.name : "http.client.request.duration";
				if (!v) return;
				let _ = o && !d ? void 0 : d ? 400 > d ? void 0 : String(d) : (null == n ? void 0 : n.name) || "_OTHER",
					m = tS(tS(tS(tS(tS({}, (u = g.method, c = cS.has(u) ? u : "_OTHER", tS({
						"http.request.method": c
					}, "_OTHER" === c && u !== c ? {
						"http.request.method_original": u
					} : {}))), f ? {
						"server.address": f.hostname.startsWith("[") && f.hostname.endsWith("]") ? f.hostname.slice(1, -1) : f.hostname,
						"server.port": Number(f.port) || cE[f.protocol],
						"url.scheme": f.protocol.slice(0, -1),
						"url.template": f.pathname.split("/").map(e => /^\d+$/.test(e) || e.length >= 8 && /^[0-9a-f-]*\d[0-9a-f-]*$/i.test(e) ? ":id" : e).join("/")
					} : {}), d ? {
						"http.response.status_code": d
					} : {}), _ ? {
						"error.type": _
					} : {}), null == (a = h.attributes) ? void 0 : a.call(h, g, {
						status: d,
						durationMs: p
					}));
				null == (l = e.metrics) || l.histogram(v, p, {
					unit: "ms",
					attributes: m
				})
			} catch (e) {
				ck.error("Failed to record network metric", e)
			}
		},
		cP = () => {},
		cT = new WeakMap,
		cO = new Set(["$comment", "$defs", "$id", "$schema", "additionalProperties", "default", "definitions", "deprecated", "description", "examples", "minProperties", "properties", "readOnly", "required", "title", "type", "writeOnly"]),
		cI = {
			maxStringLength: 2048,
			truncationSuffix: "..."
		},
		cR = {
			maxStringLength: 2048,
			truncationSuffix: "..."
		};

	function cC(e) {
		if (e) return !0 === e ? {
			intent: !0,
			model: !0
		} : {
			intent: !1 !== e.intent,
			model: !1 !== e.model
		}
	}

	function cM(e, t) {
		return ({}).hasOwnProperty.call(e, t)
	}

	function cA(e, t) {
		let i = Object.create(e);
		return t && Object.defineProperty(i, "inputSchema", {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: t
		}), i
	}

	function cL(e, t, i = !1) {
		if (!K(e)) return;
		let r = e.trim();
		return r ? (i ? iU(r, cI) : r).slice(0, t) : void 0
	}

	function cD(e) {
		try {
			return W(e) && !0 === e.isError
		} catch (e) {
			return !1
		}
	}

	function cN(e) {
		return iU(e || "Unknown error", cR).slice(0, 2048)
	}
	lw.__defaultExtensionClasses = tS({}, ((...e) => sw({}, ...e))({
		featureFlags: us
	}, {
		sessionRecording: class {
			get Fr() {
				return this._instance.config
			}
			get Pc() {
				return this._instance.persistence
			}
			get started() {
				var e;
				return !!(null == (e = this.Pf) ? void 0 : e.isStarted)
			}
			get status() {
				var e, t;
				return "awaiting_config" === this.Of || "missing_config" === this.Of ? this.Of : null != (e = null == (t = this.Pf) ? void 0 : t.status) ? e : this.Of
			}
			constructor(e) {
				if (this._instance = e, this._forceAllowLocalhostNetworkCapture = !1, this.Of = lC, this.Ff = void 0, this.Df = !1, this.Ye = (() => {
						var e, t;
						if (!(null == x ? void 0 : x.visibilityState) || "visible" === x.visibilityState) return !0;
						let i = null == y || null == (e = y.performance) || null == (t = e.getEntriesByType) ? void 0 : t.call(e, "visibility-state");
						return !(null == i ? void 0 : i.length) || i.some(e => "visible" === e.name)
					})(), this.an = () => {
						var e, t;
						"visible" === (null == x ? void 0 : x.visibilityState) && (this.Ye = !0, null == (e = this.Pf) || null == (t = e.setDocumentWasEverVisible) || t.call(e, !0))
					}, !this._instance.sessionManager) throw lA.error("started without valid sessionManager"), Error("[SessionRecording] started without valid sessionManager. This is a bug.");
				if ("always" === this.Fr.cookieless_mode) throw Error('[SessionRecording] cannot be used with cookieless_mode="always"');
				(null == x ? void 0 : x.addEventListener) && sF(x, "visibilitychange", this.an)
			}
			initialize() {
				this.startIfEnabledOrStop()
			}
			dispose({
				discardBufferedEvents: e = !1
			} = {}) {
				var t;
				this.Df = !0, null == x || null == (t = x.removeEventListener) || t.call(x, "visibilitychange", this.an), e ? this.Lf(!0) : this.stopRecording()
			}
			get Nf() {
				var e;
				let t = !!(null == (e = this._instance.get_property("$session_recording_remote_config")) ? void 0 : e.enabled),
					i = !this.Fr.disable_session_recording,
					r = this.Fr.disable_session_recording || this._instance.consent.isOptedOut();
				return y && t && i && !r
			}
			startIfEnabledOrStop(e) {
				var t;
				if (this.Df || this.Nf && (null == (t = this.Pf) ? void 0 : t.isStarted)) return;
				let i = !J(Object.assign) && !J(Array.from);
				this.Nf && i ? (this.jf(e), lA.info("starting")) : (this.Of = lC, this.stopRecording())
			}
			jf(e) {
				var t, i, r, s;
				if (this.Nf)
					if ("awaiting_config" !== this.Of && "missing_config" !== this.Of && (this.Of = lM), (null == O || null == (t = O.__PosthogExtensions__) || null == (t = t.rrweb) ? void 0 : t.record) && (null == (i = O.__PosthogExtensions__) ? void 0 : i.initSessionRecording)) this.qf(e);
					else {
						let t = this._instance.sessionManager;
						null == (r = O.__PosthogExtensions__) || null == (s = r.loadExternalDependency) || s.call(r, this._instance, this.Bf, i => {
							if (!this.Df && this.Nf && this._instance.sessionManager === t) return i ? (this._instance.register_for_session({
								$sdk_debug_recording_script_not_loaded: !0
							}), lA.error("could not load recorder", i)) : void this.qf(e);
							this.Of = "disabled"
						})
					}
			}
			stopRecording() {
				var e, t;
				null == (e = this.Ff) || e.call(this), this.Ff = void 0, null == (t = this.Pf) || t.stop()
			}
			Lf(e = !1) {
				var t, i;
				null == (t = this.Ff) || t.call(this), this.Ff = void 0, null == (i = this.Pf) || i.discard({
					discardProducerEvents: e
				})
			}
			zf() {
				var e, t;
				null == (e = this.Pc) || e.unregister("$session_is_sampled"), null == (t = this.Pc) || t.unregister("$replay_sample_rate")
			}
			Hf(e, t) {
				if (Z(e)) return null;
				let i = Q(e) ? e : parseFloat(e);
				return "number" != typeof i || !Number.isFinite(i) || 0 > i || i > 1 ? (lA.warn(`${t} must be between 0 and 1. Ignoring invalid value:`, e), null) : i
			}
			Uf(e) {
				if (this.Pc) {
					var t, i;
					let r = this.Pc,
						s = () => {
							var t;
							let i = !1 === e.sessionRecording ? void 0 : e.sessionRecording,
								s = this.Hf(null == (t = this.Fr.session_recording) ? void 0 : t.sampleRate, "session_recording.sampleRate"),
								n = this.Hf(null == i ? void 0 : i.sampleRate, "remote config sampleRate"),
								o = null != s ? s : n;
							Z(o) && this.zf();
							let a = null == i ? void 0 : i.minimumDurationMilliseconds;
							r.register({
								[rY]: tS(tS({
									cache_timestamp: Date.now(),
									enabled: !!i
								}, i), {}, {
									networkPayloadCapture: tS({
										capturePerformance: e.capturePerformance
									}, null == i ? void 0 : i.networkPayloadCapture),
									canvasRecording: {
										enabled: null == i ? void 0 : i.recordCanvas,
										fps: null == i ? void 0 : i.canvasFps,
										quality: null == i ? void 0 : i.canvasQuality
									},
									sampleRate: o,
									minimumDurationMilliseconds: J(a) ? null : a,
									endpoint: null == i ? void 0 : i.endpoint,
									triggerMatchType: null == i ? void 0 : i.triggerMatchType,
									masking: null == i ? void 0 : i.masking,
									urlTriggers: null == i ? void 0 : i.urlTriggers,
									version: null == i ? void 0 : i.version,
									triggerGroups: null == i ? void 0 : i.triggerGroups
								})
							})
						};
					s(), null == (t = this.Ff) || t.call(this), this.Ff = null == (i = this._instance.sessionManager) ? void 0 : i.onSessionId(s)
				}
			}
			onRemoteConfig(e) {
				let t = e.ok ? e.config : void 0;
				return t && "sessionRecording" in t ? !1 === t.sessionRecording ? (this.Uf(t), void this.Lf()) : (this.Uf(t), void this.startIfEnabledOrStop()) : ("awaiting_config" === this.Of && (this.Of = "missing_config", this._instance.register_for_session({
					[sr]: !0
				}), lA.warn("config refresh failed, recording will not start until page reload")), void this.startIfEnabledOrStop())
			}
			log(e, t = "log") {
				var i;
				(null == (i = this.Pf) ? void 0 : i.log) ? this.Pf.log(e, t): lA.warn("log called before recorder was ready")
			}
			get Bf() {
				var e, t;
				let i = null == (e = this._instance) || null == (e = e.persistence) ? void 0 : e.get_property(rY);
				return (null == i || null == (t = i.scriptConfig) ? void 0 : t.script) || "lazy-recorder"
			}
			Wf() {
				let e, t = this._instance.get_property(rY);
				if (!t) return !1;
				try {
					e = "object" == typeof t ? t : JSON.parse(t)
				} catch (e) {
					return lA.warn("persisted remote config for session recording is invalid and will be ignored", e), !1
				}
				return !Z(e.cache_timestamp) && 36e5 >= Date.now() - e.cache_timestamp
			}
			qf(e) {
				var t, i, r, s;
				if (!this.Df && this.Nf && this._instance.sessionManager) {
					if (!(null == (t = O.__PosthogExtensions__) ? void 0 : t.initSessionRecording)) return lA.warn("Called on script loaded before session recording is available. This can be caused by adblockers."), void this._instance.register_for_session({
						[si]: !0
					});
					if (this.Pf || (this.Pf = null == (s = O.__PosthogExtensions__) ? void 0 : s.initSessionRecording(this._instance, this.Ye), this.Pf._forceAllowLocalhostNetworkCapture = this._forceAllowLocalhostNetworkCapture), !this.Wf()) {
						if ("missing_config" === this.Of || "awaiting_config" === this.Of) return;
						return this.Of = "awaiting_config", lA.info("persisted remote config is stale, requesting fresh config before starting"), void new oT(this._instance).load()
					}
					this.Of = lM, null == (i = (r = this.Pf).setDocumentWasEverVisible) || i.call(r, this.Ye), this.Pf.start(e)
				} else this.Of = lC
			}
			onRRwebEmit(e) {
				var t, i;
				null == (t = this.Pf) || null == (i = t.onRRwebEmit) || i.call(t, e)
			}
			overrideLinkedFlag() {
				var e, t;
				this.Pf || null == (t = this.Pc) || t.register({
					$replay_override_linked_flag: !0
				}), null == (e = this.Pf) || e.overrideLinkedFlag()
			}
			overrideSampling() {
				var e, t;
				this.Pf || null == (t = this.Pc) || t.register({
					$replay_override_sampling: !0
				}), null == (e = this.Pf) || e.overrideSampling()
			}
			overrideTrigger(e) {
				var t, i;
				this.Pf || null == (i = this.Pc) || i.register({
					["url" === e ? "$replay_override_url_trigger" : "$replay_override_event_trigger"]: !0
				}), null == (t = this.Pf) || t.overrideTrigger(e)
			}
			get sdkDebugProperties() {
				var e, t;
				let i = {};
				for (let e of lL) {
					let r = null == (t = this._instance.sessionPersistence) ? void 0 : t.get_property(e);
					J(r) || (i[e] = r)
				}
				return tS(tS({}, i), (null == (e = this.Pf) ? void 0 : e.sdkDebugProperties) || {
					$recording_status: this.status
				})
			}
			tryAddCustomEvent(e, t) {
				var i;
				return !!(null == (i = this.Pf) ? void 0 : i.tryAddCustomEvent(e, t))
			}
			flushBeforeIdentityReset() {
				var e, t;
				null == (e = this.Pf) || null == (t = e.flushBeforeIdentityReset) || t.call(e)
			}
		}
	}, {
		autocapture: class extends a5 {
			constructor(e) {
				super(new lk(e)), this.instance = e
			}
		},
		historyAutocapture: class {
			constructor(e) {
				this.Vf = !1, this._instance = e, this.Gf = this.Qf()
			}
			initialize() {
				this.startIfEnabled()
			}
			get isEnabled() {
				let e = this.Jf();
				return !!(e.path || e.search || this.Zf(e))
			}
			startIfEnabled() {
				this.isEnabled && (rr.info("History API monitoring enabled, starting..."), this.monitorHistoryChanges())
			}
			startIfEnabledOrStop() {
				this.stop(), this.Gf = this.Qf(), this.startIfEnabled()
			}
			stop() {
				this.Kf && this.Kf(), this.Kf = void 0, this.Yf && this.Yf(), this.Yf = void 0, rr.info("History API monitoring stopped")
			}
			monitorHistoryChanges() {
				y && y.history && (this.Xf("pushState"), this.Xf("replaceState"), this.tp(), this.Zf() && this.ep())
			}
			Xf(e) {
				var t;
				if (!y || (null == (t = y.history[e]) ? void 0 : t.__posthog_wrapped__)) return;
				let i = this;
				lF(y.history, e, t => function(r, s, n) {
					var o;
					i.np(n) && i.sp(), t.call(this, r, s, n), i.rp(e, !i.Vf && "popstate" !== (null == y || null == (o = y.event) ? void 0 : o.type))
				})
			}
			Qf() {
				let e = null == y ? void 0 : y.location;
				if (null == e ? void 0 : e.pathname) return {
					pathname: e.pathname,
					search: e.search,
					hash: e.hash
				}
			}
			Jf() {
				let e = this._instance.config.capture_pageview;
				return "history_change" === e ? {
					path: !0
				} : W(e) ? e : {}
			}
			Zf(e = this.Jf()) {
				return !!e.hash && !this._instance.config.disable_capture_url_hashes
			}
			op(e) {
				let t = this.Jf(),
					i = this.Gf;
				return !(!i || !(t.path && e.pathname !== i.pathname || t.search && e.search !== i.search || this.Zf(t) && e.hash !== i.hash))
			}
			rp(e, t = !1) {
				try {
					t || this.sp();
					let i = this.Qf();
					if (!i) return;
					if (this.op(i)) {
						let i = () => this._instance.capture(sg, {
							navigation_type: e
						});
						t ? (this.ap = i, Promise.resolve().then(() => this.sp())) : i()
					}
					this.Gf = i
				} catch (t) {
					rr.error(`Error capturing ${e} pageview`, t)
				}
			}
			np(e) {
				var t, i;
				return !(Z(e) || !y) && (null == (t = nJ(String(e))) ? void 0 : t.href) !== (null == (i = y.location) ? void 0 : i.href)
			}
			sp() {
				let e = this.ap;
				if (e) {
					this.ap = void 0, this.Vf = !0;
					try {
						e()
					} catch (e) {
						rr.error("Error capturing deferred pageview", e)
					} finally {
						this.Vf = !1
					}
					this.Gf = this.Qf()
				}
			}
			tp() {
				if (this.Kf) return;
				let e = () => {
					this.rp("popstate")
				};
				sF(y, "popstate", e), this.Kf = () => {
					y && y.removeEventListener("popstate", e)
				}
			}
			ep() {
				if (this.Yf) return;
				let e = () => {
					this.rp("hashchange")
				};
				sF(y, "hashchange", e), this.Yf = () => {
					y && y.removeEventListener("hashchange", e)
				}
			}
		},
		heatmaps: class {
			get Fr() {
				return this.instance.config
			}
			constructor(e) {
				var t;
				this.lp = !1, this._l = !1, this.up = null, this.instance = e, this.lp = !!(null == (t = this.instance.persistence) ? void 0 : t.props[rH]), this.rageclicks = new aY(e.config.rageclick)
			}
			initialize() {
				this.startIfEnabled()
			}
			get flushIntervalMilliseconds() {
				let e = 5e3;
				return W(this.Fr.capture_heatmaps) && this.Fr.capture_heatmaps.flush_interval_milliseconds && (e = this.Fr.capture_heatmaps.flush_interval_milliseconds), e
			}
			get isEnabled() {
				return Z(this.Fr.capture_heatmaps) ? Z(this.Fr.enable_heatmaps) ? this.lp : this.Fr.enable_heatmaps : !1 !== this.Fr.capture_heatmaps
			}
			startIfEnabled() {
				if (this.isEnabled) this._l || (lD.info("starting..."), this.cp(), this.an());
				else {
					var e;
					clearInterval(null != (e = this.up) ? e : void 0), this.hp(), this.getAndClearBuffer()
				}
			}
			onRemoteConfig(e) {
				if (!e.ok) return;
				let t = e.config;
				if (!("heatmaps" in t)) return;
				let i = !!t.heatmaps;
				this.instance.persistence && this.instance.persistence.register({
					[rH]: i
				}), this.lp = i, this.startIfEnabled()
			}
			getAndClearBuffer() {
				let e = this.Rt;
				return this.Rt = void 0, e
			}
			dp(e) {
				lN(e.originalEvent) && this.Pr(e.originalEvent, "deadclick")
			}
			an() {
				this.up && clearInterval(this.up), this.up = "visible" === (null == x ? void 0 : x.visibilityState) ? setInterval(this.bc.bind(this), this.flushIntervalMilliseconds) : null
			}
			cp() {
				y && x && (this.vp = this.bc.bind(this), sF(y, sf, this.vp), this.fp = e => this.Pr(e || (null == y ? void 0 : y.event)), sF(x, "click", this.fp, {
					capture: !0
				}), this.pp = e => this.gp(e || (null == y ? void 0 : y.event)), sF(x, "mousemove", this.pp, {
					capture: !0
				}), this.mp = new nL(this.instance, nM, this.dp.bind(this)), this.mp.startIfEnabledOrStop(), this.yp = this.an.bind(this), sF(x, rE, this.yp), this._l = !0)
			}
			hp() {
				var e;
				y && x && (this.vp && y.removeEventListener(sf, this.vp), this.fp && x.removeEventListener("click", this.fp, {
					capture: !0
				}), this.pp && x.removeEventListener("mousemove", this.pp, {
					capture: !0
				}), this.yp && x.removeEventListener(rE, this.yp), clearTimeout(this.bp), null == (e = this.mp) || e.stop(), this._l = !1)
			}
			_p(e, t) {
				let i = this.instance.scrollManager.scrollY(),
					r = this.instance.scrollManager.scrollX(),
					s = this.instance.scrollManager.scrollElement(),
					n = function(e, t, i) {
						let r = e;
						for (; r && s5(r) && !s4(r, "body");) {
							let e;
							if (r === i) break;
							try {
								var s, n, o;
								e = null == (s = null != (n = null == (o = r.ownerDocument) ? void 0 : o.defaultView) ? n : y) ? void 0 : s.getComputedStyle(r).position
							} catch (e) {
								break
							}
							if (D(t, e)) return !0;
							r = na(r)
						}
						return !1
					}(nr(e), ["fixed", "sticky"], s);
				return {
					x: e.clientX + (n ? 0 : r),
					y: e.clientY + (n ? 0 : i),
					target_fixed: n,
					type: t
				}
			}
			Pr(e, t = "click") {
				var i;
				if (s3(e.target) || !lN(e)) return;
				let r = this._p(e, t);
				(null == (i = this.rageclicks) ? void 0 : i.isRageClick(e.clientX, e.clientY, (new Date).getTime())) && ny(nr(e), this.instance.config.rageclick) && this.Ks(tS(tS({}, r), {}, {
					type: "rageclick"
				})), this.Ks(r)
			}
			gp(e) {
				!s3(e.target) && lN(e) && (clearTimeout(this.bp), this.bp = setTimeout(() => {
					this.Ks(this._p(e, "mousemove"))
				}, 500))
			}
			Ks(e) {
				if (!y) return;
				let t = this.Fr.disable_capture_url_hashes ? tm(y.location.href) : y.location.href,
					i = this.Fr.custom_personal_data_properties,
					r = n0(t, this.Fr.mask_personal_data_properties ? [...n2, ...i || []] : [], n5);
				this.Rt = this.Rt || {}, this.Rt[r] || (this.Rt[r] = []), this.Rt[r].push(e)
			}
			bc() {
				this.Rt && !V(this.Rt) && this.instance.capture("$$heatmap", {
					$heatmap_data: this.getAndClearBuffer()
				})
			}
		},
		deadClicksAutocapture: nL,
		webVitalsAutocapture: class {
			constructor(e) {
				var t;
				this._instance = e, this.lp = !1, this._l = !1, this.Rt = {
					navigationKey: void 0,
					url: void 0,
					metrics: [],
					firstMetricTimestamp: void 0
				}, this.wp = (e = !1) => {
					clearTimeout(this.kp), this.kp = void 0, 0 !== this.Rt.metrics.length && (this._instance.capture("$web_vitals", tS({
						$current_url: this.Rt.url
					}, this.Rt.metrics.reduce((e, t) => tS(tS({}, e), {}, {
						[`$web_vitals_${t.name}_event`]: tS({}, t),
						[`$web_vitals_${t.name}_value`]: t.value
					}), {})), e ? {
						transport: "sendBeacon",
						send_instantly: !0
					} : void 0), this.Rt = {
						navigationKey: void 0,
						url: void 0,
						metrics: [],
						firstMetricTimestamp: void 0
					})
				}, this.Sp = e => {
					var t;
					if (this.Rt = this.Rt || {
							navigationKey: void 0,
							url: void 0,
							metrics: [],
							firstMetricTimestamp: void 0
						}, Z(null == e ? void 0 : e.name) || Z(null == e ? void 0 : e.value)) return void lT.error("Invalid metric received", e);
					let i = "string" == typeof e.navigationURL ? e.navigationURL : void 0,
						r = this.xp(i);
					if (J(r)) return;
					let s = Q(e.navigationId) || "string" == typeof e.navigationId ? `navigation:${e.navigationId}` : `url:${r}`;
					if (this.$p && e.value >= this.$p) return void lT.error("Ignoring metric with value >= " + this.$p, e);
					this.Rt.navigationKey !== s && (this.wp(), this.kp = setTimeout(this.wp, this.flushToCaptureTimeoutMs)), J(this.Rt.navigationKey) && (this.Rt.navigationKey = s, this.Rt.url = r), this.Rt.firstMetricTimestamp = J(this.Rt.firstMetricTimestamp) ? Date.now() : this.Rt.firstMetricTimestamp;
					let n = null == (t = this._instance.sessionManager) ? void 0 : t.checkAndGetSessionAndWindowId(!0),
						o = tS(tS(tS({}, e), i ? {
							navigationURL: r
						} : {}), {}, {
							$current_url: r,
							timestamp: Date.now()
						});
					if (delete o.entries, W(e.attribution) && this.attributionMetrics.indexOf(e.name) > -1) {
						let t = {};
						for (let i of lR) {
							let r = "url" === i && "string" == typeof e.attribution[i] ? this.xp(e.attribution[i]) : e.attribution[i];
							J(r) || (t[i] = r)
						}
						o.attribution = t
					} else delete o.attribution;
					J(n) || (o.$session_id = n.sessionId, o.$window_id = n.windowId), this.Rt.metrics.push(o), this.Rt.metrics.length === this.allowedMetrics.length && this.wp()
				}, this.Cp = () => {
					if (this._l) return;
					let e, t, i, r, s = !1,
						n = O.__PosthogExtensions__,
						o = null == n ? void 0 : n.postHogWebVitalsCallbacksByFlavor,
						a = (null == o ? void 0 : o[this.Tp]) || ("web-vitals" === this.Tp && J(o) ? null == n ? void 0 : n.postHogWebVitalsCallbacks : void 0);
					if (!J(a)) {
						let n = a.withoutAttribution,
							o = this.attributionMetrics;
						s = !J(n), e = o.indexOf("LCP") > -1 ? a.onLCP : (null == n ? void 0 : n.onLCP) || a.onLCP, t = o.indexOf("CLS") > -1 ? a.onCLS : (null == n ? void 0 : n.onCLS) || a.onCLS, i = o.indexOf("FCP") > -1 ? a.onFCP : (null == n ? void 0 : n.onFCP) || a.onFCP, r = o.indexOf("INP") > -1 ? a.onINP : (null == n ? void 0 : n.onINP) || a.onINP
					}
					if (!(e && t && i && r)) return void lT.error("web vitals callbacks not loaded - not starting");
					let l = {
							reportSoftNavs: this.useSoftNavs
						},
						u = s && this.attributionMetrics.indexOf("INP") > -1 ? tS(tS({}, l), {}, {
							includeProcessedEventEntries: !1
						}) : l;
					this.allowedMetrics.indexOf("LCP") > -1 && e(this.Sp.bind(this), l), this.allowedMetrics.indexOf("CLS") > -1 && t(this.Sp.bind(this), l), this.allowedMetrics.indexOf("FCP") > -1 && i(this.Sp.bind(this), l), this.allowedMetrics.indexOf("INP") > -1 && r(this.Sp.bind(this), u);
					let c = null == y ? void 0 : y.document;
					sF(c, rE, () => {
						"hidden" === (null == c ? void 0 : c.visibilityState) && this.wp(!0)
					}), sF(y, "pagehide", () => this.wp(!0)), this._l = !0
				}, this.lp = !!(null == (t = this._instance.persistence) ? void 0 : t.props[rG]), this.startIfEnabled()
			}
			get Ip() {
				return this._instance.config.capture_performance
			}
			get allowedMetrics() {
				var e, t;
				let i = W(this.Ip) ? null == (e = this.Ip) ? void 0 : e.web_vitals_allowed_metrics : void 0;
				return Z(i) ? (null == (t = this._instance.persistence) ? void 0 : t.props.$web_vitals_allowed_metrics) || lO : i
			}
			get flushToCaptureTimeoutMs() {
				return (W(this.Ip) ? this.Ip.web_vitals_delayed_flush_ms : void 0) || 5e3
			}
			get attributionMetrics() {
				let e = W(this.Ip) ? this.Ip.web_vitals_attribution : void 0;
				return et(e) ? e ? lO : [] : q(e) ? e : lI
			}
			get useAttribution() {
				return this.attributionMetrics.length > 0
			}
			get useSoftNavs() {
				let e = W(this.Ip) ? this.Ip.__preview_web_vitals_soft_navs : void 0;
				return null != e && e
			}
			get $p() {
				let e = W(this.Ip) && Q(this.Ip.__web_vitals_max_value) ? this.Ip.__web_vitals_max_value : 9e5;
				return e > 0 && 6e4 >= e ? 9e5 : e
			}
			get isEnabled() {
				let e = null == k ? void 0 : k.protocol;
				if ("http:" !== e && "https:" !== e) return lT.info("Web Vitals are disabled on non-http/https protocols"), !1;
				let t = W(this.Ip) ? this.Ip.web_vitals : et(this.Ip) ? this.Ip : void 0;
				return et(t) ? t : this.lp
			}
			startIfEnabled() {
				this.isEnabled && !this._l && (lT.info("enabled, starting..."), this.Bl(this.Cp))
			}
			onRemoteConfig(e) {
				if (!e.ok) return;
				let t = e.config;
				if (!("capturePerformance" in t)) return;
				let i = W(t.capturePerformance) && !!t.capturePerformance.web_vitals,
					r = W(t.capturePerformance) ? t.capturePerformance.web_vitals_allowed_metrics : void 0;
				this._instance.persistence && (this._instance.persistence.register({
					[rG]: i
				}), this._instance.persistence.register({
					[rK]: r
				})), this.lp = i, this.startIfEnabled()
			}
			get Tp() {
				return this.useSoftNavs ? this.useAttribution ? "web-vitals-with-attribution-soft-navs" : "web-vitals-soft-navs" : this.useAttribution ? "web-vitals-with-attribution" : "web-vitals"
			}
			Bl(e) {
				var t;
				let i = O.__PosthogExtensions__,
					r = this.Tp,
					s = null == i ? void 0 : i.postHogWebVitalsCallbacksByFlavor;
				(null == s ? void 0 : s[r]) || "web-vitals" === r && J(s) && (null == i ? void 0 : i.postHogWebVitalsCallbacks) ? e() : null == i || null == (t = i.loadExternalDependency) || t.call(i, this._instance, r, t => {
					t ? lT.error("failed to load script", t) : e()
				})
			}
			xp(e) {
				let t = e || (null == y ? void 0 : y.location.href);
				if (!t) return void lT.error("Could not determine current URL");
				let i = this._instance.config.disable_capture_url_hashes ? tm(t) : t,
					r = this._instance.config.custom_personal_data_properties;
				return n0(i, this._instance.config.mask_personal_data_properties ? [...n2, ...r || []] : [], n5)
			}
		}
	}, {
		exceptionObserver: class {
			constructor(e) {
				var t;
				this.Cp = () => {
					var e;
					if (!y || !this.isEnabled || !(null == (e = O.__PosthogExtensions__) ? void 0 : e.errorWrappingFunctions)) return;
					let t = O.__PosthogExtensions__.errorWrappingFunctions.wrapOnError,
						i = O.__PosthogExtensions__.errorWrappingFunctions.wrapUnhandledRejection,
						r = O.__PosthogExtensions__.errorWrappingFunctions.wrapConsoleError;
					try {
						!this.Mp && this.Fr.capture_unhandled_errors && (this.Mp = t(this.captureException.bind(this))), !this.Ep && this.Fr.capture_unhandled_rejections && (this.Ep = i(this.captureException.bind(this))), !this.Ap && this.Fr.capture_console_errors && (this.Ap = r(this.captureException.bind(this)))
					} catch (e) {
						lE.error("failed to start", e), this.Rp()
					}
				}, this._instance = e, this.Pp = !!(null == (t = this._instance.persistence) ? void 0 : t.props[rU]), this.kt = new e_(tS(tS({}, function(e = {}) {
					var t, i, r, s;
					return {
						refillRate: null != (t = null != (i = e.exceptionRateLimiterRefillRate) ? i : e.__exceptionRateLimiterRefillRate) ? t : 1,
						bucketSize: null != (r = null != (s = e.exceptionRateLimiterBucketSize) ? s : e.__exceptionRateLimiterBucketSize) ? r : 10
					}
				}(this._instance.config.error_tracking)), {}, {
					refillInterval: 1e4,
					R: lE
				})), this.Fr = this.Op(), this.startIfEnabledOrStop()
			}
			Op() {
				let e = this._instance.config.capture_exceptions,
					t = {
						capture_unhandled_errors: !1,
						capture_unhandled_rejections: !1,
						capture_console_errors: !1
					};
				return W(e) ? t = tS(tS({}, t), e) : (J(e) ? this.Pp : e) && (t = tS(tS({}, t), {}, {
					capture_unhandled_errors: !0,
					capture_unhandled_rejections: !0
				})), t
			}
			get isEnabled() {
				return this.Fr.capture_console_errors || this.Fr.capture_unhandled_errors || this.Fr.capture_unhandled_rejections
			}
			startIfEnabledOrStop() {
				this.isEnabled ? (lE.info("enabled"), this.Rp(), this.Bl(this.Cp)) : this.Rp()
			}
			Bl(e) {
				var t, i, r;
				(null == (t = O.__PosthogExtensions__) ? void 0 : t.errorWrappingFunctions) ? e(): null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this._instance, "exception-autocapture", t => {
					if (t) return lE.error("failed to load script", t);
					e()
				})
			}
			Rp() {
				var e, t, i;
				null == (e = this.Mp) || e.call(this), this.Mp = void 0, null == (t = this.Ep) || t.call(this), this.Ep = void 0, null == (i = this.Ap) || i.call(this), this.Ap = void 0
			}
			onRemoteConfig(e) {
				if (!e.ok) return;
				let t = e.config;
				"autocaptureExceptions" in t && (this.Pp = !!t.autocaptureExceptions, this._instance.persistence && this._instance.persistence.register({
					[rU]: this.Pp
				}), this.Fr = this.Op(), this.startIfEnabledOrStop())
			}
			onConfigChange() {
				this.Fr = this.Op()
			}
			captureException(e) {
				try {
					var t, i, r;
					let s = null != (t = null == e || null == (i = e.$exception_list) || null == (i = i[0]) ? void 0 : i.type) ? t : "Exception";
					if (this.kt.consumeRateLimit(s)) return void lE.info("Skipping exception capture because of client rate limiting.", {
						exception: s
					});
					null == (r = this._instance.exceptions) || r.sendExceptionEvent(e)
				} catch (e) {}
			}
		},
		exceptions: class {
			constructor(e) {
				var t, i;
				this.Fp = [], this.Dp = new tF([new tB, new tQ, new tG, new tq, new tX, new tY, new tV, new tZ], function(e, ...t) {
					return (i, r = 0) => {
						let s = [],
							n = i.split("\n"),
							o = Math.min(n.length, r + 1e3),
							a = [];
						for (let i = r; o > i; i++) {
							let r = n[i];
							if (r.length > 1024) continue;
							let o = tj.test(r) ? r.replace(tj, "$1") : r;
							if (!o.match(/\S*Error: /)) {
								for (let i of t) {
									let t = i(o, e);
									if (t) {
										s.push(t);
										let e = function(e) {
											for (let t = 1; 10 >= t; t++) {
												let i = e.length - 2 * t;
												if (0 > i) break;
												let r = !0;
												for (let s = 0; t > s; s++)
													if (!tz(e[i + s], e[i + t + s])) {
														r = !1;
														break
													} if (r) {
													for (let r = 0; t > r; r++) e[i + r] = e[i + t + r];
													return e.length = i + t, {
														start: i,
														length: t
													}
												}
											}
										}(s);
										if (e) {
											for (let t = a.length - 1; t >= 0; t--) {
												let i = a[t];
												if (e.start >= i.start + i.length) break;
												a.pop()
											}
											a.push(e)
										}
										break
									}
								}
								if (function(e, t) {
										let i = t[0],
											r = e.length - (i ? tH(e, i) : 0);
										for (let i of t) r -= tU(e, i);
										return r
									}(s, a) >= 50) break
							}
						}
						let l = [...a].sort((e, t) => t.start - e.start),
							u = l[l.length - 1];
						if (u) {
							let e = tH(s, u);
							for (let t of (s.splice(u.start - e, e), l)) t.start -= e
						}
						for (let e of l) ! function(e, t) {
							let i = t.start + t.length,
								r = tU(e, t);
							r && e.splice(i + r === e.length ? i : t.start, r)
						}(s, e);
						return a.some(e => 0 === e.start && s.length === e.length) && function(e) {
								let t = e.map(e => `${e.function}|${e.filename}|${e.lineno}|${e.colno}|${e.module}`),
									i = 0;
								for (let e = 1; t.length > e; e++)(function(e, t, i) {
									for (let r = 0; e.length > r; r++) {
										let s = e[(t + r) % e.length],
											n = e[(i + r) % e.length];
										if (s !== n) return n > s
									}
									return !1
								})(t, e, i) && (i = e);
								e.push(...e.splice(0, i))
							}(s),
							function(e) {
								if (!e.length) return [];
								let t = Array.from(e);
								return t.reverse(), t.slice(0, 50).map(e => tS(tS({}, e), {}, {
									filename: e.filename || (t[t.length - 1] || {}).filename,
									function: e.function || "?"
								}))
							}(s)
					}
				}("web:javascript", tA, tN)), this._instance = e, this.Fp = null != (t = null == (i = this._instance.persistence) ? void 0 : i.get_property("$error_tracking_suppression_rules")) ? t : [], this.Lp = t5(this.Np()), this.jp = new t4(this.Lp)
			}
			onConfigChange() {
				this.Lp = t5(this.Np()), this.jp.setConfig(this.Lp)
			}
			onRemoteConfig(e) {
				var t, i, r;
				if (!e.ok) return;
				let s = e.config;
				if (!("errorTracking" in s)) return;
				let n = null != (t = null == (i = s.errorTracking) ? void 0 : i.suppressionRules) ? t : [],
					o = null == (r = s.errorTracking) ? void 0 : r.captureExtensionExceptions;
				this.Fp = n, this._instance.persistence && this._instance.persistence.register({
					[rB]: this.Fp,
					[rq]: o
				})
			}
			get qp() {
				var e;
				let t = !!this._instance.get_property(rq),
					i = this._instance.config.error_tracking.captureExtensionExceptions;
				return null != (e = null != i ? i : t) && e
			}
			buildProperties(e, t) {
				return this.Dp.buildFromUnknown(e, {
					syntheticException: null == t ? void 0 : t.syntheticException,
					mechanism: {
						handled: null == t ? void 0 : t.handled
					}
				})
			}
			addExceptionStep(e, t) {
				if (this.Lp.enabled) try {
					if (!K(e) || 0 === e.trim().length) return void uo.warn("Ignoring exception step because message must be a non-empty string");
					let {
						sanitizedProperties: i,
						droppedKeys: r
					} = function(e) {
						if (!e) return {
							sanitizedProperties: {},
							droppedKeys: []
						};
						let t = [];
						return {
							sanitizedProperties: Object.keys(e).reduce((i, r) => (t2.has(r) ? t.push(r) : i[r] = e[r], i), {}),
							droppedKeys: t
						}
					}(this.Bp(t));
					r.length > 0 && uo.warn("Ignoring reserved exception step fields", {
						droppedKeys: r
					}), this.jp.add(tS({
						[t0]: e,
						[t1]: (new Date).toISOString()
					}, i))
				} catch (e) {
					uo.error("Failed to add exception step. Ignoring breadcrumb.", e)
				}
			}
			sendExceptionEvent(e) {
				try {
					let t = e.$exception_list;
					if (this.zp(t)) {
						if (this.Hp(t)) return this.Up("Exception dropped: matched a suppression rule"), void uo.info("Skipping exception capture because a suppression rule matched");
						if (!this.qp && this.Wp(t)) return this.Up("Exception dropped: thrown by a browser extension"), void uo.info("Skipping exception capture because it was thrown by an extension");
						if (!this.qp && this.Vp(t)) return this.Up("Exception dropped: thrown by an injected browser script"), void uo.info("Skipping exception capture because it was thrown by an injected browser script");
						if (!this._instance.config.error_tracking.__capturePostHogExceptions && this.Gp(t)) return this.Up("Exception dropped: thrown by the PostHog SDK"), void uo.info("Skipping exception capture because it was thrown by the PostHog SDK")
					}
					let i = this.Lp.enabled && Z(e.$exception_steps) ? this.Qp(e) : e,
						r = function() {
							if ("u" > typeof m.default) {
								var e;
								let t = null == (e = m.default.env.POSTHOG_RELEASE_ID) ? void 0 : e.trim();
								if (t) return t
							}
							let t = globalThis._posthogReleaseId;
							return "string" == typeof t && t.length > 0 ? t : void 0
						}();
					r && (i.$release_id = r);
					try {
						let e = this._instance.capture("$exception", i, {
							_noTruncate: !0,
							_batchKey: "exceptionEvent",
							_d: !0
						});
						return e && this.jp.clear(), e
					} catch (e) {
						return un(e) || uo.error("Failed to capture exception event. Dropping this exception.", e), void this.jp.clear()
					}
				} catch (e) {
					return void(un(e) || uo.error("Failed to process exception event. Ignoring this exception.", e))
				}
			}
			Qp(e) {
				try {
					let t = this.jp.getAttachable();
					return 0 === t.length ? e : tS(tS({}, e), {}, {
						$exception_steps: t
					})
				} catch (t) {
					return uo.error("Failed to read buffered exception steps. Capturing exception without steps.", t), e
				}
			}
			Up(e) {
				this.Lp.enabled && this.jp.add({
					[t0]: e,
					[t1]: (new Date).toISOString()
				})
			}
			Bp(e) {
				return W(e) ? tS({}, e) : {}
			}
			Np() {
				var e, t;
				return null != (e = null == (t = this._instance.config.error_tracking) ? void 0 : t.exception_steps) ? e : {}
			}
			Hp(e) {
				if (0 === e.length) return !1;
				try {
					let t = e.reduce((e, {
						type: t,
						value: i
					}) => (K(t) && t.length > 0 && e.$exception_types.push(t), K(i) && i.length > 0 && e.$exception_values.push(i), e), {
						$exception_types: [],
						$exception_values: []
					});
					return this.Fp.some(e => {
						let i = e.values.map(e => {
							let i = aA[e.operator],
								r = t[e.key];
							if (!i || !r) return !1;
							let s = q(e.value) ? e.value : [e.value];
							return s.length > 0 && i(s, r)
						});
						return "OR" === e.type ? i.some(Boolean) : i.every(Boolean)
					})
				} catch (e) {
					return uo.warn("Failed to evaluate suppression rules. Capturing the exception.", e), !1
				}
			}
			Wp(e) {
				let t = e.flatMap(e => {
						var t, i;
						return null != (t = null == (i = e.stacktrace) ? void 0 : i.frames) ? t : []
					}),
					i = t.filter(({
						filename: e
					}) => !!e && uu.some(t => e.startsWith(t)));
				return 0 !== i.length && (!i.every(({
					filename: e
				}) => !!e && e.startsWith(ua)) || e.some(({
					type: e,
					value: t
				}) => "NoResponse" === e || K(t) && ul.some(({
					value: e,
					exact: i
				}) => i ? t === e : t.includes(e))) && !t.some(({
					in_app: e,
					filename: t
				}) => e && !(null == t ? void 0 : t.startsWith(ua))))
			}
			Vp(e) {
				return e.some(({
					value: e
				}) => K(e) && uc.some(t => e.includes(t)))
			}
			Gp(e) {
				if (e.length > 0) {
					var t, i, r, s;
					let n = null != (t = null == (i = e[0].stacktrace) ? void 0 : i.frames) ? t : [],
						o = n[n.length - 1];
					return null != (r = null == o || null == (s = o.filename) ? void 0 : s.includes("posthog.com/static")) && r
				}
				return !1
			}
			zp(e) {
				return !Z(e) && q(e)
			}
		}
	}, {
		productTours: class {
			get Pc() {
				return this._instance.persistence
			}
			constructor(e) {
				this.Jp = null, this.Zp = null, this._instance = e
			}
			initialize() {
				this.loadIfEnabled()
			}
			onRemoteConfig(e) {
				if (!e.ok) return;
				let t = e.config;
				if ("productTours" in t) {
					var i, r;
					if (this.Pc && this.Pc.register({
							[rV]: !!t.productTours
						}), !lz(this._instance)) return !this.Jp && Z(null == (i = this.Pc) ? void 0 : i.props.ph_product_tours) || lj.info("product tours disabled; stopping and clearing cached tours"), null == (r = this.Jp) || r.stop(), this.Jp = null, void this.clearCache();
					this.loadIfEnabled()
				}
			}
			loadIfEnabled() {
				!this.Jp && lz(this._instance) && this.Bl(() => this.Kp())
			}
			Bl(e) {
				var t, i, r;
				(null == (t = O.__PosthogExtensions__) ? void 0 : t.generateProductTours) ? e(): null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this._instance, "product-tours", t => {
					t ? lj.error("Could not load product tours script", t) : e()
				})
			}
			Kp() {
				var e;
				!this.Jp && (null == (e = O.__PosthogExtensions__) ? void 0 : e.generateProductTours) && (this.Jp = O.__PosthogExtensions__.generateProductTours(this._instance, !0))
			}
			getProductTours(e, t = !1) {
				if (q(this.Zp) && !t) return void e(this.Zp, {
					isLoaded: !0
				});
				let i = this.Pc;
				if (i) {
					let r = i.props[r0];
					if (q(r) && !t) return this.Zp = r, void e(r, {
						isLoaded: !0
					})
				}
				this._instance._send_request({
					url: this._instance.requestRouter.endpointFor("api", `/api/product_tours/?token=${this._instance.config.token}`),
					method: "GET",
					timestampMode: "query",
					callback: t => {
						if (!lz(this._instance)) return void e([], {
							isLoaded: !0
						});
						let r = t.statusCode;
						if (200 !== r || !t.json) {
							let i = `Product Tours API could not be loaded, status: ${r}`;
							return 0 === r ? t.error || lj.warn(i) : lj.error(i), void e([], {
								isLoaded: !1,
								error: i
							})
						}
						let s = q(t.json.product_tours) ? t.json.product_tours : [];
						this.Zp = s, i && i.register({
							[r0]: s
						}), e(s, {
							isLoaded: !0
						})
					}
				})
			}
			getActiveProductTours(e) {
				Z(this.Jp) ? e([], {
					isLoaded: !1,
					error: "Product tours not loaded"
				}) : this.Jp.getActiveProductTours(e)
			}
			showProductTour(e) {
				var t;
				null == (t = this.Jp) || t.showTourById(e)
			}
			previewTour(e) {
				this.Jp ? this.Jp.previewTour(e) : this.Bl(() => {
					var t;
					this.Kp(), null == (t = this.Jp) || t.previewTour(e)
				})
			}
			dismissProductTour() {
				var e;
				null == (e = this.Jp) || e.dismissTour("user_clicked_skip")
			}
			nextStep() {
				var e;
				null == (e = this.Jp) || e.nextStep()
			}
			previousStep() {
				var e;
				null == (e = this.Jp) || e.previousStep()
			}
			clearCache() {
				var e;
				this.Zp = null, null == (e = this.Pc) || e.unregister("ph_product_tours")
			}
			resetTour(e) {
				var t;
				null == (t = this.Jp) || t.resetTour(e)
			}
			resetAllTours() {
				var e;
				null == (e = this.Jp) || e.resetAllTours()
			}
			cancelPendingTour(e) {
				var t;
				null == (t = this.Jp) || t.cancelPendingTour(e)
			}
		},
		featureFlags: us
	}, {
		siteApps: class {
			constructor(e) {
				this._instance = e, this.Yp = 0, this.Xp = [], this.apps = {}
			}
			get isEnabled() {
				return !!this._instance.config.opt_in_site_apps
			}
			tg(e, t) {
				if (!t) return;
				let i = this.globalsForEvent(t);
				this.Xp.push(i), this.Xp.length > 1e3 && (this.Xp = this.Xp.slice(10))
			}
			get siteAppLoaders() {
				var e;
				return null == (e = O._POSTHOG_REMOTE_CONFIG) || null == (e = e[this._instance.config.token]) ? void 0 : e.siteApps
			}
			initialize() {
				if (this.isEnabled) {
					let e = this._instance._addCaptureHook(this.tg.bind(this));
					this.eg = () => {
						e(), this.Xp = [], this.eg = void 0
					}
				}
			}
			globalsForEvent(e) {
				var t, i, r, s, n, o, a;
				if (!e) throw Error("Event payload is required");
				let l = {},
					u = this._instance.get_property("$groups") || [];
				for (let [e, t] of Object.entries(this._instance.get_property("$stored_group_properties") || {})) l[e] = {
					id: u[e],
					type: e,
					properties: t
				};
				let {
					$set_once: c,
					$set: h
				} = e;
				return {
					event: tS(tS({}, il(e, lH)), {}, {
						properties: tS(tS(tS({}, e.properties), h ? {
							$set: tS(tS({}, null != (t = null == (i = e.properties) ? void 0 : i.$set) ? t : {}), h)
						} : {}), c ? {
							$set_once: tS(tS({}, null != (r = null == (s = e.properties) ? void 0 : s.$set_once) ? r : {}), c)
						} : {}),
						elements_chain: null != (n = null == (o = e.properties) ? void 0 : o.$elements_chain) ? n : "",
						distinct_id: null == (a = e.properties) ? void 0 : a.distinct_id
					}),
					person: {
						properties: this._instance.get_property("$stored_person_properties")
					},
					groups: l
				}
			}
			ig(e) {
				var t;
				let i = null == (t = e.tagName) ? void 0 : t.toLowerCase();
				return "style" === i && this._instance.config.prepare_external_dependency_stylesheet ? this._instance.config.prepare_external_dependency_stylesheet(e) || (lU.error("prepare_external_dependency_stylesheet returned null"), null) : "script" === i && this._instance.config.prepare_external_dependency_script ? this._instance.config.prepare_external_dependency_script(e) || (lU.error("prepare_external_dependency_script returned null"), null) : e
			}
			ng() {
				var e, t, i, r, s, n, o, a;
				if (!this._instance.config.prepare_external_dependency_stylesheet && !this._instance.config.prepare_external_dependency_script) return () => {};
				let l = null == x ? void 0 : x.defaultView,
					u = null == l || null == (e = l.Node) ? void 0 : e.prototype;
				if (!l || !u) return () => {};
				if (this.Yp++, this.sg) return this.rg();
				let c = [],
					h = this,
					d = new WeakSet,
					p = (e, t, i) => {
						if (!(null == e ? void 0 : e[t])) return;
						let r = e[t];
						e[t] = i(r), c.push(() => {
							e[t] = r
						})
					},
					f = e => {
						if (d.has(e)) return e;
						let t = h.ig(e);
						return t && d.add(t), t
					},
					g = e => e.map(e => "string" == typeof e ? e : f(e)).filter(e => !X(e));
				return p(u, "appendChild", e => function(t) {
					let i = f(t);
					return i ? e.call(this, i) : t
				}), p(u, "insertBefore", e => function(t, i) {
					let r = f(t);
					return r ? e.call(this, r, i) : t
				}), p(u, "replaceChild", e => function(t, i) {
					let r = f(t);
					return r ? e.call(this, r, i) : i
				}), [null == (t = l.Element) ? void 0 : t.prototype, null == (i = l.Document) ? void 0 : i.prototype, null == (r = l.DocumentFragment) ? void 0 : r.prototype].forEach(e => {
					p(e, "append", e => function(...t) {
						return e.apply(this, g(t))
					}), p(e, "prepend", e => function(...t) {
						return e.apply(this, g(t))
					})
				}), [null == (s = l.Element) ? void 0 : s.prototype, null == (n = l.CharacterData) ? void 0 : n.prototype, null == (o = l.DocumentType) ? void 0 : o.prototype].forEach(e => {
					p(e, "before", e => function(...t) {
						return e.apply(this, g(t))
					}), p(e, "after", e => function(...t) {
						return e.apply(this, g(t))
					}), p(e, "replaceWith", e => function(...t) {
						let i = g(t);
						return t.length && !i.length ? void 0 : e.apply(this, i)
					})
				}), p(null == (a = l.Element) ? void 0 : a.prototype, "insertAdjacentElement", e => function(t, i) {
					let r = f(i);
					return r ? e.call(this, t, r) : null
				}), this.sg = () => {
					c.forEach(e => e()), this.sg = void 0
				}, this.rg()
			}
			rg() {
				let e = !1;
				return () => {
					var t;
					e || (e = !0, this.Yp--, 0 === this.Yp && (null == (t = this.sg) || t.call(this)))
				}
			}
			og(e, t = !0) {
				let i = this.ng();
				try {
					let r = e(i);
					return t && i(), r
				} catch (e) {
					throw i(), e
				}
			}
			setupSiteApp(e) {
				let t = this.apps[e.id],
					i = () => {
						var i;
						!t.errored && this.Xp.length && (lU.info(`Processing ${this.Xp.length} events for site app with id ${e.id}`), this.Xp.forEach(e => this.og(() => {
							var i;
							return null == (i = t.processEvent) ? void 0 : i.call(t, e)
						})), t.processedBuffer = !0), Object.values(this.apps).every(e => e.processedBuffer || e.errored) && (null == (i = this.eg) || i.call(this))
					},
					r = !1,
					s = s => {
						t.errored = !s, t.loaded = !0, lU.info(`Site app with id ${e.id} ${s?"loaded":"errored"}`), r && i()
					};
				try {
					let {
						processEvent: i
					} = this.og(t => e.init({
						posthog: this._instance,
						callback(e) {
							t(), s(e)
						}
					}), !1);
					i && (t.processEvent = i), r = !0
				} catch (t) {
					lU.error(lB + e.id, t), s(!1)
				}
				if (r && t.loaded) try {
					i()
				} catch (i) {
					lU.error(`Error while processing buffered events PostHog app with config id ${e.id}`, i), t.errored = !0
				}
			}
			ag() {
				let e = this.siteAppLoaders || [];
				for (let t of e) this.apps[t.id] = {
					id: t.id,
					loaded: !1,
					errored: !1,
					processedBuffer: !1
				};
				for (let t of e) this.setupSiteApp(t)
			}
			lg(e) {
				if (0 === Object.keys(this.apps).length) return;
				let t = this.globalsForEvent(e);
				for (let i of Object.values(this.apps)) try {
					this.og(() => {
						var e;
						return null == (e = i.processEvent) ? void 0 : e.call(i, t)
					})
				} catch (t) {
					lU.error(`Error while processing event ${e.event} for site app ${i.id}`, t)
				}
			}
			onRemoteConfig(e) {
				var t, i, r, s, n;
				if (null == (t = this.siteAppLoaders) ? void 0 : t.length) return this.isEnabled ? (this.ag(), void this._instance.on("eventCaptured", e => this.lg(e))) : void lU.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.');
				if (null == (i = this.eg) || i.call(this), !e.ok) return;
				let o = e.config;
				if (null == (r = o.siteApps) ? void 0 : r.length)
					if (this.isEnabled)
						for (let {
								id: e,
								url: t
							}
							of o.siteApps) O[`__$$ph_site_app_${e}`] = this._instance, null == (s = O.__PosthogExtensions__) || null == (n = s.loadSiteApp) || n.call(s, this._instance, t, t => {
							if (t) return lU.error(lB + e, t)
						});
					else lU.error('PostHog site apps are disabled. Enable the "opt_in_site_apps" config to proceed.')
			}
		}
	}, {
		surveys: class extends lX {
			constructor(e) {
				super(new lZ(e))
			}
		},
		featureFlags: us
	}, {
		tracingHeaders: class {
			constructor(e) {
				this._instance = e, this.ug = void 0, this.cg = void 0, this.hg = void 0, this.Cp = () => {
					var e, t;
					let i = this.dg();
					i ? (J(this.ug) && (this.ug = null == (e = O.__PosthogExtensions__) || null == (e = e.tracingHeadersPatchFns) ? void 0 : e._patchXHR(i, () => this._instance.get_distinct_id(), this._instance.sessionManager)), J(this.cg) && (this.cg = null == (t = O.__PosthogExtensions__) || null == (t = t.tracingHeadersPatchFns) ? void 0 : t._patchFetch(i, () => this._instance.get_distinct_id(), this._instance.sessionManager))) : this.Rp()
				}
			}
			initialize() {
				this.startIfEnabledOrStop()
			}
			Bl(e) {
				var t, i, r;
				(null == (t = O.__PosthogExtensions__) ? void 0 : t.tracingHeadersPatchFns) ? e(): null == (i = O.__PosthogExtensions__) || null == (r = i.loadExternalDependency) || r.call(i, this._instance, "tracing-headers", t => {
					if (t) return lP.error("failed to load script", t);
					e()
				})
			}
			vg() {
				var e, t;
				return null != (e = null != (t = this._instance.config.tracing_headers) ? t : this._instance.config.addTracingHeaders) ? e : this._instance.config.__add_tracing_headers
			}
			dg() {
				let e = this.vg();
				return q(e) ? (q(this.hg) ? this.hg.splice(0, this.hg.length, ...e) : this.hg = [...e], e.length > 0 ? this.hg : void 0) : (q(this.hg) && this.hg.splice(0), this.hg = e || void 0, this.hg)
			}
			Rp() {
				var e, t;
				null == (e = this.ug) || e.call(this), null == (t = this.cg) || t.call(this), this.ug = void 0, this.cg = void 0
			}
			startIfEnabledOrStop() {
				this.dg() ? this.Bl(this.Cp) : this.Rp()
			}
		}
	}, {
		toolbar: class {
			constructor(e) {
				this.instance = e
			}
			fg(e) {
				O.ph_toolbar_state = e
			}
			pg() {
				var e;
				return null != (e = O.ph_toolbar_state) ? e : 0
			}
			initialize() {
				return this.maybeLoadToolbar()
			}
			maybeLoadToolbar(e, t, i) {
				var r, s;
				if (sP(this.instance.config) || !y || !x) return !1;
				e = null != (r = e) ? r : y.location, i = null != (s = i) ? s : y.history;
				try {
					let r;
					if (!t) {
						try {
							y.localStorage.setItem("test", "test"), y.localStorage.removeItem("test")
						} catch (e) {
							return !1
						}
						t = null == y ? void 0 : y.localStorage
					}
					let s = lQ || n1(e.hash, "__posthog") || n1(e.hash, "state"),
						n = s ? ty(() => JSON.parse(atob(decodeURIComponent(s)))) || ty(() => JSON.parse(decodeURIComponent(s))) : null;
					return n && "ph_authorize" === n.action ? ((r = n).source = "url", r && Object.keys(r).length > 0 && (n.desiredHash ? e.hash = n.desiredHash : i ? i.replaceState(i.state, "", e.pathname + e.search) : e.hash = "")) : ((r = JSON.parse(t.getItem(l0) || "{}")).source = "localstorage", delete r.userIntent), !(!r.token || this.instance.config.token !== r.token || (this.loadToolbar(r), 0))
				} catch (e) {
					return !1
				}
			}
			gg(e) {
				let t = O.ph_load_toolbar || O.ph_load_editor;
				!Z(t) && G(t) ? t(e, this.instance) : l1.warn("No toolbar load function found")
			}
			loadToolbar(e) {
				let t = !!(null == x ? void 0 : x.getElementById("__POSTHOG_TOOLBAR__"));
				if (!y || t) return !1;
				let i = "custom" === this.instance.requestRouter.region && this.instance.config.advanced_disable_toolbar_metrics,
					r = tS(tS({
						token: this.instance.config.token
					}, e), {}, {
						apiURL: this.instance.requestRouter.endpointFor("ui")
					}, i ? {
						instrument: !1
					} : {});
				if (y.localStorage.setItem(l0, JSON.stringify(tS(tS({}, r), {}, {
						source: void 0
					}))), 2 === this.pg()) this.gg(r);
				else if (0 === this.pg()) {
					var s, n;
					this.fg(1), null == (s = O.__PosthogExtensions__) || null == (n = s.loadExternalDependency) || n.call(s, this.instance, "toolbar", e => {
						e ? (l1.error("[Toolbar] Failed to load", e), this.fg(0)) : (this.fg(2), this.gg(r))
					}), sF(y, "turbolinks:load", () => {
						this.fg(0), this.loadToolbar(r)
					})
				}
				return !0
			}
			mg(e) {
				return this.loadToolbar(e)
			}
			maybeLoadEditor(e, t, i) {
				return this.maybeLoadToolbar(e, t, i)
			}
		}
	}, {
		experiments: class e {
			get Fr() {
				return this._instance.config
			}
			constructor(t) {
				this._instance = t, this.getWebExperimentsAndEvaluateDisplayLogic = (t = !1) => {
					this.getWebExperiments(t => {
						e.yg("retrieved web experiments from the server"), this.bg = new Map, t.forEach(t => {
							if (t.feature_flag_key) {
								var i;
								this.bg && (e.yg("setting flag key ", t.feature_flag_key, " to web experiment ", t), null == (i = this.bg) || i.set(t.feature_flag_key, t));
								let r = this._instance.getFeatureFlag(t.feature_flag_key);
								K(r) && t.variants[r] && this._g(t, r)
							} else if (t.variants)
								for (let i in t.variants) {
									let r = t.variants[i];
									e.wg(r, this._instance) && this.kg(t.name, i, r.transforms)
								}
						})
					}, t)
				}, this._instance.onFeatureFlags(e => {
					this.onFeatureFlags(e)
				})
			}
			initialize() {}
			onFeatureFlags(t) {
				if (this._is_bot()) e.yg(cc);
				else if (!this.Fr.disable_web_experiments) {
					if (Z(this.bg)) return this.bg = new Map, this.loadIfEnabled(), void this.previewWebExperiment();
					e.yg("applying feature flags", t), t.forEach(e => {
						var t, i;
						if (this.bg && (null == (t = this.bg) ? void 0 : t.has(e))) {
							let t = this._instance.getFeatureFlag(e),
								r = null == (i = this.bg) ? void 0 : i.get(e);
							t && (null == r ? void 0 : r.variants[t]) && this._g(r, t)
						}
					})
				}
			}
			previewWebExperiment() {
				let t = e.getWindowLocation();
				if (null == t ? void 0 : t.search) {
					let i = nQ(null == t ? void 0 : t.search, "__experiment_id"),
						r = nQ(null == t ? void 0 : t.search, "__experiment_variant");
					i && r && (e.yg(`previewing web experiments ${i} && ${r}`), this.getWebExperiments(e => {
						this.Sg(parseInt(i), r, e)
					}, !1, !0))
				}
			}
			loadIfEnabled() {
				this.Fr.disable_web_experiments || this.getWebExperimentsAndEvaluateDisplayLogic()
			}
			getWebExperiments(e, t, i) {
				if (this.Fr.disable_web_experiments && !i) return e([]);
				let r = this._instance.get_property("$web_experiments");
				if (r && !t) return e(r);
				this._instance._send_request({
					url: this._instance.requestRouter.endpointFor("api", `/api/web_experiments/?token=${this.Fr.token}`),
					method: "GET",
					timestampMode: "query",
					callback: t => e(200 === t.statusCode && t.json && t.json.experiments || [])
				})
			}
			Sg(t, i, r) {
				let s = r.filter(e => e.id === t);
				s && s.length > 0 && (e.yg(`Previewing web experiment [${s[0].name}] with variant [${i}]`), this.kg(s[0].name, i, s[0].variants[i].transforms))
			}
			_g(t, i) {
				let r = t.variants[i];
				e.xg(r, this._instance) ? this.kg(t.name, i, r.transforms) : e.yg(`skipping variant ${i} of experiment ${t.name} because this page does not match its url conditions`)
			}
			static wg(t, i) {
				return !Z(t.conditions) && e.xg(t, i) && e.$g(t)
			}
			static xg(t, i) {
				var r, s, n, o;
				if (Z(t.conditions) || Z(null == (r = t.conditions) ? void 0 : r.url)) return !0;
				let a = e.getWindowLocation();
				if (a) {
					let e = s2(i, a.href);
					return !(null == (s = t.conditions) ? void 0 : s.url) || cd[null != (n = null == (o = t.conditions) ? void 0 : o.urlMatchType) ? n : "icontains"](t.conditions.url, e)
				}
				return !1
			}
			static getWindowLocation() {
				return null == y ? void 0 : y.location
			}
			static $g(e) {
				var t, i, r, s, n, o, a, l, u;
				if (Z(e.conditions) || Z(null == (t = e.conditions) ? void 0 : t.utm)) return !0;
				let c = n8();
				if (c.utm_source) {
					let t = !(null == (i = e.conditions) || null == (i = i.utm) ? void 0 : i.utm_campaign) || (null == (r = e.conditions) || null == (r = r.utm) ? void 0 : r.utm_campaign) == c.utm_campaign,
						h = !(null == (s = e.conditions) || null == (s = s.utm) ? void 0 : s.utm_source) || (null == (n = e.conditions) || null == (n = n.utm) ? void 0 : n.utm_source) == c.utm_source,
						d = !(null == (o = e.conditions) || null == (o = o.utm) ? void 0 : o.utm_medium) || (null == (a = e.conditions) || null == (a = a.utm) ? void 0 : a.utm_medium) == c.utm_medium,
						p = !(null == (l = e.conditions) || null == (l = l.utm) ? void 0 : l.utm_term) || (null == (u = e.conditions) || null == (u = u.utm) ? void 0 : u.utm_term) == c.utm_term;
					return t && d && p && h
				}
				return !1
			}
			static yg(e, ...t) {
				rr.info(`[WebExperiments] ${e}`, t)
			}
			static Cg(e, ...t) {
				rr.warn(`[WebExperiments] ${e}`, t)
			}
			static Tg(t) {
				("http://www.w3.org/1999/xhtml" === t.namespaceURI && "template" === t.localName ? t.content : t).querySelectorAll("a[target], template").forEach(t => {
					var i;
					if ("template" === t.localName) return void("http://www.w3.org/1999/xhtml" === t.namespaceURI && e.Tg(t));
					if ("http://www.w3.org/1999/xhtml" !== t.namespaceURI || "_blank" !== (null == (i = t.getAttribute("target")) ? void 0 : i.toLowerCase())) return void t.removeAttribute("target");
					let r = (t.getAttribute("rel") || "").split(/\s+/).filter(e => e && !/^(opener|noopener)$/i.test(e));
					r.push("noopener"), t.setAttribute("rel", r.join(" "))
				})
			}
			kg(t, i, r) {
				this._is_bot() ? e.yg(cc) : "control" !== i ? r.forEach(r => {
					if (r.selector) {
						var s;
						e.yg(`applying transform of variant ${i} for experiment ${t} `, r);
						let n = null == (s = document) ? void 0 : s.querySelectorAll(r.selector);
						if (!(null == n ? void 0 : n.length)) return void e.Cg(`no element on this page matches selector ${r.selector} of variant ${i} for experiment ${t}`);
						let o = new Map;
						null == n || n.forEach(t => {
							if ("script" !== t.localName.toLowerCase()) {
								if (r.html) {
									var i, s;
									let n = "http://www.w3.org/1998/Math/MathML" === t.namespaceURI && "annotation-xml" === t.localName && (null == (i = t.getAttribute("encoding")) ? void 0 : i.toLowerCase()) || "",
										a = JSON.stringify([t.namespaceURI, t.localName, n]),
										u = o.get(a);
									if (Z(u)) {
										let i = null != (s = l) ? s : l = cu(),
											c = t.ownerDocument.implementation.createHTMLDocument(""),
											h = c.createElementNS(t.namespaceURI, t.localName);
										n && h.setAttribute("encoding", n);
										let d = c.createRange();
										d.selectNodeContents(h);
										let p = "http://www.w3.org/2000/svg" === t.namespaceURI && /^(foreignObject|desc|title)$/.test(t.localName) || /^(text\/html|application\/xhtml\+xml)$/.test(n) ? "http://www.w3.org/1999/xhtml" : t.namespaceURI,
											f = d.createContextualFragment(r.html);
										"http://www.w3.org/1998/Math/MathML" === t.namespaceURI && /^(mi|mo|mn|ms|mtext)$/.test(t.localName) ? (h.appendChild(f), i.sanitize(h, tS(tS({}, ch), {}, {
											NAMESPACE: p || void 0,
											IN_PLACE: !0
										}))) : ("http://www.w3.org/1999/xhtml" === h.namespaceURI && "template" === h.localName ? h.content : h).appendChild(i.sanitize(f, tS(tS({}, ch), {}, {
											NAMESPACE: p || void 0,
											RETURN_DOM_FRAGMENT: !0
										}))), e.Tg(h), u = h.innerHTML, o.set(a, u)
									}
									t.innerHTML = u
								}
								r.css && t.setAttribute("style", r.css)
							}
						})
					}
				}) : e.yg("Control variants leave the page unmodified.")
			}
			_is_bot() {
				return w && this._instance ? aO(w, this.Fr.custom_blocked_useragents) : void 0
			}
		},
		featureFlags: us
	}, {
		conversations: class {
			constructor(e) {
				this._instance = e, this.Ig = void 0, this._conversationsManager = null, this.Mg = !1, this.ie = null, this.Eg = !1, this.Ag = 0, this.Rg = null, this.Pg = null
			}
			initialize() {
				this.loadIfEnabled()
			}
			onRemoteConfig(e) {
				if (this._instance.config.disable_conversations) return void(this.Rg = null);
				if (this.Og = e.ok, !e.ok) return;
				let t = e.config.conversations;
				Z(t) ? this.Rg = null : (et(t) ? this.Ig = t : (this.Ig = t.enabled, this.ie = t), this.Ig || (this.Rg = null), this.loadIfEnabled())
			}
			reset() {
				var e;
				null == (e = this._conversationsManager) || e.reset(), this._conversationsManager = null, this.Ag++, this.Ig = void 0, this.ie = null, this.Og = void 0, this.Eg = !1, this.Rg = null
			}
			loadIfEnabled() {
				if (this._conversationsManager || this.Mg || this._instance.config.disable_conversations || sP(this._instance.config) || this._instance.config.cookieless_mode && this._instance.consent.isOptedOut()) return;
				let e = null == O ? void 0 : O.__PosthogExtensions__;
				if (e && !J(this.Ig) && this.Ig)
					if (this.ie && this.ie.token) {
						this.Mg = !0;
						try {
							let t = e.initConversations;
							if (t) return this.Fg(t), void(this.Mg = !1);
							let i = e.loadExternalDependency;
							if (!i) return void this.Dg(rP);
							let r = this.Ag;
							i(this._instance, "conversations", t => {
								r !== this.Ag ? (this.Mg = !1, this.loadIfEnabled()) : (t || !e.initConversations ? this.Dg("Could not load conversations script", t) : this.Fg(e.initConversations), this.Mg = !1)
							})
						} catch (e) {
							this.Dg("Error initializing conversations", e), this.Mg = !1
						}
					} else cp.error("Conversations enabled but missing token in remote config.")
			}
			Fg(e) {
				if (this.ie) {
					try {
						this._conversationsManager = e(this.ie, this._instance), this.Eg = !1, cp.info("Conversations loaded successfully")
					} catch (e) {
						return void this.Dg("Error completing conversations initialization", e)
					}
					this.Pg && this._conversationsManager.setTheme(this.Pg), this.Lg()
				} else cp.error("Cannot complete initialization: remote config is null")
			}
			Lg() {
				let e = this.Rg;
				this.Rg = null, this._conversationsManager && e && ("open" === e ? this._conversationsManager.open() : this._conversationsManager.close())
			}
			Dg(e, t) {
				cp.error(e, t), this._conversationsManager = null, this.Mg = !1, this.Eg = !0
			}
			show() {
				this._conversationsManager ? this._conversationsManager.show() : cp.warn("Conversations not loaded yet.")
			}
			hide() {
				"open" === this.Rg && (this.Rg = null), this._conversationsManager && this._conversationsManager.hide()
			}
			open() {
				this._conversationsManager ? (this.Rg = null, this._conversationsManager.open()) : this.Rg = "open"
			}
			close() {
				this._conversationsManager ? (this.Rg = null, this._conversationsManager.close()) : this.Rg = "close"
			}
			setTheme(e) {
				var t, i;
				this.Pg = tS(tS(tS({}, this.Pg), e), {}, {
					dark: tS(tS({}, null == (t = this.Pg) ? void 0 : t.dark), null == e ? void 0 : e.dark)
				}), null == (i = this._conversationsManager) || i.setTheme(e)
			}
			isAvailable() {
				return !0 === this.Ig && !X(this._conversationsManager)
			}
			getUnavailableReason() {
				return this.isAvailable() ? null : this._instance.config.disable_conversations ? "disabled_by_config" : sP(this._instance.config) ? "disabled_for_toolbar" : this._instance.config.cookieless_mode && this._instance.consent.isOptedOut() ? "consent_opted_out" : !1 === this.Og ? "remote_config_failed" : J(this.Ig) ? this.Og ? "disabled_in_project" : "remote_config_pending" : this.Ig ? Z(this.ie) || !this.ie.token ? "missing_token" : (null == O ? void 0 : O.__PosthogExtensions__) ? this.Mg ? "initializing" : this.Eg ? "load_failed" : "not_loaded" : "extensions_unavailable" : "disabled_in_project"
			}
			isVisible() {
				var e, t;
				return null != (e = null == (t = this._conversationsManager) ? void 0 : t.isVisible()) && e
			}
			sendMessage(e, t, i) {
				var r = this;
				return ed(function*() {
					return r._conversationsManager ? r._conversationsManager.sendMessage(e, t, i) : (cp.warn(cf), null)
				})()
			}
			getMessages(e, t) {
				var i = this;
				return ed(function*() {
					return i._conversationsManager ? i._conversationsManager.getMessages(e, t) : (cp.warn(cf), null)
				})()
			}
			markAsRead(e) {
				var t = this;
				return ed(function*() {
					return t._conversationsManager ? t._conversationsManager.markAsRead(e) : (cp.warn(cf), null)
				})()
			}
			getTickets(e) {
				var t = this;
				return ed(function*() {
					return t._conversationsManager ? t._conversationsManager.getTickets(e) : (cp.warn(cf), null)
				})()
			}
			requestRestoreLink(e) {
				var t = this;
				return ed(function*() {
					return t._conversationsManager ? t._conversationsManager.requestRestoreLink(e) : (cp.warn(cf), null)
				})()
			}
			restoreFromToken(e) {
				var t = this;
				return ed(function*() {
					return t._conversationsManager ? t._conversationsManager.restoreFromToken(e) : (cp.warn(cf), null)
				})()
			}
			restoreFromUrlToken() {
				var e = this;
				return ed(function*() {
					return e._conversationsManager ? e._conversationsManager.restoreFromUrlToken() : (cp.warn(cf), null)
				})()
			}
			getCurrentTicketId() {
				var e, t;
				return null != (e = null == (t = this._conversationsManager) ? void 0 : t.getCurrentTicketId()) ? e : null
			}
			getWidgetSessionId() {
				var e, t;
				return null != (e = null == (t = this._conversationsManager) ? void 0 : t.getWidgetSessionId()) ? e : null
			}
			Md() {
				var e;
				null == (e = this._conversationsManager) || e.setIdentity()
			}
			Ed() {
				var e;
				null == (e = this._conversationsManager) || e.clearIdentity()
			}
		}
	}, {
		logs: class extends cx {
			constructor(e) {
				super({
					get() {
						var t;
						return null == e || null == (t = e.config) ? void 0 : t.logs
					},
					captureHintKey: rJ,
					get remoteConfigWillArrive() {
						var t, i;
						return !(null == (t = e.lc) ? void 0 : t.call(e)) || !!(null == (i = O._POSTHOG_REMOTE_CONFIG) || null == (i = i[e.config.token]) ? void 0 : i.config)
					}
				}, () => (function(e) {
					var t;
					let i = {};
					if (i.distinctId = e.get_distinct_id(), e.sessionManager) {
						let {
							sessionId: t,
							windowId: r,
							sessionStartTimestamp: s,
							lastActivityTimestamp: n
						} = e.sessionManager.checkAndGetSessionAndWindowId(!0);
						i.sessionId = t, i.windowId = r, Z(s) || (i.sessionStartTimestamp = s), Z(n) || (i.lastActivityTimestamp = n)
					}
					if ((null == O || null == (t = O.location) ? void 0 : t.href) && (i.currentUrl = e.config.disable_capture_url_hashes ? tm(O.location.href) : O.location.href), e.featureFlags) {
						let t = e.featureFlags.getFlags();
						t && t.length > 0 && (i.activeFeatureFlags = t)
					}
					return i
				})(e)), this._instance = e, this.name = a8, this.df()
			}
			get cf() {
				return this._instance.__loaded
			}
			hf() {
				let e = rr.createLogger("[logs]", void 0),
					t = null == O ? void 0 : O.__PosthogExtensions__;
				if (!t) return void e.error("PostHog Extensions not found.");
				let i = t.loadExternalDependency;
				if (i) return e => {
					i(this._instance, "logs", i => {
						let r = t.logs;
						e(i, (null == r ? void 0 : r.initializeLogs) ? {
							initialize: e => r.initializeLogs(e),
							replay(e, t) {
								var i;
								return null == (i = r.replayConsoleBuffer) ? void 0 : i.call(r, e, t)
							}
						} : void 0)
					})
				};
				e.error(rP)
			}
		}
	}, {
		metrics: class {
			constructor(e) {
				this._instance = e, this.R = rr.createLogger("[metrics]", void 0), this.Ti = !1
			}
			initialize() {
				this.onConfigChange()
			}
			onConfigChange() {
				var e, t;
				let i, r, s, n;
				if (this.Ti) return;
				let o = !!(null == (e = this._instance.config.metrics) ? void 0 : e.network);
				o && !this.Ng ? this.Ng = (t = this._instance, i = !0, r = () => {
					var e;
					let r;
					return i ? !0 === (r = null == (e = t.config.metrics) ? void 0 : e.network) ? {} : r || void 0 : void 0
				}, s = G(null == y ? void 0 : y.fetch) ? lF(y, "fetch", e => function(...i) {
					let s = a6(),
						n = e.apply(this, i);
					if (!r()) return n;
					try {
						var o, a, l;
						let [e, u] = i, c = c$(null != (o = null != (a = null == u ? void 0 : u.method) ? a : null == e ? void 0 : e.method) ? o : "GET", null != (l = null == e ? void 0 : e.url) ? l : e);
						return n.then(e => (cF(t, c, null == e ? void 0 : e.status, s, r, void 0, !0), e), e => {
							throw cF(t, c, void 0, s, r, e), e
						})
					} catch (e) {
						return ck.error("Failed to observe fetch", e), n
					}
				}) : cP, n = ((e, t) => {
					var i;
					let r = null == y || null == (i = y.XMLHttpRequest) ? void 0 : i.prototype;
					if (!r) return cP;
					let s = new WeakMap,
						n = lF(r, "open", e => function(...t) {
							try {
								o7.has(this) || s.set(this, c$(t[0], t[1]))
							} catch (e) {
								ck.error("Failed to observe XHR open", e)
							}
							return e.apply(this, t)
						}),
						o = lF(r, "send", i => function(...r) {
							let n;
							try {
								let i = s.get(this);
								if (i && t()) {
									let r = a6();
									n = () => {
										this.removeEventListener("loadend", n), cF(e, i, this.status, r, t)
									}, sF(this, "loadend", n)
								}
							} catch (e) {
								ck.error("Failed to observe XHR send", e)
							}
							try {
								return i.apply(this, r)
							} catch (e) {
								throw n && this.removeEventListener("loadend", n), e
							}
						});
					return () => {
						n(), o()
					}
				})(t, r), () => {
					i = !1, s(), n()
				}) : !o && this.Ng && (this.Ng(), this.Ng = void 0)
			}
			pf() {
				var e, t, i, r, s, n, o;
				let a;
				if (this.Ti) return;
				let l = null == (e = this._instance) || null == (e = e.config) ? void 0 : e.metrics;
				return this.lf && this.gf === l || (null == (t = this.lf) || t.reset(), this.gf = l, this.lf = new re(this.ff(), {
					serviceName: null != (i = null == (a = null == l ? void 0 : l.resourceAttributes) ? void 0 : a["service.name"]) ? i : null == l ? void 0 : l.serviceName,
					serviceVersion: null != (r = null == a ? void 0 : a["service.version"]) ? r : null == l ? void 0 : l.serviceVersion,
					environment: null != (s = null == a ? void 0 : a["deployment.environment"]) ? s : null == l ? void 0 : l.environment,
					resourceAttributes: a,
					beforeSend: null == l ? void 0 : l.beforeSend,
					flushIntervalMs: null != (n = null == l ? void 0 : l.flushIntervalMs) ? n : 1e4,
					maxSeriesPerFlush: null != (o = null == l ? void 0 : l.maxSeriesPerFlush) ? o : 1e3
				}, this.R)), this.lf
			}
			count(e, t = 1, i) {
				var r;
				null == (r = this.pf()) || r.count(e, t, i)
			}
			gauge(e, t, i) {
				var r;
				null == (r = this.pf()) || r.gauge(e, t, i)
			}
			histogram(e, t, i) {
				var r;
				null == (r = this.pf()) || r.histogram(e, t, i)
			}
			flush(e) {
				if (!this.lf) return Promise.resolve();
				if (e) {
					let t = this.lf.drainWindow();
					return t && this.To(t, e), Promise.resolve()
				}
				return this.lf.flush().catch(e => this.R.error("PostHog metrics flush failed:", e))
			}
			reset() {
				var e;
				null == (e = this.lf) || e.reset()
			}
			dispose() {
				var e, t;
				this.Ti = !0, null == (e = this.Ng) || e.call(this), this.Ng = void 0, null == (t = this.lf) || t.reset()
			}
			ff() {
				let e = this._instance,
					t = this;
				return {
					get isDisabled() {
						return !1
					},
					get optedOut() {
						return !e.is_capturing()
					},
					To: e => t.To(e),
					getLibraryId: () => R.LIB_NAME,
					getLibraryVersion: () => R.LIB_VERSION
				}
			}
			To(e, t) {
				return new Promise(i => {
					let r = !1,
						s = e => {
							r || (r = !0, clearTimeout(n), i(e))
						},
						n = setTimeout(() => s({
							kind: "retry-later",
							error: Error("metrics request timed out")
						}), 9e4);
					this._instance._send_request(tS(tS({
						method: "POST",
						url: this.jg(),
						data: e,
						compression: "best-available",
						batchKey: "metrics"
					}, t && {
						transport: t
					}), {}, {
						fireCallbackOnDrop: !0,
						callback(e) {
							let t = e.statusCode;
							if (t >= 200 && 300 > t) s({
								kind: "ok"
							});
							else if (413 === t) s({
								kind: "too-large"
							});
							else if (0 !== t && 408 !== t && 429 !== t && 500 > t) s({
								kind: "fatal",
								error: Error(`metrics request failed with status ${t}`)
							});
							else {
								var i;
								s({
									kind: "retry-later",
									error: null != (i = e.error) ? i : Error(`metrics request failed with status ${t}`)
								})
							}
						}
					}))
				})
			}
			jg() {
				return this._instance.requestRouter.endpointFor("api", "/i/v1/metrics") + "?token=" + encodeURIComponent(this._instance.config.token)
			}
		}
	}, {
		webMCP: class {
			constructor(e) {
				this._instance = e, this.qg = !1
			}
			initialize() {
				this.startIfEnabled()
			}
			startIfEnabled() {
				if (!this._instance.config.capture_webmcp || this.qg) return;
				let e = null == x ? void 0 : x.modelContext;
				if (!e || !G(e.registerTool)) return;
				let t = cT.get(e);
				if (t) return t.instances.add(this._instance), void(this.qg = !0);
				let i = {
						instances: new Set([this._instance])
					},
					r = e.registerTool,
					s = this;
				lF(e, "registerTool", e => function(t, ...r) {
					let n = t;
					try {
						n = s.Bg(t, i)
					} catch (i) {
						return e.call(this, t, ...r)
					}
					return e.call(this, n, ...r)
				}), e.registerTool !== r && (cT.set(e, i), this.qg = !0)
			}
			Bg(e, t) {
				if (!e || !G(e.execute)) return e;
				let i = e.execute,
					r = this,
					{
						tool: s,
						injected: n
					} = function(e, t) {
						let i = {
								intent: !1,
								model: !1
							},
							r = e.inputSchema;
						if (!(J(r) || W(r) && Object.keys(r).every(e => cO.has(e) || e.startsWith("x-")) && !0 !== r.additionalProperties && !W(r.additionalProperties) && (!r.type || "object" === r.type) && (!r.properties || W(r.properties)) && (!r.required || q(r.required)))) return {
							tool: cA(e),
							injected: i
						};
						let s = (null == r ? void 0 : r.properties) || {},
							n = e => cM(s, e) || q(null == r ? void 0 : r.required) && r.required.includes(e);
						if (i.intent = t.intent && !n("context"), i.model = t.model && !n("llm_model"), !i.intent && !i.model) return {
							tool: cA(e),
							injected: i
						};
						let o = tS({}, s),
							a = q(null == r ? void 0 : r.required) ? [...r.required] : [];
						return i.intent && (o.context = {
							type: "string",
							description: 'Explain why this tool is called and how it supports the user\'s goal. Describe the abstract purpose only. Do not include personal or identifying information. Generalize specific entities as roles such as "a customer".'
						}, a.includes("context") || a.push("context")), i.model && (o.llm_model = {
							type: "string",
							description: 'The model identifier you are running as, for example "claude-opus-4-8" or "gpt-5.2". Pass "unknown" if you are not certain. Recorded for the site developer\'s analytics.'
						}, a.includes("llm_model") || a.push("llm_model")), {
							tool: cA(e, tS(tS({}, r), {}, {
								type: (null == r ? void 0 : r.type) || "object",
								properties: o,
								required: a
							})),
							injected: i
						}
					}(e, function(e) {
						let t = {
							intent: !1,
							model: !1
						};
						for (let i of e.instances) {
							let e = cC(i.config.capture_webmcp);
							t.intent || (t.intent = !0 === (null == e ? void 0 : e.intent)), t.model || (t.model = !0 === (null == e ? void 0 : e.model))
						}
						return t
					}(t));
				return Object.defineProperty(s, "execute", {
					configurable: !0,
					enumerable: !0,
					writable: !0,
					value(...o) {
						var a;
						let l, u = new Date,
							c = function(e, t) {
								if (!W(e)) return {};
								try {
									let i = t.intent ? cL(e.context, 2048, !0) : void 0,
										r = t.model ? cL(e.llm_model, 256) : void 0;
									return tS(tS({}, i && "{}" !== i ? {
										intent: i
									} : {}), r && "unknown" !== r.toLowerCase() ? {
										model: r
									} : {})
								} catch (e) {
									return {}
								}
							}(o[0], n),
							h = function(e, t) {
								let i = e[0];
								if (!W(i)) return e;
								try {
									let r = t.intent && cM(i, "context"),
										s = t.model && cM(i, "llm_model");
									if (!r && !s) return e;
									let n = tS({}, i);
									return r && delete n.context, s && delete n.llm_model, [n, ...e.slice(1)]
								} catch (t) {
									return e
								}
							}(o, n);
						try {
							l = i.apply(this === s ? e : this, h)
						} catch (e) {
							throw r.zg(t, s, u, {
								error: e,
								errorResult: !1
							}, c), e
						}
						if ((a = l) && "function" == typeof a.then) return Promise.resolve(l).then(e => {
							let i = cD(e) ? {
								error: e,
								errorResult: !0
							} : void 0;
							return r.zg(t, s, u, i, c), e
						}, e => {
							throw r.zg(t, s, u, {
								error: e,
								errorResult: !1
							}, c), e
						});
						let d = cD(l) ? {
							error: l,
							errorResult: !0
						} : void 0;
						return r.zg(t, s, u, d, c), l
					}
				}), s
			}
			zg(e, t, i, r, s) {
				let n, o = Date.now() - i.getTime();
				for (let d of e.instances) {
					var a, l, u, c, h;
					let e = cC(d.config.capture_webmcp);
					if (e) {
						r && !n && (n = {
							message: function(e, t) {
								try {
									return cN(t ? function(e) {
										try {
											if (!W(e) || !q(e.content)) return;
											return e.content.filter(e => W(e) && "text" === e.type && K(e.text)).map(e => e.text).join(" ").trim() || void 0
										} catch (e) {
											return
										}
									}(e) : W(e) && K(e.message) ? e.message : K(e) ? e : String(e))
								} catch (e) {
									return "Unknown error"
								}
							}(l = r.error, u = r.errorResult),
							type: function(e, t) {
								if (t) return "Error";
								try {
									if (!W(e)) return "Error";
									let t = K(e.name) ? e.name.trim() : "",
										i = e.constructor;
									return t && "Error" !== t || !G(i) || "Error" === i.name || (t = i.name), (t || "Error").slice(0, 256)
								} catch (e) {
									return "Error"
								}
							}(l, u)
						});
						try {
							d.capture("$mcp_tool_call", tS(tS(tS({
								$mcp_source: "posthog_mcp_analytics",
								$mcp_interface: "webmcp",
								$mcp_tool_name: t.name,
								$mcp_resource_name: t.name,
								$mcp_tool_description: t.description,
								$mcp_server_name: null == k ? void 0 : k.hostname,
								$mcp_duration_ms: o,
								$mcp_is_error: !!r
							}, n ? {
								$mcp_error_type: n.type,
								$mcp_error_message: n.message
							} : {}), e.intent && s.intent ? {
								$mcp_intent: s.intent,
								$mcp_intent_source: "context_parameter"
							} : {}), e.model && s.model ? {
								$mcp_llm_model: s.model,
								$mcp_llm_model_source: "self_reported"
							} : {}), {
								timestamp: i
							})
						} catch (e) {
							continue
						}
						if (r && n && d.exceptions && (null == (a = d.exceptionObserver) ? void 0 : a.isEnabled)) try {
							let e = {
								$exception_list: (c = d.exceptions, h = n.message, r.errorResult ? [{
									type: "Error",
									value: h,
									mechanism: {
										type: "generic",
										handled: !0,
										synthetic: !0,
										exception_id: 0
									}
								}] : c.buildProperties(r.error, {
									handled: !0
								}).$exception_list.map(e => tS(tS({}, e), {}, {
									value: cN(e.value)
								}))),
								$exception_level: "error",
								$exception_source: "mcp.tool_call",
								$mcp_interface: "webmcp",
								$mcp_tool_name: t.name,
								$mcp_resource_name: t.name,
								$mcp_tool_description: t.description,
								$mcp_server_name: null == k ? void 0 : k.hostname
							};
							d.exceptionObserver.captureException(e)
						} catch (e) {}
					}
				}
			}
		}
	}));
	let cj = (R.SDK_DIST_CHANNEL = "npm", d = lt[lg] = new lw, function() {
		function e() {
			e.done || (e.done = !0, am = !1, sb(lt, function(e) {
				e._dom_loaded()
			}))
		}(null == x ? void 0 : x.addEventListener) ? "complete" === x.readyState ? e() : sF(x, "DOMContentLoaded", e, {
			capture: !1
		}): y && rr.error("Browser doesn't support `document.addEventListener` so PostHog couldn't be initialized")
	}(), d);
	e.s(["f", 0, cj])
}, 508751, (e, t, i) => {
	"use strict";
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.YouTubeEmbed = i.GoogleMapsEmbed = i.GoogleAnalytics = void 0;
	var r = e.r(880092);
	Object.defineProperty(i, "GoogleAnalytics", {
		enumerable: !0,
		get: function() {
			return r.GoogleAnalytics
		}
	});
	var s = e.r(490057);
	Object.defineProperty(i, "GoogleMapsEmbed", {
		enumerable: !0,
		get: function() {
			return s.GoogleMapsEmbed
		}
	});
	var n = e.r(761564);
	Object.defineProperty(i, "YouTubeEmbed", {
		enumerable: !0,
		get: function() {
			return n.YouTubeEmbed
		}
	})
}, 418704, (e, t, i) => {
	t.exports = {
		id: "google-analytics",
		description: "Install a Google Analytics tag on your website",
		website: "https://analytics.google.com/analytics/web/",
		scripts: [{
			url: "https://www.googletagmanager.com/gtag/js",
			params: ["id"],
			strategy: "worker",
			location: "head",
			action: "append"
		}, {
			code: "window.dataLayer=window.dataLayer||[];window.gtag=function gtag(){window.dataLayer.push(arguments);};gtag('js',new Date());gtag('config','${args.id}')",
			strategy: "worker",
			location: "head",
			action: "append"
		}]
	}
}, 880092, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__rest || function(e, t) {
			var i = {};
			for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && 0 > t.indexOf(r) && (i[r] = e[r]);
			if (null != e && "function" == typeof Object.getOwnPropertySymbols)
				for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) 0 > t.indexOf(r[s]) && Object.prototype.propertyIsEnumerable.call(e, r[s]) && (i[r[s]] = e[r[s]]);
			return i
		},
		s = e.e && e.e.__importDefault || function(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.GoogleAnalytics = void 0;
	let n = s(e.r(418704)),
		o = e.r(6154);
	i.GoogleAnalytics = e => {
		var t = r(e, []);
		return (0, o.formatData)(n.default, t)
	}
}, 731292, (e, t, i) => {
	t.exports = {
		id: "google-maps-embed",
		description: "Embed a Google Maps embed on your webpage",
		website: "https://developers.google.com/maps/documentation/embed/get-started",
		html: {
			element: "iframe",
			attributes: {
				loading: "lazy",
				src: {
					url: "https://www.google.com/maps/embed/v1/place",
					slugParam: "mode",
					params: ["key", "q", "center", "zoom", "maptype", "language", "region"]
				},
				referrerpolicy: "no-referrer-when-downgrade",
				frameborder: "0",
				style: "border:0",
				allowfullscreen: !0,
				width: null,
				height: null
			}
		}
	}
}, 490057, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__rest || function(e, t) {
			var i = {};
			for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && 0 > t.indexOf(r) && (i[r] = e[r]);
			if (null != e && "function" == typeof Object.getOwnPropertySymbols)
				for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) 0 > t.indexOf(r[s]) && Object.prototype.propertyIsEnumerable.call(e, r[s]) && (i[r[s]] = e[r[s]]);
			return i
		},
		s = e.e && e.e.__importDefault || function(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.GoogleMapsEmbed = void 0;
	let n = s(e.r(731292)),
		o = e.r(6154);
	i.GoogleMapsEmbed = e => {
		var t = r(e, []);
		return (0, o.formatData)(n.default, t)
	}
}, 418791, (e, t, i) => {
	t.exports = {
		id: "youtube-embed",
		description: "Embed a YouTube embed on your webpage.",
		website: "https://github.com/paulirish/lite-youtube-embed",
		html: {
			element: "lite-youtube",
			attributes: {
				videoid: null,
				playlabel: null
			}
		},
		stylesheets: ["https://cdn.jsdelivr.net/gh/paulirish/lite-youtube-embed@master/src/lite-yt-embed.css"],
		scripts: [{
			url: "https://cdn.jsdelivr.net/gh/paulirish/lite-youtube-embed@master/src/lite-yt-embed.js",
			strategy: "idle",
			location: "head",
			action: "append"
		}]
	}
}, 761564, (e, t, i) => {
	"use strict";
	var r = e.e && e.e.__rest || function(e, t) {
			var i = {};
			for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && 0 > t.indexOf(r) && (i[r] = e[r]);
			if (null != e && "function" == typeof Object.getOwnPropertySymbols)
				for (var s = 0, r = Object.getOwnPropertySymbols(e); s < r.length; s++) 0 > t.indexOf(r[s]) && Object.prototype.propertyIsEnumerable.call(e, r[s]) && (i[r[s]] = e[r[s]]);
			return i
		},
		s = e.e && e.e.__importDefault || function(e) {
			return e && e.__esModule ? e : {
				default: e
			}
		};
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.YouTubeEmbed = void 0;
	let n = s(e.r(418791)),
		o = e.r(6154);
	i.YouTubeEmbed = e => {
		var t = r(e, []);
		return (0, o.formatData)(n.default, t)
	}
}, 6154, (e, t, i) => {
	"use strict";

	function r(e, t, i = !1) {
		return t ? Object.keys(e).filter(e => i ? !t.includes(e) : t.includes(e)).reduce((t, i) => (t[i] = e[i], t), {}) : {}
	}

	function s(e, t, i, r) {
		let s = r && Object.keys(r).length > 0 ? new URL(Object.values(r)[0], e) : new URL(e);
		return t && i && t.forEach(e => {
			i[e] && s.searchParams.set(e, i[e])
		}), s.toString()
	}

	function n(e, t, i, r, n) {
		var o;
		if (!t) return `<${e}></${e}>`;
		let a = (null == (o = t.src) ? void 0 : o.url) ? Object.assign(Object.assign({}, t), {
				src: s(t.src.url, t.src.params, r, n)
			}) : t,
			l = Object.keys(Object.assign(Object.assign({}, a), i)).reduce((e, t) => {
				let r = null == i ? void 0 : i[t],
					s = a[t],
					n = null != r ? r : s,
					o = !0 === n ? t : `${t}="${n}"`;
				return n ? e + ` ${o}` : e
			}, "");
		return `<${e}${l}></${e}>`
	}
	Object.defineProperty(i, "__esModule", {
		value: !0
	}), i.formatData = i.createHtml = i.formatUrl = void 0, i.formatUrl = s, i.createHtml = n, i.formatData = function(e, t) {
		var i, o, a, l, u;
		let c = r(t, null == (i = e.scripts) ? void 0 : i.reduce((e, t) => [...e, ...Array.isArray(t.params) ? t.params : []], [])),
			h = r(t, null == (a = null == (o = e.html) ? void 0 : o.attributes.src) ? void 0 : a.params),
			d = r(t, [null == (u = null == (l = e.html) ? void 0 : l.attributes.src) ? void 0 : u.slugParam]),
			p = r(t, [...Object.keys(c), ...Object.keys(h), ...Object.keys(d)], !0);
		return Object.assign(Object.assign({}, e), {
			html: e.html ? n(e.html.element, e.html.attributes, p, h, d) : null,
			scripts: e.scripts ? e.scripts.map(e => Object.assign(Object.assign({}, e), {
				url: s(e.url, e.params, c)
			})) : null
		})
	}
}]);