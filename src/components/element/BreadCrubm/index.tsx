"use client";
import React from "react";
import Link from "next/link";

import { ChevronRight, Home } from "lucide-react";
import { usePathname } from "next/navigation";
import styles from "./crubm.module.scss";

const BreadCrubm = () => {
  const pathname = usePathname();

  const pathSegments = pathname.split("/").filter((segment) => segment);

  return (
    <ul role="list" className={styles.breadcrubm}>
      <li>
        <Link href={"/"}>
          <Home width={16} height={16} />
        </Link>
        <ChevronRight width={16} height={16} />
      </li>
      {pathSegments.map((segment, index) => {
        const pathToSegment = `/${pathSegments.slice(0, index + 1).join("/")}`;
        return (
          <li key={pathToSegment}>
            <Link href={pathToSegment}>{segment.replace(/-/g, " ")}</Link>
            {index !== pathSegments.length - 1 && (
              <ChevronRight width={16} height={16} />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default BreadCrubm;
