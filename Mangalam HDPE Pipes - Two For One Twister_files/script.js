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
            result.style.left = (e.clientX - result.offsetWidth / 2) + "px";
            result.style.top = (e.clientY - result.offsetHeight / 2) + "px";
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
        const scrollAmount = 420 + 24;

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
});
