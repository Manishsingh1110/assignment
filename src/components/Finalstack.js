import React, { useEffect, useRef } from "react";
import "../css/Stack.css"; // make sure to copy relevant styles here

const Finalstack = () => {
    const stackRef = useRef(null);
    const itemsRef = useRef([]);
    const observerRef = useRef(null);
    const scrollingRef = useRef(false);
    const scrollingFnRef = useRef(null);

    const getIntegerFromProperty = (marginY) => {
        const node = document.createElement("div");
        node.style.opacity = "0";
        node.style.visibility = "hidden";
        node.style.position = "absolute";
        node.style.height = marginY;
        stackRef.current.appendChild(node);
        const value = parseInt(getComputedStyle(node).getPropertyValue("height"));
        stackRef.current.removeChild(node);
        return value;
    };

    const setStackCards = () => {
        const element = stackRef.current;
        const items = itemsRef.current;
        let marginY = getComputedStyle(element).getPropertyValue("--stack-cards-gap");
        marginY = getIntegerFromProperty(marginY);

        const elementHeight = element.offsetHeight;
        const cardStyle = getComputedStyle(items[0]);
        const cardTop = Math.floor(parseFloat(cardStyle.getPropertyValue("top")));
        const cardHeight = Math.floor(parseFloat(cardStyle.getPropertyValue("height")));
        const windowHeight = window.innerHeight;

        element.style.paddingBottom = isNaN(marginY) ? "0px" : `${marginY * (items.length - 1)}px`;

        items.forEach((item, i) => {
            item.style.transform = isNaN(marginY) ? "none" : `translateY(${marginY * i}px)`;
        });

        return { marginY, elementHeight, cardTop, cardHeight, windowHeight };
    };

    const animateStackCards = (state) => {
        const { marginY, elementHeight, cardTop, cardHeight, windowHeight } = state;
        const element = stackRef.current;
        const items = itemsRef.current;

        if (isNaN(marginY)) {
            scrollingRef.current = false;
            return;
        }

        const top = element.getBoundingClientRect().top;

        if (
            cardTop - top + windowHeight - elementHeight - cardHeight + marginY + marginY * items.length >
            0
        ) {
            scrollingRef.current = false;
            return;
        }

        items.forEach((item, i) => {
            const scrolling = cardTop - top - i * (cardHeight + marginY);
            if (scrolling > 0) {
                const scaling =
                    i === items.length - 1 ? 1 : (cardHeight - scrolling * 0.05) / cardHeight;
                item.style.transform = `translateY(${marginY * i}px)scale(${scaling})`;
            } else {
                item.style.transform = `translateY(${marginY * i}px)`;
            }
        });

        scrollingRef.current = false;
    };

    const handleScroll = (state) => {
        if (scrollingRef.current) return;
        scrollingRef.current = true;
        window.requestAnimationFrame(() => animateStackCards(state));
    };

    useEffect(() => {
        if (!("IntersectionObserver" in window)) return;

        const element = stackRef.current;
        const items = element.querySelectorAll(".js-stack-cards__item");
        itemsRef.current = Array.from(items);

        let state = setStackCards();

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (!scrollingFnRef.current) {
                        scrollingFnRef.current = () => handleScroll(state);
                        window.addEventListener("scroll", scrollingFnRef.current);
                    }
                } else {
                    if (scrollingFnRef.current) {
                        window.removeEventListener("scroll", scrollingFnRef.current);
                        scrollingFnRef.current = null;
                    }
                }
            },
            { threshold: [0, 1] }
        );

        observer.observe(element);
        observerRef.current = observer;

        const resizeHandler = () => {
            state = setStackCards();
        };

        window.addEventListener("resize", resizeHandler);

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
            if (scrollingFnRef.current) window.removeEventListener("scroll", scrollingFnRef.current);
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return (
        <>
            <section className="sections bg-black">
                <ul className="stack-cards js-stack-cards" ref={stackRef}>
                    <li className="stack-cards__item js-stack-cards__item">
                        <h2 className="headingh2">Hello,<br /> friend.</h2>
                    </li>
                    <li className="stack-cards__item js-stack-cards__item">
                        <h2 className="headingh2">Hi <br /> there.</h2>
                    </li>
                    <li className="stack-cards__item js-stack-cards__item">
                        <h2 className="headingh2">How <br /> are you?</h2>
                        <div className="grid-container">
                            {/* Row 1 */}
                            <div className="grid-box">Box 1</div>
                            <div className="grid-text">
                                <h2>Title 1</h2>
                                <p>This is a short paragraph about the first topic.</p>
                            </div>

                            {/* Row 2 */}
                            <div className="grid-text">
                                <h2>Title 2</h2>
                                <p>This is another short paragraph about the second topic.</p>
                            </div>
                            <div className="grid-box">Box 2</div>
                        </div>
                    </li>
                </ul>
            </section>
        </>);
};
export default Finalstack;
