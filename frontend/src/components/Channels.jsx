import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import leo from 'leo-profanity';

import { channelsSelectors, channelsActions, selectCurrentChannelId } from '../slices/channels';

const basicClassName = 'w-100 rounded-0 text-start text-truncate';

const Channel = ({ channelEntity, selected, modalHandlers }) => {
  const { t } = useTranslation('Components', { keyPrefix: 'Channels' });
  const { name, removable } = channelEntity;
  const dispatch = useDispatch();
  const handleChangeChannel = (e) => {
    e.preventDefault();
    dispatch(channelsActions.setCurrentChannel(channelEntity.id));
  };
  if (removable) {
    return (
      <li className="nav-item w-100">
        <Dropdown
          as={ButtonGroup}
          className="w-100"
        >
          <Button
            type="button"
            onClick={handleChangeChannel}
            variant={selected ? 'secondary' : 'light'}
            className={basicClassName}
          >
            <span className="me-1">#</span>
            {
              leo.clean(name)
            }
          </Button>
          <Dropdown.Toggle
            variant={selected ? 'secondary' : 'light'}
            title=""
            split
          >
            <span className="visually-hidden">
              {
                t('Dropdown.channelSettings')
              }
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={modalHandlers.handleRenameChannel}
            >
              {
                t('Dropdown.rename')
              }
            </Dropdown.Item>
            <Dropdown.Item
              onClick={modalHandlers.handleDeleteChannel}
            >
              {
                t('Dropdown.delete')
              }
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </li>
    );
  }
  return (
    <li className="nav-item w-100">
      <Button
        type="button"
        variant={selected ? 'secondary' : 'light'}
        onClick={handleChangeChannel}
        className={basicClassName}
      >
        <span className="me-1">#</span>
        {
          leo.clean(name)
        }
      </Button>
    </li>
  );
};

const ChannelsList = ({ channelsModals }) => {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const channels = useSelector(channelsSelectors.selectEntities);
  return (
    <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
      {channels ? Object.values(channels).map((entity) => {
        const { id } = entity;
        if (Number(id) === Number(currentChannelId)) {
          return (
            <Channel
              channelEntity={entity}
              key={id}
              modalHandlers={channelsModals(id)}
              selected
            />
          );
        }
        return <Channel channelEntity={entity} key={id} modalHandlers={channelsModals(id)} />;
      }) : null}
    </ul>
  );
};

export default ChannelsList;
