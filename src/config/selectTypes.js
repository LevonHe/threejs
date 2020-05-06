export const basicLightArr = [
  {
    value: 'AmbientLight',
    label: 'AmbientLight 环境光',
    content: '基本光源，光源颜色会叠加到物体的颜色上',
  },
  {
    value: 'PointLight',
    label: 'PointLight 点光源',
    content: '点光源，从一点向空间所有方向发射光线，光强不会衰减，不能创建阴影',
  },
  {
    value: 'SpotLight',
    label: 'SpotLight 聚光灯',
    content: '聚光灯，可以投射阴影，可以设置光强随距离增加而衰减',
  },
  {
    value: 'DirectionalLight',
    label: 'DirectionalLight 平行光',
    content: '平行光，类似太阳光，可以创建阴影',
  },
];

export const specialLightArr = [
  {
    value: 'HemisphereLight',
    label: 'HemisphereLight 半球光光源',
    content:
      '可以为户外场景创建更加贴近自然的光照效果，用来模拟大气散射和其他物体的反射光线，比DirectionalLight和AmbientLight的配合更加自然',
  },
  {
    value: 'RectAreaLight',
    label: 'RectAreaLight 区域光源',
    content:
      '长方形发光区域，需要额外引入RectAreaLightUniformsLib，只有MeshStandardMaterial和MeshPhysicalMaterial材质能接收区域光线',
  },
  {
    value: 'LensFlare',
    label: 'LensFlare 镜头光晕',
    content: '直接朝着一个非常明亮的光源拍照，就会出现镜头光源的效果',
  },
];

export const materialArr1 = [
  {
    value: 'MeshBasicMaterial',
    label: 'MeshBasicMaterial 网格基础材质',
    content: '基础材质，用于给几何体赋予一种简单的颜色，可显示几何体的线框',
  },
  {
    value: 'MeshNormalMaterial',
    label: 'MeshNormalMaterial 网格法向材质',
    content: '一种简单的材质，根据法向向量计算物体表面的颜色',
  },
];

export const materialArr2 = [
  {
    value: 'MeshLambertMaterial',
    label: 'MeshLambertMaterial 网格Lambert材质',
    content: '一种考虑光照影响的材质，用于创建暗淡的、不光亮的物体',
  },
  {
    value: 'MeshPhoneMaterial',
    label: 'MeshPhoneMaterial 网格Phone材质',
    content: '一种考虑光照影响的材质，用于创建光亮的物体',
  },
];

export const materialArr3 = [
  {
    value: 'LineBasicMaterial',
    label: 'LineBasicMaterial 直线基础材质',
    content: '这种材质可以用于THREE.Line几何体，用于创建着色的直线',
  },
  {
    value: 'LineDashMaterial',
    label: 'LineDashMaterial 虚线材质',
    content: '与LineBasicMaterial一样，但允许创建出一种虚线的效果',
  },
];

export const geometryArr = [
  {
    value: 'CircleGeometry',
    label: '圆形',
    content: '',
  },
  {
    value: 'RingGeometry',
    label: '环形',
    content: '',
  },
  {
    value: 'PlaneGeometry',
    label: '平面',
    content: '',
  },
  {
    value: 'ShapeGeometry',
    label: '任意图形',
    content: '',
  },
  {
    value: 'BoxGeometry',
    label: '长方体',
    content: '',
  },
  {
    value: 'SphereGeometry',
    label: '球体',
    content: '',
  },
  {
    value: 'CylinderGeometry',
    label: '圆柱体',
    content: '',
  },
  {
    value: 'TorusGeometry',
    label: '圆环',
    content: '',
  },
  {
    value: 'TorusKnotGeometry',
    label: '环状扭结',
    content: '',
  },
  {
    value: 'PolyhedronGeometry',
    label: '多面体',
    content: '',
  },
  {
    value: 'IcosahedronGeometry',
    label: '二十面体',
    content: '',
  },
  {
    value: 'OctahedronGeometry',
    label: '八面体',
    content: '',
  },
  {
    value: 'TetraHedronGeometry',
    label: '四面体',
    content: '',
  },
  {
    value: 'DodecahedronGeometry',
    label: '十二面体',
    content: '',
  },
  {
    value: 'ConvexGeometry',
    label: '凸面体',
    content: '',
  },
  {
    value: 'LatheGeometry',
    label: '扫描面',
    content: '',
  },
  {
    value: 'ExtrudeGeometry',
    label: '拉伸几何体',
    content: '',
  },
  {
    value: 'TubeGeometry',
    label: '管状体',
    content: '',
  },
  {
    value: 'ParametricGeometry',
    label: '参数几何体',
    content: '',
  },
  {
    value: 'TextGeometry',
    label: '文本几何体',
    content: '',
  },
];
