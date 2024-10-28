"use client";
import SelectOptionFetch from "@/components/element/SelectOptionFetch";
import styles from "./product.module.scss";
import { categoryService } from "@/services/category/method";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { TypeCategory, TypeCollection } from "@/services/type.module";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import InputMultiRange from "@/components/element/InputMultiRange";
import { collectionSevice } from "@/services/collection/method";
import InputSearch from "@/components/element/InputSearch";

const FilterProductView = ({ onClose }: { onClose?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const query = useSearchParams();
  const params = useSearchParams();
  const search = params.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(search);
  const [category, setCategory] = useState<string[]>([]);
  const [collection, setCollection] = useState<string>("");

  useEffect(() => {
    const categoryParams = query.getAll("category");

    setCategory(categoryParams);
  }, [query]);

  useEffect(() => {
    const collectionParams = query.get("collection");

    setCollection(collectionParams as string);
  }, [query]);

  const updateCategory = (category: string[]) => {
    const searchParams = new URLSearchParams(query.toString());

    if (category.length > 0) {
      category.forEach((item, index) => {
        if (index === 0) {
          searchParams.set("page", "1");
          searchParams.set("category", item);
        } else {
          searchParams.append("category", item);
        }
      });
    } else {
      searchParams.delete("category");
      if (searchParams.size === 1) searchParams.delete("page");
    }
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  const updateCollection = (collection: string) => {
    const searchParams = new URLSearchParams(query.toString());
    if (collection) {
      searchParams.set("page", "1");
      searchParams.set("collection", collection);
    } else {
      searchParams.delete("collection");
      if (searchParams.size === 1) searchParams.delete("page");
    }
    router.push(`${pathname}?${searchParams.toString()}`, { scroll: false });
  };

  return (
    <aside className={styles.filter}>
      <div className={styles.header}>
        <h3>Filter</h3>
        <button
          aria-label="close"
          title="Tutup"
          type="button"
          className={styles.close}
          onClick={onClose}
        >
          <X />
        </button>
      </div>
      <h4 className={styles.search__title}>Pencarian</h4>
      <div className={styles.search}>
        <InputSearch
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="search"
          name="search"
          placeholder="Cari Nama dari Produk"
        />
      </div>
      <div className={styles.category}>
        <h4>Koleksi</h4>
        <div className={styles.category__wrapper}>
          <SelectOptionFetch
            placeholder="Pilih Koleksi"
            id="koleksi"
            name="collection"
            fetching={() => collectionSevice.getCollection("")}
            setValue={(value: TypeCollection) => {
              if (value) {
                setCollection(value.name);
                updateCollection(value.name);
              } else {
                setCollection("");
                updateCollection(value);
              }
            }}
            value={collection}
          />
        </div>
      </div>
      <div className={styles.price}>
        <h4>Harga</h4>
        <InputMultiRange />
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
    </aside>
  );
};

export default FilterProductView;
