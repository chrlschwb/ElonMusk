module.exports = {
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        sm: "url('./assets/img/bg-sm.jpg')",
        md: "url('./assets/img/bg-md.jpg')",
      },
    },
  },
  plugins: [require('daisyui')],
};
