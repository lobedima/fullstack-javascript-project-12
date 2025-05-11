import { useEffect, useRef, useState } from 'react'
import leo from 'leo-profanity'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import { selectMessages, sendMessage } from '../slices/messages'
import { selectCurrentChannel, selectCurrentChannelId } from '../slices/channels'
import { selectAuth } from '../slices/auth'

export const ChannelMessages = () => {
  const { t } = useTranslation('Components', { keyPrefix: 'ChannelMessages' })

  const listEl = useRef(null)
  const currentChannel = useSelector(selectCurrentChannel)
  const messages = useSelector(selectMessages)
  useEffect(() => {
    if (currentChannel) listEl.current.scrollTo(1, listEl.current.scrollHeight)
  }, [currentChannel])

  if (!currentChannel) return null
  return (
    <>
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            {`# ${leo.clean(currentChannel.name)}`}
          </b>
        </p>
        <span className="text-muted">
          {`${messages.length} ${t('Header.messagesCount.messages', { count: messages.length })}`}
        </span>
      </div>
      <div id="messages-box" className="chat-messages overflow-auto px-5" ref={listEl}>
        {messages.length > 0
          ? messages.map(({ body, username, id }) => (
              <div className="text-break mb-2" key={id}>
                <b>{username}</b>
                {`: ${leo.clean(body)}`}
              </div>
            ))
          : null}
      </div>
    </>
  )
}

export const InputMessage = () => {
  const { t } = useTranslation('Components', { keyPrefix: 'Main' })
  const dispatch = useDispatch()
  const inputContainerEl = useRef(null)
  const [value, setValue] = useState('')
  const currentChannelId = useSelector(selectCurrentChannelId)
  const authData = useSelector(selectAuth)
  const handlerSendMessage = (btnEvent) => {
    btnEvent.preventDefault()
    if (value === '') return
    const message = {
      body: value,
      channelId: currentChannelId,
      username: authData.username,
    }
    dispatch(sendMessage({
      token: authData.token,
      messageObj: message,
    }))
    setValue('')
    const messagesContainerEl = inputContainerEl.current.previousSibling
    messagesContainerEl
      .scrollTo(0, messagesContainerEl.scrollHeight)
  }
  return (
    <div className="mt-auto px-5 py-3" ref={inputContainerEl}>
      <Form
        className="py-1 border rounded-2"
        onSubmit={handlerSendMessage}
      >
        <InputGroup>
          <Form.Control
            name="body"
            placeholder={t('InputMessage.enterMessage')}
            className="border-0 p-0 ps-2"
            value={value}
            aria-label={t('InputMessage.aria.enterMessage')}
            onChange={(e) => {
              e.preventDefault()
              setValue(e.target.value)
            }}
          />
          <Button
            variant="vertical"
            type="submit"
            disabled={!value}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"
              />
            </svg>
            <span
              className="visually-hidden"
            >
              {t('InputMessage.sendButton')}
            </span>
          </Button>
        </InputGroup>
      </Form>
    </div>
  )
}
