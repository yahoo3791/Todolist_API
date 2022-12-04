const apiUrl = `https://todoo.5xcamp.us`;
const signUpPageBtn = document.querySelector('.js-signUpPage');
const LoginPageBtn = document.querySelector('.js-loginPage');
const LogOutPageBtn = document.querySelector('.LogOut');
const LoginBtn = document.querySelector('.login');
const SignUpBtn = document.querySelector('.signUp');
const loginView = document.querySelector('.loginView');
const signUpView = document.querySelector('.signUpView');
const todoListView = document.querySelector('.todoListView');
const addTodoBtn = document.querySelector('.addTodoBtn');
const todoList_item = document.querySelector('.todoList_item');
let todoData = [];

signUpPageBtn.addEventListener('click', function() {
  loginView.style.display="none";
  signUpView.style.display="block";
},false);

LoginPageBtn.addEventListener('click', function() {
  loginView.style.display="block";
  signUpView.style.display="none";
},false);

LoginBtn.addEventListener('click', function() {
  let email = document.querySelector('.login_email').value;
  let password = document.querySelector('.login_password').value;
  signIn(email, password);
},false);

LogOutPageBtn.addEventListener('click', function(e) {
  e.preventDefault();
  localStorage.removeItem('token');
  todoListView.style.display = "none";
  loginView.style.display = "block";
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

addTodoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  let content = document.querySelector('.js-todoContent').value;
  addTodo(content);
},false);

todoList_item.addEventListener('click', function(e) {
  let id = e.target.closest("li").dataset.id;
  if (e.target.classList.contains("js-deleteTodo")) {
    const token = localStorage.getItem('token');
    axios.defaults.headers.common["Authorization"] = token;
    axios.delete(`${apiUrl}/todos/${id}`)
    .then((response) => {
      if (response.data.message === '已刪除') {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '刪除成功',
          showConfirmButton: false,
          timer: 1000
        })
        init();
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: '刪除失敗',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }
},false);

function signUp(email, nickname, password) {
  axios.post(`${apiUrl}/users`,{
    "user": {
      "email": email,
      "nickname": nickname,
      "password": password
    }
})
    .then( (response) => {
      if (response.data.message === '註冊成功') {
        document.querySelector('.signUp_email').value = '';
        document.querySelector('.signUp_nickname').value = '';
        document.querySelector('.signUp_password').value = '';
        document.querySelector('.signUp_passwordConfirm').value = '';
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
      document.querySelector('.signUp_password').value = '';
      document.querySelector('.signUp_passwordConfirm').value = '';
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: '註冊失敗',
        showConfirmButton: false,
        timer: 1500
      })
    });
}

function signIn(email, password) {
  axios.post(`${apiUrl}/users/sign_in`,{
    "user": {
      "email": email,
      "password": password
    }
  })
  .then( (response) => {
    if (response.data.message) {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '登入成功',
        showConfirmButton: false,
        timer: 1000
      })
      loginView.style.display = "none";
      todoListView.style.display = "block";
      localStorage.setItem('token', response.headers.authorization);
      let { nickname } = response.data;
      document.querySelector('.todo_sm').innerText = nickname;
      init();
    }
  })
  .catch( (error) => {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: '登入失敗',
      showConfirmButton: false,
      timer: 1000
    })
  })
}

function addTodo(content) {
  console.log(content);
  if (content === ''){return}
  const token = localStorage.getItem('token');
  axios.defaults.headers.common["Authorization"] = token;
  console.log(token);
  axios.post(`${apiUrl}/todos`, {
    "todo": {
      "content": content
    },
  })
  .then((response) => {
    console.log(response);
    if (response.data !== '') {
      document.querySelector('.js-todoContent').value = '';
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: '新增成功',
        showConfirmButton: false,
        timer: 1000
      })
      init();
    }
  })
  .catch((error) => {
    console.log(error);
  })
}

function init() {
  const token = localStorage.getItem('token');
  axios.defaults.headers.common["Authorization"] = token;
  axios.get(`${apiUrl}/todos`)
  .then((response) => {
    todoData = response.data.todos;
    let str = '';
    todoData.forEach((item) => {
      str += 
        `<li name="checkboxs" data-id="${item.id}" data-time="${item.completed_at}">
        <input
          class="todoList_input"
          type = "checkbox"
          value = "true"
        >
          <span>${item.content}</span>
        <a href="#">
          <i class="fa fa-pencil js-editTodo"></i>
          <i class="fa fa-trash js-deleteTodo" style="margin-left:10px"></i>
        </a>
      </li>`;
    })
    document.querySelector('.todoList_item').innerHTML = str ;
  })
  .catch((error) => {
    console.log(error);
  })
}