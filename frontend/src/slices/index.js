import { configureStore } from '@reduxjs/toolkit';
import auth from './auth.js';
import channels from './channels.js';
import messages from './messages.js';
import toast from './toast.js';

export default configureStore({
  reducer: {
    auth,
    channels,
    messages,
    toast,
  },
  preloadedState: {
    channels: {
      idSelectedChannel: '1',
      entities: {
        1: {
          id: '1',
          name: 'general',
          removable: false,
        },
      },
    },
  },
});
