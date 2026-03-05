document.addEventListener('DOMContentLoaded', () => {
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;

    function imageZoom(imgID, resultID, lensID) {
        let img, result, lens, cx, cy;
        img = document.getElementById(imgID);
        result = document.getElementById(resultID);
        lens = document.getElementById(lensID);

        /* Calculate the ratio between result DIV and lens: */
        cx = result.offsetWidth / lens.offsetWidth;
        cy = result.offsetHeight / lens.offsetHeight;

        /* Set background properties for the result DIV */
        result.style.backgroundImage = "url('" + img.src + "')";
        result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";

        /* Execute a function when someone moves the cursor over the image, or the lens: */
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);

        /* And also for touch screens: */
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);

        function moveLens(e) {
            let pos, x, y;
            /* Prevent any other actions that may occur when moving over the image */
            e.preventDefault();
            /* Get the cursor's x and y positions: */
            pos = getCursorPos(e);
            /* Calculate the position of the lens: */
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);
            /* Prevent the lens from being positioned outside the image: */
            if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
            if (x < 0) { x = 0; }
            if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
            if (y < 0) { y = 0; }
            /* Set the position of the lens: */
            lens.style.left = x + "px";
            lens.style.top = y + "px";
            /* Display what the lens "sees": */
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";

            /* Move the result window to follow the cursor (viewport relative) */
            // result.style.left = (e.clientX - result.offsetWidth / 2) + "px";
            // result.style.top = (e.clientY - result.offsetHeight / 2) + "px";
        }

        function getCursorPos(e) {
            let a, x = 0, y = 0;
            e = e || window.event;
            /* Get the x and y positions of the image: */
            a = img.getBoundingClientRect();
            /* Calculate the cursor's x and y coordinates, relative to the image: */
            x = e.clientX - a.left;
            y = e.clientY - a.top;
            return { x: x, y: y };
        }
    }

    // Initialize zoom
    setTimeout(() => {
        imageZoom("main-product-image", "img-zoom-result", "img-zoom-lens");
    }, 500);

    function updateGallery(index) {
        // Remove active class from all thumbnails
        thumbnails.forEach(thumb => thumb.classList.remove('active'));

        // Add active class to current thumbnail
        if (thumbnails[index]) {
            thumbnails[index].classList.add('active');

            // Set main image source directly from the thumbnail's image source
            const thumbImg = thumbnails[index].querySelector('img');
            // Adding a small fade effect for smoother transitions
            mainImage.style.opacity = 0;

            setTimeout(() => {
                mainImage.src = thumbImg.src;
                // Re-initialize zoom for the new image source
                const result = document.getElementById("img-zoom-result");
                result.style.backgroundImage = "url('" + thumbImg.src + "')";
                mainImage.style.opacity = 1;
            }, 150);
        }

        currentIndex = index;
    }

    // Add click events to thumbnails
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            if (currentIndex !== index) {
                updateGallery(index);
            }
        });
    });

    // Previous Button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            let newIndex = currentIndex - 1;
            if (newIndex < 0) {
                newIndex = thumbnails.length - 1;
            }
            updateGallery(newIndex);
        });
    }

    // Next Button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            let newIndex = currentIndex + 1;
            if (newIndex >= thumbnails.length) {
                newIndex = 0;
            }
            updateGallery(newIndex);
        });
    }

    // Applications Carousel Navigation
    const appCarousel = document.getElementById('app-carousel');
    const appPrevBtn = document.querySelector('.app-prev-btn');
    const appNextBtn = document.querySelector('.app-next-btn');

    if (appCarousel && appPrevBtn && appNextBtn) {
        // Find the width of one card + its gap. Gap is 24px.
        const scrollAmount = 420 + 32;

        appPrevBtn.addEventListener('click', () => {
            appCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        appNextBtn.addEventListener('click', () => {
            appCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // FAQ Accordion Functionality
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const chevron = faq.querySelector('.fa-chevron-up');
                if (chevron) {
                    chevron.classList.remove('fa-chevron-up');
                    chevron.classList.add('fa-chevron-down');
                }
            });

            // If the clicked one wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const chevron = item.querySelector('.fa-chevron-down');
                if (chevron) {
                    chevron.classList.remove('fa-chevron-down');
                    chevron.classList.add('fa-chevron-up');
                }
            }
        });
    });

    // Datasheet Modal Functionality
    const datasheetModal = document.getElementById('datasheet-modal');
    const openModalBtn = document.getElementById('download-datasheet-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const datasheetForm = document.getElementById('datasheet-form');
    const emailInput = document.getElementById('modal-email');
    const submitBtn = document.getElementById('submit-btn');

    if (openModalBtn && datasheetModal && closeModalBtn) {
        // Open Modal
        openModalBtn.addEventListener('click', (e) => {
            e.preventDefault();
            datasheetModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        // Close Modal (Button)
        closeModalBtn.addEventListener('click', () => {
            datasheetModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close Modal (Overlay click)
        datasheetModal.addEventListener('click', (e) => {
            if (e.target === datasheetModal) {
                datasheetModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Email Validation to activate button
        emailInput.addEventListener('input', () => {
            if (emailInput.checkValidity() && emailInput.value.length > 0) {
                submitBtn.classList.add('active');
            } else {
                submitBtn.classList.remove('active');
            }
        });

        // Handle Form Submission
        datasheetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            const contact = document.getElementById('modal-contact').value;

            // Simulation of success
            submitBtn.textContent = 'Sending...';
            submitBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert(`The full technical datasheet has been sent to ${email}. Check your inbox!`);
                datasheetModal.classList.remove('active');
                document.body.style.overflow = '';

                // Reset form
                datasheetForm.reset();
                submitBtn.textContent = 'Download Brochure';
                submitBtn.classList.remove('active');
                submitBtn.style.opacity = '1';
            }, 1000);
        });
    }

    // Callback/Quote Modal Functionality
    const quoteModal = document.getElementById('quote-modal');
    const quoteTriggers = document.querySelectorAll('.quote-modal-trigger');
    const closeQuoteBtn = document.getElementById('close-quote-modal');
    const quoteForm = document.getElementById('quote-form');
    const quoteSubmitBtn = document.getElementById('quote-submit-btn');

    if (quoteModal && quoteTriggers.length > 0) {
        // Open Modal (Any Trigger)
        quoteTriggers.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                quoteModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Close Modal (Button)
        if (closeQuoteBtn) {
            closeQuoteBtn.addEventListener('click', () => {
                quoteModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close Modal (Overlay click)
        quoteModal.addEventListener('click', (e) => {
            if (e.target === quoteModal) {
                quoteModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Validation to enable/disable submit button
        const validateQuoteForm = () => {
            const name = document.getElementById('quote-name').value;
            const email = document.getElementById('quote-email').value;
            const phone = document.getElementById('quote-phone').value;
            const isValidEmail = document.getElementById('quote-email').checkValidity();

            if (name.trim() !== '' && isValidEmail && phone.trim() !== '') {
                quoteSubmitBtn.classList.add('active');
            } else {
                quoteSubmitBtn.classList.remove('active');
            }
        };

        quoteForm.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', validateQuoteForm);
        });

        // Handle Submission
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            quoteSubmitBtn.textContent = 'Processing...';
            quoteSubmitBtn.style.opacity = '0.7';

            setTimeout(() => {
                alert("Thank you! We've received your request for a call back. An expert will reach out to you shortly.");
                quoteModal.classList.remove('active');
                document.body.style.overflow = '';

                // Reset
                quoteForm.reset();
                quoteSubmitBtn.textContent = 'Submit Form';
                quoteSubmitBtn.classList.remove('active');
                quoteSubmitBtn.style.opacity = '1';
            }, 1000);
        });
    }

    // Manufacturing Process Carousel Logic
    const processData = [
        {
            title: "High-Grade Raw Material Selection",
            desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
            features: ["PE100 grade material", "Optimal molecular weight distribution"],
            img: "images/Workers.jpg"
        },
        {
            title: "Precision Extrusion Technology",
            desc: "The raw material is melted and forced through a circular die at controlled temperatures to form the initial shape of the pipe.",
            features: ["High-torque extruder", "Consistent melt temperature control"],
            img: "images/engineer.jpg"
        },
        {
            title: "Multi-Stage Cooling System",
            desc: "The heated pipe is rapidly cooled using water spray in dedicated tanks to solidify the shape and set precise dimensions.",
            features: ["Automated temperature control", "Uniform cooling distribution"],
            img: "images/worker.jpg"
        },
        {
            title: "Vacuum Sizing and Calibration",
            desc: "Vacuum pressure is applied to the outside of the pipe to pull it against sizing sleeves for millimetre-perfect diameter and roundness.",
            features: ["High-precision sizing sleeves", "Consistent wall thickness"],
            img: "images/Workers.jpg"
        },
        {
            title: "Rigorous In-Line Inspection",
            desc: "Advanced ultrasonic sensors monitor every inch of pipe in real-time, detecting any deviations in density or dimensions.",
            features: ["Ultrasonic measurement", "Real-time fault detection"],
            img: "images/engineer.jpg"
        },
        {
            title: "Automated Identification marking",
            desc: "Every pipe is marked with critical data including material grade, standard compliance, and batch number for full traceability.",
            features: ["Laser marking interface", "ISO traceability compliance"],
            img: "images/worker.jpg"
        },
        {
            title: "Precision Automated Cutting",
            desc: "Pipes are cut to exact lengths using automated planetary saws that ensure clean, square ends ready for installation.",
            features: ["Clean-cut planetary saw", "Exact length tolerances"],
            img: "images/Workers.jpg"
        },
        {
            title: "Secure Packaging and Coiling",
            desc: "Finished pipes are meticulously bundled or coiled and prepared for secure transport using heavy-duty protective materials.",
            features: ["Bundle lifting for large sizes", "High-speed coiling systems"],
            img: "images/engineer.jpg"
        }
    ];

    let currentProcessIndex = 0;
    const processTabs = document.querySelectorAll('.process-tab');
    const processContent = document.querySelector('.process-content');
    const processPrevBtns = document.querySelectorAll('.process-prev-btn');
    const processNextBtns = document.querySelectorAll('.process-next-btn');

    if (processTabs.length > 0 && processContent) {
        const processTitle = processContent.querySelector('h3');
        const processDesc = processContent.querySelector('p');
        const processFeatures = processContent.querySelector('.process-features');
        const processImg = processContent.querySelector('.process-image img');
        const mobileBadge = document.querySelector('.badge-text');

        function updateProcessStep(index) {
            currentProcessIndex = index;
            const data = processData[index];

            // Update Tabs
            processTabs.forEach((tab, i) => {
                if (i === index) tab.classList.add('active');
                else tab.classList.remove('active');
            });

            // Update Content with a quick fade
            processContent.style.opacity = 0;

            setTimeout(() => {
                processTitle.textContent = data.title;
                processDesc.textContent = data.desc;
                processImg.src = data.img;

                // Update features list
                processFeatures.innerHTML = '';
                data.features.forEach(feature => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i class="fa-solid fa-circle-check check-icon"></i> ${feature}`;
                    processFeatures.appendChild(li);
                });

                // Update mobile progress text
                if (mobileBadge) {
                    const tabName = processTabs[index].textContent;
                    mobileBadge.textContent = `Step ${index + 1}/8: ${tabName}`;
                }

                processContent.style.opacity = 1;
            }, 150);

            // Sync scroll for tabs on mobile
            if (window.innerWidth < 768) {
                processTabs[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }

        // Add Tab Click Events
        processTabs.forEach((tab, index) => {
            tab.addEventListener('click', () => updateProcessStep(index));
        });

        // Add Nav Button Events
        processPrevBtns.forEach(processPrevBtn => {
            processPrevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = currentProcessIndex - 1;
                if (newIndex < 0) newIndex = processData.length - 1;
                updateProcessStep(newIndex);
            });
        });

        processNextBtns.forEach(processNextBtn => {
            processNextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                let newIndex = currentProcessIndex + 1;
                if (newIndex >= processData.length) newIndex = 0;
                updateProcessStep(newIndex);
            });
        });

        // Initialize Transition property for process content
        processContent.style.transition = 'opacity 0.2s ease';
    }

    // ─────────────────────────────────────────────────────────
    //  SCROLL BEHAVIOUR
    //  · Navbar hides on scroll-down, slides back on scroll-up
    //  · Sticky bar appears once product-details leaves viewport
    //  · Navbar "pushes" the sticky bar — bar top = navbar height
    //    when navbar visible, 0 when navbar is hidden
    // ─────────────────────────────────────────────────────────
    (function initScrollBehaviour() {
        const navbar = document.querySelector('.navbar');
        const stickyBar = document.getElementById('sticky-bar');
        const stickyImg = document.getElementById('sticky-bar-img');
        const mainImg = document.getElementById('main-product-image');
        const details = document.querySelector('.product-details');

        if (!navbar) return;

        // ── measure & store navbar height as CSS var ──
        let navH = 0;
        function measureNav() {
            navH = navbar.offsetHeight;
            document.documentElement.style.setProperty('--navbar-height', navH + 'px');
        }
        measureNav();
        window.addEventListener('resize', measureNav);

        // ── set sticky bar top so navbar "pushes" it ──
        function setStickyTop(navbarVisible) {
            if (!stickyBar) return;
            stickyBar.style.top = navbarVisible ? navH + 'px' : '0px';
        }

        // initialise to sit below navbar
        setStickyTop(true);

        let lastY = window.scrollY;
        let ticking = false;
        const THRESHOLD = 80;          // px before we start hiding the navbar

        function onScroll() {
            if (ticking) return;
            ticking = true;

            requestAnimationFrame(() => {
                const y = window.scrollY;
                const goingDown = y > lastY;
                const pastThresh = y > THRESHOLD;

                // ── Navbar: hide scrolling down, reveal scrolling up ──
                const shouldHide = goingDown && pastThresh;
                navbar.classList.toggle('navbar-hidden', shouldHide);
                navbar.classList.toggle('navbar-scrolled', y > 0);

                // ── Update sticky bar top to match navbar state ──
                setStickyTop(!shouldHide);

                // ── Sticky bar: show once product-details fully off screen ──
                if (stickyBar && details) {
                    const gone = details.getBoundingClientRect().bottom < 0;
                    stickyBar.classList.toggle('is-visible', gone);
                }

                lastY = y;
                ticking = false;
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // ── Keep sticky bar thumbnail in sync with active gallery image ──
        if (stickyImg && mainImg) {
            new MutationObserver(() => {
                stickyImg.src = mainImg.src;
            }).observe(mainImg, { attributes: true, attributeFilter: ['src'] });
        }
    })();
});
