import { PageContainer, ProCard } from '@ant-design/pro-components';
import {
  Alert,
  Button,
  Input,
  List,
  Progress,
  Select,
  Space,
  Steps,
  Tag,
  Typography,
  message,
  Modal,
} from 'antd';
import React, { useCallback, useMemo, useState } from 'react';
import {
  cleanup,
  mergeBranches,
  syncBranches,
} from '@/services/gitcicd';
import type {
  GitConflict,
  GitResult,
  GitSummary,
} from '@gitcicd/shared';

const { Text, Paragraph } = Typography;

type Step = 0 | 1 | 2;

const DEFAULT_REPO_URL = 'http://192.168.203.161/qianyi/qianyi-ui';

const GitMergePage: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState(DEFAULT_REPO_URL);
  const [branches, setBranches] = useState<string[]>([]);
  const [tempDir, setTempDir] = useState('');
  const [sourceBranch, setSourceBranch] = useState<string>();
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<GitResult[]>([]);
  const [summary, setSummary] = useState<GitSummary>();
  const [conflicts, setConflicts] = useState<GitConflict[]>([]);

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
        setSourceBranch(undefined);
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

  const handleMerge = useCallback(async () => {
    if (!sourceBranch) {
      setError('请选择要合并的源分支');
      return;
    }
    const masterBranch = branches.includes('master')
      ? 'master'
      : branches.includes('main')
        ? 'main'
        : null;
    const targetBranches = branches.filter(
      (b) => b !== masterBranch && b !== sourceBranch,
    );
    if (!targetBranches.length) {
      setError('没有可合并的目标分支');
      return;
    }

    Modal.confirm({
      title: '确认批量合并',
      content: `将 "${sourceBranch}" 合并到 ${targetBranches.length} 个分支？`,
      onOk: async () => {
        setError('');
        setLoading(true);
        try {
          const res = await mergeBranches({
            tempDir,
            sourceBranch,
            allBranches: branches,
          });
          if (res.success && res.results) {
            setResults(res.results);
            setSummary(res.summary);
            setConflicts(res.conflicts || []);
            setCurrentStep(2);
            if (tempDir) cleanup(tempDir).catch(() => undefined);
          } else {
            setError(res.error || '合并失败');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : String(err));
        } finally {
          setLoading(false);
        }
      },
    });
  }, [sourceBranch, branches, tempDir]);

  const handleReset = () => {
    setRepoUrl(DEFAULT_REPO_URL);
    setBranches([]);
    setTempDir('');
    setSourceBranch(undefined);
    setResults([]);
    setSummary(undefined);
    setConflicts([]);
    setError('');
    setCurrentStep(0);
  };

  const percent = useMemo(() => {
    if (!summary) return 0;
    return Math.round((summary.success / Math.max(summary.total, 1)) * 100);
  }, [summary]);

  const masterBranch = useMemo(() => {
    if (branches.includes('master')) return 'master';
    if (branches.includes('main')) return 'main';
    return null;
  }, [branches]);

  const targetBranches = useMemo(
    () =>
      branches.filter((b) => b !== masterBranch && b !== sourceBranch),
    [branches, masterBranch, sourceBranch],
  );

  const mergeTip = useMemo(() => {
    const base = `共 ${branches.length} 个分支，将排除 master/main 与源分支后批量合并`;
    if (!sourceBranch) return base;
    return `${base}（当前将合并到 ${targetBranches.length} 个分支）`;
  }, [branches.length, sourceBranch, targetBranches.length]);

  return (
    <PageContainer title="分支批量合并">
      <ProCard>
        <Steps
          current={currentStep}
          style={{ marginBottom: 24 }}
          items={[
            { title: '同步仓库' },
            { title: '选择源分支' },
            { title: '合并结果' },
          ]}
        />

        {error ? (
          <Alert
            type="error"
            showIcon
            closable
            style={{ marginBottom: 16 }}
            title={error}
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
              将克隆仓库并拉取远程分支，用于后续批量合并。
            </Paragraph>
          </Space>
        ) : null}

        {currentStep === 1 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Alert type="info" showIcon title={mergeTip} />
            <div>
              <Text strong>分支列表（{branches.length}）</Text>
              <List
                style={{ marginTop: 8, maxHeight: 240, overflow: 'auto' }}
                size="small"
                bordered
                dataSource={branches}
                renderItem={(branch) => {
                  const excluded =
                    branch === masterBranch || branch === sourceBranch;
                  return (
                    <List.Item>
                      <Space>
                        <Text code>{branch}</Text>
                        {excluded ? (
                          <Tag>
                            {branch === sourceBranch ? '源分支' : '已排除'}
                          </Tag>
                        ) : (
                          <Tag color="processing">待合并目标</Tag>
                        )}
                      </Space>
                    </List.Item>
                  );
                }}
              />
            </div>
            <div>
              <Text strong>源分支</Text>
              <Select
                style={{ width: '100%', marginTop: 8 }}
                showSearch
                placeholder="选择要合并的源分支"
                value={sourceBranch}
                options={branches.map((b) => ({ label: b, value: b }))}
                onChange={setSourceBranch}
              />
            </div>
            <Space>
              <Button type="primary" loading={loading} onClick={handleMerge}>
                开始合并
              </Button>
              <Button onClick={handleReset}>重新开始</Button>
            </Space>
          </Space>
        ) : null}

        {currentStep === 2 ? (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {summary ? (
              <>
                <Progress percent={percent} status={summary.failed ? 'exception' : 'success'} />
                <Space wrap>
                  <Tag color="blue">总计 {summary.total}</Tag>
                  <Tag color="success">成功 {summary.success}</Tag>
                  <Tag color="error">失败 {summary.failed}</Tag>
                  <Tag color="warning">冲突 {summary.conflicts}</Tag>
                </Space>
              </>
            ) : null}
            <List
              bordered
              dataSource={results}
              renderItem={(item) => (
                <List.Item>
                  <Space>
                    <Tag color={item.success ? 'success' : 'error'}>
                      {item.success ? '成功' : '失败'}
                    </Tag>
                    <Text code>{item.branch}</Text>
                    <Text type="secondary">{item.message}</Text>
                  </Space>
                </List.Item>
              )}
            />
            {conflicts.length ? (
              <Alert
                type="warning"
                showIcon
                title="存在冲突分支"
                description={conflicts
                  .map((c) => `${c.branch}: ${c.conflicts.join(', ')}`)
                  .join('；')}
              />
            ) : null}
            <Button type="primary" onClick={handleReset}>
              再来一次
            </Button>
          </Space>
        ) : null}
      </ProCard>
    </PageContainer>
  );
};

export default GitMergePage;
