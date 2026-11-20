(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 380491, 373677, 833867, e => {
	"use strict";
	var t = e.i(234984),
		n = e.i(582018),
		r = e.i(170380),
		o = e.i(716455);

	function i(e, [t, n]) {
		return Math.min(n, Math.max(t, e))
	}(0, Object.defineProperty)(i, "name", {
		value: "clamp",
		configurable: !0
	});
	var l = e.i(317607),
		a = e.i(962067),
		s = e.i(954264),
		c = e.i(653132),
		u = e.i(624894),
		f = e.i(352087),
		d = e.i(177343),
		p = e.i(865155),
		h = e.i(48150),
		m = e.i(953074),
		g = e.i(812905),
		v = e.i(661530),
		y = e.i(378329),
		x = e.i(427658),
		w = e.i(167656),
		b = e.i(82798),
		S = e.i(794371),
		C = e.i(959920),
		R = e.i(73772),
		j = e.i(885961),
		P = Object.defineProperty,
		k = (e, t) => P(e, "name", {
			value: t,
			configurable: !0
		}),
		O = [" ", "Enter", "ArrowUp", "ArrowDown"],
		T = [" ", "Enter"],
		E = "Select",
		[A, D, I] = (0, a.f)(E),
		[L, M] = (0, c.f)(E, [I, m.y]),
		N = (0, m.y)(),
		[_, z] = L(E),
		[V, H] = L(E);

	function B(e) {
		let {
			__scopeSelect: n,
			children: o,
			open: i,
			defaultOpen: l,
			onOpenChange: a,
			value: s,
			defaultValue: c,
			onValueChange: f,
			dir: d,
			name: p,
			autoComplete: g,
			disabled: v,
			required: y,
			form: x,
			internal_do_not_use_render: w
		} = e, S = N(n), [C, R] = r.useState(null), [j, P] = r.useState(null), [O, T] = r.useState(!1), D = (0, u.f)(d), [I, L] = (0, b.f)({
			prop: i,
			defaultProp: l ?? !1,
			onChange: a,
			caller: E
		}), [M, z] = (0, b.f)({
			prop: s,
			defaultProp: c,
			onChange: f,
			caller: E
		}), H = r.useRef(null), B = r.useRef(!1), [F, W] = r.useState(null), U = k(e => {
			W({
				value: e,
				hasConsumerStoppedPropagation: B.current
			}), z(e)
		}, "handleUserSelect"), $ = r.useRef(M);
		r.useEffect(() => {
			let e = x ? C?.ownerDocument.getElementById(x) : C?.form;
			if (e instanceof HTMLFormElement) {
				let t = k(() => z($.current), "reset");
				return e.addEventListener("reset", t), () => e.removeEventListener("reset", t)
			}
		}, [x, C, z]);
		let K = !C || !!x || !!C.closest("form"),
			[q, Y] = r.useState(new Set),
			G = (0, h.f)(),
			X = Array.from(q).map(e => e.props.value).join(";"),
			Z = r.useCallback(e => {
				Y(t => new Set(t).add(e))
			}, []),
			Q = r.useCallback(e => {
				Y(t => {
					let n = new Set(t);
					return n.delete(e), n
				})
			}, []),
			J = {
				required: y,
				trigger: C,
				onTriggerChange: R,
				valueNode: j,
				onValueNodeChange: P,
				valueNodeHasChildren: O,
				onValueNodeHasChildrenChange: T,
				contentId: G,
				value: M,
				onValueChange: z,
				hasConsumerStoppedPropagationRef: B,
				userSelection: F,
				onUserSelect: U,
				open: I,
				onOpenChange: L,
				dir: D,
				triggerPointerDownPosRef: H,
				disabled: v,
				name: p,
				autoComplete: g,
				form: x,
				nativeOptions: q,
				nativeSelectKey: X,
				isFormControl: K
			};
		return (0, t.jsx)(m.F, {
			...S,
			children: (0, t.jsx)(_, {
				scope: n,
				...J,
				children: (0, t.jsx)(A.Provider, {
					scope: n,
					children: (0, t.jsx)(V, {
						scope: n,
						onNativeOptionAdd: Z,
						onNativeOptionRemove: Q,
						children: eP(w) ? w(J) : o
					})
				})
			})
		})
	}
	k(B, "SelectProvider");
	var F = k(e => {
			let {
				__scopeSelect: n,
				children: r,
				...o
			} = e;
			return (0, t.jsx)(B, {
				__scopeSelect: n,
				...o,
				internal_do_not_use_render: ({
					isFormControl: e
				}) => (0, t.jsxs)(t.Fragment, {
					children: [r, e ? (0, t.jsx)(ej, {
						__scopeSelect: n
					}) : null]
				})
			})
		}, "Select"),
		W = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				disabled: i = !1,
				...a
			} = e, c = N(o), u = z("SelectTrigger", o), f = u.disabled || i, d = (0, s.f)(n, u.onTriggerChange), p = D(o), h = r.useRef("touch"), [g, v, x] = eO(e => {
				let t = p().filter(e => !e.disabled),
					n = t.find(e => e.value === u.value),
					r = eT(t, e, n);
				void 0 !== r && u.onUserSelect(r.value)
			}), w = k(e => {
				f || (u.onOpenChange(!0), x()), e && (u.triggerPointerDownPosRef.current = {
					x: Math.round(e.pageX),
					y: Math.round(e.pageY)
				})
			}, "handleOpen");
			return (0, t.jsx)(m.g, {
				asChild: !0,
				...c,
				children: (0, t.jsx)(y.V.button, {
					type: "button",
					role: "combobox",
					"aria-controls": u.open ? u.contentId : void 0,
					"aria-expanded": u.open,
					"aria-required": u.required,
					"aria-autocomplete": "none",
					dir: u.dir,
					"data-state": u.open ? "open" : "closed",
					disabled: f,
					"data-disabled": f ? "" : void 0,
					"data-placeholder": ek(u.value) ? "" : void 0,
					...a,
					ref: d,
					onClick: (0, l.f)(a.onClick, e => {
						e.currentTarget.focus(), "mouse" !== h.current && w(e)
					}),
					onPointerDown: (0, l.f)(a.onPointerDown, e => {
						h.current = e.pointerType;
						let t = e.target;
						t.hasPointerCapture(e.pointerId) && t.releasePointerCapture(e.pointerId), 0 === e.button && !1 === e.ctrlKey && "mouse" === e.pointerType && (w(e), e.preventDefault())
					}),
					onKeyDown: (0, l.f)(a.onKeyDown, e => {
						let t = "" !== g.current;
						e.ctrlKey || e.altKey || e.metaKey || 1 !== e.key.length || (u.hasConsumerStoppedPropagationRef.current = e.isPropagationStopped(), v(e.key)), (!t || " " !== e.key) && O.includes(e.key) && (w(), e.preventDefault())
					})
				})
			})
		}, "SelectTrigger")),
		U = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				className: i,
				style: l,
				children: a,
				placeholder: c = "",
				...u
			} = e, f = z("SelectValue", o), {
				onValueNodeHasChildrenChange: d
			} = f, p = void 0 !== a, h = (0, s.f)(n, f.onValueNodeChange);
			(0, S.f)(() => {
				d(p)
			}, [d, p]);
			let m = ek(f.value);
			return (0, t.jsx)(y.V.span, {
				...u,
				asChild: !m && u.asChild,
				ref: h,
				style: {
					pointerEvents: "none"
				},
				children: (0, t.jsx)(r.Fragment, {
					children: m ? c : a
				}, m ? "placeholder" : "value")
			})
		}, "SelectValue")),
		$ = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				children: o,
				...i
			} = e;
			return (0, t.jsx)(y.V.span, {
				"aria-hidden": !0,
				...i,
				ref: n,
				children: o || "▼"
			})
		}, "SelectIcon")),
		[K, q] = L("SelectPortal", {
			forceMount: void 0
		}),
		Y = k(e => {
			let {
				__scopeSelect: n,
				forceMount: r,
				...o
			} = e;
			return (0, t.jsx)(K, {
				scope: e.__scopeSelect,
				forceMount: r,
				children: (0, t.jsx)(g.f, {
					asChild: !0,
					...o
				})
			})
		}, "SelectPortal"),
		G = "SelectContent",
		X = r.forwardRef(k(function(e, n) {
			let o = q(G, e.__scopeSelect),
				{
					forceMount: i = o.forceMount,
					...l
				} = e,
				a = z(G, e.__scopeSelect),
				[s, c] = r.useState();
			return (0, S.f)(() => {
				c(new DocumentFragment)
			}, []), (0, t.jsx)(v.f, {
				present: i || a.open,
				children: ({
					present: e
				}) => e ? (0, t.jsx)(et, {
					...l,
					ref: n
				}) : (0, t.jsx)(Z, {
					...l,
					fragment: s
				})
			})
		}, "SelectContent")),
		Z = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				children: i,
				fragment: l
			} = e;
			return l ? o.createPortal((0, t.jsx)(Q, {
				scope: r,
				children: (0, t.jsx)(A.Slot, {
					scope: r,
					children: (0, t.jsx)("div", {
						ref: n,
						children: i
					})
				})
			}), l) : null
		}, "SelectContentFragment")),
		[Q, J] = L(G),
		ee = (0, x.B)("SelectContent.RemoveScroll"),
		et = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o
			} = e, {
				position: i = "item-aligned",
				onCloseAutoFocus: a,
				onEscapeKeyDown: c,
				onPointerDownOutside: u,
				side: h,
				sideOffset: m,
				align: g,
				alignOffset: v,
				arrowPadding: y,
				collisionBoundary: x,
				collisionPadding: w,
				sticky: b,
				hideWhenDetached: S,
				avoidCollisions: C,
				...P
			} = e, O = z(G, o), [T, E] = r.useState(null), [A, I] = r.useState(null), L = (0, s.f)(n, E), [M, N] = r.useState(null), [_, V] = r.useState(null), H = D(o), [B, F] = r.useState(!1), W = r.useRef(!1), U = r.useRef(!1), $ = r.useRef(!1);
			r.useEffect(() => {
				if (T) return (0, R.f)(T)
			}, [T]), (0, d.f)();
			let K = r.useCallback(e => {
					let [t, ...n] = H().map(e => e.ref.current), [r] = n.slice(-1), o = document.activeElement;
					for (let n of e)
						if (n === o || (n?.scrollIntoView({
								block: "nearest"
							}), n === t && A && (A.scrollTop = 0), n === r && A && (A.scrollTop = A.scrollHeight), n?.focus(), document.activeElement !== o)) return
				}, [H, A]),
				q = r.useCallback(() => K([M, T]), [K, M, T]);
			r.useEffect(() => {
				B && q()
			}, [B, q]);
			let {
				onOpenChange: Y,
				triggerPointerDownPosRef: X
			} = O;
			r.useEffect(() => {
				if (T) {
					let e = {
							x: 0,
							y: 0
						},
						t = k(t => {
							e = {
								x: Math.abs(Math.round(t.pageX) - (X.current?.x ?? 0)),
								y: Math.abs(Math.round(t.pageY) - (X.current?.y ?? 0))
							}
						}, "handlePointerMove"),
						n = k(n => {
							e.x <= 10 && e.y <= 10 ? n.preventDefault() : n.composedPath().includes(T) || Y(!1), document.removeEventListener("pointermove", t), X.current = null
						}, "handlePointerUp");
					return null !== X.current && (document.addEventListener("pointermove", t), document.addEventListener("pointerup", n, {
						capture: !0,
						once: !0
					})), () => {
						document.removeEventListener("pointermove", t), document.removeEventListener("pointerup", n, {
							capture: !0
						})
					}
				}
			}, [T, Y, X]), r.useEffect(() => {
				let e = k(() => Y(!1), "close");
				return window.addEventListener("blur", e), window.addEventListener("resize", e), () => {
					window.removeEventListener("blur", e), window.removeEventListener("resize", e)
				}
			}, [Y]);
			let [Z, J] = eO(e => {
				let t = H().filter(e => !e.disabled),
					n = t.find(e => e.ref.current === document.activeElement),
					r = eT(t, e, n);
				r && setTimeout(() => r.ref.current?.focus())
			}), et = r.useCallback((e, t, n) => {
				let r = !U.current;
				r && (U.current = !0);
				let o = !W.current && !n;
				void 0 !== O.value && O.value === t || o ? (N(e), o && (W.current = !0)) : r && N(e)
			}, [O.value]), eo = r.useCallback(() => T?.focus(), [T]), ei = r.useCallback((e, t, n) => {
				if (!e) return;
				let r = !$.current;
				r && ($.current = !0);
				let o = !W.current && !n;
				void 0 !== O.value && O.value === t || o ? V(e) : r && V(e)
			}, [O.value]), el = "popper" === i ? er : en;
			return (0, t.jsx)(Q, {
				scope: o,
				content: T,
				viewport: A,
				onViewportChange: I,
				itemRefCallback: et,
				selectedItem: M,
				onItemLeave: eo,
				itemTextRefCallback: ei,
				focusSelectedItem: q,
				selectedItemText: _,
				position: i,
				isPositioned: B,
				searchRef: Z,
				children: (0, t.jsx)(j.f, {
					as: ee,
					allowPinchZoom: !0,
					children: (0, t.jsx)(p.v, {
						asChild: !0,
						trapped: O.open,
						onMountAutoFocus: e => {
							e.preventDefault()
						},
						onUnmountAutoFocus: (0, l.f)(a, e => {
							O.trigger?.focus({
								preventScroll: !0
							}), e.preventDefault()
						}),
						children: (0, t.jsx)(f.V, {
							asChild: !0,
							disableOutsidePointerEvents: !0,
							onEscapeKeyDown: c,
							onPointerDownOutside: u,
							onFocusOutside: e => e.preventDefault(),
							onDismiss: () => O.onOpenChange(!1),
							children: (0, t.jsx)(el, {
								role: "listbox",
								id: O.contentId,
								"data-state": O.open ? "open" : "closed",
								dir: O.dir,
								onContextMenu: e => e.preventDefault(),
								...P,
								...el === er ? {
									side: h,
									sideOffset: m,
									align: g,
									alignOffset: v,
									arrowPadding: y,
									collisionBoundary: x,
									collisionPadding: w,
									sticky: b,
									hideWhenDetached: S,
									avoidCollisions: C
								} : {},
								onPlaced: () => F(!0),
								ref: L,
								style: {
									display: "flex",
									flexDirection: "column",
									outline: "none",
									...P.style
								},
								onKeyDown: (0, l.f)(P.onKeyDown, e => {
									let t = e.ctrlKey || e.altKey || e.metaKey;
									if ("Tab" === e.key && e.preventDefault(), t || 1 !== e.key.length || J(e.key), ["ArrowUp", "ArrowDown", "Home", "End"].includes(e.key)) {
										let t = H().filter(e => !e.disabled).map(e => e.ref.current);
										if (["ArrowUp", "End"].includes(e.key) && (t = t.slice().reverse()), ["ArrowUp", "ArrowDown"].includes(e.key)) {
											let n = e.target,
												r = t.indexOf(n);
											t = t.slice(r + 1)
										}
										setTimeout(() => K(t)), e.preventDefault()
									}
								})
							})
						})
					})
				})
			})
		}, "SelectContentImpl")),
		en = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				onPlaced: l,
				...a
			} = e, c = z(G, o), u = J(G, o), [f, d] = r.useState(null), [p, h] = r.useState(null), m = (0, s.f)(n, h), g = D(o), v = r.useRef(!1), x = r.useRef(!0), {
				viewport: w,
				selectedItem: b,
				selectedItemText: C,
				focusSelectedItem: R
			} = u, j = r.useCallback(() => {
				if (c.trigger && c.valueNode && f && p && w && b && C) {
					let e = c.trigger.getBoundingClientRect(),
						t = p.getBoundingClientRect(),
						n = c.valueNode.getBoundingClientRect(),
						r = C.getBoundingClientRect();
					if ("rtl" !== c.dir) {
						let o = r.left - t.left,
							l = n.left - o,
							a = e.left - l,
							s = e.width + a,
							c = Math.max(s, t.width),
							u = i(l, [10, Math.max(10, window.innerWidth - 10 - c)]);
						f.style.minWidth = s + "px", f.style.left = u + "px"
					} else {
						let o = t.right - r.right,
							l = window.innerWidth - n.right - o,
							a = window.innerWidth - e.right - l,
							s = e.width + a,
							c = Math.max(s, t.width),
							u = i(l, [10, Math.max(10, window.innerWidth - 10 - c)]);
						f.style.minWidth = s + "px", f.style.right = u + "px"
					}
					let o = g(),
						a = window.innerHeight - 20,
						s = w.scrollHeight,
						u = window.getComputedStyle(p),
						d = parseInt(u.borderTopWidth, 10),
						h = parseInt(u.paddingTop, 10),
						m = parseInt(u.borderBottomWidth, 10),
						y = d + h + s + parseInt(u.paddingBottom, 10) + m,
						x = Math.min(5 * b.offsetHeight, y),
						S = window.getComputedStyle(w),
						R = parseInt(S.paddingTop, 10),
						j = parseInt(S.paddingBottom, 10),
						P = e.top + e.height / 2 - 10,
						k = b.offsetHeight / 2,
						O = d + h + (b.offsetTop + k);
					if (O <= P) {
						let e = o.length > 0 && b === o[o.length - 1].ref.current;
						f.style.bottom = "0px";
						let t = Math.max(a - P, k + (e ? j : 0) + (p.clientHeight - w.offsetTop - w.offsetHeight) + m);
						f.style.height = O + t + "px"
					} else {
						let e = o.length > 0 && b === o[0].ref.current;
						f.style.top = "0px";
						let t = Math.max(P, d + w.offsetTop + (e ? R : 0) + k);
						f.style.height = t + (y - O) + "px", w.scrollTop = O - P + w.offsetTop
					}
					f.style.margin = "10px 0", f.style.minHeight = x + "px", f.style.maxHeight = a + "px", l?.(), requestAnimationFrame(() => v.current = !0)
				}
			}, [g, c.trigger, c.valueNode, f, p, w, b, C, c.dir, l]);
			(0, S.f)(() => j(), [j]);
			let [P, k] = r.useState();
			(0, S.f)(() => {
				p && k(window.getComputedStyle(p).zIndex)
			}, [p]);
			let O = r.useCallback(e => {
				e && !0 === x.current && (j(), R?.(), x.current = !1)
			}, [j, R]);
			return (0, t.jsx)(eo, {
				scope: o,
				contentWrapper: f,
				shouldExpandOnScrollRef: v,
				onScrollButtonChange: O,
				children: (0, t.jsx)("div", {
					ref: d,
					style: {
						display: "flex",
						flexDirection: "column",
						position: "fixed",
						zIndex: P
					},
					children: (0, t.jsx)(y.V.div, {
						...a,
						ref: m,
						style: {
							boxSizing: "border-box",
							maxHeight: "100%",
							...a.style
						}
					})
				})
			})
		}, "SelectItemAlignedPosition")),
		er = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				align: o = "start",
				collisionPadding: i = 10,
				...l
			} = e, a = N(r);
			return (0, t.jsx)(m.c, {
				...a,
				...l,
				ref: n,
				align: o,
				collisionPadding: i,
				style: {
					boxSizing: "border-box",
					...l.style,
					"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
					"--radix-select-content-available-width": "var(--radix-popper-available-width)",
					"--radix-select-content-available-height": "var(--radix-popper-available-height)",
					"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
					"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
				}
			})
		}, "SelectPopperPosition")),
		[eo, ei] = L(G, {}),
		el = "SelectViewport",
		ea = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				nonce: i,
				...a
			} = e, c = J(el, o), u = ei(el, o), f = (0, s.f)(n, c.onViewportChange), d = r.useRef(0);
			return (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)("style", {
					dangerouslySetInnerHTML: {
						__html: "[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}"
					},
					nonce: i
				}), (0, t.jsx)(A.Slot, {
					scope: o,
					children: (0, t.jsx)(y.V.div, {
						"data-radix-select-viewport": "",
						role: "presentation",
						...a,
						ref: f,
						style: {
							position: "relative",
							flex: 1,
							overflow: "hidden auto",
							...a.style
						},
						onScroll: (0, l.f)(a.onScroll, e => {
							let t = e.currentTarget,
								{
									contentWrapper: n,
									shouldExpandOnScrollRef: r
								} = u;
							if (r?.current && n) {
								let e = Math.abs(d.current - t.scrollTop);
								if (e > 0) {
									let r = window.innerHeight - 20,
										o = Math.max(parseFloat(n.style.minHeight), parseFloat(n.style.height));
									if (o < r) {
										let i = o + e,
											l = Math.min(r, i),
											a = i - l;
										n.style.height = l + "px", "0px" === n.style.bottom && (t.scrollTop = a > 0 ? a : 0, n.style.justifyContent = "flex-end")
									}
								}
							}
							d.current = t.scrollTop
						})
					})
				})]
			})
		}, "SelectViewport")),
		[es, ec] = L("SelectGroup"),
		eu = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				...o
			} = e, i = (0, h.f)();
			return (0, t.jsx)(es, {
				scope: r,
				id: i,
				children: (0, t.jsx)(y.V.div, {
					role: "group",
					"aria-labelledby": i,
					...o,
					ref: n
				})
			})
		}, "SelectGroup")),
		ef = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				...o
			} = e, i = ec("SelectLabel", r);
			return (0, t.jsx)(y.V.div, {
				id: i.id,
				...o,
				ref: n
			})
		}, "SelectLabel")),
		ed = "SelectItem",
		[ep, eh] = L(ed),
		em = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				value: i,
				disabled: a = !1,
				textValue: c,
				...u
			} = e, f = z(ed, o), d = J(ed, o), p = f.value === i, [m, g] = r.useState(c ?? ""), [v, x] = r.useState(!1), b = (0, w.f)(e => d.itemRefCallback?.(e, i, a)), S = (0, s.f)(n, b), C = (0, h.f)(), R = r.useRef("touch");

			function j(e) {
				f.hasConsumerStoppedPropagationRef.current = e.isPropagationStopped(), f.onUserSelect(i), f.onOpenChange(!1)
			}
			return k(j, "handleSelect"), (0, t.jsx)(ep, {
				scope: o,
				value: i,
				disabled: a,
				textId: C,
				isSelected: p,
				onItemTextChange: r.useCallback(e => {
					g(t => t || (e?.textContent ?? "").trim())
				}, []),
				children: (0, t.jsx)(A.ItemSlot, {
					scope: o,
					value: i,
					disabled: a,
					textValue: m,
					children: (0, t.jsx)(y.V.div, {
						role: "option",
						"aria-labelledby": C,
						"data-highlighted": v ? "" : void 0,
						"aria-selected": p && v,
						"data-state": p ? "checked" : "unchecked",
						"aria-disabled": a || void 0,
						"data-disabled": a ? "" : void 0,
						tabIndex: a ? void 0 : -1,
						...u,
						ref: S,
						onFocus: (0, l.f)(u.onFocus, () => x(!0)),
						onBlur: (0, l.f)(u.onBlur, () => x(!1)),
						onClick: (0, l.f)(u.onClick, e => {
							a || "mouse" !== R.current && j(e)
						}),
						onPointerUp: (0, l.f)(u.onPointerUp, e => {
							a || "mouse" === R.current && j(e)
						}),
						onPointerDown: (0, l.f)(u.onPointerDown, e => {
							R.current = e.pointerType
						}),
						onPointerMove: (0, l.f)(u.onPointerMove, e => {
							R.current = e.pointerType, a ? d.onItemLeave?.() : "mouse" === R.current && e.currentTarget.focus({
								preventScroll: !0
							})
						}),
						onPointerLeave: (0, l.f)(u.onPointerLeave, e => {
							e.currentTarget === document.activeElement && d.onItemLeave?.()
						}),
						onKeyDown: (0, l.f)(u.onKeyDown, e => {
							a || e.target !== e.currentTarget || (d.searchRef?.current === "" || " " !== e.key) && (T.includes(e.key) && j(e), " " === e.key && e.preventDefault())
						})
					})
				})
			})
		}, "SelectItem")),
		eg = "SelectItemText",
		ev = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: i,
				className: l,
				style: a,
				...c
			} = e, u = z(eg, i), f = J(eg, i), d = eh(eg, i), p = H(eg, i), [h, m] = r.useState(null), g = (0, w.f)(e => f.itemTextRefCallback?.(e, d.value, d.disabled)), v = (0, s.f)(n, m, d.onItemTextChange, g), x = h?.textContent, b = r.useMemo(() => (0, t.jsx)("option", {
				value: d.value,
				disabled: d.disabled,
				children: x
			}, d.value), [d.disabled, d.value, x]), {
				onNativeOptionAdd: C,
				onNativeOptionRemove: R
			} = p;
			return (0, S.f)(() => (C(b), () => R(b)), [C, R, b]), (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(y.V.span, {
					id: d.textId,
					...c,
					ref: v
				}), d.isSelected && u.valueNode && !u.valueNodeHasChildren && !ek(u.value) ? o.createPortal(c.children, u.valueNode) : null]
			})
		}, "SelectItemText")),
		ey = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				...o
			} = e;
			return eh("SelectItemIndicator", r).isSelected ? (0, t.jsx)(y.V.span, {
				"aria-hidden": !0,
				...o,
				ref: n
			}) : null
		}, "SelectItemIndicator")),
		ex = "SelectScrollUpButton",
		ew = r.forwardRef(k(function(e, n) {
			let o = J(ex, e.__scopeSelect),
				i = ei(ex, e.__scopeSelect),
				[l, a] = r.useState(!1),
				c = (0, s.f)(n, i.onScrollButtonChange);
			return (0, S.f)(() => {
				if (o.viewport && o.isPositioned) {
					let e = function() {
						a(t.scrollTop > 0)
					};
					k(e, "handleScroll");
					let t = o.viewport;
					return e(), t.addEventListener("scroll", e), () => t.removeEventListener("scroll", e)
				}
			}, [o.viewport, o.isPositioned]), l ? (0, t.jsx)(eC, {
				...e,
				ref: c,
				onAutoScroll: () => {
					let {
						viewport: e,
						selectedItem: t
					} = o;
					e && t && (e.scrollTop = e.scrollTop - t.offsetHeight)
				}
			}) : null
		}, "SelectScrollUpButton")),
		eb = "SelectScrollDownButton",
		eS = r.forwardRef(k(function(e, n) {
			let o = J(eb, e.__scopeSelect),
				i = ei(eb, e.__scopeSelect),
				[l, a] = r.useState(!1),
				c = (0, s.f)(n, i.onScrollButtonChange);
			return (0, S.f)(() => {
				if (o.viewport && o.isPositioned) {
					let e = function() {
						let e = t.scrollHeight - t.clientHeight;
						a(Math.ceil(t.scrollTop) < e)
					};
					k(e, "handleScroll");
					let t = o.viewport;
					return e(), t.addEventListener("scroll", e), () => t.removeEventListener("scroll", e)
				}
			}, [o.viewport, o.isPositioned]), l ? (0, t.jsx)(eC, {
				...e,
				ref: c,
				onAutoScroll: () => {
					let {
						viewport: e,
						selectedItem: t
					} = o;
					e && t && (e.scrollTop = e.scrollTop + t.offsetHeight)
				}
			}) : null
		}, "SelectScrollDownButton")),
		eC = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: o,
				onAutoScroll: i,
				...a
			} = e, s = J("SelectScrollButton", o), c = r.useRef(null), u = D(o), f = r.useCallback(() => {
				null !== c.current && (window.clearInterval(c.current), c.current = null)
			}, []);
			return r.useEffect(() => () => f(), [f]), (0, S.f)(() => {
				let e = u().find(e => e.ref.current === document.activeElement);
				e?.ref.current?.scrollIntoView({
					block: "nearest"
				})
			}, [u]), (0, t.jsx)(y.V.div, {
				"aria-hidden": !0,
				...a,
				ref: n,
				style: {
					flexShrink: 0,
					...a.style
				},
				onPointerDown: (0, l.f)(a.onPointerDown, () => {
					null === c.current && (c.current = window.setInterval(i, 50))
				}),
				onPointerMove: (0, l.f)(a.onPointerMove, () => {
					s.onItemLeave?.(), null === c.current && (c.current = window.setInterval(i, 50))
				}),
				onPointerLeave: (0, l.f)(a.onPointerLeave, () => {
					f()
				})
			})
		}, "SelectScrollButtonImpl")),
		eR = r.forwardRef(k(function(e, n) {
			let {
				__scopeSelect: r,
				...o
			} = e;
			return (0, t.jsx)(y.V.div, {
				"aria-hidden": !0,
				...o,
				ref: n
			})
		}, "SelectSeparator")),
		ej = r.forwardRef(k(function({
			__scopeSelect: e,
			...n
		}, o) {
			let i = z("SelectBubbleInput", e),
				{
					value: l,
					onValueChange: a,
					required: c,
					disabled: u,
					name: f,
					autoComplete: d,
					form: p,
					userSelection: h
				} = i,
				{
					nativeOptions: m,
					nativeSelectKey: g
				} = i,
				v = r.useRef(null),
				x = (0, s.f)(o, v),
				w = l ?? "",
				b = r.useRef(w),
				S = r.useRef(h),
				R = r.useRef(!1),
				j = Array.from(m).some(e => (e.props.value ?? "") === "");
			return r.useEffect(() => {
				let e = v.current;
				if (!e) return;
				let t = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, "value").set,
					n = null !== h && h !== S.current;
				S.current = h;
				let r = b.current !== w;
				if (b.current = w, n && !r && h.value !== w && !h.hasConsumerStoppedPropagation && t) {
					R.current = !0;
					try {
						t.call(e, h.value), e.dispatchEvent(new Event("change", {
							bubbles: !0
						}))
					} finally {
						R.current = !1, t.call(e, w)
					}
					return
				}
				let o = n && r && !h.hasConsumerStoppedPropagation;
				if (r && t) {
					let n = new Event("change", {
						bubbles: o
					});
					t.call(e, w), e.dispatchEvent(n)
				}
			}, [w, h]), (0, t.jsxs)(y.V.select, {
				"aria-hidden": !0,
				required: c,
				tabIndex: -1,
				name: f,
				autoComplete: d,
				disabled: u,
				form: p,
				onChange: e => {
					R.current || a(e.target.value)
				},
				...n,
				style: {
					...C.u,
					...n.style
				},
				ref: x,
				defaultValue: w,
				children: [ek(l) && !j ? (0, t.jsx)("option", {
					value: ""
				}) : null, Array.from(m)]
			}, g)
		}, "SelectBubbleInput"));

	function eP(e) {
		return "function" == typeof e
	}

	function ek(e) {
		return "" === e || void 0 === e
	}

	function eO(e) {
		let t = (0, w.f)(e),
			n = r.useRef(""),
			o = r.useRef(0),
			i = r.useCallback(e => {
				let r = n.current + e;

				function i(e) {
					n.current = e, window.clearTimeout(o.current), "" !== e && (o.current = window.setTimeout(() => i(""), 1e3))
				}
				t(r), k(i, "updateSearch"), i(r)
			}, [t]),
			l = r.useCallback(() => {
				n.current = "", window.clearTimeout(o.current)
			}, []);
		return r.useEffect(() => () => window.clearTimeout(o.current), []), [n, i, l]
	}

	function eT(e, t, n) {
		let r = t.length > 1 && Array.from(t).every(e => e === t[0]) ? t[0] : t,
			o = n ? e.indexOf(n) : -1,
			i = eE(e, Math.max(o, 0));
		1 === r.length && (i = i.filter(e => e !== n));
		let l = i.find(e => e.textValue.toLowerCase().startsWith(r.toLowerCase()));
		return l !== n ? l : void 0
	}

	function eE(e, t) {
		return e.map((n, r) => e[(t + r) % e.length])
	}
	k(eP, "isFunction"), k(ek, "shouldShowPlaceholder"), k(eO, "useTypeaheadSearch"), k(eT, "findNextItem"), k(eE, "wrapArray"), e.s(["c", 0, X, "x", 0, eu, "W", 0, $, "M", 0, em, "j", 0, ey, "s", 0, ev, "Q", 0, ef, "z", 0, Y, "F", 0, F, "t", 0, eS, "Z", 0, ew, "g", 0, eR, "d", 0, W, "A", 0, U, "n", 0, ea], 373677);
	var eA = e.i(294237),
		eD = e.i(995102),
		eI = e.i(695657),
		eI = eI,
		eL = e.i(55e3);
	let eM = {
		name: "chevron-up",
		size: 24,
		node: [
			["path", {
				d: "m18 15-6-6-6 6",
				key: "153udz"
			}]
		]
	};
	eM.node;
	let eN = (0, eL.f)(eM);
	e.s(["f", 0, eN], 833867);
	var e_ = e.i(818036);
	let ez = (0, eA.f)("bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md", {
			variants: {
				variant: {
					default: "",
					dark: "bg-card border-none"
				}
			},
			defaultVariants: {
				variant: "default"
			}
		}),
		eV = (0, eA.f)("[&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2", {
			variants: {
				variant: {
					default: "focus:bg-accent focus:text-accent-foreground py-1.5",
					dark: "data-[state=checked]:bg-background data-[state=checked]:text-foreground text-muted-foreground hover:bg-background/50 focus:bg-background/50 py-2.5"
				}
			},
			defaultVariants: {
				variant: "default"
			}
		}),
		eH = (0, eA.f)("flex w-fit items-center justify-between gap-2 whitespace-nowrap transition-[color,box-shadow] outline-none data-[placeholder]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
			variants: {
				variant: {
					default: "rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs dark:bg-input/30 dark:hover:bg-input/50 [&_svg:not([class*='text-'])]:text-muted-foreground",
					pill: "rounded-full bg-card px-3 text-sm font-medium text-foreground hover:bg-muted [&_svg:not([class*='text-'])]:text-foreground"
				}
			},
			defaultVariants: {
				variant: "default"
			}
		});

	function eB(e) {
		let r, o, i, l, a, s = (0, n.c)(9);
		return s[0] !== e ? ({
			className: r,
			...o
		} = e, s[0] = e, s[1] = r, s[2] = o) : (r = s[1], o = s[2]), s[3] !== r ? (i = (0, e_.c)("flex cursor-default items-center justify-center py-1", r), s[3] = r, s[4] = i) : i = s[4], s[5] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)(eN, {
			className: "size-4"
		}), s[5] = l) : l = s[5], s[6] !== o || s[7] !== i ? (a = (0, t.jsx)(ew, {
			"data-slot": "select-scroll-up-button",
			className: i,
			...o,
			children: l
		}), s[6] = o, s[7] = i, s[8] = a) : a = s[8], a
	}

	function eF(e) {
		let r, o, i, l, a, s = (0, n.c)(9);
		return s[0] !== e ? ({
			className: r,
			...o
		} = e, s[0] = e, s[1] = r, s[2] = o) : (r = s[1], o = s[2]), s[3] !== r ? (i = (0, e_.c)("flex cursor-default items-center justify-center py-1", r), s[3] = r, s[4] = i) : i = s[4], s[5] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)(eI.f, {
			className: "size-4"
		}), s[5] = l) : l = s[5], s[6] !== o || s[7] !== i ? (a = (0, t.jsx)(eS, {
			"data-slot": "select-scroll-down-button",
			className: i,
			...o,
			children: l
		}), s[6] = o, s[7] = i, s[8] = a) : a = s[8], a
	}
	e.s(["d", 0, function(e) {
		let r, o, i = (0, n.c)(4);
		return i[0] !== e ? ({
			...r
		} = e, i[0] = e, i[1] = r) : r = i[1], i[2] !== r ? (o = (0, t.jsx)(F, {
			"data-slot": "select",
			...r
		}), i[2] = r, i[3] = o) : o = i[3], o
	}, "r", 0, function(e) {
		let r, o, i, l, a, s, c, u, f, d, p, h = (0, n.c)(22);
		h[0] !== e ? ({
			className: o,
			children: r,
			position: l,
			variant: a,
			...i
		} = e, h[0] = e, h[1] = r, h[2] = o, h[3] = i, h[4] = l, h[5] = a) : (r = h[1], o = h[2], i = h[3], l = h[4], a = h[5]);
		let m = void 0 === l ? "popper" : l;
		h[6] !== o || h[7] !== m || h[8] !== a ? (s = (0, e_.c)(ez({
			variant: a
		}), "popper" === m && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", o), h[6] = o, h[7] = m, h[8] = a, h[9] = s) : s = h[9], h[10] === Symbol.for("react.memo_cache_sentinel") ? (c = (0, t.jsx)(eB, {}), h[10] = c) : c = h[10];
		let g = "popper" === m && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1";
		return h[11] !== g ? (u = (0, e_.c)("p-1", g), h[11] = g, h[12] = u) : u = h[12], h[13] !== r || h[14] !== u ? (f = (0, t.jsx)(ea, {
			className: u,
			children: r
		}), h[13] = r, h[14] = u, h[15] = f) : f = h[15], h[16] === Symbol.for("react.memo_cache_sentinel") ? (d = (0, t.jsx)(eF, {}), h[16] = d) : d = h[16], h[17] !== m || h[18] !== i || h[19] !== s || h[20] !== f ? (p = (0, t.jsx)(Y, {
			children: (0, t.jsxs)(X, {
				"data-slot": "select-content",
				translate: "no",
				className: s,
				position: m,
				...i,
				children: [c, f, d]
			})
		}), h[17] = m, h[18] = i, h[19] = s, h[20] = f, h[21] = p) : p = h[21], p
	}, "T", 0, function(e) {
		let r, o, i, l, a, s, c, u, f = (0, n.c)(15);
		return f[0] !== e ? ({
			className: o,
			variant: l,
			children: r,
			...i
		} = e, f[0] = e, f[1] = r, f[2] = o, f[3] = i, f[4] = l) : (r = f[1], o = f[2], i = f[3], l = f[4]), f[5] !== o || f[6] !== l ? (a = (0, e_.c)(eV({
			variant: l
		}), o), f[5] = o, f[6] = l, f[7] = a) : a = f[7], f[8] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)("span", {
			className: "absolute right-2 flex size-3.5 items-center justify-center",
			children: (0, t.jsx)(ey, {
				children: (0, t.jsx)(eD.f, {
					className: "size-4"
				})
			})
		}), f[8] = s) : s = f[8], f[9] !== r ? (c = (0, t.jsx)(ev, {
			children: (0, t.jsx)("span", {
				children: r
			})
		}), f[9] = r, f[10] = c) : c = f[10], f[11] !== i || f[12] !== a || f[13] !== c ? (u = (0, t.jsxs)(em, {
			"data-slot": "select-item",
			translate: "no",
			className: a,
			...i,
			children: [s, c]
		}), f[11] = i, f[12] = a, f[13] = c, f[14] = u) : u = f[14], u
	}, "P", 0, function(e) {
		let r, o, i, l, a, s, c, u, f = (0, n.c)(15);
		f[0] !== e ? ({
			className: o,
			size: l,
			variant: a,
			children: r,
			...i
		} = e, f[0] = e, f[1] = r, f[2] = o, f[3] = i, f[4] = l, f[5] = a) : (r = f[1], o = f[2], i = f[3], l = f[4], a = f[5]);
		let d = void 0 === l ? "default" : l;
		return f[6] !== o || f[7] !== a ? (s = (0, e_.c)(eH({
			variant: a
		}), o), f[6] = o, f[7] = a, f[8] = s) : s = f[8], f[9] === Symbol.for("react.memo_cache_sentinel") ? (c = (0, t.jsx)($, {
			asChild: !0,
			children: (0, t.jsx)(eI.f, {
				className: "size-4 opacity-50"
			})
		}), f[9] = c) : c = f[9], f[10] !== r || f[11] !== i || f[12] !== d || f[13] !== s ? (u = (0, t.jsxs)(W, {
			"data-slot": "select-trigger",
			"data-size": d,
			translate: "no",
			className: s,
			...i,
			children: [r, c]
		}), f[10] = r, f[11] = i, f[12] = d, f[13] = s, f[14] = u) : u = f[14], u
	}, "U", 0, function(e) {
		let r, o, i = (0, n.c)(4);
		return i[0] !== e ? ({
			...r
		} = e, i[0] = e, i[1] = r) : r = i[1], i[2] !== r ? (o = (0, t.jsx)(U, {
			"data-slot": "select-value",
			...r
		}), i[2] = r, i[3] = o) : o = i[3], o
	}], 380491)
}, 962067, 624894, 695657, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(653132),
		r = e.i(954264),
		o = e.i(427658),
		i = e.i(234984),
		l = e.i(794371),
		a = Object.defineProperty,
		s = (e, t) => a(e, "name", {
			value: t,
			configurable: !0
		});

	function c(e) {
		let l = e + "CollectionProvider",
			[a, c] = (0, n.f)(l),
			[u, f] = a(l, {
				collectionRef: {
					current: null
				},
				itemMap: new Map
			}),
			d = s(e => {
				let {
					scope: n,
					children: r
				} = e, o = t.useRef(null), l = t.useRef(new Map).current;
				return (0, i.jsx)(u, {
					scope: n,
					itemMap: l,
					collectionRef: o,
					children: r
				})
			}, "CollectionProvider");
		d.displayName = l;
		let p = e + "CollectionSlot",
			h = (0, o.B)(p),
			m = t.forwardRef((e, t) => {
				let {
					scope: n,
					children: o
				} = e, l = f(p, n), a = (0, r.f)(t, l.collectionRef);
				return (0, i.jsx)(h, {
					ref: a,
					children: o
				})
			});
		m.displayName = p;
		let g = e + "CollectionItemSlot",
			v = "data-radix-collection-item",
			y = (0, o.B)(g),
			x = t.forwardRef((e, n) => {
				let {
					scope: o,
					children: l,
					...a
				} = e, s = t.useRef(null), c = (0, r.f)(n, s), u = f(g, o);
				return t.useEffect(() => (u.itemMap.set(s, {
					ref: s,
					...a
				}), () => void u.itemMap.delete(s))), (0, i.jsx)(y, {
					...{
						[v]: ""
					},
					ref: c,
					children: l
				})
			});

		function w(n) {
			let r = f(e + "CollectionConsumer", n);
			return t.useCallback(() => {
				let e = r.collectionRef.current;
				if (!e) return [];
				let t = Array.from(e.querySelectorAll(`[${v}]`));
				return Array.from(r.itemMap.values()).sort((e, n) => t.indexOf(e.ref.current) - t.indexOf(n.ref.current))
			}, [r.collectionRef, r.itemMap])
		}
		return x.displayName = g, s(w, "useCollection"), [{
			Provider: d,
			Slot: m,
			ItemSlot: x
		}, w, c]
	}
	s(c, "createCollection");
	var u = new WeakMap,
		f = class e extends Map {
			static {
				s(this, "OrderedDict")
			}
			#e;
			constructor(e) {
				super(e), this.#e = [...super.keys()], u.set(this, !0)
			}
			set(e, t) {
				return u.get(this) && !this.has(e) && this.#e.push(e), super.set(e, t), this
			}
			insert(e, t, n) {
				let r = this.has(t),
					o = r ? this.size : this.size + 1,
					i = h(e),
					l = i >= 0 ? Math.min(i, o - 1) : Math.max(o + i, 0);
				if (r ? this.#e.indexOf(t) === l : l === this.size) return this.set(t, n), this;
				let a = this.#e.filter(e => e !== t);
				a.splice(l, 0, t);
				let s = a.map(e => [e, e === t ? n : this.get(e)]);
				for (let [e, t] of(this.clear(), s)) this.set(e, t);
				return this
			}
			with(t, n, r) {
				let o = new e(this);
				return o.insert(t, n, r), o
			}
			before(e) {
				let t = this.#e.indexOf(e) - 1;
				if (!(t < 0)) return this.entryAt(t)
			}
			setBefore(e, t, n) {
				let r = this.#e.indexOf(e);
				if (-1 === r) return this;
				let o = this.#e.indexOf(t);
				return this.insert(-1 !== o && o < r ? r - 1 : r, t, n)
			}
			after(e) {
				let t = this.#e.indexOf(e);
				if (-1 !== (t = -1 === t || t === this.size - 1 ? -1 : t + 1)) return this.entryAt(t)
			}
			setAfter(e, t, n) {
				let r = this.#e.indexOf(e);
				if (-1 === r) return this;
				let o = this.#e.indexOf(t);
				return this.insert(-1 !== o && o <= r ? r : r + 1, t, n)
			}
			first() {
				return this.entryAt(0)
			}
			last() {
				return this.entryAt(-1)
			}
			clear() {
				return this.#e = [], super.clear()
			}
			delete(e) {
				let t = super.delete(e);
				return t && this.#e.splice(this.#e.indexOf(e), 1), t
			}
			deleteAt(e) {
				let t = this.keyAt(e);
				return void 0 !== t && this.delete(t)
			}
			at(e) {
				let t = d(this.#e, e);
				if (void 0 !== t) return this.get(t)
			}
			entryAt(e) {
				let t = d(this.#e, e);
				if (void 0 !== t) return [t, this.get(t)]
			}
			indexOf(e) {
				return this.#e.indexOf(e)
			}
			keyAt(e) {
				return d(this.#e, e)
			}
			from(e, t) {
				let n = this.indexOf(e);
				if (-1 === n) return;
				let r = n + t;
				return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.at(r)
			}
			keyFrom(e, t) {
				let n = this.indexOf(e);
				if (-1 === n) return;
				let r = n + t;
				return r < 0 && (r = 0), r >= this.size && (r = this.size - 1), this.keyAt(r)
			}
			find(e, t) {
				let n = 0;
				for (let r of this) {
					if (Reflect.apply(e, t, [r, n, this])) return r;
					n++
				}
			}
			findIndex(e, t) {
				let n = 0;
				for (let r of this) {
					if (Reflect.apply(e, t, [r, n, this])) return n;
					n++
				}
				return -1
			}
			filter(t, n) {
				let r = [],
					o = 0;
				for (let e of this) Reflect.apply(t, n, [e, o, this]) && r.push(e), o++;
				return new e(r)
			}
			map(t, n) {
				let r = [],
					o = 0;
				for (let e of this) r.push([e[0], Reflect.apply(t, n, [e, o, this])]), o++;
				return new e(r)
			}
			reduce(...e) {
				let [t, n] = e, r = e.length > 1;
				if (!r && 0 === this.size) throw TypeError("Reduce of empty OrderedDict with no initial value");
				let o = 0,
					i = n;
				for (let e of this) i = 0 !== o || r ? Reflect.apply(t, this, [i, e, o, this]) : e, o++;
				return i
			}
			reduceRight(...e) {
				let [t, n] = e, r = e.length > 1;
				if (!r && 0 === this.size) throw TypeError("Reduce of empty OrderedDict with no initial value");
				let o = n;
				for (let e = this.size - 1; e >= 0; e--) {
					let n = this.entryAt(e);
					o = e !== this.size - 1 || r ? Reflect.apply(t, this, [o, n, e, this]) : n
				}
				return o
			}
			sort(e) {
				if ("function" != typeof e) throw TypeError("OrderedDict.sort requires a compare function");
				let t = [...this.entries()].sort(e);
				for (let [e, n] of(this.clear(), t)) this.set(e, n);
				return this
			}
			toSorted(t) {
				if ("function" != typeof t) throw TypeError("OrderedDict.toSorted requires a compare function");
				return new e([...this.entries()].sort(t))
			}
			toReversed() {
				let t = new e;
				for (let e = this.size - 1; e >= 0; e--) {
					let n = this.keyAt(e),
						r = this.get(n);
					t.set(n, r)
				}
				return t
			}
			toSpliced(...t) {
				let n = [...this.entries()];
				return n.splice(...t), new e(n)
			}
			slice(t, n) {
				let r = new e;
				for (let e of this.#e.slice(t, n)) r.set(e, this.get(e));
				return r
			}
			every(e, t) {
				let n = 0;
				for (let r of this) {
					if (!Reflect.apply(e, t, [r, n, this])) return !1;
					n++
				}
				return !0
			}
			some(e, t) {
				let n = 0;
				for (let r of this) {
					if (Reflect.apply(e, t, [r, n, this])) return !0;
					n++
				}
				return !1
			}
		};

	function d(e, t) {
		if ("at" in Array.prototype) return Array.prototype.at.call(e, t);
		let n = p(e, t);
		return -1 === n ? void 0 : e[n]
	}

	function p(e, t) {
		let n = e.length,
			r = h(t),
			o = r >= 0 ? r : n + r;
		return o < 0 || o >= n ? -1 : o
	}

	function h(e) {
		return e != e || 0 === e ? 0 : Math.trunc(e)
	}

	function m(e, t) {
		if (e === t) return !0;
		if ("object" != typeof e || "object" != typeof t || null == e || null == t) return !1;
		let n = Object.keys(e),
			r = Object.keys(t);
		if (n.length !== r.length) return !1;
		for (let r of n)
			if (!Object.prototype.hasOwnProperty.call(t, r) || e[r] !== t[r]) return !1;
		return !0
	}

	function g(e, t) {
		return !!(t.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING)
	}

	function v(e) {
		let t;
		for (let n of e.keys()) {
			if (t) {
				let e = t.compareDocumentPosition(n);
				if (!(e & Node.DOCUMENT_POSITION_DISCONNECTED) && e & Node.DOCUMENT_POSITION_PRECEDING) return !1
			}
			t = n
		}
		return !0
	}

	function y(e, t) {
		return e[1].element && t[1].element ? g(e[1].element, t[1].element) ? -1 : 1 : 0
	}

	function x(e) {
		return new MutationObserver(t => {
			for (let n of t)
				if ("childList" === n.type) return void e()
		})
	}
	s(d, "at"), s(p, "toSafeIndex"), s(h, "toSafeInteger"), s(function(e) {
		let a = e + "CollectionProvider",
			[c, u] = (0, n.f)(a),
			[d, p] = c(a);
		d.displayName = e + "CollectionStableContextProvider";
		let [h, g] = c(a);
		h.displayName = e + "CollectionStatefulContextProvider";
		let w = s(({
			state: e,
			...t
		}) => e ? (0, i.jsx)(S, {
			...t,
			state: e
		}) : (0, i.jsx)(b, {
			...t
		}), "CollectionProvider");
		w.displayName = a;
		let b = s(e => {
			let t = T();
			return (0, i.jsx)(S, {
				...e,
				state: t
			})
		}, "CollectionInit");
		b.displayName = e + "CollectionInit";
		let S = s(e => {
			let {
				scope: n,
				children: o,
				state: l
			} = e, a = t.useRef(null), [s, c] = t.useState(null), u = (0, r.f)(a, c), [p, m] = l, g = t.useRef(new f), w = t.useCallback(() => {
				let e = g.current;
				return v(e) || e.sort(y), e
			}, []);
			return t.useEffect(() => {
				if (!s) return;
				let e = x(() => {
					m(e => {
						let t = e.toSorted(y);
						return t.some(([t], n) => e.keyAt(n) !== t) ? t : e
					})
				});
				return e.observe(s, {
					childList: !0,
					subtree: !0
				}), () => {
					e.disconnect()
				}
			}, [s, m]), (0, i.jsx)(d, {
				scope: n,
				collectionElementRef: u,
				collectionElementRefObject: a,
				getCollection: w,
				setCollection: m,
				registryRef: g,
				children: (0, i.jsx)(h, {
					scope: n,
					collectionElement: s,
					collection: p,
					children: o
				})
			})
		}, "CollectionProviderImpl");
		S.displayName = e + "CollectionProviderImpl";
		let C = e + "CollectionSlot",
			R = (0, o.B)(C),
			j = t.forwardRef((e, t) => {
				let {
					scope: n,
					children: o
				} = e, l = p(C, n), a = (0, r.f)(t, l.collectionElementRef);
				return (0, i.jsx)(R, {
					ref: a,
					children: o
				})
			});
		j.displayName = C;
		let P = e + "CollectionItemSlot",
			k = (0, o.B)(P),
			O = t.forwardRef((e, n) => {
				let {
					scope: o,
					children: a,
					...s
				} = e, c = t.useRef(null), {
					setCollection: u,
					registryRef: d
				} = p(P, o), h = t.useRef(s);
				m(h.current, s) || (h.current = s);
				let g = h.current,
					v = t.useCallback(e => {
						let t = d.current;
						e ? t.set(e, {
							...h.current,
							element: e
						}) : c.current && t.delete(c.current)
					}, [d]),
					x = (0, r.f)(n, v, c);
				(0, l.f)(() => {
					let e = c.current,
						t = d.current;
					e && t.has(e) && t.set(e, {
						...g,
						element: e
					})
				}, [g, d]);
				let w = t.useRef(null);
				return t.useEffect(() => {
					let e = c.current,
						t = w.current;
					((t?.element ?? null) !== e || e && t?.itemData !== g) && (w.current = e ? {
						element: e,
						itemData: g
					} : null, u(n => {
						let r = new f(n);
						return t && t.element !== e && r.delete(t.element), e && r.set(e, {
							...g,
							element: e
						}), r.sort(y)
					}))
				}), t.useEffect(() => () => {
					let e = w.current;
					w.current = null, e && u(t => {
						if (!t.has(e.element)) return t;
						let n = new f(t);
						return n.delete(e.element), n
					})
				}, [u]), (0, i.jsx)(k, {
					"data-radix-collection-item": "",
					ref: x,
					children: a
				})
			});

		function T() {
			return t.useState(new f)
		}

		function E(t) {
			let {
				collection: n
			} = g(e + "CollectionConsumer", t);
			return n
		}

		function A(t) {
			let {
				getCollection: n
			} = p(e + "CollectionConsumer", t);
			return n
		}
		return O.displayName = P, s(T, "useInitCollection"), s(E, "useCollection"), s(A, "useGetCollection"), [{
			Provider: w,
			Slot: j,
			ItemSlot: O
		}, {
			createCollectionScope: u,
			useCollection: E,
			useGetCollection: A,
			useInitCollection: T
		}]
	}, "createCollection"), s(m, "shallowEqual"), s(g, "isElementPreceding"), s(v, "isInDocumentOrder"), s(y, "sortByDocumentPosition"), s(x, "getChildListObserver"), e.s(["f", 0, c], 962067);
	var w = Object.defineProperty,
		b = t.createContext(void 0);

	function S(e) {
		let n = t.useContext(b);
		return e || n || "ltr"
	}
	w(S, "name", {
		value: "useDirection",
		configurable: !0
	}), e.s(["f", 0, S], 624894);
	var C = e.i(55e3);
	let R = {
		name: "chevron-down",
		size: 24,
		node: [
			["path", {
				d: "m6 9 6 6 6-6",
				key: "qrunsl"
			}]
		]
	};
	R.node;
	let j = (0, C.f)(R);
	e.s(["f", 0, j], 695657)
}, 953074, e => {
	"use strict";
	let t;
	var n = e.i(170380);
	let r = ["top", "right", "bottom", "left"],
		o = Math.min,
		i = Math.max,
		l = Math.round,
		a = Math.floor,
		s = e => ({
			x: e,
			y: e
		}),
		c = {
			left: "right",
			right: "left",
			bottom: "top",
			top: "bottom"
		};

	function u(e, t) {
		return "function" == typeof e ? e(t) : e
	}

	function f(e) {
		return e.split("-")[0]
	}

	function d(e) {
		return e.split("-")[1]
	}

	function p(e) {
		return "x" === e ? "y" : "x"
	}

	function h(e) {
		return "y" === e ? "height" : "width"
	}

	function m(e) {
		let t = e[0];
		return "t" === t || "b" === t ? "y" : "x"
	}

	function g(e) {
		return e.includes("start") ? e.replace("start", "end") : e.replace("end", "start")
	}
	let v = ["left", "right"],
		y = ["right", "left"],
		x = ["top", "bottom"],
		w = ["bottom", "top"];

	function b(e) {
		let t = f(e);
		return c[t] + e.slice(t.length)
	}

	function S(e) {
		var t, n, r, o;
		return "number" != typeof e ? {
			top: null != (t = e.top) ? t : 0,
			right: null != (n = e.right) ? n : 0,
			bottom: null != (r = e.bottom) ? r : 0,
			left: null != (o = e.left) ? o : 0
		} : {
			top: e,
			right: e,
			bottom: e,
			left: e
		}
	}

	function C(e) {
		let {
			x: t,
			y: n,
			width: r,
			height: o
		} = e;
		return {
			width: r,
			height: o,
			top: n,
			left: t,
			right: t + r,
			bottom: n + o,
			x: t,
			y: n
		}
	}

	function R(e, t, n) {
		let r, {
				reference: o,
				floating: i
			} = e,
			l = m(t),
			a = p(m(t)),
			s = h(a),
			c = f(t),
			u = o.x + o.width / 2 - i.width / 2,
			g = o.y + o.height / 2 - i.height / 2,
			v = o[s] / 2 - i[s] / 2;
		switch (c) {
			case "top":
				r = {
					x: u,
					y: o.y - i.height
				};
				break;
			case "bottom":
				r = {
					x: u,
					y: o.y + o.height
				};
				break;
			case "right":
				r = {
					x: o.x + o.width,
					y: g
				};
				break;
			case "left":
				r = {
					x: o.x - i.width,
					y: g
				};
				break;
			default:
				r = {
					x: o.x,
					y: o.y
				}
		}
		let y = d(t);
		return y && (r[a] += v * ("end" === y ? 1 : -1) * (n && "y" === l ? -1 : 1)), r
	}
	async function j(e, t) {
		var n;
		void 0 === t && (t = {});
		let {
			x: r,
			y: o,
			platform: i,
			rects: l,
			elements: a,
			strategy: s
		} = e, {
			boundary: c = "clippingAncestors",
			rootBoundary: f = "viewport",
			elementContext: d = "floating",
			altBoundary: p = !1,
			padding: h = 0
		} = u(t, e), m = S(h), g = a[p ? "floating" === d ? "reference" : "floating" : d], v = C(await i.getClippingRect({
			element: null == (n = await (null == i.isElement ? void 0 : i.isElement(g))) || n ? g : g.contextElement || await (null == i.getDocumentElement ? void 0 : i.getDocumentElement(a.floating)),
			boundary: c,
			rootBoundary: f,
			strategy: s
		})), y = "floating" === d ? {
			x: r,
			y: o,
			width: l.floating.width,
			height: l.floating.height
		} : l.reference, x = await (null == i.getOffsetParent ? void 0 : i.getOffsetParent(a.floating)), w = await (null == i.isElement ? void 0 : i.isElement(x)) && await (null == i.getScale ? void 0 : i.getScale(x)) || {
			x: 1,
			y: 1
		}, b = C(i.convertOffsetParentRelativeRectToViewportRelativeRect ? await i.convertOffsetParentRelativeRectToViewportRelativeRect({
			elements: a,
			rect: y,
			offsetParent: x,
			strategy: s
		}) : y);
		return {
			top: (v.top - b.top + m.top) / w.y,
			bottom: (b.bottom - v.bottom + m.bottom) / w.y,
			left: (v.left - b.left + m.left) / w.x,
			right: (b.right - v.right + m.right) / w.x
		}
	}
	let P = async (e, t, n) => {
		let {
			placement: r = "bottom",
			strategy: o = "absolute",
			middleware: i = [],
			platform: l
		} = n, a = l.detectOverflow ? l : {
			...l,
			detectOverflow: j
		}, s = await (null == l.isRTL ? void 0 : l.isRTL(t)), c = await l.getElementRects({
			reference: e,
			floating: t,
			strategy: o
		}), {
			x: u,
			y: f
		} = R(c, r, s), d = r, p = 0, h = {};
		for (let n = 0; n < i.length; n++) {
			let m = i[n];
			if (!m) continue;
			let {
				name: g,
				fn: v
			} = m, {
				x: y,
				y: x,
				data: w,
				reset: b
			} = await v({
				x: u,
				y: f,
				initialPlacement: r,
				placement: d,
				strategy: o,
				middlewareData: h,
				rects: c,
				platform: a,
				elements: {
					reference: e,
					floating: t
				}
			});
			u = null != y ? y : u, f = null != x ? x : f, h[g] = {
				...h[g],
				...w
			}, b && p < 50 && (p++, "object" == typeof b && (b.placement && (d = b.placement), b.rects && (c = !0 === b.rects ? await l.getElementRects({
				reference: e,
				floating: t,
				strategy: o
			}) : b.rects), {
				x: u,
				y: f
			} = R(c, d, s)), n = -1)
		}
		return {
			x: u,
			y: f,
			placement: d,
			strategy: o,
			middlewareData: h
		}
	};

	function k(e, t) {
		return {
			top: e.top - t.height,
			right: e.right - t.width,
			bottom: e.bottom - t.height,
			left: e.left - t.width
		}
	}

	function O(e) {
		return r.some(t => e[t] >= 0)
	}
	let T = new Set(["left", "top"]);
	async function E(e, t) {
		let {
			placement: n,
			platform: r,
			elements: o
		} = e, i = await (null == r.isRTL ? void 0 : r.isRTL(o.floating)), l = f(n), a = d(n), s = "y" === m(n), c = T.has(l) ? -1 : 1, p = i && s ? -1 : 1, h = u(t, e), {
			mainAxis: g,
			crossAxis: v,
			alignmentAxis: y
		} = "number" == typeof h ? {
			mainAxis: h,
			crossAxis: 0,
			alignmentAxis: null
		} : {
			mainAxis: h.mainAxis || 0,
			crossAxis: h.crossAxis || 0,
			alignmentAxis: h.alignmentAxis
		};
		return a && "number" == typeof y && (v = "end" === a ? -1 * y : y), s ? {
			x: v * p,
			y: g * c
		} : {
			x: g * c,
			y: v * p
		}
	}

	function A() {
		return "u" > typeof window
	}

	function D(e) {
		return M(e) ? (e.nodeName || "").toLowerCase() : "#document"
	}

	function I(e) {
		var t;
		return (null == e || null == (t = e.ownerDocument) ? void 0 : t.defaultView) || window
	}

	function L(e) {
		var t;
		return null == (t = (M(e) ? e.ownerDocument : e.document) || window.document) ? void 0 : t.documentElement
	}

	function M(e) {
		return !!A() && (e instanceof Node || e instanceof I(e).Node)
	}

	function N(e) {
		return !!A() && (e instanceof Element || e instanceof I(e).Element)
	}

	function _(e) {
		return !!A() && (e instanceof HTMLElement || e instanceof I(e).HTMLElement)
	}

	function z(e) {
		return !(!A() || "u" < typeof ShadowRoot) && (e instanceof ShadowRoot || e instanceof I(e).ShadowRoot)
	}

	function V(e) {
		let {
			overflow: t,
			overflowX: n,
			overflowY: r,
			display: o
		} = q(e);
		return /auto|scroll|overlay|hidden|clip/.test(t + r + n) && "inline" !== o && "contents" !== o
	}

	function H(e) {
		try {
			if (e.matches(":popover-open")) return !0
		} catch (e) {}
		try {
			return e.matches(":modal")
		} catch (e) {
			return !1
		}
	}
	let B = /transform|translate|scale|rotate|perspective|filter/,
		F = /paint|layout|strict|content/,
		W = e => !!e && "none" !== e;

	function U(e) {
		let t = N(e) ? q(e) : e;
		return W(t.transform) || W(t.translate) || W(t.scale) || W(t.rotate) || W(t.perspective) || !$() && (W(t.backdropFilter) || W(t.filter)) || B.test(t.willChange || "") || F.test(t.contain || "")
	}

	function $() {
		return null == t && (t = "u" > typeof CSS && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")), t
	}

	function K(e) {
		return /^(html|body|#document)$/.test(D(e))
	}

	function q(e) {
		return I(e).getComputedStyle(e)
	}

	function Y(e) {
		return N(e) ? {
			scrollLeft: e.scrollLeft,
			scrollTop: e.scrollTop
		} : {
			scrollLeft: e.scrollX,
			scrollTop: e.scrollY
		}
	}

	function G(e) {
		if ("html" === D(e)) return e;
		let t = e.assignedSlot || e.parentNode || z(e) && e.host || L(e);
		return z(t) ? t.host : t
	}

	function X(e, t, n) {
		var r;
		void 0 === t && (t = []), void 0 === n && (n = !0);
		let o = function e(t) {
				let n = G(t);
				return K(n) ? (t.ownerDocument || t).body : _(n) && V(n) ? n : e(n)
			}(e),
			i = o === (null == (r = e.ownerDocument) ? void 0 : r.body),
			l = I(o);
		if (!i) return t.concat(o, X(o, [], n));
		{
			let e = Z(l);
			return t.concat(l, l.visualViewport || [], V(o) ? o : [], e && n ? X(e) : [])
		}
	}

	function Z(e) {
		return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null
	}

	function Q(e) {
		let t = q(e),
			n = parseFloat(t.width) || 0,
			r = parseFloat(t.height) || 0,
			o = _(e),
			i = o ? e.offsetWidth : n,
			a = o ? e.offsetHeight : r,
			s = l(n) !== i || l(r) !== a;
		return s && (n = i, r = a), {
			width: n,
			height: r,
			$: s
		}
	}

	function J(e) {
		return N(e) ? e : e.contextElement
	}

	function ee(e) {
		let t = J(e);
		if (!_(t)) return s(1);
		let n = t.getBoundingClientRect(),
			{
				width: r,
				height: o,
				$: i
			} = Q(t),
			a = (i ? l(n.width) : n.width) / r,
			c = (i ? l(n.height) : n.height) / o;
		return a && Number.isFinite(a) || (a = 1), c && Number.isFinite(c) || (c = 1), {
			x: a,
			y: c
		}
	}
	let et = s(0);

	function en(e) {
		let t = I(e);
		return $() && t.visualViewport ? {
			x: t.visualViewport.offsetLeft,
			y: t.visualViewport.offsetTop
		} : et
	}

	function er(e, t, n, r) {
		var o;
		void 0 === t && (t = !1), void 0 === n && (n = !1);
		let i = e.getBoundingClientRect(),
			l = J(e),
			a = s(1);
		t && (r ? N(r) && (a = ee(r)) : a = ee(e));
		let c = (void 0 === (o = n) && (o = !1), r && o && r === I(l)) ? en(l) : s(0),
			u = (i.left + c.x) / a.x,
			f = (i.top + c.y) / a.y,
			d = i.width / a.x,
			p = i.height / a.y;
		if (l && r) {
			let e = I(l),
				t = N(r) ? I(r) : r,
				n = e,
				o = Z(n);
			for (; o && t !== n;) {
				let e = ee(o),
					t = o.getBoundingClientRect(),
					r = q(o),
					i = t.left + (o.clientLeft + parseFloat(r.paddingLeft)) * e.x,
					l = t.top + (o.clientTop + parseFloat(r.paddingTop)) * e.y;
				u *= e.x, f *= e.y, d *= e.x, p *= e.y, u += i, f += l, o = Z(n = I(o))
			}
		}
		return C({
			width: d,
			height: p,
			x: u,
			y: f
		})
	}

	function eo(e, t) {
		let n = Y(e).scrollLeft;
		return t ? t.left + n : er(L(e)).left + n
	}

	function ei(e, t) {
		let n = e.getBoundingClientRect();
		return {
			x: n.left + t.scrollLeft - eo(e, n),
			y: n.top + t.scrollTop
		}
	}

	function el(e, t, n) {
		var r;
		let o;
		if ("viewport" === t || "layoutViewport" === t) o = function(e, t, n) {
			void 0 === n && (n = "viewport");
			let r = "layoutViewport" === n,
				o = I(e),
				i = L(e),
				l = o.visualViewport,
				a = i.clientWidth,
				s = i.clientHeight,
				c = 0,
				u = 0;
			if (l) {
				let e = !$() || "fixed" === t;
				r ? e || (c = -l.offsetLeft, u = -l.offsetTop) : (a = l.width, s = l.height, e && (c = l.offsetLeft, u = l.offsetTop))
			}
			if (0 >= eo(i)) {
				let e = i.ownerDocument,
					t = e.body,
					n = getComputedStyle(t),
					r = "CSS1Compat" === e.compatMode && parseFloat(n.marginLeft) + parseFloat(n.marginRight) || 0,
					o = Math.abs(i.clientWidth - t.clientWidth - r),
					l = "stable both-edges" === getComputedStyle(i).scrollbarGutter ? o / 2 : o;
				l <= 25 && (a -= l)
			}
			return {
				width: a,
				height: s,
				x: c,
				y: u
			}
		}(e, n, t);
		else if ("document" === t) {
			let t, n, l, a, s, c;
			t = Y(r = L(e)), n = r.ownerDocument.body, l = i(r.scrollWidth, r.clientWidth, n.scrollWidth, n.clientWidth), a = i(r.scrollHeight, r.clientHeight, n.scrollHeight, n.clientHeight), s = -t.scrollLeft + eo(r), c = -t.scrollTop, "rtl" === q(n).direction && (s += i(r.clientWidth, n.clientWidth) - l), o = {
				width: l,
				height: a,
				x: s,
				y: c
			}
		} else if (N(t)) {
			let e, r, i, l, a, s;
			r = (e = er(t, !0, "fixed" === n)).top + t.clientTop, i = e.left + t.clientLeft, l = ee(t), a = t.clientWidth * l.x, s = t.clientHeight * l.y, o = {
				width: a,
				height: s,
				x: i * l.x,
				y: r * l.y
			}
		} else {
			let n = en(e);
			o = {
				x: t.x - n.x,
				y: t.y - n.y,
				width: t.width,
				height: t.height
			}
		}
		return C(o)
	}

	function ea(e) {
		return "static" === q(e).position
	}

	function es(e, t) {
		if (!_(e) || "fixed" === q(e).position) return null;
		if (t) return t(e);
		let n = e.offsetParent;
		return L(e) === n && (n = n.ownerDocument.body), n
	}

	function ec(e, t) {
		var n;
		let r = I(e);
		if (H(e)) return r;
		if (!_(e)) {
			let t = G(e);
			for (; t && !K(t);) {
				if (N(t) && !ea(t)) return t;
				t = G(t)
			}
			return r
		}
		let o = es(e, t);
		for (; o && (n = o, /^(table|td|th)$/.test(D(n))) && ea(o);) o = es(o, t);
		return o && K(o) && ea(o) && !U(o) ? r : o || function(e) {
			let t = G(e);
			for (; _(t) && !K(t);) {
				if (U(t)) return t;
				if (H(t)) break;
				t = G(t)
			}
			return null
		}(e) || r
	}
	let eu = async function(e) {
		let t = this.getOffsetParent || ec,
			n = this.getDimensions,
			r = await n(e.floating);
		return {
			reference: function(e, t, n) {
				let r = _(t),
					o = L(t),
					i = "fixed" === n,
					l = er(e, !0, i, t),
					a = {
						scrollLeft: 0,
						scrollTop: 0
					},
					c = s(0);
				if ((r || !i) && (("body" !== D(t) || V(o)) && (a = Y(t)), r)) {
					let e = er(t, !0, i, t);
					c.x = e.x + t.clientLeft, c.y = e.y + t.clientTop
				}!r && o && (c.x = eo(o));
				let u = !o || r || i ? s(0) : ei(o, a);
				return {
					x: l.left + a.scrollLeft - c.x - u.x,
					y: l.top + a.scrollTop - c.y - u.y,
					width: l.width,
					height: l.height
				}
			}(e.reference, await t(e.floating), e.strategy),
			floating: {
				x: 0,
				y: 0,
				width: r.width,
				height: r.height
			}
		}
	}, ef = {
		convertOffsetParentRelativeRectToViewportRelativeRect: function(e) {
			let {
				elements: t,
				rect: n,
				offsetParent: r,
				strategy: o
			} = e, i = "fixed" === o, l = L(r), a = !!t && H(t.floating);
			if (r === l || a && i) return n;
			let c = {
					scrollLeft: 0,
					scrollTop: 0
				},
				u = s(1),
				f = s(0),
				d = _(r);
			if ((d || !i) && (("body" !== D(r) || V(l)) && (c = Y(r)), d)) {
				let e = er(r);
				u = ee(r), f.x = e.x + r.clientLeft, f.y = e.y + r.clientTop
			}
			let p = !l || d || i ? s(0) : ei(l, c);
			return {
				width: n.width * u.x,
				height: n.height * u.y,
				x: n.x * u.x - c.scrollLeft * u.x + f.x + p.x,
				y: n.y * u.y - c.scrollTop * u.y + f.y + p.y
			}
		},
		getDocumentElement: L,
		getClippingRect: function(e) {
			let {
				element: t,
				boundary: n,
				rootBoundary: r,
				strategy: l
			} = e, a = [..."clippingAncestors" === n ? H(t) ? [] : function(e, t) {
				let n = t.get(e);
				if (n) return n;
				let r = X(e, [], !1).filter(e => N(e) && "body" !== D(e)),
					o = null,
					i = "fixed" === q(e).position,
					l = i ? G(e) : e;
				for (; N(l) && !K(l);) {
					let e = q(l),
						t = U(l),
						n = o ? o.position : i ? "fixed" : "";
					t || "fixed" !== n && ("absolute" !== n || "static" !== e.position) ? o = e : r = r.filter(e => e !== l), l = G(l)
				}
				return t.set(e, r), r
			}(t, this._c) : [].concat(n), r], s = el(t, a[0], l), c = s.top, u = s.right, f = s.bottom, d = s.left;
			for (let e = 1; e < a.length; e++) {
				let n = el(t, a[e], l);
				c = i(n.top, c), u = o(n.right, u), f = o(n.bottom, f), d = i(n.left, d)
			}
			return {
				width: u - d,
				height: f - c,
				x: d,
				y: c
			}
		},
		getOffsetParent: ec,
		getElementRects: eu,
		getClientRects: function(e) {
			return e.getClientRects ? Array.from(e.getClientRects()) : []
		},
		getDimensions: function(e) {
			let {
				width: t,
				height: n
			} = Q(e);
			return {
				width: t,
				height: n
			}
		},
		getScale: ee,
		isElement: N,
		isRTL: function(e) {
			return "rtl" === q(e).direction
		}
	};

	function ed(e, t) {
		return e.x === t.x && e.y === t.y && e.width === t.width && e.height === t.height
	}
	let ep = e => ({
		name: "arrow",
		options: e,
		async fn(t) {
			let {
				x: n,
				y: r,
				placement: l,
				rects: a,
				platform: s,
				elements: c,
				middlewareData: f
			} = t, {
				element: g,
				padding: v = 0
			} = u(e, t) || {};
			if (null == g) return {};
			let y = S(v),
				x = {
					x: n,
					y: r
				},
				w = p(m(l)),
				b = h(w),
				C = await s.getDimensions(g),
				R = "y" === w,
				j = R ? "clientHeight" : "clientWidth",
				P = a.reference[b] + a.reference[w] - x[w] - a.floating[b],
				k = x[w] - a.reference[w],
				O = await (null == s.getOffsetParent ? void 0 : s.getOffsetParent(g)),
				T = O ? O[j] : 0;
			T && await (null == s.isElement ? void 0 : s.isElement(O)) || (T = c.floating[j] || a.floating[b]);
			let E = T / 2 - C[b] / 2 - 1,
				A = o(y[R ? "top" : "left"], E),
				D = o(y[R ? "bottom" : "right"], E),
				I = T - C[b] - D,
				L = T / 2 - C[b] / 2 + (P / 2 - k / 2),
				M = i(A, o(L, I)),
				N = !f.arrow && null != d(l) && L !== M && a.reference[b] / 2 - (L < A ? A : D) - C[b] / 2 < 0,
				_ = N ? L < A ? L - A : L - I : 0;
			return {
				[w]: x[w] + _,
				data: {
					[w]: M,
					centerOffset: L - M - _,
					...N && {
						alignmentOffset: _
					}
				},
				reset: N
			}
		}
	});
	var eh = e.i(716455),
		em = "u" > typeof document ? n.useLayoutEffect : function() {};

	function eg(e, t) {
		let n, r, o;
		if (e === t) return !0;
		if (typeof e != typeof t) return !1;
		if ("function" == typeof e && e.toString() === t.toString()) return !0;
		if (e && t && "object" == typeof e) {
			if (Array.isArray(e)) {
				if ((n = e.length) !== t.length) return !1;
				for (r = n; 0 != r--;)
					if (!eg(e[r], t[r])) return !1;
				return !0
			}
			if ((n = (o = Object.keys(e)).length) !== Object.keys(t).length) return !1;
			for (r = n; 0 != r--;)
				if (!({}).hasOwnProperty.call(t, o[r])) return !1;
			for (r = n; 0 != r--;) {
				let n = o[r];
				if (("_owner" !== n || !e.$$typeof) && !eg(e[n], t[n])) return !1
			}
			return !0
		}
		return e != e && t != t
	}

	function ev(e) {
		return "u" < typeof window ? 1 : (e.ownerDocument.defaultView || window).devicePixelRatio || 1
	}

	function ey(e, t) {
		let n = ev(e);
		return Math.round(t * n) / n
	}

	function ex(e) {
		let t = n.useRef(e);
		return em(() => {
			t.current = e
		}), t
	}
	var ew = e.i(378329),
		eb = e.i(234984),
		eS = Object.defineProperty,
		eC = n.forwardRef(eS(function(e, t) {
			let {
				children: n,
				width: r = 10,
				height: o = 5,
				...i
			} = e;
			return (0, eb.jsx)(ew.V.svg, {
				...i,
				ref: t,
				width: r,
				height: o,
				viewBox: "0 0 30 10",
				preserveAspectRatio: "none",
				children: e.asChild ? n : (0, eb.jsx)("polygon", {
					points: "0,0 30,0 15,10"
				})
			})
		}, "name", {
			value: "Arrow",
			configurable: !0
		})),
		eR = e.i(954264),
		ej = e.i(653132),
		eP = e.i(167656),
		ek = e.i(794371),
		eO = e.i(931986),
		eT = Object.defineProperty,
		eE = (e, t) => eT(e, "name", {
			value: t,
			configurable: !0
		}),
		eA = "partial",
		eD = "Popper",
		[eI, eL] = (0, ej.f)(eD),
		[eM, eN] = eI(eD),
		e_ = eE(e => {
			let {
				__scopePopper: t,
				children: r
			} = e, [o, i] = n.useState(null), [l, a] = n.useState(void 0);
			return (0, eb.jsx)(eM, {
				scope: t,
				anchor: o,
				onAnchorChange: i,
				placementState: l,
				setPlacementState: a,
				children: r
			})
		}, "Popper"),
		ez = n.forwardRef(eE(function(e, t) {
			let {
				__scopePopper: r,
				virtualRef: o,
				...i
			} = e, l = eN("PopperAnchor", r), a = n.useRef(null), s = l.onAnchorChange, c = n.useCallback(e => {
				a.current = e, e && s(e)
			}, [s]), u = (0, eR.f)(t, c), f = n.useRef(null);
			n.useEffect(() => {
				if (!o) return;
				let e = f.current;
				f.current = o.current, e !== f.current && s(f.current)
			});
			let d = l.placementState && eq(l.placementState),
				p = d?.[0],
				h = d?.[1];
			return o ? null : (0, eb.jsx)(ew.V.div, {
				"data-radix-popper-side": p,
				"data-radix-popper-align": h,
				...i,
				ref: u
			})
		}, "PopperAnchor")),
		eV = "PopperContent",
		[eH, eB] = eI(eV),
		eF = n.forwardRef(eE(function(e, t) {
			var r, l, s, c, S, C, R, j, A, D, M, N, _;
			let z, V, H, B, F, W, {
					__scopePopper: U,
					side: $ = "bottom",
					sideOffset: K = 0,
					align: q = "center",
					alignOffset: Y = 0,
					arrowPadding: G = 0,
					avoidCollisions: Z = !0,
					collisionBoundary: Q = [],
					collisionPadding: ee = 0,
					sticky: et = eA,
					hideWhenDetached: en = !1,
					updatePositionStrategy: eo = "optimized",
					onPlaced: ei,
					...el
				} = e,
				ea = eN(eV, U),
				[es, ec] = n.useState(null),
				eu = (0, eR.f)(t, ec),
				[eS, eC] = n.useState(null),
				ej = (0, eO.f)(eS),
				eT = ej?.width ?? 0,
				eD = ej?.height ?? 0,
				eI = "number" == typeof ee ? ee : {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0,
					...ee
				},
				eL = Array.isArray(Q) ? Q : [Q],
				eM = eL.length > 0,
				e_ = {
					padding: eI,
					boundary: eL.filter(e$),
					altBoundary: eM
				},
				{
					refs: ez,
					floatingStyles: eB,
					placement: eF,
					isPositioned: eW,
					middlewareData: eU
				} = function(e) {
					void 0 === e && (e = {});
					let {
						placement: t = "bottom",
						strategy: r = "absolute",
						middleware: o = [],
						platform: i,
						elements: {
							reference: l,
							floating: a
						} = {},
						transform: s = !0,
						whileElementsMounted: c,
						open: u
					} = e, [f, d] = n.useState({
						x: 0,
						y: 0,
						strategy: r,
						placement: t,
						middlewareData: {},
						isPositioned: !1
					}), [p, h] = n.useState(o);
					eg(p, o) || h(o);
					let [m, g] = n.useState(null), [v, y] = n.useState(null), x = n.useCallback(e => {
						e !== C.current && (C.current = e, g(e))
					}, []), w = n.useCallback(e => {
						e !== R.current && (R.current = e, y(e))
					}, []), b = l || m, S = a || v, C = n.useRef(null), R = n.useRef(null), j = n.useRef(f), k = null != c, O = ex(c), T = ex(i), E = ex(u), A = n.useCallback(() => {
						var e, n;
						let o, i, l;
						if (!C.current || !R.current) return;
						let a = {
							placement: t,
							strategy: r,
							middleware: p
						};
						T.current && (a.platform = T.current), (e = C.current, n = R.current, o = new Map, i = null != a ? a : {}, l = {
							...ef,
							...i.platform,
							_c: o
						}, P(e, n, {
							...i,
							platform: l
						})).then(e => {
							let t = {
								...e,
								isPositioned: !1 !== E.current
							};
							D.current && !eg(j.current, t) && (j.current = t, eh.flushSync(() => {
								d(t)
							}))
						})
					}, [p, t, r, T, E]);
					em(() => {
						!1 === u && j.current.isPositioned && (j.current.isPositioned = !1, d(e => ({
							...e,
							isPositioned: !1
						})))
					}, [u]);
					let D = n.useRef(!1);
					em(() => (D.current = !0, () => {
						D.current = !1
					}), []), em(() => {
						if (b && (C.current = b), S && (R.current = S), b && S) {
							if (O.current) return O.current(b, S, A);
							A()
						}
					}, [b, S, A, O, k]);
					let I = n.useMemo(() => ({
							reference: C,
							floating: R,
							setReference: x,
							setFloating: w
						}), [x, w]),
						L = n.useMemo(() => ({
							reference: b,
							floating: S
						}), [b, S]),
						M = n.useMemo(() => {
							let e = {
								position: r,
								left: 0,
								top: 0
							};
							if (!L.floating) return e;
							let t = ey(L.floating, f.x),
								n = ey(L.floating, f.y);
							return s ? {
								...e,
								transform: "translate(" + t + "px, " + n + "px)",
								...ev(L.floating) >= 1.5 && {
									willChange: "transform"
								}
							} : {
								position: r,
								left: t,
								top: n
							}
						}, [r, s, L.floating, f.x, f.y]);
					return n.useMemo(() => ({
						...f,
						update: A,
						refs: I,
						elements: L,
						floatingStyles: M
					}), [f, A, I, L, M])
				}({
					strategy: "fixed",
					placement: $ + ("center" !== q ? "-" + q : ""),
					whileElementsMounted: eE((...e) => (function(e, t, n, r) {
						let l;
						void 0 === r && (r = {});
						let {
							ancestorScroll: s = !0,
							ancestorResize: c = !0,
							elementResize: u = "function" == typeof ResizeObserver,
							layoutShift: f = "function" == typeof IntersectionObserver,
							animationFrame: d = !1
						} = r, p = J(e), h = s || c ? [...p ? X(p) : [], ...t ? X(t) : []] : [];
						h.forEach(e => {
							s && e.addEventListener("scroll", n), c && e.addEventListener("resize", n)
						});
						let m = p && f ? function(e, t, n) {
								let r, l = null,
									s = L(e);

								function c() {
									var e;
									clearTimeout(r), null == (e = l) || e.disconnect(), l = null
								}

								function u(n, f) {
									void 0 === n && (n = !1), void 0 === f && (f = 1), c();
									let d = e.getBoundingClientRect(),
										{
											left: p,
											top: h,
											width: m,
											height: g
										} = d;
									if (n || t(), !m || !g) return;
									let v = {
											rootMargin: -a(h) + "px " + -a(s.clientWidth - (p + m)) + "px " + -a(s.clientHeight - (h + g)) + "px " + -a(p) + "px",
											threshold: i(0, o(1, f)) || 1
										},
										y = !0;

									function x(t) {
										let n = t[0].intersectionRatio;
										if (!ed(d, e.getBoundingClientRect())) return u();
										if (n !== f) {
											if (!y) return u();
											n ? u(!1, n) : r = setTimeout(() => {
												u(!1, 1e-7)
											}, 1e3)
										}
										y = !1
									}
									try {
										l = new IntersectionObserver(x, {
											...v,
											root: s.ownerDocument
										})
									} catch (e) {
										l = new IntersectionObserver(x, v)
									}
									l.observe(e)
								}
								let f = I(e),
									d = () => u(n);
								return f.addEventListener("resize", d), u(!0), () => {
									f.removeEventListener("resize", d), c()
								}
							}(p, n, c) : null,
							g = -1,
							v = null;
						u && (v = new ResizeObserver(e => {
							let [r] = e;
							r && r.target === p && v && t && (v.unobserve(t), cancelAnimationFrame(g), g = requestAnimationFrame(() => {
								var e;
								null == (e = v) || e.observe(t)
							})), n()
						}), p && !d && v.observe(p), t && v.observe(t));
						let y = d ? er(e) : null;
						return d && function t() {
							let r = er(e);
							y && !ed(y, r) && n(), y = r, l = requestAnimationFrame(t)
						}(), n(), () => {
							var e;
							h.forEach(e => {
								s && e.removeEventListener("scroll", n), c && e.removeEventListener("resize", n)
							}), null == m || m(), null == (e = v) || e.disconnect(), v = null, d && cancelAnimationFrame(l)
						}
					})(...e, {
						animationFrame: "always" === eo
					}), "whileElementsMounted"),
					elements: {
						reference: ea.anchor
					},
					middleware: [{
						name: (z = {
							name: "offset",
							options: l = r = {
								mainAxis: K + eD,
								alignmentAxis: Y
							},
							async fn(e) {
								var t, n;
								let {
									x: r,
									y: o,
									placement: i,
									middlewareData: a
								} = e, s = await E(e, l);
								return i === (null == (t = a.offset) ? void 0 : t.placement) && null != (n = a.arrow) && n.alignmentOffset ? {} : {
									x: r + s.x,
									y: o + s.y,
									data: {
										...s,
										placement: i
									}
								}
							}
						}).name,
						fn: z.fn,
						options: [r, void 0]
					}, Z && {
						name: (V = {
							name: "shift",
							options: S = c = {
								mainAxis: !0,
								crossAxis: !1,
								...et === eA ? {
									limiter: {
										fn: (s = void 0, {
											options: s = {},
											fn(e) {
												var t, n, r, o;
												let {
													x: i,
													y: l,
													placement: a,
													rects: c,
													middlewareData: d
												} = e, {
													offset: h = 0,
													mainAxis: g = !0,
													crossAxis: v = !0
												} = u(s, e), y = {
													x: i,
													y: l
												}, x = m(a), w = p(x), b = y[w], S = y[x], C = u(h, e), R = "number" == typeof C ? {
													mainAxis: C,
													crossAxis: 0
												} : {
													mainAxis: null != (t = C.mainAxis) ? t : 0,
													crossAxis: null != (n = C.crossAxis) ? n : 0
												};
												if (g) {
													let e = "y" === w ? "height" : "width",
														t = c.reference[w] - c.floating[e] + R.mainAxis,
														n = c.reference[w] + c.reference[e] - R.mainAxis;
													b < t ? b = t : b > n && (b = n)
												}
												if (v) {
													let e = "y" === w ? "width" : "height",
														t = T.has(f(a)),
														n = c.reference[x] - c.floating[e] + (t && (null == (r = d.offset) ? void 0 : r[x]) || 0) + (t ? 0 : R.crossAxis),
														i = c.reference[x] + c.reference[e] + (t ? 0 : (null == (o = d.offset) ? void 0 : o[x]) || 0) - (t ? R.crossAxis : 0);
													S < n ? S = n : S > i && (S = i)
												}
												return {
													[w]: b,
													[x]: S
												}
											}
										}).fn,
										options: [void 0, void 0]
									}
								} : {},
								...e_
							},
							async fn(e) {
								let {
									x: t,
									y: n,
									placement: r,
									platform: l
								} = e, {
									mainAxis: a = !0,
									crossAxis: s = !1,
									limiter: c = {
										fn: e => {
											let {
												x: t,
												y: n
											} = e;
											return {
												x: t,
												y: n
											}
										}
									},
									...f
								} = u(S, e), d = {
									x: t,
									y: n
								}, h = await l.detectOverflow(e, f), g = m(r), v = p(g), y = d[v], x = d[g], w = (e, t) => i(t + h["y" === e ? "top" : "left"], o(t, t - h["y" === e ? "bottom" : "right"]));
								a && (y = w(v, y)), s && (x = w(g, x));
								let b = c.fn({
									...e,
									[v]: y,
									[g]: x
								});
								return {
									...b,
									data: {
										x: b.x - t,
										y: b.y - n,
										enabled: {
											[v]: a,
											[g]: s
										}
									}
								}
							}
						}).name,
						fn: V.fn,
						options: [c, void 0]
					}, Z && {
						name: (H = {
							name: "flip",
							options: R = C = {
								...e_
							},
							async fn(e) {
								var t, n, r, o, i, l, a, s;
								let c, S, C, {
										placement: j,
										middlewareData: P,
										rects: k,
										initialPlacement: O,
										platform: T,
										elements: E
									} = e,
									{
										mainAxis: A = !0,
										crossAxis: D = !0,
										fallbackPlacements: I,
										fallbackStrategy: L = "bestFit",
										fallbackAxisSideDirection: M = "none",
										flipAlignment: N = !0,
										..._
									} = u(R, e);
								if (null != (t = P.arrow) && t.alignmentOffset) return {};
								let z = f(j),
									V = m(O),
									H = f(O) === O,
									B = await (null == T.isRTL ? void 0 : T.isRTL(E.floating)),
									F = I || (H || !N ? [b(O)] : (c = b(O), [g(O), c, g(c)])),
									W = "none" !== M;
								!I && W && F.push(...(S = d(O), C = function(e, t, n) {
									switch (e) {
										case "top":
										case "bottom":
											if (n) return t ? y : v;
											return t ? v : y;
										case "left":
										case "right":
											return t ? x : w;
										default:
											return []
									}
								}(f(O), "start" === M, B), S && (C = C.map(e => e + "-" + S), N && (C = C.concat(C.map(g)))), C));
								let U = [O, ...F],
									$ = await T.detectOverflow(e, _),
									K = [],
									q = (null == (n = P.flip) ? void 0 : n.overflows) || [];
								if (A && K.push($[z]), D) {
									let e, t, n, r, o = (l = j, a = k, void 0 === (s = B) && (s = !1), e = d(l), n = h(t = p(m(l))), r = "x" === t ? e === (s ? "end" : "start") ? "right" : "left" : "start" === e ? "bottom" : "top", a.reference[n] > a.floating[n] && (r = b(r)), [r, b(r)]);
									K.push($[o[0]], $[o[1]])
								}
								if (q = [...q, {
										placement: j,
										overflows: K
									}], !K.every(e => e <= 0)) {
									let e = ((null == (r = P.flip) ? void 0 : r.index) || 0) + 1,
										t = U[e];
									if (t && ("alignment" !== D || V === m(t) || q.every(e => m(e.placement) !== V || e.overflows[0] > 0))) return {
										data: {
											index: e,
											overflows: q
										},
										reset: {
											placement: t
										}
									};
									let n = null == (o = q.filter(e => e.overflows[0] <= 0).sort((e, t) => e.overflows[1] - t.overflows[1])[0]) ? void 0 : o.placement;
									if (!n) switch (L) {
										case "bestFit": {
											let e = null == (i = q.filter(e => {
												if (W) {
													let t = m(e.placement);
													return t === V || "y" === t
												}
												return !0
											}).map(e => [e.placement, e.overflows.filter(e => e > 0).reduce((e, t) => e + t, 0)]).sort((e, t) => e[1] - t[1])[0]) ? void 0 : i[0];
											e && (n = e);
											break
										}
										case "initialPlacement":
											n = O
									}
									if (j !== n) return {
										reset: {
											placement: n
										}
									}
								}
								return {}
							}
						}).name,
						fn: H.fn,
						options: [C, void 0]
					}, {
						name: (B = {
							name: "size",
							options: A = j = {
								...e_,
								apply: eE(({
									elements: e,
									rects: t,
									availableWidth: n,
									availableHeight: r
								}) => {
									let {
										width: o,
										height: i
									} = t.reference, l = e.floating.style;
									l.setProperty("--radix-popper-available-width", `${n}px`), l.setProperty("--radix-popper-available-height", `${r}px`), l.setProperty("--radix-popper-anchor-width", `${o}px`), l.setProperty("--radix-popper-anchor-height", `${i}px`)
								}, "apply")
							},
							async fn(e) {
								let t, n, {
										placement: r,
										rects: l,
										platform: a,
										elements: s
									} = e,
									{
										apply: c = () => {},
										...p
									} = u(A, e),
									h = await a.detectOverflow(e, p),
									g = f(r),
									v = d(r),
									y = "y" === m(r),
									{
										width: x,
										height: w
									} = l.floating;
								"top" === g || "bottom" === g ? (t = g, n = v === (await (null == a.isRTL ? void 0 : a.isRTL(s.floating)) ? "start" : "end") ? "left" : "right") : (n = g, t = "end" === v ? "top" : "bottom");
								let b = w - h.top - h.bottom,
									S = x - h.left - h.right,
									C = o(w - h[t], b),
									R = o(x - h[n], S),
									j = e.middlewareData.shift,
									P = !j,
									k = C,
									O = R;
								null != j && j.enabled.x && (O = S), null != j && j.enabled.y && (k = b), P && !v && (y ? O = x - 2 * i(h.left, h.right) : k = w - 2 * i(h.top, h.bottom)), await c({
									...e,
									availableWidth: O,
									availableHeight: k
								});
								let T = await a.getDimensions(s.floating);
								return x !== T.width || w !== T.height ? {
									reset: {
										rects: !0
									}
								} : {}
							}
						}).name,
						fn: B.fn,
						options: [j, void 0]
					}, eS && {
						name: (F = {
							name: "arrow",
							options: M = D = {
								element: eS,
								padding: G
							},
							fn(e) {
								let {
									element: t,
									padding: n
								} = "function" == typeof M ? M(e) : M;
								return t && ({}).hasOwnProperty.call(t, "current") ? null != t.current ? ep({
									element: t.current,
									padding: n
								}).fn(e) : {} : t ? ep({
									element: t,
									padding: n
								}).fn(e) : {}
							}
						}).name,
						fn: F.fn,
						options: [D, void 0]
					}, eK({
						arrowWidth: eT,
						arrowHeight: eD
					}), en && {
						name: (W = {
							name: "hide",
							options: _ = N = eM ? {
								strategy: "referenceHidden",
								...e_
							} : {
								strategy: "referenceHidden",
								padding: e_.padding,
								altBoundary: e_.altBoundary
							},
							async fn(e) {
								let {
									rects: t,
									platform: n
								} = e, {
									strategy: r = "referenceHidden",
									...o
								} = u(_, e);
								switch (r) {
									case "referenceHidden": {
										let r = k(await n.detectOverflow(e, {
											...o,
											elementContext: "reference"
										}), t.reference);
										return {
											data: {
												referenceHiddenOffsets: r,
												referenceHidden: O(r)
											}
										}
									}
									case "escaped": {
										let r = k(await n.detectOverflow(e, {
											...o,
											altBoundary: !0
										}), t.floating);
										return {
											data: {
												escapedOffsets: r,
												escaped: O(r)
											}
										}
									}
									default:
										return {}
								}
							}
						}).name,
						fn: W.fn,
						options: [N, void 0]
					}]
				}),
				eY = ea.setPlacementState;
			(0, ek.f)(() => (eY(eF), () => {
				eY(void 0)
			}), [eF, eY]);
			let [eG, eX] = eq(eF), eZ = (0, eP.f)(ei);
			(0, ek.f)(() => {
				eW && eZ?.()
			}, [eW, eZ]);
			let eQ = eU.arrow?.x,
				eJ = eU.arrow?.y,
				e0 = eU.arrow?.centerOffset !== 0,
				[e1, e2] = n.useState();
			return (0, ek.f)(() => {
				es && e2(window.getComputedStyle(es).zIndex)
			}, [es]), (0, eb.jsx)("div", {
				ref: ez.setFloating,
				"data-radix-popper-content-wrapper": "",
				style: {
					...eB,
					transform: eW ? eB.transform : "translate(0, -200%)",
					minWidth: "max-content",
					zIndex: e1,
					"--radix-popper-transform-origin": [eU.transformOrigin?.x, eU.transformOrigin?.y].join(" "),
					...eU.hide?.referenceHidden && {
						visibility: "hidden",
						pointerEvents: "none"
					}
				},
				dir: e.dir,
				children: (0, eb.jsx)(eH, {
					scope: U,
					placedSide: eG,
					placedAlign: eX,
					onArrowChange: eC,
					arrowX: eQ,
					arrowY: eJ,
					shouldHideArrow: e0,
					children: (0, eb.jsx)(ew.V.div, {
						"data-side": eG,
						"data-align": eX,
						...el,
						ref: eu,
						style: {
							...el.style,
							animation: eW ? el.style?.animation : "none"
						}
					})
				})
			})
		}, "PopperContent")),
		eW = {
			top: "bottom",
			right: "left",
			bottom: "top",
			left: "right"
		},
		eU = n.forwardRef(eE(function(e, t) {
			let {
				__scopePopper: n,
				...r
			} = e, o = eB("PopperArrow", n), i = eW[o.placedSide];
			return (0, eb.jsx)("span", {
				ref: o.onArrowChange,
				style: {
					position: "absolute",
					left: o.arrowX,
					top: o.arrowY,
					[i]: 0,
					transformOrigin: {
						top: "",
						right: "0 0",
						bottom: "center 0",
						left: "100% 0"
					} [o.placedSide],
					transform: {
						top: "translateY(100%)",
						right: "translateY(50%) rotate(90deg) translateX(-50%)",
						bottom: "rotate(180deg)",
						left: "translateY(50%) rotate(-90deg) translateX(50%)"
					} [o.placedSide],
					visibility: o.shouldHideArrow ? "hidden" : void 0
				},
				children: (0, eb.jsx)(eC, {
					...r,
					ref: t,
					style: {
						...r.style,
						display: "block"
					}
				})
			})
		}, "PopperArrow"));

	function e$(e) {
		return null !== e
	}
	eE(e$, "isNotNull");
	var eK = eE(e => ({
		name: "transformOrigin",
		options: e,
		fn(t) {
			let {
				placement: n,
				rects: r,
				middlewareData: o
			} = t, i = o.arrow?.centerOffset !== 0, l = i ? 0 : e.arrowWidth, a = i ? 0 : e.arrowHeight, [s, c] = eq(n), u = {
				start: "0%",
				center: "50%",
				end: "100%"
			} [c], f = (o.arrow?.x ?? 0) + l / 2, d = (o.arrow?.y ?? 0) + a / 2, p = "", h = "";
			return "bottom" === s ? (p = i ? u : `${f}px`, h = `${-a}px`) : "top" === s ? (p = i ? u : `${f}px`, h = `${r.floating.height+a}px`) : "right" === s ? (p = `${-a}px`, h = i ? u : `${d}px`) : "left" === s && (p = `${r.floating.width+a}px`, h = i ? u : `${d}px`), {
				data: {
					x: p,
					y: h
				}
			}
		}
	}), "transformOrigin");

	function eq(e) {
		let [t, n = "center"] = e.split("-");
		return [t, n]
	}
	eE(eq, "getSideAndAlignFromPlacement"), e.s(["g", 0, ez, "j", 0, eU, "c", 0, eF, "F", 0, e_, "y", 0, eL], 953074)
}, 959920, e => {
	"use strict";
	var t = e.i(170380),
		n = e.i(378329),
		r = e.i(234984),
		o = Object.defineProperty,
		i = Object.freeze({
			position: "absolute",
			border: 0,
			width: 1,
			height: 1,
			padding: 0,
			margin: -1,
			overflow: "hidden",
			clip: "rect(0, 0, 0, 0)",
			whiteSpace: "nowrap",
			wordWrap: "normal"
		}),
		l = t.forwardRef(o(function(e, t) {
			return (0, r.jsx)(n.V.span, {
				...e,
				ref: t,
				style: {
					...i,
					...e.style
				}
			})
		}, "name", {
			value: "VisuallyHidden",
			configurable: !0
		}));
	e.s(["F", 0, l, "u", 0, i])
}]);