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
