import { Picker } from 'http://localhost:1234/module.js';

let productPicker;

window.hlx.initSidekick({
  project: 'Unilever - Dove',
  libraries: [
    {
      text: 'Blocks',
      paths: [
        'https://main--dove--hlxsites.hlx.page/library/blocks/blocks.json',
      ],
    },
  ],
  plugins: [
    {
      id: 'library',
      condition: () => true,
      button: {
        text: 'Library',
        action: (_, s) => {
          const domain = 'https://main--milo--adobecom.hlx.page';
          const { config } = s;
          const script = document.createElement('script');
          script.type = 'module';
          script.onload = () => {
            const skEvent = new CustomEvent('hlx:library-loaded', {
              detail: { domain, libraries: config.libraries },
            });
            document.dispatchEvent(skEvent);
          };
          script.src = `${domain}/libs/ui/library/library.js`;
          document.head.appendChild(script);
        },
      },
    }
  ],
});
