/**
 * 全局表单规则校验
 * @param {*} rule 
 * @param {*} value 
 * @param {*} callback 
 */

//  手机验证规则
const validatePhone = (rule, value, callback) => {
  console.log(rule);
  console.log(value);
  console.log(callback);
  const reg = /^1(3([0-35-9]\d|4[1-8])|4[14-9]\d|5([0125689]\d|7[1-79])|66\d|7[2-35-8]\d|8\d{2}|9[13589]\d)\d{7}$/
  if (!reg.test(value) && value) {
    return callback(new Error('请输入正确的电话号码'))
  } else {
    callback()
  }
}

//  邮箱验证规则
const validateEmail = (rule, value, callback) => {
  console.log(rule);
  const regS = /^([a-zA-Z]|[0-9])(\w)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
  if (!regS.test(value) && value) {
    return callback(new Error('请输入正确的邮箱'))
  } else {
    callback()
  }
}

export default {
  required: [{
    required: true,
    message: '该项不能为空',
    trigger: 'blur'
  }],
  phone: [{
    validator: validatePhone,
    trigger: ['blur', 'change']
  }],
  email: [{
    validator: validateEmail,
    trigger: ['blur', 'change']
  }]
}
