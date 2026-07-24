/*
 * @Author: YIDA-max 3136271519@qq.com
 * @Date: 2023-06-12 14:16:49
 * @LastEditors: YIDA-max 3136271519@qq.com
 * @LastEditTime: 2023-06-12 14:29:36
 * @FilePath: /React-Ant/src/models/Spin.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { useState } from 'react';

export default () => {
  const [userSpinning, setuserSpinning] = useState<boolean>(false);
  return { userSpinning, setuserSpinning };
};
