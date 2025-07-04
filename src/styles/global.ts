import { createGlobalStyle } from "styled-components";

const globalStyle = createGlobalStyle`
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    html, body, #root {
        height: 100%;
        scroll-behavior: smooth;

    }

    body {
        background-color: #F8FDFF;
        background-size: cover;
        font-family: 'Poppins', sans-serif;
    }

    a {
        text-decoration: none;
        outline: none;
    }

    header {
        font-family: var(--font-family);
    }

    .p-toast {
        top: 2rem;
        right: 2rem;
    }

    .p-toast .p-toast-message {
        min-width: 380px;
        max-width: 600px;
        padding: 2rem 2.5rem;
        font-family: var(--font-family);
        font-size: 0.95rem;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .p-toast-message .p-toast-message-text {
        line-height: 1.5;
    }

    .p-toast-message .p-toast-icon-close {
        top: 1rem;
        right: 1rem;
    }
`;

export default globalStyle;
