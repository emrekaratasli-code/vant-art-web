import { useProduct } from '../context/ProductContext';
import ProductCard from './ProductCard';

export default function ProductRecommendations({ category, currentProductId }) {
    const { products } = useProduct();

    // Safety guard: ensure products exists
    if (!products || products.length === 0) return null;

    // Filter products: Same category, not the current one, limit to 4
    const recommendations = products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);

    if (recommendations.length === 0) return null;

    return (
        <div className="recommendations-section mt-12 mb-6 px-4">
            <h3 className="text-lg font-heading text-left mb-6 text-[#d4af37] tracking-wider uppercase">
                Bunu da Beğenebilirsiniz
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {recommendations.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
