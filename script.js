document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');
    const scrollToTop = document.getElementById('scrollToTop');
    const registerForm = document.getElementById('registerForm');
    const formMessage = document.getElementById('formMessage');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            scrollToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            scrollToTop.classList.remove('visible');
        }
    });

    scrollToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.step, .benefit-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    animateCounter(num);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const data = Object.fromEntries(formData);

        if (!validateForm(data)) {
            return;
        }

        const submitButton = registerForm.querySelector('.btn-submit');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري الإرسال...';
        submitButton.disabled = true;

        fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                formMessage.className = 'form-message success';
                formMessage.textContent = 'شكراً لك! تم استلام طلبك بنجاح. سنتواصل معك قريباً.';
                registerForm.reset();
            } else {
                throw new Error(result.message || 'حدث خطأ أثناء التسجيل');
            }
        })
        .catch(error => {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.';
            console.error('خطأ في التسجيل:', error);
        })
        .finally(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;

            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        });
    });

    function validateForm(data) {
        if (!data.userType) {
            showError('الرجاء اختيار نوع الشراكة');
            return false;
        }

        if (!data.fullName || data.fullName.length < 3) {
            showError('الرجاء إدخال الاسم الكامل (3 أحرف على الأقل)');
            return false;
        }

        if (!data.phone || !/^[0-9]{10}$/.test(data.phone)) {
            showError('الرجاء إدخال رقم هاتف صحيح (10 أرقام)');
            return false;
        }

        if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showError('الرجاء إدخال بريد إلكتروني صحيح');
            return false;
        }

        if (!data.address || data.address.length < 5) {
            showError('الرجاء إدخال عنوان صحيح');
            return false;
        }

        return true;
    }

    function showError(message) {
        formMessage.className = 'form-message error';
        formMessage.textContent = message;

        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 4000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const parallaxElements = document.querySelectorAll('.hero-overlay');
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    });
});
