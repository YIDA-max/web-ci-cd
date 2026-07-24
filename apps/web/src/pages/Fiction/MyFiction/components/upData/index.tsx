import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import UpData from './upData';

interface IndexProps {
  callBack: () => void;
}
const Index: React.FC<IndexProps> = ({ callBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        上传
      </Button>
      {isModalOpen && (
        <Modal open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={1000}>
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <UpData callBack={callBack} />
          </div>
        </Modal>
      )}
    </>
  );
};

Index.propTypes = {
  callBack: PropTypes.func.isRequired,
};

export default Index;
