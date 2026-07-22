/*
 * @Author: YIDA zhuhansong@merach.com
 * @Date: 2026-07-22 12:07:47
 * @LastEditors: YIDA zhuhansong@merach.com
 * @LastEditTime: 2026-07-22 15:14:39
 * @FilePath: \gitCICD\apps\web\next.config.ts
 * @Description:
 *
 * Copyright (c) 2026 by ${git_name_email}, All Rights Reserved.
 */
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.200.218", "127.0.0.1", "localhost"],
  experimental: {
    proxyTimeout: 600000,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:10001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
