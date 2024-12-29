// libs/copy.js
export function enableCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const codeElement = document.getElementById(targetId);
      if (codeElement) {
        const code = codeElement.innerText;
        navigator.clipboard
          .writeText(code)
          .then(() => {
            alert("复制成功");
          })
          .catch(err => {
            console.error("复制失败", err);
          });
      }
    });
  });
}

export function addButton() {
  const button = document.createElement("button");
  button.innerText = "copy";
  button.className = "copy-btn";
  return button;
}
export function addCopyButtonToCodeBlock() {
  document.querySelectorAll('pre code').forEach((codeBlock, index) => {
    const wrapper = codeBlock.parentElement;
    if (wrapper) {
      wrapper.style.position = 'relative';
      const button = addButton();
      button.style.position = 'absolute';
      button.style.right = '10px';
      button.style.top = '10px';
      button.setAttribute('data-target', `code-block-${index}`);
      codeBlock.id = `code-block-${index}`;
      wrapper.appendChild(button);
    }
  });
  enableCopyButtons();
}
