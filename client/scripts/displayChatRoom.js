import displayMainPage from './displayMainPage';
import updateChat from './updateChat.mjs';
import sendChat from './sendChat.mjs';
import createGameGrid from './displayGameGrid.js';
import updatePlayers from './updatePlayers.js';
import { socket } from '../main.js';

export default function displayChatRoom(room) {
  document.body.innerHTML = '';

  const chatPage = document.createElement('div');
  chatPage.classList.add('chat_page');

  // create nav element
  const navBar = document.createElement('nav');
  navBar.classList.add('nav_bar');

  const title = document.createElement('h2');
  title.innerText = 'Color Chaos';

  const roomName = document.createElement('h3');
  roomName.innerText = room;

  const leaveRoomBtn = document.createElement('button');
  leaveRoomBtn.classList.add('leave_room_btn');
  leaveRoomBtn.innerText = 'Leave Room';
  leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leave room', room, sessionStorage.getItem('user'));
    updatePlayers(room);
    displayMainPage();
  });

  // When a user leaves the page, emit event and update player list
  window.addEventListener('beforeunload', () => {
    socket.emit('leave room', room, sessionStorage.getItem('user'));
    updatePlayers(room);
  });

  navBar.append(title, roomName, leaveRoomBtn);

  // create game grid container
  const gridContainer = document.createElement('div');
  gridContainer.id = 'grid-container';
  gridContainer.classList.add('grid_container');
  createGameGrid(gridContainer);

  // create container for messages
  const chatMainSection = document.createElement('div');
  chatMainSection.classList.add('chat_main_section');

  const sendMessageContainer = document.createElement('div');
  sendMessageContainer.classList.add('send_message_container');

  const inputLabel = document.createElement('label');
  inputLabel.innerText = 'Message:';

  const inputMessage = document.createElement('input');
  inputMessage.classList.add('input_message');
  inputMessage.type = 'text';
  inputMessage.id = 'inputMessage';

  const sendMessageBtn = document.createElement('button');
  sendMessageBtn.classList.add('send_message_button');
  sendMessageBtn.id = 'sendMessageBtn';
  sendMessageBtn.innerText = 'SEND';
  sendMessageBtn.addEventListener('click', () => {
    sendChat(inputMessage, room);
    inputMessage.value = '';
  });

  sendMessageContainer.append(inputLabel, inputMessage, sendMessageBtn);

  // create chat box
  const chatBox = document.createElement('div');
  chatBox.classList.add('chat_box');

  const chatList = document.createElement('ul');
  chatList.id = 'chatList';

  // Updates the player list displayed in the UI based on the received roomConnectedUsers object.
  updatePlayers(room);


  chatBox.appendChild(chatList);

  // add all elements to chatPage
  chatMainSection.append(sendMessageContainer, chatBox);
  chatPage.append(navBar, gridContainer, chatMainSection);

  console.log('chat rum:', room);
  socket.on('chat', (arg) => {
    console.log('chat tillbaka:', arg);
    updateChat(arg);
  });

  document.body.appendChild(chatPage);
}
