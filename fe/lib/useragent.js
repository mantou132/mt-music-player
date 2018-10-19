const names = [
  'opera',
  'konqueror',
  'firefox',
  'chrome',
  'epiphany',
  'safari',
  'msie',
  'trident',
  'curl',
  'maxthon',
];
function getVersion(str, name) {
  let n = name;
  if (name === 'safari' || !name) {
    n = 'version';
  }
  const m = str.match(new RegExp(`${n}[\\/ ]([\\d\\w\\.]+)`, 'i')) || str.match(/rv:([\d\w.]+)/i);
  return m && m.length > 1 ? m[1] : '';
}
function getName(ua) {
  const str = ua.toLowerCase();
  for (let i = 0, len = names.length; i < len; i += 1) {
    if (str.indexOf(names[i]) !== -1) {
      return names[i] === 'trident' ? 'msie' : names[i];
    }
  }
  return '';
}

function getPlatform(ua) {
  const str = ua.toLowerCase();
  const isAndroid = str.includes('android');
  const isIOS = str.includes('iphone') || str.includes('ipad');
  const isDesktop = !isAndroid && !isIOS;
  const isWeiXin = str.includes('micromessenger');
  const isQQ = str.includes('qq');
  const isSogou = str.includes('SogouMobileBrowser');
  const isUC = str.includes('UCBrowser');
  return {
    get isAndroid() {
      return localStorage.current_platform
        ? localStorage.current_platform === 'android'
        : isAndroid;
    },
    get isIOS() {
      return localStorage.current_platform ? localStorage.current_platform === 'ios' : isIOS;
    },
    isHomeScreenAPP:
      window.location.search.includes('utm_source=web_app_manifest')
      || window.location.search.includes('utm_source=react_native_app')
      || Math.min(
        // ios `outerHeight` return 0
        // Android `outerHeight === innerHeight`
        Math.abs(window.screen.height - window.innerHeight),
        Math.abs(window.screen.width - window.innerHeight),
      ) < (isIOS ? 30 : 80),
    isDesktop,
    isWeiXin,
    isQQ,
    isSogou,
    isUC,
    value: isAndroid ? 'android' : isIOS && 'ios',
  };
}

export const agentPlatform = getPlatform(navigator.userAgent);
export const agentName = getName(navigator.userAgent);
export const agentVersion = getVersion(navigator.userAgent, agentName);
