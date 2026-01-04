import { useProducts } from '../context/ProductContext';
import ProductCard from './ProductCard';

export default function ProductRecommendations({ category, currentProductId }) {
    const { products } = useProducts();

    // Filter products: Same category, not the current one, limit to 4
    const recommendations = products
        .filter(p => p.category === category && p.id !== currentProductId)
        .slice(0, 4);

    if (recommendations.length === 0) return null;

    return (
        <div className="recommendations-section mt-24 mb-12">
            <h3 className="text-2xl font-heading text-center mb-8 text-[#d4af37] tracking-wider uppercase">
                Bunu da Beğenebilirsiniz
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
