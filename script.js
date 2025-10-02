const downloadButton = document.querySelector("#download-cv");
const changeThemeButton = document.querySelector("#change-theme");
const changeThemeIcon = document.querySelector("#change-theme-icon");
const sections = document.querySelectorAll("section, #summary");
const navLinks = document.querySelectorAll(".nav-rail-link");

downloadButton.addEventListener("click", function (e) {
  e.preventDefault();

  const fileUrl = "assets/andreev.pdf";
  const fileName = "andreev.pdf";

  fetch(fileUrl)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      alert("Failed to download file");
    });
});

function setActiveSection() {
  let currentSection = "";
  const scrollPosition = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (
      scrollPosition >= sectionTop &&
      scrollPosition < sectionTop + sectionHeight
    ) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
  });

  if (currentSection) {
    const activeLink = document.querySelector(
      `.nav-rail a[href="#${currentSection}"]`
    );
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
}

function setChangeThemeIcon() {
  const currentTheme = ui("mode");
  const icon = currentTheme === "dark" ? "light_mode" : "dark_mode";
  changeThemeIcon.textContent = icon;
}

function changeTheme() {
  const currentTheme = ui("mode");
  const mode = currentTheme === "dark" ? "light" : "dark";
  ui("mode", mode);
  setChangeThemeIcon();
}

window.addEventListener("scroll", setActiveSection);
changeThemeButton.addEventListener("click", changeTheme);

setActiveSection();
setChangeThemeIcon();

console.log(ui("mode"));
