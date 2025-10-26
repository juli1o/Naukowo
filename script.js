class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.term = "";
    this.list = document.getElementById("list");
    this.search = document.getElementById("search");
    this.addBtn = document.getElementById("add");

    this.addBtn.addEventListener("click", () => this.addTask());
    this.search.addEventListener("input", () => {
      this.term = this.search.value.toLowerCase();
      this.draw();
    });

    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  addTask() {
    let text = document.getElementById("task").value.trim();
    let date = document.getElementById("date").value;

    if (text.length < 3 || text.length > 255) {
      alert("Zadanie musi mieć 3–255 znaków");
      return;
    }

    if (date && new Date(date) <= new Date()) {
      alert("Data musi być w przyszłości");
      return;
    }

    this.tasks.push({ text: text, date: date });
    this.save();
    this.draw();

    document.getElementById("task").value = "";
    document.getElementById("date").value = "";
  }

  deleteTask(i) {
    this.tasks.splice(i, 1);
    this.save();
    this.draw();
  }

  editTask(i, li) {
    li.innerHTML = "";

    let textInput = document.createElement("input");
    textInput.type = "text";
    textInput.value = this.tasks[i].text;
    textInput.style.width = "55%";

    let dateInput = document.createElement("input");
    dateInput.type = "datetime-local";
    dateInput.value = this.tasks[i].date || "";
    dateInput.style.width = "35%";
    dateInput.style.marginLeft = "5px";

    let saveBtn = document.createElement("button");
    saveBtn.textContent = "Zapisz";
    saveBtn.style.marginLeft = "5px";

    li.appendChild(textInput);
    li.appendChild(dateInput);
    li.appendChild(saveBtn);

    saveBtn.addEventListener("click", () => {
      let newText = textInput.value.trim();
      let newDate = dateInput.value;

      if (newText.length < 3 || newText.length > 255) {
        alert("Zadanie musi mieć 3–255 znaków");
        return;
      }

      if (newDate && new Date(newDate) <= new Date()) {
        alert("Data musi być w przyszłości");
        return;
      }

      this.tasks[i].text = newText;
      this.tasks[i].date = newDate;
      this.save();
      this.draw();
    });

    textInput.focus();
  }

  filtered() {
    if (this.term.length < 2) return this.tasks;
    return this.tasks.filter(t => t.text.toLowerCase().includes(this.term));
  }

  highlight(text) {
    if (this.term.length < 2) return text;
    let reg = new RegExp("(" + this.term + ")", "gi");
    return text.replace(reg, "<mark>$1</mark>");
  }

  draw() {
    this.list.innerHTML = "";

    let show = this.filtered();
    for (let i = 0; i < show.length; i++) {
      let li = document.createElement("li");
      let t = show[i];

      li.innerHTML = this.highlight(t.text) + (t.date ? " (" + t.date + ")" : "");

      let btn = document.createElement("button");
      btn.textContent = "Usuń";
      btn.onclick = (e) => {
        e.stopPropagation();
        this.deleteTask(i);
      };

      li.appendChild(btn);

      li.addEventListener("click", (e) => {
        if (e.target.tagName !== "BUTTON") {
          this.editTask(i, li);
        }
      });

      this.list.appendChild(li);
    }
  }
}

window.addEventListener("DOMContentLoaded", () => new Todo());
