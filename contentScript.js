const wikipediaPageCache = {};

function checkWikipediaPage(twitterHandle) {
  if (wikipediaPageCache.hasOwnProperty(twitterHandle)) {
    return Promise.resolve(wikipediaPageCache[twitterHandle]);
  }

  const sparqlQuery = `
    SELECT ?item WHERE {
      ?item wdt:P2002 "${twitterHandle}".
    }
  `;
  const encodedQuery = encodeURIComponent(sparqlQuery);
  const apiUrl = `https://query.wikidata.org/sparql?query=${encodedQuery}&format=json`;

  return fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const hasWikipediaPage = data.results.bindings.length > 0;
      wikipediaPageCache[twitterHandle] = hasWikipediaPage;
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
          icon.style.marginLeft = "4px";
          icon.style.verticalAlign = "text-bottom"; // Lägg till denna rad
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
