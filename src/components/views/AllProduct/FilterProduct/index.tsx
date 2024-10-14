"use client";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import styles from "./product.module.scss";
import { categoryService } from "@/services/category/method";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { TypeCategory } from "@/services/type.module";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const FilterProductView = () => {
  const pathname = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  const [category, setCategory] = useState<string[]>([]);

  useEffect(() => {
    const categoryParams = query.getAll("category");

    setCategory(categoryParams);
  }, [query]);

  const updateCategory = (category: string[]) => {
    const searchParams = new URLSearchParams(query.toString());

    if (category.length > 0) {
      category.forEach((item, index) => {
        if (index === 0) {
          searchParams.set("category", item);
        } else {
          searchParams.append("category", item);
        }
      });
    } else {
      searchParams.delete("category");
    }
    router.push(`${pathname}?${searchParams.toString()}`);
  };

  return (
    <aside className={styles.filter}>
      <div className={styles.header}>
        <h3>Filter</h3>
      </div>
      <div className={styles.category}>
        <h4>Kategori</h4>
        <div className={styles.category__wrapper}>
          <SelectOptionFetch
            placeholder="Pilih Kategori"
            id="category"
            name="category"
            fetching={() => categoryService.get("")}
            setValue={(value: TypeCategory) => {
              if (!category.includes(value.name) && value) {
                const updatedCategory = [...category, value.name];
                setCategory(updatedCategory);
                updateCategory(updatedCategory);
              }
            }}
            value={category}
          />

          <div className={styles.category__result}>
            {category.map((item, index) => (
              <div key={index} className={styles.category__result__item}>
                <p>{item}</p>
                <button
                  type="button"
                  className={styles.remove}
                  aria-label="remove category"
                  onClick={() => {
                    const updatedCategory = category.filter(
                      (category) => category !== item
                    );
                    setCategory(updatedCategory);
                    updateCategory(updatedCategory);
                  }}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.price}>
        <h4>Harga</h4>
        <input type="range" id="price" name="price" min={0} max={100000} />
      </div>
    </aside>
  );
};

export default FilterProductView;
