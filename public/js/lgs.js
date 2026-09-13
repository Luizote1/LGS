(() => {

    "use strict";


    // =========================================================
    // HELPERS
    // =========================================================

    const $ = (
        selector,
        scope = document
    ) => scope.querySelector(selector);


    const $$ = (
        selector,
        scope = document
    ) => [
            ...scope.querySelectorAll(selector)
        ];


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    const hasFinePointer =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;



    // =========================================================
    // REVEAL
    // =========================================================

    function initReveal() {

        const elements =
            $$(".reveal");


        if (!elements.length) {

            return;

        }


        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(element => {

                element.classList.add(
                    "active"
                );

            });

            return;

        }


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(entry => {

                        if (!entry.isIntersecting) {

                            return;

                        }


                        entry.target.classList.add(
                            "active"
                        );


                        observer.unobserve(
                            entry.target
                        );

                    });

                },

                {

                    threshold: .12,

                    rootMargin:
                        "0px 0px -60px 0px"

                }

            );


        elements.forEach(
            (element, index) => {

                element.style.transitionDelay =
                    `${Math.min(index % 4, 3) * 55}ms`;


                observer.observe(
                    element
                );

            }
        );

    }



    // =========================================================
    // NAVBAR
    // =========================================================

    function initNavbar() {

        const navbar =
            $(".navbar");


        if (!navbar) {

            return;

        }


        function updateNavbar() {

            navbar.classList.toggle(

                "scrolled",

                window.scrollY > 20

            );

        }


        updateNavbar();


        window.addEventListener(

            "scroll",

            updateNavbar,

            {
                passive: true
            }

        );

    }



    // =========================================================
    // MENU MOBILE
    // =========================================================

    function initMobileMenu() {

        const button =
            $("#menuToggle");


        const nav =
            $("#primaryNav");


        if (
            !button ||
            !nav
        ) {

            return;

        }


        function openMenu() {

            button.classList.add(
                "active"
            );


            nav.classList.add(
                "mobile-open"
            );


            button.setAttribute(
                "aria-expanded",
                "true"
            );


            button.setAttribute(
                "aria-label",
                "Fechar menu"
            );


            document.body.classList.add(
                "menu-open"
            );

        }


        function closeMenu() {

            button.classList.remove(
                "active"
            );


            nav.classList.remove(
                "mobile-open"
            );


            button.setAttribute(
                "aria-expanded",
                "false"
            );


            button.setAttribute(
                "aria-label",
                "Abrir menu"
            );


            document.body.classList.remove(
                "menu-open"
            );

        }


        button.addEventListener(
            "click",
            () => {

                const open =
                    nav.classList.contains(
                        "mobile-open"
                    );


                if (open) {

                    closeMenu();

                }
                else {

                    openMenu();

                }

            }
        );


        $$("a", nav).forEach(
            link => {

                link.addEventListener(
                    "click",
                    closeMenu
                );

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    nav.classList.contains(
                        "mobile-open"
                    )
                ) {

                    closeMenu();

                    button.focus();

                }

            }
        );


        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth >
                    1000
                ) {

                    closeMenu();

                }

            }
        );

    }



    // =========================================================
    // SMOOTH SCROLL
    // =========================================================

    function initSmoothScroll() {

        $$('a[href^="#"]').forEach(
            link => {

                link.addEventListener(
                    "click",
                    event => {

                        const href =
                            link.getAttribute(
                                "href"
                            );


                        if (
                            !href ||
                            href === "#"
                        ) {

                            return;

                        }


                        const target =
                            $(href);


                        if (!target) {

                            return;

                        }


                        event.preventDefault();


                        const navbar =
                            $(".navbar");


                        const navbarHeight =
                            navbar
                                ? navbar.offsetHeight
                                : 0;


                        const top =

                            target
                                .getBoundingClientRect()
                                .top

                            +

                            window.scrollY

                            -

                            navbarHeight

                            -

                            25;


                        window.scrollTo({

                            top,

                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth"

                        });


                        history.replaceState(
                            null,
                            "",
                            href
                        );

                    }
                );

            }
        );

    }



    // =========================================================
    // ACTIVE NAVIGATION
    // =========================================================

    function initActiveNavigation() {

        const links =
            $$('#primaryNav a[href^="#"]');


        if (
            !links.length ||
            !("IntersectionObserver" in window)
        ) {

            return;

        }


        const sections =
            links

                .map(link => {

                    return $(
                        link.getAttribute(
                            "href"
                        )
                    );

                })

                .filter(Boolean);


        const observer =
            new IntersectionObserver(

                entries => {

                    const visible =
                        entries

                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )

                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            )[0];


                    if (!visible) {

                        return;

                    }


                    links.forEach(link => {

                        const active =

                            link.getAttribute(
                                "href"
                            )

                            ===

                            `#${visible.target.id}`;


                        link.classList.toggle(
                            "active",
                            active
                        );


                        if (active) {

                            link.setAttribute(
                                "aria-current",
                                "page"
                            );

                        }
                        else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    });

                },

                {

                    threshold: [
                        .1,
                        .25,
                        .5
                    ],

                    rootMargin:
                        "-20% 0px -55% 0px"

                }

            );


        sections.forEach(
            section => {

                observer.observe(
                    section
                );

            }
        );

    }



    // =========================================================
    // SCROLL PROGRESS
    // =========================================================

    function initScrollProgress() {

        const progress =
            $("#scrollProgress");


        if (!progress) {

            return;

        }


        let ticking =
            false;


        function update() {

            const maxScroll =

                document
                    .documentElement
                    .scrollHeight

                -

                window.innerHeight;


            let percentage = 0;


            if (maxScroll > 0) {

                percentage =

                    (
                        window.scrollY /
                        maxScroll
                    )

                    *

                    100;

            }


            progress.style.width =
                `${Math.min(
                    100,
                    Math.max(
                        0,
                        percentage
                    )
                )}%`;


            ticking =
                false;

        }


        function requestUpdate() {

            if (ticking) {

                return;

            }


            ticking =
                true;


            requestAnimationFrame(
                update
            );

        }


        update();


        window.addEventListener(

            "scroll",

            requestUpdate,

            {
                passive: true
            }

        );


        window.addEventListener(
            "resize",
            requestUpdate
        );

    }



    // =========================================================
    // MODAL
    // =========================================================

    function initModal() {

        const modal =
            $("#mediaModal");


        const image =
            $("#modalImage");


        const closeButton =
            $("#modalClose");


        if (
            !modal ||
            !image
        ) {

            return;

        }


        let lastFocusedElement =
            null;


        function openMedia(
            src,
            alt = "Imagem ampliada"
        ) {

            if (!src) {

                return;

            }


            lastFocusedElement =
                document.activeElement;


            image.src =
                src;


            image.alt =
                alt;


            modal.classList.add(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.style.overflow =
                "hidden";


            if (closeButton) {

                closeButton.focus({
                    preventScroll: true
                });

            }

        }


        function closeMedia() {

            if (
                !modal.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            modal.classList.remove(
                "active"
            );


            modal.setAttribute(
                "aria-hidden",
                "true"
            );


            document.body.style.overflow =
                "";


            setTimeout(
                () => {

                    if (
                        !modal.classList.contains(
                            "active"
                        )
                    ) {

                        image.src =
                            "";

                    }

                },
                350
            );


            if (
                lastFocusedElement
                instanceof HTMLElement
            ) {

                lastFocusedElement.focus({
                    preventScroll: true
                });

            }

        }


        $$("[data-media]").forEach(
            element => {

                element.addEventListener(
                    "click",
                    () => {

                        openMedia(

                            element.dataset.media,

                            element.dataset.alt ||
                            "Imagem ampliada"

                        );

                    }
                );

            }
        );


        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeMedia();

                }

            }
        );


        image.addEventListener(
            "click",
            event => {

                event.stopPropagation();

            }
        );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                closeMedia
            );

        }


        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeMedia();

                }

            }
        );


        window.openMedia =
            openMedia;


        window.closeMedia =
            closeMedia;

    }



    // =========================================================
    // CARD TILT
    // =========================================================

    function initTiltCards() {

        if (
            !hasFinePointer ||
            prefersReducedMotion
        ) {

            return;

        }


        const cards =
            $$(".tilt-card");


        cards.forEach(card => {

            let frame =
                null;


            card.addEventListener(
                "mousemove",
                event => {

                    if (frame) {

                        cancelAnimationFrame(
                            frame
                        );

                    }


                    frame =
                        requestAnimationFrame(
                            () => {

                                const rect =
                                    card
                                        .getBoundingClientRect();


                                const mouseX =

                                    event.clientX -
                                    rect.left;


                                const mouseY =

                                    event.clientY -
                                    rect.top;


                                const x =

                                    mouseX /
                                    rect.width;


                                const y =

                                    mouseY /
                                    rect.height;


                                const rotateY =

                                    (
                                        x -
                                        .5
                                    )

                                    *

                                    4;


                                const rotateX =

                                    (
                                        .5 -
                                        y
                                    )

                                    *

                                    4;


                                card.style.transform = `

                                    perspective(1000px)

                                    rotateX(
                                        ${rotateX}deg
                                    )

                                    rotateY(
                                        ${rotateY}deg
                                    )

                                `;

                            }
                        );

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    if (frame) {

                        cancelAnimationFrame(
                            frame
                        );

                    }


                    card.style.transform =
                        "";

                }
            );

        });

    }



    // =========================================================
    // HERO PARALLAX
    // =========================================================

    function initHeroParallax() {

        if (
            !hasFinePointer ||
            prefersReducedMotion
        ) {

            return;

        }


        const preview =
            $(".hero-preview");


        const browser =
            $(".browser", preview);


        const floatingCards =
            $$(".float-card", preview);


        if (
            !preview ||
            !browser
        ) {

            return;

        }


        let frame =
            null;


        preview.addEventListener(
            "mousemove",
            event => {

                if (frame) {

                    cancelAnimationFrame(
                        frame
                    );

                }


                frame =
                    requestAnimationFrame(
                        () => {

                            const rect =
                                preview
                                    .getBoundingClientRect();


                            const x =

                                (
                                    event.clientX -
                                    rect.left
                                )

                                /

                                rect.width

                                -

                                .5;


                            const y =

                                (
                                    event.clientY -
                                    rect.top
                                )

                                /

                                rect.height

                                -

                                .5;


                            browser.style.transform = `

                                perspective(1200px)

                                rotateX(
                                    ${-y * 4}deg
                                )

                                rotateY(
                                    ${x * 5}deg
                                )

                            `;


                            floatingCards.forEach(
                                (
                                    card,
                                    index
                                ) => {

                                    const strength =
                                        index % 2 === 0
                                            ? 18
                                            : -18;


                                    card.style.transform = `

                                        translate3d(

                                            ${x *
                                        strength
                                        }px,

                                            ${y *
                                        strength
                                        }px,

                                            0

                                        )

                                    `;

                                }
                            );

                        }
                    );

            }
        );


        preview.addEventListener(
            "mouseleave",
            () => {

                browser.style.transform =
                    "";


                floatingCards.forEach(
                    card => {

                        card.style.transform =
                            "";

                    }
                );

            }
        );

    }



    // =========================================================
    // CURSOR GLOW
    // =========================================================

    function initCursorGlow() {

        if (
            !hasFinePointer ||
            prefersReducedMotion
        ) {

            return;

        }


        const glow =
            document.createElement(
                "div"
            );


        glow.className =
            "cursor-glow";


        document.body.appendChild(
            glow
        );


        let mouseX =
            window.innerWidth / 2;


        let mouseY =
            window.innerHeight / 2;


        let currentX =
            mouseX;


        let currentY =
            mouseY;


        function animate() {

            currentX +=
                (
                    mouseX -
                    currentX
                )
                *
                .09;


            currentY +=
                (
                    mouseY -
                    currentY
                )
                *
                .09;


            glow.style.left =
                `${currentX}px`;


            glow.style.top =
                `${currentY}px`;


            requestAnimationFrame(
                animate
            );

        }


        window.addEventListener(
            "pointermove",
            event => {

                mouseX =
                    event.clientX;


                mouseY =
                    event.clientY;

            },
            {
                passive: true
            }
        );


        document.addEventListener(
            "mouseleave",
            () => {

                glow.style.opacity =
                    "0";

            }
        );


        document.addEventListener(
            "mouseenter",
            () => {

                glow.style.opacity =
                    ".17";

            }
        );


        animate();

    }



    // =========================================================
    // VIDEOS
    // =========================================================

    function initVideos() {

        const videos =
            $$("video");


        if (!videos.length) {

            return;

        }


        videos.forEach(
            video => {

                video.muted =
                    true;


                video.playsInline =
                    true;

            }
        );


        if (
            !("IntersectionObserver" in window)
        ) {

            videos.forEach(
                video => {

                    video
                        .play()
                        .catch(
                            () => { }
                        );

                }
            );


            return;

        }


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            const video =
                                entry.target;


                            if (
                                entry.isIntersecting &&
                                !document.hidden
                            ) {

                                video
                                    .play()
                                    .catch(
                                        () => { }
                                    );

                            }
                            else {

                                video.pause();

                            }

                        }
                    );

                },

                {
                    threshold: .25
                }

            );


        videos.forEach(
            video => {

                observer.observe(
                    video
                );

            }
        );


        document.addEventListener(
            "visibilitychange",
            () => {

                if (document.hidden) {

                    videos.forEach(
                        video => {

                            video.pause();

                        }
                    );

                }

            }
        );

    }



    // =========================================================
    // MAGNETIC BUTTONS
    // =========================================================

    function initMagneticButtons() {

        if (
            !hasFinePointer ||
            prefersReducedMotion
        ) {

            return;

        }


        const buttons =
            $$(".magnetic");


        buttons.forEach(
            button => {

                button.addEventListener(
                    "mousemove",
                    event => {

                        const rect =
                            button
                                .getBoundingClientRect();


                        const x =

                            event.clientX -
                            rect.left -
                            rect.width / 2;


                        const y =

                            event.clientY -
                            rect.top -
                            rect.height / 2;


                        button.style.transform = `

                            translate(
                                ${x * .1}px,
                                ${y * .1}px
                            )

                        `;

                    }
                );


                button.addEventListener(
                    "mouseleave",
                    () => {

                        button.style.transform =
                            "";

                    }
                );

            }
        );

    }



    // =========================================================
    // NUMBER ANIMATION
    // =========================================================

    function initNumberAnimation() {

        const numbers =
            $$("[data-number]");


        if (
            !numbers.length ||
            prefersReducedMotion
        ) {

            return;

        }


        if (
            !("IntersectionObserver" in window)
        ) {

            return;

        }


        const observer =
            new IntersectionObserver(

                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {

                                return;

                            }


                            animateNumber(
                                entry.target
                            );


                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },

                {
                    threshold: .6
                }

            );


        numbers.forEach(
            number => {

                observer.observe(
                    number
                );

            }
        );

    }



    function animateNumber(element) {

        const target =
            Number(
                element.dataset.number
            );


        if (
            Number.isNaN(target)
        ) {

            return;

        }


        const original =
            element.textContent.trim();


        const prefix =
            original.startsWith("+")
                ? "+"
                : "";


        const suffix =
            original.includes("%")
                ? "%"
                : "";


        const duration =
            900;


        const startTime =
            performance.now();


        function animation(
            currentTime
        ) {

            const progress =
                Math.min(

                    (
                        currentTime -
                        startTime
                    )

                    /

                    duration,

                    1

                );


            const easing =
                1 -
                Math.pow(
                    1 -
                    progress,
                    3
                );


            const current =
                Math.round(
                    target *
                    easing
                );


            element.textContent =
                `${prefix}${current}${suffix}`;


            if (progress < 1) {

                requestAnimationFrame(
                    animation
                );

            }

        }


        requestAnimationFrame(
            animation
        );

    }



    // =========================================================
    // BACKGROUND PARALLAX
    // =========================================================

    function initBackgroundParallax() {

        if (prefersReducedMotion) {

            return;

        }


        const background =
            $(".bg-grid");


        if (!background) {

            return;

        }


        let ticking =
            false;


        function update() {

            const y =
                window.scrollY *
                .035;


            background.style.transform =
                `translate3d(0,${y}px,0)`;


            ticking =
                false;

        }


        window.addEventListener(
            "scroll",
            () => {

                if (ticking) {

                    return;

                }


                ticking =
                    true;


                requestAnimationFrame(
                    update
                );

            },
            {
                passive: true
            }
        );

    }



    // =========================================================
    // EXTERNAL LINKS
    // =========================================================

    function initExternalLinks() {

        $$(
            'a[target="_blank"]'
        ).forEach(
            link => {

                const rel =
                    new Set(

                        (
                            link.getAttribute(
                                "rel"
                            )
                            ||
                            ""
                        )

                            .split(/\s+/)

                            .filter(Boolean)

                    );


                rel.add(
                    "noopener"
                );


                rel.add(
                    "noreferrer"
                );


                link.setAttribute(

                    "rel",

                    Array
                        .from(rel)
                        .join(" ")

                );

            }
        );

    }



    // =========================================================
    // IMAGES
    // =========================================================

    function initImages() {

        $$("img").forEach(
            image => {

                image.decoding =
                    "async";

            }
        );

    }



    // =========================================================
    // INITIALIZE
    // =========================================================

    function init() {

        initReveal();

        initNavbar();

        initMobileMenu();

        initSmoothScroll();

        initActiveNavigation();

        initScrollProgress();

        initModal();

        initTiltCards();

        initHeroParallax();

        initCursorGlow();

        initVideos();

        initMagneticButtons();

        initNumberAnimation();

        initBackgroundParallax();

        initExternalLinks();

        initImages();

    }



    // =========================================================
    // START
    // =========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(

            "DOMContentLoaded",

            init,

            {
                once: true
            }

        );

    }
    else {

        init();

    }

})();