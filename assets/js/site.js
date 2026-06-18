$(function() {
    // ============================================
    // TOAST NOTIFICATIONS
    // ============================================
    function renderToast(message, type = 'info') {
        const colorClass = type === 'success' ? 'bg-success text-white' : 
                          type === 'error' ? 'bg-error text-white' : 
                          type === 'warning' ? 'bg-warning text-white' : 
                          'bg-primary text-white';
        const icon = type === 'success' ? '✓' : 
                    type === 'error' ? '✕' : 
                    type === 'warning' ? '⚠' : 'ℹ';
        
        const $toast = $(`
            <div class="toast fixed right-4 bottom-4 max-w-sm rounded-2xl p-4 shadow-floating z-50 ${colorClass} opacity-0 transform translate-y-4">
                <div class="flex items-center space-x-3">
                    <span class="text-xl font-bold">${icon}</span>
                    <span class="flex-1">${message}</span>
                    <button class="toast-close hover:opacity-70 transition-opacity">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        `);
        
        $('body').append($toast);
        
        // Animate in
        setTimeout(() => {
            $toast.removeClass('opacity-0 translate-y-4');
        }, 10);
        
        // Close button
        $toast.find('.toast-close').on('click', function() {
            $toast.addClass('opacity-0 translate-y-4');
            setTimeout(() => $toast.remove(), 300);
        });
        
        // Auto dismiss
        setTimeout(() => {
            $toast.addClass('opacity-0 translate-y-4');
            setTimeout(() => $toast.remove(), 300);
        }, 5000);
    }

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    function initMobileNav() {
        $('nav').each(function() {
            const $nav = $(this);
            const $desktopMenu = $nav.find('.hidden.md\\:block').first();
            const $toggleButton = $nav.find('.md\\:hidden button').first();
            
            if (!$desktopMenu.length || !$toggleButton.length) {
                return;
            }

            const $mobileMenu = $(`
                <div class="mobile-nav hidden bg-white border-t border-gray-200 shadow-soft md:hidden">
                    <div class="px-4 py-6">
                        <ul class="space-y-2"></ul>
                    </div>
                </div>
            `);
            
            const $menuList = $mobileMenu.find('ul');
            const $navLinks = $desktopMenu.find('a');
            
            $navLinks.each(function() {
                const $link = $(this);
                const text = $link.text().trim();
                const href = $link.attr('href');
                const isButton = $link.hasClass('btn-primary');
                
                if (isButton) {
                    const $li = $('<li class="pt-4"></li>');
                    const $buttonLink = $(`<a href="${href}" class="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">${text}</a>`);
                    $li.append($buttonLink);
                    $menuList.append($li);
                } else {
                    const $li = $('<li></li>');
                    const $listLink = $(`<a href="${href}" class="block py-3 px-4 text-text-secondary hover:text-primary hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-0">${text}</a>`);
                    $li.append($listLink);
                    $menuList.append($li);
                }
            });
            
            $nav.after($mobileMenu);

            let isMenuOpen = false;
            
            $toggleButton.on('click', function() {
                isMenuOpen = !isMenuOpen;
                $mobileMenu.toggleClass('hidden');
                
                // Animate hamburger icon
                const $svg = $toggleButton.find('svg');
                if (isMenuOpen) {
                    $svg.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>');
                } else {
                    $svg.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>');
                }
            });

            // Close menu when clicking a link
            $mobileMenu.find('a').on('click', function() {
                isMenuOpen = false;
                $mobileMenu.addClass('hidden');
                const $svg = $toggleButton.find('svg');
                $svg.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>');
            });

            $(window).on('resize', function() {
                if ($(window).width() >= 768 && !$mobileMenu.hasClass('hidden')) {
                    isMenuOpen = false;
                    $mobileMenu.addClass('hidden');
                    const $svg = $toggleButton.find('svg');
                    $svg.html('<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>');
                }
            });
        });
    }

    // ============================================
    // ACTIVE NAVIGATION
    // ============================================
    function initActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        $('nav .nav-link[href]').each(function() {
            const href = $(this).attr('href').split('/').pop();
            if (href === currentPage) {
                $(this).addClass('active');
                $(this).attr('aria-current', 'page');
            } else {
                $(this).removeClass('active');
                $(this).removeAttr('aria-current');
            }
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    function initSmoothAnchors() {
        $('a[href^="#"]').on('click', function(event) {
            const target = $(this).attr('href');
            if (target.length > 1 && $(target).length) {
                event.preventDefault();
                const offset = $(target).offset().top - 90;
                $('html, body').animate({ scrollTop: offset }, 600, 'easeInOutCubic');
            }
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    function initScrollAnimations() {
        const $elements = $('.animate-fade-in, .animate-slide-up, .card, .glass-effect');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const $el = $(entry.target);
                    $el.addClass('animate-in');
                    $el.css({
                        opacity: '1',
                        transform: 'translateY(0)'
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        $elements.each(function() {
            const $el = $(this);
            if (!$el.hasClass('animate-in')) {
                $el.css({
                    opacity: '0',
                    transform: 'translateY(20px)',
                    transition: 'opacity 0.6s ease, transform 0.6s ease'
                });
                observer.observe(this);
            }
        });
    }

    // ============================================
    // BACK TO TOP BUTTON
    // ============================================
    function initBackToTop() {
        const $backToTop = $(`
            <button id="back-to-top" class="fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-floating opacity-0 invisible transition-all duration-300 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 z-40">
                <svg class="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
            </button>
        `);
        
        $('body').append($backToTop);
        
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 500) {
                $backToTop.removeClass('opacity-0 invisible');
            } else {
                $backToTop.addClass('opacity-0 invisible');
            }
        });
        
        $backToTop.on('click', function() {
            $('html, body').animate({ scrollTop: 0 }, 600, 'easeInOutCubic');
        });
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================
    function initScrollProgress() {
        const $progressBar = $(`
            <div id="scroll-progress" class="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-accent z-50 transition-all duration-150" style="width: 0%"></div>
        `);
        
        $('body').append($progressBar);
        
        $(window).on('scroll', function() {
            const scrollTop = $(this).scrollTop();
            const docHeight = $(document).height() - $(this).height();
            const scrollPercent = (scrollTop / docHeight) * 100;
            $progressBar.css('width', scrollPercent + '%');
        });
    }

    // ============================================
    // FAQ ACCORDION
    // ============================================
    function initFAQAccordion() {
        const $faqSection = $('section').filter(function() {
            return $(this).find('h2').first().text().trim().toLowerCase().includes('frequently asked questions');
        });
        
        if (!$faqSection.length) {
            return;
        }

        const $faqCards = $faqSection.find('.card');
        $faqCards.each(function(index) {
            const $card = $(this);
            const $button = $card.find('button').first();
            const $answer = $card.find('div').last();
            
            if (!$button.length || !$answer.length) {
                return;
            }
            
            $answer.hide();
            $button.css('cursor', 'pointer');
            const $icon = $button.find('svg').first();
            
            $button.on('click', function() {
                const isOpen = $answer.is(':visible');
                $answer.slideToggle(300);
                if ($icon.length) {
                    $icon.toggleClass('transform rotate-180');
                }
                $button.toggleClass('text-primary');
            });
            
            if (index === 0) {
                $answer.show();
                if ($icon.length) {
                    $icon.addClass('transform rotate-180');
                }
                $button.addClass('text-primary');
            }
        });

        $faqSection.find('input[type="text"]').on('input', function() {
            const query = $(this).val().toLowerCase();
            $faqCards.each(function() {
                const $card = $(this);
                const text = $card.text().toLowerCase();
                $card.toggle(text.indexOf(query) !== -1);
            });
        });
    }

    // ============================================
    // FILTER RESET
    // ============================================
    function initFilterReset() {
        const $resetButton = $('button').filter(function() {
            return $(this).text().trim().toLowerCase() === 'reset all filters';
        }).first();
        
        if (!$resetButton.length) {
            return;
        }

        $resetButton.on('click', function() {
            const $scope = $(this).closest('aside, section, main');
            $scope.find('input[type="text"], input[type="email"], input[type="tel"], input[type="search"]').val('');
            $scope.find('select').prop('selectedIndex', 0);
            $scope.find('input[type="checkbox"], input[type="radio"]').prop('checked', false);
            renderToast('Filters reset successfully.', 'success');
        });
    }

    // ============================================
    // FORM VALIDATION & SUBMISSION
    // ============================================
    function initForms() {
        $('form').each(function() {
            const $form = $(this);
            
            // Real-time validation
            $form.find('input[required], textarea[required], select[required]').on('blur', function() {
                const $input = $(this);
                const value = $input.val().trim();
                
                if (!value) {
                    $input.addClass('border-error');
                    $input.removeClass('border-success');
                } else {
                    $input.removeClass('border-error');
                    $input.addClass('border-success');
                }
            });
            
            // Email validation
            $form.find('input[type="email"]').on('blur', function() {
                const $input = $(this);
                const email = $input.val().trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                if (email && !emailRegex.test(email)) {
                    $input.addClass('border-error');
                    $input.removeClass('border-success');
                    renderToast('Please enter a valid email address.', 'error');
                }
            });
            
            // Form submission
            $form.on('submit', function(event) {
                event.preventDefault();
                
                let isValid = true;
                $form.find('input[required], textarea[required], select[required]').each(function() {
                    if (!$(this).val().trim()) {
                        isValid = false;
                        $(this).addClass('border-error');
                    }
                });
                
                if (!isValid) {
                    renderToast('Please fill in all required fields.', 'error');
                    return;
                }
                
                // Simulate form submission
                const $submitBtn = $form.find('button[type="submit"]');
                const originalText = $submitBtn.text();
                $submitBtn.prop('disabled', true).text('Sending...');
                
                setTimeout(() => {
                    $submitBtn.prop('disabled', false).text(originalText);
                    renderToast('Your message has been received. We\'ll be in touch shortly.', 'success');
                    $form[0].reset();
                    $form.find('.border-success, .border-error').removeClass('border-success border-error');
                }, 1500);
            });
        });
    }

    // ============================================
    // SEARCH FUNCTIONALITY
    // ============================================
    function initSearchButton() {
        const $searchButton = $('button').filter(function() {
            return $(this).text().trim().toLowerCase() === 'search properties';
        }).first();
        
        if (!$searchButton.length) {
            return;
        }
        
        $searchButton.on('click', function() {
            const $searchInput = $(this).closest('.glass-effect, form, section').find('input[type="text"]').first();
            const searchTerm = $searchInput ? $searchInput.val().trim() : '';
            
            if (searchTerm) {
                window.location.href = 'property-listings.html?search=' + encodeURIComponent(searchTerm);
            } else {
                window.location.href = 'property-listings.html';
            }
        });

        // Search on Enter key
        $('input[placeholder*="search"], input[placeholder*="Search"]').on('keypress', function(e) {
            if (e.which === 13) {
                $searchButton.click();
            }
        });
    }

    // ============================================
    // LOAD MORE BUTTONS
    // ============================================
    function initLoadMoreButtons() {
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase().includes('load more');
        }).on('click', function() {
            const $btn = $(this);
            $btn.prop('disabled', true).text('Loading...');
            
            setTimeout(() => {
                $btn.prop('disabled', false).text('Load More');
                renderToast('More results loaded successfully.', 'success');
            }, 1000);
        });
    }

    // ============================================
    // PROPERTY ACTIONS
    // ============================================
    function initPropertyActions() {
        // Save search
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase().includes('save search');
        }).on('click', function() {
            const $btn = $(this);
            $btn.toggleClass('bg-primary text-white');
            const isSaved = $btn.hasClass('bg-primary');
            renderToast(isSaved ? 'Search saved successfully.' : 'Search removed from saved items.', isSaved ? 'success' : 'info');
        });

        // Compare properties
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase().includes('compare');
        }).on('click', function() {
            const $btn = $(this);
            $btn.toggleClass('bg-accent text-white');
            const isComparing = $btn.hasClass('bg-accent');
            renderToast(isComparing ? 'Added to comparison.' : 'Removed from comparison.', isComparing ? 'success' : 'info');
        });

        // Favorite/heart buttons
        $('button').filter(function() {
            return $(this).find('svg').length && $(this).find('svg').attr('d') && $(this).find('svg').attr('d').includes('4.318');
        }).on('click', function() {
            const $svg = $(this).find('svg');
            const isFilled = $svg.attr('fill') === 'currentColor';
            $svg.attr('fill', isFilled ? 'none' : 'currentColor');
            renderToast(isFilled ? 'Removed from favorites.' : 'Added to favorites.', isFilled ? 'info' : 'success');
        });
    }

    // ============================================
    // AGENT CONNECT BUTTONS
    // ============================================
    function initAgentConnect() {
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase() === 'connect';
        }).on('click', function() {
            const $agentCard = $(this).closest('.card-glass, .card');
            const agentName = $agentCard.find('h3').text().trim();
            renderToast(`Connecting with ${agentName}...`, 'info');
            
            setTimeout(() => {
                renderToast(`Connection request sent to ${agentName}.`, 'success');
            }, 1000);
        });
    }

    // ============================================
    // INTERACTIVE BUTTONS
    // ============================================
    function initInteractions() {
        // Start chat
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase().includes('start chat');
        }).on('click', function() {
            renderToast('Live chat feature coming soon!', 'info');
        });

        // Subscribe buttons
        $('button').filter(function() {
            return $(this).text().trim().toLowerCase().includes('subscribe');
        }).on('click', function() {
            const $input = $(this).siblings('input[type="email"]');
            const email = $input ? $input.val().trim() : '';
            
            if (!email) {
                renderToast('Please enter your email address.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                renderToast('Please enter a valid email address.', 'error');
                return;
            }
            
            renderToast('Successfully subscribed to newsletter!', 'success');
            if ($input) $input.val('');
        });

        // Schedule consultation
        $('a[href="#consultation"]').on('click', function(e) {
            e.preventDefault();
            renderToast('Consultation booking feature coming soon!', 'info');
        });
    }

    // ============================================
    // PROPERTY CARD HOVER EFFECTS
    // ============================================
    function initPropertyCards() {
        $('.card, .card-glass').on('mouseenter', function() {
            $(this).addClass('shadow-floating');
        }).on('mouseleave', function() {
            $(this).removeClass('shadow-floating');
        });

        // Property card click
        $('.card').has('img').css('cursor', 'pointer').on('click', function() {
            const propertyTitle = $(this).find('h3').text().trim();
            if (propertyTitle) {
                window.location.href = 'individual-property.html';
            }
        });
    }

    // ============================================
    // IMAGE GALLERY/LIGHTBOX
    // ============================================
    function initLightbox() {
        const $lightbox = $(`
            <div id="lightbox" class="fixed inset-0 bg-black/90 z-50 hidden flex items-center justify-center">
                <button id="lightbox-close" class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <button id="lightbox-prev" class="absolute left-4 text-white hover:text-gray-300 transition-colors">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                </button>
                <button id="lightbox-next" class="absolute right-4 text-white hover:text-gray-300 transition-colors">
                    <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </button>
                <img id="lightbox-img" class="max-w-full max-h-full object-contain" src="" alt="">
            </div>
        `);
        
        $('body').append($lightbox);
        
        let currentImageIndex = 0;
        let images = [];
        
        // Open lightbox on image click
        $('img').on('click', function() {
            const $img = $(this);
            if ($img.closest('button').length) return; // Don't open if inside button
            
            images = [];
            currentImageIndex = 0;
            
            // Get all images in the same container
            const $container = $img.closest('.grid, .flex, section');
            $container.find('img').each(function(index) {
                images.push($(this).attr('src'));
                if ($(this).attr('src') === $img.attr('src')) {
                    currentImageIndex = index;
                }
            });
            
            if (images.length === 0) {
                images.push($img.attr('src'));
            }
            
            $('#lightbox-img').attr('src', images[currentImageIndex]);
            $lightbox.removeClass('hidden');
        });
        
        // Close lightbox
        $('#lightbox-close, #lightbox').on('click', function(e) {
            if (e.target === this) {
                $lightbox.addClass('hidden');
            }
        });
        
        // Navigate images
        $('#lightbox-prev').on('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            $('#lightbox-img').attr('src', images[currentImageIndex]);
        });
        
        $('#lightbox-next').on('click', function(e) {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex + 1) % images.length;
            $('#lightbox-img').attr('src', images[currentImageIndex]);
        });
        
        // Keyboard navigation
        $(document).on('keydown', function(e) {
            if ($lightbox.hasClass('hidden')) return;
            
            if (e.key === 'Escape') {
                $lightbox.addClass('hidden');
            } else if (e.key === 'ArrowLeft') {
                $('#lightbox-prev').click();
            } else if (e.key === 'ArrowRight') {
                $('#lightbox-next').click();
            }
        });
    }

    // ============================================
    // DYNAMIC COUNTER ANIMATION
    // ============================================
    function initCounters() {
        const $counters = $('.text-3xl.font-bold, .text-2xl.font-bold');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const $el = $(entry.target);
                    const text = $el.text();
                    const numericValue = parseFloat(text.replace(/[^0-9.]/g, ''));
                    
                    if (!isNaN(numericValue) && numericValue > 0) {
                        $el.data('target', numericValue);
                        $el.data('current', 0);
                        
                        const duration = 2000;
                        const steps = 60;
                        const increment = numericValue / steps;
                        let current = 0;
                        
                        const timer = setInterval(() => {
                            current += increment;
                            if (current >= numericValue) {
                                current = numericValue;
                                clearInterval(timer);
                            }
                            
                            let displayValue = current;
                            if (text.includes('%')) {
                                displayValue = current.toFixed(1) + '%';
                            } else if (text.includes('$')) {
                                displayValue = '$' + (current >= 1000000 ? (current / 1000000).toFixed(1) + 'B' : 
                                                   current >= 1000 ? (current / 1000).toFixed(1) + 'K' : 
                                                   current.toFixed(0));
                            } else if (text.includes('M')) {
                                displayValue = current.toFixed(1) + 'M';
                            } else {
                                displayValue = Math.floor(current);
                            }
                            
                            $el.text(displayValue);
                        }, duration / steps);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        $counters.each(function() {
            observer.observe(this);
        });
    }

    // ============================================
    // LAZY LOADING ENHANCEMENT
    // ============================================
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            $('img[loading="lazy"]').each(function() {
                imageObserver.observe(this);
            });
        }
    }

    // ============================================
    // STICKY NAVIGATION SHADOW
    // ============================================
    function initStickyNav() {
        const $nav = $('nav.sticky');
        
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 10) {
                $nav.addClass('shadow-lg');
            } else {
                $nav.removeClass('shadow-lg');
            }
        });
    }

    // ============================================
    // VIEW TOGGLE (GRID/LIST)
    // ============================================
    function initViewToggle() {
        const $viewButtons = $('.bg-gray-100').find('button');
        
        $viewButtons.on('click', function() {
            const $btn = $(this);
            $viewButtons.removeClass('bg-primary text-white').addClass('text-text-secondary');
            $btn.removeClass('text-text-secondary').addClass('bg-primary text-white');
            
            const $grid = $btn.closest('section').find('.grid');
            if ($grid.length) {
                if ($btn.index() === 0) {
                    $grid.removeClass('grid-cols-1').addClass('grid-cols-2 lg:grid-cols-3');
                } else if ($btn.index() === 1) {
                    $grid.removeClass('grid-cols-2 lg:grid-cols-3').addClass('grid-cols-1');
                }
            }
        });
    }

    // ============================================
    // PRICE RANGE SLIDER
    // ============================================
    function initPriceSlider() {
        const $priceInputs = $('input[type="number"]').filter(function() {
            return $(this).attr('placeholder') && $(this).attr('placeholder').toLowerCase().includes('price');
        });
        
        if ($priceInputs.length >= 2) {
            const $minPrice = $priceInputs.first();
            const $maxPrice = $priceInputs.last();
            
            $minPrice.on('change', function() {
                const minVal = parseInt($(this).val()) || 0;
                const maxVal = parseInt($maxPrice.val()) || 10000000;
                if (minVal > maxVal) {
                    $(this).val(maxVal);
                }
            });
            
            $maxPrice.on('change', function() {
                const maxVal = parseInt($(this).val()) || 10000000;
                const minVal = parseInt($minPrice.val()) || 0;
                if (maxVal < minVal) {
                    $(this).val(minVal);
                }
            });
        }
    }

    // ============================================
    // NEIGHBORHOOD MAP INTERACTIONS
    // ============================================
    function initMapInteractions() {
        $('.animate-pulse-soft').on('click', function() {
            const $pin = $(this);
            const color = $pin.css('background-color');
            
            // Show tooltip with neighborhood info
            const tooltip = $(`
                <div class="absolute bg-white rounded-lg shadow-lg p-3 text-sm z-10" style="left: ${$pin.position().left + 20}px; top: ${$pin.position().top - 40}px;">
                    <div class="font-semibold text-text-primary">Neighborhood Info</div>
                    <div class="text-text-secondary">Click to view details</div>
                </div>
            `);
            
            $pin.closest('.relative').append(tooltip);
            
            setTimeout(() => tooltip.remove(), 2000);
        });
    }

    // ============================================
    // INITIALIZE ALL FEATURES
    // ============================================
    initMobileNav();
    initActiveNav();
    initSmoothAnchors();
    initScrollAnimations();
    initBackToTop();
    initScrollProgress();
    initFAQAccordion();
    initFilterReset();
    initForms();
    initSearchButton();
    initLoadMoreButtons();
    initPropertyActions();
    initAgentConnect();
    initInteractions();
    initPropertyCards();
    initLightbox();
    initCounters();
    initLazyLoading();
    initStickyNav();
    initViewToggle();
    initPriceSlider();
    initMapInteractions();
});
