import ProductTilesSection from "../Sections/ProductTilesSection.jsx";
import Hero_1 from "../Components/Hero_1.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHomeScreen, selectHomeStatus } from "../store/homeScreen/homeScreenSlice.js";

export default function Home() {
    const dispatch = useDispatch();
    const status = useSelector(selectHomeStatus);

    useEffect(() => {
        // Sólo disparar la carga si aún no se ha cargado
        if (status === 'idle') {
            dispatch(fetchHomeScreen());
        }
    }, [dispatch, status]);

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
