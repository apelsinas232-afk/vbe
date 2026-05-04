/** @type {import('tailwindcss').Config} */
    export default {
      content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
      theme: {
        extend: {},
      },
      plugins: [],
    }
    ```

### Kas dabar vyksta Vercel?
Matau tavo nuotraukoje prie paskutinio veiksmo (Commit) **geltoną rutuliuką**. Tai reiškia, kad Vercel **jau pamatė** tavo pakeitimus ir dabar bando juos „išvirti“ į svetainę.

1.  Palauk minutę.
2.  Jei rutuliukas taps **žalias** – valio! Tavo svetainė gyva.
3.  Jei rutuliukas taps **raudonas X** – nebijok, paspausk ant jo, tada ant „Details“ ir pažiūrėk paskutines eilutes (Logs). Dažniausiai tai būna tiesiog pamirštas kablelis ar trūkstamas failas, kurį ką tik surašiau.

Ar geltonas rutuliukas jau pasikeitė?
