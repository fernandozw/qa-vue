const project = {
  add: { url: '/project/addProject', type: 'post', param: { name: '' } },
  update: {
    url: '/project/updateProject',
    type: 'post',
    param: { id: null, name: '' }
  },
  delete: { url: '/project/deleteProject', type: 'post', param: { id: null } },
  projectList: {
    url: '/project/projectList',
    type: 'post',
    param: { id: null, name: '', pageNum: 1, pageSize: 10 }
  },
  getProject: {
    url: '/project/getProjectById',
    type: 'post',
    param: { id: null }
  }
};

// 脚本的url地址
const script = {
  add: {
    url: '/script/addScript',
    type: 'post',
    param: {
      name: '',
      owner: '',
      content: '',
      projectId: '',
      isDone: null,
      type: ''
    }
  },
  update: {
    url: '/script/updateScript',
    type: 'post',
    param: {
      id: null,
      name: '',
      owner: '',
      content: '',
      projectId: '',
      isDone: null,
      type: ''
    }
  },
  getScriptById: {
    url: '/script/getScriptById',
    type: 'post',
    param: {
      id: null
    }
  },
  delete: { url: '/script/deleteScript', type: 'post', param: { id: null } },
  scriptList: {
    url: '/script/scriptList',
    type: 'post',
    param: {
      id: null,
      name: '',
      owner: '',
      projectId: null,
      isDone: null,
      type: '',
      pageNum: 1,
      pageSize: 10
    }
  },
  selectList: { url: '/script/selectList', type: 'get', param: {} },
  formatScript: {
    url: '/script/formatScript',
    type: 'post',
    param: { script: '' }
  }
};
// 方法的url地址
const method = {
  add: {
    url: '/method/addMethods',
    type: 'post',
    param: [
      { scriptId: null, methodLabel: '', methodName: '', existParam: null }
    ]
  },
  update: {
    url: '/method/updateMethods',
    type: 'post',
    param: [{ id: null, scriptId: null, methodName: '', methodLabel: '' }]
  },
  getMethods: {
    url: '/method/getMethods',
    type: 'post',
    param: { id: null, content: '' }
  }
};
// 参数的url地址
const param = {
  add: {
    url: '/param/addParams',
    type: 'post',
    param: [
      { scriptId: null, methodLabel: '', methodName: '', existParam: null }
    ]
  },
  update: {
    url: '/param/updateParams',
    type: 'post',
    param: [{ id: null, scriptId: null, methodName: '', methodLabel: '' }]
  },
  getParams: {
    url: '/param/getParams',
    type: 'post',
    param: { id: null, scriptId: null, methodName: '', existParam: null }
  }
};
const jar = {
  delete: {
    url: '/package/deleteJar',
    type: 'post',
    param: { fileList: [] }
  },
  list: { url: '/package/jarList', type: 'get', param: {} },
  upload: {
    url: '/package/uploadJar',
    type: 'post',
    param: { uploadJar: null }
  }
};
// 执行器的url地址
const execute = {
  execute: {
    url: '/execute/executeMethod',
    type: 'post',
    param: { scriptId: ' ', method: '', param: [] }
  }
};
// 数据源管理
const dataSource = {
  add: {
    url: '/dataSource/addDataSource',
    type: 'post',
    param: {
      name: '',
      type: '',
      url: '',
      port: '',
      user: '',
      password: '',
      tables: ''
    }
  },
  update: {
    url: '/dataSource/updateDataSource',
    type: 'post',
    param: {
      id: null,
      name: '',
      type: '',
      url: '',
      port: '',
      user: '',
      password: '',
      tables: ''
    }
  },
  delete: {
    url: '/dataSource/deleteDataSource',
    type: 'post',
    param: { id: null }
  },
  list: {
    url: '/dataSource/dataSourceList',
    type: 'post',
    param: { name: '', type: '' }
  },
  typeList: {
    url: '/dataSource/typeList',
    type: 'get',
    param: {}
  },
  detail: {
    url: '/dataSource/getDataSource',
    type: 'post',
    param: { id: null }
  },
  dataSourceListForScript: {
    url: '/dataSource/dataSourceListForScript',
    type: 'post',
    param: { name: '', type: '' }
  },
  tableList: {
    url: '/dataSource/tableList',
    type: 'post',
    param: { id: null }
  }
};

const widgetList = [
  { label: '文本输入', value: 'text' },
  { label: '年(yyyy)', value: 'yyyy' },
  { label: '年月(yyyyMM)', value: 'yyyyMM' },
  { label: '年月日(yyyyMMdd)', value: 'yyyyMMdd' },
  { label: '年月日(yyyy-MM-dd)', value: 'yyyy-MM-dd' },
  { label: '年月日时分秒(yyyy-MM-dd HH:mm:ss)', value: 'yyyy-MM-dd HH:mm:ss' }
];

export { script, execute, project, method, param, jar, widgetList, dataSource };
