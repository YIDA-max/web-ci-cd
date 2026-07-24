/** 数据库已裁掉：提供空壳避免误引用崩溃 */
export async function connect(..._args: any[]): Promise<any> {
  throw new Error('数据库暂未启用');
}

export default { connect };
