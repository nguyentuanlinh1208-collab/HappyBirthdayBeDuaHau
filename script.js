document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 1000, once: false, mirror: true });

    // --- LOGIC ĐẾM NGƯỢC (COUNTDOWN) ---
    const countdownContainer = document.getElementById('countdown-container');
    const welcomeOverlay = document.getElementById('welcome-overlay');

    // CÀI ĐẶT THỜI GIAN ĐÍCH: Tháng/Ngày/Năm Giờ:Phút:Giây
    // Lưu ý: JavaScript dùng tên tháng tiếng Anh (Jan, Feb...).
    // Cài đặt ngày: 13 Tháng 1 Năm 2027
    const targetDate = new Date("Feb 05, 2026 00:00:00").getTime();

    // Cập nhật mỗi 1 giây
    const timerInterval = setInterval(function() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        // Tính toán thời gian
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Hiển thị ra màn hình
        document.getElementById("days").innerText = days < 10 ? "0" + days : days;
        document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

        // --- KIỂM TRA: NẾU ĐÃ ĐẾN GIỜ (Hoặc quá giờ) ---
        if (distance < 0) {
            clearInterval(timerInterval);
            // Ẩn màn hình đếm ngược
            countdownContainer.style.display = "none";
            // Hiện màn hình Chào để bấm mở quà
            welcomeOverlay.style.display = "flex";
        } else {
            // Nếu chưa đến giờ thì ẩn màn hình chào, chỉ hiện đếm ngược
            welcomeOverlay.style.display = "none";
        }
    }, 1000);


    // --- CÁC LOGIC KHÁC GIỮ NGUYÊN ---
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        autoplay: { delay: 3000, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", clickable: true },
    });
    
    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');

    document.querySelectorAll('.swiper-slide').forEach(slide => {
        const img = slide.querySelector('img');
        if(img) {
            slide.style.setProperty('--bg-image', `url(${img.src})`);
            slide.addEventListener('click', () => {
                lightbox.style.display = "flex";
                lightboxImg.src = img.src;
                swiper.autoplay.stop();
            });
        }
    });

    lightboxClose.addEventListener('click', () => {
        lightbox.style.display = "none";
        swiper.autoplay.start();
    });
    lightbox.addEventListener('click', (e) => {
        if(e.target !== lightboxImg) {
            lightbox.style.display = "none";
            swiper.autoplay.start();
        }
    });

    // Music Logic
    const btnEnter = document.getElementById('btn-enter');
    const bgMusic = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const icon = musicBtn.querySelector('i');
    let isPlaying = false;

    btnEnter.addEventListener('click', () => {
        bgMusic.play().then(() => {
            isPlaying = true;
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }).catch(err => console.log("Lỗi phát nhạc:", err));

        welcomeOverlay.style.opacity = '0';
        setTimeout(() => {
            welcomeOverlay.style.display = 'none';
            document.querySelector('.header-section h1').style.animationPlayState = 'running';
        }, 800);
    });
    
    musicBtn.addEventListener('click', () => {
        if(isPlaying) {
            bgMusic.pause();
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        } else {
            bgMusic.play();
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
        }
        isPlaying = !isPlaying;
    });

    // Floating Hearts
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 15 + 10; 
        heart.style.width = `${size}px`;
        heart.style.height = `${size}px`;
        heart.style.setProperty('--tx', `${(Math.random() - 0.5) * 200}px`);
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 8000); 
    }
    setInterval(createFloatingHeart, 600);

    // Gift Box Logic
    const giftBox = document.getElementById('giftBox');
    const modal = document.getElementById('qrModal');
    const closeBtn = document.querySelector('.close-btn');

    giftBox.addEventListener('click', () => {
        giftBox.style.transition = "all 0.5s ease";
        giftBox.style.transform = "scale(3) rotate(15deg)";
        giftBox.style.opacity = "0";
        triggerFireworks();
        setTimeout(() => { modal.style.display = 'flex'; }, 500);
    });

    closeBtn.addEventListener('click', () => { modal.style.display = 'none'; });
    window.addEventListener('click', (e) => { if (e.target == modal) modal.style.display = 'none'; });

    function triggerFireworks() {
        var duration = 3 * 1000;
        var end = Date.now() + duration;
        (function frame() {
            confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, zIndex: 10002 });
            confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, zIndex: 10002 });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
    
    const footer = document.getElementById('footer');
    let footerFireworksTriggered = false;
    window.addEventListener('scroll', () => {
        const position = footer.getBoundingClientRect();
        if(position.top < window.innerHeight && !footerFireworksTriggered) {
            footerFireworksTriggered = true;
            triggerFireworks();
        }

    });
});