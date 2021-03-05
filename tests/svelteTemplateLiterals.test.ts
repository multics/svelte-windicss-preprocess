import { preprocess } from '../src/index';
import { testConfig } from './utils';
import { html } from 'js-beautify';

let content = `
<div class={\`px-1.5 \${myClass ? "bg-red-100" : "bg-teal-500"}\`}>
  Hello World!
</div>
`;
let expectedOutput = `
<div class={\`px-1.5 \${myClass ? "bg-red-100" : "bg-teal-500"}\`}>
Hello World!
</div>

<style>
:global(*), :global(::before), :global(::after) {
-webkit-box-sizing: border-box;
box-sizing: border-box;
border-width: 0;
border-style: solid;
border-color: #e5e7eb;
}
:global(*) {
--tw-ring-inset: var(--tw-empty,/*!*/ /*!*/);
--tw-ring-offset-width: 0px;
--tw-ring-offset-color: #fff;
--tw-ring-color: rgba(59, 130, 246, 0.5);
--tw-ring-offset-shadow: 0 0 #0000;
--tw-ring-shadow: 0 0 #0000;
--tw-shadow: 0 0 #0000;
}
:global(:root) {
-moz-tab-size: 4;
-o-tab-size: 4;
tab-size: 4;
}
:global(:-moz-focusring) {
outline: 1px dotted ButtonText;
}
:global(:-moz-ui-invalid) {
box-shadow: none;
}
:global(::moz-focus-inner) {
border-style: none;
padding: 0;
}
:global(::-webkit-inner-spin-button), :global(::-webkit-outer-spin-button) {
height: auto;
}
:global(::-webkit-search-decoration) {
-webkit-appearance: none;
}
:global(::-webkit-file-upload-button) {
-webkit-appearance: button;
font: inherit;
}
:global([type='search']) {
-webkit-appearance: textfield;
outline-offset: -2px;
}
:global(abbr[title]) {
-webkit-text-decoration: underline dotted;
text-decoration: underline dotted;
}
:global(body) {
margin: 0;
font-family: inherit;
line-height: inherit;
}
:global(html) {
-webkit-text-size-adjust: 100%;
font-family: ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
line-height: 1.5;
}
.bg-red-100 {
--tw-bg-opacity: 1;
background-color: rgba(254, 226, 226, var(--tw-bg-opacity));
}
.bg-teal-500 {
--tw-bg-opacity: 1;
background-color: rgba(20, 184, 166, var(--tw-bg-opacity));
}
.px-1\\.5 {
padding-left: 0.375rem;
padding-right: 0.375rem;
}
</style>
`;
test('svelteTemplates', async () => {
  let result = (
    await preprocess({ ...testConfig, globalUtility: false }).markup({ content, filename: 'svelteTemplates.svelte' })
  ).code;
  expect(html(result, { preserve_newlines: false })).toBe(html(expectedOutput, { preserve_newlines: false }));
});
