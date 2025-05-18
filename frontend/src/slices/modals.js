// slices/modals.js
import { createSlice } from '@reduxjs/toolkit'

const modalsSlice = createSlice({
  name: 'modals',
  initialState: {
    modalType: null,
    channelId: null,
  },
  reducers: {
    openModal: (state, { payload }) => {
      state.modalType = payload.type
      state.channelId = payload.id || null
    },
    closeModal: (state) => {
      state.modalType = null
      state.channelId = null
    },
  },
})

export const { openModal, closeModal } = modalsSlice.actions
export const selectModal = (state) => state.modals
export default modalsSlice.reducer
