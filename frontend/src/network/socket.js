import { io } from 'socket.io-client';
import { channelsActions } from '../slices/channels.js';
import { messagesActions } from '../slices/messages.js';
import store from '../slices/index.js';

const createSocket = () => io();

const initSocketEvents = (socket) => {
  socket
    .on('newChannel', (payload) => {
      store.dispatch(channelsActions.addChannel(payload));
    })
    .on('newMessage', (payload) => {
      store.dispatch(messagesActions.addMessage(payload));
    })
    .on('renameChannel', (payload) => {
      store.dispatch(channelsActions.setNewNameChannel(payload));
    })
    .on('removeChannel', (payload) => {
      store.dispatch(channelsActions.removeChannelById(payload));
    });

  return socket;
};

export const getSocket = () => {
  const socket = createSocket();
  initSocketEvents(socket);
  return socket;
};
