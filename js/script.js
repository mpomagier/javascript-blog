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
};

const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.data-author';

function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';

  for (let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;

    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    console.log(linkHTML);

    /* insert link into titleList */
    html += linkHTML;
  }

  titleList.innerHTML = html;

  const links = document.querySelectorAll('.titles a');

  for(let link of links){
    link.addEventListener('click', titleClickHandler);
  }
  /* display allPostsLink after click in all-posts id */

  const allPostsLink = document.getElementById('all-posts');
  allPostsLink.addEventListener('click', function(event) {
    event.preventDefault();
    generateTitleLinks();
  });
}

generateTitleLinks();

function generateTags(){

  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);

  /* START LOOP: for every article: */
  for (let article of articles){
    /* make html variable with empty string */
    let html = '';

    /* find tags wrapper */
    const tagList = article.querySelector(optArticleTagsSelector);
    tagList.innerHTML = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';

      /* add generated code to html variable */
      html += linkHTML + ' ';

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;

  /* END LOOP: for every article: */
  }
}

generateTags();


function tagClickHandler(event){

  /* prevent default action for this event */
  event.preventDefault();
  console.log('Tag was clicked!');

  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  console.log('href:', href);

  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');

  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');

  /* START LOOP: for each active tag link */
  for(let activeTagLink of activeTagLinks){

    /* remove class active */
    activeTagLink.classList.remove('active');

  /* END LOOP: for each active tag link */
  }

  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('tagLinks:', tagLinks);

  /* START LOOP: for each found tag link */
  for(let tagLink of tagLinks){

    /* add class active */
    tagLink.classList.add('active');

  /* END LOOP: for each found tag link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){

  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]');

  /* START LOOP: for each link */
  for(let link of links){

    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToTags();


function generateAuthors() {
  // Find all articles using the optArticleSelector
  const articles = document.querySelectorAll(optArticleSelector);

  // Loop through each article
  for (let article of articles) {
    // Find the article title element within the current article
    const articleTitle = article.querySelector(optTitleSelector);

    // Get the author's name from the data-author attribute of the article
    const articleAuthor = article.getAttribute('data-author');

    // Create a new anchor element for the author link
    const authorLink = document.createElement('a');

    // Set the href attribute of the author link
    authorLink.setAttribute('href', '#author=' + articleAuthor);

    // Set the inner HTML of the author link to include the author's name
    authorLink.textContent = articleAuthor;

    // Create a new span element to wrap the author link
    const authorWrapper = document.createElement('span');

    // Add a class to the author wrapper for styling
    authorWrapper.classList.add('post-author');

    // Append the author link to the author wrapper
    authorWrapper.appendChild(authorLink);

    // Insert the author wrapper after the article title
    articleTitle.insertAdjacentElement('afterend', authorWrapper);
  }
}

generateAuthors();


function addClickListenersToAuthors() {
  // Find all links to authors
  const authorLinks = document.querySelectorAll('a[href^="#author="]');

  // Loop through each author link
  for (let authorLink of authorLinks) {
    // Add authorClickHandler as event listener for that link
    authorLink.addEventListener('click', authorClickHandler);
  }
}

addClickListenersToAuthors();


function authorClickHandler(event) {

  // Prevent default action for this event
  event.preventDefault();
  console.log('Author was clicked!');

  // Make new constant named "clickedElement" and give it the value of "this"
  const clickedElement = this;

  // Make a new constant "href" and read the attribute "href" of the clicked element
  const href = clickedElement.getAttribute('href');
  console.log('href:', href);

  // Make a new constant "author" and extract the author from the "href" constant
  const author = href.replace('#author=', '');

  // Remove class "active" from all author links
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author="]');
  for (let activeAuthorLink of activeAuthorLinks) {
    activeAuthorLink.classList.remove('active');
  }

  // Add class "active" to clicked author link
  clickedElement.classList.add('active');

  // Execute function "generateTitleLinks" with article selector as argument
  generateTitleLinks('[data-author="' + author + '"]');
}
