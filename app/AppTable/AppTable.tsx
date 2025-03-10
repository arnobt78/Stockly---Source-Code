"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductTable } from "../Products/ProductTable";
import { columns } from "../Products/columns";
import ProductDialog from "./ProductDialog/ProductDialog";
import AddCategoryDialog from "./ProductDialog/AddCategoryDialog";
import AddSupplierDialog from "./ProductDialog/AddSupplierDialog";
import { useProductStore } from "../useProductStore";
import { useEffect } from "react";

export default function AppTable() {
  const { allProducts, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <Card className="mt-12 flex flex-col shadow-none poppins border-none">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        <div className="flex flex-col sm:flex-row justify-between items-center w-full sm:w-auto">
          <div className="flex flex-col items-start sm:items-center">
            <CardTitle className="font-bold text-[23px]">Products</CardTitle>
            <p className="text-sm text-slate-600">
              {allProducts.length} products
            </p>
          </div>
        </div>
        <div className="flex space-x-4">
          <ProductDialog />
          <AddCategoryDialog />
          <AddSupplierDialog />
        </div>
      </CardHeader>

      <CardContent>
        <ProductTable data={allProducts} columns={columns} />
      </CardContent>
    </Card>
  );
}
