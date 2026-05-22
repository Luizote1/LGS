const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){
    reveals.forEach(item => {
        const top = item.getBoundingClientRect().top;

        if(top < window.innerHeight - 100){
            item.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

function openMedia(src){
    const modal = document.getElementById("mediaModal");
    const img = document.getElementById("modalImage");

    img.src = src;
    modal.classList.add("active");
}

function closeMedia(){
    document.getElementById("mediaModal").classList.remove("active");
}

const cards = document.querySelectorAll(".service, .project-media, .video-card");

cards.forEach(card => {
    card.addEventListener("mousemove", e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.boxShadow = `${(x - rect.width / 2) / 20}px ${(y - rect.height / 2) / 20}px 60px rgba(255,255,255,.08)`;
    });

    card.addEventListener("mouseleave", () => {
        card.style.boxShadow = "";
    });
});