// pages/Main.jsx
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { fetchChannels } from '../slices/channels'
import { authActions, getStoredUser } from '../slices/auth'
import { fetchMessages } from '../slices/messages'
import { ChannelMessages, InputMessage } from '../components/Chat'
import Channels from '../components/Channels'
import ModalManager from '../components/ModalManager'
import PlusIcon from '../assets/PlusIcon'

const Main = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const userAuthInfo = getStoredUser()
    if (userAuthInfo) {
      dispatch(authActions.initAuth())
      dispatch(fetchChannels(userAuthInfo.token))
        .then((res) => {
          if (!res.error) {
            dispatch(fetchMessages(userAuthInfo.token))
          } else if (res.error.code === 'ERR_BAD_REQUEST') {
            dispatch(authActions.removeAuth())
          }
        })
    }
  }, [dispatch])

  const { t } = useTranslation('Components', { keyPrefix: 'Main.Chat' })
  const [modalVariant, setShowModal] = useState(false)
  const [idModalChannel, setIdModalChannel] = useState(null)

  const handleAddModal = () => {
    setShowModal('addChannel')
  }

  const channelsModals = id => ({
    handleDeleteChannel: () => {
      setIdModalChannel(id)
      setShowModal('deleteChannel')
    },
    handleRenameChannel: () => {
      setIdModalChannel(id)
      setShowModal('renameChannel')
    },
  })

  return (
    <>
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>{t('channels')}</b>
              <button
                type="button"
                className="p-0 text-primary btn btn-group-vertical channel-button"
                onClick={handleAddModal}
                aria-label={t('aria.addChannel')}
              >
                <PlusIcon />
                <span className="visually-hidden">{t('addButton')}</span>
              </button>
            </div>
            <Channels channelsModals={channelsModals} />
          </div>
          <div className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <ChannelMessages />
              <InputMessage />
            </div>
          </div>
        </div>
      </div>
      <ModalManager
        modalType={modalVariant}
        onClose={() => setShowModal(false)}
        modalData={idModalChannel}
      />
    </>
  )
}

export default Main
