import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender:{
			entries:[
				"/",
				"/abrazos",
				"/abrazos/historial",
				"/bebes",
				"/bebes/1",
				"/bebes/historia/1",
				"/inicio",
				"/login",
				"/schelude",
				"/test",
				"/users",
				"/abrazos/abrazadora/1",
				"/abrazos/bebe/1"]
		}
	}
};

export default config;
