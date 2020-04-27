let base = '';

if (process.env && process.env.NODE_ENV === 'development') {
  // base = 'http://127.0.0.1:3001/rest'; // 非安全浏览器使用该链接，直接配置后端地址
  base = '/dev'; // 前端跨域使用该链接
}

export const baseUrl = base;
