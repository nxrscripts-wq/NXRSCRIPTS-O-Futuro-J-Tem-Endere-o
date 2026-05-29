interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lazy?: boolean;
  eager?: boolean;
}

const OptimizedImage = ({ src, alt, className, width, height, eager = false }: OptimizedImageProps) => (
  <picture>
    <source srcSet={`${src}.webp`} type="image/webp" />
    <source srcSet={`${src}.png`} type="image/png" />
    <img
      src={`${src}.png`}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={eager ? 'eager' : 'lazy'}
      decoding={eager ? 'sync' : 'async'}
    />
  </picture>
);

export default OptimizedImage;
