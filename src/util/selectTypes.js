// 常规图谱
export const dataTypes = [
  { value: 'REALTIME', label: 'routineAtlas.selectTypes.realtime' },
  { value: 'HISTORY', label: 'routineAtlas.selectTypes.history' },
];
export const radioTypes = [
  { value: 'general', label: 'routineAtlas.selectTypes.general' },
  { value: 'trend', label: 'routineAtlas.selectTypes.trend', funcName: 'getTrendMap', type: 'TENDENCY' },
  { value: 'waveform', label: 'routineAtlas.selectTypes.waveform', funcName: 'getWaveformMap', type: 'WAVEFORM' },
  { value: 'spectrum', label: 'routineAtlas.selectTypes.spectrum', funcName: 'getSpectrumMap', type: 'SPECTRUM' },
  { value: 'integral', label: 'routineAtlas.selectTypes.integral', funcName: 'getIntegralMap', type: 'INTEGRAL' },
  { value: 'envelope', label: 'routineAtlas.selectTypes.envelope', funcName: 'getEnvelopeMap', type: 'ENVELOPE' },
];
export const extremumTypes = [
  { value: 'specifiedWay', label: 'routineAtlas.selectTypes.specifiedWay' },
  { value: 'specifiedValue', label: 'routineAtlas.selectTypes.specifiedValue' },
];
// 用户列表-搜索选项
export const userSearchTypes = [
  { value: 'name', label: 'user.username' },
  { value: 'email', label: 'user.email' },
  { value: 'phoneNumber', label: 'user.phoneNumber' },
];
// 通道层级
export const passTypes = ['ROOT', 'PROJECT', 'FACTORY', 'WORKSHOP', 'MACHINE'];
// 数据稀释规则
export const dilutionTypes = [
  { label: 'dilution.digitDilution', value: 'VALUE' },
  { label: 'dilution.arrayDilution', value: 'ARRAY' },
];
export const intervalUnitTypes = [
  { label: 'common.second', value: 'SECOND' },
  { label: 'common.minute', value: 'MINUTE' },
  { label: 'common.hour', value: 'HOUR' },
  { label: 'common.day', value: 'DAY' },
  // { label: 'common.month', value: 'MONTH' },
];
// 报警等级
export const alarmLevels = [
  { label: 'WARN', value: 'common.WARN' },
  { label: 'ERROR', value: 'common.ERROR' },
  { label: 'OK', value: 'common.OK' },
];
// 报警确认
export const alarmVerifies = [
  { label: 'UNVERIFIED', value: 'common.UNVERIFIED' },
  { label: 'VERIFIED', value: 'common.VERIFIED' },
];
// 总貌图传感器
export const fengdianSensorNames = [
  'sensor_outter',
  'sensor_engine_free',
  'sensor_engine_inner',
  'sensor_engine_load',
  'sensor_gearbox_high',
  'sensor_gearbox_middle',
  'sensor_gearbox_low',
  'sensor_bearing_top',
];
// 横坐标单位
export const abscissaTypes = [
  { value: 'HZ', label: 'routineAtlas.frequency' },
  { value: 'order', label: 'routineAtlas.doubling' },
];
// 趋势图-倍频类型
export const trendDoublingTypes = [
  { value: '1', label: 'routineAtlas.doubling1' },
  { value: '2', label: 'routineAtlas.doubling2' },
];

// 客户列表
export const projectArr = [
  { value: 'mingyang', label: 'projectSet.mingyang' },
  { value: 'hongfeng', label: 'projectSet.hongfeng' },
  { value: 'xingang', label: 'projectSet.xingang' },
];
