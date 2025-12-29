export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/contacts/contacts',
    'pages/personal/personal',
    'pages/checkin/checkin',
    'pages/login/login',
    'pages/schedule/schedule',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  lazyCodeLoading: 'requiredComponents',
  tabBar: {
    custom: true,
    backgroundColor: '#ffffff',
    list: [
      {
        pagePath: 'pages/index/index',
        text: ''
      },
      {
        pagePath: 'pages/contacts/contacts',
        text: ''
      },
      {
        pagePath: 'pages/checkin/checkin',
        text: ''
      },
      {
        pagePath: 'pages/schedule/schedule',
        text: ''
      },
      {
        pagePath: 'pages/personal/personal',
        text: ''
      },
    ]
  }
})
