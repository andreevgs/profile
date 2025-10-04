const downloadButton = document.querySelector("#download-cv");
const downloadFAB = document.querySelector("#download-cv-fab");
const changeThemeButton = document.querySelector("#change-theme");
const changeThemeIcon = document.querySelector("#change-theme-icon");
const sections = document.querySelectorAll("section, #summary");
const navRailLinks = document.querySelectorAll(".nav-rail-link");
const navBarLinks = document.querySelectorAll(".nav-bar-link");

const scrollSpeedThreshold = 12;
const minScrollDistance = 0;

let lastScrollTop = 0;
let lastScrollTime = Date.now();

function downloadCV(e) {
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
    .catch(() => {
      alert("Failed to download file");
    });
}

function setActiveSection() {
  let currentSection = "";
  const scrollPosition = window.scrollY + 100;
  const links = [...navRailLinks, ...navBarLinks];

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

  links.forEach((link) => {
    link.classList.remove("active");
  });

  if (currentSection) {
    const activeRailLink = document.querySelector(
      `.nav-rail a[href="#${currentSection}"]`
    );
    const activeBarLink = document.querySelector(
      `.nav-bar a[href="#${currentSection}"]`
    );
    if (activeRailLink) {
      activeRailLink.classList.add("active");
    }
    if (activeBarLink) {
      activeBarLink.classList.add("active");
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

function handleChangeFAB() {
  const currentTime = Date.now();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const isBouncing = scrollTop < 0 || scrollTop > maxScroll;

  if (isBouncing) {
    return;
  }

  if (Math.abs(scrollTop - lastScrollTop) < minScrollDistance) {
    lastScrollTop = scrollTop;
    return;
  }
  const timeDiff = currentTime - lastScrollTime;
  const scrollDiff = Math.abs(scrollTop - lastScrollTop);
  const scrollSpeed = timeDiff > 0 ? (scrollDiff / timeDiff) * 1000 : 0;

  if (scrollSpeed <= scrollSpeedThreshold) {
    return;
  }

  const scrollingDown = scrollTop > lastScrollTop;

  if (scrollingDown) {
    downloadFAB.classList.remove("active");
  } else if (!scrollingDown) {
    downloadFAB.classList.add("active");
  }
  lastScrollTop = scrollTop;
  lastScrollTime = currentTime;
}

window.addEventListener("scroll", setActiveSection);
window.addEventListener("scroll", handleChangeFAB, { passive: true });
downloadButton.addEventListener("click", downloadCV);
downloadFAB.addEventListener("click", downloadCV);
changeThemeButton.addEventListener("click", changeTheme);

setActiveSection();
setChangeThemeIcon();
