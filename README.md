# Twitter Wikipedia Badge Chrome Extension

This Chrome extension adds a small Wikipedia icon next to the username on Twitter profiles that have a corresponding Wikipedia page. By clicking on the icon, users can quickly access the Wikipedia page associated with the Twitter account.

## Features

- Displays a Wikipedia icon next to Twitter usernames that have a Wikipedia page.
- Compatible with dynamically loaded Twitter content.
- Avoids adding icons to profile images or other unrelated links.
- Uses the Wikidata API to determine the existence of a Wikipedia page for a given Twitter username.

## Installation

### From Source

1. Download or clone this repository to your local machine.
2. Open the Chrome browser and navigate to `chrome://extensions`.
3. Enable "Developer mode" by toggling the switch in the upper right corner.
4. Click the "Load unpacked" button in the upper left corner.
5. Browse to the directory containing the downloaded or cloned repository, and select the folder to load the extension.

### From Chrome Web Store (not published yet)

1. Visit the extension's page on the Chrome Web Store (add the URL here).
2. Click the "Add to Chrome" button.
3. Confirm the installation by clicking "Add extension" in the popup window.

## Usage

Once installed, the extension will automatically add a Wikipedia icon next to the usernames of Twitter accounts that have a Wikipedia page. You can click on the icon to navigate to the associated Wikipedia page.

## Known Issues

- The extension might not work correctly if Twitter significantly changes their HTML structure or class names.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests for enhancements, bug fixes, or other improvements.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [OpenAI](https://openai.com/) for providing assistance through their ChatGPT API.
- [Wikidata API](https://www.wikidata.org/wiki/Wikidata:Data_access) for providing data on Wikipedia pages associated with Twitter accounts.

Don't forget to include a `LICENSE` file in your project directory as well. Here's an example of the MIT License text you can use:

```
