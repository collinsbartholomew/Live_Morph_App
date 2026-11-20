(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 836437, e => {
	"use strict";
	var t = e.i(234984),
		r = e.i(195907),
		s = e.i(540580),
		n = e.i(207196),
		a = e.i(253149),
		i = e.i(55e3);
	let l = {
		name: "receipt",
		size: 24,
		node: [
			["path", {
				d: "M12 17V7",
				key: "pyj7ub"
			}],
			["path", {
				d: "M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8",
				key: "1elt7d"
			}],
			["path", {
				d: "M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z",
				key: "ycz6yz"
			}]
		]
	};
	l.node;
	let o = (0, i.f)(l);
	var c = e.i(927531),
		d = e.i(170380),
		u = e.i(322932),
		m = e.i(727677),
		f = e.i(8774),
		p = e.i(120384),
		h = e.i(683225),
		x = e.i(267649),
		b = e.i(582018),
		g = e.i(351570),
		y = e.i(584381),
		v = e.i(619525),
		j = e.i(837714),
		N = e.i(932767),
		w = e.i(232250),
		C = e.i(380491),
		S = e.i(76145),
		_ = e.i(528506),
		k = e.i(205647),
		z = e.i(527511);
	async function P() {
		let e = await fetch("/api/user/auto-top-up");
		return await (0, k.W)(e, "Failed to fetch config"), e.json()
	}

	function O({
		activeOrgId: e
	}) {
		let r, s, n, i = (0, v.d)(),
			l = (0, c.useSearchParams)(),
			{
				data: o,
				isLoading: m
			} = (s = (0, b.c)(2), n = e ?? "personal", s[0] !== n ? (r = {
				queryKey: ["auto-top-up-config", n],
				queryFn: P
			}, s[0] = n, s[1] = r) : r = s[1], (0, y.f)(r)),
			h = o?.config,
			x = o?.card,
			k = (0, d.useRef)(!1),
			[A, I] = (0, d.useState)(!1),
			[E, $] = (0, d.useState)("100"),
			[L, F] = (0, d.useState)(z.b[2].id),
			[T, M] = (0, d.useState)("500"),
			[U, D] = (0, d.useState)(!1),
			[q, B] = (0, d.useState)(!1);
		(0, d.useEffect)(() => {
			let e = l.get("setup_success"),
				t = l.get("setup_session_id");
			"true" === e && t && !k.current && (k.current = !0, fetch("/api/stripe/setup-payment/confirm", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					sessionId: t
				})
			}).then(e => {
				e.ok ? (u.c.success("Payment method saved"), _.f.trackAutoTopUpPaymentMethodSaved(), i.invalidateQueries({
					queryKey: ["auto-top-up-config"]
				})) : u.c.error("Failed to confirm payment method"), window.history.replaceState({}, "", "/billing")
			}).catch(() => {
				u.c.error("Failed to confirm payment method")
			}))
		}, [l, i]), (0, d.useEffect)(() => {
			h && (I(h.enabled), $(h.threshold.toString()), F(h.planId), M((h.monthlyCap / 100).toString()), D(h.hasPaymentMethod))
		}, [h]);
		let R = (0, g.f)({
				mutationFn: async e => {
					let t = await fetch("/api/user/auto-top-up", {
						method: "PATCH",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify(e)
					});
					if (!t.ok) throw Error((await t.json()).error || "Failed to update");
					return t.json()
				},
				onSuccess: () => {
					i.invalidateQueries({
						queryKey: ["auto-top-up-config"]
					}), u.c.success("Auto top-up settings saved")
				},
				onError: e => {
					u.c.error(e.message), i.invalidateQueries({
						queryKey: ["auto-top-up-config"]
					})
				}
			}),
			W = (0, d.useCallback)(async ({
				enableAfterSetup: e = !1
			} = {}) => {
				try {
					B(!0), _.f.trackAutoTopUpAddCardClicked();
					let t = {
							threshold: Number.parseInt(E, 10),
							planId: L,
							monthlyCap: 100 * Number.parseInt(T, 10),
							enableAfterSetup: e
						},
						r = await fetch("/api/stripe/setup-payment", {
							method: "POST",
							headers: {
								"Content-Type": "application/json"
							},
							body: JSON.stringify(t)
						});
					if (!r.ok) throw Error("Failed to create setup session");
					let s = await r.json();
					s.url && (window.location.href = s.url)
				} catch {
					u.c.error("Failed to initialize payment setup"), B(!1)
				}
			}, [E, L, T]),
			H = (0, d.useCallback)(e => {
				e && !U ? W({
					enableAfterSetup: !0
				}) : (I(e), e ? _.f.trackAutoTopUpEnabled() : _.f.trackAutoTopUpDisabled(), R.mutate({
					enabled: e,
					threshold: Number.parseInt(E, 10),
					planId: L,
					monthlyCap: 100 * Number.parseInt(T, 10)
				}))
			}, [U, E, L, T, R, W]);
		if (m) return (0, t.jsx)(p.N, {
			className: "p-6",
			children: (0, t.jsx)("div", {
				className: "flex items-center justify-center py-4",
				children: (0, t.jsx)(a.f, {
					className: "size-5 animate-spin text-muted-foreground"
				})
			})
		});
		let J = z.b.find(e => e.id === L);
		return (0, t.jsxs)(p.N, {
			className: "p-0 overflow-hidden border border-border bg-background",
			children: [(0, t.jsxs)("div", {
				className: "px-4 py-3 border-b flex items-center justify-between",
				children: [(0, t.jsx)("h2", {
					className: "text-sm font-semibold",
					children: "Auto Top-Up"
				}), (0, t.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [(0, t.jsxs)("span", {
						className: "flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [(0, t.jsx)("span", {
							className: `size-1.5 rounded-full ${A?"bg-emerald-500":"bg-muted-foreground/50"}`
						}), A ? "Enabled" : "Disabled"]
					}), (0, t.jsx)(S.f, {
						checked: A,
						onCheckedChange: H,
						disabled: q
					})]
				})]
			}), (0, t.jsxs)("div", {
				className: "px-4 py-3 flex flex-col gap-3",
				children: [(0, t.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-3",
					children: [(0, t.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [(0, t.jsx)(w.f, {
							htmlFor: "threshold",
							className: "text-xs",
							children: "When balance drops below"
						}), (0, t.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [(0, t.jsx)(N.f, {
								id: "threshold",
								type: "number",
								min: 1,
								value: E,
								onChange: e => $(e.target.value),
								className: "w-full h-8 text-sm"
							}), (0, t.jsx)("span", {
								className: "text-xs text-muted-foreground whitespace-nowrap",
								children: "credits"
							})]
						})]
					}), (0, t.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [(0, t.jsx)(w.f, {
							htmlFor: "plan",
							className: "text-xs",
							children: "Add credits"
						}), (0, t.jsxs)(C.d, {
							value: L,
							onValueChange: F,
							children: [(0, t.jsx)(C.P, {
								id: "plan",
								className: "h-8 text-sm",
								children: (0, t.jsx)(C.U, {})
							}), (0, t.jsx)(C.r, {
								children: z.b.map(e => (0, t.jsxs)(C.T, {
									value: e.id,
									children: [e.name, " · ", e.credits.toLocaleString(), " credits · $", e.price]
								}, e.id))
							})]
						})]
					}), (0, t.jsxs)("div", {
						className: "flex flex-col gap-1.5",
						children: [(0, t.jsxs)("div", {
							className: "flex flex-wrap items-baseline gap-x-1",
							children: [(0, t.jsx)(w.f, {
								htmlFor: "monthlyCap",
								className: "text-xs whitespace-nowrap",
								children: "Monthly limit"
							}), h && (0, t.jsxs)("span", {
								className: "text-xs text-muted-foreground whitespace-nowrap",
								children: ["($", (h.currentMonthSpend / 100).toLocaleString(), " / $", (h.monthlyCap / 100).toLocaleString(), " used)"]
							})]
						}), (0, t.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [(0, t.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "$"
							}), (0, t.jsx)(N.f, {
								id: "monthlyCap",
								type: "number",
								min: 10,
								value: T,
								onChange: e => M(e.target.value),
								className: "w-full h-8 text-sm"
							})]
						})]
					})]
				}), (0, t.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-2",
					children: [(0, t.jsxs)("div", {
						className: "flex items-center gap-2 text-xs text-muted-foreground",
						children: [(0, t.jsx)(j.f, {
							className: "size-3.5 shrink-0"
						}), U && x ? `${x.brand.charAt(0).toUpperCase()+x.brand.slice(1)} •••• ${x.last4}` : U ? "Payment method saved" : "No payment method"]
					}), (0, t.jsxs)("div", {
						className: "flex gap-2",
						children: [(0, t.jsx)(f.f, {
							variant: "outline",
							className: "h-7 text-xs px-2.5",
							onClick: () => W(),
							disabled: q,
							children: q ? (0, t.jsx)(a.f, {
								className: "size-3.5 animate-spin"
							}) : U ? "Update Card" : "Add Card"
						}), (0, t.jsx)(f.f, {
							className: "h-7 text-xs px-2.5",
							onClick: () => {
								_.f.trackAutoTopUpSettingsSaved({
									threshold: Number.parseInt(E, 10),
									planId: L,
									monthlyCap: 100 * Number.parseInt(T, 10),
									enabled: A
								}), R.mutate({
									enabled: A,
									threshold: Number.parseInt(E, 10),
									planId: L,
									monthlyCap: 100 * Number.parseInt(T, 10)
								})
							},
							disabled: R.isPending,
							children: R.isPending ? (0, t.jsx)(a.f, {
								className: "size-3.5 animate-spin"
							}) : "Save"
						})]
					})]
				}), A && U && J && (0, t.jsxs)("p", {
					className: "text-xs text-muted-foreground",
					children: ["Below", " ", (0, t.jsxs)("span", {
						className: "text-foreground font-medium",
						children: [Number(E).toLocaleString(), " credits"]
					}), ", we'll charge ", (0, t.jsxs)("span", {
						className: "text-foreground font-medium",
						children: ["$", J.price]
					}), " ", "for", " ", (0, t.jsxs)("span", {
						className: "text-foreground font-medium",
						children: [J.credits.toLocaleString(), " credits"]
					}), ", up to", " ", (0, t.jsxs)("span", {
						className: "text-foreground font-medium",
						children: ["$", Number(T).toLocaleString(), "/mo"]
					}), "."]
				})]
			})]
		})
	}
	var A = e.i(293819);

	function I(e) {
		let r, s, n, a, i = (0, b.c)(5),
			{
				className: l
			} = e;
		return i[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)("path", {
			d: "M11.8766 9.68512C11.8766 10.1688 11.9296 10.558 12.0237 10.8413C12.1295 11.1247 12.2588 11.432 12.4352 11.7632C12.4999 11.8693 12.5234 11.9753 12.5234 12.0694C12.5234 12.1995 12.4469 12.3295 12.2823 12.4596L11.4235 13.0373C11.3176 13.1074 11.2118 13.1434 11.1177 13.1434C10.9884 13.1434 10.8591 13.0734 10.7298 12.9454C10.5534 12.7553 10.4005 12.5532 10.2712 12.3391C10.1419 12.1131 10.0126 11.8572 9.87157 11.5538C8.89489 12.7803 7.68323 13.3936 6.23663 13.3936C5.18755 13.3936 4.35103 13.0974 3.74946 12.5052C3.14789 11.9129 2.84124 11.1247 2.84124 10.1408C2.84124 9.09696 3.21854 8.2367 3.98467 7.57239C4.7508 6.90808 5.75218 6.57592 7.01327 6.57592C7.45174 6.57592 7.90197 6.61198 8.37572 6.67207C8.84947 6.73217 9.33498 6.82832 9.84403 6.94851V5.9406C9.84403 4.9927 9.64411 4.32838 9.25603 3.93594C8.8562 3.54349 8.20403 3.35328 7.28794 3.35328C6.83771 3.35328 6.37571 3.40536 5.90196 3.52154C5.42821 3.63772 4.96623 3.77794 4.516 3.9542C4.28903 4.05837 4.12028 4.12648 4.01094 4.15453C3.90159 4.18258 3.82168 4.1946 3.76529 4.1946C3.60048 4.1946 3.51668 4.07042 3.51668 3.81005V3.13372C3.51668 2.93149 3.54052 2.78326 3.60048 2.70114C3.66044 2.61902 3.77367 2.5369 3.95195 2.46679C4.40218 2.2526 4.94065 2.07441 5.56779 1.93218C6.19493 1.77793 6.85857 1.70683 7.55871 1.70683C8.94549 1.70683 9.96455 2.01496 10.6401 2.63121C11.3038 3.24747 11.6416 4.18659 11.6416 5.44823V9.68512H11.8766ZM6.84682 11.8212C7.27353 11.8212 7.71201 11.739 8.17401 11.5748C8.63601 11.4106 9.04762 11.1247 9.39549 10.7303C9.60718 10.4829 9.76412 10.2116 9.84403 9.90414C9.92395 9.59671 9.9758 9.22929 9.9758 8.80179V8.26547C9.60718 8.17134 9.21521 8.09523 8.81148 8.04314C8.40774 7.99107 8.01577 7.96302 7.62381 7.96302C6.77543 7.96302 6.14052 8.13521 5.69834 8.4916C5.25616 8.84799 5.04095 9.34424 5.04095 9.99254C5.04095 10.6008 5.2086 11.0563 5.55647 11.3717C5.89258 11.6991 6.31928 11.8212 6.84682 11.8212ZM16.3858 13.0494C16.1692 13.0494 16.0222 13.0133 15.9246 12.9312C15.8269 12.8611 15.741 12.6949 15.6668 12.4566L12.9303 2.53889C12.8563 2.28855 12.8193 2.12226 12.8193 2.02813C12.8193 1.80992 12.9303 1.68773 13.1525 1.68773H14.4666C14.6959 1.68773 14.8547 1.72379 14.9405 1.80591C15.0381 1.87603 15.1121 2.04231 15.1862 2.28053L17.1559 10.6529L18.9827 2.28053C19.0451 2.03029 19.1191 1.87603 19.2168 1.80591C19.3144 1.73579 19.4849 1.68773 19.7025 1.68773H20.7804C21.0098 1.68773 21.1686 1.72379 21.2662 1.80591C21.3639 1.87603 21.4497 2.04231 21.5002 2.28053L23.3505 10.7651L25.3672 2.28053C25.4413 2.03029 25.5271 1.87603 25.613 1.80591C25.7107 1.73579 25.8695 1.68773 26.0871 1.68773H27.3424C27.5647 1.68773 27.6875 1.79791 27.6875 2.02813C27.6875 2.08823 27.6757 2.14832 27.664 2.22043C27.6523 2.29255 27.6288 2.38869 27.5795 2.5089L24.7723 12.4606C24.6983 12.7109 24.6125 12.8651 24.5148 12.9352C24.4172 13.0053 24.2701 13.0534 24.0653 13.0534H22.9051C22.6757 13.0534 22.5169 13.0173 22.4193 12.9352C22.3216 12.8531 22.2358 12.6989 22.1853 12.4486L20.3703 4.38447L18.5671 12.4366C18.5048 12.6869 18.4308 12.8411 18.3331 12.9232C18.2355 13.0053 18.0649 13.0414 17.8473 13.0414H16.3858V13.0494ZM31.9427 13.4418C31.2661 13.4418 30.5895 13.3617 29.9388 13.2015C29.2881 13.0413 28.7791 12.8691 28.4312 12.6729C28.2147 12.5548 28.0624 12.4247 28.0095 12.3065C27.9565 12.1884 27.93 12.0582 27.93 11.9401V11.2398C27.93 10.9794 28.0253 10.8573 28.2041 10.8573C28.281 10.8573 28.358 10.8693 28.4349 10.8934C28.5119 10.9174 28.6241 10.9655 28.748 11.0136C29.1849 11.2038 29.6578 11.354 30.1542 11.4562C30.6624 11.5583 31.1588 11.6083 31.6669 11.6083C32.4577 11.6083 33.0711 11.4722 33.4955 11.2C33.92 10.9278 34.1383 10.5234 34.1383 9.99908C34.1383 9.63166 34.016 9.32423 33.7716 9.06887C33.5272 8.8135 33.0829 8.58216 32.4513 8.36284L30.646 7.74458C29.715 7.42113 29.0255 6.96894 28.5998 6.38802C28.1742 5.8191 27.9555 5.18482 27.9555 4.50942C27.9555 3.95709 28.0748 3.46884 28.3133 3.04465C28.5518 2.62047 28.8685 2.25037 29.2634 1.95834C29.6583 1.65431 30.1055 1.42637 30.6295 1.26249C31.1535 1.09861 31.7011 1.02267 32.2722 1.02267C32.5577 1.02267 32.8551 1.03469 33.1406 1.07073C33.438 1.10679 33.7118 1.15487 33.9856 1.20295C34.2475 1.26304 34.4976 1.32314 34.7359 1.39526C34.9742 1.46737 35.1543 1.53949 35.2761 1.6116C35.4502 1.70774 35.5773 1.80388 35.6491 1.91204C35.7209 2.0082 35.7568 2.14041 35.7568 2.32061V2.96891C35.7568 3.22928 35.6615 3.36348 35.4826 3.36348C35.3701 3.36348 35.1935 3.30339 34.9646 3.1832C34.1738 2.81578 33.2883 2.63157 32.308 2.63157C31.5877 2.63157 31.0154 2.7437 30.6142 2.97995C30.2129 3.2162 30.0058 3.5917 30.0058 4.13201C30.0058 4.49943 30.1404 4.81888 30.4097 5.07425C30.679 5.32961 31.1588 5.58498 31.8367 5.81632L33.6068 6.43458C34.5257 6.75802 35.1918 7.18622 35.5936 7.71852C35.9954 8.25082 36.1904 8.86107 36.1904 9.53647C36.1904 10.1007 36.0775 10.6131 35.8636 11.0613C35.638 11.5095 35.3327 11.8999 34.9356 12.2203C34.5385 12.5527 34.0587 12.7968 33.4955 12.9731C32.9088 13.2853 32.3253 13.4418 31.9427 13.4418Z",
			fill: "#FFFFFF"
		}), s = (0, t.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M34.0887 19.3661C30.1077 22.1947 24.3831 23.7031 19.4816 23.7031C12.6095 23.7031 6.44128 21.1896 1.81607 17.0082C1.44788 16.6758 1.77635 16.2275 2.21999 16.4869C7.20331 19.3711 13.4018 21.1194 19.8016 21.1194C24.1181 21.1194 28.8756 20.2111 33.2525 18.3331C33.9036 18.0367 34.4611 18.7731 34.0887 19.3661Z",
			fill: "#FF9900"
		}), n = (0, t.jsx)("path", {
			fillRule: "evenodd",
			clipRule: "evenodd",
			d: "M35.6219 17.5619C35.1261 16.927 32.4326 17.2474 31.2149 17.3916C30.8406 17.4397 30.7813 17.1133 31.1198 16.8709C33.2525 15.387 36.7898 15.8233 37.2137 16.3442C37.6376 16.8769 37.0981 20.4133 35.0986 22.0778C34.7839 22.3443 34.4851 22.2061 34.6215 21.8557C35.0688 20.7561 36.1177 18.1848 35.6219 17.5619Z",
			fill: "#FF9900"
		}), i[0] = r, i[1] = s, i[2] = n) : (r = i[0], s = i[1], n = i[2]), i[3] !== l ? (a = (0, t.jsxs)("svg", {
			className: l,
			viewBox: "0 0 42 25",
			fill: "none",
			xmlns: "http://www.w3.org/2000/svg",
			"aria-label": "AWS Logo",
			role: "img",
			"aria-labelledby": "aws-logo",
			children: [r, s, n]
		}), i[3] = l, i[4] = a) : a = i[4], a
	}

	function E() {
		let e, r, s, n = (0, b.c)(3);
		return n[0] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(I, {
			className: "size-16 shrink-0 "
		}), n[0] = e) : e = n[0], n[1] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)("p", {
			className: "text-sm font-medium text-foreground",
			children: "AWS Marketplace Subscription"
		}), n[1] = r) : r = n[1], n[2] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsxs)(p.N, {
			className: "relative h-24 flex items-center flex-row gap-6 border-border px-5 py-4 bg-background",
			children: [e, (0, t.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [r, (0, t.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [(0, t.jsx)("p", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Payments are being processed by"
					}), (0, t.jsx)(A.default, {
						href: "https://console.aws.amazon.com/billing",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "text-xs font-medium text-accent underline",
						children: "Amazon Web Services Billing"
					})]
				})]
			})]
		}), n[2] = s) : s = n[2], s
	}
	let $ = {
		name: "file-text",
		size: 24,
		node: [
			["path", {
				d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
				key: "1oefj6"
			}],
			["path", {
				d: "M14 2v5a1 1 0 0 0 1 1h5",
				key: "wfsgrz"
			}],
			["path", {
				d: "M10 9H8",
				key: "b1mrlr"
			}],
			["path", {
				d: "M16 13H8",
				key: "t4e002"
			}],
			["path", {
				d: "M16 17H8",
				key: "z1uh3a"
			}]
		]
	};
	$.node;
	let L = (0, i.f)($);

	function F(e) {
		let r, s, n, a = (0, b.c)(5),
			{
				invoices: i
			} = e;
		return 0 === i.length ? null : (a[0] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)("div", {
			className: "px-4 py-3 border-b",
			children: (0, t.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Open invoices"
			})
		}), a[0] = r) : r = a[0], a[1] !== i ? (s = i.map(T), a[1] = i, a[2] = s) : s = a[2], a[3] !== s ? (n = (0, t.jsxs)(p.N, {
			className: "p-0 mb-6 overflow-hidden border border-border bg-background",
			children: [r, (0, t.jsx)("ul", {
				className: "divide-y",
				children: s
			})]
		}), a[3] = s, a[4] = n) : n = a[4], n)
	}

	function T(e) {
		let r, s = !!e.dueDate && new Date(e.dueDate) < new Date;
		return (0, t.jsxs)("li", {
			className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
			children: [(0, t.jsxs)("div", {
				className: "flex items-start gap-3 min-w-0",
				children: [(0, t.jsx)(L, {
					className: "size-4 mt-0.5 shrink-0 text-muted-foreground"
				}), (0, t.jsxs)("div", {
					className: "min-w-0",
					children: [(0, t.jsxs)("p", {
						className: "text-sm font-medium",
						children: [e.number ?? "Invoice", " · ", (r = e.totalCents, new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: "USD"
						}).format(r / 100))]
					}), (0, t.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [e.credits.toLocaleString("en-US"), " credits", e.dueDate ? (0, t.jsxs)("span", {
							className: s ? "text-destructive" : void 0,
							children: [" ", "· ", s ? "Overdue since" : "Due", " ", new Date(e.dueDate).toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								year: "numeric"
							})]
						}) : null]
					})]
				})]
			}), e.hostedInvoiceUrl ? (0, t.jsx)(f.f, {
				asChild: !0,
				size: "sm",
				className: "self-start sm:self-auto",
				children: (0, t.jsxs)("a", {
					href: e.hostedInvoiceUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					children: ["Pay invoice", (0, t.jsx)(n.f, {
						className: "size-3.5"
					})]
				})
			}) : null]
		}, e.id)
	}
	var M = e.i(876532),
		U = e.i(329474),
		D = e.i(583289),
		q = e.i(663303),
		B = e.i(818036);

	function R() {
		let e, t = (0, b.c)(11),
			{
				data: r
			} = q.i.useSession(),
			{
				data: s
			} = (0, q.M)(),
			{
				data: n
			} = (0, q.r)(),
			a = r?.session?.activeOrganizationId ?? null,
			i = n?.length ?? 0;
		if (!a) {
			let e;
			return t[0] !== i || t[1] !== a ? (e = {
				organizationId: a,
				organizationName: null,
				access: "allowed",
				organizationCount: i
			}, t[0] = i, t[1] = a, t[2] = e) : e = t[2], e
		}
		if (s?.id !== a) {
			let e;
			return t[3] !== i || t[4] !== a ? (e = {
				organizationId: a,
				organizationName: null,
				access: "loading",
				organizationCount: i
			}, t[3] = i, t[4] = a, t[5] = e) : e = t[5], e
		}
		let l = s.members?.find(e => e.userId === r?.user?.id)?.role,
			o = "owner" === l || "admin" === l ? "allowed" : "denied";
		return t[6] !== s.name || t[7] !== i || t[8] !== a || t[9] !== o ? (e = {
			organizationId: a,
			organizationName: s.name,
			access: o,
			organizationCount: i
		}, t[6] = s.name, t[7] = i, t[8] = a, t[9] = o, t[10] = e) : e = t[10], e
	}

	function W(e) {
		let r, s, n, i, l, o, c, m, p, x, g, y, v = (0, b.c)(33),
			{
				account: j
			} = e,
			{
				data: N
			} = (0, q.r)(),
			[w, C] = (0, d.useState)(!1),
			{
				organizationId: S,
				access: _,
				organizationCount: k
			} = j,
			z = "denied" === _ || k >= (S ? 2 : 1),
			[P, O] = (0, d.useState)(!1);
		if (z && !P && O(!0), !z && !P) return null;
		v[0] !== j.organizationName || v[1] !== S || v[2] !== N ? (r = S ? j.organizationName ?? N?.find(e => e.id === S)?.name ?? "Organization" : "Your personal account", v[0] = j.organizationName, v[1] = S, v[2] = N, v[3] = r) : r = v[3];
		let A = r;
		if (v[4] !== S ? (s = S ? [{
				id: null,
				name: "Personal account"
			}] : [], v[4] = S, v[5] = s) : s = v[5], v[6] !== S || v[7] !== N || v[8] !== s) {
			let e;
			v[10] !== S ? (e = e => e.id !== S, v[10] = S, v[11] = e) : e = v[11], n = [...s, ...(N ?? []).filter(e).map(H)], v[6] = S, v[7] = N, v[8] = s, v[9] = n
		} else n = v[9];
		let I = n,
			E = "denied" === _ ? `Only owners and admins of ${A} can add credits.` : !S && N && N.length > 0 ? `${1===N.length?N[0].name:"Your organizations"} can't use personal credits.` : null;
		v[12] === Symbol.for("react.memo_cache_sentinel") ? (i = async e => {
			C(!0);
			let {
				error: t
			} = await q.i.organization.setActive({
				organizationId: e
			});
			C(!1), t && u.c.error("Couldn't switch accounts")
		}, v[12] = i) : i = v[12];
		let $ = i,
			L = S ? M.f : D.f;
		return v[13] !== L ? (l = (0, t.jsx)("div", {
			className: "size-8 rounded-full bg-muted flex items-center justify-center shrink-0",
			children: (0, t.jsx)(L, {
				className: "size-4 text-foreground"
			})
		}), v[13] = L, v[14] = l) : l = v[14], v[15] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: "Adding credits to"
		}), v[15] = o) : o = v[15], v[16] !== A ? (c = (0, t.jsx)("span", {
			className: "truncate text-sm font-medium text-foreground",
			children: A
		}), v[16] = A, v[17] = c) : c = v[17], v[18] !== _ || v[19] !== E ? (m = E ? (0, t.jsx)("span", {
			className: (0, B.c)("text-xs", "denied" === _ ? "text-destructive" : "text-muted-foreground"),
			children: E
		}) : null, v[18] = _, v[19] = E, v[20] = m) : m = v[20], v[21] !== c || v[22] !== m ? (p = (0, t.jsxs)("div", {
			className: "flex min-w-0 flex-col",
			children: [o, c, m]
		}), v[21] = c, v[22] = m, v[23] = p) : p = v[23], v[24] !== l || v[25] !== p ? (x = (0, t.jsxs)("div", {
			className: "flex min-w-0 items-center gap-3",
			children: [l, p]
		}), v[24] = l, v[25] = p, v[26] = x) : x = v[26], v[27] !== I || v[28] !== w ? (g = I.length > 0 ? (0, t.jsxs)(h.G, {
			children: [(0, t.jsx)(h.X, {
				asChild: !0,
				children: (0, t.jsxs)(f.f, {
					variant: "outline",
					size: "sm",
					className: "shrink-0 rounded-full",
					disabled: w,
					children: [w ? (0, t.jsx)(a.f, {
						className: "size-3.5 animate-spin"
					}) : null, "Switch", (0, t.jsx)(U.f, {
						className: "size-3.5"
					})]
				})
			}), (0, t.jsx)(h.L, {
				align: "end",
				children: I.map(e => (0, t.jsxs)(h.r, {
					onClick: () => $(e.id),
					children: [e.id ? (0, t.jsx)(M.f, {
						className: "size-4"
					}) : (0, t.jsx)(D.f, {
						className: "size-4"
					}), (0, t.jsx)("span", {
						className: "truncate",
						children: e.name
					})]
				}, e.id ?? "personal"))
			})]
		}) : null, v[27] = I, v[28] = w, v[29] = g) : g = v[29], v[30] !== x || v[31] !== g ? (y = (0, t.jsxs)("div", {
			className: "mx-2 flex items-center justify-between gap-4 rounded-xl border border-border bg-black px-4 py-3",
			children: [x, g]
		}), v[30] = x, v[31] = g, v[32] = y) : y = v[32], y
	}

	function H(e) {
		return {
			id: e.id,
			name: e.name
		}
	}
	var J = {
			color: void 0,
			size: void 0,
			className: void 0,
			style: void 0,
			attr: void 0
		},
		V = d.default.createContext && d.default.createContext(J),
		Q = ["attr", "size", "title"];

	function Y() {
		return (Y = Object.assign.bind()).apply(null, arguments)
	}

	function K(e, t) {
		var r = Object.keys(e);
		if (Object.getOwnPropertySymbols) {
			var s = Object.getOwnPropertySymbols(e);
			t && (s = s.filter(function(t) {
				return Object.getOwnPropertyDescriptor(e, t).enumerable
			})), r.push.apply(r, s)
		}
		return r
	}

	function Z(e) {
		for (var t = 1; t < arguments.length; t++) {
			var r = null != arguments[t] ? arguments[t] : {};
			t % 2 ? K(Object(r), !0).forEach(function(t) {
				var s, n, a;
				s = e, n = t, a = r[t], (n = function(e) {
					var t = function(e, t) {
						if ("object" != typeof e || !e) return e;
						var r = e[Symbol.toPrimitive];
						if (void 0 !== r) {
							var s = r.call(e, t || "default");
							if ("object" != typeof s) return s;
							throw TypeError("@@toPrimitive must return a primitive value.")
						}
						return ("string" === t ? String : Number)(e)
					}(e, "string");
					return "symbol" == typeof t ? t : t + ""
				}(n)) in s ? Object.defineProperty(s, n, {
					value: a,
					enumerable: !0,
					configurable: !0,
					writable: !0
				}) : s[n] = a
			}) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r)) : K(Object(r)).forEach(function(t) {
				Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t))
			})
		}
		return e
	}

	function X(e) {
		return t => d.default.createElement(G, Y({
			attr: Z({}, e.attr)
		}, t), function e(t) {
			return t && t.map((t, r) => d.default.createElement(t.tag, Z({
				key: r
			}, t.attr), e(t.child)))
		}(e.child))
	}

	function G(e) {
		var t = t => {
			var r, s = e.attr,
				n = e.size,
				a = e.title,
				i = function(e, t) {
					if (null == e) return {};
					var r, s, n = function(e, t) {
						if (null == e) return {};
						var r = {};
						for (var s in e)
							if (({}).hasOwnProperty.call(e, s)) {
								if (-1 !== t.indexOf(s)) continue;
								r[s] = e[s]
							} return r
					}(e, t);
					if (Object.getOwnPropertySymbols) {
						var a = Object.getOwnPropertySymbols(e);
						for (s = 0; s < a.length; s++) r = a[s], -1 === t.indexOf(r) && ({}).propertyIsEnumerable.call(e, r) && (n[r] = e[r])
					}
					return n
				}(e, Q),
				l = n || t.size || "1em";
			return t.className && (r = t.className), e.className && (r = (r ? r + " " : "") + e.className), d.default.createElement("svg", Y({
				stroke: "currentColor",
				fill: "currentColor",
				strokeWidth: "0"
			}, t.attr, s, i, {
				className: r,
				style: Z(Z({
					color: e.color || t.color
				}, t.style), e.style),
				height: l,
				width: l,
				xmlns: "http://www.w3.org/2000/svg"
			}), a && d.default.createElement("title", null, a), e.children)
		};
		return void 0 !== V ? d.default.createElement(V.Consumer, null, e => t(e)) : t(J)
	}

	function ee(e) {
		return X({
			tag: "svg",
			attr: {
				viewBox: "0 0 256 256",
				fill: "currentColor"
			},
			child: [{
				tag: "path",
				attr: {
					d: "M213.85,125.46l-112,120a8,8,0,0,1-13.69-7l14.66-73.33L45.19,143.49a8,8,0,0,1-3-13l112-120a8,8,0,0,1,13.69,7L153.18,90.9l57.63,21.61a8,8,0,0,1,3,12.95Z"
				},
				child: []
			}]
		})(e)
	}
	var et = e.i(480381),
		er = e.i(367305);

	function es(e) {
		return "function" == typeof e
	}

	function en(e) {
		var t = e(function(e) {
			Error.call(e), e.stack = Error().stack
		});
		return t.prototype = Object.create(Error.prototype), t.prototype.constructor = t, t
	}
	var ea = en(function(e) {
		return function(t) {
			e(this), this.message = t ? t.length + " errors occurred during unsubscription:\n" + t.map(function(e, t) {
				return t + 1 + ") " + e.toString()
			}).join("\n  ") : "", this.name = "UnsubscriptionError", this.errors = t
		}
	});

	function ei(e, t) {
		if (e) {
			var r = e.indexOf(t);
			0 <= r && e.splice(r, 1)
		}
	}
	var el = function() {
			var e;

			function t(e) {
				this.initialTeardown = e, this.closed = !1, this._parentage = null, this._finalizers = null
			}
			return t.prototype.unsubscribe = function() {
				if (!this.closed) {
					this.closed = !0;
					var e, t, r, s, n, a = this._parentage;
					if (a)
						if (this._parentage = null, Array.isArray(a)) try {
							for (var i = (0, er._)(a), l = i.next(); !l.done; l = i.next()) l.value.remove(this)
						} catch (t) {
							e = {
								error: t
							}
						} finally {
							try {
								l && !l.done && (t = i.return) && t.call(i)
							} finally {
								if (e) throw e.error
							}
						} else a.remove(this);
					var o = this.initialTeardown;
					if (es(o)) try {
						o()
					} catch (e) {
						n = e instanceof ea ? e.errors : [e]
					}
					var c = this._finalizers;
					if (c) {
						this._finalizers = null;
						try {
							for (var d = (0, er._)(c), u = d.next(); !u.done; u = d.next()) {
								var m = u.value;
								try {
									ed(m)
								} catch (e) {
									n = null != n ? n : [], e instanceof ea ? n = (0, er.p)((0, er.p)([], (0, er.J)(n)), (0, er.J)(e.errors)) : n.push(e)
								}
							}
						} catch (e) {
							r = {
								error: e
							}
						} finally {
							try {
								u && !u.done && (s = d.return) && s.call(d)
							} finally {
								if (r) throw r.error
							}
						}
					}
					if (n) throw new ea(n)
				}
			}, t.prototype.add = function(e) {
				var r;
				if (e && e !== this)
					if (this.closed) ed(e);
					else {
						if (e instanceof t) {
							if (e.closed || e._hasParent(this)) return;
							e._addParent(this)
						}(this._finalizers = null != (r = this._finalizers) ? r : []).push(e)
					}
			}, t.prototype._hasParent = function(e) {
				var t = this._parentage;
				return t === e || Array.isArray(t) && t.includes(e)
			}, t.prototype._addParent = function(e) {
				var t = this._parentage;
				this._parentage = Array.isArray(t) ? (t.push(e), t) : t ? [t, e] : e
			}, t.prototype._removeParent = function(e) {
				var t = this._parentage;
				t === e ? this._parentage = null : Array.isArray(t) && ei(t, e)
			}, t.prototype.remove = function(e) {
				var r = this._finalizers;
				r && ei(r, e), e instanceof t && e._removeParent(this)
			}, (e = new t).closed = !0, t.EMPTY = e, t
		}(),
		eo = el.EMPTY;

	function ec(e) {
		return e instanceof el || e && "closed" in e && es(e.remove) && es(e.add) && es(e.unsubscribe)
	}

	function ed(e) {
		es(e) ? e() : e.unsubscribe()
	}
	var eu = void 0,
		em = {
			setTimeout: function(e, t) {
				for (var r = [], s = 2; s < arguments.length; s++) r[s - 2] = arguments[s];
				var n = em.delegate;
				return (null == n ? void 0 : n.setTimeout) ? n.setTimeout.apply(n, (0, er.p)([e, t], (0, er.J)(r))) : setTimeout.apply(void 0, (0, er.p)([e, t], (0, er.J)(r)))
			},
			clearTimeout: function(e) {
				var t = em.delegate;
				return ((null == t ? void 0 : t.clearTimeout) || clearTimeout)(e)
			},
			delegate: void 0
		};

	function ef() {}
	var ep = eh("C", void 0, void 0);

	function eh(e, t, r) {
		return {
			kind: e,
			value: t,
			error: r
		}
	}
	var ex = null;

	function eb(e) {
		var t, r, s, n;
		1;
		e()
	}
	var eg = function(e) {
			function t(t) {
				var r = e.call(this) || this;
				return r.isStopped = !1, t ? (r.destination = t, ec(t) && t.add(r)) : r.destination = eS, r
			}
			return (0, er.w)(t, e), t.create = function(e, t, r) {
				return new eN(e, t, r)
			}, t.prototype.next = function(e) {
				this.isStopped ? eC(eh("N", e, void 0), this) : this._next(e)
			}, t.prototype.error = function(e) {
				this.isStopped ? eC(eh("E", void 0, e), this) : (this.isStopped = !0, this._error(e))
			}, t.prototype.complete = function() {
				this.isStopped ? eC(ep, this) : (this.isStopped = !0, this._complete())
			}, t.prototype.unsubscribe = function() {
				this.closed || (this.isStopped = !0, e.prototype.unsubscribe.call(this), this.destination = null)
			}, t.prototype._next = function(e) {
				this.destination.next(e)
			}, t.prototype._error = function(e) {
				try {
					this.destination.error(e)
				} finally {
					this.unsubscribe()
				}
			}, t.prototype._complete = function() {
				try {
					this.destination.complete()
				} finally {
					this.unsubscribe()
				}
			}, t
		}(el),
		ey = Function.prototype.bind;

	function ev(e, t) {
		return ey.call(e, t)
	}
	var ej = function() {
			function e(e) {
				this.partialObserver = e
			}
			return e.prototype.next = function(e) {
				var t = this.partialObserver;
				if (t.next) try {
					t.next(e)
				} catch (e) {
					ew(e)
				}
			}, e.prototype.error = function(e) {
				var t = this.partialObserver;
				if (t.error) try {
					t.error(e)
				} catch (e) {
					ew(e)
				} else ew(e)
			}, e.prototype.complete = function() {
				var e = this.partialObserver;
				if (e.complete) try {
					e.complete()
				} catch (e) {
					ew(e)
				}
			}, e
		}(),
		eN = function(e) {
			function t(t, r, s) {
				var n, a, i = e.call(this) || this;
				return es(t) || !t ? n = {
					next: null != t ? t : void 0,
					error: null != r ? r : void 0,
					complete: null != s ? s : void 0
				} : n = t, i.destination = new ej(n), i
			}
			return (0, er.w)(t, e), t
		}(eg);

	function ew(e) {
		em.setTimeout(function() {
			!1;
			throw e
		})
	}

	function eC(e, t) {}
	var eS = {
			closed: !0,
			next: ef,
			error: function(e) {
				throw e
			},
			complete: ef
		},
		e_ = "function" == typeof Symbol && Symbol.observable || "@@observable",
		ek = function() {
			function e(e) {
				e && (this._subscribe = e)
			}
			return e.prototype.lift = function(t) {
				var r = new e;
				return r.source = this, r.operator = t, r
			}, e.prototype.subscribe = function(e, t, r) {
				var s = this,
					n = ! function(e) {
						return e && e instanceof eg || e && es(e.next) && es(e.error) && es(e.complete) && ec(e)
					}(e) ? new eN(e, t, r) : e;
				return eb(function() {
					var e = s.operator,
						t = s.source;
					n.add(e ? e.call(n, t) : t ? s._subscribe(n) : s._trySubscribe(n))
				}), n
			}, e.prototype._trySubscribe = function(e) {
				try {
					return this._subscribe(e)
				} catch (t) {
					e.error(t)
				}
			}, e.prototype.forEach = function(e, t) {
				var r = this;
				return new(t = ez(t))(function(t, s) {
					var n = new eN({
						next: function(t) {
							try {
								e(t)
							} catch (e) {
								s(e), n.unsubscribe()
							}
						},
						error: s,
						complete: t
					});
					r.subscribe(n)
				})
			}, e.prototype._subscribe = function(e) {
				var t;
				return null == (t = this.source) ? void 0 : t.subscribe(e)
			}, e.prototype[e_] = function() {
				return this
			}, e.prototype.pipe = function() {
				for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
				return (0 === e.length ? function(e) {
					return e
				} : 1 === e.length ? e[0] : function(t) {
					return e.reduce(function(e, t) {
						return t(e)
					}, t)
				})(this)
			}, e.prototype.toPromise = function(e) {
				var t = this;
				return new(e = ez(e))(function(e, r) {
					var s;
					t.subscribe(function(e) {
						return s = e
					}, function(e) {
						return r(e)
					}, function() {
						return e(s)
					})
				})
			}, e.create = function(t) {
				return new e(t)
			}, e
		}();

	function ez(e) {
		var t;
		return null != (t = null != e ? e : eu) ? t : Promise
	}
	var eP = en(function(e) {
			return function() {
				e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
			}
		}),
		eO = function(e) {
			function t() {
				var t = e.call(this) || this;
				return t.closed = !1, t.currentObservers = null, t.observers = [], t.isStopped = !1, t.hasError = !1, t.thrownError = null, t
			}
			return (0, er.w)(t, e), t.prototype.lift = function(e) {
				var t = new eA(this, this);
				return t.operator = e, t
			}, t.prototype._throwIfClosed = function() {
				if (this.closed) throw new eP
			}, t.prototype.next = function(e) {
				var t = this;
				eb(function() {
					var r, s;
					if (t._throwIfClosed(), !t.isStopped) {
						t.currentObservers || (t.currentObservers = Array.from(t.observers));
						try {
							for (var n = (0, er._)(t.currentObservers), a = n.next(); !a.done; a = n.next()) a.value.next(e)
						} catch (e) {
							r = {
								error: e
							}
						} finally {
							try {
								a && !a.done && (s = n.return) && s.call(n)
							} finally {
								if (r) throw r.error
							}
						}
					}
				})
			}, t.prototype.error = function(e) {
				var t = this;
				eb(function() {
					if (t._throwIfClosed(), !t.isStopped) {
						t.hasError = t.isStopped = !0, t.thrownError = e;
						for (var r = t.observers; r.length;) r.shift().error(e)
					}
				})
			}, t.prototype.complete = function() {
				var e = this;
				eb(function() {
					if (e._throwIfClosed(), !e.isStopped) {
						e.isStopped = !0;
						for (var t = e.observers; t.length;) t.shift().complete()
					}
				})
			}, t.prototype.unsubscribe = function() {
				this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
			}, Object.defineProperty(t.prototype, "observed", {
				get: function() {
					var e;
					return (null == (e = this.observers) ? void 0 : e.length) > 0
				},
				enumerable: !1,
				configurable: !0
			}), t.prototype._trySubscribe = function(t) {
				return this._throwIfClosed(), e.prototype._trySubscribe.call(this, t)
			}, t.prototype._subscribe = function(e) {
				return this._throwIfClosed(), this._checkFinalizedStatuses(e), this._innerSubscribe(e)
			}, t.prototype._innerSubscribe = function(e) {
				var t = this,
					r = this.hasError,
					s = this.isStopped,
					n = this.observers;
				return r || s ? eo : (this.currentObservers = null, n.push(e), new el(function() {
					t.currentObservers = null, ei(n, e)
				}))
			}, t.prototype._checkFinalizedStatuses = function(e) {
				var t = this.hasError,
					r = this.thrownError,
					s = this.isStopped;
				t ? e.error(r) : s && e.complete()
			}, t.prototype.asObservable = function() {
				var e = new ek;
				return e.source = this, e
			}, t.create = function(e, t) {
				return new eA(e, t)
			}, t
		}(ek),
		eA = function(e) {
			function t(t, r) {
				var s = e.call(this) || this;
				return s.destination = t, s.source = r, s
			}
			return (0, er.w)(t, e), t.prototype.next = function(e) {
				var t, r;
				null == (r = null == (t = this.destination) ? void 0 : t.next) || r.call(t, e)
			}, t.prototype.error = function(e) {
				var t, r;
				null == (r = null == (t = this.destination) ? void 0 : t.error) || r.call(t, e)
			}, t.prototype.complete = function() {
				var e, t;
				null == (t = null == (e = this.destination) ? void 0 : e.complete) || t.call(e)
			}, t.prototype._subscribe = function(e) {
				var t, r;
				return null != (r = null == (t = this.source) ? void 0 : t.subscribe(e)) ? r : eo
			}, t
		}(eO);
	let eI = new eO;

	function eE(e) {
		try {
			sessionStorage.setItem(z.t, JSON.stringify(e))
		} catch {}
	}
	var e$ = e.i(267729),
		eL = e.i(785156),
		eL = eL,
		eF = e.i(326383);

	function eT(e) {
		return X({
			tag: "svg",
			attr: {
				viewBox: "0 0 512 512"
			},
			child: [{
				tag: "path",
				attr: {
					d: "M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
				},
				child: []
			}]
		})(e)
	}
	var eM = e.i(483561),
		eU = e.i(486399);
	let eD = "720p";

	function eq() {
		return (0, eU.s)("lucy").map(e => {
			let t = (0, eU.J)("lucy", e),
				r = t ? (0, eU.Q)(t) : void 0,
				s = r ? (0, eU.U)(r) : void 0;
			if (!s) throw Error(`Lucy has no default ${e} model in the registry`);
			return {
				entry: s,
				surface: eU.p[s.surface]
			}
		})
	}

	function eB(e) {
		return [eU.I[e.pageGroup].title, e.versionLabel].filter(Boolean).join(" ")
	}

	function eR(e) {
		return eq().map(({
			entry: t,
			surface: r
		}) => ({
			surface: r,
			model: eB(t),
			seconds: e / function(e) {
				let t = (0, eU.P)(e, eD);
				if (void 0 === t) throw Error(`No ${eD} price for ${e.name} (${e.surface})`);
				return t
			}(t)
		}))
	}

	function eW() {
		return [...new Set(eq().map(({
			entry: e
		}) => eB(e)))].join(" / ")
	}
	let eH = {
		second: "s",
		minute: "m",
		hour: "h"
	};

	function eJ(e, t, r) {
		let s = e.toLocaleString("en-US");
		return "short" === r ? `${s}${eH[t]}` : `${s} ${1===e?t:`${t}s`}`
	}

	function eV(e, t = "short") {
		let r = Math.round(e);
		if (r < 60) return eJ(r, "second", t);
		let s = e / 60,
			n = Math.round(s);
		if (n < 60) return eJ(n, "minute", t);
		let a = e / 3600;
		if (a < 3) {
			let e = Math.floor(a),
				r = Math.round(s - 60 * e);
			return 60 === r ? eJ(e + 1, "hour", t) : 0 === r ? eJ(e, "hour", t) : `${eJ(e,"hour",t)} ${eJ(r,"minute",t)}`
		}
		return a < 10 ? eJ(Math.round(2 * a) / 2, "hour", t) : eJ(Math.round(a), "hour", t)
	}

	function eQ(e) {
		let r, s, n, a = (0, b.c)(7),
			{
				credits: i,
				className: l
			} = e;
		return a[0] !== l ? (r = (0, B.c)("flex w-full flex-col gap-1.5 border-y border-white/10 py-3 text-xs md:text-sm", l), a[0] = l, a[1] = r) : r = a[1], a[2] !== i ? (s = eR(i).map(eY), a[2] = i, a[3] = s) : s = a[3], a[4] !== r || a[5] !== s ? (n = (0, t.jsx)("dl", {
			className: r,
			children: s
		}), a[4] = r, a[5] = s, a[6] = n) : n = a[6], n
	}

	function eY(e) {
		return (0, t.jsxs)("div", {
			className: "flex items-center justify-between gap-3",
			children: [(0, t.jsx)("dt", {
				className: "text-[#9aa0a6]",
				children: e.surface
			}), (0, t.jsx)("dd", {
				className: "font-medium tabular-nums text-white",
				children: eV(e.seconds)
			})]
		}, e.surface)
	}

	function eK(e) {
		let r, s, n, a, i, l, o, c, u, m, f, p, h, x, y, v, j, N, w, C, S, k, P, O, A, I, E, $, L, F, T, U, D, H, J, V, Q, Y, K, Z, X, G = (0, b.c)(95),
			{
				onClose: et
			} = e,
			{
				data: er
			} = q.i.useSession(),
			es = R(),
			[en, ea] = (0, d.useState)(z.b.find(e1)?.id || z.b[0].id),
			[ei, el] = (0, d.useState)(""),
			[eo, ec] = (0, d.useState)(!1),
			ed = en === z.Q;
		G[0] !== ei ? (s = Number.parseInt(ei, 10), r = ei ? s.toLocaleString("en-US") : "", n = Number.isInteger(s) && s >= z.c && s <= z.m, a = Number.isInteger(s) && s > z.m, G[0] = ei, G[1] = r, G[2] = s, G[3] = n, G[4] = a) : (r = G[1], s = G[2], n = G[3], a = G[4]);
		let eu = a;
		G[5] !== ei || G[6] !== eu ? (i = ei ? eu ? `Over $${z.m.toLocaleString()}? Contact sales below` : `Enter between $${z.c.toLocaleString()} and $${z.m.toLocaleString()}` : `Any amount from $${z.c.toLocaleString()} to $${z.m.toLocaleString()}`, G[5] = ei, G[6] = eu, G[7] = i) : i = G[7];
		let em = i,
			ef = er?.user?.billingType === "marketplace";
		G[8] === Symbol.for("react.memo_cache_sentinel") ? (l = {
			mutationFn: e0,
			onSuccess: eG,
			onError: eX
		}, G[8] = l) : l = G[8];
		let ep = (0, g.f)(l);
		G[9] !== ep || G[10] !== s || G[11] !== n || G[12] !== ed || G[13] !== es.access || G[14] !== en || G[15] !== er?.user?.id ? (o = () => {
			if ("allowed" !== es.access) return;
			let e = er?.user?.id;
			if (ed) {
				if (!n) return;
				let t = s * z.a;
				_.f.trackCheckoutBegin({
					planId: z.Q,
					credits: t,
					price: s,
					userId: e
				}), eE({
					planId: z.Q,
					credits: t
				}), ep.mutate({
					planId: z.Q,
					amountUsd: s
				});
				return
			}
			let t = z.b.find(e => e.id === en);
			t && (_.f.trackCheckoutBegin({
				planId: t.id,
				credits: t.credits,
				price: t.price,
				userId: e
			}), eE({
				planId: t.id,
				credits: t.credits
			})), ep.mutate({
				planId: en
			})
		}, G[9] = ep, G[10] = s, G[11] = n, G[12] = ed, G[13] = es.access, G[14] = en, G[15] = er?.user?.id, G[16] = o) : o = G[16];
		let eh = o;
		if (ef) {
			let e, r, s, n, a, i, l, o, c;
			return G[17] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)(eF.X, {
				className: "size-6"
			}), r = (0, t.jsx)("span", {
				className: "sr-only",
				children: "Close"
			}), G[17] = e, G[18] = r) : (e = G[17], r = G[18]), G[19] !== et ? (s = (0, t.jsxs)("button", {
				type: "button",
				onClick: et,
				className: "absolute right-2.5 top-2.5 z-10 size-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer",
				children: [e, r]
			}), G[19] = et, G[20] = s) : s = G[20], G[21] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)("div", {
				className: "size-16 rounded-full bg-accent/10 flex items-center justify-center",
				children: (0, t.jsx)(ee, {
					className: "size-8 text-accent"
				})
			}), i = (0, t.jsx)("h2", {
				className: "text-2xl font-medium text-center",
				children: "AWS Marketplace Billing"
			}), n = (0, t.jsx)("p", {
				className: "text-sm text-[#9aa0a6] text-center max-w-md",
				children: "Your usage is billed through AWS Marketplace. Credits are automatically metered and will appear on your AWS bill at the end of the billing cycle."
			}), G[21] = n, G[22] = a, G[23] = i) : (n = G[21], a = G[22], i = G[23]), G[24] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("p", {
				className: "text-sm text-accent text-center",
				children: "No need to purchase credits separately - just use the API and AWS handles the billing!"
			}), G[24] = l) : l = G[24], G[25] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-4 py-8",
				children: [a, i, n, (0, t.jsxs)("div", {
					className: "bg-accent/10 border border-accent/30 rounded-lg p-4 mt-4 gap-2 flex flex-col items-center",
					children: [l, (0, t.jsxs)("div", {
						className: "flex items-center gap-1 justify-center text-accent ",
						children: [(0, t.jsx)("a", {
							href: "https://console.aws.amazon.com/billing",
							target: "_blank",
							rel: "noopener noreferrer",
							className: "text-accent underline text-sm text-center",
							children: "View AWS Billing Console"
						}), (0, t.jsx)(eL.f, {
							className: "size-4 text-accent"
						})]
					})]
				})]
			}), G[25] = o) : o = G[25], G[26] !== s ? (c = (0, t.jsxs)("div", {
				className: "flex flex-col max-w-full gap-6 p-8",
				children: [s, o]
			}), G[26] = s, G[27] = c) : c = G[27], c
		}
		if (G[28] === Symbol.for("react.memo_cache_sentinel") ? (c = (0, t.jsx)(eF.X, {
				className: "size-6"
			}), u = (0, t.jsx)("span", {
				className: "sr-only",
				children: "Close"
			}), G[28] = c, G[29] = u) : (c = G[28], u = G[29]), G[30] !== et ? (m = (0, t.jsxs)("button", {
				type: "button",
				onClick: et,
				className: "absolute right-2.5 top-2.5 z-10 size-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground cursor-pointer",
				children: [c, u]
			}), G[30] = et, G[31] = m) : m = G[31], G[32] === Symbol.for("react.memo_cache_sentinel") ? (f = (0, t.jsx)("h2", {
				className: "text-2xl pb-1",
				children: "Buy more credits"
			}), G[32] = f) : f = G[32], G[33] === Symbol.for("react.memo_cache_sentinel")) {
			let e;
			p = (0, t.jsxs)("div", {
				className: "px-4 pt-7",
				children: [f, (0, t.jsxs)("p", {
					className: "text-sm text-[#9aa0a6]",
					children: ["$1 = ", z.a, " Credits. That's ", (e = eR(z.a).map(e => `${eV(e.seconds,"long")} in ${e.surface}`), `about ${e.join(" or ")} with ${eW()}`), "."]
				})]
			}), G[33] = p
		} else p = G[33];
		G[34] !== es ? (h = (0, t.jsx)(W, {
			account: es
		}), G[34] = es, G[35] = h) : h = G[35], G[36] !== en ? (x = z.b.map(e => {
			let r = en === e.id;
			return (0, t.jsxs)("button", {
				type: "button",
				onClick: () => ea(e.id),
				"aria-pressed": r,
				className: (0, B.c)("relative flex w-full flex-col rounded-xl border-2 bg-black p-4 transition-colors cursor-pointer", r ? "border-white" : "border-transparent hover:border-white/40"),
				children: [e.popular && (0, t.jsx)("span", {
					className: "absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#0037ff] px-2.5 py-0.5 text-xs font-medium text-white",
					children: "Popular"
				}), (0, t.jsxs)("div", {
					className: "flex min-h-14 w-full flex-col items-center gap-0.5 text-center",
					children: [(0, t.jsx)("span", {
						className: (0, B.c)("text-xs font-semibold uppercase tracking-wider", r ? "text-white" : "text-[#9aa0a6]"),
						children: e.name
					}), (0, t.jsx)("span", {
						className: "text-xs text-[#9aa0a6]",
						children: e.tagline
					})]
				}), (0, t.jsxs)("div", {
					className: "mt-3 flex w-full flex-col items-center",
					children: [(0, t.jsx)("span", {
						className: "text-2xl font-semibold tabular-nums text-white",
						children: e.credits.toLocaleString()
					}), (0, t.jsx)("span", {
						className: "text-sm text-[#9aa0a6]",
						children: "Credits"
					})]
				}), (0, t.jsx)(eQ, {
					credits: e.credits,
					className: "mt-4"
				}), (0, t.jsxs)("div", {
					className: (0, B.c)("mt-4 w-full rounded-full border px-4 py-3 text-center text-sm transition-colors", r ? "border-white bg-white text-black" : "border-[#9aa0a6] text-[#9aa0a6]"),
					children: ["Buy for $", e.price.toLocaleString("en-US")]
				})]
			}, e.id)
		}), G[36] = en, G[37] = x) : x = G[37], G[38] !== x ? (y = (0, t.jsx)("div", {
			className: "grid grid-cols-2 md:grid-cols-4 gap-2 px-2 w-full max-w-full ",
			children: x
		}), G[38] = x, G[39] = y) : y = G[39], G[40] === Symbol.for("react.memo_cache_sentinel") ? (v = (0, t.jsx)("p", {
			className: "-mt-3 px-4 text-xs text-[#9aa0a6]",
			children: `Approximate times for ${eW()} at standard speed.`
		}), G[40] = v) : v = G[40];
		let ex = ed ? "border-white" : "border-[#9aa0a6]/30 hover:border-[#9aa0a6]";
		G[41] !== ex ? (j = (0, B.c)("mx-2 flex items-center justify-between gap-4 rounded-xl px-4 py-3 bg-black border transition-all cursor-pointer", ex), G[41] = ex, G[42] = j) : j = G[42];
		let eb = ed ? "bg-[#0037ff]" : "bg-[#9AA0A6]";
		G[43] !== eb ? (N = (0, B.c)("size-8 rounded-full flex items-center justify-center shrink-0", eb), G[43] = eb, G[44] = N) : N = G[44], G[45] === Symbol.for("react.memo_cache_sentinel") ? (w = (0, t.jsx)(ee, {
			className: "size-5 text-black"
		}), G[45] = w) : w = G[45], G[46] !== N ? (C = (0, t.jsx)("div", {
			className: N,
			children: w
		}), G[46] = N, G[47] = C) : C = G[47], G[48] !== ei || G[49] !== em || G[50] !== s || G[51] !== n || G[52] !== ed ? (S = n ? (0, t.jsxs)("div", {
			className: "flex flex-col items-start gap-0.5",
			children: [(0, t.jsxs)("div", {
				className: "flex items-baseline gap-1.5",
				children: [(0, t.jsx)("span", {
					className: "text-2xl font-semibold leading-tight tabular-nums text-white",
					children: (s * z.a).toLocaleString()
				}), (0, t.jsx)("span", {
					className: "text-sm text-[#9aa0a6]",
					children: "Credits"
				})]
			}), (0, t.jsx)("span", {
				className: "text-xs text-[#9aa0a6]",
				children: eR(s * z.a).map(eZ)
			})]
		}) : (0, t.jsxs)("div", {
			className: "flex flex-col items-start",
			children: [(0, t.jsx)("span", {
				className: (0, B.c)("text-sm font-medium", ed ? "text-white" : "text-[#9aa0a6]"),
				children: "Custom amount"
			}), (0, t.jsx)("span", {
				className: (0, B.c)("text-xs", ei ? "text-destructive" : "text-[#9aa0a6]"),
				children: em
			})]
		}), G[48] = ei, G[49] = em, G[50] = s, G[51] = n, G[52] = ed, G[53] = S) : S = G[53], G[54] !== C || G[55] !== S ? (k = (0, t.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [C, S]
		}), G[54] = C, G[55] = S, G[56] = k) : k = G[56];
		let eg = ed ? "border-white text-white" : "border-[#9aa0a6] text-[#9aa0a6]";
		G[57] !== eg ? (P = (0, B.c)("flex items-center gap-1 rounded-full border px-4 py-3 text-base transition-colors", eg), G[57] = eg, G[58] = P) : P = G[58], G[59] === Symbol.for("react.memo_cache_sentinel") ? (O = (0, t.jsx)("span", {
			className: "font-medium",
			children: "$"
		}), G[59] = O) : O = G[59], G[60] === Symbol.for("react.memo_cache_sentinel") ? (A = e => el(e.target.value.replace(/[^0-9]/g, "").slice(0, 7)), I = () => ea(z.Q), G[60] = A, G[61] = I) : (A = G[60], I = G[61]);
		let ey = `${Math.max(r.length,5)}ch`;
		G[62] !== ey ? (E = {
			width: ey
		}, G[62] = ey, G[63] = E) : E = G[63], G[64] !== r || G[65] !== E ? ($ = (0, t.jsx)("input", {
			type: "text",
			inputMode: "numeric",
			placeholder: "1,000",
			value: r,
			onChange: A,
			onFocus: I,
			style: E,
			className: "bg-transparent text-white placeholder:text-[#9aa0a6]/60 focus:outline-none",
			"aria-label": "Custom amount in US dollars"
		}), G[64] = r, G[65] = E, G[66] = $) : $ = G[66], G[67] !== P || G[68] !== $ ? (L = (0, t.jsxs)("div", {
			className: P,
			children: [O, $]
		}), G[67] = P, G[68] = $, G[69] = L) : L = G[69], G[70] !== j || G[71] !== k || G[72] !== L ? (F = (0, t.jsxs)("label", {
			className: j,
			children: [k, L]
		}), G[70] = j, G[71] = k, G[72] = L, G[73] = F) : F = G[73], G[74] === Symbol.for("react.memo_cache_sentinel") ? (T = () => ec(!0), G[74] = T) : T = G[74], G[75] === Symbol.for("react.memo_cache_sentinel") ? (U = (0, t.jsx)("div", {
			className: "size-8 rounded-full bg-[#9AA0A6] flex items-center justify-center shrink-0",
			children: (0, t.jsx)(M.f, {
				className: "size-4 text-black"
			})
		}), G[75] = U) : U = G[75], G[76] === Symbol.for("react.memo_cache_sentinel") ? (D = (0, t.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [U, (0, t.jsxs)("div", {
				className: "flex flex-col items-start",
				children: [(0, t.jsx)("span", {
					className: "text-sm font-medium text-white",
					children: "Enterprise"
				}), (0, t.jsx)("span", {
					className: "text-xs text-[#9aa0a6]",
					children: "Custom volume, dedicated support & SLA"
				})]
			})]
		}), G[76] = D) : D = G[76], G[77] === Symbol.for("react.memo_cache_sentinel") ? (H = (0, t.jsxs)("button", {
			type: "button",
			onClick: T,
			className: "group mx-2 flex items-center justify-between rounded-xl px-4 py-4 bg-black border border-[#9aa0a6]/30 hover:border-[#9aa0a6] transition-all cursor-pointer",
			children: [D, (0, t.jsxs)("span", {
				className: "text-sm text-[#9aa0a6] group-hover:text-white flex items-center gap-1 transition-colors",
				children: ["Contact Sales ", (0, t.jsx)(e$.f, {
					className: "size-3.5"
				})]
			})]
		}), G[77] = H) : H = G[77], G[78] !== eo ? (J = (0, t.jsx)(eM.f, {
			open: eo,
			onOpenChange: ec
		}), G[78] = eo, G[79] = J) : J = G[79], G[80] === Symbol.for("react.memo_cache_sentinel") ? (V = (0, t.jsx)(eT, {
			className: "size-6 text-[#9aa0a6]"
		}), G[80] = V) : V = G[80], G[81] === Symbol.for("react.memo_cache_sentinel") ? (Q = (0, t.jsxs)("div", {
			className: "flex gap-3 items-center",
			children: [V, (0, t.jsxs)("div", {
				className: "flex flex-col",
				children: [(0, t.jsx)("span", {
					className: "text-xs font-medium text-[#9aa0a6]",
					children: "Inquiries"
				}), (0, t.jsx)("span", {
					className: "text-sm text-white tracking-[0.28px]",
					children: "contact@decart.ai"
				})]
			})]
		}), G[81] = Q) : Q = G[81], G[82] === Symbol.for("react.memo_cache_sentinel") ? (Y = (0, t.jsxs)("div", {
			className: "flex gap-1 items-center",
			children: [(0, t.jsx)("span", {
				className: "text-xs text-[#9aa0a6]",
				children: "Powered by"
			}), (0, t.jsx)("span", {
				className: "text-xs text-white font-bold",
				children: "Stripe"
			})]
		}), G[82] = Y) : Y = G[82];
		let ev = ep.isPending || "allowed" !== es.access || ed && !n,
			ej = ep.isPending ? "Processing..." : "Checkout";
		return G[83] === Symbol.for("react.memo_cache_sentinel") ? (K = (0, t.jsx)(e$.f, {
			className: "size-5"
		}), G[83] = K) : K = G[83], G[84] !== eh || G[85] !== ev || G[86] !== ej ? (Z = (0, t.jsxs)("div", {
			className: "bg-black flex gap-4 md:items-center flex-col md:flex-row md:justify-between p-3 w-full rounded-b-xl",
			children: [Q, (0, t.jsxs)("div", {
				className: "flex md:justify-end justify-between items-center gap-4",
				children: [Y, (0, t.jsxs)("button", {
					type: "button",
					onClick: eh,
					disabled: ev,
					className: "bg-[#0037ff] hover:bg-[#0030dd] disabled:opacity-50 text-white px-5 py-3 rounded-full flex items-center gap-2 font-medium transition-colors cursor-pointer",
					children: [ej, K]
				})]
			})]
		}), G[84] = eh, G[85] = ev, G[86] = ej, G[87] = Z) : Z = G[87], G[88] !== h || G[89] !== y || G[90] !== F || G[91] !== J || G[92] !== Z || G[93] !== m ? (X = (0, t.jsxs)("div", {
			className: "flex flex-col max-w-full gap-6",
			children: [m, p, h, y, v, F, H, J, Z]
		}), G[88] = h, G[89] = y, G[90] = F, G[91] = J, G[92] = Z, G[93] = m, G[94] = X) : X = G[94], X
	}

	function eZ(e, r) {
		return (0, t.jsxs)("span", {
			children: [r > 0 && " · ", e.surface, " ", (0, t.jsx)("span", {
				className: "font-medium tabular-nums text-white",
				children: eV(e.seconds)
			})]
		}, e.surface)
	}

	function eX(e) {
		console.error("Checkout error:", e), u.c.error("Failed to start checkout process")
	}

	function eG(e) {
		e.url && (window.location.href = e.url)
	}
	async function e0(e) {
		let t = await fetch("/api/stripe/checkout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(e)
		});
		if (!t.ok) throw Error("Failed to create checkout session");
		return t.json()
	}

	function e1(e) {
		return e.selected
	}

	function e2(e) {
		let r, s, n, a, i, l, o = (0, b.c)(10),
			{
				prominent: c,
				canPurchase: u
			} = e,
			m = void 0 === u || u,
			[p, h] = (0, d.useState)(!1);
		return o[0] === Symbol.for("react.memo_cache_sentinel") ? (r = () => {
			let e = eI.subscribe(() => {
				h(!0)
			});
			return () => e.unsubscribe()
		}, s = [], o[0] = r, o[1] = s) : (r = o[0], s = o[1]), (0, d.useEffect)(r, s), o[2] !== m || o[3] !== c ? (n = m ? (0, t.jsx)(et.a, {
			asChild: !0,
			children: c ? (0, t.jsxs)(f.f, {
				className: "w-full",
				children: [(0, t.jsx)(ee, {
					className: "size-3.5"
				}), "Add Credits"]
			}) : (0, t.jsxs)(f.f, {
				variant: "outline",
				className: "h-8 text-xs px-3 rounded-full bg-transparent border border-white/30 hover:border-white/50 hover:bg-white/10 transition-all",
				children: [(0, t.jsx)(ee, {
					className: "size-3"
				}), "Add Credits"]
			})
		}) : null, o[2] = m, o[3] = c, o[4] = n) : n = o[4], o[5] === Symbol.for("react.memo_cache_sentinel") ? (a = (0, t.jsx)(et.F, {
			hidden: !0,
			children: "Buy more credits"
		}), o[5] = a) : a = o[5], o[6] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsxs)(et.d, {
			className: "bg-card border-none rounded-xl shadow-2xl max-w-[95vw] md:max-w-3xl w-full p-0",
			showCloseButton: !1,
			onOpenAutoFocus: e3,
			children: [a, (0, t.jsx)(eK, {
				onClose: () => h(!1)
			})]
		}), o[6] = i) : i = o[6], o[7] !== p || o[8] !== n ? (l = (0, t.jsxs)(et.N, {
			open: p,
			onOpenChange: h,
			children: [n, i]
		}), o[7] = p, o[8] = n, o[9] = l) : l = o[9], l
	}

	function e3(e) {
		return e.preventDefault()
	}
	var e4 = e.i(815924),
		e5 = e.i(278396),
		e8 = e.i(870505),
		e6 = e.i(149218);
	async function e7() {
		let e = await fetch("/api/user/refund");
		return await (0, k.W)(e, "Failed to load refund status"), e.json()
	}
	let e9 = ["user", "refund"];
	async function te(e) {
		let t = await fetch("/api/user/refund", {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				userExplanation: e.userExplanation
			})
		});
		if (!t.ok) throw Error((await t.json().catch(tt)).error || `Request failed: ${t.status}`);
		return t.json()
	}

	function tt() {
		return {}
	}
	var tr = e.i(892602),
		ts = e.i(871101),
		tn = e.i(538882);
	let ta = ts.z.object({
		userExplanation: tn.z.string().trim().min(10, "Tell us a little about why you'd like a refund — at least a sentence.").max(2e3, "Please keep it under 2,000 characters.")
	});

	function ti() {
		let e, r, s, n, i, l, o, c, m, h, x, j, N, w, C, S, _, k = (0, b.c)(36),
			{
				data: z,
				isLoading: P
			} = ((w = (0, b.c)(1))[0] === Symbol.for("react.memo_cache_sentinel") ? (N = {
				queryKey: e9,
				queryFn: e7
			}, w[0] = N) : N = w[0], (0, y.f)(N)),
			O = (S = (0, b.c)(2), _ = (0, v.d)(), S[0] !== _ ? (C = {
				mutationFn: te,
				onSuccess: () => _.invalidateQueries({
					queryKey: e9
				})
			}, S[0] = _, S[1] = C) : C = S[1], (0, g.f)(C)),
			[A, I] = (0, d.useState)(""),
			[E, $] = (0, d.useState)(null);
		if (P || !z?.request) return null;
		let {
			request: L,
			estimate: F
		} = z;
		if ("declined" === L.status || "failed" === L.status) return null;
		k[0] !== A || k[1] !== O ? (e = async () => {
			let e = ta.safeParse({
				userExplanation: A
			});
			if (!e.success) return void $(e.error.issues[0]?.message ?? "Please add a brief reason.");
			$(null);
			try {
				await O.mutateAsync(e.data), u.c.success("Refund request submitted. We'll review it shortly.")
			} catch (e) {
				u.c.error(e instanceof Error ? e.message : "Failed to submit refund request")
			}
		}, k[0] = A, k[1] = O, k[2] = e) : e = k[2];
		let T = e;
		if ("approved" === L.status) {
			let e, r, s;
			return k[3] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("div", {
				className: "rounded-lg bg-primary/10 p-2",
				children: (0, t.jsx)(e5.f, {
					className: "size-5 text-primary"
				})
			}), k[3] = e) : e = k[3], k[4] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)("h2", {
				className: "text-sm font-semibold",
				children: "Refund issued"
			}), k[4] = r) : r = k[4], k[5] !== L.refundAmountCents ? (s = (0, t.jsx)(p.N, {
				className: "p-5 border border-border bg-background mb-6",
				children: (0, t.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [e, (0, t.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [r, (0, t.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: null != L.refundAmountCents ? (0, t.jsxs)(t.Fragment, {
								children: ["We've issued a refund of", " ", (0, t.jsx)("span", {
									className: "font-medium text-foreground",
									children: (0, tr.f)(L.refundAmountCents)
								}), " ", "to your original payment method. It may take a few business days to appear."]
							}) : (0, t.jsx)(t.Fragment, {
								children: "Your refund has been issued to your original payment method."
							})
						})]
					})]
				})
			}), k[5] = L.refundAmountCents, k[6] = s) : s = k[6], s
		}
		if ("pending" === L.status) {
			let e, r;
			return k[7] === Symbol.for("react.memo_cache_sentinel") ? (e = (0, t.jsx)("div", {
				className: "rounded-lg bg-muted p-2",
				children: (0, t.jsx)(e8.f, {
					className: "size-5 text-muted-foreground"
				})
			}), k[7] = e) : e = k[7], k[8] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)(p.N, {
				className: "p-5 border border-border bg-background mb-6",
				children: (0, t.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [e, (0, t.jsxs)("div", {
						className: "flex flex-col gap-1",
						children: [(0, t.jsx)("h2", {
							className: "text-sm font-semibold",
							children: "Refund request under review"
						}), (0, t.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Thanks — we've received your refund request and our team will review it shortly. We'll email you as soon as there's a decision."
						})]
					})]
				})
			}), k[8] = r) : r = k[8], r
		}
		k[9] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsx)("div", {
			className: "rounded-lg bg-primary/10 p-2",
			children: (0, t.jsx)(e4.f, {
				className: "size-5 text-primary"
			})
		}), k[9] = r) : r = k[9], k[10] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)("h2", {
			className: "text-sm font-semibold",
			children: "Request a refund"
		}), k[10] = s) : s = k[10], k[11] !== F ? (n = F && F.refundAmountCents > 0 ? (0, t.jsxs)(t.Fragment, {
			children: [" ", "— up to", " ", (0, t.jsx)("span", {
				className: "font-medium text-foreground",
				children: (0, tr.f)(F.refundAmountCents)
			}), " ", "for your unused credits"]
		}) : null, k[11] = F, k[12] = n) : n = k[12], k[13] !== n ? (i = (0, t.jsxs)("div", {
			className: "flex flex-col gap-1",
			children: [s, (0, t.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: ["You're eligible to request a refund of your most recent credit purchase", n, ". Tell us a little about why, and our team will review it."]
			})]
		}), k[13] = n, k[14] = i) : i = k[14], k[15] !== E ? (l = e => {
			I(e.target.value), E && $(null)
		}, k[15] = E, k[16] = l) : l = k[16];
		let M = !!E || void 0;
		return k[17] !== A || k[18] !== l || k[19] !== M ? (o = (0, t.jsx)(e6.f, {
			value: A,
			onChange: l,
			placeholder: "A sentence or two about why you'd like a refund…",
			maxLength: 2e3,
			className: "min-h-24",
			"aria-invalid": M
		}), k[17] = A, k[18] = l, k[19] = M, k[20] = o) : o = k[20], k[21] !== E ? (c = E ? (0, t.jsx)("p", {
			className: "text-xs text-destructive",
			children: E
		}) : null, k[21] = E, k[22] = c) : c = k[22], k[23] !== o || k[24] !== c ? (m = (0, t.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [o, c]
		}), k[23] = o, k[24] = c, k[25] = m) : m = k[25], k[26] !== O.isPending ? (h = O.isPending ? (0, t.jsx)(a.f, {
			className: "size-3.5 animate-spin"
		}) : null, k[26] = O.isPending, k[27] = h) : h = k[27], k[28] !== T || k[29] !== O.isPending || k[30] !== h ? (x = (0, t.jsx)("div", {
			className: "flex justify-end",
			children: (0, t.jsxs)(f.f, {
				size: "sm",
				onClick: T,
				disabled: O.isPending,
				className: "gap-1",
				children: [h, "Request refund"]
			})
		}), k[28] = T, k[29] = O.isPending, k[30] = h, k[31] = x) : x = k[31], k[32] !== x || k[33] !== i || k[34] !== m ? (j = (0, t.jsx)(p.N, {
			className: "p-5 border border-border bg-background mb-6",
			children: (0, t.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [r, (0, t.jsxs)("div", {
					className: "flex-1 flex flex-col gap-3",
					children: [i, m, x]
				})]
			})
		}), k[32] = x, k[33] = i, k[34] = m, k[35] = j) : j = k[35], j
	}
	let tl = {
		manual: "Manual",
		auto: "Auto",
		invoice: "Invoice"
	};
	e.s(["default", 0, function() {
		let e = (0, c.useSearchParams)(),
			{
				data: i
			} = q.i.useSession(),
			{
				refetchUser: l
			} = (0, x.f)(),
			b = R(),
			[g, y] = (0, d.useState)(null),
			[v, j] = (0, d.useState)(!0),
			[N, w] = (0, d.useState)(null),
			[C, S] = (0, d.useState)(!1),
			k = i?.session?.activeOrganizationId,
			P = "allowed" === b.access,
			A = k ? b.organizationName : b.organizationCount > 0 ? "Personal account" : null,
			I = (0, d.useRef)(null);
		(0, d.useEffect)(() => {
			let t = e.get("success"),
				r = e.get("session_id");
			if ("true" === t && r && g?.transactions) {
				let e = g.transactions.find(e => e.stripeSessionId === r);
				if (e && I.current !== r) {
					I.current = r;
					let t = i?.user?.id,
						s = function() {
							try {
								let e = sessionStorage.getItem(z.t);
								if (!e) return null;
								sessionStorage.removeItem(z.t);
								let t = JSON.parse(e);
								if ("object" == typeof t && null !== t && "planId" in t && "string" == typeof t.planId && "credits" in t && "number" == typeof t.credits) return {
									planId: t.planId,
									credits: t.credits
								};
								return null
							} catch {
								return null
							}
						}(),
						n = s && s.credits === e.credits ? s.planId : z.b.find(t => t.credits === e.credits)?.id ?? z.Q;
					_.f.trackPurchaseComplete({
						transactionId: r,
						credits: e.credits,
						price: e.amountCents / 100,
						planId: n,
						userId: t
					}), l();
					let a = `${e.credits.toLocaleString("en-US")} Credits`;
					"completed" === e.status ? u.c.success(`${a} added`) : "failed" !== e.status && "reversed" !== e.status && u.c.info(`Payment received. ${a} will be added once it clears.`), window.history.replaceState({}, "", "/billing")
				}
			}
		}, [e, g, i, l]), (0, d.useEffect)(() => {
			$()
		}, [k]);
		let $ = async () => {
			try {
				j(!0);
				let e = await fetch("/api/user/billing");
				if (!e.ok) throw Error("Failed to fetch billing data");
				let t = await e.json();
				y(t)
			} catch (e) {
				w(e instanceof Error ? e.message : "An error occurred")
			} finally {
				j(!1)
			}
		}, L = async e => {
			try {
				await navigator.clipboard.writeText(e), u.c.success("Copied transaction ID")
			} catch {
				u.c.error("Failed to copy")
			}
		}, T = async () => {
			try {
				S(!0);
				let e = await fetch("/api/stripe/portal", {
					method: "POST"
				});
				if (!e.ok) throw Error("Failed to open billing portal");
				let {
					url: t
				} = await e.json();
				t && (window.location.href = t)
			} catch (e) {
				u.c.error(e instanceof Error ? e.message : "Failed to open billing portal")
			} finally {
				S(!1)
			}
		};
		if (v && !g) return (0, t.jsx)("div", {
			className: "w-full h-full p-6 flex items-center justify-center",
			children: (0, t.jsx)(a.f, {
				className: "size-8 animate-spin text-muted-foreground"
			})
		});
		if (N) return (0, t.jsx)("div", {
			className: "w-full h-full p-6",
			children: (0, t.jsx)("div", {
				className: "max-w-6xl mx-auto",
				children: (0, t.jsx)(p.N, {
					className: "p-8 text-center",
					children: (0, t.jsxs)("p", {
						className: "text-destructive",
						children: ["Error loading billing data: ", N]
					})
				})
			})
		});
		let M = g?.billingType === "marketplace" && g?.marketplaceInfo?.provider === "aws_marketplace";
		return (0, t.jsx)("div", {
			className: (0, B.c)("w-full h-full p-6 transition-opacity", v && "opacity-60"),
			"aria-busy": v,
			children: (0, t.jsxs)("div", {
				className: "max-w-6xl mx-auto",
				children: [M ? (0, t.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
					children: [(0, t.jsxs)(p.N, {
						className: "p-5 border border-border bg-background",
						children: [(0, t.jsx)("p", {
							className: "text-xs text-muted-foreground mb-1",
							children: "Credit Balance"
						}), (0, t.jsx)("div", {
							className: "text-3xl font-semibold text-foreground",
							children: g?.currentCredits.toLocaleString() || 0
						})]
					}), (0, t.jsx)(E, {})]
				}) : (0, t.jsxs)("div", {
					className: "grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 mb-6",
					children: [(0, t.jsxs)(p.N, {
						className: "p-5 border border-border bg-background flex flex-col justify-between gap-4",
						children: [(0, t.jsxs)("div", {
							children: [(0, t.jsxs)("p", {
								className: "text-xs text-muted-foreground mb-1",
								children: ["Credit Balance", A ? ` \xb7 ${A}` : ""]
							}), (0, t.jsx)("div", {
								className: "text-3xl font-semibold text-foreground",
								children: g?.currentCredits.toLocaleString() || 0
							}), (0, t.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "credits"
							})]
						}), (0, t.jsx)(e2, {
							prominent: !0,
							canPurchase: P
						})]
					}), P && (0, t.jsx)(O, {
						activeOrgId: k
					})]
				}), (0, t.jsx)(ti, {}), P && (0, t.jsx)(F, {
					invoices: g?.openInvoices ?? []
				}), (0, t.jsxs)(p.N, {
					className: "p-0 overflow-hidden border border-border bg-background",
					children: [(0, t.jsxs)("div", {
						className: "px-4 py-3 border-b flex items-center justify-between",
						children: [(0, t.jsxs)("div", {
							children: [(0, t.jsx)("h2", {
								className: "text-sm font-semibold",
								children: "Transaction History"
							}), (0, t.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Past 12 months"
							})]
						}), (0, t.jsx)("div", {
							className: "flex items-center gap-2",
							children: !M && P && (0, t.jsxs)(f.f, {
								variant: "link",
								size: "sm",
								onClick: T,
								disabled: C,
								className: "h-auto p-0 has-[>svg]:px-0 gap-1 text-xs font-normal text-muted-foreground hover:text-foreground no-underline hover:underline",
								children: [C ? (0, t.jsx)(a.f, {
									className: "size-3 animate-spin"
								}) : (0, t.jsx)(n.f, {
									className: "size-3"
								}), "Manage billing"]
							})
						})]
					}), g?.transactions && g.transactions.length > 0 ? (0, t.jsx)("div", {
						className: "overflow-x-auto",
						children: (0, t.jsxs)("table", {
							className: "w-full",
							children: [(0, t.jsx)("thead", {
								children: (0, t.jsxs)("tr", {
									className: "border-b bg-muted/30",
									children: [(0, t.jsx)("th", {
										className: "text-left px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Date"
									}), (0, t.jsx)("th", {
										className: "text-left px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Type"
									}), (0, t.jsx)("th", {
										className: "text-left px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Status"
									}), (0, t.jsx)("th", {
										className: "text-right px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Amount"
									}), (0, t.jsx)("th", {
										className: "text-right px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Credits"
									}), (0, t.jsx)("th", {
										className: "text-left px-4 py-2 font-medium text-xs text-muted-foreground",
										children: "Transaction"
									}), (0, t.jsx)("th", {
										className: "w-10 px-2 py-2",
										children: (0, t.jsx)("span", {
											className: "sr-only",
											children: "Actions"
										})
									})]
								})
							}), (0, t.jsx)("tbody", {
								children: g.transactions.map(e => {
									var n;
									let a, i, l, c = e.stripeSessionId || e.id;
									return (0, t.jsxs)("tr", {
										className: "border-b hover:bg-muted/20 transition-colors",
										children: [(0, t.jsx)("td", {
											className: "px-4 py-3 text-xs text-muted-foreground whitespace-nowrap",
											children: (a = new Date(e.createdAt), i = new Date().getFullYear(), a.toLocaleDateString("en-US", {
												month: "short",
												day: "numeric",
												...a.getFullYear() === i ? {} : {
													year: "numeric"
												},
												hour: "numeric",
												minute: "2-digit"
											}))
										}), (0, t.jsx)("td", {
											className: "px-4 py-3",
											children: (0, t.jsx)(m.f, {
												variant: "outline",
												className: "capitalize text-[10px] px-1.5 py-0",
												children: tl[e.type]
											})
										}), (0, t.jsx)("td", {
											className: "px-4 py-3",
											children: (n = e.status, (0, t.jsx)(m.f, {
												variant: {
													completed: "default",
													pending: "secondary",
													pending_review: "secondary",
													pending_grant: "secondary",
													failed: "destructive",
													reversed: "destructive"
												} [n],
												children: {
													completed: "Completed",
													pending: "Pending",
													pending_review: "Pending review",
													pending_grant: "Processing",
													failed: "Failed",
													reversed: "Reversed"
												} [n]
											}))
										}), (0, t.jsx)("td", {
											className: "px-4 py-3 text-sm font-medium text-right tabular-nums",
											children: (l = e.amountCents, new Intl.NumberFormat("en-US", {
												style: "currency",
												currency: "USD"
											}).format(l / 100))
										}), (0, t.jsx)("td", {
											className: "px-4 py-3 text-right",
											children: (0, t.jsxs)("span", {
												className: `text-sm font-medium tabular-nums ${e.credits<0?"text-destructive":"text-primary"}`,
												children: [e.credits > 0 ? "+" : "", e.credits.toLocaleString()]
											})
										}), (0, t.jsx)("td", {
											className: "px-4 py-3",
											children: (0, t.jsx)("span", {
												title: c,
												className: "text-xs font-mono text-muted-foreground",
												children: c.length <= 18 ? c : `${c.slice(0,12)}…${c.slice(-4)}`
											})
										}), (0, t.jsx)("td", {
											className: "px-2 py-3 text-right",
											children: (0, t.jsxs)(h.G, {
												children: [(0, t.jsx)(h.X, {
													asChild: !0,
													children: (0, t.jsx)(f.f, {
														variant: "ghost",
														size: "icon",
														"aria-label": "Transaction actions",
														className: "size-7 rounded-md text-muted-foreground",
														children: (0, t.jsx)(s.f, {
															className: "size-4"
														})
													})
												}), (0, t.jsxs)(h.L, {
													align: "end",
													children: [(0, t.jsxs)(h.r, {
														onClick: () => L(c),
														children: [(0, t.jsx)(r.f, {
															className: "size-3.5"
														}), "Copy ID"]
													}), (e.stripePaymentIntentId || e.stripeSessionId) && "completed" === e.status && e.credits > 0 && (0, t.jsx)(h.r, {
														asChild: !0,
														children: (0, t.jsxs)("a", {
															href: `/api/stripe/receipt/${e.stripePaymentIntentId||e.stripeSessionId}`,
															target: "_blank",
															rel: "noopener noreferrer",
															children: [(0, t.jsx)(o, {
																className: "size-3.5"
															}), "View receipt"]
														})
													})]
												})]
											})
										})]
									}, e.id)
								})
							})]
						})
					}) : (0, t.jsx)("div", {
						className: "p-8 text-center text-sm text-muted-foreground",
						children: "No transactions found"
					})]
				})]
			})
		})
	}], 836437)
}]);