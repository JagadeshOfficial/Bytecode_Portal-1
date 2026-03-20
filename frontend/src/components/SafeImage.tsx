"use client";

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

// Wrapper for next/image that falls back to a generated DP with the person's initials 
// if their real image path returns a 404 (broken link).
interface SafeImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  name: string;
}

export default function SafeImage({ src, name, alt, ...props }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  
  // Creates an initials DP from ui-avatars
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt || name}
      onError={() => setImgSrc(fallbackUrl)}
    />
  );
}
