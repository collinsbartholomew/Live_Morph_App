const CACHE = 'clone-v1';
const API_MAP = {};
const WS_MAP = {};
const URL_MAP = {
	"p.typekit.net/p_s_1_k_ppu4dvr_ht_tk_f_53554.53556.53557.53558.53560.53567.53568_a_351371089_app_typekit_e_css_ee02099a.css": "p.typekit.net/p_s_1_k_ppu4dvr_ht_tk_f_53554.53556.53557.53558.53560.53567.53568_a_351371089_app_typekit_e_css_ee02099a.css",
	"platform.decart.ai/index.html": "platform.decart.ai/index.html",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1200_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_f6ffced2.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_128_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_4dbd3d56.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1920_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_cf200573.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_2048_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_ad584c3e.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_256_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_2331e9c5.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_32_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_84ee325f.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_384_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_b524add6.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_3840_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_4e3aa0b9.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_48_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_6d411310.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_64_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_99daae68.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_640_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_78dd5011.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_750_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_7fd0b10d.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_828_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_a3756bf8.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_96_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_1752bf46.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_3e7ff606.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_1200_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_a964c995.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_128_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_a4c9a8c8.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_1920_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_352f6130.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_2048_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_3ae8cb8c.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_256_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_40b4e575.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_32_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_18822a4b.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_384_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_f96b1c76.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_3840_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_805b38e8.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_48_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_aa7a01b5.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_64_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_38b091ca.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_640_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_11d93578.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_750_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_1339472d.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_828_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_8d3a990a.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-02.avif_w_96_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_d30064d7.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_38908621.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_1200_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_bc214c24.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_128_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_bb1e0b47.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_1920_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_56e4a228.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_2048_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_da36a0ab.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_256_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_9891b364.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_32_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_970e1c97.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_384_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_c3bb793e.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_3840_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_79d42945.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_48_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_f7000eb3.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_64_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_a5437b6a.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_640_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_ac828a01.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_750_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_95078810.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_828_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_ff53b356.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-03.avif_w_96_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_2a130b98.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_7eec5e2c.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_1200_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_64a8d73f.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_128_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_0b75ab45.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_1920_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_1569d9ed.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_2048_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_fe39ea38.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_256_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_ad9d8eb9.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_32_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_3fc3cb25.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_384_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_133bea65.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_3840_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_0e66a3c9.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_48_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_dc1ba45f.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_64_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_71ac352c.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_640_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_cc923a4b.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_750_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_3c03cc28.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_828_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_c5d544da.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-04.avif_w_96_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_578561eb.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_4e103918.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_1200_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_0e2ed740.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_128_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_c230ee3b.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_1920_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_8fec5bf3.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_2048_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_40fd4af5.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_256_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_72385ef0.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_32_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_bcb9f1cc.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_384_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_1b1420e5.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_3840_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_3b34ff15.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_48_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_05a0a57d.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_64_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_bb007b4b.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_640_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_a1d0e7b5.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_750_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_582778fa.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_828_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74fa4af8.avif",
	"platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-01.avif_w_1080_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_74c76a21.avif": "platform.decart.ai/_next/image/index_url_%2Fhomepage%2Fhero%2Fvirtual-try-on%2Fthumb-05.avif_w_96_q_75_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_52ea4c89.avif",
	"platform.decart.ai/_next/static/immutable/chunks/0-cr0pc3i_oao.js": "platform.decart.ai/_next/static/immutable/chunks/0-cr0pc3i_oao.js",
	"platform.decart.ai/_next/static/immutable/chunks/01kl8l5lj-k86.js": "platform.decart.ai/_next/static/immutable/chunks/01kl8l5lj-k86.js",
	"platform.decart.ai/_next/static/immutable/chunks/088cb2xlf-v3s.js": "platform.decart.ai/_next/static/immutable/chunks/088cb2xlf-v3s.js",
	"platform.decart.ai/_next/static/immutable/chunks/0c0hxoamwjsbw.js": "platform.decart.ai/_next/static/immutable/chunks/0c0hxoamwjsbw.js",
	"platform.decart.ai/_next/static/immutable/chunks/0hl6j408cef4a.js": "platform.decart.ai/_next/static/immutable/chunks/0hl6j408cef4a.js",
	"platform.decart.ai/_next/static/immutable/chunks/0mece6x1p2pgw.js": "platform.decart.ai/_next/static/immutable/chunks/0mece6x1p2pgw.js",
	"platform.decart.ai/_next/static/immutable/chunks/0oen6qe2o2s0r.js": "platform.decart.ai/_next/static/immutable/chunks/0oen6qe2o2s0r.js",
	"platform.decart.ai/_next/static/immutable/chunks/0rcvxpfoqnouy.js": "platform.decart.ai/_next/static/immutable/chunks/0rcvxpfoqnouy.js",
	"platform.decart.ai/_next/static/immutable/chunks/0sadgfeksozeg.js": "platform.decart.ai/_next/static/immutable/chunks/0sadgfeksozeg.js",
	"platform.decart.ai/_next/static/immutable/chunks/0t-tqn-5ctq3r.js": "platform.decart.ai/_next/static/immutable/chunks/0t-tqn-5ctq3r.js",
	"platform.decart.ai/_next/static/immutable/chunks/0urdgjlye9wl2.js": "platform.decart.ai/_next/static/immutable/chunks/0urdgjlye9wl2.js",
	"platform.decart.ai/_next/static/immutable/chunks/0voajgx6opih1.js": "platform.decart.ai/_next/static/immutable/chunks/0voajgx6opih1.js",
	"platform.decart.ai/_next/static/immutable/chunks/0w6cuhe4b2e8d.js": "platform.decart.ai/_next/static/immutable/chunks/0w6cuhe4b2e8d.js",
	"platform.decart.ai/_next/static/immutable/chunks/0yqlee29ln847.js": "platform.decart.ai/_next/static/immutable/chunks/0yqlee29ln847.js",
	"platform.decart.ai/_next/static/immutable/chunks/1-zxkaw-46x_3.css": "platform.decart.ai/_next/static/immutable/chunks/1-zxkaw-46x_3.css",
	"platform.decart.ai/_next/static/immutable/chunks/1045sr32v6fim.js": "platform.decart.ai/_next/static/immutable/chunks/1045sr32v6fim.js",
	"platform.decart.ai/_next/static/immutable/chunks/15nto5063wxjw.js": "platform.decart.ai/_next/static/immutable/chunks/15nto5063wxjw.js",
	"platform.decart.ai/_next/static/immutable/chunks/1ap79k2b2upt6.js": "platform.decart.ai/_next/static/immutable/chunks/1ap79k2b2upt6.js",
	"platform.decart.ai/_next/static/immutable/chunks/1fv3t7al7kz18.js": "platform.decart.ai/_next/static/immutable/chunks/1fv3t7al7kz18.js",
	"platform.decart.ai/_next/static/immutable/chunks/1oq00te_rkphr.js": "platform.decart.ai/_next/static/immutable/chunks/1oq00te_rkphr.js",
	"platform.decart.ai/_next/static/immutable/chunks/1ouef75bp5jjk.js": "platform.decart.ai/_next/static/immutable/chunks/1ouef75bp5jjk.js",
	"platform.decart.ai/_next/static/immutable/chunks/1sehc2xx9_roq.js": "platform.decart.ai/_next/static/immutable/chunks/1sehc2xx9_roq.js",
	"platform.decart.ai/_next/static/immutable/chunks/2-dm3-zgoorqm.js": "platform.decart.ai/_next/static/immutable/chunks/2-dm3-zgoorqm.js",
	"platform.decart.ai/_next/static/immutable/chunks/21-eqzwlmtnx.js": "platform.decart.ai/_next/static/immutable/chunks/21-eqzwlmtnx.js",
	"platform.decart.ai/_next/static/immutable/chunks/214a2acdu-7rr.js": "platform.decart.ai/_next/static/immutable/chunks/214a2acdu-7rr.js",
	"platform.decart.ai/_next/static/immutable/chunks/23cpa-dgt4pqw.js": "platform.decart.ai/_next/static/immutable/chunks/23cpa-dgt4pqw.js",
	"platform.decart.ai/_next/static/immutable/chunks/2ge8eazi6pt4o.js": "platform.decart.ai/_next/static/immutable/chunks/2ge8eazi6pt4o.js",
	"platform.decart.ai/_next/static/immutable/chunks/2kbsw16u8p1_n.js": "platform.decart.ai/_next/static/immutable/chunks/2kbsw16u8p1_n.js",
	"platform.decart.ai/_next/static/immutable/chunks/2kxgo7fxvisk3.js": "platform.decart.ai/_next/static/immutable/chunks/2kxgo7fxvisk3.js",
	"platform.decart.ai/_next/static/immutable/chunks/2mv371qneiimr.js": "platform.decart.ai/_next/static/immutable/chunks/2mv371qneiimr.js",
	"platform.decart.ai/_next/static/immutable/chunks/2ndbmfplhpi57.js": "platform.decart.ai/_next/static/immutable/chunks/2ndbmfplhpi57.js",
	"platform.decart.ai/_next/static/immutable/chunks/2pti87kp6pxei.js": "platform.decart.ai/_next/static/immutable/chunks/2pti87kp6pxei.js",
	"platform.decart.ai/_next/static/immutable/chunks/2wfkmcpkcch-g.js": "platform.decart.ai/_next/static/immutable/chunks/2wfkmcpkcch-g.js",
	"platform.decart.ai/_next/static/immutable/chunks/3g7ysr3ucywgm.css": "platform.decart.ai/_next/static/immutable/chunks/3g7ysr3ucywgm.css",
	"platform.decart.ai/_next/static/immutable/chunks/3j8e48ae28hmv.js": "platform.decart.ai/_next/static/immutable/chunks/3j8e48ae28hmv.js",
	"platform.decart.ai/_next/static/immutable/chunks/3jhjj58w4fes5.js": "platform.decart.ai/_next/static/immutable/chunks/3jhjj58w4fes5.js",
	"platform.decart.ai/_next/static/immutable/chunks/3ms5-g_p1d10t.js": "platform.decart.ai/_next/static/immutable/chunks/3ms5-g_p1d10t.js",
	"platform.decart.ai/_next/static/immutable/chunks/3nw0r78fl8o0o.js": "platform.decart.ai/_next/static/immutable/chunks/3nw0r78fl8o0o.js",
	"platform.decart.ai/_next/static/immutable/chunks/3ov2sbkp2-2gh.js": "platform.decart.ai/_next/static/immutable/chunks/3ov2sbkp2-2gh.js",
	"platform.decart.ai/_next/static/immutable/chunks/3wni773bztmcv.js": "platform.decart.ai/_next/static/immutable/chunks/3wni773bztmcv.js",
	"platform.decart.ai/_next/static/immutable/chunks/3zlx142wf8tcj.js": "platform.decart.ai/_next/static/immutable/chunks/3zlx142wf8tcj.js",
	"platform.decart.ai/_next/static/immutable/chunks/41y185ma8r4_r.js": "platform.decart.ai/_next/static/immutable/chunks/41y185ma8r4_r.js",
	"platform.decart.ai/_next/static/immutable/chunks/43a8c9y_o0vbn.js": "platform.decart.ai/_next/static/immutable/chunks/43a8c9y_o0vbn.js",
	"platform.decart.ai/_next/static/immutable/chunks/43cgcqhugj7x7.js": "platform.decart.ai/_next/static/immutable/chunks/43cgcqhugj7x7.js",
	"platform.decart.ai/_next/static/immutable/chunks/44qv-rt45dv_1.css": "platform.decart.ai/_next/static/immutable/chunks/44qv-rt45dv_1.css",
	"platform.decart.ai/_next/static/immutable/chunks/turbopack-3h_ctkfaeun7f.js": "platform.decart.ai/_next/static/immutable/chunks/turbopack-3h_ctkfaeun7f.js",
	"platform.decart.ai/_next/static/immutable/media/09c1ee5db0c34aab-s.3krvk0b0xtz_l.woff2": "platform.decart.ai/_next/static/immutable/media/09c1ee5db0c34aab-s.3krvk0b0xtz_l.woff2",
	"platform.decart.ai/_next/static/immutable/media/0f3cd0c4b5a947fa-s.2km1e96ik5b1t.woff2": "platform.decart.ai/_next/static/immutable/media/0f3cd0c4b5a947fa-s.2km1e96ik5b1t.woff2",
	"platform.decart.ai/_next/static/immutable/media/336df03c0f1b4b82-s.3-lutyg1ydbg9.woff2": "platform.decart.ai/_next/static/immutable/media/336df03c0f1b4b82-s.3-lutyg1ydbg9.woff2",
	"platform.decart.ai/_next/static/immutable/media/5727da9e6304861b-s.p.1h1ev0k1fv9c1.woff2": "platform.decart.ai/_next/static/immutable/media/5727da9e6304861b-s.p.1h1ev0k1fv9c1.woff2",
	"platform.decart.ai/_next/static/immutable/media/5b6dc16c9b90d122-s.3kgykd3eskbj4.woff2": "platform.decart.ai/_next/static/immutable/media/5b6dc16c9b90d122-s.3kgykd3eskbj4.woff2",
	"platform.decart.ai/_next/static/immutable/media/Roobert_Medium-s.p.3g1k3bxw2ybc3.woff2": "platform.decart.ai/_next/static/immutable/media/Roobert_Medium-s.p.3g1k3bxw2ybc3.woff2",
	"platform.decart.ai/_next/static/immutable/media/Roobert_Regular-s.p.3x5vc02ehcr98.woff2": "platform.decart.ai/_next/static/immutable/media/Roobert_Regular-s.p.3x5vc02ehcr98.woff2",
	"platform.decart.ai/_next/static/immutable/media/adb3ec3d336bbda5-s.1en75e1iv279e.woff2": "platform.decart.ai/_next/static/immutable/media/adb3ec3d336bbda5-s.1en75e1iv279e.woff2",
	"platform.decart.ai/_next/static/immutable/media/c120a353648b4f1f-s.2f33kk4pafr__.woff2": "platform.decart.ai/_next/static/immutable/media/c120a353648b4f1f-s.2f33kk4pafr__.woff2",
	"platform.decart.ai/_next/static/immutable/media/frame-metadata-worker.01oh17o59vk6p.js": "platform.decart.ai/_next/static/immutable/media/frame-metadata-worker.01oh17o59vk6p.js",
	"platform.decart.ai/_vercel/speed-insights/script.js": "platform.decart.ai/_vercel/speed-insights/script.js",
	"platform.decart.ai/api-keys/index.html": "platform.decart.ai/api-keys/index.html",
	"platform.decart.ai/billing/index.html": "platform.decart.ai/billing/index.html",
	"platform.decart.ai/homepage/hero/virtual-try-on/base.avif": "platform.decart.ai/homepage/hero/virtual-try-on/base.avif",
	"platform.decart.ai/homepage/hero/virtual-try-on/base.webm": "platform.decart.ai/homepage/hero/virtual-try-on/base.webm",
	"platform.decart.ai/homepage/lucy-edit.webm": "platform.decart.ai/homepage/lucy-edit.webm",
	"platform.decart.ai/homepage/lucy-restyle.webm": "platform.decart.ai/homepage/lucy-restyle.webm",
	"platform.decart.ai/homepage/lucy-vton.webm": "platform.decart.ai/homepage/lucy-vton.webm",
	"platform.decart.ai/homepage/single-frame/lucy-edit.avif": "platform.decart.ai/homepage/single-frame/lucy-edit.avif",
	"platform.decart.ai/homepage/single-frame/lucy-restyle.avif": "platform.decart.ai/homepage/single-frame/lucy-restyle.avif",
	"platform.decart.ai/homepage/single-frame/lucy-vton.avif": "platform.decart.ai/homepage/single-frame/lucy-vton.avif",
	"platform.decart.ai/icon_icon.1nr_siwt23i2x.png_326ead68.png": "platform.decart.ai/icon_icon.1nr_siwt23i2x.png_326ead68.png",
	"platform.decart.ai/icons/models/v2/lucy-edit-live-hover.svg": "platform.decart.ai/icons/models/v2/lucy-edit-live-hover.svg",
	"platform.decart.ai/icons/models/v2/lucy-edit-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-edit-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/models/v2/lucy-edit-live.svg": "platform.decart.ai/icons/models/v2/lucy-edit-live.svg",
	"platform.decart.ai/icons/models/v2/lucy-edit-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-edit-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/models/v2/lucy-restyle-live-hover.svg": "platform.decart.ai/icons/models/v2/lucy-restyle-live-hover.svg",
	"platform.decart.ai/icons/models/v2/lucy-restyle-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-restyle-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/models/v2/lucy-restyle-live.svg": "platform.decart.ai/icons/models/v2/lucy-restyle-live.svg",
	"platform.decart.ai/icons/models/v2/lucy-restyle-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-restyle-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/models/v2/lucy-vton-live-hover.svg": "platform.decart.ai/icons/models/v2/lucy-vton-live-hover.svg",
	"platform.decart.ai/icons/models/v2/lucy-vton-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-vton-live-hover_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/models/v2/lucy-vton-live.svg": "platform.decart.ai/icons/models/v2/lucy-vton-live.svg",
	"platform.decart.ai/icons/models/v2/lucy-vton-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/models/v2/lucy-vton-live_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/social/discord_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/social/discord_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/social/github_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/social/github_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/icons/social/twitter_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg": "platform.decart.ai/icons/social/twitter_dpl_dpl_2GBsLDQQT2tGCY2pgnEsx7zj6iLY_5eeea862.svg",
	"platform.decart.ai/models-about/lucy-restyle/01.mp4": "platform.decart.ai/models-about/lucy-restyle/01.mp4",
	"platform.decart.ai/models-about/lucy-restyle/02.mp4": "platform.decart.ai/models-about/lucy-restyle/02.mp4",
	"platform.decart.ai/models-about/lucy-restyle/03.mp4": "platform.decart.ai/models-about/lucy-restyle/03.mp4",
	"platform.decart.ai/models-about/lucy-vton/01.mp4": "platform.decart.ai/models-about/lucy-vton/01.mp4",
	"platform.decart.ai/models-about/lucy-vton/03.mp4": "platform.decart.ai/models-about/lucy-vton/03.mp4",
	"platform.decart.ai/models-about/lucy/01.mp4": "platform.decart.ai/models-about/lucy/01.mp4",
	"platform.decart.ai/models-about/lucy/02.mp4": "platform.decart.ai/models-about/lucy/02.mp4",
	"platform.decart.ai/models-about/lucy/03.mp4": "platform.decart.ai/models-about/lucy/03.mp4",
	"platform.decart.ai/models/image-edit/example_1.webp": "platform.decart.ai/models/image-edit/example_1.webp",
	"platform.decart.ai/models/image-edit/example_2.webp": "platform.decart.ai/models/image-edit/example_2.webp",
	"platform.decart.ai/models/image-edit/example_3.webp": "platform.decart.ai/models/image-edit/example_3.webp",
	"platform.decart.ai/models/edit-rt/header.webp": "platform.decart.ai/models/edit-rt/header.webp",
	"platform.decart.ai/models/image-edit/example_1.webp": "platform.decart.ai/models/image-edit/example_1.webp",
	"platform.decart.ai/models/image-edit/example_2.webp": "platform.decart.ai/models/image-edit/example_2.webp",
	"platform.decart.ai/models/image-edit/example_3.webp": "platform.decart.ai/models/image-edit/example_3.webp",
	"platform.decart.ai/models/image-edit/header.webp": "platform.decart.ai/models/image-edit/header.webp",
	"platform.decart.ai/models/lucy/index.html": "platform.decart.ai/models/lucy/index.html",
	"platform.decart.ai/models/lucy-restyle/index.html": "platform.decart.ai/models/lucy-restyle/index.html",
	"platform.decart.ai/models/lucy-vton/index.html": "platform.decart.ai/models/lucy-vton/index.html",
	"platform.decart.ai/models/models-initial-state/lucy-image-edit-input-example.png": "platform.decart.ai/models/models-initial-state/lucy-image-edit-input-example.png",
	"platform.decart.ai/models/models-initial-state/lucy-image-edit-output-example.png": "platform.decart.ai/models/models-initial-state/lucy-image-edit-output-example.png",
	"platform.decart.ai/models/models-initial-state/lucy-video-edit-input-example.mp4": "platform.decart.ai/models/models-initial-state/lucy-video-edit-input-example.mp4",
	"platform.decart.ai/models/models-initial-state/lucy-video-edit-input-image-example.png": "platform.decart.ai/models/models-initial-state/lucy-video-edit-input-image-example.png",
	"platform.decart.ai/models/models-initial-state/lucy-video-edit-output-example.mp4": "platform.decart.ai/models/models-initial-state/lucy-video-edit-output-example.mp4",
	"platform.decart.ai/models/restyle-rt/example_1.webp": "platform.decart.ai/models/restyle-rt/example_1.webp",
	"platform.decart.ai/models/restyle-rt/example_2.webp": "platform.decart.ai/models/restyle-rt/example_2.webp",
	"platform.decart.ai/models/restyle-rt/example_3.webp": "platform.decart.ai/models/restyle-rt/example_3.webp",
	"platform.decart.ai/models/restyle-rt/header.webp": "platform.decart.ai/models/restyle-rt/header.webp",
	"platform.decart.ai/placeholder/lucid/LucidEdit.jpg": "platform.decart.ai/placeholder/lucid/LucidEdit.jpg",
	"platform.decart.ai/presets/albert-stylestein.jpeg": "platform.decart.ai/presets/albert-stylestein.jpeg",
	"platform.decart.ai/presets/alien.webp": "platform.decart.ai/presets/alien.webp",
	"platform.decart.ai/presets/animated.jpg": "platform.decart.ai/presets/animated.jpg",
	"platform.decart.ai/presets/anime-businessman.png": "platform.decart.ai/presets/anime-businessman.png",
	"platform.decart.ai/presets/blonde-bob.jpg": "platform.decart.ai/presets/blonde-bob.jpg",
	"platform.decart.ai/presets/capybara.webp": "platform.decart.ai/presets/capybara.webp",
	"platform.decart.ai/presets/chad-fox.png": "platform.decart.ai/presets/chad-fox.png",
	"platform.decart.ai/presets/claymation.jpg": "platform.decart.ai/presets/claymation.jpg",
	"platform.decart.ai/presets/coat.webp": "platform.decart.ai/presets/coat.webp",
	"platform.decart.ai/presets/felix-the-cat.png": "platform.decart.ai/presets/felix-the-cat.png",
	"platform.decart.ai/presets/fire.png": "platform.decart.ai/presets/fire.png",
	"platform.decart.ai/presets/grandma.png": "platform.decart.ai/presets/grandma.png",
	"platform.decart.ai/presets/grass-head.png": "platform.decart.ai/presets/grass-head.png",
	"platform.decart.ai/presets/rene-descartes.webp": "platform.decart.ai/presets/rene-descartes.webp",
	"platform.decart.ai/presets/shoulder-parrot.jpg": "platform.decart.ai/presets/shoulder-parrot.jpg",
	"platform.decart.ai/presets/slime.jpg": "platform.decart.ai/presets/slime.jpg",
	"platform.decart.ai/presets/tuxedo.webp": "platform.decart.ai/presets/tuxedo.webp",
	"platform.decart.ai/presets/unfortunate-model.jpg": "platform.decart.ai/presets/unfortunate-model.jpg",
	"platform.decart.ai/presets/vton/black-blazer.webp": "platform.decart.ai/presets/vton/black-blazer.webp",
	"platform.decart.ai/presets/vton/denim-jacket.webp": "platform.decart.ai/presets/vton/denim-jacket.webp",
	"platform.decart.ai/presets/vton/knit-sweater.webp": "platform.decart.ai/presets/vton/knit-sweater.webp",
	"platform.decart.ai/presets/vton/trench-coat.webp": "platform.decart.ai/presets/vton/trench-coat.webp",
	"platform.decart.ai/studio/index.html": "platform.decart.ai/studio/index.html",
	"platform.decart.ai/usage/index.html": "platform.decart.ai/usage/index.html",
	"use.typekit.net/af/3e8806/00000000000000007756f61b/31/a/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html": "use.typekit.net/af/3e8806/00000000000000007756f61b/31/a/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html",
	"use.typekit.net/af/3e8806/00000000000000007756f61b/31/d/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html": "use.typekit.net/af/3e8806/00000000000000007756f61b/31/d/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html",
	"use.typekit.net/af/3e8806/00000000000000007756f61b/31/l/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html": "use.typekit.net/af/3e8806/00000000000000007756f61b/31/l/index_subset_id_2_fvd_n3_v_3_c8a1a3d4.html",
	"use.typekit.net/af/4cddf5/00000000000000007756f626/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html": "use.typekit.net/af/4cddf5/00000000000000007756f626/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html",
	"use.typekit.net/af/4cddf5/00000000000000007756f626/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html": "use.typekit.net/af/4cddf5/00000000000000007756f626/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html",
	"use.typekit.net/af/4cddf5/00000000000000007756f626/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html": "use.typekit.net/af/4cddf5/00000000000000007756f626/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n7_v_3_61899e4b.html",
	"use.typekit.net/af/55171c/00000000000000007756f621/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html": "use.typekit.net/af/55171c/00000000000000007756f621/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html",
	"use.typekit.net/af/55171c/00000000000000007756f621/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html": "use.typekit.net/af/55171c/00000000000000007756f621/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html",
	"use.typekit.net/af/55171c/00000000000000007756f621/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html": "use.typekit.net/af/55171c/00000000000000007756f621/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i1_v_3_55d0e9ed.html",
	"use.typekit.net/af/777703/00000000000000007756f61c/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html": "use.typekit.net/af/777703/00000000000000007756f61c/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html",
	"use.typekit.net/af/777703/00000000000000007756f61c/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html": "use.typekit.net/af/777703/00000000000000007756f61c/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html",
	"use.typekit.net/af/777703/00000000000000007756f61c/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html": "use.typekit.net/af/777703/00000000000000007756f61c/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n1_v_3_59a24d66.html",
	"use.typekit.net/af/9b2db7/00000000000000007756f631/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html": "use.typekit.net/af/9b2db7/00000000000000007756f631/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html",
	"use.typekit.net/af/9b2db7/00000000000000007756f631/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html": "use.typekit.net/af/9b2db7/00000000000000007756f631/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html",
	"use.typekit.net/af/9b2db7/00000000000000007756f631/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html": "use.typekit.net/af/9b2db7/00000000000000007756f631/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_n4_v_3_ea2d5cd2.html",
	"use.typekit.net/af/f25102/00000000000000007756f625/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html": "use.typekit.net/af/f25102/00000000000000007756f625/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html",
	"use.typekit.net/af/f25102/00000000000000007756f625/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html": "use.typekit.net/af/f25102/00000000000000007756f625/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html",
	"use.typekit.net/af/f25102/00000000000000007756f625/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html": "use.typekit.net/af/f25102/00000000000000007756f625/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i4_v_3_0f253ba2.html",
	"use.typekit.net/af/f5c953/00000000000000007756f62f/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html": "use.typekit.net/af/f5c953/00000000000000007756f62f/31/a/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html",
	"use.typekit.net/af/f5c953/00000000000000007756f62f/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html": "use.typekit.net/af/f5c953/00000000000000007756f62f/31/d/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html",
	"use.typekit.net/af/f5c953/00000000000000007756f62f/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html": "use.typekit.net/af/f5c953/00000000000000007756f62f/31/l/index_primer_7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191_fvd_i7_v_3_37293447.html",
	"use.typekit.net/ppu4dvr.css": "use.typekit.net/ppu4dvr.css"
};
const STATIC_EXT = /\.(css|js|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|eot|webp)(\?.*)?$/;
const API_PATTERN = /\/api\//;

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE).then(function(cache) {
			var urls = Object.keys(URL_MAP).map(function(url) {
				return URL_MAP[url];
			});
			return Promise.all(
				urls.map(function(path) {
					return cache.add(path).catch(function() {});
				})
			);
		}).then(function() {
			self.skipWaiting();
		})
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(caches.keys().then(keys =>
		Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
	));
	return self.clients.claim();
});

function matchAPI(url, method, body) {
	if (isGraphQL(url) && body) {
		try {
			var parsed = JSON.parse(body);
			if (parsed.operationName) {
				var gqlKey = url + '|gql:' + parsed.operationName;
				var gqlEntry = API_MAP[gqlKey];
				if (gqlEntry && (!gqlEntry.m || gqlEntry.m === method)) return gqlEntry;
			}
		} catch (e) {}
	}
	const entry = API_MAP[url];
	if (entry && (!entry.m || entry.m === method)) return entry;
	const noQuery = url.split('?')[0].split('#')[0];
	if (noQuery !== url) {
		const e2 = API_MAP[noQuery];
		if (e2 && (!e2.m || e2.m === method)) return e2;
	}
	for (const [key, val] of Object.entries(API_MAP)) {
		if (key.includes('|gql:')) continue;
		const base = key.split('?')[0];
		if (base === noQuery && (!val.m || val.m === method)) return val;
	}
	return null;
}

function isGraphQL(url) {
	return url.includes('/graphql') || url.includes('/gql');
}

function bodyOf(e) {
	return e.b64 ? atob(e.b) : e.b;
}

function getWSMessages(url) {
	const normalized = url.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:');
	let msgs = WS_MAP[url] || WS_MAP[normalized];
	if (msgs) return msgs;
	for (const [key, val] of Object.entries(WS_MAP)) {
		if (key.replace(/^ws:/, 'http:').replace(/^wss:/, 'https:') === normalized) return val;
	}
	return null;
}

function matchURL(url) {
	const withoutQuery = url.split('?')[0].split('#')[0];
	if (URL_MAP[url]) return URL_MAP[url];
	if (URL_MAP[withoutQuery]) return URL_MAP[withoutQuery];
	for (const [key, val] of Object.entries(URL_MAP)) {
		if (key.split('?')[0].split('#')[0] === withoutQuery) return val;
	}
	return null;
}

function isHTML(url) {
	return !STATIC_EXT.test(url) && !API_PATTERN.test(url) && !url.includes('/api/');
}

self.addEventListener('fetch', event => {
	const {
		request
	} = event;
	const url = request.url;

	if (API_PATTERN.test(url) || isGraphQL(url)) {
		if (isGraphQL(url) && (request.method === 'POST' || request.method === 'PUT')) {
			event.respondWith(
				request.clone().text().then(function(body) {
					var entry = matchAPI(url, request.method, body);
					if (entry) {
						if (entry.rb && (request.method === 'POST' || request.method === 'PATCH' || request.method === 'PUT')) {
							var replay = new Request(url, {
								method: request.method,
								headers: request.headers,
								body: entry.rb
							});
							return fetch(replay)['catch'](function() {
								return new Response(bodyOf(entry), {
									status: entry.s,
									statusText: 'OK',
									headers: entry.h
								});
							});
						}
						return new Response(bodyOf(entry), {
							status: entry.s,
							statusText: 'OK',
							headers: entry.h
						});
					}
					return fetch(request)['catch'](function() {
						return new Response('', {
							status: 503
						});
					});
				})
			);
			return;
		}
		const entry = matchAPI(url, request.method, null);
		if (entry) {
			if (entry.rb && (request.method === 'POST' || request.method === 'PATCH' || request.method === 'PUT')) {
				const replay = new Request(url, {
					method: request.method,
					headers: request.headers,
					body: entry.rb
				});
				event.respondWith(
					fetch(replay).catch(() => new Response(bodyOf(entry), {
						status: entry.s,
						statusText: 'OK',
						headers: entry.h
					}))
				);
				return;
			}
			event.respondWith(new Response(bodyOf(entry), {
				status: entry.s,
				statusText: 'OK',
				headers: entry.h
			}));
			return;
		}
	}

	if (STATIC_EXT.test(url)) {
		event.respondWith(
			caches.match(request).then(cached => {
				if (cached) return cached;
				return fetch(request).then(res => {
					const copy = res.clone();
					caches.open(CACHE).then(cache => cache.put(request, copy));
					return res;
				}).catch(async () => {
					const localPath = matchURL(url);
					if (localPath) {
						const cached = await caches.match(localPath);
						if (cached) return cached;
					}
					return new Response('', {
						status: 404
					});
				});
			})
		);
		return;
	}

	if (isHTML(url)) {
		event.respondWith(
			fetch(request).then(res => {
				const copy = res.clone();
				caches.open(CACHE).then(cache => {
					if (copy.ok && copy.headers.get('content-type')?.includes('text/html')) {
						cache.put(request, copy);
					}
				});
				return res;
			}).catch(async () => {
				const cached = await caches.match(request);
				if (cached) return cached;
				const localPath = matchURL(url);
				if (localPath) {
					const localCached = await caches.match(localPath);
					if (localCached) return localCached;
					return fetch(localPath).catch(() => caches.match('/offline.html'));
				}
				return new Response('Offline', {
					status: 503
				});
			})
		);
		return;
	}

	event.respondWith(fetch(request));
});