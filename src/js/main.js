const submitButton = document.getElementById("submitBtn");

submitButton.addEventListener("click", () => {
    document.getElementById("form").style.display = "none";
    document.getElementById("success").style.display = "flex";
});

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = document.querySelectorAll('.footer__menu-checkbox');

    function toggleIcons() {
        if (window.innerWidth < 768) {
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    const openIcon = this.nextElementSibling.querySelector('.footer__menu-open');
                    const closeIcon = this.nextElementSibling.querySelector('.footer__menu-close');

                    if (this.checked) {
                        openIcon.style.display = 'none';
                        closeIcon.style.display = 'block';
                    } else {
                        openIcon.style.display = 'block';
                        closeIcon.style.display = 'none';
                    }
                });
            });
        }
    }

    toggleIcons();
});
