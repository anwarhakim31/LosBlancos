import Image from "next/image";
import React from "react";

const ImageDynamicComponent = ({
  item,
  blurDataUrl,
}: {
  item: string;
  blurDataUrl: string;
}) => {
  return (
    <Image
      src={item}
      alt="galeri1"
      width={1000}
      height={1000}
      loading="lazy"
      placeholder="blur"
      blurDataURL={blurDataUrl || "https://dummyimage.com/1000/1000/eee"}
    />
  );
};

export default ImageDynamicComponent;
