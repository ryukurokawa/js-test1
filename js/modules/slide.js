const menuCover = document.querySelector('.sp-cover')
const menu = document.querySelectorAll('.sp-menu>li')
const backTomenu =document.querySelector('.sp-back-to-menu')

let level;


//メニュー項目をクリックしたら、メニューのカバ-を非表示にする。
menu.forEach(item=>{
  item.addEventListener('click',()=>{
    menuCover.classList.add('hide')
    level =item.dataset.level
  })
})


//戻るボタなどがクリックされたら、隠れていたメニューカバーを再表示するという処理
backTomenu.addEventListener('click',()=>{
  menuCover.classList.remove('hide')
})