import ProductTilesSection from "../Sections/ProductTilesSection.jsx";
import Hero_1 from "../Components/Hero_1.jsx";

export default function Home() {
    return (
        <>
            <section data-testid="hero-section">
                <Hero_1 />
            </section>
            <div className="py-2" />
            <ProductTilesSection />
        </>
    );
}
