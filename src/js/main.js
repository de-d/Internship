const submitButton = document.getElementById("submitBtn");

submitButton.addEventListener("click", () => {
    document.getElementById("form").style.display = "none";
    document.getElementById("success").style.display = "flex";
});