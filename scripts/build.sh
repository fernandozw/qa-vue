 echo -e "开始构建项目:"
 workspace=/usr/project/qa_vue
 project_dir=qa_vue
 dist_dir=/usr/nginx/html/
 cd ${workspace}
 rm -rf ${project_dir}
 git clone ssh://git@git.qiyuesuo.me:7999/tes/qa_vue.git
 cd ${project_dir}
 cnpm install --registry=https://registry.npm.taobao.org
 npm run build
 echo -e "\033[42;31m构建完成!\033[0m"
 echo -e "\033[42;31m删除旧dist文件!\033[0m"
 rm -rf ${dist_dir}dist
 mv dist ${dist_dir}
 echo -e "\033[42;31m dist文件替换完成!\033[0m"
