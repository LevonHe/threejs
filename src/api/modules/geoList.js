import request from '@/plugin/axios/index';

// 查询位置列表
export const getGeoList = () =>
  request({
    url: `/api/v1/geoList`,
    method: 'GET',
  });

// 查询sensor列表
export const getSensors = () =>
  request({
    url: '/api/v1/sensors',
    method: 'GET',
  });

// 查询config
export const getConfig = () =>
  request({
    url: '/api/v1/config',
    method: 'GET',
  });
