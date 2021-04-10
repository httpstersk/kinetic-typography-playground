/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: '/',
    public: '/',
  },
  plugins: ['snowpack-plugin-glslify'],
  routes: [],
  optimize: {},
  packageOptions: {},
  devOptions: {},
  buildOptions: {},
};
