// components/ModalManager.jsx
import AddChannel from './modals/AddChannel'
import DeleteChannel from './modals/DeleteChannel'
import RenameChannel from './modals/RenameChannel'

const modalComponents = {
  addChannel: AddChannel,
  deleteChannel: DeleteChannel,
  renameChannel: RenameChannel,
}

const ModalManager = ({ modalType, onClose, modalData }) => {
  if (!modalType) return null

  const CurrentModal = modalComponents[modalType]
  
  return (
    <CurrentModal
      handleSetState={onClose}
      modalState={modalType}
      extraData={modalData}
    />
  )
}

export default ModalManager
