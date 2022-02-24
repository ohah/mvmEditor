import CSS from 'csstype';

export const codeIcon = (style?:CSS.Properties) => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute("fill", "none");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("stroke", "currentColor");
  icon.style.width = "1rem";
  icon.style.height = "1rem";
  if (style !== undefined) {
    Object.keys(style).forEach((key: string) => {
      icon.style.setProperty(key, style[key]);
    });
  }
  icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />';
  return icon;
}
export const uploadIcon = (style?:CSS.Properties) => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute("fill", "none");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("stroke", "currentColor");
  icon.style.width = "1rem";
  icon.style.height = "1rem";
  if (style !== undefined) {
    Object.keys(style).forEach((key: string) => {
      icon.style.setProperty(key, style[key]);
    });
  }
  icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />';
  return icon;
}
export const sunIcon = (style?:CSS.Properties) => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute("fill", "none");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("stroke", "currentColor");
  icon.style.width = "1rem";
  icon.style.height = "1rem";
  if (style !== undefined) {
    Object.keys(style).forEach((key: string) => {
      icon.style.setProperty(key, style[key]);
    });
  }
  icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />';
  return icon;
}
export const moonIcon = (style?:CSS.Properties) => {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute("fill", "none");
  icon.setAttribute("viewBox", "0 0 24 24");
  icon.setAttribute("stroke", "currentColor");
  icon.style.width = "1rem";
  icon.style.height = "1rem";
  if (style !== undefined) {
    Object.keys(style).forEach((key: string) => {
      icon.style.setProperty(key, style[key]);
    });
  }
  icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />';
  return icon;
}