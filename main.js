function onMove(event) {
  const target = event.target;

  const dataX = target.getAttribute('data-x');
  const dataY = target.getAttribute('data-y');
  const initialX = parseFloat(dataX) || 0;
  const initialY = parseFloat(dataY) || 0;

  const deltaX = event.dx;
  const deltaY = event.dy;

  const newX = initialX + deltaX;
  const newY = initialY + deltaY;

  target.style.transform = `translate(${newX}px, ${newY}px)`;

  target.setAttribute('data-x', newX);
  target.setAttribute('data-y', newY);
}
interact('.note').draggable({
  onmove: onMove,
  listeners: {
    end(event) {
      const target = event.target;
      target.style.transform = `translate(0,0)`;
      target.setAttribute('data-x', 0);
      target.setAttribute('data-y', 0);
    }
  }
})
interact('.list').dropzone({
  accept: ".note",
  overlap: 0.5,
  ondrop: function(e) {
    let target = e.relatedTarget;
    if (target.classList.contains("special")) {
      target.style.transform = `translate(0,0)`;
      target.setAttribute('data-x', 0);
      target.setAttribute('data-y', 0);
      target = target.cloneNode(true);
      target.classList.remove("special");
      target.contentEditable = true;
      target.addEventListener("input", update);
    };
    e.target.appendChild(target);
    update();
  }
})
interact('.titles').dropzone({
  accept: ".note",
  overlap: 0.2,
  ondrop: function(e) {
    let target = e.relatedTarget;
    if (target.classList.contains("special")) {
      target.style.transform = `translate(0,0)`;
      target.setAttribute('data-x', 0);
      target.setAttribute('data-y', 0);
      target = target.cloneNode(true);
      target.classList.remove("special");
      target.contentEditable = true;
      target.addEventListener("input", update);
    };
    let ele = e.target.nextElementSibling
    ele.insertBefore(target, ele.childNodes[0]);
    update();
  }
})
interact('#trash').dropzone({
  accept: ".note",
  overlap: 0.1,
  ondrop: function(e) {
    let target = e.relatedTarget;
    if (!target.classList.contains("special")) {
      target.remove();
    } else target.style.background = "palegreen";
    update();
  },
  ondragenter: function(e) {
    let target = e.relatedTarget;
    target.style.background = "darkgreen";
  },
  ondragleave: function(e) {
    let target = e.relatedTarget;
    target.style.background = "palegreen";
  }
})
function retrieve(){
  let data=[];
  for(let list of document.querySelectorAll(".list")){
    data.push([]);
    const i=data.length-1;
    for(let d of list.children){
      data[i].push(d.innerText);
    }
  }
  return data
}
function update(){
  localStorage.todo=JSON.stringify(retrieve());
}
function load(){
  if(!localStorage.todo)return false;
  let data=JSON.parse(localStorage.todo),
  lists=document.querySelectorAll(".list");
  for(let i=0;i<data.length;i++){
    data[i].forEach(a=>{
      let ele=document.createElement("div");
      ele.innerText=a;
      ele.classList.add("note");
      ele.contentEditable=true;
      ele.addEventListener("input",update);
      lists[i].appendChild(ele);
    });
  }
}
load();