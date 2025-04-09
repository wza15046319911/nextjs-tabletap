'use client';

import { useState } from 'react';
import Image from 'next/image';

/**
 * 安全的图片组件，用于处理外部图片域名问题
 * 当Next.js图片优化失败时回退到普通img标签
 */
export default function SafeImage({ src, alt, width, height, className, ...props }) {
  const [isNextImageError, setIsNextImageError] = useState(false);
  
  // 尝试使用普通img标签
  if (isNextImageError) {
    return (
      <img 
        src={src} 
        alt={alt} 
        width={width} 
        height={height}
        className={className}
        {...props}
        style={{ objectFit: 'cover', ...props.style }}
      />
    );
  }
  
  // 尝试使用Next.js Image组件
  return (
    <Image 
      src={src} 
      alt={alt} 
      width={width} 
      height={height}
      className={className}
      {...props}
      onError={() => setIsNextImageError(true)}
    />
  );
} 