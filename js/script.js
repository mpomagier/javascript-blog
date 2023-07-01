'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),

  articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
  articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),

  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

//CONSTANTS
const opts = {
  articleSelector: '.post',
  titleSelector: '.post-title',
  titleListSelector: '.titles',
  articleTagsSelector: '.post-tags .list',
  articleAuthorSelector: '.post-author',
  authorsListSelector: '.authors.list',
  tagsListSelector: '.tags.list',
  cloudClassCount: '5',
  cloudClassPrefix: 'tag-size-'
};

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


function generateTitleLinks(customSelector = '') {

  /* remove contents of titleList */
  const titleList = document.querySelector(opts.titleListSelector);
  titleList.innerHTML = '';

  /* for each article */
  const articles = document.querySelectorAll(opts.articleSelector + customSelector);
  let html = '';

  for (let article of articles){

    /* get the article id */
    const articleId = article.getAttribute('id');

    /* find the title element */
    const articleTitle = article.querySelector(opts.titleSelector).innerHTML;

    /* create HTML of the link */
    //const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    const linkHTMLData = { id: articleId, title: articleTitle };
    const linkHTML = templates.articleLink(linkHTMLData);
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


function calculateTagsParams(tags){
  const params = {max: 0, min: 99999};

  for(let tag in tags){
    console.log(tag + ' is used ' + tags[tag] + ' times ');

    params.max = Math.max(tags[tag], params.max);
    params.min = Math.min(tags[tag], params.min);
  }

  return params;
}


function calculateTagClass(count, params) {

  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * (opts.cloudClassCount - 1) + 1 );
  return opts.cloudClassPrefix + classNumber;
}


function generateTags(){

  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles){

    /* make html variable with empty string */
    let html = '';

    /* find tags wrapper */
    const tagList = article.querySelector(opts.articleTagsSelector);
    tagList.innerHTML = '';

    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');

    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');

    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){

      /* generate HTML of the link */
      const linkHTMLData = {id: tag, title: tag};
      const linkHTML = templates.articleTag(linkHTMLData);

      /* add generated code to html variable */
      html += linkHTML + ' ';

      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {

        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    tagList.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(opts.tagsListSelector);
  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

  /* [NEW] create variable for all links HTML code */
  const allTagsData = {tags: []};

  /* [NEW] START LOOP: for each tag in allTags: */
  for(let tag in allTags){

    /* [NEW] calculate tag class */
    const tagClass = calculateTagClass(allTags[tag], tagsParams);

    /* [NEW] generate code of a link and add it to allTagsHTML */
    //const tagLinkHTML = '<li><a class="' + tagClass + '" href="#tag-' + tag + '">' + tag + '</a> </li>';
    //allTagsHTML += tagLinkHTML;
    const tagLinkData = { tag: tag, class: tagClass };
    const tagLinkHTML = templates.tagCloudLink(tagLinkData);

    console.log('tagLinkHTML:', tagLinkHTML);
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });

  /* [NEW] END LOOP: for each tag in allTags: */
  }

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
  console.log(allTagsData);

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


function calculateAuthorsParams(authors){
  const params = {max: 0, min: 99999};

  for(let author in authors){
    console.log(author + ' is used ' + author[author] + ' times ');

    params.max = Math.max(authors[author], params.max);
    params.min = Math.min(authors[author], params.min);
  }

  return params;
}


function calculateAuthorClass(count, params) {

  const classNumber = Math.floor( ( (count - params.min) / (params.max - params.min) ) * (opts.cloudClassCount - 1) + 1 );
  return opts.cloudClassPrefix + classNumber;
}


function generateAuthors() {

  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};

  /* find all articles */
  const articles = document.querySelectorAll(opts.articleSelector);

  /* START LOOP: for every article: */
  for (let article of articles){

    /* make html variable with empty string */
    let html = '';

    /* find authors wrapper */
    const authorList = article.querySelector(opts.articleAuthorSelector);
    authorList.innerHTML = '';

    /* get authors from data-author attribute */
    const articleAuthor = article.getAttribute('data-author');

    /* generate HTML of the link */
    const linkHTMLData = { author: articleAuthor };
    const linkHTML = templates.articleAuthor(linkHTMLData);

    //const linkHTML = 'Author: <a href="#author-' + articleAuthor + '"> ' + articleAuthor + '</a>';

    /* add generated code to html variable */
    html += linkHTML + ' ';

    /* [NEW] check if this link is NOT already in allAuthors */
    if(!allAuthors[articleAuthor]) {

      /* [NEW] add author to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }

    /* insert HTML of all the links into the authors wrapper */
    authorList.innerHTML = html;

  /* END LOOP: for every article: */
  }

  /* [NEW] find list of authors in right column */
  const authorList = document.querySelector(opts.authorsListSelector);
  const authorsParams = calculateAuthorsParams(allAuthors);
  console.log('authorsParams:', authorsParams);

  /* [NEW] create variable for all links HTML code */
  let allAuthorsHTML = '';

  /* [NEW] START LOOP: for each author in allAuthors: */
  for(let author in allAuthors){

    /* [NEW] calculate author class */
    const authorClass = calculateAuthorClass(allAuthors[author], authorsParams);

    /* [NEW] generate code of a link and add it to allAuthorsHTML */
    const authorLinkHTML = '<li><a class="' + authorClass + '" href="#author-' + author + '">' + author + '</a> (' + allAuthors[author] + ')</li>';

    allAuthorsHTML += authorLinkHTML;
    console.log('authorLinkHTML:', authorLinkHTML);

  /* [NEW] END LOOP: for each author in allAuthors: */
  }

  /*[NEW] add HTML from allAuthorsHTML to authorList */
  authorList.innerHTML = allAuthorsHTML;

}

generateAuthors();


function authorClickHandler(event) {

  /* prevent default action for this event */
  event.preventDefault();
  console.log('Author was clicked!');

  /* make new constant named "clickedAuthorElement" and give it the value of "this" */
  const clickedAuthorElement = this;

  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedAuthorElement.getAttribute('href');
  console.log('href:', href);

  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');

  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');

  /* START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {

    /* remove class active */
    activeAuthorLink.classList.remove('active');

  /* END LOOP: for each active author link */
  }

  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll('a[href="' + href + '"]');
  console.log('authorLinks:', authorLinks);

  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) {

    /* add class active */
    authorLink.classList.add('active');

  /* END LOOP: for each found author link */
  }

  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {

  /* find all links to authors */
  const links = document.querySelectorAll('a[href^="#author-"]');

  /* START LOOP: for each link */
  for(let link of links){

    /* add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);

  /* END LOOP: for each link */
  }
}

addClickListenersToAuthors();
