const fs = require('fs');
const path = require('path');

let themeFolder = path.join(__dirname, '../themes');

module.exports = {
  install(less, pluginManager, functions) {
    const themeContext = {};
    pluginManager.addPreProcessor(new ThemePreProcessor(less, themeContext));
    pluginManager.addPostProcessor(new ThemePostProcessor(less, themeContext));
  }
};

class ThemePreProcessor {
  constructor(less, themeContext) {
    this._less = less;
    this._themeContext = themeContext;
  }

  process(src, extra) {
    if (extra.fileInfo.rootFilename !== extra.fileInfo.filename) {
      return src;
    }

    const files = fs.readdirSync(themeFolder);

    files.forEach(file => {
      const themeSrc = fs.readFileSync(path.join(themeFolder, file)).toString();
      const themeName = path.basename(file, '.less');

      this._less.parse(
        src + themeSrc,
        { javascriptEnabled: true, paths: extra.context.paths },
        (err, root, imports, options) => {
          if (err) {
            console.log(err);
          } else {
            try {
              const parseTree = new this._less.ParseTree(root, imports);
              this._themeContext[themeName] = parseTree.toCSS(options).css;
            } catch (err) {
              console.log(err);
            }
          }
        }
      );
    });

    return src;
  }
}


class ThemePostProcessor {
  constructor(less, themeContext) {
    this.less = less;
    this.timestamp = Date.now();
    this.themeContext = themeContext;
  }

  process(_, extra) {
    const colorsPerTheme = this.removeColorsThatAreTheSameInEachTheme(this.findAllColorsForEachTheme());
    const themeRules = this.createThemeRules(colorsPerTheme);
    const css = this.replaceColorsWithCssVars(colorsPerTheme);

    return css + themeRules;
  }

  replaceColorsWithCssVars(colorsPerTheme) {
    // We only need one theme because once the colors are replaced with
    // css vars the resulting css will all be the same for each theme
    const firstThemeName = Object.keys(colorsPerTheme)[0];
    const themeColors = colorsPerTheme[firstThemeName];
    const length = themeColors.length;
    let css = this.themeContext[firstThemeName];

    for (let i = length - 1; i >= 0; i--) {
      const color = themeColors[i];
      const cssVar = `var(${ this.createCssVar(i) })`;
      css = css.substring(0, color.index) + cssVar + css.substring(color.index + color.color.length);
    }

    return css;
  }

  createThemeRules(colorsPerTheme) {
    const themeColorEntries = Object.entries(colorsPerTheme);

    return themeColorEntries
      .map(([themeName, colors]) => {
        const declarations = colors
          .map((color, i) => `${ this.createCssVar(i) }: ${ color.color };`)
          .join('');

        return `.theme-${ themeName }{${ declarations }}`;
      })
      .join('\n');
  }

  createCssVar(index) {
    return `--c-${ this.timestamp }-${ index }`;
  }

  removeColorsThatAreTheSameInEachTheme(colorsPerTheme) {
    const themeNames = Object.keys(colorsPerTheme);
    const themeColors = Object.values(colorsPerTheme);
    // This is assuming all themes have the same number of colors
    const length = themeColors[0].length;

    const filteredColorsPerTheme = {};
    themeNames.forEach(themeName => filteredColorsPerTheme[themeName] = []);

    for (let i = 0; i < length; i++) {
      let allSame = true;
      let previous = null;

      for (let colors of themeColors) {
        const current = colors[i].color;
        if (previous !== null && previous !== current) {
          allSame = false;
          break;
        }
        previous = current;
      }

      if (!allSame) {
        themeNames.forEach(themeName => {
          filteredColorsPerTheme[themeName].push(colorsPerTheme[themeName][i]);
        })
      }
    }

    return filteredColorsPerTheme;
  }

  findAllColorsForEachTheme() {
    const colorsPerTheme = {};

    for (let [themeName, css] of Object.entries(this.themeContext)) {
      const matches = [];
      const regexColor = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))|(black|silver|gray|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|magenta|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|rebeccapurple|transparent)/gi;
      let match;
      while (match = regexColor.exec(css)) {
        matches.push({
          color: match[0],
          index: match.index
        });
      }
      colorsPerTheme[themeName] = matches;
    }

    return colorsPerTheme;
  }
}
