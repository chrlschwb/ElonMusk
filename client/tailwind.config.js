module.exports = {
  content: ['./index.html', './src/**/*.{tsx,ts}'],
  theme: {
    extend: {
      backgroundImage: {
        sm: "url('./assets/img/bg-sm.jpg')",
        md: "url('./assets/img/bg-md.jpg')",
      },
      boxShadow: {
        'outline-red': '0 0 0 3px rgba(239,68,68,.5)',
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3), 0 20px 30px -10px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [require('daisyui')],
};
