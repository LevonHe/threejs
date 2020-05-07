export default {
  namespaced: true,
  state: {
    permission: {
      id: '367358351169100000',
      name: 'ViewPermission',
      permissions: [
        {
          id: '367358351169110000',
          name: 'Chapter1',
          url: null,
          icon: 's-home',
          permissions: [
            {
              id: '1',
              name: 'Experience',
              url: './experience',
              icon: null,
            },
            {
              id: '2',
              name: 'Light',
              url: './light',
              icon: null,
            },
            {
              id: '3',
              name: 'Material',
              url: './material',
              icon: null,
            },
            {
              id: '4',
              name: 'Geometry',
              url: './geometry',
              icon: null,
            },
          ],
        },
        {
          id: '367358351169140000',
          name: 'Chapter2',
          url: null,
          icon: 's-home',
          permissions: [
            {
              id: '1',
              name: 'HighGeo',
              url: './highGeo',
              icon: null,
            },
            {
              id: '2',
              name: 'BinaryOperation',
              url: './binaryOperation',
              icon: null,
            },
          ],
        },
        {
          id: '367358351169160000',
          name: 'Chapter3',
          url: './chapter3',
          icon: 's-home',
        },
      ],
    },
  },
  mutations: {
    PERMISSION(state, permission) {
      state.permission = permission;
    },
  },
};
