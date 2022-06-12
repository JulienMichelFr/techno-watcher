const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');

const colors = require('tailwindcss/colors');

function withOpacityValue(variable) {
  return `var(${variable})`;
  // TODO Handle opacity values
  // ATM this does not work
  // return ({ opacityValue }) => {
  //   if (opacityValue === undefined) {
  //     return `rgb(var(${variable}))`
  //   }
  //   return `rgb(var(${variable}) / ${opacityValue})`
  // }
}

module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  theme: {
    colors: {
      ...colors,

      //#region Primary Color
      primary: withOpacityValue('--primary-color'),
      primaryLighter: withOpacityValue('--primary-lighter-color'),
      primaryDarker: withOpacityValue('--primary-darker-color'),
      textPrimary: withOpacityValue('--text-primary-color'),
      textPrimaryLighter: withOpacityValue('--text-primary-lighter-color'),
      textPrimaryDarker: withOpacityValue('--text-primary-darker-color'),
      //#endregion

      //#region Accent Color
      accent: withOpacityValue('--accent-color'),
      accentLighter: withOpacityValue('--accent-lighter-color'),
      accentDarker: withOpacityValue('--accent-darker-color'),
      textAccent: withOpacityValue('--text-accent-color'),
      textAccentLighter: withOpacityValue('--text-accent-lighter-color'),
      textAccentDarker: withOpacityValue('--text-accent-darker-color'),
      //#endregion

      //#region Warn Color
      warn: withOpacityValue('--warn-color'),
      warnLighter: withOpacityValue('--warn-lighter-color'),
      warnDarker: withOpacityValue('--warn-darker-color'),
      textWarn: withOpacityValue('--text-warn-color'),
      textWarnLighter: withOpacityValue('--text-warn-lighter-color'),
      textWarnDarker: withOpacityValue('--text-warn-darker-color'),
      //#endregion
    },
    extend: {},
  },
  plugins: [],
};
