'use strict';

/*document.getElementById('test-button').addEventListener('click', function(){
  const links = document.querySelectorAll('.titles a');
  console.log('links:', links);
});*/

const titleClickHandler = function(event){
  const clickedElement = this;
  event.preventDefault();
  console.log('Link was clicked!');

  const activeLinks = document.querySelectorAll('.titles a.active');

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }

  console.log('clickedElement:', clickedElement);

  const articleSelector = clickedElement.getAttribute('href');
  console.log('articleSelector:', articleSelector);

  const targetArticle = document.querySelector(articleSelector);
  console.log('targetArticle:', targetArticle);

  const activeArticle = document.querySelector('.post.active');

  if (activeArticle) {
    activeArticle.classList.remove('active');
  }

  clickedElement.classList.add('active');
  targetArticle.classList.add('active');
}

const links = document.querySelectorAll('.titles a');

for(let link of links){
  link.addEventListener('click', titleClickHandler);
}