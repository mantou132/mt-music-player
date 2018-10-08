import url from 'url';
import path from 'path';
import Module from 'module';

const builtins = Module.builtinModules;
const JS_EXTENSIONS = new Set(['.js', '.mjs']);

export default function resolve(specifier, parentModuleURL = 'file://', defaultResolve) {
  console.log(specifier, parentModuleURL);
  if (builtins.includes(specifier)) {
    return {
      url: specifier,
      format: 'builtin',
    };
  }
  if (/^\.{0,2}[/]/.test(specifier) !== true && !specifier.startsWith('file:')) {
    // For node_modules support:
    return defaultResolve(specifier, parentModuleURL);
    // throw new Error(
    //   `imports must begin with '/', './', or '../'; '${specifier}' does not`);
  }
  const resolved = new url.URL(specifier, parentModuleURL);
  const ext = path.extname(resolved.pathname);
  let result = resolved.href;
  if (!JS_EXTENSIONS.has(ext)) {
    // throw new Error(
    //   `Cannot load file with non-JavaScript file extension ${ext}.`);
    result = `${resolved.href}.js`;
  }
  return {
    url: result,
    format: 'esm',
  };
}
