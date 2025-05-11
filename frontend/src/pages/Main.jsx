import {
  useEffect, useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { fetchChannels } from '../slices/channels'
import { authActions, selectAuth } from '../slices/auth'
import { fetchMessages } from '../slices/messages'
import AddChannel from '../components/modals/AddChannel'
import DeleteChannel from '../components/modals/DeleteChannel'
import RenameChannel from '../components/modals/RenameChannel'
import { ChannelMessages, InputMessage } from '../components/Chat'
import Channels from '../components/Channels'
import { pages as pagesRoutes } from '../utils/routes'

const Main = () => {
  const navigator = useNavigate()
  const authSliceInfo = useSelector(selectAuth)
  const dispatch = useDispatch()
  useEffect(() => {
    if (!authSliceInfo.token) {
      const userAuthInfo = JSON.parse(localStorage.getItem('user'))
      if (!userAuthInfo) {
        navigator(pagesRoutes.login())
      } 
      else {
        dispatch(fetchChannels(userAuthInfo.token))
          .then((res) => {
            if (!res.error) {
              dispatch(authActions.setAuth(userAuthInfo))
              dispatch(fetchMessages(userAuthInfo.token))
            } 
            else if (res.error.code === 'ERR_BAD_REQUEST') {
              navigator(pagesRoutes.login())
              localStorage.removeItem('user')
              dispatch(authActions.removeAuth())
            }
          })
      }
    }
  }, [dispatch, navigator, authSliceInfo])
  const { t } = useTranslation('Components', { keyPrefix: 'Main.Chat' })
  const [modalVariant, setShowModal] = useState(false)
  const [idModalChannel, setIdModalChannel] = useState(null)

  const modals = {
    addChannel: AddChannel,
    deleteChannel: DeleteChannel,
    renameChannel: RenameChannel,
  }

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

  const CurrentModal = modals[modalVariant]

  if (authSliceInfo.token) {
    return (
      <>
        <div className="container h-100 my-4 overflow-hidden rounded shadow">
          <div className="row h-100 bg-white flex-md-row">
            <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
              <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
                <b>
                  {
                    t('channels')
                  }
                </b>
                <button
                  type="button"
                  className="p-0 text-primary btn btn-group-vertical channel-button"
                  onClick={handleAddModal}
                  aria-label={t('aria.addChannel')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                    <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                  </svg>
                  <span className="visually-hidden">
                    {
                      t('addButton')
                    }
                  </span>
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
        {
          modalVariant
            ? (
                <CurrentModal
                  handleSetState={setShowModal}
                  modalState={modalVariant}
                  extraData={idModalChannel}
                />
              )
            : null
        }
      </>
    )
  }
  return null
}

export default Main
