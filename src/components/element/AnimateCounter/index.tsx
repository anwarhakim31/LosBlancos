import { formatCurrency } from "@/utils/contant";
import React, { useEffect, useState } from "react";

const AnimateCounter = ({ value, type }: { value: number; type: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 300;
    const increment = Math.ceil(value / (duration / 16.7));

    const animate = () => {
      start += increment;
      if (start >= value) {
        setCount(value);
      } else {
        setCount(start);
        requestAnimationFrame(animate);
      }
    };

    const animateId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animateId);
  }, [value]);

  return <>{type === "currency" ? formatCurrency(count) : count}</>;
};

export default AnimateCounter;
