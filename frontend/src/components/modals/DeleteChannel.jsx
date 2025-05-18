import Modal from 'react-bootstrap/Modal'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Button from 'react-bootstrap/Button'

import { selectAuth } from '../../slices/auth'
import { deleteChannel } from '../../slices/channels'
import { closeModal } from '../../slices/modals'

const DeleteChannel = () => {
  const { t } = useTranslation('Components', { keyPrefix: 'DeleteChannel' })
  const dispatch = useDispatch()
  const { token } = useSelector(selectAuth)
  const { channelId } = useSelector(state => state.modals)

  const handleClose = () => {
    dispatch(closeModal())
  }

  const handleDelete = () => {
    dispatch(deleteChannel({ token, channelId }))
    dispatch(closeModal())
  }

  return (
    <Modal show={true} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{t('confirm')}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t('cancel')}
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          {t('delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteChannel
