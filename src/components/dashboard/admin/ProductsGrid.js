import DashboardProductCard from "@/components/dashboard/DashboardProductCard";

export default function ProductsGrid({ products = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product) => (
        <DashboardProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
