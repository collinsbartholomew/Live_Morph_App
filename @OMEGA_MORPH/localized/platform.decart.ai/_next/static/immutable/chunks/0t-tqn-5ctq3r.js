(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["object" == typeof document ? document.currentScript : void 0, 458035, e => {
	"use strict";
	var t = e.i(486399);
	let a = ["480p", "720p"];

	function r(e) {
		let r = new Set;
		for (let a of (0, t.H)(e))
			for (let e of Object.keys(a.credits)) r.add(e);
		return Array.from(r).sort((e, t) => {
			let r = a.indexOf(e),
				i = a.indexOf(t);
			return -1 === r ? 1 : -1 === i ? -1 : r - i
		})
	}

	function i(e) {
		let a = [];
		for (let r of (0, t.H)(e))
			for (let e of Object.values(r.credits)) "number" == typeof e && a.push(e);
		if (0 === a.length) return {
			min: "0 Credits",
			max: "0 Credits"
		};
		let r = e => 1 === e ? `${e} Credit` : `${e} Credits`;
		return {
			min: r(Math.min(...a)),
			max: r(Math.max(...a))
		}
	}
	let l = {
		"lucy-image-edit": {
			model: {
				image: "../../../../models/image-edit/header.webp",
				title: "Lucy Image",
				description: "Edit images with text prompts for controlled results"
			},
			descriptionData: {
				description: "Lucy Image enables fast, controlled image editing - input an image, prompt the changes, and get back your finished product. Iterate rapidly.",
				features: [{
					label: "Clothing & Outfit Swaps"
				}, {
					label: "Character Transformation"
				}, {
					label: "Object Replacement"
				}, {
					label: "Style Transfer"
				}, {
					label: "Identity Preservation"
				}, {
					label: "Precision Editing"
				}],
				images: ["../../../../models/image-edit/example_1.webp", "../../../../models/image-edit/example_2.webp", "../../../../models/image-edit/example_3.webp"]
			},
			parameters: {
				input: "image",
				output: "image",
				resolution: r("lucy-image-edit"),
				priceRange: i("lucy-image-edit"),
				avgGenTime: {
					value: "3",
					unit: "s"
				},
				quality: ["Pro"],
				apiParameters: [{
					name: "prompt",
					label: "Input",
					type: "textarea",
					maxLength: 1e3,
					apiType: "string",
					required: !0,
					description: "Describe the changes you want to make to the image. Be specific about what to modify, add, or remove while preserving other elements.",
					placeholder: "Describe the changes you want to make..."
				}, {
					name: "data",
					label: "Input Image",
					type: "file",
					apiType: "File",
					required: !0,
					description: "The image you want to edit. Supports JPEG, PNG, and WebP formats up to 5MB.",
					accept: "image/*"
				}, {
					name: "reference_image",
					label: "Reference Image",
					type: "file",
					apiType: "File",
					required: !1,
					description: "Upload a reference image to guide the edit (e.g., an image of the specific item you want to add).",
					accept: "image/*",
					skipCrop: !0
				}, {
					name: "model_version",
					label: "Model Version",
					type: "model-version",
					apiType: "string",
					required: !1,
					description: "Select the model quality version"
				}, {
					name: "resolution",
					label: "Resolution",
					type: "select",
					apiType: "string",
					required: !1,
					description: "Output image resolution. Higher resolutions provide more detail but take slightly longer to process.",
					defaultValue: "720p",
					options: ["480p", "720p"]
				}]
			},
			formConfig: {
				standaloneFields: ["prompt", "reference_image", "data"],
				sections: [{
					title: "Generation settings",
					fields: ["model_version", "resolution"],
					layout: "two-column",
					collapsible: !1,
					defaultOpen: !0
				}]
			},
			docsUrl: "#",
			playgroundExample: {
				prompt: "Change the cake's color to light pink.",
				inputMedia: "../../../../models/models-initial-state/lucy-image-edit-input-example.png",
				outputMedia: "../../../../models/models-initial-state/lucy-image-edit-output-example.png"
			}
		},
		"lucy-restyle-v2v": {
			model: {
				image: "../../../../models/restyle-rt/header.webp",
				title: "Lucy Restyle",
				description: "Long-Form Video Restyling"
			},
			descriptionData: {
				description: "Apply a new visual style to entire videos - not just short scenes. LSD Long-Form supports videos of any length up to 30 minutes, making it easy to restyle full videos from start to finish in a single workflow.",
				features: [{
					label: "Style Transfer"
				}, {
					label: "Temporal Consistency"
				}, {
					label: "Motion Preservation"
				}, {
					label: "Prompt-Controlled Restyling"
				}, {
					label: "High Quality Output"
				}],
				images: ["../../../../models/restyle-rt/example_1.webp", "../../../../models/restyle-rt/example_2.webp", "../../../../models/restyle-rt/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-restyle-v2v"),
				priceRange: i("lucy-restyle-v2v"),
				avgGenTime: {
					value: "20",
					unit: "s"
				},
				quality: ["Pro"],
				apiParameters: [{
					name: "prompt",
					label: "Style Prompt",
					type: "textarea",
					maxLength: 1e3,
					apiType: "string",
					required: !1,
					description: "Describe the style you want to apply to the video.",
					placeholder: "Describe the style you want to apply..."
				}, {
					name: "reference_image",
					label: "Style Reference Image",
					type: "file",
					apiType: "File",
					required: !1,
					description: "Upload an image to use as style reference (alternative to prompt).",
					accept: "image/*",
					skipCrop: !0
				}, {
					name: "data",
					label: "Input Video",
					type: "file",
					apiType: "File",
					required: !0,
					description: "The video you want to restyle. Supports MP4, WebM, and QuickTime formats up to 200MB.",
					accept: "video/*"
				}, {
					name: "model_version",
					label: "Model Version",
					type: "model-version",
					apiType: "string",
					required: !1,
					description: "Select the model quality version"
				}, {
					name: "resolution",
					label: "Resolution",
					type: "select",
					apiType: "string",
					required: !1,
					description: "Output video resolution.",
					defaultValue: "720p",
					options: ["720p"]
				}]
			},
			formConfig: {
				standaloneFields: ["prompt", "reference_image", "data"],
				sections: [{
					title: "Generation settings",
					fields: ["model_version", "resolution"],
					layout: "two-column",
					collapsible: !1,
					defaultOpen: !0
				}],
				mutuallyExclusiveFields: {
					prompt: {
						excludes: "reference_image",
						reason: "Clear the reference image to use a text prompt"
					},
					reference_image: {
						excludes: "prompt",
						reason: "Clear the prompt to use a reference image"
					}
				}
			},
			docsUrl: "#"
		},
		"lucy-restyle-live": {
			model: {
				image: "../../../../models/restyle-rt/header.webp",
				title: "Lucy Restyle",
				description: "Restyle video in realtime"
			},
			descriptionData: {
				description: "Lucy Restyle is a zero-latency, autoregressive video model - generating video infinitely and in real time. It allows restyling of any video, instantly adapts to input and keeps temporal coherence.",
				features: [{
					label: "Realtime Processing"
				}, {
					label: "WebRTC Support"
				}, {
					label: "Dynamic Prompt Changes"
				}, {
					label: "Zero Latency"
				}, {
					label: "Live Streaming"
				}],
				images: ["../../../../models/restyle-rt/example_1.webp", "../../../../models/restyle-rt/example_2.webp", "../../../../models/restyle-rt/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-restyle-live"),
				priceRange: i("lucy-restyle-live"),
				avgGenTime: {
					value: "Realtime",
					unit: ""
				},
				quality: ["Pro", "Dev"],
				apiParameters: [{
					name: "prompt",
					type: "textarea",
					apiType: "string",
					maxLength: 1e3,
					required: !0,
					description: "Style transformation description"
				}, {
					name: "stream",
					type: "file",
					apiType: "File",
					required: !0,
					description: "Video stream (WebRTC)"
				}]
			},
			formConfig: {
				sections: []
			},
			docsUrl: "#"
		},
		"lucy-edit-live": {
			model: {
				image: "../../../../models/edit-rt/header.webp",
				title: "Lucy",
				description: "Edit video in realtime with controlled, targeted prompts"
			},
			descriptionData: {
				description: "Lucy enables targeted video edits, modifying specific elements while preserving the rest. Edit infinite long videos in realtime, with zero latency, and see your changes as you type.",
				features: [{
					label: "Infinite Stream Support"
				}, {
					label: "Local Edits"
				}, {
					label: "Object Replacement"
				}, {
					label: "Live Editing"
				}, {
					label: "Frame Accuracy"
				}, {
					label: "Scene Preservation"
				}],
				images: ["../../../../models/image-edit/example_1.webp", "../../../../models/image-edit/example_2.webp", "../../../../models/image-edit/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-edit-live"),
				priceRange: i("lucy-edit-live"),
				avgGenTime: {
					value: "2x",
					unit: "duration"
				},
				quality: ["Pro", "Dev"],
				apiParameters: [{
					name: "prompt",
					type: "textarea",
					apiType: "string",
					maxLength: 1e3,
					required: !0,
					description: "Edit description for live transformation"
				}, {
					name: "stream",
					type: "file",
					apiType: "File",
					required: !0,
					description: "Video stream (WebRTC)"
				}]
			},
			formConfig: {
				sections: []
			},
			docsUrl: "#"
		},
		"lucy-edit-2": {
			model: {
				image: "../../../../models/edit-rt/header.webp",
				title: "Lucy",
				description: "Long-Form Video Editing"
			},
			descriptionData: {
				description: "Edit entire videos with text prompts and optional reference images. Lucy supports videos up to 30 minutes, making it easy to edit full videos from start to finish in a single workflow.",
				features: [{
					label: "Long-Form Editing"
				}, {
					label: "Temporal Consistency"
				}, {
					label: "Motion Preservation"
				}, {
					label: "Prompt-Controlled Editing"
				}, {
					label: "Reference Image Support"
				}],
				images: ["../../../../models/image-edit/example_1.webp", "../../../../models/image-edit/example_2.webp", "../../../../models/image-edit/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-edit-2"),
				priceRange: i("lucy-edit-2"),
				avgGenTime: {
					value: "20",
					unit: "s"
				},
				quality: ["Pro"],
				apiParameters: [{
					name: "prompt",
					label: "Edit Prompt",
					type: "textarea",
					maxLength: 1e3,
					apiType: "string",
					required: !1,
					description: "Describe the edits you want to apply to the video.",
					placeholder: "Describe the edits you want to apply..."
				}, {
					name: "reference_image",
					label: "Reference Image",
					type: "file",
					apiType: "File",
					required: !1,
					description: "Upload a reference image to guide the edit.",
					accept: "image/*",
					skipCrop: !0
				}, {
					name: "data",
					label: "Input Video",
					type: "file",
					apiType: "File",
					required: !0,
					description: "The video you want to edit. Supports MP4, WebM, and QuickTime formats up to 300MB.",
					accept: "video/*"
				}, {
					name: "model_version",
					label: "Model Version",
					type: "model-version",
					apiType: "string",
					required: !1,
					description: "Select the model quality version"
				}, {
					name: "resolution",
					label: "Resolution",
					type: "select",
					apiType: "string",
					required: !1,
					description: "Output video resolution.",
					defaultValue: "720p",
					options: ["720p"]
				}]
			},
			formConfig: {
				standaloneFields: ["prompt", "reference_image", "data"],
				sections: [{
					title: "Generation settings",
					fields: ["model_version", "resolution"],
					layout: "two-column",
					collapsible: !1,
					defaultOpen: !0
				}]
			},
			docsUrl: "#",
			playgroundExample: {
				prompt: "Add the hat on top of the women's head.",
				inputMedia: "../../../../models/models-initial-state/lucy-video-edit-input-example.mp4",
				outputMedia: "../../../../models/models-initial-state/lucy-video-edit-output-example.mp4",
				referenceImage: "../../../../models/models-initial-state/lucy-video-edit-input-image-example.png"
			}
		},
		"lucy-vton-realtime": {
			model: {
				image: "../../../../models/edit-rt/header.webp",
				title: "Lucy Virtual Try-On",
				description: "Dress subjects live with a prompt or a garment reference image"
			},
			descriptionData: {
				description: "Swap outfits, accessories, and garments on a live video stream. Upload a reference image of the garment, describe it with a prompt, or do both — Lucy Virtual Try-On dresses the subject as they move, holding the fit, drape, and body shape stable frame to frame with zero perceptible latency.",
				features: [{
					label: "Realtime Outfit Swapping"
				}, {
					label: "Garment Reference Image"
				}, {
					label: "Prompt + Image Together"
				}, {
					label: "Motion & Fit Preservation"
				}, {
					label: "Frame-to-Frame Consistency"
				}],
				images: ["../../../../models/image-edit/example_1.webp", "../../../../models/image-edit/example_2.webp", "../../../../models/image-edit/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-vton-realtime"),
				priceRange: i("lucy-vton-realtime"),
				avgGenTime: {
					value: "2x",
					unit: "duration"
				},
				quality: ["Pro"],
				apiParameters: [{
					name: "prompt",
					label: "Try-On Prompt",
					type: "textarea",
					apiType: "string",
					maxLength: 1e3,
					required: !1,
					description: "Describe the clothing or accessory to try on.",
					placeholder: "Wearing a red leather jacket..."
				}, {
					name: "image",
					label: "Garment Image",
					type: "file",
					apiType: "File",
					required: !1,
					description: "Reference image of the garment or accessory. Passed via initialState.image or realtimeClient.set({ image }).",
					accept: "image/*",
					skipCrop: !0
				}, {
					name: "stream",
					type: "file",
					apiType: "File",
					required: !0,
					description: "Video stream (WebRTC)"
				}]
			},
			formConfig: {
				sections: []
			},
			docsUrl: "#"
		},
		"lucy-vton": {
			model: {
				image: "../../../../models/edit-rt/header.webp",
				title: "Lucy Virtual Try-On",
				description: "Dress subjects in long-form video with a prompt or a garment reference image"
			},
			descriptionData: {
				description: "Apply garments to a full-length video in one shot. Upload a video of a person along with a reference image of the outfit — or describe it with a prompt — and Lucy Virtual Try-On dresses the subject realistically, preserving motion, body shape, and the surrounding scene from the original clip.",
				features: [{
					label: "Long-Form Outfit Swapping"
				}, {
					label: "Garment Reference Image"
				}, {
					label: "Prompt + Image Together"
				}, {
					label: "Motion & Fit Preservation"
				}, {
					label: "Scene-Aware Compositing"
				}],
				images: ["../../../../models/image-edit/example_1.webp", "../../../../models/image-edit/example_2.webp", "../../../../models/image-edit/example_3.webp"]
			},
			parameters: {
				input: "video",
				output: "video",
				resolution: r("lucy-vton"),
				priceRange: i("lucy-vton"),
				avgGenTime: {
					value: "20",
					unit: "s"
				},
				quality: ["Pro"],
				apiParameters: [{
					name: "prompt",
					label: "Try-On Prompt",
					type: "textarea",
					maxLength: 1e3,
					apiType: "string",
					required: !1,
					description: "Describe the clothing or accessory to try on.",
					placeholder: "Wearing a red leather jacket..."
				}, {
					name: "reference_image",
					label: "Garment Image",
					type: "file",
					apiType: "File",
					required: !1,
					description: "Upload an image of the garment or accessory to try on.",
					accept: "image/*",
					skipCrop: !0
				}, {
					name: "data",
					label: "Input Video",
					type: "file",
					apiType: "File",
					required: !0,
					description: "Video of the person to dress. Supports MP4, WebM, and QuickTime formats up to 200MB.",
					accept: "video/*"
				}, {
					name: "resolution",
					label: "Resolution",
					type: "select",
					apiType: "string",
					required: !1,
					description: "Output video resolution.",
					defaultValue: "720p",
					options: ["720p"]
				}]
			},
			formConfig: {
				standaloneFields: ["prompt", "reference_image", "data"],
				sections: [{
					title: "Generation settings",
					fields: ["resolution"],
					layout: "two-column",
					collapsible: !1,
					defaultOpen: !0
				}]
			},
			docsUrl: "#",
			playgroundExample: {
				prompt: "Substitute the subject shirt with a chunky white ribbed turtleneck sweater with a relaxed fit and balloon sleeves.",
				inputMedia: "../../../../models/models-initial-state/lucy-video-edit-input-example.mp4",
				outputMedia: "../../../../models/models-initial-state/lucy-video-edit-output-example.mp4",
				referenceImage: "../../../../presets/vton/knit-sweater.webp"
			}
		}
	};
	e.s(["f", 0, function(e) {
		return l[e]
	}], 458035)
}, 435448, e => {
	"use strict";
	var t = e.i(486399);
	let a = ["lucy-2.6|realtime", "lucy-2.5|realtime", "lucy-2.1|realtime"],
		r = ["lucy-2.6|batch", "lucy-2.5|batch", "lucy-2.1|batch"],
		i = ["lucy-vton-3.6|realtime", "lucy-vton-3.5|realtime"],
		l = ["lucy-vton-3.6|batch", "lucy-vton-3.5|batch"],
		n = {
			"lucy-edit-2": r,
			"lucy-edit-live": a,
			"lucy-vton-realtime": i,
			"lucy-vton": l
		};

	function s(e, a) {
		return e.map(e => {
			let r = (0, t.U)(e);
			if (!r) throw Error(`Unknown model registry key: ${e}`);
			let i = r.capabilities;
			return {
				value: a(e),
				label: i?.dropdownLabel ?? (0, t.f)(r),
				description: i?.dropdownDescription ?? t.I[r.pageGroup].description
			}
		})
	}
	let o = s(a, e => e),
		d = s(r, e => e),
		c = s(i, e => e),
		u = s(l, e => e);
	e.s(["y", 0, o, "i", 0, d, "Z", 0, u, "c", 0, c, "N", 0, function(e, a) {
		let r = n[a];
		if (r) return r.some(t => t === e);
		let i = (0, t.U)(e);
		return i?.pageGroup === a
	}, "m", 0, function(e, t) {
		return n[t]?.some(t => t === e) ?? !1
	}])
}, 205643, 567022, 835755, 278566, 553775, 324207, e => {
	"use strict";
	var t = e.i(234984),
		a = e.i(253149),
		r = e.i(833821),
		i = e.i(170380),
		l = e.i(322932),
		n = e.i(8774),
		s = e.i(546009),
		o = e.i(155990),
		d = e.i(169497),
		c = e.i(458035),
		u = e.i(486399),
		m = e.i(743652),
		p = e.i(120599),
		f = e.i(678405),
		g = e.i(981949),
		h = e.i(657367),
		x = e.i(94186),
		b = e.i(527153),
		y = e.i(893603),
		v = e.i(196695),
		j = e.i(746868),
		w = e.i(582018),
		N = e.i(161276),
		S = e.i(890882),
		k = e.i(999323),
		C = e.i(380491),
		F = e.i(435448);
	let P = {
		card: "bg-card border-none rounded-sm px-4 py-3 h-auto w-full text-xs",
		pill: "h-auto w-full rounded-full border-none bg-card py-3 pr-3 pl-4 text-sm data-[size=default]:h-auto"
	};

	function R(e) {
		let t, a, r, i = (0, w.c)(8),
			l = (0, v.useStudioStore)(_);
		if (i[0] !== l || i[1] !== e) {
			a = Symbol.for("react.early_return_sentinel");
			e: {
				let r = (0, u.U)(l);
				if (!r) {
					let e;
					i[4] === Symbol.for("react.memo_cache_sentinel") ? (e = [], i[4] = e) : e = i[4], a = e;
					break e
				}
				if (e && r.pageGroup !== e && (0, F.m)(l, e)) {
					let e;
					i[5] === Symbol.for("react.memo_cache_sentinel") ? (e = [], i[5] = e) : e = i[5], a = e;
					break e
				}
				t = (0, u.H)(r.pageGroup).map(L)
			}
			i[0] = l, i[1] = e, i[2] = t, i[3] = a
		} else t = i[2], a = i[3];
		if (a !== Symbol.for("react.early_return_sentinel")) return a;
		let n = t;
		return i[6] !== n ? (r = n.length <= 1 ? [] : n, i[6] = n, i[7] = r) : r = i[7], r
	}

	function L(e) {
		return {
			key: `${e.name}|${e.surface}`,
			label: e.versionLabel ?? e.name
		}
	}

	function _(e) {
		return e.selectedModelKey
	}

	function T(e) {
		let a, r, i, l, n, s, o, d, c = (0, w.c)(19),
			{
				urlPageGroup: u,
				variant: m
			} = e,
			p = void 0 === m ? "card" : m,
			f = (0, v.useStudioStore)(q),
			g = (0, v.useStudioStore)(E),
			h = R(u);
		if (0 === h.length) return null;
		let x = "pill" === p ? "text-muted-foreground text-xs" : "text-sm font-medium";
		c[0] !== x ? (a = (0, t.jsx)("label", {
			htmlFor: "model-version",
			className: x,
			children: "Model"
		}), c[0] = x, c[1] = a) : a = c[1], c[2] !== g ? (r = e => g(e), c[2] = g, c[3] = r) : r = c[3];
		let b = P[p];
		return c[4] === Symbol.for("react.memo_cache_sentinel") ? (i = (0, t.jsx)(C.U, {}), c[4] = i) : i = c[4], c[5] !== b ? (l = (0, t.jsx)(C.P, {
			id: "model-version",
			className: b,
			children: i
		}), c[5] = b, c[6] = l) : l = c[6], c[7] !== h ? (n = h.map(z), c[7] = h, c[8] = n) : n = c[8], c[9] !== n ? (s = (0, t.jsx)(C.r, {
			children: n
		}), c[9] = n, c[10] = s) : s = c[10], c[11] !== f || c[12] !== r || c[13] !== l || c[14] !== s ? (o = (0, t.jsxs)(C.d, {
			value: f,
			onValueChange: r,
			children: [l, s]
		}), c[11] = f, c[12] = r, c[13] = l, c[14] = s, c[15] = o) : o = c[15], c[16] !== o || c[17] !== a ? (d = (0, t.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [a, o]
		}), c[16] = o, c[17] = a, c[18] = d) : d = c[18], d
	}

	function z(e) {
		let {
			key: a,
			label: r
		} = e;
		return (0, t.jsx)(C.T, {
			value: a,
			children: r
		}, a)
	}

	function E(e) {
		return e.setSelectedModelKey
	}

	function q(e) {
		return e.selectedModelKey
	}
	e.s(["G", 0, T, "P", 0, R], 567022);
	let O = {
		isDisabled: !1
	};

	function U(e, t, a) {
		let r = e.mutuallyExclusiveFields?.[a];
		if (!r) return O;
		let i = t[r.excludes];
		return null != i && ("string" != typeof i || i.trim().length > 0) ? {
			isDisabled: !0,
			reason: r.reason
		} : O
	}
	var D = e.i(932767);

	function M(e) {
		let a, r, i = (0, w.c)(11),
			{
				parameter: l,
				value: n,
				onChange: s,
				error: o
			} = e;
		i[0] !== s ? (a = e => {
			let t = e.target.value;
			if ("" === t) return void s("");
			let a = parseFloat(t);
			Number.isNaN(a) || s(a)
		}, i[0] = s, i[1] = a) : a = i[1];
		let d = a,
			c = n ?? "",
			u = !!o,
			m = o ? `${l.name}-error` : void 0;
		return i[2] !== d || i[3] !== l.max || i[4] !== l.min || i[5] !== l.name || i[6] !== l.placeholder || i[7] !== c || i[8] !== u || i[9] !== m ? (r = (0, t.jsx)(D.f, {
			id: l.name,
			type: "number",
			placeholder: l.placeholder,
			value: c,
			onChange: d,
			min: l.min,
			max: l.max,
			"aria-invalid": u,
			"aria-describedby": m
		}), i[2] = d, i[3] = l.max, i[4] = l.min, i[5] = l.name, i[6] = l.placeholder, i[7] = c, i[8] = u, i[9] = m, i[10] = r) : r = i[10], r
	}
	e.s(["f", 0, M], 835755);
	var I = e.i(329474),
		G = e.i(332409),
		V = e.i(253662),
		$ = e.i(727677),
		W = e.i(976311),
		A = e.i(99756),
		B = e.i(818036),
		H = e.i(584381);
	async function K(e, {
		maxBytes: t,
		maxEdge: a
	}) {
		if (e.size <= t) return e;
		let r = await createImageBitmap(e);
		try {
			let t = Math.min(1, a / Math.max(r.width, r.height)),
				i = document.createElement("canvas");
			i.width = Math.round(r.width * t), i.height = Math.round(r.height * t);
			let l = i.getContext("2d");
			if (!l) throw Error("Failed to downscale image");
			l.fillStyle = "white", l.fillRect(0, 0, i.width, i.height), l.drawImage(r, 0, 0, i.width, i.height);
			let n = await new Promise(e => i.toBlob(e, "image/jpeg", .85));
			if (!n) throw Error("Failed to downscale image");
			return new File([n], `${e.name.replace(/\.[^.]*$/,"")}.jpg`, {
				type: "image/jpeg"
			})
		} finally {
			r.close()
		}
	}
	var Q = e.i(914374);

	function J() {
		return "true" === Q.default.env.NEXT_PUBLIC_PROMPT_SUGGESTIONS_ENABLED
	}
	var Z = e.i(871101),
		Y = e.i(294281),
		X = e.i(426682),
		ee = e.i(256827),
		et = e.i(538882);
	let ea = {
		maxBytes: 2097152,
		maxEdge: 1536
	};
	Z.z.object({
		image: Y.z.instanceof(File, {
			message: "Image file must be provided"
		}).refine(e => e.size <= y.D, `Image must be less than ${y.D/1024/1024}MB`).refine(e => y.u.includes(e.type), "Only JPEG, PNG, and WebP allowed"),
		referenceImage: Y.z.instanceof(File).refine(e => e.size <= y.D, `Reference image must be less than ${y.D/1024/1024}MB`).refine(e => y.u.includes(e.type), "Only JPEG, PNG, and WebP allowed").optional(),
		pageGroup: X.z.enum(["lucy-image-edit", "lucy-edit-2"], {
			message: "pageGroup must be lucy-image-edit or lucy-edit-2"
		})
	}), Z.z.object({
		suggestions: ee.z.array(et.z.string()).min(1).max(2)
	});
	let er = new Set(["lucy-image-edit", "lucy-edit-2"]);
	async function ei(e) {
		return new Promise((t, a) => {
			let r = document.createElement("video"),
				i = document.createElement("canvas"),
				l = i.getContext("2d"),
				n = () => {
					URL.revokeObjectURL(r.src), r.removeEventListener("loadeddata", o), r.removeEventListener("seeked", s), r.removeEventListener("error", d)
				},
				s = () => {
					i.width = r.videoWidth, i.height = r.videoHeight, l?.drawImage(r, 0, 0, i.width, i.height), i.toBlob(e => {
						n(), e ? t(new File([e], "frame.jpg", {
							type: "image/jpeg"
						})) : a(Error("Failed to extract frame"))
					}, "image/jpeg", .85)
				},
				o = () => {
					r.currentTime = 0
				},
				d = () => {
					n(), a(Error("Failed to load video"))
				};
			r.addEventListener("loadeddata", o), r.addEventListener("seeked", s), r.addEventListener("error", d), r.muted = !0, r.playsInline = !0, r.preload = "metadata", r.src = URL.createObjectURL(e), r.load()
		})
	}
	async function el(e, t, a) {
		let r = new FormData;
		r.append("pageGroup", t);
		let i = e.type.startsWith("video/") ? await ei(e) : e;
		r.append("image", await K(i, ea)), a && r.append("referenceImage", await K(a, ea));
		let l = await fetch("/api/prompt-suggestions", {
			method: "POST",
			body: r
		});
		if (!l.ok) throw Error((await l.json()).error || "Failed to fetch suggestions");
		return l.json()
	}

	function en(e) {
		return `${e.name}-${e.size}`
	}

	function es(e) {
		let a, r, l, n, s, o, d, c, u, m, p, f, g = (0, w.c)(33),
			{
				mediaFile: h,
				pageGroup: x,
				onSuggestionClick: b,
				referenceImage: y,
				disabled: j
			} = e,
			[N, S] = (0, i.useState)(!0),
			k = (0, v.useStudioStore)(ed);
		g[0] === Symbol.for("react.memo_cache_sentinel") ? (a = J(), g[0] = a) : a = g[0];
		let C = a,
			F = C && !j && !k;
		g[1] !== h || g[2] !== x || g[3] !== y || g[4] !== F ? (r = {
			mediaFile: h,
			pageGroup: x,
			referenceImage: y,
			enabled: F
		}, g[1] = h, g[2] = x, g[3] = y, g[4] = F, g[5] = r) : r = g[5];
		let {
			suggestions: P,
			isLoading: R,
			isFetching: L,
			error: _,
			refetch: T
		} = function(e) {
			let t, a, r, l, n, s, o, d, c, u, m, p = (0, w.c)(32),
				{
					mediaFile: f,
					pageGroup: g,
					referenceImage: h,
					enabled: x
				} = e,
				[b, y] = (0, i.useState)(!1);
			p[0] !== g ? (t = er.has(g), p[0] = g, p[1] = t) : t = p[1];
			let v = t;
			p[2] !== f ? (a = en(f), p[2] = f, p[3] = a) : a = p[3];
			let j = a;
			p[4] !== h ? (r = h ? en(h) : null, p[4] = h, p[5] = r) : r = p[5];
			let N = r;
			p[6] === Symbol.for("react.memo_cache_sentinel") ? (l = J(), p[6] = l) : l = p[6];
			let S = l;
			p[7] !== j || p[8] !== g || p[9] !== N ? (n = ["prompt-suggestions", j, g, N], p[7] = j, p[8] = g, p[9] = N, p[10] = n) : n = p[10], p[11] !== f || p[12] !== g || p[13] !== h || p[14] !== v ? (s = () => v ? el(f, g, h) : Promise.resolve({
				suggestions: []
			}), p[11] = f, p[12] = g, p[13] = h, p[14] = v, p[15] = s) : s = p[15];
			let k = S && (void 0 === x || x) && !b && v;
			p[16] !== n || p[17] !== s || p[18] !== k ? (o = {
				queryKey: n,
				queryFn: s,
				enabled: k,
				staleTime: 3e5,
				gcTime: 6e5,
				retry: 1
			}, p[16] = n, p[17] = s, p[18] = k, p[19] = o) : o = p[19];
			let C = (0, H.f)(o);
			p[20] !== C ? (d = () => {
				y(!1), C.refetch()
			}, p[20] = C, p[21] = d) : d = p[21];
			let F = d;
			p[22] === Symbol.for("react.memo_cache_sentinel") ? (c = () => {
				y(!0)
			}, p[22] = c) : c = p[22];
			let P = c;
			p[23] !== C.data?.suggestions ? (u = C.data?.suggestions ?? [], p[23] = C.data?.suggestions, p[24] = u) : u = p[24];
			let R = C.error?.message ?? null;
			return p[25] !== b || p[26] !== C.isFetching || p[27] !== C.isLoading || p[28] !== F || p[29] !== u || p[30] !== R ? (m = {
				suggestions: u,
				isLoading: C.isLoading,
				isFetching: C.isFetching,
				error: R,
				refetch: F,
				hide: P,
				isHidden: b
			}, p[25] = b, p[26] = C.isFetching, p[27] = C.isLoading, p[28] = F, p[29] = u, p[30] = R, p[31] = m) : m = p[31], m
		}(r);
		if (!C || _ && !R || !R && 0 === P.length) return null;
		g[6] === Symbol.for("react.memo_cache_sentinel") ? (l = (0, t.jsx)("span", {
			className: "text-sm text-muted-foreground",
			children: "Prompt ideas"
		}), g[6] = l) : l = g[6], g[7] !== T ? (n = () => T(), g[7] = T, g[8] = n) : n = g[8];
		let z = L && "animate-spin";
		return g[9] !== z ? (s = (0, B.c)("size-3.5", z), g[9] = z, g[10] = s) : s = g[10], g[11] !== s ? (o = (0, t.jsx)(V.f, {
			className: s
		}), g[11] = s, g[12] = o) : o = g[12], g[13] !== L || g[14] !== n || g[15] !== o ? (d = (0, t.jsx)("button", {
			type: "button",
			onClick: n,
			disabled: L,
			className: "text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50",
			title: "Refresh suggestions",
			children: o
		}), g[13] = L, g[14] = n, g[15] = o, g[16] = d) : d = g[16], g[17] !== N ? (c = (0, t.jsx)(W.v, {
			className: "flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors",
			children: N ? (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(G.f, {
					className: "size-4"
				}), "Hide"]
			}) : (0, t.jsxs)(t.Fragment, {
				children: [(0, t.jsx)(I.f, {
					className: "size-4"
				}), "Show"]
			})
		}), g[17] = N, g[18] = c) : c = g[18], g[19] !== c || g[20] !== d ? (u = (0, t.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [l, (0, t.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [d, c]
			})]
		}), g[19] = c, g[20] = d, g[21] = u) : u = g[21], g[22] !== L || g[23] !== R || g[24] !== b || g[25] !== P ? (m = R || L ? ["w-40", "w-52"].map(eo) : P.map(e => (0, t.jsx)($.f, {
			variant: "outline",
			className: "w-fit max-w-full cursor-pointer hover:bg-accent px-4 py-2.5 text-sm text-muted-foreground border-muted rounded-full",
			onClick: () => b(e),
			title: e,
			children: (0, t.jsx)("span", {
				className: "truncate",
				children: e
			})
		}, e)), g[22] = L, g[23] = R, g[24] = b, g[25] = P, g[26] = m) : m = g[26], g[27] !== m ? (p = (0, t.jsx)(W.C, {
			className: "overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
			children: (0, t.jsx)("div", {
				className: "flex flex-col gap-2 mt-3",
				children: m
			})
		}), g[27] = m, g[28] = p) : p = g[28], g[29] !== N || g[30] !== u || g[31] !== p ? (f = (0, t.jsxs)(W.Y, {
			open: N,
			onOpenChange: S,
			children: [u, p]
		}), g[29] = N, g[30] = u, g[31] = p, g[32] = f) : f = g[32], f
	}

	function eo(e) {
		return (0, t.jsx)(A.f, {
			className: `h-7 ${e} rounded-full`
		}, e)
	}

	function ed(e) {
		return e.isGenerating
	}

	function ec(e) {
		let a, r, i, l, n, s, o = (0, w.c)(19),
			{
				parameter: d,
				value: c,
				onChange: u,
				error: m,
				variant: p
			} = e;
		o[0] !== d.options ? (a = d.options || [], o[0] = d.options, o[1] = a) : a = o[1];
		let f = a,
			g = c || d.defaultValue,
			h = !!m,
			x = m ? `${d.name}-error` : void 0,
			b = P[void 0 === p ? "card" : p],
			y = d.placeholder || "Select an option";
		return o[2] !== y ? (r = (0, t.jsx)(C.U, {
			placeholder: y
		}), o[2] = y, o[3] = r) : r = o[3], o[4] !== d.name || o[5] !== h || o[6] !== x || o[7] !== b || o[8] !== r ? (i = (0, t.jsx)(C.P, {
			id: d.name,
			"aria-invalid": h,
			"aria-describedby": x,
			className: b,
			children: r
		}), o[4] = d.name, o[5] = h, o[6] = x, o[7] = b, o[8] = r, o[9] = i) : i = o[9], o[10] !== f ? (l = f.map(eu), o[10] = f, o[11] = l) : l = o[11], o[12] !== l ? (n = (0, t.jsx)(C.r, {
			children: l
		}), o[12] = l, o[13] = n) : n = o[13], o[14] !== g || o[15] !== u || o[16] !== n || o[17] !== i ? (s = (0, t.jsxs)(C.d, {
			value: g,
			onValueChange: u,
			children: [i, n]
		}), o[14] = g, o[15] = u, o[16] = n, o[17] = i, o[18] = s) : s = o[18], s
	}

	function eu(e) {
		return (0, t.jsx)(C.T, {
			value: e,
			children: e
		}, e)
	}
	e.s(["f", 0, ec], 278566);
	var em = e.i(149218);

	function ep(e) {
		let a, r, i, l = (0, w.c)(17),
			{
				parameter: n,
				value: s,
				onChange: o,
				error: d,
				maxLength: c,
				disabled: u
			} = e,
			m = "textarea" === n.type,
			p = s || "";
		l[0] !== o ? (a = e => o(e.target.value), l[0] = o, l[1] = a) : a = l[1];
		let f = !!d,
			g = d ? `${n.name}-error` : void 0;
		l[2] !== u || l[3] !== n.name || l[4] !== n.placeholder || l[5] !== p || l[6] !== a || l[7] !== f || l[8] !== g ? (r = {
			id: n.name,
			placeholder: n.placeholder,
			value: p,
			onChange: a,
			disabled: u,
			"aria-invalid": f,
			"aria-describedby": g
		}, l[2] = u, l[3] = n.name, l[4] = n.placeholder, l[5] = p, l[6] = a, l[7] = f, l[8] = g, l[9] = r) : r = l[9];
		let h = r;
		if (m) {
			let e, a = n.rows || 4;
			return l[10] !== h || l[11] !== c || l[12] !== a ? (e = (0, t.jsx)(em.f, {
				...h,
				maxLength: c,
				variant: "prompt",
				rows: a,
				className: "resize-none bg-card rounded-lg pt-4 px-3 pb-0 border-none focus-visible:ring-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-muted"
			}), l[10] = h, l[11] = c, l[12] = a, l[13] = e) : e = l[13], e
		}
		return l[14] !== h || l[15] !== c ? (i = (0, t.jsx)(D.f, {
			...h,
			type: "text",
			maxLength: c
		}), l[14] = h, l[15] = c, l[16] = i) : i = l[16], i
	}
	var ef = e.i(76145);

	function eg(e) {
		let a, r = (0, w.c)(6),
			{
				parameter: i,
				value: l,
				onChange: n,
				error: s
			} = e,
			o = l ?? i.defaultValue,
			d = !!s,
			c = s ? `${i.name}-error` : void 0;
		return r[0] !== o || r[1] !== n || r[2] !== i.name || r[3] !== d || r[4] !== c ? (a = (0, t.jsx)(ef.f, {
			id: i.name,
			checked: o,
			onCheckedChange: n,
			"aria-invalid": d,
			"aria-describedby": c
		}), r[0] = o, r[1] = n, r[2] = i.name, r[3] = d, r[4] = c, r[5] = a) : a = r[5], a
	}

	function eh(e) {
		let a, r, l, n, o, d, c = (0, w.c)(49),
			{
				modelData: u,
				formValues: m,
				formErrors: p,
				onChange: g,
				disabled: h,
				creditCost: x,
				pageGroup: b,
				urlPageGroup: y
			} = e;
		c[0] !== p ? (a = void 0 === p ? {} : p, c[0] = p, c[1] = a) : a = c[1];
		let v = a,
			j = void 0 !== h && h,
			{
				parameters: C,
				formConfig: F
			} = u;
		if (c[2] !== x || c[3] !== j || c[4] !== F || c[5] !== v || c[6] !== m || c[7] !== u.parameters.output || c[8] !== g || c[9] !== b || c[10] !== C.apiParameters || c[11] !== C.quality || c[12] !== y) {
			let e, a, d, p, h, w, P = new Map;
			for (let e of C.apiParameters) P.set(e.name, e);
			c[17] !== F || c[18] !== m ? (e = e => U(F, m, e), c[17] = F, c[18] = m, c[19] = e) : e = c[19];
			let R = e;
			c[20] !== j || c[21] !== R || c[22] !== v || c[23] !== m || c[24] !== g || c[25] !== C || c[26] !== y ? (a = (e, a) => {
				let r, i = m[e.name],
					l = v[e.name],
					n = t => {
						g(e.name, t)
					},
					o = R(e.name),
					d = j || o.isDisabled;
				switch (e.type) {
					case "string":
					case "textarea":
						r = (0, t.jsx)(ep, {
							parameter: e,
							value: i,
							onChange: n,
							error: l,
							maxLength: e.maxLength,
							disabled: d
						});
						break;
					case "select":
						r = (0, t.jsx)(ec, {
							parameter: e,
							value: i,
							onChange: n,
							error: l
						});
						break;
					case "number":
					case "integer":
						r = (0, t.jsx)(M, {
							parameter: e,
							value: i,
							onChange: n,
							error: l
						});
						break;
					case "toggle":
					case "boolean":
						r = (0, t.jsx)(eg, {
							parameter: e,
							value: i,
							onChange: n,
							error: l
						});
						break;
					case "file":
						r = (0, t.jsx)(N.f, {
							parameter: e,
							value: i,
							onChange: n,
							disabled: d
						});
						break;
					case "model-version":
						if (C.quality.length <= 1) return null;
						return (0, t.jsx)(T, {
							urlPageGroup: y
						}, e.name);
					default:
						return console.warn(`Unsupported field type: ${e.type}`), null
				}
				let c = (0, t.jsx)(S.f, {
					parameter: e,
					error: l,
					isStandalone: void 0 !== a && a,
					children: r
				}, e.name);
				return o.isDisabled ? (0, t.jsxs)(s.W, {
					children: [(0, t.jsx)(s.y, {
						asChild: !0,
						children: (0, t.jsx)("div", {
							className: "cursor-not-allowed",
							children: c
						})
					}), (0, t.jsx)(s.Y, {
						className: "bg-popover text-card-foreground",
						children: o.reason
					})]
				}, e.name) : c
			}, c[20] = j, c[21] = R, c[22] = v, c[23] = m, c[24] = g, c[25] = C, c[26] = y, c[27] = a) : a = c[27];
			let L = a,
				_ = "video" === u.parameters.output ? "Cost per 1 second:" : "Cost per generation:";
			c[28] === Symbol.for("react.memo_cache_sentinel") ? (d = (0, t.jsx)(f.f, {
				className: "size-3.5 text-accent"
			}), c[28] = d) : d = c[28], c[29] !== x ? (p = (0, t.jsxs)("span", {
				className: "text-primary",
				children: [x, " credits"]
			}), c[29] = x, c[30] = p) : p = c[30], c[31] !== _ || c[32] !== p ? (h = (0, t.jsxs)("span", {
				className: "flex items-center gap-1.5 text-xs text-muted-foreground",
				children: [_, " ", d, p]
			}), c[31] = _, c[32] = p, c[33] = h) : h = c[33];
			let z = h,
				E = F.standaloneFields ? F.standaloneFields.map(e => {
					let t = P.get(e);
					return t ? {
						name: e,
						param: t
					} : null
				}).filter(ey).map(e => ({
					name: e.name,
					element: L(e.param, !0)
				})) : [],
				q = "lucy-image-edit" === b || "lucy-edit-2" === b,
				O = m.data,
				D = m.reference_image;
			r = "flex flex-col gap-6", c[34] !== j || c[35] !== q || c[36] !== O || c[37] !== g || c[38] !== b || c[39] !== D ? (w = (e, a) => (0, t.jsxs)(i.Fragment, {
				children: [e.element, 0 === a && q && b && O && (0, t.jsx)(es, {
					mediaFile: O,
					pageGroup: b,
					onSuggestionClick: e => g("prompt", e),
					referenceImage: D,
					disabled: j
				})]
			}, e.name), c[34] = j, c[35] = q, c[36] = O, c[37] = g, c[38] = b, c[39] = D, c[40] = w) : w = c[40], l = E.map(w), c[41] !== z || c[42] !== F.sections.length ? (n = 0 === F.sections.length && (0, t.jsx)("div", {
				className: "flex justify-end",
				children: z
			}), c[41] = z, c[42] = F.sections.length, c[43] = n) : n = c[43], o = F.sections.map((e, a) => {
				let r = e.fields.map(e => P.get(e)).filter(eb);
				if (0 === r.length) return null;
				let i = r.some(ex),
					l = e.title.toLowerCase().includes("generation") && x ? z : void 0,
					n = 0 === a && !F.standaloneFields;
				return (0, t.jsx)(k.f, {
					section: e,
					headerContent: l,
					hasRequiredFields: i,
					isFirst: n,
					children: r.map(e => L(e))
				}, e.title)
			}), c[2] = x, c[3] = j, c[4] = F, c[5] = v, c[6] = m, c[7] = u.parameters.output, c[8] = g, c[9] = b, c[10] = C.apiParameters, c[11] = C.quality, c[12] = y, c[13] = r, c[14] = l, c[15] = n, c[16] = o
		} else r = c[13], l = c[14], n = c[15], o = c[16];
		return c[44] !== r || c[45] !== l || c[46] !== n || c[47] !== o ? (d = (0, t.jsxs)("div", {
			className: r,
			children: [l, n, o]
		}), c[44] = r, c[45] = l, c[46] = n, c[47] = o, c[48] = d) : d = c[48], d
	}

	function ex(e) {
		return e.required
	}

	function eb(e) {
		return void 0 !== e
	}

	function ey(e) {
		return null !== e
	}
	e.s(["f", 0, eg], 553775), e.s(["f", 0, function({
		pageGroup: e,
		urlPageGroup: w,
		defaultPrompt: N,
		defaultInputMedia: S,
		defaultReferenceImage: k,
		children: C
	}) {
		let {
			mutate: F,
			isPending: P
		} = (0, g._)(), {
			selectedResolution: R,
			creditCost: L
		} = (0, h.f)(), _ = (0, v.useStudioStore)(e => e.setUploadedMediaFile), T = (0, v.useStudioStore)(e => e.setSelectedResolution), z = (0, v.useStudioStore)(e => e.setStudioOutput), E = (0, v.useStudioStore)(e => e.setIsGenerating), q = (0, v.useStudioStore)(e => e.setShowExampleOutput), {
			refetchUser: O
		} = (0, d.f)(), D = (0, i.useCallback)(e => {
			z({
				modelOutputType: "video",
				modelOutput: e
			}), E(!1), O()
		}, [z, E, O]), M = (0, i.useCallback)(e => {
			l.c.error(e), E(!1)
		}, [E]), {
			isPolling: I,
			status: G
		} = (0, x.f)({
			onComplete: D,
			onError: M
		}), {
			isLoading: V,
			isAuthenticated: $,
			checkAuth: W
		} = (0, d.f)(), A = (0, c.f)(e);
		if (!A) throw Error(`No model data for page group: ${e}`);
		let B = (0, i.useMemo)(() => {
				let e = {};
				for (let t of A.parameters.apiParameters) "prompt" === t.name && N ? e[t.name] = N : void 0 !== t.defaultValue ? e[t.name] = t.defaultValue : "file" === t.type ? e[t.name] = null : "toggle" === t.type || "boolean" === t.type ? e[t.name] = !1 : e[t.name] = "";
				return e
			}, [A, N]),
			[H, K] = (0, i.useState)(B),
			[Q, J] = (0, i.useState)({}),
			[Z, Y] = (0, i.useState)(0),
			[X, ee] = (0, i.useState)(!!S),
			[et, ea] = (0, i.useState)(!!k),
			[er, ei] = (0, i.useState)(null),
			[el, en] = (0, i.useState)(!1),
			es = (0, i.useRef)(null),
			eo = (0, i.useRef)(!1),
			ed = (0, i.useRef)(!1),
			ec = A.formConfig.mutuallyExclusiveFields?.prompt?.excludes === "reference_image",
			eu = (0, i.useCallback)(async (e, t, a, r) => {
				try {
					let a = await (0, b.f)(e);
					if ("reference_image" === t && ed.current) return;
					K(e => ({
						...e,
						[t]: a
					})), r?.(a)
				} catch (e) {
					console.error(`Error loading ${t}:`, e)
				} finally {
					a(!1)
				}
			}, []);
		(0, i.useEffect)(() => {
			S && eu(S, "data", ee, e => {
				e.type.startsWith("image/") && _(e)
			}), k && eu(k, "reference_image", ea)
		}, [S, k, eu, _]);
		let em = !V && $(),
			ep = (0, o.f)(),
			ef = "video" === A.parameters.output ? 5 * (L || 0) : L || 0,
			eg = ep >= ef,
			ex = (0, i.useMemo)(() => {
				if (!em) return !0;
				for (let e of A.parameters.apiParameters)
					if (e.required) {
						let t = H[e.name];
						if (null == t || "" === t) return !0
					} return !eg || P || I
			}, [H, A.parameters.apiParameters, P, I, eg, em]),
			eb = (e, t) => {
				q(!1), K(a => ({
					...a,
					[e]: t
				})), "data" === e && (t instanceof File && t.type.startsWith("image/") ? _(t) : null === t && _(null)), "resolution" === e && "string" == typeof t && T(t), Q[e] && J(t => {
					let a = {
						...t
					};
					return delete a[e], a
				})
			},
			ey = (e, t) => {
				"reference_image" === e && (eo.current = t instanceof File), er && ("prompt" === e && (0, p.r)(er) || "reference_image" === e && er.image) && ei(null), eb(e, t)
			},
			ev = async e => {
				let t, a;
				es.current = e.id, ed.current = !0, ei(e);
				let r = (0, p.r)(e) ? e.prompt : null,
					i = e.image;
				if (r && i) t = r, ec ? (a = "clear", l.c.info(`Applied the prompt from "${e.label}". This model takes a prompt or a reference image, not both.`)) : a = "fetch";
				else if (r) {
					t = r;
					let e = null != H.reference_image && !eo.current;
					a = ec || e ? "clear" : void 0
				} else i && (a = "fetch", t = ec ? "" : void 0);
				en("fetch" === a), "clear" === a && (eo.current = !1, eb("reference_image", null));
				let n = ec && "fetch" === a;
				if (void 0 === t || n || eb("prompt", t), "fetch" === a && i) try {
					let a = await (0, b.f)(i, AbortSignal.timeout(2e4));
					if (es.current !== e.id) return;
					if (!y.u.includes(a.type)) {
						l.c.error(`"${e.label}" has an image format this model can't take (JPEG, PNG or WebP only).`), ei(null);
						return
					}
					n && void 0 !== t && eb("prompt", t), eo.current = !1, eb("reference_image", a)
				} catch {
					if (es.current !== e.id) return;
					l.c.error(`Couldn't load the reference image for "${e.label}".`), ei(null)
				} finally {
					es.current === e.id && en(!1)
				}
			};
		(0, m.f)((0, u.R)(e), e => void ev(e));
		let ej = () => {
				if (!em) return void W();
				let e = (0, j.f)(H, A);
				if (!e.success) {
					J(e.errors);
					let t = Object.values(e.errors)[0];
					t && l.c.error(`Validation error - ${t}`);
					return
				}
				return J({}), F({
					input: {
						...e.data,
						resolution: R
					},
					cost: ef || 1 / 0
				})
			},
			ew = () => {
				let e = {};
				for (let t of A.parameters.apiParameters) "file" === t.type ? e[t.name] = null : "toggle" === t.type || "boolean" === t.type ? e[t.name] = !1 : void 0 !== t.defaultValue ? e[t.name] = t.defaultValue : e[t.name] = "";
				K(e), _(null), q(!1), Y(e => e + 1), es.current = null, eo.current = !1, ei(null), en(!1)
			},
			eN = P || !em || X || et || el,
			eS = V ? (0, t.jsx)("div", {
				className: "flex items-center justify-center py-8",
				children: (0, t.jsx)(a.f, {
					className: "size-6 animate-spin text-muted-foreground"
				})
			}) : (0, t.jsx)(eh, {
				modelData: A,
				formValues: H,
				formErrors: Q,
				onChange: ey,
				disabled: eN,
				creditCost: L,
				pageGroup: e,
				urlPageGroup: w
			}, Z),
			ek = (0, t.jsxs)("div", {
				className: "flex justify-between gap-3",
				children: [(0, t.jsx)(n.f, {
					variant: "tertiary",
					size: "compact",
					className: "w-24",
					onClick: ew,
					children: "Reset"
				}), (0, t.jsxs)(s.W, {
					children: [(0, t.jsx)(s.y, {
						asChild: !0,
						children: (0, t.jsx)("div", {
							children: (0, t.jsx)(n.f, {
								variant: "default",
								size: "compact",
								className: "w-48",
								disabled: ex && em,
								onClick: ej,
								children: P ? (0, t.jsxs)(t.Fragment, {
									children: [(0, t.jsx)(a.f, {
										className: "text-sm animate-spin"
									}), "Submitting..."]
								}) : I ? (0, t.jsxs)(t.Fragment, {
									children: [(0, t.jsx)(a.f, {
										className: "text-sm animate-spin"
									}), "pending" === G ? "In Queue..." : "processing" === G ? "Processing..." : "Loading..."]
								}) : em ? (0, t.jsxs)(t.Fragment, {
									children: [(0, t.jsx)(f.f, {
										className: "size-4"
									}), "Generate"]
								}) : (0, t.jsxs)(t.Fragment, {
									children: [(0, t.jsx)(r.f, {
										className: "size-4"
									}), "Sign in to run"]
								})
							})
						})
					}), !eg && (0, t.jsxs)(s.Y, {
						side: "top",
						children: ["Insufficient credits. Need ", ef, " credits, but you have ", ep, "."]
					})]
				})]
			});
		return C ? (0, t.jsx)(t.Fragment, {
			children: C({
				fields: eS,
				actions: ek,
				applyPreset: e => {
					ev(e)
				},
				selectedPresetId: er?.id ?? null,
				isApplyingPreset: el,
				presetDraft: {
					prompt: "string" == typeof H.prompt ? H.prompt : "",
					imageFile: H.reference_image instanceof File ? H.reference_image : null
				},
				form: {
					modelData: A,
					values: H,
					errors: Q,
					onChange: ey,
					disabled: V || eN,
					exclusionFor: e => U(A.formConfig, H, e),
					resetKey: Z
				},
				generate: {
					run: ej,
					reset: ew,
					disabled: ex,
					isSubmitting: P,
					isPolling: I,
					queueStatus: G,
					isAuthenticated: em,
					hasSufficientCredits: eg,
					totalCost: ef,
					userCredits: ep
				}
			})
		}) : (0, t.jsx)("div", {
			className: "flex flex-col border border-border rounded-lg p-6",
			children: (0, t.jsxs)("div", {
				className: "flex flex-col gap-6",
				children: [eS, !V && ek]
			})
		})
	}], 205643);
	var ev = e.i(954033),
		ej = e.i(880582),
		ew = e.i(55e3);
	let eN = {
		name: "video",
		size: 24,
		node: [
			["path", {
				d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
				key: "ftymec"
			}],
			["rect", {
				x: "2",
				y: "6",
				width: "14",
				height: "12",
				rx: "2",
				key: "158x01"
			}]
		]
	};
	eN.node;
	let eS = (0, ew.f)(eN);
	var ek = e.i(189478);

	function eC(e) {
		return e.queueStatus
	}

	function eF(e) {
		return e.jobStartTime
	}

	function eP(e) {
		return e.uploadedVideoDuration
	}
	let eR = {
		name: "clipboard-check",
		size: 24,
		node: [
			["rect", {
				width: "8",
				height: "4",
				x: "8",
				y: "2",
				rx: "1",
				ry: "1",
				key: "tgr4d6"
			}],
			["path", {
				d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
				key: "116196"
			}],
			["path", {
				d: "m9 14 2 2 4-4",
				key: "df797q"
			}]
		]
	};
	eR.node;
	let eL = (0, ew.f)(eR);
	var e_ = e.i(120384),
		eT = e.i(232250),
		ez = e.i(351570),
		eE = e.i(619525);
	async function eq(e) {
		let t = await fetch("/api/admin/evaluations", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(e)
		});
		if (!t.ok) throw Error((await t.json()).error || "Failed to submit evaluation");
		return t.json()
	}
	async function eO(e) {
		let t = await fetch(`/api/admin/evaluations?requestId=${encodeURIComponent(e)}`);
		if (!t.ok) throw Error((await t.json()).error || "Failed to fetch evaluation");
		return t.json()
	}
	let eU = [{
		value: "1",
		label: "1 - Poor"
	}, {
		value: "2",
		label: "2 - Fair"
	}, {
		value: "3",
		label: "3 - Good"
	}, {
		value: "4",
		label: "4 - Excellent"
	}];

	function eD(e) {
		let a, r, s, o, d, c, u, m, p, f, g, h, x, b, y, v, j, N, S, k, F, P = (0, w.c)(43),
			{
				requestId: R,
				existingEvaluation: L
			} = e;
		P[0] !== L ? (a = {
			existingEvaluation: L
		}, P[0] = L, P[1] = a) : a = P[1];
		let {
			qualityRating: _,
			setQualityRating: T,
			promptFollowingRating: z,
			setPromptFollowingRating: E,
			comments: q,
			setComments: O,
			hasChanges: U,
			isFormValid: D
		} = function(e) {
			let t, a, r, l, n, s, o = (0, w.c)(18),
				{
					existingEvaluation: d
				} = e;
			o[0] !== d?.qualityRating ? (t = d?.qualityRating.toString() ?? "", o[0] = d?.qualityRating, o[1] = t) : t = o[1];
			let [c, u] = (0, i.useState)(t);
			o[2] !== d?.promptFollowingRating ? (a = d?.promptFollowingRating.toString() ?? "", o[2] = d?.promptFollowingRating, o[3] = a) : a = o[3];
			let [m, p] = (0, i.useState)(a), [f, g] = (0, i.useState)(d?.comments ?? "");
			o[4] !== d ? (r = () => {
				d && (u(d.qualityRating.toString()), p(d.promptFollowingRating.toString()), g(d.comments ?? ""))
			}, l = [d], o[4] = d, o[5] = r, o[6] = l) : (r = o[5], l = o[6]), (0, i.useEffect)(r, l), o[7] !== f || o[8] !== d || o[9] !== m || o[10] !== c ? (n = !d || c !== d.qualityRating.toString() || m !== d.promptFollowingRating.toString() || f.trim() !== (d.comments ?? ""), o[7] = f, o[8] = d, o[9] = m, o[10] = c, o[11] = n) : n = o[11];
			let h = n,
				x = !!(c && m);
			return o[12] !== f || o[13] !== h || o[14] !== x || o[15] !== m || o[16] !== c ? (s = {
				qualityRating: c,
				setQualityRating: u,
				promptFollowingRating: m,
				setPromptFollowingRating: p,
				comments: f,
				setComments: g,
				hasChanges: h,
				isFormValid: x
			}, o[12] = f, o[13] = h, o[14] = x, o[15] = m, o[16] = c, o[17] = s) : s = o[17], s
		}(a), {
			mutate: M,
			isPending: I
		} = (k = (0, w.c)(2), F = (0, eE.d)(), k[0] !== F ? (S = {
			mutationFn: eq,
			onSuccess: e => {
				F.setQueryData(["admin", "evaluation", e.evaluation.requestId], {
					evaluation: e.evaluation
				})
			}
		}, k[0] = F, k[1] = S) : S = k[1], (0, ez.f)(S));
		P[2] !== q || P[3] !== L || P[4] !== z || P[5] !== _ || P[6] !== R || P[7] !== M ? (r = e => {
			e.preventDefault();
			let t = Number.parseInt(_, 10),
				a = Number.parseInt(z, 10);
			Number.isNaN(t) || t < 1 || t > 4 ? l.c.error("Please select a quality rating") : Number.isNaN(a) || a < 1 || a > 4 ? l.c.error("Please select a prompt following rating") : M({
				requestId: R,
				qualityRating: t,
				promptFollowingRating: a,
				comments: q.trim() || null
			}, {
				onSuccess: () => {
					l.c.success(L ? "Evaluation updated" : "Evaluation submitted")
				},
				onError: eG
			})
		}, P[2] = q, P[3] = L, P[4] = z, P[5] = _, P[6] = R, P[7] = M, P[8] = r) : r = P[8];
		let G = r;
		P[9] === Symbol.for("react.memo_cache_sentinel") ? (s = (0, t.jsx)(eT.f, {
			htmlFor: "quality-rating",
			children: "Quality"
		}), P[9] = s) : s = P[9], P[10] === Symbol.for("react.memo_cache_sentinel") ? (o = (0, t.jsx)(C.P, {
			id: "quality-rating",
			className: "w-full",
			children: (0, t.jsx)(C.U, {
				placeholder: "Select rating"
			})
		}), P[10] = o) : o = P[10], P[11] === Symbol.for("react.memo_cache_sentinel") ? (d = (0, t.jsx)(C.r, {
			children: eU.map(eI)
		}), P[11] = d) : d = P[11], P[12] !== _ || P[13] !== T ? (c = (0, t.jsxs)("div", {
			className: "space-y-1.5",
			children: [s, (0, t.jsxs)(C.d, {
				value: _,
				onValueChange: T,
				children: [o, d]
			})]
		}), P[12] = _, P[13] = T, P[14] = c) : c = P[14], P[15] === Symbol.for("react.memo_cache_sentinel") ? (u = (0, t.jsx)(eT.f, {
			htmlFor: "prompt-rating",
			children: "Prompt Following"
		}), P[15] = u) : u = P[15], P[16] === Symbol.for("react.memo_cache_sentinel") ? (m = (0, t.jsx)(C.P, {
			id: "prompt-rating",
			className: "w-full",
			children: (0, t.jsx)(C.U, {
				placeholder: "Select rating"
			})
		}), P[16] = m) : m = P[16], P[17] === Symbol.for("react.memo_cache_sentinel") ? (p = (0, t.jsx)(C.r, {
			children: eU.map(eM)
		}), P[17] = p) : p = P[17], P[18] !== z || P[19] !== E ? (f = (0, t.jsxs)("div", {
			className: "space-y-1.5",
			children: [u, (0, t.jsxs)(C.d, {
				value: z,
				onValueChange: E,
				children: [m, p]
			})]
		}), P[18] = z, P[19] = E, P[20] = f) : f = P[20], P[21] !== f || P[22] !== c ? (g = (0, t.jsxs)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [c, f]
		}), P[21] = f, P[22] = c, P[23] = g) : g = P[23], P[24] === Symbol.for("react.memo_cache_sentinel") ? (h = (0, t.jsx)(eT.f, {
			htmlFor: "comments",
			children: "Comments (optional)"
		}), P[24] = h) : h = P[24], P[25] !== O ? (x = e => O(e.target.value), P[25] = O, P[26] = x) : x = P[26], P[27] !== q || P[28] !== x ? (b = (0, t.jsx)(em.f, {
			id: "comments",
			placeholder: "Add any additional observations...",
			value: q,
			onChange: x,
			maxLength: 500,
			rows: 2,
			className: "resize-none"
		}), P[27] = q, P[28] = x, P[29] = b) : b = P[29];
		let V = 500 - q.length;
		P[30] !== V ? (y = (0, t.jsxs)("p", {
			className: "text-xs text-muted-foreground",
			children: [V, " characters remaining"]
		}), P[30] = V, P[31] = y) : y = P[31], P[32] !== b || P[33] !== y ? (v = (0, t.jsxs)("div", {
			className: "space-y-1.5",
			children: [h, b, y]
		}), P[32] = b, P[33] = y, P[34] = v) : v = P[34];
		let $ = I || !D || !U,
			W = I ? "Saving..." : L ? "Update Evaluation" : "Submit Evaluation";
		return P[35] !== $ || P[36] !== W ? (j = (0, t.jsx)(n.f, {
			type: "submit",
			size: "sm",
			disabled: $,
			className: "w-full",
			children: W
		}), P[35] = $, P[36] = W, P[37] = j) : j = P[37], P[38] !== G || P[39] !== g || P[40] !== v || P[41] !== j ? (N = (0, t.jsxs)("form", {
			onSubmit: G,
			className: "space-y-4",
			children: [g, v, j]
		}), P[38] = G, P[39] = g, P[40] = v, P[41] = j, P[42] = N) : N = P[42], N
	}

	function eM(e) {
		return (0, t.jsx)(C.T, {
			value: e.value,
			children: e.label
		}, e.value)
	}

	function eI(e) {
		return (0, t.jsx)(C.T, {
			value: e.value,
			children: e.label
		}, e.value)
	}

	function eG(e) {
		l.c.error(e.message || "Failed to submit evaluation")
	}
	var eV = e.i(480847);

	function e$() {
		var e;
		let a, r, l, s, o, d, c, u, m, p, f, g, h, x = (0, w.c)(21),
			[b, y] = (0, i.useState)(!1),
			{
				isAdmin: j,
				isLoading: N
			} = (0, eV.f)(),
			S = (0, v.useStudioStore)(eA),
			k = (0, v.useStudioStore)(eW),
			{
				data: C,
				isLoading: F
			} = (e = !N && j, (g = (0, w.c)(7))[0] !== S ? (m = ["admin", "evaluation", S], p = () => {
				if (!S) throw Error("Request ID is required");
				return eO(S)
			}, g[0] = S, g[1] = m, g[2] = p) : (m = g[1], p = g[2]), h = (void 0 === e || e) && !!S, g[3] !== m || g[4] !== p || g[5] !== h ? (f = {
				queryKey: m,
				queryFn: p,
				enabled: h
			}, g[3] = m, g[4] = p, g[5] = h, g[6] = f) : f = g[6], (0, H.f)(f));
		if (N || !j || !S || k) return null;
		let P = !!C?.evaluation;
		return x[0] !== b ? (a = () => y(!b), x[0] = b, x[1] = a) : a = x[1], x[2] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [(0, t.jsx)(eL, {
				className: "size-4"
			}), (0, t.jsx)("span", {
				className: "text-sm font-medium",
				children: "Admin Evaluation"
			})]
		}), x[2] = r) : r = x[2], x[3] !== P ? (l = P && (0, t.jsx)("span", {
			className: "rounded-full bg-green-500/20 px-2 py-0.5 text-xs text-green-500",
			children: "Submitted"
		}), x[3] = P, x[4] = l) : l = x[4], x[5] !== b ? (s = b ? (0, t.jsx)(G.f, {
			className: "size-4"
		}) : (0, t.jsx)(I.f, {
			className: "size-4"
		}), x[5] = b, x[6] = s) : s = x[6], x[7] !== l || x[8] !== s ? (o = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [l, s]
		}), x[7] = l, x[8] = s, x[9] = o) : o = x[9], x[10] !== a || x[11] !== o ? (d = (0, t.jsxs)(n.f, {
			variant: "ghost",
			className: "flex w-full items-center justify-between gap-2 px-3 py-2 h-auto hover:bg-transparent dark:hover:bg-transparent",
			onClick: a,
			children: [r, o]
		}), x[10] = a, x[11] = o, x[12] = d) : d = x[12], x[13] !== C?.evaluation || x[14] !== S || x[15] !== F || x[16] !== b ? (c = b && (0, t.jsx)("div", {
			className: "border-t px-3 pb-3 pt-2",
			children: F ? (0, t.jsx)("div", {
				className: "flex items-center justify-center py-4",
				children: (0, t.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Loading..."
				})
			}) : (0, t.jsx)(eD, {
				requestId: S,
				existingEvaluation: C?.evaluation
			})
		}), x[13] = C?.evaluation, x[14] = S, x[15] = F, x[16] = b, x[17] = c) : c = x[17], x[18] !== d || x[19] !== c ? (u = (0, t.jsxs)(e_.N, {
			className: "absolute bottom-4 left-4 z-10 w-72 overflow-hidden bg-background/95 backdrop-blur-sm",
			children: [d, c]
		}), x[18] = d, x[19] = c, x[20] = u) : u = x[20], u
	}

	function eW(e) {
		return e.isGenerating
	}

	function eA(e) {
		return e.generationId
	}
	let eB = {
		name: "thumbs-down",
		size: 24,
		node: [
			["path", {
				d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z",
				key: "m61m77"
			}],
			["path", {
				d: "M17 14V2",
				key: "8ymqnk"
			}]
		]
	};
	eB.node;
	let eH = (0, ew.f)(eB),
		eK = {
			name: "thumbs-up",
			size: 24,
			node: [
				["path", {
					d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z",
					key: "emmmcr"
				}],
				["path", {
					d: "M7 10v12",
					key: "1qc93n"
				}]
			]
		};
	eK.node;
	let eQ = (0, ew.f)(eK);
	var eJ = e.i(833186);
	async function eZ({
		generationId: e,
		feedback: t
	}) {
		let a = await fetch("/api/generations/feedback", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				generationId: e,
				feedback: t
			})
		});
		if (!a.ok) throw await (0, eJ._)(a, "Failed to submit feedback")
	}

	function eY(e) {
		return e.setFeedback
	}

	function eX(e) {
		return e.feedback
	}

	function e0(e) {
		return e.generationId
	}

	function e1() {
		let e, a, r, s, o, d, c, u, m, p, f, g, h, x, b, y, j, N, S, k, C, F, P = (0, w.c)(25),
			{
				feedback: R,
				handleLike: L,
				handleDislike: _,
				canSubmitFeedback: T,
				isSubmitting: z
			} = (b = (0, w.c)(16), y = (0, v.useStudioStore)(e0), j = (0, v.useStudioStore)(eX), N = (0, v.useStudioStore)(eY), S = (0, i.useRef)(null), b[0] !== N ? (p = {
				mutationFn: eZ,
				onError: e => {
					N(S.current), l.c.error(e instanceof Error ? e.message : "Failed to submit feedback")
				}
			}, b[0] = N, b[1] = p) : p = b[1], k = (0, ez.f)(p), b[2] !== j || b[3] !== y || b[4] !== k || b[5] !== N ? (f = e => {
				if (!y) return;
				let t = j === e ? null : e;
				S.current = j, N(t), k.mutate({
					generationId: y,
					feedback: t
				})
			}, b[2] = j, b[3] = y, b[4] = k, b[5] = N, b[6] = f) : f = b[6], C = f, b[7] !== C ? (g = () => C("like"), h = () => C("dislike"), b[7] = C, b[8] = g, b[9] = h) : (g = b[8], h = b[9]), F = !!y, b[10] !== j || b[11] !== k.isPending || b[12] !== g || b[13] !== h || b[14] !== F ? (x = {
				feedback: j,
				isSubmitting: k.isPending,
				handleLike: g,
				handleDislike: h,
				canSubmitFeedback: F
			}, b[10] = j, b[11] = k.isPending, b[12] = g, b[13] = h, b[14] = F, b[15] = x) : x = b[15], x);
		if (!T) return null;
		let E = "like" === R && "bg-black/60";
		P[0] !== E ? (e = (0, B.c)("size-8 rounded-lg backdrop-blur-sm bg-black/40 hover:bg-black/60", E), P[0] = E, P[1] = e) : e = P[1];
		let q = "like" === R && "fill-white";
		P[2] !== q ? (a = (0, B.c)("size-4 text-white", q), P[2] = q, P[3] = a) : a = P[3], P[4] !== a ? (r = (0, t.jsx)(eQ, {
			className: a
		}), P[4] = a, P[5] = r) : r = P[5], P[6] !== L || P[7] !== z || P[8] !== e || P[9] !== r ? (s = (0, t.jsx)(n.f, {
			variant: "ghost",
			size: "icon",
			className: e,
			onClick: L,
			disabled: z,
			children: r
		}), P[6] = L, P[7] = z, P[8] = e, P[9] = r, P[10] = s) : s = P[10];
		let O = "dislike" === R && "bg-black/60";
		P[11] !== O ? (o = (0, B.c)("size-8 rounded-lg backdrop-blur-sm bg-black/40 hover:bg-black/60", O), P[11] = O, P[12] = o) : o = P[12];
		let U = "dislike" === R && "fill-white";
		return P[13] !== U ? (d = (0, B.c)("size-4 text-white", U), P[13] = U, P[14] = d) : d = P[14], P[15] !== d ? (c = (0, t.jsx)(eH, {
			className: d
		}), P[15] = d, P[16] = c) : c = P[16], P[17] !== _ || P[18] !== z || P[19] !== c || P[20] !== o ? (u = (0, t.jsx)(n.f, {
			variant: "ghost",
			size: "icon",
			className: o,
			onClick: _,
			disabled: z,
			children: c
		}), P[17] = _, P[18] = z, P[19] = c, P[20] = o, P[21] = u) : u = P[21], P[22] !== u || P[23] !== s ? (m = (0, t.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [s, u]
		}), P[22] = u, P[23] = s, P[24] = m) : m = P[24], m
	}
	e.s(["f", 0, function({
		placeholderAsset: e,
		exampleOutputMedia: r
	}) {
		let l = (0, v.useStudioStore)(e => e.studioOutput),
			s = (0, v.useStudioStore)(e => e.isGenerating),
			o = (0, v.useStudioStore)(e => e.showExampleOutput),
			{
				remainingTime: d,
				isActive: c
			} = function() {
				let e, t, a, r = (0, w.c)(9),
					l = (0, v.useStudioStore)(eP),
					n = (0, v.useStudioStore)(eF),
					s = (0, v.useStudioStore)(eC),
					[o, d] = (0, i.useState)(0),
					[c, u] = (0, i.useState)(""),
					m = "processing" === s && null !== l && null !== n;
				return r[0] !== m || r[1] !== n || r[2] !== l ? (e = () => {
					if (!m || !l || !n) {
						d(0), u("");
						return
					}
					let e = () => {
						let e = (Date.now() - n) / 1e3,
							t = 1.15 * l,
							a = Math.min(Math.floor(e / t * 100), 95),
							r = Math.max(0, t - e);
						d(a), u(function(e) {
							if (e <= 0) return "Almost done...";
							let t = Math.floor(e / 60),
								a = Math.floor(e % 60);
							return t > 0 ? `~${t}m ${a}s remaining` : `~${a}s remaining`
						}(r))
					};
					e();
					let t = setInterval(e, 1e3);
					return () => clearInterval(t)
				}, t = [m, l, n], r[0] = m, r[1] = n, r[2] = l, r[3] = e, r[4] = t) : (e = r[3], t = r[4]), (0, i.useEffect)(e, t), r[5] !== m || r[6] !== o || r[7] !== c ? (a = {
					progress: o,
					remainingTime: c,
					isActive: m
				}, r[5] = m, r[6] = o, r[7] = c, r[8] = a) : a = r[8], a
			}(),
			u = async (e, t) => {
				try {
					let a = await fetch(e),
						r = await a.blob(),
						i = window.URL.createObjectURL(r),
						l = document.createElement("a");
					l.href = i, l.download = `decart-${Date.now()}.${t?"png":"mp4"}`, document.body.appendChild(l), l.click(), document.body.removeChild(l), window.URL.revokeObjectURL(i)
				} catch (e) {
					console.error("Download failed:", e)
				}
			};
		if (s) return (0, t.jsxs)("div", {
			className: "flex flex-col items-center justify-center gap-3 text-foreground",
			children: [(0, t.jsx)(a.f, {
				className: "size-8 animate-spin"
			}), (0, t.jsx)("span", {
				className: "text-base font-medium",
				children: "Generating"
			}), (0, t.jsx)("span", {
				className: "text-sm text-muted-foreground",
				children: c ? d : "Please wait..."
			})]
		});
		let m = l?.modelOutput || (o ? r : void 0),
			p = l ? "image" === l.modelOutputType : !!r && !r.endsWith(".mp4") && !r.endsWith(".webm");
		if (!m) {
			let a = !e?.endsWith(".mp4"),
				r = a ? ej.f : eS;
			return (0, t.jsxs)("div", {
				className: "flex flex-col items-center justify-center gap-2 p-4",
				children: [(0, t.jsx)(r, {
					className: "size-14 text-muted-foreground"
				}), (0, t.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: ["Generated ", a ? "image" : "video", " will appear here"]
				})]
			})
		}
		return (0, t.jsxs)(t.Fragment, {
			children: [p ? (0, t.jsx)(ek.default, {
				unoptimized: !0,
				src: m,
				fill: !0,
				alt: "Studio Output",
				className: "object-contain"
			}) : (0, t.jsxs)("video", {
				className: "size-full object-contain",
				autoPlay: !0,
				loop: !0,
				muted: !0,
				playsInline: !0,
				controls: !1,
				disablePictureInPicture: !0,
				controlsList: "nodownload nofullscreen noremoteplayback",
				style: {
					outline: "none",
					border: "none",
					WebkitTransformStyle: "preserve-3d",
					WebkitTransform: "translateZ(0)",
					transform: "translateZ(0)"
				},
				onContextMenu: e => e.preventDefault(),
				children: [(0, t.jsx)("source", {
					src: m,
					type: "video/mp4"
				}), "Your browser does not support the video tag."]
			}, m), (0, t.jsx)(n.f, {
				variant: "secondary",
				size: "icon",
				"aria-label": "Download output",
				className: "absolute top-2 right-2 z-10 size-8 rounded-full bg-black/40 backdrop-blur-md hover:bg-black/60",
				onClick: () => u(m, p),
				children: (0, t.jsx)(ev.f, {
					className: "size-4"
				})
			}), l && (0, t.jsx)("div", {
				className: "absolute bottom-4 right-4 z-10",
				children: (0, t.jsx)(e1, {})
			}), (0, t.jsx)(e$, {})]
		})
	}], 324207)
}, 657367, e => {
	"use strict";
	var t = e.i(582018),
		a = e.i(486399),
		r = e.i(252376),
		i = e.i(196695);

	function l(e) {
		return e.selectedModelKey
	}

	function n(e) {
		return e.selectedResolution
	}

	function s(e) {
		return e.fastMode
	}
	e.s(["f", 0, () => {
		let e, o, d, c = (0, t.c)(12),
			u = (0, i.useStudioStore)(l),
			m = (0, i.useStudioStore)(n),
			p = (0, i.useStudioStore)(s);
		c[0] !== u ? (e = (0, a.U)(u), c[0] = u, c[1] = e) : e = c[1];
		let f = e,
			g = f?.pageGroup,
			h = f?.output ?? "video";
		e: {
			let e;
			if (!f) {
				o = 10;
				break e
			}
			if (c[2] !== f || c[3] !== p || c[4] !== m) {
				let {
					speed: t
				} = (0, r.P)(f, p, m);
				e = (0, a.P)(f, m, t) ?? 10, c[2] = f, c[3] = p, c[4] = m, c[5] = e
			} else e = c[5];o = e
		}
		let x = o;
		return c[6] !== x || c[7] !== h || c[8] !== g || c[9] !== u || c[10] !== m ? (d = {
			pageGroup: g,
			modelOutputType: h,
			creditCost: x,
			selectedModelKey: u,
			selectedResolution: m
		}, c[6] = x, c[7] = h, c[8] = g, c[9] = u, c[10] = m, c[11] = d) : d = c[11], d
	}])
}, 94186, 294281, 746868, 991875, 161276, 890882, 999323, e => {
	"use strict";
	var t = e.i(170380),
		a = e.i(981949),
		r = e.i(196695),
		i = e.i(833186);
	e.s(["f", 0, function({
		onComplete: e,
		onError: l
	}) {
		let n = (0, r.useStudioStore)(e => e.queueJobId),
			s = (0, r.useStudioStore)(e => e.queueStatus),
			o = (0, r.useStudioStore)(e => e.setQueueStatus),
			d = (0, r.useStudioStore)(e => e.clearQueueState),
			c = (0, r.useStudioStore)(e => e.clearProgressState),
			u = (0, r.useStudioStore)(e => e.setGenerationId),
			m = (0, t.useRef)(null),
			p = (0, t.useRef)(!1),
			f = (0, t.useCallback)(async () => {
				if (!n || p.current) return;
				p.current = !0, m.current = new AbortController;
				let {
					signal: t
				} = m.current, r = () => t.aborted;
				try {
					for (await new Promise(e => setTimeout(e, 500)); !r();) {
						let s = await (await (0, a.N)(t)).queue.status(n).catch(e => {
							throw (0, a.X)(e)
						});
						if (r()) break;
						if (o(s.status), "completed" === s.status) {
							let i = await (await (0, a.N)(t)).queue.result(n).catch(e => {
								throw (0, a.X)(e)
							});
							if (r()) break;
							let l = URL.createObjectURL(i);
							u(n), e(l), d(), c();
							break
						}
						if ("failed" === s.status) {
							l((0, i.Z)(Error("Video generation failed"))), d(), c();
							break
						}
						await new Promise(e => setTimeout(e, 1500))
					}
				} catch (e) {
					"AbortError" === e.name || r() || (l((0, i.Z)(e)), d(), c())
				} finally {
					m.current?.signal === t && (p.current = !1)
				}
			}, [n, o, d, c, u, e, l]);
		return (0, t.useEffect)(() => (n && !p.current && f(), () => {
			m.current?.abort(), p.current = !1
		}), [n, f]), {
			isPolling: !!n,
			status: s,
			cancelPolling: (0, t.useCallback)(() => {
				m.current?.abort(), d(), c()
			}, [d, c])
		}
	}], 94186);
	var l = e.i(538882),
		n = e.i(426682),
		s = e.i(745831),
		o = e.i(930971),
		d = e.i(377698);
	e.s(["z", 0, d], 294281);
	var d = d,
		c = e.i(624277),
		u = e.i(871101),
		m = e.i(893603);
	e.s(["f", 0, function(e, t) {
		let a = (function(e) {
			let t = {};
			for (let a of e.parameters.apiParameters) t[a.name] = function(e) {
				let t;
				switch (e.type) {
					case "string":
					case "textarea":
						t = l.z.string(), e.required && (t = t.min(1, `${e.name} is required`));
						break;
					case "select":
						t = e.options && e.options.length > 0 ? n.z.enum(e.options) : l.z.string();
						break;
					case "number":
					case "integer":
						t = s.z.number(), void 0 !== e.min && (t = t.min(e.min)), void 0 !== e.max && (t = t.max(e.max));
						break;
					case "toggle":
					case "boolean":
						t = o.z.boolean();
						break;
					case "file": {
						let a = e.accept || "";
						t = a.includes("image") ? d.instanceof(File).refine(e => e.size <= m.D, "Image must be less than 50MB").refine(e => m.u.includes(e.type), "Only JPEG, PNG, WebP allowed") : a.includes("video") ? d.instanceof(File).refine(e => e.size <= m.m, "Video must be less than 200MB").refine(e => m.d.includes(e.type), "Only MP4, WebM, QuickTime allowed") : d.instanceof(File);
						break
					}
					default:
						t = c.z.any()
				}
				return e.required || (t = t.nullish()), void 0 === e.defaultValue || e.required || (t = t.default(e.defaultValue)), t
			}(a);
			return u.z.object(t)
		})(t).safeParse(e);
		if (a.success) return {
			success: !0,
			data: a.data
		};
		let r = {};
		for (let e of a.error.issues) r[e.path.join(".")] = e.message;
		return {
			success: !1,
			errors: r
		}
	}], 746868);
	var p = e.i(234984),
		f = e.i(582018),
		g = e.i(560716),
		h = e.i(61993),
		x = e.i(326383),
		b = e.i(322932),
		y = e.i(8774),
		v = e.i(932767),
		j = e.i(169497),
		w = e.i(818036),
		N = e.i(657367),
		S = e.i(720957),
		k = e.i(832410),
		C = e.i(480381),
		F = e.i(380491);

	function P({
		open: e,
		imageFile: a,
		onConfirm: r,
		onCancel: i,
		allowedOrientations: l
	}) {
		let n = l?.length ? l : ["landscape", "portrait"],
			s = (0, t.useRef)(null),
			[o, d] = (0, t.useState)(),
			[c, u] = (0, t.useState)(),
			[m, f] = (0, t.useState)("landscape"),
			[g, h] = (0, t.useState)(null),
			[x, b] = (0, t.useState)(!1);
		(0, t.useEffect)(() => {
			if (!a) return void h(null);
			d(void 0), u(void 0);
			let e = URL.createObjectURL(a);
			return h(e), () => {
				URL.revokeObjectURL(e)
			}
		}, [a]);
		let v = (0, t.useCallback)(e => {
				let {
					width: t,
					height: a,
					naturalWidth: r,
					naturalHeight: i
				} = e.currentTarget;
				s.current = e.currentTarget;
				let l = (0, S.n)(r, i),
					o = n.includes(l) ? l : n[0];
				f(o);
				let c = S.l[o],
					m = (0, S.K)(t, a, c);
				d(m), u((0, S.A)(m, t, a))
			}, [n]),
			j = (0, t.useCallback)(e => {
				if (f(e), s.current) {
					let {
						width: t,
						height: a
					} = s.current, r = S.l[e], i = (0, S.K)(t, a, r);
					d(i), u((0, S.A)(i, t, a))
				}
			}, []),
			w = (0, t.useCallback)(e => {
				u(e)
			}, []),
			N = (0, t.useCallback)(async () => {
				if (s.current && c && a) {
					b(!0);
					try {
						let e = await (0, S.m)(s.current, c, a);
						r(e)
					} catch (e) {
						console.error("Failed to crop image:", e)
					} finally {
						b(!1)
					}
				}
			}, [c, a, r]),
			R = (0, t.useCallback)(() => {
				d(void 0), u(void 0), i()
			}, [i]),
			L = (0, t.useCallback)(e => {
				e || R()
			}, [R]),
			_ = S.l[m];
		return (0, p.jsx)(C.N, {
			open: e,
			onOpenChange: L,
			children: (0, p.jsxs)(C.d, {
				className: "max-w-md gap-6 p-6",
				children: [(0, p.jsxs)(C.s, {
					children: [(0, p.jsx)(C.F, {
						className: "text-xl tracking-wide",
						children: "Crop your image"
					}), (0, p.jsx)(C.C, {
						children: "Choose from the dimensions below. Drag and position the frame over the section of image you want to display."
					})]
				}), (0, p.jsx)("div", {
					className: "relative w-full overflow-hidden rounded-lg bg-black/20",
					children: g && (0, p.jsx)(k.U, {
						crop: o,
						onChange: (e, t) => d(t),
						onComplete: w,
						aspect: _,
						className: "max-h-[300px] w-full [&_.ReactCrop__crop-selection]:border-2 [&_.ReactCrop__crop-selection]:border-white",
						children: (0, p.jsx)("img", {
							ref: s,
							src: g,
							onLoad: v,
							className: "max-h-[300px] w-full object-contain"
						})
					})
				}), (0, p.jsxs)(C.c, {
					className: "flex-row items-center justify-between gap-4 sm:justify-between",
					children: [n.length > 1 ? (0, p.jsxs)(F.d, {
						value: m,
						onValueChange: e => j(e),
						children: [(0, p.jsx)(F.P, {
							className: "w-[140px] border-none rounded-sm",
							children: (0, p.jsx)("div", {
								className: "flex items-center gap-2",
								children: (0, p.jsx)(F.U, {})
							})
						}), (0, p.jsxs)(F.r, {
							children: [n.includes("landscape") && (0, p.jsx)(F.T, {
								value: "landscape",
								children: (0, p.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [(0, p.jsx)("div", {
										className: "h-2.5 w-[18px] rounded-xs bg-muted-foreground"
									}), "Landscape"]
								})
							}), n.includes("portrait") && (0, p.jsx)(F.T, {
								value: "portrait",
								children: (0, p.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [(0, p.jsx)("div", {
										className: "h-[18px] w-2.5 rounded-xs bg-muted-foreground"
									}), "Portrait"]
								})
							})]
						})]
					}) : (0, p.jsx)("div", {
						className: "flex items-center gap-2 px-3 py-2 text-sm",
						children: "landscape" === n[0] ? (0, p.jsxs)(p.Fragment, {
							children: [(0, p.jsx)("div", {
								className: "h-2.5 w-[18px] rounded-xs bg-muted-foreground"
							}), "Landscape"]
						}) : (0, p.jsxs)(p.Fragment, {
							children: [(0, p.jsx)("div", {
								className: "h-[18px] w-2.5 rounded-xs bg-muted-foreground"
							}), "Portrait"]
						})
					}), (0, p.jsxs)("div", {
						className: "flex gap-4",
						children: [(0, p.jsx)(y.f, {
							variant: "tertiary",
							onClick: R,
							disabled: x,
							className: "min-w-[88px] text-black rounded-sm",
							children: "Cancel"
						}), (0, p.jsx)(y.f, {
							onClick: N,
							disabled: !c || x,
							className: "min-w-[88px] text-black rounded-sm",
							children: "Ok"
						})]
					})]
				})]
			})
		})
	}

	function R(e) {
		let t = e ?? "";
		return t.includes("image") && t.includes("video") ? ["image", "video"] : t.includes("image") ? ["image"] : t.includes("video") ? ["video"] : ["image", "video"]
	}

	function L(e) {
		let t, a, r, i = (0, f.c)(8),
			{
				src: l,
				isVideo: n,
				className: s
			} = e;
		return i[0] !== s ? (t = (0, w.c)("block overflow-hidden bg-muted", s), i[0] = s, i[1] = t) : t = i[1], i[2] !== n || i[3] !== l ? (a = n ? (0, p.jsx)("video", {
			src: l,
			muted: !0,
			playsInline: !0,
			className: "size-full object-cover"
		}) : (0, p.jsx)("img", {
			src: l,
			alt: "",
			className: "size-full object-cover"
		}), i[2] = n, i[3] = l, i[4] = a) : a = i[4], i[5] !== t || i[6] !== a ? (r = (0, p.jsx)("span", {
			className: t,
			children: a
		}), i[5] = t, i[6] = a, i[7] = r) : r = i[7], r
	}
	async function _(e) {
		return new Promise((t, a) => {
			let r = document.createElement("video"),
				i = URL.createObjectURL(e);
			r.src = i, r.onloadedmetadata = () => {
				URL.revokeObjectURL(i), t(r.duration)
			}, r.onerror = () => {
				URL.revokeObjectURL(i), a(Error("Failed to load video metadata"))
			}
		})
	}

	function T({
		modelInputTypes: e,
		value: a,
		onChange: i,
		disabled: l = !1,
		allowedOrientations: n,
		skipCrop: s = !1,
		variant: o = "card",
		compactLabel: d = "Upload media",
		compactTitle: c,
		inputId: u
	}) {
		let [f, k] = (0, t.useState)(!1), [C, F] = (0, t.useState)(null), R = (0, t.useRef)(null), [z, E] = (0, t.useState)(!1), q = (0, t.useRef)(null), [O, U] = (0, t.useState)(null), [D, M] = (0, t.useState)(!1), {
			isLoading: I,
			isAuthenticated: G,
			checkAuth: V
		} = (0, j.f)(), $ = !I && G(), {
			pageGroup: W
		} = (0, N.f)(), A = "lucy-restyle-v2v" === W, B = (0, r.useStudioStore)(e => e.setUploadedVideoDuration), H = (0, t.useMemo)(() => !s && e.includes("image"), [e, s]), K = (0, t.useMemo)(() => {
			let t = [];
			return e.includes("image") && t.push(...m.u), e.includes("video") && t.push(...m.d), t
		}, [e]);
		(0, t.useEffect)(() => {
			if (!a) return void F(null);
			if (a.type.startsWith("image/")) {
				let e = new FileReader;
				e.onloadend = () => {
					F(e.result)
				}, e.readAsDataURL(a)
			} else if (a.type.startsWith("video/")) {
				let e = URL.createObjectURL(a);
				return F(e), () => URL.revokeObjectURL(e)
			}
		}, [a]);
		let Q = l || !$,
			J = (0, t.useCallback)(e => {
				$ || (e.preventDefault(), e.stopPropagation(), V())
			}, [$, V]),
			Z = (0, t.useCallback)(() => {
				Q || E(!0)
			}, [Q]),
			Y = async e => {
				let t = e.target.files?.[0];
				if (t) {
					k(!0);
					try {
						if (t.type.startsWith("image/") && H) {
							try {
								let {
									width: e,
									height: a
								} = await (0, S.u)(t);
								if (!(0, S.X)(e, a, n)) {
									U(t), M(!0), k(!1);
									return
								}
							} catch (e) {
								console.error("Error checking image dimensions:", e)
							}
							let e = new FileReader;
							e.onloadend = () => {
								F(e.result), k(!1)
							}, e.readAsDataURL(t), i(t, "image")
						} else if (t.type.startsWith("image/")) {
							let e = new FileReader;
							e.onloadend = () => {
								F(e.result), k(!1)
							}, e.readAsDataURL(t), i(t, "image")
						} else if (t.type.startsWith("video/")) {
							if (A) try {
								let e = await _(t);
								if (e > 1800) {
									let t = Math.floor(e / 60),
										a = Math.floor(e % 60);
									b.c.error(`Video duration is too long. Maximum duration for Lucy Restyle is 30 minutes. Your video is ${t}:${a.toString().padStart(2,"0")}.`), k(!1);
									return
								}
								B(e)
							} catch (e) {
								console.error("Error checking video duration:", e)
							}
							let e = URL.createObjectURL(t);
							F(e), k(!1), i(t, "video")
						} else k(!1)
					} catch (e) {
						console.error("Error processing file:", e), k(!1)
					}
				}
			}, X = (0, t.useCallback)(e => {
				M(!1), U(null), k(!1);
				let t = new FileReader;
				t.onloadend = () => {
					F(t.result)
				}, t.readAsDataURL(e), i(e, "image")
			}, [i]), ee = (0, t.useCallback)(() => {
				M(!1), U(null), k(!1), R.current && (R.current.value = ""), q.current && (q.current.value = "")
			}, []), et = () => {
				i(null), B(null), R.current && (R.current.value = "")
			}, ea = a?.type.startsWith("video/") ?? !1, er = !!a, ei = a?.name || "";
		return "field" === o ? (0, p.jsxs)(p.Fragment, {
			children: [(0, p.jsxs)("div", {
				className: "group relative flex w-full min-w-0",
				role: "button",
				title: c,
				onClick: J,
				children: [(0, p.jsx)(v.f, {
					ref: R,
					id: u,
					type: "file",
					title: "",
					accept: K.join(","),
					onChange: Y,
					disabled: Q,
					onDragEnter: Z,
					onDragLeave: () => E(!1),
					onDrop: () => E(!1),
					className: "absolute inset-0 z-10 cursor-pointer opacity-0 disabled:opacity-0!"
				}), (0, p.jsxs)("div", {
					className: (0, w.c)("flex h-9 w-full min-w-0 items-center justify-between gap-2 rounded-full bg-card py-1 pr-1 pl-3 transition-colors", !Q && "cursor-pointer", "group-focus-within:ring-2 group-focus-within:ring-ring/50", z && "bg-accent/10 ring-1 ring-accent", Q && "opacity-50"),
					children: [(0, p.jsx)("span", {
						className: (0, w.c)("min-w-0 truncate text-xs tracking-[0.24px]", er ? "text-foreground" : "text-muted-foreground"),
						children: f ? "Loading…" : er ? ei : d
					}), er ? (0, p.jsx)("button", {
						type: "button",
						onClick: et,
						disabled: l,
						"aria-label": `Remove ${ei}`,
						className: "relative z-20 flex h-7 shrink-0 items-center rounded-full bg-background px-3 text-muted-foreground text-xs transition-colors hover:text-foreground",
						children: "Remove"
					}) : (0, p.jsxs)("span", {
						className: (0, w.c)("flex h-7 shrink-0 items-center gap-1 rounded-full bg-background pr-3 pl-2 text-muted-foreground text-xs transition-colors", !Q && "group-hover:text-foreground"),
						children: [(0, p.jsx)(g.f, {
							className: "size-4 shrink-0"
						}), "Upload"]
					})]
				})]
			}), er && C && (0, p.jsx)(L, {
				src: C,
				isVideo: ea,
				className: "mt-2 h-15 w-25 rounded-sm"
			}), (0, p.jsx)(P, {
				open: D,
				imageFile: O,
				onConfirm: X,
				onCancel: ee,
				allowedOrientations: n
			})]
		}) : "chip" === o ? (0, p.jsxs)(p.Fragment, {
			children: [(0, p.jsxs)("div", {
				className: "group relative flex min-w-0 shrink",
				role: "button",
				title: c,
				onClick: J,
				children: [(0, p.jsx)(v.f, {
					ref: R,
					type: "file",
					title: "",
					accept: K.join(","),
					onChange: Y,
					disabled: Q,
					onDragEnter: Z,
					onDragLeave: () => E(!1),
					onDrop: () => E(!1),
					className: "absolute inset-0 z-10 cursor-pointer opacity-0 disabled:opacity-0!"
				}), (0, p.jsxs)("div", {
					className: (0, w.c)("flex h-7 min-w-0 items-center gap-1.5 rounded-full bg-background transition-colors", er ? "pr-1.5 pl-1" : "pr-3 pl-2", !Q && "cursor-pointer group-hover:bg-secondary", "group-focus-within:ring-2 group-focus-within:ring-ring/50", z && "bg-accent/10 ring-1 ring-accent", Q && "opacity-50"),
					children: [er && C ? (0, p.jsx)(L, {
						src: C,
						isVideo: ea,
						className: "size-5 shrink-0 rounded-full"
					}) : (0, p.jsx)(g.f, {
						className: "size-4 shrink-0 text-muted-foreground"
					}), (0, p.jsx)("span", {
						className: (0, w.c)("min-w-0 truncate text-muted-foreground text-xs transition-colors", !Q && "group-hover:text-foreground"),
						children: f ? "Loading…" : er ? ei : d
					}), er && (0, p.jsx)("button", {
						type: "button",
						onClick: et,
						disabled: l,
						"aria-label": `Remove ${ei}`,
						className: "relative z-20 flex size-4 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground",
						children: (0, p.jsx)(x.X, {
							className: "size-3"
						})
					})]
				})]
			}), (0, p.jsx)(P, {
				open: D,
				imageFile: O,
				onConfirm: X,
				onCancel: ee,
				allowedOrientations: n
			})]
		}) : (0, p.jsxs)("div", {
			className: "flex flex-col gap-3 shrink-0 relative",
			children: [!er && !f && (0, p.jsxs)("div", {
				className: "relative cursor-pointer",
				role: "button",
				onClick: J,
				children: [(0, p.jsx)(v.f, {
					ref: R,
					type: "file",
					title: "",
					accept: K.join(","),
					onChange: Y,
					disabled: Q,
					onDragEnter: Z,
					onDragLeave: () => E(!1),
					onDrop: () => E(!1),
					className: "absolute inset-0 z-20 cursor-pointer opacity-0 disabled:opacity-0!"
				}), (0, p.jsxs)("div", {
					className: `flex h-10 items-center justify-center gap-2 rounded-lg border px-4 pointer-events-none transition-colors ${z?"border-accent bg-accent/5":l?"border-border bg-muted opacity-60":"border-border bg-card"}`,
					children: [(0, p.jsx)(g.f, {
						className: "size-4 text-muted-foreground"
					}), (0, p.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Upload media"
					})]
				})]
			}), f && (0, p.jsx)("div", {
				className: "flex h-10 items-center justify-center rounded-lg border border-border bg-card px-4",
				children: (0, p.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading..."
				})
			}), er && !f && (0, p.jsxs)("div", {
				className: "group relative",
				role: "button",
				onClick: J,
				children: [(0, p.jsx)(v.f, {
					ref: q,
					type: "file",
					title: "",
					accept: K.join(","),
					onChange: Y,
					disabled: Q,
					onDragEnter: Z,
					onDragLeave: () => E(!1),
					onDrop: () => E(!1),
					className: "absolute inset-0 z-10 cursor-pointer opacity-0 disabled:opacity-0!"
				}), (0, p.jsxs)("div", {
					className: `flex items-center rounded-lg border h-14 overflow-hidden transition-colors ${z?"border-accent bg-accent/5":"border-border bg-card"}`,
					children: [C && (0, p.jsxs)("div", {
						className: "relative z-20 size-14 shrink-0 overflow-hidden rounded-md cursor-pointer isolate max-md:pointer-events-none",
						onClick: l ? void 0 : et,
						onKeyDown: l ? void 0 : e => "Enter" === e.key && et(),
						role: "button",
						tabIndex: l ? -1 : 0,
						children: [!ea && (0, p.jsx)("img", {
							src: C,
							alt: "Preview",
							className: "size-full object-cover"
						}), ea && (0, p.jsx)("video", {
							src: C,
							autoPlay: !0,
							loop: !0,
							muted: !0,
							playsInline: !0,
							className: "size-full object-cover"
						}), (0, p.jsx)("div", {
							className: "absolute inset-0 hidden md:flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity",
							children: (0, p.jsx)(h.f, {
								className: "size-4 text-white"
							})
						})]
					}), (0, p.jsx)("p", {
						className: "flex-1 text-xs text-foreground truncate px-3",
						children: ei
					}), (0, p.jsx)(y.f, {
						type: "button",
						variant: "ghost",
						size: "icon",
						onClick: et,
						disabled: l,
						className: "md:hidden shrink-0 mr-2 size-8 z-20",
						children: (0, p.jsx)(h.f, {
							className: "size-4"
						})
					})]
				})]
			}), (0, p.jsx)(P, {
				open: D,
				imageFile: O,
				onConfirm: X,
				onCancel: ee,
				allowedOrientations: n
			})]
		})
	}
	e.s(["_", 0, T, "v", 0, R], 991875), e.s(["f", 0, function(e) {
		let t, a, r, i = (0, f.c)(11),
			{
				parameter: l,
				value: n,
				onChange: s,
				disabled: o
			} = e;
		return i[0] !== l.accept ? (t = R(l.accept), i[0] = l.accept, i[1] = t) : t = i[1], i[2] !== s ? (a = e => s(e), i[2] = s, i[3] = a) : a = i[3], i[4] !== o || i[5] !== l.allowedOrientations || i[6] !== l.skipCrop || i[7] !== t || i[8] !== a || i[9] !== n ? (r = (0, p.jsx)(T, {
			modelInputTypes: t,
			value: n,
			onChange: a,
			disabled: o,
			allowedOrientations: l.allowedOrientations,
			skipCrop: l.skipCrop
		}), i[4] = o, i[5] = l.allowedOrientations, i[6] = l.skipCrop, i[7] = t, i[8] = a, i[9] = n, i[10] = r) : r = i[10], r
	}], 161276);
	var z = e.i(583228),
		E = e.i(232250),
		q = e.i(546009);
	e.s(["f", 0, function(e) {
		let t, a, r, i, l, n, s, o, d, c = (0, f.c)(35),
			{
				parameter: u,
				error: m,
				children: g,
				isStandalone: h
			} = e;
		c[0] !== u.label || c[1] !== u.name ? (t = u.label || u.name.split("_").map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(" "), c[0] = u.label, c[1] = u.name, c[2] = t) : t = c[2];
		let x = t;
		if (u.hideLabel) {
			let e, t;
			return c[3] !== m || c[4] !== u.name ? (e = m && (0, p.jsx)("p", {
				id: `${u.name}-error`,
				className: "text-sm text-destructive",
				children: m
			}), c[3] = m, c[4] = u.name, c[5] = e) : e = c[5], c[6] !== g || c[7] !== e ? (t = (0, p.jsxs)("div", {
				className: "flex flex-col gap-2",
				children: [g, e]
			}), c[6] = g, c[7] = e, c[8] = t) : t = c[8], t
		}
		let b = void 0 !== h && h ? "text-base font-medium" : "text-sm font-medium",
			y = u.helpText,
			v = !y && u.description;
		return c[9] !== u.required ? (a = u.required && (0, p.jsx)("span", {
			className: "text-accent ml-[-3]",
			children: "*"
		}), c[9] = u.required, c[10] = a) : a = c[10], c[11] !== x || c[12] !== b || c[13] !== u.name || c[14] !== a ? (r = (0, p.jsxs)(E.f, {
			htmlFor: u.name,
			className: b,
			children: [x, a]
		}), c[11] = x, c[12] = b, c[13] = u.name, c[14] = a, c[15] = r) : r = c[15], c[16] !== u.description || c[17] !== v ? (i = v && (0, p.jsx)(q.g, {
			children: (0, p.jsxs)(q.W, {
				children: [(0, p.jsx)(q.y, {
					asChild: !0,
					children: (0, p.jsx)(z.f, {
						className: "size-3.5 text-muted-foreground cursor-help"
					})
				}), (0, p.jsx)(q.Y, {
					className: "max-w-xs bg-popover text-card-foreground",
					children: (0, p.jsx)("p", {
						className: "text-sm whitespace-pre-line",
						children: u.description
					})
				})]
			})
		}), c[16] = u.description, c[17] = v, c[18] = i) : i = c[18], c[19] !== r || c[20] !== i ? (l = (0, p.jsxs)("div", {
			className: "flex items-center gap-1.5",
			children: [r, i]
		}), c[19] = r, c[20] = i, c[21] = l) : l = c[21], c[22] !== u.helpText || c[23] !== y ? (n = y && (0, p.jsx)("span", {
			className: "text-xs text-muted-foreground",
			children: u.helpText
		}), c[22] = u.helpText, c[23] = y, c[24] = n) : n = c[24], c[25] !== l || c[26] !== n ? (s = (0, p.jsxs)("div", {
			className: "flex items-center justify-between gap-1.5",
			children: [l, n]
		}), c[25] = l, c[26] = n, c[27] = s) : s = c[27], c[28] !== m || c[29] !== u.name ? (o = m && (0, p.jsx)("p", {
			id: `${u.name}-error`,
			className: "text-sm text-destructive",
			children: m
		}), c[28] = m, c[29] = u.name, c[30] = o) : o = c[30], c[31] !== g || c[32] !== s || c[33] !== o ? (d = (0, p.jsxs)("div", {
			className: "flex flex-col gap-2",
			children: [s, g, o]
		}), c[31] = g, c[32] = s, c[33] = o, c[34] = d) : d = c[34], d
	}], 890882);
	var O = e.i(329474),
		U = e.i(976311);
	e.s(["f", 0, function(e) {
		let t, a, r, i, l, n, s = (0, f.c)(42),
			{
				section: o,
				children: d,
				headerContent: c,
				hasRequiredFields: u,
				isFirst: m
			} = e,
			g = void 0 !== m && m,
			h = "two-column" === o.layout ? "grid grid-cols-1 gap-4 @sm:grid-cols-2" : "flex flex-col gap-4";
		if (o.collapsible) {
			let e, t, a, r, i, l, n, m, f, x = `@container w-full ${g?"":"pt-6 border-t border-border"}`;
			s[0] !== u ? (e = u && (0, p.jsx)("span", {
				className: "text-primary ml-1",
				children: "*"
			}), s[0] = u, s[1] = e) : e = s[1], s[2] !== o.title || s[3] !== e ? (t = (0, p.jsxs)("h3", {
				className: "text-base font-semibold",
				children: [o.title, e]
			}), s[2] = o.title, s[3] = e, s[4] = t) : t = s[4], s[5] !== c || s[6] !== t ? (a = (0, p.jsxs)("div", {
				className: "flex items-center justify-between w-full",
				children: [t, c]
			}), s[5] = c, s[6] = t, s[7] = a) : a = s[7], s[8] === Symbol.for("react.memo_cache_sentinel") ? (r = (0, p.jsx)(O.f, {
				className: "ml-2 size-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180"
			}), s[8] = r) : r = s[8], s[9] !== a ? (i = (0, p.jsxs)(U.v, {
				className: "flex items-center justify-between w-full text-left hover:opacity-80 transition-opacity",
				children: [a, r]
			}), s[9] = a, s[10] = i) : i = s[10], s[11] !== o.description ? (l = o.description && (0, p.jsx)("p", {
				className: "text-xs text-muted-foreground mt-2 mb-4",
				children: o.description
			}), s[11] = o.description, s[12] = l) : l = s[12];
			let b = `${h} mt-4`;
			return s[13] !== d || s[14] !== b ? (n = (0, p.jsx)("div", {
				className: b,
				children: d
			}), s[13] = d, s[14] = b, s[15] = n) : n = s[15], s[16] !== n || s[17] !== l ? (m = (0, p.jsxs)(U.C, {
				children: [l, n]
			}), s[16] = n, s[17] = l, s[18] = m) : m = s[18], s[19] !== o.defaultOpen || s[20] !== m || s[21] !== x || s[22] !== i ? (f = (0, p.jsxs)(U.Y, {
				defaultOpen: o.defaultOpen,
				className: x,
				children: [i, m]
			}), s[19] = o.defaultOpen, s[20] = m, s[21] = x, s[22] = i, s[23] = f) : f = s[23], f
		}
		let x = `@container flex flex-col gap-4 ${g?"":"pt-6 border-t border-border"}`;
		return s[24] !== u ? (t = u && (0, p.jsx)("span", {
			className: "text-primary ml-1",
			children: "*"
		}), s[24] = u, s[25] = t) : t = s[25], s[26] !== o.title || s[27] !== t ? (a = (0, p.jsxs)("h3", {
			className: "text-base font-semibold",
			children: [o.title, t]
		}), s[26] = o.title, s[27] = t, s[28] = a) : a = s[28], s[29] !== c || s[30] !== a ? (r = (0, p.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [a, c]
		}), s[29] = c, s[30] = a, s[31] = r) : r = s[31], s[32] !== o.description ? (i = o.description && (0, p.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: o.description
		}), s[32] = o.description, s[33] = i) : i = s[33], s[34] !== d || s[35] !== h ? (l = (0, p.jsx)("div", {
			className: h,
			children: d
		}), s[34] = d, s[35] = h, s[36] = l) : l = s[36], s[37] !== x || s[38] !== r || s[39] !== i || s[40] !== l ? (n = (0, p.jsxs)("div", {
			className: x,
			children: [r, i, l]
		}), s[37] = x, s[38] = r, s[39] = i, s[40] = l, s[41] = n) : n = s[41], n
	}], 999323)
}]);