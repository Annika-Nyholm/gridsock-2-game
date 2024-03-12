import createPopup from './lib/createPopup.mjs';
import displayMainPage from './displayMainPage.js';

export default function saveNewUser(name, email, password) {
  const sendUser = {
    name: name,
    email: email,
    password: password,
  };
  console.log(sendUser);

  fetch('http://localhost:3000/users/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sendUser),
  })
    .then((res) => res.json())
    .then((data) => {
      const newUser = data.newUser;
      if (newUser.userName && newUser.UUID) {
        localStorage.setItem('user', newUser.userName);
        localStorage.setItem('userId', newUser.UUID);
        displayMainPage();
      } else {
        createPopup(data.message);
      }
    });
}