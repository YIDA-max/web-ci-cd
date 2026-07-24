import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Input,
  List,
  Modal,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import {
  deployBuild,
  getDeployEnvironments,
  syncBranches,
} from '@/services/gitcicd';
import type {
  DeployEnvironment,
  DeployLogEntry,
} from '@gitcicd/shared';

const { Text, Paragraph } = Typography;

type Step = 0 | 1 | 2;
type DeployStatus = 'building' | 'success' | 'error';

const DEFAULT_REPO_URL = 'http://192.168.203.161/qianyi/qianyi-ui';

const DeployPage: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO_URL);
  const [branches, setBranches] = useState<string[]>([]);
  const [tempDir, setTempDir] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [environments, setEnvironments] = useState<DeployEnvironment[]>([]);
  const [deployBranch, setDeployBranch] = useState('');
  const [selectedPort, setSelectedPort] = useState<string>();
  const [deployStatus, setDeployStatus] = useState<DeployStatus>('building');
  const [deployLogs, setDeployLogs] = useState<DeployLogEntry[]>([]);
  const [deployError, setDeployError] = useState('');

  useEffect(() => {
    getDeployEnvironments()
      .then((res) => {
        if (res.success) setEnvironments(res.environments);
      })
      .catch(() => undefined);
  }, []);

  const handleSync = useCallback(async () => {
    const url = repoUrl.trim();
    if (!url) {
      setError('请输入 Git 仓库地址');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await syncBranches(url);
      if (res.success && res.branches?.length) {
        setTempDir(res.tempDir || '');
        setBranches(res.branches);
        setCurrentStep(1);
        message.success(`已同步 ${res.branches.length} 个分支`);
      } else {
        setError(res.error || '没有找到任何分支');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [repoUrl]);

  const [envOpen, setEnvOpen] = useState(false);

  const handleDeployClick = (branch: string) => {
    setDeployBranch(branch);
    setSelectedPort(undefined);
    setEnvOpen(true);
  };

  const handleDeployConfirm = async () => {
    if (!selectedPort || !deployBranch) {
      message.warning('请选择环境');
      return;
    }
    setEnvOpen(false);
    setCurrentStep(2);
    setDeployStatus('building');
    setDeployLogs([]);
    setDeployError('');
    setLoading(true);
    try {
      const res = await deployBuild({
        repoUrl: repoUrl.trim(),
        branch: deployBranch,
        environmentPort: selectedPort,
        tempDir,
      });
      setDeployLogs(res.logs || []);
      if (res.success) {
        setDeployStatus('success');
        message.success('发版成功');
      } else {
        setDeployStatus('error');
        setDeployError(res.error || '发版失败');
      }
    } catch (err) {
      setDeployStatus('error');
      setDeployError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setRepoUrl(DEFAULT_REPO_URL);
    setBranches([]);
    setTempDir('');
    setCurrentStep(0);
    setDeployLogs([]);
    setDeployError('');
    setDeployBranch('');
    setSelectedPort(undefined);
    setError('');
  };

  return (
    <PageContainer title="发版部署">
      <ProCard>
        <Steps
          current={currentStep}
          style={{ marginBottom: 24 }}
          items={[
            { title: '同步仓库' },
            { title: '选择分支' },
            { title: '发版部署' },
          ]}
        />

        {error ? (
          <Alert
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
            message={error}
            onClose={() => setError('')}
          />
        ) : null}

        {currentStep === 0 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <div>
              <Text strong>Git 仓库地址</Text>
              <Input
                style={{ marginTop: 8 }}
                value={repoUrl}
                placeholder="请输入远程 Git 仓库地址"
                disabled={loading}
                onChange={(e) => setRepoUrl(e.target.value)}
                onPressEnter={handleSync}
              />
            </div>
            <Button type="primary" loading={loading} onClick={handleSync}>
              同步分支
            </Button>
            <Paragraph type="secondary">
              克隆仓库并同步远程分支，选择分支后一键构建部署到目标环境。
            </Paragraph>
          </Space>
        ) : null}

        {currentStep === 1 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Alert type="info" showIcon message={`共 ${branches.length} 个分支`} />
            <List
              bordered
              dataSource={branches}
              renderItem={(branch) => (
                <List.Item
                  actions={[
                    <Button
                      key="deploy"
                      type="primary"
                      size="small"
                      onClick={() => handleDeployClick(branch)}
                    >
                      发版
                    </Button>,
                  ]}
                >
                  <Text code>{branch}</Text>
                </List.Item>
              )}
            />
            <Button onClick={handleReset}>重新开始</Button>
          </Space>
        ) : null}

        {currentStep === 2 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Tag
              color={
                deployStatus === 'success'
                  ? 'success'
                  : deployStatus === 'error'
                    ? 'error'
                    : 'processing'
              }
            >
              {deployStatus === 'building'
                ? '构建中…'
                : deployStatus === 'success'
                  ? '发版成功'
                  : '发版失败'}
            </Tag>
            {deployError ? <Alert type="error" showIcon message={deployError} /> : null}
            <List
              bordered
              size="small"
              dataSource={deployLogs}
              locale={{ emptyText: loading ? '等待日志…' : '暂无日志' }}
              renderItem={(log) => (
                <List.Item>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary">{log.timestamp}</Text>
                    <Text>
                      <Tag>{log.step}</Tag>
                      {log.message}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
            <Button type="primary" onClick={handleReset} disabled={loading}>
              再来一次
            </Button>
          </Space>
        ) : null}
      </ProCard>

      <Modal
        title={`发版分支：${deployBranch}`}
        open={envOpen}
        onCancel={() => setEnvOpen(false)}
        onOk={handleDeployConfirm}
        okText="确认发版"
        confirmLoading={loading}
      >
        <Text>选择目标环境</Text>
        <Select
          style={{ width: '100%', marginTop: 8 }}
          placeholder={
            environments.length
              ? '选择环境端口'
              : '暂无环境（检查 server/config/deploy-envs.json）'
          }
          value={selectedPort}
          options={environments.map((env) => ({
            label: `${env.port} · ${env.description || env.staticRoot}`,
            value: env.port,
          }))}
          onChange={setSelectedPort}
        />
      </Modal>
    </PageContainer>
  );
};

export default DeployPage;
