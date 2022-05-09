const $ = e => document.querySelectorAll(e);
const loadImages = async (...urls) => await Promise.all(urls.map(url => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
})));

let images;

function createTask(getNote = false, text = "") {
  let task = document.createElement("div"),
    note = document.createElement("div"),
    tooltip = document.createElement("div");
  note.innerText = text;
  note.classList.add("note");
  note.contentEditable = true;
  note.addEventListener("input", update);
  task.append(note);
  tooltip.classList.add("tooltip");
  images.forEach((a, i) => {
    const button = a.cloneNode(true);
    let id;
    button.addEventListener('click', () => {
      note.style.animation = '';
      switch (i) {
        case 0:
          id = task.parentElement.id[1] - 1;
          if (id !== 0) {
            $('#p' + id)[0].prepend(task);
            setTimeout(()=>note.style.animation = 'pulse 0.5s linear',50);
          };
          break;
        case 1:
          id = +task.parentElement.id[1] + 1;
          if (id !== 4) {
            $('#p' + id)[0].prepend(task);
            setTimeout(()=>note.style.animation = 'pulse 0.5s linear',50);
          }
          break;
        case 2:
          if(task.previousElementSibling){
            task.parentNode.insertBefore(task, task.previousElementSibling);
            setTimeout(()=>note.style.animation = 'pulse 0.5s linear',50);
          }
          break;
        case 3:
          if(task.nextElementSibling){
            task.parentNode.insertBefore(task.nextElementSibling, task);
            setTimeout(()=>note.style.animation = 'pulse 0.5s linear',50);
          }
          break;
        case 4:
          task.remove();
          break;
      }
      update();
    })
    tooltip.append(button);
  });
  task.append(tooltip);
  return getNote ? [task, note] : task;
}
function retrieve() {
  let data = [];
  for (let list of document.querySelectorAll(".list")) {
    data.push([]);
    const i = data.length - 1;
    for (let d of list.children) {
      data[i].push(d.innerText);
    }
  }
  return data
}
function update() {
  localStorage.todo = JSON.stringify(retrieve());
}
function load() {
  if (!localStorage.todo) return false;
  let data = JSON.parse(localStorage.todo),
    lists = $(".list");
  for (let i = 0; i < data.length; i++)
    data[i].forEach(a => lists[i].append(createTask(false, a)));
}
$('.plus').forEach(c => c.addEventListener('click', e => {
  const id = e.target.parentElement.getAttribute("name") || e.target.parentElement.parentElement.getAttribute("name");
  let task = createTask(true);
  $('#' + id)[0].append(task[0]);
  task[1].focus();
}));

loadImages("icons/arrowleft.svg", "icons/arrowright.svg", "icons/arrowup.svg", "icons/arrowdown.svg", "icons/bin.svg").then(a => { images = a; load(); });