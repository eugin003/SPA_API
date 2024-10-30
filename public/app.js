document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
});

async function loadUsers() {
  const response = await fetch('/api/users');
  const users = await response.json();
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  users.forEach(user => {
    const userDiv = document.createElement('div');
    userDiv.className = 'user';
    userDiv.innerHTML = `
      <span>${user.name} (${user.email})</span>
      <button onclick="deleteUser(${user.id})">Delete</button>
      <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Edit</button>
    `;
    userList.appendChild(userDiv);
  });
}

async function addUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email })
  });

  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  loadUsers();
}

async function deleteUser(id) {
  await fetch(`/api/users/${id}`, {
    method: 'DELETE'
  });

  loadUsers();
}

function editUser(id, name, email) {
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const addButton = document.querySelector('#user-form button');

  nameField.value = name;
  emailField.value = email;
  addButton.textContent = 'Update User';
  addButton.onclick = async () => {
    await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: nameField.value, email: emailField.value })
    });

    nameField.value = '';
    emailField.value = '';
    addButton.textContent = 'Add User';
    addButton.onclick = addUser;
    loadUsers();
  };
}
