(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 663303, e => {
	"use strict";
	let t, r, n, o, i, a;
	var s, l, u = e.i(582018);

	function _(e) {
		return Object.fromEntries(Object.entries(e).map(([e, t]) => [e, {
			code: e,
			message: t,
			toString: () => e
		}]))
	}
	let E = _({
			INVALID_METADATA_TYPE: "metadata must be an object or undefined",
			REFILL_AMOUNT_AND_INTERVAL_REQUIRED: "refillAmount is required when refillInterval is provided",
			REFILL_INTERVAL_AND_AMOUNT_REQUIRED: "refillInterval is required when refillAmount is provided",
			USER_BANNED: "User is banned",
			UNAUTHORIZED_SESSION: "Unauthorized or invalid session",
			KEY_NOT_FOUND: "API Key not found",
			KEY_DISABLED: "API Key is disabled",
			KEY_EXPIRED: "API Key has expired",
			USAGE_EXCEEDED: "API Key has reached its usage limit",
			KEY_NOT_RECOVERABLE: "API Key is not recoverable",
			EXPIRES_IN_IS_TOO_SMALL: "The expiresIn is smaller than the predefined minimum value.",
			EXPIRES_IN_IS_TOO_LARGE: "The expiresIn is larger than the predefined maximum value.",
			INVALID_REMAINING: "The remaining count is either too large or too small.",
			INVALID_PREFIX_LENGTH: "The prefix length is either too large or too small.",
			INVALID_NAME_LENGTH: "The name length is either too large or too small.",
			METADATA_DISABLED: "Metadata is disabled.",
			RATE_LIMIT_EXCEEDED: "Rate limit exceeded.",
			NO_VALUES_TO_UPDATE: "No values to update.",
			KEY_DISABLED_EXPIRATION: "Custom key expiration values are disabled.",
			INVALID_API_KEY: "Invalid API key.",
			INVALID_USER_ID_FROM_API_KEY: "The user id from the API key is invalid.",
			INVALID_REFERENCE_ID_FROM_API_KEY: "The reference id from the API key is invalid.",
			INVALID_API_KEY_GETTER_RETURN_TYPE: "API Key getter returned an invalid key type. Expected string.",
			SERVER_ONLY_PROPERTY: "The property you're trying to set can only be set from the server auth instance only.",
			FAILED_TO_UPDATE_API_KEY: "Failed to update API key",
			NAME_REQUIRED: "API Key name is required.",
			ORGANIZATION_ID_REQUIRED: "Organization ID is required for organization-owned API keys.",
			USER_NOT_MEMBER_OF_ORGANIZATION: "You are not a member of the organization that owns this API key.",
			INSUFFICIENT_API_KEY_PERMISSIONS: "You do not have permission to perform this action on organization API keys.",
			NO_DEFAULT_API_KEY_CONFIGURATION_FOUND: "No default api-key configuration found.",
			ORGANIZATION_PLUGIN_REQUIRED: "Organization plugin is required for organization-owned API keys. Please install and configure the organization plugin."
		}),
		c = "1.6.34";
	_({
		USER_NOT_FOUND: "User not found",
		FAILED_TO_CREATE_USER: "Failed to create user",
		FAILED_TO_CREATE_SESSION: "Failed to create session",
		FAILED_TO_UPDATE_USER: "Failed to update user",
		FAILED_TO_GET_SESSION: "Failed to get session",
		INVALID_PASSWORD: "Invalid password",
		INVALID_EMAIL: "Invalid email",
		INVALID_EMAIL_OR_PASSWORD: "Invalid email or password",
		INVALID_USER: "Invalid user",
		SOCIAL_ACCOUNT_ALREADY_LINKED: "Social account already linked",
		PROVIDER_NOT_FOUND: "Provider not found",
		INVALID_TOKEN: "Invalid token",
		TOKEN_EXPIRED: "Token expired",
		ID_TOKEN_NOT_SUPPORTED: "id_token not supported",
		FAILED_TO_GET_USER_INFO: "Failed to get user info",
		USER_EMAIL_NOT_FOUND: "User email not found",
		EMAIL_NOT_VERIFIED: "Email not verified",
		PASSWORD_TOO_SHORT: "Password too short",
		PASSWORD_TOO_LONG: "Password too long",
		USER_ALREADY_EXISTS: "User already exists.",
		USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
		EMAIL_CAN_NOT_BE_UPDATED: "Email can not be updated",
		CHANGE_EMAIL_DISABLED: "Change email is disabled",
		CREDENTIAL_ACCOUNT_NOT_FOUND: "Credential account not found",
		SESSION_EXPIRED: "Session expired. Re-authenticate to perform this action.",
		FAILED_TO_UNLINK_LAST_ACCOUNT: "You can't unlink your last account",
		ACCOUNT_NOT_FOUND: "Account not found",
		USER_ALREADY_HAS_PASSWORD: "User already has a password. Provide that to delete the account.",
		CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: "Cross-site navigation login blocked. This request appears to be a CSRF attack.",
		VERIFICATION_EMAIL_NOT_ENABLED: "Verification email isn't enabled",
		EMAIL_ALREADY_VERIFIED: "Email is already verified",
		EMAIL_MISMATCH: "Email mismatch",
		SESSION_NOT_FRESH: "Session is not fresh",
		LINKED_ACCOUNT_ALREADY_EXISTS: "Linked account already exists",
		INVALID_ORIGIN: "Invalid origin",
		INVALID_CALLBACK_URL: "Invalid callbackURL",
		INVALID_REDIRECT_URL: "Invalid redirectURL",
		INVALID_ERROR_CALLBACK_URL: "Invalid errorCallbackURL",
		INVALID_NEW_USER_CALLBACK_URL: "Invalid newUserCallbackURL",
		MISSING_OR_NULL_ORIGIN: "Missing or null Origin",
		CALLBACK_URL_REQUIRED: "callbackURL is required",
		FAILED_TO_CREATE_VERIFICATION: "Unable to create verification",
		FIELD_NOT_ALLOWED: "Field not allowed to be set",
		ASYNC_VALIDATION_NOT_SUPPORTED: "Async validation is not supported",
		VALIDATION_ERROR: "Validation Error",
		MISSING_FIELD: "Field is required",
		METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED: "POST method requires deferSessionRefresh to be enabled in session config",
		BODY_MUST_BE_AN_OBJECT: "Body must be an object",
		PASSWORD_ALREADY_SET: "User already has a password set"
	});
	let d = {
		OK: 200,
		CREATED: 201,
		ACCEPTED: 202,
		NO_CONTENT: 204,
		MULTIPLE_CHOICES: 300,
		MOVED_PERMANENTLY: 301,
		FOUND: 302,
		SEE_OTHER: 303,
		NOT_MODIFIED: 304,
		TEMPORARY_REDIRECT: 307,
		BAD_REQUEST: 400,
		UNAUTHORIZED: 401,
		PAYMENT_REQUIRED: 402,
		FORBIDDEN: 403,
		NOT_FOUND: 404,
		METHOD_NOT_ALLOWED: 405,
		NOT_ACCEPTABLE: 406,
		PROXY_AUTHENTICATION_REQUIRED: 407,
		REQUEST_TIMEOUT: 408,
		CONFLICT: 409,
		GONE: 410,
		LENGTH_REQUIRED: 411,
		PRECONDITION_FAILED: 412,
		PAYLOAD_TOO_LARGE: 413,
		URI_TOO_LONG: 414,
		UNSUPPORTED_MEDIA_TYPE: 415,
		RANGE_NOT_SATISFIABLE: 416,
		EXPECTATION_FAILED: 417,
		"I'M_A_TEAPOT": 418,
		MISDIRECTED_REQUEST: 421,
		UNPROCESSABLE_ENTITY: 422,
		LOCKED: 423,
		FAILED_DEPENDENCY: 424,
		TOO_EARLY: 425,
		UPGRADE_REQUIRED: 426,
		PRECONDITION_REQUIRED: 428,
		TOO_MANY_REQUESTS: 429,
		REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
		UNAVAILABLE_FOR_LEGAL_REASONS: 451,
		INTERNAL_SERVER_ERROR: 500,
		NOT_IMPLEMENTED: 501,
		BAD_GATEWAY: 502,
		SERVICE_UNAVAILABLE: 503,
		GATEWAY_TIMEOUT: 504,
		HTTP_VERSION_NOT_SUPPORTED: 505,
		VARIANT_ALSO_NEGOTIATES: 506,
		INSUFFICIENT_STORAGE: 507,
		LOOP_DETECTED: 508,
		NOT_EXTENDED: 510,
		NETWORK_AUTHENTICATION_REQUIRED: 511
	};
	var O = class extends Error {
		status;
		body;
		headers;
		statusCode;
		constructor(e = "INTERNAL_SERVER_ERROR", t, r = {}, n = "number" == typeof e ? e : d[e]) {
			super(t?.message, t?.cause ? {
				cause: t.cause
			} : void 0), this.status = e, this.body = t, this.headers = r, this.statusCode = n, this.name = "APIError", this.status = e, this.headers = r, this.statusCode = n, this.body = t
		}
	};
	Symbol.for("better-call:api-error-headers"), s = O, l = Error, Object.defineProperty((class e extends s {
		#e;
		constructor(...e) {
			var t;
			let r, n;
			if (void 0 === (r = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit")) ? Object.isExtensible(Error) : Object.prototype.hasOwnProperty.call(r, "writable") ? r.writable : void 0 !== r.set) {
				let t = Error.stackTraceLimit;
				Error.stackTraceLimit = 0, super(...e), Error.stackTraceLimit = t
			} else super(...e);
			let o = (Error()).stack;
			o && (this.#e = (n = (t = o.replace(/^Error/, this.name)).split("\n    at ")).length <= 1 ? t : (n.splice(1, 1), n.join("\n    at ")))
		}
		get errorStack() {
			return this.#e
		}
	}).prototype, "constructor", {
		get: () => l,
		enumerable: !1,
		configurable: !0
	});
	var T = class extends Error {
		constructor(e, t) {
			super(e, t), this.name = "BetterAuthError", this.message = e, this.stack = ""
		}
	};

	function f(e) {
		return "OR" === e ? "OR" : "AND"
	}

	function A(e) {
		return Array.isArray(e)
	}

	function p(e, t) {
		return "string" == typeof t && e.includes(t)
	}

	function R(e) {
		return {
			newRole: e => {
				var t;
				return {
					authorize(e, r = "AND") {
						let n = !1;
						for (let [o, i] of Object.entries(e)) {
							let e = t[o];
							if (!e) {
								if ("AND" === r) return {
									success: !1,
									error: `You are not allowed to access resource: ${o}`
								};
								continue
							}
							let a = function(e, {
								actions: t,
								connector: r
							}) {
								return 0 !== t.length && ("OR" === r ? t.some(t => p(e, t)) : t.every(t => p(e, t)))
							}(e, function(e) {
								if (A(e)) return {
									actions: e,
									connector: "AND"
								};
								if (!e || "object" != typeof e) throw new T("Invalid access control request");
								let {
									actions: t,
									connector: r
								} = e;
								return A(t) ? {
									actions: t,
									connector: f(r)
								} : {
									actions: [],
									connector: f(r)
								}
							}(i));
							if (a && (n = !0), a && "OR" === r) return {
								success: !0
							};
							if (!a && "AND" === r) return {
								success: !1,
								error: `unauthorized to access resource "${o}"`
							}
						}
						return n ? {
							success: !0
						} : {
							success: !1,
							error: "Not authorized"
						}
					},
					statements: t = e
				}
			},
			statements: e
		}
	}
	let h = R({
			user: ["create", "list", "set-role", "ban", "impersonate", "impersonate-admins", "delete", "set-password", "set-email", "get", "update"],
			session: ["list", "revoke", "delete"]
		}),
		I = h.newRole({
			user: ["create", "list", "set-role", "ban", "impersonate", "delete", "set-password", "set-email", "get", "update"],
			session: ["list", "revoke", "delete"]
		}),
		N = h.newRole({
			user: [],
			session: []
		}),
		m = {
			admin: I,
			user: N
		},
		g = _({
			FAILED_TO_CREATE_USER: "Failed to create user",
			USER_ALREADY_EXISTS: "User already exists.",
			USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "User already exists. Use another email.",
			YOU_CANNOT_BAN_YOURSELF: "You cannot ban yourself",
			YOU_ARE_NOT_ALLOWED_TO_CHANGE_USERS_ROLE: "You are not allowed to change users role",
			YOU_ARE_NOT_ALLOWED_TO_CREATE_USERS: "You are not allowed to create users",
			YOU_ARE_NOT_ALLOWED_TO_LIST_USERS: "You are not allowed to list users",
			YOU_ARE_NOT_ALLOWED_TO_LIST_USERS_SESSIONS: "You are not allowed to list users sessions",
			YOU_ARE_NOT_ALLOWED_TO_BAN_USERS: "You are not allowed to ban users",
			YOU_ARE_NOT_ALLOWED_TO_IMPERSONATE_USERS: "You are not allowed to impersonate users",
			YOU_ARE_NOT_ALLOWED_TO_REVOKE_USERS_SESSIONS: "You are not allowed to revoke users sessions",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_USERS: "You are not allowed to delete users",
			YOU_ARE_NOT_ALLOWED_TO_SET_USERS_PASSWORD: "You are not allowed to set users password",
			BANNED_USER: "You have been banned from this application",
			YOU_ARE_NOT_ALLOWED_TO_GET_USER: "You are not allowed to get user",
			NO_DATA_TO_UPDATE: "No data to update",
			YOU_ARE_NOT_ALLOWED_TO_UPDATE_USERS: "You are not allowed to update users",
			YOU_CANNOT_REMOVE_YOURSELF: "You cannot remove yourself",
			YOU_ARE_NOT_ALLOWED_TO_SET_NON_EXISTENT_VALUE: "You are not allowed to set a non-existent role value",
			YOU_CANNOT_IMPERSONATE_ADMINS: "You cannot impersonate admins",
			INVALID_ROLE_TYPE: "Invalid role type",
			YOU_ARE_NOT_ALLOWED_TO_SET_USERS_EMAIL: "You are not allowed to update users email",
			PASSWORD_CANNOT_BE_UPDATED_VIA_UPDATE_USER: "Password cannot be updated through update-user. Use the set-user-password endpoint instead"
		});
	var S = e.i(914374);
	let v = (e, t, r, n) => (e.events = e.events || {}, e.events[r + 10] || (e.events[r + 10] = n(t => {
			e.events[r].reduceRight((e, t) => (t(e), e), {
				shared: {},
				...t
			})
		})), e.events[r] = e.events[r] || [], e.events[r].push(t), () => {
			let n = e.events[r],
				o = n.indexOf(t);
			~o && (n.splice(o, 1), n.length || (e.events[r + 10](), delete e.events[r + 10]))
		}),
		L = (e, t) => v(e, r => {
			let n = t(r);
			n && e.events[6].push(n)
		}, 5, t => {
			let r = e.listen;
			e.listen = (...n) => (e.lc || e.active || (e.active = !0, t()), r(...n));
			let n = e.off;
			return e.events[6] = [], e.off = () => {
				n(), setTimeout(() => {
					if (e.active && !e.lc) {
						for (let t of (e.active = !1, e.events[6])) t();
						e.events[6] = []
					}
				}, 1e3)
			}, () => {
				e.listen = r, e.off = n
			}
		});

	function b(e) {
		if ("object" != typeof e || null === e) return !1;
		let t = Object.getPrototypeOf(e);
		return t === Object.prototype || null === t
	}

	function y(e, t) {
		if (e === t) return !0;
		if (Array.isArray(e) && Array.isArray(t)) {
			if (e.length !== t.length) return !1;
			for (let r = 0; r < e.length; r++)
				if (!y(e[r], t[r])) return !1;
			return !0
		}
		if (b(e) && b(t)) {
			let r = Object.keys(e),
				n = Object.keys(t);
			if (r.length !== n.length) return !1;
			for (let n of r)
				if (!(n in t) || !y(e[n], t[n])) return !1;
			return !0
		}
		return !1
	}

	function U(e, t) {
		return v(e, ({
			newValue: r,
			abort: n
		}) => {
			t(e.value, r) && n()
		}, 2, t => {
			let r = e.set,
				n = e.setKey;
			return e.setKey && (e.setKey = (r, o) => {
				let i;
				if (t({
						abort: () => {
							i = !0
						},
						changed: r,
						newValue: {
							...e.value,
							[r]: o
						}
					}), !i) return n(r, o)
			}), e.set = e => {
				let n;
				if (t({
						abort: () => {
							n = !0
						},
						newValue: e
					}), !n) return r(e)
			}, () => {
				e.set = r, e.setKey = n
			}
		})
	}
	let D = [],
		w = 0,
		P = globalThis.nanostoresGlobal ||= {
			epoch: 0
		},
		C = e => {
			let t = [],
				r = {
					eq: Object.is,
					get: () => (r.lc || r.listen(() => {})(), r.value),
					init: e,
					lc: 0,
					listen: e => (r.lc = t.push(e), () => {
						for (let t = w; t < D.length;) D[t] === e && D[t + 1] === r ? D.splice(t, 4) : t += 4;
						let n = t.indexOf(e);
						~n && (t.splice(n, 1), --r.lc || r.off())
					}),
					notify(e, n) {
						P.epoch++;
						let o = !D.length;
						for (let o of t) D.push(o, r, e, n);
						o && (() => {
							let e, t;
							for (; w < D.length;) {
								let r;
								t = w, w += 4;
								if (r) {
									if (!r.has(D[t + 1])) continue;
									r.clear()
								}
								try {
									D[t](D[t + 1].value, D[t + 2], D[t + 3])
								} catch (t) {
									e = t
								}
							}
							if (D.length = w = 0, e) throw e
						})()
					},
					off() {},
					set(e) {
						let t = r.value;
						r.eq(t, e) || (r.value = e, r.notify(t))
					},
					subscribe(e) {
						let t = r.listen(e);
						return e(r.value), t
					},
					value: e
				};
			return r
		};

	function Y(e, t) {
		return y(e.data, t.data) && e.error === t.error && e.isPending === t.isPending && e.isRefetching === t.isRefetching && e.refetch === t.refetch
	}
	let M = (e, t, r, n) => {
			let o = C({
				data: null,
				error: null,
				isPending: !0,
				isRefetching: !1,
				refetch: e => i(e)
			});
			U(o, Y);
			let i = async e => new Promise(i => {
				let a = "function" == typeof n ? n({
					data: o.get().data,
					error: o.get().error,
					isPending: o.get().isPending
				}) : n;
				r(t, {
					...a,
					query: {
						...a?.query,
						...e?.query
					},
					async onSuccess(e) {
						let t = o.get(),
							r = null != t.data && null != e.data && y(t.data, e.data) ? t.data : e.data;
						o.set({
							data: r,
							error: null,
							isPending: !1,
							isRefetching: !1,
							refetch: o.value.refetch
						}), await a?.onSuccess?.(e)
					},
					async onError(e) {
						let {
							request: t
						} = e, r = "number" == typeof t.retry ? t.retry : t.retry?.attempts, n = t.retryAttempt || 0;
						if (r && n < r) return;
						let i = 401 === e.error.status;
						o.set({
							error: e.error,
							data: i ? null : o.get().data,
							isPending: !1,
							isRefetching: !1,
							refetch: o.value.refetch
						}), await a?.onError?.(e)
					},
					async onRequest(e) {
						let t = o.get();
						o.set({
							isPending: null === t.data,
							data: t.data,
							error: null,
							isRefetching: !0,
							refetch: o.value.refetch
						}), await a?.onRequest?.(e)
					}
				}).catch(e => {
					o.set({
						error: e,
						data: o.get().data,
						isPending: !1,
						isRefetching: !1,
						refetch: o.value.refetch
					})
				}).finally(() => {
					i(void 0)
				})
			});
			e = Array.isArray(e) ? e : [e];
			let a = !1,
				s = !1,
				l = !1,
				u = () => {
					if (a) {
						l = !0;
						return
					}
					a = !0, i().finally(() => {
						a = !1;
						let e = l && s;
						l = !1, e && u()
					})
				};
			return L(o, () => {
				let t;
				if ("u" < typeof window) return;
				s = !0;
				let r = !1,
					n = e.map(e => e.listen(() => {
						r ? i() : (r = !0, clearTimeout(t), u())
					}));
				return t = setTimeout(() => {
					r = !0, u()
				}, 0), () => {
					for (let e of (s = !1, n)) e();
					clearTimeout(t)
				}
			}), o
		},
		F = R({
			organization: ["update", "delete"],
			member: ["create", "update", "delete"],
			invitation: ["create", "cancel"],
			team: ["create", "update", "delete"],
			ac: ["create", "read", "update", "delete"]
		}),
		B = F.newRole({
			organization: ["update"],
			invitation: ["create", "cancel"],
			member: ["create", "update", "delete"],
			team: ["create", "update", "delete"],
			ac: ["create", "read", "update", "delete"]
		}),
		V = F.newRole({
			organization: ["update", "delete"],
			member: ["create", "update", "delete"],
			invitation: ["create", "cancel"],
			team: ["create", "update", "delete"],
			ac: ["create", "read", "update", "delete"]
		}),
		H = F.newRole({
			organization: [],
			member: [],
			invitation: [],
			team: [],
			ac: ["read"]
		}),
		G = {
			admin: B,
			owner: V,
			member: H
		},
		z = _({
			YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
			YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
			ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
			ORGANIZATION_SLUG_ALREADY_TAKEN: "Organization slug already taken",
			ORGANIZATION_NOT_FOUND: "Organization not found",
			USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
			YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
			NO_ACTIVE_ORGANIZATION: "No active organization",
			USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
			MEMBER_NOT_FOUND: "Member not found",
			ROLE_NOT_FOUND: "Role not found",
			YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
			TEAM_ALREADY_EXISTS: "Team already exists",
			TEAM_NOT_FOUND: "Team not found",
			YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
			YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: "You cannot leave the organization without an owner",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
			YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
			USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
			INVITATION_NOT_FOUND: "Invitation not found",
			YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
			EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: "Email verification required before accepting or rejecting invitation",
			EMAIL_VERIFICATION_REQUIRED_FOR_INVITATION: "Email verification required to view or list invitations for the session email",
			YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
			INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
			YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "You are not allowed to invite a user with this role",
			FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
			YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
			UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
			YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
			ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
			YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
			YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
			INVITATION_LIMIT_REACHED: "Invitation limit reached",
			TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached",
			USER_IS_NOT_A_MEMBER_OF_THE_TEAM: "User is not a member of the team",
			YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: "You are not allowed to list the members of this team",
			YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: "You do not have an active team",
			YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: "You are not allowed to create a new member",
			YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: "You are not allowed to remove a team member",
			YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: "You are not allowed to access this organization as an owner",
			YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: "You are not a member of this organization",
			MISSING_AC_INSTANCE: "Dynamic Access Control requires a pre-defined ac instance on the server auth plugin. Read server logs for more information",
			YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: "You must be in an organization to create a role",
			YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: "You are not allowed to create a role",
			YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: "You are not allowed to update a role",
			YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: "You are not allowed to delete a role",
			YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: "You are not allowed to read a role",
			YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: "You are not allowed to list a role",
			YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: "You are not allowed to get a role",
			TOO_MANY_ROLES: "This organization has too many roles",
			INVALID_RESOURCE: "The provided permission includes an invalid resource",
			ROLE_NAME_IS_ALREADY_TAKEN: "That role name is already taken",
			CANNOT_DELETE_A_PRE_DEFINED_ROLE: "Cannot delete a pre-defined role",
			ROLE_IS_ASSIGNED_TO_MEMBERS: "Cannot delete a role that is assigned to members. Please reassign the members to a different role first",
			INVALID_TEAM_ID: "Team id contains a reserved character"
		}),
		W = Object.create(null),
		k = e => globalThis.process?.env || globalThis.Deno?.env.toObject() || globalThis.__env__ || (e ? W : globalThis),
		j = new Proxy(W, {
			get: (e, t) => k()[t] ?? W[t],
			has: (e, t) => t in k() || t in W,
			set: (e, t, r) => (k(!0)[t] = r, !0),
			deleteProperty(e, t) {
				if (!t) return !1;
				let r = k(!0);
				return delete r[t], !0
			},
			ownKeys: () => Object.keys(k(!0))
		});

	function x(e, t) {
		return void 0 !== S.default && S.default.env ? S.default.env[e] ?? t : "u" > typeof Deno ? Deno.env.get(e) ?? t : "u" > typeof Bun ? Bun.env[e] ?? t : t
	}

	function $(e) {
		let t = e.length;
		for (; t > 0 && 47 === e.charCodeAt(t - 1);) t--;
		return t === e.length ? e : e.slice(0, t)
	}

	function q(e, t = "/api/auth") {
		try {
			let t = new URL(e);
			if ("http:" !== t.protocol && "https:" !== t.protocol) throw new T(`Invalid base URL: ${e}. URL must include 'http://' or 'https://'`)
		} catch (t) {
			if (t instanceof T) throw t;
			throw new T(`Invalid base URL: ${e}. Please provide a valid base URL.`, {
				cause: t
			})
		}
		if (function(e) {
				try {
					return "/" !== ($(new URL(e).pathname) || "/")
				} catch {
					throw new T(`Invalid base URL: ${e}. Please provide a valid base URL.`)
				}
			}(e)) return e;
		let r = $(e);
		return t && "/" !== t ? (t = t.startsWith("/") ? t : `/${t}`, `${r}${t}`) : r
	}
	j.NODE_ENV, Object.freeze({
		get BETTER_AUTH_SECRET() {
			return x("BETTER_AUTH_SECRET")
		},
		get AUTH_SECRET() {
			return x("AUTH_SECRET")
		},
		get BETTER_AUTH_TELEMETRY() {
			return x("BETTER_AUTH_TELEMETRY")
		},
		get BETTER_AUTH_TELEMETRY_ID() {
			return x("BETTER_AUTH_TELEMETRY_ID")
		},
		get NODE_ENV() {
			return x("NODE_ENV", "development")
		},
		get PACKAGE_VERSION() {
			return x("PACKAGE_VERSION", "0.0.0")
		},
		get BETTER_AUTH_TELEMETRY_ENDPOINT() {
			return x("BETTER_AUTH_TELEMETRY_ENDPOINT", "")
		}
	});
	let K = {
			proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
			constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
			protoShort: /"__proto__"\s*:/,
			constructorShort: /"constructor"\s*:/
		},
		X = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/,
		Z = {
			true: !0,
			false: !1,
			null: null,
			undefined: void 0,
			nan: 0 / 0,
			infinity: 1 / 0,
			"-infinity": -1 / 0
		},
		Q = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/,
		J = ["javascript:", "data:", "vbscript:"],
		ee = {
			id: "redirect",
			name: "Redirect",
			hooks: {
				onSuccess(e) {
					if (e.data?.url && e.data?.redirect && function(e) {
							let t;
							try {
								t = new URL(e)
							} catch {
								return !0
							}
							return !J.includes(t.protocol)
						}(e.data.url) && "u" > typeof window && window.location && window.location) try {
						window.location.href = e.data.url
					} catch {}
				}
			}
		},
		et = Symbol.for("better-auth:broadcast-channel");
	var er = class {
		listeners = new Set;
		name;
		constructor(e = "better-auth.message") {
			this.name = e
		}
		subscribe(e) {
			return this.listeners.add(e), () => {
				this.listeners.delete(e)
			}
		}
		post(e) {
			if ("u" > typeof window) try {
				localStorage.setItem(this.name, JSON.stringify({
					...e,
					timestamp: Math.floor(Date.now() / 1e3)
				}))
			} catch {}
		}
		setup() {
			if ("u" < typeof window || void 0 === window.addEventListener) return () => {};
			let e = e => {
				if (e.key !== this.name) return;
				let t = JSON.parse(e.newValue ?? "{}");
				t?.event === "session" && t?.data && this.listeners.forEach(e => e(t))
			};
			return window.addEventListener("storage", e), () => {
				window.removeEventListener("storage", e)
			}
		}
	};

	function en(e = "better-auth.message") {
		return globalThis[et] || (globalThis[et] = new er(e)), globalThis[et]
	}
	let eo = Symbol.for("better-auth:focus-manager");
	var ei = class {
		listeners = new Set;
		subscribe(e) {
			return this.listeners.add(e), () => {
				this.listeners.delete(e)
			}
		}
		setFocused(e) {
			this.listeners.forEach(t => t(e))
		}
		setup() {
			if ("u" < typeof window || "u" < typeof document || void 0 === window.addEventListener) return () => {};
			let e = () => {
				"visible" === document.visibilityState && this.setFocused(!0)
			};
			return document.addEventListener("visibilitychange", e, !1), () => {
				document.removeEventListener("visibilitychange", e, !1)
			}
		}
	};

	function ea() {
		return globalThis[eo] || (globalThis[eo] = new ei), globalThis[eo]
	}
	let es = Symbol.for("better-auth:online-manager");
	var el = class {
		listeners = new Set;
		isOnline = "u" < typeof navigator || navigator.onLine;
		subscribe(e) {
			return this.listeners.add(e), () => {
				this.listeners.delete(e)
			}
		}
		setOnline(e) {
			this.isOnline = e, this.listeners.forEach(t => t(e))
		}
		setup() {
			if ("u" < typeof window || void 0 === window.addEventListener) return () => {};
			let e = () => this.setOnline(!0),
				t = () => this.setOnline(!1);
			return window.addEventListener("online", e, !1), window.addEventListener("offline", t, !1), () => {
				window.removeEventListener("online", e, !1), window.removeEventListener("offline", t, !1)
			}
		}
	};

	function eu() {
		return globalThis[es] || (globalThis[es] = new el), globalThis[es]
	}
	let e_ = () => Math.floor(Date.now() / 1e3);

	function eE(e) {
		return "object" == typeof e && null !== e && "data" in e && "error" in e ? e : {
			data: e,
			error: null
		}
	}

	function ec(e, t) {
		return y(e.data, t.data) && e.error === t.error && e.isPending === t.isPending && e.isRefetching === t.isRefetching && e.refetch === t.refetch
	}

	function ed(e) {
		if (null === e || "object" != typeof e) return !1;
		let t = Object.getPrototypeOf(e);
		return (null === t || t === Object.prototype || null === Object.getPrototypeOf(t)) && !(Symbol.iterator in e) && (!(Symbol.toStringTag in e) || "[object Module]" === Object.prototype.toString.call(e))
	}

	function eO(e) {
		return (...t) => t.reduce((t, r) => (function e(t, r, n = ".", o) {
			if (!ed(r)) return e(t, {}, n, o);
			let i = {
				...r
			};
			for (let r of Object.keys(t)) {
				if ("__proto__" === r || "constructor" === r) continue;
				let a = t[r];
				null != a && (o && o(i, r, a, n) || (Array.isArray(a) && Array.isArray(i[r]) ? i[r] = [...a, ...i[r]] : ed(a) && ed(i[r]) ? i[r] = e(a, i[r], (n ? `${n}.` : "") + r.toString(), o) : i[r] = a))
			}
			return i
		})(t, r, "", e), {})
	}
	let eT = eO();
	eO((e, t, r) => {
		if (void 0 !== e[t] && "function" == typeof r) return e[t] = r(e[t]), !0
	}), eO((e, t, r) => {
		if (Array.isArray(e[t]) && "function" == typeof r) return e[t] = r(e[t]), !0
	});
	var ef = Object.defineProperty,
		eA = Object.defineProperties,
		ep = Object.getOwnPropertyDescriptors,
		eR = Object.getOwnPropertySymbols,
		eh = Object.prototype.hasOwnProperty,
		eI = Object.prototype.propertyIsEnumerable,
		eN = (e, t, r) => t in e ? ef(e, t, {
			enumerable: !0,
			configurable: !0,
			writable: !0,
			value: r
		}) : e[t] = r,
		em = (e, t) => {
			for (var r in t || (t = {})) eh.call(t, r) && eN(e, r, t[r]);
			if (eR)
				for (var r of eR(t)) eI.call(t, r) && eN(e, r, t[r]);
			return e
		},
		eg = (e, t) => eA(e, ep(t)),
		eS = class extends Error {
			constructor(e, t, r) {
				super(t || e.toString(), {
					cause: r
				}), this.status = e, this.statusText = t, this.error = r, Error.captureStackTrace(this, this.constructor)
			}
		},
		ev = async (e, t) => {
			var r, n, o, i, a, s;
			let l = t || {},
				u = {
					onRequest: [null == t ? void 0 : t.onRequest],
					onResponse: [null == t ? void 0 : t.onResponse],
					onSuccess: [null == t ? void 0 : t.onSuccess],
					onError: [null == t ? void 0 : t.onError],
					onRetry: [null == t ? void 0 : t.onRetry]
				};
			if (!t || !(null == t ? void 0 : t.plugins)) return {
				url: e,
				options: l,
				hooks: u
			};
			for (let _ of (null == t ? void 0 : t.plugins) || []) {
				if (_.init) {
					let n = await (null == (r = _.init) ? void 0 : r.call(_, e.toString(), t));
					l = n.options || l, e = n.url
				}
				u.onRequest.push(null == (n = _.hooks) ? void 0 : n.onRequest), u.onResponse.push(null == (o = _.hooks) ? void 0 : o.onResponse), u.onSuccess.push(null == (i = _.hooks) ? void 0 : i.onSuccess), u.onError.push(null == (a = _.hooks) ? void 0 : a.onError), u.onRetry.push(null == (s = _.hooks) ? void 0 : s.onRetry)
			}
			return {
				url: e,
				options: l,
				hooks: u
			}
		}, eL = class {
			constructor(e) {
				this.options = e
			}
			shouldAttemptRetry(e, t) {
				return this.options.shouldRetry ? Promise.resolve(e < this.options.attempts && this.options.shouldRetry(t)) : Promise.resolve(e < this.options.attempts)
			}
			getDelay() {
				return this.options.delay
			}
		}, eb = class {
			constructor(e) {
				this.options = e
			}
			shouldAttemptRetry(e, t) {
				return this.options.shouldRetry ? Promise.resolve(e < this.options.attempts && this.options.shouldRetry(t)) : Promise.resolve(e < this.options.attempts)
			}
			getDelay(e) {
				return Math.min(this.options.maxDelay, this.options.baseDelay * 2 ** e)
			}
		}, ey = async e => {
			let t = {},
				r = async e => "function" == typeof e ? await e() : e;
			if (null == e ? void 0 : e.auth) {
				if ("Bearer" === e.auth.type) {
					let n = await r(e.auth.token);
					if (!n) return t;
					t.authorization = `Bearer ${n}`
				} else if ("Basic" === e.auth.type) {
					let [n, o] = await Promise.all([r(e.auth.username), r(e.auth.password)]);
					if (!n || !o) return t;
					t.authorization = `Basic ${btoa(`${n}:${o}`)}`
				} else if ("Custom" === e.auth.type) {
					let [n, o] = await Promise.all([r(e.auth.prefix), r(e.auth.value)]);
					if (!o) return t;
					t.authorization = `${null!=n?n:""} ${o}`
				}
			}
			return t
		}, eU = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;

	function eD(e) {
		if (void 0 === e) return !1;
		let t = typeof e;
		return "string" === t || "number" === t || "boolean" === t || null === t || "object" === t && (!!Array.isArray(e) || !e.buffer && (e.constructor && "Object" === e.constructor.name || "function" == typeof e.toJSON))
	}

	function ew(e) {
		try {
			return JSON.parse(e)
		} catch (t) {
			return e
		}
	}

	function eP(e) {
		return "function" == typeof e
	}

	function eC(...e) {
		let t = {};
		for (let r of e)
			if (r)
				if (r instanceof Headers) r.forEach((e, r) => {
					t[r] = e
				});
				else
					for (let [e, n] of Array.isArray(r) ? r : Object.entries(r)) null != n && (t[e] = n);
		return t
	}
	async function eY(e) {
		let t = new Headers(eC(null == e ? void 0 : e.headers, await ey(e)));
		if (!t.has("content-type")) {
			let r = eD(null == e ? void 0 : e.body) ? "application/json" : null;
			r && t.set("content-type", r)
		}
		return t
	}
	var eM = class e extends Error {
		constructor(t, r) {
			super(r || JSON.stringify(t, null, 2)), this.issues = t, Object.setPrototypeOf(this, e.prototype)
		}
	};
	async function eF(e, t) {
		let r = await e["~standard"].validate(t);
		if (r.issues) throw new eM(r.issues);
		return r.value
	}
	var eB = ["get", "post", "put", "patch", "delete"],
		eV = async (e, t) => {
			var r, n, o, i, a, s, l, u;
			let _, {
					hooks: E,
					url: c,
					options: d
				} = await ev(e, t),
				O = function(e) {
					if (null == e ? void 0 : e.customFetchImpl) return e.customFetchImpl;
					if ("u" > typeof globalThis && eP(globalThis.fetch)) return globalThis.fetch;
					if ("u" > typeof window && eP(window.fetch)) return window.fetch;
					throw Error("No fetch implementation found")
				}(d),
				T = new AbortController,
				f = null != (r = d.signal) ? r : T.signal,
				A = function(e, t) {
					let {
						baseURL: r,
						params: n,
						query: o
					} = t || {
						query: {},
						params: {},
						baseURL: ""
					}, i = e.startsWith("http") ? e.split("/").slice(0, 3).join("/") : r || "";
					if (e.startsWith("@")) {
						let t = e.toString().split("@")[1].split("/")[0];
						eB.includes(t) && (e = e.replace(`@${t}/`, "/"))
					}
					i.endsWith("/") || (i += "/");
					let [a, s] = e.replace(i, "").split("?"), l = new URLSearchParams(s);
					for (let [e, t] of Object.entries(o || {})) {
						let r;
						if (null != t) {
							if ("string" == typeof t) r = t;
							else if (Array.isArray(t)) {
								for (let r of t) l.append(e, r);
								continue
							} else r = JSON.stringify(t);
							l.set(e, r)
						}
					}
					let u = new Map;
					if (n)
						if (Array.isArray(n))
							for (let [e, t] of a.split("/").filter(e => e.startsWith(":")).entries()) {
								let r = n[e];
								u.set(t, String(r))
							} else
								for (let [e, t] of Object.entries(n)) u.set(`:${e}`, String(t));
					a = (a = a.split("/").map(e => (function(e, t) {
						let r, n = e;
						for (let [e, r] of t) n = n.replace(e, r);
						if ("." === (r = n) || ".." === r) throw TypeError("Path parameters cannot be reserved path segments");
						return encodeURIComponent(n)
					})(e, u)).join("/")).replace(/^\/+/, "");
					let _ = l.toString();
					return (_ = _.length > 0 ? `?${_}`.replace(/\+/g, "%20") : "", i.startsWith("http")) ? new URL(`${a}${_}`, i) : `${i}${a}${_}`
				}(c, d),
				p = await eY(d),
				R = function(e, t) {
					let r, {
						body: n
					} = e;
					return n ? eD(n) && "string" != typeof n ? "application/x-www-form-urlencoded" === ((r = t.get("content-type")) ? r.split(";")[0].trim().toLowerCase() : null) ? new URLSearchParams(n).toString() : JSON.stringify(n) : n : null
				}(d, p),
				h = function(e, t) {
					var r;
					if (null == t ? void 0 : t.method) return t.method.toUpperCase();
					if (e.startsWith("@")) {
						let n = null == (r = e.split("@")[1]) ? void 0 : r.split("/")[0];
						return eB.includes(n) ? n.toUpperCase() : (null == t ? void 0 : t.body) ? "POST" : "GET"
					}
					return (null == t ? void 0 : t.body) ? "POST" : "GET"
				}(c, d),
				I = eg(em({}, d), {
					url: A,
					headers: p,
					body: R,
					method: h,
					signal: f
				});
			for (let e of E.onRequest)
				if (e) {
					let t = await e(I);
					"object" == typeof t && null !== t && Object.assign(I, t)
				}("pipeTo" in I && "function" == typeof I.pipeTo || "function" == typeof(null == (n = null == t ? void 0 : t.body) ? void 0 : n.pipe)) && !("duplex" in I) && (I.duplex = "half");
			let {
				clearTimeout: N
			} = (!(null == d ? void 0 : d.signal) && (null == d ? void 0 : d.timeout) && (_ = setTimeout(() => null == T ? void 0 : T.abort(), null == d ? void 0 : d.timeout)), {
				abortTimeout: _,
				clearTimeout: () => {
					_ && clearTimeout(_)
				}
			}), m = await O(I.url, I);
			N();
			let g = {
				response: m,
				request: I
			};
			for (let e of E.onResponse)
				if (e) {
					let r = await e(eg(em({}, g), {
						response: (null == (o = null == t ? void 0 : t.hookOptions) ? void 0 : o.cloneResponse) ? m.clone() : m
					}));
					r instanceof Response ? m = r : "object" == typeof r && null !== r && (m = r.response)
				} if (m.ok) {
				if ("HEAD" === I.method) return {
					data: "",
					error: null
				};
				let e = function(e) {
						let t = e.headers.get("content-type"),
							r = new Set(["image/svg", "application/xml", "application/xhtml", "application/html"]);
						if (!t) return "json";
						let n = t.split(";").shift() || "";
						return eU.test(n) ? "json" : r.has(n) || n.startsWith("text/") ? "text" : "blob"
					}(m),
					r = {
						data: null,
						response: m,
						request: I
					};
				if ("json" === e || "text" === e) {
					let e = await m.text(),
						t = null != (i = I.jsonParser) ? i : ew;
					r.data = await t(e)
				} else r.data = await m[e]();
				for (let e of ((null == I ? void 0 : I.output) && I.output && !I.disableValidation && (r.data = await eF(I.output, r.data)), E.onSuccess)) e && await e(eg(em({}, r), {
					response: (null == (a = null == t ? void 0 : t.hookOptions) ? void 0 : a.cloneResponse) ? m.clone() : m
				}));
				return (null == t ? void 0 : t.throw) ? r.data : {
					data: r.data,
					error: null
				}
			}
			let S = null != (s = null == t ? void 0 : t.jsonParser) ? s : ew,
				v = await m.text(),
				L = function(e) {
					try {
						return JSON.parse(e), !0
					} catch (e) {
						return !1
					}
				}(v),
				b = L ? await S(v) : null,
				y = {
					response: m,
					responseText: v,
					request: I,
					error: eg(em({}, b), {
						status: m.status,
						statusText: m.statusText
					})
				};
			for (let e of E.onError) e && await e(eg(em({}, y), {
				response: (null == (l = null == t ? void 0 : t.hookOptions) ? void 0 : l.cloneResponse) ? m.clone() : m
			}));
			if (null == t ? void 0 : t.retry) {
				let r = function(e) {
						if ("number" == typeof e) return new eL({
							type: "linear",
							attempts: e,
							delay: 1e3
						});
						switch (e.type) {
							case "linear":
								return new eL(e);
							case "exponential":
								return new eb(e);
							default:
								throw Error("Invalid retry strategy")
						}
					}(t.retry),
					n = null != (u = t.retryAttempt) ? u : 0;
				if (await r.shouldAttemptRetry(n, m)) {
					for (let e of E.onRetry) e && await e(g);
					let o = r.getDelay(n);
					return await new Promise(e => setTimeout(e, o)), await eV(e, eg(em({}, t), {
						retryAttempt: n + 1
					}))
				}
			}
			if (null == t ? void 0 : t.throw) throw new eS(m.status, m.statusText, L ? b : v);
			return {
				data: null,
				error: eg(em({}, b), {
					status: m.status,
					statusText: m.statusText
				})
			}
		};
	let eH = /[\p{Ll}\d]+|\p{Lu}+(?!\p{Ll})|\p{Lu}[\p{Ll}\d]+|\p{Lo}+/gu,
		eG = /['\u2019]/g;

	function ez(e) {
		return (e.replace(eG, "").match(eH) ?? []).map(e => e.toLowerCase()).join("-")
	}

	function eW(e, t) {
		let r = t.split(".").flatMap(e => (function e(t) {
				if (ek.test(t)) {
					let [, r, n] = t.match(ek);
					return [...e(r), n]
				}
				return [t]
			})(e)),
			n = e;
		for (let e of r) {
			if (null == n) return;
			n = n[e]
		}
		return n
	}
	let ek = /(.*)\[(\d+)\]/;
	var ej = e.i(170380);
	let ex = function(e) {
			var t;
			let {
				pluginPathMethods: r,
				pluginsActions: n,
				pluginsAtoms: o,
				$fetch: i,
				$store: a,
				atomListeners: s
			} = (e => {
				var t;
				let r, n, o, i, a, s, l, u, _, E = "credentials" in Request.prototype,
					c = function(e, t, r, n) {
						if (e) return q(e, t);
						if (!1 !== n) {
							let e = j.BETTER_AUTH_URL || j.NEXT_PUBLIC_BETTER_AUTH_URL || j.PUBLIC_BETTER_AUTH_URL || j.NUXT_PUBLIC_BETTER_AUTH_URL || j.NUXT_PUBLIC_AUTH_URL || ("/" !== j.BASE_URL ? j.BASE_URL : void 0);
							if (e) return q(e, t)
						}
						r?.headers.get("x-forwarded-host"), r?.headers.get("x-forwarded-proto");
						if (r) {
							let e = function(e) {
								try {
									let t = new URL(e);
									return "null" === t.origin ? null : t.origin
								} catch {
									return null
								}
							}(r.url);
							if (!e) throw new T("Could not get origin from request. Please provide a valid base URL.");
							return q(e, t)
						}
						if ("u" > typeof window && window.location) return q(window.location.origin, t)
					}(e?.baseURL, e?.basePath, void 0, void 0) ?? (e => {
						if (void 0 !== S.default) {
							if (S.default.env.NEXT_PUBLIC_AUTH_URL) return S.default.env.NEXT_PUBLIC_AUTH_URL;
							if ("u" < typeof window) {
								if (S.default.env.NEXTAUTH_URL) try {
									return S.default.env.NEXTAUTH_URL
								} catch {}
								if (S.default.env.VERCEL_URL) try {
									let t = S.default.env.VERCEL_URL.startsWith("http") ? "" : "https://";
									return `${new URL(`${t}${S.default.env.VERCEL_URL}`).origin}${e??"/api/auth"}`
								} catch {}
							}
						}
					})(e?.basePath) ?? "/api/auth",
					d = e?.plugins?.flatMap(e => e.fetchPlugins).filter(e => void 0 !== e) || [],
					O = {
						id: "lifecycle-hooks",
						name: "lifecycle-hooks",
						hooks: {
							onSuccess: e?.fetchOptions?.onSuccess,
							onError: e?.fetchOptions?.onError,
							onRequest: e?.fetchOptions?.onRequest,
							onResponse: e?.fetchOptions?.onResponse
						}
					},
					{
						onSuccess: f,
						onError: A,
						onRequest: p,
						onResponse: R,
						...h
					} = e?.fetchOptions || {},
					I = (t = {
						baseURL: c,
						...E ? {
							credentials: "include"
						} : {},
						method: "GET",
						jsonParser: e => e ? function(e, t = {
							strict: !0
						}) {
							return function(e, t = {}) {
								let {
									strict: r = !1,
									warnings: n = !1,
									reviver: o,
									parseDates: i = !0
								} = t;
								if ("string" != typeof e) return e;
								let a = e.trim(),
									s = a.toLowerCase();
								if (s.length <= 9 && s in Z) return Z[s];
								if (!X.test(a)) {
									if (r) throw SyntaxError("[better-json] Invalid JSON");
									return e
								}
								if (Object.entries(K).some(([e, t]) => {
										let r = t.test(a);
										return r && n && console.warn(`[better-json] Detected potential prototype pollution attempt using ${e} pattern`), r
									}) && r) throw Error("[better-json] Potential prototype pollution attempt detected");
								try {
									return JSON.parse(a, (e, t) => {
										if ("__proto__" === e || "constructor" === e && t && "object" == typeof t && "prototype" in t) {
											n && console.warn(`[better-json] Dropping "${e}" key to prevent prototype pollution`);
											return
										}
										if (i && "string" == typeof t) {
											let e = function(e) {
												let t = Q.exec(e);
												if (!t) return null;
												let [, r, n, o, i, a, s, l, u, _, E] = t, c = new Date(Date.UTC(parseInt(r, 10), parseInt(n, 10) - 1, parseInt(o, 10), parseInt(i, 10), parseInt(a, 10), parseInt(s, 10), l ? parseInt(l.padEnd(3, "0"), 10) : 0));
												if (u) {
													let e = (60 * parseInt(_, 10) + parseInt(E, 10)) * ("+" === u ? -1 : 1);
													c.setUTCMinutes(c.getUTCMinutes() + e)
												}
												return c instanceof Date && !isNaN(c.getTime()) ? c : null
											}(t);
											if (e) return e
										}
										return o ? o(e, t) : t
									})
								} catch (t) {
									if (r) throw t;
									return e
								}
							}(e, t)
						}(e, {
							strict: !1
						}) : null,
						customFetchImpl: fetch,
						...h,
						plugins: [O, ...h.plugins || [], ...e?.disableDefaultFetchPlugins ? [] : [ee], ...d]
					}, async function(e, r) {
						let n, o = eg(em(em({}, t), r), {
							headers: eC(null == t ? void 0 : t.headers, null == r ? void 0 : r.headers),
							plugins: [...(null == t ? void 0 : t.plugins) || [], (n = t || {}, {
								id: "apply-schema",
								name: "Apply Schema",
								version: "1.0.0",
								async init(e, t) {
									var r, o, i, a;
									let s = (null == (o = null == (r = n.plugins) ? void 0 : r.find(t => {
										var r;
										return null != (r = t.schema) && !!r.config && (e.startsWith(t.schema.config.baseURL || "") || e.startsWith(t.schema.config.prefix || ""))
									})) ? void 0 : o.schema) || n.schema;
									if (s) {
										let r = e;
										(null == (i = s.config) ? void 0 : i.prefix) && r.startsWith(s.config.prefix) && (r = r.replace(s.config.prefix, ""), s.config.baseURL && (e = e.replace(s.config.prefix, s.config.baseURL))), (null == (a = s.config) ? void 0 : a.baseURL) && r.startsWith(s.config.baseURL) && (r = r.replace(s.config.baseURL, "")), r.startsWith("/") && "@" === r.charAt(1) && (r = r.substring(1));
										let n = s.schema[r];
										if (n) {
											let r = null == t ? void 0 : t.headers;
											if (n.headers && !(null == t ? void 0 : t.disableValidation)) {
												let e = {};
												if (null == t ? void 0 : t.headers) {
													if (t.headers instanceof Headers) t.headers.forEach((t, r) => {
														e[r.toLowerCase()] = t
													});
													else if ("object" == typeof t.headers)
														for (let [r, n] of Object.entries(t.headers)) null != n && (e[r.toLowerCase()] = n)
												}
												let o = await eF(n.headers, e),
													i = {};
												for (let [e, t] of Object.entries(o)) i[e.toLowerCase()] = t;
												r = i
											}
											let o = eg(em({}, t), {
												method: n.method,
												output: n.output,
												headers: r
											});
											return (null == t ? void 0 : t.disableValidation) || (o = eg(em({}, o), {
												body: n.input ? await eF(n.input, null == t ? void 0 : t.body) : null == t ? void 0 : t.body,
												params: n.params ? await eF(n.params, null == t ? void 0 : t.params) : null == t ? void 0 : t.params,
												query: n.query ? await eF(n.query, null == t ? void 0 : t.query) : null == t ? void 0 : t.query
											})), {
												url: e,
												options: o
											}
										}
									}
									return {
										url: e,
										options: t
									}
								}
							}), ...(null == r ? void 0 : r.plugins) || []]
						});
						if (null == t ? void 0 : t.catchAllError) try {
							return await eV(e, o)
						} catch (e) {
							return {
								data: null,
								error: {
									status: 500,
									statusText: "Fetch Error",
									message: "Fetch related error. Captured by catchAllError option. See error property for more details.",
									error: e
								}
							}
						}
						return await eV(e, o)
					}),
					{
						$sessionSignal: N,
						session: m,
						broadcastSessionUpdate: g
					} = (n = C(!1), o = 0, i = 0, n.listen(() => {
						i++, o = 0
					}), U(s = C({
						data: null,
						error: null,
						isPending: !0,
						isRefetching: !1,
						refetch: a = e => u(e)
					}), ec), l = async (e, t) => {
						let r = s.value;
						if (s.set({
								...r,
								isPending: null === r.data,
								isRefetching: !0,
								error: null,
								refetch: a
							}), e.aborted) return "aborted";
						try {
							var n;
							let r = await I("/get-session", {
								method: "GET",
								query: t?.query,
								signal: e
							});
							if (e.aborted) return "aborted";
							let {
								data: o,
								error: i
							} = eE(r), l = "fresh";
							if (o?.needsRefresh) try {
								let t = await I("/get-session", {
									method: "POST",
									signal: e
								});
								if (e.aborted) return "aborted";
								({
									data: o,
									error: i
								} = eE(t))
							} catch {
								if (e.aborted) return "aborted";
								l = "stale"
							}
							if (i) {
								let e = s.value,
									t = i?.status === 401;
								return s.set({
									data: t ? null : e.data,
									error: i,
									isPending: !1,
									isRefetching: !1,
									refetch: a
								}), "failed"
							}
							let u = (n = o) && (null !== n.session || null !== n.user) ? n : null,
								_ = s.value,
								E = null != _.data && null != u && y(_.data, u) ? _.data : u;
							return s.set({
								data: E,
								error: null,
								isPending: !1,
								isRefetching: !1,
								refetch: a
							}), l
						} catch (r) {
							if (e.aborted) return "aborted";
							let t = s.value;
							return s.set({
								data: t.data,
								error: r,
								isPending: !1,
								isRefetching: !1,
								refetch: a
							}), "failed"
						}
					}, u = e => {
						o = 0, r?.cancel();
						let t = new AbortController,
							n = {
								cancel: () => t.abort(),
								promise: Promise.resolve().then(() => t.signal.aborted ? "aborted" : l(t.signal, e)),
								revision: i
							};
						r = n;
						let a = e => {
							if (r === n) {
								let t, a;
								r = void 0, "fresh" === e && n.revision === i && (a = (t = s.value.data?.session?.expiresAt) instanceof Date ? t.getTime() : 1 / 0, o = Math.min(Date.now() + 1e3, a))
							}
						};
						return n.promise.then(a, () => a("failed")), n.promise.then(() => void 0)
					}, _ = () => {}, L(s, () => {
						let t;
						"u" < typeof window || (t = setTimeout(() => {
							r?.revision === i ? r.promise.then(() => void 0) : Date.now() < o ? Promise.resolve() : u()
						}, 0));
						let a = function(e) {
							let {
								fetchSession: t,
								shouldPollSession: r = () => !0,
								sessionSignal: n,
								options: o = {}
							} = e, i = o.sessionOptions?.refetchInterval ?? 0, a = o.sessionOptions?.refetchOnWindowFocus ?? !0, s = o.sessionOptions?.refetchWhenOffline ?? !1, l = {
								isInitialized: !1,
								lastSessionRequest: 0
							}, u = e => {
								if (s || eu().isOnline) {
									if (e?.event === "storage") return void t();
									if (e?.event === "poll") {
										l.lastSessionRequest = e_(), t();
										return
									}
									if (e?.event === "visibilitychange") {
										if (e_() - l.lastSessionRequest < 5) return;
										l.lastSessionRequest = e_(), t();
										return
									}
									t()
								}
							};
							return {
								init: () => {
									l.isInitialized || (l.isInitialized = !0, i && i > 0 && (l.pollInterval = setInterval(() => {
										r() && u({
											event: "poll"
										})
									}, 1e3 * i)), l.unsubscribeBroadcast = en().subscribe(() => {
										u({
											event: "storage"
										})
									}), a && (l.unsubscribeFocus = ea().subscribe(() => {
										u({
											event: "visibilitychange"
										})
									})), l.unsubscribeOnline = eu().subscribe(e => {
										e && u({
											event: "visibilitychange"
										})
									}), l.unsubscribeSignal = n.listen(() => {
										t()
									}), l.cleanupBroadcastSetup = en().setup(), l.cleanupFocusSetup = ea().setup(), l.cleanupOnlineSetup = eu().setup())
								},
								cleanup: () => {
									l.isInitialized && (l.pollInterval && (clearInterval(l.pollInterval), l.pollInterval = void 0), l.unsubscribeBroadcast && (l.unsubscribeBroadcast(), l.unsubscribeBroadcast = void 0), l.unsubscribeFocus && (l.unsubscribeFocus(), l.unsubscribeFocus = void 0), l.unsubscribeOnline && (l.unsubscribeOnline(), l.unsubscribeOnline = void 0), l.unsubscribeSignal && (l.unsubscribeSignal(), l.unsubscribeSignal = void 0), l.cleanupBroadcastSetup && (l.cleanupBroadcastSetup(), l.cleanupBroadcastSetup = void 0), l.cleanupFocusSetup && (l.cleanupFocusSetup(), l.cleanupFocusSetup = void 0), l.cleanupOnlineSetup && (l.cleanupOnlineSetup(), l.cleanupOnlineSetup = void 0), l.isInitialized = !1, l.lastSessionRequest = 0)
								},
								triggerRefetch: u,
								broadcastSessionUpdate: e => {
									en().post({
										event: "session",
										data: {
											trigger: e
										},
										clientId: Math.random().toString(36).substring(7)
									})
								}
							}
						}({
							fetchSession: u,
							shouldPollSession: () => null != s.value.data,
							sessionSignal: n,
							options: e
						});
						return a.init(), _ = a.broadcastSessionUpdate, () => {
							t && clearTimeout(t), a.cleanup()
						}
					}), {
						session: s,
						$sessionSignal: n,
						broadcastSessionUpdate: e => _(e)
					}),
					v = e?.plugins || [],
					b = {},
					D = {
						$sessionSignal: N,
						session: m
					},
					w = {
						"/sign-out": "POST",
						"/revoke-sessions": "POST",
						"/revoke-other-sessions": "POST",
						"/delete-user": "POST"
					},
					P = [{
						signal: "$sessionSignal",
						matcher: e => "/sign-out" === e || "/update-user" === e || "/update-session" === e || "/sign-up/email" === e || "/sign-in/email" === e || "/delete-user" === e || "/verify-email" === e || "/revoke-sessions" === e || "/revoke-session" === e || "/revoke-other-sessions" === e || "/change-email" === e || "/change-password" === e,
						callback(e) {
							"/sign-out" === e ? g("signout") : ("/update-user" === e || "/update-session" === e) && g("updateUser")
						}
					}];
				for (let e of v) e.getAtoms && Object.assign(D, e.getAtoms?.(I)), e.pathMethods && Object.assign(w, e.pathMethods), e.atomListeners && P.push(...e.atomListeners);
				let Y = {
					notify: e => {
						D[e].set(!D[e].get())
					},
					listen: (e, t) => {
						D[e].subscribe(t)
					},
					atoms: D
				};
				for (let t of v) t.getActions && (b = eT(t.getActions?.(I, Y, e) ?? {}, b));
				return {
					get baseURL() {
						return c
					},
					pluginsActions: b,
					pluginsAtoms: D,
					pluginPathMethods: w,
					atomListeners: P,
					$fetch: I,
					$store: Y
				}
			})(e), l = {};
			for (let [e, t] of Object.entries(o)) l[function(e) {
				return `use${e.charAt(0).toUpperCase()+e.slice(1)}`
			}(e)] = () => (function(e, t = {}) {
				let r = (0, ej.useRef)(e.get()),
					{
						keys: n,
						deps: o = [e, n]
					} = t,
					i = (0, ej.useCallback)(t => {
						let o = e => {
							r.current !== e && (r.current = e, t())
						};
						if (o(e.value), n?.length) {
							let t;
							return t = new Set(n), e.listen((r, i, a) => {
								let s = e => !Object.is(eW(r, e), eW(i, e));
								(void 0 === a ? n.some(t => void 0 === i || (e.eqKey ? !e.eqKey(i[t], r[t], t) : s(t))) : t.has(a) || "string" == typeof a && (t.has(a.split(/\.|\[/)[0]) || !e.eqKey && void 0 !== i && n.some(s))) && o(r)
							})
						}
						return e.listen(o)
					}, o),
					a = () => r.current;
				return (0, ej.useSyncExternalStore)(i, a, a)
			})(t);
			return t = {
					...n,
					...l,
					$fetch: i,
					$store: a
				},
				function e(n = []) {
					return new Proxy(function() {}, {
						get(r, o) {
							var i;
							if ("string" != typeof o || "then" === o || "catch" === o || "finally" === o) return;
							let a = [...n, o],
								s = t;
							for (let e of a)
								if (s && "object" == typeof s && e in s) s = s[e];
								else {
									s = void 0;
									break
								} return "function" == typeof s ? s : "object" == typeof(i = s) && null !== i && "get" in i && "function" == typeof i.get && "lc" in i && "number" == typeof i.lc ? s : e(a)
						},
						apply: async (e, t, a) => {
							let l = "/" + n.map(ez).join("/"),
								u = a[0] || {},
								_ = a[1] || {},
								{
									query: E,
									fetchOptions: c,
									...d
								} = u,
								O = {
									..._,
									...c
								},
								T = function(e, t, r) {
									let n = t[e],
										{
											fetchOptions: o,
											query: i,
											...a
										} = r || {};
									return n || (o?.method ? o.method : a && Object.keys(a).length > 0 ? "POST" : "GET")
								}(l, r, u);
							return await i(l, {
								...O,
								body: "GET" === T ? void 0 : {
									...d,
									...O?.body || {}
								},
								query: E || O?.query,
								method: T,
								async onSuccess(e) {
									if (await O?.onSuccess?.(e), !s || O.disableSignal) return;
									let t = s.filter(e => e.matcher(l));
									if (!t.length) return;
									let r = new Set;
									for (let e of t) {
										let t = o[e.signal];
										if (!t) return;
										if (r.has(e.signal)) continue;
										r.add(e.signal);
										let n = t.get();
										setTimeout(() => {
											t.set(!n)
										}, 10), e.callback?.(l)
									}
								}
							})
						}
					})
				}()
		}({
			plugins: [(t = {
				admin: I,
				user: N
			}, {
				id: "admin-client",
				version: c,
				$InferServerPlugin: {},
				getActions: () => ({
					admin: {
						checkRolePermission: e => (e => {
							if (e.userId && e.options?.adminUserIds?.includes(e.userId)) return !0;
							if (!e.permissions) return !1;
							let t = (e.role || e.options?.defaultRole || "user").split(","),
								r = e.options?.roles || m;
							for (let n of t)
								if (r[n]?.authorize(e.permissions)?.success) return !0;
							return !1
						})({
							role: e.role,
							options: {
								ac: void 0,
								roles: t
							},
							permissions: e.permissions
						})
					}
				}),
				pathMethods: {
					"/admin/list-users": "GET",
					"/admin/impersonate-user": "POST",
					"/admin/stop-impersonating": "POST"
				},
				atomListeners: [{
					matcher: e => "/admin/impersonate-user" === e || "/admin/stop-impersonating" === e,
					signal: "$sessionSignal"
				}],
				$ERROR_CODES: g
			}), {
				id: "api-key",
				version: "1.6.34",
				$InferServerPlugin: {},
				pathMethods: {
					"/api-key/create": "POST",
					"/api-key/delete": "POST",
					"/api-key/delete-all-expired-api-keys": "POST"
				},
				$ERROR_CODES: E
			}, (r = C(!1), n = C(!1), o = C(!1), i = C(!1), a = {
				admin: B,
				member: H,
				owner: V
			}, {
				id: "organization",
				version: c,
				$InferServerPlugin: {},
				getActions: (e, t, r) => ({
					$Infer: {
						ActiveOrganization: {},
						Organization: {},
						Invitation: {},
						Member: {},
						Team: {}
					},
					organization: {
						checkRolePermission: e => {
							let t;
							return ((e, t) => {
								if (!e.permissions) return !1;
								let r = e.role.split(","),
									n = e.options.creatorRole || "owner",
									o = r.includes(n),
									i = e.allowCreatorAllPermissions || !1;
								if (o && i) return !0;
								for (let n of r)
									if (t[n]?.authorize(e.permissions)?.success) return !0;
								return !1
							})(t = {
								role: e.role,
								options: {
									ac: void 0,
									roles: a
								},
								permissions: e.permissions
							}, t.options.roles || G)
						}
					}
				}),
				getAtoms: e => {
					let t = M(r, "/organization/list", e, {
						method: "GET"
					});
					return {
						$listOrg: r,
						$activeOrgSignal: n,
						$activeMemberSignal: o,
						$activeMemberRoleSignal: i,
						activeOrganization: M([n], "/organization/get-full-organization", e, () => ({
							method: "GET"
						})),
						listOrganizations: t,
						activeMember: M([n, o], "/organization/get-active-member", e, {
							method: "GET"
						}),
						activeMemberRole: M([n, i], "/organization/get-active-member-role", e, {
							method: "GET"
						})
					}
				},
				pathMethods: {
					"/organization/get-full-organization": "GET",
					"/organization/list-user-teams": "GET"
				},
				atomListeners: [{
					matcher: e => "/organization/create" === e || "/organization/delete" === e || "/organization/update" === e,
					signal: "$listOrg"
				}, {
					matcher: e => "/sign-out" === e || e.startsWith("/organization"),
					signal: "$activeOrgSignal"
				}, {
					matcher: e => e.startsWith("/organization/set-active") || "/organization/create" === e || "/organization/delete" === e || "/organization/remove-member" === e || "/organization/leave" === e || "/organization/accept-invitation" === e,
					signal: "$sessionSignal"
				}, {
					matcher: e => e.includes("/organization/update-member-role") || e.startsWith("/organization/set-active"),
					signal: "$activeMemberSignal"
				}, {
					matcher: e => e.includes("/organization/update-member-role") || e.startsWith("/organization/set-active"),
					signal: "$activeMemberRoleSignal"
				}],
				$ERROR_CODES: z
			}), {
				id: "sso-client",
				version: "1.6.34",
				$InferServerPlugin: {},
				pathMethods: {
					"/sso/providers": "GET",
					"/sso/get-provider": "GET"
				}
			}, {
				id: "additional-fields-client",
				version: c,
				$InferServerPlugin: {}
			}]
		}),
		{
			signIn: e$,
			signUp: eq,
			signOut: eK,
			useSession: eX,
			apiKey: eZ
		} = ex;

	function eQ(e, t, r) {
		let n, o, i, a = (0, u.c)(9);
		a[0] !== e || a[1] !== t ? (n = r => t ? e.subscribe(r) : eJ, a[0] = e, a[1] = t, a[2] = n) : n = a[2];
		let s = n;
		return a[3] !== e || a[4] !== t || a[5] !== r ? (o = () => t ? e.get() : r, a[3] = e, a[4] = t, a[5] = r, a[6] = o) : o = a[6], a[7] !== r ? (i = () => r, a[7] = r, a[8] = i) : i = a[8], (0, ej.useSyncExternalStore)(s, o, i)
	}

	function eJ() {}
	let e0 = {
		data: null,
		error: null,
		isPending: !1,
		isRefetching: !1,
		refetch: async () => {}
	};
	e.s(["i", 0, ex, "O", 0, e$, "_", 0, eK, "M", 0, function() {
		let {
			data: e
		} = ex.useSession(), t = !!e?.session?.activeOrganizationId;
		return eQ(ex.$store.atoms.activeOrganization, t, e0)
	}, "r", 0, function() {
		let {
			data: e
		} = ex.useSession(), t = !!e?.user && !e?.user.isAnonymous;
		return eQ(ex.$store.atoms.listOrganizations, t, e0)
	}, "U", 0, eX], 663303)
}]);