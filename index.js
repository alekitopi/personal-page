import code from "./code.js";

const ul = document.querySelector(".content");

(() => {
  for (let i = 0; i < code.length; i++) {
    const pre = document.createElement("pre");
    ul.appendChild(pre);

    for (let j = 0; j < code[i].length; j++) {
	  const { code: text, className, link } = code[i][j] ?? {};
      const span = document.createElement(link ? "a" : "span");

	  span.className = className ? className : "";
      span.innerHTML = text ? text : "";

	  if (link) {
        span.setAttribute("href", text.slice(1, -1));
        span.setAttribute("target", "_blank");
      }

      pre.appendChild(span);
    }
  }
})();

(async () => {
  const lines = [...ul.children];
  lines.forEach((line) => {
    [...line.children].forEach((word) => {
      word.innerText = "";
      [...word.classList].includes("opacity-0")
        ? word.classList.remove("opacity-0")
        : null;
    });
  });

  let i = 0;

  for await (const line of lines) {
    i++;

    await new Promise(async (resolve) => {
      let j = 0;
      for await (const word of line.children) {
        j++;
        await new Promise(async (resolve) => {
          let finalWord = code[i - 1][j - 1].code;
          let currentWord = "";

          await new Promise((resolve) => {
            const id = setInterval(() => {
              if (currentWord.length === finalWord.length) {
                if ([...word.classList].includes("border-r")) {
                  word.classList.remove("border-white");
                  word.classList.remove("border-r");
                }
                resolve(true);
                clearInterval(id);
              } else {
                if (![...word.classList].includes("border-r")) {
                  word.classList.add("border-r");
                  word.classList.add("border-white");
                }
                currentWord += finalWord[currentWord.length];
                word.innerText = currentWord;
              }
            }, 15);
          });

          resolve(true);
        });

      }
      resolve(true);
    });
  }

  localStorage.setItem("code-animation", "false");
  return Promise.resolve(true);
})();
