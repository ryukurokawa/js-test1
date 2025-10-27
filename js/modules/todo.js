const addForm =document.querySelector('.td-add-form')
const addInput = document.querySelector('.td-add-input')

addForm.addEventListener('submit',e => {
  //デフォルトのリロードを抑制するため
  e.preventDefault()
  let todoObj={
     //.valueにすることによって入力値を取得することができる
    content:addInput.value.trim(),
    isDone:false
}
})