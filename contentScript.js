const wikipediaPageCache = {};

function checkWikipediaPage(twitterHandle) {
  const lowerCaseHandle = twitterHandle.toLowerCase();

  if (wikipediaPageCache.hasOwnProperty(lowerCaseHandle)) {
    return Promise.resolve(wikipediaPageCache[lowerCaseHandle]);
  }

 
  const apiUrl = `https://hub.toolforge.org/P2002:${twitterHandle}?format=json&lang=en,sv,auto`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const destination = data.destination;
      const hasWikipediaPage = destination?.url;
      return hasWikipediaPage;
    })
    .catch((error) => {
      console.error("Error fetching Wikidata:", error);
      return false;
    });
}


const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const profileLinkObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const profileLink = entry.target;
      const twitterHandle = profileLink.getAttribute("href").replace("/", "");

      checkWikipediaPage(twitterHandle).then((hasWikipediaPage) => {
        if (hasWikipediaPage) {
          const icon = document.createElement("img");
          icon.src = chrome.runtime.getURL("icon16.png");
          icon.style.width = "16px";
          icon.style.height = "16px";
          icon.style.margin = "2px 4px";
          icon.style.verticalAlign = "text-bottom";
          icon.title = "This account has a Wikipedia-page.";

          const wrapper = document.createElement("span");
          wrapper.style.display = "flex"; // Ändra här

          profileLink.parentNode.insertBefore(wrapper, profileLink);
          wrapper.appendChild(profileLink);
          wrapper.insertAdjacentElement("beforeend", icon);

          profileLink.setAttribute("data-wikipedia-icon-added", "true");
        }
      });

      observer.unobserve(profileLink);
    }
  });
}, observerOptions);


function observeProfileLink(profileLink) {
  profileLinkObserver.observe(profileLink);
}

function addWikipediaIconToProfile() {
  const profileLinks = Array.from(document.querySelectorAll(
    '[data-testid="primaryColumn"] div[dir="auto"] a[href^="/"]:not([data-wikipedia-icon-added]), [data-testid="primaryColumn"] a[href^="/"][role="link"]:not([data-wikipedia-icon-added])'
  )).filter(el => el.textContent.includes("@"));

  profileLinks.forEach((profileLink) => {
    const hasSpecificParent = profileLink.closest("div[role='group'], div[role='button'], div.r-1udh08x");

    if (!hasSpecificParent) {
      profileLink.setAttribute("data-wikipedia-icon-added", "true");
      observeProfileLink(profileLink);
    }
  });
}


const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      addWikipediaIconToProfile();
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });

addWikipediaIconToProfile();
