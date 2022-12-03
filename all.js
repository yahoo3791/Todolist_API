const apiUrl = `https://todoo.5xcamp.us`;
const signUpPageBtn = document.querySelector('.js-signUpPage');
const LoginPageBtn = document.querySelector('.js-loginPage');
const LoginBtn = document.querySelector('.login');
const SignUpBtn = document.querySelector('.signUp');
const loginView = document.querySelector('.loginView');
const signUpView = document.querySelector('.signUpView');
const todoListView = document.querySelector('.todoListView');

signUpPageBtn.addEventListener('click', function() {
  loginView.style.display="none";
  signUpView.style.display="block";
},false);

LoginPageBtn.addEventListener('click', function() {
  loginView.style.display="block";
  signUpView.style.display="none";
},false);

LoginBtn.addEventListener('click', function() {
  console.log(document.querySelector('.login_email').value);
  console.log(document.querySelector('.login_password').value);
},false);

SignUpBtn.addEventListener('click', function() {
  let email = document.querySelector('.signUp_email').value;
  let nickname = document.querySelector('.signUp_nickname').value;
  let password = document.querySelector('.signUp_password').value;
  let passwordConfirm = document.querySelector('.signUp_passwordConfirm').value;
  if (password !== passwordConfirm) {
    document.querySelector('.signUp_password').value = '';
    passwordConfirm = document.querySelector('.signUp_passwordConfirm').value = '';
    alert('error');
  }
  signUp(email, nickname, password);
},false);

// signUp
function signUp(email, nickname, password) {
  axios.post(`${apiUrl}/users`,{
    "user": {
      "email": email,
      "nickname": nickname,
      "password": password
    }
})
    .then( (response) => {
      if (response.data.success) {
        let email = document.querySelector('.signUp_email').value;
        let nickname = document.querySelector('.signUp_nickname').value;
        let password = document.querySelector('.signUp_password').value;
        let passwordConfirm = document.querySelector('.signUp_passwordConfirm').value;
        email = '';
        nickname = '';
        password = '';
        passwordConfirm = '';
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '註冊成功',
          showConfirmButton: false,
          timer: 1500
        })
      }
    })
    .catch( (error) => {
      let password = document.querySelector('.signUp_password').value;
      let passwordConfirm = document.querySelector('.signUp_passwordConfirm').value;
      password = '';
      passwordConfirm = '';
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: '註冊失敗',
        showConfirmButton: false,
        timer: 1500
      })
    });
console.log(email, nickname, password);
}