(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 755629, e => {
	"use strict";
	var t, r, n, i, a, o, l, u, c, s, f, h, d, p, y, v, m, g, b, x, w, O, _, A, S, j, E, k, P, M, I, C, T = e.i(234984),
		D = e.i(582018),
		N = e.i(170380),
		z = e.i(295550),
		L = e.i(170262),
		R = e.i(772301),
		B = e.i(663303),
		$ = e.i(205647),
		U = e.i(871101),
		F = e.i(426682),
		K = e.i(538882);
	let H = {
		groupBy: "day",
		model: "all",
		apiKeyId: "all"
	};
	U.z.object({
		groupBy: F.z.enum(["day", "week", "month"]).catch("day"),
		model: K.z.string().min(1).max(128).catch("all"),
		apiKeyId: K.z.string().min(1).max(128).catch("all")
	});
	var q = N,
		W = e.i(7284),
		V = ["dangerouslySetInnerHTML", "onCopy", "onCopyCapture", "onCut", "onCutCapture", "onPaste", "onPasteCapture", "onCompositionEnd", "onCompositionEndCapture", "onCompositionStart", "onCompositionStartCapture", "onCompositionUpdate", "onCompositionUpdateCapture", "onFocus", "onFocusCapture", "onBlur", "onBlurCapture", "onChange", "onChangeCapture", "onBeforeInput", "onBeforeInputCapture", "onInput", "onInputCapture", "onReset", "onResetCapture", "onSubmit", "onSubmitCapture", "onInvalid", "onInvalidCapture", "onLoad", "onLoadCapture", "onError", "onErrorCapture", "onKeyDown", "onKeyDownCapture", "onKeyPress", "onKeyPressCapture", "onKeyUp", "onKeyUpCapture", "onAbort", "onAbortCapture", "onCanPlay", "onCanPlayCapture", "onCanPlayThrough", "onCanPlayThroughCapture", "onDurationChange", "onDurationChangeCapture", "onEmptied", "onEmptiedCapture", "onEncrypted", "onEncryptedCapture", "onEnded", "onEndedCapture", "onLoadedData", "onLoadedDataCapture", "onLoadedMetadata", "onLoadedMetadataCapture", "onLoadStart", "onLoadStartCapture", "onPause", "onPauseCapture", "onPlay", "onPlayCapture", "onPlaying", "onPlayingCapture", "onProgress", "onProgressCapture", "onRateChange", "onRateChangeCapture", "onSeeked", "onSeekedCapture", "onSeeking", "onSeekingCapture", "onStalled", "onStalledCapture", "onSuspend", "onSuspendCapture", "onTimeUpdate", "onTimeUpdateCapture", "onVolumeChange", "onVolumeChangeCapture", "onWaiting", "onWaitingCapture", "onAuxClick", "onAuxClickCapture", "onClick", "onClickCapture", "onContextMenu", "onContextMenuCapture", "onDoubleClick", "onDoubleClickCapture", "onDrag", "onDragCapture", "onDragEnd", "onDragEndCapture", "onDragEnter", "onDragEnterCapture", "onDragExit", "onDragExitCapture", "onDragLeave", "onDragLeaveCapture", "onDragOver", "onDragOverCapture", "onDragStart", "onDragStartCapture", "onDrop", "onDropCapture", "onMouseDown", "onMouseDownCapture", "onMouseEnter", "onMouseLeave", "onMouseMove", "onMouseMoveCapture", "onMouseOut", "onMouseOutCapture", "onMouseOver", "onMouseOverCapture", "onMouseUp", "onMouseUpCapture", "onSelect", "onSelectCapture", "onTouchCancel", "onTouchCancelCapture", "onTouchEnd", "onTouchEndCapture", "onTouchMove", "onTouchMoveCapture", "onTouchStart", "onTouchStartCapture", "onPointerDown", "onPointerDownCapture", "onPointerMove", "onPointerMoveCapture", "onPointerUp", "onPointerUpCapture", "onPointerCancel", "onPointerCancelCapture", "onPointerEnter", "onPointerEnterCapture", "onPointerLeave", "onPointerLeaveCapture", "onPointerOver", "onPointerOverCapture", "onPointerOut", "onPointerOutCapture", "onGotPointerCapture", "onGotPointerCaptureCapture", "onLostPointerCapture", "onLostPointerCaptureCapture", "onScroll", "onScrollCapture", "onWheel", "onWheelCapture", "onAnimationStart", "onAnimationStartCapture", "onAnimationEnd", "onAnimationEndCapture", "onAnimationIteration", "onAnimationIterationCapture", "onTransitionEnd", "onTransitionEndCapture"];

	function Y(e) {
		return "string" == typeof e && V.includes(e)
	}
	var X = new Set(["aria-activedescendant", "aria-atomic", "aria-autocomplete", "aria-busy", "aria-checked", "aria-colcount", "aria-colindex", "aria-colspan", "aria-controls", "aria-current", "aria-describedby", "aria-details", "aria-disabled", "aria-errormessage", "aria-expanded", "aria-flowto", "aria-haspopup", "aria-hidden", "aria-invalid", "aria-keyshortcuts", "aria-label", "aria-labelledby", "aria-level", "aria-live", "aria-modal", "aria-multiline", "aria-multiselectable", "aria-orientation", "aria-owns", "aria-placeholder", "aria-posinset", "aria-pressed", "aria-readonly", "aria-relevant", "aria-required", "aria-roledescription", "aria-rowcount", "aria-rowindex", "aria-rowspan", "aria-selected", "aria-setsize", "aria-sort", "aria-valuemax", "aria-valuemin", "aria-valuenow", "aria-valuetext", "className", "color", "height", "id", "lang", "max", "media", "method", "min", "name", "style", "target", "width", "role", "tabIndex", "accentHeight", "accumulate", "additive", "alignmentBaseline", "allowReorder", "alphabetic", "amplitude", "arabicForm", "ascent", "attributeName", "attributeType", "autoReverse", "azimuth", "baseFrequency", "baselineShift", "baseProfile", "bbox", "begin", "bias", "by", "calcMode", "capHeight", "clip", "clipPath", "clipPathUnits", "clipRule", "colorInterpolation", "colorInterpolationFilters", "colorProfile", "colorRendering", "contentScriptType", "contentStyleType", "cursor", "cx", "cy", "d", "decelerate", "descent", "diffuseConstant", "direction", "display", "divisor", "dominantBaseline", "dur", "dx", "dy", "edgeMode", "elevation", "enableBackground", "end", "exponent", "externalResourcesRequired", "fill", "fillOpacity", "fillRule", "filter", "filterRes", "filterUnits", "floodColor", "floodOpacity", "focusable", "fontFamily", "fontSize", "fontSizeAdjust", "fontStretch", "fontStyle", "fontVariant", "fontWeight", "format", "from", "fx", "fy", "g1", "g2", "glyphName", "glyphOrientationHorizontal", "glyphOrientationVertical", "glyphRef", "gradientTransform", "gradientUnits", "hanging", "horizAdvX", "horizOriginX", "href", "ideographic", "imageRendering", "in2", "in", "intercept", "k1", "k2", "k3", "k4", "k", "kernelMatrix", "kernelUnitLength", "kerning", "keyPoints", "keySplines", "keyTimes", "lengthAdjust", "letterSpacing", "lightingColor", "limitingConeAngle", "local", "markerEnd", "markerHeight", "markerMid", "markerStart", "markerUnits", "markerWidth", "mask", "maskContentUnits", "maskUnits", "mathematical", "mode", "numOctaves", "offset", "opacity", "operator", "order", "orient", "orientation", "origin", "overflow", "overlinePosition", "overlineThickness", "paintOrder", "panose1", "pathLength", "patternContentUnits", "patternTransform", "patternUnits", "pointerEvents", "pointsAtX", "pointsAtY", "pointsAtZ", "preserveAlpha", "preserveAspectRatio", "primitiveUnits", "r", "radius", "refX", "refY", "renderingIntent", "repeatCount", "repeatDur", "requiredExtensions", "requiredFeatures", "restart", "result", "rotate", "rx", "ry", "seed", "shapeRendering", "slope", "spacing", "specularConstant", "specularExponent", "speed", "spreadMethod", "startOffset", "stdDeviation", "stemh", "stemv", "stitchTiles", "stopColor", "stopOpacity", "strikethroughPosition", "strikethroughThickness", "string", "stroke", "strokeDasharray", "strokeDashoffset", "strokeLinecap", "strokeLinejoin", "strokeMiterlimit", "strokeOpacity", "strokeWidth", "surfaceScale", "systemLanguage", "tableValues", "targetX", "targetY", "textAnchor", "textDecoration", "textLength", "textRendering", "to", "transform", "u1", "u2", "underlinePosition", "underlineThickness", "unicode", "unicodeBidi", "unicodeRange", "unitsPerEm", "vAlphabetic", "values", "vectorEffect", "version", "vertAdvY", "vertOriginX", "vertOriginY", "vHanging", "vIdeographic", "viewTarget", "visibility", "vMathematical", "widths", "wordSpacing", "writingMode", "x1", "x2", "x", "xChannelSelector", "xHeight", "xlinkActuate", "xlinkArcrole", "xlinkHref", "xlinkRole", "xlinkShow", "xlinkTitle", "xlinkType", "xmlBase", "xmlLang", "xmlns", "xmlnsXlink", "xmlSpace", "y1", "y2", "y", "yChannelSelector", "z", "zoomAndPan", "ref", "key", "angle"]);

	function G(e) {
		return "string" == typeof e && X.has(e)
	}

	function Z(e) {
		return "string" == typeof e && e.startsWith("data-")
	}

	function Q(e) {
		if ("object" != typeof e || null === e) return {};
		var t = {};
		for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (G(r) || Z(r)) && (t[r] = e[r]);
		return t
	}

	function J(e) {
		return null == e ? null : (0, N.isValidElement)(e) && "object" == typeof e.props && null !== e.props ? Q(e.props) : "object" != typeof e || Array.isArray(e) ? null : Q(e)
	}

	function ee(e) {
		var t = {};
		for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (G(r) || Z(r) || Y(r)) && (t[r] = e[r]);
		return t
	}
	var et = ["children", "className"];

	function er() {
		return (er = Object.assign.bind()).apply(null, arguments)
	}
	var en = N.forwardRef((e, t) => {
			var r = e.children,
				n = e.className,
				i = function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, et),
				a = (0, W.f)("recharts-layer", n);
			return N.createElement("g", er({
				className: a
			}, ee(i), {
				ref: t
			}), r)
		}),
		ei = e => null;

	function ea(e) {
		return "__proto__" === e
	}
	ei.displayName = "Cell";
	let eo = Object.prototype.hasOwnProperty;

	function el(e, t) {
		return eo.call(e, t)
	}
	let eu = /\.|(\[(?:[^[\]]*|(["'])(?:(?!\2)[^\\]|\\.)*?\2)\])/;

	function ec(e) {
		switch (typeof e) {
			case "number":
			case "symbol":
			default:
				return !1;
			case "string":
				if ("" === e || e.startsWith(".") || e.endsWith(".")) return !1;
				return eu.test(e)
		}
	}

	function es(e) {
		var t;
		return "string" == typeof e || "symbol" == typeof e ? e : Object.is(null == e || null == (t = e.valueOf) ? void 0 : t.call(e), -0) ? "-0" : String(e)
	}

	function ef(e) {
		return "symbol" == typeof e || e instanceof Symbol
	}

	function eh(e) {
		var t;
		if (Array.isArray(e)) return e.map(es);
		if ("symbol" == typeof e) return [e];
		e = null == (t = e) ? "" : function e(t) {
			if ("string" == typeof t) return t;
			if (Array.isArray(t)) {
				let r = "";
				for (let n = 0; n < t.length; n++) n > 0 && (r += ","), r += e(t[n]);
				return r
			}
			if (ef(t)) return t.toString();
			let r = t + "";
			return "0" === r && Object.is(Number(t), -0) ? "-0" : r
		}(t);
		let r = [],
			n = e.length;
		if (0 === n) return r;
		let i = 0,
			a = "",
			o = "",
			l = !1,
			u = !1,
			c = /^-?\d+(?:\.\d+)?$/;
		for (46 === e.charCodeAt(0) && r.push(""); i < n;) {
			let t = e[i];
			if (o) "\\" === t && i + 1 < n ? a += e[++i] : t === o ? o = "" : a += t;
			else if (l)
				if ('"' === t || "'" === t) o = t, u = !0;
				else if ("]" === t) {
				if (l = !1, !u && a.includes(".") && !c.test(a)) {
					let e = a.split(".");
					for (let t = 0; t < e.length; t++) "" !== e[t] && r.push(e[t])
				} else r.push(a);
				a = ""
			} else a += t;
			else if ("[" === t) l = !0, u = !1, a && (r.push(a), a = "");
			else if ("." === t) {
				a && (r.push(a), a = "");
				let t = e[i + 1];
				(void 0 === t || "." === t) && r.push("")
			} else a += t;
			i++
		}
		return a && r.push(a), r
	}

	function ed(e, t, r) {
		if (null == e) return r;
		switch (typeof t) {
			case "string": {
				if (ea(t)) return r;
				let n = e[t];
				if (void 0 === n)
					if (ec(t) && !el(e, t)) return ed(e, eh(t), r);
					else return r;
				return n
			}
			case "number":
			case "symbol": {
				"number" == typeof t && (t = es(t));
				let n = e[t];
				if (void 0 === n) return r;
				return n
			}
			default: {
				if (Array.isArray(t)) {
					var n = e,
						i = t,
						a = r;
					if (0 === i.length) return a;
					let o = n;
					for (let e = 0; e < i.length; e++) {
						if (null == o || ea(i[e])) return a;
						o = o[i[e]]
					}
					return void 0 === o ? a : o
				}
				if (ea(t = Object.is(null == t ? void 0 : t.valueOf(), -0) ? "-0" : String(t))) return r;
				let o = e[t];
				if (void 0 === o) return r;
				return o
			}
		}
	}

	function ep(e) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 4,
			r = 10 ** t,
			n = Math.round(e * r) / r;
		return Object.is(n, -0) ? 0 : n
	}

	function ey(e) {
		for (var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++) r[n - 1] = arguments[n];
		return e.reduce((e, t, n) => {
			var i = r[n - 1];
			return "string" == typeof i ? e + i + t : void 0 !== i ? e + ep(i) + t : e + t
		}, "")
	}
	var ev = e => 0 === e ? 0 : e > 0 ? 1 : -1,
		em = e => "number" == typeof e && e != +e,
		eg = e => "string" == typeof e && e.length > 1 && e.indexOf("%") === e.length - 1,
		eb = e => ("number" == typeof e || e instanceof Number) && !em(e),
		ex = e => eb(e) || "string" == typeof e,
		ew = 0,
		eO = e => {
			var t = ++ew;
			return "".concat(e || "").concat(t)
		},
		e_ = function(e, t) {
			var r, n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
				i = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
			if (!eb(e) && "string" != typeof e) return n;
			if (eg(e)) {
				if (null == t) return n;
				var a = e.indexOf("%");
				r = t * parseFloat(e.slice(0, a)) / 100
			} else r = +e;
			return em(r) && (r = n), i && null != t && r > t && (r = t), r
		},
		eA = e => {
			if (!Array.isArray(e)) return !1;
			for (var t = e.length, r = {}, n = 0; n < t; n++)
				if (r[String(e[n])]) return !0;
				else r[String(e[n])] = !0;
			return !1
		};

	function eS(e, t, r) {
		return eb(e) && eb(t) ? ep(e + r * (t - e)) : t
	}
	var ej = e => null == e ? e : "".concat(e.charAt(0).toUpperCase()).concat(e.slice(1));

	function eE(e) {
		return null != e
	}

	function ek() {}
	var eP = {
		devToolsEnabled: !0,
		isSsr: !("u" > typeof window && window.document && window.document.createElement && window.setTimeout)
	};

	function eM(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}
	var eI = function(e) {
			for (var t = 1; t < arguments.length; t++) {
				var r = null != arguments[t] ? arguments[t] : {};
				t % 2 ? eM(Object(r), !0).forEach(function(t) {
					var n, i, a;
					n = e, i = t, a = r[t], (i = function(e) {
						var t = function(e, t) {
							if ("object" != typeof e || !e) return e;
							var r = e[Symbol.toPrimitive];
							if (void 0 !== r) {
								var n = r.call(e, t || "default");
								if ("object" != typeof n) return n;
								throw TypeError("@@toPrimitive must return a primitive value.")
							}
							return ("string" === t ? String : Number)(e)
						}(e, "string");
						return "symbol" == typeof t ? t : t + ""
					}(i)) in n ? Object.defineProperty(n, i, {
						value: a,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : n[i] = a
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : eM(Object(r)).forEach(function(t) {
					Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
				})
			}
			return e
		}({}, {
			cacheSize: 2e3,
			enableCache: !0
		}),
		eC = new class {
			constructor(e) {
				var t, r, n;
				t = "cache", r = new Map, (t = "symbol" == typeof(n = function(e, t) {
					if ("object" != typeof e || !e) return e;
					var r = e[Symbol.toPrimitive];
					if (void 0 !== r) {
						var n = r.call(e, t || "default");
						if ("object" != typeof n) return n;
						throw TypeError("@@toPrimitive must return a primitive value.")
					}
					return ("string" === t ? String : Number)(e)
				}(t, "string")) ? n : n + "") in this ? Object.defineProperty(this, t, {
					value: r,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : this[t] = r, this.maxSize = e
			}
			get(e) {
				var t = this.cache.get(e);
				return void 0 !== t && (this.cache.delete(e), this.cache.set(e, t)), t
			}
			set(e, t) {
				if (this.cache.has(e)) this.cache.delete(e);
				else if (this.cache.size >= this.maxSize) {
					var r = this.cache.keys().next().value;
					null != r && this.cache.delete(r)
				}
				this.cache.set(e, t)
			}
			clear() {
				this.cache.clear()
			}
			size() {
				return this.cache.size
			}
		}(eI.cacheSize),
		eT = {
			position: "absolute",
			top: "-20000px",
			left: 0,
			padding: 0,
			margin: 0,
			border: "none",
			whiteSpace: "pre"
		},
		eD = "recharts_measurement_span",
		eN = (e, t) => {
			try {
				var r = document.getElementById(eD);
				r || ((r = document.createElement("span")).setAttribute("id", eD), r.setAttribute("aria-hidden", "true"), document.body.appendChild(r)), Object.assign(r.style, eT, t), r.textContent = "".concat(e);
				var n = r.getBoundingClientRect();
				return {
					width: n.width,
					height: n.height
				}
			} catch (e) {
				return {
					width: 0,
					height: 0
				}
			}
		},
		ez = function(e) {
			var t, r, n, i, a, o, l = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
			if (null == e || eP.isSsr) return {
				width: 0,
				height: 0
			};
			if (!eI.enableCache) return eN(e, l);
			var u = (t = l.fontSize || "", r = l.fontFamily || "", n = l.fontWeight || "", i = l.fontStyle || "", a = l.letterSpacing || "", o = l.textTransform || "", "".concat(e, "|").concat(t, "|").concat(r, "|").concat(n, "|").concat(i, "|").concat(a, "|").concat(o)),
				c = eC.get(u);
			if (c) return c;
			var s = eN(e, l);
			return eC.set(u, s), s
		};

	function eL(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return eR(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? eR(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function eR(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var eB = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([*/])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
		e$ = /(-?\d+(?:\.\d+)?[a-zA-Z%]*)([+-])(-?\d+(?:\.\d+)?[a-zA-Z%]*)/,
		eU = /^(px|cm|vh|vw|em|rem|%|mm|in|pt|pc|ex|ch|vmin|vmax|Q)$/,
		eF = /(-?\d+(?:\.\d+)?)([a-zA-Z%]+)?/,
		eK = {
			cm: 96 / 2.54,
			mm: 96 / 25.4,
			pt: 96 / 72,
			pc: 16,
			in: 96,
			Q: 96 / 101.6,
			px: 1
		},
		eH = ["cm", "mm", "pt", "pc", "in", "Q", "px"];
	class eq {
		static parse(e) {
			var t, r = eL(null != (t = eF.exec(e)) ? t : [], 3),
				n = r[1],
				i = r[2];
			return null == n ? eq.NaN : new eq(parseFloat(n), null != i ? i : "")
		}
		constructor(e, t) {
			this.num = e, this.unit = t, this.num = e, this.unit = t, em(e) && (this.unit = ""), "" === t || eU.test(t) || (this.num = 0 / 0, this.unit = ""), eH.includes(t) && (this.num = e * eK[t], this.unit = "px")
		}
		add(e) {
			return this.unit !== e.unit ? new eq(0 / 0, "") : new eq(this.num + e.num, this.unit)
		}
		subtract(e) {
			return this.unit !== e.unit ? new eq(0 / 0, "") : new eq(this.num - e.num, this.unit)
		}
		multiply(e) {
			return "" !== this.unit && "" !== e.unit && this.unit !== e.unit ? new eq(0 / 0, "") : new eq(this.num * e.num, this.unit || e.unit)
		}
		divide(e) {
			return "" !== this.unit && "" !== e.unit && this.unit !== e.unit ? new eq(0 / 0, "") : new eq(this.num / e.num, this.unit || e.unit)
		}
		toString() {
			return "".concat(this.num).concat(this.unit)
		}
		isNaN() {
			return em(this.num)
		}
	}

	function eW(e) {
		if (null == e || e.includes("NaN")) return "NaN";
		for (var t = e; t.includes("*") || t.includes("/");) {
			var r, n = eL(null != (r = eB.exec(t)) ? r : [], 4),
				i = n[1],
				a = n[2],
				o = n[3],
				l = eq.parse(null != i ? i : ""),
				u = eq.parse(null != o ? o : ""),
				c = "*" === a ? l.multiply(u) : l.divide(u);
			if (c.isNaN()) return "NaN";
			t = t.replace(eB, c.toString())
		}
		for (; t.includes("+") || /.-\d+(?:\.\d+)?/.test(t);) {
			var s, f = eL(null != (s = e$.exec(t)) ? s : [], 4),
				h = f[1],
				d = f[2],
				p = f[3],
				y = eq.parse(null != h ? h : ""),
				v = eq.parse(null != p ? p : ""),
				m = "+" === d ? y.add(v) : y.subtract(v);
			if (m.isNaN()) return "NaN";
			t = t.replace(e$, m.toString())
		}
		return t
	}
	n = "NaN", i = new eq(0 / 0, ""), (n = "symbol" == typeof(t = function(e, t) {
		if ("object" != typeof e || !e) return e;
		var r = e[Symbol.toPrimitive];
		if (void 0 !== r) {
			var n = r.call(e, t || "default");
			if ("object" != typeof n) return n;
			throw TypeError("@@toPrimitive must return a primitive value.")
		}
		return ("string" === t ? String : Number)(e)
	}(n, "string")) ? t : t + "") in eq ? Object.defineProperty(eq, n, {
		value: i,
		enumerable: !0,
		configurable: !0,
		writable: !0
	}) : eq[n] = i;
	var eV = /\(([^()]*)\)/;

	function eY(e) {
		var t = function(e) {
			try {
				var t;
				return t = e.replace(/\s+/g, ""), t = function(e) {
					for (var t, r = e; null != (t = eV.exec(r));) {
						var n = eL(t, 2)[1];
						r = r.replace(eV, eW(n))
					}
					return r
				}(t), t = eW(t)
			} catch (e) {
				return "NaN"
			}
		}(e.slice(5, -1));
		return "NaN" === t ? "" : t
	}

	function eX(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function eG(e, t) {
		var r = function(e) {
			for (var t = 1; t < arguments.length; t++) {
				var r = null != arguments[t] ? arguments[t] : {};
				t % 2 ? eX(Object(r), !0).forEach(function(t) {
					var n, i, a;
					n = e, i = t, a = r[t], (i = function(e) {
						var t = function(e, t) {
							if ("object" != typeof e || !e) return e;
							var r = e[Symbol.toPrimitive];
							if (void 0 !== r) {
								var n = r.call(e, t || "default");
								if ("object" != typeof n) return n;
								throw TypeError("@@toPrimitive must return a primitive value.")
							}
							return ("string" === t ? String : Number)(e)
						}(e, "string");
						return "symbol" == typeof t ? t : t + ""
					}(i)) in n ? Object.defineProperty(n, i, {
						value: a,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : n[i] = a
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : eX(Object(r)).forEach(function(t) {
					Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
				})
			}
			return e
		}({}, e);
		return Object.keys(t).reduce((e, r) => (void 0 === e[r] && void 0 !== t[r] && (e[r] = t[r]), e), r)
	}

	function eZ(e) {
		return Number.isFinite(e)
	}

	function eQ(e) {
		return "number" == typeof e && e > 0 && Number.isFinite(e)
	}
	var eJ = ["x", "y", "lineHeight", "capHeight", "fill", "scaleToFit", "textAnchor", "verticalAnchor"],
		e0 = ["dx", "dy", "angle", "className", "breakAll"];

	function e1() {
		return (e1 = Object.assign.bind()).apply(null, arguments)
	}

	function e2(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}

	function e3(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return e5(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? e5(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function e5(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var e6 = /[ \f\n\r\t\v\u2028\u2029]+/,
		e4 = e => {
			var t = e.children,
				r = e.breakAll,
				n = e.style;
			try {
				var i = [];
				null != t && (i = r ? t.toString().split("") : t.toString().split(e6));
				var a = i.map(e => ({
						word: e,
						width: ez(e, n).width
					})),
					o = r ? 0 : ez(" ", n).width;
				return {
					wordsWithComputedWidth: a,
					spaceWidth: o
				}
			} catch (e) {
				return null
			}
		};

	function e8(e) {
		return "start" === e || "middle" === e || "end" === e || "inherit" === e
	}
	var e7 = (e, t, r, n) => e.reduce((e, i) => {
			var a = i.word,
				o = i.width,
				l = e[e.length - 1];
			return l && null != o && (null == t || n || l.width + o + r < Number(t)) ? (l.words.push(a), l.width += o + r) : e.push({
				words: [a],
				width: o
			}), e
		}, []),
		e9 = e => e.reduce((e, t) => e.width > t.width ? e : t),
		te = (e, t, r, n, i, a, o, l) => {
			var u = e4({
				breakAll: r,
				style: n,
				children: e.slice(0, t) + "…"
			});
			if (!u) return [!1, []];
			var c = e7(u.wordsWithComputedWidth, a, o, l);
			return [c.length > i || e9(c).width > Number(a), c]
		},
		tt = e => [{
			words: null == e ? [] : e.toString().split(e6),
			width: void 0
		}],
		tr = "#808080",
		tn = {
			angle: 0,
			breakAll: !1,
			capHeight: "0.71em",
			fill: tr,
			lineHeight: "1em",
			scaleToFit: !1,
			textAnchor: "start",
			verticalAnchor: "end",
			x: 0,
			y: 0
		},
		ti = (0, N.forwardRef)((e, t) => {
			var r, n = eG(e, tn),
				i = n.x,
				a = n.y,
				o = n.lineHeight,
				l = n.capHeight,
				u = n.fill,
				c = n.scaleToFit,
				s = n.textAnchor,
				f = n.verticalAnchor,
				h = e2(n, eJ),
				d = (0, N.useMemo)(() => (e => {
					var t = e.width,
						r = e.scaleToFit,
						n = e.children,
						i = e.style,
						a = e.breakAll,
						o = e.maxLines;
					if ((t || r) && !eP.isSsr) {
						var l = e4({
							breakAll: a,
							children: n,
							style: i
						});
						if (!l) return tt(n);
						var u = l.wordsWithComputedWidth,
							c = l.spaceWidth;
						return ((e, t, r, n, i) => {
							var a, o = e.maxLines,
								l = e.children,
								u = e.style,
								c = e.breakAll,
								s = eb(o),
								f = String(l),
								h = e7(t, n, r, i);
							if (!s || i || !(h.length > o || e9(h).width > Number(n))) return h;
							for (var d = 0, p = f.length - 1, y = 0; d <= p && y <= f.length - 1;) {
								var v = Math.floor((d + p) / 2),
									m = e3(te(f, v - 1, c, u, o, n, r, i), 2),
									g = m[0],
									b = m[1],
									x = e3(te(f, v, c, u, o, n, r, i), 1)[0];
								if (g || x || (d = v + 1), g && x && (p = v - 1), !g && x) {
									a = b;
									break
								}
								y++
							}
							return a || h
						})({
							breakAll: a,
							children: n,
							maxLines: o,
							style: i
						}, u, c, t, !!r)
					}
					return tt(n)
				})({
					breakAll: h.breakAll,
					children: h.children,
					maxLines: h.maxLines,
					scaleToFit: c,
					style: h.style,
					width: h.width
				}), [h.breakAll, h.children, h.maxLines, c, h.style, h.width]),
				p = h.dx,
				y = h.dy,
				v = h.angle,
				m = h.className,
				g = h.breakAll,
				b = e2(h, e0);
			if (!ex(i) || !ex(a) || 0 === d.length) return null;
			var x = Number(i) + (eb(p) ? p : 0),
				w = Number(a) + (eb(y) ? y : 0);
			if (!eZ(x) || !eZ(w)) return null;
			switch (f) {
				case "start":
					r = eY("calc(".concat(l, ")"));
					break;
				case "middle":
					r = eY("calc(".concat((d.length - 1) / 2, " * -").concat(o, " + (").concat(l, " / 2))"));
					break;
				default:
					r = eY("calc(".concat(d.length - 1, " * -").concat(o, ")"))
			}
			var O = [],
				_ = d[0];
			if (c && null != _) {
				var A = _.width,
					S = h.width;
				O.push("scale(".concat(eb(S) && eb(A) ? S / A : 1, ")"))
			}
			return v && O.push("rotate(".concat(v, ", ").concat(x, ", ").concat(w, ")")), O.length && (b.transform = O.join(" ")), N.createElement("text", e1({}, ee(b), {
				ref: t,
				x: x,
				y: w,
				className: (0, W.f)("recharts-text", m),
				textAnchor: s,
				fill: u.includes("url") ? tr : u
			}), d.map((e, t) => {
				var n = e.words.join(g ? "" : " ");
				return N.createElement("tspan", {
					x: x,
					dy: 0 === t ? r : o,
					key: "".concat(n, "-").concat(t)
				}, n)
			}))
		});

	function ta(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function to(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? ta(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ta(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	ti.displayName = "Text";
	var tl = Math.PI / 180,
		tu = (e, t, r, n) => ({
			x: e + Math.cos(-tl * n) * r,
			y: t + Math.sin(-tl * n) * r
		}),
		tc = e.i(356076),
		ts = (0, N.createContext)(null),
		tf = e => e,
		th = () => {
			var e = (0, N.useContext)(ts);
			return e ? e.store.dispatch : tf
		},
		td = () => {},
		tp = () => td,
		ty = (e, t) => e === t;

	function tv(e) {
		var t = (0, N.useContext)(ts),
			r = (0, N.useMemo)(() => t ? t => {
				if (null != t) return e(t)
			} : td, [t, e]);
		return (0, tc.useSyncExternalStoreWithSelector)(t ? t.subscription.addNestedSub : tp, t ? t.store.getState : td, t ? t.store.getState : td, r, ty)
	}

	function tm(e) {
		return `Minified Redux error #${e}; visit https://redux.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `
	}
	var tg = "function" == typeof Symbol && Symbol.observable || "@@observable",
		tb = () => Math.random().toString(36).substring(7).split("").join("."),
		tx = {
			INIT: `@@redux/INIT${tb()}`,
			REPLACE: `@@redux/REPLACE${tb()}`,
			PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${tb()}`
		};

	function tw(e) {
		if ("object" != typeof e || null === e) return !1;
		let t = e;
		for (; null !== Object.getPrototypeOf(t);) t = Object.getPrototypeOf(t);
		return Object.getPrototypeOf(e) === t || null === Object.getPrototypeOf(e)
	}

	function tO(e) {
		let t, r = Object.keys(e),
			n = {};
		for (let t = 0; t < r.length; t++) {
			let i = r[t];
			"function" == typeof e[i] && (n[i] = e[i])
		}
		let i = Object.keys(n);
		try {
			Object.keys(n).forEach(e => {
				let t = n[e];
				if (void 0 === t(void 0, {
						type: tx.INIT
					})) throw Error(tm(12));
				if (void 0 === t(void 0, {
						type: tx.PROBE_UNKNOWN_ACTION()
					})) throw Error(tm(13))
			})
		} catch (e) {
			t = e
		}
		return function(e = {}, r) {
			if (t) throw t;
			let a = !1,
				o = {};
			for (let t = 0; t < i.length; t++) {
				let l = i[t],
					u = n[l],
					c = e[l],
					s = u(c, r);
				if (void 0 === s) throw r && r.type, Error(tm(14));
				o[l] = s, a = a || s !== c
			}
			return (a = a || i.length !== Object.keys(e).length) ? o : e
		}
	}

	function t_(...e) {
		return 0 === e.length ? e => e : 1 === e.length ? e[0] : e.reduce((e, t) => (...r) => e(t(...r)))
	}

	function tA(e) {
		return tw(e) && "type" in e && "string" == typeof e.type
	}
	var tS = Symbol.for("immer-nothing"),
		tj = Symbol.for("immer-draftable"),
		tE = Symbol.for("immer-state");

	function tk(e) {
		throw Error(`[Immer] minified error nr: ${e}. Full error at: https://bit.ly/3cXEKWf`)
	}
	var tP = Object,
		tM = tP.getPrototypeOf,
		tI = "constructor",
		tC = "prototype",
		tT = "configurable",
		tD = "enumerable",
		tN = "writable",
		tz = "value",
		tL = e => !!e && !!e[tE];

	function tR(e) {
		return !!e && (tU(e) || tV(e) || !!e[tj] || !!e[tI]?.[tj] || tY(e) || tX(e))
	}
	var tB = tP[tC][tI].toString(),
		t$ = new WeakMap;

	function tU(e) {
		if (!e || !tG(e)) return !1;
		let t = tM(e);
		if (null === t || t === tP[tC]) return !0;
		let r = tP.hasOwnProperty.call(t, tI) && t[tI];
		if (r === Object) return !0;
		if (!tZ(r)) return !1;
		let n = t$.get(r);
		return void 0 === n && (n = Function.toString.call(r), t$.set(r, n)), n === tB
	}

	function tF(e, t, r = !0) {
		0 === tK(e) ? (r ? Reflect.ownKeys(e) : tP.keys(e)).forEach(r => {
			t(r, e[r], e)
		}) : e.forEach((r, n) => t(n, r, e))
	}

	function tK(e) {
		let t = e[tE];
		return t ? t.type_ : tV(e) ? 1 : tY(e) ? 2 : 3 * !!tX(e)
	}
	var tH = (e, t, r = tK(e)) => 2 === r ? e.has(t) : tP[tC].hasOwnProperty.call(e, t),
		tq = (e, t, r = tK(e)) => 2 === r ? e.get(t) : e[t],
		tW = (e, t, r, n = tK(e)) => {
			2 === n ? e.set(t, r) : 3 === n ? e.add(r) : e[t] = r
		},
		tV = Array.isArray,
		tY = e => e instanceof Map,
		tX = e => e instanceof Set,
		tG = e => "object" == typeof e,
		tZ = e => "function" == typeof e,
		tQ = e => e.modified_ ? e.copy_ : e.base_;

	function tJ(e, t) {
		if (tY(e)) return new Map(e);
		if (tX(e)) return new Set(e);
		if (tV(e)) return Array[tC].slice.call(e);
		let r = tU(e);
		if (!0 !== t && ("class_only" !== t || r)) {
			let t = tM(e);
			if (null !== t && r) return {
				...e
			};
			let n = tP.create(t);
			return tP.assign(n, e)
		} {
			let t = tP.getOwnPropertyDescriptors(e);
			delete t[tE];
			let r = Reflect.ownKeys(t);
			for (let n = 0; n < r.length; n++) {
				let i = r[n],
					a = t[i];
				!1 === a[tN] && (a[tN] = !0, a[tT] = !0), (a.get || a.set) && (t[i] = {
					[tT]: !0,
					[tN]: !0,
					[tD]: a[tD],
					[tz]: e[i]
				})
			}
			return tP.create(tM(e), t)
		}
	}

	function t0(e, t = !1) {
		return t2(e) || tL(e) || !tR(e) || (tK(e) > 1 && tP.defineProperties(e, {
			set: t1,
			add: t1,
			clear: t1,
			delete: t1
		}), tP.freeze(e), t && tF(e, (e, t) => {
			t0(t, !0)
		}, !1)), e
	}
	var t1 = {
		[tz]: function() {
			tk(2)
		}
	};

	function t2(e) {
		return !(null !== e && tG(e)) || tP.isFrozen(e)
	}
	var t3 = "MapSet",
		t5 = "Patches",
		t6 = "ArrayMethods",
		t4 = {};

	function t8(e) {
		let t = t4[e];
		return t || tk(0), t
	}
	var t7 = e => !!t4[e];

	function t9(e, t) {
		t && (e.patchPlugin_ = t8(t5), e.patches_ = [], e.inversePatches_ = [], e.patchListener_ = t)
	}

	function re(e) {
		rt(e), e.drafts_.forEach(rn), e.drafts_ = null
	}

	function rt(e) {
		e === a && (a = e.parent_)
	}
	var rr = e => a = {
		drafts_: [],
		parent_: a,
		immer_: e,
		canAutoFreeze_: !0,
		unfinalizedDrafts_: 0,
		handledSet_: new Set,
		processedForPatches_: new Set,
		mapSetPlugin_: t7(t3) ? t8(t3) : void 0,
		arrayMethodsPlugin_: t7(t6) ? t8(t6) : void 0
	};

	function rn(e) {
		let t = e[tE];
		0 === t.type_ || 1 === t.type_ ? t.revoke_() : t.revoked_ = !0
	}

	function ri(e, t) {
		t.unfinalizedDrafts_ = t.drafts_.length;
		let r = t.drafts_[0];
		if (void 0 !== e && e !== r) {
			r[tE].modified_ && (re(t), tk(4)), tR(e) && (e = ra(t, e));
			let {
				patchPlugin_: n
			} = t;
			n && n.generateReplacementPatches_(r[tE].base_, e, t)
		} else e = ra(t, r);
		return function(e, t, r = !1) {
			!e.parent_ && e.immer_.autoFreeze_ && e.canAutoFreeze_ && t0(t, r)
		}(t, e, !0), re(t), t.patches_ && t.patchListener_(t.patches_, t.inversePatches_), e !== tS ? e : void 0
	}

	function ra(e, t) {
		if (t2(t)) return t;
		let r = t[tE];
		if (!r) return rf(t, e.handledSet_, e);
		if (!rl(r, e)) return t;
		if (!r.modified_) return r.base_;
		if (!r.finalized_) {
			let {
				callbacks_: t
			} = r;
			if (t)
				for (; t.length > 0;) t.pop()(e);
			rs(r, e)
		}
		return r.copy_
	}

	function ro(e) {
		e.finalized_ = !0, e.scope_.unfinalizedDrafts_--
	}
	var rl = (e, t) => e.scope_ === t,
		ru = [];

	function rc(e, t, r, n) {
		let i = e.copy_ || e.base_,
			a = e.type_;
		if (void 0 !== n && tq(i, n, a) === t) return void tW(i, n, r, a);
		if (!e.draftLocations_) {
			let t = e.draftLocations_ = new Map;
			tF(i, (e, r) => {
				if (tL(r)) {
					let n = t.get(r) || [];
					n.push(e), t.set(r, n)
				}
			})
		}
		for (let n of e.draftLocations_.get(t) ?? ru) tW(i, n, r, a)
	}

	function rs(e, t) {
		if (e.modified_ && !e.finalized_ && (3 === e.type_ || 1 === e.type_ && e.allIndicesReassigned_ || (e.assigned_?.size ?? 0) > 0)) {
			let {
				patchPlugin_: r
			} = t;
			if (r) {
				let n = r.getPath(e);
				n && r.generatePatches_(e, n, t)
			}
			ro(e)
		}
	}

	function rf(e, t, r) {
		return !r.immer_.autoFreeze_ && r.unfinalizedDrafts_ < 1 || tL(e) || t.has(e) || !tR(e) || t2(e) || (t.add(e), tF(e, (n, i) => {
			if (tL(i)) {
				let t = i[tE];
				rl(t, r) && (tW(e, n, tQ(t), e.type_), ro(t))
			} else tR(i) && rf(i, t, r)
		})), e
	}
	var rh = {
			get(e, t) {
				var r, n, i;
				let a;
				if (t === tE) return e;
				let o = e.scope_.arrayMethodsPlugin_,
					l = 1 === e.type_ && "string" == typeof t;
				if (l && o?.isArrayOperationMethod(t)) return o.createMethodInterceptor(e, t);
				let u = e.copy_ || e.base_;
				if (!tH(u, t, e.type_)) {
					let n;
					return r = e, (n = ry(u, t)) ? tz in n ? n[tz] : n.get?.call(r.draft_) : void 0
				}
				let c = u[t];
				if (e.finalized_ || !tR(c) || l && e.operationMethod && o?.isMutatingArrayMethod(e.operationMethod) && Number.isInteger(a = +t) && String(a) === t) return c;
				if (c === rp(e.base_, t) || (n = e, i = c, 1 === n.type_ && n.allIndicesReassigned_ && tR(i) && !i[tE] && n.baseRefs_.has(i))) {
					rm(e);
					let r = 1 === e.type_ ? +t : t,
						n = rb(e.scope_, c, e, r);
					return e.copy_[r] = n
				}
				return c
			},
			has: (e, t) => t in (e.copy_ || e.base_),
			ownKeys: e => Reflect.ownKeys(e.copy_ || e.base_),
			set(e, t, r) {
				let n = ry(e.copy_ || e.base_, t);
				if (n?.set) return n.set.call(e.draft_, r), !0;
				if (!e.modified_) {
					let n = rp(e.copy_ || e.base_, t),
						i = n?.[tE];
					if (i && i.base_ === r) return e.copy_[t] = r, e.assigned_.delete(t), !0;
					if ((r === n ? 0 !== r || 1 / r == 1 / n : r != r && n != n) && (void 0 !== r || tH(e.base_, t, e.type_))) return !0;
					rm(e), rv(e)
				}
				return !!(e.copy_[t] === r && (void 0 !== r || tH(e.copy_, t, e.type_)) || Number.isNaN(r) && Number.isNaN(e.copy_[t])) || (e.copy_[t] = r, e.assigned_.set(t, !0), ! function(e, t, r) {
					let {
						scope_: n
					} = e;
					if (tL(r)) {
						let i = r[tE];
						rl(i, n) && i.callbacks_.push(function() {
							rm(e), rc(e, r, tQ(i), t)
						})
					} else tR(r) && e.callbacks_.push(function() {
						let i = e.copy_ || e.base_;
						3 === e.type_ ? i.has(r) && rf(r, n.handledSet_, n) : tq(i, t, e.type_) === r && n.drafts_.length > 1 && (e.assigned_.get(t) ?? !1) === !0 && e.copy_ && rf(tq(e.copy_, t, e.type_), n.handledSet_, n)
					})
				}(e, t, r), !0)
			},
			deleteProperty: (e, t) => (rm(e), void 0 !== rp(e.base_, t) || t in e.base_ ? (e.assigned_.set(t, !1), rv(e)) : e.assigned_.delete(t), e.copy_ && delete e.copy_[t], !0),
			getOwnPropertyDescriptor(e, t) {
				let r = e.copy_ || e.base_,
					n = Reflect.getOwnPropertyDescriptor(r, t);
				return n ? {
					[tN]: !0,
					[tT]: 1 !== e.type_ || "length" !== t,
					[tD]: n[tD],
					[tz]: r[t]
				} : n
			},
			defineProperty() {
				tk(11)
			},
			getPrototypeOf: e => tM(e.base_),
			setPrototypeOf() {
				tk(12)
			}
		},
		rd = {};
	for (let e in rh) {
		let t = rh[e];
		rd[e] = function() {
			let e = arguments;
			return e[0] = e[0][0], t.apply(this, e)
		}
	}

	function rp(e, t) {
		let r = e[tE];
		return (r ? r.copy_ || r.base_ : e)[t]
	}

	function ry(e, t) {
		if (!(t in e)) return;
		let r = tM(e);
		for (; r;) {
			let e = Object.getOwnPropertyDescriptor(r, t);
			if (e) return e;
			r = tM(r)
		}
	}

	function rv(e) {
		!e.modified_ && (e.modified_ = !0, e.parent_ && rv(e.parent_))
	}

	function rm(e) {
		e.copy_ || (e.assigned_ = new Map, e.copy_ = tJ(e.base_, e.scope_.immer_.useStrictShallowCopy_))
	}
	rd.deleteProperty = function(e, t) {
		return rd.set.call(this, e, t, void 0)
	}, rd.set = function(e, t, r) {
		return rh.set.call(this, e[0], t, r, e[0])
	};
	var rg = class {
		constructor(e) {
			this.autoFreeze_ = !0, this.useStrictShallowCopy_ = !1, this.useStrictIteration_ = !1, this.produce = (e, t, r) => {
				let n;
				if (tZ(e) && !tZ(t)) {
					let r = t;
					t = e;
					let n = this;
					return function(e = r, ...i) {
						return n.produce(e, e => t.call(this, e, ...i))
					}
				}
				if (tZ(t) || tk(6), void 0 === r || tZ(r) || tk(7), tR(e)) {
					let i = rr(this),
						a = rb(i, e, void 0),
						o = !0;
					try {
						n = t(a), o = !1
					} finally {
						o ? re(i) : rt(i)
					}
					return t9(i, r), ri(n, i)
				}
				if (e && tG(e)) tk(1);
				else {
					if (void 0 === (n = t(e)) && (n = e), n === tS && (n = void 0), this.autoFreeze_ && t0(n, !0), r) {
						let t = [],
							i = [];
						t8(t5).generateReplacementPatches_(e, n, {
							patches_: t,
							inversePatches_: i
						}), r(t, i)
					}
					return n
				}
			}, this.produceWithPatches = (e, t) => {
				let r, n;
				return tZ(e) ? (t, ...r) => this.produceWithPatches(t, t => e(t, ...r)) : [this.produce(e, t, (e, t) => {
					r = e, n = t
				}), r, n]
			}, "boolean" == typeof e?.autoFreeze && this.setAutoFreeze(e.autoFreeze), "boolean" == typeof e?.useStrictShallowCopy && this.setUseStrictShallowCopy(e.useStrictShallowCopy), "boolean" == typeof e?.useStrictIteration && this.setUseStrictIteration(e.useStrictIteration)
		}
		createDraft(e) {
			tR(e) || tk(8), tL(e) && (e = rx(e));
			let t = rr(this),
				r = rb(t, e, void 0);
			return r[tE].isManual_ = !0, rt(t), r
		}
		finishDraft(e, t) {
			let r = e && e[tE];
			r && r.isManual_ || tk(9);
			let {
				scope_: n
			} = r;
			return t9(n, t), ri(void 0, n)
		}
		setAutoFreeze(e) {
			this.autoFreeze_ = e
		}
		setUseStrictShallowCopy(e) {
			this.useStrictShallowCopy_ = e
		}
		setUseStrictIteration(e) {
			this.useStrictIteration_ = e
		}
		shouldUseStrictIteration() {
			return this.useStrictIteration_
		}
		applyPatches(e, t) {
			let r;
			for (r = t.length - 1; r >= 0; r--) {
				let n = t[r];
				if (0 === n.path.length && "replace" === n.op) {
					e = n.value;
					break
				}
			}
			r > -1 && (t = t.slice(r + 1));
			let n = t8(t5).applyPatches_;
			return tL(e) ? n(e, t) : this.produce(e, e => n(e, t))
		}
	};

	function rb(e, t, r, n) {
		let [i, o] = tY(t) ? t8(t3).proxyMap_(t, r) : tX(t) ? t8(t3).proxySet_(t, r) : function(e, t) {
			let r = tV(e),
				n = {
					type_: +!!r,
					scope_: t ? t.scope_ : a,
					modified_: !1,
					finalized_: !1,
					assigned_: void 0,
					parent_: t,
					base_: e,
					draft_: null,
					copy_: null,
					revoke_: null,
					isManual_: !1,
					callbacks_: void 0
				},
				i = n,
				o = rh;
			r && (i = [n], o = rd);
			let {
				revoke: l,
				proxy: u
			} = Proxy.revocable(i, o);
			return n.draft_ = u, n.revoke_ = l, [u, n]
		}(t, r);
		if ((r?.scope_ ?? a).drafts_.push(i), o.callbacks_ = r?.callbacks_ ?? [], o.key_ = n, r && void 0 !== n) r.callbacks_.push(function(e) {
			if (!o || !rl(o, e)) return;
			e.mapSetPlugin_?.fixSetContents(o);
			let t = tQ(o);
			rc(r, o.draft_ ?? o, t, n), rs(o, e)
		});
		else o.callbacks_.push(function(e) {
			e.mapSetPlugin_?.fixSetContents(o);
			let {
				patchPlugin_: t
			} = e;
			o.modified_ && t && t.generatePatches_(o, [], e)
		});
		return i
	}

	function rx(e) {
		return tL(e) || tk(10),
			function e(t) {
				let r;
				if (!tR(t) || t2(t)) return t;
				let n = t[tE],
					i = !0;
				if (n) {
					if (!n.modified_) return n.base_;
					n.finalized_ = !0, r = tJ(t, n.scope_.immer_.useStrictShallowCopy_), i = n.scope_.immer_.shouldUseStrictIteration()
				} else r = tJ(t, !0);
				let a = r;
				return tX(r) && (r = new Set), tF(a, (t, n) => {
					tW(r, t, e(n))
				}, i), n && (n.finalized_ = !1), r
			}(e)
	}
	var rw = globalThis.Iterator;
	rw?.from;
	var rO = new rg().produce,
		r_ = e => Array.isArray(e) ? e : [e],
		rA = 0,
		rS = class {
			revision = rA;
			_value;
			_lastValue;
			_isEqual = rj;
			constructor(e, t = rj) {
				this._value = this._lastValue = e, this._isEqual = t
			}
			get value() {
				return this._value
			}
			set value(e) {
				this.value !== e && (this._value = e, this.revision = ++rA)
			}
		};

	function rj(e, t) {
		return e === t
	}

	function rE(e) {
		return e instanceof rS || console.warn("Not a valid cell! ", e), e.value
	}
	var rk = (e, t) => !1;

	function rP() {
		return function(e = rj) {
			return new rS(null, e)
		}(rk)
	}
	var rM = e => {
			let t = e.collectionTag;
			null === t && (t = e.collectionTag = rP()), rE(t)
		},
		rI = 0,
		rC = Object.getPrototypeOf({}),
		rT = class {
			constructor(e) {
				this.value = e, this.value = e, this.tag.value = e
			}
			proxy = new Proxy(this, rD);
			tag = rP();
			tags = {};
			children = {};
			collectionTag = null;
			id = rI++
		},
		rD = {
			get: (e, t) => (function() {
				let {
					value: r
				} = e, n = Reflect.get(r, t);
				if ("symbol" == typeof t || t in rC) return n;
				if ("object" == typeof n && null !== n) {
					var i;
					let r = e.children[t];
					return void 0 === r && (r = e.children[t] = Array.isArray(i = n) ? new rN(i) : new rT(i)), r.tag && rE(r.tag), r.proxy
				} {
					let r = e.tags[t];
					return void 0 === r && ((r = e.tags[t] = rP()).value = n), rE(r), n
				}
			})(),
			ownKeys: e => (rM(e), Reflect.ownKeys(e.value)),
			getOwnPropertyDescriptor: (e, t) => Reflect.getOwnPropertyDescriptor(e.value, t),
			has: (e, t) => Reflect.has(e.value, t)
		},
		rN = class {
			constructor(e) {
				this.value = e, this.value = e, this.tag.value = e
			}
			proxy = new Proxy([this], rz);
			tag = rP();
			tags = {};
			children = {};
			collectionTag = null;
			id = rI++
		},
		rz = {
			get: ([e], t) => ("length" === t && rM(e), rD.get(e, t)),
			ownKeys: ([e]) => rD.ownKeys(e),
			getOwnPropertyDescriptor: ([e], t) => rD.getOwnPropertyDescriptor(e, t),
			has: ([e], t) => rD.has(e, t)
		},
		rL = "u" < typeof WeakRef ? class {
			constructor(e) {
				this.value = e
			}
			deref() {
				return this.value
			}
		} : WeakRef;

	function rR() {
		return {
			s: 0,
			v: void 0,
			o: null,
			p: null
		}
	}

	function rB(e, t = {}) {
		let r, n = rR(),
			{
				resultEqualityCheck: i
			} = t,
			a = 0;

		function o() {
			let t, o = n,
				{
					length: l
				} = arguments;
			for (let e = 0; e < l; e++) {
				let t = arguments[e];
				if ("function" == typeof t || "object" == typeof t && null !== t) {
					let e = o.o;
					null === e && (o.o = e = new WeakMap);
					let r = e.get(t);
					void 0 === r ? (o = rR(), e.set(t, o)) : o = r
				} else {
					let e = o.p;
					null === e && (o.p = e = new Map);
					let r = e.get(t);
					void 0 === r ? (o = rR(), e.set(t, o)) : o = r
				}
			}
			let u = o;
			if (1 === o.s) t = o.v;
			else if (t = e.apply(null, arguments), a++, i) {
				var c;
				let e = (c = r) instanceof rL ? c.deref() : c;
				null != e && i(e, t) && (t = e, 0 !== a && a--), r = "object" == typeof t && null !== t || "function" == typeof t ? new rL(t) : t
			}
			return u.s = 1, u.v = t, t
		}
		return o.clearCache = () => {
			n = rR(), o.resetResultsCount()
		}, o.resultsCount = () => a, o.resetResultsCount = () => {
			a = 0
		}, o
	}
	var r$ = function(e, ...t) {
			let r = "function" == typeof e ? {
					memoize: e,
					memoizeOptions: t
				} : e,
				n = (...e) => {
					let t, n, i = 0,
						a = 0,
						o = {},
						l = e.pop();
					"object" == typeof l && (o = l, l = e.pop()),
						function(e, t = `expected a function, instead received ${typeof e}`) {
							if ("function" != typeof e) throw TypeError(t)
						}(l, `createSelector expects an output function after the inputs, but received: [${typeof l}]`);
					let {
						memoize: u,
						memoizeOptions: c = [],
						argsMemoize: s = rB,
						argsMemoizeOptions: f = []
					} = {
						...r,
						...o
					}, h = r_(c), d = r_(f), p = (! function(e, t = "expected all items to be functions, instead received the following types: ") {
						if (!e.every(e => "function" == typeof e)) {
							let r = e.map(e => "function" == typeof e ? `function ${e.name||"unnamed"}()` : typeof e).join(", ");
							throw TypeError(`${t}[${r}]`)
						}
					}(t = Array.isArray(e[0]) ? e[0] : e, "createSelector expects all input-selectors to be functions, but received the following types: "), t), y = u(function() {
						return i++, l.apply(null, arguments)
					}, ...h);
					return Object.assign(s(function() {
						a++;
						let e = function(e, t) {
							let r = [],
								{
									length: n
								} = e;
							for (let i = 0; i < n; i++) r.push(e[i].apply(null, t));
							return r
						}(p, arguments);
						return n = y.apply(null, e)
					}, ...d), {
						resultFunc: l,
						memoizedResultFunc: y,
						dependencies: p,
						dependencyRecomputations: () => a,
						resetDependencyRecomputations: () => {
							a = 0
						},
						lastResult: () => n,
						recomputations: () => i,
						resetRecomputations: () => {
							i = 0
						},
						memoize: u,
						argsMemoize: s
					})
				};
			return Object.assign(n, {
				withTypes: () => n
			}), n
		}(rB),
		rU = Object.assign((e, t = r$) => {
			! function(e, t = `expected an object, instead received ${typeof e}`) {
				if ("object" != typeof e) throw TypeError(t)
			}(e, `createStructuredSelector expects first argument to be an object where each property is a selector, instead received a ${typeof e}`);
			let r = Object.keys(e);
			return t(r.map(t => e[t]), (...e) => e.reduce((e, t, n) => (e[r[n]] = t, e), {}))
		}, {
			withTypes: () => rU
		});

	function rF(e) {
		return ({
			dispatch: t,
			getState: r
		}) => n => i => "function" == typeof i ? i(t, r, e) : n(i)
	}
	var rK = rF();
	let rH = "u" > typeof window && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
		if (0 != arguments.length) return "object" == typeof arguments[0] ? t_ : t_.apply(null, arguments)
	};

	function rq(e, t) {
		function r(...n) {
			if (t) {
				let r = t(...n);
				if (!r) throw Error(n_(0));
				return {
					type: e,
					payload: r.payload,
					..."meta" in r && {
						meta: r.meta
					},
					..."error" in r && {
						error: r.error
					}
				}
			}
			return {
				type: e,
				payload: n[0]
			}
		}
		return r.toString = () => `${e}`, r.type = e, r.match = t => null != t && t.type === e && tA(t), r
	}
	"u" > typeof window && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__;
	var rW = class e extends Array {
		constructor(...t) {
			super(...t), Object.setPrototypeOf(this, e.prototype)
		}
		static get[Symbol.species]() {
			return e
		}
		concat(...e) {
			return super.concat.apply(this, e)
		}
		prepend(...t) {
			return 1 === t.length && Array.isArray(t[0]) ? new e(...t[0].concat(this)) : new e(...t.concat(this))
		}
	};

	function rV(e) {
		return tR(e) ? rO(e, () => {}) : e
	}

	function rY(e, t, r) {
		return e.has(t) ? e.get(t) : e.set(t, r(t)).get(t)
	}
	let rX = "RTK_autoBatch",
		rG = () => e => ({
			payload: e,
			meta: {
				[rX]: !0
			}
		}),
		rZ = e => t => {
			setTimeout(t, e)
		},
		rQ = (e = {
			type: "raf"
		}) => t => (...r) => {
			let n, i, a = t(...r),
				o = !0,
				l = !1,
				u = !1,
				c = new Set,
				s = "tick" === e.type ? queueMicrotask : "raf" === e.type ? "u" > typeof window && window.requestAnimationFrame ? (n = window.requestAnimationFrame, i = window.cancelAnimationFrame, e => {
					let t, r, a = !1,
						o = () => {
							a || (a = !0, i?.(t), clearTimeout(r), e())
						};
					t = n(o), r = setTimeout(o, 100)
				}) : rZ(10) : "callback" === e.type ? e.queueNotification : rZ(e.timeout),
				f = () => {
					u = !1, l && (l = !1, c.forEach(e => e()))
				};
			return Object.assign({}, a, {
				subscribe(e) {
					let t = a.subscribe(() => o && e());
					return c.add(e), () => {
						t(), c.delete(e)
					}
				},
				dispatch(e) {
					try {
						return (l = !(o = !e?.meta?.[rX])) && !u && (u = !0, s(f)), a.dispatch(e)
					} finally {
						o = !0
					}
				}
			})
		};

	function rJ(e) {
		let t, r = {},
			n = [],
			i = {
				addCase(e, t) {
					let n = "string" == typeof e ? e : e.type;
					if (!n) throw Error(n_(28));
					if (n in r) throw Error(n_(29));
					return r[n] = t, i
				},
				addAsyncThunk: (e, t) => (t.pending && (r[e.pending.type] = t.pending), t.rejected && (r[e.rejected.type] = t.rejected), t.fulfilled && (r[e.fulfilled.type] = t.fulfilled), t.settled && n.push({
					matcher: e.settled,
					reducer: t.settled
				}), i),
				addMatcher: (e, t) => (n.push({
					matcher: e,
					reducer: t
				}), i),
				addDefaultCase: e => (t = e, i)
			};
		return e(i), [r, n, t]
	}
	let r0 = Symbol.for("rtk-slice-createasyncthunk"),
		r1 = function({
			creators: e
		} = {}) {
			let t = e?.asyncThunk?.[r0];
			return function(e) {
				let r, {
					name: n,
					reducerPath: i = n
				} = e;
				if (!n) throw Error(n_(11));
				let a = ("function" == typeof e.reducers ? e.reducers(function() {
						function e(e, t) {
							return {
								_reducerDefinitionType: "asyncThunk",
								payloadCreator: e,
								...t
							}
						}
						return e.withTypes = () => e, {
							reducer: e => Object.assign({
								[e.name]: (...t) => e(...t)
							} [e.name], {
								_reducerDefinitionType: "reducer"
							}),
							preparedReducer: (e, t) => ({
								_reducerDefinitionType: "reducerWithPrepare",
								prepare: e,
								reducer: t
							}),
							asyncThunk: e
						}
					}()) : e.reducers) || {},
					o = Object.keys(a),
					l = {},
					u = {},
					c = {},
					s = [],
					f = {
						addCase(e, t) {
							let r = "string" == typeof e ? e : e.type;
							if (!r) throw Error(n_(12));
							if (r in u) throw Error(n_(13));
							return u[r] = t, f
						},
						addMatcher: (e, t) => (s.push({
							matcher: e,
							reducer: t
						}), f),
						exposeAction: (e, t) => (c[e] = t, f),
						exposeCaseReducer: (e, t) => (l[e] = t, f)
					};

				function h() {
					let [t = {}, r = [], n] = "function" == typeof e.extraReducers ? rJ(e.extraReducers) : [e.extraReducers], i = {
						...t,
						...u
					};
					return function(e, t) {
						let r, [n, i, a] = rJ(t);
						if ("function" == typeof e) r = () => rV(e());
						else {
							let t = rV(e);
							r = () => t
						}

						function o(e, t, r) {
							if (tL(e)) {
								let n = t(e, r);
								return void 0 === n ? e : n
							}
							if (tR(e)) return rO(e, e => t(e, r));
							{
								let n = t(e, r);
								if (void 0 === n) {
									if (null === e) return e;
									throw Error(n_(9))
								}
								return n
							}
						}

						function l(e = r(), t) {
							let u, c = n[t.type];
							for (let {
									matcher: e,
									reducer: r
								}
								of i) e(t) && r && (u ??= []).push(r);
							if (!c && !u) return a ? o(e, a, t) : e;
							if (c && (e = o(e, c, t)), u)
								for (let r of u) e = o(e, r, t);
							return e
						}
						return l.getInitialState = r, l
					}(e.initialState, e => {
						for (let t in i) e.addCase(t, i[t]);
						for (let t of s) e.addMatcher(t.matcher, t.reducer);
						for (let t of r) e.addMatcher(t.matcher, t.reducer);
						n && e.addDefaultCase(n)
					})
				}
				o.forEach(r => {
					let i = a[r],
						o = {
							reducerName: r,
							type: `${n}/${r}`,
							createNotation: "function" == typeof e.reducers
						};
					"asyncThunk" === i._reducerDefinitionType ? function({
						type: e,
						reducerName: t
					}, r, n, i) {
						if (!i) throw Error(n_(18));
						let {
							payloadCreator: a,
							fulfilled: o,
							pending: l,
							rejected: u,
							settled: c,
							options: s
						} = r, f = i(e, a, s);
						n.exposeAction(t, f), o && n.addCase(f.fulfilled, o), l && n.addCase(f.pending, l), u && n.addCase(f.rejected, u), c && n.addMatcher(f.settled, c), n.exposeCaseReducer(t, {
							fulfilled: o || r2,
							pending: l || r2,
							rejected: u || r2,
							settled: c || r2
						})
					}(o, i, f, t) : function({
						type: e,
						reducerName: t,
						createNotation: r
					}, n, i) {
						let a, o;
						if ("reducer" in n) {
							if (r && "reducerWithPrepare" !== n._reducerDefinitionType) throw Error(n_(17));
							a = n.reducer, o = n.prepare
						} else a = n;
						i.addCase(e, a).exposeCaseReducer(t, a).exposeAction(t, o ? rq(e, o) : rq(e))
					}(o, i, f)
				});
				let d = e => e,
					p = new Map,
					y = new WeakMap;

				function v(e, t) {
					return r || (r = h()), r(e, t)
				}

				function m() {
					return r || (r = h()), r.getInitialState()
				}

				function g(t, r = !1) {
					function n(e) {
						let i = e[t];
						return void 0 === i && r && (i = rY(y, n, m)), i
					}

					function i(t = d) {
						return rY(rY(p, r, () => new WeakMap), t, () => {
							let n = {};
							for (let [i, a] of Object.entries(e.selectors ?? {})) n[i] = function(e, t, r, n) {
								function i(a, ...o) {
									let l = t(a);
									return void 0 === l && n && (l = r()), e(l, ...o)
								}
								return i.unwrapped = e, i
							}(a, t, () => rY(y, t, m), r);
							return n
						})
					}
					return {
						reducerPath: t,
						getSelectors: i,
						get selectors() {
							return i(n)
						},
						selectSlice: n
					}
				}
				let b = {
					name: n,
					reducer: v,
					actions: c,
					caseReducers: l,
					getInitialState: m,
					...g(i),
					injectInto(e, {
						reducerPath: t,
						...r
					} = {}) {
						let n = t ?? i;
						return e.inject({
							reducerPath: n,
							reducer: v
						}, r), {
							...b,
							...g(n, !0)
						}
					}
				};
				return b
			}
		}();

	function r2() {}
	let r3 = "listener",
		r5 = "completed",
		r6 = "cancelled",
		r4 = `task-${r6}`,
		r8 = `task-${r5}`,
		r7 = `${r3}-${r6}`,
		r9 = `${r3}-${r5}`;
	var ne = class {
		code;
		name = "TaskAbortError";
		message;
		constructor(e) {
			this.code = e, this.message = `task ${r6} (reason: ${e})`
		}
	};
	let nt = (e, t) => {
			if ("function" != typeof e) throw TypeError(n_(32))
		},
		nr = () => {},
		nn = (e, t = nr) => (e.catch(t), e),
		ni = (e, t) => (e.addEventListener("abort", t, {
			once: !0
		}), () => e.removeEventListener("abort", t)),
		na = e => {
			if (e.aborted) throw new ne(e.reason)
		};

	function no(e, t) {
		let r = nr;
		return new Promise((n, i) => {
			let a = () => i(new ne(e.reason));
			e.aborted ? a() : (r = ni(e, a), t.finally(() => r()).then(n, i))
		}).finally(() => {
			r = nr
		})
	}
	let nl = async (e, t) => {
		try {
			return await Promise.resolve(), {
				status: "ok",
				value: await e()
			}
		} catch (e) {
			return {
				status: e instanceof ne ? "cancelled" : "rejected",
				error: e
			}
		} finally {
			t?.()
		}
	}, nu = e => t => nn(no(e, t).then(t => (na(e), t))), nc = e => {
		let t = nu(e);
		return e => {
			let r;
			return nn(t(new Promise(t => {
				r = setTimeout(t, e)
			})).finally(() => clearTimeout(r)))
		}
	}, {
		assign: ns
	} = Object, nf = {}, nh = "listenerMiddleware", nd = e => {
		let {
			type: t,
			actionCreator: r,
			matcher: n,
			predicate: i,
			effect: a
		} = e;
		if (t) i = rq(t).match;
		else if (r) t = r.type, i = r.match;
		else if (n) i = n;
		else if (i);
		else throw Error(n_(21));
		return nt(a, "options.listener"), {
			predicate: i,
			type: t,
			effect: a
		}
	}, np = ns(e => {
		let {
			type: t,
			predicate: r,
			effect: n
		} = nd(e);
		return {
			id: ((e = 21) => {
				let t = "",
					r = e;
				for (; r--;) t += "ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW" [64 * Math.random() | 0];
				return t
			})(),
			effect: n,
			type: t,
			predicate: r,
			pending: new Set,
			unsubscribe: () => {
				throw Error(n_(22))
			}
		}
	}, {
		withTypes: () => np
	}), ny = (e, t) => {
		let {
			type: r,
			effect: n,
			predicate: i
		} = nd(t);
		return Array.from(e.values()).find(e => ("string" == typeof r ? e.type === r : e.predicate === i) && e.effect === n)
	}, nv = e => {
		e.pending.forEach(e => {
			e.abort(r7)
		})
	}, nm = (e, t, r) => {
		try {
			e(t, r)
		} catch (e) {
			setTimeout(() => {
				throw e
			}, 0)
		}
	}, ng = ns(rq(`${nh}/add`), {
		withTypes: () => ng
	}), nb = rq(`${nh}/removeAll`), nx = ns(rq(`${nh}/remove`), {
		withTypes: () => nx
	}), nw = (...e) => {
		console.error(`${nh}/error`, ...e)
	}, nO = (e = {}) => {
		let t, r = new Map,
			n = new Map,
			{
				extra: i,
				onError: a = nw
			} = e;
		nt(a, "onError");
		let o = e => {
				r.has(e.id) || (r.set(e.id, e), t = void 0)
			},
			l = e => {
				var n;
				return (n = ny(r, e) ?? np(e)).unsubscribe = () => {
					r.delete(n.id) && (t = void 0)
				}, o(n), e => {
					n.unsubscribe(), e?.cancelActive && nv(n)
				}
			};
		ns(l, {
			withTypes: () => l
		});
		let u = e => {
			let t = ny(r, e);
			return t && (t.unsubscribe(), e.cancelActive && nv(t)), !!t
		};
		ns(u, {
			withTypes: () => u
		});
		let c = async (e, t, r, u) => {
			var c, s;
			let f, h = new AbortController,
				d = (c = h.signal, f = async (e, t) => {
					let r;
					na(c);
					let n = () => {},
						i = [new Promise((t, r) => {
							let i = l({
								predicate: e,
								effect: (e, r) => {
									r.unsubscribe(), t([e, r.getState(), r.getOriginalState()])
								}
							});
							n = () => {
								i(), r()
							}
						})];
					null != t && i.push(new Promise(e => {
						r = setTimeout(e, t, null)
					}));
					try {
						let e = await no(c, Promise.race(i));
						return na(c), e
					} finally {
						clearTimeout(r), n()
					}
				}, (e, t) => nn(f(e, t))),
				p = [];
			try {
				let a;
				e.pending.add(h), a = n.get(e) ?? 0, n.set(e, a + 1), await Promise.resolve(e.effect(t, ns({}, r, {
					getOriginalState: u,
					condition: (e, t) => d(e, t).then(Boolean),
					take: d,
					delay: nc(h.signal),
					pause: nu(h.signal),
					extra: i,
					signal: h.signal,
					fork: (s = h.signal, (e, t) => {
						nt(e, "taskExecutor");
						let r = new AbortController;
						ni(s, () => r.abort(s.reason));
						let n = nl(async () => {
							na(s), na(r.signal);
							let t = await e({
								pause: nu(r.signal),
								delay: nc(r.signal),
								signal: r.signal
							});
							return na(r.signal), t
						}, () => r.abort(r8));
						return t?.autoJoin && p.push(n.catch(nr)), {
							result: nu(s)(n),
							cancel() {
								r.abort(r4)
							}
						}
					}),
					unsubscribe: e.unsubscribe,
					subscribe: () => {
						o(e)
					},
					cancelActiveListeners: () => {
						e.pending.forEach((e, t, r) => {
							e !== h && (e.abort(r7), r.delete(e))
						})
					},
					cancel: () => {
						h.abort(r7), e.pending.delete(h)
					},
					throwIfCancelled: () => {
						na(h.signal)
					}
				})))
			} catch (e) {
				e instanceof ne || nm(a, e, {
					raisedBy: "effect"
				})
			} finally {
				let t;
				await Promise.all(p), h.abort(r9), 1 === (t = n.get(e) ?? 1) ? n.delete(e) : n.set(e, t - 1), e.pending.delete(h)
			}
		}, s = () => {
			for (let e of n.keys()) nv(e);
			r.clear()
		}, f = () => {
			s(), t = void 0
		};
		return {
			middleware: e => n => i => {
				let o;
				if (!tA(i)) return n(i);
				if (ng.match(i)) return l(i.payload);
				if (nb.match(i)) return void f();
				if (nx.match(i)) return u(i.payload);
				let s = e.getState(),
					h = () => {
						if (s === nf) throw Error(n_(23));
						return s
					};
				try {
					o = n(i);
					let {
						entries: l,
						types: u,
						anyType: f
					} = (() => {
						if (!t) {
							let e = Array.from(r.values()),
								n = new Set,
								i = !1;
							for (let t of e) "string" == typeof t.type ? n.add(t.type) : i = !0;
							t = {
								entries: e,
								types: n,
								anyType: i
							}
						}
						return t
					})();
					if (f || u.has(i.type)) {
						let t = e.getState();
						for (let r of l) {
							if ("string" == typeof r.type && r.type !== i.type) continue;
							let n = !1;
							try {
								n = r.predicate(i, t, s)
							} catch (e) {
								n = !1, nm(a, e, {
									raisedBy: "predicate"
								})
							}
							n && c(r, i, e, h)
						}
					}
				} finally {
					s = nf
				}
				return o
			},
			startListening: l,
			stopListening: u,
			clearListeners: f
		}
	};

	function n_(e) {
		return `Minified Redux Toolkit error #${e}; visit https://redux-toolkit.js.org/Errors?code=${e} for the full message or use the non-minified dev environment for full errors. `
	}
	Symbol.for("rtk-state-proxy-original");
	var nA = r1({
			name: "chartLayout",
			initialState: {
				layoutType: "horizontal",
				width: 0,
				height: 0,
				margin: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				},
				scale: 1
			},
			reducers: {
				setLayout(e, t) {
					e.layoutType = t.payload
				},
				setChartSize(e, t) {
					e.width = t.payload.width, e.height = t.payload.height
				},
				setMargin(e, t) {
					var r, n, i, a;
					e.margin.top = null != (r = t.payload.top) ? r : 0, e.margin.right = null != (n = t.payload.right) ? n : 0, e.margin.bottom = null != (i = t.payload.bottom) ? i : 0, e.margin.left = null != (a = t.payload.left) ? a : 0
				},
				setScale(e, t) {
					e.scale = t.payload
				}
			}
		}),
		nS = nA.actions,
		nj = nS.setMargin,
		nE = nS.setLayout,
		nk = nS.setChartSize,
		nP = nS.setScale,
		nM = nA.reducer;

	function nI(e, t) {
		return e === t || Number.isNaN(e) && Number.isNaN(t)
	}

	function nC(e) {
		var t;
		return null != e && "function" != typeof e && Number.isSafeInteger(t = e.length) && t >= 0
	}

	function nT(e) {
		return null !== e && ("object" == typeof e || "function" == typeof e)
	}
	let nD = /^(?:0|[1-9]\d*)$/;

	function nN(e, t = Number.MAX_SAFE_INTEGER) {
		switch (typeof e) {
			case "number":
				return Number.isInteger(e) && e >= 0 && e < t;
			case "symbol":
				return !1;
			case "string":
				return nD.test(e)
		}
	}

	function nz(e, t, r) {
		return !!nT(r) && (!!("number" == typeof t && nC(r) && nN(t)) && t < r.length || "string" == typeof t && t in r) && nI(r[t], e)
	}

	function nL(e) {
		return "symbol" == typeof e ? 1 : null === e ? 2 : void 0 === e ? 3 : 4 * (e != e)
	}
	let nR = (e, t, r) => {
			if (e !== t) {
				let n = nL(e),
					i = nL(t);
				if (n === i && 0 === n) {
					if (e < t) return "desc" === r ? 1 : -1;
					if (e > t) return "desc" === r ? -1 : 1
				}
				return "desc" === r ? i - n : n - i
			}
			return 0
		},
		nB = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
		n$ = /^\w*$/;

	function nU(e, ...t) {
		let r = t.length;
		return r > 1 && nz(e, t[0], t[1]) ? t = [] : r > 2 && nz(t[0], t[1], t[2]) && (t = [t[0]]),
			function(e, t, r) {
				if (null == e) return [];
				Array.isArray(e) || (e = nC(e) ? Array.from(e) : function(e) {
					let t = Object.keys(e),
						r = Array(t.length);
					for (let n = 0; n < t.length; n++) r[n] = e[t[n]];
					return r
				}(e)), Array.isArray(t) || (t = null == t ? [null] : [t]), 0 === t.length && (t = [null]), Array.isArray(r) || (r = null == r ? [] : [r]), r = r.map(e => String(e));
				let n = (e, t) => {
						let r = e,
							n = 0;
						for (; n < t.length && null != r; ++n) r = r[t[n]];
						return n > 0 && n === t.length ? r : void 0
					},
					i = t.map(e => {
						var t;
						return (Array.isArray(e) && 1 === e.length && (e = e[0]), null == e || "function" == typeof e || Array.isArray(e) || !Array.isArray(t = e) && ("number" == typeof t || "boolean" == typeof t || null == t || ef(t) || "string" == typeof t && (n$.test(t) || !nB.test(t)) || 0)) ? e : {
							key: e,
							path: eh(e)
						}
					});
				return e.map(e => ({
					original: e,
					criteria: i.map(t => ((e, t) => {
						if (null == e) return t;
						if (null != t) return "object" == typeof e && "key" in e ? el(t, e.key) ? t[e.key] : n(t, e.path) : "function" == typeof e ? e(t) : Array.isArray(e) ? n(t, e) : t[e]
					})(t, e))
				})).slice().sort((e, t) => {
					for (let n = 0; n < i.length; n++) {
						let i = nR(e.criteria[n], t.criteria[n], r[n]);
						if (0 !== i) return i
					}
					return 0
				}).map(e => e.original)
			}(e, function(e, t = 1) {
				let r = [],
					n = Math.floor(t),
					i = (e, t) => {
						for (let a = 0; a < e.length; a++) {
							let o = e[a];
							Array.isArray(o) && t < n ? i(o, t + 1) : r.push(o)
						}
					};
				return i(e, 0), r
			}(t), ["asc"])
	}
	var nF = e => e.legend.settings,
		nK = r$([e => e.legend.payload, nF], (e, t) => {
			var r = t.itemSorter,
				n = e.flat(1);
			return r ? nU(n, r) : n
		});
	let nH = Math.PI,
		nq = 2 * nH,
		nW = nq - 1e-6;

	function nV(e) {
		this._ += e[0];
		for (let t = 1, r = e.length; t < r; ++t) this._ += arguments[t] + e[t]
	}

	function nY(e, t, r, n) {
		return e === r && t === n
	}
	class nX {
		constructor(e) {
			this._x0 = this._y0 = this._x1 = this._y1 = null, this._ = "", this._append = null == e ? nV : function(e) {
				let t = Math.floor(e);
				if (!(t >= 0)) throw Error(`invalid digits: ${e}`);
				if (t > 15) return nV;
				let r = 10 ** t;
				return function(e) {
					this._ += e[0];
					for (let t = 1, n = e.length; t < n; ++t) this._ += Math.round(arguments[t] * r) / r + e[t]
				}
			}(e), this._equal = null == e ? nY : function(e) {
				let t = Math.floor(e);
				if (!(t <= 15)) return nY;
				let r = 10 ** t,
					n = function(e) {
						return Math.round(e * r)
					};
				return function(e, t, r, i) {
					return n(e) === n(r) && n(t) === n(i)
				}
			}(e)
		}
		moveTo(e, t) {
			this._append`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}`
		}
		closePath() {
			null !== this._x1 && (this._x1 = this._x0, this._y1 = this._y0, this._append`Z`)
		}
		lineTo(e, t) {
			this._append`L${this._x1=+e},${this._y1=+t}`
		}
		quadraticCurveTo(e, t, r, n) {
			this._append`Q${+e},${+t},${this._x1=+r},${this._y1=+n}`
		}
		bezierCurveTo(e, t, r, n, i, a) {
			this._append`C${+e},${+t},${+r},${+n},${this._x1=+i},${this._y1=+a}`
		}
		arcTo(e, t, r, n, i) {
			if (e *= 1, t *= 1, r *= 1, n *= 1, (i *= 1) < 0) throw Error(`negative radius: ${i}`);
			let a = this._x1,
				o = this._y1,
				l = r - e,
				u = n - t,
				c = a - e,
				s = o - t,
				f = c * c + s * s;
			if (null === this._x1) this._append`M${this._x1=e},${this._y1=t}`;
			else if (f > 1e-6)
				if (Math.abs(s * l - u * c) > 1e-6 && i) {
					let h = r - a,
						d = n - o,
						p = l * l + u * u,
						y = Math.sqrt(p),
						v = Math.sqrt(f),
						m = i * Math.tan((nH - Math.acos((p + f - (h * h + d * d)) / (2 * y * v))) / 2),
						g = m / v,
						b = m / y;
					Math.abs(g - 1) > 1e-6 && this._append`L${e+g*c},${t+g*s}`, this._append`A${i},${i},0,0,${+(s*h>c*d)},${this._x1=e+b*l},${this._y1=t+b*u}`
				} else this._append`L${this._x1=e},${this._y1=t}`
		}
		arc(e, t, r, n, i, a) {
			if (e *= 1, t *= 1, r *= 1, a = !!a, r < 0) throw Error(`negative radius: ${r}`);
			let o = r * Math.cos(n),
				l = r * Math.sin(n),
				u = e + o,
				c = t + l,
				s = 1 ^ a,
				f = a ? n - i : i - n;
			if (null === this._x1 ? this._append`M${u},${c}` : (Math.abs(this._x1 - u) > 1e-6 || Math.abs(this._y1 - c) > 1e-6) && this._append`L${u},${c}`, r) {
				if (f < 0 && (f = f % nq + nq), f > nW) this._append`A${r},${r},0,1,${s},${e-o},${t-l}A${r},${r},0,1,${s},${this._x1=u},${this._y1=c}`;
				else if (f > 1e-6) {
					let a = e + r * Math.cos(i),
						o = t + r * Math.sin(i);
					if (f >= nH && this._equal(u, c, a, o)) {
						let i = n + (f /= 2);
						this._append`A${r},${r},0,${+(f>=nH)},${s},${e+r*Math.cos(i)},${t+r*Math.sin(i)}`
					}
					this._append`A${r},${r},0,${+(f>=nH)},${s},${this._x1=a},${this._y1=o}`
				}
			}
		}
		rect(e, t, r, n) {
			this._append`M${this._x0=this._x1=+e},${this._y0=this._y1=+t}h${r*=1}v${+n}h${-r}Z`
		}
		toString() {
			return this._
		}
	}

	function nG(e) {
		return function() {
			return e
		}
	}
	nX.prototype;
	let nZ = Math.cos,
		nQ = Math.sin,
		nJ = Math.sqrt,
		n0 = Math.PI,
		n1 = 2 * n0;

	function n2(e) {
		let t = 3;
		return e.digits = function(r) {
			if (!arguments.length) return t;
			if (null == r) t = null;
			else {
				let e = Math.floor(r);
				if (!(e >= 0)) throw RangeError(`invalid digits: ${r}`);
				t = e
			}
			return e
		}, () => new nX(t)
	}

	function n3(e) {
		return "object" == typeof e && "length" in e ? e : Array.from(e)
	}

	function n5(e) {
		this._context = e
	}

	function n6(e) {
		return new n5(e)
	}

	function n4(e) {
		return e[0]
	}

	function n8(e) {
		return e[1]
	}

	function n7(e, t) {
		var r = nG(!0),
			n = null,
			i = n6,
			a = null,
			o = n2(l);

		function l(l) {
			var u, c, s, f = (l = n3(l)).length,
				h = !1;
			for (null == n && (a = i(s = o())), u = 0; u <= f; ++u) !(u < f && r(c = l[u], u, l)) === h && ((h = !h) ? a.lineStart() : a.lineEnd()), h && a.point(+e(c, u, l), +t(c, u, l));
			if (s) return a = null, s + "" || null
		}
		return e = "function" == typeof e ? e : void 0 === e ? n4 : nG(e), t = "function" == typeof t ? t : void 0 === t ? n8 : nG(t), l.x = function(t) {
			return arguments.length ? (e = "function" == typeof t ? t : nG(+t), l) : e
		}, l.y = function(e) {
			return arguments.length ? (t = "function" == typeof e ? e : nG(+e), l) : t
		}, l.defined = function(e) {
			return arguments.length ? (r = "function" == typeof e ? e : nG(!!e), l) : r
		}, l.curve = function(e) {
			return arguments.length ? (i = e, null != n && (a = i(n)), l) : i
		}, l.context = function(e) {
			return arguments.length ? (null == e ? n = a = null : a = i(n = e), l) : n
		}, l
	}

	function n9(e, t, r) {
		var n = null,
			i = nG(!0),
			a = null,
			o = n6,
			l = null,
			u = n2(c);

		function c(c) {
			var s, f, h, d, p, y = (c = n3(c)).length,
				v = !1,
				m = Array(y),
				g = Array(y);
			for (null == a && (l = o(p = u())), s = 0; s <= y; ++s) {
				if (!(s < y && i(d = c[s], s, c)) === v)
					if (v = !v) f = s, l.areaStart(), l.lineStart();
					else {
						for (l.lineEnd(), l.lineStart(), h = s - 1; h >= f; --h) l.point(m[h], g[h]);
						l.lineEnd(), l.areaEnd()
					} v && (m[s] = +e(d, s, c), g[s] = +t(d, s, c), l.point(n ? +n(d, s, c) : m[s], r ? +r(d, s, c) : g[s]))
			}
			if (p) return l = null, p + "" || null
		}

		function s() {
			return n7().defined(i).curve(o).context(a)
		}
		return e = "function" == typeof e ? e : void 0 === e ? n4 : nG(+e), t = "function" == typeof t ? t : void 0 === t ? nG(0) : nG(+t), r = "function" == typeof r ? r : void 0 === r ? n8 : nG(+r), c.x = function(t) {
			return arguments.length ? (e = "function" == typeof t ? t : nG(+t), n = null, c) : e
		}, c.x0 = function(t) {
			return arguments.length ? (e = "function" == typeof t ? t : nG(+t), c) : e
		}, c.x1 = function(e) {
			return arguments.length ? (n = null == e ? null : "function" == typeof e ? e : nG(+e), c) : n
		}, c.y = function(e) {
			return arguments.length ? (t = "function" == typeof e ? e : nG(+e), r = null, c) : t
		}, c.y0 = function(e) {
			return arguments.length ? (t = "function" == typeof e ? e : nG(+e), c) : t
		}, c.y1 = function(e) {
			return arguments.length ? (r = null == e ? null : "function" == typeof e ? e : nG(+e), c) : r
		}, c.lineX0 = c.lineY0 = function() {
			return s().x(e).y(t)
		}, c.lineY1 = function() {
			return s().x(e).y(r)
		}, c.lineX1 = function() {
			return s().x(n).y(t)
		}, c.defined = function(e) {
			return arguments.length ? (i = "function" == typeof e ? e : nG(!!e), c) : i
		}, c.curve = function(e) {
			return arguments.length ? (o = e, null != a && (l = o(a)), c) : o
		}, c.context = function(e) {
			return arguments.length ? (null == e ? a = l = null : l = o(a = e), c) : a
		}, c
	}

	function ie(e) {
		this._curve = e
	}
	Array.prototype.slice, n5.prototype = {
		areaStart: function() {
			this._line = 0
		},
		areaEnd: function() {
			this._line = 0 / 0
		},
		lineStart: function() {
			this._point = 0
		},
		lineEnd: function() {
			(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
		},
		point: function(e, t) {
			switch (e *= 1, t *= 1, this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
				default:
					this._context.lineTo(e, t)
			}
		}
	}, r = n6, ie.prototype = {
		areaStart: function() {
			this._curve.areaStart()
		},
		areaEnd: function() {
			this._curve.areaEnd()
		},
		lineStart: function() {
			this._curve.lineStart()
		},
		lineEnd: function() {
			this._curve.lineEnd()
		},
		point: function(e, t) {
			this._curve.point(t * Math.sin(e), -(t * Math.cos(e)))
		}
	};
	class it {
		constructor(e, t) {
			this._context = e, this._x = t
		}
		areaStart() {
			this._line = 0
		}
		areaEnd() {
			this._line = 0 / 0
		}
		lineStart() {
			this._point = 0
		}
		lineEnd() {
			(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
		}
		point(e, t) {
			switch (e *= 1, t *= 1, this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
				default:
					this._x ? this._context.bezierCurveTo(this._x0 = (this._x0 + e) / 2, this._y0, this._x0, t, e, t) : this._context.bezierCurveTo(this._x0, this._y0 = (this._y0 + t) / 2, e, this._y0, e, t)
			}
			this._x0 = e, this._y0 = t
		}
	}
	nJ(3);
	var ir = {
		draw(e, t) {
			let r = nJ(t / n0);
			e.moveTo(r, 0), e.arc(0, 0, r, 0, n1)
		}
	};
	let ii = nJ(1 / 3),
		ia = 2 * ii,
		io = nQ(n0 / 10) / nQ(7 * n0 / 10),
		il = nQ(n1 / 10) * io,
		iu = -nZ(n1 / 10) * io,
		ic = nJ(3);
	nJ(3);
	let is = nJ(3) / 2,
		ih = 1 / nJ(12),
		id = (ih / 2 + 1) * 3;

	function ip() {}

	function iy(e, t, r) {
		e._context.bezierCurveTo((2 * e._x0 + e._x1) / 3, (2 * e._y0 + e._y1) / 3, (e._x0 + 2 * e._x1) / 3, (e._y0 + 2 * e._y1) / 3, (e._x0 + 4 * e._x1 + t) / 6, (e._y0 + 4 * e._y1 + r) / 6)
	}

	function iv(e) {
		this._context = e
	}

	function im(e) {
		this._context = e
	}

	function ig(e) {
		this._context = e
	}

	function ib(e, t) {
		this._basis = new iv(e), this._beta = t
	}

	function ix(e, t, r) {
		e._context.bezierCurveTo(e._x1 + e._k * (e._x2 - e._x0), e._y1 + e._k * (e._y2 - e._y0), e._x2 + e._k * (e._x1 - t), e._y2 + e._k * (e._y1 - r), e._x2, e._y2)
	}

	function iw(e, t) {
		this._context = e, this._k = (1 - t) / 6
	}

	function iO(e, t) {
		this._context = e, this._k = (1 - t) / 6
	}

	function i_(e, t) {
		this._context = e, this._k = (1 - t) / 6
	}

	function iA(e, t, r) {
		var n = e._x1,
			i = e._y1,
			a = e._x2,
			o = e._y2;
		if (e._l01_a > 1e-12) {
			var l = 2 * e._l01_2a + 3 * e._l01_a * e._l12_a + e._l12_2a,
				u = 3 * e._l01_a * (e._l01_a + e._l12_a);
			n = (n * l - e._x0 * e._l12_2a + e._x2 * e._l01_2a) / u, i = (i * l - e._y0 * e._l12_2a + e._y2 * e._l01_2a) / u
		}
		if (e._l23_a > 1e-12) {
			var c = 2 * e._l23_2a + 3 * e._l23_a * e._l12_a + e._l12_2a,
				s = 3 * e._l23_a * (e._l23_a + e._l12_a);
			a = (a * c + e._x1 * e._l23_2a - t * e._l12_2a) / s, o = (o * c + e._y1 * e._l23_2a - r * e._l12_2a) / s
		}
		e._context.bezierCurveTo(n, i, a, o, e._x2, e._y2)
	}

	function iS(e, t) {
		this._context = e, this._alpha = t
	}

	function ij(e, t) {
		this._context = e, this._alpha = t
	}

	function iE(e, t) {
		this._context = e, this._alpha = t
	}

	function ik(e) {
		this._context = e
	}
	iv.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._y0 = this._y1 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 3:
						iy(this, this._x1, this._y1);
					case 2:
						this._context.lineTo(this._x1, this._y1)
				}(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3, this._context.lineTo((5 * this._x0 + this._x1) / 6, (5 * this._y0 + this._y1) / 6);
					default:
						iy(this, e, t)
				}
				this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
			}
		}, im.prototype = {
			areaStart: ip,
			areaEnd: ip,
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 1:
						this._context.moveTo(this._x2, this._y2), this._context.closePath();
						break;
					case 2:
						this._context.moveTo((this._x2 + 2 * this._x3) / 3, (this._y2 + 2 * this._y3) / 3), this._context.lineTo((this._x3 + 2 * this._x2) / 3, (this._y3 + 2 * this._y2) / 3), this._context.closePath();
						break;
					case 3:
						this.point(this._x2, this._y2), this.point(this._x3, this._y3), this.point(this._x4, this._y4)
				}
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1, this._x2 = e, this._y2 = t;
						break;
					case 1:
						this._point = 2, this._x3 = e, this._y3 = t;
						break;
					case 2:
						this._point = 3, this._x4 = e, this._y4 = t, this._context.moveTo((this._x0 + 4 * this._x1 + e) / 6, (this._y0 + 4 * this._y1 + t) / 6);
						break;
					default:
						iy(this, e, t)
				}
				this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
			}
		}, ig.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._y0 = this._y1 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				(this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1;
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3;
						var r = (this._x0 + 4 * this._x1 + e) / 6,
							n = (this._y0 + 4 * this._y1 + t) / 6;
						this._line ? this._context.lineTo(r, n) : this._context.moveTo(r, n);
						break;
					case 3:
						this._point = 4;
					default:
						iy(this, e, t)
				}
				this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t
			}
		}, ib.prototype = {
			lineStart: function() {
				this._x = [], this._y = [], this._basis.lineStart()
			},
			lineEnd: function() {
				var e = this._x,
					t = this._y,
					r = e.length - 1;
				if (r > 0)
					for (var n, i = e[0], a = t[0], o = e[r] - i, l = t[r] - a, u = -1; ++u <= r;) n = u / r, this._basis.point(this._beta * e[u] + (1 - this._beta) * (i + n * o), this._beta * t[u] + (1 - this._beta) * (a + n * l));
				this._x = this._y = null, this._basis.lineEnd()
			},
			point: function(e, t) {
				this._x.push(+e), this._y.push(+t)
			}
		},
		function e(t) {
			function r(e) {
				return 1 === t ? new iv(e) : new ib(e, t)
			}
			return r.beta = function(t) {
				return e(+t)
			}, r
		}(.85), iw.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 2:
						this._context.lineTo(this._x2, this._y2);
						break;
					case 3:
						ix(this, this._x1, this._y1)
				}(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
						break;
					case 1:
						this._point = 2, this._x1 = e, this._y1 = t;
						break;
					case 2:
						this._point = 3;
					default:
						ix(this, e, t)
				}
				this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return new iw(e, t)
			}
			return r.tension = function(t) {
				return e(+t)
			}, r
		}(0), iO.prototype = {
			areaStart: ip,
			areaEnd: ip,
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 1:
						this._context.moveTo(this._x3, this._y3), this._context.closePath();
						break;
					case 2:
						this._context.lineTo(this._x3, this._y3), this._context.closePath();
						break;
					case 3:
						this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5)
				}
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1, this._x3 = e, this._y3 = t;
						break;
					case 1:
						this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
						break;
					case 2:
						this._point = 3, this._x5 = e, this._y5 = t;
						break;
					default:
						ix(this, e, t)
				}
				this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return new iO(e, t)
			}
			return r.tension = function(t) {
				return e(+t)
			}, r
		}(0), i_.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = 0 / 0, this._point = 0
			},
			lineEnd: function() {
				(this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				switch (e *= 1, t *= 1, this._point) {
					case 0:
						this._point = 1;
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
						break;
					case 3:
						this._point = 4;
					default:
						ix(this, e, t)
				}
				this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return new i_(e, t)
			}
			return r.tension = function(t) {
				return e(+t)
			}, r
		}(0), iS.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = 0 / 0, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 2:
						this._context.lineTo(this._x2, this._y2);
						break;
					case 3:
						this.point(this._x2, this._y2)
				}(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				if (e *= 1, t *= 1, this._point) {
					var r = this._x2 - e,
						n = this._y2 - t;
					this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + n * n, this._alpha))
				}
				switch (this._point) {
					case 0:
						this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3;
					default:
						iA(this, e, t)
				}
				this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return t ? new iS(e, t) : new iw(e, 0)
			}
			return r.alpha = function(t) {
				return e(+t)
			}, r
		}(.5), ij.prototype = {
			areaStart: ip,
			areaEnd: ip,
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._x3 = this._x4 = this._x5 = this._y0 = this._y1 = this._y2 = this._y3 = this._y4 = this._y5 = 0 / 0, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0
			},
			lineEnd: function() {
				switch (this._point) {
					case 1:
						this._context.moveTo(this._x3, this._y3), this._context.closePath();
						break;
					case 2:
						this._context.lineTo(this._x3, this._y3), this._context.closePath();
						break;
					case 3:
						this.point(this._x3, this._y3), this.point(this._x4, this._y4), this.point(this._x5, this._y5)
				}
			},
			point: function(e, t) {
				if (e *= 1, t *= 1, this._point) {
					var r = this._x2 - e,
						n = this._y2 - t;
					this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + n * n, this._alpha))
				}
				switch (this._point) {
					case 0:
						this._point = 1, this._x3 = e, this._y3 = t;
						break;
					case 1:
						this._point = 2, this._context.moveTo(this._x4 = e, this._y4 = t);
						break;
					case 2:
						this._point = 3, this._x5 = e, this._y5 = t;
						break;
					default:
						iA(this, e, t)
				}
				this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return t ? new ij(e, t) : new iO(e, 0)
			}
			return r.alpha = function(t) {
				return e(+t)
			}, r
		}(.5), iE.prototype = {
			areaStart: function() {
				this._line = 0
			},
			areaEnd: function() {
				this._line = 0 / 0
			},
			lineStart: function() {
				this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = 0 / 0, this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0
			},
			lineEnd: function() {
				(this._line || 0 !== this._line && 3 === this._point) && this._context.closePath(), this._line = 1 - this._line
			},
			point: function(e, t) {
				if (e *= 1, t *= 1, this._point) {
					var r = this._x2 - e,
						n = this._y2 - t;
					this._l23_a = Math.sqrt(this._l23_2a = Math.pow(r * r + n * n, this._alpha))
				}
				switch (this._point) {
					case 0:
						this._point = 1;
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3, this._line ? this._context.lineTo(this._x2, this._y2) : this._context.moveTo(this._x2, this._y2);
						break;
					case 3:
						this._point = 4;
					default:
						iA(this, e, t)
				}
				this._l01_a = this._l12_a, this._l12_a = this._l23_a, this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a, this._x0 = this._x1, this._x1 = this._x2, this._x2 = e, this._y0 = this._y1, this._y1 = this._y2, this._y2 = t
			}
		},
		function e(t) {
			function r(e) {
				return t ? new iE(e, t) : new i_(e, 0)
			}
			return r.alpha = function(t) {
				return e(+t)
			}, r
		}(.5), ik.prototype = {
			areaStart: ip,
			areaEnd: ip,
			lineStart: function() {
				this._point = 0
			},
			lineEnd: function() {
				this._point && this._context.closePath()
			},
			point: function(e, t) {
				e *= 1, t *= 1, this._point ? this._context.lineTo(e, t) : (this._point = 1, this._context.moveTo(e, t))
			}
		};

	function iP(e, t, r) {
		var n = e._x1 - e._x0,
			i = t - e._x1,
			a = (e._y1 - e._y0) / (n || i < 0 && -0),
			o = (r - e._y1) / (i || n < 0 && -0);
		return ((a < 0 ? -1 : 1) + (o < 0 ? -1 : 1)) * Math.min(Math.abs(a), Math.abs(o), .5 * Math.abs((a * i + o * n) / (n + i))) || 0
	}

	function iM(e, t) {
		var r = e._x1 - e._x0;
		return r ? (3 * (e._y1 - e._y0) / r - t) / 2 : t
	}

	function iI(e, t, r) {
		var n = e._x0,
			i = e._y0,
			a = e._x1,
			o = e._y1,
			l = (a - n) / 3;
		e._context.bezierCurveTo(n + l, i + l * t, a - l, o - l * r, a, o)
	}

	function iC(e) {
		this._context = e
	}

	function iT(e) {
		this._context = new iD(e)
	}

	function iD(e) {
		this._context = e
	}

	function iN(e) {
		this._context = e
	}

	function iz(e) {
		var t, r, n = e.length - 1,
			i = Array(n),
			a = Array(n),
			o = Array(n);
		for (i[0] = 0, a[0] = 2, o[0] = e[0] + 2 * e[1], t = 1; t < n - 1; ++t) i[t] = 1, a[t] = 4, o[t] = 4 * e[t] + 2 * e[t + 1];
		for (i[n - 1] = 2, a[n - 1] = 7, o[n - 1] = 8 * e[n - 1] + e[n], t = 1; t < n; ++t) r = i[t] / a[t - 1], a[t] -= r, o[t] -= r * o[t - 1];
		for (i[n - 1] = o[n - 1] / a[n - 1], t = n - 2; t >= 0; --t) i[t] = (o[t] - i[t + 1]) / a[t];
		for (a[n - 1] = (e[n] + i[n - 1]) / 2, t = 0; t < n - 1; ++t) a[t] = 2 * e[t + 1] - i[t + 1];
		return [i, a]
	}

	function iL(e, t) {
		this._context = e, this._t = t
	}

	function iR(e, t) {
		if ((i = e.length) > 1)
			for (var r, n, i, a = 1, o = e[t[0]], l = o.length; a < i; ++a)
				for (n = o, o = e[t[a]], r = 0; r < l; ++r) o[r][1] += o[r][0] = isNaN(n[r][1]) ? n[r][0] : n[r][1]
	}

	function iB(e) {
		for (var t = e.length, r = Array(t); --t >= 0;) r[t] = t;
		return r
	}

	function i$(e, t) {
		return e[t]
	}

	function iU(e) {
		let t = [];
		return t.key = e, t
	}

	function iF(e, t, r) {
		return Array.isArray(e) && e && t + r !== 0 ? e.slice(t, r + 1) : e
	}

	function iK(e) {
		if (e) return {
			x: e.x,
			y: e.y,
			upperWidth: "upperWidth" in e ? e.upperWidth : e.width,
			lowerWidth: "lowerWidth" in e ? e.lowerWidth : e.width,
			width: e.width,
			height: e.height
		}
	}

	function iH(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function iq(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? iH(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : iH(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	iC.prototype = {
		areaStart: function() {
			this._line = 0
		},
		areaEnd: function() {
			this._line = 0 / 0
		},
		lineStart: function() {
			this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = 0 / 0, this._point = 0
		},
		lineEnd: function() {
			switch (this._point) {
				case 2:
					this._context.lineTo(this._x1, this._y1);
					break;
				case 3:
					iI(this, this._t0, iM(this, this._t0))
			}(this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line = 1 - this._line
		},
		point: function(e, t) {
			var r = 0 / 0;
			if (t *= 1, (e *= 1) !== this._x1 || t !== this._y1) {
				switch (this._point) {
					case 0:
						this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
						break;
					case 1:
						this._point = 2;
						break;
					case 2:
						this._point = 3, iI(this, iM(this, r = iP(this, e, t)), r);
						break;
					default:
						iI(this, this._t0, r = iP(this, e, t))
				}
				this._x0 = this._x1, this._x1 = e, this._y0 = this._y1, this._y1 = t, this._t0 = r
			}
		}
	}, (iT.prototype = Object.create(iC.prototype)).point = function(e, t) {
		iC.prototype.point.call(this, t, e)
	}, iD.prototype = {
		moveTo: function(e, t) {
			this._context.moveTo(t, e)
		},
		closePath: function() {
			this._context.closePath()
		},
		lineTo: function(e, t) {
			this._context.lineTo(t, e)
		},
		bezierCurveTo: function(e, t, r, n, i, a) {
			this._context.bezierCurveTo(t, e, n, r, a, i)
		}
	}, iN.prototype = {
		areaStart: function() {
			this._line = 0
		},
		areaEnd: function() {
			this._line = 0 / 0
		},
		lineStart: function() {
			this._x = [], this._y = []
		},
		lineEnd: function() {
			var e = this._x,
				t = this._y,
				r = e.length;
			if (r)
				if (this._line ? this._context.lineTo(e[0], t[0]) : this._context.moveTo(e[0], t[0]), 2 === r) this._context.lineTo(e[1], t[1]);
				else
					for (var n = iz(e), i = iz(t), a = 0, o = 1; o < r; ++a, ++o) this._context.bezierCurveTo(n[0][a], i[0][a], n[1][a], i[1][a], e[o], t[o]);
			(this._line || 0 !== this._line && 1 === r) && this._context.closePath(), this._line = 1 - this._line, this._x = this._y = null
		},
		point: function(e, t) {
			this._x.push(+e), this._y.push(+t)
		}
	}, iL.prototype = {
		areaStart: function() {
			this._line = 0
		},
		areaEnd: function() {
			this._line = 0 / 0
		},
		lineStart: function() {
			this._x = this._y = 0 / 0, this._point = 0
		},
		lineEnd: function() {
			0 < this._t && this._t < 1 && 2 === this._point && this._context.lineTo(this._x, this._y), (this._line || 0 !== this._line && 1 === this._point) && this._context.closePath(), this._line >= 0 && (this._t = 1 - this._t, this._line = 1 - this._line)
		},
		point: function(e, t) {
			switch (e *= 1, t *= 1, this._point) {
				case 0:
					this._point = 1, this._line ? this._context.lineTo(e, t) : this._context.moveTo(e, t);
					break;
				case 1:
					this._point = 2;
				default:
					if (this._t <= 0) this._context.lineTo(this._x, t), this._context.lineTo(e, t);
					else {
						var r = this._x * (1 - this._t) + e * this._t;
						this._context.lineTo(r, this._y), this._context.lineTo(r, t)
					}
			}
			this._x = e, this._y = t
		}
	};
	var iW = e => {
			var t = e.viewBox,
				r = e.position,
				n = e.offset,
				i = void 0 === n ? 0 : n,
				a = e.parentViewBox,
				o = e.clamp,
				l = iK(t),
				u = l.x,
				c = l.y,
				s = l.height,
				f = l.upperWidth,
				h = l.lowerWidth,
				d = u + (f - h) / 2,
				p = (u + d) / 2,
				y = (f + h) / 2,
				v = s >= 0 ? 1 : -1,
				m = v * i,
				g = v > 0 ? "end" : "start",
				b = v > 0 ? "start" : "end",
				x = f >= 0 ? 1 : -1,
				w = x * i,
				O = x > 0 ? "end" : "start",
				_ = x > 0 ? "start" : "end";
			if ("top" === r) {
				var A = {
					x: u + f / 2,
					y: c - m,
					horizontalAnchor: "middle",
					verticalAnchor: g
				};
				return o && a && (A.height = Math.max(c - a.y, 0), A.width = f), A
			}
			if ("bottom" === r) {
				var S = {
					x: d + h / 2,
					y: c + s + m,
					horizontalAnchor: "middle",
					verticalAnchor: b
				};
				return o && a && (S.height = Math.max(a.y + a.height - (c + s), 0), S.width = h), S
			}
			if ("left" === r) {
				var j = {
					x: p - w,
					y: c + s / 2,
					horizontalAnchor: O,
					verticalAnchor: "middle"
				};
				return o && a && (j.width = Math.max(j.x - a.x, 0), j.height = s), j
			}
			if ("right" === r) {
				var E = {
					x: p + y + w,
					y: c + s / 2,
					horizontalAnchor: _,
					verticalAnchor: "middle"
				};
				return o && a && (E.width = Math.max(a.x + a.width - E.x, 0), E.height = s), E
			}
			var k = o && a ? {
				width: y,
				height: s
			} : {};
			return "insideLeft" === r ? iq({
				x: p + w,
				y: c + s / 2,
				horizontalAnchor: _,
				verticalAnchor: "middle"
			}, k) : "insideRight" === r ? iq({
				x: p + y - w,
				y: c + s / 2,
				horizontalAnchor: O,
				verticalAnchor: "middle"
			}, k) : "insideTop" === r ? iq({
				x: u + f / 2,
				y: c + m,
				horizontalAnchor: "middle",
				verticalAnchor: b
			}, k) : "insideBottom" === r ? iq({
				x: d + h / 2,
				y: c + s - m,
				horizontalAnchor: "middle",
				verticalAnchor: g
			}, k) : "insideTopLeft" === r ? iq({
				x: u + w,
				y: c + m,
				horizontalAnchor: _,
				verticalAnchor: b
			}, k) : "insideTopRight" === r ? iq({
				x: u + f - w,
				y: c + m,
				horizontalAnchor: O,
				verticalAnchor: b
			}, k) : "insideBottomLeft" === r ? iq({
				x: d + w,
				y: c + s - m,
				horizontalAnchor: _,
				verticalAnchor: g
			}, k) : "insideBottomRight" === r ? iq({
				x: d + h - w,
				y: c + s - m,
				horizontalAnchor: O,
				verticalAnchor: g
			}, k) : r && "object" == typeof r && (eb(r.x) || eg(r.x)) && (eb(r.y) || eg(r.y)) ? iq({
				x: u + e_(r.x, y),
				y: c + e_(r.y, s),
				horizontalAnchor: "end",
				verticalAnchor: "end"
			}, k) : iq({
				x: u + f / 2,
				y: c + s / 2,
				horizontalAnchor: "middle",
				verticalAnchor: "middle"
			}, k)
		},
		iV = ["top", "left", "right", "bottom"];

	function iY(e) {
		return null != e && ("object" == typeof e || iV.includes(e))
	}

	function iX(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function iG(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? iX(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : iX(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function iZ(e, t, r) {
		return null == e || null == t ? r : ex(t) ? ed(e, t, r) : "function" == typeof t ? t(e) : r
	}
	var iQ = (e, t) => "horizontal" === e && "xAxis" === t || "vertical" === e && "yAxis" === t || "centric" === e && "angleAxis" === t || "radial" === e && "radiusAxis" === t,
		iJ = (e, t, r, n) => {
			if (n) return e.map(e => e.coordinate);
			var i, a, o = e.map(e => (e.coordinate === t && (i = !0), e.coordinate === r && (a = !0), e.coordinate));
			return i || o.push(t), a || o.push(r), o
		},
		i0 = (e, t, r) => {
			if (!e) return null;
			var n = e.duplicateDomain,
				i = e.type,
				a = e.range,
				o = e.scale,
				l = e.realScaleType,
				u = e.isCategorical,
				c = e.categoricalDomain,
				s = e.tickCount,
				f = e.ticks,
				h = e.niceTicks,
				d = e.axisType;
			if (!o) return null;
			var p = "scaleBand" === l && o.bandwidth ? o.bandwidth() / 2 : 2,
				y = (t || r) && "category" === i && o.bandwidth ? o.bandwidth() / p : 0;
			return (y = "angleAxis" === d && a && a.length >= 2 ? 2 * ev(a[0] - a[1]) * y : y, t && (f || h)) ? (f || h || []).map((e, t) => {
				var r = n ? n.indexOf(e) : e,
					i = o.map(r);
				return eZ(i) ? {
					coordinate: i + y,
					value: e,
					offset: y,
					index: t
				} : null
			}).filter(eE) : u && c ? c.map((e, t) => {
				var r = o.map(e);
				return eZ(r) ? {
					coordinate: r + y,
					value: e,
					index: t,
					offset: y
				} : null
			}).filter(eE) : o.ticks && !r && null != s ? o.ticks(s).map((e, t) => {
				var r = o.map(e);
				return eZ(r) ? {
					coordinate: r + y,
					value: e,
					index: t,
					offset: y
				} : null
			}).filter(eE) : o.domain().map((e, t) => {
				var r = o.map(e);
				return eZ(r) ? {
					coordinate: r + y,
					value: n ? n[e] : e,
					index: t,
					offset: y
				} : null
			}).filter(eE)
		},
		i1 = {
			sign: e => {
				var t, r = e.length;
				if (!(r <= 0)) {
					var n = null == (t = e[0]) ? void 0 : t.length;
					if (null != n && !(n <= 0))
						for (var i = 0; i < n; ++i)
							for (var a = 0, o = 0, l = 0; l < r; ++l) {
								var u = e[l],
									c = null == u ? void 0 : u[i];
								if (null != c) {
									var s = c[1],
										f = c[0],
										h = em(s) ? f : s;
									h >= 0 ? (c[0] = a, a += h, c[1] = a) : (c[0] = o, o += h, c[1] = o)
								}
							}
				}
			},
			expand: function(e, t) {
				if ((n = e.length) > 0) {
					for (var r, n, i, a = 0, o = e[0].length; a < o; ++a) {
						for (i = r = 0; r < n; ++r) i += e[r][a][1] || 0;
						if (i)
							for (r = 0; r < n; ++r) e[r][a][1] /= i
					}
					iR(e, t)
				}
			},
			none: iR,
			silhouette: function(e, t) {
				if ((r = e.length) > 0) {
					for (var r, n = 0, i = e[t[0]], a = i.length; n < a; ++n) {
						for (var o = 0, l = 0; o < r; ++o) l += e[o][n][1] || 0;
						i[n][1] += i[n][0] = -l / 2
					}
					iR(e, t)
				}
			},
			wiggle: function(e, t) {
				if ((i = e.length) > 0 && (n = (r = e[t[0]]).length) > 0) {
					for (var r, n, i, a = 0, o = 1; o < n; ++o) {
						for (var l = 0, u = 0, c = 0; l < i; ++l) {
							for (var s = e[t[l]], f = s[o][1] || 0, h = (f - (s[o - 1][1] || 0)) / 2, d = 0; d < l; ++d) {
								var p = e[t[d]];
								h += (p[o][1] || 0) - (p[o - 1][1] || 0)
							}
							u += f, c += h * f
						}
						r[o - 1][1] += r[o - 1][0] = a, u && (a -= c / u)
					}
					r[o - 1][1] += r[o - 1][0] = a, iR(e, t)
				}
			},
			positive: e => {
				var t, r = e.length;
				if (!(r <= 0)) {
					var n = null == (t = e[0]) ? void 0 : t.length;
					if (null != n && !(n <= 0))
						for (var i = 0; i < n; ++i)
							for (var a = 0, o = 0; o < r; ++o) {
								var l = e[o],
									u = null == l ? void 0 : l[i];
								if (null != u) {
									var c = em(u[1]) ? u[0] : u[1];
									c >= 0 ? (u[0] = a, a += c, u[1] = a) : (u[0] = 0, u[1] = 0)
								}
							}
				}
			}
		},
		i2 = e => {
			var t = e.axis,
				r = e.ticks,
				n = e.offset,
				i = e.bandSize,
				a = e.entry,
				o = e.index;
			if ("category" === t.type) return r[o] ? r[o].coordinate + n : null;
			var l = iZ(a, t.dataKey, t.scale.domain()[o]);
			if (null == l) return null;
			var u = t.scale.map(l);
			return eb(u) ? u - i / 2 + n : null
		},
		i3 = /^dataMin[\s]*-[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
		i5 = /^dataMax[\s]*\+[\s]*([0-9]+([.]{1}[0-9]+){0,1})$/,
		i6 = (e, t, r) => {
			if (e && e.scale && e.scale.bandwidth) {
				var n = e.scale.bandwidth();
				if (!r || n > 0) return n
			}
			if (e && t && t.length >= 2) {
				for (var i = nU(t, e => e.coordinate), a = [], o = 0, l = 1, u = i.length; l < u; l++) {
					var c, s, f = ((null == (c = i[l]) ? void 0 : c.coordinate) || 0) - ((null == (s = i[l - 1]) ? void 0 : s.coordinate) || 0);
					a.push(f), o = Math.max(f, o)
				}
				var h = 1e-4 * o,
					d = 1 / 0;
				for (var p of a) p > h && (d = Math.min(p, d));
				return 1 / 0 === d ? 0 : d
			}
			return r ? void 0 : 0
		};

	function i4(e) {
		var t = e.tooltipEntrySettings,
			r = e.dataKey,
			n = e.payload,
			i = e.value,
			a = e.name;
		return iG(iG({}, t), {}, {
			dataKey: r,
			payload: n,
			value: i,
			name: a
		})
	}

	function i8(e, t) {
		return null != e ? String(e) : "string" == typeof t ? t : void 0
	}
	var i7 = e => e.layout.width,
		i9 = e => e.layout.height,
		ae = e => e.layout.scale,
		at = e => e.layout.margin,
		ar = r$(e => e.cartesianAxis.xAxis, e => Object.values(e)),
		an = r$(e => e.cartesianAxis.yAxis, e => Object.values(e));

	function ai(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function aa(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? ai(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ai(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var ao = r$([i7, i9, at, e => e.brush.height, function(e) {
			return an(e).reduce((e, t) => "left" !== t.orientation || t.mirror || t.hide ? e : e + ("number" == typeof t.width ? t.width : 60), 0)
		}, function(e) {
			return an(e).reduce((e, t) => "right" !== t.orientation || t.mirror || t.hide ? e : e + ("number" == typeof t.width ? t.width : 60), 0)
		}, function(e) {
			return ar(e).reduce((e, t) => "top" !== t.orientation || t.mirror || t.hide ? e : e + ("number" == typeof t.height ? t.height : 30), 0)
		}, function(e) {
			return ar(e).reduce((e, t) => "bottom" !== t.orientation || t.mirror || t.hide ? e : e + ("number" == typeof t.height ? t.height : 30), 0)
		}, nF, e => e.legend.size], (e, t, r, n, i, a, o, l, u, c) => {
			var s = {
					left: (r.left || 0) + i,
					right: (r.right || 0) + a
				},
				f = aa(aa({}, {
					top: (r.top || 0) + o,
					bottom: (r.bottom || 0) + l
				}), s),
				h = f.bottom;
			f.bottom += n;
			var d = e - (f = ((e, t, r) => {
					if (t && r) {
						var n = r.width,
							i = r.height,
							a = t.align,
							o = t.verticalAlign,
							l = t.layout,
							u = t.position,
							c = t.offset,
							s = void 0 === c ? 0 : c;
						if (null != u) {
							if (iY(u)) {
								if ("top" === u && eb(e.top)) return iG(iG({}, e), {}, {
									top: e.top + (i || 0) + s
								});
								if ("bottom" === u && eb(e.bottom)) return iG(iG({}, e), {}, {
									bottom: e.bottom + (i || 0) + s
								});
								if ("left" === u && eb(e.left)) return iG(iG({}, e), {}, {
									left: e.left + (n || 0) + s
								});
								if ("right" === u && eb(e.right)) return iG(iG({}, e), {}, {
									right: e.right + (n || 0) + s
								})
							}
							return e
						}
						if (("vertical" === l || "horizontal" === l && "middle" === o) && "center" !== a && eb(e[a])) return iG(iG({}, e), {}, {
							[a]: e[a] + (n || 0)
						});
						if (("horizontal" === l || "vertical" === l && "center" === a) && "middle" !== o && eb(e[o])) return iG(iG({}, e), {}, {
							[o]: e[o] + (i || 0)
						})
					}
					return e
				})(f, u, c)).left - f.right,
				p = t - f.top - f.bottom;
			return aa(aa({
				brushBottom: h
			}, f), {}, {
				width: Math.max(d, 0),
				height: Math.max(p, 0)
			})
		}),
		al = r$(ao, e => ({
			x: e.left,
			y: e.top,
			width: e.width,
			height: e.height
		})),
		au = r$(i7, i9, (e, t) => ({
			x: 0,
			y: 0,
			width: e,
			height: t
		})),
		ac = (0, N.createContext)(null),
		as = () => null != (0, N.useContext)(ac),
		af = e => e.brush,
		ah = r$([af, ao, at], (e, t, r) => ({
			height: e.height,
			x: eb(e.x) ? e.x : t.left,
			y: eb(e.y) ? e.y : t.top + t.height + t.brushBottom - ((null == r ? void 0 : r.bottom) || 0),
			width: eb(e.width) ? e.width : t.width
		})),
		ad = function(e, t) {
			for (var r = arguments.length, n = Array(r > 2 ? r - 2 : 0), i = 2; i < r; i++) n[i - 2] = arguments[i];
			if ("u" > typeof console && console.warn && (void 0 === t && console.warn("LogUtils requires an error message argument"), !e))
				if (void 0 === t) console.warn("Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.");
				else {
					var a = 0;
					console.warn(t.replace(/%s/g, () => n[a++]))
				}
		},
		ap = "100%",
		ay = "100%",
		av = {
			width: -1,
			height: -1
		},
		am = (e, t, r) => {
			var n = r.width,
				i = void 0 === n ? ap : n,
				a = r.height,
				o = void 0 === a ? ay : a,
				l = r.aspect,
				u = r.maxHeight,
				c = eg(i) ? e : Number(i),
				s = eg(o) ? t : Number(o);
			return l && l > 0 && (c ? s = c / l : s && (c = s * l), u && null != s && s > u && (s = u)), {
				calculatedWidth: c,
				calculatedHeight: s
			}
		},
		ag = {
			width: 0,
			height: 0,
			overflow: "visible"
		},
		ab = {
			width: 0,
			overflowX: "visible"
		},
		ax = {
			height: 0,
			overflowY: "visible"
		},
		aw = {},
		aO = ["aspect", "initialDimension", "width", "height", "minWidth", "minHeight", "maxHeight", "children", "debounce", "id", "className", "onResize", "style"];

	function a_() {
		return (a_ = Object.assign.bind()).apply(null, arguments)
	}

	function aA(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function aS(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? aA(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : aA(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function aj(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var aE = (0, N.createContext)(av);

	function ak(e) {
		var t = e.children,
			r = e.width,
			n = e.height,
			i = (0, N.useMemo)(() => ({
				width: r,
				height: n
			}), [r, n]);
		return eQ(i.width) && eQ(i.height) ? N.createElement(aE.Provider, {
			value: i
		}, t) : null
	}
	var aP = () => (0, N.useContext)(aE),
		aM = (0, N.forwardRef)((e, t) => {
			var r, n, i, a, o, l, u = e.aspect,
				c = e.initialDimension,
				s = void 0 === c ? av : c,
				f = e.width,
				h = e.height,
				d = e.minWidth,
				p = void 0 === d ? 0 : d,
				y = e.minHeight,
				v = e.maxHeight,
				m = e.children,
				g = e.debounce,
				b = void 0 === g ? 0 : g,
				x = e.id,
				w = e.className,
				O = e.onResize,
				_ = e.style,
				A = function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, aO),
				S = (0, N.useRef)(null),
				j = (0, N.useRef)();
			j.current = O, (0, N.useImperativeHandle)(t, () => S.current);
			var E = function(e) {
					if (Array.isArray(e)) return e
				}(r = (0, N.useState)({
					containerWidth: s.width,
					containerHeight: s.height
				})) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(r) || function(e) {
					if (e) {
						if ("string" == typeof e) return aj(e, 2);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? aj(e, 2) : void 0
					}
				}(r) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}(),
				k = E[0],
				P = E[1],
				M = (0, N.useCallback)((e, t) => {
					P(r => {
						var n = Math.round(e),
							i = Math.round(t);
						return r.containerWidth === n && r.containerHeight === i ? r : {
							containerWidth: n,
							containerHeight: i
						}
					})
				}, []);
			(0, N.useEffect)(() => {
				if (null == S.current || "u" < typeof ResizeObserver) return ek;
				var e = e => {
					var t, r = e[0];
					if (null != r) {
						var n = r.contentRect,
							i = n.width,
							a = n.height;
						M(i, a), null == (t = j.current) || t.call(j, i, a)
					}
				};
				b > 0 && (e = function(e, t = 0, r = {}) {
					let {
						leading: n = !0,
						trailing: i = !0
					} = r;
					return function(e, t = 0, r = {}) {
						let n;
						"object" != typeof r && (r = {});
						let {
							leading: i = !1,
							trailing: a = !0,
							maxWait: o
						} = r, l = [, , ];
						i && (l[0] = "leading"), a && (l[1] = "trailing");
						let u = null,
							c = function(e, t, {
								signal: r,
								edges: n
							} = {}) {
								let i, a = null,
									o = null != n && n.includes("leading"),
									l = null == n || n.includes("trailing"),
									u = () => {
										null !== a && (e.apply(i, a), i = void 0, a = null)
									},
									c = null,
									s = () => {
										null != c && clearTimeout(c), c = setTimeout(() => {
											c = null, l && u(), f()
										}, t)
									},
									f = () => {
										null !== c && (clearTimeout(c), c = null), i = void 0, a = null
									},
									h = function(...e) {
										if (null == r ? void 0 : r.aborted) return;
										i = this, a = e;
										let t = null == c;
										s(), o && t && u()
									};
								return h.schedule = s, h.cancel = f, h.flush = () => {
									u()
								}, null == r || r.addEventListener("abort", f, {
									once: !0
								}), h
							}(function(...t) {
								n = e.apply(this, t), u = null
							}, t, {
								edges: l
							}),
							s = function(...t) {
								return null != o && (null === u && (u = Date.now()), Date.now() - u >= o) ? ((i || a) && (n = e.apply(this, t)), u = Date.now(), c.cancel(), c.schedule(), n) : (c.apply(this, t), n)
							};
						return s.cancel = c.cancel, s.flush = () => (c.flush(), n), s
					}(e, t, {
						leading: n,
						maxWait: t,
						trailing: i
					})
				}(e, b, {
					trailing: !0,
					leading: !1
				}));
				var t = new ResizeObserver(e),
					r = S.current.getBoundingClientRect();
				return M(r.width, r.height), t.observe(S.current), () => {
					t.disconnect()
				}
			}, [M, b]);
			var I = k.containerWidth,
				C = k.containerHeight;
			ad(!u || u > 0, "The aspect(%s) must be greater than zero.", u);
			var T = am(I, C, {
					width: f,
					height: h,
					aspect: u,
					maxHeight: v
				}),
				D = T.calculatedWidth,
				z = T.calculatedHeight;
			return ad(I < 0 || C < 0 || null != D && D > 0 || null != z && z > 0, "The width(%s) and height(%s) of chart should be greater than 0,\n       please check the style of container, or the props width(%s) and height(%s),\n       or add a minWidth(%s) or minHeight(%s) or use aspect(%s) to control the\n       height and width.", D, z, f, h, p, y, u), N.createElement("div", a_({
				id: x ? "".concat(x) : void 0,
				className: (0, W.f)("recharts-responsive-container", w),
				style: aS(aS({}, void 0 === _ ? {} : _), {}, {
					width: f,
					height: h,
					minWidth: p,
					minHeight: y,
					maxHeight: v
				}),
				ref: S
			}, A), N.createElement("div", {
				style: (i = (n = {
					width: f,
					height: h
				}).width, a = n.height, o = eg(i), l = eg(a), o && l ? ag : o ? ab : l ? ax : aw)
			}, N.createElement(ak, {
				width: D,
				height: z
			}, m)))
		}),
		aI = (0, N.forwardRef)((e, t) => {
			var r, n, i, a, o, l, u = aP();
			if (eQ(u.width) && eQ(u.height)) return e.children;
			var c = (n = (r = {
					width: e.width,
					height: e.height,
					aspect: e.aspect
				}).width, i = r.height, a = r.aspect, o = n, l = i, void 0 === o && void 0 === l ? (o = ap, l = ay) : void 0 === o ? o = a && a > 0 ? void 0 : ap : void 0 === l && (l = a && a > 0 ? void 0 : ay), {
					width: o,
					height: l
				}),
				s = c.width,
				f = c.height,
				h = am(void 0, void 0, {
					width: s,
					height: f,
					aspect: e.aspect,
					maxHeight: e.maxHeight
				}),
				d = h.calculatedWidth,
				p = h.calculatedHeight;
			return eb(d) && eb(p) ? N.createElement(ak, {
				width: d,
				height: p
			}, e.children) : N.createElement(aM, a_({}, e, {
				width: s,
				height: f,
				ref: t
			}))
		}),
		aC = () => {
			var e, t = as(),
				r = tv(al),
				n = tv(ah),
				i = null == (e = tv(af)) ? void 0 : e.padding;
			return t && n && i ? {
				width: n.width - i.left - i.right,
				height: n.height - i.top - i.bottom,
				x: i.left,
				y: i.top
			} : r
		},
		aT = {
			top: 0,
			bottom: 0,
			left: 0,
			right: 0,
			width: 0,
			height: 0,
			brushBottom: 0
		},
		aD = () => {
			var e;
			return null != (e = tv(ao)) ? e : aT
		},
		aN = e => e.layout.layoutType,
		az = e => {
			var t = e.layout.layoutType;
			if ("centric" === t || "radial" === t) return t
		},
		aL = e => {
			var t = th(),
				r = as(),
				n = e.width,
				i = e.height,
				a = aP(),
				o = n,
				l = i;
			return a && (o = a.width > 0 ? a.width : n, l = a.height > 0 ? a.height : i), (0, N.useEffect)(() => {
				!r && eQ(o) && eQ(l) && t(nk({
					width: o,
					height: l
				}))
			}, [t, r, o, l]), null
		},
		aR = {
			grid: -100,
			barBackground: -50,
			area: 100,
			cursorRectangle: 200,
			bar: 300,
			line: 400,
			axis: 500,
			scatter: 600,
			activeBar: 1e3,
			cursorLine: 1100,
			activeDot: 1200,
			label: 2e3
		},
		aB = {
			allowDecimals: !1,
			allowDuplicatedCategory: !0,
			allowDataOverflow: !1,
			angle: 0,
			angleAxisId: 0,
			axisLine: !0,
			axisLineType: "polygon",
			cx: 0,
			cy: 0,
			hide: !1,
			includeHidden: !1,
			label: !1,
			niceTicks: "auto",
			orientation: "outer",
			reversed: !1,
			scale: "auto",
			tick: !0,
			tickLine: !0,
			tickSize: 8,
			type: "auto",
			zIndex: aR.axis
		},
		a$ = {
			allowDataOverflow: !1,
			allowDecimals: !1,
			allowDuplicatedCategory: !0,
			angle: 0,
			axisLine: !0,
			includeHidden: !1,
			hide: !1,
			niceTicks: "auto",
			label: !1,
			orientation: "right",
			radiusAxisId: 0,
			reversed: !1,
			scale: "auto",
			stroke: "#ccc",
			tick: !0,
			tickCount: 5,
			tickLine: !0,
			type: "auto",
			zIndex: aR.axis
		},
		aU = (e, t) => {
			if (e && t) return null != e && e.reversed ? [t[1], t[0]] : t
		};

	function aF(e, t, r) {
		return "auto" !== r ? r : null != e ? iQ(e, t) ? "category" : "number" : void 0
	}

	function aK(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function aH(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? aK(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : aK(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var aq = {
			allowDataOverflow: aB.allowDataOverflow,
			allowDecimals: aB.allowDecimals,
			allowDuplicatedCategory: !1,
			dataKey: void 0,
			domain: void 0,
			id: aB.angleAxisId,
			includeHidden: !1,
			name: void 0,
			reversed: aB.reversed,
			scale: aB.scale,
			tick: aB.tick,
			tickCount: void 0,
			ticks: void 0,
			type: aB.type,
			unit: void 0,
			niceTicks: "auto"
		},
		aW = {
			allowDataOverflow: a$.allowDataOverflow,
			allowDecimals: a$.allowDecimals,
			allowDuplicatedCategory: a$.allowDuplicatedCategory,
			dataKey: void 0,
			domain: void 0,
			id: a$.radiusAxisId,
			includeHidden: a$.includeHidden,
			name: void 0,
			reversed: a$.reversed,
			scale: a$.scale,
			tick: a$.tick,
			tickCount: a$.tickCount,
			ticks: void 0,
			type: a$.type,
			unit: void 0,
			niceTicks: "auto"
		},
		aV = r$([(e, t) => {
			if (null != t) return e.polarAxis.angleAxis[t]
		}, az], (e, t) => {
			if (null != e) return e;
			var r, n = null != (r = aF(t, "angleAxis", aq.type)) ? r : "category";
			return aH(aH({}, aq), {}, {
				type: n
			})
		}),
		aY = r$([(e, t) => e.polarAxis.radiusAxis[t], az], (e, t) => {
			if (null != e) return e;
			var r, n = null != (r = aF(t, "radiusAxis", aW.type)) ? r : "category";
			return aH(aH({}, aW), {}, {
				type: n
			})
		}),
		aX = e => e.polarOptions,
		aG = r$([i7, i9, ao], function(e, t) {
			var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0,
				width: 0,
				height: 0,
				brushBottom: 0
			};
			return Math.min(Math.abs(e - (r.left || 0) - (r.right || 0)), Math.abs(t - (r.top || 0) - (r.bottom || 0))) / 2
		}),
		aZ = r$([aX, aG], (e, t) => {
			if (null != e) return e_(e.innerRadius, t, 0)
		}),
		aQ = r$([aX, aG], (e, t) => {
			if (null != e) return e_(e.outerRadius, t, .8 * t)
		}),
		aJ = r$([aX], e => null == e ? [0, 0] : [e.startAngle, e.endAngle]);
	r$([aV, aJ], aU);
	var a0 = r$([aG, aZ, aQ], (e, t, r) => {
		if (null != e && null != t && null != r) return [t, r]
	});
	r$([aY, a0], aU);
	var a1 = r$([aN, aX, aZ, aQ, i7, i9], (e, t, r, n, i, a) => {
			if (("centric" === e || "radial" === e) && null != t && null != r && null != n) {
				var o = t.cx,
					l = t.cy,
					u = t.startAngle,
					c = t.endAngle;
				return {
					cx: e_(o, i, i / 2),
					cy: e_(l, a, a / 2),
					innerRadius: r,
					outerRadius: n,
					startAngle: u,
					endAngle: c,
					clockWise: !1
				}
			}
		}),
		a2 = e.i(716455);

	function a3(e, t) {
		return !!(Array.isArray(e) && Array.isArray(t)) && 0 === e.length && 0 === t.length || e === t
	}
	var a5 = r$(e => e.zIndex.zIndexMap, (e, t) => t, (e, t, r) => r, (e, t, r) => {
			if (null != t) {
				var n = e[t];
				if (null != n) return r ? n.panoramaElement : n.element
			}
		}),
		a6 = r$(e => e.zIndex.zIndexMap, e => Array.from(new Set(Object.keys(e).map(e => parseInt(e, 10)).concat(Object.values(aR)))).sort((e, t) => e - t), {
			memoizeOptions: {
				resultEqualityCheck: function(e, t) {
					if (e.length === t.length) {
						for (var r = 0; r < e.length; r++)
							if (e[r] !== t[r]) return !1;
						return !0
					}
					return !1
				}
			}
		});

	function a4(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function a8(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? a4(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : a4(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var a7 = {
			zIndexMap: Object.values(aR).reduce((e, t) => a8(a8({}, e), {}, {
				[t]: {
					element: void 0,
					panoramaElement: void 0,
					consumers: 0
				}
			}), {})
		},
		a9 = new Set(Object.values(aR)),
		oe = r1({
			name: "zIndex",
			initialState: a7,
			reducers: {
				registerZIndexPortal: {
					reducer: (e, t) => {
						var r = t.payload.zIndex;
						e.zIndexMap[r] ? e.zIndexMap[r].consumers += 1 : e.zIndexMap[r] = {
							consumers: 1,
							element: void 0,
							panoramaElement: void 0
						}
					},
					prepare: rG()
				},
				unregisterZIndexPortal: {
					reducer: (e, t) => {
						var r = t.payload.zIndex;
						e.zIndexMap[r] && (e.zIndexMap[r].consumers -= 1, e.zIndexMap[r].consumers <= 0 && !a9.has(r) && delete e.zIndexMap[r])
					},
					prepare: rG()
				},
				registerZIndexPortalElement: {
					reducer: (e, t) => {
						var r = t.payload,
							n = r.zIndex,
							i = r.element,
							a = r.isPanorama;
						e.zIndexMap[n] ? a ? e.zIndexMap[n].panoramaElement = i : e.zIndexMap[n].element = i : e.zIndexMap[n] = {
							consumers: 0,
							element: a ? void 0 : i,
							panoramaElement: a ? i : void 0
						}
					},
					prepare: rG()
				},
				unregisterZIndexPortalElement: {
					reducer: (e, t) => {
						var r = t.payload.zIndex;
						e.zIndexMap[r] && (t.payload.isPanorama ? e.zIndexMap[r].panoramaElement = void 0 : e.zIndexMap[r].element = void 0)
					},
					prepare: rG()
				}
			}
		}),
		ot = oe.actions,
		or = ot.registerZIndexPortal,
		on = ot.unregisterZIndexPortal,
		oi = ot.registerZIndexPortalElement,
		oa = ot.unregisterZIndexPortalElement,
		oo = oe.reducer;

	function ol(e) {
		var t = e.zIndex,
			r = e.children,
			n = void 0 !== tv(aN) && void 0 !== t && 0 !== t,
			i = as(),
			a = (0, N.useRef)(void 0),
			o = (0, N.useRef)(new Set),
			l = th(),
			u = tv(e => a5(e, t, i));
		if ((0, N.useLayoutEffect)(() => {
				if (!n) {
					var e = o.current;
					e.forEach(e => {
						l(on({
							zIndex: e
						}))
					}), e.clear(), a.current = void 0;
					return
				}
				if (o.current.has(t) || (l(or({
						zIndex: t
					})), o.current.add(t)), u) {
					a.current = u;
					var r = o.current;
					r.forEach(e => {
						e !== t && (l(on({
							zIndex: e
						})), r.delete(e))
					})
				}
			}, [l, t, n, u]), (0, N.useLayoutEffect)(() => {
				var e = o.current;
				return () => {
					e.forEach(e => {
						l(on({
							zIndex: e
						}))
					}), e.clear()
				}
			}, [l]), !n) return r;
		var c = null != u ? u : a.current;
		return c ? (0, a2.createPortal)(r, c) : null
	}
	var ou = ["labelRef"],
		oc = ["content"];

	function os(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}

	function of(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function oh(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? of(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : of(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function od() {
		return (od = Object.assign.bind()).apply(null, arguments)
	}
	var op = (0, N.createContext)(null),
		oy = e => {
			var t = e.x,
				r = e.y,
				n = e.upperWidth,
				i = e.lowerWidth,
				a = e.width,
				o = e.height,
				l = e.children,
				u = (0, N.useMemo)(() => ({
					x: t,
					y: r,
					upperWidth: n,
					lowerWidth: i,
					width: a,
					height: o
				}), [t, r, n, i, a, o]);
			return N.createElement(op.Provider, {
				value: u
			}, l)
		},
		ov = () => {
			var e = (0, N.useContext)(op),
				t = aC();
			return e || (t ? iK(t) : void 0)
		},
		om = (0, N.createContext)(null),
		og = e => null != e && "function" == typeof e,
		ob = e => null != e && "cx" in e && eb(e.cx),
		ox = {
			angle: 0,
			offset: 5,
			zIndex: aR.label,
			position: "middle",
			textBreakAll: !1
		};

	function ow(e) {
		var t, r, n, i, a, o, l, u, c, s, f = eG(e, ox),
			h = f.viewBox,
			d = f.parentViewBox,
			p = f.position,
			y = f.value,
			v = f.children,
			m = f.content,
			g = f.className,
			b = f.textBreakAll,
			x = f.labelRef,
			w = (t = (0, N.useContext)(om), r = tv(a1), t || r),
			O = ov(),
			_ = function(e) {
				if (!ob(e)) return e;
				var t = e.cx,
					r = e.cy,
					n = e.outerRadius,
					i = 2 * n;
				return {
					x: t - n,
					y: r - n,
					width: i,
					upperWidth: i,
					lowerWidth: i,
					height: i
				}
			}(u = null == h ? "center" === p ? O : null != w ? w : O : ob(h) ? h : iK(h));
		if (!u || null == y && null == v && !(0, N.isValidElement)(m) && "function" != typeof m) return null;
		var A = ob(u) && ("insideStart" === p || "insideEnd" === p || "end" === p);
		if (ob(u)) A || (s = ((e, t, r) => {
			var n = e.cx,
				i = e.cy,
				a = e.innerRadius,
				o = e.outerRadius,
				l = (e.startAngle + e.endAngle) / 2;
			if ("outside" === r) {
				var u = tu(n, i, o + t, l),
					c = u.x;
				return {
					x: c,
					y: u.y,
					textAnchor: c >= n ? "start" : "end",
					verticalAnchor: "middle"
				}
			}
			if ("center" === r) return {
				x: n,
				y: i,
				textAnchor: "middle",
				verticalAnchor: "middle"
			};
			if ("centerTop" === r) return {
				x: n,
				y: i,
				textAnchor: "middle",
				verticalAnchor: "start"
			};
			if ("centerBottom" === r) return {
				x: n,
				y: i,
				textAnchor: "middle",
				verticalAnchor: "end"
			};
			var s = tu(n, i, (a + o) / 2, l);
			return {
				x: s.x,
				y: s.y,
				textAnchor: "middle",
				verticalAnchor: "middle"
			}
		})(u, f.offset, f.position));
		else if (_) {
			var S = iW({
				viewBox: _,
				position: p,
				offset: f.offset,
				parentViewBox: ob(d) ? void 0 : d,
				clamp: !0
			});
			s = oh(oh({
				x: S.x,
				y: S.y,
				textAnchor: S.horizontalAnchor,
				verticalAnchor: S.verticalAnchor
			}, void 0 !== S.width ? {
				width: S.width
			} : {}), void 0 !== S.height ? {
				height: S.height
			} : {})
		}
		var j = oh(oh(oh(oh({}, (null == (o = s) ? void 0 : o.x) !== void 0 ? {
			x: s.x
		} : {}), (null == (l = s) ? void 0 : l.y) !== void 0 ? {
			y: s.y
		} : {}), f), {}, {
			viewBox: u
		});
		if ((0, N.isValidElement)(m)) {
			j.labelRef;
			var E = os(j, ou);
			return (0, N.cloneElement)(m, E)
		}
		if ("function" == typeof m) {
			j.content;
			var k = os(j, oc);
			if (c = (0, N.createElement)(m, k), (0, N.isValidElement)(c)) return c
		} else n = f.value, i = f.formatter, a = null == f.children ? n : f.children, c = "function" == typeof i ? i(a) : a;
		var P = ee(f);
		return A && ob(u) ? ((e, t, r, n, i) => {
			var a, o, l = e.offset,
				u = e.className,
				c = i.cx,
				s = i.cy,
				f = i.innerRadius,
				h = i.outerRadius,
				d = i.startAngle,
				p = i.endAngle,
				y = i.clockWise,
				v = (f + h) / 2,
				m = ev(p - d) * Math.min(Math.abs(p - d), 360),
				g = m >= 0 ? 1 : -1;
			switch (t) {
				case "insideStart":
					a = d + g * l, o = y;
					break;
				case "insideEnd":
					a = p - g * l, o = !y;
					break;
				case "end":
					a = p + g * l, o = y;
					break;
				default:
					throw Error("Unsupported position ".concat(t))
			}
			o = m <= 0 ? o : !o;
			var b = tu(c, s, v, a),
				x = tu(c, s, v, a + (o ? 1 : -1) * 359),
				w = "M".concat(b.x, ",").concat(b.y, "\n    A").concat(v, ",").concat(v, ",0,1,").concat(+!o, ",\n    ").concat(x.x, ",").concat(x.y),
				O = null == e.id ? eO("recharts-radial-line-") : e.id;
			return N.createElement("text", od({}, n, {
				dominantBaseline: "central",
				className: (0, W.f)("recharts-radial-bar-label", u)
			}), N.createElement("defs", null, N.createElement("path", {
				id: O,
				d: w
			})), N.createElement("textPath", {
				xlinkHref: "#".concat(O)
			}, r))
		})(f, p, c, P, u) : null == s ? null : N.createElement(ol, {
			zIndex: f.zIndex
		}, N.createElement(ti, od({
			ref: x,
			className: (0, W.f)("recharts-label", void 0 === g ? "" : g)
		}, P, s, {
			textAnchor: e8(P.textAnchor) ? P.textAnchor : s.textAnchor,
			breakAll: b
		}), c))
	}

	function oO(e) {
		var t = e.label,
			r = e.labelRef;
		return ((e, t, r) => {
			if (!e) return null;
			var n = {
				viewBox: t,
				labelRef: r
			};
			return !0 === e ? N.createElement(ow, od({
				key: "label-implicit"
			}, n)) : ex(e) ? N.createElement(ow, od({
				key: "label-implicit",
				value: e
			}, n)) : (0, N.isValidElement)(e) ? e.type === ow ? (0, N.cloneElement)(e, oh({
				key: "label-implicit"
			}, n)) : N.createElement(ow, od({
				key: "label-implicit",
				content: e
			}, n)) : og(e) ? N.createElement(ow, od({
				key: "label-implicit",
				content: e
			}, n)) : e && "object" == typeof e ? N.createElement(ow, od({}, e, {
				key: "label-implicit"
			}, n)) : null
		})(t, ov(), r) || null
	}
	ow.displayName = "Label";
	var o_ = ["valueAccessor"],
		oA = ["dataKey", "clockWise", "id", "textBreakAll", "zIndex"];

	function oS() {
		return (oS = Object.assign.bind()).apply(null, arguments)
	}

	function oj(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}
	var oE = e => {
			var t = Array.isArray(e.value) ? e.value[e.value.length - 1] : e.value;
			if (null == t || "string" == typeof t || "number" == typeof t || "boolean" == typeof t) return t
		},
		ok = (0, N.createContext)(void 0),
		oP = ok.Provider,
		oM = (0, N.createContext)(void 0);

	function oI(e) {
		var t = e.valueAccessor,
			r = void 0 === t ? oE : t,
			n = oj(e, o_),
			i = n.dataKey,
			a = (n.clockWise, n.id),
			o = n.textBreakAll,
			l = n.zIndex,
			u = oj(n, oA),
			c = (0, N.useContext)(ok),
			s = (0, N.useContext)(oM),
			f = c || s;
		return f && f.length ? N.createElement(ol, {
			zIndex: null != l ? l : aR.label
		}, N.createElement(en, {
			className: "recharts-label-list"
		}, f.map((e, t) => {
			var l, c = null == i ? r(e, t) : iZ(e.payload, i),
				s = null == a ? {} : {
					id: "".concat(a, "-").concat(t)
				};
			return N.createElement(ow, oS({
				key: "label-".concat(t)
			}, ee(e), u, s, {
				fill: null != (l = n.fill) ? l : e.fill,
				parentViewBox: e.parentViewBox,
				value: c,
				textBreakAll: o,
				viewBox: e.viewBox,
				index: t,
				zIndex: 0
			}))
		}))) : null
	}

	function oC(e) {
		var t = e.label;
		return t ? !0 === t ? N.createElement(oI, {
			key: "labelList-implicit"
		}) : N.isValidElement(t) || og(t) ? N.createElement(oI, {
			key: "labelList-implicit",
			content: t
		}) : "object" == typeof t ? N.createElement(oI, oS({
			key: "labelList-implicit"
		}, t, {
			type: String(t.type)
		})) : null : null
	}
	oM.Provider, oI.displayName = "LabelList";
	var oT = e.i(87683),
		oD = e => "string" == typeof e ? e : e ? e.displayName || e.name || "Component" : "",
		oN = null,
		oz = null,
		oL = e => {
			if (e === oN && Array.isArray(oz)) return oz;
			var t = [];
			return N.Children.forEach(e, e => {
				null != e && ((0, oT.isFragment)(e) ? t = t.concat(oL(e.props.children)) : t.push(e))
			}), oz = t, oN = e, t
		},
		oR = e => "radius" in e && "startAngle" in e && "endAngle" in e,
		oB = (e, t, r) => {
			if (null === e || "object" != typeof e && "function" != typeof e) return null;
			var n = null;
			return Object.keys(e).forEach(i => {
				var a = e[i];
				Y(i) && "function" == typeof a && (n || (n = {}), n[i] = e => (a(t, r, e), null))
			}), n
		},
		o$ = (e, t) => [0, 3 * e, 3 * t - 6 * e, 3 * e - 3 * t + 1],
		oU = (e, t) => e.map((e, r) => e * t ** r).reduce((e, t) => e + t),
		oF = (e, t) => r => oU(o$(e, t), r),
		oK = function() {
			for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
			if (1 === t.length) switch (t[0]) {
				case "linear":
					return [0, 0, 1, 1];
				case "ease":
					return [.25, .1, .25, 1];
				case "ease-in":
					return [.42, 0, 1, 1];
				case "ease-out":
					return [.42, 0, .58, 1];
				case "ease-in-out":
					return [0, 0, .58, 1];
				default:
					var n = (e => {
						var t, r = e.split("(");
						if (2 !== r.length || "cubic-bezier" !== r[0]) return null;
						var n = null == (t = r[1]) || null == (t = t.split(")")[0]) ? void 0 : t.split(",");
						if (null == n || 4 !== n.length) return null;
						var i = n.map(e => parseFloat(e));
						return [i[0], i[1], i[2], i[3]]
					})(t[0]);
					if (n) return n
			}
			return 4 === t.length ? t : [0, 0, 1, 1]
		},
		oH = function() {
			return ((e, t, r, n) => {
				var i = oF(e, r),
					a = oF(t, n),
					o = t => oU([...o$(e, r).map((e, t) => e * t).slice(1), 0], t),
					l = e => e > 1 ? 1 : e < 0 ? 0 : e,
					u = e => {
						for (var t = e > 1 ? 1 : e, r = t, n = 0; n < 8; ++n) {
							var u = i(r) - t,
								c = o(r);
							if (1e-4 > Math.abs(u - t) || c < 1e-4) break;
							r = l(r - u / c)
						}
						return a(r)
					};
				return u.isStepper = !1, u
			})(...oK(...arguments))
		},
		oq = function() {
			for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = e.stiff, r = void 0 === t ? 100 : t, n = e.damping, i = void 0 === n ? 8 : n, a = e.dt, o = void 0 === a ? 16.67 : a, l = [0], u = 0, c = 0, s = 0; s < 1e4;) {
				var f = c * i;
				if (c += (-(u - 1) * r - f) * o / 1e3, u += c * o / 1e3, l.push(u), 1e-4 > Math.abs(u - 1) && 1e-4 > Math.abs(c)) break;
				s++
			}
			l[l.length - 1] = 1;
			var h = l.length - 1;
			return e => {
				if (e <= 0) return 0;
				if (e >= 1) return 1;
				var t, r, n, i = e * h,
					a = Math.floor(i);
				return (null != (t = l[a]) ? t : 0) + ((null != (r = l[a + 1]) ? r : 0) - (null != (n = l[a]) ? n : 0)) * (i - a)
			}
		},
		oW = (0, N.createContext)((e, t, r) => {
			var n, i = a => {
				var o = t.tick(a);
				if ("active" === t.getState()) {
					if (r(t.getInterpolated()), 1 === t.getProgress()) {
						t.complete(), n = void 0;
						return
					}
					n = e.setTimeout(i, o);
					return
				}
				n = e.setTimeout(i, o)
			};
			return n = e.setTimeout(i, 0), () => {
				var e;
				return null == (e = n) ? void 0 : e()
			}
		});

	function oV(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function oY() {
		var e, t = function(e) {
				if (Array.isArray(e)) return e
			}(e = (0, N.useState)(() => !eP.isSsr && !!window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(e) || function(e) {
				if (e) {
					if ("string" == typeof e) return oV(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? oV(e, 2) : void 0
				}
			}(e) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}(),
			r = t[0],
			n = t[1];
		return (0, N.useEffect)(() => {
			if (window.matchMedia) {
				var e = window.matchMedia("(prefers-reduced-motion: reduce)"),
					t = () => {
						n(e.matches)
					};
				return e.addEventListener("change", t), () => {
					e.removeEventListener("change", t)
				}
			}
		}, []), r
	}
	oW.Provider;
	var oX = "init",
		oG = "pending",
		oZ = "active";

	function oQ(e) {
		return Math.max(0, e)
	}
	class oJ {
		getAnimationStartedTime() {
			return this.animationStartedTime
		}
		getBeginStartedTime() {
			return this.beginStartedTime
		}
		constructor(e) {
			var t, r, n;
			(r = "symbol" == typeof(n = function(e, t) {
				if ("object" != typeof e || !e) return e;
				var r = e[Symbol.toPrimitive];
				if (void 0 !== r) {
					var n = r.call(e, t || "default");
					if ("object" != typeof n) return n;
					throw TypeError("@@toPrimitive must return a primitive value.")
				}
				return ("string" === t ? String : Number)(e)
			}(r = "state", "string")) ? n : n + "") in this ? Object.defineProperty(this, r, {
				value: oX,
				enumerable: !0,
				configurable: !0,
				writable: !0
			}) : this[r] = oX, this.animationId = e.animationId, this.onAnimationEnd = e.onAnimationEnd, this.animationDuration = oQ(e.animationDuration), this.animationBegin = oQ(e.animationBegin), this.progress = 0, this.from = e.from, this.to = e.to, this.easing = e.easing, null == (t = e.onAnimationStart) || t.call(e)
		}
		getState() {
			return this.state
		}
		getEasing() {
			return this.easing
		}
		getAnimationDuration() {
			return this.animationDuration
		}
		tick(e) {
			if (this.getState() === oX) return this.state = oG, this.beginStartedTime = e, this.animationBegin;
			if (this.getState() === oG) {
				if (null == this.beginStartedTime) throw Error();
				var t = e - this.beginStartedTime;
				return t >= this.animationBegin ? (this.state = oZ, this.animationStartedTime = e, this.nextAnimationUpdate(0)) : oQ(this.animationBegin - t)
			}
			if (this.getState() === oZ) {
				if (null == this.animationStartedTime) throw Error();
				var r = e - this.animationStartedTime;
				return this.setProgress(r / this.animationDuration), this.nextAnimationUpdate(r)
			}
			return 0
		}
		setProgress(e) {
			this.progress = Math.min(1, Math.max(0, e))
		}
		getProgress() {
			return this.progress
		}
		complete() {
			if (this.progress = 1, "active" === this.state) {
				var e;
				null == (e = this.onAnimationEnd) || e.call(this)
			}
			this.state = "completed"
		}
		getFrom() {
			return this.from
		}
		getTo() {
			return this.to
		}
		getAnimationId() {
			return this.animationId
		}
		getAnimationBegin() {
			return this.animationBegin
		}
	}
	class o0 extends oJ {
		nextAnimationUpdate() {
			return 0
		}
		getInterpolated() {
			return this.easing(eS(this.getFrom(), this.getTo(), this.getProgress()))
		}
	}
	class o1 {
		setTimeout(e) {
			var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
				r = performance.now(),
				n = null,
				i = a => {
					a - r >= t ? e(a) : n = requestAnimationFrame(i)
				};
			return n = requestAnimationFrame(i), () => {
				null != n && cancelAnimationFrame(n)
			}
		}
	}

	function o2(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var o3 = {
		begin: 0,
		duration: 1e3,
		easing: "ease",
		isActive: !0,
		canBegin: !0,
		onAnimationEnd: () => {},
		onAnimationStart: () => {}
	};

	function o5(e) {
		var t, r, n, i = eG(e, o3),
			a = i.animationId,
			o = i.isActive,
			l = i.canBegin,
			u = i.duration,
			c = i.easing,
			s = i.begin,
			f = i.onAnimationEnd,
			h = i.onAnimationStart,
			d = i.children,
			p = oY(),
			y = "auto" === o ? !eP.isSsr && !p : o,
			v = (t = i.animationController, r = (0, N.useContext)(oW), (0, N.useMemo)(() => null != t ? t : r, [t, r])),
			m = function(e) {
				if (Array.isArray(e)) return e
			}(n = (0, N.useState)(+!y)) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(n) || function(e) {
				if (e) {
					if ("string" == typeof e) return o2(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? o2(e, 2) : void 0
				}
			}(n) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}(),
			g = m[0],
			b = m[1];
		return (0, N.useEffect)(() => {
			y || b(1)
		}, [y]), (0, N.useEffect)(() => {
			var e = (e => {
				if ("string" == typeof e) switch (e) {
					case "ease":
					case "ease-in-out":
					case "ease-out":
					case "ease-in":
					case "linear":
						return oH(e);
					case "spring":
						return oq();
					default:
						if ("cubic-bezier" === e.split("(")[0]) return oH(e)
				}
				return "function" == typeof e ? e : null
			})(c);
			return y && l && null != e ? v(new o1, new o0({
				animationId: a,
				easing: e,
				animationDuration: u,
				animationBegin: s,
				onAnimationStart: h,
				onAnimationEnd: f,
				from: 0,
				to: 1
			}), b) : ek
		}, [v, a, y, l, u, c, s, h, f]), d(Number(g))
	}

	function o6(e) {
		var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "animation-",
			r = (0, N.useRef)(eO(t)),
			n = (0, N.useRef)(e);
		return n.current !== e && (r.current = eO(t), n.current = e), r.current
	}
	var o4 = ["radius"],
		o8 = ["radius"];

	function o7(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function o9(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? o7(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : o7(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function le() {
		return (le = Object.assign.bind()).apply(null, arguments)
	}

	function lt(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}

	function lr(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function ln(e, t) {
		return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
			raw: {
				value: Object.freeze(t)
			}
		}))
	}
	var li = (e, t, r, n, i) => {
			var a = ep(r),
				v = ep(n),
				m = Math.min(Math.abs(a) / 2, Math.abs(v) / 2),
				g = v >= 0 ? 1 : -1,
				b = a >= 0 ? 1 : -1,
				x = +(v >= 0 && a >= 0 || v < 0 && a < 0);
			if (m > 0 && Array.isArray(i)) {
				for (var w = [0, 0, 0, 0], O = 0; O < 4; O++) {
					var _, A, S = null != (A = i[O]) ? A : 0;
					w[O] = S > m ? m : S
				}
				_ = ey(o || (o = ln(["M", ",", ""])), e, t + g * w[0]), w[0] > 0 && (_ += ey(l || (l = ln(["A ", ",", ",0,0,", ",", ",", ""])), w[0], w[0], x, e + b * w[0], t)), _ += ey(u || (u = ln(["L ", ",", ""])), e + r - b * w[1], t), w[1] > 0 && (_ += ey(c || (c = ln(["A ", ",", ",0,0,", ",\n        ", ",", ""])), w[1], w[1], x, e + r, t + g * w[1])), _ += ey(s || (s = ln(["L ", ",", ""])), e + r, t + n - g * w[2]), w[2] > 0 && (_ += ey(f || (f = ln(["A ", ",", ",0,0,", ",\n        ", ",", ""])), w[2], w[2], x, e + r - b * w[2], t + n)), _ += ey(h || (h = ln(["L ", ",", ""])), e + b * w[3], t + n), w[3] > 0 && (_ += ey(d || (d = ln(["A ", ",", ",0,0,", ",\n        ", ",", ""])), w[3], w[3], x, e, t + n - g * w[3])), _ += "Z"
			} else if (m > 0 && i === +i && i > 0) {
				var j = Math.min(m, i);
				_ = ey(p || (p = ln(["M ", ",", "\n            A ", ",", ",0,0,", ",", ",", "\n            L ", ",", "\n            A ", ",", ",0,0,", ",", ",", "\n            L ", ",", "\n            A ", ",", ",0,0,", ",", ",", "\n            L ", ",", "\n            A ", ",", ",0,0,", ",", ",", " Z"])), e, t + g * j, j, j, x, e + b * j, t, e + r - b * j, t, j, j, x, e + r, t + g * j, e + r, t + n - g * j, j, j, x, e + r - b * j, t + n, e + b * j, t + n, j, j, x, e, t + n - g * j)
			} else _ = ey(y || (y = ln(["M ", ",", " h ", " v ", " h ", " Z"])), e, t, r, n, -r);
			return _
		},
		la = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			radius: 0,
			isAnimationActive: !1,
			isUpdateAnimationActive: !1,
			animationBegin: 0,
			animationDuration: 1500,
			animationEasing: "ease"
		},
		lo = e => {
			let t, r;
			var n, i = eG(e, la),
				a = (0, N.useRef)(null),
				o = function(e) {
					if (Array.isArray(e)) return e
				}(n = (0, N.useState)(-1)) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(n) || function(e) {
					if (e) {
						if ("string" == typeof e) return lr(e, 2);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? lr(e, 2) : void 0
					}
				}(n) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}(),
				l = o[0],
				u = o[1];
			(0, N.useEffect)(() => {
				if (a.current && a.current.getTotalLength) try {
					var e = a.current.getTotalLength();
					e && u(e)
				} catch (e) {}
			}, []);
			var c = i.x,
				s = i.y,
				f = i.width,
				h = i.height,
				d = i.radius,
				p = i.className,
				y = i.animationEasing,
				v = i.animationDuration,
				m = i.animationBegin,
				g = i.isAnimationActive,
				b = i.isUpdateAnimationActive,
				x = (0, N.useRef)(f),
				w = (0, N.useRef)(h),
				O = (0, N.useRef)(c),
				_ = (0, N.useRef)(s),
				A = o6((0, N.useMemo)(() => ({
					x: c,
					y: s,
					width: f,
					height: h,
					radius: d
				}), [c, s, f, h, d]), "rectangle-");
			if (c !== +c || s !== +s || f !== +f || h !== +h || 0 === f || 0 === h) return null;
			var S = (0, W.f)("recharts-rectangle", p);
			if (!b) {
				var j = ee(i),
					E = (j.radius, lt(j, o4));
				return N.createElement("path", le({}, E, {
					x: ep(c),
					y: ep(s),
					width: ep(f),
					height: ep(h),
					radius: "number" == typeof d ? d : void 0,
					className: S,
					d: li(c, s, f, h, d)
				}))
			}
			var k = x.current,
				P = w.current,
				M = O.current,
				I = _.current,
				C = "0px ".concat(-1 === l ? 1 : l, "px"),
				T = "".concat(l, "px ").concat(l, "px"),
				D = (t = ["strokeDasharray"], r = "string" == typeof y ? y : la.animationEasing, t.map(e => "".concat(e.replace(/([A-Z])/g, e => "-".concat(e.toLowerCase())), " ").concat(v, "ms ").concat(r)).join(","));
			return N.createElement(o5, {
				animationId: A,
				key: A,
				canBegin: l > 0,
				duration: v,
				easing: y,
				isActive: b,
				begin: m
			}, e => {
				var t, r = eS(k, f, e),
					n = eS(P, h, e),
					o = eS(M, c, e),
					l = eS(I, s, e);
				a.current && (x.current = r, w.current = n, O.current = o, _.current = l), t = g ? e > 0 ? {
					transition: D,
					strokeDasharray: T
				} : {
					strokeDasharray: C
				} : {
					strokeDasharray: T
				};
				var u = ee(i),
					p = (u.radius, lt(u, o8));
				return N.createElement("path", le({}, p, {
					radius: "number" == typeof d ? d : void 0,
					className: S,
					d: li(o, l, r, n, d),
					ref: a,
					style: o9(o9({}, t), i.style)
				}))
			})
		};

	function ll(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function lu(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? ll(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ll(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function lc(e) {
		var t, r, n = e.option,
			i = e.DefaultShape,
			a = e.shapeProps,
			o = e.activeClassName,
			l = e.inActiveClassName,
			u = function(e) {
				if ("index" in e) {
					var t = e.index;
					return "number" == typeof t || "string" == typeof t ? t : void 0
				}
			}(a);
		return r = (0, N.isValidElement)(n) ? (0, N.cloneElement)(n, (t = (0, N.isValidElement)(n) ? n.props : n, lu(lu({}, a), t))) : n === i ? N.createElement(i, a) : "function" == typeof n ? n(a, u) : "object" == typeof n ? N.createElement(i, lu(lu({}, a), n)) : N.createElement(i, a), "isActive" in a && !0 === a.isActive ? N.createElement(en, {
			className: void 0 === o ? "recharts-active-shape" : o
		}, r) : N.createElement(en, {
			className: void 0 === l ? "recharts-shape" : l
		}, r)
	}
	var ls = ["option"];

	function lf(e) {
		var t = e.option,
			r = function(e, t) {
				if (null == e) return {};
				var r, n, i = function(e, t) {
					if (null == e) return {};
					var r = {};
					for (var n in e)
						if (({}).hasOwnProperty.call(e, n)) {
							if (-1 !== t.indexOf(n)) continue;
							r[n] = e[n]
						} return r
				}(e, t);
				if (Object.getOwnPropertySymbols) {
					var a = Object.getOwnPropertySymbols(e);
					for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
				}
				return i
			}(e, ls);
		return N.createElement(lc, {
			option: t,
			DefaultShape: lo,
			shapeProps: r,
			activeClassName: "recharts-active-bar",
			inActiveClassName: "recharts-inactive-bar"
		})
	}
	var lh = function(e) {
			var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
			return (r, n) => {
				if (eb(e)) return e;
				var i = eb(r) || null == r;
				return i ? e(r, n) : (i || function(e, t) {
					if (!e) throw Error("Invariant failed")
				}(!1, "minPointSize callback function received a value with type of ".concat(typeof r, ". Currently only numbers or null/undefined are supported.")), t)
			}
		},
		ld = {
			active: !1,
			index: null,
			dataKey: void 0,
			graphicalItemId: void 0,
			coordinate: void 0
		},
		lp = r1({
			name: "tooltip",
			initialState: {
				itemInteraction: {
					click: ld,
					hover: ld
				},
				axisInteraction: {
					click: ld,
					hover: ld
				},
				keyboardInteraction: ld,
				syncInteraction: {
					active: !1,
					index: null,
					dataKey: void 0,
					label: void 0,
					coordinate: void 0,
					sourceViewBox: void 0,
					graphicalItemId: void 0
				},
				tooltipItemPayloads: [],
				settings: {
					shared: void 0,
					trigger: "hover",
					axisId: 0,
					active: !1,
					defaultIndex: void 0
				}
			},
			reducers: {
				addTooltipEntrySettings: {
					reducer(e, t) {
						e.tooltipItemPayloads.push(t.payload)
					},
					prepare: rG()
				},
				replaceTooltipEntrySettings: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next,
							a = rx(e).tooltipItemPayloads.indexOf(n);
						a > -1 && (e.tooltipItemPayloads[a] = i)
					},
					prepare: rG()
				},
				removeTooltipEntrySettings: {
					reducer(e, t) {
						var r = rx(e).tooltipItemPayloads.indexOf(t.payload);
						r > -1 && e.tooltipItemPayloads.splice(r, 1)
					},
					prepare: rG()
				},
				setTooltipSettingsState(e, t) {
					e.settings = t.payload
				},
				setActiveMouseOverItemIndex(e, t) {
					e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.itemInteraction.hover.active = !0, e.itemInteraction.hover.index = t.payload.activeIndex, e.itemInteraction.hover.dataKey = t.payload.activeDataKey, e.itemInteraction.hover.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.hover.coordinate = t.payload.activeCoordinate
				},
				mouseLeaveChart(e) {
					e.itemInteraction.hover.active = !1, e.axisInteraction.hover.active = !1
				},
				mouseLeaveItem(e) {
					e.itemInteraction.hover.active = !1
				},
				setActiveClickItemIndex(e, t) {
					e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.itemInteraction.click.active = !0, e.keyboardInteraction.active = !1, e.itemInteraction.click.index = t.payload.activeIndex, e.itemInteraction.click.dataKey = t.payload.activeDataKey, e.itemInteraction.click.graphicalItemId = t.payload.activeGraphicalItemId, e.itemInteraction.click.coordinate = t.payload.activeCoordinate
				},
				setMouseOverAxisIndex(e, t) {
					e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.axisInteraction.hover.active = !0, e.keyboardInteraction.active = !1, e.axisInteraction.hover.index = t.payload.activeIndex, e.axisInteraction.hover.dataKey = t.payload.activeDataKey, e.axisInteraction.hover.coordinate = t.payload.activeCoordinate
				},
				setMouseClickAxisIndex(e, t) {
					e.syncInteraction.active = !1, e.syncInteraction.sourceViewBox = void 0, e.keyboardInteraction.active = !1, e.axisInteraction.click.active = !0, e.axisInteraction.click.index = t.payload.activeIndex, e.axisInteraction.click.dataKey = t.payload.activeDataKey, e.axisInteraction.click.coordinate = t.payload.activeCoordinate
				},
				setSyncInteraction(e, t) {
					e.syncInteraction = t.payload
				},
				setKeyboardInteraction(e, t) {
					e.keyboardInteraction.active = t.payload.active, e.keyboardInteraction.index = t.payload.activeIndex, e.keyboardInteraction.coordinate = t.payload.activeCoordinate
				}
			}
		}),
		ly = lp.actions,
		lv = ly.addTooltipEntrySettings,
		lm = ly.replaceTooltipEntrySettings,
		lg = ly.removeTooltipEntrySettings,
		lb = ly.setTooltipSettingsState,
		lx = ly.setActiveMouseOverItemIndex,
		lw = ly.mouseLeaveItem,
		lO = ly.mouseLeaveChart,
		l_ = ly.setActiveClickItemIndex,
		lA = ly.setMouseOverAxisIndex,
		lS = ly.setMouseClickAxisIndex,
		lj = ly.setSyncInteraction,
		lE = ly.setKeyboardInteraction,
		lk = lp.reducer,
		lP = (e, t, r) => {
			var n = th();
			return (i, a) => o => {
				null == e || e(i, a, o), n(lx({
					activeIndex: String(a),
					activeDataKey: t,
					activeCoordinate: i.tooltipPosition,
					activeGraphicalItemId: r
				}))
			}
		},
		lM = e => {
			var t = th();
			return (r, n) => i => {
				null == e || e(r, n, i), t(lw())
			}
		},
		lI = (e, t, r) => {
			var n = th();
			return (i, a) => o => {
				null == e || e(i, a, o), n(l_({
					activeIndex: String(a),
					activeDataKey: t,
					activeCoordinate: i.tooltipPosition,
					activeGraphicalItemId: r
				}))
			}
		};

	function lC(e) {
		var t = e.tooltipEntrySettings,
			r = th(),
			n = as(),
			i = (0, N.useRef)(null);
		return (0, N.useLayoutEffect)(() => {
			n || (null === i.current ? r(lv(t)) : i.current !== t && r(lm({
				prev: i.current,
				next: t
			})), i.current = t)
		}, [t, r, n]), (0, N.useLayoutEffect)(() => () => {
			i.current && (r(lg(i.current)), i.current = null)
		}, [r]), null
	}
	var lT = ["children"],
		lD = (0, N.createContext)({
			data: [],
			xAxisId: "xAxis-0",
			yAxisId: "yAxis-0",
			dataPointFormatter: () => ({
				x: 0,
				y: 0,
				value: 0
			}),
			errorBarOffset: 0
		});

	function lN(e) {
		var t = e.children,
			r = function(e, t) {
				if (null == e) return {};
				var r, n, i = function(e, t) {
					if (null == e) return {};
					var r = {};
					for (var n in e)
						if (({}).hasOwnProperty.call(e, n)) {
							if (-1 !== t.indexOf(n)) continue;
							r[n] = e[n]
						} return r
				}(e, t);
				if (Object.getOwnPropertySymbols) {
					var a = Object.getOwnPropertySymbols(e);
					for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
				}
				return i
			}(e, lT);
		return N.createElement(lD.Provider, {
			value: r
		}, t)
	}

	function lz(e) {
		var t;
		return e ? 1 / 0 === (e = ef(t = e) ? 0 / 0 : Number(t)) || -1 / 0 === e ? (e < 0 ? -1 : 1) * Number.MAX_VALUE : e == e ? e : 0 : 0 === e ? e : 0
	}

	function lL(e, t, r) {
		r && "number" != typeof r && nz(e, t, r) && (t = r = void 0), e = lz(e), void 0 === t ? (t = e, e = 0) : t = lz(t), r = void 0 === r ? e < t ? 1 : -1 : lz(r);
		let n = Math.max(Math.ceil((t - e) / (r || 1)), 0),
			i = Array(n);
		for (let t = 0; t < n; t++) i[t] = e, e += r;
		return i
	}
	var lR = e => e.chartData,
		lB = r$([lR], e => {
			var t = null != e.chartData ? e.chartData.length - 1 : 0;
			return {
				chartData: e.chartData,
				computedData: e.computedData,
				dataEndIndex: t,
				dataStartIndex: 0
			}
		}),
		l$ = (e, t, r, n) => n ? lB(e) : lR(e),
		lU = r$([l$], e => {
			var t = e.chartData,
				r = e.dataStartIndex,
				n = e.dataEndIndex;
			return null != t ? t.slice(r, n + 1) : []
		});
	r$([lB], e => {
		var t = e.chartData,
			r = e.dataStartIndex,
			n = e.dataEndIndex;
		return null != t ? t.slice(r, n + 1) : []
	});
	var lF = r$([lR], e => {
		var t = e.chartData,
			r = e.dataStartIndex,
			n = e.dataEndIndex;
		return null != t ? t.slice(r, n + 1) : []
	});

	function lK(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return lH(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? lH(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function lH(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function lq(e) {
		if (Array.isArray(e) && 2 === e.length) {
			var t = lK(e, 2),
				r = t[0],
				n = t[1];
			if (eZ(r) && eZ(n)) return !0
		}
		return !1
	}

	function lW(e, t, r) {
		return r ? e : [Math.min(e[0], t[0]), Math.max(e[1], t[1])]
	}

	function lV(e, t) {
		if (t && "function" != typeof e && Array.isArray(e) && 2 === e.length) {
			var r, n, i = lK(e, 2),
				a = i[0],
				o = i[1];
			if (eZ(a)) r = a;
			else if ("function" == typeof a) return;
			if (eZ(o)) n = o;
			else if ("function" == typeof o) return;
			var l = [r, n];
			if (lq(l)) return l
		}
	}
	var lY = e.i(560600);

	function lX(e) {
		return 0 === e ? 1 : Math.floor(new lY.default(e).abs().log(10).toNumber()) + 1
	}

	function lG(e, t, r) {
		for (var n = new lY.default(e), i = 0, a = []; n.lt(t) && i < 1e5;) a.push(n.toNumber()), n = n.add(r), i++;
		return a
	}

	function lZ(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return lQ(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? lQ(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function lQ(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var lJ = e => {
			var t = lZ(e, 2),
				r = t[0],
				n = t[1],
				i = r,
				a = n;
			return r > n && (i = n, a = r), [i, a]
		},
		l0 = (e, t, r) => {
			if (e.lte(0)) return new lY.default(0);
			var n = lX(e.toNumber()),
				i = new lY.default(10).pow(n),
				a = e.div(i),
				o = 1 !== n ? .05 : .1,
				l = new lY.default(Math.ceil(a.div(o).toNumber())).add(r).mul(o).mul(i);
			return new lY.default(t ? l.toNumber() : Math.ceil(l.toNumber()))
		},
		l1 = (e, t, r) => {
			if (e.lte(0)) return new lY.default(0);
			var n, i = [1, 2, 2.5, 5],
				a = e.toNumber(),
				o = Math.floor(new lY.default(a).abs().log(10).toNumber()),
				l = new lY.default(10).pow(o),
				u = e.div(l).toNumber(),
				c = i.findIndex(e => e >= u - 1e-10);
			if (-1 === c && (l = l.mul(10), c = 0), (c += r) >= i.length) {
				var s = Math.floor(c / i.length);
				c %= i.length, l = l.mul(new lY.default(10).pow(s))
			}
			var f = null != (n = i[c]) ? n : 1,
				h = new lY.default(f).mul(l);
			return t ? h : new lY.default(Math.ceil(h.toNumber()))
		},
		l2 = function(e, t, r, n) {
			var i, a = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
				o = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : l0;
			if (!Number.isFinite((t - e) / (r - 1))) return {
				step: new lY.default(0),
				tickMin: new lY.default(0),
				tickMax: new lY.default(0)
			};
			var l = o(new lY.default(t).sub(e).div(r - 1), n, a),
				u = Math.ceil((i = e <= 0 && t >= 0 ? new lY.default(0) : (i = new lY.default(e).add(t).div(2)).sub(new lY.default(i).mod(l))).sub(e).div(l).toNumber()),
				c = Math.ceil(new lY.default(t).sub(i).div(l).toNumber()),
				s = u + c + 1;
			return s > r ? l2(e, t, r, n, a + 1, o) : (s < r && (c = t > 0 ? c + (r - s) : c, u = t > 0 ? u : u + (r - s)), {
				step: l,
				tickMin: i.sub(new lY.default(u).mul(l)),
				tickMax: i.add(new lY.default(c).mul(l))
			})
		},
		l3 = function(e) {
			var t = lZ(e, 2),
				r = t[0],
				n = t[1],
				i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 6,
				a = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
				o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "auto",
				l = Math.max(i, 2),
				u = lZ(lJ([r, n]), 2),
				c = u[0],
				s = u[1];
			if (-1 / 0 === c || 1 / 0 === s) {
				var f = 1 / 0 === s ? [c, ...Array(i - 1).fill(1 / 0)] : [...Array(i - 1).fill(-1 / 0), s];
				return r > n ? f.reverse() : f
			}
			if (c === s) return ((e, t, r) => {
				var n = new lY.default(1),
					i = new lY.default(e);
				if (!i.isint() && r) {
					var a = Math.abs(e);
					a < 1 ? (n = new lY.default(10).pow(lX(e) - 1), i = new lY.default(Math.floor(i.div(n).toNumber())).mul(n)) : a > 1 && (i = new lY.default(Math.floor(e)))
				} else 0 === e ? i = new lY.default(Math.floor((t - 1) / 2)) : r || (i = new lY.default(Math.floor(e)));
				for (var o = Math.floor((t - 1) / 2), l = [], u = 0; u < t; u++) l.push(i.add(new lY.default(u - o).mul(n)).toNumber());
				return l
			})(c, i, a);
			var h = l2(c, s, l, a, 0, "snap125" === o ? l1 : l0),
				d = h.step,
				p = lG(h.tickMin, h.tickMax.add(new lY.default(.1).mul(d)), d);
			return r > n ? p.reverse() : p
		},
		l5 = function(e, t) {
			var r = lZ(e, 2),
				n = r[0],
				i = r[1],
				a = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2],
				o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "auto",
				l = lZ(lJ([n, i]), 2),
				u = l[0],
				c = l[1];
			if (-1 / 0 === u || 1 / 0 === c) return [n, i];
			if (u === c) return [u];
			var s = Math.max(t, 2),
				f = ("snap125" === o ? l1 : l0)(new lY.default(c).sub(u).div(s - 1), a, 0),
				h = [...lG(new lY.default(u), new lY.default(c), f), c];
			if (!1 === a) {
				var d = (h = h.map(e => Math.round(e))).length - 1;
				d > 0 && h[d] === h[d - 1] && (h = h.slice(0, d))
			}
			return n > i ? h.reverse() : h
		},
		l6 = e => e.rootProps.maxBarSize,
		l4 = e => e.rootProps.barCategoryGap,
		l8 = e => e.rootProps.stackOffset,
		l7 = e => e.rootProps.reverseStackOrder,
		l9 = e => e.options.chartName,
		ue = e => e.rootProps.syncId,
		ut = e => e.rootProps.syncMethod,
		ur = e => e.options.eventEmitter,
		un = (e, t) => t,
		ui = (e, t, r) => r;

	function ua(e) {
		return null == e ? void 0 : e.id
	}

	function uo(e, t, r) {
		var n = t.chartData,
			i = void 0 === n ? [] : n,
			a = r.allowDuplicatedCategory,
			o = r.dataKey,
			l = new Map;
		return e.forEach(e => {
			var t, r = null != (t = e.data) ? t : i;
			if (null != r && 0 !== r.length) {
				var n = ua(e);
				r.forEach((t, r) => {
					var i, u = null == o || a ? r : String(iZ(t, o, null)),
						c = iZ(t, e.dataKey, 0);
					Object.assign(i = l.has(u) ? l.get(u) : {}, {
						[n]: c
					}), l.set(u, i)
				})
			}
		}), Array.from(l.values())
	}

	function ul(e) {
		return "stackId" in e && null != e.stackId && null != e.dataKey
	}
	var uu = (e, t) => e === t || null != e && null != t && e[0] === t[0] && e[1] === t[1],
		uc = e => {
			var t = aN(e);
			return "horizontal" === t ? "xAxis" : "vertical" === t ? "yAxis" : "centric" === t ? "angleAxis" : "radiusAxis"
		},
		us = e => e.tooltip.settings.axisId;

	function uf(e) {
		if (null != e) {
			var t = e.ticks,
				r = e.bandwidth,
				n = e.range(),
				i = [Math.min(...n), Math.max(...n)];
			return {
				domain: () => e.domain(),
				range: function(e) {
					function t() {
						return e.apply(this, arguments)
					}
					return t.toString = function() {
						return e.toString()
					}, t
				}(() => i),
				rangeMin: () => i[0],
				rangeMax: () => i[1],
				isInRange(e) {
					var t = i[0],
						r = i[1];
					return t <= r ? e >= t && e <= r : e >= r && e <= t
				},
				bandwidth: r ? () => r.call(e) : void 0,
				ticks: t ? r => t.call(e, r) : void 0,
				map: (t, r) => {
					var n = e(t);
					if (null != n) {
						if (e.bandwidth && null != r && r.position) {
							var i = e.bandwidth();
							switch (r.position) {
								case "middle":
									n += i / 2;
									break;
								case "end":
									n += i
							}
						}
						return n
					}
				}
			}
		}
	}

	function uh(e, t) {
		return null == e || null == t ? 0 / 0 : e < t ? -1 : e > t ? 1 : e >= t ? 0 : 0 / 0
	}

	function ud(e, t) {
		return null == e || null == t ? 0 / 0 : t < e ? -1 : t > e ? 1 : t >= e ? 0 : 0 / 0
	}

	function up(e) {
		let t, r, n;

		function i(e, n, a = 0, o = e.length) {
			if (a < o) {
				if (0 !== t(n, n)) return o;
				do {
					let t = a + o >>> 1;
					0 > r(e[t], n) ? a = t + 1 : o = t
				} while (a < o)
			}
			return a
		}
		return 2 !== e.length ? (t = uh, r = (t, r) => uh(e(t), r), n = (t, r) => e(t) - r) : (t = e === uh || e === ud ? e : uy, r = e, n = e), {
			left: i,
			center: function(e, t, r = 0, a = e.length) {
				let o = i(e, t, r, a - 1);
				return o > r && n(e[o - 1], t) > -n(e[o], t) ? o - 1 : o
			},
			right: function(e, n, i = 0, a = e.length) {
				if (i < a) {
					if (0 !== t(n, n)) return a;
					do {
						let t = i + a >>> 1;
						0 >= r(e[t], n) ? i = t + 1 : a = t
					} while (i < a)
				}
				return i
			}
		}
	}

	function uy() {
		return 0
	}

	function uv(e) {
		return null === e ? 0 / 0 : +e
	}
	let um = up(uh),
		ug = um.right;

	function ub(e) {
		return function(t, r, n = r) {
			if (!((r *= 1) >= 0)) throw RangeError("invalid rx");
			if (!((n *= 1) >= 0)) throw RangeError("invalid ry");
			let {
				data: i,
				width: a,
				height: o
			} = t;
			if (!((a = Math.floor(a)) >= 0)) throw RangeError("invalid width");
			if (!((o = Math.floor(void 0 !== o ? o : i.length / a)) >= 0)) throw RangeError("invalid height");
			if (!a || !o || !r && !n) return t;
			let l = r && e(r),
				u = n && e(n),
				c = i.slice();
			return l && u ? (ux(l, c, i, a, o), ux(l, i, c, a, o), ux(l, c, i, a, o), uw(u, i, c, a, o), uw(u, c, i, a, o), uw(u, i, c, a, o)) : l ? (ux(l, i, c, a, o), ux(l, c, i, a, o), ux(l, i, c, a, o)) : u && (uw(u, i, c, a, o), uw(u, c, i, a, o), uw(u, i, c, a, o)), t
		}
	}

	function ux(e, t, r, n, i) {
		for (let a = 0, o = n * i; a < o;) e(t, r, a, a += n, 1)
	}

	function uw(e, t, r, n, i) {
		for (let a = 0, o = n * i; a < n; ++a) e(t, r, a, a + o, n)
	}

	function uO(e) {
		let t = Math.floor(e);
		if (t === e) {
			var r;
			let t;
			return t = 2 * (r = e) + 1, (e, n, i, a, o) => {
				if (!((a -= o) >= i)) return;
				let l = r * n[i],
					u = o * r;
				for (let e = i, t = i + u; e < t; e += o) l += n[Math.min(a, e)];
				for (let r = i, c = a; r <= c; r += o) l += n[Math.min(a, r + u)], e[r] = l / t, l -= n[Math.max(i, r - u)]
			}
		}
		let n = e - t,
			i = 2 * e + 1;
		return (e, r, a, o, l) => {
			if (!((o -= l) >= a)) return;
			let u = t * r[a],
				c = l * t,
				s = c + l;
			for (let e = a, t = a + c; e < t; e += l) u += r[Math.min(o, e)];
			for (let t = a, f = o; t <= f; t += l) u += r[Math.min(o, t + c)], e[t] = (u + n * (r[Math.max(a, t - s)] + r[Math.min(o, t + s)])) / i, u -= r[Math.max(a, t - c)]
		}
	}
	um.left, up(uv).center, ub(uO), ub(function(e) {
		let t = uO(e);
		return (e, r, n, i, a) => {
			t(e, r, (n <<= 2) + 0, (i <<= 2) + 0, a <<= 2), t(e, r, n + 1, i + 1, a), t(e, r, n + 2, i + 2, a), t(e, r, n + 3, i + 3, a)
		}
	});
	class u_ extends Map {
		constructor(e, t = uS) {
			if (super(), Object.defineProperties(this, {
					_intern: {
						value: new Map
					},
					_key: {
						value: t
					}
				}), null != e)
				for (let [t, r] of e) this.set(t, r)
		}
		get(e) {
			return super.get(uA(this, e))
		}
		has(e) {
			return super.has(uA(this, e))
		}
		set(e, t) {
			return super.set(function({
				_intern: e,
				_key: t
			}, r) {
				let n = t(r);
				return e.has(n) ? e.get(n) : (e.set(n, r), r)
			}(this, e), t)
		}
		delete(e) {
			return super.delete(function({
				_intern: e,
				_key: t
			}, r) {
				let n = t(r);
				return e.has(n) && (r = e.get(n), e.delete(n)), r
			}(this, e))
		}
	}

	function uA({
		_intern: e,
		_key: t
	}, r) {
		let n = t(r);
		return e.has(n) ? e.get(n) : r
	}

	function uS(e) {
		return null !== e && "object" == typeof e ? e.valueOf() : e
	}

	function uj(e, t) {
		return (null == e || !(e >= e)) - (null == t || !(t >= t)) || (e < t ? -1 : +(e > t))
	}
	Array.prototype.slice;
	let uE = Math.sqrt(50),
		uk = Math.sqrt(10),
		uP = Math.sqrt(2);

	function uM(e, t, r) {
		let n, i, a, o = (t - e) / Math.max(0, r),
			l = Math.floor(Math.log10(o)),
			u = o / Math.pow(10, l),
			c = u >= uE ? 10 : u >= uk ? 5 : u >= uP ? 2 : 1;
		return (l < 0 ? (n = Math.round(e * (a = Math.pow(10, -l) / c)), i = Math.round(t * a), n / a < e && ++n, i / a > t && --i, a = -a) : (n = Math.round(e / (a = Math.pow(10, l) * c)), i = Math.round(t / a), n * a < e && ++n, i * a > t && --i), i < n && .5 <= r && r < 2) ? uM(e, t, 2 * r) : [n, i, a]
	}

	function uI(e, t, r) {
		if (t *= 1, e *= 1, !((r *= 1) > 0)) return [];
		if (e === t) return [e];
		let n = t < e,
			[i, a, o] = n ? uM(t, e, r) : uM(e, t, r);
		if (!(a >= i)) return [];
		let l = a - i + 1,
			u = Array(l);
		if (n)
			if (o < 0)
				for (let e = 0; e < l; ++e) u[e] = -((a - e) / o);
			else
				for (let e = 0; e < l; ++e) u[e] = (a - e) * o;
		else if (o < 0)
			for (let e = 0; e < l; ++e) u[e] = -((i + e) / o);
		else
			for (let e = 0; e < l; ++e) u[e] = (i + e) * o;
		return u
	}

	function uC(e, t, r) {
		return uM(e *= 1, t *= 1, r *= 1)[2]
	}

	function uT(e, t, r) {
		t *= 1, e *= 1, r *= 1;
		let n = t < e,
			i = n ? uC(t, e, r) : uC(e, t, r);
		return (n ? -1 : 1) * (i < 0 ? -(1 / i) : i)
	}

	function uD(e, t) {
		let r;
		if (void 0 === t)
			for (let t of e) null != t && (r < t || void 0 === r && t >= t) && (r = t);
		else {
			let n = -1;
			for (let i of e) null != (i = t(i, ++n, e)) && (r < i || void 0 === r && i >= i) && (r = i)
		}
		return r
	}

	function uN(e, t) {
		let r;
		if (void 0 === t)
			for (let t of e) null != t && (r > t || void 0 === r && t >= t) && (r = t);
		else {
			let n = -1;
			for (let i of e) null != (i = t(i, ++n, e)) && (r > i || void 0 === r && i >= i) && (r = i)
		}
		return r
	}

	function uz(e, t, r) {
		let n = e[t];
		e[t] = e[r], e[r] = n
	}

	function uL(e, t, r) {
		e.prototype = t.prototype = r, r.constructor = e
	}

	function uR(e, t) {
		var r = Object.create(e.prototype);
		for (var n in t) r[n] = t[n];
		return r
	}

	function uB() {}
	var u$ = 1 / .7,
		uU = "\\s*([+-]?\\d+)\\s*",
		uF = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*",
		uK = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*",
		uH = /^#([0-9a-f]{3,8})$/,
		uq = RegExp(`^rgb\\(${uU},${uU},${uU}\\)$`),
		uW = RegExp(`^rgb\\(${uK},${uK},${uK}\\)$`),
		uV = RegExp(`^rgba\\(${uU},${uU},${uU},${uF}\\)$`),
		uY = RegExp(`^rgba\\(${uK},${uK},${uK},${uF}\\)$`),
		uX = RegExp(`^hsl\\(${uF},${uK},${uK}\\)$`),
		uG = RegExp(`^hsla\\(${uF},${uK},${uK},${uF}\\)$`),
		uZ = {
			aliceblue: 0xf0f8ff,
			antiquewhite: 0xfaebd7,
			aqua: 65535,
			aquamarine: 8388564,
			azure: 0xf0ffff,
			beige: 0xf5f5dc,
			bisque: 0xffe4c4,
			black: 0,
			blanchedalmond: 0xffebcd,
			blue: 255,
			blueviolet: 9055202,
			brown: 0xa52a2a,
			burlywood: 0xdeb887,
			cadetblue: 6266528,
			chartreuse: 8388352,
			chocolate: 0xd2691e,
			coral: 0xff7f50,
			cornflowerblue: 6591981,
			cornsilk: 0xfff8dc,
			crimson: 0xdc143c,
			cyan: 65535,
			darkblue: 139,
			darkcyan: 35723,
			darkgoldenrod: 0xb8860b,
			darkgray: 0xa9a9a9,
			darkgreen: 25600,
			darkgrey: 0xa9a9a9,
			darkkhaki: 0xbdb76b,
			darkmagenta: 9109643,
			darkolivegreen: 5597999,
			darkorange: 0xff8c00,
			darkorchid: 0x9932cc,
			darkred: 9109504,
			darksalmon: 0xe9967a,
			darkseagreen: 9419919,
			darkslateblue: 4734347,
			darkslategray: 3100495,
			darkslategrey: 3100495,
			darkturquoise: 52945,
			darkviolet: 9699539,
			deeppink: 0xff1493,
			deepskyblue: 49151,
			dimgray: 6908265,
			dimgrey: 6908265,
			dodgerblue: 2003199,
			firebrick: 0xb22222,
			floralwhite: 0xfffaf0,
			forestgreen: 2263842,
			fuchsia: 0xff00ff,
			gainsboro: 0xdcdcdc,
			ghostwhite: 0xf8f8ff,
			gold: 0xffd700,
			goldenrod: 0xdaa520,
			gray: 8421504,
			green: 32768,
			greenyellow: 0xadff2f,
			grey: 8421504,
			honeydew: 0xf0fff0,
			hotpink: 0xff69b4,
			indianred: 0xcd5c5c,
			indigo: 4915330,
			ivory: 0xfffff0,
			khaki: 0xf0e68c,
			lavender: 0xe6e6fa,
			lavenderblush: 0xfff0f5,
			lawngreen: 8190976,
			lemonchiffon: 0xfffacd,
			lightblue: 0xadd8e6,
			lightcoral: 0xf08080,
			lightcyan: 0xe0ffff,
			lightgoldenrodyellow: 0xfafad2,
			lightgray: 0xd3d3d3,
			lightgreen: 9498256,
			lightgrey: 0xd3d3d3,
			lightpink: 0xffb6c1,
			lightsalmon: 0xffa07a,
			lightseagreen: 2142890,
			lightskyblue: 8900346,
			lightslategray: 7833753,
			lightslategrey: 7833753,
			lightsteelblue: 0xb0c4de,
			lightyellow: 0xffffe0,
			lime: 65280,
			limegreen: 3329330,
			linen: 0xfaf0e6,
			magenta: 0xff00ff,
			maroon: 8388608,
			mediumaquamarine: 6737322,
			mediumblue: 205,
			mediumorchid: 0xba55d3,
			mediumpurple: 9662683,
			mediumseagreen: 3978097,
			mediumslateblue: 8087790,
			mediumspringgreen: 64154,
			mediumturquoise: 4772300,
			mediumvioletred: 0xc71585,
			midnightblue: 1644912,
			mintcream: 0xf5fffa,
			mistyrose: 0xffe4e1,
			moccasin: 0xffe4b5,
			navajowhite: 0xffdead,
			navy: 128,
			oldlace: 0xfdf5e6,
			olive: 8421376,
			olivedrab: 7048739,
			orange: 0xffa500,
			orangered: 0xff4500,
			orchid: 0xda70d6,
			palegoldenrod: 0xeee8aa,
			palegreen: 0x98fb98,
			paleturquoise: 0xafeeee,
			palevioletred: 0xdb7093,
			papayawhip: 0xffefd5,
			peachpuff: 0xffdab9,
			peru: 0xcd853f,
			pink: 0xffc0cb,
			plum: 0xdda0dd,
			powderblue: 0xb0e0e6,
			purple: 8388736,
			rebeccapurple: 6697881,
			red: 0xff0000,
			rosybrown: 0xbc8f8f,
			royalblue: 4286945,
			saddlebrown: 9127187,
			salmon: 0xfa8072,
			sandybrown: 0xf4a460,
			seagreen: 3050327,
			seashell: 0xfff5ee,
			sienna: 0xa0522d,
			silver: 0xc0c0c0,
			skyblue: 8900331,
			slateblue: 6970061,
			slategray: 7372944,
			slategrey: 7372944,
			snow: 0xfffafa,
			springgreen: 65407,
			steelblue: 4620980,
			tan: 0xd2b48c,
			teal: 32896,
			thistle: 0xd8bfd8,
			tomato: 0xff6347,
			turquoise: 4251856,
			violet: 0xee82ee,
			wheat: 0xf5deb3,
			white: 0xffffff,
			whitesmoke: 0xf5f5f5,
			yellow: 0xffff00,
			yellowgreen: 0x9acd32
		};

	function uQ() {
		return this.rgb().formatHex()
	}

	function uJ() {
		return this.rgb().formatRgb()
	}

	function u0(e) {
		var t, r;
		return e = (e + "").trim().toLowerCase(), (t = uH.exec(e)) ? (r = t[1].length, t = parseInt(t[1], 16), 6 === r ? u1(t) : 3 === r ? new u6(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | 240 & t, (15 & t) << 4 | 15 & t, 1) : 8 === r ? u2(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (255 & t) / 255) : 4 === r ? u2(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | 240 & t, ((15 & t) << 4 | 15 & t) / 255) : null) : (t = uq.exec(e)) ? new u6(t[1], t[2], t[3], 1) : (t = uW.exec(e)) ? new u6(255 * t[1] / 100, 255 * t[2] / 100, 255 * t[3] / 100, 1) : (t = uV.exec(e)) ? u2(t[1], t[2], t[3], t[4]) : (t = uY.exec(e)) ? u2(255 * t[1] / 100, 255 * t[2] / 100, 255 * t[3] / 100, t[4]) : (t = uX.exec(e)) ? ct(t[1], t[2] / 100, t[3] / 100, 1) : (t = uG.exec(e)) ? ct(t[1], t[2] / 100, t[3] / 100, t[4]) : uZ.hasOwnProperty(e) ? u1(uZ[e]) : "transparent" === e ? new u6(0 / 0, 0 / 0, 0 / 0, 0) : null
	}

	function u1(e) {
		return new u6(e >> 16 & 255, e >> 8 & 255, 255 & e, 1)
	}

	function u2(e, t, r, n) {
		return n <= 0 && (e = t = r = 0 / 0), new u6(e, t, r, n)
	}

	function u3(e) {
		return (e instanceof uB || (e = u0(e)), e) ? new u6((e = e.rgb()).r, e.g, e.b, e.opacity) : new u6
	}

	function u5(e, t, r, n) {
		return 1 == arguments.length ? u3(e) : new u6(e, t, r, null == n ? 1 : n)
	}

	function u6(e, t, r, n) {
		this.r = +e, this.g = +t, this.b = +r, this.opacity = +n
	}

	function u4() {
		return `#${ce(this.r)}${ce(this.g)}${ce(this.b)}`
	}

	function u8() {
		let e = u7(this.opacity);
		return `${1===e?"rgb(":"rgba("}${u9(this.r)}, ${u9(this.g)}, ${u9(this.b)}${1===e?")":`, ${e})`}`
	}

	function u7(e) {
		return isNaN(e) ? 1 : Math.max(0, Math.min(1, e))
	}

	function u9(e) {
		return Math.max(0, Math.min(255, Math.round(e) || 0))
	}

	function ce(e) {
		return ((e = u9(e)) < 16 ? "0" : "") + e.toString(16)
	}

	function ct(e, t, r, n) {
		return n <= 0 ? e = t = r = 0 / 0 : r <= 0 || r >= 1 ? e = t = 0 / 0 : t <= 0 && (e = 0 / 0), new ci(e, t, r, n)
	}

	function cr(e) {
		if (e instanceof ci) return new ci(e.h, e.s, e.l, e.opacity);
		if (e instanceof uB || (e = u0(e)), !e) return new ci;
		if (e instanceof ci) return e;
		var t = (e = e.rgb()).r / 255,
			r = e.g / 255,
			n = e.b / 255,
			i = Math.min(t, r, n),
			a = Math.max(t, r, n),
			o = 0 / 0,
			l = a - i,
			u = (a + i) / 2;
		return l ? (o = t === a ? (r - n) / l + (r < n) * 6 : r === a ? (n - t) / l + 2 : (t - r) / l + 4, l /= u < .5 ? a + i : 2 - a - i, o *= 60) : l = u > 0 && u < 1 ? 0 : o, new ci(o, l, u, e.opacity)
	}

	function cn(e, t, r, n) {
		return 1 == arguments.length ? cr(e) : new ci(e, t, r, null == n ? 1 : n)
	}

	function ci(e, t, r, n) {
		this.h = +e, this.s = +t, this.l = +r, this.opacity = +n
	}

	function ca(e) {
		return (e = (e || 0) % 360) < 0 ? e + 360 : e
	}

	function co(e) {
		return Math.max(0, Math.min(1, e || 0))
	}

	function cl(e, t, r) {
		return (e < 60 ? t + (r - t) * e / 60 : e < 180 ? r : e < 240 ? t + (r - t) * (240 - e) / 60 : t) * 255
	}
	uL(uB, u0, {
		copy(e) {
			return Object.assign(new this.constructor, this, e)
		},
		displayable() {
			return this.rgb().displayable()
		},
		hex: uQ,
		formatHex: uQ,
		formatHex8: function() {
			return this.rgb().formatHex8()
		},
		formatHsl: function() {
			return cr(this).formatHsl()
		},
		formatRgb: uJ,
		toString: uJ
	}), uL(u6, u5, uR(uB, {
		brighter(e) {
			return e = null == e ? u$ : Math.pow(u$, e), new u6(this.r * e, this.g * e, this.b * e, this.opacity)
		},
		darker(e) {
			return e = null == e ? .7 : Math.pow(.7, e), new u6(this.r * e, this.g * e, this.b * e, this.opacity)
		},
		rgb() {
			return this
		},
		clamp() {
			return new u6(u9(this.r), u9(this.g), u9(this.b), u7(this.opacity))
		},
		displayable() {
			return -.5 <= this.r && this.r < 255.5 && -.5 <= this.g && this.g < 255.5 && -.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1
		},
		hex: u4,
		formatHex: u4,
		formatHex8: function() {
			return `#${ce(this.r)}${ce(this.g)}${ce(this.b)}${ce((isNaN(this.opacity)?1:this.opacity)*255)}`
		},
		formatRgb: u8,
		toString: u8
	})), uL(ci, cn, uR(uB, {
		brighter(e) {
			return e = null == e ? u$ : Math.pow(u$, e), new ci(this.h, this.s, this.l * e, this.opacity)
		},
		darker(e) {
			return e = null == e ? .7 : Math.pow(.7, e), new ci(this.h, this.s, this.l * e, this.opacity)
		},
		rgb() {
			var e = this.h % 360 + (this.h < 0) * 360,
				t = isNaN(e) || isNaN(this.s) ? 0 : this.s,
				r = this.l,
				n = r + (r < .5 ? r : 1 - r) * t,
				i = 2 * r - n;
			return new u6(cl(e >= 240 ? e - 240 : e + 120, i, n), cl(e, i, n), cl(e < 120 ? e + 240 : e - 120, i, n), this.opacity)
		},
		clamp() {
			return new ci(ca(this.h), co(this.s), co(this.l), u7(this.opacity))
		},
		displayable() {
			return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1
		},
		formatHsl() {
			let e = u7(this.opacity);
			return `${1===e?"hsl(":"hsla("}${ca(this.h)}, ${100*co(this.s)}%, ${100*co(this.l)}%${1===e?")":`, ${e})`}`
		}
	}));
	let cu = Math.PI / 180,
		cc = 180 / Math.PI,
		cs = 4 / 29,
		cf = 6 / 29,
		ch = 6 / 29 * 3 * (6 / 29),
		cd = 6 / 29 * (6 / 29) * (6 / 29);

	function cp(e) {
		if (e instanceof cy) return new cy(e.l, e.a, e.b, e.opacity);
		if (e instanceof cw) return cO(e);
		e instanceof u6 || (e = u3(e));
		var t, r, n = cb(e.r),
			i = cb(e.g),
			a = cb(e.b),
			o = cv((.2225045 * n + .7168786 * i + .0606169 * a) / 1);
		return n === i && i === a ? t = r = o : (t = cv((.4360747 * n + .3850649 * i + .1430804 * a) / .96422), r = cv((.0139322 * n + .0971045 * i + .7141733 * a) / .82521)), new cy(116 * o - 16, 500 * (t - o), 200 * (o - r), e.opacity)
	}

	function cy(e, t, r, n) {
		this.l = +e, this.a = +t, this.b = +r, this.opacity = +n
	}

	function cv(e) {
		return e > cd ? Math.pow(e, 1 / 3) : e / ch + cs
	}

	function cm(e) {
		return e > cf ? e * e * e : ch * (e - cs)
	}

	function cg(e) {
		return 255 * (e <= .0031308 ? 12.92 * e : 1.055 * Math.pow(e, 1 / 2.4) - .055)
	}

	function cb(e) {
		return (e /= 255) <= .04045 ? e / 12.92 : Math.pow((e + .055) / 1.055, 2.4)
	}

	function cx(e, t, r, n) {
		return 1 == arguments.length ? function(e) {
			if (e instanceof cw) return new cw(e.h, e.c, e.l, e.opacity);
			if (e instanceof cy || (e = cp(e)), 0 === e.a && 0 === e.b) return new cw(0 / 0, 0 < e.l && e.l < 100 ? 0 : 0 / 0, e.l, e.opacity);
			var t = Math.atan2(e.b, e.a) * cc;
			return new cw(t < 0 ? t + 360 : t, Math.sqrt(e.a * e.a + e.b * e.b), e.l, e.opacity)
		}(e) : new cw(e, t, r, null == n ? 1 : n)
	}

	function cw(e, t, r, n) {
		this.h = +e, this.c = +t, this.l = +r, this.opacity = +n
	}

	function cO(e) {
		if (isNaN(e.h)) return new cy(e.l, 0, 0, e.opacity);
		var t = e.h * cu;
		return new cy(e.l, Math.cos(t) * e.c, Math.sin(t) * e.c, e.opacity)
	}
	uL(cy, function(e, t, r, n) {
		return 1 == arguments.length ? cp(e) : new cy(e, t, r, null == n ? 1 : n)
	}, uR(uB, {
		brighter(e) {
			return new cy(this.l + 18 * (null == e ? 1 : e), this.a, this.b, this.opacity)
		},
		darker(e) {
			return new cy(this.l - 18 * (null == e ? 1 : e), this.a, this.b, this.opacity)
		},
		rgb() {
			var e = (this.l + 16) / 116,
				t = isNaN(this.a) ? e : e + this.a / 500,
				r = isNaN(this.b) ? e : e - this.b / 200;
			return t = .96422 * cm(t), new u6(cg(3.1338561 * t - 1.6168667 * (e = +cm(e)) - .4906146 * (r = .82521 * cm(r))), cg(-.9787684 * t + 1.9161415 * e + .033454 * r), cg(.0719453 * t - .2289914 * e + 1.4052427 * r), this.opacity)
		}
	})), uL(cw, cx, uR(uB, {
		brighter(e) {
			return new cw(this.h, this.c, this.l + 18 * (null == e ? 1 : e), this.opacity)
		},
		darker(e) {
			return new cw(this.h, this.c, this.l - 18 * (null == e ? 1 : e), this.opacity)
		},
		rgb() {
			return cO(this).rgb()
		}
	}));
	var c_ = -1.78277 * .29227 - .1347134789;

	function cA(e, t, r, n) {
		return 1 == arguments.length ? function(e) {
			if (e instanceof cS) return new cS(e.h, e.s, e.l, e.opacity);
			e instanceof u6 || (e = u3(e));
			var t = e.r / 255,
				r = e.g / 255,
				n = e.b / 255,
				i = (c_ * n + -1.7884503806 * t - 3.5172982438 * r) / (c_ + -1.7884503806 - 3.5172982438),
				a = n - i,
				o = -((1.97294 * (r - i) - -.29227 * a) / .90649),
				l = Math.sqrt(o * o + a * a) / (1.97294 * i * (1 - i)),
				u = l ? Math.atan2(o, a) * cc - 120 : 0 / 0;
			return new cS(u < 0 ? u + 360 : u, l, i, e.opacity)
		}(e) : new cS(e, t, r, null == n ? 1 : n)
	}

	function cS(e, t, r, n) {
		this.h = +e, this.s = +t, this.l = +r, this.opacity = +n
	}

	function cj(e, t, r, n, i) {
		var a = e * e,
			o = a * e;
		return ((1 - 3 * e + 3 * a - o) * t + (4 - 6 * a + 3 * o) * r + (1 + 3 * e + 3 * a - 3 * o) * n + o * i) / 6
	}
	uL(cS, cA, uR(uB, {
		brighter(e) {
			return e = null == e ? u$ : Math.pow(u$, e), new cS(this.h, this.s, this.l * e, this.opacity)
		},
		darker(e) {
			return e = null == e ? .7 : Math.pow(.7, e), new cS(this.h, this.s, this.l * e, this.opacity)
		},
		rgb() {
			var e = isNaN(this.h) ? 0 : (this.h + 120) * cu,
				t = +this.l,
				r = isNaN(this.s) ? 0 : this.s * t * (1 - t),
				n = Math.cos(e),
				i = Math.sin(e);
			return new u6(255 * (t + r * (-.14861 * n + 1.78277 * i)), 255 * (t + r * (-.29227 * n + -.90649 * i)), 255 * (t + 1.97294 * n * r), this.opacity)
		}
	}));
	var cE = e => () => e;

	function ck(e, t) {
		return function(r) {
			return e + r * t
		}
	}

	function cP(e, t) {
		var r = t - e;
		return r ? ck(e, r > 180 || r < -180 ? r - 360 * Math.round(r / 360) : r) : cE(isNaN(e) ? t : e)
	}

	function cM(e, t) {
		var r = t - e;
		return r ? ck(e, r) : cE(isNaN(e) ? t : e)
	}
	var cI = function e(t) {
		var r, n = 1 == (r = +t) ? cM : function(e, t) {
			var n, i, a;
			return t - e ? (n = e, i = t, n = Math.pow(n, a = r), i = Math.pow(i, a) - n, a = 1 / a, function(e) {
				return Math.pow(n + e * i, a)
			}) : cE(isNaN(e) ? t : e)
		};

		function i(e, t) {
			var r = n((e = u5(e)).r, (t = u5(t)).r),
				i = n(e.g, t.g),
				a = n(e.b, t.b),
				o = cM(e.opacity, t.opacity);
			return function(t) {
				return e.r = r(t), e.g = i(t), e.b = a(t), e.opacity = o(t), e + ""
			}
		}
		return i.gamma = e, i
	}(1);

	function cC(e) {
		return function(t) {
			var r, n, i = t.length,
				a = Array(i),
				o = Array(i),
				l = Array(i);
			for (r = 0; r < i; ++r) n = u5(t[r]), a[r] = n.r || 0, o[r] = n.g || 0, l[r] = n.b || 0;
			return a = e(a), o = e(o), l = e(l), n.opacity = 1,
				function(e) {
					return n.r = a(e), n.g = o(e), n.b = l(e), n + ""
				}
		}
	}

	function cT(e, t) {
		return e *= 1, t *= 1,
			function(r) {
				return e * (1 - r) + t * r
			}
	}
	cC(function(e) {
		var t = e.length - 1;
		return function(r) {
			var n = r <= 0 ? r = 0 : r >= 1 ? (r = 1, t - 1) : Math.floor(r * t),
				i = e[n],
				a = e[n + 1],
				o = n > 0 ? e[n - 1] : 2 * i - a,
				l = n < t - 1 ? e[n + 2] : 2 * a - i;
			return cj((r - n / t) * t, o, i, a, l)
		}
	}), cC(function(e) {
		var t = e.length;
		return function(r) {
			var n = Math.floor(((r %= 1) < 0 ? ++r : r) * t),
				i = e[(n + t - 1) % t],
				a = e[n % t],
				o = e[(n + 1) % t],
				l = e[(n + 2) % t];
			return cj((r - n / t) * t, i, a, o, l)
		}
	});
	var cD = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,
		cN = RegExp(cD.source, "g");

	function cz(e, t) {
		var r, n, i = typeof t;
		return null == t || "boolean" === i ? cE(t) : ("number" === i ? cT : "string" === i ? (n = u0(t)) ? (t = n, cI) : function(e, t) {
			var r, n, i, a, o, l = cD.lastIndex = cN.lastIndex = 0,
				u = -1,
				c = [],
				s = [];
			for (e += "", t += "";
				(i = cD.exec(e)) && (a = cN.exec(t));)(o = a.index) > l && (o = t.slice(l, o), c[u] ? c[u] += o : c[++u] = o), (i = i[0]) === (a = a[0]) ? c[u] ? c[u] += a : c[++u] = a : (c[++u] = null, s.push({
				i: u,
				x: cT(i, a)
			})), l = cN.lastIndex;
			return l < t.length && (o = t.slice(l), c[u] ? c[u] += o : c[++u] = o), c.length < 2 ? s[0] ? (r = s[0].x, function(e) {
				return r(e) + ""
			}) : (n = t, function() {
				return n
			}) : (t = s.length, function(e) {
				for (var r, n = 0; n < t; ++n) c[(r = s[n]).i] = r.x(e);
				return c.join("")
			})
		} : t instanceof u0 ? cI : t instanceof Date ? function(e, t) {
			var r = new Date;
			return e *= 1, t *= 1,
				function(n) {
					return r.setTime(e * (1 - n) + t * n), r
				}
		} : !ArrayBuffer.isView(r = t) || r instanceof DataView ? Array.isArray(t) ? function(e, t) {
			var r, n = t ? t.length : 0,
				i = e ? Math.min(n, e.length) : 0,
				a = Array(i),
				o = Array(n);
			for (r = 0; r < i; ++r) a[r] = cz(e[r], t[r]);
			for (; r < n; ++r) o[r] = t[r];
			return function(e) {
				for (r = 0; r < i; ++r) o[r] = a[r](e);
				return o
			}
		} : "function" != typeof t.valueOf && "function" != typeof t.toString || isNaN(t) ? function(e, t) {
			var r, n = {},
				i = {};
			for (r in (null === e || "object" != typeof e) && (e = {}), (null === t || "object" != typeof t) && (t = {}), t) r in e ? n[r] = cz(e[r], t[r]) : i[r] = t[r];
			return function(e) {
				for (r in n) i[r] = n[r](e);
				return i
			}
		} : cT : function(e, t) {
			t || (t = []);
			var r, n = e ? Math.min(t.length, e.length) : 0,
				i = t.slice();
			return function(a) {
				for (r = 0; r < n; ++r) i[r] = e[r] * (1 - a) + t[r] * a;
				return i
			}
		})(e, t)
	}

	function cL(e, t) {
		return e *= 1, t *= 1,
			function(r) {
				return Math.round(e * (1 - r) + t * r)
			}
	}
	var cR = 180 / Math.PI,
		cB = {
			translateX: 0,
			translateY: 0,
			rotate: 0,
			skewX: 0,
			scaleX: 1,
			scaleY: 1
		};

	function c$(e, t, r, n, i, a) {
		var o, l, u;
		return (o = Math.sqrt(e * e + t * t)) && (e /= o, t /= o), (u = e * r + t * n) && (r -= e * u, n -= t * u), (l = Math.sqrt(r * r + n * n)) && (r /= l, n /= l, u /= l), e * n < t * r && (e = -e, t = -t, u = -u, o = -o), {
			translateX: i,
			translateY: a,
			rotate: Math.atan2(t, e) * cR,
			skewX: Math.atan(u) * cR,
			scaleX: o,
			scaleY: l
		}
	}

	function cU(e, t, r, n) {
		function i(e) {
			return e.length ? e.pop() + " " : ""
		}
		return function(a, o) {
			var l, u, c, s, f = [],
				h = [];
			return a = e(a), o = e(o), ! function(e, n, i, a, o, l) {
					if (e !== i || n !== a) {
						var u = o.push("translate(", null, t, null, r);
						l.push({
							i: u - 4,
							x: cT(e, i)
						}, {
							i: u - 2,
							x: cT(n, a)
						})
					} else(i || a) && o.push("translate(" + i + t + a + r)
				}(a.translateX, a.translateY, o.translateX, o.translateY, f, h), l = a.rotate, u = o.rotate, l !== u ? (l - u > 180 ? u += 360 : u - l > 180 && (l += 360), h.push({
					i: f.push(i(f) + "rotate(", null, n) - 2,
					x: cT(l, u)
				})) : u && f.push(i(f) + "rotate(" + u + n), c = a.skewX, s = o.skewX, c !== s ? h.push({
					i: f.push(i(f) + "skewX(", null, n) - 2,
					x: cT(c, s)
				}) : s && f.push(i(f) + "skewX(" + s + n), ! function(e, t, r, n, a, o) {
					if (e !== r || t !== n) {
						var l = a.push(i(a) + "scale(", null, ",", null, ")");
						o.push({
							i: l - 4,
							x: cT(e, r)
						}, {
							i: l - 2,
							x: cT(t, n)
						})
					} else(1 !== r || 1 !== n) && a.push(i(a) + "scale(" + r + "," + n + ")")
				}(a.scaleX, a.scaleY, o.scaleX, o.scaleY, f, h), a = o = null,
				function(e) {
					for (var t, r = -1, n = h.length; ++r < n;) f[(t = h[r]).i] = t.x(e);
					return f.join("")
				}
		}
	}

	function cF(e) {
		return ((e = Math.exp(e)) + 1 / e) / 2
	}

	function cK(e) {
		return function(t, r) {
			var n = e((t = cn(t)).h, (r = cn(r)).h),
				i = cM(t.s, r.s),
				a = cM(t.l, r.l),
				o = cM(t.opacity, r.opacity);
			return function(e) {
				return t.h = n(e), t.s = i(e), t.l = a(e), t.opacity = o(e), t + ""
			}
		}
	}

	function cH(e) {
		return function(t, r) {
			var n = e((t = cx(t)).h, (r = cx(r)).h),
				i = cM(t.c, r.c),
				a = cM(t.l, r.l),
				o = cM(t.opacity, r.opacity);
			return function(e) {
				return t.h = n(e), t.c = i(e), t.l = a(e), t.opacity = o(e), t + ""
			}
		}
	}

	function cq(e) {
		return function t(r) {
			function n(t, n) {
				var i = e((t = cA(t)).h, (n = cA(n)).h),
					a = cM(t.s, n.s),
					o = cM(t.l, n.l),
					l = cM(t.opacity, n.opacity);
				return function(e) {
					return t.h = i(e), t.s = a(e), t.l = o(Math.pow(e, r)), t.opacity = l(e), t + ""
				}
			}
			return r *= 1, n.gamma = t, n
		}(1)
	}

	function cW(e, t) {
		if (!isFinite(e) || 0 === e) return null;
		var r = (e = t ? e.toExponential(t - 1) : e.toExponential()).indexOf("e"),
			n = e.slice(0, r);
		return [n.length > 1 ? n[0] + n.slice(2) : n, +e.slice(r + 1)]
	}

	function cV(e) {
		return (e = cW(Math.abs(e))) ? e[1] : 0 / 0
	}
	cU(function(e) {
		let t = new("function" == typeof DOMMatrix ? DOMMatrix : WebKitCSSMatrix)(e + "");
		return t.isIdentity ? cB : c$(t.a, t.b, t.c, t.d, t.e, t.f)
	}, "px, ", "px)", "deg)"), cU(function(e) {
		return null == e ? cB : (v || (v = document.createElementNS("http://www.w3.org/2000/svg", "g")), v.setAttribute("transform", e), e = v.transform.baseVal.consolidate()) ? c$((e = e.matrix).a, e.b, e.c, e.d, e.e, e.f) : cB
	}, ", ", ")", ")"), ! function e(t, r, n) {
		function i(e, i) {
			var a, o, l = e[0],
				u = e[1],
				c = e[2],
				s = i[0],
				f = i[1],
				h = i[2],
				d = s - l,
				p = f - u,
				y = d * d + p * p;
			if (y < 1e-12) o = Math.log(h / c) / t, a = function(e) {
				return [l + e * d, u + e * p, c * Math.exp(t * e * o)]
			};
			else {
				var v = Math.sqrt(y),
					m = (h * h - c * c + n * y) / (2 * c * r * v),
					g = (h * h - c * c - n * y) / (2 * h * r * v),
					b = Math.log(Math.sqrt(m * m + 1) - m);
				o = (Math.log(Math.sqrt(g * g + 1) - g) - b) / t, a = function(e) {
					var n, i, a = e * o,
						s = cF(b),
						f = c / (r * v) * (s * (((n = Math.exp(2 * (n = t * a + b))) - 1) / (n + 1)) - ((i = Math.exp(i = b)) - 1 / i) / 2);
					return [l + f * d, u + f * p, c * s / cF(t * a + b)]
				}
			}
			return a.duration = 1e3 * Math.abs(o) * t / Math.SQRT2, a
		}
		return i.rho = function(t) {
			var r = Math.max(.001, +t),
				n = r * r;
			return e(r, n, n * n)
		}, i
	}(Math.SQRT2, 2, 4), cK(cP), cK(cM), cH(cP), cH(cM), cq(cP), cq(cM);
	var cY = /^(?:(.)?([<>=^]))?([+\-( ])?([$#])?(0)?(\d+)?(,)?(\.\d+)?(~)?([a-z%])?$/i;

	function cX(e) {
		var t;
		if (!(t = cY.exec(e))) throw Error("invalid format: " + e);
		return new cG({
			fill: t[1],
			align: t[2],
			sign: t[3],
			symbol: t[4],
			zero: t[5],
			width: t[6],
			comma: t[7],
			precision: t[8] && t[8].slice(1),
			trim: t[9],
			type: t[10]
		})
	}

	function cG(e) {
		this.fill = void 0 === e.fill ? " " : e.fill + "", this.align = void 0 === e.align ? ">" : e.align + "", this.sign = void 0 === e.sign ? "-" : e.sign + "", this.symbol = void 0 === e.symbol ? "" : e.symbol + "", this.zero = !!e.zero, this.width = void 0 === e.width ? void 0 : +e.width, this.comma = !!e.comma, this.precision = void 0 === e.precision ? void 0 : +e.precision, this.trim = !!e.trim, this.type = void 0 === e.type ? "" : e.type + ""
	}

	function cZ(e, t) {
		var r = cW(e, t);
		if (!r) return e + "";
		var n = r[0],
			i = r[1];
		return i < 0 ? "0." + Array(-i).join("0") + n : n.length > i + 1 ? n.slice(0, i + 1) + "." + n.slice(i + 1) : n + Array(i - n.length + 2).join("0")
	}
	cX.prototype = cG.prototype, cG.prototype.toString = function() {
		return this.fill + this.align + this.sign + this.symbol + (this.zero ? "0" : "") + (void 0 === this.width ? "" : Math.max(1, 0 | this.width)) + (this.comma ? "," : "") + (void 0 === this.precision ? "" : "." + Math.max(0, 0 | this.precision)) + (this.trim ? "~" : "") + this.type
	};
	var cQ = {
		"%": (e, t) => (100 * e).toFixed(t),
		b: e => Math.round(e).toString(2),
		c: e => e + "",
		d: function(e) {
			return Math.abs(e = Math.round(e)) >= 1e21 ? e.toLocaleString("en").replace(/,/g, "") : e.toString(10)
		},
		e: (e, t) => e.toExponential(t),
		f: (e, t) => e.toFixed(t),
		g: (e, t) => e.toPrecision(t),
		o: e => Math.round(e).toString(8),
		p: (e, t) => cZ(100 * e, t),
		r: cZ,
		s: function(e, t) {
			var r = cW(e, t);
			if (!r) return m = void 0, e.toPrecision(t);
			var n = r[0],
				i = r[1],
				a = i - (m = 3 * Math.max(-8, Math.min(8, Math.floor(i / 3)))) + 1,
				o = n.length;
			return a === o ? n : a > o ? n + Array(a - o + 1).join("0") : a > 0 ? n.slice(0, a) + "." + n.slice(a) : "0." + Array(1 - a).join("0") + cW(e, Math.max(0, t + a - 1))[0]
		},
		X: e => Math.round(e).toString(16).toUpperCase(),
		x: e => Math.round(e).toString(16)
	};

	function cJ(e) {
		return e
	}
	var c0 = Array.prototype.map,
		c1 = ["y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
	b = (g = function(e) {
		var t, r, n, i = void 0 === e.grouping || void 0 === e.thousands ? cJ : (t = c0.call(e.grouping, Number), r = e.thousands + "", function(e, n) {
				for (var i = e.length, a = [], o = 0, l = t[0], u = 0; i > 0 && l > 0 && (u + l + 1 > n && (l = Math.max(1, n - u)), a.push(e.substring(i -= l, i + l)), !((u += l + 1) > n));) l = t[o = (o + 1) % t.length];
				return a.reverse().join(r)
			}),
			a = void 0 === e.currency ? "" : e.currency[0] + "",
			o = void 0 === e.currency ? "" : e.currency[1] + "",
			l = void 0 === e.decimal ? "." : e.decimal + "",
			u = void 0 === e.numerals ? cJ : (n = c0.call(e.numerals, String), function(e) {
				return e.replace(/[0-9]/g, function(e) {
					return n[+e]
				})
			}),
			c = void 0 === e.percent ? "%" : e.percent + "",
			s = void 0 === e.minus ? "−" : e.minus + "",
			f = void 0 === e.nan ? "NaN" : e.nan + "";

		function h(e, t) {
			var r = (e = cX(e)).fill,
				n = e.align,
				h = e.sign,
				d = e.symbol,
				p = e.zero,
				y = e.width,
				v = e.comma,
				g = e.precision,
				b = e.trim,
				x = e.type;
			"n" === x ? (v = !0, x = "g") : cQ[x] || (void 0 === g && (g = 12), b = !0, x = "g"), (p || "0" === r && "=" === n) && (p = !0, r = "0", n = "=");
			var w = (t && void 0 !== t.prefix ? t.prefix : "") + ("$" === d ? a : "#" === d && /[boxX]/.test(x) ? "0" + x.toLowerCase() : ""),
				O = ("$" === d ? o : /[%p]/.test(x) ? c : "") + (t && void 0 !== t.suffix ? t.suffix : ""),
				_ = cQ[x],
				A = /[defgprs%]/.test(x);

			function S(e) {
				var t, a, o, c = w,
					d = O;
				if ("c" === x) d = _(e) + d, e = "";
				else {
					var S = (e *= 1) < 0 || 1 / e < 0;
					if (e = isNaN(e) ? f : _(Math.abs(e), g), b && (e = function(e) {
							e: for (var t, r = e.length, n = 1, i = -1; n < r; ++n) switch (e[n]) {
								case ".":
									i = t = n;
									break;
								case "0":
									0 === i && (i = n), t = n;
									break;
								default:
									if (!+e[n]) break e;
									i > 0 && (i = 0)
							}
							return i > 0 ? e.slice(0, i) + e.slice(t + 1) : e
						}(e)), S && 0 == +e && "+" !== h && (S = !1), c = (S ? "(" === h ? h : s : "-" === h || "(" === h ? "" : h) + c, d = ("s" !== x || isNaN(e) || void 0 === m ? "" : c1[8 + m / 3]) + d + (S && "(" === h ? ")" : ""), A) {
						for (t = -1, a = e.length; ++t < a;)
							if (48 > (o = e.charCodeAt(t)) || o > 57) {
								d = (46 === o ? l + e.slice(t + 1) : e.slice(t)) + d, e = e.slice(0, t);
								break
							}
					}
				}
				v && !p && (e = i(e, 1 / 0));
				var j = c.length + e.length + d.length,
					E = j < y ? Array(y - j + 1).join(r) : "";
				switch (v && p && (e = i(E + e, E.length ? y - d.length : 1 / 0), E = ""), n) {
					case "<":
						e = c + e + d + E;
						break;
					case "=":
						e = c + E + e + d;
						break;
					case "^":
						e = E.slice(0, j = E.length >> 1) + c + e + d + E.slice(j);
						break;
					default:
						e = E + c + e + d
				}
				return u(e)
			}
			return g = void 0 === g ? 6 : /[gprs]/.test(x) ? Math.max(1, Math.min(21, g)) : Math.max(0, Math.min(20, g)), S.toString = function() {
				return e + ""
			}, S
		}
		return {
			format: h,
			formatPrefix: function(e, t) {
				var r = 3 * Math.max(-8, Math.min(8, Math.floor(cV(t) / 3))),
					n = Math.pow(10, -r),
					i = h(((e = cX(e)).type = "f", e), {
						suffix: c1[8 + r / 3]
					});
				return function(e) {
					return i(n * e)
				}
			}
		}
	}({
		thousands: ",",
		grouping: [3],
		currency: ["$", ""]
	})).format, x = g.formatPrefix;
	let c2 = new Date,
		c3 = new Date;

	function c5(e, t, r, n) {
		function i(t) {
			return e(t = 0 == arguments.length ? new Date : new Date(+t)), t
		}
		return i.floor = t => (e(t = new Date(+t)), t), i.ceil = r => (e(r = new Date(r - 1)), t(r, 1), e(r), r), i.round = e => {
			let t = i(e),
				r = i.ceil(e);
			return e - t < r - e ? t : r
		}, i.offset = (e, r) => (t(e = new Date(+e), null == r ? 1 : Math.floor(r)), e), i.range = (r, n, a) => {
			let o, l = [];
			if (r = i.ceil(r), a = null == a ? 1 : Math.floor(a), !(r < n) || !(a > 0)) return l;
			do l.push(o = new Date(+r)), t(r, a), e(r); while (o < r && r < n) return l
		}, i.filter = r => c5(t => {
			if (t >= t)
				for (; e(t), !r(t);) t.setTime(t - 1)
		}, (e, n) => {
			if (e >= e)
				if (n < 0)
					for (; ++n <= 0;)
						for (; t(e, -1), !r(e););
				else
					for (; --n >= 0;)
						for (; t(e, 1), !r(e););
		}), r && (i.count = (t, n) => (c2.setTime(+t), c3.setTime(+n), e(c2), e(c3), Math.floor(r(c2, c3))), i.every = e => isFinite(e = Math.floor(e)) && e > 0 ? e > 1 ? i.filter(n ? t => n(t) % e == 0 : t => i.count(0, t) % e == 0) : i : null), i
	}
	let c6 = c5(() => {}, (e, t) => {
		e.setTime(+e + t)
	}, (e, t) => t - e);
	c6.every = e => isFinite(e = Math.floor(e)) && e > 0 ? e > 1 ? c5(t => {
		t.setTime(Math.floor(t / e) * e)
	}, (t, r) => {
		t.setTime(+t + r * e)
	}, (t, r) => (r - t) / e) : c6 : null, c6.range;
	let c4 = c5(e => {
		e.setTime(e - e.getMilliseconds())
	}, (e, t) => {
		e.setTime(+e + 1e3 * t)
	}, (e, t) => (t - e) / 1e3, e => e.getUTCSeconds());
	c4.range;
	let c8 = c5(e => {
		e.setTime(e - e.getMilliseconds() - 1e3 * e.getSeconds())
	}, (e, t) => {
		e.setTime(+e + 6e4 * t)
	}, (e, t) => (t - e) / 6e4, e => e.getMinutes());
	c8.range;
	let c7 = c5(e => {
		e.setUTCSeconds(0, 0)
	}, (e, t) => {
		e.setTime(+e + 6e4 * t)
	}, (e, t) => (t - e) / 6e4, e => e.getUTCMinutes());
	c7.range;
	let c9 = c5(e => {
		e.setTime(e - e.getMilliseconds() - 1e3 * e.getSeconds() - 6e4 * e.getMinutes())
	}, (e, t) => {
		e.setTime(+e + 36e5 * t)
	}, (e, t) => (t - e) / 36e5, e => e.getHours());
	c9.range;
	let se = c5(e => {
		e.setUTCMinutes(0, 0, 0)
	}, (e, t) => {
		e.setTime(+e + 36e5 * t)
	}, (e, t) => (t - e) / 36e5, e => e.getUTCHours());
	se.range;
	let st = c5(e => e.setHours(0, 0, 0, 0), (e, t) => e.setDate(e.getDate() + t), (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4) / 864e5, e => e.getDate() - 1);
	st.range;
	let sr = c5(e => {
		e.setUTCHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t)
	}, (e, t) => (t - e) / 864e5, e => e.getUTCDate() - 1);
	sr.range;
	let sn = c5(e => {
		e.setUTCHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setUTCDate(e.getUTCDate() + t)
	}, (e, t) => (t - e) / 864e5, e => Math.floor(e / 864e5));

	function si(e) {
		return c5(t => {
			t.setDate(t.getDate() - (t.getDay() + 7 - e) % 7), t.setHours(0, 0, 0, 0)
		}, (e, t) => {
			e.setDate(e.getDate() + 7 * t)
		}, (e, t) => (t - e - (t.getTimezoneOffset() - e.getTimezoneOffset()) * 6e4) / 6048e5)
	}
	sn.range;
	let sa = si(0),
		so = si(1),
		sl = si(2),
		su = si(3),
		sc = si(4),
		ss = si(5),
		sf = si(6);

	function sh(e) {
		return c5(t => {
			t.setUTCDate(t.getUTCDate() - (t.getUTCDay() + 7 - e) % 7), t.setUTCHours(0, 0, 0, 0)
		}, (e, t) => {
			e.setUTCDate(e.getUTCDate() + 7 * t)
		}, (e, t) => (t - e) / 6048e5)
	}
	sa.range, so.range, sl.range, su.range, sc.range, ss.range, sf.range;
	let sd = sh(0),
		sp = sh(1),
		sy = sh(2),
		sv = sh(3),
		sm = sh(4),
		sg = sh(5),
		sb = sh(6);
	sd.range, sp.range, sy.range, sv.range, sm.range, sg.range, sb.range;
	let sx = c5(e => {
		e.setDate(1), e.setHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setMonth(e.getMonth() + t)
	}, (e, t) => t.getMonth() - e.getMonth() + (t.getFullYear() - e.getFullYear()) * 12, e => e.getMonth());
	sx.range;
	let sw = c5(e => {
		e.setUTCDate(1), e.setUTCHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setUTCMonth(e.getUTCMonth() + t)
	}, (e, t) => t.getUTCMonth() - e.getUTCMonth() + (t.getUTCFullYear() - e.getUTCFullYear()) * 12, e => e.getUTCMonth());
	sw.range;
	let sO = c5(e => {
		e.setMonth(0, 1), e.setHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setFullYear(e.getFullYear() + t)
	}, (e, t) => t.getFullYear() - e.getFullYear(), e => e.getFullYear());
	sO.every = e => isFinite(e = Math.floor(e)) && e > 0 ? c5(t => {
		t.setFullYear(Math.floor(t.getFullYear() / e) * e), t.setMonth(0, 1), t.setHours(0, 0, 0, 0)
	}, (t, r) => {
		t.setFullYear(t.getFullYear() + r * e)
	}) : null, sO.range;
	let s_ = c5(e => {
		e.setUTCMonth(0, 1), e.setUTCHours(0, 0, 0, 0)
	}, (e, t) => {
		e.setUTCFullYear(e.getUTCFullYear() + t)
	}, (e, t) => t.getUTCFullYear() - e.getUTCFullYear(), e => e.getUTCFullYear());

	function sA(e, t, r, n, i, a) {
		let o = [
			[c4, 1, 1e3],
			[c4, 5, 5e3],
			[c4, 15, 15e3],
			[c4, 30, 3e4],
			[a, 1, 6e4],
			[a, 5, 3e5],
			[a, 15, 9e5],
			[a, 30, 18e5],
			[i, 1, 36e5],
			[i, 3, 108e5],
			[i, 6, 216e5],
			[i, 12, 432e5],
			[n, 1, 864e5],
			[n, 2, 1728e5],
			[r, 1, 6048e5],
			[t, 1, 2592e6],
			[t, 3, 7776e6],
			[e, 1, 31536e6]
		];

		function l(t, r, n) {
			let i = Math.abs(r - t) / n,
				a = up(([, , e]) => e).right(o, i);
			if (a === o.length) return e.every(uT(t / 31536e6, r / 31536e6, n));
			if (0 === a) return c6.every(Math.max(uT(t, r, n), 1));
			let [l, u] = o[i / o[a - 1][2] < o[a][2] / i ? a - 1 : a];
			return l.every(u)
		}
		return [function(e, t, r) {
			let n = t < e;
			n && ([e, t] = [t, e]);
			let i = r && "function" == typeof r.range ? r : l(e, t, r),
				a = i ? i.range(e, +t + 1) : [];
			return n ? a.reverse() : a
		}, l]
	}
	s_.every = e => isFinite(e = Math.floor(e)) && e > 0 ? c5(t => {
		t.setUTCFullYear(Math.floor(t.getUTCFullYear() / e) * e), t.setUTCMonth(0, 1), t.setUTCHours(0, 0, 0, 0)
	}, (t, r) => {
		t.setUTCFullYear(t.getUTCFullYear() + r * e)
	}) : null, s_.range;
	let [sS, sj] = sA(s_, sw, sd, sn, se, c7), [sE, sk] = sA(sO, sx, sa, st, c9, c8);

	function sP(e) {
		if (0 <= e.y && e.y < 100) {
			var t = new Date(-1, e.m, e.d, e.H, e.M, e.S, e.L);
			return t.setFullYear(e.y), t
		}
		return new Date(e.y, e.m, e.d, e.H, e.M, e.S, e.L)
	}

	function sM(e) {
		if (0 <= e.y && e.y < 100) {
			var t = new Date(Date.UTC(-1, e.m, e.d, e.H, e.M, e.S, e.L));
			return t.setUTCFullYear(e.y), t
		}
		return new Date(Date.UTC(e.y, e.m, e.d, e.H, e.M, e.S, e.L))
	}

	function sI(e, t, r) {
		return {
			y: e,
			m: t,
			d: r,
			H: 0,
			M: 0,
			S: 0,
			L: 0
		}
	}
	var sC = {
			"-": "",
			_: " ",
			0: "0"
		},
		sT = /^\s*\d+/,
		sD = /^%/,
		sN = /[\\^$*+?|[\]().{}]/g;

	function sz(e, t, r) {
		var n = e < 0 ? "-" : "",
			i = (n ? -e : e) + "",
			a = i.length;
		return n + (a < r ? Array(r - a + 1).join(t) + i : i)
	}

	function sL(e) {
		return e.replace(sN, "\\$&")
	}

	function sR(e) {
		return RegExp("^(?:" + e.map(sL).join("|") + ")", "i")
	}

	function sB(e) {
		return new Map(e.map((e, t) => [e.toLowerCase(), t]))
	}

	function s$(e, t, r) {
		var n = sT.exec(t.slice(r, r + 1));
		return n ? (e.w = +n[0], r + n[0].length) : -1
	}

	function sU(e, t, r) {
		var n = sT.exec(t.slice(r, r + 1));
		return n ? (e.u = +n[0], r + n[0].length) : -1
	}

	function sF(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.U = +n[0], r + n[0].length) : -1
	}

	function sK(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.V = +n[0], r + n[0].length) : -1
	}

	function sH(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.W = +n[0], r + n[0].length) : -1
	}

	function sq(e, t, r) {
		var n = sT.exec(t.slice(r, r + 4));
		return n ? (e.y = +n[0], r + n[0].length) : -1
	}

	function sW(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.y = +n[0] + (+n[0] > 68 ? 1900 : 2e3), r + n[0].length) : -1
	}

	function sV(e, t, r) {
		var n = /^(Z)|([+-]\d\d)(?::?(\d\d))?/.exec(t.slice(r, r + 6));
		return n ? (e.Z = n[1] ? 0 : -(n[2] + (n[3] || "00")), r + n[0].length) : -1
	}

	function sY(e, t, r) {
		var n = sT.exec(t.slice(r, r + 1));
		return n ? (e.q = 3 * n[0] - 3, r + n[0].length) : -1
	}

	function sX(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.m = n[0] - 1, r + n[0].length) : -1
	}

	function sG(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.d = +n[0], r + n[0].length) : -1
	}

	function sZ(e, t, r) {
		var n = sT.exec(t.slice(r, r + 3));
		return n ? (e.m = 0, e.d = +n[0], r + n[0].length) : -1
	}

	function sQ(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.H = +n[0], r + n[0].length) : -1
	}

	function sJ(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.M = +n[0], r + n[0].length) : -1
	}

	function s0(e, t, r) {
		var n = sT.exec(t.slice(r, r + 2));
		return n ? (e.S = +n[0], r + n[0].length) : -1
	}

	function s1(e, t, r) {
		var n = sT.exec(t.slice(r, r + 3));
		return n ? (e.L = +n[0], r + n[0].length) : -1
	}

	function s2(e, t, r) {
		var n = sT.exec(t.slice(r, r + 6));
		return n ? (e.L = Math.floor(n[0] / 1e3), r + n[0].length) : -1
	}

	function s3(e, t, r) {
		var n = sD.exec(t.slice(r, r + 1));
		return n ? r + n[0].length : -1
	}

	function s5(e, t, r) {
		var n = sT.exec(t.slice(r));
		return n ? (e.Q = +n[0], r + n[0].length) : -1
	}

	function s6(e, t, r) {
		var n = sT.exec(t.slice(r));
		return n ? (e.s = +n[0], r + n[0].length) : -1
	}

	function s4(e, t) {
		return sz(e.getDate(), t, 2)
	}

	function s8(e, t) {
		return sz(e.getHours(), t, 2)
	}

	function s7(e, t) {
		return sz(e.getHours() % 12 || 12, t, 2)
	}

	function s9(e, t) {
		return sz(1 + st.count(sO(e), e), t, 3)
	}

	function fe(e, t) {
		return sz(e.getMilliseconds(), t, 3)
	}

	function ft(e, t) {
		return fe(e, t) + "000"
	}

	function fr(e, t) {
		return sz(e.getMonth() + 1, t, 2)
	}

	function fn(e, t) {
		return sz(e.getMinutes(), t, 2)
	}

	function fi(e, t) {
		return sz(e.getSeconds(), t, 2)
	}

	function fa(e) {
		var t = e.getDay();
		return 0 === t ? 7 : t
	}

	function fo(e, t) {
		return sz(sa.count(sO(e) - 1, e), t, 2)
	}

	function fl(e) {
		var t = e.getDay();
		return t >= 4 || 0 === t ? sc(e) : sc.ceil(e)
	}

	function fu(e, t) {
		return e = fl(e), sz(sc.count(sO(e), e) + (4 === sO(e).getDay()), t, 2)
	}

	function fc(e) {
		return e.getDay()
	}

	function fs(e, t) {
		return sz(so.count(sO(e) - 1, e), t, 2)
	}

	function ff(e, t) {
		return sz(e.getFullYear() % 100, t, 2)
	}

	function fh(e, t) {
		return sz((e = fl(e)).getFullYear() % 100, t, 2)
	}

	function fd(e, t) {
		return sz(e.getFullYear() % 1e4, t, 4)
	}

	function fp(e, t) {
		var r = e.getDay();
		return sz((e = r >= 4 || 0 === r ? sc(e) : sc.ceil(e)).getFullYear() % 1e4, t, 4)
	}

	function fy(e) {
		var t = e.getTimezoneOffset();
		return (t > 0 ? "-" : (t *= -1, "+")) + sz(t / 60 | 0, "0", 2) + sz(t % 60, "0", 2)
	}

	function fv(e, t) {
		return sz(e.getUTCDate(), t, 2)
	}

	function fm(e, t) {
		return sz(e.getUTCHours(), t, 2)
	}

	function fg(e, t) {
		return sz(e.getUTCHours() % 12 || 12, t, 2)
	}

	function fb(e, t) {
		return sz(1 + sr.count(s_(e), e), t, 3)
	}

	function fx(e, t) {
		return sz(e.getUTCMilliseconds(), t, 3)
	}

	function fw(e, t) {
		return fx(e, t) + "000"
	}

	function fO(e, t) {
		return sz(e.getUTCMonth() + 1, t, 2)
	}

	function f_(e, t) {
		return sz(e.getUTCMinutes(), t, 2)
	}

	function fA(e, t) {
		return sz(e.getUTCSeconds(), t, 2)
	}

	function fS(e) {
		var t = e.getUTCDay();
		return 0 === t ? 7 : t
	}

	function fj(e, t) {
		return sz(sd.count(s_(e) - 1, e), t, 2)
	}

	function fE(e) {
		var t = e.getUTCDay();
		return t >= 4 || 0 === t ? sm(e) : sm.ceil(e)
	}

	function fk(e, t) {
		return e = fE(e), sz(sm.count(s_(e), e) + (4 === s_(e).getUTCDay()), t, 2)
	}

	function fP(e) {
		return e.getUTCDay()
	}

	function fM(e, t) {
		return sz(sp.count(s_(e) - 1, e), t, 2)
	}

	function fI(e, t) {
		return sz(e.getUTCFullYear() % 100, t, 2)
	}

	function fC(e, t) {
		return sz((e = fE(e)).getUTCFullYear() % 100, t, 2)
	}

	function fT(e, t) {
		return sz(e.getUTCFullYear() % 1e4, t, 4)
	}

	function fD(e, t) {
		var r = e.getUTCDay();
		return sz((e = r >= 4 || 0 === r ? sm(e) : sm.ceil(e)).getUTCFullYear() % 1e4, t, 4)
	}

	function fN() {
		return "+0000"
	}

	function fz() {
		return "%"
	}

	function fL(e) {
		return +e
	}

	function fR(e) {
		return Math.floor(e / 1e3)
	}
	O = (w = function(e) {
		var t = e.dateTime,
			r = e.date,
			n = e.time,
			i = e.periods,
			a = e.days,
			o = e.shortDays,
			l = e.months,
			u = e.shortMonths,
			c = sR(i),
			s = sB(i),
			f = sR(a),
			h = sB(a),
			d = sR(o),
			p = sB(o),
			y = sR(l),
			v = sB(l),
			m = sR(u),
			g = sB(u),
			b = {
				a: function(e) {
					return o[e.getDay()]
				},
				A: function(e) {
					return a[e.getDay()]
				},
				b: function(e) {
					return u[e.getMonth()]
				},
				B: function(e) {
					return l[e.getMonth()]
				},
				c: null,
				d: s4,
				e: s4,
				f: ft,
				g: fh,
				G: fp,
				H: s8,
				I: s7,
				j: s9,
				L: fe,
				m: fr,
				M: fn,
				p: function(e) {
					return i[+(e.getHours() >= 12)]
				},
				q: function(e) {
					return 1 + ~~(e.getMonth() / 3)
				},
				Q: fL,
				s: fR,
				S: fi,
				u: fa,
				U: fo,
				V: fu,
				w: fc,
				W: fs,
				x: null,
				X: null,
				y: ff,
				Y: fd,
				Z: fy,
				"%": fz
			},
			x = {
				a: function(e) {
					return o[e.getUTCDay()]
				},
				A: function(e) {
					return a[e.getUTCDay()]
				},
				b: function(e) {
					return u[e.getUTCMonth()]
				},
				B: function(e) {
					return l[e.getUTCMonth()]
				},
				c: null,
				d: fv,
				e: fv,
				f: fw,
				g: fC,
				G: fD,
				H: fm,
				I: fg,
				j: fb,
				L: fx,
				m: fO,
				M: f_,
				p: function(e) {
					return i[+(e.getUTCHours() >= 12)]
				},
				q: function(e) {
					return 1 + ~~(e.getUTCMonth() / 3)
				},
				Q: fL,
				s: fR,
				S: fA,
				u: fS,
				U: fj,
				V: fk,
				w: fP,
				W: fM,
				x: null,
				X: null,
				y: fI,
				Y: fT,
				Z: fN,
				"%": fz
			},
			w = {
				a: function(e, t, r) {
					var n = d.exec(t.slice(r));
					return n ? (e.w = p.get(n[0].toLowerCase()), r + n[0].length) : -1
				},
				A: function(e, t, r) {
					var n = f.exec(t.slice(r));
					return n ? (e.w = h.get(n[0].toLowerCase()), r + n[0].length) : -1
				},
				b: function(e, t, r) {
					var n = m.exec(t.slice(r));
					return n ? (e.m = g.get(n[0].toLowerCase()), r + n[0].length) : -1
				},
				B: function(e, t, r) {
					var n = y.exec(t.slice(r));
					return n ? (e.m = v.get(n[0].toLowerCase()), r + n[0].length) : -1
				},
				c: function(e, r, n) {
					return A(e, t, r, n)
				},
				d: sG,
				e: sG,
				f: s2,
				g: sW,
				G: sq,
				H: sQ,
				I: sQ,
				j: sZ,
				L: s1,
				m: sX,
				M: sJ,
				p: function(e, t, r) {
					var n = c.exec(t.slice(r));
					return n ? (e.p = s.get(n[0].toLowerCase()), r + n[0].length) : -1
				},
				q: sY,
				Q: s5,
				s: s6,
				S: s0,
				u: sU,
				U: sF,
				V: sK,
				w: s$,
				W: sH,
				x: function(e, t, n) {
					return A(e, r, t, n)
				},
				X: function(e, t, r) {
					return A(e, n, t, r)
				},
				y: sW,
				Y: sq,
				Z: sV,
				"%": s3
			};

		function O(e, t) {
			return function(r) {
				var n, i, a, o = [],
					l = -1,
					u = 0,
					c = e.length;
				for (r instanceof Date || (r = new Date(+r)); ++l < c;) 37 === e.charCodeAt(l) && (o.push(e.slice(u, l)), null != (i = sC[n = e.charAt(++l)]) ? n = e.charAt(++l) : i = "e" === n ? " " : "0", (a = t[n]) && (n = a(r, i)), o.push(n), u = l + 1);
				return o.push(e.slice(u, l)), o.join("")
			}
		}

		function _(e, t) {
			return function(r) {
				var n, i, a = sI(1900, void 0, 1);
				if (A(a, e, r += "", 0) != r.length) return null;
				if ("Q" in a) return new Date(a.Q);
				if ("s" in a) return new Date(1e3 * a.s + ("L" in a ? a.L : 0));
				if (!t || "Z" in a || (a.Z = 0), "p" in a && (a.H = a.H % 12 + 12 * a.p), void 0 === a.m && (a.m = "q" in a ? a.q : 0), "V" in a) {
					if (a.V < 1 || a.V > 53) return null;
					"w" in a || (a.w = 1), "Z" in a ? (n = (i = (n = sM(sI(a.y, 0, 1))).getUTCDay()) > 4 || 0 === i ? sp.ceil(n) : sp(n), n = sr.offset(n, (a.V - 1) * 7), a.y = n.getUTCFullYear(), a.m = n.getUTCMonth(), a.d = n.getUTCDate() + (a.w + 6) % 7) : (n = (i = (n = sP(sI(a.y, 0, 1))).getDay()) > 4 || 0 === i ? so.ceil(n) : so(n), n = st.offset(n, (a.V - 1) * 7), a.y = n.getFullYear(), a.m = n.getMonth(), a.d = n.getDate() + (a.w + 6) % 7)
				} else("W" in a || "U" in a) && ("w" in a || (a.w = "u" in a ? a.u % 7 : +("W" in a)), i = "Z" in a ? sM(sI(a.y, 0, 1)).getUTCDay() : sP(sI(a.y, 0, 1)).getDay(), a.m = 0, a.d = "W" in a ? (a.w + 6) % 7 + 7 * a.W - (i + 5) % 7 : a.w + 7 * a.U - (i + 6) % 7);
				return "Z" in a ? (a.H += a.Z / 100 | 0, a.M += a.Z % 100, sM(a)) : sP(a)
			}
		}

		function A(e, t, r, n) {
			for (var i, a, o = 0, l = t.length, u = r.length; o < l;) {
				if (n >= u) return -1;
				if (37 === (i = t.charCodeAt(o++))) {
					if (!(a = w[(i = t.charAt(o++)) in sC ? t.charAt(o++) : i]) || (n = a(e, r, n)) < 0) return -1
				} else if (i != r.charCodeAt(n++)) return -1
			}
			return n
		}
		return b.x = O(r, b), b.X = O(n, b), b.c = O(t, b), x.x = O(r, x), x.X = O(n, x), x.c = O(t, x), {
			format: function(e) {
				var t = O(e += "", b);
				return t.toString = function() {
					return e
				}, t
			},
			parse: function(e) {
				var t = _(e += "", !1);
				return t.toString = function() {
					return e
				}, t
			},
			utcFormat: function(e) {
				var t = O(e += "", x);
				return t.toString = function() {
					return e
				}, t
			},
			utcParse: function(e) {
				var t = _(e += "", !0);
				return t.toString = function() {
					return e
				}, t
			}
		}
	}({
		dateTime: "%x, %X",
		date: "%-m/%-d/%Y",
		time: "%-I:%M:%S %p",
		periods: ["AM", "PM"],
		days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		shortDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		shortMonths: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	})).format, w.parse, _ = w.utcFormat, A = w.utcParse;
	var fB = "%Y-%m-%dT%H:%M:%S.%LZ";

	function f$(e, t) {
		switch (arguments.length) {
			case 0:
				break;
			case 1:
				this.range(e);
				break;
			default:
				this.range(t).domain(e)
		}
		return this
	}

	function fU(e, t) {
		switch (arguments.length) {
			case 0:
				break;
			case 1:
				"function" == typeof e ? this.interpolator(e) : this.range(e);
				break;
			default:
				this.domain(e), "function" == typeof t ? this.interpolator(t) : this.range(t)
		}
		return this
	}
	Date.prototype.toISOString || _(fB), +new Date("2000-01-01T00:00:00.000Z") || A(fB);
	let fF = Symbol("implicit");

	function fK() {
		var e = new u_,
			t = [],
			r = [],
			n = fF;

		function i(i) {
			let a = e.get(i);
			if (void 0 === a) {
				if (n !== fF) return n;
				e.set(i, a = t.push(i) - 1)
			}
			return r[a % r.length]
		}
		return i.domain = function(r) {
			if (!arguments.length) return t.slice();
			for (let n of (t = [], e = new u_, r)) e.has(n) || e.set(n, t.push(n) - 1);
			return i
		}, i.range = function(e) {
			return arguments.length ? (r = Array.from(e), i) : r.slice()
		}, i.unknown = function(e) {
			return arguments.length ? (n = e, i) : n
		}, i.copy = function() {
			return fK(t, r).unknown(n)
		}, f$.apply(i, arguments), i
	}

	function fH() {
		var e, t, r = fK().unknown(void 0),
			n = r.domain,
			i = r.range,
			a = 0,
			o = 1,
			l = !1,
			u = 0,
			c = 0,
			s = .5;

		function f() {
			var r = n().length,
				f = o < a,
				h = f ? o : a,
				d = f ? a : o;
			e = (d - h) / Math.max(1, r - u + 2 * c), l && (e = Math.floor(e)), h += (d - h - e * (r - u)) * s, t = e * (1 - u), l && (h = Math.round(h), t = Math.round(t));
			var p = (function(e, t, r) {
				e *= 1, t *= 1, r = (i = arguments.length) < 2 ? (t = e, e = 0, 1) : i < 3 ? 1 : +r;
				for (var n = -1, i = 0 | Math.max(0, Math.ceil((t - e) / r)), a = Array(i); ++n < i;) a[n] = e + n * r;
				return a
			})(r).map(function(t) {
				return h + e * t
			});
			return i(f ? p.reverse() : p)
		}
		return delete r.unknown, r.domain = function(e) {
			return arguments.length ? (n(e), f()) : n()
		}, r.range = function(e) {
			return arguments.length ? ([a, o] = e, a *= 1, o *= 1, f()) : [a, o]
		}, r.rangeRound = function(e) {
			return [a, o] = e, a *= 1, o *= 1, l = !0, f()
		}, r.bandwidth = function() {
			return t
		}, r.step = function() {
			return e
		}, r.round = function(e) {
			return arguments.length ? (l = !!e, f()) : l
		}, r.padding = function(e) {
			return arguments.length ? (u = Math.min(1, c = +e), f()) : u
		}, r.paddingInner = function(e) {
			return arguments.length ? (u = Math.min(1, e), f()) : u
		}, r.paddingOuter = function(e) {
			return arguments.length ? (c = +e, f()) : c
		}, r.align = function(e) {
			return arguments.length ? (s = Math.max(0, Math.min(1, e)), f()) : s
		}, r.copy = function() {
			return fH(n(), [a, o]).round(l).paddingInner(u).paddingOuter(c).align(s)
		}, f$.apply(f(), arguments)
	}

	function fq() {
		return function e(t) {
			var r = t.copy;
			return t.padding = t.paddingOuter, delete t.paddingInner, delete t.paddingOuter, t.copy = function() {
				return e(r())
			}, t
		}(fH.apply(null, arguments).paddingInner(1))
	}

	function fW(e) {
		return +e
	}
	var fV = [0, 1];

	function fY(e) {
		return e
	}

	function fX(e, t) {
		var r;
		return (t -= e *= 1) ? function(r) {
			return (r - e) / t
		} : (r = isNaN(t) ? 0 / 0 : .5, function() {
			return r
		})
	}

	function fG(e, t, r) {
		var n = e[0],
			i = e[1],
			a = t[0],
			o = t[1];
		return i < n ? (n = fX(i, n), a = r(o, a)) : (n = fX(n, i), a = r(a, o)),
			function(e) {
				return a(n(e))
			}
	}

	function fZ(e, t, r) {
		var n = Math.min(e.length, t.length) - 1,
			i = Array(n),
			a = Array(n),
			o = -1;
		for (e[n] < e[0] && (e = e.slice().reverse(), t = t.slice().reverse()); ++o < n;) i[o] = fX(e[o], e[o + 1]), a[o] = r(t[o], t[o + 1]);
		return function(t) {
			var r = ug(e, t, 1, n) - 1;
			return a[r](i[r](t))
		}
	}

	function fQ(e, t) {
		return t.domain(e.domain()).range(e.range()).interpolate(e.interpolate()).clamp(e.clamp()).unknown(e.unknown())
	}

	function fJ() {
		var e, t, r, n, i, a, o = fV,
			l = fV,
			u = cz,
			c = fY;

		function s() {
			var e, t, r, u = Math.min(o.length, l.length);
			return c !== fY && (e = o[0], t = o[u - 1], e > t && (r = e, e = t, t = r), c = function(r) {
				return Math.max(e, Math.min(t, r))
			}), n = u > 2 ? fZ : fG, i = a = null, f
		}

		function f(t) {
			return null == t || isNaN(t *= 1) ? r : (i || (i = n(o.map(e), l, u)))(e(c(t)))
		}
		return f.invert = function(r) {
				return c(t((a || (a = n(l, o.map(e), cT)))(r)))
			}, f.domain = function(e) {
				return arguments.length ? (o = Array.from(e, fW), s()) : o.slice()
			}, f.range = function(e) {
				return arguments.length ? (l = Array.from(e), s()) : l.slice()
			}, f.rangeRound = function(e) {
				return l = Array.from(e), u = cL, s()
			}, f.clamp = function(e) {
				return arguments.length ? (c = !!e || fY, s()) : c !== fY
			}, f.interpolate = function(e) {
				return arguments.length ? (u = e, s()) : u
			}, f.unknown = function(e) {
				return arguments.length ? (r = e, f) : r
			},
			function(r, n) {
				return e = r, t = n, s()
			}
	}

	function f0() {
		return fJ()(fY, fY)
	}

	function f1(e, t, r, n) {
		var i, a, o = uT(e, t, r);
		switch ((n = cX(null == n ? ",f" : n)).type) {
			case "s":
				var l = Math.max(Math.abs(e), Math.abs(t));
				return null != n.precision || isNaN(a = Math.max(0, 3 * Math.max(-8, Math.min(8, Math.floor(cV(l) / 3))) - cV(Math.abs(o)))) || (n.precision = a), x(n, l);
			case "":
			case "e":
			case "g":
			case "p":
			case "r":
				null != n.precision || isNaN(a = Math.max(0, cV(Math.abs(Math.max(Math.abs(e), Math.abs(t))) - (i = Math.abs(i = o))) - cV(i)) + 1) || (n.precision = a - ("e" === n.type));
				break;
			case "f":
			case "%":
				null != n.precision || isNaN(a = Math.max(0, -cV(Math.abs(o)))) || (n.precision = a - ("%" === n.type) * 2)
		}
		return b(n)
	}

	function f2(e) {
		var t = e.domain;
		return e.ticks = function(e) {
			var r = t();
			return uI(r[0], r[r.length - 1], null == e ? 10 : e)
		}, e.tickFormat = function(e, r) {
			var n = t();
			return f1(n[0], n[n.length - 1], null == e ? 10 : e, r)
		}, e.nice = function(r) {
			null == r && (r = 10);
			var n, i, a = t(),
				o = 0,
				l = a.length - 1,
				u = a[o],
				c = a[l],
				s = 10;
			for (c < u && (i = u, u = c, c = i, i = o, o = l, l = i); s-- > 0;) {
				if ((i = uC(u, c, r)) === n) return a[o] = u, a[l] = c, t(a);
				if (i > 0) u = Math.floor(u / i) * i, c = Math.ceil(c / i) * i;
				else if (i < 0) u = Math.ceil(u * i) / i, c = Math.floor(c * i) / i;
				else break;
				n = i
			}
			return e
		}, e
	}

	function f3() {
		var e = f0();
		return e.copy = function() {
			return fQ(e, f3())
		}, f$.apply(e, arguments), f2(e)
	}

	function f5(e) {
		var t;

		function r(e) {
			return null == e || isNaN(e *= 1) ? t : e
		}
		return r.invert = r, r.domain = r.range = function(t) {
			return arguments.length ? (e = Array.from(t, fW), r) : e.slice()
		}, r.unknown = function(e) {
			return arguments.length ? (t = e, r) : t
		}, r.copy = function() {
			return f5(e).unknown(t)
		}, e = arguments.length ? Array.from(e, fW) : [0, 1], f2(r)
	}

	function f6(e, t) {
		e = e.slice();
		var r, n = 0,
			i = e.length - 1,
			a = e[n],
			o = e[i];
		return o < a && (r = n, n = i, i = r, r = a, a = o, o = r), e[n] = t.floor(a), e[i] = t.ceil(o), e
	}

	function f4(e) {
		return Math.log(e)
	}

	function f8(e) {
		return Math.exp(e)
	}

	function f7(e) {
		return -Math.log(-e)
	}

	function f9(e) {
		return -Math.exp(-e)
	}

	function he(e) {
		return isFinite(e) ? +("1e" + e) : e < 0 ? 0 : e
	}

	function ht(e) {
		return (t, r) => -e(-t, r)
	}

	function hr(e) {
		let t, r, n = e(f4, f8),
			i = n.domain,
			a = 10;

		function o() {
			var o, l;
			return t = (o = a) === Math.E ? Math.log : 10 === o && Math.log10 || 2 === o && Math.log2 || (o = Math.log(o), e => Math.log(e) / o), r = 10 === (l = a) ? he : l === Math.E ? Math.exp : e => Math.pow(l, e), i()[0] < 0 ? (t = ht(t), r = ht(r), e(f7, f9)) : e(f4, f8), n
		}
		return n.base = function(e) {
			return arguments.length ? (a = +e, o()) : a
		}, n.domain = function(e) {
			return arguments.length ? (i(e), o()) : i()
		}, n.ticks = e => {
			let n, o, l = i(),
				u = l[0],
				c = l[l.length - 1],
				s = c < u;
			s && ([u, c] = [c, u]);
			let f = t(u),
				h = t(c),
				d = null == e ? 10 : +e,
				p = [];
			if (!(a % 1) && h - f < d) {
				if (f = Math.floor(f), h = Math.ceil(h), u > 0) {
					for (; f <= h; ++f)
						for (n = 1; n < a; ++n)
							if (!((o = f < 0 ? n / r(-f) : n * r(f)) < u)) {
								if (o > c) break;
								p.push(o)
							}
				} else
					for (; f <= h; ++f)
						for (n = a - 1; n >= 1; --n)
							if (!((o = f > 0 ? n / r(-f) : n * r(f)) < u)) {
								if (o > c) break;
								p.push(o)
							} 2 * p.length < d && (p = uI(u, c, d))
			} else p = uI(f, h, Math.min(h - f, d)).map(r);
			return s ? p.reverse() : p
		}, n.tickFormat = (e, i) => {
			if (null == e && (e = 10), null == i && (i = 10 === a ? "s" : ","), "function" != typeof i && (a % 1 || null != (i = cX(i)).precision || (i.trim = !0), i = b(i)), 1 / 0 === e) return i;
			let o = Math.max(1, a * e / n.ticks().length);
			return e => {
				let n = e / r(Math.round(t(e)));
				return n * a < a - .5 && (n *= a), n <= o ? i(e) : ""
			}
		}, n.nice = () => i(f6(i(), {
			floor: e => r(Math.floor(t(e))),
			ceil: e => r(Math.ceil(t(e)))
		})), n
	}

	function hn() {
		let e = hr(fJ()).domain([1, 10]);
		return e.copy = () => fQ(e, hn()).base(e.base()), f$.apply(e, arguments), e
	}

	function hi(e) {
		return function(t) {
			return Math.sign(t) * Math.log1p(Math.abs(t / e))
		}
	}

	function ha(e) {
		return function(t) {
			return Math.sign(t) * Math.expm1(Math.abs(t)) * e
		}
	}

	function ho(e) {
		var t = 1,
			r = e(hi(1), ha(t));
		return r.constant = function(r) {
			return arguments.length ? e(hi(t = +r), ha(t)) : t
		}, f2(r)
	}

	function hl() {
		var e = ho(fJ());
		return e.copy = function() {
			return fQ(e, hl()).constant(e.constant())
		}, f$.apply(e, arguments)
	}

	function hu(e) {
		return function(t) {
			return t < 0 ? -Math.pow(-t, e) : Math.pow(t, e)
		}
	}

	function hc(e) {
		return e < 0 ? -Math.sqrt(-e) : Math.sqrt(e)
	}

	function hs(e) {
		return e < 0 ? -e * e : e * e
	}

	function hf(e) {
		var t = e(fY, fY),
			r = 1;
		return t.exponent = function(t) {
			return arguments.length ? 1 == (r = +t) ? e(fY, fY) : .5 === r ? e(hc, hs) : e(hu(r), hu(1 / r)) : r
		}, f2(t)
	}

	function hh() {
		var e = hf(fJ());
		return e.copy = function() {
			return fQ(e, hh()).exponent(e.exponent())
		}, f$.apply(e, arguments), e
	}

	function hd() {
		return hh.apply(null, arguments).exponent(.5)
	}

	function hp(e) {
		return Math.sign(e) * e * e
	}

	function hy() {
		var e, t = f0(),
			r = [0, 1],
			n = !1;

		function i(r) {
			var i, a = Math.sign(i = t(r)) * Math.sqrt(Math.abs(i));
			return isNaN(a) ? e : n ? Math.round(a) : a
		}
		return i.invert = function(e) {
			return t.invert(hp(e))
		}, i.domain = function(e) {
			return arguments.length ? (t.domain(e), i) : t.domain()
		}, i.range = function(e) {
			return arguments.length ? (t.range((r = Array.from(e, fW)).map(hp)), i) : r.slice()
		}, i.rangeRound = function(e) {
			return i.range(e).round(!0)
		}, i.round = function(e) {
			return arguments.length ? (n = !!e, i) : n
		}, i.clamp = function(e) {
			return arguments.length ? (t.clamp(e), i) : t.clamp()
		}, i.unknown = function(t) {
			return arguments.length ? (e = t, i) : e
		}, i.copy = function() {
			return hy(t.domain(), r).round(n).clamp(t.clamp()).unknown(e)
		}, f$.apply(i, arguments), f2(i)
	}

	function hv() {
		var e, t = [],
			r = [],
			n = [];

		function i() {
			var e = 0,
				i = Math.max(1, r.length);
			for (n = Array(i - 1); ++e < i;) n[e - 1] = function(e, t, r = uv) {
				if (!(!(n = e.length) || isNaN(t *= 1))) {
					if (t <= 0 || n < 2) return +r(e[0], 0, e);
					if (t >= 1) return +r(e[n - 1], n - 1, e);
					var n, i = (n - 1) * t,
						a = Math.floor(i),
						o = +r(e[a], a, e);
					return o + (r(e[a + 1], a + 1, e) - o) * (i - a)
				}
			}(t, e / i);
			return a
		}

		function a(t) {
			return null == t || isNaN(t *= 1) ? e : r[ug(n, t)]
		}
		return a.invertExtent = function(e) {
			var i = r.indexOf(e);
			return i < 0 ? [0 / 0, 0 / 0] : [i > 0 ? n[i - 1] : t[0], i < n.length ? n[i] : t[t.length - 1]]
		}, a.domain = function(e) {
			if (!arguments.length) return t.slice();
			for (let r of (t = [], e)) null == r || isNaN(r *= 1) || t.push(r);
			return t.sort(uh), i()
		}, a.range = function(e) {
			return arguments.length ? (r = Array.from(e), i()) : r.slice()
		}, a.unknown = function(t) {
			return arguments.length ? (e = t, a) : e
		}, a.quantiles = function() {
			return n.slice()
		}, a.copy = function() {
			return hv().domain(t).range(r).unknown(e)
		}, f$.apply(a, arguments)
	}

	function hm() {
		var e, t = 0,
			r = 1,
			n = 1,
			i = [.5],
			a = [0, 1];

		function o(t) {
			return null != t && t <= t ? a[ug(i, t, 0, n)] : e
		}

		function l() {
			var e = -1;
			for (i = Array(n); ++e < n;) i[e] = ((e + 1) * r - (e - n) * t) / (n + 1);
			return o
		}
		return o.domain = function(e) {
			return arguments.length ? ([t, r] = e, t *= 1, r *= 1, l()) : [t, r]
		}, o.range = function(e) {
			return arguments.length ? (n = (a = Array.from(e)).length - 1, l()) : a.slice()
		}, o.invertExtent = function(e) {
			var o = a.indexOf(e);
			return o < 0 ? [0 / 0, 0 / 0] : o < 1 ? [t, i[0]] : o >= n ? [i[n - 1], r] : [i[o - 1], i[o]]
		}, o.unknown = function(t) {
			return arguments.length && (e = t), o
		}, o.thresholds = function() {
			return i.slice()
		}, o.copy = function() {
			return hm().domain([t, r]).range(a).unknown(e)
		}, f$.apply(f2(o), arguments)
	}

	function hg() {
		var e, t = [.5],
			r = [0, 1],
			n = 1;

		function i(i) {
			return null != i && i <= i ? r[ug(t, i, 0, n)] : e
		}
		return i.domain = function(e) {
			return arguments.length ? (n = Math.min((t = Array.from(e)).length, r.length - 1), i) : t.slice()
		}, i.range = function(e) {
			return arguments.length ? (r = Array.from(e), n = Math.min(t.length, r.length - 1), i) : r.slice()
		}, i.invertExtent = function(e) {
			var n = r.indexOf(e);
			return [t[n - 1], t[n]]
		}, i.unknown = function(t) {
			return arguments.length ? (e = t, i) : e
		}, i.copy = function() {
			return hg().domain(t).range(r).unknown(e)
		}, f$.apply(i, arguments)
	}

	function hb(e) {
		return new Date(e)
	}

	function hx(e) {
		return e instanceof Date ? +e : Math.round(e)
	}

	function hw(e, t, r, n, i, a, o, l, u, c) {
		var s = f0(),
			f = s.invert,
			h = s.domain,
			d = c(".%L"),
			p = c(":%S"),
			y = c("%I:%M"),
			v = c("%I %p"),
			m = c("%a %d"),
			g = c("%b %d"),
			b = c("%B"),
			x = c("%Y");

		function w(e) {
			return (u(e) < e ? d : l(e) < e ? p : o(e) < e ? y : a(e) < e ? v : n(e) < e ? i(e) < e ? m : g : r(e) < e ? b : x)(e)
		}
		return s.invert = function(e) {
			return new Date(Math.round(f(e)))
		}, s.domain = function(e) {
			return arguments.length ? h(Array.from(e, hx)) : h().map(hb)
		}, s.ticks = function(t) {
			var r = h();
			return e(r[0], r[r.length - 1], null == t ? 10 : t)
		}, s.tickFormat = function(e, t) {
			return null == t ? w : c(t)
		}, s.nice = function(e) {
			var r = h();
			return e && "function" == typeof e.range || (e = t(r[0], r[r.length - 1], null == e ? 10 : e)), e ? h(f6(r, e)) : s
		}, s.copy = function() {
			return fQ(s, hw(e, t, r, n, i, a, o, l, u, c))
		}, s
	}

	function hO() {
		return f$.apply(hw(sE, sk, sO, sx, sa, st, c9, c8, c4, O).domain([new Date(2e3, 0, 1), new Date(2e3, 0, 2)]), arguments)
	}

	function h_() {
		return f$.apply(hw(sS, sj, s_, sw, sd, sr, se, c7, c4, _).domain([Date.UTC(2e3, 0, 1), Date.UTC(2e3, 0, 2)]), arguments)
	}

	function hA() {
		var e, t, r, n, i, a = 0,
			o = 1,
			l = fY,
			u = !1;

		function c(t) {
			return null == t || isNaN(t *= 1) ? i : l(0 === r ? .5 : (t = (n(t) - e) * r, u ? Math.max(0, Math.min(1, t)) : t))
		}

		function s(e) {
			return function(t) {
				var r, n;
				return arguments.length ? ([r, n] = t, l = e(r, n), c) : [l(0), l(1)]
			}
		}
		return c.domain = function(i) {
				return arguments.length ? ([a, o] = i, e = n(a *= 1), t = n(o *= 1), r = e === t ? 0 : 1 / (t - e), c) : [a, o]
			}, c.clamp = function(e) {
				return arguments.length ? (u = !!e, c) : u
			}, c.interpolator = function(e) {
				return arguments.length ? (l = e, c) : l
			}, c.range = s(cz), c.rangeRound = s(cL), c.unknown = function(e) {
				return arguments.length ? (i = e, c) : i
			},
			function(i) {
				return n = i, e = i(a), t = i(o), r = e === t ? 0 : 1 / (t - e), c
			}
	}

	function hS(e, t) {
		return t.domain(e.domain()).interpolator(e.interpolator()).clamp(e.clamp()).unknown(e.unknown())
	}

	function hj() {
		var e = f2(hA()(fY));
		return e.copy = function() {
			return hS(e, hj())
		}, fU.apply(e, arguments)
	}

	function hE() {
		var e = hr(hA()).domain([1, 10]);
		return e.copy = function() {
			return hS(e, hE()).base(e.base())
		}, fU.apply(e, arguments)
	}

	function hk() {
		var e = ho(hA());
		return e.copy = function() {
			return hS(e, hk()).constant(e.constant())
		}, fU.apply(e, arguments)
	}

	function hP() {
		var e = hf(hA());
		return e.copy = function() {
			return hS(e, hP()).exponent(e.exponent())
		}, fU.apply(e, arguments)
	}

	function hM() {
		return hP.apply(null, arguments).exponent(.5)
	}

	function hI() {
		var e = [],
			t = fY;

		function r(r) {
			if (null != r && !isNaN(r *= 1)) return t((ug(e, r, 1) - 1) / (e.length - 1))
		}
		return r.domain = function(t) {
			if (!arguments.length) return e.slice();
			for (let r of (e = [], t)) null == r || isNaN(r *= 1) || e.push(r);
			return e.sort(uh), r
		}, r.interpolator = function(e) {
			return arguments.length ? (t = e, r) : t
		}, r.range = function() {
			return e.map((r, n) => t(n / (e.length - 1)))
		}, r.quantiles = function(t) {
			return Array.from({
				length: t + 1
			}, (r, n) => (function(e, t) {
				if (!(!(r = (e = Float64Array.from(function*(e, t) {
						if (void 0 === t)
							for (let t of e) null != t && (t *= 1) >= t && (yield t);
						else {
							let r = -1;
							for (let n of e) null != (n = t(n, ++r, e)) && (n *= 1) >= n && (yield n)
						}
					}(e, void 0))).length) || isNaN(t *= 1))) {
					if (t <= 0 || r < 2) return uN(e);
					if (t >= 1) return uD(e);
					var r, n = (r - 1) * t,
						i = Math.floor(n),
						a = uD((function e(t, r, n = 0, i = 1 / 0, a) {
							if (r = Math.floor(r), n = Math.floor(Math.max(0, n)), i = Math.floor(Math.min(t.length - 1, i)), !(n <= r && r <= i)) return t;
							for (a = void 0 === a ? uj : function(e = uh) {
									if (e === uh) return uj;
									if ("function" != typeof e) throw TypeError("compare is not a function");
									return (t, r) => {
										let n = e(t, r);
										return n || 0 === n ? n : (0 === e(r, r)) - (0 === e(t, t))
									}
								}(a); i > n;) {
								if (i - n > 600) {
									let o = i - n + 1,
										l = r - n + 1,
										u = Math.log(o),
										c = .5 * Math.exp(2 * u / 3),
										s = .5 * Math.sqrt(u * c * (o - c) / o) * (l - o / 2 < 0 ? -1 : 1),
										f = Math.max(n, Math.floor(r - l * c / o + s)),
										h = Math.min(i, Math.floor(r + (o - l) * c / o + s));
									e(t, r, f, h, a)
								}
								let o = t[r],
									l = n,
									u = i;
								for (uz(t, n, r), a(t[i], o) > 0 && uz(t, n, i); l < u;) {
									for (uz(t, l, u), ++l, --u; 0 > a(t[l], o);) ++l;
									for (; a(t[u], o) > 0;) --u
								}
								0 === a(t[n], o) ? uz(t, n, u) : uz(t, ++u, i), u <= r && (n = u + 1), r <= u && (i = u - 1)
							}
							return t
						})(e, i).subarray(0, i + 1));
					return a + (uN(e.subarray(i + 1)) - a) * (n - i)
				}
			})(e, n / t))
		}, r.copy = function() {
			return hI(t).domain(e)
		}, fU.apply(r, arguments)
	}

	function hC() {
		var e, t, r, n, i, a, o, l = 0,
			u = .5,
			c = 1,
			s = 1,
			f = fY,
			h = !1;

		function d(e) {
			return null == e || isNaN(e *= 1) ? o : (e = .5 + ((e = +a(e)) - t) * (s * e < s * t ? n : i), f(h ? Math.max(0, Math.min(1, e)) : e))
		}

		function p(e) {
			return function(t) {
				var r, n, i;
				return arguments.length ? ([r, n, i] = t, f = function(e, t) {
					void 0 === t && (t = e, e = cz);
					for (var r = 0, n = t.length - 1, i = t[0], a = Array(n < 0 ? 0 : n); r < n;) a[r] = e(i, i = t[++r]);
					return function(e) {
						var t = Math.max(0, Math.min(n - 1, Math.floor(e *= n)));
						return a[t](e - t)
					}
				}(e, [r, n, i]), d) : [f(0), f(.5), f(1)]
			}
		}
		return d.domain = function(o) {
				return arguments.length ? ([l, u, c] = o, e = a(l *= 1), t = a(u *= 1), r = a(c *= 1), n = e === t ? 0 : .5 / (t - e), i = t === r ? 0 : .5 / (r - t), s = t < e ? -1 : 1, d) : [l, u, c]
			}, d.clamp = function(e) {
				return arguments.length ? (h = !!e, d) : h
			}, d.interpolator = function(e) {
				return arguments.length ? (f = e, d) : f
			}, d.range = p(cz), d.rangeRound = p(cL), d.unknown = function(e) {
				return arguments.length ? (o = e, d) : o
			},
			function(o) {
				return a = o, e = o(l), t = o(u), r = o(c), n = e === t ? 0 : .5 / (t - e), i = t === r ? 0 : .5 / (r - t), s = t < e ? -1 : 1, d
			}
	}

	function hT() {
		var e = f2(hC()(fY));
		return e.copy = function() {
			return hS(e, hT())
		}, fU.apply(e, arguments)
	}

	function hD() {
		var e = hr(hC()).domain([.1, 1, 10]);
		return e.copy = function() {
			return hS(e, hD()).base(e.base())
		}, fU.apply(e, arguments)
	}

	function hN() {
		var e = ho(hC());
		return e.copy = function() {
			return hS(e, hN()).constant(e.constant())
		}, fU.apply(e, arguments)
	}

	function hz() {
		var e = hf(hC());
		return e.copy = function() {
			return hS(e, hz()).exponent(e.exponent())
		}, fU.apply(e, arguments)
	}

	function hL() {
		return hz.apply(null, arguments).exponent(.5)
	}
	e.s(["scaleBand", 0, fH, "scaleDiverging", 0, hT, "scaleDivergingLog", 0, hD, "scaleDivergingPow", 0, hz, "scaleDivergingSqrt", 0, hL, "scaleDivergingSymlog", 0, hN, "scaleIdentity", 0, f5, "scaleImplicit", 0, fF, "scaleLinear", 0, f3, "scaleLog", 0, hn, "scaleOrdinal", 0, fK, "scalePoint", 0, fq, "scalePow", 0, hh, "scaleQuantile", 0, hv, "scaleQuantize", 0, hm, "scaleRadial", 0, hy, "scaleSequential", 0, hj, "scaleSequentialLog", 0, hE, "scaleSequentialPow", 0, hP, "scaleSequentialQuantile", 0, hI, "scaleSequentialSqrt", 0, hM, "scaleSequentialSymlog", 0, hk, "scaleSqrt", 0, hd, "scaleSymlog", 0, hl, "scaleThreshold", 0, hg, "scaleTime", 0, hO, "scaleUtc", 0, h_, "tickFormat", 0, f1], 6765), e.i(6765), e.s(["scaleBand", 0, fH, "scaleDiverging", 0, hT, "scaleDivergingLog", 0, hD, "scaleDivergingPow", 0, hz, "scaleDivergingSqrt", 0, hL, "scaleDivergingSymlog", 0, hN, "scaleIdentity", 0, f5, "scaleImplicit", 0, fF, "scaleLinear", 0, f3, "scaleLog", 0, hn, "scaleOrdinal", 0, fK, "scalePoint", 0, fq, "scalePow", 0, hh, "scaleQuantile", 0, hv, "scaleQuantize", 0, hm, "scaleRadial", 0, hy, "scaleSequential", 0, hj, "scaleSequentialLog", 0, hE, "scaleSequentialPow", 0, hP, "scaleSequentialQuantile", 0, hI, "scaleSequentialSqrt", 0, hM, "scaleSequentialSymlog", 0, hk, "scaleSqrt", 0, hd, "scaleSymlog", 0, hl, "scaleThreshold", 0, hg, "scaleTime", 0, hO, "scaleUtc", 0, h_, "tickFormat", 0, f1], 886523);
	var hR = e.i(886523);

	function hB(e, t, r) {
		if ("function" == typeof e) return e.copy().domain(t).range(r);
		if (null != e) {
			var n = function(e) {
				if (e in hR && "function" == typeof hR[e]) return hR[e]();
				var t = "scale".concat(ej(e));
				if (t in hR && "function" == typeof hR[t]) return hR[t]()
			}(e);
			if (null != n) return n.domain(t).range(r), n
		}
	}

	function h$(e, t, r, n) {
		if (null != r && null != n) return "function" == typeof e.scale ? hB(e.scale, r, n) : hB(t, r, n)
	}
	var hU = (e, t, r) => {
		if (null != e) {
			var n = e.scale,
				i = e.type;
			if ("auto" === n) return "category" === i && r && (r.indexOf("LineChart") >= 0 || r.indexOf("AreaChart") >= 0 || r.indexOf("ComposedChart") >= 0 && !t) ? "point" : "category" === i ? "band" : "linear";
			if ("string" == typeof n) return "scale".concat(ej(n)) in hR ? n : "point"
		}
	};

	function hF(e, t) {
		if (e) {
			var r = null != t ? t : e.domain(),
				n = r.map(t => {
					var r;
					return null != (r = e(t)) ? r : 0
				}),
				i = e.range();
			if (0 !== r.length && !(i.length < 2)) return e => {
				var t, i, a = function(e, t) {
					for (var r = 0, n = e.length, i = e[0] < e[e.length - 1]; r < n;) {
						var a = Math.floor((r + n) / 2);
						(i ? e[a] < t : e[a] > t) ? r = a + 1: n = a
					}
					return r
				}(n, e);
				return a <= 0 ? r[0] : a >= r.length ? r[r.length - 1] : Math.abs(e - (null != (t = n[a - 1]) ? t : 0)) <= Math.abs(e - (null != (i = n[a]) ? i : 0)) ? r[a - 1] : r[a]
			}
		}
	}

	function hK(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function hH(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? hK(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : hK(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function hq(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return hW(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? hW(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function hW(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var hV = [0, "auto"],
		hY = {
			allowDataOverflow: !1,
			allowDecimals: !0,
			allowDuplicatedCategory: !0,
			angle: 0,
			dataKey: void 0,
			domain: void 0,
			height: 30,
			hide: !0,
			id: 0,
			includeHidden: !1,
			interval: "preserveEnd",
			minTickGap: 5,
			mirror: !1,
			name: void 0,
			orientation: "bottom",
			padding: {
				left: 0,
				right: 0
			},
			reversed: !1,
			scale: "auto",
			tick: !0,
			tickCount: 5,
			tickFormatter: void 0,
			ticks: void 0,
			type: "category",
			unit: void 0,
			niceTicks: "auto"
		},
		hX = (e, t) => e.cartesianAxis.xAxis[t],
		hG = (e, t) => {
			var r = hX(e, t);
			return null == r ? hY : r
		},
		hZ = {
			allowDataOverflow: !1,
			allowDecimals: !0,
			allowDuplicatedCategory: !0,
			angle: 0,
			dataKey: void 0,
			domain: hV,
			hide: !0,
			id: 0,
			includeHidden: !1,
			interval: "preserveEnd",
			minTickGap: 5,
			mirror: !1,
			name: void 0,
			orientation: "left",
			padding: {
				top: 0,
				bottom: 0
			},
			reversed: !1,
			scale: "auto",
			tick: !0,
			tickCount: 5,
			tickFormatter: void 0,
			ticks: void 0,
			type: "number",
			unit: void 0,
			niceTicks: "auto",
			width: 60
		},
		hQ = (e, t) => {
			var r = e.cartesianAxis.yAxis[t];
			return null == r ? hZ : r
		},
		hJ = {
			domain: [0, "auto"],
			includeHidden: !1,
			reversed: !1,
			allowDataOverflow: !1,
			allowDuplicatedCategory: !1,
			dataKey: void 0,
			id: 0,
			name: "",
			range: [64, 64],
			scale: "auto",
			type: "number",
			unit: ""
		},
		h0 = (e, t) => {
			var r = e.cartesianAxis.zAxis[t];
			return null == r ? hJ : r
		},
		h1 = (e, t, r) => {
			switch (t) {
				case "xAxis":
					return hG(e, r);
				case "yAxis":
					return hQ(e, r);
				case "zAxis":
					return h0(e, r);
				case "angleAxis":
					return aV(e, r);
				case "radiusAxis":
					return aY(e, r);
				default:
					throw Error("Unexpected axis type: ".concat(t))
			}
		},
		h2 = (e, t, r) => {
			switch (t) {
				case "xAxis":
					return hG(e, r);
				case "yAxis":
					return hQ(e, r);
				case "angleAxis":
					return aV(e, r);
				case "radiusAxis":
					return aY(e, r);
				default:
					throw Error("Unexpected axis type: ".concat(t))
			}
		},
		h3 = e => e.graphicalItems.cartesianItems.some(e => "bar" === e.type) || e.graphicalItems.polarItems.some(e => "radialBar" === e.type);

	function h5(e, t) {
		return r => {
			switch (e) {
				case "xAxis":
					return "xAxisId" in r && r.xAxisId === t;
				case "yAxis":
					return "yAxisId" in r && r.yAxisId === t;
				case "zAxis":
					return "zAxisId" in r && r.zAxisId === t;
				case "angleAxis":
					return "angleAxisId" in r && r.angleAxisId === t;
				case "radiusAxis":
					return "radiusAxisId" in r && r.radiusAxisId === t;
				default:
					return !1
			}
		}
	}
	var h6 = e => e.graphicalItems.cartesianItems,
		h4 = r$([un, ui], h5),
		h8 = (e, t, r) => e.filter(r).filter(e => (null == t ? void 0 : t.includeHidden) === !0 || !e.hide),
		h7 = r$([h6, h1, h4], h8, {
			memoizeOptions: {
				resultEqualityCheck: a3
			}
		}),
		h9 = r$([h7], e => e.filter(e => "area" === e.type || "bar" === e.type).filter(ul)),
		de = e => e.filter(e => !("stackId" in e) || void 0 === e.stackId),
		dt = r$([h7], de),
		dr = e => e.map(e => e.data).filter(Boolean).flat(1),
		dn = r$([h7], e => e.some(e => !e.data)),
		di = r$([h7], dr, {
			memoizeOptions: {
				resultEqualityCheck: a3
			}
		}),
		da = (e, t) => {
			var r = t.chartData,
				n = t.dataStartIndex,
				i = t.dataEndIndex;
			return e.length > 0 ? e : (void 0 === r ? [] : r).slice(n, i + 1)
		},
		dl = r$([di, l$], da),
		du = (e, t, r, n, i, a) => {
			var o = n.chartData,
				l = n.dataStartIndex,
				u = n.dataEndIndex,
				c = (null == t ? void 0 : t.dataKey) != null ? e.map(e => ({
					value: iZ(e, t.dataKey)
				})) : r.length > 0 ? r.map(e => e.dataKey).flatMap(t => e.map(e => ({
					value: iZ(e, t)
				}))) : e.map(e => ({
					value: e
				}));
			return i && (null == t ? void 0 : t.dataKey) != null && a.length > 0 ? [...(void 0 === o ? [] : o).slice(l, u + 1).map(e => ({
				value: iZ(e, t.dataKey)
			})).filter(e => null != e.value), ...c] : c
		},
		dc = r$([dl, h1, h7, l$, dn, di], du);

	function ds(e) {
		if (ex(e) || e instanceof Date) {
			var t = Number(e);
			if (eZ(t)) return t
		}
	}

	function df(e) {
		if (Array.isArray(e)) {
			var t = [ds(e[0]), ds(e[1])];
			return lq(t) ? t : void 0
		}
		var r = ds(e);
		if (null != r) return [r, r]
	}

	function dh(e) {
		return e.map(ds).filter(eE)
	}

	function dd(e, t) {
		var r = ds(e),
			n = ds(t);
		return null == r && null == n ? 0 : null == r ? -1 : null == n ? 1 : r - n
	}
	var dp = r$([dc], e => null == e ? void 0 : e.map(e => e.value).sort(dd));

	function dy(e, t) {
		switch (e) {
			case "xAxis":
				return "x" === t.direction;
			case "yAxis":
				return "y" === t.direction;
			default:
				return !1
		}
	}
	var dv = e => {
			var t = uc(e),
				r = us(e);
			return h2(e, t, r)
		},
		dm = r$([dv], e => null == e ? void 0 : e.dataKey),
		dg = r$([h9, l$, dv], uo),
		db = (e, t, r, n) => Object.fromEntries(Object.entries(t.reduce((e, t) => {
			if (null == t.stackId) return e;
			var r = e[t.stackId];
			return null == r && (r = []), r.push(t), e[t.stackId] = r, e
		}, {})).map(t => {
			var i, a, o, l = hq(t, 2),
				u = l[0],
				c = l[1],
				s = n ? [...c].reverse() : c,
				f = s.map(ua);
			return [u, {
				stackedData: (a = null != (i = i1[r]) ? i : iR, (o = (function() {
					var e = nG([]),
						t = iB,
						r = iR,
						n = i$;

					function i(i) {
						var a, o, l = Array.from(e.apply(this, arguments), iU),
							u = l.length,
							c = -1;
						for (let e of i)
							for (a = 0, ++c; a < u; ++a)(l[a][c] = [0, +n(e, l[a].key, c, i)]).data = e;
						for (a = 0, o = n3(t(l)); a < u; ++a) l[o[a]].index = a;
						return r(l, o), l
					}
					return i.keys = function(t) {
						return arguments.length ? (e = "function" == typeof t ? t : nG(Array.from(t)), i) : e
					}, i.value = function(e) {
						return arguments.length ? (n = "function" == typeof e ? e : nG(+e), i) : n
					}, i.order = function(e) {
						return arguments.length ? (t = null == e ? iB : "function" == typeof e ? e : nG(Array.from(e)), i) : t
					}, i.offset = function(e) {
						return arguments.length ? (r = null == e ? iR : e, i) : r
					}, i
				})().keys(f).value((e, t) => Number(iZ(e, t, 0))).order(iB).offset(a)(e)).forEach((t, r) => {
					t.forEach((t, n) => {
						var i = iZ(e[n], f[r], 0);
						Array.isArray(i) && 2 === i.length && eb(i[0]) && eb(i[1]) && (t[0] = i[0], t[1] = i[1])
					})
				}), o),
				graphicalItems: s
			}]
		})),
		dx = r$([dg, h9, l8, l7], db),
		dw = (e, t, r, n) => {
			var i = t.dataStartIndex,
				a = t.dataEndIndex;
			if (null == n && "zAxis" !== r) {
				if (null != e && 0 !== Object.keys(e).length) {
					let t;
					return [1 / 0 === (t = Object.keys(e).reduce((t, r) => {
						var n = e[r];
						if (!n) return t;
						var o = n.stackedData.reduce((e, t) => {
							var r, n = [Math.min(...r = iF(t, i, a).flat(2).filter(eb)), Math.max(...r)];
							return eZ(n[0]) && eZ(n[1]) ? [Math.min(e[0], n[0]), Math.max(e[1], n[1])] : e
						}, [1 / 0, -1 / 0]);
						return [Math.min(o[0], t[0]), Math.max(o[1], t[1])]
					}, [1 / 0, -1 / 0]))[0] ? 0 : t[0], -1 / 0 === t[1] ? 0 : t[1]]
				}
				return
			}
		},
		dO = r$([h1], e => e.allowDataOverflow),
		d_ = e => {
			var t;
			if (null == e || !("domain" in e)) return hV;
			if (null != e.domain) return e.domain;
			if ("ticks" in e && null != e.ticks) {
				if ("number" === e.type) {
					var r = dh(e.ticks);
					return [Math.min(...r), Math.max(...r)]
				}
				if ("category" === e.type) return e.ticks.map(String)
			}
			return null != (t = null == e ? void 0 : e.domain) ? t : hV
		},
		dA = r$([h1], d_),
		dS = r$([dA, dO], lV),
		dj = r$([dx, lR, un, dS], dw, {
			memoizeOptions: {
				resultEqualityCheck: uu
			}
		}),
		dE = e => e.errorBars,
		dk = function() {
			for (var e = arguments.length, t = Array(e), r = 0; r < e; r++) t[r] = arguments[r];
			var n = t.filter(Boolean);
			if (0 !== n.length) {
				var i = n.flat();
				return [Math.min(...i), Math.max(...i)]
			}
		},
		dP = function(e, t, r, n, i) {
			var a, o, l = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : [];
			if (r.length > 0 && r.forEach(e => {
					var r, u = null != e.data ? [...e.data] : l,
						c = null == (r = n[e.id]) ? void 0 : r.filter(e => dy(i, e));
					u.forEach(r => {
						var n, i = iZ(r, null != (n = t.dataKey) ? n : e.dataKey),
							l = function(e, t, r) {
								if (!r || !r.length) return [];
								if ("number" != typeof t || em(t)) {
									if (Array.isArray(t)) {
										var n, i = dh(t);
										i.length > 0 && (n = Math.max(...i))
									}
								} else n = t;
								return null == n ? [] : dh(r.flatMap(t => {
									var r, i, a = iZ(e, t.dataKey);
									if (Array.isArray(a)) {
										var o = hq(a, 2);
										r = o[0], i = o[1]
									} else r = i = a;
									if (eZ(r) && eZ(i)) return [n - r, n + i]
								}))
							}(r, i, c);
						if (l.length >= 2) {
							var u = Math.min(...l),
								s = Math.max(...l);
							(null == a || u < a) && (a = u), (null == o || s > o) && (o = s)
						}
						var f = df(i);
						null != f && (a = null == a ? f[0] : Math.min(a, f[0]), o = null == o ? f[1] : Math.max(o, f[1]))
					})
				}), (null == t ? void 0 : t.dataKey) != null && 0 === r.length && e.forEach(e => {
					var r = df(iZ(e, t.dataKey));
					null != r && (a = null == a ? r[0] : Math.min(a, r[0]), o = null == o ? r[1] : Math.max(o, r[1]))
				}), eZ(a) && eZ(o)) return [a, o]
		},
		dM = r$([dl, h1, dt, dE, un, lU], dP, {
			memoizeOptions: {
				resultEqualityCheck: uu
			}
		});

	function dI(e) {
		var t = e.value;
		if (ex(t) || t instanceof Date) return t
	}
	var dC = e => e.referenceElements.dots,
		dT = (e, t, r) => e.filter(e => "extendDomain" === e.ifOverflow).filter(e => "xAxis" === t ? e.xAxisId === r : e.yAxisId === r),
		dD = r$([dC, un, ui], dT),
		dN = e => e.referenceElements.areas,
		dz = r$([dN, un, ui], dT),
		dL = e => e.referenceElements.lines,
		dR = r$([dL, un, ui], dT),
		dB = (e, t) => {
			if (null != e) {
				var r = dh(e.map(e => "xAxis" === t ? e.x : e.y));
				if (0 !== r.length) return [Math.min(...r), Math.max(...r)]
			}
		},
		d$ = r$(dD, un, dB),
		dU = (e, t) => {
			if (null != e) {
				var r = dh(e.flatMap(e => ["xAxis" === t ? e.x1 : e.y1, "xAxis" === t ? e.x2 : e.y2]));
				if (0 !== r.length) return [Math.min(...r), Math.max(...r)]
			}
		},
		dF = r$([dz, un], dU),
		dK = (e, t) => {
			if (null != e) {
				var r = e.flatMap(e => "xAxis" === t ? function(e) {
					if (null != e.x) return dh([e.x]);
					var t, r = null == (t = e.segment) ? void 0 : t.map(e => e.x);
					return null == r || 0 === r.length ? [] : dh(r)
				}(e) : function(e) {
					if (null != e.y) return dh([e.y]);
					var t, r = null == (t = e.segment) ? void 0 : t.map(e => e.y);
					return null == r || 0 === r.length ? [] : dh(r)
				}(e));
				if (0 !== r.length) return [Math.min(...r), Math.max(...r)]
			}
		},
		dH = r$([dR, un], dK),
		dq = r$(d$, dH, dF, (e, t, r) => dk(e, r, t)),
		dW = (e, t, r, n, i, a, o, l, u) => {
			if (null != r) return r;
			var c = "vertical" === o && "xAxis" === l || "horizontal" === o && "yAxis" === l ? dk(n, a, i) : dk(a, i),
				s = function(e, t, r) {
					if (r || null != t) {
						if ("function" == typeof e && null != t) try {
							var n = e(t, r);
							if (lq(n)) return lW(n, t, r)
						} catch (e) {}
						if (Array.isArray(e) && 2 === e.length) {
							var i, a, o = lK(e, 2),
								l = o[0],
								u = o[1];
							if ("auto" === l) null != t && (i = Math.min(...t));
							else if (eb(l)) i = l;
							else if ("function" == typeof l) try {
								null != t && (i = l(null == t ? void 0 : t[0]))
							} catch (e) {} else if ("string" == typeof l && i3.test(l)) {
								var c = i3.exec(l);
								if (null == c || null == c[1] || null == t) i = void 0;
								else {
									var s = +c[1];
									i = t[0] - s
								}
							} else i = null == t ? void 0 : t[0];
							if ("auto" === u) null != t && (a = Math.max(...t));
							else if (eb(u)) a = u;
							else if ("function" == typeof u) try {
								null != t && (a = u(null == t ? void 0 : t[1]))
							} catch (e) {} else if ("string" == typeof u && i5.test(u)) {
								var f = i5.exec(u);
								if (null == f || null == f[1] || null == t) a = void 0;
								else {
									var h = +f[1];
									a = t[1] + h
								}
							} else a = null == t ? void 0 : t[1];
							var d = [i, a];
							if (lq(d)) return null == t ? d : lW(d, t, r)
						}
					}
				}(t, c, e.allowDataOverflow);
			return null != s ? s : e.allowDataOverflow && null == c && null != u ? u : s
		},
		dV = r$([h1], e => {
			if (null != e && "number" === e.type && "ticks" in e && null != e.ticks) {
				var t = dh(e.ticks);
				if (0 !== t.length) return [Math.min(...t), Math.max(...t)]
			}
		}, {
			memoizeOptions: {
				resultEqualityCheck: uu
			}
		}),
		dY = r$([h1, dA, dS, dj, dM, dq, aN, un, dV], dW, {
			memoizeOptions: {
				resultEqualityCheck: uu
			}
		}),
		dX = [0, 1],
		dG = (e, t, r, n, i, a, o) => {
			if (null != e && null != r && 0 !== r.length || void 0 !== o) {
				var l, u, c = e.dataKey,
					s = e.type,
					f = iQ(t, a);
				return f && null == c ? lL(0, null != (u = null == r ? void 0 : r.length) ? u : 0) : "category" === s ? (l = n.map(dI).filter(e => null != e), f && (null == e.dataKey || e.allowDuplicatedCategory && eA(l)) ? lL(0, n.length) : e.allowDuplicatedCategory ? l : Array.from(new Set(l))) : "expand" !== i || f ? o : dX
			}
		},
		dZ = r$([h1, aN, dl, dc, l8, un, dY], dG),
		dQ = r$([h1, h3, l9], hU),
		dJ = (e, t, r) => {
			var n = t.niceTicks;
			if ("none" !== n) {
				var i = d_(t),
					a = Array.isArray(i) && ("auto" === i[0] || "auto" === i[1]);
				if (("snap125" === n || "adaptive" === n) && null != t && t.tickCount && lq(e)) {
					if (a) return l3(e, t.tickCount, t.allowDecimals, n);
					if ("number" === t.type) return l5(e, t.tickCount, t.allowDecimals, n)
				}
				if ("auto" === n && "linear" === r && null != t && t.tickCount) {
					if (a && lq(e)) return l3(e, t.tickCount, t.allowDecimals, "adaptive");
					if ("number" === t.type && lq(e)) return l5(e, t.tickCount, t.allowDecimals, "adaptive")
				}
			}
		},
		d0 = r$([dZ, h2, dQ], dJ),
		d1 = (e, t, r, n) => {
			if ("angleAxis" !== n && (null == e ? void 0 : e.type) === "number" && lq(t) && Array.isArray(r) && r.length > 0) {
				var i, a;
				return [Math.min(t[0], null != (i = r[0]) ? i : 0), Math.max(t[1], null != (a = r[r.length - 1]) ? a : 0)]
			}
			return t
		},
		d2 = r$([h1, dZ, d0, un], d1),
		d3 = r$(dc, h1, (e, t) => {
			if (t && "number" === t.type) {
				var r = 1 / 0,
					n = Array.from(dh(e.map(e => e.value))).sort((e, t) => e - t),
					i = n[0],
					a = n[n.length - 1];
				if (null == i || null == a) return 1 / 0;
				var o = a - i;
				if (0 === o) return 1 / 0;
				for (var l = 0; l < n.length - 1; l++) {
					var u = n[l],
						c = n[l + 1];
					null != u && null != c && (r = Math.min(r, c - u))
				}
				return r / o
			}
		}),
		d5 = r$(d3, aN, l4, ao, (e, t, r, n, i) => i, (e, t, r, n, i) => {
			if (!eZ(e)) return 0;
			var a = "vertical" === t ? n.height : n.width;
			if ("gap" === i) return e * a / 2;
			if ("no-gap" === i) {
				var o = e_(r, e * a),
					l = e * a / 2;
				return l - o - (l - o) / a * o
			}
			return 0
		}),
		d6 = r$(hG, (e, t, r) => {
			var n = hG(e, t);
			return null == n || "string" != typeof n.padding ? 0 : d5(e, "xAxis", t, r, n.padding)
		}, (e, t) => {
			if (null == e) return {
				left: 0,
				right: 0
			};
			var r, n, i = e.padding;
			return "string" == typeof i ? {
				left: t,
				right: t
			} : {
				left: (null != (r = i.left) ? r : 0) + t,
				right: (null != (n = i.right) ? n : 0) + t
			}
		}),
		d4 = r$(hQ, (e, t, r) => {
			var n = hQ(e, t);
			return null == n || "string" != typeof n.padding ? 0 : d5(e, "yAxis", t, r, n.padding)
		}, (e, t) => {
			if (null == e) return {
				top: 0,
				bottom: 0
			};
			var r, n, i = e.padding;
			return "string" == typeof i ? {
				top: t,
				bottom: t
			} : {
				top: (null != (r = i.top) ? r : 0) + t,
				bottom: (null != (n = i.bottom) ? n : 0) + t
			}
		}),
		d8 = r$([ao, d6, ah, af, (e, t, r) => r], (e, t, r, n, i) => {
			var a = n.padding;
			return i ? [a.left, r.width - a.right] : [e.left + t.left, e.left + e.width - t.right]
		}),
		d7 = r$([ao, aN, d4, ah, af, (e, t, r) => r], (e, t, r, n, i, a) => {
			var o = i.padding;
			return a ? [n.height - o.bottom, o.top] : "horizontal" === t ? [e.top + e.height - r.bottom, e.top + r.top] : [e.top + r.top, e.top + e.height - r.bottom]
		}),
		d9 = (e, t, r, n) => {
			var i;
			switch (t) {
				case "xAxis":
					return d8(e, r, n);
				case "yAxis":
					return d7(e, r, n);
				case "zAxis":
					return null == (i = h0(e, r)) ? void 0 : i.range;
				case "angleAxis":
					return aJ(e);
				case "radiusAxis":
					return a0(e, r);
				default:
					return
			}
		},
		pe = r$([h1, d9], aU),
		pt = r$([dQ, d2], (e, t) => {
			if (null != t)
				if ("linear" !== e) return t;
				else {
					if (!lq(t)) {
						for (var r, n, i = 0; i < t.length; i++) {
							var a = t[i];
							eZ(a) && ((void 0 === r || a < r) && (r = a), (void 0 === n || a > n) && (n = a))
						}
						return void 0 !== r && void 0 !== n ? [r, n] : void 0
					}
					return t
				}
		}),
		pr = r$([h1, dQ, pt, pe], h$),
		pn = (e, t, r, n) => {
			if (null != r && null != r.dataKey) {
				var i = r.type,
					a = r.scale;
				if (iQ(e, n) && ("number" === i || "auto" !== a)) return t.map(e => e.value)
			}
		},
		pi = r$([aN, dc, h2, un], pn),
		pa = r$([pr], uf);

	function po(e, t) {
		return e.id < t.id ? -1 : +(e.id > t.id)
	}
	r$([pr], function(e) {
		if (null != e) return "invert" in e && "function" == typeof e.invert ? e.invert.bind(e) : hF(e, void 0)
	}), r$([pr, dp], hF), r$([h7, dE, un], (e, t, r) => e.flatMap(e => t[e.id]).filter(Boolean).filter(e => dy(r, e)));
	var pl = (e, t) => t,
		pu = (e, t, r) => r,
		pc = r$(ar, pl, pu, (e, t, r) => e.filter(e => e.orientation === t).filter(e => e.mirror === r).sort(po)),
		ps = r$(an, pl, pu, (e, t, r) => e.filter(e => e.orientation === t).filter(e => e.mirror === r).sort(po)),
		pf = (e, t) => {
			var r = "number" == typeof t.height ? t.height : 30;
			return {
				width: e.width,
				height: r
			}
		},
		ph = r$(ao, hG, pf),
		pd = r$(i9, ao, pc, pl, pu, (e, t, r, n, i) => {
			var a, o = {};
			return r.forEach(r => {
				var l = pf(t, r);
				null == a && (a = ((e, t, r) => {
					switch (t) {
						case "top":
							return e.top;
						case "bottom":
							return r - e.bottom;
						default:
							return 0
					}
				})(t, n, e));
				var u = "top" === n && !i || "bottom" === n && i;
				o[r.id] = a - Number(u) * l.height, a += (u ? -1 : 1) * l.height
			}), o
		}),
		pp = r$(i7, ao, ps, pl, pu, (e, t, r, n, i) => {
			var a, o = {};
			return r.forEach(r => {
				var l = {
					width: "number" == typeof r.width ? r.width : 60,
					height: t.height
				};
				null == a && (a = ((e, t, r) => {
					switch (t) {
						case "left":
							return e.left;
						case "right":
							return r - e.right;
						default:
							return 0
					}
				})(t, n, e));
				var u = "left" === n && !i || "right" === n && i;
				o[r.id] = a - Number(u) * l.width, a += (u ? -1 : 1) * l.width
			}), o
		}),
		py = r$([ao, hG, (e, t) => {
			var r = hG(e, t);
			if (null != r) return pd(e, r.orientation, r.mirror)
		}, (e, t) => t], (e, t, r, n) => {
			if (null != t) {
				var i = null == r ? void 0 : r[n];
				return null == i ? {
					x: e.left,
					y: 0
				} : {
					x: e.left,
					y: i
				}
			}
		});
	r$([ao, hQ, (e, t) => {
		var r = hQ(e, t);
		if (null != r) return pp(e, r.orientation, r.mirror)
	}, (e, t) => t], (e, t, r, n) => {
		if (null != t) {
			var i = null == r ? void 0 : r[n];
			return null == i ? {
				x: 0,
				y: e.top
			} : {
				x: i,
				y: e.top
			}
		}
	});
	var pv = r$(ao, hQ, (e, t) => ({
			width: "number" == typeof t.width ? t.width : 60,
			height: e.height
		})),
		pm = (e, t, r) => {
			switch (t) {
				case "xAxis":
					return ph(e, r).width;
				case "yAxis":
					return pv(e, r).height;
				default:
					return
			}
		},
		pg = (e, t, r, n) => {
			if (null != r) {
				var i = r.allowDuplicatedCategory,
					a = r.type,
					o = r.dataKey,
					l = iQ(e, n),
					u = t.map(e => e.value),
					c = u.filter(e => null != e);
				if (o && l && "category" === a && i && eA(c)) return u
			}
		},
		pb = r$([aN, dc, h1, un], pg),
		px = r$([aN, (e, t, r) => {
			switch (t) {
				case "xAxis":
					return hG(e, r);
				case "yAxis":
					return hQ(e, r);
				default:
					throw Error("Unexpected axis type: ".concat(t))
			}
		}, dQ, pa, pb, pi, d9, d0, un], (e, t, r, n, i, a, o, l, u) => {
			if (null != t) {
				var c = iQ(e, u);
				return {
					angle: t.angle,
					interval: t.interval,
					minTickGap: t.minTickGap,
					orientation: t.orientation,
					tick: t.tick,
					tickCount: t.tickCount,
					tickFormatter: t.tickFormatter,
					ticks: t.ticks,
					type: t.type,
					unit: t.unit,
					axisType: u,
					categoricalDomain: a,
					duplicateDomain: i,
					isCategorical: c,
					niceTicks: l,
					range: o,
					realScaleType: r,
					scale: n
				}
			}
		}),
		pw = r$([aN, h2, dQ, pa, d0, d9, pb, pi, un], (e, t, r, n, i, a, o, l, u) => {
			if (null != t && null != n) {
				var c = iQ(e, u),
					s = t.type,
					f = t.ticks,
					h = t.tickCount,
					d = "scaleBand" === r && "function" == typeof n.bandwidth ? n.bandwidth() / 2 : 2,
					p = "category" === s && n.bandwidth ? n.bandwidth() / d : 0;
				p = "angleAxis" === u && null != a && a.length >= 2 ? 2 * ev(a[0] - a[1]) * p : p;
				var y = f || i;
				return y ? y.map((e, t) => {
					var r = o ? o.indexOf(e) : e,
						i = n.map(r);
					return eZ(i) ? {
						index: t,
						coordinate: i + p,
						value: e,
						offset: p
					} : null
				}).filter(eE) : c && l ? l.map((e, t) => {
					var r = n.map(e);
					return eZ(r) ? {
						coordinate: r + p,
						value: e,
						index: t,
						offset: p
					} : null
				}).filter(eE) : n.ticks ? n.ticks(h).map((e, t) => {
					var r = n.map(e);
					return eZ(r) ? {
						coordinate: r + p,
						value: e,
						index: t,
						offset: p
					} : null
				}).filter(eE) : n.domain().map((e, t) => {
					var r = n.map(e);
					return eZ(r) ? {
						coordinate: r + p,
						value: o ? o[e] : e,
						index: t,
						offset: p
					} : null
				}).filter(eE)
			}
		}),
		pO = r$([aN, h2, pa, d9, pb, pi, un], (e, t, r, n, i, a, o) => {
			if (null != t && null != r && null != n && n[0] !== n[1]) {
				var l = iQ(e, o),
					u = t.tickCount,
					c = 0;
				return (c = "angleAxis" === o && (null == n ? void 0 : n.length) >= 2 ? 2 * ev(n[0] - n[1]) * c : c, l && a) ? a.map((e, t) => {
					var n = r.map(e);
					return eZ(n) ? {
						coordinate: n + c,
						value: e,
						index: t,
						offset: c
					} : null
				}).filter(eE) : r.ticks ? r.ticks(u).map((e, t) => {
					var n = r.map(e);
					return eZ(n) ? {
						coordinate: n + c,
						value: e,
						index: t,
						offset: c
					} : null
				}).filter(eE) : r.domain().map((e, t) => {
					var n = r.map(e);
					return eZ(n) ? {
						coordinate: n + c,
						value: i ? i[e] : e,
						index: t,
						offset: c
					} : null
				}).filter(eE)
			}
		}),
		p_ = r$(h1, pa, (e, t) => {
			if (null != e && null != t) return hH(hH({}, e), {}, {
				scale: t
			})
		}),
		pA = r$([h1, dQ, dZ, pe], h$),
		pS = r$([pA], uf);
	r$((e, t, r) => h0(e, r), pS, (e, t) => {
		if (null != e && null != t) return hH(hH({}, e), {}, {
			scale: t
		})
	});
	var pj = r$([aN, ar, an], (e, t, r) => {
		switch (e) {
			case "horizontal":
				return t.some(e => e.reversed) ? "right-to-left" : "left-to-right";
			case "vertical":
				return r.some(e => e.reversed) ? "bottom-to-top" : "top-to-bottom";
			case "centric":
			case "radial":
				return "left-to-right";
			default:
				return
		}
	});

	function pE(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function pk(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? pE(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pE(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	r$([(e, t, r) => {
		var n;
		return null == (n = e.renderedTicks[t]) ? void 0 : n[r]
	}], e => {
		if (e && 0 !== e.length) return t => {
			var r, n = 1 / 0,
				i = e[0];
			for (var a of e) {
				var o = Math.abs(a.coordinate - t);
				o < n && (n = o, i = a)
			}
			return null == (r = i) ? void 0 : r.value
		}
	});
	var pP = r1({
			name: "cartesianAxis",
			initialState: {
				xAxis: {},
				yAxis: {},
				zAxis: {}
			},
			reducers: {
				addXAxis: {
					reducer(e, t) {
						e.xAxis[t.payload.id] = t.payload
					},
					prepare: rG()
				},
				replaceXAxis: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next;
						void 0 !== e.xAxis[n.id] && (n.id !== i.id && delete e.xAxis[n.id], e.xAxis[i.id] = i)
					},
					prepare: rG()
				},
				removeXAxis: {
					reducer(e, t) {
						delete e.xAxis[t.payload.id]
					},
					prepare: rG()
				},
				addYAxis: {
					reducer(e, t) {
						e.yAxis[t.payload.id] = t.payload
					},
					prepare: rG()
				},
				replaceYAxis: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next;
						void 0 !== e.yAxis[n.id] && (n.id !== i.id && delete e.yAxis[n.id], e.yAxis[i.id] = i)
					},
					prepare: rG()
				},
				removeYAxis: {
					reducer(e, t) {
						delete e.yAxis[t.payload.id]
					},
					prepare: rG()
				},
				addZAxis: {
					reducer(e, t) {
						e.zAxis[t.payload.id] = t.payload
					},
					prepare: rG()
				},
				replaceZAxis: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next;
						void 0 !== e.zAxis[n.id] && (n.id !== i.id && delete e.zAxis[n.id], e.zAxis[i.id] = i)
					},
					prepare: rG()
				},
				removeZAxis: {
					reducer(e, t) {
						delete e.zAxis[t.payload.id]
					},
					prepare: rG()
				},
				updateYAxisWidth(e, t) {
					var r = t.payload,
						n = r.id,
						i = r.width,
						a = e.yAxis[n];
					if (a) {
						var o, l = a.widthHistory || [];
						if (3 === l.length && l[0] === l[2] && i === l[1] && i !== a.width && 1 >= Math.abs(i - (null != (o = l[0]) ? o : 0))) return;
						var u = [...l, i].slice(-3);
						e.yAxis[n] = pk(pk({}, a), {}, {
							width: i,
							widthHistory: u
						})
					}
				},
				updateXAxisHeight(e, t) {
					var r = t.payload,
						n = r.id,
						i = r.height,
						a = e.xAxis[n];
					if (a) {
						var o, l = a.heightHistory || [];
						if (3 === l.length && l[0] === l[2] && i === l[1] && i !== a.height && 1 >= Math.abs(i - (null != (o = l[0]) ? o : 0))) return;
						var u = [...l, i].slice(-3);
						e.xAxis[n] = pk(pk({}, a), {}, {
							height: i,
							heightHistory: u
						})
					}
				}
			}
		}),
		pM = pP.actions,
		pI = pM.addXAxis,
		pC = pM.replaceXAxis,
		pT = pM.removeXAxis,
		pD = (pM.addYAxis, pM.replaceYAxis, pM.removeYAxis, pM.addZAxis, pM.replaceZAxis, pM.removeZAxis, pM.updateYAxisWidth, pM.updateXAxisHeight),
		pN = pP.reducer,
		pz = e => e.options.defaultTooltipEventType,
		pL = e => e.options.validateTooltipEventTypes;

	function pR(e, t, r) {
		if (null == e) return t;
		var n = e ? "axis" : "item";
		return null == r ? t : r.includes(n) ? n : t
	}

	function pB(e, t) {
		return pR(t, pz(e), pL(e))
	}
	var p$ = (e, t) => {
		var r, n = Number(t);
		if (!em(n) && null != t) return n >= 0 ? null == e || null == (r = e[n]) ? void 0 : r.value : void 0
	};

	function pU(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function pF(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? pU(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pU(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var pK = (e, t, r, n) => {
			if (null == t) return ld;
			var i, a, o, l = (i = e, a = t, o = r, "axis" === a ? "click" === o ? i.axisInteraction.click : i.axisInteraction.hover : "click" === o ? i.itemInteraction.click : i.itemInteraction.hover);
			if (null == l) return ld;
			if (l.active) return l;
			if (e.keyboardInteraction.active) return e.keyboardInteraction;
			if (e.syncInteraction.active && null != e.syncInteraction.index) return e.syncInteraction;
			var u = !0 === e.settings.active;
			if (null != l.index) {
				if (u) return pF(pF({}, l), {}, {
					active: !0
				})
			} else if (null != n) return {
				active: !0,
				coordinate: void 0,
				dataKey: void 0,
				index: n,
				graphicalItemId: void 0
			};
			return pF(pF({}, ld), {}, {
				coordinate: l.coordinate
			})
		},
		pH = (e, t, r, n) => {
			var i = null == e ? void 0 : e.index;
			if (null == i) return null;
			var a = Number(i);
			if (!eZ(a)) return i;
			var o = 1 / 0;
			t.length > 0 && (o = t.length - 1);
			var l = Math.max(0, Math.min(a, o)),
				u = t[l];
			return null == u ? String(l) : ! function(e, t, r) {
				if (null == r || null == t) return !0;
				var n = iZ(e, t);
				return !(null != n && lq(r)) || function(e, t) {
					var r = function(e) {
							if ("number" == typeof e) return Number.isFinite(e) ? e : void 0;
							if (e instanceof Date) {
								var t = e.valueOf();
								return Number.isFinite(t) ? t : void 0
							}
							var r = Number(e);
							return Number.isFinite(r) ? r : void 0
						}(e),
						n = t[0],
						i = t[1];
					if (void 0 === r) return !1;
					var a = Math.min(n, i),
						o = Math.max(n, i);
					return r >= a && r <= o
				}(n, r)
			}(u, r, n) ? null : String(l)
		},
		pq = (e, t, r, n, i, a, o) => {
			if (null != a) {
				var l = o[0],
					u = null == l ? void 0 : l.getPosition(a);
				if (null != u) return u;
				var c = null == i ? void 0 : i[Number(a)];
				if (c)
					if ("horizontal" === r) return {
						x: c.coordinate,
						y: (n.top + t) / 2
					};
					else return {
						x: (n.left + e) / 2,
						y: c.coordinate
					}
			}
		},
		pW = (e, t, r, n) => {
			if ("axis" === t) return e.tooltipItemPayloads;
			if (0 === e.tooltipItemPayloads.length) return [];
			if (i = "hover" === r ? e.itemInteraction.hover.graphicalItemId : e.itemInteraction.click.graphicalItemId, e.syncInteraction.active && null == i) return e.tooltipItemPayloads;
			if (null == i && (null != n || e.keyboardInteraction.active)) {
				var i, a = e.tooltipItemPayloads[0];
				return null != a ? [a] : []
			}
			return e.tooltipItemPayloads.filter(e => {
				var t;
				return (null == (t = e.settings) ? void 0 : t.graphicalItemId) === i
			})
		},
		pV = e => e.options.tooltipPayloadSearcher,
		pY = e => e.tooltip;

	function pX(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function pG(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? pX(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : pX(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function pZ(e) {
		if ("string" == typeof e) return e
	}
	var pQ = (e, t, r, n, i, a, o) => {
			if (null != t && null != a) {
				var l = r.chartData,
					u = r.computedData,
					c = r.dataStartIndex,
					s = r.dataEndIndex;
				return e.reduce((e, r) => {
					var f, h, d, p = r.dataDefinedOnItem,
						y = r.settings,
						v = null != p ? p : l,
						m = Array.isArray(v) ? iF(v, c, s) : v,
						g = null != (f = null == y ? void 0 : y.dataKey) ? f : n,
						b = null == y ? void 0 : y.nameKey;
					return n && Array.isArray(m) && !Array.isArray(m[0]) && "axis" === o ? null == (h = function(e, t, r) {
						if (e && e.length) return e.find(e => e && ("function" == typeof t ? t(e) : ed(e, t)) === r)
					}(m, n, i)) && (h = a(m, t, u, b)) : h = a(m, t, u, b), Array.isArray(h) ? h.forEach(t => {
						var r, n, i = function(e) {
								if (null != e && "object" == typeof e) {
									var t, r = "name" in e ? function(e) {
											if ("string" == typeof e || "number" == typeof e) return e
										}(e.name) : void 0,
										n = "unit" in e ? function(e) {
											if ("string" == typeof e || "number" == typeof e || "boolean" == typeof e) return e
										}(e.unit) : void 0,
										i = "dataKey" in e ? "string" == typeof(t = e.dataKey) || "number" == typeof t ? t : "function" == typeof t ? e => t(e) : void 0 : void 0,
										a = "payload" in e ? e.payload : void 0;
									return {
										name: r,
										unit: n,
										dataKey: i,
										payload: a,
										color: "color" in e ? pZ(e.color) : void 0,
										fill: "fill" in e ? pZ(e.fill) : void 0
									}
								}
							}(t),
							a = null == i ? void 0 : i.name,
							o = null == i ? void 0 : i.dataKey,
							l = null == i ? void 0 : i.payload,
							u = pG(pG({}, y), {}, {
								name: a,
								unit: null == i ? void 0 : i.unit,
								color: null != (r = null == i ? void 0 : i.color) ? r : null == y ? void 0 : y.color,
								fill: null != (n = null == i ? void 0 : i.fill) ? n : null == y ? void 0 : y.fill
							});
						e.push(i4({
							tooltipEntrySettings: u,
							dataKey: o,
							payload: l,
							value: iZ(l, o),
							name: null == a ? void 0 : String(a)
						}))
					}) : e.push(i4({
						tooltipEntrySettings: y,
						dataKey: g,
						payload: h,
						value: iZ(h, g),
						name: null != (d = iZ(h, b)) ? d : null == y ? void 0 : y.name
					})), e
				}, [])
			}
		},
		pJ = r$([dv, h3, l9], hU),
		p0 = r$([e => e.graphicalItems.cartesianItems, e => e.graphicalItems.polarItems], (e, t) => [...e, ...t]),
		p1 = r$([uc, us], h5),
		p2 = r$([p0, dv, p1], h8, {
			memoizeOptions: {
				resultEqualityCheck: a3
			}
		}),
		p3 = r$([p2], e => e.filter(ul)),
		p5 = r$([p2], dr, {
			memoizeOptions: {
				resultEqualityCheck: a3
			}
		}),
		p6 = r$([p2], e => e.some(e => !e.data)),
		p4 = r$([p5, lR], da),
		p8 = r$([p3, lR, dv], uo),
		p7 = r$([p4, dv, p2, lR, p6, p5], du),
		p9 = r$([dv], d_),
		ye = r$([dv], e => e.allowDataOverflow),
		yt = r$([p9, ye], lV),
		yr = r$([p2], e => e.filter(ul)),
		yn = r$([p8, yr, l8, l7], db),
		yi = r$([yn, lR, uc, yt], dw),
		ya = r$([p2], de),
		yo = r$([p4, dv, ya, dE, uc, lF], dP, {
			memoizeOptions: {
				resultEqualityCheck: uu
			}
		}),
		yl = r$([dC, uc, us], dT),
		yu = r$([yl, uc], dB),
		yc = r$([dN, uc, us], dT),
		ys = r$([yc, uc], dU),
		yf = r$([dL, uc, us], dT),
		yh = r$([yf, uc], dK),
		yd = r$([yu, yh, ys], dk),
		yp = r$([dv, p9, yt, yi, yo, yd, aN, uc], dW),
		yy = r$([dv, aN, p4, p7, l8, uc, yp], dG),
		yv = r$([yy, dv, pJ], dJ),
		ym = r$([dv, yy, yv, uc], d1),
		yg = e => {
			var t = uc(e),
				r = us(e);
			return d9(e, t, r, !1)
		},
		yb = r$([dv, yg], aU),
		yx = r$([dv, pJ, ym, yb], h$),
		yw = r$([yx], uf),
		yO = r$([aN, p7, dv, uc], pg),
		y_ = r$([aN, p7, dv, uc], pn),
		yA = r$([aN, dv, pJ, yw, yg, yO, y_, uc], (e, t, r, n, i, a, o, l) => {
			if (t) {
				var u = t.type,
					c = iQ(e, l);
				if (n) {
					var s = "scaleBand" === r && n.bandwidth ? n.bandwidth() / 2 : 2,
						f = "category" === u && n.bandwidth ? n.bandwidth() / s : 0;
					return (f = "angleAxis" === l && null != i && (null == i ? void 0 : i.length) >= 2 ? 2 * ev(i[0] - i[1]) * f : f, c && o) ? o.map((e, t) => {
						var r = n.map(e);
						return eZ(r) ? {
							coordinate: r + f,
							value: e,
							index: t,
							offset: f
						} : null
					}).filter(eE) : n.domain().map((e, t) => {
						var r = n.map(e);
						return eZ(r) ? {
							coordinate: r + f,
							value: a ? a[e] : e,
							index: t,
							offset: f
						} : null
					}).filter(eE)
				}
			}
		}),
		yS = r$([pz, pL, e => e.tooltip.settings], (e, t, r) => pR(r.shared, e, t)),
		yj = e => e.tooltip.settings.trigger,
		yE = e => e.tooltip.settings.defaultIndex,
		yk = r$([pY, yS, yj, yE], pK),
		yP = r$([yk, p4, dm, yy], pH),
		yM = r$([yA, yP], p$),
		yI = r$([yk], e => {
			if (e) return e.dataKey
		}),
		yC = r$([yk], e => {
			if (e) return e.graphicalItemId
		}),
		yT = r$([pY, yS, yj, yE], pW),
		yD = r$([i7, i9, aN, ao, yA, yE, yT], pq),
		yN = r$([yk, yD], (e, t) => null != e && e.coordinate ? e.coordinate : t),
		yz = r$([yk], e => {
			var t;
			return null != (t = null == e ? void 0 : e.active) && t
		}),
		yL = r$([yT, yP, lR, dm, yM, pV, yS], pQ);
	r$([yL], e => {
		if (null != e) return Array.from(new Set(e.map(e => e.payload).filter(e => null != e)))
	});
	var yR = r$([ao], e => ({
			top: e.top,
			bottom: e.bottom,
			left: e.left,
			right: e.right
		})),
		yB = r$([yR, i7, i9], (e, t, r) => {
			if (e && null != t && null != r) return {
				x: e.left,
				y: e.top,
				width: Math.max(0, t - e.left - e.right),
				height: Math.max(0, r - e.top - e.bottom)
			}
		});

	function y$(e, t) {
		var r, n, i = tv(t => hG(t, e)),
			a = tv(e => hQ(e, t)),
			o = null != (r = null == i ? void 0 : i.allowDataOverflow) ? r : hY.allowDataOverflow,
			l = null != (n = null == a ? void 0 : a.allowDataOverflow) ? n : hZ.allowDataOverflow;
		return {
			needClip: o || l,
			needClipX: o,
			needClipY: l
		}
	}

	function yU(e) {
		var t = e.xAxisId,
			r = e.yAxisId,
			n = e.clipPathId,
			i = tv(yB),
			a = y$(t, r),
			o = a.needClipX,
			l = a.needClipY,
			u = a.needClip,
			c = tv(e => d8(e, t, !1)),
			s = tv(e => d7(e, r, !1));
		if (!u || !i) return null;
		var f = i.x,
			h = i.y,
			d = i.width,
			p = i.height,
			y = o && c ? Math.min(c[0], c[1]) : f - d / 2,
			v = l && s ? Math.min(s[0], s[1]) : h - p / 2,
			m = o && c ? Math.abs(c[1] - c[0]) : 2 * d,
			g = l && s ? Math.abs(s[1] - s[0]) : 2 * p;
		return N.createElement("clipPath", {
			id: "clipPath-".concat(n)
		}, N.createElement("rect", {
			x: y,
			y: v,
			width: m,
			height: g
		}))
	}

	function yF(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var yK = (e, t, r) => {
		var n = null != r ? r : e;
		if (null != n) return e_(n, t, 0)
	};

	function yH(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function yq(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? yH(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : yH(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function yW(e, t) {
		var r, n;
		return null != (r = null == (n = e.graphicalItems.cartesianItems.find(e => e.id === t)) ? void 0 : n.xAxisId) ? r : 0
	}

	function yV(e, t) {
		var r, n;
		return null != (r = null == (n = e.graphicalItems.cartesianItems.find(e => e.id === t)) ? void 0 : n.yAxisId) ? r : 0
	}
	var yY = r$([h6, (e, t) => t], (e, t) => e.filter(e => "bar" === e.type).find(e => e.id === t)),
		yX = r$([yY], e => null == e ? void 0 : e.maxBarSize),
		yG = r$([aN, h6, yW, yV, (e, t, r) => r], (e, t, r, n, i) => t.filter(t => "horizontal" === e ? t.xAxisId === r : t.yAxisId === n).filter(e => e.isPanorama === i).filter(e => !1 === e.hide).filter(e => "bar" === e.type)),
		yZ = r$([yG, e => e.rootProps.barSize, (e, t) => {
			var r = aN(e),
				n = yW(e, t),
				i = yV(e, t);
			if (null != n && null != i) return "horizontal" === r ? pm(e, "xAxis", n) : pm(e, "yAxis", i)
		}], (e, t, r) => {
			var n = e.filter(ul),
				i = e.filter(e => null == e.stackId);
			return [...Object.entries(n.reduce((e, t) => {
				var r = e[t.stackId];
				return null == r && (r = []), r.push(t), e[t.stackId] = r, e
			}, {})).map(e => {
				var n, i = function(e) {
						if (Array.isArray(e)) return e
					}(e) || function(e) {
						var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
						if (null != t) {
							var r, n, i, a, o = [],
								l = !0,
								u = !1;
							try {
								i = (t = t.call(e)).next, !1;
								for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
							} catch (e) {
								u = !0, n = e
							} finally {
								try {
									if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
								} finally {
									if (u) throw n
								}
							}
							return o
						}
					}(e) || function(e) {
						if (e) {
							if ("string" == typeof e) return yF(e, 2);
							var t = ({}).toString.call(e).slice(8, -1);
							return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? yF(e, 2) : void 0
						}
					}(e) || function() {
						throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
					}(),
					a = i[0],
					o = i[1];
				return {
					stackId: a,
					dataKeys: o.map(e => e.dataKey),
					barSize: yK(t, r, null == (n = o[0]) ? void 0 : n.barSize)
				}
			}), ...i.map(e => ({
				stackId: void 0,
				dataKeys: [e.dataKey].filter(e => null != e),
				barSize: yK(t, r, e.barSize)
			}))]
		}),
		yQ = (e, t, r) => {
			var n, i, a = aN(e),
				o = yW(e, t),
				l = yV(e, t);
			if (null != o && null != l) return "horizontal" === a ? (n = p_(e, "xAxis", o, r), i = pO(e, "xAxis", o, r)) : (n = p_(e, "yAxis", l, r), i = pO(e, "yAxis", l, r)), i6(n, i)
		},
		yJ = r$([yZ, l6, e => e.rootProps.barGap, l4, (e, t, r) => {
			var n, i, a, o, l = yY(e, t);
			if (null == l) return 0;
			var u = yW(e, t),
				c = yV(e, t);
			if (null == u || null == c) return 0;
			var s = aN(e),
				f = l6(e),
				h = l.maxBarSize;
			return "horizontal" === s ? (a = p_(e, "xAxis", u, r), o = pO(e, "xAxis", u, r)) : (a = p_(e, "yAxis", c, r), o = pO(e, "yAxis", c, r)), null != (n = null != (i = i6(a, o, !0)) ? i : null == h ? f : h) ? n : 0
		}, yQ, yX], (e, t, r, n, i, a, o) => {
			var l = function(e, t, r, n, i) {
				var a, o, l = n.length;
				if (!(l < 1)) {
					var u = e_(e, r, 0, !0),
						c = [];
					if (eZ(null == (a = n[0]) ? void 0 : a.barSize)) {
						var s = !1,
							f = r / l,
							h = n.reduce((e, t) => e + (t.barSize || 0), 0);
						(h += (l - 1) * u) >= r && (h -= (l - 1) * u, u = 0), h >= r && f > 0 && (s = !0, f *= .9, h = l * f);
						var d = {
							offset: Math.round((r - h) / 2) - u,
							size: 0
						};
						o = n.reduce((e, t) => {
							var r, n = {
									stackId: t.stackId,
									dataKeys: t.dataKeys,
									position: {
										offset: d.offset + d.size + u,
										size: s ? f : null != (r = t.barSize) ? r : 0
									}
								},
								i = [...e, n];
							return d = n.position, i
						}, c)
					} else {
						var p = e_(t, r, 0, !0);
						r - 2 * p - (l - 1) * u <= 0 && (u = 0);
						var y = (r - 2 * p - (l - 1) * u) / l;
						y > 1 && (y = Math.round(y));
						var v = eZ(i) ? Math.min(y, i) : y;
						o = n.reduce((e, t, r) => [...e, {
							stackId: t.stackId,
							dataKeys: t.dataKeys,
							position: {
								offset: p + l * (y - v) / 2 + (v + u) * r,
								size: v
							}
						}], c)
					}
					return o
				}
			}(r, n, i !== a ? i : a, e, null == o ? t : o);
			return i !== a && null != l && (l = l.map(e => yq(yq({}, e), {}, {
				position: yq(yq({}, e.position), {}, {
					offset: e.position.offset - i / 2
				})
			}))), l
		}),
		y0 = r$([yJ, yY], (e, t) => {
			if (null != e && null != t) {
				var r = e.find(e => e.stackId === t.stackId && null != t.dataKey && e.dataKeys.includes(t.dataKey));
				if (null != r) return r.position
			}
		}),
		y1 = r$([(e, t, r) => {
			var n = aN(e),
				i = yW(e, t),
				a = yV(e, t);
			if (null != i && null != a) return "horizontal" === n ? dx(e, "yAxis", a, r) : dx(e, "xAxis", i, r)
		}, yY], (e, t) => {
			var r = ua(t);
			if (!e || null == r || null == t) return;
			var n = t.stackId;
			if (null != n) {
				var i = e[n];
				if (i) {
					var a = i.stackedData;
					if (a) return a.find(e => e.key === r)
				}
			}
		}),
		y2 = r$([ao, au, (e, t, r) => {
			var n = yW(e, t);
			if (null != n) return p_(e, "xAxis", n, r)
		}, (e, t, r) => {
			var n = yV(e, t);
			if (null != n) return p_(e, "yAxis", n, r)
		}, (e, t, r) => {
			var n = yW(e, t);
			if (null != n) return pO(e, "xAxis", n, r)
		}, (e, t, r) => {
			var n = yV(e, t);
			if (null != n) return pO(e, "yAxis", n, r)
		}, y0, aN, (e, t, r) => r ? lB(e) : lR(e), yQ, y1, yY, (e, t, r, n) => n], (e, t, r, n, i, a, o, l, u, c, s, f, h) => {
			var d, p = u.chartData,
				y = u.dataStartIndex,
				v = u.dataEndIndex;
			if (null != f && null != o && null != t && ("horizontal" === l || "vertical" === l) && null != r && null != n && null != i && null != a && null != c) {
				var m, g, b, x, w, O, _, A, S, j, E, k, P, M, I, C, T, D, N, z, L, R, B = f.data;
				if (null != (d = null != B && B.length > 0 ? B : null == p ? void 0 : p.slice(y, v + 1))) {
					return g = (m = {
						layout: l,
						barSettings: f,
						pos: o,
						parentViewBox: t,
						bandSize: c,
						xAxis: r,
						yAxis: n,
						xAxisTicks: i,
						yAxisTicks: a,
						stackedData: s,
						displayedData: d,
						offset: e,
						cells: h,
						dataStartIndex: y
					}).layout, x = (b = m.barSettings).dataKey, w = b.minPointSize, O = b.hasCustomShape, _ = m.pos, A = m.bandSize, S = m.xAxis, j = m.yAxis, E = m.xAxisTicks, k = m.yAxisTicks, P = m.stackedData, M = m.displayedData, I = m.offset, C = m.cells, T = m.parentViewBox, D = m.dataStartIndex, N = "horizontal" === g ? j : S, z = P ? N.scale.domain() : null, L = (e => {
						var t = e.numericAxis,
							r = t.scale.domain();
						if ("number" === t.type) {
							var n = Math.min(r[0], r[1]),
								i = Math.max(r[0], r[1]);
							return n <= 0 && i >= 0 ? 0 : i < 0 ? i : n
						}
						return r[0]
					})({
						numericAxis: N
					}), R = N.scale.map(L), M.map((e, t) => {
						if (P) {
							var r = P[t + D];
							if (null == r) return null;
							i = ((e, t) => {
								if (!t || 2 !== t.length || !eb(t[0]) || !eb(t[1])) return e;
								var r = Math.min(t[0], t[1]),
									n = Math.max(t[0], t[1]),
									i = [e[0], e[1]];
								return (!eb(e[0]) || e[0] < r) && (i[0] = r), (!eb(e[1]) || e[1] > n) && (i[1] = n), i[0] > n && (i[0] = n), i[1] < r && (i[1] = r), i
							})(r, z)
						} else Array.isArray(i = iZ(e, x)) || (i = [L, i]);
						var n = lh(w, 0)(i[1], t);
						if ("horizontal" === g) {
							var i, a, o, l, u, c, s, f = j.scale.map(i[0]),
								h = j.scale.map(i[1]);
							if (null == f || null == h) return null;
							a = i2({
								axis: S,
								ticks: E,
								bandSize: A,
								offset: _.offset,
								entry: e,
								index: t
							}), o = null != (s = null != h ? h : f) ? s : void 0, l = _.size;
							var d = f - h;
							if (u = em(d) ? 0 : d, c = {
									x: a,
									y: I.top,
									width: l,
									height: I.height
								}, Math.abs(n) > 0 && Math.abs(u) < Math.abs(n)) {
								var p = ev(u || n) * (Math.abs(n) - Math.abs(u));
								o -= p, u += p
							}
						} else {
							var y = S.scale.map(i[0]),
								v = S.scale.map(i[1]);
							if (null == y || null == v) return null;
							if (a = y, o = i2({
									axis: j,
									ticks: k,
									bandSize: A,
									offset: _.offset,
									entry: e,
									index: t
								}), l = v - y, u = _.size, c = {
									x: I.left,
									y: o,
									width: I.width,
									height: u
								}, Math.abs(n) > 0 && Math.abs(l) < Math.abs(n)) {
								var m = ev(l || n) * (Math.abs(n) - Math.abs(l));
								l += m
							}
						}
						return null != a && null != o && null != l && null != u && (O || 0 !== l && 0 !== u) ? vG(vG({}, e), {}, {
							stackedBarStart: R,
							x: a,
							y: o,
							width: l,
							height: u,
							value: P ? i : i[1],
							payload: e,
							background: c,
							tooltipPosition: {
								x: a + l / 2,
								y: o + u / 2
							},
							parentViewBox: T,
							originalDataIndex: t
						}, C && C[t] && C[t].props) : null
					}).filter(Boolean)
				}
			}
		}),
		y3 = r1({
			name: "legend",
			initialState: {
				settings: {
					layout: "horizontal",
					align: "center",
					verticalAlign: "bottom",
					itemSorter: "value",
					position: void 0,
					offset: 0
				},
				size: {
					width: 0,
					height: 0
				},
				payload: []
			},
			reducers: {
				setLegendSize(e, t) {
					e.size.width = t.payload.width, e.size.height = t.payload.height
				},
				setLegendSettings(e, t) {
					e.settings.align = t.payload.align, e.settings.layout = t.payload.layout, e.settings.verticalAlign = t.payload.verticalAlign, e.settings.itemSorter = t.payload.itemSorter, e.settings.position = t.payload.position, e.settings.offset = t.payload.offset
				},
				addLegendPayload: {
					reducer(e, t) {
						e.payload.push(t.payload)
					},
					prepare: rG()
				},
				replaceLegendPayload: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next,
							a = rx(e).payload.indexOf(n);
						a > -1 && (e.payload[a] = i)
					},
					prepare: rG()
				},
				removeLegendPayload: {
					reducer(e, t) {
						var r = rx(e).payload.indexOf(t.payload);
						r > -1 && e.payload.splice(r, 1)
					},
					prepare: rG()
				}
			}
		}),
		y5 = y3.actions,
		y6 = y5.setLegendSize,
		y4 = y5.setLegendSettings,
		y8 = y5.addLegendPayload,
		y7 = y5.replaceLegendPayload,
		y9 = y5.removeLegendPayload,
		ve = y3.reducer;

	function vt(e) {
		var t = e.legendPayload,
			r = th(),
			n = as(),
			i = (0, N.useRef)(null);
		return (0, N.useLayoutEffect)(() => {
			n || (null === i.current ? r(y8(t)) : i.current !== t && r(y7({
				prev: i.current,
				next: t
			})), i.current = t)
		}, [r, n, t]), (0, N.useLayoutEffect)(() => () => {
			i.current && (r(y9(i.current)), i.current = null)
		}, [r]), null
	}

	function vr(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var vn = null != (S = N["useId".toString()]) ? S : () => {
			var e;
			return (function(e) {
				if (Array.isArray(e)) return e
			}(e = N.useState(() => eO("uid-"))) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 1 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(e) || function(e) {
				if (e) {
					if ("string" == typeof e) return vr(e, 1);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? vr(e, 1) : void 0
				}
			}(e) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}())[0]
		},
		vi = (0, N.createContext)(void 0),
		va = e => {
			var t, r, n, i = e.id,
				a = e.type,
				o = e.children,
				l = (t = "recharts-".concat(a), r = i, n = vn(), r || (t ? "".concat(t, "-").concat(n) : n));
			return N.createElement(vi.Provider, {
				value: l
			}, o(l))
		},
		vo = r1({
			name: "graphicalItems",
			initialState: {
				cartesianItems: [],
				polarItems: []
			},
			reducers: {
				addCartesianGraphicalItem: {
					reducer(e, t) {
						e.cartesianItems.push(t.payload)
					},
					prepare: rG()
				},
				replaceCartesianGraphicalItem: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next,
							a = rx(e).cartesianItems.indexOf(n);
						a > -1 && (e.cartesianItems[a] = i)
					},
					prepare: rG()
				},
				removeCartesianGraphicalItem: {
					reducer(e, t) {
						var r = rx(e).cartesianItems.indexOf(t.payload);
						r > -1 && e.cartesianItems.splice(r, 1)
					},
					prepare: rG()
				},
				addPolarGraphicalItem: {
					reducer(e, t) {
						e.polarItems.push(t.payload)
					},
					prepare: rG()
				},
				removePolarGraphicalItem: {
					reducer(e, t) {
						var r = rx(e).polarItems.indexOf(t.payload);
						r > -1 && e.polarItems.splice(r, 1)
					},
					prepare: rG()
				},
				replacePolarGraphicalItem: {
					reducer(e, t) {
						var r = t.payload,
							n = r.prev,
							i = r.next,
							a = rx(e).polarItems.indexOf(n);
						a > -1 && (e.polarItems[a] = i)
					},
					prepare: rG()
				}
			}
		}),
		vl = vo.actions,
		vu = vl.addCartesianGraphicalItem,
		vc = vl.replaceCartesianGraphicalItem,
		vs = vl.removeCartesianGraphicalItem,
		vf = (vl.addPolarGraphicalItem, vl.removePolarGraphicalItem, vl.replacePolarGraphicalItem, vo.reducer),
		vh = (0, N.memo)(e => {
			var t = th(),
				r = (0, N.useRef)(null);
			return (0, N.useLayoutEffect)(() => {
				null === r.current ? t(vu(e)) : r.current !== e && t(vc({
					prev: r.current,
					next: e
				})), r.current = e
			}, [t, e]), (0, N.useLayoutEffect)(() => () => {
				r.current && (t(vs(r.current)), r.current = null)
			}, [t]), null
		});

	function vd(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var vp = "index",
		vy = "append";

	function vv(e, t) {
		var r = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : [],
			n = [];
		for (var i of r) n.push({
			status: "removed",
			prev: i
		});
		for (var a = 0; a < t.length; a++) {
			var o = e[a],
				l = t[a];
			null != o ? n.push({
				status: "matched",
				prev: o,
				next: l
			}) : n.push({
				status: "added",
				next: l
			})
		}
		return n
	}

	function vm(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function vg(e) {
		var t, r, n, i, a, o = e.animationInput,
			l = e.animationIdPrefix,
			u = e.items,
			c = e.previousItemsRef,
			s = e.isAnimationActive,
			f = e.animationBegin,
			h = e.animationDuration,
			d = e.animationEasing,
			p = e.onAnimationStart,
			y = e.onAnimationEnd,
			v = e.animationInterpolateFn,
			m = e.animationMatchBy,
			g = e.shouldUpdatePreviousRef,
			b = e.children,
			x = e.layout,
			w = o6(o, l),
			O = (t = (0, N.useRef)(w), r = (0, N.useRef)(c.current), n = (0, N.useRef)(!0), t.current !== w && (t.current = w, r.current = c.current, n.current = !1), i = (0, N.useCallback)(function(e, t) {
				var i = !(arguments.length > 2) || void 0 === arguments[2] || arguments[2];
				if (0 === t) {
					n.current = !0;
					return
				}
				1 === t && (r.current = e), t > 0 && n.current && i && (c.current = e)
			}, [c]), {
				startValue: r.current,
				syncStepValue: i
			}),
			_ = null != (a = O.startValue) ? a : null,
			A = function(e, t, r) {
				var n;
				return null == t ? null : null == e ? t.map(e => ({
					status: "added",
					next: e
				})) : r === vp ? (n = e.length / t.length, vv(t.map((t, r) => e[Math.floor(r * n)]), t)) : r === vy ? vv(t.map((t, r) => e[r]), t) : function(e, t, r) {
					var n = function(e, t) {
							for (var r = new Map, n = 0; n < e.length; n++) {
								var i = e[n];
								if (null != i) {
									var a = t(i, n);
									null == a || r.has(a) || r.set(a, i)
								}
							}
							return r
						}(e, r),
						i = new Set,
						a = t.map((e, t) => {
							var a = r(e, t);
							if (null != a) {
								var o = n.get(a);
								if (void 0 !== o) return i.add(a), o
							}
						}),
						o = [];
					for (var l of n) {
						var u = function(e) {
								if (Array.isArray(e)) return e
							}(l) || function(e) {
								var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
								if (null != t) {
									var r, n, i, a, o = [],
										l = !0,
										u = !1;
									try {
										i = (t = t.call(e)).next, !1;
										for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
									} catch (e) {
										u = !0, n = e
									} finally {
										try {
											if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
										} finally {
											if (u) throw n
										}
									}
									return o
								}
							}(l) || function(e) {
								if (e) {
									if ("string" == typeof e) return vd(e, 2);
									var t = ({}).toString.call(e).slice(8, -1);
									return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? vd(e, 2) : void 0
								}
							}(l) || function() {
								throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
							}(),
							c = u[0],
							s = u[1];
						i.has(c) || o.push(s)
					}
					return vv(a, t, o)
				}(e, t, r)
			}(_, u, null != m ? m : vp);
		return N.createElement(o5, {
			animationId: w,
			begin: f,
			duration: h,
			isActive: s,
			easing: d,
			onAnimationEnd: y,
			onAnimationStart: p,
			key: w
		}, e => {
			var t = null == u ? u : v(A, e, x),
				r = g ? g(e) : e > 0;
			return (O.syncStepValue(t, e, r), null == t) ? null : b(t, e, null == _)
		})
	}
	e.i(807781);
	let vb = {
			notify() {},
			get: () => []
		},
		vx = "u" > typeof window && void 0 !== window.document && void 0 !== window.document.createElement,
		vw = "u" > typeof navigator && "ReactNative" === navigator.product,
		vO = vx || vw ? N.useLayoutEffect : N.useEffect;

	function v_(e, t) {
		return e === t ? 0 !== e || 0 !== t || 1 / e == 1 / t : e != e && t != t
	}
	let vA = Symbol.for("react-redux-context"),
		vS = "u" > typeof globalThis ? globalThis : {},
		vj = function() {
			if (!N.createContext) return {};
			let e = vS[vA] ??= new Map,
				t = e.get(N.createContext);
			return t || (t = N.createContext(null), e.set(N.createContext, t)), t
		}();

	function vE(e) {
		let {
			children: t,
			context: r,
			serverState: n,
			store: i
		} = e, a = N.useMemo(() => {
			let e = function(e) {
				let t, r = vb,
					n = 0,
					i = !1;

				function a() {
					u.onStateChange && u.onStateChange()
				}

				function o() {
					if (n++, !t) {
						let n, i;
						t = e.subscribe(a), n = null, i = null, r = {
							clear() {
								n = null, i = null
							},
							notify() {
								let e = n;
								for (; e;) e.callback(), e = e.next
							},
							get() {
								let e = [],
									t = n;
								for (; t;) e.push(t), t = t.next;
								return e
							},
							subscribe(e) {
								let t = !0,
									r = i = {
										callback: e,
										next: null,
										prev: i
									};
								return r.prev ? r.prev.next = r : n = r,
									function() {
										t && null !== n && (t = !1, r.next ? r.next.prev = r.prev : i = r.prev, r.prev ? r.prev.next = r.next : n = r.next)
									}
							}
						}
					}
				}

				function l() {
					n--, t && 0 === n && (t(), t = void 0, r.clear(), r = vb)
				}
				let u = {
					addNestedSub: function(e) {
						o();
						let t = r.subscribe(e),
							n = !1;
						return () => {
							n || (n = !0, t(), l())
						}
					},
					notifyNestedSubs: function() {
						r.notify()
					},
					handleChangeWrapper: a,
					isSubscribed: function() {
						return i
					},
					trySubscribe: function() {
						i || (i = !0, o())
					},
					tryUnsubscribe: function() {
						i && (i = !1, l())
					},
					getListeners: () => r
				};
				return u
			}(i);
			return {
				store: i,
				subscription: e,
				getServerState: null != n ? () => n : void 0
			}
		}, [i, n]), o = N.useMemo(() => i.getState(), [i]);
		return vO(() => {
			let {
				subscription: e
			} = a;
			return e.onStateChange = e.notifyNestedSubs, e.trySubscribe(), o !== i.getState() && e.notifyNestedSubs(), () => {
				e.tryUnsubscribe(), e.onStateChange = void 0
			}
		}, [a, o]), N.createElement((r || vj).Provider, {
			value: a
		}, t)
	}

	function vk(e = vj) {
		return function() {
			return N.useContext(e)
		}
	}
	let vP = vk();
	var vM = new Set(["axisLine", "tickLine", "activeBar", "activeDot", "activeLabel", "activeShape", "allowEscapeViewBox", "background", "cursor", "dot", "label", "line", "margin", "padding", "position", "shape", "style", "tick", "wrapperStyle", "radius", "throttledEvents"]);

	function vI(e, t) {
		for (var r of new Set([...Object.keys(e), ...Object.keys(t)]))
			if (vM.has(r)) {
				if (null == e[r] && null == t[r]) continue;
				if (! function(e, t) {
						if (v_(e, t)) return !0;
						if ("object" != typeof e || null === e || "object" != typeof t || null === t) return !1;
						let r = Object.keys(e),
							n = Object.keys(t);
						if (r.length !== n.length) return !1;
						for (let n = 0; n < r.length; n++)
							if (!Object.prototype.hasOwnProperty.call(t, r[n]) || !v_(e[r[n]], t[r[n]])) return !1;
						return !0
					}(e[r], t[r])) return !1
			} else {
				var n, i;
				if (n = e[r], i = t[r], (null != n || null != i) && ("number" == typeof n && "number" == typeof i ? n !== i && (n == n || i == i) : n !== i)) return !1
			} return !0
	}
	var vC = (e, t) => t,
		vT = (e, t, r) => r,
		vD = r$([vC, h6, vT], (e, t, r) => t.filter(e => "bar" === e.type).filter(t => t.stackId === e).filter(e => e.isPanorama === r).filter(e => !e.hide)),
		vN = r$([vD], e => e.map(e => e.id)),
		vz = r$([e => e, vC, vT], (e, t, r) => {
			var n = vN(e, t, r),
				i = [];
			return n.forEach(t => {
				var n = y2(e, t, r, void 0);
				null == n || n.forEach(e => {
					var t = e.originalDataIndex;
					i[t] = ((e, t) => {
						if (!e) return t;
						if (!t) return e;
						var r = Math.min(e.x, e.x + e.width, t.x, t.x + t.width),
							n = Math.min(e.y, e.y + e.height, t.y, t.y + t.height);
						return {
							x: r,
							y: n,
							width: Math.max(e.x, e.x + e.width, t.x, t.x + t.width) - r,
							height: Math.max(e.y, e.y + e.height, t.y, t.y + t.height) - n
						}
					})(i[t], e)
				})
			}), i
		}),
		vL = ["index"];

	function vR() {
		return (vR = Object.assign.bind()).apply(null, arguments)
	}
	var vB = (0, N.createContext)(void 0),
		v$ = (e, t) => "recharts-bar-stack-clip-path-".concat(e, "-").concat(t),
		vU = e => {
			var t = e.index,
				r = function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, vL),
				n = (e => {
					var t = (0, N.useContext)(vB);
					if (null != t) {
						var r = t.stackId;
						return "url(#".concat(v$(r, e), ")")
					}
				})(t);
			return N.createElement(en, vR({
				className: "recharts-bar-stack-layer",
				clipPath: n
			}, r))
		},
		vF = ["onMouseEnter", "onMouseLeave", "onClick"],
		vK = ["value", "background", "tooltipPosition"],
		vH = ["id"],
		vq = ["onMouseEnter", "onClick", "onMouseLeave"];

	function vW(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return vV(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? vV(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function vV(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function vY() {
		return (vY = Object.assign.bind()).apply(null, arguments)
	}

	function vX(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function vG(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? vX(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : vX(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function vZ(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}
	var vQ = q.memo(e => {
		var t = e.dataKey,
			r = e.stroke,
			n = e.strokeWidth,
			i = e.fill,
			a = e.name,
			o = e.hide,
			l = e.unit,
			u = e.formatter,
			c = e.tooltipType,
			s = e.id,
			f = {
				dataDefinedOnItem: void 0,
				getPosition: ek,
				settings: {
					stroke: r,
					strokeWidth: n,
					fill: i,
					dataKey: t,
					nameKey: void 0,
					name: i8(a, t),
					hide: o,
					type: c,
					color: i,
					unit: l,
					formatter: u,
					graphicalItemId: s
				}
			};
		return q.createElement(lC, {
			tooltipEntrySettings: f
		})
	});

	function vJ(e) {
		var t, r = tv(yP),
			n = e.data,
			i = e.dataKey,
			a = e.background,
			o = e.allOtherBarProps,
			l = o.onMouseEnter,
			u = o.onMouseLeave,
			c = o.onClick,
			s = vZ(o, vF),
			f = lP(l, i, o.id),
			h = lM(u),
			d = lI(c, i, o.id);
		if (!a || null == n) return null;
		var p = J(a);
		return q.createElement(ol, {
			zIndex: (t = aR.barBackground, a && "object" == typeof a && "zIndex" in a && "number" == typeof a.zIndex && eZ(a.zIndex) ? a.zIndex : t)
		}, n.map((e, t) => {
			e.value;
			var n = e.background,
				o = (e.tooltipPosition, vZ(e, vK));
			if (!n) return null;
			var l = f(e, e.originalDataIndex),
				u = h(e, e.originalDataIndex),
				c = d(e, e.originalDataIndex),
				y = vG(vG(vG(vG(vG({
					option: a,
					isActive: String(e.originalDataIndex) === r
				}, o), {}, {
					fill: "#eee"
				}, n), p), oB(s, e, t)), {}, {
					onMouseEnter: l,
					onMouseLeave: u,
					onClick: c,
					dataKey: i,
					index: t,
					className: "recharts-bar-background-rectangle"
				});
			return q.createElement(lf, vY({
				key: "background-bar-".concat(t)
			}, y))
		}))
	}

	function v0(e) {
		var t = e.showLabels,
			r = e.children,
			n = e.rects,
			i = null == n ? void 0 : n.map(e => {
				var t = {
					x: e.x,
					y: e.y,
					width: e.width,
					lowerWidth: e.width,
					upperWidth: e.width,
					height: e.height
				};
				return vG(vG({}, t), {}, {
					value: e.value,
					payload: e.payload,
					parentViewBox: e.parentViewBox,
					viewBox: t,
					fill: e.fill
				})
			});
		return q.createElement(oP, {
			value: t ? i : void 0
		}, r)
	}

	function v1(e) {
		var t, r = e.shape,
			n = e.activeBar,
			i = e.baseProps,
			a = e.entry,
			o = e.index,
			l = e.dataKey,
			u = tv(yP),
			c = tv(yI),
			s = n && String(a.originalDataIndex) === u && (null == c || l === c),
			f = null != u && (String(a.originalDataIndex) !== u || null != c && l !== c),
			h = vW((0, q.useState)(!1), 2),
			d = h[0],
			p = h[1],
			y = vW((0, q.useState)(!1), 2),
			v = y[0],
			m = y[1];
		(0, q.useEffect)(() => {
			var e;
			return s ? (p(!0), e = requestAnimationFrame(() => {
				m(!0)
			})) : (m(!1), f && p(!1)), () => {
				cancelAnimationFrame(e)
			}
		}, [s, f]);
		var g = (0, q.useCallback)(() => {
				s || p(!1)
			}, [s]),
			b = s && v,
			x = s || d;
		t = s ? !0 === n ? r : n : r;
		var w = q.createElement(lf, vY({}, i, {
			name: String(i.name)
		}, a, {
			isActive: b,
			option: t,
			index: o,
			dataKey: l,
			animationElapsedTime: e.animationElapsedTime,
			isAnimating: e.isAnimating,
			isEntrance: e.isEntrance,
			onTransitionEnd: g
		}));
		return x ? q.createElement(ol, {
			zIndex: aR.activeBar
		}, q.createElement(vU, {
			index: a.originalDataIndex
		}, w)) : w
	}

	function v2(e) {
		var t = e.shape,
			r = e.baseProps,
			n = e.entry,
			i = e.index,
			a = e.dataKey;
		return q.createElement(lf, vY({}, r, {
			name: String(r.name)
		}, n, {
			isActive: !1,
			option: t,
			index: i,
			dataKey: a,
			animationElapsedTime: e.animationElapsedTime,
			isAnimating: e.isAnimating,
			isEntrance: e.isEntrance
		}))
	}

	function v3(e) {
		var t, r = e.data,
			n = e.props,
			i = e.animationElapsedTime,
			a = e.isAnimating,
			o = e.isEntrance,
			l = null != (t = Q(n)) ? t : {},
			u = l.id,
			c = vZ(l, vH),
			s = n.shape,
			f = n.dataKey,
			h = n.activeBar,
			d = n.onMouseEnter,
			p = n.onClick,
			y = n.onMouseLeave,
			v = vZ(n, vq),
			m = lP(d, f, u),
			g = lM(y),
			b = lI(p, f, u);
		return r ? q.createElement(q.Fragment, null, r.map((e, t) => q.createElement(vU, vY({
			index: e.originalDataIndex,
			key: "rectangle-".concat(null == e ? void 0 : e.x, "-").concat(null == e ? void 0 : e.y, "-").concat(null == e ? void 0 : e.value, "-").concat(t),
			className: "recharts-bar-rectangle"
		}, oB(v, e, t), {
			onMouseEnter: m(e, e.originalDataIndex),
			onMouseLeave: g(e, e.originalDataIndex),
			onClick: b(e, e.originalDataIndex)
		}), h ? q.createElement(v1, {
			shape: s,
			activeBar: h,
			baseProps: c,
			entry: e,
			index: t,
			dataKey: f,
			animationElapsedTime: i,
			isAnimating: a,
			isEntrance: o
		}) : q.createElement(v2, {
			shape: s,
			baseProps: c,
			entry: e,
			index: t,
			dataKey: f,
			animationElapsedTime: i,
			isAnimating: a,
			isEntrance: o
		})))) : null
	}

	function v5(e) {
		var t, r, n, i, a, o, l = e.props,
			u = e.previousRectanglesRef,
			c = l.data,
			s = l.isAnimationActive,
			f = l.animationBegin,
			h = l.animationDuration,
			d = l.animationEasing,
			p = l.animationInterpolateFn,
			y = l.layout,
			v = (t = l.onAnimationStart, r = l.onAnimationEnd, a = (i = function(e) {
				if (Array.isArray(e)) return e
			}(n = (0, N.useState)(!1)) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(n) || function(e) {
				if (e) {
					if ("string" == typeof e) return vm(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? vm(e, 2) : void 0
				}
			}(n) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}())[0], o = i[1], {
				isAnimating: a,
				handleAnimationStart: (0, N.useCallback)(() => {
					"function" == typeof t && t(), o(!0)
				}, [t]),
				handleAnimationEnd: (0, N.useCallback)(() => {
					"function" == typeof r && r(), o(!1)
				}, [r])
			}),
			m = v.isAnimating,
			g = v.handleAnimationStart,
			b = v.handleAnimationEnd;
		return q.createElement(v0, {
			showLabels: !m,
			rects: c
		}, q.createElement(vg, {
			animationInput: c,
			animationIdPrefix: "recharts-bar-",
			items: c,
			previousItemsRef: u,
			isAnimationActive: s,
			animationBegin: f,
			animationDuration: h,
			animationEasing: d,
			onAnimationStart: g,
			onAnimationEnd: b,
			animationInterpolateFn: p,
			animationMatchBy: l.animationMatchBy,
			layout: y
		}, (e, t, r) => q.createElement(en, null, q.createElement(v3, {
			props: l,
			data: e,
			animationElapsedTime: t,
			isAnimating: m || t < 1,
			isEntrance: r
		}))), q.createElement(oC, {
			label: l.label
		}), l.children)
	}

	function v6(e) {
		var t = (0, q.useRef)(null);
		return q.createElement(v5, {
			previousRectanglesRef: t,
			props: e
		})
	}
	var v4 = (e, t) => {
		var r = Array.isArray(e.value) ? e.value[1] : e.value;
		return {
			x: e.x,
			y: e.y,
			value: r,
			errorVal: iZ(e, t)
		}
	};
	class v8 extends q.PureComponent {
		render() {
			var e = this.props,
				t = e.hide,
				r = e.data,
				n = e.dataKey,
				i = e.className,
				a = e.xAxisId,
				o = e.yAxisId,
				l = e.needClip,
				u = e.background,
				c = e.id;
			if (t || null == r) return null;
			var s = (0, W.f)("recharts-bar", i);
			return q.createElement(en, {
				className: s,
				id: c
			}, l && q.createElement("defs", null, q.createElement(yU, {
				clipPathId: c,
				xAxisId: a,
				yAxisId: o
			})), q.createElement(en, {
				className: "recharts-bar-rectangles",
				clipPath: l ? "url(#clipPath-".concat(c, ")") : void 0
			}, q.createElement(vJ, {
				data: r,
				dataKey: n,
				background: u,
				allOtherBarProps: this.props
			}), q.createElement(v6, this.props)))
		}
	}
	var v7 = {
		activeBar: !1,
		animationBegin: 0,
		animationDuration: 400,
		animationEasing: "ease",
		animationInterpolateFn: (e, t, r) => null == e ? [] : 1 === t ? e.flatMap(e => "removed" === e.status ? [] : [e.next]) : e.flatMap(e => {
			if ("removed" === e.status) return "horizontal" === r ? [vG(vG({}, e.prev), {}, {
				height: eS(e.prev.height, 0, t),
				y: eS(e.prev.y, e.prev.y + e.prev.height, t)
			})] : [vG(vG({}, e.prev), {}, {
				width: eS(e.prev.width, 0, t)
			})];
			if ("matched" === e.status) return [vG(vG({}, e.next), {}, {
				x: eS(e.prev.x, e.next.x, t),
				y: eS(e.prev.y, e.next.y, t),
				width: eS(e.prev.width, e.next.width, t),
				height: eS(e.prev.height, e.next.height, t)
			})];
			var n = e.next;
			return "horizontal" === r ? [vG(vG({}, n), {}, {
				height: eS(0, n.height, t),
				y: eS(n.stackedBarStart, n.y, t)
			})] : [vG(vG({}, n), {}, {
				width: eS(0, n.width, t),
				x: eS(n.stackedBarStart, n.x, t)
			})]
		}),
		animationMatchBy: vy,
		background: !1,
		hide: !1,
		isAnimationActive: "auto",
		label: !1,
		legendType: "rect",
		minPointSize: 0,
		shape: lo,
		xAxisId: 0,
		yAxisId: 0,
		zIndex: aR.bar
	};

	function v9(e) {
		var t, r, n, i, a = e.xAxisId,
			o = e.yAxisId,
			l = e.hide,
			u = e.legendType,
			c = e.minPointSize,
			s = e.activeBar,
			f = e.animationBegin,
			h = e.animationDuration,
			d = e.animationEasing,
			p = e.isAnimationActive,
			y = y$(a, o).needClip,
			v = tv(aN),
			m = as(),
			g = (t = e.children, r = [], n = [], n = Array.isArray(ei) ? ei.map(e => oD(e)) : [oD(ei)], oL(t).forEach(e => {
				var t = ed(e, "type.displayName") || ed(e, "type.name");
				t && -1 !== n.indexOf(t) && r.push(e)
			}), r),
			b = tv(t => y2(t, e.id, m, g));
		if ("vertical" !== v && "horizontal" !== v) return null;
		var x = null == b ? void 0 : b[0];
		return i = null == x || null == x.height || null == x.width ? 0 : "vertical" === v ? x.height / 2 : x.width / 2, q.createElement(lN, {
			xAxisId: a,
			yAxisId: o,
			data: b,
			dataPointFormatter: v4,
			errorBarOffset: i
		}, q.createElement(v8, vY({}, e, {
			layout: v,
			needClip: y,
			data: b,
			xAxisId: a,
			yAxisId: o,
			hide: l,
			legendType: u,
			minPointSize: c,
			activeBar: s,
			animationBegin: f,
			animationDuration: h,
			animationEasing: d,
			isAnimationActive: p
		})))
	}
	var me = q.memo(function(e) {
		var t, r, n, i = eG(e, v7),
			a = (r = i.stackId, null != (n = (0, N.useContext)(vB)) ? n.stackId : null != r ? null == (t = r) ? void 0 : String(t) : void 0),
			o = as();
		return q.createElement(va, {
			id: i.id,
			type: "bar"
		}, e => {
			var t, r, n, l;
			return q.createElement(q.Fragment, null, q.createElement(vt, {
				legendPayload: (t = i.dataKey, r = i.name, n = i.fill, l = i.legendType, [{
					inactive: i.hide,
					dataKey: t,
					type: l,
					color: n,
					value: i8(r, t),
					payload: i
				}])
			}), q.createElement(vQ, {
				dataKey: i.dataKey,
				stroke: i.stroke,
				strokeWidth: i.strokeWidth,
				fill: i.fill,
				name: i.name,
				hide: i.hide,
				unit: i.unit,
				formatter: i.formatter,
				tooltipType: i.tooltipType,
				id: e
			}), q.createElement(vh, {
				type: "bar",
				id: e,
				data: void 0,
				xAxisId: i.xAxisId,
				yAxisId: i.yAxisId,
				zAxisId: 0,
				dataKey: i.dataKey,
				stackId: a,
				hide: i.hide,
				barSize: i.barSize,
				minPointSize: i.minPointSize,
				maxBarSize: i.maxBarSize,
				isPanorama: o,
				hasCustomShape: null != i.shape && i.shape !== lo
			}), q.createElement(ol, {
				zIndex: i.zIndex
			}, q.createElement(v9, vY({}, i, {
				id: e
			}))))
		})
	}, vI);
	me.displayName = "Bar";
	var mt = (e, t) => {
			if (t && Array.isArray(e)) {
				var r = Number.parseInt(t, 10);
				if (!em(r)) return e[r]
			}
		},
		mr = r1({
			name: "options",
			initialState: {
				chartName: "",
				tooltipPayloadSearcher: () => void 0,
				eventEmitter: void 0,
				defaultTooltipEventType: "axis"
			},
			reducers: {
				createEventEmitter: e => {
					null == e.eventEmitter && (e.eventEmitter = Symbol("rechartsEventEmitter"))
				}
			}
		}),
		mn = mr.reducer,
		mi = mr.actions.createEventEmitter,
		ma = r1({
			name: "chartData",
			initialState: {
				chartData: void 0,
				computedData: void 0,
				dataStartIndex: 0,
				dataEndIndex: 0
			},
			reducers: {
				setChartData(e, t) {
					if (e.chartData = t.payload, null == t.payload) {
						e.dataStartIndex = 0, e.dataEndIndex = 0;
						return
					}
					t.payload.length > 0 && e.dataEndIndex !== t.payload.length - 1 && (e.dataEndIndex = t.payload.length - 1)
				},
				setComputedData(e, t) {
					e.computedData = t.payload
				},
				setDataStartEndIndexes(e, t) {
					var r = t.payload,
						n = r.startIndex,
						i = r.endIndex;
					null != n && (e.dataStartIndex = n), null != i && (e.dataEndIndex = i)
				}
			}
		}),
		mo = ma.actions,
		ml = mo.setChartData,
		mu = mo.setDataStartEndIndexes;
	mo.setComputedData;
	var mc = ma.reducer;

	function ms(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function mf(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? ms(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ms(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var mh = (e, t, r, n, i) => {
			var a = null != (p = null == t ? void 0 : t.length) ? p : 0;
			if (a <= 1 || null == e) return 0;
			if ("angleAxis" === n && null != i && 1e-6 >= Math.abs(Math.abs(i[1] - i[0]) - 360))
				for (var o = i[1] - i[0], l = (t, r, n) => [e, e + o, e - o].some(e => (n ? e >= t : e > t) && e <= r), u = 0; u < a; u++) {
					var c, s = u > 0 ? null == (y = r[u - 1]) ? void 0 : y.coordinate : null == (v = r[a - 1]) ? void 0 : v.coordinate,
						f = null == (m = r[u]) ? void 0 : m.coordinate,
						h = u >= a - 1 ? null == (g = r[0]) ? void 0 : g.coordinate : null == (b = r[u + 1]) ? void 0 : b.coordinate,
						d = void 0;
					if (null != s && null != f && null != h) {
						if (ev(f - s) !== ev(h - f)) {
							var p, y, v, m, g, b, x, w = [];
							if (ev(h - f) === ev(i[1] - i[0])) {
								d = h;
								var O = f + i[1] - i[0];
								w[0] = Math.min(O, (O + s) / 2), w[1] = Math.max(O, (O + s) / 2)
							} else {
								d = s;
								var _ = h + i[1] - i[0];
								w[0] = Math.min(f, (_ + f) / 2), w[1] = Math.max(f, (_ + f) / 2)
							}
							var A = [Math.min(f, (d + f) / 2), Math.max(f, (d + f) / 2)];
							if (l(A[0], A[1], !1) || l(w[0], w[1], !0)) return null == (x = r[u]) ? void 0 : x.index
						} else if (l((Math.min(s, h) + f) / 2, (Math.max(s, h) + f) / 2, !1)) return null == (c = r[u]) ? void 0 : c.index
					}
				} else if (t)
					for (var S = 0; S < a; S++) {
						var j = t[S];
						if (null != j) {
							var E = t[S + 1],
								k = t[S - 1];
							if (0 === S && null != E && e <= (j.coordinate + E.coordinate) / 2 || S === a - 1 && null != k && e > (j.coordinate + k.coordinate) / 2 || S > 0 && S < a - 1 && null != k && null != E && e > (j.coordinate + k.coordinate) / 2 && e <= (j.coordinate + E.coordinate) / 2) return j.index
						}
					}
			return -1
		},
		md = (e, t) => t,
		mp = (e, t, r) => r,
		my = (e, t, r, n) => n,
		mv = r$(yA, e => nU(e, e => e.coordinate)),
		mm = r$([pY, md, mp, my], pK),
		mg = r$([mm, p4, dm, yy], pH),
		mb = r$([pY, md, mp, my], pW),
		mx = r$([i7, i9, aN, ao, yA, my, mb], pq),
		mw = r$([mm, mx], (e, t) => {
			var r;
			return null != (r = e.coordinate) ? r : t
		}),
		mO = r$([yA, mg], p$),
		m_ = r$([mb, mg, lR, dm, mO, pV, md], pQ),
		mA = r$([mm, mg], (e, t) => ({
			isActive: e.active && null != t,
			activeIndex: t
		})),
		mS = r$([(e, t) => t, aN, a1, uc, yb, yA, mv, ao], (e, t, r, n, i, a, o, l) => {
			if (e && t && n && i && a) {
				if ("horizontal" === t || "vertical" === t) {
					var u = e,
						c = t,
						s = n,
						f = i,
						h = a,
						d = o,
						p = l;
					if (u && s && f && h && (y = u.relativeX, v = u.relativeY, y >= p.left && y <= p.left + p.width && v >= p.top && v <= p.top + p.height)) {
						var y, v, m = mh("horizontal" === c ? u.relativeX : "vertical" === c ? u.relativeY : void 0, d, h, s, f),
							g = ((e, t, r, n) => {
								var i = t.find(e => e && e.index === r);
								if (i) {
									if ("horizontal" === e) return {
										x: i.coordinate,
										y: n.relativeY
									};
									if ("vertical" === e) return {
										x: n.relativeX,
										y: i.coordinate
									}
								}
								return {
									x: 0,
									y: 0
								}
							})(c, h, m, u);
						return {
							activeIndex: String(m),
							activeCoordinate: g
						}
					}
					return
				}
				if (e && n && i && a && r) {
					var b = ((e, t) => {
						var r, n, i, a, o = ((e, t) => {
								var r, n, i, a, o = e.x,
									l = e.y,
									u = t.cx,
									c = t.cy,
									s = (r = {
										x: o,
										y: l
									}, n = {
										x: u,
										y: c
									}, i = r.x, a = r.y, Math.sqrt((i - n.x) ** 2 + (a - n.y) ** 2));
								if (s <= 0) return {
									radius: s,
									angle: 0
								};
								var f = Math.acos((o - u) / s);
								return l > c && (f = 2 * Math.PI - f), {
									radius: s,
									angle: 180 * f / Math.PI,
									angleInRadian: f
								}
							})({
								x: e.relativeX,
								y: e.relativeY
							}, t),
							l = o.radius,
							u = o.angle,
							c = t.innerRadius,
							s = t.outerRadius;
						if (l < c || l > s || 0 === l) return null;
						var f = (i = Math.min(Math.floor((r = t.startAngle) / 360), Math.floor((n = t.endAngle) / 360)), {
								startAngle: r - 360 * i,
								endAngle: n - 360 * i
							}),
							h = f.startAngle,
							d = f.endAngle,
							p = u;
						if (h <= d) {
							for (; p > d;) p -= 360;
							for (; p < h;) p += 360;
							a = p >= h && p <= d
						} else {
							for (; p > h;) p -= 360;
							for (; p < d;) p += 360;
							a = p >= d && p <= h
						}
						return a ? to(to({}, t), {}, {
							radius: l,
							angle: p + 360 * Math.min(Math.floor(t.startAngle / 360), Math.floor(t.endAngle / 360))
						}) : null
					})(e, r);
					if (b) {
						var x = mh("centric" === t ? b.angle : b.radius, o, a, n, i),
							w = ((e, t, r, n) => {
								var i = t.find(e => e && e.index === r);
								if (i) {
									if ("centric" === e) {
										var a = i.coordinate,
											o = n.radius;
										return mf(mf(mf({}, n), tu(n.cx, n.cy, o, a)), {}, {
											angle: a,
											radius: o
										})
									}
									var l = i.coordinate,
										u = n.angle;
									return mf(mf(mf({}, n), tu(n.cx, n.cy, l, u)), {}, {
										angle: u,
										radius: l
									})
								}
								return {
									angle: 0,
									clockWise: !1,
									cx: 0,
									cy: 0,
									endAngle: 0,
									innerRadius: 0,
									outerRadius: 0,
									radius: 0,
									startAngle: 0,
									x: 0,
									y: 0
								}
							})(t, a, x, b);
						return {
							activeIndex: String(x),
							activeCoordinate: w
						}
					}
					return
				}
			}
		});

	function mj(e) {
		var t, r, n = e.currentTarget.getBoundingClientRect();
		if ("getBBox" in e.currentTarget && "function" == typeof e.currentTarget.getBBox) {
			var i = e.currentTarget.getBBox();
			t = i.width > 0 ? n.width / i.width : 1, r = i.height > 0 ? n.height / i.height : 1
		} else {
			var a = e.currentTarget;
			t = a.offsetWidth > 0 ? n.width / a.offsetWidth : 1, r = a.offsetHeight > 0 ? n.height / a.offsetHeight : 1
		}
		var o = (e, i) => ({
			relativeX: Math.round((e - n.left) / t),
			relativeY: Math.round((i - n.top) / r)
		});
		return "touches" in e ? Array.from(e.touches).map(e => o(e.clientX, e.clientY)) : o(e.clientX, e.clientY)
	}
	var mE = rq("mouseClick"),
		mk = nO();
	mk.startListening({
		actionCreator: mE,
		effect: (e, t) => {
			var r = e.payload,
				n = mS(t.getState(), mj(r));
			(null == n ? void 0 : n.activeIndex) != null && t.dispatch(lS({
				activeIndex: n.activeIndex,
				activeDataKey: void 0,
				activeCoordinate: n.activeCoordinate
			}))
		}
	});
	var mP = rq("mouseMove"),
		mM = nO(),
		mI = null,
		mC = null,
		mT = null;

	function mD(e, t) {
		return t instanceof HTMLElement ? "HTMLElement <".concat(t.tagName, ' class="').concat(t.className, '">') : t === window ? "global.window" : "children" === e && "object" == typeof t && null !== t ? "<<CHILDREN>>" : t
	}
	mM.startListening({
		actionCreator: mP,
		effect: (e, t) => {
			var r = e.payload,
				n = t.getState().eventSettings,
				i = n.throttleDelay,
				a = n.throttledEvents,
				o = "all" === a || (null == a ? void 0 : a.includes("mousemove"));
			null !== mI && (cancelAnimationFrame(mI), mI = null), null === mC || "number" == typeof i && o || (clearTimeout(mC), mC = null), mT = mj(r);
			var l = () => {
				var e = t.getState(),
					r = pB(e, e.tooltip.settings.shared);
				if (!mT) {
					mI = null, mC = null;
					return
				}
				if ("axis" === r) {
					var n = mS(e, mT);
					(null == n ? void 0 : n.activeIndex) != null ? t.dispatch(lA({
						activeIndex: n.activeIndex,
						activeDataKey: void 0,
						activeCoordinate: n.activeCoordinate
					})) : t.dispatch(lO())
				}
				mI = null, mC = null
			};
			o ? "raf" === i ? mI = requestAnimationFrame(l) : "number" == typeof i && null === mC && (mC = setTimeout(l, i)) : l()
		}
	});
	var mN = r1({
			name: "referenceElements",
			initialState: {
				dots: [],
				areas: [],
				lines: []
			},
			reducers: {
				addDot: (e, t) => {
					e.dots.push(t.payload)
				},
				removeDot: (e, t) => {
					var r = rx(e).dots.findIndex(e => e === t.payload); - 1 !== r && e.dots.splice(r, 1)
				},
				addArea: (e, t) => {
					e.areas.push(t.payload)
				},
				removeArea: (e, t) => {
					var r = rx(e).areas.findIndex(e => e === t.payload); - 1 !== r && e.areas.splice(r, 1)
				},
				addLine: (e, t) => {
					e.lines.push(t.payload)
				},
				removeLine: (e, t) => {
					var r = rx(e).lines.findIndex(e => e === t.payload); - 1 !== r && e.lines.splice(r, 1)
				}
			}
		}),
		mz = mN.actions;
	mz.addDot, mz.removeDot, mz.addArea, mz.removeArea, mz.addLine, mz.removeLine;
	var mL = mN.reducer,
		mR = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
			padding: {
				top: 0,
				right: 0,
				bottom: 0,
				left: 0
			}
		},
		mB = r1({
			name: "brush",
			initialState: mR,
			reducers: {
				setBrushSettings: (e, t) => null == t.payload ? mR : t.payload
			}
		});
	mB.actions.setBrushSettings;
	var m$ = mB.reducer,
		mU = {
			accessibilityLayer: !0,
			barCategoryGap: "10%",
			barGap: 4,
			barSize: void 0,
			className: void 0,
			maxBarSize: void 0,
			stackOffset: "none",
			syncId: void 0,
			syncMethod: "index",
			baseValue: void 0,
			reverseStackOrder: !1
		},
		mF = r1({
			name: "rootProps",
			initialState: mU,
			reducers: {
				updateOptions: (e, t) => {
					var r;
					e.accessibilityLayer = t.payload.accessibilityLayer, e.barCategoryGap = t.payload.barCategoryGap, e.barGap = null != (r = t.payload.barGap) ? r : mU.barGap, e.barSize = t.payload.barSize, e.maxBarSize = t.payload.maxBarSize, e.stackOffset = t.payload.stackOffset, e.syncId = t.payload.syncId, e.syncMethod = t.payload.syncMethod, e.className = t.payload.className, e.baseValue = t.payload.baseValue, e.reverseStackOrder = t.payload.reverseStackOrder
				}
			}
		}),
		mK = mF.reducer,
		mH = mF.actions.updateOptions,
		mq = r1({
			name: "polarAxis",
			initialState: {
				radiusAxis: {},
				angleAxis: {}
			},
			reducers: {
				addRadiusAxis(e, t) {
					e.radiusAxis[t.payload.id] = t.payload
				},
				removeRadiusAxis(e, t) {
					delete e.radiusAxis[t.payload.id]
				},
				addAngleAxis(e, t) {
					e.angleAxis[t.payload.id] = t.payload
				},
				removeAngleAxis(e, t) {
					delete e.angleAxis[t.payload.id]
				}
			}
		}),
		mW = mq.actions;
	mW.addRadiusAxis, mW.removeRadiusAxis, mW.addAngleAxis, mW.removeAngleAxis;
	var mV = mq.reducer,
		mY = r1({
			name: "polarOptions",
			initialState: null,
			reducers: {
				updatePolarOptions: (e, t) => null === e ? t.payload : (e.startAngle = t.payload.startAngle, e.endAngle = t.payload.endAngle, e.cx = t.payload.cx, e.cy = t.payload.cy, e.innerRadius = t.payload.innerRadius, e.outerRadius = t.payload.outerRadius, e)
			}
		});
	mY.actions.updatePolarOptions;
	var mX = mY.reducer,
		mG = rq("keyDown"),
		mZ = rq("focus"),
		mQ = rq("blur"),
		mJ = nO(),
		m0 = null,
		m1 = null,
		m2 = null;

	function m3(e) {
		e.persist();
		var t = e.currentTarget;
		return new Proxy(e, {
			get: (e, r) => {
				if ("currentTarget" === r) return t;
				var n = Reflect.get(e, r);
				return "function" == typeof n ? n.bind(e) : n
			}
		})
	}
	mJ.startListening({
		actionCreator: mG,
		effect: (e, t) => {
			m2 = e.payload, null !== m0 && (cancelAnimationFrame(m0), m0 = null);
			var r = t.getState().eventSettings,
				n = r.throttleDelay,
				i = r.throttledEvents,
				a = "all" === i || i.includes("keydown");
			null === m1 || "number" == typeof n && a || (clearTimeout(m1), m1 = null);
			var o = () => {
				try {
					var e, r = t.getState();
					if (!1 === r.rootProps.accessibilityLayer) return;
					var n = r.tooltip.keyboardInteraction,
						i = m2;
					if ("ArrowRight" !== i && "ArrowLeft" !== i && "Enter" !== i) return;
					var a = pH(n, p4(r), dm(r), yy(r)),
						o = null == a ? -1 : Number(a),
						l = !Number.isFinite(o) || o < 0,
						u = yA(r),
						c = p4(r),
						s = pB(r, r.tooltip.settings.shared);
					if ("Enter" === i) {
						if (l) return;
						var f = mx(r, s, "hover", String(n.index));
						t.dispatch(lE({
							active: !n.active,
							activeIndex: n.index,
							activeCoordinate: f
						}));
						return
					}
					var h = pj(r),
						d = "left-to-right" === h ? 1 : -1,
						p = "ArrowRight" === i ? 1 : -1;
					if (l) {
						var y = dm(r),
							v = yy(r),
							m = e => ({
								active: !1,
								index: String(e),
								dataKey: void 0,
								graphicalItemId: void 0,
								coordinate: void 0
							});
						if (e = -1, p * d > 0) {
							for (var g = 0; g < c.length; g++)
								if (null != pH(m(g), c, y, v)) {
									e = g;
									break
								}
						} else
							for (var b = c.length - 1; b >= 0; b--)
								if (null != pH(m(b), c, y, v)) {
									e = b;
									break
								} if (e < 0) return
					} else {
						e = o + p * d;
						var x = (null == u ? void 0 : u.length) || c.length;
						if (0 === x || e >= x || e < 0) return
					}
					var w = mx(r, s, "hover", String(e));
					t.dispatch(lE({
						active: !0,
						activeIndex: e.toString(),
						activeCoordinate: w
					}))
				} finally {
					m0 = null, m1 = null
				}
			};
			a ? "raf" === n ? m0 = requestAnimationFrame(o) : "number" == typeof n && null === m1 && (o(), m2 = null, m1 = setTimeout(() => {
				m2 ? o() : (m1 = null, m0 = null)
			}, n)) : o()
		}
	}), mJ.startListening({
		actionCreator: mZ,
		effect: (e, t) => {
			var r = t.getState();
			if (!1 !== r.rootProps.accessibilityLayer) {
				var n = r.tooltip.keyboardInteraction;
				if (!n.active && null == n.index) {
					var i = pB(r, r.tooltip.settings.shared),
						a = mx(r, i, "hover", String("0"));
					t.dispatch(lE({
						active: !0,
						activeIndex: "0",
						activeCoordinate: a
					}))
				}
			}
		}
	}), mJ.startListening({
		actionCreator: mQ,
		effect: (e, t) => {
			var r = t.getState();
			if (!1 !== r.rootProps.accessibilityLayer) {
				var n = r.tooltip.keyboardInteraction;
				n.active && t.dispatch(lE({
					active: !1,
					activeIndex: n.index,
					activeCoordinate: n.coordinate
				}))
			}
		}
	});
	var m5 = rq("externalEvent"),
		m6 = nO(),
		m4 = new Map,
		m8 = new Map,
		m7 = new Map;
	m6.startListening({
		actionCreator: m5,
		effect: (e, t) => {
			var r = e.payload,
				n = r.handler,
				i = r.reactEvent;
			if (null != n) {
				var a = i.type,
					o = m3(i);
				m7.set(a, {
					handler: n,
					reactEvent: o
				});
				var l = m4.get(a);
				void 0 !== l && (cancelAnimationFrame(l), m4.delete(a));
				var u = t.getState().eventSettings,
					c = u.throttleDelay,
					s = u.throttledEvents,
					f = "all" === s || (null == s ? void 0 : s.includes(a)),
					h = m8.get(a);
				void 0 === h || "number" == typeof c && f || (clearTimeout(h), m8.delete(a));
				var d = () => {
					var e = m7.get(a);
					try {
						if (!e) return;
						var r = e.handler,
							n = e.reactEvent,
							i = t.getState(),
							o = {
								activeCoordinate: yN(i),
								activeDataKey: yI(i),
								activeIndex: yP(i),
								activeLabel: yM(i),
								activeTooltipIndex: yP(i),
								isTooltipActive: yz(i)
							};
						r && r(o, n)
					} finally {
						m4.delete(a), m8.delete(a), m7.delete(a)
					}
				};
				if (!f) return void d();
				if ("raf" === c) {
					var p = requestAnimationFrame(d);
					m4.set(a, p)
				} else if ("number" == typeof c) {
					if (!m8.has(a)) {
						d();
						var y = setTimeout(d, c);
						m8.set(a, y)
					}
				} else d()
			}
		}
	});
	var m9 = r$([pY], e => e.tooltipItemPayloads),
		ge = r$([m9, (e, t) => t, (e, t, r) => r], (e, t, r) => {
			if (null != t) {
				var n = e.find(e => e.settings.graphicalItemId === r);
				if (null != n) {
					var i = n.getPosition;
					if (null != i) return i(t)
				}
			}
		}),
		gt = rq("touchMove"),
		gr = nO(),
		gn = null,
		gi = null,
		ga = null,
		go = null;
	gr.startListening({
		actionCreator: gt,
		effect: (e, t) => {
			var r = e.payload;
			if (null != r.touches && 0 !== r.touches.length) {
				go = m3(r);
				var n = t.getState().eventSettings,
					i = n.throttleDelay,
					a = n.throttledEvents,
					o = "all" === a || a.includes("touchmove");
				null !== gn && (cancelAnimationFrame(gn), gn = null), null === gi || "number" == typeof i && o || (clearTimeout(gi), gi = null), ga = Array.from(r.touches).map(e => mj({
					clientX: e.clientX,
					clientY: e.clientY,
					currentTarget: r.currentTarget
				}));
				var l = () => {
					if (null != go) {
						var e = t.getState(),
							r = pB(e, e.tooltip.settings.shared);
						if ("axis" === r) {
							var n, i = null == (n = ga) ? void 0 : n[0];
							if (null == i) {
								gn = null, gi = null;
								return
							}
							var a = mS(e, i);
							(null == a ? void 0 : a.activeIndex) != null && t.dispatch(lA({
								activeIndex: a.activeIndex,
								activeDataKey: void 0,
								activeCoordinate: a.activeCoordinate
							}))
						} else if ("item" === r) {
							var o, l = go.touches[0];
							if (null == document.elementFromPoint || null == l) return;
							var u = document.elementFromPoint(l.clientX, l.clientY);
							if (!u || !u.getAttribute) return;
							var c = u.getAttribute("data-recharts-item-index"),
								s = null != (o = u.getAttribute("data-recharts-item-id")) ? o : void 0,
								f = p2(e).find(e => e.id === s);
							if (null == c || null == f || null == s) return;
							var h = f.dataKey,
								d = ge(e, c, s);
							t.dispatch(lx({
								activeDataKey: h,
								activeIndex: c,
								activeCoordinate: d,
								activeGraphicalItemId: s
							}))
						}
						gn = null, gi = null
					}
				};
				if (!o) return void l();
				"raf" === i ? gn = requestAnimationFrame(l) : "number" == typeof i && null === gi && (l(), go = null, gi = setTimeout(() => {
					go ? l() : (gi = null, gn = null)
				}, i))
			}
		}
	});
	var gl = r1({
			name: "errorBars",
			initialState: {},
			reducers: {
				addErrorBar: (e, t) => {
					var r = t.payload,
						n = r.itemId,
						i = r.errorBar;
					e[n] || (e[n] = []), e[n].push(i)
				},
				replaceErrorBar: (e, t) => {
					var r = t.payload,
						n = r.itemId,
						i = r.prev,
						a = r.next;
					e[n] && (e[n] = e[n].map(e => e.dataKey === i.dataKey && e.direction === i.direction ? a : e))
				},
				removeErrorBar: (e, t) => {
					var r = t.payload,
						n = r.itemId,
						i = r.errorBar;
					e[n] && (e[n] = e[n].filter(e => e.dataKey !== i.dataKey || e.direction !== i.direction))
				}
			}
		}),
		gu = gl.actions;
	gu.addErrorBar, gu.replaceErrorBar, gu.removeErrorBar;
	var gc = gl.reducer,
		gs = {
			throttleDelay: "raf",
			throttledEvents: ["mousemove", "touchmove", "pointermove", "scroll", "wheel"]
		},
		gf = r1({
			name: "eventSettings",
			initialState: gs,
			reducers: {
				setEventSettings: (e, t) => {
					null != t.payload.throttleDelay && (e.throttleDelay = t.payload.throttleDelay), null != t.payload.throttledEvents && (e.throttledEvents = t.payload.throttledEvents)
				}
			}
		}),
		gh = gf.actions.setEventSettings,
		gd = gf.reducer,
		gp = r1({
			name: "renderedTicks",
			initialState: {
				xAxis: {},
				yAxis: {}
			},
			reducers: {
				setRenderedTicks: (e, t) => {
					var r = t.payload,
						n = r.axisType,
						i = r.axisId,
						a = r.ticks;
					e[n][i] = a
				},
				removeRenderedTicks: (e, t) => {
					var r = t.payload,
						n = r.axisType,
						i = r.axisId;
					delete e[n][i]
				}
			}
		}),
		gy = gp.actions,
		gv = gy.setRenderedTicks,
		gm = gy.removeRenderedTicks,
		gg = tO({
			brush: m$,
			cartesianAxis: pN,
			chartData: mc,
			errorBars: gc,
			eventSettings: gd,
			graphicalItems: vf,
			layout: nM,
			legend: ve,
			options: mn,
			polarAxis: mV,
			polarOptions: mX,
			referenceElements: mL,
			renderedTicks: gp.reducer,
			rootProps: mK,
			tooltip: lk,
			zIndex: oo
		}),
		gb = function(e) {
			var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "Chart";
			return function(e) {
				let t, r, n, i = function(e) {
						let {
							thunk: t = !0,
							immutableCheck: r = !0,
							serializableCheck: n = !0,
							actionCreatorCheck: i = !0
						} = e ?? {}, a = new rW;
						return t && ("boolean" == typeof t ? a.push(rK) : a.push(rF(t.extraArgument))), a
					},
					{
						reducer: a,
						middleware: o,
						devTools: l = !0,
						duplicateMiddlewareCheck: u = !0,
						preloadedState: c,
						enhancers: s
					} = e || {};
				if ("function" == typeof a) t = a;
				else if (tw(a)) t = tO(a);
				else throw Error(n_(1));
				r = "function" == typeof o ? o(i) : i();
				let f = t_;
				l && (f = rH({
					trace: !1,
					..."object" == typeof l && l
				}));
				let h = (n = function(...e) {
					return t => (r, n) => {
						let i = t(r, n),
							a = () => {
								throw Error(tm(15))
							},
							o = {
								getState: i.getState,
								dispatch: (e, ...t) => a(e, ...t)
							};
						return a = t_(...e.map(e => e(o)))(i.dispatch), {
							...i,
							dispatch: a
						}
					}
				}(...r), function(e) {
					let {
						autoBatch: t = !0
					} = e ?? {}, r = new rW(n);
					return t && r.push(rQ("object" == typeof t ? t : void 0)), r
				});
				return function e(t, r, n) {
					if ("function" != typeof t) throw Error(tm(2));
					if ("function" == typeof r && "function" == typeof n || "function" == typeof n && "function" == typeof arguments[3]) throw Error(tm(0));
					if ("function" == typeof r && void 0 === n && (n = r, r = void 0), void 0 !== n) {
						if ("function" != typeof n) throw Error(tm(1));
						return n(e)(t, r)
					}
					let i = t,
						a = r,
						o = new Map,
						l = o,
						u = 0,
						c = !1;

					function s() {
						l === o && (l = new Map, o.forEach((e, t) => {
							l.set(t, e)
						}))
					}

					function f() {
						if (c) throw Error(tm(3));
						return a
					}

					function h(e) {
						if ("function" != typeof e) throw Error(tm(4));
						if (c) throw Error(tm(5));
						let t = !0;
						s();
						let r = u++;
						return l.set(r, e),
							function() {
								if (t) {
									if (c) throw Error(tm(6));
									t = !1, s(), l.delete(r), o = null
								}
							}
					}

					function d(e) {
						if (!tw(e)) throw Error(tm(7));
						if (void 0 === e.type) throw Error(tm(8));
						if ("string" != typeof e.type) throw Error(tm(17));
						if (c) throw Error(tm(9));
						try {
							c = !0, a = i(a, e)
						} finally {
							c = !1
						}
						return (o = l).forEach(e => {
							e()
						}), e
					}
					return d({
						type: tx.INIT
					}), {
						dispatch: d,
						subscribe: h,
						getState: f,
						replaceReducer: function(e) {
							if ("function" != typeof e) throw Error(tm(10));
							i = e, d({
								type: tx.REPLACE
							})
						},
						[tg]: function() {
							return {
								subscribe(e) {
									if ("object" != typeof e || null === e) throw Error(tm(11));

									function t() {
										e.next && e.next(f())
									}
									return t(), {
										unsubscribe: h(t)
									}
								},
								[tg]() {
									return this
								}
							}
						}
					}
				}(t, c, f(..."function" == typeof s ? s(h) : h()))
			}({
				reducer: gg,
				preloadedState: e,
				middleware: e => e({
					serializableCheck: !1,
					immutableCheck: !["commonjs", "es6", "production"].includes("es6")
				}).concat([mk.middleware, mM.middleware, mJ.middleware, m6.middleware, gr.middleware]),
				enhancers: e => {
					var t = e;
					return "function" == typeof e && (t = e()), t.concat(rQ({
						type: "raf"
					}))
				},
				devTools: eP.devToolsEnabled && {
					serialize: {
						replacer: mD
					},
					name: "recharts-".concat(t)
				}
			})
		};

	function gx(e) {
		var t = e.preloadedState,
			r = e.children,
			n = e.reduxStoreName,
			i = as(),
			a = (0, N.useRef)(null);
		return i ? r : (null == a.current && (a.current = gb(t, n)), N.createElement(vE, {
			context: ts,
			store: a.current
		}, r))
	}
	var gw = e => {
			var t = e.chartData,
				r = th(),
				n = as();
			return (0, N.useEffect)(() => n ? () => {} : (r(ml(t)), () => {
				r(ml(void 0))
			}), [t, r, n]), null
		},
		gO = (0, N.memo)(function(e) {
			var t = e.layout,
				r = e.margin,
				n = th(),
				i = as();
			return (0, N.useEffect)(() => {
				i || (n(nE(t)), n(nj(r)))
			}, [n, i, t, r]), null
		}, vI);

	function g_(e) {
		var t = th();
		return (0, N.useEffect)(() => {
			t(mH(e))
		}, [t, e]), null
	}
	var gA = (0, N.memo)(e => {
			var t = th();
			return (0, N.useEffect)(() => {
				t(gh(e))
			}, [t, e]), null
		}, vI),
		gS = () => {
			var e;
			return null == (e = tv(e => e.rootProps.accessibilityLayer)) || e
		},
		gj = ["children", "width", "height", "viewBox", "className", "style", "title", "desc"];

	function gE() {
		return (gE = Object.assign.bind()).apply(null, arguments)
	}
	var gk = (0, N.forwardRef)((e, t) => {
		var r = e.children,
			n = e.width,
			i = e.height,
			a = e.viewBox,
			o = e.className,
			l = e.style,
			u = e.title,
			c = e.desc,
			s = function(e, t) {
				if (null == e) return {};
				var r, n, i = function(e, t) {
					if (null == e) return {};
					var r = {};
					for (var n in e)
						if (({}).hasOwnProperty.call(e, n)) {
							if (-1 !== t.indexOf(n)) continue;
							r[n] = e[n]
						} return r
				}(e, t);
				if (Object.getOwnPropertySymbols) {
					var a = Object.getOwnPropertySymbols(e);
					for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
				}
				return i
			}(e, gj),
			f = a || {
				width: n,
				height: i,
				x: 0,
				y: 0
			},
			h = (0, W.f)("recharts-surface", o);
		return N.createElement("svg", gE({}, ee(s), {
			className: h,
			width: n,
			height: i,
			style: l,
			viewBox: "".concat(f.x, " ").concat(f.y, " ").concat(f.width, " ").concat(f.height),
			ref: t
		}), N.createElement("title", null, u), N.createElement("desc", null, c), r)
	});

	function gP(e) {
		var t = e.zIndex,
			r = e.isPanorama,
			n = (0, N.useRef)(null),
			i = th();
		return (0, N.useLayoutEffect)(() => (n.current && i(oi({
			zIndex: t,
			element: n.current,
			isPanorama: r
		})), () => {
			i(oa({
				zIndex: t,
				isPanorama: r
			}))
		}), [i, t, r]), N.createElement("g", {
			tabIndex: -1,
			ref: n,
			className: "recharts-zIndex-layer_".concat(t)
		})
	}

	function gM(e) {
		var t = e.children,
			r = e.isPanorama,
			n = tv(a6);
		if (!n || 0 === n.length) return t;
		var i = n.filter(e => e < 0),
			a = n.filter(e => e > 0);
		return N.createElement(N.Fragment, null, i.map(e => N.createElement(gP, {
			key: e,
			zIndex: e,
			isPanorama: r
		})), t, a.map(e => N.createElement(gP, {
			key: e,
			zIndex: e,
			isPanorama: r
		})))
	}
	var gI = ["children"];

	function gC() {
		return (gC = Object.assign.bind()).apply(null, arguments)
	}
	var gT = {
			width: "100%",
			height: "100%",
			display: "block"
		},
		gD = (0, N.forwardRef)((e, t) => {
			var r, n, i = tv(i7),
				a = tv(i9),
				o = gS();
			if (!eQ(i) || !eQ(a)) return null;
			var l = e.children,
				u = e.otherAttributes,
				c = e.title,
				s = e.desc;
			return null != u && (r = "number" == typeof u.tabIndex ? u.tabIndex : o ? 0 : void 0, n = "string" == typeof u.role ? u.role : o ? "application" : void 0), N.createElement(gk, gC({}, u, {
				title: c,
				desc: s,
				role: n,
				tabIndex: r,
				width: i,
				height: a,
				style: gT,
				ref: t
			}), l)
		}),
		gN = e => {
			var t = e.children,
				r = tv(ah);
			if (!r) return null;
			var n = r.width,
				i = r.height,
				a = r.y,
				o = r.x;
			return N.createElement(gk, {
				width: n,
				height: i,
				x: o,
				y: a
			}, t)
		},
		gz = (0, N.forwardRef)((e, t) => {
			var r = e.children,
				n = function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, gI);
			return as() ? N.createElement(gN, null, N.createElement(gM, {
				isPanorama: !0
			}, r)) : N.createElement(gD, gC({
				ref: t
			}, n), N.createElement(gM, {
				isPanorama: !1
			}, r))
		}),
		gL = new(e.i(571650)).default,
		gR = "recharts.syncEvent.tooltip",
		gB = "recharts.syncEvent.brush";

	function g$(e) {
		return e.tooltip.syncInteraction
	}
	var gU = ["x", "y"];

	function gF(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function gK(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? gF(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gF(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function gH(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var gq = (0, N.createContext)(null),
		gW = (0, N.createContext)(null);

	function gV(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function gY() {
		return (gY = Object.assign.bind()).apply(null, arguments)
	}

	function gX(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return gG(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? gG(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function gG(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var gZ = () => {
		var e, t, r, n, i, a, o, l, u, c, s, f;
		return e = th(), (0, N.useEffect)(() => {
			e(mi())
		}, [e]), t = tv(ue), r = tv(ur), n = th(), i = tv(ut), a = tv(yA), o = tv(aN), l = aC(), u = tv(e => e.rootProps.className), (0, N.useEffect)(() => {
			if (null == t) return ek;
			var e = (e, u, c) => {
				if (r !== c && t === e) {
					if (!1 === u.payload.active) return void n(lj({
						active: !1,
						coordinate: void 0,
						dataKey: void 0,
						index: null,
						label: void 0,
						sourceViewBox: void 0,
						graphicalItemId: void 0
					}));
					if ("index" === i) {
						if (l && null != u && null != (s = u.payload) && s.coordinate && u.payload.sourceViewBox) {
							var s, f, h = u.payload.coordinate,
								d = h.x,
								p = h.y,
								y = function(e, t) {
									if (null == e) return {};
									var r, n, i = function(e, t) {
										if (null == e) return {};
										var r = {};
										for (var n in e)
											if (({}).hasOwnProperty.call(e, n)) {
												if (-1 !== t.indexOf(n)) continue;
												r[n] = e[n]
											} return r
									}(e, t);
									if (Object.getOwnPropertySymbols) {
										var a = Object.getOwnPropertySymbols(e);
										for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
									}
									return i
								}(h, gU),
								v = u.payload.sourceViewBox,
								m = v.x,
								g = v.y,
								b = v.width,
								x = v.height,
								w = gK(gK({}, y), {}, {
									x: l.x + (b ? (d - m) / b : 0) * l.width,
									y: l.y + (x ? (p - g) / x : 0) * l.height
								});
							n(gK(gK({}, u), {}, {
								payload: gK(gK({}, u.payload), {}, {
									coordinate: w
								})
							}))
						} else n(u);
						return
					}
					if (null != a) {
						if ("function" == typeof i) {
							var O = i(a, {
								activeTooltipIndex: null == u.payload.index ? void 0 : Number(u.payload.index),
								isTooltipActive: u.payload.active,
								activeIndex: null == u.payload.index ? void 0 : Number(u.payload.index),
								activeLabel: u.payload.label,
								activeDataKey: u.payload.dataKey,
								activeCoordinate: u.payload.coordinate
							});
							f = a[O]
						} else "value" === i && (f = a.find(e => String(e.value) === u.payload.label));
						var _ = u.payload.coordinate;
						if (null == _ || null == l) return void n(lj({
							active: !1,
							coordinate: void 0,
							dataKey: void 0,
							index: null,
							label: void 0,
							sourceViewBox: void 0,
							graphicalItemId: void 0
						}));
						if (null == f) return void n(lj({
							active: !1,
							coordinate: void 0,
							dataKey: void 0,
							index: null,
							label: void 0,
							sourceViewBox: u.payload.sourceViewBox,
							graphicalItemId: void 0
						}));
						var A = _.x,
							S = _.y,
							j = Math.min(A, l.x + l.width),
							E = Math.min(S, l.y + l.height),
							k = {
								x: "horizontal" === o ? f.coordinate : j,
								y: "horizontal" === o ? E : f.coordinate
							};
						n(lj({
							active: u.payload.active,
							coordinate: k,
							dataKey: u.payload.dataKey,
							index: String(f.index),
							label: u.payload.label,
							sourceViewBox: u.payload.sourceViewBox,
							graphicalItemId: u.payload.graphicalItemId
						}))
					}
				}
			};
			return gL.on(gR, e), () => {
				gL.off(gR, e)
			}
		}, [u, n, r, t, i, a, o, l]), c = tv(ue), s = tv(ur), f = th(), (0, N.useEffect)(() => {
			if (null == c) return ek;
			var e = (e, t, r) => {
				s !== r && c === e && f(mu(t))
			};
			return gL.on(gB, e), () => {
				gL.off(gB, e)
			}
		}, [f, s, c]), null
	};

	function gQ(e) {
		if ("number" == typeof e) return e;
		if ("string" == typeof e) {
			var t = parseFloat(e);
			if (!Number.isNaN(t)) return t
		}
		return 0
	}
	var gJ = (0, N.forwardRef)((e, t) => {
			var r, n, i = (0, N.useRef)(null),
				a = gX((0, N.useState)({
					containerWidth: gQ(null == (r = e.style) ? void 0 : r.width),
					containerHeight: gQ(null == (n = e.style) ? void 0 : n.height)
				}), 2),
				o = a[0],
				l = a[1],
				u = (0, N.useCallback)((e, t) => {
					l(r => {
						var n = Math.round(e),
							i = Math.round(t);
						return r.containerWidth === n && r.containerHeight === i ? r : {
							containerWidth: n,
							containerHeight: i
						}
					})
				}, []),
				c = (0, N.useCallback)(e => {
					if ("function" == typeof t && t(e), null != i.current && (i.current.disconnect(), i.current = null), null != e && "u" > typeof ResizeObserver) {
						var r = e.getBoundingClientRect();
						u(r.width, r.height);
						var n = new ResizeObserver(e => {
							var t = e[0];
							if (null != t) {
								var r = t.contentRect;
								u(r.width, r.height)
							}
						});
						n.observe(e), i.current = n
					}
				}, [t, u]);
			return (0, N.useEffect)(() => () => {
				var e = i.current;
				null != e && e.disconnect()
			}, [u]), N.createElement(N.Fragment, null, N.createElement(aL, {
				width: o.containerWidth,
				height: o.containerHeight
			}), N.createElement("div", gY({
				ref: c
			}, e)))
		}),
		g0 = (0, N.forwardRef)((e, t) => {
			var r = e.width,
				n = e.height,
				i = gX((0, N.useState)({
					containerWidth: gQ(r),
					containerHeight: gQ(n)
				}), 2),
				a = i[0],
				o = i[1],
				l = (0, N.useCallback)((e, t) => {
					o(r => {
						var n = Math.round(e),
							i = Math.round(t);
						return r.containerWidth === n && r.containerHeight === i ? r : {
							containerWidth: n,
							containerHeight: i
						}
					})
				}, []),
				u = (0, N.useCallback)(e => {
					if ("function" == typeof t && t(e), null != e) {
						var r = e.getBoundingClientRect();
						l(r.width, r.height)
					}
				}, [t, l]);
			return N.createElement(N.Fragment, null, N.createElement(aL, {
				width: a.containerWidth,
				height: a.containerHeight
			}), N.createElement("div", gY({
				ref: u
			}, e)))
		}),
		g1 = (0, N.forwardRef)((e, t) => {
			var r = e.width,
				n = e.height;
			return N.createElement(N.Fragment, null, N.createElement(aL, {
				width: r,
				height: n
			}), N.createElement("div", gY({
				ref: t
			}, e)))
		}),
		g2 = (0, N.forwardRef)((e, t) => {
			var r = e.width,
				n = e.height;
			return "string" == typeof r || "string" == typeof n ? N.createElement(g0, gY({}, e, {
				ref: t
			})) : "number" == typeof r && "number" == typeof n ? N.createElement(g1, gY({}, e, {
				width: r,
				height: n,
				ref: t
			})) : N.createElement(N.Fragment, null, N.createElement(aL, {
				width: r,
				height: n
			}), N.createElement("div", gY({
				ref: t
			}, e)))
		}),
		g3 = (0, N.forwardRef)((e, t) => {
			var r, n, i, a, o, l, u = e.children,
				c = e.className,
				s = e.height,
				f = e.onClick,
				h = e.onContextMenu,
				d = e.onDoubleClick,
				p = e.onMouseDown,
				y = e.onMouseEnter,
				v = e.onMouseLeave,
				m = e.onMouseMove,
				g = e.onMouseUp,
				b = e.onTouchEnd,
				x = e.onTouchMove,
				w = e.onTouchStart,
				O = e.style,
				_ = e.width,
				A = e.responsive,
				S = e.dispatchTouchEvents,
				j = void 0 === S || S,
				E = (0, N.useRef)(null),
				k = th(),
				P = gX((0, N.useState)(null), 2),
				M = P[0],
				I = P[1],
				C = gX((0, N.useState)(null), 2),
				T = C[0],
				D = C[1],
				z = (r = th(), a = (i = function(e) {
					if (Array.isArray(e)) return e
				}(n = (0, N.useState)(null)) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(n) || function(e) {
					if (e) {
						if ("string" == typeof e) return gH(e, 2);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? gH(e, 2) : void 0
					}
				}(n) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}())[0], o = i[1], l = tv(ae), (0, N.useEffect)(() => {
					if (null != a) {
						var e = a.getBoundingClientRect().width / a.offsetWidth;
						eZ(e) && e !== l && r(nP(e))
					}
				}, [a, r, l]), o),
				L = aP(),
				R = (null == L ? void 0 : L.width) > 0 ? L.width : _,
				B = (null == L ? void 0 : L.height) > 0 ? L.height : s,
				$ = (0, N.useCallback)(e => {
					z(e), "function" == typeof t && t(e), I(e), D(e), null != e && (E.current = e)
				}, [z, t, I, D]),
				U = (0, N.useCallback)(e => {
					k(mE(e)), k(m5({
						handler: f,
						reactEvent: e
					}))
				}, [k, f]),
				F = (0, N.useCallback)(e => {
					k(mP(e)), k(m5({
						handler: y,
						reactEvent: e
					}))
				}, [k, y]),
				K = (0, N.useCallback)(e => {
					k(lO()), k(m5({
						handler: v,
						reactEvent: e
					}))
				}, [k, v]),
				H = (0, N.useCallback)(e => {
					k(mP(e)), k(m5({
						handler: m,
						reactEvent: e
					}))
				}, [k, m]),
				q = (0, N.useCallback)(() => {
					k(mZ())
				}, [k]),
				V = (0, N.useCallback)(() => {
					k(mQ())
				}, [k]),
				Y = (0, N.useCallback)(e => {
					k(mG(e.key))
				}, [k]),
				X = (0, N.useCallback)(e => {
					k(m5({
						handler: h,
						reactEvent: e
					}))
				}, [k, h]),
				G = (0, N.useCallback)(e => {
					k(m5({
						handler: d,
						reactEvent: e
					}))
				}, [k, d]),
				Z = (0, N.useCallback)(e => {
					k(m5({
						handler: p,
						reactEvent: e
					}))
				}, [k, p]),
				Q = (0, N.useCallback)(e => {
					k(m5({
						handler: g,
						reactEvent: e
					}))
				}, [k, g]),
				J = (0, N.useCallback)(e => {
					k(m5({
						handler: w,
						reactEvent: e
					}))
				}, [k, w]),
				ee = (0, N.useCallback)(e => {
					j && k(gt(e)), k(m5({
						handler: x,
						reactEvent: e
					}))
				}, [k, j, x]),
				et = (0, N.useCallback)(e => {
					k(m5({
						handler: b,
						reactEvent: e
					}))
				}, [k, b]);
			return N.createElement(gq.Provider, {
				value: M
			}, N.createElement(gW.Provider, {
				value: T
			}, N.createElement(A ? gJ : g2, {
				width: null != R ? R : null == O ? void 0 : O.width,
				height: null != B ? B : null == O ? void 0 : O.height,
				className: (0, W.f)("recharts-wrapper", c),
				style: function(e) {
					for (var t = 1; t < arguments.length; t++) {
						var r = null != arguments[t] ? arguments[t] : {};
						t % 2 ? gV(Object(r), !0).forEach(function(t) {
							var n, i, a;
							n = e, i = t, a = r[t], (i = function(e) {
								var t = function(e, t) {
									if ("object" != typeof e || !e) return e;
									var r = e[Symbol.toPrimitive];
									if (void 0 !== r) {
										var n = r.call(e, t || "default");
										if ("object" != typeof n) return n;
										throw TypeError("@@toPrimitive must return a primitive value.")
									}
									return ("string" === t ? String : Number)(e)
								}(e, "string");
								return "symbol" == typeof t ? t : t + ""
							}(i)) in n ? Object.defineProperty(n, i, {
								value: a,
								enumerable: !0,
								configurable: !0,
								writable: !0
							}) : n[i] = a
						}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : gV(Object(r)).forEach(function(t) {
							Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
						})
					}
					return e
				}({
					position: "relative",
					cursor: "default",
					width: R,
					height: B
				}, O),
				onClick: U,
				onContextMenu: X,
				onDoubleClick: G,
				onFocus: q,
				onBlur: V,
				onKeyDown: Y,
				onMouseDown: Z,
				onMouseEnter: F,
				onMouseLeave: K,
				onMouseMove: H,
				onMouseUp: Q,
				onTouchEnd: et,
				onTouchMove: ee,
				onTouchStart: J,
				ref: $
			}, N.createElement(gZ, null), u)))
		});

	function g5(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var g6 = (0, N.createContext)(void 0),
		g4 = e => {
			var t, r = e.children,
				n = (function(e) {
					if (Array.isArray(e)) return e
				}(t = (0, N.useState)("".concat(eO("recharts"), "-clip"))) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 1 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(t) || function(e) {
					if (e) {
						if ("string" == typeof e) return g5(e, 1);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? g5(e, 1) : void 0
					}
				}(t) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}())[0],
				i = tv(yB);
			if (null == i) return null;
			var a = i.x,
				o = i.y,
				l = i.width,
				u = i.height;
			return N.createElement(g6.Provider, {
				value: n
			}, N.createElement("defs", null, N.createElement("clipPath", {
				id: n
			}, N.createElement("rect", {
				x: a,
				y: o,
				height: u,
				width: l
			}))), r)
		},
		g8 = ["width", "height", "responsive", "children", "className", "style", "compact", "title", "desc"],
		g7 = (0, N.forwardRef)((e, t) => {
			var r = e.width,
				n = e.height,
				i = e.responsive,
				a = e.children,
				o = e.className,
				l = e.style,
				u = e.compact,
				c = e.title,
				s = e.desc,
				f = Q(function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, g8));
			return u ? N.createElement(N.Fragment, null, N.createElement(aL, {
				width: r,
				height: n
			}), N.createElement(gz, {
				otherAttributes: f,
				title: c,
				desc: s
			}, a)) : N.createElement(g3, {
				className: o,
				style: l,
				width: r,
				height: n,
				responsive: null != i && i,
				onClick: e.onClick,
				onMouseLeave: e.onMouseLeave,
				onMouseEnter: e.onMouseEnter,
				onMouseMove: e.onMouseMove,
				onMouseDown: e.onMouseDown,
				onMouseUp: e.onMouseUp,
				onContextMenu: e.onContextMenu,
				onDoubleClick: e.onDoubleClick,
				onTouchStart: e.onTouchStart,
				onTouchMove: e.onTouchMove,
				onTouchEnd: e.onTouchEnd
			}, N.createElement(gz, {
				otherAttributes: f,
				title: c,
				desc: s,
				ref: t
			}, N.createElement(g4, null, a)))
		});

	function g9() {
		return (g9 = Object.assign.bind()).apply(null, arguments)
	}

	function be(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}
	var bt = function(e) {
			for (var t = 1; t < arguments.length; t++) {
				var r = null != arguments[t] ? arguments[t] : {};
				t % 2 ? be(Object(r), !0).forEach(function(t) {
					var n, i, a;
					n = e, i = t, a = r[t], (i = function(e) {
						var t = function(e, t) {
							if ("object" != typeof e || !e) return e;
							var r = e[Symbol.toPrimitive];
							if (void 0 !== r) {
								var n = r.call(e, t || "default");
								if ("object" != typeof n) return n;
								throw TypeError("@@toPrimitive must return a primitive value.")
							}
							return ("string" === t ? String : Number)(e)
						}(e, "string");
						return "symbol" == typeof t ? t : t + ""
					}(i)) in n ? Object.defineProperty(n, i, {
						value: a,
						enumerable: !0,
						configurable: !0,
						writable: !0
					}) : n[i] = a
				}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : be(Object(r)).forEach(function(t) {
					Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
				})
			}
			return e
		}({
			accessibilityLayer: !0,
			barCategoryGap: "10%",
			barGap: 4,
			layout: "horizontal",
			margin: {
				top: 5,
				right: 5,
				bottom: 5,
				left: 5
			},
			responsive: !1,
			reverseStackOrder: !1,
			stackOffset: "none",
			syncMethod: "index"
		}, gs),
		br = (0, N.forwardRef)(function(e, t) {
			var r, n = eG(e.categoricalChartProps, bt),
				i = e.chartName,
				a = e.defaultTooltipEventType,
				o = e.validateTooltipEventTypes,
				l = e.tooltipPayloadSearcher,
				u = e.categoricalChartProps;
			return N.createElement(gx, {
				preloadedState: {
					options: {
						chartName: i,
						defaultTooltipEventType: a,
						validateTooltipEventTypes: o,
						tooltipPayloadSearcher: l,
						eventEmitter: void 0
					}
				},
				reduxStoreName: null != (r = u.id) ? r : i
			}, N.createElement(gw, {
				chartData: u.data
			}), N.createElement(gO, {
				layout: n.layout,
				margin: n.margin
			}), N.createElement(gA, {
				throttleDelay: n.throttleDelay,
				throttledEvents: n.throttledEvents
			}), N.createElement(g_, {
				baseValue: n.baseValue,
				accessibilityLayer: n.accessibilityLayer,
				barCategoryGap: n.barCategoryGap,
				maxBarSize: n.maxBarSize,
				stackOffset: n.stackOffset,
				barGap: n.barGap,
				barSize: n.barSize,
				syncId: n.syncId,
				syncMethod: n.syncMethod,
				className: n.className,
				reverseStackOrder: n.reverseStackOrder
			}), N.createElement(g7, g9({}, n, {
				ref: t
			})))
		}),
		bn = ["axis", "item"],
		bi = (0, N.forwardRef)((e, t) => N.createElement(br, {
			chartName: "BarChart",
			defaultTooltipEventType: "axis",
			validateTooltipEventTypes: bn,
			tooltipPayloadSearcher: mt,
			categoricalChartProps: e,
			ref: t
		})),
		ba = function(e) {
			var t = e.width,
				r = e.height,
				n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
				i = (n % 180 + 180) % 180 * Math.PI / 180,
				a = Math.atan(r / t);
			return Math.abs(i > a && i < Math.PI - a ? r / Math.sin(i) : t / Math.cos(i))
		};

	function bo(e, t) {
		if (t < 1) return [];
		if (1 === t) return e;
		for (var r = [], n = 0; n < e.length; n += t) {
			var i = e[n];
			void 0 !== i && r.push(i)
		}
		return r
	}

	function bl(e, t, r, n, i) {
		if (e * t < e * n || e * t > e * i) return !1;
		var a = r();
		return e * (t - e * a / 2 - n) >= 0 && e * (t + e * a / 2 - i) <= 0
	}

	function bu(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function bc(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? bu(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bu(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function bs(e, t, r) {
		var n, i, a, o, l, u, c = e.tick,
			s = e.ticks,
			f = e.viewBox,
			h = e.minTickGap,
			d = e.orientation,
			p = e.interval,
			y = e.tickFormatter,
			v = e.unit,
			m = e.angle;
		if (!s || !s.length || !c) return [];
		if (eb(p) || eP.isSsr) return null != (u = bo(s, (eb(p) ? p : 0) + 1)) ? u : [];
		var g = "top" === d || "bottom" === d ? "width" : "height",
			b = v && "width" === g ? ez(v, {
				fontSize: t,
				letterSpacing: r
			}) : {
				width: 0,
				height: 0
			},
			x = (e, n) => {
				var i, a = "function" == typeof y ? y(e.value, n) : e.value;
				return "width" === g ? (i = ez(a, {
					fontSize: t,
					letterSpacing: r
				}), ba({
					width: i.width + b.width,
					height: i.height + b.height
				}, m)) : ez(a, {
					fontSize: t,
					letterSpacing: r
				})[g]
			},
			w = s[0],
			O = s[1],
			_ = s.length >= 2 && null != w && null != O ? ev(O.coordinate - w.coordinate) : 1,
			A = (n = "width" === g, i = f.x, a = f.y, o = f.width, l = f.height, 1 === _ ? {
				start: n ? i : a,
				end: n ? i + o : a + l
			} : {
				start: n ? i + o : a + l,
				end: n ? i : a
			});
		return "equidistantPreserveStart" === p ? function(e, t, r, n, i) {
			for (var a, o = (n || []).slice(), l = t.start, u = t.end, c = 0, s = 1, f = l; s <= o.length;)
				if (a = function() {
						var t, a = null == n ? void 0 : n[c];
						if (void 0 === a) return {
							v: bo(n, s)
						};
						var o = c,
							h = () => (void 0 === t && (t = r(a, o)), t),
							d = a.coordinate,
							p = 0 === c || bl(e, d, h, f, u);
						p || (c = 0, f = l, s += 1), p && (f = d + e * (h() / 2 + i), c += s)
					}()) return a.v;
			return []
		}(_, A, x, s, h) : "equidistantPreserveEnd" === p ? function(e, t, r, n, i) {
			var a = (n || []).slice().length;
			if (0 === a) return [];
			for (var o = t.start, l = t.end, u = 1; u <= a; u++) {
				for (var c, s = (a - 1) % u, f = o, h = !0, d = s; d < a && (0 === (c = function() {
						var t, a = n[d];
						if (null == a) return 0;
						var o = d,
							u = () => (void 0 === t && (t = r(a, o)), t),
							c = a.coordinate,
							p = d === s || bl(e, c, u, f, l);
						if (!p) return h = !1, 1;
						p && (f = c + e * (u() / 2 + i))
					}()) || 1 !== c); d += u);
				if (h) {
					for (var p = [], y = s; y < a; y += u) {
						var v = n[y];
						null != v && p.push(v)
					}
					return p
				}
			}
			return []
		}(_, A, x, s, h) : ("preserveStart" === p || "preserveStartEnd" === p ? function(e, t, r, n, i, a) {
			var o = (n || []).slice(),
				l = o.length,
				u = t.start,
				c = t.end;
			if (a) {
				var s = n[l - 1];
				if (null != s) {
					var f = r(s, l - 1),
						h = e * (s.coordinate + e * f / 2 - c);
					o[l - 1] = s = bc(bc({}, s), {}, {
						tickCoord: h > 0 ? s.coordinate - h * e : s.coordinate
					}), null != s.tickCoord && bl(e, s.tickCoord, () => f, u, c) && (c = s.tickCoord - e * (f / 2 + i), o[l - 1] = bc(bc({}, s), {}, {
						isShow: !0
					}))
				}
			}
			for (var d = a ? l - 1 : l, p = function(t) {
					var n, a = o[t];
					if (null == a) return 1;
					var l = a,
						s = () => (void 0 === n && (n = r(a, t)), n);
					if (0 === t) {
						var f = e * (l.coordinate - e * s() / 2 - u);
						o[t] = l = bc(bc({}, l), {}, {
							tickCoord: f < 0 ? l.coordinate - f * e : l.coordinate
						})
					} else o[t] = l = bc(bc({}, l), {}, {
						tickCoord: l.coordinate
					});
					null != l.tickCoord && bl(e, l.tickCoord, s, u, c) && (u = l.tickCoord + e * (s() / 2 + i), o[t] = bc(bc({}, l), {}, {
						isShow: !0
					}))
				}, y = 0; y < d; y++)
				if (p(y)) continue;
			return o
		}(_, A, x, s, h, "preserveStartEnd" === p) : function(e, t, r, n, i) {
			for (var a = (n || []).slice(), o = a.length, l = t.start, u = t.end, c = function(t) {
					var n, c = a[t];
					if (null == c) return 1;
					var s = c,
						f = () => (void 0 === n && (n = r(c, t)), n);
					if (t === o - 1) {
						var h = e * (s.coordinate + e * f() / 2 - u);
						a[t] = s = bc(bc({}, s), {}, {
							tickCoord: h > 0 ? s.coordinate - h * e : s.coordinate
						})
					} else a[t] = s = bc(bc({}, s), {}, {
						tickCoord: s.coordinate
					});
					null != s.tickCoord && bl(e, s.tickCoord, f, l, u) && (u = s.tickCoord - e * (f() / 2 + i), a[t] = bc(bc({}, s), {}, {
						isShow: !0
					}))
				}, s = o - 1; s >= 0; s--)
				if (c(s)) continue;
			return a
		}(_, A, x, s, h)).filter(e => e.isShow)
	}

	function bf() {}

	function bh(e) {
		return Object.getOwnPropertySymbols(e).filter(t => Object.prototype.propertyIsEnumerable.call(e, t))
	}

	function bd(e) {
		return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : Object.prototype.toString.call(e)
	}
	let bp = "[object RegExp]",
		by = "[object String]",
		bv = "[object Number]",
		bm = "[object Boolean]",
		bg = "[object Arguments]",
		bb = "[object Symbol]",
		bx = "[object Date]",
		bw = "[object Map]",
		bO = "[object Set]",
		b_ = "[object Array]",
		bA = "[object ArrayBuffer]",
		bS = "[object Object]",
		bj = "[object DataView]",
		bE = "[object Uint8Array]",
		bk = "[object Uint8ClampedArray]",
		bP = "[object Uint16Array]",
		bM = "[object Uint32Array]",
		bI = "[object Int8Array]",
		bC = "[object Int16Array]",
		bT = "[object Int32Array]",
		bD = "[object Float32Array]",
		bN = "[object Float64Array]",
		bz = "object" == typeof globalThis && globalThis || "object" == typeof window && window || "object" == typeof self && self || e.g || function() {
			return this
		}();

	function bL(e) {
		return void 0 !== bz.Buffer && bz.Buffer.isBuffer(e)
	}

	function bR(e) {
		if (!e || "object" != typeof e) return !1;
		let t = Object.getPrototypeOf(e);
		return (null === t || t === Object.prototype || null === Object.getPrototypeOf(t)) && "[object Object]" === Object.prototype.toString.call(e)
	}
	var bB = ["axisLine", "width", "height", "className", "hide", "ticks", "axisType", "axisId"];

	function b$(e, t) {
		return function(e) {
			if (Array.isArray(e)) return e
		}(e) || function(e, t) {
			var r = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
			if (null != r) {
				var n, i, a, o, l = [],
					u = !0,
					c = !1;
				try {
					if (a = (r = r.call(e)).next, 0 === t) {
						if (Object(r) !== r) return;
						u = !1
					} else
						for (; !(u = (n = a.call(r)).done) && (l.push(n.value), l.length !== t); u = !0);
				} catch (e) {
					c = !0, i = e
				} finally {
					try {
						if (!u && null != r.return && (o = r.return(), Object(o) !== o)) return
					} finally {
						if (c) throw i
					}
				}
				return l
			}
		}(e, t) || function(e, t) {
			if (e) {
				if ("string" == typeof e) return bU(e, t);
				var r = ({}).toString.call(e).slice(8, -1);
				return "Object" === r && e.constructor && (r = e.constructor.name), "Map" === r || "Set" === r ? Array.from(e) : "Arguments" === r || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r) ? bU(e, t) : void 0
			}
		}(e, t) || function() {
			throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
		}()
	}

	function bU(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function bF() {
		return (bF = Object.assign.bind()).apply(null, arguments)
	}

	function bK(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function bH(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? bK(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : bK(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var bq = {
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		viewBox: {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		},
		orientation: "bottom",
		ticks: [],
		stroke: "#666",
		tickLine: !0,
		axisLine: !0,
		tick: !0,
		mirror: !1,
		minTickGap: 5,
		tickSize: 6,
		tickMargin: 2,
		interval: "preserveEnd",
		zIndex: aR.axis
	};

	function bW(e) {
		var t = e.x,
			r = e.y,
			n = e.width,
			i = e.height,
			a = e.orientation,
			o = e.mirror,
			l = e.axisLine,
			u = e.otherSvgProps;
		if (!l) return null;
		var c = bH(bH(bH({}, u), Q(l)), {}, {
			fill: "none"
		});
		if ("top" === a || "bottom" === a) {
			var s = +("top" === a && !o || "bottom" === a && o);
			c = bH(bH({}, c), {}, {
				x1: t,
				y1: r + s * i,
				x2: t + n,
				y2: r + s * i
			})
		} else {
			var f = +("left" === a && !o || "right" === a && o);
			c = bH(bH({}, c), {}, {
				x1: t + f * n,
				y1: r,
				x2: t + f * n,
				y2: r + i
			})
		}
		return N.createElement("line", bF({}, c, {
			className: (0, W.f)("recharts-cartesian-axis-line", ed(l, "className"))
		}))
	}

	function bV(e) {
		var t, r = e.option,
			n = e.tickProps,
			i = e.value,
			a = (0, W.f)(n.className, "recharts-cartesian-axis-tick-value");
		if (N.isValidElement(r)) t = N.cloneElement(r, bH(bH({}, n), {}, {
			className: a
		}));
		else if ("function" == typeof r) t = r(bH(bH({}, n), {}, {
			className: a
		}));
		else {
			var o = "recharts-cartesian-axis-tick-value";
			"boolean" != typeof r && (o = (0, W.f)(o, r && "object" == typeof r && "className" in r && "string" == typeof r.className ? r.className : "")), t = N.createElement(ti, bF({}, n, {
				className: o
			}), i)
		}
		return t
	}

	function bY(e) {
		var t = e.ticks,
			r = e.axisType,
			n = e.axisId,
			i = th(),
			a = (0, N.useRef)(null);
		return (0, N.useEffect)(() => {
			if (null != n && null != r) {
				var e, o = t.map(e => ({
						value: e.value,
						coordinate: e.coordinate,
						offset: e.offset,
						index: e.index
					})),
					l = a.current;
				null != l && l.axisId === n && l.axisType === r && (e = l.ticks, function e(t, r, n, i, a, o, l) {
					let u = l(t, r, n, i, a, o);
					if (void 0 !== u) return u;
					if (typeof t == typeof r) switch (typeof t) {
						case "bigint":
						case "string":
						case "boolean":
						case "symbol":
						case "undefined":
						case "function":
							return t === r;
						case "number":
							return t === r || Object.is(t, r)
					}
					return function t(r, n, i, a) {
						var o;
						if (Object.is(r, n)) return !0;
						let l = bd(r),
							u = bd(n);
						if ("[object Arguments]" === l && (l = bS), "[object Arguments]" === u && (u = bS), l !== u) return !1;
						switch (l) {
							case by:
								return r.toString() === n.toString();
							case bv:
								return nI(r.valueOf(), n.valueOf());
							case bm:
							case bx:
							case bb:
								return Object.is(r.valueOf(), n.valueOf());
							case bp:
								return r.source === n.source && r.flags === n.flags;
							case "[object Function]":
								return r === n
						}
						let c = (i = null != (o = i) ? o : new Map).get(r),
							s = i.get(n);
						if (null != c && null != s) return c === n;
						i.set(r, n), i.set(n, r);
						try {
							switch (l) {
								case bw:
									if (r.size !== n.size) return !1;
									for (let [t, o] of r.entries())
										if (!n.has(t) || !e(o, n.get(t), t, r, n, i, a)) return !1;
									return !0;
								case bO: {
									if (r.size !== n.size) return !1;
									let t = Array.from(r.values()),
										o = Array.from(n.values());
									for (let l = 0; l < t.length; l++) {
										let u = t[l],
											c = o.findIndex(t => e(u, t, void 0, r, n, i, a));
										if (-1 === c) return !1;
										o.splice(c, 1)
									}
									return !0
								}
								case b_:
								case bE:
								case bk:
								case bP:
								case bM:
								case "[object BigUint64Array]":
								case bI:
								case bC:
								case bT:
								case "[object BigInt64Array]":
								case bD:
								case bN:
									if (bL(r) !== bL(n) || r.length !== n.length) return !1;
									for (let t = 0; t < r.length; t++)
										if (!e(r[t], n[t], t, r, n, i, a)) return !1;
									return !0;
								case bA:
									if (r.byteLength !== n.byteLength) return !1;
									return t(new Uint8Array(r), new Uint8Array(n), i, a);
								case bj:
									if (r.byteLength !== n.byteLength || r.byteOffset !== n.byteOffset) return !1;
									return t(new Uint8Array(r), new Uint8Array(n), i, a);
								case "[object Error]":
									return r.name === n.name && r.message === n.message;
								case bS: {
									if (!(t(r.constructor, n.constructor, i, a) || bR(r) && bR(n))) return !1;
									let o = [...Object.keys(r), ...bh(r)],
										l = [...Object.keys(n), ...bh(n)];
									if (o.length !== l.length) return !1;
									for (let t = 0; t < o.length; t++) {
										let l = o[t],
											u = r[l];
										if (!el(n, l)) return !1;
										let c = n[l];
										if (!e(u, c, l, r, n, i, a)) return !1
									}
									return !0
								}
								default:
									return !1
							}
						} finally {
							i.delete(r), i.delete(n)
						}
					}(t, r, o, l)
				}(e, o, void 0, void 0, void 0, void 0, bf)) || (a.current = {
					ticks: o,
					axisId: n,
					axisType: r
				}, i(gv({
					ticks: o,
					axisId: n,
					axisType: r
				})))
			}
		}, [i, t, n, r]), (0, N.useEffect)(() => null == n || null == r ? ek : () => {
			i(gm({
				axisId: n,
				axisType: r
			}))
		}, [i, n, r]), null
	}
	var bX = (0, N.forwardRef)((e, t) => {
			var r = e.ticks,
				n = e.tick,
				i = e.tickLine,
				a = e.stroke,
				o = e.tickFormatter,
				l = e.unit,
				u = e.padding,
				c = e.tickTextProps,
				s = e.orientation,
				f = e.mirror,
				h = e.x,
				d = e.y,
				p = e.width,
				y = e.height,
				v = e.tickSize,
				m = e.tickMargin,
				g = e.fontSize,
				b = e.letterSpacing,
				x = e.getTicksConfig,
				w = e.events,
				O = e.axisType,
				_ = e.axisId,
				A = bs(bH(bH({}, x), {}, {
					ticks: void 0 === r ? [] : r
				}), g, b),
				S = Q(x),
				j = J(n),
				E = e8(S.textAnchor) ? S.textAnchor : function(e, t) {
					switch (e) {
						case "left":
							return t ? "start" : "end";
						case "right":
							return t ? "end" : "start";
						default:
							return "middle"
					}
				}(s, f),
				k = function(e, t) {
					switch (e) {
						case "left":
						case "right":
							return "middle";
						case "top":
							return t ? "start" : "end";
						default:
							return t ? "end" : "start"
					}
				}(s, f),
				P = {};
			"object" == typeof i && (P = i);
			var M = bH(bH({}, S), {}, {
					fill: "none"
				}, P),
				I = A.map(e => bH({
					entry: e
				}, function(e, t, r, n, i, a, o, l, u) {
					var c, s, f, h, d, p, y = l ? -1 : 1,
						v = e.tickSize || o,
						m = eb(e.tickCoord) ? e.tickCoord : e.coordinate;
					switch (a) {
						case "top":
							c = s = e.coordinate, p = (f = (h = r + !l * i) - y * v) - y * u, d = m;
							break;
						case "left":
							f = h = e.coordinate, d = (c = (s = t + !l * n) - y * v) - y * u, p = m;
							break;
						case "right":
							f = h = e.coordinate, d = (c = (s = t + l * n) + y * v) + y * u, p = m;
							break;
						default:
							c = s = e.coordinate, p = (f = (h = r + l * i) + y * v) + y * u, d = m
					}
					return {
						line: {
							x1: c,
							y1: f,
							x2: s,
							y2: h
						},
						tick: {
							x: d,
							y: p
						}
					}
				}(e, h, d, p, y, s, v, f, m))),
				C = I.map(e => {
					var t = e.entry,
						r = e.line;
					return N.createElement(en, {
						className: "recharts-cartesian-axis-tick",
						key: "tick-".concat(t.value, "-").concat(t.coordinate, "-").concat(t.tickCoord)
					}, i && N.createElement("line", bF({}, M, r, {
						className: (0, W.f)("recharts-cartesian-axis-tick-line", ed(i, "className"))
					})))
				}),
				T = I.map((e, t) => {
					var r, i, s = e.entry,
						f = e.tick,
						h = bH(bH(bH(bH({
							verticalAnchor: k
						}, S), {}, {
							textAnchor: E,
							stroke: "none",
							fill: a
						}, f), {}, {
							index: t,
							payload: s,
							visibleTicksCount: A.length,
							tickFormatter: o,
							padding: u
						}, c), {}, {
							angle: null != (r = null != (i = null == c ? void 0 : c.angle) ? i : S.angle) ? r : 0
						}),
						d = bH(bH({}, h), j);
					return N.createElement(en, bF({
						className: "recharts-cartesian-axis-tick-label",
						key: "tick-label-".concat(s.value, "-").concat(s.coordinate, "-").concat(s.tickCoord)
					}, oB(w, s, t)), n && N.createElement(bV, {
						option: n,
						tickProps: d,
						value: "".concat("function" == typeof o ? o(s.value, t) : s.value).concat(l || "")
					}))
				});
			return N.createElement("g", {
				className: "recharts-cartesian-axis-ticks recharts-".concat(O, "-ticks")
			}, N.createElement(bY, {
				ticks: A,
				axisId: _,
				axisType: O
			}), T.length > 0 && N.createElement(ol, {
				zIndex: aR.label
			}, N.createElement("g", {
				className: "recharts-cartesian-axis-tick-labels recharts-".concat(O, "-tick-labels"),
				ref: t
			}, T)), C.length > 0 && N.createElement("g", {
				className: "recharts-cartesian-axis-tick-lines recharts-".concat(O, "-tick-lines")
			}, C))
		}),
		bG = (0, N.forwardRef)((e, t) => {
			var r = e.axisLine,
				n = e.width,
				i = e.height,
				a = e.className,
				o = e.hide,
				l = e.ticks,
				u = e.axisType,
				c = e.axisId,
				s = function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, bB),
				f = b$((0, N.useState)(""), 2),
				h = f[0],
				d = f[1],
				p = b$((0, N.useState)(""), 2),
				y = p[0],
				v = p[1],
				m = (0, N.useRef)(null);
			(0, N.useImperativeHandle)(t, () => ({
				getCalculatedWidth: () => {
					var t;
					return (e => {
						var t = e.ticks,
							r = e.label,
							n = e.labelGapWithTick,
							i = e.tickSize,
							a = e.tickMargin,
							o = 0;
						if (t) {
							Array.from(t).forEach(e => {
								if (e) {
									var t = e.getBoundingClientRect();
									t.width > o && (o = t.width)
								}
							});
							var l = r ? r.getBoundingClientRect().width : 0;
							return Math.round(o + ((void 0 === i ? 0 : i) + (void 0 === a ? 0 : a)) + l + (r ? void 0 === n ? 5 : n : 0))
						}
						return 0
					})({
						ticks: m.current,
						label: null == (t = e.labelRef) ? void 0 : t.current,
						labelGapWithTick: 5,
						tickSize: e.tickSize,
						tickMargin: e.tickMargin
					})
				},
				getCalculatedHeight: () => {
					var t;
					return (e => {
						var t = e.ticks,
							r = e.label,
							n = e.labelGapWithTick,
							i = e.tickSize,
							a = e.tickMargin,
							o = 0;
						if (t) {
							Array.from(t).forEach(e => {
								if (e) {
									var t = e.getBoundingClientRect();
									t.height > o && (o = t.height)
								}
							});
							var l = r ? r.getBoundingClientRect().height : 0;
							return Math.round(o + ((void 0 === i ? 0 : i) + (void 0 === a ? 0 : a)) + l + (r ? void 0 === n ? 5 : n : 0))
						}
						return 0
					})({
						ticks: m.current,
						label: null == (t = e.labelRef) ? void 0 : t.current,
						labelGapWithTick: 5,
						tickSize: e.tickSize,
						tickMargin: e.tickMargin
					})
				}
			}));
			var g = (0, N.useCallback)(e => {
				if (e) {
					var t = e.getElementsByClassName("recharts-cartesian-axis-tick-value");
					m.current = t;
					var r = t[0];
					if (r) {
						var n = window.getComputedStyle(r),
							i = n.fontSize,
							a = n.letterSpacing;
						(i !== h || a !== y) && (d(i), v(a))
					}
				}
			}, [h, y]);
			return o || null != n && n <= 0 || null != i && i <= 0 ? null : N.createElement(ol, {
				zIndex: e.zIndex
			}, N.createElement(en, {
				className: (0, W.f)("recharts-cartesian-axis", a)
			}, N.createElement(bW, {
				x: e.x,
				y: e.y,
				width: n,
				height: i,
				orientation: e.orientation,
				mirror: e.mirror,
				axisLine: r,
				otherSvgProps: Q(e)
			}), N.createElement(bX, {
				ref: g,
				axisType: u,
				events: s,
				fontSize: h,
				getTicksConfig: e,
				height: e.height,
				letterSpacing: y,
				mirror: e.mirror,
				orientation: e.orientation,
				padding: e.padding,
				stroke: e.stroke,
				tick: e.tick,
				tickFormatter: e.tickFormatter,
				tickLine: e.tickLine,
				tickMargin: e.tickMargin,
				tickSize: e.tickSize,
				tickTextProps: e.tickTextProps,
				ticks: l,
				unit: e.unit,
				width: e.width,
				x: e.x,
				y: e.y,
				axisId: c
			}), N.createElement(oy, {
				x: e.x,
				y: e.y,
				width: e.width,
				height: e.height,
				lowerWidth: e.width,
				upperWidth: e.width
			}, N.createElement(oO, {
				label: e.label,
				labelRef: e.labelRef
			}), e.children)))
		}),
		bZ = N.forwardRef((e, t) => {
			var r = eG(e, bq);
			return N.createElement(bG, bF({}, r, {
				ref: t
			}))
		});
	bZ.displayName = "CartesianAxis";
	var bQ = (0, N.createContext)({
		grid: {
			stroke: "#ccc",
			fill: "none"
		}
	});
	bQ.Provider;
	var bJ = ["x1", "y1", "x2", "y2", "key"],
		b0 = ["offset"],
		b1 = ["xAxisId", "yAxisId"],
		b2 = ["xAxisId", "yAxisId"];

	function b3(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function b5(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? b3(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : b3(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function b6() {
		return (b6 = Object.assign.bind()).apply(null, arguments)
	}

	function b4(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}
	var b8 = e => {
		var t = e.fill;
		if (!t || "none" === t) return null;
		var r = e.fillOpacity,
			n = e.x,
			i = e.y,
			a = e.width,
			o = e.height,
			l = e.ry;
		return N.createElement("rect", {
			x: n,
			y: i,
			ry: l,
			width: a,
			height: o,
			stroke: "none",
			fill: t,
			fillOpacity: r,
			className: "recharts-cartesian-grid-bg"
		})
	};

	function b7(e) {
		var t = e.option,
			r = e.lineItemProps;
		if (N.isValidElement(t)) n = N.cloneElement(t, r);
		else if ("function" == typeof t) n = t(r);
		else {
			var n, i, a = r.x1,
				o = r.y1,
				l = r.x2,
				u = r.y2,
				c = r.key,
				s = null != (i = Q(b4(r, bJ))) ? i : {},
				f = (s.offset, b4(s, b0)),
				h = Array.isArray(f.strokeDasharray) ? f.strokeDasharray.join(",") : f.strokeDasharray;
			n = N.createElement("line", b6({}, f, {
				strokeDasharray: h,
				x1: a,
				y1: o,
				x2: l,
				y2: u,
				fill: "none",
				key: c
			}))
		}
		return n
	}

	function b9(e) {
		var t = e.x,
			r = e.width,
			n = e.horizontal,
			i = void 0 === n || n,
			a = e.horizontalPoints;
		if (!i || !a || !a.length) return null;
		e.xAxisId, e.yAxisId;
		var o = b4(e, b1),
			l = a.map((e, n) => {
				var a = b5(b5({}, o), {}, {
					x1: t,
					y1: e,
					x2: t + r,
					y2: e,
					key: "line-".concat(n),
					index: n
				});
				return N.createElement(b7, {
					key: "line-".concat(n),
					option: i,
					lineItemProps: a
				})
			});
		return N.createElement("g", {
			className: "recharts-cartesian-grid-horizontal"
		}, l)
	}

	function xe(e) {
		var t = e.y,
			r = e.height,
			n = e.vertical,
			i = void 0 === n || n,
			a = e.verticalPoints;
		if (!i || !a || !a.length) return null;
		e.xAxisId, e.yAxisId;
		var o = b4(e, b2),
			l = a.map((e, n) => {
				var a = b5(b5({}, o), {}, {
					x1: e,
					y1: t,
					x2: e,
					y2: t + r,
					key: "line-".concat(n),
					index: n
				});
				return N.createElement(b7, {
					option: i,
					lineItemProps: a,
					key: "line-".concat(n)
				})
			});
		return N.createElement("g", {
			className: "recharts-cartesian-grid-vertical"
		}, l)
	}

	function xt(e) {
		var t = e.horizontalFill,
			r = e.fillOpacity,
			n = e.x,
			i = e.y,
			a = e.width,
			o = e.height,
			l = e.horizontalPoints,
			u = e.horizontal;
		if (!(void 0 === u || u) || !t || !t.length || null == l) return null;
		var c = l.map(e => Math.round(e + i - i)).sort((e, t) => e - t);
		i !== c[0] && c.unshift(0);
		var s = c.map((e, l) => {
			var u = c[l + 1],
				s = null == u ? i + o - e : u - e;
			if (s <= 0) return null;
			var f = l % t.length;
			return N.createElement("rect", {
				key: "react-".concat(l),
				y: e,
				x: n,
				height: s,
				width: a,
				stroke: "none",
				fill: t[f],
				fillOpacity: r,
				className: "recharts-cartesian-grid-bg"
			})
		});
		return N.createElement("g", {
			className: "recharts-cartesian-gridstripes-horizontal"
		}, s)
	}

	function xr(e) {
		var t = e.vertical,
			r = e.verticalFill,
			n = e.fillOpacity,
			i = e.x,
			a = e.y,
			o = e.width,
			l = e.height,
			u = e.verticalPoints;
		if (!(void 0 === t || t) || !r || !r.length) return null;
		var c = u.map(e => Math.round(e + i - i)).sort((e, t) => e - t);
		i !== c[0] && c.unshift(0);
		var s = c.map((e, t) => {
			var u = c[t + 1],
				s = null == u ? i + o - e : u - e;
			if (s <= 0) return null;
			var f = t % r.length;
			return N.createElement("rect", {
				key: "react-".concat(t),
				x: e,
				y: a,
				width: s,
				height: l,
				stroke: "none",
				fill: r[f],
				fillOpacity: n,
				className: "recharts-cartesian-grid-bg"
			})
		});
		return N.createElement("g", {
			className: "recharts-cartesian-gridstripes-vertical"
		}, s)
	}
	var xn = (e, t) => {
			var r = e.xAxis,
				n = e.width,
				i = e.height,
				a = e.offset;
			return iJ(bs(b5(b5(b5({}, bq), r), {}, {
				ticks: i0(r, !0),
				viewBox: {
					x: 0,
					y: 0,
					width: n,
					height: i
				}
			})), a.left, a.left + a.width, t)
		},
		xi = (e, t) => {
			var r = e.yAxis,
				n = e.width,
				i = e.height,
				a = e.offset;
			return iJ(bs(b5(b5(b5({}, bq), r), {}, {
				ticks: i0(r, !0),
				viewBox: {
					x: 0,
					y: 0,
					width: n,
					height: i
				}
			})), a.top, a.top + a.height, t)
		},
		xa = {
			horizontal: !0,
			vertical: !0,
			horizontalPoints: [],
			verticalPoints: [],
			verticalFill: [],
			horizontalFill: [],
			xAxisId: 0,
			yAxisId: 0,
			syncWithTicks: !1,
			zIndex: aR.grid
		};

	function xo(e) {
		var t, r, n, i, a, o, l = tv(i7),
			u = tv(i9),
			c = aD(),
			s = b5(b5({}, eG(e, xa)), {}, {
				x: eb(e.x) ? e.x : c.left,
				y: eb(e.y) ? e.y : c.top,
				width: eb(e.width) ? e.width : c.width,
				height: eb(e.height) ? e.height : c.height
			}),
			f = s.xAxisId,
			h = s.yAxisId,
			d = s.x,
			p = s.y,
			y = s.width,
			v = s.height,
			m = s.syncWithTicks,
			g = s.horizontalValues,
			b = s.verticalValues,
			x = as(),
			w = tv(e => px(e, "xAxis", f, x)),
			O = tv(e => px(e, "yAxis", h, x)),
			_ = (0, N.useContext)(bQ),
			A = {
				stroke: null != (t = s.stroke) ? t : _.grid.stroke,
				strokeWidth: null != (r = s.strokeWidth) ? r : _.grid.strokeWidth,
				strokeOpacity: null != (n = s.strokeOpacity) ? n : _.grid.strokeOpacity,
				strokeDasharray: null != (i = s.strokeDasharray) ? i : _.grid.strokeDasharray
			};
		if (!eQ(y) || !eQ(v) || !eb(d) || !eb(p)) return null;
		var S = s.verticalCoordinatesGenerator || xn,
			j = s.horizontalCoordinatesGenerator || xi,
			E = s.horizontalPoints,
			k = s.verticalPoints;
		if ((!E || !E.length) && "function" == typeof j) {
			var P = g && g.length,
				M = j({
					yAxis: O ? b5(b5({}, O), {}, {
						ticks: P ? g : O.ticks
					}) : void 0,
					width: null != l ? l : y,
					height: null != u ? u : v,
					offset: c
				}, !!P || m);
			ad(Array.isArray(M), "horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof M, "]")), Array.isArray(M) && (E = M)
		}
		if ((!k || !k.length) && "function" == typeof S) {
			var I = b && b.length,
				C = S({
					xAxis: w ? b5(b5({}, w), {}, {
						ticks: I ? b : w.ticks
					}) : void 0,
					width: null != l ? l : y,
					height: null != u ? u : v,
					offset: c
				}, !!I || m);
			ad(Array.isArray(C), "verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof C, "]")), Array.isArray(C) && (k = C)
		}
		return N.createElement(ol, {
			zIndex: s.zIndex
		}, N.createElement("g", {
			className: "recharts-cartesian-grid"
		}, N.createElement(b8, {
			fill: null != (a = s.fill) ? a : _.grid.fill,
			fillOpacity: null != (o = s.fillOpacity) ? o : _.grid.fillOpacity,
			x: s.x,
			y: s.y,
			width: s.width,
			height: s.height,
			ry: s.ry
		}), N.createElement(xt, b6({}, s, {
			horizontalPoints: E
		})), N.createElement(xr, b6({}, s, {
			verticalPoints: k
		})), N.createElement(b9, b6({}, s, A, {
			offset: c,
			horizontalPoints: E,
			xAxis: w,
			yAxis: O
		})), N.createElement(xe, b6({}, s, A, {
			offset: c,
			verticalPoints: k,
			xAxis: w,
			yAxis: O
		}))))
	}
	xo.displayName = "CartesianGrid";
	var xl = ["domain", "range"],
		xu = ["domain", "range"];

	function xc(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}

	function xs(e, t) {
		return e === t || !!(Array.isArray(e) && 2 === e.length && Array.isArray(t)) && 2 === t.length && e[0] === t[0] && e[1] === t[1]
	}
	var xf = ["type"],
		xh = ["dangerouslySetInnerHTML", "ticks", "scale"],
		xd = ["id", "scale"];

	function xp() {
		return (xp = Object.assign.bind()).apply(null, arguments)
	}

	function xy(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function xv(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? xy(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xy(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function xm(e, t) {
		if (null == e) return {};
		var r, n, i = function(e, t) {
			if (null == e) return {};
			var r = {};
			for (var n in e)
				if (({}).hasOwnProperty.call(e, n)) {
					if (-1 !== t.indexOf(n)) continue;
					r[n] = e[n]
				} return r
		}(e, t);
		if (Object.getOwnPropertySymbols) {
			var a = Object.getOwnPropertySymbols(e);
			for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
		}
		return i
	}

	function xg(e) {
		var t = th(),
			r = (0, N.useRef)(null),
			n = (() => {
				var e = tv(aN);
				if ("horizontal" === e || "vertical" === e) return e
			})(),
			i = e.type,
			a = xm(e, xf),
			o = aF(n, "xAxis", i),
			l = (0, N.useMemo)(() => {
				if (null != o) return xv(xv({}, a), {}, {
					type: o
				})
			}, [a, o]);
		return (0, N.useLayoutEffect)(() => {
			null != l && (null === r.current ? t(pI(l)) : r.current !== l && t(pC({
				prev: r.current,
				next: l
			})), r.current = l)
		}, [l, t]), (0, N.useLayoutEffect)(() => () => {
			r.current && (t(pT(r.current)), r.current = null)
		}, [t]), null
	}
	var xb = e => {
			var t = e.xAxisId,
				r = e.className,
				n = e.height,
				i = e.label,
				a = (0, N.useRef)(null),
				o = (0, N.useRef)(null),
				l = tv(au),
				u = as(),
				c = th(),
				s = "xAxis",
				f = tv(e => pw(e, s, t, u)),
				h = tv(e => ph(e, t)),
				d = tv(e => py(e, t)),
				p = tv(e => hX(e, t));
			if ((0, N.useLayoutEffect)(() => {
					if (!("auto" !== n || !h || og(i) || (0, N.isValidElement)(i)) && null != p) {
						var e = a.current;
						if (e) {
							var r = e.getCalculatedHeight();
							Math.round(h.height) !== Math.round(r) && c(pD({
								id: t,
								height: r
							}))
						}
					}
				}, [f, h, c, i, t, n, p]), null == h || null == d || null == p) return null;
			e.dangerouslySetInnerHTML, e.ticks, e.scale;
			var y = xm(e, xh);
			p.id, p.scale;
			var v = xm(p, xd);
			return N.createElement(bZ, xp({}, y, v, {
				ref: a,
				labelRef: o,
				x: d.x,
				y: d.y,
				width: h.width,
				height: h.height,
				className: (0, W.f)("recharts-".concat(s, " ").concat(s), r),
				viewBox: l,
				ticks: f,
				axisType: s,
				axisId: t
			}))
		},
		xx = {
			allowDataOverflow: hY.allowDataOverflow,
			allowDecimals: hY.allowDecimals,
			allowDuplicatedCategory: hY.allowDuplicatedCategory,
			angle: hY.angle,
			axisLine: bq.axisLine,
			height: hY.height,
			hide: !1,
			includeHidden: hY.includeHidden,
			interval: hY.interval,
			label: !1,
			minTickGap: hY.minTickGap,
			mirror: hY.mirror,
			orientation: hY.orientation,
			padding: hY.padding,
			reversed: hY.reversed,
			scale: hY.scale,
			tick: hY.tick,
			tickCount: hY.tickCount,
			tickLine: bq.tickLine,
			tickSize: bq.tickSize,
			type: hY.type,
			niceTicks: hY.niceTicks,
			xAxisId: 0
		},
		xw = N.memo(e => {
			var t = eG(e, xx);
			return N.createElement(N.Fragment, null, N.createElement(xg, {
				allowDataOverflow: t.allowDataOverflow,
				allowDecimals: t.allowDecimals,
				allowDuplicatedCategory: t.allowDuplicatedCategory,
				angle: t.angle,
				dataKey: t.dataKey,
				domain: t.domain,
				height: t.height,
				hide: t.hide,
				id: t.xAxisId,
				includeHidden: t.includeHidden,
				interval: t.interval,
				minTickGap: t.minTickGap,
				mirror: t.mirror,
				name: t.name,
				orientation: t.orientation,
				padding: t.padding,
				reversed: t.reversed,
				scale: t.scale,
				tick: t.tick,
				tickCount: t.tickCount,
				tickFormatter: t.tickFormatter,
				ticks: t.ticks,
				type: t.type,
				unit: t.unit,
				niceTicks: t.niceTicks
			}), N.createElement(xb, t))
		}, function(e, t) {
			if (e === t) return !0;
			var r = e.domain,
				n = e.range,
				i = xc(e, xl),
				a = t.domain,
				o = t.range,
				l = xc(t, xu);
			return !!xs(r, a) && !!xs(n, o) && vI(i, l)
		});
	xw.displayName = "XAxis";
	var xO = e.i(120384);

	function x_() {
		return (x_ = Object.assign.bind()).apply(null, arguments)
	}

	function xA(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function xS(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? xA(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xA(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function xj(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function xE(e) {
		return Array.isArray(e) && ex(e[0]) && ex(e[1]) ? e.join(" ~ ") : e
	}
	var xk = {
			margin: 0,
			padding: 10,
			backgroundColor: "#fff",
			border: "1px solid #ccc",
			whiteSpace: "nowrap"
		},
		xP = {
			display: "block",
			paddingTop: 4,
			paddingBottom: 4,
			color: "#000"
		},
		xM = {},
		xI = e => {
			var t = e.separator,
				r = void 0 === t ? " : " : t,
				n = e.contentStyle,
				i = e.itemStyle,
				a = e.labelStyle,
				o = e.payload,
				l = e.formatter,
				u = e.itemSorter,
				c = e.wrapperClassName,
				s = e.labelClassName,
				f = e.label,
				h = e.labelFormatter,
				d = e.accessibilityLayer,
				p = xS(xS({}, xk), n),
				y = xS({
					margin: 0
				}, void 0 === a ? xM : a),
				v = null != f,
				m = v ? f : "",
				g = (0, W.f)("recharts-default-tooltip", c),
				b = (0, W.f)("recharts-tooltip-label", s);
			return v && h && null != o && (m = h(f, o)), N.createElement("div", x_({
				className: g,
				style: p
			}, void 0 !== d && d ? {
				role: "status",
				"aria-live": "assertive"
			} : {}), N.createElement("p", {
				className: b,
				style: y
			}, N.isValidElement(m) ? m : "".concat(m)), (() => {
				if (o && o.length) {
					var e = (null == u ? o : nU(o, u)).map((e, t) => {
						if (!e || "none" === e.type) return null;
						var n = e.formatter || l || xE,
							a = e.value,
							u = e.name,
							c = a,
							s = u,
							f = n(a, u, e, t, o);
						if (Array.isArray(f)) {
							var h = function(e) {
								if (Array.isArray(e)) return e
							}(f) || function(e) {
								var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
								if (null != t) {
									var r, n, i, a, o = [],
										l = !0,
										u = !1;
									try {
										i = (t = t.call(e)).next, !1;
										for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
									} catch (e) {
										u = !0, n = e
									} finally {
										try {
											if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
										} finally {
											if (u) throw n
										}
									}
									return o
								}
							}(f) || function(e) {
								if (e) {
									if ("string" == typeof e) return xj(e, 2);
									var t = ({}).toString.call(e).slice(8, -1);
									return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xj(e, 2) : void 0
								}
							}(f) || function() {
								throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
							}();
							c = h[0], s = h[1]
						} else {
							if (null == f) return null;
							c = f
						}
						var d = xS(xS({}, xP), {}, {
							color: e.color || xP.color
						}, i);
						return N.createElement("li", {
							className: "recharts-tooltip-item",
							key: "tooltip-item-".concat(t),
							style: d
						}, ex(s) ? N.createElement("span", {
							className: "recharts-tooltip-item-name"
						}, s) : null, ex(s) ? N.createElement("span", {
							className: "recharts-tooltip-item-separator"
						}, r) : null, N.createElement("span", {
							className: "recharts-tooltip-item-value"
						}, c), N.createElement("span", {
							className: "recharts-tooltip-item-unit"
						}, e.unit || ""))
					});
					return N.createElement("ul", {
						className: "recharts-tooltip-item-list",
						style: {
							padding: 0,
							margin: 0
						}
					}, e)
				}
				return null
			})())
		},
		xC = "recharts-tooltip-wrapper",
		xT = {
			visibility: "hidden"
		};

	function xD(e) {
		var t = e.allowEscapeViewBox,
			r = e.coordinate,
			n = e.key,
			i = e.offset,
			a = e.position,
			o = e.reverseDirection,
			l = e.tooltipDimension,
			u = e.viewBox,
			c = e.viewBoxDimension;
		if (a && eb(a[n])) return a[n];
		var s = r[n] - l - (i > 0 ? i : 0),
			f = r[n] + i;
		if (t[n]) return o[n] ? s : f;
		var h = u[n];
		return null == h ? 0 : o[n] ? s < h ? Math.max(f, h) : Math.max(s, h) : null == c ? 0 : f + l > h + c ? Math.max(s, h) : Math.max(f, h)
	}

	function xN(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function xz(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? xN(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : xN(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function xL(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}
	var xR = N.memo(function(e) {
		var t, r, n, i, a, o, l, u, c, s, f, h, d, p, y, v, m, g, b, x, w, O, _, A, S, j, E, k = oY(),
			P = function(e) {
				if (Array.isArray(e)) return e
			}(w = N.useState(() => ({
				dismissed: !1,
				dismissedAtCoordinate: {
					x: 0,
					y: 0
				}
			}))) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(w) || function(e) {
				if (e) {
					if ("string" == typeof e) return xL(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xL(e, 2) : void 0
				}
			}(w) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}(),
			M = P[0],
			I = P[1];
		N.useEffect(() => {
			var t = t => {
				if ("Escape" === t.key) {
					var r, n, i, a;
					I({
						dismissed: !0,
						dismissedAtCoordinate: {
							x: null != (r = null == (n = e.coordinate) ? void 0 : n.x) ? r : 0,
							y: null != (i = null == (a = e.coordinate) ? void 0 : a.y) ? i : 0
						}
					})
				}
			};
			return document.addEventListener("keydown", t), () => {
				document.removeEventListener("keydown", t)
			}
		}, [null == (O = e.coordinate) ? void 0 : O.x, null == (_ = e.coordinate) ? void 0 : _.y]), M.dismissed && ((null != (A = null == (S = e.coordinate) ? void 0 : S.x) ? A : 0) !== M.dismissedAtCoordinate.x || (null != (j = null == (E = e.coordinate) ? void 0 : E.y) ? j : 0) !== M.dismissedAtCoordinate.y) && I(xz(xz({}, M), {}, {
			dismissed: !1
		}));
		var C = (h = (t = {
				allowEscapeViewBox: e.allowEscapeViewBox,
				coordinate: e.coordinate,
				offsetLeft: "number" == typeof e.offset ? e.offset : e.offset.x,
				offsetTop: "number" == typeof e.offset ? e.offset : e.offset.y,
				position: e.position,
				reverseDirection: e.reverseDirection,
				tooltipBox: e.lastBoundingBox,
				useTranslate3d: e.useTranslate3d,
				viewBox: e.viewBox
			}).allowEscapeViewBox, d = t.coordinate, p = t.offsetTop, y = t.offsetLeft, v = t.position, m = t.reverseDirection, g = t.tooltipBox, b = t.useTranslate3d, x = t.viewBox, g && g.height > 0 && g.width > 0 && d ? (n = (r = {
				translateX: s = xD({
					allowEscapeViewBox: h,
					coordinate: d,
					key: "x",
					offset: y,
					position: v,
					reverseDirection: m,
					tooltipDimension: g.width,
					viewBox: x,
					viewBoxDimension: x.width
				}),
				translateY: f = xD({
					allowEscapeViewBox: h,
					coordinate: d,
					key: "y",
					offset: p,
					position: v,
					reverseDirection: m,
					tooltipDimension: g.height,
					viewBox: x,
					viewBoxDimension: x.height
				}),
				useTranslate3d: b
			}).translateX, i = r.translateY, c = {
				transform: r.useTranslate3d ? "translate3d(".concat(n, "px, ").concat(i, "px, 0)") : "translate(".concat(n, "px, ").concat(i, "px)")
			}) : c = xT, {
				cssProperties: c,
				cssClasses: (o = (a = {
					translateX: s,
					translateY: f,
					coordinate: d
				}).coordinate, l = a.translateX, u = a.translateY, (0, W.f)(xC, {
					["".concat(xC, "-right")]: eb(l) && o && eb(o.x) && l >= o.x,
					["".concat(xC, "-left")]: eb(l) && o && eb(o.x) && l < o.x,
					["".concat(xC, "-bottom")]: eb(u) && o && eb(o.y) && u >= o.y,
					["".concat(xC, "-top")]: eb(u) && o && eb(o.y) && u < o.y
				}))
			}),
			T = C.cssClasses,
			D = C.cssProperties,
			z = e.hasPortalFromProps ? {} : xz(xz({
				transition: function(e) {
					if ((!e.prefersReducedMotion || "auto" !== e.isAnimationActive) && e.isAnimationActive && e.active) {
						var t = "string" == typeof e.animationEasing ? e.animationEasing : "ease";
						return "transform ".concat(e.animationDuration, "ms ").concat(t)
					}
				}({
					prefersReducedMotion: k,
					isAnimationActive: e.isAnimationActive,
					active: e.active,
					animationDuration: e.animationDuration,
					animationEasing: e.animationEasing
				})
			}, D), {}, {
				pointerEvents: "none",
				position: "absolute",
				top: 0,
				left: 0
			}),
			L = xz(xz({}, z), {}, {
				visibility: !M.dismissed && e.active && e.hasPayload ? "visible" : "hidden"
			}, e.wrapperStyle);
		return N.createElement("div", {
			xmlns: "http://www.w3.org/1999/xhtml",
			tabIndex: -1,
			className: T,
			style: L,
			ref: e.innerRef
		}, e.children)
	});

	function xB(e) {
		return e
	}

	function x$(e) {
		return null == e || "object" != typeof e && "function" != typeof e
	}

	function xU(e, t, r, n, i = !1) {
		if (t === e) return !0;
		switch (typeof t) {
			case "object":
				return function(e, t, r, n, i = !1) {
					if (null == t) return !0;
					if (Array.isArray(t)) return xF(e, t, r, n);
					if (t instanceof Map) {
						var a, o, l, u, c = e,
							s = t,
							f = r,
							h = n;
						if (0 === s.size) return !0;
						if (!(c instanceof Map)) return !1;
						for (let [e, t] of s.entries())
							if (!1 === f(c.get(e), t, e, c, s, h)) return !1;
						return !0
					}
					if (t instanceof Set) {
						return a = e, o = t, l = r, u = n, 0 === o.size || a instanceof Set && xF([...a], [...o], l, u)
					}
					let d = Object.keys(t);
					if (null == e) return i && 0 === d.length;
					if (i) x$(e) && (e = Object(e));
					else {
						if ("[object Error]" === bd(t)) return "[object Error]" === bd(e) && e.name === t.name && e.message === t.message;
						let r = bd(e);
						if ("[object Object]" !== r && "[object Arguments]" !== r) return !1
					}
					if (0 === d.length) return !0;
					if (null == n ? void 0 : n.has(t)) return n.get(t) === e;
					null == n || n.set(t, e);
					try {
						for (let i = 0; i < d.length; i++) {
							let a = d[i];
							if (!(a in e) || void 0 === t[a] && void 0 !== e[a] || null === t[a] && null !== e[a] || !r(e[a], t[a], a, e, t, n)) return !1
						}
						return !0
					} finally {
						null == n || n.delete(t)
					}
				}(e, t, r, n, i);
			case "function":
				if (Object.keys(t).length > 0) return xU(e, Object.assign({}, t), r, n, i);
				return nI(e, t);
			default:
				if (!nT(e)) return nI(e, t);
				if (i) {
					if ("string" == typeof t) return "" === t;
					return !0
				}
				return nI(e, t)
		}
	}

	function xF(e, t, r, n) {
		if (0 === t.length) return !0;
		if (!Array.isArray(e)) return !1;
		let i = new Set;
		for (let a = 0; a < t.length; a++) {
			let o = t[a],
				l = !1;
			for (let u = 0; u < e.length; u++) {
				if (i.has(u)) continue;
				let c = e[u],
					s = !1;
				if (r(c, o, a, e, t, n) && (s = !0), s) {
					i.add(u), l = !0;
					break
				}
			}
			if (!l) return !1
		}
		return !0
	}

	function xK(e, t) {
		return function e(t, r, n) {
			return "function" != typeof n ? e(t, r, () => void 0) : xU(t, r, function e(t, r, i, a, o, l) {
				let u = n(t, r, i, a, o, l);
				return void 0 !== u ? !!u : xU(t, r, e, l, !1)
			}, new Map, !0)
		}(e, t, () => void 0)
	}

	function xH(e, t, r, n, i) {
		if (null != i) {
			let a = i(e, t, r, n);
			if (void 0 !== a) return a
		}
		if (x$(e)) return e;
		if (n.has(e)) return n.get(e);
		if (Array.isArray(e)) {
			let t = Array(e.length);
			n.set(e, t);
			for (let a = 0; a < e.length; a++) t[a] = xH(e[a], a, r, n, i);
			return el(e, "index") && (t.index = e.index), el(e, "input") && (t.input = e.input), t
		}
		if (e instanceof Date) return new Date(e.getTime());
		if (e instanceof RegExp) {
			let t = new RegExp(e.source, e.flags);
			return t.lastIndex = e.lastIndex, t
		}
		if (e instanceof Map) {
			let t = new Map;
			return n.set(e, t), e.forEach((e, a) => {
				t.set(a, xH(e, a, r, n, i))
			}), t
		}
		if (e instanceof Set) {
			let t = new Set;
			return n.set(e, t), e.forEach(e => {
				t.add(xH(e, void 0, r, n, i))
			}), t
		}
		if (bL(e)) return e.subarray();
		if (ArrayBuffer.isView(e) && !(e instanceof DataView)) {
			let t = new(Object.getPrototypeOf(e)).constructor(e.length);
			n.set(e, t);
			for (let a = 0; a < e.length; a++) t[a] = xH(e[a], a, r, n, i);
			return t
		}
		if (e instanceof ArrayBuffer || "u" > typeof SharedArrayBuffer && e instanceof SharedArrayBuffer) return e.slice(0);
		if (e instanceof DataView) {
			let t = new DataView(e.buffer.slice(0), e.byteOffset, e.byteLength);
			return n.set(e, t), xq(t, e, r, n, i), t
		}
		if ("u" > typeof File && e instanceof File) {
			let t = new File([e], e.name, {
				type: e.type
			});
			return n.set(e, t), xq(t, e, r, n, i), t
		}
		if ("u" > typeof Blob && e instanceof Blob) {
			let t = new Blob([e], {
				type: e.type
			});
			return n.set(e, t), xq(t, e, r, n, i), t
		}
		let a = bd(e);
		if ("[object Error]" === a) return e === r ? {} : e;
		switch (a) {
			case bv:
			case by:
			case bm: {
				let t = new e.constructor(e.valueOf());
				return n.set(e, t), xq(t, e, r, n, i), t
			}
			case bg: {
				let t = {};
				return n.set(e, t), xq(t, e, r, n, i), t.length = e.length, t[Symbol.iterator] = e[Symbol.iterator], t
			}
		}
		if ("object" == typeof e && function(e) {
				switch (e) {
					case bg:
					case b_:
					case bA:
					case bj:
					case bm:
					case bx:
					case bD:
					case bN:
					case bI:
					case bC:
					case bT:
					case bw:
					case bv:
					case bS:
					case bp:
					case bO:
					case by:
					case bb:
					case bE:
					case bk:
					case bP:
					case bM:
						return !0;
					default:
						return !1
				}
			}(a)) {
			let t = "[object Object]" === a && "function" != typeof e.constructor ? {} : Object.create(Object.getPrototypeOf(e));
			return n.set(e, t), xq(t, e, r, n, i), t
		}
		return e
	}

	function xq(e, t, r, n, i) {
		let a = [...Object.keys(t), ...bh(t)];
		for (let o = 0; o < a.length; o++) {
			let l = a[o],
				u = Object.getOwnPropertyDescriptor(e, l);
			(null == u || u.writable) && (e[l] = xH(t[l], l, r, n, i))
		}
	}

	function xW(e) {
		return xH(e, void 0, e, new Map, void 0)
	}

	function xV(e) {
		return 0 === e ? 0 : e
	}

	function xY(e, t = xB) {
		var r;
		return nC(e) ? (function(e, t) {
			let r = new Map;
			for (let n = 0; n < e.length; n++) {
				let i = e[n],
					a = t(i, n, e);
				r.has(a) || r.set(a, i)
			}
			return Array.from(r.values())
		})(Array.from(e), (r = function(e) {
			if (null == e) return xB;
			switch (typeof e) {
				case "function":
					return e;
				case "object":
					if (Array.isArray(e) && 2 === e.length) {
						var t, r = e[0],
							n = e[1];
						switch (typeof r) {
							case "object":
								Object.is(null == r ? void 0 : r.valueOf(), -0) && (r = "-0");
								break;
							case "number":
								r = es(r)
						}
						return n = xW(n),
							function(e) {
								let t = ed(e, r);
								return void 0 === t ? function(e, t) {
									let r;
									if (0 === (r = Array.isArray(t) ? t : "string" == typeof t && ec(t) && !(t in Object(e)) ? eh(t) : [t]).length) return !1;
									let n = e;
									for (let e = 0; e < r.length; e++) {
										var i;
										let t = es(r[e]);
										if ((null == n || !el(n, t)) && !((Array.isArray(n) || null !== (i = n) && "object" == typeof i && "[object Arguments]" === bd(i)) && nN(t) && Number(t) < n.length)) return !1;
										n = n[t]
									}
									return !0
								}(e, r) : void 0 === n ? void 0 === t : xK(t, n)
							}
					}
					return t = xW(t = e), e => xK(e, t);
				default:
					return function(t) {
						return ed(t, e)
					}
			}
		}(t), function(...e) {
			return r.apply(this, e.slice(0, 1))
		})).map(xV) : []
	}

	function xX(e, t, r) {
		return !0 === t ? xY(e, r) : "function" == typeof t ? xY(e, t) : e
	}

	function xG(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function xZ(e, t) {
		return Math.abs(e.height - t.height) > 1 || Math.abs(e.left - t.left) > 1 || Math.abs(e.top - t.top) > 1 || Math.abs(e.width - t.width) > 1
	}

	function xQ(e) {
		var t = e.getBoundingClientRect();
		return {
			height: t.height,
			left: t.left,
			top: t.top,
			width: t.width
		}
	}

	function xJ() {
		var e, t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
			r = function(e) {
				if (Array.isArray(e)) return e
			}(e = (0, N.useState)({
				height: 0,
				left: 0,
				top: 0,
				width: 0
			})) || function(e) {
				var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
				if (null != t) {
					var r, n, i, a, o = [],
						l = !0,
						u = !1;
					try {
						i = (t = t.call(e)).next, !1;
						for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
					} catch (e) {
						u = !0, n = e
					} finally {
						try {
							if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
						} finally {
							if (u) throw n
						}
					}
					return o
				}
			}(e) || function(e) {
				if (e) {
					if ("string" == typeof e) return xG(e, 2);
					var t = ({}).toString.call(e).slice(8, -1);
					return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? xG(e, 2) : void 0
				}
			}(e) || function() {
				throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
			}(),
			n = r[0],
			i = r[1],
			a = (0, N.useRef)(null),
			o = (0, N.useRef)(n);
		o.current = n;
		var l = (0, N.useCallback)(e => {
			if (null != a.current && (a.current.disconnect(), a.current = null), null != e) {
				var t = xQ(e);
				if (xZ(t, o.current) && i(t), "u" > typeof ResizeObserver) {
					var r = new ResizeObserver(() => {
						var t = xQ(e);
						xZ(t, o.current) && i(t)
					});
					r.observe(e), a.current = r
				}
			}
		}, [...t]);
		return (0, N.useEffect)(() => () => {
			var e;
			null == (e = a.current) || e.disconnect()
		}, []), [n, l]
	}

	function x0() {
		return (x0 = Object.assign.bind()).apply(null, arguments)
	}

	function x1(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function x2(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? x1(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : x1(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var x3 = {
			curveBasisClosed: function(e) {
				return new im(e)
			},
			curveBasisOpen: function(e) {
				return new ig(e)
			},
			curveBasis: function(e) {
				return new iv(e)
			},
			curveBumpX: function(e) {
				return new it(e, !0)
			},
			curveBumpY: function(e) {
				return new it(e, !1)
			},
			curveLinearClosed: function(e) {
				return new ik(e)
			},
			curveLinear: n6,
			curveMonotoneX: function(e) {
				return new iC(e)
			},
			curveMonotoneY: function(e) {
				return new iT(e)
			},
			curveNatural: function(e) {
				return new iN(e)
			},
			curveStep: function(e) {
				return new iL(e, .5)
			},
			curveStepAfter: function(e) {
				return new iL(e, 1)
			},
			curveStepBefore: function(e) {
				return new iL(e, 0)
			}
		},
		x5 = e => eZ(e.x) && eZ(e.y),
		x6 = e => null != e.base && x5(e.base) && x5(e),
		x4 = e => e.x,
		x8 = e => e.y,
		x7 = e => {
			var t = e.className,
				r = e.points,
				n = e.path,
				i = e.pathRef,
				a = tv(aN);
			if ((!r || !r.length) && !n) return null;
			var o = {
					type: e.type,
					points: e.points,
					baseLine: e.baseLine,
					layout: e.layout || a,
					connectNulls: e.connectNulls
				},
				l = r && r.length ? (e => {
					var t = e.type,
						r = e.points,
						n = void 0 === r ? [] : r,
						i = e.baseLine,
						a = e.layout,
						o = e.connectNulls,
						l = void 0 !== o && o,
						u = ((e, t) => {
							if ("function" == typeof e) return e;
							var r = "curve".concat(ej(e));
							if (("curveMonotone" === r || "curveBump" === r) && t) {
								var n = x3["".concat(r).concat("vertical" === t ? "Y" : "X")];
								if (n) return n
							}
							return x3[r] || n6
						})(void 0 === t ? "linear" : t, a),
						c = l ? n.filter(x5) : n;
					if (Array.isArray(i)) {
						var s = n.map((e, t) => x2(x2({}, e), {}, {
							base: i[t]
						}));
						return ("vertical" === a ? n9().y(x8).x1(x4).x0(e => e.base.x) : n9().x(x4).y1(x8).y0(e => e.base.y)).defined(x6).curve(u)(l ? s.filter(x6) : s)
					}
					return ("vertical" === a && eb(i) ? n9().y(x8).x1(x4).x0(i) : eb(i) ? n9().x(x4).y1(x8).y0(i) : n7().x(x4).y(x8)).defined(x5).curve(u)(c)
				})(o) : n;
			return N.createElement("path", x0({}, Q(e), (e => {
				if (!e || "function" == typeof e || "boolean" == typeof e) return null;
				var t = e;
				if ((0, N.isValidElement)(e) && (t = e.props), "object" != typeof t && "function" != typeof t) return null;
				var r = {};
				return Object.keys(t).forEach(e => {
					Y(e) && "function" == typeof t[e] && (r[e] = r => t[e](t, r))
				}), r
			})(e), {
				className: (0, W.f)("recharts-curve", t),
				d: null === l ? void 0 : l,
				ref: i
			}))
		},
		x9 = ["x", "y", "top", "left", "width", "height", "className"];

	function we() {
		return (we = Object.assign.bind()).apply(null, arguments)
	}

	function wt(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}
	var wr = e => {
		var t = e.x,
			r = void 0 === t ? 0 : t,
			n = e.y,
			i = void 0 === n ? 0 : n,
			a = e.top,
			o = void 0 === a ? 0 : a,
			l = e.left,
			u = void 0 === l ? 0 : l,
			c = e.width,
			s = void 0 === c ? 0 : c,
			f = e.height,
			h = void 0 === f ? 0 : f,
			d = e.className,
			p = function(e) {
				for (var t = 1; t < arguments.length; t++) {
					var r = null != arguments[t] ? arguments[t] : {};
					t % 2 ? wt(Object(r), !0).forEach(function(t) {
						var n, i, a;
						n = e, i = t, a = r[t], (i = function(e) {
							var t = function(e, t) {
								if ("object" != typeof e || !e) return e;
								var r = e[Symbol.toPrimitive];
								if (void 0 !== r) {
									var n = r.call(e, t || "default");
									if ("object" != typeof n) return n;
									throw TypeError("@@toPrimitive must return a primitive value.")
								}
								return ("string" === t ? String : Number)(e)
							}(e, "string");
							return "symbol" == typeof t ? t : t + ""
						}(i)) in n ? Object.defineProperty(n, i, {
							value: a,
							enumerable: !0,
							configurable: !0,
							writable: !0
						}) : n[i] = a
					}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wt(Object(r)).forEach(function(t) {
						Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
					})
				}
				return e
			}({
				x: r,
				y: i,
				top: o,
				left: u,
				width: s,
				height: h
			}, function(e, t) {
				if (null == e) return {};
				var r, n, i = function(e, t) {
					if (null == e) return {};
					var r = {};
					for (var n in e)
						if (({}).hasOwnProperty.call(e, n)) {
							if (-1 !== t.indexOf(n)) continue;
							r[n] = e[n]
						} return r
				}(e, t);
				if (Object.getOwnPropertySymbols) {
					var a = Object.getOwnPropertySymbols(e);
					for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
				}
				return i
			}(e, x9));
		return eb(r) && eb(i) && eb(s) && eb(h) && eb(o) && eb(u) ? N.createElement("path", we({}, ee(p), {
			className: (0, W.f)("recharts-cross", d),
			d: "M".concat(r, ",").concat(o, "v").concat(h, "M").concat(u, ",").concat(i, "h").concat(s)
		})) : null
	};

	function wn(e) {
		var t = e.cx,
			r = e.cy,
			n = e.radius,
			i = e.startAngle,
			a = e.endAngle;
		return {
			points: [tu(t, r, n, i), tu(t, r, n, a)],
			cx: t,
			cy: r,
			radius: n,
			startAngle: i,
			endAngle: a
		}
	}

	function wi() {
		return (wi = Object.assign.bind()).apply(null, arguments)
	}

	function wa(e, t) {
		return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, {
			raw: {
				value: Object.freeze(t)
			}
		}))
	}
	var wo = e => {
			var t = e.cx,
				r = e.cy,
				n = e.radius,
				i = e.angle,
				a = e.sign,
				o = e.isExternal,
				l = e.cornerRadius,
				u = e.cornerIsExternal,
				c = l * (o ? 1 : -1) + n,
				s = Math.asin(l / c) / tl,
				f = u ? i : i + a * s,
				h = tu(t, r, c, f);
			return {
				center: h,
				circleTangency: tu(t, r, n, f),
				lineTangency: tu(t, r, c * Math.cos(s * tl), u ? i - a * s : i),
				theta: s
			}
		},
		wl = e => {
			var t = e.cx,
				r = e.cy,
				n = e.innerRadius,
				i = e.outerRadius,
				a = e.startAngle,
				o = e.endAngle,
				l = ev(o - a) * Math.min(Math.abs(o - a), 359.999),
				u = a + l,
				c = tu(t, r, i, a),
				s = tu(t, r, i, u),
				f = ey(j || (j = wa(["M ", ",", "\n    A ", ",", ",0,\n    ", ",", ",\n    ", ",", "\n  "])), c.x, c.y, i, i, +(Math.abs(l) > 180), +(a > u), s.x, s.y);
			if (n > 0) {
				var h = tu(t, r, n, a),
					d = tu(t, r, n, u);
				f += ey(E || (E = wa(["L ", ",", "\n            A ", ",", ",0,\n            ", ",", ",\n            ", ",", " Z"])), d.x, d.y, n, n, +(Math.abs(l) > 180), +(a <= u), h.x, h.y)
			} else f += ey(k || (k = wa(["L ", ",", " Z"])), t, r);
			return f
		},
		wu = {
			cx: 0,
			cy: 0,
			innerRadius: 0,
			outerRadius: 0,
			startAngle: 0,
			endAngle: 0,
			cornerRadius: 0,
			forceCornerRadius: !1,
			cornerIsExternal: !1
		},
		wc = e => {
			var t, r = eG(e, wu),
				n = r.cx,
				i = r.cy,
				a = r.innerRadius,
				o = r.outerRadius,
				l = r.cornerRadius,
				u = r.forceCornerRadius,
				c = r.cornerIsExternal,
				s = r.startAngle,
				f = r.endAngle,
				h = r.className;
			if (o < a || s === f) return null;
			var d = (0, W.f)("recharts-sector", h),
				p = o - a,
				y = e_(l, p, 0, !0);
			return t = y > 0 && 360 > Math.abs(s - f) ? (e => {
				var t = e.cx,
					r = e.cy,
					n = e.innerRadius,
					i = e.outerRadius,
					a = e.cornerRadius,
					o = e.forceCornerRadius,
					l = e.cornerIsExternal,
					u = e.startAngle,
					c = e.endAngle,
					s = ev(c - u),
					f = wo({
						cx: t,
						cy: r,
						radius: i,
						angle: u,
						sign: s,
						cornerRadius: a,
						cornerIsExternal: l
					}),
					h = f.circleTangency,
					d = f.lineTangency,
					p = f.theta,
					y = wo({
						cx: t,
						cy: r,
						radius: i,
						angle: c,
						sign: -s,
						cornerRadius: a,
						cornerIsExternal: l
					}),
					v = y.circleTangency,
					m = y.lineTangency,
					g = y.theta,
					b = l ? Math.abs(u - c) : Math.abs(u - c) - p - g;
				if (b < 0) return o ? ey(P || (P = wa(["M ", ",", "\n        a", ",", ",0,0,1,", ",0\n        a", ",", ",0,0,1,", ",0\n      "])), d.x, d.y, a, a, 2 * a, a, a, -(2 * a)) : wl({
					cx: t,
					cy: r,
					innerRadius: n,
					outerRadius: i,
					startAngle: u,
					endAngle: c
				});
				var x = ey(M || (M = wa(["M ", ",", "\n    A", ",", ",0,0,", ",", ",", "\n    A", ",", ",0,", ",", ",", ",", "\n    A", ",", ",0,0,", ",", ",", "\n  "])), d.x, d.y, a, a, +(s < 0), h.x, h.y, i, i, +(b > 180), +(s < 0), v.x, v.y, a, a, +(s < 0), m.x, m.y);
				if (n > 0) {
					var w = wo({
							cx: t,
							cy: r,
							radius: n,
							angle: u,
							sign: s,
							isExternal: !0,
							cornerRadius: a,
							cornerIsExternal: l
						}),
						O = w.circleTangency,
						_ = w.lineTangency,
						A = w.theta,
						S = wo({
							cx: t,
							cy: r,
							radius: n,
							angle: c,
							sign: -s,
							isExternal: !0,
							cornerRadius: a,
							cornerIsExternal: l
						}),
						j = S.circleTangency,
						E = S.lineTangency,
						k = S.theta,
						T = l ? Math.abs(u - c) : Math.abs(u - c) - A - k;
					if (T < 0 && 0 === a) return "".concat(x, "L").concat(t, ",").concat(r, "Z");
					x += ey(I || (I = wa(["L", ",", "\n      A", ",", ",0,0,", ",", ",", "\n      A", ",", ",0,", ",", ",", ",", "\n      A", ",", ",0,0,", ",", ",", "Z"])), E.x, E.y, a, a, +(s < 0), j.x, j.y, n, n, +(T > 180), +(s > 0), O.x, O.y, a, a, +(s < 0), _.x, _.y)
				} else x += ey(C || (C = wa(["L", ",", "Z"])), t, r);
				return x
			})({
				cx: n,
				cy: i,
				innerRadius: a,
				outerRadius: o,
				cornerRadius: Math.min(y, p / 2),
				forceCornerRadius: u,
				cornerIsExternal: c,
				startAngle: s,
				endAngle: f
			}) : wl({
				cx: n,
				cy: i,
				innerRadius: a,
				outerRadius: o,
				startAngle: s,
				endAngle: f
			}), N.createElement("path", wi({}, ee(r), {
				className: d,
				d: t
			}))
		};

	function ws(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wf(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? ws(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : ws(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function wh() {
		return (wh = Object.assign.bind()).apply(null, arguments)
	}

	function wd(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wp(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? wd(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wd(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function wy(e) {
		var t = e.cursor,
			r = e.cursorComp,
			n = e.cursorProps;
		return (0, N.isValidElement)(t) ? (0, N.cloneElement)(t, n) : (0, N.createElement)(r, n)
	}

	function wv(e) {
		var t, r, n, i, a, o = e.coordinate,
			l = e.payload,
			u = e.index,
			c = e.offset,
			s = e.tooltipAxisBandSize,
			f = e.layout,
			h = e.cursor,
			d = e.tooltipEventType,
			p = e.chartName;
		if (!h || !o || "ScatterChart" !== p && "axis" !== d) return null;
		if ("ScatterChart" === p) n = o, i = wr, a = aR.cursorLine;
		else if ("BarChart" === p) t = s / 2, n = {
			stroke: "none",
			fill: "#ccc",
			x: "horizontal" === f ? o.x - t : c.left + .5,
			y: "horizontal" === f ? c.top + .5 : o.y - t,
			width: "horizontal" === f ? s : c.width - 1,
			height: "horizontal" === f ? c.height - 1 : s
		}, i = lo, a = aR.cursorRectangle;
		else if ("radial" === f && oR(o)) {
			var y = wn(o),
				v = y.cx,
				m = y.cy,
				g = y.radius;
			n = {
				cx: v,
				cy: m,
				startAngle: y.startAngle,
				endAngle: y.endAngle,
				innerRadius: g,
				outerRadius: g
			}, i = wc, a = aR.cursorLine
		} else n = {
			points: function(e, t, r) {
				if ("horizontal" === e) return [{
					x: t.x,
					y: r.top
				}, {
					x: t.x,
					y: r.top + r.height
				}];
				if ("vertical" === e) return [{
					x: r.left,
					y: t.y
				}, {
					x: r.left + r.width,
					y: t.y
				}];
				if (oR(t)) {
					if ("centric" === e) {
						var n = t.cx,
							i = t.cy,
							a = t.innerRadius,
							o = t.outerRadius,
							l = t.angle,
							u = tu(n, i, a, l),
							c = tu(n, i, o, l);
						return [{
							x: u.x,
							y: u.y
						}, {
							x: c.x,
							y: c.y
						}]
					}
					return wn(t)
				}
			}(f, o, c)
		}, i = x7, a = aR.cursorLine;
		var b = "object" == typeof h && "className" in h ? h.className : void 0,
			x = wp(wp(wp(wp({
				stroke: "#ccc",
				pointerEvents: "none"
			}, c), n), J(h)), {}, {
				payload: l,
				payloadIndex: u,
				className: (0, W.f)("recharts-tooltip-cursor", b)
			});
		return N.createElement(ol, {
			zIndex: null != (r = e.zIndex) ? r : a
		}, N.createElement(wy, {
			cursor: h,
			cursorComp: i,
			cursorProps: x
		}))
	}

	function wm(e) {
		var t, r, n, i = (t = tv(dv), r = tv(yA), n = tv(yw), t && n ? i6(wf(wf({}, t), {}, {
				scale: n
			}), r) : i6(void 0, r)),
			a = aD(),
			o = tv(aN),
			l = tv(l9);
		return null == i || null == a || null == o || null == l ? null : N.createElement(wv, wh({}, e, {
			offset: a,
			layout: o,
			tooltipAxisBandSize: i,
			chartName: l
		}))
	}

	function wg(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wb(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? wg(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wg(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function wx(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function ww(e) {
		return e.dataKey
	}
	var wO = [],
		w_ = {
			allowEscapeViewBox: {
				x: !1,
				y: !1
			},
			animationDuration: 400,
			animationEasing: "ease",
			axisId: 0,
			contentStyle: {},
			cursor: !0,
			filterNull: !0,
			includeHidden: !1,
			isAnimationActive: "auto",
			itemSorter: "name",
			itemStyle: {},
			labelStyle: {},
			offset: 10,
			reverseDirection: {
				x: !1,
				y: !1
			},
			separator: " : ",
			trigger: "hover",
			useTranslate3d: !1,
			wrapperStyle: {}
		},
		wA = ["type", "size", "sizeType"];

	function wS() {
		return (wS = Object.assign.bind()).apply(null, arguments)
	}

	function wj(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wE(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? wj(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wj(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	var wk = {
			symbolCircle: ir,
			symbolCross: {
				draw(e, t) {
					let r = nJ(t / 5) / 2;
					e.moveTo(-3 * r, -r), e.lineTo(-r, -r), e.lineTo(-r, -3 * r), e.lineTo(r, -3 * r), e.lineTo(r, -r), e.lineTo(3 * r, -r), e.lineTo(3 * r, r), e.lineTo(r, r), e.lineTo(r, 3 * r), e.lineTo(-r, 3 * r), e.lineTo(-r, r), e.lineTo(-3 * r, r), e.closePath()
				}
			},
			symbolDiamond: {
				draw(e, t) {
					let r = nJ(t / ia),
						n = r * ii;
					e.moveTo(0, -r), e.lineTo(n, 0), e.lineTo(0, r), e.lineTo(-n, 0), e.closePath()
				}
			},
			symbolSquare: {
				draw(e, t) {
					let r = nJ(t),
						n = -r / 2;
					e.rect(n, n, r, r)
				}
			},
			symbolStar: {
				draw(e, t) {
					let r = nJ(.8908130915292852 * t),
						n = il * r,
						i = iu * r;
					e.moveTo(0, -r), e.lineTo(n, i);
					for (let t = 1; t < 5; ++t) {
						let a = n1 * t / 5,
							o = nZ(a),
							l = nQ(a);
						e.lineTo(l * r, -o * r), e.lineTo(o * n - l * i, l * n + o * i)
					}
					e.closePath()
				}
			},
			symbolTriangle: {
				draw(e, t) {
					let r = -nJ(t / (3 * ic));
					e.moveTo(0, 2 * r), e.lineTo(-ic * r, -r), e.lineTo(ic * r, -r), e.closePath()
				}
			},
			symbolWye: {
				draw(e, t) {
					let r = nJ(t / id),
						n = r / 2,
						i = r * ih,
						a = r * ih + r,
						o = -n;
					e.moveTo(n, i), e.lineTo(n, a), e.lineTo(o, a), e.lineTo(-.5 * n - is * i, is * n + -.5 * i), e.lineTo(-.5 * n - is * a, is * n + -.5 * a), e.lineTo(-.5 * o - is * a, is * o + -.5 * a), e.lineTo(-.5 * n + is * i, -.5 * i - is * n), e.lineTo(-.5 * n + is * a, -.5 * a - is * n), e.lineTo(-.5 * o + is * a, -.5 * a - is * o), e.closePath()
				}
			}
		},
		wP = Math.PI / 180,
		wM = e => {
			var t = e.type,
				r = void 0 === t ? "circle" : t,
				n = e.size,
				i = void 0 === n ? 64 : n,
				a = e.sizeType,
				o = void 0 === a ? "area" : a,
				l = wE(wE({}, function(e, t) {
					if (null == e) return {};
					var r, n, i = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var n in e)
							if (({}).hasOwnProperty.call(e, n)) {
								if (-1 !== t.indexOf(n)) continue;
								r[n] = e[n]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
					}
					return i
				}(e, wA)), {}, {
					type: r,
					size: i,
					sizeType: o
				}),
				u = "circle";
			"string" == typeof r && (u = r);
			var c = l.className,
				s = l.cx,
				f = l.cy,
				h = ee(l);
			return eb(s) && eb(f) && eb(i) ? N.createElement("path", wS({}, h, {
				className: (0, W.f)("recharts-symbols", c),
				transform: "translate(".concat(s, ", ").concat(f, ")"),
				d: (() => {
					var e, t = (e = u, wk["symbol".concat(ej(e))] || ir),
						r = (function(e, t) {
							let r = null,
								n = n2(i);

							function i() {
								let i;
								if (r || (r = i = n()), e.apply(this, arguments).draw(r, +t.apply(this, arguments)), i) return r = null, i + "" || null
							}
							return e = "function" == typeof e ? e : nG(e || ir), t = "function" == typeof t ? t : nG(void 0 === t ? 64 : +t), i.type = function(t) {
								return arguments.length ? (e = "function" == typeof t ? t : nG(t), i) : e
							}, i.size = function(e) {
								return arguments.length ? (t = "function" == typeof e ? e : nG(+e), i) : t
							}, i.context = function(e) {
								return arguments.length ? (r = null == e ? null : e, i) : r
							}, i
						})().type(t).size(((e, t, r) => {
							if ("area" === t) return e;
							switch (r) {
								case "cross":
									return 5 * e * e / 9;
								case "diamond":
									return .5 * e * e / Math.sqrt(3);
								case "square":
									return e * e;
								case "star":
									var n = 18 * wP;
									return 1.25 * e * e * (Math.tan(n) - Math.tan(2 * n) * Math.tan(n) ** 2);
								case "triangle":
									return Math.sqrt(3) * e * e / 4;
								case "wye":
									return (21 - 10 * Math.sqrt(3)) * e * e / 8;
								default:
									return Math.PI * e * e / 4
							}
						})(i, o, u))();
					if (null !== r) return r
				})()
			})) : null
		};

	function wI() {
		return (wI = Object.assign.bind()).apply(null, arguments)
	}

	function wC(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wT(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? wC(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wC(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}
	wM.registerSymbol = (e, t) => {
		wk["symbol".concat(ej(e))] = t
	};
	var wD = {
		align: "center",
		iconSize: 14,
		inactiveColor: "#ccc",
		layout: "horizontal",
		verticalAlign: "middle",
		labelStyle: {}
	};

	function wN(e) {
		var t = e.data,
			r = e.iconType,
			n = e.inactiveColor,
			i = 32 / 6,
			a = 32 / 3,
			o = t.inactive ? n : t.color,
			l = null != r ? r : t.type;
		if ("none" === l) return null;
		if ("plainline" === l) return N.createElement("line", {
			strokeWidth: 4,
			fill: "none",
			stroke: o,
			strokeDasharray: function(e) {
				if ("object" == typeof e && null !== e && "strokeDasharray" in e) return String(e.strokeDasharray)
			}(t.payload),
			x1: 0,
			y1: 16,
			x2: 32,
			y2: 16,
			className: "recharts-legend-icon"
		});
		if ("line" === l) return N.createElement("path", {
			strokeWidth: 4,
			fill: "none",
			stroke: o,
			d: "M0,".concat(16, "h").concat(a, "\n            A").concat(i, ",").concat(i, ",0,1,1,").concat(2 * a, ",").concat(16, "\n            H").concat(32, "M").concat(2 * a, ",").concat(16, "\n            A").concat(i, ",").concat(i, ",0,1,1,").concat(a, ",").concat(16),
			className: "recharts-legend-icon"
		});
		if ("rect" === l) return N.createElement("path", {
			stroke: "none",
			fill: o,
			d: "M0,".concat(4, "h").concat(32, "v").concat(24, "h").concat(-32, "z"),
			className: "recharts-legend-icon"
		});
		if (N.isValidElement(t.legendIcon)) {
			var u = wT({}, t);
			return delete u.legendIcon, N.cloneElement(t.legendIcon, u)
		}
		return N.createElement(wM, {
			fill: o,
			cx: 16,
			cy: 16,
			size: 32,
			sizeType: "diameter",
			type: l
		})
	}

	function wz(e) {
		var t = e.payload,
			r = e.iconSize,
			n = e.layout,
			i = e.formatter,
			a = e.inactiveColor,
			o = e.iconType,
			l = e.labelStyle,
			u = {
				x: 0,
				y: 0,
				width: 32,
				height: 32
			},
			c = {
				display: "horizontal" === n ? "inline-block" : "block",
				marginRight: 10,
				whiteSpace: "nowrap"
			},
			s = {
				display: "inline-block",
				verticalAlign: "middle",
				marginRight: 4
			};
		return t.map((t, n) => {
			var f = t.formatter || i,
				h = (0, W.f)({
					"recharts-legend-item": !0,
					["legend-item-".concat(n)]: !0,
					inactive: t.inactive
				});
			if ("none" === t.type) return null;
			var d = "object" == typeof l ? wT({}, l) : {};
			d.color = t.inactive ? a : d.color || t.color, null != d.whiteSpace || (d.whiteSpace = "normal"), null != d.overflowWrap || (d.overflowWrap = "break-word");
			var p = f ? f(t.value, t, n) : t.value;
			return N.createElement("li", wI({
				className: h,
				style: c,
				key: "legend-item-".concat(n)
			}, oB(e, t, n)), N.createElement(gk, {
				width: r,
				height: r,
				viewBox: u,
				style: s,
				"aria-label": null == t.value ? "legend icon" : "".concat(t.value, " legend icon")
			}, N.createElement(wN, {
				data: t,
				iconType: o,
				inactiveColor: a
			})), N.createElement("span", {
				className: "recharts-legend-item-text",
				style: d
			}, p))
		})
	}
	var wL = e => {
			var t = eG(e, wD),
				r = t.payload,
				n = t.layout,
				i = t.align;
			return r && r.length ? N.createElement("ul", {
				className: "recharts-default-legend",
				style: {
					padding: 0,
					margin: 0,
					textAlign: "horizontal" === n ? i : "left"
				}
			}, N.createElement(wz, wI({}, t, {
				payload: r
			}))) : null
		},
		wR = r$([i7, i9, at], (e, t, r) => ({
			x: r.left || 0,
			y: r.top || 0,
			width: Math.max(e - (r.left || 0) - (r.right || 0), 0),
			height: Math.max(t - (r.top || 0) - (r.bottom || 0), 0)
		})),
		wB = ["contextPayload"];

	function w$() {
		return (w$ = Object.assign.bind()).apply(null, arguments)
	}

	function wU(e, t) {
		(null == t || t > e.length) && (t = e.length);
		for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
		return n
	}

	function wF(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var n = Object.getOwnPropertySymbols(e);
			t && (n = n.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, n)
		}
		return r
	}

	function wK(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? wF(Object(r), !0).forEach(function(t) {
				var n, i, a;
				n = e, i = t, a = r[t], (i = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var n = r.call(e, t || "default");
							if ("object" != typeof n) return n;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(i)) in n ? Object.defineProperty(n, i, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : n[i] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : wF(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function wH(e) {
		return e.value
	}

	function wq(e) {
		var t = e.contextPayload,
			r = function(e, t) {
				if (null == e) return {};
				var r, n, i = function(e, t) {
					if (null == e) return {};
					var r = {};
					for (var n in e)
						if (({}).hasOwnProperty.call(e, n)) {
							if (-1 !== t.indexOf(n)) continue;
							r[n] = e[n]
						} return r
				}(e, t);
				if (Object.getOwnPropertySymbols) {
					var a = Object.getOwnPropertySymbols(e);
					for (n = 0; n < a.length; n++) r = a[n], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (i[r] = e[r])
				}
				return i
			}(e, wB),
			n = xX(t, e.payloadUniqBy, wH),
			i = wK(wK({}, r), {}, {
				payload: n
			});
		return N.isValidElement(e.content) ? N.cloneElement(e.content, i) : "function" == typeof e.content ? N.createElement(e.content, i) : N.createElement(wL, i)
	}

	function wW(e) {
		var t = e.align,
			r = e.layout,
			n = e.verticalAlign,
			i = e.itemSorter,
			a = e.position,
			o = e.offset,
			l = th();
		return (0, N.useLayoutEffect)(() => {
			l(y4({
				align: t,
				layout: r,
				verticalAlign: n,
				itemSorter: i,
				position: a,
				offset: o
			}))
		}, [l, t, r, n, i, a, o]), null
	}

	function wV(e) {
		var t = e.width,
			r = e.height,
			n = th();
		return (0, N.useLayoutEffect)(() => {
			n(y6({
				width: t,
				height: r
			}))
		}, [n, t, r]), (0, N.useLayoutEffect)(() => () => {
			n(y6({
				width: 0,
				height: 0
			}))
		}, [n]), null
	}
	var wY = {
			align: "center",
			iconSize: 14,
			inactiveColor: "#ccc",
			itemSorter: "value",
			labelStyle: {},
			layout: "auto",
			verticalAlign: "bottom",
			offset: 0
		},
		wX = N.memo(function(e) {
			var t, r, n, i, a, o, l, u, c, s, f, h, d, p, y, v, m, g = eG(e, wY),
				b = e.layout && "auto" !== e.layout ? e.layout : "left" === (t = g.position) || "right" === t || "insideLeft" === t || "insideRight" === t ? "vertical" : "horizontal",
				x = tv(nK),
				w = (0, N.useContext)(gW),
				O = tv(e => e.layout.margin),
				_ = tv(e => {
					var t;
					return null == (t = g.position) ? null : iY(t) ? wR(e) : al(e)
				}),
				A = g.width,
				S = g.height,
				j = g.wrapperStyle,
				E = g.portal,
				k = null == E && (null == g.position || iY(g.position)),
				P = function(e) {
					if (Array.isArray(e)) return e
				}(r = xJ([x])) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(r) || function(e) {
					if (e) {
						if ("string" == typeof e) return wU(e, 2);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? wU(e, 2) : void 0
					}
				}(r) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}(),
				M = P[0],
				I = P[1],
				C = tv(i7),
				T = tv(i9);
			if (null == C || null == T || null != g.position && null == _) return null;
			var D = C - ((null == O ? void 0 : O.left) || 0) - ((null == O ? void 0 : O.right) || 0),
				z = "vertical" === b && null != S ? {
					height: S
				} : "horizontal" === b ? {
					width: A || D
				} : null,
				L = null == g.position ? null : iW({
					viewBox: null != _ ? _ : {
						x: 0,
						y: 0,
						width: C,
						height: T
					},
					position: g.position,
					offset: null != (s = g.offset) ? s : 0
				}),
				R = (n = g.position, i = null != (f = g.offset) ? f : 0, "top" === n ? {
					top: M.height + i
				} : "bottom" === n ? {
					top: -M.height - i
				} : "left" === n ? {
					left: M.width + i
				} : "right" === n ? {
					left: -M.width - i
				} : {}),
				B = "vertical" === b ? (null != (h = null == _ ? void 0 : _.width) ? h : 0) / 2 : null != (d = null == _ ? void 0 : _.width) ? d : 0,
				$ = "horizontal" === b ? (null != (p = null == _ ? void 0 : _.height) ? p : 0) / 2 : null != (y = null == _ ? void 0 : _.height) ? y : 0,
				U = L ? {
					width: "max-content",
					height: "max-content",
					maxWidth: B,
					maxHeight: $,
					overflowY: "auto",
					top: L.y + (null != (v = R.top) ? v : 0),
					left: L.x + (null != (m = R.left) ? m : 0),
					transform: function(e, t) {
						if ("start" === e && "start" === t) return "";
						var r, n = null != (r = ({
							start: "0",
							middle: "-50%",
							end: "-100%"
						})[t]) ? r : "0";
						return "translate(".concat("inherit" === e ? "0" : ({
							start: "0",
							middle: "-50%",
							end: "-100%"
						})[e], ", ").concat(n, ")")
					}(L.horizontalAnchor, L.verticalAnchor)
				} : (l = g.layout, u = g.align, c = g.verticalAlign, j && (void 0 !== j.left && null !== j.left || void 0 !== j.right && null !== j.right) || (a = "center" === u && "vertical" === l ? {
					left: ((C || 0) - M.width) / 2
				} : "right" === u ? {
					right: O && O.right || 0
				} : {
					left: O && O.left || 0
				}), j && (void 0 !== j.top && null !== j.top || void 0 !== j.bottom && null !== j.bottom) || (o = "middle" === c ? {
					top: ((T || 0) - M.height) / 2
				} : "bottom" === c ? {
					bottom: O && O.bottom || 0
				} : {
					top: O && O.top || 0
				}), wK(wK({}, a), o)),
				F = E ? j : wK(wK({
					position: "absolute",
					width: (null == z ? void 0 : z.width) || A || "auto",
					height: (null == z ? void 0 : z.height) || S || "auto"
				}, U), j),
				K = null != E ? E : w;
			if (null == K || null == x) return null;
			var H = N.createElement("div", {
				className: "recharts-legend-wrapper",
				style: F,
				ref: I
			}, N.createElement(wW, {
				layout: b,
				align: g.align,
				verticalAlign: g.verticalAlign,
				itemSorter: g.itemSorter,
				position: g.position,
				offset: g.offset
			}), k && N.createElement(wV, M), N.createElement(wq, w$({}, g, {
				layout: b
			}, z, {
				margin: O,
				chartWidth: C,
				chartHeight: T,
				contextPayload: x
			})));
			return (0, a2.createPortal)(H, K)
		}, vI);
	wX.displayName = "Legend";
	var wG = e.i(818036);
	let wZ = {
			light: "",
			dark: ".dark"
		},
		wQ = N.createContext(null);

	function wJ() {
		let e = N.useContext(wQ);
		if (!e) throw Error("useChart must be used within a <ChartContainer />");
		return e
	}

	function w0(e) {
		let t, r, n, i, a, o, l, u, c, s, f, h, d, p = (0, D.c)(29);
		p[0] !== e ? ({
			id: i,
			className: r,
			children: t,
			config: n,
			initialDimension: a,
			...o
		} = e, p[0] = e, p[1] = t, p[2] = r, p[3] = n, p[4] = i, p[5] = a, p[6] = o) : (t = p[1], r = p[2], n = p[3], i = p[4], a = p[5], o = p[6]);
		let y = N.useId();
		p[7] !== i || p[8] !== y ? (l = i || y.replace(/:/g, ""), p[7] = i, p[8] = y, p[9] = l) : l = p[9];
		let v = `chart-${l}`;
		return p[10] !== n ? (u = {
			config: n
		}, p[10] = n, p[11] = u) : u = p[11], p[12] !== r ? (c = (0, wG.c)("[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden", r), p[12] = r, p[13] = c) : c = p[13], p[14] !== v || p[15] !== n ? (s = (0, T.jsx)(w1, {
			id: v,
			config: n
		}), p[14] = v, p[15] = n, p[16] = s) : s = p[16], p[17] !== t || p[18] !== a ? (f = (0, T.jsx)(aI, {
			initialDimension: a,
			children: t
		}), p[17] = t, p[18] = a, p[19] = f) : f = p[19], p[20] !== v || p[21] !== o || p[22] !== c || p[23] !== s || p[24] !== f ? (h = (0, T.jsxs)("div", {
			"data-slot": "chart",
			"data-chart": v,
			className: c,
			...o,
			children: [s, f]
		}), p[20] = v, p[21] = o, p[22] = c, p[23] = s, p[24] = f, p[25] = h) : h = p[25], p[26] !== u || p[27] !== h ? (d = (0, T.jsx)(wQ.Provider, {
			value: u,
			children: h
		}), p[26] = u, p[27] = h, p[28] = d) : d = p[28], d
	}
	let w1 = e => {
			let t, r, n, i, a = (0, D.c)(8),
				{
					id: o,
					config: l
				} = e;
			a[0] !== l ? (t = Object.entries(l).filter(w7), a[0] = l, a[1] = t) : t = a[1];
			let u = t;
			if (!u.length) return null;
			a[2] === Symbol.for("react.memo_cache_sentinel") ? (r = Object.entries(wZ), a[2] = r) : r = a[2], a[3] !== u || a[4] !== o ? (n = r.map(e => {
				let [t, r] = e;
				return `
${r} [data-chart=${o}] {
${u.map(e=>{let[r,n]=e,i=n.theme?.[t]||n.color;return i?`  --color-${r}: ${i};`:null}).join("\n")}
}
`
			}), a[3] = u, a[4] = o, a[5] = n) : n = a[5];
			let c = n.join("\n");
			return a[6] !== c ? (i = (0, T.jsx)("style", {
				dangerouslySetInnerHTML: {
					__html: c
				}
			}), a[6] = c, a[7] = i) : i = a[7], i
		},
		w2 = function(e) {
			var t, r, n, i, a, o, l, u, c, s, f, h = eG(e, w_),
				d = h.active,
				p = h.allowEscapeViewBox,
				y = h.animationDuration,
				v = h.animationEasing,
				m = h.content,
				g = h.filterNull,
				b = h.isAnimationActive,
				x = h.offset,
				w = h.payloadUniqBy,
				O = h.position,
				_ = h.reverseDirection,
				A = h.useTranslate3d,
				S = h.wrapperStyle,
				j = h.cursor,
				E = h.shared,
				k = h.trigger,
				P = h.defaultIndex,
				M = h.portal,
				I = h.axisId,
				C = th(),
				T = "number" == typeof P ? String(P) : P;
			(0, N.useEffect)(() => {
				C(lb({
					shared: E,
					trigger: k,
					axisId: I,
					active: d,
					defaultIndex: T
				}))
			}, [C, E, k, I, d, T]);
			var D = aC(),
				z = gS(),
				L = tv(e => pB(e, E)),
				R = null != (s = tv(e => mA(e, L, k, T))) ? s : {},
				B = R.activeIndex,
				$ = R.isActive,
				U = tv(e => m_(e, L, k, T)),
				F = tv(e => mO(e, L, k, T)),
				K = tv(e => mw(e, L, k, T)),
				H = (0, N.useContext)(gq),
				q = null != (f = null != d ? d : $) && f,
				W = function(e) {
					if (Array.isArray(e)) return e
				}(t = xJ([U, q])) || function(e) {
					var t = null == e ? null : "u" > typeof Symbol && e[Symbol.iterator] || e["@@iterator"];
					if (null != t) {
						var r, n, i, a, o = [],
							l = !0,
							u = !1;
						try {
							i = (t = t.call(e)).next, !1;
							for (; !(l = (r = i.call(t)).done) && (o.push(r.value), 2 !== o.length); l = !0);
						} catch (e) {
							u = !0, n = e
						} finally {
							try {
								if (!l && null != t.return && (a = t.return(), Object(a) !== a)) return
							} finally {
								if (u) throw n
							}
						}
						return o
					}
				}(t) || function(e) {
					if (e) {
						if ("string" == typeof e) return wx(e, 2);
						var t = ({}).toString.call(e).slice(8, -1);
						return "Object" === t && e.constructor && (t = e.constructor.name), "Map" === t || "Set" === t ? Array.from(e) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? wx(e, 2) : void 0
					}
				}(t) || function() {
					throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")
				}(),
				V = W[0],
				Y = W[1],
				X = "axis" === L ? F : void 0;
			r = tv(e => ((e, t, r) => {
				if (null != t) {
					var n = pY(e);
					return "axis" === t ? "hover" === r ? n.axisInteraction.hover.dataKey : n.axisInteraction.click.dataKey : "hover" === r ? n.itemInteraction.hover.dataKey : n.itemInteraction.click.dataKey
				}
			})(e, L, k)), n = tv(yC), i = tv(ur), a = tv(ue), o = tv(ut), u = (null == (l = tv(g$)) ? void 0 : l.sourceViewBox) != null, c = aC(), (0, N.useEffect)(() => {
				if (!u && null != a && null != i) {
					var e = lj({
						active: q,
						coordinate: K,
						dataKey: r,
						index: B,
						label: "number" == typeof X ? String(X) : X,
						sourceViewBox: c,
						graphicalItemId: n
					});
					gL.emit(gR, a, e, i)
				}
			}, [u, K, r, n, B, X, i, a, o, q, c]);
			var G = null != M ? M : H;
			if (null == G || null == D || null == L) return null;
			var Z = null != U ? U : wO;
			q || (Z = wO), g && Z.length && (Z = xX(Z.filter(e => null != e.value && (!0 !== e.hide || h.includeHidden)), w, ww));
			var Q = Z.length > 0,
				J = wb(wb({}, h), {}, {
					payload: Z,
					label: X,
					active: q,
					activeIndex: B,
					coordinate: K,
					accessibilityLayer: z
				}),
				ee = N.createElement(xR, {
					allowEscapeViewBox: p,
					animationDuration: y,
					animationEasing: v,
					isAnimationActive: b,
					active: q,
					coordinate: K,
					hasPayload: Q,
					offset: x,
					position: O,
					reverseDirection: _,
					useTranslate3d: A,
					viewBox: D,
					wrapperStyle: S,
					lastBoundingBox: V,
					innerRef: Y,
					hasPortalFromProps: !!M
				}, N.isValidElement(m) ? N.cloneElement(m, J) : "function" == typeof m ? N.createElement(m, J) : N.createElement(xI, J));
			return N.createElement(N.Fragment, null, (0, a2.createPortal)(ee, G), q && N.createElement(wm, {
				cursor: j,
				tooltipEventType: L,
				coordinate: K,
				payload: Z,
				index: B
			}))
		};

	function w3(e) {
		let t, r, n, i, a, o = (0, D.c)(45),
			{
				active: l,
				payload: u,
				className: c,
				indicator: s,
				hideLabel: f,
				hideIndicator: h,
				label: d,
				labelFormatter: p,
				labelClassName: y,
				formatter: v,
				color: m,
				nameKey: g,
				labelKey: b
			} = e,
			x = void 0 === s ? "dot" : s,
			w = void 0 !== h && h,
			{
				config: O
			} = wJ();
		t: {
			let e, r, n;
			if (void 0 !== f && f || !u?.length) {
				t = null;
				break t
			}
			let [i] = u,
			a = `${b||i?.dataKey||i?.name||"value"}`;o[0] !== O || o[1] !== i || o[2] !== a ? (e = w8(O, i, a), o[0] = O, o[1] = i, o[2] = a, o[3] = e) : e = o[3];
			let l = e,
				c = b || "string" != typeof d ? l?.label : O[d]?.label || d;
			if (p) {
				let e, r, n;
				o[4] !== y ? (e = (0, wG.c)("font-medium", y), o[4] = y, o[5] = e) : e = o[5], o[6] !== p || o[7] !== u || o[8] !== c ? (r = p(c, u), o[6] = p, o[7] = u, o[8] = c, o[9] = r) : r = o[9], o[10] !== e || o[11] !== r ? (n = (0, T.jsx)("div", {
					className: e,
					children: r
				}), o[10] = e, o[11] = r, o[12] = n) : n = o[12], t = n;
				break t
			}
			if (!c) {
				t = null;
				break t
			}
			o[13] !== y ? (r = (0, wG.c)("font-medium", y), o[13] = y, o[14] = r) : r = o[14],
			o[15] !== r || o[16] !== c ? (n = (0, T.jsx)("div", {
				className: r,
				children: c
			}), o[15] = r, o[16] = c, o[17] = n) : n = o[17],
			t = n
		}
		let _ = t;
		if (!l || !u?.length) return null;
		let A = 1 === u.length && "dot" !== x;
		o[18] !== c ? (r = (0, wG.c)("border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl", c), o[18] = c, o[19] = r) : r = o[19];
		let S = A ? null : _;
		if (o[20] !== m || o[21] !== O || o[22] !== v || o[23] !== w || o[24] !== x || o[25] !== g || o[26] !== A || o[27] !== u || o[28] !== _) {
			let e;
			o[30] !== m || o[31] !== O || o[32] !== v || o[33] !== w || o[34] !== x || o[35] !== g || o[36] !== A || o[37] !== _ ? (e = (e, t) => {
				let r = `${g||e.name||e.dataKey||"value"}`,
					n = w8(O, e, r),
					i = m || e.payload?.fill || e.color;
				return (0, T.jsx)("div", {
					className: (0, wG.c)("[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5", "dot" === x && "items-center"),
					children: v && e?.value !== void 0 && e.name ? v(e.value, e.name, e, t, e.payload) : (0, T.jsxs)(T.Fragment, {
						children: [n?.icon ? (0, T.jsx)(n.icon, {}) : !w && (0, T.jsx)("div", {
							className: (0, wG.c)("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
								"h-2.5 w-2.5": "dot" === x,
								"w-1": "line" === x,
								"w-0 border-[1.5px] border-dashed bg-transparent": "dashed" === x,
								"my-0.5": A && "dashed" === x
							}),
							style: {
								"--color-bg": i,
								"--color-border": i
							}
						}), (0, T.jsxs)("div", {
							className: (0, wG.c)("flex flex-1 justify-between leading-none", A ? "items-end" : "items-center"),
							children: [(0, T.jsxs)("div", {
								className: "grid gap-1.5",
								children: [A ? _ : null, (0, T.jsx)("span", {
									className: "text-muted-foreground",
									children: n?.label || e.name
								})]
							}), e.value && (0, T.jsx)("span", {
								className: "text-foreground font-mono font-medium tabular-nums",
								children: e.value.toLocaleString()
							})]
						})]
					})
				}, t)
			}, o[30] = m, o[31] = O, o[32] = v, o[33] = w, o[34] = x, o[35] = g, o[36] = A, o[37] = _, o[38] = e) : e = o[38], n = u.filter(w5).map(e), o[20] = m, o[21] = O, o[22] = v, o[23] = w, o[24] = x, o[25] = g, o[26] = A, o[27] = u, o[28] = _, o[29] = n
		} else n = o[29];
		return o[39] !== n ? (i = (0, T.jsx)("div", {
			className: "grid gap-1.5",
			children: n
		}), o[39] = n, o[40] = i) : i = o[40], o[41] !== r || o[42] !== S || o[43] !== i ? (a = (0, T.jsxs)("div", {
			className: r,
			children: [S, i]
		}), o[41] = r, o[42] = S, o[43] = i, o[44] = a) : a = o[44], a
	}

	function w5(e) {
		return "none" !== e.type
	}

	function w6(e) {
		let t, r, n, i = (0, D.c)(15),
			{
				className: a,
				hideIcon: o,
				payload: l,
				verticalAlign: u,
				nameKey: c
			} = e,
			s = void 0 !== o && o,
			{
				config: f
			} = wJ();
		if (!l?.length) return null;
		let h = "top" === (void 0 === u ? "bottom" : u) ? "pb-3" : "pt-3";
		if (i[0] !== a || i[1] !== h ? (t = (0, wG.c)("flex items-center justify-center gap-4", h, a), i[0] = a, i[1] = h, i[2] = t) : t = i[2], i[3] !== f || i[4] !== s || i[5] !== c || i[6] !== l) {
			let e;
			i[8] !== f || i[9] !== s || i[10] !== c ? (e = e => {
				let t = `${c||e.dataKey||"value"}`,
					r = w8(f, e, t);
				return (0, T.jsxs)("div", {
					className: (0, wG.c)("[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"),
					children: [r?.icon && !s ? (0, T.jsx)(r.icon, {}) : (0, T.jsx)("div", {
						className: "h-2 w-2 shrink-0 rounded-[2px]",
						style: {
							backgroundColor: e.color
						}
					}), r?.label]
				}, e.value)
			}, i[8] = f, i[9] = s, i[10] = c, i[11] = e) : e = i[11], r = l.filter(w4).map(e), i[3] = f, i[4] = s, i[5] = c, i[6] = l, i[7] = r
		} else r = i[7];
		return i[12] !== t || i[13] !== r ? (n = (0, T.jsx)("div", {
			className: t,
			children: r
		}), i[12] = t, i[13] = r, i[14] = n) : n = i[14], n
	}

	function w4(e) {
		return "none" !== e.type
	}

	function w8(e, t, r) {
		if ("object" != typeof t || null === t) return;
		let n = "payload" in t && "object" == typeof t.payload && null !== t.payload ? t.payload : void 0,
			i = r;
		return r in t && "string" == typeof t[r] ? i = t[r] : n && r in n && "string" == typeof n[r] && (i = n[r]), i in e ? e[i] : e[r]
	}

	function w7(e) {
		let [, t] = e;
		return t.theme || t.color
	}
	let w9 = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

	function Oe(e) {
		let t, r, n, i, a, o, l, u, c, s = (0, D.c)(19),
			{
				data: f,
				model: h
			} = e,
			d = "all" === h && f.models.length > 1;
		s[0] !== f.models || s[1] !== d ? (t = ((e, t) => {
			if (!t) return {
				value: {
					label: "Value",
					color: "var(--accent)"
				}
			};
			let r = {};
			return e.forEach((e, t) => {
				r[e] = {
					label: e,
					color: w9[t % w9.length]
				}
			}), r
		})(f.models, d), s[0] = f.models, s[1] = d, s[2] = t) : t = s[2];
		let p = t;
		return s[3] === Symbol.for("react.memo_cache_sentinel") ? (r = {
			top: 20,
			right: 30,
			left: 40,
			bottom: 20
		}, s[3] = r) : r = s[3], s[4] === Symbol.for("react.memo_cache_sentinel") ? (n = (0, T.jsx)(xo, {
			strokeDasharray: "3 3",
			stroke: "var(--border)",
			opacity: .3,
			vertical: !1
		}), s[4] = n) : n = s[4], s[5] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, T.jsx)(xw, {
			dataKey: "label",
			tickLine: !1,
			tickMargin: 10,
			axisLine: !1,
			tick: {
				fontSize: 12,
				fill: "var(--muted-foreground)"
			}
		}), s[5] = i) : i = s[5], s[6] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, T.jsx)(w2, {
			content: (0, T.jsx)(w3, {
				hideLabel: !0
			})
		}), s[6] = a) : a = s[6], s[7] !== d ? (o = d && (0, T.jsx)(wX, {
			content: (0, T.jsx)(w6, {
				className: "justify-start lg:justify-center"
			})
		}), s[7] = d, s[8] = o) : o = s[8], s[9] !== f.models || s[10] !== d ? (l = d ? f.models.map((e, t) => (0, T.jsx)(me, {
			dataKey: e,
			stackId: "a",
			fill: `var(--color-${e})`,
			radius: 0 === t ? [0, 0, 4, 4] : t === f.models.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0],
			maxBarSize: 40
		}, e)) : (0, T.jsx)(me, {
			dataKey: "value",
			fill: "var(--color-value)",
			radius: [4, 4, 0, 0],
			maxBarSize: 40
		}), s[9] = f.models, s[10] = d, s[11] = l) : l = s[11], s[12] !== f.chartData || s[13] !== o || s[14] !== l ? (u = (0, T.jsxs)(bi, {
			accessibilityLayer: !0,
			data: f.chartData,
			margin: r,
			barCategoryGap: "20%",
			children: [n, i, a, o, l]
		}), s[12] = f.chartData, s[13] = o, s[14] = l, s[15] = u) : u = s[15], s[16] !== p || s[17] !== u ? (c = (0, T.jsx)(xO.N, {
			children: (0, T.jsx)(xO.O, {
				className: "p-6 overflow-x-hidden",
				children: (0, T.jsx)(w0, {
					config: p,
					className: "h-80 w-full",
					children: u
				})
			})
		}), s[16] = p, s[17] = u, s[18] = c) : c = s[18], c
	}
	var Ot = e.i(380491),
		Or = e.i(629841);

	function On(e) {
		let t, r, n, i, a, o, l, u, c, s, f, h, d, p, y, v, m = (0, D.c)(40),
			{
				filters: g,
				onFiltersChange: b,
				usageData: x
			} = e,
			{
				data: w
			} = (0, Or.f)();
		m[0] !== w || m[1] !== g.apiKeyId ? (t = !!w && "all" !== g.apiKeyId && !w?.some(e => e.id === g.apiKeyId), m[0] = w, m[1] = g.apiKeyId, m[2] = t) : t = m[2];
		let O = t;
		m[3] !== g || m[4] !== b || m[5] !== O ? (r = () => {
			O && b({
				...g,
				apiKeyId: "all"
			})
		}, n = [O, g, b], m[3] = g, m[4] = b, m[5] = O, m[6] = r, m[7] = n) : (r = m[6], n = m[7]), (0, N.useEffect)(r, n), m[8] !== g || m[9] !== b ? (i = e => {
			b({
				...g,
				groupBy: e
			})
		}, m[8] = g, m[9] = b, m[10] = i) : i = m[10];
		let _ = i;
		m[11] !== g || m[12] !== b ? (a = e => {
			b({
				...g,
				model: e
			})
		}, m[11] = g, m[12] = b, m[13] = a) : a = m[13];
		let A = a;
		m[14] !== g || m[15] !== b ? (o = e => {
			b({
				...g,
				apiKeyId: e
			})
		}, m[14] = g, m[15] = b, m[16] = o) : o = m[16];
		let S = o;
		return m[17] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, T.jsx)(Ot.P, {
			className: "w-40",
			children: (0, T.jsx)(Ot.U, {
				placeholder: "Group by"
			})
		}), m[17] = l) : l = m[17], m[18] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, T.jsxs)(Ot.r, {
			children: [(0, T.jsx)(Ot.T, {
				value: "day",
				children: "Day"
			}), (0, T.jsx)(Ot.T, {
				value: "week",
				children: "Week"
			}), (0, T.jsx)(Ot.T, {
				value: "month",
				children: "Month"
			})]
		}), m[18] = u) : u = m[18], m[19] !== g.groupBy || m[20] !== _ ? (c = (0, T.jsxs)(Ot.d, {
			value: g.groupBy,
			onValueChange: _,
			children: [l, u]
		}), m[19] = g.groupBy, m[20] = _, m[21] = c) : c = m[21], m[22] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, T.jsx)(Ot.P, {
			className: "w-48",
			children: (0, T.jsx)(Ot.U, {
				placeholder: "All models"
			})
		}), m[22] = s) : s = m[22], m[23] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, T.jsx)(Ot.T, {
			value: "all",
			children: "All models"
		}), m[23] = f) : f = m[23], m[24] !== x?.models ? (h = x?.models.map(Oa), m[24] = x?.models, m[25] = h) : h = m[25], m[26] !== h ? (d = (0, T.jsxs)(Ot.r, {
			children: [f, h]
		}), m[26] = h, m[27] = d) : d = m[27], m[28] !== g.model || m[29] !== A || m[30] !== d ? (p = (0, T.jsxs)(Ot.d, {
			value: g.model,
			onValueChange: A,
			children: [s, d]
		}), m[28] = g.model, m[29] = A, m[30] = d, m[31] = p) : p = m[31], m[32] !== w || m[33] !== g.apiKeyId || m[34] !== S ? (y = w && w.length > 0 && (0, T.jsxs)(Ot.d, {
			value: g.apiKeyId,
			onValueChange: S,
			children: [(0, T.jsx)(Ot.P, {
				className: "w-56",
				children: (0, T.jsx)(Ot.U, {
					placeholder: "All API keys"
				})
			}), (0, T.jsxs)(Ot.r, {
				children: [(0, T.jsx)(Ot.T, {
					value: "all",
					children: "All API keys"
				}), w.map(Oi)]
			})]
		}), m[32] = w, m[33] = g.apiKeyId, m[34] = S, m[35] = y) : y = m[35], m[36] !== p || m[37] !== y || m[38] !== c ? (v = (0, T.jsxs)("div", {
			className: "flex flex-wrap gap-4 mb-6",
			children: [c, p, y]
		}), m[36] = p, m[37] = y, m[38] = c, m[39] = v) : v = m[39], v
	}

	function Oi(e) {
		return (0, T.jsx)(Ot.T, {
			value: e.id,
			children: e.name || e.id
		}, e.id)
	}

	function Oa(e) {
		return (0, T.jsx)(Ot.T, {
			value: e,
			children: e
		}, e)
	}
	e.s(["UsageTable", 0, function(e) {
		let t, r, n, i, a, o, l, u, c, s = (0, D.c)(17),
			{
				initialOrgKey: f
			} = e,
			[h, d] = (0, N.useState)(H),
			{
				data: p
			} = function(e, t) {
				var r;
				let n, i, a, o, l = (0, D.c)(12),
					{
						data: u,
						isPending: c
					} = B.i.useSession(),
					s = c ? t : u?.session?.activeOrganizationId ?? "personal";
				l[0] !== e || l[1] !== s ? (n = ["usage", s, e], l[0] = e, l[1] = s, l[2] = n) : n = l[2], l[3] !== e ? (i = async () => {
					let t = new URLSearchParams({
							groupBy: e.groupBy,
							model: e.model,
							apiKeyId: e.apiKeyId
						}),
						r = await fetch(`/api/user/usage?${t}`);
					return await (0, $.W)(r, "Failed to fetch usage data"), await r.json()
				}, l[3] = e, l[4] = i) : i = l[4], l[5] !== n || l[6] !== i ? (a = {
					queryKey: n,
					queryFn: i
				}, l[5] = n, l[6] = i, l[7] = a) : a = l[7];
				let {
					data: f,
					isLoading: h,
					error: d
				} = (r = a, (0, L.f)({
					...r,
					enabled: !0,
					suspense: !0,
					throwOnError: z.A,
					placeholderData: void 0
				}, R.f, void 0));
				return l[8] !== f || l[9] !== d || l[10] !== h ? (o = {
					data: f,
					isLoading: h,
					error: d
				}, l[8] = f, l[9] = d, l[10] = h, l[11] = o) : o = l[11], o
			}(h, f);
		s[0] === Symbol.for("react.memo_cache_sentinel") ? (t = (0, T.jsx)("div", {
			className: "flex items-center justify-between",
			children: (0, T.jsxs)("div", {
				children: [(0, T.jsx)("h1", {
					className: "text-2xl font-semibold",
					children: "Usage"
				}), (0, T.jsx)("p", {
					className: "text-muted-foreground",
					children: "Monitor your API usage and spending"
				})]
			})
		}), s[0] = t) : t = s[0], s[1] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, T.jsx)("p", {
			className: "text-sm text-muted-foreground mb-1",
			children: "Total Spend"
		}), s[1] = r) : r = s[1];
		let y = p?.totalSpend || 0;
		return s[2] !== y ? (n = y.toLocaleString(), s[2] = y, s[3] = n) : n = s[3], s[4] !== n ? (i = (0, T.jsx)("div", {
			className: "text-3xl font-bold",
			children: n
		}), s[4] = n, s[5] = i) : i = s[5], s[6] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, T.jsx)("p", {
			className: "text-sm text-muted-foreground mt-1",
			children: "credits"
		}), s[6] = a) : a = s[6], s[7] !== i ? (o = (0, T.jsxs)("div", {
			className: "mb-8",
			children: [r, i, a]
		}), s[7] = i, s[8] = o) : o = s[8], s[9] !== h || s[10] !== p ? (l = (0, T.jsx)(On, {
			filters: h,
			onFiltersChange: d,
			usageData: p
		}), u = p && (0, T.jsx)(Oe, {
			data: p,
			model: h.model
		}), s[9] = h, s[10] = p, s[11] = l, s[12] = u) : (l = s[11], u = s[12]), s[13] !== o || s[14] !== l || s[15] !== u ? (c = (0, T.jsxs)("div", {
			className: "space-y-4",
			children: [t, o, l, u]
		}), s[13] = o, s[14] = l, s[15] = u, s[16] = c) : c = s[16], c
	}], 755629)
}, 497068, e => {
	"use strict";
	var t = e.i(619525),
		r = e.i(170380),
		n = e.i(150877);
	e.s(["HydrationBoundary", 0, ({
		children: e,
		options: i = {},
		state: a,
		queryClient: o
	}) => {
		let l = (0, t.d)(o),
			u = r.useRef(i);
		r.useEffect(() => {
			u.current = i
		});
		let c = r.useMemo(() => {
			if (a) {
				if ("object" != typeof a) return;
				let e = l.getQueryCache(),
					t = a.queries || [],
					r = [],
					i = [];
				for (let n of t) {
					let t = e.get(n.queryHash);
					t ? (n.state.dataUpdatedAt > t.state.dataUpdatedAt || n.promise && "pending" !== t.state.status && "fetching" !== t.state.fetchStatus && n.dehydratedAt > t.state.dataUpdatedAt) && i.push(n) : r.push(n)
				}
				if (r.length > 0 && (0, n.a)(l, {
						queries: r
					}, u.current), i.length > 0) return i
			}
		}, [l, a]);
		return r.useEffect(() => {
			c && (0, n.a)(l, {
				queries: c
			}, u.current)
		}, [l, c]), e
	}])
}, 560600, (e, t, r) => {
	! function(r) {
		"use strict";
		var n, i = {
				precision: 20,
				rounding: 4,
				toExpNeg: -7,
				toExpPos: 21,
				LN10: "2.302585092994045684017991454684364207601101488628772976033327900967572609677352480235997205089598298341967784042286"
			},
			a = !0,
			o = "[DecimalError] ",
			l = o + "Invalid argument: ",
			u = o + "Exponent out of range: ",
			c = Math.floor,
			s = Math.pow,
			f = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
			h = c(1286742750677284.5),
			d = {};

		function p(e, t) {
			var r, n, i, o, l, u, c, s, f = e.constructor,
				h = f.precision;
			if (!e.s || !t.s) return t.s || (t = new f(e)), a ? A(t, h) : t;
			if (c = e.d, s = t.d, l = e.e, i = t.e, c = c.slice(), o = l - i) {
				for (o < 0 ? (n = c, o = -o, u = s.length) : (n = s, i = l, u = c.length), o > (u = (l = Math.ceil(h / 7)) > u ? l + 1 : u + 1) && (o = u, n.length = 1), n.reverse(); o--;) n.push(0);
				n.reverse()
			}
			for ((u = c.length) - (o = s.length) < 0 && (o = u, n = s, s = c, c = n), r = 0; o;) r = (c[--o] = c[o] + s[o] + r) / 1e7 | 0, c[o] %= 1e7;
			for (r && (c.unshift(r), ++i), u = c.length; 0 == c[--u];) c.pop();
			return t.d = c, t.e = i, a ? A(t, h) : t
		}

		function y(e, t, r) {
			if (e !== ~~e || e < t || e > r) throw Error(l + e)
		}

		function v(e) {
			var t, r, n, i = e.length - 1,
				a = "",
				o = e[0];
			if (i > 0) {
				for (a += o, t = 1; t < i; t++)(r = 7 - (n = e[t] + "").length) && (a += w(r)), a += n;
				(r = 7 - (n = (o = e[t]) + "").length) && (a += w(r))
			} else if (0 === o) return "0";
			for (; o % 10 == 0;) o /= 10;
			return a + o
		}
		d.absoluteValue = d.abs = function() {
			var e = new this.constructor(this);
			return e.s && (e.s = 1), e
		}, d.comparedTo = d.cmp = function(e) {
			var t, r, n, i;
			if (e = new this.constructor(e), this.s !== e.s) return this.s || -e.s;
			if (this.e !== e.e) return this.e > e.e ^ this.s < 0 ? 1 : -1;
			for (n = this.d.length, t = 0, r = n < (i = e.d.length) ? n : i; t < r; ++t)
				if (this.d[t] !== e.d[t]) return this.d[t] > e.d[t] ^ this.s < 0 ? 1 : -1;
			return n === i ? 0 : n > i ^ this.s < 0 ? 1 : -1
		}, d.decimalPlaces = d.dp = function() {
			var e = this.d.length - 1,
				t = (e - this.e) * 7;
			if (e = this.d[e])
				for (; e % 10 == 0; e /= 10) t--;
			return t < 0 ? 0 : t
		}, d.dividedBy = d.div = function(e) {
			return m(this, new this.constructor(e))
		}, d.dividedToIntegerBy = d.idiv = function(e) {
			var t = this.constructor;
			return A(m(this, new t(e), 0, 1), t.precision)
		}, d.equals = d.eq = function(e) {
			return !this.cmp(e)
		}, d.exponent = function() {
			return b(this)
		}, d.greaterThan = d.gt = function(e) {
			return this.cmp(e) > 0
		}, d.greaterThanOrEqualTo = d.gte = function(e) {
			return this.cmp(e) >= 0
		}, d.isInteger = d.isint = function() {
			return this.e > this.d.length - 2
		}, d.isNegative = d.isneg = function() {
			return this.s < 0
		}, d.isPositive = d.ispos = function() {
			return this.s > 0
		}, d.isZero = function() {
			return 0 === this.s
		}, d.lessThan = d.lt = function(e) {
			return 0 > this.cmp(e)
		}, d.lessThanOrEqualTo = d.lte = function(e) {
			return 1 > this.cmp(e)
		}, d.logarithm = d.log = function(e) {
			var t, r = this.constructor,
				i = r.precision,
				l = i + 5;
			if (void 0 === e) e = new r(10);
			else if ((e = new r(e)).s < 1 || e.eq(n)) throw Error(o + "NaN");
			if (this.s < 1) throw Error(o + (this.s ? "NaN" : "-Infinity"));
			return this.eq(n) ? new r(0) : (a = !1, t = m(O(this, l), O(e, l), l), a = !0, A(t, i))
		}, d.minus = d.sub = function(e) {
			return e = new this.constructor(e), this.s == e.s ? S(this, e) : p(this, (e.s = -e.s, e))
		}, d.modulo = d.mod = function(e) {
			var t, r = this.constructor,
				n = r.precision;
			if (!(e = new r(e)).s) throw Error(o + "NaN");
			return this.s ? (a = !1, t = m(this, e, 0, 1).times(e), a = !0, this.minus(t)) : A(new r(this), n)
		}, d.naturalExponential = d.exp = function() {
			return g(this)
		}, d.naturalLogarithm = d.ln = function() {
			return O(this)
		}, d.negated = d.neg = function() {
			var e = new this.constructor(this);
			return e.s = -e.s || 0, e
		}, d.plus = d.add = function(e) {
			return e = new this.constructor(e), this.s == e.s ? p(this, e) : S(this, (e.s = -e.s, e))
		}, d.precision = d.sd = function(e) {
			var t, r, n;
			if (void 0 !== e && !!e !== e && 1 !== e && 0 !== e) throw Error(l + e);
			if (t = b(this) + 1, r = 7 * (n = this.d.length - 1) + 1, n = this.d[n]) {
				for (; n % 10 == 0; n /= 10) r--;
				for (n = this.d[0]; n >= 10; n /= 10) r++
			}
			return e && t > r ? t : r
		}, d.squareRoot = d.sqrt = function() {
			var e, t, r, n, i, l, u, s = this.constructor;
			if (this.s < 1) {
				if (!this.s) return new s(0);
				throw Error(o + "NaN")
			}
			for (e = b(this), a = !1, 0 == (i = Math.sqrt(+this)) || 1 / 0 == i ? (((t = v(this.d)).length + e) % 2 == 0 && (t += "0"), i = Math.sqrt(t), e = c((e + 1) / 2) - (e < 0 || e % 2), n = new s(t = 1 / 0 == i ? "5e" + e : (t = i.toExponential()).slice(0, t.indexOf("e") + 1) + e)) : n = new s(i.toString()), i = u = (r = s.precision) + 3;;)
				if (n = (l = n).plus(m(this, l, u + 2)).times(.5), v(l.d).slice(0, u) === (t = v(n.d)).slice(0, u)) {
					if (t = t.slice(u - 3, u + 1), i == u && "4999" == t) {
						if (A(l, r + 1, 0), l.times(l).eq(this)) {
							n = l;
							break
						}
					} else if ("9999" != t) break;
					u += 4
				} return a = !0, A(n, r)
		}, d.times = d.mul = function(e) {
			var t, r, n, i, o, l, u, c, s, f = this.constructor,
				h = this.d,
				d = (e = new f(e)).d;
			if (!this.s || !e.s) return new f(0);
			for (e.s *= this.s, r = this.e + e.e, (c = h.length) < (s = d.length) && (o = h, h = d, d = o, l = c, c = s, s = l), o = [], n = l = c + s; n--;) o.push(0);
			for (n = s; --n >= 0;) {
				for (t = 0, i = c + n; i > n;) u = o[i] + d[n] * h[i - n - 1] + t, o[i--] = u % 1e7 | 0, t = u / 1e7 | 0;
				o[i] = (o[i] + t) % 1e7 | 0
			}
			for (; !o[--l];) o.pop();
			return t ? ++r : o.shift(), e.d = o, e.e = r, a ? A(e, f.precision) : e
		}, d.toDecimalPlaces = d.todp = function(e, t) {
			var r = this,
				n = r.constructor;
			return (r = new n(r), void 0 === e) ? r : (y(e, 0, 1e9), void 0 === t ? t = n.rounding : y(t, 0, 8), A(r, e + b(r) + 1, t))
		}, d.toExponential = function(e, t) {
			var r, n = this,
				i = n.constructor;
			return void 0 === e ? r = j(n, !0) : (y(e, 0, 1e9), void 0 === t ? t = i.rounding : y(t, 0, 8), r = j(n = A(new i(n), e + 1, t), !0, e + 1)), r
		}, d.toFixed = function(e, t) {
			var r, n, i = this.constructor;
			return void 0 === e ? j(this) : (y(e, 0, 1e9), void 0 === t ? t = i.rounding : y(t, 0, 8), r = j((n = A(new i(this), e + b(this) + 1, t)).abs(), !1, e + b(n) + 1), this.isneg() && !this.isZero() ? "-" + r : r)
		}, d.toInteger = d.toint = function() {
			var e = this.constructor;
			return A(new e(this), b(this) + 1, e.rounding)
		}, d.toNumber = function() {
			return +this
		}, d.toPower = d.pow = function(e) {
			var t, r, i, l, u, s, f = this,
				h = f.constructor,
				d = +(e = new h(e));
			if (!e.s) return new h(n);
			if (!(f = new h(f)).s) {
				if (e.s < 1) throw Error(o + "Infinity");
				return f
			}
			if (f.eq(n)) return f;
			if (i = h.precision, e.eq(n)) return A(f, i);
			if (s = (t = e.e) >= (r = e.d.length - 1), u = f.s, s) {
				if ((r = d < 0 ? -d : d) <= 0x1fffffffffffff) {
					for (l = new h(n), t = Math.ceil(i / 7 + 4), a = !1; r % 2 && E((l = l.times(f)).d, t), 0 !== (r = c(r / 2));) E((f = f.times(f)).d, t);
					return a = !0, e.s < 0 ? new h(n).div(l) : A(l, i)
				}
			} else if (u < 0) throw Error(o + "NaN");
			return u = u < 0 && 1 & e.d[Math.max(t, r)] ? -1 : 1, f.s = 1, a = !1, l = e.times(O(f, i + 12)), a = !0, (l = g(l)).s = u, l
		}, d.toPrecision = function(e, t) {
			var r, n, i = this,
				a = i.constructor;
			return void 0 === e ? (r = b(i), n = j(i, r <= a.toExpNeg || r >= a.toExpPos)) : (y(e, 1, 1e9), void 0 === t ? t = a.rounding : y(t, 0, 8), r = b(i = A(new a(i), e, t)), n = j(i, e <= r || r <= a.toExpNeg, e)), n
		}, d.toSignificantDigits = d.tosd = function(e, t) {
			var r = this.constructor;
			return void 0 === e ? (e = r.precision, t = r.rounding) : (y(e, 1, 1e9), void 0 === t ? t = r.rounding : y(t, 0, 8)), A(new r(this), e, t)
		}, d.toString = d.valueOf = d.val = d.toJSON = function() {
			var e = b(this),
				t = this.constructor;
			return j(this, e <= t.toExpNeg || e >= t.toExpPos)
		};
		var m = function() {
			function e(e, t) {
				var r, n = 0,
					i = e.length;
				for (e = e.slice(); i--;) r = e[i] * t + n, e[i] = r % 1e7 | 0, n = r / 1e7 | 0;
				return n && e.unshift(n), e
			}

			function t(e, t, r, n) {
				var i, a;
				if (r != n) a = r > n ? 1 : -1;
				else
					for (i = a = 0; i < r; i++)
						if (e[i] != t[i]) {
							a = e[i] > t[i] ? 1 : -1;
							break
						} return a
			}

			function r(e, t, r) {
				for (var n = 0; r--;) e[r] -= n, n = +(e[r] < t[r]), e[r] = 1e7 * n + e[r] - t[r];
				for (; !e[0] && e.length > 1;) e.shift()
			}
			return function(n, i, a, l) {
				var u, c, s, f, h, d, p, y, v, m, g, x, w, O, _, S, j, E, k = n.constructor,
					P = n.s == i.s ? 1 : -1,
					M = n.d,
					I = i.d;
				if (!n.s) return new k(n);
				if (!i.s) throw Error(o + "Division by zero");
				for (c = n.e - i.e, j = I.length, _ = M.length, y = (p = new k(P)).d = [], s = 0; I[s] == (M[s] || 0);) ++s;
				if (I[s] > (M[s] || 0) && --c, (x = null == a ? a = k.precision : l ? a + (b(n) - b(i)) + 1 : a) < 0) return new k(0);
				if (x = x / 7 + 2 | 0, s = 0, 1 == j)
					for (f = 0, I = I[0], x++;
						(s < _ || f) && x--; s++) w = 1e7 * f + (M[s] || 0), y[s] = w / I | 0, f = w % I | 0;
				else {
					for ((f = 1e7 / (I[0] + 1) | 0) > 1 && (I = e(I, f), M = e(M, f), j = I.length, _ = M.length), O = j, m = (v = M.slice(0, j)).length; m < j;) v[m++] = 0;
					(E = I.slice()).unshift(0), S = I[0], I[1] >= 5e6 && ++S;
					do f = 0, (u = t(I, v, j, m)) < 0 ? (g = v[0], j != m && (g = 1e7 * g + (v[1] || 0)), (f = g / S | 0) > 1 ? (f >= 1e7 && (f = 1e7 - 1), d = (h = e(I, f)).length, m = v.length, 1 == (u = t(h, v, d, m)) && (f--, r(h, j < d ? E : I, d))) : (0 == f && (u = f = 1), h = I.slice()), (d = h.length) < m && h.unshift(0), r(v, h, m), -1 == u && (m = v.length, (u = t(I, v, j, m)) < 1 && (f++, r(v, j < m ? E : I, m))), m = v.length) : 0 === u && (f++, v = [0]), y[s++] = f, u && v[0] ? v[m++] = M[O] || 0 : (v = [M[O]], m = 1); while ((O++ < _ || void 0 !== v[0]) && x--)
				}
				return y[0] || y.shift(), p.e = c, A(p, l ? a + b(p) + 1 : a)
			}
		}();

		function g(e, t) {
			var r, i, o, l, c, f = 0,
				h = 0,
				d = e.constructor,
				p = d.precision;
			if (b(e) > 16) throw Error(u + b(e));
			if (!e.s) return new d(n);
			for (null == t ? (a = !1, c = p) : c = t, l = new d(.03125); e.abs().gte(.1);) e = e.times(l), h += 5;
			for (c += Math.log(s(2, h)) / Math.LN10 * 2 + 5 | 0, r = i = o = new d(n), d.precision = c;;) {
				if (i = A(i.times(e), c), r = r.times(++f), v((l = o.plus(m(i, r, c))).d).slice(0, c) === v(o.d).slice(0, c)) {
					for (; h--;) o = A(o.times(o), c);
					return d.precision = p, null == t ? (a = !0, A(o, p)) : o
				}
				o = l
			}
		}

		function b(e) {
			for (var t = 7 * e.e, r = e.d[0]; r >= 10; r /= 10) t++;
			return t
		}

		function x(e, t, r) {
			if (t > e.LN10.sd()) throw a = !0, r && (e.precision = r), Error(o + "LN10 precision limit exceeded");
			return A(new e(e.LN10), t)
		}

		function w(e) {
			for (var t = ""; e--;) t += "0";
			return t
		}

		function O(e, t) {
			var r, i, l, u, c, s, f, h, d, p = 1,
				y = e,
				g = y.d,
				w = y.constructor,
				_ = w.precision;
			if (y.s < 1) throw Error(o + (y.s ? "NaN" : "-Infinity"));
			if (y.eq(n)) return new w(0);
			if (null == t ? (a = !1, h = _) : h = t, y.eq(10)) return null == t && (a = !0), x(w, h);
			if (w.precision = h += 10, i = (r = v(g)).charAt(0), !(15e14 > Math.abs(u = b(y)))) return f = x(w, h + 2, _).times(u + ""), y = O(new w(i + "." + r.slice(1)), h - 10).plus(f), w.precision = _, null == t ? (a = !0, A(y, _)) : y;
			for (; i < 7 && 1 != i || 1 == i && r.charAt(1) > 3;) i = (r = v((y = y.times(e)).d)).charAt(0), p++;
			for (u = b(y), i > 1 ? (y = new w("0." + r), u++) : y = new w(i + "." + r.slice(1)), s = c = y = m(y.minus(n), y.plus(n), h), d = A(y.times(y), h), l = 3;;) {
				if (c = A(c.times(d), h), v((f = s.plus(m(c, new w(l), h))).d).slice(0, h) === v(s.d).slice(0, h)) return s = s.times(2), 0 !== u && (s = s.plus(x(w, h + 2, _).times(u + ""))), s = m(s, new w(p), h), w.precision = _, null == t ? (a = !0, A(s, _)) : s;
				s = f, l += 2
			}
		}

		function _(e, t) {
			var r, n, i;
			for ((r = t.indexOf(".")) > -1 && (t = t.replace(".", "")), (n = t.search(/e/i)) > 0 ? (r < 0 && (r = n), r += +t.slice(n + 1), t = t.substring(0, n)) : r < 0 && (r = t.length), n = 0; 48 === t.charCodeAt(n);) ++n;
			for (i = t.length; 48 === t.charCodeAt(i - 1);) --i;
			if (t = t.slice(n, i)) {
				if (i -= n, e.e = c((r = r - n - 1) / 7), e.d = [], n = (r + 1) % 7, r < 0 && (n += 7), n < i) {
					for (n && e.d.push(+t.slice(0, n)), i -= 7; n < i;) e.d.push(+t.slice(n, n += 7));
					n = 7 - (t = t.slice(n)).length
				} else n -= i;
				for (; n--;) t += "0";
				if (e.d.push(+t), a && (e.e > h || e.e < -h)) throw Error(u + r)
			} else e.s = 0, e.e = 0, e.d = [0];
			return e
		}

		function A(e, t, r) {
			var n, i, o, l, f, d, p, y, v = e.d;
			for (l = 1, o = v[0]; o >= 10; o /= 10) l++;
			if ((n = t - l) < 0) n += 7, i = t, p = v[y = 0];
			else {
				if ((y = Math.ceil((n + 1) / 7)) >= (o = v.length)) return e;
				for (p = o = v[y], l = 1; o >= 10; o /= 10) l++;
				n %= 7, i = n - 7 + l
			}
			if (void 0 !== r && (f = p / (o = s(10, l - i - 1)) % 10 | 0, d = t < 0 || void 0 !== v[y + 1] || p % o, d = r < 4 ? (f || d) && (0 == r || r == (e.s < 0 ? 3 : 2)) : f > 5 || 5 == f && (4 == r || d || 6 == r && (n > 0 ? i > 0 ? p / s(10, l - i) : 0 : v[y - 1]) % 10 & 1 || r == (e.s < 0 ? 8 : 7))), t < 1 || !v[0]) return d ? (o = b(e), v.length = 1, t = t - o - 1, v[0] = s(10, (7 - t % 7) % 7), e.e = c(-t / 7) || 0) : (v.length = 1, v[0] = e.e = e.s = 0), e;
			if (0 == n ? (v.length = y, o = 1, y--) : (v.length = y + 1, o = s(10, 7 - n), v[y] = i > 0 ? (p / s(10, l - i) % s(10, i) | 0) * o : 0), d)
				for (;;)
					if (0 == y) {
						1e7 == (v[0] += o) && (v[0] = 1, ++e.e);
						break
					} else {
						if (v[y] += o, 1e7 != v[y]) break;
						v[y--] = 0, o = 1
					} for (n = v.length; 0 === v[--n];) v.pop();
			if (a && (e.e > h || e.e < -h)) throw Error(u + b(e));
			return e
		}

		function S(e, t) {
			var r, n, i, o, l, u, c, s, f, h, d = e.constructor,
				p = d.precision;
			if (!e.s || !t.s) return t.s ? t.s = -t.s : t = new d(e), a ? A(t, p) : t;
			if (c = e.d, h = t.d, n = t.e, s = e.e, c = c.slice(), l = s - n) {
				for ((f = l < 0) ? (r = c, l = -l, u = h.length) : (r = h, n = s, u = c.length), l > (i = Math.max(Math.ceil(p / 7), u) + 2) && (l = i, r.length = 1), r.reverse(), i = l; i--;) r.push(0);
				r.reverse()
			} else {
				for ((f = (i = c.length) < (u = h.length)) && (u = i), i = 0; i < u; i++)
					if (c[i] != h[i]) {
						f = c[i] < h[i];
						break
					} l = 0
			}
			for (f && (r = c, c = h, h = r, t.s = -t.s), u = c.length, i = h.length - u; i > 0; --i) c[u++] = 0;
			for (i = h.length; i > l;) {
				if (c[--i] < h[i]) {
					for (o = i; o && 0 === c[--o];) c[o] = 1e7 - 1;
					--c[o], c[i] += 1e7
				}
				c[i] -= h[i]
			}
			for (; 0 === c[--u];) c.pop();
			for (; 0 === c[0]; c.shift()) --n;
			return c[0] ? (t.d = c, t.e = n, a ? A(t, p) : t) : new d(0)
		}

		function j(e, t, r) {
			var n, i = b(e),
				a = v(e.d),
				o = a.length;
			return t ? (r && (n = r - o) > 0 ? a = a.charAt(0) + "." + a.slice(1) + w(n) : o > 1 && (a = a.charAt(0) + "." + a.slice(1)), a = a + (i < 0 ? "e" : "e+") + i) : i < 0 ? (a = "0." + w(-i - 1) + a, r && (n = r - o) > 0 && (a += w(n))) : i >= o ? (a += w(i + 1 - o), r && (n = r - i - 1) > 0 && (a = a + "." + w(n))) : ((n = i + 1) < o && (a = a.slice(0, n) + "." + a.slice(n)), r && (n = r - o) > 0 && (i + 1 === o && (a += "."), a += w(n))), e.s < 0 ? "-" + a : a
		}

		function E(e, t) {
			if (e.length > t) return e.length = t, !0
		}

		function k(e) {
			if (!e || "object" != typeof e) throw Error(o + "Object expected");
			var t, r, n, i = ["precision", 1, 1e9, "rounding", 0, 8, "toExpNeg", -1 / 0, 0, "toExpPos", 0, 1 / 0];
			for (t = 0; t < i.length; t += 3)
				if (void 0 !== (n = e[r = i[t]]))
					if (c(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
					else throw Error(l + r + ": " + n);
			if (void 0 !== (n = e[r = "LN10"]))
				if (n == Math.LN10) this[r] = new this(n);
				else throw Error(l + r + ": " + n);
			return this
		}
		if ((i = function e(t) {
				var r, n, i;

				function a(e) {
					if (!(this instanceof a)) return new a(e);
					if (this.constructor = a, e instanceof a) {
						this.s = e.s, this.e = e.e, this.d = (e = e.d) ? e.slice() : e;
						return
					}
					if ("number" == typeof e) {
						if (0 * e != 0) throw Error(l + e);
						if (e > 0) this.s = 1;
						else if (e < 0) e = -e, this.s = -1;
						else {
							this.s = 0, this.e = 0, this.d = [0];
							return
						}
						if (e === ~~e && e < 1e7) {
							this.e = 0, this.d = [e];
							return
						}
						return _(this, e.toString())
					}
					if ("string" != typeof e) throw Error(l + e);
					if (45 === e.charCodeAt(0) ? (e = e.slice(1), this.s = -1) : this.s = 1, f.test(e)) _(this, e);
					else throw Error(l + e)
				}
				if (a.prototype = d, a.ROUND_UP = 0, a.ROUND_DOWN = 1, a.ROUND_CEIL = 2, a.ROUND_FLOOR = 3, a.ROUND_HALF_UP = 4, a.ROUND_HALF_DOWN = 5, a.ROUND_HALF_EVEN = 6, a.ROUND_HALF_CEIL = 7, a.ROUND_HALF_FLOOR = 8, a.clone = e, a.config = a.set = k, void 0 === t && (t = {}), t)
					for (r = 0, i = ["precision", "rounding", "toExpNeg", "toExpPos", "LN10"]; r < i.length;) t.hasOwnProperty(n = i[r++]) || (t[n] = this[n]);
				return a.config(t), a
			}(i)).default = i.Decimal = i, n = new i(1), "function" == typeof define && define.amd) {
			let t;
			e.r, void 0 !== (t = i) && e.v(t)
		} else t.exports ? t.exports = i : (r || (r = "u" > typeof self && self && self.self == self ? self : Function("return this")()), r.Decimal = i)
	}(e.e)
}, 571650, (e, t, r) => {
	"use strict";
	var n = Object.prototype.hasOwnProperty,
		i = "~";

	function a() {}

	function o(e, t, r) {
		this.fn = e, this.context = t, this.once = r || !1
	}

	function l(e, t, r, n, a) {
		if ("function" != typeof r) throw TypeError("The listener must be a function");
		var l = new o(r, n || e, a),
			u = i ? i + t : t;
		return e._events[u] ? e._events[u].fn ? e._events[u] = [e._events[u], l] : e._events[u].push(l) : (e._events[u] = l, e._eventsCount++), e
	}

	function u(e, t) {
		0 == --e._eventsCount ? e._events = new a : delete e._events[t]
	}

	function c() {
		this._events = new a, this._eventsCount = 0
	}
	Object.create && (a.prototype = Object.create(null), new a().__proto__ || (i = !1)), c.prototype.eventNames = function() {
		var e, t, r = [];
		if (0 === this._eventsCount) return r;
		for (t in e = this._events) n.call(e, t) && r.push(i ? t.slice(1) : t);
		return Object.getOwnPropertySymbols ? r.concat(Object.getOwnPropertySymbols(e)) : r
	}, c.prototype.listeners = function(e) {
		var t = i ? i + e : e,
			r = this._events[t];
		if (!r) return [];
		if (r.fn) return [r.fn];
		for (var n = 0, a = r.length, o = Array(a); n < a; n++) o[n] = r[n].fn;
		return o
	}, c.prototype.listenerCount = function(e) {
		var t = i ? i + e : e,
			r = this._events[t];
		return r ? r.fn ? 1 : r.length : 0
	}, c.prototype.emit = function(e, t, r, n, a, o) {
		var l = i ? i + e : e;
		if (!this._events[l]) return !1;
		var u, c, s = this._events[l],
			f = arguments.length;
		if (s.fn) {
			switch (s.once && this.removeListener(e, s.fn, void 0, !0), f) {
				case 1:
					return s.fn.call(s.context), !0;
				case 2:
					return s.fn.call(s.context, t), !0;
				case 3:
					return s.fn.call(s.context, t, r), !0;
				case 4:
					return s.fn.call(s.context, t, r, n), !0;
				case 5:
					return s.fn.call(s.context, t, r, n, a), !0;
				case 6:
					return s.fn.call(s.context, t, r, n, a, o), !0
			}
			for (c = 1, u = Array(f - 1); c < f; c++) u[c - 1] = arguments[c];
			s.fn.apply(s.context, u)
		} else {
			var h, d = s.length;
			for (c = 0; c < d; c++) switch (s[c].once && this.removeListener(e, s[c].fn, void 0, !0), f) {
				case 1:
					s[c].fn.call(s[c].context);
					break;
				case 2:
					s[c].fn.call(s[c].context, t);
					break;
				case 3:
					s[c].fn.call(s[c].context, t, r);
					break;
				case 4:
					s[c].fn.call(s[c].context, t, r, n);
					break;
				default:
					if (!u)
						for (h = 1, u = Array(f - 1); h < f; h++) u[h - 1] = arguments[h];
					s[c].fn.apply(s[c].context, u)
			}
		}
		return !0
	}, c.prototype.on = function(e, t, r) {
		return l(this, e, t, r, !1)
	}, c.prototype.once = function(e, t, r) {
		return l(this, e, t, r, !0)
	}, c.prototype.removeListener = function(e, t, r, n) {
		var a = i ? i + e : e;
		if (!this._events[a]) return this;
		if (!t) return u(this, a), this;
		var o = this._events[a];
		if (o.fn) o.fn !== t || n && !o.once || r && o.context !== r || u(this, a);
		else {
			for (var l = 0, c = [], s = o.length; l < s; l++)(o[l].fn !== t || n && !o[l].once || r && o[l].context !== r) && c.push(o[l]);
			c.length ? this._events[a] = 1 === c.length ? c[0] : c : u(this, a)
		}
		return this
	}, c.prototype.removeAllListeners = function(e) {
		var t;
		return e ? (t = i ? i + e : e, this._events[t] && u(this, t)) : (this._events = new a, this._eventsCount = 0), this
	}, c.prototype.off = c.prototype.removeListener, c.prototype.addListener = c.prototype.on, c.prefixed = i, c.EventEmitter = c, t.exports = c
}, 480038, (e, t, r) => {
	"use strict";
	var n, i = Symbol.for("react.element"),
		a = Symbol.for("react.portal"),
		o = Symbol.for("react.fragment"),
		l = Symbol.for("react.strict_mode"),
		u = Symbol.for("react.profiler"),
		c = Symbol.for("react.provider"),
		s = Symbol.for("react.context"),
		f = Symbol.for("react.server_context"),
		h = Symbol.for("react.forward_ref"),
		d = Symbol.for("react.suspense"),
		p = Symbol.for("react.suspense_list"),
		y = Symbol.for("react.memo"),
		v = Symbol.for("react.lazy"),
		m = Symbol.for("react.offscreen");

	function g(e) {
		if ("object" == typeof e && null !== e) {
			var t = e.$$typeof;
			switch (t) {
				case i:
					switch (e = e.type) {
						case o:
						case u:
						case l:
						case d:
						case p:
							return e;
						default:
							switch (e = e && e.$$typeof) {
								case f:
								case s:
								case h:
								case v:
								case y:
								case c:
									return e;
								default:
									return t
							}
					}
				case a:
					return t
			}
		}
	}
	n = Symbol.for("react.module.reference"), r.ContextConsumer = s, r.ContextProvider = c, r.Element = i, r.ForwardRef = h, r.Fragment = o, r.Lazy = v, r.Memo = y, r.Portal = a, r.Profiler = u, r.StrictMode = l, r.Suspense = d, r.SuspenseList = p, r.isAsyncMode = function() {
		return !1
	}, r.isConcurrentMode = function() {
		return !1
	}, r.isContextConsumer = function(e) {
		return g(e) === s
	}, r.isContextProvider = function(e) {
		return g(e) === c
	}, r.isElement = function(e) {
		return "object" == typeof e && null !== e && e.$$typeof === i
	}, r.isForwardRef = function(e) {
		return g(e) === h
	}, r.isFragment = function(e) {
		return g(e) === o
	}, r.isLazy = function(e) {
		return g(e) === v
	}, r.isMemo = function(e) {
		return g(e) === y
	}, r.isPortal = function(e) {
		return g(e) === a
	}, r.isProfiler = function(e) {
		return g(e) === u
	}, r.isStrictMode = function(e) {
		return g(e) === l
	}, r.isSuspense = function(e) {
		return g(e) === d
	}, r.isSuspenseList = function(e) {
		return g(e) === p
	}, r.isValidElementType = function(e) {
		return "string" == typeof e || "function" == typeof e || e === o || e === u || e === l || e === d || e === p || e === m || "object" == typeof e && null !== e && (e.$$typeof === v || e.$$typeof === y || e.$$typeof === c || e.$$typeof === s || e.$$typeof === h || e.$$typeof === n || void 0 !== e.getModuleId) || !1
	}, r.typeOf = g
}, 87683, (e, t, r) => {
	"use strict";
	e.i(914374), t.exports = e.r(480038)
}, 592434, (e, t, r) => {
	"use strict";
	var n = e.r(170380),
		i = "function" == typeof Object.is ? Object.is : function(e, t) {
			return e === t && (0 !== e || 1 / e == 1 / t) || e != e && t != t
		},
		a = n.useSyncExternalStore,
		o = n.useRef,
		l = n.useEffect,
		u = n.useMemo,
		c = n.useDebugValue;
	r.useSyncExternalStoreWithSelector = function(e, t, r, n, s) {
		var f = o(null);
		if (null === f.current) {
			var h = {
				hasValue: !1,
				value: null
			};
			f.current = h
		} else h = f.current;
		var d = a(e, (f = u(function() {
			function e(e) {
				if (!l) {
					if (l = !0, a = e, e = n(e), void 0 !== s && h.hasValue) {
						var t = h.value;
						if (s(t, e)) return o = t
					}
					return o = e
				}
				if (t = o, i(a, e)) return t;
				var r = n(e);
				return void 0 !== s && s(t, r) ? (a = e, t) : (a = e, o = r)
			}
			var a, o, l = !1,
				u = void 0 === r ? null : r;
			return [function() {
				return e(t())
			}, null === u ? void 0 : function() {
				return e(u())
			}]
		}, [t, r, n, s]))[0], f[1]);
		return l(function() {
			h.hasValue = !0, h.value = d
		}, [d]), c(d), d
	}
}, 807781, (e, t, r) => {
	"use strict";
	e.i(914374), t.exports = e.r(592434)
}]);