(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 997675, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		WarningIcon: function() {
			return i
		},
		errorStyles: function() {
			return a
		},
		errorThemeCss: function() {
			return l
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	e.r(514719);
	let u = e.r(234984);
	e.r(170380);
	let a = {
			container: {
				fontFamily: 'system-ui,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			},
			card: {
				marginTop: "-32px",
				maxWidth: "325px",
				padding: "32px 28px",
				textAlign: "left"
			},
			icon: {
				marginBottom: "24px"
			},
			title: {
				fontSize: "24px",
				fontWeight: 500,
				letterSpacing: "-0.02em",
				lineHeight: "32px",
				margin: "0 0 12px 0",
				color: "var(--next-error-title)"
			},
			message: {
				fontSize: "14px",
				fontWeight: 400,
				lineHeight: "21px",
				margin: "0 0 20px 0",
				color: "var(--next-error-message)"
			},
			form: {
				margin: 0
			},
			buttonGroup: {
				display: "flex",
				gap: "8px",
				alignItems: "center"
			},
			button: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				height: "32px",
				padding: "0 12px",
				fontSize: "14px",
				fontWeight: 500,
				lineHeight: "20px",
				borderRadius: "6px",
				cursor: "pointer",
				color: "var(--next-error-btn-text)",
				background: "var(--next-error-btn-bg)",
				border: "var(--next-error-btn-border)"
			},
			buttonSecondary: {
				display: "inline-flex",
				alignItems: "center",
				justifyContent: "center",
				height: "32px",
				padding: "0 12px",
				fontSize: "14px",
				fontWeight: 500,
				lineHeight: "20px",
				borderRadius: "6px",
				cursor: "pointer",
				color: "var(--next-error-btn-secondary-text)",
				background: "var(--next-error-btn-secondary-bg)",
				border: "var(--next-error-btn-secondary-border)"
			},
			digestFooter: {
				position: "fixed",
				bottom: "32px",
				left: "0",
				right: "0",
				textAlign: "center",
				fontFamily: 'ui-monospace,SFMono-Regular,"SF Mono",Menlo,Consolas,monospace',
				fontSize: "12px",
				lineHeight: "18px",
				fontWeight: 400,
				margin: "0",
				color: "var(--next-error-digest)"
			}
		},
		l = `
:root {
  --next-error-bg: #fff;
  --next-error-text: #171717;
  --next-error-title: #171717;
  --next-error-message: #171717;
  --next-error-digest: #666666;
  --next-error-btn-text: #fff;
  --next-error-btn-bg: #171717;
  --next-error-btn-border: none;
  --next-error-btn-secondary-text: #171717;
  --next-error-btn-secondary-bg: transparent;
  --next-error-btn-secondary-border: 1px solid rgba(0,0,0,0.08);
}
@media (prefers-color-scheme: dark) {
  :root {
    --next-error-bg: #0a0a0a;
    --next-error-text: #ededed;
    --next-error-title: #ededed;
    --next-error-message: #ededed;
    --next-error-digest: #a0a0a0;
    --next-error-btn-text: #0a0a0a;
    --next-error-btn-bg: #ededed;
    --next-error-btn-border: none;
    --next-error-btn-secondary-text: #ededed;
    --next-error-btn-secondary-bg: transparent;
    --next-error-btn-secondary-border: 1px solid rgba(255,255,255,0.14);
  }
}
body { margin: 0; color: var(--next-error-text); background: var(--next-error-bg); }
`.replace(/\n\s*/g, "");

	function i() {
		return (0, u.jsx)("svg", {
			width: "32",
			height: "32",
			viewBox: "-0.2 -1.5 32 32",
			fill: "none",
			style: a.icon,
			children: (0, u.jsx)("path", {
				d: "M16.9328 0C18.0839 0.000116771 19.1334 0.658832 19.634 1.69531L31.4299 26.1309C32.0708 27.4588 31.1036 28.9999 29.6291 29H2.00215C0.527541 29 -0.439628 27.4588 0.201371 26.1309L11.9973 1.69531C12.4979 0.658823 13.5474 7.75066e-05 14.6984 0H16.9328ZM3.59493 26H28.0363L16.9328 3H14.6984L3.59493 26ZM15.8156 19C16.9202 19.0001 17.8156 19.8955 17.8156 21C17.8156 22.1045 16.9202 22.9999 15.8156 23C14.7111 23 13.8156 22.1046 13.8156 21C13.8156 19.8954 14.7111 19 15.8156 19ZM17.3156 16.5H14.3156V8.5H17.3156V16.5Z",
				fill: "var(--next-error-title)"
			})
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 21331, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "default", {
		enumerable: !0,
		get: function() {
			return a
		}
	}), e.r(514719);
	let n = e.r(234984);
	e.r(170380);
	let o = e.r(97172),
		u = e.r(997675),
		a = function({
			error: e
		}) {
			let t = e?.digest,
				r = !!t;
			return (0, o.handleISRError)({
				error: e
			}), (0, n.jsxs)("html", {
				id: "__next_error__",
				children: [(0, n.jsx)("head", {
					children: (0, n.jsx)("style", {
						dangerouslySetInnerHTML: {
							__html: u.errorThemeCss
						}
					})
				}), (0, n.jsxs)("body", {
					children: [(0, n.jsx)("div", {
						style: u.errorStyles.container,
						children: (0, n.jsxs)("div", {
							style: u.errorStyles.card,
							children: [(0, n.jsx)(u.WarningIcon, {}), (0, n.jsx)("h1", {
								style: u.errorStyles.title,
								children: "This page couldn’t load"
							}), (0, n.jsx)("p", {
								style: u.errorStyles.message,
								children: r ? "A server error occurred. Reload to try again." : "Reload to try again, or go back."
							}), (0, n.jsxs)("div", {
								style: u.errorStyles.buttonGroup,
								children: [(0, n.jsx)("form", {
									style: u.errorStyles.form,
									children: (0, n.jsx)("button", {
										type: "submit",
										style: u.errorStyles.button,
										children: "Reload"
									})
								}), !r && (0, n.jsx)("button", {
									type: "button",
									style: u.errorStyles.buttonSecondary,
									onClick: () => {
										window.history.length > 1 ? window.history.back() : window.location.href = "/"
									},
									children: "Back"
								})]
							})]
						})
					}), t && (0, n.jsxs)("p", {
						style: u.errorStyles.digestFooter,
						children: ["ERROR ", t]
					})]
				})]
			})
		};
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 872811, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		ErrorBoundary: function() {
			return b
		},
		ErrorBoundaryHandler: function() {
			return y
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(56421),
		a = e.r(234984),
		l = u._(e.r(170380)),
		i = e.r(332244),
		d = e.r(867793);
	e.r(698774);
	let s = e.r(97172),
		c = e.r(145472),
		f = e.r(692023),
		p = "u" > typeof window && (0, c.isBot)(window.navigator.userAgent);
	class y extends l.default.Component {
		static {
			this.contextType = f.AppRouterContext
		}
		constructor(e) {
			super(e), this.reset = () => {
				this.setState({
					error: null
				})
			}, this.retry = () => {
				(0, l.startTransition)(() => {
					this.context?.refresh(), this.reset()
				})
			}, this.state = {
				error: null,
				previousPathname: this.props.pathname
			}
		}
		static getDerivedStateFromError(e) {
			if ((0, d.isNextRouterError)(e)) throw e;
			return {
				error: {
					thrownValue: e
				}
			}
		}
		static getDerivedStateFromProps(e, t) {
			let {
				error: r
			} = t;
			return e.pathname !== t.previousPathname && t.error ? {
				error: null,
				previousPathname: e.pathname
			} : {
				error: t.error,
				previousPathname: e.pathname
			}
		}
		render() {
			if (this.state.error && !p) {
				let e = this.state.error.thrownValue;
				return (0, s.handleISRError)({
					error: e
				}), (0, a.jsxs)(a.Fragment, {
					children: [this.props.errorStyles, this.props.errorScripts, (0, a.jsx)(this.props.errorComponent, {
						error: e,
						reset: this.reset,
						retry: this.retry
					})]
				})
			}
			return this.props.children
		}
	}

	function b({
		errorComponent: e,
		errorStyles: t,
		errorScripts: r,
		children: n
	}) {
		let o = (0, i.useUntrackedPathname)();
		return e ? (0, a.jsx)(y, {
			pathname: o,
			errorComponent: e,
			errorStyles: t,
			errorScripts: r,
			children: n
		}) : (0, a.jsx)(a.Fragment, {
			children: n
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 569432, (e, t, r) => {
	"use strict";

	function n() {
		throw Error("`forbidden()` is experimental and only allowed to be enabled when `experimental.authInterrupts` is enabled.")
	}
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "forbidden", {
		enumerable: !0,
		get: function() {
			return n
		}
	}), e.r(140161).HTTP_ERROR_FALLBACK_ERROR_CODE, ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 97172, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "handleISRError", {
		enumerable: !0,
		get: function() {
			return o
		}
	});
	let n = e.r(706862);

	function o({
		error: e
	}) {
		if (!n.workUnitAsyncStorage) return;
		let t = n.workUnitAsyncStorage.getStore();
		switch (t?.type) {
			case "prerender":
			case "prerender-client":
			case "prerender-legacy":
				throw e && console.error(e), e;
			case "request":
			case "prerender-runtime":
			case "validation-client":
			case "cache":
			case "private-cache":
			case "unstable-cache":
			case "build-time-generator":
			case void 0:
				return
		}
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 140161, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		HTTPAccessErrorStatus: function() {
			return u
		},
		HTTP_ERROR_FALLBACK_ERROR_CODE: function() {
			return l
		},
		getAccessFallbackErrorTypeByStatus: function() {
			return s
		},
		getAccessFallbackHTTPStatus: function() {
			return d
		},
		isHTTPAccessFallbackError: function() {
			return i
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = {
			NOT_FOUND: 404,
			FORBIDDEN: 403,
			UNAUTHORIZED: 401
		},
		a = new Set(Object.values(u)),
		l = "NEXT_HTTP_ERROR_FALLBACK";

	function i(e) {
		if ("object" != typeof e || null === e || !("digest" in e) || "string" != typeof e.digest) return !1;
		let [t, r] = e.digest.split(";");
		return t === l && a.has(Number(r))
	}

	function d(e) {
		return Number(e.digest.split(";")[1])
	}

	function s(e) {
		switch (e) {
			case 401:
				return "unauthorized";
			case 403:
				return "forbidden";
			case 404:
				return "not-found";
			default:
				return
		}
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 797966, (e, t, r) => {
	"use strict";
	let n, o, u;
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var a = {
		expectCompleteParamsInClientValidation: function() {
			return o
		},
		instrumentParamsForClientValidation: function() {
			return n
		},
		instrumentSearchParamsForClientValidation: function() {
			return u
		}
	};
	for (var l in a) Object.defineProperty(r, l, {
		enumerable: !0,
		get: a[l]
	});
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 867793, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "isNextRouterError", {
		enumerable: !0,
		get: function() {
			return u
		}
	});
	let n = e.r(140161),
		o = e.r(887155);

	function u(e) {
		return (0, o.isRedirectError)(e) || (0, n.isHTTPAccessFallbackError)(e)
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 698774, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		handleHardNavError: function() {
			return a
		},
		useNavFailureHandler: function() {
			return l
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	e.r(170380);
	let u = e.r(973903);

	function a(e) {
		return "u" > typeof window && !!window.next.__pendingUrl && (0, u.createHrefFromUrl)(new URL(window.location.href)) !== (0, u.createHrefFromUrl)(window.next.__pendingUrl) && (console.error("Error occurred during navigation, falling back to hard navigation", e), window.location.href = window.next.__pendingUrl.toString(), !0)
	}

	function l() {}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 505360, (e, t, r) => {
	"use strict";
	let n, o;
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var u = {
		useDynamicRouteParams: function() {
			return n
		},
		useDynamicSearchParams: function() {
			return o
		}
	};
	for (var a in u) Object.defineProperty(r, a, {
		enumerable: !0,
		get: u[a]
	});
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 332244, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "useUntrackedPathname", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = e.r(170380),
		o = e.r(776869),
		u = e.r(706862);

	function a() {
		return ! function() {
			if ("u" < typeof window) {
				let e = u.workUnitAsyncStorage.getStore();
				if (!e) return !1;
				switch (e.type) {
					case "prerender":
					case "prerender-client":
					case "validation-client":
						let t = e.fallbackRouteParams;
						return !!t && t.size > 0
				}
			}
			return !1
		}() ? (0, n.useContext)(o.PathnameContext) : null
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 523939, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		ReadonlyURLSearchParams: function() {
			return l.ReadonlyURLSearchParams
		},
		RedirectType: function() {
			return f.RedirectType
		},
		ServerInsertedHTMLContext: function() {
			return s.ServerInsertedHTMLContext
		},
		forbidden: function() {
			return f.forbidden
		},
		notFound: function() {
			return f.notFound
		},
		permanentRedirect: function() {
			return f.permanentRedirect
		},
		redirect: function() {
			return f.redirect
		},
		unauthorized: function() {
			return f.unauthorized
		},
		unstable_isUnrecognizedActionError: function() {
			return c.unstable_isUnrecognizedActionError
		},
		unstable_rethrow: function() {
			return f.unstable_rethrow
		},
		useParams: function() {
			return x
		},
		usePathname: function() {
			return h
		},
		useRouter: function() {
			return g
		},
		useSearchParams: function() {
			return _
		},
		useSelectedLayoutSegment: function() {
			return v
		},
		useSelectedLayoutSegments: function() {
			return m
		},
		useServerInsertedHTML: function() {
			return s.useServerInsertedHTML
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(56421)._(e.r(170380)),
		a = e.r(692023),
		l = e.r(776869),
		i = e.r(152842),
		d = e.r(505360),
		s = e.r(27219),
		c = e.r(273084),
		f = e.r(191181),
		{
			instrumentParamsForClientValidation: p,
			instrumentSearchParamsForClientValidation: y,
			expectCompleteParamsInClientValidation: b
		} = e.r(797966);

	function _() {
		d.useDynamicSearchParams?.("useSearchParams()");
		let e = (0, u.useContext)(l.SearchParamsContext),
			t = (0, u.useMemo)(() => e ? new l.ReadonlyURLSearchParams(e) : null, [e]);
		return "u" < typeof window && t ? y(t) : t
	}

	function h() {
		d.useDynamicRouteParams?.("usePathname()");
		let e = (0, u.useContext)(l.PathnameContext);
		return "u" < typeof window && e && b("usePathname()"), e
	}

	function g() {
		let e = (0, u.useContext)(a.AppRouterContext);
		if (null === e) throw Error("invariant expected app router to be mounted");
		let t = (0, u.useContext)(a.LayoutRouterContext),
			r = t?.parentRenderTree.data.bfcacheId ?? 0;
		return (0, u.useMemo)(() => ({
			back: e.back,
			forward: e.forward,
			refresh: e.refresh,
			hmrRefresh: e.hmrRefresh,
			push: e.push,
			replace: e.replace,
			prefetch: e.prefetch,
			experimental_gesturePush: e.experimental_gesturePush,
			bfcacheId: "_b_" + r + "_"
		}), [e, r])
	}

	function x() {
		d.useDynamicRouteParams?.("useParams()");
		let e = (0, u.useContext)(l.PathParamsContext);
		return "u" < typeof window && e ? p(e) : e
	}

	function m(e = "children") {
		d.useDynamicRouteParams?.("useSelectedLayoutSegments()");
		let t = (0, u.useContext)(a.LayoutRouterContext);
		return t ? ("u" < typeof window && t && b("useSelectedLayoutSegments()"), (0, i.getSelectedLayoutSegmentPath)(t.parentTree, e)) : null
	}

	function v(e = "children") {
		d.useDynamicRouteParams?.("useSelectedLayoutSegment()"), (0, u.useContext)(l.NavigationPromisesContext);
		let t = m(e);
		return "u" < typeof window && b("useSelectedLayoutSegment()"), (0, i.computeSelectedLayoutSegment)(t, e)
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 191181, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		ReadonlyURLSearchParams: function() {
			return u.ReadonlyURLSearchParams
		},
		RedirectType: function() {
			return f
		},
		forbidden: function() {
			return i.forbidden
		},
		notFound: function() {
			return l.notFound
		},
		permanentRedirect: function() {
			return a.permanentRedirect
		},
		redirect: function() {
			return a.redirect
		},
		unauthorized: function() {
			return d.unauthorized
		},
		unstable_isUnrecognizedActionError: function() {
			return c
		},
		unstable_rethrow: function() {
			return s.unstable_rethrow
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(845303),
		a = e.r(355842),
		l = e.r(744065),
		i = e.r(569432),
		d = e.r(97478),
		s = e.r(709582);

	function c() {
		throw Error("`unstable_isUnrecognizedActionError` can only be used on the client.")
	}
	let f = {
		push: "push",
		replace: "replace"
	};
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 744065, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "notFound", {
		enumerable: !0,
		get: function() {
			return u
		}
	});
	let n = e.r(140161),
		o = `${n.HTTP_ERROR_FALLBACK_ERROR_CODE};404`;

	function u() {
		let e = Error(o);
		throw e.digest = o, e
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 845303, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "ReadonlyURLSearchParams", {
		enumerable: !0,
		get: function() {
			return o
		}
	});
	class n extends Error {
		constructor() {
			super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")
		}
	}
	class o extends URLSearchParams {
		append() {
			throw new n
		}
		delete() {
			throw new n
		}
		set() {
			throw new n
		}
		sort() {
			throw new n
		}
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 664173, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		RedirectBoundary: function() {
			return p
		},
		RedirectErrorBoundary: function() {
			return f
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(56421),
		a = e.r(234984),
		l = u._(e.r(170380)),
		i = e.r(523939),
		d = e.r(355842),
		s = e.r(887155);

	function c({
		redirect: e,
		reset: t,
		redirectType: r
	}) {
		let n = (0, i.useRouter)();
		return (0, l.useEffect)(() => {
			l.default.startTransition(() => {
				"push" === r ? n.push(e, {}) : n.replace(e, {}), t()
			})
		}, [e, r, t, n]), null
	}
	class f extends l.default.Component {
		constructor(e) {
			super(e), this.state = {
				redirect: null,
				redirectType: null
			}
		}
		static getDerivedStateFromError(e) {
			if ((0, s.isRedirectError)(e)) {
				let t = (0, d.getURLFromRedirectError)(e),
					r = (0, d.getRedirectTypeFromError)(e);
				return "handled" in e ? {
					redirect: null,
					redirectType: null
				} : {
					redirect: t,
					redirectType: r
				}
			}
			throw e
		}
		render() {
			let {
				redirect: e,
				redirectType: t
			} = this.state;
			return null !== e && null !== t ? (0, a.jsx)(c, {
				redirect: e,
				redirectType: t,
				reset: () => this.setState({
					redirect: null
				})
			}) : this.props.children
		}
	}

	function p({
		children: e
	}) {
		let t = (0, i.useRouter)();
		return (0, a.jsx)(f, {
			router: t,
			children: e
		})
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 62230, (e, t, r) => {
	"use strict";

	function n(e) {
		return Array.isArray(e) ? `${e[0]}|${e[1]}|${e[2]}` : e
	}
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "createRouterCacheKey", {
		enumerable: !0,
		get: function() {
			return n
		}
	}), ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 498106, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		createHeadKey: function() {
			return a
		},
		createSegmentKey: function() {
			return u.createRouterCacheKey
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(62230);

	function a(e) {
		let t = [e.value],
			r = e.parent;
		for (; null !== r;) {
			let e = r.value;
			"string" == typeof e && t.push(e), r = r.parent
		}
		return JSON.stringify(t)
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 97478, (e, t, r) => {
	"use strict";

	function n() {
		throw Error("`unauthorized()` is experimental and only allowed to be used when `experimental.authInterrupts` is enabled.")
	}
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "unauthorized", {
		enumerable: !0,
		get: function() {
			return n
		}
	}), e.r(140161).HTTP_ERROR_FALLBACK_ERROR_CODE, ("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 617249, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "unresolvedThenable", {
		enumerable: !0,
		get: function() {
			return n
		}
	});
	let n = {
		then: () => {}
	};
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 709582, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "unstable_rethrow", {
		enumerable: !0,
		get: function() {
			return function e(t) {
				if ((0, o.isNextRouterError)(t) || (0, n.isBailoutToCSRError)(t)) throw t;
				t instanceof Error && "cause" in t && e(t.cause)
			}
		}
	});
	let n = e.r(757158),
		o = e.r(867793);
	("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 700722, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "setAttributesFromProps", {
		enumerable: !0,
		get: function() {
			return a
		}
	});
	let n = {
			acceptCharset: "accept-charset",
			className: "class",
			htmlFor: "for",
			httpEquiv: "http-equiv",
			noModule: "noModule"
		},
		o = ["onLoad", "onReady", "dangerouslySetInnerHTML", "children", "onError", "strategy", "stylesheets"];

	function u(e) {
		return ["async", "defer", "noModule"].includes(e)
	}

	function a(e, t) {
		for (let [r, a] of Object.entries(t)) {
			if (!t.hasOwnProperty(r) || o.includes(r) || void 0 === a) continue;
			let l = n[r] || r.toLowerCase();
			"SCRIPT" === e.tagName && u(l) ? e[l] = !!a : e.setAttribute(l, String(a)), (!1 === a || "SCRIPT" === e.tagName && u(l) && (!a || "false" === a)) && (e.setAttribute(l, ""), e.removeAttribute(l))
		}
	}("function" == typeof r.default || "object" == typeof r.default && null !== r.default) && void 0 === r.default.__esModule && (Object.defineProperty(r.default, "__esModule", {
		value: !0
	}), Object.assign(r.default, r), t.exports = r.default)
}, 217550, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		MetadataBoundary: function() {
			return l
		},
		OutletBoundary: function() {
			return d
		},
		RootLayoutBoundary: function() {
			return s
		},
		ViewportBoundary: function() {
			return i
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(475771),
		a = {
			[u.METADATA_BOUNDARY_NAME]: function({
				children: e
			}) {
				return e
			},
			[u.VIEWPORT_BOUNDARY_NAME]: function({
				children: e
			}) {
				return e
			},
			[u.OUTLET_BOUNDARY_NAME]: function({
				children: e
			}) {
				return e
			},
			[u.ROOT_LAYOUT_BOUNDARY_NAME]: function({
				children: e
			}) {
				return e
			}
		},
		l = a[u.METADATA_BOUNDARY_NAME.slice(0)],
		i = a[u.VIEWPORT_BOUNDARY_NAME.slice(0)],
		d = a[u.OUTLET_BOUNDARY_NAME.slice(0)],
		s = a[u.ROOT_LAYOUT_BOUNDARY_NAME.slice(0)]
}, 475771, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		METADATA_BOUNDARY_NAME: function() {
			return u
		},
		OUTLET_BOUNDARY_NAME: function() {
			return l
		},
		ROOT_LAYOUT_BOUNDARY_NAME: function() {
			return i
		},
		VIEWPORT_BOUNDARY_NAME: function() {
			return a
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = "__next_metadata_boundary__",
		a = "__next_viewport_boundary__",
		l = "__next_outlet_boundary__",
		i = "__next_root_layout_boundary__"
}, 651281, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	}), Object.defineProperty(r, "HeadManagerContext", {
		enumerable: !0,
		get: function() {
			return n
		}
	});
	let n = (e.r(514719)._(e.r(170380))).default.createContext({})
}, 776869, (e, t, r) => {
	"use strict";
	e.i(914374), Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		NavigationPromisesContext: function() {
			return s
		},
		PathParamsContext: function() {
			return d
		},
		PathnameContext: function() {
			return i
		},
		ReadonlyURLSearchParams: function() {
			return a.ReadonlyURLSearchParams
		},
		SearchParamsContext: function() {
			return l
		},
		createDevToolsInstrumentedPromise: function() {
			return c
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(170380),
		a = e.r(845303),
		l = (0, u.createContext)(null),
		i = (0, u.createContext)(null),
		d = (0, u.createContext)(null),
		s = (0, u.createContext)(null);

	function c(e, t) {
		let r = Promise.resolve(t);
		return r.status = "fulfilled", r.value = t, r.displayName = `${e} (SSR)`, r
	}
}, 757158, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		BailoutToCSRError: function() {
			return a
		},
		isBailoutToCSRError: function() {
			return l
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = "BAILOUT_TO_CLIENT_SIDE_RENDERING";
	class a extends Error {
		constructor(e) {
			super(`Bail out to client-side rendering: ${e}`), this.reason = e, this.digest = u
		}
	}

	function l(e) {
		return "object" == typeof e && null !== e && "digest" in e && e.digest === u
	}
}, 27219, (e, t, r) => {
	"use strict";
	Object.defineProperty(r, "__esModule", {
		value: !0
	});
	var n = {
		ServerInsertedHTMLContext: function() {
			return a
		},
		useServerInsertedHTML: function() {
			return l
		}
	};
	for (var o in n) Object.defineProperty(r, o, {
		enumerable: !0,
		get: n[o]
	});
	let u = e.r(56421)._(e.r(170380)),
		a = u.default.createContext(null);

	function l(e) {
		let t = (0, u.useContext)(a);
		t && t(e)
	}
}]);