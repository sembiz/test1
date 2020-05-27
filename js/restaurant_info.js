let restaurant;
let reviews;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {  
  if (navigator.onLine) {
    DBHelper.updateServer();
  }
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {      
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
        mapboxToken: 'pk.eyJ1IjoibGluZGFrdDE2IiwiYSI6ImNqaW1sY3Z4bjAxa2EzcHBmaTZ4aTE2dzQifQ.cOXPk5Jme5zrFsUP3KEgLw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'    
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
}  
 
/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL'
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant)
    });
    DBHelper.fetchReviewsById(id, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        console.log('no reviews found from fetch')
        return;
      }
      fillReviewsHTML(reviews);
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = `A photo showcasing the atmosphere of ${restaurant.name}`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;
  cuisine.setAttribute('aria-label', `${restaurant.cuisine_type} restaurant`);

  const favOn = document.createElement('img'); 
  favOn.src = `./img/icons/fav_on.svg`;
  favOn.className = 'favorite on';
  favOn.alt = 'Favorite restaurant toggle turned on';
  const favOff = document.createElement('img');
  favOff.src = `./img/icons/fav_off.svg`;
  favOff.className = 'favorite off';
  favOff.alt = 'Favorite restaurant toggle turned off';
   if (restaurant.is_favorite == 'false') {
    favOn.classList.add('hide');
  } else if (restaurant.is_favorite == 'true') {
    favOff.classList.add('hide');
  }
  const favButton = document.getElementById('fav');
  favButton.setAttribute('aria-label', `Toggle this restaurant's favorite status`);
  favButton.append(favOn, favOff);
  
  favButton.addEventListener('click', function(e) {
    e.preventDefault();
    DBHelper.toggleFav(favButton, restaurant.id);
  })

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.reviews) => {
  console.log('inside fillReviewsHTML function');
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);
  container.setAttribute('aria-label', 'Reviews');

  if (!reviews || Object.keys(reviews).length == 0) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);

  const formHolder = formFunction(reviews[0].restaurant_id);
  container.appendChild(formHolder);
}

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

formFunction = (rest_id) => {
  const reviewContainer = document.getElementById('addReview');
  const formTitle = document.createElement('h4');
  formTitle.innerHTML = 'Add Your Own Review!';
  reviewContainer.appendChild(formTitle);

  const reviewForm = document.createElement('form');
  reviewForm.id = 'addReviewForm';
  
  const nameDiv = document.createElement('div');
  nameDiv.className = 'formDivider';
  const nameLabel = document.createElement('label');
  nameLabel.htmlFor = 'name';
  nameLabel.innerHTML = 'Your Name:';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'user_name';
  nameInput.id = 'name';
  nameInput.placeholder = 'Your name';
  nameDiv.appendChild(nameLabel);
  nameDiv.appendChild(nameInput);

  reviewForm.appendChild(nameDiv);

  const rateDiv = document.createElement('div');
  rateDiv.className = 'formDivider';
  const rateLabel = document.createElement('label');
  rateLabel.htmlFor = 'rating';
  rateLabel.innerHTML = 'Rating:';
  const rateInput = document.createElement('input');
  rateInput.type = 'number';
  rateInput.name = 'user_rating';
  rateInput.id = 'rating';
  rateInput.placeholder = '(1 low, 5 high)';
  rateDiv.appendChild(rateLabel);
  rateDiv.appendChild(rateInput);

  reviewForm.appendChild(rateDiv);

  const commentDiv = document.createElement('div');
  commentDiv.className = 'formDivider';
  const commentLabel = document.createElement('label');
  commentLabel.htmlFor = 'uReview';
  commentLabel.innerHTML = 'Comments:';
  const commentInput = document.createElement('textarea');
  commentInput.name = 'user_review';
  commentInput.id = 'uReview';
  commentInput.placeholder = 'How was this place?';
  commentDiv.appendChild(commentLabel);
  commentDiv.appendChild(commentInput);

  reviewForm.appendChild(commentDiv);
  
  const reviewSubmit = document.createElement('button');
  reviewSubmit.type = 'submit';
  reviewSubmit.id = 'submitReview';
  reviewSubmit.innerHTML = 'Post Review';

  reviewForm.appendChild(reviewSubmit);

  reviewContainer.appendChild(reviewForm);

  reviewForm.addEventListener('submit', function(event) {
    event.preventDefault();
    newReview(rest_id, reviewContainer, reviewForm);
  })

  return reviewContainer;
}

newReview = (id, formDiv, data) => {
  //build the review, per the server's specifications
  const review = {
    "restaurant_id": id,
    "name": data.user_name.value,
    "rating": parseInt(data.user_rating.value, 10),
    "comments": data.user_review.value
  };
  const posturl = 'https://mws-backend-server.herokuapp.com/reviews';

  // try to post the review to the server
  fetch(posturl, {
    method: 'POST',
    body: JSON.stringify(review)
  })
  .then(res => res.json())
  .then(
    // if response code is good - success! add new review to main db & reload reviews
    (res) => {
      console.log('Success! Your review has been received. Response: ', res);
      DBHelper.stashReview('online', res);
      updateFormDiv(formDiv);
    })
  // if fetch didn't work, store the new review in the temp db and reload reviews
  .catch(error => {
    console.error('Sorry, fetch failed! Storing review offline. Error code: ', error);
    DBHelper.stashReview('offline', review);  
    updateFormDiv(formDiv);
  })
}

updateFormDiv = (formDiv) => {
  formDiv.innerHTML = `
    <p> Thanks for adding your review! Reload the page to see your review live! </p>
    <button class='reloadBtn'><a href=" ${window.location.href} "> Reload now? </a></button>
  `
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

