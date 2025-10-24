const nav = document.querySelector('#nav');
const appNames =['todo','typing','slide-puzzle','memory-card','life'];

appNames.forEach(appName=>{
  const menu = document.createElement('a')
  menu.classList.add('nav-menu') 
  menu.textContent = appNames.toUpperCase();
  menu.addEventListener('click',()=>{
    const appEl =document.getElementById(appName)
    appEl.classList.add('active')
  })
  nav.appendChild(menu)
})
