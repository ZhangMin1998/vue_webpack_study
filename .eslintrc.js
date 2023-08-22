module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/vue3-essential", "eslint:recommended"],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile : false
  },
  rules: {
    "no-var": 2, // 不能使用 var 定义变量
    semi: ['error', 'never']
  },
}